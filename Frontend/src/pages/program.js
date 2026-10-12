const programs = require('../../data/programs');
const content = require('../../data/content');
const { site, esc, img, src, icon, absUrl } = require('../util');
const { breadcrumbs, breadcrumbSchema } = require('../layout');
const { sectionHead, intensity, programCard, trainerCard, scheduleTabs, enquirySection, trainerBySlug } = require('../components');

module.exports = function programPage(p) {
  const path = `/programs/${p.slug}/`;
  const crumbs = [{ name: 'Programs', path: '/programs/' }, { name: p.name, path }];
  const hasClasses = Object.values(content.schedule).some((d) => d.some((s) => s.program === p.slug));
  const related = programs.filter((x) => x.slug !== p.slug && (x.category === p.category || x.featured)).slice(0, 3);
  const coaches = p.trainers.map((s) => trainerBySlug[s]).filter(Boolean);

  const sections = [
    ['overview', 'Overview'], ['expect', 'What to expect'], ['gallery', 'Gallery'],
    ...(hasClasses ? [['timings', 'Timings']] : []), ['coaches', 'Coaches'], ['faqs', 'FAQs'],
  ];

  const body = `
<section class="project-hero">
  <div class="project-hero-bg">${img(p.hero, p.name, { w: 1600, sizes: '100vw', eager: true })}</div>
  <div class="container project-hero-content">
    ${breadcrumbs(crumbs)}
    <span class="tag">${esc(p.category)}</span>
    <h1>${esc(p.name)}</h1>
    <p class="project-hero-tagline">${esc(p.tagline)}</p>
    <div class="project-hero-bar">
      <div class="hero-facts">
        <div><small>Duration</small><strong>${esc(p.duration)}</strong></div>
        <div><small>Level</small><strong>${esc(p.level)}</strong></div>
        <div><small>Calories*</small><strong>${esc(p.calories)}</strong></div>
        <div><small>Intensity</small>${intensity(p.intensity)}</div>
      </div>
      <div class="project-hero-ctas">
        <button class="btn btn--accent" data-open="trial-modal" data-interest="${esc(p.name)}">Try it free</button>
        <a class="btn btn--outline-light" href="https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hi, I'd like to know more about ${p.name}.`)}" target="_blank" rel="noopener">${icon('whatsapp', 18)} Ask on WhatsApp</a>
      </div>
    </div>
  </div>
</section>

<nav class="subnav" aria-label="Program sections" data-subnav>
  <div class="container subnav-inner">
    <ul>${sections.map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join('')}</ul>
    <button class="btn btn--accent btn--sm" data-open="trial-modal" data-interest="${esc(p.name)}">Book free trial</button>
  </div>
</nav>

<section class="section" id="overview">
  <div class="container overview-grid">
    <div class="reveal">
      <p class="eyebrow">Overview</p>
      <h2>${esc(p.summary)}</h2>
      ${p.description.map((d) => `<p class="lead">${esc(d)}</p>`).join('')}
      <h3 class="mt">Who it's for</h3>
      <ul class="check-list">${p.whoFor.map((w) => `<li>${icon('check', 18)} ${esc(w)}</li>`).join('')}</ul>
    </div>
    <aside class="highlights reveal">
      <h3>Benefits</h3>
      <ul class="check-list">${p.benefits.map((b) => `<li>${icon('zap', 18)} ${esc(b)}</li>`).join('')}</ul>
      <button class="btn btn--accent btn--block" data-open="membership-modal" data-interest="${esc(p.name)}">Join this program</button>
    </aside>
  </div>
</section>

<section class="section section--dark" id="expect">
  <div class="container">
    ${sectionHead('How it works', 'What to expect', '')}
    <ol class="steps">
      ${p.expect.map(([t, d], i) => `<li class="reveal"><span class="step-num">${String(i + 1).padStart(2, '0')}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}
    </ol>
  </div>
</section>

<section class="section" id="gallery">
  <div class="container">
    ${sectionHead('Gallery', 'Inside the session', '')}
    <div class="gallery">
      ${[p.hero, ...p.gallery].slice(0, 5).map((g, i) => `
      <a class="gallery-item${i === 0 ? ' gallery-item--wide' : ''} reveal" href="${src(g, 1600)}" data-lightbox>${img(g, `${p.name} — photo ${i + 1}`, { w: i === 0 ? 1200 : 600, sizes: i === 0 ? '(min-width: 900px) 66vw, 100vw' : '(min-width: 900px) 33vw, 50vw' })}</a>`).join('')}
    </div>
  </div>
</section>

${hasClasses ? `
<section class="section section--alt" id="timings">
  <div class="container">
    ${sectionHead('Timings', `${esc(p.name)} class times`, 'Members can join any class at no extra cost. Trial visitors are welcome too.')}
    ${scheduleTabs({ only: p.slug })}
  </div>
</section>` : ''}

<section class="section" id="coaches">
  <div class="container">
    ${sectionHead('Coaches', 'Who you\'ll train with', '')}
    <div class="trainer-grid">${coaches.map((t) => trainerCard(t)).join('')}</div>
  </div>
</section>

<section class="section section--alt" id="faqs">
  <div class="container narrow">
    ${sectionHead('FAQs', 'Questions about ' + esc(p.name), '')}
    <div class="faq">${p.faqs.map((f) => `<details class="reveal"><summary>${esc(f.q)}${icon('chevron-down', 20)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>
    <p class="fine center">*Calorie estimates are typical ranges and vary with body weight, effort and fitness level.</p>
  </div>
</section>

<section class="section">
  <div class="container">
    ${sectionHead('Also try', 'Related programs', '')}
    <div class="program-grid">${related.map((r) => programCard(r)).join('')}</div>
  </div>
</section>

${enquirySection({ interest: p.slug, title: `Try ${esc(p.name)} free` })}

<div class="sticky-enquire" data-sticky-enquire>
  <div class="sticky-enquire-info"><strong>${esc(p.name)}</strong><span>Free trial · no payment needed</span></div>
  <a class="btn btn--outline-light btn--sm" href="tel:${site.phoneRaw}">${icon('phone', 16)}<span>Call</span></a>
  <button class="btn btn--accent btn--sm" data-open="trial-modal" data-interest="${esc(p.name)}">Free trial</button>
</div>`;

  return {
    path,
    title: `${p.name} in Gurugram — ${p.tagline}`,
    description: `${p.summary} ${p.duration} sessions, ${p.level.toLowerCase()}. Book a free ${p.name} trial at ${site.name}, Gurugram.`,
    image: src(p.hero, 1200, 630),
    bodyClass: 'page-project',
    interest: p.slug,
    topic: p.name,
    body,
    schema: [
      breadcrumbSchema(crumbs),
      {
        '@type': 'Service', name: p.name, serviceType: p.category, description: p.summary, url: absUrl(path), image: src(p.hero, 1200),
        provider: { '@id': `${site.url}/#org` }, areaServed: 'Gurugram',
      },
      { '@type': 'FAQPage', mainEntity: p.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    ],
  };
};
