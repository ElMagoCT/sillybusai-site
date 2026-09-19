# Chrome Web Store listing — draft copy

Paste these into the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
when you're ready to submit. Requires a one-time $5 registration fee on your own
Google account — I can't create that account or pay that fee for you.

## Store listing tab

**Title** (max 45 chars)
```
Silly Bus AI — Homework Dashboard
```

**Summary** (max 132 chars, shows in search results)
```
Every assignment from Canvas, Veracross, and teacher docs — one prioritized board, inside Chrome. Nothing uploaded.
```

**Category:** Productivity (or Education, if Chrome offers it in your account — pick whichever the dashboard lists; Education fits better if available)

**Language:** English (United States)

**Detailed description:**
```
Silly Bus AI reads your homework, grades, and schedule straight from the
sources your teachers already use — and turns them into one board of what's
actually due, instead of five browser tabs.

WHAT IT READS
• Canvas — courses, assignments, due dates, grades
• Your school's Veracross portal — schedule and grades
• Google Docs your teachers share — syllabi and weekly plans, so work
  assigned in a document doesn't get missed
• AP Classroom — assignments and progress checks (never the questions)
• Albert.io — assigned practice sets and due dates (never the questions)

It reads all of this using the sign-ins you already have in Chrome. It never
asks for your school password and never signs in on your behalf.

RUNS ON YOUR COMPUTER
Silly Bus AI is a Chrome extension, not a service. Your assignments and
grades are stored in your browser's own storage. Nothing is uploaded, there's
no account to create, and no server ever sees your schoolwork.

AN AI ASSISTANT, IF YOU WANT ONE
Ask it what to prioritize, or what a rubric is asking for. It's off until you
add your own Anthropic API key in Settings — only what you ask is sent to
Anthropic, billed to your own account.

BUILT BY A STUDENT
Made by a high school senior who uses it on his own course load every day.

Full privacy policy: https://sillybusai.com/privacy.html
```

## Privacy practices tab

- **Single purpose description:**
  ```
  Reads a student's assignments, grades, and schedule from Canvas and related
  school sites the student is already signed into, and displays them as one
  prioritized dashboard inside the browser.
  ```
- **Justify each permission** (the dashboard asks per-permission — copy the matching row from `privacy.html`'s permission table):
  - `storage` → save settings (AI key, class feed address) locally
  - `scripting` → run the AP Classroom / Albert.io reader scripts, nowhere else
  - host permissions (`*.instructure.com`, `*.veracross.com`, `docs.google.com`, `apclassroom.collegeboard.org`, `www.albert.io` + their API subdomains, `api.anthropic.com`) → read assignments/grades from each site the student is signed into; `api.anthropic.com` only when the student has added their own key
- **Data usage disclosure:** you'll need to check the boxes matching what's true — based on the current build, that's "does not collect user data" for anything that reaches a server *you* control (nothing does). Reads of Canvas/Veracross/Docs/AP Classroom/Albert.io content stay on-device; only AI-assistant questions leave the device, and they go straight to Anthropic, not to you.
- **Privacy policy URL:**
  ```
  https://sillybusai.com/privacy.html
  ```
  (or `https://elmagoct.github.io/sillybusai-site/privacy.html` until the custom domain is connected — see README.md)

## Graphics you still need to make/upload

The dashboard requires these; I didn't generate them because they need real
screenshots of the actual dashboard UI, not the marketing site:

| Asset | Size | Notes |
| --- | --- | --- |
| Store icon | 128×128 PNG | ✅ ready — `assets/img/icon-128.png` in this repo |
| Screenshots | 1280×800 or 640×400 PNG/JPEG, 1–5 of them | Take these from the real extension — the board, a class page, the AI assistant |
| Small promo tile | 440×280 | Optional but recommended; ask me to design one once you've picked screenshots |
| Marquee promo tile | 1400×560 | Optional, only needed if you want a featured placement |

## Before you submit

- [ ] Domain `sillybusai.com` pointed at this site (see `README.md`) so the privacy policy URL is stable
- [ ] `manifest.json` version matches what you're uploading (`extension/pack.sh` output)
- [ ] Screenshots taken from a real signed-in session with any personal info blurred
- [ ] Decide public vs. "unlisted" visibility in the dashboard — public is what the CLAUDE.md notes say you already chose
