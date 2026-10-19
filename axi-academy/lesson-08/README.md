# Axi Academy — Lesson 08: الهامش (Margin)

Lesson 8 is redone from start to finish as **one continuous shot**, synced word by word to the new voice-over `episode_8_edited.wav`. The voice-over itself is **not included**.

- `Lesson08_Margin.mp4`: 1920×1080, 60 fps, 304.7 s. The soundtrack is **music + sound effects only**, and the music already dips wherever the voice speaks.
- **To add your voice-over:** place the voice file so it starts at **00:00:02.000**, at its original level. Then put a −1 dBTP true-peak limiter on the master.
- **The idea:**
  - the account is a glass tank, and its liquid is the equity;
  - the dark padlocked band at the bottom is the used margin, held by the open trades;
  - free margin is the liquid above the band;
  - margin level is how many bands fit in the liquid.
- **One shot:** the camera never cuts. It flies between stations that stay in the world:
  - tank → broker's vault ↔ rented house → back to the tank;
  - the leverage slider → the board above the tank → the currency station;
  - a whip home → the 100-tank pull-back → the order ticket and lot bar → the board again;
  - the $100 drops into the tank → the platform panel → night (margin call, deposit, rewind, stop out);
  - day (margin level, 200%) → the whole-journey pull-back → recap cards → the red dot → the logo.
- **Music:** a new score, 112 BPM in F minor (Fm9 · Dbmaj7 · Ab · Eb), with glass plucks and a broken kit.
- **Chapters:** ما هو الهامش؟ · المعادلة · عملة الهامش · مثال الرافعة · مثال عملي · نداء الهامش والتصفية · مستوى الهامش · الخلاصة
- **Directing breakdown:** `PROMPT.md` covers the visual architecture, the beat-by-beat redesign, the audio choreography and the post-production checks, with timecodes for every move.
- **Notes:**
  - The visuals follow the corrected script:
    - margin is calculated in the base currency first, then converted to the account currency;
    - margin level is a ratio (equity ÷ used margin × 100), shown with a ruler and the 200% example.
  - Free margin ($900) is shown next to the used margin ($100) and on the platform panel.
  - Margin call at 100%, stop out at 50% and the 100,000-unit standard lot are labelled «قد يختلف حسب الوسيط». The EUR/USD = 1 rate is labelled «مثال افتراضي».
  - The Axi Iraq logo is the only brand mark. The X mark is not used.

## Build

```
python3 tools/build_words_fw.py                     # words.json / src/words.js from the faster-whisper output (tools/fw.json)
node tools/preview.mjs <out_dir> 10 48.5 95.9 ...   # contact sheet of chosen times
node tools/export_events.mjs                        # audio/sfx.json + audio/sections.json
NOVOICE=1 python3 audio/synth.py episode_8_edited.wav audio/sfx.json audio/sections.json mix.wav
node tools/render.mjs --fps 60 --workers 3 --audio mix.wav --out Lesson08_Margin.mp4
```

- `src/l8core.js`: the camera, the day and night worlds, and the props (tank, vault/house, slider, coin, pair, ticket, lot bar, panel, chart, call card, ruler, equation rows).
- `src/l8shot.js`: the timeline, including the key times, camera keys, stations, score and SFX.
- `src/brand.js`: the open (logo → dot) and the close (dot → Axi Iraq logo, motto, pill, risk strip).
