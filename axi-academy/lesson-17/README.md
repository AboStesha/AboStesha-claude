# Axi Academy — Lesson 17: استراتيجية التداول

A kinetic-typography explainer in the style of the reference reel. It is built in code with the Axi Iraq brand and frame-locked to the lesson voice-over.

## Files

- `Lesson17_Trading_Strategy.mp4` — the final video: 1920×1080, 60 fps, 293.2 s, AAC 320 kbps, −16 LUFS.
- `Lesson17_preview_1080p30.mp4` — a lighter copy for quick sharing.
- `PROMPT.md` — the reference prompt adapted to this lesson: direction, sound, chapters, and a storyboard with timings.
- `src/` — the renderer:
  - `engine.js` — inks, lines, type and brand marks.
  - `fx.js` — Arabic-safe kinetic words, notes and arrows, rings, transitions, timecode and the chapter timeline.
  - `film.js` — the director, motion blur and HUD.
  - `kit.js` — the red dot, charts, the 3D map plane, cards and particles.
  - `scenes1-3.js` — the 35 scenes.
  - `words.js` — word timings.
- `audio/synth.py` — the procedural 120 BPM score and SFX, side-chained under the narration. `sfx.json` and `sections.json` are exported from the timeline.
- `tools/` — the build scripts:
  - `align_words.py` — word timing.
  - `preview.mjs` — contact sheets.
  - `export_events.mjs` — exports the SFX events and music sections.
  - `render.mjs` — parallel Chromium → ffmpeg render.

## Rebuild

```bash
cd tools && npm i playwright-core            # Chromium at /opt/pw-browsers
node export_events.mjs                        # sfx.json + sections.json
python audio/synth.py voice.wav audio/sfx.json audio/sections.json mix.wav
node render.mjs --fps 60 --workers 3 --audio mix.wav --out final.mp4
```

To preview any moment, open `src/index.html?t=120.5`, or `?play=1&from=90` to play from that point.

## Notes

- **Logo and X mark:** these are the official vectors, extracted from the Axi Iraq guideline PDF.
- **Fonts:** Rabar is not available here, so **Readex Pro** (Arabic) and **Inter** (Latin and numbers) stand in.
- **Example data:** all numbers and charts are illustrative. This applies to the 7/10 ring, the risk percentages and the price paths.
- **Risk strip:** the text is the standard draft from the guidelines and still needs legal review.
