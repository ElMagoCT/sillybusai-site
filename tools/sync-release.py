#!/usr/bin/env python3
"""Copy the extension's version and recent changelog headings into releases.json.

The app repo is private, so the public site cannot read it at runtime; run this
after each release instead and commit the result:

    python3 tools/sync-release.py            # reads ~/sillybus-ai
    python3 tools/sync-release.py /path/to/sillybus-ai
"""
import json, pathlib, re, sys

app = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "~/sillybus-ai").expanduser()
site = pathlib.Path(__file__).resolve().parent.parent
version = (app / "VERSION").read_text().strip()

entries = []
for line in (app / "CHANGELOG.md").read_text().splitlines():
    m = re.match(r"^## (\d+(?:\.\d+)+) — (\d{4}-\d{2}-\d{2}) — (.+)$", line)
    if m:
        entries.append({"version": m.group(1), "date": m.group(2), "title": m.group(3).strip()})
    if len(entries) == 8:
        break

out = {"version": version, "released": entries[0]["date"] if entries else None, "history": entries}
(site / "releases.json").write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n")
print(f"releases.json ← v{version}, {len(entries)} entries")
