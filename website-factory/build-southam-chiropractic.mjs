import fs from "fs";
import path from "path";

const root = path.resolve(".");
const srcPath = path.join(root, "public/preview/45-the-green/index.html");
const outDir = path.join(root, "public/preview/southam-chiropractic");
const assetDir = path.join(root, "public/factory-assets/clients/southam-chiropractic");
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(assetDir, { recursive: true });

const copies = {
  "chiro-landing.png": "website-factory/images/chiropractic/landing-treatment.png",
  "physio-landing.png": "website-factory/images/physiotherapy/landing-treatment.png",
  "service-tile.png": "website-factory/images/general/service-tile.png",
  "service-tile-2.png": "website-factory/images/general/service-tile-2.png",
  "review-shoulder.png": "website-factory/images/general/review-shoulder.png",
  "review-arm.png": "website-factory/images/general/review-arm.png",
  "book-portrait.png": "website-factory/images/general/book-portrait.png",
  "about-exterior.png": "website-factory/images/general/about-exterior.png",
  "portrait-a.png": "website-factory/images/general/sam-example.png",
  "portrait-b.png": "website-factory/images/general/jordan-example.png",
};
for (const [name, from] of Object.entries(copies)) {
  fs.copyFileSync(path.join(root, from), path.join(assetDir, name));
}

const A = "/factory-assets/clients/southam-chiropractic";
const alt = "Illustrative treatment photograph. Not a photograph of Southam Chiropractic staff or premises.";
const bookSvg = `<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="2.2" y="3.2" width="11.6" height="10.6" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M2.2 6.4h11.6M5.2 2v2.6M10.8 2v2.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`;

const services = [
  {
    id: "service-back-pain",
    num: "01",
    name: "Back pain",
    short: "A common reason people see a chiropractor. Southam Chiropractic has a specialist interest in back pain.",
    long: "Back pain is one of the conditions this practice says it regularly sees. Chiropractic, as the clinic describes it, is concerned with mechanical disorders of the bones, joints and muscles, including the back.",
    points: "Listed by the clinic · Specialist interest in back pain · Part of a wider look at physical wellbeing",
    img: `${A}/chiro-landing.png`,
  },
  {
    id: "service-neck-pain",
    num: "02",
    name: "Neck pain",
    short: "Neck pain is a common chiropractic concern, and this practice names it as a specialist interest.",
    long: "The clinic says it has a specialist interest in neck pain as well as back pain, and lists neck pain among the conditions it regularly sees.",
    points: "Listed by the clinic · Specialist interest in neck pain · Discussed at the initial consultation",
    img: `${A}/physio-landing.png`,
  },
  {
    id: "service-headaches",
    num: "03",
    name: "Headaches and migraines",
    short: "Headaches and migraines are among the conditions chiropractors are often asked about, and this clinic lists them.",
    long: "Headaches and migraines appear on the clinic’s own list of conditions that have a significant effect on people’s lives. What is suitable is discussed after the initial consultation.",
    points: "Listed by the clinic · Raised at the first visit · No extra claims added here",
    img: `${A}/service-tile.png`,
  },
  {
    id: "service-sciatica",
    num: "04",
    name: "Sciatica",
    short: "Sciatica is a common reason to see a chiropractor, and it is on this clinic’s condition list.",
    long: "Sciatica is listed by Southam Chiropractic among the conditions regularly seen in practice. The first visit includes a case history and an examination of the spine, joints, nerves and muscles.",
    points: "Listed by the clinic · Examination of spine, joints, nerves and muscles · Report of findings on a later day",
    img: `${A}/review-shoulder.png`,
  },
  {
    id: "service-joint-pain",
    num: "05",
    name: "Joint and muscle pain",
    short: "Joint pain, muscle pain and spasm are common chiropractic concerns, and this clinic lists all three.",
    long: "The clinic lists joint pain, muscle pain and spasm, shoulder pain and pelvic pain. These cards group the joint and muscle concerns chiropractors commonly help people with.",
    points: "Joint pain · Muscle pain and spasm · Shoulder pain and pelvic pain are also listed",
    img: `${A}/service-tile-2.png`,
  },
];

function offerPanel(stat, title, price, items, img, imageAlt) {
  return `<div class="stat-show show-${stat}">
<div class="offer-copy">
<h3>${title}</h3>
<p class="stat-num">${price}</p>
<ul>
${items.map((item) => `<li>${item}</li>`).join("\n")}
</ul>
<a class="button" href="#contact">Contact</a>
</div>
<div class="offer-side">
<figure class="offer-visual"><img src="${img}" alt="${imageAlt}"></figure>
</div>
</div>`;
}

const promo = `<section class="wrap statement promo-statement mist" aria-label="Visit prices">
<div class="promo-intro">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8.4 2.4h4.4v4.4L7.4 12.2 3.2 8 8.4 2.4z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="10.8" cy="4.8" r=".7" fill="currentColor"/></svg> Visits</p>
<h2>Care that starts clearly</h2>
<p><span class="promo-lede-full">An initial appointment, continued treatment and massage. The clinic website says treatments start from £30.</span><span class="promo-lede-short">Initial appointment, continued treatment and massage.</span></p>
</div>
<div class="stat-board promo-offer-board" id="new-patient" data-stat="consult">
<div class="rails" role="tablist" aria-label="Visit prices">
<button class="rail rail-consult" type="button" role="tab" data-stat="consult" aria-pressed="true"><span class="rail-label">Initial Appointment</span><span class="rail-price">£45</span></button>
<button class="rail rail-whitening" type="button" role="tab" data-stat="whitening" aria-pressed="false"><span class="rail-label">Continued Treatment</span><span class="rail-price">£40</span></button>
<button class="rail rail-denplan" type="button" role="tab" data-stat="denplan" aria-pressed="false"><span class="rail-label">Massage</span><span class="rail-price">£40</span></button>
</div>
<div class="stat-stage">
${offerPanel("whitening", "Continued Treatment", "£40", [
  "Visits after the first consultation",
  "Follows the report of findings",
  "A plan discussed for your own needs",
], `${A}/physio-landing.png`, alt)}
${offerPanel("consult", "Initial Appointment", "£45", [
  "Case history",
  "Examination of spine, joints, nerves and muscles",
  "30–40 minutes",
], `${A}/chiro-landing.png`, alt)}
${offerPanel("denplan", "Massage", "£40", [
  "Massage appointment",
  "Ask what is included when you book",
  "Book a time that suits you",
], `${A}/review-arm.png`, alt)}
</div>
</div>
</section>`;

function shot(service) {
  return `<div class="shot"><figure class="tile-media"><img src="${service.img}" alt="${alt}"></figure><p class="shot-copy"><span><strong>${service.name}</strong><em>${service.short}</em></span><a class="button" href="#${service.id}">More Information</a></p></div>`;
}
function details(service) {
  return `<details name="listed-services"><summary>${service.name}</summary><div class="accordion-panel"><figure class="tile-media"><img src="${service.img}" alt="${alt}"></figure><p class="shot-copy"><span><strong>${service.name}</strong><em>${service.short}</em></span><a class="button" href="#${service.id}">More Information</a></p></div></details>`;
}

const serviceSplit = `<section class="section">
<div class="wrap service-split" data-active="0">
<div class="service-side">
<p class="kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 4.2h10M3 8h10M3 11.8h6.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg> Services</p>
<h2>What we can help with.</h2>
<p class="lede">Common conditions we encounter include joint pain, headaches and migraines, muscle pain and spasm, sciatica, back pain, neck pain, shoulder pain and pelvic pain.</p>
<nav class="service-links" aria-label="Services">${services.map((service) => `<button type="button">${service.name}</button>`).join("")}</nav>
<div class="service-accordion">${services.map(details).join("")}<a class="button accordion-book" href="#contact">Book appointment</a></div>
</div>
<div class="shots">${services.map(shot).join("")}</div>
</div>
</section>`;

const personNote = "Patients name Alun and Adam in their Google reviews. The clinic website does not publish surnames or registration numbers, so none are shown here.";
function meetSlide(name, img, on) {
  return `<article class="meet-slide${on ? " is-on" : ""}"${on ? "" : ' aria-hidden="true"'}><figure class="meet-photo"><img src="${img}" alt="${alt}"></figure><div class="meet-card"><h3>${name}</h3><p class="meet-role">Chiropractor</p><p>${personNote}</p><a class="button meet-book" href="#contact">${bookSvg} Make an appointment</a></div></article>`;
}
const meet = `<section class="section mist meet">
<div class="wrap">
<div class="meet-head">
<div>
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M8 1.1l1.05 3.35h3.5l-2.85 2.1 1.1 3.4L8 7.9l-2.8 2.05 1.1-3.4-2.85-2.1h3.5z"/></svg> Our specialists</p>
<h2>Meet the specialists</h2>
</div>
<div class="meet-nav"><button class="meet-arrow meet-prev" type="button" aria-label="Previous specialist"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3.2 5.2 8 10 12.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="meet-arrow meet-next" type="button" aria-label="Next specialist"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3.2 10.8 8 6 12.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>
</div>
<div class="meet-stage">${meetSlide("Alun", `${A}/portrait-a.png`, true)}${meetSlide("Adam", `${A}/portrait-b.png`, false)}</div>
</div>
</section>`;

const reviews = [
  {
    name: "Scott Ashenden",
    date: "12 April 2021",
    quote: "After seeing an ad on Facebook for Southam Chiropractic I was a little skeptical, however after suffering for a quite a while with stiff neck and other issues I was willing to give anything a go, I have had about 7 sessions now I do not regret it, I haven't felt this great in a long time the stiff neck is gone, and I feel stronger after each session Alun and Adam are passionate about what they are doing and will not only make the adjustments you need, they go the extra mile and will educate you on why they needed to do it and what to expect going forward. I cannot recommend these guys enough.",
  },
  {
    name: "Rhayleen Didierserre",
    date: "2 April 2021",
    quote: "Been to the chiropractor and they are fantastic, they will listen to you and treat you according to what you need help with, if you have back, shoulder, neck and muscle pain these guys are great, I would recommend this practice to everyone, I do feel better already.",
  },
  {
    name: "Jonathan",
    date: "9 January 2021",
    quote: "Found Southam Chiropractic and I was in a lot of pain, taking strong painkillers and on the verge of starting both sleeping tablets and possibly anti- depressants. After a few treatments the pain reduced significantly I stopped taking painkillers for the first time in 3 months. Alun was superb, very professional and absolutely my hero. I cannot recommend him highly enough.",
  },
  {
    name: "Lauren",
    date: "27 October 2020",
    quote: "Can't recommend enough. I've had terrible shoulder pain for years. Having seen an advert on Facebook in the summer I decided I had nothing to lose going for a consultation. Alun was so lovely, really talked through everything and made sure I understood exactly what was going on with my spine, posture and nervous system. I didn't feel pressured in anyway, I now go regularly and I've honestly never felt better.",
  },
];
const reviewPhotos = [`${A}/review-shoulder.png`, `${A}/review-arm.png`, `${A}/service-tile.png`, `${A}/service-tile-2.png`];
function reviewBoard() {
  const picks = reviews.map((review, index) => `<button class="review-pick" type="button" role="tab" aria-selected="${index === 0 ? "true" : "false"}"><strong>${review.name}</strong><span class="stars" aria-label="5 stars">★★★★★</span></button>`).join("");
  const photos = reviews.map((review, index) => `<figure class="review-photo"><img src="${reviewPhotos[index]}" alt="${alt}"></figure>`).join("");
  const quotes = reviews.map((review, index) => `<article class="review-quote"${index ? ' aria-hidden="true"' : ""}><p class="flag">Google review · ${review.date}</p><h3>${review.name}</h3><p class="review-stars"><span class="stars" aria-label="5 stars">★★★★★</span></p><p>${review.quote}</p></article>`).join("");
  return `<div class="review-board" data-active="0"><div class="review-list" role="tablist" aria-label="Google reviews">${picks}</div><div class="review-photos">${photos}</div><div class="review-quotes">${quotes}</div><div class="review-nav"><button class="meet-arrow review-prev" type="button" aria-label="Previous review"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3.2 5.2 8 10 12.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="meet-arrow review-next" type="button" aria-label="Next review"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3.2 10.8 8 6 12.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div>`;
}

const homeReviews = `<section class="section reviews">
<div class="wrap">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="2.1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 1.4v1.7M8 12.9v1.7M1.4 8h1.7M12.9 8h1.7M3.3 3.3l1.2 1.2M11.5 11.5l1.2 1.2M12.7 3.3l-1.2 1.2M4.5 11.5l-1.2 1.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Testimonials</p>
<h2>Patient reviews</h2>
<a class="button review-leave-link" href="#reviews">Leave a Google review</a>
${reviewBoard()}
</div>
</section>`;

const hours = "Monday, 10:00–20:00, Tuesday, 10:00–20:00, Thursday, 10:00–20:00, Friday, 10:00–16:00";
const hoursList = `<ul class="hours-list">
<li><span>Monday</span><strong>10:00 – 20:00</strong></li>
<li><span>Tuesday</span><strong>10:00 – 20:00</strong></li>
<li><span>Wednesday</span><strong>Closed</strong></li>
<li><span>Thursday</span><strong>10:00 – 20:00</strong></li>
<li><span>Friday</span><strong>10:00 – 16:00</strong></li>
<li><span>Saturday</span><strong>Closed</strong></li>
<li><span>Sunday</span><strong>Closed</strong></li>
</ul>`;

const book = `<section class="section book">
<div class="wrap book-layout">
<form class="book-form" action="#contact" method="post" onsubmit="return false">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="2.1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 1.4v1.7M8 12.9v1.7M1.4 8h1.7M12.9 8h1.7M3.3 3.3l1.2 1.2M11.5 11.5l1.2 1.2M12.7 3.3l-1.2 1.2M4.5 11.5l-1.2 1.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Schedule</p>
<h2>Book your appointment</h2>
<p class="book-note">This preview does not send what you type or take a booking. Call 01926 298 102 to arrange a visit.</p>
<div class="book-fields">
<label>First name*<input name="given-name" autocomplete="given-name" placeholder="Enter first name" required></label>
<label>Last name*<input name="family-name" autocomplete="family-name" placeholder="Enter last name" required></label>
<label>Email*<input name="email" type="email" autocomplete="email" placeholder="name@example.com" required></label>
<label>Phone<input name="tel" type="tel" autocomplete="tel" placeholder="Enter a phone number"></label>
<label class="book-date"><span>Appointment date*</span><span class="date-field"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="2.2" y="3.2" width="11.6" height="10.6" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M2.2 6.4h11.6M5.2 2v2.6M10.8 2v2.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg><input name="date" placeholder="DD / MM / YYYY" required></span></label>
<label class="book-time"><span>Preferred time*</span><span class="date-field"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8.2" r="5.2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 5.2V8.2l2.1 1.3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg><input name="time" placeholder="HH:MM" required></span></label>
<label class="span">Message*<textarea name="message" placeholder="Type message here..." required></textarea></label>
<input type="hidden" name="patient" value="">
<input type="hidden" name="enquiry" value="">
</div>
<div class="book-actions"><button class="book-submit" type="submit">Book appointment</button></div>
</form>
<div class="book-stage">
<figure class="book-portrait"><img src="${A}/book-portrait.png" alt="${alt}"></figure>
<aside class="book-hours">
<h3>Opening times</h3>
<p class="hours-note">Hours published by the clinic. Wednesday, Saturday and Sunday are closed.</p>
<p class="hours-live" data-hours="${hours}"><span class="hours-light" aria-hidden="true"></span><span class="hours-live-label"></span><span class="hours-live-tag">Live</span></p>
${hoursList}
<a class="button book-call" href="tel:01926298102">Call 01926 298 102</a>
</aside>
</div>
</div>
</section>`;

function post(title, text) {
  return `<article class="post"><div class="post-art" aria-hidden="true"><span class="post-geo"></span><span class="post-geo post-geo-b"></span></div><div class="post-body"><p class="flag">Southam Chiropractic</p><h3>${title}</h3><p>${text}</p></div></article>`;
}
const posts = [
  post("Getting you comfortable", "Chiropractic care at Arundel House on Coventry Street."),
  post("Neck and back pain", "The clinic has a specialist interest in neck and back pain."),
  post("Initial appointment", "A case history and examination, taking 30–40 minutes."),
  post("From £30", "The clinic website says treatments start from £30."),
  post("Parking", "A free car park sits behind the clinic, with spaces often available at the front."),
].join("");
const social = `<section class="section social">
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
<div class="social-set">${posts}</div>
<div class="social-set" aria-hidden="true">${posts}</div>
</div>
</div>
</section>`;

const servicesPage = `<section id="services" class="page services-page">
<svg class="guide-line" aria-hidden="true"></svg>
<div class="wrap services-intro">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 4.2h10M3 8h10M3 11.8h6.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg> Services</p>
<h1>What we can help with.</h1>
<p class="lede">Five areas chiropractors commonly help with. Each one is also on the condition list published by Southam Chiropractic.</p>
</div>
<div class="wrap offer-board"><div class="offer-list">${services.map((service) => `<div class="offer-item"><details class="offer-fold" name="listed-offers"${service.num === "01" ? " open" : ""}><summary class="offer-pick"><span>${service.num}</span>${service.name}</summary><article class="offer-panel"><span class="offer-shape offer-local" aria-hidden="true"></span><span class="offer-shape offer-shape-b offer-local" aria-hidden="true"></span><h2>${service.name}</h2><p>${service.short}</p><a class="button solid" href="#${service.id}">More Information</a></article></details></div>`).join("")}</div><div class="offer-stage" aria-hidden="true"><span class="offer-shape"></span><span class="offer-shape offer-shape-b"></span></div></div>
</section>
${services.map((service) => `<section id="${service.id}" class="page service-page" data-shape="0"><div class="service-sheet"><a class="service-back" href="#services"><span class="service-back-mark" aria-hidden="true">←</span> Services</a><div class="service-poster"><div class="service-stamp" aria-hidden="true"><span class="service-num">${service.num}</span><span class="service-blob"></span></div><div class="service-copy"><p class="flag">Southam Chiropractic</p><h1>${service.name}</h1><p class="service-lead">${service.long}</p><p class="service-lead">${service.points}</p><a class="button solid service-cta" href="#contact">Book appointment</a></div></div></div></section>`).join("")}`;

const about = `<section id="about" class="page team-page">
<svg class="guide-line" aria-hidden="true"></svg>
<div class="wrap about-summary">
<div class="about-copy">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M2.8 13.4V6.4L8 3.2l5.2 3.2v7" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M6.4 13.4V9h3.2v4.4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg> About</p>
<h1>Southam Chiropractic</h1>
<div class="about-pair">
<div class="about-lead"><p class="lede">Chiropractic is concerned with the diagnosis, treatment and prevention of mechanical disorders of the musculoskeletal system, and the effects of those disorders on the nervous system and general health. This practice has a specialist interest in neck and back pain, and takes physical, emotional and social wellbeing into account.</p><p class="lede">The chiropractors are also trained to work with pregnant women, babies and children, including gentle care during pregnancy and treatment suitable for children and babies.</p></div>
</div>
<a class="about-next" href="#meet-team"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.2 6.1 8 10.6l4.8-4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Get to know the specialists</span></a>
</div>
<p class="meet-kicker about-team" id="meet-team"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="5.4" cy="5.1" r="1.55" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="10.6" cy="5.1" r="1.55" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2.4 12.4c.35-1.7 1.5-2.6 3-2.6s2.65.9 3 2.6M7.6 12.4c.35-1.7 1.5-2.6 3-2.6s2.65.9 3 2.6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Meet the Team</p>
</div>
<div class="wrap team-board" data-person="0"><div class="team-rail" aria-hidden="true"><span class="team-fall"></span></div><div class="people"><article class="person is-current"><figure class="thumb"><img src="${A}/portrait-a.png" alt="${alt}"></figure><div class="person-card"><h2>Alun</h2><p class="role">Chiropractor</p><p>${personNote}</p></div></article><article class="person"><figure class="thumb"><img src="${A}/portrait-b.png" alt="${alt}"></figure><div class="person-card"><h2>Adam</h2><p class="role">Chiropractor</p><p>${personNote}</p></div></article></div></div>
</section>`;

const contact = `<section id="contact" class="page">
<svg class="guide-line" aria-hidden="true"></svg>
<div class="wrap page-intro">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4.4 2.6h2l.9 2.2-1.2.9a7.4 7.4 0 0 0 3.2 3.2l.9-1.2 2.2.9v2a1.1 1.1 0 0 1-1.2 1.1A8.8 8.8 0 0 1 3.3 3.8a1.1 1.1 0 0 1 1.1-1.2z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg> Contact</p>
<h1>Southam Chiropractic.</h1>
<div class="info-grid"><article class="info-card"><h2>Phone</h2><p><a href="tel:01926298102">01926 298 102</a><br><a href="tel:07793503523">07793 503 523</a></p></article><article class="info-card"><h2>Address</h2><p>Arundel House, 50 Coventry Street, Southam, CV47 0EP</p></article><article class="info-card"><h2>Hours</h2>${hoursList}</article><article class="info-card"><h2>Parking</h2><p>There is a free car park with ample spaces behind the clinic and often spaces outside the front as well.</p></article><article class="info-card"><h2>Email</h2><p><a href="mailto:info@southam-chiropractic.co.uk">info@southam-chiropractic.co.uk</a></p></article></div>
<div class="split">
<form class="sheet" action="#contact" method="post" onsubmit="return false">
<h2>Get in touch</h2>
<p>Call <a class="contact-call" href="tel:01926298102">01926 298 102</a>, or leave a message here. This preview does not send the message.</p>
<p class="hours-live" data-hours="${hours}" data-open="The clinic is open" data-closed="The clinic is closed"><span class="hours-light" aria-hidden="true"></span><span class="hours-live-label"></span><span class="hours-live-tag">Live</span></p>
<p class="map-note">Email <a href="mailto:info@southam-chiropractic.co.uk">info@southam-chiropractic.co.uk</a>.</p>
<label>Name<input name="name" autocomplete="name"></label>
<label>Phone<input name="tel" type="tel" autocomplete="tel"></label>
<label>Message<textarea name="message"></textarea></label>
<button class="button solid" type="submit">Submit message</button>
</form>
<figure class="side-media"><img src="${A}/about-exterior.png" alt="${alt}"></figure>
</div>
<div class="map-frame"><iframe class="map" title="Map of the published address" width="600" height="420" src="https://maps.google.com/maps?q=Arundel%20House%2C%2050%20Coventry%20Street%2C%20Southam%2C%20CV47%200EP&amp;hl=en&amp;z=15&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
<p class="map-note">Arundel House, 50 Coventry Street, Southam, CV47 0EP.</p>
</div>
</section>`;

const reviewsPage = `<section id="reviews" class="page">
<svg class="guide-line" aria-hidden="true"></svg>
<div class="wrap page-intro">
<div>
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="2.1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 1.4v1.7M8 12.9v1.7M1.4 8h1.7M12.9 8h1.7M3.3 3.3l1.2 1.2M11.5 11.5l1.2 1.2M12.7 3.3l-1.2 1.2M4.5 11.5l-1.2 1.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Reviews</p>
<h1>What patients say.</h1>
</div>
<a class="button solid" href="https://www.google.com/maps/search/?api=1&amp;query=Southam%20Chiropractic%2050%20Coventry%20Street%20Southam%20CV47%200EP" target="_blank" rel="noopener noreferrer">Leave a review</a>
</div>
<section class="section reviews">
<div class="wrap">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="2.1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 1.4v1.7M8 12.9v1.7M1.4 8h1.7M12.9 8h1.7M3.3 3.3l1.2 1.2M11.5 11.5l1.2 1.2M12.7 3.3l-1.2 1.2M4.5 11.5l-1.2 1.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Testimonials</p>
${reviewBoard()}
</div>
</section>
</section>`;

function feeCard(price, title, items) {
  return `<article class="fee-card"><span class="fee-gem"><strong>${price}</strong></span><span class="fee-gem fee-gem-sm" aria-hidden="true"></span><h2>${title}</h2><p class="fee-k">Includes</p><ul class="fee-includes">${items.map((item) => `<li>${item}</li>`).join("")}</ul><a class="button solid fee-book" href="#contact">Book</a></article>`;
}
const prices = `<section id="prices" class="page prices-page">
<svg class="guide-line" aria-hidden="true"></svg>
<div class="wrap">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8.4 2.4h4.4v4.4L7.4 12.2 3.2 8 8.4 2.4z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="10.8" cy="4.8" r=".7" fill="currentColor"/></svg> Prices</p>
<h1>Visit prices.</h1>
<p class="flag">The clinic website says treatments start from £30</p>
<p class="lede">These three amounts are shown for this preview. They are not an itemised list on southam-chiropractic.co.uk.</p>
<div class="fee-pair">${feeCard("£45", "Initial Appointment", ["Case history", "Examination of spine, joints, nerves and muscles", "30–40 minutes"])}${feeCard("£40", "Continued Treatment", ["Visits after the first consultation", "Follows the report of findings"])}${feeCard("£40", "Massage", ["Massage appointment", "Ask what is included when you book"])}</div>
</div>
</section>`;

const faq = `<section id="faq" class="page faq-page">
<svg class="guide-line" aria-hidden="true"></svg>
<div class="wrap">
<div class="page-intro">
<div>
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="5.2" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M6.2 6.4c.35-1.1 1.2-1.7 2.2-1.7 1.15 0 2 .7 2 1.8 0 .85-.45 1.35-1.35 1.85-.7.4-.95.7-.95 1.35M8.05 11.7h.02" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> FAQ</p>
<h1>Questions, answered.</h1>
</div>
<p class="lede">From the clinic’s own pages: the first visit, the report of findings, who they see, and when they are open.</p>
</div>
<div class="faq-board">
<details class="faq-item" open>
<summary><span class="faq-num" aria-hidden="true">01</span><strong>What happens at the first visit?</strong><span class="faq-toggle" aria-hidden="true">+</span></summary>
<div class="faq-body">
<p>The clinic asks what you have come for, which may be symptom relief, improving function, preventative care, maintaining health or a check-up. The initial consultation includes a case history and an examination of the spine, joints, nerves and muscles. It takes 30–40 minutes.</p>
</div>
</details>
<details class="faq-item">
<summary><span class="faq-num" aria-hidden="true">02</span><strong>When do I hear the findings?</strong><span class="faq-toggle" aria-hidden="true">+</span></summary>
<div class="faq-body">
<p>After the initial consultation the chiropractor prepares a report of findings and discusses the course of action and treatment plan, if one is needed. Under normal circumstances that conversation is on a different day, so there is time to think and to bring questions.</p>
</div>
</details>
<details class="faq-item">
<summary><span class="faq-num" aria-hidden="true">03</span><strong>Which conditions do you see?</strong><span class="faq-toggle" aria-hidden="true">+</span></summary>
<div class="faq-body">
<p>The clinic lists joint pain, headaches and migraines, muscle pain and spasm, sciatica, back pain, neck pain, shoulder pain and pelvic pain. It has a specialist interest in neck and back pain.</p>
</div>
</details>
<details class="faq-item">
<summary><span class="faq-num" aria-hidden="true">04</span><strong>Do you see children and during pregnancy?</strong><span class="faq-toggle" aria-hidden="true">+</span></summary>
<div class="faq-body">
<p>The clinic says its chiropractors are trained to work with pregnant women, babies and children, including gentle care for discomfort during pregnancy and treatment suitable for children and babies.</p>
</div>
</details>
<details class="faq-item">
<summary><span class="faq-num" aria-hidden="true">05</span><strong>Is there parking?</strong><span class="faq-toggle" aria-hidden="true">+</span></summary>
<div class="faq-body">
<p>There is a free car park with ample spaces behind the clinic and often spaces outside the front as well.</p>
</div>
</details>
<details class="faq-item">
<summary><span class="faq-num" aria-hidden="true">06</span><strong>When are you open?</strong><span class="faq-toggle" aria-hidden="true">+</span></summary>
<div class="faq-body">
<p>Monday, Tuesday and Thursday 10:00–20:00. Friday 10:00–16:00. Wednesday, Saturday and Sunday closed.</p>
</div>
</details>
</div>
<div class="faq-cta">
<a class="button solid" href="#contact">Contact the practice</a>
<a class="button" href="#prices">View prices</a>
</div>
</div>
</section>`;

function cut(html, start, end, insert) {
  const a = html.indexOf(start);
  const b = html.indexOf(end, a + start.length);
  if (a < 0 || b < 0) throw new Error("Missing marker: " + start.slice(0, 60));
  return html.slice(0, a) + insert + html.slice(b);
}

let html = fs.readFileSync(srcPath, "utf8");
html = html.replaceAll("#156b5c", "#1c8494");
html = html.replaceAll("--pale:#d8ebe7", "--pale:#d6eef2");
html = html.replaceAll("rgba(21,107,92,.18)", "rgba(28,132,148,.18)");
html = html.replace(".logo{width:42px;height:42px;object-fit:contain;display:block}", ".logo{width:168px;height:82px;object-fit:contain;display:block}");
html = html.replace(".footer-logo{display:block;width:42px;height:42px;object-fit:contain}", ".footer-logo{display:block;width:168px;height:82px;object-fit:contain}");
html = html.replace(".footer-pill{display:inline-flex;align-items:center;max-width:16em;", ".footer-pill{display:inline-flex;align-items:center;max-width:none;");
html = html.replace(".promo-offer-board{display:grid;grid-template-columns:108px minmax(0,1fr);", ".promo-offer-board{display:grid;grid-template-columns:132px minmax(0,1fr);");
html = html.replace(".fee-pair{display:grid;grid-template-columns:1fr 1fr;gap:18px}", ".fee-pair{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}");
html = html.replace(".hero-media img.fit-facade{left:25%;width:75%;right:auto;object-position:center 68%;transform:scale(1.08) translateX(75px);transform-origin:center center}", ".hero-media img.fit-facade{left:0;width:100%;object-fit:cover;object-position:68% 28%;transform:none}");
html = html.replace(".hero-media img.fit-facade{left:0;width:100%;right:auto;transform:translateY(-18%);object-position:center 72%}", ".hero-media img.fit-facade{left:0;width:100%;transform:none;object-position:center 30%}");

html = cut(html, '<meta name="description"', "<meta name=\"generator\"", `<meta name="description" content="Southam Chiropractic at Arundel House, 50 Coventry Street, Southam. Neck and back pain, an initial consultation of 30–40 minutes, and treatments from £30. Call 01926 298 102.">\n`);
html = html.replace("<title>45 The Green Dental Practice | Private Dentist in Banbury</title>", "<title>Southam Chiropractic | Chiropractor in Southam</title>");
html = html.replace(
  `<div class="banner"><p class="banner-note">Private dental care in Banbury · New patients welcome</p><p class="banner-contact"><span class="banner-address">45 The Green, OX16 9AB</span><span class="banner-gap" aria-hidden="true">|</span><a href="tel:01295261566">01295 261566</a></p></div>`,
  `<div class="banner"><p class="banner-note">Chiropractic in Southam · Getting you comfortable</p><p class="banner-contact"><span class="banner-address">50 Coventry Street, CV47 0EP</span><span class="banner-gap" aria-hidden="true">|</span><a href="tel:01926298102">01926 298 102</a></p></div>`,
);
html = html.replace(
  `<a class="brand" href="#home"><img class="logo" src="/factory-assets/clients/45-the-green/logo.svg" alt="45 The Green Dental Practice" width="42" height="42"></a>\n<span class="wordmark"><span><strong>Dental Practice</strong><small>Banbury</small></span></span>`,
  `<a class="brand" href="#home"><img class="logo" src="${A}/logo.svg" alt="Southam Chiropractic" width="168" height="82"></a>\n<span class="wordmark"><span><strong>Chiropractic</strong><small>Southam</small></span></span>`,
);
html = html.replace(
  `<div class="menu-panel"><a href="#service-general-and-preventive-dentistry">General and Preventive Dentistry</a><a href="#service-restorative-and-advanced-dentistry">Restorative and Advanced Dentistry</a><a href="#service-cosmetic-dentistry">Cosmetic Dentistry</a><a href="#service-family-dentistry">Family Dentistry</a><a href="#service-dental-emergencies">Dental emergencies</a><a href="#service-dental-implants">Dental implants</a><a href="#service-denplan">Denplan</a></div>`,
  `<div class="menu-panel">${services.map((service) => `<a href="#${service.id}">${service.name}</a>`).join("")}</div>`,
);
html = html.replace(
  `<h1>Private Dentistry in Banbury<span class="title-stop"></span></h1>\n<div class="hero-aside">\n<p class="lede">Feel Confident About Your Smile.<br>Trusted in this location for over 100 years.</p>`,
  `<h1>Chiropractic in Southam<span class="title-stop"></span></h1>\n<div class="hero-aside">\n<p class="lede">Getting you comfortable.<br>A specialist interest in neck and back pain.</p>`,
);
html = html.replace(
  `<figure class="hero-media"><img class="fit-facade" src="/factory-assets/clients/45-the-green/practice-exterior.jpg" alt="45 The Green Dental Practice on South Bar Street, Banbury."></figure>`,
  `<figure class="hero-media"><img class="fit-facade" src="${A}/chiro-landing.png" alt="${alt}"></figure>`,
);
html = html.replaceAll("tel:01295261566", "tel:01926298102");
html = html.replaceAll("01295 261566", "01926 298 102");
html = html.replace(
  `<a class="hero-card" href="#new-patient"><span class="hero-face"><span class="mini" aria-hidden="true"></span><span class="hero-copy"><strong>New Patients</strong><em>Welcoming new patients</em></span>`,
  `<a class="hero-card" href="#new-patient"><span class="hero-face"><span class="mini" aria-hidden="true"></span><span class="hero-copy"><strong>Initial visit</strong><em>30–40 minutes</em></span>`,
);
html = html.replace(
  `<strong>45 The Green, South Bar Street, Banbury, Oxford, OX16 9AB</strong><em>Location</em>`,
  `<strong>Arundel House, 50 Coventry Street, Southam, CV47 0EP</strong><em>Location</em>`,
);

html = cut(html, '<section class="wrap statement promo-statement mist"', '<section class="section">\n<div class="wrap service-split"', promo + "\n");
html = cut(html, '<section class="section">\n<div class="wrap service-split"', '<section class="section mist meet">', serviceSplit + "\n");
html = cut(html, '<section class="section mist meet">', '<section class="section reviews">', meet + "\n");
html = cut(html, '<section class="section reviews">', '<section class="section book">', homeReviews + "\n");
html = cut(html, '<section class="section book">', '<section class="section social">', book + "\n");
html = cut(html, '<section class="section social">', '<section class="wrap statement mist">', social + "\n");
html = cut(html, '<section class="wrap statement mist">', '<section id="services"', "</section>\n");
html = html.replaceAll(
  "body:has(#service-general-and-preventive-dentistry:target),body:has(#service-restorative-and-advanced-dentistry:target),body:has(#service-cosmetic-dentistry:target),body:has(#service-family-dentistry:target),body:has(#service-dental-emergencies:target),body:has(#service-dental-implants:target),body:has(#service-denplan:target)",
  services.map((service) => `body:has(#${service.id}:target)`).join(","),
);
html = html.replace(
  'body:has(#service-general-and-preventive-dentistry:target) .menu-panel a[href="#service-general-and-preventive-dentistry"]{background:var(--pale)}body:has(#service-restorative-and-advanced-dentistry:target) .menu-panel a[href="#service-restorative-and-advanced-dentistry"]{background:var(--pale)}body:has(#service-cosmetic-dentistry:target) .menu-panel a[href="#service-cosmetic-dentistry"]{background:var(--pale)}body:has(#service-family-dentistry:target) .menu-panel a[href="#service-family-dentistry"]{background:var(--pale)}body:has(#service-dental-emergencies:target) .menu-panel a[href="#service-dental-emergencies"]{background:var(--pale)}body:has(#service-dental-implants:target) .menu-panel a[href="#service-dental-implants"]{background:var(--pale)}body:has(#service-denplan:target) .menu-panel a[href="#service-denplan"]{background:var(--pale)}',
  services.map((service) => `body:has(#${service.id}:target) .menu-panel a[href="#${service.id}"]{background:var(--pale)}`).join(""),
);
html = cut(html, '<section id="services"', '<section id="about"', servicesPage + "\n");
html = cut(html, '<section id="about"', '<section id="contact"', about + "\n");
html = cut(html, '<section id="contact"', '<section id="reviews"', contact + "\n");
html = cut(html, '<section id="reviews"', '<section id="prices"', reviewsPage + "\n");
html = cut(html, '<section id="prices"', '<section id="faq"', prices + "\n");
html = cut(html, '<section id="faq"', "</main>", faq + "\n");

html = html.replace(
  `<a class="footer-brand" href="#home"><span class="footer-pill"><img class="footer-logo" src="/factory-assets/clients/45-the-green/logo.svg" alt="45 The Green Dental Practice" width="42" height="42"></span></a>`,
  `<a class="footer-brand" href="#home"><span class="footer-pill"><img class="footer-logo" src="${A}/logo.svg" alt="Southam Chiropractic" width="168" height="82"></span></a>`,
);
html = html.replace(
  `<p class="footer-note">Feel Confident About Your Smile.
Trusted in this location for over 100 years.
Currently taking on new patients.</p>`,
  `<p class="footer-note">Getting you comfortable.
Chiropractic care on Coventry Street.
Specialist interest in neck and back pain.</p>`,
);
html = html.replace(
  `<p>45 The Green, South Bar Street, Banbury, Oxford, OX16 9AB</p>\n<p>Monday 8:30–18:15 · Tuesday 8:30–18:15 · Wednesday 8:30–19:00 · Thursday 8:30–17:30 · Friday 8:30–17:00 · Saturday by appointment</p>`,
  `<p>Arundel House, 50 Coventry Street, Southam, CV47 0EP</p>\n<p>Monday to Tuesday 10:00–20:00 · Wednesday closed · Thursday 10:00–20:00 · Friday 10:00–16:00 · Saturday and Sunday closed</p>`,
);
html = html.replace(
  `<label class="book-choice"><input type="radio" name="setter-enquiry" value="Cosmetic">Cosmetic</label><label class="book-choice"><input type="radio" name="setter-enquiry" value="Preventative">Preventative</label><label class="book-choice"><input type="radio" name="setter-enquiry" value="Emergency">Emergency</label><label class="book-choice"><input type="radio" name="setter-enquiry" value="Check-Up">Check-Up</label><label class="book-choice"><input type="radio" name="setter-enquiry" value="General Enquiry">General Enquiry</label><label class="book-choice"><input type="radio" name="setter-enquiry" value="Unsure">Unsure</label>`,
  `<label class="book-choice"><input type="radio" name="setter-enquiry" value="Initial appointment">Initial appointment</label><label class="book-choice"><input type="radio" name="setter-enquiry" value="Continued treatment">Continued treatment</label><label class="book-choice"><input type="radio" name="setter-enquiry" value="Massage">Massage</label><label class="book-choice"><input type="radio" name="setter-enquiry" value="General enquiry">General enquiry</label>`,
);

const visible = html.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, "");
const leftovers = ["45 The Green", "Banbury", "Denplan", "dentist", "01295", "OX16", "Dental implants", "whitening"];
const hits = leftovers.filter((word) => visible.toLowerCase().includes(word.toLowerCase()));
if (hits.length) {
  console.error("Leftover dental copy:", hits.join(", "));
  process.exitCode = 1;
}

fs.writeFileSync(path.join(outDir, "index.html"), html);
console.log("Wrote", path.join(outDir, "index.html"), html.length);
