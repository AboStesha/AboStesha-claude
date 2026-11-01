# Ledger, Continuity and Physics (cross-cutting, runs beside Steps 0–9)

**Purpose.** Keep one append-only record of every asset and generation, so the AI disclosure, the Seedance share and any Organizer request (prompts, history, shot logs within 7 days, kept 24 months; Terms cl. 5.5) come out of files, not memory.
**Also.** Keep the film the same film across 40–100 generations (continuity bible), and keep every frame physically plausible, sci-fi devices included (physics bible). Every check is keyed to a shot ID that Premiere shows.
**Rule.** Talk to AboStesha in Arabic. Every ledger cell, file name, bible entry and prompt is in English. This module owns the schemas; Steps 00–09 write rows into them.

Tags: `[OFFICIAL]` vendor or Organizer docs · `[DOC-3P]` third-party mirror of vendor docs · `[FIELD]` a practitioner skill's tested rule · `[TEXTBOOK]` a standard physics or engineering value · `[COMPUTED]` computed here or with `scripts/sun_position.py` / `scripts/share_report.py` · `[HOUSE]` our default · `[UNVERIFIED]` confirm before relying on it · `[TESTED]` run in this session.

---

## Inputs

| Input | From | Used in |
|---|---|---|
| Film code (`SLA`), film folder, Seedance-share targets, readings R1–R3, definition of T | `00-award-brief-and-calendar.md` §0.4 | L.0, L.5 |
| Scene list (S##, LAYER, FLAGS), line IDs, authorship log origin codes (H, H/C, C, G, T, F) | `01-script-and-dialogue.md` | L.2, L.4, L.6 |
| LOOK version, variants (R-DAY, R-INT, DREAM, BROADCAST, FINALE), reserved green `#3BD16F`, golden hour reserved for FINALE | `02-style-prefix.md` §2.5 | L.6, L.7 |
| Asset IDs, approved files and SHA-256, Seedance `asset://` IDs, continuity entries | `03-assets-images.md` | L.2, L.6 |
| Blocking table, hand-off sheets (lens heading, camera-relative sun, contact frames, speeds) | `04-blender-blocking.md` | L.4, L.7 |
| Every Seedance request, task JSON and download | `05-seedance-production.md` | L.2, L.3 |
| Performance IN/OUT per shot and character | `05b-acting-direction.md` §5b.7 | L.6 |
| Cue log, SFX gap list, stems and their origins | `06-music-and-sfx.md` §6.4 | L.2, L.5 |
| Premiere FCP XML of the locked sequence; snapshots | `07-edit-mix-finish.md` §7.1, §7.4 | L.5 |
| Story date, story clock, world decisions (L.7.9) | the user | L.7 |

## Ground rules

1. **One source of truth.** `SLA_LEDGER.csv` holds one row for every file that can reach the film or that shaped something in it: reference, prompt run, draft, final, edit, take, cue, SFX, render, font, the Summit intro. The row exists before the file is used downstream. "Never manage continuity by memory, filenames alone, or chat history alone" (calesthio asset-continuity-management, MIT).
2. **Append-only.** Rows are never deleted. After a row is written, only these cells may change: `review_status`, `approved_by`, `approved_utc`, `approval_words`, `post_edits`, `in_final`, `seconds_in_final`, `share_of_film_pct`, `notes`. Every other cell records a fact about the generation and is frozen. Fix a mistake with a new row whose `notes` say `corrects G05-0142`.
3. **Explicit unknowns.** Write `not_provided`, `unknown` or `n/a`, never a blank. A strong manifest "favors explicit unknowns over blank cells" (calesthio, MIT).
4. **Download now.** BytePlus clears Seedance output URLs 24 h after the task, and on 2.5 caps a URL at 100 downloads `[DOC-3P: Comfy mirror of the BytePlus schema]`. Download, hash and log in the same turn the task succeeds.
5. **Never touch provenance.** Never crop, blur or cover a watermark; never strip metadata; never remux a credentialed file (Terms cl. 5.6; 07 rule 4). Record what each file carries.
6. **No secrets.** `account` holds a login, organisation or project name. Never write an API key or token anywhere in this folder.
7. **File names are IDs.** The name carries shot, tool and version, so Premiere's clip name equals the ledger key. Never rename a logged file. Copy it to a new name and add a derivative row.
8. **Physics is the default.** Every REAL shot obeys L.7. A DREAM shot breaks physics only in the one way declared in the register (L.7.10; 02 §2.5). Sci-fi devices follow the device rules (L.7.8).

---

## Procedure

### L.0 Set up (D0–D1, about 20 minutes)

```text
films/01-second-life-ascent/ledger/
  SLA_LEDGER.csv          ← templates/ai-disclosure-ledger.csv   (append-only, one row per generation/file)
  SLA_SHOTS.csv           ← templates/shot-list.csv              (one row per shot, updated in place)
  continuity-bible.md     ← templates/continuity-bible.md
  physics-bible.md        ← templates/physics-bible.md
  version-pins.md         (L.3)            decisions.md (append-only: date · decision · who · words)
  prompts/<gen_id>.txt    (only when the step has no prompt file of its own)
  raw/<gen_id>.json       (API/MCP response for every task: generation history evidence)
  reports/                (share reports, ffprobe, c2patool output, cut-pair and physics cards)
06-audio/logs/SLA_06_cue-log.csv   ← templates/music-cues.csv   (06 owns it; columns 1–22 = 06 T3)
06-audio/spotting/SLA_06_SFX-GAPS_vNN.csv ← templates/sfx-list.csv (06 owns it; columns 1–12 = 06 T4, TC split in/out)
```
1. Copy the templates, delete the `EXAMPLE` rows, keep the headers exactly. The two scripts this module uses live in the skill: `scripts/share_report.py` (L.5) and `scripts/sun_position.py` (L.7.1). Run them from the skill folder with `python3 -I`; they read files and write nothing.
2. Ask in Arabic, one message: «أبوستيشا، قبل أن نبدأ: (1) رمز الفيلم في أسماء الملفات SLA، هل توافق؟ (2) ما تاريخ أحداث القصة (اليوم والشهر)؟ اقتراحي منتصف أبريل 2045 لأن ظل الظهيرة القصير في R-DAY لا يصح فيزيائياً إلا من أبريل إلى أغسطس. (3) قرارات العالم في القائمة L.7.9.»
3. Backups: sync the `ledger/` folder to the 04 Drive folder, keep a local copy, and write `reports/SLA_checksums_<date>.sha256` each evening (00 D2: two places, 24 months).
4. Holdback: `films/` sits in the GitHub repo. Before the first download add `.gitignore` lines `films/**/*.mp4`, `films/**/*.mov`, `films/**/*.wav`, `films/**/*.mp3` and `films/*/ledger/raw/` (03 already covers images). No clip or audio file goes to GitHub, and the repo stays private until the holdback ends.

### L.0b Storage roles and the folder tree (decided 2026-11-01; Claude builds and maintains it)

**One tree, same names everywhere.** Claude creates it at Step 0 (Higgsfield via `create_project` + `create_folder`; Drive via the connector or exact steps for the user) and files every new item the moment it exists.
```text
<CODE>_<film-slug>/
  00_STYLE/                    look frames, style-lock card
  01_CHARACTERS/CHR_<NAME>/    face, turnaround, expressions, wardrobe; approved/
  02_LOCATIONS/LOC_<NAME>/     plates per time of day; approved/
  03_PROPS/PRP_<NAME>/         hero sheets; approved/
  04_SCENES/S01_<slug>/        one folder per scene, numbered as in the script
     refs/                     copies of the approved CHR/LOC/PRP this scene uses (Higgsfield: copy_project_asset; Drive: shortcuts)
     blocking/                 playblasts from Blender (PB/REV/STILL)
     drafts/                   SD25-DRF
     finals/                   SD25-FIN (approved takes only)
  05_AUDIO/DX · MX · FX        dialogue takes, score cues, SFX
  06_EDIT/                     Premiere project, review exports, FCP XML
  07_DELIVERY/                 masters, subtitles, Summit intro, posters
  08_EVIDENCE/                 RAW_SEEDANCE/ (byte-identical originals for the upload page), ledger exports, consents, licences, Organizer mail
  99_TESTS/                    D1 route tests, cost probes
```
Higgsfield holds 00–04 and 99 (where generation happens). Drive and the PC hold the whole tree.

**Where things live:**
| Place | Role | Holds |
|---|---|---|
| Higgsfield project | workspace + generation history (evidence) | every generation in its folder; never the only copy |
| Google Drive | master archive and the shared space with the Blender collaborator | every approved asset, every Seedance original downloaded the moment it finishes (byte-identical), audio, edit exports, 08_EVIDENCE; keep 24 months after the Award |
| The user's PC (Google Drive for desktop sync) + one external drive | fast working copy for Premiere, plus an offline backup | the same tree; Premiere links to the PC copy |
| GitHub (private repo only) | text and memory | PROJECT.md, script, dialogue sheets, prompts, ledger CSVs, decisions; never images, video or audio (`.gitignore` in SKILL §4) |

Rules: the Seedance original is downloaded and hashed before anything else touches it; RAW_SEEDANCE is never edited, renamed or re-exported; the Drive tree is the one the competition evidence comes from.

### L.1 Naming convention that matches Premiere

Premiere names a clip after its file. So the file name is the shot database key, and the timeline can be audited from the names alone.

| Kind | Pattern | Example |
|---|---|---|
| Seedance draft (480p; never imported into the edit) | `SLA_<SHOT>_SD25-DRF_v<NN>_t<K>.mp4` | `SLA_S03-SH02_SD25-DRF_v03_t2.mp4` |
| Seedance final from that draft | `SLA_<SHOT>_SD25-FIN_v<NN>_t<K>[_f2].mp4` or `.mov` (extension = the `output_format` chosen in 05 §5.7; default mp4) | `SLA_S03-SH02_SD25-FIN_v03_t2.mp4` |
| Seedance edit task / extension or bridge | `…_SD25-EDT_v<NN>_t<K>_e<NN>.mov` · `…_SD25-EXT_…` | `SLA_S03-SH07_SD25-EDT_v02_t1_e01.mov` |
| Seedance last frame (`return_last_frame`) | `…_SD25-FIN_v<NN>_t<K>_LF.<ext>` (read the real format from the file; Comfy: do not infer it from the URL) | used as the next shot's first frame (05) |
| Derivative render of any file | parent name + `_<OP>v<NN>` (OP: `TXT` text comp, `CLN` paint/cleanup, `UPS` upscale, `GRD` graded render) | `SLA_S06-SH01_SD25-FIN_v01_t1_TXTv01.mov` |
| Other picture | `SLA_<SHOT>_<CODE>_v<NN>_t<K>.<ext>` | `SLA_S03-SH04_GFX_v01.mov` |
| Image assets | 03's pattern `<ASSET>_<state>_<sheet>_v<NN>_<model>_t<N>.png`; 03's `approved/…_APPROVED.png` copy has the same SHA-256, so it goes in the same row's `notes`, not a new row | `CHR_MIRAJ_base_face_v03_G25S_t2.png` |
| Playblasts | 04's `_PB_` / `_REV_` / `_STILL_` (never imported into the edit) | `SLA_S03-SH02_PB_v03.mp4` |
| Dialogue takes | 01's `SLA_<LINE>_<CHAR>_T<NN>.wav` and per-shot copy | `SLA_S07-SH04_S07-L03_MOTHER_T02.wav` |
| Music, SFX, Seedance audio extract | 06's `SLA_<CUE/SHOT/SEQn>_<FXnn/BGnn>_<slug>_<SRC>_v<NN>[_t<K>][_48k].wav` | `SLA_S03-SH02_SDFX_v01.wav` |

Tool codes: `SD25` Seedance 2.5 · `SD20` Seedance 2.0 · `G25S`/`G25F` GPT Image 2.5 Sunburst/Flare · `NBP` Nano Banana Pro · `NB21` Nano Banana 2.1 · `SD5P` Seedream 5.0 Pro · `MJ82` Midjourney V8.2 · `BLN` Blender render · `GFX` titles or graphics · `BLK` black · audio `SUNO`, `EL`, `ELSFX`, `PROC`, `SD`/`SDFX`, `USR` (06).

Rules:
- `v` bumps when the prompt or references change; `t` is the take in a run (03 rule). A final inherits its draft's `v` and `t`. A second final from the same draft adds `_f2`.
- Use ASCII letters, digits, `-` and `_` only. No spaces, no "final_final".
- **Premiere project.** Import only finals, edits, extensions, derivatives, takes, cues and SFX. Never import DRF, PB, REV or STILL files (04 rule).
  - Bins: `00_SEQUENCES` · `01_PIC_SD/S01…S14` · `02_PIC_OTHER` · `03_DX` · `04_MX` · `05_FX` · `06_GFX` · `07_SUMMIT-INTRO`.
  - Never rename clips in the Project panel. The share script reads file paths, so a rename does not break it, but it breaks the visual audit.
- **Metadata columns** (Project panel ▸ Metadata Display; Scene, Shot, Log Note and Good are standard List View columns `[OFFICIAL: Adobe Help]`):
  - `Scene` = `S03`; `Shot` = `S03-SH02`; `Log Note` = `G05-0151 FIN v03 t2`; `Description` = origin class (`SD`).
  - Tick `Good` only on the approved take.
- **Label colours** `[HOUSE]`:
  - Forest = `SD`; Mango = `SD+TXT` / `SD-COMP`; Rose = `AI-OTHER`; Yellow = `NONAI` / `GFX`.
  - Cerulean = DX; Caribbean = MX; Lavender = FX/BG.
  - A glance at the timeline then shows the share. If the user prefers other colours, record their choice in `decisions.md`.
- **Sequences:**
  - Names: `SLA_ASSEMBLY_vNN` → `SLA_ROUGH_vNN` → `SLA_FINE_vNN` (+ 07's `SLA_FINE_vNN_CLAUDE`) → `SLA_LOCK_vNN`.
  - The Summit intro lives only in `SLA_MASTER_SUMMIT_vNN`, which nests the lock.
  - Settings: 1920×1080, **24/1 fps (not 23.976)**, 48 kHz, timecode 00:00:00:00 on the film's first frame (04, 06).
- **Evidence export:** *File ▸ Export ▸ Final Cut Pro XML* (and EDL for 07). Compute the share from the XML only. CMX3600 EDLs carry short reel names and lose file identity `[FIELD]`.

### L.2 The provenance ledger (`SLA_LEDGER.csv`)

One row = one generation attempt, including failed, filtered and rejected ones (the Organizer may ask for "generation history"). Rendered derivatives and non-AI elements also get one row each. Column groups (exact header in `templates/ai-disclosure-ledger.csv`):

| Group | Columns | Format and rule |
|---|---|---|
| Identity | `gen_id, film, step, kind, shot_id, asset_id, line_or_cue_id, purpose` | `gen_id` = `G<step>-<NNNN>`, e.g. `G05-0151`, never reused. `kind` ∈ image, video, audio-dx, audio-mx, audio-fx, text, 3d, edit-render |
| Tool | `tool, model_id, model_snapshot, mode, route, account, plan_tier` | exact strings from L.3. `mode` ∈ t2i, i2i-edit, t2v, i2v, ref2v, draft, final-from-draft, edit, extend, tts, music, sfx, procedural, manual-ui |
| How | `params, prompt_file, prompt_sha256, prompt_origin, references, parent_gen_id` | `params` as `k=v;k=v` (`draft=true;resolution=480p;ratio=16:9;duration=7;generate_audio=true;watermark=false`). `prompt_origin` uses 01's codes. `references` lists IDs and roles: `@Image1=asset://<id>(CHR_MIRAJ);@Video1=SLA_S03-SH02_PB_v03.mp4` |
| IDs and time | `task_id, draft_task_id, seed_returned, submitted_utc, completed_utc, downloaded_utc, url_expires_utc, draft_expires_utc` | ISO 8601 UTC with `Z`. GST = UTC+4, for display only |
| Output | `file_name, file_sha256, tech, c2pa_status, watermark, cost` | `tech` = ffprobe summary. `c2pa_status` ∈ present-valid, present-invalid, absent, not_checked. `watermark` ∈ none, visible, invisible-claimed (e.g. SynthID) |
| Review | `outcome, review_status, approved_by, approved_utc, approval_words` | `outcome` ∈ OK, FAILED, FILTERED, TIMEOUT. `review_status` ∈ CANDIDATE, APPROVED, REJECTED, SUPERSEDED. `approval_words` = the user's Arabic words, verbatim |
| Authorship and rights | `human_contribution, post_edits, synthetic_or_real, consent_ref, licence_ref` | e.g. "AboStesha wrote beat text; picked t2 of 4". Every face and voice is `synthetic` or `real+consent` (cl. 5.5(d)) |
| Final cut | `in_final, origin_class, seconds_in_final, share_of_film_pct, notes` | filled from L.5 at G3 and G4 |

**When to write (triggers):**

| Event | Row or cells |
|---|---|
| A Seedance task finishes (any outcome), on any route | new row. While a task runs, keep its ID in `reports/inflight.md`. **Never resubmit a task that timed out while waiting**: that bills a second generation (research, BytePlus) |
| Image, TTS, music or SFX generation through an MCP | new row with flow/job/generation IDs in `task_id` and the flow URL in `notes` |
| Manual tool (Midjourney, Suno web, ElevenCreative) | the user pastes the job ID or link (Arabic: «الصق رابط أو رقم المهمة من فضلك»), then you write the row. Midjourney rows note Stealth on (03) |
| The user approves or rejects | update the review cells only |
| A derivative is rendered (text comp, paint, upscale) | new row: `parent_gen_id` = source; the tool that made the change; the class from L.5 |
| A non-AI element enters (font, user recording, procedural SFX, Summit intro) | new row: `tool` = the source (e.g. `font: <family> (<licence>)`, `scripts/sfx_forge.py@<git sha>`); `licence_ref` is mandatory (cl. 5.5(c)) |
| Picture lock (G3) and submission (G4) | `in_final`, `seconds_in_final` and `share_of_film_pct` from the L.5 report |

**Seedance download routine** (run the moment `status` is succeeded; 05 submits, this module logs):
```bash
F=SLA_S03-SH02_SD25-FIN_v03_t2.mp4
curl -sS -L --fail -o "$F" "$VIDEO_URL"            # URL lives 24 h from task creation
sha256sum "$F" >> reports/SLA_checksums_$(date +%F).sha256
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt:format=duration \
  -of compact=p=0 "$F" > reports/$F.ffprobe.txt     # expect 1920x1080, 24/1
c2patool "$F" --info > reports/$F.c2pa.txt 2>&1 || echo "c2patool missing or no manifest" >> reports/$F.c2pa.txt
```
- Save the full task response as `raw/<gen_id>.json`. Field names come from 05 and stay `[UNVERIFIED]` until the first live call.
- Set `url_expires_utc` = task creation + 24 h.
- Set `draft_expires_utc` = creation + **14 days** for drafts created after 2026-10-28 10:00 UTC+8, else 7 days. That is the official BytePlus tutorial (05 §5.0, read as Markdown 2026-10-30), and `scripts/seedance_byteplus.py` writes it this way. The Comfy, fal.ai and APIYI pages still say 7, so the house rule stays stricter than both: finalise or kill every approved draft before it is 5 days old (00 §0.7). Finalise a draft on the same route and account that made it: fal.ai says a draft ID works only for its original caller.
- `c2patool` (contentauth/c2patool, MIT/Apache-2.0; CHANGELOG top 0.26.72, 13 Jul 2026) reads mp4, mov, wav, png and jpg (c2pa-rs supported formats). The first results become 00's T4 provenance test.
- **Third-party routes.**
  - Higgsfield: record the model label exactly as `models_explore` shows it, plus the job ID.
  - ElevenLabs MCP: `bytedance-seedance-v2.5` (no draft flag seen `[UNVERIFIED]`) plus the flow and generation IDs.
  - Write the underlying BytePlus model ID only if the route states it; otherwise write `not_provided` and add it to the Organizer email (00 §0.9). The disclosure must name the Seedance version used through any third-party platform (cl. 5.5(a)).

### L.3 Version pinning (`version-pins.md`)

A pin = model ID or snapshot + route + plan tier + default parameters + date verified + how verified. Every ledger row copies `model_id` and `model_snapshot` from the pin.

| Job class | Pin (verified 2026-10-30) | Status |
|---|---|---|
| Final picture | `dreamina-seedance-2-5-260628`, draft 480p → final-from-draft 1080p; edit and extend on the same ID | `[OFFICIAL]` BytePlus ModelArk docs read as Markdown in 05 §5.0 (tutorial updated 2026-10-28), cross-checked with the Comfy mirror; 4K is enterprise-only |
| Hero sheets | `gpt-image-2.5-sunburst`, pinned to snapshot `gpt-image-2.5-sunburst-2026-09-08` where the route accepts it; quality `max`, resolution `4k` (03) | `[OFFICIAL]` OpenAI model page (snapshot and quality list). Higgsfield may expose only the alias: record what it shows |
| Edits and consistency | `gemini-3-pro-image` (Nano Banana Pro), `gemini-nano-banana-2.1` | `[OFFICIAL]` ai.google.dev model page and image-generation guide (fetched 2026-10-30 in 02 §2.7 and 03 §3.0) |
| Look-dev (manual) | Midjourney `--v 8.2` (+ V8.2 Edit Model) | BRIEF |
| Dialogue, music, SFX | `eleven_v4` · `music_v2_5` (MCP `eleven_music_v2_5`) · `eleven_text_to_sound_v2` · Suno `v6` (record the UI label: v6 / v6-wild / v6-mini) | ElevenLabs model docs (localised pages); Suno per BRIEF |
| Tools that shape frames | Blender version + MCP server and version; Premiere Pro version (Help ▸ About); `scripts/sfx_forge.py` git SHA; `c2patool -V` | record on D1 |

Rules:
1. **One pin per job class for the whole film.** A model or route change is a major change (calesthio's `v2.0` rule): bump `v`, and never mix two models inside one scene without the user's yes.
2. **Daily check, before the first job.** List the live models and diff them against the pins:
   - Higgsfield: `models_explore`;
   - ElevenLabs: `creative_get_flow_node_types`;
   - BytePlus: the model list, or a GET on a non-existent task as a free key check (research).

   On any difference, stop that job class and show T6.
3. **Canary.** Keep one approved 5 s Seedance draft per variant (R-DAY, DREAM) with its prompt and references frozen. After any pin change, re-run it at 480p and compare side by side with the approved one before production continues. Log it as `purpose=canary`.
4. **Seeds are not continuity.** Sources disagree on whether 2.5 accepts a seed: BRIEF says no; the Comfy mirror lists `seed` and returns the seed it used. Record `seed_returned` as a fact only. A draft and its final share settings by construction.
5. **Labels without versions.** Disclose as: Seedance (as labelled by <route>: "<label>", accessed <date>), plus the BytePlus model ID if the route confirms it.

### L.4 Shot database (`SLA_SHOTS.csv`)

- **One row per shot.** The header is a superset of 04's blocking keys (`shot_id,line_ids,mode,variant,size,lens_mm,cam_height_m,move_rig,edit_s,gen_s,frames,cast,beats,screen_dir,physics,owner,status`) and of 08's `SHOTS.csv` (`tc_in, tc_out, frames, scene, world, hero, tool+route, draft_job, final_job`), so both modules export from it without retyping. 08's names map as: scene = `scene_id`, world = `layer`, tool+route = `origin_class` + `route`, draft_job = `draft_task_id`, final_job = `final_task_id`.
- **Lifecycle:** PROPOSED → BLOCKED (04 approved) → DRAFTING → DRAFT-APPROVED (05b G5b-C) → FINAL-APPROVED → IN-CUT → LOCKED. A cut shot stays in the table as OMITTED; never renumber (01).
- **Who fills what:**
  - 01: `scene_id`, `line_ids`, `layer`.
  - 02: `variant`, `wb_k`.
  - 04: camera, `lens_heading_deg`, `screen_dir`, `beats`, `physics`.
  - L.7: `story_date`, `story_time`, `sun_*`.
  - L.6: `wardrobe`, `props_state`, `accumulated`, `eyelines`.
  - 05: `draft_*`, `final_*`.
  - 07 and L.5: `tc_in`, `tc_out`, `premiere_clip`, `seconds_in_final`.
  - `continuity_check` and `physics_check` are PASS, FAIL or WAIVED. WAIVED needs the user's words in `decisions.md`.

### L.5 Seedance share of the final film

Classes (write one per in-final row and in the Premiere `Description` column):

| Class | Meaning | Counts as Seedance picture |
|---|---|---|
| `SD` | Seedance pixels: draft→final, edit, extend; graded, cleaned, upscaled or retimed (00 §0.4) | yes |
| `SD+TXT` | Seedance plate with titles, subtitles or graphics over it (07 §7.5) | yes |
| `SD-COMP` | composite where the Seedance plate fills ≥ 50% of the frame for the whole clip and carries the subject `[HOUSE]` | yes |
| `SD-STILL` | a Seedance frame held as a freeze | **no** (conservative; shown separately) |
| `AI-OTHER` | any other generative picture (a held GPT Image or Nano Banana still, another video model) and ElevenLabs/Suno audio. BRIEF locks final picture to Seedance 2.5 only, so AI-OTHER picture needs the user's explicit yes in `decisions.md` | no |
| `NONAI` | black, text on black, procedural graphics, procedural or recorded audio. Blender renders and playblasts never reach the cut (BRIEF) | no |
| `OVERLAY` | text or graphics with alpha. Transparent: the class of the layer below counts | n/a |
| `REF`, `DRAFT` | never on screen | n/a |

```text
T                 = frames(titles + story + credits) / 24        (Summit intro excluded, 00 §0.4)
R1 picture share  = seconds whose top opaque layer is SD | SD+TXT | SD-COMP  ÷ T     target ≥ 90%, floor 80%, rule 70%
R2 (gen-AI)       = picture: (SD… + SD-STILL + AI-OTHER) ÷ T;   audio per stem: (SD + AI-OTHER) ÷ covered seconds
R3 (strictest)    = audio per stem (DX, MX, FX): SD ÷ covered seconds
Per tool (cl. 5.5(a) "share of the Film each generated") = seconds where that tool's file is the visible or active source ÷ T
```
Worked mini-example `[COMPUTED]`: lock at 6:45 → T = 405 s. Main title (6 s) and credits (20 s) sit over Seedance plates, so they count. Non-Seedance picture: a 12 s HUD insert built in After Effects over black (`NONAI`) and one 8 s freeze on a Seedance frame (`SD-STILL`). R1 = (405 − 20) / 405 = **95.1%**; R2 = 393 / 405 = 97.0%. Moving the HUD over a Seedance plate (`SD+TXT`) lifts R1 to 98.0%.

**Script** `scripts/share_report.py` `[TESTED on synthetic xmeml only: dissolves, generators, a disabled track, a nested sequence, an unledgered clip; check the first real run by eye against the timeline]`:
```bash
python3 -I scripts/share_report.py evidence/edit/SLA_LOCK_v05.xml ledger/SLA_LEDGER.csv [intro_seconds]
```
- It prints T, R1, R2, picture seconds per class, audio seconds per track and class, `seconds_in_final` per file, then `NOTE` and `FLAG` lines.
- Per frame, the top enabled video item decides. Empty frames are `NONAI`. File-less items named black, matte, slug, colour or bars are `NONAI`; other file-less items (Premiere text, Essential Graphics) are transparent `OVERLAY` and get a `NOTE` for an eye check.
- `FLAG` = a file not in the ledger (`UNLEDGERED`), a DRAFT/REF file in the cut, an unknown `origin_class`, a row not `APPROVED`, or a nested sequence. Un-nest before export: a nested sequence counts as non-Seedance.
- Run it at every rough cut (cheap), then at G3 and G4.
- Map audio tracks A1… to DX, MX and FX using 07's track layout. Audio origins come from the ledger: Seedance-native = `SD`, ElevenLabs or Suno = `AI-OTHER`, procedural or recorded = `NONAI`.
- Inside a dissolve, the outgoing clip is counted. That is fine because both sides are usually `SD`.
- Write `seconds_in_final` into each row, and set `share_of_film_pct` = seconds ÷ T × 100.
- **Zero FLAG lines is a gate condition.** An UNLEDGERED clip counts as non-Seedance until it has a row (07 §7.4).

### L.6 Continuity bible (`continuity-bible.md`)

Entries follow calesthio's shape (MIT): canonical description, locked references, invariants, allowed variations, forbidden variations, approval needed. 03 writes the character, location and prop entries, and this module adds the film-time sections:

1. **States, not memory.** Every prop and device has a state machine listing its states, its allowed transitions and the shot where each transition happens **on camera**. From the user's seedance-director skill: "Off-screen = nonexistent. State changes must be shown on camera before being referenced," and "Exit-frame = implicit cut."
2. **Accumulation only advances** (05b §5b.7; OSideMedia, MIT). Wetness, dust, sweat, fatigue and wet eyes grow through story time. They reset only with an on-screen or scripted cause (night, shower, change of clothes).
3. **Screen direction.** Draw the 180° line per scene on 04's set plan. Proposed `[HOUSE]`: the journey home → work runs L→R and work → home runs R→L. A vehicle keeps its direction across cuts. A recurring motif (the metro crossing the frame) crosses the same way every time.
4. **Eyelines.** Record each character's look target at the first and last frame, as a frame side and an angle ("down 30°, frame left, palm"). A reverse looks back along the same line.
5. **Time of day.** Each scene carries a story clock (date, HH:MM). The sun comes from L.7.1. White balance stays fixed per scene (02).
6. **Count lock.** Write the exact headcount per shot before the action and keep matching shots equal; a headcount that changes across a cut is a named failure in OSideMedia's FAILURE-MODES (MIT).
7. **Cut-pair check** (for every cut, at the draft and at the rough cut): extract the last frame of A and the first frame of B:
   ```bash
   ffmpeg -sseof -0.05 -i A.mov -frames:v 1 A_last.png      # drafts: clip ends
   ffmpeg -i B.mov -frames:v 1 B_first.png
   # rough cut: the trimmed frames, from 07's reference export; S = (cut frame - 1) / 24, 3 decimals
   ffmpeg -ss <S> -i SLA_ROUGH_vNN_ref.mp4 -frames:v 2 reports/cut_<A>_<B>_%d.png
   ```
   Read both images and check, using the user's old failure codes (cinematic-pipeline):
   - `HANDLE_DRIFT` (identity), `WARDROBE_DRIFT`, `PROP_MISPLACEMENT` (state, hand, position);
   - `EYE_LINE_BREAK`, `SCALE_DRIFT`, `AGE_DRIFT`;
   - `BACKGROUND_EMPTYING`, `LIGHT_SPILL`, `LENS_CONFLICT`, `PHYSICS_FAIL`;
   - plus screen direction, headcount and audio space.

   Log the result in T3 and in the shot row.

**Worked catches from draft v0** (PROVISIONAL until 01 locks; show them to the user, they decide):
| # | Draft beat | Continuity problem | Fix to offer |
|---|---|---|---|
| C1 | He removes the earpiece (magnet) and the Halo lens before sleeping; later he "opens his hand and sees his brother" | with the lens out, the call cannot be in-eye AR | the call is a **palm projection from the ring** (L.7.8), or he puts the lens back on screen first |
| C2 | Rayan gives him his ring and he wears it over his own | two rings on one finger from that shot on | lock hand and finger in 03 (`forbidden_variations: ring finger`); every later hand shot shows two rings, until a scripted removal |
| C3 | "The train passes in front of the camera" twice (morning, after the dream) | the motif must rhyme | same direction, lens height and speed both times; log both shots under one motif ID |
| C4 | The robot "has a fault in its leg" | the limp must persist | name the leg (left); the same hitch every cycle in every later robot shot (04 keys it) |
| C5 | He runs out happy; the girl calls "you forgot the food" | the box must stay behind | `PRP_FOODBOX` state `left-on-bench` stays visible in her shot; it is not in his hands outside |
| C6 | A full work day at noon heat | coverall sweat and dust | sweat patches at the back and underarms grow shot by shot; they reset only after a night |
| C7 | Lens case open/closed, two earpieces | count and state | 03 sheets `closed`/`open`; one earpiece in the right ear (04 legend: lens on the right eye) |

### L.7 Physics bible (`physics-bible.md`)

#### L.7.1 Sun for Dubai (25.2048 N, 55.2708 E, UTC+4, no daylight saving)

Run `scripts/sun_position.py` for every exterior scene and every window-lit interior (NOAA/Meeus equations in our own code, about 0.1° accuracy). It reproduced Dubai's published sunrise 06:25 and sunset 17:40 for 30 Oct 2026 `[TESTED]`.
```bash
python3 -I scripts/sun_position.py 2045-04-15 11:40 --cam 278   # one time; --cam = lens heading, deg clockwise from true north
python3 -I scripts/sun_position.py 2045-04-15 day                # every 30 min, sunrise..sunset
# defaults: --lat 25.2048 --lon 55.2708 --tz 4 (Dubai)
```
Azimuth is measured clockwise from **true** north; the 04 sun object uses the same axes (+Y = north). `rel` uses 04's `sun_relative` sign (+ = sun to camera-left, 0 = backlight). Seasonal reference for Dubai, 2045 `[COMPUTED]`:

| Date | Sunrise · noon · sunset | Noon elevation · shadow/height | Elevation ≥ 35° (shadow ≤ 1.4×) | Elevation ≤ 10° (golden) |
|---|---|---|---|---|
| 15 Jan | 07:06 · 12:28 · 17:51 | 43.8° · 1.04× | 10:26–14:31 | until 07:59; from 16:58 |
| 15 Apr | 05:56 · 12:19 · 18:42 | 74.8° · 0.27× | 08:36–16:02 | until 06:44; from 17:54 |
| 15 Jul | 05:38 · 12:25 · 19:12 | 86.2° · 0.07× | 08:24–16:25 | until 06:29; from 18:21 |
| 15 Oct | 06:17 · 12:05 · 17:52 | 56.1° · 0.67× | 09:07–15:02 | until 07:06; from 17:03 |

Rules:
- **Story date drives the look.**
  - 02's R-DAY promises "short crisp shadows" from a high sun. That is physically true only from April to August: at noon in October the shadow is 0.67× the body height, and in January 1.04×.
  - 02 reserves golden hour for FINALE. So every R-DAY shot must sit inside the ≥ 35° window, and FINALE shots ("low warm sun behind the subjects") sit in the ≤ 10° window, with the lens pointing toward the sun (|rel| ≤ 45°). A night exterior needs a night variant from 02 first (02 §2.5).
  - DREAM light is shadowless 6500 K with no visible source (02 §2.5). Write the sun cells as `n/a (DREAM)`. That look applies to every DREAM shot and is not the shot's one exception (L.7.10); soft contact occlusion under feet and objects still shows.
- **Worked example** (15 Apr 2045, PROVISIONAL):
  - 04's S03-SH02 hand-off reads "rel +130, elev 72". The script returns `11:40 az 147.1 el 72.2 … rel +131` with `--cam 278`, so the walkway shot sits at 11:40 with the lens heading west.
  - Its reverse (lens heading 98) gives rel −49: the sun is front-right, the faces are backlit, and that contradicts R-DAY's "behind camera left".
  - 04 §4.10 step 5 stops and asks the user: keep physics or cheat.
  - Cheat guide `[HOUSE]`: at elevation above 60° an azimuth cheat of 30° or less is hard to see, because shadows are short. At elevation below 30°, any cheat over 10° shows across a cut in the shadow directions. Log every cheat in `decisions.md`.
- **Shadow checks:**
  - every shadow in a frame points the same way (sun rays are parallel);
  - length ÷ height = 1/tan(elevation);
  - the edge is crisp: the sun's 0.53° disc gives about 0.9 cm of penumbra per metre between the object and the surface it falls on, so a head 1.7 m above the ground casts an edge about 1.6 cm soft `[TEXTBOOK; COMPUTED]`.
- **Secondary sun.** Mirror-glass towers can throw a second hard patch, but its direction mirrors the façade. It is allowed only if the tower is placed in the set.
- **Night.** City light pollution hides the stars. Only the Moon and a bright planet or two show. If the Moon is in frame, its phase must match the story date (check any ephemeris); otherwise keep it out of frame.

#### L.7.2 Gravity, falls and timing

Free fall from height h takes t = √(2h/g); impact speed v = √(2gh) `[TEXTBOOK; COMPUTED]`. A human body barely feels air drag below about 30 m (terminal velocity ≈ 55 m/s).

| Drop | Time | Frames at 24 fps | Impact speed | Film use |
|---|---|---|---|---|
| 0.3 m (pool edge) | 0.25 s | 6 | 2.4 m/s | stepping or falling into the pool |
| 0.9 m (table) | 0.43 s | 10 | 4.2 m/s | food box, glass knocked off a table |
| 1.5 m (from a hand) | 0.55 s | 13 | 5.4 m/s | lens case dropped, tossed coin |
| 5 m | 1.01 s | 24 | 9.9 m/s | an object from a first-floor balcony |
| 30 m | 2.47 s (2.51 s with drag) | 59–60 | 24 m/s (23 with drag) | — |
| 100 m | 4.5 s (4.8 s with drag) | 108–114 | 44 m/s (38 with drag) | only if 01 keeps an unintended dream fall (00 §0.10 cut the jump: no intent, no impact shown); DREAM register |

- **Real time is global.** If a 0.9 m drop takes 20 frames, the shot is slow motion, and then everything in it slows: people, water, hair, crowd and camera. A model that slows only the hero object is a P1 physics failure. Declare overcranking (48/96/120 fps look) per shot in the shot row, or count frames to confirm real time.
- **Ballistics return.** Anything thrown up H metres is back down in 2√(2H/g): 1 m → 0.9 s (22 frames), 2 m → 1.3 s (31 frames). Nothing hangs.
- **Mass in real units in the prompt** (OSideMedia, MIT): "the man is 70–80 kg — the drop lands hard."
- **Causal props** (OSideMedia, MIT): "objects never move on their own; every prop event needs a visible physical cause with event order."
- **Support.** The subject has geometry under it outside declared airborne windows (04's support check).

#### L.7.3 Water (pool opener, the FINALE swim)

- **Entry:**
  - A body entering from the pool edge (jump, slip or fall) hits the water at about 3–4 m/s (2–3 m/s horizontal plus the 0.3–0.5 m drop) `[COMPUTED]`.
  - A side or back entry throws a broad, mostly white sheet. White water is entrained air.
  - The spray rises, then falls back on the ballistic times above. The droplet patter lands 0.5–1 s after the entry frame, and 06 places it there.
- **After entry:**
  - The body sinks about 1–1.5 m, then rises.
  - Small bubbles rise at about 0.2–0.3 m/s `[TEXTBOOK]`, so white water clears in 2–4 s `[HOUSE]`.
  - Ripple crests move at about 1 m/s (deep-water phase speed √(gλ/2π): 0.88 m/s at λ = 0.5 m, 1.25 m/s at 1 m); the ring as a whole spreads at about half that (group speed) `[TEXTBOOK]`. Ripples bounce off the pool walls and keep the surface rocking for 10 s or more.
- **Optics:**
  - Seen from above, underwater things look shallower (about ¾ of the true depth) and legs look bent at the surface (n = 1.33).
  - Looking up from underwater, the sky shows only inside a 97° cone (Snell's window). Outside it, the surface mirrors the pool `[TEXTBOOK]`.
  - Under a high sun, a moving caustic net covers the pool floor; in shade it is absent.
- **Wet bodies:**
  - Fabric darkens, clings and drips for a minute or more. Hair clumps into strands. Water only runs down.
  - In about 35 °C dry heat, wet footprints on stone dry within minutes `[HOUSE]`.
  - Wetness is an accumulated state (L.6): a character who came out of the pool stays wet in the next shot.

#### L.7.4 Glass (the shards Kabir sweeps, the dream façade)

| Glass | Where | How it breaks |
|---|---|---|
| Annealed soda-lime | drinking glasses, cheap panes | radial cracks from the impact point plus concentric rings; a few large curved or dagger shards and slivers. A tumbler on the floor never makes a neat ring of cubes |
| Tempered | glass doors, car side windows, shower screens | the whole panel crazes at once into small blunt cube-like pieces (about 1 cm scale, `[UNVERIFIED]` exact size) that pour down as a granular cascade |
| Laminated or insulated units | high-rise façades, balustrades, windscreens | a white spider-web crack; the interlayer holds the pieces in the frame and it bulges. Nothing rains down unless the frame fails |

- The crack front in soda-lime glass runs at about 1.5 km/s `[TEXTBOOK; primary source not checked]`. That is about 60 m per 24 fps frame, so **a whole pane cracks within one frame**. A crack crawling slowly across a pane in real time is wrong; only thermal cracks or time-lapse crawl.
- Shards fall on the L.7.2 times and glint on the sun side. On a hard floor they skitter and re-break. In water they sink fast with no splash dome.
- The sound transient sits on the impact frame, and the shard rain lasts as long as the fall time (06 physics_ref).
- For the dream façade (draft v0), a tower pane would craze and hold. "Glass exploding behind him" is a DREAM exception: register it in L.7.10 and keep everything else real.

#### L.7.5 Crowds and walking

- **Speed:**
  - Free walking speed averages 1.34 m/s, ranging about 0.97–1.65 m/s (Weidmann 1993, via arXiv 0901.0170).
  - With density ρ (persons/m²): v = 1.34·(1 − e^(−1.913·(1/ρ − 1/5.4))). That gives 0.5/m² → 1.30 m/s, 1/m² → 1.06, 2/m² → 0.61, 3/m² → 0.33; at 5.4/m² the crowd stops `[COMPUTED]`.
  - A metro concourse at rush is 1–2/m². The crowded bus is 4–5/m² and nobody walks.
- **Gait:**
  - About 2 steps/s, so one heel strike every 12 frames `[TEXTBOOK]`.
  - Counter for gliding walkers (OSideMedia FAILURE-MODES, MIT): "heel lands first, strict left-right alternation, one foot always on the ground."
- **Bus and walkway:**
  - Standing passengers move **together**: when the bus pulls away they all lean back, then recover; on braking they all lurch forward. Inertia is common-mode, never random `[TEXTBOOK]`.
  - On the moving walkway, riders who stand still move at belt speed (typically 0.5 m/s, at most about 0.75 m/s `[UNVERIFIED: EN 115-1 text not checked]`). Walkers add about 1.3 m/s. The handrail moves with the belt.
- **Queues and reactions:**
  - Calm queue spacing is 0.5–0.7 m `[HOUSE]`.
  - Reactions travel in a wave, staggered 0.3–0.5 s (05b §5b.8).
  - Headcount is constant within a shot (count lock, L.6).

#### L.7.6 Vehicles

| Vehicle | Plausible values | Checks |
|---|---|---|
| Dubai Metro | 5-car sets about 85 m long (published figures 75–85.5 m); top speed 90–95 km/h in service (railway-technology 90, Wikipedia 95). Stations have full-height platform screen doors (secondary sources) | an 85 m train clears a fixed point in 7.1 s at 43 km/h and 3.4 s at 90 km/h `[COMPUTED]`; a full train passing in 2 s means about 150 km/h, which is wrong at a station. No wind gust on a platform behind the screen doors |
| City bus pulling away | about 1.0–1.5 m/s² `[HOUSE]`; 18 km/h after about 4 s | a man running at 4–6 m/s gains for about 3 s, then the gap opens. Stage it so he never touches the bus |
| Cars | urban 60–80 km/h; E11 100–120 km/h (sources disagree; RTA not checked); UAE traffic drives on the **right** | motion blur at 180° shutter = speed × 1/48 s: 60 km/h → 0.35 m, 120 km/h → 0.69 m `[COMPUTED]` |
| Wheels, fans, rotors | wheel rev/s = v/(π·D): a 0.65 m wheel at 60 km/h turns 8.2 rev/s | spokes may strobe at 24 fps (plausible); a wheel turning on a parked car is not. Fan blades at tens of rev/s blur into a disc, so a warning light sits on the **static housing**: a light on a blade smears into a ring |

#### L.7.7 Robots and machines

- **Mass:** a 1.3 m metal service robot weighs about 40–70 kg `[HOUSE]`. Footfalls land hard. Feet never slide. Joints stop at their limits and never bend backwards. Servos whine under effort.
- **Contact** (the fist bump, 04's logged contact frame):
  - zero interpenetration;
  - both arms recoil, equal and opposite;
  - skin compresses and metal does not;
  - the sound sits on the contact frame.
- **The faulty leg** is a physical constant: the same leg, the same hitch, the same cadence in every shot after the reveal.

#### L.7.8 Sci-fi devices: plausible light and mechanism

**Device light rules** `[HOUSE, built on TEXTBOOK optics]`:
1. **Light only adds.** An emissive image cannot show black or darken what is behind it; its dark areas are transparent. No mid-air hologram ever occludes.
2. **It needs a surface or a medium.** Light is invisible in clean air. Each device declares one mechanism: in-eye (only the wearer sees it), surface projection (palm, wall) or a physical display. There are no free-floating mid-air images in REAL scenes unless L.7.9 declares the mechanism.
3. **It lights its surroundings.** Palm and face take its colour, falling off with the square of distance (twice as far, a quarter of the light). The emitter is a visible point, and the light cone starts there.
4. **It competes with ambient light.** Direct sun is about 100,000 lux; a projection gives a few hundred. So the image is invisible in direct sun, readable in shade and glowing at night `[TEXTBOOK lux orders]`. Palm calls happen in shade or at night; in sun he cups his hand.
5. **Projections obey their surface.** The image wraps over the curve of the palm, breaks across finger gaps and keystones when the hand tilts.
6. **Lock mode.** World-locked items keep their place under parallax. The HALO HUD is **head-locked**: in POV it stays fixed in frame while the world shakes `[HOUSE proposal]`.
7. **Colour discipline.** The reserved green `#3BD16F` appears only on assistant devices (02).

| Device | Mechanism and what others see | Physics notes |
|---|---|---|
| Halo contact lens | in-eye micro-display; the BROADCAST variant lives only inside POV HUD shots | from outside: a faint glint over the iris, mirror-reversed and unreadable (a 5 mm image at 1 m subtends about 0.3°) `[COMPUTED]`; a wearer reading it has a near-focused "looking through" gaze |
| Ring earpiece | bone or ear audio, no light | magnet removal: pulls only within a few cm, then snaps the last millimetres (dipole force rises steeply with closeness) `[TEXTBOOK]`; a click on contact |
| Smart ring | LED states idle / green (assistant) / red | red light glows through finger skin more than green (red penetrates tissue deeper) `[TEXTBOOK]`; at night it tints the sheet within about 10 cm |
| Ring palm call (fixes C1) | projector point on the ring onto the open palm | rules 3–5; the face is underlit in the call colour at about 35 cm; fingers closing cut the image |
| Air-skate (rich man's garage) | fans must push their own weight of air down | momentum theory v = √(T/2ρA): 150 kg on four 0.8 m fans gives about 17.5 m/s induced flow and about 35 m/s in the far wake of open rotors, or about 25 m/s at the exit of ducted fans `[COMPUTED]`. Landing blasts sand outward in a ring, whips clothes and palm fronds; nobody stands within about 2 m. A "silent magnetic" hover is allowed only if declared, and then never shows downwash |
| Metro and broadcast screens | emissive panels | readable text is composited in post (01 flag LEGIBLE-TEXT); moiré and reflections are plausible |
| Light-lion (S01 DREAM; script review v1, PROVISIONAL) | free-standing image made of light | rules 1 and 3 still hold: see-through, never occludes, tints the deck and nearby faces. It needs a medium (pool mist) or it becomes that shot's one exception (L.7.10) |

#### L.7.9 World decisions (ask once, record in `decisions.md`)

Story date and year · is the 2045 bus diesel or electric (02's sample mentions a diesel idle) · air-skate lift (fans or declared magnetic) · HUD lock mode · palm call mechanism (C1) · robot mass and gait · façade glass type · overcranked shots (list) · moon in night exteriors (yes/no).

#### L.7.10 DREAM exception register

One row per DREAM shot: `shot · the ONE exception · what still obeys physics · the visual cue that tells the audience it is a dream`.
Example (G-safe option from 00 §0.10):
`S01-SH06 · the pool water rises into the sky · people, hair, wet clothes, falling droplets and crowd reactions stay real · the HALO ring glint in frame (DREAM marker) and the light dimming as the water lifts.`
The 02 prompt line reads: `PHYSICS EXCEPTION: only the pool water rising into the sky breaks physics; everything else keeps real weight.`

#### L.7.11 Physics QA (each shot, at the draft and again on the 1080p final)

Extract frames: `ffmpeg -i clip.mov -vf "fps=2,scale=1280:-1" qa/f_%03d.png` (1 fps for non-hero shots; research video-qa). Read them and check:
- Support: feet planted, no foot sliding, no floating props, contact shadows present.
- Timing: frame counts of falls, spray, steps and passing trains against L.7.2–L.7.6.
- Light:
  - one shadow direction, and a shadow-to-height ratio that matches the shot's sun row;
  - device light obeys L.7.8;
  - the reserved green only on its owner.
- States: wet, dust and sweat match L.6; headcount constant; no object appears or vanishes (object permanence).
- Mass: heavy things are slow to start and slow to stop; vehicles keep their direction and plausible speed; the motion-blur length matches the speed.

Grade each failure P0, P1 or P2 with 07 §7.3's definitions. Fix routes and their Seedance-share costs are in 07 §7.5. Re-check the final, because the 1080p final is a new generation whose detail can differ (BRIEF).

---

## Output templates (what Claude shows the user)

**T1 — Daily ledger card** (Arabic frame, English data)
```text
سجلّ الإنتاج — 2nd Life: Ascent — 2026-11-09 (GST)
Rows today: 23 (05: 17 · 06: 4 · 03: 2) · FAILED/FILTERED: 3 · in-flight: 0
URLs expiring < 6 h, not downloaded: none · drafts expiring < 48 h: S05-SH03 (G05-0122) → finalise or drop?
Blank required cells: 0 · UNLEDGERED files in the edit: 0 · version pins: unchanged (checked 08:55 GST)
قراراتك: ____
```
**T2 — Seedance share card** (G3/G4): the script output, then:
```text
R1 picture 95.1% (target ≥ 90 ✓) · R2 picture 97.0% · audio per stem DX/MX/FX: SD 0/0/61% · AI-OTHER 100/100/22% · NONAI 0/0/17%
Non-Seedance list: S03-SH04 HUD 12.0 s (NONAI) · S09-SH02 freeze 8.0 s (SD-STILL) · FLAGS: 0
هل تعتمد هذه الأرقام لنموذج الإفصاح؟
```
**T3 — Cut-pair card:** `cut S03-SH02→S03-SH03 · A_last/B_first frames · codes found · severity · proposed fix · your decision ____`.
**T4 — Physics card per shot:**
```text
S03-SH02 · REAL · 15 Apr 2045 11:40 · lens 278° · sun az 147 el 72 rel +131 · shadow 0.32× · walk 1.35 m/s
train 85 m @ 12 m/s = 7.1 s full pass · contact f133 · devices: lens HUD off · DREAM exception: none · QA: PASS
```
**T5 — AI disclosure draft** (Terms cl. 5.5(a), from the ledger only):
| Tool | Model / version | Route | Account | Used for | Share of film |
|---|---|---|---|---|---|
| Dreamina Seedance | dreamina-seedance-2-5-260628 | BytePlus ModelArk API | <ModelArk account/project> | all final picture, native SFX | picture 95.1% · FX audio 61% |
| ElevenLabs | eleven_v4 (dialogue), music_v2_5 | ElevenCreative (Enterprise contract, Enterprise Music tier) | <org> | dialogue, score cue M02 | DX 100% · MX 40% |
| … one row per tool, including support tools (GPT Image 2.5 Sunburst references, any upscale or cleanup model from 07 §7.5) with "share: 0 s on screen, used for references" | | | | | |

Then the non-AI elements with source and licence (fonts, procedural SFX code, the Summit intro), and every face and voice declared synthetic or real (cl. 5.5(c), (d)).
**T6 — Version change alert:** «تنبيه: تغيّر <model/route> منذ آخر تحقق (<old> → <new>). أوقفت توليد <job class>. اقترح تشغيل لقطة الاختبار canary بدقة 480p ومقارنتها قبل المتابعة. هل توافق؟»

## Gate

- **G-L0 (D1):** naming table, film code, story date and clock, version pins and world decisions approved. Ask: «هل تعتمد قواعد التسمية وتاريخ القصة وقرارات العالم كما في الجدول؟»
- **G-L1 (each shot, before final-from-draft and again on the final):**
  - the ledger row is complete with no blanks;
  - cut-pair and physics QA are PASS or WAIVED in the user's words;
  - DREAM exceptions are registered.
- **G-L2 (with 07's G3 picture lock):**
  - R1 ≥ 90%; 80–90% only with the user's written waiver, below 80% fails (07 §7.4); zero FLAG lines in the share report;
  - every in-final row is APPROVED;
  - continuity cards are closed and the sun cheats are logged.
- **G-L3 (with 00's G4 submission):**
  - T5 is approved by the user word for word;
  - the evidence archive (ledger, raw JSON, prompts, reports, XML) is backed up in two places;
  - c2pa status is recorded for the masters (07 rule 4).

Silence or a change of subject is not approval.

## Common failures

| Failure | Cause | Fix |
|---|---|---|
| A Seedance final is lost | URL died after 24 h or 100 downloads | download in the same turn (L.2); keep `inflight.md` |
| A draft can't be finalised | the draft ID expired (official 14 days; house rule finalise before day 5) | the T1 card warns at 48 h; finalise or drop |
| The share is low at lock | UNLEDGERED clips counted as non-Seedance; HUD over black | ledger every file; put graphics over Seedance plates (`SD+TXT`) |
| Double billing | a timed-out task was resubmitted | poll the same task ID; never resubmit |
| The disclosure says "Seedance" with no version | a third-party route label was logged without a date | follow L.3 rule 5; ask the route; add the question to the Organizer email |
| A model drifted mid-film | a provider update or route switch | daily pin diff, canary, major version bump |
| The prop resets between cuts | its state machine was not consulted | L.6 rule 1; cut-pair check |
| Sun direction flips on a reverse | the variant rule was applied without per-shot physics | run `sun_position.py --cam` per shot; 04 asks: keep or cheat |
| Short noon shadows on an October date | the story date conflicts with R-DAY | move the date (Apr–Aug) or soften R-DAY; the user decides |
| The hero object falls in slow motion while people move in real time | the model slowed one object | count frames against L.7.2; re-prompt with mass in kg |
| A hologram has black areas or occludes the background | the emissive rules were ignored | L.7.8 rules 1–2 in the device bible and prompt |
| The palm call is shown with the lens out | a device-state continuity break (C1) | ring projection, or show the lens going in |
| The glass "crawls" or explodes like sugar glass in REAL | wrong glass type or speed | L.7.4 table; DREAM register for exceptions |

## Sources and licences

- **calesthio/generative-media-skills** (MIT; HEAD 8c85352, 2026-07-14): `asset-continuity-management`, `media-provenance-rights`, `generated-media-qa`. Short quotes, credited above; the manifest, ledger and continuity-bible shapes are adapted.
- **OSideMedia/higgsfield-ai-prompt-skill** (MIT; HEAD 6a6a5dd, 2026-10-24): `higgsfield-seedance` SKILL and FAILURE-MODES, `higgsfield-acting` ("degradation accumulates"). Quoted on mass in real units, causal props and the walking counter; the headcount lock is paraphrased. Nothing is taken from AGPL sources (OpenMontage).
- **contentauth/c2patool** and **c2pa-rs** (MIT/Apache-2.0): `--info` and `-d` usage; supported formats.
- The user's own skills **cinematic-pipeline** (failure codes, physics and continuity prefix lines) and **seedance-director** (off-screen and exit-frame rules): carried over.
- Facts, not quoted:
  - NOAA solar-calculator equations (Meeus), implemented in our own code;
  - Weidmann 1993 parameters via arXiv 0901.0170;
  - Comfy mirror of the BytePlus Seedance 2.5 schema (draft, URL expiry and 100-download cap, `watermark` default false, `output_format`, `return_last_frame`); fal.ai and APIYI pages (7-day draft life, re-checked 2026-10-30; superseded by the official 14-day figure read in 05);
  - the OpenAI model page (`gpt-image-2.5-sunburst-2026-09-08`);
  - Adobe Help (Project panel List View columns);
  - Dubai Metro facts (Wikipedia, railway-technology, Alstom, Gulf News).
