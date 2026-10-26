/**
 * IITian Tattva - Global In-Page Profile Modal & Interactive Identity Controller
 *
 * Displays the complete User Profile (DecayCard + Ambassador/Learner Panel)
 * directly in front of the user on ANY page, with real-time editing and photo uploads.
 */

(function (window, document) {
  'use strict';

  let currentUser = null;
  let decayCardInstance = null;
  let pendingPhotoBase64 = null;
  let modalElement = null;

  const ProfileModal = {
    init() {
      this.injectModal();
      this.bindEvents();
    },

    injectModal() {
      if (document.getElementById('tattvaProfileModal')) {
        modalElement = document.getElementById('tattvaProfileModal');
        return;
      }

      const modalWrap = document.createElement('div');
      modalWrap.className = 'prof-modal-overlay';
      modalWrap.id = 'tattvaProfileModal';
      modalWrap.setAttribute('role', 'dialog');
      modalWrap.setAttribute('aria-modal', 'true');
      modalWrap.setAttribute('aria-hidden', 'true');

      modalWrap.innerHTML = `
        <div class="prof-modal-dialog" data-lenis-prevent>
          <!-- Close Button -->
          <button type="button" class="prof-modal-close" id="profModalCloseBtn" aria-label="Close profile modal">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          <!-- Modal Grid -->
          <div class="prof-modal-grid">

            <!-- LEFT: DecayCard Digital Identity Card -->
            <div class="prof-modal-card-col">
              <div class="prof-modal-decaycard-wrap" id="profModalDecayCard">
                <!-- Rendered by DecayCard WebGL2 component -->
              </div>
              <div class="prof-modal-card-tag">
                <span class="prof-modal-card-tag-dot"></span>
                <span>DecayCard • Digital Identity</span>
              </div>
            </div>

            <!-- RIGHT: Learner / Ambassador Profile Panel (Inspired by Image 3) -->
            <div class="prof-modal-panel-col">

              <!-- VIEW MODE: Learner Card -->
              <div class="prof-learner-card" id="profLearnerViewCard">
                <div class="prof-learner-header">
                  <div class="prof-learner-title-group">
                    <h2 class="prof-learner-title" id="profModalName">IITian Member</h2>
                    <span class="prof-learner-badge" id="profModalBadge">IITM BS LEARNER</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <button type="button" class="prof-edit-toggle-btn" id="profOpenEditBtn" style="width: auto; padding: 6px 14px;">
                      <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button type="button" class="prof-signout-btn" id="profModalSignOutBtn" style="background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.22); color: #FFF; border-radius: 8px; padding: 6px 12px; font-size: 11.5px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 5px;" title="Sign out of your account">
                      <svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"/>
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>

                <!-- 2-Column Subgrid: Info Rows + Achievement Card -->
                <div class="prof-learner-body-grid">
                  <div class="prof-info-rows">
                    <!-- Student ID / Username -->
                    <div class="prof-info-row">
                      <div class="prof-info-icon-box">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                      <div class="prof-info-text-wrap">
                        <div class="prof-info-label">Learner ID / Username</div>
                        <div class="prof-info-val" id="profModalUsername">@learner</div>
                      </div>
                    </div>

                    <!-- Email -->
                    <div class="prof-info-row">
                      <div class="prof-info-icon-box">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </div>
                      <div class="prof-info-text-wrap">
                        <div class="prof-info-label">Email Address</div>
                        <div class="prof-info-val" id="profModalEmail">learner@gmail.com</div>
                      </div>
                    </div>

                    <!-- Programme -->
                    <div class="prof-info-row">
                      <div class="prof-info-icon-box">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                        </svg>
                      </div>
                      <div class="prof-info-text-wrap">
                        <div class="prof-info-label">Degree Programme</div>
                        <div class="prof-info-val" id="profModalProgram">BS in Data Science and Applications</div>
                      </div>
                    </div>

                    <!-- Academic Level / Stage -->
                    <div class="prof-info-row">
                      <div class="prof-info-icon-box">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="8" r="7"/>
                          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                        </svg>
                      </div>
                      <div class="prof-info-text-wrap">
                        <div class="prof-info-label">Academic Stage</div>
                        <div class="prof-info-val" id="profModalLevel">Foundation Level</div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Box: Community Status & Milestone Slots -->
                  <div class="prof-achievement-card">
                    <div class="prof-achievement-title">
                      IIT Madras BS Degree<br>
                      <span id="profModalStatusText">Verified Student Member</span>
                    </div>

                    <div class="prof-badges-row">
                      <div class="prof-badge-slot unlocked" title="Data Science Foundation">DS</div>
                      <div class="prof-badge-slot unlocked" title="Machine Learning">ML</div>
                      <div class="prof-badge-slot unlocked" title="Artificial Intelligence">AI</div>
                      <div class="prof-badge-slot unlocked" title="IIT Madras">IITM</div>
                    </div>

                    <button type="button" class="prof-edit-toggle-btn" id="profCardEditActionBtn">
                      <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                      <span>Edit My Details</span>
                    </button>
                  </div>
                </div>

                <!-- Bottom Socials Bar: GitHub, LinkedIn, LeetCode -->
                <div class="prof-socials-bar">
                  <span style="font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.6); text-transform: uppercase;">Profiles:</span>
                  <a href="#" class="prof-social-btn" id="profModalGithubBtn" target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    <span>GitHub</span>
                  </a>
                  <a href="#" class="prof-social-btn" id="profModalLinkedinBtn" target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                  <a href="#" class="prof-social-btn" id="profModalLeetcodeBtn" target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.559 5.88 5.88 0 0 0 2.457-.146 5.73 5.73 0 0 0 2.216-1.121l4.02-4.043a1.375 1.375 0 0 0 0-1.944 1.375 1.375 0 0 0-1.945 0l-4.019 4.043a3.02 3.02 0 0 1-1.185.602 3.09 3.09 0 0 1-1.309.076 3.197 3.197 0 0 1-2.6-1.921 2.97 2.97 0 0 1-.188-.549 3.04 3.04 0 0 1-.034-1.301 2.89 2.89 0 0 1 .665-1.157l3.854-4.126 5.406-5.788A1.375 1.375 0 0 0 13.483 0zm4.271 8.86a1.375 1.375 0 0 0-.972.403 1.375 1.375 0 0 0 0 1.944l2.458 2.473a1.375 1.375 0 0 1 0 1.944l-2.458 2.473a1.375 1.375 0 1 0 1.945 1.944l2.458-2.473a4.125 4.125 0 0 0 0-5.832l-2.458-2.473a1.375 1.375 0 0 0-.973-.46zM9.467 11.23a1.375 1.375 0 0 0-1.375 1.375 1.375 1.375 0 0 0 1.375 1.375h5.5a1.375 1.375 0 0 0 1.375-1.375 1.375 1.375 0 0 0-1.375-1.375z"/>
                    </svg>
                    <span>LeetCode</span>
                  </a>
                </div>
              </div>

              <!-- EDIT MODE FORM: Appears when clicking Edit -->
              <div class="prof-edit-form-wrap" id="profEditFormWrap">
                <div class="prof-edit-header">
                  <h3 class="prof-edit-title">Edit Profile Information</h3>
                  <button type="button" class="prof-edit-cancel-btn" id="profCloseEditBtn">Back to View</button>
                </div>

                <form id="profInlineEditForm">
                  <!-- Photo Upload Row -->
                  <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px; padding: 10px; background: #FAFAF7; border: 1.5px solid #131311; border-radius: 12px;">
                    <img id="profEditPhotoPreview" src="" alt="preview" style="width: 48px; height: 48px; border-radius: 50%; border: 1.5px solid #131311; object-fit: cover;" />
                    <div style="flex: 1;">
                      <div style="font-size: 12px; font-weight: 800; color: #131311;">Update Profile Photo</div>
                      <label for="profEditFileInput" style="display: inline-block; margin-top: 4px; padding: 4px 10px; background: #131311; color: #FFF; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
                        Choose Photo
                      </label>
                      <input type="file" id="profEditFileInput" accept="image/jpeg,image/png,image/webp" style="display: none;" />
                    </div>
                  </div>

                  <div class="prof-edit-grid">
                    <div>
                      <label class="prof-edit-label">Full Name *</label>
                      <input type="text" class="prof-edit-input" id="profEditNameInput" required />
                    </div>

                    <div>
                      <label class="prof-edit-label">Username *</label>
                      <input type="text" class="prof-edit-input" id="profEditUsernameInput" required pattern="^[a-zA-Z0-9_]{3,30}$" />
                    </div>

                    <div>
                      <label class="prof-edit-label">Academic Stage</label>
                      <select class="prof-edit-input" id="profEditLevelSelect">
                        <option value="Qualifier">Qualifier</option>
                        <option value="Foundation Level">Foundation Level</option>
                        <option value="Diploma in Programming">Diploma in Programming</option>
                        <option value="Diploma in Data Science">Diploma in Data Science</option>
                        <option value="BSc Degree Level">BSc Degree Level</option>
                        <option value="BS Degree Level">BS Degree Level</option>
                        <option value="Alumnus / Graduate">Alumnus / Graduate</option>
                      </select>
                    </div>

                    <div>
                      <label class="prof-edit-label">Location</label>
                      <input type="text" class="prof-edit-input" id="profEditLocationInput" placeholder="e.g. India" />
                    </div>

                    <div>
                      <label class="prof-edit-label">GitHub Profile URL</label>
                      <input type="url" class="prof-edit-input" id="profEditGithubInput" placeholder="https://github.com/..." />
                    </div>

                    <div>
                      <label class="prof-edit-label">LinkedIn Profile URL</label>
                      <input type="url" class="prof-edit-input" id="profEditLinkedinInput" placeholder="https://linkedin.com/in/..." />
                    </div>

                    <div class="prof-edit-span-2">
                      <label class="prof-edit-label">LeetCode Profile (URL or Username)</label>
                      <input type="text" class="prof-edit-input" id="profEditLeetcodeInput" placeholder="https://leetcode.com/u/... or username" />
                    </div>

                    <div class="prof-edit-span-2">
                      <label class="prof-edit-label">Short Biography</label>
                      <textarea class="prof-edit-input" id="profEditBioInput" rows="2" style="padding: 8px 12px; resize: vertical;" placeholder="Add a few lines about your interests..."></textarea>
                    </div>
                  </div>

                  <div class="prof-edit-actions">
                    <button type="button" class="prof-edit-cancel-btn" id="profCancelEditBtn">Cancel</button>
                    <button type="submit" class="prof-edit-save-btn" id="profSaveEditBtn">Save Changes</button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modalWrap);
      modalElement = modalWrap;
    },

    bindEvents() {
      const closeBtn = document.getElementById('profModalCloseBtn');
      const modal = document.getElementById('tattvaProfileModal');
      const openEditBtn = document.getElementById('profOpenEditBtn');
      const cardEditBtn = document.getElementById('profCardEditActionBtn');
      const closeEditBtn = document.getElementById('profCloseEditBtn');
      const cancelEditBtn = document.getElementById('profCancelEditBtn');
      const editForm = document.getElementById('profInlineEditForm');
      const fileInput = document.getElementById('profEditFileInput');
      const photoPreview = document.getElementById('profEditPhotoPreview');

      closeBtn?.addEventListener('click', () => this.close());
      modal?.addEventListener('click', (e) => {
        if (e.target === modal) this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active-open')) {
          this.close();
        }
      });

      // Toggle edit mode
      openEditBtn?.addEventListener('click', () => this.showEditMode(true));
      cardEditBtn?.addEventListener('click', () => this.showEditMode(true));
      closeEditBtn?.addEventListener('click', () => this.showEditMode(false));
      cancelEditBtn?.addEventListener('click', () => this.showEditMode(false));

      // Sign Out from profile modal
      const signOutBtn = document.getElementById('profModalSignOutBtn');
      signOutBtn?.addEventListener('click', () => {
        this.close();
        if (window.IITianTattvaAuth) {
          window.IITianTattvaAuth.signOut();
        }
      });

      // Photo upload in edit mode
      fileInput?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          if (window.IITianTattva?.toast) {
            window.IITianTattva.toast('Please select a valid image (JPEG, PNG, or WebP).', 'error');
          } else {
            alert('Please select a valid image (JPEG, PNG, or WebP).');
          }
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          if (window.IITianTattva?.toast) {
            window.IITianTattva.toast('Image size exceeds 5MB limit.', 'error');
          } else {
            alert('Image size exceeds 5MB limit.');
          }
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          pendingPhotoBase64 = event.target.result;
          if (photoPreview) photoPreview.src = pendingPhotoBase64;
          if (decayCardInstance) decayCardInstance.setImage(pendingPhotoBase64);
        };
        reader.readAsDataURL(file);
      });

      // Save form
      editForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const saveBtn = document.getElementById('profSaveEditBtn');
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        try {
          let photoUrl = currentUser.profileImage;

          // 1. Upload photo if selected
          if (pendingPhotoBase64) {
            const uploadRes = await fetch('/api/profile/upload-photo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: pendingPhotoBase64 })
            });
            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.error || 'Failed to upload photo');
            photoUrl = uploadData.url;
          }

          // 2. Save profile updates
          const updates = {
            name: document.getElementById('profEditNameInput').value.trim(),
            username: document.getElementById('profEditUsernameInput').value.trim(),
            bio: document.getElementById('profEditBioInput').value.trim(),
            academicLevel: document.getElementById('profEditLevelSelect').value.trim(),
            location: document.getElementById('profEditLocationInput') ? document.getElementById('profEditLocationInput').value.trim() : 'India',
            github: document.getElementById('profEditGithubInput').value.trim(),
            linkedin: document.getElementById('profEditLinkedinInput').value.trim(),
            leetcode: document.getElementById('profEditLeetcodeInput').value.trim(),
            profileImage: photoUrl
          };

          const updateRes = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
          });
          const updateData = await updateRes.json();
          if (!updateRes.ok) throw new Error(updateData.error || 'Failed to save changes');

          currentUser = updateData.profile;
          pendingPhotoBase64 = null;

          // Update UI
          this.populateView(currentUser);
          if (decayCardInstance) {
            decayCardInstance.updateProfile(currentUser);
          }

          // Update navbar avatar
          if (window.IITianTattvaAuth) {
            window.IITianTattvaAuth.renderNavbarProfile(currentUser);
          }

          this.showEditMode(false);
        } catch (err) {
          alert(err.message || 'Error saving profile.');
        } finally {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Save Changes';
        }
      });
    },

    async open(startInEditMode = false) {
      if (!modalElement) this.injectModal();

      // Check current session
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) {
          // If not signed in, show Google Sign-in modal
          if (window.IITianTattvaAuth) {
            window.IITianTattvaAuth.openModal('/profile');
          }
          return;
        }

        const data = await res.json();
        currentUser = data.profile;
        if (!currentUser) {
          if (window.IITianTattvaAuth) window.IITianTattvaAuth.openModal('/profile');
          return;
        }

        this.populateView(currentUser);
        this.initDecayCard(currentUser);

        modalElement.classList.add('active-open');
        modalElement.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (window.lenis) window.lenis.stop();

        this.showEditMode(startInEditMode);

        setTimeout(() => {
          if (decayCardInstance) {
            decayCardInstance.resize();
            decayCardInstance.wake();
          }
        }, 60);
      } catch (err) {
        console.error('Failed to open profile modal:', err);
      }
    },

    close() {
      if (!modalElement) return;
      modalElement.classList.remove('active-open');
      modalElement.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
      this.showEditMode(false);
    },

    initDecayCard(user) {
      const container = document.getElementById('profModalDecayCard');
      if (!container || !window.DecayCard) return;

      if (!decayCardInstance) {
        decayCardInstance = new window.DecayCard(container, {
          image: user.profileImage || 'https://images.unsplash.com/photo-1778849097774-0ab2a873a858?w=900&q=80&auto=format&fit=crop',
          fallbackImage: 'https://images.unsplash.com/photo-1778849097774-0ab2a873a858?w=900&q=80&auto=format&fit=crop',
          name: user.name || 'IITian Member',
          email: user.email || '',
          github: user.github || '',
          linkedin: user.linkedin || '',
          leetcode: user.leetcode || '',
          program: user.program || 'BS in Data Science & Applications',
          academicLevel: user.academicLevel || 'Member',
          width: 300,
          height: 400,
          intensity: 0.5,
          sensitivity: 0.5,
          hoverDecay: 0.05,
          recovery: 0.6,
          idle: 0.35,
          grain: 0.25,
          detail: 5,
          pattern: 4,
          flow: 0,
          chroma: 0,
          travel: 50,
          tilt: 10,
          scope: 'window'
        });
      } else {
        decayCardInstance.updateProfile(user);
      }
    },

    populateView(user) {
      if (!user) return;

      // 1. Summary Card details
      setText('profModalName', user.name || 'IITian Member');
      setText('profModalUsername', '@' + (user.username || 'learner'));
      setText('profModalEmail', user.email || '—');
      setText('profModalProgram', user.program || 'BS in Data Science and Applications');
      setText('profModalLevel', user.academicLevel || 'Foundation Level');

      const isVerified = user.communityStatus === 'verified';
      const statusText = document.getElementById('profModalStatusText');
      if (statusText) {
        statusText.textContent = isVerified ? '✓ Verified Student Member' : 'Student Verification Pending';
        statusText.style.color = isVerified ? '#C6FD50' : '#FCA5A5';
      }

      // Summary Card social buttons
      setSocialBtn('profModalGithubBtn', user.github, 'GitHub');
      setSocialBtn('profModalLinkedinBtn', user.linkedin, 'LinkedIn');
      setSocialBtn('profModalLeetcodeBtn', user.leetcode, 'LeetCode');

      // Populate edit inputs
      setValue('profEditNameInput', user.name);
      setValue('profEditUsernameInput', user.username);
      setValue('profEditLevelSelect', user.academicLevel || 'Foundation Level');
      setValue('profEditLocationInput', user.location || 'India');
      setValue('profEditGithubInput', user.github);
      setValue('profEditLinkedinInput', user.linkedin);
      setValue('profEditLeetcodeInput', user.leetcode);
      setValue('profEditBioInput', user.bio);

      const preview = document.getElementById('profEditPhotoPreview');
      if (preview) {
        preview.src = user.profileImage || 'https://images.unsplash.com/photo-1778849097774-0ab2a873a858?w=900&q=80&auto=format&fit=crop';
      }
    },

    showEditMode(isEdit) {
      const viewCard = document.getElementById('profLearnerViewCard');
      const editWrap = document.getElementById('profEditFormWrap');

      if (isEdit) {
        viewCard?.style.setProperty('display', 'none');
        editWrap?.classList.add('open');
      } else {
        viewCard?.style.removeProperty('display');
        editWrap?.classList.remove('open');
      }
    }
  };

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val || '';
  }

  function setValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  }

  function setSocialBtn(id, url, label) {
    const btn = document.getElementById(id);
    if (!btn) return;
    if (url) {
      btn.href = url;
      btn.classList.remove('disabled');
      btn.title = `View ${label} Profile`;
    } else {
      btn.href = '#';
      btn.classList.add('disabled');
      btn.title = `No ${label} link provided`;
    }
  }

  window.IITianTattvaProfileModal = ProfileModal;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ProfileModal.init());
  } else {
    ProfileModal.init();
  }

})(window, document);
