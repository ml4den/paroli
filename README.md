# Bulgarian Passphrase Generator

A dependency-free, single-page passphrase generator using the existing Bulgarian
dictionary in `public/wordlist.txt`. Passphrases are generated in the browser
with `crypto.getRandomValues`; no generated text is sent to a server.

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