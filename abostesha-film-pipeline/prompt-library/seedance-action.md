# seedance-action

Entries newest last. Template: README.md.

---
## Templates from the 2026-11-02 film studies

Source: `studies/2026-11-02_CROSS-STUDY.md` §3B and cards 3, 5 and 7. Fill-in templates, not approved generations. Handles follow 05 (`@ImageN`, `@VideoN`, `@AudioN`); the studies stored `<<<image_N>>>`. Lines marked (P0x-n) are proposals awaiting approval (LESSONS.md); D-n refers to the decisions in CROSS-STUDY §4.0. Film codes as in characters.md.

### TEMPLATE (from studies 2026-11-02) · Single action shot (05 §5.2 structure + study slots)
- Sources: S (9-block stage skeleton, 11/13 jobs in the film), B (locks, "Still the same shot:", FINAL FRAME), L and H (physics as process), T (knowledge-not-shots umbrella). Timecoded beats were used by 12/12 films; frame one already in action by ≥9/12; a stated end by ≥8/12.
```text
Audio policy: the soundtrack holds only the diegetic sounds named at the end. No music, background music, BGM, score, instrumental, melody, synth effects, ambient pad, drone, stinger or rising tone at any moment. No subtitles.

【Generation Goal】
Generate one continuous {{shot size}} shot: {{subject}} {{principal action}} in {{place}}, {{time/light}}. Story job: {{what this shot does in the film}}.   (P05-1)

【Reference Asset Roles】
{{paste the "Reference role block" below, one line per handle}}
These references are knowledge, not shots: never cut to, settle on or reproduce a reference composition.   (P05-1)

【Subjects and Relationships】
COUNT: exactly {{N}} people, no one else at any point, no doubles in glass or reflections. {{NAME}} stays frame-{{left/right}} of {{fixed object}}; {{axis}} is never crossed. {{Wardrobe/state: dust level, wet/dry}}. {{Props: count, owner, position}}. {{Side-named mark}} — do not mirror.

【Event Script】
0-{{t1}} seconds: Frame one is already running: {{who is where, mid-what}}; {{one action}}; at the end, {{visible state}}.
{{t1}}-{{t2}} seconds: Still the same shot: {{one action}}; ① {{countable beat}} ② {{countable beat}}.
{{t2}}-{{G}} seconds: Still the same shot: {{one action}}. FINAL FRAME: {{framing, who where, prop state}}.
   ← or, if the take will be extended: "{{subject}} is still {{moving}}; {{next beat}} has not begun."
Physics: {{preparation → contact at about X s → reaction → recovery}}; real weight; each foot planted before the other lifts; nothing appears, vanishes or floats; natural real-time speed.
{{05b PERFORMANCE block}}

{{CAMERA: size + angle + one move, start → end, about a NN-degree field of view; the 02 operator sentence; framing changes only by travel; the camera never passes through walls, glass or bodies}}   (P05-14)

The visuals feature {{02 core + variant, verbatim}}.
{{02 CONTINUITY line}}

【Maintain Consistency】
Keep {{identity lines, side-named marks, costume phrase}}, {{prop count and owner}}, {{screen direction}}, {{light direction}}; the set does not change.

Audio includes <{{sfx 1, in event order}}>, <{{sfx 2}}>. {{02 AUDIO line, verbatim}} No music of any kind.
```
- If a behaviour (shake, flicker, rain) drops out mid-take, move it to the first line of 【Generation Goal】 and open every range with a short refrain of it (F: refrain at the start of 10 of 13 beats in the take used). (P05-12)

### TEMPLATE (from studies 2026-11-02) · Start-frame one-liner
- Source: K (every prompt of ≤28 words reached the cut, 6/6: "static handheld shot, no zoom in, dead man's hand"). Use only when an approved, identity-corrected start frame already carries composition, light and wardrobe. (P05-7)
```text
{{static handheld | locked}} shot, {{subject does one action}}, {{same angle}}, no zoom in, {{one guard}}
```
- Keep 05's audio policy line before and after it.

### TEMPLATE (from studies 2026-11-02) · Reference role block
- Sources: B `[Material Roles]` (243/275 late prompts), S `[REFERENCE USE]`, T "KNOWLEDGE ONLY, NOT SHOTS" (117), K anti-slideshow, H scale sheet, F pose sketch, C blocking still and voice reference. 11/12 films wrote one role per reference; 7/12 recorded tag failures, so lint before submit (CROSS-STUDY §3C.9). Handle number = position in `medias` within each media type.
```text
@Image1 = {{CHR_NAME}} identity sheet (state {{S#}}): face, hair, body, wardrobe ONLY. Not its grey background, not its studio light, not its pose, not its sheet layout.
@Image2 = {{LOC_NAME}} plate ({{time of day}}): geometry, materials, light direction ONLY. Its own wide view never appears re-photographed; no people from it.
@Image3 = {{PRP_NAME}}: exact look and colour of the {{prop}} wherever it appears. Only one {{prop}} exists.
@Image4 = LAST APPROVED FRAME of {{shot id}}: same place; copy its geometry, light direction and grade.   (continuity takes, P05-4)
@Video1 = PREVIOUS APPROVED CLIP {{shot id}}: carry on its camera position, lens, handheld character, light, grade and the positions of everyone in it; do not restage.   (continuity takes; wording test D-5)
@Video2 = PATH GUIDE (SLA_{{shot}}_PB_v{{nn}}): the route, timing marks and room layout ONLY; not its stiff camera, not its empty rooms, not its placeholder shapes.   (P04-1, test first)
@Image5 = POSE SKETCH: pose and spatial reference only; its lines, strokes and paper texture must not enter the image.
@Image6 = BLOCKING STILL: the RED marker is {{CHR}}, the YELLOW marker is {{CHR}}; markers are annotations, not objects; framing comes from the prompt.
@Image7 = {{NAME}} SCALE SHEET: only as the scale-continuity reference; {{NAME}} stays about {{cm}} tall relative to {{lead}}.
With 3 or more images: Do not reproduce the reference images as fixed opening frames, animate them one after another, or transition between them as a slideshow.
```

### TEMPLATE (from studies 2026-11-02) · Performance block
- Sources: L (state as body mechanics; ①②③; BLINKING 22 / NO sighing 21 prompts), K (one physical tell; restraint clause in 23/43), BZ (EMOTION LAW, both extremes, 30 prompts). Restraint clauses in 11/12 films. Slots into 05b's PERFORMANCE block; emotion words only as 05b ground rule 2 allows.
```text
STATE: {{CHR}} is {{plain surface word}}: {{breath type}}, {{shoulders}}, {{chin}}, {{hands}}, {{weight}}.
BEATS: ① {{countable action}} ② {{countable action}} ③ {{countable action}}.
The only sign of {{the state}} is {{one physical tell: "the way she drinks the water quickly"}}. {{CHR}} does not: {{cry / gasp / look around / play to the lens}}.
RESTRAINT: blinking natural and minimal, never fluttering; no performed sighs; no eyebrow acting; emotion in the body and stillness, not the face; micro-pause before reactions; eyes reach {{target}} before the head; wet living eyes with a catchlight.
BOTH LIMITS: {{tears roll / open sobbing}} = a failed take; a completely blank face with no change in the eyes or mouth = a failed take.   (failed-take form pending D-6)
LIGHT: only the sources in the scene ({{list}}); no fill; camera on the shadow side.
```

### TEMPLATE (from studies 2026-11-02) · Crowd block
- Sources: IP (crowd laws, life signs in 707 prompts, bookends in 883; IP's crowd footage is Cinema Studio but its 173 Seedance prompts carry the same blocks), C (anti-clone by layout), TK (no principal faces in the crowd), F (every extra has a task; nobody looks at the lead). Crowds directed in text without Elements: 7/12. Extends 05b §5b.8.
```text
THE CROWD: about {{N}} people, no empty floor; muted mid-tones {{palette}}; {{share}} women; nothing bright; no principal face repeated among them.
BUSINESS: every {{rider / guest}} holds {{strap / cup of juice / phone held low}}; nothing floats.
EYES: nobody looks at the lens or at {{CHR}}; exceptions: {{named}}.
MOTION: everyone mid-stride, both directions, own speeds; at {{t}} s {{shared cause: the bus brakes}} and the crowd {{leans as one}}.
FOREGROUND: a near body crosses between the lens and {{CHR}} at least twice (once early, once late); {{CHR}}'s face stays clear.
LIFE: every face blinks at uneven intervals, chests breathe; lids relaxed, no wide eyes; mouths closed; voices are murmur only, never words.
BOOKENDS: the shot is already running when it starts; still running when it ends.
```
- Where faces would repeat, keep them unresolved behind foreground bodies (C: "If no face is legible, no face can be repeated").

### TEMPLATE (from studies 2026-11-02) · Non-human integration block (robot or creature)
- Source: H (the "CRITICAL YOKI INTEGRATION" block in 92 prompts; "Exactly one Yoki" in 142/207; gait cycle E7; the non-human in about 23 of 42 final takes). Mapping to our robots is [INFERRED]. (P05-13)
```text
CRITICAL {{NAME}} INTEGRATION: @Image{{n}} ({{NAME}}) must look like a real physical {{robot | creature}} captured in the same live-action place as everything else. Preserve its exact identity and anatomy, but inherit from @Image{{loc}}, the photographic-world reference: the same lighting, the same shadow direction, the same softness, the same grain, the same focus response, the same exposure. Correct floor contact and a contact shadow under its feet or body. No separate key light, rim light or glow on {{NAME}}; it is never cleaner or sharper than the room. It must not look like CGI, a rendered toy, an illustration or a pasted asset.
SCALE: {{NAME}} is about {{cm}} tall: its {{head | top}} reaches {{the lead's waist / the door handle}}. It does not shrink when the camera is farther away, when it sits, when it approaches or near the door. Exactly one {{NAME}}. No growth, no morphing during this shot.
GAIT: one foot stays planted → weight shifts onto it → the other foot lifts clear → swings forward → heel contacts the floor → weight transfers; the body rises and settles a little with each step. No gliding, floating, sliding, skating, moonwalking or turning in place without stepping.
CONTACT: hands and objects make real contact; materials deform where pressed; no clipping, no floating objects; nothing regenerates or duplicates.
```
- Light the non-human only by sources in the scene; one hard in-scene source (a lamp, a torch, a phone) sold H's darkest shots. Show changes of size or state between takes, never inside one.

### TEMPLATE (from studies 2026-11-02) · Blocking reference lines
- Sources: B (PATH GUIDE, 88 prompts; the strict "EXACTLY" wording gave 18 jobs and 0 at 1080p; phone gesture clip `44c9a024`), C (marker stills), F (pencil sketch). See also 04 and proposals P04-1 to P04-3.
```text
@Video{{n}} = PATH GUIDE ONLY (SLA_{{shot}}_PB_v{{nn}}): take the subject's route, timing marks and room layout; NOT its camera smoothness, NOT its empty rooms, NOT its placeholder shapes (the {{object}} is a POSITION placeholder; design a real {{object}}).
@Video{{n}} = GESTURE REFERENCE (phone): copy only the hand path and which end is worked; do NOT copy the person, clothes, watch, room or light.
```

### TEMPLATE (from studies 2026-11-02) · One-change repair (`video_edit`)
- Sources: T (8 edits, 3 surely in the film; two-sided failure criteria; "THE DOG ITSELF IS NOT THE OBJECT TO REMOVE"), K (one-sentence tempo edit in the film: "instead of walking slow she should walk very fast to the box, do not change video structure"), 05 §5.8 scope-closure sentence. Source = the original final by job ID (05 §5.8; D-4).
```text
Edit @Video1. Keep EVERYTHING exactly as it is — frame for frame: {{people, wardrobe, props, room, light, grade, camera move, timing, sound}}. Nothing is added, nothing is removed, nothing is re-timed.
Change ONLY ONE thing: {{the change, physically, with where and when: "from 2 s on she walks to the box at a fast pace instead of slowly"}}.
{{If removing something held by a subject: "{{SUBJECT}} ITSELF IS NOT THE OBJECT TO REMOVE."}}
{{Failure on both sides (pending D-6): "{{over-correction}} = a failed take. {{the defect still visible}} = a failed take."}}
Everything not named above in @Video1 (people, props, background, camera, timing, sound) stays exactly as it is; nothing is replaced, added or removed.
```
