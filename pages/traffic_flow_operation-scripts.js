// About page script (minimal)
// - Header "scrolled" state
// - Scroll-to-top visibility + click behavior
// - Click-to-enlarge for selected figures (.click-enlarge)
// - "On This Page" hamburger menu (section jump)

(() => {
  const header = document.getElementById('header');
  const scrollToTopBtn = document.getElementById('scrollToTop');

  if (!header || !scrollToTopBtn) return;

  // ---------- On This Page (hamburger) ----------
  const onPageNav = document.getElementById('onPageNav');
  const onPageBtn = document.getElementById('onPageBtn');
  const onPagePanel = document.getElementById('onPagePanel');

  function closeOnPageMenu() {
    if (!onPageNav || !onPageBtn) return;
    onPageNav.classList.remove('open');
    onPageBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleOnPageMenu() {
    if (!onPageNav || !onPageBtn) return;
    const isOpen = onPageNav.classList.toggle('open');
    onPageBtn.setAttribute('aria-expanded', String(isOpen));
  }

  if (onPageBtn) {
    onPageBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleOnPageMenu();
    });
  }

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!onPageNav) return;
    if (onPageNav.contains(e.target)) return;
    closeOnPageMenu();
  });

  // Close on ESC (also closes image overlay below)
  // Note: This will call both closeOnPageMenu and closeImageOverlay on Escape.
  // That is intentional and harmless.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeOnPageMenu();
      closeImageOverlay();
    }
  });

  // Smooth jump + close after selecting an item
  if (onPagePanel) {
    onPagePanel.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      e.preventDefault();
      const id = link.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;

      closeOnPageMenu();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

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
  let overlayResizeHandler = null;

  function closeImageOverlay() {
    const overlay = document.querySelector('.image-overlay');
    if (!overlay) return;

    // remove resize listener if it exists
    if (overlayResizeHandler) {
      window.removeEventListener('resize', overlayResizeHandler);
      overlayResizeHandler = null;
    }

    overlay.remove();
    document.body.style.overflow = '';
  }

  // compute overlay image max size = min(85vw, 96vh, natural size)
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

    // size correctly once loaded (naturalWidth/Height available)
    const onLoad = () => fitOverlayImageToViewport(img);
    if (img.complete) {
      // If cached and already loaded
      onLoad();
    } else {
      img.addEventListener('load', onLoad, { once: true });
    }

    // keep it correct on resize/orientation change
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

  // Ensure correct state on initial load
  updateOnScroll();
})();
