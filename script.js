/**
 * Skin By Celine 2 — Luxury Nail Salon & Skincare
 * Vanilla JS — Mobile menu, scroll effects, Intersection Observer animations
 */

(function () {
  'use strict';

  /* ============================================================
     UTILITY HELPERS
     ============================================================ */

  /**
   * Query a single DOM element
   * @param {string} selector
   * @param {Element} [ctx=document]
   * @returns {Element|null}
   */
  const $ = (selector, ctx = document) => ctx.querySelector(selector);

  /**
   * Query all matching DOM elements
   * @param {string} selector
   * @param {Element} [ctx=document]
   * @returns {NodeList}
   */
  const $$ = (selector, ctx = document) => ctx.querySelectorAll(selector);

  /* ============================================================
     STICKY HEADER — add .scrolled class on scroll
     ============================================================ */
  const header = $('#site-header');

  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Initial check
  handleHeaderScroll();
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  /* ============================================================
     MOBILE MENU
     ============================================================ */
  const hamburger    = $('#hamburger');
  const mobileDrawer = $('#mobile-drawer');
  const mobileLinks  = $$('.mobile-nav-link');

  let isMenuOpen = false;

  function openMenu() {
    isMenuOpen = true;
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isMenuOpen = false;
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  // Close when a nav link is clicked
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
      hamburger.focus();
    }
  });

  /* ============================================================
     INTERSECTION OBSERVER — fade-up animations
     ============================================================ */
  const animatedEls = $$('.animate-fade-up');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback — show all immediately for older browsers
    animatedEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ============================================================
     HERO IMAGE — subtle parallax + loaded class
     ============================================================ */
  const heroBg = $('.hero-bg');

  if (heroBg) {
    if (heroBg.complete) {
      heroBg.classList.add('loaded');
    } else {
      heroBg.addEventListener('load', function () {
        heroBg.classList.add('loaded');
      });
    }
  }

  /* ============================================================
     SMOOTH SCROLL — for anchor links
     ============================================================ */
  $$('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
     BACK TO TOP BUTTON
     ============================================================ */
  const backToTop = $('#back-to-top');

  function handleBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 500) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
  }

  handleBackToTop();
  window.addEventListener('scroll', handleBackToTop, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     STATS COUNTER ANIMATION
     ============================================================ */
  const statNumbers = $$('.stat-number');

  function animateCounter(el, target, decimals, suffix) {
    const duration  = 1800;
    const startTime = performance.now();
    const startVal  = 0;

    function update(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = startVal + (target - startVal) * eased;

      if (decimals > 0) {
        el.textContent = current.toFixed(decimals) + suffix;
      } else {
        el.textContent = Math.floor(current) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = (decimals > 0 ? target.toFixed(decimals) : target) + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el   = entry.target;
          const text = el.textContent.trim();

          // Parse numeric values with optional suffix
          const match = text.match(/^([\d.]+)([^0-9.]*)$/);
          if (match) {
            const num     = parseFloat(match[1]);
            const suffix  = match[2] || '';
            const decimal = match[1].includes('.') ? (match[1].split('.')[1] || '').length : 0;
            animateCounter(el, num, decimal, suffix);
          }

          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) {
      // Only animate purely numeric entries (skip text like "Glen Ridge")
      if (/^[\d.]+/.test(el.textContent.trim())) {
        counterObserver.observe(el);
      }
    });
  }

  /* ============================================================
     ACTIVE NAV LINK — highlight based on scroll position
     ============================================================ */
  const sections = $$('section[id]');
  const navLinks  = $$('.nav-link');

  function setActiveNav() {
    const scrollPos  = window.scrollY + (header ? header.offsetHeight : 0) + 80;
    let currentId    = '';

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();

  /* ============================================================
     GALLERY — keyboard / click lightbox (simple overlay)
     ============================================================ */
  const galleryItems = $$('.gallery-item');

  // Build lightbox elements
  const lightbox    = document.createElement('div');
  lightbox.id       = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Image lightbox');
  lightbox.innerHTML = `
    <div class="lb-overlay"></div>
    <div class="lb-container">
      <button class="lb-close" aria-label="Close lightbox">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <img class="lb-img" src="" alt="" />
      <p class="lb-caption"></p>
    </div>`;

  // Inject minimal lightbox styles
  const lbStyle = document.createElement('style');
  lbStyle.textContent = `
    #lightbox {
      position: fixed; inset: 0; z-index: 9999;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    #lightbox.lb-open { opacity: 1; visibility: visible; }
    .lb-overlay {
      position: absolute; inset: 0;
      background: rgba(29, 18, 10, 0.92);
      backdrop-filter: blur(6px);
    }
    .lb-container {
      position: relative; z-index: 1;
      max-width: min(90vw, 1000px);
      max-height: 90vh;
      display: flex; flex-direction: column; align-items: center; gap: 1rem;
    }
    .lb-img {
      max-width: 100%; max-height: 80vh;
      object-fit: contain;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      transform: scale(0.94); transition: transform 0.3s ease;
    }
    #lightbox.lb-open .lb-img { transform: scale(1); }
    .lb-caption {
      font-family: 'DM Serif Display', serif; font-style: italic;
      font-size: 1rem; color: rgba(255,253,247,0.7); text-align: center;
    }
    .lb-close {
      position: absolute; top: -2.5rem; right: 0;
      width: 40px; height: 40px; border-radius: 50%;
      background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.25);
      color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: background 0.2s;
    }
    .lb-close:hover { background: rgba(255,255,255,0.2); }
    .lb-close svg { width: 18px; height: 18px; }
    .gallery-item { cursor: zoom-in; }
  `;
  document.head.appendChild(lbStyle);
  document.body.appendChild(lightbox);

  const lbImg     = lightbox.querySelector('.lb-img');
  const lbCaption = lightbox.querySelector('.lb-caption');
  const lbClose   = lightbox.querySelector('.lb-close');
  const lbOverlay = lightbox.querySelector('.lb-overlay');

  function openLightbox(imgSrc, altText) {
    lbImg.src        = imgSrc;
    lbImg.alt        = altText;
    lbCaption.textContent = altText;
    lightbox.classList.add('lb-open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('lb-open');
    document.body.style.overflow = '';
  }

  galleryItems.forEach(function (item) {
    const img = item.querySelector('img');
    if (!img) return;

    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'View ' + img.alt);

    item.addEventListener('click', function () {
      // Use higher resolution for lightbox
      const src    = img.src.replace(/w=\d+/, 'w=1400').replace(/q=\d+/, 'q=85');
      openLightbox(src, img.alt);
    });

    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const src = img.src.replace(/w=\d+/, 'w=1400').replace(/q=\d+/, 'q=85');
        openLightbox(src, img.alt);
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbOverlay.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('lb-open')) {
      closeLightbox();
    }
  });

  /* ============================================================
     LAZY IMAGE — add .loaded class once image loads
     ============================================================ */
  function observeLazyImages() {
    const images = $$('img[loading="lazy"]');

    images.forEach(function (img) {
      if (img.complete && img.naturalWidth > 0) {
        img.style.opacity = '1';
      } else {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        img.addEventListener('load', function () {
          img.style.opacity = '1';
        });
        img.addEventListener('error', function () {
          img.style.opacity = '0.5';
        });
      }
    });
  }

  observeLazyImages();

  /* ============================================================
     PHONE LINK — click-to-call tracking (console log)
     ============================================================ */
  $$('a[href^="tel:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      console.log('Click-to-call initiated:', this.href);
    });
  });

  /* ============================================================
     INIT LOG
     ============================================================ */
  console.log('%cSkin By Celine 2 — Luxury Nail Salon & Skincare', 'color:#C5A880;font-family:serif;font-size:14px;');
  console.log('%c222 Ridgewood Ave, Glen Ridge, NJ 07028 | (772) 274-4886', 'color:#5A4634;font-size:11px;');

})();
