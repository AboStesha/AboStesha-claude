# 05 — Seedance Production: Draft, Approve, 1080p Final (Step 5)

**Purpose.** Turn every approved shot into final picture with Seedance 2.5 alone. Each shot gets one prompt built to ByteDance's official contract, its Blender playblast as the motion reference, the 03 sheets as identity references, the locked 02 style prefix, SFX-only sound and, on dialogue shots, lips bound to the user's ElevenLabs take.
**Method.** Make a 480p draft first; the user approves one take; then make the 1080p final from that draft's task ID. Download every output the moment it exists, log it in the ledger, QC it, and iterate one variable at a time.
**Rule.** Talk to AboStesha in Arabic. Every prompt, file name, ledger cell (except their verbatim approval words) and QC note is in English. This module owns the assembled prompt, handle spelling, API fields, music and subtitle suppression wording, the draft and final runs, and `scripts/seedance_byteplus.py`. `05b-acting-direction.md` owns the PERFORMANCE and DIALOGUE blocks inside the prompt.

Tags: `[OFFICIAL]` BytePlus ModelArk docs, read as Markdown on 2026-10-30 · `[FIELD]` a practitioner skill's tested rule · `[HOUSE]` our default · `[UNVERIFIED]` confirm on the first live call · `[TESTED]` run in this session (mock server only; no live key).

---

## Inputs

| Input | From | Used in |
|---|---|---|
| Blocking table, `_PB_` playblast (24 fps, exactly G s, silent), stills, `_DLG_` track, hand-off sheet with the blockout clause | `04-blender-blocking.md` T1, T3, §4.9 | 5.1, 5.2 |
| Character, location and prop sheets; `asset://` IDs or trusted Seedream originals; the D1 route result (T1); role lines | `03-assets-images.md` §3.1, §3.3, §3.4 | 5.1, 5.2 |
| `prefix/seedance.txt` + variant ID per shot; reserved green `#3BD16F` rule | `02-style-prefix.md` §2.7 D, §2.11 | 5.2 |
| Beat map; PERFORMANCE and DIALOGUE snippets A–G; bible voice lock | `05b-acting-direction.md` | 5.2, 5.3 |
| Line IDs, MODE (`ON`, `ON-WIDE`, `OFF`, `VO`, `PHONE`), SPOKEN text, language, voice descriptor, selected takes | `01-script-and-dialogue.md` §1.2 | 5.3 |
| Story date and time, sun, IN/OUT states, physics rules, DREAM exception register | `ledger-continuity-physics.md` L.6, L.7 | 5.2, 5.5 |
| Calendar (drafts D7–D13, all finals in by D14), share targets, D1 tests T1–T6 | `00-award-brief-and-calendar.md` §0.4, §0.7, §0.8 | 5.0, 5.10 |
| `ARK_API_KEY` in the environment; BytePlus account activated for Seedance 2.5; a private TOS bucket in `ap-southeast-1` | the user | 5.0 |

## Hard rules

1. **Seedance 2.5 only** for final picture: `dreamina-seedance-2-5-260628`, pinned in `version-pins.md` (ledger L.3). Never mix in 2.0 shots without the user's yes. The official FAQ warns that 2.0 and 2.5 have visibly different aesthetics `[OFFICIAL]`.
2. **Draft first, always.** A final exists only as `draft_task` → 1080p from a draft the user approved in their own words. Never re-run an approved prompt at 1080p: that is a new take, not the approved one `[FIELD: scenario-labs]`.
3. **One job per generation.** Each generation has one primary task (reference generation, edit or extension), one shot with one camera and no internal cuts, and one speaking face. 04 already gives every shot its own camera. Multi-shot generations land planned cuts poorly: in one community benchmark only about 73% of 16 cut boundaries fell within ±0.6 s (04 research).
4. **No parameters in prose.** Ratio, duration, resolution, fps and the sound switch go in the API body only `[OFFICIAL: sd25-pe]`. The script warns on `16:9`, `1080p`, `fps` and similar words.
5. **Never resubmit a task that is still running or that timed out locally.** Poll it by ID. A second submit bills a second video `[FIELD: arkcli-gen, Apache-2.0]`.
6. **Download, hash and log in the same turn** a task succeeds. URLs live 24 h and allow at most 100 downloads `[OFFICIAL]`. Ledger rule 4.
7. **No music from Seedance.** It makes SFX and ambience, plus speech only where a lip-sync shot needs it. Score comes from `06-music-and-sfx.md`.
8. **Never evade moderation.** No cropping, blurring or restyling a face to slip past the filter, and no wording tricks. Change the route or the content (5.9; 03 §3.3 rule 1).
9. **Provenance untouched.** Keep the original API files, never remux them, and never crop a watermark (Terms cl. 5.6). `watermark` defaults to `false` and is disclosed. Generating without a watermark is not removing one.
10. **Finals via the API, never the ModelArk Playground.** The Playground terms grant internal, non-commercial use only (route research, 2026-10-30).
11. **Holdback.** References are fetched from private presigned URLs, never a public bucket or an "anyone with the link" share.
12. **One variable per iteration**, logged (5.6). A defect copied from the playblast is fixed in Blender (04), not in the prompt.
13. **G-rated content.** Re-check every beat 01 flagged before spending. A moderation block on violence, substance or IP words is a content signal (5.9).

---

## Procedure

### 5.0 Route, account and verified facts (session start)

**Route decision** (BRIEF: BytePlus or Higgsfield, comparison pending; show it to the user once and record the choice in `decisions.md`):

| Route | Draft → final from the same take | 1080p | Price at 1080p (list, 2026-10-30) | Logs and trust | Verdict |
|---|---|---|---|---|---|
| **BytePlus ModelArk API** (`scripts/seedance_byteplus.py`) | yes: `draft: true` then `draft_task` `[OFFICIAL]` | native, 10-bit HEVC | $0.569/s without video input; 10 s with a 10 s playblast ≈ $6.80 `[OFFICIAL]` | task IDs, `usage`, raw JSON; same-account trusted outputs | **primary** `[HOUSE]` |
| **Higgsfield MCP** `generate_video`, model `seedance_2_5` (Claude drives it directly in chat) | **yes** `[TESTED 2026-10-30 via models_explore]`: `draft: true` gives a 480p draft; finalize it at 1080p with `draft_job_id` within **7 days** | yes; set `bitrate_mode: "high"` for finals | `get_cost` 2026-10-30: draft **3 credits/s**, 1080p (fresh or finalized from a draft) **16 credits/s**, 720p 7 credits/s; credit price on the user's account $0.0446 (4,000-credit pack) to $0.05 (auto-refill) → draft ≈ $0.13/s, 1080p ≈ $0.71–0.80/s. Effect of a video reference on credits not yet measured | job IDs from the tool result (log them); modes `t2v`, `omni_reference`, `video_edit`, `video_extension`; 4–30 s; media roles `start_image`, `end_image`, `image_references`, `video_references`, `audio_references` | **full route**, equal to BytePlus; counts toward the 70% (cl. 5.4 allows third-party platforms when generation runs through Seedance; disclose platform, Seedance 2.5, account per cl. 5.5(a)) |
| Higgsfield web app, Seedance 2.5 Draft Mode (manual) | yes | yes | same credits as the MCP | job IDs pasted by the user | same account as the MCP route |
| ElevenLabs connector `bytedance-seedance-v2.5` | no draft flag seen `[UNVERIFIED]` | yes | credits | flow and generation IDs | tests only |

**Choosing between the two full routes.** Same model (Seedance 2.5), same prompt syntax. Pick one at D1 after tests T1–T3 and keep **one route per character for the whole film** (face approvals and same-account trusted outputs do not carry across accounts). BytePlus: about 15–20% cheaper, `return_last_frame`, 10-bit/mov masters, but needs `ARK_API_KEY` and the script. Higgsfield MCP: Claude runs drafts and finals in chat with no key handling, failed generations are refunded; check on D1 how it treats real-looking face references and whether outputs carry provenance metadata (never strip it, rule 5).

**Verified API facts** `[OFFICIAL]`:

| Item | Value |
|---|---|
| Create / retrieve / list | `POST` / `GET …/{id}` / `GET` on `https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks`; header `Authorization: Bearer $ARK_API_KEY` |
| Roles | `first_frame`, `last_frame`, `reference_image`, `reference_video`, `reference_audio`. First/last-frame mode and reference mode **cannot be mixed** in one request. Every reference asset needs its explicit role `[OFFICIAL]`; arkcli-gen reports HTTP 400 without it `[FIELD]` |
| Inputs | images: URL, Base64 or `asset://`; videos: URL or `asset://` only; audio: URL, Base64 or `asset://` (arkcli reports inline audio rejected `[UNVERIFIED]`, so prefer URLs) |
| Limits | 30 images (< 30 MB, 300–6000 px, aspect 0.4–2.5) · 10 videos (mp4/mov H.264/H.265, 2–30 s each, 30 s total, ≤ 200 MB, 24–60 fps, 407,696–8,295,044 px) · 10 audio (wav/mp3, 2–30 s each, 30 s total, ≤ 15 MB) · body ≤ 64 MB · prompt ≤ 1,000 English words recommended |
| Output | 24 fps; 480p/720p 8-bit; **1080p 10-bit H.265** (mp4); `mov` = H.264 4:4:4 + PCM; audio always mono; `duration` 4–30 or −1 (default −1); returned `duration` = floor(frames ÷ 24) |
| Draft | `draft: true` needs `resolution: 480p`. The final takes `content: [{type: draft_task, draft_task: {id}}]` with `resolution: 1080p` (required, the only value). It **must not resend** prompt, images, videos, audio, `duration`, `ratio`, seed, `generate_audio` or `omni_reference_task_type`; it errors even if they are identical. It may re-set `return_last_frame`, `output_format`, `watermark`, `service_tier` (default only, for 2.5), `priority`, `execution_expires_after`, `callback_url` and `safety_identifier` (omitted ones revert to defaults) |
| Lifetimes | draft IDs created after 2026-10-28 10:00 UTC+8: **14 days**; other task IDs 7 days; video and last-frame URLs 24 h, 100 downloads |
| Not settable on 2.5 | `seed`, `camera_fixed`, `frames`; `service_tier: flex` |
| Other fields | `omni_reference_task_type` `auto`/`reference`/`edit`/`extend`; `priority` 0–9 (queue order within one endpoint); `execution_expires_after` 3600–259200 s (default 172800); `return_last_frame` (JPEG, no watermark) |
| Rate limits | individual: 180 RPM, **3 concurrent** (extra tasks queue); enterprise: 600 RPM, 10 concurrent; retrieve 20 QPS; list 1 QPS |
| Price | tokens = (input video s + output s) × W × H × 24 ÷ 1024. USD per 1M tokens: 480p/720p **$10.70**, 1080p **$11.70**; with video input **$6.40 / $7.00**. A minimum charge applies with video input. Draft = a normal 480p video; the final is billed separately at 1080p using step 1's input-video seconds. Failed and moderated tasks are free |

The cost formula reproduces the official examples exactly ($0.514 for 5 s at 480p; $2.843 for 5 s at 1080p) `[TESTED]`. Typical shot, G = 7 s with a 7 s playblast: draft **$0.86**, final **$4.76**. Without video input: $0.72 and $3.98.

**Account checklist** (D0–D1; the user does the console steps, Claude walks AboStesha through them in Arabic):
1. Activate Seedance 2.5 with one of: balance above USD 30, a USD 30+ AI Savings Plan, or a Seedance resource pack. Create the API key in the **AP region** (keys are region-bound). Export it as `ARK_API_KEY` in the shell only.
2. Create a private TOS bucket in `ap-southeast-1`. Turn on **TOS data subscription** so outputs land there untouched; originals are what keep same-account trust (5.8).
3. Enterprise verification lifts concurrency from 3 to 10 and is also what 03's private portrait library needs. Start it on D0.
4. Run the L.3 pin check daily. List the live models; on any change, stop and re-run the canary.

**05's day-1 tests** (they extend 00 §0.8; report them in one table before production spend):

| Test | Method | Pass |
|---|---|---|
| T2 Lip-sync (00) | one English and one Arabic ON line through 5.3, method A; measure the offset (5.5 Q14) | ≤ 1 frame lead, ≤ 2 frames lag; words identical |
| T3 Draft → final (00) | one draft, its final, a 3-up comparison (5.7) | identity, action and timing unchanged |
| T4 Provenance (00) | `c2patool` and verify.contentauthenticity.org on a raw final. The official C2PA guide (2026-10-30) lists only the Seedance 2.0 family as credentialed, not 2.5 | record what the file carries |
| 05-T7 mov in Premiere | import one `mov` final (H.264 4:4:4) and one `mp4` final (HEVC 10-bit). Forum reports describe colour shifts on H.264 4:4:4 in Premiere | pick the default `output_format` |
| 05-T8 `generate_audio` on a lip-sync shot | the same ON line drafted with `true` and with `false` | keep whichever syncs; default `true` |
| 05-T9 Draft on an edit task | one audio-only edit (`omni_reference_task_type: edit`) drafted, then finalised | if refused, edits run direct at 1080p with the user's yes (`draft --task-type edit --direct-1080p`) |
| 05-T10 Final after the reference URLs expire | sign the T3 draft's references for 3600 s and finalise it more than an hour later. The final reuses the draft's references and cannot resend them; whether it re-fetches the URLs is unpublished | if it fails, sign every reference for at least 5 days (the house finalise window) |

### 5.1 Build the shot packet

**Entry: AboStesha asks for one shot's prompt** («سوي لي برومبت سيدانس للمشهد 4 لقطة 2»).
1. **Resolve the ID.** «المشهد 4 لقطة 2» means scene `S04`, shot `SH02`, so `S04-SH02` (the frozen scene IDs from 01 §1.1.3, zero-padded). Confirm the row in `ledger/SLA_SHOTS.csv` or 04's shot list. If it is missing, or S04 was renumbered, show the S04 rows and ask which shot they mean.
2. **Check the inputs** in the table above and show them as a ✓/✗ list in Arabic: 04 hand-off row and `_PB_` (or the STILL/TEXT triage), 03 approved references and the T1 route, `prefix/seedance.txt` and the shot's variant, 05b's approved bible (G5b-A) and the S04 scene read (G5b-B) with the beat map, and for dialogue the 01 line IDs, the selected takes and the T2 result.
3. **All present:** build the packet (below), write the prompt (5.2, plus 5.3 for dialogue) and show the T1 packet card. Ask the G5-P question. Nothing is submitted and nothing is billed before their yes.
4. **Something missing:** say what is missing and which earlier gate owns it (SKILL.md §3, jumping ahead). If they still want to see the prompt now, write it as a **PREVIEW**: every missing input stays a visible slot such as `{{MISSING: 02 prefix/seedance.txt R-DAY}}` or `{{MISSING: 05b PERFORMANCE block, S04 scene read not approved}}`. Never fill a slot from memory or invention: not the 02 look text, the 04 blockout clause, 05b blocks, asset handles or line text. A PREVIEW is saved as `prompt_v00_PREVIEW.txt`, it is never submitted, it gets no ledger row, and the script must never be pointed at it.
5. The 05b blocks (PERFORMANCE / DIALOGUE) come from 05b §5b.3 and its snippets A–G; 05 only places them in the slot.

**Folder** (mirrors 04; git tracks `.txt`, `.md`, `.csv`; binaries are git-ignored and kept on Drive and TOS):
```text
films/01-second-life-ascent/05-seedance/S03/S03-SH02/
  prompt_v03.txt            (the exact submitted text; its sha256 goes in the ledger)
  refs_v03.md               (each @handle → file, asset ID, role, what it supplies, what it must not supply)
  SLA_S03-SH02_SD25-DRF_v03_t1.mp4 … _t2.mp4   (480p, never imported into Premiere)
  SLA_S03-SH02_SD25-FIN_v03_t2.mp4 + _LF.jpg   (1080p final + returned last frame)
  qc_v03_t2.md              (5.5 checklist, Claude's notes, the user's verdict)
```

**Pick the generation mode per shot** (from 04's triage):

| 04 mode / need | Seedance request | Constraints `[OFFICIAL]` |
|---|---|---|
| BLOCK (playblast) | reference task: `@Video1` = `_PB_`, identity and location images, optional `@Audio` lines; `omni_reference_task_type: reference` | any ratio (use `16:9`); `duration` = G |
| STILL (layout still) | reference task with images (+ audio); camera and drift written in the prompt | same |
| Shot must open on an exact state (continuous action) | **reference mode:** the previous final's `_LF.jpg` as `@Image1` plus the sentence `Use @Image1 as the first frame.` Or **first-frame mode** (`role: first_frame`), which is strict but takes **no** playblast, audio or other references | first-frame mode: `ratio: adaptive`. In reference mode frame one follows the reference world unless an image anchors it `[FIELD: scenario-labs]` |
| Fix inside an existing final | edit task (5.8) | `ratio: adaptive`, `duration: -1`, source 4–30 s |
| Need more head or tail | extend task (5.8) | `ratio: adaptive` |
| TEXT (HUD, inserts) | none: post graphics (04 §4.1, 07) | counts as non-Seedance (00 §0.4) |

**Reference set rules:**
- **Order by first appearance.** Upload character images in the order the characters first appear and number the handles to match. This is the official fix for swapped identities and voices `[OFFICIAL FAQ]`.
- **Hold the working range.** Use 1–8 subject images and 1–5 audio or video subjects of about 5–10 s each `[OFFICIAL]`. The 50-asset cap is a ceiling, not a target.
- **One subject per asset.** Identity comes from 03's `turn3` (face on one panel only) or the registered `asset://` group. Locations come from face-free plates; props from their sheets. Wardrobe states are separate assets (03), never prose.
- **Never upload an unassigned asset.** If one is uploaded anyway, list it under `【Unused Assets】` (sd25-pe).
- **Faces.** Only references that passed T1 are allowed: `asset://` IDs, unedited same-account Seedream 5.0 text-to-image originals, or same-account Seedance outputs and last frames under 30 days old. GPT Image, Nano Banana or Midjourney faces go in only as registered assets (03 §3.3).

**Reference hygiene:**
- **Images.** Resize to ≤ 1920 px on the long edge. Larger AI images cause fingerprint-like textures in foliage and grass `[OFFICIAL FAQ]`. Convert JPEGs with non-standard chroma subsampling with `ffmpeg -i in.jpg -pix_fmt yuvj420p out.jpg`, or they fail with HTTP 400 `[OFFICIAL FAQ]`. The script checks both.
- **Playblast.** Use only an APPROVED `_PB_` that passed 04's ffprobe check: h264, 1920×1080, 24/1, exactly 24·G frames, no audio stream. Send `--video-seconds G` so the cost is right.
- **Hosting.** Videos need a URL. Upload to the private TOS bucket and give BytePlus a **GET presigned URL**. Until 05-T10 passes, set its expiry to cover the queue and the 5-day finalise window, not just the submit. The official best practice uses the internal endpoint `<bucket>.tos-ap-southeast-1.ibytepluses.com` `[OFFICIAL]`. Make the URL with the TOS console or the official `tos` SDK snippet, never with a public-read bucket. The ledger stores the URL without its signature (the script strips the query string).
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

**Handles.** Write `@Image1`, `@Video1`, `@Audio1`: no space, numbered by upload order within each media type. This is the form in the official API examples and sd25-pe; the prompt guide also shows `@Image 1`. Never mix the two forms in one prompt. Every module in this skill (03 role lines, 05b snippets, 06 and 07 edit templates) already uses the unspaced form. Never name an `asset://` ID in the prompt (the script refuses).

Why this shape:
- The labelled sections and the one-subject-per-line mapping follow sd25-pe 0.1.1, the official compiler.
- The audio constraint appears at the start and again at the end, with the music words listed out. That is the official fix for BGM leaking through a plain "no BGM" `[OFFICIAL FAQ]`.
- `【】` is also Seedance's subtitle syntax. Check drafts for rendered label text (Q19). If a label ever renders, switch that shot to plain `Generation goal:` labels and log the change.
- **No edit or extension verbs in a reference prompt.** The model re-classifies the task from the prompt even when `omni_reference_task_type` is `reference`, and a mismatch fails with `TaskTypeMismatch` `[OFFICIAL]`. Keep out *edit, add, remove, delete, replace, change, modify* and *extend, continue, continue from*. "Continuous" is fine: the official examples use it.

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

**Worked example — S03-SH02** (BLOCK, R-DAY, no dialogue; IDs from 04's hand-off; Miraj via `asset://`, robot via `asset://`, location plate face-free):
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
API: `ratio 16:9`, `duration 7`, `generate_audio true`, `omni_reference_task_type reference`, `--video-seconds 7`. The second ranges come from 04's beat frames ÷ 24: robot enters f84 (3.5 s), train f97–f160 (4.0–6.7 s), contact f133 (5.5 s).

### 5.3 Dialogue shots: lip-sync to the user's ElevenLabs takes

**What is verified, and what is not:**
- `[OFFICIAL]` An audio reference supplies music, dialogue, voice, tone or timbre. The guide's binding example names which character, shown in which image, uses the voice timbre of which audio clip.
- `[OFFICIAL: sd25-pe]` By default reference audio gives only timbre, accent, rate and emotion, and the `{}` text decides the words, **unless the prompt asks to reuse the dialogue in the audio**.
- `[OFFICIAL]` `generate_audio: true` makes the model generate its own voice, effects and music. Output is always mono.
- No BytePlus page promises that the output contains the uploaded file verbatim, or that lips lock to it frame by frame. So Seedance re-performs the line. The plan (07 §7.7) lays the ElevenLabs master under the picture, which works only if Seedance's performance keeps the take's timing.
- `[OFFICIAL, Seedance 2.0 FAQ]` Describing the voice's characteristics in the prompt improves voice match.
- `[FIELD: scenario-labs, MIT]` A track the prompt does not claim is easily ignored; the binding wording is "@audio1 is her own voice; she speaks it to camera, lips in sync".
- 05b §5b.6 covers framing, word budgets and the edit-window minimums.

**Audio upload copy** (one file per voice, never the mixed `_DLG_`):
1. Take the selected take from 01 and place it at its line marker inside a silent bed exactly G s long. Never trim, speed up or re-time speech (01 §1.2.6):
   `ffmpeg -i SLA_S11-SH05_S11-L06_MIRAJ_T02.wav -af "adelay=delays=1000:all=1,apad=whole_dur=6" -ar 48000 -ac 1 SLA_S11-SH05_S11-L06_MIRAJ_T02_PAD.wav` (05b).
   The file must be at least 2 s long `[OFFICIAL]` and at most 15 MB. A 30 s total per request allows at most one or two voices per shot.
2. Host it like the playblast (TOS presigned URL). Inline Base64 is documented but reported rejected `[UNVERIFIED]`.
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
API: `ratio 16:9`, `duration 6`, `generate_audio true`, `--audio "S11-L06_T02::<presigned URL of …_T02_PAD.wav>"`, no video. The green is named only because an assistant device is in frame (02 §2.5), with its hex attached to the ring and never in brackets: `()` is Seedance's music syntax, and 02 bans brackets in the look text.

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
| **F2 Seedance audio edit** | edit task on the **original** approved final (TOS file, under 30 days old, so trusted): "Edit @Video1, replacing only Miraj's speech with the speech in @Audio1, reusing its words and timing exactly; adjust only his lip movements word by word to match; keep everything else unchanged" plus the 5.8 scope-closure sentence. `[UNVERIFIED]` for supplied audio: the official examples re-dub with model speech | "lip movement re-timed by a Seedance 2.5 edit task conditioned on the ElevenLabs v4 line" | none: an edit stays `SD`. Costs input plus output tokens |
| **F3 Keep Seedance's own voice** | the user accepts the voice Seedance performed in the ElevenLabs timbre; DX for that line comes from the Seedance track | "voice performed by Seedance 2.5 using the ElevenLabs v4 voice as timbre reference; synthetic" | picture unchanged. The DX stem becomes `SD`, which **raises** the R3 audio share. Voice consistency across shots must be re-checked |
| **F4 Restage** | cut to the listener, over-the-shoulder, or `OFF` framing (05b snippet D); the ElevenLabs line plays over picture that needs no lip-sync | none extra | none: stays `SD`; a story choice for the user |
| **F5 External lip-sync** (last resort, explicit yes) | a lip-sync model re-renders the mouth on a copy of the Seedance final (e.g. Higgsfield `sync_so`, Sync Lipsync 3, listed in the 26 Sep MCP snapshot `[UNVERIFIED]` live) | the tool, version and seconds in the AI disclosure as a support tool; the original Seedance file and row kept | the derivative row classes as `SD-COMP` under L.5's house rule (Seedance plate fills the frame). The Organizer's method is unpublished, so cap F5 at **≤ 5% of T** in total and add the question to the 00 §0.9 email. Name the copy with a new derivative OP code `LSY` (add it to ledger L.1's OP list) |

**Other modes:**
- `VO` and `PHONE` lines bind the audio to the source ("@Audio1 is Noah's broadcast voice heard from the wall screen; nobody in frame speaks"). Every visible mouth stays closed.
- Noah has no mouth: nothing on his head panel moves with speech (03, 05b F).
- `ON-WIDE` lines use the same binding without the close-up rules.

### 5.4 Run the draft (480p)

```bash
cd films/01-second-life-ascent
SB=../../skill/abostesha-film-pipeline/scripts/seedance_byteplus.py   # used by every command below
python3 -I $SB draft \
  --shot S03-SH02 --version 3 --take 1 --prompt-file 05-seedance/S03/S03-SH02/prompt_v03.txt \
  --image "CHR_MIRAJ::asset://<id>" --image "CHR_ROBOT::asset://<id>" --image "LOC_METRO-WALKWAY::<presigned URL>" \
  --video "PB_v03::<presigned URL of SLA_S03-SH02_PB_v03.mp4>" --video-seconds 7 \
  --duration 7 --ratio 16:9 --generate-audio true --task-type reference \
  --ledger ledger/SLA_LEDGER.csv --out-dir 05-seedance/S03/S03-SH02 --account "<ModelArk login/project>" \
  --human "AboStesha approved beat text and blocking v03" --dry-run
```
- **Always `--dry-run` first.** Read the printed body and cost, then show the T1 packet card. Submit only after the user's yes on the packet. One yes covers that shot's takes inside the 5.6 budget.
- Then drop `--dry-run` and add `--wait`. The script posts, stores `ledger/inflight/<task>.json` (L.2's in-flight list), polls every 20 s, downloads the video, writes `ledger/raw/<gen_id>.json` and appends a ledger row (outcome, cost from `usage.completion_tokens`, draft expiry, ffprobe summary).
- **Script guards.** It refuses a request whose output name an OK row or a live task already owns, so a second take needs `--take 2`. It refuses an `@Image3` when only two images are uploaded, and warns on uploads the prompt never names. The dry run hides presigned-URL signatures.
- **Takes.** Submit **2 takes** of the same version; Seedance has no seed, so takes differ. Individual accounts run 3 tasks at once and queue the rest. Submit the hardest shots first (00 §0.7, from D7).
- **Why drafts pay.** For a 7 s shot with a playblast, 2 drafts + 1 final ≈ $6.48, against ≈ $9.53 for 2 direct 1080p takes. Drafting saves money only through the takes you discard; finalise only the take you keep `[FIELD: scenario-labs]`.
- **If the shell dies:** `poll --task-id <id> --wait`. If an ID is lost: `list --status running` (1 QPS). Never resubmit.
- Drafts default to `mp4`. Set `watermark false` unless the user decided otherwise, and record the decision.

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
| Q20 | Tech (finals) | not 1920×1080; not 24/1; frames < 24·G − 1; HEVC `yuv420p10le` (mp4) or H.264 `yuv444p…` (mov; bit depth unpublished, record what ffprobe shows) missing; audio not mono |

**Verdict per take:** `APPROVE` · `ITERATE` (name the one variable) · `REBLOCK` (send back to 04 with the defect and timecode) · `CUT` (talk to the user about the shot).

Show the T2 review card. When the user approves, run:
`python3 -I $SB review --task-id <draft id> --status APPROVED --words "«...their words...»" --ledger ledger/SLA_LEDGER.csv`.
This sets the shot's status to DRAFT-APPROVED (L.4). The 05b take gate G5b-C must also pass.

### 5.6 Iteration discipline

- **Change one thing per version** and write it in the iteration log (T5): a prompt sentence, a reference, the playblast version or a parameter. Bump `v` when the prompt or references change; `t` counts takes of one version (ledger L.1).
- **Budget per shot:**
  - 2 takes × up to 3 versions = **6 drafts** (≈ $5 at 7 s with a playblast).
  - Then stop and redesign the shot: split it, remove an action, change the angle, or re-block.
  - Hero shots may get up to 10 drafts with the user's yes.
  - When 4 takes fail the same way, a variable is missing from the prompt or blockout (07 §7.5).
  - After 10–15 failed iterations the problem is never the wording (OSideMedia via 05b; OpenMontage, paraphrased).
- **Fix at the right layer.** A defect copied from the playblast goes back to 04. An identity defect goes to 03's references. Physics goes in the event script. Performance goes through 05b snippet G.
- **Judge the whole clip, never a single frame.** A good still can come from a take that falls apart at second 5 (OpenMontage, paraphrased). Land cuts on movement.
- **Do not compensate with adjectives.** Never add quality packs ("8K, masterpiece"); sd25-pe forbids unrequested packs.

### 5.7 Final from the approved draft (1080p)

**Before submitting:**
1. Check the draft row is `APPROVED` with the user's words. The script refuses otherwise.
2. Check the draft is younger than its expiry (14 days, official). The house rule from 00's daily close still applies: finalise or kill every approved draft before it is 5 days old. Ledger L.2 and the script both write the official date into `draft_expires_utc`; the 5-day rule is stricter than the official 14 days and the mirrors' 7.

```bash
python3 -I $SB final --draft-task-id <draft id> --output-format mp4 \
  --ledger ledger/SLA_LEDGER.csv --out-dir 05-seedance/S03/S03-SH02 --wait
```
- The body is only `model`, the `draft_task` item, `resolution 1080p`, `output_format`, `return_last_frame true`, `watermark`, `priority 5` (finals jump ahead of queued drafts) and `execution_expires_after`. The mock-server test asserts that nothing else is sent `[TESTED]`.
- **`output_format`:**
  - Default `mp4`: HEVC 10-bit 4:2:0, which Premiere imports (confirm in 05-T7). Use `mov` (H.264 4:4:4 + PCM) when the shot will feed an edit or extension, which is officially recommended for those, or when 05-T7 shows Premiere handles it.
  - Both formats from one draft would need two finals: two billed generations, each of which may differ in detail. A second final is named `_f2`.
- **Review the final against its draft:**
  `ffmpeg -i PB.mp4 -i DRF.mp4 -i FIN.mp4 -filter_complex "[0:v]scale=-2:360[a];[1:v]scale=-2:360[b];[2:v]scale=-2:360[c];[a][b][c]hstack=inputs=3" -an qc_3up.mp4`.
  - The docs call the final a new, "consistent" generation that reuses prompt, references, seed, audio setting, ratio and duration. Scenario-labs saw its completions match the draft on every sampled frame. Review every final anyway.
  - Re-run Q1–Q20, with special care on eyes, blinks and lip closures (05b §5b.9) and Q20 tech.
  - If identity or action drifted: make a second final from the same draft (`--f-index 2`) or re-draft. Ask the user which.
- Approve the final with the user's words (`review` command). Then set the shot to FINAL-APPROVED in `SLA_SHOTS.csv`.
- Hand the final to 07 for import, keep the `_LF.jpg` for continuity, and give 06 the SFX events with seconds.
- Make sure the original is in TOS: data subscription, or upload the untouched file.

### 5.8 Fixes after the cut: edit and extend tasks

Use these for 07 §7.5 rank-3 fixes and 08 notes. The result stays `SD`.

- **Source.** Always the **original** final from TOS, unedited and under 30 days old. A face-containing clip loses trust once it is trimmed, re-encoded or forwarded `[OFFICIAL]`.
- **Edit settings.** `omni_reference_task_type: edit`, `ratio: adaptive`, `duration: -1`, a source of 4–30 s (≤ 20 s recommended), the prompt starting with "Edit @Video1, …".
  - Every edit prompt names exactly what changes and closes the scope. House wording, paraphrasing sd25-pe: "Everything not named above in @Video1 (people, props, background, camera, timing, sound) stays exactly as it is; nothing is replaced, added or removed."
  - For a moving replacement, the new object inherits the old one's timing, path, speed and occlusions (motion-slot replacement, sd25-pe).
- **Edit duration.** The output can be up to 0.4 s shorter than the source. If length matters, give the source a frame count of 8n+1, e.g. 169 frames for about 7 s `[OFFICIAL FAQ]`. Or switch to a reference task with an exact `duration`.
- **Audio-only edit** (06 found music inside a clip):
  - Prompt: "Edit @Video1. Remove only the background music. Keep the character dialogue, lip sync, ambience, action sound effects and all visuals unchanged."
  - Post isolation is the alternative. It also removes the SFX `[OFFICIAL FAQ]`.
- **Extend.** `omni_reference_task_type: extend`, `ratio: adaptive`, mov in and out.
  - Forward: describe the boundary state first, then the new action.
  - Backward: describe the new action first, then end on the source's first frame. Nothing from later in the source may appear early (sd25-pe).
  - State that each subject stays one continuous instance.
- **Running them.** `draft --task-type edit|extend --output-format mov`, then `final` as usual. The script names the result `_SD25-EDT|EXT_vNN_tK_eNN` (L.1); `--e-index` counts the passes on one source. If 05-T9 shows edits cannot be drafted, `draft … --direct-1080p` runs the task once at 1080p, only after the user's yes.

### 5.9 Moderation failures and API errors

Moderated and failed tasks are not billed `[OFFICIAL]`. The script logs every failure as `FILTERED` or `FAILED` with its code, including rejections made at submit time. Change content or route, never pixels or spelling tricks. Tell the user in Arabic what was blocked and what you propose.

| Code `[OFFICIAL]` | Likely cause here | Action |
|---|---|---|
| `InputImageSensitiveContentDetected.PrivacyInformation` / `InputVideo….PrivacyInformation` | a realistic face in an untrusted image or clip; a Seedance clip that is re-encoded, trimmed or over 30 days old | use the T1 route (`asset://` or a trusted original); for edits, the untouched TOS original (5.8) |
| `Input*SensitiveContentDetected.PolicyViolation` | IP-like design, a logo, a brand or a famous character in a reference or the prompt | redesign the asset in 03; remove brand words |
| `InputTextSensitiveContentDetected` | violence, substance or weapon wording; e.g. a vest, khaini or alcohol beat that 01's G1 check should already have removed | content fix in 01 (G-rating); never synonyms to sneak it through |
| `InputAudioSensitiveContentDetected` (`.PolicyViolation` = copyright) | the ElevenLabs file carries music, a bed or a voice that sounds like a real person | send the dry voice-only `_PAD.wav`; a designed voice, never a clone of a real person without consent (01) |
| `OutputVideoSensitiveContentDetected` (`.PolicyViolation`) | the finished render was screened; the filter belongs to the model family, so an identical retry usually fails again `[FIELD: scenario-labs]` | simplify the content of that beat; one retry only after a real content change |
| `OutputAudioSensitiveContentDetected` | generated speech or sound screened. A field report blames long "no music" exclusion lists `[FIELD: scenario-labs]` | re-draft with sound described positively only (drop the exclusion list for that shot); strip any music in post (06) |
| `InvalidParameter.TaskTypeConstraint` / `.TaskTypeMismatch` | edit or extend wording in a reference prompt ("replace", "change", "continue"), or wrong ratio/duration for the task type | `--task-type reference`; reword with no edit verbs (04 §4.9) |
| HTTP 400 image decode (`invalid image: heic: decode failed`) | non-standard JPEG chroma subsampling | `ffmpeg -pix_fmt yuvj420p`, or PNG |
| 400 `role must be specified …` / `reference_video must be provided as a web url` | a missing role; an inlined video | the script always sets roles; host videos |
| 429 `RateLimitExceeded…` / `QuotaExceeded` (queued tasks) / `ServerOverloaded` | RPM or queue limits | the script waits and retries 429 (no task was created); otherwise space the submits |
| HTTP 5xx or a network error on submit | the request may have reached the server | the script stops without a row; `list --status queued` and `--status running`, then `poll` what you find; never resubmit blind |
| 404 `ModelNotOpen` · 403 `AccountOverdueError` | model not activated; balance below zero | the user tops up or activates (5.0) |
| status `expired` | queued or running past `execution_expires_after` (default in the script: 12 h) | resubmit is now safe (the task is dead); check the queue first |

### 5.10 Daily close and hand-off

At the end of each production day (with 00 §0.7):
- **Clean ledger.** Every task is downloaded, hashed and in the ledger; `ledger/inflight/` is empty or each entry is explained.
- **Expiries.** List approved drafts with their age and expiry; anything 4 days old is finalised tomorrow morning.
- **Day report.** Spend (sum of `cost`), drafts and finals made, approvals, moderation blocks, and the shots past their 5.6 budget.
- **Queue.** Tomorrow's queue, hardest first. Run L.5's share script on the current assembly when 07 has one.

---

## Output templates (what Claude shows the user)

**T1 — Shot packet card** (before any spend; prompt in English in a code block, the rest in Arabic)
```text
لقطة S03-SH02 — نسخة v03 — حزمة جاهزة للمسودة
النمط: BLOCK (بلاي بلاست 7 ث) · المتغيّر: R-DAY · الحوار: لا يوجد
المراجع: @Image1 معراج (asset) · @Image2 الروبوت (asset) · @Image3 ممر المترو (لوحة بلا وجوه) · @Video1 PB v03
الإعدادات: 16:9 · 7 ث · صوت مُولَّد: نعم (مؤثرات فقط، بلا موسيقى) · بلا علامة مائية
التكلفة: مسودتان ≈ 1.72$ · النهائي 1080p ≈ 4.76$ (سعر القائمة 30 أكتوبر)
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

**T3 — Final review card**: the same table on the final, plus the 3-up link, the Q20 tech line (`hevc Main 10, yuv420p10le, 1920x1080, 24/1, mono`), and the question «هل تعتمد النسخة النهائية لتدخل المونتاج؟».

**T4 — Day report** (Arabic headings, English IDs):
```text
تقرير Seedance — D9 (8 نوفمبر)
مسودات: 14 (مقبولة 5) · نهائيات: 4 · محجوبة: 1 (S07-SH03, InputTextSensitiveContentDetected — اقتراح تعديل في 01)
الإنفاق اليوم: 31.20$ · الإجمالي: 118.40$ · مسودات معتمدة تقترب من الانتهاء: S05-SH02 (عمرها 4 أيام)
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
- **G5-D, per shot, before any final:** one draft take approved in the user's own words, logged with the `review` command, with 05b's G5b-C passed. Silence or a change of subject is not approval (old cinematic-pipeline rule).
- **G5-F, per shot, before 07 imports it:** the final passes Q1–Q20 and the user approves it in their words.
- **G5-ALL (D14):** every shot in the locked animatic is FINAL-APPROVED, CUT by the user, or explicitly assigned to a TEXT/post route. The ledger has no blank cells and no files missing from it. Every fallback (F2–F5) and every watermark or output-format decision is in `decisions.md`. Ask: «كل اللقطات النهائية جاهزة ومسجّلة. هل نعتمد تسليمها للمونتاج (07)؟»

## Common failures

| Symptom | Cause | Fix |
|---|---|---|
| The final differs from the approved draft | the 1080p final is a new consistent generation, not an upscale | 3-up review; `_f2` from the same draft, or re-draft |
| HTTP error on the final request | prompt, references, `duration`, `ratio` or `generate_audio` resent with the `draft_task` | send only the fields the script sends |
| "Draft ID invalid" | draft expired, or it was created on a different account or region | re-draft; keep one AP-region key |
| Two bills for one shot | a running task was resubmitted after a local timeout | `poll` / `list`; never resubmit |
| Video lost | URL expired after 24 h or 100 downloads | download in the same turn; TOS data subscription as backup |
| Music under the SFX | plain "no BGM" | list the music words at the start and end; audio edit or post strip |
| Burned-in subtitles | line words repeated, emotion on single words, or a reference clip with subtitles | "Miraj's line (warmly): {…}" once; clean references; "No subtitles." |
| Characters swap faces or voices | upload order differs from first appearance; a range mapping | reorder references; one subject per mapping line |
| Mouth ignores the ElevenLabs line | audio not bound to a speaker; no "reuse the speech" sentence | method A wording; then F1–F5 |
| Invented words or murmurs | short line in a long shot | script the silence (05b); pad by placement, not by speed |
| Grey look or capsule shapes survive | geometry words in the prompt; an edit verb routed it to editing | 04 clause verbatim; `--task-type reference` |
| Floaty or slow motion | playblast shorter than `duration` | playblast exactly G s; `duration` = G |
| Fingerprint textures in foliage | oversized reference image | resize ≤ 1920 px |
| Glowing eyes | strong emotion words | "normal human eyes"; calmer words |
| Bubbling or echo artefacts in audio | water, wave or echo words in the prompt | remove them; 06 supplies water SFX |
| `PrivacyInformation` on a chained clip | a trimmed, re-encoded or old Seedance file | the untouched TOS original, under 30 days old |
| Colour shift in Premiere on a `mov` final | H.264 4:4:4 decode | 05-T7; use `mp4` finals or a logged ProRes derivative |
| Shot over budget | wording tweaks instead of a fix at the right layer | 5.6: redesign or re-block after 6 drafts |

---

## Sources and credits (checked 2026-10-30)

- **BytePlus ModelArk official docs**, read as Markdown (`ai.byteplus.com/ark/region:ap-southeast-1/docs/<page>.md`):
  - Pages: create, retrieve, list and cancel video generation task APIs; the Dreamina Seedance 2.5 tutorial (task types, Draft mode, limits, retention, rate limits); the Seedance 2.5 and 2.0 prompt guides and FAQ; model pricing; error codes; portrait-asset guide; C2PA Content Credentials guide; Files API; TOS internal presigned-URL guide.
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
- **byteplus-sdk/ark-cli `arkcli-gen`**, Apache-2.0 (commit 79c8ff6, 2026-10-29): explicit roles or HTTP 400; never resubmit on timeout; inline video/audio rejection report; GET (not HEAD) for presigned downloads.
- **calesthio/openmontage `seedance-2-5`**, AGPL-3.0 (commit 195eab2, 2026-10-28). Paraphrased only, as inspiration: named locks, state monotonicity, substitute-don't-forbid, character-sheet and voice-conditioning ideas, iteration discipline. Its 480p/720p-only claim and its aspect-ratio-in-prompt habit were not adopted.
- **friscodanconia/greybox-director**, MIT (commit c61577d, 2026-07-26; Seedance 2.0 era). Paraphrased: the support check, max-takes-then-redesign, colour-role mapping, and judging the spectacle, not only the checklist. Its frame-0 restyle is not used for faces, because a restyled face is not a trusted input.
- **Route research for this project** (BytePlus vs Higgsfield, 2026-10-30) and Higgsfield changelog summaries found by search (Draft Mode 22 Sep 2026; credit figures conflict). Facts only.
- **Premiere and H.264 4:4:4:** Adobe community and Puget Systems reports found by search; no official confirmation, hence test 05-T7.
- **The user's own skills, carried over:**
  - `seedance-2-5-prompts`: the formula, per-reference binding, exclusions, bracket syntax, the language formula, no parameters in prose.
  - `seedance-director`: the anti-slop list, ≤ 3 tracked characters, no reflections, no exit and re-entry, micro-expressions as physics, named inserts.
  - `cinematic-pipeline`: Arabic gating and "silence is not approval".
  - `higgsfield-generate`: Higgsfield audio-reference flag and job retrospection, for the fallback route.
  - Dropped as outdated: Seedance 2.0 defaults, Chinese-first prompts, `15秒。21:9。` endings, "8K IMAX", and always attaching a start frame.
- **Script:** `scripts/seedance_byteplus.py` (stdlib only), checked with `python3 -m py_compile`. Tested end to end against a local mock of the documented API, then re-tested after review (2026-10-30): dry run with hidden signatures, validation errors, handle checks, draft → poll → download → ledger, approval gate, final body contents, refusal of a duplicate take or final, a filtered-at-submit row, a 5xx on submit, a direct 1080p edit, list, cancel. **Not yet run against the live API.** Still `UNVERIFIED` in the code: inline Base64 audio and `--extra-body`.
