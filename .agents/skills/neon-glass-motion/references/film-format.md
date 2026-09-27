# film.json — the film format

The film is one JSON file that you write. `build.py` turns it into the HTML film and `render.py`
turns that into stills and the MP4. Everything the film shows comes from this file.

## Contents

1. File naming and where it lives
2. Complete example
3. Top-level fields
4. `brand`
5. `look`
6. `fonts`
7. `audio`
8. Beats: common fields
9. Beats: shot parameters (summary)
10. Timing and frames
11. Validation: errors vs warnings
12. What the user sees in the HTML
13. Editing an HTML the user changed

---

## 1. File naming and where it lives

- Name it `<slug>.film.json` inside your working folder `{work}` (never inside the skill folder).
  `build.py` then writes `<slug>.html` next to it and `render.py` writes `<slug>.mp4` next to the
  HTML. Example: `meridian-launch.film.json` -> `meridian-launch.html` -> `meridian-launch.mp4`.
- The slug: lowercase ASCII, hyphens, short (`acme-launch`, `nour-app-9x16`). Use a Latin slug even
  for Arabic films so file names survive every OS and messaging app.
- Paths inside the file (`brand.logo`, `audio`) are relative to the film.json's folder, or absolute.
- Plain UTF-8 JSON. Comments and trailing commas are tolerated (validate.py notes them) but write
  plain JSON.

## 2. Complete example

```json
{
  "title": "Meridian — launch film",
  "ratio": "9:16",
  "fps": 30,
  "brand": { "name": "Meridian", "color": "#6633EE", "accent": "#00D4A0", "url": "meridian.app", "logo": "logo.svg" },
  "look": { "temperature": 0, "energy": 0.6, "density": 0.55 },
  "audio": null,
  "beats": [
    { "id": "open",  "shot": "type",    "dur": 3.4, "text": "Meeting times nobody hates.", "bar": true, "icon": "calendar" },
    { "id": "reads", "shot": "device",  "dur": 3.6, "ui": "calendar", "text": "Reads every team calendar" },
    { "id": "picks", "shot": "rings",   "dur": 3.2, "icon": "clock", "text": "Picks the cheapest slot" },
    { "id": "cut",   "shot": "number",  "dur": 3.0, "value": "40%", "label": "fewer meetings", "hero": true, "cut": "flash" },
    { "id": "works", "shot": "orbit",   "dur": 3.4, "items": ["Google", "Outlook"], "icon": "calendar", "text": "Works where you work" },
    { "id": "end",   "shot": "endcard", "dur": 3.4, "cta": "Free under ten people" }
  ]
}
```
Total = 20.0 s = 600 frames at 30 fps. `logo.svg` must exist next to the film.json (omit `logo`
when there is none; the endcard then uses the wordmark). Two full examples ship in `examples/`.

## 3. Top-level fields

| Field | Required | Values | Notes |
|---|---|---|---|
| `title` | recommended | string | Player title and HTML `<title>`. Not drawn in the film. |
| `ratio` | **yes** | `"9:16"`, `"1:1"`, `"16:9"` | 1080x1920, 1080x1080, 1920x1080. Anything else is an error. |
| `fps` | no (30) | 24, 25, 30, 60 | 30 is right almost always. 60 doubles render time; 24 can judder on push-ins. |
| `brand` | recommended | object | See 4. The endcard needs at least `brand.name`. |
| `look` | no | object | See 5. |
| `fonts` | no | object | See 6. Usually omit. |
| `audio` | no (null) | path or null | See 7. |
| `beats` | **yes** | array of beat objects | 2–12 (error outside), 4–7 recommended (warning outside). |
| `note` / `notes` / `_comment` | no | anything | Ignored; for humans. |

Unknown top-level keys are ignored with a warning (with a "did you mean" hint).

## 4. `brand`

| Field | Notes |
|---|---|
| `name` | Wordmark on the endcard. Keep the brand's own casing. |
| `color` | Hero colour, `#RRGGBB` (or `#RGB`). Beats with `hero: true` and the endcard wear it; the spectrum arc is re-centred around its hue and neighbouring beats lean toward it. Omit for the pure cyan -> violet -> magenta -> warm spectrum. |
| `accent` | Optional second brand colour, `#RRGGBB`. It is the end card's second light (the line under the lockup, the dust); other beats keep the spectrum. |
| `url` | Shown on the endcard (e.g. `"meridian.app"`; drop `https://` and `www.`). |
| `logo` | SVG, PNG, JPG, WEBP or GIF path (relative to the film.json), a `data:` URI, or an `https://` URL (downloaded and embedded at build time). Keep it under ~3 MB. Drawn as-is on black: use a light or coloured version. A square-ish logo (a mark) sits inside the end card's glass glyph next to `name`; a wide one (aspect > 1.6, a wordmark) replaces the typed name. If the file is a stacked lockup that already contains the name, use the mark-only file so the name is not shown twice. |

Colour handling (tell the user when it applies):
- Saturation below ~12% (greys, black, white): ignored; the film uses the pure spectrum.
- Very dark (lightness < 20%): warning; the engine lifts it so it reads as light on black.
- Nearly white (lightness > 92%): warning; pick a saturated hue instead.
- Non-hex values (`"purple"`, `"rgb(...)"`) are errors: convert to hex yourself.

## 5. `look`

Three dials, all optional:

| Dial | Range | Default | Effect |
|---|---|---|---|
| `temperature` | −1 .. +1 | 0 | Rotates the hue arc up to ±30°. Negative = colder (cyan, blue). Positive = warmer (magenta, orange). |
| `energy` | 0 .. 1 | 0.6 | Glow strength, bloom size, camera push-in amount. "Make it pop" raises it. |
| `density` | 0 .. 1 | 0.6 | Secondary objects and particles per beat. "Too busy" lowers it. |

Good starting points: calm, premium brand 0.45–0.55 energy / 0.4–0.5 density; loud consumer launch
0.7–0.8 / 0.6. Above 0.85 energy the bloom starts to wash text; check the stills.

## 6. `fonts`

`{"display": "Inter", "mono": "JetBrains Mono", "arabic": "Noto Kufi Arabic"}` are the defaults and
the only families the HTML loads from Google Fonts. Another display family is used only if it is
installed on the machine that plays or renders the film (validate.py warns). Omit `fonts` unless
the user insists on a specific installed typeface. Offline, system fallbacks are used
(Helvetica Neue / Arial / DejaVu Sans; Geeza Pro / Segoe UI / DejaVu Sans for Arabic).

## 7. `audio`

Path to a music file the user supplied (mp3, m4a, wav, aac...). `render.py` muxes it into the MP4,
fades it out over the last second and trims it to the film length. `render.py --audio file` overrides
it for one render; `--audio none` renders silent. Never download or invent music. The HTML player
is silent.

## 8. Beats: common fields

Every beat is one object; shot parameters sit directly on it (not nested).

| Field | Required | Values | Notes |
|---|---|---|---|
| `shot` | **yes** | `title`, `type`, `number`, `tiles`, `rings`, `device`, `orbit`, `stack`, `endcard` | See `shot-library.md`. |
| `dur` | **yes** | seconds, > 0.5 | Each shot has a comfortable range (warning outside). |
| `id` | recommended | short string | Unique; shown on the player timeline and in stills names. `open`, `how`, `num`, `end`. |
| `camera` | no | `push` (default), `pull`, `drift`, `still` | Push = slow scale-in over the beat (amount scales with energy). Pull = the reverse. Drift = slight deterministic float. Still = none. |
| `cut` | no | `hard` (default), `flash` | Flash = 2-frame white-hot flash at the start of the beat. Use on 1–2 peaks, never on every beat. |
| `hero` | no | boolean | Beat wears `brand.color` instead of its spot on the arc. Needs `brand.color`. 1–2 per film. |
| `note` | no | string | For humans (why this beat exists). Not rendered. |

## 9. Beats: shot parameters (summary)

`W` = on-screen words, max 5 each (error above 5). Full detail and examples: `shot-library.md`.

| Shot | Params | Duration (s) |
|---|---|---|
| `title` | `text` W req, `sub` W | 1.8–6 |
| `type` | `text` W req, `bar` bool (false), `icon` (search), `sub` W | 2.0–7 |
| `number` | `value` req (<= 6 chars, e.g. `40%`, `9s`, `10x`, `$0`, `1M+`), `label` W, `countUp` bool (true) | 1.8–5 |
| `tiles` | `icons` req (3–6 icon names), `labels` W (one per tile, 1–2 words), `text` W | 2.2–6 |
| `rings` | `text` W, `icon` | 1.8–6 |
| `device` | `kind` (`phone`/`window`/`card`, default auto by ratio), `ui` (`calendar`/`list`/`chart`/`chat`/`code`, default list), `text` W | 2.5–7 |
| `orbit` | `items` W req (2–6 short names), `text` W, `icon` | 2.5–7 |
| `stack` | `lines` W req (2–3) | 2.4–6 |
| `endcard` | `cta` W, `url` (defaults to `brand.url`) | 2.2–6 |

Icon names (anything else is an error): calendar, clock, check, bolt, lock, chart, globe, chat,
star, users, code, search, mail, bell, heart, cart, card, cloud, shield, sparkle, play, arrow,
plus, home, camera, music, doc, gear, pin, phone.

Text notes: lines longer than ~32 characters draw a warning (they wrap or shrink); long single
words (German compounds, URLs) shrink hardest. The text engine honours `\n` for a forced break,
but prefer letting it wrap.

## 10. Timing and frames

- Each beat lasts `round(dur * fps)` frames; the film is the sum. Beats run back to back with hard
  cuts; there are no transitions to budget for.
- Make the durations add up to the requested length (e.g. exactly 20.0). validate.py prints the
  total; adjust the last one or two beats to land it.
- Words need time: roughly 1.8 s + 0.35 s per on-screen word for a single line, more for `type`
  (it types at a reading pace, then holds). The endcard wants 3–4 s so the URL can be read.

## 11. Validation: errors vs warnings

`python3 {skill}/scripts/validate.py <film.json>` prints the beat sheet table, then problems.
Exit 0 = valid (warnings allowed), exit 1 = errors. `--json` gives a machine-readable report.

Errors (must fix; build refuses):
- missing/unsupported `ratio`; `fps` not 24/25/30/60
- fewer than 2 or more than 12 beats; unknown `shot` (with a suggestion); missing required param
- `dur` missing or <= 0.5
- wrong types: `"value": 40` (write `"40"`), `"bar": "yes"` (write `true`); enum values outside
  their list (`camera`, `cut`, `kind`, `ui`)
- any on-screen text field over 5 words
- unknown icon name; invalid hex colour; logo file missing or unsupported format
- total under 4 s or over 120 s; `look` values out of range

Warnings (design feedback; fix unless you have a reason):
- beats outside 4–7; `dur` outside the shot's comfortable range
- total under 12 s (rushed) or over 45 s (needs a narrative)
- endcard missing, not last, or more than one
- `hero` without `brand.color`; very dark / nearly white brand colour
- long lines (> ~32 characters), `number.value` over 6 characters, item/line/tile counts outside
  the recommended range, labels that do not match the icon count
- unknown params (ignored), duplicate ids, missing title or brand name
- audio file not found; display font not bundled

## 12. What the user sees in the HTML

`build.py` places the settings in the first `<script>` of the HTML: a plain-English comment block
(the beat list with times, how to change durations, words, order, brand colours and the three look
dials, the allowed shot/camera/cut/icon names), followed by `window.FILM = { ... };` with one beat
per line. Opening the file in a text editor, editing a value and reloading the browser replays the
film with the change. The engine and every shot follow as readable JavaScript. The logo, if any,
is embedded as a data URI, so the HTML works offline and can be emailed as one file.

## 13. Editing an HTML the user changed

If the user edited their HTML and then asks for more changes, extract the object between
`window.FILM =` and the closing `};` (it is valid JSON) and save it as the film.json. Inside that
object `brand.logo` is only the logo's file name (the embedded image data is on the separate
`window.FILM.brand.logo = "data:..."` line below it); make sure that file sits next to the
film.json, or drop the key. Then continue the normal loop: validate, build, stills, render.
