import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = 'sophies-sports-massage';
const A = `/factory-assets/clients/${slug}`;
const srcHtml = path.join(root, 'public/preview/southam-chiropractic/index.html');
const outDir = path.join(root, 'public/preview', slug);

fs.mkdirSync(outDir, { recursive: true });

// Reform Kenilworth tokens
const accent = '#440621';
const pale = '#EBE6E8';
const pageBg = '#F5F4F4';
const textColor = '#440621';

// Booking URL pending — CTAs go to contact until a live link is supplied
const bookHref = '#contact';
const bookAttrs = `href="${bookHref}"`;
const bookSvg = `<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="2.2" y="3.2" width="11.6" height="10.6" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M2.2 6.4h11.6M5.2 2v2.6M10.8 2v2.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`;

const name = "Sophie's Sports Massage &amp; Rehabilitation";
const namePlain = "Sophie's Sports Massage & Rehabilitation";
const southamBook = 'https://api.leadconnectorhq.com/booking/parley-demo-clinic/bp/southam-chiropractic-demo';

const services = [
  {
    id: 'service-initial',
    num: '01',
    name: 'Initial consultation',
    short: 'A thorough first visit to understand your history, movement and goals before treatment begins.',
    long: 'Your first appointment is a calm, unhurried consultation. Sophie takes time to listen, assess how you move, and explain a clear plan so you know what to expect from continued care.',
    points: 'Case history · Hands-on assessment · Clear next steps',
    img: `${A}/service-treatment.png`,
    real: true,
  },
  {
    id: 'service-continued',
    num: '02',
    name: 'Continued treatment',
    short: 'Follow-up sessions that build on your plan — easing tension, restoring mobility and supporting recovery.',
    long: 'Continued treatment focuses on the areas that need the most care. Sessions are tailored as you progress, whether you are recovering from training, desk strain or an everyday ache.',
    points: 'Progressive care · Soft-tissue focus · Recovery support',
    img: `${A}/physio-landing.png`,
    real: false,
  },
  {
    id: 'service-sports-massage',
    num: '03',
    name: 'Sports massage',
    short: 'Targeted sports massage for athletes and active people who want to move freely and recover well.',
    long: 'Sports massage combines deeper soft-tissue work with careful pacing. It suits training loads, event prep and anyone who wants to stay active without carrying unnecessary tightness.',
    points: 'Performance support · Recovery · Injury-aware technique',
    img: `${A}/service-treatment.png`,
    real: true,
  },
  {
    id: 'service-cupping',
    num: '04',
    name: 'Cupping',
    short: 'Myofascial cupping to ease stubborn tension and encourage freer movement in tight areas.',
    long: 'Cupping can be included where it suits your presentation. Sophie uses it thoughtfully as part of a wider treatment, never as a one-size-fits-all add-on.',
    points: 'Soft-tissue release · Optional within treatment · Discussed first',
    img: `${A}/service-tile-2.png`,
    real: false,
  },
  {
    id: 'service-intro',
    num: '05',
    name: 'Introductory offer',
    short: 'A welcoming first step into care — ask about the current introductory offer when you book.',
    long: 'New clients are welcome to ask about the introductory offer when booking. It is designed to make starting with Sophie straightforward, with the same calm, professional care from the first visit.',
    points: 'New clients welcome · Details when you book · Same thoughtful care',
    img: `${A}/service-tile.png`,
    real: false,
  },
];

function imgAlt(real) {
  return real
    ? 'Sophie performing a sports massage treatment.'
    : "Illustrative treatment photograph. Not a photograph of Sophie's premises.";
}

/** Match a top-level page section by id up to the next sibling page section / footer / aside. */
function sectionBounds(html, id) {
  const startRe = new RegExp(`<section id="${id}"(?=[\\s>])`);
  const start = html.search(startRe);
  if (start < 0) throw new Error(`Section #${id} not found`);
  const after = html.slice(start + 1);
  const next = after.search(/<section id="|<footer\b|<aside class="book-setter"/);
  if (next < 0) throw new Error(`End of section #${id} not found`);
  const end = start + 1 + next;
  return { start, end, text: html.slice(start, end) };
}

function replaceSection(html, id, builder) {
  const { start, end } = sectionBounds(html, id);
  return html.slice(0, start) + builder() + html.slice(end);
}

function extractSection(html, id) {
  return sectionBounds(html, id).text;
}

let html = fs.readFileSync(srcHtml, 'utf8');

// --- Global safe swaps (no bare "Southam" word replace) ---
html = html
  .replaceAll('/factory-assets/clients/southam-chiropractic/', `${A}/`)
  .replaceAll(southamBook, bookHref)
  .replaceAll(' target="_blank" rel="noopener noreferrer"', '')
  .replaceAll('#1c8494', accent)
  .replaceAll('rgba(28,132,148,', 'rgba(68,6,33,')
  .replaceAll('stroke="#1c8494"', `stroke="${accent}"`)
  .replaceAll('Southam Chiropractic', name)
  .replaceAll('southam-chiropractic.co.uk', 'demos.parleysystems.com')
  .replaceAll('info@southam-chiropractic.co.uk', '')
  .replaceAll(
    'Not a photograph of Southam Chiropractic staff or premises.',
    "Illustrative treatment photograph. Not a photograph of Sophie's premises."
  )
  .replaceAll(
    `Not a photograph of ${name} staff or premises.`,
    "Illustrative treatment photograph. Not a photograph of Sophie's premises."
  );

// Fonts → Reform: Fraunces + Inter
html = html.replace(
  /href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+"/,
  'href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;1,14..32,400&family=Newsreader:opsz,wght@6..72,600&display=swap"'
);
html = html.replaceAll('Manrope,"Segoe UI",sans-serif', 'Inter,"Segoe UI",sans-serif');
html = html.replaceAll('font:500 14px/1 Manrope', 'font:500 14px/1 Inter');
html = html.replaceAll('font:500 15px/1 Manrope', 'font:500 15px/1 Inter');
html = html.replaceAll('font:600 13px/1 Manrope', 'font:600 13px/1 Inter');
html = html.replaceAll('font:600 16px/1.4 Manrope', 'font:600 16px/1.4 Inter');
html = html.replaceAll('font:500 20px/1.2 Manrope', 'font:500 20px/1.2 Inter');

html = html.replace(
  /:root\{color-scheme:light;--accent:[^}]+\}/,
  `:root{color-scheme:light;--accent:${accent};--on:#ffffff;--pale:${pale}}`
);
html = html.replace(
  /body\{margin:0;background:#fff;color:#333;font:16px\/1\.5 Inter/,
  `body{margin:0;background:${pageBg};color:${textColor};font:16px/1.55 Inter`
);
html = html.replace(
  /h1,h2,h3\{color:#000;font-weight:500;letter-spacing:-\.03em\}/,
  `h1,h2,h3{color:${textColor};font-weight:500;letter-spacing:-.03em}`
);
html = html.replace(
  '.hero-media,.wide-media,.side-media,.tile-media,.frame{margin:0;position:relative;overflow:hidden;border-radius:10px;background:var(--pale)}',
  '.hero-media,.wide-media,.side-media,.tile-media,.frame{margin:0;position:relative;overflow:hidden;border-radius:18px;background:var(--pale)}'
);
html = html.replace(
  '.hero-media img.fit-facade{left:25%;width:75%;right:auto;top:auto;bottom:0;height:100%;object-fit:cover;object-position:center bottom;transform:none}',
  '.hero-media img.fit-facade{left:18%;width:82%;right:auto;top:0;bottom:0;height:100%;object-fit:cover;object-position:center 12%;transform:none}'
);
html = html.replace(
  '  .hero-media img.fit-facade{left:0;width:100%;right:auto;top:auto;bottom:25%;height:100%;transform:none;object-fit:cover;object-position:center center}',
  '  .hero-media img.fit-facade{left:0;width:100%;right:auto;top:0;bottom:0;height:100%;transform:none;object-fit:cover;object-position:center 12%}'
);

html = html.replace(
  /<meta name="description" content="[^"]*">/,
  `<meta name="description" content="${namePlain} — sports massage, rehabilitation, cupping and thoughtful continued care. Clean, personable clinic concept by Parley Systems.">`
);
html = html.replace(
  /<title>[^<]*<\/title>/,
  `<title>${namePlain} | Sports Massage &amp; Rehabilitation</title>`
);
html = html.replace(
  /<meta name="robots" content="index,follow">/,
  '<meta name="robots" content="noindex,nofollow">'
);

// Service id hooks in CSS / menus (before section rebuilds)
html = html
  .replaceAll('service-back-pain', 'service-initial')
  .replaceAll('service-neck-pain', 'service-continued')
  .replaceAll('service-headaches', 'service-sports-massage')
  .replaceAll('service-sciatica', 'service-cupping')
  .replaceAll('service-joint-pain', 'service-intro');

// Header / banner
html = html.replace(
  /<p class="banner-contact">[\s\S]*?<\/p>/,
  `<p class="banner-contact"><span class="banner-address">By appointment</span><span class="banner-gap" aria-hidden="true">|</span><a ${bookAttrs}>Book online</a></p>`
);
html = html.replace(
  /<a class="brand" href="#home"><img class="logo"[^>]*><\/a>/,
  `<a class="brand" href="#home"><img class="logo" src="${A}/logo.jpg" alt="${namePlain}" width="220" height="72"></a>`
);
html = html.replace(
  /<div class="menu-panel">[\s\S]*?<\/div><\/li>\s*<li><a href="#about">/,
  `<div class="menu-panel">${services.map((s) => `<a href="#${s.id}">${s.name}</a>`).join('')}</div></li>
<li><a href="#about">`
);

// Contact details leftover from Southam
html = html.replaceAll('tel:01926298102', bookHref);
html = html.replaceAll('01926 298 102', 'Book online');
html = html.replaceAll('tel:07793503523', bookHref);
html = html.replaceAll('07793 503 523', 'Book online');
html = html.replaceAll('Arundel House, 50 Coventry Street, Southam, CV47 0EP', 'By appointment');
html = html.replaceAll('50 Coventry Street, CV47 0EP', 'By appointment');
html = html.replaceAll('50 Coventry Street, Southam, CV47 0EP', 'By appointment');
html = html.replaceAll('mailto:info@demos.parleysystems.com', bookHref);
html = html.replaceAll('info@demos.parleysystems.com', '');

// --- Rebuild HOME section ---
const homeSrc = extractSection(html, 'home');
let home = homeSrc;

home = home.replace(
  /<h1>[\s\S]*?<\/h1>/,
  `<h1>Move better <span class="title-amp">&amp;</span> recover well<span class="title-skip"> with </span>Sophie<span class="title-stop"></span></h1>`
);
home = home.replace(
  /<p class="lede">[\s\S]*?<\/p>/,
  '<p class="lede">Sports massage and rehabilitation with a calm, personal touch.<br>Care that feels considered from the first visit.</p>'
);
home = home.replace(
  /<figure class="hero-media">[\s\S]*?<\/figure>/,
  `<figure class="hero-media"><img class="fit-facade" src="${A}/portrait-sophie.png" alt="Sophie, founder of Sophie's Sports Massage &amp; Rehabilitation."></figure>`
);
home = home.replace(
  /<div class="hero-cards">[\s\S]*?<\/div>/,
  `<div class="hero-cards"><a class="hero-card" href="#service-initial"><span class="hero-face"><span class="mini" aria-hidden="true"></span><span class="hero-copy"><strong>Initial consultation</strong><em>First visit</em></span><span class="hero-go" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span></a><a class="hero-card" ${bookAttrs}><span class="hero-face"><span class="mini" aria-hidden="true"></span><span class="hero-copy"><strong>Book appointment</strong><em>Link coming soon</em></span><span class="hero-go" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span></a><a class="hero-card" href="#about"><span class="hero-face"><span class="mini" aria-hidden="true"></span><span class="hero-copy"><strong>Meet Sophie</strong><em>Your therapist</em></span><span class="hero-go" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span></a></div>`
);

home = home.replace(
  /<span class="promo-lede-full">[\s\S]*?<\/span><span class="promo-lede-short">[\s\S]*?<\/span>/,
  '<span class="promo-lede-full">Initial consultation, continued treatment, sports massage, cupping and an introductory offer for new clients.</span><span class="promo-lede-short">Consultation, treatment, sports massage and cupping.</span>'
);
home = home.replace(
  /<button class="rail rail-consult"[\s\S]*?<\/button>\s*<button class="rail rail-whitening"[\s\S]*?<\/button>\s*<button class="rail rail-denplan"[\s\S]*?<\/button>/,
  `<button class="rail rail-consult" type="button" role="tab" data-stat="consult" aria-pressed="true"><span class="rail-label">Initial consultation</span><span class="rail-price">First</span></button>
<button class="rail rail-whitening" type="button" role="tab" data-stat="whitening" aria-pressed="false"><span class="rail-label">Continued treatment</span><span class="rail-price">Ongoing</span></button>
<button class="rail rail-denplan" type="button" role="tab" data-stat="denplan" aria-pressed="false"><span class="rail-label">Introductory offer</span><span class="rail-price">New</span></button>`
);
home = home.replace(
  /<div class="stat-show show-whitening">[\s\S]*?<div class="stat-show show-consult">[\s\S]*?<div class="stat-show show-denplan">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  `<div class="stat-show show-whitening">
<div class="offer-copy">
<h3>Continued treatment</h3>
<p class="stat-num">Ongoing</p>
<ul>
<li>Builds on your first visit plan</li>
<li>Sports massage and soft-tissue care</li>
<li>Paced to your recovery</li>
</ul>
<a class="button" ${bookAttrs}>Book</a>
</div>
<div class="offer-side">
<figure class="offer-visual"><img src="${A}/physio-landing.png" alt="${imgAlt(false)}"></figure>
</div>
</div>
<div class="stat-show show-consult">
<div class="offer-copy">
<h3>Initial consultation</h3>
<p class="stat-num">First</p>
<ul>
<li>History and assessment</li>
<li>Clear treatment plan</li>
<li>Time to ask questions</li>
</ul>
<a class="button" ${bookAttrs}>Book</a>
</div>
<div class="offer-side">
<figure class="offer-visual"><img src="${A}/service-treatment.png" alt="${imgAlt(true)}"></figure>
</div>
</div>
<div class="stat-show show-denplan">
<div class="offer-copy">
<h3>Introductory offer</h3>
<p class="stat-num">New</p>
<ul>
<li>Welcoming first step into care</li>
<li>Ask for details when you book</li>
<li>Same thoughtful, personal treatment</li>
</ul>
<a class="button" ${bookAttrs}>Book</a>
</div>
<div class="offer-side">
<figure class="offer-visual"><img src="${A}/portrait-sophie.png" alt="Sophie, sports massage and rehabilitation therapist."></figure>
</div>
</div>
</div>
</div>`
);

// Services list on home
const serviceButtons = `<nav class="service-links" aria-label="Services">${services
  .map((s) => `<button type="button">${s.name}</button>`)
  .join('')}</nav>`;
const serviceAccordion = `<div class="service-accordion">${services
  .map(
    (s) =>
      `<details name="listed-services"><summary>${s.name}</summary><div class="accordion-panel"><figure class="tile-media"><img src="${s.img}" alt="${imgAlt(s.real)}"></figure><p class="shot-copy"><span><strong>${s.name}</strong><em>${s.short}</em></span><a class="button" href="#${s.id}">More Information</a></p></div></details>`
  )
  .join('')}<a class="button accordion-book" ${bookAttrs}>Book appointment</a></div>`;
const serviceShots = `<div class="shots">${services
  .map(
    (s) =>
      `<div class="shot"><figure class="tile-media"><img src="${s.img}" alt="${imgAlt(s.real)}"></figure><p class="shot-copy"><span><strong>${s.name}</strong><em>${s.short}</em></span><a class="button" href="#${s.id}">More Information</a></p></div>`
  )
  .join('')}</div>`;

home = home.replace(
  /<p class="lede">[\s\S]*?condition[\s\S]*?<\/p>|<p class="lede">[\s\S]*?Back pain[\s\S]*?<\/p>/,
  '<p class="lede">Initial consultation, continued treatment, sports massage, cupping and an introductory offer — care shaped around how you move.</p>'
);
home = home.replace(
  /<nav class="service-links"[\s\S]*?<div class="shots">[\s\S]*?<\/div>/,
  `${serviceButtons}\n${serviceAccordion}\n${serviceShots}`
);

home = home.replace(/<h2>Meet the specialists<\/h2>/, '<h2>Meet Sophie</h2>');
home = home.replace(/Our specialists/g, 'Your therapist');
home = home.replace(
  /<div class="meet-nav">[\s\S]*?<\/div>\s*(?=<div class="meet-stage">)/,
  ''
);
home = home.replace(
  /<div class="meet-stage">[\s\S]*?<\/div>/,
  `<div class="meet-stage"><article class="meet-slide is-on"><figure class="meet-photo"><img class="anchor-face" src="${A}/portrait-sophie.png" alt="Sophie, sports massage and rehabilitation therapist."></figure><div class="meet-card"><h3>Sophie</h3><p class="meet-role">Sports Massage &amp; Rehabilitation</p><p>Sophie runs a calm, personable practice focused on sports massage and rehabilitation. Expect a well put together welcome, clear communication and hands-on care shaped around how you move.</p><a class="button meet-book" ${bookAttrs}>${bookSvg} Book appointment</a></div></article></div>`
);

home = home.replace(
  /<a class="button review-leave-link"[^>]*>[\s\S]*?<\/a>/,
  `<a class="button review-leave-link" ${bookAttrs}>Book appointment</a>`
);
home = home.replace(
  /<div class="review-board"[\s\S]*?<\/div><\/div>/,
  `<div class="review-board" data-active="0"><div class="review-list" role="tablist" aria-label="Sample client notes"><button class="review-pick" type="button" role="tab" aria-selected="true"><strong>Client A</strong><span class="stars" aria-label="5 stars">★★★★★</span></button><button class="review-pick" type="button" role="tab" aria-selected="false"><strong>Client B</strong><span class="stars" aria-label="5 stars">★★★★★</span></button><button class="review-pick" type="button" role="tab" aria-selected="false"><strong>Client C</strong><span class="stars" aria-label="5 stars">★★★★★</span></button><button class="review-pick" type="button" role="tab" aria-selected="false"><strong>Client D</strong><span class="stars" aria-label="5 stars">★★★★★</span></button></div><div class="review-photos"><figure class="review-photo"><img src="${A}/service-treatment.png" alt="${imgAlt(true)}"></figure><figure class="review-photo" aria-hidden="true"><img src="${A}/review-shoulder.png" alt="${imgAlt(false)}"></figure><figure class="review-photo" aria-hidden="true"><img src="${A}/review-arm.png" alt="${imgAlt(false)}"></figure><figure class="review-photo" aria-hidden="true"><img src="${A}/physio-landing.png" alt="${imgAlt(false)}"></figure></div><div class="review-quotes"><article class="review-quote"><p class="flag">Demo layout note · Not a verified review</p><h3>Client A</h3><p class="review-stars"><span class="stars" aria-label="5 stars">★★★★★</span></p><p>Sophie took time to understand what was going on and the session left me moving more freely.</p></article><article class="review-quote" aria-hidden="true"><p class="flag">Demo layout note · Not a verified review</p><h3>Client B</h3><p class="review-stars"><span class="stars" aria-label="5 stars">★★★★★</span></p><p>Professional, calm and clearly skilled — the kind of therapist you trust straight away.</p></article><article class="review-quote" aria-hidden="true"><p class="flag">Demo layout note · Not a verified review</p><h3>Client C</h3><p class="review-stars"><span class="stars" aria-label="5 stars">★★★★★</span></p><p>Sports massage that actually addresses the problem, with a clear plan for what comes next.</p></article><article class="review-quote" aria-hidden="true"><p class="flag">Demo layout note · Not a verified review</p><h3>Client D</h3><p class="review-stars"><span class="stars" aria-label="5 stars">★★★★★</span></p><p>A welcoming, well run practice. I felt looked after from the first consultation.</p></article></div><div class="review-nav"><button class="meet-arrow review-prev" type="button" aria-label="Previous review"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3.2 5.2 8 10 12.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="meet-arrow review-next" type="button" aria-label="Next review"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3.2 10.8 8 6 12.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div>`
);

home = home.replace(
  /Use this form[\s\S]*?This preview does not send what you type\.|Call[\s\S]*?This preview does not send what you type\./,
  'Use the enquiry form below, or the Book buttons once the live booking link is connected. This preview does not send what you type.'
);
home = home.replace(
  /<div class="book-paths" aria-label="Ways to get in touch">[\s\S]*?<\/div>\s*<div class="book-fields">/,
  `<div class="book-paths" aria-label="Ways to get in touch">
<div class="book-path is-primary">
<strong>Book online</strong>
<p>Booking link coming soon — for now, send an enquiry and Sophie will be in touch.</p>
<a class="button" ${bookAttrs}>Book appointment</a>
</div>
<div class="book-path">
<strong>Send an enquiry</strong>
<p>Share your name and preferred time — this preview does not submit.</p>
<a class="button" href="#contact">Contact</a>
</div>
</div>
<div class="book-fields">`
);
home = home.replace(
  /<p class="hours-note">[\s\S]*?<\/p>\s*<p class="hours-live" data-hours="[^"]*">/,
  `<p class="hours-note">Appointments by arrangement. Exact hours confirmed when you book.</p>
<p class="hours-live" data-hours="Monday, 09:00–18:00, Tuesday, 09:00–18:00, Wednesday, 09:00–18:00, Thursday, 09:00–18:00, Friday, 09:00–17:00">`
);
home = home.replace(
  /<ul class="hours-list">[\s\S]*?<\/ul>\s*<a class="button book-call"[^>]*>[\s\S]*?<\/a>/,
  `<ul class="hours-list">
<li><span>Monday</span><strong>By appointment</strong></li>
<li><span>Tuesday</span><strong>By appointment</strong></li>
<li><span>Wednesday</span><strong>By appointment</strong></li>
<li><span>Thursday</span><strong>By appointment</strong></li>
<li><span>Friday</span><strong>By appointment</strong></li>
<li><span>Saturday</span><strong>By appointment</strong></li>
<li><span>Sunday</span><strong>Closed</strong></li>
</ul>
<a class="button book-call" ${bookAttrs}>Book appointment</a>`
);
home = home.replace(/src="[^"]*book-portrait\.png"/g, `src="${A}/portrait-sophie.png"`);
home = home.replace(/Adam Timson|Alun[^\s<]*/g, 'Sophie');
home = home.replace(/portrait-a\.png|portrait-b\.png/g, 'portrait-sophie.png');
home = home.replace(/Chiropractor/g, 'Therapist');
home = home.replace(/chiropractor/g, 'therapist');

html = replaceSection(html, 'home', () => home);

// --- Services summary ---
html = replaceSection(html, 'services', () => {
  const offerItems = services
    .map(
      (s, i) =>
        `<div class="offer-item"><details class="offer-fold" name="listed-offers"${i === 0 ? ' open' : ''}><summary class="offer-pick"><span>${s.num}</span>${s.name}</summary><article class="offer-panel"><span class="offer-shape offer-local" aria-hidden="true"></span><span class="offer-shape offer-shape-b offer-local" aria-hidden="true"></span><h2>${s.name}</h2><p>${s.short}</p><a class="button solid" href="#${s.id}">More Information</a></article></details></div>`
    )
    .join('');
  return `<section id="services" class="page services-page">
<svg class="guide-line" aria-hidden="true"></svg>
<div class="wrap page-intro services-intro">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.2 4.2h9.6M3.2 8h9.6M3.2 11.8h6.4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg> Services</p>
<h1>What we can help with.</h1>
<p class="lede">Initial consultation, continued treatment, sports massage, cupping and an introductory offer — personal care with Sophie.</p>
</div>
<div class="wrap offer-board"><div class="offer-list">${offerItems}</div><div class="offer-stage" aria-hidden="true"><span class="offer-shape"></span><span class="offer-shape offer-shape-b"></span></div></div>
</section>`;
});

// --- Individual service pages (replace all five Southam service sections as a block) ---
html = html.replace(
  /<section id="service-initial" class="page service-page"[\s\S]*?(?=<section id="about")/,
  services
    .map((s) => {
      return `<section id="${s.id}" class="page service-page" data-shape="0"><div class="service-sheet"><a class="service-back" href="#services"><span class="service-back-mark" aria-hidden="true">←</span> Services</a><div class="service-poster"><div class="service-stamp" aria-hidden="true"><span class="service-num">${s.num}</span><span class="service-blob"></span></div><div class="service-copy"><p class="flag">${name}</p><h1>${s.name}</h1><p class="service-lead">${s.long}</p><p class="service-lead">${s.points}</p><a class="button solid service-cta" ${bookAttrs}>Book appointment</a></div><figure class="service-visual"><img src="${s.img}" alt="${imgAlt(s.real)}"></figure></div></div></section>\n`;
    })
    .join('')
);

// --- About ---
html = replaceSection(html, 'about', () => `<section id="about" class="page team-page">
<svg class="guide-line" aria-hidden="true"></svg>
<div class="wrap about-summary">
<div class="about-copy">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M2.8 13.4V6.4L8 3.2l5.2 3.2v7" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M6.4 13.4V9h3.2v4.4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg> About</p>
<h1>${name}</h1>
<div class="about-pair">
<div class="about-lead"><p class="lede">${name} is a clean, personable practice run by Sophie — focused on sports massage, rehabilitation and helping people feel confident in how they move.</p><p class="lede">From the first consultation through continued treatment, cupping and sports massage, care stays calm, organised and tailored.</p></div>
<figure class="about-photo"><img src="${A}/portrait-sophie.png" alt="Sophie, founder of Sophie's Sports Massage &amp; Rehabilitation."><figcaption class="flag">Meet Sophie</figcaption></figure>
</div>
<a class="about-next" href="#meet-team"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.2 6.1 8 10.6l4.8-4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Get to know Sophie</span></a>
</div>
<p class="meet-kicker about-team" id="meet-team"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="5.4" cy="5.1" r="1.55" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="10.6" cy="5.1" r="1.55" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2.4 12.4c.35-1.7 1.5-2.6 3-2.6s2.65.9 3 2.6M7.6 12.4c.35-1.7 1.5-2.6 3-2.6s2.65.9 3 2.6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Meet Sophie</p>
</div>
<div class="wrap team-board" data-person="0"><div class="team-rail" aria-hidden="true"><span class="team-fall"></span></div><div class="people"><article class="person is-current"><figure class="thumb"><img class="anchor-face" src="${A}/portrait-sophie.png" alt="Sophie, sports massage and rehabilitation therapist."></figure><div class="person-card"><h2>Sophie</h2><p class="role">Founder · Sports Massage &amp; Rehabilitation</p><p>Sophie is the face of the practice — approachable, organised and focused on helping people feel stronger and move with more ease. Treatments are personal: from first consultation through continued care, sports massage and cupping where it fits.</p></div></article></div></div>
</section>`);

// --- Contact ---
html = replaceSection(html, 'contact', () => `<section id="contact" class="page">
<svg class="guide-line" aria-hidden="true"></svg>
<div class="wrap page-intro">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4.4 2.6h2l.9 2.2-1.2.9a7.4 7.4 0 0 0 3.2 3.2l.9-1.2 2.2.9v2a1.1 1.1 0 0 1-1.2 1.1A8.8 8.8 0 0 1 3.3 3.8a1.1 1.1 0 0 1 1.1-1.2z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg> Contact</p>
<h1>${name}.</h1>
<div class="contact-book">
<div>
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="2.2" y="3.2" width="11.6" height="10.6" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2.2 6.4h11.6M5.2 2v2.6M10.8 2v2.6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Appointments</p>
<h2>Book with Sophie</h2>
<p>Online booking will be linked here. Until then, use the enquiry form and Sophie will confirm your appointment.</p>
</div>
<div class="contact-book-actions">
<a class="button solid" ${bookAttrs}>Book appointment</a>
<a class="button" href="#home">Back to home</a>
</div>
</div>
<div class="info-grid">
<article class="info-card"><h2>Booking</h2><p>Online booking link coming soon. Use the enquiry form for now.</p></article>
<article class="info-card"><h2>Location</h2><p>By appointment — address confirmed when you book.</p></article>
<article class="info-card"><h2>Hours</h2><ul class="hours-list">
<li><span>Monday–Friday</span><strong>By appointment</strong></li>
<li><span>Saturday</span><strong>By appointment</strong></li>
<li><span>Sunday</span><strong>Closed</strong></li>
</ul></article>
<article class="info-card"><h2>About</h2><p>A clean, personable sports massage and rehabilitation practice run by Sophie.</p></article>
</div>
<div class="split">
<form class="sheet" action="#contact" method="post" onsubmit="return false">
<h2>Send an enquiry</h2>
<p>Share a little about what you need. This preview does not send the message.</p>
<label>Name<input name="name" autocomplete="name"></label>
<label>Phone<input name="tel" type="tel" autocomplete="tel"></label>
<label>Message<textarea name="message"></textarea></label>
<button class="book-submit" type="submit">Send enquiry</button>
</form>
<div class="map-pending" style="display:grid;place-items:center;min-height:280px;border-radius:18px;background:var(--pale);color:var(--accent);padding:24px;text-align:center"><p>Location map will appear once the clinic address is confirmed.</p></div>
</div>
</div>
</section>`);

// --- Reviews page ---
html = replaceSection(html, 'reviews', () => `<section id="reviews" class="page">
<svg class="guide-line" aria-hidden="true"></svg>
<div class="wrap page-intro">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 2.4 9.7 6l3.9.3-3 2.7.9 3.8L8 10.8 4.5 12.8l.9-3.8-3-2.7L6.3 6z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg> Reviews</p>
<h1>What clients say.</h1>
<p class="lede">Sample layout notes for this Parley demo. Verified reviews can replace these once published.</p>
<a class="button solid" ${bookAttrs}>Book appointment</a>
</div>
<div class="wrap">
<div class="review-board" data-active="0"><div class="review-list" role="tablist" aria-label="Sample client notes"><button class="review-pick" type="button" role="tab" aria-selected="true"><strong>Client A</strong><span class="stars" aria-label="5 stars">★★★★★</span></button><button class="review-pick" type="button" role="tab" aria-selected="false"><strong>Client B</strong><span class="stars" aria-label="5 stars">★★★★★</span></button><button class="review-pick" type="button" role="tab" aria-selected="false"><strong>Client C</strong><span class="stars" aria-label="5 stars">★★★★★</span></button><button class="review-pick" type="button" role="tab" aria-selected="false"><strong>Client D</strong><span class="stars" aria-label="5 stars">★★★★★</span></button></div><div class="review-photos"><figure class="review-photo"><img src="${A}/service-treatment.png" alt="${imgAlt(true)}"></figure><figure class="review-photo" aria-hidden="true"><img src="${A}/review-shoulder.png" alt="${imgAlt(false)}"></figure><figure class="review-photo" aria-hidden="true"><img src="${A}/review-arm.png" alt="${imgAlt(false)}"></figure><figure class="review-photo" aria-hidden="true"><img src="${A}/physio-landing.png" alt="${imgAlt(false)}"></figure></div><div class="review-quotes"><article class="review-quote"><p class="flag">Demo layout note · Not a verified review</p><h3>Client A</h3><p class="review-stars"><span class="stars" aria-label="5 stars">★★★★★</span></p><p>Sophie took time to understand what was going on and the session left me moving more freely.</p></article><article class="review-quote" aria-hidden="true"><p class="flag">Demo layout note · Not a verified review</p><h3>Client B</h3><p class="review-stars"><span class="stars" aria-label="5 stars">★★★★★</span></p><p>Professional, calm and clearly skilled — the kind of therapist you trust straight away.</p></article><article class="review-quote" aria-hidden="true"><p class="flag">Demo layout note · Not a verified review</p><h3>Client C</h3><p class="review-stars"><span class="stars" aria-label="5 stars">★★★★★</span></p><p>Sports massage that actually addresses the problem, with a clear plan for what comes next.</p></article><article class="review-quote" aria-hidden="true"><p class="flag">Demo layout note · Not a verified review</p><h3>Client D</h3><p class="review-stars"><span class="stars" aria-label="5 stars">★★★★★</span></p><p>A welcoming, well run practice. I felt looked after from the first consultation.</p></article></div><div class="review-nav"><button class="meet-arrow review-prev" type="button" aria-label="Previous review"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3.2 5.2 8 10 12.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="meet-arrow review-next" type="button" aria-label="Next review"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3.2 10.8 8 6 12.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div>
</div>
</section>`);

// --- Prices ---
html = replaceSection(html, 'prices', () => `<section id="prices" class="page prices-page">
<svg class="guide-line" aria-hidden="true"></svg>
<div class="wrap page-intro">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8.4 2.4h4.4v4.4L7.4 12.2 3.2 8 8.4 2.4z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="10.8" cy="4.8" r=".7" fill="currentColor"/></svg> Prices</p>
<h1>Visit prices.</h1>
<p class="flag">Fees confirmed when you book</p>
<p class="lede">Visit types are listed below. Exact amounts will be confirmed with Sophie — this demo does not invent a price list.</p>
<div class="fee-pair"><article class="fee-card"><span class="fee-gem"><strong>First</strong></span><span class="fee-gem fee-gem-sm" aria-hidden="true"></span><h2>Initial consultation</h2><p class="fee-k">Assessment &amp; plan</p><ul class="fee-includes"><li>History and assessment</li><li>Clear next steps</li><li>Ask about the introductory offer</li></ul><a class="button solid fee-book" ${bookAttrs}>Book appointment</a></article><article class="fee-card"><span class="fee-gem"><strong>Care</strong></span><span class="fee-gem fee-gem-sm" aria-hidden="true"></span><h2>Treatment &amp; sports massage</h2><p class="fee-k">Continued care</p><ul class="fee-includes"><li>Continued treatment</li><li>Sports massage</li><li>Cupping where suitable</li></ul><a class="button solid fee-book" ${bookAttrs}>Book appointment</a></article></div>
</div>
</section>`);

// FAQ light cleanup inside remaining section
html = html.replace(/chiropractor/gi, 'therapist');
html = html.replace(/chiropractic/gi, 'sports massage');
html = html.replace(/Chiropractic/g, 'Sports massage');
html = html.replace(/Adam Timson|Alun[^\s<]*/g, 'Sophie');
html = html.replace(/portrait-a\.png|portrait-b\.png|chiro-landing\.jpg|chiro-landing\.png/g, 'portrait-sophie.png');
html = html.replace(/Getting you comfortable\./g, 'Sports massage and rehabilitation with Sophie.');
html = html.replace(/src="[^"]*\/logo\.png"/g, `src="${A}/logo.jpg"`);
html = html.replace(/src="[^"]*\/logo\.svg"/g, `src="${A}/logo.jpg"`);

// Remaining Southam place names in FAQ / footer copy
html = html.replace(/Southam(?! )/g, 'the clinic');
html = html.replace(/ in Southam/g, '');
html = html.replace(/CV47 0EP/g, '');
html = html.replace(/Coventry Street/g, '');

const outPath = path.join(outDir, 'index.html');
fs.writeFileSync(outPath, html);

const hash = crypto.createHash('sha256').update(html).digest('hex');
const status = {
  slug,
  status: 'PREVIEW_READY',
  previewPath: `/preview/${slug}/index.html`,
  contentHash: hash,
  demo: true,
  instructionsVersion: 'manual-adaptation',
  updatedAt: new Date().toISOString().slice(0, 10),
};
fs.writeFileSync(path.join(outDir, 'status.json'), JSON.stringify(status, null, 2) + '\n');

const site = {
  slug,
  sector: 'massage',
  status: 'concept',
  demo: true,
  approvedInstructionsVersion: 'manual-adaptation',
  template: { id: 'care-modern', version: '1.0.0' },
  brand: {
    accent,
    logo: `${A}/logo.jpg`,
  },
  sources: [
    {
      id: 'design-inspiration',
      url: 'https://reformchirokenilworth.com/',
      checkedAt: '2026-11-13',
    },
  ],
  business: {
    name: { value: namePlain, sourceId: 'design-inspiration' },
    location: { value: 'By appointment', sourceId: 'design-inspiration' },
    hours: {
      value: 'By appointment. Exact hours confirmed when booking.',
      sourceId: 'design-inspiration',
    },
  },
  notes:
    "Manual adaptation of public/preview/southam-chiropractic/. Do not regenerate this slug. Design inspiration from Reform Kenilworth (Fraunces + Inter, accent #440621, pale #EBE6E8, page #F5F4F4). Supplied Sophie portrait, treatment photo and logo. Services: initial consultation, continued treatment, sports massage, cupping, introductory offer. BOOK CTAs currently point to #contact until a live booking URL is supplied. Address/phone not verified — marked by appointment. Demo: true for Parley Systems showcase.",
};
fs.writeFileSync(
  path.join(root, 'website-factory/sites', `${slug}.json`),
  JSON.stringify(site, null, 2) + '\n'
);

const indexPath = path.join(root, 'public/preview/index.json');
if (fs.existsSync(indexPath)) {
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const entry = {
    slug,
    status: 'PREVIEW_READY',
    sheetStatus: 'Preview ready',
    previewPath: `/preview/${slug}/index.html`,
    template: { id: 'care-modern', version: '1.0.0' },
    instructionsVersion: 'manual-adaptation',
    contentHash: hash,
    demo: true,
    message: '',
    updatedAt: new Date().toISOString(),
  };
  const list = Array.isArray(index.previews) ? index.previews : [];
  const i = list.findIndex((p) => p.slug === slug);
  if (i >= 0) list[i] = entry;
  else list.push(entry);
  list.sort((a, b) => a.slug.localeCompare(b.slug));
  index.previews = list;
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
}

console.log(JSON.stringify({ ok: true, slug, previewPath: status.previewPath, contentHash: hash }, null, 2));
