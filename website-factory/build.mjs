import fs from 'node:fs/promises';
import path from 'node:path';
import { root, loadSite, generatePreview, publishIndex } from './factory.mjs';

for (const file of await fs.readdir(path.join(root, 'sites'))) {
  if (!file.endsWith('.json')) continue;
  const slug = file.slice(0, -5);
  const site = await loadSite(slug);
  const result = await generatePreview(site);
  console.log(result.code + ' ' + slug);
}
await publishIndex();
