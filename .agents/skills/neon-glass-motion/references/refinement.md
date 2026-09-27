# Refinement: notes to edits

After the first cut the user gives notes in plain language. Map each note to film.json edits,
rebuild, check the changed beats, re-render (the frame cache makes single-beat edits about a
minute), and deliver again. Nothing is baked until they are happy.

## Contents

1. The loop
2. Note -> edit table
3. Diagnosing vague notes
4. "It looks laggy"
5. What re-renders (the cache)
6. Structural edits: removing, adding, reordering beats
7. Other ratios and cut-downs
8. Versions and delivery
9. When the user edited the HTML

---

## 1. The loop

1. Restate each note as a concrete edit (to yourself; to the user only if the note was ambiguous).
2. Edit `{work}/<slug>.film.json`, never the built HTML.
3. `python3 {skill}/scripts/validate.py {work}/<slug>.film.json` -> fix errors.
4. `python3 {skill}/scripts/build.py {work}/<slug>.film.json`
5. Stills of the changed beats: `python3 {skill}/scripts/render.py {work}/<slug>.html --stills {work}/<slug>-stills`
   (cached beats are instant) and Read the changed PNGs. Skip for pure timing edits.
6. `python3 {skill}/scripts/render.py {work}/<slug>.html` -> MP4.
7. Deliver both files (section 8) and say what changed, one line per note.

Handle all notes in one message together; one rebuild and one render per round.

## 2. Note -> edit table

| The user says | Edit in film.json | Notes |
|---|---|---|
| "Beat three is too fast" | `beats[2].dur` += 0.8–1.5 s, staying within the shot's max | The rest holds; the film gets longer. If the length is fixed (an ad slot), take the time from the longest other beats and say so. |
| "Beat three is too slow / drags" | `dur` −0.6–1 s, not below the shot's min | Or split its content across fewer words. |
| "Make it pop more" | `look.energy` +0.2 (max 1); `cut: "flash"` on the peak beat (number) and maybe the opener; make sure no more than 1–2 beats are `hero` so the colour keeps moving | Stronger glow swell, more colour movement. Above ~0.85 check stills for washed text. |
| "Too busy" | `look.density` −0.25; trim items (tiles to 3–4, orbit to 2–4, stack to 2 lines); remove `sub` lines; +0.3–0.5 s per beat, or drop the weakest beat | Fewer objects per beat, longer holds. |
| "Too plain / empty" | `density` +0.2; `energy` +0.1; give `rings`/`title` beats an icon or sub | |
| "Colder" | `look.temperature` −0.4 (again: −0.8; limit −1) | The palette's hue arc shifts toward cyan/blue. |
| "Warmer" | `look.temperature` +0.4 (again: +0.8; limit +1) | Toward magenta/orange. |
| "It looks laggy" | see section 4 | Usually playback, sometimes pacing, rarely an easing curve. |
| "Use our brand purple #6633EE" | `brand.color: "#6633EE"`; `hero: true` on 1–2 strongest beats (number, promise) | The palette remaps around the colour; the endcard follows automatically. |
| "Use #6633EE and #00D4A0" | first -> `brand.color`, second -> `brand.accent` | Keeps the structure. The accent shows as the end card's second light; the first colour does the remapping. |
| "The colours are wrong for my brand" (no hex) | ask for hex codes, or take them from their website | Name the hex you used. |
| "Drop the search bar scene" | delete that beat; spread its seconds proportionally over the others (each within its range) | Keeps the total. Re-renders everything (colours re-flow). |
| "Different opening" | change beat 1's `shot` (type <-> title <-> number <-> rings), keeping its words; if the words are the problem, promote the sharpest other line | Only beat 1 re-renders if the count/order is unchanged. |
| "Wrong parts of my script" / "I wanted X in it" | ask which points, or swap the weakest beat for the missing point | Re-cut lines to five words. |
| "Change the words on beat N" | edit the text field (≤ 5 words) | Only that beat re-renders. |
| "Faster overall" / "slower overall" | multiply every `dur` by ~0.87 / ~1.15 (each within range) | Changes the total; say the new length. |
| "Make it 15 seconds" | drop the weakest beat(s) and/or shorten holds proportionally | |
| "Text is too small" | shorten the line (shots size type by length) | There is no size parameter. |
| "Add our logo" | put the file in `{work}`, set `brand.logo` | Light or coloured version; dark logos vanish on black. |
| "Add music" | `audio: "track.mp3"` (their file), or `render.py ... --audio track.mp3` | Fades out over the last second. |
| "No flash" / "too flashy" | `cut: "hard"` everywhere; `energy` −0.15 | |
| "Less zoom" / "too much movement" | `camera: "still"` or `"drift"` on the named beats; `energy` −0.1 | |
| "Make a 16:9 / 1:1 version" | see section 7 | |

## 3. Diagnosing vague notes

- "It's flat" / "boring": check the script first (adjectives? no number? same shot twice?), then
  `energy` +0.15, a flash cut on the peak, a stronger opener. If the film follows the rules and
  still looks flat, suggest the strongest model (Opus) and a tighter script.
- "Something feels off" / "I don't like it": ask one question with two or three options drawn from
  the likely causes (pacing, colours, words, a specific beat). Point at the player: they can pause
  on the frame they mean and tell you the time shown.
- A note naming a time ("at 0:12 it looks weird"): find the beat from the timeline (validate.py
  prints time ranges), render `--at 12.0`, look at it, then fix.

## 4. "It looks laggy"

Find out which kind before changing anything; ask if unclear ("in the MP4 or in the HTML player?").

1. **The HTML player stutters** on their machine: playback drops frames when a browser cannot paint
   a frame in time. The MP4 is always smooth. Tell them to watch the MP4 for motion judgement; the
   HTML is for scrubbing and editing. No edit needed.
2. **The MP4 judders on camera moves**: `fps` 24 -> 30 (or 60 for very smooth push-ins; doubles
   render time); set `camera: "still"` or `"drift"` on the beats with the most on-screen motion.
3. **Motion feels sluggish** (entrances drag, dead holds): shorten the beat toward the middle of its
   range; for `type`, shorten the line so typing finishes sooner.
4. **A specific easing is wrong** (an object creeps in, a bounce feels soft) and 1–3 did not fix it:
   the curve lives in the shot code. Copy the engine and fix it there:
   ```
   cp -r {skill}/engine {work}/engine
   # edit {work}/engine/shots/<shot>.js: change the ease used for that entrance, e.g.
   #   E.outCubic(...) -> E.outExpo(...) (snappier; shots alias `var E = g.ease`), or shorten the
   #   entrance window, e.g. s.in(0.45, d) -> s.in(0.3, d)
   python3 {skill}/scripts/build.py {work}/<slug>.film.json --engine-dir {work}/engine
   ```
   Every later build of this film must pass the same `--engine-dir`. Engine code is part of every
   beat's cache key, so the whole film re-renders once. Available curves: linear, inQuad, outQuad, inOutQuad, outCubic, inOutCubic, outQuart,
   outQuint, outExpo, inExpo, inOutExpo, outBack, outElastic, outCirc. Keep shots deterministic
   (no Math.random, no Date).

## 5. What re-renders (the cache)

Frames are cached per beat, keyed by everything that affects that beat's pixels (its JSON, its
frame count, fps, size, its resolved colours, the look dials, fonts, engine code) but not its
start time. So:

| Change | Re-renders |
|---|---|
| Words, params, `dur`, `camera`, `cut` of one beat | that beat only (~1 minute) |
| `hero` on a beat | that beat and the beats whose colours shift (the arc re-centres) |
| Add, remove or reorder beats | every beat (each position on the colour arc moves) |
| Anything in `look` or `brand` (incl. name/url/logo), `ratio`, `fps`, `fonts` | everything |
| Engine code (an `--engine-dir` easing fix) | everything |
| `audio` / `--audio` only | nothing; the cached beat segments are re-joined with the music (seconds) |

Tell the user the expected wait when a change re-renders everything (same as the first render).
The MP4 is encoded per beat, so unchanged beats are not re-encoded either. `--fresh` forces a clean
render of this film if the cache is ever suspected.

## 6. Structural edits: removing, adding, reordering beats

- **Remove**: delete the beat; add its seconds to the others in proportion (respecting each range)
  so the total holds, unless the user wanted it shorter.
- **Add**: take the time from the longest beats; keep 4–7 beats; keep the endcard last.
- **Reorder**: keep the sharpest line first and the endcard last; the number near the peak.
- Unique `id`s make the timeline readable; renumbering is not needed.

## 7. Other ratios and cut-downs

- Another ratio: copy the film.json to `<slug>-16x9.film.json`, change `ratio`, check the stills
  (layouts adapt; lines that fit 16:9 may wrap in 9:16), adjust words if needed, render. Deliver
  with the ratio in the filename.
- Device default changes with ratio (phone 9:16, window 16:9, card 1:1) unless `kind` is set.
- A 6–10 s cut-down (bumper): the opener, the number and the endcard, holds at the upper-middle of
  each range. Under 12 s draws a warning; that is expected for a bumper.

## 8. Versions and delivery

- Keep the working names (`{work}/<slug>.film.json/.html/.mp4`) so the cache and commands stay the
  same.
- When delivering a revision, copy to the outputs folder as `<slug>-v2.mp4` and `<slug>-v2.html`
  (v3, ...) so earlier cuts survive; name both files the same way.
- One line per note on what changed ("Beat 3 now holds 4.4 s; energy 0.8 with a flash on the 40%").

## 9. When the user edited the HTML

The HTML's first script holds `window.FILM = { ... };` (valid JSON between `=` and `;`). If the user
changed it and now wants more changes, copy that object back into the film.json first (keep
`brand.logo` pointing at the logo file, not the embedded data), then apply their new notes, so their
own edits are not lost.
