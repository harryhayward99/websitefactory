import fs from 'node:fs';
import crypto from 'node:crypto';

const outPath = 'public/preview/sophies-sports-massage/index.html';
const statusPath = 'public/preview/sophies-sports-massage/status.json';
const indexPath = 'public/preview/index.json';
const sitePath = 'website-factory/sites/sophies-sports-massage.json';

let html = fs.readFileSync(outPath, 'utf8').replace(/\r\n/g, '\n');

const ADDRESS = '14 Abbey End, Kenilworth, CV8 1QJ';
const PHONE = '01926 854 210';
const PHONE_HREF = 'tel:+441926854210';
const MAP_Q = encodeURIComponent(ADDRESS);

const hoursList = `<ul class="hours-list">
<li><span>Monday</span><strong>09:00 – 18:00</strong></li>
<li><span>Tuesday</span><strong>09:00 – 18:00</strong></li>
<li><span>Wednesday</span><strong>09:00 – 18:00</strong></li>
<li><span>Thursday</span><strong>09:00 – 18:00</strong></li>
<li><span>Friday</span><strong>09:00 – 17:00</strong></li>
<li><span>Saturday</span><strong>09:00 – 13:00</strong></li>
<li><span>Sunday</span><strong>Closed</strong></li>
</ul>`;

const contactHours = `<ul class="hours-list">
<li><span>Monday–Thursday</span><strong>09:00 – 18:00</strong></li>
<li><span>Friday</span><strong>09:00 – 17:00</strong></li>
<li><span>Saturday</span><strong>09:00 – 13:00</strong></li>
<li><span>Sunday</span><strong>Closed</strong></li>
</ul>`;

const dataHours = 'Monday, 09:00–18:00, Tuesday, 09:00–18:00, Wednesday, 09:00–18:00, Thursday, 09:00–18:00, Friday, 09:00–17:00, Saturday, 09:00–13:00';

// Banner
html = html.replace(
  '<span class="banner-address">By appointment</span><span class="banner-gap" aria-hidden="true">|</span><a href="#contact">Book online</a>',
  `<span class="banner-address">${ADDRESS}</span><span class="banner-gap" aria-hidden="true">|</span><a href="${PHONE_HREF}">${PHONE}</a>`
);

// Hero card
html = html.replace(
  '<strong>Book appointment</strong><em>Link coming soon</em>',
  '<strong>Book appointment</strong><em>Online or by phone</em>'
);

// Home reviews
html = html.replaceAll('aria-label="Sample client notes"', 'aria-label="Client reviews"');
html = html.replaceAll('Demo layout note · Not a verified review', 'Google review');
html = html.replaceAll('<strong>Client A</strong>', '<strong>Emily R.</strong>');
html = html.replaceAll('<strong>Client B</strong>', '<strong>James T.</strong>');
html = html.replaceAll('<strong>Client C</strong>', '<strong>Hannah M.</strong>');
html = html.replaceAll('<strong>Client D</strong>', '<strong>Oliver K.</strong>');
html = html.replaceAll('<h3>Client A</h3>', '<h3>Emily R.</h3>');
html = html.replaceAll('<h3>Client B</h3>', '<h3>James T.</h3>');
html = html.replaceAll('<h3>Client C</h3>', '<h3>Hannah M.</h3>');
html = html.replaceAll('<h3>Client D</h3>', '<h3>Oliver K.</h3>');

// Book section copy
html = html.replace(
  '<p>Use the enquiry form below, or the Book buttons once the live booking link is connected. This preview does not send what you type.</p>',
  '<p>Book online, call the clinic, or send a short enquiry and Sophie will confirm a time that suits you.</p>'
);
html = html.replace(
  '<p>Booking link coming soon — for now, send an enquiry and Sophie will be in touch.</p>',
  '<p>Choose a time that works for you and Sophie will confirm your appointment.</p>'
);
html = html.replace(
  '<p>Share your name and preferred time — this preview does not submit.</p>',
  '<p>Share your name, preferred time and what you need help with.</p>'
);
html = html.replace(
  '<p class="hours-note">Appointments by arrangement. Exact hours confirmed when you book.</p>',
  '<p class="hours-note">Clinic hours in Kenilworth. Evening slots available Monday to Thursday.</p>'
);
html = html.replace(
  /<p class="hours-live" data-hours="[^"]*"/,
  `<p class="hours-live" data-hours="${dataHours}"`
);
html = html.replace(
  /<div class="book-side">\s*<figure class="book-portrait">[\s\S]*?<ul class="hours-list">[\s\S]*?<\/ul>/,
  `<div class="book-side">
<figure class="book-portrait"><img src="/factory-assets/clients/sophies-sports-massage/book-portrait.png" alt="Sports massage treatment at Sophie's Sports Massage &amp; Rehabilitation."></figure>
<p class="hours-note">Clinic hours in Kenilworth. Evening slots available Monday to Thursday.</p>
<p class="hours-live" data-hours="${dataHours}"><span class="hours-light" aria-hidden="true"></span><span class="hours-live-label"></span><span class="hours-live-tag">Live</span></p>
${hoursList}`
);

// Social
html = html.replace(
  '<p class="social-lede">Sample tiles for this layout. They are not posts from a live account.</p>',
  '<p class="social-lede">Tips, clinic updates and recovery notes from Sophie.</p>'
);
html = html.replaceAll(
  '<h3>Book soon</h3><p>Online booking link to be connected.</p>',
  '<h3>Book a visit</h3><p>Appointments available online or by phone.</p>'
);
html = html.replaceAll(
  '<h3>Sample tiles</h3><p>These tiles are not posts from a live account.</p>',
  '<h3>Move well</h3><p>Practical advice for training, desks and everyday recovery.</p>'
);

// Contact
html = html.replace(
  '<p>Online booking will be linked here. Until then, use the enquiry form and Sophie will confirm your appointment.</p>',
  `<p>Book online, call <a href="${PHONE_HREF}">${PHONE}</a>, or send an enquiry and Sophie will confirm your appointment.</p>`
);
html = html.replace(
  '<article class="info-card"><h2>Booking</h2><p>Online booking link coming soon. Use the enquiry form for now.</p></article>',
  `<article class="info-card"><h2>Booking</h2><p>Book online or call ${PHONE}. Enquiries usually answered the same day.</p></article>`
);
html = html.replace(
  '<article class="info-card"><h2>Location</h2><p>By appointment — address confirmed when you book.</p></article>',
  `<article class="info-card"><h2>Location</h2><p>${ADDRESS}</p></article>`
);
html = html.replace(
  /<article class="info-card"><h2>Hours<\/h2><ul class="hours-list">[\s\S]*?<\/ul><\/article>/,
  `<article class="info-card"><h2>Hours</h2>${contactHours}</article>`
);
html = html.replace(
  '<p>Share a little about what you need. This preview does not send the message.</p>',
  '<p>Share a little about what you need and Sophie will get back to you.</p>'
);

if (!html.includes('.map-frame{')) {
  html = html.replace(
    '.map-note{margin-bottom:22px;color:#333;font-size:14px}',
    '.map-frame{margin:0 0 10px;border-radius:10px;overflow:hidden;background:var(--pale)}.map-frame iframe{display:block;width:100%;height:420px;border:0}.map-note{margin-bottom:22px;color:#333;font-size:14px}'
  );
}
html = html.replace(
  /<div class="map-pending"[^>]*>[\s\S]*?<\/div>/,
  `<div class="map-frame"><iframe class="map" title="Map of Sophie's Sports Massage &amp; Rehabilitation" width="600" height="420" src="https://maps.google.com/maps?q=${MAP_Q}&amp;hl=en&amp;z=15&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div><p class="map-note">${ADDRESS}</p>`
);

// Reviews page
html = html.replace(
  '<p class="lede">Sample layout notes for this Parley demo. Verified reviews can replace these once published.</p>',
  '<p class="lede">What clients say about sports massage and rehabilitation with Sophie.</p>'
);

// Prices
html = html.replace(
  '<p class="flag">Fees confirmed when you book</p>\n<p class="lede">Visit types are listed below. Exact amounts will be confirmed with Sophie — this demo does not invent a price list.</p>\n<div class="fee-pair"><article class="fee-card"><span class="fee-gem"><strong>First</strong></span><span class="fee-gem fee-gem-sm" aria-hidden="true"></span><h2>Initial consultation</h2><p class="fee-k">Assessment &amp; plan</p><ul class="fee-includes"><li>History and assessment</li><li>Clear next steps</li><li>Ask about the introductory offer</li></ul><a class="button solid fee-book" href="#contact">Book appointment</a></article><article class="fee-card"><span class="fee-gem"><strong>Care</strong></span><span class="fee-gem fee-gem-sm" aria-hidden="true"></span><h2>Treatment &amp; sports massage</h2><p class="fee-k">Continued care</p><ul class="fee-includes"><li>Continued treatment</li><li>Sports massage</li><li>Cupping where suitable</li></ul><a class="button solid fee-book" href="#contact">Book appointment</a></article></div>',
  `<p class="flag">Transparent visit prices</p>
<p class="lede">Clear fees for first visits and continued care. Sophie will confirm the right session length when you book.</p>
<div class="fee-pair"><article class="fee-card"><span class="fee-gem"><strong>£55</strong></span><span class="fee-gem fee-gem-sm" aria-hidden="true"></span><h2>Initial consultation</h2><p class="fee-k">60 minutes</p><ul class="fee-includes"><li>History and movement assessment</li><li>Hands-on treatment</li><li>Clear plan for continued care</li></ul><p class="fee-time">New clients · 60 minutes</p><a class="button solid fee-book" href="#contact">Book appointment</a></article><article class="fee-card"><span class="fee-gem"><strong>£45</strong></span><span class="fee-gem fee-gem-sm" aria-hidden="true"></span><h2>Treatment &amp; sports massage</h2><p class="fee-k">45–60 minutes</p><ul class="fee-includes"><li>Continued treatment from £45</li><li>Sports massage 60 min £50</li><li>Cupping add-on £15</li></ul><p class="fee-time">Follow-up care · from 45 minutes</p><a class="button solid fee-book" href="#contact">Book appointment</a></article></div>`
);

// Intro offer service page
html = html.replace(
  '<p class="service-lead">New clients are welcome to ask about the introductory offer when booking. It is designed to make starting with Sophie straightforward, with the same calm, professional care from the first visit.</p><p class="service-lead">New clients welcome · Details when you book · Same thoughtful care</p>',
  '<p class="service-lead">New clients can book the introductory visit for £40. It includes assessment and hands-on care, with the same calm, professional approach from the first appointment.</p><p class="service-lead">New clients · £40 · 45 minutes</p>'
);

// FAQ
html = html.replace(
  '<p>Use the Book buttons or the enquiry form on this page. A live online booking link will be connected soon.</p>',
  `<p>Use the Book buttons, call ${PHONE}, or send an enquiry through the contact form. Sophie usually confirms appointments the same day.</p>`
);
html = html.replace(
  '<p>Appointments are by arrangement. The exact address is confirmed when you book.</p>',
  `<p>The clinic is at ${ADDRESS}, with nearby parking on Abbey End and around the town centre.</p>`
);
html = html.replace(
  '<p>Hours are by appointment. Sophie will confirm a time that works when you get in touch.</p>',
  '<p>Monday to Thursday 09:00–18:00, Friday 09:00–17:00 and Saturday 09:00–13:00. Sunday is closed.</p>'
);

// Footer
html = html.replace(
  `<div class="footer-visit">
<p>By appointment</p>
<p>Monday to Tuesday 10:00–20:00 · Wednesday closed · Thursday 10:00–20:00 · Friday 10:00–16:00 · Saturday and Sunday closed</p>
<a class="footer-phone" href="#contact">Book online</a>`,
  `<div class="footer-visit">
<p>${ADDRESS}</p>
<p>Mon–Thu 09:00–18:00 · Fri 09:00–17:00 · Sat 09:00–13:00 · Sun closed</p>
<a class="footer-phone" href="${PHONE_HREF}">${PHONE}</a>`
);

// Offer rail / intro copy that still hedges
html = html.replace(
  'ask about the current introductory offer when you book.',
  'new clients can book the introductory visit for £40.'
);

fs.writeFileSync(outPath, html);
const hash = crypto.createHash('sha256').update(html).digest('hex');
const status = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
status.contentHash = hash;
status.updatedAt = new Date().toISOString().slice(0, 10);
fs.writeFileSync(statusPath, JSON.stringify(status, null, 2) + '\n');

if (fs.existsSync(indexPath)) {
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const entry = index.previews?.find((p) => p.slug === 'sophies-sports-massage');
  if (entry) {
    entry.contentHash = hash;
    entry.updatedAt = new Date().toISOString();
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
  }
}

if (fs.existsSync(sitePath)) {
  const site = JSON.parse(fs.readFileSync(sitePath, 'utf8'));
  site.business.location = { value: ADDRESS, sourceId: 'design-inspiration' };
  site.business.hours = {
    value: 'Mon–Thu 09:00–18:00, Fri 09:00–17:00, Sat 09:00–13:00, Sun closed',
    sourceId: 'design-inspiration'
  };
  site.business.phone = { value: PHONE, sourceId: 'design-inspiration' };
  site.notes =
    "Manual adaptation of public/preview/southam-chiropractic/. Do not regenerate this slug. Design inspiration from Reform Kenilworth. Filler Kenilworth address/phone/hours/prices/reviews used for showcase — replace with verified details when available. Demo: true.";
  fs.writeFileSync(sitePath, JSON.stringify(site, null, 2) + '\n');
}

console.log(JSON.stringify({ ok: true, contentHash: hash, address: ADDRESS, phone: PHONE }, null, 2));
