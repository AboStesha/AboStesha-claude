# seedance-dialogue

Entries newest last. Template: README.md.

---
## Templates from the 2026-11-02 film studies

Source: `studies/2026-11-02_CROSS-STUDY.md` §3B.10, §3B.17 T2 and card 3. Fill-in templates, not approved generations. They sit on top of 05 §5.3 method A (our ElevenLabs route) and follow 05's handle form (`@Image1`, `@Audio1`) and `{}` dialogue syntax. Lines marked (P0x-n) are proposals awaiting approval (LESSONS.md). Film codes as in characters.md. Native lip-synced dialogue reached the film in 8/12 studies; an exact line-count lock was used in 6/12.

### TEMPLATE (from studies 2026-11-02) · Dialogue shot, one speaking face (05 §5.2/5.3 structure + study slots)
- Sources: L (line ≤10 words, "spoken to", after-line behaviour; one line per close-up), B (exact line count, language + accent + intention before the line), S ("mouth matches the <language> exactly"; off-screen "heard, not lip-read"), C (voice-reference binding, 64 jobs), TK (each line once, in order).
```text
Audio policy: the soundtrack holds only {{NAME}}'s speech from @Audio1 and the diegetic sounds named at the end. No music, background music, BGM, score, instrumental, melody, synth effects, ambient pad, drone, stinger or rising tone at any moment. No subtitles.

【Generation Goal】
Generate one continuous {{medium close-up}}: {{NAME}} {{says one line to whom, doing what}} in {{place}}. Story job: {{what this line does in the film}}.   (P05-1)

【Reference Asset Roles】
@Image1 is {{NAME}}: use only face, hair, build and {{costume phrase, fixed wording}}; do not use the grey background or the panel layout.
@Image2 is {{LOCATION}}: use only architecture, materials and light direction; do not use any people in it.
@Audio1 is {{NAME}}'s own voice and dialogue. Reuse the speech in @Audio1 exactly as recorded, word for word and at its own timing, with word-level lip sync. It is the sole source of the spoken voice and its timing; do not synthesize a new voice; the silences absorb any difference, the speech is never re-timed.   (05 method A + C wording, P05-8)
These references are knowledge, not shots: never cut to, settle on or reproduce a reference composition.   (P05-1)

【Subjects and Relationships】
Exactly {{N}} people; {{positions relative to fixed objects}}. Exactly one spoken line in the whole take, said once. No other voice anywhere — no muttering, no murmured or half-heard speech. The descriptive sentences of this prompt are NOT dialogue.   (P05-8)

【Event Script】
0-{{t1}} seconds: Frame one is already running: {{pre-line physical beat}}; lips closed.   (P05-1)
{{t1}}-{{t2}} seconds: Still the same shot: Dialogue language: {{language}}, {{accent, plainly described, never a caricature}}. {{NAME}}'s line ({{2–3 delivery words}}), spoken to {{addressee}}: {SPOKEN}
{{t2}}-{{G}} seconds: Still the same shot: after the line {{behaviour: holds the look for one second, then looks down}}; lips stay closed. FINAL FRAME: {{framing, where the eyes are}}.
{{05b PERFORMANCE block}} Blinking natural and minimal, never fluttering; no performed sighs; a micro-pause before any reaction; eyes reach {{addressee}} before the head.   (P05b-2)

A {{locked-off | gently drifting}} medium close-up, {{frontal or three-quarter}}, about a {{14–20}}-degree field of view; focus on the near-side eye; no zoom.

The visuals feature {{02 core + variant, verbatim}}.
{{02 CONTINUITY line}}

【Maintain Consistency】
Keep {{identity line}}, {{side-named mark}} — do not mirror; {{costume phrase}}; one speaker only; listeners' mouths stay closed.

Audio includes <{{room tone}}>, <{{one diegetic sound}}>. The line is clear, at normal conversational volume, close and dry. {{02 AUDIO line, verbatim}} No music of any kind.
```
- Keep `{SPOKEN}` once and never repeat its words elsewhere (05 §5.3). The 14–20 degree field of view stands in for L's 85–100 mm single takes [INFERRED conversion].

### TEMPLATE (from studies 2026-11-02) · Off-screen, voice-over and silent forms
- Sources: S (off-screen screams "heard, not lip-read"; final V.O. "his mouth does not move on it"), T ("BEHIND THE CAMERA, off screen"; "Any spoken word, any moving lips = a failed take"), K ("No dialogue. No lip movement."; all K's words carried by V.O. and subtitles).
```text
OFF-SCREEN: from {{behind the camera / beyond the wall}}, {{intention}}, {{OTHER}}'s line is heard, not lip-read; nobody in frame moves their lips.
VOICE-OVER: the line is voice-over: {{NAME}}'s mouth does not move on it; lips closed; as if spoken beside the camera, no reverb.
SILENT SHOT: Nobody speaks. No lip movement. {{Any spoken word or moving lips = a failed take (pending D-6)}}.
```
- K, BZ and H designed lip-sync out of whole scenes (backs, POVs, darkness, inserts). Our 05 §5.3 F4 "restage" fallback is the same move.

### TEMPLATE (from studies 2026-11-02) · Documentary interview (unseen interviewer)
- Source: C (interview fragments `d2e4bdb5`, `3be8bf9d`, both in the film; the editor then jump-cut the pauses). Fit: BROADCAST or any in-world recording [INFERRED]. One shot per fragment under 05 rule 3.
```text
Covered by {{a backstage handheld documentary camera}}, the making-of camera, not the finished interview.
{{NAME}} answers an unseen interviewer who sits just off-lens to screen-{{right}}. His eyeline stays on the
interviewer; he never looks into the lens. ZERO GESTURES: his hands stay {{where}}.
Rhythm: {{first sentence delivered briskly, almost impatiently}}; {{the second decelerates and settles on its
last word}}; a {{two}}-second pause he does not fill; one unhurried blink.
Accent described in sound, never a caricature: {{e.g. "even, syllable-timed rhythm"}}.
Optics: rectilinear, about a {{29}}-degree field of view; verticals stay straight.
Audio: production sound from a lavalier, close and dry, the very faint hiss of the mic preamp; no room hum.
@Audio1 binding as above if the line is an ElevenLabs take.
```
- Chain fragments by attaching the previous approved fragment as `@Video1` (C) once the D-5 wording test passes.
