import fs from "fs";
import crypto from "crypto";

const src = fs.readFileSync("public/preview/halesowen-foot-clinic/index.html", "utf8");
let html = src;

const accent = "#113B66";
const pale = "#D8E2EC";
const asset = (name) => `assets/${name}`;
const tpl = (name) => `/factory-assets/clients/45-the-green/${name}`;

const phone = "01926 945 007";
const phoneTel = "01926945007";
const mobile = "07807 635 112";
const mobileTel = "07807635112";

const services = [
  {
    id: "nail-surgery",
    name: "Nail Surgery",
    short: "Permanent removal of all or part of a painful toenail, with aftercare included.",
    long: "A procedure where either a portion or the whole toenail is permanently removed — often because of damage, involution or an ingrown toenail, and sometimes infection. At Tidy Feet, surgery and aftercare are offered together.",
    points: "Partial or full nail removal · Local anaesthetic · Surgery and aftercare · Package pricing from the clinic fee list",
    img: asset("service-nail-surgery.jpg"),
    imgAlt: "Nail care photograph from Tidy Feet Podiatry.",
    flag: "Care at Tidy Feet",
  },
  {
    id: "insoles",
    name: "Insoles",
    short: "Custom and ready-made insole therapy after consultation and assessment.",
    long: "Insole therapy is provided where appropriate, following an in-depth consultation and assessment. Custom devices are made locally by an orthotist in Northamptonshire; over-the-counter devices are supplied by Sidas.",
    points: "Consultation before prescription · Custom casted devices · Footbed-type insoles · Recover of existing devices",
    img: asset("service-insoles.jpg"),
    imgAlt: "Insole photograph from Tidy Feet Podiatry.",
    flag: "Care at Tidy Feet",
  },
  {
    id: "gait-analysis",
    name: "Gait Analysis",
    short: "Observation of how you move, often linked to injury assessment and insole planning.",
    long: "Gait analysis observes and helps explain patterns of movement. It often supports understanding of injury or disease processes, links closely to assessment before insole prescription, and in some cases leads to a referral to a surgeon.",
    points: "Movement pattern assessment · Injury and disease context · Linked to insole planning · Referral when appropriate",
    img: asset("service-gait-analysis.png"),
    imgAlt: "Lower-limb assessment photograph from Tidy Feet Podiatry.",
    flag: "Care at Tidy Feet",
  },
  {
    id: "verruca-treatment",
    name: "Verruca Treatment",
    short: "Needling and K-Laser options for verrucae, including follow-up appointments.",
    long: "Verruca treatment options include needling and K-Laser. Verruca needling is recognised as a treatment that does not leave scar tissue; anaesthetic makes the procedure comfortable. Treatment forms part of a package that includes follow-up appointments.",
    points: "Needling with anaesthetic · K-Laser options · Package including follow-up · Discussed before treatment starts",
    img: tpl("staff-reception.jpg"),
    imgAlt: "Illustrative clinic image. Not a photograph of Tidy Feet staff or premises — replace with a verruca service photograph when available.",
    flag: "Care at Tidy Feet",
    needsPhoto: true,
  },
  {
    id: "general-footcare",
    name: "General Footcare & Referrals",
    short: "Tailored foot care that changes with your needs, with referrals when required.",
    long: "Foot care depends on each patient’s needs. Care is reviewed as short-term issues resolve or longer-term health changes. Tidy Feet refers patients to other services, consults with GPs, and liaises with podiatry and orthopaedic surgeons when needed.",
    points: "Individual care plans · Ongoing review · GP and specialist liaison · New-patient and follow-up appointments",
    img: asset("service-general-footcare.jpg"),
    imgAlt: "Foot care photograph from Tidy Feet Podiatry.",
    flag: "Care at Tidy Feet",
  },
  {
    id: "laser-treatment",
    name: "Laser Treatment",
    short: "K-Laser and Lunula Laser for fungal nails, verrucae, plantar fasciitis and soft-tissue issues.",
    long: "Tidy Feet provides K-Laser and Lunula Laser systems used for conditions including fungal nail infections, verrucae, plantar fasciitis, sprains and other soft-tissue ailments. Prices depend on the agreed treatment package.",
    points: "K-Laser · Lunula Laser · Fungal nails and verrucae · Soft-tissue support · Package explained before treatment",
    img: tpl("treatment-room.jpg"),
    imgAlt: "Illustrative treatment room. Not a photograph of Tidy Feet premises — replace with a laser service photograph when available.",
    flag: "Care at Tidy Feet",
    needsPhoto: true,
  },
];

const reviews = [
  {
    name: "Mr N",
    flag: "Tidy Feet client",
    quote:
      "I am 71 years, and still follow my profession as a shepherd. Since I walk a great deal, and have done so all my life, my feet are very important to me. The last few years I have had problems with a severe fungal growth under the nail of my right big toe. This toe is also somewhat distorted due to having been trodden on many times over the years by horses. Mrs Deborah Coleman has treated and trimmed the nail of this toe, and the rest of my toes, and this has my feet much more comfortable, and my right big toe much less painful. I am very grateful for this treatment.",
  },
  {
    name: "Mrs G",
    flag: "Tidy Feet client",
    quote:
      "I am a 66 year old female who visited Tidy Feet after a fall, and post concussion syndrome. I have been delighted with the results of my two visits with Deborah Coleman at Tidy Feet. Her interest in foot health encompasses a whole body approach, and I could, listening to her, see that my heel pain had a larger context in which the symptoms were exacerbated. Her diagnosis was spot on. She demonstrated what she was needing to do, and why, and how to maintain the effect of immediate relief. Could not have had a more effective treatment. Her recommendation as to shoes that would work, plus posture and exercise have continued to keep me well.",
  },
  {
    name: "Mrs M",
    flag: "Tidy Feet client",
    quote:
      "When my daughter, aged 5, developed an ingrowing toenail Deborah treated her problem with the utmost professionalism. Deborah carried out the treatment for my daughter, in our home, so as to ensure my daughter was as comfortable as possible. My daughter was extremely nervous and Deborah immediately put her at ease by explaining exactly what she was doing and why. A very painless and successful moment later the problem was gone and my daughter was a very happy little girl again. Whilst treating this Deborah also gave me advice on how to avoid this in the future, including what instruments were best and how to use them.",
  },
];

const reviewPhotos = [
  tpl("e3232f8afe224d56-review-photo.png"),
  tpl("9a4bd25078f1a5ea-book-portrait.png"),
  tpl("waiting-room.jpg"),
];

function reviewBoard(aria) {
  const picks = reviews
    .map(
      (r, i) =>
        `<button class="review-pick" type="button" role="tab" aria-selected="${i === 0 ? "true" : "false"}"><strong>${r.name}</strong></button>`
    )
    .join("");
  const photos = reviews
    .map(
      (r, i) =>
        `<figure class="review-photo"${i ? ' aria-hidden="true"' : ""}><img src="${reviewPhotos[i]}" alt="Illustrative clinic image. Not a photograph of a reviewer or of Tidy Feet staff."></figure>`
    )
    .join("");
  const quotes = reviews
    .map(
      (r, i) =>
        `<article class="review-quote"${i ? ' aria-hidden="true"' : ""}><p class="flag">${r.flag}</p><h3>${r.name}</h3><p>${r.quote}</p></article>`
    )
    .join("");
  return `<div class="review-board" data-active="0"><div class="review-list" role="tablist" aria-label="${aria}">${picks}</div><div class="review-photos">${photos}</div><div class="review-quotes">${quotes}</div><div class="review-nav"><button class="meet-arrow review-prev" type="button" aria-label="Previous review"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3.2 5.2 8 10 12.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="meet-arrow review-next" type="button" aria-label="Next review"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3.2 10.8 8 6 12.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div>`;
}

html = html.replace(/--accent:#2A7A72;--on:#ffffff;--pale:#D8EDEA/, `--accent:${accent};--on:#ffffff;--pale:${pale}`);
html = html.replaceAll("#2A7A72", accent);

html = html.replace(
  /<meta name="description" content="[^"]*">/,
  `<meta name="description" content="Tidy Feet Podiatry — walking well in Warwickshire. Clinics in Southam and Stratford-upon-Avon. Call ${phone}.">`
);
html = html.replace(/<title>[^<]*<\/title>/, `<title>Tidy Feet Podiatry | Walking Well in Warwickshire</title>`);

const oldServiceIds = ["general-footcare", "home-visits", "nail-care", "verruca-treatment", "insoles"];
const newServiceIds = services.map((s) => s.id);
const oldHas = oldServiceIds.map((id) => `body:has(#service-${id}:target)`).join(",");
const newHas = newServiceIds.map((id) => `body:has(#service-${id}:target)`).join(",");
html = html.replaceAll(oldHas, newHas);

const oldMenuStyles = oldServiceIds
  .map((id) => `body:has(#service-${id}:target) .menu-panel a[href="#service-${id}"]{background:var(--pale)}`)
  .join("");
const newMenuStyles = newServiceIds
  .map((id) => `body:has(#service-${id}:target) .menu-panel a[href="#service-${id}"]{background:var(--pale)}`)
  .join("");
html = html.replace(oldMenuStyles, newMenuStyles);

html = html.replace(
  /\.service-split\[data-active="0"\][\s\S]*?\.service-split\[data-active="4"\] \.service-links button:nth-child\(5\)\{font-weight:600\}/,
  (() => {
    let css = "";
    for (let i = 0; i < 6; i++) {
      css += `.service-split[data-active="${i}"] .shots .shot{opacity:0;visibility:hidden}.service-split[data-active="${i}"] .shots .shot:nth-child(${i + 1}){opacity:1;visibility:visible}.service-split[data-active="${i}"] .service-links button{font-weight:500}.service-split[data-active="${i}"] .service-links button:nth-child(${i + 1}){font-weight:600}`;
    }
    return css;
  })()
);

html = html.replace(
  /<div class="banner">[\s\S]*?<\/div>\n<a class="skip"/,
  `<div class="banner"><p class="banner-note">Tidy Feet Podiatry · Walking well in Warwickshire</p><p class="banner-contact"><span class="banner-address">Southam &amp; Stratford-upon-Avon</span><span class="banner-gap" aria-hidden="true">|</span><a href="tel:${phoneTel}">${phone}</a></p></div>\n<a class="skip"`
);

html = html.replace(
  /<a class="brand" href="#home" aria-label="[^"]*">[\s\S]*?<\/a>\n<\/div>\n<nav/,
  `<a class="brand" href="#home" aria-label="Tidy Feet Podiatry"><img class="logo" src="${asset("logo.png")}" alt="" width="42" height="42"><span class="wordmark"><span><strong>Tidy Feet</strong><small>Podiatry</small></span></span></a>\n</div>\n<nav`
);

const menuLinks = services.map((s) => `<a href="#service-${s.id}">${s.name}</a>`).join("");
html = html.replace(
  /<div class="menu-panel">[\s\S]*?<\/div><\/li>\n<li><a href="#about">About<\/a><\/li>/,
  `<div class="menu-panel">${menuLinks}</div></li>\n<li><a href="#about">About</a></li>`
);

html = html.replace(
  /<a class="button header-cta" href="#contact">Contact<\/a>/,
  `<a class="button header-cta" href="tel:${phoneTel}">Book Now</a>`
);

html = html.replace(
  /<h1>Podiatry Care in Halesowen<span class="title-stop"><\/span><\/h1>\s*<div class="hero-aside">\s*<p class="lede">[\s\S]*?<\/p>/,
  `<h1>Walking Well in Warwickshire<span class="title-stop"></span></h1>
<div class="hero-aside">
<p class="lede">Your feet matter.<br>Clinics in Southam and Stratford-upon-Avon with Deborah Coleman.</p>`
);

html = html.replace(
  /<a class="button" href="#contact">Book an Appointment<\/a>/,
  `<a class="button" href="tel:${phoneTel}">Book an Appointment</a>`
);

html = html.replace(
  /stroke="#2A7A72"/g,
  `stroke="${accent}"`
);

html = html.replace(
  /<figure class="hero-media"><img class="landing-care" src="[^"]*" alt="[^"]*"><\/figure>/,
  `<figure class="hero-media"><img class="fit-facade" src="${tpl("practice-exterior.jpg")}" alt="Illustrative clinic exterior. Not a photograph of Tidy Feet premises."></figure>`
);

html = html.replace(
  /<div class="hero-cards">[\s\S]*?<\/div>\n<\/div>\n<\/div>\n<section class="section mist">/,
  `<div class="hero-cards"><a class="hero-card" href="#services"><span class="hero-face"><span class="mini" aria-hidden="true"></span><span class="hero-copy"><strong>Services</strong><em>Open the list.</em></span><span class="hero-go" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span></a><a class="hero-card" href="tel:${phoneTel}"><span class="hero-face"><span class="mini" aria-hidden="true"></span><span class="hero-copy"><strong>${phone}</strong><em>Phone</em></span><span class="hero-go" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span></a><a class="hero-card" href="https://www.google.com/maps/search/?api=1&amp;query=Tidy%20Feet%20Podiatry%2074B%20Coventry%20Street%20Southam%20CV47%200EA" target="_blank" rel="noopener noreferrer"><span class="hero-face"><span class="mini" aria-hidden="true"></span><span class="hero-copy"><strong>74B Coventry Street, Southam, CV47 0EA</strong><em>Southam clinic</em></span><span class="hero-go" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span></a></div>
</div>
</div>
<section class="section mist">`
);

const serviceButtons = services.map((s) => `<button type="button">${s.name}</button>`).join("");
const accordion = services
  .map(
    (s) =>
      `<details name="listed-services"><summary>${s.name}</summary><div class="accordion-panel"><figure class="tile-media"><img src="${s.img}" alt="${s.imgAlt}"></figure><p class="shot-copy"><span><strong>${s.name}</strong><em>${s.short}</em></span><a class="button" href="#service-${s.id}">More Information</a></p></div></details>`
  )
  .join("");
const shots = services
  .map(
    (s) =>
      `<div class="shot"><figure class="tile-media"><img src="${s.img}" alt="${s.imgAlt}"></figure><p class="shot-copy"><span><strong>${s.name}</strong><em>${s.short}</em></span><a class="button" href="#service-${s.id}">More Information</a></p></div>`
  )
  .join("");

html = html.replace(
  /<section class="section mist">[\s\S]*?<\/section>\n<section class="section band meet">/,
  `<section class="section mist">
<div class="wrap service-split" data-active="0">
<div class="service-side">
<p class="kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 4.2h10M3 8h10M3 11.8h6.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg> Services</p>
<h2>Care for comfortable feet.</h2>
<p class="lede">Six services from the Tidy Feet services page — nail surgery, insoles, gait analysis, verruca care, general footcare and laser treatment.</p>
<nav class="service-links" aria-label="Services">${serviceButtons}</nav>
<div class="service-accordion">${accordion}<a class="button accordion-book" href="tel:${phoneTel}">Call to book</a></div>
</div>
<div class="shots">${shots}</div>
</div>
</section>
<section class="section band meet">`
);

html = html.replace(
  /<div class="meet-stage">[\s\S]*?<\/div>\n<\/div>\n<\/section>\n<section class="section reviews">/,
  `<div class="meet-stage"><article class="meet-slide is-on"><figure class="meet-photo"><img class="anchor-face" src="${asset("deborah-coleman.jpg")}" alt="Deborah Coleman, podiatrist at Tidy Feet Podiatry."></figure><div class="meet-card"><h3>Deborah Coleman</h3><p class="meet-role">Podiatrist · BSc (Hons) MChS · HCPC CH8559</p><p>Deborah opened Tidy Feet in Southam in September 2007 and has practised in Stratford-upon-Avon since 2010. A former nurse (RGN), she holds a BSc (Hons) MChS, is a member of the Royal College of Podiatrists, and is registered with the HCPC (CH8559). She has been qualified since 2007.</p><a class="button meet-book" href="tel:${phoneTel}"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="2.2" y="3.2" width="11.6" height="10.6" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M2.2 6.4h11.6M5.2 2v2.6M10.8 2v2.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg> Call to book</a></div></article></div>
</div>
</section>
<section class="section reviews">`
);

html = html.replace(
  /<section class="section reviews">\n<div class="wrap">\n<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="2\.1"[\s\S]*?<\/section>\n<section class="section book">/,
  `<section class="section reviews">
<div class="wrap">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="2.1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 1.4v1.7M8 12.9v1.7M1.4 8h1.7M12.9 8h1.7M3.3 3.3l1.2 1.2M11.5 11.5l1.2 1.2M12.7 3.3l-1.2 1.2M4.5 11.5l-1.2 1.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Testimonials</p>
<h2>Patient reviews</h2>
<a class="button review-leave-link" href="https://www.tidyfeet.co.uk/contact" target="_blank" rel="noopener noreferrer">Visit tidyfeet.co.uk</a>
${reviewBoard("Tidy Feet client testimonials")}
</div>
</section>
<section class="section book">`
);

const hoursData =
  "Tuesday, 08:00–12:30, Tuesday, 13:30–18:00, Wednesday, 08:00–12:30, Wednesday, 13:30–18:00, Thursday, 08:30–17:00";

html = html.replace(
  /<section class="section book">[\s\S]*?<\/section>\n<section class="section social">/,
  `<section class="section book">
<div class="wrap book-layout">
<form class="book-form" action="#contact" method="get" onsubmit="return false">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="2.1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 1.4v1.7M8 12.9v1.7M1.4 8h1.7M12.9 8h1.7M3.3 3.3l1.2 1.2M11.5 11.5l1.2 1.2M12.7 3.3l-1.2 1.2M4.5 11.5l-1.2 1.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Schedule</p>
<h2>Book your appointment</h2>
<p class="book-note">There is no separate online booking system on the Tidy Feet website — “Book a consultation” opens their contact page. Please call <a href="tel:${phoneTel}">${phone}</a> or <a href="tel:${mobileTel}">${mobile}</a>. Appointments usually last 30 minutes; initial and assessment appointments are about 45 minutes. This form does not send a request.</p>
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
<div class="book-actions"><a class="book-submit" href="tel:${phoneTel}" style="display:inline-flex;align-items:center;justify-content:center;text-decoration:none">Call ${phone}</a></div>
</form>
<div class="book-stage">
<figure class="book-portrait"><img src="${tpl("9a4bd25078f1a5ea-book-portrait.png")}" alt="Illustrative portrait. Not a photograph of Tidy Feet staff."></figure>
<aside class="book-hours">
<h3>Opening times</h3>
<p class="hours-note">Southam: Tuesday and Wednesday 8:00–12:30 and 13:30–18:00; Friday by special appointment. Stratford: Thursday 8:30–17:00; Monday by special appointment.</p>
<p class="hours-live" data-hours="${hoursData}"><span class="hours-light" aria-hidden="true"></span><span class="hours-live-label"></span><span class="hours-live-tag">Live</span></p>
<ul class="hours-list">
<li><span>Mon (Stratford)</span><strong>Special appt</strong></li>
<li><span>Tue (Southam)</span><strong>8:00–12:30, 13:30–18:00</strong></li>
<li><span>Wed (Southam)</span><strong>8:00–12:30, 13:30–18:00</strong></li>
<li><span>Thu (Stratford)</span><strong>8:30 – 17:00</strong></li>
<li><span>Fri (Southam)</span><strong>Special appt</strong></li>
<li><span>Saturday</span><strong>Closed</strong></li>
<li><span>Sunday</span><strong>Closed</strong></li>
</ul>
<a class="button book-call" href="tel:${phoneTel}">Call ${phone}</a>
</aside>
</div>
</div>
</section>
<section class="section social">`
);

const socialPosts = [
  ["Walking well", "Clinics in Southam and Stratford-upon-Avon — your feet matter."],
  ["Southam clinic", "74B Coventry Street, Southam, CV47 0EA. Tuesday and Wednesday clinics."],
  ["Stratford clinic", "Trinity House, Aintree Road, Stratford-upon-Avon, CV37 9FL. Thursday clinics."],
  ["Deborah Coleman", "BSc (Hons) MChS, HCPC CH8559 — qualified since 2007."],
  ["Book by phone", `Call ${phone} or ${mobile} to arrange an appointment.`],
  ["Since 2007", "Opened in Southam in September 2007; Stratford clinic since 2010."],
];
const socialSet = socialPosts
  .map(
    ([title, body]) =>
      `<article class="post"><div class="post-art" aria-hidden="true"><span class="post-geo"></span><span class="post-geo post-geo-b"></span></div><div class="post-body"><p class="flag">Tidy Feet Podiatry</p><h3>${title}</h3><p>${body}</p></div></article>`
  )
  .join("");

html = html.replace(
  /<section class="section social">[\s\S]*?<\/section>\n<section class="wrap statement">/,
  `<section class="section social">
<div class="wrap social-head">
<div>
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="5" cy="8" r="2.2" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="11" cy="4.5" r="1.7" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="11" cy="11.5" r="1.7" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M7 7.2 9.4 5.4M7.1 8.8l2.2 1.8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg> Social</p>
<h2>Recent posts</h2>
<p class="social-lede">Notes drawn from tidyfeet.co.uk. This strip is not a live feed.</p>
</div>
<button class="social-pause" type="button" aria-pressed="false">Pause</button>
</div>
<div class="social-marquee">
<div class="social-track">
<div class="social-set">${socialSet}</div>
<div class="social-set" aria-hidden="true">${socialSet}</div>
</div>
</div>
</section>
<section class="wrap statement">`
);

html = html.replace(
  /<section class="wrap statement">[\s\S]*?<\/section>\n<section class="wrap statement promo-statement"[^>]*>[\s\S]*?<\/section>\n<\/section>\n<section id="services"/,
  `<section class="wrap statement">
<div class="vision">
<div>
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M2.8 13.4V6.4L8 3.2l5.2 3.2v7" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M6.4 13.4V9h3.2v4.4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg> Why Us?</p>
<h2>Trusted care in Warwickshire.</h2>
</div>
<div class="vision-side">
<p>Tidy Feet Podiatry has cared for feet in Southam since 2007 and in Stratford-upon-Avon since 2010, led by Deborah Coleman.</p>
</div>
</div>
<div class="stat-board" data-stat="patients">
<div class="rails">
<button class="rail rail-patients" type="button" data-stat="patients"><span>Two clinics</span></button>
<button class="rail rail-reviews" type="button" data-stat="reviews"><span>HCPC registered</span></button>
<button class="rail rail-years" type="button" data-stat="years"><span>Since 2007</span></button>
</div>
<div class="stat-stage">
<span class="geo" aria-hidden="true"></span>
<div class="stat-show show-patients">
<p class="flag">Warwickshire</p>
<p class="stat-num">2</p>
<p>Clinics in Southam and Stratford-upon-Avon — choose the location that suits you.</p>
<a class="button" href="tel:${phoneTel}">Call to book</a>
</div>
<div class="stat-show show-reviews">
<p class="flag">Professional standards</p>
<p class="stat-num">HCPC</p>
<p>Deborah is registered with the Health and Care Professions Council — registration number CH8559.</p>
<a class="button" href="tel:${phoneTel}">Call to book</a>
</div>
<div class="stat-show show-years">
<p class="flag">Experience</p>
<p class="stat-num">2007</p>
<p>Qualified since 2007; Southam clinic opened that September, with Stratford added in 2010.</p>
<a class="button" href="tel:${phoneTel}">Call to book</a>
</div>
</div>
</div>
</section>
<section class="wrap statement promo-statement" aria-label="Clinic highlights">
<div class="promo-intro">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8.4 2.4h4.4v4.4L7.4 12.2 3.2 8 8.4 2.4z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="10.8" cy="4.8" r=".7" fill="currentColor"/></svg> Highlights</p>
<h2>Care that starts clearly</h2>
<p><span class="promo-lede-full">Podiatry in Warwickshire with published services from nail surgery and insoles to gait analysis, verruca care, general footcare and laser treatment.</span><span class="promo-lede-short">Southam and Stratford clinics with clear, published podiatry services.</span></p>
</div>
<div class="stat-board promo-offer-board" data-stat="whitening">
<div class="rails" role="tablist" aria-label="Clinic highlights">
<button class="rail rail-whitening" type="button" role="tab" data-stat="whitening" aria-pressed="true"><span class="rail-label">Southam</span><span class="rail-price">CV47 0EA</span></button>
<button class="rail rail-consult" type="button" role="tab" data-stat="consult" aria-pressed="false"><span class="rail-label">Stratford</span><span class="rail-price">CV37 9FL</span></button>
<button class="rail rail-denplan" type="button" role="tab" data-stat="denplan" aria-pressed="false"><span class="rail-label">Booking</span><span class="rail-price">By phone</span></button>
</div>
<div class="stat-stage">
<div class="stat-show show-whitening">
<div class="offer-copy">
<h3>Southam clinic</h3>
<p class="stat-num">Tue–Wed</p>
<p class="offer-detail">74B Coventry Street, Southam, CV47 0EA. Open Tuesday and Wednesday 8:00–12:30 and 13:30–18:00; Friday by special appointment.</p>
<a class="offer-link" href="tel:${phoneTel}">Call to arrange →</a>
</div>
<div class="offer-side">
<figure class="offer-visual"><img src="${tpl("waiting-room.jpg")}" alt="Illustrative clinic image. Not a photograph of Tidy Feet premises."></figure>
</div>
</div>
<div class="stat-show show-consult">
<div class="offer-copy">
<h3>Stratford clinic</h3>
<p class="stat-num">Thu</p>
<ul>
<li>Trinity House, Aintree Road, Stratford-upon-Avon, CV37 9FL</li>
<li>Thursday 8:30–17:00</li>
<li>Monday by special appointment</li>
</ul>
<a class="offer-link" href="tel:${phoneTel}">Call to arrange →</a>
</div>
<div class="offer-side">
<figure class="offer-visual"><img src="${tpl("staff-reception.jpg")}" alt="Illustrative clinic image. Not a photograph of Tidy Feet staff."></figure>
</div>
</div>
<div class="stat-show show-denplan">
<div class="offer-copy">
<h3>Book by telephone</h3>
<p class="stat-num">Call</p>
<p class="offer-detail">${phone} or ${mobile}. No separate online booking system is published — use the contact details on tidyfeet.co.uk.</p>
<a class="offer-link" href="tel:${phoneTel}">Call to arrange →</a>
</div>
<div class="offer-side">
<figure class="offer-visual"><img src="${tpl("treatment-room.jpg")}" alt="Illustrative treatment room. Not a photograph of Tidy Feet premises."></figure>
</div>
</div>
</div>
</div>
</section>
</section>
<section id="services"`
);

const offerItems = services
  .map(
    (s, i) =>
      `<div class="offer-item"><details class="offer-fold" name="listed-offers"${i === 0 ? " open" : ""}><summary class="offer-pick"><span>${String(i + 1).padStart(2, "0")}</span>${s.name}</summary><article class="offer-panel"><span class="offer-shape offer-local" aria-hidden="true"></span><span class="offer-shape offer-shape-b offer-local" aria-hidden="true"></span><h2>${s.name}</h2><p>${s.short}</p><a class="about-link" href="#service-${s.id}"><span class="about-orb" aria-hidden="true">→</span> More Information</a></article></details></div>`
  )
  .join("");

html = html.replace(
  /<section id="services" class="page services-page">[\s\S]*?<\/section>\n<section id="service-general-footcare"/,
  `<section id="services" class="page services-page">
<svg class="guide-line" aria-hidden="true"></svg>
<div class="wrap services-intro">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 4.2h10M3 8h10M3 11.8h6.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg> Services</p>
<h1>Our services.</h1>
<p class="lede">All six services below are listed on the Tidy Feet services page. Descriptions are original and concise; fee amounts appear on the Prices page from the published list.</p>
</div>
<div class="wrap offer-board"><div class="offer-list">${offerItems}</div><div class="offer-stage" aria-hidden="true"><span class="offer-shape"></span><span class="offer-shape offer-shape-b"></span></div></div>
</section>
<section id="service-general-footcare"`
);

const servicePages = services
  .map(
    (s, i) =>
      `<section id="service-${s.id}" class="page service-page" data-shape="${i % 3}"><div class="service-sheet"><a class="service-back" href="#services"><span class="service-back-mark" aria-hidden="true">←</span> Services</a><div class="service-poster"><div class="service-stamp" aria-hidden="true"><span class="service-num">${String(i + 1).padStart(2, "0")}</span><span class="service-blob"></span></div><div class="service-copy"><p class="flag">${s.flag}${s.needsPhoto ? " · service photo pending" : ""}</p><h1>${s.name}</h1><p class="service-lead">${s.long}</p><p class="service-lead">${s.points}</p><a class="button solid service-cta" href="tel:${phoneTel}">Call ${phone}</a></div></div></div></section>`
  )
  .join("");

html = html.replace(
  /<section id="service-general-footcare"[\s\S]*?<section id="about"/,
  `${servicePages}
<section id="about"`
);

html = html.replace(
  /<section id="about" class="page team-page">[\s\S]*?<\/section>\n<section id="contact"/,
  `<section id="about" class="page team-page">
<svg class="guide-line" aria-hidden="true"></svg>
<div class="wrap about-summary">
<div class="about-copy">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M2.8 13.4V6.4L8 3.2l5.2 3.2v7" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M6.4 13.4V9h3.2v4.4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg> About</p>
<h1>Tidy Feet Podiatry</h1>
<div class="about-pair">
<div class="about-lead"><p class="lede">Tidy Feet Podiatry was opened in Southam in September 2007 by Deborah Coleman. It has steadily grown, and since 2010 has included a clinic in Stratford-upon-Avon. Deborah lives locally and either walks or rides her bike to work.</p></div>
</div>
<a class="about-next" href="#meet-team"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.2 6.1 8 10.6l4.8-4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Get to know the practitioner</span></a>
</div>
<p class="meet-kicker about-team" id="meet-team"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="5.4" cy="5.1" r="1.55" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="10.6" cy="5.1" r="1.55" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2.4 12.4c.35-1.7 1.5-2.6 3-2.6s2.65.9 3 2.6M7.6 12.4c.35-1.7 1.5-2.6 3-2.6s2.65.9 3 2.6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Meet the Team</p>
</div>
<div class="wrap team-board" data-person="0"><div class="team-rail" aria-hidden="true"><span class="team-fall"></span></div><div class="people"><article class="person is-current"><figure class="thumb"><img class="anchor-face" src="${asset("deborah-coleman.jpg")}" alt="Deborah Coleman, podiatrist at Tidy Feet Podiatry."></figure><div class="person-card"><h2>Deborah Coleman</h2><p class="role">Podiatrist · BSc (Hons) MChS · HCPC CH8559</p><p>Deborah was a trained nurse (RGN) before qualifying as a podiatrist. She holds a BSc (Hons) MChS, is a member of the Royal College of Podiatrists, and is registered with the Health and Care Professions Council (CH8559). She has been qualified since 2007.</p></div></article></div></div>
</section>
<section id="contact"`
);

html = html.replace(
  /<section id="contact" class="page">[\s\S]*?<\/section>\n<section id="reviews"/,
  `<section id="contact" class="page">
<svg class="guide-line" aria-hidden="true"></svg>
<div class="wrap page-intro">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4.4 2.6h2l.9 2.2-1.2.9a7.4 7.4 0 0 0 3.2 3.2l.9-1.2 2.2.9v2a1.1 1.1 0 0 1-1.2 1.1A8.8 8.8 0 0 1 3.3 3.8a1.1 1.1 0 0 1 1.1-1.2z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg> Contact</p>
<h1>Tidy Feet Podiatry.</h1>
<div class="info-grid"><article class="info-card"><h2>Phone</h2><p><a href="tel:${phoneTel}">${phone}</a><br><a href="tel:${mobileTel}">${mobile}</a></p></article><article class="info-card"><h2>Southam</h2><p>74B Coventry Street<br>Southam<br>CV47 0EA</p></article><article class="info-card"><h2>Stratford</h2><p>Trinity House<br>Aintree Road<br>Stratford-upon-Avon<br>CV37 9FL</p><p style="margin-top:8px;font-size:14px;color:#333">Clinic sessions are held at Stratford Dental, Trinity House — venue name only.</p></article><article class="info-card"><h2>Hours</h2><ul class="hours-list">
<li><span>Tue–Wed (Southam)</span><strong>8:00–12:30, 13:30–18:00</strong></li>
<li><span>Thu (Stratford)</span><strong>8:30 – 17:00</strong></li>
<li><span>Mon / Fri</span><strong>Special appointment</strong></li>
<li><span>Sat–Sun</span><strong>Closed</strong></li>
</ul></article></div>
<div class="split">
<form class="sheet" action="#contact" method="get" onsubmit="return false">
<h2>Get in touch</h2>
<p>Call <a class="contact-call" href="tel:${phoneTel}">${phone}</a> or <a href="tel:${mobileTel}">${mobile}</a>. The clinic aims to reply to messages within 24 hours on their own site. This form does not send a message.</p>
<p class="hours-live" data-hours="${hoursData}" data-open="Clinic hours may be open" data-closed="Clinic hours may be closed"><span class="hours-light" aria-hidden="true"></span><span class="hours-live-label"></span><span class="hours-live-tag">Live</span></p>
<p class="map-note">Prefer the existing website? Visit <a href="https://www.tidyfeet.co.uk/contact" target="_blank" rel="noopener noreferrer">tidyfeet.co.uk/contact</a>.</p>
<label>Name<input name="name" autocomplete="name"></label>
<label>Phone<input name="tel" type="tel" autocomplete="tel"></label>
<label>Message<textarea name="message"></textarea></label>
<a class="button solid" href="tel:${phoneTel}">Call ${phone}</a>
</form>
<figure class="side-media"><img src="${tpl("9a4bd25078f1a5ea-book-portrait.png")}" alt="Illustrative portrait. Not a photograph of Tidy Feet staff."></figure>
</div>
<div class="map-frame"><iframe class="map" title="Map of Tidy Feet Southam" width="600" height="420" src="https://maps.google.com/maps?q=Tidy%20Feet%20Podiatry%2074B%20Coventry%20Street%20Southam%20CV47%200EA&amp;hl=en&amp;z=15&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
<p class="map-note">Southam: 74B Coventry Street, CV47 0EA · <a href="https://www.google.com/maps/search/?api=1&amp;query=Tidy%20Feet%20Podiatry%2074B%20Coventry%20Street%20Southam%20CV47%200EA" target="_blank" rel="noopener noreferrer">Get directions</a><br>Stratford: Trinity House, Aintree Road, CV37 9FL · <a href="https://www.google.com/maps/search/?api=1&amp;query=Trinity%20House%20Aintree%20Road%20Stratford-upon-Avon%20CV37%209FL" target="_blank" rel="noopener noreferrer">Get directions</a></p>
</div>
</section>
<section id="reviews"`
);

html = html.replace(
  /<section id="reviews" class="page">[\s\S]*?<\/section>\n<section id="prices"/,
  `<section id="reviews" class="page">
<svg class="guide-line" aria-hidden="true"></svg>
<div class="wrap page-intro">
<div>
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="2.1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 1.4v1.7M8 12.9v1.7M1.4 8h1.7M12.9 8h1.7M3.3 3.3l1.2 1.2M11.5 11.5l1.2 1.2M12.7 3.3l-1.2 1.2M4.5 11.5l-1.2 1.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Reviews</p>
<h1>What patients say.</h1>
</div>
<a class="button solid" href="https://www.tidyfeet.co.uk/who-we-are" target="_blank" rel="noopener noreferrer">Read on tidyfeet.co.uk</a>
</div>
<section class="section reviews">
<div class="wrap">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="2.1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 1.4v1.7M8 12.9v1.7M1.4 8h1.7M12.9 8h1.7M3.3 3.3l1.2 1.2M11.5 11.5l1.2 1.2M12.7 3.3l-1.2 1.2M4.5 11.5l-1.2 1.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Testimonials</p>
${reviewBoard("Tidy Feet client testimonials")}
</div>
</section>
</section>
<section id="prices"`
);

html = html.replace(
  /<section id="prices" class="page prices-page">[\s\S]*?<\/section>\n<section id="faq"/,
  `<section id="prices" class="page prices-page">
<svg class="guide-line" aria-hidden="true"></svg>
<div class="wrap">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8.4 2.4h4.4v4.4L7.4 12.2 3.2 8 8.4 2.4z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="10.8" cy="4.8" r=".7" fill="currentColor"/></svg> Prices</p>
<h1>Published fees.</h1>
<p class="flag">From the Tidy Feet services page</p>
<p class="lede">Figures below are taken from tidyfeet.co.uk/services. Laser packages are agreed before treatment. Call to confirm current fees.</p>
<div class="fee-pair"><article class="fee-card"><span class="fee-gem"><strong>£70</strong></span><span class="fee-gem fee-gem-sm" aria-hidden="true"></span><h2>New patient</h2><p class="fee-k">45 minutes</p><ul class="fee-includes"><li>General footcare &amp; referrals</li><li>Follow-up 30 mins — £65</li><li>Confirm when you book</li></ul><a class="button solid fee-book" href="tel:${phoneTel}">Call Now</a></article><article class="fee-card"><span class="fee-gem"><strong>£65</strong></span><span class="fee-gem fee-gem-sm" aria-hidden="true"></span><h2>Follow-up</h2><p class="fee-k">30 minutes</p><ul class="fee-includes"><li>Listed for general footcare</li><li>Assessment visits may be longer</li><li>Confirm when you book</li></ul><a class="button solid fee-book" href="tel:${phoneTel}">Call Now</a></article></div>
<div class="fee-board"><h2>Other published packages</h2><div class="fee-accordion"><details class="fee-fold" name="listed-fees" open><summary><span>Nail surgery package</span><strong>from £580</strong></summary><p>Package price from the services page, including surgery and aftercare.</p></details><details class="fee-fold" name="listed-fees"><summary><span>Verruca needling</span><strong>£380</strong></summary><p>45 minutes — forms part of a package including follow-up appointments.</p></details><details class="fee-fold" name="listed-fees"><summary><span>Insoles</span><strong>£75–£300</strong></summary><p>Recover of Insoles £75; footbed-type £100–120; casted device £240–300 — as listed on the services page.</p></details><details class="fee-fold" name="listed-fees"><summary><span>Laser treatment</span><strong>Package</strong></summary><p>Prices depend on the treatment package and are explained and agreed before treatment starts.</p></details></div></div>
</div>
</section>
<section id="faq"`
);

html = html.replace(
  /<section id="faq" class="page faq-page">[\s\S]*?<\/section>\n<\/main>/,
  `<section id="faq" class="page faq-page">
<svg class="guide-line" aria-hidden="true"></svg>
<div class="wrap">
<div class="page-intro">
<div>
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="5.2" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M6.2 6.4c.35-1.1 1.2-1.7 2.2-1.7 1.15 0 2 .7 2 1.8 0 .85-.45 1.35-1.35 1.85-.7.4-.95.7-.95 1.35M8.05 11.7h.02" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> FAQ</p>
<h1>Questions, answered.</h1>
</div>
<p class="lede">Straight answers from tidyfeet.co.uk — booking, clinics, hours and who you’ll see.</p>
</div>
<div class="faq-board">
<details class="faq-item" open>
<summary><span class="faq-num" aria-hidden="true">01</span><strong>How do I book an appointment?</strong><span class="faq-toggle" aria-hidden="true">+</span></summary>
<div class="faq-body">
<p>Call ${phone} or ${mobile}. The website’s “Book a consultation” link goes to the contact page; there is no separate online booking system published.</p>
<p><span class="faq-note">Phone booking</span></p>
</div>
</details>
<details class="faq-item">
<summary><span class="faq-num" aria-hidden="true">02</span><strong>Where are the clinics?</strong><span class="faq-toggle" aria-hidden="true">+</span></summary>
<div class="faq-body">
<p>Southam: 74B Coventry Street, Southam, CV47 0EA. Stratford: Trinity House, Aintree Road, Stratford-upon-Avon, CV37 9FL (clinic sessions held at Stratford Dental, Trinity House).</p>
</div>
</details>
<details class="faq-item">
<summary><span class="faq-num" aria-hidden="true">03</span><strong>When are you open?</strong><span class="faq-toggle" aria-hidden="true">+</span></summary>
<div class="faq-body">
<p>Southam is open Tuesday and Wednesday 8:00–12:30 and 13:30–18:00, with Friday by special appointment. Stratford is open Thursday 8:30–17:00, with Monday by special appointment.</p>
</div>
</details>
<details class="faq-item">
<summary><span class="faq-num" aria-hidden="true">04</span><strong>Who will I see?</strong><span class="faq-toggle" aria-hidden="true">+</span></summary>
<div class="faq-body">
<p>Deborah Coleman, podiatrist. BSc (Hons) MChS, member of the Royal College of Podiatrists, HCPC registration CH8559. Qualified since 2007; previously a nurse (RGN).</p>
</div>
</details>
<details class="faq-item">
<summary><span class="faq-num" aria-hidden="true">05</span><strong>How long is an appointment?</strong><span class="faq-toggle" aria-hidden="true">+</span></summary>
<div class="faq-body">
<p>Appointments usually last 30 minutes. Assessment appointments (pre-surgery, diabetic, neurological, gait) and the initial appointment last about 45 minutes.</p>
</div>
</details>
<details class="faq-item">
<summary><span class="faq-num" aria-hidden="true">06</span><strong>What services do you offer?</strong><span class="faq-toggle" aria-hidden="true">+</span></summary>
<div class="faq-body">
<p>Nail surgery, insoles, gait analysis, verruca treatment, general footcare and referrals, and laser treatment (K-Laser and Lunula) — as listed on the Tidy Feet services page.</p>
</div>
</details>
</div>
<div class="faq-cta">
<a class="button solid" href="tel:${phoneTel}">Call the clinic</a>
<a class="button" href="#contact">Contact details</a>
</div>
</div>
</section>
</main>`
);

html = html.replace(
  /<footer class="site-footer">[\s\S]*?<\/footer>/,
  `<footer class="site-footer">
<div class="wrap">
<a class="footer-brand" href="#home"><span class="footer-pill"><img class="footer-logo" src="${asset("logo.png")}" alt="" width="40" height="40"><span class="wordmark"><span><strong>Tidy Feet</strong><small>Podiatry</small></span></span></span></a>
<div class="foot">
<div class="footer-intro">
<p class="footer-note">Walking well in Warwickshire.
Clinics in Southam and Stratford-upon-Avon.
Call to arrange a time that suits you.</p>
<div class="footer-actions">
<a class="button" href="#services">Services</a>
<a class="button" href="tel:${phoneTel}">Call to book</a>
</div>
<div class="footer-marks" aria-hidden="true">
<span><svg viewBox="0 0 16 16" width="15" height="15"><path fill="currentColor" d="M9.2 7.1 13.4 2h-1.5L8.6 6.3 5.7 2H2.2l4.4 6.4L2.2 14h1.5l3.6-4.2 2.9 4.2h3.5L9.2 7.1Zm-1.3 1.5-.4-.6L4.1 3h1.2l2.4 3.4.4.6 3.5 5h-1.2l-2.5-3.4Z"/></svg></span>
<span><svg viewBox="0 0 16 16" width="15" height="15"><path fill="currentColor" d="M9.3 14V8.7h1.8l.3-2H9.3V5.4c0-.6.2-1 .9-1H11.5V2.6c-.3 0-.9-.1-1.7-.1-1.7 0-2.8 1-2.8 2.9v1.3H5.2v2h1.8V14h2.3Z"/></svg></span>
</div>
</div>
<nav class="footer-index" aria-label="Pages">
<a href="#home"><span>01</span> Home</a>
<a href="#services"><span>02</span> Services</a>
<a href="#about"><span>03</span> About</a>
<a href="#reviews"><span>04</span> Reviews</a>
<a href="#prices"><span>05</span> Prices</a>
<a href="#faq"><span>06</span> FAQ</a>
<a href="#contact"><span>07</span> Contact</a>
</nav>
<div class="footer-visit">
<p>Southam · Stratford-upon-Avon</p>
<p>Tue–Wed Southam · Thu Stratford · Special appointments Mon/Fri</p>
<a class="footer-phone" href="tel:${phoneTel}">${phone}</a>
<a class="button" href="#contact">Contact us</a>
</div>
</div>
</div>
<div class="wrap footer-base"><small class="legal">Template care-modern 1.0.0 adapted for Tidy Feet Podiatry from the 45 The Green layout. Accent colour #113B66 is taken from the official logo. Service and practitioner photographs are from tidyfeet.co.uk; other photographs remain illustrative template images. Do not regenerate this slug from the dental template without preserving this adaptation.</small></div>
</footer>`
);

const enquiryChoices = services
  .map((s) => `<label class="book-choice"><input type="radio" name="setter-enquiry" value="${s.name}">${s.name}</label>`)
  .join("");

html = html.replace(
  /<label class="book-choice"><input type="radio" name="setter-enquiry" value="General Footcare">[\s\S]*?<label class="book-choice"><input type="radio" name="setter-enquiry" value="Unsure">Unsure<\/label>/,
  `${enquiryChoices}<label class="book-choice"><input type="radio" name="setter-enquiry" value="General Enquiry">General Enquiry</label><label class="book-choice"><input type="radio" name="setter-enquiry" value="Unsure">Unsure</label>`
);

html = html.replaceAll("07883 098454", phone);
html = html.replaceAll("07883098454", phoneTel);
html = html.replace(
  /This demo does not send a booking\. Please call [^<]* to arrange your appointment\./,
  `This demo does not send a booking. Please call ${phone} or ${mobile} to arrange your appointment.`
);
html = html.replace(
  /Thanks — please call [^<]* to confirm your appointment\. This form does not send a request\./,
  `Thanks — please call ${phone} or ${mobile} to confirm your appointment. This form does not send a request.`
);

// Logo on dark bg looks better with a soft radius; keep contain
html = html.replace(
  /\.logo\{display:block;width:42px;height:42px;object-fit:contain\}/,
  `.logo{display:block;width:42px;height:42px;object-fit:contain;border-radius:8px;background:#000}.logo.logo-wide{width:auto;max-width:120px;height:42px}`
);

// Remove leftover Halesowen / Emma / dental wording checks
const leftovers = ["Halesowen", "Emma Evans", "fitchyfeet", "Dental Practice", "Denplan", "whitening"];
for (const word of leftovers) {
  if (html.includes(word)) {
    console.warn("Leftover:", word, "count", html.split(word).length - 1);
  }
}

fs.writeFileSync("public/preview/tidy-feet/index.html", html);

const hash = crypto.createHash("sha256").update(html).digest("hex");
const status = {
  slug: "tidy-feet",
  status: "PREVIEW_READY",
  sheetStatus: "Preview ready",
  previewPath: "/preview/tidy-feet/index.html",
  template: { id: "care-modern", version: "1.0.0" },
  instructionsVersion: "manual-adaptation",
  contentHash: hash,
  demo: false,
  message: "",
  updatedAt: new Date().toISOString(),
};
fs.writeFileSync("public/preview/tidy-feet/status.json", JSON.stringify(status, null, 2) + "\n");

const indexPath = "public/preview/index.json";
const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const entry = {
  slug: "tidy-feet",
  status: "PREVIEW_READY",
  sheetStatus: "Preview ready",
  previewPath: "/preview/tidy-feet/index.html",
  template: { id: "care-modern", version: "1.0.0" },
  instructionsVersion: "manual-adaptation",
  contentHash: hash,
  demo: false,
  message: "",
  updatedAt: status.updatedAt,
};
const existing = index.previews.findIndex((p) => p.slug === "tidy-feet");
if (existing >= 0) index.previews[existing] = entry;
else index.previews.push(entry);
index.previews.sort((a, b) => a.slug.localeCompare(b.slug));
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + "\n");

console.log("Wrote tidy-feet", html.length, "bytes", hash.slice(0, 16));
console.log("Services:", services.map((s) => s.name).join(", "));
console.log(
  "Photo flags:",
  services.filter((s) => s.needsPhoto).map((s) => s.name).join(", ") || "none"
);
