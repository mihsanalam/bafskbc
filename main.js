/**
 * ProjectOne Hero Section Micro-Interactions & Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. ELASTIC PROXIMITY WAVE ON HERO HEADLINE
  const headlineRows = document.querySelectorAll('#heroHeadline .headline-row');
  if (headlineRows.length) {
    headlineRows.forEach(row => {
      const text = row.textContent.trim();
      row.innerHTML = '';
      const words = text.split(' ');

      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'hero-word';

        word.split('').forEach(char => {
          const charSpan = document.createElement('span');
          charSpan.className = 'hero-char';
          charSpan.textContent = char;

          charSpan.addEventListener('pointerenter', () => {
            charSpan.classList.add('is-hovered');
          });

          charSpan.addEventListener('pointerleave', () => {
            charSpan.classList.remove('is-hovered');
          });

          wordSpan.appendChild(charSpan);
        });

        row.appendChild(wordSpan);

        // Add space between words (except last word)
        if (wordIndex < words.length - 1) {
          const spaceSpan = document.createElement('span');
          spaceSpan.className = 'hero-char hero-space';
          spaceSpan.innerHTML = '&nbsp;';
          row.appendChild(spaceSpan);
        }
      });
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 0.1. INTERACTIVE LIQUID FLOW & NEBULA TRAIL (Exact Verified Working Loop)
  const heroEl = document.getElementById('hero');
  const fluidCanvas = document.getElementById('heroFluidCanvas');

  if (heroEl && fluidCanvas) {
    const ctx = fluidCanvas.getContext('2d');
    let w = 0, h = 0;
    const trails = [];
    let lastX = 0, lastY = 0;

    function resize() {
      w = fluidCanvas.width = heroEl.offsetWidth;
      h = fluidCanvas.height = heroEl.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let isLiquidRunning = false;
    let isHeroInView = true;

    // Viewport visibility gating: pause GPU canvas rendering when hero is scrolled off-screen
    if ('IntersectionObserver' in window) {
      const heroCanvasObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isHeroInView = entry.isIntersecting;
          if (!isHeroInView && trails.length > 0) {
            trails.length = 0;
            ctx.clearRect(0, 0, w, h);
            isLiquidRunning = false;
          }
        });
      }, { rootMargin: '60px 0px' });
      heroCanvasObserver.observe(heroEl);
    }

    function animateLiquid() {
      if (!isHeroInView || trails.length === 0) {
        ctx.clearRect(0, 0, w, h);
        isLiquidRunning = false;
        return;
      }

      ctx.clearRect(0, 0, w, h);
      for (let i = trails.length - 1; i >= 0; i--) {
        const t = trails[i];
        t.x += t.vx;
        t.y += t.vy;
        t.radius += 0.9;
        t.alpha *= 0.94;

        if (t.alpha < 0.01) {
          trails.splice(i, 1);
          continue;
        }

        const grad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.radius);
        grad.addColorStop(0, `rgba(${t.color}, ${t.alpha * 0.45})`);
        grad.addColorStop(1, `rgba(${t.color}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (trails.length > 0) {
        requestAnimationFrame(animateLiquid);
      } else {
        isLiquidRunning = false;
      }
    }

    window.addEventListener('mousemove', e => {
      const rect = heroEl.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom || e.clientX < rect.left || e.clientX > rect.right) {
        return;
      }

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const speed = Math.hypot(x - lastX, y - lastY);
      lastX = x;
      lastY = y;

      const count = Math.min(8, Math.max(2, Math.floor(speed / 4)));
      for (let i = 0; i < count; i++) {
        trails.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5,
          radius: Math.random() * 28 + 14,
          alpha: 0.7,
          color: Math.random() > 0.5 ? '198, 253, 80' : '123, 57, 252'
        });
      }

      // Awake RAF loop on demand
      if (!isLiquidRunning && isHeroInView) {
        isLiquidRunning = true;
        requestAnimationFrame(animateLiquid);
      }
    }, { passive: true });
  }
  // 1. "SCREENSHOT" SNACKBAR CYCLIC BEHAVIOR
  const snackbar = document.getElementById('screenshotSnackbar');
  
  if (snackbar) {
    const cycleSnackbar = () => {
      // Enter
      setTimeout(() => {
        snackbar.classList.remove('exit');
        snackbar.classList.add('visible');
      }, 1600);

      // Hold and then exit
      setTimeout(() => {
        snackbar.classList.remove('visible');
        snackbar.classList.add('exit');
      }, 6200);
    };

    // Initial cycle
    cycleSnackbar();

    // Repeat cycle every 11 seconds
    setInterval(cycleSnackbar, 11000);
  }

  // 2. ULTRA-SMOOTH MOUSE PARALLAX FOR FLOATING CARDS (Optimized for Low-End Hardware)
  // Drives --px and --py custom properties on cards only when hero is visible and moving
  const heroContainer = document.getElementById('hero');
  const cards = document.querySelectorAll('.portfolio-card-wrap');

  if (heroContainer && !prefersReducedMotion && window.innerWidth >= 1200 && cards.length) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isRunning = false;
    let isHeroInView = true;

    // Pause loop when hero is off-screen
    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isHeroInView = entry.isIntersecting;
        });
      }, { rootMargin: '50px 0px' });
      heroObserver.observe(heroContainer);
    }

    const renderParallax = () => {
      if (!isHeroInView) {
        isRunning = false;
        return;
      }

      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      cards.forEach((card, i) => {
        const factor = 0.5 + (i * 0.18);
        card.style.setProperty('--px', `${(currentX * factor).toFixed(2)}px`);
        card.style.setProperty('--py', `${(currentY * factor).toFixed(2)}px`);
      });

      // Stop rAF loop when movement has reached equilibrium
      if (Math.abs(targetX - currentX) < 0.02 && Math.abs(targetY - currentY) < 0.02) {
        isRunning = false;
        return;
      }

      requestAnimationFrame(renderParallax);
    };

    const startParallaxLoop = () => {
      if (!isRunning && isHeroInView) {
        isRunning = true;
        requestAnimationFrame(renderParallax);
      }
    };

    heroContainer.addEventListener('mousemove', (e) => {
      const rect = heroContainer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 14; // subtle range +/- 7px
      targetY = y * 14;
      startParallaxLoop();
    }, { passive: true });

    heroContainer.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      startParallaxLoop();
    });
  }

  // 3. CTA INTERACTIVITY & SMOOTH LINK HANDLING
  const ctaButtons = document.querySelectorAll('a[href^="#"]');
  ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = btn.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // 4. CARD 3D TILT INTERACTION (Vanilla-Tilt inspired, zero-dependency)
  cards.forEach(wrap => {
    const card = wrap.querySelector('.portfolio-card');
    if (!card) return;

    let tiltFrame = null;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let isHovering = false;

    const updateTilt = () => {
      if (!isHovering && Math.abs(targetRotateX) < 0.1 && Math.abs(targetRotateY) < 0.1) {
        card.style.transform = '';
        tiltFrame = null;
        return;
      }

      card.style.transform = `perspective(1000px) rotateX(${targetRotateX.toFixed(2)}deg) rotateY(${targetRotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
      if (!isHovering) {
        targetRotateX *= 0.85;
        targetRotateY *= 0.85;
      }
      tiltFrame = requestAnimationFrame(updateTilt);
    };

    wrap.addEventListener('pointerenter', () => {
      isHovering = true;
      if (!tiltFrame) tiltFrame = requestAnimationFrame(updateTilt);
    });

    wrap.addEventListener('pointermove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;  // 0 to 1
      const y = (e.clientY - rect.top) / rect.height; // 0 to 1
      
      // Maximum tilt angle of 14 degrees
      targetRotateX = ((0.5 - y) * 14);
      targetRotateY = ((x - 0.5) * 14);

      if (!tiltFrame) tiltFrame = requestAnimationFrame(updateTilt);
    });

    wrap.addEventListener('pointerleave', () => {
      isHovering = false;
    });
  });

  // 4.1. MAGNETIC CTA BUTTONS INTERACTION
  const heroCtaBtns = document.querySelectorAll('.hero-cta-buttons-row .primary-lime-cta');
  if (heroCtaBtns.length && window.innerWidth >= 992 && !prefersReducedMotion) {
    heroCtaBtns.forEach(btn => {
      let isMagneticActive = false;
      let magneticFrame = null;
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;

      const arrowBox = btn.querySelector('.cta-black-arrow-box');

      const animateMagnetic = () => {
        currentX += (targetX - currentX) * 0.16;
        currentY += (targetY - currentY) * 0.16;

        btn.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
        if (arrowBox) {
          arrowBox.style.transform = `translate3d(${(currentX * 0.4).toFixed(2)}px, ${(currentY * 0.4).toFixed(2)}px, 0)`;
        }

        if (!isMagneticActive && Math.abs(targetX - currentX) < 0.1 && Math.abs(targetY - currentY) < 0.1) {
          btn.style.transform = '';
          if (arrowBox) arrowBox.style.transform = '';
          magneticFrame = null;
          return;
        }

        magneticFrame = requestAnimationFrame(animateMagnetic);
      };

      btn.addEventListener('pointermove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Max magnetic pull range
        const maxDist = 18;
        targetX = Math.max(-maxDist, Math.min(maxDist, (e.clientX - centerX) * 0.35));
        targetY = Math.max(-maxDist, Math.min(maxDist, (e.clientY - centerY) * 0.35));
        
        isMagneticActive = true;
        if (!magneticFrame) magneticFrame = requestAnimationFrame(animateMagnetic);
      });

      btn.addEventListener('pointerleave', () => {
        isMagneticActive = false;
        targetX = 0;
        targetY = 0;
      });
    });
  }

  // 5. TOPBAR THEME ADAPTATION OVER DARK SECTIONS & TICKER (Throttled with rAF)
  const topbar = document.querySelector('.hero-topbar');
  const tickerStrip = document.querySelector('.ticker-strip');
  const darkSectionSelector = document.body.classList.contains('home-page')
    ? '.dark-intro-body, .section-social-purple, .section-directory-black, .section-okay-footer'
    : '.dark-intro-body, .section-portfolio-grid, .section-social-purple, .section-directory-black, .section-okay-footer';
  const darkSections = document.querySelectorAll(darkSectionSelector);

  let isThemeTicking = false;
  const updateTopbarTheme = () => {
    if (!topbar || isThemeTicking) return;
    isThemeTicking = true;

    requestAnimationFrame(() => {
      const topbarRect = topbar.getBoundingClientRect();
      const topbarCenterY = topbarRect.top + topbarRect.height / 2;

      // When over lime ticker strip, logo is black
      if (tickerStrip) {
        const tickerRect = tickerStrip.getBoundingClientRect();
        if (tickerRect.top <= topbarCenterY && tickerRect.bottom >= topbarCenterY) {
          topbar.classList.remove('nav-on-dark');
          isThemeTicking = false;
          return;
        }
      }

      // Check if over dark / purple sections
      let isOverDark = false;
      darkSections.forEach(section => {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= topbarCenterY && rect.bottom >= topbarCenterY) {
            isOverDark = true;
          }
        }
      });

      if (isOverDark) {
        topbar.classList.add('nav-on-dark');
      } else {
        topbar.classList.remove('nav-on-dark');
      }
      isThemeTicking = false;
    });
  };

  window.addEventListener('scroll', updateTopbarTheme, { passive: true });
  window.addEventListener('resize', updateTopbarTheme, { passive: true });
  updateTopbarTheme();

  // 6. SECTION 1: INTERACTIVE TESTIMONIAL SELECTOR
  const testimonialsData = [
    {
      quote: "“Having structured roadmaps for Foundational Maths, Stats, and Python saved me countless hours of wandering through unorganized Drive folders.”",
      author: "PRIYA SHARMA",
      role: "Diploma in Data Science<br>IIT Madras BS Degree",
      link: "/resources"
    },
    {
      quote: "“Finding reliable past problem walkthroughs used to mean scrolling endlessly through unorganized groups. IITian Tattva put everything together in minutes.”",
      author: "ARAVIND KUMAR",
      role: "Foundation Level<br>Batch of 2024",
      link: "/resources"
    },
    {
      quote: "“The diagnostic quizzes help you test true conceptual depth before end-term exams. Exactly the kind of student-built tool this programme needed.”",
      author: "SNEHA PATEL",
      role: "Degree Level &bull; Data Science<br>IITM BS Community",
      link: "/resources/quiz"
    },
    {
      quote: "“Studying an online degree can get isolating, but having a peer-built repository makes you feel like you are learning together on a real campus.”",
      author: "ROHAN VERMA",
      role: "Diploma in Programming &amp; DS<br>IIT Madras BS Degree",
      link: "/resources"
    },
    {
      quote: "“From Mathematics 1 to Machine Learning Foundations, the verified student notes and roadmaps helped me maintain an 8.5+ CGPA.”",
      author: "ANANYA IYER",
      role: "Foundation &amp; Diploma Scholar<br>IITM BS Community",
      link: "/resources/roadmap"
    }
  ];

  const tDots = document.querySelectorAll('.testimonial-dot');
  const tQuote = document.getElementById('tQuote');
  const tName = document.getElementById('tName');
  const tRole = document.getElementById('tRole');
  const tCta = document.getElementById('tCta');
  const tDisplayBox = document.querySelector('.testimonial-display-box');

  tDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-t-index'), 10);
      if (isNaN(index) || !testimonialsData[index]) return;

      // Update active dot
      tDots.forEach(d => {
        d.classList.remove('is-active');
        d.setAttribute('aria-selected', 'false');
      });
      dot.classList.add('is-active');
      dot.setAttribute('aria-selected', 'true');

      // Animate content transition
      if (tDisplayBox) {
        tDisplayBox.style.opacity = '0';
        tDisplayBox.style.transform = 'translateY(8px)';

        setTimeout(() => {
          const data = testimonialsData[index];
          if (tQuote) tQuote.innerHTML = data.quote;
          if (tName) tName.textContent = data.author;
          if (tRole) tRole.innerHTML = data.role;
          if (tCta) tCta.href = data.link;

          tDisplayBox.style.opacity = '1';
          tDisplayBox.style.transform = 'translateY(0)';
        }, 180);
      }
    });
  });

  // 7. SECTION 5: AUTHENTIC OKAYDEV FOOTER LOGO 3D SPRING PHYSICS & WAVE SWEEP
  const initFooterLogoLetters = () => {
    const logoSvg = document.querySelector('.footer-logo-okaydev');
    const hoverTrigger = document.querySelector('[data-bento-made-on-logo]') || logoSvg;
    if (!logoSvg || !hoverTrigger) return;

    const PROXIMITY_DECAY = 0.5;
    const IMPULSE_STRENGTH = 38;
    const IMPULSE_STAGGER = 22; // ms
    const ENTER_SWEEP_STAGGER = 42; // ms
    const ENTER_SWEEP_HALF = 140; // ms
    const SPRING_STIFFNESS = 310;
    const SPRING_DAMPING = 13.5;

    const facesLayer = logoSvg.querySelector('.logo-faces');
    const shadesLayer = logoSvg.querySelector('.logo-shades');
    if (!facesLayer || !shadesLayer) return;

    // Helper to calculate exact flatten vector from SVG geometry
    const getFlattenShift = (shadowEl, faceEl, _letterId) => {
      try {
        const n = shadowEl.getBoundingClientRect();
        const i = faceEl.getBoundingClientRect();
        const o = shadowEl.ownerSVGElement || logoSvg;
        const s = o ? o.getBoundingClientRect() : null;
        const a = o && o.viewBox ? o.viewBox.baseVal : null;
        const l = s && s.width > 0 && a && a.width > 0 ? a.width / s.width : 1;
        const c = s && s.height > 0 && a && a.height > 0 ? a.height / s.height : 1;
        const u = (i.top - n.top) * c;
        const calcX = u - (i.left - n.left) * l;
        const calcY = (n.top + n.height - (i.top + i.height)) * c - u;
        if (Math.abs(calcX) > 10 && Math.abs(calcY) > 10) {
          return { x: calcX, y: calcY };
        }
      } catch (err) {}
      // Reference standard 45-deg isometric extrusion vector (-45, 45)
      return { x: -45, y: 45 };
    };

    // Build letter entries in visual left-to-right order (sorted by data-letter-index)
    const rawFaceGroups = Array.from(facesLayer.querySelectorAll('.logo-letter'));
    const sortedFaceGroups = rawFaceGroups.sort((a, b) => {
      const idxA = parseInt(a.getAttribute('data-letter-index') || '0', 10);
      const idxB = parseInt(b.getAttribute('data-letter-index') || '0', 10);
      return idxA - idxB;
    });

    const letterEntries = sortedFaceGroups.map((faceGroup, index) => {
      const charIndex = faceGroup.getAttribute('data-letter-index') || index;
      const char = faceGroup.getAttribute('data-letter') || '';
      const shadowPath = shadesLayer.querySelector(`[data-letter-index="${charIndex}"]`) ||
                         shadesLayer.querySelector(`[data-letter="${char}"]`);
      const facePath = faceGroup.querySelector('.logo-letter-face') || faceGroup;
      if (!shadowPath || !facePath) return null;

      const shift = getFlattenShift(shadowPath, facePath, char);
      return {
        letterId: char,
        group: faceGroup,
        face: facePath,
        shadow: shadowPath,
        index,
        shiftX: shift.x,
        shiftY: shift.y,
        amount: 0,
        velocity: 0,
        lastProximity: 0,
        lastRenderedAmount: 0
      };
    }).filter(Boolean);

    if (!letterEntries.length) return;

    let isTickerActive = false;
    let isEnterSweeping = false;
    let lastOriginIndex = null;
    let pendingTimeouts = [];
    let lastTime = performance.now();

    const syncLetterTransform = (entry) => {
      const amt = Math.max(0, Math.min(1, entry.amount));
      if (Math.abs(amt - entry.lastRenderedAmount) < 0.0001) return;
      const tx = (entry.shiftX * amt).toFixed(2);
      const ty = (entry.shiftY * amt).toFixed(2);
      entry.face.setAttribute('transform', `translate(${tx} ${ty})`);
      entry.lastRenderedAmount = amt;
    };

    const onTick = (now) => {
      if (isEnterSweeping) {
        stopTicker();
        return;
      }
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap at 50ms to prevent jumps
      lastTime = now;

      let hasActiveMotion = false;
      letterEntries.forEach(entry => {
        if (entry.amount === 0 && entry.velocity === 0) return;
        const springForce = -SPRING_STIFFNESS * entry.amount - SPRING_DAMPING * entry.velocity;
        entry.velocity += springForce * dt;
        entry.amount += entry.velocity * dt;

        if (Math.abs(entry.amount) < 0.0008 && Math.abs(entry.velocity) < 0.0008) {
          entry.amount = 0;
          entry.velocity = 0;
        }

        syncLetterTransform(entry);
        if (entry.amount !== 0 || entry.velocity !== 0) {
          hasActiveMotion = true;
        }
      });

      if (hasActiveMotion) {
        requestAnimationFrame(onTick);
      } else {
        stopTicker();
      }
    };

    const startTicker = () => {
      if (isTickerActive || isEnterSweeping) return;
      isTickerActive = true;
      lastTime = performance.now();
      requestAnimationFrame(onTick);
    };

    const stopTicker = () => {
      isTickerActive = false;
    };

    const clearPendingStaggers = () => {
      pendingTimeouts.forEach(t => clearTimeout(t));
      pendingTimeouts = [];
    };

    const addLetterImpulse = (entry, factor) => {
      if (factor <= 0.0001) return;
      entry.velocity += factor * IMPULSE_STRENGTH;
      startTicker();
    };

    const applyImpulse = (originIdx) => {
      clearPendingStaggers();
      letterEntries.forEach((entry, idx) => {
        const dist = Math.abs(idx - originIdx);
        const proximity = Math.pow(PROXIMITY_DECAY, dist);
        const impulseDelta = proximity - entry.lastProximity;
        entry.lastProximity = proximity;
        if (impulseDelta <= 0) return;

        const delay = dist * IMPULSE_STAGGER;
        const timer = setTimeout(() => {
          addLetterImpulse(entry, impulseDelta);
        }, delay);
        pendingTimeouts.push(timer);
      });
    };

    const getOriginIndexFromPointer = (clientX, clientY) => {
      // 1. Direct hit-test
      for (let i = 0; i < letterEntries.length; i++) {
        const r1 = letterEntries[i].face.getBoundingClientRect();
        const r2 = letterEntries[i].shadow.getBoundingClientRect();
        const left = Math.min(r1.left, r2.left);
        const right = Math.max(r1.right, r2.right);
        const top = Math.min(r1.top, r2.top);
        const bottom = Math.max(r1.bottom, r2.bottom);
        if (clientX >= left && clientX <= right && clientY >= top && clientY <= bottom) {
          return i;
        }
      }
      // 2. Proximity fallback along wordmark
      let bestIdx = 0;
      let minDistanceSq = Infinity;
      letterEntries.forEach((entry, i) => {
        const r = entry.face.getBoundingClientRect();
        const cx = (r.left + r.right) / 2;
        const cy = (r.top + r.bottom) / 2;
        const dSq = (clientX - cx) ** 2 + (clientY - cy) ** 2;
        if (dSq < minDistanceSq) {
          minDistanceSq = dSq;
          bestIdx = i;
        }
      });
      return bestIdx;
    };

    // Instant tactile pop on click/touch
    const playSinglePop = (entry) => {
      if (!entry) return;
      entry.amount = 0;
      entry.velocity = 0;
      const startTime = performance.now();
      const popDuration = 180; // ms

      const stepPop = (now) => {
        const elapsed = now - startTime;
        if (elapsed < popDuration) {
          // Sine curve down and back
          const progress = elapsed / popDuration;
          const amt = Math.sin(progress * Math.PI);
          entry.amount = amt;
          syncLetterTransform(entry);
          requestAnimationFrame(stepPop);
        } else {
          entry.amount = 0;
          entry.velocity = 0;
          syncLetterTransform(entry);
        }
      };
      requestAnimationFrame(stepPop);
    };

    // Smooth entrance sweep wave across O-K-A-Y-D-E-V
    const playEnterSweep = () => {
      if (isEnterSweeping) return;
      isEnterSweeping = true;
      clearPendingStaggers();
      stopTicker();

      letterEntries.forEach((entry, i) => {
        const startTime = performance.now() + (i * ENTER_SWEEP_STAGGER);
        const duration = ENTER_SWEEP_HALF * 2;

        const animateLetterSweep = (now) => {
          if (now < startTime) {
            requestAnimationFrame(animateLetterSweep);
            return;
          }
          const elapsed = now - startTime;
          if (elapsed < duration) {
            const p = elapsed / duration;
            // Smooth ease out and return
            const amt = Math.sin(p * Math.PI) * 0.95;
            entry.amount = amt;
            syncLetterTransform(entry);
            requestAnimationFrame(animateLetterSweep);
          } else {
            entry.amount = 0;
            entry.velocity = 0;
            syncLetterTransform(entry);
            if (i === letterEntries.length - 1) {
              isEnterSweeping = false;
            }
          }
        };
        requestAnimationFrame(animateLetterSweep);
      });
    };

    // Event listeners
    hoverTrigger.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'touch' || isEnterSweeping) return;
      letterEntries.forEach(entry => { entry.lastProximity = 0; });
      const idx = getOriginIndexFromPointer(e.clientX, e.clientY);
      lastOriginIndex = idx;
      applyImpulse(idx);
    });

    hoverTrigger.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch' || isEnterSweeping) return;
      const idx = getOriginIndexFromPointer(e.clientX, e.clientY);
      if (lastOriginIndex !== idx) {
        lastOriginIndex = idx;
        applyImpulse(idx);
      }
    });

    hoverTrigger.addEventListener('pointerleave', () => {
      lastOriginIndex = null;
      clearPendingStaggers();
      letterEntries.forEach(entry => { entry.lastProximity = 0; });
    });

    hoverTrigger.addEventListener('click', (e) => {
      const idx = getOriginIndexFromPointer(e.clientX, e.clientY);
      if (letterEntries[idx]) {
        playSinglePop(letterEntries[idx]);
      }
    });

    // Observer: trigger entrance sweep wave when footer scrolls into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(playEnterSweep, 200);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    observer.observe(document.querySelector('.section-okay-footer') || logoSvg);
  };

  const initClubFooterTextEffect = () => {
    const wordmark = document.querySelector('.footer-club-wordmark');
    const trigger = wordmark && wordmark.closest('.footer-wordmark-wrap');
    if (!wordmark || !trigger || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let resetTimer;
    const startWave = () => {
      if (wordmark.classList.contains('is-waving')) return;
      wordmark.classList.add('is-waving');
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => wordmark.classList.remove('is-waving'), 1300);
    };

    trigger.addEventListener('pointerenter', startWave, { passive: true });
    trigger.addEventListener('focusin', startWave);
    trigger.addEventListener('touchstart', startWave, { passive: true });
  };

  try {
    initFooterLogoLetters();
  } catch (err) {
    console.warn('Footer logo init:', err);
  }

  try {
    initClubFooterTextEffect();
  } catch (err) {
    console.warn('Club footer wordmark init:', err);
  }

  // 8. SECTION 3: ACETERNITY UI 3D WOBBLE CARD EFFECT FOR DIRECTORY STACK
  initDirectoryWobbleCards();
});

function initDirectoryWobbleCards() {
  const wobbleCards = document.querySelectorAll('.dir-stack-card');
  if (!wobbleCards.length) return;

  wobbleCards.forEach(card => {
    let targetX = 0;
    let targetY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let targetInnerX = 0;
    let targetInnerY = 0;
    let targetGlowX = 50;
    let targetGlowY = 50;

    let currentX = 0;
    let currentY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let currentInnerX = 0;
    let currentInnerY = 0;
    let currentGlowX = 50;
    let currentGlowY = 50;

    let isHovering = false;
    let animFrame = null;

    function renderLoop() {
      // Silky smooth dampening factor (0.13 when active, 0.08 on spring return)
      const ease = isHovering ? 0.13 : 0.08;

      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      currentTiltX += (targetTiltX - currentTiltX) * ease;
      currentTiltY += (targetTiltY - currentTiltY) * ease;
      currentInnerX += (targetInnerX - currentInnerX) * ease;
      currentInnerY += (targetInnerY - currentInnerY) * ease;
      currentGlowX += (targetGlowX - currentGlowX) * 0.15;
      currentGlowY += (targetGlowY - currentGlowY) * 0.15;

      card.style.setProperty('--wobble-x', `${currentX.toFixed(2)}px`);
      card.style.setProperty('--wobble-y', `${currentY.toFixed(2)}px`);
      card.style.setProperty('--wobble-rx', `${currentTiltX.toFixed(2)}deg`);
      card.style.setProperty('--wobble-ry', `${currentTiltY.toFixed(2)}deg`);
      card.style.setProperty('--wobble-inner-x', `${currentInnerX.toFixed(2)}px`);
      card.style.setProperty('--wobble-inner-y', `${currentInnerY.toFixed(2)}px`);
      card.style.setProperty('--wobble-glow-x', `${currentGlowX.toFixed(1)}%`);
      card.style.setProperty('--wobble-glow-y', `${currentGlowY.toFixed(1)}%`);

      const diff = Math.abs(targetX - currentX) + Math.abs(targetY - currentY) +
                   Math.abs(targetTiltX - currentTiltX) + Math.abs(targetTiltY - currentTiltY);

      if (isHovering || diff > 0.04) {
        animFrame = requestAnimationFrame(renderLoop);
      } else {
        animFrame = null;
        if (!isHovering) {
          card.classList.remove('is-wobbling');
          card.style.setProperty('--wobble-scale', '1');
        }
      }
    }

    function startLoop() {
      if (!animFrame) {
        animFrame = requestAnimationFrame(renderLoop);
      }
    }

    function onPointerMove(e) {
      isHovering = true;
      card.classList.add('is-wobbling');
      card.style.setProperty('--wobble-scale', '1.04');

      const rect = card.getBoundingClientRect();
      const halfW = rect.width / 2;
      const halfH = rect.height / 2;
      const dx = e.clientX - (rect.left + halfW);
      const dy = e.clientY - (rect.top + halfH);

      // Aceternity UI 3D wobble physics:
      // Outer card translates towards mouse and tilts in 3D perspective
      targetX = (dx / halfW) * 26;
      targetY = (dy / halfH) * 18;
      targetTiltX = (-dy / halfH) * 12;
      targetTiltY = (dx / halfW) * 12;

      // Inner content moves in opposing reverse parallax (-85%)
      targetInnerX = -targetX * 0.85;
      targetInnerY = -targetY * 0.85;

      // Dynamic flashlight / sheen coordinates in percentage
      targetGlowX = ((e.clientX - rect.left) / rect.width) * 100;
      targetGlowY = ((e.clientY - rect.top) / rect.height) * 100;

      startLoop();
    }

    function onPointerLeave() {
      isHovering = false;
      targetX = 0;
      targetY = 0;
      targetTiltX = 0;
      targetTiltY = 0;
      targetInnerX = 0;
      targetInnerY = 0;
      startLoop();
    }

    card.addEventListener('mouseenter', onPointerMove);
    card.addEventListener('mousemove', onPointerMove, { passive: true });
    card.addEventListener('mouseleave', onPointerLeave);
  });
}

// Execute immediately since elements are already in the DOM
initDirectoryWobbleCards();

// Also attach as lifecycle fallback
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDirectoryWobbleCards);
}

/* ==========================================================================
   Section: Kinetic Terrain Wave Canvas (Interactive 3D Sine Mesh)
   Constrained strictly within #nyc-path section with viewport intersection pause
   ========================================================================== */
function initKineticTerrainWave() {
  const stage = document.getElementById('nyc-path');
  const canvas = document.getElementById('terrainWaveCanvas');
  if (!stage || !canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let w = 0, h = 0;
  let phase = 0;
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let isVisible = true;
  let animId = null;

  function resize() {
    w = canvas.width = stage.offsetWidth;
    h = canvas.height = stage.offsetHeight;
  }

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    targetMouseX = (e.clientX - rect.left) / w - 0.5;
    targetMouseY = (e.clientY - rect.top) / h - 0.5;
  }, { passive: true });

  stage.addEventListener('mouseleave', () => {
    targetMouseX = 0;
    targetMouseY = 0;
  });

  // Strict performance containment: only run when section is visible in viewport
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          animId = requestAnimationFrame(animate);
        }
      });
    }, { rootMargin: '100px 0px' });
    observer.observe(stage);
  }

  function animate() {
    if (!isVisible) {
      animId = null;
      return;
    }

    ctx.clearRect(0, 0, w, h);
    phase += 0.02;

    // Smooth inertia interpolation for mouse perspective tilt
    mouseX += (targetMouseX - mouseX) * 0.06;
    mouseY += (targetMouseY - mouseY) * 0.06;

    const rows = 16;
    const cols = 28;
    const stepX = w / cols;
    // Ground landscape starts from beneath the cards and cascades downwards
    const baseY = h * 0.52;

    // 1. Draw undulating horizontal latitude waves
    for (let r = 0; r < rows; r++) {
      ctx.beginPath();
      const depth = r / rows;
      const yOffset = baseY + (r * (h * 0.48 / rows)) + (mouseY * 70 * depth);

      for (let c = 0; c <= cols; c++) {
        const x = c * stepX + (mouseX * 80 * depth);
        const wave = Math.sin(c * 0.32 + phase + (r * 0.45)) * (16 + (r * 3.8))
                   + Math.cos(c * 0.18 - phase * 0.7 + (r * 0.28)) * (9 + (r * 2.2));
        const y = yOffset + wave;

        if (c === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.strokeStyle = `rgba(19, 19, 17, ${0.04 + depth * 0.14})`;
      ctx.lineWidth = 1 + depth * 0.85;
      ctx.stroke();
    }

    // 2. Draw vertical perspective longitude ribs to complete the 3D grid mesh
    const colStep = 2;
    for (let c = 0; c <= cols; c += colStep) {
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        const depth = r / rows;
        const yOffset = baseY + (r * (h * 0.48 / rows)) + (mouseY * 70 * depth);
        const x = c * stepX + (mouseX * 80 * depth);
        const wave = Math.sin(c * 0.32 + phase + (r * 0.45)) * (16 + (r * 3.8))
                   + Math.cos(c * 0.18 - phase * 0.7 + (r * 0.28)) * (9 + (r * 2.2));
        const y = yOffset + wave;

        if (r === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = 'rgba(19, 19, 17, 0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    animId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  animate();
}

initKineticTerrainWave();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initKineticTerrainWave);
}

/* ==========================================================================
   THREE.JS WEBGL POINTS SPRITES (Beige Snowflakes on Beige Backgrounds)
   Uses procedural CanvasTexture snowflakes — renders correctly on light
   #F3F2EA beige. Shared factory for both arch & portfolio grid sections.
   ========================================================================== */

/**
 * Generates a Three.js CanvasTexture of a procedural snowflake.
 * Each is drawn with beige-toned strokes on transparent background.
 */
function makeBeigeSnowflakeTexture(size, type, hexColor) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const cx = size / 2;
  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = hexColor;
  ctx.fillStyle = hexColor;
  ctx.lineCap = 'round';
  ctx.lineWidth = Math.max(1, size * 0.045);

  if (type === 0) {
    // 6-arm dendritic snowflake (original Three.js sprite1 style)
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      ctx.beginPath();
      ctx.moveTo(cx, cx);
      ctx.lineTo(cx + Math.cos(a) * cx * 0.88, cx + Math.sin(a) * cx * 0.88);
      ctx.stroke();
      // side branches at 55% and 75%
      [0.55, 0.75].forEach(t => {
        const bx = cx + Math.cos(a) * cx * t;
        const by = cx + Math.sin(a) * cx * t;
        [0.45, -0.45].forEach(ang => {
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(bx + Math.cos(a + ang) * cx * 0.28, by + Math.sin(a + ang) * cx * 0.28);
          ctx.stroke();
        });
      });
    }
  } else if (type === 1) {
    // 6-point clean crystal (sprite2 style)
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      ctx.beginPath();
      ctx.moveTo(cx, cx);
      ctx.lineTo(cx + Math.cos(a) * cx * 0.82, cx + Math.sin(a) * cx * 0.82);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(cx, cx, cx * 0.14, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 2) {
    // 8-point needle burst (sprite3 style)
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const len = i % 2 === 0 ? cx * 0.84 : cx * 0.5;
      ctx.beginPath();
      ctx.moveTo(cx, cx);
      ctx.lineTo(cx + Math.cos(a) * len, cx + Math.sin(a) * len);
      ctx.stroke();
    }
  } else if (type === 3) {
    // Soft glowing radial disc (sprite4 style)
    const grad = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx * 0.85);
    grad.addColorStop(0, hexColor);
    grad.addColorStop(0.5, hexColor.slice(0, 7) + 'AA');
    grad.addColorStop(1, hexColor.slice(0, 7) + '00');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cx, cx * 0.85, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Hexagonal ice prism (sprite5 style)
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const x = cx + Math.cos(a) * cx * 0.72;
      const y = cx + Math.sin(a) * cx * 0.72;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    // inner cross
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI) / 3;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * cx * 0.72, cx + Math.sin(a) * cx * 0.72);
      ctx.lineTo(cx + Math.cos(a + Math.PI) * cx * 0.72, cx + Math.sin(a + Math.PI) * cx * 0.72);
      ctx.stroke();
    }
  }

  return new THREE.CanvasTexture(c);
}

/**
 * Core factory: creates a full Three.js Points Sprites scene on a given
 * canvas element inside a given container. Beige palette, sparse count.
 */
function createBeigeSpritesScene(containerId, canvasId) {
  const container = document.getElementById(containerId);
  const canvas = document.getElementById(canvasId);
  if (!container || !canvas || typeof THREE === 'undefined') return;

  let width = container.offsetWidth;
  let height = container.offsetHeight;
  if (!width || !height) return;

  // Warm beige hex colors for the 5 sprite layers
  const beigeHex = ['#B09878', '#C4AD8E', '#8C7456', '#CDBA9F', '#9E835F'];

  // Scene + camera (Three.js webgl_points_sprites exact setup)
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 1, 2000);
  camera.position.z = 1000;

  // WebGLRenderer with full alpha (transparent over beige CSS background)
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);

  // Shared geometry — 338 sparse particles (30% boost)
  const geometry = new THREE.BufferGeometry();
  const verts = [];
  for (let i = 0; i < 338; i++) {
    verts.push(
      Math.random() * 2000 - 1000,
      Math.random() * 2000 - 1000,
      Math.random() * 2000 - 1000
    );
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));

  // 5 particle layers — matching Three.js sprite1-5 sizes, beige-tinted textures
  const layerSizes  = [28, 22, 16, 12, 9];
  const materials = [];

  for (let i = 0; i < 5; i++) {
    const tex = makeBeigeSnowflakeTexture(128, i, beigeHex[i]);
    const mat = new THREE.PointsMaterial({
      size: layerSizes[i],
      map: tex,
      blending: THREE.NormalBlending,
      depthTest: false,
      transparent: true,
      opacity: 0.62,
      alphaTest: 0.01
    });

    const pts = new THREE.Points(geometry, mat);
    pts.rotation.x = Math.random() * 6;
    pts.rotation.y = Math.random() * 6;
    pts.rotation.z = Math.random() * 6;
    scene.add(pts);
    materials.push(mat);
  }

  // Pointer tracking
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let halfX = width / 2, halfY = height / 2;

  function onPointerMove(e) {
    const rect = container.getBoundingClientRect();
    targetMouseX = (e.clientX - rect.left - halfX) * 1.1;
    targetMouseY = (e.clientY - rect.top  - halfY) * 1.1;
  }
  container.addEventListener('pointermove', onPointerMove, { passive: true });

  // Resize
  function onResize() {
    width  = container.offsetWidth;
    height = container.offsetHeight;
    halfX = width / 2;
    halfY = height / 2;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize, { passive: true });

  // IntersectionObserver — pause when off-screen
  let isVisible = false;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { isVisible = e.isIntersecting; });
  }, { threshold: 0.02 });
  io.observe(container);

  // Animation loop — exact Three.js webgl_points_sprites render logic
  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    const time = Date.now() * 0.00005;

    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // Counter-rotating layers (identical to Three.js example)
    for (let i = 0; i < scene.children.length; i++) {
      const obj = scene.children[i];
      if (obj instanceof THREE.Points) {
        obj.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
      }
    }

    renderer.render(scene, camera);
  }

  animate();
}

/**
 * Boot both sections once DOM + THREE are ready.
 */
function initBeigeSpritesScenes() {
  if (typeof THREE === 'undefined') return;
  createBeigeSpritesScene('why-us-section',  'archSpritesCanvas');
  createBeigeSpritesScene('portfolio-grid',  'portfolioSpritesCanvas');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBeigeSpritesScenes);
} else {
  initBeigeSpritesScenes();
}
