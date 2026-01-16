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

  // ---------- Image enlarge logic ----------
  let overlayResizeHandler = null; // NEW

  function closeImageOverlay() {
    const overlay = document.querySelector('.image-overlay');
    if (!overlay) return;

    // NEW: remove resize listener if it exists
    if (overlayResizeHandler) {
      window.removeEventListener('resize', overlayResizeHandler);
      overlayResizeHandler = null;
    }

    overlay.remove();
    document.body.style.overflow = '';
  }

  // NEW: compute overlay image max size = min(85vw, 96vh, natural size)
  function fitOverlayImageToViewport(overlayImg) {
    const vwLimit = window.innerWidth * 0.85;
    const vhLimit = window.innerHeight * 0.96;

    const nw = overlayImg.naturalWidth;
    const nh = overlayImg.naturalHeight;

    if (!nw || !nh) return;

    const scale = Math.min(vwLimit / nw, vhLimit / nh, 1);

    overlayImg.style.maxWidth = `${Math.floor(nw * scale)}px`;
    overlayImg.style.maxHeight = `${Math.floor(nh * scale)}px`;
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

    // NEW: size correctly once loaded (naturalWidth/Height available)
    const onLoad = () => fitOverlayImageToViewport(img);
    if (img.complete) {
      // If cached and already loaded
      onLoad();
    } else {
      img.addEventListener('load', onLoad, { once: true });
    }

    // NEW: keep it correct on resize/orientation change
    overlayResizeHandler = () => fitOverlayImageToViewport(img);
    window.addEventListener('resize', overlayResizeHandler);
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
