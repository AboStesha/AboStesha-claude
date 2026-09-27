# Visual language

What every Neon Glass Motion film looks like, why, and how to judge a still against it. Read this
before the stills check and whenever a note is about the look ("flat", "busy", "wrong colours").

## Contents

1. The register
2. The seven rules
3. Colour: the travelling spectrum
4. Brand colour: woven in, not pasted on
5. The look dials
6. Motion: entrances, holds, cuts, camera
7. Type
8. Layout per aspect ratio
9. Stills checklist
10. What breaks the look

---

## 1. The register

An Apple product reveal crossed with synthwave. Dark, precise, expensive; neon light instead of
colour fills. The films are composed from one visual language so a set of films (one per product,
per ratio, per market) looks like a family.

## 2. The seven rules

1. **Pure black background.** `#000`. Never grey, never a dark wash, no vignette, no grain over the
   black. Where nothing is lit, the pixel is black.
2. **Light is the subject.** Objects are dark matte glass; what you see is the light on their rims
   and the glow behind them (bloom), not flat coloured shapes.
3. **A neon spectrum that travels.** Cool cyan and blue at the open, violet through the middle,
   magenta or warm at the close.
4. **One idea per beat, big and centred.** Never a busy composite, never two messages at once.
5. **Typing that flashes.** In `type` beats the last character typed lights up white-hot and
   cools to the beat colour.
6. **Hard cuts, camera push-ins, expanding rings, glass icon tiles, shockwaves.** That is the whole
   vocabulary. No crossfades, wipes, spins or bounces between beats.
7. **White-hot is punctuation.** Pure white appears only in flashes, typing highlights and the
   brightest cores. Everything else carries colour.

## 3. Colour: the travelling spectrum

The default arc, cool to warm: cyan `#22D3EE` -> blue `#3B82F6` -> violet `#8B5CF6` -> magenta
`#EC4899` -> warm `#FB923C`. Beat *i* of *n* takes the arc at position i/(n−1), so the first beat is
cyan, the last warm, and colour moves on every cut. You never set per-beat colours; you set the
order, the brand colour and `temperature`, and the palette follows.

Consequences:
- Reordering, adding or removing beats re-colours the film (and re-renders every beat).
- A 4-beat film takes bigger colour steps than a 7-beat film; both travel the full arc.
- Colours stay saturated and bright (lightness ~55–70%) so they glow against black.

## 4. Brand colour: woven in, not pasted on

With `brand.color` set:
- `hero: true` beats and the endcard wear the brand colour.
- The arc is re-centred so the brand hue sits at its natural place in the cool-to-warm journey,
  and the beats next to a hero beat lean ~25% toward it, so the brand colour arrives rather than
  jumps in.
- `brand.accent` is the second light of the closing beat: on the end card it colours the line
  under the lockup and the drifting dust. The rest of the film keeps its spectrum.
- Neutral brand colours (greys, black, white) cannot glow and are ignored: the film uses the pure
  spectrum and the brand shows through the wordmark and logo instead. Very dark colours are lifted.

Good practice: one hero beat in films up to 20 s (usually the number), two in longer films (the
number and the promise). Making every beat `hero` turns the film monochrome and kills the travel;
if the user wants "all brand colour", use `temperature` to bring the arc close to the brand hue
and keep one or two hero beats.

## 5. The look dials

| Dial | Low | High | Typical |
|---|---|---|---|
| `temperature` (−1..1) | colder: arc shifted toward cyan/blue | warmer: toward magenta/orange | 0 |
| `energy` (0..1) | calm: soft glow, gentle push | pop: strong bloom, bigger push-in, brighter flashes | 0.55–0.7 |
| `density` (0..1) | sparse: the one object, few particles | rich: more secondary objects and dust | 0.5–0.6 |

Calm premium brands (finance, health, B2B): energy ~0.5, density ~0.45. Consumer launches,
games, creator tools: energy ~0.75, density ~0.6. Above ~0.85 energy, bloom can wash thin text.

## 6. Motion: entrances, holds, cuts, camera

- **Entrances are fast and eased** (expo/back-out curves): the object is readable within ~0.3–0.6 s.
- **Holds are long.** Most of a beat is the finished composition, breathing (push-in, glow swell,
  dust drift), so the words can be read.
- **Exits are nearly nothing**; a beat may soften in its last ~0.25 s, then a **hard cut**.
- **Camera**: `push` (default) is a slow scale-in over the beat (bigger with energy); `pull` the
  reverse; `drift` a slight float; `still` none.
- **Flash cut** (`cut: "flash"`): two white-hot frames as the beat starts. Use on the peak.
- Motion is deterministic: a frame depends only on its time, so the HTML player, the stills and
  the MP4 show identical frames.

## 7. Type

- Display: Inter, heavy weights (800–900), tight tracking. Mono: JetBrains Mono (code UI, small
  labels). Arabic: Noto Kufi Arabic, right-to-left, chosen automatically for Arabic text.
- Lines of five words or fewer; wrapped to at most two lines, shrunk if needed, never clipped.
- White text glows in the beat colour. Hierarchy comes from size and light, not from colour fills
  or boxes.
- Offline, fallbacks are Helvetica Neue / Arial / DejaVu Sans (Arabic: Geeza Pro / Segoe UI /
  DejaVu Sans). The film still works, with less refined type.

## 8. Layout per aspect ratio

| Ratio | Size | Composition |
|---|---|---|
| 9:16 | 1080x1920 | Vertical stack: object in the upper-middle, text below. Text is width-limited; short lines matter most here. Devices default to a phone. |
| 1:1 | 1080x1080 | Centred, compact. Devices default to a card. Fewest items per beat. |
| 16:9 | 1920x1080 | Wide: objects can sit beside text; bigger type; devices default to a window. |

Units scale with the short side (1 unit = 1% of min(width, height)), so the same film.json
composes in any ratio. The title-safe box is the frame minus ~8% margins; nothing important leaves
it. Social apps overlay UI near the bottom of 9:16 videos; the safe box keeps text clear of the
worst of it.

## 9. Stills checklist

Run it on `contact.png` and every per-beat still (and any `--at` stills). Each item that fails
has a film.json fix.

| Check | If it fails |
|---|---|
| Every word fully inside the frame and the safe margins; nothing clipped | shorten the line; fewer items; another shot |
| Text wraps to at most two lines and reads at phone size | cut words (5 max, fewer is better) |
| One idea per beat; the eye knows where to go in half a second | lower `density`; fewer tiles/items/lines; drop `sub` |
| Background pure black; no grey haze | lower `energy` if bloom washes the frame |
| Colour travels cool -> warm across the sheet; no two neighbours identical | reorder; reduce `hero` beats |
| Brand colour on the hero beats and the endcard | set `brand.color` / `hero: true` |
| The number is big, the label short and legible | shorter value (<= 6 chars) and label |
| Logo visible on the endcard (not dark on black) | light/coloured logo version, or drop it and use the wordmark |
| Arabic letters joined, right-to-left, not boxes | check fonts line in render output; see troubleshooting |
| No small red text anywhere | an engine error: read the render log; fix the beat's params |
| Consecutive beats look different | swap one shot type |

## 10. What breaks the look

- Adjective lines ("Powerful. Intuitive. Seamless.") — nothing to show.
- Six-word-plus lines, paragraphs, bullet lists crammed into one beat.
- Grey or pastel brand colours forced as hero; every beat `hero`.
- Flash cuts on every beat; `energy` 1 with `density` 1.
- Dark logos on black; screenshots or photos (the engine does not place bitmaps other than the logo).
- Durations at the bottom of every range: the film becomes a strobe. Hold the good frames.
