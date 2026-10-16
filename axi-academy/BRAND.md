# Axi Iraq / Axi Academy — Motion Brand Reference

Source of truth: `Axi-Iraq_Brand_Guidelines` (v1, Sep 2026, 66 pp). Supersedes the earlier spec-deck notes.
Axi Academy (أكاديمية آكسي) is a program under Axi Iraq; presenter = **Asmaa (أسماء)**.

## Language
- On-screen text: **Arabic only (Modern Standard, simplified — «الفصحى البيضاء»)**, RTL.
- English only for trading tokens: pair symbols (EUR/USD, XAU/USD, BTC/USD), terms in parentheses on first appearance — `الهامش (Margin)`, `وقف الخسارة (Stop Loss)` — units (`pip`, `$500`, `14%`), and the tagline `Trade Your Edge`.
- Numbers: Western digits 0–9 in the Latin font, even inside Arabic. Never Eastern-Arabic digits in prices/percent/tables.
- Never a full English sentence mixed into an Arabic line. No English ALL CAPS inside Arabic sentences.
- Naming: «آكسي العراق» / «Axi Iraq» / «آكسي» (with madda). Academy: «أكاديمية آكسي».

## Colors (70 · 20 · 10)
70% light neutrals · 20% darks + text · ≤10% red. Mint is data/gains only.
| Token | Hex |
|---|---|
| AXI RED · PRIMARY | `#E4002E` (action, warning, identity; **loss/down in charts**) |
| CORAL RED | `#FF3745` |
| MINT TEAL · GAINS | `#5EE0BB` (gain/up only — never "traditional" green) |
| OFF WHITE | `#F9F9F9` · WHITE `#FFFFFF` |
| FROSTED STEEL | `#EEF0F1` · SILVER MIST `#C4C8CC` · COOL CONCRETE `#939699` |
| CHARCOAL SLATE | `#626466` · GRAPHITE `#393B40` · CARBON `#242528` · ECLIPSE BLACK `#090A0D` |

Gradients — **vertical only**, light top → dark bottom (or reverse on section openers). No diagonal/radial. Red never inside a gradient (only flat elements on top).
- Primary dark `#EEF0F1 → #607880` · mid `→ #95A8B1` · light `→ #B5C8CD`
- Tertiary dark `#171819 → #0B0D0D`
- Text on gradient: white on dark half, black on light half. No colored text on gradients.

Approved text/bg pairs: ink/off-white, ink/frosted-steel, white/eclipse, white/axi-red, white/slate-green, ink/mint, teal/carbon (data), red/off-white (accent word). **Avoid white on concrete.**
**Red-word rule:** in a headline, only one word (or two adjacent) may be red. Never color numbers red except losses.

## Typography
| Role | Font | Size @1080 | LH |
|---|---|---|---|
| Display headline / covers | **Rabar 018 Light** | 96–120 px | 1.25 |
| Sub-headline | Rabar 017 Regular | 48–56 px | 1.35 |
| Body | Rabar 017 Regular | 28–32 px | 1.7 |
| Caption | Rabar 017 Regular | 20–22 px | 1.5 |
| Hero number | Axi Font Regular → **Inter** | 200–320 px | 1.0 |
| Button / emphasis word / table head | Rabar 016 Bold | 28 px | 1.0 |
- Arabic tracking 0 always. Latin headlines −1.5%, Latin captions +4%.
- Right-aligned (or centered for short headlines). Headline ≤5 words/line; text ≤70 chars/line.
- No kashida, no italic/oblique, no justify on short text, no synthetic weights. Diacritics only where needed for disambiguation.

## Logo & X mark
- **Client rule (Oct 2026): never use the X mark on its own.** Wherever an X would close, sign or mark a video (closing sting, watermark, end mark, big decorative X), use the **Axi Iraq logo (axi / العراق)** instead. Official file: `brand/AxiIraq_Logo_Stacked_Ink.webp` (ink on white; recolor to white on dark or gradient). Videos already delivered stay as they are.
- Arabic material → stacked **axi / العراق** (العراق in Rabar Bold, weight-matched). Never re-typeset; use the official file.
- Logo colors: ink on light (default), white on dark/gradient/red. Red logo on white = logo-only cases.
- Placement (RTL): logo **top-right** inside margin; closing element (logo or CTA) **bottom-left**. Logo centered only on covers/openers.
- Clear space = X height (2 stroke units). Min 120 px digital.
- **X mark**: never shown with the full logo in the same element — **except video: logo opens, X closes.** Never flipped, rotated in 2D, recolored, outlined, glowed, gap closed, or retyped.
- 3D X (hero): matte white top face, depth ¼ unit, grey-green sides, single light top-right, soft shadow. No chrome/gold/reflections. Motion: slow rotation around ONE vertical axis, or drop-and-settle with slight bounce. Never bends/flips/morphs.
- X pattern: ≤18% opacity on light, ≤12% on dark; never behind small text. X bullet: 0.7× cap height, red, half-letter gap before text.

## Video & Reels rules (page 44)
| Element | Rule |
|---|---|
| Open | Axi Iraq logo, **white on primary gradient, 1.5 s**, with identity sound |
| Close | **Axi Iraq logo sting centered** (not the X), then CTA screen with red pill button |
| Watermark | White **Axi Iraq logo** (not the X), **60% opacity, bottom-left**, at least the 120 px minimum logo width, whole video |
| Subtitles | Rabar Regular, white, **4% of frame height**, max 2 lines, centered, on semi-transparent strip in the lower third, above platform UI |
| Safe zones | **15% bottom, 10% top** free of important text |
| Disclosure | Risk-warning strip in the **last 3 s** of every promotional video |
| Presenter | Palette clothing (white/black/grey) + **one red element**; Axi studio grey background; no other logos/gradients in frame |

## Layout (16:9 — 1920×1080)
- Margins 4% horizontal (5% for vertical/square). 12 columns. Text block 60–70% of width, never full width.
- Red corner triangles = focus marks: ~1% of layout width (≈26 px), bottom corners, 40 px from margin, max 4.
- Core patterns: Big Headline · Hero Number · Highlight Quote (dark card, red key words) · Data Card (pair, price, mint/red change) · Portrait + Message.

## Components
| Component | Spec |
|---|---|
| Light glass card | `rgba(255,255,255,.22)`, blur 22, border white 55%, one chamfered corner 44 px |
| Dark glass card | `rgba(20,22,26,.72)`, blur 22, border white 25%, radius 18 |
| CTA pill | `#E4002E`, white Rabar Bold 30 px, height 72, full pill. Secondary = white w/ grey outline |
| Triangles | 26 px, two bottom corners, 40 px inset |
| Disclosure strip | white 92% or black 75%, text 20 px, avatar 64 px |
| Background candles | white, 35–50% opacity, no color, only behind text |

## Imagery
- Personas: **Asmaa** (academy presenter — cream blazer, beige hijab, red phone/laptop, cool grey studio), Saeed (black jacket, red phone), Aisha (white coat, red phone). Never more than one persona per piece, except Academy (Asmaa + learner).
- Landscapes: lone small figure in a vast desaturated (−30–40%) cool scene — Tigris at dusk, Erbil skyline, Zagros, marshes, western desert. No landmarks/flags/politics.
- 3D instruments (silver/white, one red allowed): Forex = silver coins, Stocks = cards, Gold/Silver = ingots, Oil/Indices/Crypto = material objects. One hero object or three max.

## Voice
Clear · Confident · Respectful · Local. Short sentences, one idea, term explained.
- Academy line: «تعلّم ثم تعلّم ثم تدرّب ثم تداول.»
- Tagline: «تداول بميزتك» · Trade Your Edge (never «تداول حافتك»).
- Teaching example: «الرافعة المالية تمنحك حجماً أكبر بهامش أصغر، وتضاعف المخاطر بالقدر نفسه.»

## Compliance
Banned: ربح مضمون · بلا مخاطر · دخل ثابت · مضاعفة رأس المال · توصية مؤكدة · إشارة 100% · لا تخسر أبداً · «مرخّص في العراق» (unless verified) · any numeric return promise.
Standard risk strip (Arabic, pending legal):
> تنطوي عقود الفروقات والمنتجات المشتقة خارج البورصة على مخاطر عالية قد تؤدي إلى خسارة رأس المال. المحتوى التعليمي والتحليلي لا يُعدّ نصيحة استثمارية. قد لا يكون هذا المحتوى متاحاً في منطقتك. يُرجى الرجوع إلى شروط الخدمة.

Risk line height ≥2% of frame.

## Pre-publish checklist
Logo official + correct color + clear space · logo top-right, right size · Axi Iraq logo, never the X on its own · Rabar real weights, numbers in Latin font · red <10%, mint = gains only · name spelled «آكسي العراق» / «Axi Iraq» · no banned words, risk strip present · imagery per rules · Arabic proofread · format/size correct.

## Assets needed from client
`AxiIraq_Logo_Stacked_[Ink|White|Red].svg` · `AxiIraq_X_[Red|Ink|White].svg` · `Rabar_016/017/018.ttf` · `AxiIraq_Ident_Open` / `AxiIraq_Sting_X` (MOV/MP4 + sound) · Asmaa studio photos/footage.
