# Credits and licences

**Purpose.** One list of every source the AboStesha Film Pipeline modules used, with its licence and how it was used, so the package can be shared or audited without re-reading every module.
**Rule.** Text was quoted or adapted only from MIT, Apache-2.0, CC0 or CC BY sources, with credit in the module where it appears. Sources with no licence file, a NonCommercial, ShareAlike or AGPL licence, or vendor material without an open licence were paraphrased as facts or ideas only. Each module's own "Sources" section is the detailed record; this file is the index. All sources were read or checked on 2026-10-30 unless stated.
**Load this file** only when someone asks where something came from, or before redistributing the package.

Module keys: 00 award brief · 01 script and dialogue · 02 style prefix · 03 assets · 04 Blender blocking · 05 Seedance production · 05b acting direction · 06 music and SFX · 07 edit, mix, finish · 08 judge panel · 09 release and festivals · L ledger, continuity, physics · C companions.

---

## 1. Open-licence skills and code (quoted, adapted or paraphrased with credit)

| Source (commit or version read) | Licence | Used in | How it was used |
|---|---|---|---|
| jtydhr88/screenwriting-skills: sw-dialogue, sw-scene-craft, sw-story-structure, sw-premise-theme, sw-format-adaptation, sw-workflow, chekhov-dramaturgy | MIT © 2026 Terry Jia (original structure only; its NOTICE says quoted book passages are not relicensed) | 01 | paraphrased from Chinese into English, no verbatim text and no book quotations: dialogue diagnostics, value-turn test, Lu Jun's four-part structure with 8 openings and 8 endings, premise and controlling idea, why page ≈ minute fails, Chekhov one-act tools |
| gbellonre/psych-short-screenplay | MIT © 2026 gbellonre | 01 | short quotes: Locked Sheet tests, beat format, scene footer (TURN / WITHHELD / CUT IF IT EXPLAINS), dialogue bans, punch-up method, cut pass that adds no plot; generalised from horror to any genre |
| omkarpalika/filmcraft (ai-screenwriting-tells, review-and-formats, checklists) | MIT © 2026 Omkar Palika | 01 | short quotes: AI-screenwriting tells, "a short earns one idea", notes discipline |
| bflandev/script-doctor `script-coverage` | MIT © 2026 Script Doctor Contributors | 01 | Critical / Major / Minor / Strengths coverage format |
| elevenlabs/skills: text-to-speech, music, sound-effects (HEAD 503d4e9) | MIT © 2024 ElevenLabs | 01, 06, C | v4 settings and presets; composition plans, inpainting, conditioning, `compose_detailed`, video-to-music; SFX parameters, `loop` (v2), output formats |
| calesthio/generative-media-skills (HEAD 8c85352): performance-direction, dialogue-editing-adr, visual-style-direction, color-grading-finishing, sound-design-foley, providers/elevenlabs-sound-effects, music-supervision-scoring, audio-mixing-mastering, captions-media-accessibility, editing-montage, media-qc-delivery, localization-dubbing-production, media-provenance-rights, asset-continuity-management, generated-media-qa | MIT © 2026 generative-media-skills contributors | 01, 02, 05b, 06, 07, 09, L, C | short quotes (lens-intent rule; "never manage continuity by memory…"; "favors explicit unknowns over blank cells"; "approved for this release under the documented assumptions"; one rule in 07); adapted: reference ledger, continuity-bible and manifest shapes, spotting fields, cue-log fields, loudness facts with their dated citations; the rest paraphrased |
| OSideMedia/higgsfield-ai-prompt-skill v3.42.0 (HEAD 6a6a5dd): templates/seedance/global-style-prefix.md, templates/ad-asset-prep.md, higgsfield-style, higgsfield-seedance (+ FAILURE-MODES, HELL-GRIND.md), higgsfield-seedance-2-5, higgsfield-gpt-image-2 (reference-sheet-workflow), higgsfield-soul, higgsfield-character-design, higgsfield-acting, higgsfield-facs, higgsfield-audio, image-models.md, specs snapshot 2026-09-26 | MIT © 2026 O-Side Media | 01, 02, 03, 05b, L, C | quoted: prefix-shape rule, acting core axiom, mass in real units, causal props; adapted: grey law, one readable face, location and reverse plates, prop views, red-arrow trick, untouched base, "a sheet is not a menu", fold rule, reserved accent, FOV anchors, five acting pillars, FACS table, phased blink, lip-sync rules (marked EMPIRICAL-2.0), voice lock, headcount lock; Higgsfield ids flagged to verify live |
| ajinnaaa/extract-visual-style-2 | MIT © 2026 ajinnaaa | 02, C | one rule quoted verbatim (never infer camera, lens or stock from appearance); paraphrased: adequacy labels, four kinds of information, stable/conditional/scene layers, calibration loop, acceptance method |
| A0339x/ai-film-pipeline (ai-film-director, cinema-worldbuilder, banana-pro-director 3.0) | MIT | 02, 03 | palette by role attached to surfaces; FOV-degree lens ladder (unmeasured field claim); flat-grade plate block, 3-panel headless sheet with ghost-mannequin and neck-cut variants, skin-tone clause, face-lock mode |
| smixs/visual-skills by Serge Shima (image/references/models.md, nano-banana.md, vision-decomposer.md; video/references/seedance-25.md) | CC BY 4.0 — attribution: Serge Shima, github.com/smixs/visual-skills | 02 | paraphrased adapter notes (Nano Banana ignores numeric lens values; HDR over-cooking; Pro style references) |
| n1ko724/kodak-2383-film-look | MIT | 02 | halation-is-not-bloom definition, paraphrased |
| scenario-labs/skills v0.60.1 (commit 5d68b48): scenario-blender-blockout, -expert, -previs-storyboard, scenario-seedance, scenario-seedance-drafts, scenario-consistency, scenario-video-color-grade | MIT © 2026 Scenario Inc. | 02, 03, 04, 05, 05b, C | adapted wording: featured-capsule stand-in clause and gait clause; voice-binding quote; paraphrased: authority split, defect-copy evidence, palette values and dimensions, lens and coverage maths, rail rig, handheld budgets, keys past cuts, clip-length audit, all-grey refusal, audits, hand-off sheet, draft economics, review by sweep, output-filter notes, never chain outputs, 2 fps drift sweep, show-LUT idea |
| nigo-studio/ai-film-skills `character-consistency` | MIT | 03 | Character Brief; Seedance role line |
| israelmusondaayliffe/midjourney-v8-2-edit-architect | MIT | 03 | Edit Model reference roles, anchors, pass order |
| magiccreator-ai/gpt-image-2-5-prompt-skill | MIT | 03 | change/preserve editing pattern; OpenAI size constraints |
| higgsfield-ai/skills `higgsfield-generate` v0.14.0 | MIT | 03 | Higgsfield CLI id aliases |
| friscodanconia/greybox-director (commit c61577d, Seedance 2.0 era) | MIT | 04, 05 | paraphrased: support check, populate the exit, collision scrub, reaction choreography, skyline rule, beat-anchor stills, warning about short references, PNG-to-ffmpeg encode, max takes then redesign, colour-role mapping |
| ahujasid/blender-mcp (`mcp-for-blender` 2.2.6) README and pyproject | MIT | 04 | facts only: tool list, telemetry default and `DISABLE_TELEMETRY`, port 9876 |
| byteplus-sdk/ark-cli `arkcli-gen` (commit 79c8ff6) | Apache-2.0 | 05 | explicit roles or HTTP 400; never resubmit on timeout; inline audio/video rejection report; GET (not HEAD) for presigned downloads |
| kangarooking/director-skills `emotion-performance-director` | MIT | 05b | before/during/after structure, prune rule, late tears, stillness as a choice |
| zhouwei713/facial-expression-prompting | MIT | 05b | channel stagger order; pressure/amplitude/self-control axes |
| liyue-aigc/seedance-2-5-video-director (realistic-direction-patterns.md) | MIT | 05b | reaction chain; build-up before tears and laughter; contradiction audit |
| thenpceo/cinematic-score-and-sfx-skill (HEAD d48bb34) | MIT © 2026 Nicholas | 06, C | adapted: picture as timing authority, hard/soft sync, cause before reaction, dialogue pockets, revision axes, conforming one cue, zero-aligned stems with checksums |
| bitwize-music-studio/claude-ai-music-skills (HEAD 597d928): reference/suno/models.md, best-practices.md, creative-sliders.md, instrumental-tags.md | CC0 1.0 | 06, C | Suno v6 routing, Variety, Max Mode, Exclude format, field budgets, sliders, Duration behaviour, stem modes, download and commercial-use rules ("reported" where launch-week) |
| bianbianzhu/procedural-sfx (HEAD 5eff10f) | MIT © 2026 bianbianzhu | 06, 07, C | attack/body/tail model, material table, metric targets, sync anticipation, static-gain mastering, look-ahead true-peak limiter design, inter-sample peaks after AAC; `scripts/sfx_forge.py` rewrites every function and credits it in its header |
| vlad7329-debug/claude-after-effects-skills `premiere-sfx-design` (06266e4) | MIT | 07 | Premiere MCP quirks, timing and level rules, paraphrased (re-verify on `pr_*`) |
| Leonxlnx/cinetic (HEAD ecfa660) | MIT | 07, 08, 09 | P0/P1/P2 severity; the BT.709 ffmpeg tag chain (quoted); review loop, verify pass, rejection grounds, 3-round cap, "Do not re-report fixed issues", "Don't propose adding text"; formats.md §7 "Re-lay out; never crop"; delivery-folder rule (quoted). Its rubric, hard bans and −14 LUFS target were not used |
| Gregory-Esman/ai-film-pipeline `video-qa` (560cfc1) | MIT | 07, 08, 09 | AI-artifact, continuity and photoreal checklists; weighted categories, audio-diegesis rule, Ship/Hold/Block logic (reweighted); prompt-rule scan. Its online frame-extractor fallback was rejected (holdback) |
| bradautomates/claude-video `watch` v0.3.2 (03ceb42) | MIT © 2026 Bradley Bonanno | 06, 08, C | engines and flags, `gemini-3.7-flash` default, Files API upload and 48 h expiry, the speech fallback that uploads audio, install commands, no claude.ai Chat/Cowork support |
| talsiach/take-one (8be349c) `reviewer-brief.md` | MIT | 08 | new reviewer every round, pack-only, cannot hear, three rounds, stranger wins on comprehension, score inflation band, time-block map |
| vandit1604/vawe `vawe-critique` (2c144c6) | Apache-2.0 | 08 | quoted: "The author never grades its own film."; default REJECT; grade what is on screen |
| AlterLab-IEU/AlterLab-FC-Skills `alterlab-cdm-festival-strategy` (9559c97) | MIT | 09 | quoted: logline formula, "Premiere status is sacred…", director's-statement structure, "Honest, specific, not grandiose" |
| contentauth/c2patool and c2pa-rs | MIT / Apache-2.0 | L | `--info` and `-d` usage; supported formats |
| vercel-labs/skills (README, docs/commands.md) | MIT | C | install syntax, options, telemetry opt-out |

## 2. Inspiration only (no text reproduced)

| Source | Licence status | Used in | What was taken |
|---|---|---|---|
| sd25-pe 0.1.1, official BytePlus Seedance 2.5 prompt optimizer (archive sha256 `c9c765aa5ba9fa84e8a27ee606f7b8c6229bfb775138133f366ea1ad37b97cba`) | no licence file; vendor material | 05, 05b, C | paraphrased: template order, one-subject mapping, `【Unused Assets】`, reuse-dialogue rule, edit scope closure, motion-slot replacement, extension rules, checklist ideas. Short functional prompt-syntax strings only. Its self-update section must never be run |
| calesthio/openmontage `seedance-2-5` (195eab2) | AGPL-3.0 | 05 | ideas only: named locks, state monotonicity, substitute-don't-forbid, iteration discipline. Nothing copied |
| popopo-99/zy-cinematic-realism | CC BY-NC 4.0 | 03, C | ideas only: continuity-bible fields, reference ledger, Midjourney adapter cautions |
| avienor/midjourney-prompts | no licence file | 03, C | Midjourney facts, each re-checked against official release notes |
| jordangaston/claude-plugins `elevenlabs-tts-prompting` | no licence file | 01 | match tags to a voice's range; stage-direction prose gets spoken; lines in code blocks. Its v3-only claims were not used |
| badgids/story-film-skills (dialogue timing preflight) | not checked | 01 | the FITS / REBALANCE / IMPOSSIBLE idea; never speed up or truncate a line |
| jellypoplabs/skills `whitebox-check` | no licence file | 04 | 3°/frame camera-turn limit, 0.8 m clearance, thin objects vanishing edge-on |
| milenaaraya536-cell/direct-ai-actor-performance | no licence file | 05b | the private-sentence idea and emotion mechanics |
| snowfrost/skill-movie `score-and-mix-picture` | no licence file | 06 | bar-length formulas, off-grid fix order, ±5% stretch cap, take-evaluation order |
| stefanwebb/premiere-ai-skills | CC BY-SA 4.0 | 07 | Premiere tick rate and frame-snapping finding, paraphrased |
| wkimball1/designwright | no licence file | 08 | the finding contract (class, bounded fix, must-not-change invariants) |

## 3. Rules and legal texts (facts and short clause quotes)

- **AI Film Award 2027** (1 Billion Followers Summit): official page https://www.1billionsummit.com/ai-award-2027 ; Terms and Conditions, last updated 12/10/2026, https://www.1billionsummit.com/ai-award-2027/terms-and-conditions ; submission form https://www.1billionsummit.com/ai-award-2027/submit (field labels read from the site's form code as text). All rights reserved; paraphrased with clause numbers. Used in 00, 01, 05, 07, 08, 09, L.
- **Academy of Motion Picture Arts and Sciences:** 99th Rule Eight (Animated Short) and Rule Seventeen (Live Action Short) PDFs; 99th complete rules (Rule Two ¶7); 99th Short Films Qualifying Festival List (10 Apr 2026); the 1 May 2026 rules announcement. © AMPAS; paraphrased. Used in 00, 01, 08, 09. The 100th rules are unpublished.
- **UAE Media Council 20 content standards** (Federal Decree-Law No. 55 of 2023), via a Gulf News summary (June 2025) — secondary source. Used in 00.
- **"Second Life" trademark:** National Arbitration Forum UDRP decision 1089130 (adrforum.com) and Linden Lab brand FAQ. Used in 00, 09.
- **ElevenLabs Eleven Music Model-Specific Terms** (updated 09 Oct 2026): film use only on Enterprise Music. Used in 06, 09.
- **Suno Terms and help articles** on downloads and commercial use. Used in 06.
- **Gemini API Additional Terms** (unpaid vs paid data use). Used in 08.
- **Midjourney Terms** (public gallery without Stealth). Used in 03, 09.
- **BytePlus ModelArk Playground terms** (internal, non-commercial use). Used in 05.
- **Festival regulations:** Annecy 2026 Short Films Terms; Clermont-Ferrand 2027 International Regulations; Tribeca 2027 dates press release. Used in 09.

## 4. Official vendor documentation (facts, paraphrased)

| Vendor | Pages | Used in |
|---|---|---|
| BytePlus ModelArk (read as Markdown, `ai.byteplus.com/ark/region:ap-southeast-1/docs/<page>.md`) | Dreamina Seedance 2.5 tutorial (task types, Draft mode, limits, 14-day draft retention, rate limits); create/retrieve/list/cancel task APIs; Seedance 2.5 and 2.0 prompt guides and FAQ; model pricing; error codes; portrait-asset guide; private virtual portrait library (page 2333565, updated 13 Oct 2026); Advanced Creation Rights purchase guide; C2PA Content Credentials guide; Files API; TOS internal presigned-URL guide; `byteplus.com` Seedance 2.5 blog | 03, 04, 05, 05b, L |
| OpenAI | image-generation guide (GPT Image 2.5 ids, quality levels, size limits); model page (`gpt-image-2.5-sunburst-2026-09-08`) | 02, 03, L |
| Google | ai.google.dev `gemini-nano-banana-2.1` model page and image-generation guide (Nano Banana 2.1 and Pro limits); Gemini Files API | 02, 03, 08 |
| Midjourney | updates.midjourney.com: "Version 8.2" (24 Jul 2026), "Edit Model for V8" (27 Aug 2026), Alpha Changelog 7 Oct 2026, "Testing Thinking Mode" (8 Oct 2026); docs.midjourney.com Edit Model | 02, 03 |
| ElevenLabs | Eleven v4 overview, models page, Prompting Eleven v4; Text to Dialogue, TTS, Voice Design API references and guide; `/v1/music`; `/v1/sound-generation`; Music best practices; Forced Alignment; hosted MCP `creative_get_model_guide` / `creative_get_model_schema` (`eleven_v4`, `eleven_music_v2_5`, `eleven_text_to_sound_v2`, image models); connector image-model schemas | 01, 03, 05b, 06 |
| Suno | help.suno.com articles 13924481, 13924801, 13876865, 13925249, 2565761, 2481537 | 06 |
| Netflix Partner Help | English (USA) and Arabic Timed Text Style Guides; General Requirements; Subtitle Timing Guidelines | 01, 07 |
| Adobe | Help: Lumetri Color Match, Loudness Meter presets, Project panel List View columns; Premiere 26.x release history and Content Credentials export | 07, L |
| Blender | blender.org/download (5.2.3 LTS); Blender Lab MCP readme, tools list and add-on source (projects.blender.org/lab/blender_mcp, blender.org/lab/mcp-server); extensions.blender.org Sun Position 4.4.0 | 04 |
| Higgsfield | higgsfield.ai/plugins/blender; Bridge server instructions (`bl_get_skill` order, units, save rule); MCP tool catalogue as exposed in session | 03, 04, 07 |
| ARRI | news pages on Parasite (ALEXA 65, Prime DNA) and Blade Runner 2049 | 02 |
| YouTube | AI labels blog post (27 May 2026) | 09 |
| DCP-o-matic | download page (2.18.51, 16 Oct 2026) | 07, 09 |
| ITU | ITU-R BT.1359 lip-sync thresholds (via search) | 07 |

## 5. Third-party documentation and reports (facts, flagged in the modules)

- Comfy docs: BytePlus `dreamina-seedance-2-5-260628` schema mirror, Seedance 2.5 draft tutorial, Seedance 2.0 partner-node docs — 00, 02, 03, L.
- Oxen, APIYI (incl. face-asset whitelist FAQ), fal.ai, Segmind, Krea pages on Seedance drafts — 00, 03, L.
- laozhang.ai, "Seedance 2 API real people" (22 Oct 2026) — 00, 03.
- Evolink Midjourney V8.2 API manual; tech-insider V8.2 guide (official docs returned 403) — 02.
- Higgsfield changelog summaries (Draft Mode, 22 Sep 2026) — 05.
- Magnific note that Seedance re-synthesises reference audio — 05b (via BRIEF).
- Adobe community and Puget Systems reports (H.264 4:4:4 in Premiere; caption burn-in; Arabic RTL captions) — 05, 07.
- iZotope Insight 2 Netflix target — 07.
- aifilmcontests.com, asianfilmfestivals.com, 3dvf.com, digitalproduction.com, Haute-Savoie tourism listing — 09.
- Gulf News, WAM, Campaign ME, Google blog (2026 award winners and jury remarks); NFB release and bostonhassle.com (98th Animated Short) — 08.
- Dubai Metro facts: Wikipedia, railway-technology, Alstom, Gulf News — L.

## 6. Scientific and technical references

- Aldholmi et al., Interspeech 2021 — synthetic MSA speech rate (01 timing estimate).
- NOAA solar-calculator equations (Meeus) — implemented in `scripts/sun_position.py` (L.7.1).
- Weidmann 1993 pedestrian parameters, via arXiv 0901.0170 — walking speeds (L.7.5).
- Standard physics and engineering values marked `[TEXTBOOK]` in L.7.

## 7. AboStesha's own material

- **Old skills** (read-only, `/root/.claude/skills/synced/…/`; his own work, no licence file needed):
  - cinematic-pipeline (SKILL.md, SCRIPT_FORMAT, STYLE_PREFIX_GUIDE, MIDJOURNEY_RULES, CHARACTER_SHEET_RULES, SHOTLIST_RULES): strict gating with Arabic lock prompts, no approval from silence, Arabic address, heading table, "no emotions in action lines", 12-pillar style skeleton, drift-flag prompt, failure codes, physics and continuity prefix lines, consolidated hand-off card — 00–09, L.
  - seedance-2-5-prompts (his transcription of ByteDance's Dreamina Seedance 2.5 Prompt Guide, 31 Jul 2026; kept): formula, "The visuals feature …" slot, bracket channels, per-reference binding, edit and audio-edit templates, audio-reference limits — 01, 02, 03, 04, 05, 05b, 06, 07.
  - seedance-director: anti-slop list, ≤ 3 tracked characters, no reflections or exit/re-entry, micro-expressions as physics, age-blind rule, off-screen and exit-frame rules — 05, 05b, L.
  - higgsfield-generate: quality first, Higgsfield audio-reference flag and job retrospection, Virality Predictor note — 00, 05, 08, 09.
  - midjourney-prompt-expert: aspect-ratio-per-use idea only — 09. suno-ai-mastery: "dynamic journey" and iterating in passes — 06.
  - idea-council (MIT): sealed sequential passes in chat — 08. court-skill: referenced for contested story decisions — 08.
- **Film material:** `films/01-second-life-ascent/draft-v0-abostesha.md` (his draft, the human baseline), `gemini-analysis-extracted.txt` (third-party Gemini text, origin G), `script-review-v1.md` — worked examples in 00, 01, 03, 04, 05, L.
- **Project files:** `BRIEF.md` (locked decisions), `RESEARCH-2026-10-30.md`, and the raw research JSON of 2026-10-30 (candidate rankings, verify notes, rules snapshot, tool landscape).

## 8. Original code and templates (written for this pipeline)

| File | Notes |
|---|---|
| `scripts/seedance_byteplus.py` | stdlib only; tested against a local mock of the documented API, not yet against the live API |
| `scripts/sfx_forge.py` | numpy + scipy; method credits bianbianzhu/procedural-sfx (MIT) in its header |
| `scripts/measure_frames.py` | Pillow + numpy |
| `scripts/srt_check.py` | subtitle values from the Netflix Timed Text Style Guide |
| `scripts/share_report.py` | stdlib only; tested on synthetic xmeml |
| `scripts/sun_position.py` | NOAA/Meeus equations |
| `templates/*` | ledger, shot list, continuity and physics bibles, cue and SFX lists; continuity-bible shape adapted from calesthio (MIT) |

## 9. Redistribution notes for this package

- The package may include only its own text, its own code and the open-licence material credited above. Keep the attribution lines in the modules, including the CC BY 4.0 credit to Serge Shima.
- Companion skills are **not** bundled. See `COMPANIONS.md` for which ones may be zipped with their LICENSE and which he must install from source.
- Official rules, vendor documentation and third-party reports are cited as facts; none of their text is redistributed beyond short clause quotes and functional prompt syntax.
