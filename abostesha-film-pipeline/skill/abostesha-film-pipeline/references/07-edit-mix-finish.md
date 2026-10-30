# 07 — Edit Review, Mix, Colour, Subtitles and Masters (Step 7)

**Purpose.** Take the user's Premiere fine cut to a set of signed masters: review the edit, place and level the sound, match colour between Seedance shots, add subtitles, titles, credits and the Summit intro, then export and QC every deliverable.
**How.** Use the Higgsfield connector's Premiere tools (`pr_*`) when they are connected. Work read-only by default, and change the cut only with explicit permission. When the tools are missing, give the user exact manual steps.
**Gates.** You run G3 Picture lock (D15) and the technical half of G4 Delivery (D18) from 00-award-brief-and-calendar.md here. 08-judge-panel.md sits between them on D17.

Talk to the user in Arabic (MSA, addressing him as أبوستيشا). Write every generation prompt in English, including Seedance edit prompts and ElevenLabs SFX or voice direction. **You cannot hear.** Every audio judgement must be a measurement or the user's ear, never your guess.

Evidence tags used below:
- `[DOC]` documented, with source and date
- `[TESTED]` run in this sandbox on 2026-10-30 (ffmpeg 6.1.1, libass)
- `[FIELD]` third-party field report
- `[HOUSE]` house heuristic: a starting point, not a rule
- `[UNVERIFIED]` not confirmed; check before relying on it

---

## Inputs

| Input | Where | Needed for |
|---|---|---|
| User's Premiere project and fine-cut sequence | user's machine, via `pr_*` or exports | everything |
| Downloaded Seedance originals and the ledger (job IDs, shot IDs, origins) | `films/<id>/` · ledger-continuity-physics.md | source check, Seedance share, VFX routes |
| Locked dialogue sheet: line IDs, SPOKEN, EN SUB, selected takes `SLA_<SHOT>_<LINE>_<CHAR>_T<NN>.wav` | 01-script-and-dialogue.md | dialogue lay-in, subtitles |
| Beat maps and lip-sync framing rules | 05b-acting-direction.md | lip-sync review |
| Hero frames per look variant (R-DAY, DREAM…), grade intent, grain/halation and matte decisions, `measure_frames.py` (§2.3) | 02-style-prefix.md | colour |
| Spotting list, SFX files, music cues with edit points | 06-music-and-sfx.md | sound placement and mix |
| Runtime budget, Seedance-share targets, G3/G4 lists, T2/T4/T5 test results | 00-award-brief-and-calendar.md | gates, provenance, intro conform |
| Official Summit intro file (downloaded on D0) | official award page → Google Drive "Download the intro" | Summit master |
| Names for credits, font licences, music/SFX licences | the user; `evidence/licences/` | credits, D3 |

Working folder: `films/<id>/07-finish/` with `snapshots/ review/ qc/vNN/ notes/ subs/ audio/ masters/`. Film 01 is `films/01-second-life-ascent/`, and its file code is `SLA`.

## Ground rules

1. **Permission ladder.** L0, the default: read the timeline, export references and frames, measure. L1: add markers or comments (ask once per session). L2: add new audio clips on empty tracks only (ask per batch). L3: change the cut by trimming, moving, replacing, deleting, retiming or applying clip effects (ask per item ID; the user approves in writing, "موافق على C03"). Silence is not approval.
2. **Never touch the user's sequence.** All writes go into a duplicate sequence the user has made: `SLA_FINE_vNN_CLAUDE`. The user merges it, or he keeps working in his own.
3. **Holdback (00 H1).** Never upload the film anywhere except the private or unlisted submission link. The `watch` skill's Gemini engine uploads the whole film to Google. Use it only with the user's explicit, per-film consent; default to local frames.
4. **Provenance (00 D5).** Never crop, blur, cover or scale away a watermark or credential. Never remux or re-tag a file that carries Content Credentials: fix the export and re-export. T4 decides which export chain keeps them.
5. **Seedance share.** Every fix route has a share cost (7.5). Prefer routes that keep Seedance pixels. Recompute the share at G3 and G4.
6. **Evidence (00 D2).** Save every snapshot, measurement, note, decision and export log under `07-finish/`. The Organizer may ask for them within 7 days and they must be kept for 24 months. Never rename an old file to look like a new export (calesthio media-qc-delivery, MIT).

---

## Procedure

Day plan (00 calendar):
- **D15:** 7.0–7.4, then G3 Picture lock.
- **D16:** 7.5–7.11, then hand-off to 08.
- **D17:** 08 judge panel; apply the non-story fix list through 7.4 L3 rules.
- **D18:** 7.12–7.13, then G4.

### 7.0 Connect and discover the live `pr_*` tools (start of every session)

1. Call `get_host_status` on the Higgsfield bridge server (if that tool is not exposed either, go straight to step 5). If Premiere is not listed, tell the user: «افتح لوحة Higgsfield داخل Premiere واضغط Connect، ثم أخبرني». The bridge plugins need Premiere 25 or later `[FIELD]`.
2. Discover the tools: ToolSearch `+higgsfield_premiere pr_`, or the server's tool list. **Never call a `pr_*` name from memory.** If a `pr_get_skill` loader exists (the same server has `ae_get_skill` and `bl_get_skill` for After Effects and Blender), load it first and follow it. On 2026-10-30 this session exposed only `c4d_*` tools, so no `pr_*` name in this module is verified.
3. Write `07-finish/pr-tools.md`: each discovered tool, READ or WRITE, and what it covers. The capabilities to look for are read sequence/tracks/clips, clip audio level and effects, markers, frame/sequence/audio export, overwrite vs insert, trim, move, volume and keyframes, effects, save and undo.
4. **Verify behaviour on a scratch sequence before the first write** (creating it is itself a write: ask first, and use only copies of media already in the project). The quirks below were found on community CEP-bridge Premiere MCPs on Premiere 25/26, not on `pr_*` `[FIELD]`:
   - An "add to timeline" call may be an **insert that ripples** everything after it. Use overwrite on an empty track. Overlapping sounds go on separate tracks.
   - Placement snaps to the video frame (1/24 s). Sub-frame accuracy comes only from a trimmed in-point.
   - Clip volume tops out at +15 dB. Level keyframes may use a shifted scale (pass desired dB − 15; 0.1778 linear = 0 dB). Read back after every write.
   - Audio effects (EQ, limiter, de-esser) may not be applicable through the API. Plan them as manual steps.
   - Premiere stores time as ticks: 254,016,000,000 per second, which is 5,292,000 per 48 kHz sample.
   - Full sequence dumps can exceed the tool output limit and are saved to a file. Parse the file.
   - The user edits in parallel. Re-snapshot before every batch and never reuse node IDs from an old snapshot.
5. **Fallback.** If `pr_*` is missing or a capability fails, keep going. Ask for the exports listed in 7.1 and hand over manual steps (Output template 4). Never stall the calendar on the connector.

### 7.1 Snapshot, safety copy and reference export (D15 morning)

1. Ask the user to run *File > Save a Copy* as `SLA_edit_vNN_preclaude.prproj` (not *Save As*, which would switch his open project to the copy), then duplicate the sequence to `SLA_FINE_vNN_CLAUDE`.
2. **Snapshot** to `07-finish/snapshots/<YYYYMMDD-HHMM>.json`:
   - sequence settings (expect 1920×1080, 24 fps, square pixels, 48 kHz);
   - every track and clip: name, source path, source in/out, sequence start/end, enabled, scale, volume;
   - every marker.
3. **Source check** with ffprobe on every picture source:
   - Each picture source must be a downloaded Seedance original, never a review export. At 1080p, Seedance 2.5 delivers 10-bit H.265 by default, or H.264 4:4:4 + PCM in `.mov` when `output_format: mov` is requested `[FIELD: BytePlus schema via research; confirm with ffprobe]`.
   - Flag any clip not 1920×1080, not 24/1 fps, or scaled above 100%. Above about 110% the softening is visible `[HOUSE]`.
4. **Reference export.** Export through `pr_*`, or ask the user to:
   - H.264 1920×1080, 24 fps, high bitrate: `07-finish/review/SLA_ref_vNN.mp4`;
   - full mix WAV, 48 kHz/24-bit: `SLA_ref_vNN_mix.wav`;
   - each submix soloed, once the 7.8 layout exists: `SLA_ref_vNN_DX.wav`, `_MX.wav`, `_FX.wav`.

   Judge exports, not timeline guesses.

### 7.2 Measurement pack (run before you form any opinion)

All commands `[TESTED]`. Write outputs to `07-finish/qc/vNN/`.

```bash
REF=SLA_ref_v07.mp4
# A. Spec of any file
ffprobe -v error -show_entries stream=codec_name,profile,width,height,pix_fmt,r_frame_rate,color_range,color_space,color_transfer,color_primaries,sample_rate,channels -show_entries format=duration -of json "$REF" > spec.json
# B. Picture cuts (scene changes)
ffmpeg -hide_banner -nostats -i "$REF" -vf "scdet=threshold=10" -an -f null - 2>&1 | grep -oE 'lavfi.scd.time: [0-9.]+' | awk '{print $2}' > cuts.txt
# C. Unintended black or frozen frames (a locked-off hold is legitimate: check each hit by eye)
ffmpeg -hide_banner -nostats -i "$REF" -vf "blackdetect=d=0.1:pic_th=0.98,freezedetect=n=-60dB:d=0.5" -an -f null - 2>&1 | grep -E 'black_|freeze_' > black_freeze.txt
# D. Loudness, true peak and LRA of any WAV
ffmpeg -hide_banner -nostats -i SLA_ref_v07_mix.wav -af ebur128=peak=true -f null - 2>&1 | sed -n '/Summary:/,$p' > loudness_mix.txt
# E. 12-frame strip around time T (cut or dialogue onset), real timecode burned in
S=$(awk -v t="$T" 'BEGIN{print t-0.25}')
ffmpeg -hide_banner -loglevel error -copyts -ss "$S" -i "$REF" -vf "scale=480:-1,drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=28:fontcolor=white:box=1:boxcolor=black@0.6,tile=6x2" -frames:v 1 "strip_$T.png"
# F. Frames for artifact review: 1 fps per shot, 2 fps for hero and identity shots
ffmpeg -hide_banner -loglevel error -ss "$IN" -to "$OUT" -i "$REF" -vf "fps=1,scale=1280:-1" "shot_${ID}_%02d.png"
```

Shot table from `cuts.txt` (pass the duration from `spec.json`):

```bash
python3 -I -c "
import sys; fps=24; c=[0.0]+[float(x) for x in open('cuts.txt')]+[float(sys.argv[1])]
d=[b-a for a,b in zip(c,c[1:])]
for i,(a,x) in enumerate(zip(c,d),1): print(f'{i:03d} in {a:8.2f}s len {x:5.2f}s ({round(x*fps)} f)'+('  <12 f: flash frame?' if x*fps<12 else ''))
print(f'ASL {sum(d)/len(d):.2f}s, {len(d)} shots')" 412.5
```

**Cross-check the cut lists.** Compare the timeline's cut points (from the snapshot) with `cuts.txt`, allowing ±1 frame:
- **Soft cuts** are timeline cuts that scdet did not detect, meaning the framing is nearly the same across the cut. Treat each one as a jump-cut candidate or an accidental split.
- **Ghost cuts** are scdet cuts with no timeline cut. They come from an internal Seedance cut, a flash, a pop or flicker inside a clip.

### 7.3 Edit review: rhythm, continuity, AI artifacts, jump cuts (D15, L0)

Watch the cut in four passes (after calesthio editing-montage, MIT, paraphrased):
1. silent picture: does the story read without sound?
2. audio only: do the argument, emotion and timing work without picture?
3. subtitles only: can a sound-off viewer follow?
4. full pass.

Then work through the four checks below. Every finding becomes a note card (Output template 1).

**a. Rhythm.** Put the shot table next to 01's scene list and 00's runtime budget (story 5:30–6:34 at lock; titles + story + credits ≤ 7:00).
- Cut when the information or emotion has landed, not when the clip ends. Priority order when rules conflict `[HOUSE, after Murch]`: emotion, then story, rhythm, eye-trace, screen plane, 3D space.
- After a turning line, hold the listener at least 1 s before cutting away `[HOUSE]`. Example: S11, the mother's "everything is fine" needs Miraj's face, not the next scene.
- Let the two worlds keep different rhythms (02, 05b): REAL Dubai handheld with longer takes, DREAM locked-off and deliberate. If the average shot length (ASL) is the same in every scene, the cut reads as monotone.
- Treat any shot under 12 frames that was not designed as a likely trim leftover (flash frame).
- Trim generated heads and tails. The first and last 6–12 frames of AI clips often wobble, smear or shift identity `[FIELD, calesthio]`; 04-blender-blocking.md generated 12-frame handles for exactly this.

**b. Continuity.**
- Check screen direction and the 180° line, eyelines, match on action, and props and wardrobe against the ledger. The threaded object is the Halo lens case.
- Check sun direction per shot (camera-relative sun in ledger-continuity-physics.md), time of day, and audio space.
- When continuity fails, choose one (calesthio): hide it (cutaway, crop ≤ 110%, a reaction), motivate it (time jump, dream logic), separate it (sound bridge), or regenerate it (7.5).

**c. AI artifacts** (paraphrased from Gregory-Esman video-qa, MIT, and calesthio). Compare the first, middle and last frame of each clip, and the locked sheets from 03:
- identity drift inside a clip and between the draft and the 1080p final (the final is a new render);
- hands and finger count; the contact frame of the robot fist bump against the frame logged in the ledger;
- garbled glyphs, logos or text on signage, screens and the Halo HUD (brand sweep, G3);
- plastic skin, helmet hair, glassy eyes, missing blinks; banding in Dubai sky and haze gradients;
- background boil or shimmer on hair, fabric, water, neon and crowds;
- REAL-world physics: feet sliding, weightless props, wrong water (DREAM exceptions only as declared in the ledger);
- non-speaking mouths moving (05b);
- music or voices hallucinated in Seedance's native audio.

**d. Jump cuts.** For every soft cut, decide intended or not. An unintended cut between similar framings needs a camera move of at least 30° or a clear change of shot size. Otherwise fix it with one of:
- a cutaway (an insert of the Halo case, Kabir's reaction);
- a J/L sound bridge;
- an alternate angle from 05;
- a punch-in of no more than 110%.

Write intended jump cuts into the notes (for example Miraj's sleepless-night compression) so that 08 does not flag them.

Severity (adapted from Leonxlnx/cinetic, MIT): **P0** is visible on a key beat or breaks the story; **P1** is noticeable on a normal viewing; **P2** is visible only on pause. Every note also gets a class: objective defect, likely defect, or opinion.

### 7.4 Apply cut changes (L3 only) and lock picture (G3, D15)

1. Show the notes sorted by severity. For each note the user picks:
   - (a) Claude applies it via `pr_*`;
   - (b) he applies it himself (manual card);
   - (c) regenerate (05-seedance-production.md);
   - (d) won't fix (keep the reason).
2. **L3 protocol for each approved item:**
   - re-snapshot;
   - apply one change in `SLA_FINE_vNN_CLAUDE`;
   - read it back;
   - export a 12-frame strip across the edit point and look at it;
   - log the change: item ID, before/after in/out, tool call.

   Never ripple. Never save the project unless the user asks.
3. **Seedance picture share.** From the final snapshot, sum the seconds of picture clips whose source path matches a Seedance job in the ledger, and divide by T (titles + story + credits; the intro is excluded).
   - Titles and credits over Seedance plates count.
   - A composite counts when the Seedance plate dominates (00 0.4).
   - Any clip not in the ledger counts as non-Seedance until proven otherwise.
   - Target ≥ 90%. Between 80% and 90%, G3 passes only with the user's written waiver and the reason; below 80%, G3 fails. (The Summit minimum is 70%, cl. 5.4; the margin covers the unpublished measuring method.)
   - Also record audio stem-seconds by origin per DX/MX/FX: Seedance-native / other generative AI / non-AI.
4. **Evidence export.** Ask the user for *File > Export > EDL* and *Final Cut Pro XML* of the locked sequence, saved to `evidence/edit/`.
5. Run the **G3 checklist** in 00 §0.10 and sign it with the user (see Gate below). After G3, picture changes come only from 08's fix list. Any change that alters frame count triggers a re-check of subtitles, stems and the lip-sync of the affected shots.

### 7.5 VFX cleanup routes, ranked by Seedance-share cost (D16)

| # | Route | Use when | Share effect |
|---|---|---|---|
| 1 | Trim or slip into the 12-frame handles | head/tail wobble, a bad blink, a short morph | none |
| 2 | Reframe ≤ 110% | edge garbage, a stray limb at the frame edge, never a watermark | none; slight softening |
| 3 | **Seedance edit task** (05 routes it; request `output_format: mov`) | local fix: a hand, a prop, a light colour, a background element | stays Seedance |
| 4 | Seedance bridge (transition) or forward/backward extension | a broken match cut, a clip too short for the beat | stays Seedance |
| 5 | Re-draft and re-finalise the shot (05) | identity, action or physics wrong across the clip; 4 of 4 takes failing the same way means the prompt is missing a variable | stays Seedance; costs calendar |
| 6 | Paint or composite in Premiere or After Effects (Higgsfield `ae_*`; load `ae_get_skill` first) | Arabic signage, small text cleanup, sky fix | counts only while the plate dominates |
| 7 | Other generative tools: Higgsfield Premiere plugin Reframe/Upscale/Edit Video/Draw-to-edit, Premiere Generative Extend | last resort | **non-Seedance** unless the tool runs Seedance; log the model, disclose it, never on faces |

**Seedance edit prompt** (adapted from the user's seedance-2-5-prompts skill, sections General editing / Audio editing). Duration is inherited (±0.3 s) and the aspect ratio is locked, so re-conform sound and subtitles after the swap.
```text
[Edit Goal] Edit @Video1. Only from {{t1}} to {{t2}} seconds, {{add/remove/replace/adjust}} {{object or region}}.
[Source Video Role] @Video1 is the sole editing master. It defines the characters, scene, actions, composition,
camera movement, occlusion, audio and event order.
[Target Material Role] {{@Image1 defines ... — omit if none}}
[Edit Scope] Modify only {{object, region, time range}}.
[Content to Preserve] Keep {{identity, wardrobe, expression, motion, lip movement, camera, light, ambience}} from @Video1.
⚠️ Watch: {{the 2-3 things the model is most likely to break in this shot}}
```
Worked example, S03-SH02, robot fist bump (04 logged the contact on f133 of the 7 s clip = 5.5 s):
```text
[Edit Goal] Edit @Video1. Only from 5.2 to 5.8 seconds, correct the robot's right hand to four jointed metal fingers
and one thumb closing into a fist.
[Source Video Role] @Video1 is the sole editing master. It defines the characters, scene, actions, composition,
camera movement, occlusion, audio and event order.
[Target Material Role] @Image1 (the robot hand close-up from the CHR_ROBOT sheet, 03) defines the hand's design and
finger count.
[Edit Scope] Modify only the robot's right hand and its contact with Miraj's knuckles.
[Content to Preserve] Keep Miraj's identity, hand, expression and timing, the robot's body and faulty leg, the
contact frame, the camera move, the noon light and the ambience from @Video1.
⚠️ Watch: finger count on the contact frame; Miraj's hand changing skin tone; the contact moving off its logged frame.
```
For an audio-only Seedance edit (for example removing hallucinated music), use three clauses: name the ONE channel with "only", list every channel that stays, and freeze the visuals, camera treatment and editing rhythm explicitly.

**Arabic signage** (03 never generates Arabic text):
1. Typeset on the blank surface 03 left, using the RTL text engine (7.10) or After Effects.
2. Track it with a planar or corner-pin track; match blur, grain and light.
3. A native reader checks spelling and direction.
4. Log the composite in the ledger as "Seedance plate + text".
5. The Halo emblem follows the same steps on the blank recess 03 left, and only after 00's trademark check clears the name.

### 7.6 Colour: correct, match, look, grain (D16)

Order (the 02 contract): correct → match each scene to its hero shot → show look → grain/halation → re-check text readability.

1. **Colour management.** Seedance clips are display-referred Rec.709 SDR. Never apply a log-to-709 LUT (02, calesthio).
   - Keep the sequence in Rec.709 SDR.
   - Check the BT.709 tags in `spec.json`. For an untagged source, set Rec.709 in the clip's colour interpretation (the menu location changed across Premiere 25–26 `[UNVERIFIED]`).
2. **Measure cut pairs.** For each cut, extract the frame 6 frames before and 6 frames after, plus the scene's hero frame from 02. Run `python3 -I scripts/measure_frames.py --csv before.png after.png hero.png` (02 §2.3). Flag a pair when `[HOUSE]`:
   - luma p50 differs by more than 0.05;
   - p1 (black level) differs by more than 0.03;
   - mean saturation differs by more than 0.05;
   - the shadow or highlight tints visibly disagree.

   Confirm every flag by eye.
3. **Match in Premiere** (Lumetri Color > Color Wheels & Match `[DOC Adobe help]`):
   - Turn on Comparison View, set the hero frame as Reference, and click Apply Match.
   - Leave Face Detection on when both frames contain faces; turn it off otherwise.
   - Fine-tune in Basic Correction. Match luminance and contrast before hue, and faces before backgrounds (calesthio).
4. **Look.** Use one adjustment layer per variant (R-DAY, R-INT, DREAM, BROADCAST, FINALE: 02 §2.5) carrying the show look matched to 02's hero frames (Lumetri Creative > Look `.cube` + Intensity). Never bake the look into sources.
5. **Protect** skin (no orange or green cast), the reserved accent colour (02) on its owner only, and Noah's neutral metal. Inspect sky gradients at 200%. If you see banding, it goes under grain, and the master is 10-bit ProRes.
6. **Grain** (02 decided it is added in post, uniformly): one top adjustment layer above all picture and below titles and subtitles.
   - Use a licensed scanned-grain overlay at low opacity (Overlay or Soft Light) or a plugin the user owns, and log its licence (D3).
   - The same grain goes on every shot, which hides the difference between draft-era and final textures.
   - Halation, if 02 approved it, goes only on true highlight edges.
7. **Flicker inside a clip.** A static grade will not fix it. Use route 3 or 5, or a deflicker plugin (log it).

### 7.7 Dialogue: lay in, sync, clean, futz (D16)

1. **Lay in.** Put the selected ElevenLabs takes on the DX tracks under each ON shot (track layout: Output template 3). Seedance's native track mixes its own voice with its effects. Keep it on `FX-SD` only where it carries no speech. Under ON lines, cut it out and let `FX-BG` room tone fill, or ask 05 for a Seedance audio edit that removes only the dialogue (three-clause rule, 7.5). If T2 showed that Seedance's own voice is usable and syncs better, the user may choose it. Record the origin in the ledger, because it moves the audio share.
2. **Lip-sync check, per ON line.**
   - Make a strip (7.2 E) at the audio onset, which comes from the clip start or from `silencedetect` on the DX stem.
   - Find the first frame where the lips form the first phoneme. Bilabials (p, b, m) are the clearest.
   - Offset = audio onset − mouth onset.
   - Rule: audio must **never lead the picture by more than 1 frame**, and may lag by **2 frames at most** at 24 fps. Basis: ITU-R BT.1359 detectability is about +45 ms with sound leading and −125 ms with sound lagging `[DOC, ITU PDF via search 2026-10-30]`; 1 frame = 41.7 ms. T2 in 00 set ≤ 2 frames on close-ups.
   - Fix: slip the clip in whole frames; for sub-frame moves, turn on *Show Audio Time Units*. If drift grows mid-line, split at a pause and slip each part.
   - Do not time-stretch speech by more than 2% `[HOUSE]`. If that is not enough, re-draft (05) or cut to the listener (05b, snippet D).
3. **Clean** (calesthio dialogue-editing-adr, MIT, paraphrased):
   - Clip gain phrase by phrase before any compression.
   - High-pass at or below 100 Hz (Netflix dubbing guidance via calesthio).
   - De-ess before the final limiter.
   - Fix artifacts locally (de-click, regenerate the line in ElevenLabs) instead of broadband noise reduction, which makes AI voices worse.
   - Crossfade every clip boundary.
   - Run room tone or ambience on `FX-BG` under every gap. Never cut to digital silence.
4. **Futz and worldize.** 01 keeps the stems dry and colour is added here. Starting values are `[HOUSE]`; the user's ear decides.

| Treatment | Where in 2nd Life | Premiere effects, in order | Start values |
|---|---|---|---|
| PHONE | S11, the mother on Miraj's phone | Parametric Equalizer → Distortion (light) | HP 300 Hz, LP 3.4 kHz, +3 dB at 1.5 kHz; −3 dB vs ON lines |
| EARPIECE | Halo assistant in Miraj's ear | Parametric Equalizer | HP 200 Hz, LP 7 kHz, +2 dB at 3 kHz; dry, centred |
| BROADCAST | Noah's keynote across the plaza (VO, no lip-sync) | EQ → Convolution Reverb (outdoor or large-hall IR) → Delay | HP 150 Hz, LP 8 kHz; reverb 15–25% wet; one 90–120 ms slap at −12 dB; wetter as the camera moves away |
| SCREEN | Noah on a palm screen | EQ → small-room reverb | HP 250 Hz, LP 6 kHz; reverb 5–10% |
| DREAM | 2nd Life booth worlds | none: dry and slightly close | ask the user; matches the shadowless DREAM look |

### 7.8 Effects, music, mix and stems (D16)

1. **Placement.** 06 owns spotting and creation. In 07 you place, time and level. Sync grammar (sfx-mix-edit research, after snowfrost and vlad7329 premiere-sfx-design, MIT):
   - A hit lands on the first clearly visible frame. In-points and subtitle times run 0.05–0.5 s early.
   - A whoosh peaks on the motion's velocity peak.
   - The low body layer comes 20–120 ms after the transient.
   - Pre-lap ambience across scene cuts (J-cut).
   - Clear a silence pocket before key hits.
   - Most cuts get no sound of their own.
2. **Via `pr_*`, L2 only.** Use new empty tracks and overwrite, never insert. Give overlapping sounds separate tracks. Vary repeated sounds in level and pitch, with no identical neighbours. Re-read the tracks after every batch.
3. **Hierarchy** (Murch, paraphrased): dialogue, then story-critical sounds, then music, then effects, then Foley. Keep two or fewer similar sounds at once unless you want texture (the "law of two-and-a-half").
4. **Music.** Edit at the bar lines 06 supplies, and end on a musical button, not a fade-out.
   - Duck under dialogue with *Essential Sound > Music > Ducking* (duck against Dialogue, reduce about 8–10 dB, then hand-ride the keyframes) `[HOUSE values]`.
   - Where speech is essential, aim for background at least 20 dB below it (WCAG 2.2, via calesthio) where the scene allows.
5. **Ears and second checks.**
   - Mono fold-down: `ffmpeg -i mix.wav -af "pan=mono|c0=0.5*c0+0.5*c1,ebur128" -f null -`. Compare the result with the stereo reading; dialogue must survive.
   - Ask the user: «استمع بالسماعة ثم بالهاتف ثم بسماعات اللابتوب: هل تُفهم كل كلمة؟ هل يغطي أي صوت جملةً؟». Fix intelligibility by lowering music or effects, never by raising the master.
6. **Stems.**
   - Route every track to a submix: DX, MX, FX. FX holds Seedance native sound, procedural and ElevenLabs effects, Foley and all BG/room tone, so the M&E keeps its atmosphere.
   - Print the stems with the Mix-track limiter bypassed; otherwise document that the stems are pre-master.
   - Null test `[TESTED]`. The residual peak should be −inf, or below −60 dBFS when dither is involved:
```bash
ffmpeg -hide_banner -nostats -i PM.wav -i DX.wav -i MX.wav -i FX.wav -filter_complex "[1:a][2:a][3:a]amix=inputs=3:normalize=0[s];[s]volume=-1[i];[0:a][i]amix=inputs=2:normalize=0,astats=measure_perchannel=none" -f null - 2>&1 | grep -E 'Peak level dB'
```
   - M&E = MX + FX, the same length and start as the printmaster. It is the base for any later Arabic or other dub of the Episode 0 pitch.

### 7.9 Loudness: one mix, two masters (D16; re-measured on D18)

| Master | Used for | Target | True peak | How |
|---|---|---|---|---|
| **PRINTMASTER** | festivals, finalist screening format, archive, later DCP | dialogue-anchored, about **−27 LKFS dialog-gated ±2 LU** | ≤ −2 dBTP | Mix at a fixed, written-down monitor volume; no limiter-driven loudness. `[DOC]` Netflix Sound Mix Spec v1.6 (via calesthio, verified 2026-07-10) is used here as a proxy: no theatrical LUFS standard exists. In a calibrated room, set 85 dBC per screen channel for −20 dBFS pink noise (SMPTE RP 200); small rooms often use 79–82 `[HOUSE]`. |
| **SUMMIT/WEB** | submission link, public vote, venue file unless the Organizer asks for another | **−16 LUFS integrated ±1** `[HOUSE]`: no platform publishes a target; AES TD1008 examples sit at −16 to −18 | ≤ −1 dBTP **after the AAC encode** | Printmaster + one static gain + a limiter. If reaching −16 needs more than about 4 dB of limiting on more than a handful of hits, deliver quieter (down to −18) and note why. |

- **Measure** with ebur128 (7.2 D). For dialog-gated loudness use a real meter on the user's machine: the iZotope Insight 2 "Netflix" target or NUGEN VisLM `[DOC: vendor pages via search 2026-10-30]`. Without one, use this proxy and label it "proxy, not Dolby Dialogue Intelligence" `[TESTED]`:
```bash
ffmpeg -hide_banner -nostats -i DX.wav -af silencedetect=n=-45dB:d=0.3 -f null - 2>&1 | grep -oE 'silence_(start|end): [0-9.]+'
# turn the gaps between silences into speech ranges, then measure the full mix only there:
ffmpeg -hide_banner -nostats -i PM.wav -af "aselect='between(t,1.20,3.85)+between(t,5.10,9.40)',asetpts=N/SR/TB,ebur128=peak=true" -f null - 2>&1 | sed -n '/Summary:/,$p'
```
- **Static gain, not loudnorm.** Gain = target − measured. Apply it only if measured true peak + gain stays under the ceiling; otherwise the limiter takes the rest. ffmpeg `loudnorm` in linear mode silently switches to dynamic compression when the target is out of reach, so do not use it on the film (bianbianzhu procedural-sfx, MIT, paraphrased).
- **In Premiere:** Loudness Meter on the Mix track for live reading (presets include EBU R128 and ATSC A/85 plus platform presets `[DOC Adobe help, via search]`). For the web pass, Hard Limiter on the Mix track with the ceiling at −2.0 dB. It is not documented as a true-peak limiter, so leave margin and measure the encoded file.
- **The Summit intro is never re-levelled.** Measure it, and if it differs from the film by more than 3 LU, tell the user and let him decide.

### 7.10 Subtitles: English (mandatory) and the Arabic track (D16)

**Sources.**
- Text: the EN SUB cells from 01 (01 already budgets characters per line).
- Times: from the DX clip positions in the snapshot. A fallback is word timestamps from the DX stem: ElevenLabs `creative_transcribe_audio` with the user's consent and credits, or a local WhisperX via `watch` 0.3.x.
- Never time from the script.
- **Time base.** The master SRTs count from the first frame of the film sequence (main title) = `00:00:00,000`; subtract the sequence start if it is `01:00:00:00`. The Summit file has the intro (and any black) in front, so it gets a shifted copy (7.11).

| Rule | English (Netflix EN-US guide `[DOC 2026-10-30]`) | Arabic (Netflix Arabic guide `[DOC 2026-10-30]`) |
|---|---|---|
| Line length / lines | 42 characters, 2 lines, bottom-heavy pyramid | 42, 2 lines, avoid a lone word on line 2; never split verb–subject, construct–genitive (iḍāfa), noun–adjective, preposition–object or number–counted noun |
| Reading speed | ≤ 17 cps (children's limit, chosen because the film is rated G); 20 is the adult ceiling | ≤ 17 cps (children's); 20 adult |
| Italics | only when the speaker is not physically in the scene: PHONE, Halo in the ear, Noah's broadcast or screen | **no italics at all** |
| Numbers | 0–10 as words, 11+ as numerals ("6,300"); ages always numerals | 1–10 in words (not times or dates), 11+ numerals, comma thousands separator; digits: Western (house choice: the guide's examples use them; ask the user) |
| Language | — | MSA only, never dialect |
| Two speakers | leading hyphen, one speaker per line | hyphen + space, one speaker per line |
| Ellipsis | single character `…` | single character `…` |

**Timing** (Netflix General Requirements + Subtitle Timing Guidelines `[DOC 2026-10-30]`):
- **Duration:** each event lasts at least 20 frames at 24 fps and at most 7 s.
- **Gaps:** at least 2 frames between events. At 24 fps, close gaps of 3–11 frames to 2 frames, or open them to at least 12.
- **In-time:** on the first frame of audio (±1–2 frames).
- **Out-time:** ideally 0.5 s after the audio ends; never extend it further just to close a gap.
- **Shot changes:**
  - If speech starts on a cut or within 0.5 s after it, put the in-time on the cut's first frame.
  - If an out-time falls within 0.5 s before a cut, extend it to 2 frames before the cut. If the speech ends before a cut and nothing follows, still end 2 frames before the cut: a subtitle crosses a cut only when the speech does.
  - When the speech crosses a cut, end the event 2 frames before the cut or at least 0.5 s after it, if reading speed allows.

Use `cuts.txt` for the shot changes.

**Worked example (S11-L09, 01's dialogue sheet):** the mother on the phone, Urdu, MODE PHONE, so English italics. The audio runs 00:03:12,042–00:03:14,292; the out-time may go 0.5 s past it, so the event lasts 2.75 s. Too fast as written, so condense the text, never the performance:
```srt
9
00:03:12,042 --> 00:03:14,792
<i>If I can't see you…
know I'm proud of you.</i>
```
- As written in 01: "If I don't get to see you… / know I'm proud of you." = 48 characters in 2.75 s = 17.5 cps. FAIL at 17.
- Condensed: 41 characters in 2.75 s = 14.9 cps. PASS. The user approves every condensation, because it changes his words.
- Arabic cue 9, no italics: `إذا لم أستطع أن أراك…` / `فاعلم أنني فخورة بك.` (41 characters, 14.9 cps).

**Validator** `[TESTED]`: `scripts/srt_check.py` (original code, standard library only). It checks lines, characters (tags, `{\an8}` overrides, bidi marks and diacritics do not count), cps, duration, gaps, frame alignment and `...`; with `--lang ar` also italics and a BOM. Exit code 1 means fix or get the user's waiver.
```bash
python3 -I scripts/srt_check.py subs/SLA_subs_en_v03.srt                   # 17 cps target
python3 -I scripts/srt_check.py subs/SLA_subs_ar_v03.srt --lang ar
python3 -I scripts/srt_check.py subs/SLA_subs_en_v03.srt --max-cps 20      # 01's hard ceiling, for waivers
```

**Burn-in, route A (Premiere; preferred because the export keeps whatever T4 says survives).**
1. Import the SRT as a caption track and style it in Properties. Save the style.
2. For Arabic, set the text engine to *South Asian and Middle Eastern* (Preferences > Graphics). Arabic RTL caption bugs are reported on the Adobe forums `[FIELD]`.
3. Export with *Captions: Burn Captions Into Video* only for burned masters, and set *None* for clean ones. Community reports from 2026 say captions can burn in by default, so check before every export `[FIELD]`.
4. Verify a still of three cues: letters joined, punctuation on the left for Arabic.

**Burn-in, route B (ffmpeg; only if T4 shows no credential to lose, or the user accepts and it is disclosed).** The input is an intermediate, not a deliverable: the SUMMIT sequence (intro + film, WEB mix) exported as ProRes 422 HQ with Captions *None*. Never use the clean master #3: it has no intro and carries the PRINTMASTER. Burn the shifted SRT from 7.11. `[TESTED]`, BT.709 tag chain from Leonxlnx/cinetic (MIT):
```bash
ffmpeg -i SLA_summit_textless-tmp_v03.mov -vf "subtitles=SLA_subs_en_summit_v03.srt:force_style='FontName=Noto Sans,FontSize=16,Outline=1.2,Shadow=0,MarginV=24',scale=out_color_matrix=bt709:out_range=tv:flags=accurate_rnd+full_chroma_int,format=yuv420p,setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709:range=tv" -c:v libx264 -preset slow -crf 16 -profile:v high -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -r 24 -c:a aac -b:a 384k -ar 48000 -movflags +faststart SLA_summit_en-burned_v03.mp4
```
- In libass, `FontSize=16` is about 50 px cap height at 1080 lines, and 42 characters fit `[TESTED by eye]`.
- **Arabic:** use `FontName=Noto Naskh Arabic` and add `Encoding=-1` to `force_style`. libass then detects the base direction; without it, the sentence-final period jumps to the right edge `[TESTED]`. An alternative is a trailing U+200F (RLM) on each line.
- Fonts: Noto Sans / Noto Naskh Arabic (SIL OFL; log in D3). White text with a thin black outline, bottom centre, inside 90% title-safe. Move a cue to the top when it would cover in-picture text or a mouth in a close-up.

**Arabic track.**
- Deliver it as a sidecar `SLA_subs_ar_vNN.srt` (UTF-8 without BOM) with the same cue boundaries as EN, then re-check cps.
- Never back-translate from the English. For Urdu and Hindi lines, start from the user's Arabic original in 01 (in MSA, spelling fixed) and check it against the SPOKEN text so it says what is heard; the user or a native reader reviews (origin `T`).
- Noah's MSA lines get same-language subtitles, condensed only when over 17 cps.
- An AR-burned screener is made only when 09-release-and-festivals.md asks (Arab festivals).

### 7.11 Summit intro, main title and end credits (D16)

1. **Intro** (official: "Ensure to have the intro added before your film" `[DOC page 2026-10-30]`):
   - ffprobe it (T5) and place it at the head of the SUMMIT sequence only, never on the clean masters.
   - Untouched: no trim, grade, scale, retime or level change.
   - If its frame rate is not 24, use Frame Sampling (never Optical Flow or Time Interpolation), note it, and ask the Organizer if T5 flagged a conflict (00 §0.9).
   - Cut straight to the film, or put 12 frames of black between: the user chooses.
   - Subtitles: give the SUMMIT sequence its own caption track; do not count on captions inside a nested film sequence reaching the export `[UNVERIFIED]`. Import a shifted copy, where the offset is the intro duration plus any black: `python3 -I scripts/srt_check.py subs/SLA_subs_en_v03.srt --shift 15.5 --out subs/SLA_subs_en_summit_v03.srt`. Check the first cue lands on its line.
2. **Main title** ≤ 6 s and **end credits** ≤ 20 s, both over Seedance plates (00 §0.4), inside 90% title-safe.
   - Credits as 5–6 cards of at least 3 s each, not a fast roll `[HOUSE]`.
   - Typeset the Arabic title with the RTL engine; a native reader checks it.
   - The title name waits on 00's trademark check.
3. **Credits** (Output template 5) name the human roles and every AI tool, matching the disclosure (09).
   - No tool, partner or Summit logos (00 R2); text names only.
   - Never invent a name: ask the user for each one.
   - Ask whether "Claude (Anthropic)" appears in the credits; it must appear in the disclosure either way.
4. **Recompute runtime:** story, titles + story + credits (≤ 7:00), and the total with the intro.

### 7.12 Masters and deliverables (D18, after 08's fixes)

File names follow `<project>_<deliverable>_<locale>_<aspect>_<duration>_<spec>_<version>_<YYYYMMDD>.ext` (calesthio media-qc-delivery, MIT). Increment the version when pixels, audio, subtitles or metadata change.

| # | File | Spec | Audio |
|---|---|---|---|
| 1 | `SLA_summit_en-burned_16x9_7m07s_h264-1080p24_v05_20261117.mp4` (intro + film + burned EN) | H.264 High, 1920×1080, 24 fps CFR, yuv420p, BT.709 tags, VBR 2-pass target 30 Mb/s, max 40 `[HOUSE]` | AAC-LC 48 kHz stereo 384 kb/s `[DOC YouTube via calesthio]`, WEB master |
| 2 | same content as `…_prores422hq_…mov` | ProRes 422 HQ 10-bit; about 9 GB for 7 min (Apple: ~220 Mb/s at 1080p29.97, so ~176 Mb/s at 24p; ProRes is per-frame `[DOC Apple ProRes white paper, scaled]`) | PCM 48 kHz/24-bit, WEB master |
| 3 | `SLA_clean_xx_16x9_6m52s_prores422hq_v05_20261117.mov` (no intro, no subtitles, with titles and credits) | as #2 | PCM, PRINTMASTER |
| 4 | `SLA_textless-elements_…mov` | clean plates under every title, credit and composited text, 2 s black between | none |
| 5 | `SLA_printmaster_stereo_48k24_…wav`, `SLA_web-master_…wav`, `SLA_stem-DX/MX/FX_…wav`, `SLA_ME_…wav` | 48 kHz/24-bit, same start and length, null-tested | — |
| 6 | `SLA_subs_en_…srt`, `SLA_subs_ar_…srt` (+ `.vtt` if a host wants it) | UTF-8, validated | — |
| 7 | `qc/`, `manifest-sha256.txt`, `delivery-sheet.csv` | 7.13 | — |
| — | DCP | later, from #3 plus an LCR or 5.1 mix; a stereo L/R mix alone does not meet the Academy rule. Owned by 09-release-and-festivals.md | — |

**Premiere export (manual card).**
- Export mode: Format H.264 or QuickTime (Apple ProRes 422 HQ); Match Source; 24 fps; Use Maximum Render Quality; Render at Maximum Depth for ProRes.
- Captions set per file (#1 and #2 burn the shifted EN track; all others None).
- **Content Credentials** section (below the output preview in Export mode) on, per T4. Media Encoder 26.2 (April 2026) documents it in Export Settings; the Premiere help page documents it in Export mode; supported formats are not confirmed for ProRes `[DOC Adobe help, via search 2026-10-30]`, so T4 decides.
- No timecode or image overlays.

Make the checksums after the files are in place: `sha256sum masters/* audio/* subs/* > manifest-sha256.txt`. Back everything up in two places (00 D2).

### 7.13 Final QC (technical half of G4, D18)

Run on every exported file, not the timeline. Store `qc/v05/<file>.txt`.
- [ ] ffprobe: 1920×1080, 16:9, `r_frame_rate=24/1`, the expected codec/profile, BT.709 tags with tv range, 48 kHz stereo, duration as planned (±1 frame).
- [ ] ebur128 on each file: WEB −16 ±1 LUFS (integrated on the film only: add `-ss <intro duration>` before `-i` for #1 and #2) and ≤ −1.0 dBTP over the whole encoded MP4; PRINTMASTER dialog-gated −27 ±2 and ≤ −2 dBTP. Record LRA.
- [ ] blackdetect/freezedetect: no unintended black; nothing at head or tail except the planned 12 frames.
- [ ] Burned subtitles visible at 5 sampled cues (stills); none burned into #3; validator passes EN and AR.
- [ ] Intro first, unaltered (frame count and audio level match the source, or the Frame Sampling conform is noted); story runtime and the ≤ 7:00 total re-measured.
- [ ] Stems null-test; M&E complete; DX contains no music or effects.
- [ ] Content Credentials present as T4 predicts (`c2patool` if installed); no watermark cropped or covered.
- [ ] The user watches #1 in full, once on a large screen and once on a phone with headphones.
- [ ] The private or unlisted link plays logged-out, on another device, at 1080p, with subtitles, and is not discoverable.
- [ ] Seedance share and audio-origin table final; credits match the disclosure; delivery sheet and manifest done.

---

## Output templates (what Claude shows the user)

**1. Edit note card** (`07-finish/notes/notes_vNN.md`; one row per finding, sorted P0 → P2):
```text
| ID  | TC in–out (seq)       | Shot     | Sev | Class      | Finding (evidence)                                  | Fix route (7.5)          | Owner   | Status |
| C03 | 00:01:58:11–00:01:58:15 | S03-SH02 | P0  | objective  | robot hand shows 6 fingers on contact frame (strip_118.54.png) | 3 Seedance edit   | 05/user | open   |
| C07 | 00:03:20:00–00:03:20:02 | S11-SH05 | P1  | objective  | audio leads mouth by 2 f (strip_192.0.png)          | slip DX +2 f             | Claude L3 | approved |
| C11 | 00:04:40:10             | S14→S15  | P2  | opinion    | soft cut, same framing (jump cut candidate)         | insert Halo-case cutaway | user    | open   |
```

**2. Permission request** (Arabic, one line per item):
```text
أبوستيشا، هذه التعديلات المقترحة على نسخة التسلسل SLA_FINE_v07_CLAUDE فقط، لا على نسختك:
C07 — تأخير صوت الجملة S11-L06 (ميراج) إطارين، لأن الصوت يسبق حركة الفم.
C12 — قصّ 8 إطارات من نهاية S05-SH02 (اهتزاز في الوجه).
لن أنفّذ شيئًا دون إذنك الصريح لكل بند. اكتب: «موافق على C07، C12» أو «لا».
```

**3. Track layout** (create once; submixes feed Mix):
```text
V1 picture · V2 composites/signage · V3 grade adjustment layers (per variant) · V4 grain · V5 titles/credits · captions track
A1 DX-ON · A2 DX-OFF/VO · A3 DX-FUTZ (phone, earpiece, broadcast) → submix DX
A4 FX-SD (Seedance native) · A5 FX-HARD · A6 FX-FOLEY · A7 FX-BG/room tone · A8–A10 spare (L2 placements) → submix FX
A11 MX-A · A12 MX-B → submix MX
Mix: Loudness Meter (always) · Hard Limiter (WEB pass only, bypassed for stems)
```

**4. Manual steps card** (when `pr_*` cannot do it):
```text
خطوات يدوية في Premiere — البند C07 (نفّذها بالترتيب ثم صدّر مرجعًا جديدًا)
1. في التسلسل SLA_FINE_v07_CLAUDE اختر مقطع الصوت SLA_S11-SH05_S11-L06_MIRAJ_T02 على A1 وحده.
   إن كان مقطع آخر ملاصقًا له على A1 فتوقف وأخبرني، لأن الإزاحة ستكتب فوقه.
2. اضغط Alt+→ (ويندوز) أو Cmd+→ (ماك) مرتين لتأخيره إطارين، أو اسحبه حتى يبدأ عند 00:03:20:02.
3. شغّل من 00:03:19:12 إلى 00:03:21:00 وتأكد أن الفم يفتح مع أول حرف.
4. صدّر مرجعًا جديدًا وأرسل لي اسمه.
النتيجة المتوقعة: بداية الصوت متأخرة إطارين عن الآن، ولا يتحرك أي شيء آخر.
```
Verify the shortcut on his OS and keymap before sending it (default "nudge clip one frame": Alt+arrow on Windows, Cmd+arrow on macOS `[UNVERIFIED for 26.x]`). Take clip names from the snapshot, never from memory.

**5. End credits** (names from the user only; tool versions from the ledger):
```text
2nd Life: Ascent | الحياة الثانية: معراج
Written and Directed by — <full name> (AboStesha)
Edited by — <name>          3D Blocking (Blender) — <collaborator>
Video generated with Dreamina Seedance 2.5 (dreamina-seedance-2-5-260628) via <BytePlus ModelArk / Higgsfield>
Character and location design — GPT Image 2.5, Nano Banana Pro / 2.1, Midjourney V8.2
Voices — synthetic voices, ElevenLabs Eleven v4 (<per 01 voice cards: Voice Design / Voice Library speaker, used under the library terms / consented clone>). All faces are synthetic.
Music — <Suno v6 / Eleven Music v2.5>, <plan>, edited by <name>
Sound — Seedance native sound; procedural SFX (code) by <name>; ElevenLabs SFX v2
Grade, mix and subtitles — <name>, Adobe Premiere <26.x>      [optional: AI assistance — Claude (Anthropic)]
Subtitles — English: <name> · Arabic: <name>        Fonts — <font>, SIL Open Font License
© 2026 <full name>
```

**6. QC report** (`qc/v05/QC_REPORT.md`; one block per file):
```text
FILE: SLA_summit_en-burned_16x9_7m07s_h264-1080p24_v05_20261117.mp4   SHA-256: …
Spec   1920x1080 · 24/1 · h264 High · yuv420p · bt709/bt709/bt709/tv · AAC 48k 2ch      PASS
Audio  I −16.2 LUFS · TP −1.3 dBTP (after encode) · LRA 11.4 LU · target WEB −16 ±1      PASS
Time   intro 0:15 (untouched) · titles+story+credits 6:52 · story 6:22                   PASS
Subs   EN burned, 74 cues, validator 0 issues · AR sidecar 74 cues, 0 issues               PASS
Prov.  Content Credentials present (c2patool) · no watermark altered                     PASS
Share  Seedance picture 93.4% · DX: ElevenLabs 100% · FX: SD 61% / code 22% / EL 17%      RECORDED
Open   none   ·   Waivers   none
```

---

## Gate

**G3, Picture lock (D15).** The user approves in Arabic, item by item:
- the note list closed: every P0 fixed; every P1 fixed or waived with a reason;
- 00 §0.10 G3: runtime, Seedance picture share ≥ 90% (80–90% only with the 7.4 waiver), G1 re-run on the cut as watched, brand and text sweep, ledger continuity closed, holdback intact;
- the EDL and XML saved to evidence;
- the statement «هذه النسخة هي القص النهائي للقمة والمهرجانات».

**Hand-off to 08 (end of D16).** Deliver the reference export with mix, EN subtitles, titles, credits and intro, plus the measurement pack. 08 sees only the review pack.

**G4, Delivery, technical half (D18).** All 7.13 boxes PASS. The user has watched master #1 in full. The manifest is built and the link is tested. 09-release-and-festivals.md completes the disclosure and holdback half of G4.

## Common failures

| Symptom | Cause | Fix |
|---|---|---|
| Claude's "fix" shifted every clip after it | insert/ripple placement | overwrite on empty tracks; re-snapshot; Undo; work only in the duplicate sequence |
| Edits landed on the wrong clips | stale snapshot while the user edited | re-snapshot before each batch; never reuse node IDs |
| Notes based on what the timeline "should" show | judged the timeline, not an export | always review a fresh export (7.1) |
| Mouths late on every ElevenLabs line | audio laid at clip start, Seedance mouth starts later | per-line strip check; audio never leads > 1 frame |
| Seedance's own voice doubling under the ElevenLabs line | native audio left under ON lines | cut FX-SD under the line and fill with BG, or run a Seedance audio edit that removes only the dialogue |
| AI voice turns metallic after cleanup | broadband noise reduction or heavy presence EQ | regenerate the line; small EQ moves; de-ess before limiting |
| Web master pumps and the hits flatten | gain pushed past the limiter, or loudnorm used | static gain; accept −17/−18; ride the loudest FX/MX moments |
| Encoded MP4 shows overs that the WAV did not | AAC inter-sample peaks | measure the encoded file; more margin on the ceiling |
| Stems do not null | limiter or effects on Mix, a send outside the submixes | bypass Mix effects for stems or document pre-master |
| Clean master has burned subtitles | caption export defaulted to burn | set Captions None; check a still before delivery |
| Arabic subtitles: final period on the right, letters unjoined | base direction LTR; Latin text engine | `Encoding=-1` (libass) or RLM; Premiere Middle Eastern text engine; still check |
| Subtitles flash on and off | 3–11 frame gaps | chain to 2 frames or open to ≥ 12 (validator) |
| Grade jump at a cut inside one scene | each shot graded alone | match to the hero shot first, then the shared look layer |
| LUT made the AI clips crunchy | log-to-709 LUT on display-referred clips | remove it; Rec.709 throughout |
| Seedance share fell below 90% after fixes | generative extend, upscalers, or AE paint used freely | route ranking in 7.5; recompute at G3/G4 |
| Provenance lost on the final | ffmpeg remux or re-tag of a credentialed export | re-export from Premiere with Content Credentials; never remux it |
| Intro looks or sounds different | intro retimed, graded or re-levelled | intro untouched, Frame Sampling only, report the loudness gap |

## Sources and licences

Cloned 2026-10-30 into `scratchpad/clones2/m07/`, text read only, no code run. All MIT unless noted.
- **calesthio/generative-media-skills** @8c85352 (MIT): audio-mixing-mastering, dialogue-editing-adr, captions-media-accessibility, editing-montage, color-grading-finishing, media-qc-delivery, localization-dubbing-production. Paraphrased except the short quoted rule in Ground rule 6. Loudness, WCAG, Netflix-mix and YouTube-audio facts were taken from its dated citations (verified there 2026-07-10).
- **bianbianzhu/procedural-sfx** @5eff10f (MIT): static-gain mastering and the reason to avoid loudnorm; inter-sample peaks after AAC. Paraphrased.
- **vlad7329-debug/claude-after-effects-skills**, premiere-sfx-design @06266e4 (MIT): Premiere MCP quirks, timing and level rules. Paraphrased; re-verify on `pr_*`.
- **Leonxlnx/cinetic** @ecfa660 (MIT): P0/P1/P2 severity (adapted) and the BT.709 ffmpeg tag chain (quoted).
- **Gregory-Esman/ai-film-pipeline**, video-qa @560cfc1 (MIT): AI-artifact, continuity and photoreal checklists, frame extraction. Paraphrased.
- **stefanwebb/premiere-ai-skills** @c3d4cfa (**CC-BY-SA-4.0**): Premiere tick rate and frame-snapping finding. Paraphrased only; listed as inspiration.
- **Own code:** `scripts/srt_check.py` (validator and SRT shift, written for this pipeline, tested 2026-10-30); `scripts/measure_frames.py` (02).
- **User's own skills (read-only):** seedance-2-5-prompts (General editing, Audio editing, Seamless transitions, parameter locks) for the 7.5 template; cinematic-pipeline (Arabic MSA address, "⚠️ Watch:" failure lines, the Premiere hand-off step). seedance-director, midjourney-prompt-expert, suno-ai-mastery and higgsfield-generate had nothing current for this step.
- **Fetched 2026-10-30:**
  - Netflix EN-US and Arabic Timed Text Style Guides, General Requirements, Subtitle Timing Guidelines (partnerhelp.netflixstudios.com);
  - official AI Film Award 2027 page (intro, 16:9 1080p MOV/MP4, English subtitles, private/unlisted link; no audio-track or textless requirement stated);
  - via search: Adobe help on Lumetri Color Match and Loudness Meter presets; Premiere 26.x release history and 26.2 Content Credentials export; Adobe community reports on caption burn-in and Arabic RTL captions; iZotope Insight 2 Netflix target; ITU-R BT.1359 lip-sync thresholds; DCP-o-matic 2.18.x (for 09).
- **Not verified:** every `pr_*` tool name and behaviour; Premiere 26.x menu paths for colour interpretation and keyboard nudge; captions inside nested sequences; Content Credentials on ProRes exports; SMPTE RP 200 values (standard calibration practice, not fetched); the small-room 79–82 dB figure (heuristic).
