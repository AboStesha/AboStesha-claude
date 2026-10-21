# Axi Iraq · Emotional brand ad "Built by traders, for traders" · music

## Track

| | |
|---|---|
| **Mixkit ID** | **#543** |
| **Title** | **A New Life** |
| **Artist** | Eugenio Mininni |
| **Mixkit tags** | Film Score, Orchestral Hybrid, Hopeful, Reflective, Strings, Synth, Documentary |
| **File** | https://assets.mixkit.co/music/543/543.mp3 (256 kbps, 44.1 kHz, stereo, 1:39). Mixkit has no page for a single track. This URL is the preview the card's audio player streams. The card's Download modal (`/free-stock-music/download/543/`) was behind a Cloudflare check from this machine, so I could not confirm again that it serves the same file. The previous project found that it does. |
| **Listed on** | https://mixkit.co/free-stock-music/orchestral-hybrid/ · https://mixkit.co/free-stock-music/film-score/ · https://mixkit.co/free-stock-music/mood/hopeful/ · https://mixkit.co/free-stock-music/tag/cinematic/ · https://mixkit.co/free-stock-music/mood/reflective/ · https://mixkit.co/free-stock-music/instrument/strings/ |
| **Source file** | `src/music/mixkit_543_a_new_life.mp3`, sha256 `bad126a1306f9488914ea240fa0d1f984b89dc988691b1fd0b509e6f33438273` |
| **Edit** | `src/music/ad_music.wav`: 48 kHz, 24-bit PCM, stereo, exactly 2,160,000 frames (**45.000 s**). It measures **−16.2 LUFS integrated, −1.0 dBTP, LRA 17.8 LU**, with a short-term maximum of −8.3 LUFS at the C-major arrival. |
| **Grid** | `src/music/grid.json`. It holds the grid, sections, lift, breath, accents, fade, splices, source map, level ride and the full verification report. |
| **Rebuild** | `python3 -I -B tools/music/build_emotional.py src/music/mixkit_543_a_new_life.mp3 src/music [src/music/analysis]`. The build is deterministic: two runs gave byte-identical `ad_music.wav` and `grid.json`. The optional third argument also writes `ad_music_spectrogram.png`. |

## Licence

The track is covered by the **Mixkit Stock Music Free License**. I read the text on 2026-10-20 at https://mixkit.co/license/#musicFree. The licence opens as a modal, which loads from `https://mixkit.co/license/modal/musicFree/`.

- **Allowed** (the licence's own list): Podcasts, **Social Media video posts**, **Online marketing ads**, Educational Purposes and YouTube videos. In its words: *"can be used in your commercial and non-commercial projects for free. You're permitted to download, copy, modify, distribute and publicly perform the Music Items on any web or social media platform, including internet-based video on demand services, podcasts and advertisements."* No attribution is required.
- **Not allowed:** *"CDs & DVDs, TV & Radio Broadcasts, Video Games … You're also not allowed to remix them (or incorporate in a music-only track), claim them as your own or register them on any rights management service."* The licence also points to further limits in the Mixkit User Terms.
- **Claims:** *"If you receive a claim, please forward the details to team@mixkit.co for assistance."*
- **What this means for this ad:**
  - An Instagram Reel ad that traders repost and share is covered.
  - The edit is a modification made to fit a video, which the licence allows. Publish it only inside the finished video. Never post `ad_music.wav` or the mp3 on their own as a music-only track. `src/` is gitignored, so neither file reaches the repo.
  - Never register the ad's audio with Content ID or a similar service.
  - If the cut is ever booked for TV or radio, it needs a different licence.

## Why this track

The brief's arc runs: lonely, then tension rising, then a breath, then the LIFT at about 22 s ("you will never walk alone"), then a full anthem with a steady pulse, then a resolve and ring-out under the logo. "A New Life" is the only one of the 20 candidates that has every one of those parts in its own arrangement, in the right emotional colour.

1. **Its harmony tells the ad's story, measured with chroma per half bar.** Source bars 0–20 are **A minor**: an E/A drone pad, then strings. Bars 21–28 move to F major, 29–34 to D minor and 35–36 to **G**, the dominant. Bars 37–47 arrive in **C major** and ring out. The edit runs A minor for "alone · stress · weak", lifts on A minor with a full orchestra, then goes D minor, G and **C major exactly on the end card**: a real V→I cadence under "your partner when you succeed". The key over the whole track is C major (r = 0.945). It is hopeful without being bright-corporate, and it is never sad-sad.
2. **The quietest and loudest moments are far apart.** The dynamic range is 43.9 dB, the widest of any candidate except #545, whose figure includes silence. The intro bars sit at −62 to −43 dBFS. The composer's main entrance at source bar 13 (24.638 s) is the biggest impact in the track: +17 dB broadband, +26 dB below 150 Hz and +32 dB above 2 kHz against the 400 ms before it. It is a hit, a sub boom and a crash at once, with full strings: big, but orchestral and warm, not EDM.
3. **The pulse is steady and good for cutting.** After the entrance, a string ostinato runs at **128 BPM**. Its pulse clarity is 0.70 (autocorrelation of the onset envelope at the beat lag). The other candidates with real dynamics (over 20 dB: #598, #587, #545, #322, #321) score 0.13–0.49. The tracks that pulse more steadily than #543 (#955, #684, #917, #1162) all have under 8 dB of dynamics. The inter-beat spread is 1.7 % (CV). The intro has no pulse (clarity 0.23), which is right for the lonely opening.
4. **The composer built a stop into the track.** Source bar 12 plays four swell stabs, one on each beat, then drops out in the last 50 ms before the hit. The edit puts a near-silent bar between those stabs and the hit, which gives the classic "da-da-da-da · silence · BOOM" exactly where the brief wants the weak moment and then the lift.
5. **45.000 s = 96 beats = 24 bars exactly** at 128 BPM. The edit starts on a bar line and ends on one, and every section boundary is a bar line.

### Shortlist: 20 downloaded and analysed

I browsed Mixkit's listing pages and catalogued 502 unique tracks:

- moods: hopeful, emotional, reflective, uplifting, triumphant, powerful, determined, dramatic
- genres: film-score, orchestral-hybrid, orchestral-pop, trailer-music, post-rock
- tags and instruments: cinematic, piano, strings, orchestral, epic, epic-drama, human-drama, motivational

`/mood/inspiring/` lists no tracks and `/genre/cinematic/` returns 404, so `/tag/cinematic/` and `/film-score/` stood in for them.

How the columns were measured:

- I ran `tools/music/analyze_music.py` (tempo, sections, drops, gaps and spectrograms in `src/music/analysis/`). I added scratch measurements on top: key (weighted harmonic chroma against Temperley profiles), pulse clarity over the main body and chords per half bar.
- **Dyn** is bar-level dynamic range, from the 95th to the 10th percentile.
- **Biggest rise** is the bar-energy jump weighted by sub level, with its source time.

| ID | Title (artist) | Len | BPM | Key | Dyn | Biggest rise | Pulse | Verdict |
|---|---|---|---|---|---|---|---|---|
| **543** | **A New Life** (Eugenio Mininni) | 1:39 | **128.0** | **A minor → C major** | **43.9** | **+27 at 24.6 s** | **0.70** | **Chosen.** All five parts of the arc are in the arrangement |
| 598 | We Will Get It (Eugenio Mininni) | 4:29 | 77 (154) | B♭ major | 21.7 | +32 at 183.9 s | 0.31–0.37 | **Runner-up 1** (below) |
| 587 | Discover (Eugenio Mininni) | 2:24 | 82.8 | F major | 20.5 | +32 at 11.7 s | 0.35 | **Runner-up 2** (below) |
| 545 | Rebecca on the Shore (Eugenio Mininni) | 1:52 | 132 (≈124) | C major | 56.9* | +52 at 2.0 s | 0.30 | Swells straight up from 2 s, then one long plateau. No stop, no lift, loose pulse |
| 322 | Life's a Movie (Arulo) | 2:01 | 105 | F♯ major | 32.1 | +20 at 45.7 s | 0.13 | Lovely piano and brass, but almost no pulse to cut on |
| 272 | Wedding Music (Arulo) | 2:09 | 120/150 | D major | 10.5 | +13 at 8.1 s | 0.53 | Has a dip at 78–80 s, but bright wedding orchestral pop |
| 708 | Classical 1 (Jonny S.) | 1:51 | 81.9 | G♯/C minor | 7.3 | +19 at 32.5 s | 0.31 | Quiet master (−25.7 dB), small dynamics |
| 31 | Dreaming Big (Ahjay Stelino) | 1:50 | 135 | D major | 8.6 | +5 | 0.44 | Flat for 100 s. Family/fantasy flavour |
| 32 | Driving Ambition (Ahjay Stelino) | 1:42 | 100 | C major | 9.9 | +18 at 96 s | 0.52 | Brass and drums feel sporty-corporate. Its only big rise is the outro |
| 917 | This Is What I'm Fighting For (Michael Ramir C.) | 2:06 | 97 | F major | 7.7 | +26 at 29.7 s | 0.71 | Pop band, flat after 30 s, no stop |
| 955 | I Believe 2 (Michael Ramir C.) | 1:44 | 80 | D major | 4.7 | +32 at 6.0 s | 0.76 | Steady piano, but everything happens in the first 6 s |
| 952 | Dreaming of You (Michael Ramir C.) | 2:29 | 105 | G major | 7.7 | +9 | 0.63 | Soft and flat, quiet master |
| 1081 | We'll Be Okay (Michael Ramir C.) | 1:44 | 140/70 | D major | 4.6 | +10 | 0.49 | Solo piano, no build |
| 684 | Classical vibes 4 (Grigoriy Nuzhny) | 2:17 | 70/93 | G major | 2.9 | +4 | 0.77 | Almost no dynamics |
| 683 | Classical vibes 3 (Grigoriy Nuzhny) | 2:05 | 75 | C major | 6.6 | +15 at 76.8 s | 0.44 | Gentle, small rises |
| 680 | Epical Drums 05 (Grigoriy Nuzhny) | 1:42 | 75 | D minor | 4.0 | +4 | 0.68 | Restless war drums: tension without warmth |
| 846 | I Won't Surrender (Michael Ramir C.) | 1:54 | 85/114 | B minor | 3.4 | +4 | 0.61 | Trailer tension, serious and minor all the way. 128 kbps file |
| 606 | Drawing the Sky (Eugenio Mininni) | 3:27 | 100 | D minor | 8.8 | +11 at 13.6 s | 0.56 | Dramatic plateau for three minutes |
| 1162 | Where's Hope? (Michael Ramir C.) | 1:47 | 73/110 | ambiguous | 7.8 | +7 | 0.83 | Electronica, futuristic, not emotional |
| 321 | I Just Need Love (Arulo) | 1:44 | 150/75 | B major | 20.5 | +11 | 0.49 | Romance piano, no lift |

\* includes the silent tail. "77 (154)" and similar entries mean the tempo octave is ambiguous.

### The two runners-up

1. **#598 "We Will Get It" (Eugenio Mininni)**, https://assets.mixkit.co/music/598/598.mp3. It has the most beautiful single moment of any candidate: a natural near-silence at 2:57.7–3:03.9 (−33 then −45 dB) followed by the biggest lift in the track at **3:03.9** (+27 dB), in warm B♭-major piano and strings. It lost for three reasons:
   - The body is piano-led and loose in time (pulse clarity 0.31–0.37, with the tempo reading as either 77 or 154 BPM), so the 22–38 s anthem has no steady pulse to cut on.
   - Its bars are 3.117 s long, so 45 s is 14.44 bars: the edit cannot end on a bar line, and every splice is coarse.
   - Fitting its 4:29 into 45 s needs two big jumps between different densities: from the opening crescendo to the 2:58 stop, and from 3:10 to the 4:15 fade.

   It is also major-key from the first bar, so it has no "alone / stress" colour.
2. **#587 "Discover" (Eugenio Mininni)**, https://assets.mixkit.co/music/587/587.mp3. It is clean F-major orchestral pop: piano intro, a full hit at 0:11.7, a drop back to piano (0:17.5–0:29), a second lift at 0:29–0:38 and a long anthem with a clean ending. It lost for three reasons:
   - It has **no near-silence**. The quietest bar after the intro is −38.9 dB rms, only about 20 dB under the anthem, and there is no designed stop. The breath would have to be faked.
   - Its biggest hit comes at 0:11.7, far too early, and would have to be cut out.
   - It is bright and major throughout (Mixkit tags it Intro and Wedding), so it leans toward the corporate-cheesy feel the brief rules out. Pulse clarity is 0.35.

## The edit (bar-aligned, 3 splices)

All times are in seconds. Timeline bar *k* starts at *k* × 1.875. Source bar *b* starts at 0.2627 + *b* × 1.875.

| Timeline | Bars | Source (s) | Source bars | Content |
|---|---|---|---|---|
| 0.000 – 20.625 | 0–10 | 4.013 – 24.638 | 2–12 | **intimate + tension.** One contiguous run: drone pad, arpeggio, shimmer, ostinato, four stabs |
| 20.625 – 22.500 | 11 | 2.138 – 4.013 | 1 | **breath.** The pad rising out of the source's fade-in bar. Splice 1 |
| 22.500 – 30.000 | 12–15 | 24.638 – 32.138 | 13–16 | **LIFT.** The composer's main entrance and its 4-bar phrase, as [boom · sustain · dip · crash]. Splice 2 |
| 30.000 – 45.000 | 16–23 | 62.138 – 77.138 | 33–40 | **anthem + resolve.** D minor (33–34), G (35–36, with the fill), C major arrival (37), diminuendo (38–40). Splice 3. The edit ends exactly on the source bar-41 line |

The splice at 30.000 jumps ahead by 16 bars inside the same phrase position: bar 16 is the last bar of a 4-bar group, bar 33 the first of one. The orchestra is fuller and brighter from there (+18.9 dB below 150 Hz on the downbeat), so 30.0 sounds like a second step up: **lift 22.5 → bigger 30.0 → arrival 37.5**.

**Splices.** Each one is an equal-power crossfade that ends 1 ms before the earliest transient found at that bar line, on either side. Three detectors look for transients: a >1 kHz attack, a broadband 1 ms attack and a <150 Hz attack.

| Splice | Crossfade | Why there | Level out → in (10 ms) | Max sample jump in crossfade / ±1 s 99.9th pct | HF >9 kHz in crossfade | Onsets around (offset from grid) |
|---|---|---|---|---|---|---|
| 20.625 (src 24.638 → 2.138) | 20.5647–20.6047 (**40 ms**) | No incoming hit to hide under. The fade ends 20.3 ms before the bar line and 5.7 ms before the first >1 kHz energy of the suppressed bar-13 hit, so none of the hit leaks | −37.8 → −60.1 dBFS | 0.0017 / 0.0057 ✓ | −86 dBFS (noise floor) ✓ | stabs 19.684 / 20.152 (−3.6 / −4.1 ms) |
| 22.500 (src 4.013 → 24.638) | 22.4742–22.4842 (10 ms) | Ends 15.8 ms before the bar line and 1.2 ms before the hit's first >1 kHz energy. The pad joint sits under the lift | −47.3 → −27.4 dBFS | 0.0007 / 0.0234 ✓ | −88 dBFS, 36 dB under both sides ✓ | 22.498 (−2.5 ms) / 22.955 |
| 30.000 (src 32.138 → 62.138) | 29.9890–29.9990 (10 ms) | Both downbeats attack at +3 to +8 ms. The joint sits under the incoming phrase start | −29.1 → −20.1 dBFS | 0.0326 / 0.0435 ✓ | 3.5 dB under both sides ✓ | 29.053 / 29.991 (−9.5 / −8.9 ms) |

- **Grid check:** passed. A level-jump onset detector (a rise of at least 6 dB over 30 ms against the 40 ms before) finds 24 strong onsets on the final timeline. All 24 sit on the fixed 128.000 BPM grid: mean −3.9 ms, rms 9.7 ms, max 22.9 ms. The max (−22.9 ms at 12.633) is a soft swell that starts early, just before the shimmer entry. On the source, a free fit puts 43 of 44 onsets on 127.98 BPM with 8.2 ms rms. Orchestral string attacks spread by about ±10 ms; that is a third of a frame at 30 fps.
- **Start and end:** a 2 ms raised-cosine de-click at 0.000 s (the cut starts inside a sounding pad, so this is not a fade-in). The **fade runs only from 43.500 to 45.000**. The last sample is exactly 0.
- **Other processing:** the level ride below, then one global gain of −0.71 dB to a −1.0 dBTP ceiling. There is no limiter, no EQ and no compression.

### Level ride (segments 1–2 only, cosine-interpolated in dB)

The source intro sits at −62 to −43 dBFS. Played as it is, the first 8 s would be dead on a phone, so the opening is raised and the raise eases off as the music grows.

| Timeline | Ride | Why |
|---|---|---|
| 0.000 → 3.750 | +15 → +13 dB | Source bars 2–3 are still the composer's fade-in |
| 3.750 → 7.500 | +13 → +12 dB | |
| 7.500 → 13.125 | +12 → +9 dB | |
| 13.125 → 18.750 | +9 → +7 dB | Shimmer, strings and ostinato enter, so the source grows on its own |
| 18.750 → 20.625 | +7 dB | The four stabs |
| 20.625 → 22.500 (breath) | +9 dB | Keeps the near-silence just audible: about 26 dB under the anthem, not a dropout |
| 22.500 → 45.000 | 0 dB | The composer's own dynamics |

Short-term loudness per bar after the ride (LUFS, 1.875 s windows):

- **intimate:** −29.5 −27.9 −26.3 −24.2
- **tension:** −28.0 −26.0 −27.9 −19.6 −18.2 −20.7 −22.0
- **breath:** −40.6
- **lift:** −10.7 −13.9 −18.3 −16.4
- **anthem:** −9.2 −10.8 −13.2 −11.7
- **resolve:** −7.8 −10.2 −12.7 −18.9

## Section map (45.000 s, everything below is in `grid.json`)

| | |
|---|---|
| BPM | **128.000** |
| beat | **0.46875 s** (14.06 frames at 30 fps) |
| eighth / sixteenth | 0.234375 s / 0.1171875 s |
| bar | **1.875 s** (56.25 frames at 30 fps). Bar *k* starts at *k* × 1.875. There are 24 bars and 96 beats. Downbeats run 0, 1.875, 3.75 … 43.125 |

| Section | Time | Bars | Level (rms / LUFS) | What is in the music |
|---|---|---|---|---|
| **intimate** | 0.000 – 7.500 | 0–3 | −33.8 dBFS / −26.5 | A-minor drone pad only, no pulse. Alone, a stranger |
| **tension** | 7.500 – 20.625 | 4–10 | −30.3 / −21.7 | Pad breathes, arpeggio from about 11.25. **13.125: shimmer, low strings and ostinato enter.** **Four swell stabs at 18.750 · 19.219 · 19.688 · 20.156**. Stress and doubt |
| **breath** | 20.625 – 22.500 | 11 | −47.8 / −40.6 | Measured near-silence **20.564 – 22.505**: 50 ms level −52 / −48 / −37 dBFS (min / median / max), 26 dB under the anthem median. The weak moment |
| **LIFT** | **22.500** (attack 22.505) | 12 | | Hit, sub boom and crash, all at once |
| lift phrase | 22.500 – 30.000 | 12–15 | −22.9 / −13.9 | Full strings and the 128 BPM ostinato. Bar 14 (26.25–28.125) is the composer's breathing bar; the pulse keeps going. Crash at **28.125** |
| **anthem** | 30.000 – 37.500 | 16–19 | −19.8 / −11.0 | **30.0: phrase start in D minor, fuller orchestra.** 33.75: G (dominant). **35.625: sub drops out and a fill builds into the arrival** |
| **resolve** | 37.500 – 45.000 | 20–23 | −19.9 / −10.9 | **37.5: C-major arrival with a sub boom (logo hit)**, the loudest point (short-term −8.3 LUFS at about 39 s). The strings release from about 42 s. **Fade 43.5–45.0 only** |

**Accents for cuts** (`grid.json → accents`). Each one is scored as the strongest of three jumps at the beat line: broadband, <150 Hz minus 6 dB, and >2 kHz minus 3 dB.

- **Major:** 22.500 (LIFT, 30 dB) · 28.125 (crash, 10 dB) · 30.000 (phrase start, 13 dB) · 37.500 (arrival, 15 dB).
- **Medium:** 13.125 (shimmer entry) · 18.750 / 19.219 / 19.688 / 20.156 (stabs) · 22.969 / 23.438 / 23.906 (the ostinato settling, >2 kHz +12 to +14 dB) · 24.375 · 24.844 · 27.188 (+14 dB >2 kHz) · 29.063 · 30.469 · 33.750 (G) · 35.625 (fill).
- **Minor:** 11 more beats with 4–6 dB jumps.

### How the music lines up with the brief (a suggestion for SCRIPT.md)

| Time | Music | Brief line it can carry |
|---|---|---|
| 0.0 – 7.5 | Lonely pad | "We feel you, when you felt alone, a stranger" |
| 7.5 – 13.1 | The pad breathes, the arpeggio creeps in | "when you felt the stress" |
| 13.125 | Shimmer, strings and pulse enter | The stress builds: a new persona or location |
| 18.75 – 20.16 | Four stabs | Four fast cuts: charts, faces, sleepless screens |
| 20.56 – 22.50 | Breath (near-silence) | "when you felt weak". One line on screen, a heartbeat or breath SFX here only |
| **22.5** | **LIFT** | **"…and when you felt strong" / "with Axi you will never walk alone"** |
| 22.5 – 30.0 | Lift phrase, crash at 28.125 | "We know how hard the trader's mind is" |
| **30.0** | Second step up | **"Built by traders, for traders"** |
| 30.0 – 35.6 | D minor → G | "We walk with you through every obstacle and every bad moment" |
| 35.625 | Fill, sub out | Build into the payoff |
| **37.5** | **C-major arrival** | **Logo slam: "your partner broker when you succeed"** |
| 37.5 – 45.0 | Resolve and ring-out | Logo end card and the mandatory risk line. Keep the risk line on screen through the fade |

Mix notes:

- The 37.5 arrival is the loudest moment, and it sits under the end card on purpose, so that the brand lands on the resolution chord. If the risk line needs more air, duck the music 2–3 dB from about 39 s. Don't fade before 43.5.
- Keep sound effects out of the four stabs (18.75–20.16), because the music's own accents carry them.
- Put the breath and heartbeat SFX inside 20.56–22.50 and stop them by 22.48, so the lift hits from silence.

## Files

- `src/music/ad_music.wav`: the edit (gitignored; never distribute it on its own)
- `src/music/grid.json`: grid, sections, lift, breath, accents, fade, splices, source map, ride and `verification` (loudness, per-bar LUFS, grid fits, splice checks)
- `src/music/analysis/ad_music_spectrogram.png`: spectrogram, waveform with beats, onsets and the breath, and the 10 ms and short-term-LUFS curves, with sections and splices marked
- `src/music/mixkit_*.mp3`: the 20 candidates. `src/music/analysis/`: their `*.analysis.json`, spectrograms and `summary.json`
- `tools/music/build_emotional.py`: the edit and its verification. `analyze_music.py`, `musiclib.py` (`fit_grid` is used for the grid check) and the other tools in `tools/music/` are unchanged
