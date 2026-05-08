// === Live counter + KPIs (Block 1 panel droit) ===
(function liveDashboard() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const counter = document.getElementById('liveCounter');
  const thru = document.getElementById('kpiThroughput');
  const lat = document.getElementById('kpiLatency');
  if (!counter) return;

  let n = 142038291;
  let t = 142;
  let l = 12;

  setInterval(() => {
    n += Math.floor(Math.random() * 280 + 80);
    counter.textContent = n.toLocaleString('fr-FR');
  }, 700);

  setInterval(() => {
    t = 130 + Math.floor(Math.random() * 35);
    if (thru) thru.textContent = t;
  }, 1800);

  setInterval(() => {
    l = 8 + Math.floor(Math.random() * 9);
    if (lat) lat.textContent = l;
  }, 2400);
})();


// === Theme toggle ===
(function themeToggle() {
  const btn = document.getElementById('themeBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const html = document.documentElement;
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    try { localStorage.setItem('id4-theme', next); } catch (e) {}
  });
})();


// === Particles in background ===
(function particles() {
  const wrap = document.getElementById('particles');
  if (!wrap) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const N = window.innerWidth < 720 ? 18 : 36;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < N; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = (60 + Math.random() * 40) + '%';
    p.style.setProperty('--d', (Math.random() * 14) + 's');
    p.style.animationDuration = (10 + Math.random() * 12) + 's';
    frag.appendChild(p);
  }
  wrap.appendChild(frag);
})();


// === Reveal on viewport entry ===
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // Trigger flow animations when canvas enters viewport
  const flowObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      e.target.classList.toggle('is-in', e.isIntersecting);
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.canvas3, .dpanel').forEach(el => flowObs.observe(el));
}

// Stagger delay on connector grid icons
document.querySelectorAll('.ico-grid').forEach(grid => {
  grid.querySelectorAll('li').forEach((li, i) => li.style.setProperty('--i', i));
});


// === Mouse parallax on hero floating cards ===
(function mouseParallax() {
  const root = document.querySelector('[data-parallax-root]');
  if (!root) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 1080) return;

  const cards = root.querySelectorAll('[data-depth]');
  let rect = root.getBoundingClientRect();
  let raf = 0;
  let tx = 0, ty = 0;
  let cx = 0, cy = 0;

  function loop() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    cards.forEach(c => {
      const d = parseFloat(c.dataset.depth) || 0.4;
      const ox = cx * d * 30;
      const oy = cy * d * 18;
      c.style.transform = `rotateY(${-12 + cx * 6}deg) rotateX(${6 - cy * 4}deg) translate3d(${ox}px, ${oy}px, ${d * 30}px)`;
    });
    raf = requestAnimationFrame(loop);
  }

  function handleMouse(e) {
    rect = root.getBoundingClientRect();
    tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  }

  document.addEventListener('mousemove', handleMouse, { passive: true });
  raf = requestAnimationFrame(loop);

  window.addEventListener('resize', () => { rect = root.getBoundingClientRect(); }, { passive: true });
})();


// === Scroll parallax on hero cards (subtle vertical) ===
(function scrollParallax() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cards = document.querySelectorAll('.float-card');
  if (!cards.length) return;

  function onScroll() {
    const y = window.scrollY;
    cards.forEach((c, i) => {
      const offset = (y * (0.05 + i * 0.04));
      c.style.setProperty('--scroll-y', offset + 'px');
      c.style.translate = `0 ${offset}px`;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();


// === Tab switcher for fabrics ===
(function tabs() {
  const tabBtns = document.querySelectorAll('.fab-tab');
  const panels = document.querySelectorAll('.fab-panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.toggle('is-active', b === btn));
      panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === id));
    });
  });
})();


// === Header subtle background change on scroll ===
(function stickyHeader() {
  const hd = document.getElementById('hd3');
  if (!hd) return;
  function onScroll() {
    if (window.scrollY > 8) hd.classList.add('is-scrolled');
    else hd.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();


// === Dynamic SVG path drawing for canvas3 (Block 2) ===
// Computes actual node edge positions and draws connecting paths.
(function canvasPaths() {
  const svg = document.getElementById('canvas3Svg');
  const canvas = document.getElementById('canvas3');
  if (!svg || !canvas) return;

  const NS = 'http://www.w3.org/2000/svg';

  function build() {
    // Wipe previous animated paths (keep <defs>)
    Array.from(svg.querySelectorAll('path')).forEach(p => p.remove());

    const cb = canvas.getBoundingClientRect();
    const reef = canvas.querySelector('.node--reef');
    const cell = canvas.querySelector('.node--cell');
    const crud = canvas.querySelector('.node--crud');
    const ioIn = canvas.querySelector('.canvas3__io--in');
    const ioOut = canvas.querySelector('.canvas3__io--out');
    if (!reef || !cell || !crud) return;

    svg.setAttribute('viewBox', `0 0 ${cb.width} ${cb.height}`);

    const rect = el => {
      const r = el.getBoundingClientRect();
      return { x: r.left - cb.left, y: r.top - cb.top, w: r.width, h: r.height };
    };

    const reefR = rect(reef);
    const cellR = rect(cell);
    const crudR = rect(crud);
    const inR = ioIn ? rect(ioIn) : { x: 0, y: cellR.y + cellR.h / 2, w: 0, h: 0 };
    const outR = ioOut ? rect(ioOut) : { x: cb.width, y: cellR.y + cellR.h / 2, w: 0, h: 0 };

    const cellLeftX = cellR.x;
    const cellRightX = cellR.x + cellR.w;
    const cellTopY = cellR.y;
    const cellBottomY = cellR.y + cellR.h;
    const cellCenterX = cellR.x + cellR.w / 2;
    const cellCenterY = cellR.y + cellR.h / 2;
    const reefBottomY = reefR.y + reefR.h;
    const crudTopY = crudR.y;
    const inX = inR.x + inR.w;
    const inY = inR.y + inR.h / 2;
    const outX = outR.x;
    const outY = outR.y + outR.h / 2;

    // Path defs : (x1,y1)-(x2,y2), gradient id, animation delay, optional vert flag
    const paths = [
      // 1) Source → DataCell (horizontal entry)
      { d: `M${inX} ${inY} L${cellLeftX} ${cellCenterY}`, grad: 'orange-line', delay: 0, vert: false },
      // 2) DataCell → Destination (horizontal exit)
      { d: `M${cellRightX} ${cellCenterY} L${outX} ${outY}`, grad: 'orange-line', delay: 1.4, vert: false },
      // 3) DataGraph → DataCell (vertical, top→down)
      { d: `M${cellCenterX} ${reefBottomY} L${cellCenterX} ${cellTopY}`, grad: 'orange-vert', delay: 0.7, vert: true },
      // 4) DataCell → Actions (vertical, top→down)
      { d: `M${cellCenterX} ${cellBottomY} L${cellCenterX} ${crudTopY}`, grad: 'orange-vert', delay: 2.1, vert: true }
    ];

    // Static base lines first
    paths.forEach(p => {
      const base = document.createElementNS(NS, 'path');
      base.setAttribute('d', p.d);
      base.setAttribute('stroke', 'currentColor');
      base.setAttribute('stroke-opacity', '0.10');
      base.setAttribute('stroke-width', '1');
      if (p.vert) base.setAttribute('stroke-dasharray', '3 4');
      base.setAttribute('fill', 'none');
      svg.appendChild(base);
    });

    // Animated flow lines on top
    paths.forEach(p => {
      const flow = document.createElementNS(NS, 'path');
      flow.setAttribute('d', p.d);
      flow.setAttribute('stroke', `url(#${p.grad})`);
      flow.setAttribute('stroke-width', '2');
      flow.setAttribute('fill', 'none');
      flow.setAttribute('class', 'flow-line' + (p.vert ? ' flow-line--vert' : ''));
      flow.style.setProperty('--d', p.delay + 's');
      svg.appendChild(flow);
    });
  }

  build();
  let raf = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(build);
  }, { passive: true });
  // Rebuild after fonts/layout settle
  setTimeout(build, 200);
  setTimeout(build, 600);
})();


// === Dynamic SVG path drawing for fab-viz (Block 3 fabrics) ===
(function fabVizPaths() {
  const NS = 'http://www.w3.org/2000/svg';

  function buildOne(viz) {
    const svg = viz.querySelector('.fab-viz__paths');
    if (!svg) return;
    Array.from(svg.querySelectorAll('path')).forEach(p => p.remove());

    const vb = viz.getBoundingClientRect();
    const inItems = viz.querySelectorAll('.fab-src[data-side="in"] li');
    const outItems = viz.querySelectorAll('.fab-src[data-side="out"] li');
    const hub = viz.querySelector('.fab-viz__hub');
    if (!hub || !inItems.length) return;

    svg.setAttribute('viewBox', `0 0 ${vb.width} ${vb.height}`);

    const rect = el => {
      const r = el.getBoundingClientRect();
      return {
        x: r.left - vb.left,
        y: r.top - vb.top,
        w: r.width,
        h: r.height,
        cx: r.left - vb.left + r.width / 2,
        cy: r.top - vb.top + r.height / 2,
        right: r.right - vb.left,
        left: r.left - vb.left
      };
    };

    const hubR = rect(hub);
    const hubLeft = hubR.left;
    const hubRight = hubR.right;
    const hubCy = hubR.cy;

    // IN paths : from each src item right edge → hub left edge
    Array.from(inItems).forEach((li, i) => {
      const lr = rect(li);
      const startX = lr.right;
      const startY = lr.cy;
      const endX = hubLeft;
      const endY = hubCy;
      const ctrlX = (startX + endX) / 2;
      const d = `M${startX} ${startY} Q${ctrlX} ${startY} ${endX} ${endY}`;

      const base = document.createElementNS(NS, 'path');
      base.setAttribute('d', d);
      base.setAttribute('stroke', 'currentColor');
      base.setAttribute('stroke-opacity', '0.12');
      base.setAttribute('stroke-width', '1');
      base.setAttribute('fill', 'none');
      svg.appendChild(base);

      const flow = document.createElementNS(NS, 'path');
      flow.setAttribute('d', d);
      flow.setAttribute('stroke', 'url(#cyan-flow)');
      flow.setAttribute('stroke-width', '2');
      flow.setAttribute('fill', 'none');
      flow.setAttribute('class', 'fab-flow');
      flow.style.setProperty('--d', (i * 0.4) + 's');
      svg.appendChild(flow);
    });

    // OUT paths : from hub right edge → each dst item left edge
    Array.from(outItems).forEach((li, i) => {
      const lr = rect(li);
      const startX = hubRight;
      const startY = hubCy;
      const endX = lr.left;
      const endY = lr.cy;
      const ctrlX = (startX + endX) / 2;
      const d = `M${startX} ${startY} Q${ctrlX} ${endY} ${endX} ${endY}`;

      const base = document.createElementNS(NS, 'path');
      base.setAttribute('d', d);
      base.setAttribute('stroke', 'currentColor');
      base.setAttribute('stroke-opacity', '0.12');
      base.setAttribute('stroke-width', '1');
      base.setAttribute('fill', 'none');
      svg.appendChild(base);

      const flow = document.createElementNS(NS, 'path');
      flow.setAttribute('d', d);
      flow.setAttribute('stroke', 'url(#orange-flow)');
      flow.setAttribute('stroke-width', '2');
      flow.setAttribute('fill', 'none');
      flow.setAttribute('class', 'fab-flow fab-flow--out');
      flow.style.setProperty('--d', (1.8 + i * 0.4) + 's');
      svg.appendChild(flow);
    });
  }

  function buildAll() {
    document.querySelectorAll('[data-fab-viz]').forEach(buildOne);
  }

  buildAll();
  let raf = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(buildAll);
  }, { passive: true });
  setTimeout(buildAll, 200);
  setTimeout(buildAll, 600);

  // Rebuild when tab switches (panels appear/disappear)
  document.querySelectorAll('.fab-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      requestAnimationFrame(() => requestAnimationFrame(buildAll));
    });
  });
})();
