(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }, { threshold: 0.18 });
  $$(".reveal, .reveal-stagger, .reason, .pilot").forEach((el) => io.observe(el));

  /* ---------- convergence stage ---------- */
  const stage = $("#convergence");
  if (stage) {
    const chips = $$(".chip", stage);
    const slots = $$(".slot", stage);
    let timers = [];
    const clear = () => { timers.forEach(clearTimeout); timers = []; };
    const later = (fn, ms) => timers.push(setTimeout(fn, reduce ? 0 : ms));

    const scatter = () => {
      const w = stage.clientWidth, h = stage.clientHeight;
      const narrow = w < 720;
      chips.forEach((c, i) => {
        const cw = c.offsetWidth, ch = c.offsetHeight;
        const zoneW = narrow ? w : w * 0.55, zoneH = narrow ? h * 0.48 : h;
        let x, y;
        if (narrow) {
          x = 12 + Math.random() * Math.max(0, zoneW - cw - 24);
          y = 14 + i * ((zoneH - ch - 28) / (chips.length - 1));
        } else {
          const col = i % 2, row = Math.floor(i / 2);
          x = 16 + col * (zoneW - cw - 32) + (Math.random() - 0.5) * 40;
          y = 20 + row * ((zoneH - ch - 40) / 2) + (Math.random() - 0.5) * 30;
        }
        c.style.setProperty("--x", `${Math.max(8, Math.min(zoneW - cw - 8, x))}px`);
        c.style.setProperty("--y", `${Math.max(8, Math.min(zoneH - ch - 8, y))}px`);
        c.style.setProperty("--r", `${(Math.random() - 0.5) * 10}deg`);
        c.style.width = "";
        c.classList.remove("landed");
        c.style.opacity = "1";
      });
    };

    const land = () => {
      const sr = stage.getBoundingClientRect();
      chips.forEach((c, i) => {
        const s = slots[i].getBoundingClientRect();
        later(() => {
          c.style.setProperty("--tx", `${s.left - sr.left}px`);
          c.style.setProperty("--ty", `${s.top - sr.top}px`);
          c.style.width = `${s.width}px`;
          c.classList.add("landed");
          slots[i].classList.add("filled");
        }, i * 140);
      });
      later(() => stage.classList.add("done"), chips.length * 140 + 1200);
    };

    const play = () => {
      clear();
      stage.classList.remove("play", "done");
      slots.forEach((s) => s.classList.remove("filled"));
      scatter();
      later(() => { stage.classList.add("play"); land(); }, 1100);
    };

    scatter();
    chips.forEach((c) => (c.style.opacity = "0"));
    let started = false;
    const start = () => { if (started) return; started = true; so.disconnect(); removeEventListener("scroll", peek); play(); };
    const so = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) start(); }, { threshold: 0.45 });
    so.observe(stage);
    const peek = () => { const r = stage.getBoundingClientRect(); if (r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.3) start(); };
    addEventListener("scroll", peek, { passive: true });
    setTimeout(peek, 600);
    $(".replay", stage).addEventListener("click", play);
  }

  /* ---------- the bus follows the route as you scroll ---------- */
  const route = $("#route");
  if (route && !reduce) {
    const bus = $("#route-bus"), prog = $("#route-progress");
    const steps = $$(".steps li", route);
    const tick = () => {
      const r = route.getBoundingClientRect();
      const vh = innerHeight;
      const p = Math.max(0, Math.min(1, (vh * 0.8 - r.top) / (r.height + vh * 0.25)));
      prog.style.width = `${p * 100}%`;
      bus.style.left = `${p * 100}%`;
      steps.forEach((li, i) => li.classList.toggle("hit", p >= (i + 0.5) / steps.length - 0.02));
    };
    addEventListener("scroll", tick, { passive: true });
    addEventListener("resize", tick);
    tick();
  }

  /* ---------- cursor-aware surfaces ---------- */
  $$(".reason").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
  const pilot = $("#pilot-card");
  if (pilot) {
    pilot.addEventListener("pointermove", (e) => {
      const r = pilot.getBoundingClientRect();
      pilot.style.setProperty("--px", `${((e.clientX - r.left) / r.width - 0.5) * 60}%`);
      pilot.style.setProperty("--py", `${((e.clientY - r.top) / r.height - 0.5) * 60}%`);
    });
  }
  if (!reduce) {
    $$(".btn").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        b.style.transform = `translate(${dx * 6}px, ${dy * 6}px)`;
      });
      b.addEventListener("pointerleave", () => (b.style.transform = ""));
    });
  }

  /* ---------- sparkle burst ---------- */
  const canvas = $("#burst");
  const ctx = canvas.getContext("2d");
  let parts = [], raf = 0;
  const fit = () => { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); };
  fit(); addEventListener("resize", fit);
  const star = (x, y, r) => {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4, rr = i % 2 ? r * 0.38 : r;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
  };
  const frame = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const now = performance.now();
    parts = parts.filter((p) => now - p.t0 < p.life);
    for (const p of parts) {
      const k = (now - p.t0) / p.life;
      p.vy += 0.22; p.x += p.vx; p.y += p.vy; p.rot += p.spin;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.globalAlpha = 1 - k * k; ctx.fillStyle = p.color;
      star(0, 0, p.r * (1 - k * 0.4)); ctx.fill(); ctx.restore();
    }
    raf = parts.length ? requestAnimationFrame(frame) : 0;
  };
  const burst = (x, y, n = 30) => {
    if (reduce) return;
    const colors = ["#E8A317", "#E8A317", "#c98b12", "#878787", "#1a1a17"];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = 3 + Math.random() * 7;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, r: 3 + Math.random() * 6, rot: Math.random() * 3, spin: (Math.random() - 0.5) * 0.3, color: colors[i % colors.length], t0: performance.now(), life: 700 + Math.random() * 600 });
    }
    if (!raf) raf = requestAnimationFrame(frame);
  };
  $$("[data-burst]").forEach((el) => el.addEventListener("pointerdown", (e) => burst(e.clientX, e.clientY)));
  const mark = $("#hero-mark");
  if (mark) mark.addEventListener("click", (e) => {
    burst(e.clientX, e.clientY, 44);
    mark.style.animation = "none"; mark.offsetHeight; mark.style.animation = "";
  });
})();
