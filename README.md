# Bulgarian Passphrase Generator

A dependency-free, single-page passphrase generator using the existing Bulgarian
dictionary in `public/wordlist.txt`. Passphrases are generated in the browser
with `crypto.getRandomValues`; no generated text is sent to a server.

The Romanized view uses the BGN/PCGN letter mappings, including `ъ → a`,
`ь → y`, and `щ → sht`.

## Run locally

Serve the project directory with any static file server. With Python:

```sh
python -m http.server 5000
```

Then open `http://localhost:5000`. The app has no package manifest or
third-party runtime dependencies.