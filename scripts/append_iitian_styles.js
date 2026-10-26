const fs = require('fs');
const path = require('path');

const cssToAppend = `
/* ==========================================================================
   IITIAN TATTVA — GLOBAL DESIGN SYSTEM & PAGE STYLES
   Visual Language: Reference ProjectOne (White, Black, Lime #C6FD50)
   ========================================================================== */

/* 1. BRAND LOGO WORDMARK */
.brand-logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  height: 40px;
  gap: 3px;
  transition: transform 0.2s var(--ease-smooth);
}

.brand-logo:hover {
  transform: scale(1.02);
}

.logo-iitian {
  font-size: 26px;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: var(--color-black);
  line-height: 1;
}

.logo-tattva-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-black);
  color: var(--color-text-white);
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
  padding: 4px 8px 5px;
  border-radius: 8px;
  margin-left: 2px;
}

.hero-topbar.nav-on-dark .logo-iitian {
  color: #FFFFFF;
}

.hero-topbar.nav-on-dark .logo-tattva-badge {
  background-color: var(--color-lime);
  color: var(--color-black);
}

/* 2. GLOBAL NAVIGATION & RESOURCES DROPDOWN */
.nav-item-dropdown {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 100%;
}

.nav-item-has-dropdown {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.dropdown-caret-svg {
  transition: transform 0.22s ease;
}

.nav-item-dropdown:hover .dropdown-caret-svg,
.nav-item-dropdown.active-open .dropdown-caret-svg {
  transform: rotate(180deg);
}

.nav-dropdown-menu {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  width: 260px;
  background-color: #131311;
  border: 1.5px solid rgba(255, 255, 255, 0.14);
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
  transition: opacity 0.2s var(--ease-spring), transform 0.2s var(--ease-spring), visibility 0.2s;
  z-index: 1000;
}

.nav-item-dropdown:hover .nav-dropdown-menu,
.nav-item-dropdown.active-open .nav-dropdown-menu {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}

.nav-dropdown-item {
  display: flex;
  flex-direction: column;
  padding: 10px 14px;
  border-radius: 10px;
  text-decoration: none;
  color: #FAFAFA;
  transition: background-color 0.18s ease, color 0.18s ease;
}

.nav-dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color-lime);
}

.dropdown-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dropdown-item-title {
  font-size: 13.5px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.dropdown-item-arrow {
  color: var(--color-lime);
  font-size: 13px;
  transition: transform 0.2s ease;
}

.nav-dropdown-item:hover .dropdown-item-arrow {
  transform: translateX(3px);
}

.dropdown-item-desc {
  font-size: 11.5px;
  color: #A0A09D;
  margin-top: 3px;
  line-height: 1.3;
}

/* Active Navigation Indicators */
.nav-item.active {
  color: var(--color-lime);
  position: relative;
}

.nav-item.active::after {
  content: '';
  display: inline-block;
  width: 5px;
  height: 5px;
  background-color: var(--color-lime);
  border-radius: 50%;
  margin-left: 5px;
  vertical-align: middle;
}

.nav-dropdown-item.active {
  background-color: rgba(198, 253, 80, 0.12);
  color: var(--color-lime);
}

/* 3. MOBILE NAVIGATION TOGGLE & DRAWER */
.mobile-menu-toggle {
  display: none;
  background: var(--color-black);
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hamburger-bar {
  width: 20px;
  height: 2px;
  background-color: #FAFAFA;
  border-radius: 2px;
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.mobile-menu-toggle.is-active .hamburger-bar:nth-child(1) {
  transform: translateY(3.5px) rotate(45deg);
}

.mobile-menu-toggle.is-active .hamburger-bar:nth-child(2) {
  transform: translateY(-3.5px) rotate(-45deg);
}

.mobile-nav-drawer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(19, 19, 17, 0.96);
  backdrop-filter: blur(12px);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 30px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.25s ease, visibility 0.25s ease;
}

.mobile-nav-drawer.open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.mobile-nav-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  list-style: none;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

.mobile-nav-link {
  color: #FAFAFA;
  text-decoration: none;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: color 0.2s ease;
}

.mobile-nav-link:hover,
.mobile-nav-link.active {
  color: var(--color-lime);
}

.mobile-sub-menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 20px;
  margin-top: 10px;
  border-left: 2px solid rgba(255, 255, 255, 0.15);
}

.mobile-sub-link {
  color: #B5B5B0;
  text-decoration: none;
  font-size: 17px;
  font-weight: 600;
  transition: color 0.2s ease;
}

.mobile-sub-link:hover,
.mobile-sub-link.active {
  color: var(--color-lime);
}

.mobile-nav-cta {
  margin-top: 28px;
  width: 100%;
  display: flex;
  justify-content: center;
}

/* 4. HERO VIDEO COMPONENT */
.hero-video-wrapper {
  position: relative;
  width: 100%;
  max-width: 960px;
  margin: 44px auto 0;
  border-radius: 20px;
  border: 2px solid var(--color-black);
  background: #131311;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.12), 0 4px 14px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  z-index: 10;
}

.video-chrome-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 18px;
  background-color: #1A1A18;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.video-chrome-dots {
  display: flex;
  gap: 6px;
}

.chrome-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
}

.chrome-dot.red { background-color: #FF5F56; }
.chrome-dot.yellow { background-color: #FFBD2E; }
.chrome-dot.green { background-color: #27C93F; }

.video-chrome-title {
  color: #D6D6D2;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.video-chrome-badge {
  background-color: var(--color-lime);
  color: var(--color-black);
  font-size: 11px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 5px;
  letter-spacing: 0.04em;
}

.video-player-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #0A0A09;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease, filter 0.3s ease;
}

.video-player-container.is-playing .video-poster-img {
  filter: brightness(0.9);
}

.video-play-overlay-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--color-lime);
  border: 2px solid var(--color-black);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
  transition: transform 0.22s var(--ease-spring), box-shadow 0.22s var(--ease-spring), background-color 0.2s;
  z-index: 5;
}

.video-play-overlay-btn:hover {
  transform: translate(-50%, -50%) scale(1.08);
  box-shadow: 0 16px 42px rgba(198, 253, 80, 0.4);
}

.video-play-triangle {
  width: 0;
  height: 0;
  border-top: 14px solid transparent;
  border-bottom: 14px solid transparent;
  border-left: 22px solid var(--color-black);
  margin-left: 5px;
}

.video-pause-bars {
  display: none;
  gap: 5px;
}

.video-pause-bar {
  width: 5px;
  height: 20px;
  background-color: var(--color-black);
  border-radius: 2px;
}

.video-player-container.is-playing .video-play-triangle {
  display: none;
}

.video-player-container.is-playing .video-pause-bars {
  display: flex;
}

.video-bottom-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.88), transparent);
  padding: 22px 20px 14px;
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 6;
}

.video-ctrl-btn {
  background: none;
  border: none;
  color: #FAFAFA;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: color 0.18s ease;
}

.video-ctrl-btn:hover {
  color: var(--color-lime);
}

.video-time-display {
  color: #E2E2DF;
  font-size: 12.5px;
  font-weight: 600;
  font-family: monospace;
  white-space: nowrap;
}

.video-scrubber-track {
  flex: 1;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.25);
  border-radius: 9999px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.video-scrubber-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 32%;
  background-color: var(--color-lime);
  border-radius: 9999px;
  transition: width 0.1s linear;
}

.video-simulated-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-player-container.is-playing .video-simulated-canvas {
  opacity: 1;
}

/* 5. PAGE CONTAINERS & HERO HEADERS */
.page-container {
  min-height: 100vh;
  padding-top: 104px;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
}

.page-hero-header {
  text-align: center;
  max-width: 860px;
  margin: 0 auto;
  padding: 56px 24px 44px;
  position: relative;
  z-index: 2;
}

.page-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: var(--color-black);
  color: var(--color-text-white);
  padding: 6px 16px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 22px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.page-eyebrow .eyebrow-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-lime);
}

.page-title {
  font-size: clamp(48px, 5.5vw, 84px);
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.045em;
  color: var(--color-black);
  margin-bottom: 22px;
}

.page-subtitle {
  font-size: clamp(16.5px, 1.25vw, 19.5px);
  font-weight: 500;
  color: var(--color-text-muted);
  line-height: 1.45;
  max-width: 660px;
  margin: 0 auto;
}

.content-section-wrap {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px 80px;
  position: relative;
  z-index: 2;
}

/* 6. RESOURCES PAGE — EXACTLY TWO CARDS (QUIZ & ROADMAP) */
.resources-two-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 36px;
  margin-top: 16px;
}

.resource-feature-card {
  background-color: #FFFFFF;
  border: 2px solid var(--color-black);
  border-radius: 22px;
  padding: 32px;
  box-shadow: 4px 6px 0 var(--color-black), 0 20px 40px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.24s var(--ease-spring), box-shadow 0.24s var(--ease-spring);
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  position: relative;
}

.resource-feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 6px 9px 0 var(--color-black), 0 26px 50px rgba(0, 0, 0, 0.08);
}

.resource-card-badge {
  display: inline-flex;
  align-items: center;
  background-color: var(--color-black);
  color: var(--color-lime);
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 9999px;
  margin-bottom: 20px;
  align-self: flex-start;
}

.resource-card-title {
  font-size: clamp(32px, 3.2vw, 44px);
  font-weight: 900;
  letter-spacing: -0.035em;
  color: var(--color-black);
  margin-bottom: 14px;
  line-height: 1.05;
}

.resource-card-desc {
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-text-secondary);
  margin-bottom: 24px;
}

.resource-card-img-frame {
  width: 100%;
  aspect-ratio: 16 / 11;
  border-radius: 14px;
  border: 1.6px solid var(--color-black);
  overflow: hidden;
  background-color: #F0F0EE;
  margin-bottom: 26px;
}

.resource-card-img-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;
}

.resource-feature-card:hover .resource-card-img-frame img {
  transform: scale(1.03);
}

.resource-tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.resource-tag {
  background-color: #F4F4F2;
  border: 1px solid #E2E2DF;
  color: var(--color-black);
  font-size: 12.5px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
}

.resource-card-cta {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-lime);
  color: var(--color-black);
  border: 1.6px solid var(--color-black);
  border-radius: 12px;
  height: 52px;
  padding: 0 8px 0 22px;
  box-shadow: 0 3px 0 var(--color-black);
  font-size: 14.5px;
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  gap: 16px;
  margin-top: auto;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.resource-card-cta .cta-arrow-box {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: var(--color-black);
  display: flex;
  align-items: center;
  justify-content: center;
}

.resource-feature-card:hover .resource-card-cta {
  background-color: #B4FA32;
}

/* 7. QUIZ PAGE STYLES */
.quiz-topic-filters {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 40px;
}

.quiz-filter-btn {
  background-color: #FFFFFF;
  border: 1.5px solid var(--color-black);
  border-radius: 9999px;
  padding: 8px 20px;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--color-black);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, transform 0.2s;
}

.quiz-filter-btn:hover {
  background-color: #F2F2F0;
  transform: translateY(-1px);
}

.quiz-filter-btn.active {
  background-color: var(--color-black);
  color: var(--color-lime);
}

.quiz-modules-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 60px;
}

.quiz-module-card {
  background-color: #FFFFFF;
  border: 1.8px solid var(--color-black);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 3px 4px 0 var(--color-black);
  display: flex;
  flex-direction: column;
}

.module-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.module-subject-badge {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 4px;
  background-color: var(--color-black);
  color: var(--color-lime);
}

.module-status-badge {
  font-size: 11px;
  font-weight: 700;
  color: #666;
}

.module-title {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.module-desc {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.45;
  margin-bottom: 18px;
  flex-grow: 1;
}

.module-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid #ECECE8;
  font-size: 12px;
  font-weight: 600;
  color: #555;
}

/* Interactive Diagnostic Question Sandbox */
.interactive-quiz-sandbox {
  background-color: #FFFFFF;
  border: 2px solid var(--color-black);
  border-radius: 22px;
  padding: 36px;
  box-shadow: 4px 6px 0 var(--color-black), 0 20px 40px rgba(0, 0, 0, 0.06);
  margin-bottom: 60px;
}

.sandbox-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1.5px solid #EBEBE7;
}

.sandbox-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: var(--color-lime);
  color: var(--color-black);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 6px;
  border: 1.2px solid var(--color-black);
}

.sandbox-timer {
  font-family: monospace;
  font-size: 14px;
  font-weight: 700;
  background-color: #131311;
  color: var(--color-lime);
  padding: 4px 10px;
  border-radius: 6px;
}

.question-stem {
  font-size: 19px;
  font-weight: 700;
  line-height: 1.45;
  margin-bottom: 24px;
  color: var(--color-black);
}

.question-options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.quiz-option-btn {
  background-color: #FAFAFA;
  border: 1.5px solid #D5D5D0;
  border-radius: 12px;
  padding: 14px 18px;
  text-align: left;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
}

.quiz-option-btn:hover {
  border-color: var(--color-black);
  background-color: #F2F2EF;
}

.quiz-option-btn.selected {
  background-color: rgba(198, 253, 80, 0.2);
  border-color: var(--color-black);
  box-shadow: 2px 2px 0 var(--color-black);
}

.quiz-option-btn.correct {
  background-color: var(--color-lime);
  border-color: var(--color-black);
  box-shadow: 2px 2px 0 var(--color-black);
}

.quiz-sandbox-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid #EBEBE7;
}

.explanation-drawer {
  background-color: #F8F9F5;
  border: 1.5px solid #131311;
  border-radius: 12px;
  padding: 18px 22px;
  margin-top: 20px;
  display: none;
}

.explanation-drawer.visible {
  display: block;
  animation: fadeIn 0.3s ease;
}

/* 8. ROADMAP PAGE STYLES */
.roadmap-phase-tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 44px;
}

.roadmap-phase-tab {
  background-color: #FFFFFF;
  border: 1.8px solid var(--color-black);
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 800;
  color: var(--color-black);
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--color-black);
  transition: all 0.2s ease;
}

.roadmap-phase-tab:hover {
  transform: translateY(-2px);
  box-shadow: 3px 3px 0 var(--color-black);
}

.roadmap-phase-tab.active {
  background-color: var(--color-lime);
  box-shadow: 3px 3px 0 var(--color-black);
}

.roadmap-timeline-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
  margin-bottom: 60px;
}

.phase-content-card {
  background-color: #FFFFFF;
  border: 2px solid var(--color-black);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 3px 5px 0 var(--color-black);
}

.phase-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.phase-number-tag {
  background-color: var(--color-black);
  color: var(--color-lime);
  font-size: 12px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 6px;
  text-transform: uppercase;
}

.phase-card-title {
  font-size: 24px;
  font-weight: 900;
  letter-spacing: -0.03em;
  margin-bottom: 12px;
}

.phase-card-desc {
  font-size: 15px;
  line-height: 1.5;
  color: var(--color-text-secondary);
  margin-bottom: 22px;
}

.milestones-checklist {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.milestone-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14.5px;
  line-height: 1.4;
  color: var(--color-black);
}

.milestone-bullet {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  background-color: var(--color-lime);
  border: 1.2px solid var(--color-black);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 900;
  flex-shrink: 0;
  margin-top: 2px;
}

/* 9. BLOG PAGE STYLES */
.blog-articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  margin-bottom: 60px;
}

.blog-article-card {
  background-color: #FFFFFF;
  border: 1.8px solid var(--color-black);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 3px 4.5px 0 var(--color-black);
  display: flex;
  flex-direction: column;
  transition: transform 0.22s var(--ease-spring), box-shadow 0.22s;
  text-decoration: none;
  color: inherit;
}

.blog-article-card:hover {
  transform: translateY(-3px);
  box-shadow: 5px 7px 0 var(--color-black);
}

.blog-card-media {
  width: 100%;
  aspect-ratio: 16 / 10;
  background-color: #131311;
  position: relative;
  overflow: hidden;
}

.blog-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.blog-article-card:hover .blog-card-media img {
  transform: scale(1.04);
}

.blog-card-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.blog-meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.blog-category-tag {
  background-color: var(--color-black);
  color: var(--color-lime);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 4px;
}

.blog-read-time {
  font-size: 12px;
  color: #777;
  font-weight: 500;
}

.blog-title {
  font-size: 20px;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.02em;
  margin-bottom: 10px;
  color: var(--color-black);
}

.blog-excerpt {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.45;
  margin-bottom: 20px;
  flex-grow: 1;
}

.blog-author-line {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid #EEEEEC;
  font-size: 12.5px;
  font-weight: 600;
  color: #444;
}

/* 10. ABOUT PAGE STYLES */
.about-statement-card {
  background-color: #FFFFFF;
  border: 2px solid var(--color-black);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 4px 6px 0 var(--color-black);
  margin-bottom: 60px;
}

.about-headline-quote {
  font-size: clamp(26px, 2.8vw, 38px);
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: -0.03em;
  color: var(--color-black);
  margin-bottom: 24px;
}

.about-body-text {
  font-size: 17px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  max-width: 860px;
}

.pillars-three-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  margin-bottom: 60px;
}

.pillar-box {
  background-color: #FFFFFF;
  border: 1.8px solid var(--color-black);
  border-radius: 18px;
  padding: 30px;
  box-shadow: 3px 4px 0 var(--color-black);
}

.pillar-num {
  font-size: 32px;
  font-weight: 900;
  color: var(--color-lime);
  background-color: var(--color-black);
  display: inline-flex;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}

.pillar-title {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 10px;
  letter-spacing: -0.02em;
}

.pillar-desc {
  font-size: 14.5px;
  line-height: 1.5;
  color: var(--color-text-muted);
}

/* 11. CONTACT PAGE STYLES */
.contact-layout-split {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 48px;
  align-items: flex-start;
  margin-bottom: 60px;
}

.contact-info-panel {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.contact-callout-card {
  background-color: #FFFFFF;
  border: 2px solid var(--color-black);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 3px 5px 0 var(--color-black);
}

.contact-form-card {
  background-color: #FFFFFF;
  border: 2px solid var(--color-black);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 4px 6px 0 var(--color-black), 0 20px 40px rgba(0, 0, 0, 0.05);
}

.form-group-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 22px;
}

.form-label {
  font-size: 13.5px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-black);
}

.form-control-input,
.form-control-textarea,
.form-control-select {
  width: 100%;
  background-color: #FAFAF9;
  border: 1.8px solid var(--color-black);
  border-radius: 12px;
  padding: 14px 16px;
  font-family: inherit;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-black);
  transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.form-control-input:focus,
.form-control-textarea:focus,
.form-control-select:focus {
  background-color: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(198, 253, 80, 0.4);
}

.form-control-textarea {
  min-height: 130px;
  resize: vertical;
}

.form-validation-error {
  font-size: 12.5px;
  color: #D32F2F;
  font-weight: 600;
  display: none;
}

.form-validation-error.show {
  display: block;
}

.form-submit-btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-lime);
  color: var(--color-black);
  border: 2px solid var(--color-black);
  border-radius: 13px;
  height: 56px;
  padding: 0 10px 0 24px;
  box-shadow: 0 4px 0 var(--color-black);
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.2s var(--ease-spring), box-shadow 0.2s;
}

.form-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 var(--color-black);
}

.form-submit-btn:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 var(--color-black);
}

.submission-status-banner {
  padding: 16px 20px;
  border-radius: 12px;
  margin-top: 20px;
  border: 1.5px solid var(--color-black);
  display: none;
  font-size: 14px;
  line-height: 1.45;
  font-weight: 600;
}

.submission-status-banner.success {
  display: block;
  background-color: #E8FBD5;
  color: #1A3E08;
  border-color: #4CAF50;
}

.submission-status-banner.error {
  display: block;
  background-color: #FFEAEA;
  color: #931313;
  border-color: #D32F2F;
}

/* 12. GLOBAL FOOTER */
.tattva-global-footer {
  background-color: #131311;
  color: #FAFAFA;
  padding: 70px 24px 36px;
  border-top: 2px solid #000000;
  margin-top: auto;
}

.footer-inner-wrap {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.footer-top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 36px;
}

.footer-brand-side {
  max-width: 380px;
}

.footer-brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  text-decoration: none;
  margin-bottom: 16px;
}

.footer-brand-logo .logo-iitian {
  color: #FFFFFF;
}

.footer-brand-desc {
  font-size: 14px;
  line-height: 1.55;
  color: #9C9C98;
}

.footer-nav-groups {
  display: flex;
  gap: 60px;
  flex-wrap: wrap;
}

.footer-nav-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-col-heading {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-lime);
}

.footer-link {
  color: #CBCBC8;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: color 0.18s ease;
}

.footer-link:hover {
  color: var(--color-lime);
}

.footer-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 13px;
  color: #7A7A76;
  flex-wrap: wrap;
  gap: 16px;
}

/* 13. RESPONSIVE BREAKPOINTS */
@media (max-width: 1024px) {
  .resources-two-cards-grid {
    gap: 24px;
  }
  
  .quiz-modules-grid,
  .pillars-three-grid,
  .blog-articles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .contact-layout-split {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}

@media (max-width: 768px) {
  .hero-topbar {
    padding: 18px 20px 0;
  }

  .nav-pill {
    display: none; /* Replaced by mobile menu toggle */
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .page-container {
    padding-top: 86px;
  }

  .page-hero-header {
    padding: 36px 16px 28px;
  }

  .resources-two-cards-grid,
  .roadmap-timeline-grid,
  .quiz-modules-grid,
  .pillars-three-grid,
  .blog-articles-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .interactive-quiz-sandbox,
  .about-statement-card,
  .contact-form-card,
  .resource-feature-card {
    padding: 24px 18px;
  }

  .hero-video-wrapper {
    margin-top: 28px;
    border-radius: 16px;
  }
}
`;

const styleCssPath = path.join(__dirname, '../style.css');
fs.appendFileSync(styleCssPath, cssToAppend, 'utf-8');
console.log('Appended IITian Tattva styles to style.css successfully!');
