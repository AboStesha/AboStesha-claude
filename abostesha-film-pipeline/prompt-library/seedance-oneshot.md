# seedance-oneshot

Entries newest last. Template: README.md.

Long single takes and one-shot sequences built from several Seedance 2.5 generations (seed take + `video_extension` links + `video_edit` repairs).

---
## Templates from the 2026-11-02 film studies

Source: `studies/2026-11-02_CROSS-STUDY.md` §3B.13–3B.15, §3B.17 T3 and card 1. Fill-in templates, not approved generations. Handles follow 05 (`@ImageN`, `@VideoN`). Film codes: B The Breach · F Fukushima · K Kimti · S SÉKOU · L LEAK · T THREAD · TK TOKYO 4:17 · IP In Passing · H HUNGER.

Evidence in short: long single takes were the hero format in 6/12 films (B F K S L T). Two films play (almost) as one continuous camera: T (15 forward links + 1 pinned backward link, 0 detected cuts from 0:21 to 5:30) and F (scenes joined by frame-locked in-fills, 4 visible edit points in ≈194 s). B's two 30 s one-takes open its film. `video_extension` reached the film in 4/12 (B K T IP).

**Open decision before any chain (CROSS-STUDY D-4).** Our 05 §5.8 says an extension source is always the original final by job ID, never trimmed or re-uploaded. T fed 19 trimmed, re-uploaded tails; B re-uploaded its approved take; both reached their films. Test a trimmed tail on a non-hero shot first (test T-C).

### TEMPLATE (from studies 2026-11-02) · Single take in three stages (one generation)
- Sources: S (`[STAGE n | a–b s] … NO CUT` in 13/13; 4–9 s per stage; 6 of 13 takes with zero internal cuts; once the model cut on its own near a stage boundary), B ("Still the same shot:" at every beat; FINAL FRAME 65%), L (4–6 s windows, last window "Hold").
- Use 05 §5.2's structure (see seedance-action.md "Single action shot") and write the Event Script like this:
```text
0-{{t1}} seconds: Frame one is already running: {{who, where, mid-what}}. Camera {{height m}} {{behind which shoulder}}. {{One action}}. No cut.
{{t1}}-{{t2}} seconds: Still the same shot: the camera {{one physical move}}; {{one action}}; {{a line, if any}}. No cut.
{{t2}}-{{G}} seconds: Still the same shot: {{one action}}; the camera discovers {{what}}. FINAL FRAME: {{…}} | {{subject}} is still {{moving}}; {{next beat}} has not begun.
```
- For text-blocked long takes, write action for about 80% of G and leave the tail (S wrote 20 s and generated 25 s; proposal P05-6).

### TEMPLATE (from studies 2026-11-02) · Forward extension link (`video_extension`, `extension_mode: forward`)
- Sources: T (docking sentence in 136/169 extensions; "The source ends on …" in 61; LOOK LOCK 177, SPEED 187, SINGULARITY 170 of 214), B ("Do not repeat its events").
- Params: `mode: video_extension · extension_mode: forward · duration {{9–30}} · generate_audio: true`. Attach the scene's reference set plus the face sheet. Output starts on the frame after the source and inherits the source's frame size.
```text
=== CONTINUATION — THIS SHOT EXTENDS @Video1 ===
This shot continues @Video1 from its exact last frame, in the same unbroken take: the same {{location}}, the same {{grade}}, the same {{grain}}, the same {{light}}. @Video1 ends on {{framing and thirds; who stands where, facing which way; prop states and colours}}. The camera in @Video1 has been {{move}} at {{speed}}, and it goes on {{move}} at EXACTLY the same speed. The first frame of this extension is identical to @Video1's last frame and the action flows on without a pause or a cut. Do not repeat its events.

=== ONE SHOT — NO CUTS, EVER === Every change of framing is reached physically, on screen. An instant change of framing at any moment = a failed take.
=== REFERENCES — KNOWLEDGE ONLY, NOT SHOTS === @Image1 is {{NAME}}: identity and wardrobe only. @Image2 is {{LOCATION}}: geometry, materials, light only. They are not framings, not camera positions, not moments of this shot.
=== THE GEOGRAPHY OF THIS SHOT === {{who/what is where. Interior: ROOM IS CLOSED — nobody leaves, nobody enters. Exterior: the camera always follows a moving subject; hand-off 1 — {{A}} to {{B}}, the new leader moving before the old one leaves}}
=== ACTION === ({{0–t1}} s) {{beat}} · ({{t1–t2}} s) {{beat}} · ({{t2}} s–end) {{beat}}. The shot ends {{still in motion / before {{next beat}} begins}}: {{continuable end state}}. We never see {{next beat}}.
=== SPEED === Natural real-time speed throughout. No slow motion, no speed ramping, no time remapping.
=== SINGULARITY === Exactly {{N}} people; nothing duplicated.
=== LOOK LOCK — THE SOURCE GRADE IS THE LAW === Every frame keeps the exact look of the source. A cleaner, brighter, more colourful or sharper digital look at any point = a failed take.
=== AUDIO === Raw location sound continuing the source's bed: <{{sfx}}>. No music. {{DIALOGUE LOCK if any}}.
```
- The "= a failed take" sentences follow T; our 02 rule 7 decision on that form is open (D-6).

### TEMPLATE (from studies 2026-11-02) · Backward link (reach the opening from an approved take)
- Sources: B (1-OTa backward extension used raw as the film's exterior opening; "This take must end on EXACTLY the same frame the reference video begins on — it is one single continuous cut."), T (prequel link with a pinned first frame; 22 tries; docking framing held for the last 2 s).
- Params: `mode: video_extension · extension_mode: backward`. Describe the new action first, then end on the source's first frame (05 §5.8).
```text
This take must end on EXACTLY the same frame @Video1 begins on — {{pose and orientation, prop position and state, the others' positions, background, camera position and composition, light, motion direction}} — so the two join into one unbroken take. @Image1 is the exact first frame of this shot; start precisely on it. Nothing from later in @Video1 appears early. For the final 2 s the camera holds @Video1's opening framing.
{{+ the ONE SHOT, REFERENCES, ACTION, SPEED, SINGULARITY, LOOK LOCK and AUDIO blocks from the forward link}}
```
- B shipped Higgsfield's own extension template with its `<placeholders>` unfilled. Fill every field.

### TEMPLATE (from studies 2026-11-02) · Fixed-last-frame link (land on a known picture)
- Source: T (the loop closer: a ≈9 s link, approached over 3 links; an earlier "settles … and holds" version was trimmed before its end).
```text
THE LAST FRAME IS FIXED — @Image{{k}}. The shot arrives on exactly that picture on the VERY LAST FRAME, still travelling until then; there is no static hold at the end.
```

### TEMPLATE (from studies 2026-11-02) · Minimal extension (one new beat)
- Source: K (8 s forward extension in the film: "she suddenly hears a faint, unsettling voice off-screen… Static camera, restrained performance, no gimmicks"; the face sheet re-attached).
```text
{{One new beat, one sentence}}. Static camera, restrained performance, no gimmicks, no dramatic camera movement.
```

### TEMPLATE (from studies 2026-11-02) · Chain procedure and log
- Sources: T (17 link loops; median 8 tries per link, 3–32; 6% of generated seconds on screen; finals found by frame matching, since pinned siblings share first frames), B (approved take first, then backward and forward).
```text
1. Seed: the hardest physical moment, as a standalone take (draft → approve → finalize, 05 §5.7).
2. Link: re-roll the identical prompt 2–4 times before rewriting; budget about 8 drafts per link.
3. Approve the link; mark the last good frame; the next link starts from it (source rule: D-4).
4. Only one backward link, pinned at both ends; a fixed last frame only on a short link.
5. QC: match every candidate to the timeline frame by frame, never by thumbnail.
Log row: shot_id | take | parent_take | link_type (EXT-F | EXT-B | INFILL | VIDREF) | source_file | source_in_s | source_out_s | frame_size | graded? | muted? | result_gen_id | used_in_s
```
- Budget at our prices [INFERRED]: 8 drafts × 25 s × 3 cr/s = 600 credits + a 1080p final of 400 ≈ 1,000 credits per link.
