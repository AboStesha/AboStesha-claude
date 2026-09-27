---
name: neon-glass-motion
description: "Creates dark, neon, glass-and-light motion-graphics promo films (an Apple-style product reveal crossed with synthwave) from a written script or a website, delivered as an H.264 MP4 plus a self-contained HTML player that scrubs frame by frame and stays editable. Use when someone asks for a promo video, launch film, product reveal, teaser, app or SaaS ad, motion-graphics video, or a Reels/TikTok/Shorts/YouTube/site-hero clip made from text, a product description or a URL (e.g. 'make me a 20 second promo, 9:16, here is the script', 'turn meridian.app into a 30s launch film, 16:9'), or gives notes on a film made this way ('too busy', 'make it pop', 'warmer', 'use #6633EE'). Also Arabic requests: 'سوّ لي فيديو برومو', 'حوّل موقعي لفيديو', 'فيديو إطلاق منتج', 'موشن نيون', 'موشن جرافيك لمنتجي', 'فيديو إعلاني لتطبيقي'. Not for editing, cutting, grading or captioning real footage, AI live-action or avatar video, or slide decks."
---

# Neon Glass Motion

You turn a script or a website into a finished promo film: pure black, light as the subject, dark
matte glass, a neon spectrum travelling cool to warm, one idea per beat, hard cuts. You design the
film (beats, five-word lines, timing, shots) as a `film.json`; the scripts paint every frame in
Chromium and encode it. The user always gets **two files**: `<slug>.mp4` and `<slug>.html` (an
interactive player whose settings sit at the top of the file in plain English).

The design steps are where quality is decided: choosing beats, cutting lines, judging timing and
reading the stills. Give them full attention. If the user says the film looks flat, the first
remedy is the strongest model available (on Claude: Opus), the second a tighter script.

## Paths

`{skill}` = absolute path of the folder holding this SKILL.md (claude.ai / Desktop: usually
`/mnt/skills/user/neon-glass-motion`; Claude Code: `~/.claude/skills/neon-glass-motion` or
`<project>/.claude/skills/...`). If unsure:
`find / -name shots.manifest.json -path "*neon-glass-motion*" 2>/dev/null | head -1`.
Write it out literally in every command; shell variables may not survive between tool calls.
Use `python3` (Windows: `python` or `py -3`) and quote any path containing spaces.

`{work}` = a working folder you create, e.g. `ngm-<slug>/` in the current directory
(claude.ai: `/home/claude/ngm-<slug>`). Never write into `{skill}`; it may be read-only.

| File | Use |
|---|---|
| `scripts/check_env.py` | what this machine can produce (last line `CAPABILITY: ...`) |
| `scripts/validate.py` | checks a film.json, prints the beat sheet table |
| `scripts/build.py` | film.json -> self-contained HTML film |
| `scripts/render.py` | HTML -> stills and/or MP4 (frame cache makes re-renders fast) |
| `examples/meridian-*.film.json` | complete films; read one before writing your first film.json |
| `references/*.md` | detail, loaded only when needed (listed at the end) |

## Stage 0 — Environment (once per session)

```
python3 {skill}/scripts/check_env.py
```
If the result is not `mp4`, run it again with `--install` when you are in your own sandbox
(claude.ai, Desktop, Cowork) or the user agreed to installs on their machine (it pip-installs
`playwright` + `imageio-ffmpeg` and downloads Chromium only if none works). Remember the final line:

- `CAPABILITY: mp4` — full pipeline.
- `CAPABILITY: stills` — stills + HTML; no ffmpeg, so no MP4 (fix: `pip install imageio-ffmpeg`).
- `CAPABILITY: html-only` — no usable browser. Build (Stage 3) but skip the stills and Stage 4;
  deliver the HTML, a complete, finished film (see "HTML-only" below). Never call it a preview.

Mention the environment to the user only when it limits what they get.

## Stage 1 — Intake

You need three things: **duration**, **aspect ratio**, and **material** (a script, notes, or a URL).

- If duration or ratio is missing, ask for only the missing one(s), in one short message, with the
  options: 9:16 (1080x1920, TikTok/Reels/Shorts/Stories), 1:1 (1080x1080, feed posts, LinkedIn),
  16:9 (1920x1080, website hero, YouTube, decks); 15–20 s for social, 30 s for a launch or site hero.
  A named platform settles the ratio ("for Reels" = 9:16). Never assume either silently.
- If the user says "just make it", "you choose" or similar: use **20 s, 9:16** and state that
  choice on the first line of your beat-sheet reply.
- Under 12 s feels rushed; over 45 s needs a real narrative. Say so, then do what they asked
  (hard limits 4–120 s).
- Material too thin (a product name, one vague line): in the same message, ask for 2–4 sentences
  on what it does and for whom, or a URL. Every claim and number on screen must come from the
  user or their site; never invent figures, customers or prices.
- **Website** -> follow `references/website-to-film.md` (fetch, pull the promise, value props,
  real numbers, integrations, CTA, brand colours and logo).
- **Brand colours**: hex codes go straight into `brand.color` (hero) and `brand.accent`. A colour
  named without a hex ("our purple"): take the hex from their site, or pick a vivid match and say
  which hex you used. Greys, black and white are ignored by the palette (the pure spectrum is used);
  very dark colours are lifted so they glow. Tell the user when that happens.
- **Logo**: an uploaded SVG/PNG goes into `{work}` and `brand.logo`. It is drawn as-is on black,
  so a dark logo disappears: use a light or coloured version, or rely on the wordmark. A square
  mark sits in the end card's glass glyph beside `brand.name`; a wide wordmark replaces the name.
- **Music**: only a file the user supplies (`"audio"` in film.json). Never fetch or invent music.
- **Language**: on-screen text follows the script's language. Arabic is fully supported (below).

## Stage 2 — Beat sheet, then film.json

Design first. Rules (full craft with examples: `references/script-craft.md`):

1. **Five words or fewer** per on-screen line. Cut the user's sentences; do not shrink the type.
2. **4–7 beats**; about one idea per 3–4.5 s (15 s ≈ 4, 20 s ≈ 5–6, 30 s ≈ 7). With more
   points than beats, pick the strongest and drop the rest; say what you dropped.
3. **Lead with the sharpest line.** Beat 1 is the one people actually watch.
4. **Kill adjectives.** "Powerful, intuitive platform" animates nothing; "Deploy in nine seconds" does.
5. **Numbers get a `number` beat** ("40%" + "fewer meetings"), usually `hero: true` and `cut: "flash"`.
6. **End on an `endcard`** (brand, CTA, URL). Always last, exactly one.

Weak (no beats in it): "Meridian is a comprehensive, enterprise-grade scheduling solution that
leverages intelligent algorithms to optimise calendar management across your organisation."
Strong (four clean beats): "Meridian finds meeting times nobody hates. It reads every calendar in
your team and picks the slot that costs the least. Cut 40% of your meetings. Free under ten
people." When the user's script is the weak kind, find the verbs underneath and say in one line
what would make it stronger (a real number, what it actually does).

Shot picker (params, durations, layouts: `references/shot-library.md`):

| Material | Shot |
|---|---|
| The hero promise, a claim | `title` (text + optional sub) |
| A question, prompt, search, AI input | `type` with `bar: true` |
| A figure | `number` (value <= 6 chars + label) |
| How it works / the product UI | `device` (ui: calendar, list, chart, chat, code) |
| Integrations, platforms, partners | `orbit` (2–6 items) |
| 3–6 features | `tiles` (icons + 1–2 word labels) |
| 2–3 short benefits | `stack` |
| A signal: sync, alert, "it just works" | `rings` |
| Close | `endcard` (cta, url) |

Vary shots; avoid the same shot twice in a row. Let the shot show the thing the words say.

**Write the beat sheet in your reply** before building, in the user's language:

| # | Time | Shot | On screen |
|---|---|---|---|
| 1 | 0.0–3.4 s | type (glass bar) | Meeting times nobody hates. |
| 2 | 3.4–7.0 s | device · calendar | Reads every team calendar |
| … | … | … | … |

Add one line on the palette (e.g. "cyan to magenta, your #6633EE on the 40% beat and the end
card") and "If the story is wrong, tell me now." Then keep going in the same turn; wait for
approval only if the user asked to approve first.

Write `{work}/<slug>.film.json` (format: `references/film-format.md`; copy the structure of
`examples/meridian-9x16.film.json`). Then:
```
python3 {skill}/scripts/validate.py {work}/<slug>.film.json
```
Fix every error. Treat warnings as design feedback (rushed beats, long lines, missing endcard) and
fix them unless you have a reason not to.

## Stage 3 — Build, then check stills

```
python3 {skill}/scripts/build.py {work}/<slug>.film.json          # -> {work}/<slug>.html
python3 {skill}/scripts/render.py {work}/<slug>.html --stills {work}/<slug>-stills
```
The second command writes one PNG per beat (at 60% of the beat, entrances finished) and
`contact.png`. If its log shows an `ENGINE ERRORS` block (exit 2), a beat failed to draw and its
frames carry small red error text: fix that first (`references/troubleshooting.md` §15).
**Look at `contact.png` and every still with your image viewer (Read the PNGs).** Check each
against `references/visual-language.md` "Stills checklist": text inside the frame and not
clipped, lines wrap to at most 2, one idea big and centred, not crowded, pure black background,
colour travelling cool to warm, brand colour on the hero beats, logo visible, Arabic joined and
right-to-left. To inspect a moment (the typing flash, the number slam) add `--at 3.1,11.4`.

Fix in film.json (shorter words, fewer items, `density` down, another shot), rebuild, re-run the
stills (unchanged beats come from the cache). Two or three passes is normal; stop when every
still would pass as a frame from a product launch.

## Stage 4 — Render and deliver

Before rendering, tell the user: a 20 s film is about 600 individually painted frames; expect
5–15 minutes end to end; it is working, not stuck. Then:
```
python3 {skill}/scripts/render.py {work}/<slug>.html
```
- Progress prints every ~5% with an ETA. Output: `{work}/<slug>.mp4`. Success ends with `DONE`
  and "verified: decodes cleanly, exact frame count".
- If your shell tool has a time limit per command, add `--budget 240` (or a bit under the limit)
  and run the identical command again after each exit code 5 until it exits 0; every run resumes
  from the cached frames. In Claude Code, running it in the background also works.
- Exit codes: 0 ok, 1 bad input, 2 engine or encode failure (read the message), 3 no Chromium
  (deliver HTML-only), 4 no ffmpeg, 5 stopped by `--budget`. See `references/troubleshooting.md`.

**Deliver both files.** If `/mnt/user-data/outputs` exists, copy `<slug>.mp4` and `<slug>.html`
there (and present them with your file-sharing tool if you have one); otherwise leave them in
`{work}` (or wherever the user asked) and give the full paths. For later versions, copy as
`<slug>-v2.mp4` / `<slug>-v2.html` so earlier cuts survive.

Final message, short: what the film is (duration, ratio, beats), the two files, how to use the
HTML (open in any browser; Space play/pause, ←/→ frame step, Shift+←/→ one second, L loop, a
button exports the current frame as PNG; the timeline and brand settings sit at the top of the
file in plain English), and that plain-language notes refine it, with two or three example notes.

## Stage 5 — Refinement loop

Map each note to film.json edits (full table and diagnosis: `references/refinement.md`):

| The user says | Edit |
|---|---|
| "Beat three is too fast" | that beat's `dur` +0.8–1.5 s (within its max); others hold |
| "Make it pop more" | `look.energy` +0.2; `cut: "flash"` on 1–2 peaks; fewer `hero` beats so colour travels |
| "Too busy" | `look.density` −0.25; fewer items/lines, drop `sub`s; +0.3–0.5 s holds |
| "Colder" / "warmer" | `look.temperature` −0.4 / +0.4 (clamped to ±1) |
| "It looks laggy" | diagnose first (player stutter vs motion); `fps` 30 or 60, calmer `camera`, trim dead holds |
| "Use our brand purple #6633EE" | `brand.color`; `hero: true` on the 1–2 strongest beats |
| "Drop the search bar scene" | delete that beat; spread its seconds over the others |
| "Different opening" | swap beat 1's shot type, keep its words (or promote a sharper line) |

Then validate, build, re-run `--stills` and Read the changed beats (cached beats are instant),
render, deliver again, and say in one line per note what changed. Edits to one beat's words or timing re-render only that
beat (about a minute). Adding, removing or reordering beats, or changing look, brand, ratio or fps
re-colours every beat and re-renders the whole film; say so when it applies.
If the user edited the HTML themselves, copy their `window.FILM = {...}` block back into
film.json before changing anything, so their edits survive.

## HTML-only

When `CAPABILITY` is `html-only` (or render exits 3): validate and build as usual, review the
film.json against the stills checklist by reasoning (word counts, item counts, validate warnings),
and deliver the `.html` as the finished film. Tell the user it plays in any browser and contains
the whole animation; for an MP4, they can say "now render that to MP4" in an environment that can
run Chromium (Claude Code on their machine after `check_env.py --install`). With `stills`
capability, run Stage 3 and deliver the HTML plus `contact.png`.

## Arabic and right-to-left

Write Arabic lines directly in film.json. The engine detects Arabic, sets right-to-left and uses
Noto Kufi Arabic (system Arabic fonts offline). The five-word rule counts Arabic words. `number`
values count up in Western ("40%") or Arabic-Indic ("٤٠٪") digits; put the Arabic words in the label.
Latin brand names inside Arabic lines are fine. In the stills, confirm letters are joined and the
line reads right to left. Write the beat sheet and messages in the user's language.

## References

- `references/visual-language.md` — the look, palette and look dials, per-ratio layout, stills checklist
- `references/shot-library.md` — every shot: purpose, params, durations, example beats, icon list
- `references/script-craft.md` — turning scripts into beats; weak vs strong; worked examples
- `references/film-format.md` — the exact film.json format and validation rules
- `references/refinement.md` — every note mapped to edits; what re-renders; easing fixes
- `references/troubleshooting.md` — the eight common problems, plus browser, ffmpeg, fonts, Windows
- `references/website-to-film.md` — fetching a site; value props, numbers, colours, logo
