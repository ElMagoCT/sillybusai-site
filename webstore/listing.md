# Chrome Web Store listing — copy to paste

Everything below goes into the [Developer Dashboard](https://chrome.google.com/webstore/devconsole).
Fields are in the order the dashboard shows them.

## Store listing

**Title** — 45 chars max
```
Silly Bus AI — Homework Dashboard
```

**Summary** — 132 chars max, shows in search results
```
Every assignment from Canvas, Veracross, and teacher docs — one prioritized board, inside Chrome. Nothing uploaded.
```

**Category:** Education if the dashboard offers it for your account, otherwise Productivity.

**Language:** English (United States)

**Detailed description**
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

FREE DURING THE PILOT
This version is free. Plans (a free tier plus $5 and $10 monthly options
with the AI included) arrive with the public launch — see sillybusai.com.

Privacy policy: https://sillybusai.com/privacy.html
```

## Privacy practices

**Single purpose**
```
Reads a student's assignments, grades, and schedule from Canvas and related
school sites the student is already signed into, and displays them as one
prioritized dashboard inside the browser.
```

**Permission justifications** — the dashboard asks for one per permission.

| Permission | Paste this |
| --- | --- |
| `storage` | Saves the user's settings (their own AI key and class-schedule feed address) locally so they are not re-entered on every visit. |
| `scripting` | Runs the small reader scripts on AP Classroom and Albert.io that collect assignment titles and due dates while the user has those sites open. Used on those two sites and nowhere else. |
| `*.instructure.com` | Reads the user's own courses, assignments and grades from their school's Canvas. Each school has its own Canvas subdomain, so the exact host is not known in advance. |
| `*.veracross.com` | Reads the user's class schedule and grades from their school's Veracross portal. |
| `docs.google.com` | Reads syllabus and planning documents the user's teachers have already shared with them, so work assigned in a document is not missed. |
| `apclassroom.collegeboard.org`, `apc-api-production.collegeboard.org` | Reads the user's AP assignments and progress-check due dates. Assessment questions are never read. |
| `www.albert.io`, `api.albert.io` | Reads the user's assigned Albert.io practice sets and due dates. Question content is never read. |
| `api.anthropic.com` | Sends the user's own questions to the AI assistant, only after they have added their own API key. |

**Remote code:** No.

**Data usage** — tick what is true for this build:
- Does the extension collect personally identifiable information, health, financial, authentication, personal communications, location, web history, user activity, or website content **and send it to you**? **No** to all — nothing reaches a server you operate. Website content (assignments) is read and stored on-device only; AI questions go directly from the user's browser to Anthropic under the user's own key.
- Certify the three disclosures (no sale, no unrelated use, no creditworthiness use) — all true.

**Privacy policy URL**
```
https://sillybusai.com/privacy.html
```

**Published listing:** https://chromewebstore.google.com/detail/silly-bus-ai/nkglcihnfamdlmkiihoncmikndpmidpa

## Distribution

- Visibility: **Public** (your decision on 2026-09-14).
- Regions: all.
- Pricing: free.
