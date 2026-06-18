/* Riverside Lifestyle — Auto-Spotlight für die drei Portal-Panels */
(function () {
  'use strict';

  var panelsWrap = document.querySelector('.panels');
  var panels = [].slice.call(document.querySelectorAll('.panel'));
  if (!panelsWrap || !panels.length) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CYCLE = 4200; // muss zu --cycle in CSS passen
  var idx = 0;
  var timer = null;

  function setActive(i) {
    idx = i;
    panels.forEach(function (p, k) {
      var active = k === i;
      p.classList.toggle('is-active', active);
      // Nur das aktive Panel-Video spielt, die anderen pausieren
      var vid = p.querySelector('video');
      if (vid) {
        if (active) {
          var pr = vid.play();
          if (pr && pr.catch) pr.catch(function () {});
        } else {
          vid.pause();
        }
      }
    });
  }

  function start() {
    if (reduced || timer) return;
    timer = setInterval(function () {
      setActive((idx + 1) % panels.length);
    }, CYCLE);
  }
  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  setActive(0);
  if (!reduced) {
    start();
    // Hover übersteuert die Rotation
    panels.forEach(function (p, k) {
      p.addEventListener('mouseenter', function () {
        stop();
        panelsWrap.classList.add('is-paused');
        setActive(k);
      });
      p.addEventListener('mouseleave', function () {
        panelsWrap.classList.remove('is-paused');
        start();
      });
    });
    // Pausieren, wenn der Tab im Hintergrund ist
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); } else { start(); }
    });
  }
})();
