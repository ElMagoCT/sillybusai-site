# sillybusai-site

The public web page for the **Silly Bus AI** Chrome extension, served by GitHub
Pages. Plain HTML and CSS — no build step, no dependencies.

| File | What it is |
| --- | --- |
| `privacy.html` | The privacy policy. **The Chrome Web Store listing requires this URL**, so the path must not change once the store listing points at it. |
| `index.html` | Landing page. Deliberately light on words: a hero the bus drives into, a "five sources → one board" animation, three reasons, three steps with a bus that follows your scroll, and the pilot signup (a pre-filled GitHub issue, no email collection). |
| `app.js` | The motion: scroll reveals, the convergence stage, the scroll-driven route, cursor-aware cards, sparkle bursts. Vanilla, ~150 lines, everything respects `prefers-reduced-motion`. |
| `style.css` | Shared styling, light and dark. Fraunces for headings, Inter for everything else. |
| `404.html` | "Wrong stop." GitHub Pages serves it for missing paths. |
| `assets/img/logo.svg` | The wide logo — bus with a **B** cut-out (was an F-like glyph before 2026-09-19), sparkle, gray-to-gold gradient. |
| `assets/img/icon-square.svg` | Same mark with equal top/bottom padding — the source for every favicon/app-icon PNG in `assets/img/`. Regenerate with `qlmanage -t -s 1024` then `sips -z`. |
| `assets/img/og-1200x630.png` | Social-share image, rendered from `webstore/promo/src/og-1200x630.html`. |
| `webstore/` | The complete Chrome Web Store submission kit — see its own README. |
| `releases.json` | Feeds the version badge in the nav and the "What's new" list. **Generated** — after each app release run `python3 tools/sync-release.py` (reads `~/sillybus-ai/VERSION` and the `## x.y.z.w — date — title` headings of its `CHANGELOG.md`) and commit the result. The app repo is private, so the page cannot read it live. |

The bus artwork is inlined once in `index.html` as SVG `<defs>` (`#bus-full`, `#bus-body`,
`#sparkle-shape`) and reused with `<use>`, so the logo, the stage bus, the route bus and
the pilot-card bus are one drawing. Change the mark in `logo.svg` **and** in those defs.

## Preview locally

```bash
cd ~/Documents/Workspace/sillybusai-site && python3 -m http.server 8744
```

Then open <http://localhost:8744>. Chrome caches `app.js`/`style.css` from this server
aggressively; hard-reload (⇧⌘R) after editing them.

Edit a file, commit, push — Pages republishes on its own, usually within a minute.

## The custom domain

`sillybusai.com` is registered but not pointed here yet. To connect it: add a
`CNAME` file containing the bare domain, then at the registrar create a `CNAME`
record for `www` → `elmagoct.github.io` and four `A` records for the apex domain
pointing at GitHub's Pages addresses. After that the privacy URL becomes
`https://sillybusai.com/privacy.html` and the Web Store listing should be updated
to match.

## Keeping the policy true

The policy describes what the extension actually does in version 0.19: everything
runs locally; AP Classroom is read by a content script that leaves College Board's
token on College Board's site; and the only outbound traffic is to
`api.anthropic.com` using the student's own API key. **If that changes — in particular if model calls are routed
through a server so one shared key can be metered — this page has to be updated
before that version ships**, because it would mean questions passing through a
server we operate.
