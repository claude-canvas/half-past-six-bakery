// Half Past Six — carousel, scroll reveals, and the juggle-on-view wobble.

var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* ---------- reveal + juggle ---------- */

(function revealAndJuggle() {
  var targets = Array.prototype.slice.call(document.querySelectorAll(".reveal, .juggle"));
  if (!targets.length) return;

  // No observer support, or the visitor asked for less motion: just show everything.
  if (REDUCED || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("in"); });
    return;
  }

  function wobbleLater(el) {
    // Let the reveal finish first, so the element is still before it wobbles.
    setTimeout(function () {
      el.classList.remove("wobble");
      // Reflow so the animation can be retriggered on a later pass.
      void el.offsetWidth;
      el.classList.add("wobble");
    }, 820);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var el = entry.target;

      if (entry.isIntersecting) {
        el.classList.add("in");
        if (el.classList.contains("juggle")) wobbleLater(el);
      } else {
        // Reset so it plays again next time it scrolls back into view.
        el.classList.remove("wobble");
      }
    });
  }, { threshold: 0.35, rootMargin: "0px 0px -40px 0px" });

  targets.forEach(function (el) { io.observe(el); });
})();


/* ---------- cake carousel ---------- */

(function cakeCarousel() {
  var root = document.getElementById("carousel");
  var track = document.getElementById("track");
  var dotsWrap = document.getElementById("dots");
  var prev = document.getElementById("prev");
  var next = document.getElementById("next");
  if (!root || !track || !dotsWrap) return;

  var slides = Array.prototype.slice.call(track.querySelectorAll(".slide"));
  if (slides.length < 2) return;

  var index = 0;
  var timer = null;
  var DELAY = 5200;

  slides.forEach(function (slide, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("role", "tab");
    var title = slide.querySelector("h3");
    b.setAttribute("aria-label", title ? title.textContent.trim() : "Slide " + (i + 1));
    b.addEventListener("click", function () { go(i); restart(); });
    dotsWrap.appendChild(b);
  });

  var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll("button"));

  function paint() {
    track.style.transform = "translateX(" + (-index * 100) + "%)";
    dots.forEach(function (d, i) {
      d.setAttribute("aria-selected", i === index ? "true" : "false");
    });
    slides.forEach(function (s, i) {
      s.setAttribute("aria-hidden", i === index ? "false" : "true");
    });
  }

  function go(i) {
    index = (i + slides.length) % slides.length;
    paint();
  }

  function step() { go(index + 1); }

  function start() {
    if (REDUCED) return;
    stop();
    timer = setInterval(step, DELAY);
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function restart() { stop(); start(); }

  if (next) next.addEventListener("click", function () { go(index + 1); restart(); });
  if (prev) prev.addEventListener("click", function () { go(index - 1); restart(); });

  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { go(index + 1); restart(); }
    if (e.key === "ArrowLeft") { go(index - 1); restart(); }
  });

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", start);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  var x0 = null;
  root.addEventListener("touchstart", function (e) {
    x0 = e.changedTouches[0].clientX;
    stop();
  }, { passive: true });

  root.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
    x0 = null;
    start();
  }, { passive: true });

  paint();
  start();
})();
