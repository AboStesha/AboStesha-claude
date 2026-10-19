# Pocket

Personal income/expense tracker for iPhone. Dark glass UI, works offline, data stays on the phone.

- Multiple wallets; every payment is **+ income** or **− expense** with a note.
- Enter amounts in **USD, IQD or TRY**; everything totals in USD.
- Update the IQD/TRY market rates weekly in Settings. Each payment keeps the rate it was saved with.
- Backup: Settings → Export / Import (JSON).

## Install on iPhone
1. Host this folder on any HTTPS static host (e.g. GitHub Pages).
2. Open the URL in Safari → Share → **Add to Home Screen**.
3. Open it once while online; after that it works offline.

No build step. Bump `CACHE` in `sw.js` when you change files so the phone picks up the update.
