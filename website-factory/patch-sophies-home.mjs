import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const slug = 'sophies-sports-massage';
const A = `/factory-assets/clients/${slug}`;
const outPath = path.join(root, 'public/preview', slug, 'index.html');
const bookAttrs = 'href="#contact"';
const bookSvg = `<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="2.2" y="3.2" width="11.6" height="10.6" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M2.2 6.4h11.6M5.2 2v2.6M10.8 2v2.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`;

const services = [
  {
    id: 'service-initial',
    name: 'Initial consultation',
    short: 'A thorough first visit to understand your history, movement and goals before treatment begins.',
    img: `${A}/service-treatment.png`,
    alt: 'Sophie performing a sports massage treatment.',
  },
  {
    id: 'service-continued',
    name: 'Continued treatment',
    short: 'Follow-up sessions that build on your plan — easing tension, restoring mobility and supporting recovery.',
    img: `${A}/physio-landing.png`,
    alt: "Illustrative treatment photograph. Not a photograph of Sophie's premises.",
  },
  {
    id: 'service-sports-massage',
    name: 'Sports massage',
    short: 'Targeted sports massage for athletes and active people who want to move freely and recover well.',
    img: `${A}/service-treatment.png`,
    alt: 'Sophie performing a sports massage treatment.',
  },
  {
    id: 'service-cupping',
    name: 'Cupping',
    short: 'Myofascial cupping to ease stubborn tension and encourage freer movement in tight areas.',
    img: `${A}/service-tile-2.png`,
    alt: "Illustrative treatment photograph. Not a photograph of Sophie's premises.",
  },
  {
    id: 'service-intro',
    name: 'Introductory offer',
    short: 'A welcoming first step into care — ask about the current introductory offer when you book.',
    img: `${A}/service-tile.png`,
    alt: "Illustrative treatment photograph. Not a photograph of Sophie's premises.",
  },
];

const serviceButtons = `<nav class="service-links" aria-label="Services">${services.map((s) => `<button type="button">${s.name}</button>`).join('')}</nav>`;
const serviceAccordion = `<div class="service-accordion">${services.map((s) => `<details name="listed-services"><summary>${s.name}</summary><div class="accordion-panel"><figure class="tile-media"><img src="${s.img}" alt="${s.alt}"></figure><p class="shot-copy"><span><strong>${s.name}</strong><em>${s.short}</em></span><a class="button" href="#${s.id}">More Information</a></p></div></details>`).join('')}<a class="button accordion-book" ${bookAttrs}>Book appointment</a></div>`;
const serviceShots = `<div class="shots">${services.map((s) => `<div class="shot"><figure class="tile-media"><img src="${s.img}" alt="${s.alt}"></figure><p class="shot-copy"><span><strong>${s.name}</strong><em>${s.short}</em></span><a class="button" href="#${s.id}">More Information</a></p></div>`).join('')}</div>`;

const reviews = `<div class="review-board" data-active="0"><div class="review-list" role="tablist" aria-label="Sample client notes"><button class="review-pick" type="button" role="tab" aria-selected="true"><strong>Client A</strong><span class="stars" aria-label="5 stars">★★★★★</span></button><button class="review-pick" type="button" role="tab" aria-selected="false"><strong>Client B</strong><span class="stars" aria-label="5 stars">★★★★★</span></button><button class="review-pick" type="button" role="tab" aria-selected="false"><strong>Client C</strong><span class="stars" aria-label="5 stars">★★★★★</span></button><button class="review-pick" type="button" role="tab" aria-selected="false"><strong>Client D</strong><span class="stars" aria-label="5 stars">★★★★★</span></button></div><div class="review-photos"><figure class="review-photo"><img src="${A}/service-treatment.png" alt="Sophie performing a sports massage treatment."></figure><figure class="review-photo" aria-hidden="true"><img src="${A}/review-shoulder.png" alt="Illustrative treatment photograph. Not a photograph of Sophie's premises."></figure><figure class="review-photo" aria-hidden="true"><img src="${A}/review-arm.png" alt="Illustrative treatment photograph. Not a photograph of Sophie's premises."></figure><figure class="review-photo" aria-hidden="true"><img src="${A}/physio-landing.png" alt="Illustrative treatment photograph. Not a photograph of Sophie's premises."></figure></div><div class="review-quotes"><article class="review-quote"><p class="flag">Demo layout note · Not a verified review</p><h3>Client A</h3><p class="review-stars"><span class="stars" aria-label="5 stars">★★★★★</span></p><p>Sophie took time to understand what was going on and the session left me moving more freely.</p></article><article class="review-quote" aria-hidden="true"><p class="flag">Demo layout note · Not a verified review</p><h3>Client B</h3><p class="review-stars"><span class="stars" aria-label="5 stars">★★★★★</span></p><p>Professional, calm and clearly skilled — the kind of therapist you trust straight away.</p></article><article class="review-quote" aria-hidden="true"><p class="flag">Demo layout note · Not a verified review</p><h3>Client C</h3><p class="review-stars"><span class="stars" aria-label="5 stars">★★★★★</span></p><p>Sports massage that actually addresses the problem, with a clear plan for what comes next.</p></article><article class="review-quote" aria-hidden="true"><p class="flag">Demo layout note · Not a verified review</p><h3>Client D</h3><p class="review-stars"><span class="stars" aria-label="5 stars">★★★★★</span></p><p>A welcoming, well run practice. I felt looked after from the first consultation.</p></article></div><div class="review-nav"><button class="meet-arrow review-prev" type="button" aria-label="Previous review"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3.2 5.2 8 10 12.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="meet-arrow review-next" type="button" aria-label="Next review"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3.2 10.8 8 6 12.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div>`;

const socialTile = (title, body) =>
  `<article class="post"><div class="post-art" aria-hidden="true"><span class="post-geo"></span><span class="post-geo post-geo-b"></span></div><div class="post-body"><p class="flag">Sophie's</p><h3>${title}</h3><p>${body}</p></div></article>`;
const socialSet = `<div class="social-set">${socialTile('Sports massage', 'Hands-on care for recovery and performance.')}${socialTile('Rehabilitation', 'Clear plans from first consultation onward.')}${socialTile('Cupping', 'Optional soft-tissue support where it fits.')}${socialTile('Book soon', 'Online booking link to be connected.')}${socialTile('Sample tiles', 'These tiles are not posts from a live account.')}</div>`;

const home = `<section id="home" class="page">
<svg class="guide-line" aria-hidden="true"></svg>
<div class="landing">
<div class="wrap hero-head">
<h1>Move better <span class="title-amp">&amp;</span> recover well<span class="title-skip"> with </span>Sophie<span class="title-stop"></span></h1>
<div class="hero-aside">
<p class="lede">Sports massage and rehabilitation with a calm, personal touch.<br>Care that feels considered from the first visit.</p>
<div class="hero-book">
<a class="button" ${bookAttrs}>Book appointment</a>
<svg class="title-nudge" viewBox="0 0 72 40" aria-hidden="true"><path class="nudge-shaft" d="M68 30C56 32 38 28 18 10"/><path class="nudge-head" d="M18 10 23 21M18 10 30 13"/></svg>
</div>
</div>
<svg class="title-arrow" aria-hidden="true"><path class="title-shaft" fill="none" stroke="#440621" stroke-width="1.9" stroke-linecap="round"/><path class="title-head" fill="none" stroke="#440621" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>
</div>
<div class="wrap hero-stage">
<figure class="hero-media"><img class="fit-facade" src="${A}/portrait-sophie.png" alt="Sophie, founder of Sophie's Sports Massage &amp; Rehabilitation."></figure>
<div class="hero-cards"><a class="hero-card" href="#service-initial"><span class="hero-face"><span class="mini" aria-hidden="true"></span><span class="hero-copy"><strong>Initial consultation</strong><em>First visit</em></span><span class="hero-go" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span></a><a class="hero-card" ${bookAttrs}><span class="hero-face"><span class="mini" aria-hidden="true"></span><span class="hero-copy"><strong>Book appointment</strong><em>Link coming soon</em></span><span class="hero-go" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span></a><a class="hero-card" href="#about"><span class="hero-face"><span class="mini" aria-hidden="true"></span><span class="hero-copy"><strong>Meet Sophie</strong><em>Your therapist</em></span><span class="hero-go" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span></a></div>
</div>
</div>
<section class="wrap statement promo-statement mist" aria-label="Visit prices">
<div class="promo-intro">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8.4 2.4h4.4v4.4L7.4 12.2 3.2 8 8.4 2.4z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="10.8" cy="4.8" r=".7" fill="currentColor"/></svg> Visits</p>
<h2>Care that starts clearly</h2>
<p><span class="promo-lede-full">Initial consultation, continued treatment, sports massage, cupping and an introductory offer for new clients.</span><span class="promo-lede-short">Consultation, treatment, sports massage and cupping.</span></p>
</div>
<div class="stat-board promo-offer-board" id="new-patient" data-stat="consult">
<div class="rails" role="tablist" aria-label="Visit prices">
<button class="rail rail-consult" type="button" role="tab" data-stat="consult" aria-pressed="true"><span class="rail-label">Initial consultation</span><span class="rail-price">First</span></button>
<button class="rail rail-whitening" type="button" role="tab" data-stat="whitening" aria-pressed="false"><span class="rail-label">Continued treatment</span><span class="rail-price">Ongoing</span></button>
<button class="rail rail-denplan" type="button" role="tab" data-stat="denplan" aria-pressed="false"><span class="rail-label">Introductory offer</span><span class="rail-price">New</span></button>
</div>
<div class="stat-stage">
<div class="stat-show show-whitening">
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
<figure class="offer-visual"><img src="${A}/physio-landing.png" alt="Illustrative treatment photograph. Not a photograph of Sophie's premises."></figure>
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
<figure class="offer-visual"><img src="${A}/service-treatment.png" alt="Sophie performing a sports massage treatment."></figure>
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
</div>
</section>
<section class="section">
<div class="wrap service-split" data-active="0">
<div class="service-side">
<p class="kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 4.2h10M3 8h10M3 11.8h6.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg> Services</p>
<h2>What we can help with.</h2>
<p class="lede">Initial consultation, continued treatment, sports massage, cupping and an introductory offer — care shaped around how you move.</p>
${serviceButtons}
${serviceAccordion}
</div>
${serviceShots}
</div>
</section>
<section class="section mist meet">
<div class="wrap">
<div class="meet-head">
<div>
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M8 1.1l1.05 3.35h3.5l-2.85 2.1 1.1 3.4L8 7.9l-2.8 2.05 1.1-3.4-2.85-2.1h3.5z"/></svg> Your therapist</p>
<h2>Meet Sophie</h2>
</div>
</div>
<div class="meet-stage"><article class="meet-slide is-on"><figure class="meet-photo"><img class="anchor-face" src="${A}/portrait-sophie.png" alt="Sophie, sports massage and rehabilitation therapist."></figure><div class="meet-card"><h3>Sophie</h3><p class="meet-role">Sports Massage &amp; Rehabilitation</p><p>Sophie runs a calm, personable practice focused on sports massage and rehabilitation. Expect a well put together welcome, clear communication and hands-on care shaped around how you move.</p><a class="button meet-book" ${bookAttrs}>${bookSvg} Book appointment</a></div></article></div>
</div>
</section>
<section class="section reviews">
<div class="wrap">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="2.1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 1.4v1.7M8 12.9v1.7M1.4 8h1.7M12.9 8h1.7M3.3 3.3l1.2 1.2M11.5 11.5l1.2 1.2M12.7 3.3l-1.2 1.2M4.5 11.5l-1.2 1.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Testimonials</p>
<h2>Patient reviews</h2>
<a class="button review-leave-link" ${bookAttrs}>Book appointment</a>
${reviews}
</div>
</section>
<section class="section book">
<div class="wrap book-grid">
<div class="book-copy">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="2.2" y="3.2" width="11.6" height="10.6" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2.2 6.4h11.6M5.2 2v2.6M10.8 2v2.6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Book</p>
<h2>Book your appointment</h2>
<p>Use the enquiry form below, or the Book buttons once the live booking link is connected. This preview does not send what you type.</p>
<div class="book-paths" aria-label="Ways to get in touch">
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
<div class="book-fields">
<form class="sheet" action="#contact" method="post" onsubmit="return false">
<label>First name<input name="first" autocomplete="given-name"></label>
<label>Last name<input name="last" autocomplete="family-name"></label>
<label>Email<input name="email" type="email" autocomplete="email"></label>
<label>Phone<input name="tel" type="tel" autocomplete="tel"></label>
<button class="book-submit" type="submit">Send enquiry</button>
</form>
</div>
</div>
<div class="book-side">
<figure class="book-portrait"><img src="${A}/portrait-sophie.png" alt="Sophie, sports massage and rehabilitation therapist."></figure>
<p class="hours-note">Appointments by arrangement. Exact hours confirmed when you book.</p>
<p class="hours-live" data-hours="Monday, 09:00–18:00, Tuesday, 09:00–18:00, Wednesday, 09:00–18:00, Thursday, 09:00–18:00, Friday, 09:00–17:00"><span class="hours-light" aria-hidden="true"></span><span class="hours-live-label"></span><span class="hours-live-tag">Live</span></p>
<ul class="hours-list">
<li><span>Monday</span><strong>By appointment</strong></li>
<li><span>Tuesday</span><strong>By appointment</strong></li>
<li><span>Wednesday</span><strong>By appointment</strong></li>
<li><span>Thursday</span><strong>By appointment</strong></li>
<li><span>Friday</span><strong>By appointment</strong></li>
<li><span>Saturday</span><strong>By appointment</strong></li>
<li><span>Sunday</span><strong>Closed</strong></li>
</ul>
<a class="button book-call" ${bookAttrs}>Book appointment</a>
</div>
</div>
</section>
<section class="section social">
<div class="wrap social-head">
<div>
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="5" cy="8" r="2.2" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="11" cy="4.5" r="1.7" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="11" cy="11.5" r="1.7" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M7 7.2 9.4 5.4M7.1 8.8l2.2 1.8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg> Social</p>
<h2>Recent posts</h2>
<p class="social-lede">Sample tiles for this layout. They are not posts from a live account.</p>
</div>
<button class="social-pause" type="button" aria-pressed="false">Pause</button>
</div>
<div class="social-marquee">
<div class="social-track">
${socialSet}
${socialSet.replace('<div class="social-set">', '<div class="social-set" aria-hidden="true">')}
</div>
</div>
</section>
</section>
`;

let html = fs.readFileSync(outPath, 'utf8');
const start = html.search(/<section id="home"(?=[\s>])/);
const end = html.search(/<section id="services"(?=[\s>])/);
if (start < 0 || end < 0) throw new Error('home/services bounds missing');
html = html.slice(0, start) + home + html.slice(end);

// FAQ light cleanup if Southam remnants remain
html = html.replace(/Arundel House[^.<\n]*/g, 'the clinic');
html = html.replace(/Illustrative treatment photograph\. Illustrative treatment photograph\./g, 'Illustrative treatment photograph.');

fs.writeFileSync(outPath, html);
const hash = crypto.createHash('sha256').update(html).digest('hex');
const statusPath = path.join(root, 'public/preview', slug, 'status.json');
const status = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
status.contentHash = hash;
status.updatedAt = new Date().toISOString().slice(0, 10);
fs.writeFileSync(statusPath, JSON.stringify(status, null, 2) + '\n');

const indexPath = path.join(root, 'public/preview/index.json');
if (fs.existsSync(indexPath)) {
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const entry = index.previews?.find((p) => p.slug === slug);
  if (entry) {
    entry.contentHash = hash;
    entry.updatedAt = new Date().toISOString();
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
  }
}

console.log(JSON.stringify({ ok: true, patched: 'home', contentHash: hash }, null, 2));
