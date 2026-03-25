/* ─────────────────────────────────────────
   TFM — The Fragrant Memories  |  One Link
   script.js
───────────────────────────────────────── */

(function () {
  'use strict';

  // ─── Video Autoplay Handling ───────────────────────────────────────────────
  const video = document.getElementById('hero-video');

  if (video) {
    const playAttempt = video.play();

    if (playAttempt !== undefined) {
      playAttempt.catch(() => applyFallback());
    }

    video.addEventListener('error', () => applyFallback());

    // iOS Safari: needs first touch to allow autoplay
    document.addEventListener('touchstart', () => {
      if (video.paused) video.play().catch(() => {});
    }, { once: true });
  }

  function applyFallback() {
    const wrap = document.querySelector('.video-wrap');
    if (wrap) {
      wrap.style.background =
        'linear-gradient(160deg, #0d0d0d 0%, #1c1c1c 50%, #111 100%)';
    }
  }

  // ─── Ripple Effect on Location Buttons ───────────────────────────────────
  document.querySelectorAll('.loc-btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const existing = this.querySelector('.ripple');
      if (existing) existing.remove();

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x    = e.clientX - rect.left - size / 2;
      const y    = e.clientY - rect.top  - size / 2;

      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

})();
