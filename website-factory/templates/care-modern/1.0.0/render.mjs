// Clinic layout for dental, physiotherapy, chiropractic and veterinary.
// Service names come from the site record. Brand tint comes from site.brand.accent. No shop, cart, invented reviews or statistics.
export function render(s, e) {
  const b = s.business;
  const name = e(b.name.value);
  const location = e(b.location.value);
  const accent = /^#[0-9a-fA-F]{6}$/.test(s.brand?.accent || '') ? s.brand.accent : '#1f4b99';
  const rgb = [parseInt(accent.slice(1, 3), 16), parseInt(accent.slice(3, 5), 16), parseInt(accent.slice(5, 7), 16)];
  const mix = (target, t) => '#' + rgb.map((channel, index) => Math.max(0, Math.min(255, Math.round(channel + (target[index] - channel) * t))).toString(16).padStart(2, '0')).join('');
  const lum = rgb.map(channel => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const bright = 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2] > 0.62;
  const onAccent = bright ? '#111111' : '#ffffff';
  const pale = mix([255, 255, 255], 0.82);
  const initial = e((b.name.value || '•').trim().charAt(0).toUpperCase());
  const logo = s.assets.logo
    ? `<img class="logo" src="${e(s.assets.logo.path)}" alt="${e(s.assets.logo.alt)}">`
    : `<span class="wordmark"><span class="mark" aria-hidden="true">${initial}</span><span><strong>${name}</strong><small>${location}</small></span></span>`;
  const footerMark = s.assets.logo
    ? `<img class="footer-logo" src="${e(s.assets.logo.path)}" alt="${e(s.assets.logo.alt)}">`
    : name;
  const phoneDigits = (b.phone?.value || '').replace(/[^\d+]/g, '');
  const phoneOk = /^\+?\d{7,15}$/.test(phoneDigits);
  const phoneText = phoneOk ? `<a class="nav-phone" href="tel:${phoneDigits}">${e(b.phone.value)}</a>` : '';
  const contactLead = phoneOk
    ? `<p>Call <a class="contact-call" href="tel:${phoneDigits}">${e(b.phone.value)}</a>, or submit a message here. Reception will get back to you as soon as possible.</p>`
    : '<p>Submit a message here. Reception will get back to you as soon as possible.</p>';
  const website = b.website && /^https:\/\//.test(b.website.value)
    ? `<a href="${e(b.website.value)}" rel="noopener noreferrer">Official website</a>`
    : '';
  const services = (Array.isArray(b.services) ? b.services : []).slice(0, 8);
  const serviceSlug = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
  const usedServiceSlugs = new Map();
  const listed = services.map(service => {
    const base = serviceSlug(service.value);
    const count = usedServiceSlugs.get(base) || 0;
    usedServiceSlugs.set(base, count + 1);
    return { value: service.value, detail: service.detail, id: `service-${base}${count ? `-${count + 1}` : ''}` };
  });
  const pictures = Array.isArray(s.assets?.images) ? s.assets.images : [];
  const landingImage = pictures.find(image => image && image.placement === 'landing');
  const portraitImage = pictures.find(image => image && image.placement === 'portrait');
  const serviceImage = pictures.find(image => image && image.placement === 'service');
  const bookingImage = pictures.find(image => image && image.placement === 'booking');
  const reviewImage = pictures.find(image => image && image.placement === 'review');
  const reservedIds = new Set([
    ...(Array.isArray(s.people) ? s.people : []),
    ...(Array.isArray(s.examplePeople) ? s.examplePeople : [])
  ].map(person => person && person.imageId).filter(Boolean));
  const reviewPortraitIds = ['care-review-arm', 'care-review-ball', 'care-review-shoulder'];
  const reviewPortraitSet = new Set(reviewPortraitIds);
  const gallery = pictures.filter(image => image && image.placement !== 'landing' && image.placement !== 'portrait' && image.placement !== 'service' && image.placement !== 'person' && image.placement !== 'about' && !reservedIds.has(image.libraryId) && !reviewPortraitSet.has(image.libraryId));
  const frame = (image, caption, className) => image
    ? `<figure class="${className}"><img src="${e(image.path)}" alt="${e(image.alt)}"></figure>`
    : `<figure class="${className} frame" role="img" aria-label="${caption}"></figure>`;
  const heroPin = landingImage && (landingImage.libraryId === 'physio-landing-treatment' || landingImage.libraryId === 'care-landing-treatment') ? ' class="anchor-top-right"' : '';
  const heroMedia = landingImage
    ? `<figure class="hero-media"><img${heroPin} src="${e(landingImage.path)}" alt="${e(landingImage.alt)}"></figure>`
    : frame(gallery[0], 'Photograph awaiting an approved category image.', 'hero-media');
  const sideMedia = frame(gallery[2] || gallery[0], 'Photograph awaiting an approved category image.', 'side-media');
  const alternateServiceIds = ['physiotherapy', 'chiropractic', 'general'].includes(s.sector) ? [null, 'care-service-tile-2', 'care-review-shoulder'] : [];
  const serviceCover = index => {
    const alternateId = alternateServiceIds[index];
    const alternate = alternateId && pictures.find(image => image && image.libraryId === alternateId);
    return frame(alternate || serviceImage || gallery[0], 'Photograph awaiting an approved category image.', 'tile-media');
  };
  const wordCount = value => value ? value.split(' ').length : 0;
  const heroIntroduction = text => {
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (wordCount(clean) <= 50) return clean;
    const sentences = clean.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [];
    let kept = '';
    for (const sentence of sentences) {
      const next = `${kept}${sentence}`;
      if (wordCount(next.trim()) > 50) break;
      kept = next;
    }
    return kept.trim() || clean.split(' ').slice(0, 50).join(' ');
  };
  const heroFace = (title, detail) => `<span class="hero-face"><span class="mini" aria-hidden="true"></span><span class="hero-copy"><strong>${title}</strong><em>${detail}</em></span><span class="hero-go" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span>`;
  const place = b.address?.value || b.location?.value || '';
  const heroCards = [
    `<a class="hero-card" href="#services">${heroFace('Services', 'Open the list.')}</a>`,
    phoneOk
      ? `<a class="hero-card" href="tel:${phoneDigits}">${heroFace(e(b.phone.value), 'Phone')}</a>`
      : `<a class="hero-card" href="#contact">${heroFace('Phone', 'Awaiting confirmation.')}</a>`,
    `<a class="hero-card" href="#contact">${heroFace(place ? e(place) : 'Location', place ? 'Location' : 'Address awaiting confirmation.')}</a>`
  ].join('');
  const serviceLinks = services.length
    ? listed.map(service => `<button type="button">${e(service.value)}</button>`).join('')
    : '<p class="pending">Service details awaiting confirmation.</p>';
  const shotCopy = service => `<p class="shot-copy"><span><strong>${e(service.value)}</strong><em>Listed for ${name}.</em></span><a class="button" href="#contact">Booking</a></p>`;
  const serviceTiles = services.length
    ? services.map((service, index) => `<div class="shot">${serviceCover(index)}${shotCopy(service)}</div>`).join('')
    : '';
  const serviceAccordion = services.length
    ? services.map((service, index) => `<details name="listed-services"><summary>${e(service.value)}</summary><div class="accordion-panel">${serviceCover(index)}${shotCopy(service)}</div></details>`).join('') + '<a class="button accordion-book" href="#contact">Book appointment</a>'
    : '';
  const serviceHover = services.map((_, index) => {
    const n = index + 1;
    const on = `.service-split[data-active="${index}"]`;
    return `${on} .shots .shot{opacity:0;visibility:hidden}${on} .shots .shot:nth-child(${n}){opacity:1;visibility:visible}${on} .service-links button{font-weight:500}${on} .service-links button:nth-child(${n}){font-weight:600}`;
  }).join('');
  const serviceTargets = listed.map(service => `body:has(#${service.id}:target)`).join(',');
  const serviceNavOn = serviceTargets ? `,${serviceTargets} .site-header nav a[href="#services"]` : '';
  const serviceHomeOff = serviceTargets ? `,${serviceTargets} .site-header nav a[href="#home"]` : '';
  const menuCurrent = listed.map(service => `body:has(#${service.id}:target) .menu-panel a[href="#${service.id}"]{background:var(--pale)}`).join('');
  const serviceMenu = listed.map(service => `<a href="#${service.id}">${e(service.value)}</a>`).join('');
  const offerItems = listed.map((service, index) => {
    const open = index === 0 ? ' open' : '';
    const num = String(index + 1).padStart(2, '0');
    return `<div class="offer-item"><details class="offer-fold" name="listed-offers"${open}><summary class="offer-pick"><span>${num}</span>${e(service.value)}</summary><article class="offer-panel"><span class="offer-shape offer-local" aria-hidden="true"></span><span class="offer-shape offer-shape-b offer-local" aria-hidden="true"></span><p class="flag">Illustrative layout — not a treatment description</p><h2>${e(service.value)}</h2><p>Listed for ${name}. This panel does not add a price, a method or a result.</p><a class="about-link" href="#${service.id}"><span class="about-orb" aria-hidden="true">→</span> Open page</a></article></details></div>`;
  }).join('');
  const offerSelect = listed.map((_, index) => {
    const n = index + 1;
    const turn = [-14, 22, 40, -8, 28][index % 5];
    const on = `.offer-board:has(.offer-item:nth-child(${n}) .offer-fold[open])`;
    return `${on} .offer-shape{transform:rotate(${turn}deg)}${on} .offer-shape-b{transform:rotate(${-turn}deg)}`;
  }).join('');
  const serviceBlurbs = (s.demo ? {
    physiotherapy: {
      Physiotherapy: 'Physiotherapy is care for how you move. A visit looks at the joint, muscle or everyday task that is getting in the way, and agrees what to work on together.',
      'Movement assessment': 'A movement assessment is a closer look at how you stand, walk and bend. It is a way to notice what feels limited before a plan is agreed.',
      'Sports rehabilitation': 'Sports rehabilitation is support for returning to training and sport. The work follows the demands of the activity, from the first sessions back through to a fuller schedule.',
      'Chiropractic care': 'Chiropractic care focuses on the spine and how the rest of the body moves around it. A visit starts with what you are feeling in sitting, standing and everyday tasks.',
      'Exercise rehabilitation': 'Exercise rehabilitation uses guided movement alongside hands-on care. The exercises are chosen for the person and the activity they want to get back to.'
    },
    chiropractic: {
      'Chiropractic care': 'Chiropractic care focuses on the spine and how the rest of the body moves around it. A visit starts with what you are feeling in sitting, standing and everyday tasks.'
    },
    dental: {
      Cosmetic: 'Cosmetic is listed for appearance-focused dental visits. This page does not describe a treatment or a result.',
      'Oral Hygiene': 'Oral hygiene is listed for cleaning and day-to-day mouth care. This page does not describe a method or a result.',
      Emergency: 'Emergency is listed for an urgent dental visit. This page does not promise a same-day appointment or a result.',
      Family: 'Family is listed for dental care across ages. This page does not describe who is treated or a result.',
      DenPlan: 'DenPlan is a listed payment-plan name for this layout. This page does not confirm a membership, a price or a result.'
    }
  }[s.sector] : {}) || {};
  const clipDetail = value => {
    const clean = String(value || '').replace(/\s+/g, ' ').trim();
    if (!clean) return '';
    const words = clean.split(' ');
    if (words.length <= 55) return clean;
    const cut = words.slice(0, 55).join(' ');
    const sentence = cut.match(/^[\s\S]*[.!?](?=\s|$)/);
    return (sentence ? sentence[0] : cut).trim();
  };
  const servicePages = listed.map((service, index) => {
    const sourced = s.demo ? '' : clipDetail(service.detail);
    const blurb = sourced || serviceBlurbs[service.value] || `${e(service.value)} is listed for ${name}. A short description of the service belongs on this page. It does not add a price or a promised result.`;
    const flag = sourced ? 'From the published website' : 'Illustrative layout — not a treatment description';
    return `<section id="${service.id}" class="page service-page" data-shape="${index % 5}"><div class="service-sheet"><a class="service-back" href="#services"><span class="service-back-mark" aria-hidden="true">←</span> Services</a><div class="service-poster"><div class="service-stamp" aria-hidden="true"><span class="service-num">${String(index + 1).padStart(2, '0')}</span><span class="service-blob"></span></div><div class="service-copy"><p class="flag">${flag}</p><h1>${e(service.value)}</h1><p class="service-lead">${sourced ? e(sourced) : blurb}</p><a class="button solid service-cta" href="#contact">Book appointment</a></div></div></div></section>`;
  }).join('');
  const publishedPeople = (Array.isArray(s.people) ? s.people : [])
    .filter(person => person && person.name && person.detail);
  const examplePeople = (Array.isArray(s.examplePeople) ? s.examplePeople : [])
    .filter(person => person && person.name && person.detail);
  const people = publishedPeople.length ? publishedPeople : examplePeople;
  const namedImage = person => person.imageId ? pictures.find(image => image && image.libraryId === person.imageId) : null;
  const wellImageSectors = new Set(['physiotherapy', 'chiropractic', 'general']);
  const templateMeetIds = ['care-jordan-example', 'care-sam-example', 'care-riley-example'];
  const templateMeetImage = index => {
    if (!wellImageSectors.has(s.sector)) return null;
    const id = templateMeetIds[index % templateMeetIds.length];
    return pictures.find(image => image && image.libraryId === id) || null;
  };
  const personFlag = publishedPeople.length ? '' : '<p class="flag">Illustrative layout — not a verified member of staff</p>';
  const anchoredMeet = new Set(['care-riley-example', 'care-jordan-example', 'care-sam-example']);
  const faceClass = image => image && image.placement === 'person' && !anchoredMeet.has(image.libraryId) ? ' class="anchor-face"' : '';
  const personCards = people.map((person, index) => {
    const image = namedImage(person) || templateMeetImage(index) || gallery[index];
    const letter = e(String(person.name).trim().charAt(0).toUpperCase());
    const thumbFace = faceClass(image);
    const photo = image
      ? `<figure class="thumb"><img${thumbFace} src="${e(image.path)}" alt="${e(image.alt)}"></figure>`
      : `<figure class="thumb" role="img" aria-label="Portrait area for ${e(person.name)}"><span aria-hidden="true">${letter}</span></figure>`;
    return `<article class="person${index === 0 ? ' is-current' : ''}">${photo}<div class="person-card">${personFlag}<h2>${e(person.name)}</h2><p class="role">${e(person.role || '')}</p><p>${e(person.detail)}</p></div></article>`;
  }).join('');
  const calendarIcon = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="2.2" y="3.2" width="11.6" height="10.6" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M2.2 6.4h11.6M5.2 2v2.6M10.8 2v2.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
  const meetSlides = people.map((person, index) => {
    const ownImage = namedImage(person) || templateMeetImage(index) || gallery[index];
    const image = ownImage || portraitImage;
    const anchor = image && anchoredMeet.has(image.libraryId) ? ' class="anchor-start"' : faceClass(image);
    const photo = image
      ? `<figure class="meet-photo"><img${anchor} src="${e(image.path)}" alt="${e(image.alt)}"></figure>`
      : `<figure class="meet-photo" role="img" aria-label="Portrait area for ${e(person.name)}"><span aria-hidden="true">${e(String(person.name).trim().charAt(0).toUpperCase())}</span></figure>`;
    const portraitNote = !ownImage && image && publishedPeople.length
      ? '<p class="flag">Illustrative portrait — not a photograph of this person</p>'
      : personFlag;
    return `<article class="meet-slide${index === 0 ? ' is-on' : ''}"${index === 0 ? '' : ' aria-hidden="true"'}>${photo}<div class="meet-card">${portraitNote}<h3>${e(person.name)}</h3><p class="meet-role">${e(person.role || '')}</p><p>${e(person.detail)}</p><a class="button meet-book" href="#contact">${calendarIcon} Make an appointment</a></div></article>`;
  }).join('');
  const hoursValue = b.hours?.value || '';
  const hoursBreak = hoursValue.indexOf('. ');
  const schedule = !s.demo && hoursBreak !== -1 ? hoursValue.slice(0, hoursBreak) : hoursValue;
  const extraHours = !s.demo && hoursBreak !== -1 ? hoursValue.slice(hoursBreak + 2) : '';
  const hoursBits = schedule.split(',').map(part => part.trim()).filter(Boolean);
  const hoursRows = hoursBits.length >= 2
    ? `<div class="hours-row"><span>${e(hoursBits.slice(0, -1).join(', '))}</span><span>${e(hoursBits[hoursBits.length - 1])}</span></div>`
    : hoursValue
      ? `<div class="hours-row"><span>${e(hoursValue)}</span></div>`
      : '<p class="pending">Hours awaiting confirmation.</p>';
  const bookCall = phoneOk
    ? `<a class="button book-call" href="tel:${phoneDigits}">Call ${e(b.phone.value)}</a>`
    : '<p class="pending">Phone awaiting confirmation.</p>';
  const bookingPhoto = bookingImage || gallery[0];
  const bookPortrait = bookingPhoto
    ? `<figure class="book-portrait"><img src="${e(bookingPhoto.path)}" alt="${e(bookingPhoto.alt)}"></figure>`
    : `<figure class="book-portrait" role="img" aria-label="Portrait area"><span aria-hidden="true">${initial}</span></figure>`;
  const reviewNotes = [
    { title: 'A sample note', body: 'This panel shows where a short client line can sit. It is not a review from a real patient.' },
    { title: 'Another sample', body: 'Choosing a name on the left swaps this note. None of these lines are verified reviews.' },
    { title: 'Layout only', body: 'The portrait and this card change together. They do not describe a real appointment.' },
    { title: 'For the layout', body: 'This card is here so the list can be clicked through. It is not a testimonial.' }
  ];
  const publishedReviews = (Array.isArray(s.reviews) ? s.reviews : []).filter(review => review && review.name && review.quote);
  const starLabel = rating => {
    const count = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    return count ? `${'★'.repeat(count)}${'☆'.repeat(5 - count)}` : '';
  };
  const reviewPortraits = reviewPortraitIds.map(id => pictures.find(image => image && image.libraryId === id)).filter(Boolean);
  const layoutReviews = !publishedReviews.length && !s.demo && wellImageSectors.has(s.sector) && reviewPortraits.length
    ? reviewPortraits.map((photo, index) => {
        const note = reviewNotes[index % reviewNotes.length];
        return {
          name: note.title,
          meta: 'Layout',
          metaLabel: '',
          flag: 'Illustrative layout — not a verified review',
          title: note.title,
          body: note.body,
          photo
        };
      })
    : null;
  const reviewItems = publishedReviews.length
    ? publishedReviews.map(review => ({
        name: review.name,
        meta: starLabel(review.rating),
        metaLabel: review.rating ? `${review.rating} stars` : '',
        flag: `Google review${review.date ? ` · ${review.date}` : ''}`,
        title: review.name,
        body: review.quote,
        photo: null
      }))
    : s.demo
      ? people.map((person, index) => {
          const note = reviewNotes[index % reviewNotes.length];
          return {
            name: person.name,
            meta: person.role || 'Client',
            metaLabel: '',
            flag: 'Illustrative layout — not a verified review',
            title: note.title,
            body: note.body,
            photo: (reviewPortraits[index]) || gallery[index] || null
          };
        })
      : (layoutReviews || []);
  const reviewPicks = reviewItems.map((item, index) => `<button class="review-pick" type="button" role="tab" aria-selected="${index === 0 ? 'true' : 'false'}"><strong>${e(item.name)}</strong><span${item.metaLabel ? ` class="stars" aria-label="${e(item.metaLabel)}"` : ''}>${e(item.meta)}</span></button>`).join('');
  const reviewPhotos = reviewItems.map((item, index) => {
    const hidden = index === 0 ? '' : ' aria-hidden="true"';
    const photo = item.photo || (index === 0 ? reviewImage : null);
    return photo
      ? `<figure class="review-photo"${hidden}><img src="${e(photo.path)}" alt="${e(photo.alt)}"></figure>`
      : `<figure class="review-photo" role="img" aria-label="Portrait area for ${e(item.name)}"${hidden}><span aria-hidden="true">${e(String(item.name).trim().charAt(0).toUpperCase())}</span></figure>`;
  }).join('');
  const reviewQuotes = reviewItems.map((item, index) => {
    const stars = item.metaLabel ? `<p class="review-stars"><span class="stars" aria-label="${e(item.metaLabel)}">${e(item.meta)}</span></p>` : '';
    return `<article class="review-quote"${index === 0 ? '' : ' aria-hidden="true"'}><p class="flag">${e(item.flag)}</p><h3>${publishedReviews.length ? e(item.title) : `“${e(item.title)}”`}</h3>${stars}<p>${e(item.body)}</p></article>`;
  }).join('');
  const reviewSelect = reviewItems.map((_, index) => {
    const n = index + 1;
    const on = `.review-board[data-active="${index}"]`;
    return `${on} .review-pick:nth-child(${n}){background:var(--pale)}${on} .review-photo:nth-child(${n}),${on} .review-quote:nth-child(${n}){opacity:1;visibility:visible;transform:none}`;
  }).join('');
  const reviewMobile = reviewItems.map((_, index) => `.review-board[data-active="${index}"] .review-quote:nth-child(${index + 1}){height:auto;overflow:visible;padding:2px 0 0;opacity:1;visibility:visible;transform:none}`).join('');
  const socialFillers = s.sector === 'dental' || s.sector === 'veterinary' ? ['A visit', 'A check-up'] : ['A visit', 'How you move'];
  const socialTopics = [
    ...(services.length ? services.map(service => service.value) : ['Care']),
    ...socialFillers
  ].slice(0, 6);
  const socialCards = socialTopics.map(topic => `<article class="post"><div class="post-art" aria-hidden="true"><span class="post-geo"></span><span class="post-geo post-geo-b"></span></div><div class="post-body"><p class="flag">Illustrative layout — not a live post</p><h3>${e(topic)}</h3><p>A sample tile for this feed. It was not posted by a real practice.</p></div></article>`).join('');
  const mapQuery = b.address?.value || b.location?.value || '';
  const map = mapQuery
    ? `<iframe class="map" title="Map of the published address" width="600" height="420" src="${e('https://maps.google.com/maps?q=' + encodeURIComponent(mapQuery) + '&hl=en&z=15&output=embed')}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    : '<p class="pending">Address awaiting confirmation, so no map is shown.</p>';
  const parkingNote = s.demo
    ? 'Parking on site is available. No extra directions are listed.'
    : (typeof b.parking?.value === 'string' ? b.parking.value.trim() : '');
  const parkingCard = parkingNote && parkingNote.split(/\s+/).filter(Boolean).length <= 15
    ? `<article class="info-card"><h2>Parking</h2><p>${e(parkingNote)}</p></article>`
    : '';
  const info = [
    phoneOk ? `<article class="info-card"><h2>Phone</h2><p><a href="tel:${phoneDigits}">${e(b.phone.value)}</a></p></article>` : '',
    b.address ? `<article class="info-card"><h2>Address</h2><p>${e(b.address.value)}</p></article>` : '',
    b.hours ? `<article class="info-card"><h2>Hours</h2><p>${e(b.hours.value)}</p></article>` : '',
    parkingCard,
    website ? `<article class="info-card"><h2>Website</h2><p>${website}</p></article>` : ''
  ].join('');
  const banner = s.demo ? 'FICTIONAL DEMO' : 'CONCEPT WEBSITE';
  const mapNote = s.demo
    ? 'Map of the fictional address. It may not match a real place.'
    : 'Map of the published address.';
  const servicesNote = s.demo
    ? 'Fictional services, shown so this layout can be reviewed.'
    : 'Names taken from the official website. No extra treatments, prices or results have been added.';
  const hoursNote = s.demo
    ? 'Hours listed for this concept. No extra days have been added.'
    : extraHours || 'Hours published by the clinic. No extra days have been added.';
  const aboutSummary = s.demo
    ? `${name} is a sample practice${location ? ` in ${location}` : ''}. This is a short layout summary, not a description of a real clinic.`
    : e(s.copy?.introduction || '');
  const aboutImage = pictures.find(image => image && image.libraryId === 'care-about-exterior');
  const aboutPhoto = aboutImage
    ? `<figure class="about-photo"><img src="${e(aboutImage.path)}" alt="${e(aboutImage.alt)}"></figure>`
    : '';
  const contactMedia = aboutImage
    ? `<figure class="side-media"><img src="${e(aboutImage.path)}" alt="${e(aboutImage.alt)}"></figure>`
    : sideMedia;
  const demoStats = `<div class="stat-board" data-stat="patients">
<div class="rails">
<button class="rail rail-patients" type="button" data-stat="patients"><span>2000+ happy patients</span></button>
<button class="rail rail-reviews" type="button" data-stat="reviews"><span>480 five-star reviews</span></button>
<button class="rail rail-years" type="button" data-stat="years"><span>15+ years of experience</span></button>
</div>
<div class="stat-stage">
<span class="geo" aria-hidden="true"></span>
<div class="stat-show show-patients">
<p class="flag">Illustrative figure — not a verified result</p>
<p class="stat-num">2000+</p>
<p>Happy patients, shown so this layout can be reviewed.</p>
</div>
<div class="stat-show show-reviews">
<p class="flag">Illustrative figure — not a verified result</p>
<p class="stat-num">480</p>
<p>Five-star reviews, shown so this layout can be reviewed.</p>
</div>
<div class="stat-show show-years">
<p class="flag">Illustrative figure — not a verified result</p>
<p class="stat-num">15+</p>
<p>Years of experience, shown so this layout can be reviewed.</p>
</div>
</div>
</div>`;
  const socialBand = `<section class="section social">
<div class="wrap social-head">
<div>
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="5" cy="8" r="2.2" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="11" cy="4.5" r="1.7" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="11" cy="11.5" r="1.7" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M7 7.2 9.4 5.4M7.1 8.8l2.2 1.8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg> Social</p>
<h2>Recent posts</h2>
<p class="social-lede">A looping row of sample posts. Nothing here is from a live account.</p>
</div>
<button class="social-pause" type="button" aria-pressed="false">Pause</button>
</div>
<div class="social-marquee">
<div class="social-track">
<div class="social-set">${socialCards}</div>
<div class="social-set" aria-hidden="true">${socialCards}</div>
</div>
</div>
</section>`;
  const reviewNav = `<div class="review-nav"><button class="meet-arrow review-prev" type="button" aria-label="Previous review"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3.2 5.2 8 10 12.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="meet-arrow review-next" type="button" aria-label="Next review"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3.2 10.8 8 6 12.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>`;
  const reviewBoard = reviewItems.length
    ? `<div class="review-board" data-active="0"><div class="review-list" role="tablist" aria-label="${publishedReviews.length ? 'Google reviews' : 'Sample clients'}">${reviewPicks}</div><div class="review-photos">${reviewPhotos}</div><div class="review-quotes">${reviewQuotes}</div>${reviewNav}</div>`
    : '<p class="pending">Google reviews for this clinic are still being checked.</p>';
  const reviewMark = `<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="2.1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 1.4v1.7M8 12.9v1.7M1.4 8h1.7M12.9 8h1.7M3.3 3.3l1.2 1.2M11.5 11.5l1.2 1.2M12.7 3.3l-1.2 1.2M4.5 11.5l-1.2 1.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`;
  const reviewQuery = [b.name?.value, b.address?.value || b.location?.value].filter(Boolean).join(' ');
  const reviewHref = e('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(reviewQuery));
  const reviewBand = `<section class="section reviews">
<div class="wrap">
<p class="meet-kicker">${reviewMark} Testimonials</p>
<h2>Patient reviews</h2>
<a class="button review-leave-link" href="#reviews">Leave a Google review</a>
${reviewBoard}
</div>
</section>`;
  const pricePacks = {
    dental: [
      { title: 'New patient visit', fee: '£75', includes: ['A consultation and a look at the teeth and gums', 'A discussion of what was found'], time: 'Duration: 45 minutes.' },
      { title: 'Treatment visit', fee: '£55', includes: ['The care agreed for that visit', 'Advice on looking after the area afterwards'], time: 'Duration: 30 minutes.' }
    ],
    veterinary: [
      { title: 'First appointment', fee: '£70', includes: ['A consultation', 'An examination and a discussion of what was found'], time: 'Duration: 45 minutes.' },
      { title: 'Treatment', fee: '£40', includes: ['The care agreed for that visit', 'A note of what to watch for afterwards'], time: 'Duration: 20 minutes, or up to 40 minutes, depending on the treatment.' }
    ]
  };
  const carePacks = [
    { title: 'First appointment', fee: '£90', includes: ['A consultation with a chiropractor registered with the General Chiropractic Council', 'An examination, covering a health check and postural, functional, neurological and orthopaedic assessments', 'A discussion of the examination findings'], time: 'Duration: 60 minutes.' },
    { title: 'Treatment', fee: '£45', includes: ['Physical and manual therapy chosen for the problem', 'A rehabilitation exercise programme'], time: 'Duration: 15 minutes, or up to 30 minutes, depending on the treatment.' }
  ];
  const packs = pricePacks[s.sector] || carePacks;
  const sampleFees = ['£60', '£45', '£70', '£55', '£40', '£80', '£50'];
  const feeNote = service => {
    const blurb = serviceBlurbs[service.value];
    if (!blurb) return `${service.value} is listed for this practice. This note does not describe a method or a result.`;
    const sentence = blurb.match(/^.*?[.!?](?:\s|$)/);
    return sentence ? sentence[0].trim() : blurb;
  };
  const feeItems = listed.map((service, index) => ({ name: service.value, fee: sampleFees[index % sampleFees.length], note: feeNote(service) }));
  const publishedVisits = (!s.demo && Array.isArray(s.fees?.visits) ? s.fees.visits : [])
    .filter(visit => visit && visit.title && visit.fee)
    .slice(0, 2)
    .map(visit => ({
      title: String(visit.title),
      fee: String(visit.fee),
      includes: Array.isArray(visit.includes) ? visit.includes.map(item => String(item)).filter(Boolean).slice(0, 6) : [],
      time: visit.time ? String(visit.time) : ''
    }));
  const visits = s.demo ? packs : publishedVisits;
  const serviceFeeRows = s.demo
    ? feeItems
    : (Array.isArray(s.fees?.services) ? s.fees.services : []).filter(item => item && item.name && item.fee).map(item => ({
        name: String(item.name),
        fee: String(item.fee),
        note: item.note ? String(item.note) : ''
      }));
  const feeIncludes = items => `<ul class="fee-includes">${items.map(item => `<li>${e(item)}</li>`).join('')}</ul>`;
  const feeFolds = serviceFeeRows.map(item => `<details class="fee-fold" name="listed-fees"><summary><span>${e(item.name)}</span><strong>${e(item.fee)}</strong></summary>${item.note ? `<p>${e(item.note)}</p>` : ''}</details>`).join('');
  const posterCards = visits.map(pack => {
    const includes = pack.includes?.length ? `<p class="fee-k">Includes</p>${feeIncludes(pack.includes)}` : '';
    const time = pack.time ? `<p class="fee-time">${e(pack.time)}</p>` : '';
    return `<article class="fee-card"><span class="fee-gem"><strong>${e(pack.fee)}</strong></span><span class="fee-gem fee-gem-sm" aria-hidden="true"></span><h2>${e(pack.title)}</h2>${includes}${time}<a class="button solid fee-book" href="#contact">Book Now</a></article>`;
  }).join('');
  const pricesFlag = s.demo ? 'Illustrative layout — not a published fee' : 'From the published website';
  const pricesLede = s.demo
    ? `These figures are examples, so the layout can be reviewed. They are not the fees for ${name}.`
    : `Fees taken from the published website for ${name}. No amounts have been added.`;
  const feeBoard = feeFolds ? `<div class="fee-board"><h2>Service fees</h2><div class="fee-accordion">${feeFolds}</div></div>` : '';
  const pricesPage = visits.length || feeFolds ? `<section id="prices" class="page prices-page">
<div class="wrap">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8.4 2.4h4.4v4.4L7.4 12.2 3.2 8 8.4 2.4z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="10.8" cy="4.8" r=".7" fill="currentColor"/></svg> Prices</p>
<h1>What a visit includes.</h1>
<p class="flag">${pricesFlag}</p>
<p class="lede">${pricesLede}</p>
${posterCards ? `<div class="fee-pair">${posterCards}</div>` : ''}
${feeBoard}
</div>
</section>` : '';
  const reviewsPage = `<section id="reviews" class="page">
<div class="wrap page-intro">
<div>
<p class="meet-kicker">${reviewMark} Reviews</p>
<h1>Leave a Google review. Please...</h1>
</div>
<a class="button solid" href="${reviewHref}" target="_blank" rel="noopener noreferrer">Leave a review</a>
</div>
<section class="section reviews">
<div class="wrap">
<p class="meet-kicker">${reviewMark} Testimonials</p>
${reviewBoard}
</div>
</section>
</section>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<meta name="generator" content="parley-website-factory care-modern 1.0.0">
<title>${name} — concept by Parley</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{color-scheme:light;--accent:${accent};--on:${onAccent};--pale:${pale}}
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:88px}
body{margin:0;background:#fff;color:#333;font:16px/1.5 Manrope,"Segoe UI",sans-serif}
h1,h2,h3,p{margin:0;overflow-wrap:break-word}
h1,h2,h3{color:#000;font-weight:500;letter-spacing:-.03em}
h1{font-size:clamp(40px,5vw,68px);line-height:1.05;max-width:11em}
h2{font-size:clamp(32px,4vw,44px);font-weight:400;line-height:1.3}
h3{font-size:20px;line-height:1.2}
a{color:inherit}
img{max-width:100%;display:block}
.skip{position:absolute;left:12px;top:-48px;background:#fff;padding:8px 12px;z-index:9}
.skip:focus{top:12px}
.banner{margin:0;padding:8px 16px;background:#111;color:#fff;text-align:center;font-size:11px;font-weight:500;letter-spacing:.08em}
.nav-toggle{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.site-header{position:sticky;top:0;z-index:8;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:24px;min-height:84px;padding:0 28px;border-bottom:1px solid #e6e6e6;background:#fff}
.site-header nav{justify-self:center}
.header-cta{justify-self:end}
.nav-left{display:flex;align-items:center;gap:18px;min-width:0}
.brand{display:flex;align-items:center;min-height:44px;color:#000;text-decoration:none}
.logo{max-width:180px;max-height:42px;object-fit:contain}
.wordmark{display:flex;align-items:center;gap:10px}
.wordmark strong{display:block;font-size:16px;font-weight:600;letter-spacing:-.02em}
.wordmark small{display:block;color:#333;font-size:12px;font-weight:500}
.mark{display:grid;place-items:center;width:36px;height:36px;border-radius:8px;background:var(--accent);color:var(--on);font-weight:700}
.nav-rule{width:1px;height:16px;background:#ddd}
.nav-phone{color:#000;font-size:14px;font-weight:500;text-decoration:none;white-space:nowrap}
.site-header nav ul{display:flex;align-items:center;gap:8px;margin:0;padding:0;list-style:none}
.site-header nav a{display:inline-flex;align-items:center;min-height:44px;padding:0 12px;color:#000;font-size:16px;font-weight:500;text-decoration:none}
.site-header nav a[href="#home"],
body:has(#services:target) .site-header nav a[href="#services"],
body:has(#about:target) .site-header nav a[href="#about"],
body:has(#reviews:target) .site-header nav a[href="#reviews"],
body:has(#contact:target) .site-header nav a[href="#contact"],
body:has(#prices:target) .site-header nav a[href="#prices"]${serviceNavOn}{font-weight:700}
body:has(#services:target) .site-header nav a[href="#home"],
body:has(#about:target) .site-header nav a[href="#home"],
body:has(#reviews:target) .site-header nav a[href="#home"],
body:has(#contact:target) .site-header nav a[href="#home"],
body:has(#prices:target) .site-header nav a[href="#home"]${serviceHomeOff}{font-weight:500}
.has-menu{position:relative}
.nav-chevron{display:block;transition:transform .2s ease}
.has-menu:hover .nav-chevron,.has-menu:focus-within .nav-chevron{transform:rotate(180deg)}
.menu-panel{position:absolute;top:100%;left:50%;z-index:9;display:grid;min-width:230px;padding:8px;border-radius:16px;background:#fff;box-shadow:0 18px 50px rgba(17,17,17,.12);transform:translateX(-50%);opacity:0;visibility:hidden;pointer-events:none}
.menu-panel::before{content:"";position:absolute;left:0;right:0;top:-12px;height:12px}
.has-menu:hover .menu-panel,.has-menu:focus-within .menu-panel{opacity:1;visibility:visible;pointer-events:auto}
.site-header .menu-panel a{justify-content:flex-start;min-height:40px;padding:8px 16px;border-radius:10px;font-size:15px;font-weight:500;white-space:nowrap}
.site-header .menu-panel a:hover{background:#f3f4f6}
${menuCurrent}
.button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:12px 22px;border:0;border-radius:25px;background:var(--pale);color:#000;font:500 14px/1 Manrope,"Segoe UI",sans-serif;text-decoration:none;transition:background .2s ease,color .2s ease}
.button.solid,.header-cta{background:#111;color:#fff}
.button:hover,.header-cta:hover{background:var(--accent);color:var(--on)}
.site-header nav .button{display:none}
.menu-button{display:none;align-items:center;min-height:44px;padding:0 14px;border:1px solid #e6e6e6;border-radius:25px;background:#fff;cursor:pointer}
.menu-button .close{display:none}
.nav-toggle:checked ~ .site-header .menu-button .open{display:none}
.nav-toggle:checked ~ .site-header .menu-button .close{display:inline}
.wrap{width:min(1180px,calc(100% - 80px));margin:auto}
.page{display:none;padding:8px 0 80px}
.page:target{display:block}
body:not(:has(.page:target)) #home{display:block}
body:has(#meet-team:target) #about{display:block}
body:has(#meet-team:target) #home{display:none}
#home{padding-top:0;padding-bottom:0}
.landing{display:block}
.landing>.hero-head{margin-top:0;margin-bottom:0}
.landing>.hero-stage{margin-top:32px;margin-bottom:0}
.hero-head{display:grid;grid-template-columns:minmax(0,680px) minmax(260px,380px);justify-content:space-between;align-items:center;column-gap:56px;row-gap:20px;padding-top:48px}
.hero-head h1{grid-column:1;grid-row:1;width:auto;max-width:none}
.hero-aside{display:contents}
.hero-aside .lede{grid-column:2;grid-row:1;margin:0}
.hero-aside .button{grid-column:2;grid-row:2;justify-self:start}
.lede{margin:0 0 28px;color:#333;font-size:16px;line-height:1.55}
.hero-stage{position:relative;margin-top:32px}
.hero-media,.wide-media,.side-media,.tile-media,.frame{margin:0;position:relative;overflow:hidden;border-radius:10px;background:var(--pale)}
.hero-media{height:400px;border-radius:28px}
.wide-media{min-height:420px;margin:28px 0}
.side-media{min-height:460px}
.tile-media{min-height:220px;border-radius:10px 10px 0 0}
.hero-media img,.wide-media img,.side-media img,.tile-media img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0}
.hero-media img{object-position:center 62%;transform:none}
.hero-media img.anchor-top-right{object-fit:cover;object-position:right bottom;top:auto;right:0;left:auto;bottom:0;width:800px;height:calc(800px * 2 / 3)}
.hero-media::after{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(90deg,var(--pale) 0%,var(--pale) 32%,color-mix(in srgb,var(--pale) 82%,transparent) 38%,color-mix(in srgb,var(--pale) 38%,transparent) 44%,color-mix(in srgb,var(--pale) 0%,transparent) 50%)}
.hero-cards{position:absolute;left:24px;right:auto;top:0;bottom:0;z-index:1;display:grid;grid-template-columns:minmax(0,1fr);align-content:space-evenly;gap:0;width:calc((100% - 48px - 28px) / 3)}
.hero-card:nth-child(3){grid-column:auto;grid-row:auto}
.hero-card{display:flex;color:#000;text-decoration:none}
.hero-face{display:flex;gap:14px;align-items:center;width:100%;height:96px;padding:12px 18px;border-radius:16px;background:rgba(255,255,255,.68);box-shadow:0 16px 40px rgba(17,17,17,.1);backdrop-filter:blur(10px)}
.hero-copy{min-width:0;flex:1}
.hero-card strong{display:-webkit-box;margin:0 0 4px;overflow:hidden;font-size:18px;font-weight:600;line-height:1.2;-webkit-box-orient:vertical;-webkit-line-clamp:2}
.hero-card em{color:#555;font-size:13px;font-style:normal;font-weight:400;line-height:1.4}
.hero-go{display:grid;place-items:center;flex:none;width:44px;height:44px;border-radius:50%;background:#111;color:#fff;transition:background .2s ease,color .2s ease,transform .2s ease}
.hero-go svg{display:block}
.hero-card:hover .hero-go{background:var(--accent);color:var(--on);transform:translateX(4px)}
.mini{flex:0 0 3px;width:3px;align-self:stretch;border-radius:999px;background:var(--accent)}
.section{padding:120px 0}
#home>.section{padding:88px 0}
.service-split{display:flex;align-items:center;gap:56px}
.service-side{display:flex;flex-direction:column;width:min(36%,400px);min-width:220px}
.service-side h2{margin:8px 0 16px}
.service-links{display:flex;flex-direction:column;margin-top:20px}
.service-links button{display:block;width:100%;margin:0;padding:14px 0;border:0;border-bottom:1px solid rgba(0,0,0,.1);background:none;color:#000;font:inherit;font-size:18px;line-height:1.35;font-weight:500;text-align:left;cursor:pointer;transition:color .2s ease,padding-left .2s ease}
.service-links button:hover{padding-left:8px;color:var(--accent)}
.service-links button:last-child{margin-bottom:0}
.service-accordion{display:none}
.shots{position:relative;flex:1;min-width:0;min-height:480px}
.shots .shot{position:absolute;inset:0;overflow:hidden;border-radius:24px;background:var(--pale);opacity:0;visibility:hidden}
.shots .shot:first-child{opacity:1;visibility:visible}
.shot .tile-media,.accordion-panel .tile-media{position:absolute;inset:0;min-height:0;border-radius:0}
.shot-copy{position:absolute;left:24px;right:24px;bottom:24px;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:18px;margin:0;padding:22px 24px;border-radius:10px;background:#fff}
.shot-copy span{min-width:0}
.shot-copy .button{flex:none}
.shot-copy strong{display:block;margin:0 0 6px;font-size:20px;font-weight:500;line-height:1.2}
.shot-copy em{color:#333;font-size:14px;font-style:normal;font-weight:400;line-height:1.5}
${serviceHover}
.statement{padding:88px 0}
.statement h2{max-width:12em;font-size:clamp(40px,4.8vw,64px);font-weight:500;line-height:1.02}
.statement>.about-book{margin-top:36px}
.vision{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(260px,.85fr);gap:40px 64px;align-items:center}
.vision-side{display:flex;align-items:center;gap:28px}
.vision-side p{max-width:36em;color:#333}
.about-link{display:inline-flex;align-items:center;gap:14px;flex:none;color:#000;font-size:16px;font-weight:500;text-decoration:none}
.about-orb{display:grid;place-items:center;width:54px;height:54px;border-radius:50%;background:#fff;color:#111;transition:transform .2s ease,background .2s ease,color .2s ease}
.about-link:hover .about-orb{transform:translateX(6px);background:#111;color:#fff}
.about-book{padding:6px 6px 6px 22px;border-radius:999px;background:#111;color:#fff}
.about-book .about-orb{background:#fff;color:#111}
.about-book:hover .about-orb{transform:none;background:var(--accent);color:var(--on)}
.stat-board{display:grid;grid-template-columns:auto minmax(0,1fr);gap:36px;align-items:end;min-height:340px;margin-top:54px}
.rails{display:flex;align-items:flex-end;height:340px}
.rail{position:relative;display:flex;align-items:center;justify-content:center;width:76px;height:210px;margin:0;padding:28px 0;border:0;background:transparent;color:#000;font:inherit;cursor:pointer}
.rail-reviews{height:270px}
.rail-years{height:340px}
.rail:focus-visible{outline:3px solid #000;outline-offset:-3px}
.rail span{writing-mode:vertical-rl;transform:rotate(180deg);white-space:nowrap;font-size:15px;font-weight:500;letter-spacing:.01em}
.rail-patients{background:#f3ead2}
.rail-reviews{background:#111;color:#fff}
.rail-years{background:var(--pale)}
.stat-stage{position:relative;display:grid;min-height:320px;padding:28px 24px 12px 28px;overflow:hidden}
.geo{position:absolute;right:4%;top:42px;width:168px;height:168px;border-radius:42px;background:#f3ead2;transform:rotate(16deg);transition:transform .35s ease,background .35s ease}
.stat-board[data-stat="reviews"] .geo{background:#111;transform:rotate(42deg)}
.stat-board[data-stat="years"] .geo{background:var(--pale);transform:rotate(-14deg)}
.stat-show{display:block;grid-area:1/1;position:relative;z-index:1;padding-top:18px;visibility:hidden}
.stat-board[data-stat="patients"] .show-patients,
.stat-board[data-stat="reviews"] .show-reviews,
.stat-board[data-stat="years"] .show-years{visibility:visible}
.stat-show .stat-num{max-width:none;font-size:clamp(84px,11vw,132px);font-weight:500;letter-spacing:-.05em;line-height:.86;white-space:nowrap}
.stat-show p{margin-top:22px;max-width:22em;color:#333}
.band{background:var(--pale)}
.meet-head{display:flex;align-items:center;justify-content:space-between;gap:24px}
.meet-kicker{display:flex;align-items:center;gap:8px;margin:0 0 8px;color:#000;font-size:14px;font-weight:500}
.meet-kicker svg{display:block}
.meet h2{font-size:clamp(32px,3.2vw,42px);font-weight:600;line-height:1.15}
.meet-nav{display:flex;gap:10px;flex:none}
.meet-arrow{display:grid;place-items:center;width:42px;height:42px;padding:0;border:1px solid rgba(0,0,0,.16);border-radius:50%;background:#fff;color:#000;cursor:pointer;transition:background .2s ease,border-color .2s ease,transform .2s ease}
.meet-arrow:hover{background:var(--pale);border-color:transparent}
.meet-arrow:active{transform:scale(.96)}
.meet-stage{display:grid;margin-top:28px}
.meet-slide{grid-area:1/1;display:grid;grid-template-columns:minmax(0,1.28fr) minmax(280px,.72fr);gap:18px;align-items:stretch;opacity:0;visibility:hidden;pointer-events:none}
.meet-slide.is-on{opacity:1;visibility:visible;pointer-events:auto;z-index:1}
.meet.is-animated .meet-slide.play-in-next{animation:meet-in-next .5s ease both}
.meet.is-animated .meet-slide.play-out-next{visibility:visible;animation:meet-out-next .5s ease both}
.meet.is-animated .meet-slide.play-in-prev{animation:meet-in-prev .5s ease both}
.meet.is-animated .meet-slide.play-out-prev{visibility:visible;animation:meet-out-prev .5s ease both}
@keyframes meet-in-next{from{opacity:0;transform:translateX(56px)}to{opacity:1;transform:none}}
@keyframes meet-out-next{from{opacity:1;transform:none}to{opacity:0;transform:translateX(-56px)}}
@keyframes meet-in-prev{from{opacity:0;transform:translateX(-56px)}to{opacity:1;transform:none}}
@keyframes meet-out-prev{from{opacity:1;transform:none}to{opacity:0;transform:translateX(56px)}}
.meet-photo{position:relative;display:grid;place-items:center;min-height:460px;margin:0;border-radius:18px;overflow:hidden;background:#c9daf8}
.meet-slide:nth-child(2) .meet-photo{background:#b7cef6}
.meet-slide:nth-child(3) .meet-photo{background:#dbe7fb}
.meet-photo span{color:rgba(17,24,39,.28);font-size:128px;font-weight:500;letter-spacing:-.05em;line-height:1}
.meet-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.meet-photo img.anchor-start{object-position:left top}
.meet-photo img.anchor-face,.thumb img.anchor-face{object-position:center top}
.meet-card{display:flex;flex-direction:column;min-height:460px;padding:36px 32px 28px;border-radius:18px;background:#fff}
.meet-card h3{font-size:28px;font-weight:600;letter-spacing:-.03em}
.meet-role{margin:6px 0 28px;color:#666;font-size:16px}
.meet-card .flag{margin-bottom:14px}
.meet-book{width:100%;margin-top:auto;min-height:52px;gap:8px;border-radius:12px}
.split,.appoint{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(280px,.95fr);gap:40px;align-items:center}
#contact .split{margin-bottom:36px}
.example small,.flag{display:block;margin-bottom:8px;color:#333;font-size:12px;font-weight:600}
.example{margin-bottom:22px}
.example h2{font-size:28px;margin-bottom:8px}
.kicker{margin-bottom:10px;color:#000;font-size:14px;font-weight:500}
.home-team{display:grid;gap:8px;margin:28px 0}
.book{background:var(--pale)}
.book-layout{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(300px,.92fr);gap:28px 36px;align-items:stretch}
.book h2{font-size:clamp(32px,3.4vw,44px);font-weight:600;line-height:1.15}
.book-note{margin:10px 0 0;max-width:36em;color:#333;font-size:14px}
.book-fields{display:grid;grid-template-columns:1fr 1fr;gap:18px 20px;margin-top:28px}
.book-fields .span{grid-column:1 / -1}
.book-form label{display:grid;gap:8px;color:#000;font-size:14px;font-weight:600}
.book-form input,.book-form textarea{width:100%;min-height:48px;padding:12px 14px;border:0;border-radius:8px;background:#fff;color:#000;font:inherit}
.book-form textarea{min-height:148px;resize:vertical}
.book-form input::placeholder,.book-form textarea::placeholder{color:#9aa0a6}
.book-date .date-field{position:relative;display:block}
.book-date svg{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:#666;pointer-events:none}
.book-date input{padding-right:42px}
.book-actions{display:flex;justify-content:flex-end;margin-top:22px}
.book-submit{min-height:48px;padding:12px 22px;border:0;border-radius:8px;background:#111;color:#fff;font:500 15px/1 Manrope,"Segoe UI",sans-serif;cursor:pointer}
.book-stage{position:relative;min-height:520px}
.book-portrait{position:absolute;inset:0 16% 0 0;display:grid;place-items:center;margin:0;border-radius:28px 28px 0 0;overflow:hidden;background:transparent;transform-origin:center bottom;transform:translate(-36px,88px) scale(1.08)}
.book-portrait span{color:rgba(17,24,39,.28);font-size:160px;font-weight:500;letter-spacing:-.05em;line-height:1}
.book-portrait img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:center bottom}
.book-hours{position:absolute;top:50%;right:0;z-index:1;width:min(290px,72%);padding:28px 24px 22px;border-radius:16px;background:#fff;transform:translateY(-50%)}
.book-hours h3{margin-bottom:8px;font-size:22px;font-weight:600}
.book-hours p{margin-bottom:16px;color:#333;font-size:14px;line-height:1.45}
.book-hours .hours-live{display:none;align-items:center;gap:8px;margin:0 0 16px;color:#000;font-size:15px;font-weight:600;line-height:1.2}
.book-hours .hours-live.is-set{display:flex}
.hours-light{flex:none;width:9px;height:9px;border-radius:50%;background:#d1242f;box-shadow:0 0 0 4px rgba(209,36,47,.16);animation:hours-pulse 1.6s ease-in-out infinite}
.hours-live.is-open .hours-light{background:#1b8f3a;box-shadow:0 0 0 4px rgba(27,143,58,.18)}
.sheet .hours-live{display:none;align-items:center;gap:8px;margin:0;color:#000;font-size:15px;font-weight:600;line-height:1.2}
.sheet .hours-live.is-set{display:flex}
.hours-live-tag{margin-left:auto;color:#666;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
@keyframes hours-pulse{0%,100%{opacity:1}50%{opacity:.35}}
@media (prefers-reduced-motion:reduce){.hours-light{animation:none}}
.hours-row{display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-top:1px solid #eee;color:#000;font-size:14px;font-weight:500}
.hours-row span:last-child{color:#333;font-weight:500;white-space:nowrap}
.book-call{width:100%;margin-top:16px;min-height:48px;border-radius:10px}
.reviews{background:#f6f7f8}
.review-leave-link{margin-top:18px}
#reviews{padding-top:56px;padding-bottom:88px;background:#f6f7f8}
#reviews .page-intro{display:flex;align-items:flex-end;justify-content:space-between;gap:24px 40px}
#reviews .page-intro h1{margin:0}
#reviews .page-intro .button{flex:none;margin-bottom:8px}
#reviews > .section.reviews{padding-top:36px;padding-bottom:0;background:transparent}
.reviews h2{font-size:clamp(32px,3.4vw,44px);font-weight:600;line-height:1.15}
.review-board{display:grid;grid-template-columns:minmax(220px,.78fr) minmax(0,1.05fr) minmax(240px,.9fr);gap:16px;align-items:stretch;margin-top:28px}
.review-list{display:flex;flex-direction:column;gap:12px}
.review-pick{display:block;width:100%;margin:0;padding:18px 18px;border:0;border-radius:14px;background:#fff;color:#000;font:inherit;text-align:left;cursor:pointer;transition:background .25s ease}
.review-pick:hover{background:#f3f4f6}
.review-pick strong{display:block;font-size:16px;font-weight:600;line-height:1.35}
.review-pick span{display:block;margin-top:4px;color:#666;font-size:14px;font-weight:500}
.review-pick .stars{color:#111;letter-spacing:.12em}
.review-photos,.review-quotes{position:relative;min-height:440px}
.review-photo,.review-quote{position:absolute;inset:0;opacity:0;visibility:hidden;transform:translateY(12px);transition:opacity .35s ease,transform .35s ease,visibility .35s}
.review-photo{display:grid;place-items:center;margin:0;border-radius:16px;overflow:hidden;background:#e7e7ea}
.review-photo:nth-child(2){background:#d5dde8}
.review-photo:nth-child(3){background:#e4e0d8}
.review-photo:nth-child(4){background:#d9e3dc}
.review-photo span{color:rgba(17,24,39,.28);font-size:120px;font-weight:500;letter-spacing:-.04em;line-height:1}
.review-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 30%}
.review-quote{padding:36px 32px;border-radius:16px;background:#fff}
.review-quote h3{margin:0 0 22px;font-size:22px;font-weight:500}
.review-quote p{color:#333;font-size:16px;line-height:1.55}
.review-quote .flag{margin-bottom:16px}
.review-stars,.review-nav{display:none}
${reviewSelect}
.social h2{font-size:clamp(32px,3.4vw,44px);font-weight:600;line-height:1.15}
.social-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
.social-lede{max-width:34em;margin:12px 0 0;color:#333}
.social-pause{flex:none;min-height:44px;padding:0 18px;border:1px solid rgba(0,0,0,.16);border-radius:999px;background:#fff;color:#000;font:500 14px/1 Manrope,"Segoe UI",sans-serif;cursor:pointer;transition:background .2s ease,border-color .2s ease}
.social-pause:hover{background:var(--pale);border-color:transparent}
.social-marquee{margin-top:40px;overflow:hidden}
.social-track{display:flex;width:max-content;animation:social-loop 46s linear infinite}
.social-set{display:flex;gap:18px;align-items:flex-start;padding-right:18px}
.post{flex:none;width:270px;overflow:hidden;border-radius:22px;background:#fff}
.post:nth-child(odd){margin-top:28px}
.post-art{position:relative;height:168px;overflow:hidden;background:#f3ead2}
.post:nth-child(3n+2) .post-art{background:#111}
.post:nth-child(3n) .post-art{background:var(--pale)}
.post-geo{position:absolute;top:28px;right:24px;width:108px;height:108px;border-radius:34px;background:#111;transform:rotate(16deg)}
.post:nth-child(3n+2) .post-geo{border-radius:50%;background:#f3ead2;transform:none}
.post:nth-child(3n) .post-geo{background:#fff;transform:rotate(-18deg)}
.post-geo-b{top:auto;right:auto;bottom:16px;left:20px;width:58px;height:58px;border-radius:16px;background:#fff;transform:rotate(-14deg)}
.post:nth-child(3n+2) .post-geo-b{border-radius:50%;background:var(--pale)}
.post:nth-child(3n) .post-geo-b{border-radius:8px;background:#111;transform:rotate(22deg)}
.post-body{padding:16px 18px 20px}
.post h3{margin:0 0 8px;font-size:20px;font-weight:600}
.post-body p:last-child{color:#333;font-size:14px;line-height:1.45}
@keyframes social-loop{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.social-marquee:hover .social-track,.social.is-paused .social-track{animation-play-state:paused}
.team-page{padding-top:56px}
.about-summary{display:grid;grid-template-columns:minmax(0,1fr) minmax(180px,240px);grid-template-areas:"copy photo" "copy team";column-gap:48px;row-gap:18px;align-items:start}
.about-copy{grid-area:copy}
.about-copy h1{margin:0 0 18px}
.about-summary .lede{margin:0 0 22px}
.about-next{display:inline-flex;align-items:center;gap:8px;margin:0;padding:0;background:none;color:#111;font:600 16px/1.4 Manrope,"Segoe UI",sans-serif;text-decoration:none}
.about-next span{text-decoration:underline;text-underline-offset:4px}
.about-next svg{flex:none}
.about-next:hover{color:#111}
#meet-team{scroll-margin-top:96px}
.about-photo{grid-area:photo;margin:0;width:100%;height:168px;border-radius:18px;overflow:hidden;background:var(--pale)}
.about-photo img{width:100%;height:100%;object-fit:cover;object-position:center}
.about-team{grid-area:team;margin:0}
.about-summary:not(:has(.about-photo)){grid-template-columns:minmax(0,1fr);grid-template-areas:"copy" "team"}
.team-board{position:relative;display:grid;grid-template-columns:92px minmax(0,1fr);gap:8px 28px;align-items:start;margin-top:48px}
.team-rail{position:sticky;top:120px;height:min(520px,calc(100vh - 180px))}
.team-rail,.team-fall{pointer-events:none}
.team-fall{position:absolute;left:0;top:0;width:56px;height:56px;border-radius:18px;background:#111;transform:translateY(12px) rotate(-14deg);transition:transform .55s cubic-bezier(.22,.8,.28,1),background .35s ease,border-radius .35s ease,opacity .2s ease}
.team-board[data-person="1"] .team-fall{border-radius:50%;background:var(--pale)}
.team-board[data-person="2"] .team-fall{border-radius:16px;background:#f3ead2}
.team-board[data-person="3"] .team-fall{border-radius:50% 18px;background:#111}
.people{display:grid;gap:22px}
.person{display:grid;grid-template-columns:minmax(180px,.42fr) minmax(0,1.58fr);gap:18px;align-items:stretch}
.thumb{position:relative;display:grid;place-items:center;min-height:300px;margin:0;border-radius:22px;overflow:hidden;background:#c9daf8}
.person:nth-child(2) .thumb{background:#b7cef6}
.person:nth-child(3) .thumb{background:#dbe7fb}
.person:nth-child(4) .thumb{background:#e7e0cf}
.thumb span{color:rgba(17,24,39,.28);font-size:88px;font-weight:500;letter-spacing:-.05em;line-height:1}
.thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.person-card{display:flex;flex-direction:column;justify-content:center;min-height:300px;padding:40px 44px;border-radius:22px;background:#f6f7f8;transition:background .35s ease}
.person.is-current .person-card{background:var(--pale)}
.person-card h2{font-size:clamp(32px,3vw,44px);font-weight:600;line-height:1.1}
.person-card .role{margin:8px 0 16px;color:#333;font-size:16px;font-weight:500;letter-spacing:0;text-transform:none}
.person-card p:last-child{max-width:36em;color:#333}
.role{margin:4px 0 8px;color:#000;font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase}
#contact{padding-top:56px}
#contact .page-intro h1{max-width:none;text-align:left}
#contact .info-card{text-align:center}
.service-block{margin-top:28px}
.service-close{margin-top:36px}
.services-page{padding-top:56px}
.prices-page{padding-top:56px}
.fee-pair{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.fee-card{position:relative;display:flex;flex-direction:column;min-height:420px;padding:36px 32px 112px;overflow:hidden;border-radius:28px;background:var(--pale)}
.fee-gem{position:absolute;right:8%;top:16%;display:grid;place-items:center;width:132px;height:132px;border-radius:40px;background:#fff;color:#111;transform:rotate(-16deg)}
.fee-gem strong{transform:rotate(16deg);font-size:26px;font-weight:600;letter-spacing:-.03em}
.fee-gem-sm{right:auto;left:28px;top:auto;bottom:26px;width:48px;height:48px;border-radius:16px;background:#fff;transform:rotate(14deg)}
.fee-card h2{position:relative;z-index:1;max-width:8em;margin:0 0 22px;font-size:clamp(32px,3vw,44px);font-weight:600;letter-spacing:-.03em;line-height:1.05}
.fee-k{position:relative;z-index:1;margin:0 0 8px;color:#333;font-size:13px;font-weight:600;letter-spacing:.04em}
.fee-includes{position:relative;z-index:1;margin:0;padding:0 calc(8% + 148px) 0 0;list-style:none}
.fee-includes li{padding:10px 0;border-top:1px solid rgba(0,0,0,.12);font-size:16px;line-height:1.45}
.fee-time{position:absolute;z-index:1;left:32px;right:168px;bottom:26px;display:flex;align-items:center;min-height:48px;margin:0;padding-left:84px;font-size:15px;font-weight:600;line-height:1.35}
.fee-book{position:absolute;z-index:1;right:28px;bottom:28px}
.fee-board{margin-top:56px}
.fee-board h2{margin:0 0 8px;font-size:28px;font-weight:600;letter-spacing:-.03em}
.fee-fold{border-bottom:1px solid rgba(0,0,0,.12)}
.fee-fold summary{display:flex;align-items:center;gap:16px;min-height:58px;padding:14px 0;color:#000;font-size:18px;font-weight:500;line-height:1.3;cursor:pointer;list-style:none}
.fee-fold summary::-webkit-details-marker{display:none}
.fee-fold summary::marker{content:""}
.fee-fold summary span{flex:1;min-width:0}
.fee-fold summary strong{flex:none;font-weight:600;letter-spacing:-.02em}
.fee-fold summary:after{content:"+";flex:none;width:1.2em;font-weight:400;text-align:center}
.fee-fold[open] summary:after{content:"–"}
.fee-fold p{max-width:40em;margin:0 0 18px;color:#333;font-size:16px;line-height:1.5}
.services-intro{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(240px,.7fr);gap:28px 48px;align-items:end}
.services-intro .lede{margin:0}
.offer-board{position:relative;display:grid;grid-template-columns:minmax(240px,.78fr) minmax(0,1.22fr);gap:22px;align-items:stretch;margin-top:42px}
.offer-list{display:flex;flex-direction:column;gap:10px;min-width:0}
.offer-fold{margin:0}
.offer-pick{display:flex;align-items:center;gap:16px;width:100%;min-height:68px;margin:0;padding:12px 18px;border:0;border-radius:16px;background:#fff;color:#000;font:500 20px/1.2 Manrope,"Segoe UI",sans-serif;text-align:left;cursor:pointer;list-style:none;transition:background .2s ease}
.offer-pick::-webkit-details-marker{display:none}
.offer-pick::marker{content:""}
.offer-pick span{min-width:1.8em;color:#888;font-size:13px;font-weight:600;letter-spacing:.06em}
.offer-fold[open]>.offer-pick{background:var(--pale)}
.offer-stage{position:relative;z-index:0;min-height:460px;overflow:hidden;border-radius:28px;background:var(--pale)}
.offer-shape{position:absolute;right:8%;top:16%;width:190px;height:190px;border-radius:52px;background:#111;transform:rotate(-14deg);transition:transform .35s ease,background .35s ease}
.offer-shape-b{right:auto;left:8%;top:auto;bottom:14%;width:92px;height:92px;border-radius:28px;background:#fff}
.offer-local{display:none}
.offer-panel{display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-start;padding:36px}
.offer-fold[open]>.offer-panel{position:absolute;z-index:1;top:0;right:0;bottom:0;width:calc((100% - 22px) * 1.22 / 2)}
.offer-panel h2{max-width:8em;font-size:clamp(36px,4vw,56px);font-weight:600;line-height:1.05}
.offer-panel p{max-width:28em;margin-top:12px}
.offer-panel .flag,.offer-panel h2,.offer-panel p,.offer-panel .about-link{position:relative;z-index:1}
.offer-panel .about-link{margin-top:24px}
.service-page{padding:0;background:#efe6d4}
.service-sheet{width:min(1180px,calc(100% - 48px));margin:0 auto;padding:28px 0 72px}
.service-back{display:inline-flex;align-items:center;gap:12px;color:#111;font-weight:600;text-decoration:none}
.service-back-mark{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:#111;color:#fff;font-size:18px;line-height:1;transition:transform .2s ease,background .2s ease}
.service-back:hover .service-back-mark{transform:translateX(-4px);background:var(--accent);color:var(--on)}
.service-poster{display:grid;grid-template-columns:minmax(220px,.72fr) minmax(0,1.28fr);gap:28px 56px;align-items:center;min-height:calc(100vh - 240px);margin-top:12px}
.service-stamp{position:relative;min-height:320px}
.service-num{display:block;color:#111;font-size:clamp(96px,12vw,168px);font-weight:600;letter-spacing:-.07em;line-height:.8}
.service-blob{position:absolute;left:12%;bottom:6%;width:min(220px,42vw);aspect-ratio:1;border-radius:64px;background:#111;transform:rotate(-16deg)}
.service-page[data-shape="1"] .service-blob{border-radius:50%;background:var(--pale)}
.service-page[data-shape="2"] .service-blob{border-radius:28px;background:#fff;transform:rotate(18deg)}
.service-page[data-shape="3"] .service-blob{width:min(150px,30vw);border-radius:50%;background:#111;box-shadow:36px -32px 0 var(--pale)}
.service-page[data-shape="4"] .service-blob{border-radius:42% 58% 68% 32%;background:var(--accent);transform:rotate(22deg)}
.service-copy .flag{max-width:36em;margin-bottom:16px}
.service-copy h1{max-width:11em;font-size:clamp(44px,5.4vw,76px);font-weight:600;line-height:.96}
.service-lead{max-width:28em;margin-top:22px;color:#222;font-size:clamp(18px,2vw,22px);line-height:1.45}
.service-cta{margin-top:36px;min-height:56px;padding:16px 32px;font-size:16px;font-weight:600}
${offerSelect}
.map-frame{margin:0 0 10px;border-radius:10px;overflow:hidden;background:var(--pale)}
.map{display:block;width:100%;height:420px;border:0}
.map-note{margin-bottom:22px;color:#333;font-size:14px}
.info-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;width:min(100%,760px);margin:28px auto 22px}
.info-card,.sheet{padding:22px;border-radius:10px;background:#fff}
.sheet{display:grid;gap:12px}
.sheet label{display:grid;gap:6px;color:#333;font-size:14px}
.sheet input,.sheet textarea{width:100%;min-height:48px;padding:12px 14px;border:0;border-radius:8px;background:#f9f9f9;font:inherit;color:#000}
.sheet textarea{min-height:120px;resize:vertical}
.sheet .contact-call{color:#000;font-weight:600}
.sheet .button{width:100%;cursor:pointer}
.pending{color:#333}
.site-footer{background:#111;color:#fff;padding:64px 0 0}
.footer-brand{display:inline-flex;margin:0 0 36px;color:#000;text-decoration:none}
.footer-pill{display:inline-flex;align-items:center;max-width:16em;padding:12px 16px;border-radius:12px;background:#fff;color:#000;font-size:18px;font-weight:700;letter-spacing:-.03em;line-height:1.15}
.footer-logo{display:block;max-width:180px;max-height:42px;object-fit:contain}
.foot{display:grid;grid-template-columns:minmax(240px,1.05fr) minmax(320px,1.35fr) minmax(180px,.75fr);gap:48px 40px;align-items:start;padding-bottom:48px}
.footer-note{max-width:28em;margin:0;color:rgba(255,255,255,.62);font-size:14px;line-height:1.5}
.footer-actions{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-top:22px}
.site-footer .button{color:#000;background:#fff}
.site-footer .button:hover{background:var(--accent);color:var(--on)}
.footer-marks{display:flex;gap:8px;margin-top:28px}
.footer-marks span{display:grid;place-items:center;width:32px;height:32px;border-radius:8px;color:rgba(255,255,255,.78)}
.footer-index{display:grid;grid-template-columns:1fr 1fr;gap:0 32px;align-content:start}
.footer-index a{display:flex;align-items:baseline;gap:14px;padding:18px 0 14px;border-bottom:1px solid rgba(255,255,255,.16);color:#fff;font-size:clamp(20px,2vw,28px);font-weight:500;letter-spacing:-.03em;line-height:1;text-decoration:none}
.footer-index a:nth-child(-n+2){padding-top:0}
.footer-index a span{min-width:1.6em;color:rgba(255,255,255,.42);font-size:13px;font-weight:600;letter-spacing:.06em}
.footer-index a:hover span{color:#fff}
.footer-visit{display:grid;gap:14px;justify-items:start;align-content:start}
.footer-visit p,.footer-visit a.footer-phone{margin:0;color:rgba(255,255,255,.72);font-size:15px;line-height:1.45;text-decoration:none}
.footer-base{padding:18px 0 22px;border-top:1px solid rgba(255,255,255,.12)}
.site-footer a{color:#fff;text-decoration:none}
.site-footer p{color:rgba(255,255,255,.72)}
.site-footer .legal{display:block;margin:0;color:rgba(255,255,255,.5);font-size:13px}
a:focus-visible,.button:focus-visible,.menu-button:focus-visible,.meet-arrow:focus-visible,.book-submit:focus-visible,.review-pick:focus-visible,.offer-pick:focus-visible,.service-back:focus-visible,.social-pause:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid #000;outline-offset:3px}
@media (max-width:800px){
  html{scroll-padding-top:76px}
  .site-header{grid-template-columns:1fr auto;min-height:68px;padding:0 16px}
  .menu-button{justify-self:end}
  .nav-rule,.nav-phone,.header-cta{display:none}
  .site-header nav{position:absolute;left:auto;right:16px;top:68px;width:max-content;max-width:calc(100% - 32px)}
  .site-header nav ul{display:none;flex-direction:column;align-items:stretch;gap:0;width:max-content;max-width:100%;box-sizing:border-box;max-height:calc(100vh - 120px);max-height:calc(100svh - 120px);padding:16px;overflow:auto;overscroll-behavior:contain;border-radius:18px;background:#fff;box-shadow:0 16px 40px rgba(0,0,0,.12)}
  .nav-toggle:checked ~ .site-header nav ul{display:flex}
  .site-header nav a{min-height:36px;padding:0 4px;font-size:15px}
  .site-header .menu-panel a{min-height:32px;padding:2px 4px 2px 16px;font-size:14px}
  .site-header nav .button{display:flex;box-sizing:border-box;width:100%;justify-content:center;min-height:40px;margin-top:10px;padding:10px 4px}
  .menu-button{display:inline-flex}
  .has-menu{display:flex;flex-direction:column;align-items:stretch}
  .nav-chevron{display:none}
  .menu-panel,.has-menu:hover .menu-panel,.has-menu:focus-within .menu-panel{position:static;transform:none;opacity:1;visibility:visible;pointer-events:auto;min-width:0;padding:0 0 2px 8px;border-radius:0;background:transparent;box-shadow:none}
  .menu-panel::before{display:none}
  .services-intro,.offer-board,.service-poster,.about-summary,.team-board,.person{grid-template-columns:1fr}
  .about-summary{grid-template-areas:"copy" "photo" "team";row-gap:22px}
  .about-copy h1{margin-bottom:16px}
  .about-summary .lede{margin-bottom:18px}
  .about-photo{width:100%;height:auto;aspect-ratio:3/2;border-radius:22px}
  .about-team{margin:18px 0 0}
  .team-board{display:block;margin-top:40px}
  .team-rail{position:absolute;top:0;left:0;width:0;height:0;overflow:visible}
  .team-fall,.team-board[data-person="1"] .team-fall,.team-board[data-person="2"] .team-fall,.team-board[data-person="3"] .team-fall{width:30px;height:30px;border-radius:11px;background:#111;opacity:0;transition:opacity .12s ease}
  .team-fall.is-on-card,.team-board[data-person="1"] .team-fall.is-on-card,.team-board[data-person="2"] .team-fall.is-on-card,.team-board[data-person="3"] .team-fall.is-on-card{background:#111;opacity:1;transition:none}
  .services-page,.team-page,.prices-page{padding-top:32px}
  .person{display:flex;flex-direction:column}
  .person-card{order:-1}
  .thumb,.person-card{min-height:0}
  .thumb{min-height:220px}
  .person-card{--card-pad-x:20px;--card-pad-y:24px;padding:var(--card-pad-y) var(--card-pad-x) var(--card-pad-y) 70px}
  .offer-board{display:flex;flex-direction:column;gap:10px}
  .offer-stage{display:none}
  .offer-fold:not([open])>.offer-panel{display:none}
  .offer-fold[open]>.offer-panel{position:relative;top:auto;right:auto;bottom:auto;width:auto;min-height:0;margin-top:10px;padding:128px 24px 24px;border-radius:28px;background:var(--pale);overflow:hidden;justify-content:flex-start}
  .offer-local{display:block}
  .offer-panel .offer-local.offer-shape{width:104px;height:104px;top:18px;right:18px}
  .offer-panel .offer-local.offer-shape-b{width:52px;height:52px;left:18px;right:auto;top:22px;bottom:auto}
  .offer-pick::after{content:"";flex:none;width:10px;height:10px;margin-left:auto;border-right:2px solid #111;border-bottom:2px solid #111;transform:translateY(-2px) rotate(45deg);transition:transform .2s ease}
  .offer-fold[open]>.offer-pick::after{transform:translateY(2px) rotate(225deg)}
  .service-poster{min-height:0;margin-top:28px}
  .service-stamp{min-height:180px}
  .service-blob{left:auto;right:8px;bottom:0;width:120px}
  .service-page[data-shape="3"] .service-blob{box-shadow:22px -18px 0 var(--pale)}
  .landing{display:block;min-height:0}
  .landing>.hero-stage{margin-top:36px}
  .hero-head,.service-split,.split,.appoint,.book-layout,.foot,.info-grid,.shots{display:grid;grid-template-columns:1fr;width:auto}
  .wrap{width:min(100% - 32px,1180px)}
  .book-fields{grid-template-columns:1fr}
  .book-stage{min-height:0;display:grid;gap:0}
  .book-portrait{position:relative;inset:auto;min-height:240px;transform:none}
  .book-hours{position:relative;top:auto;right:auto;width:auto;transform:none}
  .hero-head{grid-template-columns:1fr;padding-top:36px;row-gap:18px;align-items:start}
  .hero-head h1,.hero-aside .lede,.hero-aside .button{grid-column:1;width:auto;max-width:none}
  .hero-head h1{grid-row:1}
  .hero-aside .lede{grid-row:2}
  .hero-aside .button{grid-row:3}
  .hero-stage{display:block;flex:none;min-height:0;margin-top:28px}
  .service-side,.shots{width:auto;max-width:none}
  .service-side{display:block;width:auto;min-width:0}
  .service-links,.shots{display:none}
  .service-accordion{display:block;margin-top:8px}
  .service-accordion details{border-bottom:1px solid rgba(0,0,0,.15)}
  .service-accordion summary{display:flex;align-items:center;justify-content:space-between;min-height:48px;padding:12px 0;color:#000;font-size:22px;line-height:1.35;font-weight:500;cursor:pointer;list-style:none}
  .service-accordion summary::-webkit-details-marker{display:none}
  .service-accordion summary:after{content:"+";font-weight:400}
  .service-accordion details[open] summary:after{content:"–"}
  .service-accordion .accordion-book{margin-top:18px}
  .vision{grid-template-columns:1fr;gap:22px}
  .vision-side{align-items:flex-start;flex-direction:column;gap:18px}
  .stat-board{grid-template-columns:1fr;gap:18px;min-height:0;margin-top:28px}
  .rails{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));height:auto;align-items:stretch;gap:8px}
  .rail,.rail:hover,.rail-reviews,.rail-reviews:hover,.rail-years,.rail-years:hover{width:auto;height:100%;min-height:80px;padding:12px 8px}
  .statement>.about-book{margin-top:22px}
  .rail span{writing-mode:horizontal-tb;transform:none;white-space:normal}
  .stat-stage{min-height:0;padding:8px 0 0}
  .geo{width:92px;height:92px;top:0;right:0}
  .accordion-panel{position:relative;padding:0 0 16px}
  .accordion-panel .tile-media{position:relative;inset:auto;min-height:180px;margin-bottom:12px;border-radius:10px}
  .accordion-panel .shot-copy{position:static}
  .hero-stage{overflow:hidden}
  .hero-media{height:auto;min-height:320px;border-radius:18px}
  .hero-media img{transform:translateY(-20%)}
  .hero-media img.anchor-top-right{object-fit:cover;top:-18%;right:0;left:0;width:100%;height:130%;transform:none}
  .hero-media::after{background:linear-gradient(to top,var(--pale) 0%,var(--pale) 32%,color-mix(in srgb,var(--pale) 82%,transparent) 38%,color-mix(in srgb,var(--pale) 38%,transparent) 44%,color-mix(in srgb,var(--pale) 0%,transparent) 50%)}
  .hero-cards{position:absolute;left:0;right:0;top:auto;bottom:0;width:auto;display:flex;grid-template-columns:none;align-content:stretch;gap:0;margin:0;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}
  .hero-cards::-webkit-scrollbar{display:none}
  .hero-card,.hero-card:nth-child(3){flex:0 0 100%;width:100%;min-width:100%;grid-column:auto;grid-row:auto;scroll-snap-align:start;scroll-snap-stop:always;padding:0 12px 12px;background:transparent;box-shadow:none;border-radius:0}
  .wide-media{min-height:220px}
  .side-media{min-height:220px}
  .section{padding:56px 0}
  #home>.section:has(.service-accordion){padding-bottom:56px}
  #home>.statement,#home>.social{padding:88px 0}
  .button{width:auto}
  .meet-book{width:100%}
  .meet-slide{grid-template-columns:1fr}
  .meet-photo,.meet-card{min-height:0}
  .meet-photo{min-height:240px}
  .meet-card{padding:24px 20px}
  .review-board{position:relative;display:block;margin-top:22px;padding:20px 18px 16px;border-radius:16px;background:#fff}
  .review-list{display:none}
  .review-nav{display:flex;gap:8px;position:absolute;right:16px;bottom:16px;z-index:2}
  .review-photos{position:absolute;top:20px;left:18px;width:52px;height:52px;min-height:0;z-index:1}
  .review-quotes{position:relative;min-height:0}
  .review-photo{width:52px;height:52px;border-radius:50%}
  .review-photo span{font-size:22px}
  .review-quote{position:relative;inset:auto;display:flex;flex-direction:column;height:0;margin:0;padding:0;overflow:hidden;border-radius:0;background:transparent;opacity:0;visibility:hidden;transform:none}
  ${reviewMobile}
  .review-quote h3{order:1;display:flex;align-items:center;min-height:52px;margin:0 0 16px 68px;font-size:18px;font-weight:600;line-height:1.2}
  .review-quote h3:has(+ .review-stars){min-height:0;align-items:flex-start;margin-bottom:4px}
  .review-quote .review-stars{order:2;display:block;margin:0 0 18px 68px;color:#111;font-size:13px;letter-spacing:.14em;line-height:1}
  .review-quote>p:last-child{order:3;margin:0}
  .review-quote .flag{order:4;display:flex;align-items:center;min-height:42px;margin:18px 0 0;padding-right:104px}
  .social-head{align-items:flex-start;flex-direction:column}
  .post{width:240px}
  .map{height:240px}
  #contact{padding-top:32px;padding-bottom:36px}
  #contact .info-grid{gap:8px;margin:16px 0 12px}
  #contact .info-card{padding:12px 14px}
  #contact .info-card h2{font-size:20px;line-height:1.15}
  #contact .split{gap:16px;margin-bottom:16px}
  #contact .sheet{padding:16px;gap:10px}
  #contact .side-media{display:block;min-height:0;height:auto;aspect-ratio:3/2;border-radius:22px}
  #contact .map{height:180px}
  #reviews{padding-top:32px;padding-bottom:56px}
  #reviews .page-intro{flex-direction:column;align-items:flex-start;gap:18px}
  #reviews .page-intro .button{margin-bottom:0}
  #reviews > .section.reviews{padding-top:28px}
  .fee-pair{grid-template-columns:1fr}
  .fee-card{min-height:0;padding:20px 18px 120px 20px}
  .fee-card .fee-gem{top:20px;right:16px;width:84px;height:84px;border-radius:26px}
  .fee-card .fee-gem strong{font-size:22px}
  .fee-card .fee-gem-sm{left:20px;right:auto;top:auto;bottom:20px;width:40px;height:40px;border-radius:14px}
  .fee-card h2{display:flex;align-items:center;max-width:none;min-height:84px;margin:0 100px 18px 0}
  .fee-includes,.fee-time{padding-right:0;padding-left:0}
  .fee-time{position:relative;left:auto;right:auto;bottom:auto;display:block;min-height:0;margin-top:18px}
  .fee-book{right:16px;bottom:16px}
  .footer-index{grid-template-columns:1fr}
  .footer-index a:nth-child(2){padding-top:18px}
}
@media (max-width:980px){
  .fee-pair{grid-template-columns:1fr}
}
@media (max-width:560px){
  h1{font-size:40px;line-height:1.12}
  .thumb span{font-size:84px}
}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.rail,.geo,.about-orb,.meet-arrow,.review-pick,.review-photo,.review-quote,.social-pause,.nav-chevron,.offer-pick,.offer-shape,.offer-panel,.service-back-mark,.service-links button,.team-fall,.person-card,.hero-go{transition:none}.meet.is-animated .meet-slide{animation:none}.social-track{animation:none}.social-marquee{overflow-x:auto}.hero-cards{scroll-behavior:auto}}
</style>
</head>
<body>
<p class="banner">${banner} · Prepared by Parley Systems · Not the business’s official website</p>
<a class="skip" href="#home">Skip to content</a>
<input id="nav-toggle" class="nav-toggle" type="checkbox" aria-label="Open menu">
<header class="site-header">
<div class="nav-left">
<a class="brand" href="#home">${logo}</a>
<span class="nav-rule" aria-hidden="true"></span>
${phoneText}
</div>
<nav aria-label="Pages">
<ul>
<li><a href="#home">Home</a></li>
<li class="has-menu"><a href="#services">Services <svg class="nav-chevron" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 6.2 8 10l4-3.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>${serviceMenu ? `<div class="menu-panel">${serviceMenu}</div>` : ''}</li>
<li><a href="#about">About</a></li>
<li><a href="#reviews">Reviews</a></li>
${pricesPage ? '<li><a href="#prices">Prices</a></li>' : ''}
<li><a href="#contact">Contact</a></li>
<li><a class="button" href="#contact">Book Now</a></li>
</ul>
</nav>
<label class="menu-button" for="nav-toggle"><span class="open">Menu</span><span class="close">Close</span></label>
<a class="button header-cta" href="#contact">Book Now</a>
</header>
<main>
<section id="home" class="page">
<div class="landing">
<div class="wrap hero-head">
<h1>${e(s.copy.headline)}</h1>
<div class="hero-aside">
<p class="lede">${e(heroIntroduction(s.copy.introduction))}</p>
<a class="button" href="#contact">Book appointment</a>
</div>
</div>
<div class="wrap hero-stage">
${heroMedia}
<div class="hero-cards">${heroCards}</div>
</div>
</div>
<section class="section">
<div class="wrap service-split" data-active="0">
<div class="service-side">
<p class="kicker">Services</p>
<h2>What is listed.</h2>
<p class="lede">${servicesNote}</p>
<nav class="service-links" aria-label="Services">${serviceLinks}</nav>
<div class="service-accordion">${serviceAccordion}</div>
</div>
<div class="shots">${serviceTiles}</div>
</div>
</section>
<section class="section band meet">
<div class="wrap">
<div class="meet-head">
<div>
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M8 1.1l1.05 3.35h3.5l-2.85 2.1 1.1 3.4L8 7.9l-2.8 2.05 1.1-3.4-2.85-2.1h3.5z"/></svg> Our specialists</p>
<h2>Meet the specialists</h2>
</div>
${people.length > 1 ? `<div class="meet-nav"><button class="meet-arrow meet-prev" type="button" aria-label="Previous specialist"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3.2 5.2 8 10 12.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button class="meet-arrow meet-next" type="button" aria-label="Next specialist"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3.2 10.8 8 6 12.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>` : ''}
</div>
<div class="meet-stage">${meetSlides || '<p class="pending">No individual team members were published, so none are shown here.</p>'}</div>
</div>
</section>
${reviewBand}
<section class="section book">
<div class="wrap book-layout">
<form class="book-form" action="#contact" method="post" onsubmit="return false">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="2.1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 1.4v1.7M8 12.9v1.7M1.4 8h1.7M12.9 8h1.7M3.3 3.3l1.2 1.2M11.5 11.5l1.2 1.2M12.7 3.3l-1.2 1.2M4.5 11.5l-1.2 1.2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Schedule</p>
<h2>Book your appointment</h2>
<p class="book-note">This preview does not send what you type or take a booking.</p>
<div class="book-fields">
<label>Name*<input name="name" autocomplete="name" placeholder="Enter first name" required></label>
<label>Email*<input name="email" type="email" autocomplete="email" placeholder="name@example.com" required></label>
<label>Phone<input name="tel" type="tel" autocomplete="tel" placeholder="Enter a phone number"></label>
<label class="book-date"><span>Appointment date*</span><span class="date-field">${calendarIcon}<input name="date" placeholder="DD / MM / YYYY" required></span></label>
<label class="span">Message*<textarea name="message" placeholder="Type message here..." required></textarea></label>
</div>
<div class="book-actions"><button class="book-submit" type="submit">Book appointment</button></div>
</form>
<div class="book-stage">
${bookPortrait}
<aside class="book-hours">
<h3>Opening &amp; closing times</h3>
<p>${hoursNote}</p>
${schedule ? `<p class="hours-live" data-hours="${e(schedule)}"><span class="hours-light" aria-hidden="true"></span><span class="hours-live-label"></span><span class="hours-live-tag">Live</span></p>` : ''}
${hoursRows}
${bookCall}
</aside>
</div>
</div>
</section>
<section class="wrap statement">
<div class="vision">
<h2>Why ${name}?</h2>
<div class="vision-side">
<p>${s.demo ? e(s.copy.introduction) : e(b.hours?.value || 'Hours awaiting confirmation.')}</p>
</div>
</div>
${demoStats}
<a class="about-link about-book" href="#contact">Book appointment<span class="about-orb" aria-hidden="true">→</span></a>
</section>
${socialBand}
</section>
<section id="services" class="page services-page">
<div class="wrap services-intro">
<div>
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 4.2h10M3 8h10M3 11.8h6.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg> Services</p>
<h1>What is listed.</h1>
</div>
<p class="lede">${servicesNote}</p>
</div>
${listed.length ? `<div class="wrap offer-board"><div class="offer-list">${offerItems}</div><div class="offer-stage" aria-hidden="true"><span class="offer-shape"></span><span class="offer-shape offer-shape-b"></span></div></div>` : '<div class="wrap"><p class="pending">Service details awaiting confirmation.</p></div>'}
</section>
${servicePages}
<section id="about" class="page team-page">
<div class="wrap about-summary">
<div class="about-copy">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M2.8 13.4V6.4L8 3.2l5.2 3.2v7" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M6.4 13.4V9h3.2v4.4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg> About</p>
<h1>${name}</h1>
<p class="lede">${aboutSummary}</p>
<a class="about-next" href="#meet-team"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.2 6.1 8 10.6l4.8-4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Get to know the specialists</span></a>
</div>
${aboutPhoto}
<p class="meet-kicker about-team" id="meet-team"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="5.4" cy="5.1" r="1.55" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="10.6" cy="5.1" r="1.55" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2.4 12.4c.35-1.7 1.5-2.6 3-2.6s2.65.9 3 2.6M7.6 12.4c.35-1.7 1.5-2.6 3-2.6s2.65.9 3 2.6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Meet the Team</p>
</div>
${people.length ? `<div class="wrap team-board" data-person="0"><div class="team-rail" aria-hidden="true"><span class="team-fall"></span></div><div class="people">${personCards}</div></div>` : '<div class="wrap"><p class="pending">No individual team members were published, so none are shown here.</p></div>'}
</section>
<section id="contact" class="page">
<div class="wrap page-intro">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4.4 2.6h2l.9 2.2-1.2.9a7.4 7.4 0 0 0 3.2 3.2l.9-1.2 2.2.9v2a1.1 1.1 0 0 1-1.2 1.1A8.8 8.8 0 0 1 3.3 3.8a1.1 1.1 0 0 1 1.1-1.2z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg> Contact</p>
<h1>${name}.</h1>
<div class="info-grid">${info}</div>
<div class="split">
<form class="sheet" action="#contact" method="post" onsubmit="return false">
<h2>Get in touch</h2>
${contactLead}
${schedule ? `<p class="hours-live" data-hours="${e(schedule)}" data-open="Reception is open" data-closed="Reception is closed"><span class="hours-light" aria-hidden="true"></span><span class="hours-live-label"></span><span class="hours-live-tag">Live</span></p>` : ''}
<p class="map-note">This preview does not send the message.</p>
<label>Name<input name="name" autocomplete="name"></label>
<label>Phone<input name="tel" type="tel" autocomplete="tel"></label>
<label>Message<textarea name="message"></textarea></label>
<button class="button solid" type="submit">Submit message</button>
</form>
${contactMedia}
</div>
<div class="map-frame">${map}</div>
<p class="map-note">${mapNote}</p>
</div>
</section>
${reviewsPage}
${pricesPage}
</main>
<footer class="site-footer">
<div class="wrap">
<a class="footer-brand" href="#home"><span class="footer-pill">${footerMark}</span></a>
<div class="foot">
<div class="footer-intro">
<p class="footer-note">${e(s.copy.introduction)}</p>
<div class="footer-actions">
<a class="button" href="#services">Services</a>
<a class="button" href="#contact">Book appointment</a>
</div>
<div class="footer-marks" aria-hidden="true">
<span><svg viewBox="0 0 16 16" width="15" height="15"><path fill="currentColor" d="M9.2 7.1 13.4 2h-1.5L8.6 6.3 5.7 2H2.2l4.4 6.4L2.2 14h1.5l3.6-4.2 2.9 4.2h3.5L9.2 7.1Zm-1.3 1.5-.4-.6L4.1 3h1.2l2.4 3.4.4.6 3.5 5h-1.2l-2.5-3.4Z"/></svg></span>
<span><svg viewBox="0 0 16 16" width="15" height="15"><path fill="currentColor" d="M9.3 14V8.7h1.8l.3-2H9.3V5.4c0-.6.2-1 .9-1H11.5V2.6c-.3 0-.9-.1-1.7-.1-1.7 0-2.8 1-2.8 2.9v1.3H5.2v2h1.8V14h2.3Z"/></svg></span>
<span><svg viewBox="0 0 16 16" width="15" height="15"><path fill="currentColor" d="M13.2 5.2a1.6 1.6 0 0 0-1.1-1.1C11.2 3.8 8 3.8 8 3.8s-3.2 0-4.1.3a1.6 1.6 0 0 0-1.1 1.1C2.5 6.1 2.5 8 2.5 8s0 1.9.3 2.8a1.6 1.6 0 0 0 1.1 1.1c.9.3 4.1.3 4.1.3s3.2 0 4.1-.3a1.6 1.6 0 0 0 1.1-1.1c.3-.9.3-2.8.3-2.8s0-1.9-.3-2.8ZM7 10.2V5.8L10.4 8 7 10.2Z"/></svg></span>
<span><svg viewBox="0 0 16 16" width="15" height="15"><path fill="currentColor" d="M8 4.2A3.8 3.8 0 1 0 8 11.8 3.8 3.8 0 0 0 8 4.2Zm0 6.2a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8ZM12.3 4a.9.9 0 1 1-1.8 0 .9.9 0 0 1 1.8 0ZM14 5.3a4.7 4.7 0 0 0-1.3-3.3A4.7 4.7 0 0 0 9.4 1H6.6a4.7 4.7 0 0 0-3.3 1.3A4.7 4.7 0 0 0 2 5.6v2.8a4.7 4.7 0 0 0 1.3 3.3A4.7 4.7 0 0 0 6.6 15h2.8a4.7 4.7 0 0 0 3.3-1.3A4.7 4.7 0 0 0 14 10.4V5.3Zm-1.4 5.1a3.3 3.3 0 0 1-.9 2.3 3.3 3.3 0 0 1-2.3.9H6.6a3.3 3.3 0 0 1-2.3-.9 3.3 3.3 0 0 1-.9-2.3V5.6c0-.9.3-1.7.9-2.3a3.3 3.3 0 0 1 2.3-.9h2.8c.9 0 1.7.3 2.3.9.6.6.9 1.4.9 2.3v4.8Z"/></svg></span>
</div>
</div>
<nav class="footer-index" aria-label="Pages">
<a href="#home"><span>01</span> Home</a>
<a href="#services"><span>02</span> Services</a>
<a href="#about"><span>03</span> About</a>
<a href="#reviews"><span>04</span> Reviews</a>
<a href="#contact"><span>05</span> Contact</a>
${pricesPage ? '<a href="#prices"><span>06</span> Prices</a>' : ''}
</nav>
<div class="footer-visit">
${b.address ? `<p>${e(b.address.value)}</p>` : ''}
${b.hours ? `<p>${e(b.hours.value)}</p>` : ''}
${phoneOk ? `<a class="footer-phone" href="tel:${phoneDigits}">${e(b.phone.value)}</a>` : ''}
<a class="button" href="#contact">Contact us</a>
</div>
</div>
</div>
<div class="wrap footer-base"><small class="legal">Template care-modern 1.0.0. Colour follows this business’s brand accent. This page does not sell products. Category photography is illustrative.</small></div>
</footer>
<script>
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => { const box = document.getElementById('nav-toggle'); if (box) box.checked = false; }));
document.querySelectorAll('.service-split').forEach(split => {
  split.querySelectorAll('.service-links button').forEach((button, index) => {
    button.addEventListener('click', () => { split.dataset.active = String(index); });
  });
});
document.querySelectorAll('.stat-board').forEach(board => {
  const rails = [...board.querySelectorAll('.rail')];
  const order = rails.map(rail => rail.dataset.stat);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer = 0;
  const show = (stat) => { board.dataset.stat = stat; };
  const tick = () => {
    if (motion.matches) return;
    const page = board.closest('.page');
    if (page && getComputedStyle(page).display === 'none') return;
    const index = Math.max(0, order.indexOf(board.dataset.stat));
    show(order[(index + 1) % order.length]);
  };
  const start = () => {
    window.clearInterval(timer);
    if (motion.matches || order.length < 2) return;
    timer = window.setInterval(tick, 5000);
  };
  rails.forEach(rail => rail.addEventListener('click', () => { show(rail.dataset.stat); start(); }));
  motion.addEventListener('change', start);
  start();
});
document.querySelectorAll('.meet').forEach(meet => {
  const slides = [...meet.querySelectorAll('.meet-slide')];
  const previous = meet.querySelector('.meet-prev');
  const next = meet.querySelector('.meet-next');
  if (slides.length < 2 || !previous || !next) return;
  let index = Math.max(0, slides.findIndex(slide => slide.classList.contains('is-on')));
  const go = (direction) => {
    const incomingIndex = (index + direction + slides.length) % slides.length;
    if (incomingIndex === index) return;
    meet.classList.add('is-animated');
    const outgoing = slides[index];
    const incoming = slides[incomingIndex];
    slides.forEach(slide => slide.classList.remove('play-in-next', 'play-in-prev', 'play-out-next', 'play-out-prev'));
    void incoming.offsetWidth;
    outgoing.classList.remove('is-on');
    outgoing.setAttribute('aria-hidden', 'true');
    outgoing.classList.add(direction > 0 ? 'play-out-next' : 'play-out-prev');
    incoming.classList.add('is-on', direction > 0 ? 'play-in-next' : 'play-in-prev');
    incoming.removeAttribute('aria-hidden');
    index = incomingIndex;
  };
  next.addEventListener('click', () => go(1));
  previous.addEventListener('click', () => go(-1));
});
document.querySelectorAll('.review-board').forEach(board => {
  const picks = [...board.querySelectorAll('.review-pick')];
  const photos = [...board.querySelectorAll('.review-photo')];
  const quotes = [...board.querySelectorAll('.review-quote')];
  const show = (index) => {
    board.dataset.active = String(index);
    picks.forEach((pick, item) => pick.setAttribute('aria-selected', item === index ? 'true' : 'false'));
    photos.forEach((photo, item) => photo.setAttribute('aria-hidden', item === index ? 'false' : 'true'));
    quotes.forEach((quote, item) => quote.setAttribute('aria-hidden', item === index ? 'false' : 'true'));
  };
  picks.forEach((pick, index) => pick.addEventListener('click', () => show(index)));
  const step = (direction) => show((Number(board.dataset.active) + direction + picks.length) % picks.length);
  board.querySelector('.review-prev')?.addEventListener('click', () => step(-1));
  board.querySelector('.review-next')?.addEventListener('click', () => step(1));
});
document.querySelectorAll('.offer-board').forEach(board => {
  board.querySelectorAll('.offer-fold').forEach(fold => {
    const summary = fold.querySelector('.offer-pick');
    if (!summary) return;
    summary.addEventListener('click', (event) => {
      if (window.matchMedia('(max-width:800px)').matches) return;
      if (fold.open) event.preventDefault();
    });
  });
});
document.querySelectorAll('.team-board').forEach(board => {
  const cards = [...board.querySelectorAll('.person')];
  const rail = board.querySelector('.team-rail');
  const fall = board.querySelector('.team-fall');
  if (!cards.length || !rail || !fall) return;
  const turns = [-14, 26, -8, 18];
  let frame = 0;
  const update = () => {
    frame = 0;
    const page = board.closest('.page');
    if (page && getComputedStyle(page).display === 'none') return;
    const railBox = rail.getBoundingClientRect();
    const focus = window.innerHeight * 0.42;
    let active = 0;
    let best = Infinity;
    cards.forEach((card, index) => {
      const box = card.getBoundingClientRect();
      const dist = Math.abs(box.top + box.height * 0.35 - focus);
      if (dist < best) { best = dist; active = index; }
    });
    const cardBox = cards[active].getBoundingClientRect();
    const narrow = window.matchMedia('(max-width:800px)').matches;
    let shift = 'translateY(' + Math.min(Math.max(8, cardBox.top - railBox.top + 18), Math.max(8, railBox.height - 68)) + 'px)';
    let showOnCard = false;
    if (narrow) {
      const textCards = cards.map(card => card.querySelector('.person-card'));
      const sample = textCards[0];
      const padX = parseFloat(getComputedStyle(sample).getPropertyValue('--card-pad-x')) || 20;
      const padY = parseFloat(getComputedStyle(sample).getPropertyValue('--card-pad-y')) || 24;
      const size = fall.offsetHeight || 30;
      const line = window.innerHeight * 0.38;
      let chosen = -1;
      let y = 0;
      let passed = false;
      let park = null;
      for (let i = 0; i < textCards.length; i++) {
        const box = textCards[i].getBoundingClientRect();
        const minY = box.top + padY;
        const maxY = Math.max(minY, box.bottom - padY - size);
        if (line < minY) {
          if (!passed) { chosen = i; y = minY; }
          break;
        }
        if (line <= maxY) { chosen = i; y = line; break; }
        park = { index: i, y: maxY };
        passed = true;
      }
      if (chosen >= 0) {
        active = chosen;
        showOnCard = true;
        const textBox = textCards[chosen].getBoundingClientRect();
        shift = 'translate(' + (textBox.left - railBox.left + padX) + 'px,' + (y - railBox.top) + 'px)';
      } else if (park) {
        active = park.index;
        const textBox = textCards[park.index].getBoundingClientRect();
        shift = 'translate(' + (textBox.left - railBox.left + padX) + 'px,' + (park.y - railBox.top) + 'px)';
        fall.style.transform = shift + ' rotate(' + turns[active % turns.length] + 'deg)';
      }
    }
    if (!narrow || showOnCard) fall.style.transform = shift + ' rotate(' + turns[active % turns.length] + 'deg)';
    board.dataset.person = String(active);
    cards.forEach((card, index) => card.classList.toggle('is-current', index === active));
    if (narrow) fall.classList.toggle('is-on-card', showOnCard);
    else fall.classList.remove('is-on-card');
  };
  const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('hashchange', onScroll);
  update();
});
document.querySelectorAll('.social').forEach(band => {
  const button = band.querySelector('.social-pause');
  if (!button) return;
  button.addEventListener('click', () => {
    const paused = band.classList.toggle('is-paused');
    button.setAttribute('aria-pressed', paused ? 'true' : 'false');
    button.textContent = paused ? 'Play' : 'Pause';
  });
});
document.querySelectorAll('.hero-cards').forEach(row => {
  const cards = [...row.querySelectorAll('.hero-card')];
  if (cards.length < 2) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = window.matchMedia('(max-width:800px)');
  let index = 0;
  let timer = 0;
  const tick = () => {
    if (!narrow.matches || motion.matches) return;
    const page = row.closest('.page');
    if (page && getComputedStyle(page).display === 'none') return;
    index = (index + 1) % cards.length;
    row.scrollTo({ left: row.clientWidth * index, behavior: 'smooth' });
  };
  const start = () => {
    window.clearInterval(timer);
    if (!narrow.matches || motion.matches) return;
    timer = window.setInterval(tick, 8000);
  };
  row.addEventListener('pointerdown', () => window.clearInterval(timer));
  row.addEventListener('pointerup', start);
  row.addEventListener('focusin', () => window.clearInterval(timer));
  row.addEventListener('focusout', start);
  narrow.addEventListener('change', start);
  motion.addEventListener('change', start);
  start();
});
document.querySelectorAll('.hours-live').forEach(line => {
  const names = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const daySet = text => {
    const found = text.toLowerCase().match(/sunday|monday|tuesday|wednesday|thursday|friday|saturday/g) || [];
    if (!found.length) return null;
    if (found.length >= 2 && / to /.test(text.toLowerCase())) {
      const start = names.indexOf(found[0]);
      const end = names.indexOf(found[found.length - 1]);
      const days = [];
      for (let i = start; days.length < 7; i = (i + 1) % 7) { days.push(i); if (i === end) break; }
      return days;
    }
    return found.map(name => names.indexOf(name));
  };
  const clock = text => {
    const match = text.match(/(\\d{1,2})(?::(\\d{2}))?\\s*(am|pm)?\\s*[–-]\\s*(\\d{1,2})(?::(\\d{2}))?\\s*(am|pm)?/i);
    if (!match) return null;
    const mins = (hourText, minuteText, marker) => {
      let hour = Number(hourText);
      const minute = Number(minuteText || 0);
      if (marker) {
        const ap = marker.toLowerCase();
        if (ap === 'pm' && hour < 12) hour += 12;
        if (ap === 'am' && hour === 12) hour = 0;
      }
      return hour * 60 + minute;
    };
    return [mins(match[1], match[2], match[3]), mins(match[4], match[5], match[6])];
  };
  const windows = [];
  let days = null;
  String(line.dataset.hours || '').split(',').forEach(part => {
    const nextDays = daySet(part);
    const span = clock(part);
    if (nextDays) days = nextDays;
    if (span && days) windows.push({ days: days, start: span[0], end: span[1] });
  });
  const apply = instant => {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(instant);
    const pick = type => { const part = parts.find(item => item.type === type); return part ? part.value : ''; };
    const today = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[pick('weekday')];
    const now = Number(pick('hour')) * 60 + Number(pick('minute'));
    const open = windows.some(window => window.days.indexOf(today) !== -1 && now >= window.start && now < window.end);
    line.classList.add('is-set');
    line.classList.toggle('is-open', open);
    line.querySelector('.hours-live-label').textContent = open ? (line.dataset.open || 'Open now') : (line.dataset.closed || 'Closed now');
  };
  if (windows.length) apply(new Date());
  line._applyHours = apply;
});
</script>
</body>
</html>
`;
}
