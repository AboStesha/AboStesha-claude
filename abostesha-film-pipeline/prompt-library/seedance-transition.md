# seedance-transition

Entries newest last. Template: README.md.

Joins between shots and changes of place, time or state made by Seedance 2.5 itself (in-fills, in-take wipes, bridges), plus the edit bridges that need no generation.

---
## Templates from the 2026-11-02 film studies

Source: `studies/2026-11-02_CROSS-STUDY.md` §3B.17 T4 and card 2. Fill-in templates, not approved generations. Handles follow 05 (`@VideoN`, `@ImageN`). Film codes: B The Breach · F Fukushima · K Kimti · U UNPROMPTED · T THREAD · TK TOKYO 4:17 · H HUNGER. For re-resolution transitions (place A becomes place B) in DREAM shots, see seedance-dream.md.

Evidence in short: physical foreground wipes or occluders inside a take in 6/12 films (T, H, B, IP, TK, K). Frame-locked black-gap in-fills in 1/12 (F: 54 jobs, 22 joins, 8 matched in the film, all made on the last day). U's in-take transitions are Cinema Studio, not Seedance [transfer INFERRED].

### TEMPLATE (from studies 2026-11-02) · Frame-locked in-fill join (`video_edit`)
- Source: F (prompt stable after 9 earlier wordings on the last day; `video_edit` 41 of 54; all 1080p; wording grew to block these failures: returning the black as-is, fading in, "the bubbles turning into the cup", copying the boundary frame as a freeze).
- Build in the NLE: the last ~2 s of approved final A + a black gap + the first ~2 s of approved final B, exported at 24 fps (4–12 s). Frame math: the first frame is 1, so t s → frame t×24 + 1 (2.000 s = frame 49; 4.000 s = frame 97). The source rule for an NLE export is open (D-4).
```text
Edit @Video1. Using @Video1 as the only video basis, fill only the black placeholder between {{a}} s and {{b}} s. The black is the area to replace, not a story blackout or a transition. The result keeps the original {{T}} s, 24 fps, {{F}} frames and frame size.
Top priority: 0.000 ≤ t < {{a}} s and {{b}} ≤ t < {{T}} s are locked original video: keep the original frames; no regeneration, repaint, beautifying, regrade, crop or speed change. Counting the first frame as 1: frames 1–{{a×24}} and {{b×24+1}}–{{F}} stay frame-identical to the input, each at its original time; generate only frames {{a×24+1}}–{{b×24}}. Frame {{b×24+1}} must be the input frame itself, not a similar reconstruction.
New action {{a}}–{{b}} s: picking up from frame {{a×24}}, {{subject}} {{continuous action}}; about {{a}}–{{x}} s {{sub-beat}}; about {{x}}–{{b}} s {{sub-beat}}. The camera continues its {{height, direction, inertia}}; it passes through real openings, never through doors, glass or bodies.
The start matches frame {{a×24}} ({{pose, props, camera motion}}); the end flows naturally into frame {{b×24+1}} ({{pose, size in frame, camera height and speed, background}}). Never copy a boundary frame into a freeze. Every frame from {{a×24+1}} to {{b×24}} shows visible content.
It reads as one real take by one camera. No black, cut, hidden cut, dissolve, fade, morph or teleport. The original sound stays at its original time; add no dialogue, music or whoosh.
Everything not named above in @Video1 stays exactly as it is; nothing is replaced, added or removed.
```

### TEMPLATE (from studies 2026-11-02) · In-take transition through a physical occluder or medium (`omni_reference`)
- Sources: T (the window frame "sweeps across the whole picture … filling the frame edge to edge with dark wood for about half a second … not a hard black cut, not a fade"), F Sc_01 (the change of place only inside dark fluid that fully blocks the view), H (cardboard curtains). Write *becomes, takes over*; never *replace, change, continue* in a reference prompt (05 §5.2).
```text
【Generation Goal】
Generate one continuous take in which {{place A}} becomes {{place B}} without a cut: the change happens {{behind a foreground object crossing the lens | inside {{medium}} that fully blocks the view}}.

【Reference Asset Roles】
@Image1 is the STARTING LOCATION: geometry and light only. @Image2 is the TARGET LOCATION, a full environment the viewer stands inside. @Image3 is {{NAME}}: identity only. These references are knowledge, not shots.

【Event Script】
0-{{t1}} seconds: Frame one is already running: {{A, in motion}}.
{{t1}}-{{t2}} seconds: Still the same shot: {{a real object with weight}} sweeps across the whole picture for about {{0.5}} s, edge to edge; behind it the framing of {{subject}} stays the same size; when it clears, {{place B}} is already there. (Inside the first two-thirds of the take.)
{{t2}}-{{G}} seconds: Still the same shot: {{B, the action continues}}. FINAL FRAME: {{…}}.
Natural real-time speed.

【Maintain Consistency】
{{NAME}} does not transform. No fade, no dissolve, no crossfade, no overlay, no wipe graphic, no hard black frame, no particles.

Audio includes <{{the occluder's own sound}}>, <{{the room resonance changing}}>. No whoosh, no glitch sound. No music of any kind.
```

### TEMPLATE (from studies 2026-11-02) · Box-curtain phase join (state change between takes)
- Source: H (growth shown only between takes; phases 1–3 open and/or close on "100% OF THE ENTIRE SCREEN … COVERED BY CARDBOARD"; "NO growth during this shot"; time-passage attempts inside one take with 360° orbits were abandoned).
```text
END OF TAKE A: in the last {{1}} s the camera tracks behind {{a plain cardboard box / a hanging coat}} until it covers 100% of the screen, extremely close to the lens.
START OF TAKE B: THE VERY FIRST FRAME IS 100% COVERED BY {{the same object}} EXTREMELY CLOSE TO THE LENS; the camera clears it to reveal {{the same place, later: new state}}. No growth or change happens inside either take.
```
- Cut the two takes on the fully covered frames in 07.

### TEMPLATE (from studies 2026-11-02) · Bridge between two approved clips
- Source: B `e5498481` (8 s, 1080p, in the film at medium confidence; its own prompt was one line, so this is the thinnest evidence here). Wording around "link" may count as an edit verb in a reference prompt; test (D-5).
```text
@Video1 is the outgoing approved clip and @Video2 the incoming one. A bridge shot: it opens on {{the last state of @Video1: framing, pose, props, light}} and arrives at {{the first state of @Video2}}; in between, {{one action}}. One continuous take, real-time speed, no dissolve.
```

### TEMPLATE (from studies 2026-11-02) · Edit bridges that need no generation (07)
- Sources: F (two takes spliced at a natural blackout), U [Cinema Studio] (held last frame ≈4–5 s, exit door → entry door, wall dissolve → wall opening, motif match, a 0.4 s light-leak burst, reroll intercuts at matching compositions), H (box wipes), TK (end a sequence on a shape the next opens on: round glass from above → round chandelier from below).
```text
Preference order: a cut on motion · a splice at natural darkness · a held last frame of 1–5 s · a shape or motif match designed at keyframe stage · exit door → entry door opening toward camera · an intercut of two takes of the same transition at matching compositions · a light burst of 0.4 s or less (G3 flicker check).
```
