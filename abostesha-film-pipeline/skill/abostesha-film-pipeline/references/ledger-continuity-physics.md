# Ledger, Continuity and Physics (cross-cutting, runs beside Steps 0–9)

**Purpose.** Keep one append-only record of every asset and generation, so the AI disclosure, the Seedance share and any Organizer request (prompts, history, shot logs within 7 days, kept 24 months; Terms cl. 5.5) come out of files, not memory.
**Also.** Keep the film the same film across 40–100 generations (continuity bible), and keep every frame physically plausible, sci-fi devices included (physics bible). Every check is keyed to a shot ID that Premiere shows.
**Rule.** Talk to AboStesha in Arabic. Every ledger cell, file name, bible entry and prompt is in English. This module owns the schemas; Steps 00–09 write rows into them.
**Study update (2026-11-02).** The folder additions (L.0b), element naming (L.1), chain-log columns (L.4), budget in generated seconds (L.5), continuity-bible fields (L.6), robot gait and contact (L.7.7) and the silent watch (L.7.11) are the approved proposals PL-1 to PL-7 of the cross-study playbook (`prompt-library/studies/2026-11-02_CROSS-STUDY.md` §3C, §4.7), learned from 12 public Higgsfield films: method only, no character, design or story taken (credits in Sources). Image jobs use the model each studied film used best for that job (03 §3.0.1, decision 2026-11-02), so the tool codes (L.1) and pins (L.3) cover the whole routing table. The two-scene pilot (SKILL.md) runs on this module unchanged, and its approval freezes the pins and the budget ratios for the rest of the film (L.8).

Tags: `[OFFICIAL]` vendor or Organizer docs · `[DOC-3P]` third-party mirror of vendor docs · `[FIELD]` a practitioner skill's tested rule · `[STUDY]` seen in the 12 studied Higgsfield films, with the number of films (n/12) or jobs · `[TEXTBOOK]` a standard physics or engineering value · `[COMPUTED]` computed here or with `scripts/sun_position.py` / `scripts/share_report.py` · `[HOUSE]` our default · `[UNVERIFIED]` confirm before relying on it · `[TESTED]` run in this session.

---

## Inputs

| Input | From | Used in |
|---|---|---|
| Film code (`SLA`), film folder, Seedance-share targets, readings R1–R3, definition of T | `00-award-brief-and-calendar.md` §0.4 | L.0, L.5 |
| Scene list (S##, LAYER, FLAGS), line IDs, authorship log origin codes (H, H/C, C, G, T, F) | `01-script-and-dialogue.md` | L.2, L.4, L.6 |
| LOOK version, variants (R-DAY, R-INT, DREAM, BROADCAST, FINALE), reserved green `#3BD16F`, golden hour reserved for FINALE | `02-style-prefix.md` §2.5 | L.6, L.7 |
| Asset IDs, approved files and SHA-256, Higgsfield job IDs of the approved sheets (and reference-element IDs and names if the face route uses them, L.1, L.3), the routing row and model of every image job (03 §3.0.1), continuity entries (marks, costume phrase, scale) | `03-assets-images.md` | L.1, L.2, L.3, L.6 |
| Blocking table, hand-off sheets (lens heading, camera-relative sun, contact frames, speeds, robot gait keys) | `04-blender-blocking.md` | L.4, L.7 |
| Every Seedance job (Higgsfield MCP or the user's hand-made web job in the same project), its response JSON and download; the chain log (`05-seedance/<S##>/chain_log.csv`, 05 T8) | `05-seedance-production.md` | L.2, L.3, L.4, L.5 |
| The two pilot scenes, the pilot tests and the recipe locks at pilot approval | SKILL.md (two-scene pilot); 02 §2.13; 03 §3.5; 04 §4.14; 05 §5.11 | L.0b, L.3, L.5, L.8 |
| Colour script line per variant, value words if a sequence is B&W | `02-style-prefix.md` §2.5 | L.6 |
| Performance IN/OUT per shot and character | `05b-acting-direction.md` §5b.7 | L.6 |
| Cue log, SFX gap list, stems and their origins | `06-music-and-sfx.md` §6.4 | L.2, L.5 |
| Premiere FCP XML of the locked sequence; snapshots | `07-edit-mix-finish.md` §7.1, §7.4 | L.5 |
| Story date, story clock, world decisions (L.7.9) | the user | L.7 |

## Ground rules

1. **One source of truth.** `SLA_LEDGER.csv` holds one row for every file that can reach the film or that shaped something in it: reference, prompt run, draft, final, edit, take, cue, SFX, render, font, the Summit intro. The row exists before the file is used downstream. "Never manage continuity by memory, filenames alone, or chat history alone" (calesthio asset-continuity-management, MIT).
2. **Append-only.** Rows are never deleted. After a row is written, only these cells may change: `review_status`, `approved_by`, `approved_utc`, `approval_words`, `post_edits`, `in_final`, `seconds_in_final`, `share_of_film_pct`, `notes`. Every other cell records a fact about the generation and is frozen. Fix a mistake with a new row whose `notes` say `corrects G05-0142`.
3. **Explicit unknowns.** Write `not_provided`, `unknown` or `n/a`, never a blank. A strong manifest "favors explicit unknowns over blank cells" (calesthio, MIT).
4. **Download now.** Higgsfield does not publish how long a result URL lives `[UNVERIFIED]`, and the Higgsfield project is never the only copy (L.0b). Download the original, hash it and log it in the same turn the job completes.
5. **Never touch provenance.** Never crop, blur or cover a watermark; never strip metadata; never remux a credentialed file (Terms cl. 5.6; 07 rule 4). Record what each file carries.
6. **No secrets.** `account` holds a login, workspace or project name (for Higgsfield: workspace and project). Never write an API key or token anywhere in this folder.
7. **File names are IDs.** The name carries shot, tool and version, so Premiere's clip name equals the ledger key. Never rename a logged file. Copy it to a new name and add a derivative row.
8. **Physics is the default.** Every REAL shot obeys L.7. A DREAM shot breaks physics only in the one way declared in the register (L.7.10; 02 §2.5). Sci-fi devices follow the device rules (L.7.8).

---

## Procedure

### L.0 Set up (D0–D1, about 20 minutes)

```text
films/01-second-life-ascent/ledger/
  SLA_LEDGER.csv          ← templates/ai-disclosure-ledger.csv   (append-only, one row per generation/file)
  SLA_SHOTS.csv           ← templates/shot-list.csv              (one row per shot, updated in place; + the L.4 chain columns)
  SLA_BUDGET.csv          (L.5: generated seconds per scene against story seconds; rebuilt from the ledger at each daily close)
  continuity-bible.md     ← templates/continuity-bible.md
  physics-bible.md        ← templates/physics-bible.md
  version-pins.md         (L.3)            decisions.md (append-only: date · decision · who · words)
  prompts/<gen_id>.txt    (only when the step has no prompt file of its own)
  raw/<gen_id>.json       (Higgsfield MCP response for every job, or its project read-back: generation history evidence)
  reports/                (share reports, ffprobe, c2patool output, cut-pair and physics cards)
06-audio/logs/SLA_06_cue-log.csv   ← templates/music-cues.csv   (06 owns it; columns 1–22 = 06 T3)
06-audio/spotting/SLA_06_SFX-GAPS_vNN.csv ← templates/sfx-list.csv (06 owns it; columns 1–12 = 06 T4, TC split in/out)
```
1. Copy the templates, delete the `EXAMPLE` rows, keep the headers exactly. The two scripts this module uses live in the skill: `scripts/share_report.py` (L.5) and `scripts/sun_position.py` (L.7.1). Run them from the skill folder with `python3 -I`; they read files and write nothing.
2. Ask in Arabic, one message: «أبوستيشا، قبل أن نبدأ: (1) رمز الفيلم في أسماء الملفات SLA، هل نعتمده؟ (2) ما تاريخ أحداث القصة (اليوم والشهر)؟ اقتراحي منتصف أبريل 2045 لأن ظل الظهيرة القصير في R-DAY لا يصح فيزيائياً إلا من أبريل إلى أغسطس. (3) قرارات العالم في القائمة L.7.9.»
3. Backups: the `ledger/` folder lives in the repo (text); export a copy to Drive `08_EVIDENCE/` (L.0b) at every daily close, keep the PC mirror, and write `reports/SLA_checksums_<date>.sha256` each evening (00 D2: two places, 24 months).
4. Holdback: `films/` sits in the GitHub repo. Before the first download add `.gitignore` lines `films/**/*.mp4`, `films/**/*.mov`, `films/**/*.wav`, `films/**/*.mp3` and `films/*/ledger/raw/` (03 already covers images). No clip or audio file goes to GitHub, and the repo stays private until the holdback ends.

### L.0b Storage roles and the folder tree (decided 2026-11-01, updated 2026-11-02 with PL-1; Claude builds and maintains it)

**One tree, same names everywhere.** Claude creates it at Step 0 (Higgsfield via `create_project` + `create_folder`; Drive via the connector or exact steps for the user) and files every new item the moment it exists.
```text
<CODE>_<film-slug>/
  00_STYLE/                    look frames, style-lock card; UNUSED/
  01_CHARACTERS/CHR_<NAME>/    casting, face, turnaround, expressions, wardrobe; approved/ · UNUSED/
  02_LOCATIONS/LOC_<NAME>/     scouts, plates per time of day; approved/ · UNUSED/
  03_PROPS/PRP_<NAME>/         hero sheets; approved/ · UNUSED/
  04_SCENES/S01_<slug>/        one folder per scene, numbered as in the script; an inserted scene takes a letter (S06A_<slug>)
     refs/                     copies of the approved CHR/LOC/PRP this scene uses (Higgsfield: copy_project_asset; Drive: shortcuts)
     blocking/                 playblasts and blocking stills (PB/REV/STILL, MRK/PLAN/SKT)
     drafts/                   SD25-DRF, filed in one sub-folder per planned shot:
        S01-SH01/ … S01-SHnn/  made from SLA_SHOTS.csv before the scene's first draft; an empty folder = a shot not drafted yet
     finals/                   picks only: the approved SD25-FIN, EDT and EXT files and their _LF.png
     UNUSED/                   superseded picks and rejected finals, moved here, never deleted
  04_SCENES/PICKUPS_01/ …      after the first assembly (07): drafts/<shot>/, finals/ and UNUSED/, as in a scene
  05_AUDIO/DX · MX · FX        dialogue takes, score cues, SFX
  06_EDIT/                     Premiere project, review exports, FCP XML
  07_DELIVERY/                 masters, subtitles, Summit intro, posters
  08_EVIDENCE/                 RAW_SEEDANCE/ (byte-identical originals for the upload page), ledger exports, consents, licences, Organizer mail
  99_TESTS/                    D1 route tests, cost probes (the pilot's tests run in the pilot scenes' own folders, L.8)
```
Higgsfield holds 00–04 and 99 (where generation happens) down to the scene folder and its `refs/`, `blocking/`, `drafts/`, `finals/` and `UNUSED/`; `folder_id` follows 05 and 07. Drive and the PC hold the whole tree, including the per-shot folders: the file name already carries the shot ID, so the downloaded original is filed by name, and 40–100 non-idempotent `create_folder` calls on Higgsfield are avoided.

**Folder rules** (PL-1, `[STUDY]`: CONTROL kept rejects in `UNUSED/` at every level and gave a later scene a letter (`SCENE 06A`) so nothing renumbered; in Buzkashi the folder tree was the shot list, with 10 empty folders for planned shots; In Passing made `Pickups 1…8` after its assembly; HUNGER's `_SCENES` was the picks bin, holding 29 of the 42 takes in its film; likes and favourites were never used in 9/12):
1. **Selection lives in folders.** `approved/` and `finals/` hold picks only. A candidate that is not picked goes to `UNUSED/` beside it; a pick that is later replaced is moved to `UNUSED/` and its ledger row becomes SUPERSEDED. Nothing is deleted, on Higgsfield (`move_project_asset`) or on Drive.
2. **Planned shots are visible.** After 04's shot list exists (the two pilot scenes first, the rest after the pilot approval and before their first draft), Claude creates one per-shot folder under each scene's `drafts/` on Drive from `SLA_SHOTS.csv`. A shot marked OMITTED keeps its folder with a `_OMITTED.txt` note (01: never renumber).
3. **Letters, never renumbers.** An inserted scene takes a letter (`S06A_<slug>`) and an inserted shot takes one too (`S06-SH03A`), in file names, folders, `SLA_SHOTS.csv` and Premiere bins.
4. **Pickups** (07 §7.4, after the first assembly). Each pickup gets a new shot ID in the scene it serves: lettered when it sits between existing shots (`S05-SH03A`), otherwise the next free number (`S05-SH14`); so it counts in that scene's budget (L.5) and Premiere bin. It is made in `04_SCENES/PICKUPS_<nn>/` (drafts in `drafts/<shot>/`, the pick in its `finals/`, with a Drive shortcut in the scene's `finals/`), and the ledger `notes` say `pickup PICKUPS_01`.

**Where things live:**
| Place | Role | Holds |
|---|---|---|
| Higgsfield project | workspace + generation history (evidence) | every generation in its folder (`folder_id` on every `generate_image` / `generate_video` call; the user's hand-made web-app jobs go in the same project and folder); never the only copy |
| Google Drive | master archive and the shared space with the Blender collaborator | every approved asset, every Seedance original downloaded the moment it finishes (byte-identical), audio, edit exports, 08_EVIDENCE; keep 24 months after the Award |
| The user's PC (Google Drive for desktop in Mirror mode) + one external drive | fast working copy for Premiere, plus an offline backup | the same tree; Premiere links to the PC copy |
| GitHub (private repo only) | text and memory | PROJECT.md, script, dialogue sheets, prompts, ledger CSVs, decisions; never images, video or audio (`.gitignore` in SKILL §4) |

Rules: the Seedance original is downloaded and hashed before anything else touches it; RAW_SEEDANCE is never edited, renamed or re-exported; the Drive tree is the one the competition evidence comes from.

### L.1 Naming convention that matches Premiere

Premiere names a clip after its file. So the file name is the shot database key, and the timeline can be audited from the names alone.

| Kind | Pattern | Example |
|---|---|---|
| Seedance draft (480p; never imported into the edit) | `SLA_<SHOT>_SD25-DRF_v<NN>_t<K>.mp4` | `SLA_S03-SH02_SD25-DRF_v03_t2.mp4` |
| Seedance final from that draft (`draft_job_id`, 1080p) | `SLA_<SHOT>_SD25-FIN_v<NN>_t<K>[_f2].mp4` (Higgsfield has no output-format field; keep the extension of the file it delivers, read from the file, never from the URL) | `SLA_S03-SH02_SD25-FIN_v03_t2.mp4` |
| Seedance edit (`mode: video_edit`) / extension or bridge (`mode: video_extension`) | `…_SD25-EDT_v<NN>_t<K>_e<NN>.mp4` · `…_SD25-EXT_…` | `SLA_S03-SH07_SD25-EDT_v02_t1_e01.mp4` |
| Last frame of a final (Higgsfield returns no last-frame file: extract it with `ffmpeg -sseof -0.05 -i <final> -frames:v 1` from the downloaded original; a derivative row with `parent_gen_id`) | `…_SD25-FIN_v<NN>_t<K>_LF.png` | uploaded (`media_upload` → `media_confirm`) as the next shot's `start_image` (05) |
| Derivative render of any file | parent name + `_<OP>v<NN>` (OP: `TXT` text comp, `CLN` paint/cleanup, `UPS` upscale, `GRD` graded render) | `SLA_S06-SH01_SD25-FIN_v01_t1_TXTv01.mov` |
| Other picture | `SLA_<SHOT>_<CODE>_v<NN>_t<K>.<ext>` | `SLA_S03-SH04_GFX_v01.mov` |
| Image assets | 03's pattern `<ASSET>_<state>_<sheet>_v<NN>_<model>_t<N>.png`; 03's `approved/…_APPROVED.png` copy has the same SHA-256, so it goes in the same row's `notes`, not a new row | `CHR_MIRAJ_base_face_v03_G2_t2.png` |
| Higgsfield reference element (only if T1 picks the element route, 03 §3.4) | `<ASSET>_<state>_v<nn>`, where `<ASSET>` = `<TYPE>_<NAME>` (`CHR`, `LOC`, `PRP`); ≤ 32 characters; `nn` = the element's own version | `CHR_MIRAJ_base_v01` |
| Playblasts | 04's `_PB_` / `_REV_` / `_STILL_` (never imported into the edit) | `SLA_S03-SH02_PB_v03.mp4` |
| Dialogue takes | 01's `SLA_<LINE>_<CHAR>_T<NN>.wav` and per-shot copy | `SLA_S07-SH04_S07-L03_MOTHER_T02.wav` |
| Music, SFX, Seedance audio extract | 06's `SLA_<CUE/SHOT/SEQn>_<FXnn/BGnn>_<slug>_<SRC>_v<NN>[_t<K>][_48k].wav` | `SLA_S03-SH02_SDFX_v01.wav` |

Tool codes (picture; image codes = 03 §3.1.1, one per routing-table model): `SD25` Seedance 2.5 · `SD20` Seedance 2.0 · `G2` GPT Image 2 · `G25S`/`G25F` GPT Image 2.5 Sunburst/Flare · `NBP` Nano Banana Pro · `NB2` Nano Banana 2 · `NB21` Nano Banana 2.1 · `SD5P` Seedream 5.0 Pro · `J3D` Seedream 5.0 Pro angles (`3d_jutsu_angles`) · `SCIN` Soul Cinematic · `SCAST` Soul Cast · `SLOC` Soul Location · `CS25` Cinema Studio 2.5 (shoot-out only) · `UPS` ByteDance image upscale · `TPZ` Topaz (image or video upscale, 07) · `MJ82` Midjourney V8.2 (optional, user-run) · `BLN` Blender render · `GFX` titles or graphics · `BLK` black · audio `SUNO`, `EL`, `ELSFX`, `PROC`, `SD`/`SDFX`, `USR` (06).

Rules:
- `v` bumps when the prompt or references change; `t` is the take in a run (03 rule). A final inherits its draft's `v` and `t`. A second final from the same draft adds `_f2`.
- **Element names** (PL-3 `[STUDY]`: Fukushima, CONTROL, Buzkashi and HUNGER named elements `char_` / `loc_` / `prop_` with a version, 4/12):
  - **A new image is always a new version and a new element, never a silent swap.** HUNGER re-pointed `char_yoki_v4` at three different images, and `loc_flat-empty` at three, without renaming them, so its job history no longer says which image a take used. Here an element's source image is fixed at creation; a changed image makes `…_v02` with its own `element_id`, and the old one stays in the bible as SUPERSEDED.
  - **Neutral words only.** TOKYO 4:17's element `red-mirror` came out painted on a street sign. Element names and asset IDs are codes that would be harmless as on-screen text: no brand, trademark, product name or loaded word (no `HALO`, no "Second Life"; 03 §3.1.1).
  - **Logged both ways.** The ledger `references` cell writes `element=<element_id>(CHR_MIRAJ_base_v01)`; the bible entry lists `element_id`, name, source job ID and status. A `<<<element_id>>>` placeholder with no matching element at `completed` fails the pre-submit lint like an empty element slot (HUNGER shipped 43 of them; 05 §5.4).
- Use ASCII letters, digits, `-` and `_` only. No spaces, no "final_final".
- An inserted scene or shot takes a letter (`S06A`, `S05-SH03A`), never a renumber (L.0b rule 3); a pickup is named the same way (07 §7.4).
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
| Tool | `tool, model_id, model_snapshot, mode, route, account, plan_tier` | exact strings from L.3. `tool` = `Higgsfield` for every picture generation; `model_id` = the Higgsfield id (`seedance_2_5`; image ids from 03 §3.0.1, e.g. `gpt_image_2`, `gpt_image_2_5`, `seedream_v5_pro`, `nano_banana_pro`, `nano_banana_2`, `soul_cinematic`, `cinematic_studio_soul_cast`), and `notes` start with the 03 routing row (`row 5`); `route` ∈ `higgsfield-mcp`, `higgsfield-web` (the user generated by hand in the web app). `mode` ∈ t2i, i2i-edit, t2v, i2v, ref2v, draft, final-from-draft, edit, extend, tts, music, sfx, procedural, manual-ui (the Higgsfield `mode` value goes in `params`) |
| How | `params, prompt_file, prompt_sha256, prompt_origin, references, parent_gen_id` | `params` as `k=v;k=v`, every field sent (`model=seedance_2_5;mode=omni_reference;draft=true;resolution=480p;aspect_ratio=16:9;duration=7;generate_audio=true;bitrate_mode=high;folder_id=<uuid>`; a final adds `draft_job_id=<uuid>;resolution=1080p`). `prompt_origin` uses 01's codes. `references` lists media roles, IDs and what they are: `image_references=<media_id or job_id>(CHR_MIRAJ_base_face_v03);video_references=<media_id>(SLA_S03-SH02_PB_v03.mp4)`; a reference element is `element=<element_id>(CHR_MIRAJ)` |
| IDs and time | `task_id, draft_task_id, seed_returned, submitted_utc, completed_utc, downloaded_utc, url_expires_utc, draft_expires_utc` | `task_id` = the Higgsfield job ID; `draft_task_id` = the draft job a final was finalised from (`draft_job_id`). ISO 8601 UTC with `Z`. GST = UTC+4, for display only |
| Output | `file_name, file_sha256, tech, c2pa_status, watermark, cost` | `file_sha256` = SHA-256 of the downloaded original, before anything else touches it. `tech` = ffprobe summary. `c2pa_status` ∈ present-valid, present-invalid, absent, not_checked. `watermark` ∈ none, visible, invisible-claimed (e.g. SynthID). `cost` = Higgsfield credits from `get_cost` (Seedance 2.5 measured 2026-11-01: 3 credits/s draft, 16 credits/s 1080p; references and `bitrate_mode` do not change the price) |
| Review | `outcome, review_status, approved_by, approved_utc, approval_words` | `outcome` ∈ OK, FAILED, FILTERED, TIMEOUT. `review_status` ∈ CANDIDATE, APPROVED, REJECTED, SUPERSEDED. `approval_words` = the user's Arabic words, verbatim |
| Authorship and rights | `human_contribution, post_edits, synthetic_or_real, consent_ref, licence_ref` | e.g. "AboStesha wrote beat text; picked t2 of 4". Every face and voice is `synthetic` or `real+consent` (cl. 5.5(d)) |
| Final cut | `in_final, origin_class, seconds_in_final, share_of_film_pct, notes` | filled from L.5 at G3 and G4 |

**When to write (triggers):**

| Event | Row or cells |
|---|---|
| A Seedance job finishes (any outcome) | new row: Higgsfield job ID, model, `folder_id` in `params` and the folder path (`04_SCENES/S03_<slug>/drafts`) in `notes`, the original's SHA-256. While a job runs, keep its ID in `reports/inflight.md` and wait with `jobs_wait` on that ID. **Never repeat a `generate_video` call that timed out**: the job may already exist and a second call bills a second generation; look for it first (`show_generations` with `only_completed: false`, or `list_project_assets` on the folder) |
| Image generation (Higgsfield `generate_image`) | new row with the Higgsfield job ID in `task_id`, the folder as above |
| TTS, music or SFX generation through an MCP | new row with flow/job/generation IDs in `task_id` and the flow URL in `notes` |
| The user generated by hand in the Higgsfield web app (same project) | read it back, no paste needed: `list_project_assets` (filter `folder_id`, `model_ids`), then `get_project_asset_prompt` for the prompt and settings and `get_project_asset_source` for the download; `route=higgsfield-web`, `mode=manual-ui`; save both responses as `raw/<gen_id>.json`. Sweep every scene folder at the daily close so no hand-made job is missing |
| Manual tool (Midjourney, Suno web, ElevenCreative) | the user pastes the job ID or link (Arabic: «يُرجى لصق رابط المهمة أو رقمها»), then you write the row. Midjourney rows note Stealth on (03) |
| The user approves or rejects | update the review cells only |
| A derivative is rendered (text comp, paint, upscale) | new row: `parent_gen_id` = source; the tool that made the change; the class from L.5 |
| A non-AI element enters (font, user recording, procedural SFX, Summit intro) | new row: `tool` = the source (e.g. `font: <family> (<licence>)`, `scripts/sfx_forge.py@<git sha>`); `licence_ref` is mandatory (cl. 5.5(c)) |
| Picture lock (G3) and submission (G4) | `in_final`, `seconds_in_final` and `share_of_film_pct` from the L.5 report |

**Seedance download routine** (run the moment the job is completed; 05 submits, this module logs). The URL is the result URL `jobs_wait` returns, or the download URL `get_project_asset_source` gives for the job's placement:
```bash
F=SLA_S03-SH02_SD25-FIN_v03_t2.mp4
curl -sS -L --fail -o "$F" "$VIDEO_URL"            # Higgsfield URL lifetime not published: download now
sha256sum "$F" >> reports/SLA_checksums_$(date +%F).sha256
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,r_frame_rate,pix_fmt:format=duration \
  -of compact=p=0 "$F" > reports/$F.ffprobe.txt     # expect 1920x1080, 24/1
c2patool "$F" --info > reports/$F.c2pa.txt 2>&1 || echo "c2patool missing or no manifest" >> reports/$F.c2pa.txt
```
- Save the full Higgsfield response (the `generate_video` return and the completed `jobs_wait` entry; for web-made jobs the project read-back) as `raw/<gen_id>.json`. Field names stay `[UNVERIFIED]` until the first live job.
- Set `url_expires_utc` = `unknown` (Higgsfield does not state it); the same-turn download makes it irrelevant.
- Set `draft_expires_utc` = draft `submitted_utc` + **7 days** (Higgsfield `seedance_2_5` `draft` field: "a 480p draft that can be finalized within seven days"; `models_explore`, read 2026-11-01). House rule: finalise or kill every approved draft before it is 5 days old (00 §0.7). Finalise in the same Higgsfield workspace with `draft_job_id`, into the scene's `finals/` folder; a draft job from another account cannot be assumed to work `[UNVERIFIED]`.
- `c2patool` (contentauth/c2patool, MIT/Apache-2.0; CHANGELOG top 0.26.72, 13 Jul 2026) reads mp4, mov, wav, png and jpg (c2pa-rs supported formats). The first results become 00's T4 provenance test.
- **Model cells (Higgsfield is a third-party platform).**
  - `model_id` = the Higgsfield id and `notes` = the label exactly as `models_explore` shows it (`seedance_2_5`, "Seedance 2.5", provider Bytedance), plus the job ID.
  - `model_snapshot` = the underlying ByteDance model ID only if Higgsfield states it; otherwise `not_provided`, and the question goes in the Organizer email (00 §0.9). The disclosure must name the Seedance version used through any third-party platform (cl. 5.5(a)).

### L.3 Version pinning (`version-pins.md`)

A pin = model ID or snapshot + route + plan tier + default parameters + date verified + how verified. Every ledger row copies `model_id` and `model_snapshot` from the pin.

| Job class | Pin (verified 2026-11-01 unless noted) | Status |
|---|---|---|
| Final picture | Higgsfield `seedance_2_5` ("Seedance 2.5", provider Bytedance), MCP `generate_video` or the web app in the same project: `draft: true` (480p) → finalise the same take with `draft_job_id` at `1080p` within 7 days, `bitrate_mode: high`; modes `t2v` · `omni_reference` · `video_edit` · `video_extension`; duration 4–30 s; media roles `start_image`, `end_image`, `image_references`, `video_references`, `audio_references`; no seed field. Cost 3 credits/s draft, 16 credits/s 1080p | `[TESTED]` `models_explore` get and `get_cost` (5 s draft = 15 credits, 5 s 1080p = 80), 2026-11-01. For reference only, ByteDance's own API names Seedance 2.5 `dreamina-seedance-2-5-260628`; Higgsfield does not expose that snapshot, so `model_snapshot` = `not_provided` (rule 5). The BytePlus ModelArk API route exists but is not used (decision 2026-11-01: everything in Higgsfield) |
| Seedance face route | proven on D1 (T1) and recorded here: (a) the approved sheets as `image_references` (or `start_image`) for `seedance_2_5`; (b) if faces are refused, a Higgsfield reference element (`manage_reference_elements` create, `<<<element_id>>>` in the prompt); (c) else a first frame generated inside Higgsfield from the sheets (`generate_image`) used as `start_image` | `[UNVERIFIED]` until T1. The reference-element tool lists `seedance_2_0`, not `seedance_2_5`, among its video models (read 2026-11-01), so (b) needs its own T1 take. Every route change is a major change (rule 1) |
| Image assets (one pin per 03 routing-table row) | the row's primary model and settings in 03 §3.0.1, its alternative only as the row allows: casting `cinematic_studio_soul_cast` / `soul_cinematic` → realism pass and identity sheets `gpt_image_2` (4k, high) · plates, props and extras `seedream_v5_pro` (2k) · relights, keyframes and one-change edits `nano_banana_pro` · precise or text-sensitive work `gpt_image_2_5` (`variant: sunburst`, `quality: max`) · still upscale `upscale_image` / `topaz_image`. Set every field (bare GPT Image calls default to flare, low, 1k). `nano_banana_2` is a live model (Nano Banana 2), not the deprecated NB2; `nano_banana_2_1` only inside pilot test T-I2 | `[TESTED]` `models_explore` get and `get_cost: true`, 2026-11-02 (03). Higgsfield exposes no vendor snapshot: `model_snapshot` = `not_provided` |
| Video upscale (optional finishing pass after G3, never a fix; 07 §7.12b) | `upscale_video`, `provider: "topaz"`, `resolution: "2160p"`, `aspect_ratio: "16:9"`, `video_id` = the final's own Higgsfield job ID; no cost preflight (quote from one clip's real cost) | `[UNVERIFIED]` until pilot test T-U (07 §7.14) passes; class SD derivative rows; disclosed as a support tool (T5) |
| Look-dev (manual, optional) | Midjourney `--v 8.2` (+ V8.2 Edit Model), only when the user runs it by hand; no longer a default deliverable (decision 2026-11-02) | BRIEF |
| Dialogue, music, SFX | `eleven_v4` · `music_v2_5` (MCP `eleven_music_v2_5`) · `eleven_text_to_sound_v2` · Suno `v6` (record the UI label: v6 / v6-wild / v6-mini) | ElevenLabs model docs (localised pages); Suno per BRIEF |
| Tools that shape frames | Blender version + MCP server and version; Premiere Pro version (Help ▸ About); `scripts/sfx_forge.py` git SHA; `c2patool -V` | record on D1 |

Rules:
1. **One pin per job class for the whole film.** For images the job class is the 03 routing-table row, so a plate and a sheet may come from different models, but one row never switches model mid-film. A model or route change is a major change (calesthio's `v2.0` rule): bump `v`, and never mix two models inside one job class in one scene without the user's yes. At the pilot approval the pins in use are frozen as the production pins (L.8).
2. **Daily check, before the first job.** List the live models and diff them against the pins:
   - Higgsfield (all picture): `models_explore` get for `seedance_2_5` and for every image model id the day's jobs will use (03 §3.0.1; 03 re-verifies the whole table every 14 days): name, parameters, options and media roles;
   - ElevenLabs (audio only): `creative_get_flow_node_types`.

   On any difference, stop that job class and show T6.
3. **Canary.** Keep one approved 5 s Seedance draft per variant (R-DAY, DREAM) with its prompt and references frozen; after the pilot approval, an approved pilot draft of that variant is the canary (L.8). After any pin change, re-run it as a Higgsfield draft (480p, 15 credits) in `99_TESTS/` and compare side by side with the approved one before production continues. Log it as `purpose=canary`.
4. **Seeds are not continuity.** Higgsfield's `seedance_2_5` has no seed field (`models_explore`, 2026-11-01). Record `seed_returned` only if a response carries one, else `n/a`. A draft and its final share settings by construction.
5. **Labels without versions.** Disclose as: Seedance 2.5 (as labelled by Higgsfield: "Seedance 2.5", model id `seedance_2_5`, accessed <date>), plus the ByteDance model ID only if Higgsfield or the Organizer confirms it.

### L.4 Shot database (`SLA_SHOTS.csv`)

- **One row per shot.** The header is a superset of 04's blocking keys (`shot_id,line_ids,mode,variant,size,lens_mm,cam_height_m,move_rig,edit_s,gen_s,frames,cast,beats,screen_dir,physics,owner,status`) and of 08's `SHOTS.csv` (`tc_in, tc_out, frames, scene, world, hero, tool+route, draft_job, final_job`), so both modules export from it without retyping. 08's names map as: scene = `scene_id`, world = `layer`, tool+route = `origin_class` + `route`, draft_job = `draft_task_id`, final_job = `final_task_id` (both hold Higgsfield job IDs).
- **Lifecycle:** PROPOSED → BLOCKED (04 approved) → DRAFTING → DRAFT-APPROVED (05b G5b-C) → FINAL-APPROVED → IN-CUT → LOCKED. A cut shot stays in the table as OMITTED; never renumber (01).
- **Who fills what:**
  - 01: `scene_id`, `line_ids`, `layer`.
  - 02: `variant`, `wb_k`.
  - 04: camera, `lens_heading_deg`, `screen_dir`, `beats`, `physics`.
  - L.7: `story_date`, `story_time`, `sun_*`.
  - L.6: `wardrobe`, `props_state`, `accumulated`, `eyelines`.
  - 05: `draft_*`, `final_*` and the chain columns below.
  - 07 and L.5: `tc_in`, `tc_out`, `premiere_clip`, `seconds_in_final`.
  - `continuity_check` and `physics_check` are PASS, FAIL or WAIVED. WAIVED needs the user's words in `decisions.md`.
- **Chain columns** (PL-2 `[STUDY]`: 11/12 studied films fed approved output back as a reference, SÉKOU as the last approved frame plus the previous approved clip in 5 of 13 jobs; THREAD named every re-uploaded source by its in and out points). Seven columns follow `final_task_id` (if the copied `templates/shot-list.csv` lacks them, append them at the end of the header):

  | Column | Holds | Example |
  |---|---|---|
  | `parent_take` | the take this shot was built from: `<shot>_v<NN>_t<K>`, or `none` for a standalone shot | `S04-SH02_v02_t1` |
  | `link_type` | `none` · `EXT-F` · `EXT-B` · `LASTFRAME+CLIP` (the continuity pair) · `GRAB-START` · `GRAB-END` · `VIDREF` · `EDIT` · `INFILL` (05 T8) | `LASTFRAME+CLIP` |
  | `source_job_id` | the parent job: the Higgsfield job ID of the parent's approved final (the job itself, never a copy, until pilot test T-C approves trimmed tails, 05 §5.8); same name as in 05 T8 | `<job ID>` |
  | `source_in_s` · `source_out_s` | the part of the parent used as the video reference, in seconds of the parent file | `0` · `12` |
  | `grab_s` | for a frame grab or a continuity pair: the second the frame was taken from (`_LF.png` = the last frame, e.g. `11.958`) | `11.958` |
  | `role_sentence` | the role line used for the parent, verbatim (05 §5.2 vocabulary) | `"carry on its camera position …"` |

  The row holds the link of the take that reached FINAL-APPROVED. Every attempt stays in 05's append-only `chain_log.csv`, and the ledger row's `references` cell lists the same IDs. A parent that is not APPROVED, or a `source_job_id` with no ledger row, is a FLAG at the daily close. A chained pair (`link_type` ≠ `none`) also gets the frame-match check at its join (05 §5.8b step 5, SSIM) beside the cut-pair check (L.6 rule 7).

### L.5 Seedance share of the final film

Classes (write one per in-final row and in the Premiere `Description` column):

| Class | Meaning | Counts as Seedance picture |
|---|---|---|
| `SD` | Seedance pixels: draft→final, edit, extend; graded, cleaned, upscaled or retimed (00 §0.4) | yes |
| `SD+TXT` | Seedance plate with titles, subtitles or graphics over it (07 §7.5) | yes |
| `SD-COMP` | composite where the Seedance plate fills ≥ 50% of the frame for the whole clip and carries the subject `[HOUSE]` | yes |
| `SD-STILL` | a Seedance frame held as a freeze | **no** (conservative; shown separately) |
| `AI-OTHER` | any other generative picture (a held still from any image model: GPT Image, Nano Banana, Seedream, Soul; another video model) and ElevenLabs/Suno audio. BRIEF locks final picture to Seedance 2.5 only, so AI-OTHER picture needs the user's explicit yes in `decisions.md` | no |
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

**Budget in generated seconds (`SLA_BUDGET.csv`; PL-6).** The 12 studied films generated between 1 and 35 seconds of video per second of story `[STUDY; ARITH]`: lean SÉKOU ≈1–1.4, LEAK 3, TOKYO 4:17 3.5, Kimti 3.7; mid CONTROL ≈8, UNPROMPTED 8.5, Buzkashi 8.6, HUNGER 9.8; heavy THREAD 16.6, Fukushima 22, In Passing 28.4, The Breach ≈35. Their credits per second ran from about 0.17 to 9.0 across accounts and plans, so credits cannot be compared. We plan in **generated seconds** and turn them into credits at our measured prices (3 credits/s draft, 16 credits/s 1080p; L.3).
```text
T_s   = story seconds of the scene (04's edit_s summed; after lock, from the XML)
R     = draft seconds ÷ T_s        (plan: lean 3.5 · mid 8 · heavy 16; the playbook's bands)
H     = finalized seconds ÷ T_s    (single-use takes ≈ 1.3; mined long takes ≈ 2.2)
Draft credits = R × T_s × 3        Final credits = H × T_s × 16
Example, a 30 s scene at R = 8, H = 1.5: 720 + 720 = 1,440 credits
```
1. **Plan per scene.** Each scene gets `R_plan` and `H_plan` when its shots are listed: lean for inserts and atmosphere, mid by default, heavy for hero, dialogue, crowd, non-human and one-shot-chain scenes `[HOUSE]`. The budget is open (BRIEF), so the plan is a check-in point, never a cap on quality. After the pilot approval, the measured R and H of the pilot scenes replace the defaults for scenes of the same kind (L.8).
2. **Columns:** `scene_id, kind, T_s, R_plan, H_plan, draft_s, final_s, other_s, R_actual, H_actual, credits_plan, credits_spent, flag`. `other_s` = billed seconds that are neither a draft nor a finalize (a 1080p edit or extension). `credits_spent` comes from the ledger `cost` cells, checked against `transactions`.
3. **Rebuild at each daily close** from the ledger with the command below: successful video rows only; a final with no `duration` in `params` inherits its draft's seconds; a pickup counts in the scene its shot ID names. A FAILED job that `transactions` shows as charged goes into `credits_spent`, not into seconds.
4. **Flag** a scene when `draft_s` passes `R_plan × T_s` or `final_s` passes `H_plan × T_s`. Stop new batches for that scene and show T7: the user chooses more takes, a simpler shot (fix at the right layer, 05 §5.6) or a cut. Their words go to `decisions.md`.

```bash
python3 -I - ledger/SLA_LEDGER.csv <<'PY'
import csv, sys, collections
rows = list(csv.DictReader(open(sys.argv[1], newline='')))
P = lambda r: dict(kv.split('=', 1) for kv in r['params'].split(';') if '=' in kv)
dur = {r['task_id']: P(r).get('duration') for r in rows}            # a final inherits its draft's seconds
s = collections.defaultdict(lambda: [0.0, 0.0, 0.0])                 # scene -> draft_s, final_s, other_s
for r in rows:
    if r['kind'] != 'video' or r['outcome'] != 'OK':
        continue
    p = P(r)
    i = 1 if 'draft_job_id' in p else 0 if p.get('draft') == 'true' else 2
    s[r['shot_id'].split('-')[0]][i] += float(p.get('duration') or dur.get(r['draft_task_id']) or 0)
print('scene,draft_s,final_s,other_s')
for sc, v in sorted(s.items()):
    print(sc, *v, sep=',')
PY
```
`[TESTED on a synthetic ledger: drafts, a filtered job, a final without duration, an extension, an image row, a 1080p edit]`

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
   - `MIRROR_FLIP` (our code: a side-named mark on the wrong side, rule 8), `SCALE_SHRINK` (our code: a non-human smaller against its landmark than the bible says, rule 8);
   - plus screen direction, headcount and audio space.

   Log the result in T3 and in the shot row.
8. **Fixed words per character, prop and non-human** (PL-4 `[STUDY]`). 03 writes them into each bible entry at approval; 05 pastes them verbatim into every prompt where the subject appears; a change is a new version of the entry, never a re-wording in one prompt.
   - **`marks`:** 1–3 asymmetric marks, each with its side ("mole 1 cm below the LEFT corner of the mouth"), plus "do not mirror" in every sheet and every face-showing prompt. SÉKOU, Fukushima, CONTROL, Buzkashi and LEAK named the side (5/12); SÉKOU and Fukushima added "do not mirror". A mark on the wrong side is `MIRROR_FLIP`.
   - **`costume_phrase`:** one fixed wording per look (e.g. "faded grey work coverall, sleeves rolled twice"), used in role lines and 【Maintain Consistency】 (05). Kimti repeated one costume phrase in 11 video prompts. A new phrase = a new look in `looks`.
   - **`colour_role`:** the subject's place in 02's COLOR SCRIPT line, e.g. `PRP_RING`: "the only saturated green in R-DAY, and only while the assistant is active" (the reserved `#3BD16F`, 02); a character: "wears no saturated colour". SÉKOU's motif colour rule sat in 10 of its 13 prompts and was reversed on purpose in one scene; a reversal is written here with its scene.
   - **Per non-human** (robot or creature; HUNGER's scale method): `height_cm`; `landmark_<LEAD>` for each human it shares frames with (e.g. "its head reaches MIRAJ's lower ribs"); `doorway_fit` for every door or gap it passes in the script (fits · touches both sides and stops · turns sideways). HUNGER's scale sheet missed its own centimetre targets (about 70/105/135/200 cm made against 40/90/160/260–280 asked), so the sheet fixes order and rough ratios, and every shot restates scale in three units: centimetres, a landmark on the human, the architecture. A non-human that reads smaller than its landmark in a wide is `SCALE_SHRINK`.
   - **`value_bw`** (only if a sequence is B&W or near-monochrome, 02 §2.5): one of white, light grey, mid, dark, black for every character look, prop and location surface; two things that must separate on screen never share a value (Buzkashi designed its values in colour prompts: the bone-white chapan in 40 prompts, black clothing in 31).

   Where they live: `continuity-bible.md` §1 (characters, with `marks`, `costume_phrase`, `colour_role`, `value_bw`), §3 (props: `colour_role`, `value_bw`), §4 (locations: `value_bw` per main surface) and a non-human block in §1 with the scale keys. If the copied template lacks a key, add it to the entry; 03's YAML keys are the same names.

**Worked catches from draft v0** (PROVISIONAL until 01 locks; show them to the user, they decide):
| # | Draft beat | Continuity problem | Fix to offer |
|---|---|---|---|
| C1 | He removes the earpiece (magnet) and the Halo lens before sleeping; later he "opens his hand and sees his brother" | with the lens out, the call cannot be in-eye AR | the call is a **palm projection from the ring** (L.7.8), or he puts the lens back on screen first |
| C2 | Rayan gives him his ring and he wears it over his own | two rings on one finger from that shot on | lock hand and finger in 03 (`forbidden_variations: ring finger`); every later hand shot shows two rings, until a scripted removal |
| C3 | "The train passes in front of the camera" twice (morning, after the dream) | the motif must rhyme | same direction, lens height and speed both times; log both shots under one motif ID |
| C4 | The robot "has a fault in its leg" | the limp must persist | name the leg (left) and the phase of the gait cycle where it hitches (L.7.7); the same hitch every cycle in every later robot shot (04 keys it) |
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

- **Mass:** a 1.3 m metal service robot weighs about 40–70 kg `[HOUSE]`. Footfalls land hard. Feet never slide. Joints stop at their limits and never bend backwards. Servos whine under effort. Heavy bodies are slow to start and slow to stop; reaching or turning shows weight and inertia (HUNGER: "his body movement should show believable weight and inertia").
- **Gait cycle** (PL-5 `[STUDY]`: HUNGER wrote its walking creature as a cycle, then a forbidden list). Every step runs: one foot stays planted → weight shifts onto that leg → the other foot lifts clear of the floor → swings forward → heel or sole contacts the floor → weight transfers. The body rises and settles a little with each step, and each contact frame carries a footfall in 06. Count the contacts in QA (L.7.11).
  - **Forbidden:** gliding, floating, sliding, skating, moonwalking, root-motion slide (the body travels while the feet do not), turning in place without stepping, a foot that moves while it carries weight.
  - These rules are the source of the Gait sentence in 05's non-human block (05 §5.2), pasted in every shot where the robot walks; 04 keys the cycle in the blockout where a playblast drives the shot. A shot with a doorway or a tight gap adds the doorway sentence below to that block.
- **Contact and deformation** (the fist bump, 04's logged contact frame; any hand-object contact):
  - zero interpenetration: hands and objects really touch, nothing clips, nothing floats beside a hand;
  - both arms recoil, equal and opposite;
  - soft things deform where pressed (skin, cloth, a food box, a cushion); metal does not;
  - nothing regenerates, duplicates or changes shape after contact (object permanence, L.7.11);
  - the sound sits on the contact frame.
- **Doorways and tight gaps** (HUNGER carried a DOORWAY PHYSICS block in 11 prompts). The architecture never changes size to fit a body. A robot wider than a gap stops when both sides touch the frame; soft parts (padding, cloth) may compress slightly and the metal does not; then it turns sideways, ducks or backs out. No clipping, no wall penetration, no door or frame deformation. The bible's `doorway_fit` (L.6 rule 8) names which doors it passes cleanly. Prompt sentence: `The doorway keeps its normal size. {{NAME}} is too wide to pass straight: both sides of its body touch the frame and it stops; it turns sideways and steps through. Nothing passes through the wall and the frame does not bend.`
- **Scale lock** (L.6 rule 8): the robot keeps its `height_cm` and landmark in every framing; it does not shrink when the camera is farther away, when it sits, when it approaches or near a door; it never grows or morphs within a shot. Exactly the robots the count lock names (L.6 rule 6).
- **The faulty leg** is a physical constant: the same leg, the same hitch at the same phase of the cycle (for example, the left knee hitches at heel contact), the same cadence in every shot after the reveal. It shows in the cycle, never as a slide or a skip.

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

Story date and year · is the 2045 bus diesel or electric (02's sample mentions a diesel idle) · air-skate lift (fans or declared magnetic) · HUD lock mode · palm call mechanism (C1) · robot mass, height, gait and the phase of its hitch, doorway fit (L.7.7) · façade glass type · overcranked shots (list) · moon in night exteriors (yes/no).

#### L.7.10 DREAM exception register

One row per DREAM shot: `shot · the ONE exception · what still obeys physics · the visual cue that tells the audience it is a dream`.
Example (G-safe option from 00 §0.10):
`S01-SH06 · the pool water rises into the sky · people, hair, wet clothes, falling droplets and crowd reactions stay real · the HALO ring glint in frame (DREAM marker) and the light dimming as the water lifts.`
The 02 prompt line reads: `PHYSICS EXCEPTION: only the pool water rising into the sky breaks physics; everything else keeps real weight.`

#### L.7.11 Physics QA (each shot, at the draft and again on the 1080p final)

**Silent watch first** (PL-7 `[STUDY]`: Fukushima wrote "the shake must be clearly visible even with the sound off" into its quake prompts). Watch every take once at full speed with the sound muted, before reading frames and before 06 spots it: `ffplay -an -autoexit clip.mp4`, or Premiere with the audio tracks muted; when a take goes to the user for review, add the line «يُرجى مشاهدة اللقطة مرة بلا صوت أولاً». Shake, impacts, weight, contact and footfalls must read from the picture alone. A beat that only the sound sells (a hit with no recoil, a heavy step with no body settle, a quake with a steady frame) is a physics FAIL for the picture: the fix goes into the prompt or the take (mass in kg, the gait cycle, a REFRAIN line, 05 §5.2), never into a louder SFX. Log it in the T4 card as `silent: PASS/FAIL`.

Extract frames: `ffmpeg -i clip.mov -vf "fps=2,scale=1280:-1" qa/f_%03d.png` (1 fps for non-hero shots; research video-qa). Read them and check:
- Support: feet planted, no foot sliding, no floating props, contact shadows present.
- Gait (walking robots and creatures, L.7.7): count heel contacts against the cycle; one foot carries weight at every frame; no glide, slide or turn in place; the hitch on the named leg at its phase; scale against its landmark (`SCALE_SHRINK`).
- Timing: frame counts of falls, spray, steps and passing trains against L.7.2–L.7.6.
- Light:
  - one shadow direction, and a shadow-to-height ratio that matches the shot's sun row;
  - device light obeys L.7.8;
  - the reserved green only on its owner.
- States: wet, dust and sweat match L.6; headcount constant; no object appears or vanishes (object permanence).
- Mass: heavy things are slow to start and slow to stop; vehicles keep their direction and plausible speed; the motion-blur length matches the speed.

Grade each failure P0, P1 or P2 with 07 §7.3's definitions. Fix routes and their Seedance-share costs are in 07 §7.5. Re-check the final, because the 1080p final is a new generation whose detail can differ (BRIEF).

### L.8 The two-scene pilot: the ledger's part (decision 2026-11-02)

After the script and the style are locked and the two pilot scenes' assets are approved (03 G2-P), Claude produces those two scenes end to end with the final method: assets → blocking → Seedance drafts → 1080p finals → rough sound and grade (SKILL.md; 05 §5.11). This module runs in the pilot exactly as in production:
1. **Same records.** Every pilot job gets its ledger row, in the pilot scenes' own folders (`04_SCENES/Sxx_<slug>/…`, with per-shot folders and `UNUSED/`, L.0b), not in `99_TESTS`. `purpose` = `pilot`, or `pilot-test <ID>` for a take made for an open test, with the ID its owning module gives it (02: T-B, T-E · 03: T-I1…T-I4 · 04: T-G · 05: T-C, T-D, T-F · 05b: T-A1, T-A2 · 07: T-U). The shot rows carry `PILOT` in `flags` and fill the chain columns (L.4).
2. **Same checks.** Cut-pair, frame-match at chained joins, physics QA with the silent watch, the robot gait and doorway rules, and the bible fields (L.6 rule 8) all apply to pilot shots. Until the user approves a test's result, the current rule it would change stays in force outside that test.
3. **Measured budget.** `SLA_BUDGET.csv` shows the pilot scenes' `R_actual` and `H_actual` against the plan (T7). At the pilot approval, Claude proposes those ratios as `R_plan` / `H_plan` for the remaining scenes of the same kind, with a whole-film estimate in generated seconds and credits; the user's words go to `decisions.md`.
4. **Pin freeze.** At the pilot approval, `version-pins.md` gets a block "Production pins, frozen at pilot approval <date>": `seedance_2_5` and every setting used in the approved pilot finals, each image routing row with the model and settings that made the approved pilot assets (03 `RECIPES_v1.md`), the audio pins, the look version (02 §2.13) and the test results with the rule each one now sets. Approved pilot drafts become the canaries (L.3 rule 3). From then on, any change to a frozen pin is a major change (L.3 rule 1) and needs the user's yes plus a list of shots to redo.
5. **Name.** "Pilot" is an internal production test. The word never appears in the film, the credits or the submission (00 F8); the ledger `purpose` cell is internal evidence only.

---

## Output templates (what Claude shows the user)

**T1 — Daily ledger card** (Arabic frame, English data)
```text
سجلّ الإنتاج — 2nd Life: Ascent — 2026-11-09 (GST)
Rows today: 23 (05: 17 · 06: 4 · 03: 2) · FAILED/FILTERED: 3 · in-flight: 0
Completed jobs not yet downloaded: none · web-app jobs not yet in the ledger: none · drafts expiring < 48 h (7-day Higgsfield life): S05-SH03 (G05-0122) → finalise or drop?
Blank required cells: 0 · UNLEDGERED files in the edit: 0 · version pins: unchanged (checked 08:55 GST)
Generated today: drafts 96 s · finals 21 s · scenes over plan: none (T7) · chain FLAGS: 0 · per-shot folders missing: 0 · new elements: CHR_MIRAJ_base_v02 (v01 SUPERSEDED)
قراراتك: ____
```
**T2 — Seedance share card** (G3/G4): the script output, then:
```text
R1 picture 95.1% (target ≥ 90 ✓) · R2 picture 97.0% · audio per stem DX/MX/FX: SD 0/0/61% · AI-OTHER 100/100/22% · NONAI 0/0/17%
Non-Seedance list: S03-SH04 HUD 12.0 s (NONAI) · S09-SH02 freeze 8.0 s (SD-STILL) · FLAGS: 0
هل نعتمد هذه الأرقام لنموذج الإفصاح؟
```
**T3 — Cut-pair card:** `cut S03-SH02→S03-SH03 · A_last/B_first frames · codes found · severity · proposed fix · your decision ____`.
**T4 — Physics card per shot:**
```text
S03-SH02 · REAL · 15 Apr 2045 11:40 · lens 278° · sun az 147 el 72 rel +131 · shadow 0.32× · walk 1.35 m/s
train 85 m @ 12 m/s = 7.1 s full pass · contact f133 · devices: lens HUD off · DREAM exception: none
robot: 130 cm, head at MIRAJ's lower ribs · gait 3 contacts f84–f121, left-knee hitch at heel contact ✓ · no slide ✓ · silent: PASS · QA: PASS
```
**T7 — Budget card** (daily when a scene passes its plan, and at the pilot approval; Arabic frame, English data):
```text
الثواني المولَّدة — S03 (mid) — T_s 42 s
plan R 8 · H 1.5 → drafts 336 s · finals 63 s · ≈ 2,016 credits
spent: drafts 351 s (R 8.4) ✗ over plan · finals 49 s (H 1.2) · credits 1,837 (transactions ✓)
why: S03-SH05 robot doorway, 9 drafts (gait slid in 6)
الخيارات: (1) نسمح بـ 4 مسودات إضافية لهذه اللقطة ≈ 84 رصيد (2) نبسّط اللقطة (3) نحذفها من المونتاج
ما القرار؟
```
**T5 — AI disclosure draft** (Terms cl. 5.5(a), from the ledger only):
| Tool | Model / version | Route | Account | Used for | Share of film |
|---|---|---|---|---|---|
| Seedance 2.5 (ByteDance) | as labelled by Higgsfield: "Seedance 2.5" (`seedance_2_5`), accessed <date>; ByteDance model ID only if confirmed (L.3 rule 5) | Higgsfield (MCP and web app, one workspace and project) | <Higgsfield workspace / project> | all final picture, native SFX | picture 95.1% · FX audio 61% |
| ElevenLabs | eleven_v4 (dialogue), music_v2_5 | ElevenCreative (Enterprise contract, Enterprise Music tier) | <org> | dialogue, score cue M02 | DX 100% · MX 40% |
| … one row per tool, including support tools: every image model used in Higgsfield for references (from the ledger's `model_id` cells: e.g. GPT Image 2 and 2.5 Sunburst, Seedream 5.0 Pro, Nano Banana Pro and 2, Soul Cinematic, Soul Cast, Soul Location), any upscale or cleanup model from 07 §7.5 (e.g. Topaz), and Midjourney only if the user ran it. Image models: "share: 0 s on screen, used for references" unless a still reaches the cut (`AI-OTHER`); an upscaler: "applied to <N> s of Seedance picture, counted as SD" (L.5) | | | | | |

Then the non-AI elements with source and licence (fonts, procedural SFX code, the Summit intro), and every face and voice declared synthetic or real (cl. 5.5(c), (d)).
**T6 — Version change alert:** «تنبيه: تغيّر <model/route> منذ آخر تحقق (<old> → <new>). أوقفت توليد <job class>. أقترح تشغيل لقطة الاختبار canary بدقة 480p ومقارنتها قبل المتابعة. هل نمضي بذلك؟»

## Gate

- **G-L0 (D1):** naming table (element names included), film code, the folder tree with `UNUSED/` and the per-shot rule, story date and clock, version pins for every routed image model and world decisions (robot gait, height, doorway fit) approved. Ask: «هل نعتمد قواعد التسمية وشجرة المجلدات وتاريخ القصة وقرارات العالم كما في الجدول؟»
- **G-L0b (with 04's shot list, before the first pilot draft):** the per-shot folders exist for the scenes about to be drafted, and `R_plan` / `H_plan` per scene are approved with a whole-film estimate in generated seconds and credits (L.5). Ask: «هل نعتمد خطة الثواني المولَّدة لكل مشهد كما في الجدول؟»
- **G-L1 (each shot, before final-from-draft and again on the final):**
  - the ledger row is complete with no blanks; the shot's per-shot folder exists and rejected finals sit in `UNUSED/`;
  - the chain columns are filled for a linked shot, and its parent is APPROVED (L.4);
  - cut-pair (with `MIRROR_FLIP` and `SCALE_SHRINK`) and physics QA, silent watch and gait included, are PASS or WAIVED in the user's words;
  - DREAM exceptions are registered;
  - the scene is inside its budget plan, or the user's T7 decision is in `decisions.md`.
- **G-L-P (inside the pilot gate, with 05's G5-PILOT):**
  - every pilot shot passed G-L1, and every pilot-test take is logged with its `pilot-test <ID>` purpose;
  - `R_actual` / `H_actual` of the two scenes shown on T7 and the production `R_plan` / `H_plan` approved;
  - the production pins frozen in `version-pins.md` (L.8 step 4).
  Ask: «هل نعتمد نسب الثواني المولَّدة وتثبيت النماذج والإعدادات كما استُخدمت في مشهدَي التجربة، لنبني عليها الفيلم كله؟»
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
| A Seedance final is lost | the original was not downloaded when the job completed, or the Higgsfield project was the only copy | download and hash in the same turn (L.2); keep `inflight.md`; Drive holds RAW_SEEDANCE (L.0b) |
| A draft can't be finalised | the Higgsfield draft passed 7 days (house rule: finalise before day 5) | the T1 card warns at 48 h; finalise with `draft_job_id` or drop |
| The share is low at lock | UNLEDGERED clips counted as non-Seedance; HUD over black | ledger every file; put graphics over Seedance plates (`SD+TXT`) |
| Double billing | a timed-out `generate_video` call was repeated | `jobs_wait` on the returned job ID; with no ID, look in `show_generations` (`only_completed: false`) or the scene folder before anything else; never resubmit |
| A hand-made web-app job is missing from the ledger | the user generated in the Higgsfield web app | daily `list_project_assets` sweep per folder, then `get_project_asset_prompt` → new row (L.2) |
| The disclosure says "Seedance" with no version | a third-party route label was logged without a date | follow L.3 rule 5; ask the route; add the question to the Organizer email |
| A model drifted mid-film | a provider update or route switch | daily pin diff, canary, major version bump |
| The prop resets between cuts | its state machine was not consulted | L.6 rule 1; cut-pair check |
| Sun direction flips on a reverse | the variant rule was applied without per-shot physics | run `sun_position.py --cam` per shot; 04 asks: keep or cheat |
| Short noon shadows on an October date | the story date conflicts with R-DAY | move the date (Apr–Aug) or soften R-DAY; the user decides |
| The hero object falls in slow motion while people move in real time | the model slowed one object | count frames against L.7.2; re-prompt with mass in kg |
| A hologram has black areas or occludes the background | the emissive rules were ignored | L.7.8 rules 1–2 in the device bible and prompt |
| The palm call is shown with the lens out | a device-state continuity break (C1) | ring projection, or show the lens going in |
| The glass "crawls" or explodes like sugar glass in REAL | wrong glass type or speed | L.7.4 table; DREAM register for exceptions |
| A good take is lost in a pile of rejects, or a reject was deleted | selection kept in likes or memory; no picks folder | `finals/` and `approved/` = picks only; everything else in `UNUSED/`, never deleted (L.0b) |
| Names shift after a scene or shot is added | renumbering | a letter suffix (`S06A`, `S06-SH03A`); never renumber (L.0b) |
| Nobody can tell which image a take used | an element's image was swapped without a rename (HUNGER) | a new image = `…_v02` and a new element; the old one SUPERSEDED (L.1) |
| An element or asset name shows up as a sign in the picture | a descriptive word in the name (TOKYO 4:17) | neutral codes only; rename and re-create the element (L.1) |
| A continuing shot cannot be traced to its source at the edit | the link was not logged | chain columns in `SLA_SHOTS.csv` + 05's `chain_log.csv` (L.4) |
| A mark jumps to the other cheek | the model mirrored the face | side-named `marks` + "do not mirror" in sheet and prompt; `MIRROR_FLIP` in the cut-pair check (L.6 rule 8) |
| The costume drifts between shots | the wardrobe was re-worded per prompt | one fixed `costume_phrase` per look, pasted verbatim (L.6 rule 8) |
| The robot glides, slides, skates or turns in place | no gait cycle in the prompt | the cycle and forbidden list (L.7.7) in 05's non-human block; gait check in L.7.11 |
| The robot shrinks in a wide or melts through a doorway | no scale lock; no doorway rule | cm + landmark + architecture each shot; doorway sentence (L.7.7) |
| A hit or a quake only works with the sound up | weight carried by SFX, not picture | silent watch first; fix in the prompt or take, not the mix (L.7.11) |
| Credits run out before the last scenes | no per-scene plan; credits compared across accounts | plan in generated seconds per scene, flag at `R_plan` (L.5); pilot ratios for the rest (L.8) |
| Production drifts from the approved pilot | a pin, setting or recipe changed after the freeze | the frozen production pins (L.8); a change = major change with the user's yes |

## Sources and licences

- **calesthio/generative-media-skills** (MIT; HEAD 8c85352, 2026-07-14): `asset-continuity-management`, `media-provenance-rights`, `generated-media-qa`. Short quotes, credited above; the manifest, ledger and continuity-bible shapes are adapted.
- **OSideMedia/higgsfield-ai-prompt-skill** (MIT; HEAD 6a6a5dd, 2026-10-24): `higgsfield-seedance` SKILL and FAILURE-MODES, `higgsfield-acting` ("degradation accumulates"). Quoted on mass in real units, causal props and the walking counter; the headcount lock is paraphrased. Nothing is taken from AGPL sources (OpenMontage).
- **Method learned from public Higgsfield projects** (2026-11-02 studies, `prompt-library/studies/2026-11-02_*.md`, merged in `2026-11-02_CROSS-STUDY.md` §3C and §4.7). Method only: no character, design, story or shot of these films is copied; short quotes are credited where used.
  - CONTROL by `@pietromalegori`: `UNUSED/` at every level and letter suffixes for an inserted scene (PL-1); versioned `char_` / `loc_` / `prop_` element names (PL-3).
  - Buzkashi by `@sqr_studio`: the folder tree as the shot list, empty folders for planned shots (PL-1); versioned element names (PL-3); value words designed in colour prompts (PL-4).
  - In Passing by `@julianmarshall`: `Pickups 1…8` made after the assembly (PL-1).
  - HUNGER by `@sssacccade`: `_SCENES` as the picks bin (PL-1); the element swap without a rename, as the warning (PL-3); scale in centimetres, landmark and architecture (PL-4); the gait cycle, forbidden list, contact and DOORWAY PHYSICS wording (PL-5).
  - Fukushima by `@aist`: versioned element names (PL-3); side-named marks with "do not mirror" (PL-4); "the shake must be clearly visible even with the sound off" (PL-7).
  - SÉKOU by `@mauriziocibelli`: the last approved frame plus the previous approved clip as a continuity pair (PL-2); side-named marks with "do not mirror" and the colour-script rule (PL-4); the lean end of the generated:story range (PL-6).
  - THREAD by `@pandaproduction`: sources named by in and out points, the extension chain (PL-2); 16.6:1 generated:story (PL-6).
  - Kimti by `@ameerahmed`: one fixed costume phrase in 11 video prompts (PL-4).
  - TOKYO 4:17 by `@nicholastakeyama`: an element name painted onto a street sign (PL-3).
  - LEAK by `@creativemanifesto`: frame grabs as start and end frames of one take (PL-2); side-named marks (PL-4).
  - The Breach by `@sileent` and UNPROMPTED by `@shestak`: extension chains and frame grabs (PL-2); the heavy and mid points of the generated:story range (PL-6).
  - All 12: the generated:story ratios and the warning that credits cannot be compared across accounts (PL-6, §3C.6); the image model each film used best for each job (03 §3.0.1).
- **contentauth/c2patool** and **c2pa-rs** (MIT/Apache-2.0): `--info` and `-d` usage; supported formats.
- The user's own skills **cinematic-pipeline** (failure codes, physics and continuity prefix lines) and **seedance-director** (off-screen and exit-frame rules): carried over.
- Facts, not quoted:
  - NOAA solar-calculator equations (Meeus), implemented in our own code;
  - Weidmann 1993 parameters via arXiv 0901.0170;
  - Higgsfield MCP tool descriptions and `models_explore` get for `seedance_2_5`, `gpt_image_2_5`, `nano_banana_pro`, `nano_banana_2_1`, plus `get_cost` probes (read 2026-11-01): modes, durations, media roles, 7-day draft finalisation, credit rates, reference-element model list; the 2026-11-02 routing-table ids as verified in 03 §3.0.1 (`gpt_image_2`, `nano_banana_2`, `seedream_v5_pro`, `soul_cinematic`, `cinematic_studio_soul_cast`, `cinematic_studio_soul_location`, `3d_jutsu_angles`, `upscale_image`, `topaz_image`); `copy_project_asset` and `move_project_asset` for the picks and `UNUSED/` folders (descriptions read 2026-11-02: a move does not duplicate the placement; a copy makes a new placement and is not idempotent, so an uncertain copy is checked, never repeated);
  - the OpenAI model page (`gpt-image-2.5-sunburst-2026-09-08`);
  - Adobe Help (Project panel List View columns);
  - Dubai Metro facts (Wikipedia, railway-technology, Alstom, Gulf News).
