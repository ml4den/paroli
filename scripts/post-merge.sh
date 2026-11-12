#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# This static app has no dependencies to install or database to migrate.
for asset in index.html styles.css app.js public/wordlist.txt; do
  if [[ ! -s "$asset" ]]; then
    printf 'Missing or empty required asset: %s\n' "$asset" >&2
    exit 1
  fi
done

node --check app.js
node --check tests/browser-controls.mjs

printf 'Static app assets and JavaScript syntax verified; no installation needed.\n'
