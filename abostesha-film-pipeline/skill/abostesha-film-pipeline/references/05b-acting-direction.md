# 05b — Acting Direction: Feel the Script, Direct the AI Actors (Step 5 companion)

Purpose: read every locked scene the way an actor and director would, and give each character a performance bible that keeps them the same person across 30-60 Seedance shots.
Then turn every beat into what a camera can see and a microphone can hear (physical action, micro-expression, eyeline, breath) so that the face plays the same action as the ElevenLabs take.
Talk to AboStesha in Arabic. Write every bible entry, beat map and prompt snippet in English. This module owns the PERFORMANCE and DIALOGUE blocks; `05-seedance-production.md` owns the assembled prompt, handle spelling, the Higgsfield `generate_video` params, music/subtitle suppression wording and the draft/final runs.
Route (decision 2026-11-01): every take is `seedance_2_5` in Higgsfield, run by Claude through the Higgsfield MCP or by the user in the Higgsfield web app inside the same project (Claude reads those jobs back with `list_project_assets` and `get_project_asset_prompt` and logs them). The BytePlus API route exists but is not used; BytePlus pages are cited below only as ByteDance's documentation of the model and its prompt guide.

Provenance tags used below: `[OFFICIAL]` ByteDance's Seedance 2.5 docs (published on BytePlus), the Higgsfield model catalog (`models_explore`) or ElevenLabs docs; `[FIELD]` a practitioner skill's tested rule; `[EMPIRICAL-2.0]` measured on Seedance 2.0 only; `[HOUSE]` our default, untested; `[UNVERIFIED]` confirm before relying on it.

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

If T2 has not run, write dialogue shots as `[UNVERIFIED ROUTE]` and do not spend on dialogue finals.

## Ground rules

1. **Acting is behaviour under pressure, not a display of emotion.** "A character wants something, something is in the way, and they act to get it. Emotion is a byproduct of that struggle — never the thing you write directly." (OSideMedia higgsfield-acting, MIT.)
2. **Never name the emotion in beat prose.** Write the trigger and the body. The hidden feeling (the subtext) is never written anywhere in a prompt, not even in quotes: "a look that says 'you too?'" comes back *spoken* (OSideMedia, MIT). Emotion words appear in only two places: the one direction sentence of snippet B, and the 2-3 delivery words of snippet C (the mask, matching the v4 tag). Both name the visible surface in neutral words ("amazed", never "fanatical" or "extremely shocked"; intense wording raises the risk of glowing eyes) `[OFFICIAL]`.
3. **Voice first.** The face is directed against the locked ElevenLabs take, never the other way round. If a take changes, the beat map and the dialogue shot are redone.
4. **One job per generation.** Physics and action go in one generation; eyes, breath and micro-performance in another. "The fight gets softer, the faces get flatter" when one prompt carries both (OSideMedia 2.5 notes, MIT). Dialogue and action are split the same way.
5. **States, not transitions.** Describe the character already *in* the state ("mid-reach, hand on the door handle"), not the process of getting there. Describe stillness as held tension; "nobody moves" freezes the frame.
6. **Age-blind and G-rated.** No age words in any performance text (the content filter tightens on them). No drinking, smoking, chewing tobacco, pills, self-harm gestures, or hitting a person in the business you give a character; rage plays as held or redirected force (a slammed palm on a table, never a blow). When the user's script keeps a flagged beat, the G-safe form comes from `01` §1.1.9; you direct only that form.
7. **The user is the director.** You draft; they approve or rewrite every bible and scene read. Log their changes in the authorship log of `01` (origin `H`/`C`), because the disclosure and any authorship question will ask who shaped the performances.

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
- **2-4 cues per emotional transition.** The official guide asks for a small number of the clearest cues from eyes, brows, mouth, breath, gaze, hands and posture, never every possible micro-expression `[OFFICIAL]`; the count 2-4 is kangarooking's (MIT). Then apply the prune rule: "If the emotion still reads after deleting an action, prefer deleting it." (kangarooking emotion-performance-director, MIT.)
- **At most two beat turns per generation**; split the shot if the scene needs more (calesthio, MIT). One visible micro-event every 1-2 s keeps a static face alive; the phased blink is the cheapest one: "one lazy blink → a quick DOUBLE-BLINK → one HARD reset-blink" (OSideMedia HELL-GRIND, MIT).
- **The tighter the shot, the less movement:** in a close-up only the eyes, breath and one facial action move.
- **Tears:** default is "eyes wet with catchlight — but never spilling" (OSideMedia, MIT). A scripted tear comes late, after the line, built by breath change → moisture → blink change → one tear.
- **Two truths at once** for hero shots: the mouth plays the tactic while the eyes or chin leak the cost (forced smile AU12 without AU6, chin tremor AU17).

### 5b.4 FACS vocabulary (bible and QA; plain words in prompts)

FACS action-unit codes are standard (Ekman & Friesen). Seedance's reading of codes in a prompt is `[EMPIRICAL-2.0]`, untested on 2.5, and the official 2.5 guidance warns against piling up micro-expressions. So prompts use the plain phrase; codes live in the bible, the beat map and QA notes. If the user wants to try codes, A/B one close-up (phrase only vs phrase + code) on a draft and log the result.

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
- Line length: English reliable sync about 16-20 words per ~15 s at 5-10 words per line; count "one short sentence ≈ one breath". T2 measures Arabic and English only; Hindi and Urdu stay unmeasured until their first drafts, so keep those lines to one breath.
- `ON-WIDE` lines (mouth small) get the same binding but no close-up rules; `OFF` lines keep the speaker's mouth hidden (back, shadow, frame edge) and bind the audio only as voice; `VO` and `PHONE` lines bind no face and give the listener the shot (snippet D). Noah's lines are `VO` or a faceless head; no lip-sync.
- **One file per voice.** 04's `_DLG_` mixes every line of a shot into one track. When a shot carries two voices (the mother on PHONE, then Miraj ON), ask 05 to send each voice as its own file, placed and padded to the same G, so each `@Audio` binds to exactly one person. On Higgsfield each file is its own `audio_references` entry in `medias`, listed in handle order; the tool does not document whether `@Audio1`, `@Audio2` follow that order `[UNVERIFIED]`, so the first two-voice draft is checked for the right voice on the right person before any other is planned.

**Edit window and upload copy** `[HOUSE]` (04 owns the length; 05b sets the performance minimums):
- For every ON line the edit window must hold at least 0.5 s of closed-mouth pre-line, the whole take, and 1.0 s of held reaction after the last word. 04 turns that window into G with its handles (`G = max(4, ceil((L + 24) / 24))`, house cap 15 s although `seedance_2_5` on Higgsfield allows 4-30 s in whole seconds). If 04's markers leave less, ask 04 to move the marker or raise G; never trim the take. A clipped last word is the most common failure.
- BLOCK shots get their padded track from 04 (`_DLG_`, §4.5 step 4). A STILL shot with a line has none, so build the same file: `ffmpeg -i SLA_S11-SH05_S11-L06_MIRAJ_T02.wav -af "adelay=delays=1000:all=1,apad=whole_dur=6" -ar 48000 -ac 1 SLA_S11-SH05_S11-L06_MIRAJ_T02_PAD.wav` (line placed at 1.0 s, total 6 s = G; tested). Every upload copy (`media_upload`) stays at least 2 s. Whether padding helps or hurts placement is untested: include it in T2.
- A short line in a long shot invites invented mumbling to fill the air (OSideMedia, field note). Script the silence: what the speaker does with closed lips before and after.

**Prompt order for a dialogue generation** (fits HELL-GRIND's construction, OSideMedia MIT: "The voice and its emotion → the line in quotes → the physical action → the facial reaction"): binding sentence → language + delivery + speaker + `{line}` → pre/during/post-line behaviour → silence locks for everyone else. Use snippet C.

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

- **A crowd is one asset with a range of heights and clothes**; state the headcount ("about 20") or the model gives three people in one take and a hundred in the next (OSideMedia HELL-GRIND, MIT). Only 3 characters track reliably across cuts; everyone else is described as a mass with a shared task.
- **Every background person has business, not a mood:** commuters hold straps and read palm screens, guests hold glasses of juice or water, workers carry crates. Name 2-3 tasks per crowd.
- **Reactions travel in a wave, never in sync:** stagger by 0.3-0.5 s per person or group, vary the strength, and let some not react at all (OSideMedia FACS skill, MIT).
- **Listeners in bokeh are not statues:** give soft-focus people head direction, small shoulder movement and staggered reactions.
- **Freeze at the threat:** constant small movement, and at the key moment everything stops; the contrast is punctuation.
- **Mouths:** every non-speaking face keeps its mouth naturally closed. Crowd laughter or murmur is a sound effect in `<>`, written as "a ripple of laughter, no words" (`06-music-and-sfx.md` decides whether Seedance or post makes it).
- **G check:** panic plays as turning heads and stepping back, never as screaming faces or anything frightening.

Example, Kabir's line "the drama king has arrived": eight onlookers in a loose arc 2-4 m behind Kabir; the two at the front laugh first, three more half a beat later, the two at the back do not laugh and look at Miraj. Kabir does not laugh at all; he is the still one. The most valuable frame is Miraj's face after the laugh, so it gets its own generation (snippet D).

### 5b.9 Review the draft (performance QA before final-from-draft)

Review every draft take three ways (calesthio, MIT): sound on (does the voice match the face and body energy; are beat turns visible and audible?), sound off (can you read the relationship, attention target and pressure; any frozen blinks, random nods, hand artefacts?), audio only (does the read have a listener, a tactic and an arc?).

Lip-sync checks on every ON line: mouth closes on p, b and m; lower lip meets the teeth on f and v; the first and last words open and close on time; the mouth returns to rest after the line; no invented words, laughs or murmurs (compare against SPOKEN); listeners' mouths stay closed; audio never leads the mouth by more than 1 frame and never lags by more than 2 at 24 fps (`07` §7.7; T2 in `00` uses ≤ 2 frames on a close-up). Measure it on 07's 12-frame strip at the audio onset (§7.2 E, onset from silencedetect), or by stepping frames against the waveform in Premiere. A 2 fps contact sheet is for blinks and drift only; it cannot show a 2-frame offset.

Score each take on the performance scale (OSideMedia, MIT): 0 mannequin, 1 declaimer, 2 diligent, 3 craftsman, 4 alive, 5 magnet (two truths at once). **Hero shots must reach 4.** Fix with one surgical line at a time and log it; "If a shot has not come together in 10–15 iterations, the problem is not the wording" (OSideMedia HELL-GRIND, MIT): split the shot, remove an action, change the angle. Acting and lip-sync are approved at the 480p draft, but the 1080p final (finalized from the draft with `draft_job_id`) is a new render whose detail may differ (`05`), so re-check eyes, blinks and lip closures on the final before it enters the ledger. Higgsfield can finalize a draft only within 7 days of its creation: review takes the day they arrive; a draft past the window is drafted again (new job, new ledger row, new G5b-C). `08-judge-panel.md` reuses this scale and the failure table.

**Ledger and hand-made takes.** Every draft and final is one ledger row in the same turn (05 writes it): the Higgsfield job ID (on a final, also the draft's job ID), model `seedance_2_5` as `models_explore` shows it, route `Higgsfield-MCP` or `Higgsfield-web (user)`, folder (`04_SCENES/Sxx/drafts` or `/finals`), `draft_expires_utc` = creation + 7 days, and the sha256 of the downloaded original. Takes the user runs by hand in the web app are read back with `list_project_assets` (the scene folder's `folder_id`, `output_kinds: ["video"]`) and `get_project_asset_prompt`, reviewed with the same draft review card, and logged the same way.

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
```

**4. Prompt snippets for `05-seedance-production.md`** (fill the `{{slots}}`; spell handles exactly as `05` does and never mix forms in one prompt, since the official docs show both `@Audio 1` and `@Audio1`; this skill always uses the unspaced form; `05` adds the reference roles, style prefix, camera, audio suppression and parameters).

A. PERFORMANCE block (non-dialogue shot)
```text
{{NAME}}, {{one visible marker}}, is already {{state: posture + business, mid-action}}. {{NAME}}'s eyes work on {{eye task}}:
{{target + pattern}}, blinks {{quality}}, the eyes reaching {{target}} a beat before the head turns.
When {{trigger, visible in frame}}, {{first involuntary cue}}; then {{chosen response: business/posture/distance in m}};
{{breath cue}}. Afterwards {{residual cue}} stays. Small signs of life throughout: {{1 micro-event per 1-2 s}}.
{{NAME}} does not look into the camera. {{Others in frame}} keep their mouths naturally closed.
```

B. Emotion shift (the official four-sentence structure, in our words; once per generation)
```text
Emotion moves from {{neutral surface word A}} to {{neutral surface word B}}. After {{trigger}}, {{NAME}} first
{{immediate observable reaction}}. Then {{eyes/brows/mouth/breath/gaze/hands}} gradually {{change}}.
Finally {{NAME}} shows it only through {{restrained outward behaviour}}.
```

C. DIALOGUE / LIP-SYNC block (ON line; one speaker per generation)
```text
@Audio1 is {{NAME}}'s own voice and dialogue. Reuse the speech in @Audio1 exactly as recorded, word for word and at
its own timing, with word-level lip sync: lips close fully on p, b and m, and the mouth returns to rest after the last word.
Dialogue language: {{language from 01}}. {{NAME}} says {{2-3 delivery words = the mask, matching the v4 tag}}: {{SPOKEN, identical to 01}}
Before the line, {{pre-line cue}} with lips closed. On {{stress word}}, {{one cue}}. After the line, {{0.5 s hold}}, then {{residual}}.
{{NAME}} speaks only these words; no other voice, murmur, laugh or added line. {{Listener}} keeps the mouth naturally closed and listens.
{{NAME}}'s head stays steady while speaking. ({{camera words from 04/05: locked-off MCU or slow push-in}})
```

D. LISTENER / REACTION shot (PHONE, VO, OFF lines, and the face after an event)
```text
{{NAME}} listens to {{source: the voice on the palm screen / Kabir off-screen right}}, mouth naturally closed throughout.
The reaction starts before the line ends: {{mid-line cue}}. {{Assessment: eyes to inner object, swallow / held breath}}.
Then {{chosen response}}. No speech from {{NAME}}; the only voice is {{source}} from @Audio{{N}}.
```

E. CROWD block
```text
About {{N}} {{people description}} {{spread, distance in m}}, each busy: {{task 1}}, {{task 2}}, {{task 3}}.
At {{trigger}}, the reaction travels as a wave: {{front group}} first, {{middle}} about half a second later, {{back}} not at all,
{{one or two}} looking toward {{hero}}. All mouths stay naturally closed. <{{crowd sound}}, no words>
```

F. ROBOT block
```text
{{ROBOT}} stands with its head held still; turns begin at the torso and finish exactly, with a tiny settle. Before answering
it holds completely still for a moment, then {{gesture: palm opens, servo hitch on the right step}}. Its {{sensor/light}} tracks
{{person}}, never the room. {{If VO: its voice comes from @Audio{{N}}; it has no mouth and nothing on the head panel moves with speech.}}
```

G. Surgical fixes (change one line, log it)
- "Hold eye contact through her line; look down only after the denial."
- "Remove the nod; the head stays still while he speaks."
- "Reduce the smile from 3 to 1; warmth in the cheeks, not the teeth."
- "Add 0.5 s of closed-mouth silence before the line" (04 moves the line marker 12 frames later and rebuilds `_DLG_`).
- "The listener's lips move: add 'keeps the mouth naturally closed and listens' to that person."
- "Eyes glow: replace the eye-effect words with a gaze target and 'normal human eyes'."

**5. Draft review card** (per take): shot, take, Higgsfield job ID and `draft_expires_utc`, score 0-5, sound-on / sound-off / audio-only notes, lip checks (p/b/m, f/v, first/last word, rest, invented words, listener mouths), offset in frames, continuity IN/OUT match, one-line fix, verdict.

**6. Message to the user** (Arabic, short): what was built (bibles, scene reads, beat maps), the open questions, then the gate question. Prompts stay in English code blocks.

---

## Gate (what the user must approve)

- **G5b-A, bibles (before the first dialogue draft, D7):** every recurring character's bible approved in the user's words: profile, voice lock copied from `01`, physical signature, arc checkpoints, forbidden list. Ask: «هل تعتمد ملف الأداء لـ MIRAJ كما هو، أم تريد تعديل سطر معيّن؟»
- **G5b-B, scene reads (per scene, before its shots are written):** event named from the ending, objectives and tactics, Intent cross-check resolved. Ask: «هل هذا هو الحدث الحقيقي للمشهد S11، وهذه رغبة كل شخصية؟»
- **G5b-C, takes (per shot, at the draft, before final-from-draft):** hero shots score 4+, lip checks pass, the IN/OUT row in continuity-bible §9 is filled; closed in time for 05 to finalize inside Higgsfield's 7-day draft window (house rule: before the draft is 5 days old, SKILL §6). Ask: «هل تعتمد هذه اللقطة أداءً ومزامنةً للانتقال إلى النسخة النهائية 1080p؟» Silence or a change of subject is not approval.

## Common failures

| Symptom | Cause | Fix |
|---|---|---|
| Wooden face, glassy stare | no eye task; emotion words instead of behaviour | give the eyes a job aimed at the partner, phased blink, a micro-event every 1-2 s |
| Mugging, grimaces | the face asked to show the emotion | write the objective and business; 2-4 cues; prune |
| Flat both ways | action and acting in one generation | split by job, stitch in `07` |
| Character recovers instantly after a strong event | no inertia | carry the OUT state into the next shot; residual cue after every beat |
| Same reaction from everyone at once | synchronized ensemble | wave with 0.3-0.5 s stagger; vary strength; some do not react |
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

Paraphrased only (no licence, or official docs without a stated licence):
- BytePlus sd25-pe 0.1.1 (official Seedance 2.5 prompt optimizer; archive re-read 2026-10-30), the BytePlus Seedance 2.5 prompt guide and the Seedance 2.5 model page (ai.byteplus.com docs, fetched 2026-10-30): reference-audio default (voice only unless the prompt asks to reuse its dialogue), per-speaker language, closed mouths for listeners, a few clear observable cues, trigger before reaction, emotion-shift structure, neutral wording, no eye-effect emotions, audio input limits, 4-30 s output, 480p drafts.
- milenaaraya536-cell/direct-ai-actor-performance (no licence file): inspiration for the private sentence and emotion mechanics.

Official and vendor facts checked 2026-10-30: ElevenLabs `eleven_v4` model guide via the ElevenLabs connector (tags, no style/speed/SSML, stage directions not performed); ElevenLabs Forced Alignment docs (`POST /v1/forced-alignment`, multipart `file` + `text`; Speech to Text rate; 29 languages, no Urdu). Higgsfield, read 2026-11-01: `models_explore get seedance_2_5` (modes `t2v`, `omni_reference`, `video_edit`, `video_extension`; 4-30 s whole seconds; `generate_audio`; `bitrate_mode`; `draft` 480p finalized at 1080p with `draft_job_id` within seven days; media roles `start_image`, `end_image`, `image_references`, `video_references`, `audio_references`) and the tool descriptions of `generate_video`, `manage_reference_elements` (supported video models name `seedance_2_0`, not `seedance_2_5`), `list_project_assets` and `get_project_asset_prompt`. Third-party and unverified: Magnific's note that Seedance re-synthesises rather than pastes reference audio; all lip-sync word budgets (Seedance 2.0 community data); FACS-code reading by Seedance 2.5.

Carried over from the user's old skills: "micro-expressions as physics" and the age-blind rule (seedance-director); numbered micro-beats per emotion, metres-based spatial blocking, populated backgrounds, and the ideas behind the EMOTION_GENERIC and EYE_LINE_BREAK failure codes, now rows of the failure table and the eyeline rule in 5b.7 (cinematic-pipeline SHOTLIST_RULES); the official emotional-direction structure and per-reference binding (seedance-2-5-prompts). Dropped as outdated: the 25-30-words-per-15 s dialogue budget and bilingual JSON output (seedance-director, Seedance 2.0 era).
