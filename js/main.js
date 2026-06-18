/* Riverside Lifestyle — Panel-Videos
   Desktop: Auto-Spotlight (nur aktives Panel spielt, wächst).
   Mobile: gestapelt, alle Panels spielen ihr Video, kein Wechsel, kein Springen. */
(function () {
  'use strict';

  var panelsWrap = document.querySelector('.panels');
  var panels = [].slice.call(document.querySelectorAll('.panel'));
  if (!panelsWrap || !panels.length) return;

  var isMobile = window.matchMedia('(max-width: 920px)').matches;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Mobile: alle Panels dunkel, Video startet erst beim Antippen ----
  // 1. Tap auf ein dunkles Panel -> Video spielt, andere bleiben dunkel.
  // 2. Tap auf das bereits aktive Panel -> Weiterleitung zur Website.
  if (isMobile) {
    var activateM = function (panel) {
      panels.forEach(function (x) {
        var on = x === panel;
        x.classList.toggle('is-active', on);
        var v = x.querySelector('video');
        if (v) {
          if (on) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
          else { v.pause(); }
        }
      });
    };
    panels.forEach(function (p) {
      p.addEventListener('click', function (e) {
        if (p.classList.contains('is-active')) return; // schon aktiv -> Link folgen
        e.preventDefault();
        activateM(p);
      });
    });
    activateM(panels[0]); // erstes Panel spielt, die anderen sind dunkel
    return;
  }

  // ---- Desktop: Auto-Spotlight ----
  var CYCLE = 4200, idx = 0, timer = null;

  function setActive(i) {
    idx = i;
    panels.forEach(function (p, k) {
      var active = k === i;
      p.classList.toggle('is-active', active);
      var v = p.querySelector('video');
      if (v) {
        if (active) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
        else v.pause();
      }
    });
  }
  function start() { if (reduced || timer) return; timer = setInterval(function () { setActive((idx + 1) % panels.length); }, CYCLE); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  setActive(0);
  if (!reduced) {
    start();
    panels.forEach(function (p, k) {
      p.addEventListener('mouseenter', function () { stop(); panelsWrap.classList.add('is-paused'); setActive(k); });
      p.addEventListener('mouseleave', function () { panelsWrap.classList.remove('is-paused'); start(); });
    });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  }
})();
