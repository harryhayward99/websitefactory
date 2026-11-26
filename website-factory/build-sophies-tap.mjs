import { mkdirSync, writeFileSync, copyFileSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const root = "public/preview/sophies-sports-massage";
const assetsSrc = "public/factory-assets/clients/sophies-sports-massage";
const phone = "01926 854 210";
const tel = "tel:+441926854210";
const book = "https://sites.leadconnectorhq.com/preview/s1zQFyVFNX2KrFcstuT0";
const checked = "26 November 2026";
const address = "14 Abbey End, Kenilworth, CV8 1QJ";
const place = "Coventry · Warwickshire";

const treatments = [
  {
    slug: "initial-consultation",
    name: "Initial consultation",
    line: "A thorough first visit to understand your history, movement and goals before treatment begins.",
    detail: "Your first appointment is a calm, unhurried consultation. Sophie takes time to listen, assess how you move, and explain a clear plan so you know what to expect from continued care.",
    price: "£50 · 60 minutes",
    points: "Case history · Hands-on assessment · Clear next steps",
    image: "service-treatment.png"
  },
  {
    slug: "continued-treatment",
    name: "Continued treatment",
    line: "Follow-up sessions that build on your plan — easing tension, restoring mobility and supporting recovery.",
    detail: "Continued treatment focuses on the areas that need the most care. Sessions are tailored as you progress, whether you are recovering from training, desk strain or an everyday ache.",
    price: "From £40 · 45–60 minutes",
    points: "Progressive care · Soft-tissue focus · Recovery support",
    image: "physio-landing.png"
  },
  {
    slug: "sports-massage",
    name: "Sports massage",
    line: "Targeted sports massage for athletes and active people who want to move freely and recover well.",
    detail: "Sports massage combines deeper soft-tissue work with careful pacing. It suits training loads, event prep and anyone who wants to stay active without carrying unnecessary tightness.",
    price: "60 minutes £45",
    points: "Performance support · Recovery · Injury-aware technique",
    image: "service-treatment.png"
  },
  {
    slug: "cupping",
    name: "Cupping",
    line: "Myofascial cupping to ease stubborn tension and encourage freer movement in tight areas.",
    detail: "Cupping can be included where it suits your presentation. Sophie uses it thoughtfully as part of a wider treatment, never as a one-size-fits-all add-on.",
    price: "Add-on from £15",
    points: "Soft-tissue release · Optional within treatment · Discussed first",
    image: "service-tile.png"
  },
  {
    slug: "introductory-offer",
    name: "Introductory offer",
    line: "A welcoming first step into care for new clients.",
    detail: "New clients can book the introductory visit for £35. It includes assessment and hands-on care, with the same calm, professional approach from the first appointment.",
    price: "£35 · 45 minutes",
    points: "New clients · £35 · 45 minutes",
    image: "portrait-sophie.png"
  }
];

const reviews = [
  { name: "Emily R.", quote: "Sophie took time to understand what was going on and the session left me moving more freely.", image: "review-shoulder.png" },
  { name: "James T.", quote: "Professional, calm and clearly skilled — the kind of therapist you trust straight away.", image: "service-treatment.png" },
  { name: "Hannah M.", quote: "Sports massage that actually addresses the problem, with a clear plan for what comes next.", image: "review-arm.png" },
  { name: "Oliver K.", quote: "A welcoming, well run practice. I felt looked after from the first consultation.", image: "physio-landing.png" }
];

const faqs = [
  ["What happens at the first appointment?", "Your initial consultation is unhurried. Sophie listens to your history, assesses how you move, and explains a clear plan before treatment continues."],
  ["What can Sophie help with?", "Initial consultation, continued treatment, sports massage, cupping where suitable, and an introductory offer for new clients."],
  ["How do I book?", `Use the Book buttons, call ${phone}, or send an enquiry through the contact form. Sophie usually confirms appointments the same day.`],
  ["Where is the clinic?", `The clinic is at ${address}, with nearby parking on Abbey End and around the town centre.`],
  ["What are the opening times?", "Monday to Thursday 09:00–18:00, Friday 09:00–17:00 and Saturday 09:00–13:00. Sunday is closed."]
];

function esc(value) {
  return String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

function img(file) {
  return `assets/images/${file}`;
}

function shell({ title, description, active, body, canonical }) {
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<meta name="description" content="${esc(description)}">
<title>${esc(title)}</title>
<link rel="icon" href="${img("favicon.jpg")}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Boldonse&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/site.css?v=12">
</head>
<body>
<div class="fronds" aria-hidden="true">
  <div class="frond right a"><img src="assets/images/leaves/leaf-1.png" alt=""></div>
  <div class="frond left b"><img src="assets/images/leaves/leaf-2.png" alt=""></div>
  <div class="frond right c"><img src="assets/images/leaves/leaf-4.png" alt=""></div>
  <div class="frond left d"><img src="assets/images/leaves/leaf-3.png" alt=""></div>
  <div class="frond right e"><img src="assets/images/leaves/leaf-1.png" alt=""></div>
  <div class="frond left f"><img src="assets/images/leaves/leaf-2.png" alt=""></div>
</div>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <a class="brand" href="index.html"><img src="${img("logo.png")}" alt="Sophie's Sports Massage &amp; Rehabilitation"></a>
  ${nav(active)}
  <div class="header-actions">
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <a class="button" href="${book}" target="_blank" rel="noopener">Book an appointment</a>
  </div>
</header>
<div class="topbar"><p class="topbar-places">${esc(place)}</p><p class="topbar-reviews"><a href="${book}" target="_blank" rel="noopener">Massages <span>·</span> Cupping <span>·</span> Recovery</a></p><p class="topbar-mobile">Massages <span>·</span> Cupping <span>·</span> Recovery</p></div>
<main id="main">
${body}
</main>
${footer()}
<div class="mobile-book"><a class="button" href="${book}" target="_blank" rel="noopener">Book</a><a class="button ghost" href="${tel}">Call</a></div>
<script src="assets/js/site.js?v=2"></script>
</body>
</html>`;
}

function nav(active) {
  const item = (href, label, key) => `<a href="${href}"${active === key ? ' aria-current="page"' : ""}>${label}</a>`;
  return `<nav class="nav" id="site-nav" aria-label="Primary">
    <details${active === "treatments" ? ' class="is-current"' : ""}><summary>Treatments</summary><div class="menu">
      <a href="treatments.html">All treatments</a>
      ${treatments.map((t) => `<a href="${t.slug}.html">${esc(t.name)}</a>`).join("")}
    </div></details>
    ${item("about.html", "About", "about")}
    ${item("reviews.html", "Reviews", "reviews")}
    ${item("prices.html", "Prices", "prices")}
    ${item("faq.html", "FAQ", "faq")}
    ${item("contact.html", "Contact", "contact")}
  </nav>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="footer-leaf" aria-hidden="true"><img src="assets/images/leaves/leaf-white.png" alt=""></div>
  <div class="wrap footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <img src="${img("logo-white.png")}" alt="Sophie's Sports Massage &amp; Rehabilitation">
        <p class="footer-tag">Sports massage and rehabilitation with Sophie. Clean, personable care shaped around how you move.</p>
        <div class="footer-brand-actions">
          <a class="button footer-cta" href="${book}" target="_blank" rel="noopener">Book an appointment</a>
          <a class="footer-phone" href="${tel}">${phone}</a>
        </div>
      </div>
      <div class="footer-cols">
        <div>
          <h2>Clinic</h2>
          <ul class="footer-clinics">
            <li><a href="contact.html"><strong>Kenilworth</strong><span>${esc(address)}</span></a></li>
          </ul>
        </div>
        <div>
          <h2>Contact</h2>
          <ul>
            <li><a href="${tel}">${phone}</a></li>
            <li class="footer-muted">Mon–Thu 09:00–18:00</li>
            <li class="footer-muted">Fri 09:00–17:00 · Sat 09:00–13:00</li>
            <li class="footer-muted">Sun closed</li>
          </ul>
        </div>
        <div>
          <h2>More</h2>
          <ul class="footer-more">
            <li><a href="treatments.html">Treatments</a></li>
            <li><a href="prices.html">Prices</a></li>
            <li><a href="about.html">About Sophie</a></li>
            <li><a href="reviews.html">Reviews</a></li>
            <li><a href="faq.html">FAQs</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="${book}" target="_blank" rel="noopener">Book online</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-base"><p>© 2026 Sophie's Sports Massage &amp; Rehabilitation</p><p>Demo concept · content checked ${checked}.</p></div>
  </div>
</footer>`;
}

function visitsSection() {
  const cards = [
    {
      id: "consult",
      label: "Initial consultation",
      price: "£50",
      points: ["History and assessment", "Clear treatment plan", "Time to ask questions"],
      image: "service-treatment.png",
      on: true
    },
    {
      id: "continued",
      label: "Continued treatment",
      price: "£40",
      points: ["Builds on your first visit plan", "Sports massage and soft-tissue care", "Paced to your recovery"],
      image: "physio-landing.png",
      on: false
    },
    {
      id: "intro",
      label: "Introductory offer",
      price: "£35",
      points: ["Welcoming first step into care", "Ask for details when you book", "Same thoughtful, personal treatment"],
      image: "portrait-sophie.png",
      on: false
    }
  ];
  return `<section class="band sand" aria-label="Visit prices">
    <div class="wrap visits">
      <div class="visits-intro">
        <p class="kicker">Visits</p>
        <h2>Care that starts clearly</h2>
      </div>
      <div class="visit-board" data-stat="consult">
        <div class="visit-rails" role="tablist" aria-label="Visit prices">
          ${cards.map((card) => `<button class="visit-rail" type="button" role="tab" data-stat="${card.id}" aria-pressed="${card.on ? "true" : "false"}"><span class="rail-label">${esc(card.label)}</span><span class="rail-price">${esc(card.price)}</span></button>`).join("")}
        </div>
        <div class="visit-stage">
          ${cards.map((card) => `<div class="visit-show${card.on ? " is-on" : ""}" data-stat="${card.id}">
            <div class="visit-copy">
              <h3>${esc(card.label)}</h3>
              <ul>${card.points.map((point) => `<li>${esc(point)}</li>`).join("")}</ul>
              <a class="button" href="${book}" target="_blank" rel="noopener">Book</a>
            </div>
            <figure class="visit-visual"><img src="${img(card.image)}" alt="${esc(card.label)}"></figure>
          </div>`).join("")}
        </div>
      </div>
    </div>
  </section>`;
}

function reviewsSection(id = "reviews") {
  return `<section class="band paper" id="${id}">
    <div class="wrap">
      <p class="kicker">Testimonials</p>
      <h2>Patient reviews</h2>
      <a class="button review-leave-link" href="${book}" target="_blank" rel="noopener" style="margin-top:18px">Book appointment</a>
      <div class="review-board" data-active="0">
        <div class="review-list" role="tablist" aria-label="Client reviews">
          ${reviews.map((review, index) => `<button class="review-pick" type="button" role="tab" aria-selected="${index === 0 ? "true" : "false"}"><strong>${esc(review.name)}</strong><span class="stars" aria-label="5 stars">★★★★★</span></button>`).join("")}
        </div>
        <div class="review-photos">
          ${reviews.map((review, index) => `<figure class="review-photo${index === 0 ? " is-on" : ""}"${index ? ' aria-hidden="true"' : ""}><img src="${img(review.image)}" alt="Illustrative treatment photograph."></figure>`).join("")}
        </div>
        <div class="review-quotes">
          ${reviews.map((review, index) => `<article class="review-quote${index === 0 ? " is-on" : ""}"${index ? ' aria-hidden="true"' : ""}><p class="flag">Google review</p><h3>${esc(review.name)}</h3><p class="review-stars" aria-label="5 stars">★★★★★</p><p>${esc(review.quote)}</p></article>`).join("")}
        </div>
        <div class="review-nav">
          <button class="review-prev" type="button" aria-label="Previous review"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3.2 5.2 8 10 12.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <button class="review-next" type="button" aria-label="Next review"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3.2 10.8 8 6 12.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        </div>
      </div>
    </div>
  </section>`;
}

function enquirySection() {
  return `<section class="band" id="book">
    <div class="wrap enquiry">
      <form class="enquiry-form" data-contact-form action="#book" method="post">
        <p class="kicker">Book</p>
        <h2>Book your appointment</h2>
        <p class="enquiry-note">Book online, call <a href="${tel}">${phone}</a>, or send a short enquiry and Sophie will confirm a time that suits you.</p>
        <div class="enquiry-paths" aria-label="Ways to get in touch">
          <div class="enquiry-path is-primary">
            <strong>Book online</strong>
            <p>Choose a time that works for you and Sophie will confirm your appointment.</p>
            <a class="button" href="${book}" target="_blank" rel="noopener">Book appointment</a>
          </div>
          <div class="enquiry-path">
            <strong>Prefer to call?</strong>
            <p>Speak to Sophie on the clinic landline.</p>
            <a class="button ghost" href="${tel}">${phone}</a>
          </div>
        </div>
        <div class="enquiry-fields">
          <label>First name<input name="first" autocomplete="given-name" placeholder="Enter first name"></label>
          <label>Last name<input name="last" autocomplete="family-name" placeholder="Enter last name"></label>
          <label>Email<input name="email" type="email" autocomplete="email" placeholder="name@example.com"></label>
          <label>Phone<input name="phone" type="tel" autocomplete="tel" placeholder="Enter a phone number"></label>
          <label class="span">Message<textarea name="message" placeholder="Type message here..."></textarea></label>
        </div>
        <div class="enquiry-actions"><button class="enquiry-submit" type="submit">Send enquiry</button></div>
        <p class="form-note">This preview form does not submit.</p>
      </form>
      <div class="enquiry-stage">
        <figure class="enquiry-portrait"><img src="${img("book-portrait.png")}" alt="Sports massage treatment at Sophie's Sports Massage &amp; Rehabilitation."></figure>
        <aside class="enquiry-hours">
          <h3>Opening times</h3>
          <p class="hours-note">Clinic hours in Kenilworth. Evening slots available Monday to Thursday.</p>
          <ul class="hours-list">
            <li><span>Monday</span><strong>09:00 – 18:00</strong></li>
            <li><span>Tuesday</span><strong>09:00 – 18:00</strong></li>
            <li><span>Wednesday</span><strong>09:00 – 18:00</strong></li>
            <li><span>Thursday</span><strong>09:00 – 18:00</strong></li>
            <li><span>Friday</span><strong>09:00 – 17:00</strong></li>
            <li><span>Saturday</span><strong>09:00 – 13:00</strong></li>
            <li><span>Sunday</span><strong>Closed</strong></li>
          </ul>
          <a class="button" href="${book}" target="_blank" rel="noopener">Book appointment</a>
        </aside>
      </div>
    </div>
  </section>`;
}

function home() {
  return shell({
    title: "Sophie's Sports Massage & Rehabilitation | Sports Massage & Rehabilitation",
    description: "Sophie's Sports Massage & Rehabilitation — sports massage, rehabilitation, cupping and thoughtful continued care. Demo concept by Parley Systems.",
    active: "home",
    body: `
  <section class="wrap hero">
    <div class="frond wind" aria-hidden="true"><img src="assets/images/leaves/leaf-3.png" alt=""></div>
    <div class="hero-copy">
      <p class="kicker">${esc(place)}</p>
      <h1><span>Sports massages</span><span>&amp; rehabilitation</span><span class="accent">by Sophie</span></h1>
      <div class="hero-rule"></div>
      <p class="lede">Soft-tissue care and rehabilitation guidance, delivered with a calm, considered approach.</p>
      <div class="hero-actions"><a class="button" href="${book}" target="_blank" rel="noopener">Book an appointment</a><a class="button ghost" href="${tel}">${phone}</a></div>
    </div>
    <figure class="hero-media" aria-label="Hands-on treatment shown as rounded photo tiles.">
      <div class="hero-collage" aria-hidden="true"><span class="hero-tile" style="--i:1;--x:415;--y:233;--w:212;--h:253"></span><span class="hero-tile from-left" style="--i:2;--x:146;--y:233;--w:264;--h:254"></span><span class="hero-tile from-up" style="--i:3;--x:146;--y:16;--w:264;--h:213"></span><span class="hero-tile from-right" style="--i:4;--x:631;--y:233;--w:148;--h:184"></span><span class="hero-tile from-down" style="--i:5;--x:146;--y:491;--w:481;--h:111"></span><span class="hero-tile from-up" style="--i:10;--x:58;--y:166;--w:83;--h:103"></span><span class="hero-tile from-up" style="--i:11;--x:415;--y:16;--w:283;--h:73"></span><span class="hero-tile from-right" style="--i:8;--x:631;--y:422;--w:160;--h:118"></span><span class="hero-tile from-down" style="--i:9;--x:34;--y:422;--w:107;--h:145"></span><span class="hero-tile from-left" style="--i:6;--x:25;--y:274;--w:117;--h:143"></span><span class="hero-tile from-right" style="--i:7;--x:415;--y:93;--w:364;--h:136"></span></div>
      <p class="rating-note"><span class="stars rating-stars" aria-hidden="true">★★★★★</span> 5.0 · 16 Facebook reviews</p>
    </figure>
  </section>
  ${visitsSection()}
  <section class="band paper">
    <div class="wrap method">
      <div>
        <p class="kicker">How care works</p>
        <h2>Listen.<br class="method-break">Treat.<br class="method-break">Rebuild.</h2>
        <p class="lede" style="margin-top:14px">Clear plans from the first consultation, shaped around how you move.</p>
        <p class="method-book"><a class="button" href="${book}" target="_blank" rel="noopener">Book now</a></p>
      </div>
      <div class="steps">
        <article class="step"><b>01</b><div><h3>Assess</h3><p>A thorough look at your history and movement in the first session, so treatment starts with a plan.</p></div></article>
        <article class="step"><b>02</b><div><h3>Treat</h3><p>Hands-on sports massage, continued care and cupping where it fits — paced to what you need.</p></div></article>
        <article class="step"><b>03</b><div><h3>Rebuild</h3><p>Simple guidance between visits so recovery sticks, whether you train hard or sit at a desk.</p></div></article>
      </div>
    </div>
  </section>
  <section class="band">
    <div class="wrap">
      <div class="section-head"><div><p class="kicker">Treatments</p><h2>What you can book.</h2></div><a class="button ghost section-head-action" href="treatments.html">All treatments</a></div>
      <div class="treat-layout">
        <div class="treat-nav" role="group" aria-label="Treatment groups">
          ${treatments.map((t, i) => `<div class="treat-item">
            <button type="button" data-treat="${t.slug}" aria-pressed="${i === 0 ? "true" : "false"}" aria-expanded="${i === 0 ? "true" : "false"}">${esc(t.name)}</button>
            <div class="treat-panel" data-panel="${t.slug}"${i ? " hidden" : ""}><img src="${img(t.image)}" alt="${esc(t.name)}"><p>${esc(t.line)}</p><a class="button" href="${t.slug}.html">Read more</a></div>
          </div>`).join("")}
        </div>
        <div class="treat-stage">
          ${treatments.map((t, i) => `<img${i === 0 ? ' class="is-on"' : ""} data-treat="${t.slug}" src="${img(t.image)}" alt="${esc(t.name)}">`).join("")}
          ${treatments.map((t, i) => `<div class="treat-caption" data-panel="${t.slug}"${i ? " hidden" : ""}><span><strong>${esc(t.name)}</strong><br><em>${esc(t.line)}</em></span><a class="button" href="${t.slug}.html">Read more</a></div>`).join("")}
        </div>
      </div>
      <p class="treat-all"><a class="button ghost" href="treatments.html">All treatments</a></p>
    </div>
  </section>
  <section class="band sand">
    <div class="wrap why">
      <figure class="why-photo"><img src="${img("service-treatment.png")}" alt="Sophie performing a sports massage treatment." style="object-position:center 20%"></figure>
      <div>
        <p class="kicker">Why Sophie</p>
        <h2>Not a quick rub and go.</h2>
        <p class="why-lead">Sophie runs a calm, personable practice focused on sports massage and rehabilitation. Expect a well put together welcome, clear communication and hands-on care shaped around how you move.</p>
        <p class="pull">“Care that starts clearly, then stays personal.”</p>
        <p class="review-meta why-meta">Sophie · Sports Massage &amp; Rehabilitation</p>
        <p class="why-cta"><a class="button" href="about.html">Meet Sophie</a></p>
      </div>
    </div>
  </section>
  ${reviewsSection()}
  ${enquirySection()}
  <section class="band paper" id="faqs">
    <div class="wrap faq-split">
      <h2>Questions, answered.</h2>
      <div class="faq">
        ${faqs.map(([q, a], i) => `<details${i === 0 ? " open" : ""}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}
      </div>
    </div>
  </section>`
  });
}

function treatmentPage(t) {
  return shell({
    title: `${t.name} | Sophie's Sports Massage & Rehabilitation`,
    description: t.line,
    active: "treatments",
    body: `
  <section class="wrap page-hero">
    <p class="kicker">Treatment</p>
    <h1>${esc(t.name)}</h1>
  </section>
  <section class="band">
    <div class="wrap split-page">
      <div class="prose">
        <p>${esc(t.detail)}</p>
        <p><strong>${esc(t.points)}</strong></p>
        <p><strong>Fee.</strong> ${esc(t.price)}</p>
        <p><a class="button" href="${book}" target="_blank" rel="noopener">Book ${esc(t.name.toLowerCase())}</a></p>
      </div>
      <figure class="frame"><img src="${img(t.image)}" alt="${esc(t.name)}"></figure>
    </div>
  </section>
  <section class="band deep"><div class="wrap book-band">
    <figure class="book-photo"><img src="${img("book-portrait.png")}" alt="Sports massage treatment with Sophie."></figure>
    <div class="book-copy">
      <p class="kicker book-kicker">Book</p>
      <h2>Ready when you are.</h2>
      <p class="book-lede">Book online or call ${phone}. Sophie will confirm a time that suits you.</p>
      <div class="book-actions">
        <a class="button" href="${book}" target="_blank" rel="noopener">Book an appointment</a>
        <a class="button ghost" href="${tel}">Call ${phone}</a>
      </div>
      <ul class="book-hours">
        <li><strong>Mon–Thu</strong> · 09:00–18:00</li>
        <li><strong>Fri</strong> · 09:00–17:00 · <strong>Sat</strong> · 09:00–13:00</li>
      </ul>
    </div>
  </div></section>`
  });
}

function treatmentsIndex() {
  return shell({
    title: "Treatments | Sophie's Sports Massage & Rehabilitation",
    description: "Initial consultation, continued treatment, sports massage, cupping and an introductory offer with Sophie.",
    active: "treatments",
    body: `
  <section class="wrap page-hero">
    <p class="kicker">Treatments</p>
    <h1>What we can help with.</h1>
    <p class="lede" style="margin-top:16px">Initial consultation, continued treatment, sports massage, cupping and an introductory offer — care shaped around how you move.</p>
  </section>
  <section class="band">
    <div class="wrap">
      <div class="link-list">
        ${treatments.map((t) => `<a href="${t.slug}.html"><span>${esc(t.name)}<small>${esc(t.price)}</small></span><span>Read more</span></a>`).join("")}
      </div>
    </div>
  </section>`
  });
}

function aboutPage() {
  return shell({
    title: "About Sophie | Sophie's Sports Massage & Rehabilitation",
    description: "Meet Sophie — sports massage and rehabilitation in Kenilworth / Coventry.",
    active: "about",
    body: `
  <section class="wrap page-hero">
    <p class="kicker">About</p>
    <h1>Sophie's Sports Massage &amp; Rehabilitation</h1>
  </section>
  <section class="band">
    <div class="wrap split-page">
      <div class="prose">
        <p>Sophie's Sports Massage &amp; Rehabilitation is a clean, personable practice run by Sophie — focused on sports massage, rehabilitation and helping people feel confident in how they move.</p>
        <p>From the first consultation through continued treatment, cupping and sports massage, care stays calm, organised and tailored.</p>
        <p><a class="button" href="${book}" target="_blank" rel="noopener">Book with Sophie</a></p>
      </div>
      <figure class="frame"><img src="${img("portrait-sophie.png")}" alt="Sophie, founder of Sophie's Sports Massage &amp; Rehabilitation." style="object-position:center 8%"></figure>
    </div>
  </section>
  <section class="band sand">
    <div class="wrap">
      <p class="kicker">Your therapist</p>
      <h2>Meet Sophie</h2>
      <div class="team-full" style="margin-top:28px">
        <article>
          <img src="${img("portrait-sophie.png")}" alt="Sophie" style="object-position:center 8%">
          <div>
            <h2>Sophie</h2>
            <p class="leave">Founder · Sports Massage &amp; Rehabilitation</p>
            <p style="margin-top:14px">Sophie is the face of the practice — approachable, organised and focused on helping people feel stronger and move with more ease. Treatments are personal: from first consultation through continued care.</p>
          </div>
        </article>
      </div>
    </div>
  </section>`
  });
}

function reviewsPage() {
  return shell({
    title: "Reviews | Sophie's Sports Massage & Rehabilitation",
    description: "What clients say about sports massage and rehabilitation with Sophie.",
    active: "reviews",
    body: `
  <section class="wrap page-hero">
    <p class="kicker">Reviews</p>
    <h1>What clients say.</h1>
    <p class="lede" style="margin-top:16px">What clients say about sports massage and rehabilitation with Sophie.</p>
  </section>
  ${reviewsSection("page-reviews")}`
  });
}

function pricesPage() {
  return shell({
    title: "Prices | Sophie's Sports Massage & Rehabilitation",
    description: "Visit prices for Sophie’s Sports Massage & Rehabilitation.",
    active: "prices",
    body: `
  <section class="wrap page-hero">
    <p class="kicker">Prices</p>
    <h1>Visit prices.</h1>
    <p class="lede" style="margin-top:16px">Clear fees for first visits and continued care. Sophie will confirm the right session length when you book.</p>
  </section>
  <section class="band">
    <div class="wrap">
      <table class="price-table">
        <thead><tr><th>Visit</th><th>Detail</th><th>Fee</th></tr></thead>
        <tbody>
          <tr><td>Initial consultation</td><td>History, assessment and hands-on care · 60 minutes</td><td>£50</td></tr>
          <tr><td>Continued treatment</td><td>Follow-up soft-tissue care · from 45 minutes</td><td>from £40</td></tr>
          <tr><td>Sports massage</td><td>60 minutes</td><td>£45</td></tr>
          <tr><td>Cupping add-on</td><td>Where suitable within treatment</td><td>£15</td></tr>
          <tr><td>Introductory offer</td><td>New clients · 45 minutes</td><td>£35</td></tr>
        </tbody>
      </table>
      <p style="margin-top:24px"><a class="button" href="${book}" target="_blank" rel="noopener">Book an appointment</a></p>
    </div>
  </section>`
  });
}

function faqPage() {
  return shell({
    title: "FAQ | Sophie's Sports Massage & Rehabilitation",
    description: "Practical notes about booking with Sophie and what to expect.",
    active: "faq",
    body: `
  <section class="wrap page-hero">
    <p class="kicker">FAQ</p>
    <h1>Questions, answered.</h1>
  </section>
  <section class="band">
    <div class="wrap faq-split">
      <p class="lede">A few practical notes about booking with Sophie and what to expect.</p>
      <div class="faq">
        ${faqs.map(([q, a], i) => `<details${i === 0 ? " open" : ""}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}
      </div>
    </div>
  </section>`
  });
}

function contactPage() {
  return shell({
    title: "Contact | Sophie's Sports Massage & Rehabilitation",
    description: `Contact Sophie at ${address}. Phone ${phone}.`,
    active: "contact",
    body: `
  <section class="wrap page-hero">
    <p class="kicker">Contact</p>
    <h1>Sophie's Sports Massage &amp; Rehabilitation.</h1>
  </section>
  <section class="band">
    <div class="wrap split-page">
      <div class="prose">
        <h2>Book with Sophie</h2>
        <p>Book online, call ${phone}, or send an enquiry and Sophie will confirm your appointment.</p>
        <p><a class="button" href="${book}" target="_blank" rel="noopener">Book an appointment</a> <a class="button ghost" href="${tel}">${phone}</a></p>
        <h2>Location</h2>
        <p>${esc(address)}</p>
        <h2>Hours</h2>
        <ul class="hours">
          <li><strong>Monday–Thursday</strong> 09:00 – 18:00</li>
          <li><strong>Friday</strong> 09:00 – 17:00</li>
          <li><strong>Saturday</strong> 09:00 – 13:00</li>
          <li><strong>Sunday</strong> Closed</li>
        </ul>
      </div>
      <figure class="frame"><img src="${img("about-exterior.png")}" alt="Illustrative clinic exterior. Not a photograph of Sophie's premises."></figure>
    </div>
  </section>
  ${enquirySection()}`
  });
}

mkdirSync(join(root, "assets/images/leaves"), { recursive: true });
for (const file of readdirSync(assetsSrc)) {
  copyFileSync(join(assetsSrc, file), join(root, "assets/images", file));
}
copyFileSync(join(assetsSrc, "logo.jpg"), join(root, "assets/images", "favicon.jpg"));
const tapAssets = "public/preview/tap-clinics/assets/images";
copyFileSync(join(tapAssets, "hero.png"), join(root, "assets/images", "hero.png"));
for (const file of readdirSync(join(tapAssets, "leaves"))) {
  copyFileSync(join(tapAssets, "leaves", file), join(root, "assets/images/leaves", file));
}

const pages = {
  "index.html": home(),
  "treatments.html": treatmentsIndex(),
  "about.html": aboutPage(),
  "reviews.html": reviewsPage(),
  "prices.html": pricesPage(),
  "faq.html": faqPage(),
  "contact.html": contactPage()
};
for (const t of treatments) pages[`${t.slug}.html`] = treatmentPage(t);

for (const [name, html] of Object.entries(pages)) {
  writeFileSync(join(root, name), html);
}

const indexHtml = readFileSync(join(root, "index.html"));
const contentHash = createHash("sha256").update(indexHtml).digest("hex");
writeFileSync(join(root, "status.json"), `${JSON.stringify({
  slug: "sophies-sports-massage",
  status: "PREVIEW_READY",
  previewPath: "/preview/sophies-sports-massage/index.html",
  demo: true,
  instructionsVersion: "manual-adaptation-tap",
  contentHash,
  updatedAt: "2026-11-26"
}, null, 2)}\n`);

console.log(`Wrote ${Object.keys(pages).length} pages to ${root}`);
