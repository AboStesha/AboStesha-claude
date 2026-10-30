# 08 — Judge Panel, Verifier and Audience Test (Step 8)

**Purpose.** Put the finished cut in front of four independent judges: a Summit juror, an Academy voter, a Hollywood critic and an AI-film artist. Each one sees and hears only what a real viewer would.
**How.** A verifier throws out vague praise and wrong criticism. What survives becomes one report with a ranked fix list.
**Rule.** LLM judges flatter, so real viewers (Arabic and English speakers) decide every question about whether people understand the film and feel something.

Talk to the user in Arabic (MSA, addressing them as أبوستيشا). Judges, the verifier and every fix prompt work in English. Evidence tags are the ones used in 07-edit-mix-finish.md: `[DOC]` documented, with source and date · `[TESTED]` run in this sandbox on 2026-10-30 · `[FIELD]` third-party report · `[HOUSE]` house heuristic · `[UNVERIFIED]`.

---

## Inputs

| Input | Where | Used by |
|---|---|---|
| Reference export with intro, titles, credits, mix and burned EN subtitles, plus soloed DX/MX/FX | `films/<id>/07-finish/review/SLA_ref_vNN*.{mp4,wav}` (07 §7.1) | all judges |
| Measurement pack (spec, cuts, black/freeze, loudness, strips, shot table) and QC notes | `07-finish/qc/vNN/` (07 §7.2, §7.9) | all judges, verifier |
| Snapshot (shot IDs ↔ sequence TC), edit notes with **declared intents** (intended jump cuts) | `07-finish/snapshots/`, `07-finish/notes/` | pack, verifier |
| Locked Sheet, scene list, line IDs, EN SUB text | 01-script-and-dialogue.md (1.1.1, 1.1.3, 1.2.4) | J1, J3, audience beat checklist |
| Project invariants, colour script, look frames | 02-style-prefix.md | J1, J4 |
| Locked character/location sheets | 03-assets-images.md | J4 |
| Ledger: tool per shot, draft/final job IDs, DREAM physics exceptions, Seedance share | ledger-continuity-physics.md | J1, J4, verifier |
| Performance scale and hero-shot list | 05b-acting-direction.md (5b.9) | J2, J4 |
| AI-disclosure draft, authorship dossier, G1–G3 gate reports, T4 provenance result | `evidence/`, 00-award-brief-and-calendar.md | J1, J2 |
| Audience screening results (8.8) | `08-judge/screening/` | combine (8.6) |

Working folder: `films/<id>/08-judge/` with `round-N/{pack,work/<judge>,out}`, `screening/` and `story-notes-for-series.md`.

## Ground rules

1. **Nobody grades their own work.** vawe states it plainly (Apache-2.0): "The author never grades its own film." Every judge and the verifier runs as a fresh agent. None of them sees this conversation, any prompt, the storyboard, the director's intent memo, or another judge's output.
2. **Sealed scores.** Wait for all four judges before reading any one of them. Never edit a judge's words; translate them for the user, quote them, and add your own comment underneath, labelled as yours.
3. **You cannot hear.** An audio claim needs one of three things behind it: a measurement (07), the labelled Gemini log (8.1), or the user's ear. Without one it is "unheard" and cannot be scored.
4. **Holdback (00 H1).** The local engine is the default, always with `--no-whisper` (or `--whisper whisperx`, which stays on the machine): a Groq or OpenAI speech fallback would upload the soundtrack. The film goes to Google (watch's Gemini engine, paid-tier key only, 8.1) or Higgsfield only with the user's explicit consent for this film. Audience screenings are private and run by invitation (8.8).
5. **After picture lock (G3, D15) the story stays closed.** Story notes reopen the cut only for two things: a responsible-AI or G-rating P0, or a comprehension P0 that the audience confirmed. Even then the user decides, and every cut change goes through 07's L3 permission ladder.
6. **No approval from silence** (carried over from the user's cinematic-pipeline skill). Wait for an explicit «اعتمد» per item.
7. **No evidence, no finding.** Every claim, praise as well as problem, needs a timecode and something a viewer can observe.

Timecode convention: `TC` is the review file's time, `HH:MM:SS:FF` at 24 fps, where frame = t × 24 (burned-in times read `HH:MM:SS.mmm`; FF = round(.mmm × 24)). The review file starts with the Summit intro, so TC = Premiere sequence TC + the intro offset (15.5 s in 07's example). The shot table maps each TC range to a shot ID and to the sequence TC, with the offset written at its top.

---

## Procedure

### 8.0 Pick the run (calendar from 00)

| Run | Day | Cut | Who | Purpose |
|---|---|---|---|---|
| R0 rough pass | D12 (Buffer 1) | rough cut v1 | J1 (Storytelling only) + J3; verifier on P0s only | story structure while it can still change |
| Audience screening A | D14 evening or D15 morning, **before** the G3 signature | fine cut, rough mix, no Summit intro, temporary EN captions (+ AR) | 5–10 real viewers (8.8) | comprehension and emotion; this replaces the "3–5 viewers" figure in the 00 calendar |
| R1 full panel | D17 | D16 reference export (07 hand-off) | J1–J4 → verifier → combine | the fix list before G4 |
| Audience screening B (optional) | D17 | R1 file, played from the first frame after the intro | 2–3 *new* viewers | sound, subtitles, mix intelligibility |
| R2 re-check | D17 evening / D18 morning | export after the fixes | verifier + J4 + every judge whose P0/P1 was fixed | prove the fixes; no new opinions |

Never run more than 3 panel rounds per film (R0, R1, R2).

- **R0 pack** (07 has not run yet): the user's H.264 export of the rough cut as `film.mp4`, `sheets/`, `SYNOPSIS.md`, and a `WORDS-AND-SOUND.md` listing each line's TC, speaker and EN SUB from 01. No SPEC, strips or hero stills.
- **Screening A captions** (07 §7.10 runs on D16): the user lays 01's EN SUB cells, and the Arabic originals for the AR seats, as a temporary caption track on the fine cut. If time allows, export the track as SRT and run `scripts/srt_check.py` on it. Real viewers judge subtitles properly in screening B.

**Environment.**
- **Claude Code** (an Agent/Task tool is available): spawn J1–J4 as four `general-purpose` subagents in **one message**, so they run in parallel. Tell each one: "Return only your JSON. Do not write files outside `{{WORKDIR}}`."
- **claude.ai chat** (no subagents): run each judge yourself as a sealed, separate pass, in the order J4, J2, J3, J1 (craft before verdict). Before each pass, re-read only that judge's card and fully take the role. Write the full JSON before starting the next pass, and never revise an earlier one. This is the idea-council chat override, MIT, paraphrased. Say in the report that the passes shared one context, which makes them weaker evidence.

### 8.1 Viewing setup: the `watch` skill and consent

1. **Version.** `watch` 0.3.2 is current (bradautomates/claude-video, 2026-09-25 `[DOC]`); the user's synced copy is 0.2.0, which has no Gemini engine. Run `python3 "$WATCH_DIR/scripts/setup.py" --json` and read `engine` and `gemini_model` (default `gemini-3.7-flash` `[DOC config.py]`). If the copy is still 0.2.0, ask the user to update it in Claude Code (`/plugin marketplace add bradautomates/claude-video`, then `/plugin install watch@claude-video`; other agents: `npx skills add bradautomates/claude-video -g --skill watch` `[DOC README]`) or continue local-only. Watch 0.3.2 does not support claude.ai Chat or Cowork `[DOC CHANGELOG]`. There, ask the user to upload the review MP4 (or the contact sheets from 8.2) and make the frames with code execution.
2. **Consent for Gemini, once per film, before any upload.** The Gemini API terms say Google uses content sent to the *unpaid* tier to improve its products, that human reviewers may read it, and that confidential material must not be sent there; the paid tier is not used to improve products `[DOC ai.google.dev/gemini-api/terms, 2026-10-30]`. So a Gemini pass needs a key from a project with billing enabled. Watch's setup points to a free key, so ask them to confirm billing in AI Studio. Upload a 720p proxy, never the master (the Files API takes ≤ 2 GB per file and deletes after 48 h `[DOC]`): `PROXY=work/SLA_ref_vNN_gemini.mp4; ffmpeg -i "$REF" -vf scale=-2:720 -c:v libx264 -crf 23 -c:a aac -b:a 192k -movflags +faststart "$PROXY"` `[TESTED]`.
   ```text
   أبوستيشا، محرّك Gemini في أداة watch يرفع نسخة مصغّرة (720p) من الفيلم إلى خوادم Google ليستمع إلى الصوت ويصفه، ثم تُحذف بعد الإجابة (وإن تعذّر الحذف تُحذف تلقائياً خلال 48 ساعة).
   أستخدمه فقط بمفتاح من مشروع مفعّل فيه الدفع، لأن شروط Google تسمح لها باستخدام ما يُرسل عبر المفاتيح المجانية لتحسين منتجاتها ومراجعته بشرياً.
   هذا ليس نشراً علنياً، لكنه خروج للفيلم من جهازك قبل إعلان النتائج. هل توافق على رفع SLA_ref_vNN_gemini.mp4 لهذا الغرض فقط، وهل المفتاح مدفوع؟ (نعم / لا)
   ```
   If they say no to either, skip it. The panel then works from measurements plus their ear, and the report says audio was only partly reviewed.
3. **Gemini passes (with consent).** Run them on the proxy (`$PROXY`). Ask neutral questions only: never ask "is it good", and never mention the director. Save the answers as `pack/gemini_audio.md` and `pack/gemini_retell.md`, headed "Second-model observations, untrusted, not measurement".
   ```bash
   python3 "$WATCH_DIR/scripts/watch.py" "$PROXY" --engine gemini --question "List with timestamps everything you hear: each line of dialogue (speaker as seen on screen, language), music entries and exits, sound effects, silences, any voice or music that seems unintended, any sound that lands before or after its visible cause, any distortion or clipping. Describe only; do not judge quality."
   python3 "$WATCH_DIR/scripts/watch.py" "$PROXY" --engine gemini --question "As a first-time viewer, retell the story in five sentences. Then list, with timestamps, every moment where you were unsure who someone is, where we are, whether a scene is a dream or real, or why a character acts. Describe only."
   ```
4. **Local passes (always run, nothing leaves the machine).** The first goes into the pack for every judge (scene-aware, ≤ 100 frames). The second is the verifier's spot check of a disputed window: `--fps` is capped at 2, so set `--max-frames` to window seconds × 2 `[DOC SKILL.md]`:
   ```bash
   python3 "$WATCH_DIR/scripts/watch.py" "$REF" --engine local --no-whisper --detail balanced --resolution 1024 --out-dir 08-judge/round-1/pack/watch
   python3 "$WATCH_DIR/scripts/watch.py" "$REF" --engine local --no-whisper --start 00:02:10 --end 00:02:40 --fps 2 --max-frames 60 --resolution 1024 --no-dedup --out-dir 08-judge/round-1/work/verifier/watch
   ```
   A 2 fps sample cannot show a 1-frame pop, a late lip or a doubled frame. For those, use the native-frame strips in 07 §7.2 E.
5. **Optional attention proxy.** Higgsfield's Virality Predictor (`brain_activity` in the CLI; `virality_predictor` in the Higgsfield connector's instructions on 2026-10-30, though not callable in this session) scores predicted attention for ad creatives. Use it only with the user's consent to upload, and only to find dead stretches before the public vote. It is never a judge.

### 8.2 Build the review pack (one per round)

`round-N/pack/` holds everything a judge may open, and nothing else:

| File | Content | Source |
|---|---|---|
| `film.mp4` | the reference export (a copy, never a link to the timeline) | 07 §7.1 |
| `SPEC.md` | ffprobe summary, runtime (story / titles+story+credits / with intro), loudness I/TP/LRA for WEB and PRINTMASTER, black/freeze hits with verdicts | 07 §7.2 A–D, §7.9 |
| `SHOTS.csv` | `shot_id, tc_in, tc_out, frames, scene, world(REAL/DREAM), hero(y/n), tool+route, draft_job, final_job` | snapshot + ledger |
| `sheets/sheet_<scene>_NN.png` | 1 fps contact sheets, 30 tiles each, with the real source time burned in | command below |
| `strips/strip_<t>.png` | 12-frame native strips across every cut and every ON-line onset | 07 §7.2 E |
| `hero/` | full-resolution stills of every hero shot (first/middle/last frame) | command below |
| `watch/` | the local watch pass: scene-aware frames with real source times | 8.1 step 4 |
| `WORDS-AND-SOUND.md` | every line: TC, speaker, language, EN subtitle, measured lip offset in frames; music cues in/out; loudness curve notes; the Gemini logs | 07 §7.7, §7.10; 8.1 |
| `LOCKED.md` | what cannot change: picture lock, theme, G-rating removals, 02 invariants (intended), declared intents (jump cuts from 07 notes, DREAM physics exceptions from the ledger) | 07, ledger |
| `SYNOPSIS.md` | the flat synopsis (rule below), theme, logline | 01 Locked Sheet |
| per-judge extras | J1: disclosure draft + Seedance share table · J2: authorship-dossier summary · J4: 03 sheets, 02 look frames, 05b hero list | `evidence/`, 02, 03, 05b |

```bash
# 1 fps scene sheets, source time burned in [TESTED: ffmpeg 6.1.1; a 40 s window gave 2 sheets of 2880x1350]
ffmpeg -hide_banner -loglevel error -ss "$IN" -to "$OUT" -copyts -i "$REF" \
  -vf "fps=1,scale=480:-1,drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6,tile=6x5" \
  "pack/sheets/sheet_${SC}_%02d.png"
# hero stills; TIN/TOUT in seconds from SHOTS.csv (TOUT = next shot's first frame). The half-frame offsets stop -ss from
# landing on the neighbour shot [TESTED: returned 20.500 / 24.000 / 27.458 for a 20.5–27.5 s shot]
for p in "first:$(awk -v a="$TIN" 'BEGIN{t=a-0.5/24; printf "%.4f",(t<0?0:t)}')" \
         "mid:$(awk -v a="$TIN" -v b="$TOUT" 'BEGIN{printf "%.4f",(a+b)/2}')" "last:$(awk -v b="$TOUT" 'BEGIN{printf "%.4f",b-1.5/24}')"; do
  ffmpeg -hide_banner -loglevel error -copyts -ss "${p#*:}" -i "$REF" -frames:v 1 "pack/hero/${ID}_${p%%:*}.png"; done
```

**Flat synopsis rule** (idea-council, MIT, paraphrased). Write the story in 80–120 words, the way a stranger would tell it. Leave out every intent and persuasion word ("powerful", "explores", "visually stunning"). J3 gets only the logline. J1 gets what a real juror gets: the theme, the logline and the AI disclosure. Nobody gets the director's statement.

### 8.3 Anti-flattery rules (paste into every judge prompt)

1. **Default to the bottom.** vawe (Apache-2.0): "Default verdict is REJECT; the film passes only when you cannot find a reason to reject it. Grade what is on screen, not what the film meant." Start each criterion at level 2 and move up only with timecoded evidence.
2. **Score against a field.** J1 and J4: one entry among about 3,500 (the 2026 field: about 400 hours watched by 40 experts, cut to 100, then Top 12, then Top 5 `[FIELD: Gulf News/WAM via research]`). J2: a shortlist-level animated-short slate (card). J3: the dozens of festival shorts a trade critic sees each week. A score means "where this film lands in that field", not "good effort".
3. **Praise costs evidence.** Each praise item needs a TC, an observable, and the criterion it earns. You may give at most 5 praise items, and each must pass the swap test (rule 6).
4. **Banned without an observable in the same sentence:** stunning, breathtaking, masterful, powerful, beautiful, seamless, cinematic, compelling, evocative, haunting, visceral, immersive, impressive, gorgeous, poignant, "a testament to", "pushes the boundaries".
5. **Result, not intent.** "The film explores…" or "aims to…" is not evidence. Write what a viewer sees and hears at a TC.
6. **Swap test.** If the sentence would be just as true of another AI short, delete it.
7. **Name the three weakest moments** (TC + why), even in a strong film. "Nothing wrong" is allowed only together with a list of what you checked.
8. **Don't propose adding text, voice-over or explanatory captions.** When a picture does not read, the fix is the picture or the cut (cinetic, MIT).
9. **Fixes are bounded.** Each fix names its route (07 §7.5 numbers), what it must not change, and a rough time estimate. "Improve pacing" is not a fix; "trim S05-SH02 tail by 14 f at 00:02:31:10" is.
10. **Opinion is labelled.** Every issue carries a class: `objective` (measurable defect), `likely` (visible defect, not measured), `opinion`, or `uncertain`.
11. **First impressions first.** Write 5 lines after looking at the frames and sheets and before opening any text file. They are the audience's reaction; after reading the notes you will forgive what an audience will not (cinetic, MIT, paraphrased).
12. **A kind score is useless.** take-one (MIT): "a kind score is useless, and so is a harsh one that is not tied to something visible."

Severity (cinetic, MIT, quoted in 07): "**P0** is visible on a key beat or breaks the story. **P1** is noticeable on a normal viewing… **P2** is visible only on pause." For this film, a responsible-AI failure is always P0.

### 8.4 The four judges

Paste the matching card into the judge template (Output template 1). The anchors set levels 1, 3 and 5, with 2 and 4 between them; when a score falls between two levels, take the lower one.

#### J1 — AI Film Award 2027 juror (Summit rubric + responsible-AI gate)

**Role.** You sit on the expert committee that picks the Top 10, partnered with BytePlus (Dreamina Seedance) and TikTok. The published Top 10 criteria are storytelling, originality, character development, structure, visual creativity and use of Seedance. The 2026 shortlisting also cited emotional impact and transparency and ethics `[DOC page; FIELD 2026 coverage]`. The 2026 winner, "Lily" (Tunisia), was praised because the director "didn't just showcase what the tools could do" (Google blog, via research), and all of the 2026 Top 5 were intimate, small-cast moral arcs.

Rubric: the weights are `[DOC official page, fetched 2026-10-30]`; the level anchors are `[HOUSE]`, since the Organizer publishes none. Points = level × weight ÷ 5.

| Criterion (weight) | Level 1 | Level 3 | Level 5 |
|---|---|---|---|
| AI Integration (30) | AI shows as artifacts or a gimmick; stock footage could replace it | clean, consistent generation, but the story would be identical as live action | the form depends on generative video and that dependence carries meaning (for 2nd Life: DREAM worlds that bend physics against a strictly physical REAL Dubai); no artifacts on key beats; Seedance clearly the primary tool |
| Storytelling (30) | a premise or a montage; no want, no turn | clear want, turn and ending, but predictable, or the emotion is told, not shown | a stranger retells it correctly; the turn surprises yet feels inevitable; the ending lands on an image; every scene changes something |
| Creativity & Aesthetic (20) | the generic "AI look" (glossy, plastic skin, default teal-orange); derivative | coherent and competent, but the look is recognisably borrowed | a look of its own that follows from the story; the 02 invariants hold in every shot; images that stay with you; a culturally specific world |
| Technical Execution (20) | identity drift, lip-sync errors or artifacts on key beats; spec failures | occasional P1 artifacts, minor sync slips, spec compliant | no verified P0/P1; every ON line inside 07's lip-sync tolerance; mix intelligible (measured); spec and subtitles PASS |

Also check:
- **Screener test.** Would a tired screener keep watching after 60 s, counted from the first frame after the Summit intro? Note the TC where the protagonist first appears, where his want is clear, and where the 2nd Life rule is clear. Research says to hook within the first 30–60 s `[FIELD]`. A public vote follows, and TikTok is a partner, so look at the first minute's sheet again with each tile at 360 px wide, about a phone held sideways: are the faces, the key prop and the rule still readable?
- **Theme.** Name the theme you read from the film alone, then compare it with the declared one.

**Responsible-AI gate (not scored; any FAIL means BLOCK).** Each line gets PASS, FAIL or CANNOT-TELL, with evidence:
- RA1 Every face and voice synthetic and declared; no real-person or celebrity likeness (5.5(d), 6.1(f), 7.5).
- RA2 No brand, logo, real product or book, or Summit/Partner mark; no garbled text that resembles a brand (6.1(d), 9.2(j)).
- RA3 G content: no tobacco, alcohol, drug or gambling object or use; violence and peril mild; nothing frightening for a child (9.1, 9.2(f)).
- RA4 No self-harm or suicide shown, attempted, planned or idealised, dreams included (9.2(d)).
- RA5 Religion and the UAE: scripture accurate; nothing that mocks faith, rulers, government, institutions, symbols or currency. Every religious line has the human reviewer's sign-off (00 G1; 9.2(e)).
- RA5b No political or campaign reading: Miraj's poverty and his mother's unpaid surgery play as one man's story, not as an indictment of UAE labour or health policy; the "Made in UAE" and "land of opportunities" beats aim their irony at automation, not at the country (script review, G1); nothing could harm the UAE's relations with any country (9.2(g), 9.2(k)). Any doubt goes to the human reviewer.
- RA6 Nobody's nationality, race, body or class is a joke or a stereotype (9.2(c)).
- RA7 The disclosure matches the screen: every tool visible in the film is declared; Seedance share ≥ 70% with ledger proof (target ≥ 90%) (5.4, 5.5(a)).
- RA8 Watermarks and credentials intact, per T4 (5.6).
- RA9 No synthetic broadcast that could pass for a real event or a real person (Noah's keynote must read as fiction) (9.2(h)).
- RA10 Holdback intact (8.4).

**Returns:** `levels{ai,story,creative,technical}`, `points`, `ra[]`, `screener{protagonist_tc, want_tc, rule_tc, keep_watching:true|false}`, `theme_read`.

#### J2 — Academy voter (Animation Branch / Short Films Branch)

**Role.** An animator and short-film voter. The Oscars are not a target, background only (BRIEF, updated 2026-10-30): this card never blocks the Summit cut; its output feeds 09 and the authorship dossier. Academy voting is preferential, not scored. Animation Branch and Short Films Branch members who view a set minimum share of the submissions rank up to fifteen; the fifteen with the most votes become the shortlist. Then any Academy member who has viewed all fifteen ranks up to five, and the five with the most votes become the nominations `[DOC 99th Rule Eight §V]`.

Answer in this order:
1. **Category fit (eligibility).** Rate each risk LOW / MED / HIGH and quote the rule.
   - *Animated* means characters given "the illusion of life by having movement created for them, by any human means". At least 75% of the running time, without credits, must include animation of the primary subjects, and the filmmaker must show how the film qualifies `[DOC 99th Rule Eight I.C]`. Judge from the authorship-dossier summary how much of the primary subjects' movement is human-keyframed (04-blender-blocking.md) and how much is prompted. Separately, judge how a voter perceives a photoreal film.
   - *Live Action* is closed: it requires practical photography (00 §0.11).
   - *Exclusions:* "Alternate or re-edited versions" of publicly exhibited shorts (I.B.2). "Works originally created as episodic television… pilots or material as part of an ongoing, multi-part or limited series" (I.B.4). Background only; they would matter only if the Oscars ever become a target. What matters now: the submission must stay one complete standalone story and is never called a pilot or an episode, so flag every place the film, its credits or its materials call it an episode or a pilot. After 10 Jan 2027 (end of holdback, cl. 8.4) the user takes the film to other competitions and festivals and pitches it to international production companies and platforms as "Episode 0" of a 7-episode "Second Life" mini-series (the user keeps ownership, cl. 7.1; the Organizer's licence is non-exclusive and the user may monetise after the Award closes, cl. 8.2–8.3). Hand both points to 09-release-and-festivals.md. The Summit cut is locked for the Summit; after 10 Jan 2027 a festival or "Episode 0" re-edit is allowed (Academy eligibility would be affected only if the Oscars ever become a target).
   - *Authorship:* generative tools "neither help nor harm", but the Academy weighs "the degree to which a human was at the heart of the creative authorship" and may ask for more information `[DOC 99th Rule Two ¶7]`. List the gaps in the dossier.
   - The 100th Awards rules are not published (00); treat all of this as provisional.
2. **Craft as an animator.** Score every hero shot on 05b's performance scale (0 mannequin … 4 alive, 5 magnet); hero shots must reach 4. Then judge timing, staging and silhouette, design originality, and personal voice: does a single author's sensibility show?
3. **Ballot estimate.** Judge it against a shortlist-level slate. For reference, the 98th nominees were *The Girl Who Cried Pearls* (winner, stop-motion), *Butterfly*, *Forevergreen*, *Retirement Plan* and *The Three Sisters* `[DOC NFB release 2026-03; FIELD press]`. You have not seen them; use them only for their known traits: hand-made design, a personal voice, intimate stakes. Place the film in a band: `TOP5` / `6-15` / `16-40` / `NOT_RANKED`, and give three reasons it would or would not make your fifteen.

**Returns:** `eligibility[]`, `performance[{shot, score, tc}]`, `ballot_band`, `reasons[3]`, `dossier_gaps[]`.

#### J3 — Hollywood trade critic

**Role.** You review shorts for a trade paper and see dozens a week. Write what you would publish.
- **Capsule review**, 120–180 words, with one quotable line and one "but" line. Star rating 1–5, half stars allowed: 2 = a competent calling card, forgettable; 3 = worth seeing, flawed; 4 = a festival standout; 5 = rare.
- **Logline as you would tell it.** If it differs from `SYNOPSIS.md`, the difference is a finding.
- **Story craft**, each point with TCs:
  - Does Miraj act, or is he acted upon?
  - Is the dialogue on-the-nose, or carried by subtext?
  - Are Noah's speeches exposition?
  - Is the ending earned, or wish-fulfilment? For 2nd Life this means: does the success sequence read as real, as a dream, or as deliberate ambiguity, and does it work?
  - Are the tone shifts controlled?
  - Does the music tell us what to feel?
  - Which scene could go without loss?
- **Derivative risk.** Name the three works it most resembles (for example *Black Mirror*, *Strange Days*, *Inception*, *Parasite*), and say whether it earns or survives each comparison.
- **30-second map.** One 1–5 score per 30 s block for "the picture carries the film here", with the two weakest blocks named. This adapts take-one's ten-second map (MIT).

**Returns:** `stars`, `capsule`, `pull_quote`, `but_line`, `logline_as_told`, `comparisons[3]`, `map[]`.

#### J4 — AI-film artist (artifact hunt, shot by shot)

**Role.** You make Seedance films yourself, and you know every tell. Go through `SHOTS.csv` in order, one line per shot, even when the line is "clean (checked: …)". Compare each shot's first, middle and last frames with the 03 sheets and 02 look frames. The categories and verdict logic below are adapted from Gregory-Esman video-qa (MIT) and reweighted for this film `[HOUSE]`.

| Category (weight) | Look for (2nd Life specifics) |
|---|---|
| Identity (20) | face, hair, skin tone and wardrobe against the 03 sheets, within a clip and across cuts; draft→final drift (the final is a new render) |
| Performance and lip-sync (15) | 05b scale on hero shots; mouth closes on p, b and m; audio never leads by > 1 f, lags by ≤ 2 f (07 §7.7); non-speakers' mouths closed; crowd reactions staggered |
| Continuity and physics (15) | screen direction, eyelines, sun direction (ledger); REAL physics: pool water, bus, moving walkway, metro, feet planted. DREAM exceptions only as declared in `LOCKED.md` |
| Photoreal and look (15) | pores, peach fuzz, hair strands, fabric weave, eye moisture, Noah's metal; REAL vs DREAM grammar per 02; the reserved accent only on its owner; even grain; no banding in sky or haze |
| Environment and props (10) | the same future-Dubai skyline per location; the Halo lens case, ring over ring and its light colour, Food+ boxes; the robot's faulty leg |
| Text, brand, likeness (10) | Halo HUD, Food+ mark, "Made in UAE", metro screens, signage: no garbled glyphs or real brands; no lookalike faces |
| Audio diegesis and sync (10) | music or voices hallucinated in Seedance's native track (Gemini log, FX stem; Seedance renders SFX only, per 06-music-and-sfx.md); sounds landing on the settle instead of the contact |
| Seams (5) | wobble or identity shift in head/tail frames (6–12 f); flash frames; soft or ghost cuts (07 §7.2) |

Must-check list: hands and finger count on every contact frame (the robot fist bump); the lens going into the eye and the magnet at the ear; every crowd shot; every ON line's strip.

**Score.** Each category starts at 100 and loses 25 per open P0, 15 per P1 and 3 per P2, down to a floor of 0. Health = the weighted sum.

**Verdict.**
- **BLOCK** on any open P0, or an open P1 in hero-shot identity or lip-sync, text/brand/likeness, or audio diegesis.
- **HOLD** when health < 75 or there are ≥ 4 open P1s.
- **SHIP** otherwise.

**Returns:** `shots[{shot, tc, line, findings[]}]`, `category_scores`, `health`, `verdict`.

#### P — First-time viewer (not a judge; used by 09's press check)

"You have never heard of this film or its maker. You scroll past dozens of shorts a day on a phone, often muted. Say only what you would do and why: press play or not, and if you are shown the film, the TC where you would stop." It gets only what the task hands it (for 09: the logline and the poster) and never scores.

### 8.5 Verifier pass (fresh agent, one per judge's list, in parallel)

The verifier gets the pack, `LOCKED.md`, and one judge's JSON. Its only job is to delete what is not true. It never adds findings; anything new goes in `noticed`.

**Issues.** It tries to refute every P0 and P1 with its own frames, strips and measurements. Following cinetic (MIT), it rejects an issue when "the claim is wrong", when it is exaggerated (demote it), when it is "invisible at normal speed and sits on no key beat", when it is "already fixed", or when "the fix would make the film worse". Add three film-specific rejections:
- the issue is a declared intent in `LOCKED.md`;
- the fix would break G-rating, Seedance share (below 80%) or lip-sync;
- the audio claim has no measurement or Gemini line behind it.

If the problem is real but the fix is wrong, keep the issue and write a better fix. Every kept issue starts with `VERIFIED:` followed by its evidence (frame numbers plus a measurement or a precise description). P2s skip verification and go to the backlog.

**Praise.** Reject any praise item that:
- has no TC;
- uses a banned word (8.3) without an observable;
- describes intent instead of result;
- fails the swap test;
- restates the logline;
- names something `SPEC.md` or a verified issue contradicts (praise for "flawless lip-sync" next to a verified 3 f lead).

**Scores.**
- A criterion with fewer than 2 surviving evidence items (praise or issues) is `UNSUPPORTED`: re-run that judge once, or cap the criterion at level 3.
- Any criterion with an open verified P0 is capped at level 3 (cinetic rule).

**Responsible-AI lines.**
- A FAIL stays FAIL unless the frames clearly disprove it.
- A PASS with no evidence becomes CANNOT-TELL.
- Every religious, cultural or UAE item goes to the user and the human reviewer named in 00 G1; the verifier never closes those.

**Flattery triggers.** Run one extra **adversarial judge** (a fresh J1 told: "Argue why this film does not reach the Top 10 of 3,500; every point needs a TC") when any of these holds:
- J1 ≥ 85 points;
- every J1 level ≥ 4;
- J3 ≥ 4.5 stars;
- surviving praise items outnumber surviving issues for any judge.

Keep both judgments; the lower verified level wins.

### 8.6 Combine: one report, one ranked fix list

1. **Merge** `verified.json` from all four judges with the audience tally (8.8). When two judges report the same TC and defect, merge them, keep the higher verified severity, and list both sources.
2. **Summit score estimate** for each criterion. Start from J1's verified level and lower it as needed:
   - cap it at 3 while another judge has an open verified P0 in that domain (J4 → Technical and AI Integration; J3 → Storytelling; J2 craft → Creativity);
   - cap Storytelling at 3 when the audience misread the protagonist's goal or the ending (8.8).
   
   Report it as a range: the low end applies every cap, the high end is J1's verified number. Label it: «تقدير من نماذج لغوية، وليس توقعاً للنتيجة». On one 3-minute clip, take-one (MIT) saw a fresh LLM reviewer score every cut 0.5–1.5 points above the owner and stall around 7.5 out of 10.
3. **Rules for disagreement.**
   - Shared dimensions: take the lower score (cinetic).
   - Whether viewers can follow: real viewers win over every LLM judge and over the owner. take-one (MIT): "When they split on whether a viewer can follow, the stranger wins."
   - Rules and eligibility: J1/J2 plus the official text win.
   - Frame defects: J4 plus the verifier win, but a P2 that a real viewer noticed at normal speed becomes P1.
4. **Fix tiers**, worked through in order:
   - **MUST**: any responsible-AI FAIL; any verified P0. A G-rating or religious P0 cannot be waived.
   - **SHOULD**: a P1 raised by ≥ 2 judges, or by a judge plus ≥ 2 viewers; a P1 whose fix takes ≤ 30 min.
   - **COULD**: any other P1.
   - **BACKLOG**: P2s.
   - **WON'T (story)**: any story-level note after G3 that is not a P0. Log it in `08-judge/story-notes-for-series.md`, which feeds 09's director's statement and the Episode 0 series bible.
5. **Order within a tier:** the most impact per minute of work first (cinetic).
   - Each row gives its route (07 §7.5 #1–7), Seedance-share effect, owner, minutes and raised-by.
   - Drop any fix whose minutes exceed the time left before D18 12:00 `[HOUSE]` minus 4 h, which keeps 07's masters and QC (7.12–7.13) and G4 inside D18. A Seedance edit or re-draft (routes 3–5) is allowed only for a MUST item, and only when generating, downloading and re-checking it fits in that window.
6. **Comprehension P0 after lock.** Offer only minimal edit options and let the user choose:
   - a trim;
   - a reorder within a scene;
   - a cutaway from existing finals;
   - a corrected subtitle wording.
   
   Never offer a new scene or new dialogue. For a story-level decision the user is torn on, they may put it on trial with their own `court-skill:court`.
7. **Hand-off.** Approved items go to 07 as note cards (07 Output template 1) under the L3 protocol. Seedance edits go to 05-seedance-production.md, which writes the English edit prompt (07 §7.5 template).

### 8.7 Rounds

- **R2 re-check.** Use fresh agents only. Give them `CHANGED` (from 07's change log: shot, frames, what changed) and `FIXED` (IDs plus one-line summaries), and tell them: "Do not re-report fixed issues. Check the changed frames hardest."
- **Proof.** Each fix names the frames that prove it.
- **Stop.** After R2, deliver with the open issues listed. A fix made after the last review is unreviewed; say so at G4 (take-one, paraphrased). If scores stall, show the user the frames instead of running another judge: "When the score stalls, show the person; do not run a fourth reviewer" (take-one, MIT).

### 8.8 Real-audience test screening (5–10 viewers)

**Recruit** 5 at minimum and 10 at most, nobody who worked on the film or read the script. One person may fill two seats:

| Seat | Count | Why |
|---|---|---|
| Arabic-first viewers (watch with the AR sidecar) | 2–3 | native read of the Arabic dialogue, culture, faith lines |
| Non-Arabic viewers who rely on the English subtitles (EN burned) | 2–3 | stand-ins for the international committee; test the subtitles |
| A parent, or a viewer aged 45+ | ≥ 1 | G-rating gut check |
| An Emirati or long-term UAE resident | ≥ 1 if possible | UAE public-morality and national-symbol read |
| A Hindi or Urdu speaker | 1 if Kabir's lines remain | checks those lines and their subtitles |
| AI or film enthusiast | ≤ 1 | they forgive AI tells others notice |
| Close friend or relative | ≤ 1, weighted lower | politeness bias |

**Holdback (00 H1, cl. 8.4).**
- Invitation only, in person, on the user's own screen.
- For a remote viewer, a live screen-share from the user's machine: no file, no link, no recording.
- Never use a public venue or an online test-screening service.
- The host asks each viewer, out loud, not to post about it, describe it publicly or record it until AboStesha themself makes it public. That is never before 10 Jan 2027, and possibly later, because festivals value premiere status (09).
- Log first names and the date only, in `screening/log.md`.

**Session (about 30 min).**
1. **Host.** A neutral friend reads the host script (Output template 6). The user is absent, or sits silently behind the viewers. AboStesha never explains or defends anything.
2. **Room.** One uninterrupted viewing, full screen, good speakers or headphones, lights low, phones face down. Do not say it is AI-made, or whose film it is. Start after the Summit intro and stop at the first credit card, because both announce AI.
3. **Observer.** The user or a second person sits to the side and logs reactions against the player's clock: looks away or picks up a phone, fidgets, leans in, laughs, visible emotion, confusion (a frown or a glance at a neighbour), and the first look-away.
4. **Questionnaire.** Each viewer writes their answers alone, with no talking (10 min).
5. **Group talk** (10 min). The host asks only: "What would you tell a friend about it?" and "Which moment stays with you?"

**Tally** (`screening/tally.md`). Report counts ("4 of 7"), never percentages alone. Five to ten people is qualitative evidence, not statistics.
- Beat comprehension against the beat checklist built from 01's Locked Sheet (these items follow the current draft; rebuild them from the locked script):
  - Miraj's want (6,300 for his mother's surgery);
  - what 2nd Life is;
  - Kabir's 630 and why he refuses to rescue him;
  - the turn;
  - the reading of the ending.
- Clusters where ≥ 2 viewers independently name the same moment, within ±10 s, as confusing, boring or fake.
- G, religious or UAE concerns.
- Subtitle problems, by language group.
- The median recommend score, and the one-word list.

**Thresholds `[HOUSE]`.**
- Protagonist's want or the ending misread by ≥ half the viewers → comprehension P0 (handled as in 8.6 step 6).
- Any other beat missed by ≥ 3 viewers → P1.
- A cluster of ≥ 2 viewers → P1 at that TC; a single viewer's note → P2.
- Any G, religious or UAE concern from any viewer → escalate to the user and the human reviewer. No LLM judge may dismiss it.
- English-only viewers miss a beat that the Arabic viewers got → a subtitle fix (07 §7.10), not a story fix.
- Intended ambiguity (the user decides whether the success sequence is real or a dream) passes when viewers split **and** each viewer's reading is coherent. A single intended reading passes at 4 of 5, 5 of 6–7, 6 of 8, or 7 of 9–10 viewers.

---

## Output templates (what Claude shows the user)

**1. Judge prompt (English; fill the slots, paste the card from 8.4 verbatim).**
```text
You are {{ROLE}}. You are judging one short film entered in the AI Film Award 2027. You have seen none of the work
behind it. Everything you may open is in {{PACK}}; open nothing else. Work only in {{WORKDIR}}. Return only JSON.
Step 1: look at sheets/, watch/, strips/ and hero/ in TC order and write FIRST_IMPRESSIONS (5 lines) before opening any
.md or .csv file.
Step 2: read SYNOPSIS.md, SPEC.md, SHOTS.csv, WORDS-AND-SOUND.md, LOCKED.md{{EXTRAS}}.
You cannot hear: every audio statement cites a line of WORDS-AND-SOUND.md, else write "unheard".
Locked, do not re-litigate: {{LOCKED_SUMMARY}}. Fixed, do not re-report: {{FIXED}}. Changed, check hardest: {{CHANGED}}.
Timecodes: TC of film.mp4, HH:MM:SS:FF at 24 fps; map to shot IDs via SHOTS.csv.
{{ANTI_FLATTERY_RULES_8.3}}
{{JUDGE_CARD_8.4}}
Return:
{"judge":"{{ID}}","round":{{N}},"first_impressions":"",
 "praise":[{"id":"","tc":"","shot":"","observable":"","criterion":""}],
 "issues":[{"id":"","sev":"P0|P1|P2","class":"objective|likely|opinion|uncertain","tc":"","shot":"",
            "evidence":"","why":"","fix":{"route":"07§7.5#n","change":"","minutes":0},"must_not_change":""}],
 "weakest":[{"tc":"","why":""},{"tc":"","why":""},{"tc":"","why":""}],
 "checked":"what you examined, so silence means 'clean', not 'skipped'",
 "role_output":{ ...fields listed under Returns in your card... }}
```

**2. Worked mini-example: what the verifier keeps and kills (2nd Life, round 1).**
```text
KILLED  J3-praise-02  "A visually stunning, haunting meditation on labour."      no TC; banned words; swap test fails
KILLED  J1-praise-04  "Seamless lip-sync throughout."                             SPEC: S11-L06 audio leads by 2 f (strip_192.0)
KEPT    J1-praise-01  00:03:41:00–00:03:47:12 S14-SH03: Miraj counts the 630 twice, stops, pockets it without looking at
                      Kabir; the cut holds 1.5 s on his still hands → Storytelling (shows humiliation without a line)
KILLED  J4-P1-07      "metro passengers' feet slide"                              DREAM exception D-04 in LOCKED.md
KEPT    J4-P0-02      VERIFIED: 00:02:13:23–00:02:14:03 S03-SH02, robot right hand shows 6 fingers on the contact frame
                      (strip_134.04.png; 04/ledger contact f133 of the clip = TC 00:02:14:01) → route 3 Seedance edit
                      (07 §7.5 worked example), 05 writes the prompt
DEMOTED J3-P1-03→P2   "Noah's keynote reads as exposition" stays an opinion; parked in story-notes-for-series.md
```

**3. Combined report (Arabic, shown in chat; full JSON in `round-N/out/`).**
```text
لجنة التحكيم — 2nd Life: Ascent — الجولة 1 — <التاريخ>
الحكم العام: BLOCK / HOLD / SHIP   (سبب واحد في سطر)
بوابة الذكاء الاصطناعي المسؤول: PASS / FAIL (<البنود>) / تحتاج قرارك (<البنود>)
تقدير درجة القمة: <منخفض>–<مرتفع> / 100  (تقدير نماذج لغوية، وليس توقعاً)
  الذكاء الاصطناعي 30: <..>  السرد 30: <..>  الإبداع والجمالية 20: <..>  التنفيذ التقني 20: <..>
أكاديمية الأوسكار: <نطاق الترتيب> — مخاطر الأهلية: <..>   الناقد: <النجوم> — «<الجملة القابلة للاقتباس>»
فنان الذكاء الاصطناعي: صحة <..>/100 — <SHIP/HOLD/BLOCK>   الجمهور (<n> مشاهدين): <أهم نتيجة في سطر>
أخطر 3 مشكلات (يجب إصلاحها): 1) <TC — اللقطة — ماذا — المسار — الدقائق> 2) ... 3) ...
ما ينجح فعلاً (بأدلة، حتى لا يضيع أثناء الإصلاح): 1) <TC — ما يُرى> 2) ...
ملاحظات سردية مؤجلة للمسلسل/بيان المخرج: <عدد> (الملف: story-notes-for-series.md)
القرار المطلوب منك الآن: <سؤال واحد>
```

**4. Fix list (`round-N/out/fixlist.md`, in English because it becomes 07's note cards; in chat, translate the headers and findings into Arabic and keep TCs, shot IDs and routes as they are).**
```text
| #  | Tier   | TC / Shot               | Finding (verified)                         | Raised by        | Route (07§7.5) | Share effect | Min | Owner  | Decision |
| F1 | MUST   | 00:02:14:01 S03-SH02    | 6 fingers on contact frame                 | J4, J1, viewer 3 | #3 SD edit     | stays SD     | 90  | 05/user | —        |
| F2 | MUST   | 00:04:58:00 S17-SH02    | RA3: bottle shape reads as alcohol         | J1, viewer 5     | #1 trim 20 f   | none         | 10  | Claude L3 | —      |
| F3 | SHOULD | 00:00:41:12 S02→S03     | ghost cut inside clip (scdet)              | J4               | #1 trim        | none         | 5   | Claude L3 | —      |
| F4 | WON'T  | S09                     | Noah's speech is exposition (opinion)      | J3               | —              | —            | —   | series notes | —  |
```

**5. Lock prompt.**
```text
أبوستيشا، هل تعتمد: (1) بوابة الذكاء الاصطناعي المسؤول PASS، (2) قرارك في كل بند من قائمة الإصلاح (نفّذ / أنفّذه أنا / أعد التوليد / لن يُصلح مع السبب)،
(3) نتائج عرض الجمهور، ثم ننتقل إلى بوابة التسليم G4 (07 و09)؟ لن أنفّذ أي تعديل على القطع إلا بموافقتك الصريحة لكل بند.
```

**6. Screening kit (`screening/`).**

*Invitation (the host sends it, in the viewer's language):*
```text
أدعوك لمشاهدة فيلم قصير (حوالي 7 دقائق) في جلسة خاصة يوم <..> الساعة <..>، ثم استبيان قصير (10 دقائق).
الفيلم لم يُعرض بعد، فنرجو عدم التصوير أو النشر أو الحديث عنه علناً حتى يعلنه صاحبه بنفسه (ليس قبل 10 يناير 2027). رأيك الصريح هو المطلوب.

You're invited to a private screening of a short film (about 7 minutes) on <..> at <..>, followed by a 10-minute questionnaire.
The film is unreleased: please don't record, post or talk about it publicly until its maker announces it (not before 10 January 2027).
Your honest opinion is what we need.
```
*Host script (read exactly as written, in the room's language):*
"Thank you for coming. You'll see a short film once, without pauses. Please watch as you would at home; afterwards, write your answers alone before we talk. There are no right answers, and nothing you say can hurt anyone's feelings: the most useful thing you can give is where you were lost or bored."
«شكراً لحضورك. ستشاهد فيلماً قصيراً مرة واحدة دون توقف. شاهده كما تشاهد في بيتك، ثم اكتب إجاباتك وحدك قبل أن نتحدث. لا توجد إجابة صحيحة، ولن يجرح كلامك أحداً: أنفع ما تقدّمه لنا هو اللحظة التي تُهت فيها أو شعرت بالملل.»

*Questionnaire (one sheet per viewer in their language; never mention AI before Q9). Arabic sheet:*
```text
س1 احكِ القصة في ثلاث جمل كما تحكيها لصديق.                 س2 من الشخصية الرئيسية، وماذا كان يريد؟
س3 ما هو "2nd Life" في هذا الفيلم؟                            س4 ماذا حدث في النهاية؟ واقع، أم حلم، أم لست متأكداً؟ ولماذا؟
س5 أكثر لحظة أثّرت فيك (صِفها).                              س6 أكثر لحظة شعرت فيها بالملل أو التوهان (صِفها).
س7 هل فيه ما لا تريد أن يراه طفل أو أحد من عائلتك؟ هل فيه ما يسيء إلى الدين أو إلى الإمارات؟
س8 هل كان من الصعب متابعة أي جملة (ترجمة سريعة، كلام غير واضح، موسيقى عالية)؟
س9 هل بدا لك شيء مصطنعاً أو مصنوعاً بالحاسوب؟ أين؟          س10 بكلمة واحدة: عن ماذا كان الفيلم؟
س11 من 0 إلى 10: هل تنصح صديقاً بمشاهدته؟                    س12 هل تصوّت له في تصويت جماهيري؟ (نعم / لا / ربما)
المقعد: عربي أولاً / ترجمة إنجليزية / والد أو 45+ / مقيم في الإمارات / غير ذلك    شاهدتُ مع: ترجمة عربية / ترجمة إنجليزية
```
*English sheet:*
```text
Q1  Retell the story in three sentences, as you would to a friend.        Q2  Who was the main character and what did he want?
Q3  What is "2nd Life" in this film?                                       Q4  What happened at the end? Real, dream, or not sure? Why?
Q5  The moment that moved you most (describe it).                          Q6  The moment you were most bored or lost (describe it).
Q7  Anything you would not want a child or your family to see? Anything disrespectful to religion or to the UAE?
Q8  Was any line hard to follow (subtitles too fast, unclear speech, music too loud)?
Q9  Did anything look artificial or computer-made? Where?                  Q10 In one word, what was the film about?
Q11 0–10: would you recommend it to a friend?                              Q12 Would you vote for it in a public vote? (yes/no/maybe)
Seat: Arabic-first / EN-subtitle / parent 45+ / UAE / other    Watched with: AR subs / EN subs
```
*Observer sheet (one row per reaction):* `player TC | viewer seat # | reaction (look-away, phone, fidget, lean-in, laugh, tear, frown/glance) | note`.

*Tally to show the user:* one table per beat (got / missed / partial, with counts), the cluster list with TCs, every G/religion/UAE comment verbatim, the subtitle issues by language group, the Q11 median and the Q10 word list.

---

## Gate (G8: what the user must approve before G4)

1. **Responsible-AI gate:** every RA line PASS. Each FAIL has been fixed and re-verified in R2. Each CANNOT-TELL has been decided by the user and, for religion/culture/UAE items, signed off by the human reviewer.
2. **Fix list:** a written decision on every MUST and SHOULD item (Claude applies / the user applies / regenerate / won't fix + reason). MUST items cannot be "won't fix" when they are G-rating, religious or likeness items. Every cut change still needs its own L3 approval in 07.
3. **Audience:** the tally has been reviewed; each comprehension P0 has been decided (minimal edit or accepted ambiguity).
4. **Limits acknowledged:** the score is an LLM estimate; audio was reviewed by measurement, the Gemini log (if they consented) and their own ear; the fixes after R2 are unreviewed.
5. **Notes for 09:** any "Episode 0" or "pilot" wording in the submission or its materials (the submission stays a standalone story; the "Episode 0" pitch starts after 10 Jan 2027), the authorship-dossier gaps, and the story notes for the series bible.

Ask with Output template 5. Silence or "تمام" without the item list is not approval.

## Common failures

| Failure | Cause | Prevention |
|---|---|---|
| Every judge says 8–9/10 | judges saw the chat, the prompts, or each other | fresh agents, pack only, sealed scores; flattery triggers (8.5) |
| Praise like "a stunning meditation on…" | no evidence contract | banned words, TC + observable, swap test; the verifier kills it |
| A judge "hears" a bad mix | Claude cannot hear | audio claims cite a measurement, the Gemini log or the user's ear; otherwise "unheard" |
| Judges re-litigate intended choices | `LOCKED.md` missing or vague | list declared intents (jump cuts, DREAM exceptions, 02 invariants) |
| A 1-frame pop or late lip missed | 2 fps watch frames only | native 12-frame strips at every cut and line onset (07 §7.2 E) |
| Fix list full of story rewrites on D17 | story notes after lock | WON'T (story) tier; only P0 comprehension or G items reopen, with minimal edits |
| Wrong-fix credits burned | an unverified P0/P1 acted on | verifier first; route and minutes on every fix |
| Unreleased film or soundtrack leaves the machine | Gemini engine without consent or on a free-tier key; watch's Groq/OpenAI speech fallback; an online screening service; a shared link | per-film consent; paid key and 720p proxy; local passes with `--no-whisper`; live screen-share only |
| Screening viewers are all friends | convenience | the seat matrix; ≤ 1 close friend, weighted lower; a neutral host; the user silent |
| Group discussion before the forms | herd effect | written answers first, alone |
| Leading questions ("Did you like the robot?") | improvised questions | read the questionnaire as written; retell first; AI only at Q9 |
| "70% understood" from 4 people | percentages on tiny n | report counts; qualitative thresholds (8.8) |
| An LLM dismisses a viewer's religious concern | LLM confidence | escalate to the user and the human reviewer, always |
| A fourth or fifth judging round | chasing a number | max 3 rounds; when scores stall, show the user frames |
| Film called "Episode 0" or a pilot in credits or submission materials | series pitch language leaking into the Summit entry | J2 flags it; the submission stays one complete standalone story; 09 uses the "Episode 0" pitch only after 10 Jan 2027 (cl. 8.4) |
| The panel reviewed the timeline, not the file | no fresh export | the pack always holds a copy of the D16 export (07 §7.1) |

---

## Sources and credits (checked 2026-10-30)

Quoted or adapted with credit; licence files checked in fresh `--depth 1` clones:
- **Leonxlnx/cinetic, MIT** (HEAD ecfa660, 2026-10-18): `skills/cinetic/references/review-loop.md` (rounds, verify pass, rejection grounds, cap at 3 with an open P0, lower score wins, impact per minute, "Do not re-report fixed issues", "Don't propose adding text"), `assets/critics/verifier.md` and `director.md` (first impressions before code, weakest moments). Its launch-film rubric, hard bans and −14 LUFS target were **not** carried over.
- **Gregory-Esman/ai-film-pipeline `video-qa`, MIT** (560cfc1, 2026-06-12): the weighted categories, photoreal stack, audio-diegesis rule, deduction scoring and Ship/Hold/Block logic, reweighted here. Its online frame-extractor fallback was dropped (holdback).
- **bradautomates/claude-video `watch` v0.3.2, MIT** (03ceb42, 2026-09-25): engines, flags (`--engine`, `--question`, `--start/--end`, `--fps` ≤ 2, `--max-frames`, `--resolution`, `--no-dedup`, `--no-whisper`), the `gemini-3.7-flash` default, the Files API upload and 48 h expiry, the Groq/OpenAI speech fallback that uploads audio, the install commands (README), no claude.ai Chat/Cowork support.
- **talsiach/take-one, MIT** (8be349c, 2026-10-28): `references/reviewer-brief.md` (a new reviewer every round, pack-only, cannot hear, three rounds, stranger wins on comprehension, reviewers score 0.5–1.5 above the owner, a time-block map).
- **vandit1604/vawe `vawe-critique`, Apache-2.0** (2c144c6, 2026-10-30): the author never grades, default REJECT, grade what is on screen.
- **User's own skills:** idea-council (MIT: flat synopsis, sealed sequential passes in chat), cinematic-pipeline (explicit lock, no approval from silence), higgsfield-generate (Virality Predictor as an optional attention proxy). The user's `court-skill:court` is referenced for contested story decisions.
- **Inspiration only, paraphrased (no licence file found):** wkimball1/designwright, for the finding contract (class, bounded fix, must-not-change invariants).

Facts:
- AI Film Award 2027 page, fetched 2026-10-30: weights 30/30/20/20; "Responsible and ethical use of AI is a mandatory eligibility requirement and is not scored"; the Top 10 committee and its criteria; public vote.
- 2026 field, process, jury and Top 5 (Lily, Portrait No. 72, Cats Like Warmth, HEAL, The Translator): research JSON citing Gulf News, WAM, Campaign ME and the Google blog `[FIELD]`.
- AI Film Award 2027 Terms, re-read 2026-10-30: 5.4, 5.6, 6.1(d)/(f), 7.5, 8.4 ("must not publicly release, publish, stream, screen or distribute"), 9.2(a)–(k).
- Oscars 99th complete rules PDF, read 2026-10-30: Rule Two ¶7 (generative AI, human authorship), Rule Eight I.B.2 and I.B.4 exclusions, I.C definition, §V voting.
- 98th Animated Short nominees and winner: NFB release (canada.ca, 2026-03) and press coverage (bostonhassle.com). The 100th rules are not published.
- Gemini API: Additional Terms (unpaid vs paid data use) and Files API limits (2 GB per file, 48 h), ai.google.dev, fetched 2026-10-30.
- Contact-sheet, hero-still and Gemini-proxy commands tested in this sandbox (ffmpeg 6.1.1).
