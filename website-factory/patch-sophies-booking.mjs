import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = join(root, 'public/preview/sophies-sports-massage/index.html');
const statusPath = join(root, 'public/preview/sophies-sports-massage/status.json');

const booking = 'https://sites.leadconnectorhq.com/preview/iTagp3ueuCbHPBkWCMQD?notrack=true';
const attrs = `href="${booking}" target="_blank" rel="noopener noreferrer"`;

let html = readFileSync(htmlPath, 'utf8');

const replacers = [
  [/<a class="button" href="#contact">BOOK<\/a>/g, `<a class="button" ${attrs}>BOOK</a>`],
  [/<a class="button header-cta" href="#contact">BOOK<\/a>/g, `<a class="button header-cta" ${attrs}>BOOK</a>`],
  [/<a class="button" href="#contact">Book appointment<\/a>/g, `<a class="button" ${attrs}>Book appointment</a>`],
  [/<a class="button" href="#contact">Book<\/a>/g, `<a class="button" ${attrs}>Book</a>`],
  [/<a class="button" href="#contact">Book online<\/a>/g, `<a class="button" ${attrs}>Book online</a>`],
  [/<a class="button solid" href="#contact">Book appointment<\/a>/g, `<a class="button solid" ${attrs}>Book appointment</a>`],
  [/<a class="button solid" href="#contact">Book online<\/a>/g, `<a class="button solid" ${attrs}>Book online</a>`],
  [/<a class="button solid service-cta" href="#contact">Book appointment<\/a>/g, `<a class="button solid service-cta" ${attrs}>Book appointment</a>`],
  [/<a class="button solid fee-book" href="#contact">Book appointment<\/a>/g, `<a class="button solid fee-book" ${attrs}>Book appointment</a>`],
  [/<a class="button meet-book" href="#contact">/g, `<a class="button meet-book" ${attrs}>`],
  [/<a class="button review-leave-link" href="#contact">Book appointment<\/a>/g, `<a class="button review-leave-link" ${attrs}>Book appointment</a>`],
  [/<a class="button book-call" href="#contact">Book appointment<\/a>/g, `<a class="button book-call" ${attrs}>Book appointment</a>`],
  [/<a class="book-setter-ring has-word" href="#contact">/g, `<a class="book-setter-ring has-word" ${attrs}>`],
];

let replaced = 0;
for (const [re, out] of replacers) {
  const matches = html.match(re);
  if (matches) replaced += matches.length;
  html = html.replace(re, out);
}

writeFileSync(htmlPath, html);

const contentHash = createHash('sha256').update(html.replace(/\r\n/g, '\n')).digest('hex');
const status = JSON.parse(readFileSync(statusPath, 'utf8'));
status.contentHash = contentHash;
status.updatedAt = new Date().toISOString();
writeFileSync(statusPath, `${JSON.stringify(status, null, 2)}\n`);

console.log(JSON.stringify({
  ok: true,
  replaced,
  remainingHashContact: (html.match(/href="#contact"/g) || []).length,
  bookingLinks: (html.match(/leadconnectorhq\.com/g) || []).length,
  contentHash,
}, null, 2));
