# 03 — Assets: Characters, Locations, Props (Step 3)

Purpose: turn every character, location and prop in the locked script into approved, versioned reference images that Seedance 2.5 will accept and that hold identity across 40-100 shots.
Each asset is generated inside Higgsfield in GPT Image 2.5 Sunburst at max quality and in Nano Banana Pro / 2.1, with a parallel Midjourney V8.2 prompt the user runs by hand. The user picks every winner from a selection board.
Talk to the user in Arabic. Write every generation prompt in English. Nothing leaves this step without a continuity-bible entry and a proven Seedance reference route on Higgsfield (3.4).
Route (decision 2026-11-01): every image and every Seedance 2.5 job runs in Higgsfield, through the MCP or by the user's hand in the Higgsfield web app inside the same project (3.0).

---

## Inputs

- **From `01-script-and-dialogue.md`:** the locked script, the Locked Sheet and the scene list. Each scene names its characters, location, time of day and reality layer (REAL / DREAM / SCREEN).
- **From `02-style-prefix.md`:** the locked prefix in its variants: the stable core (prose for GPT/Nano Banana), the Midjourney compression plus moodboard or `--sref` source, the sequence overrides (dream layer, night), and `prefix/plate-safe.txt` (`{{PREFIX_PLATE}}` below). 02 §2.6 always saves `prefix/plate-safe.txt`. If it is missing, stop and ask for the 02 lock files rather than deriving one: a plate-safe text keeps only the medium anchor and texture clauses and never any light, lens, grade, grain or palette-cast clause.
- **The shot list, when it exists (`04-blender-blocking.md`).** Prop views and location angles are planned from it. Before it exists, plan from the script and revise once it lands.
- **The user's own prompt templates (optional slots):** `films/<id>/03-assets/user-templates/CHR_TEMPLATE.md` and `LOC_TEMPLATE.md`, or text they paste. See 3.1.2.
- **Internet reference images the user uploads (3.2).**
- **Tool status:** the Higgsfield MCP (`generate_image`, `generate_video` and the project tools visible or not), and the film's Higgsfield project with its folders from ledger L.0b (`01_CHARACTERS/CHR_<NAME>`, `02_LOCATIONS/LOC_<NAME>`, `03_PROPS/PRP_<NAME>`, `99_TESTS`).
- **The ledger and physics data in `ledger-continuity-physics.md`:** sun position per scene, scale and continuity schema.

## Ground rules

1. **Verify versions at session start (3.0).** Never quote a parameter from memory.
2. **Quote cost, then spend.** Higgsfield MCP has no spend cap. Preflight every distinct request with `get_cost: true` on `generate_image` (a `generate_image_batch` item cannot preflight, so price one item and multiply), state the job count and credits per batch and get a yes. Never repeat a generation call to "retry": each call starts and bills a new job, and after a transport timeout the outcome is unknown, so reuse the returned job ID and check it with `jobs_wait` first.
3. **Plate laws for every Seedance-facing sheet** (OSideMedia ad-asset-prep, banana-pro-director, MIT): one flat neutral grey field pinned for this project at `#8A8A8A` (never white or black: high-contrast edges halo in video); flat shadowless light with no cast or contact shadow; one readable face per sheet; one state per sheet; no baked look (no grade, grain or bokeh). The scene prompt does the lighting later.
4. **A sheet is not a menu.** Anything visible on a sheet will be rendered: an open hatch, a glowing ring, a wet shirt. Non-default states get their own sheets, attached only to the shots in that state.
5. **The untouched base.** The approved face plate is never passed through a model again. Make each fix as an edit on a copy, then mask only the changed region back onto the original pixels. Never chain output to output. Every variant anchors to the approved base.
6. **Synthetic people only.** No lookalike of a real or famous person, no real photo as an identity reference, no real brand, logo, trade dress, product or book cover (Terms 6.1(d)/(f), 7.5, 9.2(j)). Arabic text is never generated in-image: leave a blank surface and composite it in `07-edit-mix-finish.md`. Latin text only for short fictional words, quoted exactly.
7. **Provenance and holdback.** Never strip metadata, SynthID or C2PA. Log tool, model, variant, quality, resolution, account, plan, Higgsfield job ID, Higgsfield folder, date and the SHA-256 of the downloaded original for every kept image (Terms 5.5). Midjourney needs Stealth: without it every image is public on midjourney.com, which can breach the Summit holdback. Stealth comes with the Pro and Mega plans; check their plan page. The `films/` folder sits inside the GitHub repo: before the first job, add one `.gitignore` line each for `films/*/03-assets/**/*.png`, `*.jpg`, `*.jpeg` and `*.webp` under the same path, plus `films/*/03-assets/internet-refs/` (gitignore has no `{a,b}` braces). No asset image or internet reference ever goes to GitHub.
8. **Human authorship.** The user picks every winner by candidate ID. Record the pick and their words in the bible. This is authorship evidence for the Summit's disclosure requests and for the user's ownership of the film (Terms cl. 7.1).
9. **Reference only.** No image from this step is cut into the film. Final picture is Seedance: the Summit requires at least 70%, and 00 sets the house target. These stills only steer Seedance.

---

## 3.0 Session start: tools and verified parameters

Run once per session; report in two Arabic lines.
1. **Higgsfield MCP:** call `models_explore` (`action: get` per model id) and confirm the ids below. If only game-publishing tools appear, tell the user to reconnect the Higgsfield connector in claude.ai settings; meanwhile they may run the generation cards by hand in the Higgsfield web app (item 3), otherwise wait. Never move to another connector without their yes. Uploads go `media_upload` → PUT the bytes → `media_confirm` (chat attachments do not reach Higgsfield); a `medias[].value` is a `media_id` or the `job_id` of an earlier Higgsfield generation, never a URL. For several jobs: `generate_image_batch` (≤ 12 per call), `jobs_wait` (≤ 12 per call), then one `show_generation_by_ids` for the board.
2. **Folders:** every job carries `folder_id` = the asset's folder in the film's Higgsfield project (`01_CHARACTERS/CHR_<NAME>`, `02_LOCATIONS/LOC_<NAME>`, `03_PROPS/PRP_<NAME>`; D1 tests in `99_TESTS`). Claude makes missing folders with `create_folder` (not idempotent: never re-run it after a timeout; check first). Never invent a folder ID. Download each kept original the moment it finishes (result URL from `jobs_wait`, or `get_project_asset_source`), hash it with SHA-256, and file it in the Drive tree (ledger L.0b) before anything else touches it.
3. **Jobs the user runs by hand in the Higgsfield web app** (same account, same project): read them back with `list_project_assets` (`workspace_id`, `project_id`, `folder_id`, `output_kinds: ["image"]`), then `get_project_asset_prompt` (`placement_id`) for the exact prompt and `get_project_asset_source` for the file. Log each one as a ledger row with route `Higgsfield-web (user)`, prompt origin from 01's codes (`H` if they wrote it, `H/C` if it came from Claude's card), the job ID (`item_id`), model, folder and the SHA-256 of the download.

Verified parameters (`models_explore get`, 2026-11-01):

| Model | Higgsfield MCP | Settings for this step |
|---|---|---|
| GPT Image 2.5 Sunburst | `gpt_image_2_5` + `variant: sunburst` (default `flare`); quality low/medium/high/xhigh/max (default low); resolution 1k/2k/4k (default 1k); `background` auto/opaque/transparent (omit); ratios auto, 1:1, 3:2, 2:3, 4:3, 3:4, 16:9, 9:16, 21:9, 27:16, 16:27, 9:8, 8:9, 4:5, 5:4; media role `image_references` | quality `max`, resolution `4k` for hero sheets. A bare call runs flare/low/1k, a draft, so set every field |
| Nano Banana Pro | `nano_banana_pro`: resolution 1k/2k/4k (default 2k); ratios 1:1 to 21:9 (no `auto`); media role `image_references` | `4k` |
| Nano Banana 2.1 | `nano_banana_2_1`: resolution 1k/2k/4k (default 1k); `thinking_level` minimal/medium/high; `is_inpaint` with a `mask` image; `seed`; media roles `image_references`, `mask`, `video_references`; ratios add 4:1, 1:4, 8:1, 1:8. MCP `nano_banana_2` is the older NB2, deprecated: never pick it | `4k`, for edits and consistency passes |
| Seedream 5.0 Pro | `seedream_v5_pro`: 1k/1.5k/2k (caps at 2K) | not in the bake-off |
| Midjourney V8.2 | manual (web/Discord) | default model since 24 Jul 2026; Edit Model since 27 Aug 2026; newest release note is 8 Oct 2026 (RSS checked 2026-10-30) |

Facts from vendor documentation:
- **OpenAI.** Sunburst is "for workflows where editing precision matters most". Custom sizes: each edge a multiple of 16 and at most 3840 px; ratio 1:3 to 3:1; 655,360 to 8,294,400 pixels; output above 2560×1440 is labelled experimental. So if a 4K Sunburst take shows artefacts, re-run at 2K and upscale with Higgsfield `upscale_image` (`image_id` = the job ID, plus the source `width` and `height`; `get_cost: true` first). Masks need an alpha channel, apply to the first image only, and are prompt-guided, not pixel-exact.
- **Google.** Nano Banana 2.1 is stable, with 1K/2K/4K output. It takes up to 14 references: 4 characters plus 10 objects, and has no style-reference slot. Thinking runs at minimal, medium (the default) or high. Nano Banana Pro takes ≤ 6 object, ≤ 5 character and ≤ 3 style references (Google model page and image-generation guide, both fetched 2026-10-30).
- **Prompt dialect.** The GPT Image 2.5 dialect is not field-documented. Format advice below comes from GPT Image 2.0 practice plus OpenAI's guide. Treat it as a starting point and judge on output.

---

## 3.1 Generate characters, locations and props

### 3.1.0 Entry: the user names one asset («خلينا نبدأ الخطوة 3 للشخصية معراج»)

1. **Resolve the ID.** Map the Arabic name to its asset ID through the cast list in the script or draft (draft v0: معراج = MIRAJ, ريان = RAYAN, كبير = KABIR, نوح = NOAH) and the continuity bible: معراج → `CHR_MIRAJ`. No match, or two matches: ask in one Arabic line. Never invent an ID from a guessed transliteration.
2. **Check the state** in `PROJECT.md` (SKILL.md §2): Gate 1A (script lock) and the style lock (`LOOK v1.0`, `prefix/plate-safe.txt`). Then pick one of two paths and say which in Arabic:
   - **Both locked (D4 onward):** full Step 3 for this asset. Show its breakdown row (the full breakdown table follows before G2), then the Character Brief (3.1.3) as PROPOSED and wait for their approval. Then the face-lock generation card (3.1.4) with the job count and cost, and wait for their yes. Then run the bake-off batch (3.1.8), show the selection board and ask the board question. One step per turn; never chain past an open question.
   - **Not locked yet (D0–D3):** the only allowed partial release is the **provisional** asset for the D1 route test (3.4; 00 §0.8 T1). Draft the Brief from the draft and `script-review-v1.md`, marked `PROVISIONAL (pre-Gate 1A)`. On their yes, generate `face`, `body` and `turn3` in GPT Image 2.5 Sunburst on Higgsfield, into the `99_TESTS` folder, with the plate block and **no** `{{PREFIX_PLATE}}` (there is no look yet). Name the files `v00` and give them the ledger purpose `T1 route test`. They never become `_APPROVED` production assets: after the locks, the asset is made again from v01. Say plainly which gates are still open (SKILL.md §3, jumping ahead).
3. **Whatever path:** the generation route is Higgsfield (3.0): the MCP, or the user by hand in the web app inside the same project. Log every job in the ledger in the same turn (Higgsfield job ID, model, folder, SHA-256 of the downloaded original), and close with the module's Arabic question for the item shown. When the user picks a winner, append its prompt-library entry in the same turn (SKILL §7b: `prompt-library/characters.md`, `locations.md` or `props.md`; model and settings, the exact prompt, references and roles, their words, what made it work, what failed before it); an instructive rejected take goes in with `verdict: rejected`.

### 3.1.1 Asset breakdown and naming

Walk the scene list and fill the breakdown. Only these get full sheets:
- characters seen in 2+ scenes or carrying a close-up;
- locations used by 2+ shots;
- props a hand touches or the story turns on.

One-shot extras and crowds get shot-level description only. Voice-only roles get no sheet. Noah's broadcast voice counts as voice-only unless he is seen. Build nothing that the G1 rating check in `01-script-and-dialogue.md` flagged (tobacco, alcohol, sedatives, self-harm imagery in draft v0) until the script keeps it in a G-safe form.

**Asset ID:** `CHR_` / `LOC_` / `PRP_` + an UPPERCASE name with hyphens. Examples: `CHR_MIRAJ`, `LOC_METRO-WALKWAY`, `PRP_HALO-LENSCASE`.

**File name:** `<ASSET>_<state>_<sheet>_v<NN>_<model>_t<N>.png`
- `state`: `base`, `wet`, `dreamsuit`, `closed`, `open`, `noon`, `bluehour`, `night`, …
- `sheet`: characters `face` (identity plate), `body` (vertical full-body front), `turn3` (3-panel turnaround), `heads5` (head angles), `expr6` (expressions), `lips2` (lip-sync plates), `ward-<LOOK>` (wardrobe); locations `master`, `rev`, `angle-<n>`, `look`; props `views`, `macro`.
- `model`: `G25S` (GPT Image 2.5 Sunburst), `G25F` (Flare), `NBP` (Nano Banana Pro), `NB21` (Nano Banana 2.1), `SD5P` (Seedream 5.0 Pro), `MJ82` (Midjourney V8.2; job ID in the log).
- `v` bumps whenever the prompt or references change; `t` is the take within a run; edits append `_e01`, `_e02` and record their parent.
- The approved file is copied to `approved/<same name>_APPROVED.png`; its SHA-256 goes into the bible. A new state is a new asset name, never an overwrite; an approved file is never edited in place.

**Folders:** `films/<id>/03-assets/{CHR,LOC,PRP}/<ASSET>/{prompts,candidates,approved}/`, with shared `user-templates/`, `internet-refs/` (private, never published), `selection/` and `midjourney/` beside them. Images live in the Higgsfield project and the Drive tree (ledger L.0b: `01_CHARACTERS/CHR_<NAME>/`, `02_LOCATIONS/LOC_<NAME>/`, `03_PROPS/PRP_<NAME>/`, each with `approved/`); the repo keeps only the text (prompts, cards, bible).

### 3.1.2 The user's own templates (slots that take priority)

When `CHR_TEMPLATE.md` or `LOC_TEMPLATE.md` exists, or the user pastes a template:
1. **The user's template replaces your default body for that asset class.** Fill only its variables. Mark them `{{LIKE_THIS}}`. If their text has no marked variables, ask once in Arabic which words are fixed and which change per asset. Record the answer at the top of the file.
2. **Never rephrase their fixed text.** You may append only two things:
   - the reference-role line (which image carries what);
   - the pinned plate block, if their template lacks it.
3. **Conflicts:** if their template bakes lighting, uses a white background or puts several faces on a Seedance-facing sheet, name the conflict in one Arabic sentence and offer to run both their version and the plate-law version in the bake-off. The user decides.
4. **One target model only:** if their template was written for one model, use it unchanged there. Show any adaptation for the other model as a diff they approve.
5. **Authorship log:** record the template as origin `H` in the log from `01-script-and-dialogue.md`.

### 3.1.3 Character Brief (one per character, before any prompt)

The Brief is adapted from nigo-studio character-consistency (MIT). Every field is expanded into visible, testable specifics, because a vague face cannot stay consistent. Wardrobe rules carried over from the old CHARACTER_SHEET_RULES: name each garment, fabric, exact colour, fit, condition and footwear, and write "none" for missing accessories. Write skin tone in prose with its undertone.

```text
ASSET:      CHR_MIRAJ
ARC LINE:   (one line from the Locked Sheet)
BUILD:      (apparent adult age as a number, height in cm, build, posture habit)
FACE:       (face shape; eye colour, shape and lids; brows; nose; mouth; ears;
             skin tone + undertone in words; marks with exact position)
HAIR:       (colour, length, texture, parting, hairline; facial hair line)
HANDS:      (nails, calluses; the smart ring on which finger)
WARDROBE:   LOOK_A: item by item, top to toe (garment, fabric, colour, fit, wear, fasteners)
STATES:     base | wet | dream-suit | ... (each becomes its own sheet)
SIGNATURE:  (the one feature a viewer reads from 10 m)
NEVER:      no resemblance to any real person; no logos; no text except named fictional marks
```

**Gulf wardrobe accuracy** (G2 in `00-award-brief-and-calendar.md`; the user confirms every detail):
- An Emirati kandura is collarless, with the tassel at the neckline.
- The ghutra (white, or red-and-white shemagh) sits under a black agal.
- The abaya is usually black, worn with a sheila.
- No costume is worn as a joke, and national dress is never put on a robot or a comic figure. Every character, the Emirati partner and Kabir included, is portrayed with dignity (G1/G2 in 00).

### 3.1.4 Character pass 1: the face lock (identity plate)

The plate is a single vertical 3:4 head-and-shoulders image. Its framing follows BytePlus's best practice for a portrait asset's face close-up: vertical, frontal, no expression, face about two-thirds of the frame. It is the only text-heavy prompt in the character's life. After it, prompts stay lean and the reference carries identity.

PLATE BLOCK (pasted into every character and wardrobe sheet; adapted from banana-pro-director 3.0's locked flat grade, MIT):

```text
Background: one flat uniform neutral grey field, hex #8A8A8A, edge to edge - no floor, no wall,
no seam, no gradient, no vignette, nothing behind the subject. Completely flat shadowless light:
one very large soft frontal source at camera with equal fill from left, right, above and below,
both sides of the face equally bright; no shadow side, no rim or hair light, no cast or contact
shadow, no specular hotspot. Low contrast, catalogue-flat. Skin matte at its true natural tone,
never cooled or greyed by the background. Real fine even pore texture, fine peach fuzz at jaw and
hairline, subsurface scattering at ears and nostrils, individual hair strands with natural
flyaways, real fabric weave and drape. Photographed on a 50mm prime, even sharpness, no grain.
Photographed, not generated.
```

The grain clause is contested between sources. This project pins "no grain on plates", so grain lives in the prefix and the grade.

**Face lock prompt.** Run it in GPT Image 2.5 Sunburst (max, 4k, 3:4) and in Nano Banana Pro (4K, 3:4), 2-4 takes each:

```text
Character identity plate, single image, one person only, one view. A vertical 3:4 close-up
from just above the top of the head to the top of the shoulders, the face filling about
two-thirds of the frame, body squared to camera, head level, eyes to camera, lips closed and
relaxed, no expression. {{BUILD}}. {{FACE}}. {{HAIR}}. Wearing a plain charcoal crew-neck
T-shirt, no jewellery, no logos, no text. {{PREFIX_PLATE}}
{{PLATE BLOCK}}
```

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

**Wording rules:** in image prompts, give adults an apparent age as a number (it stops the default young, flawless face) and never use child words. Seedance prompts stay age-blind (05b ground rule 6): the age lives in the reference image, not the video prompt. Do not write "photorealistic" when faces are in frame (it pushed GPT Image 2.0 toward plastic skin); use "photographed" and film-capture language. Identify people by a visual handle, not the character's name, which means nothing to image models.

### 3.1.5 Character pass 2: the sheets

**body: vertical full-body front.** One 2:3 image: the same person, head included, top of head to shoes, front view, arms relaxed, weight even, wearing {{LOOK item list}}, with Image 1 (the approved `face`) carrying face, skin and hair, plus the plate block. Together with `face`, this is the pair ByteDance's Seedance portrait guide recommends per character: a vertical full-body frontal image plus a vertical face close-up. On Higgsfield it is the `face` + `body` pair tested in 3.4. Make one per look.

**turn3: 3-panel turnaround.** The Seedance identity sheet for direct references: one 16:9 image with LEFT full body front headless, CENTER full body rear with head, RIGHT tight chest-up face. Three panels give the face roughly twice the pixels of a 6-panel grid, and the headless front leaves exactly one readable face (banana-pro-director 3.0 Mode 2A, MIT; OSideMedia one-face law, MIT).

```text
Character reference sheet: one 16:9 image divided into three equal vertical panels side by
side with thin neutral separation, the same person in the same outfit in all three. Image 1
is the approved identity plate: take face, bone structure, skin tone, hair and beard from it
exactly. Wardrobe, identical in every panel: {{LOOK item list}}.
LEFT panel - full body front view, no head, no neck and no hair: {{HEADLESS VARIANT}}. Full
headroom of empty grey above the shoulders, figure at normal full-body scale.
CENTER panel - full body rear view, head attached, top of head to shoes; hair from behind,
garment back construction and footwear readable; arms relaxed, weight even.
RIGHT panel - tight chest-up close-up, top of head to collarbones, face filling the panel,
eyes to camera, lips closed, neutral expression.
Skin renders at identical value and hue on face, neck, arms and hands in every panel. Same
scale, same grey, same flat light in every panel. No text, labels, captions or logos.
{{PLATE BLOCK}}
```

Pick the `{{HEADLESS VARIANT}}` by neckline:
- **Variant A, ghost mannequin.** For a collar, crew neck, shirt or hood: "the collar holds its own shape and its opening is an empty dark hollow looking into the inside of the garment; the garment reads as worn by an invisible body; no stump, no skin, no cut edge, no blur, no transparency."
- **Variant B, clean neck cut.** For a strapless or open neckline: "the neck rises a short way and ends in a clean flat horizontal edge like a dress-form mannequin; not blurred, no wisps, no anatomy at the cut."

The skin-tone clause is mandatory: without it, rear panels drift darker.

**heads5: head angles.** Five heads at one scale and one eye-line: front, three-quarter left and right, profile left and right. Five faces, so never the Seedance identity reference; it serves the bible, keyframes, Midjourney Edit-Model references and the profile test in 3.4.

**expr6: expressions.** A 2×3 grid of chest-up heads, same plate block, six expressions drawn from the character's script beats. For Miraj: exhausted neutral; forced grin; grief, crying, mouth open; rage, shouting; quiet hope; grateful half-smile, eyes up. Add `lips2`, two lip-sync plates, for every speaking role (mouth closed and relaxed; mid-speech open "ah"). They are an untested aid for `05b-acting-direction.md`. A single cropped expression panel may serve as a shot-specific reference; the full grid never does.

**ward-<LOOK>: wardrobe sheets.** One per look: ghost-mannequin front and back plus two macro panels (fabric weave, fastener or name patch). Never two looks on one sheet; a wardrobe change is a new sheet plus a new `body` and `turn3` built with it.

**When two subjects share frames** (Miraj and the delivery robot; Miraj and Kabir), also build a scale frame that states heights in cm. Rule: if scale is uncertain, render the smaller subject smaller, never larger.

### 3.1.6 Location plates by time of day

1. **Master plate first,** one per location at the scene's main time of day:
   - a 3/4 angle along the main axis, never head-on (Nano Banana's depth perception fails on front views);
   - empty by default, with one named anchor landmark and a clean action corridor where the beats happen; clutter at the edges;
   - sun azimuth and elevation pinned from `ledger-continuity-physics.md` for Dubai (25.2° N) on the story date; every practical named with direction and colour temperature in K;
   - neutral true-to-life colour, normal exposure, no creative grade, grain or flare. A tinted plate leaks its colour onto every shot.
2. **Time-of-day variants:** edit the approved master with Sunburst or Nano Banana 2.1, never regenerate: "change only the time of day to …; keep camera, lens, framing, every building, object and surface, and the anchor landmark exactly". Only the times the script uses.
3. **Reverse and coverage angles:** every dialogue location gets a reverse plate (`rev`) so the 180° line comes from plates, not prose. Generate each angle as its own image with the master attached as topology reference. Compare the Higgsfield `/3d-jutsu` preset (`get_preset_instructions`), the platform's route for new camera views of one location.
4. **Normalise exposure.** Edit every extra plate against the master: "match the exposure and light level of this plate to the master plate (second reference, same place); change exposure only".
5. **Judge on affordance, not beauty.** Before the user sees the board, run each beat of the scene against the plate. Does the run fit? Is there room for the crowd? Is the threshold where the action needs it? A plate where a beat has nowhere to happen is wrong however good it looks.
6. **Look frame (optional, one per location):** the full prefix (grade, lens, atmosphere), optional silhouetted figures. It exists for the user's look approval and as the Midjourney `--sref` or moodboard source; never a Seedance reference.
7. **Dream layer (2nd Life):** dream locations use the dream override from 02 as a declared exception; their masters still obey the plate rules.
8. **Model notes:** Nano Banana Pro follows locations described in text better than location images used as references, so keep geometry in the prompt. When a Blender greybox exists, attach its render as "use only the geometry and camera; ignore the grey materials" (`04-blender-blocking.md`).

**Location master prompt:**

```text
Location reference plate, single wide frame, 16:9, no people. {{PLACE}} at {{TIME, date}}.
Camera at {{eye height in m}}, a three-quarter angle along {{main axis}}, wide view
({{angle of view}} degrees, about {{mm}} full-frame). Layout: {{entrances, exits, fixed
furniture, left/right relationships}}; anchor landmark: {{landmark}} at {{frame position}}.
A clean action corridor along {{path}}, clutter only at the frame edges. Light: {{sun
azimuth/elevation and quality}}; {{practicals with direction and K}}. Materials: {{surfaces,
wear}}. Neutral true-to-life colour, normal exposure, no creative grade, no grain, no flare.
{{PREFIX_PLATE}} {{world-design clauses from the prefix}}. A real photograph; every building
generic and unbranded.
```

Worked fill for `LOC_METRO-WALKWAY` at late morning (future Dubai, 2045). Date, clock and sun are the ledger's PROVISIONAL worked example (15 Apr 2045, 11:40, lens heading 278°, sun azimuth 147°, elevation 72°). Re-run `sun_position.py` once the user fixes the story date:

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

### 3.1.7 Hero props

- **Views come from the shot list.** Front, side and back are the minimum.
- **Add a bottom view whenever the prop is flipped, dropped or turned over.** The model cannot invent an underside it never saw.
- **Every state is its own sheet:** `closed` / `open`; ring `idle` / `green` / `red`.
- **Give dimensions in mm.** They feed the physics notes.
- **Props skip motion tests.**
- **Red arrow:** if an actor keeps grabbing the wrong control in `05-seedance-production.md`, draw a red arrow on a copy of the sheet. Describe the arrow's target in the shot prompt. Keep the clean sheet as the identity reference.

**Prop sheet prompt** (structure adapted from the GLOBAL IDENTITY LOCK in OSideMedia reference-sheet-workflow.md, MIT):

```text
Prop reference sheet, one 16:9 image: a clinical studio product sheet of ONE object shown as
{{views}} at the same scale on one baseline, plus macro panels of {{details}}. The object:
{{dimensions in mm}}, {{materials and finish}}, {{construction, seams, hinges, fasteners}},
{{wear}}. Identical object in every view - same shape, proportions, colour and wear. Flat
neutral grey #8A8A8A background, perfectly even shadowless light, no reflections of a studio,
no gradient. True-to-life colour, macro-level material detail, edge-to-edge sharpness, as if
shot with a 100 mm macro lens at f/8. No invented branding; the only marking is {{exact
fictional text in quotes, or "a blank oval emblem recess"}}.
```

Worked use, `PRP_HALO-LENSCASE`: `closed` gets front, back, side, top and bottom; `open` gets a top view plus macros of the contact lens floating in clear fluid and the two ring-shaped earpieces in their recesses. The in-world brand "Halo" may collide with existing trademarks, so until 01's trademark check names it, render a blank emblem recess and composite the logo later. Other props in this film: the smart ring (idle / green / red), the robot forearm stamped "MADE IN UAE", Food+ reusable meal boxes (clean / used), the air-skate fan with its red warning light.

### 3.1.8 The bake-off: every asset in both models, plus Midjourney

1. **Higgsfield.** For each asset, run the same core prompt in GPT Image 2.5 Sunburst (quality `max`, `4k`, `background` omitted) and in Nano Banana Pro at 4K, 2-4 takes each: takes of one prompt as `generate_image` with `count` 2-4, independent prompts as `generate_image_batch`, all with the asset's `folder_id`.
2. **Nano Banana 2.1** is the edit and consistency engine: one-line fixes, time-of-day edits, exposure matching, state derivations.
3. **If a GPT sheet reads flat or 2D,** rerun the identical prompt in Nano Banana Pro before rewriting anything.
4. **Judge on the hardest axis for that asset.** For Miraj it is skin under fatigue. For Noah it is panel seams and joints. For the lens case it is the clarity of the fluid.
5. **Nano Banana Pro defaults to a 4-view sheet** when asked for a character. Write "one view image" or "single composition" for a single plate.
6. **Reference handling:** at most 4 references per call (media role `image_references`; value = the approved image's Higgsfield job ID, or its `media_id` after upload), each with its job stated ("face, bone structure and skin tone from Image 1; wardrobe from Image 2"). With references attached, identify subjects by a short handle, put composition and pose first, and do not re-describe what the reference shows: lean prompts hold faces better.
7. **Three or more characters in one keyframe:** generate each identity alone and composite. Never co-generate them.
8. **Fix, don't rebuild:** correct a warped detail or colour cast with a one-line Nano Banana 2.1 edit ("change the emblem to the blank recess in image two"); on the identity base, mask the changed region back onto the original. After two failed repairs of one defect, restart from the last accepted image.
9. **Optional comparison route:** Higgsfield's bundled character-sheet workflow, via `get_workflow_instructions {workflow: "character-sheet"}`, run only on the user's explicit request.

**Midjourney V8.2, run by the user by hand.** Write one Midjourney card per asset in the same delivery. Facts below are checked against Midjourney's release notes (2026-10-30). The parameter rules are paraphrased from avienor/midjourney-prompts and zy-cinematic-realism; the edit method is adapted from midjourney-v8-2-edit-architect (MIT).
- **Prompt shape:** natural sentences, subject and must-keep details first, then setting, light, style; parameters last. V8 rewards longer, specific prompts; drop filler such as "8K, masterpiece".
- **Default suffix:** `--v 8.2 --raw --ar 16:9`. `--hd` only for keepers (editing an HD image returns SD, so upscale again after any edit). Leave `--s` at default; A/B test 50 / 100 / 250 only under a fixed `--seed`, one change at a time.
- **Never emit:** `--q`, `--cref`/`--cw`, `--oref`/`--ow` (silently forces V7), `::` text weights, decimal ratios (`239:100`, never `2.39:1`), or "no X" in the prompt text. `--no` only for concrete objects, never clothing words: `--no` parses each word on its own, so `--no modern clothing` also strips clothing.
- **Identity: the Edit Model.** Web: drag up to 4 references into "Attach to prompt". Discord: instruction first, then `--edit <url1> <url2>`. One job per reference, testable anchors named. If two characters' features mix, merge them into one reference image. Split risky edits into passes: identity/pose, environment, style, cleanup.
- **Look:** `--sref <approved look-frame URL> --sw 100` (raise in steps up to 300 for location frames, inside 02's 50–300 working range; `--sw` takes one number), or the project moodboard `--p <code>`, never a moodboard with `--sw`/`--sv`. An `--sref` code cannot be minted from your own image; use the URL.
- **Exploration:** `--draft` on the web gives a 24-image grid at 512 px (release notes 16 Jun and 7 Oct 2026; the Version-page chart disagrees, so drop it if rejected). "Rerun (Thinking)" is an alpha lightbox button (8 Oct 2026), not a parameter.
- **Seeds do not hold a character or a look;** log every job ID. Midjourney stills enter Seedance only after passing the 3.4 test; otherwise they are look development, plate ideas and style sources.

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
REF_014 (user upload; source: <url>; licence: unknown) -> target LOC_2NDLIFE-PARLOUR
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
6. **Midjourney:** a style-only reference goes in the Style Reference slot. The "Image Prompt" slot copies content and composition, so never put a third-party design there, and never use a third-party identity as an Edit-Model reference.

Worked mini-example: the user uploads a photo of a well-known humanoid robot for Noah.
- **Take:** an elegant grey humanoid with visible neck actuators, a matte composite shell, a calm, slow presence.
- **Leave:** the robot's specific face design and head shape, its colour scheme, its maker's marks.
- **Distance:** a closed, featureless brushed-titanium face oval with a thin horizontal light line instead of a sculpted face (no mouth, so no lip-sync, as 01 suggests); a tailored dark high-collared long coat over the chassis (never national dress on a robot); 1:1 human proportions at 186 cm; exposed carbon tendons only at the wrists.
- **Sheet:** `CHR_NOAH` gets `turn3` with a head panel in place of a face, plus a `PRP_`-style macro of the wrist joint. Name each mechanism in the shot prompt when it moves.

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
2. **Set the T1 route up before D7.** For every human character, the approved `face`, one `body` per look and one `turn3` per look and state are ready, unedited. Sheets made in Higgsfield are referenced by their job IDs; anything made elsewhere (a Midjourney still the user approved) is uploaded once with `media_upload` → PUT → `media_confirm`. If a PNG is over 30 MB, upload a maximum-quality JPEG copy and keep the PNG as the evidence master. If the element route wins (1c), create one element per character and state from the approved image, named after the asset ID (≤ 32 characters, e.g. `CHR_MIRAJ-base`), and wait for `completed`. A new version gets a new upload or a new element. Record every job ID, `media_id` and `element_id` in the bible.
3. **Minors.** If a character reads as a minor (Miraj's younger brother; any child extra), test him or her on day 1. On a hard stop, propose story-safe options: heard but unseen, seen only on the mother's phone screen from behind, or cast as a young adult. The user decides; it is a script change in 01.
4. **Robots and non-human characters** go through the same day-1 test. A human-like face can still trip the filter.
5. **If only a first frame works (route 1d),** each shot's first frame is generated inside Higgsfield (GPT Image 2.5 Sunburst or Nano Banana Pro, the approved sheets as `image_references`, the scene's prefix and location plate) and passed to `seedance_2_5` as `start_image` by its job ID. The first frame gets its own ledger row and the user's approval before the video job. The sheets then steer the first frames, the bible, Midjourney and keyframes; tell them in Arabic before they approve faces.
6. **Real people** (only with signed consent): Higgsfield's handling is untested. Test the route on D1 before anyone is cast; if it fails, the user decides with the full picture.

## 3.4 Day-1 test (T1 in `00-award-brief-and-calendar.md`): will Seedance take our sheets?

Run it on D1 with a provisional Miraj, made in GPT Image 2.5 Sunburst on Higgsfield (`face`, `body`, `turn3`), before the style prefix is locked. The test is about the route, not the look. Every job goes to the project's `99_TESTS` folder.
- **Check first:** the Higgsfield connector shows `generate_video` (not only game-publishing tools); the film project and `99_TESTS` exist; the credits cover the quoted test.
- **Seedance settings:** `generate_video`, `model: seedance_2_5`, `mode: omni_reference` when references are attached (apply any `adjustments` the tool returns and log the mode the job reports), `draft: true` (480p), `duration: 5`, `aspect_ratio: "16:9"`, one simple action: "he blinks, breathes, turns his head slowly toward frame left". T1 drafts are tests and are never finalized; a Higgsfield draft can only be finalized within 7 days, so log `draft_expires_utc` anyway.
- **Draft cost:** 3 credits/s, so 15 credits per 5 s draft (references do not change the price). Preflight the whole set with `get_cost: true` and get one yes.

| # | Route on Higgsfield `seedance_2_5` | Pass if |
|---|---|---|
| 1a | `turn3` as `image_references`, by job ID | accepted, and identity holds |
| 1b | `face` as `start_image` | accepted (acceptance only: a sheet is never a production first frame, the clip would open on the grey plate) |
| 1c | Reference element made from `face` (`manage_reference_elements` `create`, wait for `completed`), `<<<element_id>>>` in the prompt, no `medias` | the element completes and the job visibly uses it (the tool lists elements for `seedance_2_0`, not `seedance_2_5`; an ignored placeholder is a fail, never a reason to switch to Seedance 2.0, which is not the competition model) |
| 1d | First frame generated inside Higgsfield: GPT Image 2.5 Sunburst (or Nano Banana Pro) draws Miraj in a neutral setting from the sheets as `image_references`; that frame's job ID goes in as `start_image` | accepted, and identity holds |
| 1e | A/B on the working route: `face` + `body` vs `turn3` alone vs `face` alone vs `face` + `heads5` | best identity hold, including a profile moment |
| 1f | Minor and robot checks (younger brother; Noah; the delivery robot) | a route exists, or a story fallback is chosen |

Order: 1a and 1b first; 1c and 1d only if faces are refused or identity does not hold. Each job is a ledger row (Higgsfield job ID, model, folder `99_TESTS`, references by job ID, refusal text or the SHA-256 of the downloaded draft).

**Judging:** sweep every draft at about 2 frames per second against the `face` plate, because first and last frames hide mid-clip drift (scenario-labs, MIT). Check the output does not copy the grey field or the panel grid. Report a table plus one Arabic recommendation; the working route becomes the rule in `05-seedance-production.md`.

**Seedance role lines** that ship with every character asset (nigo-studio, MIT; the format follows the official Seedance 2.5 prompt guide in `seedance-2-5-prompts`):

```text
<MIRAJ> corresponds to @Image1. @Image1 defines his facial features, hairstyle and clothing.
Use only the appearance; do not use the grey background or the panel layout.
```

On the element route (1c), write `<<<element_id>>>` where the line says `@Image1`; the backend rewrites it to `@<element-name>`. Never type the `@name` form of an element in a tool call.

---

## Output templates (what Claude shows the user)

Chat labels are in Arabic. Prompts and file names stay in English.

**Asset breakdown** (sent first, for approval of the list itself):

| Asset ID | Type | Scenes | States / times | Sheets | Priority |
|---|---|---|---|---|---|
| CHR_MIRAJ | character | S01-S14 | base, dreamsuit | face, body, turn3, heads5, expr6, lips2, ward-A, ward-B | D4 |
| LOC_METRO-WALKWAY | location | S04, S12 | noon, bluehour | master, rev, look | D4 |
| PRP_HALO-LENSCASE | prop | S04, S06, S12 | closed, open | views, macro | D5 |

**Generation card** (one per asset and sheet; saved to `prompts/`):

```text
ASSET  CHR_MIRAJ_base_turn3  v02        ROUTE  Higgsfield MCP | Higgsfield web (user)
FOLDER 01_CHARACTERS/CHR_MIRAJ  (folder_id <uuid>)
MODEL  gpt_image_2_5  variant=sunburst  quality=max  resolution=4k  aspect=16:9   takes=3
MODEL  nano_banana_pro  resolution=4k  aspect=16:9                                 takes=3
REFS   Image 1 = CHR_MIRAJ_base_face_v03_G25S_t2_APPROVED, job <id> (face, bone structure, skin, hair)
TEMPLATE  default | USER CHR_TEMPLATE (slots filled: ...)
PROMPT
<full English prompt>
COST   <get_cost credits per job x jobs = total>   ->  waiting for your yes
```

**Selection board** (after each batch):
- Show the gallery: one Higgsfield `show_generation_by_ids` call for the batch; for takes the user ran in the web app, `job_display` per named candidate (`id` = `item_id` from `list_project_assets`, with its `folder_id`).
- Under it, show this table. Recommend one take but never pick for the user.

| Candidate | Model | Identity vs base | Plate laws (grey / flat / one face) | Hardest axis | Defects | Claude's note |
|---|---|---|---|---|---|---|
| A t2 G25S | Sunburst max 4k | 5/5 | ✓ ✓ ✓ | skin fatigue 4/5 | rear panel 1 stop darker | fix with NB21 edit |
| B t1 NBP | Pro 4K | 4/5 | ✓ ✓ ✓ | 5/5 | — | strongest depth |

Close with the Arabic question: «أي مرشح تعتمد لـ CHR_MIRAJ_base_turn3؟ اكتب الحرف، أو اطلب تعديلاً محدداً.»

**Continuity bible entry** (one per approved asset). The schema is owned by `ledger-continuity-physics.md` L.6; use the same keys as `templates/continuity-bible.md` §1, default file `films/<id>/ledger/continuity-bible.md`. Locations and props use `location:` / `prop:` with the fields that apply. 01 adds `voice`; 05b adds `arc_checkpoints`; `devices_worn` comes from the ledger.

```yaml
character: CHR_MIRAJ
status: PROPOSED                     # CONFIRMED once the user approves; their words go to decisions.md
canonical_description: "<build, face, skin + undertone, hair, hands: from the approved Brief>"
identity_anchors: [long oval face, deep-set brown eyes, mole 1 cm below left mouth corner,
                   short untrimmed beard thinner on cheeks, bump on nose bridge]
locked_reference_assets:
  - file: approved/CHR_MIRAJ_base_turn3_v02_G25S_t2_APPROVED.png
    sha256: "<hash of the downloaded original>"
    model: gpt_image_2_5            # Higgsfield model id
    params: "variant=sunburst;quality=max;resolution=4k;aspect=16:9"
    route: Higgsfield-MCP           # or Higgsfield-web (user)
    account: "<account + plan>"
    job_id: "<Higgsfield job id>"
    folder: 01_CHARACTERS/CHR_MIRAJ
    date: 2026-11-03
    parent: CHR_MIRAJ_base_face_v03_G25S_t2_APPROVED.png
    template: default                # or "USER CHR_TEMPLATE" (origin H)
    prompt_file: prompts/CHR_MIRAJ_base_turn3_v02.txt
    picked_by: AboStesha
    words: "<their words>"
seedance_asset_ids:                  # L.6 key; on Higgsfield it holds the T1-route references
  - route: image_references          # the day-1 winner: image_references | element | first_frame
    value: "<Higgsfield job id or media_id>"
    file: CHR_MIRAJ_base_turn3_v02_G25S_t2_APPROVED.png
    element_id: "<uuid; element route only, status completed>"
    tested: "T1 <date>, seedance_2_5 job <id>"
role_line: "<MIRAJ> corresponds to @Image1. @Image1 defines his facial features, hairstyle and clothing."
hands: "smart ring on the right ring finger"
looks:
  LOOK_A: "<item by item, top to toe>"
states: [base, dreamsuit]            # each state is its own sheet
height_cm: 174
allowed_variations: [expression, pose, sweat, dust on coverall]
forbidden_variations: [beard length, mole position, skin tone, patch position, ring finger]
used_in: [S01, S02, S04]
midjourney: ["job <id>: look development only"]
synthetic_or_real: synthetic         # cl. 5.5(d); internet refs used: none
approval_required_for: [face regeneration, wardrobe redesign]
```

**Day-1 report** (copy of the 3.4 table with results, error texts, timings, costs and the recommended route).

## Gate (G2 Assets, end of D5): the user must approve before Step 4

- [ ] The asset breakdown is approved. Every listed asset has an `_APPROVED` file picked by the user by candidate ID, with their words logged.
- [ ] Characters: `face`, plus `body` and `turn3` for every look and state; `heads5`, `expr6` and `lips2` for speaking or close-up roles; one wardrobe sheet per look; a scale frame where subjects share frames.
- [ ] Locations: a master for every script time of day; a reverse plate for dialogue scenes; plates normalised to the master; the affordance check passed against every beat.
- [ ] Props: views planned from the shot list, one sheet per state, dimensions logged.
- [ ] The day-1 route on Higgsfield `seedance_2_5` is proven, and every human character is set up on it before D7: approved sheets referenced by job ID or `media_id` (1a), elements at `completed` (1c), or the first-frame recipe approved (1d), all logged in the bible. Minor and robot outcomes are decided.
- [ ] The G2 compliance list in `00-award-brief-and-calendar.md` passes: synthetic faces, no lookalikes, no brands, Gulf wardrobe confirmed by the user, children shown with dignity.
- [ ] 3.2 assets: the ledger is filed, nothing from a Leave list is visible, and reverse search is done or declined.
- [ ] A continuity bible entry exists for every approved asset. Provenance fields are complete. Metadata is untouched.
- [ ] Every approved asset (and the T1 route result) has its `prompt-library/` entry (SKILL §7b).
- [ ] Midjourney cards are delivered; their kept Midjourney images are logged with job IDs; Stealth is confirmed.

Ask in Arabic: «هل تعتمد كل الأصول في لوحة G2 كما هي، وننتقل إلى الخطوة 4: البلوكنغ في Blender؟» Silence or a change of subject is not approval.

## Common failures

| Symptom | Cause | Fix |
|---|---|---|
| Faces drift to "generic" in Seedance | several faces on the reference sheet | headless body panels; one face; `heads5` and `expr6` are never identity references |
| Rear panel darker or tanner | no skin-tone clause | add the identical-value-and-hue clause; one-line NB 2.1 edit, then mask back |
| Character carries studio light into every scene | lit or graded plate, grain baked in | the plate block exactly; grain only in the prefix and grade |
| Grey background or panel grid appears in video | missing exclusion | role line: "do not use the grey background or the panel layout" |
| Glowing ring or open lens case in shots where it should be off or closed | state shown on the base sheet | separate state sheets; attach only in that state |
| Skin turns plastic after edits | whole-frame passes on the base | edit a copy and mask only the region back; restart from the last accepted image after two failed fixes |
| GPT sheet reads flat | model limit on that asset | the same prompt in Nano Banana Pro at 4K |
| Location changes geometry between times of day | regenerated, not edited | edit the master: "change only the time of day"; keep camera, lens and framing |
| Plates jump in brightness between cuts | no master normalisation | match exposure to the master plate |
| Beautiful plate, but the action has nowhere to happen | judged on beauty | affordance check against each beat before the board |
| Nano Banana Pro returns a 4-view sheet for a hero frame | its default | "one view image / single composition" |
| Indoor subject placed outdoors | location fed as an image reference to NBP | describe the location in text; attach only the topology plate |
| Garbled Arabic or brand-like text on signs | text generated in-image | blank surfaces; composite in 07 |
| Midjourney prompt errors or drifts to V7 | `--q`, `--cref`, `--oref`, `2.39:1`, `::` | the 3.1.8 suffix rules |
| Midjourney images public during the holdback | no Stealth | Pro/Mega plan with Stealth on before the first job |
| `seedance_2_5` on Higgsfield refuses a face reference | a real-looking face in the reference | switch to the T1 fallback (element 1c or Higgsfield-made first frame 1d); log the exact text; never re-send the unchanged request or alter the face to evade |
| Copyright or policy refusal | an asset too close to a third-party design (3.2) | widen the Distance list and rebuild the asset; never alter pixels to slip through |
| Element stuck in `processing` / `ip_checking`, or `failed` / `nsfw` | review rejected it | rebuild further from any lookalike or logo; never re-create it unchanged |
| Element placeholder ignored in the video | the elements tool lists `seedance_2_0`, not `seedance_2_5` | `image_references` or a Higgsfield-made first frame; never move the shot to Seedance 2.0 |
| Double charge on Higgsfield | a generate call re-sent after a timeout | reuse the returned job ID and check it with `jobs_wait`; resubmit only once the first outcome is known |
| A web-app take is missing from the ledger | the user generated by hand | `list_project_assets` on the folder, then `get_project_asset_prompt`; log it the same day |
| 4K Sunburst artefacts | above 2560×1440 is experimental (OpenAI) | 2K max, then `upscale_image` |

## Sources and credits

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

Official and vendor sources: OpenAI image-generation guide, Google `gemini-nano-banana-2.1` model page and Gemini image-generation guide (all fetched 2026-10-30); Midjourney release notes ("Version 8.2" 24 Jul, "Edit Model for V8" 27 Aug, "Alpha Changelog 10/7/26" and "Testing Thinking Mode" 8 Oct 2026); BytePlus ModelArk docs read as markdown on 2026-10-30 (`seedance-portrait-asset-guide`, Seedance 2.5 API reference; the virtual-portrait, purchase and error-code pages served the unused BytePlus route); Higgsfield MCP tool descriptions (`generate_image`, `generate_image_batch`, `generate_video`, `manage_reference_elements`, `media_upload`, `list_project_assets`, `get_project_asset_prompt`, `get_project_asset_source`, `jobs_wait`, `create_folder`, `upscale_image`) and `models_explore get` for `seedance_2_5`, `gpt_image_2_5`, `nano_banana_pro`, `nano_banana_2_1`, `seedream_v5_pro` (read 2026-11-01).

Third-party, marked unverified where used: laozhang.ai Seedance real-person guide (22 Oct 2026, the minor hard stop); Comfy.org Seedance 2.0 partner-node docs (AI-portrait classification).

Carried over from the user's old skills: wardrobe specificity, prose skin tone, multi-character uniformity, "when not to make a sheet" (cinematic-pipeline CHARACTER_SHEET_RULES); prompt-card structure and the failure-table idea (MIDJOURNEY_RULES, with its parameters corrected); role binding (seedance-2-5-prompts).
