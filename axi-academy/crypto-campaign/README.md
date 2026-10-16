# Axi Iraq: Buy Crypto campaign (five videos)

This is a five-video social campaign for Axi's new **Buy Crypto** feature: buy real crypto on the spot market and keep it in the **Axi Wallet**.

- **Format:** vertical 1080×1920 at 60 fps, in Arabic (simplified MSA). Tickers, numbers and product names stay in Latin script.
- **Sound:** every video has synthesised music and sound effects. The voice-over and the presenter footage are added later from `SCRIPTS.md`; the music already dips in those windows.
- **Brand:** the official Axi Iraq logo, never the X on its own.

`SCRIPTS.md` holds the strategy, research and sources, hooks, scripts with timecodes, post captions and the presenter brief.

| File | Length | Style | Hook → CTA |
|---|---|---|---|
| `AxiIraq_BuyCrypto_01_Own_15s.mp4` | 15 s | Kinetic type and a 3D silver coin on the dark stage; trap at 140 BPM; music-led | «تتداول على سعرها… أم تملكها؟» → «امتلك أول عملة لك» |
| `AxiIraq_BuyCrypto_02_Wallet_20s.mp4` | 20 s | Glassmorphism on Axi's steel: coins fly into the Axi Wallet, which sits beside the trading account behind a locked divider; ambient glass at 96 BPM | «أين تُحفظ عملاتك؟» → «افتح محفظة آكسي» |
| `AxiIraq_BuyCrypto_03_3Steps_30s.mp4` | 30 s | SaaS product film: a phone with a stylised Arabic Axi app, step headers and annotation callouts; tech-house at 122 BPM | «من رصيدك… إلى أول عملة رقمية» → «حمّل تطبيق آكسي» |
| `AxiIraq_BuyCrypto_04_3Ways_45s.mp4` | 45 s | Explainer in dark glass infographics: Buy Crypto vs CFDs vs Perpetuals, then one account; explainer bed at 105 BPM | «مستثمر… أم متداول؟» → «اختر طريقتك الآن» |
| `AxiIraq_BuyCrypto_05_QA_40s.mp4` | 40 s | Presenter in a moving glass window, questions as glass cards, answers as stickers; light pop at 100 BPM. Grey stand-in where the presenter goes. | «5 أسئلة قبل أن تشتري أول عملة رقمية» → «اكتب سؤالك في التعليقات» |

For compositing video 5, there are also:

- `…_05_QA_40s_GREEN.mp4`: key green inside the window, with the music.
- `…_05_QA_40s_MATTE.mp4`: the window's shape, white on black.
- `AxiIraq_BuyCrypto_05_QA_window_track.csv`: the window's position for every frame.

`stills/preview.jpg` shows key frames of all five.

## Content and compliance

- **Facts.** Every fact on screen comes from Axi's Buy Crypto page or its launch coverage (sources in `SCRIPTS.md`): 200+ coins · 1:1 ownership · Axi Wallet, segregated from the trading account · card / bank transfer / Axi balance · no extra KYC for existing clients · commission-free deposits · 0.8% commission · 24/7 · live order book.
- **Not claimed:**
  - external wallet transfers, which Axi says are coming soon;
  - leverage figures;
  - profit or returns.
- **Numbers are illustrative.** Prices, balances and amounts are examples and are marked «أرقام توضيحية».
- **No risk strip, at the client's request.** `../BRAND.md` asks for one, and crypto promotions usually need one, so compliance should sign off. Also confirm that Buy Crypto (AxiTrader LLC) is available to Axi Iraq clients.
- **Brand:**
  - Red only as flat accents: the CTA pill, one headline word, progress marks and losses.
  - Mint only for rising prices and gains.
  - Gradients vertical only.
  - Crypto drawn as silver/white material coins with tickers, not coin brand logos.
  - Axi Iraq watermark bottom-left at 60%.
  - Screens are stylised mock-ups, not screenshots of the Axi app.

## Audio

`audio/score.py` builds one bed per video on its own tempo, with a sound for every on-screen action:

| Video | Music | Sound design |
|---|---|---|
| 1 | Dark trap, 140 BPM, 808 bass | The drop lands when the price line collapses into the coin; an impact on each fact; coin «ching»; count-up ticks; the lock |
| 2 | Ambient glass, 96 BPM | Glass clinks as the coins land; a slide and a lock for «منفصلة»; pops for buy, sell and store |
| 3 | Tech-house, 122 BPM | Taps, keypad, sheets, screen pushes, list scroll, toast, the purchase chime |
| 4 | Explainer bed, 105 BPM | The card deal, swings, a tick per spec row, a chime for «حساب واحد» |
| 5 | Light pop, 100 BPM | Window moves, question cards, sticker pops, typing dots |

- **Ducking:** the voice and presenter windows are pre-ducked: −5 dB for videos 2–4 and −7 dB for video 5, with a 1–3 kHz dip. Video 1 is music-led and not ducked.
- **Mastering:** each bed is band-limited to 17 kHz and mastered to −17 LUFS with a true peak at or below −1.3 dBTP.
- **Delivered beds:** `audio/bed_c1.wav` … `bed_c5.wav`.

## QA

Every delivered file was checked after its final render.

- **Streams:** 1080×1920 at a constant 60 fps; H.264 High, yuv420p, BT.709 (TV range); AAC stereo at 48 kHz, about 320 kb/s. The matte has no audio.
- **Every frame:** each film was viewed frame by frame on per-second contact sheets (`qa/<file>_s<N>.jpg`, 60 frames each), with the last frame at full size (`qa/<file>_last.png`); streams and loudness are in `qa/<file>_qa.json`.
- **Pops:** a frame-difference scan looked for one-frame jumps. The jumps left are intended: film 1's impact flash, its beat cut and the 199→200 count; film 3's keypad presses; and the CTA pill's pump on the beat.
- **Loudness:** measured, not listened to.

| Video | Length | Frames | Size | Loudness | True peak |
|---|---|---|---|---|---|
| 1 | 15 s | 900 | 11.8 MB | −17.1 LUFS | −1.7 dBTP |
| 2 | 20 s | 1200 | 14.0 MB | −17.1 LUFS | −1.6 dBTP |
| 3 | 30 s | 1800 | 18.8 MB | −17.1 LUFS | −1.5 dBTP |
| 4 | 45 s | 2700 | 27.8 MB | −17.1 LUFS | −1.6 dBTP |
| 5 | 40 s | 2400 | 17.0 MB | −17.0 LUFS | −1.6 dBTP |
| 5 GREEN | 40 s | 2400 | 14.4 MB | −17.0 LUFS | −1.6 dBTP |
| 5 MATTE | 40 s | 2400 | 0.3 MB | no audio | – |

Fixed during QA, before delivery:

- **The frost cut** swapped frames at its midpoint, which made a visible jump into the end card. It now dissolves through the frost. This affected films 2, 4 and 5.
- **Film 3's screen transitions** let the phone's black glass show through, and three of them popped. Every push is now an opaque slide-over. The return to the home screen got its own back transition and whoosh.
- **The «تداول بميزتك» tagline** on the light end cards of films 2 and 5 measured about 2:1 contrast. It is now carbon, about 7:1.
- **The CTA pill's pulse** ran on the shared kit's 128 BPM, so it drifted off the music on every end card. It now pumps every two beats of each film's own tempo.

**Video 5's compositing files** were checked against `AxiIraq_BuyCrypto_05_QA_window_track.csv` on 13 sample frames, including frames mid-move and in the fade-out:

- **MATTE:** the white window matches the CSV rectangle to within 1 px. During the fade (36.6–37.0 s), its grey level follows the CSV `opacity`.
- **GREEN:** the key inside the window reads RGB 0/175/63, which is #00B140 after video encoding (within 2 levels), whenever the window is fully visible.
- **Length:** both files are 2400 frames, frame for frame with the preview film.
- **Review:** GREEN was viewed on 2-second contact sheets (every other frame). MATTE was checked numerically: solid white inside the window on every frame until the fade, then black.

## Files

| Path | Contents |
|---|---|
| `src/cc.js` | Campaign kit: 3D silver coins with engraved tickers, line icons, glass chips, kinetic type, phone and Axi app mock-up pieces, the presenter window, the end card |
| `src/c1.js` … `src/c5.js` | The five films, `draw(ctx, t)`, each on its own beat grid |
| `src/kit.js`, `src/glass.js` | Shared kit and glass engine (from `../axi-claude-mcp/`): type, logo, frosted panels, stages, cuts |
| `src/index.html` | Renders a film: `?film=c1` … `c5`, `?mode=green|matte` for film 5, `?t=` for one frame, `?play` to preview |
| `tools/render.mjs` | Renders and encodes: `node tools/render.mjs --film c3 --frames 1800 --audio audio/bed_c3.wav --out out.mp4 --crf 16 [--query mode=green] [--only 3]`. `--only` re-renders just the listed worker segments and reuses the rest from `--work`. |
| `qa/` | Per-second contact sheets, last frames and stream and loudness records for each delivered film |
| `stills/preview.jpg` | Key frames of all five films |
| `tools/still.mjs`, `tools/sheet.py`, `tools/qa.py`, `tools/track.mjs` | Stills, contact sheets, QA (streams, loudness, every frame on per-second sheets), the film 5 window track |
| `audio/score.py`, `audio/synthkit.py` | Music and sound design: `python score.py c1…c5 out.wav` |
| `SCRIPTS.md` | Campaign plan, research and sources, scripts, captions, presenter brief |
