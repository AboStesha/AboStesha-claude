# Shot library

Nine shot types. Every film is built only from these, so films stay consistent as a set. The
source of truth for names, parameters and durations is `engine/shots.manifest.json`; this file
explains when and how to use each one.

## Contents

1. Choosing a shot
2. The nine shots (title, type, number, tiles, rings, device, orbit, stack, endcard)
3. Common beat fields (camera, cut, hero)
4. Icons and what they mean
5. Sequencing: openers, middles, closers
6. Templates by duration

`W` marks on-screen text: five words or fewer, per string (and per list item).

---

## 1. Choosing a shot

| What the beat says | Shot | Why |
|---|---|---|
| The promise, a claim, a name reveal | `title` | Biggest type, light sweep behind it |
| A question the user asks, a search, a prompt, an AI input | `type` + `bar: true` | The product in use, typing flash |
| A line with a voice ("Stop scheduling.") | `type` without bar | Typed words feel spoken |
| A figure: %, time, multiplier, price, count | `number` | Slam, bloom, shockwave; the strongest shot |
| How it works, what the product looks like | `device` | Glass phone/window/card with glowing UI |
| Integrations, platforms, partners, "works with" | `orbit` | Names circling a core |
| A feature set (3–6 features) | `tiles` | Glass icon tiles lighting one by one |
| 2–3 short benefits or steps | `stack` | Lines hitting on light cues |
| A signal: sync, notify, secure, instant | `rings` | Orb pulse, rings, shockwave |
| The close: brand, CTA, URL | `endcard` | Logo lockup; always last |

Rules: one idea per beat; do not repeat a shot back to back; a 20 s film should use 4–5 different
shots. Choose the shot that *shows* what the words *say* (a calendar product gets `device` with
`ui: "calendar"`, not another title).

## 2. The nine shots

### title — hero line reveal
A light sweep passes behind big centred text, glow swells, slow push-in.
- Params: `text` W (required), `sub` W (small line under it).
- Duration: 1.8–6 s (comfortable 2.8–4).
- Use for: the opening promise, a product name reveal, the emotional line before the endcard.
- Pitfalls: a title after a title is flat; use `sub` for the product name ("Meet Meridian") rather
  than a second title beat.
```json
{ "id": "open", "shot": "title", "dur": 3.6, "text": "Meeting times nobody hates.", "sub": "Meet Meridian" }
```

### type — typed line with the flash
Characters type on one by one; the last character typed flashes white and cools to the beat
colour. With `bar: true` it sits inside a dark glass search/prompt bar with a caret and a leading
icon. `sub` fades in after typing completes.
- Params: `text` W (required), `bar` (false), `icon` (default `search`; shown in the bar), `sub` W.
- Duration: 2.0–7 s. Typing always finishes by ~55% of the beat and the rest is hold, so `dur`
  sets the typing speed: ~0.8 s + 0.1 s per character keeps it at a readable 15–20 characters a
  second (3.2–3.6 s for a 25-character line); add ~0.6 s when there is a `sub`.
- Use for: AI/search/chat products, the question the customer asks, a punchy opener.
- Pitfalls: a long line in a short beat has to type very fast to finish by mid-beat and reads as
  a blur; keep lines under ~28 characters.
```json
{ "id": "ask", "shot": "type", "dur": 3.6, "text": "When is everyone free?", "bar": true, "icon": "search" }
```

### number — the figure slams in
The value slams in with a scale overshoot, bloom flash and shockwave ring; counts up when the
value has a numeric part; a short label sits below.
- Params: `value` (required, string, <= 6 characters: `40%`, `9s`, `10x`, `$0`, `1M+`, `24/7`),
  `label` W, `countUp` (true; set false for values like `24/7`, years, or version numbers).
- Duration: 1.8–5 s (comfortable 2.6–3.4).
- Use for: every concrete number in the material. Put it mid-film or as the peak before the end.
  Usually `hero: true` (brand colour) and `cut: "flash"`.
- Pitfalls: never invent a number; never make the label restate the number ("40% 40 percent").
```json
{ "id": "num", "shot": "number", "dur": 3.0, "value": "40%", "label": "fewer meetings", "hero": true, "cut": "flash" }
```

### tiles — glass icon grid
A grid of dark matte glass icon tiles lighting up one after another (rim light + icon glow),
optional caption.
- Params: `icons` (required, 3–6 icon names), `labels` W (one per tile, 1–2 words), `text` W.
- Duration: 2.2–6 s. Allow ~0.4 s per tile plus a 1.2 s hold: 4 tiles ≈ 3.2–3.8 s.
- Use for: feature sets, "everything in one place", platform coverage by capability.
- Pitfalls: more than 4 tiles in 9:16 with labels gets dense; with `density` below 0.4 prefer
  3–4 tiles. Match `labels` count to `icons`.
```json
{ "id": "all", "shot": "tiles", "dur": 3.6, "icons": ["chat", "doc", "calendar", "check"], "labels": ["Chat", "Docs", "Plans", "Tasks"], "text": "One place for work" }
```

### rings — pulse and shockwave
A glass orb pulses; concentric rings expand outward in waves with a shockwave on the downbeat;
one line of text sits over or under it.
- Params: `text` W, `icon` (drawn inside the orb).
- Duration: 1.8–6 s (comfortable 2.8–3.6).
- Use for: the "decision" or "signal" moment (it picks, it syncs, it alerts, it protects), or an
  abstract benefit that has no UI.
- Pitfalls: without text it is decoration; always give it a line or a meaningful icon.
```json
{ "id": "picks", "shot": "rings", "dur": 3.2, "icon": "clock", "text": "Picks the cheapest slot", "camera": "drift" }
```

### device — glass device with glowing UI
A dark glass device with rim light and a slow push-in; simple glowing UI inside; caption outside.
- Params: `kind` (`phone` | `window` | `card`; default auto = phone in 9:16, window in 16:9, card in
  1:1), `ui` (`calendar` | `list` | `chart` | `chat` | `code`; default `list`), `text` W.
- Duration: 2.5–7 s (comfortable 3.4–4.6).
- Pick `ui` by product: scheduling -> calendar; tasks/CRM/inbox -> list; analytics/finance ->
  chart; messaging/support/AI assistant -> chat; developer tools/APIs -> code.
- Use for: "how it works", the product itself. One per film is usually enough.
- Pitfalls: the UI is stylised, not a screenshot; the caption carries the meaning.
```json
{ "id": "how", "shot": "device", "dur": 3.8, "ui": "calendar", "text": "Reads every team calendar" }
```

### orbit — names circling a core
A glowing core with glass chips orbiting on tilted elliptical paths; chips carry short names.
- Params: `items` (required, 2–6 short names, each W), `text` W, `icon` (at the core).
- Duration: 2.5–7 s (comfortable 3.2–4.4).
- Use for: integrations ("Google", "Outlook", "Slack"), platforms ("iOS", "Android", "Web"),
  markets, partners. Use the names exactly as the brands write them.
- Pitfalls: more than 4 items in 9:16 crowds; 1–2 word names only.
```json
{ "id": "works", "shot": "orbit", "dur": 3.6, "items": ["Google", "Outlook", "Slack"], "icon": "calendar", "text": "Works where you work" }
```

### stack — lines on light hits
2–3 short lines arrive one after another on hard light hits, each lighting up then settling;
earlier lines dim slightly.
- Params: `lines` (required, 2–3 strings, each W).
- Duration: 2.4–6 s. About 1 s per line plus a 1 s hold: 3 lines ≈ 4 s.
- Use for: short benefit lists, three-step "how", a rhythm line ("No calls. / No chasing. / Just a time.").
- Pitfalls: parallel structure reads best; lines of similar length.
```json
{ "id": "why", "shot": "stack", "dur": 3.8, "lines": ["No back and forth.", "No 7am calls.", "Just a time."] }
```

### endcard — logo lockup
Brand wordmark (or embedded logo image) with a glass glyph and light bloom, call to action and
URL. Always the last beat; always in the brand colour when one is set.
- Params: `cta` W, `url` (defaults to `brand.url`).
- Duration: 2.2–6 s (comfortable 3.2–4.5; people need time to read a URL).
- CTA: the offer or next step, concrete ("Free under ten people", "Download free", "Join the
  beta"). Not "Learn more".
```json
{ "id": "end", "shot": "endcard", "dur": 3.6, "cta": "Free under ten people" }
```

## 3. Common beat fields

| Field | Values | Use |
|---|---|---|
| `camera` | `push` (default), `pull`, `drift`, `still` | Push suits almost everything. `drift` for rings/orbit to feel alive without zooming. `pull` for a reveal that opens up (rare). `still` when a busy beat feels jittery. |
| `cut` | `hard` (default), `flash` | `flash` on the peak (number) and optionally the opener. More than two flashes cheapens it. |
| `hero` | true/false | Beat wears the brand colour. The number beat and/or the promise. The endcard does it automatically. |
| `id` | short string | Unique, readable (`open`, `how`, `num`, `works`, `end`). |
| `note` | string | Why the beat exists; shown to nobody, useful to you in refinement. |

## 4. Icons and what they mean

The only valid names:

| Icon | Reads as |
|---|---|
| `calendar` | scheduling, dates, bookings, plans |
| `clock` | time saved, speed, availability, deadlines |
| `check` | done, approved, verified, tasks |
| `bolt` | fast, instant, power, automation |
| `lock` | privacy, encryption, login |
| `shield` | security, protection, compliance |
| `chart` | analytics, growth, revenue, reports |
| `globe` | worldwide, web, languages, remote teams |
| `chat` | messaging, support, AI assistant, comments |
| `users` | teams, community, collaboration |
| `code` | developers, API, integrations |
| `search` | search, discovery, finding (default in the `type` bar) |
| `mail` | email, inbox, newsletters |
| `bell` | notifications, alerts, reminders |
| `heart` | health, favourites, care, likes |
| `cart` | shopping, checkout, e-commerce |
| `card` | payments, billing, cards |
| `cloud` | sync, storage, SaaS, backup |
| `sparkle` | AI, magic, new, premium |
| `play` | video, media, start |
| `arrow` | next, growth, go, transfer |
| `plus` | add, create, more |
| `home` | home, real estate, dashboard |
| `camera` | photos, scanning, capture |
| `music` | audio, music, podcasts |
| `doc` | documents, notes, contracts, files |
| `gear` | settings, automation, workflows |
| `pin` | location, maps, delivery, local |
| `phone` | mobile app, calls |
| `star` | ratings, reviews, favourites, quality |

## 5. Sequencing: openers, middles, closers

- **Openers** (beat 1, the one people watch): `title` with the promise; `type` with the question
  the customer asks (bar) or a spoken line; `number` if the figure *is* the hook ("9 seconds").
  Never open with `endcard`, `tiles` or `orbit`.
- **Middle**: show, don't list. `device` for how it works, `rings` for the moment it acts,
  `tiles`/`stack` for breadth, `orbit` for where it works. Place the `number` at roughly 55–75% of
  the film: the peak before the close.
- **Closer**: `endcard`. A short `title` with the emotional line may sit right before it in films
  of 30 s or longer.
- Colour follows position (cool at the start, warm at the end), so the order also sets the colour
  journey. `hero` beats pull to the brand colour wherever they are.

## 6. Templates by duration

Starting points; adapt to the material.

**15 s (4 beats)** — title 3.6 · device 4.0 · number 3.4 · endcard 4.0

**20 s (5–6 beats)** — type/bar 3.4 · device 3.6 · rings 3.2 · number 3.0 · orbit 3.4 · endcard 3.4

**30 s (7 beats)** — title 4.2 · type/bar 4.0 · device 4.6 · rings 4.0 · number 3.8 · orbit 4.4 ·
endcard 5.0

**45 s (7–9 beats)** — use the longer ends of each range, add `stack` or `tiles` for breadth and a
closing `title` before the `endcard`; beats beyond 7 draw a validator warning, which is fine when
the narrative earns them.
