const programs = require('../../data/programs');
const content = require('../../data/content');
const posts = require('../../data/blog');
const { site, esc, img, src, icon, absUrl, fmtDate, price } = require('../util');
const { pageHero, breadcrumbSchema, leadForm } = require('../layout');
const { sectionHead, programCard, planCard, trainerCard, scheduleTabs, enquirySection, bmiCalculator } = require('../components');
const { postCard } = require('./home');

const uniq = (arr) => [...new Set(arr)];
const faqSchema = (faqs) => ({ '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
const faqList = (faqs) => `<div class="faq">${faqs.map((f) => `<details class="reveal"><summary>${f.q}${icon('chevron-down', 20)}</summary><p>${f.a}</p></details>`).join('')}</div>`;

function programsListing() {
  const crumbs = [{ name: 'Programs', path: '/programs/' }];
  const sel = (name, label, opts) => `
    <div class="filter"><label for="f-${name}">${label}</label>
      <select id="f-${name}" name="${name}" data-filter="${name}">${opts.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join('')}</select></div>`;
  const body = `
${pageHero('Programs', 'Strength, conditioning, mind-body and coaching programs for every goal and every level.', 'photo-1540497077202-7c8a3999166f', crumbs)}
<section class="section section--tight">
  <div class="container">
    <h2 class="sr-only">All programs</h2>
    <form class="filters" data-filters aria-label="Filter programs">
      ${sel('category', 'Category', [['', 'All categories'], ...uniq(programs.map((p) => p.category)).map((c) => [c, c])])}
      ${sel('level', 'Level', [['', 'Any level'], ...uniq(programs.map((p) => p.level)).map((c) => [c, c])])}
      ${sel('intensity', 'Intensity', [['', 'Any intensity'], ['1-2', 'Low'], ['3-3', 'Moderate'], ['4-5', 'High']])}
      <button type="reset" class="btn btn--sm btn--ghost" data-reset>Clear filters</button>
    </form>
    <p class="results-count" aria-live="polite" data-count-label>${programs.length} programs</p>
    <div class="program-grid" data-program-grid>
      ${programs.map((p) => programCard(p)).join('')}
    </div>
    <div class="empty-state" data-empty hidden>
      <h3>No programs match these filters</h3>
      <p>Tell us your goal and a coach will recommend the right plan.</p>
      <button class="btn btn--accent" data-open="enquiry-modal">Ask a coach</button>
    </div>
  </div>
</section>
${enquirySection()}`;
  return {
    path: '/programs/',
    title: 'Programs — Strength, HIIT, Yoga, Zumba, Kickboxing & Personal Training',
    description: `All programs at ${site.name}, Gurugram: strength training, functional & HIIT, personal training, yoga, Zumba, kickboxing, cardio and a 12-week weight-loss program.`,
    body,
    schema: [
      breadcrumbSchema(crumbs),
      { '@type': 'ItemList', name: `${site.name} programs`, itemListElement: programs.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absUrl(`/programs/${p.slug}/`), name: p.name })) },
    ],
  };
}

function membership() {
  const crumbs = [{ name: 'Membership', path: '/membership/' }];
  const body = `
${pageHero('Membership &amp; pricing', 'Simple plans with no hidden fees. Every plan includes full gym access, group classes and a free fitness assessment.', 'photo-1570829460005-c840387bb1ca', crumbs)}
<section class="section">
  <div class="container">
    <div class="plan-grid">${content.plans.map(planCard).join('')}</div>
    <p class="fine center">Prices include GST. Offers and prices may change — call or WhatsApp for today's best price.</p>
  </div>
</section>
<section class="section section--alt">
  <div class="container">
    ${sectionHead('Compare', 'What\'s included', '')}
    <div class="table-wrap"><table class="price-table">
      <thead><tr><th scope="col">Feature</th>${content.plans.map((p) => `<th scope="col">${esc(p.name)}</th>`).join('')}</tr></thead>
      <tbody>
        ${[
          ['Gym floor & cardio access', [1, 1, 1, 1]],
          ['Group classes', [1, 1, 1, 1]],
          ['Fitness assessment', [1, 1, 1, 1]],
          ['Personal-training sessions', ['—', '2', '4', '8']],
          ['Body-composition scans', ['On joining', 'Monthly', 'Monthly', 'Monthly']],
          ['Diet plan', ['—', 'Basic', 'Customised', 'Customised + reviews']],
          ['Membership freeze', ['—', '—', '15 days', '30 days']],
          ['Guest passes', ['—', '—', '—', '1 / month']],
          ['Joining fee', ['₹500', 'Waived', 'Waived', 'Waived']],
        ].map(([f, vals]) => `<tr><th scope="row">${f}</th>${vals.map((v) => `<td>${v === 1 ? `<span class="yes" aria-label="Included">${icon('check', 18)}</span>` : v}</td>`).join('')}</tr>`).join('')}
        <tr><th scope="row">Price</th>${content.plans.map((p) => `<td class="price-strong">${price(p.price)}</td>`).join('')}</tr>
      </tbody>
    </table></div>
  </div>
</section>
<section class="section">
  <div class="container">
    ${sectionHead('Personal training', 'Add a personal coach', 'Packs can be added to any membership. All sessions are 60 minutes, one-to-one.')}
    <div class="pt-grid">
      ${content.ptPacks.map((p) => `
      <div class="pt-card reveal">
        <h3>${esc(p.name)}</h3>
        <p class="plan-price"><strong>${price(p.price)}</strong></p>
        <p class="plan-note">${esc(p.note)}</p>
        <button class="btn btn--outline btn--block" data-open="membership-modal" data-interest="Personal Training">Enquire</button>
      </div>`).join('')}
    </div>
  </div>
</section>
<section class="section section--alt">
  <div class="container narrow">
    ${sectionHead('FAQs', 'Membership questions', '')}
    ${faqList(content.faqs)}
  </div>
</section>
${enquirySection({ title: 'Not sure which plan? Try us first.' })}`;
  return {
    path: '/membership/',
    title: 'Membership Plans & Pricing',
    description: `${site.name} membership plans from ${price(content.plans[0].price)}/month. Quarterly, half-yearly and annual plans with personal training, diet plans and freeze options. Book a free trial.`,
    body,
    schema: [
      breadcrumbSchema(crumbs),
      faqSchema(content.faqs),
      { '@type': 'OfferCatalog', name: 'Membership plans', itemListElement: content.plans.map((p) => ({ '@type': 'Offer', name: `${p.name} membership`, price: p.price, priceCurrency: 'INR', seller: { '@id': `${site.url}/#org` } })) },
    ],
  };
}

function schedule() {
  const crumbs = [{ name: 'Schedule', path: '/schedule/' }];
  const body = `
${pageHero('Class schedule', `Over ${content.stats[2].value} classes every week, included in every membership.`, 'photo-1518611012118-696072aa579a', crumbs)}
<section class="section">
  <div class="container">
    ${scheduleTabs()}
    <p class="fine center">Classes have limited spots — arrive 5 minutes early. The timetable may change on public holidays.</p>
  </div>
</section>
<section class="section section--alt">
  <div class="container">
    ${sectionHead('Opening hours', 'Train on your schedule', 'The gym floor is open throughout opening hours, with a coach always on duty.')}
    <div class="hours-grid">
      ${site.hours.map((h) => `<div class="hours-card reveal">${icon('clock', 28)}<h3>${esc(h.days)}</h3><p>${esc(h.label)}</p></div>`).join('')}
    </div>
  </div>
</section>
${enquirySection({ title: 'Try any class free' })}`;
  return { path: '/schedule/', title: 'Class Schedule & Timetable', description: `Weekly class timetable at ${site.name}, Gurugram: HIIT, strength, yoga, Zumba and kickboxing classes, morning and evening.`, body, schema: [breadcrumbSchema(crumbs)] };
}

function trainers() {
  const crumbs = [{ name: 'Trainers', path: '/trainers/' }];
  const body = `
${pageHero('Our trainers', 'Certified, experienced and on the floor every hour we\'re open.', 'photo-1597452485669-2c7bb5fef90d', crumbs)}
<section class="section">
  <div class="container">
    <div class="trainer-grid">${content.trainers.map((t) => trainerCard(t)).join('')}</div>
  </div>
</section>
<section class="section section--dark">
  <div class="container split-grid">
    <div class="reveal">
      <p class="eyebrow">Personal training</p>
      <h2>Get a coach who's in your corner.</h2>
      <ul class="check-list check-list--light">
        <li>${icon('check', 18)} A plan built around your goal, schedule and history</li>
        <li>${icon('check', 18)} Every rep supervised, every session logged</li>
        <li>${icon('check', 18)} Diet guidance and WhatsApp check-ins between sessions</li>
      </ul>
      <a class="btn btn--accent" href="/programs/personal-training/">About personal training</a>
    </div>
    <div class="enquiry-card reveal"><h3>Book a free consultation</h3>${leadForm({ kind: 'callback', interest: 'personal-training', submit: 'Request a Call', compact: true })}</div>
  </div>
</section>`;
  return {
    path: '/trainers/', title: 'Trainers & Coaches', description: `Meet the certified coaches at ${site.name}: strength, HIIT, yoga, Zumba, nutrition and personal training specialists.`, body,
    schema: [breadcrumbSchema(crumbs), ...content.trainers.map((t) => ({ '@type': 'Person', name: t.name, jobTitle: t.role, worksFor: { '@id': `${site.url}/#org` }, image: src(t.image, 600) }))],
  };
}

function about() {
  const crumbs = [{ name: 'About Us', path: '/about/' }];
  const body = `
${pageHero(`About ${esc(site.name)}`, 'A coaching-first gym built for real people with real schedules.', 'photo-1571902943202-507ec2618e8f', crumbs)}
<section class="section">
  <div class="container split-grid">
    <div class="split-copy reveal">
      <p class="eyebrow">Our story</p>
      <h2>Built for people who want results, not just a membership card.</h2>
      <p>${esc(site.name)} opened in ${site.founded} with one idea: a gym is only as good as its coaching. So we hired certified trainers, put them on the floor instead of behind a desk, and built every membership around an assessment and a plan.</p>
      <p>Today ${content.stats[0].value.toLocaleString('en-IN')}+ members train with us — from first-timers and busy professionals to competitive lifters — supported by ${content.stats[1].value} coaches and a nutrition desk.</p>
    </div>
    <div class="split-media reveal">${img('photo-1534438327276-14e5300c3a48', 'The strength floor at Cyber Heights Gym', { w: 900, ratio: 4 / 5, sizes: '(min-width: 900px) 45vw, 100vw' })}</div>
  </div>
</section>
<section class="section section--alt">
  <div class="container vm-grid">
    <div class="vm-card reveal"><span class="why-icon">${icon('target', 28)}</span><h3>Mission</h3><p>Help every member get measurably fitter, stronger and healthier — with coaching they can trust.</p></div>
    <div class="vm-card reveal"><span class="why-icon">${icon('heart', 28)}</span><h3>Community</h3><p>A welcoming gym where beginners feel at home and regulars push each other.</p></div>
    <div class="vm-card reveal"><span class="why-icon">${icon('shield', 28)}</span><h3>Standards</h3><p>Clean equipment, safe technique and honest advice — no gimmicks, no pressure sales.</p></div>
  </div>
</section>
<section class="stats" aria-label="Key numbers">
  <div class="container stats-grid">${content.stats.map((s) => `<div class="stat reveal"><strong><span data-count="${s.value}">0</span>${s.suffix}</strong><span>${s.label}</span></div>`).join('')}</div>
</section>
<section class="section section--dark">
  <div class="container">
    ${sectionHead('Milestones', 'Our journey', '')}
    <ol class="timeline">
      ${content.timeline.map((t) => `<li class="reveal"><span class="timeline-year">${t.year}</span><div><h3>${t.title}</h3><p>${t.text}</p></div></li>`).join('')}
    </ol>
  </div>
</section>
${enquirySection()}`;
  return { path: '/about/', title: 'About Us — Our Story & Approach', description: `${site.name} is a coaching-first gym in Gurugram with ${content.stats[1].value} certified coaches and ${content.stats[0].value.toLocaleString('en-IN')}+ members. Learn about our story and approach.`, body, schema: [breadcrumbSchema(crumbs)] };
}

function contact() {
  const crumbs = [{ name: 'Contact', path: '/contact/' }];
  const o = site.offices[0];
  const q = o.lat ? `${o.lat},${o.lng}` : encodeURIComponent(`${site.name}, ${o.address}`);
  const body = `
${pageHero('Contact us', 'Drop by for a tour, call us, or leave your details and we\'ll call you back.', 'photo-1593079831268-3381b0db4a77', crumbs)}
<section class="section">
  <div class="container contact-grid">
    <div class="reveal">
      <p class="eyebrow">Talk to us</p>
      <h2>We'd love to see you at the gym</h2>
      <div class="contact-quick">
        <a href="tel:${site.phoneRaw}" class="contact-tile">${icon('phone', 26)}<span><small>Call</small><strong>${site.phone}</strong></span></a>
        <a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener" class="contact-tile">${icon('whatsapp', 26)}<span><small>WhatsApp</small><strong>Chat with us</strong></span></a>
        <a href="mailto:${site.email}" class="contact-tile">${icon('mail', 26)}<span><small>Email</small><strong>${site.email}</strong></span></a>
        <div class="contact-tile">${icon('clock', 26)}<span><small>Hours</small>${site.hours.map((h) => `<strong>${esc(h.days)}: ${esc(h.label)}</strong>`).join('<br>')}</span></div>
      </div>
      <div class="map-embed map-embed--contact" data-map="https://maps.google.com/maps?q=${q}&z=15&output=embed" data-title="Map: ${esc(site.name)}">
        <button class="map-placeholder" type="button">${icon('map-pin', 28)}<span>Load map</span></button>
      </div>
      <p class="contact-address">${icon('map-pin', 18)} ${esc(o.address)} · <a class="link-arrow" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${q}">Get directions ${icon('arrow-right', 16)}</a></p>
    </div>
    <div class="enquiry-card enquiry-card--light reveal"><h3>Send an enquiry</h3>${leadForm({ kind: 'contact', submit: 'Send Enquiry' })}</div>
  </div>
</section>`;
  return {
    path: '/contact/', title: 'Contact Us — Address, Hours, Phone & WhatsApp', description: `Contact ${site.name}, Gurugram: call ${site.phone}, WhatsApp or visit us. Open ${site.hours.map((h) => `${h.days} ${h.label}`).join(', ')}.`, body,
    schema: [breadcrumbSchema(crumbs), { '@type': 'ContactPage', url: absUrl('/contact/'), name: 'Contact ' + site.name }],
  };
}

function blogIndex() {
  const crumbs = [{ name: 'Blog', path: '/blog/' }];
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const body = `
${pageHero('Blog', 'Training, nutrition and recovery advice from our coaches.', 'photo-1517963879433-6ad2b056d712', crumbs)}
<section class="section"><div class="container"><div class="blog-grid">${sorted.map(postCard).join('')}</div></div></section>`;
  return { path: '/blog/', title: 'Blog — Training, Nutrition & Recovery Tips', description: `Workout plans, Indian-diet nutrition advice and recovery tips from the coaches at ${site.name}.`, body, schema: [breadcrumbSchema(crumbs)] };
}

function blogPost(p) {
  const path = `/blog/${p.slug}/`;
  const crumbs = [{ name: 'Blog', path: '/blog/' }, { name: p.title, path }];
  const related = posts.filter((x) => x.slug !== p.slug).slice(0, 3);
  const body = `
${pageHero(p.title, `<span class="post-meta post-meta--light">${p.category} · <time datetime="${p.date}">${fmtDate(p.date)}</time> · ${p.author}</span>`, p.image, crumbs)}
<article class="section"><div class="container prose reveal">${p.body}
  <div class="share">Share: <a target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(p.title + ' ' + absUrl(path))}">${icon('whatsapp', 18)} WhatsApp</a>
  <a target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absUrl(path))}">${icon('facebook', 18)} Facebook</a></div>
</div></article>
<section class="section section--alt"><div class="container">${sectionHead('Keep reading', 'Related articles', '')}<div class="blog-grid">${related.map(postCard).join('')}</div></div></section>
${enquirySection()}`;
  return {
    path, title: p.title, description: p.excerpt, image: src(p.image, 1200, 630), body,
    schema: [breadcrumbSchema(crumbs), {
      '@type': 'BlogPosting', headline: p.title, description: p.excerpt, image: src(p.image, 1200), datePublished: p.date, dateModified: p.date,
      author: { '@type': 'Person', name: p.author.split(',')[0] }, publisher: { '@id': `${site.url}/#org` }, mainEntityOfPage: absUrl(path),
    }],
  };
}

function careers() {
  const crumbs = [{ name: 'Careers', path: '/careers/' }];
  const body = `
${pageHero('Careers', 'Coach people. Change lives. Grow with us.', 'photo-1526506118085-60ce8714f8c5', crumbs)}
<section class="section">
  <div class="container">
    ${sectionHead('Why work with us', 'A gym that invests in its coaches', '')}
    <div class="why-grid why-grid--3">
      ${[['trending', 'Grow your skills', 'Paid certifications, monthly workshops and a clear path to senior coach.'], ['users', 'Great team', 'Work alongside experienced coaches who care about craft.'], ['award', 'Fair rewards', 'Competitive pay, PT incentives and a free membership for family.']]
        .map(([i, t, d]) => `<div class="why-card reveal"><span class="why-icon">${icon(i, 28)}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}
    </div>
  </div>
</section>
<section class="section section--alt">
  <div class="container">
    ${sectionHead('Open positions', 'Current openings', '')}
    <ul class="jobs">
      ${content.jobs.map((j) => `
      <li class="job reveal">
        <div><h3>${j.title}</h3><p>${icon('briefcase', 16)} ${j.dept} · ${icon('map-pin', 16)} ${j.location} · ${j.type} · ${j.exp}</p></div>
        <a class="btn btn--outline btn--sm" href="mailto:${site.careersEmail}?subject=${encodeURIComponent('Application: ' + j.title)}">Apply ${icon('arrow-right', 16)}</a>
      </li>`).join('')}
    </ul>
    <p class="center muted">Don't see a fit? Send your CV to <a href="mailto:${site.careersEmail}">${site.careersEmail}</a>.</p>
  </div>
</section>`;
  return {
    path: '/careers/', title: 'Careers — Join Our Team', description: `Careers at ${site.name}: personal trainers, group fitness instructors, sales and front-desk roles in Gurugram.`, body,
    schema: [breadcrumbSchema(crumbs), ...content.jobs.map((j) => ({
      '@type': 'JobPosting', title: j.title, description: `${j.title} — ${j.dept}, ${j.exp} experience.`, datePosted: '2026-10-01', employmentType: j.type === 'Part-time' ? 'PART_TIME' : 'FULL_TIME',
      hiringOrganization: { '@id': `${site.url}/#org` },
      jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: j.location, addressRegion: 'Haryana', addressCountry: 'IN' } },
    }))],
  };
}

function bmi() {
  const crumbs = [{ name: 'BMI Calculator', path: '/bmi-calculator/' }];
  const body = `
${pageHero('BMI &amp; calorie calculator', 'Check your BMI, healthy weight range and daily calorie needs in seconds.', 'photo-1584735935682-2f2b69dff9d2', crumbs)}
<section class="section"><div class="container">${bmiCalculator()}</div></section>
<section class="section section--alt"><div class="container narrow prose">
  <h2>How is BMI calculated?</h2>
  <p>BMI = weight (kg) ÷ height (m)². For South Asian adults, the WHO recommends lower cut-offs because health risks start at a lower BMI: under 18.5 is underweight, 18.5–22.9 is healthy, 23–24.9 is overweight and 25 or above is obese.</p>
  <h2>Why BMI isn't the whole story</h2>
  <p>BMI can't tell muscle from fat. A strong, muscular person can have a "high" BMI and be very healthy, while someone with a "normal" BMI can still carry too much body fat. That's why every Cyber Heights membership includes a body-composition scan that measures fat, muscle and water separately.</p>
  <h2>Calories and protein</h2>
  <p>Maintenance calories are estimated with the Mifflin-St Jeor equation and a moderate activity factor (×1.55). To lose fat, eat roughly 300–500 calories below this; to gain muscle, 200–300 above. Protein is suggested at 1.6 g per kg of body weight.</p>
</div></section>
${enquirySection({ title: 'Get your real numbers — free' , sub: 'Book a free trial and get a full body-composition scan, a fitness assessment and a coached workout.' })}`;
  return { path: '/bmi-calculator/', title: 'BMI & Calorie Calculator (Asian BMI)', description: 'Free BMI calculator using Asian cut-offs, plus your healthy weight range, maintenance calories and daily protein target.', body, schema: [breadcrumbSchema(crumbs)] };
}

function legal(path, title, desc, html) {
  const crumbs = [{ name: title, path }];
  return {
    path, title, description: desc, schema: [breadcrumbSchema(crumbs)],
    body: `${pageHero(title, '', 'photo-1576678927484-cc907957088c', crumbs)}<section class="section"><div class="container narrow prose">${html}<p class="fine">Last updated: 8 October 2026. Placeholder text — have this reviewed by your legal counsel.</p></div></section>`,
  };
}

const legalPages = () => [
  legal('/privacy-policy/', 'Privacy Policy', `How ${site.name} collects, uses and protects your personal data.`, `
<p>${esc(site.legalName)} ("we", "us") respects your privacy. This policy explains how we handle personal data collected through this website and at the gym, in line with the Digital Personal Data Protection Act, 2023.</p>
<h2>Information we collect</h2><p>When you submit a form, we collect your name, phone number, email address, the program or plan you're interested in and, for trials, your preferred date and time. Members also share health and body-composition information during assessments. We collect basic analytics (pages visited, device type, campaign source).</p>
<h2>How we use it</h2><ul><li>To respond to your enquiry and arrange trials</li><li>To manage your membership and personalise your training</li><li>To share offers and updates you have consented to</li><li>To improve our website and services</li></ul>
<h2>Health information</h2><p>Health and body-composition data is used only by your coaches to keep your training safe and effective. It is never shared for marketing.</p>
<h2>Sharing</h2><p>We do not sell your data. We may share it with our CRM, messaging and payment providers strictly to provide our services, and with authorities when required by law.</p>
<h2>Your rights</h2><p>You may request access, correction or deletion of your data, or withdraw consent, by writing to <a href="mailto:${site.email}">${site.email}</a>.</p>`),
  legal('/membership-terms/', 'Membership Terms', `Membership, freeze, refund and gym-floor rules at ${site.name}.`, `
<h2>Membership</h2><ul><li>Memberships are personal and non-transferable unless approved by management.</li><li>Members must carry their membership card or app check-in on every visit.</li><li>A one-time registration fee applies to monthly plans.</li></ul>
<h2>Freeze</h2><p>Half-yearly plans include up to 15 days and annual plans up to 30 days of freeze, requested at least 48 hours in advance. Medical freezes beyond this are considered with a doctor's certificate.</p>
<h2>Refunds &amp; cancellation</h2><p>Membership fees are non-refundable once the membership has started, except for documented medical reasons at management's discretion. Personal-training packs must be used within their validity period.</p>
<h2>Gym-floor rules</h2><ul><li>Clean sports shoes and a towel are mandatory.</li><li>Re-rack weights and wipe down equipment after use.</li><li>Cardio machines are limited to 30 minutes at peak hours.</li><li>Respect fellow members and staff — harassment of any kind leads to termination without refund.</li></ul>`),
  legal('/disclaimer/', 'Health Disclaimer', `Health and website disclaimer for ${site.name}.`, `
<p>The information on this website, including articles, calculators and program descriptions, is for general information only and is not medical advice. Consult a doctor before starting any new exercise or nutrition program, especially if you are pregnant, have a medical condition, or are recovering from injury.</p>
<p>Results such as weight loss, strength gains and calorie estimates vary from person to person and are not guaranteed. Member stories reflect individual experiences.</p>
<p>Prices, offers, class timings and trainers are subject to change without notice. Images may be representative.</p>
<p>By submitting your details, you authorise ${esc(site.name)} and its representatives to contact you via call, SMS, email or WhatsApp, overriding any DNC/NDNC registration.</p>`),
];

function notFound() {
  return {
    path: '/404.html', title: 'Page not found', description: 'The page you are looking for does not exist.', noindex: true,
    body: `<section class="section notfound"><div class="container narrow center"><p class="eyebrow center">404</p><h1>This page skipped leg day.</h1><p>The page you're looking for may have moved. Try one of these instead.</p><p><a class="btn btn--accent" href="/programs/">Explore programs</a> <a class="btn btn--outline" href="/">Go home</a></p></div></section>`,
  };
}

module.exports = { programsListing, membership, schedule, trainers, about, contact, blogIndex, blogPost, careers, bmi, legalPages, notFound };
