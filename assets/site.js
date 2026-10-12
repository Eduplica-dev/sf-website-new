/* Eduplica — eduplica.com · site behaviour
   Sections: nav + menu · reveals · milestones carousel · community board · contact form · parallax */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mqTablet = window.matchMedia('(min-width: 700px)');
  const mqDesktop = window.matchMedia('(min-width: 1200px)');
  const layout = () => (mqDesktop.matches ? 'desktop' : mqTablet.matches ? 'tablet' : 'phone');

  /* ---------------- nav ---------------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------- menu (phone + tablet) ---------------- */
  const menu = document.getElementById('menu');
  const menuBtn = document.getElementById('menuBtn');
  const menuClose = document.getElementById('menuClose');
  let lastFocus = null;
  function openMenu() {
    lastFocus = document.activeElement;
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('is-open'));
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    menuClose.focus();
  }
  function closeMenu() {
    menu.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => { menu.hidden = true; }, reduceMotion ? 0 : 250);
    if (lastFocus) lastFocus.focus();
  }
  menuBtn.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  menu.addEventListener('click', (e) => { if (e.target === menu) closeMenu(); });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) closeMenu(); });
  mqDesktop.addEventListener('change', (e) => { if (e.matches && !menu.hidden) closeMenu(); });

  /* ---------------- scroll reveals ---------------- */
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const groups = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const parent = el.closest('section, footer') || document.body;
        const n = groups.get(parent) || 0;
        groups.set(parent, n + 1);
        el.style.transitionDelay = (Math.min(n, 6) * 80) + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach((el) => io.observe(el));
    // staggered counters reset per section after a frame so each section starts at 0
    setInterval(() => groups.clear(), 600);
  }

  /* ---------------- community board: fills cell by cell ---------------- */
  const board = document.getElementById('board');
  if (board && !reduceMotion && 'IntersectionObserver' in window) {
    board.classList.add('is-filling');
    const cells = board.querySelectorAll('.board__cell--img, .board__cell--num');
    cells.forEach((c, i) => { c.style.animationDelay = (i * 140) + 'ms'; });
    const bo = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        board.classList.remove('is-filling');
        board.classList.add('is-solved');
        bo.disconnect();
      }
    }, { threshold: 0.5 });
    bo.observe(board);
  }

  /* ---------------- milestones ----------------
     One entry per released version. The release agent only adds an entry here:
     { v, date ('Mon YYYY'), title (≤22 chars), bullets (1–4, ≤34 chars each) }. Newest last. */
  const MILESTONES = [
    { v: 'v0.9',     date: 'Jun 2025', title: 'First beta', bullets: ['Early test build, new layout'] },
    { v: 'v1.0',     date: 'May 2026', title: 'Store launch', bullets: ['Launch on both app stores', 'Numbers, animals or food sets', 'Arcade, Classic and Calendar modes'] },
    { v: 'v1.0.1',   date: 'May 2026', title: 'Smoother play', bullets: ['Haptic feedback on moves', 'Scoreboard and tools fixes', 'Shop prices load live'] },
    { v: 'v1.0.2',   date: 'Jun 2026', title: 'Shop opens', bullets: ['Shop bundles and purchases', 'Level and calendar fixes', 'Better character unlocking', 'A collectible redesigned'] },
    { v: 'v1.0.3',   date: 'Jun 2026', title: 'Hello, Sudoku Carve', bullets: ['Sudoku Forge is now Sudoku Carve', 'Delete account from Settings', 'Updated Terms and Privacy', 'Smoother gameplay'] },
    { v: 'v1.0.4',   date: 'Jun 2026', title: 'New icon', bullets: ['New app icon', 'Drag & Drop calibrated', 'Cells Customization layout', 'New name in the stores'] },
    { v: 'v1.0.4.1', date: 'Jul 2026', title: 'Rewards and ads', bullets: ['Watch an ad for hints', '7-day streak rewards', 'Double rewards for members', 'Classic mode save fixes'] },
    { v: 'v1.0.5',   date: 'Jul 2026', title: 'Member perks', bullets: ['Unlimited hints for members', 'In-game surveys with rewards', 'New store preview', 'Bug fixes'] },
    { v: 'v1.0.6',   date: 'Jul 2026', title: 'Under the hood', bullets: ['Backend fixes', 'Updated store preview', 'Display fixes'] },
    { v: 'v1.0.7',   date: 'Aug 2026', title: 'Learn as you play', bullets: ['Brand-new guided tutorial', 'New puzzle generator', 'Delete account in the app'] },
    { v: 'v1.0.8',   date: 'Aug 2026', title: 'Jump right in', bullets: ['Skip the tutorial anytime', 'Puzzle generator V3', 'Ads and offline saving fixes', 'Small fixes and polish'] },
    { v: 'v1.0.9',   date: 'Oct 2026', title: 'The big redesign', bullets: ['New home with Daily Rewards', 'Link Account to keep your progress', 'Share a puzzle as a card', 'New character art, made for tablets'] },
    { v: 'v1.0.91',  date: 'Oct 2026', title: 'Polish and fixes', bullets: ['Bug fixes and stability', 'Small polish across the game'] }
  ];

  const track = document.getElementById('cardTrack');
  const carousel = document.getElementById('carousel');
  const vdots = document.getElementById('vdots');
  const vrange = document.getElementById('vrange');
  const vcaption = document.getElementById('vcaption');
  const counters = [document.getElementById('counterTop'), document.getElementById('counterBottom')];
  const prevs = [document.getElementById('prevTop'), document.getElementById('prevBottom')];
  const nexts = [document.getElementById('nextTop'), document.getElementById('nextBottom')];
  const total = MILESTONES.length;
  let start = 0; // index of the first visible card

  function visibleCount() { return layout() === 'desktop' ? 3 : layout() === 'tablet' ? 2 : 1; }

  function renderCards() {
    track.innerHTML = '';
    MILESTONES.forEach((m, i) => {
      const latest = i === total - 1;
      const li = document.createElement('li');
      li.className = 'mcard' + (latest ? ' mcard--latest' : '');
      li.setAttribute('aria-label', m.v + (m.date ? ', ' + m.date : '') + ': ' + m.title);
      let html = '<div class="mcard__top"><span class="mcard__version">' + m.v + '</span>' + (latest ? '<span class="mcard__latest">LATEST</span>' : '') + '</div>';
      if (m.date) html += '<span class="mcard__date">' + m.date + '</span>';
      html += '<h3 class="mcard__title">' + m.title + '</h3>';
      if (m.bullets.length) {
        html += '<ul class="mcard__bullets">' + m.bullets.map((b) => '<li class="mcard__bullet"><span class="mcard__check">✓</span><span>' + b + '</span></li>').join('') + '</ul>';
      } else {
        html += '<p class="mcard__empty">Details coming soon.</p>';
      }
      li.innerHTML = html;
      track.appendChild(li);
    });
    // every card shares one height (the tallest), so arrows and track never jump
    requestAnimationFrame(() => {
      const cards = track.children;
      let h = 0;
      for (const c of cards) { c.style.minHeight = ''; h = Math.max(h, c.offsetHeight); }
      for (const c of cards) c.style.minHeight = h + 'px';
    });
  }

  function renderDots() {
    vdots.innerHTML = '';
    MILESTONES.forEach((m, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'vdot';
      b.style.left = (total === 1 ? 50 : (i / (total - 1)) * 100) + '%';
      b.setAttribute('aria-label', m.v + ' — ' + m.title);
      b.innerHTML = '<span class="vdot__label">' + m.v + '</span><span class="vdot__tip">' + m.v + ' · ' + m.title + '</span>';
      b.addEventListener('click', () => goTo(i - visibleCount() + 1));
      vdots.appendChild(b);
    });
  }

  function clampStart(s) { return Math.max(0, Math.min(s, total - visibleCount())); }

  function update() {
    const n = visibleCount();
    start = clampStart(start);
    const first = track.children[0];
    if (!first) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const step = first.getBoundingClientRect().width + gap;
    track.style.transform = 'translateX(' + (-start * step) + 'px)';
    const end = start + n; // exclusive
    counters.forEach((c) => { if (c) c.textContent = (n === 1 ? (start + 1) : (start + 1) + '–' + end) + ' of ' + total; });
    prevs.forEach((b) => { if (b) b.disabled = start === 0; });
    nexts.forEach((b) => { if (b) b.disabled = end >= total; });
    // version track
    const dots = vdots.children;
    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.toggle('is-active', i >= start && i < end);
      dots[i].classList.toggle('is-current', i === total - 1 && i >= start && i < end);
    }
    const pct = (i) => (total === 1 ? 50 : (i / (total - 1)) * 100);
    // the purple bar runs from the first visible dot to the last visible dot, inside the line's inset
    const lineL = parseFloat(getComputedStyle(vrange.previousElementSibling).left);
    const wrapW = vrange.parentElement.clientWidth;
    const usable = wrapW - 2 * lineL;
    vrange.style.left = (lineL + usable * pct(start) / 100) + 'px';
    vrange.style.width = (usable * (pct(end - 1) - pct(start)) / 100) + 'px';
    if (vcaption) { const m = MILESTONES[start]; vcaption.textContent = m.v + (m.date ? ' · ' + m.date : ''); }
    // dots inset: keep dots aligned with the line's padding on every size
    vdots.style.left = lineL + 'px'; vdots.style.right = lineL + 'px';
  }

  function goTo(s) { start = clampStart(s); update(); }
  prevs.forEach((b) => b && b.addEventListener('click', () => goTo(start - 1)));
  nexts.forEach((b) => b && b.addEventListener('click', () => goTo(start + 1)));
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { goTo(start - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { goTo(start + 1); e.preventDefault(); }
  });
  carousel.tabIndex = 0;

  // swipe (touch + mouse drag)
  let dragX = null, dragging = false;
  const startDrag = (x) => { dragX = x; dragging = true; track.style.transition = 'none'; };
  const moveDrag = (x) => {
    if (!dragging) return;
    const first = track.children[0]; if (!first) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const step = first.getBoundingClientRect().width + gap;
    track.style.transform = 'translateX(' + (-start * step + (x - dragX)) + 'px)';
  };
  const endDrag = (x) => {
    if (!dragging) return;
    dragging = false;
    track.style.transition = '';
    const dx = x - dragX;
    if (dx < -40) goTo(start + 1); else if (dx > 40) goTo(start - 1); else update();
  };
  track.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
  track.addEventListener('touchmove', (e) => moveDrag(e.touches[0].clientX), { passive: true });
  track.addEventListener('touchend', (e) => endDrag(e.changedTouches[0].clientX));
  track.addEventListener('mousedown', (e) => { startDrag(e.clientX); e.preventDefault(); });
  window.addEventListener('mousemove', (e) => moveDrag(e.clientX));
  window.addEventListener('mouseup', (e) => endDrag(e.clientX));

  renderCards();
  renderDots();
  start = total - visibleCount();
  update();
  let lastLayout = layout();
  window.addEventListener('resize', () => {
    const l = layout();
    if (l !== lastLayout) { lastLayout = l; start = total - visibleCount(); renderCards(); }
    requestAnimationFrame(update);
  });
  // re-measure once fonts are in (card heights change)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { renderCards(); requestAnimationFrame(update); });

  /* ---------------- contact form ----------------
     Until the backend sender ships, "Send message" opens the visitor's email app
     with everything pre-filled, addressed to support@eduplica.com. */
  const form = document.getElementById('contactForm');
  const topics = form.querySelectorAll('.topic');
  const thumb = form.querySelector('.topics__thumb');
  const subject = document.getElementById('fSubject');
  const hint = document.getElementById('formHint');
  const SUBJECTS = {
    'Share your thoughts': ['Account', 'Gameplay', 'Suggestions', 'Other'],
    'Work with us': ['Work'],
    'Invest with us': ['Invest']
  };
  function setTopic(label) {
    topics.forEach((t, i) => {
      const on = t === label;
      t.classList.toggle('is-active', on);
      if (on) thumb.style.transform = 'translateX(' + (i * 100) + '%)';
    });
    const topic = label.querySelector('input').value;
    const opts = SUBJECTS[topic];
    subject.innerHTML = '';
    if (opts.length > 1) {
      subject.appendChild(new Option('Choose a subject', '', true, true)).disabled = true;
      opts.forEach((o) => subject.appendChild(new Option(o, o)));
      subject.disabled = false;
      subject.classList.add('is-placeholder');
    } else {
      subject.appendChild(new Option(opts[0], opts[0], true, true));
      subject.disabled = true;
      subject.classList.remove('is-placeholder');
    }
    hint.hidden = topic !== 'Work with us';
  }
  topics.forEach((t) => t.querySelector('input').addEventListener('change', () => setTopic(t)));
  subject.addEventListener('change', () => subject.classList.toggle('is-placeholder', !subject.value));
  setTopic(form.querySelector('.topic.is-active'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('fEmail');
    const message = document.getElementById('fMessage');
    let ok = true;
    [email, subject, message].forEach((f) => {
      const bad = !f.value || (f === email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
      f.classList.toggle('is-error', bad);
      if (bad && ok) { f.focus(); ok = false; }
    });
    if (!ok) return;
    const topic = form.querySelector('.topic.is-active input').value;
    const subj = '[' + topic + '] ' + subject.value;
    const body = message.value + '\n\n—\nFrom: ' + email.value;
    window.location.href = 'mailto:support@eduplica.com?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
  });

  /* ---------------- download phone: light parallax (desktop + tablet only) ---------------- */
  const phone = document.getElementById('parallaxPhone');
  if (phone && !reduceMotion) {
    let ticking = false;
    const run = () => {
      ticking = false;
      if (layout() === 'phone') { phone.style.translate = ''; return; }
      const card = phone.closest('.download__card');
      const r = card.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      const p = Math.min(1, Math.max(0, 1 - (r.top + r.height * 0.5) / (vh + r.height * 0.5))); // 0 → 1 as the card scrolls up
      phone.style.translate = '0 ' + Math.round(40 - p * 56) + 'px';
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
    run();
  }
})();
