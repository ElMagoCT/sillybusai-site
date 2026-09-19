# Web Store submission kit

Everything for the Chrome Web Store listing, in one folder. Submitting needs
your own Google account and the one-time $5 developer registration — I can't
do that part, so this is the box of parts.

| Path | What it is | Where it goes |
| --- | --- | --- |
| `listing.md` | Title, summary, description, single-purpose statement, permission justifications, data-usage answers | Paste into the dashboard field by field |
| `icons/icon128.png` | Store icon | "Store icon" upload. **Also** copy `icons/icon16.png`, `icon48.png`, `icon128.png` over `extension/icon*.png` in the app repo so the installed extension carries the new B logo — bump `VERSION` when you do |
| `screenshots/*.png` | 1280×800 screenshots | "Screenshots" — the store shows them in order, `01-` first |
| `promo/small-440x280.png` | Small promo tile | "Small promo tile" (required for public listings) |
| `promo/marquee-1400x560.png` | Marquee tile | "Marquee promo tile" (only used if Google features the listing) |
| `promo/large-920x680.png` | Large tile | Legacy slot; upload if the dashboard still shows it |
| `logo/` | The logo in wide, square and 512px forms | Reuse anywhere else you need the mark |

## About the screenshots

| File | Shows |
| --- | --- |
| `01-board-1280x800.png` | The dashboard — every class, tonight's four, chat |
| `02-class-page-1280x800.png` | A class opened full-screen (AP Chemistry) — open work, grade breakdown, textbook, links |
| `03-settings-1280x800.png` | Settings › Appearance — "Everything here stays on this computer" |
| `04-dark-board-1280x800.png` | The dashboard in the dark theme |

They are rendered from the **Hearth · Studio design mockup** in
`~/sillybus-ai/mockups` (the board the real UI is being built to match), with
its sample senior-year data — so they say "Hello Micah". They are honest to the
design but are not captures of a live signed-in session. Swap them for real
captures whenever you want — same 1280×800 size, personal info blurred.

## Regenerating the promo tiles

The tiles are plain HTML in `promo/src/`. Edit the copy or CSS there, then:

```bash
./webstore/promo/render.sh
```

It uses the Chrome already on this Mac in headless mode — nothing to install.
