import fs from 'node:fs';
import crypto from 'node:crypto';

const outPath = 'public/preview/sophies-sports-massage/index.html';
let html = fs.readFileSync(outPath, 'utf8');

const faq = `<section id="faq" class="page faq-page">
<svg class="guide-line" aria-hidden="true"></svg>
<div class="wrap">
<div class="page-intro">
<div>
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="5.2" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M6.2 6.4c.35-1.1 1.2-1.7 2.2-1.7 1.15 0 2 .7 2 1.8 0 .85-.45 1.35-1.35 1.85-.7.4-.95.7-.95 1.35M8.05 11.7h.02" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> FAQ</p>
<h1>Questions, answered.</h1>
</div>
<p class="lede">A few practical notes about booking with Sophie and what to expect.</p>
</div>
<div class="faq-board">
<details class="faq-item" open>
<summary><span class="faq-num" aria-hidden="true">01</span><strong>What happens at the first visit?</strong><span class="faq-toggle" aria-hidden="true">+</span></summary>
<div class="faq-body">
<p>Your initial consultation is unhurried. Sophie listens to your history, assesses how you move, and explains a clear plan before treatment continues.</p>
</div>
</details>
<details class="faq-item">
<summary><span class="faq-num" aria-hidden="true">02</span><strong>What treatments do you offer?</strong><span class="faq-toggle" aria-hidden="true">+</span></summary>
<div class="faq-body">
<p>Initial consultation, continued treatment, sports massage, cupping where suitable, and an introductory offer for new clients.</p>
</div>
</details>
<details class="faq-item">
<summary><span class="faq-num" aria-hidden="true">03</span><strong>How do I book?</strong><span class="faq-toggle" aria-hidden="true">+</span></summary>
<div class="faq-body">
<p>Use the Book buttons or the enquiry form on this page. A live online booking link will be connected soon.</p>
</div>
</details>
<details class="faq-item">
<summary><span class="faq-num" aria-hidden="true">04</span><strong>Where are you based?</strong><span class="faq-toggle" aria-hidden="true">+</span></summary>
<div class="faq-body">
<p>Appointments are by arrangement. The exact address is confirmed when you book.</p>
</div>
</details>
<details class="faq-item">
<summary><span class="faq-num" aria-hidden="true">05</span><strong>When are you open?</strong><span class="faq-toggle" aria-hidden="true">+</span></summary>
<div class="faq-body">
<p>Hours are by appointment. Sophie will confirm a time that works when you get in touch.</p>
</div>
</details>
</div>
<div class="faq-cta">
<a class="button solid" href="#contact">Book online</a>
<a class="button" href="#contact">Contact</a>
</div>
</div>
</section>`;

const faqStart = html.search(/<section id="faq"(?=[\s>])/);
const faqEnd = html.search(/<\/main>/);
if (faqStart < 0 || faqEnd < 0) throw new Error('faq/main missing');
html = html.slice(0, faqStart) + faq + '\n' + html.slice(faqEnd);

html = html.replace(
  /<p class="footer-note">[\s\S]*?<\/p>/,
  `<p class="footer-note">Sports massage and rehabilitation with Sophie.<br>Clean, personable care shaped around how you move.</p>`
);

// Slightly lower face crop so more of Sophie shows in hero
html = html.replace(
  'object-position:center 12%;transform:none}',
  'object-position:center 22%;transform:none}'
);
html = html.replace(
  'object-position:center 12%}',
  'object-position:center 22%}'
);

fs.writeFileSync(outPath, html);
const hash = crypto.createHash('sha256').update(html).digest('hex');
const statusPath = 'public/preview/sophies-sports-massage/status.json';
const status = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
status.contentHash = hash;
status.updatedAt = new Date().toISOString().slice(0, 10);
fs.writeFileSync(statusPath, JSON.stringify(status, null, 2) + '\n');

const indexPath = 'public/preview/index.json';
if (fs.existsSync(indexPath)) {
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const entry = index.previews?.find((p) => p.slug === 'sophies-sports-massage');
  if (entry) {
    entry.contentHash = hash;
    entry.updatedAt = new Date().toISOString();
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
  }
}

console.log(JSON.stringify({ ok: true, contentHash: hash }, null, 2));
