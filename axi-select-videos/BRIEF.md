# Axi Select — two promo films · production brief

Source: the client's brand deck (`properly.studio` Axi Select Branding Proposal, 9 pages, 16:9) plus verified facts
from axi.com (Oct 2026). Both films are built with the **onetake** skill (`/root/.claude/skills/onetake`):
one HTML composition per film, every value a pure function of time, `window.__seek(t)`, moves from `motion.js`
(`window.OM`), rendered with `scripts/render.py` (shutter motion blur). Read `SKILL.md`,
`references/composition.md`, `references/motion-library.md`, `references/rhythm.md` before building.

## Brand tokens (sampled from the deck)

| token | value | use |
|---|---|---|
| `--red` | `#E4002E` | the only accent: key words, chevrons ▲, CTA pill, candle bodies, progress |
| `--black` | `#000000` / `#0A0A0B` | ground |
| `--card` | `#111111` | cards (radius 14–18 px, 1 px `rgba(255,255,255,.06)` border) |
| `--charcoal` | `#2B2C2E → #3A3B3D` | top-lit slide gradient (deck pages 1, 7, 8) |
| `--white` | `#FFFFFF` | type |
| `--grey` | `#8D8F93` | secondary type (deck uses grey for the non-key half of a headline: "How Do I **Qualify**") |

Brand devices seen in the deck — use them, they are the film's vocabulary:
- **The chamfer**: the SELECT tag is a rectangle with the top-left and bottom-right corners cut at 45°. Cards in the
  deck repeat it (testimonial card top-right). This cut corner is the brand's signature shape.
- **Red chevron stack**: three small red ▲ stacked vertically (deck p7 under the price, p8 beside $500K) = "up".
- **Red tick mark**: a small red slanted quote-like tick `▘`/`◤` before headlines (deck p6) and as a dot grid
  of tiny red diagonal ticks on black (deck p4, p5 backgrounds, ~70 px spacing, very low opacity).
- **Candlesticks**: white/grey candles with red bodies, blurred in depth (deck p3, p7).
- **Brackets**: red corner brackets framing a chart (deck p7).
- **Two-tone headline**: grey words + white key words; or white words + red key words (p6: "tools", "education", "improve").
- `TRADE YOUR EDGE.   ///   LEARN MORE ON AXI.COM` small caps line with `///` separator.
- Pill buttons: dark pill with a red circle arrow; solid red pill "Trade Your Edge".
- Lots of black space; one big element; small supporting type.

## Type

All fonts are local in `assets/fonts/` (OFL). Load with `@font-face` from relative paths (`../assets/fonts/...`).
- Arabic display: **Alexandria** variable (`alexandria-arabic-wght-normal.woff2` + `alexandria-latin-wght-normal.woff2`,
  weights 100–900). Headlines 700–800.
- Arabic text: **IBM Plex Sans Arabic** 400/500/700 (`ibm-plex-sans-arabic-arabic-*-normal.woff2`).
- Latin + numerals: **Geist** (`Geist.ttf`, variable) — closest to the deck's grotesk. Big numbers ("$1,000,000",
  "80%") in Geist 300–400 with tight tracking, like the deck's "$500K".
- Readex Pro variable is also there as an alternative Arabic face.

**Arabic rules (hard):**
- `dir="rtl"` on Arabic blocks. Mixed Latin/number runs inside Arabic: wrap in `<bdi>` or separate elements.
- **Never split Arabic into letters** for animation: it breaks the joining/shaping. Animate by word (each word
  its own `inline-block` span, keep the space between) or reveal with a mask/clip-path that sweeps right→left.
- Arabic reads right→left: word-by-word entrances go right to left, wipes sweep right→left.
- Measure text after `document.fonts.ready` (the template's `__ready` already does).
- Never put tatweel or diacritics in display copy.

## Assets (`assets/img/`)

| file | what |
|---|---|
| `logo_white.png` (1728×384) / `logo_black.png` | full lockup, transparent; the tag's letters are knocked out |
| `logo_a.png` `logo_x.png` `logo_i.png` `logo_tag.png` | the lockup split for animation (x offsets 0, 312, 640, 770 in the 1728 px lockup) |
| `man_phone.webp` | cutout: man in black Axi polo looking at a red phone (transparent bg) |
| `woman_red_laptop.webp` | cutout: woman in red Axi polo holding a red laptop (transparent bg) |
| `duo_laptops_a/b.webp` | two traders with red laptops, light grey studio (b) / cutout (a) |
| `desert_dunes.webp` | black dunes with a tiny lone figure (the deck's "$500K" scene) |
| `rocks.webp` | dark volcanic rock landscape (deck testimonial bg) |
| `billboard_trading.webp` | airport billboard "Trading Without Barriers" with the man |
| `billboard_mt5.webp` | airport billboard "Trade on MT5" |
| `chart_*.webp` | blurred candlestick charts, transparent bg (red + white candles rising) |
| `coin_silver.webp` `coin_blue.webp` | metallic coin on black |
| `xag_bars.webp` `xag_small.webp` | gold XAU / silver XAG bars on black |

## Verified facts (axi.com, Oct 2026) — use ONLY these numbers

- Axi Select = Axi's funded-trader (capital allocation) program. **Free: no challenge, no sign-up or membership fee.**
  Normal trading costs apply.
- You trade **your own live Axi account** (MT4 or MT5). Axi mirrors your trades into an **Allocation Account**
  (حساب التخصيص) = your equity × the stage multiplier (e.g. $500 × 10 = $5,000).
- Entry (Pre-Seed): **Edge Score 50+** and **$500+** equity unlocks Seed.
- Six stages (official Arabic names):

| stage | Arabic | max funding | profit share | min equity | Edge Score |
|---|---|---|---|---|---|
| Seed | التأسيس | $5K | 0% | $500 | 50 |
| Incubation | الحضانة | $20K | 40% | $1,000 | 60 |
| Acceleration | التسارع | $100K | 50% | $2,000 | 70 |
| Pro | برو | $200K | 60% | $5,000 | 90 |
| Pro 500 | برو 500 | $500K | 70% | $10,000 | 90 |
| Pro M | برو مليون | $1M | 80% | $20,000 | 90 |

- Funding **up to $1,000,000**; keep **up to 80%** of allocation profits.
- To move up: **+7%** profit on the Allocation Account, minimum days (30 in Seed, 60 after) and trades
  (20 in Seed), the next stage's Edge Score and equity, all positions closed.
- Max loss **7%** (Pro M 10%). Seed: free reset any time. Incubation/Acceleration: 7-day quarantine, 3rd one → back to
  Seed. Pro tiers: breach → restart from Seed.
- Profit share paid **automatically on the 1st of every month** (positions closed, account above its start).
- Edge Score = Skill (المهارة) + Risk (المخاطرة) + Consistency (الثبات), weighted, × Experience (الخبرة).
  "Edge Score Explainer" tool in the client portal.
- Not allowed: scalping, copy trading, third-party EAs for automated execution, latency HFT, hedging to game metrics.
- Tools, training resources, trading education and expert coaching.
- **Do not use**: the 14% Seed fast-track (an expired promotion), "30:1 leverage", "220+ products", the deck's
  testimonial name, any promise of profit. Always carry a short risk line on the end card:
  «التداول ينطوي على مخاطر عالية وقد تخسر رأس مالك.»

## Instagram 9:16 safe zone (reel)

Meta's Reels overlay on 1080×1920: top 270 px (header), bottom ~670 px (caption, audio, CTA), sides 65 px, and the
action rail over the right ~230 px from y≈1150 down. **All key text and the CTA live inside x 90–990, y 280–1240.**
Full-bleed imagery may run edge to edge. The grid crops the middle 1080×1440 for the profile cover.

## Rules from the skill that apply to both films

Never cut on a metronome; vary shot length ≥ 4×. Carry every boundary (something survives and moves).
Rests are dead still. Small elements, big ground. Moves from `OM`, never hand-rolled springs. Deterministic
(`OM.rng`, no `Math.random`). No particles / confetti. `__meta.inFrame` for what must stay on screen.
Fast moves are fine: render.py's shutter smears them; define `window.__motion`.
