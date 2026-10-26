/**
 * IITian Tattva | Shared Interactions & Reusable Component Logic
 */

/**
 * Defensive initializer wrapper: isolates component failures so a breakdown in
 * one subsystem (e.g. video player or 3D tilt) never breaks Lenis smooth scroll,
 * navigation, or auth modals.
 */
function safeInit(name, fn) {
  try {
    fn();
  } catch (err) {
    console.warn(`[Tattva UI] Error initializing "${name}":`, err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  safeInit('LenisSmoothScroll', initLenisSmoothScroll);
  safeInit('MotionLibraries', initMotionAndKineticLibraries);
  safeInit('Navigation', initNavigation);
  safeInit('NavbarScrollAnimation', initNavbarScrollAnimation);
  safeInit('MobileMenu', initMobileMenu);
  safeInit('HeroVideoPlayer', initHeroVideoPlayer);
  safeInit('QuizSandbox', initQuizSandbox);
  safeInit('RoadmapPhases', initRoadmapPhases);
  safeInit('ContactForm', initContactForm);
  safeInit('ResourcesScrollParallax', initResourcesScrollParallax);
  safeInit('PredictiveHoverPrefetcher', initGlobalPredictivePrefetcher);
});

/**
 * 0. High-Performance Lenis Smooth Scroll Engine
 */
function initLenisSmoothScroll() {
  if (typeof window.Lenis === 'undefined') return;

  const hasGSAP = typeof window.gsap !== 'undefined';

  const lenis = new window.Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
    autoRaf: !hasGSAP,
    anchors: false,
    respectReducedMotion: true,
  });

  window.lenis = lenis;

  // Seamlessly synchronize Lenis with GSAP ScrollTrigger if present
  if (hasGSAP && typeof window.ScrollTrigger !== 'undefined') {
    window.gsap.registerPlugin(window.ScrollTrigger);
    lenis.on('scroll', window.ScrollTrigger.update);
    window.gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    window.gsap.ticker.lagSmoothing(0);
  }

  // Intercept anchor clicks and smoothly scroll with header offset
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href && href.length > 1 && !href.startsWith('#!')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -74, duration: 1.2 });
        }
      }
    });
  });

  // Keep horizontally scrollable tracks, modals, and drawers from fighting smooth vertical scroll
  const preventSelectors = [
    '.hero-cards-track',
    '.directory-card-stack',
    '.bento-lightbox-sheet',
    '.mobile-nav-drawer',
    '.auth-modal-dialog',
    '.gauth-modal-dialog',
    '.prof-modal-dialog',
    '.resources-tabs-wrapper',
    '.portfolio-filter-bar'
  ];
  document.querySelectorAll(preventSelectors.join(', ')).forEach((el) => {
    el.setAttribute('data-lenis-prevent', '');
  });

  // Automatically refresh Lenis dimensions when layout shifts or fonts finish loading
  window.addEventListener('load', () => lenis.resize());
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => lenis.resize());
  }

  return lenis;
}

/**
 * 0b. Awwwards-Grade Motion & Kinetic Choreography (GSAP, ScrollTrigger, SplitType, VanillaTilt, Scramble, Cursor, Fuse, Flip)
 */
function initMotionAndKineticLibraries() {
  initGSAPScrollAnimations();
  initSplitTypeTypography();
  initVanillaTilt3D();
  initCyberScramble();
  initAwwwardsMagneticCursor();
  initFuzzyGlobalSearch();
  initGSAPFlipCardFilters();
}

function initGSAPScrollAnimations() {
  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  // Staggered smooth fade-and-rise entrance for cards
  const cardSelectors = '.grid-card, .testimonial-card, .roadmap-phase-card, .directory-card, .social-feed-card, .step-item';
  const cards = document.querySelectorAll(cardSelectors);
  if (cards.length) {
    cards.forEach((card) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
          once: true
        },
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });
    });
  }

  // Animated stat number count-up
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach((statEl) => {
    const raw = statEl.textContent.trim();
    const match = raw.match(/^([^\d]*)(\d[\d,.]*)(.*)$/);
    if (!match) return;

    const prefix = match[1] || '';
    const numStr = match[2].replace(/,/g, '');
    const suffix = match[3] || '';
    const targetVal = parseFloat(numStr);
    const isFloat = numStr.includes('.');

    if (isNaN(targetVal) || targetVal <= 0) return;

    const counter = { val: 0 };
    ScrollTrigger.create({
      trigger: statEl,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: targetVal,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            const formatted = isFloat 
              ? counter.val.toFixed(1)
              : Math.floor(counter.val).toLocaleString();
            statEl.textContent = `${prefix}${formatted}${suffix}`;
          },
          onComplete: () => {
            statEl.textContent = raw;
          }
        });
      }
    });
  });
}

function initSplitTypeTypography() {
  if (typeof window.SplitType === 'undefined' || typeof window.gsap === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const titleElements = document.querySelectorAll('.hero-headline, .section-title');
  titleElements.forEach((el) => {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = 'true';

    try {
      const split = new window.SplitType(el, { types: 'words, chars' });
      if (split.chars && split.chars.length) {
        window.gsap.from(split.chars, {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true
          },
          y: 22,
          opacity: 0,
          rotateX: -20,
          stagger: 0.015,
          duration: 0.75,
          ease: 'power3.out'
        });
      }
    } catch (e) {
      console.warn('SplitType error on element', el, e);
    }
  });
}

function initVanillaTilt3D() {
  if (typeof window.VanillaTilt === 'undefined') return;
  // Preserve 100% native touch smoothness on mobile & narrow viewports
  if (window.innerWidth <= 900) return;

  const tiltTargets = document.querySelectorAll(
    '.portfolio-grid-layout .grid-card, .roadmap-phase-card, .directory-card'
  );

  tiltTargets.forEach((card) => {
    card.classList.add('has-tilt');
  });

  window.VanillaTilt.init(tiltTargets, {
    max: 6,
    speed: 800,
    glare: true,
    'max-glare': 0.12,
    scale: 1.015,
    perspective: 1200,
    gyroscope: false
  });
}

function initCyberScramble() {
  const scrambleElements = document.querySelectorAll(
    '.resource-badge, .subject-code, .course-tag, .result-badge'
  );
  const chars = '0123456789ABCDEF#@!%&';

  scrambleElements.forEach((el) => {
    el.classList.add('has-scramble-effect');
    const originalText = el.textContent.trim();
    let interval = null;

    el.addEventListener('mouseenter', () => {
      let iteration = 0;
      clearInterval(interval);

      interval = setInterval(() => {
        el.textContent = originalText
          .split('')
          .map((letter, index) => {
            if (index < iteration || letter === ' ' || letter === '-') {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        if (iteration >= originalText.length) {
          clearInterval(interval);
          el.textContent = originalText;
        }

        iteration += 1 / 2;
      }, 30);
    });

    el.addEventListener('mouseleave', () => {
      clearInterval(interval);
      el.textContent = originalText;
    });
  });
}

/**
 * 0c. Awwwards Magnetic Fluid Cursor with Physics Interpolation
 * Active exclusively on fine pointer devices (desktops/laptops). Completely absent on touchscreens.
 */
function initAwwwardsMagneticCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (document.getElementById('tattvaAwwwardsCursor')) return;

  const cursorEl = document.createElement('div');
  cursorEl.id = 'tattvaAwwwardsCursor';
  cursorEl.className = 'awwwards-cursor';
  cursorEl.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div><div class="cursor-text"></div>';
  document.body.appendChild(cursorEl);

  const dot = cursorEl.querySelector('.cursor-dot');
  const ring = cursorEl.querySelector('.cursor-ring');
  const textHint = cursorEl.querySelector('.cursor-text');

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  let isCursorLoopRunning = false;
  let isWindowFocused = true;

  // Smooth lerp RAF loop with self-termination when settled
  function renderCursor() {
    const dx = mouseX - ringX;
    const dy = mouseY - ringY;

    ringX += dx * 0.16;
    ringY += dy * 0.16;

    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    ring.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0)`;
    textHint.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0)`;

    // When distance is negligible (<0.15px), halt loop until next user gesture
    if (Math.abs(dx) < 0.15 && Math.abs(dy) < 0.15) {
      isCursorLoopRunning = false;
      return;
    }

    if (isWindowFocused) {
      requestAnimationFrame(renderCursor);
    } else {
      isCursorLoopRunning = false;
    }
  }

  function wakeCursor() {
    if (!isCursorLoopRunning && isWindowFocused) {
      isCursorLoopRunning = true;
      requestAnimationFrame(renderCursor);
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorEl.classList.add('cursor-active');
    wakeCursor();
  }, { passive: true });

  window.addEventListener('mousedown', () => {
    cursorEl.classList.add('cursor-down');
    wakeCursor();
  });

  window.addEventListener('mouseup', () => {
    cursorEl.classList.remove('cursor-down');
    wakeCursor();
  });

  window.addEventListener('focus', () => {
    isWindowFocused = true;
    wakeCursor();
  });

  window.addEventListener('blur', () => {
    isWindowFocused = false;
  });

  document.addEventListener('mouseleave', () => {
    cursorEl.classList.remove('cursor-active');
  });

  // Dynamic interactive targets
  const interactiveSelector = 'a, button, [role="button"], input, select, textarea, .grid-card, .directory-card, .roadmap-phase-card, .has-scramble-effect';
  
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(interactiveSelector);
    if (target) {
      cursorEl.classList.add('cursor-hover');
      if (target.classList.contains('grid-card') || target.classList.contains('directory-card')) {
        cursorEl.classList.add('cursor-view');
        textHint.textContent = 'EXPLORE';
      } else {
        cursorEl.classList.remove('cursor-view');
        textHint.textContent = '';
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(interactiveSelector);
    if (target) {
      cursorEl.classList.remove('cursor-hover', 'cursor-view');
      textHint.textContent = '';
    }
  });
}

/**
 * 0d. Fuse.js Instant Fuzzy Search (Quick Command Palette triggered with Cmd+K / Ctrl+K or search triggers)
 */
function initFuzzyGlobalSearch() {
  if (typeof window.Fuse === 'undefined') return;
  if (document.getElementById('tattvaSearchModal')) return;

  const isClubHomepage = document.body.classList.contains('home-page');
  const searchItems = isClubHomepage
    ? [
        { title: 'Past Events & Announcements', category: 'Events', url: '/#events' },
        { title: 'Executive Panel 2026–2027', category: 'Panel', url: '/#panel' },
        { title: 'Join BAFSKBC', category: 'Membership', url: '/#membership' },
        { title: 'About the Business Club', category: 'About', url: '/#about' },
        { title: 'Contact BAFSKBC', category: 'Contact', url: '/#contact' }
      ]
    : [
        { title: 'Home & Foundation Hub', category: 'Portal', url: '/' },
        { title: 'Curriculum & Semester Roadmaps', category: 'Roadmaps', url: '/resources/roadmap' },
        { title: 'Qualifier Mock Exam & PYQ Sandbox', category: 'Practice', url: '/resources/quiz' },
        { title: 'Academic Resources & Notes Archive', category: 'Resources', url: '/resources' },
        { title: 'Official Student Directory & Study Groups', category: 'Community', url: '/#directory' },
        { title: 'Join Verified IITM BS Discord & WhatsApp', category: 'Join', url: '/join' },
        { title: 'About IITian Tattva Mission', category: 'About', url: '/about' },
        { title: 'Contact Community Mentors', category: 'Contact', url: '/contact' },
        { title: 'Mathematics for Data Science I & II', category: 'Courses', url: '/resources' },
        { title: 'Statistics for Data Science I & II', category: 'Courses', url: '/resources' },
        { title: 'Computational Thinking & Python', category: 'Courses', url: '/resources' },
        { title: 'Machine Learning Practice (MLP)', category: 'Diploma', url: '/resources' },
        { title: 'Machine Learning Foundations (MLF)', category: 'Diploma', url: '/resources' },
        { title: 'Database Management Systems (DBMS)', category: 'Diploma', url: '/resources' },
        { title: 'Programming, Data Structures & Algorithms', category: 'Diploma', url: '/resources' }
      ];

  const fuse = new window.Fuse(searchItems, {
    keys: ['title', 'category'],
    threshold: 0.35,
    distance: 100
  });

  // Inject Search Palette Modal
  const modal = document.createElement('div');
  modal.id = 'tattvaSearchModal';
  modal.className = 'tattva-search-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="search-modal-backdrop"></div>
    <div class="search-modal-container">
      <div class="search-modal-header">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" id="tattvaSearchInput" class="search-modal-input" placeholder="${isClubHomepage ? 'Search events, panel, membership...' : 'Type to search courses, roadmaps, quizzes, resources...'}" autocomplete="off" />
        <span class="search-kbd-hint">ESC</span>
      </div>
      <div id="tattvaSearchResults" class="search-results-list"></div>
      <div class="search-modal-footer">
        <span><b>&uarr;&darr;</b> to navigate</span>
        <span><b>ENTER</b> to open</span>
        <span>Powered by Fuse.js</span>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const input = modal.querySelector('#tattvaSearchInput');
  const resultsContainer = modal.querySelector('#tattvaSearchResults');
  const backdrop = modal.querySelector('.search-modal-backdrop');

  function openSearch() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    if (window.lenis) window.lenis.stop();
    input.value = '';
    renderResults(searchItems.slice(0, 5));
    setTimeout(() => input.focus(), 80);
  }

  function closeSearch() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (window.lenis) window.lenis.start();
  }

  function renderResults(items) {
    if (!items.length) {
      resultsContainer.innerHTML = '<div class="search-empty-state">No matching subjects, roadmaps or community pages found.</div>';
      return;
    }
    resultsContainer.innerHTML = items.map((item, idx) => `
      <a href="${item.url}" class="search-result-item ${idx === 0 ? 'is-selected' : ''}">
        <div class="search-item-info">
          <span class="search-item-title">${item.title}</span>
          <span class="search-item-cat">${item.category}</span>
        </div>
        <span class="search-item-arrow">&rarr;</span>
      </a>
    `).join('');
  }

  input.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    if (!q) {
      renderResults(searchItems.slice(0, 5));
      return;
    }
    const matches = fuse.search(q).map(res => res.item);
    renderResults(matches);
  });

  backdrop.addEventListener('click', closeSearch);

  // Keyboard shortcut listener: Cmd+K / Ctrl+K or / key
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      modal.classList.contains('is-open') ? closeSearch() : openSearch();
    } else if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeSearch();
    }
  });

  // Attach search triggers across header/nav if present
  document.querySelectorAll('[data-action="open-search"], .header-search-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    });
  });
}

/**
 * 0e. GSAP Flip Card Filter Animations
 * Enables fluid morphing transitions when switching course levels or category tabs
 */
function initGSAPFlipCardFilters() {
  if (typeof window.gsap === 'undefined' || typeof window.Flip === 'undefined') return;
  window.gsap.registerPlugin(window.Flip);

  const filterButtons = document.querySelectorAll('.filter-tab-btn, .portfolio-filter-pill');
  if (!filterButtons.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetGrid = document.querySelector('.portfolio-grid-layout, .resources-cards-grid, .directory-grid');
      if (!targetGrid) return;

      const state = window.Flip.getState(targetGrid.children);
      // Let existing click handler filter visibility
      requestAnimationFrame(() => {
        window.Flip.from(state, {
          duration: 0.5,
          ease: 'power2.out',
          scale: true,
          absolute: true,
          onComplete: () => {
            if (window.lenis) window.lenis.resize();
            if (window.ScrollTrigger) window.ScrollTrigger.refresh();
          }
        });
      });
    });
  });
}

/**
 * 1. Global Navigation & Resources Dropdown
 */
function initNavigation() {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  
  // Highlight active links
  const navLinks = document.querySelectorAll('.nav-item, .mobile-nav-link, .nav-dropdown-item, .mobile-sub-link');
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (!linkHref) return;
    const cleanHref = linkHref.replace(/\/$/, '') || '/';
    
    if (cleanHref === currentPath || (cleanHref !== '/' && currentPath.startsWith(cleanHref))) {
      link.classList.add('active');
      // If dropdown item is active, highlight the parent Resources nav item too
      if (link.classList.contains('nav-dropdown-item') || link.classList.contains('mobile-sub-link')) {
        const resourcesParent = document.getElementById('resourcesNavBtn');
        if (resourcesParent) resourcesParent.classList.add('active');
      }
    }
  });

  // Resources dropdown toggle behavior for click / touch
  const dropdownParent = document.getElementById('resourcesDropdownParent');
  const resourcesNavBtn = document.getElementById('resourcesNavBtn');
  
  if (dropdownParent && resourcesNavBtn) {
    resourcesNavBtn.addEventListener('click', () => {
      // If on mobile or touch, toggle dropdown
      if (window.innerWidth > 768) {
        // Desktop click toggles or navigates
        // Allow hover to work naturally, but let click toggle dropdown state for keyboard/accessibility
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!dropdownParent.contains(e.target)) {
        dropdownParent.classList.remove('active-open');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdownParent.classList.remove('active-open');
      }
    });
  }
}

/**
 * 1b. FLIP Navbar Scroll Interpolation with Hysteresis
 * Dynamically collapses full link navigation into a compact CTA on sustained downward scroll,
 * expanding smoothly upon upward scroll. Driven by requestAnimationFrame with directional thresholds.
 */
function initNavbarScrollAnimation() {
  const topbars = document.querySelectorAll('.hero-topbar');
  if (!topbars.length) return;

  topbars.forEach(topbar => {
    const navPill = topbar.querySelector('.nav-pill');
    if (!navPill) return;

    // Wrap navigation items into .nav-links-track if not already wrapped
    let navTrack = navPill.querySelector('.nav-links-track');
    if (!navTrack) {
      navTrack = document.createElement('div');
      navTrack.className = 'nav-links-track';

      const itemsToMove = Array.from(navPill.children).filter(el => 
        !el.classList.contains('nav-cta-btn') && !el.classList.contains('mobile-menu-toggle')
      );

      const ctaBtn = navPill.querySelector('.nav-cta-btn');
      if (ctaBtn) {
        navPill.insertBefore(navTrack, ctaBtn);
      } else {
        navPill.appendChild(navTrack);
      }

      itemsToMove.forEach(item => navTrack.appendChild(item));
    }

    // Dynamic width measurement for buttery FLIP transition
    function updateDimensions() {
      if (window.innerWidth <= 1024) return;
      navPill.style.removeProperty('--nav-full-width');
      navPill.style.removeProperty('--nav-compact-width');
      navPill.style.width = 'auto';

      const wasCollapsed = navPill.classList.contains('nav-collapsed');
      if (wasCollapsed) navPill.classList.remove('nav-collapsed');

      const fullWidth = Math.ceil(navPill.getBoundingClientRect().width) + 6;
      const ctaBtn = navPill.querySelector('.nav-cta-btn');
      const compactWidth = ctaBtn ? Math.ceil(ctaBtn.getBoundingClientRect().width) + 14 : 180;

      navPill.style.setProperty('--nav-full-width', `${fullWidth}px`);
      navPill.style.setProperty('--nav-compact-width', `${compactWidth}px`);
      navPill.style.removeProperty('width');

      if (wasCollapsed) navPill.classList.add('nav-collapsed');
    }

    // Measure on load and when web fonts finish rendering
    updateDimensions();
    window.updateNavbarDimensions = updateDimensions;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateDimensions);
    }
    window.addEventListener('resize', updateDimensions, { passive: true });
    window.addEventListener('navbar:updated', updateDimensions);
    window.addEventListener('auth:login', () => setTimeout(updateDimensions, 50));
    window.addEventListener('auth:logout', () => setTimeout(updateDimensions, 50));

    // Directional scroll hysteresis with requestAnimationFrame
    let lastScrollY = window.scrollY;
    let scrollDelta = 0;
    let isCollapsed = false;
    let isTicking = false;

    const onScroll = () => {
      if (isTicking) return;
      isTicking = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const diff = currentY - lastScrollY;

        // Topbar frosted glass styling
        if (currentY > 24) {
          topbar.classList.add('is-scrolled');
        } else {
          topbar.classList.remove('is-scrolled');
        }

        // Within top 40px, always expand full navbar
        if (currentY <= 40) {
          if (isCollapsed) {
            isCollapsed = false;
            navPill.classList.remove('nav-collapsed');
          }
          scrollDelta = 0;
          lastScrollY = currentY;
          isTicking = false;
          return;
        }

        // If scroll direction flipped, reset delta accumulator
        if (Math.sign(diff) !== Math.sign(scrollDelta)) {
          scrollDelta = 0;
        }
        scrollDelta += diff;

        // Downward scroll (>= 18px) -> smoothly collapse to CTA button
        if (scrollDelta >= 18) {
          if (!isCollapsed) {
            isCollapsed = true;
            navPill.classList.add('nav-collapsed');
          }
          scrollDelta = 0;
        } else if (scrollDelta <= -12) {
          // Upward scroll (<= -12px) -> smoothly expand full links
          if (isCollapsed) {
            isCollapsed = false;
            navPill.classList.remove('nav-collapsed');
          }
          scrollDelta = 0;
        }

        lastScrollY = currentY;
        isTicking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });
}

/**
 * 2. Mobile Menu Drawer
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('mobileMenuToggle');
  const navDrawer = document.getElementById('mobileNavDrawer');
  
  if (!menuToggle || !navDrawer) return;

  const setHomeDrawerA11y = (hidden) => {
    if (document.body.classList.contains('home-page')) {
      navDrawer.setAttribute('aria-hidden', String(hidden));
    }
  };

  const toggleMenu = () => {
    const isOpen = navDrawer.classList.contains('open');
    if (isOpen) {
      navDrawer.classList.remove('open');
      menuToggle.classList.remove('is-active');
      document.body.style.overflow = '';
      menuToggle.setAttribute('aria-expanded', 'false');
      setHomeDrawerA11y(true);
      if (window.lenis) window.lenis.start();
    } else {
      navDrawer.classList.add('open');
      menuToggle.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      menuToggle.setAttribute('aria-expanded', 'true');
      setHomeDrawerA11y(false);
      if (window.lenis) window.lenis.stop();
    }
  };

  menuToggle.addEventListener('click', toggleMenu);

  // Close drawer when clicking a link
  const drawerLinks = navDrawer.querySelectorAll('a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      navDrawer.classList.remove('open');
      menuToggle.classList.remove('is-active');
      document.body.style.overflow = '';
      setHomeDrawerA11y(true);
      if (window.lenis) window.lenis.start();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
      toggleMenu();
    }
  });
}

/**
 * 3. Hero Video Player Interaction
 */
function initHeroVideoPlayer() {
  const container = document.getElementById('heroVideoContainer');
  const playOverlayBtn = document.getElementById('videoPlayOverlayBtn');
  const playCtrlBtn = document.getElementById('videoPlayCtrlBtn');
  const muteCtrlBtn = document.getElementById('videoMuteCtrlBtn');
  const timeDisplay = document.getElementById('videoTimeDisplay');
  const scrubberFill = document.getElementById('videoScrubberFill');
  const scrubberTrack = document.getElementById('videoScrubberTrack');

  if (!container || !playOverlayBtn) return;

  let isPlaying = false;
  let isMuted = true;
  let currentTime = 14; // in seconds
  const totalDuration = 270; // 4m 30s
  let progressTimer = null;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `0${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const updateScrubber = () => {
    const pct = (currentTime / totalDuration) * 100;
    if (scrubberFill) scrubberFill.style.width = `${pct}%`;
    if (timeDisplay) timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(totalDuration)}`;
  };

  const togglePlay = () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
      container.classList.add('is-playing');
      if (playOverlayBtn) playOverlayBtn.setAttribute('aria-label', 'Pause video');
      progressTimer = setInterval(() => {
        currentTime = (currentTime + 1) % totalDuration;
        updateScrubber();
      }, 1000);
    } else {
      container.classList.remove('is-playing');
      if (playOverlayBtn) playOverlayBtn.setAttribute('aria-label', 'Play video');
      clearInterval(progressTimer);
    }
  };

  playOverlayBtn.addEventListener('click', togglePlay);
  if (playCtrlBtn) playCtrlBtn.addEventListener('click', togglePlay);

  if (muteCtrlBtn) {
    muteCtrlBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      muteCtrlBtn.innerHTML = isMuted
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
    });
  }

  if (scrubberTrack) {
    scrubberTrack.addEventListener('click', (e) => {
      const rect = scrubberTrack.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      currentTime = Math.floor(ratio * totalDuration);
      updateScrubber();
    });
  }

  updateScrubber();
}

/**
 * 4. Interactive Quiz Sandbox
 */
function initQuizSandbox() {
  const options = document.querySelectorAll('.quiz-option-btn');
  const checkBtn = document.getElementById('checkQuizAnswerBtn');
  const nextBtn = document.getElementById('nextQuizQuestionBtn');
  const explanationDrawer = document.getElementById('quizExplanationDrawer');
  let selectedOption = null;

  if (!options.length) return;

  options.forEach(btn => {
    btn.addEventListener('click', () => {
      options.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedOption = btn;
    });
  });

  if (checkBtn && explanationDrawer) {
    checkBtn.addEventListener('click', () => {
      if (!selectedOption) {
        checkBtn.classList.add('btn-shake-feedback');
        setTimeout(() => checkBtn.classList.remove('btn-shake-feedback'), 500);
        return;
      }
      
      const isCorrect = selectedOption.dataset.correct === 'true';
      if (isCorrect) {
        selectedOption.classList.add('correct');
      } else {
        selectedOption.style.borderColor = '#D32F2F';
        selectedOption.style.backgroundColor = '#FFEAEA';
      }

      explanationDrawer.classList.add('visible');
    });
  }

  if (nextBtn && explanationDrawer) {
    nextBtn.addEventListener('click', () => {
      options.forEach(b => {
        b.classList.remove('selected', 'correct');
        b.style.borderColor = '';
        b.style.backgroundColor = '';
      });
      selectedOption = null;
      explanationDrawer.classList.remove('visible');
    });
  }
}

/**
 * 5. Roadmap Phased Tabs
 */
function initRoadmapPhases() {
  const tabs = document.querySelectorAll('.roadmap-phase-tab');
  const cards = document.querySelectorAll('.phase-content-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPhase = tab.dataset.phase;
      
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      cards.forEach(card => {
        if (targetPhase === 'all' || card.dataset.phase === targetPhase) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 6. Contact Form Validation & Submission State
 */
function initContactForm() {
  const form = document.getElementById('tattvaContactForm');
  if (!form) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const subjectInput = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');
  const submitBtn = document.getElementById('contactSubmitBtn');
  const statusBanner = document.getElementById('contactStatusBanner');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    let isValid = true;

    // Name
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Please enter your name');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // Email
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    // Subject
    if (!subjectInput.value.trim()) {
      showError(subjectInput, 'Please select or enter a subject');
      isValid = false;
    } else {
      clearError(subjectInput);
    }

    // Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showError(messageInput, 'Please enter a message (at least 10 characters)');
      isValid = false;
    } else {
      clearError(messageInput);
    }

    return isValid;
  };

  const showError = (input, msg) => {
    const errorElem = input.parentElement.querySelector('.form-validation-error');
    if (errorElem) {
      errorElem.textContent = msg;
      errorElem.classList.add('show');
    }
    input.style.borderColor = '#D32F2F';
  };

  const clearError = (input) => {
    const errorElem = input.parentElement.querySelector('.form-validation-error');
    if (errorElem) {
      errorElem.classList.remove('show');
    }
    input.style.borderColor = '';
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Simulation of honest demo submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>SENDING MESSAGE...</span><span class="cta-black-arrow-box"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg></span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>MESSAGE RECEIVED</span><span class="cta-black-arrow-box"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C6FD50" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></span>`;
      
      if (statusBanner) {
        statusBanner.className = 'submission-status-banner success';
        statusBanner.innerHTML = `<strong>Inquiry Received!</strong><br>Thank you, ${nameInput.value.trim()}. This demo submission has been recorded. In production, this form connects to the IITian Tattva student community desk.`;
      }

      form.reset();
    }, 900);
  });
}

/**
 * 7. Multi-Track Viewport Parallax for Academic Resource Showcases
 * Coordinates parallel transform offsets with IntersectionObserver gating to ensure 0 CPU overhead off-screen.
 */
function initResourcesScrollParallax() {
  const section = document.querySelector('.res-business-section');
  if (!section) return;

  const track1 = document.getElementById('tileTrack1');
  const track2 = document.getElementById('tileTrack2');
  const track3 = document.getElementById('tileTrack3');
  if (!track1 || !track2 || !track3) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let ticking = false;
  let isInView = false;

  const updateParallax = () => {
    if (!isInView) {
      ticking = false;
      return;
    }
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;

    if (rect.bottom > 0 && rect.top < vh) {
      const progress = (vh - rect.top) / (vh + rect.height);
      const centered = progress - 0.5;

      const shift1 = centered * -240;
      const shift2 = centered * 220 - 40;
      const shift3 = centered * -180 - 20;

      track1.style.transform = `translate3d(0, ${shift1.toFixed(1)}px, 0)`;
      track2.style.transform = `translate3d(0, ${shift2.toFixed(1)}px, 0)`;
      track3.style.transform = `translate3d(0, ${shift3.toFixed(1)}px, 0)`;
    }
    ticking = false;
  };

  const onScroll = () => {
    if (isInView && !ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isInView = entry.isIntersecting;
        if (isInView) {
          updateParallax();
        }
      });
    }, { rootMargin: '100px 0px' });
    observer.observe(section);
  } else {
    isInView = true;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateParallax();
}

/**
 * 8. Comprehensive Mobile UX Enhancements
 * - Hero cards swipe pagination dots
 * - Floating mobile quick-action bottom pill
 * - Comparison tab switcher for narrow screens
 * - Bento grid tap-to-expand lightbox
 * - Haptic vibration and drawer swipe-to-dismiss
 */
function initMobileEnhancements() {
  // A. Hero Cards Pagination Dots
  const heroTrack = document.getElementById('heroCardsTrack');
  const heroStage = document.getElementById('heroCardsStage');
  if (heroTrack && heroStage && !document.querySelector('.hero-cards-dots')) {
    const cards = heroTrack.querySelectorAll('.portfolio-card-wrap');
    if (cards.length > 1) {
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'hero-cards-dots';
      
      cards.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = `hero-dot-pill ${idx === 0 ? 'active' : ''}`;
        dotsContainer.appendChild(dot);
      });
      heroStage.appendChild(dotsContainer);

      const dots = dotsContainer.querySelectorAll('.hero-dot-pill');
      heroTrack.addEventListener('scroll', () => {
        const scrollLeft = heroTrack.scrollLeft;
        const cardWidth = cards[0].offsetWidth + 12;
        const activeIndex = Math.round(scrollLeft / cardWidth);
        dots.forEach((d, i) => {
          d.classList.toggle('active', i === Math.min(activeIndex, dots.length - 1));
        });
      }, { passive: true });
    }
  }

  // A2. Directory Cards Pagination Dots
  const dirStack = document.querySelector('.directory-card-stack');
  const dirCol = document.querySelector('.directory-cards-col');
  if (dirStack && dirCol && !document.querySelector('.dir-cards-dots')) {
    const cards = dirStack.querySelectorAll('.dir-stack-card');
    if (cards.length > 1) {
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'dir-cards-dots';
      cards.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = `hero-dot-pill ${idx === 0 ? 'active' : ''}`;
        dotsContainer.appendChild(dot);
      });
      dirCol.appendChild(dotsContainer);

      const dots = dotsContainer.querySelectorAll('.hero-dot-pill');
      dirStack.addEventListener('scroll', () => {
        const scrollLeft = dirStack.scrollLeft;
        const cardWidth = cards[0].offsetWidth + 12;
        const activeIndex = Math.round(scrollLeft / cardWidth);
        dots.forEach((d, i) => {
          d.classList.toggle('active', i === Math.min(activeIndex, dots.length - 1));
        });
      }, { passive: true });
    }
  }

  // B. Floating Mobile Quick-Action Bottom Bar
  if (!document.querySelector('.mobile-bottom-bar')) {
    const bottomBar = document.createElement('div');
    bottomBar.className = 'mobile-bottom-bar';
    bottomBar.innerHTML = `
      <a href="/resources" class="m-bar-btn m-bar-btn-primary">
        <span>EXPLORE RESOURCES</span>
        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
      </a>
      <a href="/join" class="m-bar-btn m-bar-btn-secondary" data-action="open-join-modal">JOIN</a>
    `;
    document.body.appendChild(bottomBar);

    let lastScroll = 0;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          const heroHeight = window.innerHeight * 0.7;
          if (currentScroll > heroHeight) {
            bottomBar.classList.add('visible');
            const diff = currentScroll - lastScroll;
            if (diff > 12) {
              // Fast down-scroll: tuck away
              bottomBar.classList.add('hidden-scroll');
            } else if (diff < -6) {
              // Up-scroll: instantly reveal
              bottomBar.classList.remove('hidden-scroll');
            }
          } else {
            bottomBar.classList.remove('visible');
            bottomBar.classList.remove('hidden-scroll');
          }
          lastScroll = Math.max(0, currentScroll);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // C. Comparison Section Mobile Tab Switcher
  const compGrid = document.querySelector('.nyc-comparison-grid');
  if (compGrid && !document.querySelector('.comparison-tabs-nav')) {
    const wrappers = compGrid.querySelectorAll('.comparison-card-wrapper');
    if (wrappers.length >= 2) {
      const tabsNav = document.createElement('div');
      tabsNav.className = 'comparison-tabs-nav';
      tabsNav.innerHTML = `
        <button type="button" class="comp-tab-btn active" data-target="both">Both</button>
        <button type="button" class="comp-tab-btn" data-target="traditional">What Others Do</button>
        <button type="button" class="comp-tab-btn" data-target="modern">Our Path</button>
      `;
      compGrid.parentNode.insertBefore(tabsNav, compGrid);

      tabsNav.querySelectorAll('.comp-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          tabsNav.querySelectorAll('.comp-tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const target = btn.dataset.target;
          if (target === 'both') {
            wrappers[0].style.display = '';
            wrappers[1].style.display = '';
            compGrid.style.gridTemplateColumns = '1fr 1fr';
          } else if (target === 'traditional') {
            wrappers[0].style.display = 'block';
            wrappers[1].style.display = 'none';
            compGrid.style.gridTemplateColumns = '1fr';
          } else if (target === 'modern') {
            wrappers[0].style.display = 'none';
            wrappers[1].style.display = 'block';
            compGrid.style.gridTemplateColumns = '1fr';
          }
        });
      });
    }
  }

  // D. Bento Grid Lightbox Sheet
  const bentoCards = document.querySelectorAll('.portfolio-grid-layout .grid-card');
  if (bentoCards.length && !document.querySelector('.bento-lightbox-backdrop')) {
    const backdrop = document.createElement('div');
    backdrop.className = 'bento-lightbox-backdrop';
    backdrop.innerHTML = `
      <div class="bento-lightbox-sheet">
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" alt="Preview" class="lightbox-img" style="display:none;">
        <div class="lightbox-body">
          <h3 class="lightbox-title"></h3>
          <p class="lightbox-desc"></p>
          <button type="button" class="lightbox-close-btn">Close Preview</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const sheetImg = backdrop.querySelector('.lightbox-img');
    const sheetTitle = backdrop.querySelector('.lightbox-title');
    const sheetDesc = backdrop.querySelector('.lightbox-desc');
    const closeBtn = backdrop.querySelector('.lightbox-close-btn');

    const closeLightbox = () => {
      backdrop.classList.remove('open');
      if (window.lenis) window.lenis.start();
    };
    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('open')) {
        closeLightbox();
      }
    });

    bentoCards.forEach(card => {
      card.addEventListener('click', () => {
        if (window.innerWidth > 900) return; // Only trigger modal on mobile/tablet
        const img = card.querySelector('.grid-card-img');
        const statNum = card.querySelector('.stat-number');
        const statHead = card.querySelector('.stat-heading');
        const statDesc = card.querySelector('.stat-description');

        if (img) {
          sheetImg.src = img.src;
          sheetImg.alt = img.alt;
          sheetImg.style.display = 'block';
          sheetTitle.textContent = img.alt.split('-')[0] || 'IITian Tattva';
          sheetDesc.textContent = img.alt;
        } else if (statNum) {
          sheetImg.style.display = 'none';
          sheetTitle.textContent = `${statNum.textContent} ${statHead.textContent}`;
          sheetDesc.textContent = statDesc ? statDesc.textContent : 'Connected across terms and diplomas in IITM BS Degree.';
        }
        backdrop.classList.add('open');
        if (window.lenis) window.lenis.stop();
        if ('vibrate' in navigator) navigator.vibrate(15);
      });
    });
  }

  // E. Haptic feedback on mobile drawer & links
  const menuToggle = document.getElementById('mobileMenuToggle');
  if (menuToggle && 'vibrate' in navigator) {
    menuToggle.addEventListener('click', () => {
      navigator.vibrate(20);
    });
  }
}

// Initialize mobile enhancements on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileEnhancements);
} else {
  initMobileEnhancements();
}

/**
 * 9. Lightweight Toast Notification Engine
 * Replaces crude alert() boxes with non-intrusive floating pills.
 */
function showToast(message, variant = 'info', duration = 3200) {
  let container = document.getElementById('tattvaToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'tattvaToastContainer';
    container.className = 'tattva-toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    info: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    success: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
    warning: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    error: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
  };

  const toast = document.createElement('div');
  toast.className = `tattva-toast toast-${variant}`;
  toast.innerHTML = `
    <span class="tattva-toast-icon">${icons[variant] || icons.info}</span>
    <span class="tattva-toast-text">${message}</span>
  `;
  container.appendChild(toast);

  // Trigger enter animation on next frame
  requestAnimationFrame(() => toast.classList.add('visible'));

  // Auto dismiss
  setTimeout(() => {
    toast.classList.remove('visible');
    toast.classList.add('leaving');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/**
 * 10. Unified Platform Runtime Namespace
 * Exposes core modules and utilities cleanly on window without polluting globals.
 */
window.IITianTattva = Object.freeze({
  version: '1.0.0',
  get lenis() { return window.lenis; },
  toast: showToast,
  modules: {
    initLenisSmoothScroll,
    initMotionAndKineticLibraries,
    initNavigation,
    initNavbarScrollAnimation,
    initMobileMenu,
    initHeroVideoPlayer,
    initQuizSandbox,
    initRoadmapPhases,
    initContactForm,
    initResourcesScrollParallax,
    initMobileEnhancements
  }
});

// Ergonomic alias
window.Tattva = window.IITianTattva;

/**
 * 11. Sitewide Predictive Hover Prefetcher (Zero-Lag Route Transitions)
 * Active on every page: detects 65ms intent dwell before triggering background prefetch.
 */
function initGlobalPredictivePrefetcher() {
  if (typeof window === 'undefined') return;

  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn) {
    if (conn.saveData) return;
    if (conn.effectiveType && (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g')) return;
  }

  const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isDesktopPointer) return;

  const prefetchedUrls = new Set();
  const hoverTimers = new WeakMap();

  function triggerPrefetch(url) {
    if (prefetchedUrls.has(url)) return;
    prefetchedUrls.add(url);

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';
    document.head.appendChild(link);
  }

  document.addEventListener('mouseover', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor || !anchor.href) return;

    try {
      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      if (url.pathname.endsWith('.pdf') || url.pathname.endsWith('.zip')) return;
      if (prefetchedUrls.has(url.pathname)) return;

      const timer = setTimeout(() => {
        triggerPrefetch(url.pathname);
      }, 65);

      hoverTimers.set(anchor, timer);
    } catch (_) {}
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const timer = hoverTimers.get(anchor);
    if (timer) {
      clearTimeout(timer);
      hoverTimers.delete(anchor);
    }
  }, { passive: true });
}


