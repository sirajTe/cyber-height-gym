/* Cyber Heights Gym — site interactions (vanilla JS, no dependencies) */
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const SITE = window.SITE || {};
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get: (k, s = sessionStorage) => { try { return s.getItem(k); } catch { return null; } },
    set: (k, v, s = sessionStorage) => { try { s.setItem(k, v); } catch { /* storage unavailable */ } },
  };

  /* ---------- Header & nav ---------- */
  const header = $('[data-header]');
  const onScroll = () => header && header.classList.toggle('is-scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = $('[data-nav-toggle]');
  const nav = $('#main-nav');
  if (toggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }
  $$('.main-nav ul a').forEach((a) => {
    if (location.pathname.startsWith(a.getAttribute('href'))) a.setAttribute('aria-current', 'page');
  });

  /* ---------- Reveal on scroll ---------- */
  const revealIO = 'IntersectionObserver' in window && new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); revealIO.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  $$('.reveal').forEach((el, i) => {
    if (!revealIO) return el.classList.add('is-visible');
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    revealIO.observe(el);
  });

  /* ---------- Hero slider ---------- */
  const hero = $('[data-hero-slider]');
  if (hero) {
    const slides = $$('[data-slide]', hero);
    const dots = $$('[data-dot]', hero);
    let idx = 0, timer;
    const go = (n) => {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => { s.classList.toggle('is-active', i === idx); s.setAttribute('aria-hidden', String(i !== idx)); });
      dots.forEach((d, i) => d.setAttribute('aria-selected', String(i === idx)));
    };
    const play = () => { if (reduceMotion) return; clearInterval(timer); timer = setInterval(() => go(idx + 1), 6500); };
    dots.forEach((d) => d.addEventListener('click', () => { go(+d.dataset.dot); play(); }));
    document.addEventListener('visibilitychange', () => (document.hidden ? clearInterval(timer) : play()));
    play();
  }

  /* ---------- Carousels ---------- */
  $$('[data-carousel]').forEach((track) => {
    const navEl = $(`[data-carousel-nav="${track.dataset.carousel}"]`);
    if (!navEl) return;
    const prev = $('[data-prev]', navEl), next = $('[data-next]', navEl);
    const step = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 20;
    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    const update = () => {
      prev.disabled = track.scrollLeft < 5;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
    };
    track.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
  });

  /* ---------- Counters ---------- */
  const fmtNum = (n) => n.toLocaleString('en-IN');
  const countIO = 'IntersectionObserver' in window && new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target, end = +el.dataset.count, t0 = performance.now(), dur = 1800;
      countIO.unobserve(el);
      if (reduceMotion) { el.textContent = fmtNum(end); return; }
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = fmtNum(Math.round(end * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  $$('[data-count]').forEach((el) => (countIO ? countIO.observe(el) : (el.textContent = fmtNum(+el.dataset.count))));

  /* ---------- Testimonials ---------- */
  const tWrap = $('[data-testimonials]');
  if (tWrap) {
    const items = $$('[data-testimonial]', tWrap), dots = $$('.testimonial-dots [data-dot]', tWrap);
    let i = 0, timer;
    const go = (n) => {
      i = (n + items.length) % items.length;
      items.forEach((el, k) => { el.classList.toggle('is-active', k === i); el.setAttribute('aria-hidden', String(k !== i)); });
      dots.forEach((d, k) => (k === i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
    };
    const play = () => { if (reduceMotion) return; clearInterval(timer); timer = setInterval(() => go(i + 1), 7000); };
    $('[data-prev]', tWrap).addEventListener('click', () => { go(i - 1); play(); });
    $('[data-next]', tWrap).addEventListener('click', () => { go(i + 1); play(); });
    dots.forEach((d) => d.addEventListener('click', () => { go(+d.dataset.dot); play(); }));
    tWrap.addEventListener('mouseenter', () => clearInterval(timer));
    tWrap.addEventListener('mouseleave', play);
    play();
  }

  /* ---------- Tabs (schedule) ---------- */
  $$('[data-tabs]').forEach((wrap) => {
    const tabs = $$('[role="tab"]', wrap);
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    };
    // Schedule: open on today's day when it has classes.
    const todayTab = tabs.find((t) => t.dataset.day === new Date().toLocaleDateString('en-US', { weekday: 'long' }));
    if (todayTab) select(todayTab);
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        const n = tabs[(i + d + tabs.length) % tabs.length];
        select(n); n.focus();
      });
    });
  });

  /* ---------- Gallery lightbox ---------- */
  const galleryLinks = $$('[data-lightbox]');
  if (galleryLinks.length) {
    const lb = document.createElement('div');
    lb.className = 'lightbox'; lb.hidden = true;
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Image viewer');
    lb.innerHTML = `<img alt=""><button class="lb-close" aria-label="Close">✕</button><button class="lb-prev" aria-label="Previous image">‹</button><button class="lb-next" aria-label="Next image">›</button><p class="lb-count"></p>`;
    document.body.appendChild(lb);
    const im = $('img', lb), count = $('.lb-count', lb);
    let cur = 0, opener;
    const show = (n) => {
      cur = (n + galleryLinks.length) % galleryLinks.length;
      im.src = galleryLinks[cur].href;
      im.alt = $('img', galleryLinks[cur]).alt;
      count.textContent = `${cur + 1} / ${galleryLinks.length}`;
    };
    const close = () => { lb.hidden = true; document.body.style.overflow = ''; opener && opener.focus(); };
    galleryLinks.forEach((a, n) => a.addEventListener('click', (e) => {
      e.preventDefault(); opener = a; show(n); lb.hidden = false; document.body.style.overflow = 'hidden'; $('.lb-close', lb).focus();
    }));
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', () => show(cur - 1));
    $('.lb-next', lb).addEventListener('click', () => show(cur + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
    let x0 = null;
    lb.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  /* ---------- Lite YouTube & lazy maps ---------- */
  $$('[data-yt]').forEach((b) => b.addEventListener('click', () => {
    b.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(b.dataset.yt)}?autoplay=1&rel=0" title="Video walkthrough" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  }, { once: true }));

  const loadMap = (el) => {
    if (el.dataset.loaded) return;
    el.dataset.loaded = '1';
    el.innerHTML = `<iframe src="${el.dataset.map}" title="${el.dataset.title || 'Map'}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
  };
  const mapIO = 'IntersectionObserver' in window && new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { loadMap(en.target); mapIO.unobserve(en.target); } });
  }, { rootMargin: '300px' });
  $$('[data-map]').forEach((el) => {
    el.addEventListener('click', () => loadMap(el));
    mapIO && mapIO.observe(el);
  });

  /* ---------- Modals ---------- */
  const openModal = (id, trigger) => {
    const dlg = document.getElementById(id);
    if (!dlg || dlg.open) return;
    $$('dialog[open]').forEach((d) => d.close());
    const interest = trigger && trigger.dataset.interest;
    if (interest) { const sel = $('select[name="interest"]', dlg); if (sel) sel.value = interest; }
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
  };
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-open]');
    if (t) { e.preventDefault(); openModal(t.dataset.open, t); return; }
    const c = e.target.closest('[data-close]');
    if (c) c.closest('dialog').close();
  });
  $$('dialog.modal').forEach((d) => {
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); }); // backdrop
    d.addEventListener('close', () => { document.body.style.overflow = ''; });
  });

  // Enquiry popup: after N seconds or on exit intent — once per session, never after a lead is submitted.
  const canPopup = () => !store.get('popupShown') && !store.get('leadSubmitted', localStorage) && !$('dialog[open]') && !$('.main-nav.is-open');
  const showPopup = () => { if (!canPopup()) return; store.set('popupShown', '1'); openModal('enquiry-modal'); };
  if (!store.get('popupShown')) {
    setTimeout(showPopup, (SITE.popupDelay || 15) * 1000);
    if (matchMedia('(pointer: fine)').matches) {
      document.addEventListener('mouseout', (e) => { if (!e.relatedTarget && e.clientY <= 0) showPopup(); });
    }
  }

  /* ---------- Lead forms ---------- */
  // Capture campaign parameters for attribution.
  const params = new URLSearchParams(location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach((k) => {
    if (params.get(k)) store.set(k, params.get(k));
  });

  const today = new Date();
  const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  $$('[data-min-today]').forEach((i) => (i.min = iso));

  const setError = (input, msg) => {
    const field = input.closest('.field');
    if (!field) return;
    field.classList.toggle('is-invalid', !!msg);
    let err = $('.field-error', field);
    if (msg) {
      if (!err) { err = document.createElement('span'); err.className = 'field-error'; err.id = input.id + '-err'; field.appendChild(err); }
      err.textContent = msg;
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', err.id);
    } else if (err) {
      err.remove(); input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby');
    }
  };

  const normalisePhone = (code, raw) => {
    let d = raw.replace(/\D/g, '');
    if (code === '+91') { d = d.replace(/^(91|0)(?=\d{10}$)/, ''); return /^[6-9]\d{9}$/.test(d) ? d : null; }
    return /^\d{6,12}$/.test(d) ? d : null;
  };

  const validate = (form) => {
    let ok = true;
    const v = (name) => form.elements[name];
    const name = v('name'), phone = v('phone'), email = v('email'), interest = v('interest');
    const rules = [
      [name, name.value.trim().length >= 2 ? '' : 'Please enter your name'],
      [phone, normalisePhone(v('country_code').value, phone.value) ? '' : (v('country_code').value === '+91' ? 'Enter a valid 10-digit mobile number' : 'Enter a valid phone number')],
      [email, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()) ? '' : 'Enter a valid email address'],
      [interest, interest.value ? '' : 'Please choose what you\'re interested in'],
    ];
    if (v('trial_date')) rules.push([v('trial_date'), v('trial_date').value && v('trial_date').value >= iso ? '' : 'Choose a date from today onwards']);
    if (v('trial_time')) rules.push([v('trial_time'), v('trial_time').value ? '' : 'Choose a time slot']);
    rules.forEach(([el, msg]) => { setError(el, msg); if (msg && ok) { ok = false; el.focus(); } });
    if (ok && !v('consent').checked) { ok = false; form.querySelector('.form-msg').textContent = 'Please accept the consent to continue.'; form.querySelector('.form-msg').classList.add('is-error'); }
    return ok;
  };

  class LeadError extends Error {
    constructor(message, field) { super(message); this.field = field; }
  }

  async function sendLead(data) {
    if (SITE.leadEndpoint) {
      let res;
      try {
        res = await fetch(SITE.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      } catch {
        throw new LeadError('We couldn\'t reach our server. Please check your connection or call us directly.');
      }
      const body = await res.json().catch(() => ({}));
      if (res.status === 422) {
        const first = (body.errors || [])[0] || {};
        throw new LeadError(body.detail || 'Please check the details and try again.', first.field);
      }
      if (res.status === 429) throw new LeadError(body.detail || 'Too many attempts. Please try again in a minute.');
      if (!res.ok) throw new LeadError('Something went wrong. Please try again or call us directly.');
      return body;
    }
    // Development fallback — no endpoint configured.
    let leads = [];
    try { leads = JSON.parse(localStorage.getItem('leads') || '[]'); } catch { /* ignore */ }
    leads.push(data);
    store.set('leads', JSON.stringify(leads), localStorage);
    console.info('[lead captured — set leadEndpoint in site.config.js to send to your CRM]', data);
    await new Promise((r) => setTimeout(r, 500));
  }

  $$('[data-lead-form]').forEach((form) => {
    form.addEventListener('input', (e) => { if (e.target.closest('.field.is-invalid')) setError(e.target, ''); });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = $('.form-msg', form);
      msg.textContent = ''; msg.classList.remove('is-error');
      if (!validate(form)) return;
      const fd = new FormData(form);
      const kind = form.dataset.leadForm;
      const data = {
        form: kind,
        name: fd.get('name').trim(),
        country_code: fd.get('country_code'),
        phone: normalisePhone(fd.get('country_code'), fd.get('phone')),
        email: fd.get('email').trim(),
        interest: fd.get('interest'),
        trial_date: fd.get('trial_date') || undefined,
        trial_time: fd.get('trial_time') || undefined,
        consent: !!fd.get('consent'),
        website: fd.get('website') || undefined, // honeypot
        page: location.pathname,
        referrer: document.referrer ? document.referrer.slice(0, 500) : undefined,
      };
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach((k) => { const v = store.get(k); if (v) data[k] = v; });

      const btn = $('button[type="submit"]', form);
      const label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Submitting…';
      try {
        await sendLead(data);
        store.set('leadSubmitted', '1', localStorage);
        window.dataLayer && window.dataLayer.push({ event: 'lead_submit', form_type: kind, interest: data.interest });
        const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
        const first = esc(data.name.split(' ')[0]);
        const success = {
          'free-trial': ['Your free trial is booked!', `See you soon, ${first}. We'll call to confirm your trial on ${esc(data.trial_date)} (${esc(data.trial_time)}). Bring sports shoes, a towel and a water bottle.`],
          membership: ['Almost there!', `Thank you, ${first}. Our membership team will call you shortly to confirm your plan and start date.`],
        }[kind] || ['Thank you!', `Thank you, ${first}. Our team will call you back shortly.`];
        form.innerHTML = `<div class="form-success" role="status"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><h3>${success[0]}</h3><p>${success[1]}</p><a class="btn btn--outline" href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener">Chat on WhatsApp</a></div>`;
      } catch (err) {
        btn.disabled = false; btn.textContent = label;
        // Server-side validation error on a specific field → show it next to that field.
        const fieldMap = { country_code: 'phone' };
        const input = err.field && form.elements[fieldMap[err.field] || err.field];
        if (input && input.closest && input.closest('.field')) { setError(input, err.message); input.focus(); }
        else { msg.textContent = err.message || 'Something went wrong. Please try again or call us directly.'; msg.classList.add('is-error'); }
      }
    });
  });

  /* ---------- BMI & calorie calculator ---------- */
  // Asian BMI cut-offs (WHO expert consultation): <18.5, 18.5–22.9, 23–24.9, ≥25.
  const BANDS = [[18.5, 'Underweight', 'under'], [23, 'Healthy', 'ok'], [25, 'Overweight', 'over'], [Infinity, 'Obese', 'obese']];
  $$('[data-bmi]').forEach((w) => {
    const inp = (k) => $(`[data-in="${k}"]`, w), out = (k) => $(`[data-out="${k}"]`, w);
    const fill = (el) => el.style.setProperty('--p', `${((el.value - el.min) / (el.max - el.min)) * 100}%`);
    const calc = () => {
      const cm = +inp('height').value, kg = +inp('weight').value, age = +inp('age').value;
      const male = $('[data-in="sex"]:checked', w).value === 'm';
      const m = cm / 100, bmi = kg / (m * m);
      const [, band, cls] = BANDS.find(([max]) => bmi < max);
      const tdee = (10 * kg + 6.25 * cm - 5 * age + (male ? 5 : -161)) * 1.55; // Mifflin-St Jeor × moderate activity
      out('height').textContent = `${cm} cm`;
      out('weight').textContent = `${kg} kg`;
      out('age').textContent = `${age} yrs`;
      out('bmi').textContent = bmi.toFixed(1);
      const b = out('band'); b.textContent = band; b.dataset.band = cls;
      out('healthy').textContent = `${(18.5 * m * m).toFixed(0)} – ${(22.9 * m * m).toFixed(0)} kg`;
      out('tdee').textContent = `${Math.round(tdee / 10) * 10} kcal/day`;
      out('protein').textContent = `${Math.round(kg * 1.6)} g/day`;
      // Marker position on a 15–35 scale.
      $('[data-bar="marker"]', w).style.left = `${Math.min(100, Math.max(0, ((bmi - 15) / 20) * 100))}%`;
      $$('input[type="range"]', w).forEach(fill);
    };
    $$('input', w).forEach((i) => i.addEventListener('input', calc));
    calc();
  });

  /* ---------- Program filters ---------- */
  const filters = $('[data-filters]');
  if (filters) {
    const cards = $$('[data-program-grid] .program-card');
    const label = $('[data-count-label]'), empty = $('[data-empty]');
    const sels = $$('[data-filter]', filters);
    const qs = new URLSearchParams(location.search);
    sels.forEach((s) => { const v = qs.get(s.name); if (v && [...s.options].some((o) => o.value === v)) s.value = v; });
    const apply = () => {
      const f = Object.fromEntries(sels.map((s) => [s.name, s.value]));
      let shown = 0;
      cards.forEach((c) => {
        const d = c.dataset;
        const [lo, hi] = f.intensity ? f.intensity.split('-').map(Number) : [1, 5];
        const ok = (!f.category || d.category === f.category) && (!f.level || d.level === f.level) && (+d.intensity >= lo && +d.intensity <= hi);
        c.classList.toggle('is-hidden', !ok);
        if (ok) { shown++; c.classList.add('is-visible'); }
      });
      label.textContent = `${shown} program${shown === 1 ? '' : 's'}${shown < cards.length ? ' match your filters' : ''}`;
      empty.hidden = shown > 0;
      const p = new URLSearchParams();
      Object.entries(f).forEach(([k, v]) => v && p.set(k, v));
      history.replaceState(null, '', p.toString() ? `?${p}` : location.pathname);
    };
    sels.forEach((s) => s.addEventListener('change', apply));
    filters.addEventListener('reset', () => setTimeout(apply));
    apply();
  }

  /* ---------- Program page: sub-nav highlight & sticky enquire ---------- */
  const subnav = $('[data-subnav]');
  if (subnav && 'IntersectionObserver' in window) {
    const links = $$('a', subnav);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${en.target.id}`));
        const active = links.find((l) => l.classList.contains('is-active'));
        const ul = $('ul', subnav);
        if (active) ul.scrollTo({ left: active.offsetLeft - ul.clientWidth / 2 + active.clientWidth / 2, behavior: 'smooth' });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach((l) => { const s = document.getElementById(l.getAttribute('href').slice(1)); s && io.observe(s); });
  }
  const sticky = $('[data-sticky-enquire]');
  const pHero = $('.project-hero');
  if (sticky && pHero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => sticky.classList.toggle('is-visible', !en.isIntersecting), { threshold: 0.1 }).observe(pHero);
  }
})();
