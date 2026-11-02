# 02 — Style Prefix: Lock the Film Look (Step 2)

**Purpose.** Turn the user's reference film title and/or frames into a verified, measured look for their own film: real production facts, observed evidence, a day-1 engine shoot-out across the image models the studied Higgsfield films used, and per-sequence variants (reality vs the 2nd Life dream). Then freeze that look as one versioned text block that every later prompt pastes verbatim.
**Output.** One frozen, versioned look block (`LOOK vX.Y`: master prefix, variants, one colour-rule line per variant), the engine shoot-out board with the winning engine per job, mechanical adapters for the routed Higgsfield image models (GPT Image 2.5 Sunburst and GPT Image 2, Nano Banana Pro, Seedream 5.0 Pro, Soul Cinematic) and for Seedance 2.5, approved hero look frames, a Seedance look test, BROADCAST/archive and black-and-white rules where the script needs them, and a style-lock card. A Midjourney V8.2 card is optional (the user runs it by hand, only when they ask) and is no longer a default deliverable (decision 2026-11-02).
**Rule.** No asset in 03-assets-images.md and no prompt in 05-seedance-production.md is written before the Step 2 Gate passes. The only exception is the D1 route tests (00 §0.8, 03 §3.4), which test routes, not the look, and are never reused as look references. Calendar slot: exploration and shoot-out on D2, lock on D3 (00-award-brief-and-calendar.md §0.7).
**Pilot (decision 2026-11-02).** `LOOK v1.0`, locked at the Step 2 Gate, goes into the **two-scene pilot** (SKILL.md): after the script and the style are locked and the assets of those two scenes are approved, Claude produces two full scenes end to end with the final method and runs the open tests (2.13). Calibrations inside the pilot bump the version (v1.1, v1.2…). When the user approves both pilot scenes, the version they were made with is frozen as the **production look**, and the whole film is produced on exactly that basis: the same look block, adapters, engine per job, settings and references. "Pilot" here names an internal production test only, never the film (00 F8).
**Route (decisions 2026-11-01 and 2026-11-02).** Every look frame, every shoot-out still and every Seedance 2.5 look test runs in Higgsfield: through the MCP, or by the user's hand in the Higgsfield web app inside the film's project (2.8). Each image model is used for the job it did best in the studied films (2.7 routing table). Midjourney is optional and manual.

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
| The two pilot scenes | SKILL.md (two-scene pilot), chosen from the locked script | when known; shoot-out stills and look frames prefer their places and light, so the hero frames feed the pilot directly |
| Frame decision (D-9) | full 16:9, or a letterbox cut in post inside the 16:9 master (2.1 step 4) | before D7 |
| Generator access | Higgsfield MCP with `generate_image`, `generate_video`, `models_explore` and the project tools visible (if only game-publishing tools appear, the user reconnects the connector in claude.ai settings; meanwhile they may run the cards by hand in the Higgsfield web app, otherwise wait); the routed image models answer `models_explore get` (`soul_cinematic`, `seedream_v5_pro`, `nano_banana_pro`, `gpt_image_2_5`, `gpt_image_2`); the film's Higgsfield project with its `00_STYLE` folder (ledger L.0b); Midjourney web only if the user wants the optional card | check on D2 morning |

---

## Hard rules (every sub-step)

1. **Reference frames are evidence, never inputs.** Never upload a frame, still, poster, trailer or clip from the reference film, or any image the user does not own, to any generator. That covers `--sref`, Midjourney image prompts and Edit-model references, GPT Image / Nano Banana references and any Higgsfield upload (`media_upload`, reference elements), and Seedance `@Image` / `@Video`. Claude views them for analysis only. Add `films/*/02-style/reference-frames/` to `.gitignore` before the first upload.
2. **No names in prompts (decision D-11, 2026-11-02).** Never put the reference film's title, its director, DP, actors, characters, or any camera, lens or stock brand or model in a generation prompt. Those names belong in the Look Bible only (2.4). Why: Terms cl. 6.1(d), 7.5 and 9.2(j) (00 R2); Higgsfield's official rule for Seedance block prompts bans director, signature-work and equipment names; and Midjourney is a defendant in studio copyright suits. The ban stays although several studied films wrote such names into prompts (The Breach "Kodak 2383", "ARRI Alexa 65"; SÉKOU "Kodak Vision3 500T"; HUNGER "Cooke S4/i"): write the visible effect instead ("warm print contrast with soft highlight roll-off", not the stock). Names that reach a prompt as handles (Elements, asset IDs, the look tag) are neutral codes that would be harmless as on-screen text: TOKYO 4:17's Element `red-mirror` was painted onto a street sign (03 and ledger L.1 own the naming).
3. **No real people.** No actor's face as a reference, no "looks like <person>", no lookalike (00 R1, G2).
4. **Transfer mechanisms, not identity.** Take the light logic, colour roles, lens tendency and texture. Leave out signature production design, costumes, logos, iconic compositions and shot-for-shot recreations. The same holds for the 12 Higgsfield films studied on 2026-11-02 (`prompt-library/studies/`): we take their method (how they froze a look, ran a shoot-out, designed values for black-and-white, treated in-world recordings), never their characters, designs, signature palettes, compositions or stories.
5. **Evidence discipline.** Quoted from ajinnaaa/extract-visual-style-2 (MIT):
   > "Never infer a specific camera, lens model, sensor, stock, LUT, software, or production method from appearance alone. Verify production facts or describe only the visible effect."
6. **Parameters are job settings.** Aspect ratio, resolution, duration, frame rate and quality never appear in prompt prose. "8K", "IMAX", "16:9" and "24fps" written in the text set nothing.
7. **Declarations, not blacklists (decision D-6, 2026-11-02).** Every line states the state that must hold. Short lock tails inside a declaration ("photographed, never rendered"; "No music. No subtitles.") are fine. Comma-list `negative:` / `NEGATIVE:` / `AVOID:` blocks stay banned in Seedance prompts: Seedance has no negative-embedding channel and parses them as scene content (≥7/12 studied films used such a block anyway; none showed it was needed). An image prompt may close on one short "No …" sentence of at most six concrete, visible items, built from the failure last seen (2.8 calibration), never a stock list. **Pilot test T-E** (2.13): up to about five concrete "<visible failure> = a failed take" sentences per Seedance prompt, the form THREAD, In Passing and Buzkashi used (THREAD 85% of prompts, In Passing 874/886, Buzkashi 410 times). Until the user approves the pilot result, production prompts carry none of these sentences.
8. **Seedance bracket channels.** In Seedance 2.5, `()` is music, `<>` is SFX, `{}` is dialogue and `【】` is subtitles (official guide, as transcribed in the user's seedance-2-5-prompts skill). The Seedance style block contains none of these characters, so "47° (50mm)" becomes "about a 47-degree field of view".
9. **One frozen look block, pasted verbatim.** After the lock, the compiled block for the shot's variant (2.6–2.7) is pasted byte-identical into every image prompt that carries the look and every Seedance prompt; the pre-submit check compares its sha256 with the block on file. Never re-word it per shot, per scene or per engine: the adapters are compiled once from the master and frozen under the same version. Only the shot's own content changes per shot: action, the scene's practical sources in the scene paragraph, the camera sentence and the audio. An override of a block line replaces that whole line and is logged (2.12). Why: 11/12 studied films pasted one fixed look text (The Breach "Underexposed one stop, crushed blacks with detail" in 411/514 Seedance prompts; SÉKOU one identical `[VISUAL STYLE]` paragraph in 13/13; THREAD a LOOK LOCK block in 177/214).
10. **Banned quality words (decision D-12, 2026-11-02, a house caution).** No "cinematic" as a quality word, "masterpiece", "breathtaking", "stunning", "mesmerizing", "seamless", "epic", "8K", "IMAX", "hyperrealistic", and no "photorealistic" on faces (05 carries the same list). The studies show these words without recorded harm and without a shown benefit (The Breach "8K detail" in 241 prompts; HUNGER "hyperrealistic live-action documentary footage"; 7 films "photorealistic" on faces), so they stay out: one medium anchor ("photographed live-action, never rendered") does the job.

---

## Procedure

### 2.1 Intake (D2, first hour)

1. Ask in Arabic: which film or films, and what exactly they love in each (light, colour, camera movement, texture, composition, a specific scene's mood). Also ask which part of their film it is for: reality, dream, or both.
2. Ask for 6–12 stills per reference film, taken from their own legally obtained copy, or one short clip. Name the variety you need: day exterior, night exterior, day interior, night interior, a wide, a close-up with skin, a practical-lit shot, and a moving shot if a clip is available.
3. Pull the sequence list from the locked script (01). For each sequence record world (reality / dream / broadcast), location, time of day, and emotional function.
4. Copy the production locks from 00. Ask whether a scope matte is wanted (decision D-9). Recommend **full-frame 16:9 with no matte**: a 2.39:1 matte inside 1920×1080 leaves about 1920×804 active picture, which is a needless risk against the "≥1080p" rule (00 F4). If the user still wants a scope look, the studied route is a letterbox cut in post inside the 16:9 master (The Breach, Buzkashi, UNPROMPTED; TOKYO 4:17 cropped to 2.34 in post): every generation stays 16:9 with no letterbox baked in, every prompt composes for the central band (05's crop-safe sentence), and 07 cuts the window. Decide before D7 and record it (2.9). Generation ratio for every still and every shot either way: `aspect_ratio: "16:9"`, set as a parameter (SÉKOU got square images from ratio words alone).
5. Create `films/<id>/02-style/` with `reference-frames/` (git-ignored), `look-frames/` (sidecar text only), `prefix/` and `look-bible.md`. The look-frame images themselves live in the Higgsfield project's `00_STYLE` folder and the Drive `00_STYLE/` (ledger L.0b), never in the repo. If `00_STYLE` is missing in Higgsfield, create it with `create_folder` after the user's yes (not idempotent: never re-run it after a timeout; check first, never invent a folder ID).
6. **If the user gives no reference at all:** build three PROPOSED directions from the rubric map. Each gets one paragraph and one look-dev still that enters the engine shoot-out (2.8 step 2). The user picks one direction and its winning engine, then continue from 2.4.
7. **Pilot scenes.** As soon as the script is locked, ask which two scenes form the two-scene pilot (SKILL.md), or propose two that cover the hardest look conditions (ideally one reality variant and the DREAM). Set the shoot-out stills and hero look frames in their places and light.

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
| R-DAY | streets, bus, metro walkway, workshop, Kabir | hard high sun at 5600K from above and behind camera left; short crisp shadows; dust haze visible at 30 metres; heat shimmer over asphalt | pale ochre dust and concrete #C9B79C; shadows fall to cool slate #2E3640; sun-bleached, saturation held low except skin | handheld operator sentence (2.6) at body height, gentle breathing drift |
| R-INT | shared room, washrooms, booth shop | one cool overhead fluorescent tube at 4000K plus one warm 3200K practical in frame; fast falloff to the walls; haze 10% | cool greenish walls, warm pool around the practical; deep shadows keep detail | handheld operator sentence, close, slower drift |
| DREAM | every 2nd Life sequence | soft, shadowless light at 6500K from no visible source; every surface evenly exposed; air perfectly clear | richer saturation, pure whites, spotless polished surfaces; slightly too perfect | locked-off frames or perfectly smooth glides; exact symmetry; no operator sentence: the impossibly steady camera is one of the two axes that separate the dream |
| BROADCAST | Noah's stage feed seen in the lens HUD | bright, even, high-key stage light at 5600K; soft frontal key, clean rim | neutral whites, glossy dark stage floor | the venue's fixed house cameras: locked broadcast framing, slow motorised push-ins (recording rules below) |
| FINALE | Food+ montage → mother's arrival → wedding | low warm sun at 3500K behind the subjects, long shadows, soft natural flare | warm golden highlights; saturation one step above R-DAY | handheld operator sentence, steadied, calmer than R-DAY |

Each handheld reality variant file also carries the locked CAMERA form (2.6) for its locked shots; choosing one of the two forms is not an override.

The four reality variants (R-DAY, R-INT, BROADCAST, FINALE) end their LIGHT line with the same tail: "every light has a visible or implied source; faces sit about one stop under the brightest part of the background." DREAM never carries it.
TEXTURE lines: R-DAY and R-INT "skin carries heat sweat; cotton shows fading and wear; metal shows fine scratches"; DREAM "every surface is spotless and polished; fabrics are crisp and new". BROADCAST and FINALE add none.
DREAM also carries `PHYSICS EXCEPTION: only [the scripted impossible event] breaks physics; everything else keeps real weight.` Name the event per shot and log it in ledger-continuity-physics.md.
Add a variant only when the locked script needs a condition these five do not cover (for example R-NIGHT for a night exterior; the night room scene S11 stays R-INT). 07 builds one grade layer per variant.

**Reserved looks.** One saturated accent belongs to one story element: here, the assistant ring-light green #3BD16F, seen only on assistant devices. Golden hour is reserved for FINALE: no earlier sequence uses low warm sun. Write these reservations in the Bible, never in the core: a prompt names the green only when an assistant device is in frame (05 adds it to that shot's content), because a colour named in a prompt tends to appear.

**Colour-rule line (one per variant, P02-2).** Every variant carries one COLOR RULE line that states the film's colour script as a rule, pasted with the variant in every prompt. SÉKOU wrote its motif rule ("The yellow scarf is the ONLY saturated warm object in any sea or underwater frame") into 10 of 13 Seedance prompts and reversed it on purpose in one scene; Fukushima reserved red for story objects. The line has two frozen forms, and the shot packet picks one (not an override):
```
COLOR RULE, owner in frame: The [owner]'s [accent hue] [light | object] is the only saturated [hue family] in frame; every other colour stays inside the [variant] palette.
COLOR RULE, owner absent: [the world's lead colour, e.g. skin] is the only saturated colour in frame.
```
The accent is always attached to its owner (an object or a light), never a bare colour, and the owner-absent form never names the accent hue. A planned reversal ("the scarf almost lost against the bright sand") or a removal after a story beat is a third form, written into the colour script below and frozen with the version. Film 01: R-DAY, R-INT, BROADCAST and FINALE use "Skin is the only saturated colour in frame." when no assistant device is in frame, and "The assistant device's green ring light is the only saturated green in frame; every other colour stays inside the [variant] palette." when one is; DREAM keeps "richer saturation", and its colour-rule line is written as "none" unless the script reserves a dream accent.

**BROADCAST and archive rules (P02-5).** For BROADCAST and any in-world recording a new script adds (archive footage, news, CCTV, phone or home video). Method from CONTROL's found-archive prologue (12 of its 25 archive jobs are in the film; "No film grain" in 18 of 25 prompts). Its fit to our BROADCAST variant is [INFERRED].
1. **Recording situation first.** The variant opens with a SOURCE line: who records it and why ("covered by the venue's fixed house cameras, recorded to be shown live on the feed"). Camera body behaviour, mounting and operator follow from that sentence. Iterate the treatment, not the subject: CONTROL found its tattoo-sequence look by changing only the treatment (cinema, then tripod stock footage, then handheld reportage).
2. **Treatment, not filter.** The CAMERA and TEXTURE lines describe that camera's behaviour, its available light ("available light only, and clearly so"), uncorrected colour and **one counted imperfection per shot**: one exposure correction, one focus hunt landing within half a second, or one late reframe; never more.
3. **Clean prompt, degrade in post.** The prompt asks for clean video ("video, not film; clean sharpness in the centre, slightly soft at the edges"). No grain, tape artefacts, scan lines, timecode or found-footage overlay in any prompt; softness, desaturation, the small brightness lift and the source's native ratio inside the film frame are added in 07 (archive degradation recipe, P07-4).
4. **Optics.** Field of view never above about 70 degrees: about 47 degrees for normal coverage, 29 for inserts; rectilinear, verticals stay straight; wider coverage only by standing farther away. CONTROL's 84-degree take bent its chamber into a fisheye.
5. **Handheld but level** when the source is handheld: the documentary feel comes from movement, not from tilt.
6. **Nobody acts.** People are recorded, not staged; nobody looks into the lens unless the situation is an interview (eyeline just off-lens to one side).
7. **No readable text, signage, logos, insignia, or any real broadcaster, channel or network identity** (00 G2). Any on-screen graphics or HUD text are made in post (07), never generated.
8. **Audio.** A numbered diegetic list; room tone continuous across cuts; no sound on the cuts; no music, no drone, no sustained tone (AUDIO line).
9. **G rating.** Only routine, non-violent situations: an assembly, a crowd at a gate, a stage show, an interview. No riots, injuries or weapons (CONTROL's intro had a riot and a water cannon; we take only the method).

**Black-and-white or near-monochrome sequences (conditional, P02-6).** Only if the script has one (a memory, bookends, a whole sequence). Method from Buzkashi (the whole film rendered in colour and converted in post) and Kimti (black-and-white bookends made in post); 0/12 studied films asked a model for black-and-white.
1. **Never write** black-and-white, B&W, monochrome, greyscale or "desaturated to grey" in any image or Seedance prompt. Render muted colour; 07 converts (B&W recipe, P07-3).
2. **Design values, not colours.** The Look Bible and the continuity bible (ledger L.6) give every character costume, prop and location surface a `Value in B&W` word: white, light grey, mid, dark or black. Two things that must separate on screen never share a value. The prompt carries the value as a colour word that holds it ("bone-white wrap", "near-black wool coat", "light grey, almost white horse") and repeats it in every prompt where the thing appears (Buzkashi: the bone-white chapan in 40 prompts, the black clothing in 31, the near-white horse in 45).
3. **One hierarchy sentence per shot:** "[X] stays the brightest thing in frame after the [window | sky band]."
4. **Light in values.** One stated white source per shot, plus backlight or a thin rim; shadows "dark and low-contrast but not pure black, shapes still readable"; dust or haze as tonal planes; outdoors a soft key (overcast, dusk, blue hour). A relight is a real change of light, not a colour filter.
5. **Colour discipline.** Muted and desaturated; no competing hues within one frame; warm only where the key falls. Hues of equal brightness merge into one grey after conversion.
6. **No grain, glow or bloom at generation**; grain once, in post.
7. **Image route.** Nano Banana Pro at 2k for value-designed stills, relights and keyframes (Buzkashi made all 1,725 of its stills there), Seedream 5.0 Pro for the same colour-with-values prompt. Never ask any model for black-and-white.
8. **Check before any video credit, with no model call.** Convert each keyframe locally with Buzkashi's measured curve and measure it (tested 2026-11-02):
   `ffmpeg -i kf.png -vf "colorchannelmixer=rr=.2126:rg=.7152:rb=.0722:gr=.2126:gg=.7152:gb=.0722:br=.2126:bg=.7152:bb=.0722,curves=master='0/0.04 0.15/0.12 0.3/0.24 0.45/0.36 0.6/0.44 0.75/0.54 0.9/0.62 1/0.72'" kf_bw.png`
   then `python3 -I scripts/measure_frames.py kf_bw.png`. Targets: luma p1 about 0.03–0.05, p50 near 0.18 (interiors darker, skies brighter), peak white about 0.70–0.80. If two important shapes merge into one grey, change the costume value or the light in the still, never in the grade.
9. The B&W variant has its own LIGHT, COLOR (written as values), CAMERA and colour-rule lines; the core stays untouched.

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
SOURCE: [BROADCAST and archive variants only: who records it and why, 2.5].
LIGHT: [source, direction from camera, Kelvin, shadow quality, haze % or metres] [+ reality tail, 2.5].
COLOR: [world palette: swatch role + hex attached to a surface or light, ×2–4].
COLOR RULE: [owner-in-frame form | owner-absent form, 2.5].
TEXTURE: [optional: only what differs by world].
CAMERA: [movement behaviour: the handheld or locked operator form below, or the variant's own].
PHYSICS EXCEPTION: [DREAM only].
```
Versions: v0.x while exploring on D2; the Gate locks v1.0; the two-scene pilot may bump it (v1.1, v1.2…); the pilot approval freezes the production look; every later change is a new version (2.12, 2.13).

**Operator CAMERA forms (P02-3).** Six studied films wrote the camera as a person (SÉKOU in 13/13 prompts: "the camera is a person physically present, it breathes, drifts and micro-adjusts; no smooth stabilised gimbal"; also The Breach, LEAK, Fukushima, HUNGER, CONTROL); Kimti wrote "static handheld" for its locked frames (30 of 43 prompts static or locked). Our two frozen forms, used by every handheld reality variant (DREAM keeps its own impossible camera; BROADCAST keeps its house cameras):
```
CAMERA, handheld: A handheld operator is physically present: the frame breathes, drifts and corrects a beat late; no gimbal smoothness, no zoom; every new framing is reached only by moving the camera.
CAMERA, locked: A locked frame with only a faint breathing sway; the subject moves inside the frame, and the frame never follows.
```

**The frozen look block.** At the lock, every variant compiles into one block per adapter (2.7): the core plus that variant, written once, never re-worded. Each block is stored in its `prefix/` file between a tag line and a blank line, and its sha256 goes on the style-lock card:
```
LOOK v1.0 · R-DAY
[the compiled block text, byte for byte]
```
The freeze date and the sha256 of tag line plus block are written on the style-lock card, not in the tag.
In **Seedance** prompts the tag line travels with the block as its first line (The Breach kept its look version in the prompt header of 470 of 514 Seedance jobs). In **image** prompts the tag line stays out of the prompt text, because the GPT Image and Nano Banana models render text readily; the version is written in the job's sidecar, the asset name and the ledger row. If any draft or still shows the tag, a hex value or a label as on-screen text, the tag moves to the sidecar and ledger only for that model; the block text is unchanged, so the version does not change.

Compile rules:
- Each line is a declaration. No banned quality words (hard rule 10). One style anchor plus one or two supporting tokens beats a long adjective list.
- No numbers that are job settings. Numbers that describe the world are wanted: Kelvin, haze %, metres, stops.
- No names of films, people or gear (hard rule 2). No `()`, `<>`, `{}`, `【】` anywhere.
- Hex values are never a bare list. Attach each to a surface or light source.
- Grain: references (identity sheets, neutral plates, props) never carry grain or vignette; prompts keep "clean capture with fine, even sensor texture"; grain is added once in post (2.9). SÉKOU's casting and sheet prompts said "no grain overlay" in 12 of 13; no studied film put grain on its reference sheets.
- Budget (house guidance, not a model limit): the master core may run to about 230 words because it is the full record. Compiled adapters are shorter: the Seedance "visuals feature" paragraph (core, variant and colour-rule line) stays at or under about 140 words, the optional Midjourney string at 30–50 words, and each variant at 30–50 words. The shot's own content keeps most of the prompt.

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
Save as `prefix/master.txt`, and each variant as `prefix/variant-<ID>.txt` (its rows from the 2.5 table plus the reality tail, the TEXTURE line, both colour-rule forms, both CAMERA forms where they apply, and the SOURCE line for recording variants). Also save `prefix/plate-safe.txt`: the medium anchor without location words ("Photographed with real optics and real materials.") plus the TEXTURE line. 03 puts it on identity sheets and neutral plates, which must carry no light, lens, grade or palette (until pilot test T-B says otherwise for plates, 2.13).

### 2.7 Model adapters (compiled mechanically from master.txt; never re-worded per shot)

**Verified parameter snapshot** (Higgsfield `models_explore` `action: get`, 2026-11-01 and 2026-11-02; image credits from `generate_image` with `get_cost: true` on 2026-11-02, per image at 16:9, nothing submitted; vendor facts 2026-10-30). Re-check anything older than 14 days before quoting it. Every job runs in Higgsfield (decisions 2026-11-01 and 2026-11-02); the BytePlus ModelArk API route exists but is not used.

| Model | Higgsfield id and params used here | Credits per image | Status |
|---|---|---|---|
| GPT Image 2.5 | `gpt_image_2_5`; `variant` `flare` (fast, default) · `sunburst` (precision, hero); `quality` `low·medium·high·xhigh·max` (default `low`); `resolution` `1k·2k·4k` (default `1k`); `background` `auto·opaque·transparent` (omit); `aspect_ratio` includes `16:9` and `21:9`; media role `image_references`. A bare call runs flare/low/1k, so set every field. Vendor fact: output above 2560×1440 is "experimental". Studies: Fukushima ran 289 Sunburst jobs (267 at max, 22 at high, all at 2k); UNPROMPTED 56 flare + 25 sunburst | sunburst max 4k 15 · max 2k 9 · high 2k 2.75 | VERIFIED 2026-11-02; OpenAI image-generation guide |
| GPT Image 2 | `gpt_image_2`; `resolution` `1k·2k·4k` (default `1k`); `quality` `low·medium·high` (default `low`); media role `image` (not `image_references`); aspects include `16:9`, `21:9`, `3:4`. Set both fields. Studies: SÉKOU made every still with it (77, its style anchor included); THREAD a shoot-out entrant; TOKYO 4:17's realism and re-sheet passes (10 of 13 at 4k) | 4k high 11 · 2k high 6.5 | VERIFIED 2026-11-02 |
| Nano Banana Pro | `nano_banana_pro`; `resolution` `1k·2k·4k` (default `2k`); ratios `1:1`…`21:9`, no `auto`; media role `image_references` only. Vendor: up to 6 objects, 5 characters and **3 style references** (14 total); on Higgsfield a style reference is an `image_references` item whose job the prompt states (adapter B). Studies: Buzkashi 1,725 stills (key-art winner, then keyframes, relights, edits), THREAD 190 | 2k 2 · 4k 4 | VERIFIED 2026-11-02; ai.google.dev |
| Seedream 5.0 Pro | `seedream_v5_pro`; `resolution` `1k·1.5k·2k` (default `2k`; no 4k); `width`/`height`; `remove_bg`; `is_inpaint`; media role `image_references`; aspects include `16:9`, `21:9`. Studies: the plate workhorse (Fukushima 2,031 jobs, UNPROMPTED 742, HUNGER 186, THREAD 122, CONTROL 111) | 2.5 (`count: 4` = 10) | VERIFIED 2026-11-02 |
| Soul Cinematic | `soul_cinematic` (web label "Soul Cinema"); `quality` `1.5k·2k` (default `2k`); `soul_id`; at most **1** image, media role `image`; aspects include `16:9`, `21:9`. Studies: UNPROMPTED 320, THREAD 275, The Breach 173 (123 location plates), TOKYO 4:17 152, Kimti 87 (all plates) | 0.12 (the web UI shows 1) | VERIFIED 2026-11-02 |
| Cinema Studio Image 2.5 · Soul Cinema Studio | `cinematic_studio_2_5`: `resolution` `1k·2k·4k` (default `1k`), media role `image`. `soul_cinema_studio`: `style_id` presets. Low evidence (The Breach's doctrine run only): optional shoot-out entrants. A preset name is logged, never written into a prompt | Cinema Studio 4k 4 · Soul Cinema Studio: quote first | VERIFIED `cinematic_studio_2_5` 2026-11-02; `soul_cinema_studio` from the routing study, re-check before use |
| Nano Banana 2 · 2.1 | `nano_banana_2` = **Nano Banana 2** ("Fast, next-gen"), a live model, not deprecated: `resolution` `1k·2k·4k`, `is_inpaint` + `mask`, `auto` aspect. `nano_banana_2_1`: `resolution` `1k·2k·4k`, `thinking_level`, `seed`, `is_inpaint` + `mask`, `video_references`; vendor: up to 14 references, no style slot. Neither is a shoot-out entrant; masked edits with them are a pilot test owned by 03 (Nano Banana 2.1 appears in no study) | NB2 2k 2 · NB 2.1 2k 2, 4k 3 | VERIFIED 2026-11-02 |
| Model-ID trap | The studies' raw job types differ from the MCP ids: raw `nano_banana_2` is what Higgsfield's web UI labels **Nano Banana Pro** → MCP `nano_banana_pro`; raw `nano_banana_flash` is Nano Banana 2 → MCP `nano_banana_2`. Never copy a model id from a study; take it from this table or `models_explore` | — | VERIFIED 2026-11-02 |
| Midjourney V8.2 (optional, manual) | default model; Edit Model replaces Omni Reference with up to 4 image references; `--cref`/`--oref` do not run on V8.2 | the user's plan | VERIFIED, updates.midjourney.com (27 Aug 2026) |
| Midjourney params | `--sref` (URLs or codes; must have a text prompt), `--sw 0–1000` (default 100), `--raw`, `--s 0–1000` (default 100), `--ar` whole numbers only, `--no`, `--hd` (2K, more GPU time). Leave `--sv` (V8.2 accepts only 6) at default; never emit `--q` (house rule shared with 03) | — | third-party V8.2 guides (Evolink API manual, tech-insider, 2026-10-30); official docs returned 403 → confirm in the web UI |
| Seedance 2.5 | `seedance_2_5` via `generate_video`; `mode` `t2v·omni_reference·video_edit·video_extension`; `duration` 4–30 whole seconds; `resolution` `480p·720p·1080p` (default `720p`); `aspect_ratio` `auto·21:9·16:9·4:3·1:1·3:4·9:16`; `generate_audio` (default true); `bitrate_mode` `standard·high`; `draft: true` = a 480p draft, finalized at 1080p with `draft_job_id` within 7 days; media roles `start_image`, `end_image`, `image_references`, `video_references`, `audio_references`; `folder_id`; no fps field (output 24 fps per ByteDance docs; 05 confirms on the first file) | draft 3 cr/s · 1080p 16 cr/s | VERIFIED, `models_explore` 2026-11-01 |
| Cost | `get_cost: true` returns credits and submits nothing (`generate_image`, `generate_video`; not inside a batch). References and `bitrate_mode` do not change the Seedance price | — | TESTED with `get_cost` (05; images 2026-11-02) |

**Image-model routing for look work** (decision 2026-11-02: each model does the job it did best in the studied films; 03 owns the full asset routing, including Soul Cast casting and Soul Location scouting):

| Look job | Primary | Alternative | Evidence |
|---|---|---|---|
| Look-dev shoot-out (2.8 step 2) | every entrant in the shoot-out table | — | 5/12 ran an early shoot-out, then committed (THREAD, The Breach, UNPROMPTED, Buzkashi, HUNGER) |
| Hero look frame per variant | the shoot-out winner, at its best size (adapter A, B, E or F) | the runner-up engine | THREAD: shoot-out winners became the world references |
| Graded location plate (only pilot test T-B, or after T-B approves graded plates) | `nano_banana_pro` 2k relight of the approved master: "keep everything exactly the same, only the light and colour change" + the variant LIGHT and COLOR lines | `seedream_v5_pro` edit of the master, or the plate re-made on the winning plate engine with core + variant | Buzkashi 93 relight-only edits; CONTROL relit plates to night in Seedream; 7/12 baked the look into plates |
| Black-and-white value design | `nano_banana_pro` 2k, muted colour with value words | `seedream_v5_pro`, same prompt | Buzkashi; 0/12 asked a model for B&W |
| Final still upscale (poster, key art) | `upscale_image` (bytedance, 4k) | re-run the winner at 4k on its own model (NB Pro 4k, Sunburst 4k) | no studied film upscaled a still in Higgsfield; look frames need none |

**A. GPT Image 2.5 Sunburst and GPT Image 2** (shoot-out entrants, hero look frames, precise or text-sensitive look edits). Route: Higgsfield `generate_image`, `model: "gpt_image_2_5"` or `"gpt_image_2"`, `folder_id` = the `00_STYLE` folder; or the user runs the card by hand in the Higgsfield web app inside the same project (2.8 step 2). Both models take the same card.
```
Intended use: look-development still for a live-action short film. It becomes the style reference for every later image, so light, colour and texture must be exact.
Scene: [SCENE CONTENT: place, time, weather, what is in frame]
Subject: [synthetic people only, or "no people"]
Look: [the frozen GPT Image block for this variant, verbatim (2.6): master CAPTURE, LIGHT LAW, COLOR, TEXTURE lines, variant LIGHT, COLOR, COLOR RULE, TEXTURE lines, variant CAMERA line as a still, e.g. "slightly off-level handheld framing"]
Constraints: one single photographic frame; no text, no logos, no watermark, no borders.
```
Settings, GPT Image 2.5: shoot-out and hero frames use `variant: "sunburst"`, `quality: "max"`, `resolution: "4k"`, `aspect_ratio: "16:9"` (4K sits in OpenAI's experimental band; fall back to `"2k"` if a take shows artefacts); precise or text-sensitive look edits use Sunburst `max` at `"2k"` (Fukushima's setting for 267 of its 289 Sunburst jobs); quick exploration uses `flare`, quality `high`, `"2k"`. Settings, GPT Image 2: `resolution: "4k"`, `quality: "high"`, `aspect_ratio: "16:9"`; its media role is `image`. Set every field on every call. "Real photograph" and "photographed, never rendered" phrasing follows the OpenAI cookbook; "photorealistic" stays out (hard rule 10). Edits: the frame to edit goes in as a reference by its Higgsfield job ID; "Keep everything exactly as it is. Change only: X. Preserve: everything else, identical." Repeat the preserve list every turn.

**B. Nano Banana Pro** (shoot-out entrant; relights, keyframes, one-change look edits, black-and-white value design). Write natural prose, not labelled lines. Describe lens effects in words, because third-party tests report that Nano Banana ignores mm and f-numbers (smixs/visual-skills).
```
A photographed live-action film frame: [SCENE CONTENT]. [variant LIGHT as one sentence]. Wide, undistorted perspective with straight verticals; the background softly out of focus but readable. [COLOR line as one sentence, colours attached to surfaces]. [COLOR RULE line]. [TEXTURE line]. Natural contrast with soft highlight roll-off and dense, detailed blacks, no HDR look. A single composition with no text.
```
The prose above is compiled once per variant and frozen as `prefix/nano-banana.txt` (2.6); only [SCENE CONTENT] changes. After the lock, attach 1–3 approved hero look frames of the same variant as `image_references` by their Higgsfield job IDs, labelled "Images 1–N are style references: take only their light quality, colour palette and surface texture; ignore their objects, people and layout." Relight edits write light as real light in values, never as a filter: "Keep everything exactly the same; only the light changes: [variant LIGHT]; dark and low-contrast but not pure black, shapes still readable." (Buzkashi: 93 relight-only edits made its look). Settings: `model: "nano_banana_pro"`, `aspect_ratio: "16:9"`, `resolution: "4k"` in the shoot-out and for any frame that may become a reference, `"2k"` for relights and edits (2 credits). Nano Banana 2 and 2.1 are not used for look work (snapshot table). Never strip SynthID or C2PA data (Terms 5.6).

**C. Midjourney V8.2 (optional; the user runs these by hand, only when they ask).** Not a default deliverable and not a shoot-out entrant by default (decision 2026-11-02). A Midjourney frame enters the pipeline only after the user uploads it to the film's Higgsfield project and it is logged like any other still. Condense the master into one sentence-style string of 30–50 words, subject first, look after it, and parameters last with nothing after them.
```
Photographed live-action film still. [SCENE CONTENT]. Hard high sun from above and behind camera left, short crisp shadows, dust haze in the far distance, pale ochre concrete, cool slate shadows, natural warm brown skin with pores and sweat, wide undistorted perspective with straight verticals, moderate depth of field, fine even sensor texture --v 8.2 --raw --ar 16:9 --sref [R-DAY hero frame URL] --sw 100
```
The suffix matches 03's default (`--v 8.2 --raw --ar 16:9`). `--s` stays at default; A/B 50 / 100 / 250 only under a fixed `--seed`, one change at a time.

`--sref` rules for this project:
1. Source: only the project's own approved hero look frame (a Higgsfield output from any routed model, or a Midjourney output, uploaded to Midjourney), or a numeric code found with `--draft --sref random` exploration. Never a reference-film still, poster or any image the user does not own.
2. One sref per variant. The R-DAY sref never goes on a DREAM prompt: an sref carries palette and light quality strongly, so a night sref darkens a day prompt.
3. `--sw`: start at 100; the working range is 50–300 (PROPOSED; 03 uses 100–300 for location frames). Above that, the sref starts overriding scene content.
4. `--sref` carries look only, never identity. Characters, props and locations go through Edit Model references (up to 4) in 03-assets-images.md.
5. Keep Personalization off (the web toggle silently adds `--p`) unless its profile code is logged. Never combine a moodboard with `--sw`/`--sv` (03's rule; the conflict itself is unverified).
6. Run every Midjourney job in Stealth mode (Pro or Mega plan). Without it, look frames and uploaded hero frames are public on midjourney.com, which can breach the Summit holdback (03 ground rule 7).
7. When editing or inpainting a frame, reuse the same `--sref` so inserted elements keep the look.
8. Use `--no` only for concrete objects; its words are parsed one by one. Use `--hd` only on approved frames.
9. Log the sref URL or code, `--sw`, `--s`, version and seed in the ledger.

**D. Seedance 2.5** (final picture). 05-seedance-production.md uses ByteDance's formula (Subject + Action + Scene → Visual style → Camera → Audio). This module supplies three fixed blocks; the first is the frozen look block for the shot's variant, tag line included (2.6):
```
[SCENE PARAGRAPH from 05]
LOOK v[X.Y] · [VARIANT]
The visuals feature [MEDIUM] [CAPTURE] [LIGHT LAW] [COLOR] [TEXTURE] [PHYSICS] [PERFORMANCE] [variant SOURCE, recording variants only] [variant LIGHT] [variant COLOR] [variant COLOR RULE] [variant TEXTURE] [PHYSICS EXCEPTION, DREAM only].
[CAMERA from 05: shot size, angle, movement, field of view as "about a 47-degree field of view"; variant CAMERA form appended]
[CONTINUITY line]
Audio includes [shot SFX from 05]. [AUDIO line]
```
Labels such as "MEDIUM:" are dropped and each line becomes a sentence. Every `[SLOT]` is replaced before submission. The per-shot field of view lives only in the camera sentence. The tag line and the "visuals feature" paragraph are pasted byte for byte from `prefix/seedance.txt`; the colour-rule line uses the form the shot packet picked. 05 owns the final assembly (reference roles, dialogue, parameters) and may move blocks, but never edits their text.
Worked example (R-DAY, no assistant device in frame; the "visuals feature" paragraph is 134 words, inside the 140 budget):
```
Miraj, [his locked one-line description from 03-assets-images.md], in a sweat-darkened grey work shirt, edges down the crowded bus aisle and grips the overhead rail as the bus brakes.
LOOK v1.0 · R-DAY
The visuals feature photographed live-action drama with real optics and real materials; every frame reads as filmed on location, never rendered. Large-sensor feel with spherical lenses, wide undistorted perspective, moderate depth of field, 180-degree shutter motion blur, clean capture with fine, even sensor texture. Highlights roll off softly and never clip on skin; blacks are dense but keep detail. Skin tones stay natural, never orange or waxy, with pores and fine vellus hair. Gravity and inertia respected. Naturalistic, restrained performance. Hard high sun at 5600K enters the windows from camera left; short crisp shadows; dust haze; every light has a visible source. Pale ochre dust and concrete #C9B79C, cool slate shadows #2E3640, saturation held low except skin. Skin is the only saturated colour in frame. Heat sweat on skin; cotton shows fading and wear.
Use a handheld medium shot from behind Miraj at about a 47-degree field of view, at body height with gentle breathing drift. A handheld operator is physically present: the frame breathes, drifts and corrects a beat late; no gimbal smoothness, no zoom; every new framing is reached only by moving the camera.
Characters, wardrobe, props and environments stay identical to their references across every cut; no identity drift.
Audio includes the diesel idle, a brake hiss and passengers murmuring. Diegetic sound effects and ambience; dialogue only where the shot scripts it. No music, no background music, no score. No subtitles.
```
Rules: set `aspect_ratio: "16:9"`, `resolution` (or `draft: true`) and `duration` as job parameters on Higgsfield `generate_video`, never in prose. **Current rule, kept until pilot test T-B is approved (decision D-2):** plates stay neutral and look frames are not Seedance references by default (03 §3.1.6 step 6); the look travels as text. Only if two calibration rounds (2.8) fail to hold the look in drafts, and with the user's OK, test one face-free hero frame on a single draft (`mode: "omni_reference"`, the frame's Higgsfield job ID as `image_references`; same credits as without it) as "@Image N defines only the colour grade, light quality and surface texture. Do not use its objects, layout or people." (SÉKOU's one "grade slot" per prompt, in 8 of 13 jobs). Log it, and keep it only if the draft improves. Never put a face in it: ByteDance's Seedance filter rejects realistic faces in references, and faces enter only through the route T1 proved on Higgsfield (03 §3.3–3.4; 05). No "= a failed take" sentences outside pilot test T-E (hard rule 7). Check the first drafts for the tag line, hex codes or labels rendered as on-screen text. If hex values appear, drop them from the Seedance block only and keep the colour words; if the tag appears, it moves to the job name, sidecar and ledger (2.6).

**E. Seedream 5.0 Pro** (shoot-out entrant; location plates and their edits, the same colour-with-values prompt for black-and-white). Plain declarative prose, scene first, then the look appended as one closing paragraph: HUNGER put its VISUAL STYLE BLOCK "at the end of every prompt" on 29 plate prompts, and UNPROMPTED closed 967 of its 1,194 stills with one fixed film-still suffix.
```
A photographed live-action film still. [SCENE CONTENT: place, time, weather, what is in frame, in reading order with distances in metres]. [synthetic people only, or "No people."]
Visual style: [the frozen Seedream block for this variant, verbatim: the master and variant lines as sentences, colour-rule line included].
One single photographic frame; no text, no logos, no watermark, no borders.
```
Settings: `model: "seedream_v5_pro"`, `resolution: "2k"` (its maximum), `aspect_ratio: "16:9"` (`"21:9"` only for a wide master plate, as THREAD made its rooms), `count: 4` in the shoot-out and for plates; edits of an approved image take it as `image_references` with "Keep everything exactly the same; change only …" (`is_inpaint: true` only for a local fix). 2.5 credits per image.

**F. Soul Cinematic** (shoot-out entrant; cheap look scouting, a plate engine when it wins). One rich "film still" paragraph in the order of the prompt-library "Look-dev still" template: THREAD ran the same 300–550-word film-still prompt on Soul Cinematic and three other engines, and its winners became the world references; Kimti and The Breach made their plates here. Do not write "cinematic" in the text (hard rule 10); the model carries that register itself.
```
Film still from a live-action drama. [SCENE CONTENT]. [the frozen Soul Cinematic block for this variant, verbatim, as flowing sentences]. No people. No text.
```
Settings: `model: "soul_cinematic"`, `quality: "2k"`, `aspect_ratio: "16:9"`; at most one image (`image` role), used only for an approved plate or hero frame of our own. 0.12 credits per image, so run 4 takes. A Soul Cinematic winner is kept at its own 2K size (2K plates reached TOKYO 4:17's and Fukushima's films as references); for a frame that must become a 4K reference, re-make it on Nano Banana Pro 4k as an edit. **Cinema Studio Image 2.5** (`cinematic_studio_2_5`, `resolution: "4k"`) takes the same card when the user adds it as an extra entrant.

### 2.8 Engine shoot-out, look frames, Seedance look test and calibration (D2 → D3)

1. **Quote cost first.** Higgsfield has no spend cap (05). Preflight each distinct request with `get_cost: true` (nothing is submitted; a batch item cannot preflight, so price one item and multiply), state the job count and credits, and get the user's yes per batch. Image prices are in the 2.7 snapshot. Seedance look-test drafts cost 3 credits/s on the user's account: 24–30 credits for 8–10 s (≈ $1.07–1.50). Leave `use_unlim` unset; if the tool returns `unlim_choice`, ask the user which balance pays. Never repeat a call to "retry": after a timeout, check the returned job ID with `jobs_wait` first.
2. **Engine shoot-out (D2, before the Gate; P02-1).** 5 of the 12 studied films ran an early cross-engine shoot-out and then committed (The Breach: 532 jobs over two days across about seven engines, its doctrine rewritten three times before it froze; THREAD: one film-still prompt on four engines; UNPROMPTED: day-1 world tests; Buzkashi: one key-art prompt on four engines; HUNGER: a casting and keyframe bake-off). 11/12 then pasted one frozen look text. Our protocol:
   - Write **one look-dev still per variant** from the draft prefix (v0.x), in the order of `prompt-library/style.md` "Look-dev still", face-free (environment, back-of-head or silhouetted figures; characters are not locked until 03), set in a place from the pilot scenes when they are known. Compile it through each engine's adapter (2.7) without re-wording the look: the same scene, the same look sentences, `aspect_ratio: "16:9"` on every engine (the generation frame under either D-9 choice), no image references, so the comparison is fair.
   - Run it on every entrant, all with `folder_id` = `00_STYLE`; independent prompts go in one `generate_image_batch` (≤ 12), then `jobs_wait` and one `show_generation_by_ids` for the board:

| Entrant | Higgsfield call | Takes | Credits each | Why it is in |
|---|---|---|---|---|
| Soul Cinematic | `soul_cinematic`, `quality: "2k"` (adapter F) | 4 | 0.12 | THREAD entrant (275 Soul Cinematic stills); Kimti's and The Breach's plates; UNPROMPTED's day-1 world tests |
| Seedream 5.0 Pro | `seedream_v5_pro`, `resolution: "2k"`, `count: 4` (adapter E) | 4 | 2.5 | plate workhorse of Fukushima, UNPROMPTED, HUNGER, CONTROL; THREAD and HUNGER entrant |
| Nano Banana Pro | `nano_banana_pro`, `resolution: "4k"` (adapter B) | 4 | 4 | THREAD entrant; Buzkashi's key-art winner, then all 1,725 of its stills |
| GPT Image 2.5 Sunburst | `gpt_image_2_5`, `variant: "sunburst"`, `quality: "max"`, `resolution: "4k"` (adapter A) | 2 | 15 | Fukushima's precision engine (289 Sunburst jobs); our hero default |
| GPT Image 2 | `gpt_image_2`, `resolution: "4k"`, `quality: "high"` (adapter A) | 2 | 11 | THREAD entrant; SÉKOU's style anchor and every SÉKOU still; beat Seedream on TOKYO 4:17's identical re-sheet prompt |
| optional: Cinema Studio Image 2.5 · Soul Cinema Studio | `cinematic_studio_2_5`, `resolution: "4k"` · `soul_cinema_studio` with a `style_id` | 2 | 4 · quote first | The Breach's doctrine run (low evidence); only if the user adds them |
| optional, manual: Midjourney V8.2 | card C, run by the user | — | the user's plan | only if the user asks |

   Budget per variant at these takes: 0.48 + 10 + 16 + 30 + 22 ≈ 78.5 credits; three variants ≈ 236 credits [ARITH]. Quote the real figure with `get_cost` first.
   - **Scoring.** Show the board grouped by variant (Output template B). The user scores every still 1–5 against the acceptance checklist (step 5); offer to hide the engine names until the scores are in. Claude adds the measured values (`scripts/measure_frames.py`) beside each still.
   - **What the winner decides.** The visible behaviours that won (whichever engine made them) are written as declarations into the core's CAPTURE, LIGHT LAW and TEXTURE lines and the variant lines; that text is frozen as `LOOK vX.Y` (2.6). The winning engine per job (look frames, plates, relights, keyframes) is recorded in `evidence/authorship/02-style-decisions.md` and handed to 03, where it confirms or replaces 03's default routing for this film. At most three shoot-out rounds, then lock: every later change bumps the version (2.12) and is logged with its reason.
3. **Hero look frames.** Per variant, take the best shoot-out still or make 2 more on the winning engine with the frozen block. Use face-free or back-of-head compositions where possible: characters are not locked until 03. A 2K winner stays at its size (no upscale for look frames). Download each kept original the moment it finishes, hash it with SHA-256 and file it in Drive `00_STYLE/`. Every shoot-out still is logged too, kept or not: the disclosure asks for the full generation history. Save each with a sidecar `<name>.json`: Higgsfield job ID, model, params, full prompt, LOOK version, route (`higgsfield-mcp` or `higgsfield-web`), account, folder and the SHA-256 of the downloaded original. **Frames the user makes by hand in the Higgsfield web app** (same project): read them back with `list_project_assets` (`workspace_id`, `project_id`, `folder_id`, `output_kinds: ["image"]`), `get_project_asset_prompt` (`placement_id`) for the exact prompt and `get_project_asset_source` for the file, and log them the same way.
4. **Seedance look test:** one 8–10 s draft for R-DAY and one for DREAM (or the film's two most different variants), with environment or back-of-head figures only, using the frozen Seedance block (adapter D): Higgsfield `generate_video`, `model: "seedance_2_5"`, `mode: "t2v"`, `draft: true` (480p), `aspect_ratio: "16:9"`, `generate_audio: true`, `folder_id` = `00_STYLE`. Download, hash and log each draft in the same turn: Higgsfield keeps a draft finalizable only for 7 days and is never the only copy. This is the only proof that the look survives in the final medium. An untested prefix is never called locked (ajinnaaa). The two-scene pilot is the full proof (2.13).
5. **Score every frame** against the acceptance checklist: every invariant visible; the variant matches its condition; in reality variants, light motivated and shadows consistent with one key direction (DREAM: shadowless, no visible source); the colour-rule line holds (the reserved accent only on its owner); skin natural (not plastic, not orange: at most two warm cues together); reads as photographed, not CGI; no text, logo, brand or real-person likeness; BROADCAST: one counted imperfection, straight verticals, no degradation baked in; B&W sequences: the hierarchy sentence holds after the local conversion (2.5).
6. **Calibrate** (ajinnaaa loop), one fix per round, at most three rounds before the D3 lock:

| Visible mismatch | Owning system | Faulty or missing rule | Replacement rule | Layer | Removed |
|---|---|---|---|---|---|
| dream frames show hard shadows | LIGHT (DREAM) | "soft light" too weak | "shadowless light from no visible source; every surface evenly exposed" | variant | "soft light" |

   Replace rules; never pile on negatives. Repair locally when the governing system is right and the failure is isolated. Regenerate when lighting logic, geometry or several systems are wrong. Each round re-compiles every adapter from the master in one pass, so the engines never drift apart.
7. Pick **one hero frame per variant**. These feed Nano Banana Pro style references, the graded plate of pilot test T-B (2.13), the show-LUT match in 07-edit-mix-finish.md, and the Midjourney `--sref` only if the user runs the optional card.

### 2.9 Decisions to record before the lock

- **Grain and halation:** PROPOSED default is to add them in post (07), uniformly, so drafts, 1080p finals and every model stay consistent. Prompts keep "clean capture with fine, even sensor texture". Halation, if used, is a post effect on true highlight edges only.
- **Frame (D-9):** full 16:9 with no matte (recommended, 2.1 step 4), or a letterbox cut in post inside the 16:9 master with crop-safe prompts; the user decides in writing before D7.
- **Grade intent for 07:** per variant, one line plus the hero frame. AI clips are display-referred Rec.709; never apply a log-to-709 LUT to them (calesthio). The show LUT is matched from hero frames in 07. One global grade per variant glues clips from different engines and days (The Breach, Kimti, LEAK, CONTROL and Buzkashi graded every clip in post).
- **Engine winners:** the shoot-out winner per look job (2.8 step 2), handed to 03.
- **Where the look lives (D-2):** current rule kept: neutral plates and sheets, look in the frozen text. Pilot test T-B decides whether production plates carry the graded look (2.13).
- **Failed-take sentences (D-6):** none in production prompts until pilot test T-E is approved (2.13).
- **Reserved accent and reserved looks:** owner named; the colour-rule line for every variant written in both forms (2.5).
- **BROADCAST / archive treatment** (if any recording variant exists): its SOURCE line, counted imperfection and field-of-view ceiling (2.5); degradation left to 07.
- **Black-and-white sequences** (if any): which sequences, the value word for every character, prop and location, and the hierarchy sentence per shot (2.5); conversion left to 07.
- **Dream physics exceptions:** listed per sequence.

### 2.10 Lock, save and log

Save `prefix/master.txt`, `prefix/variant-*.txt`, `prefix/plate-safe.txt`, and the frozen adapter files, each holding one tagged block per variant (2.6): `prefix/seedance.txt`, `prefix/gpt-image.txt` (GPT Image 2.5 and 2), `prefix/nano-banana.txt`, `prefix/seedream.txt`, `prefix/soul-cinematic.txt`, plus `prefix/midjourney.txt` only if the user uses the optional card. Also save `shootout.md` (the board: every still's engine, settings, job ID, the user's score and the winner per job), `style-lock-card.md` and `look-frames/`. Record the sha256 of every block on the style-lock card. Write the decisions and every rejected option, with the user's sign-off, to `evidence/authorship/02-style-decisions.md` (00 §0.11). Log every shoot-out still, look frame and look-test generation for the AI Disclosure (00 D1) as a ledger row: tool `Higgsfield`, model id (each routed model is a separate AI tool in the disclosure, with its version), route, account, plan, Higgsfield job ID, folder, credits and the SHA-256 of the downloaded original. The images go to Higgsfield and Drive `00_STYLE/`; the repo keeps the text files only.

### 2.11 Injection contract (every later step)

| Step | Receives | How it is injected |
|---|---|---|
| 03-assets-images.md | adapters A, B, E, F (frozen blocks), the shoot-out's winning engine per job, hero frames, `--sref` per variant only if the optional Midjourney card is used, value words for any B&W sequence | look frames and keyframes carry core + variant verbatim. **Character, prop and costume reference sheets and neutral location plates do not**: they get `prefix/plate-safe.txt` only, with neutral flat light on mid-grey, so the grade is not baked into identity assets; the look comes back in the scene prompt. Location plates stay neutral until pilot test T-B approves graded plates; character sheets stay neutral either way (10/12 studied films) |
| 04-blender-blocking.md | lens ladder (36 mm sensor width, focal lengths), camera behaviour per variant, 24 fps | camera and movement only; playblast look is excluded in Seedance by the blockout clause |
| 05-seedance-production.md | `prefix/seedance.txt` (tag line + block per variant) + variant ID per shot; both colour-rule forms; the CAMERA forms; reserved-accent wording | tag line and block verbatim in the visual-style slot (sha256 checked before submit); CONTINUITY and AUDIO lines verbatim; the colour-rule form the shot packet picks; the green #3BD16F is named only in shots with an assistant device in frame; shot overrides replace one line only |
| Two-scene pilot (SKILL.md) | `LOOK v1.0`, all frozen adapter files, the engine winners, pilot tests T-B and T-E (2.13) | the pilot runs on these unchanged; its calibrations bump the version; its approval freezes the production look (2.13) |
| 05b-acting-direction.md | PERFORMANCE line | 05b expands it per beat; it never contradicts the line |
| 06-music-and-sfx.md | AUDIO policy, colour-script sequence boundaries | no music in any Seedance prompt; cue map follows the colour script |
| 07-edit-mix-finish.md | grade intent, hero frames, palette, grain/halation and matte decisions, `scripts/measure_frames.py` | hero-shot match per scene, then show LUT, then grain |
| 08-judge-panel.md | invariants and colour script | Creativity & Aesthetic and Technical critique are checked against them |
| ledger-continuity-physics.md | LOOK version, variant ID, sref codes, model params, Higgsfield job ID and folder per asset | one row per asset and shot |

Every prompt Claude writes after the lock opens with an internal check: LOOK version correct, variant ID matches the colour script, the pasted block byte-identical to its block in `prefix/*.txt` (sha256), the colour-rule form matches whether the accent's owner is in frame, no banned word, no brand or gear name, no comma-list negatives, aspect set as a parameter.

### 2.12 Change control

- **Per-shot override:** replace one line in that prompt only, and log it. Apply the fold rule (2.5).
- **Change to the core or a variant:** bump the version (v1.0 → v1.1), list every asset and shot made under the old version, and ask the user which to regenerate.
- When the user asks for something that breaks the lock, say (carried over from the old pipeline): «ملاحظة: هذا التعديل يخالف الستايل المعتمد LOOK v1.0. هل نحدّث المرجع (نسخة جديدة) أم نطبّق التعديل على هذه اللقطة فقط؟»
- After the pilot approval (2.13), the production look is frozen: the core, a variant, a colour-rule line, an adapter, an engine routing or a setting changes only with the user's explicit approval and a re-render impact list. Every change is a new version; an old block is never edited in place.
- Step-8 judge notes come back through the calibration loop (2.8 step 6), never as appended adjectives.

### 2.13 The two-scene pilot: the look's part (after the Step 2 Gate and the pilot scenes' assets)

The two-scene pilot (SKILL.md) proves the whole method on two full scenes before the film is made: assets, blocking, Seedance drafts, 1080p finals, rough sound and grade. This module's part:

1. **Inputs.** `LOOK v1.0` and every frozen adapter file, the engine winners per job, the hero frames, the colour script for the two scenes. Nothing is re-worded for the pilot.
2. **Calibration inside the pilot.** A look failure seen in a pilot draft goes through the calibration loop (2.8 step 6): one fix per round, the version bumps (v1.1, v1.2…), every adapter is re-compiled in one pass, and the pilot shots already made under the old version are listed for the user (2.12).
3. **Pilot test T-B, where the look lives (decision D-2, P02-4).** 7 of the 12 studied films carried the look in graded location plates (Fukushima, Kimti, THREAD, LEAK, UNPROMPTED, HUNGER, Buzkashi); SÉKOU and TOKYO 4:17 kept their references neutral and carried the look in text (SÉKOU adding one grade slot). Method: take one approved pilot shot and render it twice with identical draft settings and text (Seedance has no seed, so if the pair is too close to call, add one more draft of each, with the user's yes): (a) the neutral master plate plus the frozen look text (our current rule); (b) a graded look plate of the same place, made from the approved master as a Nano Banana Pro 2k relight edit ("Keep everything exactly the same; only the light and colour change:" plus the variant LIGHT and COLOR lines; 2.7 routing), plus the same text. Compare both drafts at 2 fps (`ffmpeg -i draft.mp4 -vf fps=2 f_%03d.png`, then `measure_frames.py` against the hero frame) for skin, black level and grade stability across the take, and for identity. Cost: two drafts of the shot's length at 3 credits/s, plus 2 credits for the relight. **Pass:** the winner holds skin, blacks and grade at 2 fps. The user picks; the choice goes to `02-style-decisions.md` and to 03 (graded or neutral production plates). Until the user approves the result, the current rule stands everywhere outside the test.
4. **Pilot test T-E, failed-take sentences (decision D-6), run with 05.** The same draft with and without three to five concrete "<visible failure> = a failed take" sentences (for example "A second shadow direction on the floor = a failed take."). **Pass:** fewer of the named failures, no new artefacts, and no named failure turned into content. Until approved, production prompts carry none (hard rule 7).
5. **Pilot checks on the look block.** In the pilot drafts and finals, check that no tag line, hex value or label renders as text (2.6), that the colour-rule line holds in every shot, and that the 1080p finals match the approved drafts and the hero frames (07 rough grade).
6. **Freeze at the pilot approval.** When the user approves both pilot scenes, the version in use becomes the **production look**: the tagged blocks in `prefix/`, their sha256, the engine per job, every model setting and the reference roles used in the approved pilot shots, and the T-B and T-E results. Record it on the style-lock card as "Production look: LOOK vX.Y (frozen at pilot approval, <date>)". The whole film is then made on exactly that basis; any later change follows 2.12.
7. **Name.** "Pilot" is an internal production test. The film itself is never called a pilot or an episode (00 F8).

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
سؤال: أيّ هذه الآليات نعتمدها للواقع، وأيّها للحلم؟
```
**B. Engine shoot-out board** (2.8 step 2; also used for hero look frames): show the stills inline, grouped by variant, each captioned in Arabic with a still number, the checklist result, the measured values and one line on what to fix; the engine name, settings and credits appear after the scores if the user chose blind scoring. Show swatches as coloured blocks if the surface can render them (an HTML preview or artifact); otherwise give hex plus an Arabic name. Then ask:
```
أبوستيشا، هذه لوحة المقارنة بين المحرّكات لـ<المتغيّر> (<عدد> صور، <الرصيد> credits).
المطلوب: تقييم كل صورة من 1 إلى 5 حسب قائمة القبول، ثم اختيار:
1) الصورة التي تمثّل الستايل أفضل تمثيل (سنكتب سلوكها المرئي في LOOK v<X.Y>).
2) المحرّك الفائز لكل مهمة: إطارات الستايل · لقطات الأماكن · إعادة الإضاءة · الإطارات الأولى.
```

**C. Style-lock card** (`style-lock-card.md`, shown in full before the Gate):
```
بطاقة قفل الستايل — <الفيلم> — LOOK v<X.Y> — <التاريخ>
المرجع والأدلة: <العنوان/الإطارات> — مستوى الدليل: <…>
الثوابت (3–7): 1… 2… 3…
المتغيرات وخريطة الألوان: <جدول 2.5>
لوحة الألوان: <hex — الدور — السطح/المصدر>
اللون المحجوز: <اللون> لـ<العنصر> فقط · الإضاءة المحجوزة: <…>
سطر قاعدة اللون لكل متغير (English): <الصيغتان: المالك في الكادر / المالك غائب>
المقارنة بين المحرّكات: الفائز لكل مهمة <المهمة — المحرّك — الإعدادات> · ملف shootout.md
القرارات: الحبيبات والهالة <في المونتاج/في التوليد> · الإطار <16:9 كامل / شريط سينمائي في المونتاج> · مكان الستايل <لقطات محايدة + النص، حتى نتيجة الاختبار T-B> · فيزياء الحلم <…>
البث والأرشيف: <لا يوجد / سطر المصدر + العيب المعدود + حد زاوية الرؤية> · الأبيض والأسود: <لا يوجد / المشاهد + قيمة كل عنصر>
الإطارات البطلة: <ملف لكل متغير> · اختبار Seedance: <Higgsfield job IDs + النتيجة>
النصوص المجمّدة (English) وبصمة sha256 لكل بلوك: master · Seedance · GPT Image · Nano Banana · Seedream · Soul Cinematic · (Midjourney إن طُلب)
اختبارات المشهدين التجريبيين: T-B مكان الستايل · T-E جمل «اللقطة الفاشلة»
```
Lock prompt:
> «أبوستيشا، هذه بطاقة الستايل LOOK v1.0. هل نقفلها وننتقل إلى الخطوة 3: الأصول والصور، ثم المشهدين التجريبيين؟ بعد القفل يُلصق هذا البلوك حرفياً في كل برومبت صور وفيديو، وأي تعديل لاحق يصبح نسخة جديدة.»

Accept only a clear yes («اعتمد»، «اقفل»، «كمّل»). Silence or partial agreement is not approval.

**D. Production-look freeze** (2.13 step 6, asked inside the pilot gate):
> «أبوستيشا، المشهدان التجريبيان جاهزان بالستايل LOOK v<X.Y>. نتيجة الاختبار T-B: <…> · نتيجة الاختبار T-E: <…>. إذا اعتمدنا المشهدين، نجمّد هذه النسخة كستايل الإنتاج: نفس البلوك ونفس المحرّكات ونفس الإعدادات والمراجع لكل لقطات الفيلم، وأي تغيير بعدها يحتاج موافقة صريحة وقائمة باللقطات التي ستُعاد. هل نجمّدها؟»

---

## Gate (the user approves all of this before 03-assets-images.md starts)

- [ ] Tech sheet: every field labelled VERIFIED / REPORTED / UNKNOWN with a source; no field taken from memory.
- [ ] Evidence adequacy stated; OBSERVED claims cite frame IDs; motion claims come from clips only.
- [ ] Reference ledger: mechanisms to transfer and identity details excluded, both agreed.
- [ ] 3–7 invariants, each testable.
- [ ] Variants and colour script cover every sequence of the locked script; dream differs from reality on at least two axes; reserved accent and reserved looks named in the Bible, not in the core; one colour-rule line per variant in both forms, or a written "none" (2.5).
- [ ] Master prefix: no names, no gear brands, no job parameters, no bracket characters, no banned quality words, no comma-list negatives, hex attached to owners, ends on CONTINUITY then AUDIO; the contradiction test (2.5) passes against every variant; handheld variants carry both operator CAMERA forms.
- [ ] Engine shoot-out run on the routed entrants with one identical look prompt, scored by the user, winner per job recorded in `shootout.md` and the decisions file.
- [ ] Adapters A, B, D, E, F (and C only if the user wants it) compiled from the master and frozen as tagged blocks with sha256; parameter snapshot re-checked within 14 days.
- [ ] At least one approved hero look frame per variant, and Seedance draft look tests for R-DAY and DREAM (or the two most different variants) passed.
- [ ] BROADCAST / archive variants (if any): SOURCE line, one counted imperfection, field of view at most about 70 degrees, clean prompt. Black-and-white sequences (if any): value word for every character, prop and location, no B&W words in any prompt, local conversion checked.
- [ ] Decisions recorded: grain/halation, frame (D-9), grade intent, engine winners, where the look lives (current rule until T-B), failed-take sentences (none until T-E), dream physics exceptions.
- [ ] Pilot tests T-B and T-E written into the two-scene pilot plan (2.13).
- [ ] IP check: no reference-film frame uploaded anywhere; reference frames git-ignored; no real-person likeness in any look frame (00 G2).
- [ ] Files saved, authorship and disclosure logs written; the locked prefix, each approved look frame and the instructive rejects are entered in `prompt-library/style.md` (SKILL §7b).
- [ ] The user said «اعتمد» to LOOK v1.0.

**Production-look freeze (inside the pilot gate, 2.13 step 6):**
- [ ] Both pilot scenes approved by the user; the T-B and T-E results recorded and the user's choice on each written down.
- [ ] The version used in the approved pilot shots, its tagged blocks with sha256, the engine per job, the model settings and the reference roles saved as the production look on the style-lock card.
- [ ] No tag, hex value or label rendered as on-screen text in any pilot draft or final.
- [ ] The user said yes to the freeze (Output template D).

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
| Skin plastic or orange | "photorealistic" on faces; three or more warm cues | "real photograph" / "photographed, never rendered" phrasing (hard rule 10); at most two warm cues |
| The look drifts from shot to shot or between engines | the look text re-worded per shot, per scene or per engine | paste the frozen tagged block verbatim; sha256 check before submit; re-compile all adapters in one pass at each version (2.6, 2.8 step 6) |
| The look keeps changing after D3 | no shoot-out, so the look is still being discovered shot by shot | run the engine shoot-out before the lock (2.8 step 2); after it, every change is a version bump |
| GPT Image output soft, small or cheap-looking | a bare call runs flare / low / 1k | set `variant`, `quality`, `resolution` and `aspect_ratio` on every call (2.7 A) |
| Squares or wrong ratio from an image model | ratio written in words, parameter not set (SÉKOU) | set `aspect_ratio` as a parameter on every call |
| Wrong model run from a study's job name | the studies' raw `nano_banana_2` is Nano Banana Pro; MCP `nano_banana_2` is Nano Banana 2 | take model ids from the 2.7 snapshot or `models_explore`, never from a study |
| A tag, hex code or asset name appears as text in the frame | labels or names inside the prompt (TOKYO 4:17's `red-mirror` sign) | neutral names; tag line out of image prompts; for Seedance move the tag to sidecar and ledger (2.6) |
| The accent colour appears where its owner is absent | the accent hue named in the owner-absent shot | use the owner-absent colour-rule form, which never names the hue (2.5) |
| Archive or broadcast shot looks like a filter, or the wide shot bends like a fisheye | degradation asked for in the prompt; field of view above about 70 degrees | clean prompt with a SOURCE line and one counted imperfection; degrade in 07; about 47 or 29 degrees, rectilinear (2.5) |
| B&W sequence turns flat grey, or two key shapes merge | a model asked for black-and-white; values not designed | render muted colour with value words and a hierarchy sentence; check the local conversion before video credits (2.5) |
| Production shots stop matching the approved pilot | prompts, references or settings changed after the pilot freeze | use the frozen production look; any change is a version bump with the user's approval and an impact list (2.12, 2.13) |
| Character sheets fight later lighting | look grade baked into identity sheets | neutral sheets (2.11, 03) |
| 1080p final looks different from the approved draft | the final is a new render | compare to the hero frame; fix in grade (07) or redo the draft |
| Dream is not readable as the dream | only colour differs | change camera behaviour and light quality too |
| Dream shots get hard, motivated light anyway | a reality rule ("every light has a visible source") left in the core | contradiction test (2.5): move it into the reality variants |
| The reserved green appears on random props | the colour is named in prompts where no device is in frame | keep it out of the core; name it only in shots with an assistant device; sweep at G2/G3 |
| Negatives keep growing after each review | patching instead of calibrating | the 2.8 step 6 calibration loop: replace the rule, delete the obsolete negative; comma-list negatives stay banned, "= a failed take" sentences only inside pilot test T-E (hard rule 7) |
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
- **Method learned from public Higgsfield projects** (studied 2026-11-02; full studies and the cross-study playbook in `prompt-library/studies/`; method only, no characters, designs, signature looks or stories copied; quotes are short and attributed):
  - The Breach by `@sileent`: the day-1 cross-engine doctrine run that froze into versioned look strings (look version in the prompt header); its "8K detail" line informs the D-12 caution.
  - THREAD by `@pandaproduction`: one film-still prompt shot out on four engines, winners as world references; the LOOK LOCK block; "= a failed take" sentences (pilot test T-E).
  - SÉKOU by `@mauriziocibelli`: one identical `[VISUAL STYLE]` paragraph in every Seedance prompt; the colour-script motif rule; the operator camera sentence; clean references with one grade slot.
  - TOKYO 4:17 by `@nicholastakeyama`: one look line over neutral plates; GPT Image 2 beating Seedream on an identical prompt; the Element name painted onto a sign.
  - UNPROMPTED by `@shestak`: day-1 world tests on Soul Cinematic and Seedream; one fixed film-still suffix on most stills.
  - HUNGER by `@sssacccade`: a visual-style block appended to the end of every plate prompt; the engine bake-off.
  - Buzkashi by `@sqr_studio`: black-and-white designed inside colour prompts (value words, one white source, readable shadows), the measured conversion curve, relight-only edits in Nano Banana Pro, the key-art engine comparison.
  - CONTROL by `@pietromalegori`: the found-archive treatment (recording situation, counted imperfection, clean prompt and degradation in post, field-of-view ceiling).
  - Fukushima by `@aist`: red reserved for story objects; GPT Image 2.5 Sunburst at quality max for precise edits; the look-in-plates route.
  - Kimti by `@ameerahmed`: "static handheld" locked frames; the look from Soul Cinematic plates plus a post grade; black-and-white bookends made in post.
  - LEAK by `@creativemanifesto`: operator wording; a style block kept in two lengths; plates already in the final grade.
  - In Passing by `@julianmarshall`: byte-identical look and lock sentences across hundreds of prompts; "= a failed take" sentences.
- Higgsfield MCP, read 2026-11-02: `models_explore get` for `soul_cinematic`, `seedream_v5_pro`, `gpt_image_2`, `gpt_image_2_5`, `cinematic_studio_2_5` and `nano_banana_2`; image credits from `generate_image` with `get_cost: true` (nothing submitted). The B&W preview command was tested on a synthetic frame on 2026-11-02.
