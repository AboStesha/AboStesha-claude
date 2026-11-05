# seedance-establishing

Entries newest last. Template: README.md.

---
## Templates from the 2026-11-02 film studies

Source: `studies/2026-11-02_CROSS-STUDY.md` §3B, cards 5, 6 and 8. Fill-in templates, not approved generations. Handles follow 05 (`@ImageN`). Lines marked (P0x-n) or D-n are proposals or open decisions (LESSONS.md; CROSS-STUDY §4.0). Film codes as in characters.md.

### TEMPLATE (from studies 2026-11-02) · Locked establishing wide with locked geography
- Sources: BZ (GEO SPATIAL LAYOUT "locked for this shot" ending "180° AXIS: camera stays on this one static side"; "frame-left/right" in 63 prompts; static camera in every shot, 161 prompts; LIGHT CHANGE LAW), K (wides held long; "The frame begins EMPTY … for the first seconds nothing happens"), S (story affordances already in the plate). Written in 05 §5.2 structure.
```text
Audio policy: the soundtrack holds only the diegetic sounds named at the end. No music, background music, BGM, score, instrumental, melody, synth effects, ambient pad, drone, stinger or rising tone at any moment. No subtitles.

【Generation Goal】
Generate one continuous locked wide shot of {{place}} at {{time}}: {{the one thing that happens}}. Story job: {{where we are and what is at stake}}.   (P05-1)

【Reference Asset Roles】
@Image1 is {{LOC_NAME}} master plate: use only its architecture, materials and light direction; do not reproduce its framing as a still; no people from it.
These references are knowledge, not shots.

【Subjects and Relationships】
GEOGRAPHY, locked for this shot: {{the wall on frame-left}}, {{the gap / door at frame-centre}}, {{the path running from foreground-right to the far left}}. 180° axis: the camera stays on this one side. Exactly {{N}} people, {{where}}, each with a task; nobody looks at the lens.

【Event Script】
0-{{t1}} seconds: Frame one is already running: {{the world in motion: wind in the cloth, a far figure walking}}.
{{t1}}-{{G}} seconds: Still the same shot: {{the one event}}. {{If the light changes: "the light at the start is {{dense overcast}}; by the end it is {{clearer open evening light}}."}} FINAL FRAME: {{…}}.

A locked-off wide at {{camera height}}, about a {{47}}-degree field of view, with only a faint breathing sway; everything moves inside the frame, the frame never follows.

The visuals feature {{02 core + variant, verbatim}}.
{{02 CONTINUITY line}}

【Maintain Consistency】
Keep the geography, the axis, the headcount and the light direction.

Audio includes <{{far sound}}>, <{{near sound}}>, <{{air / room tone}}>, near sounds louder than far ones. {{02 AUDIO line, verbatim}} No music of any kind.
```

### TEMPLATE (from studies 2026-11-02) · Archive / in-world recording shot (BROADCAST)
- Source: C archive intro (25 jobs at 4:3 1080p; 12 in the film; 296 s generated for 55.8 s used). C wrote 2–6-shot rushes with hard cuts; under our 05 rule 3 each rush is its own short single shot (D-3). Fit to our BROADCAST variant is [INFERRED].
```text
SCENE CONTEXT: {{what happens, one sentence}}. Covered by {{who films it: the venue's fixed house camera / a news crew inside it / a backstage handheld}}, {{why}}.
{{SOURCE}} TREATMENT — THIS IS THE GOVERNING STYLE: {{camera body behaviour: fixed house camera / shoulder camera with a fine tremor that lags half a beat behind fast movement}}; available light only, and clearly so: {{fixtures, colour cast, poor falloff}}; uncorrected colour; exposure ridden by hand, one visible correction per shot; one focus hunt and recovery at about {{t}} s, landing within half a second; video, not film; no grain, no tape artefacts, no found-footage overlay.
CAMERA — HANDHELD BUT LEVEL: the reportage quality comes from movement, not from tilt. About a {{47 | 29}}-degree field of view, rectilinear: verticals stay straight; wider coverage only by standing farther away.
FIRST FRAME already contains {{who, where, mid-what}}. No empty establishing frame, no reveal.
THE PEOPLE: exactly {{N}}, each one different; {{no face resolved | faces soft behind a foreground body}}. Nobody acts: this is being recorded, not staged; {{at most one brief glance toward the lens}}.
No readable text anywhere in frame, no signage, no logos.
AUDIO: 1. {{room tone, continuous}} 2. {{event sound}} 3. {{distant sound}}. Nothing from outside the scene. No music, no drone, no sustained tone.
```
- Field of view never above about 70°: C's 84° wide bent the room into a fisheye. Degrade in post (style.md "BROADCAST / in-world recording treatment").

### TEMPLATE (from studies 2026-11-02) · Extras-only insert (no principals)
- Sources: TK (extras-only inserts attach only the location Element; "if the location reference contains people, do not reproduce them"; "No synchronized gestures, posing, camera-facing smiles or stationary mannequin-like patrons"), IP (crowd laws).
```text
@Image1 is {{LOC_NAME}}: architecture, materials and light only; if it contains people, do not reproduce them.
None of the film's main characters appear. Exactly {{N}} people: {{E1: costume, position, independent action}}; {{E2: …}}; {{E3: …}}. All background activity is staggered and independent: no synchronized gestures, no posing, no camera-facing smiles, nobody standing still like a mannequin. Mouths closed; voices are murmur only.
{{+ the crowd block from seedance-action.md if the frame is full}}
```

### TEMPLATE (from studies 2026-11-02) · "Living still" in Seedance [INFERRED]
- Source: BZ used Kling 3.0 for 5 near-still inserts from finished keyframes ("The only motion in frame is the light shaft and shadow slowly shifting across the top fold"). Untested in Seedance; our film keeps every insert in Seedance, so treat this as a test.
```text
Generate one continuous locked-off shot of {{object / still life}}, starting exactly on the attached start frame. Everything stays rigid and motionless — {{no fraying threads move, the cup does not slide}}. The only motion in frame is {{the light shaft slowly shifting across the top fold | thin steam rising}}. Static locked camera, no zoom, no push.
```
