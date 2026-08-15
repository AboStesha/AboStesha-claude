# 10 — Production System: Pre-Production Sprint, Weekly Workflow, Tooling, Performance Loop

## A. Pre-production sprint (Mon 17 Aug → Mon 31 Aug) — the two weeks that make September easy

| Dates | Block | Output |
|---|---|---|
| Aug 17–18 | **Approvals round 1** | Send management/compliance: this whole plan + the 10 Missing-Info requests (file 01 §4) + the KRI legal escalation (file 02 §A1) + women's-campaign pre-clearances (file 04 §10) |
| Aug 19–21 | **Design system build** | File 09 templates: 7 story templates, carousel master (5 layouts), thumbnail panel system, highlight covers, end-card motion template |
| Aug 22 | **Copy batch 1** | All 30 story frames' static copy (from file 08) + C1–C2 full copy → compliance |
| Aug 24–25 | **Design batch 1** | C1 + C2 built (both artboards incl. PDF); HV1 storyboard frames generated (Higgsfield); week 1–2 story skeletons |
| Aug 26 | **Translation batch 1** | Approved evergreen set → translators: story-template statics, terms/quizzes/mistakes set, C1–C2, HV1 script, campaign name brief |
| Aug 27 | **Casting locked** | Women's film participants confirmed (file 04 §10); vendor outreach for «أهل السوق» via Erbil office |
| Aug 28–29 | **HV1 production** | Generate shots, edit, master + cuts + thumbnails |
| Aug 30–31 | **Kurdish batch 1 build + QA** | Kurdish templates populated; glyph QA; both accounts' September week 1 scheduled |

## B. Weekly operating rhythm (repeats all September)

| Day | Block (≈ hours) | What happens |
|---|---|---|
| **Sun** | RESEARCH + SETUP (2h) | Week's market calendar check; creative-trend scan (30 min: save 5 reference Reels, note hooks); build week's 7 story skeletons; confirm week's facts |
| **Mon** | PUBLISH + CREATE (3h) | Carousel goes live 19:00; draft next week's carousel copy + this week's HV script refinements |
| **Tue** | VIDEO DAY (4h) | Generate/edit this week's HV (or shoot-day when scheduled); thumbnails ×3 |
| **Wed** | PUBLISH + REVIEW (2h) | HV live 19:00; self-review vs compliance checklist; send week's approved Arabic batch → translators |
| **Thu** | KURDISH BUILD (2h) | Returned translations → Kurdish artboards; glyph/RTL QA; schedule Kurdish feed (+3d offset) |
| **Fri** | LIGHT (30 min) | Close-of-week story frame (live data); weekend recap prep |
| **Sat** | RECAP + LEARN (1.5h) | «الأسبوع بدقيقة» recap live; log week's metrics in the performance sheet; pick one test for next week |
| Daily | PULSE (≤25 min/account) | Market pulse protocol (file 08 §B) + comment moderation sweep (2× daily during campaign) |

Total ≈ 18–20 focused hours/week — realistic for one person because templates carry the volume and only data + one creative frame are made fresh daily.

## C. Batching doctrine
Script in month-batches → design in template-batches → translate in approval-batches → ONLY market data is daily. Reuse: animation presets (number count-up, arrow, underline draw), end-cards, sticker layouts, caption skeletons (hook + value + CTA + `[RISK-AR]` + 6 hashtags). Version control: `AXI-IQ_YYYY-MM-DD_asset_lang_v#` file naming; approved-copy master sheet is the single source of truth for translators.

## D. Tooling map (installed skills + MCP — use these, skip the rest)
| Need | Tool |
|---|---|
| Cinematic AI shots (HV1/HV2/HV5) | Higgsfield: image keyframes → Seedance 2.0 image-to-video, shot-by-shot per storyboards (skills: `higgsfield-generate`, `video-prompt-builder`, `seedance-director`, `cinematic-pipeline` for full films) |
| Recurring AI persona (HV5 if used) | Higgsfield `character-sheet` workflow |
| Thumbnails | Higgsfield `youtube-thumbnail-generator` workflow (feed it the file 09 panel system) |
| Static design at scale | Canva (create an **Axi brand kit** in Canva first — none exists yet on the account; add colors/fonts/logo once the guideline file arrives) |
| Sales PDFs | Same design file second artboard; `pdf` skill for assembly/merging if needed |
| Virality pre-check | Higgsfield `virality_predictor` on hero-video drafts before publish (hook strength/retention read) |
| Market data | Reputable live sources, 2-source rule (file 08 §B) — never AI memory |
| NOT used | TikTok publishing tools (no TikTok brief), website builders, music generation (license real tracks/library), auto-posting of unreviewed content |

## E. Performance & learning loop
**Weekly sheet (log every Saturday):** per post — reach, likes, comments, shares, saves, follows; per Reel — plays, avg watch %, 3-sec hold; per story — reach, taps-forward, exits, sticker responses; per account — follower delta, profile visits.
**From the paid team (when they run our creatives):** CTR, CPC, CPL, lead quality note, fatigue flag, best hook variant.
**Monthly review (Sept 30 – Oct 1):**
- WINNERS (top 3 by save-rate + watch-through — not raw views)
- LOSERS (bottom 3 + hypothesis why)
- LEARNINGS (3 sentences max each: hook types, posting times vs the 19:00–23:00 hypothesis, dialect vs MSA response, women's-campaign resonance, Kurdish vs Arabic behavior)
- NEXT TESTS (max 3 for October — e.g., hook C-style visual metaphors vs direct-address; portrait posts vs graphic posts; Sunday vs Monday carousel slot)
**Decision rule:** every October format decision cites a September number or it doesn't change.

## F. Compliance gate (nothing publishes without)
1. Claims check vs file 01 §2 verified-facts list
2. Numbers: illustrative-labeled or live-verified (2 sources)
3. `[RISK-AR]`/`[RISK-KU]` present (once approved text exists — **until then, nothing publishes**)
4. No advice/signals/promise phrasing (word-list scan: مضمون، توصية، اشترِ، بِع، فرصة مؤكدة…)
5. Kurdish asset? → KRI rules: education-only CTA, legal sign-off logged
6. Women's-campaign asset? → file 04 §8b protections in place
