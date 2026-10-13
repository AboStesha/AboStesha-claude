# Axi Academy — Lesson 16: التحليل الأساسي مقابل التحليل الفني

Motion-graphics explainer built from code, frame-locked to the lesson voice-over.

- `Lesson16_Fundamental_vs_Technical.mp4` — final video, 1920×1080, 60 fps, 252.1 s, AAC 320 kbps, −16 LUFS.
- `PROMPT.md` — the reference prompt adapted to this lesson (direction, structure, sound, storyboard with timings).
- `src/` — renderer: `engine.js` (inks, pencil lines, hatching, type, brand marks), `film.js` (director, HUD, components),
  `scenes1-3.js` (the 23 scenes), `words.js` (word timings).
- `audio/synth.py` — procedural 100 BPM score + SFX, side-chained under the narration; `sfx.json` / `sections.json` are exported from the timeline.
- `tools/` — `align_words.py` (word timing), `preview.mjs` (contact sheets), `export_events.mjs`, `render.mjs` (parallel Chromium → ffmpeg).

## Rebuild
```bash
cd tools && npm i playwright-core            # Chromium at /opt/pw-browsers
node export_events.mjs                        # sfx.json + sections.json
python audio/synth.py voice.wav audio/sfx.json audio/sections.json mix.wav
node render.mjs --fps 60 --workers 3 --audio mix.wav --out final.mp4
```
Preview any moment: open `src/index.html?t=120.5` (or `?play=1&from=90`).

## Notes
- Logo and X mark are the official vectors extracted from the Axi Iraq guideline PDF.
- Rabar 016/017/018 are not publicly available here; **Readex Pro** (closest geometric match) stands in.
  Drop the Rabar `.woff2/.ttf` files into `assets/fonts/` and point the `AR` faces in `src/index.html` at them to swap.
- Narration timing: Whisper-small phrase transcription + energy-snapped word estimates (`tools/words.json`).
