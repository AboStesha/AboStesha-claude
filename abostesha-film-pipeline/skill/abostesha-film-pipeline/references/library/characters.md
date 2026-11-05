# characters

Entries newest last. Template: README.md.

---
## Templates from the 2026-11-02 film studies

Source: `studies/2026-11-02_CROSS-STUDY.md` §3A (merged from 12 Higgsfield film studies). These are fill-in templates, not approved generations: none has run in our pipeline yet. `{{…}}` = fill in. Sheet names follow 03 (`face`, `heads5`, `turn3`, `ward-<LOOK>`). Film codes: B The Breach · F Fukushima · K Kimti · S SÉKOU · L LEAK · U UNPROMPTED · T THREAD · TK TOKYO 4:17 · IP In Passing · C CONTROL · H HUNGER · BZ Buzkashi.

### TEMPLATE (from studies 2026-11-02) · Casting photo / identity seed → `face`
- Sources: S E1 (13/13 casting prompts: 85 mm f/4, eye level, overcast window, matte mid-grey), B E1 (header + LIGHT/SUBJECT/EXPRESSION/FRAMING), 03 §3.1.4 PLATE BLOCK.
- Route: GPT Image 2.5 Sunburst (max, 4k, 3:4) and Nano Banana Pro (4K, 3:4), 2–4 takes each. Set the aspect parameter: words only steer composition (S got squares).
```text
{{CODE}} · {{VISUAL HANDLE}} — identity seed ({{STATE: default}}) · 3:4
Casting photograph, straight-on, head-and-shoulders to mid-chest, 85mm lens, f/4, eye level.
SUBJECT: {{origin}}, apparent age {{N}}, {{height cm}}, {{build}}. {{face shape, brow, eyes, nose,
mouth, jaw}}. {{ONE asymmetric mark WITH A SIDE: "a small mole 1 cm below the LEFT corner of the
mouth"}}. {{one "only because" detail}}. {{hair: length in cm, texture, cut}}.
EXPRESSION: neutral, eyes on lens, lips relaxed — NOT smiling, NOT posed, NOT {{the state's wrong extreme}}.
WARDROBE: {{plain base garment, no logos}}.
{{PLATE BLOCK}}
Real skin texture, real pores, no retouching, no beautification. Photographed, not illustrated.
No text, no logo, no watermark, no border, no grain overlay.
```
- Notes: the age number stays in asset sheets only (05b rule 6). "No grain overlay" keeps the reference clean (S 12/13).

### TEMPLATE (from studies 2026-11-02) · Same-session angle (¾ or profile) → `heads5`
- Source: S E3 (13 three-quarter and 14 profile prompts). Always attach the **approved front**, never the previous angle (star-shaped chain).
```text
Use the person from the attached image. Keep their identity exactly — same face, same skin tone,
same hair, same age, same clothing. Do not recast. Do not beautify. Do not change age.
Traits to preserve: {{the identity-seed trait list, verbatim}}.
Photograph them again in the same session: same {{light}}, same {{backdrop}}, same 85mm lens at
f/4, same eye-level camera, same neutral expression with the mouth relaxed.
{{Head and shoulders turned to a three-quarter angle | in full profile}} with the {{LEFT}} side of
the face toward the camera ({{mark}} side), eyes looking just past the lens, chin level.
The {{mark}} is on the {{LEFT}} {{place}} and must stay on the {{LEFT}} side — do not mirror the image.
Real skin texture, real pores, no retouching. Photographed, not illustrated. No text, no grain
overlay, no vignette.
```

### TEMPLATE (from studies 2026-11-02) · State or wardrobe variant → `ward-<LOOK>`
- Sources: S E2/E5, B E2, F (wet/dry). Derive from the master front. Big states get a sheet; small dirt or blood marks go in the shot text.
```text
Use the person from the attached image. Keep their identity exactly — same face, same skin tone,
same age, same {{2–4 named traits}}. Do not recast. Do not beautify. Do not change age.
Do not mirror the image — the {{mark}} stays on the {{side}}.
The only change: {{REPLACE x with y}} — not {{the motif colour}}, not patterned, {{other NOT}}.
Photograph {{him/her}} again in the same session: {{repeat the seed's camera, light and backdrop line verbatim}}.
Real skin texture, real pores, no retouching. Photographed, not illustrated. No text, no grain overlay.
```
- For expression-bearing states (wounded, wet, exhausted) add B's line: "Use only the face and wardrobe identity; do NOT copy the emotional expression from the reference."

### TEMPLATE (from studies 2026-11-02) · 3-panel Seedance sheet, one readable face → `turn3`
- Sources: S E4, C E12, F (pose and CRITICAL lines), 03 §3.1.5. One-face sheets: S, C, B (3/12); two-face 3-panel sheets also worked in F, T, TK.
```text
Use the person from the attached image(s). Keep their identity exactly. Do not recast. Do not
beautify. Do not change age.
One image, three equal vertical panels, same width, same height, hard even splits, no decorative
borders, no labels, no gaps.
Panel 1 (left): front view of the full body from the neck down to the feet, NO head in this panel
{{HEADLESS VARIANT A/B}}, standing straight, arms hanging naturally at the sides — {{look item list}}.
Panel 2 (centre): back view of the full body from the top of the head to the feet — {{back
construction, hair from behind, footwear}}.
Panel 3 (right): close-up of the face, straight on, neutral expression, top of the head to the
collarbones — {{traits}}. The {{mark}} stays on the {{side}} — do not mirror the image.
CRITICAL: hands must NOT be clasped behind the back, folded, crossed, hidden, or placed in pockets;
in the back view both arms and hands stay visible. Keep anatomical left/right: {{emblem/patch}} on the
{{LEFT}} in both body views.
Skin renders at identical value and hue on face, neck, arms and hands in every panel.
Do not use the input image background. {{PLATE BLOCK}} No text. No logos. No grain overlay.
```
- If a head appears in panel 1, C's one-line fix: "the full body central panel is cleanly HEADLESS, cut straight and flat across the base of the neck with no head, all the rest is identical" (adjust "central" to the panel you mean).

### TEMPLATE (from studies 2026-11-02) · Realism pass ("re-photograph, don't redesign")
- Source: TK E2 (one 9,466-character GPT Image 2 4K prompt on 4 casting picks; all 4 became Elements). Run **before** the user approves the face plate (03 rule 5). Never name a garment in a prompt shared across characters (TK gave the wrong man a tie).
```text
Use the provided image as the ABSOLUTE MASTER REFERENCE. Enhance and reconstruct this existing
{{three-panel sheet | identity plate}} at significantly higher photographic quality.
THIS IS NOT A CHARACTER REDESIGN. DO NOT invent a new {{person}}. DO NOT beautify. DO NOT make
younger. DO NOT make more conventionally attractive. DO NOT change facial anatomy.
== ABSOLUTELY PRESERVE == apparent age · facial structure · eye shape and spacing · eyelid anatomy
· brows · nose shape and width · mouth and lip proportions · jawline · chin · ears · skin tone ·
facial asymmetry · facial hair · the wardrobe EXACTLY as in the reference.
== FACIAL PHOTOREALISM == visible but subtle pores, minor pigmentation, slight natural redness,
individual brow hairs and lashes, moist eyes, real lip texture; physically plausible subsurface
scattering. Avoid smooth AI skin. Avoid waxy skin. Avoid excessive micro-detail or artificial
sharpening. The face should look photographed, NOT rendered.
== HAIR / FABRIC == real strands and flyaways; real weave, creases, seams.
== THREE-PANEL CONSISTENCY / LAYOUT == keep panels, scale and order exactly.
== LIGHT / CAMERA == {{our PLATE BLOCK light}}; full body ≈70 mm, close-up ≈85 mm f/4; subtle lens
softness rather than digital oversharpening; no HDR, no artificial clarity.
== QUALITY TARGET == IDENTITY > BEAUTY. REALISM > POLISH. MATERIAL REALISM > DIGITAL SHARPNESS.
HUMAN IMPERFECTION > AI PERFECTION.
== ABSOLUTELY AVOID == new identity, younger appearance, model/idol appearance, larger eyes, smaller
nose, perfect symmetry, plastic or wax skin, HDR, oversharpening, CGI, different person between panels.
```
- Check eyes, hairline and collar at 100%; reject the pass if any feature moved.

### TEMPLATE (from studies 2026-11-02) · Two-reference re-sheet (layout from one image, identity from another)
- Source: TK E3 (GPT Image 2 kept; Seedream ×4 lost on the identical prompt).
```text
Use the TWO provided reference images for TWO COMPLETELY DIFFERENT PURPOSES.
REFERENCE IMAGE 1 = FORMAT / LAYOUT / CAMERA / STUDIO TEMPLATE ONLY.
REFERENCE IMAGE 2 = CHARACTER APPEARANCE ONLY. Do not mix the purposes.
REFERENCE IMAGE 2 ALWAYS WINS for: identity, face, age, body, hair, makeup, wardrobe, colour,
accessories, shoes. REFERENCE IMAGE 1 ALWAYS WINS for: layout, panel order, framing, camera,
subject scale, background, lighting, presentation.
Preserve what is known. Only invent what is genuinely missing.
REFERENCE 1 = HOW TO DISPLAY {{HIM/HER}}. REFERENCE 2 = WHO {{HE/SHE}} IS.
Do not redesign. Do not beautify. Do not average the two people together. Do not create a hybrid identity.
```

### TEMPLATE (from studies 2026-11-02) · Designed-face imperfection blocks
- Source: TK F4/F9 (text-designed faces). Add to the identity seed when no casting round picked the face. Imperfection wording on faces appears in 8/12 films.
```text
DISTINCTIVE HUMAN DETAILS: {{one tiny mole low on one cheek}}, slight eyelid asymmetry, minor
asymmetry in the corners of the mouth, a tiny irregularity in eyebrow density. They should be
details discovered when looking closely.
SKIN: healthy but NOT flawless skin. NO glass skin. NO porcelain skin. Photographed rather than rendered.
PERSONALITY IN A STILL: {{one sentence}}.
ABSOLUTELY AVOID: generic AI beauty, idol face, anime face, doll face, giant eyes, tiny artificial
nose, perfect facial symmetry, overfilled lips, plastic skin, influencer appearance.
```

### TEMPLATE (from studies 2026-11-02) · Featured-extra note
- Source: IP F2. Append to the featured extra's `face`/`turn3` prompt and to its element description. Anonymous extras never get a sheet (TK, IP). At most 2 character identities per Seedance generation (IP).
```text
{{ROLE}}: NOTHING {{HE/SHE}} WEARS IS {{lead 1 colour}} OR {{lead 2 colour}} — must read apart from
{{lead}}'s {{garment}} inside a single frame. Identifying prop readable at four metres: {{prop}}.
Take identity and wardrobe from this element; take the beat's staging, hands and eyeline from the
shot's prompt.
```

### TEMPLATE (from studies 2026-11-02) · Non-human state sheet and scale line-up
- Source: H (design sheets "photographed as if physically present on set"; scale line-up E2 used in 24 jobs; mutation prompt E3). Mapping to our robots is [INFERRED]. H's line-up missed its own cm targets, so every shot prompt restates the size.
```text
STATE SHEET: {{NAME}}, {{state}} — {{robot | creature}} reference on a plain neutral grey studio
background, photographed as if physically present on set. {{Silhouette}}; {{a dark, matte, low-specular
body}} with one bright plane, {{the face / visor}}, where practical light will fall. Weight shows where it
touches the floor: soft compression, a soft contact shadow. {{Material words: matte, tactile}}.
Not plush, not vinyl, not a mascot, not CGI, not a toy. No text.

SCALE LINE-UP: This is a technical continuity lineup, not a cinematic scene. {{Lead}} ({{cm}} tall,
{{outfit list}}) stands beside {{NAME}} {{in each state}}. All figures stand on the same floor baseline,
straight-on, no perspective distortion, plain grey background, even light. {{NAME}} is {{cm}} tall:
its top reaches {{lead's waist}}.

MUTATION (a later state of an approved design): Use the original {{NAME}} as the STRICT identity
reference. This is the same {{NAME}}, not a new design. IDENTITY — MUST PRESERVE: {{face, eyes, ears,
proportions}}. The ONLY change: {{x}}. {{If the body is already right: "The body is already correct.
Do not redesign the body."}}
```

### TEMPLATE (from studies 2026-11-02) · Put the locked character into an approved frame
- Sources: BZ (220 insert/replace edits), K (locked woman swapped into Soul plates "with the composition unchanged"), B. Image handles: whatever 03 §3.0 verifies for the engine.
```text
Replace the {{person}} in the first attached image with the person from the second attached image (identity sheet).
Use the first image as a direct reference for light, composition, pose and framing. Take from the second
image ONLY face, hair, skin tone and wardrobe — not its grey background, not its flat light, not its panel
layout. Keep everything else in the first image exactly the same.
```

### TEMPLATE (from studies 2026-11-02) · Face-structure transfer (keeps the frame's grade and emotion)
- Source: T E3 (made THREAD's first frame).
```text
Edit the first image. The second image is the character reference. The reference provides ONLY the
three-dimensional shapes of the facial features — bone structure, brow ridge, cheekbones, nose,
jaw, chin, the cut of the eyelids and lips. It provides NOTHING else: not its skin colour, not its
lighting, not its exposure, not its clean skin, not its neutral expression, not its background.
EXPOSURE AND LIGHT ON THE FACE — copy from the first image: {{direction, falloff}}. FORBIDDEN:
brightening the face, flattening the light, opening the shadows. If in doubt, render the face
DARKER and more shadowed, never brighter.
SKIN COLOUR AND TEXTURE — copy from the first image: {{cast, blotches, sweat}}. FORBIDDEN: cleaning,
smoothing, warming.
EXPRESSION — copy from the first image, muscle by muscle: {{brows, lids, eyes, mouth, chin}}.
FORBIDDEN: relaxing or neutralising any of it.
EVERYTHING OUTSIDE THE FACE — identical to the first image, pixel for pixel.
The result must read as the SAME photograph of the SAME moment — only the underlying bone structure
of the face has quietly shifted toward the reference.
```
