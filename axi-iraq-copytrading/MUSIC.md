# Axi Iraq · Copy Trading reel · music

## Track

| | |
|---|---|
| **Mixkit ID** | **#1012** |
| **Title** | **Take this Higher** |
| **Artist** | Michael Ramir C. |
| **Mixkit tags** | EDM, Pop, Confident, Powerful, Bass, Drums, Fashion, Parties |
| **File** | https://assets.mixkit.co/music/1012/1012.mp3 (256 kbps, 44.1 kHz, 1:39). Mixkit has no per-track music page. The Download button on the card serves this same mp3. |
| **Listed on** | https://mixkit.co/free-stock-music/pop/ · https://mixkit.co/free-stock-music/mood/confident/ · https://mixkit.co/free-stock-music/tag/fashion/?page=2 |
| **Edit** | `src/music/reel_music.wav`: 48 kHz, 24-bit, stereo, exactly 1,440,000 frames (30.000 s), −14.2 LUFS integrated, −1.0 dBTP |
| **Grid** | `src/music/grid.json` |
| **Rebuild** | `python3 -I tools/music/build_music.py src/music/mixkit_1012_take_this_higher.mp3 src/music` (deterministic) |

## Licence

The track is covered by the **Mixkit Stock Music Free License** (https://mixkit.co/license/#musicFree, text checked on 2026-10-20).

- **Allowed:** commercial and non-commercial use for free, with no attribution needed. The licence names social media video posts and online marketing ads, so this reel is covered. Editing the track to fit a video is allowed: the licence lets you "download, copy, modify, distribute and publicly perform" it on web and social platforms.
- **Not allowed:** CDs and DVDs, **TV and radio broadcast**, and video games. You also can't remix the track or put it in a music-only track, claim it as your own, or register it with a rights-management service such as Content ID.
- **What this means here:**
  - Publish the music only inside the finished video.
  - Never post or share `reel_music.wav` or the raw mp3 on their own. `src/` is gitignored, so they stay out of the repo.
  - If this cut is ever booked for TV, it needs a different licence.
  - If Instagram or YouTube raises a claim, send the details to team@mixkit.co.

## Why this track

The brief asked for the hype and punchy drums of the approved Axi Select reel, which used Mixkit #318 at about 95 BPM. Mixkit lists #318 as "Thunder" by Arulo; that project saved it as `mixkit_318_trap.mp3`. The new track also had to sound aspirational and bright enough for clean grey studio, glass, 3D and holiday/family shots.

1. **Bright and upbeat, not dark.** The drop's spectral centroid is about 4.6 kHz, against 3.8 kHz for the reference, which Mixkit tags Disturbing and Ominous. The harmony is open and A-centred, with no minor-key colour. Mixkit tags this track Confident and Powerful, and the title fits the message too.
2. **Punchy and cut-friendly.** The kick is a tight four-on-the-floor at exactly **124.00 BPM**: 146 kicks fit the grid with 0.08 ms rms error. That gives a cut point every 0.484 s (beat) or 0.242 s (eighth) for fast match cuts. The drop has a crest factor of 13 dB, which is punchy for EDM.
3. **The composer's own structure gives every moment we need, with only two splices:**
   - A sub-less pre-drop bar that runs straight into the main drop (the drop at 2 s).
   - A real **stop bar**: a hit, a tape-stop, near-silence, a vocal-stutter fill, then the re-entry. That is the pause beat.
   - A designed **re-entry drop** after the stop, slightly louder than drop A (+0.6 dB rms).
   - A **final hit** with a natural ring-out.
4. **30.000 s = 62 beats = 15.5 bars exactly** at 124 BPM, so every section boundary is a bar line.
5. **It matches SCRIPT.md one to one.** SCRIPT.md was planned on a 128 BPM grid. Its bar slots map onto this track's bars with a single factor, shown under "Retiming SCRIPT.md" below.

### Shortlist (13 downloaded, analysed with librosa; spectrograms in `src/music/analysis/`)

| ID | Title | BPM | Mode (chroma) | Drop centroid | Biggest rise | Verdict |
|---|---|---|---|---|---|---|
| **1012** | **Take this Higher** | **124.0** | A-centred, bright | **4650 Hz** | +25 dB intro · +17 dB main drop | **Chosen.** Stop bar, pre-drop, re-entry and final hit are all in the track. |
| 371 | Cat Walk | 130.0 | E minor (clear) | 3130 Hz | +27 dB at 88.4 s | Runner-up: very clean and punchy, but minor and darker, and no stop bar |
| 470 | Golden Storm | 127.0 | G# major (strong) | 3380 Hz | +8 dB | Elegant, but too flat for a hype edit and no stop |
| 931 | On a Breezy Day | 125.0 | F major | 4370 Hz | +48 dB kick-in at 7.4 s | Soft drums (crest 9.9 dB), quieter master |
| 1001 | I Do! | 128.0 | minor-leaning | 3930 Hz | +21 dB at 37.5 s | Long intro, no stop |
| 1183 | Karma | 128.0 | ambiguous | 4890 Hz | +5 dB | Almost no dynamics |
| 836 | Let's Move | 120.0 | C major | 1600 Hz | +32 dB at 16.0 s | Dark, bass-heavy, then 80 s flat |
| 1062 | Friday Routine | 125.0 | D minor | 5330 Hz | +11 dB | Minor, small drops |
| 1147 | Midnight Funk | 118.0 | F# major-ish | 4340 Hz | +17 dB at 16.0 s | One drop then flat |
| 1210 | Can't Get You Off My Mind | 75 (150) | C# minor | 5520 Hz | +25 dB at 24.0 s | Half-time 3.2 s bars, too few cut points |
| 349 | Basketball Training | 90.0 | C major | 3580 Hz | +28 dB at 30.7 s | Busy brass with sparse kicks; "sports/showbiz" feel, not premium |
| 447 | G Eazy Type | 80.0 | A# major | 2580 Hz | +19 dB at 12.0 s | Trap, but tagged relaxed, with 3 s bars |
| 431 | Young Trizzy 02 | 140 (70) | A major-ish | 1670 Hz | +37 dB at 13.3 s | Dark timbre, relaxed |
| ref 318 | Thunder ("trap") | 95.0 | D | 3760 Hz | +44 dB at 19.9 s | Reference only (previous reel) |

Excluded before download: drug or explicit titles such as #355 "Drugs" and #408 "Lean and Pills", and anything tagged Children, Folk, Jazz, Acoustic or Ambient.

## The edit (bar-aligned, 2 splices)

All times are in seconds. Bar = 1.935484, beat = 0.483871.

| Timeline | Bars | Source (s) | Source bars | Section |
|---|---|---|---|---|
| 0.000 – 1.935 | 0 | 50.323 – 52.258 | 26 | **Intro hook.** Pre-drop bar: claps and vocal-chop plucks, no sub (−21.6 dBFS) |
| 1.935 – 13.548 | 1–6 | 52.258 – 63.871 | 27–32 | **DROP A.** Main drop: kick plus sub (−16.2 dBFS). Contiguous with the intro, so no splice |
| 13.548 – 15.484 | 7 | 27.097 – 29.032 | 14 | **BREAK (stop bar).** Splice 1 |
| 15.484 – 27.097 | 8–13 | 29.032 – 40.645 | 15–20 | **DROP B.** The composer's re-entry after the stop (−15.6 dBFS). Contiguous with the break |
| 27.097 – 30.000 | 14–15.5 | 90.968 – 93.871 | 47–48.5 | **END HIT.** Final hit and ring-out. Splice 2. Fade only from 28.800 to 30.000 |

**Splices.** Each one is an equal-power crossfade of 10 ms that ends 0.6–0.8 ms before the earliest transient at that bar line. That keeps both kicks intact and hides the joint under the incoming hit.

| Splice | Crossfade | Max sample jump in crossfade | Neighbourhood 99.9th pct | HF peak in crossfade | Neighbourhood HF p99 | Kicks around (offset from grid) | Inter-kick intervals |
|---|---|---|---|---|---|---|---|
| 13.548 (src 63.871 → 27.097) | 13.5376–13.5476 | 0.091 | 0.308 | +3.9 dB | +16.7 dB | +3.00 / +3.02 / **+3.01** ms | 1.000 / 1.000 beat |
| 27.097 (src 40.645 → 90.968) | 27.0862–27.0962 | 0.108 | 0.203 | +7.0 dB | +14.3 dB | +3.09 / +2.90 / **+3.66** ms | 1.000 / 1.002 beat |

- **Click check:** passed. The biggest sample-to-sample jump inside each crossfade is under the 99.9th percentile of the ±1 s around it. The highest 1 ms of >9 kHz energy inside each crossfade is under the 99th percentile of that neighbourhood.
- **Grid check:** passed. A matched filter using the track's own kick finds 49 kicks on the final timeline. All 49 are on the 124 BPM grid (fit 123.9998 BPM, rms 0.09 ms, max 0.24 ms). The kicks continue on the beat straight through both splices.
- **Start and end:** a 2 ms de-click ramp at 0.000 s (the cut starts inside a sounding bar; this is not a fade-in). The last sample is exactly 0.

## Grid (everything below is in `grid.json`)

| | |
|---|---|
| BPM | **124.000** |
| beat | **0.483871 s** (14.52 frames at 30 fps) |
| eighth | 0.241935 s |
| sixteenth | 0.120968 s |
| bar | 1.935484 s (58.06 frames at 30 fps). Bar *n* starts at *n* × 1.935484 |
| Kick attack | lands **+2.9 ms** after each grid line. Cut on the frame that contains the grid time |
| **Drop A** | **1.9355** (kick 1.9383, frame 58 at 30 fps) |
| **Break** | **13.5484 – 15.4839**: stop hit 13.548 (frame 406) · tape-stop fall to 13.834 · near-silence 13.834–14.505 · vocal-stutter fill 14.505–14.848 · gap 14.848–15.014 · soft pre-drop 15.014–15.484 |
| **Drop B** | **15.4839** (kick 15.4867, frame 464) |
| **Final hit** | **27.0968** (attack 27.1004, frame 813), ring-out to 30.0 |
| Fade | 28.800 – 30.000 only |
| Kicks | 50 in total. Every beat from 1.938 to 13.551 (beats 4–28, the last being the stop hit). Every beat from 15.487 to 26.616 (beats 32–55). The final hit at 27.100. There are no kicks in the intro bar or after the stop hit inside the break. Full list with beat, bar and offset: `grid.json → kicks / kicks_detail` |
| Sections | intro_hook 0–1.935 · drop_a 1.935–13.548 · break 13.548–15.484 · drop_b 15.484–27.097 · end_hit 27.097–30.0 |

## Retiming SCRIPT.md (written on a 128 BPM grid)

The 16 slots in the beat sheet map bar for bar onto this track:

- **Up to 26.25 s:** new time = old time × **1.032258** (128/124). For example: 0.9375 → 0.968, 1.875 → 1.935 (drop A), 13.125 → 13.548 (break), 15.000 → 15.484 (drop B), 26.25 → 27.097.
- **End card (old 26.25–30.00):** becomes **27.097–30.000**. The red logo snap lands on the final hit at 27.097. The CTA card can take over from beat 57 (27.581).
- **Beat 09 sound design:** put the laptop-lid close on the stop hit at 13.548. A heartbeat SFX fits inside the near-silence (13.83–14.50). Keep SFX off the vocal-stutter fill (14.505–14.848), because the track's own fill is the riser into drop B.
- **Beat 16 note:** the "stab hits" are gone. This track ends on one hit with a ring-out and a 1.2 s fade, as the music brief asked. The replay still opens cleanly, because the intro bar starts straight from 0.

## Files

- `src/music/reel_music.wav`: the edit (gitignored, do not distribute on its own)
- `src/music/grid.json`: the grid, sections, splices, source map and kicks
- `src/music/build_report.json`: loudness, true peak, grid fit and splice checks
- `src/music/reel_music_spectrogram.png`: spectrogram, waveform with beats and kicks, and 10 ms level, with sections marked
- `src/music/candidates.json`, `src/music/mixkit_*.mp3`, `src/music/analysis/`: the 13 candidates, their per-track analysis JSON, spectrograms and zooms
- `tools/music/`: `analyze_music.py` (tempo, sections, drops, gaps, plots), `drop_metrics.py`, `zoom_plot.py`, `bar_study.py`, `musiclib.py` (kick detectors, grid fit) and `build_music.py` (the edit and its verification)
