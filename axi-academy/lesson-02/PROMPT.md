# Lesson 02 — لماذا تتداول الفوركس؟ · 4-stage directing breakdown

This adapts the reference `Prompt_Motion_3.mp4` (the Lism CSS release film) to Axi Academy lesson 2, and to the Axi Iraq brand.

The reference is one uninterrupted camera move on light paper. A small section label sits top-left, and one shape keeps turning into the next thing:

> logo → squares → spiral → bars → type → cards → 3D stack → UI → template wall → logo

The narration is `lesson_2_full_ep_new.wav` (100.48 s). In video time the voice runs from 6.50 s to 96.63 s, because the file opens with its own ~4.4 s intro sting.

- **Timecodes:** all times are video time, `HH:MM:SS.mmm` at 60 fps.
- **Voice-over:** it is **not** in the master. Place it at **00:00:02.000**.
- **Master:** `Lesson02_Why_Trade_Forex.mp4` — 1920×1080, 60 fps, 102.78 s, music + SFX only.

```xml
<visual_architecture>
REFERENCE, DECODED (Prompt_Motion_3.mp4)
- One virtual camera, one take. Every section is born out of the previous one, in this chain:
    logo → square → Fibonacci squares/spiral → bar chart → «Aa» type scale → leading bands → black bars
    → orange title → card grids → props tags → breakpoint slider → cards merge → isometric stack
    → black title → UI kit → FAQ → zoom-out template wall → black title → chat/terminal/pricing
    → collapse to logo + URL.
- Look: light-grey paper, black ink, one saturated accent per section, a tiny section label top-left
  («01 Concept»), huge flat type, hairline UI.
- Motion: long eased moves (never linear), heavy motion blur on fast moves, spring overshoot on landings,
  morphs instead of cuts.

AXI TRANSLATION
- Canvas: 1920×1080, 60 fps. Margins: 77 px left/right, 50 px top. Bottom UI band: y 990–1030.
- Paper (day): vertical gradient #FBFBFB→#EEF0F1. Night world: #17181B→#0B0D0D. Vertical gradients only.
- Colours:
  - ink #090A0D (white at night); slate #607880; silver #C4C8CC;
  - Axi red #E4002E, at most 10% of any frame: one red word per headline, the dot, the fulcrum, the spread
    bracket, the sweeps;
  - mint #5EE0BB only for ✓ and the buy side.
- Type: Readex Pro (Arabic, RTL) for every word. Inter for numbers and tokens: $7.5, 24, 8, ×10, $1,000,
  (Spread). Western digits throughout.
- Marks:
  - Axi Iraq logo top-right (height 80, right edge x 1843, y 50);
  - white/ink X watermark bottom-left at 60%;
  - both are re-inked live by whichever world (day or night) is beneath them.
- Section label (the reference's «01 Concept»): top-left, chapter title with its red index on the right
  (RTL); it flips up on every chapter change.

CONTINUITY ENGINE — no cuts, no fades to black, no wipes
1. Brand dot: the open's red dot (r 14 at 960,540) is the first pixel of the shot. It springs into the
   «02» tile, then shrinks back and waits, breathing, in the exact slot of the headline's «؟», which snaps
   in around it and absorbs it.
2. Fly-through: the camera zooms ×3.4 through the headline into the $7.5 beat.
3. Particle morph: the 48-px dot grid bends into a rotating 420-dot globe, then scatters back to the grid
   while the four cards spring out of the globe.
4. Window push: the camera pushes ×7.5 into card 01. The next scene is already alive inside the card,
   drawn through the inverse of the final transform, so on the landing frame the card IS the frame.
5. Shape morphs:
   - the depth bars collapse into their baseline;
   - the baseline becomes the volatility wave;
   - the wave flattens and curls into the 24 h ring;
   - the ring unrolls into the leverage beam.
6. World discs:
   - Night grows out of the ring: a dark disc, r 0→1300 px over 1.1 s, with a fading red rim.
   - Day grows back from the centre carrying the recap, over 1.0 s.
   - Both worlds are rendered and composited per pixel, never crossfaded.
7. Collapse: every card shrinks into the red dot at (960,540), and the dot becomes the 3D X sting.
- Camera: a continuous drift (scale 1 ± 0.012) plus a 3% push pulse (σ 0.35 s) on every chapter change.

EASING (CSS equivalents)
- Camera moves, morphs, discs: cubic in-out — cubic-bezier(0.65, 0, 0.35, 1).
- Entrances (type, labels, gauges): expo out — cubic-bezier(0.16, 1, 0.3, 1).
- Fast swaps and exits: expo in-out — cubic-bezier(0.87, 0, 0.13, 1).
- Landings (tile, $7.5, badge, cards, hero numbers, boxes, ×10): underdamped spring, ω 12–15 rad/s,
  ζ 0.45–0.6, which gives 10–20% overshoot.
- Kinetic words: Arabic-safe letter strips with a 40 ms stagger — drop (tilt + spring), rise (slot),
  snap (no easing).
- Motion blur: 6 sub-frames across a 0.75-frame shutter. The card push uses 18 sub-frames across a
  1.0-frame shutter. The HUD is never blurred.

PERSISTENT BOTTOM TIMELINE UI (00:00:01.800 → 00:01:36.880)
- Track: x 1843 → 330 (RTL) at y 1020; 3-px segments with 8-px gaps; 7 chapters, each sized by its real
  duration.
- Every chapter is titled above its own segment (17 px):
  - past: grey 95%;
  - current: bold ink (white at night), flipping in over 0.35 s;
  - future: grey 60%.
- Progress: a red fill runs from the chapter start to a 5-px red playhead dot; past segments darken.
- Left block: red index «03 / 07» (Inter 700, 14 px) over the timecode HH:MM:SS:FF (Inter 600, 17 px),
  counted from the narration start.
- Chapters:
    01 لماذا الفوركس؟       00:00:02.000
    02 أكبر سوق في العالم   00:00:11.260
    03 السيولة العالية       00:00:22.490
    04 التقلّبات             00:00:38.250
    05 24 ساعة              00:00:52.550
    06 الرافعة المالية       00:01:13.690
    07 الخلاصة              00:01:26.160
</visual_architecture>

<lesson_2_redesign>
[00:00:00.000 → 00:00:02.050] BRAND OPEN
  VO       — (the voice file is placed at 00:00:02.000 and begins with its own intro sting)
  Visual   00:00:00.060  The white Axi Iraq logo springs in on the primary gradient (#EEF0F1→#607880).
           00:00:01.550  Light paper slides in; the logo scales into a red dot (r 14) at frame centre.
  → Hand-off: no transition. The dot is the first frame of the shot.

[00:00:02.050 → 00:00:06.500] TITLE «02»
  Visual   00:00:02.050  The dot springs (ω 13, ζ 0.5) into a 220-px red tile «02».
                         The dot grid ripples out from the centre.
           00:00:02.650 → 00:00:05.900  A red progress ring sweeps once around the tile.
           00:00:02.750  «الدرس الثاني» and «أكاديمية آكسي» rise beneath it.
  → 00:00:06.150 → 00:00:06.850  The tile shrinks back into the dot and flies to the «؟» slot
                                 (x ≈ 296, y 629).

[00:00:06.500 → 00:00:11.260] THE QUESTION
  VO       00:00:06.500 «في هذا الدرس سنجيب عن سؤال · لماذا تتداول الفوركس؟»
  Visual   00:00:06.500  The caption rises word by word (56 px slate, y 450).
           00:00:08.650 / 00:00:09.270 / 00:00:09.910  «لماذا» / «تتداول» / «الفوركس» drop in at 130 px.
           (throughout)  The waiting dot breathes ±12%.
           00:00:10.310  The red «؟» snaps in around the dot and absorbs it.
  → 00:00:10.960 → 00:00:11.710  The camera flies through the headline (×3.4, cubic in-out).

[00:00:11.260 → 00:00:19.520] $7.5 TRILLION · THE LARGEST MARKET
  VO       00:00:11.260 «يُقدَّر حجم التداول اليومي في سوق الفوركس بأكثر من 7.5»
           00:00:15.940 «تريليون دولار»
           00:00:17.160 «ما يجعله أكبر سوق في العالم»
  Visual   (from 00:00:11.260)  The caption builds word by word (50 px, y 250).
           00:00:15.670  «$7.5» slams in (Inter Light, 260 px, spring).
           00:00:15.940 / 00:00:16.650  «تريليون» / «دولار» rise in red; «يومياً» settles under them.
           00:00:16.860 → 00:00:17.860  The dot grid bends into a rotating dot globe (left, r 270).
                         The figure slides right and scales to 62%.
           00:00:17.160  The caption changes, with «أكبر سوق» in bold ink.
           00:00:18.900  «العالم»: a red «#1» badge springs onto the globe.
  → 00:00:19.570 → 00:00:20.170  The figure dissolves and the globe scatters back into the grid.

[00:00:19.520 → 00:00:22.740] FOUR REASONS
  VO       00:00:19.520 «فما الذي يجعل الفوركس بهذه الشعبية؟»
  Visual   00:00:19.970 → 00:00:20.330  Four cards (300×360, 01 on the right) spring out of the globe in
                                        RTL order. Each has an icon and a grey «؟».
           00:00:22.240  Card 01 arms with a red border.
           00:00:22.490  «أولاً» drops in red, as the first word of the chapter headline.
  → 00:00:22.740 → 00:00:23.540  The camera pushes ×7.5 into card 01 (18-sample blur).
                                 The other cards fade inside the first 35%.
                                 The depth chart is already alive inside the card.

[00:00:22.490 → 00:00:38.250] 01 · LIQUIDITY — order-book depth
  VO       00:00:22.490 «أولاً» · 00:00:23.260 «سيولة عالية بسبب ضخامة حجم التداول اليومي»
           00:00:27.180 «تساعد سيولة سوق» · 00:00:28.700 «الفوركس على ضمان أن السعر الذي يدفعه المتداولون»
           00:00:32.560 «يكون منخفضاً» · 00:00:34.060 «من خلال فروق أسعار وتكاليف تداول منخفضة»
  Visual   Headline «أولاً سيولة عالية» (120 px, «أولاً» red).
           Depth chart on a baseline (y 770, x 520–1400):
             - 11 bid bars (ink) left of the price and 11 ask bars (slate) right of it;
             - labels «طلبات الشراء» and «طلبات البيع».
           00:00:23.060  The bars spring up in a 40 ms cascade.
           00:00:24.770 → 00:00:26.470  «ضخامة»: the walls grow from 120 to 310 px, breathing ±3.5%.
           Captions (44 px slate, y 350), in lock-step with the VO:
             «بسبب ضخامة حجم التداول اليومي»
             → «تساعد سيولة سوق الفوركس على ضمان»
             → «أن السعر الذي يدفعه المتداولون يكون منخفضاً»
             → «من خلال فروق أسعار وتكاليف تداول منخفضة»
           00:00:30.190  A red spread bracket appears.
           00:00:30.390 → 00:00:33.630  «السعر … منخفضاً»: the walls slide together and the gap tightens
                                        from 240 to 24 px.
           00:00:34.650  «فروق»: the label «فرق سعر ضيّق (Spread)» appears on a red leader.
           00:00:35.840 → 00:00:37.090  «وتكاليف»: the cost gauge drains from 85% to 16% (ink → mint).
           00:00:37.170  «منخفضة»: mint ✓.
  → 00:00:37.630 → 00:00:38.150  The bars collapse outer-first into the baseline, which thickens into a
                                 5-px ink line.

[00:00:38.250 → 00:00:52.550] 02 · VOLATILITY — the line comes alive
  VO       00:00:38.250 «ثانياً» · 00:00:39.100 «تقلّبات جيدة» · 00:00:40.770 «فكلما زادت السيولة زادت التقلّبات»
           00:00:44.070 «سوق الفوركس أكثر تقلّباً بكثير من سوق الأسهم»
           00:00:48.070 «ما يمنحك خيارات أكبر للتداول على حركة الأسعار»
  Visual   00:00:38.150  The baseline starts to wave (a tapered stack of sines, amplitude 0 → 58 px).
           Headline «ثانياً تقلّبات جيدة» («ثانياً» red).
           00:00:41.380 → 00:00:43.080  A vertical liquidity meter rises from 30% to 95%; the wave's
                                        amplitude follows it, ×1.9.
           00:00:42.860  The label «التقلّبات» rides the start of the line.
           00:00:44.100 → 00:00:44.800  The line lifts to y 640 as «الفوركس». A calmer slate «الأسهم» wave
                                        (22% amplitude) appears below it.
           00:00:48.750 → 00:00:52.000  Red ▼ over every peak and mint ▲ under every trough, revealed
                                        right→left and riding the live wave.
  → 00:00:51.600 → 00:00:52.050  The waves flatten.
    00:00:52.050 → 00:00:52.850  The line curls point-to-point into a 200-px ring.

[00:00:52.550 → 00:01:13.690] 03 · 24 HOURS — night falls
  VO       00:00:52.550 «ثالثاً سوق الفوركس مفتوح على مدار 24 ساعة» · 00:00:57.250 «خمسة أيام في الأسبوع»
           00:00:59.130 «وهذا أفضل بكثير مقارنةً مع أسواق الأسهم» · 00:01:02.950 «التي تفتح عادةً لثماني ساعات فقط يومياً»
           00:01:06.930 «هذا يتيح لمتداولين مثل جون» · 00:01:09.550 «استكشاف التداول في أي وقت يناسبهم»
  Visual   Headline «ثالثاً سوق الفوركس مفتوح» (84 px), caption «على مدار 24 ساعة».
           00:00:52.850 → 00:00:53.950  NIGHT: a dark disc grows out of the ring with a fading red rim.
                                        The ring, the type and the marks re-ink white as the rim passes.
           The ring gains 24 hour ticks.
           00:00:54.320 → 00:00:56.580  A red sweep runs 0 → 24 h.
           00:00:56.580  The «24 ساعة» hero springs in.
           00:00:57.150  «خمسة أيام»: seven day pills; Mon–Fri fill red one by one (180 ms apart),
                         Sat and Sun stay hollow.
           00:00:59.030 → 00:00:59.830  The forex ring slides right and a stocks ring slides out left.
           00:01:04.170 → 00:01:04.970  «لثماني ساعات»: a silver 8 h arc (09:00→17:00) draws; «8 ساعات».
           00:01:06.730 → 00:01:07.430  The rings merge back.
           00:01:08.830  «جون»: a red avatar pops at 12 o'clock.
           00:01:11.090 → 00:01:12.990  «في أي وقت يناسبهم»: the avatar orbits the ring once and leaves
                                        four mint ✓.
  → 00:01:13.090 → 00:01:13.890  The ring unrolls into an 860-px beam.

[00:01:13.690 → 00:01:26.160] 04 · LEVERAGE — $1,000 balances $10,000
  VO       00:01:13.690 «الرافعة المالية» · 00:01:15.380 «تسمح لك معظم الشركات باستخدام الرافعة المالية»
           00:01:19.090 «عند التداول» · 00:01:20.410 «أي» · 00:01:20.920 «تمنحك القدرة على إتمام صفقات أكبر من رأس مالك بأضعاف»
  Visual   Headline «الرافعة المالية» (104 px, «الرافعة» red).
           00:01:13.540  The red fulcrum springs in under the beam (pivot 840,790).
           00:01:15.380  «تسمح لك»: a white «$1,000 · رأس مالك» box drops onto the long arm; the beam tips
                         10° with an underdamped wobble.
           00:01:17.580  «الرافعة»: the fulcrum pulses.
           00:01:18.180  A red risk line appears: «تنبيه: الرافعة المالية تضاعف الأرباح والخسائر معاً».
           00:01:20.920  «تمنحك»: a «$1,000 · حجم الصفقة» box appears on the short arm.
           00:01:22.480 → 00:01:24.180  «إتمام صفقات أكبر»: that box grows ×10 to «$10,000» and the beam
                                        levels out, balanced.
           00:01:24.340  «رأس مالك»: the capital box pulses.
           00:01:25.040  «بأضعاف»: «×10» slams in, with «مثال توضيحي».
  → 00:01:25.910 → 00:01:26.910  DAY: a light disc grows from the centre carrying the recap.
                                 Outside it, the leverage world dims and shrinks 12%.

[00:01:26.160 → 00:01:36.880] 07 · RECAP
  VO       00:01:26.160 «أتمنى أن تستفيد من هذا السوق الضخم وأن تجد رزقك فيه»
           00:01:31.170 «أجيبوا عن الأسئلة في أسفل الصفحة» · 00:01:33.670 «ونراكم في الدرس القادم» · 00:01:35.760 «إن شاء الله»
  Visual   00:01:26.030 → 00:01:26.390  The four cards spring back out (01 on the right), now carrying their
                                        answers: سيولة عالية · تقلّبات جيدة · 24 ساعة · الرافعة المالية.
           Captions: «أتمنى …» («الضخم» in bold).
           00:01:31.170  «أجيبوا …»: the cards lift 50 px and scale to 0.86.
           00:01:32.610  A red down-arrow bounces under «أسفل الصفحة».
           00:01:33.670  «ونراكم في الدرس القادم إن شاء الله».
  → 00:01:36.030 → 00:01:36.830  Everything collapses into the red dot at (960,540).

[00:01:36.880 → 00:01:42.780] CLOSE
  Visual   00:01:36.880  The dot shrinks as the 3D X grows out of it (spring ω 11).
                         The paper turns to the primary gradient.
           00:01:37.830  Seal.
           00:01:37.980  «تعلّم ثم تعلّم ثم تدرّب ثم تداول.»
           00:01:38.230  The red pill «تعلّم مع Axi».
           00:01:39.780 → 00:01:42.780  Risk strip (CFD/OTC risk warning).
</lesson_2_redesign>

<audio_choreography>
BGM — new score for this lesson (synthesised; no samples, no licensing)
- 128 BPM, A minor: Am9 · Fmaj7 · C · G, two bars per chord.
- Instruments:
  - four-on-the-floor kick with a clap on 2 and 4, plus 16th hats;
  - bright FM plucks; a 16th arpeggio (0-2-4-3-2-4-1-3);
  - an octave-pumping bass with a sub;
  - detuned saw pads (low-pass 2 kHz).
- The pads and bass side-chain-pump on every kick.
- Energy map, by music level. Each level adds a layer:
  - L1: pads only;
  - L2: + hats + 8th plucks;
  - L3: + kick, clap, bass, sub;
  - L4: + 16th arp.
    00:00:00.000 L1 · 00:00:02.000 L3 · 00:00:10.960 L4 · 00:00:19.220 L3 · 00:00:22.290 L4
    00:00:37.950 L3 · 00:00:40.770 L4 · 00:00:52.250 L3 · 00:00:59.130 L4 · 00:01:13.390 L3
    00:01:20.920 L4 · 00:01:25.860 L3 · 00:01:33.370 L4 · 00:01:36.880 L1 (sting + tail)
- Voice ducking is built in: the bed already dips 50% (≈ −6 dB) wherever the voice speaks, with a
  30 ms attack and a 300 ms release, computed from the real VO placed at 00:00:02.000.

SFX — every event, frame-accurate (time · sound · gain · details — cue)
00:00:00.060  identity    -5.2 dB  — brand open: identity sound under the white logo
00:00:01.580  shutter    -14.0 dB  — logo shutters away into the red dot
00:00:02.090  pop        -13.2 dB  (f 900 Hz)  — the brand dot springs into the red «02» tile
00:00:02.250  whoosh     -15.9 dB  (dur 0.6 s)  — tile lands; the dot grid ripples out from the centre
00:00:02.650  riser      -24.4 dB  (dur 3.2 s)  — red progress ring sweeps around the tile
00:00:06.150  whoosh     -14.9 dB  (dur 0.6 s)  — tile shrinks back into the dot and flies to the «؟» slot
00:00:06.840  pop        -17.1 dB  (f 1100 Hz)  — the dot settles where the «؟» will land
00:00:08.610  whoosh     -18.4 dB  (dur 0.22 s)  — «لماذا» drops
00:00:08.850  pop        -17.1 dB  (f 560 Hz)  — «لماذا» lands
00:00:09.230  whoosh     -20.9 dB  (dur 0.22 s)  — «تتداول» drops
00:00:09.470  pop        -19.6 dB  (f 560 Hz)  — «تتداول» lands
00:00:09.870  whoosh     -18.4 dB  (dur 0.22 s)  — «الفوركس» drops
00:00:10.110  pop        -17.1 dB  (f 560 Hz)  — «الفوركس» lands
00:00:10.310  snap       -11.7 dB  — red «؟» snaps in and absorbs the dot
00:00:10.960  whip       -14.0 dB  — camera flies through the headline (zoom ×3.4)
00:00:15.170  riser      -18.4 dB  (dur 0.5 s)  — riser into the number
00:00:15.670  slam       -11.7 dB  — «$7.5» slams in
00:00:15.910  whoosh     -21.9 dB  (dur 0.18 s)  — «تريليون دولار» rises word by word
00:00:16.860  whoosh     -14.9 dB  (dur 1 s)  — the dot grid bends into the rotating globe; the number slides right
00:00:17.810  chime      -21.9 dB  — globe locks
00:00:18.900  impact     -15.9 dB  — «العالم»: «#1» badge hits the globe
00:00:18.940  pop        -15.9 dB  (f 700 Hz)  — «#1» badge pops
00:00:19.970  pop        -17.1 dB  (f 600 Hz, pan +0.45)  — card 01 flies out of the globe
00:00:20.090  pop        -17.1 dB  (f 690 Hz, pan +0.15)  — card 02 flies out of the globe
00:00:20.210  pop        -17.1 dB  (f 780 Hz, pan -0.15)  — card 03 flies out of the globe
00:00:20.330  pop        -17.1 dB  (f 870 Hz, pan -0.45)  — card 04 flies out of the globe
00:00:22.240  click      -14.9 dB  — card 01 arms (red border)
00:00:22.450  whoosh     -18.4 dB  (dur 0.22 s)  — «أولاً» drops
00:00:22.690  pop        -17.1 dB  (f 560 Hz)  — «أولاً» lands
00:00:22.740  whip       -12.4 dB  — camera push into card 01 starts
00:00:23.110  tick       -26.0 dB  (f 1700 Hz, pan -0.35)  — order-book bars tick up (1/8)
00:00:23.180  tick       -26.0 dB  (f 1840 Hz, pan +0.35)  — order-book bars tick up (2/8)
00:00:23.220  whoosh     -20.4 dB  (dur 0.22 s)  — «سيولة» drops
00:00:23.250  tick       -26.0 dB  (f 1980 Hz, pan -0.35)  — order-book bars tick up (3/8)
00:00:23.320  tick       -26.0 dB  (f 2120 Hz, pan +0.35)  — order-book bars tick up (4/8)
00:00:23.390  tick       -26.0 dB  (f 2260 Hz, pan -0.35)  — order-book bars tick up (5/8)
00:00:23.460  pop        -19.0 dB  (f 560 Hz)  — «سيولة» lands
00:00:23.460  tick       -26.0 dB  (f 2400 Hz, pan +0.35)  — order-book bars tick up (6/8)
00:00:23.490  impact     -17.1 dB  — push lands: card 01 has become the frame
00:00:23.530  tick       -26.0 dB  (f 2540 Hz, pan -0.35)  — order-book bars tick up (7/8)
00:00:23.600  tick       -26.0 dB  (f 2680 Hz, pan +0.35)  — order-book bars tick up (8/8)
00:00:24.770  charge     -18.4 dB  (dur 1.7 s)  — «ضخامة»: both walls of orders grow
00:00:30.290  stretch    -15.9 dB  — «السعر»: the bid/ask walls slide together
00:00:33.630  snap       -14.0 dB  — «منخفضاً»: the spread locks tight
00:00:34.700  tick       -17.1 dB  (f 3200 Hz)  — «فروق»: label «فرق سعر ضيّق (Spread)»
00:00:35.840  whoosh     -18.4 dB  (dur 0.9 s)  — «وتكاليف»: the cost gauge drains
00:00:37.170  chime      -15.9 dB  — «منخفضة»: mint ✓
00:00:37.700  whoosh     -15.9 dB  (dur 0.45 s)  — bars collapse into the baseline
00:00:38.150  bloop      -17.1 dB  — the baseline starts to wave
00:00:38.210  whoosh     -18.4 dB  (dur 0.22 s)  — «ثانياً» drops
00:00:38.450  pop        -17.1 dB  (f 560 Hz)  — «ثانياً» lands
00:00:39.060  whoosh     -19.3 dB  (dur 0.22 s)  — «تقلّبات» drops
00:00:39.300  pop        -18.0 dB  (f 560 Hz)  — «تقلّبات» lands
00:00:41.680  riser      -18.4 dB  (dur 1.4 s)  — «السيولة»: the liquidity meter rises and the wave swings harder
00:00:43.060  bloop      -18.4 dB  — «التقلّبات» label
00:00:44.100  whoosh     -17.1 dB  (dur 0.6 s, pan +0.30)  — the wave splits: forex up, stocks below
00:00:47.260  whoosh     -20.0 dB  (dur 0.4 s, pan -0.30)  — «الأسهم» label
00:00:48.750  pop        -19.2 dB  (f 820 Hz, pan +0.40)  — opportunity markers ▲/▼ reveal right→left (1/6)
00:00:49.292  tick       -19.2 dB  (f 2600 Hz, pan +0.24)  — opportunity markers ▲/▼ reveal right→left (2/6)
00:00:49.833  pop        -19.2 dB  (f 820 Hz, pan +0.08)  — opportunity markers ▲/▼ reveal right→left (3/6)
00:00:50.375  tick       -19.2 dB  (f 2600 Hz, pan -0.08)  — opportunity markers ▲/▼ reveal right→left (4/6)
00:00:50.917  pop        -19.2 dB  (f 820 Hz, pan -0.24)  — opportunity markers ▲/▼ reveal right→left (5/6)
00:00:51.458  tick       -19.2 dB  (f 2600 Hz, pan -0.40)  — opportunity markers ▲/▼ reveal right→left (6/6)
00:00:51.600  whoosh     -18.4 dB  (dur 0.45 s)  — the wave flattens
00:00:52.050  spin       -14.0 dB  — the line curls into the 24 h ring
00:00:52.510  whoosh     -18.4 dB  (dur 0.22 s)  — «ثالثاً» drops
00:00:52.750  pop        -17.1 dB  (f 560 Hz)  — «ثالثاً» lands
00:00:52.850  revswell   -18.4 dB  (dur 1 s)  — night disc grows out of the ring
00:00:53.400  impact     -18.4 dB  — night lands
00:00:54.320  riser      -18.4 dB  (dur 2.2 s)  — «مفتوح»: red 24 h sweep
00:00:56.580  impact     -14.0 dB  — «24 ساعة» lands in the ring
00:00:57.250  tick       -20.0 dB  (f 2200 Hz)  — day pill «الاثنين» lights
00:00:57.430  tick       -20.0 dB  (f 2400 Hz)  — day pill «الثلاثاء» lights
00:00:57.610  tick       -20.0 dB  (f 2600 Hz)  — day pill «الأربعاء» lights
00:00:57.790  tick       -20.0 dB  (f 2800 Hz)  — day pill «الخميس» lights
00:00:57.970  tick       -20.0 dB  (f 3000 Hz)  — day pill «الجمعة» lights
00:00:59.030  whoosh     -15.9 dB  (dur 0.7 s)  — the stocks ring slides out to the left
00:01:04.170  stretch    -20.0 dB  — «لثماني»: the 8 h arc draws
00:01:04.970  buzz       -24.4 dB  — 8 h only
00:01:06.730  whoosh     -18.4 dB  (dur 0.6 s)  — the rings merge back
00:01:08.830  pop        -14.9 dB  (f 760 Hz)  — «جون»: the avatar pops on the ring
00:01:11.090  whoosh     -18.4 dB  (dur 1.8 s)  — the avatar orbits the ring
00:01:11.641  tick       -20.0 dB  (f 2600 Hz)  — ✓ any time (1/4)
00:01:11.974  tick       -20.0 dB  (f 2780 Hz)  — ✓ any time (2/4)
00:01:12.306  tick       -20.0 dB  (f 2960 Hz)  — ✓ any time (3/4)
00:01:12.639  tick       -20.0 dB  (f 3140 Hz)  — ✓ any time (4/4)
00:01:13.090  stretch    -14.0 dB  — the ring unrolls into the beam
00:01:13.640  impact     -18.4 dB  — red fulcrum lands
00:01:13.650  whoosh     -18.4 dB  (dur 0.22 s)  — «الرافعة» drops
00:01:13.890  pop        -17.1 dB  (f 560 Hz)  — «الرافعة» lands
00:01:15.600  slam       -15.9 dB  — «تسمح لك»: capital box lands; the beam tips
00:01:15.680  bloop      -18.4 dB  — beam wobble
00:01:17.580  tick       -18.4 dB  (f 2400 Hz)  — «الرافعة»: fulcrum pulses
00:01:18.180  buzz       -26.0 dB  — risk line appears
00:01:20.970  pop        -15.9 dB  (f 700 Hz)  — «تمنحك»: position box appears
00:01:22.480  charge     -17.1 dB  (dur 1.7 s)  — «إتمام صفقات»: the position grows ×10
00:01:24.180  chime      -18.4 dB  — the beam balances
00:01:24.340  tick       -17.1 dB  (f 2000 Hz)  — «رأس مالك»: capital pulses
00:01:25.040  slam       -12.4 dB  — «بأضعاف»: «×10» slams in
00:01:25.910  revswell   -18.4 dB  (dur 0.9 s)  — day disc grows with the recap inside
00:01:26.110  pop        -17.1 dB  (f 650 Hz, pan +0.45)  — recap card 01
00:01:26.230  pop        -17.1 dB  (f 730 Hz, pan +0.15)  — recap card 02
00:01:26.350  pop        -17.1 dB  (f 810 Hz, pan -0.15)  — recap card 03
00:01:26.470  pop        -17.1 dB  (f 890 Hz, pan -0.45)  — recap card 04
00:01:28.920  chime      -17.1 dB  — «الضخم»
00:01:32.760  bloop      -20.0 dB  — «أسفل»: red arrow bounce 1
00:01:33.100  bloop      -20.0 dB  — «أسفل»: red arrow bounce 2
00:01:33.440  bloop      -20.0 dB  — «أسفل»: red arrow bounce 3
00:01:34.370  whoosh     -19.3 dB  (dur 0.22 s)  — «الدرس» drops
00:01:34.610  pop        -18.0 dB  (f 560 Hz)  — «الدرس» lands
00:01:36.030  whoosh     -17.1 dB  (dur 0.6 s)  — the cards collapse to the centre
00:01:36.330  revswell   -15.9 dB  (dur 0.55 s)  — reverse swell into the red dot
00:01:36.460  whoosh     -14.9 dB  (dur 0.45 s)  — whoosh into the close
00:01:36.900  sting       -4.4 dB  — X sting grows out of the dot
00:01:37.930  whoosh     -17.1 dB  (dur 0.4 s)  — CTA line slides in
00:01:38.230  pop        -12.4 dB  (f 820 Hz)  — «تعلّم مع Axi» pill pops
</audio_choreography>

<post_production_checklist>
RENDER SPECS
- Master: H.264 High, 1920×1080, 60 fps progressive, yuv420p, CRF 15 (tune animation), +faststart.
- Audio: AAC-LC 320 kbps, 48 kHz stereo.
- Optional mezzanine: re-render the same timeline as ProRes 422 HQ (frames are deterministic — frame = f(t)).
  For 4K, render at 3840×2160 from the same code, rather than upscaling.
- Motion blur: 6 sub-frames per frame (18 on the card push).
- Colour: limited (TV) range, BT.601 matrix, tagged bt470bg (as encoded). For a strict Rec.709 delivery, re-encode with
  `-vf colorspace=all=bt709:iall=bt601-6-625 -colorspace bt709 -color_primaries bt709 -color_trc bt709`.

EASING LIBRARY (for any manual re-build in AE/Premiere)
- camera / morph / disc   cubic-bezier(0.65, 0, 0.35, 1)
- entrances               cubic-bezier(0.16, 1, 0.3, 1)
- swaps / exits           cubic-bezier(0.87, 0, 0.13, 1)
- landings                spring ω 12–15, ζ 0.45–0.6 (AE: elastic/bounce expression, overshoot ≈ 15%)

LOUDNESS
- Delivered bed (music + SFX, no VO): −21.0 LUFS integrated, −3.4 dBTP, LRA 2.7 LU. It has headroom on
  purpose, so the voice fits on top.
- Reference mix (bed + original VO at 00:00:02.000): −16.1 LUFS, −0.8 dBTP.
  → After adding the VO, put a true-peak limiter on the master at −1.0 dBTP.
- Targets for the final mix with the VO:
  - YouTube / web: −14 LUFS integrated (±1), true peak ≤ −1.0 dBTP.
  - Instagram / TikTok / Facebook: −14 LUFS, ≤ −1.0 dBTP.
  - Broadcast-safe alternative: −16 LUFS, ≤ −1.0 dBTP.
  - Dialogue sits 12–15 LU above the music bed; LRA ≤ 7 LU.

VO PLACEMENT AND SYNC CHECK
- Drop `lesson_2_full_ep_new.wav` at 00:00:02.000, at its original level.
- Spot-check these sync points; each must land on the word:
    00:00:10.310 «؟» snap
    00:00:15.670 «$7.5» slam
    00:00:18.900 «#1»
    00:00:30.390 the walls start to close on «السعر»
    00:00:56.580 «24 ساعة»
    00:01:04.470 the 8 h arc on «لثماني»
    00:01:09.080 «جون»
    00:01:25.040 «×10» on «بأضعاف»
    00:01:32.760 the arrow on «أسفل»

POSTING CHECKLIST
- Title: «لماذا تتداول الفوركس؟ | الدرس 2 – أكاديمية آكسي»
- Thumbnail frame: 00:00:56.900 (the red 24 h ring at night) or 00:00:18.950 ($7.5 + globe + #1).
- YouTube chapters (each is at least 10 s):
    0:00 لماذا الفوركس؟
    0:11 أكبر سوق في العالم
    0:22 السيولة العالية
    0:38 التقلّبات
    0:52 24 ساعة
    1:13 الرافعة المالية
    1:26 الخلاصة
- Description:
  - the lesson summary (the four reasons);
  - «$7.5 trillion daily» with its source (BIS Triennial Survey, April 2022);
  - the risk warning, word for word:
    «تنطوي عقود الفروقات والمنتجات المشتقة خارج البورصة على مخاطر عالية قد تؤدي إلى خسارة رأس المال. المحتوى التعليمي والتحليلي لا يُعدّ نصيحة استثمارية.»
- Captions: upload an Arabic SRT built from the word timings (`tools/words.json`). Every word on screen
  already follows the VO.
- Compliance:
  - leverage is shown as an illustrative example («مثال توضيحي»), with an on-screen risk line;
  - no performance promises;
  - the close carries the risk strip for its last 3 s.
- Brand QA:
  - logo top-right and X watermark bottom-left on every frame of the shot;
  - red ≤ 10% of any frame;
  - mint only for ✓ and the buy side;
  - vertical gradients only;
  - no third-party logos.
- Pre-flight: play the full mix once on phone speakers and once on headphones. Check the −1 dBTP ceiling
  after the platform transcode.
</post_production_checklist>
```

## Files
- `src/scenes1.js` — the whole shot: one scene, one camera, every beat above.
- `src/fx.js` (`chapterBar`) — the bottom timeline UI.
- `src/brand.js` — the continuous open (logo → dot) and close (dot → X).
- `audio/synth.py` + `audio/sections.json` (score) + `audio/sfx.json` (the 116 events above).
