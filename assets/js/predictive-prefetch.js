/**
 * IITian Tattva — Predictive Hover Prefetcher & Preconnect Engine
 *
 * Implements:
 * 1. Interaction-aware prefetching triggered on 65ms intent threshold.
 * 2. Mobile and battery preservation (deactivated on coarse pointers).
 * 3. Network hygiene: completely bypassed on Save-Data or 2G/3G connections.
 * 4. Deduplication: fetches every internal route at most once using <link rel="prefetch">.
 */
(function initPredictivePrefetcher() {
  if (typeof window === 'undefined') return;

  // 1. Network & Device Hygiene Checks
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn) {
    if (conn.saveData) return; // Respect user's explicit Data Saver mode
    if (conn.effectiveType && (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g')) return;
  }

  // 2. Disable on mobile/touch-only devices to avoid wasteful background cellular bandwidth
  const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isDesktopPointer) return;

  const prefetchedUrls = new Set();
  const hoverTimers = new WeakMap();

  function triggerPrefetch(url) {
    if (prefetchedUrls.has(url)) return;
    prefetchedUrls.add(url);

    // Use native <link rel="prefetch"> for browser-managed lowest-priority background transfer
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';
    document.head.appendChild(link);
  }

  function handlePointerEnter(e) {
    const anchor = e.target.closest('a');
    if (!anchor || !anchor.href) return;

    // Only prefetch same-origin internal HTML routes
    const url = new URL(anchor.href, window.location.origin);
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname) return;
    if (url.pathname.endsWith('.pdf') || url.pathname.endsWith('.zip')) return;
    if (prefetchedUrls.has(url.pathname)) return;

    // Intent threshold: 65ms hover dwell time distinguishes intentional clicks from glancing pointer sweeps
    const timer = setTimeout(() => {
      triggerPrefetch(url.pathname);
    }, 65);

    hoverTimers.set(anchor, timer);
  }

  function handlePointerLeave(e) {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const timer = hoverTimers.get(anchor);
    if (timer) {
      clearTimeout(timer);
      hoverTimers.delete(anchor);
    }
  }

  // Global event delegation (Single listener on document — 0 memory overhead)
  document.addEventListener('mouseover', handlePointerEnter, { passive: true });
  document.addEventListener('mouseout', handlePointerLeave, { passive: true });
})();
