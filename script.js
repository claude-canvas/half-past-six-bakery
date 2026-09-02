// Half Past Six — bake schedule highlight + cake carousel.

(function scheduleHighlight() {
  var list = document.getElementById("schedule");
  var note = document.getElementById("schedule-note");
  if (!list || !note) return;

  function update() {
    var items = Array.prototype.slice.call(list.querySelectorAll("li"));
    if (!items.length) return;

    var now = new Date();
    var mins = now.getHours() * 60 + now.getMinutes();
    var next = null;

    items.forEach(function (li) {
      li.classList.remove("next");
      var at = parseInt(li.getAttribute("data-mins"), 10);
      if (next === null && at >= mins) next = li;
    });

    if (next) {
      next.classList.add("next");
      var name = next.querySelector(".loaf").textContent.trim();
      var time = next.querySelector(".time").textContent.trim();
      note.textContent = name + " is next, at " + time + ". Times shift by a few minutes — dough decides.";
    } else {
      note.textContent = "Today's baking is done. First loaves tomorrow at 6:30.";
    }
  }

  update();
  setInterval(update, 60000);
})();


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
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Build the dots from the slides that actually exist.
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
    if (reduced) return;
    stop();
    timer = setInterval(step, DELAY);
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function restart() { stop(); start(); }

  if (next) next.addEventListener("click", function () { go(index + 1); restart(); });
  if (prev) prev.addEventListener("click", function () { go(index - 1); restart(); });

  // Keyboard, once the carousel has focus somewhere inside it.
  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { go(index + 1); restart(); }
    if (e.key === "ArrowLeft") { go(index - 1); restart(); }
  });

  // Pause while someone is actually looking at it.
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", start);

  // Stop cycling when the tab is in the background.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  // Swipe on touch devices.
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
