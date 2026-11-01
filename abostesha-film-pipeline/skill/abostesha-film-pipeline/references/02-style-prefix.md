# 02 — Style Prefix: Lock the Film Look (Step 2)

**Purpose.** Turn the user's reference film title and/or frames into a verified, measured look for their own film: real production facts, observed evidence, and per-sequence variants (reality vs the 2nd Life dream).
**Output.** One locked master prefix (`LOOK vX.Y`), mechanical adapters for GPT Image 2.5, Nano Banana Pro / 2.1, Midjourney V8.2 and Seedance 2.5, approved look frames, a Seedance look test and a style-lock card.
**Rule.** No asset in 03-assets-images.md and no prompt in 05-seedance-production.md is written before the Step 2 Gate passes. The only exception is the D1 route tests (00 §0.8, 03 §3.4), which test routes, not the look, and are never reused as look references. Calendar slot: exploration on D2, lock on D3 (00-award-brief-and-calendar.md §0.7).
**Route (decision 2026-11-01).** Every look frame (GPT Image 2.5, Nano Banana Pro / 2.1) and every Seedance 2.5 look test runs in Higgsfield: through the MCP, or by the user's hand in the Higgsfield web app inside the film's project (2.8). Midjourney stays a manual card the user runs.

Talk to the user in Arabic (Modern Standard Arabic, addressing them as أبوستيشا). Write every prefix, adapter and prompt in English.

---

## Inputs

| Input | Where | Required |
|---|---|---|
| Script sequence list | 01-script-and-dialogue.md: script v1 for exploration on D2, the locked script before the D3 Gate | yes; variants follow sequences |
| Rubric map, "Creativity & Aesthetic" line | 00-award-brief-and-calendar.md §0.3 (film 01: real world = handheld, harsh noon light; dream = locked-off, impossible geometry) | yes |
| Reference film title(s) | the user | a title, frames, or both |
| Reference frames or clips (6–12 varied stills per film) | the user's upload → `films/<id>/02-style/reference-frames/` (git-ignored, never uploaded anywhere) | strongly recommended |
| The user's own words about the look | chat, in Arabic | optional |
| Production locks | 00: 16:9 container, ≥1920×1080, Seedance 2.5 primary (24 fps output), G-rated | yes |
| Generator access | Higgsfield MCP with `generate_image`, `generate_video` and the project tools visible (if only game-publishing tools appear, the user reconnects the connector in claude.ai settings; meanwhile they may run the cards by hand in the Higgsfield web app, otherwise wait); the film's Higgsfield project with its `00_STYLE` folder (ledger L.0b); Midjourney web (manual) | check on D2 morning |

---

## Hard rules (every sub-step)

1. **Reference frames are evidence, never inputs.** Never upload a frame, still, poster, trailer or clip from the reference film, or any image the user does not own, to any generator. That covers `--sref`, Midjourney image prompts and Edit-model references, GPT Image / Nano Banana references and any Higgsfield upload (`media_upload`, reference elements), and Seedance `@Image` / `@Video`. Claude views them for analysis only. Add `films/*/02-style/reference-frames/` to `.gitignore` before the first upload.
2. **No names in prompts.** Never put the reference film's title, its director, DP, actors, characters, or any camera, lens or stock brand or model in a generation prompt. Those names belong in the Look Bible only (2.4). Why: Terms cl. 6.1(d), 7.5 and 9.2(j) (00 R2); Higgsfield's official rule for Seedance block prompts bans director, signature-work and equipment names; and Midjourney is a defendant in studio copyright suits.
3. **No real people.** No actor's face as a reference, no "looks like <person>", no lookalike (00 R1, G2).
4. **Transfer mechanisms, not identity.** Take the light logic, colour roles, lens tendency and texture. Leave out signature production design, costumes, logos, iconic compositions and shot-for-shot recreations.
5. **Evidence discipline.** Quoted from ajinnaaa/extract-visual-style-2 (MIT):
   > "Never infer a specific camera, lens model, sensor, stock, LUT, software, or production method from appearance alone. Verify production facts or describe only the visible effect."
6. **Parameters are job settings.** Aspect ratio, resolution, duration, frame rate and quality never appear in prompt prose. "8K", "IMAX", "16:9" and "24fps" written in the text set nothing.
7. **Declarations, not blacklists.** Every line states the state that must hold. Short lock tails inside a declaration ("photographed, never rendered"; "No music. No subtitles.") are fine. `negative:` lists are not: Seedance has no negative-embedding channel and parses them as scene content.
8. **Seedance bracket channels.** In Seedance 2.5, `()` is music, `<>` is SFX, `{}` is dialogue and `【】` is subtitles (official guide, as transcribed in the user's seedance-2-5-prompts skill). The Seedance style block contains none of these characters, so "47° (50mm)" becomes "about a 47-degree field of view".

---

## Procedure

### 2.1 Intake (D2, first hour)

1. Ask in Arabic: which film or films, and what exactly they love in each (light, colour, camera movement, texture, composition, a specific scene's mood). Also ask which part of their film it is for: reality, dream, or both.
2. Ask for 6–12 stills per reference film, taken from their own legally obtained copy, or one short clip. Name the variety you need: day exterior, night exterior, day interior, night interior, a wide, a close-up with skin, a practical-lit shot, and a moving shot if a clip is available.
3. Pull the sequence list from the locked script (01). For each sequence record world (reality / dream / broadcast), location, time of day, and emotional function.
4. Copy the production locks from 00. Ask whether a scope matte is wanted. Recommend **full-frame 16:9 with no matte**: a 2.39:1 matte inside 1920×1080 leaves about 1920×804 active picture, which is a needless risk against the "≥1080p" rule (00 F4). Seedance ratio for every shot: `aspect_ratio: "16:9"`.
5. Create `films/<id>/02-style/` with `reference-frames/` (git-ignored), `look-frames/` (sidecar text only), `prefix/` and `look-bible.md`. The look-frame images themselves live in the Higgsfield project's `00_STYLE` folder and the Drive `00_STYLE/` (ledger L.0b), never in the repo. If `00_STYLE` is missing in Higgsfield, create it with `create_folder` after the user's yes (not idempotent: never re-run it after a timeout; check first, never invent a folder ID).
6. **If the user gives no reference at all:** build three PROPOSED directions from the rubric map. Each gets one paragraph and one look frame (2.8). The user picks one, then continue from 2.4.

### 2.2 Research the real production facts (when a title is given)

Never fill a gear field from memory. LLM gear tables are demonstrably wrong: one popular skill lists Blade Runner 2049 as "Venice 2 + Canon K-35", but ARRI's own news page credits ALEXA XT Studio cameras and Master Prime lenses.

**Source ladder** (search in this order, and label every field with the tier it came from):

| Tier | Sources | Label |
|---|---|---|
| 1 | DP or colorist in American Cinematographer / theasc.com, British Cinematographer, ICG Magazine; manufacturer case studies (ARRI, Sony, RED, Panavision, Zeiss, Cooke); official production notes | VERIFIED |
| 2 | Trade-press interviews quoting the DP or colorist (Filmmaker Magazine, IndieWire craft, postPerspective, No Film School) | VERIFIED if quoted directly, else REPORTED |
| 3 | IMDb technical specs, shotonwhat, colour-analysis blogs, single unsourced sites | REPORTED |
| — | Claude's memory, other skills' tables | never a source |

**Queries** (WebSearch first; WebFetch the best hits):
```
"<TITLE>" <DP NAME> American Cinematographer camera lenses
site:theasc.com "<TITLE>"
"<TITLE>" ARRI OR Sony OR RED OR Panavision cinematographer
"<TITLE>" colorist grade LUT interview
"<TITLE>" aspect ratio spherical OR anamorphic
```
theasc.com, britishcinematographer.co.uk and imdb.com often return 403 or an empty page to WebFetch (seen 2026-10-30). When that happens, use the search snippets plus a manufacturer page, and label the field honestly.

**Tech sheet** (written into `look-bible.md`, never into a prompt):
```
TECH SHEET — <TITLE> (<YEAR>) — DP <NAME> — colorist <NAME | UNKNOWN>
Field                          | Value | Label    | Source + date checked
Camera body / sensor format    |       |          |
Lens family; spherical/anamorphic (squeeze) |  |  |
Focal-length habits            |       |          |
Aspect ratio (theatrical/alt)  |       |          |
Capture (raw digital / film stock) |   |          |
Lighting approach (DP's words) |       |          |
Grade / LUT / print emulation  |       |          |
Filtration / diffusion         |       |          |
Camera-movement habits         |       |          |
```

**Worked example**, using a film the user's draft itself names for its leading-line class compositions ("مثل فيلم باراسايت"):
```
TECH SHEET — Parasite (2019) — DP Hong Kyung-pyo — colorist UNKNOWN
Camera body / sensor format | ARRI ALEXA 65, 65mm-class sensor  | VERIFIED | arri.com news page (checked 2026-10-30)
Lens family                 | ARRI Rental Prime DNA             | VERIFIED | same page
Extra Hasselblad lenses     | claimed by one blog               | REPORTED | single source; do not use
Aspect ratio                | 2.39:1 spherical                  | REPORTED | colour-analysis site only
Why large format            | wider, encompassing frames without an ultra-wide lens | REPORTED | PremiumBeat paraphrase
```
Transferable mechanism, written as an effect: "wide field of view with natural, undistorted perspective; architectural lines stay straight; space and level differences separate characters." What stays out of every prompt: the title, the house design, the staircase layouts, the cast.

### 2.3 Audit and measure the frames

1. **Adequacy label** (from ajinnaaa): 1 still = provisional; 2–5 varied stills = tentative; 6+ stills covering different subjects, light conditions and shot sizes = series-level evidence. Print the label next to every conclusion it limits.
2. **From a clip:** extract the first frame and one frame per distinct shot, for analysis only:
   `ffmpeg -i ref.mp4 -vf "select='eq(n,0)+gt(scene,0.3)',scale=960:-1" -fps_mode vfr reference-frames/f_%03d.png`
   Claims about camera movement or cutting rhythm are OBSERVED only from clips, never from stills.
3. **Measure** with the bundled script (Pillow + numpy; tested 2026-10-30; 07 reuses it for cut matching):
   `python3 -I scripts/measure_frames.py reference-frames/*.png > measurements.txt` (add `--csv` for a table).
   It prints luma p1/p50/p99, % clipped and crushed, mean saturation, shadow and highlight tint, and six colour clusters per frame.
   How to read it: p1 near 0.00 with crush above 3% means crushed blacks; p1 at 0.04–0.08 means lifted, milky blacks. Clipped above 1% means hard highlight clipping. A shadow tint bluer than the highlight tint means a warm/cool split. Clusters are MEASURED values, but a cluster may be production-design colour (a painted wall) rather than grade, so assign each one an owner in step 5.
4. **Observe per system** (ajinnaaa film.md order): lens and composition (shot sizes, camera height, focal tendency, depth of field, symmetry, negative space); exposure and lighting (key/fill relationship, source direction and motivation, practicals, haze, highlight roll-off, black density); colour pipeline (environment, costume, skin, accent, shadow hue, contrast curve); materials; texture and finishing (grain size and structure, halation, diffusion, sharpening). Halation is a thin warm fringe only where a genuinely bright highlight meets a dark area; it is not a global glow. Digital noise is not film grain unless its structure shows it.
5. **Separate four kinds of information** (ajinnaaa): *content* (identities, objects, places, story), *transferable style*, *production locks* (16:9, Seedance, G rating), *scene locks* (one shot only). Only transferable style may enter the prefix.
6. **Reference ledger** (adapted from calesthio/generative-media-skills):

| # | Observed evidence (frame IDs) | Transferable mechanism | Exclude (identity-bearing) | Label · confidence |
|---|---|---|---|---|
| 1 | f_002, f_007: daylight enters only through windows; faces about one stop under the window | "every light has a visible source; faces sit about one stop under the brightest background" | the house's window design | OBSERVED · high (6 frames) |
| 2 | f_004: low camera, stairs rising out of frame between two people | "level differences separate characters of different status" | the staircase design | OBSERVED · medium (2 frames) |
| 3 | measured shadow tint #1d2329 vs highlight #e6d3b8 | "cool shadows, warm highlights, restrained split" | — | MEASURED · high |

### 2.4 Write the Look Bible (documentation only, never pasted into prompts)

`look-bible.md` holds the tech sheet (2.2), the measurements and ledger (2.3), DP and film names, and the systems below. It keeps the user's old 12-pillar skeleton, corrected:

| Old pillar | Keep as | Correction |
|---|---|---|
| Style: "8K IMAX" | MEDIUM | resolution and format words removed; one medium anchor, e.g. "photographed live-action, never rendered" |
| Cinematography: DP × DP | Bible only | names translated into observable laws: light law, contrast curve, roll-off, lens tendency |
| Lighting + "forbidden" list | LIGHT LAW + per-variant LIGHT | positive law; white balance in Kelvin, fixed per scene; haze in % or metres; left/right from camera |
| Color 60:30:10 | COLOR | 4–6 hex swatches by role (shadow, midtone, highlight, skin, accent), each attached to a surface or light source; ratios are flexible ranges; one saturated accent reserved for the story |
| Camera: "physical cine lens" | CAPTURE + lens ladder | sensor-format feel, spherical/anamorphic rendering, angle-of-view intent, depth-of-field policy, shutter feel, texture |
| Skin | TEXTURE | pores, vellus hair, sweat or oil by condition, fabric weave, wear |
| Acting | PERFORMANCE (one line) | detail owned by 05b-acting-direction.md |
| Physics | PHYSICS | dream exceptions declared per shot in ledger-continuity-physics.md |
| Composition | COMPOSITION (optional line) | only if it is a true invariant |
| Continuity | CONTINUITY | always the second-to-last line |
| Technical: "24 fps" | removed | a job setting (Seedance outputs 24 fps; there is no fps field) |
| Audio | AUDIO | always the last line; BRIEF: Seedance renders SFX only, never music |

Lens rule (calesthio, MIT): record "angle-of-view intent, subject distance, and sensor assumption—not a millimeter number alone." Keep a **lens ladder** in full-frame-equivalent mm with the diagonal-FOV anchors used in Seedance text: 24mm ≈ 84°, 35mm ≈ 63°, 50mm ≈ 47°, 85mm ≈ 29°, 135mm ≈ 18°. That degrees-beat-millimetres behaviour is a field claim (A0339x, OSideMedia), not a measured one. 04-blender-blocking.md builds Blender cameras with a 36 mm sensor width, sensor fit Horizontal, and these focal lengths. Blender's FOV field shows the horizontal angle (about 40° at 50mm), so always copy the diagonal number from this ladder, never from Blender.

**Project invariants:** write 3–7. Each must be visible in a frame, reusable across different scenes, testable by another person, and independent of any named character or place. They become the acceptance checklist in 2.8 and 08-judge-panel.md.

### 2.5 Per-sequence variants and the colour script

The stable core holds across the whole film, so it may contain only what is true in **every** world. A **variant** adds LIGHT, COLOR and CAMERA lines, an optional TEXTURE line where surfaces change by world, and a PHYSICS EXCEPTION line in the dream; it never edits a core line. **Contradiction test:** read the core next to each variant. If any core sentence contradicts a variant (for example "every light has a visible source" against DREAM's "light from no visible source"), move that sentence out of the core into the variants that need it. Build variants by visual condition and world, not by story location. Do not average reality and dream into one look. A coherent film needs the same governing logic, not identical brightness.

**The dream must differ from reality on at least two axes** (camera behaviour plus light quality), so the audience reads every world switch without a title card. This serves the Creativity & Aesthetic score (20) and the AI Integration idea in 00 §0.3.

Film 01 starting variants. All values are PROPOSED until the reference research or the user changes them:

| ID | Covers | LIGHT | COLOR | CAMERA |
|---|---|---|---|---|
| R-DAY | streets, bus, metro walkway, workshop, Kabir | hard high sun at 5600K from above and behind camera left; short crisp shadows; dust haze visible at 30 metres; heat shimmer over asphalt | pale ochre dust and concrete #C9B79C; shadows fall to cool slate #2E3640; sun-bleached, saturation held low except skin | handheld, gentle breathing drift, operator at body height |
| R-INT | shared room, washrooms, booth shop | one cool overhead fluorescent tube at 4000K plus one warm 3200K practical in frame; fast falloff to the walls; haze 10% | cool greenish walls, warm pool around the practical; deep shadows keep detail | handheld, close, slower drift |
| DREAM | every 2nd Life sequence | soft, shadowless light at 6500K from no visible source; every surface evenly exposed; air perfectly clear | richer saturation, pure whites, spotless polished surfaces; slightly too perfect | locked-off frames or perfectly smooth glides; exact symmetry |
| BROADCAST | Noah's stage feed seen in the lens HUD | bright, even, high-key stage light at 5600K; soft frontal key, clean rim | neutral whites, glossy dark stage floor | locked-off broadcast framing, slow motorised push-ins |
| FINALE | Food+ montage → mother's arrival → wedding | low warm sun at 3500K behind the subjects, long shadows, soft natural flare | warm golden highlights; saturation one step above R-DAY | steadied handheld, calmer than R-DAY |

The four reality variants (R-DAY, R-INT, BROADCAST, FINALE) end their LIGHT line with the same tail: "every light has a visible or implied source; faces sit about one stop under the brightest part of the background." DREAM never carries it.
TEXTURE lines: R-DAY and R-INT "skin carries heat sweat; cotton shows fading and wear; metal shows fine scratches"; DREAM "every surface is spotless and polished; fabrics are crisp and new". BROADCAST and FINALE add none.
DREAM also carries `PHYSICS EXCEPTION: only [the scripted impossible event] breaks physics; everything else keeps real weight.` Name the event per shot and log it in ledger-continuity-physics.md.
Add a variant only when the locked script needs a condition these five do not cover (for example R-NIGHT for a night exterior; the night room scene S11 stays R-INT). 07 builds one grade layer per variant.

**Reserved looks.** One saturated accent belongs to one story element: here, the assistant ring-light green #3BD16F, seen only on assistant devices. Golden hour is reserved for FINALE: no earlier sequence uses low warm sun. Write these reservations in the Bible, never in the core: a prompt names the green only when an assistant device is in frame (05 adds it to that shot's content), because a colour named in a prompt tends to appear.

**Colour script.** Fill from the locked script (01); this is the draft v0 order:

| Seq | Content (neutral summary) | Variant | Kelvin | Saturation | Contrast | Camera |
|---|---|---|---|---|---|---|
| 1 | opening dream around the pool | DREAM | 6500 | high | soft | locked / glide |
| 2 | wake in the booth, out into the noon sun | R-INT → R-DAY | 4000/3200 → 5600 | low | high | handheld |
| 3 | bus, walkway, metro, Noah in the lens | R-DAY + BROADCAST inside HUD | 5600 | low | high | handheld |
| 4 | room, call with mother | R-INT | 4000/3200 | low | medium-high | handheld close |
| 5 | 2nd Life dream sequence (content per G1 fixes) | DREAM | 6500 | high | soft | locked / glide |
| 6 | Kabir, work, the Food+ idea | R-DAY | 5600 | low → medium | high | handheld |
| 7 | Food+ montage, mother arrives, "Alhamdulillah" | FINALE | 3500 | medium-high | soft | steadied |

**Fold rule** (OSideMedia): if the same line is overridden in three or more shots, it belongs in a variant (or a new variant), not in per-shot edits. Fold it, version the look, and re-render what changed.

### 2.6 Compile the master prefix (the ONE locked text)

Shape, from OSideMedia's 13-project harvest (MIT), quoted: "one axis per clause, each a hard positive rule, always ending on continuity/no-drift + audio policy."

```
LOOK v<X.Y> — <FILM> — STABLE CORE
MEDIUM: [one medium anchor + 1–2 supporting tokens].
CAPTURE: [sensor-format feel], [spherical|anamorphic rendering], [angle-of-view tendency as visible effect], [depth-of-field policy], [shutter feel], [texture policy].
LIGHT LAW: [highlight roll-off]; [black density]; [any exposure rule true in every world].
COLOR: [only colour rules true in every world, e.g. skin]; world palettes and the reserved accent stay out of the core.
TEXTURE: [skin], [fabric], [glass] — each a visible behaviour true in every world.
PHYSICS: [gravity, weight, contact rule].
PERFORMANCE: [one-line register from 05b].
CONTINUITY: [identity lock].
AUDIO: [diegetic policy]. No music, no background music, no score. No subtitles.
--- VARIANT [ID] (adds to the core; replaces nothing above) ---
LIGHT: [source, direction from camera, Kelvin, shadow quality, haze % or metres] [+ reality tail, 2.5].
COLOR: [world palette: swatch role + hex attached to a surface or light, ×2–4].
TEXTURE: [optional: only what differs by world].
CAMERA: [movement behaviour].
PHYSICS EXCEPTION: [DREAM only].
```
Versions: v0.x while exploring on D2; the Gate locks v1.0; every later change is v1.1, v1.2… (2.12).

Compile rules:
- Each line is a declaration. No "cinematic", "masterpiece", "8K", "IMAX", "hyperrealistic". One style anchor plus one or two supporting tokens beats a long adjective list.
- No numbers that are job settings. Numbers that describe the world are wanted: Kelvin, haze %, metres, stops.
- No names of films, people or gear. No `()`, `<>`, `{}`, `【】` anywhere.
- Hex values are never a bare list. Attach each to a surface or light source.
- Budget (house guidance, not a model limit): the master core may run to about 230 words because it is the full record. Compiled adapters are shorter: the Seedance "visuals feature" paragraph, core plus variant, stays at or under about 130 words, the Midjourney string at 30–50 words, and each variant at 30–50 words. The shot's own content keeps most of the prompt.

**Worked example: film 01, LOOK v0.1 (PROPOSED, before any reference research)**
```
LOOK v0.1 — 2nd Life: Ascent — STABLE CORE
MEDIUM: Photographed live-action drama with real optics and real materials; every frame reads as filmed on location, never rendered.
CAPTURE: Large-sensor feel with spherical lenses; wide, undistorted perspective with straight architectural verticals; moderate depth of field that keeps the room readable behind faces; 180-degree shutter motion blur; clean capture with fine, even sensor texture.
LIGHT LAW: Highlights roll off softly and never clip on skin; blacks are dense but keep detail; exposure stays natural, never flattened into an HDR look.
COLOR: Every skin tone stays natural in any light: never orange, grey or waxy.
TEXTURE: Skin shows pores and fine vellus hair; fabric shows its weave; glass carries true reflections.
PHYSICS: Gravity and inertia respected; every object has real weight and visible contact with whatever supports it.
PERFORMANCE: Naturalistic and restrained; eyes always working on a target; breath visible in the chest.
CONTINUITY: Characters, wardrobe, props and environments stay identical to their references across every cut; no identity drift.
AUDIO: Diegetic sound effects and ambience; dialogue only where the shot scripts it. No music, no background music, no score. No subtitles.
```
Save as `prefix/master.txt`, and each variant as `prefix/variant-<ID>.txt` (its rows from the 2.5 table plus the reality tail and TEXTURE line). Also save `prefix/plate-safe.txt`: the medium anchor without location words ("Photographed with real optics and real materials.") plus the TEXTURE line. 03 puts it on identity sheets and neutral plates, which must carry no light, lens, grade or palette.

### 2.7 Model adapters (compiled mechanically from master.txt; never re-worded per shot)

**Verified parameter snapshot** (Higgsfield `models_explore` `action: get`, 2026-11-01; vendor facts 2026-10-30). Re-check anything older than 14 days before quoting it. Every job runs in Higgsfield (decision 2026-11-01); the BytePlus ModelArk API route exists but is not used.

| Model | Higgsfield id and params used here | Status |
|---|---|---|
| GPT Image 2.5 | `gpt_image_2_5`; `variant` `flare` (fast, default) · `sunburst` (precision, hero); `quality` `low·medium·high·xhigh·max` (default `low`); `resolution` `1k·2k·4k` (default `1k`); `background` `auto·opaque·transparent` (omit); `aspect_ratio` includes `16:9` and `21:9`; media role `image_references`. A bare call runs flare/low/1k, so set every field. Vendor fact: output above 2560×1440 is "experimental" | VERIFIED, `models_explore` 2026-11-01; OpenAI image-generation guide |
| Nano Banana 2.1 | `nano_banana_2_1`; `resolution` `1k·2k·4k` (default `1k`); `thinking_level` `minimal·medium·high`; `seed`; `is_inpaint` with a `mask` image; media roles `image_references`, `mask`, `video_references`. Vendor: up to 14 references, at most 4 characters and 10 objects; no style-reference slot. Never the MCP's `nano_banana_2` (the deprecated NB2) | VERIFIED, `models_explore` 2026-11-01; ai.google.dev (updated 2026-10-29) |
| Nano Banana Pro | `nano_banana_pro`; `resolution` `1k·2k·4k` (default `2k`); ratios `1:1`…`21:9`, no `auto`; media role `image_references` only. Vendor: up to 6 objects, 5 characters and **3 style references** (14 total); on Higgsfield a style reference is an `image_references` item whose job the prompt states (adapter B) | VERIFIED, `models_explore` 2026-11-01; ai.google.dev |
| Midjourney V8.2 | default model; Edit Model replaces Omni Reference with up to 4 image references; `--cref`/`--oref` do not run on V8.2 | VERIFIED, updates.midjourney.com (27 Aug 2026) |
| Midjourney params | `--sref` (URLs or codes; must have a text prompt), `--sw 0–1000` (default 100), `--raw`, `--s 0–1000` (default 100), `--ar` whole numbers only, `--no`, `--hd` (2K, more GPU time). Leave `--sv` (V8.2 accepts only 6) at default; never emit `--q` (house rule shared with 03) | third-party V8.2 guides (Evolink API manual, tech-insider, 2026-10-30); official docs returned 403 → confirm in the web UI |
| Seedance 2.5 | `seedance_2_5` via `generate_video`; `mode` `t2v·omni_reference·video_edit·video_extension`; `duration` 4–30 whole seconds; `resolution` `480p·720p·1080p` (default `720p`); `aspect_ratio` `auto·21:9·16:9·4:3·1:1·3:4·9:16`; `generate_audio` (default true); `bitrate_mode` `standard·high`; `draft: true` = a 480p draft, finalized at 1080p with `draft_job_id` within 7 days; media roles `start_image`, `end_image`, `image_references`, `video_references`, `audio_references`; `folder_id`; no fps field (output 24 fps per ByteDance docs; 05 confirms on the first file) | VERIFIED, `models_explore` 2026-11-01 |
| Cost | `get_cost: true` returns credits and submits nothing (`generate_image`, `generate_video`; not inside a batch). Seedance 2.5 on the user's account: draft 3 credits/s, 1080p 16 credits/s; references and `bitrate_mode` do not change the price | TESTED with `get_cost` (05) |

**A. GPT Image 2.5** (look frames, location keyframes). Route: Higgsfield `generate_image`, `model: "gpt_image_2_5"`, `folder_id` = the `00_STYLE` folder; or the user runs the card by hand in the Higgsfield web app inside the same project (2.8 step 2).
```
Intended use: look-development still for a live-action short film. It becomes the style reference for every later image, so light, colour and texture must be exact.
Scene: [SCENE CONTENT: place, time, weather, what is in frame]
Subject: [synthetic people only, or "no people"]
Look: [master CAPTURE, LIGHT LAW, COLOR, TEXTURE lines] [variant LIGHT, COLOR, TEXTURE lines] [variant CAMERA line as a still: e.g. "slightly off-level handheld framing"]
Constraints: one single photographic frame; no text, no logos, no watermark, no borders.
```
Settings: hero frames use `variant: "sunburst"`, `quality: "max"`, `resolution: "4k"`, `aspect_ratio: "16:9"` (4K sits in OpenAI's experimental band; fall back to `"2k"` if a take shows artefacts); exploration uses `flare`, quality `high`, `"2k"`. Set every field on every call. "Real photograph" phrasing follows the OpenAI cookbook. A field report says the word "photorealistic" makes faces plastic, so A/B both phrasings on the first face frame and keep the winner in the master notes. Edits: the frame to edit goes in as `image_references` by its Higgsfield job ID; "Change only: X. Preserve: everything else, identical." Repeat the preserve list every turn.

**B. Nano Banana Pro / 2.1** (consistency edits, alternatives). Write natural prose, not labelled lines. Describe lens effects in words, because third-party tests report that Nano Banana ignores mm and f-numbers (smixs/visual-skills).
```
A photographed live-action film frame: [SCENE CONTENT]. [variant LIGHT as one sentence]. Wide, undistorted perspective with straight verticals; the background softly out of focus but readable. [COLOR line as one sentence, colours attached to surfaces]. [TEXTURE line]. Natural contrast with soft highlight roll-off and dense, detailed blacks, no HDR look. A single composition with no text.
```
Pro only: attach 1–3 approved look frames of the same variant as `image_references` by their Higgsfield job IDs, labelled "Images 1–N are style references: take only their light quality, colour palette and surface texture; ignore their objects, people and layout." 2.1 has no style slot, so a look frame there counts as an object reference and its layout can leak: prefer text alone, and test one frame with that role sentence only if text drifts. Settings: `model: "nano_banana_pro"` or `"nano_banana_2_1"`, `aspect_ratio: "16:9"`, `resolution: "2k"` for exploration and `"4k"` for heroes; `thinking_level: "high"` on 2.1 for complex frames. Never strip SynthID or C2PA data (Terms 5.6).

**C. Midjourney V8.2** (the user runs these by hand). Condense the master into one sentence-style string of 30–50 words, subject first, look after it, and parameters last with nothing after them.
```
Photographed live-action film still. [SCENE CONTENT]. Hard high sun from above and behind camera left, short crisp shadows, dust haze in the far distance, pale ochre concrete, cool slate shadows, natural warm brown skin with pores and sweat, wide undistorted perspective with straight verticals, moderate depth of field, fine even sensor texture --v 8.2 --raw --ar 16:9 --sref [R-DAY hero frame URL] --sw 100
```
The suffix matches 03's default (`--v 8.2 --raw --ar 16:9`). `--s` stays at default; A/B 50 / 100 / 250 only under a fixed `--seed`, one change at a time.

`--sref` rules for this project:
1. Source: only the project's own approved hero look frame (a GPT Image, Nano Banana or Midjourney output uploaded to Midjourney), or a numeric code found with `--draft --sref random` exploration. Never a reference-film still, poster or any image the user does not own.
2. One sref per variant. The R-DAY sref never goes on a DREAM prompt: an sref carries palette and light quality strongly, so a night sref darkens a day prompt.
3. `--sw`: start at 100; the working range is 50–300 (PROPOSED; 03 uses 100–300 for location frames). Above that, the sref starts overriding scene content.
4. `--sref` carries look only, never identity. Characters, props and locations go through Edit Model references (up to 4) in 03-assets-images.md.
5. Keep Personalization off (the web toggle silently adds `--p`) unless its profile code is logged. Never combine a moodboard with `--sw`/`--sv` (03's rule; the conflict itself is unverified).
6. Run every Midjourney job in Stealth mode (Pro or Mega plan). Without it, look frames and uploaded hero frames are public on midjourney.com, which can breach the Summit holdback (03 ground rule 7).
7. When editing or inpainting a frame, reuse the same `--sref` so inserted elements keep the look.
8. Use `--no` only for concrete objects; its words are parsed one by one. Use `--hd` only on approved frames.
9. Log the sref URL or code, `--sw`, `--s`, version and seed in the ledger.

**D. Seedance 2.5** (final picture). 05-seedance-production.md uses ByteDance's formula (Subject + Action + Scene → Visual style → Camera → Audio). This module supplies three fixed blocks:
```
[SCENE PARAGRAPH from 05]
The visuals feature [MEDIUM] [CAPTURE] [LIGHT LAW] [COLOR] [TEXTURE] [PHYSICS] [PERFORMANCE] [variant LIGHT] [variant COLOR] [variant TEXTURE] [PHYSICS EXCEPTION, DREAM only].
[CAMERA from 05: shot size, angle, movement, field of view as "about a 47-degree field of view"; variant CAMERA behaviour appended]
[CONTINUITY line]
Audio includes [shot SFX from 05]. [AUDIO line]
```
Labels such as "MEDIUM:" are dropped and each line becomes a sentence. Every `[SLOT]` is replaced before submission. The per-shot field of view lives only in the camera sentence. 05 owns the final assembly (reference roles, dialogue, parameters) and may move blocks, but never edits their text.
Worked example (R-DAY; the "visuals feature" paragraph is 126 words, inside the 130 budget):
```
Miraj, [his locked one-line description from 03-assets-images.md], in a sweat-darkened grey work shirt, edges down the crowded bus aisle and grips the overhead rail as the bus brakes.
The visuals feature photographed live-action drama with real optics and real materials; every frame reads as filmed on location, never rendered. Large-sensor feel with spherical lenses, wide undistorted perspective, moderate depth of field, 180-degree shutter motion blur, clean capture with fine, even sensor texture. Highlights roll off softly and never clip on skin; blacks are dense but keep detail. Skin tones stay natural, never orange or waxy, with pores and fine vellus hair. Gravity and inertia respected. Naturalistic, restrained performance. Hard high sun at 5600K enters the windows from camera left; short crisp shadows; dust haze; every light has a visible source. Pale ochre dust and concrete #C9B79C, cool slate shadows #2E3640, saturation held low except skin. Heat sweat on skin; cotton shows fading and wear.
Use a handheld medium shot from behind Miraj at about a 47-degree field of view, with gentle breathing drift.
Characters, wardrobe, props and environments stay identical to their references across every cut; no identity drift.
Audio includes the diesel idle, a brake hiss and passengers murmuring. Diegetic sound effects and ambience; dialogue only where the shot scripts it. No music, no background music, no score. No subtitles.
```
Rules: set `aspect_ratio: "16:9"`, `resolution` (or `draft: true`) and `duration` as job parameters on Higgsfield `generate_video`, never in prose. Look frames are not Seedance references by default (03 §3.1.6 step 6). Only if two calibration rounds (2.8) fail to hold the look in drafts, and with the user's OK, test one face-free hero frame on a single draft (`mode: "omni_reference"`, the frame's Higgsfield job ID as `image_references`; same credits as without it) as "@Image N defines only the colour grade, light quality and surface texture. Do not use its objects, layout or people." Log it, and keep it only if the draft improves. Never put a face in it: ByteDance's Seedance filter rejects realistic faces in references, and faces enter only through the route T1 proved on Higgsfield (03 §3.3–3.4; 05). Check the first drafts for hex codes or labels rendered as on-screen text. If any appear, drop the hex values from the Seedance block only and keep the colour words.

### 2.8 Look frames, Seedance look test and calibration (D2 afternoon → D3)

1. **Quote cost first.** Higgsfield has no spend cap (05). Preflight each distinct request with `get_cost: true` (nothing is submitted; a batch item cannot preflight, so price one item and multiply), state the job count and credits, and get the user's yes per batch. Seedance look-test drafts cost 3 credits/s on the user's account: 24–30 credits for 8–10 s (≈ $1.07–1.50). Leave `use_unlim` unset; if the tool returns `unlim_choice`, ask the user which balance pays. Never repeat a call to "retry": after a timeout, check the returned job ID with `jobs_wait` first.
2. **Look frames:** per variant, 2 frames in GPT Image 2.5 sunburst (`generate_image` with `count: 2`) and 2 in Nano Banana Pro, all with `folder_id` = `00_STYLE`; or independent prompts in one `generate_image_batch` (≤ 12), then `jobs_wait` and one `show_generation_by_ids` for the board. Plus a Midjourney prompt the user runs. Use face-free or back-of-head compositions where possible: characters are not locked until 03. Download each kept original the moment it finishes, hash it with SHA-256 and file it in Drive `00_STYLE/`. Save each with a sidecar `<name>.json`: Higgsfield job ID, model, params, full prompt, LOOK version, route (`higgsfield-mcp` or `higgsfield-web`), account, folder and the SHA-256 of the downloaded original. **Frames the user makes by hand in the Higgsfield web app** (same project): read them back with `list_project_assets` (`workspace_id`, `project_id`, `folder_id`, `output_kinds: ["image"]`), `get_project_asset_prompt` (`placement_id`) for the exact prompt and `get_project_asset_source` for the file, and log them the same way.
3. **Seedance look test:** one 8–10 s draft for R-DAY and one for DREAM, with environment or back-of-head figures only: Higgsfield `generate_video`, `model: "seedance_2_5"`, `mode: "t2v"`, `draft: true` (480p), `aspect_ratio: "16:9"`, `generate_audio: true`, `folder_id` = `00_STYLE`. Download, hash and log each draft in the same turn: Higgsfield keeps a draft finalizable only for 7 days and is never the only copy. This is the only proof that the look survives in the final medium. An untested prefix is never called locked (ajinnaaa).
4. **Score every frame** against the acceptance checklist: every invariant visible; the variant matches its condition; in reality variants, light motivated and shadows consistent with one key direction (DREAM: shadowless, no visible source); the reserved green only on its owner; skin natural (not plastic, not orange: at most two warm cues together); reads as photographed, not CGI; no text, logo, brand or real-person likeness.
5. **Calibrate** (ajinnaaa loop), one fix per round, at most three rounds before the D3 lock:

| Visible mismatch | Owning system | Faulty or missing rule | Replacement rule | Layer | Removed |
|---|---|---|---|---|---|
| dream frames show hard shadows | LIGHT (DREAM) | "soft light" too weak | "shadowless light from no visible source; every surface evenly exposed" | variant | "soft light" |

   Replace rules; never pile on negatives. Repair locally when the governing system is right and the failure is isolated. Regenerate when lighting logic, geometry or several systems are wrong.
6. Pick **one hero frame per variant**. These feed the Midjourney `--sref`, Nano Banana Pro style references and the show-LUT match in 07-edit-mix-finish.md.

### 2.9 Decisions to record before the lock

- **Grain and halation:** PROPOSED default is to add them in post (07), uniformly, so drafts, 1080p finals and every model stay consistent. Prompts keep "clean capture with fine, even sensor texture". Halation, if used, is a post effect on true highlight edges only.
- **Matte:** none (2.1 step 4), unless the user decides otherwise in writing.
- **Grade intent for 07:** per variant, one line plus the hero frame. AI clips are display-referred Rec.709; never apply a log-to-709 LUT to them (calesthio). The show LUT is matched from hero frames in 07.
- **Reserved accent and reserved looks:** owner named.
- **Dream physics exceptions:** listed per sequence.

### 2.10 Lock, save and log

Save `prefix/master.txt`, `prefix/variant-*.txt`, `prefix/plate-safe.txt`, `prefix/seedance.txt`, `prefix/gpt-image.txt`, `prefix/nano-banana.txt`, `prefix/midjourney.txt`, `style-lock-card.md` and `look-frames/`. Write the decisions and every rejected option, with the user's sign-off, to `evidence/authorship/02-style-decisions.md` (00 §0.11). Log every look-frame and look-test generation for the AI Disclosure (00 D1) as a ledger row: tool `Higgsfield`, model id, route, account, plan, Higgsfield job ID, folder, credits and the SHA-256 of the downloaded original. The look-frame images go to Higgsfield and Drive `00_STYLE/`; the repo keeps the text files only.

### 2.11 Injection contract (every later step)

| Step | Receives | How it is injected |
|---|---|---|
| 03-assets-images.md | adapters A–C, hero frames, `--sref` per variant | location plates and keyframes carry core + variant verbatim. **Character, prop and costume reference sheets and neutral location plates do not**: they get `prefix/plate-safe.txt` only, with neutral flat light on mid-grey, so the grade is not baked into identity assets; the look comes back in the scene prompt |
| 04-blender-blocking.md | lens ladder (36 mm sensor width, focal lengths), camera behaviour per variant, 24 fps | camera and movement only; playblast look is excluded in Seedance by the blockout clause |
| 05-seedance-production.md | `prefix/seedance.txt` + variant ID per shot; reserved-accent wording | verbatim in the visual-style slot; CONTINUITY and AUDIO lines verbatim; the green #3BD16F is named only in shots with an assistant device in frame; shot overrides replace one line only |
| 05b-acting-direction.md | PERFORMANCE line | 05b expands it per beat; it never contradicts the line |
| 06-music-and-sfx.md | AUDIO policy, colour-script sequence boundaries | no music in any Seedance prompt; cue map follows the colour script |
| 07-edit-mix-finish.md | grade intent, hero frames, palette, grain/halation and matte decisions, `scripts/measure_frames.py` | hero-shot match per scene, then show LUT, then grain |
| 08-judge-panel.md | invariants and colour script | Creativity & Aesthetic and Technical critique are checked against them |
| ledger-continuity-physics.md | LOOK version, variant ID, sref codes, model params, Higgsfield job ID and folder per asset | one row per asset and shot |

Every prompt Claude writes after the lock opens with an internal check: LOOK version correct, variant ID matches the colour script, core text byte-identical to `prefix/*.txt`.

### 2.12 Change control

- **Per-shot override:** replace one line in that prompt only, and log it. Apply the fold rule (2.5).
- **Change to the core or a variant:** bump the version (v1.0 → v1.1), list every asset and shot made under the old version, and ask the user which to regenerate.
- When the user asks for something that breaks the lock, say (carried over from the old pipeline): «ملاحظة: هذا التعديل يخالف الستايل المعتمد LOOK v1.0. هل نحدّث المرجع (نسخة جديدة) أم نطبّق التعديل على هذه اللقطة فقط؟»
- After the first approved 1080p final, change the core only with the user's explicit approval and a re-render impact list.
- Step-8 judge notes come back through the calibration loop (2.8 step 5), never as appended adjectives.

---

## Output templates (what Claude shows the user)

**A. Research findings card** (end of 2.2–2.3):
```
أبوستيشا، هذه نتائج البحث عن المرجع: <العنوان>
موثّق (VERIFIED): <الحقل — القيمة — المصدر>
منقول (REPORTED): <…> — لن نعتمد عليه في القرارات
ملاحَظ في الإطارات (OBSERVED، <عدد> إطارات، الحكم: <مبدئي/أولي/قوي>): <…>
مقيس (MEASURED): السواد <…> · الإضاءات العالية <…> · الظلال <hex> · الإضاءات <hex>
ما سننقله إلى فيلمك (آليات): 1… 2… 3…
ما سنستبعده (هوية العمل الأصلي): <…>
سؤال: أيّ هذه الآليات تريدها للواقع، وأيّها للحلم؟
```
**B. Look-frames review** (2.8): show the frames inline, grouped by variant, each captioned in Arabic with its model, the checklist result and one line on what to fix. Show swatches as coloured blocks if the surface can render them (an HTML preview or artifact); otherwise give hex plus an Arabic name.

**C. Style-lock card** (`style-lock-card.md`, shown in full before the Gate):
```
بطاقة قفل الستايل — <الفيلم> — LOOK v<X.Y> — <التاريخ>
المرجع والأدلة: <العنوان/الإطارات> — مستوى الدليل: <…>
الثوابت (3–7): 1… 2… 3…
المتغيرات وخريطة الألوان: <جدول 2.5>
لوحة الألوان: <hex — الدور — السطح/المصدر>
اللون المحجوز: <اللون> لـ<العنصر> فقط · الإضاءة المحجوزة: <…>
القرارات: الحبيبات والهالة <في المونتاج/في التوليد> · القناع <لا شيء/…> · فيزياء الحلم <…>
الإطارات البطلة: <ملف لكل متغير> · اختبار Seedance: <Higgsfield job IDs + النتيجة>
النصوص المقفلة (English): master · Seedance · GPT Image · Nano Banana · Midjourney
```
Lock prompt:
> «أبوستيشا، هذه بطاقة الستايل LOOK v1.0. هل نقفلها للفيلم كاملاً وننتقل إلى الخطوة 3: الأصول والصور؟ بعد القفل يُلصق هذا البلوك حرفياً في كل برومبت صور وفيديو، وأي تعديل لاحق يصبح نسخة جديدة.»

Accept only a clear yes («اعتمد»، «اقفل»، «كمّل»). Silence or partial agreement is not approval.

---

## Gate (the user approves all of this before 03-assets-images.md starts)

- [ ] Tech sheet: every field labelled VERIFIED / REPORTED / UNKNOWN with a source; no field taken from memory.
- [ ] Evidence adequacy stated; OBSERVED claims cite frame IDs; motion claims come from clips only.
- [ ] Reference ledger: mechanisms to transfer and identity details excluded, both agreed.
- [ ] 3–7 invariants, each testable.
- [ ] Variants and colour script cover every sequence of the locked script; dream differs from reality on at least two axes; reserved accent and reserved looks named in the Bible, not in the core.
- [ ] Master prefix: no names, no gear brands, no job parameters, no bracket characters, hex attached to owners, ends on CONTINUITY then AUDIO; the contradiction test (2.5) passes against every variant.
- [ ] Four adapters compiled from the master; parameter snapshot re-checked within 14 days.
- [ ] At least one approved hero look frame per variant, and Seedance draft look tests for R-DAY and DREAM passed.
- [ ] Decisions recorded: grain/halation, matte, grade intent, dream physics exceptions.
- [ ] IP check: no reference-film frame uploaded anywhere; reference frames git-ignored; no real-person likeness in any look frame (00 G2).
- [ ] Files saved, authorship and disclosure logs written; the locked prefix, each approved look frame and the instructive rejects are entered in `prompt-library/style.md` (SKILL §7b).
- [ ] The user said «اعتمد» to LOOK v1.0.

---

## Common failures

| Symptom | Cause | Fix |
|---|---|---|
| Prompt says "8K, 16:9, 24fps" and nothing changes | job settings written as prose | delete; set ratio, resolution and duration on the job |
| Gear "facts" that turn out wrong | taken from memory or another skill's table | source ladder (2.2); label UNKNOWN when unsure |
| Midjourney or GPT output resembles the reference film too closely | film title, DP name or a reference still used as `--sref` | strip names; `--sref` only from our own hero frame |
| A painted wall colour applied to the whole grade | production-design colour taken for grade | give each measured cluster an owner (2.3 step 5) |
| Day and night shots look averaged and flat | one universal lighting block | variants (2.5); the core never holds a time of day |
| Seedance adds music or burns in captions | `(…)`, `【…】` or a parenthesised "(50mm)" inside the style block | bracket-free block; AUDIO line verbatim; "No subtitles." |
| Seedance refuses a look frame used as a reference | a photoreal face in the reference | face-free look frames; faces only through the route T1 proved on Higgsfield (03 §3.4; 05) |
| Shot action ignored and the frame looks generic | prefix crowds the prompt or stacks adjectives | word budget; one anchor plus 1–2 tokens; remove "cinematic" |
| Hex palette ignored or colours random | bare hex list | attach each hex to a surface or light; one reserved accent |
| Skin plastic or orange | "photorealistic" on faces; three or more warm cues | A/B "real photograph" phrasing; at most two warm cues |
| Character sheets fight later lighting | look grade baked into identity sheets | neutral sheets (2.11, 03) |
| 1080p final looks different from the approved draft | the final is a new render | compare to the hero frame; fix in grade (07) or redo the draft |
| Dream is not readable as the dream | only colour differs | change camera behaviour and light quality too |
| Dream shots get hard, motivated light anyway | a reality rule ("every light has a visible source") left in the core | contradiction test (2.5): move it into the reality variants |
| The reserved green appears on random props | the colour is named in prompts where no device is in frame | keep it out of the core; name it only in shots with an assistant device; sweep at G2/G3 |
| Negatives keep growing after each review | patching instead of calibrating | the 2.8 calibration loop: replace the rule, delete the obsolete negative |
| "Locked" look falls apart in video | never tested in Seedance | draft look test before the Gate |

---

## Sources and credits

- ajinnaaa/extract-visual-style-2 (MIT; commit cloned 2026-10-30): evidence discipline, adequacy labels, four kinds of information, stable/conditional/scene layers, calibration loop. One rule quoted verbatim; the rest paraphrased.
- OSideMedia/higgsfield-ai-prompt-skill (MIT): global-style-prefix shape (one line quoted), per-scene override and fold rule, reserved accent, measurable-language rules, FOV anchors.
- calesthio/generative-media-skills, visual-style-direction and color-grading-finishing (MIT): reference ledger, lens-intent rule (quoted), display-referred grading.
- A0339x/ai-film-pipeline (MIT): palette by role attached to surfaces; FOV-degree lens ladder (unmeasured field claim). Paraphrased.
- smixs/visual-skills by Serge Shima — github.com/smixs/visual-skills (CC BY 4.0): Nano Banana / GPT Image adapter notes (lens numbers ignored, HDR over-cooking), paraphrased.
- n1ko724/kodak-2383-film-look (MIT) and scenario-labs/skills scenario-video-color-grade (MIT): halation definition and show-LUT idea, via the research summary; paraphrased.
- The user's own skills: cinematic-pipeline STYLE_PREFIX_GUIDE (12-pillar skeleton, lock and drift prompts) and seedance-2-5-prompts (ByteDance's formula and bracket channels).
- Official sources checked 2026-10-30: OpenAI image-generation guide (developers.openai.com); ai.google.dev image-generation page (Nano Banana 2.1 / Pro reference limits, 2.1 thinking levels); updates.midjourney.com and docs.midjourney.com Edit Model (up to 4 references, V8.1/8.2); ARRI news pages (Blade Runner 2049, Parasite). Higgsfield MCP, read 2026-11-01: `models_explore get` for `seedance_2_5`, `gpt_image_2_5`, `nano_banana_pro` and `nano_banana_2_1`, and the `generate_image`, `generate_video`, project and job tool descriptions; Seedance credit rates measured with `get_cost` (05). Third-party, flagged in the table: Evolink V8.2 API manual and tech-insider V8.2 guide (Midjourney parameters).
- `scripts/measure_frames.py`: original code for this pipeline.
