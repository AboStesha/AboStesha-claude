# style

Entries newest last. Template: README.md.

---
## Templates from the 2026-11-02 film studies

Source: `studies/2026-11-02_CROSS-STUDY.md` §3A.4, §3C.1, §3C.3 and cards 6 and 8. Fill-in templates, not approved generations. Our 02 hard rule 2 bans camera, lens and stock brand names in prompts, so every template below describes the visible effect instead (several studied films used brand names; their quotes are in the CROSS-STUDY). Film codes as in characters.md. 11/12 films pasted one frozen look text into every prompt.

### TEMPLATE (from studies 2026-11-02) · Look card
- Sources: B (frozen look strings; version in the header), S (identical `[VISUAL STYLE]` in 13/13 + one grade slot; references "no grain overlay"), L and H (pre-graded plates).
```text
LOOK v__.__ (frozen <date>) · sha256 <…> · variant: R-DAY | R-INT | DREAM | BROADCAST | FINALE
LOOK LINE (pasted verbatim into every Seedance prompt): <medium anchor> · <palette: dominant + one accent> · <black level> · <grain: none at generation | named> · <optics as visible effect> · <camera habit>
COLOR SCRIPT: <accent> is the only saturated <hue> in <world>; reversed in <scene>; absent after <beat>.
SCENE LIGHT (the one line that may change per scene): <practical sources, direction, time of day>
GRADE SLOT (only on the look-in-plates route): <asset id> "sets the grade, grain and contrast … match it exactly"
REFERENCES STAY CLEAN: sheets and plates "no grain overlay, no vignette" · plates pre-graded? yes/no
POST GLUE: <global grade node> · <letterbox inside 16:9?> · <vignette> · <grain in post only once>
```

### TEMPLATE (from studies 2026-11-02) · Look-dev still (style anchor) → `look`
- Sources: T (style-anchor order; winners became world references), S E6 (village anchor), U (suffix on 967/1,194 stills). Run 2–4× each in Sunburst and Nano Banana Pro, plus Midjourney by hand, then freeze the winner (5/12 films ran such a shoot-out).
```text
Film frame from {{genre}}, {{the stock's visible behaviour: "warm, pushed-film contrast with halation
around practicals and coarse even grain"}}, {{field of view or lens length}}.
{{Place, time, weather}}. Composition: {{one line}}.
Light: {{the one source; where it stops}}. Palette: {{60% x / 30% y / 10% z}} — {{one dominant hue,
one accent}}. Film behaviour: {{grain, roll-off, halation where, black level}}. Operator habit:
{{e.g. "horizon a few degrees off level"}}. Texture: {{surfaces}}. No people. No text.
No HDR, no sharpening halos, no glossy skin, no beauty lighting, no fake vintage filter.
```
- One anchor per world (S had village, sea, underwater, European beach). Log where each anchor is used: 2 of S's 3 anchors were never attached to any video job.

### TEMPLATE (from studies 2026-11-02) · Colour-script line
- Source: S (the motif rule in 10/13 Seedance prompts; reversed on purpose in one scene, removed from the mother after the departure); F (red reserved for story objects).
```text
The {{object}} is the ONLY saturated {{hue family}} object in any {{world}} frame.
{{Reversal scene}}: the {{object}} is almost lost against the {{brightness}} — the reversal of every other frame.
{{After <beat>}}: no {{hue}} anywhere in the frame.
```

### TEMPLATE (from studies 2026-11-02) · Operator camera sentence
- Sources: S (13/13), B, L, F, H, C (6/12 used operator wording); K ("static handheld", 30/43 static/locked).
```text
HANDHELD: the camera is a person physically present: it breathes, drifts and micro-adjusts, catches focus
a beat late; no smooth stabilised gimbal, no drone, no crane, no orbit, no zoom; framing changes only by
moving the camera.
LOCKED: a locked frame with only a faint breathing sway; the subject moves inside the frame, the frame
never follows.
```

### TEMPLATE (from studies 2026-11-02) · Optics unification pass (look-in-plates route only)
- Source: F E3 (154 jobs on the parking-lot, control-room, corridor and basement plates). Use only if the D1 route test chooses graded plates (CROSS-STUDY D-2).
```text
Edit the image: apply the optical character of {{lens behaviour in words: "a fast wide vintage prime —
uncorrected barrel distortion, a lift in the blacks from veiling flare, soft corners"}} to this {{place}}.
Do not change the lighting. Do not change the exposure, the colour temperature, the grade, the time of day
or the weather. This edit is about the lens only. {{Each optical trait as a visible instruction on the
plate's own lines: "the {{handrail}} bows outward, its near end swinging toward the lower left corner"}}.
It stops short of a fisheye. The frame stays filled to all four edges.
AVOID: {{haze, bloom, fisheye, black wedges, re-grade, relight, added people, invented text}}.
```

### TEMPLATE (from studies 2026-11-02) · B&W by design (only for a B&W or near-monochrome sequence)
- Source: BZ (measured on 45 matched frames; all renders colour, converted in post); K (B/W bookends). 0/12 films asked the video model for black-and-white.
```text
VALUE IN B&W: {{CHR_A}} = {{white: "bone-white wrap"}}; {{CHR_B}} = {{black}}; {{prop}} = {{light grey}}; ground = {{dark}}.
{{CHR_A}}'s {{garment}} stays the brightest thing in frame after the {{window / sky band}}.
LIGHT: one source, {{the window at frame-left}}, is the only light; the rest of the room in deep shadow,
dark and low-contrast but not pure black — shapes still readable. {{Backlight / thin rim on hair and cheek}}.
COLOUR: muted and desaturated; no competing hues within one frame; warm only where the {{window}} light falls.
No film grain, no added texture, no glow or bloom, no digital sharpness.
```
- Post conversion (BZ's curve, the study's own ffmpeg test): `colorchannelmixer` with Rec.709 weights → `curves=master='0/0.04 0.15/0.12 0.3/0.24 0.45/0.36 0.6/0.44 0.75/0.54 0.9/0.62 1/0.72'` → vignette ≈ −0.25 stop → grain once → 10-bit. Targets: black 3–5%, median scene ≈18%, peak white 70–80%.
- Preview every keyframe desaturated with that curve before spending video credits; if two important objects merge into one grey, change the wardrobe value or the light in the still.

### TEMPLATE (from studies 2026-11-02) · BROADCAST / in-world recording treatment
- Source: C archive intro (12 jobs in the film; "No film grain" in 18/25 intro prompts). Fit to our BROADCAST variant is [INFERRED]. The Seedance shot template is in seedance-establishing.md.
```text
{{SOURCE}} TREATMENT — THIS IS THE GOVERNING STYLE: covered by {{who: the venue's fixed house camera /
a news crew inside it / a backstage handheld}}; {{camera behaviour}}; available light only, and clearly so;
uncorrected colour; exposure ridden by hand, one visible correction per shot; one focus hunt and recovery,
landing within half a second; video, not film; no grain, no tape artefacts, no found-footage overlay.
```
- Post (the study's calibration on C's frames): scale to 720×540 and back → saturation ×0.65, contrast ×0.9, blacks +0.03 → light temporal noise → the source's ratio inside the film frame. No tape overlay, no fake timecode.

### TEMPLATE (from studies 2026-11-02) · Crop-safe sentence (only if the film is letterboxed)
- Sources: B ("16:9 protecting a 2.39:1 crop"), TK ("keep faces and actions inside the central ~74% of the image height"), BZ ("16:9 native frame, no letterbox baked in"). Our 02 rule 6 keeps ratios out of prose, so this is written as composition, not as a ratio [INFERRED adaptation].
```text
Compose for a centred wide crop: faces, hands and the action stay inside the central band of the frame
height; the top and bottom edges hold only sky, ceiling or floor.
```

---
## STYLE REFERENCE: INC (2026-11-02)
- Status: PROPOSED, v0.1 draft. Not approved, not generated, not tested on Higgsfield. Values are design proposals: no frames were measured (DOSSIER §11).
- Files:
  - `style-references/inception-2010/DOSSIER.md`: the craft dossier, every fact cited. It is the only place the reference title and crew names appear.
  - `style-references/inception-2010/ADAPTATION.md`: the look block, adapters, 9 physical-surrealism Seedance templates, camera rules, score and sound briefs, edit rhythm, G and IP cautions.
  - `style-references/inception-2010/SUMMARY-AR.md`: the Arabic summary (pending).
- The code `INC` stays in docs. The tag line pasted into prompts is the neutral `LOOK v0.1 · <ID>` (02 hard rule 2). The compiled Seedance blocks (≤140 words each, no `()<>{}【】`) are in ADAPTATION a.3; the image adapters are in a.5.
- Decisions open before v1.0:
  - D-9 frame (full 16:9 or a scope letterbox in post);
  - the world axes (light + palette, the reference's way, vs 02's camera axis for DEEP);
  - three new CAMERA forms: bolted, arm, aerial;
  - the shoot-out, about 392 credits for five variants [ARITH].

### LOOK-INC v0.1 · stable core (Look Bible record)
```text
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

### LOOK-INC v0.1 · variants (add to the core; hex and Kelvin values PROPOSED)
```text
REALITY · LIGHT: natural daylight at about 5600K through windows and open streets, or practicals at about 3200K after dark; one key direction; faces about one stop under the brightest background. COLOR: sun-warmed stone #B8A487, worn timber #6A5038, neutral shadow #2D3135; restrained saturation. COLOR RULE: Skin is the only saturated colour in frame. CAMERA: handheld.
DREAM-A · LIGHT: flat overcast at about 6500K, sun fully blocked; steady rain in visible sheets; no hard shadows; sky reflections on every wet surface. COLOR: wet asphalt #2A2F35, rain-dark concrete #6A7076, pale grey sky #A9B0B6; low saturation. COLOR RULE: Skin is the only saturated colour in frame. TEXTURE: everything wet; streets bare of signs and clutter. CAMERA: handheld.
DREAM-B · LIGHT: tungsten practicals at about 3000K in sconces, lamps and ceiling coves are the only sources; soft pools with falloff between. COLOR: lamp-lit walls #B07A45, dark wood #4A3224, brass #A8823E, deep warm shadow #1C1511. COLOR RULE: The lamps' amber light is the only saturated warm colour in frame. TEXTURE: polished wood, brass and glass reflect the lamps; walls bare. CAMERA: handheld.
DREAM-C · LIGHT: shadowless overcast at about 7000K over snow; bright, even, low contrast; wind-blown fine snow. COLOR: snow #E7ECEF, cast concrete #8B9196, cool shadow #5D6A76, dark window glass #1E242A; lowest saturation of the dream worlds. COLOR RULE: Skin is the only saturated colour in frame. CAMERA: handheld, every shot moving.
DEEP · LIGHT: diffuse marine overcast at about 6000K, no direct sun; sea mist beyond 200 metres. COLOR: sea and sky #7E878C, eroded pale stone #A39E93, dark wet rock #34383B; lowest saturation of the film. COLOR RULE: Skin is the only saturated colour in frame. CAMERA: handheld, slower (or locked).
Every dream variant · PHYSICS EXCEPTION: Only this shot's one impossible event breaks physics; everything else keeps real weight.
```
