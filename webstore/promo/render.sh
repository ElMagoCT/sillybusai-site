#!/usr/bin/env bash
# Renders every src/<name>-<W>x<H>.html to <name>-<W>x<H>.png at exactly W×H
# using the Chrome already installed on this Mac. No dependencies to install.
set -euo pipefail
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PROFILE="$(mktemp -d)"
for src in src/*.html; do
  name="$(basename "$src" .html)"
  size="${name##*-}"; w="${size%x*}"; h="${size#*x}"
  out="$name.png"; rm -f "$out"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --no-first-run \
    --user-data-dir="$PROFILE" --window-size="$w,$h" --virtual-time-budget=6000 \
    --screenshot="$PWD/$out" "file://$PWD/$src" >/dev/null 2>&1 &
  pid=$!
  for _ in $(seq 1 60); do [ -s "$out" ] && break; sleep 0.5; done
  kill "$pid" 2>/dev/null || true; wait "$pid" 2>/dev/null || true
  [ -s "$out" ] && echo "rendered $out (${w}x${h})" || echo "FAILED $out"
done
rm -rf "$PROFILE"
