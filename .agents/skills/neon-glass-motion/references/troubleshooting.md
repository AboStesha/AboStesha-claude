# Troubleshooting

Part A covers what users actually run into (the eight common problems) and what to tell them.
Part B covers the machine: browser, ffmpeg, fonts, time limits, disk, Windows and macOS.

## Contents

A. The eight common problems
  1. "Nothing happened when I asked."
  2. "I only got the HTML, no MP4."
  3. "The result looks flat compared to the examples."
  4. "It's been going for ten minutes."
  5. "The MP4 won't play."
  6. "It picked the wrong parts of my script."
  7. "The colours are wrong for my brand."
  8. "Can I edit it myself afterwards?"

B. Environment and pipeline
  9. Exit codes
  10. No Chromium (render exit 3, CAPABILITY html-only)
  11. No ffmpeg (render exit 4, CAPABILITY stills)
  12. Offline or blocked fonts
  13. Command time limits (render cut off)
  14. Disk space and the frame cache
  15. Red text in a still or frame (engine error)
  16. "This film could not start" in the HTML
  17. Arabic shows boxes or disconnected letters
  18. Logo missing or invisible
  19. Windows
  20. macOS
  21. The skill folder is read-only

---

## A. The eight common problems

### 1. "Nothing happened when I asked."
The skill did not trigger. Tell the user to check it is installed (ask "what skills do I have?"),
then ask explicitly: "use the neon glass motion skill to make a 20 second film from this." If you
are reading this, it is loaded now: proceed with the workflow.

### 2. "I only got the HTML, no MP4."
The HTML is a complete, finished animation: it plays in any browser. For the video too:
- Run `python3 {skill}/scripts/check_env.py --install`, then
  `python3 {skill}/scripts/render.py {work}/<slug>.html` (see 10 and 11).
- If this environment cannot run a browser at all, tell the user plainly and suggest running the
  same request in Claude Code on their own computer (where Chromium can be installed), or keep
  the HTML: it is the deliverable in HTML-only environments.

### 3. "The result looks flat compared to the examples."
Almost always the model: the strongest one (on Claude: Opus) designs, paces and composes
noticeably better; suggest switching and asking again. Then tighten the script (a number, verbs,
a sharp opener; see `script-craft.md`). Film-level fixes: `look.energy` +0.15–0.2, `cut: "flash"`
on the peak, a `number` beat if there is a real figure, no shot repeated back to back.

### 4. "It's been going for ten minutes."
Normal. A 20 s film is about 600 frames, each painted individually; 5–15 minutes end to end.
render.py prints progress with an ETA every ~5%; give the user the latest ETA. It says DONE when
finished.

### 5. "The MP4 won't play."
The file is H.264 (yuv420p, faststart) in an MP4: it plays everywhere. Check the render log said
"verified: decodes cleanly, exact frame count". If their player refuses, suggest VLC, or opening
the `.html` in a browser. If a messaging app rejects the size, re-encode smaller:
`python3 {skill}/scripts/render.py {work}/<slug>.html --crf 23 --out {work}/<slug>-small.mp4`
(frames come from the cache, so this takes seconds to a minute).

### 6. "It picked the wrong parts of my script."
Ask which beats they wanted, or offer the points you dropped, and swap them in. Or ask them to
rewrite the script tighter: it can only choose from what it was given.

### 7. "The colours are wrong for my brand."
Ask for hex codes ("use #6633EE and #00D4A0"): first -> `brand.color`, second -> `brand.accent`;
mark 1–2 beats `hero: true`. The palette remaps and the structure stays. If their colour is grey,
black or white, explain it cannot glow; the film uses the spectrum and the brand shows in the
wordmark and logo, or they can name a vivid secondary colour.

### 8. "Can I edit it myself afterwards?"
Yes. The `.html` contains the entire animation as readable code. Open it in a text editor: the
timeline and brand settings are at the top in plain English (durations in seconds, the words,
beat order, brand colours, the three look dials). Save and reload the browser to see the change.
For an MP4 of their edited version, they send the HTML back and you render it as it is:
`python3 {skill}/scripts/render.py <their.html> --out {work}/<slug>-edit.mp4` (use `--out`, since
upload folders can be read-only). For further changes, go through film.json (`refinement.md` §9).

## B. Environment and pipeline

### 9. Exit codes

| Script | Code | Meaning | Do |
|---|---|---|---|
| validate / build | 1 | errors in film.json | read the messages, fix, rerun |
| build | 2 | engine files missing | the skill install is incomplete; reinstall the skill |
| render | 1 | bad input (file, time values, audio path) | fix the argument |
| render | 2 | engine, render or encode failure | read the message and the ENGINE ERRORS block |
| render | 3 | no usable Chromium | section 10; deliver HTML-only if unfixable |
| render | 4 | no ffmpeg with H.264 | section 11 |
| render | 5 | stopped by `--budget` | rerun the identical command; it resumes |
| render | 130 | interrupted | rerun; finished frames are cached |

### 10. No Chromium (render exit 3, CAPABILITY html-only)
`check_env.py` lists every browser it tried and why each failed. Fixes, in order:
1. `python3 {skill}/scripts/check_env.py --install` (pip-installs playwright, then downloads
   Chromium only if none works). Needs network access to PyPI and the Playwright CDN.
2. An existing Chrome, Chromium or Edge: set `NGM_CHROMIUM=/path/to/chrome` for the render
   command (also read: `CHROME_PATH`, `CHROMIUM_PATH`, `PUPPETEER_EXECUTABLE_PATH`). Useful when
   Playwright's expected build differs from the one installed (a version mismatch on default launch).
3. Linux "missing dependencies" / "error while loading shared libraries":
   `python3 -m playwright install-deps chromium` (needs root), or use a system Chromium.
If none works (sandbox without network or browser), deliver the HTML as the finished film and say
so plainly; see SKILL.md "HTML-only".

### 11. No ffmpeg (render exit 4, CAPABILITY stills)
`python3 -m pip install imageio-ffmpeg` (bundles an ffmpeg with libx264), or install ffmpeg on
PATH (macOS `brew install ffmpeg`, Windows `winget install ffmpeg`, Debian/Ubuntu
`apt install ffmpeg`). Meanwhile stills and the HTML work: `--stills DIR` needs no ffmpeg.

### 12. Offline or blocked fonts
The render log prints a `fonts:` line. "web fonts unavailable ... system fallback fonts are used"
means Inter / JetBrains Mono / Noto Kufi Arabic could not be fetched; the film renders with
fallbacks (Helvetica Neue, Arial, DejaVu Sans; Arabic: Geeza Pro, Segoe UI, DejaVu Sans). It still
works but looks less refined, and letter widths differ, so check the stills for wrapping. render.py
fetches fonts through Python (which handles proxies and custom certificates) and caches them, so
one successful online render keeps them for later offline renders. The HTML loads the real fonts
whenever the viewer is online.

### 13. Command time limits (render cut off)
Some sandboxes stop any command after a few minutes. Add `--budget SECONDS` (a little under the
limit, e.g. `--budget 240`) and rerun the identical command after each exit 5 until it exits 0;
each run resumes from cached frames and finished beat segments. In Claude Code, run the render in
the background (or with a long timeout) instead. Tell the user it is still working between runs.

### 14. Disk space and the frame cache
Frames are cached as PNGs in a per-user folder (Linux `~/.cache/neon-glass-motion`, macOS
`~/Library/Caches/neon-glass-motion`, Windows `%LOCALAPPDATA%\neon-glass-motion\cache`; override
with `NGM_CACHE_DIR` or `--cache DIR`). A 20 s 9:16 film needs a few hundred MB up to about 1 GB.
The oldest cached beats are pruned above `--cache-max-gb` (default 4). render.py checks free space
first and refuses early with a clear message; point `--cache` at a bigger disk if needed. Deleting
the cache folder is always safe (the next render is a full render). `--fresh` re-renders one film
without touching the rest of the cache.

### 15. Red text in a still or frame (engine error)
A shot threw an error while drawing; the frame shows the message in small red text at the bottom
left (too small to read on the contact sheet, so rely on the log), render.py prints an
"ENGINE ERRORS" block naming the beat, and exits 2. Causes:
- A parameter of the wrong shape (a string where a list is expected, an empty `items` list). Fix
  the beat in film.json, validate, rebuild, re-render (other beats come from the cache).
- `unknown shot "<name>"`: that shot's code did not load. With the shipped engine this means the
  skill install is incomplete (reinstall it); with an `--engine-dir` copy it usually means a syntax
  error in the edited shot file: open the HTML in a browser console or undo the edit.
If the params are valid and it persists, switch that beat to another shot and tell the user which
beat changed.

### 16. "This film could not start" in the HTML
The settings block at the top of the HTML no longer parses (usually after a hand edit: a missing
comma, quote or bracket). Rebuild from the film.json, or fix the syntax in `window.FILM = {...}`.
If the message says the engine did not load, the file is truncated: rebuild it.

### 17. Arabic shows boxes or disconnected letters
Boxes (tofu) mean no Arabic font was available to the renderer: check the `fonts:` line (section
12); an online render caches Noto Kufi Arabic for later. Disconnected letters or left-to-right
order are not expected (the engine shapes Arabic via the browser's text engine and sets RTL
automatically); check the text does not contain invisible direction marks pasted from another
app, and remove them.

### 18. Logo missing or invisible
Missing: validate.py reports a missing file or unsupported format (use SVG, PNG, JPG, WEBP, GIF;
path relative to the film.json). Invisible: the logo is dark and drawn as-is on black. Use a white
or coloured version; for a single-colour SVG, copy it and set its fills to `#FFFFFF`; or remove
`brand.logo` so the endcard uses the wordmark.

### 19. Windows
- Use `python` or `py -3` instead of `python3`.
- Quote paths with spaces: `python "C:\Users\Sam\My Films\neon\scripts\render.py" "C:\...\film.html"`.
  Forward slashes also work in these scripts.
- In PowerShell set a browser for one session with `$env:NGM_CHROMIUM = "C:\Program Files\Google\Chrome\Application\chrome.exe"`;
  in cmd use `set NGM_CHROMIUM=...`. Installed Chrome and Edge are found automatically.
- Long paths: keep `{work}` short (e.g. `C:\films\meridian`) to stay under the 260-character limit.
- The cache lives in `%LOCALAPPDATA%\neon-glass-motion\cache`.

### 20. macOS
Chrome, Chromium and Edge in `/Applications` or `~/Applications` are found automatically. If the
first launch is blocked by Gatekeeper, open the browser once by hand. Use `python3`; if pip refuses
to install system-wide, use a virtual environment or `--user` (check_env.py tries these).

### 21. The skill folder is read-only
On claude.ai and Desktop the skill lives in a read-only location. Never write outputs, film.json
files, stills or engine copies into `{skill}`; use `{work}` and deliver to `/mnt/user-data/outputs`
when it exists. The scripts never write into the skill folder themselves.
