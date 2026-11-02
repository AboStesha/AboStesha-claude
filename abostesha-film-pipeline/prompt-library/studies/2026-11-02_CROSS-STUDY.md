# Cross-study playbook: 12 Higgsfield films → our Seedance 2.5 pipeline (2026-11-02)

**What this is.** One playbook built from the 12 verified studies in this folder (`2026-11-02_<key>.md`). It ranks what the films did that matters most for winning, compares their tool stacks, merges the four synthesis sections (image prompts, Seedance video prompts, consistency and workflow, technique cards for the user's notes) without repeats, and ends with the edits we propose for each skill module.

**Target.** AboStesha's film for the AI Film Award 2027: rated G, at least 70% of the picture made with Seedance, everything generated inside Higgsfield. Images: GPT Image 2.5 Sunburst, Nano Banana Pro, Nano Banana 2.1. Video: `seedance_2_5`, draft (480p) → 1080p finalized from the same take.

**Status.** Nothing here changes the skill. Every rule in section 4 is **proposed** and is also logged in `../LESSONS.md`. The best templates are copied into the library files (`../characters.md` … `../seedance-transition.md`) as "TEMPLATE (from studies 2026-11-02)" entries.

## How to read this file

**Film codes** (★ = one of the user's four favourites):

| Code | Film | Code | Film |
|---|---|---|---|
| **B★** | The Breach | **L** | LEAK |
| **F★** | Fukushima | **U** | UNPROMPTED |
| **K★** | Kimti | **T** | THREAD |
| **S★** | SÉKOU | **TK** | TOKYO 4:17 |
| | | **IP** | In Passing |
| | | **C** | CONTROL |
| | | **H** | HUNGER |
| | | **BZ** | Buzkashi |

**Counts.**
- "n/12" is the number of the 12 studies whose data shows the practice. "Not reported" does not mean "not done".
- A count inside one film ("411/514") is that study's own figure.
- **[INFERRED]** marks anything the studies do not show directly: a study's own inference, a transfer of a non-Seedance method to Seedance 2.5, any mapping onto our exact image models, and any suggestion that no study tested. **[ARITH]** marks my own arithmetic on a study's numbers.

**Caveats that change how much a number is worth.**
1. **Two films are not Seedance films.** UNPROMPTED's video is 128/128 Cinema Studio Video 4.0. In Passing's crowd film is 713 Cinema Studio jobs against 173 Seedance, and 79 of its 89 verified cuts are Cinema Studio. Their *methods* may transfer to Seedance [INFERRED]; their *tool mix* would break our 70% rule. Buzkashi (Kling "living stills", about 30 s), LEAK (Kling credited, about 31 s unmatched) and CONTROL (one Kling take used 5×) also carry some non-Seedance picture.
2. **Three lean projects are curated subsets.** Kimti: 62.9 s (29%) of the picture matches no project job and its character sheet was made outside the project. SÉKOU: about 148 s comes from clips outside the project folder. LEAK: all 20 Elements were made outside. Their job counts understate the real work.
3. **Credits cannot be compared across accounts.** Seedance credits per generated second ranged from about 0.17 (BZ) to 9.0 (S, L); In Passing's Seedance looks plan-included. Our measured prices are 3 cr/s draft, 7 cr/s 720p, 16 cr/s 1080p (05 §5.0). Budget in **generated seconds**.
4. **No study could hear the audio.** Every sound statement comes from prompts, uploads and credits.
5. **GPT Image 2.5 appears in two studies, but its variant is never recorded; Nano Banana 2.1 appears in none.** F★ ran `gpt_image_2_5` 291 times (269 at quality max) and U 81 times; neither study says whether those jobs were Flare or Sunburst, so anything Sunburst-specific is [INFERRED]. In these projects the job type `nano_banana_2` is what Higgsfield's public stack labels **Nano Banana Pro**, and `nano_banana_flash` is Nano Banana 2 (B, C, BZ). Our MCP ids are `nano_banana_pro` / `nano_banana_2_1`.
6. **Handle form.** The studies' prompts store references as `<<<image_N>>>` / `<<<video_N>>>` / `<<<element-uuid>>>`. Our 05 writes `@Image1` / `@Video1` / `@Audio1` and lets 05-T11 confirm the mapping. Verbatim quotes keep the studies' form; every template below uses ours (`@ImageN`). Swap them if 05-T11 shows otherwise.
7. **Brand and gear names.** Several films wrote stock, camera or lens names into prompts (B: "Kodak 2383", "ARRI Alexa 65"; S: "Kodak Vision3 500T"; H: "Cooke S4/i"). Our 02 hard rule 2 bans them. Quotes keep them; templates describe the visible effect instead.

## Contents
1. Top 15 findings, ranked by impact on winning
2. Tool stacks of the 12 films
3. The merged playbook
   - 3A Image prompts: assets, plates, props, look-dev, edits, model routing
   - 3B Seedance 2.5 video prompts: settings, block order, references, beats, camera, dialogue, extensions, templates
   - 3C Consistency and workflow: frozen look, continuity chain, post glue, folders, previz, resolution, economics, lean vs heavy, pre-submit lint
   - 3D Technique cards for the user's eight notes
4. What we change in our pipeline: decisions needed, then proposed edits per module, then D1 tests

---

## 1. Top 15 findings, ranked by impact on winning

The ranking is my judgement of what most affects how a jury sees the film [INFERRED]. The evidence under each finding comes from the studies.

**1. One look, frozen as text and pasted into every prompt, after a short engine shoot-out.**
- Evidence: 11/12 pasted a fixed look text (all except K★, which used short shared fragments plus a post grade). B★: "Underexposed one stop, crushed blacks with detail" in 411/514 Seedance prompts. S★: one `[VISUAL STYLE]` paragraph identical in 13/13. T: LOOK LOCK in 177/214. 5/12 ran a day-1 cross-engine shoot-out before freezing (B★ 532 jobs over 2 days, T, H, BZ, U). B★'s doctrine changed 3 times, then froze and was versioned in the prompt header.
- For us: our `LOOK vX.Y` prefix (02) is exactly this. Freeze it after the shoot-out and never re-word it per shot.

**2. Identity lives in one clean sheet per character state, attached to every shot that shows the character.**
- Evidence: neutral grey or plain backdrops in 10/12 (B★ F★ K★ S★ T TK U C H BZ). Separate sheet or Element per wardrobe or story state in 8/12 (B★ F★ S★ L IP H BZ, T partly). The main character reference rode in 88% of TK's Seedance jobs, 81% of B★'s, 81% of L's, 68% of T's. Asymmetric marks named with a side in 5/12 (S★ F★ C BZ L); "do not mirror" in 2 (S★ F★).
- For us: our 03 plate laws already say one face per sheet and one state per sheet. Add the side-named mark, the star-shaped angle chain and "every state is re-derived from the master front" (3A).

**3. Every reference gets one written job and a "not this" limit, and the tags are checked before every submit.**
- Evidence: 11/12 wrote one role sentence per reference (all except K★). 7/12 recorded tag failures that silently mis-bound references: lost tags on paste (B★, C), blank or duplicate tokens (S★ 3/13; H 43 prompts with an empty Element slot), ordinals that did not match the attachments (K★ 10/12), a prompt cut at 4,500 characters (L), unfilled template placeholders (B★).
- For us: a role line per handle and a pre-submit lint (3C §9). This is cheap and prevents the most common silent failure in the data.

**4. Acting is written as one physical tell plus a list of what the actor does not do.**
- Evidence: an explicit restraint clause in 11/12 (K★ 23/43 prompts; BZ EMOTION LAW in 30; L's standing anti-acting rules in 18–24 prompts). Both extremes banned in 2/12 (BZ: tears = failed take, and a blank face = failed take; K★'s pasted note: "you need both the positive and the negative or Seedance will either skip the tear or go full weeping"). Micro-beats ①②③, at most three per shot (L).
- For us: fits 05b ground rule 2. Add the "both limits" line and the blink/sigh footer (3D Card 3).

**5. Faces that read as real people are picked, written with imperfections, and passed through one realism pass.**
- Evidence: imperfection or "no retouching" wording on faces in 8/12 (TK S★ B★ L T C F★ BZ). TK kept 4 of 84 casting candidates (4.8%), choosing "lived-in but still camera-friendly" faces [the study's reading, INFERRED], then ran one 9,466-character "re-photograph, don't redesign" pass on each. F★ cast its lead inside the real location, then ran a separate skin pass.
- For us: casting rounds in our engines, imperfection blocks for designed faces, and a realism pass **before** the face plate is approved (3A Templates A5–A7; 3D Card 4).

**6. Decide in stills, pay for motion: lock all assets in one burst before video and write the whole film as one plan** (that the plan was finished before the first video is [INFERRED]).
- Evidence: all three lean films (K★, S★, L) locked their asset set in one burst before video (S★: 73 of 78 image jobs in about 100 minutes) and wrote the whole film outside Higgsfield (S★ cites "Part G1" of a production bible). They put 53–85% of their video jobs into the film. Two of the three heavy films spent their volume on cheap stills (F★ 92% image jobs; BZ 1,725 Nano Banana edits) [INFERRED that this is the same rule at higher precision].
- For us: 03 by D5 and `SLA_SHOTS.csv` before any Seedance credit, as the calendar already says.

**7. Each take is written as one timed physical event: already running at frame one, timed beats, a stated end, physics as process.**
- Evidence: timecoded beats inside the take in 12/12. Opening state already in action in at least 9/12 (IP: "THE SHOT IS ALREADY RUNNING WHEN IT STARTS" in 883/886). End state or FINAL FRAME stated in at least 8/12 (B★ 65%). Physics written as rules or process in at least 11/12 (L: "EVERY ACTION STARTS FROM ITS REAL BEGINNING"; H's gait cycle; BZ PHYSICS block in 153/195).
- For us: our 05 event script already has timed ranges. Add "frame one is already running" and FINAL FRAME / continuable end (3B Template T1).

**8. Approved output becomes the next shot's reference.**
- Evidence: 11/12 fed approved frames or clips back in (all except TK, which used Elements only). S★: last approved frame as an image plus the previous clip as video in 5/13 jobs. L: 9 of 15 uploads are frame grabs. B★: an edited bedroom clip (`c2b10721`) was the "LOCATION ONLY" reference in 107 later jobs. T: a 17-link extension chain.
- For us: a chain log and fixed role wording for "last approved frame" and "previous approved clip" (3C §2).

**9. Fix a near-miss in place before rerolling it.**
- Evidence: 8/12 extended or edited an existing take instead of regenerating it; 7/12 have such a result in the final film (B★ F★ K★ S★ T IP BZ; H's 3 edits went unused). K★: a one-sentence `video_edit` for tempo, a forward extension for the next beat and a video-referenced reaction gave about 18 s of the film.
- For us: our 05 §5.8 edit and extend tasks, used earlier: before a reroll, not only after the cut.

**10. Sound: native audio on, music banned in the prompt, score in post; dialogue counted, or designed out.**
- Evidence: `generate_audio` on in 12/12 and "No music" written in the prompt in 12/12 (B★ 91% of prompts; C 432/443). An exact spoken-line count in 6/12 ("Exactly THREE spoken lines in the whole take … NO other voice anywhere", B★). Native lip-synced dialogue in 8/12; K★, BZ and H kept mouths off screen and carried words by V.O. or subtitles.
- For us: our 05 audio policy matches. Add the line-count lock and the V.O. forms (3B §10).

**11. Long continuous takes are the hero format, and a one-shot can be built from links.**
- Evidence: long single takes as the hero format in 6/12 (B★ F★ K★ S★ L T). A whole film (or nearly) as one continuous camera in 2/12: T (0 cuts from 0:21 to 5:30, 15 forward links plus one pinned backward link) and F★ (4 visible edit points in about 194 s, joins made with frame-locked in-fills). B★'s two 30 s one-takes open the film.
- For us: a one-shot sequence is a scope decision at the animatic gate [INFERRED]. The tools exist on our route (`video_extension`, `video_edit`), but the source-file rule must be tested first (section 4.0, D-4).

**12. Design the AI failure modes out of the script and the framing.**
- Evidence: foreground occluders or partial framing inside takes in 6/12 (T H B★ IP TK K★). Crowds and extras directed in text without Elements in 7/12 (IP TK C F★ T BZ H). C prevents clones by layout: "NO FACE IN THIS SEQUENCE IS EVER RESOLVED". K★: no lip-sync, the husband never seen, the creature only as legs. H: the creature lit only by one lamp or one phone beam.
- For us: 05b §5b.8 plus the crowd block (3D Card 5) and the creature or robot integration block (3D Card 7).

**13. The camera is a person, and optics are numbers.**
- Evidence: "an operator, not a rig" wording in 6/12 (B★ S★ L F★ H C). S★, in 13/13: "the camera is a person physically present, it breathes, drifts and micro-adjusts; no smooth stabilised gimbal". Optics given per shot as mm (L 42/43, TK 95%) or as field of view in degrees (C 250 prompts, BZ). The fix for S★'s pirogue shot was a lens line: "35mm lens — no zoom, no telephoto: the shore stays far and Mariama stays small".
- For us: our 05 writes field of view in degrees; keep it and add the operator sentence to the variant camera behaviour (02).

**14. Post is the glue: one global grade, a letterbox inside 16:9, grain once.**
- Evidence: one global grade over every clip in 5/12 (B★ K★ L C BZ). Scope picture cut from 16:9 renders in post in 3/12 (B★ BZ TK), with prompts protecting the crop ("16:9 protecting a 2.39:1 crop", B★; "central approximately 74% of the image height", TK). Grain banned at generation and added in post in 3/12 (C, BZ, S★ for references). B&W made by converting colour renders in 2/12 (BZ, K★ bookends); 0/12 asked the video model for B&W.
- For us: 07 §7.6 already grades and adds grain once in post. Decide the letterbox (section 4.0, D-9).

**15. Resolution: a re-run is a different take, so keep the take you approved.**
- Evidence: draft mode used in 0/12. Re-running a low-resolution winner made a different take, and 3 films kept the low-resolution one (K★: the one 1080p re-run went unused; F★: the lit half of Sc_07 is the 720p take; IP: "the performance won over the resolution"). At least one take below 1080p reached the final cut in 7/12. B★ is the counter-case: every frame-verified final is 1080p.
- For us: this supports 05 rule 2 (finalize the approved draft with `draft_job_id`; never re-run it at 1080p). No study tested that route, so D1 test T3 must prove that finalize keeps the approved performance.

---

## 2. Tool stacks of the 12 films

| Film | Video models (jobs) | Video jobs in the film | Main image models (jobs) | Identity carrier | Blocking | Post and outside tools | Resolution of finals | Generated : story seconds |
|---|---|---|---|---|---|---|---|---|
| B★ The Breach | Seedance 2.5 514 · Cinematic Video Editor 7 (none confirmed in film) · Seedance 2.0 6 · MiniMax H3 2 · Gemini Omni Flash 1 | about 20 (~4%) | Nano Banana 2 251 · Soul Cinematic 173 · Nano Banana Pro 121 · GPT Image 2 73 · Soul Location 33 · Seedream 5 Pro 20 · Soul V2 19 | uploaded composite sheets + MASTER stills + the approved take as location reference | grey-box previz (≥12 versions, tool not recorded) + phone gesture clip | external editor: darker, colder grade, vignette, ~2.35 letterbox, subtitles; no upscale | every frame-verified final 1080p | ≈35:1 [ARITH] |
| F★ Fukushima | Seedance 2.5 252 (66 `video_edit`) · Genjutsu Object Swap 3 | about 11 takes + 8 in-fills | Seedream 5 Pro 2,031 · GPT Image 2 430 · GPT Image 2.5 291 · Nano Banana Pro 96 | 34 Elements | prose camera route, pencil-sketch element, snapshot frames | NLE (unnamed), master 2206×946; 9 uploaded music tracks | 1080p + 2×720p | 22:1 |
| K★ Kimti | Seedance 2.5 43 (edit 1, extension 1) | 23/43 (53%) | Soul Cinematic 87; sheet and identity edits made outside the project (model not named) | face + costume sheet; Soul plates as start frames | text only | NLE: B/W bookends, warm day grade, 4:3 pillarbox, V.O. [INFERRED]; external LLM for prompts | 14×1080p, 9×720p | 3.7:1 |
| S★ SÉKOU | Seedance 2.5 13 · Cinematic Video Editor 3 | 11/13 | GPT Image 2 77 · Seedream 5 Pro 1 | raw 4-slot packs + last frame + previous clip | text only | NLE; no regrade visible; about 148 s from clips outside the project | all 1080p | ≈1–1.4:1 [ARITH] |
| L LEAK | Seedance 2.5 43 (Kling credited, not in the project) | 32/43 (74%) | Elements made outside (GPT Images 2.0 credited); Nano Banana Pro 7 in project | 20 Elements + frame grabs + 2 start/end pairs | overhead floor-plan Element, master stills | Premiere Pro + DaVinci Resolve, Topaz Apollo, AI score; Claude credited | all 1080p | 3:1 |
| U UNPROMPTED | Cinema Studio Video 4.0 128 (no Seedance) | 28/128 (22%) | Seedream 5 Pro 742 · Soul Cinematic 320 · GPT Image 2.5 81 · Soul Location 75 · GPT Image 2 57 | one heroine image (75/128) + A/B plates + frame grabs | text + 3 Cinema Studio camera presets | outside, not visible | 720p | 8.5:1 |
| T THREAD | Seedance 2.5 214 (extension forward 147 / backward 22, edit 8) · Topaz Video 19 | about 21 pieces | Soul Cinematic 275 · Nano Banana Pro 190 · Seedream 5 Pro 122 · GPT Image 2 9 | raw sheets + the extension chain | text + each link's source video | NLE assembly; Topaz to 4K inside Higgsfield; 200 SFX uploads | 720p → Topaz 4K | 16.6:1 |
| TK TOKYO 4:17 | Seedance 2.5 64 | 27/64 (42%) | Soul Location 204 · Soul Cinematic 152 · Soul Cast 84 · Seedream 5 Pro 38 · GPT Image 2 13 | 28 Elements only (0 media inputs) | text only | external editor, 2.34 centre crop; 9 music beds; Seed Audio 1.0 (3 voice pickups) | all 1080p | 3.5:1 |
| IP In Passing | Cinema Studio 4.0 713 · Seedance 2.5 173 · Cinematic Video Editor 60 | 89 verified cuts (79 Cinema Studio, 9 Seedance) | none in project (35 Elements made outside) | 35 Elements | text: compass, named camera positions | outside; Cinema Studio ambience beds; 17 SFX + 3 music uploads | 1080p + 2×720p | 28.4:1 |
| C CONTROL | Seedance 2.5 443 · Kling 3.0 3 · Seedance 2.0 2 | intro 12/25 (48%) + 33 drama jobs verified | Seedream 5 Pro 111 · Soul Cinematic 83 · Nano Banana Pro 56 · GPT Image 2 6 · Soul V2 4; Midjourney 2 | 53 Elements + re-uploaded clips + 6 voice recordings (64 jobs) | marker stills (~80 prompts), composition stills | NLE; archive degradation in post; sound by a studio | 1080p | ≈8:1 [ARITH] |
| H HUNGER | Seedance 2.5 207 (3 edits, unused) | 42/207 (20%) | Seedream 5 Pro 186 · Nano Banana Pro (Unlimited 24 + 7) · Soul Cast 1 | 40 Elements + video refs to neighbouring shots | text + eye-level plates | outside: mirrored shots, punch-ins, split screen; separate mix and stems | 720p + 2×480p | 9.8:1 |
| BZ Buzkashi | Seedance 2.5 195 · Kling 3.0 32 · Cinematic Video Editor 19 | 30 Seedance + 4 Kling (+1 via editor) | Nano Banana Pro 1,725 | 5 one-image Elements (4 character, 1 horse) + one Nano Banana keyframe per shot | keyframes (stills) | NLE: B/W conversion, sliding 2.34 letterbox, 4K 10-bit; upscale outside [INFERRED]; Midjourney 1; 34 VO takes | 17×720p, 10×1080p, 3×480p | 8.6:1 |

**What the comparison says.**
- **Seedance was the only video engine in the matched picture of 5 films** (B★, F★, TK, H, T with a Topaz upscale), plus K★'s project part. S★ added Cinematic Video Editor continuations. L, C and BZ mixed in some Kling. U and IP are Cinema Studio films.
- **Identity carriers split 7 to 5.** Higgsfield Elements in 7/12 (F★ TK IP L C H BZ); raw attached images in 5/12 (B★ K★ S★ T U). Both reached strong results; three of the four favourites used raw images.
- **The image workhorse varied by film:** Seedream (F★ 2,031 jobs, U, H, C), Nano Banana Pro (BZ 1,725, T sheets), GPT Image 2 (S★ all assets; TK realism pass), Soul tools (K★ plates, TK casting and locations). The GPT Image family carried identity in S★ and TK. Mapping any of this onto Sunburst or Nano Banana 2.1 is [INFERRED].
- **Blocking was mostly text.** Only B★ used grey-box 3D previz. Three used still-based blocking (C marker stills, L floor plan, F★ pencil sketch). No study reports motion-control or camera-control presets on a Seedance job.
- **Sound inside the generator** appears in 3/12: B★ 30 s audio plates, IP ambience beds and ADR carriers, T a 480p sound plate. Topaz in 2/12 (T, L). An NLE was named only by L (Premiere Pro + DaVinci Resolve).

---

## 3A. Image prompts: assets, plates, props, look-dev, edits, model routing

Scope: character identity sheets, location plates and reverse angles, props, look-dev and style anchors, surgical edits, and which image model does which job. Checked against `skill/abostesha-film-pipeline/references/03-assets-images.md` (sheet names below are 03's: `face`, `body`, `turn3`, `heads5`, `expr6`, `ward-<LOOK>`; locations `master`, `rev`, `angle-<n>`, `look`; props `views`, `macro`).

LEAK and In Passing made their assets outside the project, so most of their image prompts are not public; they count only where the study shows the practice.

### 3A.0 The image rules with the most evidence

| # | Rule | Films | n/12 |
|---|---|---|---|
| 1 | Character references sit on a plain neutral grey (mid-, light- or warm-grey) studio background, not in a set | B★ F★ K★ S★ T TK U C H BZ (L used graded 9:16 casting boards) | 10 |
| 2 | Props are isolated product shots on neutral grey or a neutral ground, one object per image | B★ F★ S★ T TK C H BZ L | 9 |
| 3 | Location plates are empty: the set only, no people | B★ F★ S★ T TK L U C H | 9 |
| 4 | Every reference in an image prompt gets one job, plus what NOT to take from it | B★ F★ S★ T TK C H BZ | 8 |
| 5 | Skin realism is written in words: pores, no retouching, "photographed, not rendered/illustrated" | B★ F★ S★ T TK C BZ U | 8 |
| 6 | Each wardrobe or story state (wet/dry, clean/bloody, growth stage, memory look) gets its own sheet or Element | B★ F★ S★ T IP H BZ L | 8 |
| 7 | Asset fixes are "change ONE thing, keep everything else" edits on the approved image, not re-prompts | B★ F★ S★ T H BZ L (+K★ [INFERRED], prompts not public) | 7 |
| 8 | One fixed look sentence or suffix is pasted into every still | B★ F★ K★ T U H BZ | 7 |
| 9 | Locations reach video with their look already baked in (pre-graded plate, lens pass, or style block in the plate prompt) | F★ K★ T L U H BZ | 7 |
| 10 | Assets wrapped as one-image Higgsfield Elements (the others attached raw images: B★ K★ S★ T U) | F★ TK IP L C H BZ | 7 |
| 11 | Short one-line edit prompts are the asset factory (median 24 words on Nano Banana 2 in B★, 19 words in BZ) | B★ F★ S★ U C BZ | 6 |
| 12 | New views of an approved place are edits of that plate ("only change the camera…"), never fresh text | F★ T U H BZ | 5 |
| 13 | Early engine shoot-out: one prompt or look brief on 2–7 image engines, then commit (TK's later GPT Image 2 vs Seedream head-to-head on one re-sheet prompt is not counted) | B★ T H BZ U | 5 |
| 14 | Asymmetric marks are named with a side (scar LEFT, mole right cheek); 2 also add "do not mirror" | S★ F★ C BZ L (do-not-mirror: S★ F★) | 5 |
| 15 | When a reference image and the text disagree, the image wins (whistle colour, memory wardrobe, start-frame dress) | S★ L K★ | 3 |

Separate sheets or text for states. Separate sheets per state in 8/12 (row 6). Small marks were written as text on a clean sheet in 5/12: B★ "Clean face in this sheet (soot is a scene state)", S★ "only the one fingertip that touched the wood is dirty", L "write the scene state into the cast line every time", TK costume-state fence, T "red on the INSIDE". [INFERRED] Use separate sheets for **wardrobe and big body states** and text for **small dirt or blood marks**. In Passing gives the reason for separate sheets: so "a prompt never has to ask the model to change clothes".

### 3A.1 Character identity sheets

**Sheet formats that reached a film:**

| Layout | Films | Notes |
|---|---|---|
| Face close-up + **headless** full-body front + back: one readable face | S★ (E4), C (E12), B★ (composite assembled outside and re-uploaded) | 3/12. Headless front "avoids two competing faces" (S★); "headless bodies stop face bleed between panels" (C). Matches our `turn3`. |
| Full-body front, full-body back, close-up: two faces | F★ (final 3-panel), T (front, back, large ¾ portrait), TK (all 8 Elements) | 3/12. It worked: TK's faces held across 64 Seedance jobs and T's man sheet sat in 145 jobs. No study shows two-face sheets failing. |
| Two panels: face close-up (85 mm) + full body (35 mm) | U (391 sheet prompts), BZ | 2/12 |
| Separate images: front face / full-body costume / profile (K★), or a 4-slot pack: front / ¾ / profile / 3-panel sheet (S★) | K★, S★ | Packs go in as 4 slots; S★ tells Seedance "Use whichever angle matches the head position in each moment". |
| 9:16 "casting board": 6–11 candid behaviour stills + a text card | L | 1/12. Carries behaviour, not just looks. Made in the film's grade (the only non-grey format). |

**Aspect and size seen.** 16:9 sheets in F★, T, TK, C, H and BZ, at 4K for promoted sheets (TK, T). S★ asked for "21:9" in words with ratio 1:1/auto and got 2048² squares, so **set the aspect parameter; words only steer composition**.

**The character pipeline (favourites first):**

| Step | B★ | F★ | K★ | S★ | Others |
|---|---|---|---|---|---|
| Find the face | Soul V2 spec headshot | **cast the face inside the real location** ("wide documentary photograph … THE CENTRAL FIGURE … faces the camera"), then pull it out | Soul portrait test, then a 3-image sheet made outside the project | text-only casting photo, no reference | TK: Soul Cast rounds, 4 of 84 kept; C: Soul face "use structural description only"; H: 4-model bake-off |
| Lock identity | chained portrait: "<<<image_1>>> defines … EXACTLY … do NOT copy the emotional expression" | "Use Image A as the only character reference" + preserve list | face sheet in 21/43 video jobs | "Keep their identity exactly … Do not recast. Do not beautify." (41/78 prompts) | TK: GPT Image 2 4K "re-photograph, don't redesign" pass |
| Angles | one-line edits ("create the back side of this costume"; Angles 180° rotate) | grey studio front/back → crop/zoom close-up | profile image | ¾ and profile each a "same session" edit **of the front** (star-shaped, so errors do not compound) | — |
| Skin | "living skin … broken capillaries" in the spec | **separate Nano Banana Pro skin pass** (~500 chars) | — | "Real skin texture, real pores, no retouching" (11/13) | TK realism ladder |
| Costume | headless ghost-mannequin front/back by edit ("make full body uniform … without the head") | **costume canon first**: turnaround with a HEX colour map, then emblem/helmet/pocket edits | one fixed costume phrase repeated in 11 video prompts | the 3-panel sheet carries body, back and shoes | IP: wardrobe flat-lay used as a repair reference |
| States | separate dinner-dress sheets | `char_engineer-final` dry vs `-wet` | — | full 4-image pack per state, re-derived from the master with "The only change: …" | T bloody/clean; H one Element per growth stage; BZ boy dirty/clean |

#### Template A1: casting photo / identity seed (no reference) → our `face`
Sources: S★ E1 (all 13 casting prompts share "85mm lens, f/4", eye level, overcast window, matte mid-grey), B★ E1 (header + LIGHT/SUBJECT/EXPRESSION/FRAMING blocks), our 03 §3.1.4 PLATE BLOCK. Run in GPT Image 2.5 Sunburst (max, 4k, 3:4) and Nano Banana Pro (4K, 3:4), as 03 already says.
```text
{{CODE}} · {{VISUAL HANDLE}} — identity seed ({{STATE: default}}) · 3:4
Casting photograph, straight-on, head-and-shoulders to mid-chest, 85mm lens, f/4, eye level.
SUBJECT: {{origin}}, apparent age {{N}}, {{height cm}}, {{build}}. {{face shape, brow, eyes, nose,
mouth, jaw}}. {{ONE asymmetric mark WITH A SIDE: "a small mole 1 cm below the LEFT corner of the
mouth"}}. {{one "only because" detail (S★'s device; never S★'s own trait), e.g. "{{a small feature}} visible only because
the lips are relaxed and slightly parted"}}. {{hair: length in cm, texture, cut}}.
EXPRESSION: neutral, eyes on lens, lips relaxed — NOT smiling, NOT posed, NOT {{the state's wrong extreme}}.
WARDROBE: {{plain base garment, no logos}}.
{{PLATE BLOCK}}
Real skin texture, real pores, no retouching, no beautification. Photographed, not illustrated.
No text, no logo, no watermark, no border, no grain overlay.
```
- The header code makes finals traceable (B★: a header on 91% of prompts).
- The side-named mark is in S★, F★, C, BZ and L.
- "No grain overlay" keeps the reference clean; the look is added at video time (S★, 12/13).
- "85mm lens, f/4" is a lens length, not a brand, so it does not break 02 rule 2. The age number stays in the asset sheet only (05b rule 6 bans age words in performance text).
- Our 03 avoids "photorealistic" with faces, but S★, F★, T, TK, C, H and BZ all used it on faces with no reported plastic-skin problem. Keeping the ban is our own caution, not study evidence.

#### Template A2: same-session angle (¾ or profile) → our `heads5` angles
Source: S★ E3, the template for 13 three-quarter and 14 profile prompts.
```text
Use the person from the attached image. Keep their identity exactly — same face, same skin tone,
same hair, same age, same clothing. Do not recast. Do not beautify. Do not change age.
Traits to preserve: {{the A1 trait list, verbatim}}.
Photograph them again in the same session: same {{light}}, same {{backdrop}}, same 85mm lens at
f/4, same eye-level camera, same neutral expression with the mouth relaxed.
{{Head and shoulders turned to a three-quarter angle | in full profile}} with the {{LEFT}} side of
the face toward the camera ({{mark}} side), eyes looking just past the lens, chin level.
The {{mark}} is on the {{LEFT}} {{place}} and must stay on the {{LEFT}} side — do not mirror the image.
Real skin texture, real pores, no retouching. Photographed, not illustrated. No text, no grain
overlay, no vignette.
```
Rule: always attach the **approved front**, never the previous angle (S★: star-shaped chain). Under 03 rule 5 (untouched base) this is an edit on a copy; the approved front itself is never re-processed.

#### Template A3: state or wardrobe variant → our `ward-<LOOK>`
Sources: S★ E2/E5, B★ E2, F★ (wet/dry), L (tuxedo restyle).
```text
Use the person from the attached image. Keep their identity exactly — same face, same skin tone,
same age, same {{2–4 named traits}}. Do not recast. Do not beautify. Do not change age.
Do not mirror the image — the {{mark}} stays on the {{side}}.
The only change: {{REPLACE x with y}} — not {{the motif colour}}, not patterned, {{other NOT}}.
Photograph {{him/her}} again in the same session: {{repeat the A1 camera, light and backdrop line verbatim}}.
Real skin texture, real pores, no retouching. Photographed, not illustrated. No text, no grain overlay.
```
- Always derive from the **master front** (S★).
- Write what the change is NOT when the colour is a story motif (S★: grey cloth "not yellow").
- For expression-bearing states (wounded, wet, exhausted), add B★'s line: "Use only the face and wardrobe identity; do NOT copy the emotional expression from the reference."

#### Template A4: 3-panel Seedance sheet with one readable face → our `turn3`
Sources: S★ E4, C E12, F★ (pose and CRITICAL lines), our 03 §3.1.5.
```text
Use the person from the attached image(s). Keep their identity exactly. Do not recast. Do not
beautify. Do not change age.
One image, three equal vertical panels, same width, same height, hard even splits, no decorative
borders, no labels, no gaps.
Panel 1 (left): front view of the full body from the neck down to the feet, NO head in this panel
{{HEADLESS VARIANT A/B from 03 §3.1.5}}, standing straight, arms hanging naturally at the sides —
{{look item list}}.
Panel 2 (centre): back view of the full body from the top of the head to the feet — {{back
construction, hair from behind, footwear}}.
Panel 3 (right): close-up of the face, straight on, neutral expression, top of the head to the
collarbones — {{A1 traits}}. The {{mark}} stays on the {{side}} — do not mirror the image.
CRITICAL: hands must NOT be clasped behind the back, folded, crossed, hidden, or placed in pockets;
in the back view both arms and hands stay visible. Keep anatomical left/right: {{emblem/patch}} on the
{{LEFT}} in both body views.
Skin renders at identical value and hue on face, neck, arms and hands in every panel.
Do not use the input image background. {{PLATE BLOCK}} No text. No logos. No grain overlay.
```
- With separate input images, name the source of each panel as C does: "Center panel — … using <<<image_2>>> as reference".
- One-line fix if a head appears (C, verbatim): "the full body central panel is cleanly HEADLESS, cut straight and flat across the base of the neck with no head, all the rest is identical".

#### Template A5: realism pass ("re-photograph, don't redesign")
Source: TK E2. The same 9,466-character GPT Image 2 4K prompt ran on 4 Soul Cast picks, and all 4 became Elements. Condensed, keeping TK's own headers:
```text
Use the provided image as the ABSOLUTE MASTER REFERENCE. Enhance and reconstruct this existing
{{three-panel sheet | identity plate}} at significantly higher photographic quality.
THIS IS NOT A CHARACTER REDESIGN. DO NOT invent a new {{person}}. DO NOT beautify. DO NOT make
younger. DO NOT make more conventionally attractive. DO NOT change facial anatomy.
== ABSOLUTELY PRESERVE == apparent age · facial structure · eye shape and spacing · eyelid anatomy
· brows · nose shape and width · mouth and lip proportions · jawline · chin · ears · skin tone ·
facial asymmetry · facial hair · the wardrobe EXACTLY as in the reference.
== FACIAL PHOTOREALISM == visible but subtle pores, minor pigmentation, slight natural redness,
individual brow hairs and lashes, moist eyes, real lip texture; physically plausible subsurface
scattering. Avoid smooth AI skin. Avoid waxy skin. Avoid excessive micro-detail or artificial
sharpening. The face should look photographed, NOT rendered.
== HAIR / FABRIC == real strands and flyaways; real weave, creases, seams.
== THREE-PANEL CONSISTENCY / LAYOUT == keep panels, scale and order exactly.
== LIGHT / CAMERA == {{our PLATE BLOCK light}}; full body ≈70 mm, close-up ≈85 mm f/4; subtle lens
softness rather than digital oversharpening; no HDR, no artificial clarity.
== QUALITY TARGET == IDENTITY > BEAUTY. REALISM > POLISH. MATERIAL REALISM > DIGITAL SHARPNESS.
HUMAN IMPERFECTION > AI PERFECTION.
== ABSOLUTELY AVOID == new identity, younger appearance, model/idol appearance, larger eyes, smaller
nose, perfect symmetry, plastic or wax skin, HDR, oversharpening, CGI, different person between panels.
```
- **Mandatory caveat from TK:** never name garments in a realism prompt shared across characters. TK's prompt named A's tie, and B, who wore an open collar, was given a tie. Write only "preserve the wardrobe exactly as in the reference".
- Our 03 rule 5 ("the approved face plate is never passed through a model again") clashes with this pass only if it runs after approval. Run A5 **before** the user approves the plate [INFERRED sequencing].
- TK lit its sheets with a soft key at 45° camera-left and gentle fill ("Do not flatten the face"). Five films used flat or soft-even light (B★ F★ S★ T C) and U a single lamp with no fill. Keep our flat PLATE BLOCK; use TK's key only as the fallback if the right panel reads flat.

#### Template A6: two-reference re-sheet (layout from one image, identity from another)
Source: TK E3. The same prompt ran on GPT Image 2 (kept) and 4× on Seedream (lost).
```text
Use the TWO provided reference images for TWO COMPLETELY DIFFERENT PURPOSES.
REFERENCE IMAGE 1 = FORMAT / LAYOUT / CAMERA / STUDIO TEMPLATE ONLY.
REFERENCE IMAGE 2 = CHARACTER APPEARANCE ONLY. Do not mix the purposes.
REFERENCE IMAGE 2 ALWAYS WINS for: identity, face, age, body, hair, makeup, wardrobe, colour,
accessories, shoes. REFERENCE IMAGE 1 ALWAYS WINS for: layout, panel order, framing, camera,
subject scale, background, lighting, presentation.
Preserve what is known. Only invent what is genuinely missing.
REFERENCE 1 = HOW TO DISPLAY {{HIM/HER}}. REFERENCE 2 = WHO {{HE/SHE}} IS.
Do not redesign. Do not beautify. Do not average the two people together. Do not create a hybrid identity.
```
Use it to pull a face approved from a film still, or a "re-photographed" still, into our standard sheet grammar.

#### Template A7: designed-face imperfection blocks (faces written from text)
Source: TK F4/F9 (hostess text sheets of 11.8k–17.6k characters). Add to A1 when no casting round picked the face.
```text
DISTINCTIVE HUMAN DETAILS: {{one tiny mole low on one cheek}}, slight eyelid asymmetry, minor
asymmetry in the corners of the mouth, a tiny irregularity in eyebrow density. They should be
details discovered when looking closely.
SKIN: healthy but NOT flawless skin. NO glass skin. NO porcelain skin. Photographed rather than rendered.
PERSONALITY IN A STILL: {{one sentence, e.g. "the energy of someone who reacts immediately when
someone says something ridiculous"}}.
ABSOLUTELY AVOID: generic AI beauty, idol face, anime face, doll face, giant eyes, tiny artificial
nose, perfect facial symmetry, overfilled lips, plastic skin, influencer appearance.
```
Hard physical facts work too: BZ "a nose crooked from an old improperly healed break, noticeably asymmetric ears". Villains and minor roles are written as ordinary people (TK E4: "Calm and alert, without an exaggerated villain expression").

#### Template A8: short sheet for a minor role (about 3k characters)
Source: TK E4 (Seedream 2K; two pursuers, in 17 and 28 video jobs). Panel order: LEFT close-up (≈85 mm) | CENTER full-body front (≈70 mm) | RIGHT full-body back, "Match the center panel's body scale, camera height and floor line exactly." Then: CHARACTER (age, height in cm, build) → face + "Natural facial asymmetry, visible pores and subtle under-eye fatigue" → HAIR length in cm → WARDROBE + NOT-list → STUDIO PRESENTATION → STRICT CONSISTENCY ("Exactly one identity, one hairstyle, one outfit and three views") → final NOT-list. Map it onto A4's one-face layout if we keep that rule [INFERRED adaptation].

**Real-looking faces: checklist with evidence.**
1. **Pick, don't describe.** TK kept 4 of 84 Soul Cast candidates. Our equivalent: 2–4 takes × 2 engines, and let the user reject the prettiest [INFERRED mapping; Soul Cast is not in our stack].
2. **Age as a number and height in cm** in the asset sheet (S★, TK E4, H).
3. **Name 1–3 imperfections with sides** (S★, F★, C, BZ, L, TK).
4. **Cast in context, then extract** (F★). If a studio face reads synthetic, generate the person inside a real-looking location still and pull identity back to grey with A3 or A6. TK did the reverse (grey sheet → Soul Cinematic with an empty prompt → re-sheet), the "de-AI" loop [INFERRED for our engines].
5. **A dedicated skin pass on the close-up** (F★ Nano Banana Pro; TK GPT Image 2). F★'s pass, translated from Russian: subsurface scattering, light vellus hair, barely visible pores and expression lines, slightly oily T-zone, moist eye corners, lashes of varied length, fine hair along the hairline. Our candidate: Nano Banana 2.1 as an edit on a copy, masked back (03 rule 5) [INFERRED].
6. **Cap the realism.** "Avoid excessive micro-detail or artificial sharpening" (TK). Over-sharpened pores read as CG.

**Extras.**

| Practice | Films | Use for us |
|---|---|---|
| Anonymous extras live **only in the video text**, never as a sheet or Element | TK (the extras folder was never attached to video), IP ("Anonymous crowds are text only — never an Element") | default |
| Featured (plot-relevant) extras get a small pack: front + sheet (S★: "Extras … as 2 images"), or one Element with a **colour-separation note** against the leads (IP) | S★, IP | `face` + `turn3` only |
| A random-extra generator sheet, layout reference only | TK E5 (2 of 13 runs kept; **never used in video**) | bible, poster, look approval only |
| Clones prevented by layout in video (no resolved faces, occluders) | C | video side (3D Card 5) |

**Template A9: featured-extra note**, appended to the A1/A4 prompt and to the Element description. Source: IP F2.
```text
{{ROLE}}: NOTHING {{HE/SHE}} WEARS IS {{lead 1 colour}} OR {{lead 2 colour}} — must read apart from
{{lead}}'s {{garment}} inside a single frame. Identifying prop readable at four metres: {{prop}}.
Take identity and wardrobe from this element; take the beat's staging, hands and eyeline from the
shot's prompt.
```
IP never attached more than two character Elements per generation; a pair that is always together was one Element.

**Template A10: extras variety (stills only).** Source: TK E5. "Use the provided reference image ONLY as a strict CHARACTER SHEET FORMAT AND LAYOUT REFERENCE. DO NOT copy … the person shown." → "Generate ONE COMPLETELY NEW, RANDOM, UNIQUE …" → randomise face, height (cm range), build, hair, wardrobe → anti-default list: "DO NOT default to the same standardized attractive AI face. Avoid repeatedly generating: small V-shaped face, large eyes, tiny nose, full lips, perfect symmetry." A multi-person grid in one image is [INFERRED]; TK ran one person per generation.

**Non-human co-leads (robot or creature).** Source: H (Yoki, 40 Elements; the non-human appears in about 23 of 42 final takes). Video-side wording is in 3D Card 7.
- Design on neutral grey, "photographed as if physically present on set". A dark, matte, low-specular body with one bright plane (face or visor) where the practical light will fall.
- One Element per state or stage.
- **A scale line-up sheet** (H E2): "This is a technical continuity lineup, not a cinematic scene … All figures should stand on the same floor baseline", with the human lead in cm and outfit. H's own sheet missed its cm targets on all four stages (measured: about 70/105/135/200 cm against 40/90/160/260–280 asked), so keep cm and a body landmark in every shot prompt as well.
- **Mutate, don't redesign** (H E3): "Use the original … as the STRICT identity reference … NOT a new monster species" + an IDENTITY — MUST PRESERVE list. Fix body and face in separate passes ("The body is already correct. Do not redesign the body.").

### 3A.2 Location plates and reverse angles

| Practice | Films | n |
|---|---|---|
| Empty plate, no people | B★ F★ S★ T TK L U C H | 9 |
| Camera given as a position: height in m or cm, lens mm, which wall is frontal, distances | F★ K★ S★ T H U | 6 |
| Story geography and affordances baked in (pickup "with its engine running", the doorway the light strip enters through, room left for the creature) | S★ F★ K★ B★ H | 5 |
| New angle or reverse = edit of the approved plate, the plate as geometry-only reference | F★ T U H BZ | 5 |
| Same camera, new state (time of day, clutter phase, relight) as an edit | H BZ IP F★ | 4 |
| Two opposite plates of one room | T ("TWO VIEWS OF ONE SINGLE ROOM … There is only ever ONE bedroom" in video) | 1 |
| An edited video clip of the set as the location bible | B★ (`c2b10721` "defines TOMMY'S ROOM ONLY" in 107 jobs) | 1 |
| The TARGET plate of shot N is the STARTING plate of shot N+1 | U | 1 |
| Eye-level plate for a small subject | H | 1 |
| A lens/optics pass unifying all plates (154 jobs) | F★ | 1 |
| A seam plate showing state A and state B in one frame, for transitions | U | 1 |
| Blocking aids made as images: pencil-sketch version of a frame (F★), red/yellow stick-figure marker stills (C, ≈80 prompts), overhead floor-plan Element (L) | F★ C L | 3 |

**Plate block order (merged).**
- F★: `<medium + grain> → <place, year, time, weather, state> → CAMERA AND COMPOSITION → <named zones> → materials/colours → damage → DEPTH OF FIELD → AVOID`.
- S★: "Photorealistic 21:9 still, <lens>, <camera height/position>" → place and props **in reading order** → time, weather and light → "No people. No text." (13/13).
- K★: every element gets a position and a distance; light is given by clock and cloud ("Soft 9 a.m. daylight filtered through a thin veil of cloud"); the `Avoid:` list is built from what the last variant drifted into.

#### Template B1: location master plate → our `master`
Merges F★, S★ and K★ into our 03 §3.1.6.
```text
{{LOC_CODE}} · {{PLACE}} — master plate ({{TIME}}) · 16:9, single wide frame, no people.
{{PLACE}}, {{date/era}}, {{clock time}}, {{weather}}, {{state: intact / after the storm / cluttered}}.
CAMERA AND COMPOSITION: camera at {{m}} height, {{3/4 angle along main axis}}, about {{mm}}
full-frame; {{which wall is frontal}}; {{what sits in the left / centre / right third}}.
IN READING ORDER: {{nearest thing}} → {{anchor landmark at frame position}} → {{far thing}}, with
distances: "{{object}} {{N}} metres from {{object}}". STORY AFFORDANCES ALREADY IN PLACE:
{{the door the actor exits by, the vehicle "with its engine running", a clear action corridor along
{{path}}, room for {{subject}} at {{spot}}}}.
MATERIALS AND WEAR: {{surfaces, exact colours, damage}}.
LIGHT: {{sun azimuth/elevation from the ledger}}; {{each practical with direction and K}}; where the
light STOPS: "{{most of the room remains in deep shadow}}".
DEPTH OF FIELD: {{deep enough to hold the anchor}}.
{{PREFIX_PLATE}} Photographed, not illustrated. Every building generic and unbranded.
No people. No text. No readable signage. Avoid: {{items the last failed variant drifted into}}.
```

#### Template B2: reverse angle of a locked room → our `rev`
Source: T E4 (GPT Image 2; image_2 in 39 Seedance jobs; with the master it kept a 180° pan inside one room). Also F★: "the REVERSE SHOT of Image 1 … REFERENCE ROLES: Image 1 = the corridor … Image 2 = ONLY the quay layout … Image 3 = the red car — the ONLY source for the car".
```text
A wide interior shot, {{lens}} lens, camera at normal eye height. THE REVERSE ANGLE of the
reference room: the camera stands {{exact spot in the master, e.g. "BEHIND THE {{tall object}} in the far
left corner of the reference image"}} and looks back ACROSS the room, in a
THREE-QUARTER view, at the wall that was behind the camera in the reference.
The attached image is the location reference. It controls geometry, materials, light and atmosphere ONLY —
not framing. Do not use it as a starting frame, do not inherit its composition, its angle or its crop.
THE NEAR FOREGROUND: {{a soft fragment of a master-plate object, to tie the two views}}.
THE FAR WALL — the wall this picture is about: {{anchor 1}}, {{anchor 2}}, {{anchor 3}} — in that
order from left to right — are the {{three}} anchors of this picture.
LIGHT. One light logic only: {{the same source as the master, now from frame left/right}}.
{{FAILURE}} = a failed image. No people anywhere.
```
Order the anchors left to right (T). Keep one master object in the soft foreground [INFERRED from T's headboard]. Our 03 already asks for a `rev` plate for every dialogue location; T shows why: the two plates together hold the 180° line. Also try Higgsfield `/3d-jutsu` (03 §3.1.6) [not in any study].

#### Template B3: coverage angle, eye-level angle, or same-camera phase → our `angle-<n>`
Source: H E4 (34 coverage prompts) and H phase plates.
```text
Use the uploaded master reference as the exact same location. {{Camera approximately N cm above the
floor beside {{object}}, close to the eye level of {{subject}} | Camera positioned {{where / height /
direction}}}}. {{What dominates the frame and what space is left for the action}}.
Preserve the exact architecture, room dimensions, wall positions, doors, windows, ceiling height,
floor materials, furniture, fixtures, practical lighting sources and all spatial relationships.
Do not redesign, reinterpret, simplify or improve the location. This must be the exact same physical
place viewed only from a different camera position. Objects that logically remain fixed stay in
exactly the same places. Only change the camera position, camera height and viewing direction.
```
Phase variant (same camera, new state), in H's words: "Use the uploaded apartment reference as the exact same room and exact same camera angle. Do not move or redesign any architecture or furniture. Show the same apartment after {{time / event}}", ending with an affordance line such as "Leave physically plausible areas where {{subject}} can {{action}}".

#### Template B4: time-of-day or relight edit
Sources: BZ (93 relight edits), 03 §3.1.6 #2. Engine: Sunburst or Nano Banana 2.1 [INFERRED].
```text
Edit this photo. Fully re-light the scene for {{blue hour / 17:40 low sun from frame left}} — not a
color filter, but a real change in lighting. {{Which planes go dark, "dark and low-contrast but not
pure black — shape still readable"}}. Keep composition, camera angle, poses, and blur/focus levels
exactly the same — only the lighting and color of the scene change.
```
Sky continuity between neighbouring plates, BZ's wording (×20): "Change the sky to match <<<image_2>>> sky exactly — same {{clouds}}, same cloud shapes and lighting, same overall tone and mood, so both images read as the same location shot at the same time."

#### Template B5: seam plate (only for an in-take transition)
Source: U E12. One frame shows both states and how one becomes the other: "Across the middle of the frame the materials change without a wall or a door — the parquet becomes grey office carpet tile mid-floor, the moulding flattens into a suspended ceiling grid…". In U's order: shot size + locked-off + eye level → the change mapped element by element → one light source with no fill → one dominant hue plus one accent → a No-list. U fed its three seam plates to 10–18 video jobs each. That this teaches the video model the in-between is [INFERRED].

**Blocking aids made as images.**
- **Pencil-sketch blocking element** (F★ E4, Seedream): "Convert this image into a simple, loosely drawn pencil storyboard sketch. Preserve the original composition, camera angle, perspective, character pose, and placement of objects … Keep the face indistinct, without detailed facial features." In video: "pose and spatial reference only; its lines, strokes, paper texture must not enter the image". F★ used a sketch because a photoreal frame would take over the first frame and the lighting.
- **Marker still** (C): the location plate with red/yellow stick figures. In video: "BLOCKING REFERENCE ONLY … the RED marker is <<<…>>> … The coloured markers are annotations, not objects."
- **Overhead floor plan** (L): rooms labelled, furniture, a camera icon, stations 1–5, registered as an Element.
- **Naming hazard** (TK): an Element named `red-mirror` came out painted on the club's street sign. Name assets with neutral codes that are harmless if they appear as on-screen text.

### 3A.3 Props

| Practice | Films | n |
|---|---|---|
| Product shot, one object, neutral grey or neutral ground | B★ F★ S★ T TK C H BZ L | 9 |
| One image per prop state (gauge green / 800 °C; "one object, one state") | F★ B★ | 2 |
| Header code per prop (`$$$ PROP-03 · WALTHER P38 — side profile, worn · 4:3`) | B★ | 1 |
| The one detail that must survive is written in (thin thread, not rope) | T | 1 |
| Vehicles: 2-panel front-¾ / rear-¾ on light-grey seamless, drive side named, glass "transparent enough to see the driver when added later" (TK); 3 views + an empty interior (F★) | TK F★ | 2 |
| The prop image overrode the text and the casting photo (green whistle) | S★ | 1 |
| Isolate a prop from an approved image by edit: "isolate just the helmet on a gray background" | B★ | 1 |

#### Template C1: hero prop → our `views`
Sources: T E1 (spindle, in 25 Seedance jobs), B★ prop header, our 03 §3.1.7.
```text
{{PRP_CODE}} · {{NAME}} — {{view}}, {{state}} · {{1:1 | 4:3}}
A product photograph of a single {{object}}, isolated on a seamless neutral grey #8A8A8A background,
plain and empty, soft even shadowless light, even exposure, true-to-life colour.
The object: {{dimensions in mm}}, {{material and how it was made}}, {{wear: where hands have
darkened/smoothed it}}, {{construction: seams, hinges, fasteners}}.
{{THE DETAIL THAT MUST SURVIVE, stated with a scale comparison: "the {{detail}} is {{size}},
about as {{thin / small}} as {{familiar object}}"}}.
The object lies {{at a slight diagonal}}, fully visible and sharp from end to end, filling about two
thirds of the frame. Plain unmarked {{material}}; the only marking is {{exact fictional text in
quotes | a blank recess}}. Only the {{object}} on the grey background, nothing else in frame.
```
- T and TK used a soft shadow or light-grey seamless. Our plate laws ban the contact shadow; that is untested in the studies but does no harm.
- Per state, run A3-style edits: "The only change: the {{ring}} now {{glows green}}; everything else identical" [INFERRED from S★/F★].
- H made recurring props as "Create a recurring prop … on a neutral light-gray studio background".

### 3A.4 Look-dev: engine shoot-outs and style anchors

| Film | What was compared | Outcome |
|---|---|---|
| B★ | one coded prompt kit across Soul Cinematic, Cinema Studio, Nano Banana 2/Pro, GPT Image 2, Soul V2, Seedream (532 jobs over 2 days) | the doctrine changed 3 times, then froze as one look line (in 391 later prompts) |
| T | the same 300–550-word "cinematic film still …" on Soul Cinematic, Nano Banana Pro, Seedream 5 Pro, GPT Image 2 | winners became the world references |
| H | casting bake-off: Soul Cast, Nano Banana Pro ×2, Seedream 5 Pro, Seedream 4.5; Nano Banana vs Seedream keyframe tests | Seedream won the creature (Nano Banana's pale version was rejected) |
| BZ | one key-art prompt in Seedream 4.5, GPT Image, Image Auto, Nano Banana | Nano Banana Pro made every later still (1,725 jobs: sheets, keyframes and edits) |
| U | day-1 (08-30) world tests: Soul Cinematic and Seedream "Film still" plates | Seedream became the sheet and plate workhorse (742 jobs) |
| TK (not a day-1 shoot-out) | the identical re-sheet prompt on GPT Image 2 vs Seedream ×4 | GPT Image 2 promoted to MAIN CAST |

**Protocol for us** [INFERRED composite]: write one look prompt in the D1 order below → run it 2–4× each in GPT Image 2.5 Sunburst (max, 4k) and Nano Banana Pro (4K), plus Midjourney V8.2 by hand per 03 §3.1.8 → the user scores and picks → freeze the winning sentence as the style suffix and version it in the header (B★: doctrine v1 → v4).

#### Template D1: look-dev still (style anchor) → our `look`
Sources: T style-anchor order; S★ E6 (village anchor, attached as "sets the grade, grain and contrast … match it exactly" in 6 jobs); U suffix (967/1,194 stills). Gear and stock names removed per 02 rule 2.
```text
Film frame from {{genre}}, {{the stock's visible behaviour: "warm, pushed-film contrast with
halation around practicals and coarse even grain"}}, {{field of view or lens length}}.
{{Place, time, weather}}. Composition: {{one line}}.
Light: {{the one source; where it stops}}. Palette: {{60% x / 30% y / 10% z}} — {{one dominant hue,
one accent}}. Film behaviour: {{grain, roll-off, halation where, black level}}. Operator habit:
{{e.g. "horizon a few degrees off level"}}. Texture: {{surfaces}}. No people. No text.
No HDR, no sharpening halos, no glossy skin, no beauty lighting, no fake vintage filter.
```
- One anchor per "world": S★ had village, sea, underwater and a bright European beach.
- S★ warning: 2 of its 3 anchors were never attached to any video job. Log where each anchor is used.
- B&W sequences: never ask the model for black-and-white (BZ, 0/12 did). Use the B&W rules in 3D Card 8.

#### Template D2: optics unification pass (look-in-plates route only)
Source: F★ E3 (154 jobs; 9,311 characters).
```text
Edit the image: apply the optical character of {{lens behaviour in words}} to this {{place}}. Do not change
the lighting. Do not change the exposure, the colour temperature, the grade, the time of day or the
weather. This edit is about the lens only. {{Each optical trait as a visible instruction on the
plate's own lines: "the {{handrail}} bows outward, its near end swinging toward the lower left
corner"}}. It stops short of a fisheye. The frame stays filled to all four edges.
AVOID: {{haze, bloom, fisheye, black wedges, re-grade, relight, added people, invented text}}.
```
Where the look lives (neutral plates vs graded plates) is a decision for us: see 3C §1 and section 4.0, D-2.

### 3A.5 Surgical edit prompts

| Edit type | Wording seen | Films |
|---|---|---|
| One change, everything else protected | "Keep this photograph exactly as it is … Change one thing only." (BZ #10); "Keep everything exactly as it is" (T, 37); "EDIT — take Image 1 as the base and change ONLY <one thing>. Preserve everything else exactly: <list> … IN ITS PLACE, ADD … INTEGRATION:" (F★); "The only change: …" (S★); "keep the rest the same" (B★) | B★ F★ S★ T BZ H L (+K★) |
| One-liners | "remove the head" · "create the back side of this costume" · "isolate just the helmet on a gray background" · "recreate this picture in color" (B★) · "remove the numbers on the display" (C) · "add a lot of dust" (BZ, 101) · "Move camera much further away" (BZ, 72) · "upscale the image" (BZ, 33) | B★ F★ S★ U C BZ |
| Insert or swap a locked character into an approved plate or frame | "replace the boy with <<<…>>>. Use <<<image_1>>> as a direct reference for light and composition" (BZ, 220 insert/replace edits); "replace the two character with the one attached. keep the rest the same" (B★); K★ swapped its locked woman into 2 Soul plates "with the composition unchanged" | BZ B★ K★ |
| Painted-zone edits | colour zones painted in an external editor, then "remove the red zone, keep the rest" (F★, 113 jobs; 26 magenta-mask fills) | F★ |
| Face-structure transfer into a graded frame | T E3 | T |
| Style transfer between engines | "make <<<image_2>>> in the style of <<<image_1>>>" | B★ |

#### Template E1: one-change edit (stills)
Sources: BZ #10, F★, T. Engine: Nano Banana 2.1 or Sunburst [INFERRED]; mask back onto the untouched base (03 rule 5).
```text
Keep this {{photograph | sheet | plate}} exactly as it is — the same {{room, light, people, layout,
colours, grain and focus — list what this image contains}}. Change one thing only.
{{THE CHANGE, physically: what, where ("between {{object A}} and the edge of {{surface}}"), material,
wear, size in cm}}. It {{rests / hangs}} in the existing light and casts the same soft shadow as
everything else in that light.
Do not move, resize, relight or redraw anything else in the image. Do not change the faces, the
clothing, {{other protected items}} or the composition.
```
For tricky removals, name the failure on both sides (T): "Removing {{x}} also removes {{y}} = a failed image; {{x}} still visible = a failed image" [INFERRED adaptation of T's video_edit rule].

#### Template E2: put the locked character into an approved frame
Sources: BZ, K★, B★. Use when the frame's composition and light are approved but the face is wrong or generic.
```text
Replace the {{person}} in the first attached image with the person from the second attached image (identity sheet).
Use the first image as a direct reference for light, composition, pose and framing. Take from the second
image ONLY face, hair, skin tone and wardrobe — not its grey background, not its flat light, not its panel
layout. Keep everything else in the first image exactly the same.
```

#### Template E3: face-structure transfer (keeps the frame's grade and emotion)
Source: T E3. This made THREAD's first frame, which then pinned the backward extension.
```text
Edit the first image. The second image is the character reference. The reference provides ONLY the
three-dimensional shapes of the facial features — bone structure, brow ridge, cheekbones, nose,
jaw, chin, the cut of the eyelids and lips. It provides NOTHING else: not its skin colour, not its
lighting, not its exposure, not its clean skin, not its neutral expression, not its background.
EXPOSURE AND LIGHT ON THE FACE — copy from the first image: {{direction, falloff}}. FORBIDDEN:
brightening the face, flattening the light, opening the shadows. If in doubt, render the face
DARKER and more shadowed, never brighter.
SKIN COLOUR AND TEXTURE — copy from the first image: {{cast, blotches, sweat}}. FORBIDDEN: cleaning,
smoothing, warming.
EXPRESSION — copy from the first image, muscle by muscle: {{brows, lids, eyes, mouth, chin}}.
FORBIDDEN: relaxing or neutralising any of it.
EVERYTHING OUTSIDE THE FACE — identical to the first image, pixel for pixel.
The result must read as the SAME photograph of the SAME moment — only the underlying bone structure
of the face has quietly shifted toward the reference.
```

**Edit discipline across films.**
- **Short prompts for surgery, long prompts for look** (B★: Nano Banana 2 median 24 words; BZ: 37% of 1,725 jobs ≤12 words; F★: 165 edits under 80 characters).
- **Prompts grow when a failure repeats** (F★: corridor plate 4,968 → 16,165 characters). The Avoid or No list is built from the failure just seen (K★: "There is no visible candle…" in v2).
- **Run each edit about 4×** (BZ: 384 distinct prompts across 1,725 jobs). Our rule "after two failed repairs of one defect, restart from the last accepted image" stays.
- **Fix the image, not the text, when they disagree.** The image won in S★, L and K★.
- **Image handles.** Image jobs in B★, C and BZ wrote `<<<image_N>>>`; S★ wrote "the attached image" / "the first attached image". Use whatever 03 §3.0 verifies for each engine, and never an ordinal that has not been checked against the attachment order.

### 3A.6 Which image model for which job

All mappings onto Sunburst and Nano Banana 2.1 are [INFERRED]. GPT Image 2.5 itself was used by F★ (291 jobs) and U (81), with the variant unrecorded; Nano Banana 2.1 appears in no study. Seedream 5.0 Pro and the Soul tools are not in our stack.

| Job | What the studies used (jobs) | Our route | Basis |
|---|---|---|---|
| Identity seed / casting photo | GPT Image 2 (S★ all 13; TK 4 realism passes), Soul V2 (B★), Soul Cast (TK) | **Sunburst max 4k 3:4** + Nano Banana Pro 4K 3:4, 2–4 takes each | GPT Image family carried identity in S★ and TK |
| Same-session angles and state packs | GPT Image 2 + 1 ref (S★: 30 angle/variant jobs) | **Sunburst** | S★ |
| 3-panel Seedance sheet | GPT Image 2 4K (TK: 7 of 8 main sheets; beat Seedream on the identical prompt), Nano Banana Pro (T 14 sheets; C; BZ), Seedream (F★ girl sheet; H; U; TK minor roles) | **Sunburst** first; **Nano Banana Pro** if it reads flat (03 §3.1.8 #3) | TK E3 head-to-head; T and C show Nano Banana Pro also works |
| Multi-reference composite (panel *i* from image *j*) | Nano Banana Pro with 4 inputs (C E12), Seedream (U) | **Nano Banana Pro** | C |
| Skin/realism pass | Nano Banana Pro (F★), GPT Image 2 4K (TK) | **Nano Banana 2.1** edit on a copy, masked back; or **Sunburst** for a whole-sheet pass | F★, TK |
| Location masters | Seedream (F★ 2,031 jobs; T 21:9 rooms; H; U), Soul Cinematic / Soul Location (K★, TK, B★, U, C), GPT Image 2 (S★ all 13) | **Nano Banana Pro** (follows text-described geography; 03 §3.1.6 #8) + **Sunburst** bake-off | S★ shows a GPT Image model can do every plate |
| Reverse / new angle | GPT Image 2 (T E4), Seedream/GPT (F★, U "change the angle"), Seedream (H), Nano Banana (BZ) | **Sunburst** with the master as geometry-only reference; compare `/3d-jutsu` | T |
| Precise or text-sensitive edits | GPT Image 2.5 at quality max (F★: basement, car, keys, reactor; 291 jobs), GPT Image 2.5 (U: heroine's final edit, angle changes) | **Sunburst** | F★, U; "text-sensitive" as the reason is [INFERRED] in F★ |
| One-liners, relights, dust, sky match, isolate, upscale | Nano Banana Pro (BZ 1,725; B★ 121; T 190), Nano Banana 2 (B★ 251) | **Nano Banana 2.1** (`is_inpaint` + mask for local fixes) | B★, BZ, T |
| Props | Nano Banana Pro (T spindle; H 18 props), GPT Image 2 (S★, F★), Seedream (TK) | **Sunburst** + Nano Banana Pro bake-off | mixed evidence |
| Keyframes from prose | Nano Banana Pro (B★; BZ), Seedream (H 75, later dropped) | **Nano Banana Pro** | BZ, B★ |
| Blocking sketch | Seedream (F★) | **Nano Banana 2.1** or Sunburst | F★ |

Settings worth copying: 4K for anything promoted to a Seedance reference (TK, T); our note stands that Sunburst above 2560×1440 is experimental, so if a 4K take shows artefacts, re-run at 2K and upscale. Set the ratio parameter explicitly (S★ got squares from ratio words alone).

---

## 3B. Seedance 2.5 video prompts

Scope: settings, block order, length, reference wording, headers, beats, camera, acting text, dialogue and audio, negatives, physics, first/last-frame locks, extension chains, `video_edit`, written cuts, and four fill-in templates. Checked against `05-seedance-production.md` and `05b-acting-direction.md`. UNPROMPTED is Cinema Studio and In Passing's crowd scenes are mostly Cinema Studio; where a rule rests on them it is marked **[CS]** and its transfer to Seedance is [INFERRED].

### 3B.1 Settings actually used (Seedance 2.5 jobs)

| Film | Jobs | Aspect | Resolution mix | Typical durations | Modes besides default | Prompt length (median) |
|---|---|---|---|---|---|---|
| B★ | 514 | 16:9 (letterboxed in post) | 480p 238 / 720p 181 / **1080p 95**; every frame-verified final 1080p | 30 s ×392 | extension backward 94 / forward 34 | 1,291 words (p10 806, p90 2,124) |
| F★ | 252 | 21:9 | 1080p 208 / 720p 44; **2 finals at 720p** | scene takes 22–30 s; in-fills 4–12 s | video_edit 66 | 4,369 chars (Chinese); in-fills ≈1,036 chars |
| K★ | 43 | 4:3 (38) | 720p 22 / 1080p 21; in the cut 1080p 14/21, 720p 9/22 | 5 s ×12; 20 s and 30 s ×6 each | edit 1, extension forward 1 | 325 words (8–1,791) |
| S★ | 13 | 16:9 | **1080p 13/13** | 25 s ×7, 20 s ×5 | none (Cinematic Video Editor ×3 to lengthen) | 946 words / 5,886 chars |
| T | 214 | 21:9 seed; extensions inherit 1470×630 | **720p 212** (Topaz to 4K) | 25 s ×122, 30 s ×53 | extension forward 147 / backward 22, edit 8 | 2,612 words |
| L | 43 | 21:9 | 1080p 43/43 | 30 s ×33 | none | 569 words |
| TK | 64 | 16:9 | 1080p 64/64 | 30 s ×17, 5 s ×10 | none (Elements only, 0 media) | 1,683 chars (English 3,701 / Japanese 1,219) |
| IP (Seedance part) | 173 | 21:9 | Seedance 1080p (Cinema Studio rehearsals 720p, beds 480p) | 8 s single take; 17–18 s four-shot | extension forward 1, v2v 2 | 757 words |
| C | 443 | 21:9 drama / 4:3 archive | 1080p 437 | 10 s ×138, 5 s ×77 | none | 2,563 words (max 8,014) |
| H | 207 | 16:9 | 720p 189 / 480p 18; 2 finals at 480p | 12 s ×43, 20 s ×38, 5 s ×33 | edit 3 (unused) | 1,316 words (finals 1,053) |
| BZ | 195 | 16:9 (letterboxed in post) | 720p 92 / 1080p 61 / 480p 42; finals 17×720p, 10×1080p, 3×480p | 5 s ×23, 26 s ×19, 4 s ×17 | none (Cinematic Video Editor ×19) | 715 words |

Three settings are universal: `generate_audio` **on in 12/12** (H 206/207); **draft mode in 0/12** (draft = false on every job of every study); the **`multi_shots` toggle in 0/12**.

### 3B.2 Rules with counts

| # | Rule | Films (n/12) | Evidence |
|---|---|---|---|
| R1 | Native audio on, **"No music"** written in the prompt, score in post | 12/12 | B★ 91% of prompts, C 432/443, H 201/207, IP 855/886, S★ 12/13 (+1 "No score") |
| R2 | **Timecoded beats** inside the take | 12/12 | T 95%, H 205/207 (decimal windows), B★ 63%, L 31/43, TK 38%, U 125/128 [CS] |
| R3 | **One stated role per reference**, with what NOT to take | 11/12 strong; K★ weak (ordinals only) | B★ `[Material Roles]`; S★ `[REFERENCE USE]`; T "KNOWLEDGE ONLY, NOT SHOTS" (117); TK "Elements govern appearance" (78%) |
| R4 | Cuts **written in the text** (multi-shot toggle off) | 8/12: B★ K★ L TK IP C BZ U | L 【SHOT n】 27/43; BZ HARD CUT 101/195; IP "FOUR SHOTS, THREE HARD CUTS"; C hard cuts at timecodes |
| R5 | **Single continuous take only**, no written cuts | 4/12: F★ S★ T H | S★ "NO CUT" ends every stage (39×); F★ "没有剪辑、隐藏切口、插入镜头、时间跳跃或瞬移" ("no edits, hidden cuts, inserts, time jumps or teleporting") |
| R6 | **Opening state stated** (frame one already in action) | ≥9: B★ F★ K★ L T IP C H BZ | IP "THE SHOT IS ALREADY RUNNING WHEN IT STARTS" 883/886; C FIRST FRAME line 405/443; B★ "Frame one is ALREADY ON TOMMY, mid-motion" |
| R7 | **End state stated** (FINAL FRAME, a hold, or "still running") | ≥8: B★ F★ K★ S★ L T TK IP H | B★ `FINAL FRAME:` 65%, `END STATE:` 20%; IP "THE TAKE IS STILL RUNNING WHEN IT ENDS" 883; H timelines end mid-action |
| R8 | **Physics written as rules or process** | ≥11 | H gait cycle + "NO GLIDING…"; L "EVERY ACTION STARTS FROM ITS REAL BEGINNING"; C "Real gravity, real mass" 93; BZ PHYSICS block 153/195 |
| R9 | Native **lip-synced dialogue** in the film | 8: B★ F★ S★ TK L IP C T | K★, BZ and H keep mouths off screen and carry lines in V.O. or subtitles |
| R10 | **Exact line count / "each once"** | 6: B★ F★ T TK L BZ | T DIALOGUE LOCK 66; F★ "各说一次" ("each said once") 20; TK "Speak only the six quoted Japanese lines, once each, in the specified order" |
| R11 | Language and accent named per line | 7: B★ S★ F★ TK L C BZ | B★ German accent 26%; S★ "His mouth matches the French exactly" |
| R12 | Last approved frame fed back as an image | 6: S★ F★ L T K★ B★ | S★ 5 uploaded last frames; L 9 of 15 uploads are frame grabs |
| R13 | Previous clip attached **as video** for continuity (default mode) | 6: S★ F★ H C K★ B★ | S★ "continue its camera position, lens, handheld motion character … do not restage" (5/13); H 67 jobs, never named in text |
| R14 | `video_extension` | 4: B★ K★ T IP | in the film in all 4 |
| R15 | `video_edit` in the final film | 3: F★ (≥8 in-fills), T (3), K★ (1) | H's 3 edits unused; B★'s 4 video-to-video fixes unused |
| R16 | **"X = a failed take"** fences | 3: T IP BZ | T 85% (median 4, max 15); IP 874/886; BZ 410× in 76 prompts |
| R17 | A separate **negative block** | ≥7: B★ S★ K★ C H BZ U | B★ `[Negative Constraints]` AUDIO/VISUAL/CONTENT; S★ `[EXCLUSIONS]`; H HARD CONSTRAINTS 204 |
| R18 | Reference/tag **hygiene failures** recorded | 7: B★ K★ S★ L T C H | lost tags on paste; ordinals that don't match the attachments (K★ 10/12); blank tokens (S★ 3/13, H 43); dangling `@image4`; 4,500-character truncation (L) |
| R19 | Iterate at low resolution, then 1080p | 5: B★ F★ K★ IP BZ | low-res takes still reached the film in F★, K★, IP, BZ, H, T |
| R20 | Re-roll the identical prompt 2–5× and cut between takes | ≥7: T L K★ IP U B★ F★ | T 53 prompts run more than once; IP 191 of 396 prompts fired exactly twice; U reroll intercuts in 5 places [CS] |
| R21 | Generate longer than the cut needs | S★, TK (+T by trimming) | S★ writes 20 s and renders 25 s; TK "30秒生成。編集目安：約26秒" ("generate 30 s, edit to about 26") |
| R22 | Audio-only "plates" (picture irrelevant) | 3: B★ T IP | B★ 30 s 480p static ambience bed; IP 28 × 30 s 480p beds + 8 × 4 s ADR carriers |

### 3B.3 Block order

**Five house skeletons that produced finals:**

| Skeleton | Order | Films |
|---|---|---|
| **Look-block screenplay** (B★) | `$$$ header` → `[Material Roles]` → Style → Lighting → Color → Grade → Camera → Skin → Acting → Physics → Composition → Continuity → Technical → Audio → Characters → Scene (LIGHT GEOMETRY / GEO-SPATIAL / cast count) → `THE SHOT — one unbroken take, in continuous time:` with `(0-6s)` beats, **or** `CUT n (a-bs) — side, lens, size — BEAT:` → `FINAL FRAME:` → Rules → `[Negative Constraints]` | B★ |
| **9-block stage skeleton** (S★) | `[GOAL]` (with the shot's story job) → `[REFERENCE USE]` → `[CONTINUITY]` → 3 × `[STAGE n \| a–b s] … NO CUT` → `[VISUAL STYLE]` (identical in 13/13) → `[CAMERA AND PERFORMANCE]` → `[AUDIO]` (`<sfx>`) → `[EXCLUSIONS]` → `[MAINTAIN CONSISTENCY]` | S★ (11/13 jobs in the film) |
| **Contract-first one-take** (F★) | contract line (format, one take, no cuts) → reference roles → inner story with limits → "only one camera route" summary → one paragraph per leg (camera → what enters frame → action → line → focus) → physics/continuity → extras → optics → sound | F★ |
| **Lock sections** (T) | `=== CONTINUATION ===` → `=== ONE SHOT — NO CUTS, EVER ===` → scene locks → `=== REFERENCES — KNOWLEDGE ONLY, NOT SHOTS ===` → GEOGRAPHY → DIALOGUE LOCK → COMPOSITION → CAMERA (timecoded) → ACTION (timecoded, named stages) → ACTING → SPEED → SINGULARITY → LOOK LOCK → LIGHT → FILM → AUDIO | T (similar caps-header systems in C, BZ, H) |
| **Shot-list** (L, K★ multi-shot) | header (`Single shot (one-shot, no cuts).` / `Multi-shot edit.`) → cast tokens with this scene's state → ⚠️ global rules → `【SHOT n】(a–b s)` Camera / Action / Line / micro-beats ①②③ / Sound / `Hard cut.` → style block → tail | L, K★, TK |

**Merged order for our pipeline** (each slot traced to its sources; how it maps onto 05 §5.2's labels is in section 4, P05-1):
1. **GOAL / contract**: one take, the action in one sentence, the story job (S★ 12/13, F★).
2. **REFERENCE USE**: one line per handle (11/12; §3B.5).
3. **LOCKS / CONTINUITY**: count, screen direction, wardrobe and prop state, geography (B★ Rules, T, TK seat order, C).
4. **FIRST FRAME**: already in motion (≥9/12).
5. **ACTION timeline**: timecoded beats, "Still the same shot:" or "NO CUT" per beat (B★, S★), ending in **FINAL FRAME** or a stated continuable end state.
6. **CAMERA**: field of view or lens, height, distance, one move, operator behaviour.
7. **PERFORMANCE**: the emotion as a physical tell plus a "does not" list.
8. **PHYSICS**.
9. **LOOK block**: frozen verbatim text (B★ 411 prompts; S★ 13/13 identical).
10. **AUDIO**: diegetic `<sfx>` list, dialogue delivery, no music, no subtitles.
11. **EXCLUSIONS**: concrete failure sentences (decision D-6 in section 4.0 on the "= a failed take" form).
12. **MAINTAIN CONSISTENCY**: identity lines repeated (S★).

The repetition at the end is deliberate: S★ states identity three times per prompt (REFERENCE USE, CONTINUITY, MAINTAIN CONSISTENCY); C closes with a POSITIVE CONSTRAINTS checklist that restates everything.

**Fix for a behaviour that drops out mid-take (F★).** Move it to line 1, then open each beat paragraph with a short refrain. F★'s in-film take repeats the flicker and shake at the start of 10 of 13 beats ("灯光闪烁、闪烁、持续闪烁…摄影机持续震动" — "the lights flicker, flicker, keep flickering … the camera keeps shaking"). Adding text further down did not fix it.

### 3B.4 Length

| Use | Length that worked | Evidence |
|---|---|---|
| Animating an approved, identity-corrected start frame | **8–40 words**: action + camera behaviour + one guard ("static", "no zoom in", "in same angle") | K★: every prompt of 28 words or fewer reached the cut, 6/6 ("static handheld shot, no zoom in, dead man's hand") |
| Single shot with acting | 80–350 words (K★); 570–1,050 (L median 569; H finals 1,053) | K★ E4 (5 s, timed scratch at 2 s, resume by 3.5 s) |
| Full scene take, 20–30 s | 650–1,300 words | S★ 627–1,502 (aim 900–1,100); B★ median 1,291 |
| One-take extension link | 1,765–4,100 words | T median 2,612; prompts grow with each failure (a winner went from 2,468 to 4,101 words) |
| Coverage rush with written cuts | 300–800 words (K★), up to 1,935 (BZ) | K★: 8 jobs of 20–30 s supply 76.6 s of the film |
| `video_edit` repair | 1 sentence (K★) to ≈420 words (T edit median 416) | — |
| Black-gap in-fill | ≈340–1,350 characters (Chinese) | F★ in-fill median ≈1,036 |

Hit rate is not monotonic in length. K★'s in-film rate by bucket: ≤20 words 5/5, 21–120 5/10, 121–500 6/16, >500 7/12. **Match the prompt length to the job, not to the shot's importance.** Note: 05 §5.0 cites ByteDance's recommendation of ≤1,000 English words; B★ (1,291), T (2,612), C (2,563) and H (1,316) all had medians above it and still reached their films (decision D-7).

### 3B.5 Reference naming and one-role wording

**Token forms seen:** `<<<image_N>>>` / `<<<video_N>>>` (B★ 343/175 prompts; T 95%; S★ 11/13; C 1,107 image, 120 video and 161 `<<<audio_N>>>` tokens; F★) · Element `<<<uuid>>>` (F★ L TK IP C H BZ: 7/12; L calls it "the stored form of an @-mention", and its "(Name) —" label wins over the Element's own name) · `@ImageN` (S★'s first prompt; leftovers in 24 T prompts) · ordinals only (K★: 0 tokens). Each form worked when it pointed at the right file. **Never mix forms in one prompt.**

**Failure modes (7/12 recorded them):** tags lost on paste ("<<<image_3>>> defines …" became " defines …", so in B★ 5b the "MASTER for Kurt's room" pointed at the pistol image) · ordinal ≠ attachment order (K★ 10/12; the jobs worked only because each image was unambiguous by content) · blank or duplicated tokens (S★ 3/13 blank, a duplicate `<<<image_6>>>`; H 43 empty Element slots) · `@image4` pointing at media never attached (L) · a prompt cut at 4,500 characters that lost its last shot and style block (L) · Higgsfield's extension template left with `<Character A's pose…>` placeholders unfilled (B★). Guard: the lint in 3C §9.

**Role vocabulary that shipped (copy these lines):**

| Role | Wording | Source |
|---|---|---|
| IDENTITY (face only) | "defines KURT's FACE ONLY … NEVER use this image's background, dark backdrop or portrait lighting"; "identity only, never that image's expression" | B★ |
| CHARACTER PACK | "<<<image_1>>>–<<<image_4>>> are ONE person … face straight on / three-quarter / profile / full-body sheet. Use whichever angle matches the head position in each moment." | S★ (7/13 jobs) |
| SHEET, not layout | "Use these references for identity, wardrobe, objects and architecture, not their reference-sheet composition"; "不用它的全身展示构图" ("don't use its full-body sheet composition") | TK (78%), F★ |
| LOCATION ONLY | "defines TOMMY'S ROOM ONLY … Do NOT copy its events, its actions or its camera movement"; "GEOMETRY, MATERIALS, LIGHT only; its own wide view never appears"; "keep its geometry" | B★, IP, S★ |
| MASTER framing/pose | "is THE MASTER FRAMING for this entire video — hold it EXACTLY, first frame to last … Do NOT copy this image's exact expression" | B★ |
| START FRAME | "is the START FRAME — the FIRST FRAME of this video matches it EXACTLY"; soft form "不作为必须逐像素复现的首帧" ("not a first frame to reproduce pixel by pixel") | B★, F★ |
| LAST APPROVED FRAME | "is the last approved frame of clip 05B: same place — copy its geometry, light direction and grade" | S★ |
| PREVIOUS CLIP (video) | "is the previous approved clip as VIDEO: continue its camera position, lens, handheld motion character, light, grade and the positions of everyone in it; do not restage" | S★ |
| SOURCE VIDEO (extend) | "is the source video: its LAST FRAME — <described> — is the first frame of this shot … Do not repeat its events" | B★ |
| GRADE / STYLE ANCHOR | "sets the grade, grain and contrast for every sea frame; match it exactly" (one grade slot per prompt) | S★ |
| GESTURE (phone video) | "demonstrates the PROCEDURE only … Copy only the object's path and which end is worked. Do NOT copy the man, his clothes, watch, room, rug or daylight" | B★ |
| PATH GUIDE (previz) | "a PATH GUIDE only: take Tommy's route and the room layout from it — not its stiff camera, not its empty rooms, not its placeholder shapes" | B★ |
| PROP STATES | two images = "one object at different times; only one such gauge exists" | F★ |
| POSE SKETCH | "pose and spatial reference only; lines, strokes, paper texture must not enter the image" | F★ |
| VOICE | "DIALOGUE AUDIO REFERENCE … sole source of … spoken voice … its timing governs the shot … Do not synthesize a new voice" | C |
| BLOCKING MAP | "the RED marker is <<<…>>> … The coloured markers are annotations, not objects" | C |
| SCALE SHEET | "Use <<<…>>> only as the scale-continuity reference. Yoki in this shot must remain approximately 40 cm tall relative to Lora." | H (17 prompts) |
| Element already in place | "<<<id>>> is the identity of the boy ALREADY SITTING at frame-left in that first frame … It is not an instruction to place, add or introduce anyone." | BZ (8) |
| Umbrella | "REFERENCES — KNOWLEDGE ONLY, NOT SHOTS … NOT framings, NOT camera positions, NOT moments of this shot" (stops mid-take cuts to a reference composition) | T (117) |
| Anti-slideshow (3+ images) | "do not reproduce the reference images as fixed opening frames, animate them one after another, or transition between them as a slideshow" | K★ |
| Anti-overlay | "not a static overlay … not a cutout, not a ghosted or semi-transparent layer" | BZ (13) |

Start/end images as **parameters** appear only in L (2 start/end pairs, both in the film) and C (start 13, end 2). B★ (0) and T (0) pinned frames by naming image references in the text. TK used no media at all: Elements only, 0 media on 64 jobs.

**Paste-ready role block for our prompts** (handle order = attachment order within each media type; merges the vocabulary above):
```text
@Image1 = {{CHR_NAME}} identity sheet (state {{S#}}): face, hair, body, wardrobe ONLY. Not its grey background, not its studio light, not its pose, not its sheet layout.
@Image2 = {{LOC_NAME}} plate ({{time of day}}): geometry, materials, light direction ONLY. Its own wide view never appears re-photographed; no people from it.
@Image3 = {{PRP_NAME}}: exact look and colour of the {{prop}} wherever it appears. Only one {{prop}} exists.
@Image4 = LAST APPROVED FRAME of {{shot id}} t{{n}}: same place; copy geometry, light direction, grade. (continuity takes only)
@Video1 = PREVIOUS APPROVED CLIP {{shot id}} (last {{n}} s): carry on its camera position, lens, handheld character, light, grade and the positions of everyone in it; do not restage. (continuity takes only; wording to be tested, see D-5)
@Video2 = PATH GUIDE (Blender PB v{{nn}}): route and room layout ONLY; not its stiff camera, not its empty rooms, not its placeholder shapes.
These references are knowledge, not shots: never cut to, settle on or reproduce a reference composition.
```

### 3B.6 Headers
- **Coded, versioned header:** `$$$ SCENE 5 — 5e-b v7 (one continuous take, 30s — the gift, one framing: …)` = scene · shot code · version · take type · beat (B★ 470/514). `TOKYO 4:17｜G08｜朝食｜30秒` or `LOCK v03 / PERFORMANCE REVISION` (TK). The version lives in the header, so every final can be traced.
- **Story job in the GOAL** (S★): "This is the film's first image." / "The seed of the decision, wordless."
- **Take-type header** (IP, L): "ONE UNBROKEN SHOT, no cuts — a single continuous 12-second take. Any cut, dissolve, wipe or optical transition = failed take."
- **Parameters in the header** (H 206/207: "Seedance 2.5, 6 seconds, horizontal 16:9, 24 fps …"; L tail "30 seconds. 2:1."; BZ "Duration: N seconds" 78). Prose and params disagreed often (C 55/437, H 24, K★'s "5-second" on an 8 s job, U 47 × "16:9" on 21:9 jobs [CS]). **The params won.** 05 rule 4 (no params in prose) stays. For our header, use the shot code and version only: `S03-SH02 v03 t2 · single take · {{beat}}` [INFERRED adaptation].

### 3B.7 Timecoded beats
- **Window size:** 4–9 s per stage in a 20–25 s take (S★); 4–6 s windows, one beat each, last window "Hold" (L single takes); 1.2–1.8 s decimal windows in a 6 s shot (H: "0.0–1.8 s: …"); sub-second events for micro-acting (C "At 0:00.8 a small involuntary saccade … the eyes drop 2–3°").
- **Hold the shot together:** begin every beat with "Still the same shot:" (B★) or end each stage with "NO CUT" (S★). The model still cut once on its own: S★ `851e4dc9` at 15.3 s, near a stage boundary.
- **Never compress beats:** "Compressing them into one motion … = failed take" (BZ ACTION LAW).
- **Pin a frame to a time:** "the last frame before blackout is <<<image_2>>>" (F★ Sc_07, final).
- **Dialogue placement:** "each line lands in the FIRST THIRD of its shot, the REST OF IT ITS PHYSICAL BEAT" (IP).
- **Rendered length ≠ written length, on purpose:** B★ re-rendered 30 s prompts at 8/15 s to keep the first beats (finals 5d-a v4, 5d-TOMMY-OT); S★ wrote 20 s and rendered 25 s. Plan the key event in the **first two-thirds** (U [CS]).

### 3B.8 Camera language
- **An operator, not a rig** (B★ S★ L F★ H C): "24mm wide prime, carried by a running human operator — it sways with his steps … never stabilized, no gimbal" (B★); "the camera is a person physically present, it breathes, drifts and micro-adjusts; no smooth stabilised gimbal … no drone, no crane, no orbit, no locked-off tripod" (S★ 13/13); "catches focus a beat late" (L); "Exposure is ridden manually … one correction per shot" (C).
- **Locked frames are written as locks:** "static handheld" = a locked frame with breathing sway (K★; static/locked in 30/43). "Tripod, head fully clamped … Framing is pixel-identical from first frame to last" (C). "THE MASTER FRAMING … LOCKED for all 30 seconds … HE moves inside the frame, the frame never follows him" (B★).
- **Optics:** mm per shot (L 42/43, TK 95%, T "50mm" 81%; S★ 24 mm at sea, 35 mm on land; B★ 24/40/85 mm in 41/37/9%); field of view in degrees (C 250 prompts, BZ 29°/47°); "35mm lens — no zoom, no telephoto: the shore stays far and Mariama stays small" (S★, the retake that fixed the shot). Our 05 writes field of view in degrees with mm only as an aid; both forms worked in the studies.
- **Geometry in numbers:** camera height in cm and distance in m (H, S★ "two metres below", C); whips as angles ("向右急转约100度" — "whip right about 100°", F★); one dominant move ("one careful reveal around his shoulder", S★).
- **Framing changes only by travel:** "There is NO cut, NO jump, NO new angle that the camera did not travel to" (T). "The camera never passes through the wall" (B★, 62 prompts). "passes through real gaps, never through bodies" (TK). After a fast move: "a readable stop … 止まった瞬間は顔と芝居を明瞭に見せる" ("the moment it stops, show the face and the acting clearly", TK).

### 3B.9 Acting text (prompt side; full card in 3D Card 3)
- Emotion becomes **one physical tell plus a "does not" list**: "The only sign that something is wrong is … the way she drinks water too quickly" (K★; restraint clause in 23/43); "his only performance is where he looks" (S★); fear as mechanics: "shoulders drawing in, chin lowering … breath shallow and quick" (L).
- Ban both extremes: "No tears, no trembling lip … = failed take. A completely blank face … = failed take" (BZ EMOTION LAW).
- **Micro-beats ①②③**, at most 3 per shot (L). Standing anti-acting footer: "BLINKING natural and minimal … NO sighing" (22 and 21 L prompts).
- A tear needs both halves: "reddened wet eyes … chin trembling slightly … No sobbing, no dramatic crying" (K★).
- Off-screen performance by **intention per line**, with coughs and breaths placed inside lines (B★ E9).

### 3B.10 Dialogue and audio
- **Line formats that shipped:**
  - B★: language + accent + intention, then the line in braces: `a voice — English, hard German accent, flat, unhurried: {You dropped a round. I heard it roll.}`
  - S★: `{Sékou, shouting, voice breaking, French: "Ça va aller! …"}` inside the stage, plus "His mouth matches the French exactly".
  - L: delivery → `"≤10 words"` → "⚠️ Spoken to <<<Mai>>>" → behaviour after the line (median line 5 words, max 13; ≤6 lines per 30 s).
  - TK / F★: speaker label + 「line」 + delivery note ("声を荒らげず … 語尾は静かに下げる" — "no raised voice … let the ending fall quietly").
- **Count lock:** "Exactly THREE spoken lines in the whole take … NO other voice anywhere — no muttering" (B★). "Speak only the six quoted Japanese lines, once each, in the specified order" (TK). "the descriptive sentences of this prompt are NOT dialogue" (T, 104 prompts).
- **Off-screen and V.O.:** "heard, not lip-read" (S★) · "BEHIND THE CAMERA, off screen" (T) · V.O.: "his mouth does not move on it; his lips are closed … as if spoken beside the camera, no reverb" (S★, final) · silent shot: "NOBODY SPEAKS … Any spoken word, any moving lips = a failed take" (T); "No dialogue. No lip movement." (K★).
- **Language follows the faces:** Japanese for Japanese casts (TK, F★, IP); French and Italian (S★); a German accent in English (B★). Accent spelled out: "roos-TAM, kah-REEM" (BZ); "syllable-timed … never a caricature" (C). Intelligibility set explicitly: "DIALOGUE IS CLEAR … NOT mumbled" when the words matter (L).
- **Supplied voice (our ElevenLabs route):** C is the one precedent (64 audio inputs): "@WIFE_Lines — DIALOGUE AUDIO REFERENCE … sole source … Do not synthesize a new voice … the silences absorb the difference — the speech is never re-timed".
- **Audio block:** a diegetic list in `<angle brackets>` (S★, T 97%) with sounds in event order and distance ("loud and close in the first three shots, gradually quieter", BZ) · an exhaustive ban: "no music, no score … no drones, no swells, no stingers, no ambient pads" (B★ `[Negative Constraints] AUDIO`) · "No subtitles" (B★ 90%, TK 91%, C 424/443) · "no whoosh" on joins (F★, U) · sound scripted to follow the action: "Near the end, the chewing … should gradually slow and fade … not stop abruptly" (K★).

### 3B.11 Negatives
- **"= a failed take"** names the failure in concrete visual terms (3/12). A failed take becomes a new sentence in the next roll (T: one link went from 6 rules to 10).
- **Split exclusions**, AUDIO / VISUAL / CONTENT (B★ E9, E12), or `[EXCLUSIONS]` = generic boilerplate + this clip's physics (S★: "only the one fingertip that touched the wood is dirty").
- **Fence the cast at both ends:** "Exactly two people … no one else appears at any point" (B★). "SINGULARITY — Exactly ONE man" (T 170).
- **Substitute, don't only forbid** (05 §5.2). The studies pair positive and negative too (K★ tear pair; BZ both extremes).
- Negatives reduce failures but do not prevent them: B★'s in-film take still shows a blood pool its Rules banned.
- Our 02 hard rule 7 bans `negative:` lists ("Seedance … parses them as scene content"). At least 7/12 used a negative block and reached their films. Decision D-6.

### 3B.12 Physics wording (≥11/12)
- **Process:** "EVERY ACTION STARTS FROM ITS REAL BEGINNING AND COMPLETES WITH TRUE PHYSICS … Nothing is pre-done, nothing floats, nothing skips its middle" (L). Ordered object steps with self-motion bans: "NO flap opens by itself" (L E10, start and end frames).
- **Gait:** "one foot stays planted → weight shifts … NO GLIDING. NO FLOATING. NO SLIDING … NO MOONWALK" (H). "falls like dead weight, no stunt roll" (B★).
- **Solids:** "climbs over the tailgate … never passes through a door, panel or the truck body" (S★). "four correctly articulated legs" (BZ 53×).
- **Visible with the sound off:** "震动在关闭声音观看时也必须清楚可见" ("the shake must be clearly visible even with the sound off", F★). "THE SET IS IMMUTABLE" (B★ 127). "NOTHING APPEARS OUT OF THIN AIR" (T).
- **Speed:** "Natural real-time speed throughout. No slow motion anywhere" (T 187; C 310; S★ "no slow-motion unless stated").

### 3B.13 First-frame and final-frame locks
- **A shot that ends on a cut:** `FINAL FRAME: <framing, who where, prop state>` (B★ 65%). Hand-off: "End on a clean, sharp overhead frame suitable as the starting image of G02" (TK).
- **A source that will be extended:** end on a **continuable state**, never at the start of the next beat: "The camera is still creeping forward on the last frame, never settling"; "the shot ENDS THERE, on his hand on the latch, the door STILL CLOSED. We never see it open." (T). "End while Yoki continues chewing" (H).
- **Fixed last frame:** a short final link (≈9 s), "THE LAST FRAME IS FIXED — <<<image_N>>> … arrives … on the VERY LAST FRAME of the shot, still travelling until then — there is no static hold at the end" (T loop closer, final). An earlier "settles … and holds" version was trimmed before its end.
- **Fixed first frame on a backward link:** "<<<image_1>>> is the exact first frame of this shot … Start precisely on this frame" + "Its last frame must be identical to the source video's first frame". Hold the docking framing for the final 2 s (T prequel, 22 tries).

### 3B.14 Extension chains (the one-shot method: T + B★)
| Step | Rule | Evidence |
|---|---|---|
| Architecture | Make the hardest physical moment first as the **seed**, grow forward with extensions, reach the opening with **one** pinned backward extension | T (15 forward links + 1 backward); B★ approved interior take → backward 1-OTa + forward 5-OT |
| Source | Trim to the **last good frame** in the NLE; export ungraded and muted at the master frame size; tail **2–5 s for fast motion, 6–30 s** when faces, rooms and blocking must carry over | T |
| Output | Starts on the frame **after** the source (the source is not repeated); length = requested; **frame size inherits the source** whatever the aspect param says | T (ffprobe, every link); IP (16:9 request rendered 2206×946); F★ video_edit sent as 16:9, output follows the 21:9 input |
| Docking text | "This N-second shot continues the source video from its exact last frame, in the same unbroken take … The first frame of this extension is identical to the source video's last frame and the action flows on without a pause or a cut." | T 136/169 extensions |
| Describe the last frame | "The source ends on <framing, thirds, who where, prop state>" | T 61 |
| Carry velocity | "has been PUSHING IN … for 25 seconds, and it goes on pushing in at EXACTLY the same speed" | T |
| Don't replay | "Do not repeat its events" | B★ |
| Locks every link | LOOK LOCK ("THE SOURCE GRADE IS THE LAW … A cleaner, brighter … look = a failed take"); SPEED; SINGULARITY; ROOM IS CLOSED | T 177 / 187 / 170 / 46 |
| Backward docking | "This take must end on EXACTLY the same frame the reference video begins on — it is one single continuous cut." Fill Higgsfield's template line: pose, prop state, positions, background, camera, light, motion direction | B★ (finals `5609c259`, `b5d8d384`) |
| Minimal extension | one sentence of new beat + guards, face sheet re-attached: "she suddenly hears a faint, unsettling voice off-screen … Static camera, restrained performance, no gimmicks" (8 s) | K★ |
| Budget | median **8 tries per link** (3–32); 6% of generated seconds on screen; re-roll the identical prompt 2–4× in parallel before rewriting | T |
| Alternatives seen | default mode with the clip as video ref: "保留上传的三秒原视频作为00:00–00:04 … 从原视频最后一帧连续生成00:04–00:20" ("keep the uploaded 3 s as 00:00–00:04 … generate 00:04–00:20 continuously from its last frame", F★ final). Cinematic Video Editor adds 10–20 s (S★ 2/3 in the film). T's 9 default-mode-with-video tests were all unused, so **extension mode carried every T join** | — |

### 3B.15 `video_edit` (repairs and joins)
- **Repair template** (T): "Edit this video. Keep EVERYTHING exactly as it is — frame for frame … Nothing is added, nothing is removed, nothing is re-timed. Change ONLY ONE thing: …" + a protect-list + failure criteria on both sides ("Hands wiped clean … = a failed take. Hands coated solid red … = a failed take"). Name the subject that must survive: "THE DOG ITSELF IS NOT THE OBJECT TO REMOVE".
- **One-liner** (K★, in the film): "instead of walking slow she should walk very fast to the box, do not change video structure".
- **Masked prop repair** (F★): paint black over the wrong prop, then `video_edit` with image_1 (correct first frame), image_2 (housing/scale) and image_3 (state in the dark): "Images are visual reference only; do not insert stills or transitions. Keep the original 5 s … Fix only the gauge." (whether a repaired version reached F★'s film is not confirmed).
- Edits **return the source's length** (T). A last-day compliance edit on the logo master at 1080p shipped (T E12: "Only one thing is added").

### 3B.16 Multi-shot toggle vs written cuts
- 12/12 never used the toggle; **8/12 wrote cuts in the text**. Written-cut jobs work as **coverage rushes**: C "steal 1–3 s" (12 jobs give 55.8 s of the intro); K★ 8 jobs of 20–30 s give 76.6 s; L 2–5 shots per 30 s.
- Cut grammar that shipped: `CUT n (a-bs) — side, lens, size — BEAT:` with "The camera NEVER passes through the wall; cuts alternate sides" (B★) · `HARD CUTS only at 0:05, 0:08 and 0:11` (C) · "A HARD CUT is instant; a dissolve, wipe or joining move = failed take" (IP) · "⚠️ This video has STRICTLY N shots — do not add extra shots" (L 26) · the gunshot placed "exactly on the cut" (B★).
- Single-take films put the energy in camera speed instead (F★ S★ T H).
- Our 05 rule 3 forbids internal cuts. Two favourites (B★, K★) used written cuts and two (F★, S★) did not. Decision D-3.

Resolution ladder, draft use and re-run behaviour are merged into 3C §5.

### 3B.17 Fill-in templates

#### T1 — Single shot (`omni_reference`; S★ skeleton + B★ locks + L/K★ acting)
Params (05): `model seedance_2_5 · mode omni_reference · duration {{G}} (4–30 whole seconds) · generate_audio true · draft true · aspect {{film}}`; files in `medias` in handle order with roles `image_references` / `video_references` / `audio_references`. The optional START FRAME is either an `image_references` entry with the START FRAME line below or the `start_image` role; whether `start_image` combines with other references is 05-T11. Square-bracket labels follow S★; 05 §5.2 uses `【】` labels for the same slots (see P05-1).
```text
[GOAL] One continuous {{shot size}} take: {{subject}} {{principal action}} in {{place}}, {{time/light}}. {{Emotional register in 3–6 words}}. Story job: {{what this shot does in the film}}.

[REFERENCE USE]
@Image1–@Image4 are ONE person, {{NAME}}: @Image1 the face straight on, @Image2 three-quarter, @Image3 profile, @Image4 the full-body sheet. Use only face, hair, build and {{costume phrase, fixed wording}}; never the grey background or the panel layout. Use whichever angle matches the head position in each moment.
@Image5 is the LOCATION ONLY: architecture, materials and light direction; keep its geometry; never its framing, never any people in it.
@Image6 sets the grade, grain and contrast; match it exactly.  ← only on the look-in-plates route (D-2)
{{optional}} @Image7 is the START FRAME: the first frame of this video matches it exactly.
These references are knowledge, not shots: never cut to, settle on or reproduce a reference composition.

[LOCKS] Exactly {{N}} people at any moment, no one else, no doubles in glass or reflections. {{NAME}} stays frame-{{left/right}} of {{fixed object}}; {{axis}} is never crossed. {{Wardrobe/state: dust level, wet/dry}}. {{Props: count, owner, position}}. {{Name and side of any asymmetric mark}} — do not mirror.

[THE SHOT — one unbroken take, in continuous time]
Frame one is already running: {{who is where, mid-what}}. No empty establishing frame.
(0–{{t1}}s) {{one action, physical}}; at the end, {{visible state}}. NO CUT.
({{t1}}–{{t2}}s) Still the same shot: {{one action}}; {{micro-beat ① ② ③}}. NO CUT.
({{t2}}–{{G}}s) Still the same shot: {{one action}}. FINAL FRAME: {{framing, who where, prop state}}
   ← or, if this take will be extended: "ends mid-{{motion}}; {{next beat}} has not begun".

[CAMERA] {{size}}, about a {{NN}}-degree field of view, camera {{height m}} {{behind which shoulder / distance m}}. One move: {{start → end}}. A handheld operator physically present: breathes, drifts, corrects late; no gimbal, no zoom{{, no push}}. Every new framing is reached only by travel; the camera never passes through {{walls/bodies}}.

[PERFORMANCE] {{NAME}} {{surface word}} shows only as {{one physical tell}}. {{NAME}} does not: {{cry / gasp / look around / play to the lens}}. Natural minimal blinking; no sighing; eyes never on the lens.

[PHYSICS] {{action chain: preparation → contact at ~Xs → reaction → recovery}}. Real weight; each foot planted before the other lifts; {{material behaviour}}. Nothing appears, vanishes or floats. Natural real-time speed, no slow motion. The set is immutable.

[VISUAL STYLE] {{frozen look block from 02, verbatim}}

[AUDIO] Diegetic only: <{{sfx 1}}>, <{{sfx 2}}>, <{{room tone}}>, in this order. No dialogue. No music, no score, no drones, no stingers. No subtitles, no on-screen text.

[EXCLUSIONS] {{concrete failure seen in drafts}} = a failed take. A cut, dissolve or new angle the camera did not travel to = a failed take. {{generic: no CG look, no plastic skin, no readable text or logos}}.

[MAINTAIN CONSISTENCY] {{NAME}}: {{skin, hair, mark on LEFT/RIGHT, costume phrase}}. Wardrobe, props and spatial layout stay identical within the clip.
```
**Start-frame one-liner mode** (K★; only when an approved, identity-corrected start frame carries composition, light and wardrobe): `{{static handheld / locked}} shot, {{subject does one action}}, {{same angle}}, no zoom in, {{one guard}}` (8–40 words).

#### T2 — Dialogue shot (one speaking face; L + S★ + B★ + TK + C)
Add to T1. Long lens and a steady head (L single takes: 85–100 mm in 4 of 16; 05 §5.3: MCU, frontal).
```text
[REFERENCE USE] … + @Audio1 is {{NAME}}'s DIALOGUE AUDIO REFERENCE: the sole source of the spoken voice and its timing; do not synthesize a new voice; the silences absorb any difference, the speech is never re-timed.

[DIALOGUE LOCK] Exactly {{N}} spoken lines in the whole take, each said once, in this order: {{N1}} by {{NAME}}{{, N2 by OFF-SCREEN NAME}}. No other voice anywhere — no muttering, no murmured or half-heard speech. The descriptive sentences of this prompt are NOT dialogue. Language: {{language}}, {{accent, plainly described, never a caricature}}. Clear, normal conversational volume.

[THE SHOT — one unbroken take]
(0–{{t1}}s) Frame one is already running: {{pre-line physical beat}}.
({{t1}}–{{t2}}s) {{delivery adverbs + intention, e.g. "low, almost casual — testing it"}}: {NAME, {{language}}: "{{≤10 words}}"} — spoken to {{addressee, on/off screen}}. After the line: {{behaviour, e.g. holds the look, then drinks}}. NO CUT.
({{t2}}–{{t3}}s) {{listening beat: a physical reaction ①②}}. {{optional off-screen line}}: from {{behind the camera / beyond the wall}}, {{intention}}: {OTHER, {{language}}: "{{line}}"} — heard, not lip-read. NO CUT.
({{t3}}–{{G}}s) {{a hold: one breath, one blink}}. FINAL FRAME: {{…}}.
{{V.O. variant}}: the line is voice-over: {{NAME}}'s mouth does not move on it; lips closed; as if spoken beside the camera, no reverb.

[CAMERA] {{MCU, frontal or 3/4}}, about a {{14–20}}-degree field of view, a loose frame, only gentle drift, no zoom. Focus on the near-side eye.
[PERFORMANCE] Lines delivered low and natural, not staged; a micro-pause before each reaction; precise eyeline to {{addressee}}; natural minimal blinking; no sighing; mouth matches the {{language}} words exactly.
[AUDIO] Room tone, {{breath}}, {{one diegetic sfx}}, the line(s) close and dry. The silence between lines stays empty. No music, no subtitles.
[EXCLUSIONS] Any extra spoken word, a second moving mouth, or lips moving on the voice-over = a failed take.
```
The 14–20 degree figure is a conversion of 85–100 mm on full frame [INFERRED].

#### T3 — Extension link for a one-shot (`video_extension`; T + B★ + K★)
Params: `model seedance_2_5 · mode video_extension · extension_mode forward|backward · duration {{9–30}} · generate_audio true · draft true` (finalize with `draft_job_id`; if 05-T9 shows extensions cannot be drafted, run once at 1080p with the user's yes, 05 §5.8); the source goes in `medias` with role `video_references`. Source: see decision D-4 (our 05 §5.8 says the original by job ID; T used trimmed tails at the master frame size, ungraded and muted: **2–5 s for motion, 6–30 s for acting**). Attach the scene's reference set plus the face sheet.
```text
=== CONTINUATION — THIS SHOT EXTENDS THE SOURCE VIDEO ===
This shot continues @Video1 from its exact last frame, in the same unbroken take: the same {{location}}, the same {{grade}}, the same {{grain}}, the same {{light}}. @Video1 ends on {{framing and thirds; who stands where, facing which way; prop states and colours}}. The camera in @Video1 has been {{move}} at {{speed}}, and it goes on {{move}} at EXACTLY the same speed. The first frame of this extension is identical to @Video1's last frame and the action flows on without a pause or a cut. Do not repeat its events.

=== ONE SHOT — NO CUTS, EVER === Every change of framing is reached physically, on screen. An instant change of framing at any moment = a failed take.
=== REFERENCES — KNOWLEDGE ONLY, NOT SHOTS === @Image1 is {{NAME}}: identity and wardrobe only. @Image2 is {{LOCATION}}: geometry, materials, light only. They are not framings, not camera positions, not moments of this shot.
=== THE GEOGRAPHY OF THIS SHOT === {{who/what is where; ROOM IS CLOSED: nobody leaves, nobody enters / exterior LEADER: the camera always follows a moving subject; hand-off 1 — {{A}} to {{B}}, the new leader moving before the old one leaves}}
=== ACTION === ({{0–t1}}s) {{beat}} · ({{t1–t2}}s) {{beat}} · ({{t2}}–end) {{beat}}. The shot ends {{still in motion / before {{next beat}} begins}}: {{continuable end state}}. We never see {{next beat}}.
=== SPEED === Natural real-time speed throughout. No slow motion, no speed ramping, no time remapping.
=== SINGULARITY === Exactly {{N}} people; nothing duplicated.
=== LOOK LOCK — THE SOURCE GRADE IS THE LAW === Every frame keeps the exact look of the source. A cleaner, brighter, more colourful or sharper digital look at any point = a failed take.
=== AUDIO === Raw location sound continuing the source's bed: <{{sfx}}>. No music. {{DIALOGUE LOCK if any}}.
```
- **Backward variant** (B★ / T): replace the first paragraph with "This take must end on EXACTLY the same frame @Video1 begins on — {{pose and orientation, prop position/state, others' positions, background, camera position and composition, light, motion direction}} — so the two join into one unbroken take. @Image1 is the exact first frame of this shot; start precisely on it. For the final 2 s the camera holds @Video1's opening framing."
- **Fixed-last-frame variant** (T, short link ≈9 s): "THE LAST FRAME IS FIXED — @Image{{k}}. The shot arrives on exactly that picture on the VERY LAST FRAME, still travelling until then; there is no static hold at the end."
- **Minimal variant** (K★): "{{one new beat}}. Static camera, restrained performance, no gimmicks, no dramatic camera movement." + the face sheet re-attached.
- Loop: generate (re-roll 2–4× in parallel) → trim at the last good frame → export the tail → next link. Budget about 8 tries per link.

#### T4 — Transition shot (three routes)
**T4a — Frame-locked black-gap in-fill** (F★, `video_edit`, 4–12 s, all 54 at 1080p, 8 matched in the film). Build: in the NLE, last ~2 s of A + black gap + first ~2 s of B, exported at 24 fps. **Pending D-4:** this source is an NLE export, which 05 §5.8 currently forbids (edit sources are the original final by job ID, never trimmed, re-encoded or re-uploaded); use it only after T-C passes, on non-hero joins first. Params: `mode video_edit`, the export as `video_references`, `draft true` if 05-T9 allows. Frame math: the first frame is 1, so t s → frame t×24 + 1 (2.000 s = frame 49; 4.000 s = frame 97).
```text
Edit @Video1. Using @Video1 as the only video basis, fill only the black placeholder between {{a}} s and {{b}} s. The black is the area to replace, not a story blackout or a transition. The result keeps the original {{T}} s, 24 fps, {{F}} frames and frame size.
Top priority: 0.000 ≤ t < {{a}} s and {{b}} ≤ t < {{T}} s are locked original video: keep the original frames; no regeneration, repaint, beautifying, regrade, crop or speed change. Counting the first frame as 1: frames 1–{{a×24}} and {{b×24+1}}–{{F}} stay frame-identical to the input, each at its original time; generate only frames {{a×24+1}}–{{b×24}}. Frame {{b×24+1}} must be the input frame itself, not a similar reconstruction.
New action {{a}}–{{b}} s: picking up from frame {{a×24}}, {{subject}} {{continuous action}}; about {{a}}–{{x}} s {{sub-beat}}; about {{x}}–{{b}} s {{sub-beat}}. The camera continues its {{height, direction, inertia}}; it passes through real openings, never through doors, glass or bodies.
The start matches frame {{a×24}} ({{pose, props, camera motion}}); the end flows naturally into frame {{b×24+1}} ({{pose, size in frame, camera height and speed, background}}). Never copy a boundary frame into a freeze. Every frame from {{a×24+1}} to {{b×24}} shows visible content.
It reads as one real take by one camera. No black, cut, hidden cut, dissolve, fade, morph or teleport. The original sound stays at its original time; add no dialogue, music or whoosh.
```
**T4b — In-take transition through a physical occluder or medium** (`omni_reference`, no edit verbs). Sources: T window-frame wipe ("filling the frame edge to edge with dark wood for about half a second, a soft dark wipe across the lens … not a hard black cut, not a fade"); H cardboard curtain ("THE VERY FIRST FRAME MUST BE 100% COVERED BY A PLAIN CARDBOARD BOX EXTREMELY CLOSE TO THE LENS", growth only between takes); F★ Sc_01 (the move from seabed to coffee cup happens while the frame stays fully surrounded by murky fluid until 0:09; the study's gist of the Chinese prompt, not a verbatim quote); U mapping method [CS; transfer INFERRED]. The template avoids *change*, *continue* and *replace* (05 §5.2; see P05-11).
```text
[GOAL] One continuous take in which {{place A}} becomes {{place B}} without a cut: the shift happens {{behind a foreground occluder crossing the lens / inside {{medium}} that fully blocks the view / as the existing surfaces of A resolve into B}}.
[REFERENCE USE] @Image1 is the STARTING LOCATION: geometry and light only. @Image2 is the TARGET LOCATION, a full environment the viewer stands inside; it resolves around the subject, never as a flat picture. @Image3… {{NAME}} identity only. Knowledge, not shots.
[ANCHOR] {{NAME}} stays at the same floor position, unchanged, the fixed reference while the world moves.
[TRANSITION LAW] {{Occluder route: "{{object}} sweeps across the whole picture for about {{0.5}} s, edge to edge; behind it the framing of {{subject}} stays the same size; when it clears, {{place B}} is already there."}} {{Re-resolution route: the same surfaces become the next surfaces; detail resolves in steps — mass → edges → material → fine detail; contact shadows arrive one step late; deep shadows never finish resolving.}} {{Mapping, 4–7 pairs: {{A-thing}} → {{B-thing}}; …}}
[THE SHOT] (0–{{t1}}s) {{A, in motion}} · ({{t1}}–{{t2}}s) {{the shift, sub-timed, in the first two-thirds of the take}} · ({{t2}}–{{G}}s) {{B, the action carries on}}. FINAL FRAME / continuable end: {{…}}.
[CAMERA] A late witness: it notices, turns, returns to {{subject}}. Real-time speed; the occluder is a real object with weight.
[AUDIO] Material sounds only on the shift beat: <{{sfx}}>; the room resonance becomes {{new resonance}}. No whoosh, no glitch sound, no music.
[EXCLUSIONS] A fade, dissolve, crossfade, opacity shift, overlay, second image underneath, wipe graphic, or a hard black frame = a failed take. No magical particles, no dust cloud. {{NAME}} does not transform.
```
**T4c — Bridge between two approved clips** (B★ `e5498481`, 8 s, 1080p, in the film at medium confidence). B★ ran it in Higgsfield's default mode; on our route video references need `mode: omni_reference` (05 §5.1), with `@Video1` (outgoing) and `@Video2` (incoming) as `video_references` (each 2–30 s, 30 s in total): "A bridge shot between @Video1 and @Video2: it opens on {{the last state of @Video1}} and arrives at {{the first state of @Video2}}; {{one action}}." Spell out both boundary states (§3B.14). B★'s own version was one line, so this is the thinnest evidence here.

---

## 3C. Consistency and workflow

Module shorthand: `02` style prefix, `03` assets, `04` Blender blocking, `05` Seedance production, `05b` acting, `07` edit/mix/finish, `L.0b` the ledger folder tree.

### 3C.1 The frozen look block (11/12)

| Film | What was frozen | Evidence |
|---|---|---|
| B★ | Style / Lighting / Color / Grade / Camera / Skin / Technical strings | "Underexposed one stop, crushed blacks with detail" in 411/514 Seedance prompts; a Kodak-2383 `Grade:` line in 290; the doctrine changed 3× on days 1–2, then froze from 14 Aug; version bumped in a `$$$` header (470/514) |
| S★ | one `[VISUAL STYLE]` paragraph, identical in 13/13, plus one scene-specific light sentence | at most one "grade" image slot per prompt ("sets the grade, grain and contrast … match it exactly", 8/13). Casting and sheet prompts say "no grain overlay" (12/13): references stay clean and the look is added at video time |
| T | LOOK LOCK (177/214), FILM, LIGHT, SPEED blocks | a stock line in 203/214; "heavy desaturated olive-green grade" in 182 |
| L | `Style:` block in 38/43, two lengths | long version in 14 prompts, short version 61–108 words; every version shares the stock, grain, black and shutter lines |
| H | a VISUAL STYLE BLOCK on the image plates with the note "add to the end of every prompt" | in 29 image prompts; the same capture layer in every video prompt |
| IP | byte-identical sentences | "No subtitles, no burned-in text." in 413 prompts; "THE STOCK AND THE GLASS" in 130 [CS] |
| U | "Material film still …" suffix on stills | 967/1,194 image prompts; the same vocabulary in the video Lighting / Color / Camera blocks (121–125/128) [CS] |
| C | fixed treatment blocks per source | "100% matches the reference" in 421/443 |
| TK | one look line | "35 mm colour negative …" |
| BZ | value-locked phrases | "bone-white" 43; grain banned in 109/195 |
| F★ | repeated control phrases plus a **lens pass** on the plates | 154 edit jobs |
| K★ | **the exception**: "Short shared style fragments, not one fixed tail" | the look came from the Soul plates and the post grade |

**Where the look lives: two proven routes (a decision for us, D-2).**

| Route | Films | How |
|---|---|---|
| **Neutral references + a separate grade anchor + frozen text** | S★ (11/13 Seedance jobs in the film), TK (clean Soul Location plates; one look line in every video prompt) | casting photos and sheets say "no grain overlay"; the look is attached once as the "grade slot" |
| **Look baked into the location plates** | F★ (lens pass on 4 plate sets), K★ (Soul film-still plates), T (reverse plate with a full FILM/COLOUR block), L (plates "already in the final grade"), U (suffix), H (VISUAL STYLE BLOCK in 29 plate prompts; "the location Element is the look reference"), BZ (keyframes relit to the film's key) | the plate's grade leaks onto every shot, which is the intent |

Our skill uses route 1 for plates (03 plate laws: no baked grade, grain or bokeh; 02: "Look frames are not Seedance references by default"). More films (7) used route 2. Character sheets stay neutral either way (10/12). **Proposed test** [INFERRED]: run one shot twice in the D1 route test, once with the neutral master and once with a graded look plate of the same place, and judge at 2 fps.

**Rules that go with the frozen block.**
- **Shoot-out across engines first, then freeze** (5/12: B★ 532 jobs on 11–12 Aug across ≥6 engines; T 173 jobs across 4; BZ one key-art prompt in 4; H a 4-model casting bake-off; U day-1 world tests).
- **Grain policy is split.** Banned at generation: S★ (references only), BZ, C intro ("No film grain" 18). Asked for in the video text: L, T, U. Shared by both groups: no film puts grain on the *reference sheets*.
- **A colour script written as a rule in every prompt** (S★ 10/13): "The yellow scarf is the ONLY saturated warm object in any sea or underwater frame", reversed on purpose in one scene and removed from the mother after the departure. F★ reserved red for story objects.
- **Our fit:** our `LOOK vX.Y` prefix (02) is this frozen block. Paste it verbatim; change only scene light, action and audio per shot (B★ Adopt 1); record the look version in the prompt header (B★).

**Template: look card** (fill in; stored with 02's lock)
```text
LOOK v__.__ (frozen <date>) · sha256 <…> · variant: R-DAY | R-INT | DREAM | BROADCAST | FINALE
LOOK LINE (pasted verbatim into every Seedance prompt): <medium anchor> · <palette: dominant + one accent> · <black level> · <grain: none at generation | named> · <optics as visible effect> · <camera habit>
COLOR SCRIPT: <accent> is the only saturated <hue> in <world>; reversed in <scene>; removed after <beat>.
SCENE LIGHT (the one line that may change per scene): <practical sources, direction, time of day>
GRADE SLOT (only on the look-in-plates route): <asset id> "sets the grade, grain and contrast … match it exactly"
REFERENCES STAY CLEAN: sheets and plates "no grain overlay, no vignette" (S★) · plates pre-graded? yes/no (L, H)
POST GLUE: <global grade node> · <letterbox inside 16:9?> · <vignette> · <grain in post only once>
```

### 3C.2 Approved takes as references: the continuity chain (11/12)

**How hard the main reference was reused:**

| Film | Most-used reference | Uses |
|---|---|---|
| TK | salaryman-a | **56 of 64** Seedance jobs (88%) |
| B★ | Tommy's sheet | **415 of 514** (81%) |
| L | JUNE_CF_02 | 35 of 43 (81%) |
| T | the man's sheet | 145 of 214 (68%) |
| BZ | char_boy | 118 of 195 (61%) |
| U | heroine image | 75 of 128 (59%), and 23 of the 28 finals |
| K★ | face sheet | 21 of 43 (49%) |
| H | char_lora_v2 | 97 of 207 |
| C | char_captain | 85 |
| F★ | prop_helmet | 162 (122 of them Seedance); char_engineer-final 107 |
| S★ | each SÉKOU-B image | 7 of 13 |
| IP | the canvas-bag Element | 393 jobs |

References per job: typical median 3 (IP, H), 4 (U, L), 6 Elements (TK); S★ median 11 (range 6–18). IP never used more than **2 character Elements** in one job (its rule 5, the only explicit cap in the 12 studies).

**The five chain variants:**

| Variant | How | Films | Key numbers |
|---|---|---|---|
| A. Extension chain | trim the approved clip at its last good frame, re-upload the **tail**, extend forward or backward | T, B★, K★, IP | T: 15 forward links + 1 backward, 0 visible cuts in 5:14, median 8 tries per link (3–32), tails of 2–5 s for motion and 6–30 s for acting. B★: 94 backward extensions (82 of them the 1-OTa family from the re-uploaded approved interior take) + 34 forward (5-OT/5a); the film's exterior opening is a raw backward extension. K★ and IP: 1 forward each |
| B. Last frame + previous clip | the last approved frame as an image AND the previous approved clip (or its last 30 s) as video | S★ | 5 of 13 jobs; chain `03c07c4e` → CVE `bdfc4414` → trim `81fe2d2d` → `fb1705cd` |
| C. Frame grab | a still of an earlier take as a reference, start or end frame | L, F★, U, T, K★, IP | L: 9 of 15 uploads are grabs; two grabs became the start and end frames of a 19 s single take that replaced a jump cut. F★: 5 snapshots used as keyframes. U: the grab `7297dc51` in 19 jobs. T: the film's own first frame is the FIXED LAST FRAME of the loop. IP Pickups: "a frame from this film's own footage … is THE LAW" |
| D. Approved clip as a silent reference | video reference to a neighbouring approved shot | B★, C, H | B★: 107 uses of the location clip. C: 67 `video_job` references + re-uploaded clips. H: 85 uses, only 8 of them re-rolls of the same shot |
| E. Frame-locked in-fill joins | NLE: black between the tail of A and the head of B, then `video_edit` "keep frames 1–48 and 97–144 identical, generate only 49–96" | F★ | 54 jobs, 22 joins, 8 in the film, all made on the last day |

**Warnings from the data.**
- **A video reference outweighs a text negative** (C): a crew camera in take 1 carried into fragment 2 despite "No other crew visible".
- **Export sources at the master frame size, ungraded and muted** (T): extensions inherit the source frame (1470×630) although the job params say 1280×720.
- **Pinned siblings share first frames**, so thumbnail matching picks the wrong take. Match finals frame by frame (T).
- **The final is often not the newest version:** F★ Sc_02 v4 of 5, Sc_05 v1 of 4; IP `53024cad` beat its rewrite; B★ kept generating after a usable take existed [INFERRED in the study].

**Template: chain log row** (add to `SLA_SHOTS.csv` or the iteration log)
```text
shot_id | take | parent_take | link_type (EXT-F | EXT-B | LASTFRAME+CLIP | GRAB-START | GRAB-END | VIDREF | INFILL) | source_file | source_in_s | source_out_s | grab_s | frame_size | graded? | muted? | role_sentence | result_gen_id | used_in_s
```

### 3C.3 The post glue

| Glue | Films | Detail |
|---|---|---|
| One global grade over every clip | B★ K★ L C BZ (5/12) | B★: raw frames visibly brighter than the film; a darker, colder grade plus heavy vignette glue the engines together. K★: B/W bookends "absorb clips from two different eras of the project". BZ: colour render → luminance B/W, lifted toe (black 3–5%), soft shoulder (white ≈71% grey), vignette 15–18%, grain only in post |
| No regrade at all | S★ (1/12) | "The 35 mm vérité grade sits in the clips themselves; no regrade is visible" |
| Scope picture inside a 16:9 file | B★, BZ, U, C; K★ pillarboxes 4:3 | BZ slides the 2.34 window vertically per shot (4–22 px on a 90 px frame). Prompts protect the crop: B★ "16:9 protecting a 2.39:1 crop"; TK "central approximately 74% of the image height" |
| Punch-ins and crops | F★ (≈1.2× on Sc_02), BZ (≥15 of 45 shots, mostly 8–16%, up to ≈1.45×), K★, H (≈1.3×) | — |
| Speed and retime | K★ (a 2 s extension held to ≈6 s), L (overhead shot at ≈0.5×; Topaz Apollo), BZ (editor stretches) | — |
| Darkness as a splice point | F★ (Sc_07: two takes joined at the blackout) | — |

**Our fit.** Our deliverable is 16:9 at 1920×1080 or larger. A letterbox *inside* a 16:9 file (B★, BZ, U) is the pattern that fits the format rule [INFERRED]; 07 must confirm (D-9). Graded, upscaled or retimed Seedance frames still count toward the share (00 picture-share rule).

### 3C.4 Folders, naming and selection

| Pattern | Films | Detail |
|---|---|---|
| Everything in ROOT; selection in the NLE | K★, L, T | L had *empty* Characters / Location / Props / Takes folders |
| Asset-type folders + scene/video folders | B★, F★, S★, TK | F★: `characters/`, `locations/<place>`, `props/<item>`, `Animation/Sc_0N`, `Animation/Transition`, `Animation/Cleanup`, `Music`. TK: mood-coded `loc - RED MIRROR`, `loc - SODIUM`; `Characters/MAIN CAST` vs `Characters/Extras` |
| Numbered production-order tree with UNUSED at every level | C | `01_CHARACTER/{01_MAIN,02_SUPPORTING,UNUSED}`, `02_LOCATION/{INT_…,EXT_…,UNUSED}`, `03_PROP`, `04_FOOTAGE/{INTRO_<source type>, SCENE NN, SCENE 06A, END CREDITS}`, `05_MUSIC`, `06_SFX`. A later scene gets a letter so nothing renumbers; rejects are kept, never deleted |
| Approved-only folders; iterate in ROOT | H | `_CAST`, `_LOCATIONS`, `_SCENES` (the picks bin: 29 of its 33 in the film), `_TESTS`, `_POSTER`, `_SCRIPT`, `_AUDIO/{mix,stems,misc,music}` |
| Folder tree = shot list | BZ | `Scenes/Scene N. Name/<shot code + script line>/` for keyframes and `…/Animation/` for video; 10 **empty folders = planned shots**; VO files use the same codes |
| Scene, version and pickup folders | IP | `Scene 5 720p` → `Scene 5` → `Scene 5 v2`; `Pickups 1…8` made after the assembly (median 8 s, single-purpose); `Sound` as a folder of generated beds |

- **Likes and favourites: 0** in 9/12 (B★ F★ S★ L T TK IP H BZ). Selection lived in folders, re-uploads or the NLE.
- **Element naming:** `char_ / loc_ / prop_` with version numbers in 4/12 (F★ C BZ H); for example `char_<name>_s<stage>_v<n>` (H). L: `_CF` (character frame), `_MF` (master frame), `_RF` (reference prop), `_02` for a corrected version, and "Label each token's role in the prompt '(Kitchen)', because the label wins." TK: Element names can appear as on-screen signage.
- **Our fit** (L.0b already has `00_STYLE … 99_TESTS` and `04_SCENES/Sxx/{refs,blocking,drafts,finals}`): proposals in section 4, PL-1.

### 3C.5 Resolution ladder, draft use, upscalers

**Draft mode was never used (0/12).** The films used one of three ladders:

| Ladder | Films | Evidence |
|---|---|---|
| 1080p from the first job | S★, L, TK, C | 13/13, 43/43, 64/64 and 437/443 jobs at 1080p |
| Explore low, re-run the winning prompt at 1080p as a new take | B★, F★, K★, IP | B★ 238 jobs at 480p, 181 at 720p, 95 at 1080p; F★ Sc_07 run 31× at 720p, then 14× at 1080p; K★ day 1 at 720p, then 1080p; IP 88 rehearsal jobs at 720p for dialogue blocking, re-fired at 1080p with ≈93–96% identical text |
| Never 1080p for the finals; upscale or deliver low | BZ, H, T, U | BZ 480p scouts → 720p keepers (3 of the 30 Seedance picks are 480p) → 4K outside [INFERRED]. H: 720p master. T: 720p → Topaz 2K test → 4K |

**A re-run of a low-resolution winner is a different take, and three films kept the low-resolution one:** K★ ("the only 720p prompt re-run at 1080p (`990e40b2` → `516d8d63`, same text, refs reordered) was not used, and the 720p take stayed in the film"); F★ (the lit half of Sc_07 in the film is the 720p take `66ec4fac`); IP (two soba-hall shots from `Scene 6 720p`; "the performance won over the resolution"). At least one take below 1080p reached the final cut in 7/12 (F★ K★ IP BZ H T U). The counter-case: every frame-verified B★ final is 1080p. Audio-only plates went out at 480p (B★, IP).

This supports 05 rule 2 ("never re-run an approved prompt at 1080p"). Our `draft_job_id` finalize is the route none of them tried that may keep the approved performance at 1080p [INFERRED]; D1 test T3 must prove it.

**Upscalers:** Topaz in 2/12 (T: `thd-3` on 35 s NLE chunks, 19 jobs, 428 credits = 20.1% of its credits; L: Apollo interpolation, credited). Nano Banana as a *still* upscaler in BZ (33 jobs). The rest report no upscale job. Our finals come from finalize, so an upscaler is a rescue only, and is disclosed (09 table; 07 §7.5).

### 3C.6 Economics: how many takes the films needed

| Unit | Low | Typical | High |
|---|---|---|---|
| Generated : story seconds | S★ ≈1–1.4:1, L 3:1, TK 3.5:1, K★ 3.7:1 | C ≈8, U 8.5, BZ 8.6, H 9.8 | T 16.6, F★ 22, IP 28.4, B★ ≈35 [ARITH] |
| Video jobs that reach the film | S★ 85%, L 74%, K★ 53% | TK 42%, U 22%, H 20% | BZ 16%, B★ ≈4% |
| Tries per shot or link | S★: 1 rewrite in 13 | T median 8 per link (3–32); U transitions 4–21 | B★ 2-4-OT family 97 jobs, 1-OTa 91 |
| Identical-prompt rerolls | L 4 groups (edits cut *across* rerolls) | IP: 191 of 396 prompts fired exactly twice | T: 53 prompts run more than once (up to 5×) |
| Written vs generated length | S★: write 20 s of action, generate 25 s (the spare tail used) | TK: 30 s for a 26 s edit | B★: a 30 s prompt rendered at 8–15 s to keep the first beats |

**Template: budget sheet at our prices (draft 3 cr/s, 1080p 16 cr/s).** The ratios are the studies' [ARITH]; applying them to draft mode is [INFERRED].
```text
T  = story seconds (target 360)
R  = generated:story ratio for drafts (lean 3.5 · mid 8 · heavy 16)
H  = finalized seconds ÷ T (single-use takes ≈1.3, S★-style; mined long takes ≈2.2, L: 851 s of used jobs for 389 s)
Draft credits  = R × T × 3
Final credits  = H × T × 16
Example T=360: R=3.5,H=1.5 → 3,780 + 8,640 = 12,420 cr · R=8,H=1.5 → 8,640 + 8,640 = 17,280 cr · R=16,H=2.2 → 17,280 + 12,672 = 29,952 cr
(at $0.0446–0.05/cr: ≈ $554–621 · $771–864 · $1,336–1,498)
```

### 3C.7 Lean (K★, S★, L) against heavy (F★, BZ, C)

| | K★ | S★ | L | F★ | BZ | C |
|---|---|---|---|---|---|---|
| Jobs | 130 | 94 | 50 | 3,104 | 1,982 | 708 |
| Image : video jobs | 87 : 43 | 78 : 16 | 7 : 43 (Elements made outside) | 2,849 : 252 | 1,736 : 246 | 260 : 448 |
| Generated : story | 3.7:1 | ≈1–1.4:1 | 3:1 | 22:1 | 8.6:1 | ≈8:1 [ARITH] |
| Video jobs used | 53% | 85% | 74% | small (≈19 clips of 252) | 16% | intro 48% |
| Video days | 4 | <1 | ≈2.6 | 5 | ≈22 | ≈20 |
| Seedance prompt median | 325 words | 946 words | 569 words | 4,369 chars (Chinese) | 715 words | 2,563 words |
| Typical job | 5–30 s; 20–30 s multi-shot mined for 3–7 cuts | 20–25 s single take used whole | 30 s ×33, 2–6 cuts each | 22–30 s take + 4–12 s in-fills | 4–9 HARD CUT shots per clip | mostly 5–10 s |
| Team | not stated | not stated | "a single filmmaker" (credits) | 3 accounts | not stated | 2 accounts + a sound studio |
| Resolution | 720p → 1080p | 1080p only | 1080p only | 720p → 1080p (Sc_07) | 480p scout → 720p keep | 1080p |

**What all three lean films did:**
- **Locked the asset set in one burst before video (3/3).** S★: 73 of 78 image jobs in about 100 minutes. L: Elements in about 20 minutes, before the first video. K★: a 3-view sheet on 12 Sep, the day before 15 video jobs.
- **Wrote the whole film as one plan outside Higgsfield (3/3).** S★'s prompts cite "Part G1" and clip numbers from an external bible; L's prompts cross-reference one another ("the ONLY focus move in the entire film"); K★ used an external LLM (chat residue in 4 prompts).
- **Used long takes whole or mined them (3/3).** K★: eight 20–30 s jobs give 76.6 s of the film; `ba91994d` alone gives 22.5 s. L: 30 s jobs give 2–6 cuts each. S★: 8 of 12 clips play at ≥99% of their generated length.
- **Fixed in place instead of rerolling (3/3).** K★: a `video_edit` for tempo, a forward extension and a video-referenced reaction (about 18 s of the film). S★: editor extensions of +10 s and +20 s. L: start and end grabs turned a jump cut into a 19 s take.
- **Went to 1080p early (3/3).**
- **Designed out the failure modes (K★, L).** K★: no lip-sync, the husband never seen, the creature only as legs. L: one house, two women.

**What the heavy films' volume bought:**

| Film | Where the volume went | What it gave the film |
|---|---|---|
| F★ | images: 92% of jobs (plates growing to 16k characters, 154 lens passes, 231 posters) and 54 last-day in-fills | a film that reads as one take, with 4 visible edit points |
| BZ | 1,725 Nano Banana edits (87% of jobs, 0 credits shown) | one finished, relit, sky-matched keyframe per shot under one B/W look |
| C | 443 short Seedance jobs (96.4% of its credits) with 2,563-word templates | a 12-shot archive intro and a dialogue drama driven by voice recordings |

[INFERRED] Two of the three heavy films spent their volume in the cheap still medium, which is K★'s rule ("decide in stills, pay for motion") carried out at higher precision.

**Rule for our 21-day calendar:** run the **lean spine** — a one-burst asset lock (03 by D5), a whole-film shot plan (`SLA_SHOTS.csv`), 15–30 s takes used whole or mined, edit or extend before a reroll — and add one heavy tool only where the story needs it: in-fill joins for a one-take (F★), a lens or grade pass on the plates (F★, L), a keyframe per shot for a graphic look (BZ).

### 3C.8 Previz and blocking

| Method | Films | What happened |
|---|---|---|
| Grey-box 3D walkthrough as a video reference | B★ (1/12) | ≥12 uploaded 30 s versions, tool not recorded. "Follow the camera movement … EXACTLY" (0-OT v7–v10: 18 jobs, 0 at 1080p, abandoned) was softened to "PATH GUIDE only: take Tommy's route and the room layout from it — not its stiff camera, not its empty rooms, not its placeholder shapes", plus "the bed in the previz is a POSITION placeholder only". The approved take `09e63706` came from that family, which cost 97 jobs (12 at 1080p) |
| Self-filmed phone gesture clip | B★ | `44c9a024`, 6 uses: "GESTURE REFERENCE … Copy only the object's path … Do NOT copy the man, his clothes, watch, room, rug or daylight." The insert is in the film (medium confidence) |
| Location still with coloured stick figures | C (≈80 prompts) | "BLOCKING REFERENCE ONLY … the RED marker is <<<…>>> … The coloured markers are annotations, not objects"; plus composition stills (13 tokens) |
| Overhead floor-plan Element + `Spatial layout` lines | L | "the KITCHEN is IN FRONT of the sofa … NOT the kitchen" in 12 prompts; master two-shot stills as "layout authority" |
| Pencil-sketch version of an approved frame | F★ (in final Sc_04 `f5499d1f`) | "pose and spatial reference only; its lines, strokes, paper texture must not enter the image": gives the pose without taking over the first frame or the lighting |
| One finished keyframe per shot | BZ (Nano Banana 1,725 jobs), K★ (Soul plate → identity swap → start frame), H (75 Seedream keyframes, then dropped: only 6 of 42 finals carry an image reference) | — |
| Text only (metres, compass, seat order, named camera positions) | S★, TK, T, IP, U (+3 Cinema Studio movement presets) | — |

**Our fit (04 Blender playblasts as `video_references`).** B★ is the only evidence that grey-box previz works with Seedance 2.5, and it shows the cost: about 100 jobs for one 30 s one-take. Our 04 blockout clause takes "the camera position and movement" from the clip, which resembles B★'s abandoned strict wording; B★'s approved family took only route and layout. Proposals P04-1 and P04-2.

**Template: blocking reference lines**
```text
@Video{{n}} = PATH GUIDE ONLY (SLA_{{shot}}_PB_v{{nn}}): take the subject's route, timing marks and room layout; NOT its camera smoothness, NOT its empty rooms, NOT its placeholder shapes (the {{object}} is a POSITION placeholder; design a real {{object}}).
@Image{{n}} = BLOCKING STILL: {{colour}} marker = {{CHR}}, {{colour}} marker = {{CHR}}; markers are annotations, not objects; framing from the prompt.
@Video{{n}} = GESTURE REFERENCE (phone): copy only the hand path and which end is worked; do NOT copy the person, clothes, watch, room or light.
```

### 3C.9 Pre-submit lint (images and video)

Compiled from the failures recorded in B★ (lost tags, unfilled placeholders), C (empty role slot, lost tag, untagged still), H (43 empty Element slots, 24 header/param duration mismatches), K★ (ordinals wrong in 10 of 12, chat residue in 4), L (cut at 4,500 characters, "No dialogue" next to a line, dangling `@image4`), S★ (blank tokens in 3 of 13, duplicate N), TK (wardrobe named in a shared prompt).

**Every image prompt:**
- [ ] Header code, state and version present; the asset is logged against its job ID.
- [ ] Every reference has exactly one role plus a "not its background, light, expression, framing" line.
- [ ] No garment names in a prompt shared across characters.
- [ ] Side-named marks plus "do not mirror".
- [ ] The aspect parameter is set; the prompt ends where intended; no LLM chat residue.

**Every Seedance prompt:**
- [ ] LOOK line = `prefix/seedance.txt` byte for byte (sha256 match).
- [ ] Number of handles per media type = number of attached files of that type; handle number = position in `medias`; no duplicate N; one handle form only.
- [ ] Every handle has ONE role sentence with an "only … / not …" limit; no blank role lines ("– are ONE person", "Use  as", "is the environment").
- [ ] Each image of 3 or more has a role line; the anti-slideshow clause is present.
- [ ] The state sheet matches the scene state (wardrobe / wet / clean); small state marks written in text.
- [ ] At most 2 character identities; extras are text, never a principal sheet.
- [ ] Continuity take: last approved frame + previous clip or tail attached and logged (source job, in/out s).
- [ ] No leftover template placeholders (`<Character A's pose…>`); no LLM preamble, alternatives or "Copyable prompt:".
- [ ] The prompt ends with the exclusions and consistency blocks (no truncation).
- [ ] No contradictions (a quoted line next to "No dialogue").
- [ ] No duration, aspect, resolution or fps words in prose (05 rule 4); written action ≈ 80% of the generated length if the long-take rule (P05-6) is approved.
- [ ] Params: `model: seedance_2_5` · `mode` as planned (`omni_reference` / `video_edit` / `video_extension` + `extension_mode`) · `duration` 4–30 whole seconds · `generate_audio` on · `draft: true` (unless finalizing with `draft_job_id`) · aspect as decided · `folder_id` = the scene folder · every `medias` role is one of `start_image`, `end_image`, `image_references`, `video_references`, `audio_references`. (`multi_shots`, which the studies' jobs record as false, is not a parameter of our `seedance_2_5` route; written cuts stay governed by 05 rule 3 and D-3.)
- [ ] Crop-safe: action inside the central band if a letterbox is planned.

---

## 3D. Technique cards for the user's eight notes

The user's notes: THREAD = how the one-shot was done; UNPROMPTED = transitions between scenes and objects; LEAK = acting and realism; TOKYO 4:17 = actors look like real people; In Passing = natural secondary actors; CONTROL = documentary/archive opening; HUNGER = creature blending with the environment; Buzkashi = B&W framing and tonal range. Each card: what they did, exact wording, settings, pitfalls, how to apply it, and G-rating cautions. Templates already given in 3A/3B are pointed to, not repeated.

### 3D.0 Coverage matrix

| Technique | Films whose study shows it | n/12 |
|---|---|---|
| Whole film (or nearly) plays as one continuous camera | T (0 cuts 0:21–5:30), F★ (4 visible edit points in ≈194 s) | 2 |
| Long single takes as the hero format | B★ (two ≈30 s one-takes), S★ (`[STAGE]…NO CUT` in 13/13), L (16 single-take prompts), T, F★, K★ (20 s POV hold) | 6 |
| Seedance `video_extension` | T (147 forward / 22 backward), B★ (34 / 94), K★ (1 forward), IP (1 forward, 6 s) | 4 |
| Seedance `video_edit` repairs or in-fills | T 8, F★ 66, K★ 1, H 3 (none used), IP 2 v2v, B★ 4 (none used) | 6 |
| Lengthening with Cinematic Video Editor, output in the film | S★ (2), BZ (6); B★ ran 7, none confirmed in the film | 2 |
| Earlier frame or approved clip fed back as a continuity reference | S★ L F★ C H B★ U T K★ | 9 |
| In-shot "re-resolution" transition (the same surface becomes the next) | U (Cinema Studio 4.0) | 1 |
| Frame-locked black-gap in-fill to join takes | F★ (54 jobs, 22 joins, 8 matched in the film) | 1 |
| Physical foreground wipe or occluder inside a take | T, H (box curtains), B★ (brick edges past the lens), IP (crossers required), TK (extras as foreground wipes), K★ (sari blur past the lens) | 6 |
| Explicit restraint / anti-overacting clause | L, K★ (23/43), BZ (EMOTION LAW 30), C, S★, TK, F★, B★, H, T, IP | 11 |
| Ban on both extremes (no weeping AND no blank face) | BZ, K★ | 2 |
| Exact spoken-line count lock | T, B★, TK, F★, BZ, L | 6 |
| Lip-sync driven by supplied voice recordings | C (64 jobs, 6 recordings) | 1 |
| Neutral grey or plain character sheets | TK, T, B★, C, F★, S★, BZ, U, H, K★ (L used in-grade casting boards; IP's sheet format is not described) | 10 |
| Imperfection or "no retouch" wording on faces | TK, S★, B★, L, T, C, F★ (skin pass), BZ | 8 |
| Soul Cast casting | TK (main route, 4 of 84 kept), H (1 bake-off image), T (4 jobs) | 3 |
| Crowd or extras directed in text (no Element) | IP, TK, C, F★, T, BZ (POPULATION 33 / CROWD 25 laws), H | 7 |
| "Nobody looks at the lead / the lens" | IP, F★, TK, C, S★ | 5 |
| Fake archive / found-footage prologue | C. B★ used real 1943 photos (not generated) at the end | 1 |
| Non-human or animal integration as a system | H (full creature bible); partial in K★, U, BZ, T | 1 (+4 partial) |
| B&W made by converting colour renders in post | BZ (whole film), K★ (bookends). 0/12 asked the video model for B&W | 2 |
| Grain banned at generation, added in post | C (18/25 intro), BZ (109/195), S★ (references: "no grain overlay") | 3 |
| Field of view written in degrees | C (250 prompts), BZ (11) | 2 |
| Draft mode | none (draft off on every job in every study) | 0 |

---

### Card 1 · One-shot (note: THREAD; also B★, F★, S★)

**What they did.**
- **T: seed in the middle, grow both ways.** The most physical moment (the rat-height market relay) came first, as a standalone 25 s one-take with 3 image references; it was try 11 of 25. The film then grew forward through 15 `video_extension` links. One backward link, pinned at both ends, made the opening. A short final link lands on the film's own first frame, so the film loops. Result: 0 detected cuts from 0:21.1 to 5:30.7.
- **T link loop (17 times):** generate the extension → trim it in the NLE at the last good frame → export the tail as the next source (2.4–5.4 s for fast exterior motion, 6–30 s once faces, rooms and blocking must carry over; 1470×630, ungraded, mostly muted, named by in/out points) → upload it and extend forward with the same reference set. The output starts on the frame after the source; the source is not repeated (verified on every link). Extensions inherit the source's frame size even though the job params say 1280×720. Effort: median 8 tries per link (3–32); 5,226 s generated for 314 s of film (6% yield).
- **B★:** the interior one-take was driven by uploaded grey-box previz walkthroughs (≥12 versions). The approved take was re-uploaded, then extended backward (the exterior opening, used raw) and forward.
- **F★:** each scene is one 10–30 s camera move; scenes joined with in-fills (Card 2). A behaviour that kept dropping out (shake, flicker) was moved to line 1 and repeated at the start of 10 of 13 beat paragraphs.
- **S★:** three timed `[STAGE n | a–b s] … NO CUT — continuous take` blocks in 13/13 prompts. 6 of 13 takes have zero internal cuts. In one take (`851e4dc9`, 15.3 s) the model cut on its own near a stage boundary.

**Exact wording (verbatim).**
- Docking sentence (T, 136/169 extensions): "This 25-second shot continues the source video from its exact last frame, in the same unbroken take. … The first frame of this extension is identical to the source video's last frame and the action flows on without a pause or a cut."
- Last frame in words (61 prompts): "The source ends on the HUSBAND standing pressed back against the dark oak panelling, on the LEFT third of the frame …"
- Velocity, not just position: "it goes on pushing in at EXACTLY the same speed."
- No teleports: "Every change of framing is reached PHYSICALLY, on screen … An instant change of framing at any moment = a failed take."
- Exterior relay: "THE CAMERA NEVER STOPS — IT ALWAYS HAS A LEADER" · "NOTHING APPEARS OUT OF THIN AIR — Every creature and object enters the frame by physically travelling in from outside the frame edge."
- Continuable end: "The camera is still creeping forward on the last frame, never settling" · "the door STILL CLOSED. We never see it open."
- Speed (187/214): "Natural real-time speed throughout. No slow motion anywhere." · "no speed ramping, no time remapping, no frame-rate change".
- Look (LOOK LOCK header 177/214): "THE SOURCE GRADE IS THE LAW … A cleaner, brighter, more colourful or sharper digital look at any point = a failed take."
- References: "REFERENCES — KNOWLEDGE ONLY, NOT SHOTS … They are NOT framings, NOT camera positions, NOT moments of this shot."
- Fixed last frame: "THE LAST FRAME IS FIXED — <<<image_3>>> … arrives at <<<image_3>>> on the VERY LAST FRAME of the shot, still travelling until then — there is no static hold at the end".
- Backward dock (B★): "This take must end on EXACTLY the same frame the reference video begins on — it is one single continuous cut."
- Splice-ready opening (B★): "Frame one: the camera is already at Tommy's shoulder, mid-motion"; each beat starts "Still the same shot:".
- Previz (B★, 88 prompts): "The attached previz video is a PATH GUIDE only: take Tommy's route and the room layout from it — not its stiff camera, not its empty rooms, not its placeholder shapes".

**Settings.**

| Film | Mode | Resolution / aspect | Duration | Other |
|---|---|---|---|---|
| T | extension forward 147, backward 22, edit 8 | 720p (one 1080p edit); seed 21:9 | 25 s most; 30 s for acting; 9–15 s for precise links | audio on, no draft, multi-shot off |
| B★ | extension backward 94, forward 34 | 480p 238 / 720p 181 / 1080p 95; 16:9 | 30 s ×392 | finals are 1080p re-renders |
| S★ | default; Cinematic Video Editor ×3 | 1080p, 16:9 | 20–25 s (20 s of action written, 25 s generated) | 11/13 jobs reach the film |

**Pitfalls seen.**
- 25 s links aimed at a distant target were trimmed or dropped; the final loop link was cut to 9 s and approached over 3 links.
- Default mode with the source video as a reference (instead of extension): 9 jobs, none used.
- A hold at a link's end was trimmed; the study infers it reads as a freeze [INFERRED].
- The model inserted a whip jump inside the backward extension; it was accepted.
- Pinned siblings share a first frame, so thumbnails cannot find the final. QC frame by frame.
- Negatives reduce failures but do not prevent them: B★'s in-film take still shows a blood pool despite "NO blood on any floor".
- B★ shipped Higgsfield's extension template with its `<placeholders>` unfilled.

**Apply in our pipeline.**
1. **Scope:** a one-shot *sequence* (not the whole film) is AboStesha's decision at the animatic gate [INFERRED].
2. **Blocking:** our 04 Blender playblast is B★'s previz; bind it with the PATH GUIDE sentence (P04-1).
3. **Seed:** draft at 480p → approve → finalize at 1080p (05 §5.7).
4. **Links:** `mode: video_extension`, `extension_mode: forward`, template 3B T3. The source rule is decision D-4: test a trimmed tail on a non-hero shot before any chain.
5. **Budget** [INFERRED], at our prices: 8 drafts × 25 s × 3 cr/s = 600 credits plus a 1080p final of 400 = about 1,000 credits per link, or about 15,000 for 15 links.

**G-rating cautions.** T's material fails G1 (birth, haemorrhage, blood on the hands, a naked newborn), as do B★'s sniper, dead soldier and blood. Keep T's last-day compliance pass as a repair pattern: a 1080p `video_edit` with "the newborn … is COVERED … A shoulder or an arm of the child visible above the cloth at any moment = a failed take." Peril one-takes (F★'s flood, flipped car) need the G3 re-check ("peril and fear stay mild"); children stay safe (G2).

---

### Card 2 · Transitions (note: UNPROMPTED; plus F★ in-fills and in-take wipes)

**What they did.**
- **U: the transition is written inside one take** [CS]. No start/end frames, no extension, no multi-shot parameter and no video references (761/761 references are images). Every scene change has four parts: (1) a **reference map** with typed roles (STARTING / TARGET LOCATION, OBJECT-ONLY, FULL ENVIRONMENT); (2) a **law block** (the full MANIFESTATION LAW text in 35 prompts, 13 of the 28 final jobs); (3) **timed sub-second states**; (4) an **A→B mapping list** of 4–7 pairs. The subject stays fixed while the room rewrites around her. Yield: 28 of 128 videos used (22%); 4–21 tries per transition.
- **Joins between generations** come from reference hand-off (the TARGET plate of shot N is the STARTING plate of shot N+1) and from edit bridges: a noise frame; exit door → entry door opening toward camera; wall dissolve → wall opening; walk into white → open inside white; a held last frame (≈4–5 s); a motif match; a 0.4 s light-leak burst; reroll intercuts.
- **F★ black-gap in-fill:** in the NLE, ≈2 s of clip A and ≈2 s of clip B with black between them, exported 4–12 s at 24 fps, sent to Seedance (`video_edit` 41/54, all 1080p) with frame-numbered locks.
- **In-take wipes:** T's window frame wipes the lens for ≈½ s to pass from inside to outside. H: growth happens between takes; each join lands on a full-screen cardboard "curtain" close to the lens.

**Exact wording (verbatim).**
- U, MANIFESTATION LAW: "Nothing fades in, dissolves in, assembles from particles, flies in, or emerges from smoke or light. The thing is already in its final position, at its final size, in the very first frame — only unresolved." · "Resolution happens in visible discrete steps, not as a smooth fade … six to eight jumps in total, each smaller and closer to the last" · "Hands and faces resolve last. Contact shadows arrive one step behind. Deep shadow areas never finish resolving."
- Same-surface rule: "EVERY EXISTING PHYSICAL SURFACE MUST ITSELF BECOME THE NEXT SURFACE" · "This is not a fade. This is not a wipe. The set changes in place around the operator".
- Mapping: "A frame flattens and becomes a ceiling panel. … A rope barrier line becomes the edge where carpet meets parquet. A bench lengthens and resolves into one of the office chairs."
- Anchor: "The protagonist remains fixed in approximately the same floor coordinates".
- Object carousel: "fine detail disappears; material disappears; silhouette collapses into unresolved grip-sized image mass; new silhouette and material resolve in the same hand" · "The left chair never changes".
- Particle guard: "This generative granulation remains attached to the transforming surface. NO airborne particles. NO dust cloud." Sound: "No transformation whoosh. No digital glitch sound".
- F★ in-fill (translated): "Using <<<video_1>>> as the only video basis, fill only the black placeholder between 2.000 s and 4.000 s. The black is the area to replace, not a story blackout or a transition." · "frames 1–48 and 97–144 must be frame-identical to the input … generate only frames 49–96" · "start matches frame 48 … end flows into frame 97 … don't copy the boundary frame into a freeze" · "no black, dissolve, morph transition, jump cut or teleport" · "add no whoosh".
- T wipe: "the dark wooden frame … sweeps across the whole picture for a moment, filling the frame edge to edge with dark wood for about half a second, a soft dark wipe across the lens … not a hard black cut, not a fade, not a hold on black."
- H: "THE VERY FIRST FRAME MUST BE 100% COVERED BY A PLAIN CARDBOARD BOX EXTREMELY CLOSE TO THE LENS".

**Settings.** U (Cinema Studio 4.0): 30 s ×97 of 128, 21:9, 720p, audio on. F★: 4–12 s in-fills (5 s ×19), 1080p, `video_edit`; 54 takes for 22 joins, all made on the final day.

**Pitfalls seen.**
- An abstract mapping (creature rhythms → corridor features) came back as a frame-within-frame portal; it was kept. The study's one case [INFERRED].
- Without the line "FULL ENVIRONMENT … The viewer is standing INSIDE it", a target plate tends to be pasted in flat (the line is in only 4 of the last 5 attempts of the opening family) [INFERRED].
- The tail of a 30 s take often fails. Put the change in the first two-thirds.
- In-fill failure modes the later wording blocks: returning the black as-is, fading in, "bubbles turning into the cup", copying the boundary frame as a freeze.

**Apply in our pipeline.**
1. **Tag each transition in the script** (01): `T-ENV`, `T-OBJ`, `T-BIRTH`, `T-ABSORB`, `T-BLACK`, `T-MEDIUM` (U's proposed tags).
2. **Re-resolution belongs in DREAM shots.** 02 allows a PHYSICS EXCEPTION there. Our S01 pool-dream crowd morph (S01-SH04, soft at ≈17.5 s) is U's own adopt example: start the 5-state ladder 4–5 s earlier [INFERRED transfer to Seedance].
3. **Assets** (03): a STARTING plate, a TARGET plate, and one seam still (3A Template B5).
4. **REAL-world joins:** a physical wipe (a doorway, a crossing body) or an F★ in-fill. Each in-fill is a `video_edit` and stays Seedance (05 §5.8).
5. **Templates:** 3B T4a (in-fill), T4b (occluder, medium or re-resolution), T4c (bridge). Write with *becomes, resolves into, takes over*; never *replace, change, continue* in an `omni_reference` prompt (05 §5.2).

**G-rating cautions.** U's creatures (six fingers, parquet creature, dog-face slug, horn-dog) are body-horror; anything "born from a surface" must read as gentle in a G film. H's box curtain is safe. Light-leak bursts and flash cuts must stay comfortable to watch; the flicker risk is [INFERRED]; check it at G3.

---

### Card 3 · Acting and realism (note: LEAK; plus K★, BZ, C, B★)

**What they did.**
- **L: the character reference carries behaviour, not just looks.** `JUNE_CF_02` is a 9:16 casting board: 10 candid stills of her habits plus a typed card inside the image ("Constant micro-motion — jiggling knee, thumbnail picking at a mug's glaze, jaw working").
- **Each prompt restates this scene's state as body mechanics.** Micro-beats ①②③ in 6 prompts. Anti-performance rules: BLINKING in 22 prompts, NO sighing in 21, operator breathing in 24, no cinematic fill in 18.
- **Dialogue is sparse:** 30 distinct lines, median 5 words, at most 6 per 30 s.
- **Hard beats became single takes** on day 3: 16 single-take prompts with 4–6 s windows, 4 of them on a 100 mm lens; they are the film's longest shots (up to 19.4 s).
- **Others:** K★'s restraint clause in 23/43; BZ's EMOTION LAW in 30 prompts, banning both extremes; C's "PERFORMANCE LOCK — NOBODY ACTS", and the only lip-sync driven by supplied voice recordings (64 jobs).

**Exact wording (verbatim).**
- State as body (L): "⚠️ Throughout this clip she is AFRAID — the fear is physical and rising: shoulders drawing in, chin lowering, hands coming up small and defensive, weight shifting back, breath shallow and quick (not sighing — quick shallow inhales)".
- Micro-beats: "Performance micro-beats: ① her weight shifts slowly onto one hip ② one palm comes to rest flat on the counter ③ one visible slow exhale sinking through her shoulders".
- Blink and breath: "⚠️ BLINKING: natural and MINIMAL — occasional real blinks only, never fluttering, never rapid" · "⚠️ NO sighing anywhere — breath is quick and shallow (fear) or hard through the nose (rage), never a performed sigh".
- Ceiling: "underplayed to the edge of doing nothing, nearly neutral faces … No theatrics, no crumpling, no trembling, no staged pauses" · "Emotion in the body and stillness, not the face".
- Style-block line: "micro-pause before reactions, precise eyelines, wet living eyes with catchlight, visible breath and chest movement".
- Dialogue shape: "Without looking up, quiet, almost casual — the safe version of a dangerous question: "Did you sleep?" After the line her eyes lift for exactly one second — searching the other's face — then drop back to the mug."
- Line placement: "⚠️ Dialogue rule: one line = one shot — each character's line appears STRICTLY only inside that character's close-up" (this wording in 4 prompts; a shorter "One line per shot" in 9 more, 13 in all). Intelligibility: "⚠️ DIALOGUE IS CLEAR: spoken English, natural but fully intelligible, normal conversational volume … NOT mumbled, NOT whispered".
- Light: "STRICTLY only light sources that exist in the scene … NO cinematic fill of any kind … Camera always shoots from the character's shadow side. Hard shadow shapes preserved on walls."
- Camera as a person: "handheld throughout with natural operator breathing — no stabilizer, no zooming, no slider smoothness" · "catches focus a beat late".
- Physics as process: "⚠️ EVERY ACTION STARTS FROM ITS REAL BEGINNING AND COMPLETES WITH TRUE PHYSICS … Nothing is pre-done, nothing floats, nothing skips its middle."
- Both extremes banned: BZ "No tears, no trembling lip, no dramatic grimace = failed take. A completely blank face with no change in the eyes or the mouth = failed take." K★'s pasted LLM note: "you need both the positive and the negative or Seedance will either skip the tear or go full weeping".
- One physical tell (K★): "The only obvious indication of panic is the way she drinks the water quickly".
- Rhythm (C interview): "PAUSE. Two seconds. He stays on the interviewer, does not fill it … One unhurried blink." · "ZERO GESTURES".

**Settings.** L: 43/43 jobs at 1080p, 21:9, audio on, no draft; lens mentions 50 mm 38, 65/85 mm 20 each, 100 mm 10. C drama: the voice clip "governs the shot … Do not synthesize a new voice"; "the silences absorb the difference — the speech is never re-timed".

**Pitfalls seen.**
- A prompt containing both "dialaoge: …" and "June is alone. No dialogue." failed; the clean rewrite reached the film.
- A "mumbled" direction risks lines nobody can understand; L switched it off where the words mattered.
- A memory reference photo overrode the wardrobe text in 1 of 2 identical rolls.
- A montage prompt cut at exactly 4,500 characters lost its last shot and its style block.

**Apply in our pipeline** (fits 05b; voice-first stays our rule).
1. **Performance bible (05b §5b.2):** optionally add L's casting-board idea: 6–11 stills of the character's habits as an extra reference image [INFERRED that a board helps Seedance].
2. **Beat map (05b §5b.3):** at most 3 countable micro-beats per shot (05b already caps beat *turns* at two per generation). Emotion as breath type, shoulders, chin, hands, weight; never the emotion word alone (05b ground rule 2).
3. **Dialogue shots:** one line, one speaking face, the ElevenLabs take as `@Audio1` with C's voice-reference wording; intelligibility stated (3B T2).
4. **Hard beats:** a 10–20 s single take, 4–6 s windows each ending in one beat, the last window "Hold"; a narrow field of view of about 14–20 degrees stands in for 85–100 mm [INFERRED conversion].

**Template: performance block** (`omni_reference`; slots into 05's event script)
```text
STATE: {{CHR}} is {{plain surface word}}: {{breath type}}, {{shoulders}}, {{chin}}, {{hands}}, {{weight}}.
BEATS: ① {{countable action}} ② {{countable action}} ③ {{countable action}}.
RESTRAINT: blinking natural and minimal, never fluttering; no sighing; no eyebrow acting; emotion in the body and stillness, not the face; micro-pause before reactions; precise eyeline to {{target}}; wet living eyes with a catchlight.
BOTH LIMITS: {{tears roll / open sobbing}} = failed take; a completely blank face with nothing moving in the eyes or mouth = failed take.
LINE: {{CHR}}, {{delivery + intention}}: {"{{≤10 words}}"} spoken to {{who}}; afterwards {{post-line behaviour}}. Speech clear, normal conversational volume.
LIGHT: only the sources in the scene ({{list}}); no fill; camera on the shadow side.
CAMERA: handheld with natural operator breathing; catches focus a beat late; no zoom.
```

**G-rating cautions.** L's arc includes a strike between partners. It is off-screen ("THE STRIKE IS NEVER SHOWN … we HEAR it"), but it is still outside our rule: rage plays as a slammed palm, never a blow (05b rule 6). June rolls and smokes cigarettes: banned (G1; no tobacco objects in frame at G3). Romance stays modest (G1). No age words in performance text (05b rule 6).

---

### Card 4 · Actors who look like real people (note: TOKYO 4:17; plus S★, B★)

**What they did.**
- **Cast, don't describe.** TK ran Soul Cast in rounds of 7–10 with no text prompt, only parameters (genre, age, era, outfit, archetype, build), and kept 4 of 84 (4.8%). The rejects include the most idol-like faces; the study reads the picks as "lived-in but still camera-friendly" [INFERRED]. The archetype, era and outfit parameters produced the costume that stayed in the film.
- **"Re-photograph, don't redesign."** One identical 9,466-character GPT Image 2 prompt (4K) on each pick added real skin, fabric and studio light and kept the identity (3A Template A5).
- **One grey 3-panel sheet = one Element**, one image per Element. Video used tags only: 0/64 jobs carry image inputs; median 6 Elements per job, up to 12. 78% of video prompts say the Elements govern appearance. Principals are never re-described in video prompts; the text calls them A, B and so on.
- **Plates:** empty, practically lit Soul Location plates light the neutral faces, so the faces look lit by the place rather than pasted in.
- **Speech:** Japanese lines (48/64) for Japanese faces.
- **S★: a 4-slot pack per state** (3A Templates A1–A4): a casting front with no reference ("85mm lens, f/4", eye level, overcast window, "plain matte mid-grey", 13/13), ¾ and profile as "same session" edits of the front, and a 3-panel sheet with the front body headless; each new state re-derived from the master front with "The only change: …".
- **B★:** "Pore-level realism — vellus hair, asymmetric features, capillary flush" in 233 prompts.

**Exact wording (verbatim).**
- Priority ladder (TK): "IDENTITY > BEAUTY. REALISM > POLISH. MATERIAL REALISM > DIGITAL SHARPNESS. HUMAN IMPERFECTION > AI PERFECTION."
- No redesign: "DO NOT invent a new man. DO NOT beautify him. DO NOT make him younger. DO NOT make him more conventionally handsome."
- Detail cap: "Avoid excessive micro-detail or artificial sharpening. The face should look photographed, NOT rendered."
- Designed imperfection: "one tiny beauty mark low on one cheek, slight eyelid asymmetry, minor asymmetry in the corners of the mouth … They should be details discovered when looking closely."
- Skin: "NOT flawless skin … NO glass skin. NO porcelain skin".
- AVOID list (excerpt): "generic AI beauty, K-pop idol, J-pop idol, anime face, doll face, giant eyes, tiny artificial nose, perfect facial symmetry … influencer appearance".
- Two references, two jobs: "REFERENCE 1 = HOW TO DISPLAY HER. REFERENCE 2 = WHO SHE IS. … Do not average the two women together."
- Video rule line: "Use these references for identity, wardrobe, objects and architecture, not their reference-sheet composition."
- Acting notes (translated): "everyday tempo, answers follow quickly" · "do not demand a smile" · "no beauty filter on real faces".
- S★: "Keep their identity exactly — same face, same skin tone, same hair, same age, same clothing. Do not recast. Do not beautify. Do not change age." (41/78) · "The scar is on the LEFT cheekbone and must stay on the LEFT side — do not mirror the image."

**Settings.** Soul Cast: 10.08 credits for all 84 jobs. Realism pass: GPT Image 2, 4K, 16:9. Seedance: 1080p, 16:9, audio on, no start frame, no extension, no multi-shot.

**Pitfalls seen.**
- The shared realism prompt named A's suit and tie; GPT Image 2 added a tie to B. Never reuse a realism prompt that names wardrobe.
- The Element name `red-mirror` was painted onto the club's street sign.
- A 5 s pickup that named its Elements in words, without tags, was redone with tags; the tagged take is in the film.
- **Two opposite methods both worked:** never re-describe the face (TK, B★), or re-describe it and close with "100% matches the reference" (C 421/443; BZ repeats the identity text next to the tag).

**Apply in our pipeline** (03 with Sunburst and Nano Banana Pro / 2.1).
1. **Casting:** Soul Cast is not in our list. Run casting rounds of 7–10 in our engines [INFERRED] and pick the least "AI-pretty" face that fits.
2. **Realism pass** on the pick, before approval: 3A Template A5 with "preserve the wardrobe exactly as in the reference". Check eyes, hairline and collar at 100% and reject the pass if any feature moved.
3. **One sheet format for everyone:** neutral grey, no props, no light colour, no text (03 plate laws).
4. **Element names:** neutral codes that are harmless as on-screen text (`CHR_MIRAJ` style).
5. **Face route:** whether to re-describe the face in video text is decided by the T1 / 05-T11 result; log which method passed.

**G-rating cautions.** TK's world fails G1 and G3 (a hostess club, toasts with bottles and glasses, a pistol fired at a chandelier). Extras hold juice or water (05b §5b.8). Every face synthetic, no lookalike (G2). Ages stay in the asset sheets only, never in Seedance performance text (05b rule 6) [INFERRED that age parameters on images are safe].

---

### Card 5 · Natural secondary actors and crowds (note: In Passing; plus C, TK, F★)

**What they did.**
- **IP never gives an anonymous crowd an Element.** It pastes a block of crowd laws into every crowd prompt, each with a measurable clause: a headcount, an errand, an eye-line, motion, a shared physical cause, a required foreground occluder, a long lens.
- **Life signs on every face** in 707 prompts. **Running-take bookends** in 883 prompts; only the headers are fixed, the bodies are rewritten per shot (216 different "ALREADY RUNNING" paragraphs).
- **Featured extras:** 3–4 background people get a one-line vignette; plot-relevant extras become Elements with a colour-separation rule against the leads (3A Template A9). At most 2 character Elements per generation (max 2 across 886 jobs).
- **Attention is directed:** where the crowd's eyes go, who may look at whom, and the hero's speed relative to the flow.
- **Others:** C prevents clones by layout, not by asking; TK keeps extras as text only, fenced off from the principals' faces; F★ gives every extra a task and "nobody looks at the lead".
- Engine note: IP's crowd coverage is Cinema Studio 4.0 [CS], but its 173 Seedance prompts carry the same blocks (CANDID 170/173, EVERY FACE IN FRAME IS ALIVE 163/173).

**Exact wording (verbatim).**
- "THE CAR IS PACKED SOLID — AT LEAST FORTY PEOPLE, no empty floor. IN EVERY SHOT A NEAR BODY OVERLAPS THE NAMED SUBJECT … a soft shape at the frame edge is NOT enough. The named face stays clear. EVERY RIDER HOLDS A STRAP, POLE OR RAIL."
- "dark coats the majority, muted mid-tones — grey wool, camel, olive, beige; a good third women; nothing bright. Nobody makes room for the lens; NOT ONE PAIR OF EYES MEETS ANOTHER".
- "EVERYONE IS MID-STRIDE — weight on one foot, arms in counter-swing; nobody in a moving crowd stands still".
- Shared cause: "the BRAKE arrives: the whole crush LEANS AS ONE BODY".
- Life signs: "EVERY FACE IN FRAME IS ALIVE: eyes BLINK at uneven intervals, never on a count; chests breathe; gazes shift. EYES DO NOT WIDEN — lids LOW and RELAXED … A fixed stare = failed take."
- Bookends: "THE SHOT IS ALREADY RUNNING WHEN IT STARTS: the crowd already crossing …" / "THE TAKE IS STILL RUNNING WHEN IT ENDS: … mid-stride everywhere."
- Seedance form: "FOREGROUND CROSSERS, REQUIRED, AT LEAST TWICE — once early, once late … No foreground crosser = failed take."
- Behaviour, not expression: "nobody acts — each person wants only the ordinary thing in front of them, shown as behavior, never as expression."
- Voices: "VOICES ARE TEXTURE, never quoted lines".
- Element split: "Take identity and wardrobe from this element; take the beat's staging, hands and eyeline from the shot's prompt."
- Place fence (116 prompts): "GEOMETRY, MATERIALS, LIGHT only; its own wide view never appears".
- C: "NO FACE IN THIS SEQUENCE IS EVER RESOLVED … If no face is legible, no face can be repeated" · "There is ALWAYS an out-of-focus foreground body" · "Exactly ONE brief glance toward the lens in the whole sequence".
- TK: "Do not duplicate principal faces into background patrons." · "All background activity is staggered and independent. No synchronized gestures, posing, camera-facing smiles or stationary mannequin-like patrons."

**Settings.** IP used 720p as a blocking rehearsal for dialogue geography, then re-fired at 1080p with ≈93–96% of the text unchanged; two 720p takes still made the film. Crowd coverage was Cinema Studio 4.0 with 16–20 s four-shot prompts; Seedance carried 8 s single-take inserts at 1080p 21:9.

**Pitfalls seen.** An extras-only insert must not reproduce people who appear in the location plate (TK, translated: "if the location reference contains people, do not reproduce them"). IP used "TRUE SLOW MOTION" in 78 prompts; our 05 bans slow motion unless declared.

**Apply in our pipeline** (extends 05b §5b.8, which already asks for a headcount, business per person, staggered reactions and closed mouths).
1. **Paste a crowd block per location:** count, palette, errand objects, eye-line law with named exceptions, motion law, one shared physical cause, foreground crossers, a narrow field of view for compression.
2. **Featured extras:** at most 2 character identities per shot (IP), within our "≤3 tracked characters" rule; featured extras get a colour-separation line against the leads' wardrobe.
3. **Rehearsal:** the 480p draft settles crowd geography; the approved draft is finalized as the same take.

**Template: crowd block**
```text
THE CROWD: about {{N}} people, no empty floor; muted mid-tones {{palette}}; {{share}} women; nothing bright.
BUSINESS: every {{rider/guest}} holds {{strap / cup of juice / phone held low}}; nothing floats.
EYES: nobody looks at the lens or at {{CHR}}; exceptions: {{named}}.
MOTION: everyone mid-stride, both directions, own speeds; {{shared cause: the brake → the crowd leans as one}}.
FOREGROUND: a near body crosses between lens and {{CHR}} at least twice (once early, once late); {{CHR}}'s face stays clear.
LIFE: every face blinks at uneven intervals, chests breathe; lids relaxed, no wide eyes; mouths closed; voices are murmur only.
BOOKENDS: the shot is already running when it starts; still running when it ends.
```

**G-rating cautions.** IP is built on pickpocketing (crime as charm), a packed izakaya ("smoke, lantern light", beer pitcher) and kiss inserts. Swap in G business: tea, juice, prayer beads [INFERRED examples]. Romance stays modest. Panic in a crowd plays as turning heads and stepping back, never screaming faces (05b §5b.8). Children in crowds: G2.

---

### Card 6 · Documentary / archive opening (note: CONTROL)

**What they did.**
- **C built a 56 s "found archive" prologue** before a 2.39:1 drama: assembly pool footage, a riot, a helicopter aerial, a hospital reportage and a backstage interview. 25 Seedance jobs, all 4:3, 1080p, audio on; 296 s generated, 55.8 s used (19%) from 12 jobs.
- **Each prompt fakes a recording situation** (who filmed, why, with what), not a filter. The camera body, mounting and operator behaviour follow from that sentence.
- **Prompt clean, degrade in post:** 18/25 intro prompts say "No film grain"; only the two assembly prompts ask for analogue texture.
- **Generate rushes, keep 1–3 s:** 15/25 prompts are 2–6-shot sequences with hard cuts at exact timecodes. The editor took 1–3 s from one shot of each and reordered freely.
- **Iterate the treatment, not the subject.** The tattoo sequence went cinema → stock/tripod → reportage/handheld (used) within 29 minutes, with the subject text almost unchanged.
- **The archive ends on one object the fiction shares** (the barcode, locked as an Element plus a frame grab from the drama).

**Exact wording (verbatim).**
- Source: "Covered by the chamber's own house cameras" · "Broadcast pool footage: functional, unglamorous, recorded to document rather than to impress" · "the making-of camera, not the finished interview".
- Texture: "broadcast video, not film. Clean sharpness in the centre of frame, slightly soft at the edges … compression breakup only during the fastest whips".
- Bad light on purpose: "Faces are lit badly the way faces in real institutions are lit badly" · "Exposure is ridden manually: the iris opens and closes visibly … one correction per shot, never instant".
- Counted imperfection: "one visible hunt and recovery per shot, landing within half a second" · "one slow operator reframe at around 0:05 … arriving a beat late".
- Level horizon: "CAMERA — HANDHELD BUT LEVEL … The reportage quality comes from movement, not from tilt".
- Rushes: "CONTROLLED MULTI-SHOT SEQUENCE, 15 seconds total. Four shots. HARD CUTS only at 0:05, 0:08 and 0:11" · "First frame already contains … No empty establishing frame, no reveal."
- Nobody acts: "PERFORMANCE LOCK — NOBODY ACTS … This is being recorded, not staged."
- Optics: "OPTICS LOCK ACROSS ALL CUTS … Wider coverage is achieved only by the camera being farther away, never by a shorter lens".
- Sound: "NO MUSIC — ABSOLUTE … No drone, no pad, no sustained tone" · "NO SOUND ON THE CUTS: no sting, no impact, no whoosh" · "the very faint high hiss of the mic preamp".
- Interview eyeline: "His eyeline sits on the INTERVIEWER, just off-lens to screen-right … He NEVER looks into the lens".
- Text: "No readable text anywhere in frame, no signage, no logos, no insignia".

**Prompt skeleton (from 5 Sep):** SCENE CONTEXT (+ who covers it) → OUTPUT/FORMAT MODE → `<SOURCE> TREATMENT — THIS IS THE GOVERNING STYLE` → CAMERA — HANDHELD BUT LEVEL → NO MUSIC — ABSOLUTE → NO DUPLICATION → object and geography locks → ACTIVE REFERENCES → THE PEOPLE (exact head-count) → WHAT IS HAPPENING — A ROUTINE … → timed shots → PERFORMANCE LOCK → PHYSICS → LIGHTING → AUDIO (numbered) → POSITIVE CONSTRAINTS.

**Post recipe** (the study's own calibration on C's frames, not C's exact settings): scale to 720×540 and back → saturation 0.65, contrast 0.9, brightness +0.03 → light temporal noise → 4:3 inside the 2.39 band. No VHS overlay, no fake timecode.

**Pitfalls seen.**
- An 84° wide angle bent the chamber into a fisheye. The fix was the OPTICS LOCK, with 47°/29° only.
- A first take put a crew camera in frame despite "No other crew visible", and the attached video carried it into fragment 2: a video reference outweighs a text negative.
- A paste lost one ACTIVE REFERENCES tag; the attached barcode still was never tagged.
- 55 of 437 prompts state a duration that disagrees with the job's duration.
- A fact drifted between fragments (3 koi, then 4).

**Apply in our pipeline.**
1. **Where it fits:** our BROADCAST variant (Noah's stage feed in the lens HUD, 02) or any in-world recording [INFERRED fit].
2. **Writing it:** a recording-situation sentence plus a TREATMENT block. Under our 05 rule 3, generate each "rush" as its own short single shot, not as a written multi-shot [INFERRED transfer of C's rushes format]; decision D-3 may change that.
3. **Grain and degradation:** none in the prompt; degrade in post (07, P07-4).
4. **Field of view:** in degrees, never above about 70° for archive (the ~70° ceiling is the C study's own adopt rule [INFERRED]; C's prompts used ≈47° normal, ≈29° insert, ≈18° profile after an 84° take bent the chamber), with C's rectilinear lock and two straight-line checks.
5. **Audio:** a numbered diegetic list; room tone continuous across cuts; "NO SOUND ON THE CUTS"; a standalone "NO MUSIC — ABSOLUTE" block. Interviews: lavalier close and dry plus preamp hiss.
6. **Bridge object:** one object locked as an asset and seen in both the archive and the fiction; the archive ends on it.

**Template: archive / in-world recording shot** (`omni_reference`, one shot)
```text
SCENE CONTEXT: {{what happens, one sentence}}. Covered by {{who films it: house camera / news crew inside it / backstage handheld / CCTV}}, {{why}}.
{{SOURCE}} TREATMENT — THIS IS THE GOVERNING STYLE: {{camera body behaviour: fixed house camera / shoulder camera with fine tremor that lags half a beat}}; available light only, and clearly so: {{fixtures, colour cast, poor falloff}}; uncorrected colour; exposure ridden by hand, one visible correction per shot; one focus hunt and recovery at about {{t}} s, landing within half a second; video, not film; no grain, no tape artefacts, no found-footage overlay.
CAMERA — HANDHELD BUT LEVEL: the reportage quality comes from movement, not from tilt. About a {{47 | 29}}-degree field of view, rectilinear: verticals stay straight; wider coverage only by standing farther away.
FIRST FRAME already contains {{who, where, mid-what}}. No empty establishing frame, no reveal.
THE PEOPLE: exactly {{N}}, each one different; {{no face resolved | faces soft behind a foreground body}}. Nobody acts: this is recorded, not staged; {{at most one brief glance toward the lens}}.
No readable text anywhere in frame, no signage, no logos.
AUDIO: 1. {{room tone, continuous}} 2. {{event sound}} 3. {{distant sound}}. Nothing from outside the scene. No music, no drone, no sustained tone.
```

**G-rating cautions.** C's intro holds a riot, water cannon and a compulsory registration tattoo; a G film keeps only routine, non-violent situations (an assembly, a crowd at a gate, an interview) and no injuries. No real broadcaster, logo or channel identity (G2).

---

### Card 7 · A creature that blends into the world (note: HUNGER)

**What they did.**
- **A creature bible before any video**, four asset types, each a named Element: a stage sheet per look on neutral grey "photographed as if physically present on set"; a scale line-up with the heroine on one baseline in cm; a location plate at the creature's eye level for every set it appears in; clutter phases of the same plates from the same camera.
- **Design for integration** (H's own reading of why it blends): a dark matte body has almost no specular highlights to betray CG and takes on the room's shadows; the one bright plane, the pale face, sits where the practical light falls; the glossy black eyes reflect the room's real sources as catchlights; a soft, smoky lower edge forgives imperfect foot contact in stages 1–3. The first, pale design was rejected after 4 tries; the pivot came 10 hours later.
- **A fixed 12-block video prompt** with a pasted "CRITICAL YOKI INTEGRATION" block (92 prompts): Header → ELEMENT MAP → SHOT FUNCTION → CAMERA POSITION (mm / cm / m) → CAMERA BEHAVIOR → ACTION / TIMELINE (decimal seconds) → PERFORMANCE → FOCUS / OPTICS → LIGHTING (practicals only) → CRITICAL INTEGRATION → SOUND → HARD CONSTRAINTS.
- **Scale in three units in every shot** (cm, a landmark on the heroine's body, architecture) plus anti-shrink clauses and "NO growth during this shot". "Exactly one Yoki" in 142/207 prompts.
- **Growth only between takes**, hidden by in-camera cardboard wipes; two attempts to show time passing inside one take (360° orbits) were abandoned.
- **Shown only by one hard in-scene source** at the climax: one lamp, then one phone beam.
- The non-human appears in about 23 of the 42 final takes. Only 29 of 207 videos used an image start frame; identity came from Elements.

**Exact wording (verbatim).**
- Integration block (canonical form, `821e83bd`, final at 0:59): "CRITICAL YOKI INTEGRATION: <<<yoki-element>>> must look like a real physical creature captured in the same live-action apartment as everything else. Preserve his exact identity and anatomy, but inherit from <<<location-element>>>: the same lighting, the same shadow direction, the same softness, the same grain, the same focus response, the same exposure, the same early-digital compression. Correct floor contact and contact shadow under his feet or body. He must NOT look like: CGI, a rendered cartoon, a plush toy, an illustration, or a pasted asset."
- Location as photography: "Use <<<loc>>> as the exact apartment photographic-world reference." (50 image and 78 video prompts).
- No light of his own: "Use only motivated practical light … No softbox. No beauty fill. No separate key light for Yoki. He must not be specially lit." · "Do NOT add artificial rim lights or magical glow around them."
- Matched to the nearest human: "same exposure as nearby human, same fluorescent / storefront light, same color contamination, same shadow direction, same contact shadows, same optical softness, same motion blur, same autofocus response".
- Never cleaner than the room: "Do not make his eyes or face glossy-clean compared with the room. No CGI rendering. No collectible-toy appearance. No isolated studio lighting. Nothing tack-sharp".
- Scale: "Yoki's head should reach approximately Lora's mid-shin / just below knee" · "DO NOT REDUCE YOKI'S PHYSICAL SIZE JUST BECAUSE THE CAMERA IS FARTHER AWAY. Lora and Yoki become smaller in frame TOGETHER" · "THIS IS YOKI STAGE 2 … Exactly ONE Yoki exists. NO other Yoki stages. NO morphing. NO growth during this shot."
- Gait: "one foot stays planted on the floor → weight shifts onto that planted leg → opposite foot lifts completely from the floor → lifted foot swings forward → heel / sole contacts floor → weight transfers …" ending "NO GLIDING. NO FLOATING. NO SLIDING. NO SKATING. … NO MOONWALK. NO TELEPORTATION. NO ROOT-MOTION SLIDE."
- Contact: "When he takes purchases: hands and objects must make believable contact. When he eats them: material must deform physically. No clipping. No floating objects."
- Doorway: "both sides of torso contact doorway → forward movement stops … Subtle compression is allowed … No clipping. No wall penetration … No architecture expansion".
- Small performance: "Do not make him perform exaggerated cuteness" · "His menace comes from: size, silence, appetite, and inevitability."
- Sound: "No monster roar. No gore sounds. No horror music sting."

**Settings.** All 207 jobs 16:9, 189 at 720p and 18 at 480p; audio on 206; Elements on 199/207 (median 3); two finals at 480p. Final takes: median prompt 1,053 words, median 8 s.

**Pitfalls seen.**
- The scale line-up sheet did not hit its own numbers (measured about 70/105/135/200 cm against 40/90/160/260–280 asked): the sheet fixes order and rough ratios; the per-shot cm and landmark lines carry the real scale.
- 43 video prompts had an empty Element slot.
- Element images were swapped mid-production without renaming (`char_yoki_v4` pointed to three different images), which makes provenance hard to read.

**Apply in our pipeline** (any robot or other non-human in our script; the mapping is [INFERRED]: H is a creature film).
1. **Asset bible (03):** a sheet per state on our grey plate, a scale line-up with Miraj on one baseline in cm, an eye-level plate for any small subject, phase plates from the same camera for rooms that change.
2. **Video (05):** paste the integration block adapted by name only; the location plate named as the "photographic-world reference"; light only by the scene's practicals, no separate key, rim or glow on the non-human.
3. **Scale lock:** cm + landmark on the human's body + architecture, anti-shrink clauses for wide framing, sitting, approaching and doorways.
4. **Motion lock:** the gait cycle and FORBIDDEN list for any walking non-human (ledger L.7.7 robots).
5. **Change between takes**, never inside one; hide the join with an in-camera wipe (3B T4b) or a cut.

**Template: non-human integration block** (adapt names only)
```text
CRITICAL {{NAME}} INTEGRATION: @Image{{n}} ({{NAME}}) must look like a real physical {{robot | creature}} captured in the same live-action place as everything else. Preserve its exact identity and anatomy, but inherit from @Image{{loc}}, the photographic-world reference: the same lighting, the same shadow direction, the same softness, the same grain, the same focus response, the same exposure. Correct floor contact and a contact shadow under its feet or body. No separate key light, rim light or glow on {{NAME}}; it is never cleaner or sharper than the room. It must not look like CGI, a rendered toy, an illustration or a pasted asset.
SCALE: {{NAME}} is about {{cm}} tall: its {{head | top}} reaches {{Miraj's waist / the door handle}}. It does not shrink when the camera is farther away, when it sits, when it approaches or near the door. Exactly one {{NAME}}. No growth, no morphing during this shot.
GAIT: one foot stays planted → weight shifts onto it → the other foot lifts clear → swings forward → heel contacts the floor → weight transfers; the body rises and settles a little with each step. No gliding, floating, sliding, skating, moonwalking or turning in place without stepping.
CONTACT: hands and objects make real contact; materials deform where pressed; no clipping, no floating objects; nothing regenerates or duplicates.
```

**G-rating cautions.** H's stage 4 is menacing (ribs, a lunge in the dark). A G film keeps the non-human's menace mild, never a lunge at a person or a frightening reveal; "no roar, no gore sounds" stays.

---

### Card 8 · Black-and-white framing and tonal range (note: Buzkashi)

**What they did.**
- **Render colour, convert in post.** All 195 Seedance and 32 Kling renders were colour. The channel mix is plain luminance (a grid search found R .55 / G .05 / B .40 at Spearman 0.9438, against Rec.709's 0.9420: no filter trick). The tones were decided in the colour render, so values had to be designed into the prompts.
- **The measured curve:** a lifted toe, compressed mids and a long soft shoulder. A render's pure white lands at about 71% grey; blacks sit at 3–5%. Film-wide levels (0–255): average picture level median 47; black point p1 median 11 (only 22 of 358 s reach true black); white point p99 median 125, max 203; in 194 of 358 s nothing is brighter than mid-grey. "Brilliant" B&W here means a dark, compressed frame in which one or two shapes are clearly the brightest thing.
- **Vignette** about 15–18% added in post. **Grain banned at generation** ("film grain, added grain texture, visual noise" in the NEGATIVE of 109/195); 0 positive grain requests. **10-bit delivery** keeps sky gradients from banding.
- **Values designed in wardrobe and animals:** the uncle in "light bleached-bone-white chapan" (40 prompts), the boy in "traditional black Afghan clothing" (31), the boy's horse "light grey, almost white" (45), the father's horse a bold 50/50 black-and-white coat, the crowd's horses forced to "ordinary muted bay and chestnut".
- **One source, backlight, silhouette:** "single/only source" ≈41 prompts, "silhouette" 104 video and 102 image prompts; soft key outdoors ("dusk" 87, "overcast" 55, "blue hour" 207 image prompts); dust and haze as tonal planes (101 dust edits; DUST LAW 23).
- **Framing:** 16:9 renders with "no letterbox baked in", the 2.34 window cut in post and slid vertically per shot (4–22 px on a 90 px frame); ≥15 of 45 matched shots punched in (mostly 8–16%, up to ≈1.45×); field of view in degrees (47° groups, 29° singles); framing by body landmarks ("framed at the wrists") in 37 prompts; a static camera in every shot (static/locked 161 prompts).
- **Keyframes per shot in Nano Banana**, then a B&W preview before video credits.

**Exact wording (verbatim).**
- Hierarchy: "The man's pale off-white clothing stays the brightest thing in the room after the window." (8 takes) · "The uncle's pale chapan stays visibly lighter than every other rider's dark clothing throughout."
- Light: "A single hard window at frame-left is the only source. Strong contrast between light and shadow, deep black shadow filling most of the room, a bright blown-out window, dust in the air. The boy sits against the light and reads mostly as a dark silhouette with a thin rim of light on his hair and cheek."
- Readable shadows: "The foreground riders and horses must sit deep in shadow, dark and low-contrast but not pure black — enough shape and volume still readable to tell rider from horse."
- Relight before animating: "Fully re-light the scene for blue hour — not a color filter, but a real change in lighting".
- Colour discipline: NEGATIVE carries "oversaturated colors" (109) and "competing hues within one frame" (33); "Colours stay muted and desaturated, warm only where the window light falls, everything else deep cold shadow."
- Light change as a tonal arc: "LIGHT CHANGE LAW — required, not optional: The light at the start of this clip is dense, cool, heavily overcast dusk … The light by the end of the clip is a calmer, clearer … open blue evening light … An ending shot with the same density of haze … = failed take."
- Catchlight as the white point: "warm low soft directional light catching the iris and a single bright catchlight reflection, deep shadow falloff on surrounding skin".
- Framing: "Static locked-off camera at chest height, 47 degree field of view" · "Framed from the shoulders down to the knees, so the faces sit at the top edge and are not the subject; the hands are the subject." · "16:9 native frame, no letterbox baked in".

**Settings.** Seedance 2.5: 16:9, 720p 92 / 1080p 61 / 480p 42, 4–30 s, audio on, draft never; finals 17×720p, 10×1080p, 3×480p. Kling 3.0 for 5 near-still inserts ("living stills"). Nano Banana Pro 1,725 keyframe jobs. Starting grade (the study's ffmpeg recipe, tested on a source frame):
```text
colorchannelmixer=rr=.2126:rg=.7152:rb=.0722:gr=.2126:gg=.7152:gb=.0722:br=.2126:bg=.7152:bb=.0722,
curves=master='0/0.04 0.15/0.12 0.3/0.24 0.45/0.36 0.6/0.44 0.75/0.54 0.9/0.62 1/0.72',
vignette=angle=PI/5, noise=alls=5:allf=t,
crop=iw:trunc(iw/2.34/2)*2, pad=iw:trunc(iw*9/16/2)*2:0:(oh-ih)/2:black
```

**Pitfalls seen.** Hue-separated objects of equal luminance merge in B&W, so the render is kept close to monochrome already. The curve is a mean; interiors run darker and storm skies brighter, so grade shot by shot after it. A watch kept appearing on the uncle (a WRIST LAW followed) [INFERRED that it reacts to an earlier failure].

**Apply in our pipeline** (only if a sequence is B&W or near-monochrome, e.g. a memory or the DREAM variant [INFERRED fit]).
1. **Never ask the video model for black-and-white** (0/12 did). Render muted colour and convert in post (07, P07-3).
2. **Add a `Value in B&W:` line** to every character, prop and location entry (white / light grey / mid / dark / black), repeat the value word in every prompt, and write one hierarchy sentence per shot: "<X> stays the brightest thing in frame after the <window/sky>."
3. **One stated white source per shot** plus backlight or rim; shadows "dark and low-contrast but not pure black — shape still readable".
4. **Preview every keyframe desaturated with the curve before spending video credits**; if two important objects merge into one grey, change the wardrobe value or the light in the still, not in the grade.
5. **Grade targets:** black ≈3–5%, median scene ≈18%, peak white ≈70–80%; vignette 15–18%; grain once in post; 10-bit master.

**Template: B&W value block** (stills and video)
```text
VALUE IN B&W: {{CHR_A}} = {{white | light grey | mid | dark | black}}; {{CHR_B}} = {{a different value from CHR_A}}; {{prop}} = {{light grey}}; ground = {{dark}}.
{{CHR_A}}'s {{garment}} stays the brightest thing in frame after the {{window / sky band}}.
LIGHT: one source, {{the window at frame-left}}, is the only light; the rest of the room in deep shadow, dark and low-contrast but not pure black — shapes still readable. {{Backlight / thin rim on hair and cheek}}.
COLOUR: muted and desaturated; no competing hues within one frame; warm only where the {{window}} light falls.
No film grain, no added texture, no glow or bloom, no digital sharpness.
```

**G-rating cautions.** BZ's whip beats and its rough horseback game need the G check before anything similar is written; take the tonal method only.

---

## 4. What we change in our pipeline

Nothing below has been applied. Each item is **proposed**, carries an ID that matches its row in `../LESSONS.md`, names the module and section it would change, and gives the exact text to add. AboStesha approves or rejects each one; approved items are then edited into the skill and the LESSONS row moves to "approved" / "applied".

### 4.0 Decisions needed first (where the studies disagree with the current skill)

| ID | Our current rule | What the studies show | Recommendation |
|---|---|---|---|
| D-1 | 05 §5.2: handles are `@Image1` / `@Video1` / `@Audio1`; 05-T11 confirms the mapping | The studies' stored form is `<<<image_N>>>` (L: "the stored form of an @-mention"); S★'s first prompt used `@ImageN`; each form worked when it pointed at the right file | Keep `@ImageN`; let 05-T11 decide. One form per prompt, always |
| D-2 | 03 rule 3 + 02 §2.8: plates neutral (no grade, grain or bokeh); the look frame is never a Seedance reference | 7/12 fed graded plates as the look carrier (F★ K★ T L U H BZ); 2/12 kept references neutral and attached one grade slot (S★, TK) | Run the D1 route test (T-B below), then choose |
| D-3 | 05 rule 3: one shot, one camera, no internal cuts | 8/12 wrote cuts in the text and mined them as coverage (B★ K★ L TK IP C BZ U); two favourites did (B★, K★) and two did not (F★, S★) | Keep rule 3 for hero, dialogue and blocked shots. Test one written-cut "coverage rush" for inserts or atmosphere (T-F) before allowing an exception |
| D-4 | 05 §5.8: an edit or extension source is always the original final by job ID, never trimmed, re-encoded or re-uploaded | T fed 19 trimmed, re-uploaded tails into `video_extension`; B★ re-uploaded its approved take and extended it; F★ sent NLE exports with black gaps to `video_edit`. All reached their films, faces included | Test one trimmed tail on a non-hero shot (T-C); keep the rule for hero shots until it passes |
| D-5 | 05 §5.2: no edit or extension verbs (*continue*, *extend*, *replace* …) in an `omni_reference` prompt (official `TaskTypeMismatch`) | S★ `fb1705cd` ("continue its camera position … do not restage"), F★ `8bd8105a` ("视频续接 … 从最后一帧连续生成", "video continuation … generate continuously from the last frame") and B★ `e5498481` ("CREATE A LINK BETWEEN …") shipped in default mode on Higgsfield; no mismatch error is recorded | Write "carry on" in our role line; test S★'s literal wording once (T-D) and log the mode the job reports |
| D-6 | 02 rule 7: declarations, not blacklists; no `negative:` lists | ≥7/12 used a separate negative block (B★ S★ K★ C H BZ U); 3/12 wrote concrete "= a failed take" sentences (T 85% of prompts; IP 874/886; BZ 410×) | Keep the ban on comma-list negatives. Test allowing up to ~5 concrete "<visible failure> = a failed take" sentences per prompt (T-E) |
| D-7 | 05 §5.0: ByteDance recommends ≤1,000 English words | Medians above it reached the films: B★ 1,291, H 1,316, C 2,563, T 2,612 words | Keep ≤1,000 as the default; allow longer only for extension links and non-human shots, logged |
| D-8 | 05 rule 2: draft first; finalize the approved draft at 1080p | Draft mode 0/12 (absence, not counter-evidence); re-running a low-res winner made a different take, and K★, F★, IP kept the low-res one | Keep. D1 test T3 must prove the finalize keeps the performance |
| D-9 | Deliverable 16:9, 1920×1080 or larger | Scope picture inside a 16:9 file in B★, BZ, U; prompts protected the crop (B★, TK) | Decide the film's frame (full 16:9 or letterbox inside 16:9) at 02/07 before D7 |
| D-10 | 04 rule 3: a BLOCK shot lasts G ≤ 15 s (scenario-labs: 20–30 s clips drifted); 05: duration = G | S★ 20–25 s takes used whole; B★ 30 s one-takes; T 25 s links; S★ wrote 20 s of action and generated 25 s | Keep the 15 s cap for playblast-driven shots. Allow 20–25 s for text-blocked long takes (P05-6) |
| D-11 | 02 rule 2: no camera, lens or stock brand names in prompts | B★ ("Kodak 2383", "Alexa 65"), S★ ("Kodak Vision3 500T"), H ("Cooke S4/i"), T, L used them | Keep the ban; describe the visible effect (all templates here already do) |
| D-12 | 02 §2.6 and 05: banned words "8K", "hyperrealistic", "photorealistic" on faces | B★ "Technical: 24fps smooth motion. 8K detail." in 241 prompts; H "hyperrealistic live-action documentary footage" header; 7 films used "photorealistic" on faces | Keep the bans as caution; no study shows harm or benefit |
| D-13 | 03 plate laws: one readable face per sheet; flat shadowless light | Headless one-face sheets in 3/12 (B★ S★ C); two-face 3-panel sheets also worked in 3/12 (F★ T TK); TK lit sheets with a 45° soft key | Keep both; TK's key is the fallback if the face panel reads flat |
| D-14 | 03 §3.3: element route vs raw images decided by T1 | Elements in 7/12, raw images in 5/12 (three favourites raw); re-describing the face in video text worked both ways (TK/B★ never; C/BZ always) | Let T1 / 05-T11 decide both; log which passed |
| D-15 | 05b rule 6: no age words in performance text | S★ aged its lead from 16 to 18 in the text mid-production ("Characters in mortal danger should read as 18+") [reason INFERRED] | Keep 05b rule 6; ages live only in the asset sheets |

### 4.1 `02-style-prefix.md`

**P02-1 · §2.8 · Engine shoot-out before the lock.** Evidence: 5/12 ran one (B★ T H BZ U); B★'s doctrine changed 3 times on days 1–2, then froze and stayed in 391 prompts.
```text
Look shoot-out (D2, before the Gate). Write one look-dev still in the order of prompt-library style.md "Look-dev still". Run it 2–4 times each in GPT Image 2.5 Sunburst (max, 4k) and Nano Banana Pro (4K), and once in Midjourney by hand. The user scores and picks. The winning visible behaviours become the core's CAPTURE, LIGHT LAW and TEXTURE lines. Every later change bumps the version (2.12) and is logged in decisions.md with the reason.
```

**P02-2 · §2.5 · A colour-script line per world.** Evidence: S★ wrote the motif rule into 10 of 13 prompts and reversed it on purpose; F★ reserved red for story objects.
```text
COLOR SCRIPT (one line per variant, pasted with it): <accent colour> is the only saturated <hue family> in <world>; it is <reversed | absent> in <scene>. Attach the accent to an object or light, never as a bare colour.
```

**P02-3 · §2.6 variant CAMERA line · The operator sentence.** Evidence: operator wording in 6/12 (S★ 13/13, B★, L, F★, H, C); "static handheld" for locked frames (K★ 30/43).
```text
CAMERA (handheld variants): a handheld operator is physically present: the frame breathes, drifts and corrects a beat late; no gimbal smoothness, no zoom; every new framing is reached only by moving the camera.
CAMERA (locked variants): a locked frame with only a faint breathing sway; the subject moves inside the frame, the frame never follows.
```

**P02-4 · §2.8 · D1 route test for where the look lives.** Evidence: 7/12 graded plates vs 2/12 neutral references + grade slot (3C §1). [INFERRED test]
```text
Route test (D1–D3): render one approved shot twice from the same draft settings: (a) the neutral master plate + the frozen look text; (b) a graded look plate of the same place + the same text. Compare at 2 fps for skin, black level and grade stability. Record the winning route in decisions.md; 03 makes plates accordingly.
```

**P02-5 · §2.5 BROADCAST variant · Recording situation, clean prompt, degrade in post.** Evidence: C (12 intro jobs in the film; 18/25 "No film grain"). [INFERRED fit to our BROADCAST variant]
```text
BROADCAST: each shot names who records it and why ("covered by the venue's fixed house camera"); the treatment describes that camera's behaviour, available light and one counted imperfection (one focus hunt, one late reframe). The prompt asks for clean video; degradation (softness, desaturation, lifted blacks, ratio) is added in 07. Field of view never above about 70 degrees.
```

**P02-6 · §2.5 (conditional) · A B&W or near-monochrome variant.** Evidence: BZ (whole film), K★ (bookends); 0/12 asked the video model for B&W.
```text
If a sequence is black-and-white: never write black-and-white in a generation prompt. Render muted colour; every character, prop and location carries a "Value in B&W" word repeated in each prompt; each shot states its one white source and "<X> stays the brightest thing in frame after the <window/sky>". Conversion, curve, vignette and grain happen in 07.
```

### 4.2 `03-assets-images.md`

**P03-1 · §3.1.4–3.1.5 · Star-shaped angle chain and state packs.** Evidence: S★ (identity held through 4 states with packs re-derived from the master front); 8/12 separate sheets per state.
```text
Every angle (heads5) and every state sheet (ward-<LOOK>) is an edit of the APPROVED face/front plate, never of the previous angle or state. State prompts open with the identity block and "The only change: <x>" and say what the change is NOT when it touches a motif colour. Wardrobe and big body states get their own sheet; small dirt or blood marks are written in the shot prompt.
```

**P03-2 · §3.1.4 · Side-named marks.** Evidence: 5/12 (S★ F★ C BZ L); "do not mirror" in S★ and F★.
```text
Every character has 1–3 asymmetric marks written with a side ("a small scar on the LEFT cheekbone"). Every sheet prompt repeats: "The <mark> stays on the <LEFT> side — do not mirror the image." The same line goes into the continuity bible and every Seedance prompt that shows the face.
```

**P03-3 · §3.1.4 · Realism pass before approval.** Evidence: TK E2 (4/4 picks became Elements); F★ skin pass. Clash with rule 5 avoided by running it before approval [INFERRED sequencing].
```text
Before the user approves a face plate, run one realism pass (prompt-library characters.md "Realism pass") on the chosen take: preserve-list, material realism, "IDENTITY > BEAUTY. REALISM > POLISH". Never name a garment in a realism prompt shared across characters ("preserve the wardrobe exactly as in the reference"). Check eyes, hairline and collar at 100%; reject the pass if any feature moved. The approved result is then the untouched base (rule 5).
```

**P03-4 · §3.1.3–3.1.4 · Casting rounds and written imperfection.** Evidence: TK (4 of 84 kept); imperfection wording in 8/12. [INFERRED mapping to our engines]
```text
Casting round: 7–10 candidates per role across Sunburst and Nano Banana Pro from the Character Brief; the user rejects the most "AI-pretty" faces first. A face written from text alone adds the DISTINCTIVE HUMAN DETAILS, SKIN and ABSOLUTELY AVOID blocks (characters.md "Designed-face imperfection blocks").
```

**P03-5 · §3.1.6 · Plate template additions and plate-derived views.** Evidence: empty plates 9/12; camera as a position 6/12; story affordances 5/12; new views as edits 5/12; same-camera phases 4/12; eye-level plate (H).
```text
Master plates add: things in reading order with distances in metres; the story affordances already in place (the door used for the exit, room for the action); where the light stops; an Avoid list built from the last failed variant. A rev or angle-<n> plate is an edit of the approved master ("Only change the camera position, camera height and viewing direction"), never fresh text. Rooms that change over time get phase plates from the same camera. Any small subject gets one plate at its eye level.
```

**P03-6 · §3.1.1 · Extras policy.** Evidence: TK, IP (anonymous extras text only); S★, IP (featured extras small pack); IP's 2-Element cap.
```text
Anonymous extras never get a sheet or element; they live in the shot text (05b §5b.8). A featured (plot-relevant) extra gets face + turn3 only, plus a colour-separation line against each lead's wardrobe and one identifying prop. At most 2 character identities per Seedance generation.
```

**P03-7 · §3.1.7 · Prop states and the detail that must survive.** Evidence: product shots 9/12; one image per prop state (F★, B★); T's thread line.
```text
One prop sheet per state (lit / unlit, full / empty). Each prop prompt names the one detail that must survive, with a size comparison ("<detail> about as thin as <familiar object>"; T's thread wording is not reused: the spindle and thread are on its do-not-copy list). A prop image overrides the text when they disagree (S★), so fix the image, not the wording.
```

**P03-8 · new §3.1.9 · Non-human bible.** Evidence: H (40 Elements; the non-human in about 23 of 42 final takes). [INFERRED fit to our robots]
```text
Any robot or creature with screen time gets: a sheet per state on the grey plate, "photographed as if physically present on set", a dark matte body with one bright plane where the practical light falls; a scale line-up with the human lead on one baseline in centimetres; an eye-level plate for each set it appears in. The scale sheet fixes order and rough ratios only; every shot prompt restates the size in cm, a body landmark and architecture.
```

**P03-9 · new §3.1.10 · Transition assets.** Evidence: U (STARTING/TARGET plates; three seam plates fed to 10–18 jobs each) [CS]; usefulness [INFERRED].
```text
For every transition tagged in 01 (T-ENV, T-OBJ, T-BIRTH, T-ABSORB, T-BLACK, T-MEDIUM): a STARTING plate, a TARGET plate (the next shot's STARTING plate), and one seam still with both states in one frame.
```

**P03-10 · §3.1.1 · Neutral asset and element names.** Evidence: TK (`red-mirror` painted onto a sign).
```text
Asset and element names are neutral codes (CHR_MIRAJ_S1_v02, LOC_METRO_MASTER_v01). Never a word we would mind seeing painted on a sign in the picture.
```

**P03-11 · Common failures / QC · Image pre-send lint.** Evidence: 3C §9 failures (S★ squares from ratio words; TK tie; K★ residue).
```text
Before every image job: aspect parameter set (words only steer composition); one role + "not its …" line per reference; no garment names in a prompt shared across characters; side-named marks + "do not mirror"; the prompt ends where intended; no chat residue; header code and version in the log.
```

### 4.3 `04-blender-blocking.md`

**P04-1 · §4.9 / T3 blockout clause · A PATH GUIDE variant for long moves.** Evidence: B★ only (1/12): the strict "Follow the camera movement … EXACTLY" family gave 18 jobs, 0 at 1080p, abandoned; the softened PATH GUIDE family produced the approved 30 s one-take (97 jobs). Our clause currently takes the camera path from the clip. Test before adopting (T-G).
```text
PATH GUIDE variant (moves over ~10 s, multi-room routes, one-takes): "@Video1 is a PATH GUIDE only: take <subject>'s route, timing marks and the room layout from it — not its stiff camera, not its empty rooms, not its placeholder shapes. The <object> in @Video1 is a POSITION placeholder only." The camera behaviour then comes from the text (02 operator sentence). Keep the current clause for shots where the camera must match the playblast exactly.
```

**P04-2 · §4.1 triage · Still-based blocking for locked or dialogue shots.** Evidence: C (≈80 marker-still prompts), L (floor-plan Element), F★ (pencil sketch in final Sc_04). Cost saving [INFERRED].
```text
Triage adds a STILL route: for locked or dialogue shots, blocking is a still made from the approved plate — coloured stick-figure markers ("markers are annotations, not objects"), an overhead floor plan, or a loose pencil sketch ("pose and spatial reference only; its lines and paper texture must not enter the image"). Blender is kept for camera moves longer than about 10 s and for multi-room routes.
```

**P04-3 · §4.1 · Phone gesture reference for precise hand procedures.** Evidence: B★ (`44c9a024`, 6 uses; the insert is in the film at medium confidence).
```text
For a precise hand procedure, the user may film the gesture on a phone (silent, plain room). Bind it as "GESTURE REFERENCE: copy only the hand path and which end is worked; do NOT copy the person, clothes, watch, room or light." It is a reference only, logged with authorship like a playblast.
```

### 4.4 `05-seedance-production.md`

**P05-1 · §5.2 · Four slots added to the prompt structure.** Evidence: story job in GOAL (S★ 12/13); opening state ≥9/12; end state ≥8/12; "Still the same shot:" (B★) / "NO CUT" (S★ 39×); the knowledge-not-shots umbrella (T 117); anti-slideshow (K★).
```text
【Generation Goal】 ends with one sentence: "Story job: <what this shot does in the film>."
【Reference Asset Roles】 ends with: "These references are knowledge, not shots: never cut to, settle on or reproduce a reference composition." With 3 or more images add: "Do not reproduce the reference images as fixed opening frames, animate them one after another, or transition between them as a slideshow."
【Event Script】 opens with "Frame one is already running: <who, where, mid-what>." and closes with "FINAL FRAME: <framing, who where, prop state>", or, for a take that will be extended, "<subject> is still <moving>; <next beat> has not begun." In takes of 10 s or more each range after the first starts "Still the same shot:".
【Maintain Consistency】 repeats each identity line, the side-named marks and the costume phrase verbatim.
```

**P05-2 · §5.2 handles · Role vocabulary.** Evidence: 11/12 role sentences; the lines in 3B §5 shipped in finals.
```text
Role lines (one per handle, always with an "only … / not …" limit): IDENTITY · LOCATION ONLY · START FRAME · LAST APPROVED FRAME ("same place — copy its geometry, light direction and grade") · PREVIOUS APPROVED CLIP (see D-5) · PATH GUIDE · GESTURE REFERENCE · POSE SKETCH · BLOCKING STILL · SCALE SHEET ("only as the scale-continuity reference") · DIALOGUE AUDIO REFERENCE. Copy the wording from prompt-library seedance-action.md "Reference role block".
```

**P05-3 · §5.4 · Pre-submit lint.** Evidence: 7/12 recorded tag failures that mis-bound references.
```text
Before every submit, run the lint in studies/2026-11-02_CROSS-STUDY.md §3C.9: handles = attachments per type and in order, no blank role line, no duplicate N, no placeholders or chat residue, the prompt ends with 【Maintain Consistency】 and the audio line, no "No dialogue" next to a quoted line, no duration/aspect/fps words in prose.
```

**P05-4 · §5.1 packet · The continuity pair for running scenes.** Evidence: S★ 5/13 jobs (last frame + previous clip); 11/12 fed approved output back. Wording pending D-5.
```text
A shot that continues a running scene carries the previous approved final's last frame (the _LF.png from 5.7) as an image_reference and the previous approved final as a video_reference (by job ID). Role lines: "LAST APPROVED FRAME of <shot>: same place; copy its geometry, light direction and grade." / "PREVIOUS APPROVED CLIP <shot>: carry on its camera position, lens, handheld character, light, grade and the positions of everyone in it; do not restage." Log both in the chain log (ledger L.4).
```

**P05-5 · §5.6 · Fix in place before a new version.** Evidence: 8/12 tried, 7/12 in the film (K★: about 18 s of its film from one edit, one extension and one video-referenced reaction).
```text
When a draft is right except for one thing, try in this order before writing a new version: (1) a video_edit with one change ("Keep EVERYTHING exactly as it is … Change ONLY ONE thing", 5.8), (2) a forward video_extension for the next beat. Each is logged as a pass (eNN) on the same source.
```

**P05-6 · §5.1 duration · Long takes keep a tail.** Evidence: S★ (20 s of action written, 25 s generated, the full 25 s used once); TK (30 s for a 26 s edit). Pending D-10.
```text
For text-blocked long takes (not playblast-driven BLOCK shots), write action for about 80% of G and leave the rest as handle: the last range is a hold or a continuing motion. 07 trims it.
```

**P05-7 · §5.2 · Start-frame one-liner mode.** Evidence: K★ (every prompt of ≤28 words reached the cut, 6/6).
```text
When a shot has an approved, identity-corrected start frame that already carries composition, light and wardrobe, the prompt may be 8–40 words: camera behaviour + one action + one guard ("static handheld shot, she lifts the cup, same angle, no zoom in"). The audio policy line still opens and closes it.
```

**P05-8 · §5.3 · Dialogue locks.** Evidence: line-count lock 6/12; V.O. and off-screen forms (S★, T, K★); voice reference wording (C, 64 jobs).
```text
Add to every dialogue prompt: "Exactly <N> spoken lines in the whole take, each said once, in this order … No other voice anywhere. The descriptive sentences of this prompt are NOT dialogue." Off-screen lines: "heard, not lip-read". Voice-over: "<NAME>'s mouth does not move on it; lips closed; as if spoken beside the camera, no reverb." @Audio1 binding may add: "the sole source of the spoken voice and its timing; do not synthesize a new voice; the silences absorb any difference, the speech is never re-timed."
```

**P05-9 · new §5.8b · One-shot chain.** Evidence: T (15 forward links + 1 backward, 0 visible cuts in 5:14), B★ (finals built by backward and forward extensions). Pending D-4.
```text
A one-shot sequence is a chain: seed take (the hardest physical moment) → forward video_extension links → at most one backward link pinned with a first-frame image. Every link uses prompt-library seedance-oneshot.md: the docking sentence, the source's last frame in words, the camera's speed, ONE SHOT / KNOWLEDGE NOT SHOTS / SPEED / SINGULARITY / LOOK LOCK blocks, and a continuable end state. Budget about 8 drafts per link. QC by frame-matching against the timeline, never by thumbnail.
```

**P05-10 · §5.8 · Frame-locked in-fill join.** Evidence: F★ (54 jobs, 22 joins, 8 in the film).
```text
Join two approved finals with a video_edit in-fill: in the NLE, last ~2 s of A + black gap + first ~2 s of B at 24 fps; prompt from prompt-library seedance-transition.md "Frame-locked in-fill" with frame numbers (t s → frame t×24+1). Draft the in-fill if 05-T9 allows; otherwise 1080p direct with the user's yes. Pending D-4: the NLE export is a re-uploaded source, which §5.8 forbids until T-C passes.
```

**P05-11 · §5.2 · Transition block.** Evidence: U [CS]; T and H in-take wipes (Seedance). Re-resolution only in DREAM (02 PHYSICS EXCEPTION).
```text
Transitions inside one take use prompt-library seedance-transition.md: an occluder wipe or a medium for REAL scenes; a re-resolution law + an A→B mapping list for DREAM scenes. Vocabulary: becomes, resolves into, takes over; never replace, change or continue in an omni_reference prompt. The change sits in the first two-thirds of the take.
```

**P05-12 · §5.2 physics · Dropping behaviour fix.** Evidence: F★ (the in-film take repeats the flicker and shake at the start of 10 of 13 beats).
```text
If a persistent behaviour (shake, flicker, rain, wet state) drops out mid-take, move it to the first line of 【Generation Goal】 and open each Event Script range with a short refrain of it, instead of adding more text lower down.
```

**P05-13 · §5.2 · Non-human integration block.** Evidence: H (92 prompts; non-human in about 23 of 42 final takes). [INFERRED fit to robots]
```text
Any shot with a robot or creature pastes prompt-library seedance-action.md "Non-human integration block": the location plate as the photographic-world reference; inherit lighting, shadow direction, softness, grain, focus response and exposure; floor contact and contact shadow; no separate key, rim or glow; never cleaner than the room; scale in cm + body landmark + architecture with anti-shrink clauses; the gait cycle; "no growth or morphing during this shot".
```

**P05-14 · §5.2 camera · Framing by travel, readable stops.** Evidence: T ("NO new angle that the camera did not travel to"), B★ (62 prompts), TK ("the moment it stops, show the face").
```text
Camera sentence adds: "Every new framing is reached only by travel; the camera never passes through walls, glass or bodies." After any fast move: "it lands on a readable beat on <face> before moving again."
```

### 4.5 `05b-acting-direction.md`

**P05b-1 · §5b.3 · Micro-beats and both limits.** Evidence: L (①②③, max 3), BZ (EMOTION LAW, both extremes), K★ (tear pair).
```text
A shot carries at most three countable micro-beats, written ① ② ③ ("one visible swallow"). Any shot with a strong emotion states both limits: the over-play ("open sobbing = a failed take") and the under-play ("a blank face with nothing moving in the eyes or mouth = a failed take").
```

**P05b-2 · snippets · Standing restraint footer.** Evidence: L (BLINKING 22, NO sighing 21), restraint clauses in 11/12.
```text
Every performance snippet ends: "Blinking natural and minimal, never fluttering; no performed sighs; emotion in the body and stillness, not the face; a micro-pause before reactions; eyes reach the target before the head; wet living eyes with a catchlight."
```

**P05b-3 · §5b.6 · Off-screen and voice-over forms.** Evidence: S★, T, K★, B★.
```text
Off-screen speaker: "from behind the camera, heard, not lip-read". Voice-over: "<NAME>'s mouth does not move on it; lips closed". Silent shot: "Nobody speaks; no lip movement." One line per speaking close-up, ≤10 words, followed by a written after-line behaviour.
```

**P05b-4 · §5b.8 · Crowd laws.** Evidence: crowds directed in text in 7/12; IP life signs (707 prompts) and bookends (883); C anti-clone by layout; TK no duplicated principal faces.
```text
Every crowd shot adds: the eye-line law with named exceptions; one shared physical cause with its second ("the bus brakes at 2 s; the whole crowd leans as one"); foreground crossers at least twice, the lead's face kept clear; "every face blinks at uneven intervals, chests breathe, lids relaxed"; "the shot is already running when it starts and still running when it ends"; no principal face duplicated into the crowd; where faces would repeat, keep them unresolved behind foreground bodies.
```

**P05b-5 · §5b.2 · Optional behaviour board.** Evidence: L only (`JUNE_CF_02` in 35 of 43 jobs). [INFERRED that a board helps Seedance]
```text
Optional: a behaviour board per lead (6–11 candid stills of the actor's habits + a short card: wardrobe locked, 2–3 behaviours, one line of inner life), tested on one shot before it is attached widely.
```

**P05b-6 · new note in §5b.7 · Non-human performance.** Evidence: H.
```text
A robot or creature performs small: no pet tricks, no exaggerated cuteness; presence comes from scale, stillness and attention. G: never a lunge at a person, no roar.
```

### 4.6 `07-edit-mix-finish.md`

**P07-1 · §7.6 / §7.12 · Letterbox inside 16:9 (if D-9 chooses it).** Evidence: B★, BZ, U; crop-safe prompts (B★, TK).
```text
If the film is letterboxed: masters stay 16:9; the scope window is cut in post and slid vertically per shot; every Seedance prompt keeps faces and action inside the central band ("compose for a centred 2.39:1 crop"). Punch-ins stay small (most of BZ's were 8–16%).
```

**P07-2 · §7.3 · Frame-match finals.** Evidence: T (pinned siblings share first frames); finals often not the newest version (F★, IP, B★).
```text
Identify every clip on the timeline by frame-matching against the downloaded originals, never by thumbnail or by "newest version". Log the matched job ID and in/out seconds.
```

**P07-3 · §7.6 · B&W conversion recipe** (only for B&W sequences). Evidence: BZ (measured on 45 matched frames).
```text
Luminance mix (Rec.709 weights), curve 0/0.04 0.15/0.12 0.3/0.24 0.45/0.36 0.6/0.44 0.75/0.54 0.9/0.62 1/0.72, vignette about −0.25 stop, grain in its own layer once, 10-bit master. Targets: black 3–5%, median scene ≈18%, peak white 70–80%. Grade shot by shot after the base.
```

**P07-4 · §7.6 · Archive degradation recipe** (BROADCAST shots only). Evidence: C (the study's calibration on C's frames).
```text
Scale to 720×540 and back; saturation ×0.65, contrast ×0.9, brightness +0.03 (C's `eq` brightness, not a black-level lift); light temporal noise; the source's native ratio inside the film frame. No tape overlay, no fake timecode.
```

**P07-5 · §7.3–7.4 · Bridge list for joins.** Evidence: F★ (darkness splice), U [CS] (held last frame, door to door, motif match, reroll intercut, ≤0.4 s light burst), H (box wipe).
```text
Allowed joins, in order of preference: a cut on motion; a splice at natural darkness; a held last frame of 1–5 s; a motif or shape match; exit door → entry door; an intercut of two takes of the same transition at matching compositions; a light burst of 0.4 s or less (G3 flicker check).
```

**P07-6 · §7.4 · Pickups after the first assembly.** Evidence: IP (Pickups 1–8, median 8 s); TK (5–8 s pickups for joins).
```text
After the first assembly, list the missing looks, inserts and reactions and generate them as 3–8 s single-purpose Seedance shots in 04_SCENES/PICKUPS_nn/, each with the scene's references and a frame grab from the neighbouring final as LAST APPROVED FRAME.
```

### 4.7 `ledger-continuity-physics.md`

**PL-1 · L.0b · Folder additions.** Evidence: C (UNUSED at every level; letter suffixes), BZ (empty folders = planned shots), IP (Pickups), H (picks bin); 9/12 never used likes.
```text
Add UNUSED/ beside every approved/; one empty sub-folder per planned shot ID under 04_SCENES/Sxx/ from SLA_SHOTS.csv before D7; 04_SCENES/PICKUPS_nn/ after the first assembly; finals/ holds picks only; an inserted scene takes a letter (S06A), never a renumber.
```

**PL-2 · L.4 · Chain-log columns.** Evidence: 11/12 fed approved output back; T logged sources by in/out points.
```text
SLA_SHOTS.csv adds: parent_take | link_type (EXT-F | EXT-B | LASTFRAME+CLIP | GRAB-START | GRAB-END | VIDREF | INFILL) | source_in_s | source_out_s | grab_s | role_sentence.
```

**PL-3 · L.1 · Element naming and versioning.** Evidence: F★ C BZ H (`char_/loc_/prop_` + version); H swapped Element images without renaming; TK name-as-signage.
```text
Elements are named <type>_<NAME>_<state>_v<nn> with neutral words; a new image is always a new version and a new element, never a silent swap.
```

**PL-4 · L.6 · Continuity bible fields.** Evidence: side-named marks 5/12; fixed costume phrase (K★, 11 prompts); colour script (S★); B&W values (BZ); scale in three units (H).
```text
Per character: side-named marks; the costume phrase, fixed wording; the colour-script role. Per non-human: height in cm, its body-landmark match on each lead, its doorway fit. If B&W: the value word for every character, prop and location.
```

**PL-5 · L.7.7 · Robot gait and contact.** Evidence: H (gait cycle with FORBIDDEN list; DOORWAY PHYSICS in 11 prompts).
```text
Walking robots: the gait cycle (planted foot → weight shift → lift → swing → heel contact → transfer) and the forbidden list (no gliding, floating, sliding, skating, moonwalk, turning without stepping). Contact: hands and objects touch, materials deform, nothing clips; a body too wide for a doorway stops against it with slight compression and no architecture change.
```

**PL-6 · L.5 · Budget in generated seconds.** Evidence: 3C §6 (ratios 1–35:1; credits not comparable across accounts).
```text
The share and budget sheet tracks generated seconds per scene (drafts and finals) against story seconds, using R (lean 3.5 · mid 8 · heavy 16) for the plan, and flags a scene that passes its R.
```

**PL-7 · L.7.11 · "Visible with the sound off".** Evidence: F★ ("the shake must be clearly visible even with the sound off").
```text
Physics QA adds: watch every take with the sound off; shake, impacts and weight must read from the picture alone.
```

### 4.8 D1 tests these proposals need

| Test | For | Method | Pass |
|---|---|---|---|
| T-B Route test | D-2, P02-4 | one shot, neutral master vs graded look plate, same text | the winner holds skin, blacks and grade at 2 fps |
| T-C Trimmed tail as extension source | D-4, P05-9 | a non-hero 4 s tail, trimmed and uploaded, extended forward | accepted; identity and grade hold; output starts after the source's last frame |
| T-D "continue" wording in `omni_reference` | D-5, P05-4 | S★'s literal role line vs our "carry on" line, same shot | no task-type change reported; camera and positions carried |
| T-E Failed-take sentences | D-6 | the same draft with and without 3–5 "= a failed take" sentences | fewer named failures, no new artefacts |
| T-F Written-cut coverage rush | D-3 | one insert/atmosphere rush with 3 written hard cuts | cuts land within ±0.5 s; usable 1–3 s pieces |
| T-G PATH GUIDE vs current blockout clause | P04-1 | one >10 s playblast-driven move, both clauses | route kept; camera reads as a person, not a rig |
| T3 (existing) Draft → final | D-8 | finalize an approved draft | identity, action and timing unchanged |
| 05-T11 (existing) Handles | D-1, D-14 | two-character job | each face lands where its handle says |
