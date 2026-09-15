# sillybusai-site

The public web page for the **Silly Bus AI** Chrome extension, served by GitHub
Pages. Plain HTML and CSS — no build step, no dependencies.

| File | What it is |
| --- | --- |
| `privacy.html` | The privacy policy. **The Chrome Web Store listing requires this URL**, so the path must not change once the store listing points at it. |
| `index.html` | Landing page; will carry the install link and the pilot signup. |
| `style.css` | Shared styling, light and dark. |

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
