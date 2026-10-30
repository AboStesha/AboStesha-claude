# Continuity Bible — {{FILM_TITLE}} ({{FILM_CODE}}) — v{{NN}} — {{YYYY-MM-DD}}

Schema owner: `references/ledger-continuity-physics.md` (L.6).
- 03 writes the character, location and prop entries.
- 04 writes the geography and axis lines.
- 05b writes the per-shot performance states.
- 07 closes the cut-pair checks.

Status per entry: PROPOSED (Claude) / CONFIRMED (user, words logged in `decisions.md`).
Rows marked `e.g.` are worked examples from *2nd Life: Ascent* draft v0. Replace them.

---

## 0. Story frame

Story year: {{2045}} · Story dates: {{…}} · Location: Dubai, UTC+4 (no daylight saving) · Frame rate 24/1

| Scene | Story day | Date | Clock in → out | Layer | Variant (02) | WB K | Haze / weather | Notes |
|---|---|---|---|---|---|---|---|---|
| e.g. S02 | D1 | 2045-04-15 | 11:05 → 11:15 | REAL | R-INT → R-DAY | 4000/3200 → 5600 | dust haze about 30 m | wakes in the booth, out into the noon sun |
| e.g. S03 | D1 | 2045-04-15 | 11:35 → 11:45 | REAL | R-DAY | 5600 | dust haze about 30 m | walkway, robot fist bump, metro |
| {{S##}} | | | | | | | | |

Rule: R-DAY shots sit inside the sun ≥ 35° window for the date; DREAM has no sun (shadowless, 02). Golden hour is reserved for FINALE (02; physics-bible §1).

## 1. Characters (one block each; same schema as 03's continuity entry)

```yaml
character: CHR_{{NAME}}                         # e.g. CHR_MIRAJ
status: PROPOSED
canonical_description: "{{one paragraph: build, face, skin + undertone, hair, hands}}"
identity_anchors: [{{5 visible, testable details with positions}}]
locked_reference_assets: [{{approved file names + sha256 from 03}}]
seedance_asset_ids: [{{asset://… with Active date}}]
hands: {{e.g. smart ring on the right ring finger; from S11-SH09 a second ring (Rayan's) above it}}
devices_worn: {{e.g. Halo lens right eye (in S03-SH01, out S11-SH02); earpiece right ear}}
looks:                                          # each look and state is its own 03 sheet
  LOOK_A: {{item by item, top to toe}}
  LOOK_B: {{…}}
allowed_variations: [expression, pose, sweat, dust, wetness]
forbidden_variations: [{{beard length, mole position, skin tone, ring finger, …}}]
arc_checkpoints: see 05b §5b.7 table
voice: {{voice_id, eleven_v4, descriptor — copied from 01, never retyped}}
synthetic_or_real: synthetic                   # cl. 5.5(d)
approval_required_for: [face regeneration, wardrobe redesign, voice change]
```

## 2. Wardrobe by scene

| Scene | Character | Look | State (clean / sweat n / dust n / wet n) | Change shown on camera? | Notes |
|---|---|---|---|---|---|
| e.g. S03 | MIRAJ | LOOK_A grey work coverall | sweat 1 · dust 1 | — | |
| e.g. S06 | MIRAJ | LOOK_A | sweat 2 · dust 2 | — | work day continues |
| {{…}} | | | | | |

## 3. Props and devices: state machines

One row per prop or device. A transition is valid only in the shot where it happens on camera ("Off-screen = nonexistent").

| Prop / device | States | Transitions (shot where shown) | Owner, hand, position | Count | Light (reserved?) |
|---|---|---|---|---|---|
| e.g. PRP_HALO-LENSCASE | closed / open | closed→open S03-SH01 · open→closed S03-SH01 (walkway insert) | MIRAJ, left trouser pocket; opened in the left hand | 1 case, 1 lens, 2 earpieces | none |
| e.g. Halo lens | in case / in right eye / out (night) | in eye S03-SH01 · out S11-SH02 | MIRAJ right eye | 1 | HUD glint only (physics-bible §9) |
| e.g. Smart ring | idle / green (assistant) / red | idle→green S11-SH04 (call rings, declined) | MIRAJ right ring finger; ×2 from S11-SH09 | 1 → 2 | `#3BD16F` green, assistant devices only |
| e.g. PRP_FOODBOX | clean / full / used / left-on-bench | full→left-on-bench S08-SH05 | the girl → bench | 1 | none |
| e.g. Air-skate fan | spinning / idle; warning light off / red | red light lit from S08-SH02 | on the static fan housing | 4 fans | red LED on the housing, never on the blades |
| {{…}} | | | | | |

## 4. Locations and geography (04 sets)

| Location | Set file | True north in the set | 180° line(s) | Fixed landmarks | Time-of-day masters (03) |
|---|---|---|---|---|---|
| e.g. LOC_METRO-WALKWAY | SLA_LOC_METRO-WALKWAY_SET_v02.blend | +Y | walkway centre line | ring-shaped departure board over the gates | noon |
| {{…}} | | | | | |

## 5. Screen direction map

| Scene | Axis / camera side | Journey direction | Vehicles (direction) | Motif crossings | Notes |
|---|---|---|---|---|---|
| e.g. S03 | walkway centre; south side | home→work L→R | metro R→L | MOTIF-TRAIN #1 R→L, lens height 1.5 m | |
| e.g. S10 | platform; south side | — | metro R→L | MOTIF-TRAIN #2 must match #1 | |
| {{…}} | | | | | |

## 6. Eyeline map

| Shot | Character | First-frame target (frame side, angle) | Last-frame target | Screen or HUD eyeline | Reverse partner shot |
|---|---|---|---|---|---|
| e.g. S11-SH10 | MIRAJ | palm, down 35°, frame left | palm, same | ring palm projection | S11-SH11 (BROTHER, looks up into camera-left) |
| {{…}} | | | | | |

## 7. Accumulating states (they only advance; a reset needs a cause)

| Character | State | Level by scene (0–3) | Reset cause (shot) |
|---|---|---|---|
| e.g. MIRAJ | sweat | S02 0 · S03 1 · S06 2 · S07 3 | night / shower (S09) |
| e.g. KABIR | wet | S01-SH04 3 · S01-SH05 3 · S01-SH06 3 | dream ends |
| {{…}} | | | |

## 8. Count lock

| Shot | Exact headcount | Named people | Extras' business (2–3 tasks) |
|---|---|---|---|
| e.g. S03-SH02 | 8 | MIRAJ, ROBOT | 6 commuters holding straps, reading palm screens |
| {{…}} | | | |

## 9. Per-shot state log (05b §5b.7 columns)

| shot_id | char | IN posture / breath / eyes / hands + prop / eyeline / intensity | OUT (same fields) | accumulated | tactic | beat turn | approved take | notes |
|---|---|---|---|---|---|---|---|---|
| {{S##-SH##}} | | | | | | | | |

The OUT of shot N is the IN of shot N+1 in story time, unless section 0 records a time jump.

## 10. Cut-pair checks

Codes: HANDLE_DRIFT · WARDROBE_DRIFT · PROP_MISPLACEMENT · EYE_LINE_BREAK · SCALE_DRIFT · AGE_DRIFT · BACKGROUND_EMPTYING · LIGHT_SPILL · LENS_CONFLICT · PHYSICS_FAIL · DIRECTION · COUNT · AUDIO_SPACE.

| Cut | A last frame | B first frame | Codes found | Severity (P0/P1/P2) | Proposed fix (07 §7.5 route) | User decision |
|---|---|---|---|---|---|---|
| {{S03-SH02→S03-SH03}} | reports/S03-SH02_last.png | reports/S03-SH03_first.png | | | | |

## 11. Open continuity questions for the user

- e.g. C1: the lens is out before the call. Is the call a ring palm projection, or does he put the lens back on camera?
- {{…}}
