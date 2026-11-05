# INC → our film: adaptation guide (AI-native, legal)

- **Date and status:** 2026-11-02. **PROPOSED**: nothing here is approved, generated or tested on Higgsfield yet.
- **Changelog:** v0.2 (2026-11-03) refines v0.1 from a machine scene analysis of official clips, trailers and score uploads (DOSSIER §13, [OBSERVED-MACHINE]): a TRANSIT variant and four sub-conditions (a); 2-s peaks, lag, tracers and event-wide / onset-dry rules (b); coverage budgets, transition devices and a machine legibility gate (c); low-statement placement, a tick moved out of the score, threshold silences and a quiet beat before the cascade (d, e); a world-run shape for the climax, a slower return and a teaser template (f); new bans (g). The v0.1 variants' hex and Kelvin values are unchanged; TRANSIT and the sub-conditions add new values (4500K and seven hex codes) that are design proposals, not readings. All are PROPOSED. v0.1 (2026-11-02): first draft.
- **Adversarial check 2026-11-03:** look blocks, compiled Seedance blocks and image adapters hold no title, crew, character, brand or gear names. Templates T-INC-2, -6, -7 and -9 and the score brief (d.1, d.3, d.4) were changed because they leaned too close to specific scenes or the best-known score gesture; (g) gained the matching bans.
- **Reference code:** INC. Every fact behind this guide is cited in `DOSSIER.md`. This file holds only our method and our own values.
- **Rules applied:**
  - 02 hard rules 1–10: no names in prompts, declarations instead of blacklists, parameters as job settings, banned quality words.
  - 05 §5.2: prompt order, physics wording, no edit verbs in reference prompts.
  - 06: describe traits, never names; instrumental only.
  - The CROSS-STUDY §3C.1 frozen-look-block method.
  - Machine observations of official uploads ([OBSERVED-MACHINE], DOSSIER §13) shape structure, coverage and pacing only. They never set a hex or Kelvin value, never override a sourced fact, and no number from them is the reference's shot length.

> **What "same equipment, same crew" means for us.** We cannot shoot on film cameras, and must not claim we did. We reproduce the **visible effects** of their choices and the **working rules** of each department, as text that Seedance 2.5 and the image models can act on. The crew's names, the title and the gear never enter a prompt, the credits or the submission (02 hard rule 2; Summit Terms R2, 00).

**Contents**
- (a) The LOOK-INC v0.2 look block, its variants and engine adapters
- (b) Physical surrealism: the VFX doctrine and 9 Seedance templates
- (c) Camera and coverage rules
- (d) Score brief
- (e) Sound design brief
- (f) Editing rhythm
- (g) G-rating and IP cautions
- (h) Next steps

---

## (a) LOOK-INC v0.2: the draft look block

### a.0 Why the block is built this way

The reference's look decisions (DOSSIER §1–3, §5) translate into rules for us:

| Reference fact | Our rule |
|---|---|
| One base format for people (35mm anamorphic, handheld) and a larger format only for formal wides | One anamorphic rendering for every world. Establishing wides get deeper focus, finer detail and a steadier platform (§c) |
| Two film stocks only. "I don't change stocks to create different looks" | One core block for the whole film. Worlds differ only through physical light, weather, palette, set and wardrobe; never a tint, LUT or "dream filter" |
| "Never … over lit, or lit"; every source motivated | The core LIGHT LAW holds in every world, the dream worlds included |
| Each world has its own palette (neutral, warm, sterile cool), legible from a tight shot | One variant per world, each with one light condition and a 3–4 swatch palette |
| The surreal lives in the environment, not the camera | The camera behaves the same everywhere; only the one scripted impossible event breaks physics |
| Photochemical print contrast, film grain | Prompts ask for "print-like contrast". Grain, and any letterbox, are added once in post (02 §2.9) |
| Machine reading of 20 official uploads: palettes legible at 1–2-s cuts; colour follows what a space is for; lifts as transition zones (DOSSIER §13) | v0.2: sub-conditions per kind of space, a TRANSIT variant and a machine legibility gate (c rule 5). v0.1 hex and Kelvin values unchanged; the new rows carry new PROPOSED design values |

**Deviation from 02 §2.5, for the user to approve.** 02's film-01 default separates dream from reality by camera behaviour plus light quality. The reference keeps the camera identical across worlds ("dreams feel real") and separates them by light quality, palette and weather, plus production design and costume. LOOK-INC follows the reference: the two axes are LIGHT and COLOR + weather. If the user prefers 02's camera axis, the DEEP world takes the LOCKED camera form (a.4).

**All hex and Kelvin values are PROPOSED design values for our film.** They come from the crew's verbal descriptions ("neutral / warm / sterile, cool"), **not** from measured frames (DOSSIER §11 is empty). v0.2 changed structure and wording from machine observations only and left every v0.1 hex and Kelvin value as proposed; the values new in TRANSIT and the sub-conditions are design proposals too, never derived from the machine words. After the shoot-out, or after measuring frames the user supplies, they are replaced and the block becomes v0.3.

### a.1 Master: LOOK-INC v0.2, stable core (Look Bible record, about 215 words)

```text
LOOK-INC v0.2 — STABLE CORE (PROPOSED)
MEDIUM: Photographed live-action drama on real locations and built sets, with real optics and real materials; every frame reads as filmed, never rendered.
CAPTURE: Anamorphic rendering: oval out-of-focus highlights, gentle softening and slight curvature toward the frame edges, faint horizontal streaks only from bright practical lamps; focus deep enough to keep the space readable behind faces; 180-degree shutter motion blur; clean capture with fine, even sensor texture.
LIGHT LAW: Every light has a visible or implied physical source; nothing looks lit; highlights roll off softly into a gentle shoulder with print-like contrast; blacks are dense and keep detail; never flattened into an HDR look.
COLOR: Skin stays natural in every world, never orange, grey or waxy; colour comes from location, weather, light, set and wardrobe, never from a tint.
TEXTURE: Skin shows pores and fine hair; tailored wool, cotton and leather show weave, crease and wear; wet, polished and glass surfaces carry true reflections.
PHYSICS: Gravity, mass and inertia are respected; bodies, hair, fabric and loose objects all answer the same gravity direction as the room around them; every impact has weight, contact and a visible reaction.
PERFORMANCE: Grounded and restrained; people treat the impossible as ordinary work, eyes on a target, breath in the chest.
CONTINUITY: Characters, wardrobe, props and environments stay identical to their references across every cut; no identity drift.
AUDIO: Diegetic sound effects and ambience; dialogue only where the shot scripts it. No music, no background music, no score. No subtitles.
```

v0.2 leaves the stable core unchanged; only the version tag moved.

Contradiction test (02 §2.5):
- Every core line is true in every world below. The dream worlds keep motivated light, which is the reference's doctrine.
- The PHYSICS line stays in the core because the impossible event is declared per variant as an exception, not as a contradiction.

### a.2 Variants (add to the core; replace nothing)

| ID | Covers (our film; fill from the locked script) | LIGHT | COLOR (swatches attached to surfaces) | COLOR RULE | TEXTURE | CAMERA |
|---|---|---|---|---|---|---|
| **REALITY** | the waking world | Natural daylight at about 5600K through windows, doorways and open streets, or practical lamps at about 3200K after dark; one key direction per scene; faces about one stop under the brightest part of the background | sun-warmed stone and plaster #B8A487, worn timber #6A5038, neutral shadow #2D3135; restrained saturation | owner absent: "Skin is the only saturated colour in frame." Owner in frame: "The [anchor object]'s [hue] is the only saturated [hue family] in frame; every other colour stays inside the REALITY palette." | lived-in: scuffs, fingerprints, dust on sills | HANDHELD |
| **DREAM-A** | first dream world: the wet city | flat overcast daylight at about 6500K, the sun fully blocked; steady rain in visible sheets; no hard shadows; sky reflections on every wet surface | wet asphalt #2A2F35, rain-dark concrete #6A7076, pale grey sky #A9B0B6; low saturation | "Skin is the only saturated colour in frame." | everything wet: hair clumps, coats darken at the shoulders, puddles ripple; streets bare of signs, adverts and clutter | HANDHELD |
| **DREAM-B** | second dream world: the warm interior | tungsten practicals at about 3000K in sconces, lamps and ceiling coves are the only sources; soft pools of light with falloff between them; windows show a late, fading sky | lamp-lit walls #B07A45, dark wood #4A3224, brass fittings #A8823E, deep warm shadow #1C1511 | "The lamps' amber light is the only saturated warm colour in frame; every other colour stays inside the DREAM-B palette." | polished wood, brass and glass carry lamp reflections; walls bare | HANDHELD |
| **DREAM-C** | third dream world: the white high ground | shadowless overcast at about 7000K over snow; bright, even and low in contrast; wind carries fine snow across frame; the only dense darks are window openings and architecture | snow #E7ECEF, cast concrete #8B9196, cool shadow #5D6A76, dark window glass #1E242A; the lowest saturation of the dream worlds | "Skin is the only saturated colour in frame." | snow packs and sprays under boots; concrete smooth, heavy, clean-edged | HANDHELD, every shot moving |
| **DEEP** | the deepest world (memory, decay) | diffuse marine overcast at about 6000K, no direct sun, soft top light; sea mist softens everything beyond 200 metres | sea and sky #7E878C, eroded pale stone #A39E93, dark wet rock #34383B; the lowest saturation of the film | "Skin is the only saturated colour in frame." | stone cracked, salt-stained and eroded; water heavy, grey and slow | HANDHELD, slower; or LOCKED if the user picks the camera axis |
| **TRANSIT** (v0.2) | the vehicle or passage that carries people from one world to another (a funicular cabin, a cable ferry, a spiral stair behind a lattice screen); it belongs to no world | dim, cool light from one caged fixture overhead; bands of light and shadow slide across faces as they travel; beyond it, only darkness or passing streaks | worn steel #6E7378, painted metal #3F4A4E, deep cool shadow #16191C; low saturation | "Skin is the only saturated colour in frame." | a grille, slats or mesh in the foreground; metal worn smooth by hands | HANDHELD |

**Each dream variant (A, B, C, DEEP) adds:**
`PHYSICS EXCEPTION: Only this shot's one impossible event breaks physics; everything else keeps real weight.`
The event itself is written once in the shot's Event Script and logged in `ledger-continuity-physics.md`. The block text never changes per shot. TRANSIT takes no PHYSICS EXCEPTION: nothing impossible happens in transit.

**Caution on DEEP.** A grey sea, eroded stone and a "memory" world together sit closest to the reference's deepest world. Prefer the dry sandstone swap below if the locked script allows, and never put a city or rows of buildings at the sea edge.

**Optional swaps (keep the light logic, change the place):**
- DREAM-C on a white salt flat or white desert at noon overcast, instead of snow.
- DEEP on a dry, wind-eroded sandstone coast instead of a grey sea.

Choose the place from the locked script. No world may reuse the reference's own places: no rainy downtown chase, no hotel corridor, no mountain fortress, no glacial city in the sea (g).

**Light that changes inside a shot** (the reference's tilting-bar trick, for one hero shot per world at most): "The window light slowly sinks from low warm sun to flat overcast over the length of the shot." This is written in the shot's scene paragraph, never in the block.

**v0.2 additions.** Each rests on a machine observation ([OBSERVED-MACHINE], DOSSIER §13.3) and on the sourced fact named with it.
- **TRANSIT.** It formalises the reference's neutral transition zones (DOSSIER §5.3, sourced), after the machine reading of a dim, cool lift cage with its own mechanical sound (clip06 0:00–0:21). Its sound signature is in §e; its use as a transition device is (c) rule 20. Never a cage lift with numbered buttons, never a sideways shaft (g).
- **Sub-conditions.** Colour follows what a space is for, not only which world it is in. A sub-condition swaps the named sentences of its variant and nothing else; the compiled swaps are in a.3. Tag line: `LOOK v0.2 · REALITY · HOME`.

  | Sub-condition | Use for | Swaps | Basis |
  |---|---|---|---|
  | REALITY · HOME | homes, day or night | LIGHT | the return's home reads "warm wood, soft light" (clip12 1:34); the REALITY row already allows practicals after dark |
  | REALITY · CONCOURSE | terminals, stations, cabins, waiting halls: impersonal public spaces | LIGHT and COLOR | the cabin and terminal read "cool, artificial light from above" and "bright, even, overhead" (clip12 0:00–1:34); the reference's return is mostly such spaces |
  | DREAM-A · INTERIOR | rooms inside the wet city, looking out | LIGHT; "Bare streets" becomes "Bare walls" | a dark interior cut against an overexposed exterior (clip05 0:13–0:55); the negative held −3 / +5 stops in one frame (DOSSIER §2.2) |
  | DEEP · INTERIOR | one warm, personal room inside the deepest world; at most one per film | LIGHT, COLOR and COLOR RULE | memory interiors read "warm, natural" against cool exteriors (clip10); "personal houses embedded" (DOSSIER §5.2, §7.3). Never a house standing in or at the edge of water (g) |

- **Plot-object colour form (PROPOSED, dream variants).** When the shot packet names one plot object in frame, its hue may join skin as the only saturated colour: `Only skin and the {{object}}'s {{hue}} are saturated.` In DREAM-B: `Only the lamps' amber and the {{object}}'s {{hue}} are saturated.` It replaces the variant's COLOR RULE sentence. Keep object and hue to at most three words together (for example "kite" + "red", or "paper kite" + "red"): DREAM-A then stays at 140 words, and a longer fill breaks the 140-word limit. One object per world. Basis: a single saturated plot object in a desaturated world (clip05 0:00–0:13); it mirrors REALITY's owner-in-frame form.
- **Service spaces.** A stairwell, plant room or lift lobby inside a world may drift in palette, as a cool stairwell does inside the reference's warm hotel (clip08 2:00–2:06; clip09 1:12–1:28 reads it "harsh and artificial"). Keep one cue of the variant in frame (a warm practical in DREAM-B), or cut to the space only straight after that world's establishing frame.
- **DREAM-A colour.** Keep the cool greys. Do not push toward blue until measured frames settle the reference DP's "neutral" against the press's "bluish" (DOSSIER §3.3, §13.3).
- **DREAM-C contrast.** Low contrast is the constant; brightness may vary from shot to shot (one reference sequence reads "dim", "flat grey" and "washed out", clip09). Fail a DREAM-C shot for hard contrast, never for being dimmer than its establishing wide.
- **Wardrobe hand-off to 03 (PROPOSED).** One hue family per lead across all worlds; the garment changes per world. Basis: one silhouette per character and a wardrobe change in each dream (DOSSIER §6); the newcomer's orange across two dreams (clip03, clip06).

### a.3 Compiled Seedance 2.5 blocks (adapter D)

Paste byte-for-byte after the scene paragraph (05 §5.2 "The visuals feature …").
- **Tag line in prompts:** `LOOK v0.2 · <ID>`. The "INC" code stays in docs only (02 hard rule 2).
- **Checked 2026-11-03 (v0.2):** every block, and every block after a sub-condition swap, is ≤140 words (core 83 words; totals 126–140) and contains no `()`, `<>`, `{}` or `【】`.
- **At lock:** record each block's sha256 on the style-lock card.

```text
LOOK v0.2 · REALITY
The visuals feature photographed live-action drama on real locations and built sets; every frame reads as filmed, never rendered. Anamorphic rendering: oval out-of-focus highlights, gentle edge softening, readable depth, 180-degree shutter motion blur, clean capture with fine, even sensor texture. Every light has a visible or implied source; highlights roll off softly with print-like contrast; blacks are dense with detail. Natural skin with pores and fine hair. Gravity, mass and inertia hold; hair, fabric and loose objects answer the room's gravity. Restrained performance. Natural daylight at about 5600K enters through windows and open streets from one key direction; faces sit about one stop under the brightest background. Sun-warmed stone #B8A487, worn timber #6A5038, neutral shadows #2D3135; restrained saturation. Skin is the only saturated colour in frame.
```
```text
LOOK v0.2 · DREAM-A
The visuals feature photographed live-action drama on real locations and built sets; every frame reads as filmed, never rendered. Anamorphic rendering: oval out-of-focus highlights, gentle edge softening, readable depth, 180-degree shutter motion blur, clean capture with fine, even sensor texture. Every light has a visible or implied source; highlights roll off softly with print-like contrast; blacks are dense with detail. Natural skin with pores and fine hair. Gravity, mass and inertia hold; hair, fabric and loose objects answer the room's gravity. Restrained performance. Flat overcast daylight at about 6500K, the sun fully blocked; steady rain in visible sheets; no hard shadows; sky reflections on every wet surface. Wet asphalt #2A2F35, rain-dark concrete #6A7076, pale grey sky #A9B0B6; low saturation. Skin is the only saturated colour in frame. Bare streets, no signs. Only this shot's one impossible event breaks physics.
```
```text
LOOK v0.2 · DREAM-B
The visuals feature photographed live-action drama on real locations and built sets; every frame reads as filmed, never rendered. Anamorphic rendering: oval out-of-focus highlights, gentle edge softening, readable depth, 180-degree shutter motion blur, clean capture with fine, even sensor texture. Every light has a visible or implied source; highlights roll off softly with print-like contrast; blacks are dense with detail. Natural skin with pores and fine hair. Gravity, mass and inertia hold; hair, fabric and loose objects answer the room's gravity. Restrained performance. Tungsten practicals at about 3000K in sconces, lamps and ceiling coves are the only sources; soft pools of light with falloff between them. Lamp-lit walls #B07A45, dark wood #4A3224, brass #A8823E, deep warm shadow #1C1511. The lamps' amber light is the only saturated warm colour in frame. Bare walls. Only this shot's one impossible event breaks physics.
```
```text
LOOK v0.2 · DREAM-C
The visuals feature photographed live-action drama on real locations and built sets; every frame reads as filmed, never rendered. Anamorphic rendering: oval out-of-focus highlights, gentle edge softening, readable depth, 180-degree shutter motion blur, clean capture with fine, even sensor texture. Every light has a visible or implied source; highlights roll off softly with print-like contrast; blacks are dense with detail. Natural skin with pores and fine hair. Gravity, mass and inertia hold; hair, fabric and loose objects answer the room's gravity. Restrained performance. Shadowless overcast at about 7000K over snow; bright, even and low in contrast; wind carries fine snow across frame. Snow #E7ECEF, cast concrete #8B9196, cool shadow #5D6A76, dark window glass #1E242A; the lowest saturation of the dream worlds. Skin is the only saturated colour in frame. Only this shot's one impossible event breaks physics.
```
```text
LOOK v0.2 · DEEP
The visuals feature photographed live-action drama on real locations and built sets; every frame reads as filmed, never rendered. Anamorphic rendering: oval out-of-focus highlights, gentle edge softening, readable depth, 180-degree shutter motion blur, clean capture with fine, even sensor texture. Every light has a visible or implied source; highlights roll off softly with print-like contrast; blacks are dense with detail. Natural skin with pores and fine hair. Gravity, mass and inertia hold; hair, fabric and loose objects answer the room's gravity. Restrained performance. Diffuse marine overcast at about 6000K, no direct sun, soft top light; sea mist softens everything beyond 200 metres. Sea and sky #7E878C, eroded pale stone #A39E93, dark wet rock #34383B; the lowest saturation of the film. Skin is the only saturated colour in frame. Only this shot's one impossible event breaks physics.
```
```text
LOOK v0.2 · TRANSIT
The visuals feature photographed live-action drama on real locations and built sets; every frame reads as filmed, never rendered. Anamorphic rendering: oval out-of-focus highlights, gentle edge softening, readable depth, 180-degree shutter motion blur, clean capture with fine, even sensor texture. Every light has a visible or implied source; highlights roll off softly with print-like contrast; blacks are dense with detail. Natural skin with pores and fine hair. Gravity, mass and inertia hold; hair, fabric and loose objects answer the room's gravity. Restrained performance. Dim, cool light from one caged fixture overhead; bands of light and shadow slide across faces as they travel; beyond it, only darkness or passing streaks. A grille, slats or mesh sits in the foreground. Worn steel #6E7378, painted metal #3F4A4E, deep cool shadow #16191C; low saturation. Skin is the only saturated colour in frame.
```

**Sub-condition swaps (v0.2).** Swap exactly the named sentences in the variant's block above; everything else stays byte-for-byte.
```text
REALITY · HOME, replaces the LIGHT sentence:
Soft daylight through windows mixes with warm practical lamps at about 3200K on wood and fabric; gentle falloff between pools of light; faces sit about one stop under the brightest window.

REALITY · CONCOURSE, replaces the LIGHT and COLOR sentences:
Even, cool overhead light at about 4500K from long ceiling fixtures fills the space with no single key; bright, clean and impersonal; daylight through distant glass walls. Pale stone floor #C9C6BE, brushed steel #8E9398, neutral shadows #2D3135; restrained saturation.

DREAM-A · INTERIOR, replaces the LIGHT sentence, and "Bare streets, no signs." becomes "Bare walls, no signs.":
Overcast daylight at about 6500K enters only through rain-streaked windows burning out to white; the room falls into cool shadow; faces stay readable.

DEEP · INTERIOR, replaces the LIGHT, COLOR and COLOR RULE sentences:
Inside one personal room, warm practical lamps at about 3000K pool on worn wood; through its windows lies the world's cool overcast. Worn wood #5A4636, lamp-lit plaster #A88A66, overcast beyond the glass #7E878C; low saturation. The lamps' amber light is the only saturated warm colour in frame.
```

**Placement in the prompt.**
- The CONTINUITY and AUDIO lines stay separate, in the 05 slots.
- The CAMERA form (a.4) goes in the camera sentence.
- The owner-in-frame COLOR RULE form swaps in for the REALITY rule only when the shot packet says the anchor object is in frame. The plot-object form (a.2) swaps in the same way in the dream variants.
- If a draft renders a hex code or the tag as text, drop the hex values from that block only and keep the colour words (02 §2.7 D).

### a.4 CAMERA forms

**HANDHELD and LOCKED** are 02's frozen forms, verbatim:
```text
CAMERA, handheld: A handheld operator is physically present: the frame breathes, drifts and corrects a beat late; no gimbal smoothness, no zoom; every new framing is reached only by moving the camera.
CAMERA, locked: A locked frame with only a faint breathing sway; the subject moves inside the frame, and the frame never follows.
```

**Three new forms, PROPOSED for LOOK-INC.** They need the user's yes before they join the frozen set.
```text
CAMERA, bolted: The camera is rigidly fixed to the {{room}}: its floor, walls and ceiling never move in frame; the room's turn shows only in what falls, slides and swings inside it and in the light and world beyond its windows.
CAMERA, arm: A heavy vehicle-mounted arm travels low and close alongside the action at speed: smooth, weighted, near the ground; at an impact the whole frame shakes hard once, as if by hand, then steadies.
CAMERA, aerial: A high travelling view from a heavy aircraft: slow, steady forward drift with a gentle bank; it never snaps, orbits or climbs suddenly.
```

### a.5 Image adapters

Compiled from the master; the variant sentences are swapped from a.2. Every look still is `aspect_ratio: "16:9"`, face-free or back-of-head until 03 locks the characters, in the `00_STYLE` folder, with `get_cost: true` first (02 §2.8).

**GPT Image 2** (`gpt_image_2`, adapter A: `resolution: "4k"`, `quality: "high"`, media role `image`; GPT Image 2.5 Sunburst takes the same card). Shown for DREAM-B:
```text
Intended use: look-development still for a live-action short film. It becomes the style reference for every later image, so light, colour and texture must be exact.
Scene: {{SCENE CONTENT: place, time, weather, what is in frame, distances in metres}}
Subject: {{synthetic people seen from behind, or "no people"}}
Look: Photographed live-action drama on a built set with real optics and real materials; the frame reads as filmed, never rendered. Anamorphic rendering: oval out-of-focus highlights, gentle softening toward the frame edges, faint horizontal streaks only from bright lamps; focus deep enough to read the room; clean capture with fine, even sensor texture. Every light has a visible source; highlights roll off softly with print-like contrast; blacks dense with detail. Tungsten practicals at about 3000K in sconces, lamps and ceiling coves are the only sources; soft pools of light with falloff between them. Lamp-lit walls #B07A45, dark wood #4A3224, brass fittings #A8823E, deep warm shadow #1C1511. The lamps' amber light is the only saturated warm colour in frame. Polished wood, brass and glass carry lamp reflections; walls bare. Framing slightly off level, as if handheld.
Constraints: one single photographic frame; no text, no logos, no watermark, no borders.
```

**Seedream 5.0 Pro** (`seedream_v5_pro`, adapter E: `resolution: "2k"`, `count: 4`; the plate workhorse). Shown for DREAM-A:
```text
A photographed live-action film still. {{SCENE CONTENT in reading order, distances in metres}}. {{"No people." or synthetic people from behind}}
Visual style: Photographed live-action drama on a real location with real optics and real materials; never rendered. Anamorphic rendering with oval out-of-focus highlights and gentle edge softening; readable depth; clean capture with fine, even sensor texture. Every light has a visible or implied source; soft highlight roll-off with print-like contrast; dense blacks with detail. Flat overcast daylight at about 6500K, the sun fully blocked; steady rain in visible sheets; no hard shadows; sky reflections on every wet surface. Wet asphalt #2A2F35, rain-dark concrete #6A7076, pale grey sky #A9B0B6; low saturation. Skin is the only saturated colour in frame. Everything is wet; puddles ripple; the street is bare of signs, adverts and clutter.
One single photographic frame; no text, no logos, no watermark, no borders.
```

**Nano Banana Pro** (`nano_banana_pro`, adapter B: `resolution: "4k"` for frames that may become references, `"2k"` for relights; natural prose with lens effects in words). Shown for REALITY:
```text
A photographed live-action film frame: {{SCENE CONTENT}}. Natural daylight at about 5600K enters through the windows from one side, and faces sit about one stop under the bright window. The image has the look of anamorphic glass: out-of-focus lights become soft ovals, the edges of the frame soften gently, and the room stays readable behind the subject. Sun-warmed stone and plaster #B8A487, worn timber #6A5038 and clean neutral shadows #2D3135, with restrained saturation; skin is the only saturated colour in frame. Surfaces are lived-in, with scuffs and fingerprints. Print-like contrast with soft highlight roll-off and dense, detailed blacks, no HDR look. A single composition with no text.
```
After the lock, attach 1–3 approved hero frames of the same variant as `image_references` with 02's style-reference sentence.

**Soul Cinematic** (`soul_cinematic`, adapter F: `quality: "2k"`, 4 takes at 0.12 credits). Shown for DREAM-C:
```text
Film still from a live-action drama. {{SCENE CONTENT}}. It is photographed with real optics on a real location and never rendered: anamorphic rendering with oval out-of-focus highlights and softly curving edges, deep enough focus to read the whole space, clean fine sensor texture. Shadowless overcast at about 7000K lies over the snow, bright, even and low in contrast, while wind carries fine snow across the frame and the only dense darks are the window openings in the architecture. Snow #E7ECEF, cast concrete #8B9196, cool shadow #5D6A76 and dark window glass #1E242A, with the lowest saturation of any world; skin would be the only saturated colour. Snow packs and sprays under boots; the concrete is smooth, heavy and clean-edged. Highlights roll off softly with print-like contrast. No people. No text.
```

**Sub-conditions (v0.2)** swap the same sentences in every image adapter as in a.3.

**Plate-safe line** (character, prop and costume sheets and neutral plates, 02 §2.6): `Photographed with real optics and real materials. Skin shows pores and fine hair; tailored wool, cotton and leather show weave, crease and wear; wet, polished and glass surfaces carry true reflections.`

**Crop-safe sentence.** Only if the user picks a letterbox under D-9 (below): `Compose for a centred wide crop: faces, hands and the action stay inside the central band of the frame height; the top and bottom edges hold only sky, ceiling or floor.` Generation stays 16:9 either way.

### a.6 Decisions for the user before v1.0

1. **D-9 frame.**
   - (A) Full 16:9, which 02 recommends.
   - (B) A scope letterbox cut in post inside the 16:9 master. This is the closest match to the reference's 2.39–2.40:1 (DOSSIER §1). It costs about 1920×804 of active picture, and every prompt needs the crop-safe sentence.
   - Decide before D7.
2. **World axes.** Light and palette, as the reference does (default), or 02's camera axis for DEEP (a.0).
3. **The three new CAMERA forms** in a.4.
4. **Which worlds the script needs.** Recommendation: REALITY plus two dream worlds; DEEP only as a cold open or coda (§f).
5. **Shoot-out.** One face-free look-dev still per variant on all five engines (02 §2.8). At 02's takes that is about 78.5 credits per variant, so five variants come to about 392 credits, and about 471 with TRANSIT [ARITH]. Quote with `get_cost` first; at most three rounds, then lock v1.0.
6. **v0.2 additions.** The TRANSIT variant, the four sub-conditions and the plot-object colour form (a.2), and locked object inserts ((c) rule 21). Approve or drop each.

---

## (b) Physical surrealism: VFX doctrine for Seedance 2.5

### b.1 The doctrine in 16 rules

From DOSSIER §7; rules 15–16 and the v0.2 notes come from the machine observations in DOSSIER §13. Wording follows 05 §5.2 physics language.

1. **A real world first.** Every impossible shot is first a believable, naturally lit place with real weather. The event happens *to* that place (BAFTA: "All digital VFX work proceeded from the photography").
2. **One impossible event per shot.** Write it once in the Event Script. Light, rain, people, cloth and dust keep obeying physics around it. The dream variant's PHYSICS EXCEPTION covers only that event.
3. **Mechanical, not organic.** Impossible geometry hinges, pivots, rotates, slides and locks. It never bends, melts, morphs or ripples ("pivot, not bend"). Name the hinge line, the pivot axis, the angle and the speed.
4. **Mass and inertia.** Big things start slowly, keep moving, and stop with overshoot and settle. Loose objects lag, slide and tumble. Hair and fabric trail the motion. Write the order: preparation → motion → contact → reaction → settle.
5. **Real light follows the geometry.** When the geometry blocks the sun, shadows sweep across. Faces stay lit by a source we can name: bounce off the risen surface, a sky gap, a lamp. Never flat fill.
6. **Debris has material, stages and randomness.** Name the materials (paper, dust, flour, petals, fabric, foam fruit, grit). Use three stages (burst → hang → settle) and "uneven, unchoreographed paths; pieces fly in unexpected directions". Never write "explosion", "explodes" or "stylized slow motion": a machine reading of the reference's own air bursts used exactly those words for the wrong thing (DOSSIER §13.4). Write "a burst of paper and dust blown outward by air".
7. **The camera is a physical object.** It is handheld, bolted to the set, on an arm or on an aircraft (a.4), and never weightless. The camera sentence ends with 05's travel line. Outside 02's frozen HANDHELD form, which negates it, the word "zoom" never appears in a prompt: write "the camera physically pulls back" or "moves closer".
8. **Bolted to the set for gravity gags.** When a room turns, the camera turns with it: the room stays still in frame and people fall across it. Cut to an independent camera to reveal the turn. Vary the rig from shot to shot so the trick can't be read.
9. **Gravity has a cause in the world above.** Pick one source event (a vehicle sways, rolls or drops) and map it one world down: sway → lean, roll → the room turns, drop → weightless drift. Keep the direction consistent across every intercut. **Cause leads, effect lags:** the inner world starts to move one cut after the outer world's first lurch and settles only after a rest shot of the outer world, as in the reference's van-and-hotel intercut (DOSSIER §13.3).
10. **Slow motion means time, never decoration.** Use it only for the outer (slower) world in a cross-cut, or for a waking moment. Write it as "extreme slow motion, as if captured at a very high frame rate", with visible detail ("each water bead hangs and wobbles"). Everywhere else: "natural real-time speed". v0.2: the reference's uploads tag slow motion mostly on its documented high-speed events; four of ten tags do not fit and are not used as a basis (DOSSIER §13.3).
11. **Particles slow natively.** Rain, spray and dust cannot be retimed cleanly. In the reference, optical-flow retiming failed on motion-blurred rain (DOSSIER §7.3). So generate slow-motion particle shots *as* slow motion. Never stretch a real-time take in post.
12. **Collapse borrows a natural process.** Use ice calving, a sand-dune slump or a cliff giving way, not a demolition. Failures follow a timed internal order ("from the bottom up, in many small failures before the big one"). Large things read large when they move slightly slower than real time.
13. **Weight comes from sound too.** A light generated object gets heavy layered sound in post (§e).
14. **G-rated by construction.** No fire, no flash, no smoke column, no weapons, no injury, no one inside a collapsing structure, no one trapped. Use bursts of air, not explosions. Danger is shown as awe and near-misses that stay clear of people.
15. **Gravity is shown by cues, not by the word.** Name what streams past, what lags behind, where loose objects slide and which way the light travels, instead of relying on "falls" or "upside down". A rig laid flat reads as a vertical fall even to a machine viewer (DOSSIER §13.1): the cues carry the illusion.
16. **The event is wide, the face is close, the onset is dry.** Impossible events are framed WS or MS; reactions are CU or MCU ((c) rule 16). The onset and every hard impact carry effects only; the score enters on the reveal or after the impact (§e.5). In the reference, 8 of 11 onsets and impacts carry no music, and WS is 43 % of effect segments against 10 % of the rest (DOSSIER §13.2.2, §13.3).

### b.2 Templates

Each template follows 05 §5.2. Fill the `{{slots}}` and delete unused ones.
- The look block is the variant's block from a.3, verbatim.
- The role lines come from 05's vocabulary.
- Every template is **original imagery** and must not be steered back toward the reference's shots (g).
- All are **untested on Seedance 2.5**. Test each as a 480p draft before production. The pilot tests are in (h).
- **2-s peak (v0.2).** Every event template (T-INC-1, 2, 3, 6, 7) names the second range inside its take where the event reads on its own: the hinge at its steepest, the room past the half turn, the drift in mid-room, the debris at its hang, the span in mid-slide. Cross-cuts use that window first. Basis: the reference's marketing used each impossible image for about 1.7 s (DOSSIER §13.2.3).
- **Analyser QA (v0.2).** `video_analysis` may read **our** drafts as a viewer-perception test ((c) rule 5), never reference frames. Its "zoom" and "static" prove nothing either way (DOSSIER §13.1).

Every template opens and closes with 05's audio lines:
```text
OPEN:  Audio policy: the soundtrack holds only the diegetic sounds named at the end. No music, background music, BGM, score, instrumental, melody, synth effects, ambient pad, drone, stinger or rising tone at any moment. No subtitles.
CLOSE: Audio includes <{{SFX 1}}>, <{{SFX 2}}>. Diegetic sound effects and ambience; dialogue only where the shot scripts it. No music, no background music, no score. No subtitles. No music of any kind.
```

#### T-INC-1 · The hinge: a world folds like engineering

Variant DREAM-A or DREAM-B. Example fill: a covered market arcade whose whole left-hand run of stone floor and shop fronts rises as one rigid slab to stand vertical. Distance from the reference: never an open city street or apartment blocks, never folding past vertical or overhead.

```text
[OPEN]
【Generation Goal】
Generate one continuous wide shot: {{NAME}} stands at the edge of {{a covered market arcade}} while the {{left half of the arcade floor and its shop fronts}} rises on a straight hinge line along {{the central gutter}} until it stands vertical like a wall. Story job: {{story job from the locked script; never a newcomer discovering she can reshape the world}}.
【Reference Asset Roles】
{{role lines}}
【Subjects and Relationships】
Exactly {{N}} people; no one else at any point. {{NAME}} stays on the fixed half, two metres from the hinge line. The rising slab is one rigid piece: it pivots, it never bends, ripples or melts.
【Event Script】
0-2 seconds: Frame one is already running: the arcade is ordinary; {{NAME}} looks along it; dust hangs in the light.
2-6 seconds: with a deep grinding shudder the slab starts slowly at the hinge line and gathers speed; loose crates slide toward the hinge and drop off the rising edge; grit pours from the seams in thin streams; hanging lamps swing toward the hinge.
6-9 seconds: the slab slows, overshoots a hand's width, settles back and locks vertical with a heavy jolt that shakes dust from its face; its shadow sweeps across the fixed half and over {{NAME}}, whose face is now lit by soft light bouncing off the risen stone. FINAL FRAME: wide; {{NAME}} small at frame right, the new stone wall towering at frame left.
A handheld wide shot at about an 84-degree field of view, low at 1.2 metres, drifting slowly toward {{NAME}}. {{HANDHELD form}} Every new framing is reached only by travel; the camera never passes through walls, glass or bodies.
{{LOOK v0.2 · DREAM-A block}}
{{CONTINUITY line}}
【Maintain Consistency】
Keep {{identity lines}}; the hinge line straight; the slab rigid and in one piece; one sun direction from {{camera left}} until the slab blocks it.
[CLOSE: <a deep stone-on-stone grinding from the hinge>, <crates scraping and dropping>, <grit hissing from the seams>, <one heavy locking thud>]
```

**v0.2 notes.** 2-s peak: 6–8 seconds, the slab near vertical. Cut the event as event wide (5–7 s) ↔ reaction close (2–3 s, a separate generation), as the reference cuts its own fold (DOSSIER §13.3). The onset carries effects only; the score joins on the reveal. Fail a draft if an analysis of it calls the slab "curving", "bending", "rippling", "melting" or "morphing" (b.1 rule 3).

#### T-INC-2 · Gravity turns: camera bolted to the room

Variant DREAM-B. Example fill: a wide, wood-panelled ship's chart room, **never a corridor of any kind** (a long rotating corridor in warm sconce light is the reference's signature set, g). G-rated action: retrieving a rolling object.

```text
[OPEN]
【Generation Goal】
Generate one continuous shot inside {{a wide, wood-panelled ship's chart room}} while the whole room slowly rolls a quarter turn to the right, and {{NAME}} keeps walking toward {{a rolling brass lantern}} by stepping from the floor onto the right-hand wall. Story job: the sway of the world above reaches this world as a turning room.
【Subjects and Relationships】
Exactly one person. The room is one rigid box; it turns as a whole about one horizontal axis; nothing inside is fixed except the fittings.
【Event Script】
0-3 seconds: Frame one is already running: {{NAME}} walks toward camera at an even pace; the lantern rolls slowly away from her along the floor.
3-7 seconds: the floor tilts to the right; her weight shifts onto her right foot, she leans into the slope, one hand braced on the window rail; the lantern slides down to the wall and rolls along the join; curtains swing out from the portholes and hang toward the right-hand wall; loose charts slide and pile against it.
7-10 seconds: the right-hand wall is now the floor; she steps onto it heel first, plants, and walks on along it; her hair and coat hang toward the new floor. FINAL FRAME: medium shot, {{NAME}} walking on the wall, the portholes now under her feet.
CAMERA, bolted: the camera is rigidly fixed to the room at chest height facing across it, about a 63-degree field of view: the room's floor, walls and ceiling never move in frame; the turn shows only in what falls, slides and swings inside it and in the daylight through the portholes sweeping from the floor to the ceiling.
{{LOOK v0.2 · DREAM-B block}}
【Maintain Consistency】
One gravity direction at every moment for her body, hair, coat, curtains, charts and lantern; the room geometry rigid; lamp light rotates with the room.
[CLOSE: <a low structural groan through the walls>, <the lantern rolling and knocking>, <charts sliding>, <her heel landing on painted wood>]
```

**Coverage pair.** Generate the same Event Script a second time with an independent camera, outside the room's rotation: "a heavy camera on a fixed external mount sees the whole room box turning". Cut between the two on the turn. Then vary the third angle (a low angle from the far wall) so the method can't be read (b.1 rule 8). No fight choreography in a turning room.

**v0.2 notes.** 2-s peak: 7–9 seconds, her heel landing on the wall. In a cross-cut the room starts to turn one cut after the outer world's first lurch and settles only after a rest shot of the outer world (b.1 rule 9). Keep at least one small-object tracer moving in every shot (the lantern, a chart) so the gravity direction reads. End the sequence on the settled room with her breathing. Sound: the structural groan follows the angle, rising toward the quarter turn and easing as it settles (§e).

#### T-INC-3 · Weightless drift: the world above is falling

Variant DREAM-B or DREAM-C. Example fill: a school workshop with tools on pegboards.

```text
[OPEN]
【Generation Goal】
Generate one continuous shot in {{a school woodwork workshop}} where gravity has gone: {{NAME}} pushes off a workbench and drifts across the room to catch {{a floating wooden toolbox}}. Story job: the world above is in free fall, so this world floats.
【Event Script】
0-3 seconds: Frame one is already running: pencils, wood shavings and a tape measure hang in the air turning slowly; {{NAME}} holds the bench edge, her hair spreading and drifting around her head.
3-7 seconds: she bends her knees against the bench and pushes off; she travels in a straight line at a constant speed, turning slowly about her waist; shavings part around her and keep their own slow spin; her jacket hem lags behind her motion.
7-9 seconds: she reaches the toolbox, catches its handle, and both keep drifting together, slowed only a little by the extra mass; her free hand touches the far cabinet and stops them with a soft push-back. FINAL FRAME: medium, {{NAME}} holding the cabinet edge, the toolbox in her other hand, objects still turning in the air around her.
A handheld medium-wide shot at about a 63-degree field of view, the operator drifting alongside at her height. {{travel line}}
{{LOOK v0.2 block}}
【Maintain Consistency】
Nothing falls; every loose object keeps its own slow spin and straight path until it touches something, then rebounds gently; hair and cloth float with slow inertia; one constant light direction from the {{high windows}}.
[CLOSE: <the bench creaking under her push>, <the toolbox lid rattling softly>, <a hollow tap as her palm meets the cabinet>]
```

**v0.2 notes.** 2-s peak: 4–6 seconds, mid-room. Every drift shot carries tracers (objects spinning slowly, hair spreading). A turning room reads as weightless to a viewer (DOSSIER §13.3), so never cut a drift next to a T-INC-2 shot without the outer-world cause shot (the fall) between them.

#### T-INC-4 · Time dilation: the outer world in extreme slow motion

Variant: whichever world is *outer* in the cross-cut (DOSSIER §7.4: the outer world is the slow one). Example fill: a bucket of water tipping from a fountain ledge in a courtyard.

```text
[OPEN]
【Generation Goal】
Generate one continuous shot in extreme slow motion, as if captured at a very high frame rate: {{a full tin bucket tips off a fountain ledge}} and its water spills into the air, while {{NAME}} turns her head toward it. Story job: in the world above, a single second stretches across this whole shot.
【Event Script】
0-4 seconds: Frame one is already running: the bucket is already tilting past its balance point; the water's surface stretches out of the rim as a long, smooth, glassy tongue.
4-8 seconds: the tongue breaks into ropes, then into beads; each bead hangs, wobbles and slowly flattens; light glints in each one; {{NAME}}'s head turn is barely visible, her hair lifting a few strands at a time.
8-10 seconds: the first beads touch the stone and spread into slow crowns; the bucket has turned only a quarter more. FINAL FRAME: the water suspended between ledge and ground, {{NAME}} mid-turn behind it.
A locked frame at about a 29-degree field of view, from 4 metres, focused on the water with {{NAME}} soft behind. {{LOCKED form}}
{{LOOK v0.2 block}}
【Maintain Consistency】
Extreme slow motion for the whole take with no speed-up; one sun direction from {{camera left}}; the water keeps its mass, falling slowly but always downward.
[CLOSE: <a low, stretched metallic tilt of the bucket handle>, <a slow, deep wash of water>]
```
Sound note: in post, replace the native audio with either designed silence or the stretched SIGNAL cue (§e). Slow motion has no fixed sound rule (DOSSIER §9.1).

#### T-INC-5 · The ramp: real time into stretched time

Untested. Two routes; run both as pilot drafts.
- **Route 1, in one take:** "0-2 seconds: natural real-time speed: {{a compressed-air burst begins}}. From 2 seconds time stretches: the same motion slows smoothly into extreme slow motion, as if the camera's frame rate climbs, and holds that slowness to the end."
- **Route 2, two takes cut on motion:** take A at natural real time ending mid-event; take B, the same Event Script in extreme slow motion, opening on the matching state. The cut is made in the edit on a frame where the motion direction matches.
- **Never** retime particle shots in post (b.1 rule 11). Retime solid-object shots only, and only by ≤50% with frame blending checked at 2 fps.

#### T-INC-6 · Practical burst: the G-rated "explosion"

Variant: any. Example fill: market stalls and a bookshop front along a sunny street. Never fire, never a weapon. Distance from the reference: never two people seated at a café table at the calm centre of the bursts; one person keeps moving, and the bursts have a cause in our story.

```text
[OPEN]
【Generation Goal】
Generate one continuous shot: {{NAME}} walks briskly down the middle of {{a market street}}, a parcel under her arm, while compressed-air bursts go off inside the stalls on both sides one after another, throwing {{paper, flour, dried rose petals, light cardboard boxes and foam oranges}} into the air. Story job: {{story job from the locked script}}.
【Subjects and Relationships】
Exactly one person; no one else at any point. Every burst happens at least four metres from her; nothing touches her; she never breaks stride.
【Event Script】
0-2 seconds: Frame one is already running: ordinary street; {{NAME}} walks toward camera.
2-6 seconds: the first stall bursts with a hard puff of air and white flour; a second later the next, then the next, travelling down the street toward camera; each burst throws its material outward fast, then it hangs and turns in the air, then it drifts down; pieces fly in uneven, unexpected directions, some straight up, some sideways into the street; boxes tumble and bounce once.
6-9 seconds: the air is full of slowly falling petals and paper; flour settles in a soft haze lit by the sun; she walks on through it, brushing a petal from her sleeve. FINAL FRAME: medium-wide, {{NAME}} walking out of the haze, debris settling around the edges of the frame.
A handheld medium-wide shot at about a 63-degree field of view, the operator walking backward ahead of her at eye height, flinching once with the nearest burst and recovering. {{travel line}}
{{LOOK v0.2 block}}
【Maintain Consistency】
No fire, no flash, no smoke column, no sparks; only air-driven material with real weight; she stays unharmed and calm; one sun direction.
[CLOSE: <sharp hollow puffs of compressed air in sequence>, <paper and petals fluttering>, <a box thudding on cobbles>, <flour hissing down>]
```

**v0.2 notes.**
- **Wording.** The prompt never says "explosion", "explodes" or "stylized slow motion" (b.1 rule 6).
- **Cut order:** the cause (the story beat that sets it off) → the first burst in a steady wide → one small physical tell as an insert (dust trickling from an awning seam, a hanging scale starting to swing; never a cup or glass on a table, which sits too close to the reference) → the spread around her as she keeps walking.
- **Speed** follows b.1 rule 10: natural real time, unless this street is the outer world in a cross-cut, where T-INC-5's ramp applies.
- **2-s peak:** 4–6 seconds, the debris at its hang.

#### T-INC-7 · Collapse borrowing a natural process

Variant DEEP. Example fill: a tall natural sea arch of pale stone, with an empty stone footpath on top, giving way. The collapse is modelled on a **cliff giving way** or a **sand dune slumping**, not a demolition. Never a town, a row of buildings or modernist blocks at the sea edge (g).

```text
[OPEN]
【Generation Goal】
Generate one continuous wide shot: {{a tall pale-stone sea arch with an empty footpath on top}} gives way and slides into the grey sea the way a sea cliff gives way, while {{NAME}} watches from the safe headland. Story job: this world is coming apart as the memory fades.
【Subjects and Relationships】
Exactly one person, on solid rock at least 100 metres from the edge. No one is on, under or near the arch.
【Event Script】
0-3 seconds: Frame one is already running: hairline cracks run along the base of the arch's legs; small pieces drop into the water.
3-8 seconds: the failure travels from the bottom up, in many small breaks before the big one: the legs crumble, then the span sags, leans out slowly, heavy and unhurried, and slides down in large pieces; pale dust rolls out low over the water.
8-11 seconds: the largest block meets the sea; a slow, massive grey splash rises and falls back; waves spread outward. FINAL FRAME: the coast with a raw new edge, mist and dust drifting, {{NAME}} a small figure on the headland at frame left.
CAMERA, aerial: a high travelling view from a heavy aircraft about 300 metres out, drifting slowly along the coast, about a 47-degree field of view. {{travel line}}
{{LOOK v0.2 · DEEP block}}
【Maintain Consistency】
The collapse moves slightly slower than real time because of its scale, never weightless; water heavy and grey; one diffuse overcast light; no fire, no people near the arch.
[CLOSE: <a long, low rumble of stone>, <rock pieces splashing>, <the deep wash of the big splash>]
```

**v0.2 notes.** 2-s peak: 5–7 seconds, the span in mid-slide. Plan at least two wides of 4–8 s, held about twice as long as the shots around them, then one smaller aftermath shot (the reference holds its avalanche wides about 2.3× the action around them, DOSSIER §13.3). Impact first, dry; the score after. No figure is ever caught in the flow. In DREAM-C use the salt-flat or white-desert swap (a dune slump, a wall of dust): snow, a mountain and white-clad figures together sit too close to the reference (g).

#### T-INC-8 · One-viewpoint impossible architecture, then the reveal

Variant: any dream. This is our own figure, not a looping staircase. Example fill: a footbridge that seems to join two rooftops.

```text
[OPEN]
【Generation Goal】
Generate one continuous shot: from one exact viewpoint a narrow stone footbridge seems to join {{rooftop A}} to {{rooftop B}}; as the camera travels sideways, the bridge is revealed as two separate pieces at very different distances that only lined up from the first viewpoint. Story job: {{NAME}} shows the trick that hides a path.
【Event Script】
0-3 seconds: Frame one is already running: the bridge reads as one continuous span; {{NAME}} stands at its near end, one hand on the rail.
3-8 seconds: the camera travels slowly to the right; the near half of the bridge stays close and large while the far half slides away behind it; a clear gap of open air opens between them; the far half is a small piece on a distant roof.
8-10 seconds: {{NAME}} looks back at camera, unsurprised. FINAL FRAME: the two halves clearly separate, open air between them.
A handheld wide shot at about a 47-degree field of view, starting precisely on the aligned viewpoint and travelling 3 metres to the right at walking pace. {{travel line}}
{{LOOK v0.2 block}}
【Maintain Consistency】
Both bridge pieces rigid and unchanging; only the viewpoint moves; perspective and parallax are physically correct throughout.
[CLOSE: <wind over the rooftops>, <her palm sliding on the stone rail>]
```

#### T-INC-9 · The kick: a waking cascade across worlds (cut pair)

Built from two or three separate generations, matched in direction and cut in the edit (05 rule: one camera per generation).

```text
SHOT 1 (outer world, e.g. REALITY or DREAM-A): the jolt.
… 0-2 seconds: Frame one is already running: {{NAME}} asleep, seated upright in {{a cable-car cabin}}. 2-3 seconds: the cabin stops hard at the station with a deep metallic clunk; {{NAME}}'s head and shoulders pitch forward with it. FINAL FRAME: the cabin swaying gently, {{NAME}} still asleep.
SHOT 2 (the world below, matched direction): the same lurch arrives as {{the floor pitching forward}}.
… 0-1 seconds: Frame one is already running: {{NAME}} standing in {{DREAM world}}. 1-3 seconds: the whole world lurches forward in the same direction as the cabin; she steps forward twice and catches a rail; loose objects slide toward the front of the frame.
SHOT 3 (the wake, outer world): her eyes open and she draws a sharp breath; her hands grip the seat edge. Natural real-time speed.
```
Edit: shot 1 at the first frame of the drop → shot 2 → shot 3, with designed silence 0.3–0.5 s before shot 3 (§e).

For a cascade, the deepest world's jolt comes first, each world wakes in order, and the cuts tighten from about 1.5 s to 0.5 s (§f).

G-safe jolts: a cable car or lift stopping hard, a car door slammed close by, a train carriage coupling. Never a chair tipped backward, water poured or a bathtub (too close to the reference's kicks), a fall from a height, drowning, a weapon or "dying to wake".

**v0.2 option, last wake only.** Inside the cascade keep the 0.3–0.5 s silence before each wake. For the last wake into REALITY, the score bed may instead carry across the cut with REALITY room tone rising under it, as one sustained drone bridges the reference's two wake close-ups (DOSSIER §13.3). Decide in the mix (§e.8).

---

## (c) Camera and coverage rules for the shot list

**Add these columns to every shot-list row:** World/variant · POV owner · size · field of view (02 ladder: 84 / 63 / 47 / 29 / 18°) · CAMERA form · move (one dominant) · the one impossible event (or "none") · its physical anchor · gravity direction · time state (real time / extreme slow) · sound signature (§e) · coverage mode (matched / asymmetric / event; rule 15) · transition device for a world change (rule 20) · 2-s peak for event takes (b.2).

1. **POV first.** Name whose shot it is before choosing anything else. Favour the camera entering a space behind the character (DOSSIER §4).
2. **Handheld is the default** for people in every world; locked only by choice. Operator wording comes from a.4.
3. **No zoom, ever.** Changing size means moving the camera and choosing a new field of view. Long lens (18–29°) only from a genuinely distant position.
4. **Two "formats".**
   - *Establishing wides*, one per world entry: deeper focus, finer detail, a steadier platform (AERIAL, ARM or a slow handheld walk), 63–84°. These stand in for the reference's large-format wides.
   - *People coverage*: handheld, 47–63°, close.
5. **Every world entry starts on its establishing wide,** unless the cut is a planned disorientation. The first frame of any shot must pass the **tight-shot legibility test**: palette, weather and sound signature alone tell the viewer which world it is.
   - **Machine legibility gate (v0.2, advisory).** Run `video_analysis` on our own 480p look tests and on the rough cut, never on reference frames. A world passes when at least two-thirds of its 1–2-s shots get its own light words and none gets the opposite family: REALITY "natural / daylight / lamp" (CONCOURSE "even / bright / overhead"); DREAM-A "cool / grey / rain"; DREAM-B "warm / lamp"; DREAM-C "white / cold"; DEEP "grey / mist / overcast"; TRANSIT "dim / cool / metal". The reference's trailers score 23 of 35 (66 %) with no contradiction (DOSSIER §13.3). A human still signs off.
   - Never copy the analyser's adjectives ("vibrant", "futuristic", "dramatic") into a look block: they contradict each other on the same image (DOSSIER §13.3).
6. **One dominant move per shot.** End it on a readable beat on a face (05).
7. **Gravity gags use the bolted form,** plus an independent reveal angle. Change the rig every time.
8. **Single camera for drama.** Generate each dramatic beat once, with one camera. **Several angles only for set pieces:** generate the same Event Script with 2–3 different camera sentences (arm, handheld, aerial) and cut them like a multi-camera stunt. Every set piece is generated at least once wide and once as a close reaction (a face or a hand); mediums are optional (rule 16).
9. **In chase and snow worlds, every shot moves** ("tumbling forward" energy, DOSSIER §4).
10. **Slow motion only per b.1 rule 10;** everything else is "natural real-time speed".
11. **Impacts.** Shake the frame once, hard, as if by hand. Never a constant shake.
12. **Blocking.** Gravity and hinge shots get a 04 Blender block-out (camera height in metres, hinge line, pivot axis, angles). A rough animatic cues the event timing, as the reference's fold animatics did.
13. **Shot-length budget per Seedance generation:** 4–10 s for coverage, 8–12 s for an event take. Event Script ranges follow 05 (never compress two beats into one motion).

**v0.2 rules.** From the machine observations in DOSSIER §13.2–13.3; the percentages are reference ratios, the rules are ours and PROPOSED.

14. **Dialogue size budget per scene:** about 55–60 % ECU/CU/MCU, about 35 % MS, **at most 10 % WS**. Each wide does one job: a world entry, a blocking change (someone stands, enters or leaves) or the event. Reference dialogue segments: 58 % tight, 37 % MS, 5 % WS.
15. **One coverage mode per two-hander.**
    - *Matched:* equal MCU singles with a soft foreground shoulder, for alliance or teaching.
    - *Asymmetric:* the POV owner in CU; the threat in MS, moving, with the camera following.
    - *Event:* rule 16.
16. **Impossible events are covered wide:** at least 80 % of event shots are WS or MS and at most 1 in 10 is close; reactions get CU or MCU at 29–47°. Reference effect segments: 90 % WS + MS.
17. **Exposition gets hands and stays inside action.** Every explaining scene gets 1–2 ECU inserts of an action that shows the rule (drawing, building, sorting). A spoken rule inside an action world comes as a CU / reverse block of 2–3 s per line, 15 s at most, over that world's ambience only, then straight back to motion.
18. **Threat reveal order:** sound → insert → figure. The figure's first look sits near the lens, inside 2–3 s of designed silence (§e.7). G: calm and uncanny, never menacing; no weapon and no broken glass.
19. **Trouble is cued off-screen first:** a look, a sound or a question, then the event.
20. **A transition device for every world change:** the TRANSIT vehicle with its own sound, a voice-over bridge, a sustained cue across the cut, or a retroactive reveal (a question nobody can answer). **Never optical:** no dissolve, tint, flash or glow. The reference uses all four devices and none of the optical ones (DOSSIER §13.3).
21. **Object inserts may be LOCKED** (PROPOSED, a narrow exception to rule 2; needs the user's yes). People stay handheld.
22. **Zoom QA.** In our drafts, a change of size with no change of parallax is a zoom: reject the take. An analyser's "zoom" or "static" proves nothing either way (DOSSIER §13.1).
23. **Spend the longest face hold on the turn,** a realisation, and still end on a readable beat on a face (rule 6).

---

## (d) Score brief: Suno v6 and ElevenLabs Music v2.5

Instrumental only. **No composer, film, song or franchise names in any prompt** (06 rule 3). Our own motif only. **Never** use, sample, stretch or imitate the reference's score or its in-story song. Its cue's chord loop (minor key i–v–VII–IV) and its two-note low brass figure are off limits. Licence warning (06): *ElevenLabs Music may enter the film only under an Enterprise Music contract on file.*

### d.1 The method we borrow: one rule, not one melody

1. **Human seed.** The user hums or plays a 4–8-note motif into their phone (06 §6.1.2): `SLA_06_MOTIF-SIGNAL_USR_v01.wav`.
2. **The SIGNAL cue.** This is our in-story alarm, the shared clock every world syncs to. It is a short, original, clearly diegetic piece played from a source in REALITY (a wind-up music box, an old radio, a phone alarm melody), built on that motif.
   - **Master pulse: 120 BPM** (one 4/4 bar = 2 s).
   - The SIGNAL is the *only* place the motif sounds plainly and in real time. The emotional score never quotes it plainly (keep alarm and emotion apart), except at **one** planned counterpoint climax.
3. **The tempo law.** Every cue's tempo is a ratio of the master pulse. Each world down halves the felt time:

   | World | Ratio | Tempo | 4/4 bar | How the SIGNAL sounds there |
   |---|---|---|---|---|
   | REALITY | ×1 | 120 BPM | 2 s | as written |
   | DREAM-A | ×½ | 60 | 4 s | one octave lower, twice as long |
   | DREAM-B | ×¼ | 30 (felt as 60 half-time) | 8 s | two octaves lower, four times as long |
   | DREAM-C / DEEP | ×⅛ | unpulsed sustained swells | — | three octaves, eight times: a sustained low chordal statement of the whole motif, never a two-note brass blast |

   [DERIVED] Powers of two always nest: every layer shares a downbeat every 4 s (2 bars at 120, 1 bar at 60). That 4-s grid is the cross-cut climax's cut grid (§f). Optional friction: a ×⅓ world at 40 BPM meets the 120 layer every 1.5 s and the 60 layer every 3 s (3 against 4).
4. **The slowed-motif low statement.** At least the first three notes of the motif, slowed ×4 or ×8 by tape slow-down (pitch falls with speed), become the score's big low statement, voiced as chords in low brass and low strings. Real-instrument doubling then comes from the generator prompt ("sustained low brass and low strings chords carrying a slow three-note phrase"). The notes come **only** from our motif. Never a two-note unison brass blast: that gesture is the reference's best-known sound and the trailer cliché built on it.
   - **Placement (v0.2).** Inside the film the low statement tells story: it is never placed on a title card and never used as a cut transition. Hits on text are trailer grammar (15 of 18 trailer hits sit on cards, DOSSIER §13.3); the reference score's low brass tells story and does not bridge transitions (DOSSIER §8).
   - **Guard (v0.2).** No cue whose main texture is isolated low hits with long resonant tails at regular intervals for more than about 30 s: a machine describes the reference's own cue and the trailer cliché in those same words. Our low statements move (the three-note chord phrase) and vary their spacing.
5. **The cathartic ostinato** for the return to reality, the emotional core:
   - a 4-bar loop at the master pulse whose four chords each could be home, with no dominant-to-tonic cadence;
   - add one layer per pass to a peak;
   - drop abruptly to the small solo voice (6 below) on the reveal, not to solo piano;
   - end on a chord that is not the opening chord.

   A generic example to test: D minor i–VI–III–VII. Write the real loop under the user's motif.
   - **Sound-alike check before lock:** play the cue beside the reference's best-known cues to two people who know the film; if either names it, change the loop, the instrumentation or the form.
6. **Sound world:**
   - hybrid orchestral and electronic, roughly half and half;
   - orchestra playing synth-like parts, electronics re-recorded in a real room (we emulate this with our own impulse responses, §e);
   - one **small, strictly written solo voice** that never dominates. The user chooses it: oud, cello or nylon guitar. A 12-string guitar is avoided as too close to the reference's signature.
   - "Something small and fragile in the middle" of the big sound.
7. **Break the palette once,** in the one action set piece: drier, more percussive, faster subdivision.
8. **Score early.** Sketch cues from the script before picture lock and play them on the animatic, so no temp track from another film ever enters the cut.
9. **Prompt wording (v0.2).** Name instruments: "low brass and low strings chords", "felt piano". Never "orchestral hits", "bass hits" or "braam": those are exactly the words the reference and its trailer cliché are described with (DOSSIER §13.3).

### d.2 Building the stretched layers (local, non-AI; tested 2026-11-02 on synthetic tones in this session)

```bash
# tape slow-down: x2 slower = one octave lower; x4 = two octaves (2 s became 8 s in the test)
ffmpeg -i SIGNAL_motif.wav -af "asetrate=48000*0.25,aresample=48000" -c:a pcm_s24le SIGNAL_x4_tape.wav
# pitch-kept stretch, for the same notes at their pitch (8 s became 16 s at tempo=0.5)
ffmpeg -i SIGNAL_motif.wav -af "rubberband=tempo=0.5:pitch=1" -c:a pcm_s24le SIGNAL_x2_stretch.wav
# worldize through our own impulse response (pad first so the tail is not cut)
ffmpeg -i SIGNAL_x4_tape.wav -i IR_stairwell.wav -filter_complex "[0:a]apad=pad_dur=3[d];[d][1:a]afir=dry=10:wet=10[o]" -map "[o]" -c:a pcm_s24le SIGNAL_x4_world.wav
```

Then: conform per 06 §6.1.8, place at 48 kHz/24-bit, and log as USR/PROC (non-AI) for the disclosure.

### d.3 Suno v6 package: M-CLIMAX layer A (the 60 BPM low-brass layer)

Each tempo layer is generated **separately** and stacked on the 4-s grid in the edit. Suno does not reliably hold two tempos in one generation (06).

```text
STYLE: Dark hybrid orchestral-electronic underscore, 60 BPM steady half-time feel, D minor, sustained low brass and low strings chords carrying a slow three-note phrase, low strings pulsing in eighths, deep analog synth bass, metallic textures recorded in a large stone room, slow crescendo over the whole cue, wide dark hall reverb
LYRICS:
[Intro: low strings, pp, sparse]
[Build: brass swells enter]
[Build: synth bass joins, mf]
[Peak: full low brass, ff]
[Outro: sustained, unresolved]
[End]
EXCLUDE: vocals, choir, drum kit, EDM, ticking clock
SETTINGS: v6 · Instrumental On · Variety Off · Max Mode On · Weirdness 30 % · Style Influence 65 % · Duration {{cue length + 4 s}}
(bar math: at 60 BPM one 4/4 bar = 4 s; land each world-cut on a 4-s downbeat)
```
Layer R is the same box at "120 BPM, driving string ostinato in sixteenths, tight low synth pulse". Layer B is "30 BPM felt as 60 half-time, felt piano and soft pad, very sparse". Same EXCLUDE and SETTINGS. v0.2 took the tick out of Layer R: it lives only on its own SFX stem (the ticking pulse device, d.4).

### d.4 ElevenLabs Music v2.5 plan: M-RETURN, the cathartic ostinato (80 s)

The design is 10 passes of an 8-s module (4 bars at 120 BPM), with the reveal as a HARD sync at 64.0 s on a chunk boundary.
`SLA_M-RETURN_EL-PLAN_v01.json`:
```json
{"chunks": [
 {"text": "[Intro]\n{solo felt piano and a soft synth pad, the four-chord loop, pp}", "duration_ms": 16000,
  "positive_styles": ["instrumental", "hybrid orchestral-electronic underscore", "120 BPM felt as half-time", "D minor", "felt piano", "soft analog pad", "intimate close-mic'd"],
  "negative_styles": ["vocals", "choir", "humming", "drum kit", "resolution cadence"], "context_adherence": "high"},
 {"text": "[Build]\n{high strings join the same loop, mp}", "duration_ms": 16000,
  "positive_styles": ["same four-chord loop", "high strings"], "negative_styles": ["vocals", "new melody"], "context_adherence": "high"},
 {"text": "[Build]\n{low string ostinato and synth pulse join, mf, one small solo instrument line}", "duration_ms": 16000,
  "positive_styles": ["low string ostinato", "synth pulse", "small solo voice, strictly written"], "negative_styles": ["vocals", "drum kit"], "context_adherence": "high"},
 {"text": "[Peak]\n{full low brass on the loop, ff, the widest sound of the film}", "duration_ms": 16000,
  "positive_styles": ["massive low brass", "full orchestra", "huge hall"], "negative_styles": ["vocals", "choir", "cymbal crash"], "context_adherence": "medium"},
 {"text": "[Drop]\n{everything stops; the small solo instrument alone plays the loop, p, ending on an unresolved chord}", "duration_ms": 16000,
  "positive_styles": ["{{solo voice: oud, solo cello or nylon guitar}}", "exposed", "bone-dry", "unresolved ending"], "negative_styles": ["vocals", "piano", "brass", "resolution cadence"], "context_adherence": "medium"}]}
```

**v0.2 notes.**
- The Peak chunk (48–64 s, 60–80 % of the cue) matches the sourced form of the reference's cathartic ostinato, which peaks at 62–77 % (DOSSIER §8). Do not move it earlier on the machine's first peak (1:30–1:45 of "Time"): that is 46–54 % of the 3:15 the analyser covered, but only 33–38 % of the 4:35 album track, and its second peak (2:45–3:00, 60–65 % of 4:35) sits near the sourced form (DOSSIER §13.2.4, §13.3).
- **Optional texture bookend (PROPOSED).** In the Drop chunk, the opening pad may return under the solo voice for the last 8 s. The cue still ends on a chord that is not the opening chord (d.1 rule 5).
- M-RETURN stays scored even if an analyser logs the return as ambience (DOSSIER §13.4).

**Ticking pulse device.** A dry mechanical tick on the master pulse (2 per second) runs in REALITY whenever the clock matters. Heard in deeper worlds, the same tick plays at that world's ratio and drops in pitch (d.2 tape slow-down), so the audience *hears* the time ratio. Build it procedurally (`python3 -I scripts/sfx_forge.py one ui_tone --dur 0.15 --args '{"kind":"tick"}' -o tick.wav`; not run in this session because scipy is not installed here), never from a generator. It is an SFX element, owned by §e. Keep it dry, diegetic and on its own SFX stem, never inside a score stem: a machine heard a tick-like pulse in the opening of one reference cue (DOSSIER §13.3), so a tick inside our score bed raises the sound-alike risk.

### d.5 QA of our cues (v0.2)

- An analyser cannot judge the hybrid ratio (d.1 rule 6) or catch a sound-alike (d.1 rule 5). It calls hybrid music "orchestral", files low brass as "bass" and never hears piano (DOSSIER §13.1).
- Measure the ratio from our own stems: summed RMS of the electronic stems against the acoustic stems, per cue. Keep the two-listener test.
- Use the analyser on our cues for three checks only: the layers enter in the planned order, the peak lands in its planned window, and no closing window describes a "resolution".
- Never use automated captions to check whether score is present or how much music there is. Check the stems.

---

## (e) Sound design brief

Owner: the 06 SFX step and the 07 mix. Facts: DOSSIER §9.

| World | Signature (ambience and treatment) | Low end | Room |
|---|---|---|---|
| REALITY | full-band natural ambience, real-time | natural | small real rooms |
| DREAM-A | dense rain bed; traffic and footsteps pitched about 3 semitones down | wet rumble | street slap-back from our own street IR |
| DREAM-B | warm room tone, the hum of the lamps, wood creaks; pitched about 6 semitones down from the world above | soft and close | dry, carpeted |
| DREAM-C | wind, snow crunch, a sterile high hum; very little mid-range | thin | open-air echo from our own canyon or valley IR |
| DEEP | sea wash, distant stone falls, near-silence | deep and slow | huge, diffuse |
| TRANSIT (v0.2) | its own mechanical voice: metal, a low rumble, moving air; heard in no other world | the vehicle's rumble | small, enclosed, metallic |

1. **Re-pitch rule.** A sound that crosses into a deeper world arrives pitched down and slowed: one engine hum becomes the next world's traffic. Do it in post with d.2's tape slow-down. Never ask Seedance for it.
2. **The world-transition cue.** One signature low sweep used for every descent:
   - Source: two oscillators, a chirp from 10 Hz up to 25 Hz, plus two close tones beating (21 against 22 Hz = a 1 Hz beat).
   - **Doubled by audible harmonics** at 42/44 and 63/66 Hz, because phones and laptops reproduce nothing under about 40 Hz [INFERRED, check on the target speakers].
   - Worldized through our own impulse response, then chords built from the recording.
   - Tested 2026-11-02 in this session:
   ```bash
   ffmpeg -f lavfi -i "aevalsrc='0.5*sin(2*PI*(10*t+1.5*t*t))':s=48000:d=5" -c:a pcm_s24le sweep_10-25Hz.wav
   ffmpeg -f lavfi -i "aevalsrc='0.35*sin(2*PI*21*t)+0.35*sin(2*PI*22*t)+0.12*sin(2*PI*42*t)+0.12*sin(2*PI*44*t)+0.06*sin(2*PI*63*t)+0.06*sin(2*PI*66*t)':s=48000:d=6" -af "afade=t=in:d=1.5,afade=t=out:st=4:d=2" -c:a pcm_s24le beat_21-22Hz.wav
   ```
   Or use `sfx_forge.py` `sub_boom` (`f0`, `glide`) and `riser` for the procedural versions.
   - **v0.2:** under the sweep, layer the TRANSIT vehicle's mechanical sound (metal, rumble, moving air), so each descent has a physical source. The reference's descent rides a lift's screech, rumble and wind (DOSSIER §13.3).
3. **Echo chain.** One event, re-scaled per world. G-safe example: a door slam in REALITY → thunder in DREAM-A → a deep ground shudder in DREAM-B → stone calving in DEEP. Same rhythm, larger scale each time.
4. **Our own impulse responses.** Record a balloon pop or a hand clap in a stairwell, a street, a car park and a canyon or valley on the phone at 48 kHz, and use them with `afir`. This is human-made, non-AI authorship evidence.
5. **Weight transfer.** Every impossible object gets heavy real sounds layered under it: stone grinding and big machinery under a hinge; a heavy vehicle under a light generated one. Seedance's native audio is kept as a layer where it passes QA (06 rule 6). **Onset dry (v0.2):** every impossible onset and every hard impact carries effects only; the score joins on the reveal or after the impact. Each event take carries one distinct transient that reads in 1 s; lay it before any music (DOSSIER §13.3).
6. **Debris.** Close-miked fly-bys of real light debris (paper, pebbles, petals) thrown past the phone mic. Aim for awe, not lethality.
7. **Silence is designed.**
   - 0.3–0.5 s of near-silence before every waking cut.
   - One full dropout per film at the deepest moment.
   - For slow motion, either keep the real-time ambience or replace it with one unrelated designed sound. There is no fixed rule.
   - **v0.2:** 2–6 s of near-silence at *threshold judgements*: a threat's first look, or a gate or check that decides a character's fate (DOSSIER §13.3).
   - Keep two silences apart. A cue's long resonant decay into silence is how a cue leaves; the 0.3–0.5 s gap before a wake is a cut tool. An analyser cannot see sub-second silence: check these on our own waveform.
8. **The kick.** A sharp transient, then a sub drop (`sub_boom`), then silence, then the waking breath in the outer world. In the cascade, each world's kick is a little higher in pitch than the one below it, ending on the clean, real-time REALITY room tone. **v0.2 option for the last wake only:** the score bed may carry across the cut with REALITY room tone rising under it, instead of the hard switch (T-INC-9).
9. **Mix intent (for 07).** A dense track. Music may "take over everything" at two or three moments only. Dialogue stays clear everywhere else. Streaming reference: about −27 LKFS dialogue-gated, true peak ≤ −2 dBTP. Check the Summit delivery spec. Dialogue leaves the track during effect runs: park lines between them (3 % of the reference's effect segments are dialogue-led, DOSSIER §13.2.2).
10. **Signature first (v0.2).** On entering an action world, play 10–16 s of its sound signature with no music before the score joins. The reference's high snow world runs 16 s of effects first (DOSSIER §13.3).
11. **Rest after motion (v0.2).** When the outer world stops, drop the score to one sustained low tone; a low pulse then carries the exit.
12. **The quiet beat before the cascade (v0.2).** One beat of 8–12 s with soft score and one small diegetic sound, placed just before the kick cascade. It holds longer than any effect shot near it ((f) block 4).
13. **Pre-echo (test only, not a rule).** A world's signature sound may be heard faintly before its image or line appears. One machine reading suggests it (DOSSIER §13.3); test it on the animatic.

---

## (f) Editing rhythm for a 5–7 minute film

Runtime target (00 F2): story **5:30–6:34**; titles + story + credits ≤ 7:00. Shown here for a 6:15 story. All timings and average shot lengths (ASL) are **PROPOSED**: the reference's ASL is not published (DOSSIER §10.2). v0.2 uses the machine segment figures in DOSSIER §13.2 for ratios and order only; never cite 4.91 s, 4.26 s, 1.7 s, 11.46 s or any other analyser number as the reference's ASL.

**Recommendation: three worlds, not five.** REALITY plus two dream worlds carry the cross-cut, with DEEP only as a cold open or coda. The reference intercut four timelines plus a frame over 148 minutes (DOSSIER §10.2). Six minutes cannot teach more than three rule-bound worlds without losing the audience. The reference's editor: "there's nothing worse than a film where the audience gets lost."

| Block | TC | Worlds | Job | ASL |
|---|---|---|---|---|
| 1 Cold open | 0:00–0:35 | DEEP or a dream | in the middle of an impossible event treated as ordinary; ends on a kick | 5–6 s |
| 2 Rules by doing | 0:35–1:45 | REALITY → DREAM-A | teach at most three rules by action, not explanation: the time ratio, the kick, the anchor object. One line of dialogue with numbers that add up; plant the SIGNAL cue | 4–5 s |
| 3 Descent | 1:45–3:00 | REALITY → A → B | each world opens on its establishing wide; set the deadline (when the SIGNAL will play) | 4–5 s |
| 4 Cross-cut climax | 3:00–5:15 | REALITY, A, B intercut | the outer world's slow-motion event is the spine (one long fall, roll or drift seen in pieces); every cut is cause → effect between worlds; cut on the 4-s grid (d.1); world runs shrink about 16 → 8 → 4 → 2 s toward the kick; one quiet beat of 8–12 s just before the cascade (§e.12) | outer world 3–4 s per cut, inner worlds 2–3 s, tightening toward the kick |
| 5 Kick cascade | 5:15–5:45 | deepest → outer, in order | each world's jolt fires as the SIGNAL reaches it; designed silence before REALITY | 1.5 s → 0.5 s, then a hold |
| 6 Return | 5:45–6:15 | REALITY (HOME or CONCOURSE) | the cathartic ostinato (M-RETURN); the reveal cut on the 64-s hard sync; an open ending | 7–9 s (v0.2; was 6–8 s); final hold 12–15 s, checked against the runtime cap |

**Pace by function (v0.2, PROPOSED).** The ratios and their order come from machine segments (DOSSIER §13.2); the values are ours.

| Function | Our target | Reference ratio [OBSERVED-MACHINE] |
|---|---|---|
| Confrontation, threat | 2.5–3.5 s | 3.1–3.4-s segment means, the shortest dialogue scenes |
| Memory or confession montage | about 3 s per image, carried by voice-over; return to one anchor insert every 10–20 s | 3.4 s; six returns to motif inserts in 65 s |
| Teaching, rules (blocks 2–3) | 4–5 s, unchanged | between teaching (6–7.5 s, merged) and confrontation |
| Action run (chase, high-ground world) | 1.5–2 s | 1.6 s in the snow action |
| Exposition inside action | 2–3 s per line, at most 15 s | close-up / reverse blocks between action runs |
| Impossible event | event wide 5–7 s ↔ reaction close 2–3 s | the fold |
| Big natural event (T-INC-7) | about 2× the shots around it | ×2.3 (avalanche) |
| Climax quiet beat | 8–12 s, the longest hold in block 4 | 7–16-s segments before the cascade, with one 4-s cut-away |
| Return | 7–9 s; final hold 12–15 s, about 1.8× the block mean | 9.2 s; final hold 17 s (1.84×); about 3× the confrontation pace |

**Cutting rules:**
1. **Legibility.** Before any cross-cut, the incoming shot's first frame must identify its world by palette, weather and sound alone (the reference DP's tight-shot test). If it doesn't, put that world's establishing wide first. Run the machine gate ((c) rule 5) on the rough cut.
2. **Cause → effect cuts.** Sway, roll or drop in the outer world → lean, turn or float in the inner world, in the same direction. Never cut between worlds on unrelated action in the climax.
3. **The clock is always readable.** The SIGNAL, the tick and one visible countdown object in REALITY. Return to the clock about every 30–40 s in block 4.
4. **The outer world is slow, the inner worlds are real time** (DOSSIER §7.4). Never show the inner world in slow motion during the cross-cut, or the audience loses the ratio.
5. **Cutting for time is cutting for clarity.** Cut repetition first, never a rule or a clock beat ("tell them only once").
6. **Hold the music back** on a scene until its picture works dry (the reference editor's habit). Then lay the score on the grid.
7. **Shot counts.** 375 s at an ASL of 3.5–4.5 s is about 85–105 shots [ARITH], before Seedance takes and coverage pairs. Check against the 70% Seedance share and the shots-per-day plan (00).
8. **World runs, not only shots (v0.2).** Plan block 4 as world runs (consecutive shots in one world) that shrink toward the kick. During an inner world's gravity event, that world gets the long runs (the reference gives its turning hotel 80 % of the middle third of one intercut); cut back to the outer world at each change of cause: sway, roll, rest.
9. **Never an optical transition** between worlds ((c) rule 20).
10. **Analyser rhythm checks** count only when the analyser's scene count is within about 10 % of our EDL's shot count; otherwise measure from the EDL. The same reference trailer came back once as 76 scenes and once as 10 (DOSSIER §13.1).

**Teaser (only if we cut one; PROPOSED, 60–90 s).** Trailer pace is never film pace. These numbers come from the reference's two shot-level trailers (DOSSIER §13.2.3).
- Picture ASL 1.5–2 s; text cards on 15–25 % of the runtime; about 35 % of shots carry our own rule lines as voice-over.
- The fastest third in the middle; one 6–7-s hold on our most impossible G-safe environment; a slow-down into the title, then one post-title beat.
- Sound: a continuous low bed under everything. Hits sit on cards only, built from our slowed-motif low chord (never a two-note unison blast), 4 s apart on our grid (2 bars at 120 BPM), tightening to 2 s (1 bar) in the middle third. End on one quiet post-title beat in real-time REALITY room tone.
- Banned (g): bookends on a spinning object; title or card animation built from a turning metal mechanism or maze.

---

## (g) G-rating and Summit IP cautions

**G rating.** The reference is a thriller with gunfights and death mechanics; our film keeps the grammar and drops the violence.
- **No guns, gunfire, armed guards, shoot-outs, bullet impacts or weapon sounds.** Stakes come from chases, puzzles, gravity, weather and time.
- **No fire, real explosions, smoke columns, sparks or flashes.** Bursts are compressed air with light materials (T-INC-6).
- **No injury and no one trapped.** No one inside a collapsing structure, no drowning, no falls from height. Vehicles in danger are empty.
- **No "dying to wake up" rule.** Kicks are harmless jolts (T-INC-9).
- **Calm, readable faces in danger.** Use calmer words ("amazed", not "terrified"; 05 §5.2).
- **No weapon, broken-glass or blood insert in a threat reveal** ((c) rule 18).

**IP: never recreate the reference's specific shots, sets or designs.** That means:
- no Parisian street folding overhead; no mirror doors on a bridge; no looping staircase;
- no rotating hotel corridor with sconces; no sideways elevator shaft; no train ploughing through a street;
- no snow fortress, ski assault or modernist city calving into the sea;
- no Japanese castle dining hall; no van falling from a bridge;
- no spinning top or any "totem" object resembling the four;
- no rotating corridor of any kind (use a room); no two people seated at a café table while the street bursts around them; no chair tipped backward or bathtub as a waking jolt; no buildings collapsing into the sea; no story beat of a newcomer learning to bend a city.
- **v0.2:** no cage lift with numbered buttons as a transit vehicle; no cup or glass trembling on a table as a burst's tell; no collapse that puts snow, a mountain and white-clad figures together; no warm memory room that is a house standing in or at the edge of water; no trailer or teaser bookended on a spinning object; no title or card animation built from a turning metal mechanism or maze.

**Words and names.**
- No character names (or near-names) and no coined jargon in the script, titles or submission: totem, extractor, architect-as-role, point man, forger, dream-share, "inception".
- "Kick" and "limbo" stay working words in our documents only; the script uses our own terms.

**Music.** No in-story French song and no stretching of it. No recognisable score figures (d). No temp from the reference.

**Prompts and submission.**
- No film title, director, DP, designer, composer, actor or gear brand in any prompt (02 hard rule 2).
- No "in the style of …" anywhere: not in prompts, the logline, the submission form, the disclosure, credits or marketing.
- The look code `INC` lives only in our documents.

**Disclosure.** Describe the tools honestly: Seedance 2.5, the image models, Suno or Eleven Music, procedural SFX. Never imply film cameras, a film crew or any real person's involvement. Credits list only the real people who worked on our film (Summit R2: no implied endorsement).

**References.** Frames from the user's own legal copy are for analysis only. They are never uploaded to Higgsfield, Midjourney or any model (02 hard rule 1). Official trailers and licensed clips may be analysed (machine scene analysis, or frames kept only in the session scratchpad); no frame or clip ever enters the repo or a generator.

**Moderation.** If a draft is blocked on violence or IP words, treat it as a content signal and change the content (05 rule 13), never the wording to slip past.

---

## (h) Next steps (each needs the user's yes)

1. **The user decides:**
   - D-9 frame;
   - the world axes (a.0);
   - the new CAMERA forms (a.4);
   - which worlds the locked script needs.
2. **Optional measurement.** The user supplies 6–12 stills per world from their own copy, Claude measures them (DOSSIER §11), and LOOK-INC becomes v0.3. v0.2 already holds the machine-observation refinements; its hex and Kelvin values are still the v0.1 proposals.
3. **Shoot-out** per 02 §2.8 on the five engines, about 392 credits for five variants, about 471 with TRANSIT [ARITH] (quote first). Then one Seedance look-test draft each for REALITY and the most different dream world. Run the machine legibility gate ((c) rule 5) on each look test.
4. **Pilot tests**, as 480p drafts:

   | Test | Template | Question |
   |---|---|---|
   | T-INC-A | T-INC-2 | Does Seedance hold a room still while gravity turns inside it? |
   | T-INC-B | T-INC-1 | Does the hinge stay rigid, or does the slab bend? |
   | T-INC-C | T-INC-5 | Ramp in one take, or two takes cut? |
   | T-INC-D | T-INC-4 | Does extreme slow motion hold for the whole take with water? |
   | T-INC-E | T-INC-6 | Does the burst read as G (no fire or flash)? |

   One variable per draft; log each in `prompt-library/seedance-dream.md` with the verdict.
5. **Music.** The user records the motif; then the SIGNAL cue, the d.2 layers, and the T2 cards for M-CLIMAX and M-RETURN (06).
6. **Data hygiene.** Re-run the failed or partial machine analyses listed in DOSSIER §13.5 only with the user's yes. Promote an [OBSERVED-MACHINE] line only when a sourced fact or a measured still agrees.
