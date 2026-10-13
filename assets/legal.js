/* Eduplica — legal pages behaviour (Terms · Privacy · Delete my data)
   nav + menu (same as the home page) · "On this page" list · delete-data form */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mqDesktop = window.matchMedia('(min-width: 1200px)');

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

  /* ---------------- "On this page" ---------------- */
  const toc = document.getElementById('toc');
  if (toc) {
    const toggle = toc.querySelector('.toc__toggle');
    const links = Array.from(toc.querySelectorAll('.toc__link'));
    const targets = links.map((a) => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    toggle.addEventListener('click', () => {
      const open = toc.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.forEach((a) => a.addEventListener('click', (e) => {
      const el = document.getElementById(a.getAttribute('href').slice(1));
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', '#' + el.id);
      if (!mqDesktop.matches) { toc.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
    }));
    // highlight the section on screen (the one whose heading is above the middle of the viewport)
    function setActive() {
      const line = window.innerHeight * 0.35;
      let current = targets[0];
      for (const t of targets) { if (t.getBoundingClientRect().top <= line) current = t; }
      links.forEach((a) => a.classList.toggle('is-active', current && a.getAttribute('href') === '#' + current.id));
    }
    let ticking = false;
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; setActive(); }); } }, { passive: true });
    setActive();
  }

  /* ---------------- delete-data form ----------------
     The site is static: "Submit" opens the visitor's email app with the request ready,
     addressed to support@eduplica.com (same subject as the in-game Contact Us). */
  const dform = document.getElementById('deleteForm');
  if (dform) {
    const email = document.getElementById('dEmail');
    const reason = document.getElementById('dReason');
    const error = document.getElementById('dError');
    dform.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      email.classList.toggle('is-error', !ok);
      error.hidden = ok;
      if (!ok) { email.focus(); return; }
      const subject = 'Request to delete data';
      const body = 'Please delete all game data linked to this email: ' + email.value.trim() +
        '\n\nReason: ' + (reason.value.trim() || 'not given') +
        '\n\nSent from eduplica.com/delete-data.html';
      const url = 'mailto:support@eduplica.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      dform.dataset.mailto = url;
      window.location.href = url;
      document.getElementById('dRequest').hidden = true;
      const sent = document.getElementById('dSent');
      sent.hidden = false;
      sent.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }
})();
