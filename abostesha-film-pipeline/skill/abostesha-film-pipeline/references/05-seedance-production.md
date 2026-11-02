# 05 — Seedance Production: Draft, Approve, 1080p Final (Step 5)

**Purpose.** Turn every approved shot into final picture with Seedance 2.5 alone, generated in the film's Higgsfield project. Each shot gets one prompt built to ByteDance's official contract, its Blender playblast as the motion reference, the 03 sheets as identity references, the locked 02 style prefix, SFX-only sound and, on dialogue shots, lips bound to the user's ElevenLabs take.
**Method.** Make a 480p draft first (`draft: true`); the user approves one take; then finalize that same take at 1080p with its Higgsfield job ID (`draft_job_id`). Download every output the moment it exists, log it in the ledger, QC it, and iterate one variable at a time.
**Rule.** Talk to AboStesha in Arabic. Every prompt, file name, ledger cell (except their verbatim approval words) and QC note is in English. This module owns the assembled prompt, handle spelling, the `generate_video` parameters, music and subtitle suppression wording, and the draft and final runs. `05b-acting-direction.md` owns the PERFORMANCE and DIALOGUE blocks inside the prompt.
**Pilot first (decision 2026-11-02).** After the script and the style are locked and the assets of the two pilot scenes are approved (03 G2-P), Claude produces those two scenes end to end with the final method of this module: packets, drafts, 1080p finals, the continuity chain, then rough sound (06) and rough grade (07). The open tests run inside the pilot (5.11). Until the user approves a test's result, the current rule it would change stays in force. When the user approves both pilot scenes, the prompts, reference roles and order, parameters and look block used there are frozen in `05-seedance/RECIPES_v1.md`, and the whole film is produced on exactly that basis. "Pilot" names an internal production test only, never the film (00 F8).
**Study update (2026-11-02).** The prompt slots, role vocabulary, lint, continuity pair, fix-in-place order, long-take tails, one-line mode, dialogue locks, one-shot chain, transition and non-human blocks below are the approved proposals P05-1 to P05-14 of the cross-study playbook (`prompt-library/studies/2026-11-02_CROSS-STUDY.md` §3B, §3C, §4.4), learned from 12 public Higgsfield films (method only; credits in Sources). "D-n" = the playbook's §4.0 decisions, applied with its recommended choice; "T-x" = a pilot test (5.11).

Tags: `[OFFICIAL]` ByteDance/BytePlus Seedance 2.5 docs (model and prompt facts), read as Markdown on 2026-10-30 · `[HF]` Higgsfield MCP tool descriptions and `models_explore get seedance_2_5`, read 2026-11-01 · `[FIELD]` a practitioner skill's tested rule · `[STUDY]` seen in the 12 studied Higgsfield films, with the count of films (n/12) or jobs · `[HOUSE]` our default · `[UNVERIFIED]` confirm on the first live job · `[TESTED]` measured on the user's Higgsfield account with `get_cost` (no generation) · `[PILOT]` a pilot test; the current rule holds until the user approves its result.

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
| The two pilot scenes and their approved assets (G2-P); the frozen production look; the asset recipe cards | SKILL.md (two-scene pilot), `02-style-prefix.md` §2.13, `03-assets-images.md` §3.5 | 5.11 |
| Start frames and keyframes (identity-corrected), non-human scale sheets, transition STARTING / TARGET plates and seam stills | `03-assets-images.md` routing row 10, §3.1.9, §3.1.10 | 5.1, 5.2 |
| Story job of the shot (what it does in the film); one-shot or long-take scope decisions | 01 beat sheet; the shot's row in `SLA_SHOTS.csv`; 04 animatic gate | 5.2, 5.8b |
| Study templates and evidence | `prompt-library/seedance-action.md`, `seedance-dialogue.md`, `seedance-oneshot.md`, `seedance-transition.md`; `prompt-library/studies/2026-11-02_CROSS-STUDY.md` | 5.2, PT1–PT4 |
| After the pilot approval: `05-seedance/RECIPES_v1.md` (the frozen Seedance basis) | 5.11 | every later shot |

## Hard rules

1. **Seedance 2.5 only** for final picture: Higgsfield model `seedance_2_5` (label "Seedance 2.5", provider Bytedance, as `models_explore` shows it), pinned in `version-pins.md` (ledger L.3). Never mix in Seedance 2.0 shots (`seedance_2_0`) without the user's yes. The official FAQ warns that 2.0 and 2.5 have visibly different aesthetics `[OFFICIAL]`.
2. **Draft first, always (D-8, kept).** A final exists only as a `draft: true` 480p job → 1080p finalized from that job with `draft_job_id`, from a draft the user approved in their own words. Never re-run an approved prompt at 1080p: that is a new take, not the approved one `[FIELD: scenario-labs]`. The studies agree: no studied film used draft mode (0/12), and re-running a low-resolution winner at 1080p made a different take; Kimti, Fukushima and In Passing kept the low-resolution take for its performance `[STUDY]`. Day-1 test T3 proves that finalize keeps the approved performance; the pilot finals prove it at scale.
3. **One job per generation (D-3, kept).** Each generation has one primary task (reference generation, edit or extension), one shot with one camera and no internal cuts, and one speaking face. 04 already gives every shot its own camera. Multi-shot generations land planned cuts poorly: in one community benchmark only about 73% of 16 cut boundaries fell within ±0.6 s (04 research). Eight of the 12 studied films wrote cuts into the text and mined the result as coverage (The Breach, Kimti, LEAK, TOKYO 4:17, In Passing, CONTROL, Buzkashi, UNPROMPTED); Fukushima and SÉKOU never did `[STUDY]`. The rule stays for hero, dialogue and blocked shots. A written-cut "coverage rush" for inserts or atmosphere is pilot test T-F (5.11); until the user approves its result, no prompt writes a cut.
4. **No parameters in prose.** Aspect ratio, duration, resolution, fps and the sound switch go in the `generate_video` params only (`aspect_ratio`, `duration`, `resolution`, `generate_audio`) `[OFFICIAL: sd25-pe]`. Before every submit Claude checks the prompt for `16:9`, `1080p`, `fps` and similar words.
5. **Never resubmit a job whose outcome is unknown.** On a transport timeout the submission may have gone through: find the job (`list_project_assets` in the scene folder, newest first) and wait on it with `jobs_wait`. A second submit bills a second video `[HF: generate_video]`.
6. **Download, hash and log in the same turn** a job completes. The byte-identical original goes to the scene's `drafts/` or `finals/` folder on Drive and, for finals, to `08_EVIDENCE/RAW_SEEDANCE/` (ledger L.0b). Higgsfield is never the only copy: its API keeps request files only 7 days, and result-URL lifetimes are unpublished. Ledger rule 4.
7. **No music from Seedance.** It makes SFX and ambience, plus speech only where a lip-sync shot needs it. Score comes from `06-music-and-sfx.md`.
8. **Never evade moderation.** No cropping, blurring or restyling a face to slip past the filter, and no wording tricks. Change the route or the content (5.9; 03 §3.3 rule 1).
9. **Provenance untouched.** Keep the original files as downloaded from Higgsfield, never remux them, and never crop a watermark (Terms cl. 5.6). `seedance_2_5` on Higgsfield has no `watermark` parameter: record in T4 what the original carries (visible mark, C2PA, metadata) and disclose it.
10. **Finals only in the film's Higgsfield project**, through the MCP or by the user in the Higgsfield web app inside the same project and account. Keep one account and one route per character for the whole film; a draft is finalized in the account that made it.
11. **Holdback.** References go in privately: uploads through `media_upload` → PUT → `media_confirm`, or Higgsfield job IDs. Never a public link, an "anyone with the link" share, or a published Higgsfield project before the holdback ends.
12. **One variable per iteration**, logged (5.6). A defect copied from the playblast is fixed in Blender (04), not in the prompt. **Fix before regenerate:** a take that is right except for one thing gets a one-change edit or a forward extension before any new version (5.6, 5.8); 8 of the 12 studied films did this and 7 have such a result in the film `[STUDY]`.
13. **G-rated content.** Re-check every beat 01 flagged before spending. A moderation block on violence, substance or IP words is a content signal (5.9).
14. **Lint before every submit** (5.4): handles match the attachments, one role line per handle, no placeholders or residue, the prompt ends where intended. Seven of the 12 studied films recorded silent tag failures (lost tags, blank or duplicate tokens, wrong ordinals, a prompt cut at 4,500 characters) `[STUDY]`.
15. **Pilot first, then the same basis** (decision 2026-11-02). Production shots outside the two pilot scenes wait for the pilot approval. After it, every shot is built from `05-seedance/RECIPES_v1.md` (5.11): the same prompt template and slot order for its shot type, the same role wording and reference order, the same parameters and the same look block. A different recipe is a new recipe version with the user's yes.
16. **Method only from the studies.** No character, face, design, prop, location, line or story of a studied film is copied; only their methods and short functional wording (role lines, locks), credited in Sources.

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
| Model limits (ByteDance's official API reference; Higgsfield publishes none, so stay inside them) `[OFFICIAL]` | 30 images (< 30 MB, 300–6000 px, aspect 0.4–2.5) · 10 videos (mp4/mov H.264/H.265, 2–30 s each, 30 s total, ≤ 200 MB, 24–60 fps, 407,696–8,295,044 px) · 10 audio (wav/mp3, 2–30 s each, 30 s total, ≤ 15 MB) · prompt ≤ 1,000 English words recommended. House default (D-7): ≤ 1,000 words; only extension links and non-human shots may run longer, with the word count logged in the packet (prompt length guide, 5.2). The Breach (median 1,291 words), HUNGER (1,316), CONTROL (2,563) and THREAD (2,612) reached their films above it `[STUDY]` |
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
| 05-T9 Draft on an edit task | one audio-only edit (`mode: video_edit`) drafted with `draft: true`, then finalized; then one forward `video_extension` from a 1080p final drafted and finalized; then one one-change edit made on a 480p draft and finalized, compared at 100% with a direct final of that draft | if refused, edits and extensions run direct at `resolution: "1080p"` with the user's yes. If the edit made on a draft finalizes softer than a direct final, fixes in place run on the approved 1080p final only (5.6) |
| 05-T10 Web-app round trip | the user makes one draft by hand in the Higgsfield web app inside `99_TESTS`; Claude reads it back (`list_project_assets` → `get_project_asset_prompt` → `get_project_asset_source`) and finalizes it through the MCP with `draft_job_id` | prompt and settings read back verbatim and the source downloads. If the MCP cannot finalize a web-app draft, web-app drafts are finalized in the web app and logged the same way |
| 05-T11 Mixed roles and handle order (D-1, D-14) | after T1, one two-character `omni_reference` draft on the face route T1 proved, with `start_image` plus `video_references` and two `image_references`; log any `adjustments` and the mode the job reports. Run the same draft twice: once with each face re-described in one short line of the prompt text, once with identity left to the references only | the job is accepted, and each face lands where its `@ImageN` handle says (order of `image_references` = handle number). If `start_image` cannot combine with references, opening-state shots use 5.1's reference-mode wording. If Higgsfield binds `<<<image_N>>>` and not `@ImageN`, the whole film switches form (never per prompt). Record which face text form held identity better (TOKYO 4:17 and The Breach never re-described faces; CONTROL and Buzkashi always did, and both worked `[STUDY]`) |

The pilot tests T-C, T-D, T-E and T-F (and 04's T-G, drafted here) run inside the two-scene pilot, not on D1 (5.11).

### 5.1 Build the shot packet

**Entry: AboStesha asks for one shot's prompt** («سوي لي برومبت سيدانس للمشهد 4 لقطة 2»).
1. **Resolve the ID.** «المشهد 4 لقطة 2» means scene `S04`, shot `SH02`, so `S04-SH02` (the frozen scene IDs from 01 §1.1.3, zero-padded). Confirm the row in `ledger/SLA_SHOTS.csv` or 04's shot list. If it is missing, or S04 was renumbered, show the S04 rows and ask which shot they mean.
2. **Check the inputs** in the table above and show them as a ✓/✗ list in Arabic: 04 hand-off row and `_PB_` (or the STILL/TEXT triage), 03 approved references and the T1 route, `prefix/seedance.txt` and the shot's variant, 05b's approved bible (G5b-A) and the S04 scene read (G5b-B) with the beat map, and for dialogue the 01 line IDs, the selected takes and the T2 result.
3. **All present:** build the packet (below), write the prompt (5.2, plus 5.3 for dialogue), run the 5.4 lint and show the T1 packet card. Ask the G5-P question. Nothing is submitted and nothing is billed before their yes. Before G5-PILOT, only shots of the two pilot scenes get packets (rule 15); a shot outside them is shown as a PREVIEW (step 4) with the note that it waits for the pilot. After G5-PILOT, the packet is filled from the shot type's card in `RECIPES_v1.md` (5.11).
4. **Something missing:** say what is missing and which earlier gate owns it (SKILL.md §3, jumping ahead). If they still want to see the prompt now, write it as a **PREVIEW**: every missing input stays a visible slot such as `{{MISSING: 02 prefix/seedance.txt R-DAY}}` or `{{MISSING: 05b PERFORMANCE block, S04 scene read not approved}}`. Never fill a slot from memory or invention: not the 02 look text, the 04 blockout clause, 05b blocks, asset handles or line text. A PREVIEW is saved as `prompt_v00_PREVIEW.txt`, it is never submitted (not even with `get_cost`), it gets no ledger row, and it is never pasted into the Higgsfield web app.
5. The 05b blocks (PERFORMANCE / DIALOGUE) come from 05b §5b.3 and its snippets A–G; 05 only places them in the slot.

**Folder** (mirrors 04; git tracks `.txt`, `.md`, `.csv`; binaries are git-ignored, generated in the Higgsfield scene folder and kept in the Drive tree, ledger L.0b):
```text
films/01-second-life-ascent/05-seedance/S03/S03-SH02/
  prompt_v03.txt            (the exact submitted text; its sha256 goes in the ledger)
  refs_v03.md               (each @handle → file, asset ID, Higgsfield job ID / media_id / element_id, role, what it supplies, what it must not supply)
  qc_v03_t2.md              (5.5 checklist, Claude's notes, the user's verdict)
  lint_v03.md               (the 5.4 lint, every line ✓, and the prompt's word count)
05-seedance/S03/chain_log.csv  (one row per continuity pair, extension link, edit pass or in-fill: template T8; mirrored into SLA_SHOTS.csv per ledger L.4)
Drive 04_SCENES/S03_<slug>/drafts/  SLA_S03-SH02_SD25-DRF_v03_t1.mp4 … _t2.mp4   (480p, never imported into Premiere)
Drive 04_SCENES/S03_<slug>/finals/  SLA_S03-SH02_SD25-FIN_v03_t2.mp4 + _LF.png   (1080p final, byte-identical copy also in 08_EVIDENCE/RAW_SEEDANCE/; last frame extracted with ffmpeg, 5.7)
```

**Pick the generation mode per shot** (from 04's triage):

| 04 mode / need | Seedance request (`generate_video`, `model: seedance_2_5`) | Constraints `[HF]` |
|---|---|---|
| BLOCK (playblast) | `mode: omni_reference`: `@Video1` = `_PB_` (role `video_references`), identity and location images (`image_references`), optional `@Audio` lines (`audio_references`) | `aspect_ratio: "16:9"`; `duration` = G (whole seconds, 4–30) |
| STILL (layout still: `STILL-MRK`, floor plan or `STILL-SKT`, 04 §4.12) | `mode: omni_reference` with images (+ audio), the still bound by its BLOCKING STILL or POSE SKETCH role line (5.2); camera and drift written in the prompt | same |
| Shot must open on an exact state (continuous action) | **reference wording:** the previous final's `_LF.png` (uploaded) as `@Image1` with role `image_references`, plus the sentence `Use @Image1 as the first frame.` Or the same frame with role **`start_image`**; whether `start_image` combines with the playblast and other references in one job is 05-T11 | the frame is already 16:9, so `aspect_ratio: "16:9"`. With references only, frame one follows the reference world unless an image anchors it `[FIELD: scenario-labs]`. A frame showing a face goes in only on a route T1 proved for faces (03 §3.4) |
| Shot continues a running scene (same place, the action carries on across the cut) | `mode: omni_reference` with the **continuity pair** (below): the previous approved final's `_LF.png` as LAST APPROVED FRAME (`image_references`) + the previous approved final by job ID as PREVIOUS APPROVED CLIP (`video_references`) | video references ≤ 30 s in total: previous final + playblast must fit, else see the pair rules below |
| Text-blocked long take (LONG: STILL or TEXT blocking, no playblast) | `mode: omni_reference`; `duration` G = 20–25 s allowed (D-10); action written for about 80% of G and a tail left (below) | never for a BLOCK shot: playblast-driven shots keep 04's 4–15 s cap |
| Approved start frame that already carries composition, light and wardrobe (03 routing row 10) | `start_image` (or `image_references` with the START FRAME role) + the **one-line mode** prompt (5.2) | the frame is 16:9; a face in it only on the T1 face route |
| Fix inside an existing take | `mode: video_edit` (5.8), before any new version (5.6) | `duration` and `aspect_ratio` ignored; billed by the source's duration; source 4–30 s |
| Need more head or tail, or the next beat of an approved take | `mode: video_extension` (5.8) | `extension_mode` `forward` or `backward` required; `aspect_ratio` ignored; source = the approved 1080p final by job ID |
| One-shot sequence (scope chosen at 04's animatic gate) | seed take + `video_extension` links (5.8b) | about 8 drafts per link; source rule D-4 |
| Join two approved finals with generated frames | black-gap in-fill, `mode: video_edit` (5.8) | **pending pilot test T-C (b)**: the source is an NLE export, which the current rule forbids |
| Place A becomes place B inside one take | `mode: omni_reference` + the transition block (5.2, PT4b) with 03 §3.1.10 STARTING and TARGET plates | no edit verbs |
| Written-cut coverage rush (inserts, atmosphere) | only inside pilot test T-F (5.11) | rule 3 holds until approved |
| TEXT (HUD, inserts) | none: post graphics (04 §4.1, 07) | counts as non-Seedance (00 §0.4) |

**Reference set rules:**
- **Order by first appearance.** List character images in `medias` in the order the characters first appear and number the handles to match. This is the official fix for swapped identities and voices `[OFFICIAL FAQ]`. That the order of `image_references` sets the `@ImageN` number on Higgsfield is checked on D1 (05-T11).
- **Hold the working range.** Use 1–8 subject images and 1–5 audio or video subjects of about 5–10 s each `[OFFICIAL]`. The 50-asset cap is a ceiling, not a target.
- **One subject per asset.** Identity comes from 03's `turn3` (face on one panel only) or the route T1 proved (a reference element, or a first frame generated inside Higgsfield). Locations come from face-free plates; props from their sheets. Wardrobe states are separate assets (03), never prose. One readable face per sheet and flat light stay 03's law; a sheet whose face panel read flat comes from 03's one fallback (a soft 45° key, TOKYO 4:17) and is used the same way (D-13).
- **One role per reference.** Every handle gets exactly one role line from the 5.2 vocabulary, with its "only … / not …" limit. Eleven of the 12 studied films wrote one role per reference `[STUDY]`.
- **At most two character identities per generation** (In Passing's own cap: never more than 2 character Elements in one of 886 jobs `[STUDY]`; 03 §3.1.1). Anonymous extras live in the text (05b §5b.8), never as sheets.
- **Never upload an unassigned asset.** If one is attached anyway, list it under `【Unused Assets】` (sd25-pe).
- **Faces.** Only the route that passed T1 on Higgsfield `seedance_2_5` is allowed (03 §3.3–3.4): the approved sheet by its job ID as `image_references` or `start_image`; or, if faces are refused, a completed reference element (`<<<element_id>>>` in the prompt) or a first frame generated inside Higgsfield from the approved sheets and approved by the user, passed as `start_image` by its job ID. Element route or raw images, and whether the prompt text re-describes the face, are decided by T1 and 05-T11 and logged (D-14); 7/12 studied films used Elements and 5/12 raw images, three of the four favourites raw `[STUDY]`.

**Reference hygiene:**
- **Images.** Approved sheets made in Higgsfield go in untouched by their job IDs. Larger AI images can cause fingerprint-like textures in foliage and grass `[OFFICIAL FAQ: ≤ 1920 px on the long edge]`: if Q18 shows them, the next version's one variable is an uploaded ≤ 1920 px copy, logged as a derivative. Before uploading any JPEG, check its chroma subsampling with ffprobe and convert non-standard files with `ffmpeg -i in.jpg -pix_fmt yuvj420p out.jpg` (they fail with HTTP 400 on the official API `[OFFICIAL FAQ]`; Higgsfield's behaviour is unknown).
- **Playblast.** Use only an APPROVED `_PB_` that passed 04's ffprobe check: h264, 1920×1080, 24/1, exactly 24·G frames, no audio stream. A video reference does not change the Higgsfield price `[TESTED]`.
- **Uploads.** Every file made outside Higgsfield (playblast, audio, an extracted last frame) goes in through `media_upload` → curl PUT to `upload_url` (HTTP 200) → `media_confirm` with its `type`; only if the file cannot be read in the sandbox, `media_upload_widget`. Record each `media_id` in `refs_vNN.md` and the ledger. Never re-upload a Higgsfield output: pass its job ID, so the link to the original job is kept.
- **Audio** for dialogue shots: see 5.3.

**Continuity pair** (P05-4; for a shot that continues a running scene). Eleven of the 12 studied films fed approved output back as a reference; SÉKOU attached the last approved frame as an image and the previous approved clip as video in 5 of 13 jobs `[STUDY]`.
1. **LAST APPROVED FRAME:** the previous shot's approved final `_LF.png` (5.7), uploaded (`media_upload` → PUT → `media_confirm`), as `image_references`. A frame that shows a face goes in only on the face route T1 proved (03 §3.4); otherwise use a face-free frame grab from that final, logged as a derivative, or leave the image out.
2. **PREVIOUS APPROVED CLIP:** the previous approved final, by its Higgsfield job ID, as `video_references` (never a trimmed or re-uploaded copy until pilot test T-C is approved, D-4).
3. **Role lines** (5.2 vocabulary, "carry on" wording, D-5): `@ImageN is the LAST APPROVED FRAME of {{shot}}: same place; copy its geometry, light direction and grade; not its exact pose.` and `@VideoN is the PREVIOUS APPROVED CLIP {{shot}}: carry on its camera position, lens, handheld character, light, grade and the positions of everyone in it; do not restage.`
4. **Fit inside the limits.** Video references total ≤ 30 s `[OFFICIAL]`. If the previous final plus this shot's playblast pass 30 s, keep the playblast and carry the last frame only; log the choice.
5. **Log both** in `chain_log.csv` (T8: `link_type` LASTFRAME+CLIP, parent take, source job ID, grab second) and in the ledger row's references.

**Duration and tails** (P05-6; D-10):
- **BLOCK shots** (playblast-driven): `duration` = G exactly, 4–15 s (04 rule 3). No tail: the playblast fixes the timing.
- **Text-blocked long takes** (no playblast): G may be 20–25 s. Write action for about 80% of G; the last range is a hold or a continuing motion that 07 trims as a handle. SÉKOU wrote 20 s of action, generated 25 s and once used all 25 s; TOKYO 4:17 generated 30 s for a 26 s edit `[STUDY]`. The 30 s draft of day-1 test T6 (00 §0.8) shows the longest clip that holds; anything over 25 s needs the user's yes.
- **A take that will be extended** ends mid-motion with no tail and no settle (5.8b).

### 5.2 Write the prompt

Build every prompt in this order (P05-1: the 05 contract plus the slots the studied films shipped). Fill the slots; delete unused sections; never edit the text of 02's blocks or 04's clause. The filled shot-type templates are PT1–PT4 (Output templates).

```text
Audio policy: the soundtrack holds only the diegetic sounds named at the end[, plus {{NAME}}'s speech from @Audio1]. No music, background music, BGM, score, instrumental, melody, synth effects, ambient pad, drone, stinger or rising tone at any moment. No subtitles.

【Generation Goal】
{{REFRAIN, only after a draft lost a persistent behaviour: "Throughout the whole take {{the lights flicker / the camera keeps shaking / rain keeps falling}}."}}
Generate one continuous {{shot size}} shot: {{subject}} {{principal event}} in {{place}}. Story job: {{what this shot does in the film, from 01's beat sheet}}.

【Reference Asset Roles】
{{one role line per handle, from the vocabulary below, in handle order}}
@Image1 is {{CHARACTER A}}, IDENTITY (state {{S#}}): use only face, hair, build and {{costume phrase, fixed wording}}; not the grey background, the studio light, the pose or the panel layout.
@Image2 is {{LOCATION}}, LOCATION ONLY: use only architecture, materials and light direction; not its framing; no people from it.
{{04 hand-off blockout clause, verbatim, for @Video1}}
{{5.3 binding sentence for @Audio1, dialogue shots only}}
These references are knowledge, not shots: never cut to, settle on or reproduce a reference composition.
{{3 or more images: "Do not reproduce the reference images as fixed opening frames, animate them one after another, or transition between them as a slideshow."}}

【Subjects and Relationships】
{{COUNT LOCK: exactly N people, no one else at any point, no doubles in glass or reflections}}. {{positions relative to fixed objects}}. {{SCREEN DIRECTION LOCK}}. {{side-named mark: "the {{mark}} stays on {{NAME}}'s LEFT {{feature}}; do not mirror"}}. {{NON-HUMAN block, robot or creature shots only}}. {{CROP-SAFE sentence, only if D-9 chose a letterbox}}

【Event Script】
0-{{t1}} seconds: Frame one is already running: {{who, where, mid-what}}; {{one action}}; at the end, {{visible state}}.
{{t1}}-{{t2}} seconds: {{"Still the same shot:" in takes of 10 s or more}} from {{state}}, {{one action}} ... (ranges continuous, non-overlapping, ending at G)
{{t2}}-{{G}} seconds: {{"Still the same shot:"}} {{one action}}. FINAL FRAME: {{framing, who where, prop state}}.   ← or, for a take that will be extended: "{{subject}} is still {{moving}}; {{next beat}} has not begun."
{{05b PERFORMANCE block / DIALOGUE block}}

{{CAMERA sentence: size + angle + move + subject + start → end + "about a NN-degree field of view" + the variant's CAMERA form from 02 (operator or locked) + "Every new framing is reached only by travel; the camera never passes through walls, glass or bodies." + after a fast move: "it lands on a readable beat on {{face}} before moving again."}}

The visuals feature {{02 core + variant, verbatim}}.
{{02 CONTINUITY line, verbatim}}

【Maintain Consistency】
Keep {{each identity line, side-named mark and costume phrase, repeated verbatim}}, {{prop count and ownership}}, {{screen direction}}, {{light direction}} stable{{; STILLNESS LOCK: what never happens}}.
{{Pilot test T-E drafts only: up to five "<visible failure> = a failed take." sentences (02 hard rule 7)}}

Audio includes <{{SFX 1, one per bracket, in event order}}>, <{{SFX 2}}>. {{02 AUDIO line, verbatim}} No music of any kind.
```

**What each new slot does** (all `[STUDY]`):
- **Story job** (SÉKOU, in 12 of 13 prompts): one plain sentence on what the shot does for the film. It is not an emotion label (05b ground rule 2).
- **Knowledge, not shots** (THREAD, 117 prompts): stops mid-take cuts to a reference's composition. **Anti-slideshow** (Kimti): with 3 or more images.
- **Frame one is already running** (opening state in at least 9/12; In Passing in 883 of 886 prompts) and **FINAL FRAME** or a continuable end (at least 8/12; The Breach 65% of prompts). A shot that cuts away gets FINAL FRAME; a source for an extension ends mid-motion (5.8b).
- **"Still the same shot:"** (The Breach; SÉKOU's "NO CUT" closed every stage, 39 times) opens every range after the first in takes of 10 s or more. SÉKOU still got one unplanned cut near a stage boundary, so Q10 checks for it.
- **Identity repeated in 【Maintain Consistency】** (SÉKOU states identity three times per prompt; CONTROL closes on a restating checklist): copy the identity lines, side-named marks and costume phrase verbatim from the role lines and the continuity bible (ledger L.6).
- **Crop-safe sentence** (only if the user chose a letterbox under D-9; 02 §2.1 step 4 recommends none): "Compose for a centred 2.39:1 crop: faces, eyes and the action stay inside the central band of the frame." The Breach and TOKYO 4:17 protected their crops this way `[STUDY]`. The generation stays `aspect_ratio: "16:9"`; 07 cuts the window.

**Role vocabulary** (P05-2). One line per handle, in handle order, always with an "only … / not …" limit. Wording adapted from the lines that shipped in finals (The Breach, SÉKOU, Fukushima, CONTROL, HUNGER, Buzkashi, THREAD, Kimti) `[STUDY]`; the paste-ready set is in `prompt-library/seedance-action.md` "Reference role block".

| Role | Line (fill the slots) | Use |
|---|---|---|
| IDENTITY | `@ImageN is {{NAME}}, IDENTITY (state {{S#}}): use only face, hair, build and {{costume phrase}}; not the grey background, the studio light, the pose, the expression or the panel layout.` | every character sheet; a multi-angle pack: "@Image1–@Image3 are ONE person, {{NAME}}: … Use whichever angle matches the head position in each moment." (SÉKOU) |
| LOCATION ONLY | `@ImageN is {{LOCATION}} ({{time of day}}), LOCATION ONLY: use only architecture, materials and light direction; keep its geometry; not its framing; no people from it.` | plates (03 §3.1.6) |
| PROP | `@ImageN is the {{prop}}: its exact look and colour wherever it appears; only one {{prop}} exists.` | prop sheets; two states of one prop: "one object at different times" (Fukushima) |
| START FRAME | `@ImageN is the START FRAME: the first frame of this video matches it.` (or role `start_image`) | approved start frames (5.1) |
| LAST APPROVED FRAME | `@ImageN is the LAST APPROVED FRAME of {{shot}}: same place; copy its geometry, light direction and grade; not its exact pose.` | continuity pair (5.1) |
| PREVIOUS APPROVED CLIP | `@VideoN is the PREVIOUS APPROVED CLIP {{shot}}: carry on its camera position, lens, handheld character, light, grade and the positions of everyone in it; do not restage.` | continuity pair; SÉKOU's literal "continue" wording is pilot test T-D (D-5) |
| BLOCKOUT (04) | 04's hand-off clause, verbatim | BLOCK shots |
| PATH GUIDE (04) | 04's T3 clause v1-PG, verbatim ("@Video1 is a PATH GUIDE only: take {{subject}}'s route, the timing marks and the layout of {{place}} …; not its stiff camera, not its empty rooms, not its placeholder shapes") | only on shots 04 hands off with v1-PG, i.e. inside pilot test T-G or after the user approves it (04 §4.14) |
| GESTURE REFERENCE (04) | `@VideoN is a GESTURE REFERENCE: it demonstrates the procedure only. Copy only the hand path, the order of moves and which end of the {{object}} is worked. Do not copy the person, their clothes, the room, the table or the light; the hands are {{NAME}}'s hands from @ImageM.` | `+GEST` shots (04 §4.13); a second video reference, inside the 30 s total |
| POSE SKETCH | `@ImageN is a POSE SKETCH: pose and spatial reference only; its lines, strokes, colour patches, paper texture and drawing style must not enter the image.` | `STILL-SKT` shots (04 §4.12); `image_references` only, never `start_image` |
| BLOCKING STILL | `@ImageN is a BLOCKING STILL: the {{colour}} marker is {{NAME}}, the {{colour}} marker is {{NAME}}; the coloured markers are annotations, not objects; framing comes from the prompt.` | `STILL-MRK` and floor-plan shots (04 §4.12) |
| SCALE SHEET | `@ImageN is the {{NAME}} SCALE SHEET: use it only as the scale-continuity reference; {{NAME}} stays about {{cm}} cm tall next to {{lead}}.` | robots and creatures (03 §3.1.9; HUNGER, 17 prompts) |
| STARTING / TARGET LOCATION | `@ImageN is the STARTING LOCATION: geometry and light only.` / `@ImageM is the TARGET LOCATION, a full environment the viewer stands inside; it resolves around {{subject}}, never as a flat picture.` | transitions (PT4b; 03 §3.1.10) |
| DIALOGUE AUDIO REFERENCE | 5.3's binding sentence | dialogue shots |
| GRADE SLOT (02) | 02 §2.7's grade-slot line, verbatim | only on the route pilot test T-B approves (02 §2.13) |

**Handles (D-1: kept).** Write `@Image1`, `@Video1`, `@Audio1`: no space, numbered by the order of the `medias` entries within each media type (`image_references`, `video_references`, `audio_references`; 05-T11 confirms the mapping on Higgsfield). This is the form in the official API examples and sd25-pe; the prompt guide also shows `@Image 1`. The studied films stored `<<<image_N>>>` and each form worked when it pointed at the right file `[STUDY]`; one form per prompt, always, and if 05-T11 shows Higgsfield needs the other, the whole film switches. Never mix the two forms in one prompt. Every module in this skill (03 role lines, 05b snippets, 06 and 07 edit templates) already uses the unspaced form. Never write a job ID or `media_id` in the prompt. The only ID a prompt may hold is a reference-element placeholder `<<<element_id>>>` on the element route (03 §3.4), which the backend rewrites to `@<element-name>`; never type that `@name` form yourself. Label each element by its role in the text ("`<<<element_id>>>` (Miraj) …"): in LEAK the written label won over the element's own name `[STUDY]`.

Why this shape:
- The labelled sections and the one-subject-per-line mapping follow sd25-pe 0.1.1, the official compiler.
- The audio constraint appears at the start and again at the end, with the music words listed out. That is the official fix for BGM leaking through a plain "no BGM" `[OFFICIAL FAQ]`.
- `【】` is also Seedance's subtitle syntax. Check drafts for rendered label text (Q19). If a label ever renders, switch that shot to plain `Generation goal:` labels and log the change.
- **No edit or extension verbs in a reference prompt.** The model re-classifies the task from the prompt even when the request is a reference task, and on the official API a mismatch fails with `TaskTypeMismatch` `[OFFICIAL]`. On Higgsfield keep `mode: omni_reference` and log any error or mode adjustment the job reports. Keep out *edit, add, remove, delete, replace, change, modify* and *extend, continue, continue from*. "Continuous" is fine: the official examples use it. **D-5:** SÉKOU, Fukushima and The Breach shipped "continue its camera position …", "continuation … from the last frame" and "create a link between …" in reference jobs on Higgsfield with no mismatch recorded `[STUDY]`. We write "carry on", "opens on", "arrives at", "becomes", "resolves into", "takes over"; SÉKOU's literal "continue" line is pilot test T-D (5.11), and the ban stands until the user approves that result.

**Camera language** (official: shot terms can be written plainly; anything technical is expanded into its visible result):
- Always name the subject, start state, direction and end state: "a handheld medium shot backing away ahead of Miraj, ending as a medium close-up". Write "about a 47-degree field of view", not "35mm"; focal length may only add to a visible description.
- Use one dominant move per shot, at the variant's behaviour (02, 04 §4.1). Expand niche terms: "rack focus: the railing in the foreground blurs as Miraj's face sharpens".
- **The camera is a person** (operator wording in 6/12 films; SÉKOU in 13 of 13 prompts `[STUDY]`): paste the variant's CAMERA form from 02 §2.6 verbatim, the handheld operator form or the locked form ("a locked frame with only a faint breathing sway; the subject moves inside the frame, the frame never follows").
- **Camera moves, never jumps** (P05-14): every camera sentence ends "Every new framing is reached only by travel; the camera never passes through walls, glass or bodies." After any fast move add "it lands on a readable beat on {{face}} before moving again." THREAD ("no new angle that the camera did not travel to"), The Breach (62 prompts) and TOKYO 4:17 (the readable stop) `[STUDY]`.
- Geometry in numbers where it helps: camera height in metres, distance in metres, a whip as an angle ("whips right about 100 degrees").
- For a blockout shot the clip owns the camera, so keep the camera sentence consistent with the playblast, never competing with it (04 T3 tie-breaks).

**Physics-accurate motion language** (every REAL shot follows ledger L.7; DREAM breaks only its registered exception):
- **Action chain.** Preparation → contact (name the second) → reaction (compression, recoil) → recovery. Example: "fists meet once at about 5.5 seconds; Miraj's knuckles compress, his forearm recoils a few centimetres; the robot's arm stops dead with a small servo settle".
- **Weight and support.** "Each foot planted before the other lifts; heel then toe; weight shifts from foot to foot; feet never slide, glide or float" (04 T3 gait clause, from scenario-labs `cast.md`, MIT). Bodies lean into acceleration and lurch forward when the bus brakes. Seated weight compresses the cushion.
- **Materials.** Name how they move: "cotton coverall creases at the elbows", "hair lifts in the train's air wake", "water drops fall straight and bead on the tile". Water, wave and echo words raise the risk of bubbling audio artefacts `[OFFICIAL FAQ]`, so on water shots check Q15 and let 06 supply water SFX. Write light physics as one key direction matching the ledger sun ("short shadows fall toward camera right").
- **State monotonicity.** Sweat, dust and wet eyes only accumulate across shots; write the current level. Props keep their count and owner; after a handoff, the giver no longer holds it (sd25-pe).
- **Substitute, don't only forbid.** Give the replacement behaviour, not a bare "no X" (the OpenMontage technique, paraphrased). Example: "the glass dust is swept into a neat pile" instead of "no shards flying".
- **Avoid.** More than 3 tracked characters in one shot; describe everyone else as a crowd with tasks and a headcount (05b §5b.8). Slow motion unless declared; reflections that could double a person; an exit and re-entry inside one shot; "floating", "glides", "weightless" outside DREAM. Name whose hand or object is in any insert (seedance-director, user's skill).
- Write micro-expressions as physical changes ("jaw sets, nostrils widen"), never as labels or eye effects. Strong emotion words can make eyes glow: write "normal human eyes" and use calmer words ("amazed", not "fanatical") `[OFFICIAL FAQ]`.
- **Physics as process** (at least 11/12 films `[STUDY]`): every action starts from its real beginning and completes ("nothing is pre-done, nothing skips its middle", LEAK); natural real-time speed, no slow motion unless declared; the set stays fixed ("the set is immutable", The Breach, 127 prompts); nothing appears out of thin air.
- **Vanished behaviour fix** (P05-12). If a draft loses a persistent behaviour mid-take (shake, flicker, rain, a wet state), do not add more text lower down. Move it to the first line of 【Generation Goal】 as the REFRAIN and open each Event Script range with a short repeat of it ("The lights keep flickering; …"). Fukushima's in-film take repeats its flicker and shake at the start of 10 of 13 beats `[STUDY]`. This is the one variable of the next version (5.6).

**Locks** (named blocks stating what holds; technique from OpenMontage, paraphrased):
- **COUNT**: exact headcount, no doubles in reflections; fence it at both ends: "exactly two people; no one else appears at any point" (The Breach; THREAD's SINGULARITY in 170 prompts `[STUDY]`).
- **SCREEN DIRECTION**: the axis, e.g. "the train always runs right to left".
- **LENS**: one field of view, no drift.
- **STILLNESS**: what never happens, e.g. "nobody else speaks; the mother's photo stays on the shelf".
- **IDENTITY**: an invented, original face; no logos and no readable text; side-named marks with "do not mirror" (03 §3.1.4). No age words anywhere in the prompt: ages live only in the asset sheets (D-15; 05b rule 6).

**"= a failed take" sentences (D-6, pilot test T-E).** THREAD, In Passing and Buzkashi named concrete failures this way `[STUDY]`. 02 hard rule 7 owns the decision: production prompts carry none until the user approves T-E. In a T-E draft, up to five sentences go as the last lines of 【Maintain Consistency】, each naming one visible failure ("A second shadow direction on the floor = a failed take."). Comma-list negative blocks stay banned either way.

**Non-human block** (P05-13; every shot with a robot or creature). HUNGER pasted an integration block in 92 prompts and "Exactly one" in 142 of 207; its creature is in about 23 of 42 final takes `[STUDY]`; the fit to our robots is [INFERRED]. Paste into 【Subjects and Relationships】, with the SCALE SHEET (03 §3.1.9) as a reference:
```text
{{NAME}} is a real physical {{robot}} captured in the same live-action place as everything else. Keep its exact identity and build, and take from @Image{{loc}}, the photographic-world reference, the same lighting, shadow direction, softness, grain, focus response and exposure. It stands on the floor with a contact shadow under its feet; no separate key light, rim light or glow on it; never cleaner or sharper than the room. Scale: {{NAME}} is about {{cm}} cm tall; its {{head}} reaches {{the lead's waist / the door handle}}; it keeps that size when the camera is farther away, when it sits, when it approaches, near the door. Exactly one {{NAME}}. Its size and shape hold for the whole shot. Gait: one foot stays planted, weight shifts onto it, the other foot lifts clear, swings forward, the heel meets the floor, weight transfers; the body rises and settles a little with each step; it never glides, floats, slides or turns in place without stepping. Hands and objects make real contact; materials give where pressed; nothing passes through anything.
```
Light the non-human only by sources in the scene. Show any change of size or state between takes, never inside one. Performance stays small (05b §5b.7). Prompts with this block may pass 1,000 words (D-7), logged.

**Transition block** (P05-11; place A becomes place B inside one take, PT4b). Real scenes use a physical occluder or a medium: a real object with weight crosses the whole lens for about half a second, or the view is fully inside a medium (smoke, murky water, darkness), and B is already there when it clears (THREAD's window-frame wipe, HUNGER's box curtain, Fukushima's fluid). DREAM scenes may use the re-resolution law (02 PHYSICS EXCEPTION): the surfaces of A become the surfaces of B in steps (mass, edges, material, fine detail), written with an A → B mapping of 4–7 pairs (UNPROMPTED's method on Cinema Studio; the transfer to Seedance is [INFERRED]). Vocabulary: *becomes, resolves into, takes over, is already there*; never the edit verbs above. Place the shift in the first two-thirds of the take; the subject is the fixed anchor and does not transform; no fade, dissolve, overlay, wipe graphic or particles; the audio carries the occluder's own sound and no whoosh. Plates: 03 §3.1.10 (STARTING, TARGET, seam still).

**One-line mode** (P05-7). When a shot has an approved, identity-corrected start frame (03 routing row 10) that already carries composition, light and wardrobe, the prompt may be 8–40 words: camera behaviour + one action + one guard ("static handheld shot, she lifts the cup to her lips, same angle, no zoom in"). The audio policy line still opens it and the audio line closes it; the start frame goes in as `start_image` (or the START FRAME role). In Kimti every prompt of 28 words or fewer reached the cut, 6 of 6 `[STUDY]`. Not for dialogue, non-human or multi-character shots.

**Prompt length guide** (D-7; 3B.4 of the playbook). Match the length to the job, not to the shot's importance: Kimti's in-film rate was 5/5 for prompts of ≤ 20 words but 6/16 at 121–500 words `[STUDY]`. Words counted with `wc -w prompt_vNN.txt`, audio and look lines included (one-line mode counts only its sentence between the two audio lines).

| Job | Length | Evidence `[STUDY]` |
|---|---|---|
| One-line mode on an approved start frame | 8–40 words between the audio lines | Kimti 6/6 at ≤ 28 words |
| Single shot, 4–15 s | about 350–800 words | Kimti 80–350; LEAK median 569; HUNGER finals 1,053 |
| Text-blocked long take, 20–25 s | 650–1,000 words | SÉKOU 627–1,502 (aim 900–1,100); The Breach median 1,291 |
| Extension link (5.8b) | may pass 1,000, logged | THREAD median 2,612 |
| Non-human shot | may pass 1,000, logged | HUNGER 1,316 |
| One-change repair (`video_edit`) | one sentence to about 400 words | Kimti one sentence (in the film); THREAD median 416 |
| Black-gap in-fill (pending T-C) | PT4a as written, about 300 words | Fukushima ≈ 1,036 Chinese characters |

Every other prompt stays at or under 1,000 words; cut descriptive repetition first, never a lock, the audio lines or the look block.

**Timestamps.** Integer-second ranges are continuous, non-overlapping and end at G. They are event budgets, not edit points. Never time high-frequency actions `[OFFICIAL]`. Use the playblast's beat frames ÷ 24, rounded. With few events, use "At the start / Principal event / At the end". Windows that shipped: 4–9 s per stage in a 20–25 s take (SÉKOU), 4–6 s windows with a last "hold" (LEAK) `[STUDY]`. Never compress two beats into one motion.

**Banned words** (from the user's seedance-director skill): breathtaking, stunning, mesmerizing, masterpiece, seamless, epic, cinematic masterpiece, 8K, IMAX, hyperrealistic, "photorealistic" on faces (03). Never name a real film, actor, brand or celebrity.

**Worked example — S03-SH02** (BLOCK, R-DAY, no dialogue; IDs from 04's hand-off; Miraj and the robot by their approved sheets' job IDs on the T1 route, location plate face-free):
```text
Audio policy: the soundtrack holds only the diegetic sounds named at the end. No music, background music, BGM, score, instrumental, melody, synth effects, ambient pad, drone, stinger or rising tone at any moment. No subtitles.

【Generation Goal】
Generate one continuous handheld shot: Miraj walks along the moving metro walkway toward camera, stops, and the greeting robot steps in from frame right and bumps fists with him while a metro train passes behind them. Story job: the first friendly contact of Miraj's working day.

【Reference Asset Roles】
@Image1 is Miraj, IDENTITY (state S1): use only his face, hair, beard, build and grey work coverall; not the grey background, the studio light, the pose or the panel layout.
@Image2 is the greeting robot, IDENTITY: use only its shell, joints, proportions and colours; not the grey background.
@Image3 is the metro walkway at noon, LOCATION ONLY: use only its architecture, materials and light direction; not its framing; no people from it.
@Video1 is a coarse 3D blocking reference: rehearsal footage in which coloured stand-ins walked the scene so camera, timing and movement could be locked. [… 04 T3 clause continues verbatim to "no capsule-shaped bodies."]
These references are knowledge, not shots: never cut to, settle on or reproduce a reference composition. Do not reproduce the reference images as fixed opening frames, animate them one after another, or transition between them as a slideshow.

【Subjects and Relationships】
Exactly eight figures: Miraj, the robot and six commuters; no one else at any point and no doubles in the glass. Miraj stays on the camera side of the walkway's centre line. The train always runs right to left behind them. [Miraj's side-named mark from the continuity bible], do not mirror.
[Non-human block for the robot, filled: about {{cm}} cm tall, its head at Miraj's {{landmark}}; @Image3 as the photographic-world reference; its left-leg limp in the gait line.]

【Event Script】
0-3 seconds: Frame one is already running: Miraj is mid-stride toward camera at an even pace, heel then toe, coverall creasing at the knees, sweat darkening his collar.
3-5 seconds: the robot steps in from frame right with a short, stiff limp on its left leg while Miraj slows and stops with both feet planted; behind them a metro train enters from frame right.
5-6 seconds: Miraj sees the robot's raised right fist, then lifts his own; the fists meet once at about 5.5 seconds; Miraj's knuckles compress and his forearm recoils a few centimetres; the robot's arm stops dead with a small servo settle.
6-7 seconds: both lower their hands; Miraj breathes out through his nose with a tired half-smile; the last carriage clears frame left. FINAL FRAME: medium shot, Miraj centre frame facing camera, the robot at frame right with its hand at its side, the walkway clear behind them.
[05b PERFORMANCE block A for Miraj and F for the robot]

A handheld medium-wide shot backing away ahead of Miraj at about a 63-degree field of view, ending as a medium shot. [02 CAMERA handheld form, verbatim.] Every new framing is reached only by travel; the camera never passes through walls, glass or bodies. Focus holds on Miraj's face and the background stays soft.

The visuals feature [prefix/seedance.txt core + variant R-DAY, verbatim].
Characters, wardrobe, props and environments stay identical to their references across every cut; no identity drift.

【Maintain Consistency】
Keep Miraj's face, hair, beard, build and grey work coverall; [his side-named mark] on the same side; the robot's shell, joints, colours and its left-leg limp; eight figures in total; the train's direction; and the high sun behind camera left with short shadows.

Audio includes <footsteps on the ribbed walkway belt>, <a metro train passing right to left with a long steel rush>, <one dull knock of knuckle on metal at the fist bump>. Diegetic sound effects and ambience; dialogue only where the shot scripts it. No music, no background music, no score. No subtitles. No music of any kind.
```
Params: `model: "seedance_2_5"`, `mode: "omni_reference"`, `aspect_ratio: "16:9"`, `duration: 7`, `generate_audio: true`, `draft: true`, `folder_id` = the S03 scene folder; `medias` in handle order: CHR_MIRAJ sheet job ID (`image_references`), CHR_ROBOT sheet job ID (`image_references`), LOC_METRO-WALKWAY plate job ID (`image_references`), `SLA_S03-SH02_PB_v03.mp4` `media_id` (`video_references`). Cost 21 credits per draft. The second ranges come from 04's beat frames ÷ 24: robot enters f84 (3.5 s), train f97–f160 (4.0–6.7 s), contact f133 (5.5 s). The take is 7 s, so the ranges do not need "Still the same shot:"; it is a BLOCK shot, so no tail. With the robot's SCALE SHEET attached it becomes `@Image4` (`image_references`, after the plate).

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

**Method A, the default.** Add these lines to the prompt; 05b snippet C supplies the delivery and silence lines. The **dialogue locks** (P05-8) come from the studied films: an exact line count in 6/12 (The Breach, Fukushima, THREAD, TOKYO 4:17, LEAK, Buzkashi), THREAD's "the descriptive sentences of this prompt are NOT dialogue" (104 prompts), and CONTROL's supplied-voice binding, the one precedent for our ElevenLabs route (64 voice-driven jobs) `[STUDY]`:
```text
@Audio1 is Miraj's own voice and dialogue, his DIALOGUE AUDIO REFERENCE. Reuse the speech in @Audio1 exactly as recorded, word for word and at its own timing, with word-level lip sync: his lips close fully on p, b and m, and his mouth returns to rest after the last word. @Audio1 is the sole source of the spoken voice and its timing; do not synthesize a new voice; the silences absorb any difference, and the speech is never re-timed.
Miraj's voice: {{01 voice descriptor, verbatim}}.
DIALOGUE LOCK: exactly {{one}} spoken line in the whole take, said once{{, in this order: …}}. No other voice anywhere: no muttering, no murmured or half-heard speech. The descriptive sentences of this prompt are NOT dialogue.
Dialogue language: {{language from 01}}, {{accent plainly described, never a caricature}}. Miraj's line ({{2-3 delivery words = the v4 tag's mask}}), spoken to {{addressee}}: {SPOKEN}
Before the line his lips stay closed; after it {{one written after-line behaviour: he holds the look for half a second, then looks down}}; his lips stay closed.
```
- The line count includes every voice in the take, on screen, off screen and V.O. (05b §5b.6 keeps one line of ≤ 10 words per speaking close-up; LEAK's median line was 5 words `[STUDY]`).
- Never write "No dialogue" or "Nobody speaks" in a prompt that quotes a line (a LEAK contradiction; the 5.4 lint checks it).
- Replace `SPOKEN` with 01's SPOKEN text, identical, and keep the single braces: `{}` is Seedance's dialogue syntax. Put it once. Never repeat words of the line elsewhere or tie emotion to single words, which triggers burned-in subtitles `[OFFICIAL FAQ]`.
- Name the language per speaker, right before the line.
- Paste Arabic, Urdu or Devanagari text from its own code block so right-to-left editors do not reorder it.
- `generate_audio: true` until 05-T8 says otherwise. Decide it at the draft, because the final inherits it.

**Worked example — S11-SH05** (STILL, R-INT, line S11-L06 `ON`; 05b beat map: take T02 placed at 1.0 s, speech 1.1–3.9 s, G = 6 s; words and language are placeholders until 01 locks them):
```text
Audio policy: the soundtrack holds only Miraj's speech from @Audio1 and the quiet room sounds named at the end. No music, background music, BGM, score, instrumental, melody, synth effects, ambient pad, drone, stinger or rising tone at any moment. No subtitles.

【Generation Goal】
Generate one continuous locked-off medium close-up: Miraj, sitting on the edge of his bunk at night, answers his mother on the palm screen in his hand. Story job: {{from 01's beat sheet}}.

【Reference Asset Roles】
@Image1 is Miraj, IDENTITY (state S2): use only his face, hair, beard, build and faded grey T-shirt; not the grey background, the studio light, the pose or the panel layout.
@Image2 is Miraj's shared room at night, LOCATION ONLY: use only its walls, bunk beds and lamp light; not its framing; no people from it.
@Audio1 is Miraj's own voice and dialogue, his DIALOGUE AUDIO REFERENCE. Reuse the speech in @Audio1 exactly as recorded, word for word and at its own timing, with word-level lip sync: his lips close fully on p, b and m, and his mouth returns to rest after the last word. @Audio1 is the sole source of the spoken voice and its timing; do not synthesize a new voice; the silences absorb any difference, and the speech is never re-timed.
Miraj's voice: {{01 voice descriptor, verbatim}}.
These references are knowledge, not shots: never cut to, settle on or reproduce a reference composition.

【Subjects and Relationships】
Exactly one person, Miraj, alone in frame; his mother is only a soft, unreadable glow on the palm screen. His face is three-quarter to camera and nothing covers his mouth. [Side-named mark], do not mirror.
DIALOGUE LOCK: exactly one spoken line in the whole take, said once. No other voice anywhere: no muttering, no murmured or half-heard speech. The descriptive sentences of this prompt are NOT dialogue.

【Event Script】
0-1 seconds: Frame one is already running: Miraj looks down at the palm screen, his thumb stops turning the ring, lips pressed closed; one short breath in through the nose.
1-4 seconds: Dialogue language: {{LANG}}, {{accent from 01}}. Miraj's line (warmly, holding it together), spoken to his mother on the palm screen: {SPOKEN of S11-L06}
4-6 seconds: the half-smile drains last; his ring hand closes into a fist; one slow blink; lips stay closed; his head stays still. FINAL FRAME: the same medium close-up, his eyes on the palm screen, the fist resting on his knee.

A locked-off medium close-up at seated eye level, about a 40-degree field of view. [02 CAMERA locked form, verbatim.] Focus on his eyes, the bunk behind him soft. The ring on his finger glows a soft #3BD16F green.

The visuals feature {{prefix/seedance.txt core + variant R-INT, verbatim}}.
{{02 CONTINUITY line}}

【Maintain Consistency】
Keep Miraj's face, hair, beard, build and faded grey T-shirt; [his side-named mark] on the same side; one person only; one spoken line; the lamp stays the only warm source, camera left.

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

**Other modes** (P05-8 forms; SÉKOU, THREAD and Kimti shipped them `[STUDY]`):
- `PHONE` lines bind the audio to the source ("@Audio1 is Noah's broadcast voice heard from the wall screen; nobody in frame moves their lips"). Every visible mouth stays closed.
- `OFF` (off-screen speaker): "From {{behind the camera / beyond the wall}}, {{intention}}, {{NAME}}'s line is heard, not lip-read; nobody in frame moves their lips."
- `VO`: "The line is voice-over: {{NAME}}'s mouth does not move on it; lips closed; as if spoken beside the camera, no reverb." The DIALOGUE LOCK still counts it.
- Silent shot: "Nobody speaks. No lip movement." Only in prompts that quote no line.
- Noah has no mouth: nothing on his head panel moves with speech (03, 05b F).
- `ON-WIDE` lines use the same binding without the close-up rules.

### 5.4 Run the draft (480p)

1. **Pre-submit lint** (P05-3; Claude, every time, before the cost preflight; the result goes in `lint_vNN.md` and one line of the T1 card). Compiled from the failures the studied films recorded (CROSS-STUDY §3C.9): lost tags on paste and unfilled template placeholders (The Breach), an empty role slot (CONTROL), 43 empty element slots and header/param mismatches (HUNGER), ordinals that did not match the attachments in 10 of 12 prompts and chat residue (Kimti), a prompt cut at 4,500 characters and "No dialogue" next to a line (LEAK), blank and duplicate tokens (SÉKOU) `[STUDY]`. Any ✗ stops the submit.
   - [ ] **Name.** The output name is not already owned by an OK ledger row or a job in `reports/inflight.md`; a second take of the same version is `t2`.
   - [ ] **Handles = attachments.** Per media type, the number of handles equals the number of `medias` entries of that role; `@ImageN` = the N-th `image_references` entry (05-T11); no duplicate N; one handle form only (D-1); every attached media is named in the prompt or listed under `【Unused Assets】`.
   - [ ] **One role per handle.** Each handle has exactly one role line from the 5.2 vocabulary with its "only … / not …" limit; no blank role line ("is the environment", "Use  as"). With 3 or more images, the anti-slideshow sentence is present; the knowledge-not-shots line is present.
   - [ ] **State and cast.** The identity sheet matches the scene state (wardrobe, wet, dusty); small marks are written in text with their side and "do not mirror"; at most 2 character identities; extras only in text.
   - [ ] **Continuity.** A continuing shot carries its continuity pair, logged in `chain_log.csv` (source job ID, grab second).
   - [ ] **Look.** The visuals paragraph equals its block in `prefix/seedance.txt` byte for byte (sha256), the right variant and colour-rule form (02).
   - [ ] **No residue.** No `{{` slot, `<placeholder>`, `[MISSING]`, LLM preamble, alternative versions or "Copyable prompt:" text.
   - [ ] **Complete ending.** The prompt ends with 【Maintain Consistency】 and the audio line ("… No music of any kind."); the word count is inside the length guide (5.2) or the reason is logged (D-7).
   - [ ] **No contradictions.** No "No dialogue" or "Nobody speaks" next to a quoted line; the DIALOGUE LOCK count equals the lines quoted; no edit or extension verbs in an `omni_reference` prompt (outside pilot test T-D); no "= a failed take" outside pilot test T-E; no written cut outside pilot test T-F.
   - [ ] **Words.** No parameter words (rule 4: `16:9`, `1080p`, `fps`, seconds of duration); no job IDs or `media_id`s; no age words (D-15); no banned words; no real names, brands or gear names; the crop-safe sentence only if D-9 chose a letterbox.
   - [ ] **Params.** `model: "seedance_2_5"` · `mode` as planned (`omni_reference`, `video_edit`, or `video_extension` + `extension_mode`) · `duration` whole seconds 4–30, = G for BLOCK · `generate_audio` per 05-T8 · `draft: true` (unless finalizing with `draft_job_id`) · `aspect_ratio: "16:9"` · `folder_id` = the scene folder · every `medias` entry has one of the roles `start_image`, `end_image`, `image_references`, `video_references`, `audio_references`; video references ≤ 30 s in total.
   - [ ] **Hash.** The sha256 of `prompt_vNN.txt` is in the packet. After submit, the prompt read back with `get_project_asset_prompt` is compared with the file; any difference (a cut ending) is logged and the take is re-versioned, never used as approved text.
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
| Q3 | Headcount | extra or missing people; doubles in glass or reflections; a capsule shape survived; a second robot or creature; a robot or creature that shrinks, grows or changes shape inside the take |
| Q4 | Continuity IN/OUT | the opening state contradicts the previous shot's OUT (continuity bible §9); sweat or dust reset; on a continuity pair, camera position, light or the positions of people restaged against the previous clip; a side-named mark mirrored |
| Q5 | Screen direction and eyelines | the axis flipped; eyeline targets differ from 04's sheet |
| Q6 | Support and contact | foot sliding, air-walking, hands passing through objects; contact not on the planned second |
| Q7 | Mass and timing | weightless falls; vehicles changing speed oddly; a walk faster or slower than the capsule's pace |
| Q8 | Materials | cloth, hair, water or glass behaving like solids; liquid not falling at gravity (outside DREAM) |
| Q9 | Light | shadow direction or length contradicts the ledger sun; a light with no source in REAL variants; the reserved green outside an assistant device |
| Q10 | Camera | path, framing or lens differs from the playblast; a lens pop; a freeze-then-jump; an invented cut (check near range boundaries: SÉKOU got one there); a framing the camera did not travel to; a cut to, or a hold on, a reference image's composition; references played as a slideshow |
| Q11 | Beat timing | an action misses its second by more than 12 frames; the clip ends early or drifts in the last second; a persistent behaviour (shake, flicker, rain, wet state) drops out mid-take (fix: the 5.2 refrain); the take settles or starts the next beat when it should end mid-motion (5.8b) |
| Q12 | Performance | below 05b's scale minimum (hero shots ≥ 4); a reaction before its trigger; glowing eyes |
| Q13 | Hands and faces in motion | finger count, melting hands, teeth or eyes artefacts during fast moves |
| Q14 | Lip-sync (ON lines) | out of tolerance (5.3); wrong or extra words; more lines than the DIALOGUE LOCK counts; a listener's mouth moving; lips moving on an `OFF` or `VO` line |
| Q15 | Audio content | any music, pad or tonal bed; missing named SFX; invented speech or murmurs; ripple, bubbling or echo artefacts |
| Q16 | Text | burned-in subtitles; label text rendered; garbled signage (planned text is post work, 07) |
| Q17 | Rights and G-rating | logos, real landmarks treated as brands, real-person likeness; any non-G detail |
| Q18 | Texture artefacts | fingerprint-like patterns in foliage or fabric; flicker; boiling textures |
| Q19 | Prompt leakage | hex codes, `【】` labels or stand-in colours rendered; grey or untextured surfaces |
| Q20 | Tech (finals) | not 1920×1080; frame rate not the T6 baseline (24/1 expected); frames < fps·G − 1; codec, pix_fmt, bit depth or bitrate differ from the 05-T7 baseline for `bitrate_mode: "high"`; audio stream missing when `generate_audio` was true |

**Verdict per take:** `APPROVE` · `FIX-IN-PLACE` (right except for one thing: name it; 5.6 order) · `ITERATE` (name the one variable) · `REBLOCK` (send back to 04 with the defect and timecode) · `CUT` (talk to the user about the shot). Judge every take of every version before ranking: in Fukushima, In Passing and The Breach the take in the film was often not the newest version `[STUDY]`.

Show the T2 review card. When the user approves, update the draft's ledger row only in its review cells: `review_status` APPROVED, `approved_by`, `approved_utc`, `approval_words` = «...their words...» verbatim (ledger L.2), and set the shot to DRAFT-APPROVED in `SLA_SHOTS.csv` (L.4). The 05b take gate G5b-C must also pass.

### 5.6 Iteration discipline

- **Change one thing per version** and write it in the iteration log (T5): a prompt sentence, a reference, the playblast version or a parameter. Bump `v` when the prompt or references change; `t` counts takes of one version (ledger L.1).
- **Fix in place before a new version** (P05-5). When a take is right except for one thing, try in this order before writing `v+1`; each try is a pass `eNN` on the same source, logged in T5 and `chain_log.csv`:
  1. **One-change `video_edit`** with the repair template (5.8): "Keep EVERYTHING exactly as it is … Change ONLY ONE thing: …". Kimti's one-sentence tempo edit is in its film `[STUDY]`. Source: the approved 1080p final by job ID. On a draft, only if 05-T9 showed that an edit made on a draft finalizes as sharp as a direct final; otherwise the user first approves the draft "as the base for one fix" in their own words, it is finalized, and the edit runs on that final.
  2. **Forward `video_extension`** when the missing thing is the next beat, from the approved 1080p final by job ID (never from a draft: the final is a new generation, so its last frame can differ from the draft's).
  3. Only then a new version. Kimti took about 18 s of its film from one edit, one extension and one video-referenced reaction; 8 of the 12 studied films fixed in place and 7 have the result in the film `[STUDY]`.
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
  - Never re-run the approved prompt fresh at 1080p to "rescue" a performance (rule 2). The video upscaler (Higgsfield `upscale_video`, Topaz; THREAD took its 720p chain to 4K this way `[STUDY]`) belongs to 07 as a disclosed rescue or a 4K master pass, never as a replacement for finalize.
- Approve the final with the user's words (ledger review cells, as in 5.5). Then set the shot to FINAL-APPROVED in `SLA_SHOTS.csv` and append the prompt-library entry (SKILL §7b): film code, shot ID, model and params, the exact prompt, references and roles, their verdict, what made it work, what failed before it.
- Extract the last frame for continuity from the downloaded original, as a derivative: `ffmpeg -sseof -1 -i FIN.mp4 -update 1 FIN_LF.png` (named `…_SD25-FIN_vNN_tK_LF.png`, ledger L.1). It is the LAST APPROVED FRAME of the next shot's continuity pair (5.1) and the frame-match target of an extension link (5.8b). Hand the final to 07 for import and give 06 the SFX events with seconds.
- Save the Higgsfield job record (model label, date, job ID, folder, prompt read back with `get_project_asset_prompt`) in `08_EVIDENCE/` (5.0, proof of Seedance use).

### 5.8 Fixes in place and joins: edit and extend tasks

Use these first for a near-miss take (5.6, before a new version), then for 07 §7.5 rank-3 fixes and 08 notes. The result stays `SD`.

- **Source (D-4: current rule kept until pilot test T-C is approved).** Always the **original** final, passed by its Higgsfield job ID with role `video_references`; never a trimmed, re-encoded or re-uploaded copy. On the official API a face-containing clip loses trust once it is trimmed, re-encoded or forwarded `[OFFICIAL]`; how Higgsfield treats an altered clip is unknown, so do not test it on hero shots. The studies disagree: THREAD fed 19 trimmed, re-uploaded tails into extensions, The Breach re-uploaded its approved take and extended it, and Fukushima sent NLE exports to `video_edit`, all into their films, faces included `[STUDY]`. Pilot test T-C (5.11) tries this on a non-hero shot.
- **Edit settings.** `mode: video_edit`; `duration` and `aspect_ratio` are ignored and the job is billed by the source's duration `[HF]`; a source of 4–30 s (≤ 20 s recommended), the prompt starting with "Edit @Video1, …".
  - Every edit prompt names exactly what changes and closes the scope. House wording, paraphrasing sd25-pe: "Everything not named above in @Video1 (people, props, background, camera, timing, sound) stays exactly as it is; nothing is replaced, added or removed."
  - For a moving replacement, the new object inherits the old one's timing, path, speed and occlusions (motion-slot replacement, sd25-pe).
- **One-change repair** (THREAD's repair form and Kimti's one-liner, both in their films `[STUDY]`; `prompt-library/seedance-action.md` "One-change repair"):
  ```text
  Edit @Video1. Keep EVERYTHING exactly as it is, frame for frame: {{people, wardrobe, props, room, light, grade, camera move, timing, sound}}. Nothing is added, nothing is removed, nothing is re-timed.
  Change ONLY ONE thing: {{the change, physically, with where and when: "from 2 seconds on she walks to the box at a fast pace instead of slowly"}}.
  {{If something held by a subject goes: "{{SUBJECT}} ITSELF IS NOT THE OBJECT TO REMOVE."}}
  Everything not named above in @Video1 (people, props, background, camera, timing, sound) stays exactly as it is; nothing is replaced, added or removed.
  ```
  A Kimti-style one-sentence edit ("{{change}}, do not change the video structure") is allowed when the change is a tempo or timing fix. Two-sided failure sentences go in only inside pilot test T-E.
- **Edit duration.** The output can be up to 0.4 s shorter than the source. If length matters, give the source a frame count of 8n+1, e.g. 169 frames for about 7 s `[OFFICIAL FAQ]`. Or switch to `mode: omni_reference` with an exact `duration`.
- **Audio-only edit** (06 found music inside a clip):
  - Prompt: "Edit @Video1. Remove only the background music. Keep the character dialogue, lip sync, ambience, action sound effects and all visuals unchanged."
  - Post isolation is the alternative. It also removes the SFX `[OFFICIAL FAQ]`.
- **Extend.** `mode: video_extension` with `extension_mode: "forward"` or `"backward"` (required); `aspect_ratio` is ignored, the output follows the source `[HF]`. The output starts on the frame after the source and inherits the source's frame size (THREAD measured it on every link `[STUDY]`).
  - Forward: describe the boundary state first, then the new action. Use PT3's docking sentence (5.8b).
  - Backward: describe the new action first, then end on the source's first frame. Nothing from later in the source may appear early (sd25-pe).
  - State that each subject stays one continuous instance.
  - Minimal form for one new beat (Kimti, in the film): "{{one new beat, one sentence}}. Static camera, restrained performance, no gimmicks, no dramatic camera movement." with the face sheet attached again.
- **Black-gap in-fill join** (P05-10; **pending pilot test T-C (b)**: the source is an NLE export, which the source rule above forbids until the user approves T-C). Fukushima joined finals this way: 54 jobs, 22 joins, 8 in the film, all at 1080p `[STUDY]`.
  1. In the NLE: the last ~2 s of approved final A + a black gap + the first ~2 s of approved final B, exported at 24 fps, master frame size, ungraded and muted, 4–12 s in total, logged as a derivative.
  2. Upload it (`media_upload` → PUT → `media_confirm`) as `video_references`; `mode: video_edit`; `draft: true` if 05-T9 allows, else 1080p direct with the user's yes.
  3. Prompt PT4a with frame numbers: the first frame is 1, so t s → frame t × 24 + 1 (2.000 s = frame 49; 4.000 s = frame 97). The boundary frames stay the input frames; nothing freezes on them.
  4. In T-C (b) it runs on one non-hero join only. If the edit refuses a face or trims frames, the join falls back to 07's bridges (cut on motion, darkness splice, held last frame).
- **Running them.** `draft: true` with `get_cost: true` first, then finalize with `draft_job_id` as in 5.7. Name the result `_SD25-EDT|EXT_vNN_tK_eNN` (L.1); `eNN` counts the passes on one source. If 05-T9 shows edit or extension jobs cannot be drafted, run the job once at `resolution: "1080p"`, `bitrate_mode: "high"`, only after the user's yes. Log every pass in `chain_log.csv` (T8).

### 5.8b One-shot chain (seed take + extension links)

**When.** A sequence that must read as one continuous camera, chosen as scope at 04's animatic gate (01 and the user decide; never a default). THREAD plays from 0:21 to 5:30 with no cut: 15 forward links and one pinned backward link; The Breach built its 30 s one-take finals by backward and forward extensions `[STUDY]` (P05-9).

**Source rule (D-4).** Until pilot test T-C is approved, every link extends the previous link's **approved 1080p final by its job ID**, untrimmed. So every link must end clean: the take ends mid-motion on a frame that is good to continue from. A link whose last second goes wrong is fixed in place (5.6) or redrafted, never trimmed. After T-C passes, the user may approve THREAD's trimmed tails (2–5 s for fast motion, 6–30 s when faces, rooms and blocking must carry over; exported at the master frame size, ungraded and muted).

**Procedure.**
1. **Seed.** The hardest physical moment first, as a standalone take: draft → approve → finalize (5.4–5.7).
2. **Link.** `mode: video_extension`, `extension_mode: "forward"`, `duration` = the new beat's length (4–30 s; THREAD's links mostly ran 25–30 s), `generate_audio: true`, `draft: true`; the source final by job ID as `video_references`; the scene's reference set plus the face sheet. Prompt PT3. Re-roll the identical prompt 2–4 times (one `count` call) before rewriting it (THREAD ran 53 prompts more than once `[STUDY]`).
3. **Approve and finalize the link,** extract its `_LF.png`, and extend from that final.
4. **At most one backward link,** pinned at both ends (PT3 backward variant) to reach the opening; a fixed last frame only on a short link (about 9 s).
5. **Frame-match QC** at every join: the link's first frame against the source's last frame, by SSIM, never by thumbnail (pinned siblings share first frames, THREAD):
   ```bash
   ffmpeg -sseof -0.05 -i SRC_FIN.mp4 -update 1 src_last.png
   ffmpeg -i LINK_FIN.mp4 -frames:v 1 link_first.png
   ffmpeg -i src_last.png -i link_first.png -lavfi ssim -f null - 2>&1 | grep SSIM
   ```
   Also check the camera speed carries across the join (2 fps strip around it) and Q4, Q10, Q11.
6. **Log** each link in `chain_log.csv` (T8: `link_type` EXT-F or EXT-B, parent take, source job ID, result job ID, seconds used).

**Budget.** About 8 drafts per link (THREAD's median, range 3–32; 6% of its generated seconds reached the screen `[STUDY]`). At our prices a 25 s link ≈ 8 × 25 × 3 = 600 draft credits + a 400-credit final ≈ 1,000 credits (≈ $45–50). Quote the chain before the first link and get one yes per link batch; this replaces the 5.6 shot budget for chain links. Link prompts may pass 1,000 words (D-7), logged.

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
| `InvalidParameter.TaskTypeConstraint` / `.TaskTypeMismatch` | edit or extend wording in a reference prompt ("replace", "change", "continue"), or settings that do not fit the mode | keep `mode: omni_reference`; reword with the 5.2 vocabulary ("carry on", "opens on", "becomes"; D-5) and no edit verbs (04 §4.9). In pilot test T-D, log the refusal or mode change as its result |
| A trimmed, re-uploaded tail or an NLE export is refused (face or privacy class) | the altered Seedance clip reads as a new real-looking face | only inside pilot test T-C: record it as T-C's result; production keeps the original by job ID (5.8) |
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
- **Generated seconds.** Per scene: draft and final seconds generated against story seconds (the studied films ran from about 1:1 to 35:1 `[STUDY]`); flag a scene past its planned ratio in the day report.

### 5.11 The two-scene pilot: what 05 produces, tests and locks

Decision 2026-11-02 (SKILL.md; 02 §2.13; 03 §3.5): after the script and the style are locked and the pilot scenes' assets pass G2-P, Claude produces the two pilot scenes end to end with the final method, and the open tests run inside them. If the user approves both scenes, the whole film is produced on exactly the same basis.

1. **Produce both scenes with the full method.** Every pilot shot goes through 5.1–5.7 as in production: 04's blocking, a G5-P packet with the 5.4 lint, 480p drafts, the user's approval in their own words, the 1080p final from the approved draft, download, hash, ledger. Continuing shots use the continuity pair; near-misses are fixed in place (5.6); any join, transition or one-shot in the pilot scenes uses 5.8, 5.8b and PT4. Hand the finals to 06 (rough SFX and dialogue placement) and 07 (rough assembly and grade) so the user judges real scenes, not clips.
2. **Budget.** Quote the pilot before the first draft with `get_cost` per distinct request and the playbook's ratio sheet: draft credits = R × T × 3, final credits = H × T × 16, with T = the pilot's story seconds. Example for T = 90 s at R = 8 and H = 1.5: 2,160 + 2,160 = 4,320 credits (≈ $193–216), plus the tests below. Each paid batch still needs the user's yes.
3. **Pilot tests run by 05.** Each runs inside the pilot scenes, preflighted with `get_cost: true`, one yes for the set. Until the user approves a result, the current rule (column 3) stays in force everywhere outside the test.

| Test | Question | Current rule until approved | Method in the pilot | Pass |
|---|---|---|---|---|
| T-C (D-4; P05-9, P05-10) | May an edit or extension source be a trimmed, re-uploaded tail or an NLE export? | the original final by job ID, untrimmed (5.8) | (a) a non-hero 4 s tail, trimmed at its last good frame, exported at the master frame size, ungraded and muted, uploaded, extended forward; (b) if a pilot scene has a join, one black-gap in-fill on a non-hero join (PT4a) | accepted, no refusal; identity and grade hold; (a) the output starts after the tail's last frame; (b) frames outside the gap stay identical (frame diff) and no freeze on the boundary |
| T-D (D-5; P05-4) | Does SÉKOU's literal "continue …" role line work in `omni_reference` on Higgsfield? | "carry on" wording; no edit verbs (5.2) | one continuity-pair shot drafted twice: our "carry on" line vs SÉKOU's literal "continue its camera position, lens, handheld motion character …; do not restage"; log the mode each job reports | no task-type change or refusal reported; camera position and the positions of people carried over in both. If "carry on" carries as well, nothing changes |
| T-F (D-3) | Can a written-cut coverage rush give usable inserts or atmosphere? | rule 3: one shot, one camera, no internal cuts | one 15 s insert or atmosphere rush with three written hard cuts at named seconds, no faces in close-up | cuts land within ±0.5 s; at least two usable 1–3 s pieces; then allowed for inserts and atmosphere only, never hero, dialogue or blocked shots |
| T-E (D-6; owned by 02 §2.13 step 4) | Do up to five "<visible failure> = a failed take" sentences reduce named failures? | none in production prompts (02 hard rule 7) | the same pilot draft with and without three to five such sentences in 【Maintain Consistency】 | fewer named failures, no new artefacts, no failure turned into content |
| T-G (owned by 04; P04-1) | PATH GUIDE clause vs the current blockout clause on a long playblast move | 04's current clause | drafted here as 04 specifies | as 04 states |
| T3 at scale (D-8) | Does finalize keep the approved performance on every pilot shot? | rule 2 | every pilot final gets the 3-up review (5.7) | no pilot final needs a re-draft for identity, action or timing drift |

The day-1 tests (5.0: T2, T3, 05-T7 to 05-T11) and T1 still decide the face route, handle form and fallbacks; the pilot runs on the routes they chose.
4. **Recipe lock at pilot approval.** When the user approves both pilot scenes (G5-PILOT), Claude writes `films/<id>/05-seedance/RECIPES_v1.md`: one recipe card per shot type used in the pilot (single shot, dialogue, continuity pair, long take, one-line mode, edit repair, extension link, transition, non-human), each with its PT template version and slot order, role lines and reference order, every `generate_video` parameter (mode, duration rule, `generate_audio`, `bitrate_mode`), the `prefix/seedance.txt` block and its sha256 (the production look, 02 §2.13), the lint version, the takes and budget per shot, and the T-C, T-D, T-E, T-F results with the rule each one now sets. Every later shot fills only its card's slots. A shot type the pilot did not cover gets a new card shown to the user before its first batch; changing a card makes `RECIPES_v1.1` with their yes and a list of shots to redo.
5. **If the pilot is not approved,** the user names what failed. Fix it at the right layer (5.6: 01, 02, 03, 04, 05b or 05), change only the failing cards, re-run the affected pilot shots, and ask again.
6. **Name.** The pilot is an internal production test. Its name never appears in the film, the credits or the submission (00 F8).

---

## Output templates (what Claude shows the user)

**T1 — Shot packet card** (before any spend; prompt in English in a code block, the rest in Arabic)
```text
لقطة S03-SH02 — نسخة v03 — حزمة جاهزة للمسودة
النمط: BLOCK (بلاي بلاست 7 ث) · المتغيّر: R-DAY · الحوار: لا يوجد
المراجع: @Image1 معراج (ورقة معتمدة، job ID) · @Image2 الروبوت (ورقة معتمدة، job ID) · @Image3 ممر المترو (لوحة بلا وجوه) · @Video1 PB v03 (media_id)
الإعدادات: Higgsfield seedance_2_5 · omni_reference · مسودة 480p · 16:9 · 7 ث · صوت مُولَّد: نعم (مؤثرات فقط، بلا موسيقى) · المجلد: 04_SCENES/S03
التكلفة (get_cost): مسودتان 42 رصيد (≈ 1.9–2.1$) · النهائي 1080p ‏112 رصيد (≈ 5.0–5.6$)
القالب: PT1 (وصفة RECIPES_v1 بعد اعتماد التجربة) · الطول: 642 كلمة · فحص ما قبل الإرسال (5.4): ✓ كل البنود
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
(إن كانت اللقطة صحيحة إلا في شيء واحد: «إصلاح في المكان» بتعديل واحد قبل أي نسخة جديدة، 5.6)
هل نعتمد t1 للانتقال إلى النسخة النهائية 1080p؟ (نحتاج كلمات الاعتماد بصياغتك)
```

**T3 — Final review card**: the same table on the final, plus the 3-up link, the Q20 tech line as ffprobe reports it against the 05-T7 baseline (e.g. `hevc Main 10, yuv420p10le, 1920x1080, 24/1, mono`), the Higgsfield job ID and the credits spent, and the question «هل نعتمد النسخة النهائية لتدخل المونتاج؟».

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

**T7 — Pilot test card** (5.11; one per test, Arabic, IDs in English)
```text
اختبار التجربة T-D — صياغة «continue» داخل omni_reference (القرار D-5)
القاعدة الحالية حتى الاعتماد: صياغة «carry on» وبلا أفعال تعديل
الطريقة: لقطة S04-SH03 مرتين بالإعدادات نفسها · A: «carry on» · B: صياغة SÉKOU الحرفية
النتيجة: A ✓ لا تغيير في نوع المهمة · B ✓ لا رفض، والنمط المُبلَّغ omni_reference · حمل الكاميرا والمواضع: A ✓ · B ✓
التكلفة: مسودتان 48 رصيد · ملف المقارنة: tD_A_vs_B.mp4
توصيتي: لا داعي للتغيير؛ نُبقي «carry on» في الوصفة.
هل نعتمد هذه النتيجة وتسجيلها في RECIPES_v1؟ (نعم / لا / تعديل: …)
```

**T8 — Chain log row** (`05-seedance/<S##>/chain_log.csv`, append-only; mirrored into `SLA_SHOTS.csv` per ledger L.4)
```text
shot_id,take,parent_take,link_type,source_job_id,source_file,source_in_s,source_out_s,grab_s,frame_size,graded,muted,role_sentence,result_job_id,used_in_s
S04-SH03,v01_t2,S04-SH02_v02_t1,LASTFRAME+CLIP,<job ID>,SLA_S04-SH02_SD25-FIN_v02_t1.mp4,0,12,11.958,1920x1080,no,no,"carry on its camera position …",<job ID>,0-9.5
```
`link_type`: EXT-F · EXT-B · LASTFRAME+CLIP · GRAB-START · GRAB-END · VIDREF · EDIT · INFILL.

### Prompt templates PT1–PT4 (the playbook's T1–T4, adapted to 5.2)

Fill-in skeletons for `prompt_vNN.txt`, from CROSS-STUDY §3B.17 (SÉKOU's stage skeleton, The Breach's locks, LEAK and Kimti's acting text, THREAD's link and lock sections, Fukushima's in-fill), rewritten into 5.2's labels and our current rules: `@ImageN` handles, no edit verbs in `omni_reference`, no "= a failed take" outside pilot test T-E, no written cuts. The study versions stay in `prompt-library/seedance-*.md`. After the pilot approval, each card in `RECIPES_v1.md` names the PT version it froze.

**PT1 — Single shot** (`omni_reference`; params: `duration` = G, `generate_audio: true`, `draft: true`, `aspect_ratio: "16:9"`)
```text
Audio policy: the soundtrack holds only the diegetic sounds named at the end. No music, background music, BGM, score, instrumental, melody, synth effects, ambient pad, drone, stinger or rising tone at any moment. No subtitles.

【Generation Goal】
Generate one continuous {{shot size}} shot: {{subject}} {{principal action}} in {{place}}, {{time and light}}. Story job: {{what this shot does in the film}}.

【Reference Asset Roles】
@Image1 is {{NAME}}, IDENTITY (state {{S#}}): use only face, hair, build and {{costume phrase}}; not the grey background, the studio light, the pose, the expression or the panel layout.
@Image2 is {{LOCATION}} ({{time of day}}), LOCATION ONLY: use only architecture, materials and light direction; keep its geometry; not its framing; no people from it.
{{@Image3 is the {{prop}}: its exact look and colour wherever it appears; only one {{prop}} exists.}}
{{@Video1: 04's blockout clause, verbatim (BLOCK shots)}}
These references are knowledge, not shots: never cut to, settle on or reproduce a reference composition.
{{3+ images: Do not reproduce the reference images as fixed opening frames, animate them one after another, or transition between them as a slideshow.}}

【Subjects and Relationships】
Exactly {{N}} people at any moment; no one else appears at any point; no doubles in glass or reflections. {{NAME}} stays frame-{{left}} of {{fixed object}}; {{axis}} is never crossed. {{state: dust level, wet or dry}}. {{props: count, owner, position}}. The {{mark}} stays on {{NAME}}'s {{LEFT}} {{feature}}; do not mirror.

【Event Script】
0-{{t1}} seconds: Frame one is already running: {{who is where, mid-what}}; {{one action}}; at the end, {{visible state}}.
{{t1}}-{{t2}} seconds: Still the same shot: {{one action}}; ① {{countable beat}} ② {{countable beat}}.
{{t2}}-{{G}} seconds: Still the same shot: {{one action}}. FINAL FRAME: {{framing, who where, prop state}}.
{{physics: preparation → contact at about X seconds → reaction → recovery; real weight; each foot planted before the other lifts; natural real-time speed}}
{{05b PERFORMANCE block}}

{{size}}, about a {{NN}}-degree field of view, camera {{height}} metres high, {{distance}} metres from {{subject}}; one move: {{start → end}}. {{02 CAMERA form, verbatim}} Every new framing is reached only by travel; the camera never passes through walls, glass or bodies.

The visuals feature {{02 core + variant, verbatim}}.
{{02 CONTINUITY line}}

【Maintain Consistency】
Keep {{NAME}}: {{identity line, side-named mark, costume phrase, verbatim}}; {{props}}; {{screen direction}}; {{light direction}}; the set stays fixed.

Audio includes <{{sfx 1, in event order}}>, <{{sfx 2}}>, <{{room tone}}>. {{02 AUDIO line, verbatim}} No music of any kind.
```
Variants: a **long take** (20–25 s, text-blocked) writes action to about 80% of G and makes the last range a hold or continuing motion; a **source for an extension** ends "{{subject}} is still {{moving}}; {{next beat}} has not begun." instead of FINAL FRAME; **one-line mode** keeps only the two audio lines and one 8–40-word sentence; a **robot shot** adds the non-human block to 【Subjects and Relationships】; a **continuity shot** adds the LAST APPROVED FRAME and PREVIOUS APPROVED CLIP lines.

**PT2 — Dialogue shot** (one speaking face; PT1 + 5.3 method A; MCU, frontal or three-quarter, about a 14–20-degree field of view, a steady head; the field-of-view range converts LEAK's 85–100 mm single takes [INFERRED])
```text
{{PT1 with these changes}}
Audio policy: the soundtrack holds only {{NAME}}'s speech from @Audio1 and the diegetic sounds named at the end. {{… rest of the audio policy line}}
【Reference Asset Roles】 + @Audio1 is {{NAME}}'s own voice and dialogue, the DIALOGUE AUDIO REFERENCE: {{5.3 method A binding, verbatim}}. {{NAME}}'s voice: {{01 voice descriptor}}.
【Subjects and Relationships】 + DIALOGUE LOCK: exactly {{N}} spoken lines in the whole take, each said once, in this order: {{line 1 by NAME}}{{, line 2 by OFF-SCREEN NAME}}. No other voice anywhere: no muttering, no murmured or half-heard speech. The descriptive sentences of this prompt are NOT dialogue.
【Event Script】
0-{{t1}} seconds: Frame one is already running: {{pre-line physical beat}}; lips closed.
{{t1}}-{{t2}} seconds: Still the same shot: Dialogue language: {{language}}, {{accent, plainly described}}. {{NAME}}'s line ({{2–3 delivery words}}), spoken to {{addressee}}: {SPOKEN}
{{t2}}-{{G}} seconds: Still the same shot: after the line, {{behaviour}}; lips stay closed. {{optional OFF line: From behind the camera, {{intention}}, {{OTHER}}'s line is heard, not lip-read.}} FINAL FRAME: {{framing, where the eyes are}}.
{{V.O. form: The line is voice-over: {{NAME}}'s mouth does not move on it; lips closed; as if spoken beside the camera, no reverb.}}
Camera: a {{locked | gently drifting}} medium close-up, about a {{14–20}}-degree field of view, focus on the near-side eye, no zoom.
Audio line: room tone, {{one diegetic sound}}; the line close and dry; the silence between lines stays empty.
```

**PT3 — Extension link** (`video_extension`; `extension_mode: forward` or `backward`; the source final by job ID as `video_references`; the scene's references plus the face sheet; source rule D-4, 5.8b)
```text
CONTINUATION. This shot continues @Video1 from its exact last frame, in the same unbroken take: the same {{location}}, the same grade, the same grain, the same light. @Video1 ends on {{framing and thirds; who stands where, facing which way; prop states and colours}}. The camera in @Video1 has been {{move}} at {{speed}}, and it goes on {{move}} at exactly the same speed. The first frame of this extension is identical to @Video1's last frame and the action flows on without a pause or a cut. Do not repeat its events.
ONE SHOT. Every change of framing is reached physically, on screen; the framing never jumps.
REFERENCES, KNOWLEDGE ONLY, NOT SHOTS. @Image1 is {{NAME}}: identity and wardrobe only. @Image2 is {{LOCATION}}: geometry, materials and light only. They are not framings, not camera positions, not moments of this shot.
GEOGRAPHY. {{who and what is where}}. {{Interior: the room is closed; nobody leaves, nobody enters.}} {{Exterior: the camera always follows a moving subject; hand-off: {{A}} to {{B}}, the new leader moving before the old one leaves.}}
ACTION. ({{0–t1}} s) {{beat}} · ({{t1–t2}} s) {{beat}} · ({{t2}} s to the end) {{beat}}. The shot ends still in motion: {{continuable end state}}. {{Next beat}} has not begun.
SPEED. Natural real-time speed throughout; no slow motion, no speed ramping, no time remapping.
SINGULARITY. Exactly {{N}} people; nothing duplicated.
LOOK LOCK. Every frame keeps the exact look of the source; nothing becomes cleaner, brighter, more colourful or sharper than @Video1.
AUDIO. Raw location sound carrying on the source's bed: <{{sfx}}>. No music of any kind. {{DIALOGUE LOCK if any}}
```
- **Backward variant:** replace the CONTINUATION paragraph with "This take ends on exactly the same frame @Video1 begins on: {{pose and orientation, prop position and state, the others' positions, background, camera position and composition, light, motion direction}}, so the two join into one unbroken take. @Image1 is the exact first frame of this shot; start precisely on it. Nothing from later in @Video1 appears early. For the final 2 seconds the camera holds @Video1's opening framing." (The Breach, THREAD.) Fill every field: The Breach shipped Higgsfield's own extension template with its placeholders unfilled `[STUDY]`.
- **Fixed-last-frame variant** (short link, about 9 s): "THE LAST FRAME IS FIXED: @Image{{k}}. The shot arrives on exactly that picture on the very last frame, still travelling until then; there is no static hold at the end."
- **Minimal variant** (Kimti): "{{one new beat}}. Static camera, restrained performance, no gimmicks, no dramatic camera movement."
- In pilot test T-E only, the ONE SHOT and LOOK LOCK lines may take THREAD's "= a failed take" form.

**PT4 — Transition** (three routes; 5.2 transition block)

PT4a — black-gap in-fill (`video_edit`; **pending pilot test T-C (b)**, 5.8). Frames: t s → t × 24 + 1.
```text
Edit @Video1. Using @Video1 as the only video basis, fill only the black placeholder between {{a}} s and {{b}} s. The black is the area to fill, not a story blackout or a transition. The result keeps the original {{T}} s, 24 fps, {{F}} frames and frame size.
Top priority: 0.000 ≤ t < {{a}} s and {{b}} ≤ t < {{T}} s are locked original video: keep the original frames; no regeneration, repaint, beautifying, regrade, crop or speed change. Counting the first frame as 1: frames 1–{{a×24}} and {{b×24+1}}–{{F}} stay frame-identical to the input, each at its original time; generate only frames {{a×24+1}}–{{b×24}}. Frame {{b×24+1}} is the input frame itself, not a similar reconstruction.
New action {{a}}–{{b}} s: picking up from frame {{a×24}}, {{subject}} {{continuous action}}; about {{a}}–{{x}} s {{sub-beat}}; about {{x}}–{{b}} s {{sub-beat}}. The camera keeps its {{height, direction, inertia}}; it passes through real openings, never through doors, glass or bodies.
The start matches frame {{a×24}} ({{pose, props, camera motion}}); the end flows naturally into frame {{b×24+1}} ({{pose, size in frame, camera height and speed, background}}). Never copy a boundary frame into a freeze. Every frame from {{a×24+1}} to {{b×24}} shows visible content.
It reads as one real take by one camera: no black, cut, hidden cut, dissolve, fade, morph or teleport. The original sound stays at its original time; add no dialogue, music or whoosh.
Everything not named above in @Video1 stays exactly as it is; nothing is replaced, added or removed.
```

PT4b — in-take transition through an occluder or a medium (`omni_reference`; no edit verbs; plates from 03 §3.1.10)
```text
{{audio policy line}}
【Generation Goal】
Generate one continuous take in which {{place A}} becomes {{place B}} without a cut: the shift happens {{behind a real object crossing the lens | inside {{medium}} that fully blocks the view | (DREAM only) as the surfaces of A resolve into B}}. Story job: {{…}}.
【Reference Asset Roles】
@Image1 is the STARTING LOCATION: geometry and light only. @Image2 is the TARGET LOCATION, a full environment the viewer stands inside; it resolves around {{NAME}}, never as a flat picture. @Image3 is {{NAME}}, IDENTITY: {{…}}. These references are knowledge, not shots.
【Subjects and Relationships】
{{NAME}} stays at the same floor position, unchanged, the fixed anchor while the world moves.
【Event Script】
0-{{t1}} seconds: Frame one is already running: {{A, in motion}}.
{{t1}}-{{t2}} seconds: Still the same shot: {{occluder route: a {{real object with weight}} sweeps across the whole picture for about half a second, edge to edge; behind it {{NAME}}'s framing stays the same size; when it clears, {{place B}} is already there}} {{DREAM route: the surfaces resolve in steps, mass, then edges, then material, then fine detail; contact shadows arrive one step late; mapping: {{A-thing}} → {{B-thing}}; … (4–7 pairs)}}.
{{t2}}-{{G}} seconds: Still the same shot: {{B, the action carries on}}. FINAL FRAME: {{…}}.
(t2 lies inside the first two-thirds of the take; natural real-time speed.)
{{camera: a late witness; it notices, turns and comes back to {{NAME}}; framing reached only by travel}}
{{02 visuals + CONTINUITY}}
【Maintain Consistency】
{{NAME}} does not transform. The shift is a physical event: no fade, dissolve, crossfade, overlay, second image underneath, wipe graphic or particles.
Audio includes <{{the occluder's own sound}}>, <{{the room resonance becoming {{new resonance}}}}>. No whoosh, no glitch sound. No music of any kind.
```

PT4c — bridge between two approved clips (`omni_reference`; `@Video1` outgoing and `@Video2` incoming as `video_references`, by job ID, ≤ 30 s together; The Breach's one-line bridge is in its film at medium confidence, the thinnest evidence here `[STUDY]`)
```text
@Video1 is the outgoing approved clip and @Video2 the incoming one. A bridge shot: it opens on {{the last state of @Video1: framing, pose, props, light}} and arrives at {{the first state of @Video2}}; in between, {{one action}}. One continuous take at real-time speed; no dissolve.
```

---

## Gate (what the user must approve)

- **G5-P, per shot, before the first draft:** the T1 packet (prompt, references, parameters, cost). Ask: «هل أرسل مسودتين بهذه الحزمة؟»
- **G5-D, per shot, before any final:** one draft take approved in the user's own words, logged in the ledger review cells (5.5), with 05b's G5b-C passed and the draft under 7 days old. Silence or a change of subject is not approval (old cinematic-pipeline rule).
- **G5-F, per shot, before 07 imports it:** the final passes Q1–Q20 and the user approves it in their words.
- **G5-T, per pilot test (5.11):** the user approves or rejects each result (T-C, T-D, T-F; T-E with 02) in their words, from the T7 card. Until then the current rule stays. Ask: «هل نعتمد هذه النتيجة وتسجيلها في الوصفة؟»
- **G5-PILOT (with 02 §2.13 and 03 §3.5):** both pilot scenes, assembled with rough sound and grade, are approved by the user in their words; `05-seedance/RECIPES_v1.md` is written with the test results and the production look's sha256. Ask: «هل نعتمد مشهدَي التجربة، ونصنع بقية الفيلم على الأساس نفسه تماماً (البرومبتات والمراجع والإعدادات وكتلة الستايل)؟» No production shot outside the pilot scenes is drafted before this yes.
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
| A reference binds to the wrong subject (a plate used as a face, a prop as a room) | handle count or order differs from `medias`; a tag lost on paste; a blank role line | the 5.4 lint; one role line per handle; handle N = the N-th entry of its media type |
| The prompt's end is missing in the read-back | a copy or paste tool cut it (LEAK lost its last shot and style block at 4,500 characters) | compare the `get_project_asset_prompt` read-back with the file; re-version |
| A cut to a reference's composition mid-take, or the images played as a slideshow | no knowledge-not-shots or anti-slideshow line | add both lines (5.2) |
| The camera jumps to a new angle | no travel sentence | "Every new framing is reached only by travel …" (5.2) |
| Shake, flicker or rain dies halfway | the behaviour is written once, low in the prompt | the refrain fix (5.2): line 1 of 【Generation Goal】 + a short repeat at each range |
| The robot shrinks, glides or looks pasted in | no scale, contact or light inheritance | the non-human block + the SCALE SHEET (5.2) |
| Extra lines, muttering, or lips moving on a V.O. | no line count; descriptive text read as speech | DIALOGUE LOCK; "NOT dialogue" sentence; the `OFF` / `VO` forms (5.3) |
| A long take drifts or rushes at the end | action written to the last second | write to about 80% of G and leave a tail (5.1) |
| A continuing shot restages the room | no continuity pair, or the PREVIOUS APPROVED CLIP line is missing | attach the pair with its role lines (5.1); log it |
| An extension link does not join | extended from a draft, or the source ended on a settle | extend only from the approved final by job ID; end sources mid-motion (5.8b); SSIM check at the join |
| Production shots stop matching the pilot | prompts, references or settings changed after `RECIPES_v1.md` | fill only the card's slots; any change is a new recipe version with the user's yes (5.11) |

---

## Sources and credits (checked 2026-10-30; Higgsfield route 2026-11-01; study update 2026-11-02)

- **Method learned from public Higgsfield projects** (studied 2026-11-02 through the Higgsfield MCP project tools; full studies in `prompt-library/studies/2026-11-02_<key>.md`, merged in `2026-11-02_CROSS-STUDY.md` §3B, §3C and §4.4). Method only: no character, face, design, prop, location, line or story is copied; short functional wording (role lines, locks) is adapted and attributed. Counts are the studies' own:
  - **The Breach** by `@sileent`: "Still the same shot:" per beat and FINAL FRAME; the role vocabulary (identity, location only, start frame, PATH GUIDE, GESTURE); the cast fence; "the camera never passes through the wall"; backward docking and the unfilled-template warning; the bridge shot (PT4c); the crop-safe prompt.
  - **Fukushima** by `@aist`: the frame-locked black-gap in-fill (PT4a); the refrain fix for a behaviour that drops out; the pose-sketch and prop-state roles; the in-take change of place inside a medium.
  - **Kimti** by `@ameerahmed`: the start-frame one-line mode; the one-sentence `video_edit` and the minimal extension; the anti-slideshow line; the length-versus-hit-rate data.
  - **SÉKOU** by `@mauriziocibelli`: the story job in the goal; the continuity pair (last approved frame + previous approved clip) and its role wording (pilot test T-D); the operator camera; identity stated three times; write 20 s, generate 25 s.
  - **LEAK** by `@creativemanifesto`: physics as process; dialogue line length and the after-line behaviour; the role label that wins over an element's name; the 4,500-character truncation and the "No dialogue" contradiction as lint items.
  - **UNPROMPTED** by `@shestak` (Cinema Studio, method only): STARTING / TARGET locations, the re-resolution law and A → B mapping for DREAM transitions, the change in the first two-thirds.
  - **THREAD** by `@pandaproduction`: the one-shot extension chain (docking sentence, last frame in words, carried camera speed, ONE SHOT / KNOWLEDGE NOT SHOTS / SPEED / SINGULARITY / LOOK LOCK sections, continuable end, about 8 drafts per link, frame matching); the one-change repair; "the descriptive sentences are NOT dialogue"; the window-frame wipe; "= a failed take" (pilot test T-E).
  - **TOKYO 4:17** by `@nicholastakeyama`: the readable stop after a fast move; the line-count lock; the generate-longer-than-the-edit tail; elements only, no media.
  - **In Passing** by `@julianmarshall` (mostly Cinema Studio; its Seedance prompts used): "the shot is already running when it starts"; the two-identity cap; "= a failed take".
  - **CONTROL** by `@pietromalegori`: the DIALOGUE AUDIO REFERENCE binding for supplied voices; the blocking-still role; a video reference outweighs a text negative.
  - **HUNGER** by `@sssacccade`: the non-human integration block, scale sheet and gait cycle; the box-curtain join; growth only between takes.
  - **Buzkashi** by `@sqr_studio`: both-limits acting (with 05b); the "element already in place" and anti-overlay lines; "= a failed take".

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
