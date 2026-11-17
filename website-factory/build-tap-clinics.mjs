import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = "public/preview/tap-clinics";
const phone = "07904 839521";
const tel = "tel:+447904839521";
const email = "info@therapyandperformanceclinic.co.uk";
const book = "https://sites.leadconnectorhq.com/preview/s1zQFyVFNX2KrFcstuT0";
const books = {
  warwick: book,
  stratford: book,
  leamington: book
};
const freshaReviews = "https://www.fresha.com/a/tap-clinic-warwick-warwick-4-the-holloway-diufr5wy";
const freshaStratford = "https://www.fresha.com/a/therapy-and-performance-clinic-stratford-stratford-upon-avon-unit-3-avon-house-stratford-upon-avon-mulberry-street-ogk41s05";
const google = "https://www.google.com/maps?cid=1297864331712390238";
const shop = "https://tap-7328.myshopify.com/";
const checked = "16 November 2026";

const treatments = [
  { slug: "physiotherapy", group: "Physiotherapy and sports injury", name: "Physiotherapy", line: "Find what is driving persistent pain, then treat it in the same visit.", detail: "A first physiotherapy appointment at TAP takes a full history, looks at how you move, and includes hands-on treatment before you leave. Lauren (HCPC PH152936) and Anna (HCPC PH130067) are the named physiotherapists. You do not need a GP referral.", price: "Initial consultation £70. Follow-up £45 for 30 minutes or £65 for 45 minutes." },
  { slug: "sports-therapy", group: "Physiotherapy and sports injury", name: "Sports therapy", line: "Get back to training rebuilt, not just rested until the pain fades.", detail: "Sports therapy at TAP is for injury rehab and people who want to stay active. Bethan is a sports therapist with a BSc (Hons) from Coventry University. The first session is an assessment and treatment, with a plan you can actually fit into the week.", price: "Initial consultation £70. Follow-up £45 for 30 minutes or £65 for 45 minutes." },
  { slug: "sports-massage", group: "Massage and recovery", name: "Sports massage", line: "Ease tightness, support recovery and keep on top of how you feel.", detail: "Sports massage is hands-on soft-tissue work for training, desk tension and the niggles that build up between sessions. You do not have to be an athlete. If you are unsure whether you need massage or physiotherapy, book in and the team will tell you straight.", price: "£45 for 30 minutes, £65 for 60 minutes, £90 for 90 minutes." },
  { slug: "deep-tissue-massage", group: "Massage and recovery", name: "Deep tissue massage", line: "Slower, firmer work for stubborn knots and long-held tension.", detail: "Deep tissue massage uses firmer pressure for tight, stubborn muscle. It is on the menu at Warwick, Stratford-upon-Avon and Leamington Spa, and it is often combined with other hands-on work in the same session.", price: "£45 for 30 minutes, £65 for 60 minutes, £90 for 90 minutes." },
  { slug: "swedish-massage", group: "Massage and recovery", name: "Swedish massage", line: "A slower full-body massage when you need to unwind and reset.", detail: "Swedish massage is the calmer end of the menu: longer strokes for people who want to ease general tension rather than chase a specific injury. It is available at all three clinics.", price: "£45 for 30 minutes or £65 for 60 minutes." },
  { slug: "indian-head-massage", group: "Massage and recovery", name: "Indian head massage", line: "Neck, shoulder and scalp work for tension and a busy head.", detail: "Indian head massage focuses on the neck, shoulders and scalp. TAP also lists a longer option that pairs it with deep tissue work through the back.", price: "Express treatment £45. Indian head and deep tissue back massage £65." },
  { slug: "thai-yoga-massage", group: "Massage and recovery", name: "Thai yoga massage", line: "Assisted stretching for stiffness you cannot quite reach on your own.", detail: "Thai yoga massage is assisted, rhythmic stretching on the couch. Wear comfortable clothes you can move in. It is listed at Warwick, Stratford-upon-Avon and Leamington Spa.", price: "£65 for 60 minutes." },
  { slug: "stretch-therapy", group: "Massage and recovery", name: "Stretch therapy", line: "Guided hands-on stretching to restore range and keep you moving.", detail: "Stretch therapy is a guided session for stiffness that keeps limiting how you train or sit. It sits alongside massage and physiotherapy, so it can be part of a wider plan.", price: "£65 for 60 minutes." },
  { slug: "dry-cupping", group: "Massage and recovery", name: "Dry cupping", line: "Cups used with hands-on work for deep tension.", detail: "Dry cupping is one of the hands-on options the team uses when massage alone is not the right tool. It is bookable on its own and is often combined with other treatment in the same visit.", price: "£45 for 30 minutes or £65 for 60 minutes." },
  { slug: "dry-needling", group: "Massage and recovery", name: "Dry needling", line: "Targeted release for stubborn spots that hands cannot quite settle.", detail: "Dry needling is listed among TAP's hands-on treatments for stubborn pain and tension. The Warwick booking menu also lists medical acupuncture separately, at the prices below. Ask when you book if you want one specifically.", price: "Medical acupuncture on the booking menu is £45 for 30 minutes or £65 for 60 minutes." },
  { slug: "lymphatic-drainage", group: "Massage and recovery", name: "Lymphatic drainage", line: "Gentle work aimed at swelling and fluid, including after surgery.", detail: "Lymphatic drainage is the gentler massage option, used for swelling and to support recovery. Ema is the therapist who describes this as part of her work with post-surgical clients. It is not a substitute for medical care after an operation.", price: "General lymphatic drainage massage £70." },
  { slug: "pregnancy-massage", group: "Pregnancy and postnatal", name: "Pregnancy massage", line: "Gentle relief for the back, hip and leg aches of pregnancy.", detail: "Pregnancy massage is offered as safe, gentle hands-on care through pregnancy. Tell the team how far along you are when you book so they can match you with the right appointment.", price: "£65." },
  { slug: "mummy-mot", group: "Pregnancy and postnatal", name: "Mummy MOT", line: "A postnatal check of core, pelvic floor and posture with a midwife.", detail: "The Mummy MOT is led by Sarah Lane, a midwife and women's health specialist. It looks at pelvic floor, core, posture and postnatal recovery, with a plan for getting back to movement. There is also a prenatal appointment.", price: "Prenatal or postnatal Mummy MOT £100. Follow-up £50." }
];

const conditions = [
  ["back-pain", "Back pain", "A back that keeps seizing is one of the most common reasons people book. The first visit looks for what is driving it, not only where it hurts."],
  ["neck-pain", "Neck pain", "Desk necks, slept-funny necks and necks that never quite settle are a regular part of the week at all three clinics."],
  ["knee-pain", "Knee pain", "Knees that keep flaring, including running niggles, are assessed for the cause and treated in the same session."],
  ["runners-knee", "Runner's knee", "If running is stirring up the knee, book an assessment. The team would rather find the driver than keep rubbing the sore spot."],
  ["hip-pain", "Hip pain", "Hip pain that lingers, including discomfort that shows up when you lie on your side, is assessed as part of how you move, not as an isolated joint."],
  ["sciatica", "Sciatica", "Sciatica is listed among the problems TAP sees. The first session is an assessment plus hands-on treatment, and a plan for what happens next."],
  ["shoulder-pain", "Shoulder pain", "Shoulders that never quite settle, including stiffness after sport or desk work, are assessed before anyone decides which treatment fits."],
  ["frozen-shoulder", "Frozen shoulder", "Frozen shoulder is one of the shoulder problems people come in with. Treatment is matched after assessment, rather than picked off a menu in advance."],
  ["plantar-fasciitis", "Plantar fasciitis", "Heel and foot pain, including plantar fasciitis, is listed on the clinic site. The visit starts with finding what is keeping it going."],
  ["achilles-pain", "Achilles pain", "Achilles pain is listed among the conditions TAP treats, often alongside a plan for load and recovery rather than a one-off rub."],
  ["shin-splints", "Shin splints", "Shin pain that appears with running or training is assessed properly before anyone adds more mileage or more massage."],
  ["ankle-sprain", "Ankle sprain", "Ankle sprains are part of the sports-injury work. The aim is to settle the injury and rebuild confidence in the joint."],
  ["tennis-elbow", "Tennis elbow", "Tennis elbow is listed as a condition the team sees. You do not need to play tennis, and you do not need a GP letter."],
  ["tension-headaches", "Tension headaches", "Tension headaches are linked on the current site with neck and shoulder release, including Indian head massage. An assessment still comes first if you are not sure."],
  ["whiplash", "Whiplash", "Whiplash is listed among the neck conditions people enquire about. Book an assessment and say what happened so the right clinician sees you."],
  ["padel-injuries", "Padel injuries", "Padel is called out on the current site because of the stops, lunges and shoulder work the game asks for. The same assess-treat-rebuild approach applies."]
];

const reviews = [
  { quote: "Having seen countless physiotherapists and rehabilitation providers over the years, I can honestly say TAP is the best by a mile. A heartfelt mention to Bethan: during some of the most vulnerable stages of my recovery, she was an absolute rock. If you're looking for physiotherapy, rehabilitation, or injury recovery support, stop looking.", name: "H.W.", note: "Google review, post-surgery rehab" },
  { quote: "Was really struggling with my neck and back, had an hour massage with Therapy and Performance Clinic, and 3 weeks on I still feel 100%.", name: "Karen S", note: "Google review, neck and back pain" },
  { quote: "Had an excellent sports massage that helped me recover from a hamstring injury and get back to playing.", name: "Ali D", note: "Google review, hamstring injury" },
  { quote: "Lauren always identifies the problem quickly and gets to the root cause effectively.", name: "Teresa C", note: "Google review" },
  { quote: "Bethan triaged the cause of my knee pain thoroughly, then did treatment to support the repair. This morning it is already feeling better. I couldn't recommend her enough!", name: "Pete G", note: "Google review, knee pain" },
  { quote: "After each visit I walk away feeling so much better, the niggles are gone and legs feel refreshed, ready to go again.", name: "Sarah W", note: "Google review" },
  { quote: "I've seen three different therapists so far and they have all been fantastic. A really friendly, supportive and welcoming place, with a great range of therapies on offer.", name: "Sarah N", note: "Google review" },
  { quote: "Super professional, welcoming, and genuinely cared about getting me better.", name: "Paul W", note: "Google review" },
  { quote: "I was suffering from leg pain but unsure why. I saw Lauren and she was absolutely fantastic.", name: "Sarah C", note: "Google review" }
];

const posts = [
  ["How to book a sports therapy session", "https://www.tapclinics.co.uk/single-post/how-to-book-a-sports-therapy-session", "How booking works, including the 90-minute Full Body MOT."],
  ["Physiotherapy, sports massage or sports therapy?", "https://www.tapclinics.co.uk/single-post/physiotherapy-vs-sports-massage-vs-sports-therapy-which-one-do-you-really-need", "A plain-language comparison of the three appointments people mix up."],
  ["Recovering from a running injury", "https://www.tapclinics.co.uk/single-post/recovering-from-a-running-injury", "Journal piece on coming back from a running injury."],
  ["When to book sports massage in marathon training", "https://www.tapclinics.co.uk/single-post/when-should-you-book-sports-massage-during-marathon-training", "Timing massage around long runs and race build-up."],
  ["How many gels for a marathon", "https://www.tapclinics.co.uk/single-post/how-many-gels-do-you-need-for-a-marathon-a-long-run-fuelling-guide", "A long-run fuelling guide from the coaching side of TAP."],
  ["Race week", "https://www.tapclinics.co.uk/single-post/race-week-what-to-do-and-what-not-to-do-in-the-7-days-before-your-next-race", "What the journal suggests doing, and skipping, in the seven days before a race."],
  ["How long does plantar fasciitis take to heal?", "https://www.tapclinics.co.uk/single-post/how-long-does-plantar-fasciitis-take-to-heal", "The clinic's journal piece on heel pain and healing time."],
  ["Why does my hip hurt when I lie on my side?", "https://www.tapclinics.co.uk/single-post/why-does-my-hip-hurt-when-i-lie-on-my-side-at-night", "A look at night-time hip pain."],
  ["Dry cupping in recovery", "https://www.tapclinics.co.uk/single-post/why-dry-cupping-therapy-at-tap-could-be-the-missing-link-in-your-recovery-performance", "How the team talks about dry cupping alongside other treatment."],
  ["Foot strength exercises", "https://www.tapclinics.co.uk/single-post/how-to-improve-foot-strength-with-these-simple-exercises", "Simple foot-strength ideas from the journal."]
];

function esc(value) {
  return String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

function stars() {
  return `<p class="stars" aria-label="5 out of 5 stars">★★★★★</p>`;
}

function bookStrip() {
  return `<section class="band deep"><div class="wrap book-band">
    <figure class="book-photo"><img src="assets/images/team/team.jpg" alt="The TAP Clinics team together in the studio."></figure>
    <div class="book-copy">
      <p class="kicker book-kicker">Book</p>
      <h2>Same-week appointments. No referral needed.</h2>
      <p class="book-lede">Pick Warwick, Stratford or Leamington on the booking page. Not sure what to book? Choose that option and the team will guide you.</p>
      <div class="book-actions">
        <a class="button" href="${book}" target="_blank" rel="noopener">Book an appointment</a>
        <a class="button ghost" href="${tel}">Call ${phone}</a>
      </div>
      <ul class="book-hours">
        <li><strong>Warwick &amp; Stratford</strong> · 7 days, 8am–9pm</li>
        <li><strong>Leamington Spa</strong> · Fridays, plus occasional Wednesdays</li>
      </ul>
    </div>
  </div></section>`;
}

function nav(active) {
  const item = (href, label, key) => `<a href="${href}"${active === key ? ' aria-current="page"' : ""}>${label}</a>`;
  return `<nav class="nav" id="site-nav" aria-label="Primary">
    <details><summary>Treatments</summary><div class="menu">
      <a href="treatments.html">All treatments</a>
      <a href="physiotherapy.html">Physiotherapy</a>
      <a href="sports-massage.html">Sports massage</a>
      <a href="sports-therapy.html">Sports therapy</a>
      <a href="mummy-mot.html">Mummy MOT</a>
    </div></details>
    <details${active === "conditions" ? ' class="is-current"' : ""}><summary>Conditions</summary><div class="menu">
      ${conditions.map(([slug, name]) => `<a href="${slug}.html">${name}</a>`).join("")}
    </div></details>
    <details><summary>Our clinics</summary><div class="menu">
      <a href="clinics.html">All clinics</a>
      <a href="warwick-clinic.html">Warwick</a>
      <a href="stratford-clinic.html">Stratford-upon-Avon</a>
      <a href="leamington-spa.html">Leamington Spa</a>
    </div></details>
    ${item("about.html", "About &amp; team", "about")}
    ${item("contact.html", "Contact", "contact")}
  </nav>`;
}

function shell({ title, description, active, body }) {
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<meta name="description" content="${esc(description)}">
<title>${esc(title)}</title>
<link rel="icon" href="assets/images/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Boldonse&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/site.css?v=16">
</head>
<body>
<div class="fronds" aria-hidden="true">
  <div class="frond right a"><img src="assets/images/leaves/leaf-1.png" alt=""></div>
  <div class="frond left b"><img src="assets/images/leaves/leaf-2.png" alt=""></div>
  <div class="frond right c"><img src="assets/images/leaves/leaf-4.png" alt=""></div>
</div>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <a class="brand" href="index.html"><img src="assets/images/logo.png?v=6" alt="TAP. Physiotherapy and massages."></a>
  ${nav(active)}
  <div class="header-actions">
    <a class="phone-chip" href="${tel}" aria-label="Call TAP Clinics"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 3h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"/></svg></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <a class="button" href="${book}" target="_blank" rel="noopener">Book an appointment</a>
  </div>
</header>
<div class="topbar"><p class="topbar-places">Warwick <span>·</span> Stratford-upon-Avon <span>·</span> Leamington Spa</p><p class="topbar-reviews"><a href="${freshaReviews}" target="_blank" rel="noopener">2400+ five-star reviews <span>·</span> Same week appointments</a></p><p class="topbar-mobile">Warwick <span>·</span> Leamington <span>·</span> Stratford</p></div>
<main id="main">${body}</main>
<footer class="site-footer">
  <div class="footer-leaf" aria-hidden="true"><img src="assets/images/leaves/leaf-white.png" alt=""></div>
  <div class="wrap footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <img src="assets/images/logo.png" alt="TAP Clinics">
        <p class="footer-tag">Physiotherapy, sports massage and rehab across Warwick, Stratford-upon-Avon and Leamington Spa.</p>
        <div class="footer-brand-actions">
          <a class="button footer-cta" href="${book}" target="_blank" rel="noopener">Book an appointment</a>
          <a class="footer-phone" href="${tel}">${phone}</a>
        </div>
      </div>
      <div class="footer-cols">
        <div>
          <h2>Clinics</h2>
          <ul class="footer-clinics">
            <li><a href="warwick-clinic.html"><strong>Warwick</strong><span>4 The Holloway, CV34 4SJ</span></a></li>
            <li><a href="stratford-clinic.html"><strong>Stratford-upon-Avon</strong><span>Unit 3, Avon House, CV37 6RS</span></a></li>
            <li><a href="leamington-spa.html"><strong>Leamington Spa</strong><span>REGEN Rooms, CV32 5EL</span></a></li>
          </ul>
        </div>
        <div>
          <h2>Contact</h2>
          <ul>
            <li><a href="${tel}">${phone}</a></li>
            <li><a href="mailto:${email}">${email}</a></li>
            <li class="footer-muted">Warwick &amp; Stratford · 7 days, 8am–9pm</li>
            <li class="footer-muted">Leamington · Fridays, plus occasional Wednesdays</li>
            <li><a href="contact.html#visit">Parking and what to wear</a></li>
          </ul>
        </div>
        <div>
          <h2>More</h2>
          <ul class="footer-more">
            <li><a href="book.html">Book online</a></li>
            <li><a href="online-coaching.html">Coaching</a></li>
            <li><a href="corporate-wellbeing.html">Corporate wellbeing</a></li>
            <li><a href="blog.html">Journal</a></li>
            <li><a href="shop.html">Shop</a></li>
            <li><a href="contact.html#insurance">Private insurance</a></li>
            <li><a href="contact.html#faqs">FAQs</a></li>
            <li><a href="${freshaReviews}" target="_blank" rel="noopener">Fresha reviews</a></li>
            <li><a href="privacy.html">Privacy</a></li>
            <li><a href="terms.html">Terms</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer-base"><p>© ${new Date().getFullYear()} Therapy and Performance Clinic</p><p>Prices and review counts checked ${checked}.</p></div>
  </div>
</footer>
<div class="mobile-book"><a class="button" href="${book}" target="_blank" rel="noopener">Book</a><a class="button ghost" href="https://wa.me/447904839521" target="_blank" rel="noopener">WhatsApp</a></div>
<a class="book-fab" href="https://wa.me/447904839521" target="_blank" rel="noopener" aria-label="WhatsApp TAP Clinics"><svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
<script src="assets/js/site.js?v=5"></script>
</body></html>`;
}

function pageHero(kicker, heading, lede) {
  return `<header class="page-hero wrap"><p class="kicker">${kicker}</p><h1>${heading}</h1>${lede ? `<p class="lede" style="margin-top:14px">${lede}</p>` : ""}</header>`;
}

const pages = [];

pages.push({ file: "index.html", html: shell({
  title: "TAP Clinics | Physiotherapy and massage in Warwick, Stratford and Leamington Spa",
  description: "The Therapy and Performance Clinic. Physiotherapy, sports massage and rehab in Warwick, Stratford-upon-Avon and Leamington Spa. Book a same-week appointment.",
  active: "home",
  body: `
  <section class="wrap hero">
    <div class="frond wind" aria-hidden="true"><img src="assets/images/leaves/leaf-3.png" alt=""></div>
    <div class="hero-copy">
      <p class="kicker">Physio · Massage · Training</p>
      <h1><span>Back hurting?</span><span>Knee acting up?</span><span class="accent">Let's fix it.</span></h1>
      <div class="hero-rule"></div>
      <p class="lede">Most treatment chases the symptom, so the pain keeps coming back. TAP finds the cause, treats it hands-on, and builds a plan you will actually do.</p>
      <div class="hero-actions"><a class="button" href="${book}" target="_blank" rel="noopener">Book an appointment</a><a class="button ghost" href="${tel}">${phone}</a></div>
    </div>
    <figure class="hero-media" aria-label="A therapist treating a client's back, shown as rounded photo tiles with space between them."><div class="hero-collage" aria-hidden="true"><span class="hero-tile" style="--i:1;--x:415;--y:233;--w:212;--h:253"></span><span class="hero-tile from-left" style="--i:2;--x:146;--y:233;--w:264;--h:254"></span><span class="hero-tile from-up" style="--i:3;--x:146;--y:16;--w:264;--h:213"></span><span class="hero-tile from-right" style="--i:4;--x:631;--y:233;--w:148;--h:184"></span><span class="hero-tile from-down" style="--i:5;--x:146;--y:491;--w:481;--h:111"></span><span class="hero-tile from-up" style="--i:10;--x:58;--y:166;--w:83;--h:103"></span><span class="hero-tile from-up" style="--i:11;--x:415;--y:16;--w:283;--h:73"></span><span class="hero-tile from-right" style="--i:8;--x:631;--y:422;--w:160;--h:118"></span><span class="hero-tile from-down" style="--i:9;--x:34;--y:422;--w:107;--h:145"></span><span class="hero-tile from-left" style="--i:6;--x:25;--y:274;--w:117;--h:143"></span><span class="hero-tile from-right" style="--i:7;--x:415;--y:93;--w:364;--h:136"></span></div>
      <p class="rating-note"><span class="stars rating-stars" aria-hidden="true">★★★★★</span> <a href="${freshaReviews}" target="_blank" rel="noopener">5.0 · 2,400+ five-star reviews</a></p>
    </figure>
  </section>
  <section class="band paper">
    <div class="wrap method">
      <div>
        <p class="kicker">The TAP method</p>
        <h2>One plan.<br class="method-break">One roof.<br class="method-break">Three steps.</h2>
        <p class="lede" style="margin-top:14px">This is why the clinic says the result lasts when a quick rub does not.</p>
        <p class="method-book"><a class="button" href="${book}" target="_blank" rel="noopener">Book now</a></p>
      </div>
      <div class="steps">
        <article class="step"><b>01</b><div><h3>Assess</h3><p>A proper look at how you move in the first session. Not only where it hurts, but why.</p></div></article>
        <article class="step"><b>02</b><div><h3>Treat</h3><p>Hands-on from the start. Physio, massage, cupping or needling, chosen for the problem rather than the menu.</p></div></article>
        <article class="step"><b>03</b><div><h3>Rebuild</h3><p>A simple plan around your actual week, so the thing that brought you in is less likely to return.</p></div></article>
      </div>
    </div>
  </section>
  <section class="band">
    <div class="wrap">
      <div class="section-head"><div><p class="kicker">Treatments</p><h2>What you can book.</h2></div><a class="button ghost section-head-action" href="treatments.html">All treatments</a></div>
      <div class="treat-layout">
        <div class="treat-nav" role="group" aria-label="Treatment groups">
          <div class="treat-item">
            <button type="button" data-treat="physio" aria-pressed="true" aria-expanded="true">Physiotherapy</button>
            <div class="treat-panel" data-panel="physio"><img src="assets/images/treatments/physio.jpg" alt="Hands-on treatment across the shoulder and neck."><p>Find the cause in the first hour, and leave with a plan.</p><a class="button" href="physiotherapy.html">Read more</a></div>
          </div>
          <div class="treat-item">
            <button type="button" data-treat="therapy" aria-pressed="false" aria-expanded="false">Sports therapy</button>
            <div class="treat-panel" data-panel="therapy" hidden><img src="assets/images/treatments/therapy.jpg" alt="A runner heading back up a flight of steps."><p>Get back to training rebuilt, not just rested until the pain fades.</p><a class="button" href="sports-therapy.html">Read more</a></div>
          </div>
          <div class="treat-item">
            <button type="button" data-treat="massage" aria-pressed="false" aria-expanded="false">Sports massage</button>
            <div class="treat-panel" data-panel="massage" hidden><img src="assets/images/treatments/massage.jpg" alt="Massage oil being prepared during a treatment."><p>Tightness, recovery, and the knots that desk weeks leave behind.</p><a class="button" href="sports-massage.html">Read more</a></div>
          </div>
          <div class="treat-item">
            <button type="button" data-treat="deep" aria-pressed="false" aria-expanded="false">Deep tissue massage</button>
            <div class="treat-panel" data-panel="deep" hidden><img src="assets/images/treatments/deep.jpg" alt="Hands working along the back."><p>Slower, firmer work for stubborn knots and long-held tension.</p><a class="button" href="deep-tissue-massage.html">Read more</a></div>
          </div>
          <div class="treat-item">
            <button type="button" data-treat="needling" aria-pressed="false" aria-expanded="false">Dry needling</button>
            <div class="treat-panel" data-panel="needling" hidden><img src="assets/images/treatments/needling.jpg" alt="Fine needles placed during treatment."><p>Targeted release for stubborn spots that hands cannot quite settle.</p><a class="button" href="dry-needling.html">Read more</a></div>
          </div>
          <div class="treat-item">
            <button type="button" data-treat="cupping" aria-pressed="false" aria-expanded="false">Dry cupping</button>
            <div class="treat-panel" data-panel="cupping" hidden><img src="assets/images/treatments/cupping.jpg" alt="A cup placed on the back during treatment."><p>Cups used with hands-on work for deep tension.</p><a class="button" href="dry-cupping.html">Read more</a></div>
          </div>
          <div class="treat-item">
            <button type="button" data-treat="pregnancy" aria-pressed="false" aria-expanded="false">Pregnancy massage</button>
            <div class="treat-panel" data-panel="pregnancy" hidden><img src="assets/images/treatments/pregnancy.jpg" alt="A therapist treating a client's lower leg."><p>Gentle relief for the back, hip and leg aches of pregnancy.</p><a class="button" href="pregnancy-massage.html">Read more</a></div>
          </div>
          <div class="treat-item">
            <button type="button" data-treat="mums" aria-pressed="false" aria-expanded="false">Mummy MOT</button>
            <div class="treat-panel" data-panel="mums" hidden><img src="assets/images/treatments/mummy.jpg" alt="Core strength work on a mat."><p>Postnatal core, pelvic floor and posture with midwife Sarah Lane.</p><a class="button" href="mummy-mot.html">Read more</a></div>
          </div>
          <div class="treat-item">
            <button type="button" data-treat="lymph" aria-pressed="false" aria-expanded="false">Lymphatic drainage</button>
            <div class="treat-panel" data-panel="lymph" hidden><img src="assets/images/treatments/lymph.jpg" alt="A gentle back treatment."><p>Gentle work aimed at swelling and fluid, including after surgery.</p><a class="button" href="lymphatic-drainage.html">Read more</a></div>
          </div>
        </div>
        <div class="treat-stage">
          <img class="is-on" data-treat="physio" src="assets/images/treatments/physio.jpg" alt="Hands-on treatment across the shoulder and neck.">
          <img data-treat="therapy" src="assets/images/treatments/therapy.jpg" alt="A runner heading back up a flight of steps.">
          <img data-treat="massage" src="assets/images/treatments/massage.jpg" alt="Massage oil being prepared during a treatment.">
          <img data-treat="deep" src="assets/images/treatments/deep.jpg" alt="Hands working along the back.">
          <img data-treat="needling" src="assets/images/treatments/needling.jpg" alt="Fine needles placed during treatment.">
          <img data-treat="cupping" src="assets/images/treatments/cupping.jpg" alt="A cup placed on the back during treatment.">
          <img data-treat="pregnancy" src="assets/images/treatments/pregnancy.jpg" alt="A therapist treating a client's lower leg.">
          <img data-treat="mums" src="assets/images/treatments/mummy.jpg" alt="Core strength work on a mat.">
          <img data-treat="lymph" src="assets/images/treatments/lymph.jpg" alt="A gentle back treatment.">
          <div class="treat-caption" data-panel="physio"><span><strong>Physiotherapy</strong><br><em>Find the cause in the first hour, and leave with a plan.</em></span><a class="button" href="physiotherapy.html">Read more</a></div>
          <div class="treat-caption" data-panel="therapy" hidden><span><strong>Sports therapy</strong><br><em>Get back to training rebuilt, not just rested until the pain fades.</em></span><a class="button" href="sports-therapy.html">Read more</a></div>
          <div class="treat-caption" data-panel="massage" hidden><span><strong>Sports massage</strong><br><em>Tightness, recovery, and the knots that desk weeks leave behind.</em></span><a class="button" href="sports-massage.html">Read more</a></div>
          <div class="treat-caption" data-panel="deep" hidden><span><strong>Deep tissue massage</strong><br><em>Slower, firmer work for stubborn knots and long-held tension.</em></span><a class="button" href="deep-tissue-massage.html">Read more</a></div>
          <div class="treat-caption" data-panel="needling" hidden><span><strong>Dry needling</strong><br><em>Targeted release for stubborn spots that hands cannot quite settle.</em></span><a class="button" href="dry-needling.html">Read more</a></div>
          <div class="treat-caption" data-panel="cupping" hidden><span><strong>Dry cupping</strong><br><em>Cups used with hands-on work for deep tension.</em></span><a class="button" href="dry-cupping.html">Read more</a></div>
          <div class="treat-caption" data-panel="pregnancy" hidden><span><strong>Pregnancy massage</strong><br><em>Gentle relief for the back, hip and leg aches of pregnancy.</em></span><a class="button" href="pregnancy-massage.html">Read more</a></div>
          <div class="treat-caption" data-panel="mums" hidden><span><strong>Mummy MOT</strong><br><em>Postnatal core, pelvic floor and posture with midwife Sarah Lane.</em></span><a class="button" href="mummy-mot.html">Read more</a></div>
          <div class="treat-caption" data-panel="lymph" hidden><span><strong>Lymphatic drainage</strong><br><em>Gentle work aimed at swelling and fluid, including after surgery.</em></span><a class="button" href="lymphatic-drainage.html">Read more</a></div>
        </div>
      </div>
      <p class="treat-all"><a class="button ghost" href="treatments.html">All treatments</a></p>
    </div>
  </section>
  <section class="band sand">
    <div class="wrap why">
      <figure class="why-photo"><img src="assets/images/clinic/treatment.jpg" alt="A TAP therapist treating a client's lower leg on the clinic couch."></figure>
      <div>
        <p class="kicker">Why TAP</p>
        <h2>Not a quick rub and go.</h2>
        <p class="why-lead">Physios, sports massage therapists, a midwife and strength coaches on one team, across Warwick, Stratford-upon-Avon and Leamington Spa. Opened in Warwick in 2015 by Megan Clements. Stratford followed in 2025, and Leamington Spa is the third room.</p>
        <p class="pull">“Pain that keeps coming back isn't bad luck. It's an unfound cause.”</p>
        <p class="review-meta why-meta">Megan Clements, founder. She is currently on maternity leave.</p>
        <p class="why-cta"><a class="button" href="about.html">Meet the team</a></p>
      </div>
    </div>
  </section>
  <section class="band">
    <div class="wrap">
      <div class="section-head"><div><p class="kicker">The team</p><h2>Come in and know who you will see.</h2></div><a class="button ghost section-head-action" href="about.html#team">Full team</a></div>
      <div class="team-preview">
        <figure class="person feature"><img src="assets/images/team/megan.jpg" alt="Megan Clements, founder of TAP Clinics, sitting on a reformer."><figcaption><strong>Megan Clements</strong><span>Founder · on maternity leave</span></figcaption></figure>
        <figure class="person"><img src="assets/images/team/afterlight.jpg" alt="Lauren, physiotherapist at TAP Clinics."><figcaption><strong>Lauren</strong><span>Physiotherapist · HCPC PH152936</span></figcaption></figure>
        <figure class="person"><img src="assets/images/team/anna.jpg" alt="Anna, physiotherapist at TAP Clinics."><figcaption><strong>Anna</strong><span>Physiotherapist · HCPC PH130067</span></figcaption></figure>
        <figure class="person"><img src="assets/images/team/ema.jpg" alt="Ema, massage therapist at TAP Clinics."><figcaption><strong>Ema</strong><span>Massage therapist</span></figcaption></figure>
        <figure class="person"><img src="assets/images/team/stephen.jpg" alt="Stephen, sports massage therapist at TAP Clinics."><figcaption><strong>Stephen</strong><span>Sports massage therapist</span></figcaption></figure>
      </div>
      <p class="team-all"><a class="button ghost" href="about.html#team">Full team</a></p>
    </div>
  </section>
  <section class="band paper" id="reviews">
    <div class="wrap">
      <div class="review-head">
        <div class="review-brand">
          <span class="google-mark" aria-hidden="true"><svg viewBox="0 0 24 24" width="28" height="28"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg></span>
          <div>
            <p class="kicker">Google reviews</p>
            <p class="review-brand-copy">Five-star reviews from the clinic’s Google listing</p>
          </div>
        </div>
        <a class="button ghost" href="${google}" target="_blank" rel="noopener">View on Google</a>
      </div>
      <div class="review-layout">
        <figure class="review-lead">${stars()}<blockquote>${esc(reviews[0].quote)}</blockquote><figcaption class="review-meta">${esc(reviews[0].name)} · ${esc(reviews[0].note)}</figcaption></figure>
        <div class="review-stack">
          ${reviews.slice(1, 4).map((review) => `<article>${stars()}<p>${esc(review.quote)}</p><p class="review-meta">${esc(review.name)} · ${esc(review.note)}</p></article>`).join("")}
        </div>
      </div>
      <div class="review-more">${reviews.slice(4, 8).map((review) => `<article>${stars()}<p>${esc(review.quote)}</p><p class="review-meta">${esc(review.name)} · ${esc(review.note)}</p></article>`).join("")}</div>
      <p class="rating-note">These quotes are the clinic's own published five-star Google reviews, with names shortened by TAP. They are not a live feed. The headline rating above is the Fresha listing, which is a different platform.</p>
    </div>
  </section>
  <section class="band">
    <div class="wrap">
      <div class="section-head"><div><p class="kicker">Clinics</p><h2>Three rooms, one team.</h2></div></div>
      <div class="clinics">
        <a class="clinic-card" href="warwick-clinic.html"><div><p class="kicker">Since 2015</p><h3>Warwick</h3><p>4 The Holloway, CV34 4SJ. Opposite the Rose &amp; Crown. Seven days, 8am to 9pm.</p></div><span>Parking notes</span></a>
        <a class="clinic-card" href="stratford-clinic.html"><div><p class="kicker">Step-free</p><h3>Stratford</h3><p>Unit 3, Avon House, 4 Mulberry Street, CV37 6RS. Seven days, 8am to 9pm. Parking outside.</p></div><span>Clinic details</span></a>
        <a class="clinic-card" href="leamington-spa.html"><div><p class="kicker">Fridays</p><h3>Leamington</h3><p>REGEN Rooms, Suite B, 1 Augusta Place, CV32 5EL. Fridays, plus occasional Wednesdays.</p></div><span>Clinic details</span></a>
      </div>
    </div>
  </section>
  ${bookStrip()}
  <section class="band" id="faqs">
    <div class="wrap faq-split">
      <h2>Questions, answered.</h2>
      <div class="faq">
        <details open><summary>Do I need a GP referral?</summary><p>No. Book online as a private client.</p></details>
        <details><summary>How soon can I be seen?</summary><p>Usually the same week. Warwick and Stratford-upon-Avon are open seven days, 8am to 9pm. Leamington Spa currently runs on Fridays, with occasional Wednesdays.</p></details>
        <details><summary>How much is it?</summary><p>The clinic's own short answer is £65 for a 60-minute appointment. The booking menu is more specific: many 60-minute massages are £65, a physiotherapy initial is £70, and a Mummy MOT or Full Body MOT is £100. <a href="treatments.html#fees">See the menu</a>.</p></details>
        <details><summary>Do you take insurance?</summary><p>TAP is not registered directly with insurers. Many policies still cover physiotherapy with an HCPC-registered physiotherapist, and you can claim back with the invoice. <a href="contact.html#insurance">Read the detail</a>.</p></details>
      </div>
    </div>
  </section>`
}) });

const groups = [...new Set(treatments.map((item) => item.group))];
pages.push({ file: "treatments.html", html: shell({
  title: "Treatments | TAP Clinics",
  description: "Physiotherapy, sports therapy, massage, needling, cupping, lymphatic drainage, pregnancy massage and the Mummy MOT at TAP Clinics.",
  active: "treatments",
  body: `${pageHero("Treatments", "Matched to you, not picked off a menu.", "Every treatment below is available in Warwick, Stratford-upon-Avon and Leamington Spa. If you do not know which one you need, book an assessment.")}
  <div class="wrap" style="padding-bottom:20px">${groups.map((group) => `<section class="group"><h2>${group}</h2><div class="link-list">${treatments.filter((item) => item.group === group).map((item) => `<a href="${item.slug}.html"><span><strong>${item.name}</strong><br><small>${item.line}</small></span><small>${item.price.split(".")[0]}</small></a>`).join("")}</div></section>`).join("")}
  <section class="group" id="fees"><h2>Fees</h2><p>Taken from the Warwick clinic's Fresha menu on ${checked}. Confirm the live price when you book. A Full Body MOT, 90 minutes of assessment and treatment, is £100.</p>
  <table class="price-table"><thead><tr><th>Appointment</th><th>Fee</th></tr></thead><tbody>
    ${treatments.map((item) => `<tr><td><a href="${item.slug}.html">${item.name}</a></td><td>${item.price}</td></tr>`).join("")}
    <tr><td>Full Body MOT</td><td>£100 for 90 minutes</td></tr>
  </tbody></table>
  <p style="margin-top:18px"><a class="button" href="${book}" target="_blank" rel="noopener">Book an appointment</a></p></section>
  <section class="group"><h2>Conditions</h2><div class="link-list">${conditions.map(([slug, name]) => `<a href="${slug}.html">${name}</a>`).join("")}</div></section></div>${bookStrip()}`
}) });

for (const item of treatments) {
  pages.push({ file: `${item.slug}.html`, html: shell({
    title: `${item.name} | TAP Clinics`,
    description: `${item.name} at The Therapy and Performance Clinic in Warwick, Stratford-upon-Avon and Leamington Spa. ${item.line}`,
    active: "treatments",
    body: `${pageHero(item.group, item.name, item.line)}
    <div class="wrap split-page" style="padding-bottom:48px">
      <div class="prose"><p>${item.detail}</p><p><strong>Fee.</strong> ${item.price} From the Warwick Fresha menu, ${checked}.</p><p>Same approach at <a href="warwick-clinic.html">Warwick</a>, <a href="stratford-clinic.html">Stratford-upon-Avon</a> and <a href="leamington-spa.html">Leamington Spa</a>.</p><p><a class="button" href="${book}" target="_blank" rel="noopener">Book ${item.name.toLowerCase()}</a></p></div>
      <figure class="frame"><img src="assets/images/clinic/${item.slug === "physiotherapy" || item.slug === "sports-therapy" ? "warwick-room.jpg" : "treatment.jpg"}" alt="${item.slug === "physiotherapy" || item.slug === "sports-therapy" ? "Treatment room at the Warwick clinic." : "Hands-on treatment at TAP Clinics."}"></figure>
    </div>${bookStrip()}`
  }) });
}

for (const [slug, name, line] of conditions) {
  pages.push({ file: `${slug}.html`, html: shell({
    title: `${name} | TAP Clinics Warwick, Stratford and Leamington Spa`,
    description: `${name} treatment at TAP Clinics. Assessment and hands-on care in Warwick, Stratford-upon-Avon and Leamington Spa.`,
    active: "conditions",
    body: `${pageHero("Conditions", name, line)}
    <div class="wrap prose" style="padding-bottom:40px"><p>You can book without a GP referral. The first session includes assessment and hands-on treatment, then a plan for what to do next. If TAP is not the right place, the team says they will tell you.</p><p>Related care: <a href="physiotherapy.html">physiotherapy</a>, <a href="sports-therapy.html">sports therapy</a> and <a href="sports-massage.html">sports massage</a>.</p><p><a class="button" href="${book}" target="_blank" rel="noopener">Book an assessment</a></p></div>${bookStrip()}`
  }) });
}

pages.push({ file: "clinics.html", html: shell({
  title: "Our clinics | TAP Clinics",
  description: "TAP Clinics in Warwick, Stratford-upon-Avon and Leamington Spa. Addresses, hours and how to book.",
  active: "clinics",
  body: `${pageHero("Our clinics", "Pick whichever day is easier.", "It is the same team and the same standard. Warwick and Stratford run seven days. Leamington Spa is Fridays, with occasional Wednesdays.")}
  <div class="wrap" style="padding-bottom:48px"><div class="choice">
    <a href="warwick-clinic.html"><strong>Warwick</strong><span>4 The Holloway, CV34 4SJ</span><span>7 days, 8am–9pm</span></a>
    <a href="stratford-clinic.html"><strong>Stratford-upon-Avon</strong><span>Unit 3, Avon House, CV37 6RS</span><span>7 days, 8am–9pm · step-free</span></a>
    <a href="leamington-spa.html"><strong>Leamington Spa</strong><span>REGEN Rooms, CV32 5EL</span><span>Fridays, plus some Wednesdays</span></a>
  </div></div>${bookStrip()}`
}) });

const clinicPages = [
  ["warwick-clinic.html", "Warwick", "4 The Holloway, Warwick, CV34 4SJ", books.warwick, "The original clinic, open since 2015, a short walk from the Market Hall. Face the Hair & Beauty Gallery and the door is up the small staircase on the right, opposite the Rose & Crown. There is no waiting room, so arrive at your appointment time and take the chair just inside the door. Easiest parking is Sainsbury's, with two hours free, then a short uphill cut-through. If stairs are difficult, the Stratford clinic is step-free.", "Open seven days, 8am to 9pm, by appointment.", "assets/images/clinic/warwick-room.jpg", "Physiotherapy and massage room at TAP Clinics in Warwick."],
  ["stratford-clinic.html", "Stratford-upon-Avon", "Unit 3, Avon House, 4 Mulberry Street, Stratford-upon-Avon, CV37 6RS", books.stratford, "The second clinic, opened in 2025. Parking is directly outside and there is a waiting area. The Warwick page describes this clinic as completely step-free, which is the one to choose if the Warwick stairs are a problem.", "Open seven days, 8am to 9pm, by appointment.", "assets/images/clinic/treatment.jpg", "Hands-on treatment at TAP Clinics."],
  ["leamington-spa.html", "Leamington Spa", "REGEN Rooms, Suite B, 1 Augusta Place, Leamington Spa, CV32 5EL", books.leamington, "The third TAP room, beside St Peter's multi-storey car park. Bookings are open. Days are fewer than the other two clinics, so check the live diary before you travel.", "Fridays, 8am to 9pm, plus occasional Wednesdays.", "assets/images/clinic/warwick-room.jpg", "A TAP treatment room."]
];
for (const [file, name, address, href, copy, hours, image, alt] of clinicPages) {
  pages.push({ file, html: shell({
    title: `${name} clinic | TAP Clinics`,
    description: `TAP Clinics in ${name}. ${address}. ${hours}`,
    active: "clinics",
    body: `${pageHero("Our clinics", name, address)}
    <div class="wrap split-page" style="padding-bottom:40px"><div class="prose"><p>${copy}</p><p><strong>Hours.</strong> ${hours}</p><p><a href="${tel}">${phone}</a> · <a href="mailto:${email}">${email}</a></p><p><a class="button" href="${href}" target="_blank" rel="noopener">Book ${name}</a></p></div><figure class="frame"><img src="${image}" alt="${alt}"></figure></div>${bookStrip()}`
  }) });
}

const team = [
  ["Megan Clements", "Founder · sports therapist · UKA athletics coach", "assets/images/team/megan.jpg", "Megan Clements, founder of TAP Clinics.", "Megan opened The Therapy and Performance Clinic in 2015. She is a sports therapist and a certified UKA athletics coach, with a long background in running, and she leads the online coaching. She is currently on maternity leave.", "On maternity leave"],
  ["Bethan", "Sports therapist", "assets/images/team/img-7665.jpg", "Bethan, sports therapist, during a shoulder treatment.", "Bethan has a BSc (Hons) in Sports Therapy from Coventry University and more than a decade in rehab. She has worked with Warwickshire RFU, Midlands RFU and Stratford Upon Avon RFC, and has lectured in sports therapy and strength and conditioning.", ""],
  ["Lauren", "Physiotherapist and sports massage therapist", "assets/images/team/afterlight.jpg", "Lauren, physiotherapist at TAP Clinics.", "Lauren has a first-class BSc (Hons) in Physiotherapy from Sheffield Hallam University and is HCPC registered, PH152936. Her clinical experience includes NHS outpatient, community and inpatient work across musculoskeletal, rheumatology, cardiology and neurological care.", ""],
  ["Anna", "Physiotherapist", "assets/images/team/anna.jpg", "Anna, physiotherapist at TAP Clinics.", "Anna has a first-class BSc in Physiotherapy and is HCPC registered, PH130067. She started in NHS rotations, then spent four years in orthopaedic and musculoskeletal physiotherapy. Pre and post-operative rehab is the work she particularly likes.", ""],
  ["Ema", "Massage therapist", "assets/images/team/ema.jpg", "Ema, massage therapist at TAP Clinics.", "Ema is qualified in sports, Swedish, deep tissue, Thai yoga and Indian head massage, plus stretch therapy and lymphatic drainage. She also works with people after surgery using lymphatic drainage.", ""],
  ["Stephen", "Sports massage therapist", "assets/images/team/stephen.jpg", "Stephen, sports massage therapist at TAP Clinics.", "Stephen danced professionally for more than ten years, including at the Moulin Rouge, and uses that background in sports massage for athletes, people who train, and everyday muscle tension.", ""],
  ["Sarah Lane", "Midwife and women's health", "assets/images/team/sarah.jpg", "Sarah Lane, women's health specialist at TAP Clinics.", "Sarah is a midwife and women's health specialist. At TAP she offers the Mummy MOT, looking at pelvic floor, core, posture and postnatal recovery, and support for staying active through pregnancy.", ""]
];

pages.push({ file: "about.html", html: shell({
  title: "About and team | TAP Clinics",
  description: "The Therapy and Performance Clinic, founded by Megan Clements in Warwick in 2015. Meet the physiotherapists, therapists and midwife.",
  active: "about",
  body: `${pageHero("About", "Rehab. Recovery. Results.", "Megan Clements started TAP in 2015 so people could move better without being passed between a massage, a physio sheet and a gym plan that ignored both.")}
  <div class="wrap split-page"><div class="prose"><p>It began with a few weekly sessions in Warwick. The team now sees people in person and online, and in 2025 opened a second clinic in Stratford-upon-Avon. Leamington Spa is the third room.</p><p>The people who book are runners, gym-goers, athletes, desk workers, and anyone whose back, knee, hip, neck or foot will not settle. You do not have to play sport.</p><p><a class="button ghost" href="#team">Get to know the team</a></p></div><figure class="frame"><img src="assets/images/team/megan.jpg" alt="Megan Clements, founder of TAP Clinics."></figure></div>
  <section class="band" id="team"><div class="wrap team-full">${team.map(([name, role, src, alt, bio, leave]) => `<article><img src="${src}" alt="${alt}"><div><p class="kicker">${role}</p><h2>${name}</h2>${leave ? `<p class="leave">${leave}</p>` : ""}<p style="margin-top:10px">${bio}</p></div></article>`).join("")}</div></section>${bookStrip()}`
}) });

pages.push({ file: "contact.html", html: shell({
  title: "Contact, your visit and insurance | TAP Clinics",
  description: "Call or text TAP Clinics on 07904 839521. Clinic addresses, parking, FAQs and how private insurance works.",
  active: "contact",
  body: `${pageHero("Contact", "Talk to us, or just book.", "The fastest route is the booking page. If you would rather ask first, call or text, or send a note and your email app will open.")}
  <div class="wrap split-page" style="padding-bottom:20px">
    <form class="form" data-contact-form>
      <label>Name<input name="name" required autocomplete="name"></label>
      <label>Email<input name="email" type="email" required autocomplete="email"></label>
      <label>Phone<input name="phone" type="tel" required autocomplete="tel"></label>
      <label>Clinic<select name="clinic" required><option value="">Choose a clinic</option><option>Warwick</option><option>Stratford-upon-Avon</option><option>Leamington Spa</option><option>Not sure</option></select></label>
      <label>What is it about?<select name="about"><option>Booking</option><option>Physiotherapy</option><option>Massage</option><option>Mummy MOT</option><option>Insurance</option><option>Coaching</option><option>Something else</option></select></label>
      <label>Message<textarea name="message" required></textarea></label>
      <button class="button" type="submit">Email this to TAP</button>
      <p class="form-note">This opens an email to ${email}. It is not sent until you press send in your email app. Or call ${phone}.</p>
    </form>
    <div class="prose">
      <p><a href="${tel}">${phone}</a><br><a href="mailto:${email}">${email}</a></p>
      <p><a href="warwick-clinic.html">Warwick</a>, 4 The Holloway, CV34 4SJ<br><a href="stratford-clinic.html">Stratford-upon-Avon</a>, Unit 3, Avon House, 4 Mulberry Street, CV37 6RS<br><a href="leamington-spa.html">Leamington Spa</a>, REGEN Rooms, Suite B, 1 Augusta Place, CV32 5EL</p>
      <p><a class="button" href="book.html">Choose a clinic and book</a></p>
    </div>
  </div>
  <section class="band sand" id="visit"><div class="wrap prose" style="max-width:46rem"><h2>Your visit</h2>
    <p>Warwick has on-street parking nearby and two hours free at Sainsbury's, about five minutes' walk, uphill at the end. There is no waiting room. Stratford-upon-Avon has parking directly outside, a waiting area, and step-free access. Leamington Spa is beside St Peter's multi-storey.</p>
    <p>For a first appointment, wear something you can move in, such as shorts. New clients complete a consent form. If you are late, the session may be shorter and the full fee still applies. Please give one business day, 24 hours, if you need to cancel or move. After that the full fee applies, unless the slot is filled. A text to ${phone} is enough. Payment is due at the end unless you have prepaid, by cash or card.</p>
  </div></section>
  <section class="band" id="insurance"><div class="wrap prose" style="max-width:46rem"><h2>Private insurance</h2>
    <p>TAP is not registered directly with health insurers. Many policies still cover physiotherapy with any HCPC-registered physiotherapist. You pay for the session, and the clinic gives you an invoice with your physiotherapist's HCPC number so you can claim it back.</p>
    <p>Check the policy first, including any excess, GP referral or pre-authorisation. Shortfalls and declined claims are not covered by TAP. Email <a href="mailto:${email}">${email}</a> before you book if you want to check.</p>
  </div></section>
  <section class="band paper" id="faqs"><div class="wrap"><h2>FAQs</h2><div class="faq" style="margin-top:12px">
    <details open><summary>Where are you?</summary><p>Warwick, 4 The Holloway, CV34 4SJ. Stratford-upon-Avon, Unit 3, Avon House, 4 Mulberry Street, CV37 6RS. Leamington Spa, REGEN Rooms, Suite B, 1 Augusta Place, CV32 5EL.</p></details>
    <details><summary>Do I have to play sport?</summary><p>No. The team also sees office workers, parents, people after surgery, and weekend walkers.</p></details>
    <details><summary>Physiotherapy or sports massage?</summary><p>Physiotherapy is for a problem that needs assessing and rehab. Sports massage is soft-tissue work for tightness and recovery. If you are unsure, book a physio-led assessment.</p></details>
    <details><summary>What happens first?</summary><p>A history, a look at how you move, and hands-on treatment in that visit. You should leave knowing what is going on, not only with a sheet of exercises.</p></details>
    <details><summary>What can you help with?</summary><p>Back pain, neck pain, knee pain, hip pain, sciatica, shoulder problems, plantar fasciitis, sports injuries and rehab after surgery are the problems the clinic lists. Ask if yours is not on that list.</p></details>
    <details><summary>How often should I have a massage?</summary><p>Some people come once. Others book regularly while they are training. The team says they will recommend what you need rather than sign you up for more.</p></details>
    <details><summary>Can treatments be combined?</summary><p>Yes. A session might include needling on one area and hands-on work elsewhere.</p></details>
  </div></div></section>${bookStrip()}`
}) });

pages.push({ file: "book.html", html: shell({
  title: "Book an appointment | TAP Clinics",
  description: "Book TAP Clinics online in Warwick, Stratford-upon-Avon or Leamington Spa.",
  active: "contact",
  body: `${pageHero("Book", "Choose your clinic.", "Single sessions, memberships and gift vouchers are on the booking page. If you are unsure, choose the not-sure option and the team will decide with you.")}
  <div class="wrap" style="padding-bottom:48px"><div class="choice">
    <a href="${books.warwick}" target="_blank" rel="noopener"><strong>Warwick</strong><span>4 The Holloway</span><span>Opens Fresha</span></a>
    <a href="${books.stratford}" target="_blank" rel="noopener"><strong>Stratford-upon-Avon</strong><span>Avon House, Mulberry Street</span><span>Opens Fresha</span></a>
    <a href="${books.leamington}" target="_blank" rel="noopener"><strong>Leamington Spa</strong><span>REGEN Rooms, Augusta Place</span><span>Opens Fresha</span></a>
  </div><p style="margin-top:18px"><a href="${book}" target="_blank" rel="noopener">Or open the combined booking menu</a> · <a href="${tel}">${phone}</a></p></div>`
}) });

pages.push({ file: "online-coaching.html", html: shell({
  title: "Online coaching | TAP Clinics",
  description: "Physio-led online coaching from TAP: running, marathon, fat loss, pregnancy, netball and TAP Teens.",
  active: "more",
  body: `${pageHero("Coaching", "Plans written around your week.", "Online coaching is built by the physio-led team. You get a plan in the app, weekly check-ins and WhatsApp support. If a niggle shows up, you can see someone online or in Warwick or Stratford-upon-Avon.")}
  <div class="wrap" style="padding-bottom:40px"><div class="link-list">
    <a href="runningpathway.html"><span><strong>Running</strong><br><small>5k, 10k and half marathon, from a UKA-qualified, physio-led team.</small></span></a>
    <a href="marathon-coaching.html"><span><strong>Marathon</strong><br><small>Base building through to taper, including a 20-mile race sim and strength work.</small></span></a>
    <a href="fatlosspathway.html"><span><strong>Fat loss</strong><br><small>No crash diets. Water, food, protein, steps and strength, adjusted weekly.</small></span></a>
    <a href="pregnancy-pathway.html"><span><strong>Pregnancy and postpartum</strong><br><small>Strength through pregnancy and a gradual return afterwards, including pelvic floor and core.</small></span></a>
    <a href="netballpathway.html"><span><strong>Netball</strong><br><small>Court-specific strength, fuelling and in-season check-ins.</small></span></a>
    <a href="tap-teens.html"><span><strong>TAP Teens</strong><br><small>Strength and conditioning for girls aged 13 to 17, with parents in the chat.</small></span></a>
  </div><p style="margin-top:22px"><a class="button" href="mailto:${email}?subject=Online%20coaching">Ask about coaching</a></p></div>`
}) });

const paths = [
  ["runningpathway.html", "Running coaching", "Online running coaching for 5k, 10k and half marathon.", "Your plan is written around your diary, your current running and the race you have chosen. Easy runs, sessions and strength each have a reason. Weekly check-ins and WhatsApp support sit with it, and physio is there if something starts to niggle."],
  ["marathon-coaching.html", "Marathon coaching", "Physio-led online marathon coaching.", "For a first marathon or a personal best. Blocks run from base building to taper, with a 20-mile race simulation, fuelling practice and strength work. The plan changes when life does."],
  ["fatlosspathway.html", "Fat loss coaching", "Online fat-loss coaching without a crash diet.", "Built for people who are tired of starting again on Monday. The habits TAP names are water, whole foods, protein, steps and strength, with step targets that rise from where you are now."],
  ["pregnancy-pathway.html", "Pregnancy and postpartum coaching", "Physio-led coaching through pregnancy and after birth.", "Plans follow the trimester, energy and recovery, including pelvic floor and core, and a gradual return to running when you are ready. There is no bounce-back target."],
  ["netballpathway.html", "Netball pathway", "Coaching for club, county, university and performance netball.", "Strength, power, landing and change of direction, planned around matches rather than random extra fitness. Weekly check-ins and fuelling guidance are part of it. The current site also runs club kit for netball teams."],
  ["tap-teens.html", "TAP Teens", "Online strength and conditioning for girls aged 13 to 17.", "Coaching around her sport, plus the things the page says often get missed: fuelling a growing body, how periods affect training, and nerves. Parents are in every chat and get the weekly check-ins."]
];
for (const [file, title, description, copy] of paths) {
  pages.push({ file, html: shell({
    title: `${title} | TAP Clinics`,
    description,
    active: "more",
    body: `${pageHero("Coaching", title, description)}<div class="wrap prose" style="padding-bottom:36px"><p>${copy}</p><p>Coaching is online across the UK. In-person physio support is in Warwick and Stratford-upon-Avon.</p><p><a class="button" href="mailto:${email}?subject=${encodeURIComponent(title)}">Ask about ${title}</a> <a class="button ghost" href="online-coaching.html">All pathways</a></p></div>`
  }) });
}

pages.push({ file: "corporate-wellbeing.html", html: shell({
  title: "Corporate wellbeing | TAP Clinics",
  description: "Onsite physiotherapy and massage for employers across Warwickshire from TAP Clinics.",
  active: "more",
  body: `${pageHero("Workplaces", "Onsite physio and massage.", "For employers across Warwickshire, including Warwick, Leamington Spa, Stratford-upon-Avon, Rugby and Bedworth.")}
  <div class="wrap prose" style="padding:10px 0 48px"><p>Two ways in. Wellbeing days, with 25-minute massage and physio sessions for the team. Or ongoing workplace physio, with 60-minute one-to-one appointments, each with an assessment, hands-on treatment and a rehab plan.</p><p>HCPC-registered physiotherapists bring the couches and equipment. Staff use one booking link. TAP handles the booking, cancellations and plans.</p><p><a class="button" href="mailto:${email}?subject=Corporate%20wellbeing">Plan a workplace visit</a></p></div>`
}) });

pages.push({ file: "blog.html", html: shell({
  title: "Journal | TAP Clinics",
  description: "Notes from TAP Clinics on booking, running, recovery and everyday pain.",
  active: "more",
  body: `${pageHero("Journal", "From the treatment room.", "These pieces live on the current TAP journal. This page points you to them rather than republishing the articles.")}
  <div class="wrap" style="padding-bottom:48px"><div class="blog-list">${posts.map(([title, href, summary]) => `<a href="${href}" target="_blank" rel="noopener"><time>Journal</time><span><strong>${title}</strong><br>${summary}</span></a>`).join("")}</div></div>`
}) });

const tapKit = [
  ["TAP Distance Short", "£20"], ["TAP Sculpt Tank", "£20"], ["TAP Training Crop Tee", "£15"], ["TAP Tempo Quarter Zip", "£20"],
  ["TAP Warm Up Quarter Zip", "£28"], ["TAP Cool Down Long Sleeve Tee", "£25"], ["TAP Post Run Sweatshirt", "£25"],
  ["TAP Finish Line Hoodie", "£25"], ["TAP Fav Colours Hoodie", "£25"], ["TAP Rest Day Straight Leg Sweatpant", "£20"], ["TAP Recovery Wide Leg Pant", "£30"]
];
pages.push({ file: "shop.html", html: shell({
  title: "Shop and club kit | TAP Clinics",
  description: "TAP training kit and club shops, including the current Napton netball range, on the TAP shop.",
  active: "more",
  body: `${pageHero("Shop", "Kit for training, and shops for clubs.", "The live shop is on Shopify. Prices below were listed on ${checked}.")}
  <div class="wrap shop-grid" style="padding-bottom:20px">
    <article><h3>TAP training kit</h3><ul class="link-list">${tapKit.map(([name, price]) => `<li style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--line)"><span>${name}</span><span>${price}</span></li>`).join("")}</ul><p style="margin-top:16px"><a class="button" href="${shop}" target="_blank" rel="noopener">Open the shop</a></p></article>
    <article id="clubs"><h3>Club shops</h3><p>TAP Training Club sets up an online shop for sports clubs, from netball to football, hockey, rugby and running. Players order from one link. TAP handles payment, printing, delivery and size questions. The current shop includes a Napton netball range, from a £12 crop tee to £27 hoodies.</p><p style="margin-top:16px">The service is described as free for the club, with an optional way to raise funds.</p><p style="margin-top:16px"><a class="button" href="mailto:${email}?subject=Club%20kit">Set up a club shop</a></p></article>
  </div>`
}) });

pages.push({ file: "privacy.html", html: shell({
  title: "Privacy | TAP Clinics",
  description: "How this TAP Clinics preview handles enquiries, and a link to the current privacy policy.",
  active: "more",
  body: `${pageHero("Privacy", "Your details.", "")}<div class="wrap prose" style="padding-bottom:48px"><p>The contact form on this preview does not store your message. It opens an email to ${email} for you to send yourself. Booking is handled on Fresha, under their own privacy terms.</p><p>The current clinic policy is at <a href="https://www.tapclinics.co.uk/privacy-policy">tapclinics.co.uk/privacy-policy</a>.</p></div>`
}) });
pages.push({ file: "terms.html", html: shell({
  title: "Terms | TAP Clinics",
  description: "Appointment terms for TAP Clinics, including cancellation, and a link to the current terms page.",
  active: "more",
  body: `${pageHero("Terms", "Appointments.", "")}<div class="wrap prose" style="padding-bottom:48px"><p>Please give 24 hours' notice, one business day, to cancel or move an appointment. After that the full fee applies, unless the clinic fills the slot. Running late can shorten the session, and the fee still applies. Payment is due at the end unless prepaid.</p><p>The current full terms are at <a href="https://www.tapclinics.co.uk/termsandconditions">tapclinics.co.uk/termsandconditions</a>.</p></div>`
}) });

const redirects = {
  "aboutus.html": "about.html",
  "meet-the-team.html": "about.html#team",
  "faq.html": "contact.html#faqs",
  "private-insurance.html": "contact.html#insurance",
  "clinic-visits.html": "contact.html#visit",
  "bookonline.html": "book.html",
  "treatments-warwickandstratford.html": "treatments.html",
  "team-kit.html": "shop.html#clubs",
  "warwick-massage.html": "treatments.html",
  "stratford-massage.html": "treatments.html",
  "massage-leamington-spa.html": "treatments.html",
  "corporate-wellbeing.html": "corporate-wellbeing.html"
};
const treatmentRedirects = {
  physiotherapy: ["physiotherapy-warwick", "physiotherapy-stratford-upon-avon", "physiotherapy-leamington-spa"],
  "sports-massage": ["sports-massage-warwick", "sports-massage-stratford-upon-avon", "sports-massage-leamington-spa"],
  "sports-therapy": ["warwick-sportstherapy", "stratford-sports-therapy", "sports-therapy-leamington-spa"],
  "deep-tissue-massage": ["warwick-deep-tissue-massage", "stratford-deep-tissue-massage", "deep-tissue-massage-leamington-spa"],
  "swedish-massage": ["warwick-swedishmassage", "stratford-swedish-massage", "swedish-massage-leamington-spa"],
  "indian-head-massage": ["warwick-indian-headmassage", "stratfordindianheadmassage", "indian-head-massage-leamington-spa"],
  "thai-yoga-massage": ["warwick-thaiyogamassage", "stratford-thai-yoga-massage", "thai-yoga-massage-leamington-spa"],
  "stretch-therapy": ["warwick-stretchtherapy", "stratford-stretch-therapy", "stretch-therapy-leamington-spa"],
  "dry-cupping": ["warwick-drycupping", "stratford-dry-cupping", "dry-cupping-leamington-spa"],
  "dry-needling": ["warwick-dryneedling", "stratford-dry-needling", "dry-needling-leamington-spa"],
  "lymphatic-drainage": ["lymphatic-drainage-warwick", "lymphatic-drainage-stratford-upon-avon", "lymphatic-drainage-leamington-spa"],
  "pregnancy-massage": ["warwick-pregnancymassage", "stratford-pregnancy-massage", "pregnancy-massage-leamington-spa"],
  "mummy-mot": ["warwick-mummymot", "stratford-mummy-mot", "mummy-mot-leamington-spa"]
};
for (const [target, sources] of Object.entries(treatmentRedirects)) {
  for (const source of sources) redirects[`${source}.html`] = `${target}.html`;
}
delete redirects["corporate-wellbeing.html"];

const redirectMap = [];
for (const [from, to] of Object.entries(redirects)) {
  if (pages.some((page) => page.file === from)) continue;
  redirectMap.push({ from: from.replace(".html", ""), to: to.replace(".html", "").replace("#", "#") });
  const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${to}"><link rel="canonical" href="${to}"><title>Redirecting…</title></head><body><p>This page has moved. <a href="${to}">Continue</a>.</p></body></html>`;
  pages.push({ file: from, html });
}

mkdirSync(root, { recursive: true });
for (const page of pages) {
  const target = join(root, page.file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, page.html);
}
writeFileSync(join(root, "redirects.json"), JSON.stringify({
  checked,
  note: "Old tapclinics.co.uk paths consolidated onto fewer pages. Condition, clinic and coaching URLs are kept.",
  redirects: redirectMap,
  preserved: ["back-pain", "knee-pain", "hip-pain", "sciatica", "neck-pain", "shoulder-pain", "plantar-fasciitis", "warwick-clinic", "stratford-clinic", "leamington-spa", "contact", "blog", "online-coaching", "marathon-coaching", "runningpathway", "fatlosspathway", "pregnancy-pathway", "netballpathway", "tap-teens", "corporate-wellbeing"]
}, null, 2));
console.log(`Wrote ${pages.length} HTML files`);
