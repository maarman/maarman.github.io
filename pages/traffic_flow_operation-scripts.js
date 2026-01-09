// About page script (minimal)
// - Header "scrolled" state
// - Scroll-to-top visibility + click behavior
// - Click-to-enlarge for selected figures (.click-enlarge)


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

  // ---------- Image enlarge logic (added) ----------
  function closeImageOverlay() {
    const overlay = document.querySelector('.image-overlay');
    if (!overlay) return;
    overlay.remove();
    document.body.style.overflow = '';
  }

  function openImageOverlay(imgEl) {
    closeImageOverlay(); // ensure only one overlay

    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';

    const img = document.createElement('img');
    img.src = imgEl.currentSrc || imgEl.src;
    img.alt = imgEl.alt || '';

    overlay.appendChild(img);

    // lock background scroll (mobile/tablet)
    document.body.style.overflow = 'hidden';

    // click/tap anywhere closes
    overlay.addEventListener('click', closeImageOverlay);

    document.body.appendChild(overlay);
  }

  // only images explicitly marked as clickable
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLImageElement)) return;
    if (!target.classList.contains('click-enlarge')) return;

    openImageOverlay(target);
  });

  // ESC closes overlay (desktop only)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeImageOverlay();
    }
  });
	
  // Ensure correct state on initial load
  updateOnScroll();
})();
