# Bulgarian Passphrase Generator

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Everyday Bulgarian speakers and technical power users are equally important.
The primary task is generating and copying a Bulgarian passphrase, with a
balance between speed and customization.

## Product Purpose

Generate random passphrases from the existing Bulgarian dictionary. Provide
Cyrillic and Romanized views of the same phrase.

## Capabilities and Constraints

- A single-page static app with no third-party runtime dependencies or backend API calls.
- Use the existing dictionary and browser cryptographic randomness.
- Preserve the minimum of two words, fixed separators, optional appended random
  numbers, configurable digit count, editable random separator pool, and
  capitalization options.
- Preserve Romanization behavior, including the user's explicit `х → h` rule.
- Show the BGN/PCGN reference link only in the Romanized view.
- Preserve system-aware light/dark appearance with a manual override.
- Keep preferences in browser storage across refreshes; do not store generated
  passphrases.
- A redesign may replace the current visual identity but must preserve working
  behavior.

## Evidence on Hand

The dictionary in `public/wordlist.txt` and the working generator are the source
of real product content. No commercial claims, testimonials, or security
certifications have been supplied.

## Product Principles

- Keep the generated phrase and copying action easy to find.
- Make customization understandable without slowing down basic use.
- Keep generation and preference storage local to the browser.
- Support both writing-system views and both appearance themes consistently.
