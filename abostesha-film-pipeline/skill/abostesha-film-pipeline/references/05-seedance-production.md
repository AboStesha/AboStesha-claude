# 05 — Seedance Production: Draft, Approve, 1080p Final (Step 5)

**Purpose.** Turn every approved shot into final picture with Seedance 2.5 alone, generated in the film's Higgsfield project. Each shot gets one prompt built to ByteDance's official contract, its Blender playblast as the motion reference, the 03 sheets as identity references, the locked 02 style prefix, SFX-only sound and, on dialogue shots, lips bound to the user's ElevenLabs take.
**Method.** Make a 480p draft first (`draft: true`); the user approves one take; then finalize that same take at 1080p with its Higgsfield job ID (`draft_job_id`). Download every output the moment it exists, log it in the ledger, QC it, and iterate one variable at a time.
**Rule.** Talk to AboStesha in Arabic. Every prompt, file name, ledger cell (except their verbatim approval words) and QC note is in English. This module owns the assembled prompt, handle spelling, the `generate_video` parameters, music and subtitle suppression wording, and the draft and final runs. `05b-acting-direction.md` owns the PERFORMANCE and DIALOGUE blocks inside the prompt.

Tags: `[OFFICIAL]` ByteDance/BytePlus Seedance 2.5 docs (model and prompt facts), read as Markdown on 2026-10-30 · `[HF]` Higgsfield MCP tool descriptions and `models_explore get seedance_2_5`, read 2026-11-01 · `[FIELD]` a practitioner skill's tested rule · `[HOUSE]` our default · `[UNVERIFIED]` confirm on the first live job · `[TESTED]` measured on the user's Higgsfield account with `get_cost` (no generation).

---

## Inputs

| Input | From | Used in |
|---|---|---|
| Blocking table, `_PB_` playblast (24 fps, exactly G s, silent), stills, `_DLG_` track, hand-off sheet with the blockout clause | `04-blender-blocking.md` T1, T3, §4.9 | 5.1, 5.2 |
| Character, location and prop sheets with their Higgsfield job IDs (or `media_id`s, `element_id`s); the D1 route result (T1); role lines | `03-assets-images.md` §3.1, §3.3, §3.4 | 5.1, 5.2 |
| `prefix/seedance.txt` + variant ID per shot; reserved green `#3BD16F` rule | `02-style-prefix.md` §2.7 D, §2.11 | 5.2 |
| Beat map; PERFORMANCE and DIALOGUE snippets A–G; bible voice lock | `05b-acting-direction.md` | 5.2, 5.3 |
| Line IDs, MODE (`ON`, `ON-WIDE`, `OFF`, `VO`, `PHONE`), SPOKEN text, language, voice descriptor, selected takes | `01-script-and-dialogue.md` §1.2 | 5.3 |
| Story date and time, sun, IN/OUT states, physics rules, DREAM exception register | `ledger-continuity-physics.md` L.6, L.7 | 5.2, 5.5 |
| Calendar (drafts D7–D13, all finals in by D14), share targets, D1 tests T1–T6 | `00-award-brief-and-calendar.md` §0.4, §0.7, §0.8 | 5.0, 5.10 |
| The Higgsfield connector showing `generate_video`; the film's Higgsfield workspace, project and scene folders (ledger L.0b); credits for the quoted batch; the Google Drive tree with `08_EVIDENCE/RAW_SEEDANCE/` | the user (Claude builds the folders after their yes) | 5.0 |

## Hard rules

1. **Seedance 2.5 only** for final picture: Higgsfield model `seedance_2_5` (label "Seedance 2.5", provider Bytedance, as `models_explore` shows it), pinned in `version-pins.md` (ledger L.3). Never mix in Seedance 2.0 shots (`seedance_2_0`) without the user's yes. The official FAQ warns that 2.0 and 2.5 have visibly different aesthetics `[OFFICIAL]`.
2. **Draft first, always.** A final exists only as a `draft: true` 480p job → 1080p finalized from that job with `draft_job_id`, from a draft the user approved in their own words. Never re-run an approved prompt at 1080p: that is a new take, not the approved one `[FIELD: scenario-labs]`.
3. **One job per generation.** Each generation has one primary task (reference generation, edit or extension), one shot with one camera and no internal cuts, and one speaking face. 04 already gives every shot its own camera. Multi-shot generations land planned cuts poorly: in one community benchmark only about 73% of 16 cut boundaries fell within ±0.6 s (04 research).
4. **No parameters in prose.** Aspect ratio, duration, resolution, fps and the sound switch go in the `generate_video` params only (`aspect_ratio`, `duration`, `resolution`, `generate_audio`) `[OFFICIAL: sd25-pe]`. Before every submit Claude checks the prompt for `16:9`, `1080p`, `fps` and similar words.
5. **Never resubmit a job whose outcome is unknown.** On a transport timeout the submission may have gone through: find the job (`list_project_assets` in the scene folder, newest first) and wait on it with `jobs_wait`. A second submit bills a second video `[HF: generate_video]`.
6. **Download, hash and log in the same turn** a job completes. The byte-identical original goes to the scene's `drafts/` or `finals/` folder on Drive and, for finals, to `08_EVIDENCE/RAW_SEEDANCE/` (ledger L.0b). Higgsfield is never the only copy: its API keeps request files only 7 days, and result-URL lifetimes are unpublished. Ledger rule 4.
7. **No music from Seedance.** It makes SFX and ambience, plus speech only where a lip-sync shot needs it. Score comes from `06-music-and-sfx.md`.
8. **Never evade moderation.** No cropping, blurring or restyling a face to slip past the filter, and no wording tricks. Change the route or the content (5.9; 03 §3.3 rule 1).
9. **Provenance untouched.** Keep the original files as downloaded from Higgsfield, never remux them, and never crop a watermark (Terms cl. 5.6). `seedance_2_5` on Higgsfield has no `watermark` parameter: record in T4 what the original carries (visible mark, C2PA, metadata) and disclose it.
10. **Finals only in the film's Higgsfield project**, through the MCP or by the user in the Higgsfield web app inside the same project and account. Keep one account and one route per character for the whole film; a draft is finalized in the account that made it.
11. **Holdback.** References go in privately: uploads through `media_upload` → PUT → `media_confirm`, or Higgsfield job IDs. Never a public link, an "anyone with the link" share, or a published Higgsfield project before the holdback ends.
12. **One variable per iteration**, logged (5.6). A defect copied from the playblast is fixed in Blender (04), not in the prompt.
13. **G-rated content.** Re-check every beat 01 flagged before spending. A moderation block on violence, substance or IP words is a content signal (5.9).

---

## Procedure

### 5.0 Route, project and verified facts (session start)

**Route (decision 2026-11-01, locked; recorded in `decisions.md`): every Seedance generation runs in Higgsfield.**

| Surface | Who runs it | Draft → final from the same take | How it is logged |
|---|---|---|---|
| **Higgsfield MCP** `generate_video`, model `seedance_2_5` | Claude, in chat, after the user's yes on the packet | yes: `draft: true` gives a 480p draft; finalize it at 1080p with `draft_job_id` within **7 days** `[HF]` | job ID from the tool result, straight into the ledger |
| **Higgsfield web app** (Seedance 2.5, Draft Mode), inside the same project and scene folder | the user, by hand | yes, same 7-day window | Claude reads the job back with `list_project_assets` → `get_project_asset_prompt` → `get_project_asset_source` (5.4) and writes the row |

Both surfaces count toward the 70% (cl. 5.4 allows third-party platforms when generation runs through Seedance; disclose platform, Seedance 2.5 and account per cl. 5.5(a)). The BytePlus ModelArk API route (with `scripts/seedance_byteplus.py`) exists but is not used (decision 2026-11-01); its documents remain the source of the model and prompt facts tagged `[OFFICIAL]`.

**Proof of Seedance use (verified 2026-11-01).** The Summit checks the 70% through: the form's AI disclosure (platform + Seedance version + account + share); a mandatory upload of the **original, unedited Seedance files** (MP4/MOV) right after submitting, where the page sums their durations against 70% of the film length, the server can reject a clip, and nothing can be added or removed after Finish; process evidence on request within 7 days (cl. 5.5(b), including proof that third-party-platform content went through Seedance); AI-detection checks (cl. 5.7); and master/project files before any prize (cl. 11.4). So: download every take the moment it finishes, keep it byte-identical, and log it. BytePlus names Higgsfield as a Seedance 2.5 platform. Higgsfield's API keeps request files only 7 days, so also save each take's Higgsfield job record in `08_EVIDENCE/` (model label, date, job ID, folder, and the prompt as read back with `get_project_asset_prompt`). The official C2PA guide (2026-10-30) lists only the Seedance 2.0 family as credentialed; what a Higgsfield `seedance_2_5` original carries is unknown, so test it with `c2patool` on D1 (T4).

**Verified Higgsfield facts** (`models_explore get seedance_2_5` and the tool descriptions, read 2026-11-01 `[HF]`; costs `[TESTED]`):

| Item | Value |
|---|---|
| Tools | `generate_video` with `params.model: "seedance_2_5"` for one request (`count` 1–4 = variants of the same prompt, inputs and settings); `generate_video_batch` for 1–12 independent requests (each `count: 1`; no `get_cost` inside a batch) |
| Modes (`mode`) | `t2v` (prompt only; the default) · `omni_reference` (image, video or audio references) · `video_edit` (edits one reference video; `duration` and `aspect_ratio` are ignored; billed by that video's duration) · `video_extension` (extends a reference video; `aspect_ratio` is ignored; `extension_mode` `forward` or `backward` is required here and not allowed in other modes) |
| Settings | `duration` 4–30 whole seconds (default 5; an unsupported value is clamped and reported in `adjustments`) · `resolution` `480p` / `720p` / `1080p` (default 720p) · `aspect_ratio` `auto`, `21:9`, `16:9`, `4:3`, `1:1`, `3:4`, `9:16` · `generate_audio` (default `true`) · `bitrate_mode` `standard` / `high` |
| Draft and final | `draft: true` → a 480p draft that can be finalized within **seven days**; `draft_job_id` = the completed draft to finalize at 1080p |
| Media | `medias: [{value, role}]`. `value` is a `media_id` (`media_upload` → curl PUT → `media_confirm`) or the job ID of an earlier Higgsfield generation, never an https URL. Roles: `start_image`, `end_image`, `image_references`, `video_references`, `audio_references`. Reference elements go in the prompt as `<<<element_id>>>`, never in `medias` (03 §3.3) |
| Destination | `folder_id` = the scene folder made with `create_folder` (ledger L.0b); reuse it on every job of that scene |
| Cost | `get_cost: true` returns the credit cost and submits nothing. Measured on the user's account: draft **3 credits/s**, 720p 7 credits/s, 1080p (fresh or finalized from a draft) **16 credits/s**; image, video and audio references and `bitrate_mode: "high"` do not change the price `[TESTED]`. Credit price on the user's account $0.0446 (4,000-credit pack) to $0.05 (auto-refill): draft ≈ $0.13/s, 1080p ≈ $0.71–0.80/s. Leave `use_unlim` unset; if the tool returns `unlim_choice`, ask the user which balance pays |
| Waiting and showing | `jobs_wait` (1–12 job IDs, `timeout_seconds` ≤ 15; call again after `poll_after_seconds` until `all_terminal`), then one `show_generation_by_ids` for a set of jobs, or `job_display` for one |
| Not exposed on Higgsfield | `watermark`, `seed`, `output_format`, `return_last_frame`, `priority`, frame rate. Rate limits and concurrency are unpublished (T6 measures them) |
| Model limits (ByteDance's official API reference; Higgsfield publishes none, so stay inside them) `[OFFICIAL]` | 30 images (< 30 MB, 300–6000 px, aspect 0.4–2.5) · 10 videos (mp4/mov H.264/H.265, 2–30 s each, 30 s total, ≤ 200 MB, 24–60 fps, 407,696–8,295,044 px) · 10 audio (wav/mp3, 2–30 s each, 30 s total, ≤ 15 MB) · prompt ≤ 1,000 English words recommended |
| Model output (official API; confirm on the Higgsfield file with ffprobe, T6 and 05-T7) | 24 fps; 1080p as 10-bit H.265; audio mono; output duration = floor(frames ÷ 24) |

Typical shot, G = 7 s: one draft **21 credits** (≈ $0.94–1.05), its final **112 credits** (≈ $5.00–5.60), whatever references it carries.

**Project checklist** (D0–D1; Claude runs the MCP steps after the user's yes and walks AboStesha through anything in the web app, in Arabic):
1. The Higgsfield connector shows `generate_video`, not only game-publishing tools. Otherwise the user reconnects it in claude.ai settings.
2. `list_workspaces`: confirm the selected workspace with the user. Create the film project once with `create_project` (after their yes) and the L.0b folders with `create_folder`. Write the workspace ID, project ID and every scene folder ID into `PROJECT.md` (Routes, Paths).
3. `balance` before each production day; the user tops up or sets auto-refill. At the daily close, reconcile credit movements with `transactions`.
4. Run the L.3 pin check daily: `models_explore get seedance_2_5`, diffed against `version-pins.md` (parameters, options, media roles). On any change, stop and re-run the canary.

**05's day-1 tests** (they extend 00 §0.8; every job goes to `99_TESTS`; report them in one table before production spend):

| Test | Method | Pass |
|---|---|---|
| T2 Lip-sync (00) | one English and one Arabic ON line through 5.3, method A; measure the offset (5.5 Q14) | ≤ 1 frame lead, ≤ 2 frames lag; words identical |
| T3 Draft → final (00) | one draft, its final (`draft_job_id`, `resolution: "1080p"`, `bitrate_mode: "high"`), a 3-up comparison (5.7); record exactly which params the final call needed | identity, action and timing unchanged |
| T4 Provenance (00) | `c2patool` and verify.contentauthenticity.org on a raw final as downloaded from Higgsfield. The official C2PA guide (2026-10-30) lists only the Seedance 2.0 family as credentialed, not 2.5 | record what the file carries |
| 05-T7 Higgsfield original in Premiere | ffprobe one 1080p final made with `bitrate_mode: "high"` (codec, pix_fmt, bit depth, fps, bitrate, audio channels) and import it into Premiere; compare colour with the draft | the codec baseline for Q20 is recorded; if Premiere mishandles the file, the edit uses a logged ProRes derivative and the original stays untouched |
| 05-T8 `generate_audio` on a lip-sync shot | the same ON line drafted with `true` and with `false` | keep whichever syncs; default `true` |
| 05-T9 Draft on an edit task | one audio-only edit (`mode: video_edit`) drafted with `draft: true`, then finalized | if refused, edits run direct at `resolution: "1080p"` with the user's yes |
| 05-T10 Web-app round trip | the user makes one draft by hand in the Higgsfield web app inside `99_TESTS`; Claude reads it back (`list_project_assets` → `get_project_asset_prompt` → `get_project_asset_source`) and finalizes it through the MCP with `draft_job_id` | prompt and settings read back verbatim and the source downloads. If the MCP cannot finalize a web-app draft, web-app drafts are finalized in the web app and logged the same way |
| 05-T11 Mixed roles and handle order | after T1, one two-character `omni_reference` draft on the face route T1 proved, with `start_image` plus `video_references` and two `image_references`; log any `adjustments` and the mode the job reports | the job is accepted, and each face lands where its `@ImageN` handle says (order of `image_references` = handle number). If `start_image` cannot combine with references, opening-state shots use 5.1's reference-mode wording |

### 5.1 Build the shot packet

**Entry: AboStesha asks for one shot's prompt** («سوي لي برومبت سيدانس للمشهد 4 لقطة 2»).
1. **Resolve the ID.** «المشهد 4 لقطة 2» means scene `S04`, shot `SH02`, so `S04-SH02` (the frozen scene IDs from 01 §1.1.3, zero-padded). Confirm the row in `ledger/SLA_SHOTS.csv` or 04's shot list. If it is missing, or S04 was renumbered, show the S04 rows and ask which shot they mean.
2. **Check the inputs** in the table above and show them as a ✓/✗ list in Arabic: 04 hand-off row and `_PB_` (or the STILL/TEXT triage), 03 approved references and the T1 route, `prefix/seedance.txt` and the shot's variant, 05b's approved bible (G5b-A) and the S04 scene read (G5b-B) with the beat map, and for dialogue the 01 line IDs, the selected takes and the T2 result.
3. **All present:** build the packet (below), write the prompt (5.2, plus 5.3 for dialogue) and show the T1 packet card. Ask the G5-P question. Nothing is submitted and nothing is billed before their yes.
4. **Something missing:** say what is missing and which earlier gate owns it (SKILL.md §3, jumping ahead). If they still want to see the prompt now, write it as a **PREVIEW**: every missing input stays a visible slot such as `{{MISSING: 02 prefix/seedance.txt R-DAY}}` or `{{MISSING: 05b PERFORMANCE block, S04 scene read not approved}}`. Never fill a slot from memory or invention: not the 02 look text, the 04 blockout clause, 05b blocks, asset handles or line text. A PREVIEW is saved as `prompt_v00_PREVIEW.txt`, it is never submitted (not even with `get_cost`), it gets no ledger row, and it is never pasted into the Higgsfield web app.
5. The 05b blocks (PERFORMANCE / DIALOGUE) come from 05b §5b.3 and its snippets A–G; 05 only places them in the slot.

**Folder** (mirrors 04; git tracks `.txt`, `.md`, `.csv`; binaries are git-ignored, generated in the Higgsfield scene folder and kept in the Drive tree, ledger L.0b):
```text
films/01-second-life-ascent/05-seedance/S03/S03-SH02/
  prompt_v03.txt            (the exact submitted text; its sha256 goes in the ledger)
  refs_v03.md               (each @handle → file, asset ID, Higgsfield job ID / media_id / element_id, role, what it supplies, what it must not supply)
  qc_v03_t2.md              (5.5 checklist, Claude's notes, the user's verdict)
Drive 04_SCENES/S03_<slug>/drafts/  SLA_S03-SH02_SD25-DRF_v03_t1.mp4 … _t2.mp4   (480p, never imported into Premiere)
Drive 04_SCENES/S03_<slug>/finals/  SLA_S03-SH02_SD25-FIN_v03_t2.mp4 + _LF.png   (1080p final, byte-identical copy also in 08_EVIDENCE/RAW_SEEDANCE/; last frame extracted with ffmpeg, 5.7)
```

**Pick the generation mode per shot** (from 04's triage):

| 04 mode / need | Seedance request (`generate_video`, `model: seedance_2_5`) | Constraints `[HF]` |
|---|---|---|
| BLOCK (playblast) | `mode: omni_reference`: `@Video1` = `_PB_` (role `video_references`), identity and location images (`image_references`), optional `@Audio` lines (`audio_references`) | `aspect_ratio: "16:9"`; `duration` = G (whole seconds, 4–30) |
| STILL (layout still) | `mode: omni_reference` with images (+ audio); camera and drift written in the prompt | same |
| Shot must open on an exact state (continuous action) | **reference wording:** the previous final's `_LF.png` (uploaded) as `@Image1` with role `image_references`, plus the sentence `Use @Image1 as the first frame.` Or the same frame with role **`start_image`**; whether `start_image` combines with the playblast and other references in one job is 05-T11 | the frame is already 16:9, so `aspect_ratio: "16:9"`. With references only, frame one follows the reference world unless an image anchors it `[FIELD: scenario-labs]`. A frame showing a face goes in only on a route T1 proved for faces (03 §3.4) |
| Fix inside an existing final | `mode: video_edit` (5.8) | `duration` and `aspect_ratio` ignored; billed by the source's duration; source 4–30 s |
| Need more head or tail | `mode: video_extension` (5.8) | `extension_mode` `forward` or `backward` required; `aspect_ratio` ignored |
| TEXT (HUD, inserts) | none: post graphics (04 §4.1, 07) | counts as non-Seedance (00 §0.4) |

**Reference set rules:**
- **Order by first appearance.** List character images in `medias` in the order the characters first appear and number the handles to match. This is the official fix for swapped identities and voices `[OFFICIAL FAQ]`. That the order of `image_references` sets the `@ImageN` number on Higgsfield is checked on D1 (05-T11).
- **Hold the working range.** Use 1–8 subject images and 1–5 audio or video subjects of about 5–10 s each `[OFFICIAL]`. The 50-asset cap is a ceiling, not a target.
- **One subject per asset.** Identity comes from 03's `turn3` (face on one panel only) or the route T1 proved (a reference element, or a first frame generated inside Higgsfield). Locations come from face-free plates; props from their sheets. Wardrobe states are separate assets (03), never prose.
- **Never upload an unassigned asset.** If one is attached anyway, list it under `【Unused Assets】` (sd25-pe).
- **Faces.** Only the route that passed T1 on Higgsfield `seedance_2_5` is allowed (03 §3.3–3.4): the approved sheet by its job ID as `image_references` or `start_image`; or, if faces are refused, a completed reference element (`<<<element_id>>>` in the prompt) or a first frame generated inside Higgsfield from the approved sheets and approved by the user, passed as `start_image` by its job ID.

**Reference hygiene:**
- **Images.** Approved sheets made in Higgsfield go in untouched by their job IDs. Larger AI images can cause fingerprint-like textures in foliage and grass `[OFFICIAL FAQ: ≤ 1920 px on the long edge]`: if Q18 shows them, the next version's one variable is an uploaded ≤ 1920 px copy, logged as a derivative. Before uploading any JPEG, check its chroma subsampling with ffprobe and convert non-standard files with `ffmpeg -i in.jpg -pix_fmt yuvj420p out.jpg` (they fail with HTTP 400 on the official API `[OFFICIAL FAQ]`; Higgsfield's behaviour is unknown).
- **Playblast.** Use only an APPROVED `_PB_` that passed 04's ffprobe check: h264, 1920×1080, 24/1, exactly 24·G frames, no audio stream. A video reference does not change the Higgsfield price `[TESTED]`.
- **Uploads.** Every file made outside Higgsfield (playblast, audio, an extracted last frame) goes in through `media_upload` → curl PUT to `upload_url` (HTTP 200) → `media_confirm` with its `type`; only if the file cannot be read in the sandbox, `media_upload_widget`. Record each `media_id` in `refs_vNN.md` and the ledger. Never re-upload a Higgsfield output: pass its job ID, so the link to the original job is kept.
- **Audio** for dialogue shots: see 5.3.

### 5.2 Write the prompt

Build every prompt in this order. Fill the slots; delete unused sections; never edit the text of 02's blocks or 04's clause.

```text
Audio policy: the soundtrack holds only the diegetic sounds named at the end[, plus {{NAME}}'s speech from @Audio1]. No music, background music, BGM, score, instrumental, melody, synth effects, ambient pad, drone, stinger or rising tone at any moment. No subtitles.

【Generation Goal】
Generate one continuous {{shot size}} shot: {{subject}} {{principal event}} in {{place}}.

【Reference Asset Roles】
@Image1 is {{CHARACTER A}}: use only face, hair, build and {{costume}}; do not use the grey background or the panel layout.
@Image2 is {{LOCATION}}: use only architecture, materials and light direction; do not use any people in it.
{{04 hand-off blockout clause, verbatim, for @Video1}}
{{5.3 binding sentence for @Audio1, dialogue shots only}}

【Subjects and Relationships】
{{COUNT LOCK: exactly N people, no extra figures, no doubles in glass or reflections}}. {{positions relative to fixed objects}}. {{SCREEN DIRECTION LOCK}}.

【Event Script】
0-{{t1}} seconds: {{starting state}}; {{one action}}; at the end, {{visible state}}.
{{t1}}-{{t2}} seconds: from {{state}}, {{one action}} ... (ranges continuous, non-overlapping, ending at G)
{{05b PERFORMANCE block / DIALOGUE block}}

{{CAMERA sentence: size + angle + move + subject + start → end + "about a NN-degree field of view" + variant camera behaviour (02)}}

The visuals feature {{02 core + variant, verbatim}}.
{{02 CONTINUITY line, verbatim}}

【Maintain Consistency】
Keep {{identities and wardrobe states, prop count and ownership, screen direction, light direction}} stable{{; STILLNESS LOCK: what never happens}}.

Audio includes <{{SFX 1, one per bracket}}>, <{{SFX 2}}>. {{02 AUDIO line, verbatim}} No music of any kind.
```

**Handles.** Write `@Image1`, `@Video1`, `@Audio1`: no space, numbered by the order of the `medias` entries within each media type (`image_references`, `video_references`, `audio_references`; 05-T11 confirms the mapping on Higgsfield). This is the form in the official API examples and sd25-pe; the prompt guide also shows `@Image 1`. Never mix the two forms in one prompt. Every module in this skill (03 role lines, 05b snippets, 06 and 07 edit templates) already uses the unspaced form. Never write a job ID or `media_id` in the prompt. The only ID a prompt may hold is a reference-element placeholder `<<<element_id>>>` on the element route (03 §3.4), which the backend rewrites to `@<element-name>`; never type that `@name` form yourself.

Why this shape:
- The labelled sections and the one-subject-per-line mapping follow sd25-pe 0.1.1, the official compiler.
- The audio constraint appears at the start and again at the end, with the music words listed out. That is the official fix for BGM leaking through a plain "no BGM" `[OFFICIAL FAQ]`.
- `【】` is also Seedance's subtitle syntax. Check drafts for rendered label text (Q19). If a label ever renders, switch that shot to plain `Generation goal:` labels and log the change.
- **No edit or extension verbs in a reference prompt.** The model re-classifies the task from the prompt even when the request is a reference task, and on the official API a mismatch fails with `TaskTypeMismatch` `[OFFICIAL]`. On Higgsfield keep `mode: omni_reference` and log any error or mode adjustment the job reports. Keep out *edit, add, remove, delete, replace, change, modify* and *extend, continue, continue from*. "Continuous" is fine: the official examples use it.

**Camera language** (official: shot terms can be written plainly; anything technical is expanded into its visible result):
- Always name the subject, start state, direction and end state: "a handheld medium shot backing away ahead of Miraj, ending as a medium close-up". Write "about a 47-degree field of view", not "35mm"; focal length may only add to a visible description.
- Use one dominant move per shot, at the variant's behaviour (02, 04 §4.1). Expand niche terms: "rack focus: the railing in the foreground blurs as Miraj's face sharpens".
- For a blockout shot the clip owns the camera, so keep the camera sentence consistent with the playblast, never competing with it (04 T3 tie-breaks).

**Physics-accurate motion language** (every REAL shot follows ledger L.7; DREAM breaks only its registered exception):
- **Action chain.** Preparation → contact (name the second) → reaction (compression, recoil) → recovery. Example: "fists meet once at about 5.5 seconds; Miraj's knuckles compress, his forearm recoils a few centimetres; the robot's arm stops dead with a small servo settle".
- **Weight and support.** "Each foot planted before the other lifts; heel then toe; weight shifts from foot to foot; feet never slide, glide or float" (04 T3 gait clause, from scenario-labs `cast.md`, MIT). Bodies lean into acceleration and lurch forward when the bus brakes. Seated weight compresses the cushion.
- **Materials.** Name how they move: "cotton coverall creases at the elbows", "hair lifts in the train's air wake", "water drops fall straight and bead on the tile". Water, wave and echo words raise the risk of bubbling audio artefacts `[OFFICIAL FAQ]`, so on water shots check Q15 and let 06 supply water SFX. Write light physics as one key direction matching the ledger sun ("short shadows fall toward camera right").
- **State monotonicity.** Sweat, dust and wet eyes only accumulate across shots; write the current level. Props keep their count and owner; after a handoff, the giver no longer holds it (sd25-pe).
- **Substitute, don't only forbid.** Give the replacement behaviour, not a bare "no X" (the OpenMontage technique, paraphrased). Example: "the glass dust is swept into a neat pile" instead of "no shards flying".
- **Avoid.** More than 3 tracked characters in one shot; describe everyone else as a crowd with tasks and a headcount (05b §5b.8). Slow motion unless declared; reflections that could double a person; an exit and re-entry inside one shot; "floating", "glides", "weightless" outside DREAM. Name whose hand or object is in any insert (seedance-director, user's skill).
- Write micro-expressions as physical changes ("jaw sets, nostrils widen"), never as labels or eye effects. Strong emotion words can make eyes glow: write "normal human eyes" and use calmer words ("amazed", not "fanatical") `[OFFICIAL FAQ]`.

**Locks** (named blocks stating what holds; technique from OpenMontage, paraphrased):
- **COUNT**: exact headcount, no doubles in reflections.
- **SCREEN DIRECTION**: the axis, e.g. "the train always runs right to left".
- **LENS**: one field of view, no drift.
- **STILLNESS**: what never happens, e.g. "nobody else speaks; the mother's photo stays on the shelf".
- **IDENTITY**: an invented, original face; no logos and no readable text.

**Timestamps.** Integer-second ranges are continuous, non-overlapping and end at G. They are event budgets, not edit points. Never time high-frequency actions `[OFFICIAL]`. Use the playblast's beat frames ÷ 24, rounded. With few events, use "At the start / Principal event / At the end".

**Banned words** (from the user's seedance-director skill): breathtaking, stunning, mesmerizing, masterpiece, seamless, epic, cinematic masterpiece, 8K, IMAX, hyperrealistic, "photorealistic" on faces (03). Never name a real film, actor, brand or celebrity.

**Worked example — S03-SH02** (BLOCK, R-DAY, no dialogue; IDs from 04's hand-off; Miraj and the robot by their approved sheets' job IDs on the T1 route, location plate face-free):
```text
Audio policy: the soundtrack holds only the diegetic sounds named at the end. No music, background music, BGM, score, instrumental, melody, synth effects, ambient pad, drone, stinger or rising tone at any moment. No subtitles.

【Generation Goal】
Generate one continuous handheld shot: Miraj walks along the moving metro walkway toward camera, stops, and the greeting robot steps in from frame right and bumps fists with him while a metro train passes behind them.

【Reference Asset Roles】
@Image1 is Miraj: use only his face, hair, beard, build and grey work coverall; do not use the grey background or the panel layout.
@Image2 is the greeting robot: use only its shell, joints, proportions and colours; do not use the grey background.
@Image3 is the metro walkway at noon: use only its architecture, materials and light direction; do not use any people in it.
@Video1 is a coarse 3D blocking reference: rehearsal footage in which coloured stand-ins walked the scene so camera, timing and movement could be locked. [… 04 T3 clause continues verbatim to "no capsule-shaped bodies."]

【Subjects and Relationships】
Exactly eight figures: Miraj, the robot and six commuters; no extra people and no doubles in the glass. Miraj stays on the camera side of the walkway's centre line. The train always runs right to left behind them.

【Event Script】
0-3 seconds: Miraj walks toward camera at an even pace, heel then toe, coverall creasing at the knees, sweat darkening his collar.
3-5 seconds: the robot steps in from frame right with a short, stiff limp on its left leg while Miraj slows and stops with both feet planted; behind them a metro train enters from frame right.
5-6 seconds: Miraj sees the robot's raised right fist, then lifts his own; the fists meet once at about 5.5 seconds; Miraj's knuckles compress and his forearm recoils a few centimetres; the robot's arm stops dead with a small servo settle.
6-7 seconds: both lower their hands; Miraj breathes out through his nose with a tired half-smile; the last carriage clears frame left.
[05b PERFORMANCE block A for Miraj and F for the robot]

A handheld medium-wide shot backing away ahead of Miraj at about a 63-degree field of view, ending as a medium shot, with gentle breathing drift; focus holds on Miraj's face and the background stays soft.

The visuals feature [prefix/seedance.txt core + variant R-DAY, verbatim].
Characters, wardrobe, props and environments stay identical to their references across every cut; no identity drift.

【Maintain Consistency】
Keep Miraj's face and coverall, the robot's shell and its left-leg limp, eight figures in total, the train's direction, and the high sun behind camera left with short shadows.

Audio includes <footsteps on the ribbed walkway belt>, <a metro train passing right to left with a long steel rush>, <one dull knock of knuckle on metal at the fist bump>. Diegetic sound effects and ambience; dialogue only where the shot scripts it. No music, no background music, no score. No subtitles. No music of any kind.
```
Params: `model: "seedance_2_5"`, `mode: "omni_reference"`, `aspect_ratio: "16:9"`, `duration: 7`, `generate_audio: true`, `draft: true`, `folder_id` = the S03 scene folder; `medias` in handle order: CHR_MIRAJ sheet job ID (`image_references`), CHR_ROBOT sheet job ID (`image_references`), LOC_METRO-WALKWAY plate job ID (`image_references`), `SLA_S03-SH02_PB_v03.mp4` `media_id` (`video_references`). Cost 21 credits per draft. The second ranges come from 04's beat frames ÷ 24: robot enters f84 (3.5 s), train f97–f160 (4.0–6.7 s), contact f133 (5.5 s).

### 5.3 Dialogue shots: lip-sync to the user's ElevenLabs takes

**What is verified, and what is not:**
- `[OFFICIAL]` An audio reference supplies music, dialogue, voice, tone or timbre. The guide's binding example names which character, shown in which image, uses the voice timbre of which audio clip.
- `[OFFICIAL: sd25-pe]` By default reference audio gives only timbre, accent, rate and emotion, and the `{}` text decides the words, **unless the prompt asks to reuse the dialogue in the audio**.
- `[OFFICIAL]` `generate_audio: true` makes the model generate its own voice, effects and music. On the official API the output audio is always mono; check the Higgsfield file with ffprobe (05-T7).
- No official page (ByteDance, BytePlus or Higgsfield) promises that the output contains the uploaded file verbatim, or that lips lock to it frame by frame. So Seedance re-performs the line. The plan (07 §7.7) lays the ElevenLabs master under the picture, which works only if Seedance's performance keeps the take's timing.
- `[OFFICIAL, Seedance 2.0 FAQ]` Describing the voice's characteristics in the prompt improves voice match.
- `[FIELD: scenario-labs, MIT]` A track the prompt does not claim is easily ignored; the binding wording is "@audio1 is her own voice; she speaks it to camera, lips in sync".
- 05b §5b.6 covers framing, word budgets and the edit-window minimums.

**Audio upload copy** (one file per voice, never the mixed `_DLG_`):
1. Take the selected take from 01 and place it at its line marker inside a silent bed exactly G s long. Never trim, speed up or re-time speech (01 §1.2.6):
   `ffmpeg -i SLA_S11-SH05_S11-L06_MIRAJ_T02.wav -af "adelay=delays=1000:all=1,apad=whole_dur=6" -ar 48000 -ac 1 SLA_S11-SH05_S11-L06_MIRAJ_T02_PAD.wav` (05b).
   The file must be at least 2 s long `[OFFICIAL]` and at most 15 MB. A 30 s total per request allows at most one or two voices per shot.
2. Upload it like the playblast (`media_upload` → PUT → `media_confirm` with `type: "audio"`) and pass its `media_id` with role `audio_references`.
3. A second voice in the shot (the mother on `PHONE` while Miraj listens) gets its own file and its own handle, bound to "the voice heard from the palm screen". The listener keeps his mouth closed.

**Method A, the default.** Add these lines to the prompt; 05b snippet C supplies the delivery and silence lines:
```text
@Audio1 is Miraj's own voice and dialogue. Reuse the speech in @Audio1 exactly as recorded, word for word and at its own timing, with word-level lip sync: his lips close fully on p, b and m, and his mouth returns to rest after the last word.
Miraj's voice: {{01 voice descriptor, verbatim}}.
Dialogue language: {{language from 01}}. Miraj's line ({{2-3 delivery words = the v4 tag's mask}}): {SPOKEN}
Before the line his lips stay closed; after it he holds still for half a second. Nobody else speaks; no murmur, laugh or added word.
```
- Replace `SPOKEN` with 01's SPOKEN text, identical, and keep the single braces: `{}` is Seedance's dialogue syntax. Put it once. Never repeat words of the line elsewhere or tie emotion to single words, which triggers burned-in subtitles `[OFFICIAL FAQ]`.
- Name the language per speaker, right before the line.
- Paste Arabic, Urdu or Devanagari text from its own code block so right-to-left editors do not reorder it.
- `generate_audio: true` until 05-T8 says otherwise. Decide it at the draft, because the final inherits it.

**Worked example — S11-SH05** (STILL, R-INT, line S11-L06 `ON`; 05b beat map: take T02 placed at 1.0 s, speech 1.1–3.9 s, G = 6 s; words and language are placeholders until 01 locks them):
```text
Audio policy: the soundtrack holds only Miraj's speech from @Audio1 and the quiet room sounds named at the end. No music, background music, BGM, score, instrumental, melody, synth effects, ambient pad, drone, stinger or rising tone at any moment. No subtitles.

【Generation Goal】
Generate one continuous locked-off medium close-up: Miraj, sitting on the edge of his bunk at night, answers his mother on the palm screen in his hand.

【Reference Asset Roles】
@Image1 is Miraj: use only his face, hair, beard, build and faded grey T-shirt; do not use the grey background or the panel layout.
@Image2 is Miraj's shared room at night: use only its walls, bunk beds and lamp light; do not use any people in it.
@Audio1 is Miraj's own voice and dialogue. Reuse the speech in @Audio1 exactly as recorded, word for word and at its own timing, with word-level lip sync: his lips close fully on p, b and m, and his mouth returns to rest after the last word.
Miraj's voice: {{01 voice descriptor, verbatim}}.

【Subjects and Relationships】
Exactly one person, Miraj, alone in frame; his mother is only a soft, unreadable glow on the palm screen. His face is three-quarter to camera and nothing covers his mouth.

【Event Script】
0-1 seconds: Miraj looks down at the palm screen, his thumb stops turning the ring, lips pressed closed; one short breath in through the nose.
1-4 seconds: Dialogue language: {{LANG}}. Miraj's line (warmly, holding it together): {SPOKEN of S11-L06}
4-6 seconds: the half-smile drains last; his ring hand closes into a fist; one slow blink; lips stay closed; his head stays still.

A locked-off medium close-up at seated eye level, about a 40-degree field of view; focus on his eyes, the bunk behind him soft. The ring on his finger glows a soft #3BD16F green.

The visuals feature {{prefix/seedance.txt core + variant R-INT, verbatim}}.
{{02 CONTINUITY line}}

【Maintain Consistency】
Keep Miraj's face, beard and T-shirt; one person only; nobody else speaks; the lamp stays the only warm source, camera left.

Audio includes <a ceiling fan's slow tick>, <distant traffic through a closed window>. {{02 AUDIO line, verbatim}} No music of any kind.
```
Params: `mode: "omni_reference"`, `aspect_ratio: "16:9"`, `duration: 6`, `generate_audio: true`, `draft: true`, `folder_id` = the S11 scene folder; `medias`: CHR_MIRAJ sheet job ID (`image_references`), room plate job ID (`image_references`), `SLA_S11-SH05_S11-L06_MIRAJ_T02_PAD.wav` `media_id` (`audio_references`); no video. The green is named only because an assistant device is in frame (02 §2.5), with its hex attached to the ring and never in brackets: `()` is Seedance's music syntax, and 02 bans brackets in the look text.

**Acceptance (Q14):**
- The audio never leads the mouth by more than 1 frame and never lags by more than 2 frames at 24 fps (07 §7.7; T2).
- The words match SPOKEN exactly.
- Listeners' mouths stay closed.

**Measure it** with the audio-proxy method:
1. Get Seedance's speech onset: `ffmpeg -i DRF.mp4 -af silencedetect=n=-35dB:d=0.15 -f null - 2>&1 | grep silence_end`. Do the same on the `_PAD.wav`. Seedance's track also carries the room sounds; if they keep it above −35 dB, no silence is found, so read the onset from the waveform or go straight to step 3.
2. Offset in frames = (Seedance onset − ElevenLabs onset) × 24. That is the slip 07 applies to the ElevenLabs master.
3. Then confirm mouth against audio on 07's 12-frame strip at the onset (07 §7.2 E). A 2 fps sheet cannot show this.

**When method A fails** (two rounds of one-variable fixes not passing Q14), Claude proposes these in order and the user chooses. Every choice is logged in `decisions.md` and the ledger.

| Fallback | What happens | Disclosure line | Effect on the 70% rule (00 §0.4, L.5) |
|---|---|---|---|
| **F1 Re-draft** | shorter line or split shot (01 REBALANCE), steadier head, MCU frontal, more silence before and after | none extra | none: stays `SD` |
| **F2 Seedance audio edit** | `mode: video_edit` on the **original** approved final, passed by its Higgsfield job ID (never a re-encoded copy), with the `_PAD.wav` as `audio_references`: "Edit @Video1, replacing only Miraj's speech with the speech in @Audio1, reusing its words and timing exactly; adjust only his lip movements word by word to match; keep everything else unchanged" plus the 5.8 scope-closure sentence. `[UNVERIFIED]` for supplied audio: the official examples re-dub with model speech | "lip movement re-timed by a Seedance 2.5 edit task conditioned on the ElevenLabs v4 line" | none: an edit stays `SD`. Billed by the source video's duration `[HF]` |
| **F3 Keep Seedance's own voice** | the user accepts the voice Seedance performed in the ElevenLabs timbre; DX for that line comes from the Seedance track | "voice performed by Seedance 2.5 using the ElevenLabs v4 voice as timbre reference; synthetic" | picture unchanged. The DX stem becomes `SD`, which **raises** the R3 audio share. Voice consistency across shots must be re-checked |
| **F4 Restage** | cut to the listener, over-the-shoulder, or `OFF` framing (05b snippet D); the ElevenLabs line plays over picture that needs no lip-sync | none extra | none: stays `SD`; a story choice for the user |
| **F5 External lip-sync** (last resort, explicit yes) | a lip-sync model re-renders the mouth on a copy of the Seedance final (only a lip-sync model offered inside Higgsfield: the 26 Sep MCP snapshot listed `sync_so` (Sync Lipsync 3), but a `models_explore` search on 2026-11-01 did not return it, so resolve it live with `models_explore` first `[UNVERIFIED]`) | the tool, version and seconds in the AI disclosure as a support tool; the original Seedance file and row kept | the derivative row classes as `SD-COMP` under L.5's house rule (Seedance plate fills the frame). The Organizer's method is unpublished, so cap F5 at **≤ 5% of T** in total and add the question to the 00 §0.9 email. Name the copy with a new derivative OP code `LSY` (add it to ledger L.1's OP list) |

**Other modes:**
- `VO` and `PHONE` lines bind the audio to the source ("@Audio1 is Noah's broadcast voice heard from the wall screen; nobody in frame speaks"). Every visible mouth stays closed.
- Noah has no mouth: nothing on his head panel moves with speech (03, 05b F).
- `ON-WIDE` lines use the same binding without the close-up rules.

### 5.4 Run the draft (480p)

1. **Pre-submit checks** (Claude, every time):
   - The output name is not already owned by an OK ledger row or a job in `reports/inflight.md`; a second take of the same version is `t2`.
   - Every `@ImageN`, `@VideoN` and `@AudioN` in the prompt has a `medias` entry of that role at that position, and every attached media is named in the prompt or listed under `【Unused Assets】`.
   - No parameter words (rule 4) and no job IDs or `media_id`s in the prompt; the sha256 of `prompt_vNN.txt` is in the packet.
2. **Cost preflight.** Call `generate_video` with the exact params plus `get_cost: true`; nothing is submitted. Put the credits in the T1 packet card and submit only after the user's yes on the packet. One yes covers that shot's takes inside the 5.6 budget.
   ```text
   generate_video  params:
     model: "seedance_2_5" · mode: "omni_reference" · draft: true · duration: 7 · aspect_ratio: "16:9" · generate_audio: true
     folder_id: <S03 scene folder> · count: 2
     medias: [{value: <CHR_MIRAJ sheet job ID>, role: "image_references"}, {value: <CHR_ROBOT sheet job ID>, role: "image_references"},
              {value: <LOC_METRO-WALKWAY plate job ID>, role: "image_references"}, {value: <PB_v03 media_id>, role: "video_references"}]
     prompt: <prompt_v03.txt, verbatim>
     get_cost: true            (preflight; drop it to submit)
   ```
3. **Submit.** Drop `get_cost`. Two takes of one version: one `generate_video` call with `count: 2` (variants of the same prompt, inputs and settings). Several shots at once: `generate_video_batch` (1–12 requests, each `count: 1` with its own `index`); a batch cannot preflight, so preflight each distinct request with `generate_video` + `get_cost: true` first. Write every returned job ID to `reports/inflight.md` at once (ledger L.2). Apply any `adjustments` the result returns and call any `recovery_tool` it names; log the adjusted values.
4. **Wait.** `jobs_wait` with the job IDs (≤ 12 per call, `timeout_seconds` ≤ 15), again after `poll_after_seconds` until `all_terminal`; then one `show_generation_by_ids` for the set (or `job_display` for a single job). Never resubmit on a timeout (rule 5).
5. **Download and log in the same turn** (ledger L.2 download routine). Take the result URL from `jobs_wait`, or the download URL from `get_project_asset_source` for the job's placement in the scene folder (the tool describes download URLs for confirmed files; 05-T10 checks it for generated jobs `[UNVERIFIED]`). Download to Drive `04_SCENES/S03_<slug>/drafts/`, then sha256, ffprobe and c2patool; save the job result as `ledger/raw/<gen_id>.json`. Ledger row: Higgsfield job ID in `task_id`, the model label as `models_explore` shows it, mode, folder ID, the references' job IDs and `media_id`s, prompt sha256, credits (preflight figure, checked against `transactions`), `draft_expires_utc` = creation + 7 days, file name and sha256 of the downloaded original, outcome. Then remove the job from `inflight.md`.

**Web-app takes** (the user generated by hand in the same project): Claude reads them back the same day.
1. `list_project_assets` with `workspace_id`, `project_id`, `folder_id` = the scene folder, `output_kinds: ["video"]`, newest first: the placements not yet in the ledger.
2. `get_project_asset_prompt` per `placement_id`: copy the exact prompt and settings into `prompt_vNN.txt`. If they differ from the approved packet, it is a new version and needs its own G5-P yes before it is used.
3. `get_project_asset_source`: download URL and file metadata; download and hash as above.
4. `job_display` with the `item_id` (and the `folder_id`) shows it in chat. The ledger row is the same, with `human_contribution` "generated by AboStesha in the Higgsfield web app" and the credits read from `transactions`.

- **Takes.** Submit **2 takes** of the same version; `seedance_2_5` exposes no seed, so takes differ. Higgsfield's concurrency is unpublished (T6 measures it). Submit the hardest shots first (00 §0.7, from D7).
- **Why drafts pay.** For a 7 s shot, 2 drafts + 1 final = 154 credits (≈ $6.87–7.70), against 224 credits (≈ $9.99–11.20) for 2 direct 1080p takes. Drafting saves credits only through the takes you discard; finalize only the take you keep `[FIELD: scenario-labs]`.
- **If the session dies:** the job IDs are in `reports/inflight.md`; `jobs_wait` on them. If an ID is lost: `list_project_assets` in the scene folder, newest first. Never resubmit.
- Higgsfield has no `watermark` or `output_format` parameter; T4 and 05-T7 record what the files carry.

### 5.5 Review the draft (Claude first, then the user)

**Measure before judging:**
```bash
D=SLA_S03-SH02_SD25-DRF_v03_t1.mp4
ffmpeg -i "$D" -vf "fps=2,scale=320:-2,tile=6x3" -frames:v 1 qc_sheet_t1.png                     # whole-clip sweep
ffmpeg -i SLA_S03-SH02_PB_v03.mp4 -i "$D" -filter_complex \
  "[0:v]scale=-2:360[a];[1:v]scale=-2:360[b];[a][b]hstack" -an qc_pb_vs_t1.mp4                    # playblast vs draft
ffmpeg -i "$D" -af "volumedetect" -vn -f null - 2>&1 | grep -E "mean|max"                         # audio present?
```
The hstack comparison is scenario-labs' review sheet (MIT). Watch every take at speed with sound before ranking. Sheets find faults; they cannot clear motion faults `[FIELD: scenario-labs]`.

**QC checklist** (each item PASS / FAIL with a timestamp; the same list runs again on the final):

| # | Check | Fails when |
|---|---|---|
| Q1 | Identity | face, hair, beard or build drifts from the `face` plate at any 2 fps sample (not only first and last frames) |
| Q2 | Wardrobe and props | wrong costume state; prop count or owner wrong (lens case, ring, crates); a second copy of a one-off prop |
| Q3 | Headcount | extra or missing people; doubles in glass or reflections; a capsule shape survived |
| Q4 | Continuity IN/OUT | the opening state contradicts the previous shot's OUT (continuity bible §9); sweat or dust reset |
| Q5 | Screen direction and eyelines | the axis flipped; eyeline targets differ from 04's sheet |
| Q6 | Support and contact | foot sliding, air-walking, hands passing through objects; contact not on the planned second |
| Q7 | Mass and timing | weightless falls; vehicles changing speed oddly; a walk faster or slower than the capsule's pace |
| Q8 | Materials | cloth, hair, water or glass behaving like solids; liquid not falling at gravity (outside DREAM) |
| Q9 | Light | shadow direction or length contradicts the ledger sun; a light with no source in REAL variants; the reserved green outside an assistant device |
| Q10 | Camera | path, framing or lens differs from the playblast; a lens pop; a freeze-then-jump; an invented cut |
| Q11 | Beat timing | an action misses its second by more than 12 frames; the clip ends early or drifts in the last second |
| Q12 | Performance | below 05b's scale minimum (hero shots ≥ 4); a reaction before its trigger; glowing eyes |
| Q13 | Hands and faces in motion | finger count, melting hands, teeth or eyes artefacts during fast moves |
| Q14 | Lip-sync (ON lines) | out of tolerance (5.3); wrong or extra words; a listener's mouth moving |
| Q15 | Audio content | any music, pad or tonal bed; missing named SFX; invented speech or murmurs; ripple, bubbling or echo artefacts |
| Q16 | Text | burned-in subtitles; label text rendered; garbled signage (planned text is post work, 07) |
| Q17 | Rights and G-rating | logos, real landmarks treated as brands, real-person likeness; any non-G detail |
| Q18 | Texture artefacts | fingerprint-like patterns in foliage or fabric; flicker; boiling textures |
| Q19 | Prompt leakage | hex codes, `【】` labels or stand-in colours rendered; grey or untextured surfaces |
| Q20 | Tech (finals) | not 1920×1080; frame rate not the T6 baseline (24/1 expected); frames < fps·G − 1; codec, pix_fmt, bit depth or bitrate differ from the 05-T7 baseline for `bitrate_mode: "high"`; audio stream missing when `generate_audio` was true |

**Verdict per take:** `APPROVE` · `ITERATE` (name the one variable) · `REBLOCK` (send back to 04 with the defect and timecode) · `CUT` (talk to the user about the shot).

Show the T2 review card. When the user approves, update the draft's ledger row only in its review cells: `review_status` APPROVED, `approved_by`, `approved_utc`, `approval_words` = «...their words...» verbatim (ledger L.2), and set the shot to DRAFT-APPROVED in `SLA_SHOTS.csv` (L.4). The 05b take gate G5b-C must also pass.

### 5.6 Iteration discipline

- **Change one thing per version** and write it in the iteration log (T5): a prompt sentence, a reference, the playblast version or a parameter. Bump `v` when the prompt or references change; `t` counts takes of one version (ledger L.1).
- **Budget per shot:**
  - 2 takes × up to 3 versions = **6 drafts** (126 credits ≈ $5.60–6.30 at 7 s).
  - Then stop and redesign the shot: split it, remove an action, change the angle, or re-block.
  - Hero shots may get up to 10 drafts with the user's yes.
  - When 4 takes fail the same way, a variable is missing from the prompt or blockout (07 §7.5).
  - After 10–15 failed iterations the problem is never the wording (OSideMedia via 05b; OpenMontage, paraphrased).
- **Fix at the right layer.** A defect copied from the playblast goes back to 04. An identity defect goes to 03's references. Physics goes in the event script. Performance goes through 05b snippet G.
- **Judge the whole clip, never a single frame.** A good still can come from a take that falls apart at second 5 (OpenMontage, paraphrased). Land cuts on movement.
- **Do not compensate with adjectives.** Never add quality packs ("8K, masterpiece"); sd25-pe forbids unrequested packs.

### 5.7 Final from the approved draft (1080p)

**Before submitting:**
1. Check the draft row is `APPROVED` with the user's words. Never finalize without it.
2. Check the draft's age. Higgsfield finalizes a draft only **within 7 days** `[HF]`; `draft_expires_utc` = draft creation + 7 days. The house rule from 00's daily close still applies: finalize or kill every approved draft before it is 5 days old.
3. Preflight with `get_cost: true` (16 credits/s; 112 credits for 7 s) and include it in the G5-D question.

```text
generate_video  params:
  model: "seedance_2_5" · draft_job_id: <approved draft job ID> · resolution: "1080p" · bitrate_mode: "high"
  folder_id: <S03 scene folder>
  get_cost: true            (preflight; drop it to submit)
```
- Send only these fields. The final inherits prompt, references, duration, aspect ratio and the audio setting from the draft; the official API rejects a final that resends them `[OFFICIAL]`. If T3 shows the Higgsfield tool needs anything else, record it here.
- Then the 5.4 steps 3–5: job ID into `inflight.md`, `jobs_wait`, download to Drive `04_SCENES/S03_<slug>/finals/` **and** a byte-identical copy to `08_EVIDENCE/RAW_SEEDANCE/`, hash, ledger row with `parent_gen_id` = the draft.
- **Bitrate.** `bitrate_mode: "high"` on every final (same credits, measured). There is no `output_format` choice on Higgsfield; 05-T7 records what the file is and whether Premiere needs a logged ProRes derivative (the original stays untouched).
- **Review the final against its draft:**
  `ffmpeg -i PB.mp4 -i DRF.mp4 -i FIN.mp4 -filter_complex "[0:v]scale=-2:360[a];[1:v]scale=-2:360[b];[2:v]scale=-2:360[c];[a][b][c]hstack=inputs=3" -an qc_3up.mp4`.
  - The official docs call the final a new, "consistent" generation that reuses prompt, references, seed, audio setting, ratio and duration. Scenario-labs saw its completions match the draft on every sampled frame. Review every final anyway.
  - Re-run Q1–Q20, with special care on eyes, blinks and lip closures (05b §5b.9) and Q20 tech.
  - If identity or action drifted: make a second final from the same draft (named `_f2`; a second billed generation) or re-draft. Ask the user which.
- Approve the final with the user's words (ledger review cells, as in 5.5). Then set the shot to FINAL-APPROVED in `SLA_SHOTS.csv` and append the prompt-library entry (SKILL §7b): film code, shot ID, model and params, the exact prompt, references and roles, their verdict, what made it work, what failed before it.
- Extract the last frame for continuity from the downloaded original, as a derivative: `ffmpeg -sseof -1 -i FIN.mp4 -update 1 FIN_LF.png` (named `…_SD25-FIN_vNN_tK_LF.png`, ledger L.1). Hand the final to 07 for import and give 06 the SFX events with seconds.
- Save the Higgsfield job record (model label, date, job ID, folder, prompt read back with `get_project_asset_prompt`) in `08_EVIDENCE/` (5.0, proof of Seedance use).

### 5.8 Fixes after the cut: edit and extend tasks

Use these for 07 §7.5 rank-3 fixes and 08 notes. The result stays `SD`.

- **Source.** Always the **original** final, passed by its Higgsfield job ID with role `video_references`; never a trimmed, re-encoded or re-uploaded copy. On the official API a face-containing clip loses trust once it is trimmed, re-encoded or forwarded `[OFFICIAL]`; how Higgsfield treats an altered clip is unknown, so do not test it on hero shots.
- **Edit settings.** `mode: video_edit`; `duration` and `aspect_ratio` are ignored and the job is billed by the source's duration `[HF]`; a source of 4–30 s (≤ 20 s recommended), the prompt starting with "Edit @Video1, …".
  - Every edit prompt names exactly what changes and closes the scope. House wording, paraphrasing sd25-pe: "Everything not named above in @Video1 (people, props, background, camera, timing, sound) stays exactly as it is; nothing is replaced, added or removed."
  - For a moving replacement, the new object inherits the old one's timing, path, speed and occlusions (motion-slot replacement, sd25-pe).
- **Edit duration.** The output can be up to 0.4 s shorter than the source. If length matters, give the source a frame count of 8n+1, e.g. 169 frames for about 7 s `[OFFICIAL FAQ]`. Or switch to `mode: omni_reference` with an exact `duration`.
- **Audio-only edit** (06 found music inside a clip):
  - Prompt: "Edit @Video1. Remove only the background music. Keep the character dialogue, lip sync, ambience, action sound effects and all visuals unchanged."
  - Post isolation is the alternative. It also removes the SFX `[OFFICIAL FAQ]`.
- **Extend.** `mode: video_extension` with `extension_mode: "forward"` or `"backward"` (required); `aspect_ratio` is ignored, the output follows the source `[HF]`.
  - Forward: describe the boundary state first, then the new action.
  - Backward: describe the new action first, then end on the source's first frame. Nothing from later in the source may appear early (sd25-pe).
  - State that each subject stays one continuous instance.
- **Running them.** `draft: true` with `get_cost: true` first, then finalize with `draft_job_id` as in 5.7. Name the result `_SD25-EDT|EXT_vNN_tK_eNN` (L.1); `eNN` counts the passes on one source. If 05-T9 shows edit or extension jobs cannot be drafted, run the job once at `resolution: "1080p"`, `bitrate_mode: "high"`, only after the user's yes.

### 5.9 Moderation failures and tool errors

Higgsfield does not publish its error codes. Log every failure as `FILTERED` or `FAILED` with the exact refusal text, the job ID (if one was created) and the credit movement from `transactions` (failed jobs are expected to be refunded; check, never assume), including rejections made at submit time. The underlying model's filter is the same family as on the official API, so the BytePlus codes below are used to classify a Higgsfield message by cause. Change content or route, never pixels or spelling tricks. Tell the user in Arabic what was blocked and what you propose.

| Cause class (official BytePlus code, for reference) | Likely cause here | Action |
|---|---|---|
| `InputImageSensitiveContentDetected.PrivacyInformation` / `InputVideo….PrivacyInformation` | a realistic face in a reference image or clip; a Seedance clip that was re-encoded, trimmed or re-uploaded | use the route that passed T1 (sheet by job ID, reference element, or a first frame generated inside Higgsfield; 03 §3.4); for edits, the original final by its job ID (5.8) |
| `Input*SensitiveContentDetected.PolicyViolation` | IP-like design, a logo, a brand or a famous character in a reference or the prompt | redesign the asset in 03; remove brand words |
| `InputTextSensitiveContentDetected` | violence, substance or weapon wording; e.g. a vest, khaini or alcohol beat that 01's G1 check should already have removed | content fix in 01 (G-rating); never synonyms to sneak it through |
| `InputAudioSensitiveContentDetected` (`.PolicyViolation` = copyright) | the ElevenLabs file carries music, a bed or a voice that sounds like a real person | send the dry voice-only `_PAD.wav`; a designed voice, never a clone of a real person without consent (01) |
| `OutputVideoSensitiveContentDetected` (`.PolicyViolation`) | the finished render was screened; the filter belongs to the model family, so an identical retry usually fails again `[FIELD: scenario-labs]` | simplify the content of that beat; one retry only after a real content change |
| `OutputAudioSensitiveContentDetected` | generated speech or sound screened. A field report blames long "no music" exclusion lists `[FIELD: scenario-labs]` | re-draft with sound described positively only (drop the exclusion list for that shot); strip any music in post (06) |
| `InvalidParameter.TaskTypeConstraint` / `.TaskTypeMismatch` | edit or extend wording in a reference prompt ("replace", "change", "continue"), or settings that do not fit the mode | keep `mode: omni_reference`; reword with no edit verbs (04 §4.9) |
| Image decode error (official: HTTP 400 `invalid image: heic: decode failed`) | non-standard JPEG chroma subsampling | `ffmpeg -pix_fmt yuvj420p`, or PNG; upload again |
| A media is refused or ignored | no role on an entry; an https URL in `medias[].value`; an element ID put in `medias` | set a role on every entry; pass only `media_id`s or job IDs; elements only as `<<<element_id>>>` in the prompt |
| The result carries `adjustments` or names a `recovery_tool` | a value was clamped or coerced (e.g. `duration`), or a step is missing | apply it or call that tool as the result says; log the adjusted value; if `duration` changed, re-time the event script in the next version |
| The tool returns `unlim_choice` | a free-trial allowance covers the model | nothing was submitted; ask the user which balance pays, then call again with `use_unlim` set |
| Queue or rate refusal | Higgsfield's limits (unpublished) | wait; check `list_project_assets` in the scene folder before any new submit |
| Transport timeout or network error on submit | the request may have reached the server | no ledger row yet; `list_project_assets` in the scene folder (newest first), then `jobs_wait` on what you find; never resubmit blind |
| Not enough credits | balance too low | `balance`; the user tops up (5.0) |

### 5.10 Daily close and hand-off

At the end of each production day (with 00 §0.7):
- **Clean ledger.** Every job (MCP and web app) is downloaded, hashed and in the ledger; `reports/inflight.md` is empty or each entry is explained. A `list_project_assets` pass over the day's scene folders finds no placement missing from the ledger.
- **Expiries.** List approved drafts with their age and Higgsfield's 7-day limit; anything 4 days old is finalized tomorrow morning.
- **Day report.** Spend in credits and USD (sum of `cost`, reconciled with `transactions`), drafts and finals made, approvals, moderation blocks, and the shots past their 5.6 budget.
- **Prompt library.** Every approved final and every instructive rejection of the day has its entry in `prompt-library/` (SKILL §7b).
- **Queue.** Tomorrow's queue, hardest first. Run L.5's share script on the current assembly when 07 has one.

---

## Output templates (what Claude shows the user)

**T1 — Shot packet card** (before any spend; prompt in English in a code block, the rest in Arabic)
```text
لقطة S03-SH02 — نسخة v03 — حزمة جاهزة للمسودة
النمط: BLOCK (بلاي بلاست 7 ث) · المتغيّر: R-DAY · الحوار: لا يوجد
المراجع: @Image1 معراج (ورقة معتمدة، job ID) · @Image2 الروبوت (ورقة معتمدة، job ID) · @Image3 ممر المترو (لوحة بلا وجوه) · @Video1 PB v03 (media_id)
الإعدادات: Higgsfield seedance_2_5 · omni_reference · مسودة 480p · 16:9 · 7 ث · صوت مُولَّد: نعم (مؤثرات فقط، بلا موسيقى) · المجلد: 04_SCENES/S03
التكلفة (get_cost): مسودتان 42 رصيد (≈ 1.9–2.1$) · النهائي 1080p ‏112 رصيد (≈ 5.0–5.6$)
[البرومبت كاملاً بالإنجليزية في كتلة كود]
هل أرسل مسودتين بهذه الحزمة؟ (نعم / تعديل: …)
```

**T2 — Draft review card**
```text
مراجعة المسودة — S03-SH02 v03 — t1 / t2
| البند | t1 | t2 |
| Q1 الهوية | ✓ | ✗ اللحية تخفّ عند 3.5 ث |
| Q6 الملامسة | ✓ القبضتان عند 5.4 ث | ✓ |
| Q10 الكاميرا | ✓ تطابق البلاي بلاست | ✓ |
| Q15 الصوت | ✓ بلا موسيقى | ✗ نغمة خلفية خفيفة من 2 ث |
توصيتي: اعتماد t1 للنهائي. ملف المقارنة: qc_pb_vs_t1.mp4
هل تعتمد t1 للانتقال إلى النسخة النهائية 1080p؟ (اكتب كلمات الاعتماد بنفسك)
```

**T3 — Final review card**: the same table on the final, plus the 3-up link, the Q20 tech line as ffprobe reports it against the 05-T7 baseline (e.g. `hevc Main 10, yuv420p10le, 1920x1080, 24/1, mono`), the Higgsfield job ID and the credits spent, and the question «هل تعتمد النسخة النهائية لتدخل المونتاج؟».

**T4 — Day report** (Arabic headings, English IDs):
```text
تقرير Seedance — D9 (8 نوفمبر)
مسودات: 14 (مقبولة 5) · نهائيات: 4 · محجوبة: 1 (S07-SH03، رفض نصّي من Higgsfield، فئة InputTextSensitiveContentDetected — اقتراح تعديل في 01)
الإنفاق اليوم: 742 رصيد (≈ 33–37$) · الإجمالي: 2,610 رصيد · مسودات معتمدة تقترب من حد الأيام السبعة: S05-SH02 (عمرها 4 أيام)
طابور الغد: S09-SH01 (الأصعب) · S09-SH04 · S10-SH02
```

**T5 — Iteration log row** (`05-seedance/<S##>/<SHOT>/iterations.csv`, append-only)
```text
shot,version,takes,changed_variable,why,result,verdict,gen_ids
S03-SH02,v04,2,"event script: contact moved from 5 s to 5.5 s (playblast f133)","t1/t2 hands met early","both hit 5.4-5.6 s",APPROVE t1,G05-0151;G05-0152
```

**T6 — Fallback request** (5.3, Arabic): the shot, Q14 numbers for both takes, the options F1–F5 with their disclosure lines and share effect, and Claude's recommendation. The user's choice goes verbatim into `decisions.md`.

---

## Gate (what the user must approve)

- **G5-P, per shot, before the first draft:** the T1 packet (prompt, references, parameters, cost). Ask: «هل أرسل مسودتين بهذه الحزمة؟»
- **G5-D, per shot, before any final:** one draft take approved in the user's own words, logged in the ledger review cells (5.5), with 05b's G5b-C passed and the draft under 7 days old. Silence or a change of subject is not approval (old cinematic-pipeline rule).
- **G5-F, per shot, before 07 imports it:** the final passes Q1–Q20 and the user approves it in their words.
- **G5-ALL (D14):** every shot in the locked animatic is FINAL-APPROVED, CUT by the user, or explicitly assigned to a TEXT/post route. The ledger has no blank cells and no files missing from it. Every fallback (F2–F5) and every bitrate or derivative-codec decision (05-T7) is in `decisions.md`; every original is byte-identical in `08_EVIDENCE/RAW_SEEDANCE/` with its Higgsfield job record. Ask: «كل اللقطات النهائية جاهزة ومسجّلة. هل نعتمد تسليمها للمونتاج (07)؟»

## Common failures

| Symptom | Cause | Fix |
|---|---|---|
| The final differs from the approved draft | the 1080p final is a new consistent generation, not an upscale | 3-up review; `_f2` from the same draft, or re-draft |
| The final request is refused | prompt, `medias`, `duration`, `aspect_ratio` or `generate_audio` resent with `draft_job_id` | send only the 5.7 fields |
| The draft cannot be finalized | older than 7 days, or made in another Higgsfield account or workspace | re-draft; one account, workspace and project for the film |
| Two bills for one shot | a job was resubmitted after a transport timeout | `list_project_assets` + `jobs_wait`; never resubmit |
| Video lost | not downloaded in time; Higgsfield is not an archive (its API keeps request files 7 days) | download and hash in the same turn; while the job exists, try `get_project_asset_source` or the result URL from `jobs_wait` again |
| A web-app take is missing from the ledger | the user generated by hand and nobody read it back | the 5.4 read-back (`list_project_assets` → `get_project_asset_prompt` → `get_project_asset_source`) at the daily close |
| Music under the SFX | plain "no BGM" | list the music words at the start and end; audio edit or post strip |
| Burned-in subtitles | line words repeated, emotion on single words, or a reference clip with subtitles | "Miraj's line (warmly): {…}" once; clean references; "No subtitles." |
| Characters swap faces or voices | upload order differs from first appearance; a range mapping | reorder references; one subject per mapping line |
| Mouth ignores the ElevenLabs line | audio not bound to a speaker; no "reuse the speech" sentence | method A wording; then F1–F5 |
| Invented words or murmurs | short line in a long shot | script the silence (05b); pad by placement, not by speed |
| Grey look or capsule shapes survive | geometry words in the prompt; an edit verb routed it to editing | 04 clause verbatim; `mode: omni_reference` |
| Floaty or slow motion | playblast shorter than `duration` | playblast exactly G s; `duration` = G |
| Fingerprint textures in foliage | oversized reference image | next version with an uploaded ≤ 1920 px copy (logged derivative) |
| Glowing eyes | strong emotion words | "normal human eyes"; calmer words |
| Bubbling or echo artefacts in audio | water, wave or echo words in the prompt | remove them; 06 supplies water SFX |
| Face refusal on a chained clip or an extracted last frame | a trimmed, re-encoded or re-uploaded Seedance file read as a new real-looking face | the original by its job ID; for an opening frame, the route T1 proved (03 §3.4) |
| Colour shift in Premiere | decode of the Higgsfield original | 05-T7; a logged ProRes derivative, original untouched |
| Shot over budget | wording tweaks instead of a fix at the right layer | 5.6: redesign or re-block after 6 drafts |

---

## Sources and credits (checked 2026-10-30; Higgsfield route 2026-11-01)

- **Higgsfield MCP** (read 2026-11-01): `models_explore get seedance_2_5` (modes, settings, draft and `draft_job_id`, media roles, aspect ratios) and the tool descriptions of `generate_video`, `generate_video_batch`, `jobs_wait`, `show_generation_by_ids`, `job_display`, `list_project_assets`, `get_project_asset_prompt`, `get_project_asset_source`, `media_upload`, `media_confirm`, `media_upload_widget`, `manage_reference_elements`, `create_project`, `create_folder`, `list_workspaces`, `balance`, `transactions`. Credit costs measured on the user's account with `get_cost: true`. No generation has been run yet; everything marked `[UNVERIFIED]` is settled by the D1 tests.
- **BytePlus ModelArk official docs**, read as Markdown (`ai.byteplus.com/ark/region:ap-southeast-1/docs/<page>.md`), used for model and prompt facts only (the API route is not used, 5.0):
  - Pages: the Seedance 2.5 tutorial (task types, Draft mode, limits); the Seedance 2.5 and 2.0 prompt guides and FAQ; error codes (used to classify refusals, 5.9); portrait-asset guide; C2PA Content Credentials guide.
  - No open licence is stated, so these are paraphrased. Short prompt-syntax strings ("Use @Image1 as the first frame.", "Please note that this is not video editing.") and the music word list are reproduced as functional syntax.
- **sd25-pe 0.1.1**, the official BytePlus Seedance 2.5 prompt optimizer:
  - Archive `arkdocs-en.tos-ap-southeast-1.volces.com/skills/artifacts/video-generation/sd25-pe/0.1.1/sd25-pe-0.1.1.zip`, sha256 `c9c765aa…7b97cba`, verified.
  - No licence file, so paraphrased (template order, one-subject mapping, `【Unused Assets】`, the reuse-dialogue rule, edit scope closure, motion-slot replacement, extension rules, the checklist ideas).
  - Do not install it with its self-update block (research security flag).
- **scenario-labs/skills**, MIT (commit 5d68b48, 2026-10-30): `scenario-seedance`, `scenario-seedance-drafts`, `scenario-blender-blockout/references/handoff.md`. Used for:
  - the voice-binding quote and the conditioning rule;
  - draft economics and the instruction to complete only the take you keep;
  - review by sweep, close-ups and side-by-side;
  - the output-filter field notes and the gait clause via 04.
- **byteplus-sdk/ark-cli `arkcli-gen`**, Apache-2.0 (commit 79c8ff6, 2026-10-29): explicit roles on every reference; never resubmit on timeout (the same rule Higgsfield's `generate_video` states).
- **calesthio/openmontage `seedance-2-5`**, AGPL-3.0 (commit 195eab2, 2026-10-28). Paraphrased only, as inspiration: named locks, state monotonicity, substitute-don't-forbid, character-sheet and voice-conditioning ideas, iteration discipline. Its 480p/720p-only claim and its aspect-ratio-in-prompt habit were not adopted.
- **friscodanconia/greybox-director**, MIT (commit c61577d, 2026-07-26; Seedance 2.0 era). Paraphrased: the support check, max-takes-then-redesign, colour-role mapping, and judging the spectacle, not only the checklist. Its frame-0 restyle is not used for faces, because a restyled face is not a trusted input.
- **Route research for this project** (BytePlus vs Higgsfield, 2026-10-30) and Higgsfield changelog summaries found by search (Draft Mode 22 Sep 2026; credit figures conflict). Facts only.
- **Premiere decode issues** (H.264 4:4:4 colour shifts): Adobe community and Puget Systems reports found by search; no official confirmation, hence test 05-T7 on the Higgsfield original.
- **The user's own skills, carried over:**
  - `seedance-2-5-prompts`: the formula, per-reference binding, exclusions, bracket syntax, the language formula, no parameters in prose.
  - `seedance-director`: the anti-slop list, ≤ 3 tracked characters, no reflections, no exit and re-entry, micro-expressions as physics, named inserts.
  - `cinematic-pipeline`: Arabic gating and "silence is not approval".
  - `higgsfield-generate`: Higgsfield audio-reference flag and job retrospection (the read-back of jobs in 5.4).
  - Dropped as outdated: Seedance 2.0 defaults, Chinese-first prompts, `15秒。21:9。` endings, "8K IMAX", and always attaching a start frame.
