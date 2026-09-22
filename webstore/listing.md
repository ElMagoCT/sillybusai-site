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

> Rewritten 22 September 2026 after a Chrome Web Store rejection for keyword
> stuffing: "more than 5 brands/tools in the description". Google's fix is to
> name at most five and link the rest. This version names four outside brands
> (Canvas, Veracross, Google Docs, Anthropic) plus Chrome, and sends the rest
> — AP Classroom, Albert.io, AP Central — to https://sillybusai.com/supported.html.
> **Do not add brand names back into this box.** They belong on that page, or
> burned into a promo screenshot.

```
SillyBus AI puts everything you have due on one board, inside the Chrome you
already use — instead of five tabs and a group chat.

WHAT YOU GET
• One board: every assignment, test, reading and project across all your
  classes, in the order they are actually due.
• Every item says where its due date came from, so you can check it against
  the source.
• Class pages: your grade breakdown, a what-if calculator, your open work, and
  links to the syllabus and the homework doc.
• Your daily schedule and calendar.
• A Life page for the things that are yours, not the school's.
• Tick work off as you finish it; a Done page keeps the record.

WHERE IT READS FROM
It reads the places your work actually lives — Canvas, Veracross, and the
Google Docs your teachers share with you — using the sign-ins your Chrome
already has. It never asks for your school password and never signs in on your
behalf.
The full list of supported sites is here: https://sillybusai.com/supported.html

RUNS ON YOUR OWN COMPUTER
This is an extension, not a service. Your assignments and grades are stored in
your own browser. There is no account to create, nothing is uploaded, and no
server of ours ever sees your schoolwork.

AN AI ASSISTANT, IF YOU WANT ONE
Ask it what to do first, or what a rubric is really asking for. It stays off
until you add your own Anthropic API key in Settings — only what you ask is
sent, billed to your own account.

BUILT BY A STUDENT
Made by a high school senior who runs it on his own course load every day.

FREE DURING THE PILOT
This version is free. Paid plans with the AI included arrive at the public
launch — see sillybusai.com.

SillyBus AI is an independent project and is not affiliated with any school or
with the sites it reads.

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
