/* The guide: search, one-section chips, and an index that follows the scroll.
   The page is complete without this file — it only filters what is there. */
(() => {
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const secs = $$(".gsec"), feats = $$(".feat"), q = $("#q");
  let only = null;

  $("#chips").innerHTML = `<button type="button" class="gchip on" data-sec="">All</button>`
    + secs.map((s) => `<button type="button" class="gchip" data-sec="${s.id}">${s.dataset.title}</button>`).join("");
  $("#gindex").innerHTML = secs.map((s) => `<a href="#${s.id}" data-sec="${s.id}">${s.dataset.title}</a>`).join("");

  const text = (el) => el.textContent.toLowerCase().replace(/\s+/g, " ");
  const words = new Map(feats.map((f) => [f, text(f)]));
  const keysText = text($("#keys"));

  function apply() {
    const terms = q.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const s of secs) {
      const inScope = !only || s.id === only;
      let any = false;
      const list = s.querySelectorAll(".feat");
      if (!list.length) {                      // the keys section has no cards
        any = inScope && terms.every((t) => keysText.includes(t));
      }
      list.forEach((f) => {
        const hit = inScope && terms.every((t) => words.get(f).includes(t));
        f.hidden = !hit;
        if (hit) { any = true; shown++; }
        /* open the details that hold the match, so the reason it matched is on screen */
        const d = f.querySelector("details");
        if (d && terms.length) d.open = hit && terms.some((t) => text(d).includes(t) && !text(f.querySelector("h3")).includes(t) && !text(f.querySelector("p")).includes(t));
      });
      s.hidden = !any;
    }
    $("#count").textContent = terms.length || only ? `${shown} of ${feats.length}` : `${feats.length} features`;
    $("#empty").hidden = secs.some((s) => !s.hidden);
    $$(".gchip").forEach((c) => c.classList.toggle("on", (c.dataset.sec || null) === only));
    try { history.replaceState(null, "", q.value ? `?q=${encodeURIComponent(q.value)}` : location.pathname + location.hash); } catch (e) {}
  }

  q.addEventListener("input", apply);
  $("#chips").addEventListener("click", (e) => {
    const c = e.target.closest(".gchip"); if (!c) return;
    only = c.dataset.sec || null; apply();
    if (only) $("#tools").scrollIntoView({ block: "start" });
  });
  $("#clear").addEventListener("click", () => { q.value = ""; only = null; apply(); q.focus(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== q) { e.preventDefault(); q.focus(); }
    else if (e.key === "Escape" && document.activeElement === q) { q.value = ""; apply(); q.blur(); }
  });

  /* the index lights the section you are reading */
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) {
      $$("#gindex a").forEach((a) => a.classList.toggle("on", a.dataset.sec === en.target.id));
    }
  }, { rootMargin: "-30% 0px -60% 0px" });
  secs.forEach((s) => io.observe(s));

  /* a card that is linked to (guide.html#focus-pin) flashes once when you land */
  const flash = () => { const el = location.hash && document.getElementById(location.hash.slice(1));
    if (el && el.classList.contains("feat")) { el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); } };
  addEventListener("hashchange", flash);

  const pre = new URLSearchParams(location.search).get("q");
  if (pre) q.value = pre;
  apply(); flash();
})();
