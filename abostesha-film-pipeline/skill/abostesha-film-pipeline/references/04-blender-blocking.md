# 04 — Blender Blocking: Greybox Guides for Seedance (Step 4)

**Purpose.** Turn the locked script and dialogue into a numbered shot list and a timed animatic. For every shot whose camera, staging or motion is hard, build a greybox playblast: simple primitives, colour-coded stand-ins, real lenses, timing locked to the ElevenLabs lines.
**Output.** The shot-by-shot blocking table, an animatic for the whole film, and per BLOCK shot a clean playblast that Seedance 2.5 accepts as `@Video1`, plus stills, a dialogue track and a hand-off sheet, all versioned on Google Drive.
**Rule.** The blockout owns camera, timing, layout and motion. It never owns look. Playblasts are references only and never appear in the film. Calendar: shot list on D3–D4, greybox batches on D4–D5, playblasts and animatic v1 on D6, **animatic lock on D7** (00-award-brief-and-calendar.md §0.7).

Talk to the user in Arabic (addressing him as أبوستيشا). Write the friend's brief, hand-off sheets and every prompt clause in English, unless the user says his friend prefers Arabic. Blender UI terms stay in English either way.

---

## Inputs

| Input | From | Required |
|---|---|---|
| Locked script, scene list `S##`, feasibility flags, DIRECTOR NOTES | 01-script-and-dialogue.md (Gate 1A) | yes |
| Selected takes per line, measured seconds, per-shot WAV copies `SLA_<SHOT>_<LINE>_<CHAR>_T<NN>.wav` | 01 §1.2.8 (Gate 1B, dialogue lock) | yes, before durations are set |
| Lens ladder (36 mm sensor width, fit Horizontal), camera behaviour per variant (R-DAY, R-INT, DREAM, BROADCAST, FINALE), 24 fps | 02-style-prefix.md §2.5, §2.11 | yes |
| Character heights (cm), dominant costume colours, asset IDs (`CHR_MIRAJ`, `LOC_METRO-WALKWAY`) | 03-assets-images.md continuity-bible entries | PROVISIONAL is fine for D4 |
| Sun azimuth and elevation per location and story date, north direction | ledger-continuity-physics.md | for exteriors |
| Friend's availability and realistic shots per day | 00 Inputs | yes |
| Blender access: friend's machine, or the user's Blender connected through an MCP | 4.8 | at least one route |

---

## Hard rules

1. **Reference only.** A playblast, Blender render or layout still never goes into the edit. It would count against the 70% Seedance share and break the photoreal look (00 §0.4).
2. **The guide copies defects as faithfully as intent.** A bent pole came back as a snake, loose blocks as extra people, a car with no marked front driving in reverse, a hero keyed past a roof edge air-walking (scenario-labs; greybox-director). Fix identity and physics in geometry first and in prompt text second.
3. **One BLOCK shot = one Seedance generation.** The playblast lasts exactly G whole seconds, 4 ≤ G ≤ 15. The clip length equals the requested duration. Seedance stretches a shorter reference, and the motion turns floaty (greybox-director). The 2.5 API accepts 4–30 s, but the 15 s cap is our house rule: clips of 10–15 s held layout and clips of 20–30 s drifted (scenario-labs audit of 28 renders).
4. **Colour carries identity.** One saturated colour per hero, a grey set, a dark world. Never deliver an all-grey playblast: one provider's input screen refused a bare grey mannequin clip, while saturated colours passed (scenario-labs).
5. **The upload copy is clean:** no overlays, gizmos, path lines, empties, camera frustums, text, burn-ins or audio. BytePlus's own clay-model guidance asks for no trajectory lines, coordinate lines or camera cones. A video's audio track can be read as a reference, so the upload copy is silent.
6. **Lens discipline.** Use only focal lengths from the 02 ladder. Never animate a lens jump. A cut changes lens only by changing camera.
7. **IDs from 01, never renumbered.** Shots are `S07-SH03`; inserted shots are `S07-SH03A`; a cut shot stays in the table as `OMITTED`.
8. **Holdback.** Drive folders are shared only with named people (the user, the friend). Never use "Anyone with the link". No playblast is posted anywhere (00, holdback).
9. **No generation or imported assets in this step.** Do not use the Higgsfield add-on's Video, Scene builder or other paid tabs, ahujasid's `generate_3d`, `search_assets` or `import_asset`, or any `generate_*` call. Build with primitives only. Seedance runs only in 05-seedance-production.md, where it is logged.
10. **Authorship is logged per shot.** Record who keyed it (friend, user, Claude) and who approved it. Human-keyed motion on the primary subjects is evidence for the authorship dossier (00 §0.11). Record the Blender version and the MCP server and version in the ledger's "Tools that shape frames" pin, so the disclosure (00 D1) can list Claude and the MCP as support tools with a 0% share of the final picture.
11. **G-rated staging.** Block no violence beyond mild, and no drug, alcohol or tobacco props. Re-check any beat 01 flagged.

---

## Procedure

### 4.1 Shot list and triage (D3–D4)

1. Break each locked scene into shots. One shot holds one readable idea. A beat that needs two ideas is two shots. **Two people talking in one ON shot is unsolved** (01 §1.2.6): give each speaker their own shot, or shoot the reverse over the listener.
2. For each shot, set size, lens, camera height, move and screen direction. Take them from the scene's 02 variant:

| Variant | Camera behaviour in Blender (PROPOSED amplitudes) |
|---|---|
| R-DAY | handheld at operator height 1.5–1.7 m; NOISE budget "rail + aim" (4.4) |
| R-INT | handheld, close, slower: half the R-DAY location amplitude, same rotation |
| DREAM | locked-off, or perfectly smooth Bezier glides; exact symmetry about the frame centre; no noise |
| BROADCAST | locked-off; push-ins at constant motor speed with short eases only at the ends |
| FINALE | steadied handheld: about half the R-DAY amplitudes |

3. **Duration.** Edit length L (frames) comes from the measured dialogue plus action and reaction beats. Generation length is `G = max(4, ceil((L + 24) / 24))` seconds. That adds at least 12 frames of head handle and 12 of tail handle at 24 fps; rounding up adds the rest to the tail. If G > 15, split the shot or plan a cut. Inserts shorter than 4 s still generate 4 s; 07-edit-mix-finish.md trims them. For every shot with an ON line, re-run 01's preflight (§1.2.6) against the real shot: keep the clip to 3–8 s with one speaker, or mark the line REBALANCE and tell the user.
4. **Triage** each shot into one mode:
   - **BLOCK** (full playblast) if any of these hold:
     - the camera moves and the move carries meaning;
     - two or more subjects relate by position or eyeline;
     - there is a travel path, vehicle or crowd reaction;
     - there is a physics event (jump, fall, water entry, contact, glass);
     - it is the master shot that fixes a location's geography;
     - dream geometry must hold exact symmetry.
   - **STILL** (one 1920×1080 camera still as a layout reference): one subject, simple action, and a camera that is static or carries only the variant's default drift. That drift is written in the prompt (05), not blocked.
   - **TEXT** (no Blender): inserts, macros, HUD and screen graphics (planned as post graphics per 01 `LEGIBLE-TEXT`), and simple B-roll. A full-frame post graphic is non-Seedance picture. Add its seconds to the 00 §0.4 non-Seedance budget (≤ 10% of T), and show the running total in T1.
5. **Capacity check.** BLOCK count ≤ (friend's shots/day × greybox days D4–D6) + Claude's MCP capacity. If it does not fit, demote the easiest BLOCK shots to STILL. Never shorten the animatic. Hardest shots go first, so that 05 can start drafts on D7.
6. Build the blocking table (template T1). Show it in Arabic and get the user's choices on every PROPOSED cell.

### 4.2 Location sets: one geography per location

- Build one set file per location: `SLA_LOC_<LOC>_SET_v##.blend`. Every shot file **links** it (File ▸ Link, collection `ENV`), so geography stays identical across shots. Change the set only in its own file, then bump its version.
- Fix conventions in every set:
  - metres, Z up, ground at z = 0;
  - +Y = north, +X = east;
  - the action line for each scene drawn as a hidden-in-render curve `LINE_<S##>`.
- Use thick boxes at true scale and leave nothing thin or floating. Model only what the frame or the motion touches. Default dimensions:
  - door 0.9–1.0 × 2.1 m;
  - ceiling 2.5–3.0 m domestic, 3–3.5 m commercial;
  - table 0.72–0.75 m; chair seat 0.42–0.45 m; counter 0.9 m;
  - car 4.6 × 1.95 × 1.45 m;
  - city bus 12 × 2.55 × 3.1 m;
  - light-rail car 2.3–2.65 m wide, 3.3–3.6 m tall;
  - street light 6–8 m (scenario-labs contract tables).
  2nd Life dream booth: 1.2 × 1.2 × 2.4 m, PROPOSED until 03's location sheet sets it. Log every assumed size in the hand-off sheet.
- **Populate the exit.** The model cannot invent structure the greybox lacks, so an empty exit or turn renders as a void (greybox-director). Line every area the camera ends on.
- **Skyline rule.** For rooftop or elevated action, keep the flanking buildings below the action line, or the roofs read as streets (greybox-director).
- **Sun (exteriors).** Add a sun object `LGT_sun_<LOC>`, set from the ledger's azimuth A and elevation E: direction to sun d = (sin A·cos E, cos A·cos E, sin E). Point the lamp with `sun.rotation_mode = "QUATERNION"; sun.rotation_quaternion = Vector(d).to_track_quat("Z", "Y")`, because the direction to the sun is the lamp's local +Z. It is data only and not rendered in Workbench. Alternative: the Sun Position extension (extensions.blender.org, v4.4.0, Blender 4.2+), set to Dubai 25.2048 N, 55.2708 E, UTC+4 and the story date, with North Offset matching +Y.

### 4.3 Stand-ins and the colour legend

Seedance copies whatever moves in the clip, limbs included. Choose per character who animates the body: the blockout or the model.

| Stand-in | Use for | Seedance 2.5 behaviour (scenario-labs tests, Oct 2026, one take per cell) |
|---|---|---|
| **Featured capsule**: coloured capsule, ball head, 2–3 signature features | **default for every human hero** | a real run with its own rhythm per character; 5 identities and the running order held across 4 cuts |
| Plain capsule | extras; heroes far apart | natural motion, but identities can swap |
| Capsule + `arms` (no legs) | seated or gesturing shots, a held phone, a handshake or fist bump | hand positions come from the blockout; the gait comes from the model |
| Jointed figure or rigged mannequin, torso in the identity colour | only when the blockout must own the limbs: a specific gesture, a fall, **robots** | jointed humans came back upright, with short lockstep strides |

- **Features** exist to tell characters apart and anchor the one story object, not to model a costume. Give every speaking character a small `nose` block on the head, so head turns and eyelines read.
- **Seated figures:** root height = seat height − 0.47 × body height (scenario-labs). The head top then lands near the 1.35 m seated head height. The capsule's lower part passes into the seat by design, so exempt that pair from the intersection audit.
- **Identity colours** (linear RGB, set on both the material and the object colour; Viewport ▸ Solid ▸ Color: Material):
  - red 0.80, 0.05, 0.05
  - blue 0.05, 0.18, 0.85
  - green 0.05, 0.60, 0.12
  - yellow 0.90, 0.72, 0.04
  - purple 0.50, 0.07, 0.78
  - cyan 0.04, 0.75, 0.80
  - set greys 0.32–0.55; extras mid-grey; world colour 0.035–0.055
- **Choosing a hero's colour.** Give each hero the palette colour nearest its dominant costume colour on the 03 sheet. If the costume is black, white, grey or brown, use a featured capsule: the capsule takes the next free colour, and the costume colour goes on the worn feature (coat, hood). The legend names both.
- **Robots** (the greeting robot, Noah if he is ever seen in person): use a jointed stand-in in its own colour. Stiff, mechanical motion is acceptable here. The faulty leg is hand-keyed: the left leg (ledger C4), with a limp from shorter stance time on that side. A/B it against a capsule on a 4–6 s window before the long pass.
- **Vehicles, bus, metro train:** a literal box with the front marked in geometry: light-grey headlight blocks and a grille at the front, dark-red blocks at the rear. Wheels sit at z = radius.
- **Crowds** are grey capsules with real displacement. A reaction is choreography: a flinch or dash keyed as movement that never undoes itself (greybox-director). Give idle extras a small sway.
- **Thin objects** (phone, lens case, ticket) turn into a line when seen edge-on and vanish. Thicken them, or angle them toward the camera (jellypoplabs whitebox-check).

### 4.4 Cameras and lenses

- **Camera settings.** One camera per shot, `CAM_<SHOT>`:
  - sensor width 36 mm, Sensor Fit Horizontal;
  - Clip Start 0.05 m (0.03 for macro);
  - Depth of Field off; motion blur off.
  Write focus intent in words in the hand-off sheet ("focus on Miraj's face, background soft"); 05 writes it into the prompt.
- **Lens math** (36 mm wide at 16:9, so the effective sensor height is 20.25 mm):
  - `focal = 20.25 × distance / vertical coverage`
  - `distance = coverage × focal / 20.25`
  - Same size on another lens: `d2 = d1 × f2 / f1`
- **Coverage by shot size** = subject height × 4 / 2 / 1.15 / 0.8 / 0.6 / 0.4 / 0.25 / 0.12, for EWS / WS / FS / MWS / MS / MCU / CU / ECU (scenario-labs previs). For Miraj at 1.74 m:

| Size | Coverage | 24 mm | 35 mm | 50 mm | 85 mm | 135 mm |
|---|---|---|---|---|---|---|
| WS | 3.48 m | 4.1 m | 6.0 m | 8.6 m | — | — |
| FS | 2.00 m | 2.4 m | 3.5 m | 4.9 m | 8.4 m | — |
| MS | 1.04 m | 1.2 m | 1.8 m | 2.6 m | 4.4 m | — |
| MCU | 0.70 m | — | 1.2 m | 1.7 m | 2.9 m | 4.6 m |
| CU | 0.43 m | — | — | 1.1 m | 1.8 m | 2.9 m |

  For 05, give each focal length as its 02 ladder angle (full-frame diagonal): 24 mm ≈ 84°, 35 ≈ 63°, 50 ≈ 47°, 85 ≈ 29°, 135 ≈ 18°. These five are the ladder. Use 28 mm (≈ 75°), 40 mm (≈ 57°) or 65 mm (≈ 37°) only if the user adds that rung to 02 first. Blender's FOV field shows the horizontal angle, so never copy it.
- **Matching a real camera package.** Full-frame-equivalent focal = real focal × 36 / real sensor width. Take the sensor width from the manufacturer's spec sheet, never from memory (02 §2.2). Camera and lens brand names never enter a prompt.
- **Eye height** ≈ 0.93 × body height (1.62 m for Miraj). Eye level is neutral; low or high angles need a stated reason in the table.
- **Rail rig** (scenario-labs): the chain is
  - a Bezier curve `CRV_<SHOT>`;
  - a dolly empty `RIG_dolly_<SHOT>` on Follow Path with a fixed position, keying `offset_factor` 0 → 1;
  - an aim empty `RIG_aim_<SHOT>` with Track To (‑Z, up Y) on `NULL_target_<SHOT>`;
  - the camera under the aim at zero local transform.
  Reframe by moving the target, never by rotating the camera. For a straight push-in, parent the camera to a dolly empty with fixed rotation and no Track To.
- **Tracking shots** are planned as rows of (frame, lead distance, coverage). Lay the rail along the subject's path at the planned height and side offset. Ease the lateral offsets to zero through turns, and scrub for collisions (greybox-director).
- **Handheld** uses NOISE F-curve modifiers, never keyed jitter. Starting budgets (scenario-labs, measured):

| Setup | Channel | Amplitude | Noise scale |
|---|---|---|---|
| Rail + aim | camera location sway | 0.045–0.055 m | 205–250 frames |
|  | camera rotation sway | 0.015–0.018 rad | 235–280 frames |
|  | tremor | 0.005 m, 0.002 rad | 7–12 frames |
| Dolly > gimbal > camera | dolly location | 0.035–0.045 m | 13–19 frames |
|  | camera rotation | 0.010–0.018 rad | 18–26 frames |

  Measured peak-to-peak rotation ≈ 0.66 × modifier strength. Re-measure after every rekey, because `animation_data_clear()` deletes the modifiers.
- **Limits to check:**
  - camera rotation ≤ 3° per frame (faster turns made the model freeze, then jump);
  - camera ≥ 0.8 m from walls and rails unless the contact is intended (closer reads as a collision or a cut) (jellypoplabs whitebox-check);
  - one side of the action line per scene;
  - journeys keep a fixed screen direction. PROPOSED: Miraj's trips to work run left → right and his trips home right → left.

### 4.5 Timing locked to dialogue, and the animatic

1. **Dialogue strips.** In each shot file, add the selected WAVs from 01 as Video Sequencer sound strips at the frame where each line starts. Set the scene to Playback ▸ Sync ▸ Sync to Audio and audio mix rate to 48 kHz.
2. **Line markers.** Add `L_<LINEID>_in` and `L_<LINEID>_out` at the measured start and end frames. Head turns and gaze shifts land 2–4 frames before the line they answer; performance detail belongs to 05b-acting-direction.md. Non-speakers stay still unless the table gives them a beat.
3. **Never stretch a line.** Never retime, speed up or truncate a WAV to fit a shot (01 §1.2.6). Change the shot length instead.
4. **Dialogue track per shot** (`_DLG_` file; 05 decides whether to send it padded or trimmed after test T2). The delay of a line starting on frame f is `(f − 1) / 24 × 1000` ms. One line:
   `ffmpeg -i <line.wav> -af "adelay=<ms>:all=1,apad=whole_dur=<G>" -ar 48000 -ac 1 -t <G> SLA_<SHOT>_DLG_v<NN>.wav`
   Two or more lines are mixed without level loss:
   `ffmpeg -i <L1.wav> -i <L2.wav> -filter_complex "[0]adelay=<ms1>:all=1[a];[1]adelay=<ms2>:all=1[b];[a][b]amix=inputs=2:normalize=0,apad=whole_dur=<G>" -ar 48000 -ac 1 -t <G> SLA_<SHOT>_DLG_v<NN>.wav`
5. **Whole-film animatic (D6), assembled in cut order.** Use the playblast for BLOCK shots, the layout still for STILL shots, and a black slate with the shot ID for TEXT shots. Add every selected dialogue WAV and no music.
   - Build it in a Blender VSE file `SLA_ANIMATIC_v##.blend`.
   - When no Blender is available, build it with ffmpeg from the cut-list CSV. Trim each clip by its handles, so the animatic shows edit lengths.
   - Export `SLA_ANIMATIC_v##.mp4` (1920×1080, 24 fps, shot ID and timecode burned in) and `SLA_ANIMATIC_v##_cutlist.csv` (shot, in TC, out TC, edit frames, G, mode). The user rebuilds the edit in Premiere from the CSV (07).
   - Timecode is 24 fps non-drop, starting 00:00:00:00 at the first frame after the Summit intro.
6. **Runtime check.** The body runs 6:00–6:30 (01 target) and the total with titles and credits stays ≤ 7:00. If it is over, cut shots or lines with the user. Never speed up the cut.

### 4.6 Motion and physics

- Key the root at the feet only. Travel is a table of (frame, position, facing).
- Use Bezier keys with Auto Clamped handles. Speed comes from key spacing; a pause is two near-equal values. Use LINEAR only for per-frame baked travel (vehicles, ballistic arcs).
- **Keys run past both ends.** Use last frame 168 and last key about 186. A subject already moving at the head gets its first key about 18 frames before frame 1. Nothing eases to a stop or a start on a boundary unless the beat is a stop. Never put a key on a cut frame; it freezes motion there. Keep the last second as controlled as the first, because end drift gets copied.
- **Human speeds:**
  - walk 1.2–1.5 m/s (default 1.35) at about 1.8–2 steps/s;
  - brisk 1.6–1.8 m/s;
  - jog 2.5–3.5 m/s;
  - run 4–6 m/s.
  A capsule bobs once per step and sways once per stride: about 2–3 cm at a walk, up to about 3.7% of height at a run. A capsule that only glides was rendered sliding (scenario-labs).
- **Ballistics** (jumps, falls, the dream pool entry): key the root every frame with `z(t) = z0 + vz·t − 4.905·t²`, x and y linear. Declare the airborne window in the table.
- **Support check:** outside declared airborne windows, the subject always has geometry under it (greybox-director). Feet and wheels of jointed figures and vehicles stay within 2 cm of the surface. A bobbing capsule leaves the ground by design, so audit capsules with a tolerance of 0.04 × the tallest figure's height (scenario-labs).
- **No interpenetration** beyond 2.5 cm, except intended contact.
- **CONTACT beats** (the robot fist bump): the touch happens on one named frame, with both hands' positions keyed. Log it for ledger-continuity-physics.md.
- **Doors and gates** open before the body reaches them. Vehicles accelerate along one monotone curve. A train passes at a constant 10–20 m/s.

### 4.7 Mode A: the Blender friend builds it

1. Ask once: «بأي لغة تفضّل أن أكتب ملف التعليمات لصديقك: الإنجليزية أم العربية؟»
2. Send the friend brief (T2) and the colour legend. Put both in Drive `_brief/`. Share the `04-blocking` folder with the friend as Editor, but only after the collaborator agreement is signed (00 R4) and the user says yes.
3. **D2:** the friend builds the generic stand-in kit `SLA_KIT_STANDINS_v01.blend`: capsules in the six palette colours, extras and vehicle blocks. Heroes get their legend colours and features when 03's sheets land (D4). Location sets start once the shot list names them (D3–D4).
4. **D4–D5:** per batch, he uploads files to the shot folders (4.11), sets the log status to REVIEW, and messages the user.
5. Claude reviews each upload (4.10) and returns notes by shot ID and frame number. A rejected version is never overwritten: the friend saves v+1.
6. **Optional accelerator.** scenario-labs `bx_blockout.py` and `bx_kits.py` (MIT, pure bpy, tested on Blender 5.2.1) build featured capsules, rails, cut markers and numeric audits. They are third-party code, so recommend them only after Claude has read the exact copy that will run. The friend can copy them from the repository's `scenario-blender-blockout/scripts/`. On a machine with Claude Code, and only after his yes for that install (COMPANIONS.md §5), `DISABLE_TELEMETRY=1 npx skills add scenario-labs/skills --skill scenario-blender-expert scenario-blender-blockout -a claude-code` installs the skills.

### 4.8 Mode B: Claude drives Blender through an MCP

**Channel.** Use one backend per session, and never switch backends mid-shot.

| Channel | Facts (checked 2026-10-30) | First calls |
|---|---|---|
| **Higgsfield Bridge** (`bl_*`; reaches the user's desktop Blender from claude.ai or a cloud session) | add-on for Blender 5.1+; connector `https://bridge.higgsfield.ai/mcp`; Z up, metres, radians; `bl_execute` runs bpy (assign to `result`) | `get_host_status`. If Blender is missing, ask the user to open Blender ▸ Higgsfield panel ▸ Connect. Then `bl_get_skill('blender-scene')` FIRST (no name gives the index), then `blender-scene-spec`, `blender-modeling` (its camera-read gate before detail), `blender-greybox`, `blender-lighting-camera`, `blender-animation`, `blender-audit-finalize`, and `blender-volatile` before any `bl_execute` Python |
| Official Blender Lab MCP (needs Claude on the user's machine) | Blender 5.1+, add-on 1.0.3; tools include `execute_blender_code`, `get_objects_summary`, `get_screenshot_of_area_as_image`, `render_viewport_to_path`, `get_python_api_docs` | `get_blendfile_summary_path_info`, then `get_objects_summary` |
| MCP for Blender, ahujasid (`uvx mcp-for-blender`, v2.2.6; needs Claude on the user's machine) | 9 tools incl. `execute_blender_code`, `look` (camera / frames views), `get_scene_info`; anonymous usage telemetry by default | set `DISABLE_TELEMETRY=true` in the MCP config before first use, and never tick its telemetry consent box: opting in sends prompts, code and screenshots of an unreleased film (holdback). Then `get_addon_status` |

- **On the Bridge.** Its modules are normative for *how* to call `bl_*` tools: API conventions, save policy, audits. This module governs *what* the guide contains. Skip its lookdev, HDRI, PBR and generation modules, because the playblast is a Seedance guide, not a render. The server's notes group `blender-greybox` with the generation workflows, so read it for blockout conventions only and never run a generation step from it (hard rule 9). If a module conflicts with a hard rule here, follow this module and tell the user which rule conflicted. The `blender-*` module texts have not been read yet. Read them on first connect and note any conflict in the blocking log. The Bridge also lists a browser "3D Blocking Studio" (`bs_*`); it is untested, so use it only if the user asks.
- **Lab and ahujasid** both default to port 9876. Never run them together.
- **Probe read-only first:** `bpy.app.version` (5.2 LTS is the target; scenario's toolkit is 5.2-tested), the open file, its scenes, unsaved changes. Never touch objects you did not create. Build in a new scene `BLK_<SHOT>`, or in a new file the user names.
- **Saves.** The Bridge rule is: save only when the user explicitly asks. Ask once: «هل تسمح لي بحفظ نسخة احتياطية منفصلة بعد كل مرحلة؟ ملفك الأصلي لن يُلمس.» With a yes, run `bpy.ops.wm.save_as_mainfile(filepath=<backup>, copy=True)` after each stage.
- **Execution hygiene:**
  - one short, idempotent stage per call, get-or-create by name;
  - every call first checks that the expected file and scene are open;
  - after a timeout, re-read the scene before doing anything; never resend blindly;
  - neither backend's `isError=false` proves the change happened, so read it back.
- **Build order**, one stage per call:
  1. format (`lock_format` below), collections, parked defaults, dark world;
  2. link the location set;
  3. stand-ins and their travel;
  4. props and vehicles;
  5. camera rig, lens, cut marker;
  6. motion polish and handheld;
  7. audits (4.10);
  8. stills at the first, middle and last frame and at every beat. Read each image: the Bridge's preview tool per `blender-scene`, Lab `get_screenshot_of_area_as_image` on a camera-view area with overlays off, or ahujasid `look` with the `camera` or `frames` view.
- **Playblast inside a live Blender** blocks the UI. Render the PNG sequence in chunks of about 72 frames per call (`render_chunk`), restore the frame range after each chunk, then encode (4.9). The scene can render its own MP4 when nothing outside Blender can encode it.
- **Authorship.** Log Claude-built shots as `channel=<bridge|lab|ahujasid>, keyed by Claude, directed and approved by AboStesha`. Offer the friend or the user a pass to adjust timing keys on hero shots.

**bpy snippets** for Blender 5.x. These are recipes. Run a snippet only after `blender-volatile` (on the Bridge) or `get_python_api_docs` (on Lab) confirms the API.
```python
import bpy, math
from mathutils import Vector
from bpy_extras import anim_utils

def lock_format(sc, seconds, fps=24):           # before any geometry
    sc.render.fps, sc.render.fps_base = fps, 1.0
    sc.frame_start, sc.frame_end = 1, fps * seconds          # 7 s -> 1..168
    sc.render.resolution_x, sc.render.resolution_y = 1920, 1080
    sc.render.resolution_percentage = 100
    sc.unit_settings.system, sc.unit_settings.scale_length = "METRIC", 1.0
    sc.view_settings.view_transform = "Standard"              # new scenes default to AgX

def camera(name, lens, clip_start=0.05):
    data = bpy.data.cameras.get(name) or bpy.data.cameras.new(name)
    data.lens, data.sensor_width, data.sensor_fit = lens, 36.0, "HORIZONTAL"
    data.clip_start, data.dof.use_dof = clip_start, False
    return data

def bind_cut(sc, cam_obj, frame=1):               # works headless
    m = sc.timeline_markers.new(f"CUT_{cam_obj.name}", frame=frame)
    m.camera, sc.camera = cam_obj, cam_obj

def fcurves(obj):                                 # 5.x slotted actions: Action.fcurves is gone
    ad = obj.animation_data
    bag = anim_utils.action_get_channelbag_for_slot(ad.action, ad.action_slot)
    return list(bag.fcurves) if bag else []

def handheld(cam, strength=0.022, scale=22.0, axes=(0, 2)):  # measure afterwards; peak-to-peak ~0.66 x strength
    # axes = tilt + pan: (0, 2) on a free camera rotated (90 deg, 0, yaw);
    # (0, 1) for a camera under RIG_aim at zero local rotation (local Y = pan, Z = roll)
    cam.keyframe_insert("rotation_euler", frame=1)            # a modifier needs an F-curve
    for fc in fcurves(cam):
        if fc.data_path == "rotation_euler" and fc.array_index in axes:
            n = fc.modifiers.new("NOISE")
            n.scale, n.strength, n.phase = scale, strength, 5.0 * fc.array_index

def max_turn_deg_per_frame(sc):                   # gate: <= 3.0
    prev, worst = None, (0.0, 0)
    for f in range(sc.frame_start, sc.frame_end + 1):
        sc.frame_set(f); q = sc.camera.matrix_world.to_quaternion()
        if prev is not None:
            worst = max(worst, (math.degrees(prev.rotation_difference(q).angle), f))
        prev = q
    return {"deg": round(worst[0], 2), "frame": worst[1]}

def lens_heading(cam):                            # deg clockwise from north (+Y); ledger lens_heading_deg
    fwd = cam.matrix_world.to_3x3() @ Vector((0, 0, -1))
    return round(math.degrees(math.atan2(fwd.x, fwd.y)) % 360)

def sun_relative(cam, sun):                       # + = sun to camera-left; 0 = sun ahead (backlight)
    to_sun = (sun.matrix_world.to_3x3() @ Vector((0, 0, 1))).normalized()
    fwd = cam.matrix_world.to_3x3() @ Vector((0, 0, -1))
    f2, s2 = Vector((fwd.x, fwd.y)).normalized(), Vector((to_sun.x, to_sun.y)).normalized()
    rel = math.degrees(math.atan2(f2.x * s2.y - f2.y * s2.x, f2.dot(s2)))
    return {"rel_azimuth": round(rel), "elevation": round(math.degrees(math.asin(to_sun.z)))}

def render_chunk(sc, a, b, out="//render/SLA_S03-SH02_v03_####"):   # one MCP call per chunk
    r, keep = sc.render, (sc.frame_start, sc.frame_end, sc.render.engine)
    try:
        r.engine, r.use_motion_blur = "BLENDER_WORKBENCH", False
        sc.display.shading.light, sc.display.shading.color_type = "STUDIO", "MATERIAL"
        sc.display.shading.show_shadows = False
        r.image_settings.media_type = "IMAGE"                 # 5.x: media_type before file_format
        r.image_settings.file_format, r.filepath, r.use_stamp = "PNG", out, False
        sc.frame_start, sc.frame_end = a, b
        bpy.ops.render.render(animation=True, scene=sc.name)
    finally:
        sc.frame_start, sc.frame_end, r.engine = keep
```
More 5.x traps:
- `bpy.ops.render.opengl` fails headless;
- `keyframe_insert` ignores the interpolation preference, so set Bezier and Auto Clamped yourself;
- headless runs use `--factory-startup --python-exit-code 1`.

### 4.9 Export: what Seedance accepts

**BytePlus reference-video limits** (ai.byteplus.com Seedance 2.5 docs, checked 2026-10-30):
- mp4 or mov, H.264 or H.265;
- 2–30 s per clip (4–30 s for edit tasks); at most 10 clips and 30 s in total per request;
- ≤ 200 MB per clip;
- 24–60 fps;
- width and height 300–6000 px, aspect 0.4–2.5, total pixels 407,696–8,295,044. 1920×1080 = 2,073,600 passes; 768×432 fails.
- Input is by URL or asset ID only, so 05 decides hosting. A Drive share page is not a file URL. Use an asset ID or a private, expiring link, never a public listing (holdback).
- Output duration is 4–30 s or −1 (auto). A prompt that reads as an edit (edit, add, remove, delete, replace, change, modify) or an extension (extend, continue) turns the task into a video edit or extension. An edit forces `duration −1` and works on the greybox itself. So 05 sets `omni_reference_task_type` to `reference`, and the T3 clause avoids those words.
- Reference audio is wav or mp3, 2–30 s per clip, ≤ 30 s in total, ≤ 15 MB.

**Settings.**

| Item | Upload copy `_PB_` | Review copy `_REV_` |
|---|---|---|
| Engine | Workbench; Lighting Studio; Color Material; Cavity optional; shadows, DoF and motion blur off; Color Management Standard | same |
| Frames | 1..24·G exactly; 1920×1080 at 100% | same |
| Overlays and text | none (Render ▸ Render Animation, never a viewport capture with overlays) | shot ID, version and frame number burned in |
| Audio | none | the shot's `_DLG_` track, AAC 48 kHz |

**Encode** from the PNG sequence (robust and resumable):
```bash
ffmpeg -framerate 24 -start_number 1 -i SLA_S03-SH02_v03_%04d.png -c:v libx264 -pix_fmt yuv420p \
  -crf 16 -preset slow -g 48 -keyint_min 24 -sc_threshold 0 -movflags +faststart -an SLA_S03-SH02_PB_v03.mp4
ffmpeg -i SLA_S03-SH02_PB_v03.mp4 -i SLA_S03-SH02_DLG_v03.wav -vf "drawtext=fontfile=<any.ttf>:\
text='S03-SH02 v03  f%{eif\:n+1\:d}':x=24:y=24:fontsize=30:fontcolor=white:box=1:boxcolor=black@0.5" \
  -c:v libx264 -crf 20 -c:a aac -b:a 192k -ar 48000 -shortest SLA_S03-SH02_REV_v03.mp4
```
For a shot with no dialogue, drop the `.wav` input and the audio options (`-c:a … -shortest`).

**Verify** before upload:
```bash
ffprobe -v error -show_entries \
  stream=codec_type,codec_name,width,height,r_frame_rate,pix_fmt,nb_frames:format=duration,size \
  -of compact SLA_S03-SH02_PB_v03.mp4
```
Pass when:
- there is exactly one video stream: h264, 1920×1080, 24/1, yuv420p;
- nb_frames = 24·G and duration = G.000 s;
- there is no audio stream;
- size ≤ 200 MB.

**Stills.** Save PNG stills at frame 1, the middle, the last frame and every named beat: `_STILL_v03_f0001.png`. 05 may use them as beat-anchor keyframe images (greybox-director) or as first-frame sources. If an image model restyles a still, gate the result for surviving primitives, box heads above all. For STILL-mode shots, export `_LAYOUT_v##.png` for 03 and 05. 03 attaches it with "use only the geometry and camera; ignore the grey materials".

### 4.10 Review gate per shot (Claude, before the user sees it)

1. Download from Drive. Run the ffprobe check. Make a contact sheet and read it:
   `ffmpeg -i PB.mp4 -vf "fps=2,scale=480:-2,tile=4x4" sheet_%02d.png`
2. Check the numbers. Measure them yourself on MCP shots; on friend shots, ask for the values or spot-check them from the `.blend`:
   - the camera switches only on bound `CUT_` frames;
   - no lens step;
   - camera turn ≤ 3°/frame;
   - camera clearance ≥ 0.8 m;
   - subjects inside the frame (full figure where planned), heads never occluded;
   - feet within 2 cm of the ground; no interpenetration;
   - the support check passes;
   - handheld amplitudes inside the 4.4 budget.
3. Check by eye:
   - the colours match the legend and nothing is all-grey;
   - each figure is one connected proxy, with no loose blocks near it;
   - vehicle fronts are marked;
   - the exit is populated;
   - frame 1 shows what the script says is there;
   - nothing stray sits at the frame edges;
   - the ending holds;
   - the clip is clean (no gizmos, text or grid unless declared as "replace, never inherit").
4. Play `_REV_` against the line markers. Lines land on the planned frames. The timing matches the animatic.
5. Fill the hand-off sheet (T3) from the scene, never retyped from the brief. Compute the lens heading (`lens_heading`, at the middle frame) and the camera-relative sun (`sun_relative`) per shot. Write them into the shot database (`lens_heading_deg`, `sun_rel`) and ledger-continuity-physics.md; the ledger's `sun_position.py --cam <heading>` must agree within a few degrees. If the physical sun contradicts the 02 variant rule (for example, a reverse angle puts R-DAY's sun in front of the camera), stop. Ask the user to choose: keep physics, or cheat the sun for this shot. Log the decision.
6. Show the review card (T4). The user approves, and the log row turns APPROVED. Only the APPROVED `_PB_` version may be used in 05.

### 4.11 Google Drive: folders, names, log

```
AboStesha Films/SLA_01-second-life-ascent/04-blocking/
  _brief/      SLA_04_FRIEND-BRIEF_v01.md · SLA_04_COLOUR-LEGEND_v01.md · SLA_04_BLOCKING-TABLE_v03.csv
  _kit/        SLA_KIT_STANDINS_v01.blend
  _sets/       SLA_LOC_METRO-WALKWAY_SET_v02.blend
  S03/S03-SH02/
               SLA_S03-SH02_BLK_v03.blend   (resources packed: File ▸ External Data ▸ Pack Resources)
               SLA_S03-SH02_PB_v03.mp4      (Seedance upload copy)
               SLA_S03-SH02_REV_v03.mp4     (review copy)
               SLA_S03-SH02_STILL_v03_f0001.png … _f0168.png
               SLA_S03-SH02_DLG_v03.wav     (only when the shot has dialogue)
               SLA_S03-SH02_HANDOFF_v03.md
  animatic/    SLA_ANIMATIC_v02.mp4 · SLA_ANIMATIC_v02_cutlist.csv
  SLA_04_blocking-log.csv
```
- Mirror to `films/01-second-life-ascent/04-blocking/`. Git tracks `.md` and `.csv`; binaries are git-ignored.
- PNG sequences stay local. Delete them after the encode passes verification.
- Versions only go up. Never overwrite a version.
- Keep everything 24 months (00 §0.2 rule D2: project files on request within 7 days).
- Use the Google Drive connector to search, download and read. Create folders or share only after the user says yes.

---

## Output templates

**T1 — Blocking table** (shown to the user with Arabic headers; the CSV copy uses the English keys)
```text
جدول البلوكنغ — المشهد S03 — نسخة v01 — الخلايا المعلَّمة PROPOSED تنتظر قرارك
| اللقطة | السطور | النمط | المتغيّر | الحجم | العدسة | ارتفاع الكاميرا | الحركة/الجهاز | طول المونتاج | G (ث) | الإطارات | الشخصيات (لون/نوع) | لحظات مفتاحية (إطار) | اتجاه الشاشة | فيزياء | المنفّذ | الحالة |
| S03-SH01 | — | BLOCK | R-DAY | EWS | 24mm | 1.6m | handheld, slow pan | 4.0s | 5 | 1-120 | MIRAJ red featured (far), extras grey | train enters f40 | L→R | — | friend | PROPOSED |
| S03-SH02 | — | BLOCK | R-DAY | FS→MWS | 35mm | 1.55m | backing rail, handheld | 5.5s | 7 | 1-168 | MIRAJ red featured, ROBOT cyan jointed | robot stops f121 | L→R | CONTACT f133 | friend | PROPOSED |
| S03-SH03 | S03-L03 | STILL | R-DAY | MCU | 50mm | 1.62m | handheld drift (prompt only) | 3.0s | 4 | — | MIRAJ red | — | — | — | Claude | PROPOSED |
| S03-SH04 | — | TEXT | BROADCAST | INSERT | — | — | HUD graphic in post | 2.5s | — | — | — | — | — | LEGIBLE-TEXT | 07 | PROPOSED |
عدد لقطات BLOCK: 2 / السعة المتاحة: __ · زمن المشهد: 15.0s · صورة غير Seedance حتى الآن: 2.5s (الحد ≈ 10% من T)
```
CSV keys: `shot_id,line_ids,mode,variant,size,lens_mm,cam_height_m,move_rig,edit_s,gen_s,frames,cast,beats,screen_dir,physics,owner,status`.

**T2 — Friend brief** (`SLA_04_FRIEND-BRIEF_v01.md`; the shot-specific part repeats per batch)
```markdown
# 2nd Life: Ascent — Blender blocking brief v01
Purpose: greybox guide clips for Seedance 2.5. Seedance copies camera, timing, positions and motion,
and invents every surface. Reference only: nothing you render appears in the film.
Setup: Blender 5.2 LTS (min 5.1). Units Metric, scale 1.0, metres, Z up, +Y = north.
  24 fps (fps base 1), 1920x1080 at 100%, frame start 1, Color Management: Standard.
Files: one set file per location (link it, never append); one file per shot, scene BLK_<SHOT>.
  Names: ENV_ FIG_<name> PRP_ VEH_ CAM_<SHOT> CRV_ RIG_ NULL_target_ LGT_ REF_ LINE_.
Stand-ins: featured capsules from the kit, heights from the legend, root at the feet, facing travel.
  Colours: legend only (material colour + object colour; viewport Solid, Color: Material).
  No loose blocks near a figure. Vehicles: front marked (light blocks front, dark red rear).
Sets: thick boxes at true scale; populate where the camera ends; nothing thin or floating.
Camera: one per shot, sensor 36 mm, fit Horizontal, focal length from the table, clip start 0.05,
  DoF off. Reframe with a Track To target, never by rotating the camera. Handheld = Noise modifiers
  (budget sheet). No lens animation unless the table says zoom. Max 3 deg of camera turn per frame;
  keep the camera 0.8 m or more off walls and rails.
Timing: dialogue WAVs on the sequencer at the listed frames; Sync to Audio; markers L_<line>_in/out.
  Bezier Auto Clamped keys; last key about 18 frames after the end (first key 18 frames before
  frame 1 if the subject is already moving); no key on a cut frame.
  Walk 1.35 m/s with a 2-3 cm bob per step. Jumps: per-frame keys on a gravity parabola.
Physics: jointed feet and wheels on geometry (2 cm; capsules may bob up to 4% of height),
  no interpenetration, contact on the listed frame.
Export: Workbench, Studio, Color Material, no overlays, no text, no audio, PNG frames 1..end ->
  H.264 MP4 (or Blender FFmpeg H.264). Stills at first, middle, last and each beat frame.
  Pack resources, save, upload to the shot folder, set the log row to REVIEW.
Never: render passes for the film, lens jumps on a cut, all-grey figures, public links.
## This batch
| Shot | G s | Frames | Lens | Cam height | Move | Cast | Beats (frame) | Lines (in-out frame) | Notes |
```

**T3 — Hand-off sheet** (per shot; 05-seedance-production.md writes the prompt from it)
```markdown
# S03-SH02 blocking hand-off v03 (APPROVED 2026-11-04 by AboStesha)
Files: SLA_S03-SH02_PB_v03.mp4 (sha256 …) · REV · STILL f0001/f0084/f0121/f0168 · DLG — none
Format: 24 fps, 1920x1080, frames 1-168 = 7 s · edit window f13-f144 (handles 12 head, 24 tail)
Camera: CAM_S03-SH02, 35 mm (about 63 degrees), height 1.55 m, backing rail, lead 3.5 m -> 2.4 m (FS -> MWS),
  lens heading 278 deg (west), handheld R-DAY budget, focus on Miraj's face, background soft.
  Sun: high, behind camera left (rel +130 deg, elev 72 deg).
Colour legend:
| Colour | Element | Becomes |
| red featured capsule with arms, Halo lens on the right eye, nose | FIG_MIRAJ 1.74 m | Miraj, CHR_MIRAJ ward-LOOK_A |
| cyan jointed figure | FIG_ROBOT 1.30 m | the greeting robot, CHR_ROBOT |
| long grey box, light front blocks | VEH_METRO | a metro train, right to left |
| grey capsules x6 | extras | commuters, never more than six |
Motion states: Miraj walks toward camera at 1.35 m/s, stops f118; robot steps in from frame
  right f84-f121 and raises its arm; fist bump on f133; train passes behind f97-f160 at 12 m/s.
Lines: none in this shot.  Events for 06 SFX: train pass f97-f160, fist-bump contact f133.
Assumed sizes: walkway width 4.0 m, railing 1.1 m.  Artifacts: none.
Tie-breaks: the clip defines the whole camera path; where text and clip disagree about motion or
  position, the clip wins; every stand-in becomes the real subject its position and size imply.
Blockout clause v1 for 05 (no brackets, no ratio or duration words):
@Video1 is a coarse 3D blocking reference: rehearsal footage in which coloured stand-ins walked
the scene so camera, timing and movement could be locked. Take from @Video1 only the camera
position and movement, the framing and shot rhythm, the timing of every action, and each subject's
screen position, path, facing, ground contact and scale. Take nothing of its shapes, colours,
materials, lighting or empty surroundings. The red figure is Miraj, @Image1. The cyan jointed
figure is the greeting robot, @Image2. The long block crossing behind them is a metro train. The
six grey capsules are commuters. In
@Video1 Miraj is a colored capsule stand-in with a ball for a head, simple arms and no legs: it only
marks where he is, his height, his pace, which way he moves and where his hands are. The small
shape on his right eye only says which one he is. He is a real person with natural human motion.
He walks naturally at the pace the capsule moves: heel then toe, each foot planted before the other
lifts, weight shifting from foot to foot, arms swinging. His feet never slide, glide or float. The
robot keeps the jointed figure's stiff, mechanical steps and its left-leg limp. If the text and
@Video1 disagree about motion or position, @Video1 wins. No blocky placeholder geometry, no
mannequin figures, no capsule-shaped bodies.
```
Two passages are adapted from scenario-labs `cast.md` (MIT): the stand-in passage ("a colored capsule stand-in … natural human motion") and the gait passage ("walks naturally … glide or float"). They are rewritten here for one character with arms. Use them only for human characters on capsule stand-ins. A jointed robot gets one plain motion line instead. Keep edit and extension words out of the clause (4.9). 05 merges the clause with the 02 prefix, the asset role lines and the audio binding, then tests it on one shot. That test A/Bs the scenario-labs 2×2 style board against the greybox-director frame-0 restyle.

**T4 — Review card** (Arabic, one per shot)
```text
لقطة S03-SH02 — نسخة v03 — جاهزة لاعتمادك
الملفات: PB (7 ث، 1920×1080، 24 إطار/ث، بلا صوت، 18 م.ب) · REV · 4 صور ثابتة
الأرقام: انعطاف الكاميرا الأقصى 1.4°/إطار (الحد 3) · أقرب مسافة لجدار 1.3 م · الأقدام على الأرض ✓ · لا تداخل ✓
بالعين: الألوان مطابقة · مخرج الممشى مأهول ✓ · بداية ونهاية ثابتتان ✓
ملاحظات: الروبوت يدخل الكادر قبل السطر بـ 9 إطارات — مقصود؟
الشمس: عالية خلف الكاميرا يساراً — متوافقة مع R-DAY ✓
هل تعتمد هذه النسخة لمسودات Seedance؟ (نعم / تعديل: …)
```

**T5 — Blocking log row** (`SLA_04_blocking-log.csv`, append-only)
```text
shot_id,version,mode,owner,channel,blend_file,pb_file,pb_sha256,gen_s,frames,status,approved_by,approved_date,notes
S03-SH02,v03,BLOCK,friend,manual,SLA_S03-SH02_BLK_v03.blend,SLA_S03-SH02_PB_v03.mp4,<sha256>,7,1-168,APPROVED,AboStesha,2026-11-04,robot limp keyed by friend
```

**Worked mini-example: dialogue shot (illustrative IDs; the real ones come from the locked script).**
- S11-SH03, INT. MIRAJ'S ROOM, NIGHT, R-INT. Miraj sits on the bed edge, phone at his ear. He listens to his mother (S11-L04, PHONE, 2.41 s measured), then answers (S11-L05, ON, 1.90 s).
- Shot: MCU at 50 mm. Coverage 0.70 m → distance 1.72 m. Camera at seated eye height, about 1.25 m. Handheld, R-INT budget.
- Timing:
  - L04 runs f13–f71;
  - a 14-frame pause, f72–f85, in which Miraj's head turns from the window toward the camera side, f78–f84;
  - L05 runs f86–f131.
  - Edit window: f13 to f143, which is L04 start through L05 end plus a 12-frame reaction. L = 131 frames → G = ceil(155/24) = 7 s, frames 1–168.
- Stand-in: a red featured capsule with `arms` and a `nose`. The phone (thickened) is parented to the right arm. Root z = 0.45 − 0.47 × 1.74 = −0.37 m, so the head top sits at about 1.37 m.
- Outputs:
  - `_DLG_`: L04 delayed 500 ms, L05 delayed 3542 ms, padded to 7 s;
  - the hand-off lists lines by frame and second, so 05 can bind `@Audio1` to Miraj and keep the mother's voice off-screen.

---

## Gate (animatic lock, Step 4, D7; not to be confused with 00's G4 Delivery gate)

Ask: «هل تعتمد جدول اللقطات والأنيماتيك v__ كنسخة مقفلة؟ بعد القفل تُجمَّد أرقام اللقطات ومددها، ونبدأ مسودات Seedance.»

The user approves:
1. **The blocking table.** Every shot has an ID, mode (BLOCK / STILL / TEXT), size, lens, height, move, edit length and G. No PROPOSED cells remain.
2. **The animatic.** Body runtime 6:00–6:30, total ≤ 7:00 including titles and credits. Every selected line is in place and sync is correct.
3. **Every BLOCK shot.** An APPROVED `_PB_` version that passes the 4.9 ffprobe check and the 4.10 review, plus its hand-off sheet. STILL shots have their layout still.
4. **The Drive folder** is complete and the log has no blank cells. Authorship is recorded per shot. Lens heading, camera-relative sun and contact frames are entered in the shot database and ledger-continuity-physics.md.
5. **Open conflicts are decided:** sun cheats, any stand-in A/B result, Bridge-module conflicts.

Partial release is allowed: approved BLOCK shots may enter 05 drafts before the full lock. That happens hardest-first on D7. Any later change to an approved shot creates v+1 and is flagged to 05.

---

## Common failures

| Symptom in Seedance or review | Cause | Fix |
|---|---|---|
| A box or capsule shape survives into the render | geometry words in the prompt; a restyled still with box heads | motion-first clause (T3); gate stills for primitives |
| Upload refused by the provider screen | all-grey figures | identity colours, or a strong tint over the whole clip |
| Upload rejected on size or format | 768×432 or smaller (below 407,696 px), 25/30 fps, over 200 MB, under 2 s | 1920×1080, 24 fps, CRF 16, G ≥ 4 |
| Stiff, lockstep or sliding walk | jointed legs or a looped walk on a human | featured capsule plus the gait clause |
| Two characters swap places or identities | plain capsules, colour mapping not written | featured capsules; map every colour to a name in the prompt |
| Extra person appears near the hero | loose blocks near a figure | one connected proxy; move props away |
| Car drives backwards | unmarked front | light blocks at the front, dark red at the rear |
| Hero floats or air-walks | root keyed past a support | support check; declare airborne windows |
| Void or melted area at the shot's end | empty exit | populate the exit |
| Motion freezes on a frame | key on the cut or last frame | keys run past the end |
| Last seconds drift | eased stop or loose keys at the end | lock the ending as tightly as the opening |
| Picture freezes, then jumps | camera turning > 3° per frame | lengthen the turn |
| A collision or cut where the camera passes a wall | camera < 0.8 m from geometry | widen the path |
| Floaty, slow motion | reference shorter than the requested duration | playblast exactly G s |
| Output keeps the grey look, or a `TaskTypeConstraint` / `TaskTypeMismatch` error | the prompt read as an edit ("replace the capsules…"), so Seedance edited the greybox | no edit or extension words in the clause; `omni_reference_task_type: reference` (05) |
| Lost figures and invented close-ups | clip 20–30 s | split into ≤ 15 s shots |
| Lens "pop" at the start of a shot | a lens key leaking across a cut | one camera per shot; lens keys only inside it |
| Framing looser or tighter than planned | wrong sensor (24 mm height or fit Auto) | 36 mm, fit Horizontal, 20.25 mm height in the maths |
| Phone or lens case vanishes | thin prop edge-on | thicken it; angle it toward the camera |
| Gizmos or a grid appear as objects | viewport capture with overlays; undeclared grid | Render Animation; declare grids "replace, never inherit" |
| Temp sound steers Seedance audio | audio track left in `_PB_` | `-an`; dialogue goes only as a bound audio reference (05) |
| Shadows flip between shot and reverse | sun cheated without a record | physical sun per location; log every cheat |
| Animatic over 7:00 | lines stretched to fit, unplanned beats | cut shots or lines with the user; never speed up |
| A playblast frame in the edit | wrong file pulled into Premiere | `_PB_`/`_REV_` names never go into 07's media bins |
| Bridge build saved over the user's file | ignored the "save only when asked" rule | ask once; `save_as_mainfile(copy=True)` only |

---

## Sources and credits

- **scenario-labs/skills** (MIT; cloned at commit 5d68b48, 2026-10-30, v0.60.1). From `scenario-blender-blockout` (SKILL.md, contract, cast, audits, handoff, examples), `scenario-blender-expert`, `scenario-blender-previs-storyboard` and `scenario-seedance`. Used for:
  - the authority split and the defect-copy evidence;
  - the featured-capsule stand-in results (Seedance 2.5, Oct 2026);
  - the palette values, dimensions and lens and coverage maths;
  - the rail rig, the handheld budgets and keys past cuts;
  - the clip-length audit, the all-grey refusal, the audits and the hand-off sheet structure.
  The stand-in and gait clauses are adapted from its wording (MIT); the rest is paraphrased.
- **friscodanconia/greybox-director** (MIT; commit c61577d, 2026-07-26; Seedance 2.0-era, read only). Used for:
  - the support check, populating the exit, collision-scrubbing trailing cameras, reaction choreography and the skyline rule;
  - beat-anchor stills, the frame-0 restyle and the warning about shorter references;
  - the PNG-to-ffmpeg encode pattern. Paraphrased.
- **jellypoplabs/skills** whitebox-check (no licence file found; paraphrased; inspiration only): the 3°/frame camera-turn limit, 0.8 m clearance, and thin objects vanishing edge-on.
- **ahujasid/blender-mcp** README and pyproject (MIT, v2.2.6): tool list, telemetry default, `DISABLE_TELEMETRY`, port 9876. Facts only.
- **Blender Lab MCP** (projects.blender.org/lab/blender_mcp readme, readme_tools.rst and add-on source; blender.org/lab/mcp-server): tool names, add-on architecture, v1.0.3, Blender 5.1+, default port 9876. Facts only.
- **Official sources checked 2026-10-30:**
  - BytePlus ModelArk Seedance 2.5 docs (reference video and audio limits, output duration 4–30 s, task types and `omni_reference_task_type`, draft retention; live page re-checked 2026-10-30) and the Seedance 2.5 prompt guide (3D clay-model reference: coarse primitives, state what to inherit, map colours to subjects, no trajectory lines or camera cones). Paraphrased; not open-licensed.
  - blender.org/download (5.2.3 LTS, released 2026-10-22);
  - higgsfield.ai/plugins/blender (Blender 5.1+, Bridge URL) and the Higgsfield Bridge server instructions (`bl_get_skill` order, units, save rule);
  - extensions.blender.org Sun Position (v4.4.0).
- **The user's own skills:** cinematic-pipeline SHOTLIST_RULES (metres, frame thirds, camera height, eye-line spatial blocking; shot-type taxonomy) and seedance-2-5-prompts (a blockout video still needs the subjects, scene and style defined in the prompt).
- **Not verified:**
  - the content of Higgsfield's `blender-*` modules and the Bridge preview tool names (read on first connect);
  - how the Higgsfield Video tab treats a viewport clip;
  - whether the playblast's Workbench cavity or shadows help or hurt (A/B on one shot).
