# 06 — Music and SFX: Spotting, Score Prompts, Procedural Effects (Step 6)

**Purpose.** Watch the user's Premiere cut, spot it, and write two score prompts per cue: Suno v6 and ElevenLabs Music v2.5. Then find the missing sound effects, make the approved ones with code, and use ElevenLabs SFX v2 only for the ones the user rejects.
**Output.** An approved spotting table and motif plan; per cue, a Suno package, an ElevenLabs composition plan and a conformed 48 kHz/24-bit WAV; an approved SFX gap list; procedural and fallback SFX mastered to −1 dBTP at 48 kHz/24-bit; zero-aligned stems and logs handed to 07-edit-mix-finish.md.
**Rule.** The picture sets the timing; prompts only approximate it. Claude cannot hear, so no sound counts as approved until the user has listened to it. Calendar (00-award-brief-and-calendar.md §0.7): music direction on the assembly D8–D11, spotting v1 on the rough cut D12, SFX analysis and spotting v2 on the fine cut D14, conform at picture lock D15, hand-off to 07 on D16.

Talk to the user in Arabic (address him as أبوستيشا). Write every prompt, Style box, composition plan, SFX prompt and file name in English.

---

## Inputs

| Input | From | Required |
|---|---|---|
| Premiere reference export: H.264 1080p at the sequence frame rate, timecode burned in (Export ▸ Effects ▸ Timecode Overlay), starting at 00:00:00:00 on the film's first frame | user (07 workflow) | yes |
| Dialogue-only WAV (DX), 48 kHz, same length as the reference | user, from Premiere (solo the DX tracks) | yes |
| Seedance-native audio WAV (all Seedance clip audio, no DX), same length | user, from Premiere | yes for 6.2 |
| Final Cut Pro XML of the sequence (File ▸ Export ▸ Final Cut Pro XML); clip names carry shot IDs | user | yes |
| Script, scene list, line IDs, languages | 01-script-and-dialogue.md | yes |
| Colour script (sequences 1–7) and variants R-DAY, R-INT, DREAM, BROADCAST, FINALE | 02-style-prefix.md | yes |
| Contact frames and events noted per shot ("train pass f97–f160, fist-bump contact f133") | 04-blender-blocking.md hand-off sheets | when present |
| Licences: Suno plan; ElevenLabs contract naming **Enterprise Music** | user → `evidence/licences/` | before any cue enters the edit |
| Audio-share rules R1/R2/R3 | 00 §0.4 | yes |

---

## Hard rules

1. **Picture is the timing authority.** Timestamps in a prompt are requests. Measure every returned cue and conform it to picture.
2. **Instrumental only.** No lyrics, vocals, choir, humming or chant. This keeps the score clear of the G rating and of language issues. Never generate or imitate Qur'an recitation, the adhan or hymns, in the score or as SFX. If the story needs a prayer call, ask the user: it can only be a cleared real recording placed with cultural review, never AI or code.
3. **Describe traits, never names.** No composers, artists, songs, films or franchises. Suno rewrites artist names, and ElevenLabs rejects them (`bad_prompt`, or `bad_composition_plan` for a plan). Never upload a copyrighted temp track to any generator.
4. **Licence before use.**
   - ElevenLabs Music: the Eleven Music Model-Specific Terms (updated 09 Oct 2026, read 30 Oct 2026) exclude "film, TV, radio, and Studio Games" on Free, Starter, Creator, Pro, Scale, Business **and Enterprise Music Lite**. Only **Enterprise Music** reads "All online and offline commercial use permitted".
   - Suno: commercial use needs a permitted download on a paid plan. Trial downloads are never eligible.
5. **Holdback (00).**
   - Suno songs are Link Only by default, and anyone with the link can open them. Never make one Public, never add one to a public playlist or album, and never share a link.
   - Run `watch` with `--engine local --no-whisper`, so the cut never leaves the machine (a local run with a Groq or OpenAI transcription backend would upload the audio).
   - Upload picture to Suno or ElevenLabs video-to-music only after the user says yes.
6. **No music from Seedance.** Music lives only in this step (02 AUDIO line). Seedance-native SFX and ambience count as Seedance audio under readings R2 and R3, while procedural code counts as non-AI under both, so keep every native sound that passes QA (00 §0.4).
7. **Paid generations.** Get the user's approval per batch. Never re-call a generation to "retry": each call is a new paid generation.
8. **Raw is sacred.** Never overwrite a downloaded or generated file. Keep raw, conformed and aligned files apart, version them, and checksum each one. Conforming writes a new WAV without the provider's metadata, so the raw file is the provenance record (C2PA or tags, if any): never delete or re-save it.
9. **Log for disclosure.** For every cue and SFX, log the tool, model and version, settings, prompt, date, take, licence and checksum. Keep the log 24 months.

---

## Procedure

### 6.1 Music

#### 6.1.1 Ingest and measure the cut

1. Ask in Arabic for the four exports (Inputs). Copy them to `06-audio/_in/` as `SLA_06_REF_v##.mp4`, `SLA_06_DX_v##.wav`, `SLA_06_SDFX_v##.wav`, `SLA_06_CUT_v##.xml`.
2. Measure. Never assume:
   - Frame rate and length: `ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate,nb_frames:format=duration -of compact SLA_06_REF_v03.mp4`. Use the exact rate in every TC↔seconds conversion (t = frame / fps).
   - Shots and cuts from the XML: `python3 -I` with stdlib `xml.etree`. For each `sequence/media/video/track/clipitem`, read `name`, `start` and `end` (frames at `rate/timebase`). A `start` of −1 marks a transition edge: use the neighbouring clip's value.
   - Cross-check cuts on picture: `ffmpeg -i SLA_06_REF_v03.mp4 -vf "select='gt(scene,0.3)',showinfo" -an -f null - 2>&1 | grep -o "pts_time:[0-9.]*"`.
   - Dialogue pockets: `ffmpeg -i SLA_06_DX_v03.wav -af silencedetect=noise=-45dB:d=0.35 -f null - 2>&1 | grep silence_`. The non-silent spans are the lines.
   - What Seedance already supplies: `ffmpeg -i SLA_06_SDFX_v03.wav -af ebur128=peak=true -f null -`. Make a spectrogram with `ffmpeg -i SLA_06_SDFX_v03.wav -lavfi showspectrumpic=s=1920x512:legend=1 sdfx.png` and Read the PNG.
3. **Watch** with the watch skill (0.3.x), once per colour-script sequence: `python3 "$WATCH_DIR/scripts/watch.py" SLA_06_REF_v03.mp4 --engine local --no-whisper --detail balanced --start 00:52 --end 01:34 --timestamps <cut and contact times>`. Use `--resolution 1024` only where HUD text matters. Read every listed frame and note the dramatic beats, contact frames and emotional turns. The local engine gives frames only (no `--question`, no sound), so the audio evidence comes from step 2 and the line text from 01.

#### 6.1.2 Spotting session (one row per musical phase, not per shot)

Write `SLA_06_SPOTTING_v##.md` using T1. For each cue, fill:

- **Cue ID**: stable `M01`, `M02`…. An insert becomes `M03A`. A dropped cue stays in the table marked `OMITTED`. Never renumber.
- **TC in / TC out** (HH:MM:SS:FF), and length in seconds.
- **Evidence**: the visible or audible event, with shot ID.
- **Function**, one word: establish · inner state · tension · transition · release · button · source (worldized) · silence.
- **Music action**: enter · hold · transform · drop · exit · silent.
- **Sync points.**
  - HARD lands within one frame. Allow at most one or two per cue.
  - SOFT lands inside a window, ±0.5 s by default.
  - Cause precedes reaction: when the music causes a visible reaction, put its onset just before the first frame of real movement, not the cut. Record the offset.
- **Dialogue pockets**: line IDs and spans from 6.1.1, and the treatment under each:
  - thin the 1–4 kHz band;
  - keep any busy melody out of the speech register;
  - put a low pulse or high air under lines;
  - save brass, impacts and big moves for the gaps.
- **Ending type**: hard button · decay · unresolved sustain · ring-out into SFX · cut to silence.
- **Motif**: which motif, in which transformation, or none.

Rules:
- Spot silence on purpose. Exit on story changes, not on every cut.
- Follow the 02 colour-script boundaries. A world switch (DREAM ↔ REAL) is a musical event, usually a change of sound world, not just a volume change.
- Two people's lines overlapping a cue is a mix problem for 07, not a reason to write a second cue.
- Under reading R3 (00 §0.4) every second of score counts against the Seedance audio share. Prefer purposeful silence and Seedance-native ambience to wall-to-wall music, and total the music seconds under T1.

**Motif plan (`SLA_06_MOTIF-PLAN_v##.md`; PROPOSED until the user decides).**
- A **human motif** for Miraj and his mother: acoustic, breath and bow noise, slightly imperfect timing.
- A **2nd Life motif** for the dream and Noah's world: quantised, glassy, exactly symmetrical phrases, "slightly too perfect", like the DREAM look.
- FINALE gives the human motif full warmth, with the 2nd Life motif absent or absorbed.

Define each motif by interval shape, rhythm, timbre and where it must **not** appear. Ask the user which instrument carries the human motif, and offer three directions:
- chamber (cello, felt piano);
- an instrument from Miraj's own background, which the user chooses;
- Gulf or Arab colour (oud, qanun, ney), used only when a character motivates it, never as exotic wallpaper.

Suno v6's handling of microtonal maqam is untested, so test one sketch before committing.

**Human authorship.** Ask the user to hum, sing or play each motif into his phone, 4–8 notes, without words. Store it as `SLA_06_MOTIF-<NAME>_USR_v01.wav` in `evidence/authorship/`. That recording is the human seed (6.1.6) and the evidence for 00 §0.11.

#### 6.1.3 Bar math: pick a tempo that lands the hits

One 4/4 bar lasts 240/BPM seconds; one 3/4 bar 180/BPM; one 6/8 bar 120/BPM (snowfrost/skill-movie; idea only).

To put a hit at cue-local time t on the downbeat after b bars of 4/4: **BPM = 240·b / t**. Keep the result inside the tempo range the cue's mood allows; otherwise change b.

When a hit is off the grid, try the cheapest fix first (idea from snowfrost, reworded):
1. re-bar the pickup or subdivide differently;
2. insert or drop a bar;
3. hold with a fermata, breath or break;
4. move where a phrase starts;
5. trim in the edit;
6. regenerate.

Stretch no more than ±5 %.

*Example, M01 "Pool Dream" (Seq 1, DREAM).*
- Cue 00:00:06:00 → 00:00:41:00, 35.0 s.
- The crowd water-entry morph is SOFT at about 17.5 s. The booth wake is HARD at 35.0 s, and the music stops dead.
- At BPM 96 a bar lasts 2.5 s: the morph falls on bar 8 (17.5 s) and the wake on the downbeat of bar 15 (35.0 s).
- Generate 40 s and cut in Premiere on that downbeat. The dead stop is designed, not generated.

#### 6.1.4 Choose the engine per cue, then write BOTH prompts

| Prefer | When |
|---|---|
| ElevenLabs Music v2.5 | the cue has a HARD sync inside it; sections must hold timecoded lengths (on v2/v2.5 the API documents section durations as always enforced); a section may need repair without re-rolling (inpainting); or the motif must carry over through `conditioning_ref` |
| Suno v6 | a long evolving cue (> 2:00) or a rich ensemble texture with SOFT sync only; palette exploration (v6-wild, then Cover the keeper on v6) |
| Both, A/B on picture | the hero cues: opening, world switches, finale |

Precondition for ElevenLabs: the Enterprise Music licence is on file (Hard rule 4). Until it is, Eleven cues are temp only. Show the user both prompt cards (T2) and the recommendation.

#### 6.1.5 Suno v6 package (the user pastes it into suno.com by hand)

**Settings** (Custom/Advanced mode ▸ More Options):

| Setting | Value | Status |
|---|---|---|
| Model | `v6` for finals; `v6-wild` only for an exploration pass. v6 and v6-wild need Pro or Premier. | official |
| Instrumental | On | — |
| Variety | **Off**. Above 0, Suno rewrites the style prompt. | official FAQ: "reduce the Variety slider to 0"; the default (Normal on v6) returning after a model switch is reported, so check it every session |
| Max Mode | On for every final and every cue over 2:00 | official ("costs more credits"; the UI's "2x", 20 instead of 10, is reported) |
| Weirdness / Style Influence | 25–40 % / 60–75 % on the UI sliders (cinematic band; defaults 50/50) | bitwize starting point, not official |
| Duration | Custom, set to cue length + 3–5 s for the edit. The reported range is 10 s–6:00, and it hard-cuts at the value. | reported; check in the UI |
| Credits | 10 per generation (two takes); max 8:00 per generation | official |

**Style box** (≤ 1,000 characters):
- Front-load it, with 5–10 descriptors that each add something new.
- Order: function and idiom → BPM and meter feel → key or mode → lead instrument and register → ensemble and density → dynamics arc → recording and mix space.
- Don't stack synonyms; don't use "epic" or "amazing"; no names.

**Lyrics box**: structure tags only, one per line, each with a 2–4-word direction.
- At most three descriptors inside each bracket.
- Never put anything in parentheses: parenthetical text gets sung.
- End with `[Outro: …]` then `[End]`.
- Bar counts in tags are honoured rarely (reported under 30 %). Record bar targets in T1 instead and land the hits through 6.1.3 and the edit.

**Exclude Styles**: 2–4 bare nouns, never "no X". On v6 an inline "no drums" is ignored (reported).

Worked example, M01 (text quoted into T2):
```
STYLE: Dreamlike cinematic underscore, 96 BPM steady 4/4, E major with a Lydian lift, glassy celesta
and harp arpeggios in exact sixteenths, airy high strings, soft analog pad, nothing below cello range,
pristine and too perfect, symmetrical phrases, sparse pad-only break at the midpoint, wide polished reverb
LYRICS:
[Intro: celesta and harp, pp]
[Theme: high strings enter, glassy]
[Break: pad only, sparse, mp]
[Theme: full shimmer, steady]
[Outro: sustained, unresolved]
[End]
EXCLUDE: vocals, choir, drums, trailer braams
SETTINGS: v6 · Instrumental On · Variety Off · Max Mode On · Weirdness 30 % · Style Influence 65 % · Duration 0:40
(the Break covers line S01-L01 at 22.0–25.5 s: no melody under speech)
```

Optional interpretation sketch, with the user's consent only: v6 Simple mode accepts text, audio, images and video in one prompt (official FAQ). Say whether the music follows cuts, motion or inner emotion, and ban literal SFX. Rebuild the keeper as a Custom package. Simple mode has no engineered Style box and no Exclude field, so it is never the final.

#### 6.1.6 ElevenLabs Music v2.5 composition plan

**Facts** (API reference and the official `elevenlabs/skills` music skill, read 30 Oct 2026):
- `POST /v1/music`. Set `model_id="music_v2_5"` explicitly: the API default is `music_v1`. The hosted MCP calls the model `eleven_music_v2_5`.
- `composition_plan` and `prompt` are mutually exclusive.
- A plan holds up to **30 chunks**, each **3,000–120,000 ms**, totalling 3 s to 10 min. Each chunk has:
  - `text`: labels `[Intro]`, inline cues `{…}`; plain lines are **sung**;
  - `duration_ms`;
  - `positive_styles` and `negative_styles`, up to 50 each, English only;
  - `context_adherence`: `low`, `medium` or `high` (the default).
- `force_instrumental` works in prompt mode only. In a plan, put "instrumental" in the styles and vocals in `negative_styles`.
- `seed` works only with a plan, and reproducibility is not guaranteed.
- Inpainting and `music.upload` are Enterprise features. `store_for_inpainting=True` returns a `song_id`. Audio-reference chunks `{song_id, range}` keep good audio. `conditioning_ref` (≤ 30,000 ms) with `condition_strength` `low`, `medium`, `high` or `xhigh` matches a feel; on the first chunk it colours every chunk.

**Writing rules:**
- One chunk per spotted state. A HARD sync sits **on a chunk boundary**: chunk N ends at the hit, and chunk N+1 opens with the change. Merge any state shorter than 3 s into a neighbour.
- Put 6–7 styles on the first chunk. It sets the tone.
- Put genre and instrumentation in the styles, not in the text.
- Use studio language ("close-mic'd", "bone-dry", "plate reverb"). Write "solo cello" for stem-like isolation. Mark silences explicitly. Describe sound, never visuals (official best practices).
- Use `context_adherence: "medium"` on the chunk where the music must turn, and `"high"` elsewhere.

M01 as a plan (`SLA_M01_EL-PLAN_v01.json`). The morph (17.5 s) sits on a chunk boundary; the 35.0 s wake is a designed cut, so the last chunk runs past it as an edit handle:
```json
{"chunks": [
 {"text": "[Intro]\n{celesta and harp arpeggios, pp}", "duration_ms": 10000,
  "positive_styles": ["instrumental", "dreamlike cinematic underscore", "96 BPM", "E major", "celesta and harp", "airy high strings", "pristine wide reverb"],
  "negative_styles": ["vocals", "choir", "humming", "drum kit", "trailer braams", "distortion"], "context_adherence": "high"},
 {"text": "[Theme]\n{high strings enter, glassy motif}", "duration_ms": 7500,
  "positive_styles": ["glassy motif", "symmetrical phrases"], "negative_styles": ["vocals", "drum kit"], "context_adherence": "high"},
 {"text": "[Break]\n{pad only, sparse, no melody, mp}", "duration_ms": 10000,
  "positive_styles": ["sustained soft pad", "sparse", "low density"], "negative_styles": ["vocals", "percussion hits", "busy melody", "high strings"], "context_adherence": "medium"},
 {"text": "[Hold]\n{full shimmer, steady, unresolved}", "duration_ms": 12500,
  "positive_styles": ["sustained shimmer"], "negative_styles": ["vocals", "resolution cadence"], "context_adherence": "high"}]}
```

**Run** (SDK; the hosted MCP music node takes only a prompt, `duration_seconds` 3–600, `lyrics_type` (auto · custom · instrumental), `instrumental`, lyrics and an optional audio input, so it **cannot** take a plan). The key stays in `ELEVENLABS_API_KEY`; never paste it into chat or logs.
```python
from elevenlabs import ElevenLabs
import json
client = ElevenLabs()
plan = json.load(open("SLA_M01_EL-PLAN_v01.json"))
res = client.music.compose_detailed(composition_plan=plan, model_id="music_v2_5",
                                    store_for_inpainting=True, output_format="mp3_48000_320")
open("SLA_M01_pool-dream_EL_v01_t1.mp3", "wb").write(res.audio)
print(res.song_id)   # write it into the cue log
```
- `pcm_48000` is listed as a format, but its channel layout is not documented. If you use it, wrap it with `ffmpeg -f s16le -ar 48000 -ac 2 -i in.pcm out.wav` and confirm the WAV's duration equals the plan total; at double the length the data is mono.
- **MCP fallback** (sketch only): a narrated prompt for the music node with `lyrics_type: instrumental` and `instrumental: true`, for example "Instrumental only. 96 BPM dreamlike underscore in E major: start with just celesta and harp, pp; at 0:10 high strings enter; at 0:17.5 drop to a sparse pad only, no melody; at 0:27.5 return to a steady shimmer to the end, unresolved. No vocals, no drums." Timing is weaker than with a plan.
- **Film-licence warning**, repeated on every T2 card: *ElevenLabs Music may enter the film only under an Enterprise Music contract. Enterprise Music Lite and all self-serve plans exclude film. The user's Enterprise purchase (BRIEF, 30 Oct 2026) still needs the contract or written confirmation filed in `evidence/licences/` and recorded in the ledger.*

#### 6.1.7 Motif continuity across cues and engines

- **Suno:**
  - Upload the user's motif recording (6.1.2) as audio. Cover or Audio Influence it with Variety Off, Max Mode on and Audio Influence high (65 %+).
  - Or, in Studio (Premier), take a keeper's stem and use **Get MIDI** (10 credits, official). Use the MIDI for re-orchestration and as authorship evidence.
- **ElevenLabs:**
  - Upload the motif (`music.upload`, Enterprise), or use the approved M01 `song_id`.
  - Put a `conditioning_ref` slice of up to 30 s on the first chunk of each later cue that carries the motif: `high` for a statement, `low`/`medium` for a distant echo.
- **Across engines:** this is untested for score. A/B by ear; if the motif drifts, the user's MIDI or recording is the reference.

#### 6.1.8 Audition, repair, conform

1. The user downloads keepers as WAV (Premier: 60 downloads a month; Studio workflows are not subject to the limits, official help). Save them unchanged in `music/raw/`.
2. Conform: `python3 -I scripts/sfx_forge.py master raw.wav -o SLA_M01_pool-dream_SUNO_v01_t2_48k.wav --mode safe`. This resamples to 48 kHz/24-bit and, only if the true peak exceeds −1 dBTP, applies one static gain down to it (never a limiter, so the delivered dynamics stay intact). Suno output is reported as 44.1 kHz; check it with ffprobe. For an MP3, decode first: `ffmpeg -i in.mp3 -c:a pcm_f32le in_f32.wav`.
3. Claude reviews each take in this order (diagnostic axes adapted from thenpceo, MIT; order paraphrased from snowfrost):
   1. interpretation: is the dramatic job right?
   2. structure and timing: are the states in order, and do the hits land near target? Check the onset spectrogram.
   3. identity: lead voice, tonal language, motif;
   4. dialogue safety in the pockets;
   5. the ending;
   6. artifacts: warble, smeared transients, phantom vocals, a mix that dulls after ~2:30, an energy curve that never dips.

   Report numbers and spectrogram readings, then ask the user to listen **on picture**.
4. Repair the smallest thing:
   - Suno: Replace Section, Extend or Cover with Variety Off (v6; check in the UI).
   - ElevenLabs: inpaint with reference chunks that keep the good audio and regenerate only the weak chunk.

   Feedback such as "timing perfect, instruments wrong" freezes structure: change one axis per pass.
5. Conform to picture with an edit map (T3):
   - cut at bar, phrase, cadence or transient boundaries, and hide joins under picture cuts or impacts;
   - crossfade 10–50 ms at transients, 0.5–2 s in pads;
   - stretch no more than ±5 % (Premiere Rate Stretch with Maintain Audio Pitch, Suno Studio tempo, or `ffmpeg -af rubberband=tempo=1.03` if the build has it).

   Verify that every HARD sync is within one frame and every SOFT one inside its window.
6. Stems: in Suno, Get Stems (Auto Split 12 / Split from Mix / Advanced Split on Premier). Expect bleed and near-silent placeholder stems (reported). Studio exports WAV as the full song, a range, or multitrack (official). Conform stems exactly like the mix and keep them sample-aligned.

### 6.2 SFX: gap analysis, approval, code generation

#### 6.2.1 Gap analysis (D14, on the fine cut)

Go through every shot. First say what Seedance already gives, then what is missing. Fill T4 with one row per event or bed:
- TC in/out and shot;
- event;
- family: hard FX · Foley · BG/room tone · designed · UI/hologram;
- Seedance state: good / weak / missing / wrong. "Wrong" includes music in a clip: send it back to 05-seedance-production.md for an audio-only edit ("Edit @Video1. Remove only the original background music. Keep the character dialogue, lip sync, ambience, and action sound effects…", from the user's seedance-2-5-prompts skill), or strip it;
- layers: transient / body / tail / sub / detail;
- perspective: close · medium · far · off-screen L/R · through glass · inside the lens HUD (band-limited);
- sync: HARD frame / SOFT window / BED;
- priority: **P1** story-critical, **P2** sells reality, **P3** texture;
- source: SD keep → PROC (recipe + args) → ELSFX (6.3).

Craft rules:
- **Hierarchy** (Murch): dialogue → story-critical sounds → music → effects → Foley. Keep two or fewer similar sounds at once unless density is the point.
- **One room per location**, and one material palette. Real spaces carry the mains-hum family: the UAE grid is 50 Hz and fluorescent ballasts buzz at 100 Hz. **DREAM carries no hum at all.** This adds a third sensory axis to the 02 rule that the dream must differ from reality.
- **Most cuts get no sound of their own.** Prelap the next scene's ambience 0.5–1 s across a cut (PROPOSED).
- **Sync grammar:**
  - a hit goes on the first frame of contact;
  - a whoosh peaks at the velocity peak;
  - the body or sub sits 20–120 ms after the transient;
  - a riser ends 30–250 ms before its hit;
  - a distant event arrives late by distance ÷ 343 m/s;
  - leave a silence pocket before key transients.
- **Event time** = XML frame ÷ fps. Check it on the frame itself: `ffmpeg -ss <t> -i SLA_06_REF_v03.mp4 -frames:v 1 f.png`, then Read the PNG.
- **G-rated:** no weapons or explosions. Impacts stay mild. No sirens or emergency tones that could mislead. No brand, OS or phone-notification sounds.
- **Captions:** mark meaningful non-speech sounds for the English subtitles in 07, for example "[booth door slides open]".

Ask in Arabic: «هل تعتمد قائمة المؤثرات الناقصة بأولوياتها ومصادرها قبل أن أولّدها؟»

#### 6.2.2 Generate approved rows with code

The script is `scripts/sfx_forge.py` (own code, stdlib + numpy + scipy, deterministic, py_compiled and tested 30 Oct 2026). Install with `pip install numpy scipy`, and always run it with `python3 -I`. It refuses to overwrite an existing file: to re-render, raise `"version"` in the spec (v02). Use `--force` only for test files nobody has heard.

```
python3 -I scripts/sfx_forge.py list
python3 -I scripts/sfx_forge.py render SLA_06_SFX-SPEC_v01.json --out 06-audio/sfx/proc
python3 -I scripts/sfx_forge.py one impact --dur 0.6 --args '{"material":"wood"}' -o test.wav
python3 -I scripts/sfx_forge.py analyze file.wav
```

Recipes (one-shots are built from attack 1–10 ms + body 10–150 ms + tail 0.2–2 s; `impact`, `glass` and `crowd_bed` also take distance and room):

| Recipe | Key args | 2nd Life use |
|---|---|---|
| `impact` | `material` metal_small · metal_large · wood · glass · concrete · plastic · soft; `size`, `force`, `distance`, `room` | robot fist-bump (metal_small, size 0.8, force 0.6) |
| `servo` | `pitch_hz`, `travel`, `grit`, `clunk` | robot's faulty leg (`clunk: true`) layered with `impact` concrete |
| `whoosh` | `f_lo`, `f_hi`, `peak`, `pan_from/to`, `tone`, `weight` | booth door slide, camera whips |
| `ui_tone` | `kind` tick · confirm · deny · open · close; `base_hz` | Halo earpiece: one `base_hz` for the whole film = one house palette |
| `hologram` | `base_hz`, `shimmer`, `glitch`, `open` | Noah's broadcast in the lens HUD |
| `room_tone` | `kind` apartment_night · booth_shop_fluorescent · metro_concourse · office_hvac · exterior_city_far · dream_air; `mains_hz` 50 | one bed per location; `dream_air` for DREAM |
| `crowd_bed` | `people`, `distance`, `room`, `energy` | metro and Food+ line walla; wordless by construction |
| `glass` | `kind` tap · clink · crack · shatter_small | glass doors, cups |
| `sub_boom`, `riser` | `f0`, `glide` / `f_lo`, `f_hi` | world-switch reveal; the riser ends at the file end |

Spec entry: `{"id": "S03-SH02_FX01", "name": "robot fist-bump contact", "recipe": "impact", "args": {...}, "dur": 1.2, "seed": 101, "variants": 3}`. Beds add `"loop": true, "master": {"mode": "lufs", "target": -38}`; give long sustained sounds such as `hologram` a LUFS target too, because peak mastering leaves them near −8 LUFS.

Every file is mastered automatically:
- 8× oversampled true peak, ceiling −1.0 dBTP;
- one-shots get **one static gain** to the ceiling ("peak");
- beds get a static gain to a LUFS target, then a true-peak limiter;
- written as 48 kHz / 24-bit PCM with TPDF dither;
- loudness by BS.1770 K-weighting with gating.

In tests the true peak and LUFS matched ffmpeg `ebur128` to 0.1. The script never uses `loudnorm`, whose "linear" mode silently turns dynamic.

PROPOSED bed targets, at file level only (07 sets the mix): room tone −38 to −42 LUFS · exterior −32 to −36 · walla −28 to −32 · dream_air −42 to −46.

**QA by numbers** (Claude cannot hear). Compare `analyze` output and a spectrogram PNG against these targets (from procedural-sfx, MIT):

| Sound | attack | t-20 | centroid |
|---|---|---|---|
| small hard click | < 2 ms | 10–60 ms | 2.5–6 kHz |
| wood or soft step | < 15 ms | 30–100 ms | 300–900 Hz |
| soft heavy thump | 2–10 ms | 100–300 ms | 40–200 Hz |
| whoosh | 80–250 ms | ≈ ⅓ length | 1–4 kHz |
| bell/ding | < 2 ms | > 800 ms | 1–3 kHz |
| bed/rumble | slow | `>end` | < 150 Hz |

Also check:
- `t-20 >end` on a one-shot means the tail is cut: lengthen `dur`.
- On loops, `seam_jump` ≤ 3.
- Repeated sounds (steps, impacts) need ≥ 3 variants with different seeds. Vary them in the edit by pitch ±5–10 % and level ±20 %, and never place identical neighbours.

Every file starts as **NOT EAR-APPROVED**. Give the user the audition table (T5) and ask in Arabic: «استمع لكل ملف واكتب: معتمد / أعِد بتعديل / بدّل إلى ElevenLabs». The user's word is the only approval.

### 6.3 ElevenLabs SFX v2 — fallback for rejected code results

Use it only for rows the user rejected, or for photoreal Foley that code cannot sell (real footsteps on a specific floor, cloth, liquids).

**Facts:**
- Model `eleven_text_to_sound_v2`, the default and the only SFX model in the hosted MCP. `POST /v1/sound-generation`.
- `duration_seconds` 0.5–30 (null = auto). `prompt_influence` 0–1 (default 0.3). `loop` is v2-only per the official skill.
- `output_format` includes `wav_48000` (API reference, 30 Oct 2026).
- The API also accepts `eleven_text_to_sound_v3`, but it is not in the MCP and is untested here. Use it only if the user asks.

**Prompt template** (one sound per generation; split transient, body and tail into separate generations when needed):
```
[source + action], [material], [size/weight], [perspective], [space], [layer role], [time shape], no music, no voice, no melody
```
Use no visual or cinematic words. Keep prompts short: one sentence, or a fragment.

| Asset | Parameters |
|---|---|
| synced one-shot | `duration_seconds` = event length + 0.2–0.5 s tail; `prompt_influence` 0.45–0.7 (production band, calesthio, MIT); `loop` false |
| bed | 15–30 s, `loop` true, `prompt_influence` ≈ 0.5, sparse foreground events (unique events give the loop away) |

Examples:
- `Small drinking glass slipping from a hand and shattering on a hard tiled floor, close-mic, bright sharp break transient, scattering tiny shards, short small-room reflections, no music, no voice` (2.0 s, 0.55)
- `Seamless loop of a small booth shop at night, steady fluorescent tube buzz, low air-conditioning hum, faint street traffic through a glass door, no voices, no music, no footsteps` (20 s, loop, 0.5)

**MCP route:**
- Generate on one flow. The variations land on one node; read their `generation_id`s and pin the user's pick.
- Never re-call to retry (Hard rule 7).
- Check the downloaded format with ffprobe; the format of MCP output is not documented here.
- If the user prefers the API, request `output_format=wav_48000` from the start: regenerating later makes a different sound.

**Finish:**
- `python3 -I scripts/sfx_forge.py master raw.wav -o …_ELSFX_v01_t2_48k.wav --mode peak` for a one-shot, or `--mode lufs --target -38` for a bed.
- Decode MP3 to float WAV first (6.1.8).
- Log the file as "other generative AI" (00 §0.4).

### 6.4 Naming, stems, logs, hand-off

```
AboStesha Films/SLA_01-second-life-ascent/06-audio/
  _in/       SLA_06_REF_v03.mp4 · SLA_06_DX_v03.wav · SLA_06_SDFX_v03.wav · SLA_06_CUT_v03.xml
  spotting/  SLA_06_SPOTTING_v02.md · SLA_06_MOTIF-PLAN_v01.md · SLA_06_SFX-GAPS_v01.csv
  music/prompts/  SLA_M01_PROMPTS_v01.md · SLA_M01_EL-PLAN_v01.json
  music/raw/      SLA_M01_pool-dream_SUNO_v01_t2.wav        (as downloaded, never edited)
  music/conform/  SLA_M01_pool-dream_SUNO_v01_t2_48k.wav · SLA_M01_EDITMAP_v01.csv
  sfx/spec/  SLA_06_SFX-SPEC_v01.json
  sfx/proc/  SLA_S03-SH02_FX01_robot-fist-bump-contact_PROC_v01_t1.wav · SLA_FX_PROC_manifest_v01.csv
  sfx/el/    SLA_S06-SH02_FX02_glass-shatter-small_ELSFX_v01_t2.wav (+ _48k)
  sfx/sd/    SLA_S03-SH02_SDFX_v01.wav                      (Seedance-native extract)
  stems/     SLA_06_MX_v01.wav · SLA_06_FX_v01.wav · SLA_06_FOL_v01.wav · SLA_06_BG_v01.wav
  logs/      SLA_06_cue-log.csv · SLA_06_sfx-log.csv · SLA_06_checksums.sha256
```

- **Name pattern:** `SLA_<CUE|SHOT|SEQn>_<FXnn|BGnn>_<slug>_<SRC>_v<NN>[_t<K>][_48k].wav`. Source codes: SUNO, EL (Eleven Music), PROC, ELSFX, SD (Seedance native), USR (the user's own recording). Use the film code the user approves (01 §1.2.8).
- **Stems for 07** (thenpceo, MIT):
  - one consolidated file per music cue, bed and event group;
  - **zero-aligned** to the film's first frame and **full picture duration**, with placement kept by silence;
  - 48 kHz / 24-bit;
  - names carry the bus: MX, FX, FOL, BG.

  DX stays 07's. 07 builds the DX/MX/FX stems and the M&E (for festivals and later dubs) from these.
- **Verify** with ffprobe: identical duration on every stem, 48000 Hz, 24-bit, no video stream. Write a checksum per file into `SLA_06_checksums.sha256`, and re-check the checksums at hand-off.
- **Audio share** (00 §0.4): add up stem-seconds by origin (Seedance-native / other generative AI / non-AI procedural) and write them to the ledger (`ledger-continuity-physics.md` owns the schema).
- **Placement:** if the Higgsfield pr_* tools are connected, placing files on named empty tracks is a 07 action, only with the user's permission.

---

## Output templates (what Claude shows the user)

**T1 — Spotting table** (shown with Arabic notes under each row)
```
SPOTTING v02 — 2nd Life: Ascent — cut SLA_06_REF_v03 (24 fps, 6:41:12) — motif plan v01
| Cue | TC in → out (s) | Evidence (shot) | Function | Action | Sync points | Dialogue pockets → treatment | Ending | Motif | Engine |
| M01 | 00:00:06:00 → 00:00:41:00 (35.0) | pool dream, crowd morph S01-SH04 | establish (seduce) | enter→transform | SOFT 17.5 s ±0.5 morph · HARD 35.0 s booth wake | S01-L01 22.0–25.5 → thin mids, pad only | cut to silence (designed) | 2nd Life, first statement | EL + Suno A/B |
| —   | 00:00:41:00 → 00:00:52:12 | booth wake S02-SH01..03 | silence | silent | — | — | — | — | — |
BPM: M01 96 (bar 2.5 s; morph bar 8, wake bar 15)   Bars recorded as targets, not tags.
Your decisions: motif instruments ____ · silences OK? ____ · engines ____
```

**T2 — Score prompt card** (one per cue): cue header (ID, TC, length, BPM, bars, HARD/SOFT points) → **Suno v6 package** (settings, STYLE, LYRICS, EXCLUDE, Duration) → **ElevenLabs Music v2.5 plan** (JSON file name, chunk table: label · ms · styles · adherence) → recommendation → the film-licence warning line (6.1.6) → credit estimate (Suno 10 per generation, 20 with Max Mode, reported).

**T3 — Cue log row** (`SLA_06_cue-log.csv`, append-only) and edit map
```
cue,title,engine,model,settings,prompt_file,gen_date,take,song_id_or_link,download_ref,licence_ref,raw_file,raw_sha256,conform_file,conform_sha256,stretch_pct,editmap,approved_by,approved_date,origin,seconds_in_film,human_authorship
M01,Pool Dream,SUNO,v6,"Variety Off;Max On;W30;SI65;Dur0:40",SLA_M01_PROMPTS_v01.md,2026-11-12,t2,<private link>,Premier dl 14/60,Suno Premier,…,…,…,…,+1.8,SLA_M01_EDITMAP_v01.csv,AboStesha,2026-11-13,other gen-AI,35.0,"motif hummed by user (SLA_06_MOTIF-DREAM_USR_v01.wav)"
EDITMAP: src_in,src_out,tl_in,tl_out,fade_in_ms,fade_out_ms,gain_db,note
```

**T4 — SFX gap list** (`SLA_06_SFX-GAPS_v01.csv`)
```
| ID | TC in → out | Shot | Event | Family | Seedance state | Layers | Perspective | Sync | Pri | Source plan |
| S03-SH02_FX01 | 00:01:58:13 | S03-SH02 | robot fist-bump contact f133 | hard FX | missing | transient+body | close | HARD | P1 | PROC impact metal_small 0.8 + soft |
| S03-SH02_FX04 | 00:01:55:02 → 00:01:56:10 | S03-SH02 | faulty leg step | Foley | weak | body+detail | medium | HARD | P2 | PROC servo clunk + impact concrete |
| SEQ2_BG01 | 00:00:41:00 → 00:00:52:12 | S02 | booth shop tone | BG | wrong (music bleed) | bed | room | BED | P1 | 05 audio edit; PROC room_tone booth_shop_fluorescent |
```

**T5 — Audition table** (after each render): `file · event · recipe/args or prompt · measured (TP, LUFS, t-20, centroid) · status NOT EAR-APPROVED · your verdict ____`.

**T6 — Hand-off sheet to 07**: stems list with durations and checksums; HARD sync list (TC, element); ducking notes per dialogue pocket (which stem thins, by how much); caption labels; audio-share totals; licence file references.

---

## Gate (what the user must approve)

- **G6-A, spotting:** T1 and the motif plan are approved; motif instruments are chosen; the user's motif recording is filed; the ElevenLabs Enterprise Music evidence is filed, or Eleven is marked temp-only. Ask: «هل تعتمد جدول الـ spotting وخطة اللحن لأبدأ كتابة طلبات الموسيقى؟» No generation before this.
- **G6-B, per cue:** the take is chosen by ear on picture; HARD syncs are within one frame; the conformed file is 48 kHz/24-bit with true peak ≤ −1 dBTP; the cue-log row is complete. Ask: «هل تعتمد النسخة tN من المقطع Mnn بعد الاستماع عليها مع الصورة؟»
- **G6-C, SFX list:** T4 is approved (priorities and sources) before any SFX generation.
- **G6-D, per SFX:** every P1 and P2 row is EAR-APPROVED. Nothing marked NOT EAR-APPROVED goes to 07.
- **G6-E, hand-off:** stems are zero-aligned, of equal duration and checksummed; logs and licences are filed; audio-share totals are in the ledger. This feeds G4 in 00 §0.10.

Silence or a change of subject is not approval.

---

## Common failures

| Symptom | Cause | Fix |
|---|---|---|
| Suno ignores the style, and the two takes differ wildly | Variety above Off; it came back after a model switch | Variety Off, every session |
| Drums or choir despite "no drums" | inline negative (ignored on v6) | Exclude Styles, 2–4 bare nouns; a leaner Style box |
| Stage directions get sung | parentheses or plain lines in Suno lyrics or in an Eleven chunk's `text` | brackets only in Suno; `[label]` + `{cue}` only in Eleven |
| Hit lands off the frame | prompt timestamps trusted | bar math (6.1.3); HARD sync on a chunk boundary; edit-map fix order; ≤ ±5 % stretch |
| Cue ends mid-phrase | Suno Custom Duration hard-cuts (reported) | generate +3–5 s and cut on a downbeat in Premiere |
| Score fights the lines | busy melody in the speech register | pocket treatment in the prompt; stems; 07 ducks stems before sidechain |
| Eleven call fails with `bad_prompt` / `bad_composition_plan` | artist or song named | read the returned `prompt_suggestion` / `composition_plan_suggestion`; describe traits; regenerate only with the user's approval |
| Eleven call with no `model_id` sounds dated | API default `music_v1` | always `model_id="music_v2_5"` |
| Composition plan rejected by the MCP | the music node has no plans | SDK route (6.1.6) |
| Eleven Music cue in the film without the right contract | self-serve or Enterprise Music Lite | Enterprise Music evidence first, or replace the cue |
| A cue leaked before 10 Jan 2027 | a song made Public, put in a public playlist or album, or its link shared | keep Link Only; never publish; never share links |
| Sound effect is "fine by numbers" but ugly | Claude cannot hear | the user auditions every row; P1 and P2 need ear approval |
| Synthetic-sounding repeats | identical takes | ≥ 3 seeds; pitch ±5–10 %, level ±20 % |
| Loop click every 30 s | non-loop bed; fades on a loop | `loop: true` (equal-power seam); `seam_jump` ≤ 3 |
| `render` stops with "output file(s) already exist" | re-render under the same version | raise `"version"` in the spec; never overwrite an auditioned take |
| Bed louder than wanted after mastering | peak mode used on a bed | `master` mode `lufs` with a target |
| "Target not reached" CHECK | the true-peak limiter cut it | lower the target or accept; never crush transients |
| Dream sounds like the real world | the same hum family in both | DREAM uses `dream_air`; no mains hum in the dream |
| Music inside a Seedance clip | the model added a score | 05 audio-only edit (Remove only the background music), or strip it and rebuild from SD/PROC |
| Prayer call or recitation used as texture | ambience realism over respect | remove it; ask the user (Hard rule 2) |
| Paid credits burned on retries | re-calling a generation | one call per approved batch; pin variations |

---

## Sources and credits

Quoted or adapted with credit (licence files checked in fresh clones, 30 Oct 2026):
- **thenpceo/cinematic-score-and-sfx-skill, MIT** (HEAD d48bb34, 2026-08-13). Adapted: picture as timing authority; hard/soft sync; cause-before-reaction; dialogue pockets; generating dependent elements together; revision axes and diagnosis; conforming one continuous cue; zero-aligned full-duration stems with checksums.
- **bitwize-music-studio/claude-ai-music-skills, CC0** (HEAD 597d928, 2026-10-13): `reference/suno/models.md`, `best-practices.md`, `creative-sliders.md`, `instrumental-tags.md`. Used: v6 model routing, Variety, Max Mode, Exclude format, field budgets, slider bands, Duration behaviour, stem modes, Suno Terms and downloads. Launch-week behaviour is marked "reported".
- **elevenlabs/skills, MIT** (HEAD 503d4e9, 2026-10-28): `music` (composition plans, inpainting, conditioning, `compose_detailed`, video-to-music) and `sound-effects` (parameters, `loop` v2-only, output formats).
- **calesthio/generative-media-skills, MIT** (HEAD 8c85352, 2026-07-14): `sound-design-foley` (spotting fields, layer roles, perspective, rights ledger, captions); `providers/elevenlabs-sound-effects` (`prompt_influence` bands, loop QA); `music-supervision-scoring` (stable cue IDs, temp-track translation, cue-log fields).
- **bianbianzhu/procedural-sfx, MIT, © 2026 bianbianzhu** (HEAD 5eff10f, 2026-09-28): attack/body/tail model, material table, metric targets, sync anticipation, static-gain mastering rationale, helper vocabulary and the look-ahead true-peak limiter design. `sfx_forge.py` rewrites every function and carries the credit in its header.

Paraphrased only (no licence file):
- **snowfrost/skill-movie** `score-and-mix-picture` (2026-08-23): bar-length formulas, off-grid fix order, ±5 % stretch cap, take-evaluation order.

Official sources checked 30 Oct 2026:
- help.suno.com: articles 13924481 (v6 FAQ: Variety, Max Mode, credits, models, multi-input), 13924801 (8 min), 13876865 (Pro 20 / Premier 60 downloads; Studio not limited; trial downloads not commercial), 13925249 (Studio WAV exports, Get MIDI 10 credits).
- Suno help (via search, 30 Oct 2026; articles 2565761, 2481537): new songs are Link Only by default; anyone with the link can still open them.
- ElevenLabs API reference: `/v1/music` (model ids, plan limits, `force_instrumental`, durations enforced on v2/v2.5, seed, formats) and `/v1/sound-generation` (v2/v3, ranges, `wav_48000`).
- ElevenLabs Eleven Music Model-Specific Terms (updated 09 Oct 2026); Music best practices.
- Hosted ElevenLabs MCP: `creative_get_model_guide` and `creative_get_model_schema` for `eleven_music_v2_5` and `eleven_text_to_sound_v2` (the music node has no composition plan).
- bradautomates/claude-video watch 0.3.2 (MIT, 03ceb42): `--engine local` (frames only; `--question` is Gemini-only), `--no-whisper`, `--detail`, `--start/--end`, `--timestamps`.

Unverified, and labelled so in the text: the Suno Custom Duration range and hard cut; the bar-tag adherence rate; inline negatives ignored on v6; 44.1 kHz Suno output; one download including stems; the 2× Max Mode cost; the ElevenLabs PCM channel layout; the MCP output format; `eleven_text_to_sound_v3` quality; maqam handling in Suno; cross-engine motif carry-over.

Carried over from the user's old skills:
- cinematic-pipeline STYLE_PREFIX_GUIDE: the audio-policy line per prompt.
- suno-ai-mastery: the "dynamic journey" idea (now per-section bracket directions) and iterating in passes. Its v4/v4.5 settings, inline negatives and artist references were dropped as wrong for v6.
- seedance-2-5-prompts (kept skill): the audio-only edit template for removing music from a clip.
