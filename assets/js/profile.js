/**
 * IITian Tattva - User Profile Controller & Dynamic Interaction Engine
 */

(function (window, document) {
  'use strict';

  let currentUser = null;
  let decayCardInstance = null;
  let pendingPhotoBase64 = null;

  document.addEventListener('DOMContentLoaded', () => {
    initProfilePage();
  });

  async function initProfilePage() {
    try {
      const res = await fetch('/api/profile');
      if (!res.ok) {
        showSignedOutState();
        return;
      }
      const data = await res.json();
      if (!data.profile) {
        showSignedOutState();
        return;
      }

      currentUser = data.profile;
      renderProfileUI(currentUser);
      initDecayCard(currentUser);
      initEditModal(currentUser);

      // Check query param ?edit=true
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('edit') === 'true') {
        openEditModal();
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      showSignedOutState();
    }
  }

  function showSignedOutState() {
    const profileGrid = document.getElementById('profileContentGrid');
    if (profileGrid) {
      profileGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #FFFFFF; border: 2.5px solid #131311; border-radius: 24px; box-shadow: 6px 8px 0 #131311;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 50%; background: #C6FD50; border: 2px solid #131311; margin-bottom: 20px;">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#131311" stroke-width="2.2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2 style="font-family: var(--font-primary, sans-serif); font-size: 28px; font-weight: 800; color: #131311; margin-bottom: 12px;">Sign in to view your profile</h2>
          <p style="font-size: 15px; color: #5F5F5C; max-width: 480px; margin: 0 auto 24px;">
            Your personal digital identity card, academic stage, and member resources become accessible as soon as you sign in with Google.
          </p>
          <button type="button" class="profile-edit-btn" id="promptSignInBtn" style="font-size: 15px; padding: 14px 28px;">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      `;

      document.getElementById('promptSignInBtn')?.addEventListener('click', () => {
        if (window.IITianTattvaAuth) {
          window.IITianTattvaAuth.openModal('/profile');
        }
      });
    }

    // Auto open sign in modal
    setTimeout(() => {
      if (window.IITianTattvaAuth) {
        window.IITianTattvaAuth.openModal('/profile');
      }
    }, 300);
  }

  function initDecayCard(user) {
    const container = document.getElementById('decayCardContainer');
    if (!container || !window.DecayCard) return;

    decayCardInstance = new window.DecayCard(container, {
      image: user.profileImage || 'https://images.unsplash.com/photo-1778849097774-0ab2a873a858?w=900&q=80&auto=format&fit=crop',
      fallbackImage: 'https://images.unsplash.com/photo-1778849097774-0ab2a873a858?w=900&q=80&auto=format&fit=crop',
      name: user.name || 'IITian Member',
      email: user.email || '',
      program: user.program || 'BS in Data Science and Applications',
      academicLevel: user.academicLevel || 'Foundation Level',
      github: user.github || '',
      linkedin: user.linkedin || '',
      leetcode: user.leetcode || '',
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
      scope: 'window',
      radius: 0,
      grayscale: false
    });
  }

  function renderProfileUI(user) {
    // 1. Personal details
    setText('profileNameDisplay', user.name);
    setText('profileUsernameDisplay', '@' + (user.username || 'learner'));
    setText('profileEmailDisplay', user.email);
    setText('profileBioDisplay', user.bio || 'No biography added yet.');
    setText('profileLocationDisplay', user.location || 'India');

    // 2. Academic details
    setText('profileInstituteDisplay', user.institute || 'IIT Madras');
    setText('profileProgramDisplay', user.program || 'BS in Data Science and Applications');
    setText('profileLevelDisplay', user.academicLevel || 'Foundation Level');

    // 3. Social & Portfolio links
    renderLink('profileGithubLink', user.github, 'GitHub');
    renderLink('profileLinkedinLink', user.linkedin, 'LinkedIn');
    renderLink('profileLeetcodeLink', user.leetcode, 'LeetCode');
    renderLink('profileXLink', user.x, 'X / Twitter');
    renderLink('profilePortfolioLink', user.portfolio, 'Portfolio');

    // 4. Skills tags
    const skillsContainer = document.getElementById('profileSkillsContainer');
    if (skillsContainer) {
      if (Array.isArray(user.skills) && user.skills.length > 0) {
        skillsContainer.innerHTML = user.skills
          .map(skill => `<span class="profile-skill-tag">${escapeHtml(skill)}</span>`)
          .join('');
      } else {
        skillsContainer.innerHTML = `<span class="profile-field-value muted-prompt">No skills added yet. Click Edit Profile to add skills.</span>`;
      }
    }

    // 5. Community verification status banner
    renderCommunityStatus(user);

    // 6. Calculate & render completion score
    calculateCompletionScore(user);
  }

  function renderCommunityStatus(user) {
    const banner = document.getElementById('communityStatusBanner');
    if (!banner) return;

    const isVerified = user.communityStatus === 'verified';
    banner.innerHTML = `
      <div style="flex: 1; min-width: 260px;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
          <span class="profile-status-badge ${isVerified ? 'verified' : 'unverified'}">
            ${isVerified ? '✓ Verified Student Member' : 'Institutional Verification Required'}
          </span>
          <span style="font-size: 11px; font-weight: 700; color: #8E8E89; text-transform: uppercase;">IIT Madras BS Degree</span>
        </div>
        <p style="font-size: 13px; color: #5F5F5C; margin: 0; line-height: 1.45;">
          ${isVerified
            ? `Verified with official student email: <strong>${escapeHtml(user.verifiedStudentEmail || user.email)}</strong>. You have full student community access.`
            : 'To unlock private student Discord invite channels and cohort study circles, verify your official <strong>@study.iitm.ac.in</strong> email.'}
        </p>
      </div>
      <div>
        ${isVerified
          ? `<a href="https://discord.gg/6pq2gRyDs" target="_blank" rel="noopener noreferrer" class="profile-status-btn" style="text-decoration:none; display:inline-block;">Open Community &rarr;</a>`
          : `<button type="button" class="profile-status-btn" id="verifyStudentStatusBtn">Verify Student Email &rarr;</button>`}
      </div>
    `;

    if (!isVerified) {
      document.getElementById('verifyStudentStatusBtn')?.addEventListener('click', () => {
        if (window.IITianTattvaAuthModal) {
          window.IITianTattvaAuthModal.open();
        }
      });
    }
  }

  function calculateCompletionScore(user) {
    const fields = [
      { name: 'Full Name', value: !!user.name, tip: 'Add your full name' },
      { name: 'Profile Photo', value: !!user.profileImage, tip: 'Upload a custom profile photo' },
      { name: 'Username', value: !!user.username, tip: 'Set a custom username' },
      { name: 'Biography', value: !!user.bio && user.bio.length > 15, tip: 'Add a short biography about your studies' },
      { name: 'Academic Level', value: !!user.academicLevel, tip: 'Select your current degree level' },
      { name: 'GitHub', value: !!user.github, tip: 'Add your GitHub profile' },
      { name: 'LinkedIn', value: !!user.linkedin, tip: 'Add your LinkedIn profile' },
      { name: 'Location', value: !!user.location, tip: 'Add your city/location' },
      { name: 'Skills & Interests', value: Array.isArray(user.skills) && user.skills.length > 0, tip: 'Add your key skills' },
      { name: 'Portfolio / Website', value: !!user.portfolio, tip: 'Add your portfolio website' }
    ];

    const completed = fields.filter(f => f.value).length;
    const percentage = Math.round((completed / fields.length) * 100);

    const badge = document.getElementById('profileCompletionBadge');
    const bar = document.getElementById('profileCompletionBarFill');
    const tip = document.getElementById('profileCompletionTip');

    if (badge) badge.textContent = `${percentage}%`;
    if (bar) bar.style.width = `${percentage}%`;

    const nextMissing = fields.find(f => !f.value);
    if (tip) {
      tip.textContent = nextMissing
        ? `Tip: ${nextMissing.tip} to complete your profile.`
        : 'Awesome! Your profile is 100% complete.';
    }
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '';
  }

  function renderLink(id, url, label) {
    const el = document.getElementById(id);
    if (!el) return;
    if (url) {
      el.href = url;
      el.classList.remove('empty');
      el.title = `Visit ${label} (${url})`;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    } else {
      el.href = 'javascript:void(0)';
      el.classList.add('empty');
      el.title = `No ${label} link provided`;
      el.removeAttribute('target');
      el.removeAttribute('rel');
    }
  }

  // Edit Profile Modal Logic
  function initEditModal(_user) {
    const openBtn = document.getElementById('editProfileBtn');
    const modal = document.getElementById('editProfileModal');
    const closeBtn = document.getElementById('editModalCloseBtn');
    const cancelBtn = document.getElementById('editModalCancelBtn');
    const form = document.getElementById('editProfileForm');
    const photoInput = document.getElementById('editPhotoFileInput');
    const photoPreview = document.getElementById('editPhotoPreview');

    openBtn?.addEventListener('click', () => openEditModal());
    closeBtn?.addEventListener('click', () => closeEditModal());
    cancelBtn?.addEventListener('click', () => closeEditModal());

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeEditModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('active')) {
        closeEditModal();
      }
    });

    // Photo input handling
    photoInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        showEditAlert('Please select a valid image file (JPEG, PNG, or WebP).', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showEditAlert('Image size exceeds 5MB limit.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        pendingPhotoBase64 = event.target.result;
        if (photoPreview) photoPreview.src = pendingPhotoBase64;
        showEditAlert('Photo selected. Click "Save Changes" to apply.', 'success');
      };
      reader.readAsDataURL(file);
    });

    // Form submit
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearEditAlert();

      const saveBtn = document.getElementById('editModalSaveBtn');
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving Changes...';

      try {
        let photoUrl = currentUser.profileImage;

        // 1. If photo was changed, upload first
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

        // 2. Prepare profile updates
        const skillsRaw = document.getElementById('editSkillsInput').value;
        const skillsArray = skillsRaw
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);

        const updates = {
          name: document.getElementById('editNameInput').value.trim(),
          username: document.getElementById('editUsernameInput').value.trim(),
          bio: document.getElementById('editBioInput').value.trim(),
          program: document.getElementById('editProgramInput').value.trim(),
          academicLevel: document.getElementById('editLevelInput').value.trim(),
          github: document.getElementById('editGithubInput').value.trim(),
          linkedin: document.getElementById('editLinkedinInput').value.trim(),
          leetcode: document.getElementById('editLeetcodeInput')?.value.trim() || '',
          x: document.getElementById('editXInput').value.trim(),
          portfolio: document.getElementById('editPortfolioInput').value.trim(),
          location: document.getElementById('editLocationInput').value.trim(),
          skills: skillsArray,
          profileImage: photoUrl
        };

        const updateRes = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        const updateData = await updateRes.json();
        if (!updateRes.ok) throw new Error(updateData.error || 'Failed to update profile');

        // Apply immediately
        currentUser = updateData.profile;
        renderProfileUI(currentUser);

        // Update DecayCard
        if (decayCardInstance) {
          decayCardInstance.updateProfile(currentUser);
        }

        // Update navbar avatar
        if (window.IITianTattvaAuth) {
          window.IITianTattvaAuth.renderNavbarProfile(currentUser);
        }

        showEditAlert('Profile saved successfully!', 'success');
        pendingPhotoBase64 = null;

        setTimeout(() => {
          closeEditModal();
        }, 600);
      } catch (err) {
        showEditAlert(err.message, 'error');
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Changes';
      }
    });
  }

  function openEditModal() {
    if (!currentUser) return;
    const modal = document.getElementById('editProfileModal');
    if (!modal) return;

    // Populate inputs
    setValue('editNameInput', currentUser.name);
    setValue('editUsernameInput', currentUser.username);
    setValue('editEmailInput', currentUser.email);
    setValue('editBioInput', currentUser.bio);
    setValue('editProgramInput', currentUser.program);
    setValue('editLevelInput', currentUser.academicLevel);
    setValue('editGithubInput', currentUser.github);
    setValue('editLinkedinInput', currentUser.linkedin);
    setValue('editLeetcodeInput', currentUser.leetcode);
    setValue('editXInput', currentUser.x);
    setValue('editPortfolioInput', currentUser.portfolio);
    setValue('editLocationInput', currentUser.location);
    setValue('editSkillsInput', Array.isArray(currentUser.skills) ? currentUser.skills.join(', ') : '');

    const preview = document.getElementById('editPhotoPreview');
    if (preview) {
      preview.src = currentUser.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&q=80&auto=format&fit=crop';
    }

    clearEditAlert();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeEditModal() {
    const modal = document.getElementById('editProfileModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function setValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  }

  function showEditAlert(msg, type = 'error') {
    const alertEl = document.getElementById('editModalAlert');
    if (!alertEl) return;
    alertEl.textContent = msg;
    alertEl.className = `edit-modal-alert active ${type}`;
  }

  function clearEditAlert() {
    const alertEl = document.getElementById('editModalAlert');
    if (!alertEl) return;
    alertEl.textContent = '';
    alertEl.className = 'edit-modal-alert';
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

})(window, document);
