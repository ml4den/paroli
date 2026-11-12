# Bulgarian Passphrase Generator

The interface is in Bulgarian, since the generated phrases are built from
Bulgarian words. UI labels below are given in English for reference.

A dependency-free, single-page passphrase generator using the existing Bulgarian
dictionary in `public/wordlist.txt`. Passphrases are generated in the browser
with `crypto.getRandomValues`; no generated text is sent to a server.
Choose **Fixed separator** or **Random characters** explicitly. Random mode picks
one character independently at every gap, including before an appended number.
Switching modes preserves the current words and number, as well as both separator
settings. Only the active separator setting affects the phrase.

**Add a number** reveals its configurable 1–12 digit length (no leading zero).
Turning it off preserves the selected length. **More options** contains capitalization
and summarizes the selected style when collapsed. Opening or closing it never changes
or regenerates the phrase.
Generator preferences are saved in browser storage and restored on the next visit;
generated passphrases themselves are not saved.
Older saved preferences are migrated automatically: the old Advanced open state
determines the initial separator mode, and the saved number length is preserved
even if Advanced was closed. Missing or invalid lengths default to two digits.
New visitors start with a fixed hyphen separator. Invalid active inputs show an
error and disable copying until corrected; blocked browser storage shows a warning
but does not prevent local generation.

The Romanized view uses the BGN/PCGN letter mappings, including `х → h`,
`ъ → a`, `ь → y`, and `щ → sht`.

Appearance follows the system setting by default. Use the theme control to
switch between System, Light, and Dark; the choice is saved in this browser.

## Run locally

Serve the project directory with any static file server. With Python:

```sh
python -m http.server 5000
```

Then open `http://localhost:5000`. The app has no package manifest or
third-party runtime dependencies.

## Check the controls

With the static server running and Chromium installed:

```sh
node tests/browser-controls.mjs
```

The dependency-free browser checks cover independent controls, preference
migration, error recovery, reloads, and mobile/desktop light and dark layouts.
Set `TEST_URL` to test another server or `CHROMIUM_PATH` to select Chromium.