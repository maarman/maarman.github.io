// About page script (minimal)
// - Header "scrolled" state
// - Scroll-to-top visibility + click behavior

(() => {
  const header = document.getElementById('header');
  const scrollToTopBtn = document.getElementById('scrollToTop');

  if (!header || !scrollToTopBtn) return;

  function updateOnScroll() {
    // Header background on scroll
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Show/hide scroll-to-top button
    if (window.scrollY > 500) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', updateOnScroll, { passive: true });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Ensure correct state on initial load
  updateOnScroll();
})();
