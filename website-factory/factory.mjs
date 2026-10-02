import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL, fileURLToPath } from 'node:url';

export const root = path.dirname(fileURLToPath(import.meta.url));
export const publicRoot = path.resolve(root, '../public');
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const sectors = ['dental', 'physiotherapy', 'chiropractic', 'barber', 'veterinary', 'general'];
const assetPattern = /^\/factory-assets\/clients\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-zA-Z0-9._-]+\.(png|jpe?g|webp|avif)$/i;
const rights = ['owned', 'licensed', 'client-permission', 'official-logo-concept'];
const forbiddenKeys = new Set(['email', 'emails', 'notes', 'privateNotes', 'contactResearch', 'salesScore', 'apiKey', 'token', 'password', 'credentials', 'secret']);
const fail = message => { throw new Error(message); };

export const sheetStatus = {
  PREVIEW_READY: 'Preview ready',
  ALREADY_BUILT: 'Preview ready',
  NEEDS_TEMPLATE_REVIEW: 'Needs template review',
  NEEDS_FRESH_APPROVAL: 'Needs fresh approval',
  RESEARCH_INCOMPLETE: 'Research incomplete',
  BUDGET_BLOCKED: 'Budget blocked',
  DUPLICATE: 'Already started',
  ERROR: 'Build failed',
  BUILDING: 'Building',
  DEPLOYED: 'Preview ready'
};

export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export async function catalogue() {
  return JSON.parse(await fs.readFile(path.join(root, 'catalogue.json'), 'utf8')).templates;
}

export async function instructionsVersion() {
  const integrationPath = path.join(root, 'integration.json');
  const [build, catalogueText, integrationText] = await Promise.all([
    fs.readFile(path.join(root, 'BUILD.md')),
    fs.readFile(path.join(root, 'catalogue.json')),
    fs.readFile(integrationPath, 'utf8')
  ]);
  const blanked = integrationText.replace(/"instructionsVersion"\s*:\s*"[^"]*"/, '"instructionsVersion":""');
  const hash = crypto.createHash('sha256').update(build).update(catalogueText).update(blanked);
  const templates = JSON.parse(catalogueText).templates;
  const files = ['factory.mjs','build.mjs','images/manifest.json',...templates.map(t=>t.entry)].sort();
  for (const file of files) hash.update(file).update(await fs.readFile(path.join(root,file)));
  return hash.digest('hex').slice(0, 16);
}

function rejectPrivateKeys(value) {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (forbiddenKeys.has(key)) fail('Private fields cannot be stored in a site record');
    rejectPrivateKeys(child);
  }
}

export function validateSite(site, templates, { allowDraft = false, instructionsVersion: requiredVersion } = {}) {
  rejectPrivateKeys(site);
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
  fact(site.business.name, true);
  fact(site.business.location, true);
  for (const field of ['phone', 'address', 'website', 'hours']) fact(site.business[field]);
  if (site.business.website && !/^https:\/\//.test(site.business.website.value)) fail('Official website must use HTTPS');
  if (!Array.isArray(site.business.services)) fail('Services must be a list');
  site.business.services.forEach(value => fact(value, true));
  if (!site.copy || !site.copy.headline || !site.copy.introduction) fail('Editorial headline and introduction required');
  if (site.contentReviewed !== true) fail('Agent must review copy against sources and record contentReviewed');
  if (!Array.isArray(site.exampleSections)) fail('Example sections must be an explicit list');
  for (const item of site.exampleSections) if (!item.title || !item.body) fail('Example sections need title/body');
  if (!site.assets || !Array.isArray(site.assets.images)) fail('Asset record required');
  const clientPrefix = `/factory-assets/clients/${site.slug}/`;
  for (const asset of [site.assets.logo, ...site.assets.images].filter(Boolean)) {
    if (asset.rights === 'unknown') fail('Uncleared assets remain in research, not rendered output');
    if (!assetPattern.test(asset.path || '') || !asset.path.startsWith(clientPrefix)) fail('Use local raster assets copied into this client folder');
    if (!asset.alt || !asset.sourceUrl || !asset.rights) fail('Asset source, rights and alt text required');
    if (!rights.includes(asset.rights)) fail('Unknown asset rights category');
    if (asset.rights === 'official-logo-concept' && asset !== site.assets.logo) fail('Official logo exception applies only to the business logo');
    if (asset !== site.assets.logo && asset.illustrative === false) fail('Category images stay labelled as illustrative');
  }
  const selected = templates.filter(t => t.id === site.template?.id && t.version === site.template?.version);
  if (selected.length !== 1) fail('Template ID/version missing or ambiguous');
  const template = selected[0];
  if (template.status !== 'approved' && !(allowDraft && site.demo)) fail('Real prospects require an approved template');
  if (!template.sectors.includes(site.sector)) fail('Template does not support this sector');
  if (!site.demo && site.approvedInstructionsVersion !== requiredVersion) fail('Needs fresh approval: approvedInstructionsVersion does not match current build instructions');
  if (!/^#[a-fA-F0-9]{6}$/.test(site.brand?.accent || '')) fail('Accent must be a six-digit hex colour');
  if (!/^templates\/[a-z0-9-]+\/\d+\.\d+\.\d+\/render\.mjs$/.test(template.entry)) fail('Invalid template entry');
  return template;
}

export function assessSite(site, templates, options = {}) {
  try {
    const template = validateSite(site, templates, options);
    return { ok: true, code: 'PREVIEW_READY', sheetStatus: sheetStatus.PREVIEW_READY, template, message: '' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Build failed';
    let code = 'ERROR';
    if (/approved template|does not support this sector|missing or ambiguous/.test(message)) code = 'NEEDS_TEMPLATE_REVIEW';
    else if (/fresh approval/.test(message)) code = 'NEEDS_FRESH_APPROVAL';
    else if (/sources need HTTPS|Business facts|contentReviewed|Official website|Sources must/.test(message)) code = 'RESEARCH_INCOMPLETE';
    return { ok: false, code, sheetStatus: sheetStatus[code], message };
  }
}

export function shouldLaunchBuild(job) {
  if (!job) return { launch: true, reason: '' };
  return { launch: false, reason: job.state || 'DUPLICATE', sheetStatus: sheetStatus.DUPLICATE };
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

function inside(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

export async function materialiseLibraryImages(site, manifestAssets, paths) {
  const selections = site.assets?.librarySelections || [];
  if (!Array.isArray(selections)) fail('Library selections must be a list');
  if (!selections.length) return site;
  const sourceRoot = paths?.sourceRoot || path.join(root, 'images');
  const clientDir = paths?.clientDir || path.join(publicRoot, 'factory-assets', 'clients', site.slug);
  const images = [...site.assets.images];
  for (const id of selections) {
    const entry = manifestAssets.find(asset => asset.id === id);
    if (!entry || entry.status !== 'approved') fail(`Image ${id} is not an approved library asset`);
    if (!['owned', 'licensed', 'client-permission'].includes(entry.rights)) fail('Uncleared assets remain in research, not rendered output');
    if (entry.illustrative === false) fail('Category images stay labelled as illustrative');
    if (entry.category !== site.sector && entry.category !== 'general') fail('Image category does not match the prospect sector');
    const relativeFile = (entry.file || '').slice('images/'.length);
    if (!/^images\/(dental|physiotherapy|chiropractic|barber|veterinary|general)\/[a-zA-Z0-9._-]+\.(png|jpe?g|webp|avif)$/.test(entry.file || '') || !relativeFile.startsWith(entry.category + '/')) fail('Library file must stay inside its category folder');
    const libraryFile = path.resolve(sourceRoot, relativeFile);
    if (!inside(sourceRoot, libraryFile)) fail('Library file must stay inside its category folder');
    const bytes = await fs.readFile(libraryFile);
    const destName = crypto.createHash('sha256').update(bytes).digest('hex').slice(0,16)+'-'+path.basename(libraryFile);
    const dest = path.join(clientDir, destName);
    await fs.mkdir(clientDir, { recursive: true });
    await fs.copyFile(libraryFile, dest);
    const publicPath = `/factory-assets/clients/${site.slug}/${destName}`;
    const image = {
        path: publicPath,
        alt: entry.alt,
        sourceUrl: entry.sourceUrl,
        rights: entry.rights,
        illustrative: true,
        libraryId: id
      };
    const previous = images.findIndex(image => image.libraryId === id);
    if (previous < 0) images.push(image); else images[previous] = image;
  }
  return { ...site, assets: { ...site.assets, images } };
}

export function statusDocument(site, assessment, version) {
  return {
    slug: site.slug,
    status: assessment.code,
    sheetStatus: assessment.sheetStatus,
    previewPath: `/preview/${site.slug}/index.html`,
    template: site.template ? { id: site.template.id, version: site.template.version } : null,
    instructionsVersion: version,
    contentHash: assessment.contentHash || null,
    demo: site.demo,
    message: assessment.message || '',
    updatedAt: new Date().toISOString()
  };
}

export async function writeJobResult(site, assessment, version, directories = {}) {
  const jobsDir = directories.jobsDir || path.join(root, 'jobs');
  const previewDir = directories.previewDir || path.join(publicRoot, 'preview', site.slug);
  const document = statusDocument(site, assessment, version);
  await fs.mkdir(jobsDir, { recursive: true });
  await fs.mkdir(previewDir, { recursive: true });
  const job = { ...document, state: assessment.code };
  await fs.writeFile(path.join(jobsDir, site.slug + '.json'), JSON.stringify(job, null, 2) + '\n');
  await fs.writeFile(path.join(previewDir, 'status.json'), JSON.stringify(document, null, 2) + '\n');
  return document;
}

export async function generatePreview(site, options = {}) {
  if (!slugPattern.test(site.slug || '')) fail('Invalid site slug');
  const version = options.instructionsVersion ?? await instructionsVersion();
  const outputFile = options.outputFile || path.join(publicRoot, 'preview', site.slug, 'index.html');
  const previewPath = `/preview/${site.slug}/index.html`;
  let prepared = site;
  let staged = null;
  const assetDestination = options.assetPaths?.clientDir || path.join(publicRoot, 'factory-assets', 'clients', site.slug);
  if (site.assets?.librarySelections?.length) {
    const manifest = options.manifestAssets || JSON.parse(await fs.readFile(path.join(root, 'images', 'manifest.json'), 'utf8')).assets;
    try {
      staged = await fs.mkdtemp(path.join(os.tmpdir(), 'parley-assets-'));
      prepared = await materialiseLibraryImages(site, manifest, { ...options.assetPaths, clientDir: staged });
    } catch (error) {
      const assessment = { ok: false, code: 'ERROR', sheetStatus: sheetStatus.ERROR, message: error instanceof Error ? error.message : 'Asset copy failed' };
      let existing = false;
      try { await fs.access(outputFile); existing = true; } catch { /* first attempt */ }
      if (!existing && !options.skipStatus) await writeJobResult(site, assessment, version, options.directories);
      if (staged) await fs.rm(staged, { recursive: true, force: true });
      return { ...assessment, previewPath };
    }
  }
  const assessment = assessSite(prepared, options.templates || await catalogue(), { allowDraft: prepared.demo, instructionsVersion: version });
  if (!assessment.ok) {
    let existing = false;
    try { await fs.access(outputFile); existing = true; } catch { /* first attempt */ }
    if (!existing && !options.skipStatus) await writeJobResult(prepared, assessment, version, options.directories);
    if (staged) await fs.rm(staged, { recursive: true, force: true });
    return { ...assessment, previewPath };
  }
  let html;
  try { html = await renderSite(prepared, { allowDraft: prepared.demo, instructionsVersion: version }); }
  catch (error) { if (staged) await fs.rm(staged, { recursive: true, force: true }); throw error; }
  assessment.contentHash = crypto.createHash('sha256').update(html).digest('hex');
  let previous = null;
  try { previous = await fs.readFile(outputFile, 'utf8'); } catch { /* first preview */ }
  if (previous !== html) {
    await fs.mkdir(path.dirname(outputFile), { recursive: true });
    await fs.writeFile(outputFile, html);
  }
  if (staged) {
    await fs.mkdir(assetDestination, { recursive: true });
    for (const file of await fs.readdir(staged)) await fs.copyFile(path.join(staged, file), path.join(assetDestination, file));
    await fs.rm(staged, { recursive: true, force: true });
  }
  // Successful validation refreshes metadata even when rendered HTML is identical.
  if (!options.skipStatus) await writeJobResult(prepared, assessment, version, options.directories);
  return { ...assessment, previewPath, html, message: previous && previous !== html ? 'Preview updated in place' : assessment.message };
}

export async function publishIndex() {
  const previewRoot = path.join(publicRoot, 'preview');
  const entries = [];
  let names = [];
  try { names = await fs.readdir(previewRoot); } catch { names = []; }
  for (const name of names) {
    const statusPath = path.join(previewRoot, name, 'status.json');
    try {
      entries.push(JSON.parse(await fs.readFile(statusPath, 'utf8')));
    } catch { /* a preview without status is listed by path only */ 
      try {
        await fs.access(path.join(previewRoot, name, 'index.html'));
        entries.push({ slug: name, status: 'PREVIEW_READY', previewPath: `/preview/${name}/index.html` });
      } catch { /* ignore other files */ }
    }
  }
  entries.sort((a, b) => a.slug.localeCompare(b.slug));
  await fs.mkdir(previewRoot, { recursive: true });
  await fs.writeFile(path.join(previewRoot, 'index.json'), JSON.stringify({ previews: entries }, null, 2) + '\n');
  return entries;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes('--version')) {
    console.log(await instructionsVersion());
  } else {
    const slug = args.find(arg => !arg.startsWith('--'));
    const site = await loadSite(slug);
    const result = await generatePreview(site);
    if (result.code === 'PREVIEW_READY') await publishIndex();
    const output = {
      code: result.code,
      sheetStatus: result.sheetStatus,
      previewPath: result.previewPath || `/preview/${slug}/index.html`,
      message: result.message || ''
    };
    console.log(JSON.stringify(output));
    if (!result.ok) process.exitCode = 2;
  }
}
