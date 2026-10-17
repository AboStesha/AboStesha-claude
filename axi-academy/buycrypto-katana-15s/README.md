# Axi Iraq: Buy Crypto, 15 s hyper-edit (Higgsfield Katana)

A 15-second promotional ad for Axi's **Buy Crypto** feature, made with the Higgsfield Katana workflow.

- **Format:** vertical 1080×1920 at 60 fps, 900 frames, in Arabic (MSA). Tickers, numbers and product names stay in Latin script.
- **Built in code:** every shot is code-rendered motion graphics in a 3D product look (silver coins, glass, a phone, light trails). No AI footage or images were generated, so it cost **0 credits**.
- **Sound:** a licensed stock track plus recorded sound effects, mixed on picture. There is no voice-over.

## The idea

The edit remixes the visual grammar of a popular motion-design showreel (the "Loud chrome type showreel" in Fliki's motion-graphics gallery). Only its style was used, no footage. Its trick: **every beat turns one object into the next shot**.

Here the object is one silver BTC coin. It starts by bouncing on a price line ("you watch the price every day…"). It ends locked in the Axi Wallet, and then inside the CTA button.

| # | Time (s) | Shot |
|---|---|---|
| S1 | 0.00–1.29 | A silver BTC coin bounces twice on a live price line; each bounce is a mint up-tick. The coin flips and flies into the lens. «كل يوم تراقب السعر…» |
| S2 | 1.29–2.14 | The drop: a white flash, then «امتلكها» springs out of a red field and throws outline echoes on the next beat. |
| S3 | 2.14–2.57 | «فعلاً» grows from thin to heavy inside a design-tool selection box. |
| S4 | 2.57–3.43 | "1:1" slams in from both sides (ملكية حقيقية لعملتك, then بدون رافعة مالية). The camera dives through the colon's dot. |
| S5 | 3.43–4.29 | "Buy Crypto" decodes out of scrambled glyphs (جديد في آكسي), glitches, then a CRT power-off to a point. |
| S6 | 4.29–6.43 | The point becomes a dot matrix of coin tops. A red ripple runs through it, it tilts into a 3D field of coin stacks pumping on the beat, the hero coin hops across, and a counter runs to 200+ عملة رقمية. |
| S7 | 6.43–8.14 | A wall of real tickers slams in and flips style on each beat. The red anchor row reads محفظة آكسي, and it is the only row left when the wall flies out. |
| S8 | 8.14–9.86 | محفظة آكسي crumbles into dust, which becomes a spinning coin, then a galaxy, then a hyperspace dive into a white flash. |
| S9 | 9.86–11.57 | A recap of six panels: the buy button, 0.8% commission, the coin, the funding methods, 24/7 and the separate wallet. They reshuffle on the beat, then the camera pushes into the wallet panel. |
| S10 | 11.57–12.43 | The Axi Wallet card: the coin drops into its slot and a lock closes (محفوظة في محفظة آكسي · منفصلة عن حساب التداول). |
| S11 | 12.43–15.00 | The Axi Iraq logo builds. The red CTA pill «امتلك أول عملة لك» springs in and the coin lands in it. Below: Buy Crypto · في تطبيق آكسي and تداول بميزتك. |

## Content and compliance

- **Facts on screen** come from the campaign research in `../crypto-campaign/SCRIPTS.md`:
  - 200+ coins
  - 1:1 ownership with no leverage
  - the Axi Wallet, separate from the trading account
  - funding by card, bank transfer or Axi balance
  - 0.8% commission
  - 24/7
- **Illustrative:** the price line.
- **Not claimed:** profits or returns, leverage figures, and external wallet transfers.
- **No risk strip.** This matches the rest of the campaign and the client's instruction. Crypto promotions usually need one, so compliance should sign off.
- **Brand (`../BRAND.md`):**
  - The Axi Iraq logo (axi / العراق) is the watermark at 60%, bottom-left, and the centred end-card logo. The X mark never appears on its own.
  - Red #E4002E is the one accent per shot. The drop card uses the approved white-on-red pair.
  - Mint appears only on the up-ticks.
  - Gradients are vertical only.

## Audio

- **Music:** Mixkit #369 "Need for Speed" (140 BPM), source 12.43–27.43 s, so the drop lands on beat 3 (1.29 s).
  - It is under the Mixkit Stock Music Free License, which covers online and social ads but not TV or radio broadcast.
- **Sound effects:** 41 recorded CC0 sounds from the Katana library, each placed on a picture event. The cue list is in `audio/sfx_cues.json`.
- **Mix:** −14.1 LUFS integrated, −1.4 dBTP true peak, AAC 256 kb/s at 48 kHz. The audio was measured, not listened to.

## QA

The delivered file was checked against the plan:

- **Streams:** 900 frames at a constant 60 fps, 1080×1920; H.264 High, yuv420p, BT.709 (TV range); AAC-LC stereo at 48 kHz, 15.000 s.
- **Every frame:** all 900 frames were viewed on per-second sheets. Two drafts were reviewed the same way before that.
- **Energy against the reference:** cuts per second 3.1× the reference, flashes 1.5×, motion energy 1.9×. The pass mark is 0.6×.
- **Delivered file:** v3, 48.1 MB, on Higgsfield: https://d2ol7oe51mr4n9.cloudfront.net/user_31whQkWWK9m41YEVOr0IugdLlfs/61672fd5-f681-48c8-8626-6322ab728773.mp4

Fixed in review:

- a white flash that covered the first 1.3 s
- a dead fade before the wallet
- a late marquee entrance
- the falling coin crossing the opening line
- a slow CRT effect
- a blown-out galaxy dive, a brightness jump where it starts, and a white flare mid-dive
- a dark wallet entrance

## Files

| Path | Contents |
|---|---|
| `src/index.html` | The page (Katana `hfPage` contract): fonts, motion blur that never crosses a cut, `?t=` to draw one frame |
| `src/film.js` | The film: `draw(ctx, t)` for all 11 shots on the 140 BPM grid |
| `src/lib/` | Copies of the campaign kit (`kit.js`, `glass.js`, `cc.js`) and the Axi Iraq logo paths (`logo.js`) |
| `src/fonts/` | Readex Pro and Inter variable fonts (SIL OFL 1.1, licences included) |
| `audio/sfx_cues.json` | Sound-effect cues, each tied to a picture event |
| `tools/still.mjs`, `tools/render.mjs`, `tools/sheets.py` | Local stills, a frame-accurate render (`node tools/render.mjs --out out.mp4 [--audio mix.m4a]`) and per-second contact sheets |

The music mix and the delivered MP4 live in the Katana workspace and in the Higgsfield result.
