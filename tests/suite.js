const { chromium } = require('playwright');

/**
 * BAFSKBC — Homepage Smoke Test Suite
 * Validates homepage content, motion engines, search, and mobile navigation.
 */
const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function runTestSuite() {
  console.log('Starting BAFSKBC homepage verification suite...');
  const launchOptions = { headless: true, args: ['--no-sandbox'] };
  if (process.env.CHROMIUM_PATH) launchOptions.executablePath = process.env.CHROMIUM_PATH;
  const browser = await chromium.launch(launchOptions);
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // 1. Home Page Verification
  console.log('\n[1/4] Auditing Desktop Engine Integration (/) ...');
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const engines = await page.evaluate(() => ({
    lenis: typeof window.Lenis === 'function' && !!window.lenis,
    gsap: typeof window.gsap !== 'undefined',
    scrollTrigger: typeof window.ScrollTrigger !== 'undefined',
    flip: typeof window.Flip !== 'undefined',
    splitType: typeof window.SplitType === 'function',
    vanillaTilt: typeof window.VanillaTilt === 'function',
    confetti: typeof window.confetti === 'function',
    fuse: typeof window.Fuse === 'function',
    lazysizes: typeof window.lazySizes !== 'undefined',
    cursor: !!document.getElementById('tattvaAwwwardsCursor'),
    searchModal: !!document.getElementById('tattvaSearchModal')
  }));

  for (const [key, val] of Object.entries(engines)) {
    if (!val) throw new Error(`Engine verification failed: ${key} is inactive.`);
  }
  console.log('  ✔ All 11 core motion & search engines active.');

  const homepage = await page.evaluate(() => ({
    title: document.title,
    hero: document.querySelector('#heroHeadline')?.innerText.replace(/\s+/g, ' ').trim(),
    panelMemberPresent: document.querySelector('#panel')?.innerText.includes('Jannatul Ferdous Nirjona'),
    events: document.querySelectorAll('#events .club-event-card').length,
    pastEvent: document.querySelector('#events .club-event-card-past')?.innerText.includes('3rd DRMC International Business Summit 2026'),
    upcomingEvent: document.querySelector('#events .club-event-card-upcoming')?.innerText.includes('ASCENT: The BAFSK Summit'),
    drmcImage: document.querySelector('#events .club-event-photo img')?.getAttribute('src'),
    ascentImage: document.querySelector('#events .ascent-artwork img')?.getAttribute('src'),
    nextChapterImage: document.querySelector('#cardAfternoon img')?.getAttribute('src'),
    footerLetters: document.querySelectorAll('.footer-club-wordmark .footer-letter').length,
    limeToken: getComputedStyle(document.querySelector('.home-page')).getPropertyValue('--color-lime').trim(),
    registration: document.querySelector('#membership .btn-yellow-pill')?.href,
    registrationOpen: document.querySelector('#membership .club-registration-status')?.innerText,
    missingAnchors: [...document.querySelectorAll('a[href^="#"]')]
      .map(link => link.getAttribute('href').slice(1))
      .filter(id => id && !document.getElementById(id))
  }));
  if (!homepage.title.includes('BAFSKBC')) throw new Error('Homepage title is not club branded.');
  if (homepage.hero !== 'Build Ideas. Lead Change.') throw new Error('Homepage hero copy is incorrect.');
  if (homepage.panelMemberPresent) throw new Error('Removed executive-panel member details are still visible.');
  if (homepage.events !== 2) throw new Error(`Expected only DRMC Summit and ASCENT cards; found ${homepage.events}.`);
  if (!homepage.pastEvent || !homepage.upcomingEvent) throw new Error('The DRMC Summit or upcoming ASCENT event is missing.');
  if (homepage.drmcImage !== 'attached_assets/1_1792995782097.jpg') throw new Error('The DRMC event photo is not displayed.');
  if (homepage.ascentImage !== 'attached_assets/image_1792995893055.png') throw new Error('The ASCENT poster image is not displayed.');
  if (homepage.nextChapterImage !== 'attached_assets/use_in_hero_1_1792995782098.jpg') throw new Error('The updated Next Chapter photo is missing.');
  if (homepage.footerLetters !== 7) throw new Error('The BAFSKBC footer wordmark is incomplete.');
  if (homepage.limeToken !== '#2563eb') throw new Error(`Homepage accent should be blue, not lime; found ${homepage.limeToken}.`);
  if (!homepage.registration?.includes('docs.google.com/forms')) throw new Error('Confirmed membership form link is missing.');
  if (!homepage.registrationOpen?.toLowerCase().includes('registration is open')) {
    throw new Error('Confirmed membership registration status is missing.');
  }
  if (homepage.missingAnchors.length) throw new Error(`Broken homepage anchors: ${homepage.missingAnchors.join(', ')}`);
  console.log('  ✔ Club events, requested image replacements, panel removal, blue palette, registration CTA, and anchors verified.');

  await page.locator('.footer-wordmark-wrap').hover();
  await page.waitForFunction(() => document.querySelector('.footer-club-wordmark')?.classList.contains('is-waving'));
  const footerAnimation = await page.locator('.footer-letter').first().evaluate((letter) => getComputedStyle(letter).animationName);
  if (footerAnimation !== 'club-footer-letter-spring') throw new Error('Footer wordmark motion effect did not start.');
  console.log('  ✔ Interactive footer wordmark motion is active.');

  // 2. Command Palette (Ctrl+K / Cmd+K)
  console.log('\n[2/4] Testing Command Search Palette & Fuse.js Querying ...');
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(300);
  const isOpen = await page.evaluate(() => document.getElementById('tattvaSearchModal')?.classList.contains('is-open'));
  if (!isOpen) throw new Error('Search modal failed to open upon Ctrl+K.');

  await page.fill('#tattvaSearchInput', 'Events');
  await page.waitForTimeout(200);
  const hits = await page.evaluate(() => document.querySelectorAll('#tattvaSearchResults .search-result-item').length);
  if (hits === 0) throw new Error('Fuse search returned 0 items for "Events".');
  console.log(`  ✔ Fuse.js returned ${hits} club results.`);

  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);

  // 3. Mobile Touch Isolation
  console.log('\n[3/4] Auditing Touch Screen Ergonomics (390px Viewport) ...');
  const mContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true
  });
  const mPage = await mContext.newPage();
  await mPage.goto(baseUrl, { waitUntil: 'networkidle' });
  await mPage.waitForTimeout(400);

  const mChecks = await mPage.evaluate(() => ({
    lenis: !!window.lenis,
    noTiltOnMobile: !document.querySelector('.grid-card.has-tilt'),
    cursorNotActive: window.matchMedia('(pointer: coarse)').matches,
    eventGridColumns: getComputedStyle(document.querySelector('#events .club-events-grid')).gridTemplateColumns,
    eventCardWidths: [...document.querySelectorAll('#events .club-event-card')].map((card) => card.getBoundingClientRect().width),
    ascentArtworkWidth: document.querySelector('#events .ascent-artwork')?.getBoundingClientRect().width,
    upcomingCardWidth: document.querySelector('#events .club-event-card-upcoming')?.getBoundingClientRect().width
  }));

  if (!mChecks.lenis) throw new Error('Lenis scroll failed on mobile.');
  if (!mChecks.noTiltOnMobile) throw new Error('3D tilt should be disabled on mobile viewports.');
  if (mChecks.eventGridColumns.trim().split(/\s+/).length !== 1) throw new Error('Mobile events must use a single-column layout.');
  if (mChecks.eventCardWidths.length !== 2 || mChecks.eventCardWidths.some((width) => width < 300)) {
    throw new Error(`Mobile event cards are too narrow: ${mChecks.eventCardWidths.join(', ')}.`);
  }
  if (mChecks.ascentArtworkWidth < mChecks.upcomingCardWidth - 2) throw new Error('ASCENT artwork does not fill its mobile card.');
  console.log('  ✔ Touch ergonomics isolated, native swipes preserved.');
  console.log('  ✔ Event cards and ASCENT artwork fill the mobile layout.');
  await mPage.locator('#mobileMenuToggle').click();
  await mPage.locator('#mobileNavDrawer').waitFor({ state: 'visible' });
  const mobileNavOpen = await mPage.locator('#mobileMenuToggle').getAttribute('aria-expanded');
  if (mobileNavOpen !== 'true') throw new Error('Mobile navigation drawer did not open.');
  const drawerA11yState = await mPage.locator('#mobileNavDrawer').getAttribute('aria-hidden');
  if (drawerA11yState !== 'false') throw new Error('Mobile navigation drawer accessibility state did not update.');
  if (!(await mPage.locator('#mobileNavDrawer a[href="#events"]').isVisible())) {
    throw new Error('Mobile Events navigation link is not visible.');
  }
  await mPage.locator('#mobileNavDrawer a[href="#events"]').click();
  await mPage.waitForFunction(() => !document.getElementById('mobileNavDrawer')?.classList.contains('open'));
  console.log('  ✔ Mobile club navigation opens and exposes its section links.');

  // 4. Directory Route Parity
  console.log('\n[4/4] Validating Route Parity Across All Top-Level Pages ...');
  const routes = ['/about', '/blog', '/contact', '/join', '/resources'];
  for (const r of routes) {
    await page.goto(new URL(r, baseUrl).toString(), { waitUntil: 'networkidle' });
    const ok = await page.evaluate(() => !!window.lenis && typeof window.Fuse === 'function');
    if (!ok) throw new Error(`Route verification failed on ${r}.`);
    console.log(`  ✔ Route ${r} passed.`);
  }

  await browser.close();
  console.log('\n🎉 ALL VERIFICATION SUITE CHECKS COMPLETED SUCCESSFULLY!\n');
}

runTestSuite().catch((err) => {
  console.error('\n❌ Test Suite Error:', err.message);
  process.exit(1);
});
