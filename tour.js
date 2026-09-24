/* The tour, on the web. The steps and their words are the extension's own
   (TOUR_STEPS in the app's app.js), so what a visitor reads here is what a
   student sees after setup. Each `at` is the part of the screenshot it lights,
   as [left, top, width, height] in percent of the 1280×800 image. */
(() => {
  const STEPS = [
    { at: [0, 0, 100, 7.9], title: "The top bar",
      text: "Quick links to the sites your work actually lives on — earned, never invented: a site appears only when your data links to it. Anything that needs you (a sign-in, a stale board) shows here as a red mark; click it to fix it." },
    { at: [0.6, 8, 98.8, 4.4], title: "The strip",
      text: "One tab per class, plus Assignments, Life, Calendar, Done and Settings. Arrow keys and [ ] step through them; 1–9 jump to a class; H goes home." },
    { at: [20.6, 12.6, 57.9, 12.4], title: "Your classes",
      text: "Each chip is a class: the ring is how soon its next thing is due, the letter and percent are the grade. Click a chip for the class page — grade breakdown, what's open, links, notes." },
    { at: [78.9, 12.6, 20.6, 84.2], title: "Assignments",
      text: "Everything open, by class. The marks say what each row is (HW, T, Q, PS…) and what's wrong with it (! overdue). Hover a row and tick it done; a tick is undoable from Done." },
    { at: [21.4, 28.2, 56.2, 29.2], title: "Home",
      text: "The four things to do first, chosen by due date, size and kind. The date marker on a row says where its date came from — nothing on this board is guessed silently." },
    { at: [20.8, 86.3, 57.6, 10.3], title: "Ask",
      text: "Press Space and type. On a class page the question is about that class; on an open assignment it's about that assignment. \"Add chem quiz Friday\" adds it. \"Teacher said…\" is the fastest way in." },
    { at: [93.3, 8.3, 5.4, 4], title: "Make it yours",
      text: "Settings: rename classes, set short codes, colours and periods, pick the pattern and its colour, choose what each part of the page shows. Press ? anywhere for the keys." },
  ];
  const $ = (s) => document.querySelector(s);
  const shot = $("#shot"), hole = $("#hole"), card = $("#tcard"), route = $("#stops");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let i = 0, timer = null;

  route.innerHTML = STEPS.map((s, n) => `<li><button type="button" data-go="${n}">
      <span class="stop" aria-hidden="true"></span><span class="lbl">${s.title}</span></button></li>`).join("")
    + `<svg class="rbus" viewBox="-11 1 130 95" aria-hidden="true"><use href="#bus-body"/></svg>`;
  const bus = route.querySelector(".rbus");

  function place() {
    const s = STEPS[i];
    const [l, t, w, h] = s.at;
    Object.assign(hole.style, { left: l + "%", top: t + "%", width: w + "%", height: h + "%" });
    /* The card sits below the hole when there is room, else above it, else
       beside it — the extension's rule. On a narrow screen it is not over the
       picture at all (CSS puts it underneath), so there is nothing to place. */
    const W = shot.clientWidth, H = shot.clientHeight;
    if (getComputedStyle(card).position !== "absolute") { card.style.left = card.style.top = ""; return; }
    const r = { left: l / 100 * W, top: t / 100 * H, width: w / 100 * W, height: h / 100 * H };
    const cw = card.offsetWidth, ch = card.offsetHeight, pad = 14;
    let left = Math.min(Math.max(pad, r.left), W - cw - pad);
    let top = r.top + r.height + pad;
    if (top + ch > H - pad) top = r.top - ch - pad;
    if (top < pad) {
      top = Math.max(pad, Math.min(H - ch - pad, r.top));
      left = r.left + r.width + pad + cw <= W - pad ? r.left + r.width + pad : Math.max(pad, r.left - cw - pad);
    }
    card.style.left = left + "px"; card.style.top = top + "px";
  }

  function show(n) {
    i = (n + STEPS.length) % STEPS.length;
    const s = STEPS[i];
    $("#tc-kick").textContent = `${i + 1} of ${STEPS.length}`;
    $("#tc-title").textContent = s.title;
    $("#tc-text").textContent = s.text;
    $("#tc-back").disabled = i === 0;
    $("#tc-next").textContent = i === STEPS.length - 1 ? "Done ✓" : "Next ›";
    route.querySelectorAll("button").forEach((b, k) => {
      b.classList.toggle("on", k === i); b.classList.toggle("past", k < i);
      b.setAttribute("aria-current", k === i ? "step" : "false");
    });
    const stop = route.querySelectorAll(".stop")[i];
    const rb = route.getBoundingClientRect(), sb = stop.getBoundingClientRect();
    bus.style.transform = `translateX(${sb.left + sb.width / 2 - rb.left}px)`;
    route.style.setProperty("--done", String(i / (STEPS.length - 1)));
    card.classList.remove("swap"); void card.offsetWidth; if (!still) card.classList.add("swap");
    place();
  }

  function next() {
    if (i === STEPS.length - 1) { stop(); document.getElementById("end").scrollIntoView({ behavior: still ? "auto" : "smooth" }); return; }
    show(i + 1);
  }
  function play() {
    if (timer) { stop(); return; }
    $("#tc-play").textContent = "Pause"; $("#tc-play").setAttribute("aria-pressed", "true");
    timer = setInterval(() => { if (i === STEPS.length - 1) { stop(); return; } show(i + 1); }, 5200);
  }
  function stop() {
    clearInterval(timer); timer = null;
    $("#tc-play").textContent = "Play"; $("#tc-play").setAttribute("aria-pressed", "false");
  }

  $("#tc-next").addEventListener("click", () => { stop(); next(); });
  $("#tc-back").addEventListener("click", () => { stop(); show(i - 1); });
  $("#tc-play").addEventListener("click", () => { if (!timer && i === STEPS.length - 1) show(0); play(); });
  route.addEventListener("click", (e) => { const b = e.target.closest("[data-go]"); if (b) { stop(); show(+b.dataset.go); } });
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea")) return;
    const box = $("#tour").getBoundingClientRect();
    if (box.bottom < 0 || box.top > innerHeight) return;   // only while the stage is on screen
    if (e.key === "ArrowRight") { e.preventDefault(); stop(); next(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); stop(); show(i - 1); }
    else if (e.key === " ") { e.preventDefault(); play(); }
    else if (e.key === "Escape") stop();
  });
  addEventListener("resize", () => show(i));
  const img = shot.querySelector("img");
  if (img.complete) show(0); else img.addEventListener("load", () => show(0));
  show(0);
})();
