// Highlights whichever bake is next, so the schedule reflects the real day.
(function () {
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
