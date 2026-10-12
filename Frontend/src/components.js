const programs = require('../data/programs');
const content = require('../data/content');
const { site, esc, img, price, icon, time12 } = require('./util');
const { leadForm } = require('./layout');

const programBySlug = Object.fromEntries(programs.map((p) => [p.slug, p]));
const trainerBySlug = Object.fromEntries(content.trainers.map((t) => [t.slug, t]));

const sectionHead = (eyebrow, title, sub, center = true) => `
<div class="section-head${center ? ' section-head--center' : ''} reveal">
  ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
  <h2>${title}</h2>
  ${sub ? `<p class="section-sub">${sub}</p>` : ''}
</div>`;

// Five-bar intensity meter (1–5).
const intensity = (n) =>
  `<span class="intensity" role="img" aria-label="Intensity ${n} of 5">${[1, 2, 3, 4, 5].map((i) => `<i${i <= n ? ' class="on"' : ''}></i>`).join('')}</span>`;

function programCard(p, { sizes = '(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw' } = {}) {
  return `
<article class="program-card reveal" data-category="${esc(p.category)}" data-level="${esc(p.level)}" data-intensity="${p.intensity}">
  <a href="/programs/${p.slug}/" class="program-card-media" tabindex="-1" aria-hidden="true">
    ${img(p.hero, p.name, { w: 800, ratio: 4 / 3, sizes })}
    <span class="tag">${esc(p.category)}</span>
  </a>
  <div class="program-card-body">
    <h3><a href="/programs/${p.slug}/">${esc(p.name)}</a></h3>
    <p>${esc(p.summary)}</p>
    <div class="program-card-foot">
      <span class="program-meta">${icon('timer', 16)} ${esc(p.duration)}</span>
      <span class="program-meta">${intensity(p.intensity)}</span>
      <a href="/programs/${p.slug}/" class="link-arrow">Details ${icon('arrow-right', 16)}</a>
    </div>
  </div>
</article>`;
}

function planCard(plan) {
  const perMonth = Math.round(plan.price / plan.months);
  return `
<article class="plan-card${plan.tag ? ' plan-card--featured' : ''} reveal">
  ${plan.tag ? `<span class="plan-tag">${esc(plan.tag)}</span>` : ''}
  <h3>${esc(plan.name)}</h3>
  <p class="plan-price"><strong>${price(plan.price)}</strong><span>/ ${esc(plan.per)}</span></p>
  <p class="plan-note">${plan.months > 1 ? `${price(perMonth)} per month · ` : ''}${esc(plan.note)}</p>
  <ul class="plan-features">${plan.features.map((f) => `<li>${icon('check', 18)} ${esc(f)}</li>`).join('')}</ul>
  <button class="btn ${plan.tag ? 'btn--accent' : 'btn--outline'} btn--block" data-open="membership-modal" data-interest="${esc(plan.name)} membership">Choose ${esc(plan.name)}</button>
</article>`;
}

function trainerCard(t, { sizes = '(min-width: 1000px) 33vw, 50vw' } = {}) {
  return `
<article class="trainer-card reveal" id="${t.slug}">
  <div class="trainer-media">${img(t.image, `${t.name}, ${t.role}`, { w: 600, ratio: 4 / 5, sizes })}<span class="trainer-exp">${t.exp} yrs</span></div>
  <h3>${esc(t.name)}</h3>
  <p class="trainer-role">${esc(t.role)}</p>
  <p class="trainer-bio">${esc(t.bio)}</p>
  <ul class="chips">${t.specialties.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
  <p class="trainer-certs">${icon('award', 16)} ${esc(t.certs)}</p>
</article>`;
}

// Weekly timetable as day tabs. Pass `only` (a programme slug) to show just that programme's slots.
function scheduleTabs({ only } = {}) {
  const days = Object.entries(content.schedule)
    .map(([day, slots]) => [day, only ? slots.filter((s) => s.program === only) : slots])
    .filter(([, slots]) => slots.length);
  const uid = only || 'all';
  return `
<div class="schedule" data-tabs>
  <div class="tab-list" role="tablist" aria-label="Day of the week">
    ${days.map(([day], i) => `<button role="tab" id="t-${uid}-${day}" aria-controls="p-${uid}-${day}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-day="${day}">${day.slice(0, 3)}</button>`).join('')}
  </div>
  ${days.map(([day, slots], i) => `
  <div class="schedule-panel" role="tabpanel" id="p-${uid}-${day}" aria-labelledby="t-${uid}-${day}"${i ? ' hidden' : ''}>
    <ul class="slots">
      ${slots.map((s) => {
        const p = programBySlug[s.program], t = trainerBySlug[s.trainer];
        return `<li class="slot">
        <time>${time12(s.time)}</time>
        <div><a href="/programs/${p.slug}/"><strong>${esc(p.name)}</strong></a><span>${esc(p.duration)} · with ${esc(t.name)}</span></div>
        ${intensity(p.intensity)}
        <button class="btn btn--sm btn--outline" data-open="trial-modal" data-interest="${esc(p.name)}">Try free</button>
      </li>`;
      }).join('')}
    </ul>
  </div>`).join('')}
</div>`;
}

function enquirySection({ interest = '', title = 'Your first workout is on us', sub } = {}) {
  return `
<section class="section enquiry-section" id="enquire">
  <div class="enquiry-bg">${img('photo-1571902943202-507ec2618e8f', '', { w: 1600, sizes: '100vw' })}</div>
  <div class="container enquiry-grid">
    <div class="enquiry-copy reveal">
      <p class="eyebrow">Free trial</p>
      <h2>${title}</h2>
      <p>${sub || 'Book a free one-day trial: full gym access, a coached session and any class on the timetable. No payment details, no pressure.'}</p>
      <ul class="check-list">
        <li>${icon('check', 18)} Free fitness assessment &amp; body-composition scan</li>
        <li>${icon('check', 18)} A coach shows you around and builds your first workout</li>
        <li>${icon('check', 18)} Exclusive joining offer if you sign up the same day</li>
      </ul>
      <div class="enquiry-quick">
        <a href="tel:${site.phoneRaw}" class="btn btn--outline-light">${icon('phone', 18)} Call now</a>
        <a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener" class="btn btn--outline-light">${icon('whatsapp', 18)} WhatsApp</a>
      </div>
    </div>
    <div class="enquiry-card reveal"><h3>Book your free trial</h3>${leadForm({ kind: 'free-trial', interest, submit: 'Book Free Trial' })}</div>
  </div>
</section>`;
}

function bmiCalculator() {
  return `
<div class="calc" data-bmi>
  <div class="calc-inputs">
    <div class="range-field">
      <div class="range-label"><label for="bmi-height">Height</label><output data-out="height"></output></div>
      <input id="bmi-height" type="range" min="130" max="210" step="1" value="170" data-in="height">
      <div class="range-scale"><span>130 cm</span><span>210 cm</span></div>
    </div>
    <div class="range-field">
      <div class="range-label"><label for="bmi-weight">Weight</label><output data-out="weight"></output></div>
      <input id="bmi-weight" type="range" min="35" max="160" step="0.5" value="72" data-in="weight">
      <div class="range-scale"><span>35 kg</span><span>160 kg</span></div>
    </div>
    <div class="range-field">
      <div class="range-label"><label for="bmi-age">Age</label><output data-out="age"></output></div>
      <input id="bmi-age" type="range" min="15" max="80" step="1" value="30" data-in="age">
      <div class="range-scale"><span>15</span><span>80</span></div>
    </div>
    <fieldset class="seg">
      <legend>Sex (for calorie estimate)</legend>
      <label><input type="radio" name="bmi-sex" value="m" checked data-in="sex"> Male</label>
      <label><input type="radio" name="bmi-sex" value="f" data-in="sex"> Female</label>
    </fieldset>
  </div>
  <div class="calc-result">
    <p>Your BMI</p>
    <strong class="calc-value" data-out="bmi">—</strong>
    <p class="calc-band" data-out="band"></p>
    <div class="bmi-scale" aria-hidden="true"><span data-bar="marker"></span></div>
    <div class="bmi-scale-labels" aria-hidden="true"><span>18.5</span><span>23</span><span>25</span><span>30</span></div>
    <dl class="calc-breakdown">
      <div><dt>Healthy weight for your height</dt><dd data-out="healthy"></dd></div>
      <div><dt>Maintenance calories (moderately active)</dt><dd data-out="tdee"></dd></div>
      <div><dt>Suggested daily protein</dt><dd data-out="protein"></dd></div>
    </dl>
    <button class="btn btn--accent btn--block" data-open="trial-modal">Get a free body-composition scan</button>
    <p class="fine">Uses Asian BMI cut-offs (WHO). BMI doesn't distinguish muscle from fat — a body-composition scan does.</p>
  </div>
</div>`;
}

module.exports = { sectionHead, intensity, programCard, planCard, trainerCard, scheduleTabs, enquirySection, bmiCalculator, programBySlug, trainerBySlug };
