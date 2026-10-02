import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

export const root = path.dirname(fileURLToPath(import.meta.url));
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const sectors = ['dental', 'physiotherapy', 'chiropractic', 'barber', 'veterinary', 'general'];
const fail = message => { throw new Error(message); };
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function catalogue() {
  return JSON.parse(await fs.readFile(path.join(root, 'catalogue.json'), 'utf8')).templates;
}
export function validateSite(site, templates, { allowDraft = false } = {}) {
  if (!slugPattern.test(site.slug || '')) fail('Invalid site slug');
  if (!sectors.includes(site.sector)) fail('Unknown sector');
  if (site.status !== 'concept' || typeof site.demo !== 'boolean') fail('Concept status and explicit demo flag required');
  if (!Array.isArray(site.sources)) fail('Sources must be a list');
  const ids = new Set();
  for (const source of site.sources) {
    if (!source.id || ids.has(source.id)) fail('Unique source IDs required');
    ids.add(source.id);
    if (!site.demo && (!/^https:\/\//.test(source.url || '') || !Number.isFinite(Date.parse(source.checkedAt)))) fail('Real sources need HTTPS URL and checkedAt');
  }
  function fact(field, required = false) {
    if (!field && !required) return;
    if (!field || typeof field.value !== 'string' || !field.value.trim() || !ids.has(field.sourceId)) fail('Business facts need a value and valid sourceId');
  }
  if (!site.business) fail('Business record required');
  fact(site.business.name, true); fact(site.business.location, true);
  for (const field of ['phone', 'address', 'website', 'hours']) fact(site.business[field]);
  if (site.business.website && !/^https:\/\//.test(site.business.website.value)) fail('Official website must use HTTPS');
  if (!Array.isArray(site.business.services)) fail('Services must be a list');
  site.business.services.forEach(value => fact(value, true));
  if (!site.copy || !site.copy.headline || !site.copy.introduction) fail('Editorial headline and introduction required');
  if (site.contentReviewed !== true) fail('Agent must review copy against sources and record contentReviewed');
  if (!Array.isArray(site.exampleSections)) fail('Example sections must be an explicit list');
  for (const item of site.exampleSections) if (!item.title || !item.body) fail('Example sections need title/body');
  if (!site.assets || !Array.isArray(site.assets.images)) fail('Asset record required');
  for (const asset of [site.assets.logo, ...site.assets.images].filter(Boolean)) {
    if (!/^\/factory-assets\/[a-zA-Z0-9/_-]+\.(png|jpe?g|webp|avif)$/i.test(asset.path || '')) fail('Use local raster assets under /factory-assets');
    if (!asset.alt || !asset.sourceUrl || !asset.rights) fail('Asset source, rights and alt text required');
    if (asset.rights === 'unknown') fail('Uncleared assets remain in research, not rendered output');
    if (!['owned', 'licensed', 'client-permission', 'official-logo-concept'].includes(asset.rights)) fail('Unknown asset rights category');
    if (asset.rights === 'official-logo-concept' && asset !== site.assets.logo) fail('Official logo exception applies only to the business logo');
  }
  const selected = templates.filter(t => t.id === site.template?.id && t.version === site.template?.version);
  if (selected.length !== 1) fail('Template ID/version missing or ambiguous');
  const template = selected[0];
  if (template.status !== 'approved' && !(allowDraft && site.demo)) fail('Real prospects require an approved template');
  if (!template.sectors.includes(site.sector)) fail('Template does not support this sector');
  if (!/^#[a-fA-F0-9]{6}$/.test(site.brand?.accent || '')) fail('Accent must be a six-digit hex colour');
  if (!/^templates\/[a-z0-9-]+\/\d+\.\d+\.\d+\/render\.mjs$/.test(template.entry)) fail('Invalid template entry');
  return template;
}
export async function renderSite(site, options = {}) {
  const template = validateSite(site, await catalogue(), options);
  const renderer = await import(pathToFileURL(path.join(root, template.entry)).href);
  return renderer.render(site, escapeHtml);
}
export async function loadSite(slug) {
  if (!slugPattern.test(slug)) fail('Invalid site slug');
  const site = JSON.parse(await fs.readFile(path.join(root, 'sites', slug + '.json'), 'utf8'));
  if (site.slug !== slug) fail('Filename and record slug differ');
  return site;
}
// CLI produces static HTML. Existing Next route serves the same renderer.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const slug = process.argv[2];
  const site = await loadSite(slug);
  const html = await renderSite(site, {allowDraft: site.demo});
  const output = path.resolve(root, '../public/preview', slug, 'index.html');
  await fs.mkdir(path.dirname(output), {recursive:true});
  await fs.writeFile(output, html);
  console.log(output);
}
