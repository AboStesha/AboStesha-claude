# Study: すれ違い – In Passing — julianmarshall (https://higgsfield.ai/@julianmarshall/projects/@id__4cd5b9b7-65d0-4dda-959b-98e65ecef14c) — 2026-11-02

- Source type: Higgsfield project (prompts and canvas public, not open source) + finished film. Director Julian Marshall ("Film Director, DGA"). Entry in the Higgsfield AI Film Festival (`contest_key: ai_film_festival`), 4,214 views, 77 likes. Published file 8:03 (483.0 s, 2240×960 ≈ 2.33:1, 23.976 fps). The story runs 0:00–7:37; 7:37–8:03 is a text card (the director wrote the film eight years ago, lost his lead the day before the shoot, "These new tools finally gave this story a way out") and "Written and Directed by Julian Marshall". 946 video jobs between 13 Aug 08:01 and 29 Aug 18:42 2026 (17 days), 89,551 credits; submitted 15 Sep.
- What it achieves: a quiet Tokyo two-hander (a pickpocket who mails wallets back, a young thief who lifts *his* wallet) in which the **background people behave like paid, well-directed extras**: packed Oedo-line cars where every rider rides the sway, holds a strap and looks at nothing; platforms and stairwells in true rush-hour flow; a 60-person izakaya whose nearest table stands up when a pitcher goes over while the rest of the room only turns its heads. The camera feels like a handheld operator standing inside the crowd on a long anamorphic lens. Japanese dialogue, English subtitles burned in post.
- Method step by step:
  1. **Assets outside the project.** 35 Elements (13 characters — Kenji ×4 wardrobe states, Sakura ×4, plus five "featured extras": three victim Elements (two men, one of them in two coat colours) and the couple in two wardrobe states; 12 locations; 10 props), each holding exactly ONE image plus a long text description (median 836 characters). No image job exists in this project; the sheets were made elsewhere and only used as Elements.
  2. **Day 1–2 (13–14 Aug): 720p rehearsal of the two hardest dialogue scenes** in Cinema Studio Video 4.0 (`Scene 5 720p` = 63 jobs, `Scene 6 720p` = 25 jobs), Vintage Anamorphic lens control. Then the same scenes re-fired at 1080p in `Scene 5`, `Scene 5 v2`, `Scene 6` with corrected text (e.g. wardrobe: "wide BLACK trousers, scuffed WHITE sneakers — blue jeans = failed take").
  3. **14–18 Aug: one folder per scene, 1080p, Cinema Studio 4.0 only.** Each prompt is a 16–20 s generation of FOUR SHOTS with THREE HARD CUTS written into the text (the UI multi-shot toggle is never used), most prompts fired 2–4 times as takes (396 unique prompts for 886 prompted jobs; 111 fired once).
  4. **19–20 Aug: `Pickups 1`** — 8 s single-shot inserts for the train scenes. The same 8 s prompt ran 4× on Cinema Studio, then 1× on Seedance 2.5 (20 Aug 06:31); every later Pickups 1 job is Seedance.
  5. **23–24 Aug: Seedance 2.5 block** — `Scene 9 v2` (64 jobs, apartment dialogue redo), `Scene 9 v3` (14 jobs, 12 s single-take coverage on the wide's clock), `Pickups 2` (kiss and lantern-alley inserts), half of `Pickups 3`. 140 of the 173 Seedance prompts carry the Cinema Studio settings pasted in as text (`camera_model: "35mm Film"` …).
  6. **24 Aug 13:12 → 28 Aug: back to Cinema Studio 4.0** for `Pickups 3–8` with a new closing line, "THE STOCK AND THE GLASS: shot on 35mm FILM through ANAMORPHIC lenses …".
  7. **Repairs:** 60 Cinematic Video Editor jobs re-render a chosen time range of a finished clip, 40 of them against a reference image — the canvas-bag prop (19), Kenji's head turnaround (11), his wardrobe flat-lay (6), Sakura's camel sheet, the old-man victim sheet, or a frame with a red mark drawn on it (2). Two 4 s Seedance video-to-video fixes on an uploaded clip ("the bag should be on him with the strap on his left shoulder <<<bag>>>. and he should have the money in his other hand…") and one 6 s Seedance `video_extension` forward on another uploaded clip (prompt: "continue the shot").
  8. **Sound:** `Sound` folder = 14 "AMBIENCE BED" prompts fired 28× (30 s, 480p, picture irrelevant) and 2 "ADR CARRIER" prompts fired 8× (4 s, 720p, the one word 「おい。」 in a dead room). Plus 17 uploaded SFX wavs (footsteps, train hall, AC unit, rice washing, "delicately placing a…") and 3 uploaded music tracks (`Suspended_Motion`, `A Remembered Place`, `Digital_Garden`); the tool that made them is not recorded.
  9. **Post:** edit (186 cuts, median shot 2.25 s), English subtitles, title card, end card — outside Higgsfield.
- Prompt structure: see "Prompt anatomy". Every video prompt is a long director's spec (Cinema Studio median 677 words / 3,959 characters; Seedance median 757 words / 4,443 characters): shot-count header → place + compass → crowd block → cast with inline `<<<element-uuid>>>` → register → lens/camera → life-signs block → hands → "already running" → timed SHOT ONE…FOUR with dialogue in 「」 → THE PERFORMANCE → "still running" → sound line. Median 5 "= failed take" fences per prompt; about a quarter of all words in CAPS.
- Asset method (characters / locations / props sheets): one image per Element; descriptions written as wardrobe-locked casting notes; the later ones end "Take identity from this element; take the beat's staging from the shot's prompt." Featured extras (two victims, the couple) are Elements with colour-separation rules against the leads. Anonymous crowds are text only — never an Element.
- Adopt: see "Adopt for our pipeline" at the end.
- Do not copy: the pickpocket-who-returns-wallets premise, Kenji/Sakura, the stolen-wallet swap, the nine dated shoeboxes, the envelope and photograph, the lantern-alley kiss, the couple with the shared white earbud wire, any line of dialogue, the title, the end-card text, the Element images. Method only.
- Proposed skill changes: listed at the end → copy to LESSONS.md as "proposed".

## What the film looks like (watched: 7 cut contact sheets = 195 cut frames, 11 six-frame motion strips of crowd shots, 4 fps frame matching of the whole film against 1,012 sub-shot frames from 473 generations plus the 946 first-frame thumbnails; I cannot hear audio — sound notes come from prompts, uploads and burned-in subtitles)

| Film | Sequence | What is on screen |
|---|---|---|
| 0:00–0:05 | Cold open | Fade up from black on a dawn aerial over Tokyo. |
| 0:05–0:28 | The city wakes | Steam off a soba hatch past a masked woman, a man walking a shuttered lane, a sweeper at a station corridor, commuters, ticket gates (camera walking the gate line), aerial with Tokyo Tower, futons on balcony rails, a stair full of backs, departure board, a packed platform of masked commuters on phones as the train pulls in. |
| 0:28–1:30 | The lift and the return | Packed Oedo-line car; a rack-focus pan across bowed heads lands on Kenji (the only one looking up); the couple sharing earbuds; a salaryman on his phone; the hand at a pocket; Kenji carried out with the platform tide; cash and wallet in the canvas bag; the photograph in the wallet; Kenji's closed eyes; he addresses and seals an envelope on the bag's flap. |
| 1:30–1:33 | Title | "すれ違い / IN PASSING", small, yellow on black. |
| 1:33–2:00 | Sakura | Next ride: Sakura in big headphones holds his look; the brake leans the car and Kenji crosses in the lean; his hand takes a cracked red wallet from her herringbone pocket; the car drains and she finds the pocket flat — she already knew — and goes after him onto the platform. |
| 2:00–2:10 | Chase | "Stop!" (subtitle), the exit stairwell and escalator, Sakura hunting at the street mouth. |
| 2:10–3:07 | Under the viaduct | "Wallet." / "Wrong guy." / "Yours for mine." / "Which?", cash flung on the concrete, she reads his licence: "Kenji Nakamura." |
| 3:08–3:50 | Soba hall | Shoulder-to-shoulder at a counter, profiles, steam: "The loop…", "I want one good haul before I go. I can't work a crowd on my own.", "Go where?", "What's your name?" |
| 3:50–4:34 | Izakaya | 60-seat room; she crashes into a table, salarymen stand and mop, every head turns to her while Kenji works the coats; slow-motion laugh / slow-motion look. |
| 4:34–5:34 | Lantern alley | She wears a stolen camel coat; a stranger's licence ("Tetsuo Ishikawa. Nineteen seventy-one."), "Do I look like an Ishikawa?", "You think he'd mail it back if it was yours?", the kiss; city at night. |
| 5:36–6:24 | Apartment, night | "What's in these?" / "Nothing." Nine taped boxes, photographs, "Do you remember all of these people?" / "Some.", the lamp clicks off. |
| 6:24–6:57 | Morning | Kenji asleep, the cold half of the futon, the envelope on the shelf, two cups by the rice cooker, Kenji alone. |
| 6:57–7:37 | Epilogue | Dawn aerial, the sweeper, the gates, the board, Kenji back in a packed car, a grey-coated victim on his phone, a wallet, the couple again, a crowd face. |
| 7:37–8:03 | End card | Director's note, credit. |

- **Look:** 2.33:1 from 21:9 generations (2016×864 at 1080p). Cool blue-grey daylight for every commute scene, tungsten/lantern amber for night; very shallow depth of field, oval bokeh, soft edges, faint grain — the Cinema Studio controls "35mm Film" (709 of 713 CS jobs) + "Anamorphic"/"Vintage Anamorphic" (711) + "f/4 Moderate" (699). Skin stays natural; no grade swings between shots of one scene.
- **Framing:** almost everything is shot *through* people: a dark soft shoulder or back covers a third of the frame in nearly every crowd shot; leads are found in a narrow focus band on a long lens. Close-ups are head-and-collarbones. Inserts (hands, wallet, envelope, photograph, rice) are true ECUs.
- **Pacing:** 195 detected cuts, 186 segments longer than 0.2 s, median shot 2.25 s, mean 2.45 s, longest 9 s. Each 16–20 s four-shot generation is trimmed to its best ≈2 s per setup and intercut with other takes — the generations behave like coverage, not like finished sequences.
- **Background acting (what makes it feel real):** in the motion strips nobody in the background freezes, poses or looks at the lens; they scroll phones, sleep against poles, sway together, step through gates without breaking stride, and at the spill the nearest table stands while the far room only turns heads. The leads are the only people with intention; everybody else has an *errand*.

## Numbers
(python3 -I over `compact.jsonl`, `items.json`, `publication.json`, `cuts.txt`)

| Item | Value |
|---|---|
| Jobs | 946 video jobs (0 image jobs), 20 uploads (all audio: 17 SFX, 3 music). `compact.jsonl` has 964 rows because 18 jobs sit in two folders; every count below is de-duplicated by job id (folder counts list a shared job in both folders) |
| Models | Cinema Studio Video 4.0 713 · Seedance 2.5 173 · Cinematic Video Editor 60 |
| Credits (publication stats) | 89,551 total · Cinema Studio 86,203 (713 jobs ≈ 121/job) · Seedance 270 (173 jobs ≈ 1.6/job — looks like plan-included generation, not list price) · Editor 3,078 (60 jobs ≈ 51/job) |
| Seconds generated | 12,995 s (CS 10,588 · Seedance 2,370 · Editor 37) = 28.4× the 456.8 s story |
| Dates | 13 Aug → 29 Aug 2026 (CS 13–20 Aug and 24–28 Aug; Seedance 14 Aug ×1, 20 Aug ×44, 23 Aug ×78, 24 Aug ×48, 25 Aug ×2; Editor 14, 24, 25, 29 Aug) |
| Resolution | 1080p 765 · 720p 99 (Scene 5 720p 63, Scene 6 720p 25, ADR carriers 8, editor 3) · 480p 28 (all ambience beds) |
| Aspect | 21:9 on 888 jobs, 16:9 on 4 (editor outputs) |
| Duration | 17 s ×229, 18 ×181, 8 ×114, 20 ×61, 6 ×52, 19 ×49, 7 ×38, 5 ×33, 30 ×28, 16 ×26, 12 ×19, 4 ×19 … |
| Shots per generation (from the text header) | CS: FOUR 442 · ONE 174 · TWO 40 · THREE 17 · other 40. Seedance: FOUR 92 · ONE 68 · THREE 6 · TWO 4 |
| Multi-shot UI toggle / draft / seed | never used (`multi_shots` False 886, `draft` False 886, `seed` null) |
| generate_audio | on for all 886 prompted jobs |
| Cinema Studio controls | camera 35mm Film 709 · lens Anamorphic 545 / Vintage Anamorphic 166 · aperture f/4 699 / f/1.4 12; genre, pacing, light, era, colour palette never set; speedramp auto; bitrate high |
| Seedance prompts with the pasted CS control block | 140 of 173 (20 Aug 06:32 → 24 Aug 09:44) |
| "THE STOCK AND THE GLASS" line | 130 CS prompts, 24 Aug 13:12 → 28 Aug |
| Elements | 35, one image each; 2,524 attachments, every one also referenced in the text; median 3 per job (CS mean 2.8, Seedance 3.1); **never more than 2 character Elements in one job** |
| Element syntax in text | `<<<uuid>>>` in 730 prompts; `@element-name` in 89 (Scene 4, 9, 10, Pickups 6) |
| Unique prompts | 396 of 886 prompted jobs; identical-prompt group sizes: 1×111, 2×191, 3×35, 4×35, 5×12, 6–12×12 |
| Prompt length | CS median 677 words (368–1,363), 3,958 chars; Seedance median 757 words (3–1,158), 4,443 chars |
| "= failed take" fences | median 5 per prompt, max 13; in 874 of 886 prompts |
| Signature blocks (in N of 886 prompts) | "THE SHOT IS ALREADY RUNNING WHEN IT STARTS" 883 · "THE TAKE IS STILL RUNNING WHEN IT ENDS" 883 · "FELT, NOT SEEN" 778 · "NOT ANIME" 765 · "EVERY FACE IN FRAME IS ALIVE" 707 · "EYES DO NOT WIDEN" 640 · "Fingernails short, clean…" 661 · "THE PERFORMANCE" 824 · "nobody plays to the lens" 330 |
| Crowd vocabulary | "crowd" 242 prompts · "commuter" 209 · "stranger" 100 · "THE CROWD" block 99 · "NOT ONE PAIR OF EYES MEETS ANOTHER" 92 · "THE CAR IS PACKED SOLID" 119 · "HIDING PART OF (HIS/HER BODY)" 118 · "sway" 371 · "phone" 377 |
| Dialogue | Japanese in 「」 in 290 prompts (CS 236, Seedance 54); 32 distinct lines; most-repeated 「財布。」 ×60, 「何も。」 ×56 |
| Folders (jobs) | Scene 5 82 · Scene 11 74 · Pickups 1 69 · Scene 9 v2 64 · Scene 5 720p 63 · Pickups 5 52 · Scene 8 44 · Scene 9 43 · Scene 7 42 · Scene 3 39 · Pickups 6 38 · Pickups 8 36 · Sound 36 · Pickups 2 32 · Scene 1 31 · Scene 10 31 · Scene 4 29 · Opening 27 · Pickups 3 27 · Scene 6 720p 25 · Scene 6 24 · Scene 5 v2 18 · Scene 9 v3 14 · ROOT 10 · Scene 2 8 · Pickups 4 4 · Pickups 7 2 |
| Scene vs pickup | 650 jobs in Opening/Scene folders (median duration 17 s) · 254 in Pickups folders (median 8 s) |
| Favourites / likes | 0 (no job marked) — final shots had to be found by frame matching |
| Film | 483.0 s published; story 456.8 s; 195 detected cuts; median shot 2.25 s |

## Focus: crowd and background-actor direction · Cinema Studio 4.0 vs Seedance 2.5 · scene folders and Pickups · 720p vs final passes

### F1. The crowd is written as its own block of laws, every time
Crowds never get an Element. They get a paragraph that is pasted, with small variants, into every crowd prompt. The variants that survive into the last prompts of the project:

```text
THE CROWD, wherever one appears: dark coats the majority, muted mid-tones — grey wool, camel, olive, beige; a good third women; nothing bright. Nobody makes room for the lens; NOT ONE PAIR OF EYES MEETS ANOTHER — each sealed in a private morning.
```
```text
THE CAR IS PACKED SOLID — AT LEAST FORTY PEOPLE, no empty floor. IN EVERY SHOT A NEAR BODY OVERLAPS THE NAMED SUBJECT — a shoulder, arm or back CROSSING IN FRONT, dark, out of focus, HIDING PART OF THE BODY; a soft shape at the frame edge is NOT enough. The named face stays clear. EVERY RIDER HOLDS A STRAP, POLE OR RAIL. Dark coats, muted mid-tones; a third women.
```
```text
THE PLATFORM IS IN FULL RUSH-HOUR FLOW — AT LEAST FORTY PEOPLE, moving both directions at their own speeds, cutting across each other's lines. EVERYONE IS MID-STRIDE — weight on one foot, arms in counter-swing; nobody in a moving crowd stands still, nobody makes room for the camera.
```
```text
THE ROOM IS FULL: sixty people at thirty seats, low ceiling, smoke, lantern light. EVERY OBJECT IN USE OR WHERE ITS OWNER PUT IT: coats on the backs of their OWNERS' OWN chairs, glasses on tables or in hands, chopsticks mid-meal. Nothing floats.
```

What each clause does (and why the extras look directed rather than generated):

| Rule | Wording used | Effect on screen |
|---|---|---|
| **Count, not "crowded"** | "AT LEAST FORTY PEOPLE", "sixty people at thirty seats", "THIRTY OR MORE RIDERS" | Frames are genuinely full; no empty floor to fill with drifting walkers. |
| **Casting palette for extras** | "dark coats the majority, muted mid-tones — grey wool, camel, olive, beige; a good third women; nothing bright" | A believable Tokyo commute; no costume-party colours stealing the eye from the leads. |
| **Every extra has an errand / object** | "EVERY PHONE IS IN A HAND, held low, a thumb on it", "EVERY RIDER HOLDS A STRAP, POLE OR RAIL", "chopsticks mid-meal", "coats on the backs of their OWNERS' OWN chairs" | Hands are occupied, so no idle "AI hands"; the gesture vocabulary is real-world. |
| **Eye-line law + named exceptions** | "NOT ONE PAIR OF EYES MEETS ANOTHER — bowed heads, earbuds, phones low, each sealed in a private world. Exceptions: KENJI — the only person in this car looking at anybody — and THE COUPLE, together in one world." | Nobody looks at the lens or at the hero; the one person who looks *is* the story. |
| **Camera-blindness** | "Nobody makes room for the lens", "nobody aware of any camera", "CANDID — caught, not arranged: nobody aware of a camera, nobody presented, posed or centered" | No extras parting for the camera, no posed faces. |
| **Behaviour, not expression** | "nobody acts — each person wants only the ordinary thing in front of them, shown as behavior, never as expression." / "The crowd wants its trains and its desks" | Neutral, occupied faces instead of reacting faces. |
| **Motion law** | "EVERYONE IS MID-STRIDE — weight on one foot, arms in counter-swing", "moving both directions at their own speeds, cutting across each other's lines" | Real pedestrian flow, not a parade in one direction. |
| **Shared physical cause** | "the BRAKE arrives: the whole crush LEANS AS ONE BODY", "the standing crowd unlocks toward the doorway as one", "everyone rides the sway", "SIX PEOPLE STAND UP AT ONCE, chairs scraping back" | Crowd motion is *motivated* — physics or an event moves everyone together, which reads as real. |
| **Foreground occlusion, required** | "IN EVERY SHOT CROSSING BODIES PASS BETWEEN LENS AND SUBJECT … HIDING PART OF HIS BODY … A soft shape at the frame edge is NOT enough; he never stands in a clean pocket." / Seedance: "FOREGROUND CROSSERS, REQUIRED, AT LEAST TWICE — once early, once late … No foreground crosser = failed take." | The documentary "shot through the crowd" look; also hides weak background faces. |
| **Long lens, narrow focus** | "VERY LONG ANAMORPHIC LENS — heavy telephoto compression stacking the crowd into walls of heads and shoulders; VERY SHALLOW depth of field, a NARROW sharp band with the world soft on BOTH sides" | Extras are soft shapes with real motion; the model never has to render 40 sharp faces. |
| **Life signs on every face, not just the leads** | "EVERY FACE IN FRAME IS ALIVE: eyes BLINK at uneven intervals, never on a count; chests breathe; gazes shift. EYES DO NOT WIDEN — lids LOW and RELAXED, no white above or below an iris. A fixed stare = failed take." (707 prompts) | Removes the frozen-mannequin background and the wide-eyed AI stare. |
| **No start / no end** | "THE SHOT IS ALREADY RUNNING WHEN IT STARTS: the crowd already crossing …" / "THE TAKE IS STILL RUNNING WHEN IT ENDS: … mid-stride everywhere." (883 prompts) | No "action!" freeze on frame 1, no settle at the end — extras are mid-movement at both edges, so cuts land on motion. |
| **Camera as a person in the crowd** | "THE CAMERA IS A PERSON IN THE CITY … HANDHELD AND VISIBLY HUMAN … finding things rather than framing them", "the operator stands in the flow … the frame HUNTS, corrects LATE, loses her behind a shoulder and finds her again", "AMPLITUDE CAP … FELT, NOT SEEN" | The viewer feels present among commuters; movement is caused by bodies, not by a crane. |
| **Voices are texture** | "NOBODY SPEAKS ON CAMERA; the only voice is the station recording", "VOICES ARE TEXTURE, never quoted lines — her apologies tumble fast in Japanese under the roar", beds: "every voice stays murmur and walla" | No random extra blurting a line, no lip-flap on background faces. |

### F2. Featured extras: three to four background people get a *vignette*
Inside the crowd block, a few individual extras get one line of business each — specific, small, visible at a distance:
- "his eyes move face to face and REST on each — the woman in the beige raincoat asleep against the pole, the student thumbing a phone, the old man watching the black window." (Scene 1, job 1de12a92 — its first setup is cut 12)
- "beside the mouth AN OLD WOMAN IN AN APRON sweeps her patch of pavement, slow even strokes, the crowd parting around her without a glance." / "a man crouches unlocking a bicycle" (Opening; the sweeper is in the film twice, cuts 4 and 182)
- "the details his eyes find, each sharp then released — a wristwatch loose on a rail hand, a side pocket gaping with its owner's sway, a tote's zip open an inch" (what the pickpocket's eye reads — the crowd as a menu)

People who matter to the plot but are still "background" (two victims, the couple) become **Elements**, with three disciplines:
1. **Colour separation from the leads, written into the Element:** "NOTHING HE WEARS IS CHARCOAL OR MID-GREY — his coat must read apart from Kenji's charcoal sleeve inside a single frame — and nothing he wears is camel" (victim); "NOTHING OLIVE, MUSTARD, ORANGE, RUST, PURPLE, CAMEL OR TAN — camel is Sakura's" (couple, day 2). The couple's identifying device at four metres is a prop: "SHARING ONE PAIR OF WIRED EARBUDS — one white wire running between them".
2. **Hands and eyes locked in the prompt:** "HIS RIGHT HAND holds <<<phone>>> at HIS OWN face, HIS LEFT up through a strap. HE NEVER REACHES ANYWHERE, never looks up from the phone. THE VICTIM'S HANDS NEVER MOVE FROM WHERE THEY ARE." / "The grey sleeve never leaves the rail; the phone's thumb never stops scrolling. KENJI'S HAND IS THE ONLY HAND IN THIS SHOT THAT MOVES."
3. **A private world:** "THE ONLY TWO IN THE CAR IN ONE WORLD — enjoying each other … they never see Kenji or the lens" with a tiny action ("she says something up at him without lifting her head; a smile starts on him, the white wire swinging"), and the counterpoint "around them nobody looks up."
- Element descriptions end with the split of responsibility: "Take identity and wardrobe from this element; take the beat's staging, hands and eyeline from the shot's prompt."
- **Never more than two character Elements per generation** (python: max 2 across all 886 prompted jobs). The couple is ONE Element containing both people.

### F3. Attention is a directed resource
The crowd's gaze is allocated like a lighting cue:
- Izakaya master (Scene 7): "the corner of the room turned toward her chaos, every eye ON HER — deep FRAME-LEFT, unnoticed, KENJI slips into the aisle"; "The crash is a job and she is brilliant at it: every eye belongs to her — nobody looks at the aisle."
- "CONCEALMENT: he never works in open view — found through pockets of crowd; his performance carries the checking, small glances that nobody is watching. Anyone noticing him = failed take."
- The hero's tempo is defined *against* the crowd: Kenji "moves AT EXACTLY THE FLOW'S SPEED, neither pushing nor lagging"; Sakura "MOVING NOTICEABLY FASTER than every other body on the platform"; at the exit "THE ONLY BODY NOT MOVING, the crowd breaking around her"; at the brake "KENJI leaning with it a fraction before everyone else."
- Rule extracted: in every crowd shot write (a) where the crowd's eyes go, (b) who is allowed to look at whom, (c) the hero's speed relative to the flow.

### F4. Cinema Studio Video 4.0 vs Seedance 2.5 in this project
| | Cinema Studio Video 4.0 | Seedance 2.5 |
|---|---|---|
| Jobs / seconds | 713 / 10,588 s | 173 / 2,370 s |
| When | 13–20 Aug (all first scene passes, first Pickups 1 takes), 24–28 Aug (Pickups 3–8, Sound) | 14 Aug (1 test), 20 Aug (Pickups 1), 23 Aug (Scene 9 v2/v3), 24 Aug morning (Pickups 2, 3), 25 Aug (2 v2v fixes, 1 extension) |
| Look control | UI controls: 35mm Film + Anamorphic/Vintage Anamorphic + f/4; nothing else set | No such controls — the CS values were pasted into the prompt as a text block (140/173), later replaced by prose in CS prompts ("THE STOCK AND THE GLASS") |
| Typical job | 16–20 s, FOUR SHOTS / THREE HARD CUTS, 1080p, 21:9, audio on | 8 s single take or 17–18 s four-shot, 1080p, 21:9, audio on; 12 s single-take coverage |
| Elements | median 3 (0 on 20 of 27 opening-montage jobs and on all sound beds) | median 3, always ≥1 except one |
| Special uses | 30 s 480p ambience beds; 4 s ADR carriers; TRUE SLOW MOTION written in text (78 prompts; the izakaya close pass that uses it is in the film); start-frame language in 26 prompts (no start image is recorded in their params) | `video_extension` forward ("continue the shot"); 2 video-to-video corrections with plain-English instructions |
| In the final film (89 verified cuts) | 80 cuts / 199 s: opening, train scenes, platform, stairwell, viaduct, soba hall, izakaya, lantern alley, morning, epilogue — every verified crowd sequence | 8 cuts / 21 s: apartment-night dialogue (Scene 9 v2 / v3 ×4), three Pickups 1 train inserts, and the last story shot (7.4 s `video_extension`); the kiss inserts (Pickups 2, 31 of 32 Seedance) are likely but not frame-verified |

How the author decided: the **same prompt was fired on both engines** four times (a Scene 5 prompt: CS ×2 then Seedance ×1 on 14 Aug; a Pickups 1 8 s doors-open prompt: CS ×4 then Seedance ×1 on 20 Aug; two Scene 8 prompts re-fired on Seedance on 24 Aug). After the 20 Aug comparison every train pickup went to Seedance; after Scene 9 was re-done in Seedance (23 Aug) the late pickups went back to Cinema Studio with the look written as prose. So: CS for crowd-heavy multi-shot coverage and the look; Seedance for intimate two-hander performance and single-take inserts, with the CS look described in text.

What transfers to a Seedance-only pipeline (ours): the crowd block, life-signs block, running-take bookends, foreground-crosser law, long-lens line and failure fences are engine-independent prose — the Seedance prompts in this project carry all of them (CANDID 170/173, EVERY FACE IN FRAME IS ALIVE 163/173, failed take 170/173). The CS-only parts are the UI look controls; replace them with a prose look line (we cannot verify that the pasted `camera_model:` pseudo-parameters do anything in Seedance — the author himself switched to prose).

### F5. Scene folders, version folders and Pickups — a real production's paperwork
- **One folder per scene**, named by script order (`Opening`, `Scene 1`…`Scene 11`), shot out of order (Scene 5 first, Opening on day 3, Scene 11 on day 5).
- **Version folders instead of overwriting:** `Scene 5 720p` → `Scene 5` → `Scene 5 v2`; `Scene 9` (CS) → `Scene 9 v2` (Seedance redo of the whole scene) → `Scene 9 v3` (12 s single-take coverage of the opening exchange, "its clock mirrors the wide (W1) beat for beat").
- **Coverage language inside the scene folders:** named camera positions ("DEEP CAM", "STREET CAM" under the viaduct; "DOOR CAM" / "BACK CAM" in the izakaya; "LANE CAM" in the alley), a "CLOSE PASS" whose "clocks MIRROR the master takes shot for shot, so every beat cuts 1:1", and "COVERAGE STAYS TIGHT unless a shot names wider; re-photographing its wide view = failed take" (117 prompts contain "COVERAGE STAYS TIGHT"). This is why ≈2 s trims from different generations intercut cleanly.
- **Pickups = after the assembly, by need, numbered by session** (`Pickups 1` 19–20 Aug … `Pickups 8` 25–29 Aug): 254 jobs, median 8 s; of the 235 prompted ones 138 are ONE UNBROKEN SHOT, 44 two-shot, 23 three-shot, 29 four-shot. Each is a single-purpose beat the cut was missing: "THE LOOK, HELD", "THE CHECK", "HER OWN WORLD" (her reaction when she finds her pocket empty), "THE DOORS OPEN", "THE STOW", "THE PHOTOGRAPH, restaged", "HER GLIMPSE" (3 s), "THE ROOM, THE QUESTION: the wide, redone", "THE TRAIN AERIAL, ANOTHER ANGLE", "KENJI'S EXTREME CLOSE-UP: the beat between her two lines". Pickups 5/8 even open with "SHOT ONE IS THE START FRAME, ALIVE. The start-frame image supplied with this call is a frame from this film's own footage and it is THE LAW for shot one's place, light and composition".
- **`Sound` is a folder too** — ambience and ADR are generated like shots (F7).

### F6. 720p vs 1080p (and 480p)
- **720p = rehearsal for dialogue blocking**, not a draft mode (`draft` is False on every job). The two first dialogue scenes were fired at 720p (88 jobs, 13–14 Aug) to solve geography ("THE COMPASS, TRUE IN EVERY SHOT"), height ("SAKURA IS THE SHORTER … Her head level with his = failed take"), hands ("Her LEFT hand stays IN HER COAT POCKET all scene") and wardrobe, then re-fired at 1080p with the fixes. The 1080p soba prompts differ from the 720p ones by ≈1% of text (≈98.8% similar) — e.g. "+ wide BLACK trousers, scuffed WHITE sneakers — blue jeans = failed take" and a looser register line.
- **The 720p takes were not thrown away:** two soba-hall shots in the final film come from `Scene 6 720p` (`21a4fa49`, `fcd85427`, verified by frame match) — the performance won over the resolution.
- **480p only where the picture does not matter:** all 28 ambience beds (30 s each). 720p for the 8 ADR carriers (4 s).
- **Everything else is 1080p**, including all pickups and all Seedance jobs.

### F7. Sound is directed like the crowd
- Ambience beds: "This take is fired for its SOUNDTRACK: a steady, loopable bed. THE SCENE NEITHER BEGINS NOR ENDS"; layered "NEAR: … MID: … FAR: …"; "NO MUSIC anywhere in the bed"; "NOBODY SPEAKS INTELLIGIBLE WORDS: every voice stays murmur and walla". 14 places (platform, packed carriage, station stop, street at the subway mouth, city waking, under the viaduct, market hall, packed izakaya, lantern alley, quiet end of the night, apartment room tone, apartment faucet, apartment morning, city from above).
- ADR carriers: one word in "an ACOUSTICALLY DEAD" room, "NOTHING OVERLAPS THE WORD, A LAW", timed "the one word lands at 1.5s and is finished by 2s" — a clean line to lay over a picture take whose own audio was dirty.
- In picture prompts: "No music." in 855 of 886; a closing "Sound:" line per prompt naming the diegetic bed ("the full normal bed — rail roar, the announcement overhead, cloth, breath").

## Prompt anatomy (Cinema Studio and Seedance share it)
1. **Header** — shot count and cut law: "FOUR SHOTS, THREE HARD CUTS — four setups cut together, not one continuous take. A HARD CUT is instant; a dissolve, wipe or joining move = failed take." / "ONE UNBROKEN SHOT, no cuts — a single continuous 8-second take."
2. **THE PLACE** — `<<<location-element>>>` + "GEOMETRY, MATERIALS, LIGHT only; its own wide view never appears" (stops the model re-photographing the reference image).
3. **THE COMPASS** (dialogue scenes) — screen direction and geography "TRUE IN EVERY SHOT": who is frame-left, who looks off frame-right, what is behind whom; "Crossing sides … = failed take".
4. **Crowd block** (F1).
5. **Cast** — `<<<element>>> — NAME, a Japanese man of 27, …` wardrobe restated in words, plus the register line ("NEVER STERN, NEVER SEVERE — … a FISH IN WATER … Stern or grim = failed take").
6. **Lens / camera** — "LONG PANAVISION C-SERIES ANAMORPHIC — oval highlights, soft edges, OPTICALLY CLEAN, no lens flares; very shallow depth of field … AMBIENT HANDHELD … FELT, NOT SEEN. REAL TIME unless a shot names TRUE SLOW MOTION. CANDID, NOT ANIME".
7. **Life signs** — EVERY FACE IN FRAME IS ALIVE … EYES DO NOT WIDEN … NOBODY SPEAKS ON CAMERA … Fingernails short, clean, completely bare; hands free of jewellery.
8. **"THE SHOT IS ALREADY RUNNING WHEN IT STARTS: …"**
9. **SHOT ONE 5s — … HARD CUT. SHOT TWO 4s — …** with sub-beats "At 0.5s … At 3s …" (211 CS prompts) or "0–2s — … 2–6s — … 6–8s — …" (single takes); dialogue as 「Japanese line」 with a delivery note ("pleasantly, covering", "flat, to nobody"), and "each line lands in the FIRST THIRD of its shot, the REST OF IT ITS PHYSICAL BEAT".
10. **THE PERFORMANCE** — what each person *wants* and how it shows ("It shows as tempo, never as hurry").
11. **"THE TAKE IS STILL RUNNING WHEN IT ENDS: …"**
12. **Sound line** — "No music. Sound: … No subtitles, no captions, no burned-in text."
13. (late CS) **THE STOCK AND THE GLASS** / (Seedance) pasted `camera_model:` block.

## Consistency (how style, characters and places held)
- **Faces and wardrobe:** one image per Element, tagged inline at the name every time it appears; wardrobe re-stated in words in every prompt ("a man's grey HERRINGBONE overcoat too big for her, hair a choppy SHAG, never a bob"). Wardrobe states are separate Elements (`thief-kenji-bag`, `-nobag`, `-home-longsleeve`, `-bag-v2`; `thief-sakura-neck-v4`, `-ears-v2`, `-camel-v2/-v3`), so a prompt never asks the model to change clothes.
- **Props as cast:** "THE PROPS ARE THE CAST. THE PHOTOGRAPH: <<<…>>> — the aged white-bordered snapshot … exactly as the element has them." The canvas bag is an Element on 393 jobs and the reference image of 19 of the 60 editor repairs; its size is fenced in text ("SMALL AND SLIM, FLAT at his LEFT HIP, NO TALLER THAN HIS FOREARM").
- **Places:** location Elements carry "geometry, materials, light and atmosphere only"; "the frame is NEVER the reference's own wide view re-photographed". Time-of-day variants are separate Elements (`thief-loc-tatami-v2` vs `-tatami-morning-v2`). Places without an Element are fixed in text: "THE PLACE — no location element; the design is fixed here: …".
- **Look:** one Cinema Studio preset on 709 jobs; a fixed lens sentence repeated in 472 prompts ("PANAVISION") and an "OPTICALLY CLEAN, no lens flares" clause in 786.
- **Repeated prefix blocks** (life signs, nails, running bookends, no-subtitles) are byte-identical across hundreds of prompts — copied, not rewritten.
- **Repairs instead of re-rolls:** the Cinematic Video Editor re-renders only the broken seconds of a good take against the right reference (bag image for a wrong bag; Kenji's head sheet or wardrobe flat-lay for the hands-and-envelope insert; a frame with a red scribble or red box marking what to change).

## Tools (what was used for what)
| Job | Tool | Volume |
|---|---|---|
| Character / location / prop sheets | made outside the project, imported as 35 single-image Elements | 35 |
| Video, crowd and coverage | Cinema Studio Video 4.0 (35mm Film · Anamorphic · f/4) | 713 jobs |
| Video, intimate dialogue and inserts | Seedance 2.5 (1080p, 21:9, audio on) | 173 jobs |
| Motion / blocking | none (no motion control, no reference video for blocking); blocking is written: compass, camera names, timed beats | — |
| Local fixes | Cinematic Video Editor (time range + optional reference image) | 60 jobs |
| Fix by instruction / extend | Seedance video-to-video (2 × 4 s) and `video_extension` forward (1 × 6 s) on uploaded clips | 3 |
| Ambience and ADR | Cinema Studio clips fired "for the SOUNDTRACK" (480p beds, 720p ADR) | 36 |
| SFX / music | uploaded wavs (17 SFX, 3 music); source not recorded | 20 |
| Upscale | none recorded (720p takes cut in as they were, or upscaled outside) | 0 |
| Edit, subtitles, titles | outside Higgsfield | — |

## Final shots and their prompts
**Method.** No job is marked favourite and `matches.json` (first-frame thumbnails only) found just 36 likely cuts, because every 16–20 s generation contributes its 2nd, 3rd or 4th setup as often as its first. So I grabbed frames at the midpoint of every written setup (`SHOT ONE 5s … SHOT TWO 4s …`) of all 473 generations in the crowd-relevant folders (Opening, Scenes 1, 2, 3, 4, 7, 11, Pickups 1 and 6 — 1,012 frames), added the 946 first-frame thumbnails of every job, matched all of them against the film at 4 fps (grey-level correlation + colour layout), and checked every candidate by eye side by side. 97 cuts scored ≥ 0.65; 8 of those were visually wrong and were dropped; 89 cuts are verified (83 high, 6 medium).

**Coverage of the verification:** 89 cuts = 222 s of the 457 s story. They come from 74 different jobs: Cinema Studio 4.0 80 cuts / 199 s (65 jobs), Seedance 2.5 8 cuts / 21 s (8 jobs), Cinematic Video Editor 1 cut / 3 s. **Bias:** folders where only first frames were compared (Scene 5 viaduct coverage and its Editor fixes, Scene 6 soba coverage, Scene 8 lantern alley, Pickups 2 kiss, Scene 9 v2 apartment) are under-counted, and Pickups 2 and Scene 9 v2 are almost all Seedance — so Seedance's real share of the cut is higher than 8/89, mostly in the night dialogue and the kiss.

**What the verified cut shows:**
- The crowd sequences (opening, train cars, platforms, stairwell, izakaya, epilogue) are **all Cinema Studio 4.0** except three Seedance train pickups (cut 30 doors-open, medium; cut 39 Kenji's closed-eye close-up; cut 56 Sakura in the draining car) and the film's **last story shot (cut 194, 7.4 s): a Seedance 2.5 `video_extension` forward of an uploaded clip, prompt "continue the shot"**.
- A scene is assembled from **many sibling takes**: the opening (cuts 1–11) uses 8 different Opening jobs; the izakaya (cuts 110–126) uses 9 Scene 7 jobs (cf66bc61, 7d0bf662, 58450ef7, 96a1ac2b, 2f5cd189, a3975bfc, 7d58845c, edc96b22, 5fd663b2); the epilogue uses 7 Scene 11 jobs, the Pickups 4 extension and two Opening re-shoots of the sweeper and the gates for the bookend.
- Two soba-hall shots (cuts 100, 104) come from the **720p** rehearsal folder; the matching 1080p take of the same line (36a51e8a) is also in the cut (cut 106).
- The epilogue (6:57–7:37) re-uses the opening's grammar with new takes (dawn aerial 72339308, sweeper 1afcc58f, gates 13408e1b) — a bookend built in prompts, not by re-using footage.
- Where Editor repairs exist for a matched job (125a5a56 envelope seal, cuts 41/44; 58450ef7 izakaya walk, cut 115; c2ad35c1 licence read, cuts 93/95; d0399d56 and b556d860 in Scene 11), the film frame could be the raw take or its Editor re-render — indistinguishable at 640 px.

| Cut | Film | Len | Job | Model | Folder · res | Conf. | Matched setup (prompt excerpt) |
|---|---|---|---|---|---|---|---|
| 1 | 0:00.0 | 4.8 s | `88138afb` | CS 4.0 | Opening · 1080p | medium | SHOT ONE 5s — FIRST LIGHT: pushing slowly toward a grey-orange horizon, the towers still in shadow, first windows catching, street lights burning in … |
| 2 | 0:04.8 | 4.1 s | `fe724235` | CS 4.0 | Opening · 1080p | high | SHOT TWO 5s — STREET LEVEL: the camera WALKS the pavement, carried past a small eatery — steam from its vent drifting across the lens; commuters … |
| 3 | 0:08.8 | 2.1 s | `771c77ef` | CS 4.0 | Opening · 1080p | high | SHOT ONE 5s — a narrow shopfront street, WALKING SHOT: shuttered fronts slide past both edges of frame as the one open shopfront ahead grows — A … |
| 4 | 0:11.0 | 2.5 s | `9c240f66` | CS 4.0 | Opening · 1080p | high | SHOT THREE 4s — AN OLD WOMAN IN AN APRON SWEEPS the pavement in front of her shop with a long-handled broom, slow even strokes, while commuters … |
| 5 | 0:13.5 | 1.9 s | `15465747` | CS 4.0 | Opening · 1080p | high | SHOT ONE 5s — TICKET GATES: the camera WALKS the gate line, gate after gate sliding past in the near frame, a new commuter tapping through each one … |
| 6 | 0:15.4 | 1.6 s | `ff5c00f9` | CS 4.0 | Opening · 1080p | high | SHOT ONE 5s — TICKET GATES: the camera WALKS the concourse parallel to the stream of commuters tapping through, gate paddles snapping open and shut, … |
| 9 | 0:20.7 | 2.2 s | `b9f6a379` | CS 4.0 | Opening · 1080p | high | SHOT THREE 4s — THE CAMERA IS DESCENDING THE WHOLE SHOT, riding an escalator behind a packed column of commuters — backs to camera, a phone, a nap on … |
| 10 | 0:23.0 | 2.2 s | `15465747` | CS 4.0 | Opening · 1080p | high | SHOT FOUR 5s — under the departure board, the camera MOVING WITH THE TIDE: carried forward among shoulders, backs overtaking through frame, the warm … |
| 11 | 0:25.2 | 3.0 s | `4a11183a` | CS 4.0 | Opening · 1080p | medium | SHOT FOUR 5s — THE PLATFORM: <<<2afe02d8-aa57-417e-a271-508a5a73ebc9>>> — GEOMETRY, MATERIALS and LIGHT only, never the framing. The camera WALKS the … |
| 12 | 0:28.2 | 2.0 s | `1de12a92` | CS 4.0 | Scene 1 · 1080p | high | SHOT ONE 5s — THE CAR: chest height, mid-crush, the camera a slow bodiless half-step drift: bowed heads at every distance, phone glow on downturned … |
| 13 | 0:30.2 | 5.8 s | `7a660ae3` | CS 4.0 | Scene 1 · 1080p | high | SHOT TWO 4s — THE FIND: the camera PANS SLOWLY across a rank of bowed heads while the FOCUS TRAVELS PLANE TO PLANE — onto a near face, soft again, … |
| 16 | 0:40.4 | 2.5 s | `b8768738` | CS 4.0 | Scene 1 · 1080p | high | SHOT THREE 5s — HIS VIEW again, tighter: the laugh lands — whatever she said gets him and he laughs, quiet in the roar, heads tipping together; … |
| 21 | 0:49.3 | 3.4 s | `13b503e4` | CS 4.0 | Scene 1 · 1080p | high | SHOT TWO 5s — his CLOSE-UP in motion: faces and shoulders slide past him near-plane and soft while HIS eyes read each one as it passes — a sleeve, a … |
| 22 | 0:52.7 | 2.4 s | `110b818a` | CS 4.0 | Scene 1 · 1080p | high | SHOT THREE 5s — CLOSE-UP continuing, that near shoulder drifting so the gap breathes: ONE slow unhurried slide off the panel to the black window, … |
| 26 | 0:59.9 | 1.3 s | `8b73a45c` | CS 4.0 | Scene 1 · 1080p | high | SHOT THREE 5s — CLOSE-UP continuing, that near body drifting so it covers MORE of him, then less: ONE slow unhurried slide off the panel to the black … |
| 30 | 1:05.1 | 3.1 s | `4db71ab5` | Seedance 2.5 | Pickups 1 · 1080p | medium | 0–2s — THE DOORS OPEN past the lens with the seal's exhale; the platform's melody and its roar of footsteps flood in, and the standing crowd unlocks … |
| 32 | 1:08.2 | 1.8 s | `d1b8649f` | CS 4.0 | Scene 2 · 1080p | high | SHOT THREE 5s — the WALK: he moves along the platform against the grain of the crossing flow, never faster than it; the departure melody rings … |
| 35 | 1:14.6 | 1.5 s | `488538ed` | CS 4.0 | Scene 3 · 1080p | high | SHOT THREE 4s — THE BLACK GLASS in front of him, his shoulder at frame edge: his eyes UP into the end door's dark pane — and in that dim mirror, the … |
| 36 | 1:16.1 | 1.1 s | `488538ed` | CS 4.0 | Scene 3 · 1080p | high | SHOT FOUR 5s — from his side at the wall, tight on the shelter's mouth: folded NOTES rise from the bag's shadow into his coat's inner pocket in ONE … |
| 39 | 1:21.5 | 1.5 s | `12b0ef76` | Seedance 2.5 | Pickups 1 · 1080p | high | SHOT TWO 6s — THE CLOSE-UP, LOW THREE-QUARTER: his face fills the frame, chin near the bottom, hairline near the top. NOT BRIGHTLY LIT — the … |
| 41 | 1:24.2 | 1.0 s | `125a5a56` | CS 4.0 | Scene 3 · 1080p | high | SHOT THREE 5s — THE WALLET IN: the dark-brown bifold wallet slides INTO the envelope's mouth — one direction of travel, a hand's-width move — the … |
| 42 | 1:25.2 | 2.0 s | `4cd25711` | CS 4.0 | Scene 3 · 1080p | high | SHOT ONE 5s — THE WRITING: the envelope braced on the bag's flat top, a fine black pen in his right hand finishing the LAST characters of the … |
| 44 | 1:27.3 | 2.5 s | `125a5a56` | CS 4.0 | Scene 3 · 1080p | high | SHOT FOUR 4s — THE SEAL: the flap folds down and his thumb presses it flat along its length, one slow firm pass, corner to corner; the sealed … |
| 46 | 1:32.6 | 1.8 s | `78bf6ff5` | CS 4.0 | Scene 1 · 1080p | high | SHOT TWO 4s — THE FIND: the camera PANS SLOWLY across a rank of bowed heads while the FOCUS TRAVELS PLANE TO PLANE — onto a near face, soft again, … |
| 47 | 1:34.4 | 2.4 s | `ec65f241` | CS 4.0 | Scene 3 · 1080p | high | SHOT THREE 4s — CLOSER, waist-up: she does not look away from being looked at. No flinch, no shift of weight; a slow blink at her own interval, lids … |
| 50 | 1:42.2 | 2.1 s | `a13d4125` | CS 4.0 | Scene 3 · 1080p | high | SHOT ONE 4s — MEDIUM down the car: the brake takes hold and the WHOLE CAR LEANS AS ONE BODY — and KENJI CROSSES IN THE LEAN, threading the tilting … |
| 51 | 1:44.3 | 4.5 s | `3ee47135` | CS 4.0 | Scene 3 · 1080p | high | SHOT THREE 5s — the LIFT, chest height, tight on the space between their coats: KENJI'S RIGHT HAND slides INTO the LEFT outer pocket of HER coat and … |
| 54 | 1:52.0 | 0.8 s | `c984a44e` | CS 4.0 | Pickups 1 · 1080p | high | 0–5s — HER OWN WORLD: her eyes rest soft-focused on nothing, low and off past the lens, half-lidded — the commuter's inward gaze, whatever is in the … |
| 56 | 1:53.7 | 1.1 s | `5416790c` | Seedance 2.5 | Pickups 1 · 1080p | high | SHOT THREE 5s — THE CLOSE-UP, her face filling the frame's height, the draining car soft behind her. SHE ALREADY KNEW: this is CONFIRMATION, NOT … |
| 59 | 1:57.0 | 2.1 s | `f6375fed` | CS 4.0 | Scene 4 · 1080p | medium | SHOT THREE and STAY AT HER NECK; back on her ears = failed. |
| 62 | 2:00.1 | 1.7 s | `e08b8094` | CS 4.0 | Scene 4 · 1080p | medium | SHOT THREE 5s — HIS CLOSE-UP, the backwards glide continuing: he walks giving nothing — and then, ONCE, HE LOOKS BACK. ONE SMALL TURN OF THE HEAD … |
| 65 | 2:02.8 | 1.0 s | `d069494a` | CS 4.0 | Scene 4 · 1080p | high | SHOT THREE 5s — WIDER, up the well from below: 「ねえ。」 — she YELLS it up the stairwell, louder than a platform voice — and NOT ONE HEAD in the crowd … |
| 66 | 2:03.7 | 1.6 s | `780d6886` | CS 4.0 | Pickups 6 · 1080p | high | SHOT ONE IS THE DOWNWARD WELL: behind and below her as she climbs there is ONLY the descending stair and its fluorescent glow — NO sky, NO street, NO … |
| 68 | 2:05.4 | 2.2 s | `bdac2f94` | CS 4.0 | Pickups 6 · 1080p | high | SHOT TWO 5s — HER CLOSE-UP, the street's cool morning light on her, the tide crossing soft before and behind her: THE SCAN, SHARP AND QUICK — her … |
| 69 | 2:07.6 | 0.7 s | `53024cad` | CS 4.0 | Pickups 6 · 1080p | high | HER GLIMPSE: what Sakura sees from the subway mouth in the second she stops. |
| 73 | 2:10.7 | 0.8 s | `1b8a95cc` | CS 4.0 | Scene 5 v2 · 1080p | high | SHOT ONE 5s — THE CHASE, STREET CAM, full figures, BOTH BACKS TO CAMERA: the camera FOLLOWS IN BEHIND SAKURA at her running pace as she RUNS KENJI … |
| 79 | 2:24.6 | 3.0 s | `7b23d097` | Editor | Scene 5 · — | high | (Editor re-render of a Scene 5 take against the canvas-bag image) |
| 84 | 2:38.2 | 3.3 s | `3a16284a` | CS 4.0 | Scene 5 · 1080p | high | SHOT ONE 5s — STREET CAM: WAIST-UP two-shot. The bag hangs BEHIND HIS LEFT HIP; at 1s he ROTATES IT AROUND on its strap; at 3s his hands are on the … |
| 88 | 2:48.3 | 1.4 s | `e8f7dd5a` | CS 4.0 | Pickups 6 · 1080p | high | SHOT ONE 4s — STREET CAM: CLOSE ON THE OPEN WALLET IN HER HANDS at chest height — herringbone sleeves, no faces: she pulls the folded NOTES clear and … |
| 89 | 2:49.7 | 1.0 s | `e8f7dd5a` | CS 4.0 | Pickups 6 · 1080p | high | SHOT TWO 6s — THE CONCRETE, ground level, the girder light banding the frame: the notes PLANE DOWN INTO FRAME and land light; the cards hit HARD — a … |
| 90 | 2:50.7 | 1.1 s | `79a151de` | CS 4.0 | Pickups 6 · 1080p | high | SHOT TWO 6s — THE CONCRETE, ground level, the girder light banding the frame: the notes PLANE DOWN INTO FRAME and land light; the cards hit HARD — a … |
| 93 | 2:53.7 | 3.1 s | `c2ad35c1` | CS 4.0 | Scene 5 · 1080p | high | SHOT ONE 4s — DEEP CAM: her CLOSE-UP, the card LOW at her chest and BELOW FRAME, tilted to her own eyes, lids low, reading. At 0.5s, flat, to nobody: … |
| 95 | 2:58.3 | 2.8 s | `c2ad35c1` | CS 4.0 | Scene 5 · 1080p | high | SHOT ONE 4s — DEEP CAM: her CLOSE-UP, the card LOW at her chest and BELOW FRAME, tilted to her own eyes, lids low, reading. At 0.5s, flat, to nobody: … |
| 100 | 3:16.0 | 5.7 s | `21a4fa49` | CS 4.0 | Scene 6 720p · 720p | high | SHOT ONE 6s — her PROFILE CLOSE-UP, eyes down on the bowl. At 0.5s, small talk: 「ぐるっと一周。新宿で降りて、一両前に乗り直す。」 She lifts noodles through the line. |
| 103 | 3:29.3 | 2.8 s | `adf87787` | CS 4.0 | Pickups 7 · 1080p | high | KENJI'S EXTREME CLOSE-UP: the beat between her two lines, and both lines ride in the take as its handles. |
| 104 | 3:32.1 | 3.9 s | `fcd85427` | CS 4.0 | Scene 6 720p · 720p | high | SHOT ONE 6s — her PROFILE CLOSE-UP, nearer camera, light as weather. At 0.5s: 「行く前に一晩だけ稼ぎたい。人混みは一人じゃ無理。」 She chases the last noodles round the bowl. |
| 106 | 3:37.9 | 3.4 s | `36a51e8a` | CS 4.0 | Scene 6 · 1080p | high | SHOT ONE 6s — her PROFILE CLOSE-UP, nearer camera, light as weather. At 0.5s: 「行く前に一晩だけ稼ぎたい。人混みは一人じゃ無理。」 She chases the last noodles round the bowl. |
| 110 | 3:53.9 | 1.9 s | `cf66bc61` | CS 4.0 | Scene 7 · 1080p | high | SHOT ONE 5s — DOOR CAM, wider: mid-room FRAME-RIGHT, SAKURA GOES DOWN INTO THE TABLE — full commitment — the table jumps, glasses topple, a pitcher … |
| 111 | 3:55.7 | 0.0 s | `7d0bf662` | CS 4.0 | Scene 7 · 1080p | high | SHOT ONE 5s — DOOR CAM, wider: mid-room FRAME-RIGHT, SAKURA GOES DOWN INTO THE TABLE — full commitment — the table jumps, glasses topple, a pitcher … |
| 112 | 3:55.8 | 0.3 s | `7d0bf662` | CS 4.0 | Scene 7 · 1080p | high | SHOT ONE 5s — DOOR CAM, wider: mid-room FRAME-RIGHT, SAKURA GOES DOWN INTO THE TABLE — full commitment — the table jumps, glasses topple, a pitcher … |
| 114 | 3:58.5 | 2.4 s | `7d0bf662` | CS 4.0 | Scene 7 · 1080p | high | SHOT TWO 4s — the struck table, close: SIX PEOPLE STAND UP AT ONCE, chairs scraping back, napkins snatched, beer off the edge. |
| 115 | 4:00.9 | 3.3 s | `58450ef7` | CS 4.0 | Scene 7 · 1080p | high | SHOT FOUR 4s — DOOR CAM, wider: the corner of the room turned toward her chaos, every eye ON HER — deep FRAME-LEFT, unnoticed, KENJI slips into the … |
| 116 | 4:04.2 | 1.8 s | `7d0bf662` | CS 4.0 | Scene 7 · 1080p | high | SHOT THREE 4s — her MEDIUM CLOSE-UP in the chaos. SHE BOWS EXACTLY TWICE — deep and fast at 0.5s, again at 3s — and BETWEEN the bows her hands NEVER … |
| 118 | 4:08.7 | 2.5 s | `96a1ac2b` | CS 4.0 | Scene 7 · 1080p | high | ONE UNBROKEN SHOT, no cuts, 12 seconds — a single continuous push. A cut, a dissolve or a speed change = failed take. |
| 119 | 4:11.2 | 2.6 s | `cf66bc61` | CS 4.0 | Scene 7 · 1080p | high | SHOT THREE 4s — her MEDIUM CLOSE-UP in the chaos. SHE BOWS EXACTLY TWICE — deep and fast at 0.5s, again at 3s — and BETWEEN the bows her hands NEVER … |
| 120 | 4:13.8 | 2.3 s | `2f5cd189` | CS 4.0 | Scene 7 · 1080p | high | SHOT TWO 4s — CLOSE ON THE FIRST DIP, mid-stride: his hand slips two fingers into a hanging coat's inside pocket, a wallet folds out and is gone … |
| 121 | 4:16.1 | 3.0 s | `a3975bfc` | CS 4.0 | Scene 7 · 1080p | high | SHOT TWO 4s — ECU THE DIP: two fingers into a hanging coat's inside pocket, the wallet folding out and gone — the whole hand in frame, the stride's … |
| 122 | 4:19.1 | 2.2 s | `7d58845c` | CS 4.0 | Scene 7 · 1080p | high | SHOT TWO 4s — ECU THE DIP: two fingers into a hanging coat's inside pocket, the wallet folding out and gone — the whole hand in frame, the stride's … |
| 123 | 4:21.3 | 2.7 s | `edc96b22` | CS 4.0 | Scene 7 · 1080p | high | SHOT ONE 4s — TRUE SLOW MOTION: her CLOSE-UP across the room, head and collarbones, mid-laugh in the apology — hair swinging, a bow melting up into a … |
| 124 | 4:23.9 | 3.2 s | `edc96b22` | CS 4.0 | Scene 7 · 1080p | high | SHOT TWO 4s — TRUE SLOW MOTION, the REVERSE: his CLOSE-UP, stopped, eyes held on her a half-beat longer than is safe, the lantern glow slow around … |
| 125 | 4:27.2 | 1.9 s | `5fd663b2` | CS 4.0 | Scene 7 · 1080p | high | SHOT ONE 4s — TRUE SLOW MOTION: her CLOSE-UP across the room, head and collarbones, mid-laugh in the apology — hair swinging, a bow melting up into a … |
| 126 | 4:29.1 | 5.1 s | `5fd663b2` | CS 4.0 | Scene 7 · 1080p | high | SHOT TWO 4s — TRUE SLOW MOTION, the REVERSE: his CLOSE-UP, stopped, eyes held on her a half-beat longer than is safe, the lantern glow slow around … |
| 133 | 4:52.5 | 1.2 s | `509f08a6` | CS 4.0 | Scene 8 · 1080p | high | SHOT ONE 5s — CLOSE ON HER HANDS: mid-show-off, her hand finds a weight in the camel pocket — out comes A STRANGER'S WALLET, the coat owner's; … |
| 141 | 5:14.7 | 2.6 s | `1effdd37` | CS 4.0 | Scene 8 · 1080p | high | SHOT ONE 4s — LANE CAM two-shot, close: her eyes move over his face, reading for the answer he is not giving; his hold hers; her jaw sets on a … |
| 151 | 5:40.3 | 2.0 s | `e6707869` | CS 4.0 | Pickups 8 · 1080p | high | SHOT ONE IS THE START FRAME, ALIVE. The start-frame image supplied with this call is a frame from this film's own footage and it is THE LAW for shot … |
| 152 | 5:42.3 | 2.4 s | `63e7374f` | Seedance 2.5 | Scene 9 v3 · 1080p | high | 0–4s — HELD: his eyes down, the hand turning the rice slow, his face easy and unremarkable. |
| 153 | 5:44.7 | 4.0 s | `e6707869` | CS 4.0 | Pickups 8 · 1080p | high | SHOT ONE IS THE START FRAME, ALIVE. The start-frame image supplied with this call is a frame from this film's own footage and it is THE LAW for shot … |
| 156 | 5:51.3 | 1.3 s | `8b5da320` | Seedance 2.5 | Scene 9 v3 · 1080p | high | 0–2.5s — HELD: her eyes travel the dated lids; his hand turns the rice under the stream. Neither looks at the other. |
| 157 | 5:52.6 | 2.2 s | `3cc94125` | CS 4.0 | Scene 9 · 1080p | high | SHOT ONE 4s — THE LID comes off in her hands and the lamplight falls into the box: on top, the PHOTOGRAPH — the woman, the boy, the fence — face up, … |
| 159 | 5:57.9 | 2.7 s | `54a53e77` | Seedance 2.5 | Scene 9 v2 · 1080p | high | SHOT ONE 4s — MACRO ON THE PHOTOGRAPH: lifted clear of the box into the lamp's warmth, the print FILLING THE FRAME between her fingertips, its white … |
| 167 | 6:15.1 | 1.0 s | `b5514cf3` | Seedance 2.5 | Scene 9 v2 · 1080p | high | SHOT ONE 4s — THE TWO-SHOT, close: the long beat after everything — her eyes on him, his on her, the lamp's pool holding them both. Nobody performs … |
| 171 | 6:24.3 | 9.0 s | `da31eb78` | CS 4.0 | Pickups 3 · 1080p | high | 0–1s — ASLEEP: breath, the lids still. |
| 172 | 6:33.3 | 1.5 s | `cf6ba128` | CS 4.0 | Pickups 3 · 1080p | high | SHOT ONE 4s — THE MASTER, steeply down: THE ENVELOPE lies alone on the shelf top, squared to the front edge, the blade raking across it — a beat of … |
| 174 | 6:37.4 | 1.8 s | `cf6ba128` | CS 4.0 | Pickups 3 · 1080p | high | SHOT ONE 4s — THE MASTER, steeply down: THE ENVELOPE lies alone on the shelf top, squared to the front edge, the blade raking across it — a beat of … |
| 177 | 6:46.2 | 3.7 s | `81e419a2` | CS 4.0 | Scene 10 · 1080p | high | SHOT ONE 4s — DOWN-ANGLE INSERT at floor level: the charcoal coat half-folded on the boards, and KENJI'S HANDS digging through it — one pocket, then … |
| 180 | 6:53.9 | 3.4 s | `97b0538c` | CS 4.0 | Scene 10 · 1080p | high | SHOT ONE 4s — HIS FACE ON THE PILLOW, CLOSE, the morning blade raking the wall above: the eyes open — and the fact of the cold cotton under his far … |
| 181 | 6:57.3 | 1.8 s | `72339308` | CS 4.0 | Opening · 1080p | high | SHOT ONE 5s — FIRST LIGHT: the sky a grey-orange gradient at the horizon rising into deep blue; the city still mostly in shadow, the first windows … |
| 182 | 6:59.1 | 1.9 s | `1afcc58f` | CS 4.0 | Opening · 1080p | high | SHOT TWO 4s — a station stair mouth: the camera drifts along the pavement toward it as a tide of commuters rises out of the underground into flat … |
| 183 | 7:01.1 | 2.3 s | `13408e1b` | CS 4.0 | Opening · 1080p | high | SHOT ONE 5s — TICKET GATES, long lens down the gate line: a stream of commuters taps through in broken rhythm, gate paddles snapping open and shut, … |
| 185 | 7:05.5 | 2.9 s | `94fecbe5` | CS 4.0 | Scene 11 · 1080p | high | SHOT ONE 4s — MID at chest height, bodies crossing close: KENJI mid-car in the crush — the coat's front ONE UNBROKEN LINE: no strap, nothing at his … |
| 186 | 7:08.4 | 2.7 s | `94fecbe5` | CS 4.0 | Scene 11 · 1080p | high | SHOT TWO 4s — HIS CLOSE-UP: his eyes travel the car face to face and land on nothing they want; they settle on the empty air at his shoulder, where … |
| 187 | 7:11.1 | 4.2 s | `d0399d56` | CS 4.0 | Scene 11 · 1080p | high | AN EXTREME CLOSE-UP in a packed Tokyo subway car, weekday morning — the lift, seen at last, at a scale so tight nobody in the car could witness it. … |
| 188 | 7:15.3 | 1.5 s | `b556d860` | CS 4.0 | Scene 11 · 1080p | high | A tight down-angle insert in a packed Tokyo subway car, weekday morning, shot on a LONG TELEPHOTO LENS from well back — NOT a wide lens: no fisheye, … |
| 189 | 7:16.8 | 1.7 s | `9db6c72f` | CS 4.0 | Scene 11 · 1080p | high | SHOT THREE 4s — KENJI'S CLOSE-UP again: the eyes come UP from below frame and settle LEVEL on the man — held one beat past casual, the length of a … |
| 190 | 7:18.5 | 2.5 s | `8cdd8ede` | CS 4.0 | Scene 11 · 1080p | high | SHOT THREE 4s — HIS VIEW continuing, and the look LANDS: THE COUPLE at their pole, heads tilted together over one phone held low between them, the … |
| 191 | 7:21.0 | 3.1 s | `af77f004` | CS 4.0 | Scene 11 · 1080p | high | SHOT FOUR 4s — KENJI'S CLOSE-UP, the reverse: watching them — the same two people, another ordinary day — and what he is waiting to feel begins to … |
| 192 | 7:24.1 | 3.6 s | `d0399d56` | CS 4.0 | Scene 11 · 1080p | high | AN EXTREME CLOSE-UP in a packed Tokyo subway car, weekday morning — the lift, seen at last, at a scale so tight nobody in the car could witness it. … |
| 193 | 7:27.7 | 1.7 s | `ce30551c` | CS 4.0 | Scene 11 · 1080p | medium | SHOT THREE 4s — HIS VIEW continuing, and the look LANDS: THE COUPLE at their pole, heads tilted together over one phone held low between them, the … |
| 194 | 7:29.4 | 7.4 s | `368ed88d` | Seedance 2.5 | Pickups 4 · 1080p | high | continue the shot |

Prompts of the most-used crowd jobs are reproduced in full under "Exemplar prompts" (ff5c00f9 · 1de12a92 · cf66bc61 · d069494a · 53024cad · 5416790c · 94fecbe5 · 21a4fa49 · 63e7374f).

## Exemplar prompts (verbatim)
Copied byte-for-byte from the project data (Element tags `<<<uuid>>>` left as they are). "Final cut N" = verified by frame match (see "Final shots").

### E1. Crowd-only montage, no Elements — final cut 6 (0:15)
- Job `ff5c00f9-93c4-4e6a-9268-6628ed4ee9ad` · Cinema Studio Video 4.0 · folder Opening · 2026-08-15 17:16 · 18 s · 1080p · 21:9 · audio True · Elements: none
```text
FOUR SHOTS, THREE HARD CUTS — separate setups, not one continuous take. A HARD CUT is an instant change of place and camera; a dissolve, fade, wipe, whip pan or any joining move = failed take. EACH SHOT IS A DIFFERENT PLACE IN TOKYO — no shared geography, people or props.

TOKYO, EARLY MORNING — the city starting its day. Everything CANDID — caught, not arranged: nobody aware of a camera, nobody presented, posed or centered. NO NAMED CHARACTER APPEARS IN THIS TAKE — every face an anonymous passer-by, none the subject, none performing.

THE CAMERA IS A PERSON IN THE CITY, every street and station shot: HANDHELD AND VISIBLY HUMAN, and it MOVES — walking, drifting, exploring at an unhurried morning pace, finding things rather than framing them. AMPLITUDE CAP on the texture: the unsteadiness stays small — a person walking with a lens, never whipping, never a boat's sway; no sweeps, no crane moves, nothing fast. Very shallow depth of field, the named subject sharp; anamorphic behavior — oval highlights, soft edge falloff, sharper center — the lens OPTICALLY CLEAN, no lens flares.

THE MORNING AIR IS ALIVE: breath shows in the cold, steam rises where named, and the background keeps its own small life going.

EVERY FACE IN FRAME IS ALIVE: eyes BLINK at their own uneven intervals, never on a count; chests breathe; gazes shift. EYES DO NOT WIDEN — lids LOW and RELAXED, no white above or below an iris; a fixed stare = failed take. EVERY PHONE IS IN A HAND, held low, a thumb on it.

THE PERFORMANCE, every shot: nobody acts — each person wants only the ordinary thing in front of them, shown as behavior, never as expression.

THE CROWD, wherever one appears: dark coats the majority, muted mid-tones scattered — grey wool, camel, olive, beige; a good third women; nothing bright. Nobody makes room for the lens; NOT ONE PAIR OF EYES MEETS ANOTHER — each sealed in a private morning.

Cold real morning light — overcast daylight, early sun, warm doorway glow where named. No neon district, no famous landmarks. Photoreal Japanese live action, underplayed, CANDID NOT ANIME. FLAT FIELD, FULL FRAME: no vignette, straight lines stay straight — no fisheye.

No subtitles, no captions, no burned-in translation text; the city's own Japanese signage stays as it is.

THE SHOT IS ALREADY RUNNING WHEN IT STARTS: the ticket gates are already snapping open and shut.

SHOT ONE 5s — TICKET GATES: the camera WALKS the concourse parallel to the stream of commuters tapping through, gate paddles snapping open and shut, coats and bags brushing the readers, nobody breaking stride; every face somewhere else — a phone, the floor.

HARD CUT.

SHOT TWO 4s — a station stair mouth: the camera drifts along the pavement toward it as a tide of commuters rises out of the underground into flat morning light; beside the mouth AN OLD WOMAN IN AN APRON sweeps her patch of pavement, slow even strokes, the crowd parting around her without a glance.

HARD CUT.

SHOT THREE 4s — a narrow residential lane, the camera AMBLING along it: an elevated train crosses BETWEEN THE BUILDINGS overhead, windows strobing with standing silhouettes; futons air on balcony rails, a man crouches unlocking a bicycle, thin STEAM rises from a bathhouse flue into the cold.

HARD CUT.

SHOT FOUR 5s — a station concourse under the departure board, the camera WANDERING with the tide: the warm dot-matrix rows cycle and flip overhead while dark coats pass beneath them, faces lit by held phones, nobody looking up at the board and nobody looking at anybody.

THE TAKE IS STILL RUNNING WHEN IT ENDS: the board still cycling, the tide still passing, the camera still carried along in it — MID-MOVEMENT at the cut, no held picture.

No music. Sound, per shot: the gates' beeps and paddle snaps over concourse murmur; footsteps rising out of the stairwell, broom strokes under them; the train crossing overhead then fading between the buildings; the concourse murmur and the board's mechanical flutter.
```
Annotation:
- Purpose: the city-wakes montage. No named character, no Element: every face is an anonymous passer-by, so the whole prompt is crowd direction.
- "THE CAMERA IS A PERSON IN THE CITY … finding things rather than framing them" + AMPLITUDE CAP gives the walking-operator feel of 0:05–0:28.
- THE CROWD block = palette + gender mix + "Nobody makes room for the lens; NOT ONE PAIR OF EYES MEETS ANOTHER". "EVERY PHONE IS IN A HAND, held low, a thumb on it" gives every extra an errand.
- Each setup has ONE featured extra with one repeatable action (old woman sweeping, man unlocking a bicycle) and the crowd's relation to them ("the crowd parting around her without a glance").
- The montage was rewritten 6+ times in `Opening`; the film takes single setups from several siblings (fe724235, 771c77ef, 9c240f66, 15465747, b9f6a379, 4a11183a, 1afcc58f, 13408e1b) — fire variants, cut the best 2 s of each.
- Per-shot sound line at the end ("the gates' beeps and paddle snaps over concourse murmur; … broom strokes under them").

### E2. Packed train car, hero + crowd — final cut 12 (0:28); sibling 7a660ae3 gives cut 13
- Job `1de12a92-ae5b-4dc5-a8bb-0b9a413439ac` · Cinema Studio Video 4.0 · folder Scene 1 · 2026-08-16 09:24 · 18 s · 1080p · 21:9 · audio True · Elements: thief-kenji-bag, thief-prop-canvasbag, thief-loc-traincar-v3
```text
FOUR SHOTS, THREE HARD CUTS — four setups cut together, not one continuous take. A HARD CUT is instant; a dissolve, wipe or joining move = failed take.

THE PLACE, all shots: <<<dc1283b5-f092-4a1f-87af-173c2c89bf83>>> — the packed Oedo Line carriage at 8:40, weekday morning, the fluorescents BRIGHT AND CLEAN with the hard edge off, every window BLACK TUNNEL GLASS. GEOMETRY, MATERIALS, LIGHT only; its own wide view never appears.

THE CAR IS PACKED SOLID — AT LEAST FORTY PEOPLE, bodies overlapping lens to far end, no empty floor. WE ALWAYS LOOK THROUGH THE CROWD: near shoulders and sleeves cross close and soft. EVERY STANDING RIDER HOLDS SOMETHING — straps, poles, the forest of hands on one rail. Dark coats broken by muted mid-tones; a good third women.

NOT ONE PAIR OF EYES MEETS ANOTHER — bowed heads, earbuds, phones low in hands, each sealed in a private world. Exceptions: KENJI — the only person in this car looking at anybody — and THE COUPLE, together in one world.

KENJI: <<<1760e972-5a26-4fe2-a4e9-6836e5290924>>> — a Japanese man of 27, charcoal coat CUT CLOSE, wearing <<<d3a2eb37-8ba5-4c0d-bdf3-8a8d4245feb5>>> — SMALL AND SLIM, FLAT at his LEFT HIP, strap across his chest. HIS REGISTER, every shot: NEVER STERN, NEVER SEVERE — focused, easy, in the moment, a FISH IN WATER; a stranger sees a quiet commuter. Stern or grim = failed take.

Every shot: LONG PANAVISION C-SERIES ANAMORPHIC — oval highlights, soft edges, the lens OPTICALLY CLEAN, no lens flares; very shallow depth of field, the named subject sharp. AMBIENT HANDHELD — small live unsteadiness, never whipping; movement SMALL: FELT, NOT SEEN. REAL TIME unless a shot names TRUE SLOW MOTION. CANDID, NOT ANIME — photoreal Japanese live action, underplayed.

EVERY FACE IN FRAME IS ALIVE: eyes BLINK at uneven intervals, never on a count; chests breathe; everyone rides the sway. EYES DO NOT WIDEN — lids LOW and RELAXED, no white above or below an iris. A fixed stare = failed take. NOBODY SPEAKS ON CAMERA; the only voice is the station recording. Fingernails short, clean, completely bare; hands free of jewellery.

THE SHOT IS ALREADY RUNNING WHEN IT STARTS: the recorded apology already playing, the car already swaying.

SHOT ONE 5s — THE CAR: chest height, mid-crush, the camera a slow bodiless half-step drift: bowed heads at every distance, phone glow on downturned faces, the hands on the rail riding the sway together, the recorded voice apologizing for the crowding overhead.

HARD CUT.

SHOT TWO 4s — THE FIND: the camera PANS SLOWLY across a rank of bowed heads while the FOCUS TRAVELS PLANE TO PLANE — onto a near face, soft again, onto a deeper face — then the pan STOPS and the focus LANDS and holds: KENJI, mid-car, the canvas strap across his chest, his eyes ALREADY UP — the only person in this car looking at anybody.

HARD CUT.

SHOT THREE 4s — his CLOSE-UP: his eyes move face to face and REST on each — the woman in the beige raincoat asleep against the pole, the student thumbing a phone, the old man watching the black window. Unhurried, easy; he takes the car in the way other people breathe.

HARD CUT.

SHOT FOUR 5s — WHAT HE SEES, a long telephoto from exactly where he stands, looking through the crush: the details his eyes find, each sharp then released — a wristwatch loose on a rail hand, a side pocket gaping with its owner's sway, a tote's zip open an inch — the morning read like a menu.

THE PERFORMANCE. Kenji wants nothing yet but to know the car — who is where, what is loose, who is asleep. It shows as ease, never as hunger.

THE TAKE IS STILL RUNNING WHEN IT ENDS: his eyes still traveling, the car still swaying, mid-breath.

No music. Sound: the full normal bed — rail roar, the announcement overhead, cloth, breath. No subtitles, no captions, no burned-in text; the car's own Japanese placards stay.
```
Annotation:
- THE CAR IS PACKED SOLID — AT LEAST FORTY PEOPLE … WE ALWAYS LOOK THROUGH THE CROWD … EVERY STANDING RIDER HOLDS SOMETHING: count + occlusion + occupied hands.
- Eye-line law with named exceptions: "NOT ONE PAIR OF EYES MEETS ANOTHER … Exceptions: KENJI — the only person in this car looking at anybody — and THE COUPLE". The exception is the story.
- SHOT TWO "THE FIND" (pan + focus travelling plane to plane across bowed heads, landing on the one face already looking up) is the shot in the film at 0:30.
- SHOT THREE names three extras with one action each ("the woman in the beige raincoat asleep against the pole, the student thumbing a phone, the old man watching the black window") — featured-extra vignettes inside a crowd.
- Three location/character Elements, every one tagged inline; register line with a fence ("Stern or grim = failed take"); "NOBODY SPEAKS ON CAMERA; the only voice is the station recording".

### E3. Izakaya master: crowd reacts to an event — final cuts 110 and 119; siblings 7d0bf662 (cuts 111–116) and 58450ef7 (cut 115)
- Job `cf66bc61-9921-4cea-a6e9-23ad86382ec9` · Cinema Studio Video 4.0 · folder Scene 7 · 2026-08-15 08:42 · 17 s · 1080p · 21:9 · audio True · Elements: thief-kenji-bag, thief-loc-izakaya, thief-prop-canvasbag, thief-sakura-neck-v4
```text
FOUR SHOTS, THREE HARD CUTS — four setups cut together, not one continuous take. A HARD CUT is an instant camera change; a dissolve, wipe or joining move = failed take.

THE PLACE, all shots: <<<9686fc7d-4bbd-4b27-a123-059bff60a258>>>. MATERIALS and LIGHT only; its wide view never appears. THE GEOGRAPHY, TRUE IN EVERY SHOT: the room runs DOOR END to BACK WALL, one AISLE between the low table rows, the bar down one side. EACH SHOT NAMES ITS END. DOOR CAM (toward the back): her STRUCK TABLE FRAME-RIGHT, his working row FRAME-LEFT. BACK CAM: reversed. Wrong-side polarity = failed take.

THE ROOM IS FULL: sixty people at thirty seats, low ceiling, smoke, lantern light. EVERY OBJECT IN USE OR WHERE ITS OWNER PUT IT: coats on the backs of their OWNERS' OWN chairs, glasses on tables or in hands, chopsticks mid-meal. Nothing floats.

THE TWO, exactly the elements' wardrobe. <<<1760e972-5a26-4fe2-a4e9-6836e5290924>>> — KENJI, a Japanese man of 27, charcoal coat CUT CLOSE, wearing <<<d3a2eb37-8ba5-4c0d-bdf3-8a8d4245feb5>>> — SMALL AND SLIM, FLAT against his LEFT HIP, NO TALLER THAN HIS FOREARM, strap across his chest. <<<e3315149-65f5-4675-8fbd-408073d4bb61>>> — SAKURA, a Japanese woman of 22, a man's grey HERRINGBONE overcoat too big for her, choppy SHAG, never a bob, wide BLACK trousers, scuffed WHITE sneakers, matte-black headphones at her neck.

CONCEALMENT: he never works in open view — found through pockets of crowd; his performance carries the checking, small glances that nobody is watching. Anyone noticing him = failed take.

REGISTERS. SAKURA: radiant, completely occupied — apology as theatre; solemn or grim = failed take. KENJI: flat calm, working, unhurried. REAL TIME unless a shot names TRUE SLOW MOTION.

Every shot: LONG PANAVISION C-SERIES ANAMORPHIC — oval highlights, soft edges, sharper center, the lens OPTICALLY CLEAN, no lens flares; very shallow depth of field, near face sharp. TRUE HANDHELD — visible nervous energy, live small corrections, never whipping. AMPLITUDE CAP — the movement stays SMALL: FELT, NOT SEEN; sway or rocking = too far. CANDID, LIVE ACTION, NOT ANIME — photoreal Japanese live action, underplayed; nobody plays to the lens.

VOICES ARE TEXTURE, never quoted lines — her apologies tumble fast in Japanese under the roar. NO DEAD AIR — a shot that idles = failed take.

EVERY FACE IN FRAME IS ALIVE: eyes BLINK at uneven intervals; chests breathe. EYES DO NOT WIDEN — lids LOW and RELAXED, no white above or below an iris. A fixed stare = failed take.

Fingernails short, clean and completely bare, the natural pale colour of unpolished nails, hands plain and free of any jewellery.
THE SHOT IS ALREADY RUNNING WHEN IT STARTS: full roar, her tray arriving at the mid-room table.

SHOT ONE 5s — DOOR CAM, wider: mid-room FRAME-RIGHT, SAKURA GOES DOWN INTO THE TABLE — full commitment — the table jumps, glasses topple, a pitcher sheets across a salaryman's lap; the CRASH at 1.5s.

HARD CUT.

SHOT TWO 4s — the struck table, close: SIX PEOPLE STAND UP AT ONCE, chairs scraping back, napkins snatched, beer off the edge.

HARD CUT.

SHOT THREE 4s — her MEDIUM CLOSE-UP in the chaos. SHE BOWS EXACTLY TWICE — deep and fast at 0.5s, again at 3s — and BETWEEN the bows her hands NEVER STOP WORKING: a bar towel pressed to the salaryman's sleeve, the pitcher set upright, a palm out waving off help, laughing through all of it. A third bow = failed take.

HARD CUT.

SHOT FOUR 4s — DOOR CAM, wider: the corner of the room turned toward her chaos, every eye ON HER — deep FRAME-LEFT, unnoticed, KENJI slips into the aisle and starts down the working row.

HARD CUT.

THE PERFORMANCE. The crash is a job and she is brilliant at it: every eye belongs to her — nobody looks at the aisle.

THE TAKE IS STILL RUNNING WHEN IT ENDS: her second bow rising into a grin, the room standing, mid-breath.

No music. Sound: THE ROAR — sixty voices, the crash ringing off, a kitchen bell — her apologies under it. No subtitles, no captions, no burned-in text.
```
Annotation:
- THE ROOM IS FULL: sixty people at thirty seats + "EVERY OBJECT IN USE OR WHERE ITS OWNER PUT IT … Nothing floats." — the background is dressed by rule, not by luck.
- A shared physical event moves the extras together: the crash at 1.5s, "SIX PEOPLE STAND UP AT ONCE, chairs scraping back, napkins snatched".
- Attention allocation as a written beat: "the corner of the room turned toward her chaos, every eye ON HER — deep FRAME-LEFT, unnoticed, KENJI slips into the aisle"; CONCEALMENT: "Anyone noticing him = failed take."
- Named camera ends ("DOOR CAM (toward the back) … BACK CAM: reversed. Wrong-side polarity = failed take.") keep screen direction across many takes.
- "VOICES ARE TEXTURE, never quoted lines" — the crowd and even the lead's apologies are walla; "A third bow = failed take" counts the gesture.

### E4. Stairwell chase: the crowd ignores the lead on purpose — final cut 65 (2:03)
- Job `d069494a-0928-4f82-ba71-3e43d43fa6e1` · Cinema Studio Video 4.0 · folder Scene 4 · 2026-08-16 20:04 · 18 s · 1080p · 21:9 · audio True · Elements: thief-prop-canvasbag, thief-sakura-neck-v4, thief-kenji-bag-v2
```text
A chase up a Tokyo subway exit stairwell at morning rush — FOUR SHOTS, THREE HARD CUTS: four setups cut together, not one continuous take. A dissolve, wipe or joining move = failed take.

THE PLACE, all shots — no location element; the design is fixed here, from the director's stairwell reference: a broad straight subway EXIT STAIRWELL climbing toward the ticket-hall level — CREAM BRICK-TILE walls in running bond, TWIN STEEL HANDRAILS along each wall and a center rail dividing the flights, broad concrete steps with worn dark nosings, fluorescent battens on the tile and the low ceiling, a CONVEX MIRROR at the upper turn, cool even neutral light.

THE STAIR IS DENSE WITH CLIMBING COMMUTERS — AT LEAST TWENTY-FIVE PEOPLE in frame, filling the width wall to wall, all climbing, heads bowed, each sealed in a private world; crossing shoulders and backs WIPE the near plane, dark and soft, HIDING PART OF the named subject. Nobody makes room for the camera.

KENJI: @thief-kenji-bag-v2 — charcoal coat, wearing @thief-prop-canvasbag FLAT at his LEFT HIP, the strap one clean diagonal across his back — SEEN ONLY FROM BEHIND in every shot; his face in any frame = failed take. He climbs AT THE CROWD'S PACE, weaving one body at a time, never running, never looking back.

SAKURA: @thief-sakura-neck-v4 — a man's grey HERRINGBONE overcoat too big for her, LARGE matte-black headphones AT HER NECK, choppy SHAG hair. She climbs FASTER than the flow — cutting between shoulders, taking two steps where the crowd takes one — the only person on the stair in a hurry.

KINETIC HANDHELD — the operator is climbing too: quick small reframes, the frame breathing hard with the chase, urgency in the hands, never whipping, never shake for its own sake. AMPLITUDE CAP raised one notch: a person hurrying with a lens, never the camera performing. VERY SHALLOW depth of field on a LONG ANAMORPHIC lens — the named subject sharp, oval out-of-focus highlights, OPTICALLY CLEAN, no lens flares. FLAT FIELD, FULL FRAME: no vignette, no fisheye. REAL TIME. CANDID, NOT ANIME — photoreal Japanese live action, underplayed; nobody aware of any camera.

EVERY FACE IN FRAME IS ALIVE: eyes BLINK at uneven intervals, never on a count; chests breathe. EYES DO NOT WIDEN — lids LOW and RELAXED, no white above or below an iris. A fixed stare = failed take.

THE SHOT IS ALREADY RUNNING WHEN IT STARTS: both already on the stairs, the crowd already climbing.

SHOT ONE 5s — LOW FROM THE STAIR'S FOOT, climbing with the flow: the stairwell full of ascending backs — and KENJI'S charcoal back among them, higher, the strap's diagonal keeping him findable, rising step by step toward the mirror's turn.

HARD CUT.

SHOT TWO 4s — SAKURA from the side, mid-flight: she cuts UP THROUGH the crowd — shoulder past shoulder, two steps at a time, the headphones at her neck riding the climb — the camera climbing with her, breathing hard.

HARD CUT.

SHOT THREE 5s — WIDER, up the well from below: 「ねえ。」 — she YELLS it up the stairwell, louder than a platform voice — and NOT ONE HEAD in the crowd turns, and KENJI'S BACK does not break stride: he crests past the convex mirror at the turn and the crowd closes over where he was.

HARD CUT.

SHOT FOUR 4s — HER MEDIUM from above the turn, climbing toward the lens: eyes up past the camera, jaw set, mouth closed, working through bodies that do not part for her, the flow filling the frame's edges.

THE PERFORMANCE. He disappears by being ordinary; she chases by being the only person in Tokyo in a hurry — and the stairwell ignores them both, which is the film.

DIALOGUE STRUCTURE: her single yell lands EARLY in shot three; every other second is WORDLESS.

THE TAKE IS STILL RUNNING WHEN IT ENDS: her still climbing, the crowd still climbing around her, mid-stride.

No music. Sound: hundreds of shoes on concrete, the stairwell's hard echo, her one yell swallowed by it. No subtitles, no burned-in text.

```
Annotation:
- Place fixed in text ("no location element; the design is fixed here, from the director's stairwell reference") — a crowd location does not need an Element.
- "AT LEAST TWENTY-FIVE PEOPLE in frame … all climbing, heads bowed … Nobody makes room for the camera." Count + direction of flow.
- Tempo contrast written per character: he climbs "AT THE CROWD'S PACE"; she climbs "FASTER than the flow … the only person on the stair in a hurry".
- The crowd's non-reaction is the beat: "「ねえ。」 — she YELLS it up the stairwell … and NOT ONE HEAD in the crowd turns". Direct what the extras do NOT do.
- Uses the `@element-name` reference syntax (89 prompts in this project) instead of `<<<uuid>>>`; "AMPLITUDE CAP raised one notch" for a chase.

### E5. 3 s POV pickup on a very long lens — final cut 69 (2:07)
- Job `53024cad-b43e-4fa3-8552-a84d3d32c1d5` · Cinema Studio Video 4.0 · folder Pickups 6 · 2026-08-24 22:29 · 4 s · 1080p · 21:9 · audio True · Elements: thief-kenji-bag, thief-prop-canvasbag
```text
ONE UNBROKEN SHOT, no cuts, 3 seconds — HER GLIMPSE: what Sakura sees from the subway mouth in the second she stops. A cut, a dissolve or a speed change = failed take.

THE PLACE — no location element; the design is fixed here: a Tokyo street at morning rush, seen from the subway exit at street level, STRAIGHT DOWN THE PAVEMENT — storefronts running away along the right side, the crowd running away with them, cool early light down between the buildings. Signs and street text stay FAR, SOFT or CROPPED — nothing readable is invented.

THE LENS, A LAW: VERY, VERY HIGH TELEPHOTO — an extremely long telephoto prime — at eye height at the exit mouth, looking DOWN THE STREET: compression crushes a hundred metres of pavement into a flat wall of stacked heads and shoulders; the frame is TIGHT, carved out of the crowd, never surveying it. Very shallow depth of field, a wide-open lens: THE SHARP PLANE IS FAR DOWN THE STREET — KENJI AND WHOEVER WALKS AT HIS OWN DISTANCE stay sharp, and focus falls away CONTINUOUSLY WITH DISTANCE in both directions, so everything near the lens — heads, shoulders, a passing sleeve — is an enormous soft shape wiping across the frame. THE CAMERA DOES NOT MOVE: magnified handheld only, the long lens's small float, FELT, NOT SEEN. The lens OPTICALLY CLEAN, no lens flares.

THE CROWD IS DENSE: the pavement full in both directions, near heads and shoulders crossing the lens constantly, the far crowd stacked into one breathing mass by the compression. Bowed heads, each sealed in a private world; nobody looks at the lens.

KENJI, SEATED IN THE SHARP PLANE: <<<1760e972-5a26-4fe2-a4e9-6836e5290924>>> — FAR down the street, IN the sharp plane, SMALL, seen from BEHIND: the charcoal coat, the olive strap of <<<d3a2eb37-8ba5-4c0d-bdf3-8a8d4245feb5>>> one clean diagonal across his back, walking AWAY at the crowd's own pace, unhurried, threading between backs. His face never appears; he never looks back.

THE BLIP, THE WHOLE POINT OF THE SHOT: HE IS IN THE CLEAR FOR BARELY A SECOND ACROSS THE WHOLE TAKE — the near crowd wipes across him and a gap opens just long enough to recognize the coat and the strap — and IN THAT GAP HE TURNS TO HIS RIGHT, one unbroken step, SCREEN-RIGHT, and he is GONE BETWEEN TWO BUILDINGS: swallowed mid-stride into a dark seam the lens cannot read, the crowd closing over the spot at once. The seam never becomes a place — no lit opening, no doorway detail, no signage. A visible alley mouth, the camera finding where he went, him pausing at the turn, or him in the clear longer than a second = failed take.

CANDID, NOT ANIME — photoreal Japanese live action, underplayed; nobody aware of any camera. EVERY FACE IN FRAME IS ALIVE: eyes BLINK at uneven intervals, never on a count; chests breathe. A fixed stare = failed take. NOBODY SPEAKS. REAL TIME — no slow motion, no speed ramp.

THE PERFORMANCE, at long range: HE WANTS nothing but to get where he is going — the turn is unmarked: no glance back, no check over the shoulder, no change of pace, a man taking his own street, indistinguishable from every other commuter until the second he is gone. The crowd wants its trains and its desks; nobody notices him arrive at the turn or leave by it.

THE SHOT IS ALREADY RUNNING WHEN IT STARTS: the crowd already crossing, he already far down the street, already a stride from his turn.

THE TAKE IS STILL RUNNING WHEN IT ENDS: the street still flowing, the spot where he vanished already just crowd, mid-stride everywhere.

No music. Sound: the street's morning roar — hundreds of shoes, far traffic, the station's mouth behind the lens. No subtitles, no captions, no burned-in text.

THE STOCK AND THE GLASS: shot on 35mm FILM through ANAMORPHIC lenses — fine live film grain, filmic highlight roll-off, oval out-of-focus highlights, soft frame edges with the center sharpest; photochemical color, never video-clean.
```
Annotation:
- A Pickups shot with one job: the second she loses him. 3 s, one unbroken shot, no Element for the street (fixed in text).
- "VERY, VERY HIGH TELEPHOTO … compression crushes a hundred metres of pavement into a flat wall of stacked heads" — the crowd becomes texture; only one plane is sharp.
- "THE BLIP, THE WHOLE POINT OF THE SHOT: HE IS IN THE CLEAR FOR BARELY A SECOND" — the crowd is used as a moving curtain with a timed gap.
- "The crowd wants its trains and its desks; nobody notices him arrive at the turn or leave by it."
- This prompt was fired as a batch of 6 at 22:29; fifteen minutes later the author rewrote it (8a0bd5a1: Kenji LARGE in frame, camera hunting) and fired 3 more — the film uses this earlier version. The last version in a chain is not always the one in the cut.

### E6. Seedance 2.5 four-shot pickup in a draining car — final cut 56 (1:53)
- Job `5416790c-7d62-4acd-a552-0baac24029f4` · Seedance 2.5 · folder Pickups 1 · 2026-08-20 09:46 · 18 s · 1080p · 21:9 · audio True · Elements: thief-sakura-ears-v2, thief-loc-traincar-v3
```text
FOUR SHOTS, THREE HARD CUTS — four setups cut together, NOT one continuous take. A HARD CUT is instant: a dissolve, fade, wipe, whip pan or any camera move joining two shots = failed take.

camera_model:    "35mm Film"
camera_lens:     "Anamorphic"
camera_aperture: "f/4 Moderate"
pacing / light / light_preset / genre_control / era_control /
light_custom / color_palette:  all None

THE PLACE, all shots: <<<dc1283b5-f092-4a1f-87af-173c2c89bf83>>> — the Oedo Line carriage, STOPPED, ITS DOORS OPEN, fluorescents bright and clean; through the doors the platform stands brighter still, soft and deep. GEOMETRY, MATERIALS, LIGHT only.

SCREEN DIRECTION, ALL SHOTS: THE DOORS ARE ON THE FRAME'S RIGHT AND THE WHOLE TIDE MOVES SCREEN-RIGHT — coats and backs crossing left to right and out. Anyone leaving to frame-left = failed take.

THE CAR IS PACKED AND DRAINING — THIRTY OR MORE RIDERS, no empty floor. NEAR BODIES PASS BETWEEN LENS AND SUBJECT in every shot, dark and out of focus, WIPING the frame and hiding part of her; her face clear between wipes. Bowed heads, earbuds, phones low; nobody looks at her or at the lens.

SAKURA: <<<6fce77b4-d447-45a7-9a2b-f06f42a07d2f>>> — early 20s, A GROWN WOMAN AND NOT A TEENAGER: her face ANGULAR, defined jaw, clear cheekbones; a round, soft or girlish face = failed take. A MAN'S GREY HERRINGBONE OVERCOAT, CLEARLY TOO BIG FOR HER, sleeves past her wrists; hair a choppy SHAG, never a bob; LARGE matte-black headphones covering BOTH EARS. SHE IS THE ONLY ONE NOT MOVING.

Every shot: LONG ANAMORPHIC LENS — OPTICALLY CLEAN, no lens flares; VERY SHALLOW depth of field, her the only sharp plane. AMBIENT HANDHELD: FELT, NOT SEEN. REAL TIME throughout. CANDID, NOT ANIME — photoreal Japanese live action, underplayed; nobody aware of any camera. EVERY FACE IN FRAME IS ALIVE: eyes BLINK at uneven intervals, never on a count; chests breathe. A fixed stare = failed take. NOBODY SPEAKS. Fingernails short, clean, completely bare; hands free of jewellery.

THE SHOT IS ALREADY RUNNING WHEN IT STARTS: the doors already open, the car already draining past her.

SHOT ONE 4s — MEDIUM-CLOSE, chest height, three-quarter: SAKURA STANDS MID-CAR as the car empties around her, the tide crossing SCREEN-RIGHT through her frame, the big coat and the headphones reading clearly. Her eyes are level and on nothing; she does not move with them.

HARD CUT.

SHOT TWO 4s — CLOSE INSERT, NO FACE IN FRAME: her hip and the coat's LEFT outer pocket, herringbone filling the frame. HER HAND GOES IN — not a pat, a full reach, fingers to the seam — and finds it FLAT: lining, nothing else. The hand comes out slowly and stays open against the cloth.

HARD CUT.

SHOT THREE 5s — THE CLOSE-UP, her face filling the frame's height, the draining car soft behind her. SHE ALREADY KNEW: this is CONFIRMATION, NOT DISCOVERY — no widening, no gasp, nothing startled. For one beat NOTHING MOVES on her face. Then it lands as DISBELIEF GOING HARD: her chin lifts a fraction, her eyes flick UP and away for half a beat — you have got to be kidding me — and come back DOWN level and sharp; her tongue presses the inside of her cheek; her lips press, one corner pulling back tight; her jaw sets. Not frightened, not sad: a professional who has just been taken, and it OFFENDS her. Brows that knit upward, wet eyes or a pleading face = failed take.

HARD CUT.

SHOT FOUR 5s — SHE MOVES, the decision already made: she turns into the last of the tide and goes SCREEN-RIGHT, faster than the people around her, cutting the gaps between shoulders, out through the doors and down onto the platform, her head UP and turning, already hunting the flow for one coat. Not panic — pace.

THE PERFORMANCE. She wants: to find the hand that did it. She knew when it happened and let it happen; the pocket only confirms it. It shows as SPEED AND FLATNESS, never distress — the face stays hard, the body goes early, nothing about her helpless.

THE TAKE IS STILL RUNNING WHEN IT ENDS: she is still going, still scanning, the platform crossing past her.

No music. Sound: the door chime, hundreds of footsteps, the departure melody, the platform's roar. No subtitles, no burned-in text.
```
Annotation:
- Seedance prompt with the Cinema Studio settings pasted as text (camera_model / camera_lens / camera_aperture block) — the author's way to keep one look across engines.
- "SCREEN DIRECTION, ALL SHOTS: THE DOORS ARE ON THE FRAME'S RIGHT AND THE WHOLE TIDE MOVES SCREEN-RIGHT … Anyone leaving to frame-left = failed take." — crowd direction as a screen-direction law.
- "SHE IS THE ONLY ONE NOT MOVING." — the lead defined against the crowd's motion.
- SHOT THREE is a micro-expression score (confirmation not discovery; chin lifts, eyes flick up and away for half a beat, tongue presses the cheek, jaw sets) with a fence on the wrong emotion.
- Foreground wipes required in every shot; "nobody looks at her or at the lens".

### E7. Featured extra as an Element, hands locked — final cuts 185–186 (7:05)
- Job `94fecbe5-fab6-4fb1-ae86-8cde77d751dc` · Cinema Studio Video 4.0 · folder Scene 11 · 2026-08-17 09:41 · 17 s · 1080p · 21:9 · audio True · Elements: thief-victim-s11-teal, thief-kenji-nobag, thief-prop-blackphone, thief-loc-traincar-v3
```text
FOUR SHOTS, THREE HARD CUTS — four setups cut together, not one continuous take. A HARD CUT is instant; a dissolve, wipe or joining move = failed take.

THE PLACE, all shots: <<<dc1283b5-f092-4a1f-87af-173c2c89bf83>>> — the packed Oedo Line carriage, 8:40 weekday morning, fluorescents BRIGHT AND CLEAN, every window BLACK TUNNEL GLASS. GEOMETRY, MATERIALS, LIGHT only.

THE CAR IS PACKED SOLID — AT LEAST FORTY PEOPLE, no empty floor. IN EVERY SHOT A NEAR BODY OVERLAPS THE NAMED SUBJECT — a shoulder, arm or back CROSSING IN FRONT, dark, out of focus, HIDING PART OF THE BODY; a soft shape at the frame edge is NOT enough. The named face stays clear. EVERY RIDER HOLDS A STRAP, POLE OR RAIL. Dark coats, muted mid-tones; a third women.

NOT ONE PAIR OF EYES MEETS ANOTHER — bowed heads, earbuds, phones low, each sealed away. KENJI IS THE ONLY ONE LOOKING AT ANYBODY, and he looks NATURALLY: unhurried glances about the car, eyes flicking, refocusing, drifting off and back, blinking as he goes — a man looking, not a camera scanning.

KENJI: <<<8c701959-bb4e-4c84-90e3-2a0a9c3ac1bd>>> — a Japanese man of 27, charcoal coat CUT CLOSE, ITS FRONT ONE UNBROKEN LINE OF CHARCOAL — NO BAG, no strap across him, hands empty. HIS REGISTER: NEVER STERN, NEVER SEVERE, NEVER SAD — GENTLE DISAPPOINTMENT, carried lightly and never played; every practiced move arrives A HALF-BEAT LATE.

LONG PANAVISION C-SERIES ANAMORPHIC — oval highlights, OPTICALLY CLEAN, no lens flares; very shallow depth of field, the named subject sharp. AMBIENT HANDHELD — small live unsteadiness, never whipping; SMALL: FELT, NOT SEEN. REAL TIME. CANDID, NOT ANIME — photoreal Japanese live action.

EVERY FACE IN FRAME IS ALIVE: eyes BLINK at their own uneven intervals, never on a count; chests breathe; GAZES MAKE SMALL INVOLUNTARY SHIFTS. EYES DO NOT WIDEN — lids LOW and RELAXED, no white above or below an iris. A fixed stare = failed take. NOBODY SPEAKS ON CAMERA; the only voice is the station recording. Fingernails short, clean and completely bare, the natural pale colour of unpolished nails, hands plain and free of any jewellery.

THE VICTIM, in shots three and four only: <<<4b57280d-f129-4765-a832-857d502c4a7b>>> — 63, silver-haired, NO glasses, TEAL-BLUE overcoat, rust-red muffler. HIS RIGHT HAND holds <<<c9767a93-8ca3-4016-9f38-3f1a928bfae7>>> at HIS OWN face, HIS LEFT up through a strap. HE NEVER REACHES ANYWHERE, never looks up from the phone. THE VICTIM'S HANDS NEVER MOVE FROM WHERE THEY ARE.

KENJI'S HANDS, ANY WALLET, ANY POCKET: NEVER VISIBLE — frames bottom at chest height, the camera NEVER tilts down.

THE SHOT IS ALREADY RUNNING WHEN IT STARTS: the car mid-tunnel, everything swaying.

SHOT ONE 4s — MID at chest height, bodies crossing close: KENJI mid-car in the crush — the coat's front ONE UNBROKEN LINE: no strap, nothing at his hip, hands empty at his sides. He rides, easy.

HARD CUT.

SHOT TWO 4s — HIS CLOSE-UP: his eyes travel the car face to face and land on nothing they want; they settle on the empty air at his shoulder, where somebody would be standing, a moment too long, then back to the black window.

HARD CUT.

SHOT THREE 4s — TWO-SHOT, chest height: a commuter's dark back covers part of KENJI, close and soft; THE VICTIM FRAME-RIGHT, phone at his own face — and the BRAKE arrives: the whole crush LEANS AS ONE BODY, KENJI leaning with it a fraction before everyone else.

HARD CUT.

SHOT FOUR 5s — KENJI'S CLOSE-UP as the car rights itself: one faint shift crosses his chest, nothing else. HIS EYES NEVER DROP: level past the lens while everything settles, breath even.

THE PERFORMANCE. He is very good at this and it has gone a little flat on him — all of it in the timing, and in where the eyes go when the work does not need them.

THE TAKE IS STILL RUNNING WHEN IT ENDS: tunnel lights still passing, the crowd resettling, mid-breath.

No music. Sound: the full normal bed — rail roar, brake hiss, cloth, forty breaths. No subtitles, no burned-in text.
```
Annotation:
- Two character Elements only (Kenji without bag + the victim) — the project never puts more than two in one generation.
- The victim's action is fixed and frozen: "HE NEVER REACHES ANYWHERE, never looks up from the phone. THE VICTIM'S HANDS NEVER MOVE FROM WHERE THEY ARE." — background people get one locked activity.
- Shared physics again: "the BRAKE arrives: the whole crush LEANS AS ONE BODY, KENJI leaning with it a fraction before everyone else" — character expressed as timing against the crowd.
- "GAZES MAKE SMALL INVOLUNTARY SHIFTS" added to the life-signs block; "a man looking, not a camera scanning".
- "KENJI'S HANDS, ANY WALLET, ANY POCKET: NEVER VISIBLE — frames bottom at chest height, the camera NEVER tilts down." — frame limits as a law.

### E8. 720p rehearsal take that made the final cut — cut 100 (3:16)
- Job `21a4fa49-53d2-4909-93de-d6558d009365` · Cinema Studio Video 4.0 · folder Scene 6 720p · 2026-08-14 14:36 · 17 s · 720p · 21:9 · audio True · Elements: thief-loc-sobahall, thief-kenji-nobag, thief-sakura-neck-v4
```text
FOUR SHOTS, THREE HARD CUTS — four setups cut together, not one continuous take. A HARD CUT is an instant camera change; a dissolve, wipe or joining move = failed take.

THE PLACE, all shots: <<<0bf6544e-b902-47c3-bf57-05cc9fa2eaac>>>. It gives GEOMETRY, MATERIALS and LIGHT — never framing. COVERAGE STAYS TIGHT unless a shot names wider; re-photographing its wide view = failed take.

THE COMPASS, TRUE IN EVERY SHOT: a stand-and-eat SOBA STALL in a bright market hall — a worn WARM WOOD COUNTER; on the shop side a steaming hatch, price strips, a ticket machine. SAKURA and KENJI stand shoulder to shoulder AT THE COUNTER — SAKURA FRAME-LEFT of KENJI — facing the counter and its hatch; the deep COFFERED-CEILING HALL recedes behind them, columns and morning commuters dissolved soft. The PROFILE AXIS runs ALONG THE COUNTER: SAKURA NEARER CAMERA, KENJI JUST BEYOND HER, faces in PROFILE; never head-on from the shop side. THE COUNTER RULE: the conversation is SPOKEN TO THE COUNTER, eyes down on the bowls; nobody turns from it, nobody faces camera — except KENJI'S ONE NAMED TURN, head only. Facing camera, or turning to each other = failed take.

THE TWO OF THEM. <<<8c701959-bb4e-4c84-90e3-2a0a9c3ac1bd>>> — KENJI, a Japanese man of 27, in a FITTED charcoal coat, NOTHING SLUNG ACROSS HIM — shoulders and chest clear, no bag and no strap; a bag on him = failed take. <<<e3315149-65f5-4675-8fbd-408073d4bb61>>> — SAKURA, a Japanese woman of 22, a man's grey HERRINGBONE overcoat too big for her, hair a choppy SHAG, never a bob. They EAT like commuters — fast, real mouthfuls, eyes down; nobody poses with chopsticks.

HEIGHT: SAKURA IS THE SHORTER — eye-line at KENJI'S MOUTH. Head level with his = failed take.

SAKURA'S REGISTER: surveillance as small talk — dry, lines thrown away, the power hers, the talk one-sided; a smile only where a shot orders it. Solemn or grim = failed take. KENJI'S: study, not alarm — surprise behind a still face.

Every shot: LONG PANAVISION C-SERIES ANAMORPHIC — oval highlights, soft edges, sharper center, the lens OPTICALLY CLEAN, no lens flares; very shallow depth of field, near face sharp. AMBIENT HANDHELD — an operator's small unsteadiness, never whipping. AMPLITUDE CAP — movement stays SMALL: FELT, NOT SEEN. CANDID, LIVE ACTION, NOT ANIME — photoreal Japanese live action: no anime acting or gesture, underplayed; nobody plays to the lens.

STRUCTURE: one speaker per shot; lines land in the FIRST THIRD, the rest ITS PHYSICAL BEAT. NO DEAD AIR — never more than ONE SECOND of stillness; a shot that idles = failed take.

EVERY FACE IN FRAME IS ALIVE: eyes BLINK at uneven intervals; chests breathe. EYES DO NOT WIDEN — lids LOW and RELAXED, no white above or below an iris. A fixed stare = failed take.

Fingernails short, clean and completely bare, the natural pale colour of unpolished nails, hands plain and free of any jewellery.
THE SHOT IS ALREADY RUNNING WHEN IT STARTS: both eating, faces to the counter.

SHOT ONE 6s — her PROFILE CLOSE-UP, eyes down on the bowl. At 0.5s, small talk: 「ぐるっと一周。新宿で降りて、一両前に乗り直す。」 She lifts noodles through the line.

HARD CUT.

SHOT TWO 3s — CLOSE ON HIS CHOPSTICKS over the bowl, steam through frame: at 1s they STOP mid-lift and hang there. No faces.

HARD CUT.

SHOT THREE 4s — his PROFILE past her soft shoulder — at 0.5s THE ONE TURN: his HEAD turns to her, body square to the counter. At 1.5s, quiet: 「いつから見てた？」

HARD CUT.

SHOT FOUR 4s — her PROFILE CLOSE-UP. She does NOT turn, does not stop eating. At 1s, flat: 「じゅうぶん長く。」 An almost-smile at the bowl.

HARD CUT.

THE PERFORMANCE. SAKURA hands him his own route like weather. KENJI wants to know how long he has been visible — the stopped chopsticks are the whole reaction, and the turn costs him.

THE TAKE IS STILL RUNNING WHEN IT ENDS: his head still turned to her, her eyes on the bowl, mid-breath.

No music. Sound: the hall around them — a far announcement, slurps, chopsticks on china. No subtitles, no captions, no burned-in text.
```
Annotation:
- From `Scene 6 720p` (14 Aug). The 1080p re-fires about eight hours later changed ≈1 % of the text (wardrobe: "+ wide BLACK trousers, scuffed WHITE sneakers — blue jeans = failed take"), but the editor kept this 720p performance.
- THE COMPASS + THE COUNTER RULE: screen sides, profile axis, "nobody turns from it … except KENJI'S ONE NAMED TURN, head only".
- Background crowd handled in one clause: "columns and morning commuters dissolved soft".
- Dialogue rules: "one speaker per shot; lines land in the FIRST THIRD, the rest ITS PHYSICAL BEAT. NO DEAD AIR — never more than ONE SECOND of stillness".
- Business carries the reaction: "CLOSE ON HIS CHOPSTICKS … at 1s they STOP mid-lift and hang there. No faces."

### E9. Seedance 2.5 single-take coverage on the master's clock — final cut 152 (5:42)
- Job `63e7374f-c0f6-43de-927d-ac74142bdbb0` · Seedance 2.5 · folder Scene 9 v3 · 2026-08-23 17:25 · 12 s · 1080p · 21:9 · audio True · Elements: thief-kenji-home-longsleeve, thief-loc-tatami-v2
```text
ONE UNBROKEN SHOT, no cuts — a single continuous 12-second take. Any cut, dissolve, wipe or optical transition = failed take. THIS IS HIS COVERAGE OF THE OPENING EXCHANGE — its clock mirrors the wide (W1) beat for beat.

THE PLACE: <<<8797df30-33f6-43a3-800c-7cabe4879209>>> — Kenji's one-room TATAMI apartment at NIGHT, the shelf unit — EXACTLY NINE KRAFT-BROWN taped dated shoeboxes on THREE shelves, three per shelf, ONE BOX DEEP, no rank behind; THE SHADED LAMP SITS AT ONE END OF THE UNIT'S FLAT TOP, the rest of the top CLEAR; his canvas bag ON THE FLOOR by the door, never on a body. GEOMETRY, MATERIALS, LIGHT only; its own wide view never appears.

THE LIGHT IS INCANDESCENT ONLY — one warm color temperature, nothing cool mixed in; the city a cold glimmer beyond the glass.

THE FRAME, THE WHOLE TAKE: MEDIUM CLOSE-UP OF KENJI AT THE SINK — chest up, IN PROFILE facing FRAME LEFT into the counter, the warm under-cabinet strip his key light, the room falling soft behind him. AT THE FRAME'S LOWER EDGE THE RICE STAYS IN FRAME AND READABLE THE WHOLE TAKE: the STEEL BOWL down in the sink, the FAUCET'S quiet stream falling INTO it, the MILKY-WHITE water, HIS HAND IN THE RICE turning it in slow gentle circles. All three together — bowl in sink, stream into bowl, hand in rice — or it is a failed take; a hand outside the bowl, a lifted bowl, bare hands rubbing under the tap, sloshing = failed take. The bowl never moves.

KENJI: <<<6b33a494-e53a-4efb-8342-66383a85d7be>>> — a Japanese man of 27, AT HOME: NO COAT AND NO BAG on his body — long-sleeved shirt, dark trousers, SOCKS. HIS REGISTER IS DELIBERATELY ORDINARY: easy, settled, a man doing a small domestic job — NOT COLD and NOT SMILEY. No stern, grim or hard face; no smile, no grin, no chuckle. He is keeping himself unremarkable ON PURPOSE — nothing about him invites a second look. A performed warmth or a performed chill = failed take.

SAKURA IS NOT IN THIS FRAME — she is across the room, off screen FRAME RIGHT; her voice comes from there.

THE CAMERA IS HANDHELD — a real operator on their feet. NEVER LOCKED OFF, NEVER ON TRIPOD OR DOLLY: the frame breathes, the fine quick tremor of hands on a long lens, corrected. FELT, NOT SEEN; never a whip or deliberate reframe.

LONG ANAMORPHIC LENS — oval highlights, OPTICALLY CLEAN, no lens flares; VERY SHALLOW depth of field, focus seated on his face, the bowl a soft-but-readable second plane. REAL TIME. CANDID, NOT ANIME — photoreal Japanese live action, underplayed.

EVERY FACE IN FRAME IS ALIVE: eyes BLINK at uneven intervals, never on a count; chests breathe. EYES DO NOT WIDEN — lids LOW and RELAXED, no white above or below an iris. A fixed stare = failed take. Dialogue LOW, in Japanese, only where named below. Fingernails short, clean and completely bare, the natural pale color of unpolished nails, hands plain and free of any jewellery.

THE SHOT IS ALREADY RUNNING WHEN IT STARTS: the water already running into the bowl, his eyes already down on the rice.

THE BEATS, in order, unhurried — the same clock as the wide:
0–4s — HELD: his eyes down, the hand turning the rice slow, his face easy and unremarkable.
~4s — HER LINE ARRIVES FROM OFF SCREEN, across the room, flat and curious: 「これ、何が入ってんの。」
~5.5s — HIS BEAT: the hand goes STILL in the rice; his head turns toward FRAME RIGHT and he LOOKS AT HER — a full breath, eyes steady, his face giving nothing away and refusing nothing. No swallow played big, no jaw set — the beat itself is the only tell.
~7s — quiet and even, unremarkable: 「何も。」
~8s — HE LOOKS BACK DOWN to the bowl; the hand resumes its slow turning, exactly as before.
9–12s — AIR: the washing continues, his face settling back to easy; the water runs.

DIALOGUE STRUCTURE: her off-screen line near the fourth second; his answer near the seventh; between them HIS BEAT — the stilled hand and the held look toward frame right — is a FULL BREATH, never rushed. Air after 「何も。」; no other speech.

THE PERFORMANCE. A lie told the way you pass a stranger: the aim of his face is TO NOT BE WORTH NOTICING — not cold, not charming, exactly ordinary. What gives him away, only to us, is the beat — the hand that stops, the look held a half-second long, the care of going back to the rice.

THE TAKE IS STILL RUNNING WHEN IT ENDS: the water still running into the bowl, his hand back in the rice, his eyes down, mid-breath.

No music. Sound: the faucet's stream into steel close, rice grains, cloth, her voice small across the room, the city faint. No subtitles, no burned-in text.

camera_model:    "35mm Film"
camera_lens:     "Anamorphic"
camera_aperture: "f/4 Moderate"
pacing / light / light_preset / genre_control / era_control /
light_custom / color_palette:  all None
```
Annotation:
- "THIS IS HIS COVERAGE OF THE OPENING EXCHANGE — its clock mirrors the wide (W1) beat for beat." The wide and the single share timings so they intercut 1:1.
- Timed beats with "~4s / ~5.5s / ~7s" for an off-screen line and the reply; "HIS BEAT … is a FULL BREATH, never rushed".
- Continuity of business stated as a three-part test ("bowl in sink, stream into bowl, hand in rice — or it is a failed take").
- Register described as intention ("He is keeping himself unremarkable ON PURPOSE") with fences on performed warmth/chill.
- Pasted CS control block at the end (Seedance era, 23 Aug).

### E10. Ambience bed fired for its soundtrack (480p, 30 s) — method exemplar (audio not verifiable here)
- Job `cb6053eb-82a1-48de-9ac3-3d8ee5572720` · Cinema Studio Video 4.0 · folder Sound · 2026-08-25 23:02 · 30 s · 480p · 21:9 · audio True · Elements: none
```text
ONE UNBROKEN SHOT, no cuts, 30 seconds — AMBIENCE BED: THE PACKED MORNING CARRIAGE. This take is fired for its SOUNDTRACK: a steady, loopable bed. THE SCENE NEITHER BEGINS NOR ENDS — it is already running when the shot starts and still running when it ends, the same world at the last second as at the first. A cut, a dissolve or a speed change = failed take.

THE PLACE — no location element; the design is fixed here: a Tokyo commuter train interior at morning rush, rolling between stations, PACKED — a wall of dark coats and bowed heads filling the car, hand-straps swaying in rows, cold fluorescent light, the window a smear of passing dark and daylight. Nobody near the lens, no face large in frame, nobody looks at the camera.

THE SOUND IS THE STAR — a full, layered, true-to-place bed:
NEAR: the carriage body creaking, hand-straps knocking softly, cloth against cloth, a newspaper shifting, slow breathing crowd.
MID: the rolling rumble of the bogies, rail joints ticking underneath in an even rhythm, the electric motor whine rising and easing.
FAR: a muffled, unintelligible announcement swallowed by the car, the hiss of the ventilation, a distant chime from another car.
The train stays ROLLING the whole take — the rhythm of the rails steady and loopable, swelling slightly and easing, arriving nowhere.

No named character appears in this frame. NO FACE IS IN FRAME: every figure is a back, a shoulder, a silhouette or too far to read; nobody comes near the lens and nobody looks at the camera.

very shallow depth of field, a wide-open lens: the near straps and coats sharp, the car falling soft down its length.

THE SHOT IS ALREADY RUNNING WHEN IT STARTS: the car already rolling at speed, the straps already swaying.

THE TAKE IS STILL RUNNING WHEN IT ENDS: the rails still ticking, the car still rolling, mid-journey, mid-movement, going on into the next minute unchanged.

THE PICTURE SERVES THE SOUND: photoreal Japanese live action; AMBIENT HANDHELD, an operator's small unsteadiness, FELT, NOT SEEN; nothing readable is invented on any sign or surface. REAL TIME — no slow motion, no speed ramp.

NO MUSIC anywhere in the bed — no score, no song, no melody bleeding from any radio, speaker or doorway. NOBODY SPEAKS INTELLIGIBLE WORDS: every voice stays murmur and walla, every announcement stays muffled and unintelligible, language never resolving into words.

No subtitles, no captions, no burned-in text.
```
Annotation:
- Picture deliberately cheap: 480p, no Element, "NO FACE IS IN FRAME". The take exists for the generated audio.
- Layered NEAR / MID / FAR sound design written like a mix sheet.
- "THE SCENE NEITHER BEGINS NOR ENDS" + "steady, loopable bed" → usable under any cut of the scene.
- "NOBODY SPEAKS INTELLIGIBLE WORDS: every voice stays murmur and walla" and "NO MUSIC anywhere in the bed" — clean crowd walla for the edit.

### E11. ADR carrier: one clean word (720p, 4 s) — method exemplar
- Job `9c94a668-e261-48b6-b00f-0601b7a31402` · Cinema Studio Video 4.0 · folder Sound · 2026-08-26 09:43 · 4 s · 720p · 21:9 · audio True · Elements: thief-kenji-bag
```text
ONE UNBROKEN SHOT, no cuts, 4 seconds — AN ADR CARRIER: ONE WORD, CAPTURED CLEAN. This take is fired for its SOUNDTRACK — the picture only carries the voice. A cut, a dissolve or a speed change = failed take.

THE PLACE — no location element; the design is fixed here: a dim, plain interior in soft shadow — a bare wall behind him, nothing readable anywhere, nothing moving. THE ROOM IS ACOUSTICALLY DEAD, A LAW: no echo, no room hum, no traffic, no crowd, no weather, no machine — the stillness of a recording booth wearing the look of a dark room.

KENJI: <<<1760e972-5a26-4fe2-a4e9-6836e5290924>>> — a Japanese man of 27, the fitted charcoal coat, close to the lens in three-quarter, his eyes on something low off FRAME-RIGHT — something of his being taken, just out of view.

THE ONE WORD, and the take exists for it: at 1.5s, LOW and SHARP, a half-swallowed protest — the reflex of a man watching his own money hit the ground and refusing to raise his voice: 「おい。」 One syllable, quick, hard at the front and gone — more breath than shout, protest with the lid on. NOTHING OVERLAPS THE WORD, A LAW: no other sound of any kind touches this take — before the word, only his small intake of breath; after it, silence again. A shout, a raised voice, a second word, a repeat, or any sound layered under or over the line = failed take.

DIALOGUE STRUCTURE: the one word lands at 1.5s and is finished by 2s; everything before and after it is wordless, his mouth closed, nothing else spoken and nothing else sounding.

EVERY FACE IN FRAME IS ALIVE: eyes BLINK at uneven intervals, never on a count; his chest breathes; his gaze makes small involuntary shifts around the low point it holds. EYES DO NOT WIDEN — lids LOW and RELAXED. A fixed stare = failed take. CANDID, NOT ANIME — photoreal Japanese live action, underplayed; nobody plays to the lens.

THE PERFORMANCE. HE WANTS it to stop, and he cannot afford to be loud: the word is an objection kept small, half-swallowed the moment it leaves him.

Very shallow depth of field, a wide-open lens: his face sharp, the dim wall falling away soft. AMBIENT HANDHELD — an operator's small unsteadiness, FELT, NOT SEEN. REAL TIME — no slow motion, no speed ramp.

THE SHOT IS ALREADY RUNNING WHEN IT STARTS: his eyes already down on the thing being taken, the breath already drawn.

THE TAKE IS STILL RUNNING WHEN IT ENDS: his jaw set, the stillness holding, mid-breath.

No music. THE SOUND IS ONLY HIM: the one low word and the small breath around it. No subtitles, no captions, no burned-in text.
```
Annotation:
- A 4 s take that exists only to record 「おい。」 in "an ACOUSTICALLY DEAD" room, fired 4× (plus 4× of a quicker variant).
- Exact timing ("lands at 1.5s and is finished by 2s") and "NOTHING OVERLAPS THE WORD, A LAW" give an isolated line to lay over a picture take whose own audio is busy.
- Delivery written as a want: "HE WANTS it to stop, and he cannot afford to be loud".

## Adopt for our pipeline (Seedance 2.5 via Higgsfield; method only)
1. **Write a CROWD block into every shot that has people besides the leads** — never an Element for anonymous extras. It must state: (a) a number ("AT LEAST FORTY …"), (b) the extras' wardrobe palette and gender mix, chosen so nothing competes with the leads' colours, (c) an errand/object for every extra (phone held low with a thumb on it, strap, tray, chopsticks mid-meal, coat on the owner's own chair), (d) the eye-line law with named exceptions ("NOT ONE PAIR OF EYES MEETS ANOTHER … Exceptions: …"), (e) camera-blindness ("Nobody makes room for the lens; nobody aware of any camera"), (f) motion law for moving crowds ("EVERYONE IS MID-STRIDE … both directions at their own speeds"), (g) "behaviour, never expression".
2. **Move extras with a shared physical cause, not with "people walking around":** brake → "the whole crush LEANS AS ONE BODY"; doors → "unlocks toward the doorway as one"; sway → "everyone rides the sway"; an event → "SIX PEOPLE STAND UP AT ONCE". Time the cause ("the CRASH at 1.5s").
3. **Direct attention explicitly in every crowd shot:** where the crowd's eyes go (on the distraction / on their phones), who is allowed to look at whom, and what the crowd does NOT do ("NOT ONE HEAD in the crowd turns"). Define the lead's tempo against the flow ("AT EXACTLY THE FLOW'S SPEED" / "FASTER than every other body" / "THE ONLY BODY NOT MOVING").
4. **Give 2–4 featured extras one visible action each** inside the crowd paragraph or the shot line ("asleep against the pole", "sweeps her patch of pavement, slow even strokes", "unlocking a bicycle"). Anyone plot-relevant becomes an Element with colour separation from the leads, an identifying prop readable at distance, and locked hands/eyes in the prompt ("HIS HANDS NEVER MOVE FROM WHERE THEY ARE").
5. **Max two character Elements per generation**; a pair who are always together can be ONE Element. Tag every attached Element inline in the text (this project: 2,524 attachments, 0 untagged).
6. **Shoot crowds through bodies on a long lens:** "IN EVERY SHOT A NEAR BODY OVERLAPS THE NAMED SUBJECT … A soft shape at the frame edge is NOT enough", Seedance version "FOREGROUND CROSSERS, REQUIRED, AT LEAST TWICE — once early, once late"; "VERY LONG ANAMORPHIC LENS — heavy telephoto compression stacking the crowd into walls of heads; VERY SHALLOW depth of field". Soft extras with real motion beat sharp extras with AI faces.
7. **Paste the life-signs block and the running-take bookends into every prompt, for every face:** "EVERY FACE IN FRAME IS ALIVE: eyes BLINK at uneven intervals, never on a count; chests breathe; gazes shift. EYES DO NOT WIDEN — lids LOW and RELAXED … A fixed stare = failed take." + "THE SHOT IS ALREADY RUNNING WHEN IT STARTS: … / THE TAKE IS STILL RUNNING WHEN IT ENDS: … mid-stride everywhere."
8. **Voices of extras are texture:** "NOBODY SPEAKS ON CAMERA; the only voices are the station's" or "VOICES ARE TEXTURE, never quoted lines"; generate separate walla/ambience beds.
9. **Plan coverage, not sequences:** four setups per 16–20 s generation, ≈2 s used from each; name camera positions (DOOR CAM / BACK CAM …), keep a COMPASS paragraph for screen sides, and make close passes and single-take coverage "mirror the master's clock beat for beat" so cuts land 1:1.
10. **Fire every prompt at least twice** (191 of 396 prompts here were fired exactly twice; batches of 4–6 for hard shots) and pick per setup across siblings.
11. **720p rehearsal pass for dialogue blocking** (geography, heights, hands, wardrobe), then 1080p with the fixes — and keep the 720p takes in the edit pool.
12. **Pickups after the assembly, in numbered folders:** 3–8 s single-purpose shots for missing looks, inserts, POVs and transitions. Do not assume the newest variant is the keeper (53024cad beat its rewrite).
13. **Sound as generated takes:** 30 s ambience beds at the cheapest resolution, layered NEAR/MID/FAR, loopable, no music, no intelligible words; ADR carriers for single clean lines.
14. **Repair seconds, not shots:** re-render only the broken time range of a good take against the right reference (prop image, character sheet, or a frame with the fix marked in red); use Seedance extension ("continue the shot") to lengthen a keeper.
15. **One look across engines in prose:** a fixed look line ("THE STOCK AND THE GLASS: shot on 35mm FILM through ANAMORPHIC lenses — fine live film grain, filmic highlight roll-off, oval out-of-focus highlights, soft frame edges with the center sharpest; photochemical color, never video-clean.") rather than pasted UI parameters.
16. **A/B a hard prompt on two engines before switching** (CS vs Seedance on the same text, 20 Aug), then commit per shot type.

## Proposed skill changes (→ LESSONS.md as "proposed")
- **New module `seedance-crowd.md`:** the CROWD block template from Adopt 1 + shared-cause motion (2) + attention line (3) + featured-extra vignettes (4) + occlusion/long-lens law (6) + walla rule (8), with E1–E7 above as reference prompts. Checklist item: "Does every crowd shot say where the crowd's eyes go?"
- **`characters.md`:** add a "featured extra" entry type: one-image Element, colour-separation note against each lead, an identifying prop, locked hands/eye-line text, closing sentence "Take identity and wardrobe from this element; take the beat's staging, hands and eyeline from the shot's prompt." Rule: ≤2 character Elements per generation.
- **`style.md`:** make the life-signs block, the running-take bookends, "CANDID, NOT ANIME … nobody plays to the lens", "AMPLITUDE CAP … FELT, NOT SEEN" and a prose look line mandatory boilerplate; ban pasted UI-parameter blocks in Seedance prompts.
- **`seedance-dialogue.md`:** add THE COMPASS paragraph, "one speaker per shot; each line lands in the FIRST THIRD, the rest its physical beat; never more than one second of stillness", height law, and "single-take coverage mirrors the master's clock".
- **`locations.md`:** location Elements "GEOMETRY, MATERIALS, LIGHT only; its own wide view never appears"; places without an Element fixed in a "THE PLACE — no location element; the design is fixed here:" paragraph.
- **`sfx.md`:** add the AMBIENCE BED and ADR CARRIER templates (E10, E11).
- **Pipeline / folders:** `Scene N` → `Scene N 720p` (rehearsal) → `Scene N vK` (redo) → `Pickups N` (post-assembly) → `Sound`; every prompt fired ≥2×; repair-by-segment step before any full re-roll.

