# 09 — Instagram Grid Architecture & Design System (AR + KU)

## 1. Grid principle: modular categories, not puzzle grids
No physically-connected posts. Instead: 5 recognizable **card families**, each with a fixed cover system, alternating in a fixed weekly rhythm. Cohesion comes from repetition of the families; freshness comes from what's inside them.

| Family (pillar) | Cover system | Base look |
|---|---|---|
| MARKET (recaps/data) | dark charcoal card, big number/«الأسبوع بدقيقة» wordmark, red sparkline | dark |
| EDUCATION (carousels) | **cover = red diagonal split + giant cream numeral bleeding the edge** (grid stopping-power); interior slides cream with red chips + thin-line diagrams | red cover / cream inside |
| HUMAN / CAMPAIGN | photography-first, minimal type, «عن دراية» red-underline mark when campaign | photo |
| AXI (brand/product) | Axi red diagonal-split (the brand device from the deck), cream wordmark | red |
| VIDEO (reels) | cinematic still + left-third headline panel (thumbnail system §5) | photo+panel |

### September grid map (month-end view, newest first, 3 columns RTL-read)
```
Row 1:  HV5 عقل المتداول (VID·dark)   | C5 ٥ أخطاء (EDU·dark var)   | REC4 (MKT)
Row 2:  POR2 من دفترها (HUM)          | HV4 أهل السوق (HUM·VID)     | C4 الرافعة (EDU)
Row 3:  REC3 (MKT)                    | POR1 (HUM·camp)             | HV3 الأسئلة الصح (VID·camp)
Row 4:  C3 ٥ أسئلة (EDU·camp)         | ANN عن دراية launch (CAMP)  | REC2 (MKT)
Row 5:  HV2 الانضباط يُموَّل (AXI)      | C2 التكاليف (EDU)           | REC1 (MKT)
Row 6:  HV1 الأسواق تتكلم (VID)        | C1 ٥ أشياء (EDU)            | …أغسطس
```
No two same-family tiles sit adjacent in any row — the fixed weekly rhythm (Mon carousel / Wed reel / Sat recap + campaign extras) produces this automatically. Keep the rhythm and the grid stays intentional forever.

## 2. Visual hierarchy & graphic system
- **Hierarchy per card:** 1 idea → 1 dominant element (number, face, or 3–5-word headline) → 1 support line → brand mark. Nothing else.
- **Brand devices (from the deck):** diagonal red split; outlined giant `axi` as background texture (≤8% opacity); cream-on-red / red-on-cream duality; Axi Select dark+neon reserved for Select content only.
- **Color tokens** (names now, exact HEX from the guideline file when provided — Missing Info #1): `axi-red`, `axi-crimson`, `cream`, `charcoal`, `white`; data accents: `up-green`/`down-red` used ONLY at small scale on data elements (never as card backgrounds — avoids casino wash).
- **Texture rule:** photography warm and natural; graphics flat with one soft shadow level; no gradients except the brand split; no stock-glow charts.

## 3. Typography (the load-bearing decision)
- **Latin/brand:** per Axi guidelines `[pending file]`.
- **Arabic:** one family for everything, two weights. Recommended: **IBM Plex Sans Arabic** (free license, premium-neutral, excellent numerals) — swap only if the official guidelines name a licensed Arabic brand font. Display size for hooks, text size for education.
- **Kurdish (Sorani, Arabic script):** SAME family IF glyph QA passes — test string: «ڕێگە، ورد، ھەڵە، ئێوارە، گۆڕان، چاڤ، ژیان، ڤیدیۆ، ە» — if any glyph fails, Kurdish uses **Noto Sans Arabic** (full coverage) at matched optical size. Never mix families within one asset.
- **Numerals rule:** Western digits (1234) for ALL data — prices, %, dates, times (matches platforms and sources). Arabic-Indic (١٢٣٤) allowed only in editorial headlines/numerals-as-design (e.g., carousel covers «٥»). Never mixed inside one line.
- **Type scale (9:16):** hook 64–80pt equivalent · support 36–44 · caption/source 24–28 · legal 20 minimum (legible on phone).

## 4. Story templates (built once, week of Aug 24)
1. **نبض السوق** (pulse): charcoal, instrument name top-right, big price center, arrow + % badge, sparkline, source/timestamp strip, disclaimer strip. Number/arrow animation preset.
2. **إغلاق الأسبوع / recap promo**: dark card + week's 3 numbers.
3. **Term card** (مصطلح): cream, word huge, 2-line definition, save prompt.
4. **Quiz/poll**: red split card + sticker zone (top 2/3 placement — thumb-reachable, safe from UI).
5. **Myth-buster**: black card, «خرافة» struck through in red → «حقيقة» + source line footnote style.
6. **Campaign frame**: cream + red-underline device, feminine-address type styles.
7. **Promo frame** (reel/carousel): asset thumbnail + «جديد اليوم» tag + link/pointer.
Safe zones all templates: top 130px, bottom 260px clear of critical content.

## 5. Reel thumbnail system (every video, 3 options, pick 1)
- **Anatomy:** cinematic still (subject right-of-center) + **left-third vertical panel** (cream or charcoal) carrying 3–5 Arabic words max + thin red rule + small axi mark bottom-left. Category color tick top of panel (family color).
- Rules: one idea; readable at 110×195px (test at 20% zoom); face > object > type-only (in that order of preference); no more than one number; consistent panel position month-long (grid coherence); crop-safe center 1:1 for grid view — headline panel must survive the square crop.
- Type-only variant allowed once per week max (pattern-interrupt card like «عندي سؤال.»).

## 6. Photography rules
Real people, real places, warm practical light; hands/eyes/tools of decision (notebooks, scales, screens-off-angle); hijab-diverse professional representation as reality is; NO piggy banks, coins-rain, suits-staring-at-charts, cash fans. Every human shoot banks B-roll for story frames (file 07 §10).

## 7. Data-visualization style
Sparklines and single-value cards over candlesticks; candles only in educational "how to read" content, clearly stylized with illustrative labeled values; up/down colors used at accent scale; every data visual carries source + Baghdad timestamp; abstract decorative charts must be obviously abstract (no readable price axes).

## 8. Arabic RTL rules
Right-aligned everything; mirror all directional layouts (arrows, swipe cues, diagonal split leans right-high); punctuation Arabic (، ؟ ٪); numbers keep LTR digit order inside RTL lines (rendering QA on every export); logo placement per brand guidelines `[pending]` — default bottom-left (Latin logo anchors left naturally, creating RTL tension balance).

## 9. Kurdish layout adaptation
Kurdish copy runs ~10–20% longer — templates hold a flexible text zone (never shrink type below scale minimums; add a line instead); re-set, never stretch, Arabic artwork; Kurdish account keeps identical families/rhythm so both profiles read as one brand; Kurdish-native photography leads on the Kurdish account (Erbil/Sulaymaniyah environments); CTA zones on Kurdish assets use learn/follow language only (KRI rule).

## 10. Highlight covers (5, both accounts)
Cream icon on Axi red: «السوق» (sparkline) · «تعلّم» (open book/line) · «Axi» (wordmark) · «عن دراية» (red underline mark) · «أسئلتكم» (chat bubble). Static, no photos — permanent shelf, not content.
