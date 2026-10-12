const programs = require('../../data/programs');
const content = require('../../data/content');
const posts = require('../../data/blog');
const { site, esc, img, src, icon, fmtDate, FACILITY_LABELS } = require('../util');
const { sectionHead, programCard, planCard, trainerCard, scheduleTabs, enquirySection, programBySlug } = require('../components');

module.exports = function home() {
  const featured = programs.filter((p) => p.featured);

  const slides = content.heroSlides
    .map((s, i) => {
      const p = programBySlug[s.program];
      return `
    <div class="hero-slide${i === 0 ? ' is-active' : ''}" data-slide aria-hidden="${i !== 0}">
      ${img(s.image, p.name, { w: 1600, sizes: '100vw', eager: i === 0, cls: 'hero-img' })}
      <div class="hero-slide-meta">
        <span>${esc(s.kicker)}</span>
        <a href="/programs/${p.slug}/">${esc(p.name)} · ${esc(p.tagline)} ${icon('arrow-right', 16)}</a>
      </div>
    </div>`;
    })
    .join('');

  const body = `
<section class="hero" data-hero-slider>
  <div class="hero-slides">${slides}</div>
  <div class="hero-overlay"></div>
  <div class="container hero-content">
    <p class="eyebrow eyebrow--light rise">Gurugram · Open 7 days</p>
    <h1 class="rise">Train harder.<br><em>Rise higher.</em></h1>
    <p class="hero-sub rise">Coached strength training, high-energy group classes and personal training — with certified coaches on the floor every hour we're open.</p>
    <div class="hero-ctas rise">
      <button class="btn btn--accent btn--lg" data-open="trial-modal">Book a Free Trial</button>
      <a href="/membership/" class="btn btn--outline-light btn--lg">View Membership Plans</a>
    </div>
  </div>
  <div class="container hero-controls">
    <div class="hero-dots" role="tablist" aria-label="Featured programs">
      ${content.heroSlides.map((s, i) => `<button role="tab" aria-label="Slide ${i + 1}: ${esc(programBySlug[s.program].name)}" aria-selected="${i === 0}" data-dot="${i}"></button>`).join('')}
    </div>
  </div>
</section>

<section class="stats stats--bar" aria-label="Key numbers">
  <div class="container stats-grid">
    ${content.stats.map((s) => `
    <div class="stat reveal">
      <strong><span data-count="${s.value}">0</span>${s.suffix}</strong>
      <span>${s.label}</span>
    </div>`).join('')}
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head-row">
      ${sectionHead('Programs', 'Find the training that fits you', '', false)}
      <div class="carousel-nav" data-carousel-nav="featured">
        <button aria-label="Previous programs" data-prev>${icon('chevron-left')}</button>
        <button aria-label="Next programs" data-next>${icon('chevron-right')}</button>
      </div>
    </div>
    <div class="carousel" data-carousel="featured" tabindex="0" aria-label="Featured programs carousel">
      ${featured.map((p) => programCard(p, { sizes: '(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 85vw' })).join('')}
    </div>
    <p class="center"><a class="btn btn--outline" href="/programs/">All programs</a></p>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    ${sectionHead('Why Cyber Heights', 'More than a place to work out', 'Coaching, equipment and support that turn a membership into results.')}
    <div class="why-grid">
      ${content.whyUs.map((w) => `
      <div class="why-card reveal">
        <span class="why-icon">${icon(w.icon, 28)}</span>
        <h3>${w.title}</h3>
        <p>${w.text}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="section section--dark">
  <div class="container">
    ${sectionHead('Facilities', 'Everything you need under one roof', '')}
    <ul class="amenities">
      ${content.facilities.map((f) => `<li class="reveal">${icon(f, 30)}<span>${FACILITY_LABELS[f]}</span></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section">
  <div class="container">
    ${sectionHead('Membership', 'Simple plans. No hidden fees.', 'Every plan includes full gym access, group classes and a free fitness assessment.')}
    <div class="plan-grid">${content.plans.map(planCard).join('')}</div>
    <p class="center"><a class="link-arrow" href="/membership/">Compare plans &amp; personal-training packs ${icon('arrow-right', 16)}</a></p>
  </div>
</section>

<section class="section section--alt split-feature">
  <div class="container split-grid">
    <div class="split-media reveal">${img('photo-1583454110551-21f2fa2afe61', 'Coach guiding a member through a dumbbell exercise', { w: 900, ratio: 4 / 5, sizes: '(min-width: 900px) 45vw, 100vw' })}</div>
    <div class="split-copy reveal">
      <p class="eyebrow">Our approach</p>
      <h2>Coaching first. Equipment second.</h2>
      <p>Anyone can buy machines. What makes the difference is a coach who knows your name, checks your form and adjusts your plan when life gets busy. Every Cyber Heights membership starts with an assessment and a plan — and our coaches stay on the floor to keep you on it.</p>
      <ul class="check-list">
        <li>${icon('check', 18)} Free assessment &amp; body-composition scan on joining</li>
        <li>${icon('check', 18)} A written plan for your first 4 weeks</li>
        <li>${icon('check', 18)} Monthly progress check-ins</li>
      </ul>
      <a href="/about/" class="link-arrow">About the gym ${icon('arrow-right', 16)}</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head-row">
      ${sectionHead('Class schedule', 'This week at Cyber Heights', '', false)}
      <a class="link-arrow" href="/schedule/">Full timetable ${icon('arrow-right', 16)}</a>
    </div>
    ${scheduleTabs()}
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    ${sectionHead('Transformations', 'Real members. Real results.', '')}
    <div class="transform-grid">
      ${content.transformations.map((t) => `
      <figure class="transform-card reveal">
        ${img(t.image, `${t.name} — ${t.program}`, { w: 600, ratio: 4 / 5, sizes: '(min-width: 900px) 33vw, 100vw' })}
        <figcaption><strong>${esc(t.result)}</strong><span>${esc(t.name)} · ${t.weeks} weeks · ${esc(t.program)}</span></figcaption>
      </figure>`).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head-row">
      ${sectionHead('Coaches', 'Meet the team', '', false)}
      <a class="link-arrow" href="/trainers/">All trainers ${icon('arrow-right', 16)}</a>
    </div>
    <div class="trainer-grid">${content.trainers.slice(0, 3).map((t) => trainerCard(t)).join('')}</div>
  </div>
</section>

<section class="section section--dark testimonials">
  <div class="container">
    ${sectionHead('Member stories', 'Why members stay', '')}
    <div class="testimonial-slider" data-testimonials>
      ${content.testimonials.map((t, i) => `
      <figure class="testimonial${i === 0 ? ' is-active' : ''}" data-testimonial aria-hidden="${i !== 0}">
        <div class="stars" role="img" aria-label="5 out of 5 stars">${icon('star', 18).repeat(5)}</div>
        <blockquote>“${t.quote}”</blockquote>
        <figcaption>
          ${img(t.image, t.name, { w: 120, ratio: 1, sizes: '64px' })}
          <div><strong>${t.name}</strong><span>${t.role} · ${t.program}</span></div>
        </figcaption>
      </figure>`).join('')}
      <div class="testimonial-nav">
        <button aria-label="Previous testimonial" data-prev>${icon('chevron-left')}</button>
        <div class="testimonial-dots">${content.testimonials.map((_, i) => `<button aria-label="Testimonial ${i + 1}" data-dot="${i}"${i === 0 ? ' aria-current="true"' : ''}></button>`).join('')}</div>
        <button aria-label="Next testimonial" data-next>${icon('chevron-right')}</button>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head-row">
      ${sectionHead('Blog', 'Training &amp; nutrition tips', '', false)}
      <a class="link-arrow" href="/blog/">All articles ${icon('arrow-right', 16)}</a>
    </div>
    <div class="blog-grid">
      ${posts.slice(0, 3).map(postCard).join('')}
    </div>
  </div>
</section>

${enquirySection()}
`;

  return {
    path: '/',
    title: `${site.name} — Gym, Personal Training & Fitness Classes in Gurugram`,
    description: `${site.name} in Gurugram: certified coaches, strength training, HIIT, yoga, Zumba, kickboxing and personal training. Open ${site.hours[0].label}. Book a free trial today.`,
    overlay: true,
    bodyClass: 'page-home',
    preload: `<link rel="preload" as="image" href="${src(content.heroSlides[0].image, 1600)}" imagesrcset="${[800, 1200, 1600, 2000].map((w) => `${src(content.heroSlides[0].image, w)} ${w}w`).join(', ')}" imagesizes="100vw" fetchpriority="high">`,
    schema: [{ '@type': 'WebSite', '@id': `${site.url}/#website`, url: site.url + '/', name: site.name, publisher: { '@id': `${site.url}/#org` } }],
    body,
  };
};

function postCard(p) {
  return `
<article class="post-card reveal">
  <a href="/blog/${p.slug}/" class="post-card-media" tabindex="-1" aria-hidden="true">${img(p.image, '', { w: 640, ratio: 16 / 10, sizes: '(min-width: 900px) 33vw, 100vw' })}</a>
  <div class="post-card-body">
    <p class="post-meta"><span>${p.category}</span> · <time datetime="${p.date}">${fmtDate(p.date)}</time></p>
    <h3><a href="/blog/${p.slug}/">${p.title}</a></h3>
    <p>${p.excerpt}</p>
  </div>
</article>`;
}
module.exports.postCard = postCard;
