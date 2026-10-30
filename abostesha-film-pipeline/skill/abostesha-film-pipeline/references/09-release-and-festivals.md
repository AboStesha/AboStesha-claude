# 09 — Submission, Holdback, Press Kit, Public Vote and the 2027 Festival Route (Step 9)

**Purpose.** Get the signed masters from 07-edit-mix-finish.md through the Summit form and the raw-clip verification without a single disqualifying slip. Then protect the film until 10 Jan 2027, run a clean public-vote campaign if it is shortlisted. Winning the AI Film Award 2027 is the only target (BRIEF). After 10 Jan 2027, send the film into other 2027 competitions and festivals and pitch it to international production companies and platforms as "Episode 0" of a 7-episode "Second Life" mini-series.
**Rule.** Claude prepares every text, file and checklist. The user types into the form, uploads, sends emails and posts. Claude never submits, never posts, and never tells the user something is "cleared" unless a filed document shows the basis.

Talk to the user in Arabic (Modern Standard Arabic, addressing them as أبوستيشا). Write form answers, press materials, Organizer emails and every image prompt in English. Make Arabic versions of the press texts only when 9.11 asks for them, and have a native reader check them.

Evidence labels used below: `[DOC]` official source with its date, `[3P]` a third-party listing, `[INFER]` inferred from the previous edition, `[HOUSE]` a production heuristic.

---

## Inputs

| Input | Where | Needed by |
|---|---|---|
| Signed masters, QC report, manifest, subtitles | `films/<id>/07-finish/masters/`, `qc/`, `subs/` (07 §7.12–7.13) | D18 |
| Shot ledger: shot, source tool, job ID, raw file, seconds in the cut | ledger-continuity-physics.md | D16 |
| Licence files (Suno plan, ElevenLabs Enterprise Music contract, font licences) | `evidence/licences/` (06, 07) | D16 |
| Authorship log, style decisions, Blender files, take logs | `evidence/authorship/`, 01, 02, 04, 05b | D16 |
| Collaborator agreement, any real-person consent | `evidence/consents/` (00 Gate item 8) | D16 |
| Organizer replies (the 70% email, 00 §0.9) | `evidence/organizer-correspondence/` | whenever they arrive |
| Judge-panel verdict and fix list | 08-judge-panel.md | D17 |
| Official intro already prepended | 07 §7.11 | D18 |

Working folder: `films/<id>/09-release/` with `form/ disclosure/ presskit/ vote/ festival/ pitch/`. Film 01 uses the file code `SLA`.

---

## Procedure

### 9.0 Re-check the rules (D16, D18, 15 Dec, 9 Jan)

1. Fetch the award page and the Terms. The snapshot here matches Terms "Last updated: 12/10/2026" `[DOC fetched 2026-10-30]`. If the date has changed, diff clauses 5.5, 5.6, 5.8, 8.1–8.4, 11, 13.1 and 14 and tell the user.
2. Re-read the live form. Its fields in 9.1 were read from the site's own form code on 2026-10-30. If a label, word limit or step has changed, update `form/form-answers.md` before the user starts typing.

### 9.1 The submission form, field by field (fill on D16, submit on D19)

The form has four steps: About you → Your film → AI & rights → Review & submit. It saves progress only "on this device", in the browser. The user fills it in one browser on one computer and does not clear that browser's data. `form/form-answers.md` is the source of truth: Claude writes every answer there first and the user pastes them in.

| Step | Field (live label) | Limit / rule | What goes in |
|---|---|---|---|
| 1 | First name, Last name | required | exactly as on their ID; the prize is paid only to an account in their own name (cl. 11.4(f), 12.2) |
| 1 | Email address | required | an inbox they check daily, spam folder included (cl. 11.1: notice counts "when sent"), until at least Feb 2027. The raw-clip link, evidence requests (7-day clock, cl. 5.5, 11.2, 13.3) and the shortlist news all arrive by email |
| 1 | Country of residence, Nationality, Mobile number | required, international format (+971…) | — |
| 1 | Portfolio or social media profile | required URL ("website, YouTube, TikTok, Instagram or IMDb") | a profile with **no** film material on it; the Organizer may use their handles (cl. 8.1(g)) |
| 2 | Film title | required | the title that passed 00's trademark check |
| 2 | Theme | one of: Society, Community & Humanitarian Issues · Truth, Fake News & Misinformation · Humans & AI · Climate, Nature & Our Changing Planet · Human Relationships | the theme locked in 00 §0.3 |
| 2 | Synopsis | **≤ 150 words**, counted on spaces; help text "What happens, who it is about and why it matters" | the jury version, 9.7 (S150-J) |
| 2 | Running time | mm:ss between 05:00 and 07:00, "not counting opening titles or rolling credits" | **story runtime only**, from 07's QC report (example: 06:22); never the total with intro, titles or credits |
| 2 | Link to the film | "An unlisted YouTube link, in horizontal format with English subtitles burned in or attached"; the official intro must play "at the very start" | master #1 or #2 from 07 §7.12, uploaded as in 9.1a |
| 2 | Link password | only if protected | leave empty for YouTube unlisted |
| 2 | Poster or key still | **required**, JPG/PNG/WebP, ≤ 10 MB, "Used if your film is shortlisted" | the key still from 9.7 (K1) |
| 2 | ☐ English subtitles are included | required | tick only after the subtitles are confirmed on the YouTube copy |
| 3 | AI models and tools used | **≤ 150 words**; "principal AI models and tools used across video, image, voice, music, sound and VFX" | the text from 9.2 |
| 3 | ☐ rights confirmed; ☐ no real likeness or voice without authorisation, nothing presented as authentic footage | required | tick only when 9.3 has no blank row |
| 4 | Consents: Terms; licence; accuracy; privacy (+ optional updates) | four required | the accuracy consent says inaccurate AI disclosure "may result in disqualification" |

After "Submit Your Film" the page shows a **Submission reference** and sends a confirmation email. A second stage, "Step 2 of 2", then opens: the raw Seedance clip upload (9.4). Screenshot every step and the success page into `evidence/submission/`.

**9.1a The YouTube copy.**
- Upload master #2 (ProRes, same content as #1) when bandwidth allows; otherwise #1. Either way it carries the intro, the film and burned-in English subtitles. A non-AI 2160p upscale in Premiere for a higher YouTube bitrate is optional `[HOUSE]` and is 07's decision.
- Visibility **Unlisted**, never Public, and not in any public playlist. Comments off, no monetisation, embedding allowed.
- "Made for kids": No. A G-rated film is not automatically "made for kids" in YouTube's sense.
- Answer the **altered or synthetic content** question **Yes**. YouTube requires disclosure of realistic AI content and auto-labels it since May 2026 `[DOC blog.youtube, May 2026]`. This also keeps cl. 5.6 (labelling) clean.
- Wait for HD processing to finish, then test the link logged out, on another device, at 1080p (07 §7.13).
- After submitting, never delete, trim or replace the video: a new upload means a new URL. Links must stay "accessible, unaltered" until the Award closes (cl. 5.8), and the success page asks that the link "stays live". A fix after submission goes to the Organizer by email first.

### 9.2 The AI disclosure: form text + full table + share figures

The form gives 150 words; cl. 5.5(a) asks for every model, tool, platform and version, the accounts used and each tool's share. Do both:

**A. Form text (≤ 150 words).** Worked example for film 01 (130 words; fill the bracketed facts from the ledger and licences, then count with `wc -w`):
```text
Video: Dreamina Seedance 2.5 (dreamina-seedance-2-5-260628) via BytePlus ModelArk and Higgsfield,
primary tool, <93.4>% of picture; every moving shot, draft then 1080p final. Images, used only as
Seedance references, never shown as shots: GPT Image 2.5 Sunburst, Nano Banana Pro, Nano Banana 2.1,
Midjourney V8.2. Voices: ElevenLabs Eleven v4, fully synthetic designed voices, no real-person clones;
lip-sync rendered by Seedance. Music: Suno v6 (<plan>) and ElevenLabs Music v2.5 (Enterprise Music licence).
Sound effects: Seedance native audio, code-synthesised effects (non-AI) and ElevenLabs SFX v2.
Post: Adobe Premiere Pro (human edit, grade, mix, subtitles). Blocking: Blender <5.1> greybox, keyframed
by hand, used only as motion reference, never on screen. Writing support: Claude (Anthropic) gave
script notes; the screenplay is human-written. Full per-tool table with versions, accounts, shares
and job IDs is ready on request.
```
Every clause must be literally true for this cut. If an upscaler, a cleanup model (07 §7.5) or Higgsfield `upscale_image` touched a frame, name it. Also name Claude if it drafted subtitle translations. If no Higgsfield job reached the cut, drop "and Higgsfield". For every third-party route (Higgsfield, the ElevenLabs connector), record in table B the Seedance version string that platform showed, because cl. 5.5(a) asks for "the version of Seedance accessed through it".

**B. Full disclosure table** (`disclosure/SLA_disclosure_full_vNN.md` → PDF, kept ready to send within hours):

| # | Used for | Tool | Exact model / version | Route / platform | Account (ID or masked email) | Plan / licence file | Dates used | In the final film as | Share |
|---|---|---|---|---|---|---|---|---|---|
| 1 | final picture | Dreamina Seedance 2.5 | `dreamina-seedance-2-5-260628`, draft → 1080p final | BytePlus ModelArk API | <BytePlus account ID> | <plan>, `licences/byteplus.pdf` | 6–13 Nov 2026 | every moving shot | 93.4% picture |
| 2 | reference images | GPT Image 2.5 | `gpt-image-2.5-sunburst`, quality max, 4k | Higgsfield / ElevenLabs connector | <account> | <plan> | … | references only | 0% picture |
| … | voices · music · SFX · upscale · edit · writing notes | … | … | … | … | … | … | … | per stem |

**C. Share figures** (from the ledger; the Organizer's method is unpublished, cl. 5.4):
```text
T = titles + story + credits                       = 412 s (6:52)   intro excluded (unconfirmed, 00 §0.9)
Seedance picture seconds                           = 385 s  → 385 / 412 = 93.4 %
Non-Seedance picture (text on black, other models) =  27 s  →   6.6 %
Audio, per stem (stem-seconds): DX ElevenLabs v4 100 % (original takes laid in, 07 §7.7; Seedance drew only the lips) · FX Seedance 61 / code 22 / ElevenLabs 17 · MX Suno <x> / ElevenLabs <y>
```
Use the same numbers in the form, the full table, the credits and every later statement (cl. 11.8 forbids inaccurate public statements).

### 9.3 Licences, consents and likeness declarations (cl. 5.5(c), 5.5(d), 7.4, 7.5)

One row per non-AI or third-party element and one row per voice and face. Adapted from calesthio's rights map (MIT): never write "cleared". Write "approved for this release under the documented assumptions", with the date and the document.

| Element | Origin (AI tool / non-AI) | Source | Licence or permission | Proof file | Covers worldwide, perpetual, sublicensable use (cl. 8)? |
|---|---|---|---|---|---|
| Score cue M03 | Suno v6 | song ID … | <plan> terms on gen date | `licences/suno-plan-2026-11-08.pdf` | Y / ask |
| Procedural SFX bank | non-AI, code | `06-sfx/code/` | own work | authorship log | Y |
| Fonts: Noto Sans, Noto Naskh Arabic | non-AI | Google Fonts | SIL OFL 1.1 | `licences/OFL.txt` | Y |

| Character / voice | Face | Voice | Real-person basis | Consent file |
|---|---|---|---|---|
| Miraj | synthetic (GPT Image 2.5 → Seedance) | synthetic (ElevenLabs Voice Design) | none | — |
| Noah | synthetic robot | synthetic | none | — |

Any row with a real-person basis needs signed consent, or the shot is cut. That includes the user's own face or voice, and the collaborator's.

### 9.4 Raw Seedance clip upload ("Step 2 of 2"), the same day as submission

The live form says: "Upload the raw Seedance clips you used — the original files, before editing, colour grading or effects", the "raw clips behind at least 70% of your film". It accepts MP4 and MOV only, and warns: "once you do, you cannot add or remove any" `[DOC form code 2026-10-30]`. The page is also reached from an emailed link, which can expire: always use the newest email. Its closing date is shown only once the page is open ("Uploads closed on…"), so upload within hours of submitting.

1. **Select.** Take every Seedance clip whose frames appear in the cut, as the 1080p files originally downloaded (05, ledger download routine). This includes the plates under titles and credits, and the outputs of Seedance edit, bridge and extension tasks (07 §7.5). Leave out rejected takes and unused drafts. Copy them with `cp -p` into `evidence/raw-seedance/upload/`. Keep the ledger file names: they already carry the shot ID (ledger L.1), so do not rename anything.
2. **Prove they are untouched.** Every file must be byte-identical to a download logged in the ledger's daily checksum files `[TESTED bash + ffprobe 6.1]`:
   ```bash
   cd films/01-second-life-ascent && mkdir -p evidence/manifests
   cat ledger/reports/SLA_checksums_*.sha256 > evidence/manifests/raw-download-sha256.txt
   cd evidence/raw-seedance
   sha256sum upload/* > ../manifests/upload-sha256.txt
   # must print NOTHING; any hash printed is a file that is not an untouched download
   comm -23 <(cut -d' ' -f1 ../manifests/upload-sha256.txt | sort -u) <(cut -d' ' -f1 ../manifests/raw-download-sha256.txt | sort -u)
   for f in upload/*; do printf '%s,' "$f"; ffprobe -v error -show_entries format=duration -of csv=p=0 "$f"; done > ../manifests/upload-durations.csv
   du -ch upload/* | tail -1                                  # total size → plan bandwidth
   ```
3. **Map.** Keep `raw-clips-map.csv` (shot, file name, sha256, task ID, TC in/out in the cut, seconds used) ready to email.
4. **Coverage.** Sum of seconds used from the uploaded clips ÷ T ≥ 0.70. The plan target is the ledger's ~90%.
5. **Upload.** Use a wired connection and keep the page open; press Retry on failures. Compare the page's count with the CSV, and only then press **Finish upload**. Screenshot "Your clips are in." into `evidence/submission/`.

### 9.5 Process-evidence archive and the 7-day drill (cl. 5.5(b))

The Organizer may ask for "prompts, project files, timelines, shot logs, image or video generation history" and edit files. Failure to supply them "within 7 days of request may lead to disqualification", and they must be kept "for 24 months after the Award closes" `[DOC Terms 12/10/2026]`. The Terms define the Award Period as ending at the winner announcement (cl. 1), so take the Award as closing on 10 Jan 2027 `[INFER]` and keep everything until at least 10 Jan 2029. In practice keep it permanently: festivals may ask about human authorship (9.13), and series buyers will ask for chain of title (9.12).

```text
films/01-second-life-ascent/evidence/
  00-INDEX.md                 one line per folder: what it proves, which clause, last updated
  disclosure/                 full table (9.2B), form text (9.2A), seedance-share.csv, audio-origin.csv
  raw-seedance/               byte-identical downloads + upload/ (9.4); never re-encoded
  prompts/                    every prompt per tool, dated, with job/task ID (01–06 logs)
  generation-history/         exports or screenshots of BytePlus task lists, Higgsfield, ElevenLabs,
                              Suno libraries, Midjourney job IDs (Stealth on, 03)
  project-files/              .blend versions, .prproj versions, EDL + FCP XML (07 §7.4)
  shot-logs/                  ledger exports (ledger-continuity-physics.md)
  licences/  consents/        9.3
  authorship/                 9.13
  organizer-correspondence/   every email as PDF
  submission/                 form-answers.md, step screenshots, reference, raw-clip receipt
  manifests/                  manifest-sha256.txt for all of the above
```

- **Backups:** three copies on two kinds of media, one off-site `[HOUSE]`. Example: the working drive, an external SSD, and a cloud folder that is not publicly shared. Run `sha256sum -c manifests/manifest-sha256.txt` after each copy and then every quarter.
- **Provenance:** run `c2patool <file>` (if installed) on three raw clips and the masters, and file the output (00 test T4). Never re-encode anything inside `raw-seedance/`.
- **Prompt scan before sending** (adapted from video-qa, MIT): grep the prompt archive for real brand names, real people's names and music or lyric words. Edit nothing: evidence goes out as it is. The scan only tells the user what the Organizer will read.
- **7-day drill on D18.** Pretend a request arrived. Build `SLA_evidence-pack_vNN.zip` from the index within 2 hours, verify its manifest, and time it. If it takes longer than one working day, fix the index now.
- **When a real request arrives:** log its date and time and set the deadline (request + 7 days, GST). Send within 48 hours as a view-only cloud link that does not expire for at least 30 days, or through the Organizer's channel. Keep a copy of exactly what was sent, with its manifest.

### 9.6 Holdback: what can and cannot happen before 10 Jan 2027

Clause 8.4 [DOC]: unless the Organizer agrees in writing, until the Winner is publicly announced (or, for a film not selected, until the Organizer notifies the applicant), the applicant must not "publicly release, publish, stream, screen or distribute the Film", nor publicly reveal a shortlisting. Breach is a disqualification ground (cl. 13.1(g)). Every applicant must also keep "the status of their Application" confidential (cl. 14.1), and finalists must keep results confidential until the Organizer announces them (cl. 11.7).

| Never, without the Organizer's written OK | Allowed |
|---|---|
| The film, any clip, trailer, teaser, still, frame, poster or key art in public, including "Close Friends", Discord servers, group chats with strangers, portfolios and showreels | Private test screenings for named viewers who have been asked not to share (00 §0.7, D15) |
| The score, the dialogue or any sound from the film; saying publicly that they have entered (cl. 14.1 makes the application's status confidential: ask with E2 first) | Telling named private-screening viewers that the film is for the award |
| BTS that shows film frames or sound, or side-by-sides of Blender and Seedance | General AI-filmmaking posts that contain nothing from this film's world, characters or look |
| Saying "Top 10", "shortlisted" or "finalist" before written permission, or "Top 5"/"winner" before the Organizer announces it | Building the press kit, DCP, festival plan and pitch deck privately |
| Entering **any** festival or competition, including ones that only screen after January (warranties are repeated at every stage, cl. 5.3(b), 6.1). Example: Stuttgart ITFS 2027 shorts closed 15 Nov 2026 `[3P]`; it is lost to this film. | Researching festivals, filling FilmFreeway/Shortfilmdepot profiles as drafts without submitting |
| Exclusive deals, options or distribution agreements (cl. 6.1(h)) | Pitch conversations about the series idea that show nothing from the film |
| Generating with Midjourney without Stealth; online frame grabbers or converters; public "community" feeds of any tool | Private tools under the user's accounts; uploading to Gemini (watch 0.3.x, 08) only with their explicit consent |
| Making the YouTube link public, or sharing it beyond the Organizer and private test viewers | Keeping the link unlisted and live |

When in doubt, the answer is "not yet", and the question goes to the Organizer in writing (template E2 below).

### 9.7 Press kit (written D19–14 Dec; nothing public before the holdback ends)

The core texts are written for the user, from their own words, and logged in the authorship log (origin H or H/C, 01). Every claim must match the disclosure.

| ID | Item | Spec | Notes |
|---|---|---|---|
| L | Logline | ≤ 30 words, no character names | AlterLab (MIT): "When [situation/inciting incident], a [specific protagonist] must [action with stakes], or [consequence]. Maximum 30 words. No character names — use descriptive identifiers." |
| S25 | Catalogue line | ≤ 25 words | no ending |
| S50 | Programme synopsis | ≤ 50 words | no ending |
| S150 | Press synopsis | ≤ 150 words | setup, escalation, dramatic question; no ending |
| S150-J | Jury synopsis | ≤ 150 words | full arc and "why it matters"; the Summit form and festival juries that ask for it |
| DS | Director's statement | 250–400 words, first person, 3 paragraphs | AlterLab (MIT): origin → approach → ambition; "Honest, specific, not grandiose" |
| AI | "How it was made" | 150 words and 400 words | what humans decided, what each tool rendered, the Seedance share; no "100% AI", no "no humans involved" |
| B | Director bio | 100–150 words, third person | facts only |
| K1 | Key still | 16:9, ≤ 10 MB, textless | the Summit form upload |
| K2 | Poster one-sheet | 2:3 (27×40 in sheet), 2000×3000 px minimum, with title and billing block | festivals, platforms, pitch |
| ST | Stills | 8–12 frames, 1920×1080 PNG, captioned | from the clean master |
| SP | Specs and credits | runtime, 2026, 16:9, 24 fps, sound format, languages, subtitles, country | matches 07's QC report |

**Worked examples, film 01** (drafts for the user to rewrite; nothing here is locked):
```text
L   (28 words) In a future Dubai that sells dreams by the minute, a migrant repair worker must stop
    escaping into them when his mother needs heart surgery he cannot afford.
S25 Dubai, the near future. Miraj fixes robots by day and buys minutes of dreams by night, until a
    call about his mother forces him awake.
S50 In near-future Dubai, the world's first robot trillionaire sells tired workers dreams by the
    minute in 2nd Life booths. Miraj, a young robot repairman, spends every coin on those minutes.
    When his mother needs heart surgery he cannot afford, he must stop escaping and build a real
    second life.
```
Avoid any phrasing that makes the robot, or anyone, the ruler of Dubai or the UAE. Keep the city admirable and the institutions respected (00 content standards).

**S150-J skeleton:** world + protagonist (≈40 words) → inciting call + the 6,300 stake (≈40) → the turn: Kabir gives 630 and refuses to rescue him (≈35) → payoff + why it matters for the chosen theme (≈35). Check it with `wc -w`.

**Director's statement interview.** Claude asks in Arabic and keeps the answers verbatim in `evidence/authorship/09-ds-interview.md`:
1. لماذا هذه القصة الآن؟ ما الذي رأيته أو عشته وجعلك تكتبها؟
2. من هو معراج بالنسبة لك؟ هل تعرف أشخاصاً مثله؟
3. ما القرار الإخراجي الذي تفخر به أكثر، وما البديل الذي رفضته؟
4. لماذا الذكاء الاصطناعي بالذات لهذه القصة؟ ما الذي لا تستطيع الكاميرا التقليدية فعله هنا؟
5. ما الذي فعلته أنت بيدك في كل مرحلة (الكتابة، الحركة في Blender، اختيار اللقطات، المونتاج)؟
6. ماذا تريد أن يشعر به المشاهد عند آخر لقطة؟
Draft the English from their answers: paragraph 1 from Q1–2, paragraph 2 from Q3–5, paragraph 3 from Q6. AboStesha edits it, and the authorship log records the origin.

**K1 key still** (Summit form):
- Take it from the graded clean master (07 #3), never the burned-subtitle master. It is a real Seedance frame, so nothing new needs disclosing.
- Keep the subject inside the centre square so the Organizer's 1:1 or 4:5 crops survive. No text.
- Pick a G-safe frame: no injury, no substances, no brand-like signage.
- Export from Premiere (*Export Frame*, PNG) on the clean sequence, or with a correct BT.709 conversion `[TESTED ffmpeg 6.1]`:
```bash
ffmpeg -ss 00:03:12.500 -i SLA_clean_xx_16x9_6m52s_prores422hq_v05_20261117.mov -frames:v 1 \
  -vf "scale=in_color_matrix=bt709:in_range=limited:out_range=full,format=rgb24" SLA_keystill_16x9_v01.png
ffmpeg -i SLA_keystill_16x9_v01.png -q:v 2 SLA_keystill_16x9_v01.jpg      # use if the PNG exceeds 10 MB
```
Inspect it at 200% for hand, text and face artefacts. Do no AI retouching. If a retouch is unavoidable, disclose it and keep the original.

**K2 poster.** Make it from the film's world, never something the film does not contain.
- Route A: extend a Seedance frame to 2:3 with a disclosed outpaint.
- Route B: build key art from the locked references (03), with the prompt card below. Set typography by hand (Photoshop or Express) with licensed fonts (log them, cl. 5.5(c)); never AI-rendered lettering.
- Arabic title RTL, checked by a native reader.
- Billing block in text only: "Written and directed by AboStesha · Blender blocking <name> · Made with Dreamina Seedance 2.5 · © 2026 <full name>". No Summit, Partner or tool logos without permission (00 R2).
```text
MODEL gpt_image_2_5  variant=sunburst  quality=max  resolution=4k  aspect=2:3  takes=3   (syntax: 03-assets-images.md)
REFS  @MIRAJ_face_lock (03) · @LOC_booth_master (03) · SLA_keystill_16x9_v01.png
[STYLE PREFIX: prefix/gpt-image.txt]
Vertical film poster key art. No text, no letters, no numbers, no logos anywhere in the image.
SUBJECT: <Miraj, descriptors copied from the locked character sheet>, seated in a narrow 2nd Life dream booth,
  eyes closed, a thin chrome neural crown on his forehead, tired work uniform, a faint line of sweat at the temple.
TWO WORLDS: lower half is the real booth, harsh noon light through a slatted door, worn plastic, dust in the air;
  upper half is his dream rising out of frame, a calm, impossible Dubai skyline folding upward like paper in soft dawn light.
COMPOSITION: subject centred in the lower third; clean negative space in the top 20% for the title and the bottom
  12% for the billing block; horizon line at mid-height.
CAMERA: 50mm, eye level, shallow depth of field, physical lens look, fine film grain.
IDENTITY: keep his face identical to @MIRAJ_face_lock: face shape, eyes, skin texture, hairline.
AVOID: text, watermarks, logos, signage, extra fingers, plastic skin, flares, weapons, anything frightening.
⚠️ Watch: lettering hallucinated into signage, crown merging with hair, hand count, skyline landmarks that copy a real building's trade dress.
```
Midjourney V8.2 alternative, for environment-only key art (Omni Reference is V7-only, so do not put a character face in it). The user runs it with Stealth on: `<prompt without the character> --v 8.2 --raw --ar 2:3` (03).

**Stills (ST).** Choose 8–12 frames: two per act plus the strongest dream-world image, which shows AI Integration. Mark any frame that reveals the ending "jury only".
- Caption: `Still from 2nd Life: Ascent (2026), dir. AboStesha. AI-generated image (Dreamina Seedance 2.5).`
- Native 1920×1080. When a festival wants print-size stills, use a disclosed upscale (Higgsfield `upscale_image`, 03), not a fake "300 dpi" relabel.

**Folder rule** (cinetic, MIT): "A client opens the folder before they open the film". Put the deliverables at the top of `presskit/`: PDF, poster, key still, stills, bio photo. Keep sources and working files in `presskit/_work/`. A short press check with 08-judge-panel.md's first-time-audience persona asks one question: would you press play after this logline?

### 9.8 Public-vote campaign from 15 Dec (only inside the rules)

The award page says only that the Top 10 and public voting begin on 15 Dec 2026 and that "Audiences vote for their favourite film". The platform, voter rules and weighting are unpublished `[DOC 2026-10-30]`. Finalists must "comply with the Organizer's instructions on publicity, holdbacks and embargoes" (cl. 11.3(c)).

1. **Before 15 Dec:** build the kit privately: K1, K2, captions in Arabic and English, a 9:16 card template, and a list of communities. Nothing is posted.
2. **The shortlist email arrives** ("Shortlisted creators will be contacted by email"). Same day, the user sends template E1. No post goes out until written permission arrives, because cl. 8.4 forbids revealing a shortlisting even after the Organizer's own announcement.
3. **After written permission**, post only what it covers:
   - Lead with the Organizer's official voting link and the Organizer's own posts and clips; the Organizer holds the clip and trailer rights under cl. 8.1(d).
   - Make own clips only if E1's answer allows them. Lay them out for 9:16, never crop the master (cinetic, MIT: "Re-lay out; never crop"). Put the 16:9 picture inside the feed's safe band: top 270, right 120, bottom 420, left 64 px at 1080×1920 (cinetic `feed9x16` defaults; band centre y ≈ 885). That gives 896×504 at x 64, y 633 `[TESTED ffmpeg 6.1]`:
   ```bash
   ffmpeg -i SLA_vote-clip_approved.mov -vf "scale=896:-2:flags=lanczos,pad=1080:1920:64:633:color=0x0B0B0F,setsar=1" \
     -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
     -c:a aac -b:a 256k SLA_vote-card_9x16_v01.mp4
   ```
   A full-width variant (`scale=1080:-2`, `pad=1080:1920:0:581`) is bigger, but the action rail covers its right 120 px below y ≈ 840. Use it only when nothing important sits at the picture's right edge.
   Add the Arabic and English text in Premiere, not ffmpeg (Arabic shaping), inside the same safe band.
   - Turn on the platform's AI-generated label on every post that shows film material. TikTok requires labels on realistic AI content (calesthio citing TikTok Support, verified 2026-07-10).
4. **Integrity rules.** The applicant warrants that they have not "offered, given, or received anything of value to influence the judging" (cl. 6.1(j)). The Organizer may also disqualify for "manipulation of the judging" (cl. 13.1(d)) or conduct that brings it into disrepute (cl. 13.1(f)). Treat the public vote as part of the judging `[INFER]`: no bought votes, bots, vote-exchange groups, multiple accounts, or giveaways and prizes for votes; no paid ads unless the Organizer approves; no attacks on other finalists.
5. **Audience** (show the user; they choose): Arabic and English AI-film communities, Dubai and UAE residents, South Asian worker communities approached with respect (the film is about them, not at them), and their existing followers. Each post gives one emotional line from the film's theme and the official link.
6. **Rhythm:** one post on announcement day, one mid-week, one 48 hours before voting closes (date per the Organizer), and a thank-you. If 25 Dec brings Top 5 news privately, say nothing until the Organizer announces (cl. 11.7).

### 9.9 Finalist and Summit obligations (25 Dec – 10 Jan)

- **7-day replies.** Answer every finalist or winner notice, and return the documents it asks for, within 7 days, or the Organizer may disqualify and replace (cl. 11.2). Verification can ask for ID, a signed declaration, the AI Disclosure, process materials, project files and the master files (cl. 11.4): send them from the 9.5 archive.
- **Screening file** "in the format required" (cl. 11.3(a)). Ask the spec in E1. Have ready: ProRes 422 HQ with intro and burned EN (07 #2), the clean ProRes (#3), and a tested SMPTE DCP (9.11). Carry them on two drives plus a cloud copy.
- **Availability** for promotion, interviews and the Summit, "subject to travel and visa arrangements" (cl. 11.3(b)). Check visa needs for Dubai, 8–10 Jan 2027, now. Travel is paid only if agreed in advance in writing (cl. 11.8).
- **Talking points** (Arabic + English, 60 s each): what the film is about, what they did by hand, what Seedance made possible, and the figures from 9.2C exactly. No claim the disclosure cannot back. Never disparage the Organizer (cl. 11.8).
- **Winner:** publicity on reasonable request for up to 12 months (cl. 11.8). Verification, bank and tax details within 30 days of request, or the prize is forfeited (cl. 12.6). The Organizer can claw the prize back for 24 months after payment, and at any time for misrepresentation (cl. 13.5), so the disclosure must stay true.
- **After the announcement**, finalists and the winner must "include the credit and Award mark the Organizer provides, in the form the Organizer requests" on later distribution (cl. 8.4). Propose a separate card before the film's first frame, so the locked Summit cut itself stays unchanged (9.10). Get that form approved in writing.

### 9.10 After the holdback: choose the premiere branch

The holdback ends at the winner announcement (10 Jan 2027) or, for a non-selected film, when the Organizer **notifies** them. If the Top 10 is announced without their film and no notice arrives, send template E3 and wait for a written answer before anything goes public.

| Branch | Situation on 10 Jan | Premiere status | Strategy |
|---|---|---|---|
| A | not shortlisted; film never public | world premiere intact | Protect it. AlterLab (MIT): "Premiere status is sacred — never submit to lower-tier festivals before hearing from top-tier targets." Submit first to the festivals with premiere value (Tribeca, Annecy, Zagreb, Palm Springs). Delay AI-festival screenings that would spend the premiere until those answers arrive. |
| B | Top 10; film shown online for the vote | world premiere spent online | Target festivals without premiere or online rules (Annecy's 2026 terms had none; check each). Ask the Organizer where the film is public and for how long, and request unlisting after 10 Jan (E1 item 5). |
| C | Top 5 or winner; screened at the Summit, 9 Jan | spent (online vote, then the Summit screening). The award page says the Top 5 "premiere at the Summit"; write "World premiere: 1 Billion Followers Summit, Dubai" only if the film was not public online before 9 Jan (E1 item 5) | Use the award as the credential. Award card per 9.9. Then the B list, plus regional premieres (Cairo, Beirut) where those festivals value them. |

**Which cut.** The Summit cut is locked for the Summit: no change while the Award runs. After 10 Jan 2027 (end of the holdback, cl. 8.4) a festival re-edit or an "Episode 0" re-edit is allowed. By default, festivals get the Summit cut, minus the Summit intro, plus the Award card where required. Oscar background only: the Academy excludes "alternate or re-edited versions" of shorts already shown publicly (00 §0.11), so a re-edit would affect Academy eligibility, which matters only if the Oscars ever become a target.

### 9.11 The 2027 festival route (decide on 10 Jan; re-verify every row then)

Winning the AI Film Award 2027 is the only target; the Oscars are not a target (BRIEF). After 10 Jan 2027 the route serves visibility, further competition wins and the "Episode 0" series pitch. The "99th-list qualifying award" column is Oscar background only: it records which awards are on the Academy's Short Films Qualifying Festival List (99th list, updated 10 Apr 2026 `[DOC]`). The Summit, Red Sea, El Gouna and any UAE festival are not on it.

| Festival | 2027 dates | Deadline (status) | 99th-list qualifying award | Premiere / online / AI rules | Fit |
|---|---|---|---|---|---|
| Annecy | 13–19 Jun `[3P]` | ~15 Feb 2027 `[INFER: 2026 was 15 Feb]`; €30 in 2026 | Cristal for a Short Film; Best Jury Award – Short Films Competition | 2026 terms: "frame-by-frame" animated works, any technique; completed after 1 Jan of the previous year; links downloadable and live to mid-July; DCP unencrypted; no premiere rule found. Gen-AI films selected 2024–25; a 2026 petition opposed AI `[3P 3dvf]`. Ask in writing whether a Seedance film is eligible. | A, B, C — top priority |
| Animafest Zagreb | June `[INFER]` | ~1 Feb 2027 `[INFER]`; free in 2026 | Grand Prix | completed after 1 Jan of the previous year (2026 rule); AI policy unknown | A, B, C |
| Tribeca | 3–12 Jun `[DOC press release 30 Sep 2026]` | shorts: early 28 Oct and official 2 Dec 2026 fall inside the holdback; use the extended deadline, 3 Feb 2027 `[DOC same release]` | Best Animated Short Film Award; Best Narrative Short Film | older rules: at least NY premiere and not freely online in the US `[3P, 2019/2022 rules]` | A only |
| Palm Springs ShortFest | 22–28 Jun `[3P]` | ~7 Feb 2027 `[3P]` | Best of the Festival; Best Animation Short | premiere rule not found | A, B, C |
| Seattle IFF | May `[INFER]` | check | Grand Jury Prize for Animated Short Film | check | A, B |
| Melbourne IFF | Aug `[INFER]` | check | Best Animation Short Film | check | B, C |
| Ottawa (OIAF) | Sept `[INFER]` | ~31 May 2027 `[INFER: 2026 closed 31 May]` | Grand Prize for Best Short Animated Film | check AI policy | B, C |
| Clermont-Ferrand 2028 | late Jan 2028 | 2027 edition closed 24 Sep 2026. If 2027 rules repeat: films completed after 1 Oct 2026, entry ~Jul–Sep 2027 `[INFER]` | Grand Prix (International), category-neutral | 2027 rules `[DOC]`: no premiere status required; AI use disclosed at submission; no simulated real person without consent; films with entirely AI-generated images limited to one per person; DCP with non-burned XML/MXF English subtitles | all |
| Cairo IFF | Nov `[INFER]` | check | Youssef Chahine Award for Best Short Film | check regional premiere | C |
| Beirut Shorts | check | check | Best Short Animation; Best Short Live Action (Fiction) | check | C |
| WAIFF Cannes (AI) | final 6–7 Apr `[3P]` | direct 15 Feb 2027; WAIFF LA 20 Jan 2027 `[3P]` | not qualifying | AI showcase; screening spends premiere in branch A | B, C |
| AI for Good Film Festival (ITU/UN) | Geneva, June `[3P]` | 1 May 2027; completed 1 Sep 2026 – 1 May 2027; 1–10 min `[3P]` | not qualifying | fits a 2026 completion | B, C |
| Runway AIFF | not published | check | not qualifying | 2025 rules required generative video elements; check whether Runway use is required | B, C if allowed |

Never submit anywhere before the holdback ends, even when a deadline falls earlier (9.6). Budget is open, so enter every fitting festival, but in premiere order. Use the same completion date (picture lock, Nov 2026), country, languages, runtime and AI statement on every platform: FilmFreeway, Shortfilmdepot (Clermont), Eventival (Tribeca) and Annecy's own platform.

### 9.12 Festival deliverables, and the Episode 0 pitch

**DCP** (build in the quiet weeks, 21 Nov – 14 Dec; DCP-o-matic stable 2.18.51, 16 Oct 2026 `[DOC dcpomatic.com]`):
- Source: the clean master (07 #3), no intro and no burned subtitles, plus a 5.1 or at least L/C/R mix (Oscar background only: a stereo L/R mix would not meet the Academy rule, 07). Derive the 5.1 from the stems `[HOUSE]`: DX to C; MX to L/R with a little in Ls/Rs; FX panned by screen position; ambience to Ls/Rs; LFE only for designed lows. Check it in a calibrated room.
- Settings: Standard **SMPTE** (Academy: SMPTE ST 429-2; RDD 52/Bv2.1 recommended). Container **Flat 1998×1080**; the 16:9 picture sits pillarboxed inside. 24 fps, 48 kHz/24-bit audio, **unencrypted** (festivals want no KDM).
- Subtitles: English SRT added as a separate subtitle asset with "burn into image" off (Clermont requires non-burned XML/MXF); add FR/AR tracks when a festival asks.
- Naming: DCP-o-matic's ISDCF name generator with content type SHR.
- Verify with DCP-o-matic's verifier, then play it once on a real cinema server (book 30 minutes in a screening room). Keep the DCP and its checksum in `festival/dcp/`.

**Screeners:**
- One private link per festival, so each can be revoked later. Downloadable when the festival requires it (Annecy 2026 did).
- No intro, burned English subtitles, Award card per 9.9 when applicable. File it as `SLA_screener_en-burned_16x9_<dur>_h264-1080p24_vNN_<date>.mp4` (07 naming).

**Episode 0 pitch** (only after the holdback ends, 10 Jan 2027, cl. 8.4; for a private meeting before then, ask the Organizer first). Pitch to international production companies and platforms: the film is "Episode 0" of a 7-episode "Second Life" mini-series.
- The submission itself stays one complete standalone story: never retitle the submitted film, and never call it a pilot or an episode, or put "Episode 0", "pilot" or a series name in the Summit form, its credits or any Summit material. "Episode 0" is pitch language for after the holdback; a separate "Episode 0" re-edit is allowed then (9.10).
- Rights: the user keeps ownership of the film (cl. 7.1); the Organizer's licence is non-exclusive, and the user may monetise the film after the Award closes (cl. 8.2–8.3).
- One-pager: series logline and seven one-line episodes.
- Pitch deck, 12–15 slides: world rules (2nd Life minutes, Mamo city, Noah), characters, tone, the film as proof of concept, pipeline speed and cost per finished minute, team.
- The film on a private link, the director's statement, and the press kit.
- **Chain of title:**
  - authorship log and the collaborator's rights assignment;
  - each tool's output-ownership terms on the generation dates;
  - the Organizer's perpetual non-exclusive licence (cl. 8.1, 8.2), which buyers must be told about. Any exclusive deal must carve it out.
- **Title:** "Second Life" is a Linden Research trademark (00 §0.10). Clear it, or rename the series, before pitching.

### 9.13 Human-authorship archive

The Organizer may ask for process evidence (cl. 5.5(b), 9.5), and festivals and series buyers will ask what humans decided; every press claim (9.7) must rest on this dossier. Oscar background only: the Academy weighs "the degree to which a human was at the heart of the creative authorship" (Rule Two ¶7; 00 §0.11). Close the dossier on D18 and add to it after every festival.

| Claim | Evidence (path) | Measure |
|---|---|---|
| Screenplay human-written | `authorship/` v0 hash, drafts, `authorship-log.md` | C-origin dialogue lines = 0 |
| Human-made motion drives the primary subjects | `.blend` files with hand-set keyframes (04); playblast beside its Seedance final, one per shot; `side-by-side.mp4` | blocked shots ÷ all shots; seconds driven by keyframed blocking ÷ story runtime |
| Human performance direction | 05b take logs, notes and selects | takes reviewed / approved |
| Human design choices | 02/03 selection boards with rejected options and sign-off | options per approved asset |
| Human edit, sound and grade | `.prproj` versions, EDL/XML, mix and grade notes (07) | versions, dated |
| Human music seed | hummed motifs (06) | files, dated |

The statement (`authorship/SLA_human-authorship-statement_vNN.pdf`, one page) covers the same six points, in their words, with the figures. It ends: "Generative tools rendered images, motion and sound under these decisions; see the AI Disclosure." Never overstate: if a shot was not blocked, it does not count.

---

## Output templates (what Claude shows the user)

**T1 — Submission card (D18)**
```text
أبوستيشا، ملف التسليم جاهز — <اسم الفيلم>
• الإجابات: form/form-answers.md (الملخص 1xx/150 كلمة · الإفصاح 1xx/150 كلمة · المدة <06:22> للقصة فقط)
• رابط YouTube: غير مُدرَج (Unlisted)، المقدمة الرسمية أولاً، الترجمة الإنجليزية ظاهرة، 1080p مُختبَر من جهاز آخر ✔
• الصورة/الملصق: SLA_keystill_16x9_v01.jpg (<x> MB ≤ 10) ✔
• المقاطع الخام: <N> ملفاً، <GB>، تغطي <93.4>% — مطابقة البصمة: OK ✔
• الأرشيف: تمرين الأيام السبعة تم في <hh:mm> ✔
قرار مطلوب: هل تعتمد هذه الإجابات لتلصقها في النموذج غداً (D19) ثم ترفع المقاطع الخام فوراً؟
```

**T2 — Holdback card (pinned until 10 Jan)**
```text
⛔ حتى إعلان الفائز (10 يناير 2027) أو إشعار مكتوب من المنظمين:
لا مقاطع · لا صور · لا ملصق · لا موسيقى · لا كواليس من الفيلم · لا "شاركتُ في الجائزة" · لا "وصلنا للقائمة" · لا مهرجانات
✔ مسموح: عروض خاصة لأشخاص محددين · تجهيز الـ press kit والـ DCP وخطة المهرجانات بشكل خاص
عند الشك: نسأل المنظمين كتابياً (رسالة E2).
```

**T3 — Festival plan** (Arabic headers: المهرجان · التواريخ · آخر موعد · الجائزة المؤهِّلة · شروط العرض الأول/الإنترنت/AI · المسار A/B/C · الأولوية · الحالة). The rows come from 9.11, re-verified on the day.

**Organizer emails** (the user sends them from their own address to `hello@1billionsummit.com`; save the replies as PDF):
```text
E1  Subject: AI Film Award 2027 – <title> (ref <ref>) – publicity during public voting
Dear AI Film Award team, thank you for including <title> in the Top 10. Before I post anything,
could you please confirm in writing, under clauses 8.4 and 11.3(c):
1. May I state publicly that my film is in the Top 10, and from what date and time?
2. May I share the official voting link and your posts?
3. May I post my own material: the poster or key still, a clip of up to <N> seconds, behind-the-scenes images?
4. Is there a required wording, hashtag, credit or Award mark?
5. Where will the film be publicly viewable for voting, and for how long after 10 January 2027?
6. What file format do you need for the Summit screening (clause 11.3(a))?
Kind regards, <full name>

E2  Subject: AI Film Award 2027 – <title> (ref <ref>) – holdback question
… Under clause 8.4, may I <exact action, channel, date>? I will not proceed without your written confirmation. …

E3  Subject: AI Film Award 2027 – <title> (ref <ref>) – holdback status
… I understand my film was not selected for the Top 10. Could you please confirm in writing that the
clause 8.4 holdback has ended for this film, so that I may submit it to festivals? …
```

---

## Gate

**G4, disclosure and holdback half (D18).** It completes 07's technical half. The user approves in Arabic, item by item:
1. `form-answers.md`: every field, the synopsis and disclosure word counts, and story runtime only.
2. The full disclosure table and the share figures, matching the credits and 07's QC report.
3. The licence and consent tables with no blank row, and no "cleared" without a document.
4. The YouTube copy: unlisted, intro first, subtitles, 1080p, the altered-content answer Yes.
5. The raw-clip upload list: every hash found in the ledger's download checksums (the `comm` check prints nothing), coverage ≥ 70%.
6. The 7-day drill time, and three backups verified.
7. The holdback card T2, acknowledged.
Ask: «هل تعتمد ملف التسليم كاملاً لتقوم بالإرسال بنفسك يوم 18 نوفمبر؟»

**Submission close (D19).** The success page and reference are saved; the raw clips show "Your clips are in."; the confirmation email is filed.

**Vote gate (15 Dec).** No post before the Organizer's written permission (E1) is filed. The user approves each post's text and media.

**Festival gate (10 Jan, or the written E3 answer).** Branch A, B or C chosen; T3 re-verified on the day; DCP verified and played once; the Award card form approved by the Organizer, if required. Ask: «هل نعتمد المسار <A/B/C> وقائمة المهرجانات بالترتيب؟»

Silence or partial agreement is not approval.

---

## Common failures

| Failure | Prevention |
|---|---|
| Synopsis or AI text over 150 words: the form refuses it | count with `wc -w`; the full table goes in the archive, not the form |
| Running time entered with titles, credits or intro | the field wants story runtime only, 05:00–07:00 |
| Public YouTube link, or the link replaced after submission | unlisted; never delete or re-upload; email the Organizer for fixes |
| Raw clips graded, trimmed or re-encoded; "Finish" pressed early | byte-identical files, checksum OK, count matched before Finish |
| Title plates' raw clips forgotten | include every Seedance clip visible in the cut |
| Poster with AI lettering, Partner logos or brand-like signage | hand-set type, text-only billing, artefact check at 200% |
| BTS reel or teaser posted "because it's not the film" | anything containing film frames or sound is the film (9.6) |
| Announcing the shortlist after the Organizer's post, without permission | cl. 8.4 still applies; E1 first |
| Telling anyone about a Top 10 or Top 5 result, or posting "I entered", before the Organizer allows it | cl. 11.7, 14.1 confidentiality |
| Vote swaps, giveaways, bots, paid votes | cl. 6.1(j), 13.1(d) manipulation, 13.1(f) disrepute |
| Raw clips renamed or re-exported after hashing, or a `.mov` left out by an `*.mp4` glob | ledger names kept; `upload/*`; hash check against the ledger |
| Entering a festival whose deadline falls before 10 Jan | the film cannot be in any other competition; that edition is lost |
| AI-festival screening spends the world premiere before a top-tier answer (branch A) | premiere order first |
| Changing the Summit cut before 10 Jan 2027 | the Summit cut is locked for the Summit; a festival or "Episode 0" re-edit only after the holdback (9.10) |
| Calling the submitted film a pilot or an episode | one complete standalone story; "Episode 0" is pitch language after 10 Jan 2027 (9.12) |
| Stereo-only, encrypted or burned-subtitle DCP | 5.1/LCR, no KDM, subtitles as a separate asset |
| Press claims like "100% AI", "no human touched it" or "fully cleared" | the numbers in 9.2C and the documents in 9.3 only |
| Evidence on one drive; request found in spam on day 6 | three copies; daily inbox check; the 2-hour drill |
| Award card missing after the announcement | cl. 8.4; form approved in writing |
| Pitching the series as "Second Life" | trademark cleared or renamed first |

---

## Sources and licences (checked 2026-10-30)

**Official and primary:**
- 1 Billion Followers Summit: award page https://www.1billionsummit.com/ai-award-2027; Terms (last updated 12/10/2026, re-fetched 2026-10-30) https://www.1billionsummit.com/ai-award-2027/terms-and-conditions (cl. 1, 5.5, 5.6, 5.8, 6.1, 8.1–8.4, 11.1–11.8, 12.2, 12.6, 13.1, 13.5, 14.1, quoted in short); submission form https://www.1billionsummit.com/ai-award-2027/submit. The field labels, limits, consents and the raw-clip "Step 2 of 2" copy were read from the site's own form code, as text only, on 2026-10-30.
- Academy: 99th Short Films Qualifying Festival List (updated 10 Apr 2026), oscars.org PDF; Rules 8 and 17 and Rule Two via 00 §0.11.
- Annecy 2026 Short Films Terms and Conditions (annecyfestival.com PDF); Clermont-Ferrand 2027 International Regulations (lecourt-clermont.org PDF); Tribeca 2027 dates press release (tribecafilm.com).
- YouTube AI labels, 27 May 2026: https://blog.youtube/news-and-events/improving-ai-labels-viewers-creators/. DCP-o-matic download page: 2.18.51, 16 Oct 2026.

**Third-party, marked `[3P]`:**
- aifilmcontests.com, "AI Film Festivals 2027" (verified by them 30 Sep 2026): WAIFF, AI for Good, Berlin and others.
- asianfilmfestivals.com calls for entry: Tribeca, Palm Springs, Clermont.
- 3dvf.com on Annecy and generative AI; digitalproduction.com on ITFS 2027; the Haute-Savoie tourism listing for Annecy 2027 dates.

**Skills (cloned and read, text only; licence files checked):**
- **AlterLab-IEU/AlterLab-FC-Skills** @9559c97, MIT: `alterlab-cdm-festival-strategy`. Quoted: the logline formula, "Premiere status is sacred…", the director's-statement structure and "Honest, specific, not grandiose". Its "300 DPI" stills rule and loudness table were not used.
- **calesthio/generative-media-skills** @8c85352, MIT: `media-provenance-rights` (rights-map fields; "approved for this release under the documented assumptions"; TikTok and YouTube label facts dated 2026-07-10) and `media-qc-delivery` (naming and manifest, via 07). Paraphrased except the quoted phrase.
- **Leonxlnx/cinetic** @ecfa660, MIT, best pick for step 8: `references/formats.md` §7 ("Re-lay out; never crop", 9:16 feed safe zones) and the SKILL.md delivery-folder rule (quoted). Its launch-film bans were not used.
- **Gregory-Esman/ai-film-pipeline** @560cfc1, MIT, runner-up: video-qa prompt-rule scan (adapted for 9.5), and its online frame-extractor fallback rejected for an unreleased film.

**User's old skills (read-only):**
- cinematic-pipeline: Arabic MSA address, the single consolidated hand-off card, and the "⚠️ Watch:" line on prompts.
- midjourney-prompt-expert: aspect-ratio-per-use idea only; its V6 syntax is replaced by 03's V8.2 rules.
- higgsfield-generate: model routing superseded by 03; its virality predictor is not used, since it would upload the unreleased film.
- seedance-2-5-prompts, seedance-director, suno-ai-mastery: nothing for this step.

**Unverified, re-check on the day:** every 2027 festival date and deadline marked `[INFER]` or `[3P]`; the Summit's voting platform, rules and the Summit-intro counting; the raw-clip upload closing date.
