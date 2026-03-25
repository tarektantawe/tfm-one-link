/* ─────────────────────────────────────────
   TFM — The Fragrant Memories  |  One Link
   script.js  — video + ripple + click tracking
───────────────────────────────────────── */

(function () {
  'use strict';

  // ─── Video Autoplay ──────────────────────────────────────────────────────────
  const video = document.getElementById('hero-video');

  if (video) {
    const attempt = video.play();
    if (attempt !== undefined) attempt.catch(() => applyFallback());
    video.addEventListener('error', () => applyFallback());
    document.addEventListener('touchstart', () => {
      if (video.paused) video.play().catch(() => {});
    }, { once: true });
  }

  function applyFallback() {
    const wrap = document.querySelector('.video-wrap');
    if (wrap) wrap.style.background = 'linear-gradient(160deg,#0d0d0d 0%,#1c1c1c 50%,#111 100%)';
  }

  // ─── Ripple effect on location buttons ───────────────────────────────────────
  document.querySelectorAll('.loc-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const existing = this.querySelector('.ripple');
      if (existing) existing.remove();
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // ─── Click tracking → Firebase ───────────────────────────────────────────────
  // Track clicks on social icons and location buttons
  // Data is stored in Firestore collection: onelink_analytics/{linkId}
  // linkId is derived from the element's data-link-id attribute (set dynamically)
  // For hardcoded links, we use a stable slug derived from the link text/href

  function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  async function trackClick(linkId) {
    try {
      const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
      const { getFirestore, doc, setDoc, increment } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js');

      let app;
      if (getApps().length) {
        app = getApps()[0];
      } else {
        app = initializeApp({
          apiKey:            'AIzaSyAsThoFIJoKK6pNgjbdWJUGe_D2KEFAPDU',
          authDomain:        'tfm-dashboards.firebaseapp.com',
          projectId:         'tfm-dashboards',
          storageBucket:     'tfm-dashboards.firebasestorage.app',
          messagingSenderId: '83016073364',
          appId:             '1:83016073364:web:7350dc13e4dd52b4543481',
        });
      }

      const db = getFirestore(app);
      await setDoc(
        doc(db, 'onelink_analytics', linkId),
        { clicks: increment(1), lastClicked: new Date().toISOString() },
        { merge: true }
      );
    } catch (_) {
      // Silently fail — tracking is best-effort
    }
  }

  // Attach tracking to all clickable links
  document.querySelectorAll('.social-icon, .loc-btn').forEach(el => {
    const label = el.getAttribute('aria-label') ||
                  el.textContent.trim() ||
                  el.getAttribute('href') || 'unknown';
    const linkId = el.dataset.linkId || slugify(label);

    el.addEventListener('click', () => trackClick(linkId), { passive: true });
  });

})();
