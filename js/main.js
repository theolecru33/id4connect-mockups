// === Theme toggle ===
const themeBtn = document.getElementById('themeBtn');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const html = document.documentElement;
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    try { localStorage.setItem('id4-theme', next); } catch(e) {}
  });
}

// === Sticky header ===
const hd = document.getElementById('hd');
if (hd) {
  const onScroll = () => {
    if (window.scrollY > 8) hd.classList.add('is-scrolled');
    else hd.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// === Reveal on viewport entry ===
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// === Counter animation ===
const counters = document.querySelectorAll('.ct');
if (counters.length && 'IntersectionObserver' in window) {
  const cobs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur = target > 50 ? 1400 : 900;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(eased * target);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cobs.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => cobs.observe(el));
}

// === Cellc bar live wiggle (subtle, only on hero) ===
(function liveBars() {
  const bars = document.querySelectorAll('.mock--hero .cellc__bar span');
  if (!bars.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const baselines = Array.from(bars).map(b => parseFloat(b.style.width));
  let frame = 0;
  function loop() {
    frame++;
    bars.forEach((b, i) => {
      const base = baselines[i];
      const delta = Math.sin((frame + i * 30) * 0.04) * 4 + Math.sin((frame + i * 17) * 0.09) * 2;
      const next = Math.max(20, Math.min(96, base + delta));
      b.style.width = next + '%';
    });
    requestAnimationFrame(loop);
  }
  setTimeout(() => requestAnimationFrame(loop), 800);
})();

// === Live throughput numbers in hero (subtle change) ===
(function liveNums() {
  const el = document.querySelector('.mock__events .big');
  if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let n = 2847391;
  setInterval(() => {
    n += Math.floor(Math.random() * 90 + 30);
    el.textContent = n.toLocaleString('fr-FR');
  }, 2000);
})();
