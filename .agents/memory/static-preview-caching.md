---
name: Static preview caching
description: Distinguishing a stale preview capture from an incorrect static server response
---

A preview capture can show an earlier HTML/CSS version even when the server is
already serving the current files.

**Why:** During a redesign, a root-page capture showed the previous interface
after a successful workflow restart; a direct HTTP response contained the new
markup. A unique page query and versioned asset URLs showed the current design,
which was also confirmed in a fresh browser session.

**How to apply:** Compare the served HTML with the visible page before changing
workflow configuration. Use a fresh browser or unique query to verify suspected
caching; refresh changed asset URLs when delivering a substantial visual update.
