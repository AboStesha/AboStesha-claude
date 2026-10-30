# Physics Bible — {{FILM_TITLE}} ({{FILM_CODE}}) — v{{NN}} — {{YYYY-MM-DD}}

Schema owner: `references/ledger-continuity-physics.md` (L.7). It holds formulas, scripts and reference values.
Every REAL shot obeys this file. A DREAM shot breaks physics only in the one way registered in §10. Sci-fi devices follow §9.
Status per entry: PROPOSED (Claude) / CONFIRMED (user, words logged in `decisions.md`). Rows marked `e.g.` are worked examples. Replace them.

---

## 0. Frame of reference

| Field | Value |
|---|---|
| Location | Dubai, 25.2048 N, 55.2708 E · UTC+4, no daylight saving |
| Story year and dates | {{2045-04-15 …}} (sets the sun; see L.7.1 seasonal table) |
| Units | metres, kilograms, seconds; azimuth in degrees clockwise from **true** north |
| Picture | 24/1 fps; shutter 180° = 1/48 s (motion blur = speed × 0.021 s) |
| Overcranked shots (slow motion is global inside a shot) | {{shot list or "none"}} |
| Traffic side | right-hand traffic (UAE) |

## 1. Sun per shot

Command (from the skill folder): `python3 -I scripts/sun_position.py <date> <HH:MM> --cam <lens heading>`. `rel` uses 04's sign: + = camera-left, 0 = in lens, ±180 = behind camera.

| Shot | Date | Time | Lens heading | Sun az | Sun el | rel | Shadow ÷ height | Variant rule (02) | Conflict? | Decision (keep / cheat °) |
|---|---|---|---|---|---|---|---|---|---|---|
| e.g. S03-SH02 | 2045-04-15 | 11:40 | 278° | 147.1 | 72.2 | +131 | 0.32 | R-DAY: high, behind camera-left | no | keep |
| e.g. S03-SH03 (reverse) | 2045-04-15 | 11:40 | 98° | 147.1 | 72.2 | −49 | 0.32 | R-DAY | yes: front-right backlight | {{user}} |
| e.g. FINALE swim | 2045-04-15 | 18:00 | 280° | 277.2 | 8.5 | +3 | 6.71 | FINALE: low warm sun behind subjects (≤ 10°) | no | keep |
| {{…}} | | | | | | | | | | |

DREAM shots have no sun (02: shadowless 6500 K, no visible source): write `n/a (DREAM)`.

Checks: one shadow direction per frame · length matches the ratio · crisp edge (about 0.9 cm of penumbra per metre) · any secondary "sun" from a mirror-glass tower is placed in the set · at night no stars, and a visible Moon matches the date's phase.

## 2. World decisions (L.7.9)

| Decision | Choice | Consequence on screen and in sound | Decided by / date |
|---|---|---|---|
| 2045 city bus | {{electric / diesel}} | {{no exhaust, motor whine / idle rumble, exhaust shimmer}} | |
| Air-skate lift | {{fans / declared magnetic}} | {{downwash ring of sand, whipping clothes / no air movement at all}} | |
| HALO HUD lock | {{head-locked}} | fixed in frame in POV; outsiders see only a glint | |
| Palm call mechanism | {{ring projection onto the palm}} | emitter point on the ring, light cone, palm and face tinted | |
| Robot mass and gait | {{55 kg, left-leg hitch}} | heavy footfalls, servo whine | |
| Tower façade glass | {{laminated insulated units}} | crazes and holds; nothing rains down in REAL | |
| Moon in night exteriors | {{yes / no}} | phase must match the date | |

## 3. Falls, drops and timing (t = √(2h/g))

| Event | Shot | Object, mass (kg) | Height (m) | Time (s) | Frames at 24 | Real time / overcrank | Sound frame (06) |
|---|---|---|---|---|---|---|---|
| e.g. FALL-01 | S08-SH05 | steel food box, 0.6 kg | 0.9 | 0.43 | 10 | real | f+10 impact |
| {{…}} | | | | | | | |

Prompt phrasing (mass in real units): `The steel meal box, about 0.6 kg, slips from the bench edge and hits the floor in under half a second with a dull bounce.`

## 4. Water events

| Event | Shot | What enters, how | Entry speed | Spray top (m) | Spray back down in | Afterwards (wet states, ripples) |
|---|---|---|---|---|---|---|
| e.g. WATER-01 | S01-SH04 | KABIR, about 75 kg, side entry from the edge | about 3–4 m/s | about 1–1.5 | ≤ 1.1 s | white water clears in 2–4 s; ripples about 1 m/s; KABIR wet 3 |
| {{…}} | | | | | | |

## 5. Glass events

| Event | Shot | Glass type | Cause | Behaviour (one frame to crack) | Fragments and fall | DREAM exception? |
|---|---|---|---|---|---|---|
| e.g. GLASS-01 | S01-SH02 | annealed drinking glass, already broken | — | — | a few large curved shards + slivers on the deck, swept by KABIR | no |
| e.g. GLASS-02 | S12-SH03 | tower façade (laminated) | dream | in REAL it would craze and hold | {{if it bursts: register in §10}} | {{yes / no}} |
| {{…}} | | | | | | |

## 6. Crowds

| Shot | Headcount | Density (/m²) | Walking speed (Weidmann) | Flow direction | Common-mode moves | Reaction wave |
|---|---|---|---|---|---|---|
| e.g. S03 bus | 30 visible | 4–5 | nobody walks | — | all lean back at pull-away, forward on braking | — |
| e.g. S03 concourse | 20 | 1 | 1.06 m/s | to the gates, L→R | — | — |
| e.g. Kabir's circle | 8 | 0.5 | standing | — | — | front 2 laugh first; 3 more half a beat later; back 2 do not laugh |
| {{…}} | | | | | | |

## 7. Vehicles

| Shot | Vehicle | Speed | Direction (screen) | Length | Pass time at a fixed point | Blur at 1/48 s | Notes |
|---|---|---|---|---|---|---|---|
| e.g. S03-SH02 | metro, 5 cars | 12 m/s (43 km/h) | R→L | about 85 m | 7.1 s | 0.25 m | platform screen doors: no wind gust |
| e.g. S02-SH06 | city bus pulling away | 0 → 5 m/s in about 4 s | L→R | 12 m | — | ≤ 0.1 m | MIRAJ gains for about 3 s, never touches it |
| {{…}} | | | | | | | |

## 8. Robots and machines

| Machine | Height | Mass | Gait and cadence | Fault (constant) | Contact frames | Sound |
|---|---|---|---|---|---|---|
| e.g. CHR_ROBOT (delivery) | 1.30 m | {{55 kg}} | about 1.8 steps/s | left-leg hitch every cycle | fist bump f133 (S03-SH02) | servo whine; metal footfall |
| {{…}} | | | | | | |

## 9. Sci-fi device bible

Light rules (all devices):
1. Light only adds, so no black and no occlusion.
2. Each device needs a surface, a medium or the eye: no free-floating mid-air images in REAL.
3. It tints nearby skin, falling off with the square of distance.
4. Invisible in direct sun, readable in shade, glowing at night.
5. Projections wrap over surfaces and break on gaps.
6. Lock mode is declared per device.
7. Reserved green `#3BD16F` only on assistant devices.

| Device | Mechanism | Who sees it | Emitter and colour | Brightness vs ambient | Lock mode | Sound | States and failure looks |
|---|---|---|---|---|---|---|---|
| e.g. Halo lens | in-eye micro-display | wearer only; others see a faint glint over the iris | none visible | n/a | head-locked HUD | earpiece audio only | off / HUD on / glitch (static flicker in POV only) |
| e.g. Ring palm call | projector point on the ring → open palm | anyone nearby | ring point; cool white UI + green accent | readable in shade or at night; he cups his hand in sun | palm-locked | small chime from the ring | ringing (green LED) / in call / declined (red LED) |
| e.g. Air-skate fans | ducted fans | everyone | red warning LED on the static housing | — | — | loud rising whine | idle / spin-up / hover / fault light |
| {{…}} | | | | | | | |

English prompt lines (pasted into 05 prompts as needed):
- `The image on his palm is light projected from a tiny point on the ring: it wraps over the curve of his palm, breaks across the gaps between his fingers, and casts a faint cool glow on his chin; nothing floats in the air.`
- `From the outside his eye shows only a faint glint over the iris; no readable image is visible.`
- `As the air-skate settles, the fan downwash blasts a ring of sand outward across the garage floor and whips the hem of his kandura.`

## 10. DREAM exception register

| Shot | The ONE exception | What still obeys physics | Dream cue | 02 line |
|---|---|---|---|---|
| e.g. S01-SH06 | the pool water rises into the sky | people, hair, wet clothes, droplets, crowd reactions | the HALO ring glint in frame; the light dims as the water lifts | `PHYSICS EXCEPTION: only the pool water rising into the sky breaks physics; everything else keeps real weight.` |
| {{…}} | | | | |

## 11. Physics QA log (draft and final)

Frames: `ffmpeg -i clip.mov -vf "fps=2,scale=1280:-1" qa/f_%03d.png` (2 fps for hero shots, 1 fps for the rest).

| Shot | Draft / Final | Support · Timing · Light · States · Mass checks | Result | Severity | Fix route (07 §7.5) |
|---|---|---|---|---|---|
| {{S##-SH##}} | | | PASS / FAIL / WAIVED | | |
