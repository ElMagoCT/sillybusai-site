/* sillybusai.com/account — sign in (Google first, email as a fallback), see
 * this month's AI credits, and hand the sign-in to the Chrome extension.
 *
 * The API is a separate host (api.sillybusai.com, the Netlify account server;
 * this site is GitHub Pages and has no server). The page keeps its token in
 * sessionStorage only, so closing the tab signs this page out; the extension
 * keeps its own copy.
 *
 * Handing over to the extension: the extension lists this site under
 * `externally_connectable`, so this page can message it directly. The
 * Options page opens this page with ?ext=<its id>; without that, the page
 * tries the Web Store copy's id. Nothing is sent until the person presses
 * Connect (or arrived from Options, which is the same request made a click
 * earlier).
 */
"use strict";
(() => {
  /* api.sillybusai.com is the address; sillybus-accounts.netlify.app is the
     same server under Netlify's own name, used if the subdomain cannot be
     reached (before its DNS exists, or while its certificate is being made). */
  const LOCAL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const BASES = LOCAL ? ["http://localhost:8899"] : ["https://api.sillybusai.com", "https://sillybus-accounts.netlify.app"];
  let API = BASES[0];
  const STORE_EXT = "nkglcihnfamdlmkiihoncmikndpmidpa";
  const params = new URLSearchParams(location.search);
  const EXT = /^[a-p]{32}$/.test(params.get("ext") || "") ? params.get("ext") : STORE_EXT;
  const FROM_EXT = params.has("ext");

  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n, d = 0) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
  const utcDay = (ms) => new Date(ms).toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" });
  const ss = { get: (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
               set: (k, v) => { try { v == null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } } };

  let token = ss.get("sb-token");
  let view = null;
  let mode = "login";
  let googleIntent = "signin";     // or "delete"
  let clientId = "";

  async function api(path, { method = "GET", body, auth } = {}) {
    const init = {
      method, cache: "no-store",
      headers: { ...(body ? { "content-type": "application/json" } : {}), ...(auth ? { authorization: `Bearer ${auth}` } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    };
    let res;
    try { res = await fetch(`${API}/api/${path}`, init); }
    catch (err) {                     // unreachable host, not an HTTP error
      const next = BASES[BASES.indexOf(API) + 1];
      if (!next) throw new Error("SillyBus AI's server can't be reached right now");
      API = next;
      res = await fetch(`${API}/api/${path}`, init);
    }
    let data = {};
    try { data = await res.json(); } catch (e) { /* empty */ }
    if (!res.ok) { const err = new Error(data.message || `HTTP ${res.status}`); err.status = res.status; throw err; }
    return data;
  }

  let toastTimer;
  function toast(text) { const el = $("#toast"); el.textContent = text; el.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 2400); }
  const note = (sel, text, bad = false) => { const el = $(sel); el.textContent = text; el.classList.toggle("bad", bad); };

  /* ---------- Google ---------- */
  function loadGoogle() {
    return new Promise((resolve, reject) => {
      if (window.google && google.accounts) return resolve();
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true; s.onload = resolve; s.onerror = () => reject(new Error("Google's sign-in could not load"));
      document.head.appendChild(s);
    });
  }
  async function setupGoogle() {
    try {
      const cfg = await api("config");
      clientId = cfg.google_client_id || "";
      if (cfg.signups === "closed") note("#google-note", "New accounts are paused right now; existing accounts still sign in.");
    } catch (e) { clientId = ""; }
    if (!clientId) {
      $("#google-slot").hidden = true;
      note("#google-note", "Google sign-in isn't switched on yet — use email for now.");
      $("#email-way").open = true;
      return;
    }
    try {
      await loadGoogle();
      google.accounts.id.initialize({ client_id: clientId, callback: onGoogle, auto_select: false, itp_support: true });
      drawGoogle($("#google-slot"), "continue_with");
    } catch (err) { note("#google-note", err.message, true); $("#email-way").open = true; }
  }
  function drawGoogle(el, text) {
    el.innerHTML = "";
    google.accounts.id.renderButton(el, { theme: "outline", size: "large", shape: "pill", text, width: Math.min(360, el.clientWidth || 320) });
  }
  async function onGoogle(response) {
    if (googleIntent === "delete") return deleteWith({ credential: response.credential });
    note("#auth-note", "Signing in…");
    try {
      const r = await api("google", { method: "POST", body: { credential: response.credential } });
      signedIn(r.token);
    } catch (err) { note("#auth-note", err.message, true); }
  }

  /* ---------- email ---------- */
  function setMode(next) {
    mode = next;
    document.querySelectorAll(".acct-tabs button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.mode === mode)));
    $("#auth-go").textContent = { login: "Sign in", signup: "Create account", reset: "Set new password" }[mode];
    $("#code").hidden = mode !== "reset"; $("#code").required = mode === "reset";
    $("#password").placeholder = mode === "login" ? "Password" : "New password (10+ characters)";
    $("#password").autocomplete = mode === "login" ? "current-password" : "new-password";
    note("#auth-note", "");
  }
  document.querySelectorAll(".acct-tabs button").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
  $("#auth-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("#auth-go"); btn.disabled = true; note("#auth-note", "…");
    try {
      const body = { email: $("#email").value.trim(), password: $("#password").value };
      if (mode === "reset") body.code = $("#code").value;
      const r = await api(mode, { method: "POST", body });
      $("#password").value = ""; $("#code").value = "";
      if (r.recovery_code) { $("#recovery-code").textContent = r.recovery_code; $("#recovery").hidden = false; }
      signedIn(r.token);
    } catch (err) { note("#auth-note", err.message, true); }
    finally { btn.disabled = false; }
  });
  $("#recovery-copy").addEventListener("click", async () => { try { await navigator.clipboard.writeText($("#recovery-code").textContent); toast("Copied"); } catch (e) { /* select it */ } });
  $("#recovery-done").addEventListener("click", () => { $("#recovery").hidden = true; $("#recovery-code").textContent = ""; });

  /* ---------- signed in ---------- */
  async function signedIn(t) {
    token = t; ss.set("sb-token", t); note("#auth-note", "");
    await load();
    if (FROM_EXT) connect();          // they came from the extension to do exactly this
  }
  $("#sign-out").addEventListener("click", () => {
    token = null; view = null; ss.set("sb-token", null);
    try { google.accounts.id.disableAutoSelect(); } catch (e) { /* not loaded */ }
    paint();
  });

  async function load() {
    if (!token) return paint();
    try { const r = await api("account", { auth: token }); token = r.token || token; ss.set("sb-token", token); view = r; }
    catch (err) { if (err.status === 401) { token = null; ss.set("sb-token", null); } view = null; }
    paint();
  }

  function paint() {
    $("#auth").hidden = !!view; $("#account").hidden = !view; $("#who").hidden = !view;
    if (!view) return;
    const c = view.credits, total = c.included + c.bonus;
    $("#who-email").textContent = view.email;
    $("#plan-pill").textContent = c.plan_name;
    $("#left").textContent = fmt(c.left, c.left % 1 ? 1 : 0);
    const pct = total ? Math.max(0, Math.min(100, (c.left / total) * 100)) : 0;
    requestAnimationFrame(() => { $("#meter > i").style.width = pct + "%"; });
    $("#meter").classList.toggle("low", pct < 10);
    $("#used").textContent = `${fmt(c.used, 1)} of ${fmt(total)} used · resets ${utcDay(c.resets)}` + (c.bonus ? ` · ${fmt(c.bonus)} bonus` : "");
    const st = $("#ai-state");
    st.hidden = view.ai.enabled && !c.suspended;
    st.textContent = c.suspended ? "AI credits are off for this account." : "The shared AI is paused right now.";
    // Every plan: "Free", the planned price struck through, the buy button
    // present and switched off. Payments exist in the design, not in effect.
    $("#plans").innerHTML = view.plans.map((p) => `
      <div class="acct-plan${p.id === c.plan ? " on" : ""}">
        <div class="acct-plan-name">${esc(p.name)}${p.id === c.plan ? `<span>yours</span>` : ""}</div>
        <div class="acct-price"><b>Free</b>${p.list_price_usd ? `<s>$${fmt(p.list_price_usd)}/mo</s>` : ""}</div>
        <div class="acct-note">${fmt(p.credits)} credits · ≈ ${fmt(p.about.chat)} answers</div>
        ${p.id === c.plan ? "" : view.self_serve_plans
          ? `<button class="btn btn-ghost" type="button" data-plan="${esc(p.id)}">Switch</button>`
          : `<button class="btn btn-ghost acct-off" type="button" disabled tabindex="-1">${p.list_price_usd ? "Upgrade" : "Choose"}</button>`}
      </div>`).join("");
    $("#plans").querySelectorAll("[data-plan]").forEach((b) => b.addEventListener("click", async () => {
      try { await api("account/plan", { method: "POST", auth: token, body: { plan: b.dataset.plan } }); toast("Plan changed"); load(); }
      catch (err) { toast(err.message); }
    }));
    $("#plans-note").textContent = view.self_serve_plans ? "Every plan is free for now — pick any." : "Every plan is free for now.";
    // Delete: a password account confirms with its password, a Google-only
    // account with a fresh Google sign-in.
    $("#delete-form").hidden = !view.has_password;
    $("#delete-google").hidden = view.has_password;
    probeExtension();
  }

  $("#delete-form").addEventListener("submit", (e) => { e.preventDefault(); deleteWith({ password: $("#delete-password").value }); });
  document.querySelector(".acct-danger").addEventListener("toggle", (e) => {
    if (e.target.open && view && !view.has_password && clientId && window.google) {
      googleIntent = "delete";
      drawGoogle($("#delete-google"), "continue_with");
      note("#delete-note", "Confirm with Google to delete.");
    }
    if (!e.target.open) googleIntent = "signin";
  });
  async function deleteWith(body) {
    if (!confirm("Delete this account and its credits? This can't be undone.")) { googleIntent = "signin"; return; }
    try {
      await api("account/delete", { method: "POST", auth: token, body });
      token = null; view = null; ss.set("sb-token", null); paint(); toast("Account deleted");
    } catch (err) { note("#delete-note", err.message, true); }
    googleIntent = "signin";
  }

  /* ---------- the extension ---------- */
  const extApi = () => (window.chrome && chrome.runtime && chrome.runtime.sendMessage) ? chrome.runtime : null;
  function ask(message) {
    return new Promise((resolve) => {
      const rt = extApi();
      if (!rt) return resolve(null);
      try { rt.sendMessage(EXT, message, (reply) => { void chrome.runtime.lastError; resolve(reply || null); }); }
      catch (e) { resolve(null); }
    });
  }
  async function probeExtension() {
    const reply = await ask({ type: "sillybus-ping" });
    $("#ext").hidden = !reply;
    if (reply && reply.email && view && reply.email === view.email) {
      $("#ext-title").textContent = "SillyBus AI in this Chrome uses this account";
      $("#ext-note").textContent = "You're all set.";
      $("#ext-connect").hidden = true;
    }
  }
  async function connect() {
    const reply = await ask({ type: "sillybus-account", token });
    if (reply && reply.ok) {
      $("#ext").hidden = false;
      $("#ext-title").textContent = "Connected";
      $("#ext-note").textContent = FROM_EXT ? "SillyBus AI now uses this account. You can close this tab." : "SillyBus AI now uses this account.";
      $("#ext-connect").hidden = true;
      toast("Connected to SillyBus AI");
    } else if (FROM_EXT) {
      toast(reply && reply.error ? reply.error : "Couldn't reach the extension — open this page from its Options.");
    }
  }
  $("#ext-connect").addEventListener("click", connect);

  setMode("login");
  setupGoogle();
  load();
})();
