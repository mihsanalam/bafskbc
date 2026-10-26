const fs = require('fs');

const newStyles = `
/* ==========================================================================
   REMAINING 7 SECTIONS STYLING
   ========================================================================== */

/* --------------------------------------------------------------------------
   SECTION 1: YELLOW TESTIMONIAL / CUSTOMER SOCIAL PROOF
   -------------------------------------------------------------------------- */
.section-testimonials-yellow {
  position: relative;
  background-color: #EEE642;
  color: #0C0C0C;
  overflow: hidden;
  padding: 120px 24px;
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.testimonials-bg-rails {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 4vw;
  pointer-events: none;
  user-select: none;
  overflow: hidden;
  z-index: 1;
}

.testimonials-rail {
  writing-mode: vertical-lr;
  font-family: var(--font-primary);
  font-size: clamp(90px, 9vw, 150px);
  font-weight: 900;
  letter-spacing: -0.04em;
  color: rgba(12, 12, 12, 0.05);
  white-space: nowrap;
  line-height: 1;
}

.testimonials-rail.is-flipped {
  transform: rotate(180deg);
}

.testimonials-inner-content {
  position: relative;
  z-index: 2;
  max-width: 820px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
}

.testimonials-heading {
  font-family: var(--font-primary);
  font-size: clamp(34px, 4.4vw, 56px);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.03em;
  color: #0C0C0C;
  margin: 0 0 44px 0;
}

.testimonials-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 38px;
}

.testimonial-dot {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: transparent;
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  opacity: 0.35;
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.testimonial-dot:hover {
  opacity: 0.8;
  transform: scale(1.08);
}

.testimonial-dot.is-active {
  opacity: 1;
  transform: scale(1.22);
  border-color: #0C0C0C;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}

.dot-avatar-frame {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  display: block;
}

.dot-avatar-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.testimonial-display-box {
  min-height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.testimonial-quote {
  font-family: var(--font-primary);
  font-size: clamp(20px, 2.2vw, 30px);
  font-weight: 600;
  line-height: 1.38;
  letter-spacing: -0.02em;
  color: #0C0C0C;
  max-width: 660px;
  margin: 0 auto 28px;
  font-style: normal;
}

.testimonial-author-meta {
  margin-bottom: 32px;
}

.testimonial-author-name {
  font-family: var(--font-primary);
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #0C0C0C;
  margin-bottom: 4px;
}

.testimonial-author-sub {
  font-size: 14px;
  font-weight: 500;
  color: rgba(12, 12, 12, 0.8);
  line-height: 1.4;
}

.btn-black-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: #0C0C0C;
  color: #FFFFFF;
  padding: 13px 26px;
  border-radius: 9999px;
  font-family: var(--font-primary);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.16);
  transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.2s ease, box-shadow 0.2s ease;
}

.btn-black-pill:hover {
  transform: translateY(-2px);
  background-color: #1a1a1a;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.24);
}

.btn-arrow-svg {
  width: 16px;
  height: 16px;
  display: block;
  transition: transform 0.2s ease;
}

.btn-black-pill:hover .btn-arrow-svg {
  transform: translateX(3px);
}

/* --------------------------------------------------------------------------
   SECTION 2: PURPLE SOCIAL NETWORK FEATURE SECTION
   -------------------------------------------------------------------------- */
.section-social-purple {
  position: relative;
  background-color: #6D42ED;
  color: #FFFFFF;
  overflow: hidden;
  padding: 130px 24px 0 24px;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.social-content-container {
  position: relative;
  z-index: 2;
  max-width: 650px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
}

.social-headline {
  font-family: var(--font-primary);
  font-size: clamp(42px, 5.2vw, 68px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #FFFFFF;
  margin: 0 0 24px 0;
}

.social-headline .highlight-yellow {
  color: #EEE642;
  font-style: italic;
}

.social-description {
  font-family: var(--font-primary);
  font-size: clamp(16px, 1.8vw, 19px);
  font-weight: 500;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.95);
  max-width: 530px;
  margin: 0 auto 16px;
}

.social-tagline-bold {
  font-family: var(--font-primary);
  font-size: clamp(17px, 1.9vw, 21px);
  font-weight: 800;
  color: #FFFFFF;
  margin: 0 0 36px 0;
}

.btn-yellow-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: #EEE642;
  color: #0C0C0C;
  padding: 14px 28px;
  border-radius: 9999px;
  font-family: var(--font-primary);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease;
}

.btn-yellow-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.btn-yellow-pill:hover .btn-arrow-svg {
  transform: translateX(3px);
}

.social-oversized-letters {
  position: relative;
  font-family: var(--font-primary);
  font-size: clamp(110px, 25vw, 360px);
  font-weight: 900;
  letter-spacing: -0.04em;
  color: rgba(255, 255, 255, 0.12);
  line-height: 0.72;
  margin-top: 40px;
  margin-bottom: -15px;
  user-select: none;
  pointer-events: none;
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  z-index: 1;
}

/* --------------------------------------------------------------------------
   SECTION 3: BLACK DIRECTORY FEATURE SECTION
   -------------------------------------------------------------------------- */
.section-directory-black {
  background-color: #0C0C0C;
  color: #FFFFFF;
  padding: 150px 48px;
  overflow: hidden;
}

.directory-container {
  max-width: 1360px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 80px;
  align-items: center;
}

.directory-title {
  font-family: var(--font-primary);
  font-size: clamp(44px, 5.2vw, 68px);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #FFFFFF;
  margin: 0 0 28px 0;
}

.directory-description {
  font-size: clamp(16px, 1.6vw, 19px);
  font-weight: 400;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.82);
  max-width: 440px;
  margin: 0;
}

.directory-cards-col {
  position: relative;
  min-height: 480px;
}

.directory-card-stack {
  position: relative;
  width: 100%;
  height: 480px;
}

.dir-stack-card {
  position: absolute;
  background-color: #171717;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7);
  padding: 18px 24px;
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease;
  width: 380px;
}

.dir-stack-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.9);
  z-index: 10 !important;
}

.dir-card-leo {
  top: 0;
  left: 170px;
  z-index: 1;
}

.dir-card-marti {
  top: 90px;
  left: 110px;
  z-index: 2;
}

.dir-card-julien {
  top: 180px;
  left: 55px;
  z-index: 3;
}

.dir-card-ps {
  top: 270px;
  left: 0;
  width: 440px;
  z-index: 4;
}

.dir-card-user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dir-user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.dir-user-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.dir-name-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dir-user-fullname {
  font-family: var(--font-primary);
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
}

.badge-okay {
  background-color: #EEE642;
  color: #0C0C0C;
  font-size: 10px;
  font-weight: 900;
  padding: 2px 7px;
  border-radius: 4px;
  letter-spacing: 0.04em;
}

.badge-pro {
  background-color: #6D42ED;
  color: #FFFFFF;
  font-size: 10px;
  font-weight: 900;
  padding: 2px 7px;
  border-radius: 4px;
  letter-spacing: 0.04em;
}

.dir-user-handle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.dir-user-title {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

.dir-user-location {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
}

.icon-loc {
  width: 14px;
  height: 14px;
  display: inline-block;
}

.dir-ps-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.dir-project-thumb-frame {
  width: 105px;
  height: 68px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.dir-project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* --------------------------------------------------------------------------
   SECTION 4: NYC PATH COMPARISON SECTION WITH THE MALA
   -------------------------------------------------------------------------- */
.section-nyc-comparison {
  background-color: #FFFFFF;
  color: #0C0C0C;
  padding: 130px 32px 160px;
  position: relative;
  overflow: hidden;
}

.nyc-inner-container {
  max-width: 1200px;
  margin: 0 auto;
}

.nyc-header-block {
  text-align: center;
  margin-bottom: 70px;
}

.nyc-top-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #FFDC00;
  color: #0C0C0C;
  padding: 6px 14px;
  border-radius: 6px;
  font-family: var(--font-primary);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 22px;
}

.badge-sparkle-svg {
  width: 14px;
  height: 14px;
  fill: #0C0C0C;
}

.nyc-main-headline {
  font-family: var(--font-primary);
  font-size: clamp(38px, 4.8vw, 64px);
  font-weight: 900;
  font-style: italic;
  text-transform: uppercase;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: #0C0C0C;
  margin: 0 0 18px 0;
}

.nyc-main-headline .highlight-momentum {
  color: #0047FF;
}

.nyc-subtitle-text {
  font-size: clamp(15px, 1.5vw, 17px);
  font-weight: 500;
  color: #333333;
  margin: 0;
}

.badge-text-yellow {
  background-color: #FFDC00;
  color: #0C0C0C;
  padding: 2px 7px;
  border-radius: 4px;
  font-weight: 700;
}

.nyc-comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: stretch;
}

.comparison-card-wrapper {
  position: relative;
  display: flex;
}

.path-card {
  width: 100%;
  border-radius: 18px;
  padding: 38px 42px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.traditional-path-card {
  background-color: #FAFAFA;
  border: 1.5px solid #E5E5E5;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}

.path-banner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 18px;
}

.path-banner-img {
  max-width: 100%;
  height: auto;
  max-height: 52px;
  object-fit: contain;
}

.path-card-subtitle {
  font-size: 15px;
  font-weight: 500;
  color: #555555;
  text-align: center;
  margin: 0 0 32px 0;
}

.path-items-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.path-items-list li {
  display: flex;
  align-items: center;
  font-size: clamp(16px, 1.6vw, 19px);
  font-weight: 500;
  color: #111111;
}

.path-icon {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 16px;
  font-weight: 800;
}

.path-icon-cross {
  background-color: #D1D5DB;
  color: #4B5563;
  font-size: 12px;
}

/* Suspended Mala Garland Overlay */
.mala-garland-draped {
  position: absolute;
  top: -38px;
  left: -32px;
  right: -32px;
  bottom: -68px;
  width: calc(100% + 64px);
  height: calc(100% + 106px);
  pointer-events: none;
  z-index: 10;
  object-fit: fill;
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.12));
}

.nyc-modern-card {
  background-color: #F4FAF5;
  border: 1.5px solid #C8E8D0;
  box-shadow: 0 10px 30px rgba(34, 197, 94, 0.08);
}

.path-icon-check {
  background-color: #DCFCE7;
  color: #16A34A;
  font-size: 14px;
}

/* --------------------------------------------------------------------------
   SECTION 5: BRIGHT LIME FAQ SECTION
   -------------------------------------------------------------------------- */
.section-faqs-wrap {
  background-color: #1C1D1A;
  color: #131311;
  padding: 100px 32px 60px;
}

.faqs-panel-container {
  max-width: 1360px;
  margin: 0 auto;
}

.faqs-lime-panel {
  background-color: #C6FD50;
  border-radius: 28px;
  border: 2px solid #131311;
  box-shadow: 0 18px 0 #131311;
  padding: 56px 64px;
}

.faqs-panel-title {
  font-family: var(--font-primary);
  font-size: clamp(48px, 5.5vw, 76px);
  font-weight: 900;
  letter-spacing: -0.03em;
  color: #131311;
  margin: 0 0 40px 0;
}

.faqs-accordion-list {
  display: flex;
  flex-direction: column;
}

.faq-item {
  border-top: 1.5px solid rgba(19, 19, 17, 0.4);
}

.faq-trigger {
  width: 100%;
  background: none;
  border: none;
  padding: 22px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  text-align: left;
  font-family: var(--font-primary);
  font-size: clamp(16px, 1.5vw, 19px);
  font-weight: 700;
  color: #131311;
  transition: opacity 0.2s ease;
}

.faq-trigger:hover {
  opacity: 0.75;
}

.faq-icon-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #131311;
  color: #C6FD50;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 20px;
  transition: transform 0.25s ease;
}

.faq-chevron {
  width: 16px;
  height: 16px;
  display: block;
  transition: transform 0.25s ease;
}

.faq-item.is-open .faq-chevron {
  transform: rotate(180deg);
}

.faq-content {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.faq-item.is-open .faq-content {
  max-height: 800px;
}

.faq-body {
  padding-bottom: 26px;
  font-size: 16px;
  line-height: 1.65;
  font-weight: 500;
  color: rgba(19, 19, 17, 0.88);
}

.faqs-ask-ai-section {
  margin-top: 56px;
  padding-top: 40px;
  border-top: 2px solid #131311;
}

.ask-ai-heading {
  font-family: var(--font-primary);
  font-size: clamp(24px, 2.5vw, 32px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #131311;
  margin: 0 0 24px 0;
}

.ask-ai-buttons-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-ai-chat {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background-color: #131311;
  color: #C6FD50;
  padding: 14px 24px;
  border-radius: 12px;
  font-family: var(--font-primary);
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.2s ease;
}

.btn-ai-chat:hover {
  transform: translateY(-2px);
  background-color: #000000;
}

.ai-logo-svg {
  width: 20px;
  height: 20px;
  display: block;
}

/* --------------------------------------------------------------------------
   SECTION 6: YELLOW OKAY DEV CALL-TO-ACTION
   -------------------------------------------------------------------------- */
.faq-transition-dark-band {
  background-color: #1C1D1A;
  padding: 50px 24px 70px;
  text-align: center;
}

.btn-white-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: #FFFFFF;
  color: #131311;
  padding: 14px 30px;
  border-radius: 9999px;
  font-family: var(--font-primary);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease;
}

.btn-white-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.section-join-yellow {
  background-color: #EEE642;
  color: #0C0C0C;
  padding: 130px 24px;
}

.join-yellow-inner {
  max-width: 820px;
  margin: 0 auto;
  text-align: center;
}

.join-subheading {
  font-family: var(--font-primary);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0C0C0C;
  margin-bottom: 24px;
}

.join-main-heading {
  font-family: var(--font-primary);
  font-size: clamp(30px, 3.8vw, 48px);
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.03em;
  color: #0C0C0C;
  margin: 0 0 40px 0;
}

/* --------------------------------------------------------------------------
   SECTION 7: BLACK OKAY DEV FOOTER
   -------------------------------------------------------------------------- */
.section-okay-footer {
  position: relative;
  background-color: #0C0C0C;
  color: #FFFFFF;
  padding: 120px 32px 60px;
  overflow: hidden;
}

.footer-grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='none'%3E%3Cpath stroke='rgba(255,255,255,0.04)' stroke-width='1' d='M100 0v100M0 100h100'/%3E%3C/svg%3E");
  background-size: 100px 100px;
  pointer-events: none;
}

.footer-content-inner {
  position: relative;
  z-index: 2;
  max-width: 1240px;
  margin: 0 auto;
  text-align: center;
}

.footer-platform-tag {
  font-family: var(--font-primary);
  font-size: clamp(16px, 1.8vw, 22px);
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 28px 0;
}

.footer-wordmark-wrap {
  max-width: 1050px;
  margin: 0 auto 36px;
}

.footer-logo-okaydev {
  width: 100%;
  height: auto;
  display: block;
}

.footer-callout-heading {
  font-family: var(--font-primary);
  font-size: clamp(20px, 2.3vw, 28px);
  font-weight: 700;
  line-height: 1.35;
  color: #FFFFFF;
  margin: 0 0 28px 0;
}

.btn-white-profile {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #FFFFFF;
  color: #0C0C0C;
  padding: 12px 26px;
  border-radius: 9999px;
  font-family: var(--font-primary);
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease;
}

.btn-white-profile:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(255, 255, 255, 0.15);
}

.icon-external-arrow {
  width: 16px;
  height: 16px;
  display: block;
}

.footer-nav-row {
  margin-top: 48px;
}

.footer-links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 28px;
}

.footer-links-list a {
  color: #FFFFFF;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.footer-links-list a:hover {
  opacity: 0.65;
}

.primary-nav .footer-links-list a {
  font-size: 15px;
  font-weight: 600;
}

.secondary-nav {
  margin-top: 18px;
  margin-bottom: 44px;
}

.secondary-nav .footer-links-list a {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
}

.footer-social-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 22px;
  margin-bottom: 36px;
}

.social-icon-link {
  width: 22px;
  height: 22px;
  color: #FFFFFF;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.social-icon-link:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.social-icon-link svg {
  width: 100%;
  height: 100%;
  display: block;
}

.footer-copyright-text {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 18px;
}

.footer-legal-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
}

.footer-legal-list a {
  color: rgba(255, 255, 255, 0.45);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-legal-list a:hover {
  color: #FFFFFF;
}

.legal-sep {
  color: rgba(255, 255, 255, 0.3);
}

/* --------------------------------------------------------------------------
   RESPONSIVE BREAKPOINTS FOR ALL 7 NEW SECTIONS
   -------------------------------------------------------------------------- */
@media (max-width: 1024px) {
  .directory-container {
    grid-template-columns: 1fr;
    gap: 60px;
  }

  .directory-card-stack {
    height: 440px;
  }

  .dir-stack-card {
    width: 340px;
  }

  .dir-card-ps {
    width: 390px;
  }

  .nyc-comparison-grid {
    grid-template-columns: 1fr;
    gap: 80px;
  }

  .faqs-lime-panel {
    padding: 44px 36px;
  }
}

@media (max-width: 768px) {
  .section-testimonials-yellow {
    padding: 80px 20px;
  }

  .testimonials-dots {
    gap: 10px;
  }

  .testimonial-dot {
    width: 44px;
    height: 44px;
  }

  .section-social-purple {
    padding: 90px 20px 0 20px;
  }

  .section-directory-black {
    padding: 90px 24px;
  }

  .directory-card-stack {
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .dir-stack-card {
    position: static;
    width: 100% !important;
  }

  .section-nyc-comparison {
    padding: 90px 20px 110px;
  }

  .path-card {
    padding: 28px 20px;
  }

  .mala-garland-draped {
    top: -24px;
    left: -20px;
    right: -20px;
    bottom: -44px;
    width: calc(100% + 40px);
    height: calc(100% + 68px);
  }

  .faqs-lime-panel {
    padding: 32px 20px;
    border-radius: 20px;
    box-shadow: 0 10px 0 #131311;
  }

  .faqs-panel-title {
    margin-bottom: 24px;
  }

  .section-join-yellow {
    padding: 80px 20px;
  }

  .section-okay-footer {
    padding: 80px 20px 40px;
  }

  .footer-links-list {
    gap: 16px;
  }
}
`;

fs.appendFileSync('style.css', newStyles);
console.log('Appended 7 sections styling to style.css successfully!');
