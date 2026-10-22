#!/usr/bin/env python3
# VIDEO 1 (Seed, 120.0 s) · SFX cue sheet. Events from the spec (scratchpad sel/mg_final.json), the delivered group code
# (W1 comp/src: 30_open op_A/op_B/op_V/op_end, 31_join jn_K, 32_stages, 33_accounts ac_K/ac_TR, 34_broll br_K1/br_K2,
# 90_main endWipe) and the render (verify_sync.py). VO times go through w() (output = VO + 3.0); title / end card times
# are output seconds. PROTECTED (client): output 3.00-4.75 «مرحبا بك في برنامج التمويل» and 41.55-43.25 «خمسة آلاف
# دولار»: nothing starts or rings there (the A pull at 4.50, the '$ 5,000' landing 41.62, its sheen, exit and the
# H2 -> I pull at 43.02 stay silent; the title cues are cut to end by 2.94; the counter roll before 41.55 is cut at
# 41.40). Gains are relative to the palette's normalised level (-18 LKFS, 100 ms max).
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cuelib import cue, L, px, finish

P = 3.0
w = lambda t: round(t + P, 3)
HERE = os.path.dirname(os.path.abspath(__file__))
PROTECT = [(3.00, 4.75), (41.55, 43.25)]

# ------------------------------------------------------------------ TITLE (output 0-3.00): everything ends by 2.94
B = "TITLE"
cue(0.00, "whoosh_long_fall", -9, 0.35, "onset", B, "◢ texture sweep right to left (0-0.80) + bokeh in", x=960)
cue(0.25, "flag_flutter", -12, px(1286), "onset", B, "mirrored red flag unfurls (0.25-0.47)", x=1286, y=393)
cue(0.37, "reveal_air_a", -11, px(1140), "onset", B, "'(1)' rises 40 px through its clip (0.35-0.80)", x=1140, tv=0.35)
cue(0.49, "reveal_air_b", -12, px(900), "onset", B, "«كيف تبدأ» reveals word by word from the right (0.45, 0.1 s stagger)", x=900, tv=0.45)
cue(0.85, "shimmer_sheen", -13, px(1140), "onset", B, "one sheen across the metallic '(1)' (0.85-1.35) + «مع» rises 16 px (0.95)", x=1140)
cue(1.05, "shimmer_logo", -7, px(890), "onset", B, "official logo build: axi rises (1.05-1.50)", x=890, dur=1.82, fade=0.45)
cue(1.32, "whoosh_soft_b", -13, px(950), "onset", B, "SELECT tag wipes in behind the red '/' edge (1.32-1.82)", x=950, dur=1.5, fade=0.3)
cue(2.75, "whoosh_soft_c", -15, 0.0, "peak", B, "title exit: everything fades with y -10 px (2.62-2.94), black", x=960, tv=2.62, dur=0.30, fade=0.12)

# ------------------------------------------------------------------ A · VC HOME -> WIDE (VO 0-4.40). The pull (4.50) is in
# the protected window: silent.
B = "A"
cue(w(1.78), "shimmer_logo", -7, px(946), "onset", B, "official lockup builds in the void: axi rises (1.78-2.16); pool lifts .18 -> .30", x=946, y=305)
cue(w(2.10), "reveal_air_a", -12, px(1000), "onset", B, "kicker «برنامج التمويل» rises 16 px + its flag unfurls (2.16-2.38) | SELECT tag wipes (2.00-2.42)", x=1000, y=150,
    layers=[L(w(2.16), "flag_flutter", -15, px(1092)), L(w(2.00), "whoosh_soft_b", -15, px(1100))])
cue(w(2.20), "sonar_white", -8, 0.0, "onset", B, "◢ floor ripple ring wave from the stool (2.20-3.90)", x=960, y=900)
cue(w(4.08), "whoosh_soft_c", -14, px(946), "peak", B, "exit: SELECT tag wipes off RTL, axi sinks, the kicker fades, pool back (4.00-4.30)", x=946, tv=w(4.00))

# ------------------------------------------------------------------ B · L5 agenda cards (VO 4.40-8.84)
B = "B"
cue(w(4.80), "slide_card_a", -7, px(1600), "onset", B, "RIGHT card 01 «الاشتراك» enters (mini DARK pill «افتح حساب»)", x=1600)
cue(w(4.98), "reveal_air_c", -16, px(1700), "onset", B, "the cursor glides in to the pill's circle", x=1700)
cue(w(5.24), "click_ui_a", -6, px(1740), "onset", B, "CLICK on the mini pill (.96 for 2 frames + red ring)", x=1740)
cue(w(5.32), "slide_card_b", -7, px(320), "onset", B, "LEFT card 02 «التقدّم في المراحل» enters", x=320)
cue(w(5.80), "scan_draw_a", -11, px(460), "onset", B, "a 6-step stair line draws from bottom-right up to top-left (5.80-6.25)", x=360, pan_to=px(240))
cue(w(6.12), "flag_drop", -10, px(470), "onset", B, "the flag MARKER plants on step 1", x=470)
cue(w(6.30), "tick_c", -12, px(440), "onset", B, "the flag climbs one step every 0.2 s (5 expo hops, 6.30-7.30)", x=360, repeat=[5, 0.20], rate_step=0.04,
    pan_to=px(260))
cue(w(7.95), "shimmer_sheen", -11, 0.0, "onset", B, "one sheen across the metallic '01' and '02'", x=960)
cue(w(8.38), "whoosh_soft_a", -14, 0.0, "peak", B, "exit, right card first (8.30 / 8.36)", x=960, tv=w(8.30))

# ------------------------------------------------------------------ C · B-ROLL 1 account opening (VO 8.84-14.88)
B = "C"
cue(w(8.84), "whoosh_hard_a", -5, 0.0, "peak", B, "hard cut into B-roll 1 + the red disc pops (8.86)", x=960,
    layers=[L(w(8.84), "thud_soft_a", -12, 0.0), L(w(8.86), "pop_c", -11, px(700))])
cue(w(8.96), "tick_c", -14, px(700), "onset", B, "the white ← draws in the disc", x=700, rate=1.05)
cue(w(9.22), "slide_card_a", -10, px(600), "onset", B, "the DARK pill extends leftward out of the disc on «بفتح»", x=600)
cue(w(9.30), "reveal_air_a", -13, px(560), "onset", B, "the pill label «افتح حساب تداول» reveals right to left | + the cursor glides in (9.28)", x=560)
cue(w(9.70), "click_ui_a", -6, px(700), "onset", B, "CLICK on the disc + click ring", x=700)
cue(w(9.82), "whoosh_soft_c", -9, px(600), "onset", B, "the pill MORPHS into the chamfered account card; the disc becomes the header's flag (9.76)", x=640, tv=w(9.76),
    layers=[L(w(9.80), "flag_flutter", -14, px(860))])
cue(w(10.10), "reveal_air_b", -12, px(700), "onset", B, "header «حساب تداول» reveals + divider draws (10.18) + the chart well fills with candles (10.20)", x=700,
    layers=[L(w(10.18), "scan_draw_a", -15, px(600), dur=0.4), L(w(10.20), "tick_b", -19, px(450), repeat=[16, 0.035], rate_step=0.008, pan_to=px(900))])
cue(w(10.28), "reveal_air_c", -15, px(1200), "onset", B, "the field skeletons appear (name, company, status)", x=1200)
cue(w(11.02), "shimmer_logo", -8, px(1250), "onset", B, "the OFFICIAL LOGO builds in the name field", x=1250)
cue(w(12.04), "reveal_air_a", -14, px(1250), "onset", B, "skeleton 2 dissolves; the axi wordmark lands in the company field (12.12)", x=1250,
    layers=[L(w(12.12), "pop_a", -13, px(1250))])
cue(w(12.22), "pop_c", -11, px(1250), "onset", B, "the status field «نشط» appears with its pulsing red dot (12.18-12.22)", x=1250)
cue(w(12.64), "cam_push", -6, 0.0, "onset", B, "DIVE: the card's chart well zooms into the full-screen chart (12.64)", x=960)
cue(w(12.84), "stamp", -10, px(1550), "onset", B, "the edge marker grows into the RED TAG price tab", x=1550)
cue(w(13.00), "reveal_air_b", -12, px(1300), "onset", B, "headline 2 «تداول بالشكل الاعتيادي» + the travelling flag lands as its flag", x=1300,
    layers=[L(w(13.00), "flag_flutter", -15, px(1640))])
cue(w(13.20), "tick_b", -13, px(1450), "onset", B, "live candles print every 0.3 s", x=1450, repeat=[2, 0.30], rate_step=0.03)
cue(w(13.35), "pop_b", -9, px(1300), "onset", B, "BUY ticket: white ring on the close + dark chip with a RED ▲", x=1300,
    layers=[L(w(13.35), "tick_a", -12, px(1300))])
cue(w(13.80), "tick_b", -13, px(1450), "onset", B, "a live candle prints", x=1450, rate=1.06)
cue(w(13.90), "pop_c", -12, px(1200), "onset", B, "▲▲▲ pop beside the price", x=1200, repeat=[3, 0.07], rate_step=0.06)
cue(w(14.05), "pop_a", -9, px(1500), "onset", B, "SELL ticket: ring + chip with a white ▼", x=1500,
    layers=[L(w(14.05), "tick_c", -12, px(1500))])
cue(w(14.40), "tick_b", -13, px(1450), "onset", B, "live candles print (14.40, 14.70)", x=1450, repeat=[2, 0.30], rate_step=0.03)
cue(w(14.76), "riser_short", -10, 0.0, "peak", B, "into the cut: the final punch, a tall white candle + the corners snap (14.70-14.76)", x=1500, tv=w(14.70),
    layers=[L(w(14.76), "tick_a", -10, px(1600))])

# ------------------------------------------------------------------ D · DROP 1 WIDE Edge Score (VO 14.88-18.52)
B = "D"
cue(17.88, "boom_drop", -8, 0.0, "onset", B, "DROP 1 smash cut: floor RIPPLE (red ring + white ring 0.1 s behind) (layers the score's drop)", x=960,
    layers=[L(17.88, "sonar_white", -11, 0.0)])
cue(w(15.20), "sonar_red", -12, 0.0, "onset", B, "a steady red POOL fades in under the stool", x=960, y=950)
cue(w(15.35), "tick_b", -17, px(760), "onset", B, "the gauge powers on: 41 radial ticks appear left to right (0.012 s stagger)", x=960,
    repeat=[12, 0.042], rate_step=0.012, pan_to=px(1160), layers=[L(w(15.35), "scan_draw_a", -15, px(760), pan_to=px(1160))])
cue(w(16.04), "reveal_air_c", -12, 0.0, "onset", B, "'Edge Score' rises 12 px", x=960)
cue(w(16.30), "reveal_air_a", -13, 0.0, "onset", B, "«الحدّ الأدنى للانضمام» rises", x=960)
cue(w(17.96), "counter_roll_l", -9, 0.0, "peak", B, "the metallic counter 0 -> 50 (quadOut, 17.05-17.96) while the ticks light white -> RED", x=960, tv=w(17.05),
    rate=1.1)
cue(w(17.96), "ping_land_a", -8, 0.0, "onset", B, "50 lands: apex notch flashes RED + RED '+' + ▲▲▲ pop", x=960,
    layers=[L(w(17.98), "pop_b", -12, px(800), repeat=[3, 0.07], rate_step=0.06)])
cue(w(18.18), "tick_a", -19, px(1160), "onset", B, "the ticks unlight right to left in 0.12 s, then everything fades", x=960,
    repeat=[6, 0.02], rate_step=-0.02, pan_to=px(760))

# ------------------------------------------------------------------ E · L5 two conditions (VO 18.52-22.60)
B = "E"
cue(w(18.92), "slide_card_a", -7, px(1600), "onset", B, "RIGHT card «الشرط الأول» enters; its mini gauge sweeps red to the apex (19.10-19.45)", x=1600,
    layers=[L(w(19.10), "scan_draw_a", -15, px(1650), dur=0.4)])
cue(w(19.32), "slide_card_b", -7, px(320), "onset", B, "LEFT card «الشرط الثاني» enters", x=320)
cue(w(19.45), "tick_a", -8, px(1780), "onset", B, "the right card's chamfer becomes a RED CHECK TAB | + three coins drop (19.42, 19.57, 19.72)", x=1780,
    layers=[L(w(19.42), "ping_land_b", -15, px(250), repeat=[3, 0.15], rate_step=0.06, dur=0.5)])
cue(w(19.90), "counter_roll_s", -10, px(320), "peak", B, "'$ 500' counts 0 -> 500 (19.37-19.90)", x=320, tv=w(19.37), rate=0.85)
cue(w(19.90), "ping_land_a", -11, px(320), "onset", B, "'$ 500' lands", x=320)
cue(w(20.30), "reveal_air_a", -13, px(320), "onset", B, "«في حساب التداول» rises", x=320)
cue(w(21.40), "tick_a", -8, px(500), "onset", B, "the left card's CHECK TAB ticks", x=500, rate=1.04)
cue(w(22.20), "whoosh_soft_c", -15, 0.0, "peak", B, "exit, right card first (22.15 / 22.22)", x=960, tv=w(22.15))

# ------------------------------------------------------------------ F1 · L3 the allocation account (VO 22.60-27.00)
B = "F1"
cue(w(23.10), "reveal_air_b", -14, px(500), "onset", B, "the TRADING card fades in at .7 (live mini chart)", x=500)
cue(w(23.66), "reveal_air_c", -12, px(400), "onset", B, "the axi wordmark rises 12 px", x=400)
cue(w(23.98), "slide_card_b", -7, px(450), "onset", B, "a NEW card slides out from behind the trading card", x=450)
cue(w(24.30), "pop_c", -10, px(700), "onset", B, "its chamfer becomes a RED NEW TAB with a white '+'", x=700)
cue(w(24.55), "scan_draw_a", -12, px(300), "onset", B, "the VAULT draws on (title still a skeleton, shimmering)", x=300)
cue(w(25.55), "reveal_air_a", -12, px(500), "onset", B, "the skeleton dissolves and «حساب التخصيص» reveals right to left | 'Allocation Account' (25.85)", x=500,
    layers=[L(w(25.55), "shimmer_sheen", -15, px(500)), L(w(25.85), "reveal_air_c", -15, px(500))])
cue(w(26.14), "lock_padlock", -10, px(300), "onset", B, "the vault spokes turn 90° (unlocked) + the red hub pulses", x=300, rate=0.92)

# ------------------------------------------------------------------ F2 · VC HOME -> WIDE both accounts (VO 27.00-31.92)
B = "F2"
cue(w(27.08), "cam_pull", -7, 0.0, "onset", B, "camera pull HOME -> WIDE (0.62 s expo)", x=960)
cue(w(28.04), "slide_card_b", -7, px(400), "onset", B, "LEFT allocation card enters (VAULT, title, «مخصّص للمبلغ التمويلي») + its red floor spill (28.24)", x=400,
    layers=[L(w(28.24), "sonar_red", -16, px(400))])
cue(w(28.45), "slide_card_a", -8, px(1550), "onset", B, "RIGHT trading card enters at .8 + white floor spill (28.70)", x=1550)
cue(w(28.60), "tick_b", -16, px(1450), "onset", B, "its mini chart of 10 candles builds in corner triangles (28.60-29.10)", x=1550, repeat=[10, 0.05], rate_step=0.015,
    pan_to=px(1700))
cue(w(28.95), "scan_draw_a", -11, px(500), "onset", B, "an empty TAG-shaped funding track draws in on the allocation card", x=400, pan_to=px(260))
cue(w(29.70), "reveal_air_c", -12, px(400), "onset", B, "the axi wordmark rises above the allocation card | the trading chart goes live (29.70)", x=400)
cue(w(30.02), "tick_c", -17, px(400), "onset", B, "FUNDING POUR: 36 red ◢ fall from the wordmark into the card (0.03 s stagger) as the track fills and the spokes turn", x=400,
    repeat=[18, 0.06], rate_step=0.01, layers=[L(w(30.08), "scan_draw_b", -12, px(520), pan_to=px(260))])
cue(w(30.30), "tick_b", -17, px(1600), "onset", B, "the live trading chart prints a candle every 0.6 s", x=1600, repeat=[2, 0.6], rate_step=0.04)
cue(w(31.00), "scan_draw_a", -12, px(1300), "onset", B, "a dotted link draws right to left above his head | sheen on the wordmark (31.06)", x=960, pan_to=px(650),
    layers=[L(w(31.06), "shimmer_sheen", -13, px(400))])
cue(w(31.62), "whoosh_soft_c", -15, 0.0, "peak", B, "exit (31.55-31.84)", x=960, tv=w(31.55))

# ------------------------------------------------------------------ G · L2 «مبروك!» (VO 31.92-33.40)
B = "G"
cue(w(32.00), "chime_glass", -5, px(450), "onset", B, "«مبروك!» lands + its flag unfurls + 16 brand particles burst", x=450,
    layers=[L(w(32.02), "flag_flutter", -14, px(622))])
cue(w(32.62), "pop_b", -9, px(450), "onset", B, "a DARK stage pill appears: red circle '01' + «المرحلة الأولى»", x=450, layers=[L(w(32.62), "slide_card_a", -14, px(450))])

# ------------------------------------------------------------------ H1 · VC WIDE Seed (VO 33.40-36.84)
B = "H1"
cue(w(33.40), "thud_soft_a", -11, 0.0, "onset", B, "hard cut to WIDE", x=960)
cue(w(33.80), "sonar_red", -9, 0.0, "onset", B, "the STAGE-1 floor PAD: red rim traces by dash progress, inner white, 6 ◢ blink", x=960, y=950,
    layers=[L(w(33.80), "scan_draw_a", -16, 0.0, dur=0.45)])
cue(w(34.00), "slide_card_a", -8, 0.0, "onset", B, "the SEED TAG plate enters centre-top (RTL clip + 20 px rise): '01' «المرحلة الأولى» 'Seed'", x=960, y=200)
cue(w(34.25), "scan_draw_a", -12, px(1060), "onset", B, "the SPROUT draws (seed drops, stem grows, leaves open, red leaf last)", x=1060, rate=1.15)
cue(w(36.05), "shimmer_sheen", -11, 0.0, "onset", B, "sheen across 'Seed' + one red flash of the tag rim", x=960)
cue(w(36.52), "whoosh_soft_b", -10, 0.0, "onset", B, "the tag compresses into a chip and slides up to the top centre (36.52-36.90)", x=960)

# ------------------------------------------------------------------ H2 · '$ 5,000' (VO 36.84-40.02). The landing (41.62),
# the pool, sheen, exit and the pull (43.02) fall in the protected window 41.55-43.25: silent.
B = "H2"
cue(w(36.95), "reveal_air_a", -12, px(1100), "onset", B, "the two-tone headline reveals per word from the right", x=1100)
cue(w(37.65), "counter_roll_l", -11, 0.0, "onset", B, "'$ 5,000' starts counting (37.65; it lands at 41.62, inside the protected window: the roll is cut at 41.40)", x=960,
    dur=0.75, fade=0.12)
cue(w(37.75), "pop_c", -12, px(700), "onset", B, "▲▲▲ pop to the left of the '$' and wave", x=700, repeat=[3, 0.07], rate_step=0.06)

# ------------------------------------------------------------------ I · VC EW the staircase (VO 40.02-44.70)
B = "I"
cue(w(41.20), "scan_draw_a", -11, px(1580), "onset", B, "the ground line runs from the pad to x 1840 (41.20-41.50) | the stair line climbs (41.35-41.95)", x=1700,
    pan_to=px(1840), layers=[L(w(41.35), "scan_draw_b", -11, px(1580), pan_to=px(340))])
cue(w(41.45), "pop_a", -13, px(1655), "onset", B, "six TAG stage cards pop onto their landings in DIM (0.08 s stagger)", x=1000, repeat=[6, 0.08], rate_step=0.025,
    pan_to=px(455))
cue(w(41.80), "reveal_air_c", -12, px(1750), "onset", B, "READOUT: metallic '6' + «مراحل»; the card outlines flash red in sequence", x=1750,
    layers=[L(w(41.80), "tick_c", -17, px(1655), repeat=[6, 0.08], rate_step=0.03, pan_to=px(455))])
cue(w(42.55), "sonar_red", -8, 0.0, "onset", B, "S1 LIGHTS (panel, red rim, sprout, '$ 5,000') + the flag MARKER drops onto S1 + STAGE PULSE | readout swaps (42.60)", x=1655,
    layers=[L(w(42.55), "ping_land_b", -11, px(1655)), L(w(42.55), "flag_drop", -11, px(1655)), L(w(42.62), "reveal_air_a", -14, px(1750))])
cue(w(44.15), "shimmer_sheen", -11, px(1655), "onset", B, "S1 rim flash + sheen on 'Seed'", x=1655)
cue(w(44.36), "whoosh_soft_c", -15, px(1400), "peak", B, "the readout and the marker fade (44.28-44.60)", x=1500, tv=w(44.28))

# ------------------------------------------------------------------ J · L1 stage 02 (VO 44.70-48.00)
B = "J"
cue(w(45.25), "slide_card_a", -7, px(1550), "onset", B, "the CARD enters: «المرحلة الثانية», '02', a mini stair with the flag on step 1", x=1550)
cue(w(45.70), "scan_draw_a", -12, px(1710), "onset", B, "the DOME draws, then the sapling grows inside (red leaf last)", x=1710)
cue(w(46.10), "flag_drop", -10, px(1400), "onset", B, "the mini-stair flag hops to step 2", x=1400)
cue(w(46.88), "reveal_air_c", -12, px(1550), "onset", B, "'Incubation' mask-reveals left to right", x=1550)
cue(w(47.47), "counter_roll_s", -11, px(1550), "peak", B, "«تمويل حتى» rises and '$ 20,000' counts (47.10-47.47)", x=1550, tv=w(47.10), rate=1.2,
    layers=[L(w(47.04), "reveal_air_a", -15, px(1600))])
cue(w(47.47), "ping_land_b", -12, px(1550), "onset", B, "'$ 20,000' lands", x=1550)

# ------------------------------------------------------------------ K · L5 stage 03 (VO 48.00-50.36)
B = "K"
cue(w(48.40), "slide_card_b", -7, px(370), "onset", B, "the CARD enters on the left: «المرحلة الثالثة», '03', mini stair (flag on step 2)", x=370)
cue(w(48.75), "pop_c", -10, px(472), "onset", B, "the CHEVRONS ignite bottom to top (back 1.4), then idle with speed dashes", x=472, repeat=[3, 0.08], rate_step=0.06)
cue(w(48.95), "flag_drop", -10, px(200), "onset", B, "the mini-stair flag hops to step 3", x=200)
cue(w(49.30), "reveal_air_c", -12, px(370), "onset", B, "'Acceleration' reveals", x=370)
cue(w(49.93), "counter_roll_s", -11, px(370), "peak", B, "«تمويل حتى» and '$ 100,000' count up (49.50-49.93)", x=370, tv=w(49.50), rate=1.05)
cue(w(49.93), "ping_land_b", -12, px(370), "onset", B, "'$ 100,000' lands", x=370, rate=1.06)

# ------------------------------------------------------------------ L · VC EW Pro, Pro 500 (VO 50.36-56.30)
B = "L"
cue(w(50.36), "thud_soft_a", -11, 0.0, "onset", B, "hard cut to the extreme wide: the staircase stands (S1-S2 DONE, S3 LIT), pad on", x=960)
cue(w(50.76), "flag_drop", -9, px(1273), "onset", B, "the flag MARKER drops onto S3", x=1273)
cue(w(51.30), "tick_c", -12, px(935), "onset", B, "S4 pre-highlights + the readout label «المرحلة الرابعة» rises", x=935,
    layers=[L(w(51.30), "reveal_air_a", -14, px(1750))])
cue(w(52.10), "whoosh_soft_c", -10, px(1100), "onset", B, "the marker slides S3 -> S4 (0.45 s expo); S3 turns DONE", x=1100, layers=[L(w(52.22), "tick_a", -12, px(1175))])
cue(w(52.26), "sonar_red", -8, 0.0, "onset", B, "S4 Pro LIGHTS (rising bars, '$ 200,000') + STAGE PULSE + readout adds 'Pro' and counts '$ 200,000' (0.6 s)", x=935,
    layers=[L(w(52.26), "ping_land_b", -11, px(935), rate=1.06), L(w(52.89), "counter_roll_s", -12, px(1750), sync="peak", rate=0.75)])
cue(w(53.75), "whoosh_soft_c", -14, px(1700), "peak", B, "the readout block lifts and fades", x=1700, tv=w(53.75))
cue(w(54.16), "tick_c", -12, px(695), "onset", B, "S5 pre-highlights + the label «المرحلة الخامسة» rises", x=695, rate=1.05,
    layers=[L(w(54.16), "reveal_air_b", -14, px(1750))])
cue(w(54.90), "whoosh_soft_c", -10, px(860), "onset", B, "the marker slides S4 -> S5; S4 turns DONE", x=860, rate=1.04, layers=[L(w(55.02), "tick_a", -12, px(935))])
cue(w(55.05), "sonar_red", -8, 0.0, "onset", B, "S5 Pro 500 LIGHTS (red '500' TAG) + STAGE PULSE + readout 'Pro 500' '$ 500,000' (0.5 s) + ▲▲▲", x=695,
    layers=[L(w(55.05), "ping_land_b", -11, px(695), rate=1.12), L(w(55.60), "counter_roll_s", -12, px(1750), sync="peak", rate=0.9), L(w(55.20), "pop_c", -14, px(1650), repeat=[3, 0.07], rate_step=0.06),
            L(w(55.44), "shimmer_sheen", -14, px(695))])
cue(w(55.98), "whoosh_soft_c", -15, px(1500), "peak", B, "the readout and the marker go out", x=1500, tv=w(55.92))

# ------------------------------------------------------------------ M · L2 summit teaser (VO 56.30-58.40)
B = "M"
cue(w(56.70), "scan_draw_b", -11, px(200), "onset", B, "the SUMMIT symbol draws (5 px strokes) + «المرحلة الأخيرة» reveals right to left", x=300,
    layers=[L(w(56.72), "reveal_air_a", -14, px(450))])
cue(w(57.10), "flag_flutter", -11, px(200), "onset", B, "the red flag climbs the summit pole (e4) | '06' lands", x=200, layers=[L(w(57.10), "pop_b", -12, px(600))])
cue(w(57.50), "flag_drop", -10, px(200), "onset", B, "the flag plants with a 4 px settle", x=200, dur=0.5, tv=w(57.45))
cue(w(57.55), "shimmer_sheen", -12, px(600), "onset", B, "sheen on the metallic '06'", x=600)

# ------------------------------------------------------------------ M2 · VC EW the summit (VO 58.40-60.30)
B = "M2"
cue(w(58.40), "thud_soft_a", -12, 0.0, "onset", B, "hard cut to the extreme wide", x=960)
cue(w(58.80), "flag_drop", -10, px(793), "onset", B, "the marker appears on S5 + S6 pre-highlights", x=793, layers=[L(w(58.80), "tick_c", -13, px(455))])
cue(w(59.05), "whoosh_soft_c", -10, px(620), "onset", B, "the marker climbs to S6; S5 turns DONE", x=620, rate=1.08)
cue(w(59.22), "ping_land_a", -9, px(455), "onset", B, "S6 LIGHTS: the SUMMIT symbol (its own flag climbs) + '$ 1,000,000'; readout «المرحلة الأخيرة» 'Pro M'", x=455,
    layers=[L(w(59.22), "reveal_air_a", -14, px(1750))])
cue(w(59.45), "scan_draw_b", -8, px(1300), "onset", B, "a red COMET runs the whole line from the pad to S6 in 0.35 s; each rim flashes", x=900, pan_to=px(455), pan_dur=0.35,
    rate=1.6, layers=[L(w(59.45), "tick_c", -14, px(1655), repeat=[6, 0.055], rate_step=0.035, pan_to=px(455))])
cue(w(59.80), "impact_deep", -7, 0.0, "onset", B, "the comet lands on S6: a big floor pulse (0.3 -> 4 m)", x=960, layers=[L(w(59.80), "sonar_white", -11, 0.0)])
cue(w(59.94), "whoosh_soft_b", -12, px(800), "onset", B, "the cards fold into their landings, the line retracts to the pad, the pad goes off", x=1000)

# ------------------------------------------------------------------ N1 · L5 funding ladder (VO 60.30-64.62)
B = "N1"
cue(w(60.75), "reveal_air_a", -11, px(1600), "onset", B, "the RIGHT header lands with its flag", x=1600, layers=[L(w(60.77), "flag_flutter", -15, px(1780))])
cue(w(60.95), "pop_a", -12, px(1600), "onset", B, "six TAG rows rise 24 px, Seed first (0.09 s stagger): symbol, name, metallic cap", x=1600,
    repeat=[6, 0.09], rate_step=0.03)
cue(w(61.45), "tick_a", -12, px(1600), "onset", B, "the Pro M row gets a red rim", x=1600, rate=1.1)
cue(w(62.32), "reveal_air_c", -12, px(330), "onset", B, "LEFT: the axi wordmark rises", x=330)
cue(w(62.70), "tick_c", -17, px(330), "onset", B, "FUNDING POUR: 30 red ◢ fall from the wordmark into the VAULT", x=330, repeat=[12, 0.058], rate_step=0.01)
cue(w(63.12), "lock_padlock", -11, px(325), "onset", B, "the vault spokes turn 120° and the hub pulses (63.36) | the DARK pill «تمويلك من Axi» appears (63.14)", x=325, rate=0.9,
    layers=[L(w(63.14), "slide_card_b", -12, px(500)), L(w(63.36), "pop_a", -13, px(325))])
cue(w(63.66), "shimmer_sheen", -12, px(1600), "onset", B, "the six caps sheen bottom to top", x=1600)
cue(w(63.70), "click_ui_b", -13, px(700), "onset", B, "the arrow nudges 6 px (63.70, 64.00)", x=700, repeat=[2, 0.30])

# ------------------------------------------------------------------ N2 · B-ROLL 2 profit share (VO 64.62-68.10)
B = "N2"
cue(w(64.62), "whoosh_hard_b", -5, 0.0, "peak", B, "hard cut into B-roll 2 + the headline lands with the scene's flag (64.66)", x=960,
    layers=[L(w(64.62), "thud_soft_b", -12, 0.0), L(w(64.66), "reveal_air_a", -13, px(1300)), L(w(64.68), "flag_flutter", -15, px(1700))])
cue(w(64.75), "tick_b", -13, px(900), "onset", B, "the live chart prints and climbs: a candle every 0.17 s (64.75-65.77)", x=900, repeat=[7, 0.17], rate_step=0.025,
    pan_to=px(1300))
cue(w(65.40), "reveal_air_c", -15, px(1100), "onset", B, "the profit zone label appears over the funded-capital line", x=1100)
cue(w(66.24), "whoosh_long_rise", -12, px(1000), "peak", B, "the profit ZONE detaches with a RED outline and lifts (66.24)", x=1000, tv=w(66.24), dur=1.3)
cue(w(66.46), "slide_card_a", -8, px(1500), "onset", B, "the right panel «حصّتك من الأرباح» reveals right to left", x=1500)
cue(w(66.62), "glitch_swipe_a", -9, px(1000), "onset", B, "the zone FLIES into the panel and lands as the split-bar track", x=1200, pan_to=px(1500))
cue(w(67.02), "scan_draw_a", -10, px(1300), "onset", B, "the bar fills RED to «حتى» 80% «لك» | the footnote fades in (67.00)", x=1500, pan_to=px(1600),
    layers=[L(w(67.02), "counter_roll_s", -14, px(1500))])
cue(w(67.18), "reveal_air_b", -14, px(1500), "onset", B, "the labels «لك» / 'Axi' land", x=1500)
cue(w(67.42), "pop_b", -9, px(1500), "onset", B, "the RED pill «سحب الأرباح» appears", x=1500)
cue(w(67.94), "click_ui_a", -7, px(1500), "onset", B, "the pill is PRESSED", x=1500)

# ------------------------------------------------------------------ O · VC HOME -> WIDE two accounts (VO 68.10-77.96)
B = "O"
cue(w(68.10), "whoosh_soft_c", -14, 0.0, "peak", B, "hard cut out of B-roll 2 to HOME", x=960)
cue(w(69.22), "cam_pull", -7, 0.0, "onset", B, "camera pull HOME -> WIDE on «لنبسّطها» (0.62 s expo)", x=960)
cue(w(70.12), "slide_card_a", -7, px(1560), "onset", B, "the RIGHT trading card enters", x=1560)
cue(w(70.55), "tick_b", -16, px(1450), "onset", B, "its mini chart of 12 candles builds in corner triangles (70.55-70.93)", x=1560, repeat=[12, 0.0345], rate_step=0.012,
    pan_to=px(1700))
cue(w(71.00), "pop_c", -10, px(1560), "onset", B, "BUY marker: a white ring on the candle + a red ▲ below", x=1560, layers=[L(w(71.00), "tick_a", -13, px(1560))])
cue(w(71.42), "tick_b", -16, px(1650), "onset", B, "the chart goes live: a new candle every 0.6 s", x=1650, repeat=[2, 0.6], rate_step=0.04)
cue(w(71.62), "pop_c", -10, px(1600), "onset", B, "BUY marker 2", x=1600, rate=1.06, layers=[L(w(71.62), "tick_a", -13, px(1600))])
cue(w(72.85), "pop_b", -8, 0.0, "onset", B, "a metallic '+' pops above Rabee, between the cards (scale .8 -> 1, back)", x=960, y=250,
    layers=[L(w(72.85), "thud_soft_b", -13, 0.0)])
cue(w(73.48), "slide_card_b", -7, px(380), "onset", B, "the LEFT allocation card enters (VAULT, title, sub «مموَّل»)", x=380)
cue(w(74.55), "counter_roll_s", -10, px(380), "onset", B, "'$ 5,000' counts in metallic (74.55-75.10) | the 'Seed' chip (74.70)", x=380, rate=0.82,
    layers=[L(w(74.70), "pop_a", -13, px(250))])
cue(w(75.10), "ping_land_b", -11, px(380), "onset", B, "'$ 5,000' lands; its sheen passes (75.15-75.60)", x=380, layers=[L(w(75.15), "shimmer_sheen", -15, px(380))])
cue(w(75.66), "reveal_air_c", -12, px(380), "onset", B, "the axi wordmark rises above the allocation card", x=380)
cue(w(76.66), "reveal_air_b", -15, px(380), "onset", B, "a short ◢ pour (16 marks) starts falling from the wordmark into the card", x=380)
cue(w(76.94), "tick_c", -16, px(380), "onset", B, "the ◢ marks land in the card (76.94-77.24); the vault hub pulses (76.98)", x=380, repeat=[8, 0.043],
    rate_step=0.012, layers=[L(w(77.00), "pop_a", -13, px(244))])
cue(w(77.56), "shimmer_sheen", -11, px(380), "onset", B, "«Axi»: the wordmark pops 4 % + a red underline wipes in + sheen", x=380, layers=[L(w(77.56), "pop_c", -13, px(380))])

# ------------------------------------------------------------------ P · L2 note tag (VO 78.04-78.92)
B = "P"
cue(w(78.12), "stamp", -9, px(330), "onset", B, "a RED TAG '!' snaps in (scaleX from its right edge) | «ملاحظة مهمّة» reveals (78.18)", x=330,
    layers=[L(w(78.18), "reveal_air_a", -12, px(450))])
cue(w(78.44), "tick_b", -11, px(300), "onset", B, "the tag rocks ±4° twice", x=300, repeat=[2, 0.10], rate_step=0.05)

# ------------------------------------------------------------------ Q · L3 locked but linked (VO 79.02-84.60)
B = "Q"
cue(w(79.40), "slide_card_b", -7, px(450), "onset", B, "the ALLOCATION card enters with a greyed DARK pill «تداول»", x=450)
cue(w(80.12), "reveal_air_c", -16, px(600), "onset", B, "the cursor glides to the pill", x=600)
cue(w(80.42), "click_ui_a", -6, px(450), "onset", B, "CLICK on the greyed pill | + the pill shakes ±8 px three times: no (80.46-80.76)", x=450,
    layers=[L(w(80.46), "tick_b", -14, px(450), repeat=[3, 0.10], rate=0.8, rate_step=-0.03)])
cue(w(80.82), "flag_drop", -11, px(300), "onset", B, "the PADLOCK drops onto the pill's left end", x=300, rate=0.85, dur=0.25)
cue(w(81.04), "lock_padlock", -4, px(300), "onset", B, "the shackle SNAPS down + 2-frame shake + red ring", x=300)
cue(w(81.46), "scan_draw_a", -10, px(450), "onset", B, "a red 3 px SLASH crosses the pill + «لا تداول مباشر» appears", x=450, rate=1.3, dur=0.35,
    layers=[L(w(81.50), "reveal_air_a", -14, px(450))])
cue(w(82.74), "slide_card_a", -8, px(450), "onset", B, "the TRADING card rises in below", x=450)
cue(w(83.10), "scan_draw_a", -11, px(450), "onset", B, "a dotted vertical link draws bottom to top", x=450, rate=1.1)
cue(w(83.40), "lock_padlock", -10, px(450), "onset", B, "the CHAIN symbol snaps together on an INK disc (two links slide in) + «ربط تلقائي»", x=450, rate=1.2,
    layers=[L(w(83.42), "reveal_air_c", -15, px(500))])
cue(w(83.84), "whoosh_soft_c", -13, px(450), "onset", B, "red pulse 1 travels up the link (0.25 s); the card rim flashes red on arrival", x=450, rate=1.2,
    layers=[L(w(84.09), "pop_c", -12, px(450))])
cue(w(84.06), "whoosh_soft_c", -14, px(450), "onset", B, "red pulse 2 travels up the link; the rim flashes again", x=450, rate=1.28,
    layers=[L(w(84.31), "pop_c", -12, px(450), rate=1.06)])

# ------------------------------------------------------------------ R · DROP 2 WIDE copy x10 (VO 84.70-90.96)
B = "R"
cue(87.68, "boom_drop", -8, 0.0, "onset", B, "DROP 2 smash cut: floor RIPPLE (layers the score's drop)", x=960, layers=[L(87.68, "sonar_white", -11, 0.0)])
cue(w(85.10), "slide_card_a", -8, px(1560), "onset", B, "both cards enter: trading (right) first, then allocation (85.20)", x=1560,
    layers=[L(w(85.20), "slide_card_b", -8, px(360))])
cue(w(85.55), "scan_draw_b", -10, px(1400), "onset", B, "a red dotted ARC draws right to left over Rabee's head", x=960, pan_to=px(520), pan_dur=0.5)
cue(w(86.00), "stamp", -9, 0.0, "onset", B, "the apex NODE (TAG plate) enters with the COPY symbol and «نسخ تلقائي»", x=960, y=200)
for i, (a, s, d, nm) in enumerate([(86.67, 86.77, 0.60, "T1 «شراء 0.01» -> «شراء 0.10»"), (87.28, 87.38, 0.60, "T2 «بيع 0.02» -> «بيع 0.20»"),
                                   (87.95, 88.05, 0.60, "T3 «شراء 0.01» -> «شراء 0.10»"), (89.90, 90.00, 0.45, "T4 «شراء 0.03» -> «شراء 0.30»")]):
    rr = [1.0, 1.04, 0.97, 1.08][i]
    cue(w(a), "pop_a", -12, px(1560), "onset", B, "%s: the chip appears in the trading list" % nm, x=1560, rate=rr)
    cue(w(s), "glitch_swipe_b", -10, px(1400), "onset", B, "%s: its ghost rides the arc behind a red comet" % nm, x=1200, rate=rr, pan_to=px(520), pan_dur=d)
    cue(w(s + d / 2), "ping_land_b", -10, 0.0, "onset", B, "%s: at the apex the node flashes, the lot flips x10, the ghost scales 1 -> 1.25" % nm, x=960, y=200, rate=rr * 1.06)
    cue(w(s + d), "pop_b", -10, px(360), "onset", B, "%s: lands in the allocation list (red edge) + a SPILL pulse under the card" % nm, x=360, rate=rr,
        layers=[L(w(s + d), "tick_a", -14, px(360), rate=rr)])
cue(w(88.62), "impact_deep", -9, 0.0, "onset", B, "the node's copy icon MORPHS into a metallic 'x10'; the label crossfades to «معامل الضرب»", x=960, y=200,
    layers=[L(w(88.70), "shimmer_sheen", -13, 0.0)])
cue(w(89.40), "reveal_air_c", -13, 0.0, "onset", B, "the caption «مثال: مرحلة Seed» appears", x=960)

# ------------------------------------------------------------------ S · L2 bookmark (VO 91.04-95.86)
B = "S"
cue(w(91.32), "slide_card_a", -8, px(400), "onset", B, "the TAG plate enters holding «معامل الضرب» and a metallic 'x10'", x=400)
cue(w(91.44), "flag_drop", -9, px(350), "onset", B, "a RED FLAG bookmark (h 56) drops from above and clips onto the tag's top edge", x=350, tv=w(91.40))
cue(w(92.38), "shimmer_sheen", -11, px(450), "onset", B, "one sheen on 'x10'", x=450)
cue(w(94.64), "pop_b", -9, px(400), "onset", B, "a DARK pill with a red circle ← appears under the tag", x=400)

# ------------------------------------------------------------------ T · L1 rule sheet (VO 95.95-102.08)
B = "T"
cue(w(96.40), "slide_card_a", -7, px(1560), "onset", B, "the CARD enters with its two-tone header", x=1560)
cue(w(96.80), "tick_c", -12, px(1750), "onset", B, "six stage symbols light 01 -> 06 (0.15 s each), then settle white", x=1560, repeat=[6, 0.15], rate_step=0.035,
    pan_to=px(1380))
cue(w(98.60), "slide_card_b", -12, px(1600), "onset", B, "three rule rows slide in 30 px from the right (checkbox + abstract bar)", x=1560, repeat=[3, 0.40], rate_step=0.02)
cue(w(98.76), "tick_a", -9, px(1700), "onset", B, "the three checks tick red (98.76, 99.16, 99.56)", x=1700, repeat=[3, 0.40], rate_step=0.04, tv=w(98.70))
cue(w(101.40), "thud_soft_b", -9, px(1560), "onset", B, "row 4 arrives in focus: RED checkbox '!', SHIELD, «حدّ الانعكاس», red bar; rows 1-3 dim", x=1560,
    layers=[L(w(101.40), "stamp", -13, px(1700))])

# ------------------------------------------------------------------ U · VC WIDE limit ring, 10% (VO 102.15-105.58)
B = "U"
cue(105.16, "impact_deep", -8, 0.0, "onset", B, "RE-DROP: hard cut to WIDE (the score's re-lift)", x=960)
cue(w(102.55), "scan_draw_b", -10, 0.0, "onset", B, "the dashed red LIMIT RING draws clockwise on the floor around the stool + soft pool inside", x=960, y=900,
    layers=[L(w(102.55), "sub_drop", -16, 0.0), L(w(102.60), "reveal_air_a", -13, px(1000))])
cue(w(102.75), "whoosh_soft_c", -13, px(500), "onset", B, "the LEFT chart's corner triangles fly out + dotted sides", x=500)
cue(w(103.00), "scan_draw_a", -11, px(300), "onset", B, "a dashed red limit line draws, labelled '−10%'", x=450, pan_to=px(700))
cue(w(102.87), "tick_b", -19, px(250), "onset", B, "the chart's first six candles print (0.05 s stagger)", x=400, repeat=[6, 0.05], rate_step=0.01, pan_to=px(450))
cue(w(103.20), "tick_b", -12, px(300), "onset", B, "five candles step DOWN, mostly red, toward the line (the last wick stops 8 px above it)", x=450,
    repeat=[5, 0.15], rate=0.95, rate_step=-0.035, pan_to=px(650))
cue(w(104.05), "thud_soft_a", -11, px(500), "onset", B, "the limit line pulses 3 times (heartbeat, 0.15 s each)", x=500, repeat_times=[0.0, 0.15, 0.30], rate=0.85)
cue(w(104.30), "tick_c", -11, px(700), "onset", B, "a white RECOVERY candle prints: the limit is never reached", x=700, rate=1.1)
cue(w(104.64), "thud_soft_b", -7, px(1500), "onset", B, "metallic '10%' LANDS in the right third (scale 1.04 -> 1) | footnote fades in (104.90)", x=1500,
    layers=[L(w(104.64), "ping_land_b", -12, px(1500), rate=0.89), L(w(104.90), "reveal_air_b", -15, px(1500))])
cue(w(104.98), "shimmer_sheen", -12, px(1500), "onset", B, "sheen across '10%'", x=1500)
cue(w(105.29), "whoosh_soft_c", -14, 0.0, "peak", B, "the ring, its pool and the headline exit (105.20-105.50)", x=960, tv=w(105.20))

# ------------------------------------------------------------------ V · push to HOME, what's next (VO 105.58-110.88)
B = "V"
cue(w(105.58), "cam_push", -7, 0.0, "onset", B, "camera push WIDE -> HOME (S-curve 0.7 s)", x=960)
cue(w(106.38), "whoosh_soft_c", -15, px(450), "peak", B, "U's chart exits", x=450, tv=w(106.30))
cue(w(107.05), "reveal_air_a", -11, px(500), "onset", B, "LEFT: the two-tone headline lands with its flag", x=500, layers=[L(w(107.07), "flag_flutter", -15, px(700))])
cue(w(107.30), "pop_a", -13, px(648), "onset", B, "the six stage symbols appear in a row and light once in sequence (0.05 s stagger)", x=500, repeat=[6, 0.05],
    rate_step=0.03, pan_to=px(352))
cue(w(107.70), "whoosh_soft_c", -15, px(1500), "onset", B, "U's '10%' and footnote exit", x=1500)
cue(w(108.30), "slide_card_a", -10, px(1485), "onset", B, "RIGHT: the next-video deck fans in (three cards, 0.08 s stagger)", x=1485, repeat=[3, 0.08], rate_step=0.04)
cue(w(108.70), "pop_b", -9, px(1470), "onset", B, "the RED pill appears with a white circle and a red ←", x=1470)
cue(w(109.42), "click_ui_b", -12, px(1300), "onset", B, "the arrow nudges left (109.42, 110.04)", x=1300, repeat_times=[0.0, 0.62])
cue(w(109.55), "slide_card_b", -11, px(1485), "onset", B, "the front card slides 40 px left and tilts −3°, revealing '(3)' behind", x=1485)
cue(113.62, "wipe_end", -5, 0.0, "peak", B, "END WIPE: a #000 chamfer panel with a red '/' edge sweeps in from the right (113.36-113.88)", x=960, tv=113.36)

# ------------------------------------------------------------------ END CARD (output 113.88-120.00)
B = "END"
cue(113.88, "boom_end", -7, 0.0, "onset", B, "end card on the score's ending hit (layers it); the ◢ rows reveal (114.00-114.40)", x=960,
    layers=[L(114.00, "reveal_air_b", -14, 0.0)])
cue(114.25, "shimmer_logo", -7, 0.0, "onset", B, "the official logo builds (axi rises 114.25-114.67)", x=960, y=350)
cue(114.50, "whoosh_soft_b", -14, 0.08, "onset", B, "the SELECT tag wipes in behind the red edge (114.50-114.97)", x=1050, y=350)
cue(115.10, "pop_b", -8, 0.0, "onset", B, "the RED pill «انضم إلى آكسي سيليكت» scales in (.92 -> 1)", x=960, y=570, layers=[L(115.10, "slide_card_a", -14, 0.0)])
cue(115.50, "reveal_air_c", -14, 0.0, "onset", B, "the footer fades in while its tracking tightens", x=960, y=720)
cue(115.80, "reveal_air_a", -16, 0.0, "onset", B, "the T&C fades in", x=960, y=968)
cue(116.70, "shimmer_sheen", -11, 0.0, "onset", B, "one white sheen across the RED pill", x=960, y=570)

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "..", "cues_ep1.json")
    import json
    close = finish(out, os.path.join(HERE, "..", "palette", "palette.json"))
    C = json.load(open(out))
    # protected windows: no cue may START inside one (tails are checked by the renderer)
    for c in C:
        for l in [c] + c.get("layers", []):
            for a, b in PROTECT:
                assert not (a <= l["t"] < b), ("cue in a protected window", l["t"], l["file"])
    print(len(C), "cues ->", out)
    for c in close:
        print("merged:", c)
