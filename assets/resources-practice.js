/**
 * IITian Tattva | Resources: PYQs & Practice Interactive Engine
 * Handles modal choice, PYQ filtering, Practice test generation, timed exam runner, and grading.
 */

(function () {
  'use strict';

  // Wait until DOM and store are ready
  document.addEventListener('DOMContentLoaded', () => {
    initChoiceModal();
    if (document.getElementById('practiceEngineApp')) {
      initPracticeEngine();
    }
  });

  /* ==========================================================================
     1. TWO-OPTION CHOICE MODAL (On /resources page)
     ========================================================================== */
  function initChoiceModal() {
    // If the modal markup is not in the page yet, inject it cleanly
    if (!document.getElementById('tattvaChoiceModal')) {
      const modalHtml = `
        <div class="tattva-choice-modal-backdrop" id="tattvaChoiceModal" role="dialog" aria-modal="true" aria-labelledby="modalChoiceTitle">
          <div class="tattva-choice-modal">
            <button class="modal-close-btn" id="closeChoiceModalBtn" aria-label="Close dialog">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <span class="modal-header-tag">IITian Tattva Resources</span>
            <h2 class="modal-title" id="modalChoiceTitle">Select Practice Track</h2>
            <p class="modal-subtitle">Choose whether you want to solve archived examination papers or launch a customizable timed diagnostic test.</p>
            
            <div class="modal-choice-cards-grid">
              <!-- Choice 1: PYQ -->
              <a href="/resources/quiz?mode=pyq" class="modal-choice-card" id="choosePyqCard">
                <div class="choice-card-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                </div>
                <div>
                  <h3 class="choice-card-title">Previous Year Papers</h3>
                  <p class="choice-card-desc">Attempt official past-term examination papers and qualifier quizzes with authentic time limits and full solutions.</p>
                </div>
                <div class="choice-card-btn-link">
                  <span>Explore PYQ Papers</span>
                  <span>&rarr;</span>
                </div>
              </a>

              <!-- Choice 2: Practice Questions -->
              <a href="/resources/quiz?mode=practice" class="modal-choice-card" id="choosePracticeCard">
                <div class="choice-card-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div>
                  <h3 class="choice-card-title">Practice Questions</h3>
                  <p class="choice-card-desc">Configure timed mock tests (15, 25, or 45 questions) with randomized questions across Python, Maths, and Stats.</p>
                </div>
                <div class="choice-card-btn-link">
                  <span>Start Practice Test</span>
                  <span>&rarr;</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    const modal = document.getElementById('tattvaChoiceModal');
    const closeBtn = document.getElementById('closeChoiceModalBtn');

    // Intercept clicks on EXPLORE PYQ'S & PRACTICE CTA buttons
    const triggerButtons = document.querySelectorAll('#exploreQuizCta, .open-pyq-choice-modal');
    triggerButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Only open modal if we are on /resources or homepage
        const isEnginePage = window.location.pathname.includes('/resources/quiz');
        if (!isEnginePage) {
          e.preventDefault();
          openModal();
        }
      });
    });

    function openModal() {
      if (modal) {
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeModal() {
      if (modal) {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  /* ==========================================================================
     2. DEDICATED ENGINE APPLICATION (On /resources/quiz page)
     ========================================================================== */
  function initPracticeEngine() {
    const store = window.IITianExamStore;
    if (!store) {
      console.error('IITianExamStore not found. Please ensure data scripts are loaded.');
      return;
    }

    const appContainer = document.getElementById('practiceEngineApp');
    if (!appContainer) return;

    // Read URL params
    const urlParams = new URLSearchParams(window.location.search);
    let activeMode = urlParams.get('mode') === 'practice' ? 'practice' : 'pyq';
    const targetPaperId = urlParams.get('paperId') || null;

    // Session State
    let activeExamSession = null;
    let currentQuestionIndex = 0;
    let userAnswers = {}; // { [index]: optionIndex }
    let timerInterval = null;
    let timeRemainingSeconds = 0;
    let totalExamDurationSeconds = 0;

    // Render Initial Shell
    renderEngineShell();

    // If direct paper requested in URL, launch immediately
    if (targetPaperId) {
      launchPaperExam(targetPaperId);
    }

    /**
     * Renders the main view switcher and panels
     */
    function renderEngineShell() {
      appContainer.innerHTML = `
        <!-- View Navigation Mode Switcher -->
        <div class="engine-mode-tabs-container" id="engineModeTabsContainer">
          <div class="engine-mode-pill-track" role="tablist">
            <button class="engine-mode-tab-btn ${activeMode === 'pyq' ? 'is-active' : ''}" id="tabBtnPyq" role="tab" aria-selected="${activeMode === 'pyq'}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              <span>Previous Year Papers (PYQ)</span>
            </button>
            <button class="engine-mode-tab-btn ${activeMode === 'practice' ? 'is-active' : ''}" id="tabBtnPractice" role="tab" aria-selected="${activeMode === 'practice'}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>Custom Practice Tests</span>
            </button>
          </div>
        </div>

        <!-- Dynamic Content Mount Point -->
        <div id="engineViewMount"></div>

        <!-- Confirmation Dialog Mount Point -->
        <div class="exam-dialog-overlay" id="examConfirmDialog" role="dialog" aria-modal="true"></div>
      `;

      // Attach tab clicks
      document.getElementById('tabBtnPyq').addEventListener('click', () => switchMode('pyq'));
      document.getElementById('tabBtnPractice').addEventListener('click', () => switchMode('practice'));

      // Render Active Mode View
      if (activeMode === 'pyq') {
        renderPyqLibraryView();
      } else {
        renderPracticeConfigView();
      }
    }

    function switchMode(mode) {
      if (activeExamSession) {
        if (!confirm('An examination is currently active. Leaving this screen will cancel your progress. Proceed?')) {
          return;
        }
        clearInterval(timerInterval);
        activeExamSession = null;
      }

      activeMode = mode;
      const url = new URL(window.location);
      url.searchParams.set('mode', mode);
      url.searchParams.delete('paperId');
      window.history.replaceState({}, '', url);

      const tabPyq = document.getElementById('tabBtnPyq');
      const tabPractice = document.getElementById('tabBtnPractice');
      if (tabPyq && tabPractice) {
        tabPyq.classList.toggle('is-active', mode === 'pyq');
        tabPractice.classList.toggle('is-active', mode === 'practice');
        tabPyq.setAttribute('aria-selected', mode === 'pyq');
        tabPractice.setAttribute('aria-selected', mode === 'practice');
      }

      if (mode === 'pyq') {
        renderPyqLibraryView();
      } else {
        renderPracticeConfigView();
      }
    }

    /* ------------------------------------------------------------------------
       2.1 PYQ LIBRARY VIEW & REAL-TIME FILTERS
       ------------------------------------------------------------------------ */
    function renderPyqLibraryView() {
      const mount = document.getElementById('engineViewMount');
      const subjects = store.getSubjects();

      // State for filters
      const filterState = {
        level: 'all',
        semester: 'all',
        subjectId: 'all',
        examType: 'all',
        year: 'all',
        search: ''
      };

      mount.innerHTML = `
        <div class="pyq-controls-panel">
          <div class="pyq-search-row">
            <div class="pyq-search-input-wrap">
              <svg class="pyq-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" class="pyq-search-input" id="pyqSearchInput" placeholder="Search by paper title, subject, or syllabus topic...">
            </div>
          </div>

          <div class="pyq-filters-row">
            <div class="pyq-filter-group">
              <label class="pyq-filter-label" for="filterSubject">Subject</label>
              <select class="pyq-select" id="filterSubject">
                <option value="all">All Subjects</option>
                ${subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
              </select>
            </div>

            <div class="pyq-filter-group">
              <label class="pyq-filter-label" for="filterSemester">Semester</label>
              <select class="pyq-select" id="filterSemester">
                <option value="all">All Semesters</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>

            <div class="pyq-filter-group">
              <label class="pyq-filter-label" for="filterExamType">Exam Type</label>
              <select class="pyq-select" id="filterExamType">
                <option value="all">All Types</option>
                <option value="End-Term">End-Term Examination</option>
                <option value="Quiz">Term Quiz</option>
              </select>
            </div>

            <div class="pyq-filter-group">
              <label class="pyq-filter-label" for="filterYear">Year</label>
              <select class="pyq-select" id="filterYear">
                <option value="all">All Years</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>

            <button class="pyq-reset-filters-btn" id="pyqResetFiltersBtn" title="Reset all filters">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div id="pyqPapersMount"></div>
      `;

      // Cache DOM elements
      const searchInput = document.getElementById('pyqSearchInput');
      const subjectSelect = document.getElementById('filterSubject');
      const semesterSelect = document.getElementById('filterSemester');
      const examTypeSelect = document.getElementById('filterExamType');
      const yearSelect = document.getElementById('filterYear');
      const resetBtn = document.getElementById('pyqResetFiltersBtn');

      function updatePaperCards() {
        const filteredPapers = store.getPapers(filterState);
        const container = document.getElementById('pyqPapersMount');

        if (!filteredPapers.length) {
          container.innerHTML = `
            <div class="pyq-empty-state">
              <div class="pyq-empty-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8E8E89" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <h3 class="pyq-empty-title">No Papers Found</h3>
              <p class="pyq-empty-desc">We couldn't find any papers matching your current filters. Try resetting your search query or choosing another subject.</p>
              <button class="start-practice-btn" id="emptyStateResetBtn" style="height: 44px; padding: 0 20px; font-size: 12px; margin: 0 auto;">
                Clear All Filters
              </button>
            </div>
          `;
          document.getElementById('emptyStateResetBtn')?.addEventListener('click', resetAllFilters);
          return;
        }

        container.innerHTML = `
          <div class="pyq-papers-grid">
            ${filteredPapers.map(paper => `
              <div class="pyq-paper-card" data-paper-id="${paper.id}">
                <div>
                  <div class="pyq-card-top-badges">
                    <span class="pyq-badge pyq-badge-demo">${paper.badge || 'SAMPLE'}</span>
                    <span class="pyq-badge pyq-badge-level">${paper.level}</span>
                    <span class="pyq-badge pyq-badge-level">Sem ${paper.semester}</span>
                    <span class="pyq-badge pyq-badge-type">${paper.examType}</span>
                  </div>

                  <h3 class="pyq-paper-title">${paper.title}</h3>

                  <div class="pyq-meta-items-row">
                    <span class="pyq-meta-item">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      <span>${paper.year}</span>
                    </span>
                    <span class="pyq-meta-item">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                      <span>${paper.questionCount} Questions</span>
                    </span>
                    <span class="pyq-meta-item">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      <span>${paper.durationMinutes} Mins</span>
                    </span>
                  </div>

                  <p class="pyq-syllabus-scope">
                    <strong>Scope:</strong> ${paper.syllabusScope || 'Comprehensive Coursework'}
                  </p>
                </div>

                <button class="pyq-attempt-btn" data-paper-id="${paper.id}">
                  <span>Attempt Paper</span>
                  <span>&rarr;</span>
                </button>
              </div>
            `).join('')}
          </div>
        `;

        // Attach attempt buttons
        container.querySelectorAll('.pyq-attempt-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const pid = btn.dataset.paperId;
            launchPaperExam(pid);
          });
        });
      }

      function resetAllFilters() {
        filterState.level = 'all';
        filterState.semester = 'all';
        filterState.subjectId = 'all';
        filterState.examType = 'all';
        filterState.year = 'all';
        filterState.search = '';

        if (searchInput) searchInput.value = '';
        if (subjectSelect) subjectSelect.value = 'all';
        if (semesterSelect) semesterSelect.value = 'all';
        if (examTypeSelect) examTypeSelect.value = 'all';
        if (yearSelect) yearSelect.value = 'all';

        updatePaperCards();
      }

      // Event listeners
      searchInput.addEventListener('input', (e) => {
        filterState.search = e.target.value;
        updatePaperCards();
      });
      subjectSelect.addEventListener('change', (e) => {
        filterState.subjectId = e.target.value;
        updatePaperCards();
      });
      semesterSelect.addEventListener('change', (e) => {
        filterState.semester = e.target.value;
        updatePaperCards();
      });
      examTypeSelect.addEventListener('change', (e) => {
        filterState.examType = e.target.value;
        updatePaperCards();
      });
      yearSelect.addEventListener('change', (e) => {
        filterState.year = e.target.value;
        updatePaperCards();
      });
      resetBtn.addEventListener('click', resetAllFilters);

      // Initial render
      updatePaperCards();
    }

    /* ------------------------------------------------------------------------
       2.2 PRACTICE QUESTIONS CONFIGURATION VIEW
       ------------------------------------------------------------------------ */
    function renderPracticeConfigView() {
      const mount = document.getElementById('engineViewMount');
      const subjects = store.getSubjects();

      let selectedQuestionCount = 15;
      let selectedSubjectId = 'all';

      mount.innerHTML = `
        <div class="practice-config-panel">
          <div class="practice-config-header">
            <span class="modal-header-tag">Adaptive Test Builder</span>
            <h2 class="modal-title">Configure Your Practice Test</h2>
            <p class="modal-subtitle">Generate a custom timed examination session with randomized problem sets drawn from our verified question bank.</p>
          </div>

          <!-- Subject Scope Dropdown -->
          <div class="practice-subject-filter-box">
            <h4 class="practice-section-heading">1. Select Subject Scope</h4>
            <div style="max-width: 420px;">
              <select class="pyq-select" id="practiceSubjectSelect" style="width: 100%;">
                <option value="all">All Foundation Subjects (Comprehensive Mock)</option>
                ${subjects.map(s => `<option value="${s.id}">${s.name} (Sem ${s.semester})</option>`).join('')}
              </select>
            </div>
          </div>

          <!-- Test Size Cards -->
          <div>
            <h4 class="practice-section-heading">2. Choose Exam Duration & Question Count</h4>
            <div class="practice-options-grid">
              <!-- Option 1: 15 Qs / 30 Min -->
              <div class="practice-size-card is-selected" data-count="15" data-duration="30" tabindex="0" role="button" aria-pressed="true">
                <div class="practice-card-top-row">
                  <span class="practice-card-pill">30 MINS</span>
                  <div class="practice-radio-indicator"></div>
                </div>
                <div class="practice-card-count">15 Questions</div>
                <div class="practice-card-duration">30 Minutes</div>
                <p class="practice-card-desc">Quick diagnostic blitz. Ideal for daily consistency and isolating specific conceptual blind spots.</p>
              </div>

              <!-- Option 2: 25 Qs / 50 Min -->
              <div class="practice-size-card" data-count="25" data-duration="50" tabindex="0" role="button" aria-pressed="false">
                <div class="practice-card-top-row">
                  <span class="practice-card-pill">50 MINS</span>
                  <div class="practice-radio-indicator"></div>
                </div>
                <div class="practice-card-count">25 Questions</div>
                <div class="practice-card-duration">50 Minutes</div>
                <p class="practice-card-desc">Standard term quiz simulation. Calibrated for midterm syllabus check and pacing under pressure.</p>
              </div>

              <!-- Option 3: 45 Qs / 1 Hour 30 Min (90 Min) -->
              <div class="practice-size-card" data-count="45" data-duration="90" tabindex="0" role="button" aria-pressed="false">
                <div class="practice-card-top-row">
                  <span class="practice-card-pill">1 HR 30 MINS</span>
                  <div class="practice-radio-indicator"></div>
                </div>
                <div class="practice-card-count">45 Questions</div>
                <div class="practice-card-duration">1 Hour 30 Minutes</div>
                <p class="practice-card-desc">Comprehensive mock marathon. Full test-centre stamina drill covering entire syllabus topics.</p>
              </div>
            </div>
          </div>

          <!-- Error Alert Banner (Hidden by default) -->
          <div id="practiceErrorBanner" style="display:none; background:#FFF4E5; border:1px solid #FFD0A8; border-radius:12px; padding:16px 20px; margin-bottom:24px; color:#663C00; font-size:14px; line-height:1.6;"></div>

          <!-- Action Row -->
          <div class="start-practice-action-box">
            <span style="font-size:13px; color:#7E7E78;">Session timer starts immediately on launch</span>
            <button class="start-practice-btn" id="startPracticeTestBtn">
              <span>Start Practice Test</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      `;

      // Select Card Interaction
      const cards = mount.querySelectorAll('.practice-size-card');
      cards.forEach(card => {
        card.addEventListener('click', () => {
          cards.forEach(c => {
            c.classList.remove('is-selected');
            c.setAttribute('aria-pressed', 'false');
          });
          card.classList.add('is-selected');
          card.setAttribute('aria-pressed', 'true');
          selectedQuestionCount = parseInt(card.dataset.count, 10);
        });

        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
          }
        });
      });

      const subjectDropdown = document.getElementById('practiceSubjectSelect');
      subjectDropdown.addEventListener('change', (e) => {
        selectedSubjectId = e.target.value;
      });

      // Launch Practice Test
      const startBtn = document.getElementById('startPracticeTestBtn');
      startBtn.addEventListener('click', () => {
        const errorBanner = document.getElementById('practiceErrorBanner');
        errorBanner.style.display = 'none';

        const testSession = store.generatePracticeTest(selectedQuestionCount, selectedSubjectId);

        if (testSession.error) {
          errorBanner.innerHTML = `<strong>Notice:</strong> ${testSession.message}`;
          errorBanner.style.display = 'block';
          errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          return;
        }

        launchLiveExamSession(testSession);
      });
    }

    /* ------------------------------------------------------------------------
       2.3 LAUNCH PAPER EXAM (PYQ)
       ------------------------------------------------------------------------ */
    function launchPaperExam(paperId) {
      const paper = store.getPaperById(paperId);
      if (!paper) {
        alert('Requested examination paper could not be found.');
        return;
      }

      const questions = store.getQuestionsForPaper(paperId);
      if (!questions.length) {
        alert('No questions registered for this paper yet.');
        return;
      }

      const examSession = {
        sessionId: 'pyq-' + paper.id + '-' + Date.now(),
        type: 'pyq',
        paperId: paper.id,
        title: paper.title,
        subtitle: `${paper.level} · Semester ${paper.semester} · ${paper.examType} (${paper.year})`,
        questionCount: questions.length,
        durationMinutes: paper.durationMinutes,
        durationSeconds: paper.durationMinutes * 60,
        startedAt: Date.now(),
        questions: questions
      };

      launchLiveExamSession(examSession);
    }

    /* ------------------------------------------------------------------------
       2.4 LIVE EXAMINATION RUNNER (Questions, Navigation, Palette, Timer)
       ------------------------------------------------------------------------ */
    function launchLiveExamSession(session) {
      activeExamSession = session;
      currentQuestionIndex = 0;
      userAnswers = {};
      timeRemainingSeconds = session.durationSeconds;
      totalExamDurationSeconds = session.durationSeconds;

      // Hide top navigation tabs during active exam for full focus
      const tabs = document.getElementById('engineModeTabsContainer');
      if (tabs) tabs.style.display = 'none';

      // Start countdown timer
      clearInterval(timerInterval);
      timerInterval = setInterval(handleTimerTick, 1000);

      // Render live exam canvas
      renderLiveExamCanvas();
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }

    function handleTimerTick() {
      if (timeRemainingSeconds <= 0) {
        clearInterval(timerInterval);
        handleTimerExpiredAutoSubmit();
        return;
      }

      timeRemainingSeconds--;
      updateTimerDisplay();
    }

    function formatTime(secs) {
      const h = Math.floor(secs / 3600);
      const m = Math.floor((secs % 3600) / 60);
      const s = Math.floor(secs % 60);

      const mStr = m < 10 ? '0' + m : m;
      const sStr = s < 10 ? '0' + s : s;

      if (h > 0) {
        const hStr = h < 10 ? '0' + h : h;
        return `${hStr}:${mStr}:${sStr}`;
      }
      return `${mStr}:${sStr}`;
    }

    function updateTimerDisplay() {
      const timerBadge = document.getElementById('liveExamTimer');
      if (!timerBadge) return;

      const timerText = document.getElementById('liveExamTimerText') || timerBadge;
      timerText.textContent = `${formatTime(timeRemainingSeconds)} remaining`;

      if (timeRemainingSeconds <= 60) {
        timerBadge.classList.add('is-urgent');
      } else {
        timerBadge.classList.remove('is-urgent');
      }
    }

    function renderLiveExamCanvas() {
      const mount = document.getElementById('engineViewMount');
      const session = activeExamSession;
      const totalQuestions = session.questions.length;
      const q = session.questions[currentQuestionIndex];
      const isFirst = currentQuestionIndex === 0;
      const isLast = currentQuestionIndex === totalQuestions - 1;

      mount.innerHTML = `
        <div class="exam-top-strip">
          <div class="exam-meta-block">
            <h2 class="exam-meta-title">${session.title}</h2>
            <span class="exam-meta-sub">${session.subtitle || 'Practice Assessment'} &bull; ${totalQuestions} Questions</span>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="exam-timer-badge" id="liveExamTimer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align: -2px; margin-right: 4px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span id="liveExamTimerText">${formatTime(timeRemainingSeconds)} remaining</span>
            </div>
            <button class="exam-nav-btn btn-secondary" id="exitExamBtn" style="height: 38px; font-size: 12px; padding: 0 14px;">
              Exit Exam
            </button>
          </div>
        </div>

        <div class="exam-canvas-container">
          <!-- Question Workspace -->
          <div>
            <div class="exam-question-card">
              <div class="question-card-eyebrow">
                <span class="question-counter-pill">Question ${currentQuestionIndex + 1} of ${totalQuestions}</span>
                <span class="question-topic-pill">${q.topic || q.subject} &bull; ${q.difficulty}</span>
              </div>

              <!-- Question Stem -->
              <div class="question-stem-text" id="questionStemText">
                ${formatQuestionText(q.question)}
              </div>

              <!-- 4 Options Stack -->
              <div class="options-stack" role="radiogroup" aria-labelledby="questionStemText">
                ${q.options.map((optText, optIdx) => {
                  const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                  const letter = String.fromCharCode(65 + optIdx);
                  return `
                    <button class="option-button-row ${isSelected ? 'is-selected' : ''}" 
                            data-opt-idx="${optIdx}" 
                            role="radio" 
                            aria-checked="${isSelected}">
                      <span class="option-letter-badge">${letter}</span>
                      <span class="option-text-span">${escapeHtml(optText)}</span>
                    </button>
                  `;
                }).join('')}
              </div>

              <!-- Navigation Controls -->
              <div class="exam-actions-bar">
                <button class="exam-nav-btn btn-secondary" id="prevQuestionBtn" ${isFirst ? 'disabled' : ''}>
                  &larr; Previous
                </button>

                <button class="exam-nav-btn btn-secondary" id="clearResponseBtn" style="font-size: 12px; color: #8E8E89;">
                  Clear Choice
                </button>

                ${isLast ? `
                  <button class="exam-nav-btn btn-submit-lime" id="openSubmitModalBtn">
                    <span>Submit Test</span>
                    <span>&check;</span>
                  </button>
                ` : `
                  <button class="exam-nav-btn btn-primary-dark" id="nextQuestionBtn">
                    <span>Next</span>
                    <span>&rarr;</span>
                  </button>
                `}
              </div>
            </div>
          </div>

          <!-- Question Palette Sidebar -->
          <div>
            <div class="exam-palette-sidebar">
              <div class="palette-heading">
                <span>Question Palette</span>
                <span style="font-size: 11px; color: #7E7E78;">${Object.keys(userAnswers).length}/${totalQuestions} Answered</span>
              </div>

              <div class="palette-grid">
                ${session.questions.map((_, pIdx) => {
                  const isCurrent = pIdx === currentQuestionIndex;
                  const isAnswered = userAnswers[pIdx] !== undefined;
                  let cls = 'palette-number-btn';
                  if (isCurrent) cls += ' is-current';
                  else if (isAnswered) cls += ' is-answered';
                  return `<button class="${cls}" data-goto-idx="${pIdx}">${pIdx + 1}</button>`;
                }).join('')}
              </div>

              <div class="palette-legend">
                <div class="legend-item"><span class="legend-dot current"></span> Current Question</div>
                <div class="legend-item"><span class="legend-dot answered"></span> Answered Question</div>
                <div class="legend-item"><span class="legend-dot unanswered"></span> Unanswered Question</div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Option Click Handler
      mount.querySelectorAll('.option-button-row').forEach(optBtn => {
        optBtn.addEventListener('click', () => {
          const optIdx = parseInt(optBtn.dataset.optIdx, 10);
          userAnswers[currentQuestionIndex] = optIdx;
          renderLiveExamCanvas();
        });
      });

      // Clear Choice
      document.getElementById('clearResponseBtn')?.addEventListener('click', () => {
        delete userAnswers[currentQuestionIndex];
        renderLiveExamCanvas();
      });

      // Prev / Next
      document.getElementById('prevQuestionBtn')?.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
          currentQuestionIndex--;
          renderLiveExamCanvas();
        }
      });

      document.getElementById('nextQuestionBtn')?.addEventListener('click', () => {
        if (currentQuestionIndex < totalQuestions - 1) {
          currentQuestionIndex++;
          renderLiveExamCanvas();
        }
      });

      // Palette direct jump
      mount.querySelectorAll('.palette-number-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetIdx = parseInt(btn.dataset.gotoIdx, 10);
          if (targetIdx >= 0 && targetIdx < totalQuestions) {
            currentQuestionIndex = targetIdx;
            renderLiveExamCanvas();
          }
        });
      });

      // Submit Button
      document.getElementById('openSubmitModalBtn')?.addEventListener('click', openSubmitConfirmDialog);

      // Exit Exam Button
      document.getElementById('exitExamBtn')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to exit? Your exam progress will not be saved.')) {
          clearInterval(timerInterval);
          activeExamSession = null;
          const tabs = document.getElementById('engineModeTabsContainer');
          if (tabs) tabs.style.display = 'flex';
          switchMode(activeMode);
        }
      });
    }

    /* ------------------------------------------------------------------------
       2.5 SUBMISSION CONFIRMATION & RESULT EVALUATION
       ------------------------------------------------------------------------ */
    function openSubmitConfirmDialog() {
      const dialog = document.getElementById('examConfirmDialog');
      const total = activeExamSession.questions.length;
      const answeredCount = Object.keys(userAnswers).length;
      const unansweredCount = total - answeredCount;

      dialog.innerHTML = `
        <div class="exam-dialog-box">
          <div class="dialog-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
          </div>
          <h3 class="dialog-title">Submit your test?</h3>
          <p style="font-size: 14.5px; color: #555550; margin: 0;">
            Review your submission status before finalizing. Unanswered questions will be marked as incorrect.
          </p>

          <div class="dialog-stats-summary">
            <div class="dialog-stat-col">
              <strong>${answeredCount}</strong>
              <span>Answered</span>
            </div>
            <div class="dialog-stat-col">
              <strong>${unansweredCount}</strong>
              <span>Unanswered</span>
            </div>
            <div class="dialog-stat-col">
              <strong>${total}</strong>
              <span>Total</span>
            </div>
          </div>

          <div class="dialog-actions-row">
            <button class="exam-nav-btn btn-secondary" id="dialogCancelBtn">
              Go Back
            </button>
            <button class="exam-nav-btn btn-submit-lime" id="dialogConfirmSubmitBtn">
              Confirm &amp; Submit Test
            </button>
          </div>
        </div>
      `;

      dialog.classList.add('is-active');

      document.getElementById('dialogCancelBtn')?.addEventListener('click', () => {
        dialog.classList.remove('is-active');
      });

      document.getElementById('dialogConfirmSubmitBtn')?.addEventListener('click', () => {
        dialog.classList.remove('is-active');
        finalizeTestSubmission();
      });
    }

    function handleTimerExpiredAutoSubmit() {
      alert("Time's up! Your examination timer has expired. Your answers will now be evaluated automatically.");
      finalizeTestSubmission();
    }

    function finalizeTestSubmission() {
      clearInterval(timerInterval);

      const timeElapsed = totalExamDurationSeconds - timeRemainingSeconds;
      const results = store.gradeSubmission(activeExamSession.questions, userAnswers, timeElapsed);

      // Render Result Screen
      renderResultScreen(results);
    }

    /* ------------------------------------------------------------------------
       2.6 RESULT & REVIEW ANSWERS SCREEN
       ------------------------------------------------------------------------ */
    function renderResultScreen(results) {
      const mount = document.getElementById('engineViewMount');
      const session = activeExamSession;

      // Evaluation tier badge
      let tierBadge = 'Needs Systematic Revision';
      let tierColor = '#D32F2F';
      if (results.percentage >= 80) {
        tierBadge = 'Outstanding Mastery (S Grade Potential)';
        tierColor = '#2E7D32';
      } else if (results.percentage >= 60) {
        tierBadge = 'Strong Conceptual Foundation (Cleared Threshold)';
        tierColor = '#1565C0';
      } else if (results.percentage >= 40) {
        tierBadge = 'Passing Benchmark (Revision Recommended)';
        tierColor = '#E65100';
      }

      mount.innerHTML = `
        <div class="exam-result-card">
          <span class="result-badge">${session.type === 'pyq' ? 'PYQ Examination Result' : 'Practice Test Result'}</span>
          <h2 style="font-family:'Newsreader', Georgia, serif; font-size: 26px; color: #131311; margin: 0 0 16px 0;">${session.title}</h2>

          <div class="result-score-headline">${results.score} / ${results.totalQuestions}</div>
          <div class="result-percentage-lead" style="color: ${tierColor};">${results.percentage}% Score &bull; ${tierBadge}</div>

          <div class="result-stat-grid">
            <div class="result-stat-box">
              <div class="result-stat-val" style="color: #2E7D32;">${results.correctCount}</div>
              <div class="result-stat-lbl">Correct</div>
            </div>
            <div class="result-stat-box">
              <div class="result-stat-val" style="color: #D32F2F;">${results.incorrectCount}</div>
              <div class="result-stat-lbl">Incorrect</div>
            </div>
            <div class="result-stat-box">
              <div class="result-stat-val" style="color: #7E7E78;">${results.unansweredCount}</div>
              <div class="result-stat-lbl">Unanswered</div>
            </div>
            <div class="result-stat-box">
              <div class="result-stat-val" style="color: #131311;">${formatTime(results.timeElapsedSeconds)}</div>
              <div class="result-stat-lbl">Time Elapsed</div>
            </div>
          </div>

          <div class="result-actions-strip">
            <button class="start-practice-btn" id="toggleReviewAnswersBtn" style="height: 48px; padding: 0 24px; font-size: 13px;">
              <span>Review Detailed Answers</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
            <button class="exam-nav-btn btn-secondary" id="retakeExamBtn" style="height: 48px; padding: 0 24px; font-size: 13px;">
              <span>Retake Test</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            </button>
            <button class="exam-nav-btn btn-secondary" id="backToHubBtn" style="height: 48px; padding: 0 24px; font-size: 13px;">
              <span>${session.type === 'pyq' ? 'Back to PYQ Library' : 'Back to Practice Builder'}</span>
              <span>&larr;</span>
            </button>
          </div>
        </div>

        <!-- Review Detailed Questions Mount -->
        <div id="detailedReviewMount" class="review-section-container" style="display: none;"></div>
      `;

      // Celebratory Confetti Burst
      if (typeof window.confetti === 'function') {
        const count = results.percentage >= 80 ? 120 : results.percentage >= 60 ? 80 : 40;
        window.confetti({
          particleCount: count,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // Toggle Review
      const reviewMount = document.getElementById('detailedReviewMount');
      document.getElementById('toggleReviewAnswersBtn')?.addEventListener('click', () => {
        if (reviewMount.style.display === 'none') {
          renderDetailedAnswersReview(results.breakdown, reviewMount);
          reviewMount.style.display = 'block';
          reviewMount.scrollIntoView({ behavior: 'smooth' });
        } else {
          reviewMount.style.display = 'none';
        }
      });

      // Retake Test
      document.getElementById('retakeExamBtn')?.addEventListener('click', () => {
        if (session.type === 'pyq') {
          launchPaperExam(session.paperId);
        } else {
          const freshTest = store.generatePracticeTest(session.questionCount, session.subjectId);
          launchLiveExamSession(freshTest);
        }
      });

      // Back to Hub
      document.getElementById('backToHubBtn')?.addEventListener('click', () => {
        activeExamSession = null;
        const tabs = document.getElementById('engineModeTabsContainer');
        if (tabs) tabs.style.display = 'flex';
        switchMode(activeMode);
      });

      window.scrollTo({ top: 100, behavior: 'smooth' });
    }

    function renderDetailedAnswersReview(breakdown, container) {
      container.innerHTML = `
        <div class="review-section-header">
          <h3 style="font-family:'Newsreader', Georgia, serif; font-size: 26px; color: #131311; margin: 0;">Comprehensive Answer Key &amp; Explanations</h3>
          <span style="font-size: 13px; color: #7E7E78;">${breakdown.length} Problems Reviewed</span>
        </div>

        ${breakdown.map((item, idx) => {
          let statusBadge = '';
          let borderCls = '';

          if (!item.isAnswered) {
            statusBadge = '<span class="review-badge-status unanswered">&empty; Unanswered</span>';
            borderCls = 'is-unanswered';
          } else if (item.isCorrect) {
            statusBadge = '<span class="review-badge-status correct">&check; Correct</span>';
            borderCls = 'is-correct';
          } else {
            statusBadge = '<span class="review-badge-status incorrect">&cross; Incorrect</span>';
            borderCls = 'is-incorrect';
          }

          return `
            <div class="review-item-card ${borderCls}">
              <div class="review-item-header">
                <span class="question-counter-pill">Question ${idx + 1}</span>
                ${statusBadge}
              </div>

              <div class="review-stem">
                ${formatQuestionText(item.questionText)}
              </div>

              <div class="review-options-list">
                ${item.options.map((optText, oIdx) => {
                  const letter = String.fromCharCode(65 + oIdx);
                  const isCorrect = oIdx === item.correctAnswerIndex;
                  const isUserSelected = oIdx === item.userAnswerIndex;

                  let optCls = 'review-opt-box';
                  let tag = '';

                  if (isCorrect) {
                    optCls += ' is-correct-ans';
                    tag = '<span>&check; Correct Answer</span>';
                  } else if (isUserSelected && !isCorrect) {
                    optCls += ' is-user-wrong';
                    tag = '<span>&cross; Your Selection</span>';
                  }

                  return `
                    <div class="${optCls}">
                      <span><strong>${letter}.</strong> ${escapeHtml(optText)}</span>
                      ${tag}
                    </div>
                  `;
                }).join('')}
              </div>

              <div class="review-explanation-box">
                <strong>Explanation &amp; First-Principles Derivation:</strong>
                <div style="margin-top: 6px; line-height: 1.6;">${formatQuestionText(item.explanation || 'No derivation provided.')}</div>
              </div>
            </div>
          `;
        }).join('')}
      `;
    }

    /* ------------------------------------------------------------------------
       Utilities: Code formatting & HTML escaping
       ------------------------------------------------------------------------ */
    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function formatQuestionText(text) {
      if (!text) return '';
      const codeBlocks = [];

      // Extract triple-backtick fenced blocks first so linebreaks aren't converted to <br>
      const processed = String(text).replace(/```(?:[a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g, function(_, code) {
        const token = `###CODEBLOCK_${codeBlocks.length}###`;
        codeBlocks.push(`<pre><code>${escapeHtml(code.trim())}</code></pre>`);
        return token;
      });

      // Escape non-code text
      let escaped = escapeHtml(processed);

      // Support inline code `foo`
      escaped = escaped.replace(/`([^`]+)`/g, function(_, inline) {
        return `<code>${inline}</code>`;
      });

      // Convert line breaks to <br>
      let withBreaks = escaped.replace(/\n/g, '<br>');

      // Restore preformatted code blocks
      codeBlocks.forEach((blockHtml, i) => {
        withBreaks = withBreaks.replace(`###CODEBLOCK_${i}###`, blockHtml);
      });

      return withBreaks;
    }
  }

})();
