# Reel · 30 s · 1080×1920 · Instagram — beat sheet

Read `../BRIEF.md` first (brand, type, Arabic rules, safe zone, verified facts).

## Concept — «الزاوية المقطوعة» / The cut corner

The brand's signature is the **chamfer**: the 45° cut corner of the SELECT tag. In this film the red chamfered
shape is the one element that survives every cut. It is a candle body, then the stem of the "1" in $1,000,000,
the needle of the Edge gauge, the rider on the stage ladder, the slash of the % sign, and finally it lands as the SELECT
tag in the lockup. Every boundary is a **match cut on shape or motion**, hit on the music's grid. Black ground, white
type, one red. Premium and institutional, never crypto-bro (no cash stacks, no neon green, no profit promises).

Rejected alternatives (named so the choice is visible): (b) one continuous camera dive through a single candle into the
program, more elegant but slower to hook; (c) the before/after split (own money vs funded), clearer but static.

## Music grid (locked)

`../audio/reel_music.wav`: 128 BPM, beat **b = 0.46875 s**, bar **1.875 s**, 16 bars = 30.000 s.
`../audio/reel_beats.json` has the exact downbeats, sections and hits. Bars start at
0 · 1.875 · 3.75 · 5.625 · 7.5 · 9.375 · 11.25 · 13.125 · 15 · 16.875 · 18.75 · 20.625 · 22.5 · 24.375 · 26.25 · 28.125.
Sections: intro (0–1.875, silence gap 1.758–1.875) · DROP A (1.875–13.125) · REST (13.125–15) · DROP B (15–26.25) ·
STACCATO stabs on 26.25 / 26.719 / 27.188 / 27.656 · END hit 28.125.
**Every cut and landing below is on a beat or half-beat of this grid.** Put the times in one table at the top of the comp.

## Beat sheet

`t · beat · what moves · what is still · what carries into the next`

| t | beat | picture | carry → next |
|---|---|---|---|
| 0.00–1.875 | HOOK (riser) | Black, the red tick dot-grid barely visible. Blurred candle charts (`chart_wide_blur`, `chart_c`) drift slowly at two depths. One **red chamfered candle** rises from below centre (spring), wick ticking. Words land right→left by word (`wordRise`), Alexandria 800 ~96 px, y≈520: «عندك» 0.12 · «مهارة» 0.35 (red) · «بالتداول؟» 0.59; line 2, y≈640, grey→white: «ليش» 0.94 · «بس» 1.17 · «بفلوسك؟» 1.41. Camera: slow chase up the candle with a hand float. 1.758: everything but the candle cuts to black (the gap). | the candle |
| 1.875 | DROP · match cut 1 | The candle body **morphs** (`morphRect`) into the red stem of the "1" while «$1,000,000» slams in around it (Geist 300, ~190 px, white, the 1 red), `impact` squash, `shake`. Zeros roll as an odometer 1.875→2.70 and lock. Above, «Axi تموّلك لحد» (wordRise 2.03). Below in small caps grey: `UP TO $1M FUNDING`. | the last 0 |
| 2.81–3.75 | hold, then push | Dead still 2.81–3.28. 3.28: `zoomThrough` into the last «0» — its ring becomes the rim of `coin_silver`. | the coin |
| 3.75–5.625 | FREE (bar 3) | Coin centred, flipping on each beat (rotateY via scaleX, deterministic). Staccato phrases, each replacing the last with a red `///` slash wipe sweeping right→left: «بدون تحدّي.» 3.75 · «بدون رسوم.» 4.22 · «الانضمام» 4.69 + «مجاني» 4.92 (red, 150 px). 5.16: the coin turns edge-on into a thin silver line. | the thin line |
| 5.625–7.5 | YOUR OWN ACCOUNT (bar 4) | The line becomes the top edge of the frame as the camera tilts down onto `man_phone` (cutout) rising into place; «تتداول من» 5.86 · «حسابك الحقيقي» 6.09 (red «الحقيقي»). 6.56: camera **pushes into his red phone** (`zoomThrough`) until the phone screen fills the frame at 7.5. | the phone screen |
| 7.5–9.375 | EDGE SCORE (bar 5) | The phone screen is a chamfered dark UI card (`#111`, red corner brackets like deck p7): header «درجة Edge» 7.6; a ring gauge whose red arc sweeps 0→90 while a Geist counter rolls (7.5→8.6); three labels pop on beats: «المهارة» 7.97 · «المخاطرة» 8.44 · «الثبات» 8.91. | the red arc |
| 9.375–13.125 | THE LADDER (bars 6–7, burst) | Match cut: the red arc **straightens** into a vertical red rail. Six chamfered stage cards stacked up the rail; the camera whips up card to card (`expoInOut` keys landing before each hit) and a red ▲ rider hops to each (`hop` + `impact`). Hold lengths vary: التأسيس `$5K` `0%` 9.375 · الحضانة `$20K` `40%` 9.84 · التسارع `$100K` `50%` 10.31 · برو `$200K` `60%` 11.02 · برو 500 `$500K` `70%` 11.48 · **برو مليون `$1M` `80%` 12.19 (biggest, holds to 13.125)**. Each card: Arabic name right (Alexandria 700), funding left (Geist), share in red. | — (bare cut into the rest, on the downbeat; list 13.125 in `__meta.cuts`) |
| 13.125–15.0 | REST (bar 8) | `desert_dunes` full-bleed, the tiny lone figure. **Dead still.** One quiet line wordRises at 13.30 and then nothing moves: «كل مرحلة… تمويل أكبر.» (IBM Plex Arabic 500, 54 px, white, y≈1080). 14.53–15.0: the camera starts to push toward the horizon with the riser. | the horizon line |
| 15.0–16.875 | DROP B · 80% | The horizon line becomes the underline of a huge «80%» (Geist 300, ~330 px), the % slash in red; `impact` + `shake` on 15.0. «لحد» above, «من الأرباح إلك» below (wordRise on 15.23 / 15.47). | the 0 of 80 |
| 16.875–18.75 | MONTHLY | The «0» drops into a chamfered calendar tile that flips to «01» (popIn + a flip on 16.875); «تنزل أرباحك» 17.11 · «أول كل شهر» 17.34. Hold. 18.28: the tile slides right and becomes the red laptop screen of the next shot. | the red laptop |
| 18.75–20.625 | TOOLS | `woman_red_laptop` cutout lands (the laptop lines up with the tile). Two-tone headline in the deck's p6 style, one word per beat, white with red key words: «أدوات» 18.75 · «تدريب» 19.22 · «تعليم» 19.69 · «كوتشينغ» 20.16. | the headline block |
| 20.625–24.375 | THREE STEPS (bars 12–13) | The headline block collapses into a chamfered pill, and the camera pulls out to `billboard_trading` (airport): the pill sits on the billboard. Three numbered pills slide in right→left on the billboard face: «١ افتح حساب» 20.625 · «٢ ارفع درجة Edge» 21.56 · «٣ اصعد المراحل» 22.5. 23.44: «Trade Your Edge» (Geist 500, white, red underline drawn right→left). | the red underline |
| 24.375–26.25 | GOLD → TAG | The underline sweeps into `xag_bars` (gold XAU over silver XAG), which turns once (scale/rotate); 25.31: the gold bar's chamfered silhouette **morphs** into a solid red SELECT-tag shape (the cut-corner rectangle) that fills the frame centre by 26.25. | the red tag plate |
| 26.25–28.125 | STACCATO (bar 15) | Four hard cuts on the stabs, the tag plate behind each word, alternating red plate / black ground: «افتح.» 26.25 · «تداول.» 26.719 · «اطلع.» 27.188 · «تموّل.» 27.656. Alexandria 900, ~170 px. | the tag plate |
| 28.125–30.0 | END CARD | The plate shrinks into the lockup's SELECT tag while `logo_a`, `logo_x`, `logo_i` drop in (`letterDrop` with squash, stagger 0.055) — full lockup centred at y≈760, ~760 px wide. 28.6: «Trade Your Edge» (Geist 400, 44 px). 28.85: a red pill CTA «سجّل مجاناً · axi.com». 29.0: risk line (IBM Plex 400, 26 px, grey, y≈1210): «التداول ينطوي على مخاطر عالية وقد تخسر رأس مالك.» **Dead still from 29.1.** The last frame mirrors the first (black, red chamfer centre) so the reel loops. | — |

## Craft notes

- Shot lengths range 0.23 s (staccato) → 1.875 s (rest): CV well above 0.25. Two dead-still windows (2.81–3.28, 13.3–14.53) and the end hold.
- The camera is one `OM.camera` with keys; add a hand float everywhere except the rests, `OM.shake` on 1.875, 9.375, 12.19, 15.0, 18.75, 26.25, 28.125.
- All key text and the CTA inside x 90–990, y 280–1240 (Instagram overlay). Imagery may bleed.
- Arabic: word-level animation only, entrances right→left. Mixed Arabic/Latin lines via separate spans or `<bdi>`.
- Fast moves are welcome (render.py's shutter blurs them). Define `__motion` (camera screenTravel + tracked boxes) and
  `__track` (screen boxes for: candle, number, coin, phone, gauge, rider, tile, plate, logo) and `__meta.inFrame`.
- Export `window.__events()` → `{T: 30, events: [{t, kind, pan, v}]}` with kinds `whoosh` (camera moves, slides),
  `impact` (match cuts, landings), `tick` (counter, staccato), `roll` (odometer), `glitch` (slash wipes). These drive the SFX layer.
- No particles, no confetti. Deterministic. Images: `<img>` with `decode()` pushed to the pending list.
