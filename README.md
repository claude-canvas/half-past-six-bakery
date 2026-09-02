# Half Past Six

A single-page site for a small neighbourhood bakery. Static HTML, CSS and a little
JavaScript — no build step, no dependencies.

The schedule on the homepage highlights whichever bake is next based on the
visitor's clock, and updates once a minute.

## Files

- `index.html` — the page
- `styles.css` — all styling
- `script.js` — highlights the next bake in the schedule

## Running locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Deploying

Static, so it deploys as-is on Vercel with no build command and no output
directory.
