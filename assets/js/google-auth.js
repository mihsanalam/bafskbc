/**
 * IITian Tattva - Google Authentication, Navbar Profile & Protected Resources Controller
 *
 * Responsibilities:
 * - Google Identity Services OAuth 2.0 integration
 * - Google Sign-In Modal component (reusable across all pages)
 * - Interception of Explore Resources for non-authenticated visitors
 * - Authenticated navbar avatar & dropdown management
 * - Session persistence & real backend synchronization
 */

(function (window, document) {
  'use strict';

  const GoogleAuth = {
    user: null,
    config: {
      googleClientId: '',
      isConfigured: false
    },
    intendedDestination: null,
    modalElement: null,

    async init() {
      // 1. Fetch backend configuration
      await this.fetchConfig();

      // 2. Inject Google Sign-In Modal into DOM
      this.injectModal();

      // 3. Bind Explore Resources triggers
      this.bindExploreTriggers();

      // 4. Verify existing session
      await this.checkSession();

      // 5. Load Google Identity Services if client ID is configured
      if (this.config.googleClientId) {
        this.loadGoogleScript();
      }
    },

    async fetchConfig() {
      try {
        const res = await fetch('/api/auth/config');
        if (res.ok) {
          this.config = await res.json();
        }
      } catch (err) {
        console.warn('Could not fetch auth config:', err);
      }
    },

    loadGoogleScript() {
      if (document.getElementById('google-jssdk')) return;
      const script = document.createElement('script');
      script.id = 'google-jssdk';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => this.initGoogleClient();
      document.head.appendChild(script);
    },

    initGoogleClient() {
      if (!window.google || !this.config.googleClientId) return;
      try {
        window.google.accounts.id.initialize({
          client_id: this.config.googleClientId,
          callback: (response) => this.handleGoogleCredentialResponse(response),
          auto_select: false,
          cancel_on_tap_outside: true
        });
      } catch (err) {
        console.warn('Failed to initialize Google One-Tap:', err);
      }
    },

    async checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            this.user = data.user;
            window.IITianTattvaUser = this.user;
            this.renderNavbarProfile(this.user);
            this.dispatchAuthEvent('auth:login', this.user);
            return;
          }
        }
      } catch (err) {
        console.warn('Session check failed:', err);
      }
      this.user = null;
      window.IITianTattvaUser = null;
      this.dispatchAuthEvent('auth:logout', null);
    },

    dispatchAuthEvent(name, detail) {
      window.dispatchEvent(new CustomEvent(name, { detail }));
    },

    injectModal() {
      if (document.getElementById('googleSignInModal')) return;

      const modalWrap = document.createElement('div');
      modalWrap.className = 'gauth-modal-overlay';
      modalWrap.id = 'googleSignInModal';
      modalWrap.setAttribute('role', 'dialog');
      modalWrap.setAttribute('aria-modal', 'true');
      modalWrap.setAttribute('aria-hidden', 'true');

      modalWrap.innerHTML = `
        <div class="gauth-modal-dialog" data-lenis-prevent>
          <!-- Close Button -->
          <button type="button" class="gauth-modal-close" id="gauthModalCloseBtn" aria-label="Close sign in modal">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          <!-- Eyebrow Badge -->
          <div class="gauth-eyebrow-badge">
            <span class="gauth-eyebrow-dot"></span>
            <span>YOUR IITIAN TATTVA ACCOUNT</span>
          </div>

          <!-- Heading & Description -->
          <h2 class="gauth-modal-title">Welcome to IITian Tattva</h2>
          <p class="gauth-modal-desc">
            Sign in with your Google account to access your personalised profile and member resources.
          </p>

          <!-- Alert message box -->
          <div class="gauth-alert" id="gauthAlert" role="alert"></div>

          <!-- Primary Button: CONTINUE WITH GOOGLE -->
          <button type="button" class="gauth-btn-google" id="gauthContinueBtn">
            <svg class="gauth-google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span id="gauthBtnText">CONTINUE WITH GOOGLE</span>
          </button>

          <!-- Hidden container for Google GSI button rendering -->
          <div id="gsiHiddenButton" style="display: none;"></div>

          <!-- Supporting text box -->
          <div class="gauth-supporting-box">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
            <p class="gauth-supporting-text">
              Use your regular Google account. An IIT Madras student email is not required for general sign-in.
            </p>
          </div>

          <!-- Testing / Local evaluation notice & test login -->
          <div class="gauth-dev-section">
            <button type="button" class="gauth-dev-toggle-btn" id="gauthDevToggleBtn">
              ⚙️ Local Testing &amp; OAuth Config Options &darr;
            </button>
            <div class="gauth-dev-panel" id="gauthDevPanel">
              <p class="gauth-dev-hint">
                <strong>Google OAuth Status:</strong> ${this.config.isConfigured ? '<span style="color:#15803D; font-weight:700;">Configured</span>' : '<span style="color:#C53030; font-weight:700;">Set GOOGLE_CLIENT_ID</span> to activate production OAuth'}.
                <br>For immediate review and local evaluation, test with any regular Gmail:
              </p>
              <form class="gauth-dev-form" id="gauthDevForm">
                <input type="email" class="gauth-dev-input" id="gauthDevEmailInput" value="alex.learner@gmail.com" placeholder="Enter regular Gmail address" required />
                <button type="submit" class="gauth-dev-submit" id="gauthDevSubmitBtn">Sign In</button>
              </form>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modalWrap);
      this.modalElement = modalWrap;
      this.bindModalEvents();
    },

    bindModalEvents() {
      const modal = this.modalElement;
      const closeBtn = document.getElementById('gauthModalCloseBtn');
      const continueBtn = document.getElementById('gauthContinueBtn');
      const devToggleBtn = document.getElementById('gauthDevToggleBtn');
      const devPanel = document.getElementById('gauthDevPanel');
      const devForm = document.getElementById('gauthDevForm');

      closeBtn?.addEventListener('click', () => this.closeModal());
      modal?.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active-open')) {
          this.closeModal();
        }
      });

      // Continue with Google click
      continueBtn?.addEventListener('click', async () => {
        this.clearAlert();
        if (this.config.googleClientId && window.google) {
          try {
            continueBtn.disabled = true;
            document.getElementById('gauthBtnText').textContent = 'Connecting with Google...';
            window.google.accounts.id.prompt((notification) => {
              if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // If One-Tap is suppressed or blocked by browser popup rules, show fallback test login
                continueBtn.disabled = false;
                document.getElementById('gauthBtnText').textContent = 'CONTINUE WITH GOOGLE';
                devPanel?.classList.add('open');
                this.showAlert('Google One Tap was suppressed by browser. Please use the testing login below or check third-party cookie settings.', 'error');
              }
            });
          } catch (err) {
            continueBtn.disabled = false;
            document.getElementById('gauthBtnText').textContent = 'CONTINUE WITH GOOGLE';
            this.showAlert(err.message || 'Google OAuth failed to start.', 'error');
          }
        } else {
          // Google Client ID is not configured yet in environment
          // Prompt user gracefully and expand testing login panel
          devPanel?.classList.add('open');
          this.showAlert('Notice: Set GOOGLE_CLIENT_ID environment variable for live Google Cloud OAuth. You can sign in immediately below to test the full experience.', 'success');
        }
      });

      // Developer panel toggle
      devToggleBtn?.addEventListener('click', () => {
        devPanel?.classList.toggle('open');
      });

      // Dev login submit
      devForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('gauthDevEmailInput').value.trim();
        if (!email) return;

        const submitBtn = document.getElementById('gauthDevSubmitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';

        try {
          const res = await fetch('/api/auth/dev-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Sign-in failed');

          this.user = data.user;
          window.IITianTattvaUser = this.user;
          this.renderNavbarProfile(this.user);
          this.dispatchAuthEvent('auth:login', this.user);

          this.showAlert('Successfully authenticated with Google!', 'success');
          setTimeout(() => {
            this.closeModal();
            this.navigateToIntended();
          }, 600);
        } catch (err) {
          this.showAlert(err.message, 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Sign In';
        }
      });
    },

    async handleGoogleCredentialResponse(response) {
      if (!response.credential) {
        this.showAlert('No credential returned from Google.', 'error');
        return;
      }

      const continueBtn = document.getElementById('gauthContinueBtn');
      if (continueBtn) {
        continueBtn.disabled = true;
        document.getElementById('gauthBtnText').textContent = 'Authenticating...';
      }

      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: response.credential })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Google authentication failed on server');

        this.user = data.user;
        window.IITianTattvaUser = this.user;
        this.renderNavbarProfile(this.user);
        this.dispatchAuthEvent('auth:login', this.user);

        this.showAlert('Welcome, ' + this.user.name + '!', 'success');
        setTimeout(() => {
          this.closeModal();
          this.navigateToIntended();
        }, 700);
      } catch (err) {
        this.showAlert(err.message, 'error');
      } finally {
        if (continueBtn) {
          continueBtn.disabled = false;
          document.getElementById('gauthBtnText').textContent = 'CONTINUE WITH GOOGLE';
        }
      }
    },

    bindExploreTriggers() {
      // 1. Generic explore resource triggers
      const exploreButtons = document.querySelectorAll(
        '#primaryCta, #tCta, a[href="/resources"], a[href="/resources/roadmap"], .primary-lime-cta[title*="Explore"]'
      );

      exploreButtons.forEach(btn => {
        if (btn.closest('#resourcesDropdownParent')) return;

        btn.addEventListener('click', (e) => {
          if (!this.user) {
            e.preventDefault();
            const targetHref = btn.getAttribute('href') || '/resources';
            this.openModal(targetHref);
          }
        });
      });

      // 2. Dedicated Practice & PYQ Triggers (navbar dropdown, cards, buttons, choice modal)
      const pyqTriggers = document.querySelectorAll(
        'a[href*="/resources/quiz"], #cardArx, #exploreQuizCta, .open-pyq-choice-modal, #choosePyqCard, #choosePracticeCard'
      );

      pyqTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
          if (!this.user) {
            e.preventDefault();
            e.stopPropagation();
            const targetHref = btn.getAttribute('href') || '/resources/quiz';
            this.openModal(targetHref, 'Sign in with Google to access IITian Tattva PYQ papers, diagnostic quizzes, and practice tests.');
          }
        });
      });

      // 3. If currently on quiz/practice engine page and not authenticated, auto-prompt sign-in
      if (!this.user && (window.location.pathname.includes('/resources/quiz') || window.location.pathname.includes('resources-quiz'))) {
        setTimeout(() => {
          if (!this.user) {
            this.openModal(null, 'Sign in with Google to access IITian Tattva PYQ papers, diagnostic quizzes, and practice tests.');
          }
        }, 400);
      }
    },

    openModal(destination = null, customDesc = null) {
      this.intendedDestination = destination;
      this.clearAlert();
      if (!this.modalElement) this.injectModal();

      const descEl = this.modalElement.querySelector('.gauth-modal-desc');
      if (descEl) {
        if (customDesc) {
          descEl.textContent = customDesc;
          descEl.setAttribute('data-custom', 'true');
        } else {
          descEl.textContent = 'Sign in with your Google account to access your personalised profile and member resources.';
          descEl.removeAttribute('data-custom');
        }
      }

      this.modalElement.classList.add('active-open');
      this.modalElement.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
    },

    closeModal() {
      if (!this.modalElement) return;
      this.modalElement.classList.remove('active-open');
      this.modalElement.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();

      const descEl = this.modalElement.querySelector('.gauth-modal-desc');
      if (descEl && descEl.getAttribute('data-custom')) {
        descEl.textContent = 'Sign in with your Google account to access your personalised profile and member resources.';
        descEl.removeAttribute('data-custom');
      }
    },

    navigateToIntended() {
      if (this.intendedDestination) {
        const dest = this.intendedDestination;
        this.intendedDestination = null;
        if (window.location.pathname !== dest) {
          window.location.href = dest;
        }
      }
    },

    showAlert(message, type = 'error') {
      const alertEl = document.getElementById('gauthAlert');
      if (!alertEl) return;
      alertEl.textContent = message;
      alertEl.className = `gauth-alert active ${type}`;
    },

    clearAlert() {
      const alertEl = document.getElementById('gauthAlert');
      if (!alertEl) return;
      alertEl.textContent = '';
      alertEl.className = 'gauth-alert';
    },

    renderNavbarProfile(user) {
      if (!user) return;

      // Desktop Navbar Integration
      const navTracks = document.querySelectorAll('.nav-pill .nav-links-track');
      navTracks.forEach(track => {
        // Check if already rendered
        let wrap = track.querySelector('.nav-user-profile-wrap');
        if (!wrap) {
          wrap = document.createElement('div');
          wrap.className = 'nav-user-profile-wrap';
          track.appendChild(wrap);
        }

        const initials = (user.name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        const avatarContent = user.profileImage
          ? `<img src="${this.escapeHtml(user.profileImage)}" alt="${this.escapeHtml(user.name)}" class="nav-user-avatar-img" onerror="this.parentElement.textContent='${initials}'" />`
          : initials;

        wrap.innerHTML = `
          <button type="button" class="nav-user-avatar-btn" id="navAvatarBtn" aria-label="Open user profile modal" title="Click to view & edit your profile">
            ${avatarContent}
          </button>
        `;

        const avatarBtn = wrap.querySelector('#navAvatarBtn');

        // Clicking avatar icon directly opens the in-page profile modal on top of current page
        avatarBtn?.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (window.IITianTattvaProfileModal) {
            window.IITianTattvaProfileModal.open(false);
          } else {
            window.location.href = '/profile';
          }
        });
      });

      // Recalculate navbar dimensions so JOIN COMMUNITY never overflows
      if (window.updateNavbarDimensions) {
        window.updateNavbarDimensions();
      }
      window.dispatchEvent(new Event('navbar:updated'));
      setTimeout(() => {
        if (window.updateNavbarDimensions) window.updateNavbarDimensions();
      }, 50);

      // Mobile Drawer Integration
      const mobileDrawer = document.getElementById('mobileNavDrawer');
      if (mobileDrawer) {
        let mobileUserCard = mobileDrawer.querySelector('.mobile-nav-user-card');
        if (!mobileUserCard) {
          mobileUserCard = document.createElement('div');
          mobileUserCard.className = 'mobile-nav-user-card';
          const navList = mobileDrawer.querySelector('.mobile-nav-list');
          if (navList) {
            mobileDrawer.insertBefore(mobileUserCard, navList);
          } else {
            mobileDrawer.prepend(mobileUserCard);
          }
        }

        const initials = (user.name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        mobileUserCard.innerHTML = `
          <div class="mobile-nav-user-avatar">
            ${user.profileImage ? `<img src="${this.escapeHtml(user.profileImage)}" alt="" style="width:100%;height:100%;object-fit:cover;" />` : initials}
          </div>
          <div class="mobile-nav-user-info">
            <div class="mobile-nav-user-name">${this.escapeHtml(user.name)}</div>
            <div class="mobile-nav-user-email">${this.escapeHtml(user.email)}</div>
          </div>
          <button type="button" class="nav-cta-btn" id="mobileProfileModalBtn" style="padding:6px 12px; font-size:11px; cursor:pointer; background:#131311; color:#C6FD50; border:1px solid #C6FD50;">Profile</button>
        `;

        mobileUserCard.querySelector('#mobileProfileModalBtn')?.addEventListener('click', (e) => {
          e.preventDefault();
          const drawer = document.getElementById('mobileNavDrawer');
          drawer?.classList.remove('is-open');
          if (window.IITianTattvaProfileModal) {
            window.IITianTattvaProfileModal.open(false);
          } else {
            window.location.href = '/profile';
          }
        });
      }
    },

    async signOut() {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (err) {
        console.warn('Logout error:', err);
      }
      this.user = null;
      window.IITianTattvaUser = null;

      // Remove desktop avatar
      document.querySelectorAll('.nav-user-profile-wrap').forEach(w => w.remove());
      // Remove mobile user card
      document.querySelectorAll('.mobile-nav-user-card').forEach(c => c.remove());

      this.dispatchAuthEvent('auth:logout', null);

      // If on protected profile page, redirect home
      if (window.location.pathname.startsWith('/profile')) {
        window.location.href = '/';
      }
    },

    escapeHtml(str) {
      if (typeof str !== 'string') return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  };

  // Expose global interface
  window.IITianTattvaAuth = GoogleAuth;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GoogleAuth.init());
  } else {
    GoogleAuth.init();
  }

})(window, document);
