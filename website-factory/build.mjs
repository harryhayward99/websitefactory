import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { root, publicRoot, loadSite, generatePreview, publishIndex } from './factory.mjs';

for (const file of await fs.readdir(path.join(root, 'sites'))) {
  if (!file.endsWith('.json')) continue;
  const slug = file.slice(0, -5);
  const site = await loadSite(slug);
  const dir = path.join(publicRoot, 'preview', slug);
  let status;
  try { status = JSON.parse(await fs.readFile(path.join(dir, 'status.json'), 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  // Deployment verifies existing snapshots. Regeneration is an explicit per-slug action.
  if (!status) {
    const result = await generatePreview(site);
    if (!result.ok) throw new Error(`${slug}: ${result.code}. Generate and inspect its result before deployment.`);
    console.log(result.code + ' ' + slug);
  } else if (status.status === 'PREVIEW_READY') {
    const html = await fs.readFile(path.join(dir, 'index.html'), 'utf8');
    const hash = crypto.createHash('sha256').update(html).digest('hex');
    if (status.slug !== slug || status.previewPath !== `/preview/${slug}/index.html` || status.contentHash !== hash) throw new Error(`${slug}: snapshot/status mismatch; explicitly regenerate this prospect.`);
    console.log('VERIFIED ' + slug);
  } else if (['NEEDS_TEMPLATE_REVIEW','NEEDS_FRESH_APPROVAL','RESEARCH_INCOMPLETE','BUDGET_BLOCKED','ERROR'].includes(status.status)) {
    console.log('BLOCKED ' + slug + ': ' + status.status);
  } else throw new Error(`${slug}: unknown factory status`);
}
await publishIndex();
