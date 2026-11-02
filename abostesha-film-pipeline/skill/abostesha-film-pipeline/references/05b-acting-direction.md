# 05b — Acting Direction: Feel the Script, Direct the AI Actors (Step 5 companion)

Purpose: read every locked scene the way an actor and director would, and give each character a performance bible that keeps them the same person across 30-60 Seedance shots.
Then turn every beat into what a camera can see and a microphone can hear (physical action, micro-expression, eyeline, breath) so that the face plays the same action as the ElevenLabs take.
Talk to AboStesha in Arabic. Write every bible entry, beat map and prompt snippet in English. This module owns the PERFORMANCE and DIALOGUE blocks; `05-seedance-production.md` owns the assembled prompt, handle spelling, the Higgsfield `generate_video` params, music/subtitle suppression wording and the draft/final runs.
Route (decision 2026-11-01): every take is `seedance_2_5` in Higgsfield, run by Claude through the Higgsfield MCP or by the user in the Higgsfield web app inside the same project (Claude reads those jobs back with `list_project_assets` and `get_project_asset_prompt` and logs them). The BytePlus API route exists but is not used; BytePlus pages are cited below only as ByteDance's documentation of the model and its prompt guide.
**Pilot first (decision 2026-11-02).** After the script and the style are locked and the assets of the two pilot scenes are approved (03 G2-P), Claude directs those two scenes end to end with this module as it stands: bibles and scene reads for the pilot characters and scenes, beat maps, snippets and draft review, then 05's 1080p finals and the rough sound and grade (06, 07). The open acting tests run inside the pilot (5b.11). Until the user approves a test's result, the current rule it would change stays in force. When the user approves both pilot scenes, the performance basis is frozen as `PERFORMANCE_LOCK_v1` and every other scene is directed on exactly that basis.
**Study update (2026-11-02).** The micro-beats and both limits (5b.3), the acting-control footer (5b.3, snippets), the off-screen and voice-over forms (5b.6), the crowd laws (5b.8), the optional behaviour board (5b.2) and the calm non-human performance (5b.2, 5b.7) are the proposals P05b-1 to P05b-6 of the cross-study playbook (`prompt-library/studies/2026-11-02_CROSS-STUDY.md` §3B.9–3B.10, §3D Cards 3–5 and 7, §4.5), learned from 12 public Higgsfield films (method only; credits in Sources). Five are applied; the behaviour board is pilot test T-A1. 5b.10 holds the LEAK, TOKYO 4:17 and In Passing technique cards. "D-n" = the playbook's §4.0 decisions, applied with its recommended choice; two touch this module: D-6 (no "= a failed take" sentences outside pilot test T-E; 02 hard rule 7) and D-15 (no age words in performance text; ground rule 6).

Provenance tags used below: `[OFFICIAL]` ByteDance's Seedance 2.5 docs (published on BytePlus), the Higgsfield model catalog (`models_explore`) or ElevenLabs docs; `[FIELD]` a practitioner skill's tested rule; `[STUDY]` seen in the 12 studied Higgsfield films, with the count of films (n/12) or of prompts; `[CS]` a study rule that rests on Cinema Studio footage, so its transfer to Seedance is inferred; `[INFERRED]` our transfer or mapping, untested; `[EMPIRICAL-2.0]` measured on Seedance 2.0 only; `[HOUSE]` our default, untested; `[UNVERIFIED]` confirm before relying on it.

---

## Inputs

| Input | From | Needed for |
|---|---|---|
| Locked script, Locked Sheet, scene list with LAYER (REAL/DREAM) and FLAGS | `01-script-and-dialogue.md` | 5b.1 |
| Line sheets: line ID (`S11-L06`), MODE (`ON`, `ON-WIDE`, `OFF`, `VO`, `PHONE`), Intent (gerund), TTS TEXT, SPOKEN, EN SUB | `01` §1.2.4 | 5b.3, 5b.6 |
| Voice cards: `voice_id`, `eleven_v4`, stability/similarity, descriptor, allowed/forbidden tags | `01` §1.2.3 | bible voice lock |
| Selected takes and their measured seconds (`SLA_S11-SH05_S11-L06_MIRAJ_T02.wav`) | `01` take log | beat timing, edit-window check |
| PERFORMANCE line of the style prefix | `02-style-prefix.md` | register ceiling; never contradict it |
| Approved `face`, `turn3`, `expr6` and the two lip-sync plates (`lips2`); identity anchors; asset IDs; each one's Higgsfield job ID, `media_id` or `element_id`, and the face route that passed D1 test T1 | `03-assets-images.md` §3.3–3.4 | binding, expression references, 5b.6 face route |
| Actor marks, distances in metres, eyeline targets, camera height, playblasts | `04-blender-blocking.md` | proxemics, eyelines |
| Edit length, generation length G, line markers `L_<LINEID>_in/_out`, the per-shot `_DLG_` track | `04` §4.1 step 3, §4.5 | beat-map clock, 5b.6 |
| Day-1 test T2 (does `seedance_2_5` on Higgsfield lip-sync to a supplied v4 file sent as `audio_references`, offset in frames, keep or re-voice?) | `00-award-brief-and-calendar.md` | which lip-sync route 5b.6 uses |
| Continuity bible §9 per-shot state log | `templates/continuity-bible.md` (owned by `ledger-continuity-physics.md` L.6) | 5b.7 continuity columns |
| The two pilot scenes, their approved assets (03 G2-P) and the frozen look (02 §2.13) | SKILL.md (two-scene pilot), `03-assets-images.md` §3.5 | 5b.11 |
| 05's binding sentence, DIALOGUE LOCK and the OFF / VO / PHONE / silent forms | `05-seedance-production.md` §5.3 | 5b.6, snippets C and D |
| 05's Non-human block and the robot's scale sheet | `05` §5.2, `03` §3.1.9 | 5b.2 robot variant, snippet F |
| Extras policy and featured-extra notes (face + `turn3`, colour-separation line, one identifying prop; at most 2 character identities per generation) | `03` §3.1.1 (P03-6) | 5b.8 |
| Behaviour board (only inside pilot test T-A1 until the user approves its result) | made on `03` §3.0.1 row 2 settings | 5b.2, 5b.11 |
| Cross-study playbook §3B.9–3B.10, §3D Cards 3–5 and 7, §4.5; study files `2026-11-02_leak.md`, `_tokyo417.md`, `_inpassing.md`, `_hunger.md` | `prompt-library/studies/` | 5b.3, 5b.6, 5b.8, 5b.10 |

If T2 has not run, write dialogue shots as `[UNVERIFIED ROUTE]` and do not spend on dialogue finals.

## Ground rules

1. **Acting is behaviour under pressure, not a display of emotion.** "A character wants something, something is in the way, and they act to get it. Emotion is a byproduct of that struggle — never the thing you write directly." (OSideMedia higgsfield-acting, MIT.)
2. **Never name the emotion in beat prose.** Write the trigger and the body. The hidden feeling (the subtext) is never written anywhere in a prompt, not even in quotes: "a look that says 'you too?'" comes back *spoken* (OSideMedia, MIT). Emotion words appear in only two places: the one direction sentence of snippet B, and the 2-3 delivery words of snippet C (the mask, matching the v4 tag). Both name the visible surface in neutral words ("amazed", never "fanatical" or "extremely shocked"; intense wording raises the risk of glowing eyes) `[OFFICIAL]`. The studied films wrote acting the same way: one physical tell plus what the actor does not do, with an explicit restraint clause in 11 of 12 `[STUDY]`; a strong beat states both limits (5b.3).
3. **Voice first.** The face is directed against the locked ElevenLabs take, never the other way round. If a take changes, the beat map and the dialogue shot are redone.
4. **One job per generation.** Physics and action go in one generation; eyes, breath and micro-performance in another. "The fight gets softer, the faces get flatter" when one prompt carries both (OSideMedia 2.5 notes, MIT). Dialogue and action are split the same way.
5. **States, not transitions.** Describe the character already *in* the state ("mid-reach, hand on the door handle"), not the process of getting there. Describe stillness as held tension; "nobody moves" freezes the frame.
6. **Age-blind and G-rated.** No age words in any performance text (the content filter tightens on them); decision D-15 keeps this rule: ages live only in the asset sheets, although SÉKOU wrote an age into its video text mid-production `[STUDY]`. The studied films' business that fails G is never imported: LEAK's cigarettes and off-screen strike, In Passing's beer, smoke and pickpocketing, TOKYO 4:17's bottles and pistol (5b.10). No drinking, smoking, chewing tobacco, pills, self-harm gestures, or hitting a person in the business you give a character; rage plays as held or redirected force (a slammed palm on a table, never a blow). When the user's script keeps a flagged beat, the G-safe form comes from `01` §1.1.9; you direct only that form.
7. **The user is the director.** You draft; they approve or rewrite every bible and scene read. Log their changes in the authorship log of `01` (origin `H`/`C`), because the disclosure and any authorship question will ask who shaped the performances.
8. **Pilot first, then the same basis** (decision 2026-11-02). Bibles, scene reads and beat maps for the two pilot scenes come first and run on this module as written; the pilot's open tests (5b.11) change nothing outside the test until the user approves the result. After the pilot approval every other shot is directed from `PERFORMANCE_LOCK_v1` (the same snippet text, footer, limits wording, line forms and crowd block); a change is a new lock version with the user's yes.
9. **Method, never material.** From the studied films we take how they directed, never their characters, faces, designs, lines, set pieces or stories (each study's "Do not copy" list holds).

---

## Procedure

### 5b.1 Feel the scene (one scene read per scene, before any shot)

Do this per scene, in order. Show the result to the user as the Scene Read card (Output templates).

1. **Read the ending first.** Name the event from the last beat. Test: the event must contain every character in the scene, including silent, phone and voice-only ones. "If a character stands outside the named event, the event is named wrong" (OSideMedia, MIT). Rename until all are inside it.
2. **One scene direction, a different motive per character.** The direction is the unspoken agreement everyone plays toward; the motive is each one's own fuel. Same vector, different fuel is what keeps an ensemble from collapsing into one note.
3. **Given and previous circumstances.** Where is the body (seated, standing, on a moving walkway)? What happened in the last ten minutes? How many hours since sleep? What is in the hands? Previous circumstances set breath, tempo and eye state at frame 1.
4. **Per character:** super-objective (the whole film), scene objective as a verb aimed at a partner ("make her stop worrying", never "be sad"), obstacle, stakes ("what happens if I fail?" must frighten them), a tactic verb per beat (reassure, joke, bargain, deflect, plead, provoke, stall), 2-4 visible beat turns per scene, status in and out, business (what the hands are doing), distance to the partner in metres.
5. **Private sentence and inner object.** One line of unspoken inner monologue per beat (it guides you, never the prompt), and one concrete image the character sees in their head (the mother's hospital bed, the 6,300 figure). The inner object gives the eyes a place to go: a fixed defocus low and to one side while it is "seen".
6. **Cross-check with `01`.** Each line's Intent (gerund) must equal the tactic you wrote for that beat. If they differ, tell the user in Arabic and let them decide; do not re-tag lines yourself.

Mini-example, S11 (Miraj's room, night; the call). Provisional until the user confirms:

| Field | MIRAJ | MOTHER (PHONE) | BROTHER (PHONE) |
|---|---|---|---|
| Event (from the ending) | Everyone lies to protect someone, and everyone knows it | inside it | inside it, as the one who breaks the lie |
| Scene direction | keep the call light | | |
| Motive | so she stops spending her strength on him | so he does not carry her | wants the lie to end because he is the one in the room |
| Objective | make her stop worrying | make him hang up calm | make Miraj act now |
| Obstacle / stakes | he has nothing saved / she could die waiting | the doctor is coming / she may not see him again | mother's anger / losing her |
| Tactics by beat | ask → reassure → joke → promise | deny → scold → bless | report → expose → hand back |
| Business (unseen PHONE roles: informs the take and the listener only) | thumb turning the smart ring | (unseen) adjusting the blanket | (unseen) holding the phone too close |
| Inner object | the bank app's frozen balance | | |

### 5b.2 Build the performance bible (one per recurring character)

Write one bible card per character who appears in 2+ shots or has a close-up (template below). Rules:

- **Acting master profile:** 150-220 words, one paragraph, fixed order: body and posture as biography → the one psychological engine → vocal behaviour (how speech *behaves*, not the timbre) → tics, each with its trigger → concealment behaviour → the mask and the exact condition under which it cracks ("However, when X — …", at least once) → eye life (standing task, blink quality, scan pattern, eyes before head) → a named gait unpacked → at most one softening target. No wardrobe, no camera, no colour, no age (OSideMedia, MIT).
- **Voice lock:** copy, never retype, from the `01` voice card: `voice_id`, model `eleven_v4`, stability, similarity, descriptor, allowed/forbidden tags. The descriptor is pasted verbatim forever; "swapping *warm* for *rich*, or *gravelly* for *raspy*, moves the generated voice" (OSideMedia, MIT). In Seedance prompts the voice is carried by `@AudioN`; never re-describe the timbre in prose next to a supplied track.
- **Physical signature:** centre of gravity (high/low), tempo, openness, breath baseline, named gait, business repertoire, tics with triggers. "The most dangerous people move least"; "the strong are still and quiet; the weak fidget and shout" (OSideMedia, MIT).
- **Face map:** resting face, mask face, crack face, each as plain anatomy with FACS codes in brackets for QA (5b.4). Codes stay in the bible.
- **Intensity range:** screen intensity 0-5 per layer (calesthio performance-direction, MIT): REAL scenes usually 1-2, DREAM scenes up to 3-4. For restrained characters also give pressure / amplitude / self-control, each 1-5 (zhouwei713 facial-expression-prompting, MIT). "Devastated but hiding it" = pressure 5, amplitude 1, control 5.
- **Arc checkpoints:** the baseline at the film's start, after the turn, at the end (5b.7). The body changes slowly; never reset it between scenes.
- **Forbidden:** behaviours that break the character or the G rating.
- **Behaviour board (optional; P05b-5; only inside pilot test T-A1 until the user approves its result).** LEAK attached `JUNE_CF_02`, a 9:16 casting board of 10 candid stills of the lead's habits plus a typed card, to 35 of its 43 Seedance jobs `[STUDY]`; that a board helps Seedance perform is `[INFERRED]`. Our form, per lead:
  - One 9:16 image of 6–11 candid stills of that lead doing the bible's business and tics (turning the ring, the swallow before a lie, the clock-in shuffle), in the wardrobe of the state sheet, on 03's neutral background family. **No text inside the image**: 03's sheets carry none, and an element name ended up painted on a sign in TOKYO 4:17. The card LEAK typed into its board (wardrobe locked, 2–3 behaviours, one line of inner life) lives in this bible instead.
  - Made on 03's routing (§3.0.1 row 2 settings: `gpt_image_2` 4k, high; Image 1 = the approved `face`, Image 2 = the state sheet; check the 9:16 ratio with `models_explore` first), each panel written "The only change: <habit>"; alternative `nano_banana_pro` 4k. It is filed and logged like any sheet in `01_CHARACTERS/CHR_<NAME>`, preflighted with `get_cost: true`, and made only after the user's yes.
  - Bound as one extra `image_references` entry after the identity sheet, never replacing it, with the BEHAVIOUR BOARD role line (Output templates 4H). It counts toward 05's reference limits and triggers the anti-slideshow line.

Worked master profile, MIRAJ (draft for the user; they approve or rewrite):

```text
Character acting as MIRAJ. A lean, underfed body that has spent years standing in queues and on
shifts: shoulders rounded forward, neck carried ahead of the chest, weight sunk into the heels, a
low centre of gravity that makes every step look borrowed. One engine drives him: every second
costs money, so rest feels like theft. Vocal behaviour: soft and quick, speeding up when he hides
something and slowing almost to a whisper when he means it. Habits and tics: he turns the smart
ring on his finger whenever money is mentioned; he swallows once before any lie; one short laugh
of breath through the nose closes a subject he cannot afford to open; at work his hands are always
fixing something, and a hand that stops is the loudest thing he does. His default face is a polite,
tired half-smile that keeps people at a distance. Eye life: quick low scans of people's hands and
faces to find what they want from him, a high blink rate when tired, and his eyes reach a speaker a
beat before his head turns. Walking style: a "clock-in shuffle", short fast steps, heels barely
leaving the floor, elbows close to the ribs, head down. However, when someone speaks of his mother,
the half-smile drops at once, his jaw sets and his back straightens a full hand taller; then he
catches it and folds back down. His face softens completely only for his mother.
```

**Robot variant (NOAH; the coworker robot).** `03` gives Noah a head panel instead of a face, so there is no lip-sync and no FACS. Direct him through status: head almost never moves, turns lead from the torso, every movement finishes exactly with a tiny settle, a fixed 0.3 s stillness before he answers, palms open when he "gives". His eye life is a task for whatever sensor or light the design has: it tracks the person, not the room. Whether a light element pulses with his syllables is a design decision for the user and `03`; if yes, it is described as light behaviour, never as a mouth. The coworker robot's signature is its faulty leg: a hitch on every right step, compensated by a slight torso lean, and a fist-bump that arrives a fraction late because of it.

**Calm performance for every robot or creature (P05b-6; HUNGER `[STUDY]`, fit to robots `[INFERRED]`).** A non-human performs small: no pet tricks, no playful bounce, no waving or cartoon head tilts, no exaggerated cuteness; its presence comes from scale, stillness and where it attends. It follows the humans' decisions unless the script gives it the lead (HUNGER: "He follows Lora's decisions rather than initiating them"; "Do not make him perform exaggerated cuteness"). Its feelings show only as a change of attention or tempo (a longer stillness before it answers, a slower turn), never as a face or a cute gesture. G: never a lunge or a sudden move toward a person, no roar, screech or menacing glow (a glow also reads as an eye effect, 5b.4). 05 pastes the integration, scale and gait block; snippet F carries only the performance.

### 5b.3 Turn each beat into observable behaviour (the beat map)

Build one beat map per shot (template below). Time comes from the selected take, never from estimates:

- Speech onsets and pauses, free and local: `ffmpeg -hide_banner -i SLA_S11-SH05_S11-L06_MIRAJ_T02.wav -af silencedetect=noise=-35dB:d=0.20 -f null - 2>&1 | grep silence_`
- Word-level times: ElevenLabs Forced Alignment, `POST https://api.elevenlabs.io/v1/forced-alignment` with the audio `file` and the plain `text` (the SPOKEN version); it returns character and word timings and is priced like Speech to Text `[OFFICIAL, docs 2026-10-30]`. Its language list (29 languages) includes Arabic and Hindi but not Urdu, so for Urdu lines use silencedetect and your ears. Ask before spending; the user runs it or approves it.
- The clock: 04 places each line at its `L_<LINEID>_in` frame inside the G-second generation. Write beat-map times on that shot clock, not on the raw take; if the marker sits at the start of the WAV, add the take's own head silence to find the first word.

For every beat fill five channels, then prune:

1. **Trigger** (visible or audible). Show the cause before the reaction; if they cannot share the frame, link them with one eyeline or camera shift, and do not cut to a face-only close-up before the audience has seen the trigger (sd25-pe, paraphrased) `[OFFICIAL]`.
2. **Physical action:** business, posture, a change of distance (in metres; a change of distance is a beat change), the interrupted-action accent ("the strongest accent is when a character **stops** the business", OSideMedia, MIT).
3. **Micro-expression:** plain anatomy from the 5b.4 table, 1-2 actions per beat.
4. **Eyeline:** target (a named mark from `04`, "the partner just left of lens at seated eye height"), pattern (hold, flick away and back, slow scan, defocus to the inner object), blink quality. Eyes reach the target before the head. Never into the lens unless the script asks for direct address.
5. **Breath:** where it catches, holds, releases. "Breath is the most honest indicator of state, and sound must match physics: someone who just ran cannot speak on a steady voice" (OSideMedia, MIT).

Order and density:

- **Reaction chain** (liyue-aigc seedance-2-5-video-director, MIT): "stimulus → comprehension pause → first involuntary response → chosen response → residual emotion → next beat".
- **Channel stagger** (zhouwei713, MIT): "Let the eyes reveal the change first, then mouth and jaw, followed by breath, head, shoulders, hands, and voice. Stagger channels by a few frames."
- **Every line has three phases** (OSideMedia FACS skill, MIT): pre-line (a swallow, a short nasal inhale, a posture shift), during (the stress word plus at most one physical cue), post-line ("~0.5s of held breath or locked gaze before the next movement, then the release").
- **At most three micro-beats per shot, written ① ② ③** (P05b-1). The official guide asks for a small number of the clearest cues from eyes, brows, mouth, breath, gaze, hands and posture, never every possible micro-expression `[OFFICIAL]`; kangarooking's 2-4 (MIT) is capped at three by LEAK, whose micro-beats were "tiny, physical and countable", at most three per shot `[STUDY]`: "Performance micro-beats: ① her weight shifts slowly onto one hip ② one palm comes to rest flat on the counter ③ one visible slow exhale sinking through her shoulders." Each micro-beat is one countable visible action ("one visible swallow", "the ring hand closes into a fist"). The reaction chain maps onto them: ① the first involuntary response, ② the chosen response, ③ the residual that stays. The beat map may hold more cells for QA; the prompt carries three at most. Then apply the prune rule: "If the emotion still reads after deleting an action, prefer deleting it." (kangarooking emotion-performance-director, MIT.)
- **At most two beat turns per generation**; split the shot if the scene needs more (calesthio, MIT). Under the micro-beats, small signs of life keep a static face alive: breath, a small gaze shift, an uneven blink. They are not counted and are carried by the footer. The phased blink, "one lazy blink → a quick DOUBLE-BLINK → one HARD reset-blink" (OSideMedia HELL-GRIND, MIT), counts as a micro-beat when written, and only where the bible's blink quality allows it (a tired character), never next to "minimal" blinking.
- **The tighter the shot, the less movement:** in a close-up only the eyes, breath and one facial action move.
- **State as body mechanics** (LEAK `[STUDY]`): write the scene's state as breath type, shoulders, chin, hands and weight ("shoulders drawing in, chin lowering, hands coming up small and defensive, weight shifting back, breath shallow and quick (not sighing — quick shallow inhales)"). The surface word appears only where ground rule 2 allows it.
- **One physical tell and a does-not list** (a restraint clause in 11 of 12 films; Kimti in 23 of 43 prompts `[STUDY]`): "The only sign of {{the state}} is {{one physical tell}}" (Kimti: "The only obvious indication of panic is the way she drinks the water quickly"; SÉKOU: "his only performance is where he looks"), then a short tail of what the person does not do ("does not cry, gasp, look around or play to the lens"). A short tail inside a declaration is allowed by 02 hard rule 7; a comma-list negative block is not.
- **Both limits on every strong beat** (P05b-1; Buzkashi's EMOTION LAW in 30 prompts, Kimti's tear pair `[STUDY]`). When a beat reaches intensity 3 or more, or involves tears, anger or fear, the prompt states the over-play limit and the under-play limit together. Kimti's pasted note explains why: "you need both the positive and the negative or Seedance will either skip the tear or go full weeping." Write both as declarations: "Her eyes are wet with a catchlight and never spill; no sobbing, no crumpling. The face is never blank: the eyes and the mouth keep moving in small ways." In review (5b.9) either extreme is a failed take. Buzkashi's "= failed take" sentence form ("No tears, no trembling lip, no dramatic grimace = failed take. A completely blank face with no change in the eyes or the mouth = failed take.") waits for pilot test T-E (D-6; 02 hard rule 7); in a T-E draft the pair may take that form and counts toward its five sentences.
- **The acting-control footer** (P05b-2). Every performance snippet (A, C, D) ends with the footer in Output templates 4, verbatim: the standing restraint lines LEAK repeated (a BLINKING rule in 22 prompts, "NO sighing" in 21) `[STUDY]`. Two slots follow the bible and the take: the blink quality ("minimal" by default; the bible's own quality when it names one, such as Miraj's high blink rate when tired, still "never fluttering") and the sigh clause (dropped when the take carries a `[sighs]` or `[exhales]` tag, 5b.5). "Wet living eyes" means a natural sheen, not tears; in a dry-eyed state, if a draft reads tearful, use snippet G's dry-eyes fix.
- **Tears:** default is "eyes wet with catchlight — but never spilling" (OSideMedia, MIT), always with both limits. A scripted tear comes late, after the line, built by breath change → moisture → blink change → one tear; Kimti's pair: "reddened wet eyes … chin trembling slightly … No sobbing, no dramatic crying" `[STUDY]`.
- **Two truths at once** for hero shots: the mouth plays the tactic while the eyes or chin leak the cost (forced smile AU12 without AU6, chin tremor AU17).

### 5b.4 FACS vocabulary (bible and QA; plain words in prompts)

FACS action-unit codes are standard (Ekman & Friesen). Seedance's reading of codes in a prompt is `[EMPIRICAL-2.0]`, untested on 2.5, and the official 2.5 guidance warns against piling up micro-expressions. So prompts use the plain phrase; codes live in the bible, the beat map and QA notes. If the user wants to try codes, the A/B (one close-up, phrase only vs phrase + code) runs as the optional pilot test T-A2 (5b.11); until its result is approved, prompts carry phrases only.

| AU | Action | Prompt phrase |
|---|---|---|
| 1 / 2 | inner / outer brow raiser | inner ends of the brows lift / outer brows lift |
| 4 | brow lowerer | brows draw down and together |
| 5 | upper lid raiser | upper lids lift, more white above the iris |
| 6 | cheek raiser | cheeks lift, fine creases at the outer eye corners |
| 7 | lid tightener | lower lids tighten |
| 9 / 10 | nose wrinkler / upper lip raiser | nose wrinkles / upper lip lifts on one side |
| 12 | lip corner puller | lip corners pull up |
| 14 | dimpler | small dimples at the mouth corners (one side only for contempt) |
| 15 | lip corner depressor | lip corners pull down |
| 17 | chin raiser | chin pushes up, the chin skin dimples |
| 20 | lip stretcher | lips stretch sideways, thin and tense |
| 23 / 24 | lip tightener / pressor | lips tighten / press together |
| 25 / 26 | lips part / jaw drop | lips part / jaw drops slightly |
| 38 / 39 | nostril dilator / compressor | nostrils flare / nostrils narrow |
| 41 / 43 / 45 | lid droop / eyes closed / blink | heavy lids / eyes close / a blink |
| 61-64 | eyes left, right, up, down | gaze shifts to <named target>, head still |

Canonical numbering note: some circulating sheets label the nostril dilator AU82; canonical FACS uses AU38 (OSideMedia, MIT, flags the same mismatch).

Recipes (EMFACS prototypes; use as blends, 3-4 expressions per generation at most):
Duchenne smile 6+12 · social or forced smile 12 alone · sadness 1+4+15 · fear 1+2+4+5+7+20 · anger 4+5+7+23 · disgust 9+15(+10) · contempt one-sided 12+14 · surprise 1+2+5+26 · masking warmth over fear 12 + 7 + 17.

**During speech** schedule only brow, eye and cheek actions; let the audio drive lips and jaw (OSideMedia, MIT). Never write emotion as an eye effect ("eyes burning", "fire in his eyes"); the official guide warns against eye-related visual effects, and they render as glowing eyes `[OFFICIAL]`.

### 5b.5 The voice-face bridge (one beat sheet for ElevenLabs and Seedance)

Every v4 tag in a TTS line needs a visible counterpart at the same timestamp, or the face contradicts the voice. Every sound-making action you write in picture (a half-laugh, a sigh) that is *not* in the take must be marked silent in the prompt. The v4 tag list below is current per the ElevenLabs model guide (read via the connector, 2026-10-30) `[OFFICIAL]`; v4 has no style, speed or SSML, and stage directions such as `[grinning]` are not performed.

| v4 tag in the take | Visible counterpart (same timestamp) |
|---|---|
| `[sighs]` / `[exhales]` | shoulders drop, chest falls, air out through the nose, lids lower for one beat |
| `[whispers]` / `[softly]` | small jaw travel, lips barely part, head angled 2-3 cm toward the listener |
| `[warmly]` | faint cheek lift (6), eyes soften; with a hidden cost, add a chin dimple (17) |
| `[tired]` | heavy lids (41), slow blinks, head weight forward, words barely lift the chest |
| `[trembling voice]` | chin tremor (17), a breath catch before the stress word, hands still |
| `[laughs]` / `[chuckles]` | cheek raise plus lip corners (6+12), shoulders bounce on the exhale, eyes stay on the partner |
| `[nervous]` / `[cautiously]` | swallow before the line, glance down-left and back, thumb on the ring |
| `[pause]` / `[long pause]` / `…` | an assessment: eyes drop to the inner object, a swallow or a held breath; never a dead freeze |
| `[gasps]` | lips part (25), brows lift (1+2), sharp intake, body still for 0.3-0.5 s |
| `[shouting]` | jaw opens wide, neck tendons visible, chest forward; only where the voice card allows it |
| `[crying]` | breath breaks into short pulls, chin tremor, eyes wet; the tear comes late |

Two rules close the loop with `01`: the Seedance delivery words for a line are the *mask* (the same thing the v4 tag says), never the subtext; and when the user re-tags or re-renders a line, the beat map for its shot is rebuilt from the new take.

The footer's "no performed sighs" (5b.3) yields to the take: when the line carries `[sighs]` or `[exhales]`, drop that clause from the footer and write the table's visible counterpart at the tag's timestamp. A sigh that is not in the take stays out of the picture.

### 5b.6 Dialogue shots and lip-sync

**What is verified about supplied audio on Seedance 2.5:**
- `[OFFICIAL]` Model limits for reference audio: WAV or MP3, each clip 2-30 s, up to 10 clips, 30 s combined, 15 MB per clip; 2.5 accepts audio-only references (ByteDance's Seedance 2.5 docs on BytePlus, checked 2026-10-30). Recommended, not a hard limit: audio subjects work best as 1-5 clips of 5-10 s (sd25-pe 0.1.1).
- `[OFFICIAL]` On Higgsfield each clip is uploaded once (`media_upload` → PUT → `media_confirm`) and attached by its `media_id` with the role `audio_references`, in `mode: omni_reference` (`models_explore get seedance_2_5`, 2026-11-01). Higgsfield publishes no audio limits of its own, so keep to ByteDance's `[UNVERIFIED on Higgsfield]`; T2 is the first real check.
- `[OFFICIAL]` By default a reference track supplies only voice quality, accent, speaking rate and emotion, and the written `{}` text decides the words, unless the prompt explicitly asks to reuse the dialogue in the audio (sd25-pe, paraphrased). So: say "reuse the speech in @Audio1 exactly" **and** put the identical SPOKEN words in `{}`.
- `[OFFICIAL]` The BytePlus prompt guide binds a voice to a person by naming which character uses the timbre of which audio, keeps listeners' mouths naturally closed, and in its exclusion lists rules out wrong-speaker dialogue, simultaneous speakers, repeated or missing lines and lip-sync errors. Its word-level lip-sync wording with stated acceptance criteria comes from its dubbing (audio-edit) fixes; we borrow it for generation, untested.
- `[FIELD]` A track the prompt does not claim is easily ignored: "Passing a voice track beside a character reference without saying whose voice it is: the model may animate the face and ignore the track" (scenario-labs scenario-seedance, MIT).
- `[UNVERIFIED]` Third-party note (Magnific): the output soundtrack is Seedance's own, not a paste of the input. Plan for `07-edit-mix-finish.md` §7.7 to lay the ElevenLabs master under the picture and nudge sync; T2 in `00` measures the offset. Which voice stays in the cut is logged, because it moves the audio share of the 70% Seedance rule (`00` §0.4). Whether `generate_audio` on or off changes lip accuracy is part of T2 (05 owns the param).

**Face route on Higgsfield** (`03` §3.3–3.4 owns it, `05` attaches it). D1 test T1 decides per character how the approved face reaches `seedance_2_5`: the approved sheets as `image_references` (1a) or as `start_image` (1b); if faces are refused or identity does not hold, a Higgsfield reference element (1c: `manage_reference_elements`, `<<<element_id>>>` in the prompt; its tool description lists `seedance_2_0`, not `seedance_2_5`, so it counts only if T1 shows the job used it) or a first frame generated inside Higgsfield and passed as `start_image` (1d). What this means for acting:
- On route 1d the first frame fixes frame 1, so it must already show the beat map's 0.0 s state: posture, business, eyeline and, for every ON line, a closed mouth. Review it against the beat map before the user approves it (it is its own ledger row).
- A single `expr6` panel or a `lips2` plate may ride along as an extra `image_references` entry for one shot (an untested aid, `03`); the full grid never does, and it never replaces the identity reference.
- A refused face is a route problem: never change the face or the wording to get past the filter (`03` §3.3 rule 1, SKILL §5 rule 1).

**Framing rules for ON lines** `[EMPIRICAL-2.0]` (OSideMedia higgsfield-audio, MIT), treated as defaults until T2 says otherwise:
- MCU or closer, mouth unobstructed (no hand, cup, ring hand or microphone in front of it), face frontal to three-quarter, never profile.
- One speaking face per generation. Two people talking = two generations (one per speaker, the other as a soft shoulder with a closed mouth), cut or composited in `07`.
- Locked-off or a slow push-in. No nodding, head-turn or look-around words during the line: they compete with the mouth.
- **One line per speaking close-up, at most 10 words** (P05b-3). Count "one short sentence ≈ one breath". LEAK's 30 distinct lines had a median of 5 words and a maximum of 13, never more than 6 lines per 30 s, and its rule was "one line = one shot — each character's line appears STRICTLY only inside that character's close-up" `[STUDY]`; the English sync budget of about 16-20 words per ~15 s at 5-10 words per line `[EMPIRICAL-2.0]` agrees. A line of more than 10 words goes back to 01 (REBALANCE: split it across two shots, or carry part of it `OFF` or `VO` over the listener), with the user's yes; never trim, compress or re-time the take. T2 measures Arabic and English only; Hindi and Urdu stay unmeasured until their first drafts, so keep those lines to one breath.
- **Line shape** (LEAK, TOKYO 4:17 `[STUDY]`): the delivery comes before the quote, the addressee is named ("spoken to {{who}}", on or off screen), and a written **after-line behaviour** follows it, which is the post-line phase of 5b.3 ("After the line her eyes lift for exactly one second — searching the other's face — then drop back to the mug", LEAK; TOKYO 4:17: no raised voice, the ending falls quietly, a pause after). When the words matter, add "Speech clear, at normal conversational volume": LEAK's "mumbled" direction made lines hard to understand, and it switched that off where the words mattered `[STUDY]`.
- **Off-screen, voice-over and silent forms** (P05b-3; SÉKOU, THREAD, Kimti and The Breach shipped them `[STUDY]`; 05 §5.3 holds the same wording, and 05's DIALOGUE LOCK counts every voice in the take):
  - `OFF`: the speaker's mouth stays hidden (back, shadow, frame edge) and the audio binds only as voice: "From {{behind the camera / beyond the wall}}, {{intention}}, {{NAME}}'s line is heard, not lip-read; nobody in frame moves their lips."
  - `VO`: "The line is voice-over: {{NAME}}'s mouth does not move on it; lips closed; as if spoken beside the camera, no reverb."
  - `PHONE`: the voice comes from the device ("{{NAME}}'s voice heard from the palm screen"); every visible mouth stays closed. `VO` and `PHONE` lines bind no face and give the listener the shot (snippet D).
  - Silent shot: "Nobody speaks. No lip movement." Only in a prompt that quotes no line (a LEAK prompt that had both a line and "No dialogue" failed).
  - `ON-WIDE` lines (mouth small) get the same binding but no close-up rules. Noah's lines are `VO` or a faceless head; no lip-sync.
- Off-screen performance is written by intention per line, with breaths placed inside the lines (The Breach `[STUDY]`); Kimti, Buzkashi and HUNGER designed lip-sync out of whole scenes (backs, POVs, darkness, inserts), the same move as 05's F4 restage.
- **One file per voice.** 04's `_DLG_` mixes every line of a shot into one track. When a shot carries two voices (the mother on PHONE, then Miraj ON), ask 05 to send each voice as its own file, placed and padded to the same G, so each `@Audio` binds to exactly one person. On Higgsfield each file is its own `audio_references` entry in `medias`, listed in handle order; the tool does not document whether `@Audio1`, `@Audio2` follow that order `[UNVERIFIED]`, so the first two-voice draft is checked for the right voice on the right person before any other is planned.

**Edit window and upload copy** `[HOUSE]` (04 owns the length; 05b sets the performance minimums):
- For every ON line the edit window must hold at least 0.5 s of closed-mouth pre-line, the whole take, and 1.0 s of held reaction after the last word. 04 turns that window into G with its handles (`G = max(4, ceil((L + 24) / 24))`, house cap 15 s although `seedance_2_5` on Higgsfield allows 4-30 s in whole seconds). If 04's markers leave less, ask 04 to move the marker or raise G; never trim the take. A clipped last word is the most common failure.
- BLOCK shots get their padded track from 04 (`_DLG_`, §4.5 step 4). A STILL shot with a line has none, so build the same file: `ffmpeg -i SLA_S11-SH05_S11-L06_MIRAJ_T02.wav -af "adelay=delays=1000:all=1,apad=whole_dur=6" -ar 48000 -ac 1 SLA_S11-SH05_S11-L06_MIRAJ_T02_PAD.wav` (line placed at 1.0 s, total 6 s = G; tested). Every upload copy (`media_upload`) stays at least 2 s. Whether padding helps or hurts placement is untested: include it in T2.
- A short line in a long shot invites invented mumbling to fill the air (OSideMedia, field note). Script the silence: what the speaker does with closed lips before and after.

**Prompt order for a dialogue generation** (fits HELL-GRIND's construction, OSideMedia MIT: "The voice and its emotion → the line in quotes → the physical action → the facial reaction"): binding sentence → language + delivery + speaker + addressee + `{line}` → pre/during/after-line behaviour → silence locks for everyone else → the footer. Use snippet C; 05 wraps it in its DIALOGUE LOCK.

**Non-English lines.** Name the language per speaker in front of the line (`Dialogue language: Hindi.`), never one blanket declaration at the top `[OFFICIAL]`. Paste SPOKEN in its own script (Devanagari, Urdu, Arabic) exactly as in `01`; copy each line from its own code block so RTL editors do not reorder it. Rare names get a phonetic hint only if T2 shows the model breaking them.

### 5b.7 Emotional continuity across shots

Fill these columns in §9 of `templates/continuity-bible.md`, the per-shot state log (`ledger-continuity-physics.md` L.6 owns the file):

`shot_id · char · IN: posture / breath / eyes (dry, wet, red) / hands + prop / eyeline target / intensity · OUT: same fields · accumulated (sweat, dust, fatigue, wet eyes) · tactic · beat turn · approved take · notes`

Rules:
- **States have inertia.** The OUT of shot N is the IN of shot N+1 in story time, unless the ledger records a time jump. "Emotion does not switch off instantly. After a heavy moment the breath is still uneven, the hands still unsteady" (OSideMedia HELL-GRIND, MIT).
- **Degradation accumulates** and never resets: fatigue, sweat, wet eyes, dust on the coverall.
- **Eyeline continuity:** record who or what each character looks at at the first and last frame; a reverse must look back along the same line (`04` sets the 180-degree line).
- **Seam tricks** (OSideMedia HELL-GRIND, MIT): open the next generation with the end state of the previous one, and for a dialogue run include the tail of the previous line in the beat text so the emotion crosses the cut.
- **Continuous moments:** when a shot must open on the exact end state of the previous take, `05` passes the approved take's last frame as `start_image`. The Higgsfield tool returns no separate last frame: take it from the downloaded original with ffmpeg (the original stays byte-identical), upload it with `media_upload` → PUT → `media_confirm`, and log its sha256 and `media_id`. In reference mode (references only, no `start_image`) the opening frame follows the reference world, and "no prompt wording overrides it" (scenario-labs, MIT), so choose per shot. Whether one `seedance_2_5` job accepts `start_image` together with `audio_references` is not documented `[UNVERIFIED]`: 05 tests one before any dialogue shot is planned that way. `mode: video_extension` (`extension_mode: forward`) on the approved take is the other Higgsfield option for a continuous moment; untested for acting continuity, 05 decides.
- **Reaction shots** are written with the same trigger in the same words as the action shot they answer.
- **Dream and real share one core.** In 2nd Life dreams Miraj's centre of gravity, tempo and openness change; his eye task, his ring tic and his crack trigger do not.
- **Non-humans perform small, and keep it** (P05b-6). A robot or creature keeps the same stillness, tempo and attention from shot to shot (5b.2 calm performance); its arc shows as a change of attention or tempo, never as a face or a cute gesture. Changes of size or state happen between takes, never inside one (03 §3.1.9; 05 Non-human block). Log its attention target and tempo in the IN/OUT columns like a human's eyeline. G: never a lunge at a person, no roar.

Arc checkpoints for MIRAJ (provisional, from the user's v0 order; re-map to the locked scene list):

| Point | Centre of gravity / tempo / openness | Eye life | Intensity |
|---|---|---|---|
| Dream opener (DREAM) | high, slow, open chest; the room's centre | holds gazes, rare slow blinks | 3 |
| Wake, bus, metro (REAL) | low, fast shuffle, closed | low scans, high blink rate, drifts shut | 1 |
| The call (REAL) | low; spine flares upright on "mother", folds back | locked on the palm screen; defocus on the inner object | 2 → 4 |
| Kabir's circle | enters low; status break: stops smiling | checks hands, then holds Kabir's eyes once | 2 |
| Work refusals | tactic ladder ask → offer → plead; the door closes | lands on each face, lingers after the "no" | 2 |
| Food gift | status break upward: joy outruns him, he forgets the food | wide, quick, finally looks up | 3 |
| 2nd Life build montage | centre of gravity rises a step each beat; hands slow down | longer holds, lower blink rate | 2-3 |
| Wedding, "Alhamdulillah" | upright, still, weight even | eyes up, then closed; gratitude and disbelief at once | 2 |

### 5b.8 Crowd and background acting

**Crowd laws (P05b-4).** Seven of the 12 studied films directed crowds and extras in text, without an element (In Passing, TOKYO 4:17, CONTROL, Fukushima, THREAD, Buzkashi, HUNGER) `[STUDY]`, and 03 gives anonymous extras no sheet (P03-6). In Passing pasted one block of crowd laws into every crowd prompt, each law with a measurable clause; its crowd footage is Cinema Studio `[CS]`, but its 173 Seedance prompts carry the same blocks ("EVERY FACE IN FRAME IS ALIVE" in 163) `[STUDY]`. Every shot with people besides the tracked characters gets snippet E, with each law filled:

1. **Count, not "crowded."** State the headcount ("about 20"; In Passing: "AT LEAST FORTY PEOPLE, no empty floor"), or the model gives three people in one take and a hundred in the next (OSideMedia HELL-GRIND, MIT). Only 3 characters track reliably across cuts and at most 2 character identities go into one generation (03 P03-6); everyone else is one described mass.
2. **A palette that never competes with the leads:** muted mid-tones, the gender mix stated, nothing brighter than the leads' colours (In Passing: "dark coats the majority, muted mid-tones … a good third women; nothing bright").
3. **A task per person, never a mood:** every hand holds something real (strap, palm screen held low, cup of juice or tea, crate), and nothing floats. Name 2-3 tasks per crowd. Give 2-4 featured extras one visible action each ("asleep against the pole", "sweeps her patch of pavement, slow even strokes"). Plot-relevant extras are 03's featured extras (face + `turn3`, a colour-separation line, one identifying prop) with their hands and eyes locked in the prompt ("HIS HANDS NEVER MOVE FROM WHERE THEY ARE"). In Passing: "nobody acts — each person wants only the ordinary thing in front of them, shown as behavior, never as expression."
4. **Gaze law with named exceptions:** nobody looks at the lens or at the hero, and nobody makes room for the camera; the exceptions are named, and the one who looks is the story (In Passing: "NOT ONE PAIR OF EYES MEETS ANOTHER … Exceptions: KENJI — the only person in this car looking at anybody"; Fukushima: nobody looks at the lead). Also write the hero's tempo against the flow: at the flow's speed, faster than everyone, or "the only body not moving".
5. **One shared physical cause moves everyone together, timed:** "the BRAKE arrives: the whole crush LEANS AS ONE BODY" (In Passing). Physics moves a crowd as one body; attention and emotion move it as a wave. **Reactions travel in a wave, never in sync:** stagger by 0.3-0.5 s per person or group, vary the strength, and let some not react at all (OSideMedia FACS skill, MIT; TOKYO 4:17: "All background activity is staggered and independent. No synchronized gestures, posing, camera-facing smiles or stationary mannequin-like patrons").
6. **Bodies cross the lens:** a near body crosses between the lens and the hero at least twice, once early and once late, and the hero's face stays clear (In Passing's Seedance form: "FOREGROUND CROSSERS, REQUIRED, AT LEAST TWICE — once early, once late"). Never across a speaking mouth (5b.6): in a dialogue close-up, crossers pass before or after the line. A narrow field of view stacks the crowd into soft shapes with real motion; 05 owns the camera sentence.
7. **Every face alive:** "EVERY FACE IN FRAME IS ALIVE: eyes BLINK at uneven intervals, never on a count; chests breathe; gazes shift. EYES DO NOT WIDEN — lids LOW and RELAXED" (In Passing, 707 prompts). **Listeners in bokeh are not statues** either: head direction, small shoulder movement, staggered reactions.
8. **Running-take bookends:** "THE SHOT IS ALREADY RUNNING WHEN IT STARTS … THE TAKE IS STILL RUNNING WHEN IT ENDS … mid-stride everywhere" (In Passing, 883 of 886 prompts; the bodies of the lines were rewritten per shot). It matches 05's "Frame one is already running".
9. **No principal face in the crowd; no clones:** never duplicate a principal's face into the background (TOKYO 4:17: "Do not duplicate principal faces into background patrons"). Where faces would repeat, keep them soft and unresolved behind foreground bodies (CONTROL: "If no face is legible, no face can be repeated"). An extras-only insert attaches only the location plate and says "if it contains people, do not reproduce them" (TOKYO 4:17).
10. **Freeze at the threat:** constant small movement, and at the key moment everything stops; the contrast is punctuation.
11. **Mouths and voices:** every non-speaking face keeps its mouth naturally closed. Crowd voices are texture, never quoted lines (In Passing: "VOICES ARE TEXTURE, never quoted lines"); laughter or murmur is a sound effect in `<>`, written as "a ripple of laughter, no words" (`06-music-and-sfx.md` decides whether Seedance or post makes it).
12. **G check:** panic plays as turning heads and stepping back, never as screaming faces or anything frightening. G business only: juice, tea, water, palm screens, bags; never a beer pitcher, smoke or a pickpocket's lift (In Passing's own business, 5b.10).

The "= failed take" fences In Passing put on these laws ("A fixed stare = failed take", "No foreground crosser = failed take") enter only pilot test T-E drafts (D-6). The crowd block counts toward 05's word budget: drop the lines that do not apply (a seated room needs no MOTION law).

Example, Kabir's line "the drama king has arrived": eight onlookers in a loose arc 2-4 m behind Kabir; the two at the front laugh first, three more half a beat later, the two at the back do not laugh and look at Miraj. Kabir does not laugh at all; he is the still one. The most valuable frame is Miraj's face after the laugh, so it gets its own generation (snippet D).

### 5b.9 Review the draft (performance QA before final-from-draft)

Review every draft take three ways (calesthio, MIT): sound on (does the voice match the face and body energy; are beat turns visible and audible?), sound off (can you read the relationship, attention target and pressure; any frozen blinks, random nods, hand artefacts?), audio only (does the read have a listener, a tactic and an arc?).

Lip-sync checks on every ON line: mouth closes on p, b and m; lower lip meets the teeth on f and v; the first and last words open and close on time; the mouth returns to rest after the line; no invented words, laughs or murmurs (compare against SPOKEN); listeners' mouths stay closed; audio never leads the mouth by more than 1 frame and never lags by more than 2 at 24 fps (`07` §7.7; T2 in `00` uses ≤ 2 frames on a close-up). Measure it on 07's 12-frame strip at the audio onset (§7.2 E, onset from silencedetect), or by stepping frames against the waveform in Premiere. A 2 fps contact sheet is for blinks and drift only; it cannot show a 2-frame offset.

Performance checks from the studies, on every take:
- **Both limits.** Over-play (tears that roll when the beat map says they hold, sobbing, a trembling lip, a grimace, shouting for the camera) and under-play (a blank face with nothing moving in the eyes or mouth) are each a failed take (Buzkashi's EMOTION LAW).
- **Micro-beats and footer.** Count the written micro-beats ① ② ③ on screen; note any that is missing or replaced by mugging. Blinks are uneven and never fluttering, there is no sigh the take does not carry, and the eyes reach the target before the head.
- **Dialogue forms.** Lips stay closed on every `VO`, `OFF` and `PHONE` line, and the after-line behaviour plays as written. The line is intelligible where the words matter.
- **Crowd.** Count the crowd against its number; check that no face stares, freezes or looks at the lens outside the named exceptions, that no gestures are synchronized, that the shared cause lands near its second, that the crossers pass twice and that no principal's face repeats among the extras (5b.8).
- **Non-human.** It moves small and calm, with no pet trick, no cute beat and no sudden move toward a person (5b.2).

Score each take on the performance scale (OSideMedia, MIT): 0 mannequin, 1 declaimer, 2 diligent, 3 craftsman, 4 alive, 5 magnet (two truths at once). **Hero shots must reach 4.** Fix with one surgical line at a time and log it; "If a shot has not come together in 10–15 iterations, the problem is not the wording" (OSideMedia HELL-GRIND, MIT): split the shot, remove an action, change the angle. Acting and lip-sync are approved at the 480p draft, but the 1080p final (finalized from the draft with `draft_job_id`) is a new render whose detail may differ (`05`), so re-check eyes, blinks and lip closures on the final before it enters the ledger. Higgsfield can finalize a draft only within 7 days of its creation: review takes the day they arrive; a draft past the window is drafted again (new job, new ledger row, new G5b-C). `08-judge-panel.md` reuses this scale and the failure table.

**Ledger and hand-made takes.** Every draft and final is one ledger row in the same turn (05 writes it): the Higgsfield job ID (on a final, also the draft's job ID), model `seedance_2_5` as `models_explore` shows it, route `Higgsfield-MCP` or `Higgsfield-web (user)`, folder (`04_SCENES/Sxx/drafts` or `/finals`), `draft_expires_utc` = creation + 7 days, and the sha256 of the downloaded original. Takes the user runs by hand in the web app are read back with `list_project_assets` (the scene folder's `folder_id`, `output_kinds: ["video"]`) and `get_project_asset_prompt`, reviewed with the same draft review card, and logged the same way.

### 5b.10 Technique cards: LEAK, TOKYO 4:17, In Passing (method only)

The user marked these three films for acting and realism, for actors who look like real people, and for natural secondary actors. Each card says what the film did (the study's own numbers), what this module takes and where, what it leaves out, and the G cautions. Full evidence: the study files and the playbook §3D Cards 3–5. Nothing from these films is copied except method (ground rule 9).

**Card L · LEAK, by `@creativemanifesto`** (acting and realism; `2026-11-02_leak.md`)
- **What it did.** A two-hander, 7:17, made by a single filmmaker: 43 Seedance 2.5 jobs, all at 1080p, 32 of them in the cut. The acting is underplayed to the edge of stillness. 30 distinct lines, median 5 words, maximum 13, at most 6 per 30 s. Micro-beats ① ② ③ in 6 prompts, a BLINKING rule in 22, "NO sighing" in 21, operator breathing in 24, a no-fill light line in 18. The lead's casting board `JUNE_CF_02` rode in 35 of 43 jobs. From day 2 the hardest beats became single takes (16 single-take prompts, 4–6 s windows each holding one beat, the last window "Hold"; 100 mm on 4 of them); they are the film's longest shots (up to 19.4 s).
- **Wording worth keeping.** "Performance micro-beats: ① … ② … ③ …" · "⚠️ BLINKING: natural and MINIMAL — occasional real blinks only, never fluttering, never rapid" · "Emotion in the body and stillness, not the face" · "micro-pause before reactions, precise eyelines, wet living eyes with catchlight, visible breath and chest movement" · the line shape: delivery → quote → "After the line her eyes lift for exactly one second … then drop back to the mug."
- **Where we use it.** Micro-beats, state as body mechanics and the footer: 5b.3. Line budget, line shape and intelligibility: 5b.6. The board: 5b.2, pilot test T-A1. Hard beats as single takes: a beat map in 4–6 s windows, one physical step per window, the last window a hold, inside 05's duration rules (D-10); a narrow field of view of about 14–20 degrees stands in for 85–100 mm `[INFERRED conversion]`; 05 writes the camera.
- **Pitfalls it hit.** "dialaoge: …" next to "June is alone. No dialogue." failed (the clean rewrite reached the film). A "mumbled" direction risks lines nobody understands. A memory reference photo overrode the wardrobe text in 1 of 2 identical rolls. A prompt cut at 4,500 characters lost its last shot and style block (05's pre-submit lint).
- **Left out.** Its 30 s written-cut jobs (05 rule 3; pilot test T-F covers inserts only, never dialogue); the typed card inside the board image (no text in our images); "mumbled" as a default; its pre-graded plates (02 and pilot test T-B decide where the look lives).
- **Do not copy.** Mai and June, their looks and names, the bungalow, the faucet-drip motif, the belt, the cracked mug, the photo-in-the-box device, any line.
- **G.** June rolls and smokes cigarettes: never. The strike stays outside our film even off-screen; rage is a slammed palm, never a blow (ground rule 6). Romance stays modest.

**Card TK · TOKYO 4:17, by `@nicholastakeyama`** (actors who look like real people; `2026-11-02_tokyo417.md`)
- **What it did.** Eight recurring characters pass as real, unknown actors through 27 Seedance generations in 10 lighting worlds; 64 Seedance jobs, all at 1080p, for a 5:55 film. Faces were cast, not described: Soul Cast rounds (4 of 84 kept), then one GPT Image 2 4K realism pass ("IDENTITY > BEAUTY. REALISM > POLISH."). Video used elements only, and principals are never re-described in video prompts, only called A and B. The acting notes ask for an everyday tempo, quick answers, "do not demand a smile", and "no exaggerated surprise … end on the short pause". In its later, Japanese-language prompts every line has a delivery note under it ("no raised voice … let the ending fall quietly … a pause after"), the line count and order are fixed ("Speak only the six quoted Japanese lines, once each, in the specified order"), and Japanese is spoken by Japanese faces (48 of 64 prompts).
- **Where we use it.** Casting and the realism pass are 03's (routing rows 1–2: Soul Cast round, then `gpt_image_2` 4k). This module never re-describes a principal's face in performance text; it writes what the person does, and the face route (T1, 05-T11) decides what 05 repeats in 【Maintain Consistency】. The delivery mask plus an after-line behaviour (snippet C) carries TOKYO 4:17's delivery note. Nobody smiles unless the beat map plays a smile; a scene ends on the pause (5b.3 post-line hold). The language follows the faces (01 sets it per speaker; 5b.6 names it per line). For extras: no principal face in the crowd, everything staggered and independent, extras-only inserts with the location plate alone (5b.8). The readable stop on a face after a fast move belongs to 05's camera sentence.
- **Left out.** Its backstory blocks inside the video prompt (ground rule 2: subtext and inner reasons stay in the Scene Read, never in the prompt), its 26–30 s scenes with written internal cuts (05 rule 3), and its brand-like element names (03 P03-10).
- **Do not copy.** The salaryman and ex-gangster pair, the hostesses, the taxi driver, the dawn detours, the title, any line, any face or plate.
- **G.** A hostess club, bottles and glasses, a pistol fired at a chandelier: none of it. Extras hold juice or water. Every face is synthetic, with no lookalike.

**Card IP · In Passing, by `@julianmarshall`** (natural secondary actors; `2026-11-02_inpassing.md`)
- **What it did.** Background people behave like paid, well-directed extras: packed train cars where every rider rides the sway, holds a strap and looks at nothing; rush-hour platforms; a 60-person room where the nearest table stands up at an accident while the rest only turn their heads. Crowds never got an element. Each crowd prompt carried a block of laws with measurable clauses: count, palette, a task per person, an eye-line law with named exceptions, a motion law, a shared physical cause, required foreground crossers, a long lens. Life signs ran in 707 prompts and the running-take bookends in 883; 2–4 featured extras got one-line vignettes; never more than 2 character elements per job. Engine caveat: 79 of its 89 verified cuts are Cinema Studio `[CS]`; its 173 Seedance prompts carry the same blocks (CANDID 170 of 173, EVERY FACE IN FRAME IS ALIVE 163 of 173), so the transfer to Seedance is `[INFERRED]`.
- **Where we use it.** The twelve crowd laws (5b.8) and snippet E. Featured extras follow 03 P03-6. Its 720p rehearsal pass becomes our 480p draft, finalized as the same take (05 rule 2). Its post-assembly pickups become 07's pickups.
- **Left out.** Cinema Studio video for crowds (it would break the 70% Seedance rule), "TRUE SLOW MOTION" (05 bans undeclared slow motion), its four-shot written-cut prompts (05 rule 3), and its "= failed take" fences outside pilot test T-E (D-6).
- **Do not copy.** Kenji and Sakura, the wallet device, the train-car and izakaya set pieces, any line.
- **G.** The film is built on pickpocketing played as charm, a beer pitcher, a smoky room and kiss inserts. Use G business (tea, juice, bags, palm screens), modest romance, panic as turning heads only; children in a crowd pass 00's G1 and G2 checks.

### 5b.11 The two-scene pilot: what 05b directs, tests and locks

Decision 2026-11-02 (SKILL.md; 02 §2.13; 03 §3.5; 05 §5.11): after the script and the style are locked and the pilot scenes' assets pass G2-P, Claude produces two full scenes end to end with the final method; the open tests run inside them. If the user approves both scenes, the whole film is made on exactly the same basis.

1. **Direct both scenes with the full method.** Bibles for every character in the two pilot scenes (G5b-A), a Scene Read for each scene (G5b-B), a beat map for every pilot shot, and snippets A–G (H only inside T-A1) with the micro-beats, both limits, footer, line forms, crowd laws and calm non-human performance as written here. Other characters' bibles may be drafted; they are approved after the pilot, on its basis.
2. **Review like production.** Every pilot draft gets the 5b.9 review and G5b-C. Every pilot final is re-checked after finalize (05's T3 at scale) for eyes, blinks, lip closures and the micro-beats.
3. **Pilot tests owned by 05b.** Each runs inside the pilot scenes, is preflighted with `get_cost: true`, and needs one yes for the set. Until the user approves a result, the current rule (column 3) stays in force everywhere outside the test.

| Test | Question | Current rule until approved | Method in the pilot | Pass |
|---|---|---|---|---|
| T-A1 (P05b-5) | Does a behaviour board carry a lead's habits into Seedance without its panels, layout or backgrounds leaking? | no board; behaviour lives in the bible text and the beat map | one pilot shot of one lead, drafted twice with identical settings: (a) the usual references; (b) the same + the board as one extra `image_references` entry with the BEHAVIOUR BOARD role line (4H); review sound off at 2 fps and at full speed | (b) shows the named habits more often or more naturally; identity holds; no panel, grid, still or board background is reproduced and there is no slideshow → the board is allowed for leads, inside 05's reference limits |
| T-A2 (optional, 5b.4) | Do FACS codes in a prompt help Seedance 2.5? | plain phrases only; codes stay in the bible and QA | one close-up drafted twice: the phrase alone vs the phrase + its AU code | the coded take plays the named action more precisely with nothing added → codes allowed in close-ups |
| T-E (owned by 02 §2.13; run with 05) | Do "= a failed take" sentences reduce named failures? | declarations only (5b.3 both limits; 5b.8 laws) | in the T-E draft, the both-limits pair and at most one crowd law may take the failed-take form, inside its five sentences | as 02 states |

4. **Lock at pilot approval** (G5b-P, with 05's G5-PILOT). Claude writes `films/<id>/05b-acting/PERFORMANCE_LOCK_v1.md`, holding the approved bible versions (with any behaviour board), the exact text of snippets A–H as used in the approved pilot shots (footer, limits wording, line forms, the OFF / VO / PHONE / silent forms, the crowd block and the robot block), the line budget, the score minimum for hero shots, and the T-A1, T-A2 and T-E results with the rule each one now sets. 05's `RECIPES_v1.md` cards point to it for their PERFORMANCE and DIALOGUE slots. Every later shot fills only the slots. A change is `PERFORMANCE_LOCK_v1.1` with the user's yes and a list of shots to redo.
5. **If the pilot is not approved,** the user names what failed. Fix it at the right layer (bible, Scene Read, beat map or snippet; or 01's line, 03's reference, 05's packet), re-run the affected pilot shots, and ask again.
6. **Name.** The pilot is an internal production test. Its name never appears in the film, the credits or the submission (00 F8).

---

## Output templates (what Claude shows the user)

**1. Performance bible card** (one file per character: `films/<id>/05b-acting/<CHAR>-bible.md`)

```text
CHARACTER: MIRAJ        asset: CHR_MIRAJ        status: DRAFT / APPROVED (date, user's words)
MASTER PROFILE (150-220 words): ...
VOICE LOCK (copied from 01, never retyped): voice_id ____ · eleven_v4 · stability __ · similarity __
  descriptor: "..." · allowed tags: ... · forbidden tags: ...
PHYSICAL SIGNATURE: centre of gravity __ · tempo __ · openness __ · breath baseline __
  gait: "clock-in shuffle" = ... · business: ... · tics: <tic> WHEN <trigger>; ...
MASK / CRACK: mask = ... ; However, when <trigger>, ...    SOFTENING TARGET: ...
EYE LIFE: task __ · blink __ · scan __ · eyes lead head
FACE MAP: rest = ... [AU] · mask = ... [AU] · crack = ... [AU]
INTENSITY: REAL 1-2 · DREAM up to 3-4 · pressure/amplitude/control __/__/__
ARC CHECKPOINTS: start __ · turn __ · end __
FORBIDDEN: ...
```

**2. Scene Read card** (5b.1 fields, one table per scene, with the event named from the ending and the Intent cross-check result).

**3. Shot beat map** (one per shot; times on the shot clock: 04's line marker plus the measured speech inside the selected take):

```text
S11-SH05 · MCU MIRAJ · line S11-L06 (ON) · take T02 3.1 s, speech 0.1-2.9 s · edit window 0.5 + 3.1 + 1.0 = 4.6 s → G 6 s (04), line placed at 1.0 s · 50 mm locked off · eyeline: palm screen, low right
t (s)    VOICE (take)             BODY / BUSINESS                 FACE (prompt words) [AU]                  EYES                          BREATH                 INT
0.0-1.1  silence                  thumb stops turning the ring    lips press, then part [24→25]             drop to palm screen, lift     one short nasal inhale  1
1.1-3.1  [warmly] line            shoulders lift a centimetre     polite half-smile, cheeks still [12 no 6]  hold on mother's image        held under the line     2
3.1-3.9  stress on the last word  ring hand closes into a fist    smile holds, chin dimples once [17]       flick down-left and back      short exhale, nose      2
3.9-6.0  silence (tail)           stillness, fist stays closed    smile drains last; lips closed [12 off]   fixed on the screen, one slow blink   chest stops      2
Two truths: the mouth reassures, the chin and the fist pay for it. Pruned: head tilt (redundant).
Micro-beats in the prompt (max 3): ① the thumb stops turning the ring ② the ring hand closes into a fist ③ the smile drains last.
Limits: not needed (intensity ≤ 2, no tears). Footer: blink quality "slow and heavy" (bible: tired at night); sigh clause kept (T02 carries no [sighs]).
Line: 01's SPOKEN, ≤ 10 words · spoken to: his mother, on the palm screen · after-line: holds the screen half a second, then one slow blink.
```

**4. Prompt snippets for `05-seedance-production.md`** (fill the `{{slots}}`; spell handles exactly as `05` does and never mix forms in one prompt, since the official docs show both `@Audio 1` and `@Audio1`; this skill always uses the unspaced form; `05` adds the reference roles, style prefix, camera, audio suppression and parameters). The text of every snippet as used in the approved pilot shots is frozen in `PERFORMANCE_LOCK_v1` (5b.11).

FOOTER, the acting-control footer (P05b-2; pasted verbatim as the last lines of A, C and D; two slots only)
```text
Blinking natural and {{minimal | the bible's blink quality}}, never fluttering, never on a count; {{no performed sighs — omit this clause when the take carries [sighs] or [exhales]}}; emotion lives in the body and stillness, not the face; a micro-pause before each reaction; the eyes reach {{target}} before the head; wet living eyes with a catchlight; normal human eyes.
```

A. PERFORMANCE block (non-dialogue shot)
```text
{{NAME}}, {{one visible marker}}, is already {{state: posture + business, mid-action}}; {{state as body: breath type, shoulders, chin, hands, weight}}.
{{NAME}}'s eyes work on {{eye task}}: {{target + pattern}}, the eyes reaching {{target}} a beat before the head turns.
When {{trigger, visible in frame}}: ① {{first involuntary cue}} ② {{chosen response: business/posture/distance in m}} ③ {{residual cue that stays}}.
{{Intensity 3+, tears, anger or fear only — BOTH LIMITS: The only sign of {{the state}} is {{one physical tell}}; {{NAME}} does not {{over-play: sob / shout / crumple}}. The face is never blank: {{the smallest living sign}} stays visible.}}
{{Silent shot only: Nobody speaks. No lip movement.}}
{{NAME}} does not look into the camera. {{Others in frame}} keep their mouths naturally closed.
{{FOOTER, verbatim}}
```

B. Emotion shift (the official four-sentence structure, in our words; once per generation)
```text
Emotion moves from {{neutral surface word A}} to {{neutral surface word B}}. After {{trigger}}, {{NAME}} first
{{immediate observable reaction}}. Then {{eyes/brows/mouth/breath/gaze/hands}} gradually {{change}}.
Finally {{NAME}} shows it only through {{restrained outward behaviour}}.
```

C. DIALOGUE / LIP-SYNC block (ON line; one speaker and one line per generation; 05 places its binding sentence and DIALOGUE LOCK around it)
```text
{{05 §5.3 binding sentence for @Audio1, verbatim (DIALOGUE AUDIO REFERENCE; reuse the speech exactly; p, b, m closures)}}
Dialogue language: {{language from 01}}, {{accent from 01}}. {{NAME}}'s line ({{2-3 delivery words = the mask, matching the v4 tag}}), spoken to {{addressee, on or off screen}}: {{SPOKEN, identical to 01, ≤ 10 words}}
Before the line, {{pre-line cue}} with lips closed. On {{stress word}}, {{one cue}}. After the line, {{after-line behaviour: e.g. holds the look for half a second, then looks down at the palm screen}}; lips closed.
{{When the words matter: Speech clear, at normal conversational volume.}}
{{NAME}} speaks only these words; no other voice, murmur, laugh or added line. {{Listener}} keeps the mouth naturally closed and listens.
{{NAME}}'s head stays steady while speaking. ({{camera words from 04/05: locked-off MCU or slow push-in}})
{{FOOTER, verbatim}}
```

D. LISTENER / REACTION shot (PHONE, VO, OFF lines, and the face after an event)
```text
{{NAME}} listens to {{source: the voice on the palm screen / Kabir off-screen right}}, mouth naturally closed throughout.
{{OFF: From {{behind the camera / beyond the wall}}, {{intention}}, {{SPEAKER}}'s line is heard, not lip-read; nobody in frame moves their lips.}}
{{VO: The line is voice-over: {{NAME}}'s mouth does not move on it; lips closed; as if spoken beside the camera, no reverb.}}
{{PHONE: the only voice is {{SPEAKER}}'s, heard from {{the palm screen}}, from @Audio{{N}}; every visible mouth stays closed.}}
The reaction starts before the line ends: ① {{mid-line cue}} ② {{assessment: eyes to inner object, swallow / held breath}} ③ {{chosen response}}.
No speech from {{NAME}}.
{{FOOTER, verbatim}}
```

E. CROWD block (5b.8 laws; drop the lines that do not apply; the "= failed take" fences only in pilot test T-E drafts)
```text
THE CROWD: about {{N}} people, {{spread, distance in m}}, no empty floor; {{palette: muted mid-tones, nothing brighter than the leads}}; {{gender mix}}; no principal's face among them{{; where faces would repeat they stay soft and unresolved behind foreground bodies}}.
BUSINESS: every {{rider / guest / worker}} is busy with an ordinary errand: {{task 1}}, {{task 2}}, {{task 3}}; every hand holds something real; nothing floats. {{Featured extras, 2-4: {{who}} {{one visible action}}; …}}. Nobody acts: each person wants only the ordinary thing in front of them, shown as behaviour, never as expression.
EYES: nobody looks at the lens or at {{HERO}}, and nobody makes room for the camera; exceptions: {{named, who looks at whom}}. {{HERO}} moves {{at the flow's speed | faster than everyone | the only one not moving}}.
MOTION: {{everyone mid-stride, both directions, at their own speeds | seated, each at their own table task}}. At about {{t}} seconds {{shared physical cause: the bus brakes}} and the whole crowd {{leans as one body}}. {{Reactions to a sound or a sight travel as a wave: {{front group}} first, {{middle}} about half a second later, {{back}} not at all; no synchronized gestures.}}
FOREGROUND: a near body crosses between the lens and {{HERO}} twice, once early and once late; {{HERO}}'s face stays clear{{; never across a speaking mouth}}.
LIFE: every face in frame is alive: eyes blink at uneven intervals, never on a count; chests breathe; gazes shift; lids low and relaxed, no wide eyes; mouths naturally closed.
The shot is already running when it starts: {{the crowd mid-what}}; it is still running when it ends: {{mid-stride everywhere}}.
<{{crowd sound}}, voices are murmur only, no words>
```

F. ROBOT block (performance only; 05 pastes the Non-human block with integration, scale and gait)
```text
{{ROBOT}} stands with its head held still; turns begin at the torso and finish exactly, with a tiny settle. Before answering
it holds completely still for a moment, then {{one small gesture: palm opens}}. Its {{sensor/light}} tracks {{person}}, never
the room, and keeps {{the design's steady light}}, never a glow of its own. It performs small and calm: no pet tricks, no
playful bounce, no waving, no exaggerated cuteness, no sudden move toward anyone; its presence comes from its size, its
stillness and where it attends. It {{follows {{person}}'s lead: walks when {{person}} walks, stops when {{person}} stops | leads only where the script says}}.
{{Signature: servo hitch on the right step, small torso lean}}. {{If VO: its voice comes from @Audio{{N}}; it has no mouth and nothing on the head panel moves with speech.}}
```

G. Surgical fixes (change one line, log it)
- "Hold eye contact through her line; look down only after the denial."
- "Remove the nod; the head stays still while he speaks."
- "Reduce the smile from 3 to 1; warmth in the cheeks, not the teeth."
- "Add 0.5 s of closed-mouth silence before the line" (04 moves the line marker 12 frames later and rebuilds `_DLG_`).
- "The listener's lips move: add 'keeps the mouth naturally closed and listens' to that person."
- "Eyes glow: replace the eye-effect words with a gaze target and 'normal human eyes'."
- "Tears roll or the face crumples: add the limits pair: 'eyes wet with a catchlight and never spilling; no sobbing'."
- "Blank face on a strong beat: add one micro-beat in the eyes or the mouth and 'The face is never blank: {{smallest living sign}} stays visible.'"
- "Eyes read tearful in a dry-eyed state: replace 'wet living eyes' with 'eyes dry, with a natural sheen and a catchlight'."
- "Fluttering or rhythmic blinks, or a sigh the take does not carry: paste the FOOTER verbatim."
- "Extras stare at the lens or at the hero: add the EYES line with its named exceptions."
- "Lips move on the voice-over: paste the VO form; 05's DIALOGUE LOCK counts the line."
- "The robot bounces, waves or tilts its head like a pet: paste snippet F's calm line."

H. BEHAVIOUR BOARD role line (only inside pilot test T-A1 until the user approves its result; goes after the identity sheet's role line)
```text
@Image{{N}} is {{NAME}}'s BEHAVIOUR BOARD: use only how {{NAME}} holds, fidgets, sits and moves ({{2-3 habits from the bible}}); not its panels, framing, light, backgrounds or any single still; never reproduce a panel or cut to one. Identity comes from @Image{{M}}.
```

**5. Draft review card** (per take): shot, take, Higgsfield job ID and `draft_expires_utc`, score 0-5, sound-on / sound-off / audio-only notes, lip checks (p/b/m, f/v, first/last word, rest, invented words, listener mouths), offset in frames, continuity IN/OUT match, micro-beats ① ② ③ seen / missing, both limits (over-play? blank face?), footer (blinks, sighs, eyes before head), `VO`/`OFF`/`PHONE` lips closed, crowd checks (count, stares, sync, cause, crossers, repeated faces), pilot test arm if any (T-A1 a/b, T-A2, T-E), one-line fix, verdict.

**6. Message to the user** (Arabic, short, gender-neutral wording): what was built (bibles, scene reads, beat maps), the open questions, then the gate question. Prompts stay in English code blocks.

**7. Performance lock card** (at the pilot approval; `films/<id>/05b-acting/PERFORMANCE_LOCK_v1.md`)
```text
PERFORMANCE_LOCK v1 (frozen <date>, the user's words: «…») · pilot scenes <Sxx, Syy> · look LOOK v<X.Y> · 05 RECIPES_v1
BIBLES: <CHR> v<n> (sha256 …) · behaviour board <yes: asset id | no> …
SNIPPETS (exact text as used in the approved pilot shots): FOOTER · A · B · C · D · E · F · G · H — sha256 each
LIMITS WORDING: <declaration form | failed-take form if T-E approved>
LINE RULES: one line per speaking close-up, ≤ 10 words; delivery → quote → spoken to → after-line; OFF / VO / PHONE / silent forms as in 05 §5.3
CROWD BLOCK: <E as used> · ROBOT BLOCK: <F as used>
HERO SHOT MINIMUM: score 4 · TESTS: T-A1 <result → rule> · T-A2 <result | not run> · T-E <result for performance lines>
CHANGES: none without PERFORMANCE_LOCK_v1.1, the user's yes and a list of shots to redo
```

---

## Gate (what the user must approve)

All gate questions use gender-neutral Arabic (first person plural or impersonal forms), never a gendered "you".
- **G5b-A, bibles (before the first dialogue draft, D7; for the pilot characters first):** every recurring character's bible approved in the user's words: profile, voice lock copied from `01`, physical signature, arc checkpoints, forbidden list, and the behaviour board only if T-A1 has passed. Ask: «هل نعتمد ملف الأداء لـ MIRAJ كما هو، أم نعدّل سطرًا معيّنًا؟»
- **G5b-B, scene reads (per scene, before its shots are written):** event named from the ending, objectives and tactics, Intent cross-check resolved. Ask: «هل هذا هو الحدث الحقيقي للمشهد S11، وهذه رغبة كل شخصية؟»
- **G5b-C, takes (per shot, at the draft, before final-from-draft):** hero shots score 4+, lip checks pass, both limits hold, the micro-beats and footer read on screen, crowd checks pass, the IN/OUT row in continuity-bible §9 is filled; closed in time for 05 to finalize inside Higgsfield's 7-day draft window (house rule: before the draft is 5 days old, SKILL §6). Ask: «هل نعتمد هذه اللقطة أداءً ومزامنةً وننتقل إلى النسخة النهائية 1080p؟» Silence or a change of subject is not approval.
- **G5b-P, the pilot's performance (with 05's G5-PILOT, after both pilot scenes are assembled with rough sound and grade):** both scenes' performances approved in the user's words, and the T-A1 (and T-A2, if run) results accepted or rejected one by one; then `PERFORMANCE_LOCK_v1` is written (Output templates 7). Ask: «المشهدان التجريبيان جاهزان أداءً وحوارًا. نتيجة الاختبار T-A1: <…>. إذا اعتمدناهما، نثبّت ملف الأداء PERFORMANCE_LOCK_v1 ونُخرج بقية الفيلم على الأساس نفسه تمامًا. هل نعتمد المشهدين ونتيجة الاختبار؟» A paid batch for any shot outside the pilot scenes waits for this yes (05 rule 15).

## Common failures

| Symptom | Cause | Fix |
|---|---|---|
| Wooden face, glassy stare | no eye task; emotion words instead of behaviour | give the eyes a job aimed at the partner; small signs of life through the footer; the phased blink only where the bible allows it |
| Mugging, grimaces | the face asked to show the emotion; more than three written cues | write the objective and business; at most three micro-beats ① ② ③; prune |
| Tears roll, sobbing, a crumpling face on a strong beat | only the positive asked for; no over-play limit | both limits as declarations (5b.3); the tear built late; "= failed take" form only inside pilot test T-E |
| Blank, frozen face on a strong beat | restraint taken to nothing; no under-play limit | "The face is never blank" + one micro-beat in the eyes or the mouth |
| Fluttering or rhythmic blinks, performed sighs, eyes that read tearful in a calm scene | footer missing, retyped, or "wet living eyes" read as tears | paste the FOOTER verbatim; blink quality from the bible; snippet G's dry-eyes fix |
| Flat both ways | action and acting in one generation | split by job, stitch in `07` |
| Character recovers instantly after a strong event | no inertia | carry the OUT state into the next shot; residual cue after every beat |
| Same reaction from everyone at once | synchronized ensemble | wave with 0.3-0.5 s stagger; vary strength; some do not react (a physical cause such as a brake is the one thing that moves everyone together) |
| Extras stare, freeze like mannequins or look at the lens | no life-signs line; no gaze law | snippet E's LIFE and EYES lines with named exceptions |
| A principal's face shows up among the extras, or extras are clones | faces resolved where they repeat; principal sheet leaking | "no principal's face among them"; faces soft behind foreground bodies; extras-only inserts take only the location plate |
| The crowd drifts with no reason, or the frame has empty floor | no count, no tasks, no shared cause | headcount, a task per person, one timed physical cause (5b.8) |
| A foreground crosser covers the speaking mouth | crossers written into a dialogue close-up without timing | crossers only before or after the line, never across the mouth |
| Lips move on a voice-over or off-screen line | VO / OFF form missing | 5b.6 forms; 05's DIALOGUE LOCK counts the line |
| A line is mumbled or unintelligible | "mumbled" or "whispered" delivery where the words matter | "Speech clear, at normal conversational volume"; whisper only with a `[whispers]` tag |
| A line over 10 words drifts out of sync or gets a cut | too much text for one close-up | 01 REBALANCE: split across shots or carry part of it OFF/VO |
| A behaviour-board panel or grid appears in the video (T-A1) | the board read as a shot | the 4H role line ("never reproduce a panel") + 05's anti-slideshow line; if it persists, T-A1 fails and the board is dropped |
| The robot bounces, waves, tilts its head like a pet or lunges | pet-trick performance; no calm line | snippet F; presence from scale, stillness and attention |
| Listener's lips move, or the wrong person speaks | unmarked mouths; two faces in a lip-sync shot | at-rest mouth for every non-speaker; one speaking face per generation |
| Invented "uhm", laugh or extra words | short line in a long shot; unclaimed audio | snippet C silence locks; edit window ≥ take + 1.5 s (5b.6); script the silence |
| Words right, mouth ignores the track | audio not bound to a person | bind @AudioN to the named speaker and ask to reuse its speech |
| Mouth drifts late on the last word, or it is cut off | shot too short; head motion | +1 s tail; no nod or turn words; locked or slow push |
| Subtext spoken aloud | quoted thought or "a look that says" in the prompt | write the visible behaviour only |
| Glowing or burning eyes | emotion written as an eye effect | gaze target plus "normal human eyes" |
| Tears from nowhere | crying asked for directly | build: breath → moisture → blink → one late tear, or "wet, never spilling" |
| Face and voice disagree | v4 tag without a visible counterpart, or delivery words = subtext | 5b.5 bridge table; delivery = the mask |
| Voice drifts between shots | descriptor reworded; settings changed | voice lock from `01`; re-render all of that character's lines |
| Approved draft, weaker final | final-from-draft is a new 1080p generation | re-check eyes and lip closures on the final before ledger entry |
| Approved draft can no longer be finalized | Higgsfield draft older than 7 days | review takes the day they arrive; past the window, a new draft (new job ID, new ledger row) and a new G5b-C |
| Face refused on a dialogue or close-up shot | a face reference that did not pass T1 | use only the character's T1 route (`03` §3.3); change the route, never the face or the wording; log the refusal text and job ID |
| Content block or rejected take | age words, substance or violence business | age-blind profile; G-safe business; change content, never trick wording |

## Sources and credits

Quoted or adapted with credit (licence files checked in fresh clones, 2026-10-30):
- **OSideMedia/higgsfield-ai-prompt-skill, MIT** (HEAD 6a6a5dd, 2026-10-24): `skills/higgsfield-acting` v1.3.0 (core axiom, five pillars, event from the ending, scene direction and motive, body, business and the interrupted action, proxemics, status, master profile, eye life, voice lock, states not transitions, ensemble, bad-acting atlas, performance scale); `skills/higgsfield-facs` v1.1.2 (AU table, recipes, three-phase lines, physical micro-beats, stagger, listeners in bokeh); `skills/higgsfield-seedance/HELL-GRIND.md` (dialogue construction, micro-life, phased blink, seam tricks, crowd as one asset, iteration loop); `skills/higgsfield-audio` (lip-sync rules and word budgets, marked EMPIRICAL-2.0 there); `skills/higgsfield-seedance-2-5` (split by job, reference roles). Its core acting text adapts Higgsfield's open-sourced "Hell Grind" brief.
- **calesthio/generative-media-skills, performance-direction, MIT** (2026-07-14): playable beats, 0-5 intensity, one or two beat turns per clip, voice-before-face order, sound-on/off/audio-only QA, viseme checks, handoff fields.
- **kangarooking/director-skills, emotion-performance-director, MIT** (2026-10-20): before/during/after structure, prune rule, no camera look by default, late tears, stillness as a choice.
- **zhouwei713/facial-expression-prompting, MIT:** channel stagger order; pressure/amplitude/self-control axes.
- **liyue-aigc/seedance-2-5-video-director, MIT** (realistic-direction-patterns.md): reaction chain; build-up before tears and laughter; contradiction audit ("natural acting versus muscle-by-muscle expression checklists").
- **scenario-labs/skills, scenario-seedance, MIT** (2026-10-30): bind every voice track to a person; conditioning rule for first frames.

**Method learned from public Higgsfield projects** (studied 2026-11-02 through the Higgsfield MCP project tools; study files `prompt-library/studies/2026-11-02_<key>.md`, merged in `2026-11-02_CROSS-STUDY.md` §3B.9–3B.10, §3D Cards 3–5 and 7, §4.5; proposals P05b-1 to P05b-6 in `prompt-library/LESSONS.md`). Method only: no character, face, design, line, set piece or story is copied; quotes are short and attributed.
- **LEAK, by `@creativemanifesto`:** micro-beats ① ② ③ (at most three per shot), the BLINKING and NO sighing lines, "emotion in the body and stillness, not the face", state as body mechanics, the line shape (delivery → quote → spoken to → after-line behaviour), one line per close-up and the 5-word median, the intelligibility switch, the behaviour board (pilot test T-A1), hard beats as single takes; technique card L.
- **TOKYO 4:17, by `@nicholastakeyama`:** faces never re-described in performance text, the delivery note under each line, "do not demand a smile", ending on the pause, language following the faces, no principal faces among extras, staggered independent background activity, extras-only inserts; technique card TK.
- **In Passing, by `@julianmarshall`:** the crowd laws (count, palette, a task per person, the gaze law with named exceptions, the shared physical cause, foreground crossers, every face alive, running-take bookends, voices as texture, featured-extra vignettes, the hero's tempo against the flow); technique card IP.
- **Kimti, by `@ameerahmed`:** one physical tell plus a restraint clause; the tear pair and the note that both the positive and the negative are needed; lip-sync designed out of scenes.
- **Buzkashi, by `@sqr_studio`:** the EMOTION LAW banning both extremes (over-play and a blank face).
- **SÉKOU, by `@mauriziocibelli`:** "heard, not lip-read" for off-screen lines, the voice-over "mouth does not move on it" form, "his only performance is where he looks".
- **THREAD, by `@pandaproduction`:** off-screen lines placed "BEHIND THE CAMERA", the silent-shot lock, "the descriptive sentences of this prompt are NOT dialogue" (with 05).
- **The Breach, by `@sileent`:** off-screen performance written by intention per line, with breaths placed inside the lines.
- **CONTROL, by `@pietromalegori`:** clones prevented by layout ("If no face is legible, no face can be repeated"); "PERFORMANCE LOCK — NOBODY ACTS".
- **Fukushima, by `@aist`:** every extra has a task; nobody looks at the lead.
- **HUNGER, by `@sssacccade`:** the non-human performs small (no pet behaviour, no cuteness, no roar; presence from scale and stillness; it follows the human's decisions).

Paraphrased only (no licence, or official docs without a stated licence):
- BytePlus sd25-pe 0.1.1 (official Seedance 2.5 prompt optimizer; archive re-read 2026-10-30), the BytePlus Seedance 2.5 prompt guide and the Seedance 2.5 model page (ai.byteplus.com docs, fetched 2026-10-30): reference-audio default (voice only unless the prompt asks to reuse its dialogue), per-speaker language, closed mouths for listeners, a few clear observable cues, trigger before reaction, emotion-shift structure, neutral wording, no eye-effect emotions, audio input limits, 4-30 s output, 480p drafts.
- milenaaraya536-cell/direct-ai-actor-performance (no licence file): inspiration for the private sentence and emotion mechanics.

Official and vendor facts checked 2026-10-30: ElevenLabs `eleven_v4` model guide via the ElevenLabs connector (tags, no style/speed/SSML, stage directions not performed); ElevenLabs Forced Alignment docs (`POST /v1/forced-alignment`, multipart `file` + `text`; Speech to Text rate; 29 languages, no Urdu). Higgsfield, read 2026-11-01: `models_explore get seedance_2_5` (modes `t2v`, `omni_reference`, `video_edit`, `video_extension`; 4-30 s whole seconds; `generate_audio`; `bitrate_mode`; `draft` 480p finalized at 1080p with `draft_job_id` within seven days; media roles `start_image`, `end_image`, `image_references`, `video_references`, `audio_references`) and the tool descriptions of `generate_video`, `manage_reference_elements` (supported video models name `seedance_2_0`, not `seedance_2_5`), `list_project_assets` and `get_project_asset_prompt`. Third-party and unverified: Magnific's note that Seedance re-synthesises rather than pastes reference audio; all lip-sync word budgets (Seedance 2.0 community data); FACS-code reading by Seedance 2.5.

Carried over from the user's old skills: "micro-expressions as physics" and the age-blind rule (seedance-director); numbered micro-beats per emotion, metres-based spatial blocking, populated backgrounds, and the ideas behind the EMOTION_GENERIC and EYE_LINE_BREAK failure codes, now rows of the failure table and the eyeline rule in 5b.7 (cinematic-pipeline SHOTLIST_RULES); the official emotional-direction structure and per-reference binding (seedance-2-5-prompts). Dropped as outdated: the 25-30-words-per-15 s dialogue budget and bilingual JSON output (seedance-director, Seedance 2.0 era).
