# C1 «٥ أشياء افهمها قبل أول صفقة» — production assets

**Status:** design-final draft · **BLOCKED FOR PUBLISHING** until the approved Arabic risk text replaces the dashed placeholder on slide 8 (by design — the placeholder is visibly unfinished so it cannot slip out).
**Slides:** c1-s1..s8.png, 2160×2700 (4:5), render at 2× from `c1-template.html`.
**Caption + hashtags:** file 06, C1 SOCIAL section. **Publish:** Tue 1 Sept, 19:00 Baghdad.

## Pending swaps (when brand guideline file arrives)
- Exact brand HEX values → CSS `:root` tokens (one-line swaps)
- Typeset `axi` wordmark → official logo SVG
- Slide 8: approved Arabic risk text into `.risk` box

## Re-render
```
chromium --headless --no-sandbox --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=1080,1437 --virtual-time-budget=4000 \
  --screenshot=c1-sN.png "file://<path>/c1-template.html?slide=N"
# crop to 2160x2700 (this chromium build adds an 87px chrome band at scale 1)
```
Fonts: IBM Plex Sans Arabic in `../fonts/` (referenced relatively).

## Kurdish edition (after translation returns)
Duplicate template → replace text nodes with approved Sorani copy → glyph QA (ە ڵ ڕ ێ ۆ) → line-length re-fit (+10–20%) → CTA must be learn-only (KRI rule, file 02 §A1) → re-render.

## Design notes
Education family per file 09: cream base, red chips ١–٥, dark slide 7 (golden rule), red split finale. Diagrams are HTML/CSS (Arabic inside SVG <text> breaks — lesson learned; keep labels in HTML).
