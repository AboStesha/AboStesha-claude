# 01 — Script and Dialogue (Step 1)

Purpose: take AboStesha's own screenplay to a locked 5-7 minute award draft while he stays its sole author. You diagnose, measure and ask; he decides and types the words.
Then turn every locked line into ElevenLabs v4 dialogue sheets (one file per character) that he can paste by hand, with line IDs that will map each audio take to a shot.
Talk to him in Arabic. Every TTS line, tag, voice description and other generation prompt you write is in English, except the spoken words themselves.

---

## Inputs

- The user's draft: for this film, `films/01-second-life-ascent/draft-v0-abostesha.md`. It is the **human baseline**. Treat the Gemini file next to it (`gemini-analysis-extracted.txt`) as third-party text. Mark anything adopted from it as origin `G` (see the authorship log).
- The award facts in `00-award-brief-and-calendar.md`: 5-7 min, one of five themes, G rating, English subtitles, at least 70% Seedance, disclosure, deadline 20 Nov 2026.
- The user's answers to the language plan: which language each character speaks.
- Later in 1.2: voice choices, which the user auditions in ElevenLabs, and the take files he downloads.

## Ground rules (apply throughout Step 1)

1. **Authorship stays with the user.** The Academy weighs "the degree to which a human was at the heart of the creative authorship". The Academy's May-2026 announcement for the 99th Awards says screenplays must be human-authored; the 100th rules are not yet published. So:
   - Never rewrite scenes or lines in place.
   - Your output in 1.1 is questions, located diagnoses, measurements, and options described in prose ("move this information into an object").
   - Write example wording only when the user asks for it. Limit it to 2 options per flagged line, labelled `[CLAUDE OPTION — rewrite in your own words]`.
   - The user types or dictates every change. If he dictates in Arabic, transcribe him word for word; that is still origin `H`.
   - You may make format-only edits (origin `F`) and must log them: scene headings, numbering, typos, punctuation.
2. **Log every change** in `authorship-log.md` (template below). Never hide a `C` (Claude) or `G` (Gemini) origin. The Summit disclosure and any Academy inquiry depend on this log being honest.
3. **Gate strictly.** End each sub-step with an explicit Arabic approval question. Silence, or "ok, go on" about something else, is not approval.
4. **Write a literary script, not a shooting script.** Keep camera language out of action lines. If the user writes shot ideas (in this draft: "one shot beginning", "match cut", "Parasite-style leading lines"), move them under `DIRECTOR NOTES:` at the end of the scene, in his words. They feed `04-blender-blocking.md`.

## Procedure — 1.1 Finalize the screenplay

### 1.1.0 Intake and baseline (one turn)
- Save the baseline untouched and record its hash: `sha256sum draft-v0-abostesha.md >> authorship-log.md`.
- Ask in Arabic, at most 4 questions, and only for what is missing: theme choice, the language plan, the ending he will not give up, and anything in the draft he considers sacred.

### 1.1.1 Premise and theme lock — the Locked Sheet
Fill the Locked Sheet (template below). Derive every field from the user's draft and mark each one `PROVISIONAL` until he confirms it or rewrites it. These field tests are adapted from gbellonre/psych-short-screenplay (MIT):
- **Logline.** Swap the protagonist for "a person". If the logline still works, it is too generic.
- **WANT** must be photographable without voice-over.
- **FORBIDDEN EXPLANATION** is the theme sentence, and no character ever says it out loud.
- **CLOCK** is real time pressure inside the film, not "soon".
- **CONTROLLING IDEA** is McKee's value + cause: "<value> wins/loses because <cause>". The **premise** is Egri's trait → conflict → outcome. Keep exactly one of each; two premises pull the film in two directions.
- **THEME (official)** is exactly one of: Society, Community & Humanitarian · Truth, Fake News & Misinformation · Humans & AI · Climate, Nature & Our Changing Planet · Human Relationships.
- **PRODUCTION BOX** for a 5-7 min AI short:
  - At most 5 named characters.
  - **At most 3 on-screen lip-sync speaking roles.** Lip-sync is the most expensive and riskiest thing Seedance does. Voice-only roles (broadcast, earpiece AI, phone) are cheap, but each must still earn its place.
  - 1-4 real locations, plus dream spaces.
- **THREADED OBJECT** (Chekhov one-act tool): one ordinary object that passes through the whole film and changes meaning.

Mini example from 2nd Life, with candidates for the user:
- THEME: Humans & AI. Noah, 2nd Life and the robots carry the world; Miraj carries the human cost.
- CLOCK: the heart surgery, "after the discount 6300", with a doctor waiting.
- THREADED OBJECT: the Halo lens case, or the wasted-food box. Ask the user which one.
- FORBIDDEN EXPLANATION: Kabir's line "turn the fire of this problem into fuel". The draft states it out loud, so the cut pass must decide whether it stays as text.

### 1.1.2 Structure check
A short film earns one idea completely. It fails when it behaves like a small feature: subplots, too many characters, a sagging middle.

Check the spine against Lu Jun's four-part short-play structure, paraphrased from jtydhr88/screenwriting-skills, sw-story-structure §6:
- **Open fast.** Near, simple, active. Cut back-story before the first conflict.
- **Develop** for about two-thirds of the film, beat climbing on beat.
- **Turn** at the climax.
- **Close briefly** with resonance.

Name which opening and which ending type the draft uses.
- **Openings:** conflict-first · set the opposing forces · build atmosphere · surprise arrival · character wants the opposite · hammer-blow demand · a device states the situation (broadcast, phone) · caught in the act.
- **Endings:** thunderclap (climax and resolution in one stroke) · unresolved question · trailing exchange · rebound · one line that lights the whole · echo of the opening · cycle with a new person · verdict.
- **Apply to 2nd Life:**
  - The v0 ending is a **cycle**: Miraj stands where Kabir stood and repeats Kabir's line to a stranger.
  - The **risk** is the **verdict**: the repeated verse becomes a moral announcement. Flag it; do not fix it.
  - A short needs at least 5-6 visible changes (Lu Jun).
- **Beat spine.** Present it as 8-12 beats in this format (psych-short-screenplay, MIT):
```text
BEAT [#] — [est. time] — [location]
[Photographable change]
VALUE TURN: [from] → [to]
IRREVERSIBLE: [what cannot be undone] | [CUT CANDIDATE]
```

### 1.1.3 Scene list and numbering (this feeds the shot list)
- **Scenes.** Number scenes `S01`, `S02`, …. A new scene starts on a change of place, change of time, or change of reality layer (REAL / DREAM / SCREEN). A dream inside the 2nd Life booth is its own scene.
- **Shots.** Shots are numbered later in `04-blender-blocking.md` as `S07-SH03`. Lines are `S07-L03`.
- **After lock, never renumber.**
  - An inserted scene gets a letter: `S07A`.
  - A cut scene stays in the list as `S07 — OMITTED`.
  - Lines follow the same rule: `S07-L03A`, or OMITTED.
  - Every downstream file (blocking, Seedance prompts, audio takes, ledger) keys on these IDs.
- **Headings.** Structural words stay in English: `INT./EXT.`, `DAY/NIGHT`, transitions. Location names may be Arabic. This rule is carried over from the old cinematic-pipeline and is still correct.
- **Feasibility flags.** Tag each scene with what AI video does badly so that `04`/`05` plan for it: `2+FACES-TALK`, `CROWD`, `CONTACT` (hands touching or fist bumps), `WATER-ENTRY`, `GLASS-BREAK`, `LEGIBLE-TEXT` (screens, "made in UAE"; plan these as post graphics), `FAST-ACTION`, `MORPH` (face changing).

### 1.1.4 Value-turn pass (every scene)
For each scene, record:
- The value at the open (±), the value at the close (±), and whether the turn comes by **action** or by **revelation**.
- **If open = close, the scene is not an event.** Its only job is information. Propose cutting it and moving the information into another scene. (McKee, via sw-scene-craft.)
- The first symptom of a dead scene is a **repeated beat**: the same tactic in new words.

Footer per scene, adapted from psych-short-screenplay (MIT):
```text
S11 — INT. MIRAJ'S ROOM - NIGHT
TURN: + (he can hide his poverty from home) → − (surgery costs 6300; he promised money he doesn't have)
BY: revelation (brother: "she is lying to you")
WITHHELD: how little Miraj really has
IRREVERSIBLE: the promise to his mother
CUT IF IT EXPLAINS: any line that restates the debt after the brother's line
```

### 1.1.5 Setup / payoff audit
Build a plant table and show it to the user. Catch every unpaid plant and every payoff that was never planted. Rows from v0:

| ID | Planted (scene) | Plant | Payoff (scene) | Status |
|---|---|---|---|---|
| P1 | 2nd Life booth wake | "every second costs money", "23 extra seconds" | "today I dream a whole night" | PAID |
| P2 | Robot greets Miraj | rocket fist bump; robot's faulty leg | fist bump with robot in the success montage | PAID (leg: UNPAID) |
| P3 | Walkway | Halo lens case and earpiece ring | "sun, lens only, train passes" repeat | ECHO, check it changes meaning |
| P4 | Background booth | someone gives a sedative to sleep | none | ORPHAN, and a G-rating fail |

### 1.1.6 Dialogue pass and AI-tell scan
Run the diagnostics on every line. Report each failure by line ID; do not rewrite.

**Diagnostics**, paraphrased from jtydhr88 sw-dialogue (McKee, Walter, Hicks, Snyder):
1. Name the action under the line as a gerund ("shielding her", "baiting him"). If you can't, the line is a cut candidate.
2. Cover the names. Can you still tell who is speaking from vocabulary and rhythm?
3. Does anyone tell another character something both already know? Exposition must be ammunition, or a secret held until the turn.
4. Is it on the nose (subtext spoken as text)? The two legitimate exceptions are "What do you want?" and "Are you OK?".
5. Is a stiff two-hander missing a third object to fight over (money, a plate, a ring)?
6. Is the same beat repeated? Three crying scenes make the third one comic.
7. Does each speech end on the word that cues the reply? In Urdu or Hindi, verb-final word order puts the verb last, so plan the key word around it.
8. Are there fillers ("you know", "listen"), exclamation marks, a third ellipsis, or acting parentheticals?
9. Does every sentence of a long speech add new information? If not, can it become action/reaction beats?
10. Do two characters agree for long? Agreement is dead air.
11. Could the scene play with no dialogue at all: a breath, a look, an object?

**Chekhov checks**, for intimate scenes (chekhov-dramaturgy):
- The deepest pain gets the fewest words, or the most unrelated ones.
- A farewell's last line is often a household request.
- The theme can be spoken by a marginal character.

**AI-tell scan.** Run it on all text, and hardest on any `C`/`G` origin text. Sources: omkarpalika/filmcraft `ai-screenwriting-tells.md` (MIT) and psych-short-screenplay `dialogue-bans.md` (MIT). As filmcraft puts it: "AI writes the *idea* of a scene, not a scene."
- Characters announce their feelings or name the theme. One voice for the whole cast.
- Dialogue as information delivery ("As you know…").
- A summarizing button line at the end of a scene.
- "It's not about X. It's about Y."
- Therapy-speak.
- Speeches longer than 3 sentences, where lines under 8 words would do.
- Frictionless resolution.
- Unfilmable action lines ("he realizes", "the room feels tense").
- Generic geography.
- The "and then" plot instead of "therefore / but".

**Punch-up method** (psych-short-screenplay, MIT): "1. Quote the offending line. 2. State what it is doing (label / recap / button / lore dump). 3. Replace with a physical task, a wrong answer, a delayed answer, or a double meaning. 4. If the line is still load-bearing, move the information into an object or a refusal." In this pipeline step 3 is the user's. You name which of the four replacement types fits; he writes the replacement.

**Applying it to 2nd Life:**
- **Kabir's advice speech** is a sermon that names the theme. Note it as Major, with options:
  - (a) keep only the verse;
  - (b) let the mockery ("the drama king") carry it and cut the explanation;
  - (c) keep it whole because the final cycle scene re-earns it.
- **Noah's 2nd Life speech** is a feature list. As an in-world keynote, list form is legitimate, but each item must add new information. Ask which one item the film cannot lose.

### 1.1.7 Timing by language (page ≈ minute does not apply here)
- **Why the rule fails.** "One page ≈ one minute" holds only for US-Letter Courier-12 English spec format (sw-format-adaptation). It fails for Arabic or Urdu script, for mixed-language pages, and for visual-first AI scripts, where one action line ("Dubai skyline at dawn") can be 3 s or 30 s.
- **Formula.** Estimate each scene as **dialogue time + action time + held silences**:
  - **Dialogue:** word count ÷ planning rate. Replace the planning rate with the measured rate (selected-take seconds) as soon as takes exist.
  - **Action:** list the action beats and give each a duration (typical AI-film shot 2-6 s; establishing 4-8 s).
  - **Silences:** count every scripted pause and reaction.

| Language / register | Planning rate (calibrate!) | Basis |
|---|---|---|
| English, conversational drama | 2.3-2.7 words/s (~140-160 wpm). Weighted or emotional: 1.8-2.2 | Common industry planning figure, not measured for this film |
| MSA, formal (Noah) | ~1.5-1.9 words/s (~90-115 wpm) | ~4.5 syllables/s judged "normal" for synthetic MSA (Aldholmi et al., Interspeech 2021) × an assumed 2.5-3 syllables per written word. Estimate only |
| Gulf / colloquial Arabic | Faster than MSA. Measure it | No reliable published figure found: unverified |
| Hindi / Urdu, conversational | ~2.0-2.6 words/s (~120-155 wpm) | Unverified estimate. Postpositions written as separate words inflate the count. Measure it |

- **Calibration.** Measure with the user reading aloud at performance pace (stopwatch, in Arabic, ask him), or from the first v4 test take of each voice. Write the measured rate into that character's voice card and re-time the whole script with it.
- **Example (v0 word counts).** Noah's broadcast speeches total about 235 words of MSA, roughly 2.0-2.6 min at the planning rate. That is a third of the film for one voice-only character before a single image. Show the user this number; it drives the cut pass.
- **Runtime targets.**
  - Award window: 5:00-7:00, excluding opening titles and closing credits.
  - Lock the script at an estimated **6:00-6:30** of film body.
  - Never lock under 5:30 or over 6:45.
  - Budget titles plus credits so the whole file, credits included, stays at or under 7:00, as the brief says to keep it.

### 1.1.8 Cut pass
- **Order.** Cut structurally first, then line by line:
  1. Scenes with no value turn.
  2. Repeated beats. Example: the dream-rage montage has 6 items using one tactic (destroy). Ask the user for the 1-2 strongest, and remove any G-fail items first.
  3. Characters outside the production box.
  4. Duplicate exposition.
  5. Line trims.
- **Cut ratio.** psych-short-screenplay's 70-85% cut assumes a draft already near length. v0 estimates at about 13 min (roughly 30+ events plus about 235 words of Noah), so the structural cut has to keep roughly 45-50%.
- **Rule:** cuts add no new plot (psych-short-screenplay). Print before/after runtime and a line count per character.
- **Who decides.** You propose the cut list with seconds saved per item. The user marks each one KEEP / CUT / MERGE.

### 1.1.9 Compliance pass
Run all four checks. Every flag is a decision for the user, with options; none is a silent edit.

**A — G rating / suitable for all ages** (Terms cl. 5.3(f), 9.1). "It's only a dream" is not an exemption. Flags from v0:
- Suicide jump in the dream, and "I want to disappear forever / no right to end this nightmare". Self-harm and suicidal ideation: Critical.
- Sedative or drug doses at the booth. Khaini tobacco chewed and spat. Desi daru (liquor) drunk from the bottle. Substance use: Critical.
- Brutal beating of Kabir in a ring. Flipping the table on his mother. Violence: Critical / Major.
- Nuclear blast, everyone screaming, a face morphing into something scary. Intense fright: Major.
- Noah: "except dreaming of murder or sex outside marriage". Sexual reference: Critical, and also a cut candidate.
- "A fat black man's armpit". A demeaning ethnic or body descriptor: Critical, and a responsible-AI risk.

**B — Summit rules.**
- Real people, brands or celebrities must not imply endorsement.
  - "Psychology of Money — Morgan Housel" is a real book and author: clear it or make it fictional.
  - "Halo" collides with a well-known game trademark: run a trademark check.
  - "10 billion summit" parodies the Organizer's own event: ask the user whether this is intended.
- One complete original story, made for this award.
- Every voice will be declared synthetic. Cloning a real person's voice needs documented consent (cl. 7.5).
- Dialogue minutes are non-Seedance audio, and the Organizer has not published how the 70% is measured. Keep dialogue lean and see `00-award-brief-and-calendar.md`.

**C — Oscar human authorship.** The authorship log is current. No `C`-origin dialogue is in the locked script. Every `G` and `T` (translation) line is listed.

**D — Culture.**
- Scripture is quoted verbatim and with correct grammar. v0 has Kabir say "حتى يغيروا ما بأنفسك" where the verse reads "ما بأنفسهم". The epilogue has it right. Flag the mismatch and ask the user.
- Noah, a robot, quotes "ولقد كرمنا بني آدم". Ask for a cultural read.
- Burning banknotes on screen in a UAE film: unverified legal or cultural sensitivity. Ask for a local read.
- Ask the user to name a native Hindi/Urdu reviewer for every translated line.

### 1.1.10 Coverage notes and lock
- **Format.** Deliver coverage in the format below. Its notes discipline comes from filmcraft (MIT) and script-doctor:
  - Lead with strengths so they survive.
  - Each note is located (scene or line ID), names what breaks and why, gives the note behind the note, and offers options. It never rewrites.
  - Work big to small: structure → scene → line.
  - Critical notes block the lock.
- **Scoring.** Tie each note to a Summit score: Storytelling 30, AI Integration 30, Creativity & Aesthetic 20, Technical Execution 20. Script-level Technical means feasibility flags. Responsible AI is pass/fail. `08-judge-panel.md` reuses this format on the finished film, so Step 1 already writes against the scoring.
- **Revision loop.** The user revises: v1, v2, …. Re-run 1.1.4-1.1.9 only on the scenes that changed, then re-time.
- **Lock.** On lock:
  - Freeze the scene and line IDs.
  - Hash the locked file (`sha256sum`).
  - Add a row to the log.

## Procedure — 1.2 ElevenLabs v4 dialogue sheets

**Start-of-step refresh.** If the ElevenLabs connector is attached, call `creative_get_model_guide(model_id="eleven_v4")`. It is read-only and keeps the tag list current. You may also call `creative_list_voices` to shortlist candidate voice IDs. Do **not** call `creative_generate_speech` or `creative_design_voice` unless the user explicitly asks you to. They spend credits, and his locked decision is to generate by hand.

### 1.2.1 Verified v4 facts (2026-10-30)
- **Model and settings.**
  - Model id `eleven_v4`; `eleven_v4_turbo` is real-time only and not for film.
  - Up to 10,000 characters per request. 90+ languages, including Arabic, Hindi, Urdu and English.
  - Settings are only **Stability** and **Similarity**, plus **Clone Strength** for v4-tuned PVCs; start that at 0.
  - **No Style, no Speed, no SSML `<break>`.** Pace with tags and punctuation.
- **API names**, if the user or `07` ever uses the API:
  - TTS uses `voice_settings.similarity_boost`, and its `model_id` defaults to `eleven_multilingual_v2`. Text to Dialogue uses `settings.similarity`, and its `model_id` defaults to `eleven_v3`. **So always set `model_id: "eleven_v4"` explicitly.**
  - Text to Dialogue allows at most 10 voices and at most 2,000 characters in total per request.
  - `seed` takes 0-4294967295, best effort only.
  - `language_code` is ISO 639-1: `ar`, `hi`, `ur`, `en`.
  - Both endpoints offer `wav_48000` and `pcm_48000`.
- **Accent.** Same-language generation keeps the reference voice's accent. Cross-language generation deliberately gives a fluent target-language accent. **So cast a voice whose own recordings are in the same language and accent as the line.**
- **Voice types.** Voice Design voices work on v4 but "may not be as performative". IVC is "more accurate than ever", and PVC is fully supported. Prefer Voice Library or consented clone voices for lead roles, and Voice Design for non-human roles such as Noah.

### 1.2.2 Language and casting plan
- **Language.** Confirm the language per character with the user. For 2nd Life, the Gemini file proposed MSA for Noah, Urdu for the mother and a "workers' street register" for Miraj; that is origin `G` until the user decides.
- **Script.** Write Hindi lines in Devanagari, Urdu lines in Urdu script, Arabic lines in Arabic. Give the user a romanized line and an Arabic gloss under each so he can approve meaning.
- **Code-switching** ("habibi", "yalla" inside Hindi): audition it, because v4 accent handling across languages varies.
- **Mode.** Assign each line a MODE. It tells `05-seedance-production.md` what the picture must do.
  - `ON`: mouth visible, lip-sync required.
  - `ON-WIDE`: mouth small or far, approximate sync acceptable.
  - `OFF`: speaker in the scene but mouth hidden (back, shadow, out of frame).
  - `VO`: speaker not in the scene (Noah's broadcast audio, Halo in the earpiece).
  - `PHONE`: remote voice through a device.
- **Design for few lip-sync lines.** Move every line you can to OFF, VO or PHONE. A robot without a mouth, or with a light-bar mouth, removes Noah's lip-sync entirely; suggest it to the user and to `03-assets-images.md`.

### 1.2.3 Voice card per character
Make one file per character: `films/<slug>/01-dialogue/<CHAR>.md`. Character names are ALL CAPS, ASCII, and spelled one way everywhere (MIRAJ, not Meraj or Miraaj).

**Voice Design description** (English). Use this structure, from the ElevenLabs Voice Design guide:
- "Native <Language, regional variety>. <Gender>, <age range>. <Quality: studio-quality recording>." Then one persona and emotion line, then 1-2 sentences on timbre, pacing and delivery.
- Use "thick" rather than "strong" for accent prominence.
- Never use FX words (reverb, echo, phone, tape), "foreign" or "exotic", or "accent" when you mean intonation.
- Preview text: 100-1,000 characters, in the character's language, and consistent with the description. Longer previews are more stable.
- Each UI generation returns 3 options. Raise guidance when accent accuracy matters. The API takes model `eleven_ttv_v3` or `eleven_multilingual_ttv_v2`.

**Voice lock.** After the audition, freeze voice_id, model, settings, the descriptor and the allowed tags. Paste the descriptor verbatim forever and never "improve" it: swapping "warm" for "rich" moves the voice (OSideMedia, MIT). Changing any locked field means re-rendering every line of that character.

**Settings, starting points** from the official elevenlabs/skills presets; audition before locking:

| Role type | Stability | Similarity |
|---|---|---|
| Drama, emotional leads (Miraj, mother) | 0.30-0.35 | 0.80 |
| Conversational supporting (Rayan, Kabir) | 0.40 | 0.75 |
| Controlled, uncanny-even (Noah) | 0.65-0.75 | 0.60 |
| Narration or promo (Halo assistant) | 0.50-0.70 | 0.50-0.75 |

Lower stability gives more range and more variance. Lower similarity if you hear artifacts.

### 1.2.4 Line breakdown and IDs
- **IDs.** Every spoken unit from the locked script gets a line ID, `S07-L03`.
  - Split a speech into separate lines wherever it may cross a cut, change MODE, or exceed one breath.
  - A text revision after audio exists bumps the line to `S07-L03v2`. Never reuse an ID for different words.
- **Intent column.** Give every line an `Intent (gerund)`: the action from diagnostic 1 in 1.1.6. `05b-acting-direction.md` builds the face and body performance from it, so the voice and the face play the same action.
- **Three text versions per line.** Keep them in sync:
  1. **TTS TEXT**: what the user pastes, with tags and pacing punctuation.
  2. **SPOKEN**: the same words with no tags. It goes into Seedance's `{ }` dialogue block (`05`) and into transcripts.
  3. **EN SUB**: the English subtitle.

### 1.2.5 Tagging rules (v4)
- **Default to zero tags.** Punctuation does most of the work.
- **House maximum: 2 tags per line.** At most one emotion/delivery/voice-quality tag plus one non-verbal or pause. ElevenLabs allows stacking, but more tags give more variance between takes.
- **Placement.**
  - Put a tag immediately before the words it colors, or put a non-verbal right after its clause: `This is hard. [sighs]`.
  - A tag holds until the next tag, so add a new tag only where the delivery changes.
  - In Arabic or Urdu lines the tag must be the **first characters of the string in logical order**. RTL editors can visually reorder brackets, so paste each line from its own code block.
  - Tags stay in English inside non-English lines. This is a house rule; audition the first takes.
- **Current tag palette**, from ElevenLabs' own guide. Tags are free-form; these are proven:
  - Emotion: `[excited] [happy] [sad] [angry] [nervous] [curious] [sarcastic] [surprised] [tired] [warmly]`
  - Delivery: `[whispers] [shouting] [softly] [dramatically] [mischievously] [cautiously] [slowly]`
  - Voice quality: `[deep voice] [high voice] [raspy] [breathless] [trembling voice] [elderly voice]`
  - Non-verbal: `[laughs] [laughs harder] [chuckles] [giggles] [sighs] [exhales] [gasps] [clears throat] [crying] [snorts]`
  - Pauses: `[short pause] [pause] [long pause]`
  - Timing: `[interrupting] [jumping in] [overlapping]`. Use these only for VO/OFF exchanges; ON lines are single-speaker files.
  - Multi-word descriptive tags work on v4: `[low, gravelly voice]`, `[under his breath]`. Phrase them as voice qualities, because v4 can misread an ambiguous tag as a sound effect.
- **Never in a dialogue stem:**
  - SFX tags (`[gunshot] [explosion] [applause] [clapping] [swallows] [gulps]`). SFX belong to Seedance and `06-music-and-sfx.md`.
  - Stage directions (`[grinning] [pacing] [standing]`). They are not performed.
  - Music or `[singing]`.
  - Hyphenated tags.
  - Prose outside brackets ("she said angrily"), which gets spoken aloud.
  - `[strong X accent]`. It is experimental, so audition it in a draft and never put it in a locked line unless it is proven.
- **Fit the tag to the voice.** No `[shouting]` on a soft voice. List each character's allowed and forbidden tags on the voice card.
- **Play the action, not the feeling.** Tag the mask the character is wearing, not the subtext. The mother lying "everything is fine" gets `[warmly]`, not `[sad]`; a tired, low-stability voice lets the crack leak through.
- **Pacing.**
  - Comma or period: natural pause.
  - Ellipsis `…`: a longer, weighted pause. Use at most two per line.
  - Em-dash `—`: a short beat or a cut-off.
  - CAPS: emphasis on one word, rarely.
  - `[pause]` tags: deliberate holds.
- **Pronunciation.**
  - Replace a misread word with IPA between slashes, e.g. `/miʕˈraːdʒ/`. Confirm with the user how he says each name.
  - In Arabic, add tashkeel only to words that misread. Whether this helps is untested on v4, so audition it.
  - Keep numbers exactly as the user wrote them. If a take misreads one, the user rewrites it in words: for example the Indian "sixty-three hundred" versus "six thousand three hundred" is his choice.
- **Keep stems dry.** No `audio_effects` (phone filter, reverb, distance) at generation. Phone, earpiece and broadcast colour are added in `07-edit-mix-finish.md`, where they stay adjustable.

### 1.2.6 Lip-sync-safe lines and timing preflight
- **ON lines** come from OSideMedia higgsfield-audio lip-sync rules, MIT, where they are marked EMPIRICAL and Seedance-2.0-derived. `05` re-tests them on 2.5.
  - One breath-sized sentence per line.
  - English about 5-10 words, or the same breath length in other languages.
  - The clip is 3-8 s, one speaker per file.
  - Leave room for at least 0.5-1 s of held reaction after the line, because a clipped last word is the most common failure.
- **Seedance audio-reference limits**, from the owned seedance-2-5-prompts skill (ByteDance spec): up to 10 clips and at most 30 s combined per generation. A Dreamina-guide snapshot adds 2-30 s per clip and WAV/MP3. This is not yet verified on the BytePlus API; `05-seedance-production.md` confirms it.
- **Preflight.** Once takes exist, compare the measured selected-take duration with the shot budget and label the line:
  - `FITS`;
  - `REBALANCE`: split across shots, or move to OFF/VO;
  - `IMPOSSIBLE`: needs a script change by the user.
- **Never silently speed up, time-stretch, truncate or overlap a line to make it fit.** This rule follows badgids' DIALOGUE_TIMING_PREFLIGHT idea.
- **Two people talking in one ON shot is unsolved.** Plan a separate speaker shot per line, or a reverse over the listener.

### 1.2.7 English subtitle per line
Rules from the Netflix English Timed Text Style Guide:
- At most 42 characters per line and 2 lines.
- Reading speed: target **at most 17 cps**, because the film must suit all ages (Netflix's children's limit), with a hard ceiling of 20 cps (adult).
- Each event lasts at least 20 frames.
- Use the single-character ellipsis `…`.
- Two speakers in one event: a leading hyphen, one speaker per line.
- *Italics* only when the speaker is not in the scene (Halo, Noah's broadcast, a phone voice).
- Numbers 0-10 are written as words; above 10 as numerals ("6,300").

**Budget per line:** max characters = measured seconds × 17. When a translation overflows, condense the subtitle, never the performance. Subtitle text is a translation (origin `T`); a native speaker reviews it. `07` builds the SRT from these cells.

### 1.2.8 Takes: generation, naming, selection
- **Takes per line.** Ask for at least 3 per line, per calesthio dialogue-editing-adr (MIT): a faithful-timing take, a performance-priority take and a cleaner-diction take. v4 tag following is "not perfect yet", so variants matter. Record the seed if the UI shows it.
- **Format.** Download the highest WAV/PCM the plan offers, 48 kHz preferred, mono, dry.
- **Folder:** `films/<slug>/audio/dialogue/<CHAR>/`.
- **File names:**
  - Raw take: `<FILM>_<LINEID>_<CHAR>_T<NN>.wav`, e.g. `SLA_S07-L03_MOTHER_T02.wav`. Use the film code the user approves; SLA is a suggestion.
  - After shot lock, the per-shot upload copy: `<FILM>_<SHOTID>_<LINEID>_<CHAR>_T<NN>.wav`, e.g. `SLA_S07-SH04_S07-L03_MOTHER_T02.wav`.
  - Never rename the raw take; copy it.
- **Measure.** Use `python3 -I -c "import wave,sys;w=wave.open(sys.argv[1]);print(round(w.getnframes()/w.getframerate(),2))" <file.wav>`. Write the seconds of the selected take into the sheet and re-run the preflight.
- **Disclosure.** Log model, voice_id, settings and the date in the take log for the AI disclosure (prompts and history may be requested within 7 days and must be kept for 24 months).

---

## Output templates (what you show the user)

### Locked Sheet
```text
TITLE: 2nd Life: Ascent — الحياة الثانية: معراج          DRAFT: vNN   DATE:
OFFICIAL THEME: [one of five]                             RUNTIME TARGET: 6:00-6:30 body
LOGLINE: [protagonist] must [concrete action] before [clock] or [cost], but [personal hook].
PREMISE (Egri): [trait] → [conflict] → [outcome]
CONTROLLING IDEA (McKee): [value] [wins/loses] because [cause]
WANT (photographable): ·  NEED (he would deny it): ·  FALSE BELIEF:
OPPOSING FORCE WANT (already in motion):
DRAMATIC QUESTION (yes/no):
FORBIDDEN EXPLANATION (never spoken):
OPENING IMAGE: ·  FINAL IMAGE (photographable, not a title card):
CLOCK: ·  THREADED OBJECT:
PRODUCTION BOX: named chars ≤5 | ON lip-sync roles ≤3 | voice-only roles: | locations:
LANGUAGE PLAN: [CHAR → language/variety/script] · subtitles: EN
STATUS PER FIELD: CONFIRMED (user) / PROVISIONAL
```

### Scene list (feeds `04-blender-blocking.md` and `ledger-continuity-physics.md`)
```text
| S## | HEADING                         | LAYER | VALUE open→close | BY     | EST s | SPEAKERS (MODE)        | LINE IDs     | LANG   | FLAGS            |
| S01 | EXT. POOL TERRACE - DAY         | DREAM | + → −            | action | 35    | MIRAJ(ON) CROWD        | S01-L01..L02 | ?      | CROWD WATER-ENTRY MORPH |
| S11 | INT. MIRAJ'S ROOM - NIGHT       | REAL  | + → −            | reveal | 60    | MIRAJ(ON) BROTHER(PHONE) MOTHER(PHONE) | S11-L01..L09 | ur/hi | LEGIBLE-TEXT |
TOTAL EST: m:ss   (dialogue m:ss · action m:ss · silences m:ss)
```

### Coverage notes
```text
COVERAGE — [title] — draft vNN — [date] — diagnosis only; wording stays with the author
SUMMIT LENS: Storytelling /30 · AI Integration /30 · Creativity & Aesthetic /20 · Technical (feasibility) /20 · Responsible AI: PASS/FAIL
STRENGTHS (protect these): 1. … 2. …
CRITICAL (blocks lock)
 [C1] S11-L07 · What breaks: … · Why (criterion): … · Note behind the note: … · Options: A … / B … / C … · Your decision: ____
MAJOR …   MINOR …
COMPLIANCE FLAGS (G / Summit / Oscar / culture): …
RUNTIME: est m:ss vs target 6:00-6:30 → cut needed: m:ss
```

### Authorship log (`films/<slug>/01-script/authorship-log.md`)
```text
BASELINE: draft-v0-abostesha.md  sha256: …  (human, verbatim, pre-Gemini)
ORIGIN CODES: H user wrote · H/C user rewrote after a Claude note/option · C Claude wording kept (avoid) · G Gemini wording · T translation (by whom; native review Y/N) · F format/copyedit only
| Rev | Date | Location | Change (quote old → new) | Origin | Decided by | Ref (note ID) |
| v1  | 2026-10-31 | S11-L07 | "…" → "…" | H/C | AboStesha | C1 |
LOCKED: vNN  sha256: …  date: …  C-origin dialogue lines: 0
```

### Character dialogue sheet (`01-dialogue/MOTHER.md`): worked example
````text
VOICE CARD — MOTHER                                   status: AUDITION / LOCKED
Language: Urdu (confirm) · script: Urdu · language_code: ur · Mode mix: PHONE
Source: Voice Library / Voice Design / IVC / PVC · voice_id: ______ (from the user or creative_list_voices)
Declared: synthetic voice · real-person basis: none (if any → consent file: ____)
Model: eleven_v4 · Stability 0.35 · Similarity 0.80 · Clone strength: n/a
Voice Design description (paste verbatim, never paraphrase):
  "Native Urdu, North Indian variety. Female, late fifties. Studio-quality recording.
   A tired village mother who hides worry behind warmth. Soft, slightly husky timbre,
   unhurried pacing, gentle falling intonation, breath audible between phrases."
Preview text: [100-1000 chars of Urdu in her register — user-approved]
Allowed tags: [warmly] [softly] [tired] [sighs] [pause] · Forbidden: [shouting] [laughs harder] SFX tags
Measured rate: __ words/s (from takes)

S11-L04 | SHOT: TBD | MODE: PHONE | LANG: ur | budget: __ s | measured: __ s | preflight: __
Intent (gerund): reassuring him / hiding the diagnosis
TTS TEXT:
```
[warmly] <Urdu: "Everything is fine, thank God." — the user's line, translated, origin T>
```
SPOKEN: <same words, no tags>
EN SUB (≤17 cps): Everything's fine, thank God.
TAKES: T01 __ s · T02 __ s · T03 __ s · SELECTED: __ · seed: __

S11-L09 | SHOT: TBD | MODE: PHONE | LANG: ur | budget: __ s | measured: __ s
Intent: blessing him before letting go
TTS TEXT:
```
[softly] <Urdu rendering of: "If I don't get to see you… know that I'm proud of you.">
```
EN SUB: If I don't get to see you…
        know I'm proud of you.        (48 chars → needs ≥2.8 s at 17 cps)
````
Show the Arabic original under every translated line, from the user's v0: «اذا لم استطع ان اراك فاعلم انني فخورة بك». The spelling fix فأعلم→فاعلم is logged as `F`.

### Take log line (append-only, `01-dialogue/take-log.csv`)
```text
line_id,char,take,file,seconds,voice_id,model,stability,similarity,seed,tags,date,selected,shot_id
S11-L04,MOTHER,T02,SLA_S11-L04_MOTHER_T02.wav,2.41,xxxx,eleven_v4,0.35,0.80,,[warmly],2026-11-02,Y,S11-SH03
```

---

## Gate

**Gate 1A: script lock.** It is required before `02-style-prefix.md`, and before line tagging starts. Ask in Arabic: «هل تعتمد النسخة vNN كنسخة مقفلة؟ بعد القفل تُجمَّد أرقام المشاهد والسطور». The user approves:
1. The Locked Sheet, with every field CONFIRMED and the official theme named.
2. The locked screenplay vNN, with its hash, frozen scene IDs and DIRECTOR NOTES kept separate.
3. A runtime estimate of 6:00-6:30 body, with the timing table.
4. A compliance pass with zero open Critical flags. Each remaining Major or Minor flag is either fixed or carries a written decision.
5. The authorship log, with 0 C-origin dialogue lines and every G/T line listed.

**Gate 1B: dialogue lock.** It is required before `04-blender-blocking.md` sets shot durations and before any lip-sync generation in `05-seedance-production.md`. The user approves:
1. A LOCKED voice card per speaking character.
2. Every line with its MODE, TTS TEXT, SPOKEN and EN SUB, and a native review of the translations.
3. A selected take per line, measured, with its preflight status. No `IMPOSSIBLE` lines remain.
4. A complete take log.

Ask: «هل نعتمد أوراق الحوار والتسجيلات المختارة وننتقل إلى البلوكنغ؟»

## Common failures

- **Claude writes the film.** Polished replacement lines appear in the script, or a "cleaned" version replaces his draft. Fix: diagnose, offer options in prose, let him type the words, and log the origin.
- **Gemini text slips in unlogged** as if it were human. Fix: diff against the v0 baseline and mark it `G`.
- **The runtime is guessed from pages, and the script locks at "7 pages".** Fix: time it by beats and by language; measure takes.
- **Scenes get renumbered after lock**, which breaks shot, audio and ledger mapping. Fix: A/B inserts and OMITTED.
- **The cut keeps every montage item** and drops the quiet scenes that carry the turn. Fix: cut repeated beats first.
- **A dream sequence gets a G-rating pass** because "it's not real". Suicide, drugs and beatings fail in any reality layer.
- **Tags fail.**
  - Stage directions or SFX tags in the TTS text are spoken, ignored, or turned into effects.
  - Stacked tags make every take different.
  - `[shouting]` on a soft voice.
- **Brackets reorder in RTL**, so a tag lands mid-sentence. Fix: logical-order check, one code block per line.
- **Cross-language accent loss.** An Indian-English line voiced by a Hindi-reference voice comes out with a neutral accent, because v4 targets a fluent accent across languages. Cast per line language.
- **Voice drift.** The descriptor is reworded, or settings change mid-film. Fix: voice lock, and re-render all of that character's lines.
- **Effects baked into stems.** A phone filter added at generation can't be undone in the mix. Keep stems dry.
- **A long ON line** (more than one breath, or over 8 s) fails lip-sync, or the last word is clipped. Fix: split it, or move it to OFF/VO.
- **Two speakers in one lip-sync shot.** Plan per-speaker shots.
- **Subtitles overflow** (over 42 chars a line or over 17-20 cps), or contain numbers and ellipses in the wrong style.
- **API defaults** silently render with `eleven_multilingual_v2` (TTS) or `eleven_v3` (Text to Dialogue). Fix: always pass `model_id: "eleven_v4"`, and use `similarity` rather than `similarity_boost` on Text to Dialogue.
- **Scripture misquoted, or real brands, authors or trademarks unflagged.**

---

## Sources and credits

- **Quoted or adapted verbatim**, all MIT License, with thanks:
  - gbellonre/psych-short-screenplay (© 2026 gbellonre): Locked Sheet tests, beat format, scene footer, punch-up method, cut rule.
  - omkarpalika/filmcraft (© 2026 Omkar Palika): AI-screenwriting tells, notes discipline.
  - OSideMedia/higgsfield-ai-prompt-skill (© 2026 O-Side Media): lip-sync rules, voice lock.
  - calesthio/generative-media-skills (© 2026 contributors): take types, voice timing locked before the face.
  - elevenlabs/skills (© 2024 ElevenLabs): v4 settings and presets.
- **Paraphrased:**
  - jtydhr88/screenwriting-skills (MIT for its original structure; its book quotations are not relicensed, so none are reproduced): sw-dialogue, sw-scene-craft, sw-story-structure, sw-premise-theme, sw-format-adaptation, chekhov-dramaturgy. The craft is from McKee, Egri, Walter, Hicks, Lu Jun and Chekhov.
- **Inspiration only, paraphrased:**
  - jordangaston/claude-plugins `elevenlabs-tts-prompting` (no licence).
  - badgids/story-film-skills dialogue-timing-preflight (idea only).
- **Facts from official pages**, checked 2026-10-30:
  - ElevenLabs docs: Eleven v4 overview, models page, v4 prompting best practices, Text-to-Dialogue and TTS API references, Voice Design guide and API.
  - The ElevenLabs hosted MCP model guide (`eleven_v4`).
  - Netflix English Timed Text Style Guide and Subtitle Timing Guidelines.
  - Aldholmi et al., Interspeech 2021, on Arabic speech rate.
  - AI Film Award 2027 Terms, and the Academy 99th Rules, both via `00-award-brief-and-calendar.md`.
- **Carried over from the user's old skills:**
  - cinematic-pipeline: gating, the Arabic/English heading table, the "no emotions in action lines" rule.
  - seedance-2-5-prompts: audio-reference limits and the `{ }` dialogue syntax used by `05`.
- **Unverified, so test or measure:**
  - Arabic, Hindi and Urdu words-per-minute figures.
  - English tags inside Arabic or Urdu text, and the effect of tashkeel on v4.
  - The Seedance 2.5 per-clip audio limits on BytePlus.
  - The lip-sync word budgets (from Seedance 2.0 data).
  - Whether the ElevenLabs UI shows seeds.
