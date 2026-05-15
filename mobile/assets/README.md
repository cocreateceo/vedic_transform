# Mobile assets

Expo expects the following PNG files in this folder (paths referenced in
`app.json`). Drop replacements here with these exact names — no code changes
needed.

| File | Size | Purpose |
|---|---|---|
| `icon.png` | 1024×1024 | App icon (iOS) |
| `adaptive-icon.png` | 1024×1024 | Android adaptive icon foreground (background colour is set in `app.json` to `#FF9933` saffron) |
| `splash-icon.png` | ~1200×1200 transparent center | Splash logo (rendered on `#FFFEF5` cream background) |
| `favicon.png` | 48×48 | Web preview favicon |

The web app already has app icons under `../public/icons/` — generate these
mobile sizes from the same source artwork. Both stores will reject
placeholder assets, so this is required before submission.

For a quick scratch build the script `scripts/generate-icons.js` at the repo
root knows how to produce favicons from a master image; extending it to also
emit these mobile sizes is one option.
