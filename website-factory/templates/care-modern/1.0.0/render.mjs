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
  const waveHalo = mix([255, 255, 255], 0.72);
  const waveMid = mix([255, 255, 255], 0.48);
  const waveSoft = mix([255, 255, 255], 0.32);
  const initial = e((b.name.value || '•').trim().charAt(0).toUpperCase());
  const logo = s.assets.logo
    ? `<img class="logo" src="${e(s.assets.logo.path)}" alt="${e(s.assets.logo.alt)}">`
    : `<span class="wordmark"><span class="mark" aria-hidden="true">${initial}</span><span><strong>${name}</strong><small>${location}</small></span></span>`;
  const footerMark = s.assets.logo
    ? `<img class="footer-logo" src="${e(s.assets.logo.path)}" alt="${e(s.assets.logo.alt)}">`
    : name;
  const phoneDigits = (b.phone?.value || '').replace(/[^\d+]/g, '');
  const phoneOk = /^\+?\d{7,15}$/.test(phoneDigits);
  const contactLead = phoneOk
    ? `<p>Call <a class="contact-call" href="tel:${phoneDigits}">${e(b.phone.value)}</a>, or submit a message here. Reception will get back to you as soon as possible.</p>`
    : '<p>Submit a message here. Reception will get back to you as soon as possible.</p>';
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
  const heroClasses = [];
  if (landingImage && (landingImage.libraryId === 'physio-landing-treatment' || landingImage.libraryId === 'care-landing-treatment')) heroClasses.push('anchor-top-right');
  if (landingImage && landingImage.libraryId === 'dental-landing-treatment') heroClasses.push('fit-facade');
  if (landingImage && !landingImage.libraryId) heroClasses.push('fit-subject');
  const heroPin = heroClasses.length ? ` class="${heroClasses.join(' ')}"` : '';
  const heroMedia = landingImage
    ? `<figure class="hero-media"><img${heroPin} src="${e(landingImage.path)}" alt="${e(landingImage.alt)}"></figure>`
    : frame(gallery[0], 'Photograph awaiting an approved category image.', 'hero-media');
  const sideMedia = frame(gallery[2] || gallery[0], 'Photograph awaiting an approved category image.', 'side-media');
  const alternateServiceIds = ['physiotherapy', 'chiropractic', 'general', 'optician'].includes(s.sector) ? [null, 'care-service-tile-2', 'care-review-shoulder'] : [];
  const serviceCover = index => {
    const alternateId = alternateServiceIds[index];
    const alternate = alternateId && pictures.find(image => image && image.libraryId === alternateId);
    return frame(alternate || serviceImage || gallery[0], 'Photograph awaiting an approved category image.', 'tile-media');
  };
  const wordCount = value => value ? value.split(' ').length : 0;
  const heroIntroduction = text => {
    const lines = String(text || '').split(/\r?\n/).map(line => line.replace(/[ \t]+/g, ' ').trim()).filter(Boolean);
    const clean = lines.join('\n');
    const flat = lines.join(' ');
    if (wordCount(flat) <= 50) return clean;
    const sentences = flat.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [];
    let kept = '';
    for (const sentence of sentences) {
      const next = `${kept}${sentence}`;
      if (wordCount(next.trim()) > 50) break;
      kept = next;
    }
    return kept.trim() || flat.split(' ').slice(0, 50).join(' ');
  };
  const headerTitle = String(s.copy?.headerTitle || '').trim();
  const headerPlace = String(s.copy?.headerPlace || '').trim();
  const headerTown = String(s.copy?.headerTown || '').trim();
  const headerMark = (place, town) => headerTitle
    ? `<span class="wordmark"><span><strong>${e(headerTitle)}</strong>${place ? `<small>${e(place)}</small>` : ''}${town ? `<small>${e(town)}</small>` : ''}</span></span>`
    : '';
  const headerWords = headerMark(headerPlace, '');
  const headerLockup = headerMark(headerPlace, headerTown);
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
      Preventative: 'Preventative is listed for routine dental visits. This page does not describe a method or a result.',
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
  const people = [
    ...publishedPeople.map(person => ({ ...person, illustrative: false })),
    ...examplePeople.map(person => ({ ...person, illustrative: true }))
  ];
  const namedImage = person => person.imageId ? pictures.find(image => image && image.libraryId === person.imageId) : null;
  const wellImageSectors = new Set(['physiotherapy', 'chiropractic', 'general', 'optician']);
  const templateMeetIds = ['care-jordan-example', 'care-sam-example', 'care-riley-example'];
  const templateMeetImage = index => {
    if (!wellImageSectors.has(s.sector)) return null;
    const id = templateMeetIds[index % templateMeetIds.length];
    return pictures.find(image => image && image.libraryId === id) || null;
  };
  const staffFlag = '<p class="flag">Illustrative layout — not a verified member of staff</p>';
  const personFlag = person => person.illustrative ? staffFlag : '';
  const anchoredMeet = new Set(['care-riley-example', 'care-jordan-example', 'care-sam-example']);
  const faceClass = image => image && image.placement === 'person' && !anchoredMeet.has(image.libraryId) ? ' class="anchor-face"' : '';
  const personCards = people.map((person, index) => {
    const image = namedImage(person) || templateMeetImage(index) || gallery[index];
    const letter = e(String(person.name).trim().charAt(0).toUpperCase());
    const thumbFace = faceClass(image);
    const photo = image
      ? `<figure class="thumb"><img${thumbFace} src="${e(image.path)}" alt="${e(image.alt)}"></figure>`
      : `<figure class="thumb" role="img" aria-label="Portrait area for ${e(person.name)}"><span aria-hidden="true">${letter}</span></figure>`;
    return `<article class="person${index === 0 ? ' is-current' : ''}">${photo}<div class="person-card">${personFlag(person)}<h2>${e(person.name)}</h2><p class="role">${e(person.role || '')}</p><p>${e(person.detail)}</p></div></article>`;
  }).join('');
  const calendarIcon = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="2.2" y="3.2" width="11.6" height="10.6" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M2.2 6.4h11.6M5.2 2v2.6M10.8 2v2.6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
  const clockIcon = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="8.2" r="5.2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 5.2V8.2l2.1 1.3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
  const meetSlides = people.map((person, index) => {
    const ownImage = namedImage(person) || templateMeetImage(index) || gallery[index];
    const image = ownImage || portraitImage;
    const anchor = image && anchoredMeet.has(image.libraryId) ? ' class="anchor-start"' : faceClass(image);
    const photo = image
      ? `<figure class="meet-photo"><img${anchor} src="${e(image.path)}" alt="${e(image.alt)}"></figure>`
      : `<figure class="meet-photo" role="img" aria-label="Portrait area for ${e(person.name)}"><span aria-hidden="true">${e(String(person.name).trim().charAt(0).toUpperCase())}</span></figure>`;
    const portraitNote = person.illustrative
      ? staffFlag
      : (!ownImage && image ? '<p class="flag">Illustrative portrait — not a photograph of this person</p>' : '');
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
  const socialFillers = s.sector === 'optician' ? ['An eye test', 'A new pair'] : s.sector === 'dental' || s.sector === 'veterinary' ? ['A visit', 'A check-up'] : ['A visit', 'How you move'];
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
    parkingCard
  ].join('');
  const banner = s.demo ? 'FICTIONAL DEMO' : 'CONCEPT WEBSITE';
  const bannerStreet = value => {
    const raw = String(value || '').trim();
    const parts = raw.split(/\s*(?:,|\n)\s*/).map(part => part.trim()).filter(Boolean);
    const found = raw.match(/\b([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})\b/i);
    const code = found ? `${found[1].toUpperCase()} ${found[2].toUpperCase()}` : '';
    let first = parts[0] || '';
    if (code) first = first.replace(new RegExp(`\\b${found[1]}\\s*${found[2]}\\b`, 'i'), '').replace(/^[,\s]+|[,\s]+$/g, '').trim();
    if (first && code) return `${first}, ${code}`;
    return first || code;
  };
  const bannerAddress = b.address?.value ? `<span class="banner-address">${e(bannerStreet(b.address.value))}</span>` : '';
  const bannerPhone = phoneOk ? `<a href="tel:${phoneDigits}">${e(b.phone.value)}</a>` : '';
  const bannerContact = [bannerAddress, bannerPhone].filter(Boolean).join('<span class="banner-gap" aria-hidden="true">|</span>');
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
  const guideLine = '<svg class="guide-line" aria-hidden="true"></svg>';
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
${guideLine}
<div class="wrap">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8.4 2.4h4.4v4.4L7.4 12.2 3.2 8 8.4 2.4z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="10.8" cy="4.8" r=".7" fill="currentColor"/></svg> Prices</p>
<h1>What a visit includes.</h1>
<p class="flag">${pricesFlag}</p>
<p class="lede">${pricesLede}</p>
${posterCards ? `<div class="fee-pair">${posterCards}</div>` : ''}
${feeBoard}
</div>
</section>` : '';
  const movementEnquiries = ['Initial assessment', 'Continued treatment', 'Massage', 'Sports Massage', 'Acupuncture', 'General Enquiry'];
  const dentalEnquiries = ['Cosmetic', 'Preventative', 'Emergency', 'Check-Up', 'General Enquiry', 'Unsure'];
  const opticianEnquiries = ['Eye test', 'Glasses', 'Contact lenses', 'NHS sight test', 'General enquiry', 'Unsure'];
  const enquiryChoices = s.sector === 'physiotherapy' || s.sector === 'chiropractic' ? movementEnquiries : s.sector === 'optician' ? opticianEnquiries : dentalEnquiries;
  const enquiryFields = enquiryChoices.map(label => `<label class="book-choice"><input type="radio" name="setter-enquiry" value="${e(label)}">${e(label)}</label>`).join('');
  const reviewsPage = `<section id="reviews" class="page">
${guideLine}
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
.banner{display:flex;align-items:stretch;min-height:34px;margin:0;background:#fff;color:#111}
.banner-note{flex:1;min-width:0;margin:0;padding:7px 20px;overflow:hidden;color:#333;font-size:11px;font-weight:500;letter-spacing:.04em;line-height:1.2;white-space:nowrap;text-overflow:ellipsis}
.banner-contact{display:flex;align-items:center;gap:12px;flex:none;max-width:min(68%,760px);margin:0;padding:7px 22px 7px 44px;background:var(--pale);color:#111;font-size:13px;font-weight:500;line-height:1.2;clip-path:polygon(0 0,100% 0,100% 100%,22px 100%)}
.banner-contact .banner-address,.banner-contact a{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.banner-contact a{color:inherit;text-decoration:none}
.banner-gap{flex:none;opacity:.72}
.nav-toggle{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.site-header{position:sticky;top:0;z-index:8;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:24px;min-height:84px;padding:0 28px;border-bottom:1px solid #e6e6e6;background:#fff}
.site-header nav{justify-self:center}
.header-cta{justify-self:end}
.nav-left{display:flex;align-items:center;gap:18px;min-width:0}
.brand{display:flex;align-items:center;min-height:44px;color:#000;text-decoration:none}
.logo{max-width:180px;max-height:42px;object-fit:contain}
.wordmark{display:flex;align-items:center;gap:10px}
.site-header .wordmark{margin-left:-5px}
.wordmark strong{display:block;font-size:16px;font-weight:600;letter-spacing:-.02em}
.wordmark small{display:block;color:#333;font-size:12px;font-weight:500}
.mark{display:grid;place-items:center;width:36px;height:36px;border-radius:8px;background:var(--accent);color:var(--on);font-weight:700}
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
.landing>.hero-stage{margin-top:56px;margin-bottom:0}
.hero-head{position:relative;display:grid;grid-template-columns:minmax(0,680px) minmax(260px,380px);justify-content:space-between;align-items:center;column-gap:56px;row-gap:20px;padding-top:48px}
.hero-head h1{grid-column:1;grid-row:1;width:auto;max-width:none;line-height:1.2}
.hero-aside{grid-column:2;grid-row:1;align-self:center;display:flex;flex-direction:column;align-items:flex-start;gap:20px;min-width:0}
.hero-aside .lede{margin:0}
.hero-book{display:flex;align-items:center;gap:14px}
.title-stop{display:inline}
.title-line{position:absolute;height:3px;border-radius:2px;background:var(--accent);transform:scaleX(0);transform-origin:left center;pointer-events:none}
.title-arrow{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none}
.title-nudge{display:none;width:64px;height:36px;margin-bottom:6px;color:var(--accent);flex:none;overflow:visible;transform:rotate(-35deg);transform-origin:center}
.title-nudge path{fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.title-nudge .nudge-shaft{stroke-dasharray:90;stroke-dashoffset:90;animation:nudge-draw .5s ease 3.95s forwards}
.title-nudge .nudge-head{stroke-dasharray:28;stroke-dashoffset:28;animation:nudge-draw .22s ease 4.4s forwards}
@keyframes nudge-draw{to{stroke-dashoffset:0}}
.lede{margin:0 0 28px;color:#333;font-size:16px;line-height:1.55}
.hero-stage{position:relative;margin-top:56px}
.hero-media,.wide-media,.side-media,.tile-media,.frame{margin:0;position:relative;overflow:hidden;border-radius:10px;background:var(--pale)}
.hero-media{height:400px;border-radius:28px}
.wide-media{min-height:420px;margin:28px 0}
.side-media{min-height:460px}
.tile-media{min-height:220px;border-radius:10px 10px 0 0}
.hero-media img,.wide-media img,.side-media img,.tile-media img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0}
.hero-media img{object-position:center 62%;transform:none}
.hero-media img.fit-subject{object-position:center 42%;transform:none}
.hero-media img.fit-facade{top:0;right:0;bottom:0;left:0;z-index:0;width:100%;height:100%;object-position:center 68%;transform:translateX(200px)}
.hero-media:has(img.fit-facade)::after{z-index:1;background:linear-gradient(90deg,var(--pale) 0,var(--pale) 310px,color-mix(in srgb,var(--pale) 70%,transparent) calc(310px + 7%),transparent calc(310px + 18%))}
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
.meet-stage{display:grid;margin-top:28px;overflow:hidden}
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
.kicker{display:flex;align-items:center;gap:8px;margin-bottom:10px;color:#000;font-size:14px;font-weight:500}
.kicker svg{display:block;flex:none}
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
.book-date .date-field,.book-time .date-field{position:relative;display:block}
.book-date svg,.book-time svg{position:absolute;right:14px;top:50%;transform:translateY(-50%);color:#666;pointer-events:none}
.book-date input,.book-time input{padding-right:42px}
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
.book-setter{position:fixed;right:22px;bottom:22px;z-index:80;width:72px;height:72px}
.book-setter-ring{position:relative;display:grid;place-items:center;width:72px;height:72px;padding:0;border:3px solid var(--accent);border-radius:50%;background:#fff;color:var(--accent);box-shadow:0 0 0 7px color-mix(in srgb,var(--accent) 16%,transparent),0 12px 28px rgba(17,17,17,.16);cursor:pointer}
.book-setter-ring svg{display:block}
.book-setter-ring.has-word{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px}
.book-setter-ring.has-word svg{width:30px;height:30px;transform:translateY(-4px)}
.book-setter-word{color:var(--accent);font-size:9px;font-weight:700;letter-spacing:.12em;line-height:1;transform:translateY(-2px)}
.book-setter-label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}
.book-setter-panel{position:absolute;right:0;bottom:0;display:flex;flex-direction:column;width:min(320px,calc(100vw - 32px));max-height:min(640px,calc(100vh - 40px));overflow:hidden;border-radius:16px;background:#fff;box-shadow:0 16px 40px rgba(17,17,17,.16);transform-origin:bottom right;transform:scale(.2);opacity:0;visibility:hidden;pointer-events:none;transition:transform .22s ease,opacity .22s ease}
.book-setter.is-open .book-setter-panel{transform:scale(1);opacity:1;visibility:visible;pointer-events:auto;box-shadow:0 0 0 7px color-mix(in srgb,var(--accent) 16%,transparent),0 16px 40px rgba(17,17,17,.16)}
.book-setter-cover{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:10px;flex:none;padding:14px 10px 14px 14px;background:var(--accent);color:var(--on)}
.book-setter-cover svg{display:block}
.book-setter-title{margin:0;color:inherit;font-size:15px;font-weight:600;line-height:1.25;text-align:left}
.book-setter-close{display:grid;place-items:center;width:36px;height:36px;padding:0;border:0;border-radius:50%;background:transparent;color:inherit;cursor:pointer}
.book-setter-progress{flex:none;height:4px;background:#e4e4e7}
.book-setter-progress span{display:block;height:100%;width:25%;background:#111;transition:width .22s ease}
.book-setter-steps{overflow:auto;padding:16px}
.book-setter-steps [hidden]{display:none}
.book-step{display:grid;gap:10px}
.book-step-count{margin:0;color:#666;font-size:12px;font-weight:600}
.book-setter fieldset{display:grid;gap:8px;margin:0;padding:0;border:0}
.book-setter legend{margin:0 0 2px;color:#000;font-size:12px;font-weight:600}
.book-setter label{display:grid;gap:4px;color:#000;font-size:12px;font-weight:600}
.book-setter .book-choice{display:flex;align-items:center;gap:8px;min-height:40px;padding:8px 10px;border:1px solid #eee;border-radius:8px;background:#fff;font-weight:500;cursor:pointer}
.book-setter .book-choice:has(input:checked){border-color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,#fff)}
.book-setter .book-choice input{width:auto;min-height:0;margin:0;padding:0;accent-color:var(--accent)}
.book-setter input,.book-setter textarea{width:100%;min-height:38px;padding:8px 10px;border:1px solid #eee;border-radius:8px;background:#fff;color:#000;font:inherit;font-size:14px}
.book-setter textarea{min-height:64px;resize:vertical}
.book-setter input:disabled,.book-setter textarea:disabled{background:#f6f7f8;color:#888}
.book-setter-note{margin:2px 0 0;color:#333;font-size:12px;font-weight:500;line-height:1.35}
.book-setter-error{margin:0 16px 8px;color:#9b1c1c;font-size:12px;font-weight:600;line-height:1.35}
.book-setter-error[hidden]{display:none}
.book-setter-nav{display:flex;align-items:center;gap:8px;flex:none;padding:0 16px 16px}
.book-setter-back{flex:none;min-height:40px;padding:8px 14px;border:1px solid #ccc;border-radius:8px;background:#fff;color:#111;font:600 13px/1 Manrope,"Segoe UI",sans-serif;cursor:pointer}
.book-setter-back[hidden]{display:none}
.book-setter-nav .book-submit{flex:1;width:auto;margin:0}
.book-setter-done{margin:0;color:#333;font-size:13px;font-weight:500;line-height:1.4}
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
.about-summary{display:grid;grid-template-columns:minmax(0,1fr);grid-template-areas:"copy" "team";row-gap:28px;align-items:start}
.about-copy{grid-area:copy}
.about-copy h1{margin:0 0 18px}
.about-pair{display:grid;grid-template-columns:minmax(0,1fr) minmax(200px,280px);column-gap:48px;align-items:center;margin:0 0 22px}
.about-summary .lede{margin:0 0 22px}
.about-lead .lede:last-child{margin-bottom:0}
.about-next{display:inline-flex;align-items:center;gap:8px;margin:0;padding:0;background:none;color:#111;font:600 16px/1.4 Manrope,"Segoe UI",sans-serif;text-decoration:none}
.about-next span{text-decoration:underline;text-underline-offset:4px}
.about-next svg{flex:none}
.about-next:hover{color:#111}
#meet-team{scroll-margin-top:96px}
.about-photo{margin:0;width:100%;height:196px;border-radius:18px;overflow:hidden;background:var(--pale)}
.about-photo img{width:100%;height:100%;object-fit:cover;object-position:center}
.about-team{grid-area:team;justify-self:start;margin:0}
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
.footer-pill{display:inline-flex;align-items:center;gap:12px;max-width:16em;padding:12px 16px;border-radius:12px;background:#fff;color:#000;font-size:18px;font-weight:700;letter-spacing:-.03em;line-height:1.15}
.footer-pill:has(.wordmark){max-width:none}
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
a:focus-visible,.button:focus-visible,.menu-button:focus-visible,.meet-arrow:focus-visible,.book-submit:focus-visible,.book-setter-ring:focus-visible,.book-setter-close:focus-visible,.book-setter-back:focus-visible,.review-pick:focus-visible,.offer-pick:focus-visible,.service-back:focus-visible,.social-pause:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid #000;outline-offset:3px}
@media (max-width:800px){
  html{scroll-padding-top:76px}
  .site-header{grid-template-columns:1fr auto;min-height:68px;padding:0 16px}
  .menu-button{justify-self:end}
  .header-cta{display:none}
  .banner-contact{max-width:none;padding-left:28px}
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
  .about-summary{grid-template-areas:"copy" "team";row-gap:22px}
  .about-copy h1{margin-bottom:16px}
  .about-pair{grid-template-columns:1fr;row-gap:18px}
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
  .landing>.hero-stage{margin-top:48px}
  .hero-head,.service-split,.split,.appoint,.book-layout,.foot,.info-grid,.shots{display:grid;grid-template-columns:1fr;width:auto}
  .wrap{width:min(100% - 32px,1180px)}
  .book-fields{grid-template-columns:1fr}
  .book-stage{min-height:0;display:grid;gap:0}
  .book-portrait{position:relative;inset:auto;min-height:240px;transform:none}
  .book-hours{position:relative;top:auto;right:auto;width:auto;transform:none}
  .hero-head{grid-template-columns:1fr;padding-top:36px;row-gap:18px;align-items:start}
  .hero-head h1,.hero-aside{grid-column:1;width:auto;max-width:none}
  .hero-head h1{grid-row:1}
  .hero-aside{grid-row:2;align-self:start}
  .title-arrow{display:none}
  .title-nudge{display:block}
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
  .hero-media img.fit-subject{top:0;right:0;bottom:0;left:0;width:100%;height:100%;object-fit:cover;object-position:center 42%;transform:none}
  .hero-media img.fit-facade{top:0;right:0;bottom:0;left:0;width:100%;height:100%;transform:translateY(-20%);object-position:center 62%}
  .hero-media:has(img.fit-facade)::after{background:linear-gradient(to top,var(--pale) 0%,var(--pale) 32%,color-mix(in srgb,var(--pale) 82%,transparent) 38%,color-mix(in srgb,var(--pale) 38%,transparent) 44%,color-mix(in srgb,var(--pale) 0%,transparent) 50%)}
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
  .meet-card > p:last-of-type{margin-bottom:24px}
  .meet-slide{grid-template-columns:1fr}
  .meet-photo,.meet-card{min-height:0}
  .meet-photo{min-height:240px}
  .meet-card{padding:24px 20px}
  .book-setter input,.book-setter textarea{font-size:16px}
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
  .hero-media img.fit-facade{top:0;right:0;bottom:0;left:0;width:100%;height:100%;transform:translateY(-18%);object-position:center 72%}
  .hero-media:has(img.fit-facade)::after{background:linear-gradient(to top,var(--pale) 0%,var(--pale) 32%,color-mix(in srgb,var(--pale) 82%,transparent) 38%,color-mix(in srgb,var(--pale) 38%,transparent) 44%,color-mix(in srgb,var(--pale) 0%,transparent) 50%)}
}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.rail,.geo,.about-orb,.meet-arrow,.review-pick,.review-photo,.review-quote,.social-pause,.nav-chevron,.offer-pick,.offer-shape,.offer-panel,.service-back-mark,.service-links button,.team-fall,.person-card,.hero-go{transition:none}.meet.is-animated .meet-slide{animation:none}.social-track{animation:none}.social-marquee{overflow-x:auto}.hero-cards{scroll-behavior:auto}.title-line{transform:none}.title-nudge path{animation:none;stroke-dashoffset:0}.book-setter-panel{transition:none}.book-setter-progress span{transition:none}}
.page:not(.service-page){position:relative}
.page:not(.service-page)>.guide-line{position:absolute;left:0;top:0;z-index:1;width:100%;height:100%;pointer-events:none}
.page:not(.service-page)>*:not(.guide-line){position:relative;z-index:2}
#home>.section.band,#home>.section.book,#home>.section.reviews{z-index:auto;background:transparent}
#home>.section.band::before,#home>.section.book::before,#home>.section.reviews::before{content:"";position:absolute;inset:0;z-index:0;pointer-events:none}
#home>.section.band::before,#home>.section.book::before{background:var(--pale)}
#home>.section.reviews::before{background:#f6f7f8}
#home>.section.band>*,#home>.section.book>*,#home>.section.reviews>*{position:relative;z-index:2}
#contact>.wrap{z-index:auto}
#contact .info-grid,#contact .split,#contact .info-card,#contact .sheet{position:relative;z-index:auto}
#contact .info-card,#contact .sheet{background:transparent}
#contact .info-card::before,#contact .sheet::before{content:"";position:absolute;inset:0;z-index:0;border-radius:inherit;background:#fff;pointer-events:none}
#contact>.wrap>.meet-kicker,#contact>.wrap>h1,#contact .info-card>*,#contact .sheet>*,#contact .side-media,#contact .map-frame,#contact .map-note{position:relative;z-index:2}
</style>
</head>
<body>
<div class="banner"><p class="banner-note">${banner} · Prepared by Parley Systems · Not the business’s official website</p>${bannerContact ? `<p class="banner-contact">${bannerContact}</p>` : ''}</div>
<a class="skip" href="#home">Skip to content</a>
<input id="nav-toggle" class="nav-toggle" type="checkbox" aria-label="Open menu">
<header class="site-header">
<div class="nav-left">
<a class="brand" href="#home">${logo}</a>
${headerLockup}
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
${guideLine}
<div class="landing">
<div class="wrap hero-head">
<h1>${e(s.copy.headline)}<span class="title-stop"></span></h1>
<div class="hero-aside">
<p class="lede">${e(heroIntroduction(s.copy.introduction)).replace(/\n/g, '<br>')}</p>
<div class="hero-book">
<a class="button" href="#contact">Book appointment</a>
<svg class="title-nudge" viewBox="0 0 72 40" aria-hidden="true"><path class="nudge-shaft" d="M68 30C56 32 38 28 18 10"/><path class="nudge-head" d="M18 10 23 21M18 10 30 13"/></svg>
</div>
</div>
<svg class="title-arrow" aria-hidden="true"><path class="title-shaft" fill="none" stroke="${accent}" stroke-width="1.9" stroke-linecap="round"/><path class="title-head" fill="none" stroke="${accent}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>
</div>
<div class="wrap hero-stage">
${heroMedia}
<div class="hero-cards">${heroCards}</div>
</div>
</div>
<section class="section">
<div class="wrap service-split" data-active="0">
<div class="service-side">
<p class="kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 4.2h10M3 8h10M3 11.8h6.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg> Services</p>
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
<label>First name*<input name="given-name" autocomplete="given-name" placeholder="Enter first name" required></label>
<label>Last name*<input name="family-name" autocomplete="family-name" placeholder="Enter last name" required></label>
<label>Email*<input name="email" type="email" autocomplete="email" placeholder="name@example.com" required></label>
<label>Phone<input name="tel" type="tel" autocomplete="tel" placeholder="Enter a phone number"></label>
<label class="book-date"><span>Appointment date*</span><span class="date-field">${calendarIcon}<input name="date" placeholder="DD / MM / YYYY" required></span></label>
<label class="book-time"><span>Preferred time*</span><span class="date-field">${clockIcon}<input name="time" placeholder="HH:MM" required></span></label>
<label class="span">Message*<textarea name="message" placeholder="Type message here..." required></textarea></label>
<input type="hidden" name="patient" value="">
<input type="hidden" name="enquiry" value="">
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
${socialBand}
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
</section>
<section id="services" class="page services-page">
${guideLine}
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
${guideLine}
<div class="wrap about-summary">
<div class="about-copy">
<p class="meet-kicker"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M2.8 13.4V6.4L8 3.2l5.2 3.2v7" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M6.4 13.4V9h3.2v4.4" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg> About</p>
<h1>${name}</h1>
<div class="about-pair">
<div class="about-lead"><p class="lede">${aboutSummary}</p></div>
${aboutPhoto}
</div>
<a class="about-next" href="#meet-team"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.2 6.1 8 10.6l4.8-4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Get to know the specialists</span></a>
</div>
<p class="meet-kicker about-team" id="meet-team"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="5.4" cy="5.1" r="1.55" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="10.6" cy="5.1" r="1.55" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2.4 12.4c.35-1.7 1.5-2.6 3-2.6s2.65.9 3 2.6M7.6 12.4c.35-1.7 1.5-2.6 3-2.6s2.65.9 3 2.6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg> Meet the Team</p>
</div>
${people.length ? `<div class="wrap team-board" data-person="0"><div class="team-rail" aria-hidden="true"><span class="team-fall"></span></div><div class="people">${personCards}</div></div>` : '<div class="wrap"><p class="pending">No individual team members were published, so none are shown here.</p></div>'}
</section>
<section id="contact" class="page">
${guideLine}
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
<a class="footer-brand" href="#home"><span class="footer-pill">${footerMark}${headerWords}</span></a>
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
<aside class="book-setter" aria-label="Appointment and enquiry setter">
<button class="book-setter-ring${s.sector === 'dental' ? ' has-word' : ''}" type="button" aria-expanded="false" aria-controls="book-setter-panel"><svg viewBox="0 0 48 48" width="28" height="28" aria-hidden="true"><rect x="9" y="12" width="30" height="26" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 20h30M17 8v8M31 8v8M24 26v8M20 30h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span class="book-setter-label">Request an appointment</span>${s.sector === 'dental' ? '<span class="book-setter-word" aria-hidden="true">BOOK</span>' : ''}</button>
<div class="book-setter-panel" id="book-setter-panel" inert>
<div class="book-setter-cover">
<svg viewBox="0 0 48 48" width="32" height="32" aria-hidden="true"><rect x="9" y="12" width="30" height="26" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 20h30M17 8v8M31 8v8M24 26v8M20 30h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
<h2 class="book-setter-title" id="book-setter-title">Appointment &amp; Enquiry Setter</h2>
<button class="book-setter-close" type="button" aria-label="Close"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
</div>
<div class="book-setter-progress" role="progressbar" aria-valuemin="1" aria-valuemax="4" aria-valuenow="1" aria-label="Step progress"><span></span></div>
<div class="book-setter-steps">
<section class="book-step" data-step="1">
<p class="book-step-count">1 of 4</p>
<label>First name*<input data-field="given-name" autocomplete="given-name" placeholder="Enter first name"></label>
<label>Second name*<input data-field="family-name" autocomplete="family-name" placeholder="Enter second name"></label>
<fieldset>
<legend>New or existing patient*</legend>
<label class="book-choice"><input type="radio" name="setter-patient" value="New patient">New patient</label>
<label class="book-choice"><input type="radio" name="setter-patient" value="Existing patient">Existing patient</label>
</fieldset>
</section>
<section class="book-step" data-step="2" hidden>
<p class="book-step-count">2 of 4</p>
<fieldset>
<legend>Appointment or enquiry type*</legend>
${enquiryFields}
</fieldset>
<label>Description (optional)<textarea data-field="message" placeholder="A short note, if you want to add one"></textarea></label>
</section>
<section class="book-step" data-step="3" hidden>
<p class="book-step-count">3 of 4</p>
<label class="book-choice"><input type="radio" name="setter-timing" value="Applicable" checked>Applicable</label>
<label class="book-choice"><input type="radio" name="setter-timing" value="Not applicable">Not applicable</label>
<label>Preferred appointment date*<input data-field="date" placeholder="DD / MM / YYYY"></label>
<label>Preferred appointment time*<input data-field="time" placeholder="HH:MM"></label>
</section>
<section class="book-step" data-step="4" hidden>
<p class="book-step-count">4 of 4</p>
<label>Email*<input data-field="email" type="email" autocomplete="email" placeholder="name@example.com"></label>
<label>Phone<input data-field="tel" type="tel" autocomplete="tel" placeholder="Enter a phone number"></label>
<p class="book-setter-note">We will aim to confirm appointment time within 1 working day.</p>
<p class="book-setter-done" hidden>This preview does not send a request.</p>
</section>
</div>
<p class="book-setter-error" hidden></p>
<div class="book-setter-nav">
<button class="book-setter-back" type="button" hidden>Back</button>
<button class="book-submit book-setter-next" type="button">Next</button>
</div>
</div>
</aside>
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
  slides.forEach(slide => slide.addEventListener('animationend', event => {
    if (event.target !== slide) return;
    slide.classList.remove('play-in-next', 'play-in-prev', 'play-out-next', 'play-out-prev');
  }));
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
    window.setTimeout(() => {
      outgoing.classList.remove('play-in-next', 'play-in-prev', 'play-out-next', 'play-out-prev');
      incoming.classList.remove('play-in-next', 'play-in-prev', 'play-out-next', 'play-out-prev');
    }, 600);
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
<script id="guide-draw">
(function () {
  var svg = null;
  function visiblePage() {
    var pages = document.querySelectorAll('.page:not(.service-page)');
    for (var i = 0; i < pages.length; i++) {
      if (getComputedStyle(pages[i]).display !== 'none') return pages[i];
    }
    return null;
  }
  var ns = 'http://www.w3.org/2000/svg';
  function node(name, attrs, parent) {
    var el = document.createElementNS(ns, name);
    Object.keys(attrs).forEach(function (key) { el.setAttribute(key, attrs[key]); });
    (parent || svg).appendChild(el);
    return el;
  }
  function smooth(pts) {
    var d = 'M' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[Math.max(0, i - 1)];
      var p1 = pts[i];
      var p2 = pts[i + 1];
      var p3 = pts[Math.min(pts.length - 1, i + 2)];
      d += 'C' + (p1.x + (p2.x - p0.x) / 7).toFixed(1) + ' ' + (p1.y + (p2.y - p0.y) / 7).toFixed(1) + ' ' + (p2.x - (p3.x - p1.x) / 7).toFixed(1) + ' ' + (p2.y - (p3.y - p1.y) / 7).toFixed(1) + ' ' + p2.x.toFixed(1) + ' ' + p2.y.toFixed(1);
    }
    return d;
  }
  function wavePath(dx) {
    var page = svg.parentNode;
    var w = page.offsetWidth;
    var h = page.offsetHeight;
    if (w < 80 || h < 120) return '';
    var edge = Math.min(32, w * 0.03);
    var tune = {
      services: { phase: 0.15, period: 920, reach: 0.26, center: 0.6 },
      about: { phase: 2.7, period: 1040, reach: 0.23, center: 0.36 },
      contact: { phase: 1.45, period: 1240, reach: 0.28, center: 0.5 },
      reviews: { phase: 4.35, period: 820, reach: 0.25, center: 0.72 },
      prices: { phase: 5.5, period: 880, reach: 0.22, center: 0.4 }
    }[page.id];
    var pts = [];
    for (var y = 36; y < h - 20; y += 56) {
      var swing;
      var center = 0.5;
      var reach = w * 0.5 + edge * 0.8;
      if (tune) {
        center = tune.center;
        reach = w * tune.reach;
        swing = Math.sin(y / tune.period * Math.PI * 2 + tune.phase);
        swing += 0.28 * Math.sin(y / (tune.period * 0.58) * Math.PI * 2 + tune.phase * 1.6);
      } else {
        swing = Math.sin(y / h * Math.PI * 3.15 + 0.7);
      }
      var x = w * center + swing * reach;
      if (x < -edge) x = -edge;
      if (x > w + edge) x = w + edge;
      pts.push({ x: x + dx, y: y });
    }
    if (pts.length < 4) return '';
    return smooth(pts);
  }
  function draw() {
    var page = visiblePage();
    if (!page) return;
    svg = page.querySelector('.guide-line');
    if (!svg) return;
    var w = page.offsetWidth;
    var h = page.offsetHeight;
    var stamp = page.id || 'page';
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var defs = node('defs', {});
    var fade = node('linearGradient', { id: 'guide-fade-' + stamp, gradientUnits: 'userSpaceOnUse', x1: '0', y1: '0', x2: '0', y2: String(h) }, defs);
    node('stop', { offset: '0', 'stop-color': '#000' }, fade);
    node('stop', { offset: '0.045', 'stop-color': '#fff' }, fade);
    node('stop', { offset: '0.955', 'stop-color': '#fff' }, fade);
    node('stop', { offset: '1', 'stop-color': '#000' }, fade);
    var mask = node('mask', { id: 'guide-mask-' + stamp }, defs);
    node('rect', { x: '0', y: '0', width: String(w), height: String(h), fill: 'url(#guide-fade-' + stamp + ')' }, mask);
    var blur = node('filter', { id: 'guide-soft-' + stamp, x: '-40%', y: '-8%', width: '180%', height: '116%' }, defs);
    node('feGaussianBlur', { stdDeviation: '3.2' }, blur);
    var group = node('g', { mask: 'url(#guide-mask-' + stamp + ')' });
    [
      { dx: 0, stroke: '${waveHalo}', width: '12', opacity: '0.28', filter: 'url(#guide-soft-' + stamp + ')' },
      { dx: 14, stroke: '${waveMid}', width: '1.5', opacity: '0.16' },
      { dx: -12, stroke: '${waveSoft}', width: '1.05', opacity: '0.14' },
      { dx: 8, stroke: '${accent}', width: '0.9', opacity: '0.16' },
      { dx: 0, stroke: '${accent}', width: '1.05', opacity: '0.28' }
    ].forEach(function (layer) {
      var attrs = { fill: 'none', stroke: layer.stroke, 'stroke-width': layer.width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: layer.opacity, d: wavePath(layer.dx) };
      if (layer.filter) attrs.filter = layer.filter;
      node('path', attrs, group);
    });
  }
  var kick = function () { requestAnimationFrame(draw); };
  window.addEventListener('resize', kick);
  window.addEventListener('hashchange', kick);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(kick);
  kick();
})();
</script>
<script id="title-draw">
(function () {
  var head = document.querySelector('#home .hero-head');
  if (!head) return;
  var svg = head.querySelector('.title-arrow');
  var shaft = svg.querySelector('.title-shaft');
  var arrowHead = svg.querySelector('.title-head');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var narrowQuery = window.matchMedia('(max-width: 800px)');
  var intro = null;
  var bars = [];
  function hide() {
    shaft.setAttribute('d', '');
    arrowHead.setAttribute('d', '');
  }
  function showFull() {
    shaft.style.strokeDasharray = 'none';
    shaft.style.strokeDashoffset = '0';
    arrowHead.style.strokeDasharray = 'none';
    arrowHead.style.strokeDashoffset = '0';
    bars.forEach(function (bar) { bar.style.transform = 'scaleX(1)'; });
  }
  function lineBoxes() {
    var h1 = head.querySelector('h1');
    var stop = head.querySelector('.title-stop');
    if (!h1 || !stop) return [];
    var range = document.createRange();
    range.setStart(h1, 0);
    range.setEndBefore(stop);
    var lines = [];
    Array.from(range.getClientRects()).forEach(function (rect) {
      if (rect.width < 2) return;
      var last = lines[lines.length - 1];
      if (last && Math.abs(last.top - rect.top) < 3) {
        last.left = Math.min(last.left, rect.left);
        last.right = Math.max(last.right, rect.right);
        last.bottom = Math.max(last.bottom, rect.bottom);
        last.top = Math.min(last.top, rect.top);
      } else {
        lines.push({ left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom });
      }
    });
    return lines;
  }
  function inkSegments(line) {
    var h1 = head.querySelector('h1');
    var stop = head.querySelector('.title-stop');
    var fallback = [{ left: line.left, right: line.right, top: line.top, bottom: line.bottom }];
    if (!h1) return fallback;
    var walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT, null);
    var glyphs = [];
    var node;
    while ((node = walker.nextNode())) {
      if (stop && stop.contains(node)) continue;
      var text = node.textContent || '';
      for (var i = 0; i < text.length; i++) {
        var range = document.createRange();
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        var rect = range.getBoundingClientRect();
        if (rect.width < 0.4) continue;
        var mid = (rect.top + rect.bottom) / 2;
        if (Math.abs(mid - (line.top + line.bottom) / 2) > (line.bottom - line.top) * 0.55) continue;
        glyphs.push({ left: rect.left, right: rect.right, hang: /[gjpqy]/.test(text.charAt(i)) });
      }
    }
    if (!glyphs.length) return fallback;
    var em = (line.bottom - line.top) / 1.2;
    var pad = Math.max(2, em * 0.08);
    var runs = [];
    var afterHang = false;
    glyphs.forEach(function (glyph) {
      if (glyph.hang) {
        var open = runs[runs.length - 1];
        if (open) open.right = Math.min(open.right, glyph.left - pad);
        afterHang = true;
        return;
      }
      var left = glyph.left + (afterHang ? pad : 0);
      afterHang = false;
      var prev = runs[runs.length - 1];
      if (prev && left - prev.right < em * 0.55) prev.right = Math.max(prev.right, glyph.right);
      else runs.push({ left: left, right: glyph.right, top: line.top, bottom: line.bottom });
    });
    runs = runs.filter(function (run) { return run.right - run.left > 2; });
    return runs.length ? runs : fallback;
  }
  function placeLines(hr) {
    var lines = lineBoxes();
    var segments = [];
    lines.forEach(function (line, lineIndex) {
      inkSegments(line).forEach(function (segment) {
        segment.lineIndex = lineIndex;
        segments.push(segment);
      });
    });
    if (bars.length !== segments.length) {
      bars.forEach(function (bar) { bar.remove(); });
      if (intro) intro.cancel();
      shaft.getAnimations().forEach(function (item) { item.cancel(); });
      arrowHead.getAnimations().forEach(function (item) { item.cancel(); });
      intro = null;
      bars = segments.map(function () {
        var bar = document.createElement('span');
        bar.className = 'title-line';
        bar.setAttribute('aria-hidden', 'true');
        head.appendChild(bar);
        return bar;
      });
    }
    segments.forEach(function (segment, index) {
      var bar = bars[index];
      bar.dataset.line = String(segment.lineIndex);
      bar.style.left = (segment.left - hr.left) + 'px';
      bar.style.width = (segment.right - segment.left) + 'px';
      bar.style.top = (segment.bottom - hr.top - (segment.bottom - segment.top) * 0.22 + 4) + 'px';
    });
    return lines;
  }
  function paint() {
    if (getComputedStyle(document.getElementById('home')).display === 'none') return;
    var button = head.querySelector('.hero-book .button');
    var hr = head.getBoundingClientRect();
    var br = button.getBoundingClientRect();
    var lines = placeLines(hr);
    if (!lines.length || br.width < 1) return;
    var last = lines[lines.length - 1];
    if (narrowQuery.matches) {
      hide();
      if (reduce) showFull();
      else if (!bars[0].getAnimations().length) {
        bars.forEach(function (bar) {
          var lineIndex = Number(bar.dataset.line || 0);
          bar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 760, delay: 2150 + lineIndex * 900, easing: 'ease', fill: 'forwards' });
        });
      }
      return;
    }
    var x1 = last.right - hr.left + 10;
    var y1 = last.bottom - hr.top - (last.bottom - last.top) * 0.22 + 4;
    var x2 = br.left - hr.left - 16;
    var y2 = br.top - hr.top + br.height / 2;
    var reach = 0.56;
    var pad = (1 - reach) / 2;
    var spanX = x2 - x1;
    var spanY = y2 - y1;
    x1 += spanX * pad;
    y1 += spanY * pad;
    x2 -= spanX * pad;
    y2 -= spanY * pad;
    if (x2 < x1 + 36) {
      hide();
      return;
    }
    var dx = x2 - x1;
    var dy = y2 - y1;
    var drop = Math.max(26, Math.min(42, dx * 0.15));
    var cx = x1 + dx * 0.5;
    var cy = y1 + dy * 0.5 + drop;
    var tx = x2 - cx;
    var ty = y2 - cy;
    var mag = Math.hypot(tx, ty) || 1;
    tx /= mag;
    ty /= mag;
    var px = -ty;
    var py = tx;
    var shaftEndX = x2 - tx * 1.2;
    var shaftEndY = y2 - ty * 1.2;
    shaft.setAttribute('d', 'M ' + x1 + ' ' + y1 + ' Q ' + cx + ' ' + cy + ' ' + shaftEndX + ' ' + shaftEndY);
    var hx = x2 - tx * 10.5;
    var hy = y2 - ty * 10.5;
    arrowHead.setAttribute('d', 'M ' + (hx + px * 5.2) + ' ' + (hy + py * 5.2) + ' L ' + x2 + ' ' + y2 + ' L ' + (hx - px * 5.2) + ' ' + (hy - py * 5.2));
    if (reduce || (intro && intro.playState === 'finished')) {
      showFull();
      return;
    }
    if (intro) return;
    var len = shaft.getTotalLength();
    var headLen = arrowHead.getTotalLength();
    shaft.style.strokeDasharray = String(len);
    shaft.style.strokeDashoffset = String(len);
    arrowHead.style.strokeDasharray = String(headLen);
    arrowHead.style.strokeDashoffset = String(headLen);
    var arrowDelay = 2150 + Math.max(0, lines.length - 1) * 900 + 950;
    bars.forEach(function (bar) {
      var lineIndex = Number(bar.dataset.line || 0);
      if (!bar.getAnimations().length) bar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 760, delay: 2150 + lineIndex * 900, easing: 'ease', fill: 'forwards' });
    });
    intro = shaft.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 650, delay: arrowDelay, easing: 'ease', fill: 'forwards' });
    arrowHead.animate([{ strokeDashoffset: headLen }, { strokeDashoffset: 0 }], { duration: 220, delay: arrowDelay + 580, easing: 'ease', fill: 'forwards' });
  }
  var kick = function () { requestAnimationFrame(paint); };
  window.addEventListener('resize', kick);
  window.addEventListener('hashchange', kick);
  narrowQuery.addEventListener('change', kick);
  if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(kick);
  else kick();
})();
</script>
<script id="book-setter-sync">
(function () {
  var widget = document.querySelector('.book-setter');
  var form = document.querySelector('.section.book .book-form');
  if (!widget || !form) return;
  var ring = widget.querySelector('.book-setter-ring');
  var panel = widget.querySelector('.book-setter-panel');
  var closeButton = widget.querySelector('.book-setter-close');
  var back = widget.querySelector('.book-setter-back');
  var next = widget.querySelector('.book-setter-next');
  var error = widget.querySelector('.book-setter-error');
  var steps = [].slice.call(widget.querySelectorAll('.book-step'));
  var step = 0;
  var keys = ['given-name', 'family-name', 'email', 'tel', 'date', 'time', 'message'];
  function field(key) { return widget.querySelector('[data-field="' + key + '"]'); }
  function copy(from, to) { if (to && !to.disabled && to.value !== from.value) to.value = from.value; }
  keys.forEach(function (key) {
    var source = form.querySelector('[name="' + key + '"]');
    var mirror = field(key);
    if (!source || !mirror) return;
    source.addEventListener('input', function () { if (!mirror.disabled) copy(source, mirror); });
    mirror.addEventListener('input', function () { copy(mirror, source); });
  });
  function chosen(name) {
    var input = widget.querySelector('input[name="' + name + '"]:checked');
    return input ? input.value : '';
  }
  function syncChoices() {
    var patient = form.querySelector('[name="patient"]');
    var enquiry = form.querySelector('[name="enquiry"]');
    if (patient) patient.value = chosen('setter-patient');
    if (enquiry) enquiry.value = chosen('setter-enquiry');
  }
  widget.querySelectorAll('input[name="setter-patient"], input[name="setter-enquiry"]').forEach(function (input) {
    input.addEventListener('change', syncChoices);
  });
  function timingOff() { return chosen('setter-timing') === 'Not applicable'; }
  function applySkip() {
    var off = timingOff();
    ['date', 'time'].forEach(function (key) {
      var mirror = field(key);
      var source = form.querySelector('[name="' + key + '"]');
      if (!mirror) return;
      mirror.disabled = off;
      if (off) {
        mirror.value = '';
        if (source) source.value = 'Not applicable';
      } else if (source && source.value === 'Not applicable') {
        source.value = mirror.value;
      }
    });
  }
  widget.querySelectorAll('input[name="setter-timing"]').forEach(function (input) {
    input.addEventListener('change', applySkip);
  });
  function show(index, moveFocus) {
    step = index;
    steps.forEach(function (section, i) { section.hidden = i !== index; });
    if (back) back.hidden = index === 0;
    if (next) {
      next.hidden = false;
      next.disabled = false;
      next.textContent = index === steps.length - 1 ? 'Request appointment' : 'Next';
    }
    if (error) error.hidden = true;
    var bar = widget.querySelector('.book-setter-progress');
    var fill = bar ? bar.querySelector('span') : null;
    if (bar && fill) {
      bar.setAttribute('aria-valuenow', String(index + 1));
      fill.style.width = ((index + 1) / steps.length * 100) + '%';
    }
    var done = steps[index].querySelector('.book-setter-done');
    if (done) done.hidden = true;
    if (moveFocus && !window.matchMedia('(max-width: 800px)').matches) {
      var focusable = steps[index].querySelector('input:not(:disabled), textarea');
      if (focusable) focusable.focus();
    }
  }
  function problem() {
    if (step === 0) {
      if (!field('given-name').value.trim() || !field('family-name').value.trim() || !chosen('setter-patient')) return 'Add your first name, second name, and whether you are a new or existing patient.';
    }
    if (step === 1 && !chosen('setter-enquiry')) return 'Choose an appointment or enquiry type.';
    if (step === 2 && !timingOff() && (!field('date').value.trim() || !field('time').value.trim())) return 'Add a preferred date and time, or choose not applicable.';
    if (step === 3) {
      var email = field('email');
      if (!email.value.trim() || (email.validity && email.validity.typeMismatch)) return 'Add an email address.';
    }
    return '';
  }
  function setOpen(open) {
    var was = widget.classList.contains('is-open');
    widget.classList.toggle('is-open', open);
    if (ring) ring.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!panel) return;
    panel.toggleAttribute('inert', !open);
    if (open) show(step, true);
    else if (was && ring) ring.focus();
  }
  if (ring) ring.addEventListener('click', function () { setOpen(!widget.classList.contains('is-open')); });
  if (closeButton) closeButton.addEventListener('click', function () { setOpen(false); });
  if (back) back.addEventListener('click', function () { if (step > 0) show(step - 1, true); });
  if (next) next.addEventListener('click', function () {
    var message = problem();
    if (message) {
      error.textContent = message;
      error.hidden = false;
      return;
    }
    syncChoices();
    applySkip();
    if (step < steps.length - 1) {
      show(step + 1, true);
      return;
    }
    var done = steps[step].querySelector('.book-setter-done');
    if (done) done.hidden = false;
    next.disabled = true;
  });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape') setOpen(false); });
  document.addEventListener('click', function (event) { if (!widget.contains(event.target)) setOpen(false); });
  show(0, false);
})();
</script>
</body>
</html>
`;
}
