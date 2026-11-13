import fs from 'node:fs';
import crypto from 'node:crypto';

const htmlPath = 'public/preview/sophies-sports-massage/index.html';
const statusPath = 'public/preview/sophies-sports-massage/status.json';
const indexPath = 'public/preview/index.json';

let html = fs.readFileSync(htmlPath, 'utf8').replace(/\r\n/g, '\n');
fs.writeFileSync(htmlPath, html);

const hash = crypto.createHash('sha256').update(html).digest('hex');
const status = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
status.contentHash = hash;
status.updatedAt = new Date().toISOString().slice(0, 10);
fs.writeFileSync(statusPath, JSON.stringify(status, null, 2) + '\n');

const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const entry = index.previews?.find((p) => p.slug === 'sophies-sports-massage');
if (entry) {
  entry.contentHash = hash;
  entry.updatedAt = new Date().toISOString();
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
}

console.log(JSON.stringify({ ok: true, contentHash: hash, bytes: Buffer.byteLength(html) }, null, 2));
