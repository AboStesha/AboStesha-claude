#!/usr/bin/env python3
# VIDEO 2 (Incubation, 91.0 s) · SFX cue sheet. Every on-screen event, from the spec (scratchpad ep2/mg_ep2_final.json),
# the group code timing tables (W2 comp/src/30_open ... 34_conds: ru_K, fu_K, cd_K, sr_*, op_*) and checked against
# the render (verify_sync.py). Times written as VO seconds go through v() (output = VO + 0.63); title / end card times
# are output seconds. Gains are relative to the palette's normalised level (-18 LKFS, 100 ms max).
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cuelib import cue, L, px, finish, _SCALE, BASE

P = 0.63
v = lambda t: round(t + P, 3)
HERE = os.path.dirname(os.path.abspath(__file__))

# ------------------------------------------------------------------ TITLE (output 0-3.00)
B = "TITLE"
cue(0.00, "whoosh_long_fall", -9, 0.35, "onset", B, "◢ texture sweep right to left (0-0.80) + bokeh in", x=960, pan_end=None)
cue(0.20, "slide_card_a", -9, 0.05, "onset", B, "stage chip '02' reveals from its right edge, 20 px rise", x=960)
cue(0.25, "flag_flutter", -12, px(1483), "onset", B, "mirrored red flag unfurls (0.25-0.47)", x=1483, y=390)
cue(0.45, "reveal_air_a", -11, px(1100), "onset", B, "'(2)' rises 40 px (0.35-0.80) + «مرحلة» reveals RTL (0.45)", x=1100)
cue(0.62, "reveal_air_c", -12, px(666), "onset", B, "'Incubation' mask-reveals left to right (0.62-1.02)", x=666)
cue(0.85, "shimmer_sheen", -13, px(1347), "onset", B, "one sheen across the metallic '(2)' (0.85-1.35) + «مع» rises 16 px (0.95)", x=1347)
cue(1.05, "shimmer_logo", -7, px(890), "onset", B, "official logo build: axi rises (1.05-1.50)", x=890)
cue(1.32, "whoosh_soft_b", -13, px(950), "onset", B, "SELECT tag wipes in behind the red '/' edge (1.32-1.82)", x=950)
cue(2.75, "whoosh_soft_c", -15, 0.0, "peak", B, "title exit: everything fades with y -10 px (2.62-2.94), black, hard cut", x=960, tv=2.62)

# ------------------------------------------------------------------ A · VC HOME -> WIDE (VO 2.37-8.81)
B = "A"
cue(v(3.05), "cam_pull", -7, 0.0, "onset", B, "camera pull HOME -> WIDE (0.62 s expo)", x=960)
cue(v(3.80), "reveal_air_a", -11, px(990), "onset", B, "kicker «المرحلة الثانية» rises 16 px + its flag unfurls (3.84-4.06)", x=990,
    layers=[L(v(3.84), "flag_flutter", -14, px(1090))])
cue(v(4.84), "shimmer_logo", -7, 0.0, "onset", B, "official lockup builds in the void: axi rises (4.84-5.22)", x=900)
cue(v(5.02), "sonar_white", -8, 0.0, "onset", B, "◢ floor ripple ring wave from the stool + pool lifts .18 -> .26", x=960)
cue(v(5.12), "whoosh_soft_b", -14, px(1050), "onset", B, "SELECT tag wipes in (5.07-5.48)", x=1050, tv=v(5.07))
cue(v(5.72), "scan_draw_a", -12, px(1176), "onset", B, "stage line: the DOME draws (5.72-6.20), sapling grows", x=1176,
    layers=[L(v(5.80), "reveal_air_b", -14, px(1060))])
cue(v(6.08), "reveal_air_c", -13, px(880), "onset", B, "'Incubation' mask-reveals left to right (6.08-6.40)", x=880)
cue(v(6.18), "sonar_red", -9, 0.0, "onset", B, "stage-2 PAD rim traces (6.18-6.58) + RED stage pulse from the pad", x=960)
cue(v(6.86), "whoosh_soft_c", -14, px(930), "peak", B, "lockup exits: tag wipes off RTL, axi sinks; kicker + flag fade (6.80-7.10)", x=930, tv=v(6.80))
cue(v(7.46), "pop_a", -11, px(1138), "onset", B, "four DIM condition pips land right to left (0.08 s stagger, 16 px rise)", x=1000,
    repeat=[4, 0.08], rate_step=0.03, pan_to=px(754))
cue(v(8.08), "reveal_air_a", -15, px(1000), "onset", B, "skeleton shimmer band sweeps right to left across the pips (0.5 s)", x=1000)
cue(v(8.50), "whoosh_soft_c", -16, 0.0, "peak", B, "pips, stage line, pad and pool exit as one layer (8.40-8.70)", x=960, tv=v(8.40))

# ------------------------------------------------------------------ B · L2 (VO 8.81-10.09)
B = "B"
cue(v(8.97), "stamp", -9, px(330), "onset", B, "RED TAG '!' snaps in (scaleX from its right edge, 0.2 s expo)", x=330,
    layers=[L(v(9.02), "reveal_air_a", -12, px(420))])
cue(v(9.48), "pop_b", -10, px(260), "onset", B, "on «مهمّة»: the tag pops 1 -> 1.06 -> 1 + a 3 px RED underline draws RTL", x=400,
    layers=[L(v(9.48), "scan_draw_a", -16, px(460), dur=0.35)])

# ------------------------------------------------------------------ C · B-ROLL 1 (VO 10.09-17.09)
B = "C"
cue(v(10.09), "whoosh_hard_a", -5, 0.0, "peak", B, "hard cut into B-roll 1 + the frame's corner triangles fly out (10.12)", x=960,
    layers=[L(v(10.09), "thud_soft_a", -12, 0.0), L(v(10.20), "scan_draw_a", -11, px(500), pan_to=None)])
cue(v(10.48), "slide_card_b", -9, px(405), "onset", B, "START chip reveals from its right edge + 20 px rise; DOME draws (10.55)", x=405)
cue(v(10.60), "reveal_air_b", -14, px(420), "onset", B, "«بداية المرحلة» rises", x=420)
cue(v(11.16), "pop_c", -9, px(622), "onset", B, "the pill's RED circle scales in (0.22 s expo) + the WINDOW zone fades in", x=622)
cue(v(11.30), "slide_card_a", -11, px(500), "onset", B, "the pill extends leftward out of the circle (0.35 s expo)", x=490)
cue(v(11.50), "reveal_air_c", -16, px(700), "onset", B, "the cursor glides in to the circle (expo)", x=700)
cue(v(11.62), "reveal_air_a", -13, px(470), "onset", B, "pill label «سحب الأموال» reveals right to left", x=470)
cue(v(11.82), "click_ui_a", -6, px(622), "onset", B, "CLICK on the circle (11.84): pill .96 + red ring; headline «سحب الأموال» + flag (11.80-12.04)",
    x=1500, tv=v(11.80), layers=[L(v(11.82), "reveal_air_b", -13, px(1540)), L(v(11.84), "flag_flutter", -15, px(1760))])
cue(v(12.00), "glitch_swipe_b", -9, px(560), "onset", B, "MONEY OUT: 10 red ◢ burst from the circle and fly up-left, spinning", x=500)
cue(v(12.30), "pop_b", -9, px(702), "onset", B, "the 'allowed' chip lands inside the open window (back 1.4)", x=702)
cue(v(12.96), "tick_c", -10, px(760), "onset", B, "the PLAYHEAD appears at the window's edge: its line draws down from the ▼ head", x=760,
    layers=[L(v(12.96), "scan_draw_a", -16, px(760), dur=0.35)])
cue(v(13.68), "pop_a", -12, px(490), "onset", B, "the pill pulses once (scale 1.03)", x=490)
cue(v(14.29), "reveal_air_a", -13, px(1677), "onset", B, "«قبل» reveals; the playhead starts travelling right (14.29-15.59)", x=1300)
cue(v(15.59), "whoosh_long_rise", -14, px(1000), "peak", B, "the playhead travels x 760 -> 1000 and the window grows (eio, arrives 15.59)", x=880, tv=v(14.29))
cue(v(14.68), "reveal_air_b", -14, px(1568), "onset", B, "«تنفيذ» reveals + a GHOST first-trade chip appears (dashed)", x=1000,
    layers=[L(v(14.68), "pop_a", -16, px(1000), rate=0.94)])
cue(v(15.31), "reveal_air_c", -15, px(1475), "onset", B, "«أي» reveals", x=1475)
cue(v(15.59), "stamp", -7, px(1000), "onset", B, "«صفقة»: FIRST-TRADE chip turns solid + ring; a candle prints; the RED cutoff rises", x=1000,
    layers=[L(v(15.59), "scan_draw_a", -15, px(1000), dur=0.3), L(v(15.66), "shutter_close", -6, px(700))])
cue(v(15.96), "lock_padlock", -4, px(330), "onset", B, "the PADLOCK drops (15.70-15.88) and its shackle SNAPS (15.96) + shake + red ring", x=330)
cue(v(16.15), "tick_b", -14, px(1100), "onset", B, "the 8 trades print right of the cutoff, one every 0.11 s (16.04-16.92)", x=1290,
    repeat=[7, 0.11], rate_step=0.02, pan_to=px(1512), tv=v(16.15))
cue(v(16.42), "scan_draw_a", -13, px(980), "onset", B, "the bracket «هذه المرحلة» draws from the centre out + its label rises; START dome pulses", x=980)

# ------------------------------------------------------------------ D · VC EW staircase (VO 17.09-21.85)
B = "D"
cue(v(17.09), "impact_deep", -7, 0.0, "onset", B, "hard cut to the extreme wide: floor RIPPLE (R 6 m) + pad rim traces (17.11-17.45)", x=960,
    layers=[L(v(17.09), "sonar_white", -10, 0.0)])
cue(v(17.52), "scan_draw_a", -11, px(1420), "onset", B, "the ground line runs to x 1780 + WITHDRAW symbol draws + «القاعدة» rises", x=1500,
    pan_to=px(1780), layers=[L(v(17.52), "reveal_air_a", -15, px(1780)), L(v(17.60), "scan_draw_b", -12, px(1540), pan_to=px(340))])
cue(v(17.70), "pop_a", -13, px(1655), "onset", B, "the six TAG stage cards pop in DIM, S1 -> S6 (0.08 s stagger)", x=1000,
    repeat=[6, 0.08], rate_step=0.025, pan_to=px(455), tv=v(17.70))
cue(v(18.41), "tick_a", -8, px(1655), "onset", B, "S1 turns DONE (red cut + tick) · S2 LIGHTS (DOME, '$20,000') · the flag MARKER drops onto S2", x=1415,
    layers=[L(v(18.45), "ping_land_b", -13, px(1415)), L(v(18.45), "flag_drop", -11, px(1415))])
cue(v(19.62), "scan_draw_b", -9, px(1060), "onset", B, "the red COMET climbs the stair line from the pad to S6 (0.90 s eio)", x=900, pan_to=px(455))
cue(v(20.06), "tick_c", -11, px(1716), "onset", B, "the RULE MARK stamps on each landing as the comet passes (red tick drops, S1 -> S6)", x=1000,
    repeat_times=[0.0, 0.03, 0.09, 0.14, 0.20, 0.29], rate_step=0.03, pan_to=px(516), tv=v(20.06))
cue(v(20.30), "reveal_air_b", -13, px(1700), "onset", B, "readout line 2 «في جميع المراحل» rises", x=1700)
cue(v(20.65), "tick_b", -11, px(1800), "onset", B, "the readout's rule-mark glyph: bar draws, RED tick drops 6 px", x=1800)
cue(v(21.17), "sonar_red", -8, 0.0, "onset", B, "«Axi»: the six rule marks pop together + STAGE PULSE from the pad", x=1000,
    layers=[L(v(21.17), "pop_c", -12, px(1100))])
cue(v(21.53), "whoosh_soft_b", -12, px(800), "peak", B, "exit: readout fades, cards fold into their landings, the line retracts to the pad (21.40-21.66)", x=1000, tv=v(21.40))

# ------------------------------------------------------------------ E · B-ROLL 3 «علامة Edge Score» (VO 21.85-28.05)
# Replaces the old E (L1 three-quarter shot with the gauge card, 7 cues; backup in work/backup_pre_br3/). Full-screen MG:
# the minimum Edge Score of every stage as bars RTL (Seed 50 DONE, Incubation 60 ghost -> LIT, Acceleration 70, Pro /
# Pro 500 / Pro M 90). Times from W2 comp/src/35_edge.js eg_K and scratchpad ep2/broll3_spec.json; every event checked on
# the rendered frames 555-722 (rev2-edge/qa/all0, frame f shows VO 0.04 f - 0.61). Word onsets (vo2_v3 = the voice of the
# mix, VO s): للتأهّل 21.95 · لمرحلة 22.41 · الـ Incubation 22.79/22.82 · يجب 23.77 · Edge 25.06 · Score /s/ 25.19 · لا 26.43
# · تقلّ 26.74 · عن 27.21 · ستّين /s/ 27.39 · وأقل 28.11; pauses 21.76-21.94, 23.61-23.77, 26.37-26.43, 28.01-28.10.
# Transients (pop / tick / thud / counter) start and peak outside [onset - 15 ms, onset + 60 ms] (the mixer's
# window); under «Incubation» and «Edge Score» only non-transient sounds (scan, whoosh, cam). Nothing on «ستّين»: the
# counter's last tick lands on '58' before it, the landing (27.48) and the sheen are silent, and the settle sounds in
# the pause. (review) Also checked with the lip-synced timing (vo2_v3 moved +85.4 ms = vo2_dry): للتأهّل 22.04 · لمرحلة
# 22.50 · Incubation 22.91 · يجب 23.86 · لا 26.53 · عن 27.30 · ستّين /s/ 27.475-28.00 · وأقل 28.20 (pauses 21.76-22.03,
# 23.62-23.86, 26.30-26.52, 28.01-28.19); the mixer's onset check passes with both timings.
# Exactly 8 cue() calls, as the old E had, so the index-seeded rate variation of every later cue (finish()) is unchanged.
B = "E"


def _deg(name, k):
    """playback rate that moves a tonal palette file k D-minor scale degrees from its own tone (A4 pop_a: 1 = Bb4, 2 = C5)"""
    i = min(range(len(_SCALE)), key=lambda j: abs(_SCALE[j] / BASE[name] - 1))
    return round(_SCALE[i + k] / BASE[name], 5)


cue(v(21.85), "whoosh_hard_a", -7, 0.0, "peak", B, "HARD CUT into B-roll 3 in the pause (as B-rolls 1 and 2): the lit world + the "
    "BASELINE draws right to left (x 1720 -> 220, 21.85-22.30)", x=960,
    layers=[L(v(21.85), "thud_soft_a", -13, 0.0), L(v(21.85), "scan_draw_a", -14, px(1720), pan_to=px(220), pan_dur=0.45, rate=1.1)])
# the bar run is its own cue (the mixer levels it as a UI event, not under the cut whoosh): its t is the Acceleration
# pluck (22.06, >= 0.12 s after the cut, so finish() keeps it separate) and Seed's earlier pluck rides as a layer
cue(v(22.06), "pop_a", -17, px(1100), "onset", B, "the six BARS rise out of the baseline right to left (0.07 s stagger, 0.40 s expo), "
    "each chip 0.04 s behind: Seed 21.92, Acceleration 22.06, Pro 22.13, Pro 500 22.20, Pro M 22.27; the dashed Incubation GHOST "
    "(21.99) is the one silent slot. Soft A4 plucks that climb with the bar heights 50 -> 70 -> 90 (A4 Bb4 C5) and then HOLD "
    "(2 scale steps, no run up the scale) | headline «علامة Edge Score» per word (22.03 / 22.10) + its flag (21.98-22.20) | the "
    "static metallic numbers rise and fade in right to left ('50' 22.22, '70' 22.36, '90' 22.43 / 22.50 / 22.57)",
    x=1100, rate=_deg("pop_a", 1),
    layers=[L(v(21.92), "pop_a", -17, px(1600)),
            L(v(22.13), "pop_a", -19, px(850), rate=_deg("pop_a", 2)),   # 2 dB down: it falls on a syllable inside «للتأهّل» (22.12)
            L(v(22.20), "pop_a", -17.5, px(600), rate=_deg("pop_a", 2)),
            L(v(22.27), "pop_a", -18, px(350), rate=_deg("pop_a", 2)),
            L(v(22.03), "reveal_air_a", -15, px(1560)),
            L(v(22.22), "shimmer_sheen", -18, px(1600), pan_to=px(350), pan_dur=0.35)])
cue(v(22.472), "tick_a", -13, px(1490), "onset", B, "Seed's chip turns DONE: the RED top-left cut (22.42) and the white tick (22.49-22.57); "
    "62 ms after the onset of «لمرحلة» (22.41) | headline line 2 «الحدّ الأدنى للتأهّل لكل مرحلة» reveals per word (22.55 + 0.07 i)",
    x=1490, y=820, tv=v(22.41), layers=[L(v(22.55), "reveal_air_b", -16, px(1450))])
cue(v(22.88), "scan_draw_a", -16, px(1350), "onset", B, "«Incubation»: Incubation LIGHTS (ghost dashes -> solid PANEL + 2 px RED rim, "
    "22.88-23.18; chip rim + name; the DOME draws 22.90-23.40), non-transient on the word | PUSH-IN on Incubation: the chart "
    "scales 1 -> 1.08 about its foot + the floor dollies 0.8 m (22.94-23.74 eio, cam_push peaks at its fastest point 23.33), the "
    "five other columns dim to .7 | the focus BRACKET: four RED corner triangles fly out to x 1222-1478, y 336-878 (22.94-23.34 "
    "expo, first seen 22.99, fastest 22.99-23.03: the whoosh peaks there)", x=1350, dur=0.55, rate=0.95,
    layers=[L(v(22.96), "cam_push", -11, 0.15, rate=0.92), L(v(22.98), "whoosh_soft_c", -15, px(1350), sync="peak")])
cue(v(23.70), "tick_c", -12, px(1350), "onset", B, "the THRESHOLD LINE (white, 3 px, at the 60 level) draws right to left across "
    "Incubation's top (23.70-24.00), in the pause before «يجب» (23.77)", x=1350, y=470,
    layers=[L(v(23.70), "scan_draw_a", -18, px(1436), pan_to=px(1264), pan_dur=0.3, rate=1.25, dur=0.3)])
cue(v(25.17), "scan_draw_a", -14, px(1535), "onset", B, "«Edge»: the 3 px RED UNDERLINE draws right to left under the headline's 'Edge "
    "Score' (x 1535 -> 1220, 25.17-25.42), non-transient on the word | «الخاصة بك»: the METER WELL fades in inside the Incubation "
    "bar (25.78-26.08) and its 5 ticks draw bottom to top (25.84-26.15): one upward sweep, non-transient under the words",
    x=1380, y=198, pan_to=px(1220), pan_dur=0.25, rate=1.2, dur=0.35,
    layers=[L(v(25.79), "scan_draw_a", -15, px(1350), rate=1.15, dur=0.4)])
cue(v(26.402), "pop_b", -14, px(1350), "onset", B, "in the pause before «لا» (26.37-26.43): the SKELETON dissolves (26.34-26.46) and "
    "the counter's '0' fades in (26.38-26.50) | «لا تقلّ عن»: the '60' counter runs 0 -> 58 (quartOut) while the RED FILL rises "
    "in the meter (26.46-27.48); (review) the roll file starts at 26.495, 1 frame after the count starts (frame 677), and its first tick is the file's first sample: 62 ms after the onset of «لا» in v3 at lag 0 (26.433), 30 ms before it with the lip-synced timing (26.525), and clear of the breath that v3 has at 26.34-26.36 (26.43 once moved +85 ms), which the mixer reads as an onset; its last tick "
    "lands on '58' at 27.275, inside «تقلّ عن» in v3 at lag 0 and 25 ms before «عن» (27.30) with the lip-synced timing, 115 / 200 ms before «ستّين» (/s/ 27.39 / 27.475); 59 / 60 and the landing stay silent",
    x=1350, y=420, tv=v(26.37), layers=[L(v(26.495), "counter_roll_m", -11, px(1350), sync="onset", rate=0.873)])
# the settle is the cue (t = its pop): the mixer levels this event by the short pop; the cut whoosh is trimmed to 0.3 s
# so it does not ring into «وأقل». (review) The settle is at 28.01, not 27.98: vo2_v3 runs 85.4 ms EARLY against the lips
# in VO 3.7-15.9 and 18.7-44.6 (the HeyGen looks' own audio matches vo2_dry at lag 0), so the mix has to move it; with the
# lip-synced timing «ستّين» decays until about 28.00 (pause 28.01-28.19), and 28.01 is in the pause with either timing
# (v3 at lag 0: 27.96-28.11). (review) The sheen across the landed '60' (27.62-27.97) has NO sound: it lies entirely inside
# «ستّين» with either timing (v3 27.39-27.96, lip-synced 27.475-28.00), and nothing may sound on «ستّين». A ping was tried
# for the settle and dropped: even damped to 0.22 s its ring sat over the onset of «وأقل» (1-8 kHz -4 dB re the voice at
# the mixer's UI level; pop_c -12 dB)
cue(v(28.01), "pop_c", -13, px(1350), "onset", B, "SETTLE in the pause after «ستّين» (v3 at lag 0: 27.96-28.11; lip-synced: 28.01-28.19): '60+' holds at full "
    "opacity after its sheen; the F5 pop of the series' RED '+' answers the silent landing (27.48: the line turns RED and pops, "
    "the brackets snap 6 px, the '+' lands 27.50-27.62), kept off «ستّين»; the sheen across the landed '60' (27.62-27.97) is "
    "silent (inside «ستّين») | hard CUT to F at full opacity (28.05)", x=1350, y=420, tv=v(27.97),
    layers=[L(v(28.01), "thud_soft_b", -15, px(1350)),
            L(v(28.05), "whoosh_soft_c", -18, 0.0, sync="peak", dur=0.3)])

# ------------------------------------------------------------------ F · L5 two cards (VO 28.05-32.37)
B = "F"
cue(v(28.46), "slide_card_a", -7, px(1520), "onset", B, "RIGHT card enters «الشرط الأول»", x=1520)
cue(v(28.62), "slide_card_b", -7, px(400), "onset", B, "LEFT card enters «الشرط الثاني» + the right mini gauge sweeps red to 60 % (28.62-28.95)", x=400,
    layers=[L(v(28.62), "scan_draw_a", -15, px(1600), dur=0.4)])
cue(v(28.80), "reveal_air_b", -15, px(330), "onset", B, "the CANDLES symbol draws (28.80-29.30)", x=330)
cue(v(28.96), "tick_a", -8, px(1700), "onset", B, "the right card's chamfer becomes a RED CHECK TAB", x=1700)
cue(v(29.38), "reveal_air_a", -13, px(400), "onset", B, "«في حساب التداول» rises", x=400)
cue(v(31.71), "counter_roll_m", -9, px(400), "peak", B, "the skeleton dissolves; '$1,000' counts 0 -> 1,000 (31.00-31.71)", x=400, tv=v(31.00), rate=0.96)
cue(v(31.71), "ping_land_b", -11, px(400), "onset", B, "'$1,000' lands on «ألف» + a RED '+' lands (31.78)", x=400,
    layers=[L(v(31.78), "pop_c", -12, px(250))])
cue(v(31.84), "tick_a", -8, px(560), "onset", B, "the left CHECK TAB ticks", x=560, rate=1.04)

# ------------------------------------------------------------------ G · DROP 1 (VO 32.37-36.41)
B = "G"
cue(v(32.37), "boom_drop", -8, 0.0, "onset", B, "DROP 1 smash cut: floor RIPPLE (red + white rings), pool flash (layers the score's drop hit)", x=960,
    layers=[L(v(32.37), "sonar_white", -11, 0.0)])
cue(v(33.28), "reveal_air_c", -12, 0.0, "onset", B, "the axi wordmark rises 12 px into the top centre", x=960)
cue(v(33.69), "reveal_air_a", -12, px(1100), "onset", B, "headline «تمويلك» reveals + the scene's flag unfurls (33.70-33.92)", x=1100,
    layers=[L(v(33.70), "flag_flutter", -15, px(1250))])
cue(v(34.45), "reveal_air_b", -13, px(860), "onset", B, "«حتى» reveals (grey)", x=860)
cue(v(34.86), "riser_short", -11, 0.0, "peak", B, "riser into 'x10'", x=960, tv=v(34.86))
cue(v(34.86), "impact_deep", -6, 0.0, "onset", B, "metallic 'x10' LANDS over his head (scale 1.04 -> 1 + 20 px rise) + pool brightens", x=960,
    layers=[L(v(34.86), "ping_land_b", -11, 0.0), L(v(34.95), "pop_b", -13, px(800), repeat=[3, 0.08], rate_step=0.06)])
cue(v(35.27), "slide_card_b", -9, px(1200), "onset", B, "TAG chip CANDLES '$1,000' enters right of 'x10' (lands 35.62)", x=1200)
cue(v(35.62), "shimmer_sheen", -11, 0.0, "onset", B, "one sheen across the metallic 'x10'", x=960)

# ------------------------------------------------------------------ H · B-ROLL 2 (VO 36.41-47.41)
B = "H"
cue(v(36.41), "whoosh_hard_b", -5, 0.0, "peak", B, "hard cut into B-roll 2 + the gate's corner triangles fly out + kicker «مثال» + flag (36.52)", x=960,
    layers=[L(v(36.41), "thud_soft_b", -12, 0.0), L(v(36.52), "reveal_air_a", -13, px(1684)), L(v(36.54), "flag_flutter", -15, px(1775))])
cue(v(37.05), "slide_card_a", -7, px(1520), "onset", B, "RIGHT card «حسابك» enters; its CANDLES draw", x=1520)
cue(v(38.01), "counter_roll_s", -9, px(1566), "peak", B, "'$1,000' counts 0 -> 1,000 (37.51-38.01)", x=1566, tv=v(37.51), rate=0.9)
cue(v(38.01), "ping_land_a", -11, px(1566), "onset", B, "'$1,000' lands on «ألف» + block 1 pops into the well (38.00)", x=1665,
    layers=[L(v(38.00), "pop_b", -11, px(1665))])
cue(v(38.31), "shimmer_sheen", -13, px(1566), "onset", B, "one sheen across '$1,000'", x=1566)
cue(v(38.75), "thud_soft_b", -9, 0.0, "onset", B, "THE GATE ARMS: rim turns RED, 'x10' rises through its clip, corners snap out and back", x=960,
    layers=[L(v(38.78), "reveal_air_c", -13, 0.0), L(v(38.75), "tick_c", -12, 0.0)])
cue(v(39.22), "slide_card_b", -7, px(420), "onset", B, "LEFT card «تمويل Axi» enters; axi wordmark rises (39.25); VAULT draws (39.34)", x=420,
    layers=[L(v(39.34), "scan_draw_a", -15, px(240), dur=0.45)])
cue(v(39.80), "whoosh_soft_a", -9, px(1380), "peak", B, "a GHOST block rides the in-path into the gate, led by the red comet (39.55-40.05)", x=1380, tv=v(39.55))
cue(v(40.05), "ping_land_b", -8, 0.0, "onset", B, "the gate FLASHES (rim white -> RED, 'x10' pulse) + the vault spokes turn 120°", x=960,
    layers=[L(v(40.05), "click_ui_b", -13, px(240))])
cue(v(40.20), "glitch_swipe_b", -10, px(800), "onset", B, "TEN blocks fly out of the gate into the grid (0.05 s stagger), '$10,000' counts", x=600,
    layers=[L(v(40.75), "counter_roll_s", -10, px(460), sync="peak", rate=0.82), L(v(40.50), "pop_a", -17, px(585), repeat=[10, 0.05], rate_step=0.02, pan_to=px(265))])
cue(v(40.75), "ping_land_a", -11, px(460), "onset", B, "'$10,000' lands on «عشرة»", x=460)
cue(v(41.15), "pop_c", -12, px(250), "onset", B, "▲▲▲ pop left of '$10,000' and wave + one sheen (41.15-41.55)", x=300,
    repeat=[3, 0.08], rate_step=0.06, layers=[L(v(41.15), "shimmer_sheen", -13, px(460))])
cue(v(41.54), "pop_a", -12, px(240), "onset", B, "the vault hub pulses once", x=240, rate=0.94)
cue(v(41.93), "reveal_air_b", -13, px(1580), "onset", B, "«آخر» joins the kicker", x=1580)
cue(v(42.15), "whoosh_long_fall", -13, px(500), "onset", B, "RESET: the ten blocks drop and fade, '$10,000' and ▲▲▲ fade, the gate disarms", x=600)
cue(v(43.10), "slide_card_b", -12, px(1585), "onset", B, "block 2 slides in beside block 1", x=1585)
cue(v(43.32), "counter_roll_s", -10, px(1556), "peak", B, "the balance counts 1,000 -> 2,000 (42.82-43.32)", x=1556, tv=v(42.82), rate=0.9)
cue(v(43.32), "ping_land_a", -11, px(1556), "onset", B, "'$2,000' lands on «ألفين»", x=1556, rate=1.06)
cue(v(43.68), "shimmer_sheen", -13, px(1556), "onset", B, "one sheen across '$2,000'", x=1556)
cue(v(44.05), "thud_soft_b", -10, 0.0, "onset", B, "the gate re-arms: rim RED, corners snap, paths brighten", x=960,
    layers=[L(v(44.05), "tick_c", -12, 0.0, rate=1.05)])
cue(v(44.75), "pop_b", -12, px(440), "onset", B, "the axi wordmark pulses (1.04)", x=440)
cue(v(45.30), "whoosh_soft_a", -9, px(1380), "peak", B, "two GHOST blocks ride into the gate 0.12 s apart, each led by a comet (45.05-45.67)", x=1380, tv=v(45.05),
    layers=[L(v(45.42), "whoosh_soft_c", -12, px(1300), sync="peak")])
cue(v(45.66), "ping_land_b", -8, 0.0, "onset", B, "the gate flashes; the total shows as a skeleton (shimmer)", x=960, rate=0.95)
cue(v(45.99), "glitch_swipe_a", -10, px(800), "onset", B, "TWENTY blocks fly into the grid (0.035 s stagger)", x=600,
    layers=[L(v(46.29), "tick_b", -19, px(585), repeat=[20, 0.035], rate_step=0.006, pan_to=px(265))])
cue(v(46.76), "pop_c", -9, px(1625), "onset", B, "«هذا المبلغ»: the right card's two blocks get a RED rim and pop (46.76, 46.91) + a RED underline under '$2,000'", x=1600,
    repeat=[2, 0.15], layers=[L(v(46.76), "scan_draw_a", -15, px(1556), dur=0.35)])

# ------------------------------------------------------------------ I · L3 $20,000 (VO 47.41-50.65)
B = "I"
cue(v(47.41), "whoosh_soft_c", -14, 0.0, "peak", B, "hard cut out of B-roll 2 to the profile", x=960)
cue(v(47.86), "reveal_air_a", -12, px(450), "onset", B, "kicker «قيمة التمويل» rises 16 px", x=450)
cue(v(48.20), "pop_a", -12, px(260), "onset", B, "the equation line rises left to right: '$2,000' '×' '10' '=' (0.06 s stagger)", x=400,
    repeat=[4, 0.06], rate_step=0.04, pan_to=px(640))
cue(v(49.30), "counter_roll_m", -9, px(420), "peak", B, "'$20,000' counts 0 -> 20,000 (48.60-49.30)", x=420, tv=v(48.60), rate=0.97)
cue(v(49.30), "ping_land_b", -9, px(420), "onset", B, "'$20,000' lands on «عشرين» + ▲▲▲ pop to its right (49.32)", x=420,
    layers=[L(v(49.32), "pop_b", -13, px(700), repeat=[3, 0.08], rate_step=0.06)])
cue(v(49.45), "reveal_air_b", -12, px(420), "onset", B, "the cap row rises: DOME + «سقف التمويل» + 'Incubation'", x=420)
cue(v(49.90), "shimmer_sheen", -11, px(420), "onset", B, "one sheen across '$20,000'", x=420)

# ------------------------------------------------------------------ J · L5 condition 1 (VO 50.65-54.65)
B = "J"
cue(v(51.08), "slide_card_a", -7, px(1585), "onset", B, "the CARD enters with the condition pips on top (pip 1 LIT)", x=1585)
cue(v(51.66), "pop_c", -11, px(1715), "onset", B, "pip 1 (tickets) pulses once", x=1715)
cue(v(52.68), "counter_roll_m", -9, px(1585), "peak", B, "the TICKET GRID fills (40 tickets RTL, 0.017 s stagger) while '40' counts", x=1585, tv=v(51.99),
    layers=[L(v(51.99), "scan_draw_a", -16, px(1700), pan_to=px(1400))])
cue(v(52.68), "ping_land_a", -10, px(1585), "onset", B, "'40' lands on «أربعين»", x=1585)
cue(v(53.09), "reveal_air_a", -12, px(1585), "onset", B, "«صفقة مستقلّة» rises", x=1585)
cue(v(53.38), "glitch_swipe_b", -16, px(1585), "onset", B, "the grid's gaps open by 4 px: separate trades", x=1585)
cue(v(54.01), "pop_c", -9, px(1500), "onset", B, "RED '+' lands ('40+') + pip 1 turns DONE", x=1585,
    layers=[L(v(54.03), "tick_a", -12, px(1715))])

# ------------------------------------------------------------------ K · L2 condition 2 (VO 54.65-57.01)
B = "K"
cue(v(55.06), "reveal_air_a", -12, px(420), "onset", B, "«عائد» rises + the chart's corner triangles fly out around the dotted TARGET line", x=380,
    layers=[L(v(55.06), "whoosh_soft_c", -13, px(380), sync="onset")])
cue(v(55.20), "tick_b", -12, px(250), "onset", B, "five candles step up toward the target line (0.1 s stagger)", x=380,
    repeat=[5, 0.10], rate_step=0.03, pan_to=px(520))
cue(v(55.66), "reveal_air_b", -14, px(420), "onset", B, "kicker «لا يقلّ عن» rises (grey)", x=420)
cue(v(56.12), "pop_b", -12, px(250), "onset", B, "▲▲▲ pop left of the numeral (0.08 s stagger)", x=300, repeat=[3, 0.08], rate_step=0.06,
    layers=[L(v(56.20), "ping_land_b", -9, px(400)), L(v(56.20), "thud_soft_b", -13, px(400))])

# ------------------------------------------------------------------ L · VC WIDE condition 3 (VO 57.01-61.49)
B = "L"
cue(v(57.01), "thud_soft_a", -10, 0.0, "onset", B, "hard cut to WIDE; the floor pool comes on", x=960)
cue(v(57.42), "scan_draw_b", -10, 0.0, "onset", B, "the dashed RED LIMIT RING draws clockwise on the floor around the stool (57.42-58.12)", x=960,
    layers=[L(v(57.42), "sub_drop", -16, 0.0), L(v(57.44), "reveal_air_a", -13, px(1000)), L(v(57.46), "flag_flutter", -16, px(1250))])
cue(v(57.60), "pop_a", -12, px(1100), "onset", B, "the pip row lands under the headline (1-2 DONE, 3 LIT)", x=1000, repeat=[4, 0.08], rate_step=0.03,
    pan_to=px(820))
cue(v(57.80), "whoosh_soft_c", -13, px(1500), "onset", B, "the right chart's corner triangles fly out", x=1500)
cue(v(58.12), "scan_draw_a", -11, px(1300), "onset", B, "the dashed RED limit line draws left to right with '−10%' + the EQUITY LINE falls (58.20-58.57)", x=1500,
    pan_to=px(1700), layers=[L(v(58.20), "scan_draw_a", -13, px(1350), rate=0.85, pan_to=px(1700))])
cue(v(59.18), "thud_soft_b", -8, px(420), "onset", B, "'−10%' LANDS in the left third (red '−' + metallic '10%') + footnote fades in", x=420,
    layers=[L(v(59.18), "ping_land_b", -12, px(420), rate=0.89)])
cue(v(59.32), "thud_soft_a", -12, px(1500), "onset", B, "the limit line pulses 3 times while the equity holds above it", x=1500,
    repeat_times=[0.0, 0.28, 0.56], rate=0.85, tv=v(59.32))
cue(v(59.45), "shimmer_sheen", -12, px(450), "onset", B, "one sheen across the metallic '10%'", x=450)
cue(v(60.08), "scan_draw_a", -12, px(1500), "onset", B, "the equity line recovers: it climbs 60 px", x=1500, rate=1.1, dur=0.5)
cue(v(60.48), "tick_c", -14, px(1650), "onset", B, "the line keeps printing: a new point every 0.3 s while the plot scrolls", x=1650,
    repeat=[3, 0.30], rate_step=0.03)

# ------------------------------------------------------------------ M · L1 condition 4 (VO 61.49-67.53)
B = "M"
cue(v(61.92), "slide_card_a", -7, px(1530), "onset", B, "the CARD enters with the pip row (1-3 DONE, 4 LIT)", x=1530)
cue(v(62.25), "scan_draw_a", -11, px(1400), "onset", B, "the CALENDAR draws + the DAY TRACK draws left to right with 12 ticks + «فترة لا تقلّ عن» rises", x=1530,
    pan_to=px(1750), layers=[L(v(62.30), "reveal_air_b", -14, px(1600))])
cue(v(63.31), "counter_roll_m", -9, px(1530), "peak", B, "'60' counts 0 -> 60 while the day ticks turn white", x=1530, tv=v(62.70), rate=1.11)
cue(v(63.31), "ping_land_a", -10, px(1700), "onset", B, "'60' lands on «60» + the '60' label at the track's end lights", x=1700)
cue(v(63.89), "reveal_air_a", -12, px(1530), "onset", B, "«يوماً» rises", x=1530)
cue(v(65.80), "stamp", -7, px(1300), "onset", B, "the FIRST-TRADE chip (from B-roll 1) drops onto the track's start + the track fills RED to day 60", x=1300,
    layers=[L(v(65.85), "scan_draw_a", -12, px(1300), pan_to=px(1750))])
cue(v(66.43), "tick_a", -11, px(1715), "onset", B, "pip 4 turns DONE, then the four DONE pips pulse right to left (the recap)", x=1600,
    repeat=[4, 0.08], rate_step=0.04, pan_to=px(1460))
cue(v(66.95), "tick_b", -8, px(1790), "onset", B, "the card's chamfer becomes a RED CHECK TAB", x=1790,
    layers=[L(v(66.95), "pop_c", -14, px(1790))])

# ------------------------------------------------------------------ N · VC EW flag climbs (VO 67.53-72.37)
B = "N"
cue(v(67.53), "thud_soft_a", -11, 0.0, "onset", B, "hard cut to the extreme wide: the staircase stands, pad + pool on", x=960)
cue(v(67.95), "flag_drop", -9, px(1415), "onset", B, "the flag MARKER drops 6 px onto S2", x=1415)
cue(v(68.07), "pop_b", -11, px(1650), "onset", B, "the four DONE pips pulse once together", x=1650)
cue(v(68.57), "tick_c", -12, px(1180), "onset", B, "S3 pre-highlights (outline .6)", x=1180)
cue(v(69.19), "reveal_air_a", -12, px(1700), "onset", B, "readout label «المرحلة الثالثة» rises", x=1700)
cue(v(69.85), "whoosh_soft_c", -10, px(1300), "peak", B, "the marker slides along the stair S2 -> S3 (0.45 s expo); S2 turns DONE", x=1300, tv=v(69.62),
    layers=[L(v(69.74), "tick_a", -12, px(1415))])
cue(v(71.30), "sonar_red", -8, 0.0, "onset", B, "«Acceleration»: S3 LIGHTS (chevrons ignite bottom to top) + STAGE PULSE + readout adds 'Acceleration' '$100,000'", x=1180,
    layers=[L(v(71.30), "ping_land_b", -11, px(1180), rate=1.12), L(v(71.30), "pop_c", -13, px(1180), repeat=[3, 0.06], rate_step=0.06),
            L(v(71.36), "reveal_air_c", -14, px(1700))])
cue(v(71.60), "scan_draw_a", -14, px(1600), "onset", B, "a 3 px RED underline draws under 'Acceleration'", x=1600, rate=1.2, dur=0.35)
cue(v(72.17), "whoosh_soft_b", -12, px(800), "peak", B, "exit: readout/pips/marker fade, the cards fold (S6 first), the line retracts, pad out", x=1000, tv=v(72.04))

# ------------------------------------------------------------------ O · L3 what's next (VO 72.37-76.05)
B = "O"
cue(v(72.84), "whoosh_soft_a", -10, px(500), "onset", B, "the SIX EPISODE CHIPS reveal right to left (0.05 s stagger, scaleX from the right)", x=450,
    layers=[L(v(72.84), "pop_a", -17, px(750), repeat=[6, 0.05], rate_step=0.03, pan_to=px(150))])
cue(v(73.71), "pop_c", -10, px(500), "onset", B, "chip 03 pulses; its outline goes RED", x=500)
cue(v(74.57), "slide_card_b", -10, px(450), "onset", B, "the next-video deck fans in: three cards, 0.08 s stagger", x=450, repeat=[3, 0.08], rate_step=0.04)
cue(v(74.90), "pop_b", -10, px(450), "onset", B, "the RED pill «انتقل إلى الفيديو التالي» appears (white circle, red ←)", x=450)
cue(v(75.25), "shimmer_sheen", -12, px(450), "onset", B, "one sheen on the metallic '(3)'", x=450)
cue(v(75.55), "click_ui_b", -10, px(300), "onset", B, "the arrow taps left (7 px out and back)", x=300)

# ------------------------------------------------------------------ P · DROP 2 «مبروك!» (VO 76.05-77.21)
B = "P"
cue(v(76.05), "boom_drop", -8, 0.0, "onset", B, "DROP 2: hard cut to the close-up (layers the score's drop hit)", x=960)
cue(v(76.31), "chime_glass", -5, px(450), "onset", B, "«مبروك!» lands + its flag unfurls + 16 brand particles burst out", x=450,
    layers=[L(v(76.33), "flag_flutter", -14, px(622))])

# ------------------------------------------------------------------ Q · VC WIDE 40 % (VO 77.21-84.61)
B = "Q"
cue(v(77.21), "thud_soft_a", -11, 0.0, "onset", B, "hard cut to WIDE; pool .18", x=960)
cue(v(77.64), "reveal_air_a", -12, px(1300), "onset", B, "headline reveals per word from the right («أصبح لك») + the scene's flag", x=1300,
    layers=[L(v(77.66), "flag_flutter", -15, px(1500))])
cue(v(78.15), "reveal_air_b", -12, px(1100), "onset", B, "«حصّة مشاركة» reveals + the DONUT track draws clockwise (78.16-78.60)", x=1300,
    layers=[L(v(78.16), "scan_draw_a", -12, px(1318))])
cue(v(79.44), "counter_roll_s", -9, px(1318), "peak", B, "the RED arc sweeps counter-clockwise to 40 % while '40%' counts (78.99-79.44)", x=1318, tv=v(78.99),
    layers=[L(v(79.44), "riser_short", -14, px(1318), sync="peak")])
cue(v(79.44), "ping_land_a", -9, px(1318), "onset", B, "'40%' lands on «40» + ▲▲▲ pop in the hole (79.46) + labels «لك» / 'Axi' land (79.50)", x=1318,
    layers=[L(v(79.46), "pop_b", -13, px(1250), repeat=[3, 0.08], rate_step=0.06), L(v(79.50), "reveal_air_c", -15, px(1400))])
cue(v(80.84), "slide_card_b", -7, px(500), "onset", B, "the LEFT card enters (VAULT, «حساب», skeleton name) + «من الأرباح المحقّقة» rises", x=500,
    layers=[L(v(80.84), "reveal_air_a", -14, px(1318))])
cue(v(81.01), "tick_b", -16, px(420), "onset", B, "the mini profit chart builds: 10 candles rising (0.04 s stagger)", x=450, repeat=[10, 0.04], rate_step=0.015,
    pan_to=px(640))
cue(v(81.30), "glitch_swipe_a", -9, px(600), "onset", B, "PROFIT FLOW: 10 RED ◢ fly from the chart over his head into the red arc", x=900, pan_to=None)
cue(v(81.60), "pop_c", -12, px(1318), "onset", B, "the marks land in the arc, which thickens by 4 px", x=1318, rate=0.94)
cue(v(82.13), "cam_push", -7, 0.0, "onset", B, "camera push WIDE -> HOME (S-curve 0.7 s)", x=960)
cue(v(82.86), "reveal_air_c", -15, px(480), "onset", B, "the skeleton name field dissolves", x=480)
cue(v(83.00), "shimmer_logo", -8, px(480), "onset", B, "the OFFICIAL LOGO builds in the name field: axi rises (83.00-83.35)", x=480)
cue(v(83.21), "whoosh_soft_b", -15, px(480), "onset", B, "the SELECT tag wipes in (83.21-83.60)", x=480)
cue(v(84.35), "wipe_end", -5, 0.0, "peak", B, "END WIPE: a #000 chamfer panel with a red '/' edge sweeps in from the right (84.09-84.61)", x=960, tv=v(84.09))

# ------------------------------------------------------------------ END CARD (output 85.24-91.00)
B = "END"
cue(85.364, "boom_end", -7, 0.0, "onset", B, "end card: logo build on the score's ending hit (layers it) + the ◢ rows reveal (85.36-85.76)", x=960,
    layers=[L(85.364, "shimmer_logo", -8, 0.0)])
cue(85.62, "whoosh_soft_b", -14, 0.08, "onset", B, "the SELECT tag wipes in behind the red edge (85.62-86.09)", x=1050)
cue(86.21, "pop_b", -8, 0.0, "onset", B, "the RED pill «انضم إلى آكسي سيليكت» scales in (.92 -> 1)", x=960,
    layers=[L(86.21, "slide_card_a", -14, 0.0)])
cue(86.61, "reveal_air_c", -14, 0.0, "onset", B, "the footer fades in while its tracking tightens", x=960)
cue(86.91, "reveal_air_a", -16, 0.0, "onset", B, "the T&C fades in", x=960)
cue(87.81, "shimmer_sheen", -11, 0.0, "onset", B, "one white sheen across the RED pill", x=960)

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "..", "cues_ep2.json")
    close = finish(out, os.path.join(HERE, "..", "palette", "palette.json"))
    import json
    C = json.load(open(out))
    print(len(C), "cues ->", out)
    for c in close:
        print("merged:", c)
