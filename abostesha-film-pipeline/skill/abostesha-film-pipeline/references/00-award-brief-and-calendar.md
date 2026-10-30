# 00 — Award Brief, Compliance Gates and 21-Day Calendar (Step 0)

**Purpose.** Turn the AI Film Award 2027 rules into a pass/fail plan before any script, image or video is touched.
**Output.** A locked brief per film: theme, runtime budget, Seedance-share targets, a dated calendar with daily gates, four compliance gates, and an Oscar evidence plan.
**Rule.** Nothing in 01-script-and-dialogue.md or later starts until the Step 0 Gate (end of this file) is approved by the user.

Talk to the user in Arabic (Modern Standard Arabic, addressing him as أبوستيشا, as in his earlier pipeline). Write every generation prompt, and the Organizer email, in English.

---

## Inputs

| Input | Where | Required |
|---|---|---|
| Shared brief (locked decisions, tool facts) | `abostesha-film-pipeline/BRIEF.md` | yes |
| User's story material | `films/<id>/draft-v0-*.md` (for film 01: `films/01-second-life-ascent/draft-v0-abostesha.md`) | yes |
| Today's date and the deadline | deadline 20 Nov 2026, GST (Terms cl. 1.1, 20.10) | yes |
| One film or two | ask the user | yes |
| Blender collaborator's availability | ask the user: days available, realistic greybox shots per day | yes |
| Official Summit intro file | Google Drive link on the official award page | download on D0 |
| Organizer replies | `films/<id>/evidence/organizer-correspondence/` | when they arrive |

---

## Procedure

### 0.1 Re-verify the rules (5 minutes, every time Step 0 runs)

1. Fetch `https://www.1billionsummit.com/ai-award-2027` and `.../ai-award-2027/terms-and-conditions`. Check the Terms' "Last updated" date. The snapshot below matches **12/10/2026**.
2. If the date changed, diff the clauses listed in 0.2 and tell the user what moved. The Organizer may change Terms, timeline, requirements or judging at any time (cl. 2.2).
3. If any official page contradicts the 2027 Terms (for example an older 2026 criteria page), plan to the stricter reading and add the point to the Organizer email (0.9).
4. Repeat this check on **D10** and **D18** of the calendar.

### 0.2 Pass/fail rules checklist

Snapshot verified 2026-10-30 against the official page and the Terms (last updated 12/10/2026). Quotations are a few words long; everything else is paraphrased. Each line is PASS or FAIL. One FAIL blocks submission.

| # | Requirement | Clause | Pass test | Evidence to keep |
|---|---|---|---|---|
| E1 | Applicant is a natural person who created or directed the film, aged 18+ on submission day | 4.1(a), 4.2 | AboStesha submits in his own name | ID scan ready for verification |
| E2 | Not staff, contractor or agent of the Organizer, its Affiliates or Partners (BytePlus, TikTok), not a juror or a juror's relative, not sanctioned | 4.3, 4.4 | user confirms in writing | note in `00-brief/eligibility.md` |
| F1 | Original film made for this award, never publicly released, broadcast, published, or submitted to or awarded by any other competition | 5.3(b); warranties repeated at every stage, 6.1 | no festival entry, no public post, ever, before the Summit outcome | dated project history |
| F2 | Runtime 5–7 min excluding opening titles and closing credits; the page also says "up to 7 minutes in total duration" | 5.3(a), page | story 5:30–6:40 **and** titles + story + credits ≤ 7:00 (Summit intro not counted, unconfirmed) | timecode report at lock |
| F3 | English subtitles, embedded or supplied, any spoken language | 5.3(c) | burned-in English subtitles on the Summit master, plus a textless master | SRT + burned master |
| F4 | 16:9, minimum 1080p, MOV or MP4 | 5.3(d) | 1920×1080 or larger, 16:9 container | ffprobe report |
| F5 | Addresses one of the five 2027 themes | 5.3(e), page | theme named in the form and visible in the story | theme statement |
| F6 | Suitable for a General Audience (rated G) | 5.3(f), 9.1 | passes gates G1–G4 below | gate reports |
| F7 | Official Summit intro placed before the film | page | intro prepended, untouched | master timeline |
| F8 | One original, complete, connected story | page | single story, no anthology | logline |
| A1 | Seedance is the primary video tool; at least 70% of the final film generated with Seedance | page FAQ; 5.4 says "visual and audio content", "measured in the manner the Organizer specifies" | ledger meets the targets in 0.4 | Seedance ledger (ledger-continuity-physics.md) |
| A2 | Third-party platforms allowed only if "the generation is carried out through Seedance" | 5.4 | every Seedance job via BytePlus ModelArk or a platform that runs Seedance (Higgsfield), logged | job IDs, platform, account |
| A3 | Comply with every tool's terms, acceptable-use policy and licence | 5.4, 6.1(e), 7.3 | plan tier recorded per tool on the day of generation | plan screenshots, receipts |
| D1 | Written AI Disclosure: every model, tool, platform and version, the account used, the share each generated, the Seedance version on any third-party platform | 5.5(a) | disclosure table complete | `evidence/disclosure.md` |
| D2 | On request, within 7 days: prompts, project files, timelines, shot logs, generation history, edit files; keep them 24 months after the Award closes | 5.5(b) | evidence folders filled daily, backed up twice | evidence archive |
| D3 | Source and licence of every non-AI element: music, SFX, voice, fonts, stock | 5.5(c) | licence log has no blank row; fonts included | `evidence/licences/` |
| D4 | Each voice, face, likeness and performance declared synthetic or real; signed consent for any real person | 5.5(d), 7.5 | every character and voice declared | consent forms |
| D5 | Never remove, alter, obscure or circumvent watermarks, provenance data or content credentials | 5.6 | provenance test passed (0.8, T4); no cropping or blurring of marks | metadata before/after export |
| D6 | Organizer may run originality, AI-detection, similarity and copyright checks | 5.7 | nothing to hide: logs match the film | ledger + logs |
| R1 | No real person depicted, imitated, voice-cloned or referred to deceptively or without documented consent; no deepfakes | 6.1(f), 9.2(h) | all faces and voices synthetic or consented | likeness log |
| R2 | No celebrity, public figure or brand suggesting endorsement; no third-party advertising or product placement; no trademark or trade-dress infringement; no Organizer, Summit or Partner marks without permission | 7.5, 9.2(j), 6.1(d), 7.6 | brand sweep at G2 and G3 is clean | sweep notes |
| R3 | Written licences for any third-party material, covering every use in cl. 8 | 7.4 | licences cover worldwide, perpetual use | licence log |
| R4 | Applicant is sole creator/director; creative work delegated only to tools and personnel named in the disclosure | 6.1(b), 6.1(c) | Blender collaborator named in the disclosure; written rights assignment signed | collaborator agreement |
| R5 | No exclusive licence, option or distribution deal that conflicts with the Terms | 6.1(h) | nothing signed with any distributor or festival | — |
| H1 | Holdback: no public release, stream, screening, clips, or shortlist reveal until the winner announcement or a non-finalist notice; breach disqualifies | 8.4, 13.1(g) | no BTS, teasers or stills posted publicly | calendar reminder to 10 Jan 2027 |
| H2 | Organizer gets a perpetual, non-exclusive licence including festivals and streaming | 8.1 | user acknowledged it at Step 0 | Gate record |
| S1 | Submit only through the website form, 30 Sep–20 Nov 2026, times in GST; no closing hour is published | 5.1, 1.1, 20.10 | submitted by D19 (18 Nov) | confirmation screenshot |
| S2 | Multiple films allowed, each a separate application meeting every requirement on its own; duplicate or "substantially similar" entries can disqualify all of them | 5.2 | two-film rules in 0.6 | — |
| S3 | Content standards: lawful under UAE law and media content standards; no hate, no incitement, no self-harm or suicide, no mocking religion or national symbols, no drugs/alcohol/tobacco/gambling promotion, no political content, no misleading deepfakes, no unapproved advertising, nothing that harms the Organizer's reputation | 9.2(a)–(k) | gates G1–G4 | gate reports |
| S4 | Organizer decides compliance with final effect and may blur, mute or cut; UAE screenings need classification approval | 9.3, 9.4 | aim for clear G, not borderline | — |
| S5 | Finalists must supply the film in the screening format required | 11.3(a) | keep the highest-quality master and the project | master archive |

Scoring (page): AI Integration 30, Storytelling 30, Creativity & Aesthetic 20, Technical Execution 20. Responsible and ethical AI use is a pass/fail eligibility gate and is not scored. The Top 10 committee also names storytelling, originality, character development, structure, visual creativity and use of Seedance. Timeline: Top 10 and public vote 15 Dec 2026; Top 5 25 Dec; Top 5 premiere 9 Jan 2027; winner 10 Jan 2027. Prize USD 1,000,000 (cl. 12.1).

### 0.3 Lock the theme and map it to the rubric

1. Read the user's draft and list which of the five themes it can carry: Society, Community & Humanitarian Issues · Truth, Fake News & Misinformation · Humans & AI · Climate, Nature & Our Changing Planet · Human Relationships.
2. Offer the user two candidates with one line each on why. Never pick for him.
3. Fill the rubric map. Each row names one concrete, checkable choice, not an aspiration.

```
RUBRIC MAP — <film title> — theme: <theme>
AI Integration (30):      <the moment only generative video can make, and why it carries meaning>
Storytelling (30):        protagonist <name> wants <X> because <Y>; turn at <beat>; payoff <image>
Creativity/Aesthetic (20): <visual idea that separates two worlds or states>
Technical Execution (20): <the 3 hardest technical risks and the test that retires each>
Responsible AI (pass/fail): synthetic cast declared; no real likeness; provenance intact; G-safe
```

Worked example, film 01:
```
RUBRIC MAP — 2nd Life: Ascent — theme candidates: Humans & AI / Society, Community & Humanitarian
AI Integration:   2nd Life dream-booth worlds that bend physics on cue, against a strictly
                  physical "real" Dubai; Noah the robot trillionaire as an all-synthetic performer
Storytelling:     Miraj wants 6,300 for his mother's heart surgery; turn = Kabir gives 630 and
                  refuses to "rescue" him; payoff = Food+ booth line, mother arrives, "Alhamdulillah"
Creativity:       real world = handheld, harsh noon light; dream = locked-off, impossible geometry
Technical:        lip-sync to ElevenLabs lines; robot hands and contact physics; crowd continuity
```
The 2026 winner and every 2026 Top 5 film were small-cast, intimate, moral arcs. If the draft has more speaking roles or locations than the calendar can produce (0.5), say so now and send the cut list to 01-script-and-dialogue.md.

### 0.4 Fix the runtime budget and the Seedance-share targets

Runtime budget (per film):
```
Summit intro            not counted (unconfirmed — in the Organizer email)
Main title              ≤ 6 s, over a Seedance plate
Story                   5:30 – 6:40   (hard window 5:00 – 7:00 per cl. 5.3(a))
End credits             ≤ 20 s, over a Seedance plate
TOTAL (titles+story+credits) ≤ 7:00  — design target 6:45
```
Estimate the draft's length now: count beats, assign seconds per beat (dialogue ≈ 2.5 words per second in Arabic or English, plus reaction time), and report the estimate. If it exceeds 6:40, list cut candidates for 01-script-and-dialogue.md.

Seedance share (internal metric until the Organizer specifies one, cl. 5.4). Let T = seconds of titles + story + credits.
- **Picture share** = seconds whose moving image comes from a Seedance generation ÷ T. Graded, cleaned, upscaled or re-timed Seedance frames still count. Black frames, text on black, stills, Blender renders, other video models and composites dominated by non-Seedance elements do not.
- **Audio share**, per stem (dialogue, music, effects/ambience): stem-seconds by origin — Seedance-native / other generative AI (ElevenLabs, Suno) / non-AI (procedural code, recordings, library).

Three readings of the rule:

| Reading | What must reach 70% | Status |
|---|---|---|
| R1 (page FAQ) | Seedance picture share | plan must pass with margin |
| R2 (cl. 5.4 literal) | generative-AI share of picture **and** audio, with Seedance primary | plan must pass with margin |
| R3 (strictest) | Seedance share of picture **and** of audio | keep feasible; decide when the Organizer answers |

Targets: Seedance picture share ≥ 90% (hard floor 80%). Non-Seedance picture ≤ 10% of T, roughly 40 s of a 7:00 film, and titles and credits sit over Seedance plates so they do not consume it. Under R2, code-made SFX are non-AI, so prefer Seedance-native effects and ambience where quality allows and keep procedural SFX for gaps (06-music-and-sfx.md). Under R3, a Suno or ElevenLabs score running the whole film is the main risk; do not change the music plan until the Organizer answers, but tell the user. The ledger schema lives in ledger-continuity-physics.md; Step 0 only sets these numbers.

### 0.5 Size the production to the calendar

Capacity check, written out for the user:
```
production days for Seedance (D7–D14)          = 8
approved finals the user can review per day    = <ask; default 8>
capacity (finals)                              = 8 × 8 = 64
planned final shots (from beat estimate)       = <N>
re-generation reserve                          = 25% of N
PASS if N × 1.25 ≤ capacity; else cut scope in 01 (fewer shots, longer one-take shots up to 30 s)
```
Seedance 2.5 clips run 4–30 s per generation at 24 fps (third-party mirror of the BytePlus schema; verify with a live key). Longer one-take shots reduce shot count and are a story-level choice for 01.

### 0.6 One film or two

Default: one film at maximum quality. Offer a second film only when the user asks. If he does, apply all of this:

| Rule | Detail |
|---|---|
| Separate applications | each film meets every requirement on its own (cl. 5.2): own disclosure, ledger, evidence folder, consents, licences |
| Never "substantially similar" (cl. 5.2) | different theme, protagonist, premise, world, title, visual palette and score. No 2nd Life sequel, spin-off or shared universe |
| May share | pipeline, prompt templates, checklists, Blender rigs and greybox kit (never seen on screen), procedural-SFX code, LUT workflow, disclosure templates |
| Must not share | any shot, character, voice, location look, music cue, recognisable SFX bed, title card design |
| Stagger | Film B starts 3 days after Film A and is smaller: story 5:15–5:45, ≤ 2 speaking roles, ≤ 3 locations, ≤ 30 final shots |
| Priority | Film A wins every resource conflict (user review time, collaborator time, generation queue) |
| Go/no-go 1 (D6) | Film A animatic on track **and** Film B script passed G1 → continue; else pause Film B |
| Go/no-go 2 (D10) | Film A ≥ 50% finals approved **and** Film B animatic locked → continue; else pause Film B |

A paused Film B costs nothing: it was never submitted, so it stays eligible elsewhere later.

### 0.7 Build the calendar

Single film, Blender collaborator on greybox. D0 is today. Lock dates are hard; buffer days carry no planned work.

| Day | Date | Claude | AboStesha | Blender friend | Gate at day end |
|---|---|---|---|---|---|
| D0 | Fri 30 Oct | Step 0: rules check, checklist, rubric map, runtime estimate, calendar, Organizer email draft, evidence folders, D1 test plan | approves Step 0; sends email; downloads intro; signs collaborator agreement | confirms days and shots/day | **Step 0 Gate** |
| D1 | Sat 31 Oct | runs risk tests T1–T6 (0.8); premise and beat sheet (01) | records 2 test lines in ElevenLabs v4 | installs Blender 5.1+, sets units/fps 24 | tests reported; go/no-go on routes |
| D2 | Sun 1 Nov | script v1 + **G1 Script gate**; style exploration (02) | reviews script and G1 flags | builds generic greybox kit | G1 report |
| D3 | Mon 2 Nov | script v2, dialogue tagged for ElevenLabs v4; style prefix (02) | **script lock**; generates final dialogue lines | — | script locked |
| D4 | Tue 3 Nov | shot list; hero character and location sheets (03) | runs Midjourney prompts | greybox of hard shots, batch 1 | — |
| D5 | Wed 4 Nov | remaining assets; asset-library registration; **G2 Assets gate** | approves assets | greybox batch 2 | G2 report |
| D6 | Thu 5 Nov | animatic v1 (boards + playblasts + final voice lines); runtime check | notes on animatic | playblasts to spec (04) | runtime within budget |
| D7 | Fri 6 Nov | **animatic lock**; first Seedance drafts, hardest shots first (05, 05b) | approves drafts | re-blocks on request | — |
| D8–D11 | Sat 7 – Tue 10 Nov | drafts → approvals → finals; download every output the same hour; assembly edit; music direction (06) | reviews twice a day; music generation | re-blocks | daily close (below) |
| D12 | Wed 11 Nov | **BUFFER 1**: failed renders, moderation rejects, expired drafts; rough cut; quick judge pass on rough (08) | rough-cut notes | — | rough cut reviewed |
| D13 | Thu 12 Nov | last new drafts; finals; rough cut v2 | approves | — | no new drafts after today |
| D14 | Fri 13 Nov | all finals in; fine cut support; SFX analysis (06) | fine cut in Premiere | — | all finals downloaded |
| D15 | Sat 14 Nov | **PICTURE LOCK + G3 gate**; test screening plan | locks picture; 3–5 real viewers watch | — | G3 report signed |
| D16 | Sun 15 Nov | sound design, mix notes, grade, cleanup, subtitles EN (+AR) (07); fills submission form draft | mix/grade in Premiere | — | form draft saved |
| D17 | Mon 16 Nov | judge panel (08); fix list limited to non-story fixes | applies fixes | — | fix list closed |
| D18 | Tue 17 Nov | master QC; **G4 Delivery gate**; disclosure pack; rules re-check | exports masters; uploads private link | — | G4 report signed |
| D19 | Wed 18 Nov | submission checklist walk-through | **SUBMITS**; saves confirmation | — | confirmation saved |
| D20 | Thu 19 Nov | **BUFFER 2**: fallback submission day | — | — | — |
| D21 | Fri 20 Nov | **BUFFER 3**: deadline day, emergencies only; closing hour unknown, never plan to submit today | — | — | — |

Two films in parallel (deltas from the table above; Film A follows it unless noted):

| Day | Film A | Film B | Blender friend |
|---|---|---|---|
| D3–D5 | as above | premise, script v1, G1 (D5) | A greybox |
| D6 | as above | **go/no-go 1**; script lock | A playblasts |
| D7–D8 | Seedance drafts | assets, G2 (D8) | B greybox |
| D9 | Seedance | animatic | B playblasts |
| D10 | Seedance; rules re-check | animatic lock; **go/no-go 2** | re-blocks A and B |
| D11–D13 | finals | Seedance drafts and finals | re-blocks |
| D14 | **picture lock A + G3** (one day earlier) | finals | — |
| D15 | finishing A | last finals | — |
| D16 | finishing A; G4 draft | **picture lock B + G3** | — |
| D17 | judge panel A; fixes | finishing B; judge panel B | — |
| D18 | G4 A | G4 B | — |
| D19 | submit A | submit B (separate application) | — |

**Daily close** (Claude runs it at the end of every production day and shows the result):
1. Every Seedance output downloaded and checksummed. Output URLs expire after 24 h (third-party docs; verify).
2. Every approved draft finalized, or killed, before it is 5 days old. Draft task IDs stay valid for **7 days** per the Comfy mirror of the BytePlus schema and several integrators; BRIEF.md says 14. Plan to 7 until BytePlus confirms otherwise.
3. Ledger updated: shot, tool, version, account, job IDs, seconds, approval status.
4. Moderation log updated: what was rejected, error text, what was changed.
5. Tomorrow's queue written, hardest shots first.
6. Status vs calendar: on track / 1 day behind / more than 1 day behind. More than one day behind: propose scope cuts (shots, not quality) and get the user's choice the same day.

**Buffers and failure handling:**

| Failure | Response | Time reserved |
|---|---|---|
| Render failed or timed out | retry once unchanged; on a second failure simplify the shot (fewer refs, shorter) | 25% generation reserve |
| Input image rejected for a realistic face (`InputImageSensitiveContentDetected.PrivacyInformation`, third-party reports) | register the character in the ModelArk private virtual-portrait asset library and reference `asset://<id>` (03-assets-images.md, 05-seedance-production.md); never retry an unchanged request | T1 on D1 decides the route |
| Prompt or audio rejected by content checks | change the content, not the wording trick; re-run the G1 check on that beat; log it | Buffer 1 (D12) |
| Final differs from the approved draft (it is a new render) | re-review every final; re-draft if identity or action changed | inside reserve |
| Draft expired | re-draft; the final cannot be made from an expired draft | Buffer 1 |
| Collaborator unavailable | Claude blocks the shot via Higgsfield Bridge `bl_*` or Blender MCP (04-blender-blocking.md) | — |
| Upload or link failure | second host ready; test the link logged-out on another device | Buffers 2–3 |
| Organizer changes rules mid-production | re-check on D10/D18, re-plan the same day | — |

### 0.8 Day-1 risk tests (D1)

Each test answers one question that would otherwise break the calendar. Report results in a table before any production spend.

| Test | Question | Method | Pass |
|---|---|---|---|
| T1 Faces | Will Seedance accept our photoreal character references? | one GPT Image 2.5 Sunburst hero still → Seedance reference via BytePlus; on rejection, register it as a private virtual portrait, wait for Active, reference `asset://<id>`; repeat via Higgsfield | a working route for every human character |
| T2 Lip-sync | Does Seedance sync to the supplied ElevenLabs v4 file, and does it keep the voice or re-voice it? | one Arabic line and one English line as audio references, `generate_audio` on; measure mouth offset in frames; compare the output voice to the input | offset ≤ 2 frames on a close-up; voice usable or a documented fallback |
| T3 Draft → final | How far does the 1080p final drift from the 480p draft? | one draft, then its final; compare identity, action, timing | drift acceptable, or review rule tightened |
| T4 Provenance | Does our export chain keep watermarks and content credentials? | inspect metadata of the raw final, the Premiere export and the uploaded file (exiftool; c2patool if available) | nothing applied by a tool is lost (cl. 5.6) |
| T5 Intro | What is the official intro's spec? | download; ffprobe: duration, fps, resolution, audio layout | conform plan for 24 fps film + intro |
| T6 Throughput | How many minutes per draft and per final, per route? | time T1–T3 jobs | daily queue sized to measured numbers |

Record the Seedance `watermark` setting used (the parameter defaults to false in the Comfy mirror of the schema; verify) and disclose it.

### 0.9 Ask the Organizer in writing

The user sends it from his own email account to `hello@1billionsummit.com` (address on the official page). Entries go only through the website form (cl. 5.1); this email is for questions. Do not wait for the answer: plan to R1 + R2 and keep R3 feasible. Save the reply as PDF in `evidence/organizer-correspondence/`.

```
To: hello@1billionsummit.com
Subject: AI Film Award 2027 – how is the 70% Seedance requirement measured?

Dear AI Film Award team,

I am preparing a submission for the AI Film Award 2027. Before I finalise my
production plan, could you please clarify two points about clause 5.4 of the
Terms and the FAQ requirement that at least 70% of the final film be generated
with Seedance?

1. Measurement. How is the 70% measured: by running time of the picture, by
   frames, or for visual and audio content separately? Do opening titles,
   closing credits and the official Summit intro count in the total?

2. Audio. Does audio count towards the 70%? Specifically:
   a) Dialogue: I plan to voice lines with ElevenLabs (Eleven v4) and supply
      them to Seedance as audio references for lip-sync. Does the dialogue
      count as Seedance-generated when the final track is the audio Seedance
      renders, and how does it count if I use the ElevenLabs file directly?
   b) Music generated with Suno or ElevenLabs Music, and sound effects
      synthesised with code (non-AI): do these count against the 70%, or are
      they "support" elements to be declared under clause 5.5(c)?

[Optional — include only the points still unresolved on the day of sending]
3. Is Dreamina Seedance 2.5 (model dreamina-seedance-2-5-260628) used through
   the BytePlus ModelArk API, and through Higgsfield, an accepted version and
   route under clauses 1.1 and 5.4?
4. Are AI image models (GPT Image 2.5, Nano Banana, Midjourney) acceptable as
   reference inputs to Seedance, if fully disclosed?
5. Is there a closing hour on 20 November 2026 (GST) and a maximum length for
   opening titles and closing credits?

Thank you for your help.

Kind regards,
<full name as on ID>
<country> | <phone>
```

### 0.10 Compliance gates (run at script, assets, picture lock and delivery)

Each gate produces a report with PASS / FIX / ASK lines. FIX items carry G-safe options; the user chooses. Claude never silently rewrites the user's story. UAE Media Council standards are numbered as in the Council's 20 content standards under Federal Decree-Law No. 55 of 2023 (secondary-source summary, Gulf News, June 2025; the Council's own text was not fetched).

**G1 — Script gate** (end of D2; re-run on any rewrite, in 01-script-and-dialogue.md)
- [ ] Theme named and visible in at least two scenes (5.3(e)).
- [ ] No strong or offensive language; no nudity or sexual content; violence and disturbing imagery mild at most (9.1).
- [ ] No depiction of drug, alcohol, tobacco or gambling use (9.1, 9.2(f); UAE std 11).
- [ ] No self-harm or suicide, shown, attempted, planned or idealised, including inside dreams (9.2(d)).
- [ ] Religion: scripture quoted accurately and respectfully; no line that mocks or rejects God, Islam or any faith (9.2(e); UAE std 1). Flag every religious line for a human Muslim/Emirati reviewer.
- [ ] Nationalities, races, body types and classes portrayed with dignity; no stereotype played for laughs (9.2(c); UAE std 6, 8).
- [ ] No government, ruler, national symbol, currency or institution shown in a demeaning way (9.2(e); UAE std 2, 14).
- [ ] No political or propaganda content; nothing that could harm the UAE's foreign relations (9.2(g); UAE std 3, 4).
- [ ] No real person, celebrity, real company, real product or real book written into the story (6.1(f), 7.5, 9.2(j)).
- [ ] Title and in-world names searched for trademarks (6.1(d)).
- [ ] Nothing that mocks or misuses the Organizer, the Summit or its Partners (7.6, 9.2(k)).
- [ ] Human authorship: the user wrote or approved every final line; Claude's edits logged (0.11).

**G2 — Assets gate** (end of D5, in 03-assets-images.md)
- [ ] Every face synthetic; no lookalike of any real or famous person; nobody's photo used as a reference without signed consent (6.1(f), 7.5).
- [ ] Style references are measured descriptors, never frames from copyrighted films or real actors' faces (6.1(d)).
- [ ] No logos, brand marks, trade dress, readable real brand names, or garbled text that resembles a brand (6.1(d), 9.2(j)).
- [ ] Wardrobe and settings culturally accurate (kandura, abaya, ghutra worn correctly; mosque and prayer details respectful) (UAE std 5).
- [ ] Children portrayed safely and with dignity (9.2(b); UAE std 20).
- [ ] Every human character registered for Seedance (T1 route) before D7.
- [ ] Tool, model, version, account and plan logged for every asset (5.5(a)).

**G3 — Picture-lock gate** (D15, in 07-edit-mix-finish.md)
- [ ] Runtime: story 5:30–6:40; titles + story + credits ≤ 7:00.
- [ ] Seedance picture share ≥ 90%; audio shares recorded per stem (0.4).
- [ ] Re-run G1 on the cut as watched: violence, peril and fear stay mild; no drug, alcohol or tobacco objects in frame.
- [ ] Frame-by-frame brand and text sweep; no real-person likeness drift in any shot.
- [ ] Continuity and physics notes closed (ledger-continuity-physics.md).
- [ ] Holdback intact: nothing posted; test viewers asked not to share (8.4).
- [ ] This cut is the final cut for the Summit, festivals and the Oscars (0.11).

**G4 — Delivery gate** (D18, in 07-edit-mix-finish.md and 09-release-and-festivals.md)
- [ ] File: 16:9, ≥ 1920×1080, MOV or MP4; Summit intro prepended unaltered; English subtitles burned in; textless master kept.
- [ ] AI Disclosure: every tool, model, version, platform, account and share, including Seedance version and route (5.5(a)).
- [ ] Non-AI elements: source and licence for music, SFX (including procedural code), voices, fonts, stock (5.5(c)).
- [ ] Each voice and face declared synthetic or real; consents attached (5.5(d)).
- [ ] Provenance intact; no watermark or credential removed (5.6).
- [ ] Evidence archive complete and backed up in two places for 24 months (5.5(b)).
- [ ] Credits name the human roles (written and directed by, Blender blocking by, edited by) and the AI tools.
- [ ] Private or unlisted link plays logged-out, at full resolution, with subtitles.
- [ ] Holdback reminder set until the winner announcement on 10 Jan 2027 or a non-finalist notice.

Worked example — G1 flags on `draft-v0-abostesha.md` (show the user; he decides each one in Step 1):

| Draft v0 element | Rule hit | G-safe options to offer |
|---|---|---|
| Miraj puts khaini (chewing tobacco) in his lip; later bins the tin | 9.1, 9.2(f), UAE std 11 | a non-substance habit (chewing fennel seeds, worrying a cracked phone-ring); keep religious objects out of nervous habits; or make the 2nd Life minutes themselves the addiction he quits |
| Drinks desi daru from the bottle | 9.1, 9.2(f) | counting dream-minute tokens under the bed; staring at the booth receipt |
| Booth operator gives him a sedative "dose" | 9.1, UAE std 11 | a sleep tone through the ear device; a cold neural-crown click |
| Nuclear blast in the opening dream | 9.1 (disturbing imagery), 9.2(d) | a non-weapon rupture: the pool water rises into the sky, the sun switches off, the city folds |
| Dream suicide jump from a future tower | 9.2(d) self-harm/suicide | cut it; an unintended dream fall with no intent, or the dream glitching him out |
| "I don't want life, or heaven or hell, I want to disappear forever" | 9.2(d), 9.2(e), UAE std 1 | exhaustion without rejecting faith or wishing to die; human religious reviewer signs off |
| Beats Kabir brutally in a ring | 9.1 violence | catharsis without impact: he shouts into an empty arena; cut on the swing |
| Burns money in a fireplace | UAE std 14 if dirhams | fictional Mamo coin notes only |
| Passenger singled out by race and body | 9.2(c), UAE std 6, 8 | crowding shown through heat, sweat and lack of space, nobody singled out |
| "The Psychology of Money" by Morgan Housel | 7.5, 9.2(j), 6.1(d) | a fictional book title and cover |
| "2nd Life" dream booths and title | 6.1(d): "Second Life" is a Linden Research trademark for a virtual world (USPTO reg. 2,832,935 per a UDRP decision; current status not checked) | trademark search before script lock; alternative in-world name kept ready |
| HALO assistant brand; "10 Billion Summit" | 6.1(d); 7.6 and 9.2(k) (echo of the Organizer's own summit) | trademark search for HALO; keep the fictional summit visually distinct, respectful, no Summit marks |
| Noah and Kabir paraphrase the Qur'an | 9.2(e), UAE std 1 | exact wording from a recognised translation; human reviewer; consider whether a robot should quote scripture |
| "Made in UAE" label on the robot arm | UAE std 2 if an official emblem is used | plain text only, no state emblem or government logo |

### 0.11 Oscar path: Animated Short (100th Academy Awards)

Facts (verified 2026-10-30 against the 99th Rule Eight and Rule Seventeen PDFs on oscars.org):
- Live Action is closed to this film: Live Action requires imagery and sound created primarily through practical photography of physical actors, props, sets and locations (Rule 17, I.C).
- Animated (Rule 8, I.C): movement is created "by any human means"; at least 75% of running time, without credits, must include animation of the primary subjects; filmmakers must show how the film qualifies; the Animation Branch Executive Committee decides (II.C). A photoreal, 70%+ Seedance film is an untested fit.
- Excluded: "alternate or re-edited versions" of shorts already publicly exhibited (I.B.2). The submitted film must be identical in content and length to the version that qualified, with commercial theatrical clearances; festival clearances are not enough (III.C).
- Routes: a festival award on the Short Film Qualifying Festival List, "regardless of any prior public exhibition" (II.A.2), or a 7-day paid theatrical run in one of six US metros with no prior non-theatrical exhibition beyond 15% (II.A.1, II.B). The Organizer's licence to stream (Summit cl. 8.1) makes the festival route the practical one.
- English captions or subtitles required (III.A, III.D). At most two nominees: the credited director plus one key creative (IV.A).
- The 99th cycle is closed. The 100th rules and festival list are **not published** (normally spring); the eligibility window is assumed to be 1 Oct 2026 – 30 Sep 2027 by past pattern (unconfirmed). The Summit award is not on the 99th qualifying list.
- The Academy weighs "the degree to which a human was at the heart of the creative authorship" and may ask for details (Rule Two, para 7; research snapshot, not re-fetched today).

Decisions to record at Step 0:
1. The Summit cut is the final cut. No director's cut or longer version later.
2. No festival submission before the Summit outcome (cl. 5.3(b), 6.1, 8.4). Festival planning lives in 09-release-and-festivals.md.
3. Designated nominees: AboStesha (director) plus, optionally, one key creative. Credit both exactly.
4. Clearances bought for commercial theatrical use from the start: Suno paid tier at generation time; ElevenLabs Music needs an Enterprise licence for film use per BRIEF.md (06-music-and-sfx.md); font licences.

Human-authorship dossier, filled daily in `evidence/authorship/`:

| Evidence | What to keep | Step |
|---|---|---|
| Script | the user's dated Arabic draft v0 (already in the repo), every later draft, a log of which lines Claude proposed and which the user wrote or accepted | 01 |
| Visual design | style decisions and rejected options, signed off by the user | 02, 03 |
| Human-made motion | Blender files with hand-set keyframes by the collaborator and the user; playblast beside the Seedance result for each shot | 04, 05 |
| Direction | per-shot performance notes, selects and rejects with reasons | 05b |
| Edit and sound | Premiere project versions, cut notes, mix decisions | 07 |
| Statement | a one-page "how this film qualifies as animated": human keyframed blocking drives the primary subjects' movement; generation is the rendering step | 09 |

---

## Output templates (what Claude shows the user)

**Brief card** (one per film):
```
أبوستيشا، هذا ملخص الخطوة 0 — <اسم الفيلم>
• الموعد النهائي: الجمعة 20 نوفمبر 2026 (توقيت الخليج) — نخطط للتسليم الأربعاء 18 نوفمبر.
• المحور المقترح: <خيار 1> أو <خيار 2> — القرار لك.
• المدة: القصة 5:30–6:40، والمجموع مع العنوان والتترات ≤ 7:00. تقديرنا للمسودة الحالية: <م:ث>.
• نسبة Seedance: هدف الصورة ≥ 90%. الصوت: ننتظر رد المنظمين (الرسالة جاهزة).
• مخاطر اليوم الأول: الوجوه الواقعية، مزامنة الشفاه، الفرق بين المسودة والنسخة النهائية، بيانات المصدر.
• ملاحظات الامتثال على المسودة: <عدد> نقطة (الجدول مرفق) — نقرر كل نقطة في الخطوة 1.
• الأوسكار: فئة الرسوم المتحركة فقط، ونسخة القمة هي النسخة النهائية.
```

**Calendar** — the 0.7 table with Arabic headers (اليوم · التاريخ · Claude · أبوستيشا · صديق Blender · بوابة نهاية اليوم), dates filled, lock days in bold.

**Daily status line**:
```
D<n> — <اليوم والتاريخ> | الحالة: على المسار / متأخر يوماً / متأخر أكثر من يوم
المنجز: <...> | المرفوض/المعاد: <...> | مسودات تنتهي خلال يومين: <...>
قرار مطلوب منك اليوم: <سؤال واحد واضح أو "لا شيء">
```

**Gate report**:
```
بوابة <G1/G2/G3/G4> — <اسم الفيلم> — <التاريخ>
PASS: <عدد>  | FIX: <عدد>  | ASK: <عدد>
FIX 1 — <العنصر> — <البند> — الخيارات: (أ) ... (ب) ... — اختيارك؟
ASK 1 — <سؤال للمنظمين أو لمراجع بشري>
```

**Lock prompt**:
```
هل نعتمد الخطوة 0 (المحور، المدة، الجدول، رسالة المنظمين، خطة اختبارات اليوم الأول)
وننتقل إلى الخطوة 1: السيناريو والحوار (01-script-and-dialogue.md)؟ أم تريد تعديلات؟
```

---

## Gate (the user approves all of this before Step 1)

1. One film or two; if two, the stagger and both go/no-go dates.
2. Theme per film, and the rubric map.
3. Runtime budget and the current length estimate with cut candidates.
4. The calendar, including the collaborator's confirmed days and the three lock dates: script D3, animatic D7, picture D15 (D14/D16 in two-film mode).
5. The Organizer email: sent by the user, with the date logged.
6. The G1 flag table on the draft: acknowledged (decisions happen in 01).
7. The D1 risk-test plan and its spend.
8. Collaborator agreement: rights assignment and credit signed; named for the AI Disclosure (cl. 6.1(b)).
9. Acknowledgement of the holdback and the Organizer's perpetual licence (cl. 8.1, 8.4), and that the Summit cut is the Oscar cut.

Do not assume approval from silence or partial agreement. Wait for an explicit "اعتمد" or equivalent.

---

## Common failures

| Failure | Prevention |
|---|---|
| Planning to submit on 20 Nov | No closing hour is published; submit D19, keep D20–D21 empty |
| Treating "max 7 min" as the only limit | 5:00 minimum too; story 5:30–6:40, total ≤ 7:00 |
| Assuming the 70% is picture-only | The Terms say visual and audio; plan to R1+R2, keep R3 feasible, ask in writing |
| Title cards and credits on black | They eat the non-Seedance allowance; put them over Seedance plates |
| Drafts left to expire | Finalize or kill every approved draft before day 5 of its 7-day life |
| Losing outputs | URLs expire after 24 h; download in the same hour |
| Discovering the face block on D7 | T1 on D1; register every character before D7 |
| Fixing a moderation reject by rewording the same content | Change the content; re-run G1 on that beat |
| Two films sharing a world or characters | "Substantially similar" can disqualify both (cl. 5.2) |
| Posting a teaser or BTS clip | Holdback breach disqualifies (cl. 8.4, 13.1(g)) |
| Entering a festival "just to test" | Breaks cl. 5.3(b); festivals only after the Summit outcome |
| Re-cutting after the Summit for festivals | Academy excludes re-edited versions of publicly shown shorts |
| ElevenLabs Music on a self-serve plan | Film use needs an Enterprise licence per BRIEF.md; decide on D0–D2 |
| Fonts missing from the licence log | Fonts are named in cl. 5.5(c) |
| Exporting in a way that strips content credentials | T4 on D1; keep raw finals untouched |
| Collaborator not named or not assigned rights | Breaks cl. 6.1(b), 6.1(c); sign on D0 |
| Claude rewriting religious lines alone | Every religious line goes to a human reviewer |
| Trusting only the LLM judge panel | Real viewers on D15 (08-judge-panel.md) |

---

## Verification stamp and sources (checked 2026-10-30)

- Award page and Terms (last updated 12/10/2026): https://www.1billionsummit.com/ai-award-2027 and https://www.1billionsummit.com/ai-award-2027/terms-and-conditions — fetched today; clauses 1.1, 2.2, 4–9, 11.3, 13.1, 20.10 as cited.
- Oscars 99th Rule Eight (Animated Short) and Rule Seventeen (Live Action Short): https://www.oscars.org/sites/oscars/files/2026-05/99th%20Animated%20Short%20Rules.pdf, https://www.oscars.org/sites/oscars/files/2026-05/99th%20Live%20Action%20Short%20Rules.pdf — read today. 100th rules: not published (search today).
- UAE Media Council 20 content standards: Gulf News summary (June 2025), https://gulfnews.com/uae/uae-media-law-media-must-follow-20-key-standards-to-avoid-fines-of-up-to-dh1m-1.500157204 — secondary source.
- Seedance 2.5 draft (7-day draft validity, 480p draft, 1080p-only final), 24 h URLs, `watermark` default, 4–30 s at 24 fps: Comfy mirror of the BytePlus schema, https://docs.comfy.org/development/comfy-router/models/byteplus/dreamina-seedance-2-5-260628/code — third-party; BytePlus docs did not render. Conflicts with BRIEF.md (14 days): unresolved.
- Real-face rejection and asset library route: third-party guides (laozhang.ai, apiyi); verify in the BytePlus console.
- "Second Life" trademark: UDRP decision https://www.adrforum.com/DomainDecisions/1089130.htm and https://secondlife.com/corporate/brand-faq — current registration status not checked.
- Carried over from the user's own earlier skills (cinematic-pipeline: explicit lock prompts, no approval from silence, Arabic address; higgsfield-generate: quality first, no cost optimisation unless asked), paraphrased.
