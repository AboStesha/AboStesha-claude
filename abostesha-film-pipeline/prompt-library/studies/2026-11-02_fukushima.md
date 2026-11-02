# Study: Fukushima — @aist (https://higgsfield.ai/@aist/projects/fukushima · canvas https://higgsfield.ai/generate?projectId=cbb75561-f472-45c8-9317-d8b6819b00f2) — 2026-11-02

- Source type: Higgsfield project. The film is published and the project is open source with prompts and canvas visible. Higgsfield Global Film Festival entry, submitted 2026-09-14 21:16 UTC.
- Logline (from the brief): "At Fukushima Daiichi, a veteran engineer believes the plant can withstand the disaster — until the catastrophe proves otherwise."
- Studied for AboStesha (Seedance 2.5 film for the 1 Billion Followers Summit AI Film Award). **Method only.** Do not reuse its characters, uniforms, plant, story beats or text.
- Data: the 3,104 generation jobs (compact.jsonl), items.json, folders, uploads, and the 640-px film. I matched the film to clips by streaming 2-fps thumbnails of 164 candidate clips and running a per-frame correlation against the film at 4 fps. I could not hear the audio; every sound note below comes from the prompts and the uploaded file names.

## What it achieves
1. **A whole-film "one take".** Over about 190 s there are only 4–5 hard cuts. Every scene is a 10–30 s Seedance take shot as one continuous camera move. On the last day the takes were stitched with frame-locked Seedance in-fills ("black gap fills") so that the camera seems never to stop: seabed, inside the coffee, up out of the cup, face, whip-pan, corridor, reflection, helmet on while running, stairs, door, parking lot, into the car, under water, and so on.
2. **Documentary realism with one coherent look.** Every location still carries the same vintage-wide-prime lens character (barrel distortion plus lifted blacks), 35 mm grain, cold overcast light, sage-green/teal industrial palette, and red as the only accent colour.
3. **Close, physical acting.** Faces fill 70–100 % of the frame, with wet skin, glasses and breathing. Extras do independent tasks and never look at the lead. Emotion is held back (fear "not theatrical").
4. **Exact prop continuity.** One temperature gauge holds a defined state over time (rise to 800 °C, then fall to green), one helmet, one key ring and one red kei car follow the story from the parking lot through the flood to the window reveal.

## Watch notes (film640.mp4, 2.33:1, 24 fps, 203.6 s; the last ≈10 s is the Higgsfield festival outro, not the film)
| Film time | Content | Shot design |
|---|---|---|
| 0:00–0:02 | "Based on true events" card | black |
| 0:03–0:09 | Seabed, oarfish, quake heaves the sediment, the camera is lifted up through the murk; title "Fukushima, Japan — March 11, 2011" over the murk | continuous rising crane, underwater |
| 0:09–0:12 | Murk turns into black coffee, the camera rises out of the cup | Transition in-fill |
| 0:12–0:35 | Control room: top-down cup → hand → drinking ECU → orders ("Start the emergency diesels. Maintain cooling.") → gauge rises → blackout → "It'll come down." → gauge falls to green → "Knew I could count on you." → "Tsunami!" | one handheld take with violent quake shake; the gauge moment is a repaired insert |
| 0:33–0:37 | Fast whip-pan right from his face to the staff | in-fill of 7–24 frames |
| 0:36–0:50 | Run out of the room into the windowed corridor, tsunami over the breakwater, focus pull onto his reflection in the glass, helmet put on while running | take plus 2 in-fills (reflection focus pull, helmet) |
| 0:50–1:13 | Collision with the young woman, keys drop; 5 lines of Japanese dialogue; he lets her go; she runs down the stairs | ECU-to-ECU arcs, never a two-shot |
| 1:12–1:18 | She pushes the exit door and runs out into the parking lot | in-fill |
| 1:13–1:50 | Run to the red car, keys; optical zoom to the engineer behind the 2nd-floor glass; in the car: helmet off, seatbelt, ignition; the wave hits the windscreen; car flips; underwater struggle | take plus a "video continuation" take |
| 1:50–2:01 | Basement: out of the water, jammed red valve wheel, flood rises, falls back into the water | take (moving-mask and stair in-fills were tried; not found in the film) |
| 2:02–2:30 | Wet engineer with a red flashlight; door; corridor run; cracked windows; the red car crushed against the next building, seen in his glasses then through the glass | end of the Sc_05 take + 2 in-fills (door/corner, side-to-front arc) + Sc_06 take |
| 2:29–2:36 | He turns to a door on the left, opens it and enters the control room | in-fill |
| 2:33–3:00 | Control room: camera orbit, staff arguing, "Switch to emergency water injection!" → total blackout → flashlight → "Emergency power?" "Status?" "It's down." → slow push-in | **two takes spliced at the blackout** |
| 3:02–3:13 | Reactor core: boiling water, the waterline drops and the fuel assemblies are uncovered | image-to-video, slow pull-back |

- Look: 2.33:1. Cool desaturated grey-green and teal interiors, steel-blue overcast exteriors. Warm orange annunciator lights are the only warm colour. **Red is reserved for story objects** (helmet stripe, kei car, flashlight, valve wheel, beacons, gauge glow). Shallow depth of field with dense bokeh, mild barrel distortion, lifted milky blacks, fine grain. Burned-in English subtitles in a small monospace face; small sans-serif title cards.
- Shot sizes: about 70 % close-up or extreme close-up (faces, hands, gauge, keys), about 20 % over-shoulder or follow, and wides only to establish (parking lot, reactor).
- Pacing: one continuous camera with real handheld inertia. Energy comes from camera speed and shake, not from cutting. Darkness and blackouts serve as the only "edit points".
- Sound (not heard; from prompts and uploads): Seedance native sync sound (generate_audio on for all 252 jobs) with Japanese dialogue, and "No music / SFX only" in most takes. Music and design were added in the edit from the uploaded tracks "Silent Tsunami", "Deep Oceanic Rumble", "Seawall Pressure Wave", "Unseen Pressure", "Subterranean Tremor", "Hard Cut", "Tsunami Warning — Irregular Pulse" and "Final.mp3".

## Method step by step
1. **Team split across 3 accounts in one workspace**: an asset artist (`transformingbanana_xxl`, 2,663 image jobs), a Seedance animator writing Chinese prompts (`wanderingmilk_mega`, 156 Seedance jobs: Sc_01–03, 05, 06, all Transitions and Cleanup), and the director/owner writing English prompts (`aist`, 96 Seedance jobs: Sc_04, Sc_07). Folders: `characters/`, `locations/<place>`, `props/<item>`, `poster`, `test`, `Animation/Sc_0N`, `Animation/Transition`, `Animation/Cleanup`, `Music`.
2. **Assets first.** 09-02 → 09-09 was images only; image work then continued to 09-12 alongside the first takes (Seedance starts 09-10 16:48). 2,849 image jobs, about 9,000 images (Seedream batches of 4).
3. **Costume canon before the face.** A turnaround uniform sheet made without any reference, with a HEX colour map (#7C99D6 / #3A57B0), then emblem, helmet and pocket detail edits. Elements were removed with painted colour zones ("удали красную зону, остально сохрани" — "remove the red zone, keep the rest").
4. **Cast the face inside the real environment.** "Create a highly photorealistic wide documentary photograph of the central control room … THE CENTRAL FIGURE … faces the camera". Then "Use Image A as the only character reference" builds a grey-studio front/back sheet, then a crop/zoom to a close-up, then a Nano Banana skin-realism pass, then a 3-panel sheet (front | back | face). State variants were made as separate elements (`char_engineer-final` dry, `char_engineer-wet`).
5. **Locations are empty 21:9 plates.** Iterated with long "35mm film still, fine visible grain …" prompts and then with targeted `EDIT — take Image 1 as the base and change ONLY …` passes. Bad areas were masked in an external editor (magenta fill, coloured zones) and re-uploaded. Finally a **lens pass** gave every plate the same optical character.
6. **Props are product shots on mid-grey** (helmet front/back, flashlight 2 views, keys, car in 3 views plus an empty interior). Props with changing states get one image per state (gauge `prop_temp_test_01` green / `_02` yellow up to 800 °C).
7. **Approved images become named Reference Elements** (34 in total: `char_*`, `loc_*`, `prop_*`), each with one image and a category (character / environment / prop), and are called inside Seedance prompts by `<<<element-uuid>>>`.
8. **Days 10–14, Seedance scene takes.** One folder per scene. Each take is 9–30 s (most 22–30 s), 21:9, 1080p, audio on, with 4–6 elements. 2–4 takes per submit; when a take fails, the prompt is edited (usually by adding or moving one block) and resubmitted. Sc_07 was iterated at 720p first (31 takes) and only moved to 1080p once the prompt worked.
9. **Continuity between takes:** a hand-picked frame of an earlier take is screenshotted and uploaded, then used as `<<<image_1>>>` "opening frame and composition basis" or as `<<<image_N>>>` keyframe for a given timecode. "Video continuation" takes keep `<<<video_1>>>` as 00:00–00:04 and generate the rest.
10. **Final day (09-14), stitch and repair.** The director edits the takes on a timeline, cuts out a 4–12 s window around each join, **replaces the join with black frames**, exports it and sends it to Seedance (`video_edit`, or `default` with `<<<video_1>>>`) with a frame-numbered prompt: "keep frames 1–48 and 97–144 identical, generate only 49–96". 22 join clips, 1–4 takes each; 8 in-fills are confirmed in the final film.
11. **Repairs:** a black mask is painted over a wrong prop (the gauge) in the clip, and `video_edit` restores it from `<<<image_1..3>>>` state references. Genjutsu Object Swap was tried 3 times for the same fix.
12. **Edit:** best halves of different takes are joined at blackouts (Sc_07), music and SFX are added in the NLE, plus burned-in subtitles. There are no upscale jobs on Higgsfield. The master is 2206×946, so finishing and scaling happened outside Higgsfield (tool unknown).

## Asset method (characters / locations / props)
- **Character sheet format (final):** 3 panels on flat mid-grey (full-body front | full-body back | head-and-chest close-up), neutral even light, no props, no location. Wet and dry versions are separate elements.
- **Identity locking in prompts:** "Preserve her exact identity and appearance: – same … – same …" lists. Prompts say "the sleeve emblem stays on the LEFT arm in both views" and "CRITICAL: hands must NOT be clasped behind the back", and the front/back figures use "anatomical left/right".
- **Costume:** HEX colour map, garment construction (yoke, panels, pocket count, snaps, zip), and "identical on both figures, no drift".
- **Skin pass (Nano Banana, Russian, about 500 chars):** subsurface scattering, vellus hair, barely visible pores, oily T-zone, wet eye corners, uneven lashes.
- **Locations:** each starts as "35mm film still, fine visible grain. <place>, <year>. <time, weather>. No people." Then composition blocks (camera height in metres, lens mm, which wall is frontal, what is in which third), materials and fixtures with exact colours, damage state, and a long AVOID list. Story geography is written into the plate (door under a canopy on the left, red car in the 3rd bay facing the sea).
- **Reverse shots and state changes are made as edits of the approved plate** ("the REVERSE SHOT of Image 1 … REFERENCE ROLES: Image 1 = the corridor … Image 2 = ONLY the quay layout … Image 3 = the red car — the ONLY source for the car").
- **Lens pass, the style-unifying step (154 jobs):** "Edit the image: apply the optical character of a fast wide vintage prime … Do not change the lighting … uncorrected barrel distortion … VEILING FLARE — a lift in the blacks, not mist". It is applied to parking lot, corridor, control room and basement plates, so every plate shares the same optics before it becomes a Seedance element.
- **Blocking sketch:** an approved photoreal frame was converted into a loose pencil storyboard (Seedream). The sketch was then used as an element with the instruction "pose and spatial reference only; its lines, strokes, paper texture must not enter the image". This gives Seedance the pose without anchoring its first frame or lighting.
- **Posters:** 231 jobs (Seedream) with `IMAGE 1 = the ENGINEER … IMAGE 2 = his HARD HAT` role headers and detailed emotion and light direction.

## Prompt structure — images
- Length: median 3,509 chars for Seedream 5 Pro, 2,372 for GPT Image 2, 2,393 for GPT Image 2.5, 1,583 for Nano Banana. Prompts grow with iteration (corridor plate 4,968 → 16,165 chars; parking lot 4,678 → 15,298).
- Block order for a generated plate: `<medium + grain> → <place, year, time, weather, state> → CAMERA AND COMPOSITION → <named zones: THE BUILDING (LEFT, FRONTAL) …> → materials/colours → damage → DEPTH OF FIELD → AVOID / No text, no watermark`.
- Edits: `EDIT — take Image 1 as the base and change ONLY <one thing>. Preserve everything else exactly: <list> … IN ITS PLACE, ADD … INTEGRATION: …`. In 2,849 image prompts: "exactly" appears in 1,650, "same" in 1,749, "watermark" in 1,324, "documentary" in 1,041 and "overcast" in 960.
- Reference roles are explicit (`IMAGE 1 =`, `Image A`, `REFERENCE ROLES:`), including what NOT to take from each image ("From Image 3 do NOT take the pose, the studio background …").
- Model choice (counts): Seedream 5 Pro is the workhorse for plates, edits, lens passes and posters (2,031). GPT Image 2 / 2.5 handle product shots, text-sensitive edits, the reactor, the oarfish and car work (721; 2.5 at quality max). Nano Banana handles the skin pass and some sheet reframes (96).

## Prompt structure — Seedance scene takes (159 scene jobs, median 4,369 chars)
Chinese prompts (`wanderingmilk_mega`) follow this order:
1. **Header contract:** genre and format, single continuous take, no cuts. ("写实灾难电影，21:9宽银幕，整段由同一台摄影机以真实连续的长镜头完成。没有剪辑、隐藏切口、插入镜头、时间跳跃或瞬移。" — "Realistic disaster film, 21:9 widescreen, the whole piece is one real continuous long take by the same camera. No edits, hidden cuts, inserts, time jumps or teleporting.") When a persistent behaviour keeps dropping out mid-take, it is (a) moved to line 1 (Sc_02 v5 = v1 with "从场景开始到结束…始终持续、反复地闪烁", "from the start of the scene to the end … keeps flickering, again and again", prepended) and, in the take actually used (Sc_02 v4, e9b7a476), (b) **repeated at the start of every beat paragraph**: "灯光闪烁、闪烁、持续闪烁。摄影机持续震动、持续震动。" ("The lights flicker, flicker, keep flickering. The camera keeps shaking, keeps shaking."). That v4 also gives the whip-turn as an angle ("向右急转约100度", "whip right about 100 degrees") and gives the gauge as "first clearly seen state = <<<ref A>>>, then the transition to <<<ref B>>>".
2. **Reference block (参考资产 / 参考职责):** one line per element, `<<<uuid>>>` plus what it controls *and what it must not do* ("…是室外环境和空间地理的唯一依据" — "is the only basis for the exterior and geography"; "不作为必须逐像素复现的首帧" — "not a first frame to reproduce pixel by pixel"; "不用它的全身展示构图" — "don't use its full-body sheet composition"). State props are given as two images "representing one object at different times; only one such gauge exists".
3. **Story and emotion context:** who wants what, written as inner state, plus the explicit limit ("这是她的恐惧，不是影片确认家人已经死亡" — "this is her fear, not the film confirming the family died").
4. **The one camera route:** "主摄影路线只有一条：从咖啡中上升、俯拍杯子、仰向面部、…最后向右急转" — "there is only one camera route: rise out of the coffee, top-down on the cup, tilt up to the face, … finally whip right". Then each leg in its own paragraph: camera move → what enters frame → actor action → line of dialogue → focus target. Directions are given in screen terms (left/right of frame) and stay consistent across scenes.
5. **Physics and continuity rules:** quake shake, "visible even with the sound off"; the same door, same key, same car orientation; helmet on or off states; wet clothes don't dry; "no dissolve, no morph".
6. **Extras:** every background worker has a task, all move in one physical direction, "nobody looks at the lead" (153 of 159 scene prompts carry "背景/background" instructions).
7. **Optics:** about 50 mm anamorphic, shallow DOF, explicit focus targets ("焦点/近侧眼睛", "focus / near-side eye", in 64 of 159), no wide-angle face distortion, "real skin, wet fabric".
8. **Sound:** a list of diegetic sources, Japanese lines in quotes "每句各说一次" ("each said once"), "No music / 没有音乐" (94 of 159), no whoosh.

English prompts (`aist`, Sc_07 at about 12k chars) use the same content as a screenplay: `Serious grounded disaster drama … No cuts. The engineer is <<<el>>> … NO MUSIC, SFX ONLY`, then timecoded blocks `00:00 – 00:10:` with CAPS for the main event, NO-lists after each camera instruction ("NO camera spin. NO panoramic rotation…"), dialogue as `ENGINEER:` / `「…」`, and `<<<image_N>>>` placed at the timecode where that frame must occur ("the last frame before blackout is <<<image_2>>>").
- Dialogue: Japanese only, in 「」 or “”, attributed to a named role, with delivery notes in brackets. Subtitles were added in post.
- Settings in all 252 Seedance jobs: generate_audio on, draft off, multi_shots off, extension off, genre auto, speedramp auto, bitrate high. Default mode is always 21:9.

## Transitions — the black-gap in-fill (54 jobs, median 1,037 chars, all on 09-14)
- Build: in the NLE, take the last ~2 s of clip A and the first ~2 s of clip B, put black (or a moving black matte) between them, and export 4–12 s at 24 fps.
- Prompt template (stable from 12:37 on, after 9 earlier wordings that day): `以<<<video_1>>>为唯一视频依据，只填补原视频2.000秒至4.000秒之间的黑色视频占位段。黑色是待替换区域，不是剧情中的停电或转场。` ("Using <<<video_1>>> as the only video basis, fill only the black placeholder between 2.000 s and 4.000 s. The black is the area to replace, not a story blackout or a transition.") It continues with `最高优先级：…第1—48帧和第97—144帧必须与输入逐帧完全一致…只生成第49—96帧` ("Top priority: frames 1–48 and 97–144 must be frame-identical to the input … generate only frames 49–96"), then the new action with sub-timings (e.g. "约2.000—2.650秒 … 约2.650—3.250秒" — "about 2.000–2.650 s … about 2.650–3.250 s"), then start and end matching ("起点匹配第48帧…终点自然接入第97帧…不把边界帧复制成停格" — "start matches frame 48 … end flows into frame 97 … don't copy the boundary frame into a freeze"), then forbidden tricks ("不使用黑场、叠化、形变转场、跳切、瞬移" — "no black, dissolve, morph transition, jump cut or teleport"), then keeping the original audio ("不增加…whoosh" — "add no whoosh").
- The wording evolved to block the failure modes that the later prompts name ("不能原样输出黑色视频", "do not output the black video as is"; "不用淡入、叠化", "no fade-in or dissolve"; "气泡不变成杯子", "the bubbles do not turn into the cup"): "black is a placeholder, not story darkness", frame numbers rather than seconds only, "the boundary frame must be the original input frame, not a similar reconstruction", and "every frame of 49–96 must show visible content".
- Joins confirmed in the film: coffee murk → cup; face → whip-pan to staff; window → focus pull onto reflection; running → helmet on and strap clipped; stairwell → door → parking lot; shoulder through door → corner; side → front arc while running; turn into the left door → control room. Tried but not used: a two-gap helmet clip, the flood moving-mask and stair fills, and the door → trip → drop flashlight version.
- Mode: the first attempts used `default` with video reference; later ones used `video_edit` (41 of 54). Every in-fill was 1080p.

## Cleanup and repairs (39 jobs)
- Gauge state wrong in Sc_02: paint a black mask over the gauge in the clip, then `video_edit` with `<<<image_1>>>` = correct first frame, `<<<image_2>>>` = gauge housing and scale, `<<<image_3>>>` = gauge in darkness. The prompt ends: "图片仅用作视觉参考，不插入静帧或转场" ("images are visual reference only; don't insert stills or transitions"). Also used: an English `Edit <<<video_1>>> using <<<image_1>>> as the exact reference … STARTING STATE … FALLING ACTION … FINAL STATE` (7 jobs, 720p) and a Genjutsu Object Swap (3 jobs).
- Takes from different versions were joined at a natural black (Sc_07 blackout).

## Consistency — how the look and the people stay the same
1. **One element per identity or state, reused everywhere.** `prop_helmet` appears in 162 jobs (122 Seedance), `char_engineer-final` in 107, `prop_temp_test_02` in 84, `char_engineer-wet` in 63, `char_girl` in 35. The same UUIDs appear in images (posters, plates) and in video.
2. **Everything passes through the lens pass and "35mm film still, fine visible grain"** (749 prompts mention 35mm, 508 film grain, 960 overcast), so plates arrive at Seedance with identical optics, and the scene prompts repeat "克制的变形宽银幕镜头特征 / 浅景深 / 细腻颗粒" ("restrained anamorphic character / shallow DOF / fine grain").
3. **Light is designed once.** Cold overcast daylight plus fluorescents, and red practicals as the only saturated colour. Scene prompts say "保持参考图的低亮度与深阴影" ("keep the reference's low brightness and deep shadows") and "低饱和冷灰蓝调" ("low-saturation cold grey-blue").
4. **Reference chain:** uploaded real or edited images (`media_input`, 2,100 references) → Seedream/GPT edits (`image_job` 203, `openai_hazel_job` 201) → re-uploaded finals → Reference Elements → Seedance. Frames of Seedance takes are snapshotted (5 uploads, e.g. `…6a5eced4.mp4_snapshot_00.12.824.jpg`) and fed back as `<<<image_N>>>` keyframes for the next version.
5. **One camera language for the whole film:** handheld with inertia (141 of 159 scene prompts), face-dominant framing, no cuts. Screen-direction rules are restated wherever direction matters (window on the left when moving forward, on the right when following).
6. **Repeated control phrases** act as the house style across scenes: "不看镜头" ("doesn't look at camera"), "没有夸张" ("no exaggeration"), "不因…而变稳" ("doesn't steady because of …"), "震动在关闭声音观看时也必须清楚可见" ("the shake must be clearly visible even with the sound off"), "No music", "无剪辑" ("no cuts").

## Tools used and how much
| Purpose | Tool (Higgsfield) | Jobs | Credits |
|---|---|---|---|
| Plates, edits, lens passes, posters, sketch | Seedream 5.0 Pro (2k, batch 4) | 2,031 | 6,093 |
| Product shots, precise edits, reactor, car | GPT Image 2.0 (high) / 2.5 (max) | 430 / 291 | 3,077.5 / 4,017 |
| Skin realism, sheet reframes | Nano Banana Pro (nano_banana_2) | 96 | 192 |
| All video: scene takes, in-fills, repairs | Seedance 2.5 (1080p 208, 720p 44) | 252 | 34,499 (71.9 %) |
| Prop fix in video | Genjutsu Object Swap | 3 | 135 |
| Other | Seedream 4.5 | 1 | 0 |
| Blocking or motion | No motion-transfer or camera-control tools. Blocking came from prose camera routes, a pencil sketch element, screenshotted frames as image_1, and in-fill joins | — | — |
| Upscale, cleanup, sound | No Higgsfield upscale. External NLE for black gaps, masks and subtitles; external music files (generator unknown) | — | — |

## Numbers
- Jobs: 3,104 (publication stack: Seedream 5.0 Pro 2,031 jobs / 6,093.0 cr; GPT Image 2.0 430 jobs / 3,077.5 cr; GPT Image 2.5 291 jobs / 4,017.0 cr; Seedance 2.5 252 jobs / 34,499.3 cr; Nano Banana Pro 96 jobs / 192.0 cr; Higgsfield Genjutsu - Object Swap 3 jobs / 135.0 cr; Seedream 4.5 1 jobs / 0.0 cr). Total 48,013.81 credits, of which Seedance is 71.9 %. Project size 26.1 GB. Favourites 0, comments 0.
- Image jobs 2,849, about 9,007 images (Seedream batch 4 in 1,928 of 2,031 jobs). Jobs with ≥1 input image: 1,934 (67.9 %).
- Image jobs by top folder: locations 1,574, characters 488, props 355, poster 231, test 116, ROOT 78, Animation 7. Largest sub-folders: locations/parking 368, characters/engineer1 342, locations/control room 314, locations/BASEMENT 311, locations/corridor 310, poster 231, props/car 188, test 116.
- seedream_v5_pro: 2031 jobs; prompt chars median 3,509 (max 16,165); aspect 16:9 1416, 21:9 485, 9:16 106, auto 18.
- gpt_image_2: 430 jobs; prompt chars median 2,372 (max 15,133); aspect 16:9 341, 9:16 53, 21:9 33, 4:3 2; quality high 381, medium 49.
- gpt_image_2_5: 291 jobs; prompt chars median 2,393 (max 9,915); aspect 21:9 131, 16:9 125, 9:16 22, 1:1 8; quality max 269, high 22.
- nano_banana_2: 96 jobs; prompt chars median 1,583 (max 12,739); aspect 16:9 75, 21:9 12, 9:16 8, 3:4 1.
- Short colour-zone edit prompts (<80 chars, e.g. 'удали красную зону, остально сохрани' — 'remove the red zone, keep the rest'): 165. Lens-pass edits ('Edit the image: apply the optical character …'): 154. Magenta-mask fills: 26.
- Seedance 2.5: 252 jobs, 4,156 s generated (scene takes 159 jobs / 3,592 s; transitions 54 / 335 s; cleanup and repair 39 / 229 s) for a film of about 190 s, so about 22:1 generated to used.
- Seedance modes: default 186, video_edit 66; resolution 1080p 208, 720p 44 (720p by folder: Sc_07 31, Animation 7, ROOT 4, Sc_04 2); aspect 21:9 186, 16:9 66 (video_edit jobs are sent as 16:9 but the output follows the 21:9 input).
- Scene-take durations: 28s ×26, 24s ×24, 30s ×23, 10s ×18, 17s ×14, 22s ×13, 23s ×12, 27s ×8, 25s ×6, 21s ×4. Transition durations: 4s ×8, 5s ×19, 6s ×15, 7s ×3, 10s ×4, 11s ×3, 12s ×2.
- All 252 Seedance jobs: generate_audio=True, draft=False, multi_shots=False, extension_mode=None, genre=auto, speedramp=auto, bitrate=high, seed=None.
- Reference Elements: 34 distinct. Elements per scene take: 1: 21, 2: 2, 3: 14, 4: 48, 5: 11, 6: 63. Seedance media roles: media_input 131, video_input 99, openai_hazel_job 64, image_job 7.
- Seedance prompt language: zh 181, mixed 49, en 22. Scene-take prompt chars median 4,369 (min 2,329, max 12,173); transitions median 1,036.
- Takes / distinct prompt versions per scene folder: ROOT 4/1, Sc_01 8/4, Sc_02 14/5, Sc_03/Sc_03_b_01 16/3, Sc_03/Sc_03_b_02 6/3, Sc_04 25/12, Sc_05 12/4, Sc_06 14/6, Sc_07 60/12.
- Transition in-fills: 22 distinct join clips (video inputs), 54 takes, all made on 2026-09-14 between 06:45 and 18:31; 41 of 54 in video_edit mode.
- Timeline: image jobs per day 09-02 60, 09-03 260, 09-04 312, 09-07 153, 09-08 294, 09-09 314, 09-10 504, 09-11 737, 09-12 184, 09-13 10, 09-14 21; Seedance per day 09-10 2, 09-11 42, 09-13 35, 09-14 173. Final submission 09-14 21:16 UTC.
- Uploads in project: 14 (9 audio tracks in Music, 5 jpg snapshots of Seedance takes). Reference ids that resolve to no job or upload in this project (images re-uploaded from the team's other accounts): 2,100 media_input references.
- Film: 2.33:1 at 24 fps, master 2206×946, 203.6 s including about 10 s of festival outro. Hard cuts in the film proper (frame-difference peaks): 14.6 s (coffee in-fill → Sc_02 top-down cup), 92.2 s (car → continuation take), 122.4 s (basement → flashlight), 164.3 s (blackout splice), 182.0 s (black → reactor). Everything else is a continuous camera.

## Final shots and their prompts
| Film | Shot | Job (id prefix) | Folder, version, settings | Confidence | Evidence |
|---|---|---|---|---|---|
| 0:03–0:10 | Seabed, oarfish, quake, rise through the murk | bab6f436 | Sc_01 v3 (09-11 08:28), 10 s 1080p 21:9, el loc_seabed-fish1 | High | 12–16 consecutive frames on a linear offset, score 0.92–0.98; the other three versions are ≤0.71 |
| 0:09–0:15 | In-fill: the camera rises out of the coffee | bb1323e0 | Transition 09-14 07:36 video_edit 6 s (gap frames 49–96) | High | gap-frame score 0.936 (siblings 0.67–0.79) |
| 0:12–0:34 | Control room single take (cup → face → orders → gauge → "Tsunami!") | e9b7a476 | Sc_02 v4 (09-11 06:38), 24 s 1080p, 4 elements | Medium | first and last seconds match on one offset (0.64–0.72); frames checked by eye; film is punched in and reframed and the gauge part replaced |
| 0:24–0:30 | Gauge insert (yellow to 800 °C → blackout → falls to green) | 69db3315 / aef967d9 / 06cb9386 | Cleanup 09-14 10:43–11:16, 5 s 1080p, black-masked gauge + image_1..3 | Low–medium | gauge look matches by eye; dark frames make correlation unreliable |
| 0:32.5–0:37 | In-fill: whip-pan right from his face to the staff | 3a30c6fd | Transition 09-14 12:18 video_edit 5 s | Medium | first frame 0.98; gap 0.45 vs siblings 0.14–0.35 (motion blur) |
| 0:35–0:43 | Run out of the control room into the windowed corridor, tsunami | b467eb11 | Sc_03_b_01 v3 (09-11 07:35 prompt, take 08:17), 25 s 1080p | Medium-high | diagonal 0.73 vs next 0.35; run 0.934 at 40–42 s |
| 0:43–0:48 | In-fill: focus pull onto his reflection, staff run past | 112f9966 (or e5d351c5) | Transition 09-14 12:37 video_edit 5 s | Medium | whole-clip 0.941; e5d351c5, f91bf954 and dd63c92f all score 0.92–0.95 in the gap |
| 0:46.75–0:52.75 | In-fill: helmet raised, put on and strap clipped while running | 2f9b8601 | Transition 09-14 13:28 video_edit 6 s | Medium | gap 0.82 vs 0.63; the earlier two-gap version scores 0.44 (not used) |
| 0:48.75–1:13 | Collision, keys, dialogue, he lets her go, she runs down the stairs | b1d3bdf6 | Sc_03_b_02 v1 (09-11 17:36), 27 s 1080p, 5 elements + image_1 screenshot | High | 25-frame run, score 0.989 |
| 1:12.75–1:18.75 | In-fill: she pushes the exit door and runs into the parking lot | d9398bb4 | Transition 09-14 18:31 video_edit 6 s (the last job of the project) | High | gap 0.961 vs 0.71–0.74 |
| 1:13–1:32 | Parking lot, keys, zoom to the engineer at the window, into the car, helmet off, seatbelt, ignition, the wave hits | f5499d1f | Sc_04 prompt v8 (09-14 12:59) resubmitted at **720p** 14:24, 23 s, 6 elements incl. pencil sketch | Medium-high | diagonal 0.69 vs 0.30; run 0.981 at 84 s |
| 1:32–1:50 | Continuation: car flipped, dragged, she is trapped under water | 8bd8105a | Sc_04 09-14 16:33, 20 s 1080p, video_1 = last 3–4 s of the previous take | High | diagonal 0.889 vs 0.40 |
| 1:50–2:06 | Basement: out of the water, jammed valve, flood, falls in, flashlight | 7d1a9400 | Sc_05 v1 (09-13 08:36 prompt, take 08:50), 22 s 1080p | Medium-high | diagonal 0.635 vs 0.24; 0.86 at 124 s |
| 2:07–2:12 | In-fill: shoulder through the door, round the corner, camera to front | 163d0dcc | Transition 09-14 15:40 video_edit 11 s | Low–medium | gap 0.62 vs ≤0.39; the other door variants score lower |
| 2:12–2:18 | In-fill: camera arcs from side to front while he runs | b8fedddb (or a2ed1f11) | Transition 09-14 16:48 video_edit 6 s | Medium | gap 0.74 vs 0.69 |
| 2:16–2:30 | Windowed corridor: red car in his glasses → through the cracked glass → car crushed → he runs on, back fills the frame | 6acdf2a9 | Sc_06 v6 (09-13 15:25), 17 s 1080p, el char_engineer-wet, loc_cor_car_03, prop_helmet | Medium-high | run 0.968 at 145.5–149 s; diagonal 0.80 |
| 2:29–2:36 | In-fill: he turns to the left door, opens it, enters the control room | 6a4e799f | Transition 09-14 17:54 video_edit 7 s | High | gap 0.938 vs 0.37 |
| 2:34–2:44 | Control room orbit, staff arguing, "Switch to emergency water injection!" | 66ec4fac | Sc_07 v6 (09-14 14:25) **720p**, 28 s; clip 0–10 s used | High | linear match clip 0–10 → film 154–164, 0.80–0.99 |
| 2:44–3:01 | Blackout → flashlight → "Emergency power?" "Status?" "It's down." → push-in | cca572b7 | Sc_07 v8 (09-14 15:19) 1080p, 28 s; clip 11–27.5 s used | High | 43 of 64 frames match on offset 153 s, median 0.957 |
| 3:02–3:13 | Reactor: waterline drops, fuel assemblies uncovered | 449cfb48 | Sc_07 09-14 16:39, 12 s 1080p, el loc_r2 (image-to-video "Animate the existing image") | High | 16-frame run, score 0.968 |

- Not found in the film: the two-gap helmet in-fill (ae3f588c/23dd7d30), the flood moving-mask and stair in-fills (723472e1…, d9c21005…; ≤0.27), and the 'back fills frame' variants (1c6df0e5, 3d61801d, a530d112, ad1b9214, 051b8c4e, f0c1b7c1; ≤0.42). They were superseded by 2f9b8601 and 6a4e799f.
- Method used: 2-fps thumbnails of 164 Seedance clips (all scene, transition, cleanup and the relevant Sc_07 takes) correlated with film frames at 4 fps; a clip counts as final when consecutive frames hold one constant time offset. Where the edit punches in or the frames are dark, scores drop, hence the confidence column.
- **Pattern in the finals:** the takes used were often *not* the newest version (Sc_02 v4 of 5; Sc_03_b_02 v1 of 3; Sc_05 v1 of 4). Two of the finals are 720p (Sc_04, the Sc_07 lit half). Sc_07 is spliced from two prompt versions at the blackout.

### Prompt heads of the final takes (verbatim; full or longer excerpts under Exemplars)

**bb1323e0** (Transition, 736 chars):
```text
补全<<<video_1>>>的2—4秒，让观众明确感觉摄影机原本浸在杯内咖啡中，然后从液体里直接冲出，升到杯口上方。最重要的是实际拍出摄影机穿越液面的瞬间，而不只是显示一个越来越完整的杯子。

2—3秒：摄影机完全浸没在咖啡内部，褐色液体包围整个视野。细小气泡在镜头近处翻涌上升，有些贴近镜头掠过，大小与速度因距离不同而变化。摄影机沿原运动方向向上升起，镜头始终朝下，逐渐超过气泡。接着镜头真实穿出咖啡表面：液体与空气的交界在镜头前掠过，附着的薄液膜产生短暂、局部的折射扭曲，随即滑离视野。这个过程连续可见，没有黑屏或切镜。薄液膜退开的同时，下方同一片咖啡表面立即变得清楚，刚才的气泡到达液面并破裂，留下细小涟漪。摄影机从液体包围中进入空气，液面留在摄影机下方。

3—4秒：摄影机不停地继续垂直升高，保持向下俯视，逐渐与下方咖啡表面拉开距离。白瓷杯内壁与杯沿从画面外围自然进入，揭示刚才的全部液体与气泡都在这只杯子里面。第4秒准确接入原 […]
```

**3a30c6fd** (Transition, 339 chars):
```text
补全<<<video_1>>>中缺失的摄影机运动，让整段视频成为一个连续镜头。

保留前2秒和第3秒之后的原始视频，只重新生成第2—3秒中间的画面。中间的黑色是待填补的空白，不是场景中的黑暗，也不是转场效果。

男子已经转头看向右边，摄影机立即跟随他的视线向右转动。随着摄影机连续右转，男子的脸、肩膀和白色杯子向画面左边滑出，右侧控制室的设备、橙色指示灯和工作人员依次进入视野。整个转动过程始终看得见房间，带有自然的横向运动模糊。

用这一秒完整拍出从男子近景转向控制台和工作人员的过程，准确接上第3秒开始的原始画面，并继续原有运动。摄影机不停止、不跳位，场景不变形，没有剪切或淡入淡出。必须用实际的右转画面完全替换中间黑色空白。最终5秒视频看起来是同一台摄影机一次连续拍摄。
```

**112f9966** (Transition, 1,012 chars):
```text
以<<<video_1>>>为唯一视频依据，只填补原视频2.000秒至3.000秒之间的黑色视频占位段。黑色是待替换区域，不是剧情中的停电或转场。成片保持原视频5秒总时长、24fps、120帧及原始画幅。

最高优先级：0.000≤t<2.000秒和3.000≤t<5.000秒为锁定的原始视频，直接保留原帧，不重新生成、不重绘、不美化、不调色、不裁切、不变速。以第一帧编号为1：第1—48帧和第73—120帧必须与输入逐帧完全一致，每帧保持原时间位置；只生成第49—72帧。不得插入、删除、重复或移动锁定帧。3.000秒必须恢复输入的第73帧，而不是相似的重建画面。

2.000—3.000秒的新动作：承接黑场前最后原始画面，摄影机仍朝向同一块窗玻璃，男子的脸已经映在玻璃里，画面右侧仍保留他真实头部的近处虚焦边缘。镜头平滑地将焦点准确落到玻璃中男子的反射影像上，让倒影里的眼睛、眼镜框和面部轮廓变得清晰锐利；窗外的海面、浪和灯光自然退 […]
```

**2f9b8601** (Transition, 1,136 chars):
```text
以<<<video_1>>>为唯一视频依据，只填补原视频2.000秒至4.000秒之间的黑色视频占位段。黑色是待替换区域，不是剧情中的停电或转场。成片保持原视频6秒总时长、24fps、144帧及原始画幅。

最高优先级：0.000≤t<2.000秒和4.000≤t<6.000秒为锁定的原始视频，直接保留原帧，不重新生成、不重绘、不美化、不调色、不裁切、不变速。以第一帧编号为1：第1—48帧和第97—144帧必须与输入逐帧完全一致，每帧保持原时间位置；只生成第49—96帧。不得插入、删除、重复或移动锁定帧。4.000秒必须恢复输入的第97帧，而不是相似的重建画面。

2.000—4.000秒的新动作：承接黑场前最后原始画面，穿蓝色工作服、戴眼镜的男子继续沿走廊朝画面右侧快速奔跑，身体前倾，脚步保持急促连续的节奏。他一直把安全帽拿在腰部附近、画面下方；现在直接从下方举起，不从地上捡、不从墙上取、不接别人递来的帽子。约2.000—2. […]
```

**163d0dcc** (Transition, 1,345 chars):
```text
以<<<video_1>>>为唯一视频依据，只填补原视频2.041667秒至8.041667秒之间的黑色视频占位段。黑色是待替换区域，不是剧情中的停电或转场。成片保持原视频约10.041667秒总时长、24fps、241帧及原始画幅。

最高优先级：0.000≤t<2.041667秒和8.041667≤t<10.041667秒为锁定的原始视频，直接保留原帧，不重新生成、不重绘、不美化、不调色、不裁切、不变速。以第一帧编号为1：第1—49帧和第194—241帧必须与输入逐帧完全一致，每帧保持原时间位置；只生成第50—193帧。不得插入、删除、重复或移动锁定帧。8.041667秒必须恢复输入的第194帧，而不是相似的重建画面。时间小数为近似值，精确边界以帧号为准。

2.041667—8.041667秒的新动作：承接第49帧男子已经冲到门前的姿态。约2.041667—3.200秒，他保持冲势，身体前倾，立即用肩膀结实地顶撞门板，将门 […]
```

**b8fedddb** (Transition, 946 chars):
```text
以<<<video_1>>>为唯一视频依据，只填补原视频2.000秒至4.000秒之间的黑色视频占位段。黑色是待替换区域，不是剧情中的停电或转场。成片保持原视频6秒总时长、24fps、144帧及原始画幅。

最高优先级：0.000≤t<2.000秒和4.000≤t<6.000秒为锁定的原始视频，直接保留原帧，不重新生成、不重绘、不美化、不调色、不裁切、不变速。以第一帧编号为1：第1—48帧和第97—144帧必须与输入逐帧完全一致，每帧保持原时间位置；只生成第49—96帧。不得插入、删除、重复或移动锁定帧。4.000秒必须恢复输入的第97帧，而不是相似的重建画面。

2.000—4.000秒的新动作：承接第48帧已有的近距离侧脸画面，男子继续沿原来的走廊路线快速向前奔跑。摄影机延续已经开始的运动，从他身侧沿一条短而流畅的弧线移动到斜前方，再自然到达正前方。画面连续经过侧脸、四分之三侧脸和正面，始终看见同一张脸；这是摄影机绕到他前面 […]
```

**6a4e799f** (Transition, 1,087 chars):
```text
以<<<video_1>>>为唯一视频依据，重新生成2.041667秒至5.000秒的连续动作：摄影机始终从背后跟着工程师，他向前跑，转向走廊左侧的门，亲手打开并进入后段原视频中的房间。成片保持原视频7秒总时长、24fps、168帧及原始画幅。

最高优先级：0.000≤t<2.041667秒和5.000≤t<7.000秒为锁定的原始视频，直接保留原帧，不重新生成、不重绘、不美化、不调色、不裁切、不变速。以第一帧编号为1：第1—49帧和第121—168帧必须与输入逐帧完全一致，每帧保持原时间位置；只生成第50—120帧。不得插入、删除、重复或移动锁定帧。5.000秒必须恢复输入的第121帧，而不是相似的重建画面。时间小数为近似值，精确边界以帧号为准。

2.041667—5.000秒的新动作：承接第49帧近距离拍摄工程师后背的状态，他继续向前跑，立即转向身旁左侧墙上的门。由于摄影机在他身后，这扇门位于画面左侧。他的左肩带动身体转 […]
```

**b467eb11** (Sc_03/Sc_03_b_01, 4,104 chars):
```text
写实灾难电影，21:9宽银幕。日本福岛核电站。一个连续长镜头：从控制室内主工程师的脸部近景开始，摄影机快速向右转，跟随人员从控制室跑出，经过短连接通道进入有窗走廊。摄影机先来到玻璃前观察海啸，工程师稍后才以模糊倒影出现。焦点转到倒影中的脸，读出他对死亡迫近的恐惧。随后他加入同向人流，摄影机严格从侧面跟随他跑进无窗内走廊，戴好并扣紧安全帽，收至眼镜旁的极近侧面特写。最后一次画外接触打断动作，摄影机猛然向下俯摇至掉落的钥匙。动作紧凑、空间连续，没有可见剪辑或瞬移。

参考职责：
<<<4b381f91-17fc-43f6-aa1f-fe7439ebbf6e>>> 提供控制室建筑、灰绿色仪表柜、操作台、桌子、电话、电脑和工业照明。人物与行动按以下文字生成。
<<<5db772a2-405f-4754-a7c4-f3a16e1df932>>> 锁定主工程师的脸、年龄感、眼镜、体型、自然发型与蓝色工作服。始终保持同一身份，眼镜保留。开场尚 […]
```

**8bd8105a** (Sc_04, 2,402 chars):
```text
视频续接：

保留上传的三秒原视频作为00:00–00:04 same as <<<video_1>>>，从原视频最后一帧连续生成00:04–00:20的后续动作。新画面继承原视频结束时女员工的姿态、动作、湿发、湿衣、安全带状态，汽车的侧翻方向、损坏程度和水位，以及摄影机的位置、朝向、运动惯性和声音。所有动作从正在发生的状态继续向前发展。

参考资产：

<<<ba1c6732-4056-42fe-b806-5e2b4f9b656e>>>控制女员工的身份、面部、发型、身材和蓝色工作服。延续原视频中已经湿透的头发与衣服。

<<<4b7250d9-7fe2-4b86-9d2c-8953f55139eb>>>控制车内结构，以及方向盘、驾驶座、乘客座、仪表台和中央控制台之间的固定关系。汽车的破损、倾斜和进水状态继承原视频。

<<<39d3785f-f508-42f5-99b0-0f779d72b15f>>>控制停车场、周围车辆、厂房 […]
```

**7d1a9400** (Sc_05, 2,689 chars):
```text
25秒，24fps，1920×826，写实灾难电影，一条实时连续长镜头。摄影机紧跟工程师，用强烈、不规则的手持震动、真实的运动惯性和近距离面部表演呈现求生过程。

<<<d6771437-e2a2-4da5-b0ed-2a1753bf9c82>>>提供技术设备间的平台高差、金属楼梯、管道与红色阀门手轮、洪水、鱼的外形及半暗照明。<<<5db772a2-405f-4754-a7c4-f3a16e1df932>>>锁定工程师的脸、眼镜、体型与蓝色工作服。<<<82d8c739-82d7-428f-a568-ddf3a28f3846>>>定义同一顶安全帽。<<<1159f17a-d92b-44cb-9fc9-0035c7275fab>>>定义红色手电、黑色滑动开关与灯头，光束偏弱、集中，只照亮近处。

开场是几乎不透明的棕灰色浑水，泥沙与气泡贴着镜头翻滚。摄影机猛然穿出水面，紧接着用约一秒沿近处金属楼梯的斜扶手和立柱向上移动，同时绕平 […]
```

**6acdf2a9** (Sc_06, 3,220 chars):
```text
21:9超宽画幅，写实电影质感，实时动作，一个连续长镜头。全段使用紧密近景与极近景，摄影机持续有强烈、不规则的手持震动、摇摆和真实惯性。摄影机的主体路线连贯明确，震动叠加在连续运动上。摄影机始终保持移动，没有突然刹停、静止等待或停下后重新启动。无可见剪辑、跳机位或穿模。

<<<43a9b5ec-1108-4d6a-a1b5-af57851e566b>>>确定最新走廊、窗户、警报灯、窗外洪水、前方建筑及红色汽车。它是环境与空间参考，不是必须复制的开场构图。<<<265ebe37-66c1-4760-ac3a-7a44769999d6>>>确定湿透工程师的身份、脸、眼镜和蓝色工作服。<<<82d8c739-82d7-428f-a568-ddf3a28f3846>>>确定他全程戴着的白色安全帽，保留准确的红银条纹、标志与佩戴结构。即使人物参考没有安全帽，影片中也必须始终戴着。红车沿水流前进方向的前方是<<<43a9b5ec-1108 […]
```

**66ec4fac** (Sc_07, 12,121 chars):
```text
Serious grounded disaster drama, natural colors and lighting, realistic industrial environment, handheld but controlled camera movement. Urgent pace throughout. No cuts. The engineer is <<<265ebe37-66c1-4760-ac3a-7a44769999d6>>>. He is wet, wearing a safety hat (<<<82d8c739-82d7-428f-a568-ddf3a28f3846>>>) in a rush and trying to maintain an image of confidence despite the circumstances slipping out of control. His fl […]
```


## Exemplar prompts (verbatim)

### E1. f884cfee — seedream_v5_pro · characters/GIRL · 2026-09-08 16:59
Character sheet from a cast image (Seedream 5 Pro, characters/GIRL, 16:9, 1 input image). Pattern: "Use Image A as the only character reference" → preservation list → FORMAT → POSE with CRITICAL negatives → FRONT/BACK specs → BACKGROUND. Use for every character sheet.
```text
Use Image A as the only character reference.
Create a photorealistic studio character sheet of the SAME young woman from Image A.
Preserve her exact identity and appearance:
- same Japanese female, about 24 years old
- same facial structure, same calm direct expression and overall demeanor
- same straight black hair with a straight fringe, tied back in a low ponytail
- no glasses
- same slim body proportions and build
- same two-tone blue work uniform: light grey-blue jacket body with darker royal-blue collar, shoulder yoke, outer-sleeve panels and cuffs; centre-front zip; two flap chest pockets with a small button; a small fabric badge patch on the left chest pocket and a small round emblem patch on the upper left sleeve, rendered as plain fabric patches with no readable text; the same royal-blue work trousers and black lace-up work shoes
- preserve all authentic visible uniform details from the reference, including the slightly loose fit of the jacket on her frame
CHARACTER SHEET FORMAT:
Show exactly 2 full-body views of the SAME person on one sheet:
1) full-body FRONT VIEW, perfectly frontal
2) full-body BACK VIEW, perfectly frontal from behind
POSE:
Neutral production-ready standing pose.
Feet naturally shoulder-width apart.
Arms hang freely and naturally down along the sides of the body.
Hands relaxed.
CRITICAL: hands must NOT be clasped behind the back, folded, crossed, hidden, or placed in pockets.
In the back view, both arms and both hands must remain clearly visible hanging naturally beside the body.
FRONT VIEW:
The woman faces camera directly.
Head level, shoulders square to camera, body fully frontal.
Full body visible from top of head to soles of shoes.
Do not crop any part of the body.
BACK VIEW:
The same exact woman viewed directly from behind.
Head, shoulders, torso, hips, legs, and feet aligned straight away from camera.
The low ponytail is clearly visible hanging down the back of the head and neck.
Preserve the exact same clothing, proportions, hairstyle, and anatomical left/right sides; the sleeve emblem stays on the LEFT arm in both views.
Full body visible from top of head to soles of shoes.
BACKGROUND:
Perfectly even neutral mid-gray studio background.
No room, no control panels, no furniture, no floor texture, no location elements.
Flat seamless gray with no gradient, no vignette, no visible horizon line.
LIGHTING:
Soft neutral-white studio lighting.
Even illumination across face, clothing, and body.
Natural realistic shadows only as subtle form definition.
No dramatic lighting, no colored cast, no cinematic grading, no beauty light.
PHOTOGRAPHY:
Absolute photorealism.
Real person photographed in a studio with a natural 50mm perspective.
Realistic skin, hair, fabric texture, stitching, wrinkles, and shoe materials.
No CGI, no 3D render, no illustration, no concept-art look, no glamour or fashion styling.
STRICT CONSISTENCY:
Both panels must show the exact same physical person.
Do not change face, age, hair, body shape, clothing, shoes, or proportions between views.
Do not invent a different back design for the uniform.
Do not mirror or move details to the wrong anatomical side.
No text, no labels, no captions, no signage, no lettering, no numbers; the small uniform patches carry no readable writing.
```

### E2. 8af7d312 — nano_banana_2 · characters/GIRL · 2026-09-08 18:07
Skin-realism pass (Nano Banana Pro, Russian, 497 chars). English: "hyper-detailed skin with subsurface light scattering, skin micro-texture with light vellus hair, barely visible pores and expression lines, slightly oily T-zone with natural shine on forehead and cheeks, moist eye corners, natural lashes of varied length, realistic eye highlights, soft gloss on lips, natural lip texture, fine hair along the hairline, detailed slightly messy strands, realistic volume and natural colour shifts." Applied to the sheet close-up before the final 3-panel sheet.
```text
гипердетализированная кожа с эффектом подповерхностного рассеивания света, микрофактура кожи с лёгким пушком, почти незаметными порами и мимическими морщинками, слегка жирная Т-зона с естественным блеском на лбу и щеках, влажные уголки глаз, естественные ресницы с разной длиной, реалистичные блики в глазах, мягкий эффект глянца на губах, натуральная текстура губ, пушок вдоль линии роста волос, детализированные пряди волос с лёгкой небрежностью, реалистичный объём и естественные переливы цвета
```

### E3. fb592f7f — seedream_v5_pro · locations/corridor · 2026-09-10 17:36
Lens pass (Seedream 5 Pro, 21:9, 9,311 chars, one input = the approved corridor plate). This is the style-unifying step: lens only, no relight, and an AVOID list that pre-empts every failure (haze, bloom, fisheye, black wedges, re-grade).
```text
Edit the image: apply the optical character of a fast wide vintage prime to this coastal corridor. Do not change the lighting. Do not change the exposure, the colour temperature, the grade, the time of day or the weather outside. Every ceiling fitting, the red alarm beacon, the lit doorway at the far end, the lamps outside and the light on the sea stay exactly as bright and exactly the same colour as they are now. This edit is about the lens only. The air inside this corridor is perfectly clear: nothing about this edit adds atmosphere, mist, fog, haze or visible light in the air.

THE LENS BOWS THE PICTURE OUTWARD — THIS IS THE FIRST THING TO DO AND IT MUST BE PLAINLY VISIBLE: uncorrected barrel distortion. Bend the image outward from the centre so the effect is unmistakable at a glance. This corridor is built almost entirely of long straight lines, so work it through them specifically:
— The long line where the ceiling meets the top of the window wall, running away into the depth of the corridor, bows outward instead of running dead straight, its near end pushed toward the upper left corner.
— The red handrail running the length of the window wall bows the same way, its near end swinging outward toward the lower left corner rather than continuing in a straight line.
— The line where the wall meets the floor on the right, and the long edge of the window sill on the left, both bow outward, their near ends pulled toward the bottom corners.
— The vertical window mullions near the left edge lean outward, tilting away from the centre, their tops splaying toward the top-left corner and their feet toward the bottom-left one; the vertical edges of the doors and the notice board frame at the right edge lean outward the same way.
— The rectangular ceiling light fittings near the top of the frame are stretched and skewed out of true, no longer parallel to the frame edges.
— The horizon of the sea seen through the windows arches with everything else instead of running level.
— Everything within the central third of the frame — the far end of the corridor and the doorway it leads to — stays close to normal; the bending increases steadily outward and is at its strongest in the four corners.
This is real geometric distortion of the whole image, not a texture effect, not a filter. The frame stays completely filled to all four edges — no empty corners, no black wedges, no visible border. It stops short of a fisheye: the picture must still read as an ordinary wide shot down a corridor, not a bubble.

VEILING FLARE — A LIFT IN THE BLACKS, NOT MIST IN THE CORRIDOR: uncoated
[… 5,411 chars omitted …]
receding fittings merging into one glowing line, a soft bloom filling the corridor, obscured signs, a dreamy diffused look, a diffusion filter, a bloom filter, a flat undistorted image, a straight ceiling line, a straight handrail, a straight floor line, straight vertical mullions, a level sea horizon, no visible curvature, a fisheye, a bubble, a ball-shaped image, wrapped corners, empty corners, black wedges, a visible border, a cropped or zoomed frame, a changed field of view, a moved camera, pincushion distortion, warped doors, melted fittings, a curved wall, bent window frames, illegible signs, unreadable Japanese text, garbled characters, invented text, blurred foreground, shallow depth of field, bokeh, out-of-focus areas, added blur beyond the corner softness, a sun, a sunbeam, a starburst, a warm sunlit look, a golden cast, a lens flare streak, polygonal ghosts, a chain of flare rings, blue or purple flare, a lens dirt overlay, blown-out white highlights, pure black shadows, heavy vignette, a drawn circular vignette, brightening the picture, darkening the picture, raising the exposure, re-grading, re-lighting, changing the waves, changing the sky, adding rain, adding people, adding equipment, a painterly look, an HDR look, a clean digital look, oversharpening, watermarks.
```

### E4. f46b3f7b — seedream_v5_pro · locations/parking · 2026-09-14 12:41
Blocking sketch (Seedream 5 Pro). Turns an approved photoreal frame into a loose storyboard so that Seedance (element `inside_car5`) takes only the pose and spatial relation from it.
```text
Convert this image into a simple, loosely drawn pencil storyboard sketch. Preserve the original composition, camera angle, perspective, character pose, and placement of objects.

Use sparse, slightly rough graphite lines on plain white paper. Simplify the woman, helmet, hands, steering wheel, seats, and window frames into clear, recognizable shapes. Reduce the background to a few essential outlines. Keep the face indistinct, without detailed facial features.

Use minimal shading, with only a few light strokes to suggest depth. Leave large areas unshaded. No fine textures, intricate details, or photorealistic rendering. The result should look like a quick cinematic storyboard drawing, not a polished illustration.
```

### E5. bab6f436 — seedance_2_5 · Animation/Sc_01 · 2026-09-11 08:28
FINAL Sc_01 (Seedance 2.5, 10 s, 1080p, 21:9, element loc_seabed-fish1). English gist: one continuous upward camera move from the seabed through the quake-lifted silt "directly out of the coffee"; reference binding "not a first frame to reproduce pixel by pixel"; optics block; timecoded 0:00–0:05 / 0:05–0:08 / 0:08–0:09 / 0:09–0:10; sound block. The coffee reveal was later re-done as an in-fill (bb1323e0).
```text
完整10秒，宽银幕电影构图。全片保持一个连续的摄影运动：摄影机从第一帧就持续向上离开海床，同时逐渐向下俯转，受到猛烈冲击后被裹挟泥沙的上涌水流带动，加速沿同一方向上升，穿过翻卷的泥层，直接从咖啡中拉出为垂直俯视。摄影机的运动始终推动叙事，震动始终作用于这个运动。海底到咖啡的空间变化只发生在完全遮蔽视线的深色流体内部，观看时像同一个动作自然延续。直到0:09才开始揭示杯沿；最后一秒观众刚认出这是一杯咖啡，镜头便结束。  参考绑定： <<<75a86385-34a3-4206-8e39-9b2e388621b9>>>提供海床环境、水体色调、光线层次与皇带鱼外形参考，不作为必须逐像素复现的首帧。海床由砂砾、散落石块、贝壳碎片和向上延伸的海带构成，低饱和青绿色水体中有不同距离的小鱼，柔和漫射光从上方偏左透入。皇带鱼具有银色带状长身、沿背部延伸的红色背鳍与头顶细长红色鳍条，保留参考中的自然外形和身体比例。实际首帧根据摄影机持续上升的路径重新组织构图，皇带鱼位于海床上方的中近景，头朝画面左侧，身体与底部保持清楚的水体间隔。远处海床与海带逐渐消失在水体中。  摄影与光学： 高端数字电影摄影，克制而明显的变形宽银幕光学性格。柔和高光过渡、厚实的暗部与细腻的中间调。开场依靠低位斜俯视构图、前景遮挡和不同距离的水体层次建立空间；咖啡仅作为连续运动结束前的瞬间尺度揭示。 叙事焦平面清楚，离开焦平面的结构逐渐柔化；外围线条只有轻微自然弯曲。中近景皇带鱼、石块与沉积层清楚，远处因水体散射逐渐失去反差。深黑咖啡与白瓷形成短促清楚的明暗对照。 摄影机具有器材重量与惯性。突发的猛烈地震引起大幅横向甩动、沉重的上下颠簸和不规则倾斜；摄影师持续修正构图，同时保持既定的向上运动方向。快速震动带有短促方向性运动模糊，海床细节在修正后的瞬间重新清楚。强度通过海床位移、松动物体跳动、水体扰动与摄影机滞后的不同反应共同表现。  0:00–0:05｜持续上升，猛烈冲击，皇带鱼惊逃，摄影机被水流带向上方 摄影机低悬在海床上方，光轴斜向前下方，从第一帧就缓慢而持续地向上升起，同时平缓向下俯转。近处海带与石块相对远处海床产生清楚视差，底部逐渐远离，斜向观察逐步转成更接近垂直向下的观察。  皇带鱼在海床上方自然向左游过。沿背部延伸的长背鳍连续起伏，银色带状身体保持柔韧、克制的弯曲，细长鳍条被水流轻轻拖动。画面中所有小鱼从第一帧就自然游动：近处海床上方、石块与海带之间以及远处水体中的小鱼都轻摆尾鳍，以各自不同的方向和速度缓缓穿行，偶尔自然转向，形成持续而细微的生命活动，没有静止悬挂的鱼。稀薄悬浮物掠过前景，冷色漫射光从上方偏左斜穿水体，只在银色鱼身、砂砾和贝壳碎片上留下有限亮度。  开场平静的游动中，一股深沉的水下低频轰鸣从微弱逐渐增强、变厚，压力持续积累；紧接着，第一次突然、极其猛烈而沉重的整体冲击穿过画面。整片可见海床与岩石结构发生大幅、急促的横向错动并猛然上顶；摄影机因水体和自身惯性滞后，底部从它下方剧烈移位，原本稳定的空间关系瞬间被打破。紧接着摄影机被重重甩向一侧，出现明显的垂直颠簸与短促侧倾，操作者努力追回朝下的构图，上升运动仍在继续。  细砾、贝壳碎片和松动的小石块同时跳离接触面，落下后继续滑移与碰撞；大块岩石随周围底部共同震动。海带根部被海床突然带动，长叶片因水体阻力滞后，随后猛烈拖向另一侧。  皇带鱼在冲击到来的瞬间突然受惊，身体短促收曲，头部立即转向画面左侧靠近镜头的逃离路径。背鳍起伏迅速加快，柔韧的长身紧随头部猛然加速，一次连续的逃离动作从镜头前近距离斜掠而过，银色鱼身形成短促的方向
[… 908 chars omitted …]
志与尺度同时消失，摄影机保持垂直朝下的光轴。快速上升继续发生在厚重、持续翻卷的浑水内部，直到0:09之前画面始终被流体完全包围。  0:08–0:09｜泥、水泡、深色液体 镜头附近的泥粒与细小气泡继续经过。背景先变深，随后前景颗粒也逐渐失去轮廓，最后几个气泡的微弱反光被深褐色流体吞没。摄影机保持连续的上升速度和朝下的光轴，黑暗只是一层正在经过的浑水，而不是停留的黑场。整个画面仍被深色液体占据，尺度尚不可辨认。  0:09–0:10｜直接拉出咖啡，刚认出杯子便结束 遮住视线的液膜从镜头前退开：黑咖啡、冷白色反光与白瓷杯沿几乎在同一个向上拉出的动作中出现。摄影机已经位于杯口正上方，光轴垂直朝下，圆形杯沿完整而自然，杯柄随杯沿进入画面，桌面只在四周短暂露出。  液体内部的运动直接延续为杯中已经发生的激烈晃动。杯子仍在震动的桌面上，冷白色顶灯在咖啡表面留下局部反光。没有单独展示海面、波峰或液体变形的段落，也没有慢动作停顿。最终构图只包含杯中咖啡、白瓷杯沿、杯柄和四周少量桌面。观众刚认出这是一杯咖啡，镜头立即结束在仍然持续的上升运动与震动中。  声音： 全程只有连续环境声与动作声。开场先有从微弱逐渐增强、越来越厚重的水下低频轰鸣，在第一次冲击之前持续积累压力，随后骤然爆发为极其强烈而沉重的第一下冲击。突然的沉重水下低频冲击伴随连续轰鸣、砂石猛烈接触和沉闷水流，后续不规则冲击保持压力与重量；摄影机被水流带向上方时，近处翻涌的浑水声迅速增强。浑水变深时声音被包裹，杯口揭示的瞬间直接进入贴身的建筑震响、瓷杯与桌面的轻碰及杯内液体拍击。声音不因空间揭示而停顿，结束时仍有持续地震与液体晃动声。
```

### E6. e9b7a476 — seedance_2_5 · Animation/Sc_02 · 2026-09-11 06:38
FINAL Sc_02 (Seedance 2.5, 24 s, 1080p, 4 elements, Chinese, 6,631 chars). English gist: element roles (control room; engineer identity "remove the helmet"; gauge "state when first clearly seen" then "the same gauge after it falls"); Japanese-only dialogue, each quoted line once; "the most important visual event is the whole building shaking strongly and continuously"; flicker from the first frame; "only one main camera route … whip right about 100°"; then every beat paragraph opens with the refrain "灯光闪烁、闪烁、持续闪烁。摄影机持续震动、持续震动。" ("The lights flicker, flicker, keep flickering. The camera keeps shaking, keeps shaking.") so the persistent behaviours never drop out. This is v4 of 5. The take used came from this version, not from the later v5.
```text
完整控制室片段，超宽画幅。专业电影摄影的真实纪实质感。<<<3a62dc25-7393-4b1e-b08f-6b51e9a59888>>>规定控制室环境；<<<5db772a2-405f-4754-a7c4-f3a16e1df932>>>规定工程师身份，保留眼镜和面部特征，去掉安全帽和下颏带；<<<152846bb-dbbe-4a9d-9a8a-785ff7849a98>>>规定温度仪表首次清楚呈现时的状态，仪表外观、每个发光段和深灰色段的位置、数量与颜色都与参考图完全一致。<<<97c8d985-c369-49ea-af72-e14da3abd817>>>是第四张上传的图片，规定同一只仪表随后必须清楚呈现的独立显示状态：发光部分只有这张图里的绿色段，其余段呈现这张图中的深灰色。仪表动画是从<<<152846bb-dbbe-4a9d-9a8a-785ff7849a98>>>的状态逐渐过渡到<<<97c8d985-c369-49ea-af72-e14da3abd817>>>的状态。两张图片表示一个物体在不同时间的状态，控制台上只有一只这样的刻度仪，占据一个固定位置，不生成第二只。所有人物只说日语。引号内为实际说出的日语台词，严格按原文各说一次，使用自然日语发音和对应口型。

最重要的视觉事件是整栋建筑持续受到强烈地震摇撼。地板反复产生沉重、明显的横向晃动和竖向震动，整个控制室的墙面、门框、控制柜和桌子随建筑共同摇动，保持各自坚固的结构与形状。悬挂灯具和松散物件因惯性滞后摆动，桌上纸张滑动、椅子移位，柜门与抽屉震颤。画面中能同时看见建筑结构的整体摇动、物件的惯性反应以及人的重心调整。工程师脚下的地板先晃动，他的身体随支撑面移动，借助桌沿支撑、调整重心维持平衡；周围工作人员也受到同一轮建筑晃动影响。人的动作是被环境带动的自然平衡反应，不是身体自行抽搐。摄影师站在同样晃动的地板上，摄影机因此产生沉重、不规则的位移、倾斜与密集细震，构图反复偏移，摄影师只能部分修正。较重的建筑晃动间夹着更短促、锐利的不规则颠动，摄影机被震偏后带着惯性回正，随即再次受到干扰；这些震动贯穿近景和行走过程。每次较强震动都使脸部或仪表在画面中明显偏移，随后摄影师迅速修正；短促颠簸更加频繁，叠加可见的横向冲击与倾斜。强烈的建筑摇动持续贯穿拿杯、喝咖啡、说话、行走、停电与仪表特写，直到主照明完全恢复。在黑暗中，门框轮廓、人物剪影和仪表光仍明显随震动移动。人物不跌倒，表演严肃克制。只有主照明完全恢复以后，建筑的摇动才逐渐减弱。

从第一个画面开始，控制室顶灯就持续反复闪烁：灯管亮起、明显变暗、重新亮起，连续重复。每个镜头阶段都清楚出现多次亮暗交替。咖啡中的微弱棕色层次随光线脉动，整体仍接近黑暗。摄影机露出液面后，咖啡表面的灯管倒影、纯白杯沿和桌面已经不断明暗交替，白色杯沿反复从明亮白色变为暗灰色再恢复明亮。灯光在整个开场与行走过程中反复闪烁，亮暗对比清楚，摄影机曝光保持固定，使灯具的变化直接出现在画面里。杯子、人物皮肤、桌面和虚焦背景灯点随实际灯具同时变化明暗。拿杯、饮用、对白和行走期间都能清楚看见这种闪烁，直至主照明熄灭。主照明熄灭时，大厅明显陷入更深的黑暗，只能辨认人物剪影、门框和设备的微弱轮廓，以及仪表自身的发光段。人物面部细节隐入阴影，极弱的背光仅勾出身体边缘。曝光保持这种深暗状态。整栋建筑仍猛烈摇动。场景后段主照明重新完全亮起时，大厅照明保持稳定。控制室旁的过渡小通道及其连接的走廊有独立的灯光节奏：从第一个画面开始，灯具持续以清楚、规律的节奏反复明暗闪烁，一直持续到工程师说出“頼もしいな。”这句最后的评价。开头摄影机在咖啡内部时，走廊灯光已经在画外闪烁；随后可通过门口和小通道透入的微弱光线、边缘反光感受到这种明暗节奏。大厅主照明熄灭期间，走廊透来的闪烁光只勾出剪影，不照亮人物面部。保持原来的摄影路线，走廊主体仍在视野之外。

主摄影路线只有一条：从咖啡中上升、俯拍杯子、仰向面部、沿同一方向绕到三分之四角度、在工程师行走时继续弧线到侧面和肩后、越过肩旁靠近仪表、在仪表旁转向工程师面部、最后向右急转约100度。每个动作接着前一个动作，不反向折返，不重复绕圈。摄影师独立行走，距离自然变化，转向和调整构图有轻微反应延迟，主角不会固定在画面中的同一个位置。路线有明确目的，但承载它的摄影机始终受到强烈地震干扰。没有剪辑、静止插入镜头或数字变焦。

灯光闪烁、闪烁、持续闪烁，微弱的咖啡色层次随之明暗脉动。摄影机持续震动、持续震动。摄影机完全浸没在不透明的咖啡中，整个画面几乎全黑，只有极微弱的深棕色液体层次。杯子、杯口、桌面和房间完全不可辨认。摄影机一开始就垂直向上移动，镜头朝下，开头先在液面之下持续上升，让完全浸没于咖啡内部的状态清楚成立。

灯光闪烁、闪烁、反复闪烁。摄影机始终震动、始终震动。摄影机持续升出咖啡，沿杯口中心向上移动并保持朝下。咖啡表面、白色圆形杯口、桌上的整只杯子及周围桌面依次出现，形成明确的正上方俯拍，清楚表现从杯子内部升出。杯子纯白，没有任何标志、文字或图案，始终放在桌上。只有半杯咖啡，液面在杯口下晃动，不溢出。工程师抓住杯柄，另一只手扶着桌子。强烈不规则的摄影机震动贯穿上升，桌沿和杯口在画面中明显摆动，杯子在震动间隙仍可辨认。

灯光持续闪烁，脸与杯子反复明暗交替。摄影机持续震动、短促颠动，直接靠近面部特写。摄影机继续上升并仰向工程师的脸，直接进入低角度面部特写，后方主要是天花板，不在躯干停留。工程师拿起杯子，肘部贴身，以手腕自然补偿保持杯子朝上，咖啡不洒出，脸、眼镜和衣服干净。他随地震持续摇晃，一手借桌沿支撑，身体没有突然夸张的甩动。在工作人员开口之前，他已经通过目光巡视周围的人员和控制台，认真评估现场状况。摄影机保持紧密面部特写，焦点在眼镜后的近侧眼睛。他的眼神透出担忧、专注和责任感，神情沉着克制。他看向现场，不看镜头。天花板保持完整，画面里没有从天花板掉落的灰泥。摄影机强烈颤动，同时开始绕向他的三分之四面部角度。

灯光闪烁、闪烁，摄影机震动、震动，在极近面部特写中继续移动，周围深度虚化。摄影机沿同一方向继续近距离弧线，不急着走到后脑。工程师面部仍是主体，焦点在眼镜后的近侧眼睛。背景很多人抓住支撑或在控制台之间短距离急跑，互相避让，呈现为强烈虚焦的移动身影。背景灯点与人影因地震持续不规则摆动，工程师也不断调整重心。他把杯子举到嘴边。

灯光仍在闪烁、反复闪烁。摄影机持续震动，工程师保持紧密面部特写，周围深度虚化。身
[… 3,231 chars omitted …]
机贴近工程师的脸继续短弧线绕行，保持紧密面部特写，周围全部深度虚化。摄影机保留逐渐减弱的余震与摄影师自身的细小晃动。他举起同一只纯白杯子，短饮第二口，咖啡不洒出。就在杯子仍靠近嘴边时，右侧小通道传来唯一一次呼喊：“津波だ！” 他的动作顿住，眼神转向声音。年轻操作员在虚焦背景中也转向声音。此时主照明已恢复，面部和小通道仍可读。

摄影机立即以水平向右约100度的急转回应声音，转向完成后让观众看清刚刚报信的人。他扶着门框，惊恐地看向控制室，不重复喊话。只揭示控制室与主走廊之间的小段过渡通道：灰绿色工业墙面、门框、实用照明，与控制室风格一致。主走廊仍在视野之外。焦点落在报信者身上，后方保持柔化。在看清报信者后结束。

约50毫米高质量变形宽银幕镜头，自然面部比例，浅景深和强烈背景虚化。面部近景以近侧眼睛为焦点，远侧眼睛和耳朵逐渐柔化；肩后跟随保持近处主角清晰，周围尽可能虚化。焦点以工程师为主；年轻操作员报告时短暂让他的表情清楚，随视线转向唯一的温度刻度，最后才转到报信者。工程师全程不看镜头。建筑保持坚固几何形状，震动来自实际物体运动、人的平衡反应和摄影机位移。动作是灾难现场的真实反应，表情克制但身体始终受震动影响。不展示天花板掉落碎屑。

自然现场同期声音从开场持续存在：控制室内远处的应急警笛因地震警报反复鸣响，带有室内混响，整个行走和停电过程都清楚听见。警笛下面是持续的建筑低沉震响、控制柜与玻璃的密集颤响、物件碰撞、前景和背景交错的急促脚步、纸张摩擦散落、忙碌而听不清具体词句的人声，以及近处呼吸。主要日语对白具有真实空间距离并清楚可辨，警笛和环境声在对白下方持续。没有音乐或字幕。
```

### E7. b1d3bdf6 — seedance_2_5 · Animation/Sc_03/Sc_03_b_02 · 2026-09-11 17:36
FINAL Sc_03_b_02, the acting and dialogue scene (Seedance 2.5, 27 s, 1080p, 5 elements + image_1 = screenshot of the previous take's end frame). English gist: contract "one camera, real continuous long take, no cuts; drive emotion with extreme face close-ups and hand details; never a two-shot medium"; element roles; both characters' inner states with limits; then the beat path: collision → keys → lines of dialogue → pause "let this pause really exist" → nod → silent thanks in her eyes "she does not mouth thank you"; extras all flow one way; sound list "only these four Japanese lines".
```text
写实灾难电影，21:9宽银幕，整段由同一台摄影机以真实连续的长镜头完成。没有剪辑、隐藏切口、插入镜头、时间跳跃或瞬移。以极端面部特写和手部细节推动情绪，不出现两个人同时清楚入画的中景双人构图。

<<<image_1>>>作为开场画面与构图依据：工程师戴安全帽的超近侧脸，面向画面右侧，眼镜、眼睛、鼻子与紧绷的嘴占据画面，帽顶和部分下巴被画框裁切。只取电影画面，不复制截图界面、文字或边框。<<<88f4c909-31cf-4407-ab8f-8be5d2415591>>>提供无窗工业内走廊的建筑、门、顶灯、墙面与纵深，延伸到相连的下行楼梯和出口。<<<5db772a2-405f-4754-a7c4-f3a16e1df932>>>锁定工程师身份、眼镜和蓝色工作服，不用它的全身展示构图。<<<ba1c6732-4056-42fe-b806-5e2b4f9b656e>>>锁定女职员的脸、刘海、低马尾和蓝色工作服，三视图是同一个人。工程师与女职员从出现起都已经戴好<<<82d8c739-82d7-428f-a568-ddf3a28f3846>>>的白色红银条纹安全帽，不戴帽、不摘帽。<<<a68f2771-0b08-499a-bbb4-d2e8db38e711>>>锁定同一串车钥匙：黑色钥匙头、金属钥匙、黑色双按钮遥控器、金属环、粉白色挂件与小铃铛。

2011年3月11日，福岛第一核电站，海啸威胁下。工程师眼中已经有恐惧和痛苦：他知道女职员出去可能会死，他必须阻止她，却逐渐明白她已无法被他留住。他不是冷漠的管理者，也不是因危险解除而放行。女职员已经接近崩溃，联系不上家人使她恐惧家人可能已经遇难，害怕永远再也见不到他们；这是她的恐惧，不是影片确认家人已经死亡。她必须亲自回去，哪怕外面危险。这股冲动压过了她对自身安全的判断。两个人都处在极端情绪里，话语之间留有真正的凝视和犹豫，不把情绪演成连续夸张表情。

直接从<<<image_1>>>的超近侧脸开始，不从钥匙或走廊全景开始。工程师明确从画面左侧向右侧奔跑，摄影机紧贴其侧面平行跟拍，保持截图的面部尺寸与方向。开场所有背景员工也明确从画面左侧向右侧奔跑，没有任何员工反向。工程师不是独自奔跑：他就在持续密集的员工队伍里，与所有员工朝同一方向跑，有人在他前方，有人在后方，也有人从旁边超过他；这些人只作为失焦的肩背、帽子和移动轮廓经过，工程师的脸保持极近且清晰。女职员独自从画面右侧向左侧迎面跑来，逆着工程师和全部员工的方向，两人因此相撞。只跑极短的一瞬便发生碰撞。他的脸和身体突然受阻，摄影机带出一次短促的惯性震动，并借碰撞发生的动作从他的侧面沿短弧绕到他背后。摄影机始终贴近，画面从他的侧脸经过耳侧、帽沿到后脑和肩边，保持极近细节，不拉成双人中景。摄影机抵达他背后时，面朝他原本奔跑的方向；女职员位于他前方，原本正迎着他跑来。听见钥匙掉落的金属声，摄影机接着从这个背后位置连续tilt down，俯向两人脚边的钥匙，不切镜头，不先退成中景，不另做贴地滑行展示。女职员的手急切闯入这个向下的画面，抓起整串钥匙。

摄影机随她拾起钥匙和起身的动作抬升、抬头，连续跟焦，迅速落到她的极近面部。碰撞打断两人的姿态：她被撞得侧转，起身时恢复自己原本朝出口奔跑的方向，朝已绕到工程师背后的摄影机跑来。她从工程师旁边的空隙穿过，不穿过他的身体。摄影机让出这个空隙并退行跟住她的脸。工程师在她从身旁通过时真实转身，改变自己的行进方向去拦住她，这个转身不是所有员工一起掉头。她一句话也不说，攥着钥匙立刻继续朝摄影机方向冲，摄影机退行跟住她的脸。此时员工从摄影机这一侧跑向走廊深处，与她迎面交错；镜头里看见的是员工离开摄影机的后脑和背部，从她脸的两侧失焦地掠过。她朝镜头跑，员工背对镜头跑远，两个方向必须清楚而相反，不能让背景员工跟她一起朝镜头跑。她呼吸急促，眼睛越过镜头寻找逃离方向，神情已经慌乱失控。不要在起身时拉远交代全身。

工程师就在近旁，追上一步，手掌进入画面落在她肩膀上将她拦住。她停顿并转身面对他，摄影机仍留在近处。她的后脑或帽沿只成为画面边缘的一小块模糊前景，工程师的脸占据画面。他带着真实恐惧急切说日语：“どこへ行くんだ？ ここにいた方が安全だ！” 这句话是在挽留一个可能走向死亡的人，不是训斥。他看着她，手的阻拦有分寸，不摇晃她、不粗暴拉扯。

女职员背对摄影机，朝他喊出日语：“家に帰らないと！” 她的声音因恐惧和喘息而绷紧，身体仍想转向出口。摄影机开始沿工程师侧面移动，但始终锁住他的超近面部：从接近正面的角度经过三分之二侧面直到侧脸，眼睛和嘴仍然清晰，保持相近的面部尺寸，绝不后退成双人中景。他盯住她，用日语说：“まだ津波警報が出てる！” 他的话逐渐变成恳切的阻止，眼中有对她可能遭遇死亡的担忧。

摄影机继续沿真实可通行的侧向弧线走到工程师肩旁，只有此时才从他的近侧脸连续转向女职员的脸，同时平滑转移焦点。工程师的脸从画框边缘退出，她的极近面部随即进入并填满画面。两个人距离近而略错开，摄影机从侧边绕行，不穿过身体；利用近处脸颊、帽沿或肩膀经过画面边缘形成连续视差，不做全黑遮挡切换。整个绕行只在一个人的超近脸与另一个人的超近脸之间转移，没有两人并排完整出现的中景。

完成绕行后，摄影机已经位于两人的另一侧，观看走廊的
[… 510 chars omitted …]
。这个短暂的感谢完成后，她才转身攥着钥匙继续跑。没有新增对白，没有“Go straight home”。钥匙始终由她持有，工程师不捡、不接、不递钥匙。

整段走廊始终有许多员工在紧急奔跑，但所有背景员工永远沿同一个物理方向前进，朝电站内部撤离。方向不因摄影机转向而改变，不出现逆行背景人群、随机来回奔跑或反复循环的同一个人。摄影机近旁和走廊后景不断有下一批员工接续经过，不能只在结尾才出现人群。女职员是唯一朝相反方向、向出口奔跑的人。即使在面部超近景里，画框边缘经过的模糊肩背、人物间隙中的移动和持续脚步声也让人感到人流没有停下。背景流动不遮住关键眼神与台词。

她转身后，摄影机只在工程师身旁迟留一瞬，感受他放手后的沉重，然后沿通道向前加速，追上她的后脑与肩膀近景。其他员工从她前方跑来，与她擦身而过，继续朝摄影机及工程师所在的方向前进。她独自逆流而行。摄影机在真实间隙中跟随，不撞穿人群，不通过突然变焦追上她，也不拉成远景。

她从走廊转入相连的楼梯，向下跑到转折平台，再转向下方出口。摄影机紧随其帽后与肩侧，真实降低高度并转过平台；扶手、阶梯和平台边缘在近景边缘连续经过，明确表现向下走，而不是沿水平走廊奔跑。出口距离短，人物动作正常速度。她推开下方门冲向明亮的室外，摄影机跟到门槛。强烈外光自然进入镜头，轮廓仍短暂可见，亮部逐渐过曝；不使用白色转场特效，不在白光里剪辑，整段连续运动直到结束。

摄影以自然的面部比例、皮肤细节、湿润眼睛和嘴部呼吸为主，近乎微距的亲密感，但不使用贴脸广角畸变。不要为了让整顶帽子、完整肩膀或两人关系入画而后退。焦点跟随当前重要的脸或手，背景柔化而有层次。顶灯与实际侧面灯光塑造明暗，保留自然肤色和有方向的阴影，走廊没有窗户、海景和窗光。碰撞时短促震动，随后是有重量、有惯性的跟随，不持续随机甩镜。

声音是沉重喘息、同向奔跑的许多脚步、衣料摩擦、钥匙撞击和门声，以及远处不可辨的紧急工作喊声。只有上述四句日语对白，由指定人物各说一次，声音与口型一致。没有旁白、字幕、音乐、额外对白、whoosh或swish。保留请求之后的情绪停顿，人群与危机在停顿中仍然继续。
```

### E8. f5499d1f — seedance_2_5 · Animation/Sc_04 · 2026-09-14 14:24
FINAL Sc_04 (Seedance 2.5, 23 s, **720p**, 6 elements incl. the pencil sketch). Shown: the reference-asset block, which says exactly what each element controls and how the sketch is used (pose only, no sketch style).
```text
参考资产：

<<<ba1c6732-4056-42fe-b806-5e2b4f9b656e>>>控制年轻女员工的身份、脸部、发型、身材和蓝色工作服。

<<<5db772a2-405f-4754-a7c4-f3a16e1df932>>>控制工程师的身份、脸部、眼镜、身材和蓝色工作服。与他交谈的男员工穿同款工作服。

<<<39d3785f-f508-42f5-99b0-0f779d72b15f>>>是室外环境和空间地理的唯一依据：保留厂房、左侧一楼带照明雨棚的出口、二楼玻璃走廊、停车场、海岸、防波堤、阴沉天气，以及红色汽车的外观、尺寸、停车位置和朝向。女员工从参考图左侧一楼清楚可见的同一扇门跑出来。海啸撞击之前，汽车保持原位，车头朝海面和防波堤，车尾朝厂房。保持原始地理关系，不镜像环境，不交换车头车尾，不生成第二辆红色汽车。

<<<4b7250d9-7fe2-4b86-9d2c-8953f55139eb>>>控制红色汽车的全部内部结构。严格保留方向盘、驾驶座、前排乘客座、仪表台和中央控制台的对应位置。方向盘正后方始终是驾驶座，驾驶座外侧紧邻的前排车门始终是女员工进入的同一扇门。忽略参考图中的灰色背景，车窗外连接<<<39d3785f-f508-42f5-99b0-0f779d72b15f>>>中的停车场，前挡风玻璃面向海面。

<<<82d8c739-82d7-428f-a568-ddf3a28f3846>>>控制安全帽的白色材质、红银条纹、红色标志和黑色系带。女员工、工程师和其他厂区员工最初都佩戴同款安全帽。女员工进入汽车以后摘下安全帽。

<<<e66d1671-9f35-494e-9ac9-0b66314c5e87>>>是一张姿态与空间关系示意草图，仅用于理解女员工刚坐进驾驶座时的身体姿势、头部朝向、手臂位置，以及她与座椅、方向盘和车门之间的关系。草图中的线条、笔触、色块、纸张质感和绘画风格不进入生成画面。女员工的脸部身份、头发和服装由<<<ba1c6732-4056-42fe-b806-5e2b4f9b656e>>>控制，车内结构与真实材质由<<<4b7250d9-7fe2-4b86-9d2c-8953f55139eb>>>控制，安全帽由<<<82d8c739-82d7-428f-a568-ddf3a28f3846>>>控制。整段画面始终保持写实电影影像。草图只辅助确定刚上车时的姿态，之后人物和摄影机继续按照下述动作自然运动。

风格与连续性：

写实灾难电影质感，低饱和冷灰蓝调，阴沉自然光。

女员工的表演有三个连续阶段：跑向汽车、上车和启动发动机时，她紧张、急躁、拼命赶时间，呼吸短促，动作迅速；看见近在眼前的海啸时，她突然僵住，身体和呼吸短暂冻结；海水撞上她以后，冲击打破僵直，她立即拼命挣扎逃生，却始终无法脱困。

全片是一个连续长镜头，没有剪辑、隐藏剪辑、时间跳跃或瞬移。摄影机从厂房走廊穿过出口进入停车场，再通过敞开的驾驶座车门进入汽车。门框、人物身体、曝光变化和运动模糊都不能掩盖转场。

只有工程师段落使用一次连续的光学推近与拉远：从汽车旁推近二楼玻璃后的工程师，再拉远回到同一扇敞开的驾驶座车门。其余段落依靠摄影机实际移动改变构图。

动态描述：

镜头从厂房内部走廊开始。摄影机紧跟在<<<ba1c6732-4056-42fe-b806-5e2b4f9b656e>>>女员工身后，首先清楚看到她的背部、肩膀和戴着<<<82d8c739-82d7-428f-a568-ddf3a28f3846>>>安全帽的后脑。她突然用力推开出口，冲向室外。这是<<<39d3785f-f508-42f5-99b0-0f779d72b15f>>>左侧一楼带照明雨棚的同一扇门，从室内看到它的背面。

门打开时，室内外亮度差使曝光短暂调整，门框和女员工的轮廓始终可见。她先跨过门槛，摄影机紧跟着穿过同一个门口。整个出门过程保持从背后跟随，完整显示从走廊到停车场的连续运动。

进入室外以后，她立即快速跑向原位停放的红色汽车。奔跑段落短促、急迫。摄影机贴近跟随，随着她接近汽车，沿一条短弧线移到她身侧前方，拍到她紧绷的脸和急促的呼吸，并让厂房立面进入她身后的背景。

她直接来到距离摄影机最近的驾驶座车门旁。这扇门紧邻方向盘正后方的驾驶座。她的注意力集中在车锁上，迅速取出机械钥匙，插入锁孔并转动。

摄影机在汽车旁停住实际位移，稍微向上调整取景，随即进行连续光学推近，将观众的注意力从前景女员工转移到厂房二楼的大面积玻璃窗。摄影机始终位于停车场地面，
[… 2,776 chars omitted …]
```

### E9. cca572b7 — seedance_2_5 · Animation/Sc_07 · 2026-09-14 15:19
FINAL Sc_07 dark half (Seedance 2.5, 28 s, 1080p, 6 elements + 4 images: GPT-edited frame + 3 snapshots of earlier takes). English screenplay style: global header, then timecoded blocks with CAPS, NO-lists, Japanese 「」 lines, and image_N keyframes pinned to timecodes. The same text minus the image_3/image_4 pins (66ec4fac, 720p) gave the lit first half.
```text
Serious grounded disaster drama, natural colors and lighting, realistic industrial environment, handheld but controlled camera movement. Urgent pace throughout. No cuts. The engineer is <<<265ebe37-66c1-4760-ac3a-7a44769999d6>>>. He is wet, wearing a safety hat (<<<82d8c739-82d7-428f-a568-ddf3a28f3846>>>) in a rush and trying to maintain an image of confidence despite the circumstances slipping out of control. His flashlight is <<<1159f17a-d92b-44cb-9fc9-0035c7275fab>>> 1. The atomic power plant control room is <<<4b381f91-17fc-43f6-aa1f-fe7439ebbf6e>>> and <<<172fd4ec-564f-4e70-8a64-006f1c83ec3e>>>. The staff in the control room are all worried and operating with urgency mixed with subdued fear. NO MUSIC, SFX ONLY

 

00:00 – 00:10: START ON COMPLETE BLACK. The black screen is actually created by the ENGINEER'S dark back and shoulder filling the entire frame extremely close to camera. The Engineer is already moving quickly away from camera, rushing forward into the control room. As he runs, CAMERA RISES AND SLIDES OUT FROM DIRECTLY BEHIND HIS SHOULDER. The image gradually opens from black as the camera emerges from behind his body, revealing the control room ahead. For the first moment we see almost nothing except the Engineer's back. Then, during one continuous forward camera movement, his shoulder moves out of the way and the entire busy control room is revealed. CAMERA MOVEMENT — ONE CONTINUOUS 360° ORBIT:

The Engineer continues moving FORWARD across the control room in
[… 8,073 chars omitted …]
ad and dark. The entire control panel is a huge black, lifeless industrial surface, visible only where the flashlight beam passes across it. IMPORTANT: There must be absolutely NO electrical illumination coming from the control panels. The station has suffered a total electrical blackout. In the background, another WORKER pulls out his own handheld flashlight and switches it on. His second flashlight beam begins moving independently across another section of the dead control panels, searching for any sign of functioning equipment. This creates a second weak, moving practical light source in the otherwise completely dark room.

While the Engineer is still illuminating the dead panel, he asks quietly but urgently:

ENGINEER: 「非常用電源は？」 <<<image_1>>>: As he speaks, CAMERA begins a smooth movement around the Engineer. Camera moves from behind / beside him, circling around his body until it reaches a MEDIUM FRONTAL SHOT. His flashlight remains in his hand, pointed away from his own face. The only illumination on him comes indirectly from the moving flashlight beams in the room - ALL OF THE MONITORS ARE DARK AND OFF. MEDIUM SHOT — ENGINEER. He waits. No answer. He looks toward one colleague off-camera. Then toward another. A long, uncomfortable pause. His expression becomes increasingly tense. ENGINEER, more firmly: 「どうなんだ？」 He looks left, then right again, waiting for someone to answer. The background remains almost completely dark. Occasionally the other worker’s flashlight beam moves across the dead equipment behind him.

Another pause. Then, from somewhere in the darkness, an uncertain, defeated voice finally answers: WORKER (O.S.): 「落ちました。」

The Engineer freezes. He does not answer. CAMERA begins a very slow, suspenseful PUSH-IN toward the Engineer. From MEDIUM SHOT toward a CLOSE-UP. His reaction is restrained. For the first time, his professional confidence disappears. His eyes remain fixed somewhere off-camera as he processes what the answer means. His face slowly becomes more serious, disturbed and defeated, jaw clenched. He understands that both normal power and emergency power are gone, the control panels are dead, and there is no longer an obvious standard procedure that can immediately restore control. The realization should happen gradually in his expression during the slow push-in. Behind him, weak flashlight beams continue searching across the completely dead control room. No alarms. No ventilation. No machinery. Only breathing, subtle movement, and the faint sounds of people moving in darkness. Hold briefly on the Engineer’s face. CUT TO BLACK.
```

### E10. d9398bb4 — seedance_2_5 · Animation/Transition · 2026-09-14 18:31
FINAL in-fill (Seedance 2.5 video_edit, 6 s): the girl's exit door. This is the stable black-gap template: one sentence of intent → locked frames by number → new action, sub-timed → start and end matching → continuity of identity, props and light → "one real take" summary → keep the original audio.
```text
以<<<video_1>>>为唯一视频依据，重新生成2.000秒至4.000秒的连续动作：摄影机从背后跟随下楼的女子，她打开通往室外的门，跑出建筑，连续接上后段原视频的室外停车场画面。成片保持原视频6秒总时长、24fps、144帧及原始画幅。

最高优先级：0.000≤t<2.000秒和4.000≤t<6.000秒为锁定的原始视频，直接保留原帧，不重新生成、不重绘、不美化、不调色、不裁切、不变速。以第一帧编号为1：第1—48帧和第97—144帧必须与输入逐帧完全一致，每帧保持原时间位置；只生成第49—96帧。不得插入、删除、重复或移动锁定帧。4.000秒必须恢复输入的第97帧，而不是相似的重建画面。

2.000—4.000秒的新动作：承接第48帧，穿蓝色工作服、戴白色红条纹安全帽、脑后扎着马尾的女子已经下到出口门前。她延续下楼后的前进冲势，用空着的手抓住并压下门把手，将带竖向玻璃窗的门向室外推开。手与把手接触、门扇绕铰链打开、身体跨过门槛的动作连续可见，门打开到足够她和摄影机通过。她立即穿过门口，在室外继续加速跑向停车场，脚步与身体重心自然衔接后段原视频。不重新下楼、不停在门口等待、不重复开门。

摄影机始终跟在女子身后，延续原视频的高度、朝向和前进惯性，跟她穿过同一个真实打开的门口。门框从画面两侧自然掠过，室内墙壁逐渐离开视野，室外建筑外墙、阴云天空、路灯和停放的汽车随通过门口连续显露。女子跑得比摄影机稍快，两者距离自然增加，逐渐达到第97帧已有的室外背面构图和人物大小。摄影机不绕到正面、不穿过门板或玻璃、不变焦、不跳到室外机位；从楼梯间到室外始终是一条连续的跟随路线。

新片段的起点匹配第48帧的头盔、马尾、肩背位置、身体姿态、手部状态、门的位置与摄影机运动；终点自然接入第97帧的跑动姿态、人物大小、位置、摄影机高度与速度，以及建筑左侧外墙、停车场车辆和海边背景的空间关系，不把边界帧复制成停格。保持同一女子、同一套工作服、同一顶安全帽和同一条马尾，衣服与头发随跑动自然摆动。出门时曝光和色温随室外阴天光线平滑变化，保持后段原视频的天空、地面与车辆外观。

整个6秒看起来是同一台摄影机连续从背后拍下女子下楼、开门、穿过门口并跑向室外停车场的一次实拍。第49—96帧每一帧都呈现连续可见的人物、门口或室外空间。无剪切、隐藏换镜、叠化、淡入淡出、形变或瞬移，不增加额外机位或额外剧情。原视频已有声音保持原时间位置，不增加对白、音乐或镜头whoosh音效。
```

### E11. 69db3315 — seedance_2_5 · Animation/Сleanup · 2026-09-14 11:13
Masked prop repair (Seedance 2.5, 5 s, 1080p; video_1 = clip with the gauge blacked out; image_1 = correct first frame, image_2 = gauge housing/scale, image_3 = gauge in darkness). English: "Locally repair the gauge covered by the black mask in <<<video_1>>>, appearance strictly from the references. image_1 = correct first frame and display; image_2 = housing, scale, segment layout and grey unlit area; image_3 = gauge appearance in darkness. Keep the correct first frame. Remove the black mask … upper half grey non-emissive segments, a short yellow zone in the middle, green below. Match the original position, perspective, size, camera motion, motion blur and occlusion by people. Images are visual references only; do not insert stills or transitions. Keep the original 5 s, composition, camera, people, lighting and sound. Fix only the gauge."
```text
局部修复 <<<video_1>>> 中被黑色遮罩覆盖的温度表，外观严格按照参考图片还原。

<<<image_1>>> — 视频正确的第一帧及仪表显示参考。
<<<image_2>>> — 仪表外壳、刻度、分段排列和灰色未点亮区域的详细参考。
<<<image_3>>> — 仪表在黑暗环境中的外观参考。

保留正确的第一帧。去除后续画面中的黑色遮罩，恢复同一个仪表的表面、外壳、数字、刻度和分段。显示外观与参考图片一致：上半部分是没有自发光的灰色分段，中间是参考图中的短黄色区域，下部是绿色区域。

仪表准确匹配原视频中的位置、透视、尺寸、镜头运动、运动模糊和人物遮挡。

图片仅用作视觉参考，不插入静帧或转场。保留 <<<video_1>>> 原始的5秒时长、构图、镜头运动、人物及其动作、原有照明和声音。只修复指定的温度表。
```

### E12. 449cfb48 — seedance_2_5 · Animation/Sc_07 · 2026-09-14 16:39
FINAL reactor (Seedance 2.5, 12 s, 1080p, image-to-video from element loc_r2, English). Simple structure: anchor → "keep exact" → start state → main visual event stated three times → negatives (NO glow, NO Cherenkov) → CAMERA MOVEMENT → progression arrows → "IMPORTANT: only water, bubbles, steam, droplets and camera move" → one-idea ending.
```text
<<<191f2137-9c98-4f12-bbc1-1f5c14a11a04>>>  is the reference for location. Animate the existing image as a realistic, continuous shot inside an overheating boiling-water nuclear reactor.

Keep the exact same reactor interior, fuel assemblies, materials, lighting, color palette and composition from the source image.

The camera starts almost static, underwater and very close to one of the fuel assembly.

At the beginning of the shot, water bubbles obscure the fuel assemblies.

The waterline slowly recedes, so that the camera ends up above water - steam slowly drifts and clears, revealing more of the vertical fuel assemblies behind it.

The reactor water is violently agitated by residual decay heat:
strong turbulent movement,
continuous streams of bubbles rising from below,
small splashes around the fuel assemblies,
dense vapor and steam forming above the surface.

The water must NOT behave like an explosion or a giant wave.
It should look like extremely hot reactor coolant undergoing intense boiling and steam generation after loss of cooling.

As the shot continues, the WATER continues DROP, receding towards the bottom of the frame, so more of the fueal assemblies appear over the water line

This is the main visual event.

The waterline slowly but clearly moves downward across the frame.

The drop must be noticeable during the shot, not subtle.

As the water level falls, progressively more of the upper sections of the fuel assemblies become exposed above the surface and more vapor is created.

The exposed metal remains wet, dark and realistic.
Water runs and drips down the newly exposed rods and structural elements.

The exposed fuel assemblies do NOT glow red or orange.
No flames.
No visible radiation.
No blue Cherenkov glow.
No molten material.

The boiling continues while the level is dropping:
bubbles keep rising,
steam becomes denser around the newly exposed sections,
hot vapor rolls upward through the reactor interior.

CAMERA MOVEMENT:

During the entire shot, the camera performs a very slow, smooth PULL BACK.

The camera gradually moves backward and slightly upward, revealing a wider view of the reactor core and more rows of fuel assemblies.

The movement is subtle and cinematic, not dramatic.

By the end of the shot, we understand the scale of the reactor core:
many vertical fuel assemblies extending into the background,
partially disappearing into steam and darkness.

The falling waterline remains clearly visible throughout the camera pullback.

The visual progression should be:

dense steam partially obscuring the core
→ steam briefly clears
→ violent boiling becomes visible
→ water level begins falling
→ more fuel assemblies are exposed
→ camera slowly pulls back to reveal the larger array
→ steam thickens around the exposed fuel assemblies.

The atmosphere should become increasingly dangerous and oppressive without any explosion.

Realistic physical behavior.
Grounded historical disaster drama.
Natural industrial lighting.
Dark steel-gray color palette.
Photorealistic water, bubbles, condensation and steam.

IMPORTANT:
Do not deform or redesign the fuel assemblies.
Do not move the reactor structures themselves.
Only the water, bubbles, steam, droplets and camera should move.

The reactor structures remain massive, rigid and stationary.

The final image should clearly communicate one idea:
the reactor is still producing heat, but the cooling water is disappearing and the fuel assemblies are beginning to become uncovered.
```


## Adopt
1. **Lock everything as Reference Elements before animating.** Use one element per identity and per state (dry/wet, helmet on/off, gauge state), and name them `char_/loc_/prop_`. In each Seedance prompt, give every element one line: what it controls, what it must NOT impose ("not a first frame, not the sheet composition").
2. **One lens and grade pass on every location plate** before it becomes an element: write the optical character once (distortion, black lift, grain) and apply it to all plates with "lens only, do not relight".
3. **Character pipeline:** costume canon with HEX map → face cast inside the real location → grey-studio front/back sheet → close-up crop → skin pass → 3-panel sheet. Make wet or damaged variants as separate sheets.
4. **Seedance scene prompt order:** contract line (format, one take, no cuts) → reference roles → inner story and emotion with limits → "only one camera route" summary → leg-by-leg paragraphs (camera → frame → action → line → focus) → physics and continuity rules → extras behaviour → optics → sound list plus "No music".
5. **When a persistent behaviour (shake, flicker, wet state) drops out, move it to line 1 and repeat it as a short refrain at the start of every beat paragraph**, rather than adding more text further down.
6. **Iterate long or complex takes at 720p, then switch to 1080p** for the final once the prompt is stable (Sc_07: 31 × 720p, then 14 × 1080p).
7. **Join takes with frame-locked black-gap in-fills** (`video_edit`, 4–12 s, frame numbers, "black is a placeholder", start and end frame matching, original audio kept). This is the strongest technique in the project for invisible transitions and for "one-shot" films.
8. **Fix props with a masked `video_edit`** using 2–3 state images, rather than regenerating the take.
9. **Use darkness as a splice point** to combine the best halves of two takes.
10. **Use a pencil-sketch version of a frame** as a pose and blocking element when the photoreal frame would hijack the first frame or the lighting.
11. **Extras rule in every prompt:** each extra has a task, all flow in one direction, nobody watches the lead.

## Do not copy
- The Fukushima story, TEPCO-style uniforms with the four-dot emblem, the white helmet with the red stripe, the oarfish motif, the coffee-cup rise, the red kei car and gauge beats, the dialogue lines, and the poster designs. Take the methods only (element contracts, lens pass, in-fill stitching, 720p→1080p, masked repairs).

## Proposed skill changes (→ LESSONS.md as "proposed")
- `seedance-*` modules: add the scene-prompt block order above and the "contract line first / failing behaviour to line 1" rule.
- New module `seedance-transition.md`: the black-gap in-fill template with frame-number math (24 fps: 2.000 s = frame 49) and the do-not list.
- `style.md`: add a "lens pass" step for every location plate and a single red-accent rule.
- `characters.md`: 3-panel sheet on mid-grey, state variants as separate elements, skin-pass step.
- Pipeline: 720p prompt iteration → 1080p final; snapshot good frames of takes as `<<<image_N>>>` keyframes for the next version.
- Repair module: masked video_edit with first-frame and state images; splice at blackouts.
