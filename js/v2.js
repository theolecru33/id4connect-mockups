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

// === Header shadow on scroll ===
const hd = document.getElementById('hd2');
if (hd) {
  const onScroll = () => {
    if (window.scrollY > 8) hd.classList.add('is-scrolled');
    else hd.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
