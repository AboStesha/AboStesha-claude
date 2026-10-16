# Axi Academy — two social ads (9:16, 15 s)

These are vertical ads for Reels, TikTok and Stories: 1080×1920 at 60 fps, 15 s each (900 frames).

- **Sound:** music and sound effects only. The client records the voice-over from `VO_SCRIPT.md`, and the music already dips in those voice windows.
- **Language:** the hook is in Iraqi dialect; details and the call to action are in simplified MSA.
- **Logo:** the academy logo appears early and on the end card.

| File | What it says |
|---|---|
| `AxiAcademy_Ad1_Benefits.mp4` | **«شنو راح تتعلّم؟»**: what a student gets. Hook «تريد تتعلّم **التداول؟** هاي خطّتك الكاملة», then the logo, then six module cards that tick on the beat, then «من الصفر إلى الاحتراف» with the red tip as the full stop, then the X sting and the call to action. |
| `AxiAcademy_Ad2_Offer.mp4` | **The offer**: «إذا تعبت تدوّر… من وين تبدي تتعلّم؟» over an endless search. The red tip drops like a pin: «آكسي لگتلك», then **«الحل»** slams in red on its own line above the nib. Then «وسوّتلك أكاديمية تداول متكاملة» with the six modules, then **«بونص إيداع $50 لأول 10 خريجين»** with ten graduation caps lighting up and «تُطبّق الشروط والأحكام», then the X sting and the call to action. |

## Content and compliance

- **Modules.** The modules shown are the real lesson series in this repo, with no invented claims:

  | Module | Lessons |
  |---|---|
  | Forex basics | 01–02 |
  | Charts and buy/sell prices | 05, 11 |
  | Technical vs fundamental analysis | 16 |
  | Trading strategy | 17 |
  | Before the first deposit: demo account, avoiding mistakes | 18 |
  | Gold series | gold 01–04 |
- **Brand rules** from `../BRAND.md`:
  - Red is limited to the tip, one headline word, the badges and the call-to-action pill.
  - Numbers use Inter; `$50` is never red.
  - The official X watermark sits bottom-left.
  - Text stays out of the top 10% and bottom 15% safe zones.
  - The X sting closes each ad before the call-to-action card with its red pill.
  - The standard risk-warning strip shows for the last 3 seconds.
- **Offer wording.** The offer always appears with «تُطبّق الشروط والأحكام».
- **Logo.** This is the stacked academy mark (nib · axi · ACADEMY), built from the vector lockup measured in `../intro-outro/` and arranged like the client's stacked logo.

## Audio

The soundtrack is synthesised in `audio/score.py` on a 128 BPM grid of 8 bars × 1.875 s = 15 s.

| Ad | Soundtrack |
|---|---|
| Ad 1 | A bright A-major groove. A pluck steps up once for each module card, then a lift into the payoff, the X-sting hit and a closing chord. |
| Ad 2 | Tense D-minor ticking and typing while the search floods. The pin drops into a bright D-major drop, then a half-time build into the **$50** hit with a cash ring, ten rising notes for the ten caps, and the X sting. |

In the voice windows the music is lowered by 5 dB and dipped between 1 and 3 kHz. Each bed is mastered to −17 LUFS with a true peak at or below −1 dBTP. The beds are also delivered as `audio/bed_ad1.wav` and `audio/bed_ad2.wav`.

## QA

Both files are 1080×1920 at 60 fps with 900 frames. Video is H.264 High, yuv420p, BT.709, CRF 16. Audio is AAC, 48 kHz stereo, 320 kb/s.

| File | Size | Loudness | True peak |
|---|---|---|---|
| `AxiAcademy_Ad1_Benefits.mp4` | 11.8 MB | −17.1 LUFS | −1.3 dBTP |
| `AxiAcademy_Ad2_Offer.mp4` | 10.7 MB | −17.1 LUFS | −1.2 dBTP |

Every frame was checked on per-second sheets: `qa/ad1_s0.jpg` … `qa/ad2_s14.jpg`, plus `qa/*_qa.json` and the last frames. The only still holds are the end cards. `stills/preview.jpg` shows five key frames from each ad.

## Files

| Path | Contents |
|---|---|
| `src/kit.js` | Type: Readex Pro for Arabic, Inter for numbers; per-letter Arabic animation; mixed RTL/Latin lines. Also the stacked academy logo as vectors, glass cards, CTA pill, X sting, risk strip, watermark, backgrounds and grain. |
| `src/ad1.js`, `src/ad2.js` | The two films, `draw(ctx, t)`, timed on the shared beat grid. |
| `src/index.html` | Renders a film. Use `?film=ad1&play` to preview, or `?t=` for a single frame. |
| `tools/render.mjs` | Renders the frames and encodes them: `node tools/render.mjs --film ad1 --frames 900 --audio audio/bed_ad1.wav --out out.mp4 --crf 16` |
| `tools/still.mjs`, `tools/sheet.py`, `tools/qa.py` | Stills, contact sheets, and QA (streams, loudness, every frame on per-second sheets in `qa/`). |
| `VO_SCRIPT.md` | The Iraqi-dialect voice-over for both ads, with timecodes and what is on screen at each moment. |
