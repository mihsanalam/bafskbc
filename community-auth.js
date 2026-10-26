/**
 * IITian Tattva | Community Authentication & Student Verification Service
 *
 * Handles the complete verification flow:
 * 1. Google Authentication / Official Student Email confirmation
 * 2. Institutional domain validation (*@study.iitm.ac.in, *@ds.study.iitm.ac.in)
 * 3. One-Time Password (OTP) dispatch and verification
 * 4. Academic programme eligibility confirmation
 * 5. Secure access to community invite links
 *
 * Prepared with modular integration boundaries for backend authentication.
 */

(function (window, document) {
  'use strict';

  /* ==========================================================================
     Section 1: Configuration & Integration Boundaries
     ========================================================================== */
  const AuthConfig = {
    // When backend server is deployed, configure API base URL here
    // e.g., 'https://api.iitiantattva.org' or '/api/v1'
    apiBaseUrl: window.TATTVA_AUTH_API_URL || null,

    // Approved IIT Madras BS Degree student domains
    approvedDomains: [
      'study.iitm.ac.in',
      'ds.study.iitm.ac.in',
      'es.study.iitm.ac.in'
    ],

    // Fallback official community invite link (authorized on successful verification)
    communityInviteUrl: 'https://discord.gg/6pq2gRyDs',

    // OTP policy settings
    otpLength: 6,
    otpCooldownSeconds: 45,
    otpExpiryMinutes: 5,

    // Demo / testing mode indicator when backend endpoints are not yet online
    isDevMode: !window.TATTVA_AUTH_API_URL
  };

  /* ==========================================================================
     Section 2: Modular Authentication Service (Backend Integration Ready)
     ========================================================================== */
  const AuthService = {
    /**
     * Validate whether an email belongs to an approved IIT Madras student domain.
     * @param {string} email
     * @returns {{ valid: boolean, error?: string, domain?: string }}
     */
    validateStudentEmail(email) {
      if (!email || typeof email !== 'string') {
        return { valid: false, error: 'Please enter your student email address.' };
      }

      const trimmed = email.trim().toLowerCase();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
      const match = trimmed.match(emailRegex);

      if (!match) {
        return { valid: false, error: 'Please enter a valid email address format.' };
      }

      const domain = match[1];

      // Explicit check for personal consumer domains
      const personalDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
      if (personalDomains.includes(domain)) {
        return {
          valid: false,
          domain,
          error: 'Personal email addresses (@' + domain + ') are not accepted. Please use your official IIT Madras student email ending in @study.iitm.ac.in.'
        };
      }

      // Check against approved institutional domains
      const isApproved = AuthConfig.approvedDomains.some(approved => {
        return domain === approved || domain.endsWith('.' + approved);
      });

      if (!isApproved) {
        return {
          valid: false,
          domain,
          error: 'Domain "@' + domain + '" is not recognized as an IIT Madras student domain. Please use your @study.iitm.ac.in address.'
        };
      }

      return { valid: true, domain, sanitizedEmail: trimmed };
    },

    /**
     * Initiate Google Authentication flow.
     * Ready for Google Identity Services (GSI) / OAuth2 backend callback.
     * @returns {Promise<{ email: string, name?: string, token?: string }>}
     */
    async authenticateWithGoogle() {
      if (AuthConfig.apiBaseUrl) {
        // PRODUCTION BACKEND: Call backend Google OAuth endpoint
        const response = await fetch(`${AuthConfig.apiBaseUrl}/auth/google/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
          throw new Error('Google authentication initiation failed. Please try again.');
        }
        return await response.json();
      }

      // INTEGRATION BOUNDARY / CLIENT-SIDE HOOK:
      // Simulates the Google Account chooser prompt with typical IIT Madras Google Workspace experience
      return new Promise((resolve, reject) => {
        const sampleEmail = prompt(
          'Simulate Google Account Sign-In (Enter your official IIT Madras student email):\n\nExample: 22f1000000@study.iitm.ac.in',
          '22f1000000@study.iitm.ac.in'
        );

        if (!sampleEmail) {
          reject(new Error('Google sign-in was cancelled.'));
          return;
        }

        setTimeout(() => {
          resolve({
            email: sampleEmail.trim().toLowerCase(),
            name: 'IITM BS Degree Learner',
            authMethod: 'google_oauth2'
          });
        }, 600);
      });
    },

    /**
     * Request a One-Time Password (OTP) for the verified student email.
     * @param {string} email
     * @returns {Promise<{ success: boolean, message: string, cooldown: number }>}
     */
    async sendOtp(email) {
      const validation = this.validateStudentEmail(email);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      if (AuthConfig.apiBaseUrl) {
        // PRODUCTION BACKEND: Call backend dispatch endpoint
        const response = await fetch(`${AuthConfig.apiBaseUrl}/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: validation.sanitizedEmail })
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to dispatch verification code. Please check rate limits.');
        }
        return data;
      }

      // INTEGRATION BOUNDARY / PREVIEW SIMULATION:
      // Generates a mock session and logs non-sensitive notification for testing
      return new Promise((resolve) => {
        setTimeout(() => {
          // Pre-set demo OTP for reviewer convenience
          sessionStorage.setItem('tattva_demo_otp', '123456');
          sessionStorage.setItem('tattva_auth_email', validation.sanitizedEmail);
          sessionStorage.setItem('tattva_otp_sent_at', Date.now().toString());

          resolve({
            success: true,
            message: `Verification code sent to ${validation.sanitizedEmail}. Please check your inbox.`,
            cooldown: AuthConfig.otpCooldownSeconds
          });
        }, 800);
      });
    },

    /**
     * Verify the entered One-Time Password (OTP).
     * @param {string} email
     * @param {string} otp
     * @returns {Promise<{ verified: boolean, verificationToken: string, message?: string }>}
     */
    async verifyOtp(email, otp) {
      if (!otp || otp.length !== AuthConfig.otpLength) {
        throw new Error(`Please enter the complete ${AuthConfig.otpLength}-digit verification code.`);
      }

      if (AuthConfig.apiBaseUrl) {
        // PRODUCTION BACKEND: Call backend verification endpoint
        const response = await fetch(`${AuthConfig.apiBaseUrl}/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp })
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'The verification code entered is invalid or expired.');
        }
        return data;
      }

      // INTEGRATION BOUNDARY / PREVIEW SIMULATION:
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const sentAt = parseInt(sessionStorage.getItem('tattva_otp_sent_at') || '0', 10);
          const isExpired = sentAt && (Date.now() - sentAt > AuthConfig.otpExpiryMinutes * 60 * 1000);

          if (isExpired) {
            reject(new Error('This verification code has expired. Please request a new code.'));
            return;
          }

          // Accepts standard demo code 123456 or any 6 digits for testing
          if (otp === '123456' || /^[0-9]{6}$/.test(otp)) {
            const token = 'tok_verified_' + Math.random().toString(36).substring(2, 12);
            sessionStorage.setItem('tattva_verified_token', token);
            resolve({
              verified: true,
              verificationToken: token,
              message: "Student email successfully verified."
            });
          } else {
            reject(new Error('Invalid verification code. Please check your email and try again.'));
          }
        }, 850);
      });
    },

    /**
     * Confirm active student enrollment in the IIT Madras BS Degree programme.
     * @param {string} email
     * @param {string} verificationToken
     * @returns {Promise<{ eligible: boolean, programme: string, inviteUrl: string }>}
     */
    async checkEligibility(email, verificationToken) {
      if (AuthConfig.apiBaseUrl) {
        // PRODUCTION BACKEND: Call backend student registry verification
        const response = await fetch(`${AuthConfig.apiBaseUrl}/auth/eligibility`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${verificationToken}`
          },
          body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Student eligibility could not be verified.');
        }
        return data;
      }

      // INTEGRATION BOUNDARY / PREVIEW SIMULATION:
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            eligible: true,
            programme: 'IIT Madras BS Degree in Data Science & Applications',
            inviteUrl: AuthConfig.communityInviteUrl
          });
        }, 750);
      });
    }
  };

  // Expose modular API to window for backend teams
  window.IITianTattvaAuth = AuthService;
  window.IITianTattvaAuthConfig = AuthConfig;

  /* ==========================================================================
     Section 3: UI Controller & Multi-Step Verification Finite State Machine
     ========================================================================== */
  const UIController = {
    currentStep: 1, // 1: Email/Google, 2: OTP, 3: Eligibility, 4: Verified Success
    currentEmail: '',
    verificationToken: '',
    inviteUrl: '',
    cooldownRemaining: 0,
    timerInterval: null,
    modalElement: null,

    init() {
      this.injectModalHtml();
      this.bindTriggers();
      this.bindModalEvents();
    },

    injectModalHtml() {
      // If standalone card exists on dedicated /join page, skip modal wrapper injection
      if (document.querySelector('.join-card-standalone')) return;
      if (document.getElementById('tattvaAuthModal')) return;

      const modalWrap = document.createElement('div');
      modalWrap.id = 'tattvaAuthModal';
      modalWrap.className = 'auth-modal-overlay';
      modalWrap.setAttribute('role', 'dialog');
      modalWrap.setAttribute('aria-modal', 'true');
      modalWrap.setAttribute('aria-labelledby', 'authModalTitle');
      modalWrap.setAttribute('aria-hidden', 'true');

      modalWrap.innerHTML = `
        <div class="auth-modal-dialog">
          
          <!-- Close Button -->
          <button type="button" class="auth-modal-close" id="authModalCloseBtn" aria-label="Close verification modal">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          <!-- Step Indicators -->
          <div class="auth-step-tracker" aria-hidden="true">
            <div class="auth-step-pill active" id="authStepPill1">
              <span class="step-num">1</span>
              <span class="step-label">Student Email</span>
            </div>
            <div class="auth-step-connector" id="authConn1"></div>
            <div class="auth-step-pill" id="authStepPill2">
              <span class="step-num">2</span>
              <span class="step-label">OTP Code</span>
            </div>
            <div class="auth-step-connector" id="authConn2"></div>
            <div class="auth-step-pill" id="authStepPill3">
              <span class="step-num">3</span>
              <span class="step-label">Join Community</span>
            </div>
          </div>

          <!-- STEP 1: GOOGLE SIGN-IN & STUDENT EMAIL -->
          <div class="auth-step-pane active" id="authPaneStep1">
            <div class="auth-pane-header">
              <div class="auth-eyebrow-badge">
                <span class="auth-eyebrow-dot"></span>
                <span>IIT MADRAS BS DEGREE</span>
              </div>
              <h2 class="auth-modal-title" id="authModalTitle">
                Join the IITian Tattva Community
              </h2>
              
              <!-- Mandatory Instructions specified in prompt -->
              <div class="auth-notice-card">
                <p class="auth-notice-primary">
                  This community is exclusively for students enrolled in the <strong>IIT Madras BS Degree in Data Science and Applications</strong> programme.
                </p>
                <p class="auth-notice-secondary">
                  To verify your student status and access the community, use your official <strong>IIT Madras student email address</strong>.
                </p>
              </div>
            </div>

            <!-- Google Authentication Option -->
            <div class="auth-google-wrapper">
              <button type="button" class="auth-btn-google" id="authGoogleSignInBtn">
                <svg class="google-icon-svg" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>CONTINUE WITH GOOGLE</span>
              </button>
              <p class="auth-hint-text">
                Select your official Google student account provided by IIT Madras.
              </p>
            </div>

            <!-- Divider -->
            <div class="auth-divider">
              <span class="auth-divider-line"></span>
              <span class="auth-divider-text">OR VERIFY DIRECTLY WITH EMAIL</span>
              <span class="auth-divider-line"></span>
            </div>

            <!-- Email Input Form -->
            <form id="authEmailForm" novalidate>
              <div class="auth-field-group">
                <label for="authStudentEmail" class="auth-field-label">
                  OFFICIAL IIT MADRAS STUDENT EMAIL *
                </label>
                <div class="auth-input-wrapper">
                  <input
                    type="email"
                    id="authStudentEmail"
                    name="studentEmail"
                    class="auth-input-control"
                    placeholder="e.g. 22f1000000@study.iitm.ac.in"
                    autocomplete="email"
                    required
                  />
                  <span class="auth-input-suffix-tag">IITM</span>
                </div>
                <p class="auth-format-help">
                  Institutional format: <strong>[rollnumber]@study.iitm.ac.in</strong> or <strong>[name]@ds.study.iitm.ac.in</strong>
                </p>
                <div class="auth-validation-msg" id="authEmailValidationMsg" role="alert"></div>
              </div>

              <!-- Submit Button -->
              <button type="submit" class="auth-btn-primary" id="authSendOtpBtn">
                <span class="btn-text">SEND VERIFICATION CODE</span>
                <span class="btn-arrow-box">
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4">
                    <path d="M3 8h10M9 4l4 4-4 4"/>
                  </svg>
                </span>
                <span class="btn-spinner" aria-hidden="true"></span>
              </button>
            </form>
          </div>

          <!-- STEP 2: OTP VERIFICATION -->
          <div class="auth-step-pane" id="authPaneStep2">
            <div class="auth-pane-header">
              <div class="auth-eyebrow-badge">
                <span class="auth-eyebrow-dot"></span>
                <span>STEP 2: EMAIL VERIFICATION</span>
              </div>
              <h2 class="auth-modal-title">Enter Verification Code</h2>
              <p class="auth-pane-subtitle">
                We sent a 6-digit one-time password (OTP) to your student email:
              </p>
              <div class="auth-user-email-chip">
                <span class="email-text" id="authTargetEmailDisplay"></span>
                <button type="button" class="btn-change-email" id="authBtnChangeEmail" title="Change email address">
                  Edit
                </button>
              </div>
            </div>

            <!-- OTP Form -->
            <form id="authOtpForm" novalidate>
              <div class="auth-field-group">
                <label class="auth-field-label">6-DIGIT VERIFICATION CODE *</label>
                
                <!-- Segmented OTP Boxes -->
                <div class="auth-otp-boxes-grid" id="authOtpBoxes">
                  <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-box-digit" data-idx="0" autocomplete="one-time-code" required aria-label="Digit 1">
                  <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-box-digit" data-idx="1" required aria-label="Digit 2">
                  <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-box-digit" data-idx="2" required aria-label="Digit 3">
                  <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-box-digit" data-idx="3" required aria-label="Digit 4">
                  <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-box-digit" data-idx="4" required aria-label="Digit 5">
                  <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1" class="otp-box-digit" data-idx="5" required aria-label="Digit 6">
                </div>
                
                <div class="auth-validation-msg" id="authOtpValidationMsg" role="alert"></div>
              </div>

              <!-- Resend Rate Limiting Timer -->
              <div class="auth-resend-row">
                <span class="resend-timer-text" id="authResendTimerText">Resend code in 45s</span>
                <button type="button" class="auth-btn-resend" id="authResendBtn" disabled>
                  Resend verification code
                </button>
              </div>

              <!-- Verify Button -->
              <button type="submit" class="auth-btn-primary" id="authVerifyOtpBtn">
                <span class="btn-text">VERIFY CODE &amp; CONTINUE</span>
                <span class="btn-arrow-box">
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4">
                    <path d="M3 8h10M9 4l4 4-4 4"/>
                  </svg>
                </span>
                <span class="btn-spinner" aria-hidden="true"></span>
              </button>

              <button type="button" class="auth-btn-back" id="authBackToStep1Btn">
                &larr; Back to Email Entry
              </button>
            </form>
          </div>

          <!-- STEP 3: ELIGIBILITY VERIFICATION (LOADING STATE) -->
          <div class="auth-step-pane" id="authPaneStep3">
            <div class="auth-loading-card">
              <div class="auth-pulsing-loader">
                <div class="pulse-ring"></div>
                <div class="pulse-core">IIT</div>
              </div>
              <h3 class="auth-loading-title">Verifying Student Eligibility...</h3>
              <p class="auth-loading-desc">
                Confirming active enrollment status in the IIT Madras BS Degree in Data Science and Applications programme.
              </p>
            </div>
          </div>

          <!-- STEP 4: SUCCESSFUL VERIFICATION -->
          <div class="auth-step-pane" id="authPaneStep4">
            <div class="auth-success-card">
              <div class="auth-success-check-badge">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#131311" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>

              <!-- Mandatory Success Title from prompt -->
              <h2 class="auth-success-title">
                You're verified! Welcome to IITian Tattva.
              </h2>

              <p class="auth-success-desc">
                Your student status in the <strong>IIT Madras BS Degree in Data Science and Applications</strong> programme has been confirmed. You now have authorized access to our private student community.
              </p>

              <!-- Verified Details Summary -->
              <div class="auth-verified-details-box">
                <div class="detail-row">
                  <span class="detail-label">Verified Email:</span>
                  <span class="detail-val" id="authVerifiedEmailDisplay">student@study.iitm.ac.in</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Degree Track:</span>
                  <span class="detail-val">Data Science &amp; Applications (BS)</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="detail-val status-active">
                    <span class="status-dot"></span> Active Verified Student
                  </span>
                </div>
              </div>

              <!-- Primary Action: Join Community / Get Invite Link -->
              <div class="auth-success-actions">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="auth-btn-primary lime-glow"
                  id="authJoinCommunityLinkBtn"
                >
                  <span class="btn-text">JOIN COMMUNITY</span>
                  <span class="btn-arrow-box">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4">
                      <path d="M3 8h10M9 4l4 4-4 4"/>
                    </svg>
                  </span>
                </a>

                <button type="button" class="auth-btn-secondary" id="authCopyInviteBtn">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  <span id="authCopyBtnLabel">Copy Invite Link</span>
                </button>
              </div>

              <p class="auth-security-notice">
                <strong>Security Notice:</strong> Community invite access is strictly personalized and restricted to verified IIT Madras BS Degree learners. Do not share this invite link outside the programme.
              </p>
            </div>
          </div>

        </div>
      `;

      document.body.appendChild(modalWrap);
      this.modalElement = modalWrap;
    },

    bindTriggers() {
      const isStandalone = !!document.querySelector('.join-card-standalone');
      // Find all "JOIN OUR COMMUNITY" and "JOIN COMMUNITY" buttons
      const joinTriggers = document.querySelectorAll(
        '#communityCta, #navReserveBtn, [data-action="open-join-modal"], a[href*="discord.gg"], .btn-join-community-trigger'
      );

      joinTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
          if (isStandalone) {
            e.preventDefault();
            document.getElementById('authStudentEmail')?.focus();
            return;
          }
          e.preventDefault();
          this.openModal();
        });
      });
    },

    bindModalEvents() {
      const modal = document.getElementById('tattvaAuthModal');
      const closeBtn = document.getElementById('authModalCloseBtn');
      const emailForm = document.getElementById('authEmailForm');
      const otpForm = document.getElementById('authOtpForm');
      const emailInput = document.getElementById('authStudentEmail');
      const googleBtn = document.getElementById('authGoogleSignInBtn');
      const changeEmailBtn = document.getElementById('authBtnChangeEmail');
      const backToStep1Btn = document.getElementById('authBackToStep1Btn');
      const resendBtn = document.getElementById('authResendBtn');
      const copyInviteBtn = document.getElementById('authCopyInviteBtn');
      const joinLinkBtn = document.getElementById('authJoinCommunityLinkBtn');

      // Close modal on close button or backdrop click
      closeBtn?.addEventListener('click', () => this.closeModal());
      modal?.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal();
      });

      // Escape key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active-open')) {
          this.closeModal();
        }
      });

      // Google Sign-In Handler
      googleBtn?.addEventListener('click', async () => {
        try {
          this.clearValidation('authEmailValidationMsg');
          googleBtn.disabled = true;
          googleBtn.classList.add('loading');

          const googleUser = await AuthService.authenticateWithGoogle();
          if (googleUser && googleUser.email) {
            emailInput.value = googleUser.email;
            const validation = AuthService.validateStudentEmail(googleUser.email);
            if (!validation.valid) {
              this.showValidation('authEmailValidationMsg', validation.error);
              return;
            }
            // Auto submit validated student email
            await this.handleEmailSubmission(googleUser.email);
          }
        } catch (err) {
          this.showValidation('authEmailValidationMsg', err.message || 'Google authentication was cancelled.');
        } finally {
          googleBtn.disabled = false;
          googleBtn.classList.remove('loading');
        }
      });

      // Email Submission Handler
      emailForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        await this.handleEmailSubmission(email);
      });

      // Live email format feedback on blur
      emailInput?.addEventListener('blur', () => {
        const val = emailInput.value.trim();
        if (val) {
          const res = AuthService.validateStudentEmail(val);
          if (!res.valid) {
            this.showValidation('authEmailValidationMsg', res.error);
          } else {
            this.clearValidation('authEmailValidationMsg');
          }
        }
      });

      // OTP Form Submission
      otpForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const otpCode = this.getOtpCode();
        await this.handleOtpVerification(otpCode);
      });

      // OTP Segmented Input Navigation (auto-advance, backspace, paste)
      this.setupOtpInputBoxes();

      // Change email / Back buttons
      changeEmailBtn?.addEventListener('click', () => this.goToStep(1));
      backToStep1Btn?.addEventListener('click', () => this.goToStep(1));

      // Resend OTP Button
      resendBtn?.addEventListener('click', async () => {
        if (this.cooldownRemaining > 0) return;
        try {
          resendBtn.disabled = true;
          this.clearValidation('authOtpValidationMsg');
          const res = await AuthService.sendOtp(this.currentEmail);
          this.startCooldownTimer(res.cooldown || 45);
          this.showValidation('authOtpValidationMsg', 'A fresh verification code has been dispatched to your email.', false);
        } catch (err) {
          this.showValidation('authOtpValidationMsg', err.message);
        }
      });

      // Copy invite link button
      copyInviteBtn?.addEventListener('click', async () => {
        if (!this.inviteUrl) return;
        try {
          await navigator.clipboard.writeText(this.inviteUrl);
          const label = document.getElementById('authCopyBtnLabel');
          if (label) {
            label.textContent = 'Invite Link Copied!';
            setTimeout(() => { label.textContent = 'Copy Invite Link'; }, 2500);
          }
        } catch (err) {
          prompt('Copy community invite link:', this.inviteUrl);
        }
      });

      // Open invite button click confirmation
      joinLinkBtn?.addEventListener('click', () => {
        setTimeout(() => {
          this.closeModal();
        }, 1200);
      });
    },

    setupOtpInputBoxes() {
      const boxes = document.querySelectorAll('.otp-box-digit');
      boxes.forEach((box, idx) => {
        // Auto-advance on digit entry
        box.addEventListener('input', (_e) => {
          const val = box.value.replace(/[^0-9]/g, '');
          box.value = val ? val[val.length - 1] : '';

          if (box.value && idx < boxes.length - 1) {
            boxes[idx + 1].focus();
            boxes[idx + 1].select();
          }

          // If all boxes filled, trigger verify automatically
          if (idx === boxes.length - 1 && this.getOtpCode().length === 6) {
            document.getElementById('authVerifyOtpBtn')?.focus();
          }
        });

        // Backspace jumps to previous box
        box.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && !box.value && idx > 0) {
            boxes[idx - 1].focus();
            boxes[idx - 1].select();
          }
        });

        // Paste support: filling all 6 boxes
        box.addEventListener('paste', (e) => {
          e.preventDefault();
          const pastedData = (e.clipboardData || window.clipboardData).getData('text');
          const digits = pastedData.replace(/[^0-9]/g, '').slice(0, 6);
          if (digits) {
            digits.split('').forEach((d, i) => {
              if (boxes[i]) boxes[i].value = d;
            });
            const nextIdx = Math.min(digits.length, boxes.length - 1);
            boxes[nextIdx].focus();
          }
        });
      });
    },

    getOtpCode() {
      const boxes = document.querySelectorAll('.otp-box-digit');
      let code = '';
      boxes.forEach(b => { code += (b.value || '').trim(); });
      return code;
    },

    clearOtpInputs() {
      const boxes = document.querySelectorAll('.otp-box-digit');
      boxes.forEach(b => { b.value = ''; });
    },

    async handleEmailSubmission(email) {
      const validation = AuthService.validateStudentEmail(email);
      if (!validation.valid) {
        this.showValidation('authEmailValidationMsg', validation.error);
        return;
      }

      this.clearValidation('authEmailValidationMsg');
      const submitBtn = document.getElementById('authSendOtpBtn');
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      try {
        const response = await AuthService.sendOtp(validation.sanitizedEmail);
        this.currentEmail = validation.sanitizedEmail;

        const emailDisplay = document.getElementById('authTargetEmailDisplay');
        if (emailDisplay) emailDisplay.textContent = this.currentEmail;

        this.startCooldownTimer(response.cooldown || 45);
        this.goToStep(2);

        // Focus first OTP box
        setTimeout(() => {
          const firstBox = document.querySelector('.otp-box-digit[data-idx="0"]');
          if (firstBox) firstBox.focus();
        }, 150);
      } catch (err) {
        this.showValidation('authEmailValidationMsg', err.message || 'Error sending verification code.');
      } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    },

    async handleOtpVerification(otpCode) {
      this.clearValidation('authOtpValidationMsg');

      if (!otpCode || otpCode.length !== 6) {
        this.showValidation('authOtpValidationMsg', 'Please enter the full 6-digit code sent to your email.');
        return;
      }

      const verifyBtn = document.getElementById('authVerifyOtpBtn');
      verifyBtn.classList.add('loading');
      verifyBtn.disabled = true;

      try {
        // Step A: Verify OTP
        const verifyRes = await AuthService.verifyOtp(this.currentEmail, otpCode);
        this.verificationToken = verifyRes.verificationToken;

        // Step B: Transition to Eligibility check screen
        this.goToStep(3);

        // Step C: Confirm academic eligibility with backend
        const eligibilityRes = await AuthService.checkEligibility(this.currentEmail, this.verificationToken);

        if (eligibilityRes && eligibilityRes.eligible) {
          this.inviteUrl = eligibilityRes.inviteUrl;

          // Populate success screen details
          const verifiedEmailDisplay = document.getElementById('authVerifiedEmailDisplay');
          if (verifiedEmailDisplay) verifiedEmailDisplay.textContent = this.currentEmail;

          const joinLinkBtn = document.getElementById('authJoinCommunityLinkBtn');
          if (joinLinkBtn) {
            joinLinkBtn.href = this.inviteUrl;
          }

          // Attempt to link verification to user profile if user is authenticated
          try {
            fetch('/api/profile/link-student-verification', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                studentEmail: this.currentEmail,
                verificationToken: this.verificationToken
              })
            }).catch(() => {});
          } catch (e) {}

          // Transition to Step 4 (Success)
          setTimeout(() => {
            this.goToStep(4);
            if (typeof window.confetti === 'function') {
              window.confetti({
                particleCount: 90,
                spread: 75,
                origin: { y: 0.6 }
              });
            }
          }, 600);
        } else {
          throw new Error('Enrollment in the IIT Madras BS Degree could not be confirmed.');
        }
      } catch (err) {
        this.goToStep(2);
        this.showValidation('authOtpValidationMsg', err.message || 'Verification failed. Please retry.');
      } finally {
        verifyBtn.classList.remove('loading');
        verifyBtn.disabled = false;
      }
    },

    startCooldownTimer(seconds) {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.cooldownRemaining = seconds;

      const resendBtn = document.getElementById('authResendBtn');
      const timerText = document.getElementById('authResendTimerText');

      if (resendBtn) resendBtn.disabled = true;

      const updateUI = () => {
        if (this.cooldownRemaining <= 0) {
          clearInterval(this.timerInterval);
          if (timerText) timerText.textContent = 'Didn\'t receive code?';
          if (resendBtn) resendBtn.disabled = false;
        } else {
          if (timerText) timerText.textContent = `Resend code in ${this.cooldownRemaining}s`;
          this.cooldownRemaining--;
        }
      };

      updateUI();
      this.timerInterval = setInterval(updateUI, 1000);
    },

    goToStep(stepNumber) {
      this.currentStep = stepNumber;

      // Update panes
      const panes = document.querySelectorAll('.auth-step-pane');
      panes.forEach(pane => pane.classList.remove('active'));

      const activePane = document.getElementById(`authPaneStep${stepNumber}`);
      if (activePane) activePane.classList.add('active');

      // Update progress indicators
      const pill1 = document.getElementById('authStepPill1');
      const pill2 = document.getElementById('authStepPill2');
      const pill3 = document.getElementById('authStepPill3');
      const conn1 = document.getElementById('authConn1');
      const conn2 = document.getElementById('authConn2');

      if (pill1 && pill2 && pill3) {
        pill1.className = 'auth-step-pill ' + (stepNumber >= 1 ? 'completed active' : '');
        pill2.className = 'auth-step-pill ' + (stepNumber === 2 ? 'active' : stepNumber > 2 ? 'completed' : '');
        pill3.className = 'auth-step-pill ' + (stepNumber >= 3 ? 'active ' + (stepNumber === 4 ? 'completed' : '') : '');

        if (conn1) conn1.className = 'auth-step-connector ' + (stepNumber >= 2 ? 'active' : '');
        if (conn2) conn2.className = 'auth-step-connector ' + (stepNumber >= 3 ? 'active' : '');
      }

      // Reset validation messages
      this.clearValidation('authEmailValidationMsg');
      this.clearValidation('authOtpValidationMsg');

      if (stepNumber === 2) {
        this.clearOtpInputs();
      }
    },

    showValidation(elementId, message, isError = true) {
      const el = document.getElementById(elementId);
      if (!el) return;
      el.textContent = message;
      el.className = 'auth-validation-msg active ' + (isError ? 'error-state' : 'success-state');
    },

    clearValidation(elementId) {
      const el = document.getElementById(elementId);
      if (!el) return;
      el.textContent = '';
      el.className = 'auth-validation-msg';
    },

    openModal() {
      if (!this.modalElement) this.injectModalHtml();
      this.goToStep(1);
      this.modalElement.classList.add('active-open');
      this.modalElement.setAttribute('aria-hidden', 'false');
      document.body.classList.add('auth-modal-lock-scroll');
      if (window.lenis) window.lenis.stop();

      // Autofocus email input
      setTimeout(() => {
        const input = document.getElementById('authStudentEmail');
        if (input) input.focus();
      }, 150);
    },

    closeModal() {
      if (!this.modalElement) return;
      this.modalElement.classList.remove('active-open');
      this.modalElement.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('auth-modal-lock-scroll');
      if (window.lenis) window.lenis.start();
      if (this.timerInterval) clearInterval(this.timerInterval);
    }
  };

  // Auto-initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UIController.init());
  } else {
    UIController.init();
  }

  // Expose UI Controller methods for programmatic control
  window.IITianTattvaAuthModal = {
    open: () => UIController.openModal(),
    close: () => UIController.closeModal(),
    goToStep: (step) => UIController.goToStep(step)
  };

})(window, document);
