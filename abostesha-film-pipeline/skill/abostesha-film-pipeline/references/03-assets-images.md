# 03 — Assets: Characters, Locations, Props (Step 3)

Purpose: turn every character, location and prop in the locked script into approved, versioned reference images that Seedance 2.5 will accept and that hold identity across 40-100 shots.
Each asset job runs on the Higgsfield image model that the 12 studied Higgsfield films used best for that job (routing table 3.0.1; decision 2026-11-02): Soul Cast and Soul Cinematic for cheap casting rounds and scouting, GPT Image 2 for the realism pass and the identity sheets, Seedream 5.0 Pro for plates, props and extras, Nano Banana Pro for relights, keyframes and one-change edits, GPT Image 2.5 Sunburst for precise and text-sensitive work. Midjourney is an optional extra the user runs by hand, never a default deliverable. The user picks every winner from a selection board.
Pilot first (decision 2026-11-02): once the script and the style are locked, 03 builds only the assets of the two pilot scenes (G2-P). After the user approves the two-scene pilot, every other asset is made on exactly the recipes the pilot locked (3.5).
Talk to the user in Arabic. Write every generation prompt in English. Nothing leaves this step without a continuity-bible entry and a proven Seedance reference route on Higgsfield (3.4).
Route (decision 2026-11-01): every image and every Seedance 2.5 job runs in Higgsfield, through the MCP or by the user's hand in the Higgsfield web app inside the same project (3.0).

---

## Inputs

- **From `01-script-and-dialogue.md`:** the locked script, the Locked Sheet and the scene list. Each scene names its characters, location, time of day and reality layer (REAL / DREAM / SCREEN).
- **From `02-style-prefix.md`:** the locked prefix in its variants: the stable core (prose for the image models), the sequence overrides (dream layer, night), the film frame (D-9: full 16:9 or a letterbox inside 16:9), the look shoot-out winner and its look frames (02 §2.8), and `prefix/plate-safe.txt` (`{{PREFIX_PLATE}}` below). The Midjourney compression and `--sref` source matter only if the user runs Midjourney (3.1.11). 02 §2.6 always saves `prefix/plate-safe.txt`. If it is missing, stop and ask for the 02 lock files rather than deriving one: a plate-safe text keeps only the medium anchor and texture clauses and never any light, lens, grade, grain or palette-cast clause.
- **The two pilot scenes** the user chose after the script and style locks (scene IDs from 01). Their characters and states, locations and times of day, props and states, featured extras, non-humans and tagged transitions make the G2-P list (3.5).
- **The shot list, when it exists (`04-blender-blocking.md`).** Prop views and location angles are planned from it. Before it exists, plan from the script and revise once it lands.
- **The study templates and decisions.** The default templates below (A1–A10, B1–B5, C1, D1–D2, E1–E3) are adapted copies of the "TEMPLATE (from studies 2026-11-02)" entries in `prompt-library/characters.md`, `locations.md`, `props.md` and `style.md`, from the cross-study playbook `prompt-library/studies/2026-11-02_CROSS-STUDY.md` §3A. "D-n" = the playbook's §4.0 decisions, approved 2026-11-02 with its recommended choice; "T-x" = a pilot test (3.5).
- **The user's own prompt templates (optional slots):** `films/<id>/03-assets/user-templates/CHR_TEMPLATE.md` and `LOC_TEMPLATE.md`, or text they paste. See 3.1.2.
- **Internet reference images the user uploads (3.2).**
- **Tool status:** the Higgsfield MCP (`generate_image`, `generate_video` and the project tools visible or not), and the film's Higgsfield project with its folders from ledger L.0b (`01_CHARACTERS/CHR_<NAME>`, `02_LOCATIONS/LOC_<NAME>`, `03_PROPS/PRP_<NAME>`, `99_TESTS`).
- **The ledger and physics data in `ledger-continuity-physics.md`:** sun position per scene, scale and continuity schema.

## Ground rules

1. **Verify versions at session start (3.0).** Never quote a parameter from memory.
2. **Quote cost, then spend.** Higgsfield MCP has no spend cap. Preflight every distinct request with `get_cost: true` on `generate_image` (a `generate_image_batch` item cannot preflight, so price one item and multiply), state the job count and credits per batch and get a yes. Never repeat a generation call to "retry": each call starts and bills a new job, and after a transport timeout the outcome is unknown, so reuse the returned job ID and check it with `jobs_wait` first.
3. **Plate laws for every Seedance-facing sheet** (OSideMedia ad-asset-prep, banana-pro-director, MIT): one flat neutral grey field pinned for this project at `#8A8A8A` (never white or black: high-contrast edges halo in video); flat shadowless light with no cast or contact shadow; one readable face per sheet; one state per sheet; no baked look (no grade, grain or bokeh). The scene prompt does the lighting later. The studies back the grey plate (10 of 12 films). One-face headless sheets reached 3 films and two-face sheets also worked in 3, so one face stays our caution (D-13). If a face panel reads flat under the flat light, the one allowed fallback is a soft key at 45° camera-left with gentle fill (TOKYO 4:17), noted on the card. Plates stay neutral until pilot test T-B settles where the look lives (D-2, 3.5).
4. **A sheet is not a menu.** Anything visible on a sheet will be rendered: an open hatch, a glowing ring, a wet shirt. Non-default states get their own sheets, attached only to the shots in that state.
5. **The untouched base.** The approved face plate is never passed through a model again. Make each fix as an edit on a copy, then mask only the changed region back onto the original pixels. Never chain output to output. Every variant anchors to the approved base. The realism pass (3.1.4) runs before approval, so it never touches an approved base. Every angle and state is an edit of the approved front, never of another angle or state (the star chain, 3.1.5).
6. **Synthetic people only.** No lookalike of a real or famous person, no real photo as an identity reference, no real brand, logo, trade dress, product or book cover (Terms 6.1(d)/(f), 7.5, 9.2(j)). Arabic text is never generated in-image: leave a blank surface and composite it in `07-edit-mix-finish.md`. Latin text only for short fictional words, quoted exactly. **Method only:** the templates below are methods learned from the studied films; never reuse their characters, faces, wardrobe motifs, designs, props, locations or stories (for example THREAD's spindle and thread).
7. **Provenance and holdback.** Never strip metadata, SynthID or C2PA. Log tool, model, variant, quality, resolution, account, plan, Higgsfield job ID, Higgsfield folder, date and the SHA-256 of the downloaded original for every kept image (Terms 5.5). Midjourney is optional (3.1.11); if the user runs it, it needs Stealth: without it every image is public on midjourney.com, which can breach the Summit holdback. Stealth comes with the Pro and Mega plans; check their plan page. The `films/` folder sits inside the GitHub repo: before the first job, add one `.gitignore` line each for `films/*/03-assets/**/*.png`, `*.jpg`, `*.jpeg` and `*.webp` under the same path, plus `films/*/03-assets/internet-refs/` (gitignore has no `{a,b}` braces). No asset image or internet reference ever goes to GitHub.
8. **Human authorship.** The user picks every winner by candidate ID. Record the pick and their words in the bible. This is authorship evidence for the Summit's disclosure requests and for the user's ownership of the film (Terms cl. 7.1).
9. **Reference only.** No image from this step is cut into the film. Final picture is Seedance: the Summit requires at least 70%, and 00 sets the house target. These stills only steer Seedance.
10. **Pilot first, then the same basis (decision 2026-11-02).** Before the pilot, only the assets of the two pilot scenes are built. When the user approves both pilot scenes, the recipe card of every asset job (routing row, model, every parameter, template and version, reference roles and order, takes) is frozen in `03-assets/RECIPES_v1.md`, and every later asset fills only that card's slots (3.5). Changing a card is a new recipe version and needs their yes.
11. **Route by job, not by habit.** Each job uses the primary model of its routing row (3.0.1); the alternative runs beside it for hero assets, or when the board rejects the primary. A model or route that no studied film used for that job (Nano Banana 2.1 or Nano Banana 2 inpainting, prompts on Soul Location, `3d_jutsu_angles`) enters only through a named pilot test (3.5).

---

## 3.0 Session start: tools, verified parameters and the routing table

Run once per session; report in two Arabic lines.
1. **Higgsfield MCP:** call `models_explore` (`action: get` per model id) and confirm the ids below. If only game-publishing tools appear, tell the user to reconnect the Higgsfield connector in claude.ai settings; meanwhile they may run the generation cards by hand in the Higgsfield web app (item 3), otherwise wait. Never move to another connector without their yes. Uploads go `media_upload` → PUT the bytes → `media_confirm` (chat attachments do not reach Higgsfield); a `medias[].value` is a `media_id` or the `job_id` of an earlier Higgsfield generation, never a URL. For several jobs: `generate_image_batch` (≤ 12 per call), `jobs_wait` (≤ 12 per call), then one `show_generation_by_ids` for the board.
2. **Folders:** every job carries `folder_id` = the asset's folder in the film's Higgsfield project (`01_CHARACTERS/CHR_<NAME>`, `02_LOCATIONS/LOC_<NAME>`, `03_PROPS/PRP_<NAME>`; D1 tests in `99_TESTS`). Claude makes missing folders with `create_folder` (not idempotent: never re-run it after a timeout; check first). Never invent a folder ID. Download each kept original the moment it finishes (result URL from `jobs_wait`, or `get_project_asset_source`), hash it with SHA-256, and file it in the Drive tree (ledger L.0b) before anything else touches it.
3. **Jobs the user runs by hand in the Higgsfield web app** (same account, same project): read them back with `list_project_assets` (`workspace_id`, `project_id`, `folder_id`, `output_kinds: ["image"]`), then `get_project_asset_prompt` (`placement_id`) for the exact prompt and `get_project_asset_source` for the file. Log each one as a ledger row with route `Higgsfield-web (user)`, prompt origin from 01's codes (`H` if they wrote it, `H/C` if it came from Claude's card), the job ID (`item_id`), model, folder and the SHA-256 of the download.
4. **Re-verify the routing table** when it is older than 14 days: `models_explore` (`action: get`) for every model id below and one `generate_image` `get_cost: true` per model and setting (no generation). Log changes in `ledger/version-pins.md`.

### 3.0.1 Routing table: which Higgsfield image model for which asset job

Verified with `models_explore` and `generate_image` `get_cost: true` on 2026-11-02 (no generations). Credits are per image at 16:9 unless noted; the Soul tools show 1 credit in the web UI and 0.12 in the preflight. The evidence column names the studied films (codes in Sources) with the studies' own job counts. Every job's ledger row and generation card name its row number.

| # | Asset job | Primary: model id and settings | Alternative | Credits per image | Evidence |
|---|---|---|---|---|---|
| 1 | Casting seed: a real-looking face (`cast` → `face`) | `cinematic_studio_soul_cast` casting round, `budget` 50 (range 10–500), aspect 3:4; the user picks the plainest face → realism pass on `gpt_image_2` (`resolution` 4k, `quality` high, aspect 3:4, Image 1 = the pick; A5) | `soul_cinematic` face design on neutral grey, "structural description only" (`quality` 2k, 4 variants); or A1 as a no-reference seed on `gpt_image_2_5` (`variant` sunburst, `quality` max, `resolution` 4k, 3:4) | Soul Cast 0.12 · pass 11 (2k high 6.5) · Soul Cinematic 0.12 · Sunburst max 4k 15 | TK: 84 Soul Cast candidates, 4 kept, then one identical GPT Image 2 4K pass each (7 of 8 main sheets); S★: GPT Image 2 seeds carried all 77 stills; C: Soul Cinematic face design; H: casting bake-off; B★, T |
| 2 | Identity sheet: `turn3` (16:9) and `body` (2:3) | `gpt_image_2` 4k, high; refs = the approved `face` + angle images (+ `ward-<LOOK>`); aspect set | `nano_banana_pro` 4k (≤ 4 refs, "panel 1 from Image 2"); `seedream_v5_pro` 2k for minor roles (A8) | 11 · NB Pro 4k 4 (2k 2) · Seedream 2.5 | TK: the identical re-sheet prompt on GPT Image 2 beat Seedream ×4 and was promoted to main cast; T: 14 NB Pro sheets; C: 4-input NB Pro sheet; F★, H: Seedream turnarounds |
| 3 | Angle, state, wardrobe or expression variant (same person, one change) | `gpt_image_2` 2k, high; Image 1 = the approved front; "The only change: …" + a traits-to-preserve list (A2, A3); same aspect as the master | `seedream_v5_pro` 2k (ref = the sheet; one turnaround per phase) or `nano_banana_pro` 2k | 6.5 · 2.5 · 2 | S★: 30 angle and state jobs as single-ref GPT Image 2 edits of the master; H: Seedream turnaround per wardrobe phase; B★: "show me the back of this full body uniform" |
| 4 | Extras grid (stills only; never a Seedance reference) | `seedream_v5_pro` 2k, 16:9, `count` 4; Image 1 = a sheet used for layout only (A10) | none: anonymous extras live in the shot text; featured extras take rows 1–3 | 2.5 (10 per `count` 4) | TK: random-extra generator on Seedream, 2 of 13 kept, never attached to a video; IP, C, S★ |
| 5 | Location master plate (empty, practically lit) | scout: `cinematic_studio_soul_location` (aspect only) and `soul_cinematic` (16:9 or 21:9, 4 variants) → master: `seedream_v5_pro` 2k (its maximum), 16:9 or 21:9, `count` 4, geography written in text (B1), no people | `gpt_image_2_5` (sunburst, max, 2k) or `gpt_image_2` (2k, high) for precise geography or a sign that must stay blank; a Soul Cinematic plate stays the master when it already wins (K★, T) | Soul 0.12 · Seedream 2.5 · Sunburst max 2k 9 · GPT Image 2 2k high 6.5 | F★: Seedream 1,141 location jobs; TK: Soul Location 204 (13 location elements); B★: Soul Cinematic 123 plates; U: Seedream 127; K★: Soul Cinematic 87; S★: GPT Image 2 for every plate; C, H |
| 6 | Reverse, coverage or eye-level angle of a locked location (`rev`, `angle-<n>`, `eye-<subject>`) | `gpt_image_2` 2k, high; Image 1 = the approved master as geometry only (B2, B3); same aspect | `seedream_v5_pro` "change the angle" edit (`is_inpaint` false, ref = the master); `3d_jutsu_angles` 2k (Seedream 5.0 Pro angles; `get_preset_instructions` `{preset: "/3d-jutsu"}` first) = pilot test T-I4 | 6.5 · 2.5 · 2.5 | T: reverse of the locked room on GPT Image 2 + the room plate; U, H: Seedream angle edits; BZ: 72 NB Pro camera-distance edits; F★ |
| 7 | Time-of-day relight or clutter phase (same camera, new state) | `nano_banana_pro` 2k; Image 1 = the approved plate; same aspect; relight written as real light in values (B4) | `seedream_v5_pro` edit | 2 · 2.5 | BZ: 93 relight-only NB Pro edits, 60 sky matches, 101 dust edits; C: Seedream "night time" on a plate; H: clutter phases; IP, F★ |
| 8 | Prop hero sheet and prop states (`views`, `macro`) | `seedream_v5_pro` 2k, 16:9 or 21:9 for matched views, `count` 4, neutral grey (C1) | `gpt_image_2_5` (sunburst, high or max, 2k) for mechanical or text-bearing props (vehicles, keys, panels); `nano_banana_pro` 2k for one prop on grey | 2.5 · 2.75 / 9 · 2 | F★: Seedream 207 + Sunburst 115 (a car in 3 matched views, keys, a reactor); H: 18 props; TK vehicle sheets; U 63; C 11; T: hero prop on NB Pro |
| 9 | Look frame and the look shoot-out (02 §2.8 owns the film-wide shoot-out) | one D1 prompt, 2–4 takes on each of `soul_cinematic` 2k, `seedream_v5_pro` 2k, `nano_banana_pro` 4k, `gpt_image_2_5` (sunburst, max, 4k) and `gpt_image_2` 4k high; identical text, aspect = the film frame | extra entrants `cinematic_studio_2_5` 4k and `soul_cinema_studio` (`style_id` presets); Midjourney optional, user-run (3.1.11) | 0.12 · 2.5 · 4 · 15 · 11 · Cinema Studio 2.5 4k 4 | B★: 532 jobs across 7 engines, then one frozen look line; T: 4-engine shoot-out; U, BZ, H; S★: GPT Image 2 style anchor |
| 10 | Keyframe or first frame, built by edits (3.1.8 #7; route 1d in 3.3) | `nano_banana_pro` 2k at the film aspect; refs = the plate + the identity sheet; pass 1 puts the character in (E2), each later pass "keep … exactly, only X changes" (E1); 4k only for a frame that becomes a Seedance reference | `soul_cinematic` still for composition and light → identity swap on `nano_banana_pro` (E2 or E3) or `gpt_image_2` (the K★ and T chain) | 2 (4k 4) · 0.12 | BZ: 1,152 NB Pro keyframe jobs, 80% with an input image; K★: Soul plate → locked actor swapped in; T: the opening-frame chain; B★; H (Seedream keyframes, dropped after week 1) |
| 11 | Surgical one-change edit (fix, remove, add, text) | `nano_banana_pro` 2k (E1) for one-liners; `gpt_image_2_5` (sunburst, max, 2k) for precise, text-sensitive or mechanical edits | `seedream_v5_pro` `is_inpaint` true, run beside Sunburst (U); `nano_banana_2_1` or `nano_banana_2` with `is_inpaint` + `mask` = pilot test T-I2 only | 2 · 9 · 2.5 · NB 2.1 2k 2 | F★: 289 Sunburst jobs (267 max, 22 high, all 2k); BZ: 153 "only X changes" edits; T: 37 "Keep everything exactly as it is" edits on NB Pro; U; B★ |
| 12 | Face-structure transfer into a finished or graded frame | `nano_banana_pro` 2k; 2 refs with stated roles (the frame + the identity sheet); same aspect as the frame (E3) | `gpt_image_2` 4k high with A6's two-role wording | 2 · 11 | T: the film's opening frame (NB Pro); TK: two-reference GPT Image 2 re-sheet |
| 13 | B&W value design (only if a sequence is B&W) | `nano_banana_pro` 2k, muted colour with a "Value in B&W" word per asset and one white source per shot; conversion in 07 | `seedream_v5_pro`, same prompt; never ask any model for black-and-white | 2 | BZ: 1,725 NB Pro jobs, the values designed in colour prompts; 0 of 12 films asked a model for B&W |
| 14 | Still upscale (private poster or key art, or a 2K still promoted to a 4K reference) | `upscale_image`, provider bytedance (`bytedance_image_upscale`), resolution 4k; needs the source width and height and a resolvable image id | `topaz_image` (variant "High Fidelity V2", output width and height, `face_enhancement` off to protect identity); or re-run the winner at 4k on its own model | not priceable by preflight (the upscale needs a real image id; Topaz has no cost estimate): say so before the job · re-run: NB Pro 4k 4, Sunburst max 4k 15 | weak: no studied film upscaled a still inside Higgsfield (BZ upscaled by NB Pro edits); 2K plates reached TK's and F★'s films. Route verified on the MCP only |

**Model-id traps** (verified 2026-11-02):
1. **Nano Banana names.** The studies' job type `nano_banana_2` is Nano Banana **Pro** (its UI label) = MCP `nano_banana_pro` (1k/2k/4k = 2/2/4 credits). The studies' `nano_banana_flash` is Nano Banana 2 = MCP `nano_banana_2` ("Fast, next-gen", 1k/2k/4k = 1.5/2/3, `is_inpaint` + `mask`), a live model, not deprecated. `nano_banana_2_shots` is also labelled Nano Banana Pro (no parameters).
2. **`nano_banana_2_1`** (Nano Banana 2.1): `resolution` 1k/2k/4k (default 1k; 2k 2, 4k 3 credits), `is_inpaint`, `thinking_level` minimal/medium/high, `seed`, web and image search, media roles `image_references`, `mask`, `video_references`, extra ratios 4:1, 1:4, 8:1, 1:8. No study used it: pilot test T-I2 only.
3. **`gpt_image_2_5`**: `variant` flare | sunburst (default flare), `quality` low | medium | high | xhigh | max (default low), `resolution` 1k | 2k | 4k (default 1k), `background` auto | opaque | transparent. Set all four on every call (`background: opaque` for sheets and plates): a bare call is a flare/low/1k draft. Ratios auto, 1:1, 3:2, 2:3, 4:3, 3:4, 16:9, 9:16, 21:9, 27:16, 16:27, 9:8, 8:9, 4:5, 5:4.
4. **`gpt_image_2`**: `resolution` 1k | 2k | 4k (default 1k), `quality` low | medium | high (default low). Set both. The studies' "videotape-alpha" mode is internal, not a parameter.
5. **`seedream_v5_pro`**: `resolution` 1k | 1.5k | 2k (no 4K), `width`/`height`, `remove_bg`, `is_inpaint` (takes come from `generate_image`'s own `count` 1–4, a field of the tool, not of the model). `seedream_v5_lite` (1 credit) and `seedream_5_0_flash` exist; no study used them. `3d_jutsu_angles` = Seedream 5.0 Pro angles (2.5 credits); the Higgsfield server requires `get_preset_instructions` `{preset: "/3d-jutsu"}` before any new camera view of a location through it.
6. **Soul family (0.12 each):** `soul_cinematic` ("Soul Cinema"; `quality` 1.5k | 2k, `soul_id`, one image reference, ratios include 21:9); `cinematic_studio_soul_location` and `soul_location` (no parameters and no media: aspect only; TK and U ran them prompt-less as presets, so prompt control is untested: pilot test T-I3); `cinematic_studio_soul_cast` (`budget`; ratios include 3:4 and 21:9) and `soul_cast` (`budget` 10–500, 16:9 only); `soul_2` = `soul_v2` (Soul 2.0); `soul_cinema_studio` (`style_id`, `custom_reference_id`, `enhance_prompt`). TK's Soul Cast `character_params` (genre, gender, age, era, outfit, archetype, body type, style) are not in the MCP schema; the preflight accepted them without validating them: pilot test T-I1, or the user runs Soul Cast in the web app. Describe origin neutrally and never write "race".
7. **Cinema Studio image:** `cinematic_studio_2_5` (1k/2k/4k; 4k = 4 credits) and `cinematic_studio_image` (needs the preset ids `camera_model_id`, `camera_lens_id`, `camera_focal_length_id`; 6 jobs in one study): shoot-out entrants only.

**Settings rules.**
- **Set the aspect parameter on every call.** Words only steer composition: SÉKOU asked for "21:9" in words and got 2048² squares.
- **Resolution:** 4k for `face`, `body`, `turn3` and any frame that becomes a Seedance identity reference (TK, T); 2k for plates, props, variants, edits and keyframes (2K plates reached the films of TK, at 2048×1152, and F★). Seedream caps at 2K; a 2K still that must become 4K goes through row 14.
- **Takes:** `generate_image` `count` 2–4 (same prompt, inputs and settings; any model); more takes, or independent prompts, go in one `generate_image_batch`.

**Vendor facts:**
- **OpenAI.** Sunburst is "for workflows where editing precision matters most". Custom sizes: each edge a multiple of 16 and at most 3840 px; ratio 1:3 to 3:1; 655,360 to 8,294,400 pixels; output above 2560×1440 is labelled experimental. So if a 4K Sunburst take shows artefacts, re-run at 2K and use row 14. Masks need an alpha channel, apply to the first image only, and are prompt-guided, not pixel-exact.
- **Google.** Nano Banana Pro takes ≤ 6 object, ≤ 5 character and ≤ 3 style references; Nano Banana 2.1 up to 14 (4 characters plus 10 objects) with no style slot (Google model page and image-generation guide, fetched 2026-10-30). House rule: at most 4 references per call (3.1.8).
- **Prompt dialect.** The GPT Image 2 / 2.5, Seedream and Nano Banana Pro wording below comes from prompts the studied films kept (S★, TK, F★, T, BZ). Treat it as a starting point and judge on output.

**Not in this module:** video upscale (`upscale_video`, provider topaz at 2160p after a 2K test chunk; THREAD paid 428 credits for 19 jobs) belongs to 07; the Cinematic Video Editor is not exposed by the MCP (05 uses `seedance_2_5` `video_extension`).

---

## 3.1 Generate characters, locations and props

### 3.1.0 Entry: the user names one asset («خلينا نبدأ الخطوة 3 للشخصية معراج»)

1. **Resolve the ID.** Map the Arabic name to its asset ID through the cast list in the script or draft (draft v0: معراج = MIRAJ, ريان = RAYAN, كبير = KABIR, نوح = NOAH) and the continuity bible: معراج → `CHR_MIRAJ`. No match, or two matches: ask in one Arabic line. Never invent an ID from a guessed transliteration.
2. **Check the state** in `PROJECT.md` (SKILL.md §2): Gate 1A (script lock), the style lock (`LOOK v1.0`, `prefix/plate-safe.txt`), the two pilot scenes, G2-P and the pilot result. Then pick one of three paths and say which in Arabic:
   - **Both locked, pilot not yet approved:** build the asset only if a pilot scene needs it (the G2-P list, 3.5). Show its breakdown row (the full breakdown table follows before G2-P), then the Character Brief (3.1.3) as PROPOSED and wait for their approval. Then the casting card (3.1.4) with the job count and cost, and wait for their yes; then the casting board, the realism-pass card, the face board and the sheet cards (3.1.5), each naming its routing row (3.0.1). One step per turn; never chain past an open question. An asset outside the pilot scenes waits for the pilot result; if the user wants it now, say what may have to be redone if the pilot changes a recipe, and log their decision.
   - **Pilot approved (`RECIPES_v1.md` locked):** full Step 3 for any asset on its locked recipe card: fill the card's slots only, with the same model, parameters, template version and reference roles (3.5). Wanting a different recipe means a new recipe version and their yes.
   - **Not locked yet (D0–D3):** the only allowed partial release is the **provisional** asset for the D1 route test (3.4; 00 §0.8 T1). Draft the Brief from the draft and `script-review-v1.md`, marked `PROVISIONAL (pre-Gate 1A)`. On their yes, generate `face` (A1 on `gpt_image_2`, 4k, high, 3:4, no reference), then `body` and `turn3` (rows 2–3) on Higgsfield, into the `99_TESTS` folder, with the plate block and **no** `{{PREFIX_PLATE}}` (there is no look yet). Name the files `v00` and give them the ledger purpose `T1 route test`. They never become `_APPROVED` production assets: after the locks, the asset is made again from v01. Say plainly which gates are still open (SKILL.md §3, jumping ahead).
3. **Whatever path:** the generation route is Higgsfield (3.0): the MCP, or the user by hand in the web app inside the same project. Log every job in the ledger in the same turn (Higgsfield job ID, model, folder, SHA-256 of the downloaded original), and close with the module's Arabic question for the item shown. When the user picks a winner, append its prompt-library entry in the same turn (SKILL §7b: `prompt-library/characters.md`, `locations.md` or `props.md`; model and settings, the exact prompt, references and roles, their words, what made it work, what failed before it); an instructive rejected take goes in with `verdict: rejected`.

### 3.1.1 Asset breakdown, extras policy and naming

Walk the scene list and fill the breakdown, the two pilot scenes first. Only these get full sheets:
- characters seen in 2+ scenes or carrying a close-up;
- locations used by 2+ shots;
- props a hand touches or the story turns on;
- featured extras (below), robots and other non-humans (3.1.9), and the plates of tagged transitions (3.1.10).

Voice-only roles get no sheet. Noah's broadcast voice counts as voice-only unless he is seen. Build nothing that the G1 rating check in `01-script-and-dialogue.md` flagged (tobacco, alcohol, sedatives, self-harm imagery in draft v0) until the script keeps it in a G-safe form.

**Extras policy** (TOKYO 4:17, In Passing, SÉKOU, CONTROL):
- **Anonymous extras and crowds never get a sheet or an element.** They live in the shot text (05b §5b.8 crowd block). TOKYO 4:17 never attached its extras folder to a video job; In Passing's rule was "Anonymous crowds are text only — never an Element".
- **A featured (plot-relevant) extra** gets `face` + `turn3` only (rows 1–2; A8 for a minor role), plus the featured-extra note below in the sheet prompt and in the element description.
- **At most 2 character identities per Seedance generation** (In Passing's cap across 886 jobs), inside 05's limit of 3 tracked characters; everyone else is crowd text.
- **Extras grid** (A10, row 4): stills only, for the bible and look approval; never attached to a Seedance job.

A9 featured-extra note (In Passing):

```text
{{ROLE}}: NOTHING {{HE/SHE}} WEARS IS {{lead 1 colour}} OR {{lead 2 colour}} — must read apart from
{{lead}}'s {{garment}} inside a single frame. Identifying prop readable at four metres: {{prop}}.
Take identity and wardrobe from this element; take the beat's staging, hands and eyeline from the
shot's prompt.
```

A10 extras grid (TOKYO 4:17 E5; one new person per image, since a multi-person grid is untested):

```text
Use Image 1 ONLY as a strict CHARACTER SHEET FORMAT AND LAYOUT REFERENCE. DO NOT copy the person
shown: not the face, hair, body or clothing. Generate ONE COMPLETELY NEW, RANDOM, UNIQUE {{adult
commuter in a future Dubai}}: randomise the face, height ({{160–190}} cm), build, hair and {{everyday
G-rated}} wardrobe. DO NOT default to the same standardised attractive AI face. Avoid repeatedly
generating: small V-shaped face, large eyes, tiny nose, full lips, perfect symmetry.
{{PLATE BLOCK}} No text, no logos.
```

**Neutral names** (TOKYO 4:17: an element named `red-mirror` came out painted on the club's street sign). Asset IDs, file names and element names are neutral codes that would be harmless if they appeared as on-screen text; never a brand, trademark or loaded word (no `HALO`, no "Second Life").

**Asset ID:** `CHR_` / `LOC_` / `PRP_` + an UPPERCASE name with hyphens. Examples: `CHR_MIRAJ`, `LOC_METRO-WALKWAY`, `PRP_LENSCASE`.

**File name:** `<ASSET>_<state>_<sheet>_v<NN>_<model>_t<N>.png`
- `state`: `base`, `wet`, `dreamsuit`, `closed`, `open`, `noon`, `bluehour`, `night`, …
- `sheet`: characters `cast` (casting candidate), `face` (identity plate), `body` (vertical full-body front), `turn3` (3-panel turnaround), `heads5-34L` / `heads5-34R` / `heads5-proL` / `heads5-proR` (single-angle images), `expr6` (expressions), `lips2` (lip-sync plates), `ward-<LOOK>` (wardrobe), `scale` (line-up with the lead); locations `scout`, `master`, `rev`, `angle-<n>`, `eye-<subject>`, `phase-<n>`, `look`, `start`, `target`, `seam`; props `views`, `macro`; extras `xgrid`.
- `model`: `G2` (`gpt_image_2`), `G25S` (`gpt_image_2_5` sunburst), `G25F` (flare), `NBP` (`nano_banana_pro`), `NB2` (`nano_banana_2`), `NB21` (`nano_banana_2_1`), `SD5P` (`seedream_v5_pro`), `J3D` (`3d_jutsu_angles`), `SCIN` (`soul_cinematic`), `SCAST` (Soul Cast), `SLOC` (Soul Location), `CS25` (`cinematic_studio_2_5`), `UPS` (`upscale_image`), `TPZ` (`topaz_image`), `MJ82` (Midjourney V8.2, optional; job ID in the log).
- `v` bumps whenever the prompt or references change; `t` is the take within a run; edits append `_e01`, `_e02` and record their parent.
- The approved file is copied to `approved/<same name>_APPROVED.png`; its SHA-256 goes into the bible. A new state is a new asset name, never an overwrite; an approved file is never edited in place.

**Element names** (if T1 picks the element route): `<ASSET>_<state>_v<nn>`, for example `CHR_MIRAJ_base_v01` (≤ 32 characters, ledger L.1). A new image is always a new version and a new element, never a silent swap (HUNGER swapped element images without renaming them, which blurs provenance).

**Folders:** `films/<id>/03-assets/{CHR,LOC,PRP}/<ASSET>/{prompts,candidates,approved}/`, with shared `user-templates/`, `internet-refs/` (private, never published), `selection/`, `RECIPES_v<N>.md` (3.5) and `midjourney/` (only if used) beside them. Images live in the Higgsfield project and the Drive tree (ledger L.0b: `01_CHARACTERS/CHR_<NAME>/`, `02_LOCATIONS/LOC_<NAME>/`, `03_PROPS/PRP_<NAME>/`, each with `approved/`); the repo keeps only the text (prompts, cards, bible).

### 3.1.2 The user's own templates (slots that take priority)

When `CHR_TEMPLATE.md` or `LOC_TEMPLATE.md` exists, or the user pastes a template:
1. **The user's template replaces your default body for that asset class.** Fill only its variables. Mark them `{{LIKE_THIS}}`. If their text has no marked variables, ask once in Arabic which words are fixed and which change per asset. Record the answer at the top of the file.
2. **Never rephrase their fixed text.** You may append only two things:
   - the reference-role line (which image carries what);
   - the pinned plate block, if their template lacks it.
3. **Conflicts:** if their template bakes lighting, uses a white background or puts several faces on a Seedance-facing sheet, name the conflict in one Arabic sentence and offer to run both their version and the plate-law version on the same selection board. The user decides.
4. **One target model only:** if their template was written for one model, use it unchanged there. Show any adaptation for the other model as a diff they approve.
5. **Authorship log:** record the template as origin `H` in the log from `01-script-and-dialogue.md`.

### 3.1.3 Character Brief (one per character, before any prompt)

The Brief is adapted from nigo-studio character-consistency (MIT). Every field is expanded into visible, testable specifics, because a vague face cannot stay consistent. Wardrobe rules carried over from the old CHARACTER_SHEET_RULES: name each garment, fabric, exact colour, fit, condition and footwear, and write "none" for missing accessories. Write skin tone in prose with its undertone.

```text
ASSET:      CHR_MIRAJ
ARC LINE:   (one line from the Locked Sheet)
BUILD:      (apparent adult age as a number, height in cm, build, posture habit)
FACE:       (face shape; eye colour, shape and lids; brows; nose; mouth; ears;
             skin tone + undertone in words)
MARKS:      (1-3 asymmetric marks, each with its SIDE and exact position: "a small mole 1 cm
             below the LEFT corner of the mouth"; every sheet adds "do not mirror the image")
HAIR:       (colour, length in cm, texture, parting, hairline; facial hair line)
HANDS:      (nails, calluses; the smart ring on which finger)
WARDROBE:   LOOK_A: item by item, top to toe (garment, fabric, colour in words + HEX, fit, wear,
             fasteners)
STATES:     base | wet | dream-suit | ... (each becomes its own grey sheet set)
SIGNATURE:  (the one feature a viewer reads from 10 m)
CASTING:    Soul Cast card (genre, apparent age, era, outfit category, archetype, build) |
             designed face (A1 + A7 blocks)
NEVER:      no resemblance to any real person; no logos; no text except named fictional marks
```

Side-named marks (SÉKOU, Fukushima, CONTROL, Buzkashi, LEAK; "do not mirror" in SÉKOU and Fukushima) go verbatim into the bible (`marks`) and into every face-showing Seedance prompt (05). HEX values per colour follow Fukushima's costume canon.

**Gulf wardrobe accuracy** (G2 in `00-award-brief-and-calendar.md`; the user confirms every detail):
- An Emirati kandura is collarless, with the tassel at the neckline.
- The ghutra (white, or red-and-white shemagh) sits under a black agal.
- The abaya is usually black, worn with a sheila.
- No costume is worn as a joke, and national dress is never put on a robot or a comic figure. Every character, the Emirati partner and Kabir included, is portrayed with dignity (G1/G2 in 00).

### 3.1.4 Character pass 1: casting round, realism pass, face lock

Pick a face, don't describe one: TOKYO 4:17 kept 4 of 84 Soul Cast candidates (4.8%) and passed each pick through one identical "re-photograph, don't redesign" pass on GPT Image 2 at 4K. The face plate is a single vertical 3:4 head-and-shoulders image. Its framing follows BytePlus's best practice for a portrait asset's face close-up: vertical, frontal, no expression, face about two-thirds of the frame. This is the only text-heavy step in the character's life. After it, prompts stay lean and the reference carries identity.

1. **Casting round** (routing row 1): 7–10 candidates per role per round, into the character's folder.
   - **Soul Cast** (`cinematic_studio_soul_cast`, `budget` 50, aspect 3:4): a short prompt from BUILD, CASTING and the era (no names, no "race"). TOKYO 4:17's structured parameters are pilot test T-I1; until it passes, the user may run the CASTING card in the Higgsfield web app, and Claude reads the jobs back (3.0 item 3).
   - **A designed face** (no casting pick fits): 2–4 `soul_cinematic` face designs on neutral grey ("structural description only"), or A1 + A7 as a no-reference seed on Sunburst (max, 4k, 3:4).
   - A round of 8 Soul Cast candidates plus 2 Sunburst seeds costs about 31 credits [ARITH]. Show the casting board.
2. **The pick.** The user rejects the most "AI-pretty" faces first (idol face, perfect symmetry, glass skin, tiny nose), then picks one lived-in, camera-friendly face by candidate ID. Rounds repeat until there is a pick.
3. **Realism pass = the face plate** (A5 on `gpt_image_2`, 4k, high, 3:4; Image 1 = the pick; 2 takes, 11 credits each). The pick is re-photographed into our plate grammar (grey #8A8A8A, flat light, identity-plate framing) without redesign. When the identity source is a film still or another layout, use A6. Never name a garment in a realism prompt shared across characters (TOKYO 4:17's shared prompt gave the wrong man a tie); a different base garment comes later as an A3 edit on a copy.
4. **Check at 100%** against the pick: eyes, eyelids, hairline, collar, every mark and its side. Reject the pass if any feature moved. Cap the realism: over-sharpened pores read as CG.
5. **Approval.** The user approves the face plate by candidate ID; it becomes the untouched base (rule 5). Log the pick, the pass and their words.

PLATE BLOCK (pasted into every character and wardrobe sheet; adapted from banana-pro-director 3.0's locked flat grade, MIT):

```text
Background: one flat uniform neutral grey field, hex #8A8A8A, edge to edge - no floor, no wall,
no seam, no gradient, no vignette, nothing behind the subject. Completely flat shadowless light:
one very large soft frontal source at camera with equal fill from left, right, above and below,
both sides of the face equally bright; no shadow side, no rim or hair light, no cast or contact
shadow, no specular hotspot. Low contrast, catalogue-flat. Skin matte at its true natural tone,
never cooled or greyed by the background. Real fine even pore texture, fine peach fuzz at jaw and
hairline, subsurface scattering at ears and nostrils, individual hair strands with natural
flyaways, real fabric weave and drape. Photographed on an 85 mm lens at f/4 for faces and about
70 mm for full-body panels, even sharpness, no grain. Photographed, not generated.
```

The grain clause is contested between sources. This project pins "no grain on plates", so grain lives in the prefix and the grade (SÉKOU wrote "no grain overlay" on 12 of 13 reference prompts). The lens lengths come from SÉKOU's casting photos and TOKYO 4:17's sheets; they are focal lengths, not brands (02 rule 2).

**A1 identity seed** (SÉKOU E1, The Breach E1; routing row 1 alternative and the T1 provisional face). With A7 when the face is designed from text:

```text
{{ASSET}}_{{state}}_face · {{VISUAL HANDLE}} · identity seed · 3:4
Character identity plate, single image, one person only, one view: a casting photograph,
straight-on, from just above the top of the head to the top of the shoulders, the face filling
about two-thirds of the frame, body squared to camera, head level, eyes on the lens.
SUBJECT: {{BUILD}}. {{FACE}}. {{MARKS, each with its side}}. {{one detail seen "only because" of the
pose, e.g. "a thin pale scar through the RIGHT eyebrow, visible only because the hair is pushed
back"}}. {{HAIR}}.
EXPRESSION: neutral, lips closed and relaxed — NOT smiling, NOT posed, NOT {{the state's wrong extreme}}.
WARDROBE: a plain charcoal crew-neck T-shirt, no jewellery, no logos.
{{PREFIX_PLATE}}
{{PLATE BLOCK}}
Real skin texture, real pores, no retouching, no beautification. Photographed, not illustrated.
No text, no logo, no watermark, no border, no grain overlay.
```

The header line makes finals traceable (The Breach put one on 91% of its prompts); keep it neutral (3.1.1).

**A5 realism pass** (TOKYO 4:17 E2, condensed from 9,466 characters; routing row 1; runs before approval):

```text
Use Image 1 as the ABSOLUTE MASTER REFERENCE. Re-photograph this existing {{casting photograph |
identity plate | three-panel sheet}} at significantly higher photographic quality, as {{the A1
framing line | the A4 panel layout}}. Only the background and light change, to the plate below.
THIS IS NOT A CHARACTER REDESIGN. DO NOT invent a new person. DO NOT beautify. DO NOT make
younger. DO NOT make more conventionally attractive. DO NOT change facial anatomy.
== ABSOLUTELY PRESERVE == apparent age · facial structure · eye shape and spacing · eyelid anatomy
· brows · nose shape and width · mouth and lip proportions · jawline · chin · ears · skin tone ·
facial asymmetry · facial hair · {{MARKS with sides}}: do not mirror the image · the wardrobe
EXACTLY as in the reference.
== FACIAL PHOTOREALISM == visible but subtle pores, minor pigmentation, slight natural redness,
individual brow hairs and lashes, moist eyes, real lip texture; physically plausible subsurface
scattering. Avoid smooth AI skin. Avoid waxy skin. Avoid excessive micro-detail or artificial
sharpening. The face should look photographed, NOT rendered.
== HAIR / FABRIC == real strands and flyaways; real weave, creases, seams.
== LAYOUT == {{one view | keep panels, scale and order exactly}}.
== LIGHT / CAMERA == {{PLATE BLOCK}} Subtle lens softness rather than digital oversharpening; no
HDR, no artificial clarity.
== QUALITY TARGET == IDENTITY > BEAUTY. REALISM > POLISH. MATERIAL REALISM > DIGITAL SHARPNESS.
HUMAN IMPERFECTION > AI PERFECTION.
== ABSOLUTELY AVOID == new identity, younger appearance, model or idol appearance, larger eyes,
smaller nose, perfect symmetry, plastic or wax skin, HDR, oversharpening, CGI, a different person
between panels.
```

**A6 two-reference re-sheet** (TOKYO 4:17 E3: the same prompt was kept on GPT Image 2 and lost 4 times on Seedream; `gpt_image_2` 4k high). Use it to pull a face from a film still or an off-layout image into our sheet grammar:

```text
Use the TWO provided reference images for TWO COMPLETELY DIFFERENT PURPOSES.
IMAGE 1 = FORMAT / LAYOUT / CAMERA / STUDIO TEMPLATE ONLY.
IMAGE 2 = CHARACTER APPEARANCE ONLY. Do not mix the purposes.
IMAGE 2 ALWAYS WINS for: identity, face, age, body, hair, wardrobe, colour, accessories, shoes.
IMAGE 1 ALWAYS WINS for: layout, panel order, framing, camera, subject scale, background,
lighting, presentation.
Preserve what is known. Only invent what is genuinely missing.
IMAGE 1 = HOW TO DISPLAY {{HIM/HER}}. IMAGE 2 = WHO {{HE/SHE}} IS.
Do not redesign. Do not beautify. Do not average the two people together. Do not create a
hybrid identity. {{MARK}} stays on the {{side}} — do not mirror the image.
```

**A7 designed-face imperfection blocks** (TOKYO 4:17 F4/F9; imperfection wording on faces in 8 of 12 films). Add to A1 when no casting round picked the face:

```text
DISTINCTIVE HUMAN DETAILS: {{one tiny mole low on one cheek, with its side}}, slight eyelid
asymmetry, minor asymmetry in the corners of the mouth, a tiny irregularity in eyebrow density.
They should be details discovered when looking closely.
SKIN: healthy but NOT flawless skin. NO glass skin. NO porcelain skin. Photographed rather than rendered.
PERSONALITY IN A STILL: {{one sentence, e.g. "the energy of someone who answers before the
question is finished"}}.
ABSOLUTELY AVOID: generic AI beauty, idol face, anime face, doll face, giant eyes, tiny artificial
nose, perfect facial symmetry, overfilled lips, plastic skin, influencer appearance.
```

Hard physical facts work too (Buzkashi: "a nose crooked from an old improperly healed break"). Minor roles and antagonists are written as ordinary people ("Calm and alert, without an exaggerated expression", TOKYO 4:17).

Worked fill for `CHR_MIRAJ` (provisional until the user approves the Brief):

```text
A South Asian man of 31, lean and slightly underfed, 174 cm, shoulders rounded forward from
fatigue. Long oval face, high cheekbones, faint hollows under the cheekbones; deep-set dark
brown eyes with heavy upper lids and fine lines at the outer corners; straight thick brows; a
narrow nose with a small bump at the bridge; medium lips, the lower lip slightly chapped; warm
medium-brown skin with a golden undertone, a small mole 1 cm below the left corner of the
mouth; short black hair, slightly wavy, uneven home-cut fringe; a short untrimmed black beard
along the jaw, thinner on the cheeks.
```

MARKS for this fill: the mole 1 cm below the LEFT corner of the mouth; the bump at the nose bridge.

**Wording rules:** in image prompts, give adults an apparent age as a number and the height in cm (it stops the default young, flawless face) and never use child words. Seedance prompts stay age-blind (05b ground rule 6; D-15): the age lives in the asset sheets and the reference image, not the video prompt. Do not write "photorealistic" when faces are in frame (it pushed GPT Image 2.0 toward plastic skin); use "photographed" and film-capture language. Seven studied films did use "photorealistic" on faces with no reported harm, so the ban is our caution, not study evidence (D-12). Identify people by a visual handle, not the character's name, which means nothing to image models.

### 3.1.5 Character pass 2: sheets from the approved face (the star chain)

**Star chain** (SÉKOU held one identity through 4 states this way; 8 of 12 films kept a separate sheet per state). Every angle and every state is an edit of the APPROVED `face` (the master front), never of another angle or state, so errors never compound. State prompts open with the identity block and "The only change: …", and say what the change is NOT when it touches a motif colour. Wardrobe and big body states (wet, dream-suit) get their own grey sheet set; small marks (dust, sweat, a smudge) are written in the shot prompt, not on a sheet (The Breach: "Clean face in this sheet (soot is a scene state)").

Order per character and state: `heads5` angles → `ward-<LOOK>` → `body` → `turn3` → `expr6` and `lips2` for speaking or close-up roles → `scale` where subjects share frames.

**heads5: four single-angle images** (¾ left and right, profile left and right; with `face` they make the five heads). Each is its own A2 edit of the approved face (row 3: `gpt_image_2`, 2k, high, 3:4; 4k when it becomes a Seedance reference). Each image shows one face, so a pack (face + ¾ + profile + `turn3`, SÉKOU's 4-slot pack: "Use whichever angle matches the head position in each moment") is a candidate route in T1 1e.

A2 same-session angle (SÉKOU E3, the template of 27 angle prompts):

```text
Use the person from Image 1. Keep their identity exactly — same face, same skin tone, same
hair, same age, same clothing. Do not recast. Do not beautify. Do not change age.
Traits to preserve: {{the Brief's FACE and MARKS lines, verbatim}}.
Photograph them again in the same session: same flat grey studio, same 85 mm lens at f/4, same
eye-level camera, same neutral expression with the mouth relaxed.
{{Head and shoulders turned to a three-quarter angle | in full profile}} with the {{LEFT}} side
of the face toward the camera, eyes looking just past the lens, chin level.
The {{mark}} is on the {{LEFT}} {{place}} and must stay on the {{LEFT}} side — do not mirror the image.
Real skin texture, real pores, no retouching. Photographed, not illustrated. No text, no grain
overlay, no vignette.
```

**ward-<LOOK>: wardrobe sheets.** One per look: ghost-mannequin front and back plus two macro panels (fabric weave, fastener or patch), every colour in words plus HEX (row 3). Never two looks on one sheet; a wardrobe change is a new sheet plus a new `body` and `turn3` built with it.

**States** (row 3): each state's face is an A3 edit of the master front; that state's `body` and `turn3` follow from it. One grey identity sheet set per character state.

A3 state or wardrobe variant (SÉKOU E2/E5, The Breach E2, Fukushima wet/dry):

```text
Use the person from Image 1. Keep their identity exactly — same face, same skin tone, same
age, same {{2–4 named traits}}. Do not recast. Do not beautify. Do not change age.
Do not mirror the image — the {{mark}} stays on the {{side}}.
The only change: {{REPLACE x with y}} — not {{the motif colour}}, not patterned, {{other NOT}}.
Photograph {{him/her}} again in the same session: {{the A2 camera, light and backdrop line, verbatim}}.
Real skin texture, real pores, no retouching. Photographed, not illustrated. No text, no grain overlay.
```

For expression-bearing states (wet, exhausted) add The Breach's line: "Use only the face and wardrobe identity; do NOT copy the emotional expression from the reference."

**body: vertical full-body front** (row 2: `gpt_image_2`, 4k, high, 2:3). One image: the same person, head included, top of head to shoes, front view, arms relaxed, weight even, wearing {{LOOK item list}}, with Image 1 (the approved `face`) carrying face, skin and hair, Image 2 (`ward-<LOOK>`) carrying the wardrobe only, plus the plate block. Together with `face`, this is the pair ByteDance's Seedance portrait guide recommends per character: a vertical full-body frontal image plus a vertical face close-up. On Higgsfield it is the `face` + `body` pair tested in 3.4. Make one per look and state.

**turn3: 3-panel turnaround** (A4; row 2: `gpt_image_2`, 4k, high, 16:9; alternative `nano_banana_pro` 4k). The Seedance identity sheet for direct references: LEFT full body front headless, CENTER full body rear with head, RIGHT tight chest-up face. Three panels give the face roughly twice the pixels of a 6-panel grid, and the headless front leaves exactly one readable face (banana-pro-director 3.0 Mode 2A, MIT; OSideMedia one-face law, MIT; SÉKOU E4 and CONTROL E12: "headless bodies stop face bleed between panels"). Reference roles: Image 1 = the approved face (identity), Image 2 = the ¾ angle and Image 3 = the profile (head shape from the side and back only), Image 4 = `ward-<LOOK>` (wardrobe only).

A4 3-panel Seedance sheet with one readable face:

```text
Use the person from Image 1 to Image 3. Keep their identity exactly. Do not recast. Do not
beautify. Do not change age. Image 4 gives the wardrobe only, not its background or pose.
One 16:9 image, three equal vertical panels, same width, same height, hard even splits with
thin neutral separation, no decorative borders, no labels, no gaps. The same person in the
same outfit in all three: {{LOOK item list}}.
Panel 1 (left): front view of the full body from the neck down to the feet, NO head in this
panel: {{HEADLESS VARIANT}}. Full headroom of empty grey above the shoulders, figure at normal
full-body scale, standing straight, arms hanging naturally at the sides.
Panel 2 (centre): back view of the full body from the top of the head to the feet, head
attached; hair from behind, garment back construction and footwear readable.
Panel 3 (right): tight close-up of the face, straight on, top of the head to the collarbones,
eyes to camera, lips closed, neutral expression — {{FACE traits}}. The {{mark}} stays on the
{{side}} — do not mirror the image.
CRITICAL: hands must NOT be clasped behind the back, folded, crossed, hidden or placed in
pockets; in the back view both arms and hands stay visible. Keep anatomical left and right:
{{patch or emblem}} on the {{LEFT}} in both body views.
Skin renders at identical value and hue on face, neck, arms and hands in every panel. Same
scale, same grey, same flat light in every panel. Do not use any input image's background.
{{PLATE BLOCK}} No text, labels, captions or logos. No grain overlay.
```

Pick the `{{HEADLESS VARIANT}}` by neckline:
- **Variant A, ghost mannequin.** For a collar, crew neck, shirt or hood: "the collar holds its own shape and its opening is an empty dark hollow looking into the inside of the garment; the garment reads as worn by an invisible body; no stump, no skin, no cut edge, no blur, no transparency."
- **Variant B, clean neck cut.** For a strapless or open neckline: "the neck rises a short way and ends in a clean flat horizontal edge like a dress-form mannequin; not blurred, no wisps, no anatomy at the cut."

The skin-tone clause is mandatory: without it, rear panels drift darker. If a head appears in the headless panel, CONTROL's one-line fix: "the full body left panel is cleanly HEADLESS, cut straight and flat across the base of the neck with no head, all the rest is identical."

**A8 short sheet for a minor role** (TOKYO 4:17 E4, about 3,000 characters on Seedream 2K, used in 17 and 28 video jobs; mapped onto A4's one-face layout; row 2 alternative `seedream_v5_pro` 2k):

```text
{{ASSET}}_{{state}}_turn3 · minor role · 16:9 · three equal panels, hard splits, no labels.
LEFT: full-body front, NO head ({{HEADLESS VARIANT}}), about 70 mm. CENTER: full-body back, head
attached, hair from behind. RIGHT: tight close-up, top of head to collarbones, about 85 mm, eyes
to camera, neutral. Match the left panel's body scale, camera height and floor line exactly in the
centre panel.
CHARACTER: apparent age {{N}}, {{cm}}, {{build}}. FACE: {{shape, eyes, nose, mouth}}; natural
facial asymmetry, visible pores and subtle under-eye fatigue; {{MARK with its side}}, do not mirror.
HAIR: {{length in cm, texture}}. WARDROBE: {{item list}} — NOT {{the leads' colours}}, no logos.
{{PLATE BLOCK}}
STRICT CONSISTENCY: exactly one identity, one hairstyle, one outfit and three views. Calm and
alert, no exaggerated expression. No text, no logos, no grain overlay.
```

**expr6: expressions** (row 3, an A3 edit of the face: "The only change: the expression is …"). A 2×3 grid of chest-up heads, same plate block, six expressions drawn from the character's script beats. For Miraj: exhausted neutral; forced grin; grief, crying, mouth open; rage, shouting; quiet hope; grateful half-smile, eyes up. Add `lips2`, two lip-sync plates, for every speaking role (mouth closed and relaxed; mid-speech open "ah"). They are an untested aid for `05b-acting-direction.md`. A single cropped expression panel may serve as a shot-specific reference; the full grid never does.

**When two subjects share frames** (Miraj and the delivery robot; Miraj and Kabir), also build a scale frame (`scale`) that states heights in cm. Rule: if scale is uncertain, render the smaller subject smaller, never larger.

**If a sheet reads flat or 2D,** rerun the identical prompt on the row's alternative (`nano_banana_pro` 4k) before rewriting anything; if the face panel still reads flat, use the plate fallback in rule 3 (soft key at 45° camera-left).

### 3.1.6 Location plates by time of day

1. **Scout** (row 5; 0.12 a still): 4–8 `soul_cinematic` stills (16:9 or 21:9) from B1's PLACE and CAMERA lines, plus `cinematic_studio_soul_location` presets (aspect only; whether a prompt steers it is pilot test T-I3). The user marks what they like. Scouts are mood and layout ideas, not proof of geometry. A Soul Cinematic still may become the master when it already passes every check below (Kimti, THREAD).
2. **Master plate** (row 5: `seedream_v5_pro`, 2k, `count` 4, B1), one per location at the scene's main time of day:
   - a 3/4 angle along the main axis, never head-on (Nano Banana's depth perception fails on front views);
   - empty (9 of 12 films), with one named anchor landmark, things in reading order with distances in metres, and the story affordances already in place (the door used for the exit, room for the action, a clean action corridor where the beats happen); clutter at the edges;
   - sun azimuth and elevation pinned from `ledger-continuity-physics.md` for Dubai (25.2° N) on the story date; every practical named with direction and colour temperature in K; where the light stops;
   - neutral true-to-life colour, normal exposure, no creative grade, grain or flare: a tinted plate leaks its colour onto every shot (current rule, kept until pilot test T-B, 3.5);
   - an `Avoid:` list built from what the last failed variant drifted into (Kimti).
   Precise geography, or a sign that must stay blank, goes to the row 5 alternative (Sunburst max 2k, or `gpt_image_2` 2k high).
3. **New views are edits of the approved master, never fresh text** (5 of 12 films). `rev` (B2) and `angle-<n>` (B3) on row 6, the master attached as geometry only. Every dialogue location gets a `rev`: THREAD's master and reverse together held the 180° line inside one room. `3d_jutsu_angles` enters only through pilot test T-I4.
4. **Same camera, new state** (row 7, B4): time-of-day variants, relights and clutter phases are edits of the approved plate, never regenerated; only the times and phases the script uses. A room that changes over time gets phase plates from the same camera (HUNGER: "Use the uploaded apartment reference as the exact same room and exact same camera angle … Show the same apartment after {{event}}").
5. **Eye-level plate** (`eye-<subject>`, B3) for any small subject (a robot, a child, an animal) in every set it appears in (HUNGER).
6. **Normalise exposure.** Edit every extra plate against the master: "match the exposure and light level of this plate to the master plate (Image 2, same place); change exposure only".
7. **Judge on affordance, not beauty.** Before the user sees the board, run each beat of the scene against the plate. Does the run fit? Is there room for the crowd? Is the threshold where the action needs it? A plate where a beat has nowhere to happen is wrong however good it looks.
8. **Look frame** (`look`, optional, one per location; D1 on the engine that won 02's shoot-out, row 9): the full prefix, optional silhouetted figures. It exists for the user's look approval and, if the user runs Midjourney, as its `--sref` source. It is never a Seedance reference while plates stay neutral. If pilot test T-B picks the graded route (D-2), the graded plate is made from the approved master (B4 relight, plus D2 where the look needs a lens character), and the recipe card records it.
9. **Dream layer (2nd Life):** dream locations use the dream override from 02 as a declared exception; their masters still obey the plate rules.
10. **Model notes:** Seedream and Nano Banana Pro follow locations described in text better than location images used as references, so keep geometry in the prompt. When a Blender greybox exists, attach its render as "use only the geometry and camera; ignore the grey materials" (`04-blender-blocking.md`). Until D-9 is decided (full 16:9 or a letterbox inside 16:9), plates are 16:9 with the action inside the central band.

**B1 location master plate** (Fukushima's block order, SÉKOU's reading order, Kimti's distances, merged into the old 03 prompt; row 5):

```text
{{ASSET}}_{{time}}_master · {{PLACE}} · 16:9, single wide frame, no people.
{{PLACE}}, {{date/era}}, {{clock time}}, {{weather}}, {{state: intact / after the storm / cluttered}}.
CAMERA AND COMPOSITION: camera at {{eye height in m}}, a three-quarter angle along {{main axis}},
about {{angle of view}} degrees horizontal (about {{mm}} full-frame); {{which wall is frontal}};
{{what sits in the left / centre / right third}}.
IN READING ORDER: {{nearest thing}} → {{anchor landmark at frame position}} → {{far thing}}, with
distances: "{{object}} {{N}} metres from {{object}}".
STORY AFFORDANCES ALREADY IN PLACE: {{the door the actor exits by; a clean action corridor along
{{path}}; room for {{subject}} at {{spot}}}}; clutter only at the frame edges.
MATERIALS AND WEAR: {{surfaces, exact colours, damage}}.
LIGHT: {{sun azimuth/elevation from the ledger, and quality}}; {{each practical with direction and
K}}; where the light STOPS: "{{most of the room remains in deep shadow}}".
DEPTH OF FIELD: {{deep enough to hold the anchor}}.
Neutral true-to-life colour, normal exposure, no creative grade, no grain, no flare.
{{PREFIX_PLATE}} {{world-design clauses from the prefix}}. Photographed, not illustrated. Every
building generic and unbranded. No people. No text. No readable signage.
Avoid: {{what the last failed variant drifted into}}.
```

Worked fill for `LOC_METRO-WALKWAY` at late morning (future Dubai, 2045; the PLACE to LIGHT slots of B1). Date, clock and sun are the ledger's PROVISIONAL worked example (15 Apr 2045, 11:40, lens heading 278°, sun azimuth 147°, elevation 72°). Re-run `sun_position.py` once the user fixes the story date:

```text
A long enclosed moving walkway leading to an elevated metro platform in a future Dubai, 11:40
in mid-April, no people. Camera at 1.6 m, heading west, a three-quarter angle looking along the
walkway toward the platform gates, about 70 degrees horizontal view (24 mm full-frame). Two
parallel belt walkways in the centre with brushed-steel balustrades, a fixed walkway on the
right; on the left a glass wall under a glass roof on slim steel mullions, showing a hazy
skyline of generic glass supertalls; anchor landmark: a tall ring-shaped departure board,
blank, hanging over the gates at upper centre. Hard direct sun from high behind camera left
(about 72 degrees elevation) through the glass roof: short, crisp mullion shadows across the
belts; cool 6500 K skylight fill; recessed white LED strips along the balustrades. Worn rubber
belt treads, fingerprinted steel, faint dust film on the glass.
```

The skyline is generic: trademark-protected landmark silhouettes stay out of hero framing unless 01's clearance list allows them. The departure board stays blank; Arabic or English copy is composited in 07.

**B2 reverse angle of a locked room** (THREAD E4: GPT Image 2 + the room plate, then in 39 Seedance jobs; Fukushima's reverse with reference roles; row 6):

```text
A wide {{interior | exterior}} shot, {{lens}} lens, camera at normal eye height. THE REVERSE ANGLE
of the place in Image 1: the camera stands {{exact spot in the master, e.g. "BEHIND the {{tall
object}} in the far left corner of Image 1"}} and looks back ACROSS the space, in a THREE-QUARTER
view, at the wall that was behind the camera in Image 1.
Image 1 is the location reference. It controls geometry, materials, light and atmosphere ONLY —
not framing. Do not use it as a starting frame; do not inherit its composition, angle or crop.
THE NEAR FOREGROUND: {{a soft fragment of a master-plate object, to tie the two views}}.
THE FAR WALL — the wall this picture is about: {{anchor 1}}, {{anchor 2}}, {{anchor 3}}, in that
order from left to right.
LIGHT: one light logic only: {{the same sources as the master, now from frame left/right}}.
{{The likely failure}} = a failed image. No people anywhere. No text.
```

**B3 coverage, eye-level angle or same-camera phase** (HUNGER E4, 34 coverage prompts; row 6, or row 7 for a phase):

```text
Use Image 1 as the exact same location. {{Camera approximately {{N}} cm above the floor beside
{{object}}, close to the eye level of {{subject}} | Camera positioned {{where, height, direction}}}}.
{{What dominates the frame and what space is left for the action}}.
Preserve the exact architecture, room dimensions, wall positions, doors, windows, ceiling height,
floor materials, furniture, fixtures, practical light sources and all spatial relationships. Do
not redesign, reinterpret, simplify or improve the location. This must be the exact same physical
place viewed only from a different camera position. Objects that logically stay fixed stay in
exactly the same places. Only change the camera position, camera height and viewing direction.
```

Phase variant (same camera, new state): "Use Image 1 as the exact same room and exact same camera angle. Do not move or redesign any architecture or furniture. Show the same room after {{time or event}}. Leave physically plausible areas where {{subject}} can {{action}}."

**B4 time-of-day relight** (Buzkashi's 93 relight edits; row 7: `nano_banana_pro` 2k):

```text
Edit Image 1. Fully re-light the scene for {{blue hour | 17:40, low sun from frame left}} — not a
colour filter, but a real change in lighting. {{Which planes go dark: "dark and low-contrast but
not pure black — shape still readable"}}. Keep composition, camera angle, every building, object
and surface, the anchor landmark, and the blur and focus levels exactly the same — only the
lighting and the colour of the light change.
```

Sky match between neighbouring plates (Buzkashi, 20 times): "Change the sky to match Image 2's sky exactly — same clouds, same cloud shapes and lighting, same overall tone and mood, so both images read as the same location shot at the same time."

**D1 look frame** (02's shoot-out template; THREAD style-anchor order, SÉKOU's anchor, UNPROMPTED's suffix; gear and stock names removed per 02 rule 2):

```text
Film frame from {{genre}}, {{the look's visible behaviour, e.g. "warm, pushed contrast with
halation around practicals and coarse even grain"}}, {{field of view or lens length}}.
{{Place, time, weather}}. Composition: {{one line}}.
Light: {{the one source; where it stops}}. Palette: {{60% x / 30% y / 10% z}}: {{one dominant
hue, one accent}}. Film behaviour: {{grain, roll-off, halation where, black level}}. Operator
habit: {{e.g. "horizon a few degrees off level"}}. Texture: {{surfaces}}. No people. No text.
No HDR, no sharpening halos, no glossy skin, no beauty lighting, no fake vintage filter.
```

One look frame per world (SÉKOU had village, sea and beach); log where each one is used (2 of SÉKOU's 3 anchors were never attached to any job). For a B&W sequence, never ask for black-and-white: muted colour with a "Value in B&W" word per asset (row 13).

**D2 optics unification pass** (Fukushima E3, 154 jobs; only on the graded-plate route, if T-B picks it):

```text
Edit Image 1: apply the optical character of {{lens behaviour in words}} to this {{place}}. Do not
change the lighting. Do not change the exposure, the colour temperature, the grade, the time of
day or the weather. This edit is about the lens only. {{Each optical trait as a visible instruction
on the plate's own lines: "the {{handrail}} bows outward, its near end swinging toward the lower
left corner"}}. It stops short of a fisheye. The frame stays filled to all four edges.
AVOID: haze, bloom, fisheye, black wedges, re-grade, relight, added people, invented text.
```

### 3.1.7 Hero props

Product shots of one object on a neutral ground: 9 of 12 films.
- **Views come from the shot list.** Front, side and back are the minimum: matched views in one 16:9 or 21:9 image (row 8: `seedream_v5_pro` 2k, `count` 4), or one view per image.
- **Add a bottom view whenever the prop is flipped, dropped or turned over.** The model cannot invent an underside it never saw.
- **One sheet per state** (Fukushima, The Breach: "one object, one state"): `closed` / `open`; ring `idle` / `green` / `red`; lit / unlit; full / empty. Each later state is an A3-style edit of the approved base view: "The only change: the ring now glows green; everything else identical."
- **Name the one detail that must survive,** with a size comparison: "the hinge pin is about as thin as a sewing needle". THREAD's thread wording is not reused: its spindle and thread are on the do-not-copy list.
- **Fix the image, not the text.** A prop image overrides the prompt when they disagree (SÉKOU's prop image beat its own text and casting photo), so correct the sheet with E1; changing only the wording does not help.
- **Mechanical or text-bearing props** (vehicles, keys, control panels, a stamped mark) go to the row 8 alternative (Sunburst high or max, 2k). Vehicles: front-¾ and rear-¾ on grey, the drive side named, glass "transparent enough to see the driver when added later" (TOKYO 4:17); add an empty interior when someone sits in it (Fukushima).
- **Isolate a prop from an approved frame** by edit (row 11): "isolate just the {{object}} on a neutral grey background" (The Breach).
- **Give dimensions in mm.** They feed the physics notes.
- **Props skip motion tests.**
- **Red arrow:** if an actor keeps grabbing the wrong control in `05-seedance-production.md`, draw a red arrow on a copy of the sheet. Describe the arrow's target in the shot prompt. Keep the clean sheet as the identity reference.

**C1 hero prop** (THREAD E1 structure, The Breach's header code, and the GLOBAL IDENTITY LOCK in OSideMedia reference-sheet-workflow.md, MIT; row 8):

```text
{{ASSET}}_{{state}}_views · {{NAME}} · {{16:9 matched views | 1:1 | 4:3}}
A product photograph of ONE {{object}}, {{shown as {{views}} at the same scale on one baseline,
plus macro panels of {{details}} | a single view}}, isolated on a seamless flat neutral grey
#8A8A8A background, plain and empty, perfectly even shadowless light, no reflections of a studio,
no gradient, even exposure, true-to-life colour, macro-level material detail, edge-to-edge
sharpness, as if shot with a 100 mm macro lens at f/8.
The object: {{dimensions in mm}}, {{material and how it was made}}, {{construction: seams,
hinges, fasteners}}, {{wear: where hands have darkened or smoothed it}}.
{{THE DETAIL THAT MUST SURVIVE, with a size comparison}}.
Identical object in every view - same shape, proportions, colour and wear. Fully visible and
sharp from end to end. No invented branding; the only marking is {{exact fictional text in
quotes | "a blank oval emblem recess"}}. Only the {{object}} on the grey background, nothing else
in frame. No text, no logos.
```

THREAD and TOKYO 4:17 used a soft shadow or light-grey seamless; our plate laws ban the contact shadow, which no study tested but which does no harm.

Worked use, `PRP_LENSCASE`: `closed` gets front, back, side, top and bottom; `open` gets a top view plus macros of the contact lens floating in clear fluid (the detail that must survive: "the lens is about as thin as a fingernail clipping") and the two ring-shaped earpieces in their recesses. The in-world brand name may collide with existing trademarks and stays out of asset IDs and element names (3.1.1); until 01's trademark check names it, render a blank emblem recess and composite the logo later. Other props in this film: the smart ring (idle / green / red), the robot forearm stamped "MADE IN UAE", Food+ reusable meal boxes (clean / used), the air-skate fan with its red warning light.

### 3.1.8 Selection boards, edits and keyframes

1. **Primary and alternative on one board.** Hero assets (the leads, every pilot-scene asset, dialogue masters, hero props) run their routing row's primary and alternative side by side, 2–4 takes each. Minor assets run the primary only and move to the alternative when the board rejects it. Takes of one prompt use `generate_image` `count` (2–4), or identical items in one `generate_image_batch` for more; independent prompts go in one `generate_image_batch`; all carry the asset's `folder_id`.
2. **Judge on the hardest axis for that asset.** For Miraj it is skin under fatigue. For Noah it is panel seams and joints. For the lens case it is the clarity of the fluid.
3. **Nano Banana Pro defaults to a 4-view sheet** when asked for a character. Write "one view image" or "single composition" for a single plate.
4. **Reference handling:** at most 4 references per call (media role `image_references` on `gpt_image_2_5`, `nano_banana_pro`, `nano_banana_2`, `nano_banana_2_1`, `seedream_v5_pro`; role `image` on `gpt_image_2` and `cinematic_studio_2_5`; one `image` only on `soul_cinematic`; none on the Soul Cast and Soul Location tools; value = the approved image's Higgsfield job ID, or its `media_id` after upload). In image prompts, references are named `Image 1`, `Image 2` … in the order of `medias`: one form per prompt, never an ordinal that has not been checked against the attachment order (Kimti's ordinals were wrong in 10 of 12 prompts). Each reference gets ONE job plus a "not its …" limit ("Image 2 = wardrobe only; not its background, light or pose"; 8 of 12 films). With references attached, identify subjects by a short handle, put composition and pose first, and do not re-describe what the reference shows: lean prompts hold faces better. When a reference and the text disagree, the image wins (SÉKOU, LEAK, Kimti), so fix the image.
5. **Three or more characters in one keyframe:** generate each identity alone and composite. Never co-generate them. At most 2 identities per Seedance generation (3.1.1).
6. **Fix, don't rebuild** (7 of 12 films): one change per edit with E1 (row 11: `nano_banana_pro` 2k; Sunburst max 2k for precise, text-sensitive or mechanical fixes); on the identity base, mask the changed region back onto the original. Short prompts for surgery (The Breach: median 24 words; Buzkashi: 37% of edits at 12 words or fewer), long prompts for look. Run each edit as about 4 takes (Buzkashi: 1,725 jobs from 384 prompts). Build the Avoid list from the failure just seen. After two failed repairs of one defect, restart from the last accepted image.
7. **Keyframes and first frames** (row 10; route 1d in 3.3, and 05): build them by edits, one change per pass. Pass 1 puts the locked character into the approved plate (E2); each later pass is "keep … exactly, only X changes" (E1). When a frame's composition, light and emotion are right but the face is not, use E3 rather than a new generation. 2k at the film aspect; 4k only for a frame that becomes a Seedance reference.
8. **Optional comparison route:** Higgsfield's bundled character-sheet workflow, via `get_workflow_instructions {workflow: "character-sheet"}`, run only on the user's explicit request.

**E1 one-change edit** (Buzkashi #10, Fukushima, THREAD; row 11):

```text
Keep this {{photograph | sheet | plate}} exactly as it is — the same {{list what this image
contains: room, light, people, layout, colours, focus}}. Change one thing only.
{{THE CHANGE, physically: what, where ("between {{object A}} and the edge of {{surface}}"),
material, wear, size in cm}}. It {{rests | hangs}} in the existing light and casts the same soft
shadow as everything else in that light.
Do not move, resize, relight or redraw anything else in the image. Do not change the faces, the
clothing, {{other protected items}} or the composition.
```

For a tricky removal, name the failure on both sides (THREAD): "Removing {{x}} also removes {{y}} = a failed image; {{x}} still visible = a failed image."

**E2 put the locked character into an approved frame** (Buzkashi's 220 insert edits, Kimti, The Breach; row 10):

```text
Replace the {{person}} in Image 1 with the person from Image 2 (identity sheet).
Use Image 1 as a direct reference for light, composition, pose and framing. Take from Image 2
ONLY face, hair, skin tone and wardrobe — not its grey background, not its flat light, not its
panel layout. The {{mark}} stays on the {{side}} — do not mirror. Keep everything else in Image 1
exactly the same.
```

**E3 face-structure transfer** (THREAD E3, which made its first frame; row 12):

```text
Edit Image 1. Image 2 is the character reference. It provides ONLY the three-dimensional shapes
of the facial features — bone structure, brow ridge, cheekbones, nose, jaw, chin, the cut of the
eyelids and lips. It provides NOTHING else: not its skin colour, not its lighting, not its
exposure, not its clean skin, not its neutral expression, not its background.
EXPOSURE AND LIGHT ON THE FACE — copy from Image 1: {{direction, falloff}}. FORBIDDEN:
brightening the face, flattening the light, opening the shadows. If in doubt, render the face
DARKER and more shadowed, never brighter.
SKIN COLOUR AND TEXTURE — copy from Image 1: {{cast, sweat, dust}}. FORBIDDEN: cleaning,
smoothing, warming.
EXPRESSION — copy from Image 1, muscle by muscle: {{brows, lids, eyes, mouth, chin}}. FORBIDDEN:
relaxing or neutralising any of it.
EVERYTHING OUTSIDE THE FACE — identical to Image 1, pixel for pixel.
The result must read as the SAME photograph of the SAME moment — only the underlying bone
structure of the face has quietly shifted toward the reference.
```

### 3.1.9 Robots and other non-humans

HUNGER built its non-human from 40 elements, and it appears in about 23 of the film's 42 final takes. Mapping that creature method onto our robots is [INFERRED].
- **State sheets** on the grey plate, "photographed as if physically present on set": a dark, matte, low-specular body with one bright plane (face oval, visor or light line) where the practical light will fall. One sheet set per state (`idle`, `lit`, damaged).
- **Route:** the identity-sheet row (2), with a `seedream_v5_pro` 2k board beside it: Seedream won HUNGER's creature over Nano Banana Pro's pale version.
- **Scale line-up** (`scale`): the robot beside the human lead on one baseline, heights in cm. HUNGER's line-up missed its own targets (about 70/105/135/200 cm against 40/90/160/260–280 asked), so the sheet fixes order and rough ratios only; every shot prompt restates the size in cm, a landmark on the lead's body and the architecture (05).
- **Eye-level plate** for every set it appears in (3.1.6 #5).
- **Mutate, don't redesign:** a later state is an edit of the approved design; fix the body and the face in separate passes.
- **G and dignity:** no national dress on a robot (3.1.3); menace stays mild (no lunge at a person, no frightening reveal). The video-side integration block lives in 05.

```text
STATE SHEET: {{NAME}}, {{state}} — {{robot}} reference on a flat neutral grey #8A8A8A background,
photographed as if physically present on set. {{Silhouette}}; a dark, matte, low-specular body with
one bright plane, {{the face oval / visor}}, where practical light will fall. Weight shows where it
touches the floor. {{Material words: brushed, matte, tactile}}. {{MARK or panel seam with its
side}} — do not mirror. Not plush, not vinyl, not a mascot, not CGI, not a toy. No text.

SCALE LINE-UP: This is a technical continuity lineup, not a cinematic scene. {{Lead}} ({{cm}} tall,
{{LOOK item list}}) stands beside {{NAME}} {{in each state}}. All figures stand on the same floor
baseline, straight-on, no perspective distortion, plain grey background, even light. {{NAME}} is
{{cm}} tall: its top reaches {{the lead's shoulder}}.

LATER STATE: Use the original {{NAME}} in Image 1 as the STRICT identity reference. This is the
same {{NAME}}, not a new design. IDENTITY — MUST PRESERVE: {{face plane, joints, proportions}}.
The ONLY change: {{x}}. {{If the body is already right: "The body is already correct. Do not
redesign the body."}}
```

### 3.1.10 Transition assets

For every transition tagged in 01 or the shot list (`T-ENV`, `T-OBJ`, `T-BIRTH`, `T-ABSORB`, `T-BLACK`, `T-MEDIUM`; used by 05's in-take transition template):
- a `start` plate and a `target` plate; the TARGET plate is the next shot's STARTING plate (UNPROMPTED). Both are plate-law masters, or phase edits from the same camera (rows 5–7);
- one `seam` still (B5) showing both states in one frame (row 6 route: `gpt_image_2` 2k high, Images 1–2 = the start and target plates).

The evidence is UNPROMPTED, a Cinema Studio film, not a Seedance one (three seam plates fed 10–18 video jobs each); that a seam still teaches Seedance the in-between is [INFERRED]. If a pilot scene carries a tagged transition, the pilot judges it.

**B5 seam plate** (UNPROMPTED E12):

```text
{{ASSET}}_seam · 16:9, one frame, no people. {{Shot size}}, locked-off, eye level. Image 1 is
{{place A}} (geometry and light only); Image 2 is {{place B}} (geometry and light only). Across the
middle of the frame the materials change without a wall or a door: {{A-thing}} becomes
{{B-thing}} mid-floor; {{A-thing}} becomes {{B-thing}}; {{3–5 pairs}}. One light source, {{which}},
with no fill. One dominant hue, {{x}}, plus one accent, {{y}}. No people. No text. No dissolve,
no double exposure, no overlay, no visible seam line.
```

### 3.1.11 Midjourney V8.2 (optional; the user runs it by hand)

Midjourney is no longer a default deliverable (decision 2026-11-02). Write a card only when the user asks for one. Its stills are look development, plate ideas and style sources; they enter Seedance only after passing the 3.4 test, and a kept image is uploaded to Higgsfield once (3.3 rule 2). If they use it, Stealth must be on first (rule 7). Facts below are checked against Midjourney's release notes (2026-10-30). The parameter rules are paraphrased from avienor/midjourney-prompts and zy-cinematic-realism; the edit method is adapted from midjourney-v8-2-edit-architect (MIT).
- **Prompt shape:** natural sentences, subject and must-keep details first, then setting, light, style; parameters last. V8 rewards longer, specific prompts; drop filler such as "8K, masterpiece".
- **Default suffix:** `--v 8.2 --raw --ar 16:9`. `--hd` only for keepers (editing an HD image returns SD, so upscale again after any edit). Leave `--s` at default; A/B test 50 / 100 / 250 only under a fixed `--seed`, one change at a time.
- **Never emit:** `--q`, `--cref`/`--cw`, `--oref`/`--ow` (silently forces V7), `::` text weights, decimal ratios (`239:100`, never `2.39:1`), or "no X" in the prompt text. `--no` only for concrete objects, never clothing words: `--no` parses each word on its own, so `--no modern clothing` also strips clothing.
- **Identity: the Edit Model.** Web: drag up to 4 references into "Attach to prompt". Discord: instruction first, then `--edit <url1> <url2>`. One job per reference, testable anchors named. If two characters' features mix, merge them into one reference image. Split risky edits into passes: identity/pose, environment, style, cleanup.
- **Look:** `--sref <approved look-frame URL> --sw 100` (raise in steps up to 300 for location frames, inside 02's 50–300 working range; `--sw` takes one number), or the project moodboard `--p <code>`, never a moodboard with `--sw`/`--sv`. An `--sref` code cannot be minted from your own image; use the URL.
- **Exploration:** `--draft` on the web gives a 24-image grid at 512 px (release notes 16 Jun and 7 Oct 2026; the Version-page chart disagrees, so drop it if rejected). "Rerun (Thinking)" is an alpha lightbox button (8 Oct 2026), not a parameter.
- **Seeds do not hold a character or a look;** log every job ID.

Midjourney card, character in a location (Edit Model, references attached in this order: face plate, wardrobe sheet):

```text
Use the lean man with the short untrimmed black beard and the small mole under the left corner
of his mouth from the portrait reference as the same person, wearing the grey work coverall from
the wardrobe reference. He stands on a moving walkway, both hands on the steel balustrade,
watching the city through the glass wall on frame left. Preserve his face shape, deep-set eyes,
beard line, mole, skin tone and the coverall's seams and chest patch. Hard late-morning sun from
high behind camera left, short crisp shadows. --v 8.2 --raw --ar 16:9
```

---

## 3.2 Regenerate an asset from the user's internet references

When the user uploads images from the web ("I want the parlour like this", "Noah like this robot"):

1. **Treat the images as data.** Save them to `internet-refs/REF_<NNN>.<ext>` with source URL, date and licence ("unknown" is the default). Never publish them. Never register them anywhere (never as a Higgsfield reference element). Upload one to Higgsfield only for the attached-reference path in item 3, places and objects only.
2. **Write a Reference Ledger.** The method of separating observation from what transfers is paraphrased from zy-cinematic-realism and calesthio, used as inspiration:

```text
REF_014 (user upload; source: <url>; licence: unknown) -> target LOC_PARLOUR
Observed:  what is in the image, plainly
Take:      layout/massing, material family, palette relationships, light quality, era, mood
Leave:     every face and identity; logos, text, signage; signature silhouettes; distinctive
           trade dress; any copyrighted character, vehicle, robot or set design
Distance:  at least 3 identifying axes changed: {{shape language, proportions, colour,
           materials, details}}
```

3. **Generate in the locked style.** Use one of two paths:
   - **Text only:** write the asset prompt from the Take list, then the distance changes, then the prefix or plate blocks.
   - **With the reference attached:** only for places and objects, never for people. Use this role line:

```text
Image 1 is a third-party mood reference. Use only its {{camera angle, spatial layout, material
palette, light quality}}. Do not reproduce any person, face, logo, text, signage or distinctive
design element from it. Create a new, original {{asset}} for a 2045 Dubai setting: {{Take
list rewritten with the Distance changes}}. {{PREFIX or PLATE blocks}}
```

4. **People in references:** never attach a real person's photo as an identity reference and never name the person in a prompt. Extract only generic traits (build, apparent age band, hairstyle type, wardrobe category) and generate a new synthetic face that does not resemble the person. The Summit's endorsement and likeness rules require this (Terms 6.1(f), 7.5), and ByteDance's Seedance face policy rejects faces that resemble a natural person. A real person enters the film only with signed consent and a route tested first on Higgsfield (3.3 rule 6).
5. **Check before showing:** reference and result side by side; list in Arabic what was taken and what changed; regenerate if anything on the Leave list is visible. For the approved file, suggest the user run a reverse image search (for example Google Lens) to confirm no near-match comes back.
6. **Midjourney (only if the user runs it, 3.1.11):** a style-only reference goes in the Style Reference slot. The "Image Prompt" slot copies content and composition, so never put a third-party design there, and never use a third-party identity as an Edit-Model reference.

Worked mini-example: the user uploads a photo of a well-known humanoid robot for Noah.
- **Take:** an elegant grey humanoid with visible neck actuators, a matte composite shell, a calm, slow presence.
- **Leave:** the robot's specific face design and head shape, its colour scheme, its maker's marks.
- **Distance:** a closed, featureless brushed-titanium face oval with a thin horizontal light line instead of a sculpted face (no mouth, so no lip-sync, as 01 suggests); a tailored dark high-collared long coat over the chassis (never national dress on a robot); 1:1 human proportions at 186 cm; exposed carbon tendons only at the wrists.
- **Sheet:** `CHR_NOAH` gets the robot set of 3.1.9 (state sheets, `turn3` with a head panel in place of a face, `scale` beside Miraj, eye-level plates where needed), plus a `PRP_`-style macro of the wrist joint. Name each mechanism in the shot prompt when it moves.

---

## 3.3 Seedance real-face reference policy

| Fact | Source and status |
|---|---|
| ByteDance's Seedance 2.5 and 2.0 do not accept reference images or videos that contain real human faces; an AI portrait that matches no natural person can pass; photoreal AI faces are often flagged | BytePlus portrait-asset guide (official, read 2026-10-30); Comfy.org Seedance 2.0 node docs; field reports. Whether Higgsfield's `seedance_2_5` applies the same filter, and how it words a refusal: **unknown; T1 tests it** |
| Best practice per character: a vertical full-body frontal image plus a vertical face close-up (frontal, no expression, above the shoulders, face about two-thirds of the frame) | same BytePlus guide; craft rule, used here for `face` + `body` |
| Higgsfield `seedance_2_5`: modes `t2v`, `omni_reference`, `video_edit`, `video_extension`; 4-30 s; 480p/720p/1080p; `generate_audio`; `bitrate_mode` standard/high; `draft: true` gives a 480p draft that can be finalized at 1080p with `draft_job_id` **within 7 days**; media roles `start_image`, `end_image`, `image_references`, `video_references`, `audio_references`; ratios auto, 21:9, 16:9, 4:3, 1:1, 3:4, 9:16 | `models_explore get seedance_2_5` (2026-11-01) |
| A reference's `medias[].value` is a `media_id` (`media_upload` → PUT → `media_confirm`) or the `job_id` of an earlier Higgsfield generation; an approved sheet made in Higgsfield goes in by its job ID, untouched | `generate_video` tool description (2026-11-01) |
| Higgsfield reference elements: `manage_reference_elements` `action: create` from one clear image (`medias[]` with `id`, `url`, `type` `media_input` or `image_job`); used by writing `<<<element_id>>>` in `params.prompt` (the backend injects the image and rewrites it to `@<element-name>`; never put the ID in `medias`); usable only at `status: completed` (`processing`, `ip_checking`, `failed`, `nsfw` are not). Its supported video list names `seedance_2_0`, `kling3_0` and Cinema Studio, **not `seedance_2_5`**, and "other models ignore the placeholder" | tool description (2026-11-01); whether `seedance_2_5` honours an element: **unknown; T1 tests it** |
| Cost on the user's account: `seedance_2_5` draft 3 credits/s, 1080p 16 credits/s; references and `bitrate_mode` do not change the price | `get_cost`, measured (05) |
| "May contain a minor" is a hard stop with no verification route | third-party; unverified |
| Image limits for Seedance 2.5 inputs: W/H 0.4-2.5, 300-6000 px per edge, < 30 MB per image | ByteDance's Seedance 2.5 API reference (official); Higgsfield publishes none, so keep to these. 16:9, 21:9, 2:3 and 3:4 fit; 3:1, 1:4, 4:1, 1:8 and 8:1 never do |

The BytePlus API offers a private virtual-portrait library (`asset://`) and same-account trusted originals; that route exists but is not used (decision 2026-11-01).

**Rules:**
1. **Never evade the filter.** No cropping, blurring, noise, stylising or partial faces to sneak through. Change the route, not the pixels. Never re-send an unchanged refused request. Log every refusal with its exact error text, the job ID and the credit movement.
2. **Set the T1 route up before D7.** For every human character, the approved `face`, one `body` per look and one `turn3` per look and state are ready, unedited. Sheets made in Higgsfield are referenced by their job IDs; anything made elsewhere (a Midjourney still the user approved) is uploaded once with `media_upload` → PUT → `media_confirm`. If a PNG is over 30 MB, upload a maximum-quality JPEG copy and keep the PNG as the evidence master. If the element route wins (1c), create one element per character and state from the approved image, with a neutral name `<ASSET>_<state>_v<nn>` (≤ 32 characters, e.g. `CHR_MIRAJ_base_v01`; 3.1.1), and wait for `completed`. A new version gets a new upload or a new element. Record every job ID, `media_id` and `element_id` in the bible.
3. **Minors.** If a character reads as a minor (Miraj's younger brother; any child extra), test him or her on day 1. On a hard stop, propose story-safe options: heard but unseen, seen only on the mother's phone screen from behind, or cast as a young adult. The user decides; it is a script change in 01.
4. **Robots and non-human characters** (3.1.9) go through the same day-1 test. A human-like face can still trip the filter.
5. **If only a first frame works (route 1d),** each shot's first frame is built inside Higgsfield by the keyframe route (3.1.8 #7, routing row 10: `nano_banana_pro`, the approved plate and sheets as `image_references`, E2 then E1 passes, 4k for the frame that goes in) and passed to `seedance_2_5` as `start_image` by its job ID. The first frame gets its own ledger row and the user's approval before the video job. The sheets then steer the first frames, the bible and the keyframes; tell them in Arabic before they approve faces.
6. **Real people** (only with signed consent): Higgsfield's handling is untested. Test the route on D1 before anyone is cast; if it fails, the user decides with the full picture.

## 3.4 Day-1 test (T1 in `00-award-brief-and-calendar.md`): will Seedance take our sheets?

Run it on D1 with a provisional Miraj made on the 3.0.1 routes (`face` by A1 on `gpt_image_2`, then `body` and `turn3`), before the style prefix is locked. The test is about the route, not the look. Every job goes to the project's `99_TESTS` folder.
- **Check first:** the Higgsfield connector shows `generate_video` (not only game-publishing tools); the film project and `99_TESTS` exist; the credits cover the quoted test.
- **Seedance settings:** `generate_video`, `model: seedance_2_5`, `mode: omni_reference` when references are attached (apply any `adjustments` the tool returns and log the mode the job reports), `draft: true` (480p), `duration: 5`, `aspect_ratio: "16:9"`, one simple action: "he blinks, breathes, turns his head slowly toward frame left". T1 drafts are tests and are never finalized; a Higgsfield draft can only be finalized within 7 days, so log `draft_expires_utc` anyway.
- **Draft cost:** 3 credits/s, so 15 credits per 5 s draft (references do not change the price). Preflight the whole set with `get_cost: true` and get one yes.

| # | Route on Higgsfield `seedance_2_5` | Pass if |
|---|---|---|
| 1a | `turn3` as `image_references`, by job ID | accepted, and identity holds |
| 1b | `face` as `start_image` | accepted (acceptance only: a sheet is never a production first frame, the clip would open on the grey plate) |
| 1c | Reference element made from `face` (`manage_reference_elements` `create`, wait for `completed`), `<<<element_id>>>` in the prompt, no `medias` | the element completes and the job visibly uses it (the tool lists elements for `seedance_2_0`, not `seedance_2_5`; an ignored placeholder is a fail, never a reason to switch to Seedance 2.0, which is not the competition model) |
| 1d | First frame built inside Higgsfield by the keyframe route (row 10: `nano_banana_pro`, E2) with Miraj in a neutral setting from the sheets as `image_references`; that frame's job ID goes in as `start_image` | accepted, and identity holds |
| 1e | A/B on the working route: `face` + `body` vs `turn3` alone vs `face` alone vs SÉKOU's 4-slot pack (`face` + `heads5-34L` + `heads5-proL` + `turn3`) | best identity hold, including a profile moment |
| 1f | Minor and robot checks (younger brother; Noah; the delivery robot) | a route exists, or a story fallback is chosen |

Order: 1a and 1b first; 1c and 1d only if faces are refused or identity does not hold. Each job is a ledger row (Higgsfield job ID, model, folder `99_TESTS`, references by job ID, refusal text or the SHA-256 of the downloaded draft).

**Judging:** sweep every draft at about 2 frames per second against the `face` plate, because first and last frames hide mid-clip drift (scenario-labs, MIT). Check the output does not copy the grey field or the panel grid. Report a table plus one Arabic recommendation; the working route becomes the rule in `05-seedance-production.md`. The element-or-raw-image choice and whether the video prompt re-describes the face are decided by T1 and 05-T11, never by habit (D-14): both worked in the studies (TOKYO 4:17 and The Breach never re-described the face; CONTROL and Buzkashi always did, CONTROL closing with "100% matches the reference"). Log which method passed in the bible.

**Seedance role lines** that ship with every character asset (nigo-studio, MIT; the format follows the official Seedance 2.5 prompt guide in `seedance-2-5-prompts`; the mark line is SÉKOU's):

```text
<MIRAJ> corresponds to @Image1. @Image1 defines his facial features, hairstyle and clothing.
Use only the appearance; do not use the grey background or the panel layout.
The mole below the LEFT corner of his mouth stays on the LEFT side; do not mirror him.
```

On the element route (1c), write `<<<element_id>>>` where the line says `@Image1`; the backend rewrites it to `@<element-name>`. Never type the `@name` form of an element in a tool call.

## 3.5 The two-scene pilot: what 03 delivers, tests and locks

Decision 2026-11-02: after the script and the style are locked, Claude produces two full scenes end to end (assets → blocking → Seedance drafts → 1080p finals → rough sound and grade) with the final method, and runs the open tests inside them. If the user approves both scenes, the whole film is made on exactly the same basis. The pilot is an internal production test: its name never appears in the film, the credits or the submission.

1. **Pilot-scene assets (G2-P).** From the breakdown, take every asset the two pilot scenes need: characters in the states those scenes show, locations at those times of day (with `rev` for a dialogue scene), props in those states, featured extras, robots or other non-humans, and the plates of any tagged transition. Build them with the full method of 3.1 (casting round, realism pass, star chain, plates as edits of the master, primary and alternative boards for hero assets), then file them in the pilot scenes' folders (`04_SCENES/Sxx/refs`, ledger L.0b) and pass G2-P.
2. **Pilot tests owned by 03.** Each runs inside the pilot. Until the user approves its result, the current rule (column 3) stays in force. Preflight each with `get_cost: true` and get one yes for the set.

| Test | Question | Current rule until approved | Method in the pilot | Pass |
|---|---|---|---|---|
| T-B (D-2; 02 P02-4) | Where does the look live: neutral plates + the frozen LOOK text, or a graded look plate? | neutral plates (rule 3) | one pilot shot drafted twice with identical settings: (a) the neutral master + LOOK text; (b) a graded look plate of the same place (B4, D2 if needed) + the same text; 2 fps sweep | the winner holds skin, black level and grade; the recipe card records the route and 03 makes plates accordingly |
| T-I1 | Do Soul Cast's structured parameters (genre, age, era, outfit, archetype, build) work through the MCP, and what does `budget` change? | casting prompt + `budget` 50 through the MCP, or the user runs the parameter card in the web app | one round of 4 with `character_params` against 4 prompt-only candidates, same brief | the parameters visibly steer age, era, outfit and build → MCP route; otherwise the web-app route stays |
| T-I2 | Does inpainting with a mask (`nano_banana_2_1` or `nano_banana_2`, `is_inpaint` + `mask`) beat E1 on `nano_banana_pro` and Sunburst for a local fix? | E1 on `nano_banana_pro`; Sunburst max 2k for precise fixes | the same defect fixed on copies of one pilot sheet three ways; compare at 100% | a cleaner fix with nothing else moved → it joins row 11 as an alternative |
| T-I3 | Does Soul Location take prompt control? | scouting only; masters from Seedream | B1's PLACE and CAMERA lines sent to `cinematic_studio_soul_location`, 4 variants, for one pilot location | geography follows the text → Soul Location may supply masters |
| T-I4 | `3d_jutsu_angles` against B2 on `gpt_image_2` for a reverse plate | B2 on `gpt_image_2` | one pilot `rev` made both ways from the same approved master | geometry, materials and light match the master and the 180° line holds |

The day-1 test T1 (3.4) and 05-T11 still decide the face route and whether the video text re-describes the face (D-14); the pilot runs on the route they chose.
3. **Recipe lock at pilot approval.** When the user approves both pilot scenes, Claude writes `films/<id>/03-assets/RECIPES_v1.md`: one recipe card per asset job used in the pilot (template in Output templates), with the test results. From then on, every asset fills only its card's `{{slots}}`: same routing row, model, every parameter, template and version, constants (PLATE BLOCK, `PREFIX_PLATE`), reference roles and order, takes per board. A job type the pilot did not cover gets a new card, shown to the user before its first batch. Changing a card makes `RECIPES_v1.1` with their yes and a list of what must be redone (SKILL.md §3).
4. **If the pilot is not approved,** the user names what failed. 03 changes only the failing cards, rebuilds the affected pilot assets, and the pilot re-runs the affected shots (05); then the user judges again.

---

## Output templates (what Claude shows the user)

Chat labels are in Arabic. Prompts and file names stay in English.

**Asset breakdown** (sent first, for approval of the list itself):

| Asset ID | Type | Scenes | Pilot | States / times | Sheets | Routing rows | Gate |
|---|---|---|---|---|---|---|---|
| CHR_MIRAJ | character | S01-S14 | yes | base, dreamsuit | cast, face, heads5 (4), ward-A, ward-B, body, turn3, expr6, lips2, scale | 1, 2, 3 | G2-P |
| LOC_METRO-WALKWAY | location | S04, S12 | yes | noon, bluehour | scout, master, rev, look | 5, 6, 7, 9 | G2-P |
| PRP_LENSCASE | prop | S04, S06, S12 | no | closed, open | views, macro | 8, 11 | G2 |

**Casting card** (one per role and round; saved to `prompts/`):

```text
CASTING  CHR_MIRAJ  round 1          ROUTE  Higgsfield MCP (T-I1 pending) | Higgsfield web (user)
FOLDER   01_CHARACTERS/CHR_MIRAJ  (folder_id <uuid>)
SOUL CAST  cinematic_studio_soul_cast  budget=50  aspect=3:4  candidates=8          (row 1)
  web-app parameters: genre <drama> · apparent age <31> · era <near future> · outfit <workwear>
                      · archetype <everyman> · build <lean>   (origin as in the Brief; never "race")
  MCP prompt: <one line from BUILD + CASTING; no names>
DESIGNED   gpt_image_2_5 variant=sunburst quality=max resolution=4k background=opaque aspect=3:4 x2 (A1 + A7)
COST       8 x 0.12 + 2 x 15 = 31 credits   ->  waiting for your yes
```

**Generation card** (one per asset and sheet; saved to `prompts/`):

```text
ASSET  CHR_MIRAJ_base_turn3  v02        ROUTE  Higgsfield MCP | Higgsfield web (user)
FOLDER 01_CHARACTERS/CHR_MIRAJ  (folder_id <uuid>)
JOB    routing row 2 (identity sheet)    RECIPE  pre-pilot | RECIPES_v1 card <id>
PRIMARY      gpt_image_2  resolution=4k  quality=high  aspect=16:9                  takes=3
ALTERNATIVE  nano_banana_pro  resolution=4k  aspect=16:9                             takes=3 (hero asset)
REFS   Image 1 = CHR_MIRAJ_base_face_v03_G2_t2_APPROVED, job <id> (face, bone structure, skin, hair;
                 not its background or light)
       Image 2 = CHR_MIRAJ_base_heads5-34L_v01_G2_t1_APPROVED, job <id> (head shape from the side only)
       Image 3 = CHR_MIRAJ_base_ward-A_v01_G2_t3_APPROVED, job <id> (wardrobe only; not its pose)
TEMPLATE  A4 (03, 2026-11-02) | USER CHR_TEMPLATE (slots filled: ...)
PROMPT
<full English prompt>
LINT   passed (image pre-send lint below)
COST   <get_cost credits per job x jobs = total>   ->  waiting for your yes
```

**Image pre-send lint** (every image job; failures recorded in the studies: SÉKOU's squares from ratio words, TOKYO 4:17's tie, Kimti's wrong ordinals and chat residue, empty reference slots in HUNGER and CONTROL):
- [ ] The aspect parameter is set (words only steer composition); every field of the model is set (3.0.1 traps).
- [ ] Every reference has exactly one role plus a "not its …" line; `Image N` matches its position in `medias`; no blank or duplicate ordinal.
- [ ] No garment named in a prompt shared across characters.
- [ ] Side-named marks plus "do not mirror the image" wherever the face or the marked object shows.
- [ ] The header code, state and version are present and neutral; the job will be logged with its routing row.
- [ ] The prompt ends where intended (no truncation), with no leftover `{{slot}}` and no chat residue ("Copyable prompt:", alternatives, preambles).

**Selection board** (after each batch):
- Show the gallery: one Higgsfield `show_generation_by_ids` call for the batch; for takes the user ran in the web app, `job_display` per named candidate (`id` = `item_id` from `list_project_assets`, with its `folder_id`).
- Under it, show this table. Recommend one take but never pick for the user.

| Candidate | Route (row, model) | Identity vs base | Plate laws (grey / flat / one face) | Marks on the right side | Hardest axis | Defects | Claude's note |
|---|---|---|---|---|---|---|---|
| A t2 G2 | row 2 primary, GPT Image 2 4k high | 5/5 | ✓ ✓ ✓ | ✓ | skin fatigue 4/5 | rear panel 1 stop darker | fix with an E1 edit on NB Pro |
| B t1 NBP | row 2 alternative, NB Pro 4k | 4/5 | ✓ ✓ ✓ | ✓ | 5/5 | — | strongest depth |

For a casting board, add a column "AI-pretty? (idol face, symmetry, glass skin)" and list the candidates the user rejected first.

Close with the Arabic question: «أي مرشح نعتمده لـ CHR_MIRAJ_base_turn3؟ يكفي حرف المرشح، أو طلب تعديل محدد.»

**Continuity bible entry** (one per approved asset). The schema is owned by `ledger-continuity-physics.md` L.6; use the same keys as `templates/continuity-bible.md` §1, default file `films/<id>/ledger/continuity-bible.md`. Locations and props use `location:` / `prop:` with the fields that apply. 01 adds `voice`; 05b adds `arc_checkpoints`; `devices_worn` comes from the ledger.

```yaml
character: CHR_MIRAJ
status: PROPOSED                     # CONFIRMED once the user approves; their words go to decisions.md
canonical_description: "<build, face, skin + undertone, hair, hands: from the approved Brief>"
identity_anchors: [long oval face, deep-set brown eyes, mole 1 cm below left mouth corner,
                   short untrimmed beard thinner on cheeks, bump on nose bridge]
marks: ["mole 1 cm below the LEFT corner of the mouth"]   # side-named; "do not mirror" in every sheet and face-showing prompt
casting: "Soul Cast round 1, candidate C07, job <id>; realism pass job <id> (A5)"
locked_reference_assets:
  - file: approved/CHR_MIRAJ_base_turn3_v02_G2_t2_APPROVED.png
    sha256: "<hash of the downloaded original>"
    model: gpt_image_2               # Higgsfield model id
    routing_row: 2
    params: "resolution=4k;quality=high;aspect=16:9"
    route: Higgsfield-MCP           # or Higgsfield-web (user)
    account: "<account + plan>"
    job_id: "<Higgsfield job id>"
    folder: 01_CHARACTERS/CHR_MIRAJ
    date: 2026-11-03
    parent: CHR_MIRAJ_base_face_v03_G2_t2_APPROVED.png   # always the approved face (star chain)
    template: A4                     # or "USER CHR_TEMPLATE" (origin H)
    recipe: "pre-pilot"              # or "RECIPES_v1 card CHR-turn3" after the pilot
    prompt_file: prompts/CHR_MIRAJ_base_turn3_v02.txt
    picked_by: AboStesha
    words: "<their words>"
seedance_asset_ids:                  # L.6 key; on Higgsfield it holds the T1-route references
  - route: image_references          # the day-1 winner: image_references | element | first_frame
    value: "<Higgsfield job id or media_id>"
    file: CHR_MIRAJ_base_turn3_v02_G2_t2_APPROVED.png
    element_id: "<uuid; element route only, status completed>"
    tested: "T1 <date>, seedance_2_5 job <id>"
face_redescribed_in_video: no        # T1 / 05-T11 result (D-14)
role_line: "<MIRAJ> corresponds to @Image1. @Image1 defines his facial features, hairstyle and clothing. The mole below the LEFT corner of his mouth stays on the LEFT side; do not mirror him."
hands: "smart ring on the right ring finger"
looks:
  LOOK_A: "<item by item, top to toe>"
states: [base, dreamsuit]            # each state is its own sheet
height_cm: 174
allowed_variations: [expression, pose, sweat, dust on coverall]
forbidden_variations: [beard length, mole position, skin tone, patch position, ring finger]
used_in: [S01, S02, S04]
midjourney: []                       # optional; only jobs the user ran: ["job <id>: look development only"]
synthetic_or_real: synthetic         # cl. 5.5(d); internet refs used: none
approval_required_for: [face regeneration, wardrobe redesign]
```

**Recipe card** (one per asset job in `RECIPES_v1.md`, written at pilot approval, 3.5):

```text
RECIPES_v1 · locked <date> at pilot approval · their words: "<verbatim>"
CARD CHR-turn3 · routing row 2 · template A4 (03, 2026-11-02)
PRIMARY      gpt_image_2 resolution=4k quality=high aspect=16:9 · takes 3
ALTERNATIVE  nano_banana_pro resolution=4k aspect=16:9 · hero assets only
REFS         Image 1 = approved face (identity) · Image 2 = heads5-34L (head shape only)
             · Image 3 = heads5-proL (head shape only) · Image 4 = ward-<LOOK> (wardrobe only)
CONSTANTS    PLATE BLOCK sha256 <…> · PREFIX_PLATE sha256 <…> · headless variant A | B
SLOTS        {{LOOK item list}} {{back construction}} {{FACE traits}} {{mark}} {{side}} {{patch}}
PILOT        made <files> · used in pilot shots <Sxx-SHxx …> · T-B <result> · T-I1…T-I4 <results>
COST         11 credits per take (get_cost <date>)
```

**Day-1 report** (copy of the 3.4 table with results, error texts, timings, costs and the recommended route).

## Gate: G2-P (pilot-scene assets) and G2 (all assets); the user approves each before those scenes are blocked

**G2-P** covers only the assets the two pilot scenes need and opens the pilot. **G2** covers every asset of the film, built on `RECIPES_v1` after the user approved the pilot. Dates live in 00's calendar. Each item below applies to the assets in that gate's scope.

- [ ] The asset breakdown is approved. Every listed asset has an `_APPROVED` file picked by the user by candidate ID, with their words logged.
- [ ] Characters: a casting pick and a realism-passed `face`; `heads5` angles, `body` and `turn3` for every look and state, all derived from the approved face (star chain); `expr6` and `lips2` for speaking or close-up roles; one wardrobe sheet per look; side-named marks in the bible; a scale frame where subjects share frames.
- [ ] Extras: featured extras have `face` + `turn3` + the A9 note; anonymous extras have no sheet or element.
- [ ] Locations: a master for every script time of day; a reverse plate for dialogue scenes; every other view and phase made as an edit of the master; eye-level plates for small subjects; plates normalised to the master; the affordance check passed against every beat.
- [ ] Props: views planned from the shot list, one sheet per state, the surviving detail stated, dimensions logged.
- [ ] Robots and other non-humans: state sheets, the scale line-up, eye-level plates. Tagged transitions: `start`, `target` and `seam` plates.
- [ ] Every image job passed the pre-send lint and is logged with its routing row and model id.
- [ ] G2-P only: the pilot tests owned by 03 (T-B, T-I1…T-I4) are prepared and priced, and the pilot-scene assets sit in their scene folders.
- [ ] G2 only: every asset made after the pilot matches its `RECIPES_v1` card; any deviation has its own recipe version and the user's yes.
- [ ] The day-1 route on Higgsfield `seedance_2_5` is proven, and every human character is set up on it before D7: approved sheets referenced by job ID or `media_id` (1a), elements at `completed` (1c), or the first-frame recipe approved (1d), all logged in the bible. Minor and robot outcomes are decided.
- [ ] The G2 compliance list in `00-award-brief-and-calendar.md` passes: synthetic faces, no lookalikes, no brands, Gulf wardrobe confirmed by the user, children shown with dignity.
- [ ] 3.2 assets: the ledger is filed, nothing from a Leave list is visible, and reverse search is done or declined.
- [ ] A continuity bible entry exists for every approved asset. Provenance fields are complete. Metadata is untouched.
- [ ] Every approved asset (and the T1 route result) has its `prompt-library/` entry (SKILL §7b).
- [ ] Midjourney, only if the user ran it: kept images logged with job IDs; Stealth confirmed.

Ask in Arabic. G2-P: «هل نعتمد أصول مشهدَي التجربة كما هي، ونبدأ تنفيذ المشهدين؟» G2: «هل نعتمد كل الأصول في لوحة G2 كما هي، وننتقل إلى الخطوة 4: البلوكنغ لبقية المشاهد على وصفات التجربة نفسها؟» Silence or a change of subject is not approval.

## Common failures

| Symptom | Cause | Fix |
|---|---|---|
| Faces drift to "generic" in Seedance | several faces on the reference sheet | headless body panels; one face; `heads5` and `expr6` are never identity references |
| Rear panel darker or tanner | no skin-tone clause | add the identical-value-and-hue clause; one-line E1 edit on NB Pro, then mask back |
| A pretty, generic "AI face" in the lead | described, not cast; no imperfections | casting round (3.1.4), the user rejects the AI-pretty faces first; A7 blocks for designed faces |
| Pores look etched, skin reads CG after the realism pass | realism pushed too far | "Avoid excessive micro-detail or artificial sharpening"; reject the pass and keep the pick |
| A garment appears on the wrong character (TOKYO 4:17's tie) | a garment named in a realism prompt shared across characters | "preserve the wardrobe exactly as in the reference"; never name garments in a shared prompt |
| A scar or mole jumps sides between angles | no side named; angle made from a mirrored or previous angle | side-named marks + "do not mirror the image"; every angle from the approved front (star chain) |
| Identity drifts a little more with each angle or state | chained edits (angle from angle) | rebuild from the approved front |
| A square image when 16:9 was written (SÉKOU) | ratio given in words only | set the aspect parameter |
| A bare `gpt_image_2_5` or `gpt_image_2` call comes back as a soft draft | defaults are flare / low / 1k | set `variant`, `quality`, `resolution` (and `background`) every call |
| An asset or element name appears as a sign in the picture (TOKYO 4:17) | a descriptive word in the name | neutral codes (3.1.1); rename and re-create the element |
| The same face repeats in the crowd | extras given a sheet or co-generated with the leads | anonymous extras live in the shot text; at most 2 identities per generation |
| Soul Location ignores the written geography | it is a preset scout (aspect only); prompt control untested | master in Seedream from B1; T-I3 decides |
| A robot shrinks or grows between shots (HUNGER) | the scale sheet alone carries size | cm + a landmark on the lead's body + architecture in every shot prompt (05) |
| Character carries studio light into every scene | lit or graded plate, grain baked in | the plate block exactly; grain only in the prefix and grade |
| Grey background or panel grid appears in video | missing exclusion | role line: "do not use the grey background or the panel layout" |
| Glowing ring or open lens case in shots where it should be off or closed | state shown on the base sheet | separate state sheets; attach only in that state |
| Skin turns plastic after edits | whole-frame passes on the base | edit a copy and mask only the region back; restart from the last accepted image after two failed fixes |
| GPT Image 2 sheet reads flat | model limit on that asset | the same prompt on `nano_banana_pro` 4k; then the 45° soft key fallback (rule 3) |
| Location changes geometry between times of day or angles | regenerated, not edited | edit the master (B3, B4): "only change the camera" or "only the lighting changes"; keep camera, lens and framing |
| Plates jump in brightness between cuts | no master normalisation | match exposure to the master plate |
| Beautiful plate, but the action has nowhere to happen | judged on beauty | affordance check against each beat before the board |
| Nano Banana Pro returns a 4-view sheet for a hero frame | its default | "one view image / single composition" |
| Indoor subject placed outdoors | location fed as an image reference to NBP | describe the location in text; attach only the topology plate |
| Garbled Arabic or brand-like text on signs | text generated in-image | blank surfaces; composite in 07 |
| A prop's mark or shape keeps coming back wrong after a prompt change | the prop image wins over the text (SÉKOU) | fix the sheet with E1 (Sunburst max 2k for text or mechanics) |
| Midjourney prompt errors or drifts to V7 (optional route) | `--q`, `--cref`, `--oref`, `2.39:1`, `::` | the 3.1.11 suffix rules |
| Midjourney images public during the holdback | no Stealth | Pro/Mega plan with Stealth on before the first job |
| `seedance_2_5` on Higgsfield refuses a face reference | a real-looking face in the reference | switch to the T1 fallback (element 1c or Higgsfield-made first frame 1d); log the exact text; never re-send the unchanged request or alter the face to evade |
| Copyright or policy refusal | an asset too close to a third-party design (3.2) | widen the Distance list and rebuild the asset; never alter pixels to slip through |
| Element stuck in `processing` / `ip_checking`, or `failed` / `nsfw` | review rejected it | rebuild further from any lookalike or logo; never re-create it unchanged |
| Element placeholder ignored in the video | the elements tool lists `seedance_2_0`, not `seedance_2_5` | `image_references` or a Higgsfield-made first frame; never move the shot to Seedance 2.0 |
| Double charge on Higgsfield | a generate call re-sent after a timeout | reuse the returned job ID and check it with `jobs_wait`; resubmit only once the first outcome is known |
| A web-app take is missing from the ledger | the user generated by hand | `list_project_assets` on the folder, then `get_project_asset_prompt`; log it the same day |
| 4K Sunburst artefacts | above 2560×1440 is experimental (OpenAI) | 2K max, then row 14 (`upscale_image`) |
| An asset made after the pilot does not match the pilot's look or identity hold | its recipe drifted from the locked card | rebuild it on its `RECIPES_v1` card; a deliberate change is a new recipe version with the user's yes |

## Sources and credits

**Method learned from public Higgsfield projects** (studied 2026-11-02 through the Higgsfield MCP project tools; method only: no character, face, design, prop, location or story is copied). Study files `prompt-library/studies/2026-11-02_<key>.md`, merged in `2026-11-02_CROSS-STUDY.md` §3A, §3C and §4.2; templates A1–A10, B1–B5, C1, D1–D2 and E1–E3 are adapted from them. Codes as used above:
- **The Breach (B★), by `@sileent`:** header codes on prompts, ghost-mannequin costume edits, "do NOT copy the emotional expression", a 7-engine look shoot-out, prop isolation by edit.
- **Fukushima (F★), by `@aist`:** Seedream plates and props at scale, Sunburst max 2K precise edits, costume canon with HEX colours, side marks with "do not mirror", vehicle matched views, the B1 block order, the D2 lens pass.
- **Kimti (K★), by `@ameerahmed`:** Soul Cinematic plates with the locked actor swapped in, positions and distances in plates, Avoid lists built from the last failure.
- **SÉKOU (S★), by `@mauriziocibelli`:** A1–A4 (casting seed, same-session angles, "The only change", one-face 3-panel sheet), the star chain, the 4-slot pack, "no grain overlay", the aspect-parameter lesson, the image-beats-text lesson.
- **LEAK (L), by `@creativemanifesto`:** side-named marks; the scene state written into the cast line.
- **UNPROMPTED (U), by `@shestak`:** STARTING and TARGET plates, the seam plate (B5), Seedream and Sunburst angle edits side by side.
- **THREAD (T), by `@pandaproduction`:** the reverse plate of a locked room (B2), the face-structure transfer (E3), Nano Banana Pro sheets and "keep everything exactly as it is" edits, the prop's surviving-detail line, the 4-engine look-dev order.
- **TOKYO 4:17 (TK), by `@nicholastakeyama`:** Soul Cast casting rounds, the GPT Image 2 4K realism pass (A5), the two-reference re-sheet (A6), designed-face imperfections (A7), the minor-role sheet (A8), the extras generator (A10), Soul Location plates, the 45° key fallback, the name-as-signage and shared-garment hazards.
- **In Passing (IP), by `@julianmarshall`:** anonymous extras as text only, the featured-extra note (A9), the two-identity cap.
- **CONTROL (C), by `@pietromalegori`:** the headless one-line fix, a 4-input Nano Banana Pro sheet, Soul Cinematic faces from structural description, "100% matches the reference".
- **HUNGER (H), by `@sssacccade`:** coverage and eye-level plates (B3), phase plates, non-human state sheets, the scale line-up and "mutate, don't redesign" (3.1.9), the element-swap provenance warning.
- **Buzkashi (BZ), by `@sqr_studio`:** relight edits written in values and the sky match (B4), one-change edits (E1), keyframes built by edits and the character insert (E2), B&W designed inside colour prompts.

Routing table, prices and model-id traps: Higgsfield MCP `models_explore` and `generate_image` `get_cost: true`, verified 2026-11-02 with no generations; image upscale and Topaz routes verified on the MCP only.

Quoted or adapted with credit (licence checked in each cloned repo, 2026-10-30):
- **OSideMedia/higgsfield-ai-prompt-skill v3.42.0, MIT:** grey law, one readable face, location plates, reverse plates and normalisation, prop views, red arrow (templates/ad-asset-prep.md); identity-lock structure (reference-sheet-workflow.md); untouched base, "a sheet is not a menu", prompt economy, hybrid-sheet consent rules (skills/higgsfield-soul); Higgsfield ids and params (image-models.md, specs snapshot 2026-09-26).
- **A0339x/ai-film-pipeline, banana-pro-director 3.0, MIT:** flat-grade plate block, 3-panel headless sheet with ghost-mannequin and neck-cut variants, skin-tone clause, face-lock mode.
- **nigo-studio/ai-film-skills, character-consistency, MIT:** Character Brief, Seedance role line.
- **israelmusondaayliffe/midjourney-v8-2-edit-architect, MIT:** reference roles, anchors, pass order for Edit-Model consistency.
- **magiccreator-ai/gpt-image-2-5-prompt-skill, MIT:** change/preserve editing pattern, OpenAI size constraints.
- **scenario-labs/skills, scenario-consistency, MIT:** never chain outputs, composite multi-character frames, 2 fps drift sweep.
- **higgsfield-ai/skills higgsfield-generate v0.14.0, MIT:** CLI id aliases.

Paraphrased as inspiration only:
- avienor/midjourney-prompts: no licence file; Midjourney facts re-checked against official release notes.
- popopo-99/zy-cinematic-realism: CC BY-NC 4.0; continuity bible fields, reference ledger, Midjourney adapter cautions.

Official and vendor sources: OpenAI image-generation guide, Google `gemini-nano-banana-2.1` model page and Gemini image-generation guide (all fetched 2026-10-30); Midjourney release notes ("Version 8.2" 24 Jul, "Edit Model for V8" 27 Aug, "Alpha Changelog 10/7/26" and "Testing Thinking Mode" 8 Oct 2026); BytePlus ModelArk docs read as markdown on 2026-10-30 (`seedance-portrait-asset-guide`, Seedance 2.5 API reference; the virtual-portrait, purchase and error-code pages served the unused BytePlus route); Higgsfield MCP tool descriptions (`generate_image`, `generate_image_batch`, `generate_video`, `manage_reference_elements`, `media_upload`, `list_project_assets`, `get_project_asset_prompt`, `get_project_asset_source`, `jobs_wait`, `create_folder`, `upscale_image`) and `models_explore get` for `seedance_2_5`, `gpt_image_2_5`, `nano_banana_pro`, `nano_banana_2_1`, `seedream_v5_pro` (read 2026-11-01); on 2026-11-02 also `gpt_image_2`, `nano_banana_2`, `soul_cinematic`, `cinematic_studio_soul_location`, `soul_location`, `cinematic_studio_soul_cast`, `soul_cast`, `soul_2`, `soul_cinema_studio`, `cinematic_studio_2_5`, `cinematic_studio_image`, `3d_jutsu_angles`, `seedream_v5_lite`, `seedream_5_0_flash`, `topaz_image` and `upscale_image` providers.

Third-party, marked unverified where used: laozhang.ai Seedance real-person guide (22 Oct 2026, the minor hard stop); Comfy.org Seedance 2.0 partner-node docs (AI-portrait classification).

Carried over from the user's old skills: wardrobe specificity, prose skin tone, multi-character uniformity, "when not to make a sheet" (cinematic-pipeline CHARACTER_SHEET_RULES); prompt-card structure and the failure-table idea (MIDJOURNEY_RULES, with its parameters corrected); role binding (seedance-2-5-prompts).
