const fs = require('fs');

const faqs = JSON.parse(fs.readFileSync('scripts/faqs.json', 'utf8'));

// Build FAQ Accordion Items HTML
const faqItemsHtml = faqs.map((f, i) => {
  return `        <div class="faq-item" data-faq-index="${i}">
          <button class="faq-trigger" aria-expanded="false" aria-controls="faq-ans-${i}" id="faq-btn-${i}">
            <span class="faq-question">${f.name}</span>
            <span class="faq-icon-circle" aria-hidden="true">
              <svg class="faq-chevron" viewBox="0 0 16 16" fill="none"><path d="M3.5 6L8 10.5L12.5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
          </button>
          <div class="faq-content" id="faq-ans-${i}" aria-labelledby="faq-btn-${i}" hidden>
            <div class="faq-body">${f.acceptedAnswer.text.replace(/\n/g, '<br><br>')}</div>
          </div>
        </div>`;
}).join('\n');

const newSectionsHtml = `
  <!-- =========================================================================
       SECTION 1: YELLOW TESTIMONIAL / CUSTOMER SOCIAL PROOF (#testimonials)
       ========================================================================= -->
  <section class="section-testimonials-yellow" id="testimonials">
    <!-- Repeating Typographic Background Texture -->
    <div class="testimonials-bg-rails" aria-hidden="true">
      <div class="testimonials-rail"><span>OKAYDEV</span><span>OKAYDEV</span><span>OKAYDEV</span><span>OKAYDEV</span></div>
      <div class="testimonials-rail is-flipped"><span>OKAYDEV</span><span>OKAYDEV</span><span>OKAYDEV</span><span>OKAYDEV</span></div>
      <div class="testimonials-rail"><span>OKAYDEV</span><span>OKAYDEV</span><span>OKAYDEV</span><span>OKAYDEV</span></div>
      <div class="testimonials-rail is-flipped"><span>OKAYDEV</span><span>OKAYDEV</span><span>OKAYDEV</span><span>OKAYDEV</span></div>
      <div class="testimonials-rail"><span>OKAYDEV</span><span>OKAYDEV</span><span>OKAYDEV</span><span>OKAYDEV</span></div>
    </div>

    <div class="testimonials-inner-content">
      <h2 class="testimonials-heading">
        Don’t take our word for it.<br>
        Take theirs. It’s pretty okay.
      </h2>

      <!-- 5 Interactive Profile Dots -->
      <div class="testimonials-dots" role="tablist" aria-label="Customer Testimonials">
        <button type="button" class="testimonial-dot is-active" data-t-index="0" role="tab" aria-selected="true" aria-label="Testimonial from Mees Rutten">
          <span class="dot-avatar-frame">
            <img src="assets/images/avatar-mees.png" alt="Mees Rutten">
          </span>
        </button>
        <button type="button" class="testimonial-dot" data-t-index="1" role="tab" aria-selected="false" aria-label="Testimonial from Eric Johnson">
          <span class="dot-avatar-frame">
            <img src="assets/images/avatar-eric.jpg" alt="Eric Johnson">
          </span>
        </button>
        <button type="button" class="testimonial-dot" data-t-index="2" role="tab" aria-selected="false" aria-label="Testimonial from Elliott Mangham">
          <span class="dot-avatar-frame">
            <img src="assets/images/avatar-elliott.png" alt="Elliott Mangham">
          </span>
        </button>
        <button type="button" class="testimonial-dot" data-t-index="3" role="tab" aria-selected="false" aria-label="Testimonial from Michael Vestergaard">
          <span class="dot-avatar-frame">
            <img src="assets/images/avatar-michael.jpg" alt="Michael Vestergaard">
          </span>
        </button>
        <button type="button" class="testimonial-dot" data-t-index="4" role="tab" aria-selected="false" aria-label="Testimonial from Stefan Vitasovic">
          <span class="dot-avatar-frame">
            <img src="assets/images/avatar-stefan.png" alt="Stefan Vitasovic">
          </span>
        </button>
      </div>

      <!-- Testimonial Content Panel -->
      <div class="testimonial-display-box">
        <blockquote class="testimonial-quote" id="tQuote">
          &ldquo;The Okay Devs have always been there to support us, answer our questions, and help us build connections.&rdquo;
        </blockquote>

        <div class="testimonial-author-meta">
          <div class="testimonial-author-name" id="tName">MEES RUTTEN</div>
          <div class="testimonial-author-sub" id="tRole">Founder &amp; Creative Developer<br>Merlin Studio</div>
        </div>

        <div class="testimonial-cta-container">
          <a class="btn-black-pill" id="tCta" href="https://okaydev.co/articles/mees-rutten">
            <span>READ THEIR STORY</span>
            <svg class="btn-arrow-svg" viewBox="0 0 20 20" fill="none"><path fill="currentColor" d="m10 15.68-.766-.774 4.364-4.364H4.32V9.458h9.277L9.234 5.095 10 4.32 15.68 10 10 15.68Z"/></svg>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- =========================================================================
       SECTION 2: PURPLE SOCIAL NETWORK FEATURE SECTION (#social-feed)
       ========================================================================= -->
  <section class="section-social-purple" id="social-feed">
    <div class="social-content-container">
      <h2 class="social-headline">
        A social feed<br>
        that doesn’t<br>
        <span class="highlight-yellow">manipulate you.</span>
      </h2>

      <p class="social-description">
        Posts in order from the people you actually follow, links and all. Everyone who follows you sees what you post, no algorithm in between.
      </p>

      <p class="social-tagline-bold">
        No ads. No ranking. No BS.
      </p>

      <div class="social-btn-wrap">
        <a class="btn-yellow-pill" href="https://okaydev.co/social">
          <span>JOIN OKAY SOCIAL</span>
          <svg class="btn-arrow-svg" viewBox="0 0 20 20" fill="none"><path fill="currentColor" d="m10 15.68-.766-.774 4.364-4.364H4.32V9.458h9.277L9.234 5.095 10 4.32 15.68 10 10 15.68Z"/></svg>
        </a>
      </div>
    </div>

    <!-- Enormous Cropped Typographic Wordmark -->
    <div class="social-oversized-letters" aria-hidden="true">OKAYDEV</div>
  </section>

  <!-- =========================================================================
       SECTION 3: BLACK DIRECTORY FEATURE SECTION (#directory)
       ========================================================================= -->
  <section class="section-directory-black" id="directory">
    <div class="directory-container">
      <!-- Left Column: Heading & Description -->
      <div class="directory-copy-col">
        <h2 class="directory-title">Find the<br>right people.</h2>
        <p class="directory-description">
          Explore the directory and connect with people who fit what you’re looking for, from future collaborators and hires to creatives whose work inspires you.
        </p>
      </div>

      <!-- Right Column: Overlapping Layered Profile Cards -->
      <div class="directory-cards-col">
        <div class="directory-card-stack">

          <!-- Card 1: Léo Mouraire -->
          <div class="dir-stack-card dir-card-leo">
            <div class="dir-card-user-info">
              <img src="assets/images/avatar-leo.jpg" alt="Léo Mouraire" class="dir-user-avatar">
              <div class="dir-user-meta">
                <div class="dir-name-line">
                  <span class="dir-user-fullname">Léo Mouraire</span>
                  <span class="badge-okay">OKAY</span>
                </div>
                <div class="dir-user-handle">@leomouraire</div>
                <div class="dir-user-title">Creative Technologist, Cosmic Shelter</div>
              </div>
            </div>
          </div>

          <!-- Card 2: Marti Fenosa -->
          <div class="dir-stack-card dir-card-marti">
            <div class="dir-card-user-info">
              <img src="assets/images/avatar-marti.jpg" alt="Marti Fenosa" class="dir-user-avatar">
              <div class="dir-user-meta">
                <div class="dir-name-line">
                  <span class="dir-user-fullname">Marti Fenosa</span>
                  <span class="badge-okay">OKAY</span>
                </div>
                <div class="dir-user-handle">@marti.fenosa</div>
                <div class="dir-user-title">Senior Frontend &amp; Motion Developer</div>
              </div>
            </div>
          </div>

          <!-- Card 3: Julien Renau -->
          <div class="dir-stack-card dir-card-julien">
            <div class="dir-card-user-info">
              <img src="assets/images/avatar-julien.jpg" alt="Julien Renau" class="dir-user-avatar">
              <div class="dir-user-meta">
                <div class="dir-name-line">
                  <span class="dir-user-fullname">Julien Renau</span>
                  <span class="badge-okay">OKAY</span>
                  <span class="badge-pro">PRO</span>
                </div>
                <div class="dir-user-handle">@julien.rno</div>
                <div class="dir-user-title">Senior Creative Technologist, Freelance</div>
              </div>
            </div>
          </div>

          <!-- Card 4: Patrick Schroen with Project Thumbnail -->
          <div class="dir-stack-card dir-card-ps">
            <div class="dir-ps-content">
              <div class="dir-card-user-info">
                <img src="assets/images/avatar-ps.png" alt="Patrick Schroen" class="dir-user-avatar">
                <div class="dir-user-meta">
                  <div class="dir-name-line">
                    <span class="dir-user-fullname">Patrick Schroen</span>
                    <span class="badge-okay">OKAY</span>
                  </div>
                  <div class="dir-user-handle">@ps</div>
                  <div class="dir-user-location">
                    <svg class="icon-loc" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 0 0-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 0 0-6-6Zm0 8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/></svg>
                    Toronto, CA · English
                  </div>
                </div>
              </div>
              <div class="dir-project-thumb-frame">
                <img src="assets/images/project-concrete.jpg" alt="Concrete project preview" class="dir-project-img">
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>

  <!-- =========================================================================
       SECTION 4: NYC PATH COMPARISON SECTION WITH THE MALA (#nyc-path)
       ========================================================================= -->
  <section class="section-nyc-comparison" id="nyc-path">
    <div class="nyc-inner-container">

      <!-- Header with Yellow Label, Bold Italic Headline, and Highlighted Subtitle -->
      <div class="nyc-header-block">
        <div class="nyc-top-badge">
          <span>OLD SYSTEM ISN'T BUILT FOR NEW ERA</span>
          <svg class="badge-sparkle-svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0l2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7z"/></svg>
        </div>

        <h2 class="nyc-main-heading">
          PREPARE FOR <span class="highlight-momentum">MOMENTUM</span><br>
          NOT EXAMS.
        </h2>

        <p class="nyc-subtitle-text">
          Degrees Matter But In Today’s World, <mark class="badge-text-yellow">Skills, Proof Of Work</mark> , And <mark class="badge-text-yellow">Execution</mark> Matter More.
        </p>
      </div>

      <!-- Two Comparison Cards Side-by-Side -->
      <div class="nyc-comparison-grid">

        <!-- Left Card: THE TRADITIONAL PATH (With Draped Mala Garland) -->
        <div class="comparison-card-wrapper traditional-side">
          <div class="path-card traditional-path-card">
            <div class="path-banner-container">
              <img src="assets/images/banner-traditional-path.png" alt="THE TRADITIONAL PATH" class="path-banner-img">
            </div>
            <p class="path-card-subtitle">The Old Way, Slow, Outdated, And Overcrowded.</p>

            <ul class="path-items-list traditional-items">
              <li><span class="path-icon path-icon-cross">✕</span> Watch videos alone</li>
              <li><span class="path-icon path-icon-cross">✕</span> No real accountability</li>
              <li><span class="path-icon path-icon-cross">✕</span> Outdated content</li>
              <li><span class="path-icon path-icon-cross">✕</span> No projects / real results</li>
              <li><span class="path-icon path-icon-cross">✕</span> Isolated learning</li>
            </ul>
          </div>

          <!-- Physical Hanging Mala Garland ( माला ) -->
          <img src="assets/images/mala-garland.png" alt="Traditional Indian sacred mala garland draped around board" class="mala-garland-draped" aria-hidden="true">
        </div>

        <!-- Right Card: THE NYC PATH -->
        <div class="comparison-card-wrapper modern-side">
          <div class="path-card nyc-modern-card">
            <div class="path-banner-container">
              <img src="assets/images/banner-nyc-path.png" alt="THE NYC PATH" class="path-banner-img">
            </div>
            <p class="path-card-subtitle">The new way: practical, fast and future-ready</p>

            <ul class="path-items-list modern-items">
              <li><span class="path-icon path-icon-check">✓</span> Build live with guidance</li>
              <li><span class="path-icon path-icon-check">✓</span> Mentorship &amp; code reviews</li>
              <li><span class="path-icon path-icon-check">✓</span> Industry-relevant learning</li>
              <li><span class="path-icon path-icon-check">✓</span> Real-world projects</li>
              <li><span class="path-icon path-icon-check">✓</span> Community &amp; momentum</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- =========================================================================
       SECTION 5: BRIGHT LIME FAQ SECTION (#faqs)
       ========================================================================= -->
  <section class="section-faqs-wrap" id="faqs">
    <div class="faqs-panel-container">
      <div class="faqs-lime-panel">

        <h2 class="faqs-panel-title">FAQs</h2>

        <!-- Accordion Question List -->
        <div class="faqs-accordion-list" role="region" aria-label="Frequently Asked Questions">
${faqItemsHtml}
        </div>

        <!-- Lower Section: Ask AI Why Us? -->
        <div class="faqs-ask-ai-section">
          <h3 class="ask-ai-heading">Ask AI Why Us?</h3>
          <div class="ask-ai-buttons-row">
            <!-- ChatGPT -->
            <a class="btn-ai-chat" href="https://chatgpt.com/?q=Tell+me+why+projectone.website+is+a+great+choice+for+small+business+owners+with+no+website+or+an+outdated+one%2C+looking+for+a+simple%2C+modern+site+that+better+reflects+their+business%2C+built+in+14+days+by+senior+web+designers%2C+with+custom+design+%28no+AI+design%29%2C+and+without+the+hassle+of+managing+freelancers+or+paying+big+agency+fees" target="_blank" rel="noopener noreferrer">
              <span>Ask ChatGPT</span>
              <svg class="ai-logo-svg" viewBox="0 0 24 24" fill="none"><path d="M20.5 10.4c-.2-.9-.8-1.7-1.5-2.2.2-.7.1-1.5-.2-2.2-.4-.8-1.2-1.4-2.1-1.6-.5-.5-1.2-.8-2-.8-.8 0-1.6.4-2.2 1-.7-.4-1.5-.5-2.4-.3-.8.2-1.5.8-1.9 1.5-.7-.2-1.5 0-2.2.4-.7.5-1.1 1.3-1.2 2.1-.8.4-1.3 1.1-1.5 1.9-.3.9-.1 1.8.4 2.5-.2.9 0 1.8.4 2.5.4.8 1.1 1.4 2 1.6.4.6 1.1 1 1.9 1.1.8.1 1.6-.2 2.2-.7.6.5 1.4.7 2.2.6.8-.1 1.5-.6 2-1.2.7.3 1.5.3 2.3 0 .7-.4 1.2-1.1 1.4-1.9.7-.3 1.3-.9 1.6-1.7.3-.8.3-1.8-.1-2.6.4-.6.6-1.4.4-2.2v-.3z" stroke="currentColor" stroke-width="1.8"/></svg>
            </a>

            <!-- Claude -->
            <a class="btn-ai-chat" href="https://claude.ai/new?q=Tell+me+why+projectone.website+is+a+great+choice+for+small+business+owners+with+no+website+or+an+outdated+one%2C+looking+for+a+simple%2C+modern+site+that+better+reflects+their+business%2C+built+in+14+days+by+senior+web+designers%2C+with+custom+design+%28no+AI+design%29%2C+and+without+the+hassle+of+managing+freelancers+or+paying+big+agency+fees" target="_blank" rel="noopener noreferrer">
              <span>Ask Claude</span>
              <svg class="ai-logo-svg" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
            </a>

            <!-- Perplexity -->
            <a class="btn-ai-chat" href="https://www.perplexity.ai/search?q=Tell+me+why+projectone.website+is+a+great+choice+for+small+business+owners+with+no+website+or+an+outdated+one%2C+looking+for+a+simple%2C+modern+site+that+better+reflects+their+business%2C+built+in+14+days+by+senior+web+designers%2C+with+custom+design+%28no+AI+design%29%2C+and+without+the+hassle+of+managing+freelancers+or+paying+big+agency+fees" target="_blank" rel="noopener noreferrer">
              <span>Ask Perplexity</span>
              <svg class="ai-logo-svg" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18M6.5 6.5l11 11M6.5 17.5l11-11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </a>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- =========================================================================
       SECTION 6: YELLOW OKAY DEV CALL-TO-ACTION (#cta-yellow)
       ========================================================================= -->
  <div class="faq-transition-dark-band">
    <a href="#faqs" class="btn-white-pill">
      <span>VIEW ALL FAQS</span>
      <span class="btn-arrow-right">→</span>
    </a>
  </div>

  <section class="section-join-yellow" id="join-today">
    <div class="join-yellow-inner">
      <div class="join-subheading">IMPOSTORS WELCOME HERE</div>
      <h2 class="join-main-heading">
        OkayDev is a place for people who make<br>
        things and care how they’re made. Bring<br>
        your work, your questions, and the people<br>
        you like building with.
      </h2>
      <div class="join-cta-row">
        <a class="btn-black-pill" href="https://okaydev.co/sign-up">
          <span>JOIN FOR FREE TODAY</span>
          <span class="btn-arrow-right">→</span>
        </a>
      </div>
    </div>
  </section>

  <!-- =========================================================================
       SECTION 7: BLACK OKAY DEV FOOTER (#footer)
       ========================================================================= -->
  <footer class="section-okay-footer" id="footer">
    <!-- Grid line background overlay -->
    <div class="footer-grid-overlay" aria-hidden="true"></div>

    <div class="footer-content-inner">
      <!-- Subtitle -->
      <p class="footer-platform-tag">A Social Network &amp; Portfolio Platform</p>

      <!-- Giant Official Vector Wordmark OKAYDEV -->
      <div class="footer-wordmark-wrap">
        <svg class="footer-logo-okaydev" role="img" aria-label="OKAYDEV logo" viewBox="0 0 1483 276" fill="none">
          <g class="logo-shades" aria-hidden="true">
            <path class="logo-letter-shadow" d="M1350.75 34.5V4H1252.25L1202.25 54V272H1374.75L1424.75 222L1483 4H1381.25L1350.75 34.5Z" fill="#1C1C1C"/>
            <path class="logo-letter-shadow" d="M1088.75 4L1038.75 54V272H1211L1261 222V4H1088.75Z" fill="#1C1C1C"/>
            <path class="logo-letter-shadow" d="M875.5 4L825.5 54V272H935.5C967 272 996 259.75 1016.5 239.25L1066.5 189.25C1086.5 169.25 1099.25 142.5 1099.25 113C1099.25 53 1047.75 4 985.5 4H875.5Z" fill="#1C1C1C"/>
            <path class="logo-letter-shadow" d="M791.75 272L841.75 222L900 4H795.25L777.5 21.75V4H680.25L630.25 54V235.5H696.75L687 272H791.75Z" fill="#1C1C1C"/>
            <path class="logo-letter-shadow" d="M540.25 240.25V272H638.25L688.25 222V4H515L465 54L406.75 272H508.5L540.25 240.25Z" fill="#1C1C1C"/>
            <path class="logo-letter-shadow" d="M337 254.25V272H434.25L484.25 222V85.25H465.5L487.25 4H272L222 54V272H319.25L337 254.25Z" fill="#1C1C1C"/>
            <path class="logo-letter-shadow" d="M197.25 243.5L247.25 193.5C269 173 282.5 144.5 282.5 112.75C282.5 50.75 229.75 0 166.5 0C135 0 106.5 12 85.5 31.75L35.5 81.75C14.25 103 0 131 0 162.75C0 225.25 52 276 116.5 276C147.75 276 176.25 263.75 197.25 243.5Z" fill="#1C1C1C"/>
          </g>
          <g class="logo-faces">
            <path class="logo-letter-face" d="M1261.25 13V213H1417.75L1471.25 13H1388.25L1356.25 132C1353.75 141 1341.75 140.25 1341.75 130V13H1261.25Z" fill="#FFFFFF"/>
            <path class="logo-letter-face" d="M1097.75 13V213H1252V145.5H1207V107H1184.5C1177.25 107 1172 101.5 1172 93.75C1172 86 1177.25 80.5 1184.5 80.5H1252V13H1097.75Z" fill="#FFFFFF"/>
            <path class="logo-letter-face" d="M884.5 13V213H985.5C1043 213 1090.25 168 1090.25 113C1090.25 58 1043 13 985.5 13H884.5ZM953 113C953 97.25 966 84.25 981.75 84.25C997.5 84.25 1010.25 97.25 1010.25 113C1010.25 128.75 997.5 141.75 981.75 141.75C966 141.75 953 128.75 953 113Z" fill="#FFFFFF"/>
            <path class="logo-letter-face" d="M758.5 176.5L748.75 213H834.75L888.25 13H802.25L778.5 101.25C777 107 768.5 105.5 768.5 99.25V13H689.25V176.5H758.5Z" fill="#FFFFFF"/>
            <path class="logo-letter-face" d="M522 13L468.5 213H551.5L564.75 163.75H599.25V213H679.25V13H522ZM568.25 90.5C568.25 79.25 577.5 70.25 588.5 70.25C599.5 70.25 608.5 79.25 608.5 90.5C608.5 101.5 599.5 110.5 588.5 110.5C577.5 110.5 568.25 101.5 568.25 90.5Z" fill="#FFFFFF"/>
            <path class="logo-letter-face" d="M281 13V213H360.25V151.25H396V213H475.25V94.25H453.75L475.5 13H381V71C381 88.25 360.25 88.25 360.25 71V13H281Z" fill="#FFFFFF"/>
            <path class="logo-letter-face" d="M166.5 217C225 217 273.5 170.25 273.5 112.75C273.5 55.75 225 9 166.5 9C106.75 9 59 55.75 59 112.75C59 170.25 106.75 217 166.5 217ZM137.25 113C137.25 97.25 150.5 84.25 166.25 84.25C181.5 84.25 194.5 97.25 194.5 113C194.5 129 181.5 141.75 166.25 141.75C150.5 141.75 137.25 129 137.25 113Z" fill="#FFFFFF"/>
          </g>
        </svg>
      </div>

      <!-- Statement & Profile CTA -->
      <h3 class="footer-callout-heading">
        Join for free and hang with<br>
        creative people on the internet.
      </h3>

      <div class="footer-cta-wrap">
        <a class="btn-white-profile" href="https://okaydev.co/sign-up">
          <span>Make Your Profile</span>
          <svg class="icon-external-arrow" viewBox="0 0 24 24" fill="none"><path d="M5.77 17.12 16.89 6" stroke="currentColor" stroke-width="2.5"/><path d="M6.14 6H16.89V16" stroke="currentColor" stroke-width="2.5"/></svg>
        </a>
      </div>

      <!-- Navigation Row 1: Primary Links -->
      <nav class="footer-nav-row primary-nav" aria-label="Primary Footer Navigation">
        <ul class="footer-links-list">
          <li><a href="https://okaydev.co/">Home</a></li>
          <li><a href="https://okaydev.co/social">Social</a></li>
          <li><a href="https://okaydev.co/gallery">Gallery</a></li>
          <li><a href="https://okaydev.co/directory">Directory</a></li>
          <li><a href="https://okaydev.co/articles">Articles</a></li>
          <li><a href="https://okaydev.co/jobs">Jobs</a></li>
          <li><a href="https://okaydev.co/pricing">Pricing</a></li>
        </ul>
      </nav>

      <!-- Navigation Row 2: Secondary Links -->
      <nav class="footer-nav-row secondary-nav" aria-label="Secondary Footer Navigation">
        <ul class="footer-links-list">
          <li><a href="https://okaydev.co/about">About</a></li>
          <li><a href="https://okaydev.co/faqs">FAQs</a></li>
          <li><a href="https://okaydev.co/brand">Brand</a></li>
          <li><a href="https://okaydev.co/contact">Contact</a></li>
          <li><a href="https://okaydev.co/login">Login</a></li>
          <li><a href="https://okaydev.co/sign-up">Sign up</a></li>
          <li><a href="https://okaydev.co/newsletter">Newsletter</a></li>
        </ul>
      </nav>

      <!-- Social Media Icons Row -->
      <div class="footer-social-row">
        <!-- CodePen -->
        <a class="social-icon-link" href="https://codepen.io/okaydev" target="_blank" rel="noopener noreferrer" aria-label="CodePen" title="CodePen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 2 10 6.5v7L12 22 2 15.5v-7L12 2zm0 4.5L5.5 10.8l6.5 4.3 6.5-4.3L12 6.5zm-8 7.2 4.5-3v-4L4 9.7v4zm16 0v-4l-4.5-3v4l4.5 3zm-9 6v-4.5l-4-2.7-2.5 1.7 6.5 5.5zm2 0 6.5-5.5-2.5-1.7-4 2.7v4.5z"/></svg>
        </a>
        <!-- X (Twitter) -->
        <a class="social-icon-link" href="https://x.com/okaydevs" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" title="X">
          <svg viewBox="0 0 1200 1227" fill="currentColor"><path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"/></svg>
        </a>
        <!-- Bluesky -->
        <a class="social-icon-link" href="https://bsky.app/profile/okaydev.co" target="_blank" rel="noopener noreferrer" aria-label="Bluesky" title="Bluesky">
          <svg viewBox="0 0 256 226" fill="currentColor"><path d="M55.491 15.172c29.35 22.035 60.917 66.712 72.509 90.686 11.592-23.974 43.159-68.651 72.509-90.686C221.686-.727 256-13.028 256 26.116c0 7.818-4.482 65.674-7.111 75.068-9.138 32.654-42.436 40.983-72.057 35.942 51.775 8.812 64.946 38 36.501 67.187-54.021 55.433-77.644-13.908-83.696-31.676-1.11-3.257-1.63-4.78-1.637-3.485-.008-1.296-.527.228-1.637 3.485-6.052 17.768-29.675 87.11-83.696 31.676-28.445-29.187-15.274-58.375 36.5-67.187-29.62 5.041-62.918-3.288-72.056-35.942C4.482 91.79 0 33.934 0 26.116 0-13.028 34.314-.727 55.491 15.172Z"/></svg>
        </a>
        <!-- Instagram -->
        <a class="social-icon-link" href="https://instagram.com/okaydevs" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        </a>
        <!-- LinkedIn -->
        <a class="social-icon-link" href="https://linkedin.com/company/okaydev" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8Z"/></svg>
        </a>
        <!-- GitHub -->
        <a class="social-icon-link" href="https://github.com/okaydevs" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
          <svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
        </a>
      </div>

      <!-- Copyright Line -->
      <div class="footer-copyright-text">
        OKAY DEV&reg; 2026 &copy; All rights reserved
      </div>

      <!-- Legal Navigation Row -->
      <nav class="footer-legal-nav" aria-label="Legal Links">
        <ul class="footer-legal-list">
          <li><a href="https://okaydev.co/terms">Terms</a></li>
          <li class="legal-sep">&middot;</li>
          <li><a href="https://okaydev.co/privacy">Privacy</a></li>
          <li class="legal-sep">&middot;</li>
          <li><a href="https://okaydev.co/acceptable-use">Acceptable Use</a></li>
          <li class="legal-sep">&middot;</li>
          <li><a href="https://okaydev.co/disclaimer">Disclaimer</a></li>
          <li class="legal-sep">&middot;</li>
          <li><a href="https://okaydev.co/returns">Returns</a></li>
          <li class="legal-sep">&middot;</li>
          <li><a href="https://okaydev.co/cookie-policy">Cookie Policy</a></li>
          <li class="legal-sep">&middot;</li>
          <li><a href="https://okaydev.co/community-guidelines">Community Guidelines</a></li>
        </ul>
      </nav>

    </div>
  </footer>
`;

// Read index.html
let html = fs.readFileSync('index.html', 'utf8');

// Insert after section-portfolio-grid
const searchTarget = '</section>\n\n  <script src="main.js"></script>';
if (!html.includes(searchTarget)) {
  const altTarget = '</section>\n  <script src="main.js"></script>';
  if (html.includes(altTarget)) {
    html = html.replace(altTarget, '</section>\n' + newSectionsHtml + '\n  <script src="main.js"></script>');
  } else {
    const idx = html.lastIndexOf('</section>');
    html = html.slice(0, idx + 10) + '\n' + newSectionsHtml + '\n' + html.slice(idx + 10);
  }
} else {
  html = html.replace(searchTarget, '</section>\n' + newSectionsHtml + '\n  <script src="main.js"></script>');
}

fs.writeFileSync('index.html', html);
console.log('Successfully injected 7 new sections into index.html!');
