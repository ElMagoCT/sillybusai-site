# Connecting sillybusai.com — prompt for Claude in Chrome

Have these tabs open and signed in **before** pasting the prompt:

1. **GoDaddy DNS** for the domain — sign in at godaddy.com, then open
   *My Products → sillybusai.com → DNS* (the URL looks like
   `https://dcc.godaddy.com/control/sillybusai.com/dns`).
2. **GitHub Pages settings** for the site repo — signed in as ElMagoCT:
   `https://github.com/ElMagoCT/sillybusai-site/settings/pages`

Then paste everything below the line into Claude in Chrome.

---

I have two tabs open and I'm already signed in to both: GoDaddy's DNS
management page for **sillybusai.com**, and the GitHub Pages settings page
for **ElMagoCT/sillybusai-site**. Connect the domain to the site. Do the
steps in this order — the order matters, because setting the custom domain
on GitHub before DNS exists breaks the current github.io URL.

**Rules:** never type a password or 2FA code — if either site asks you to
sign in again, stop and tell me. Change only the DNS records named below;
leave every other record (especially any MX, TXT or NS records) exactly as
it is. If GoDaddy shows a confirmation or "are you sure" dialog, read it to
me before accepting. Report what you actually see, not what should happen.

**Step 1 — GoDaddy DNS.** In the DNS records table:

- Delete the default parked-domain records if they exist: the `A` record for
  `@` that points at a GoDaddy "Parked" address (something like
  `WebsiteBuilder Site` or an IP starting with `3.33` or `15.197`), and the
  `CNAME` record for `www` pointing at a GoDaddy domain (`…domainconnect…`
  or `sillybusai.com`). Leave any `NS` or `SOA` rows alone.
- Add these four `A` records, each with name `@` and TTL 600 seconds (or the
  smallest GoDaddy offers):
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- Add one `CNAME` record: name `www`, value `elmagoct.github.io`, TTL 600.
- If GoDaddy has a "Forwarding" section for this domain, make sure domain
  forwarding is **off** — we want DNS to answer, not a redirect.
- Save, then read the final records table back to me.

**Step 2 — GitHub Pages.** On the Pages settings tab:

- Under *Custom domain*, enter `sillybusai.com` and click Save. GitHub will
  commit a `CNAME` file to the repo on its own — that is expected.
- Wait for the DNS check under the domain field. It may say "DNS check in
  progress" for a few minutes; reload the page every minute or so, up to
  ten minutes. Tell me when it turns into a green check, or what error it
  shows if it doesn't.
- Once the check passes, tick **Enforce HTTPS**. If the box is greyed out
  with a note that the certificate is still being issued, tell me and stop —
  I'll tick it later; it can take up to an hour.

**Step 3 — Verify.** Open a new tab at `https://sillybusai.com` and another
at `https://www.sillybusai.com`. Tell me whether each loads the Silly Bus AI
page (a gold-and-gray bus logo and the headline "Every class. One board."),
redirects, or errors, and quote any error text exactly.

Don't do anything beyond these three steps.
