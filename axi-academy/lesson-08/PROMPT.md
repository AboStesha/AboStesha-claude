# Lesson 08 — الهامش (Margin) · 4-stage directing breakdown

Lesson 8 is rebuilt as a single continuous shot on the new voice-over `episode_8_edited.wav` (297.72 s, 48 kHz mono). Every move, label and sound is placed on a word from the transcript.

- **Timecodes:** video time, `HH:MM:SS.mmm`, 60 fps.
- **Voice-over:** it is **not** in the master. Place it at **00:00:02.000**.
- **Master:** `Lesson08_Margin.mp4` — 1920×1080, 60 fps, 304.7 s, music + SFX only.
- **Word timing:** faster-whisper large-v3-turbo with word timestamps. The number words were rewritten as digits («1:100», «0.1», «10,000», «200%»). That gives 72 phrases and 514 words (`tools/words.json`, `src/words.js`).
- **Script:** this is the corrected script. Margin is calculated in the base currency and then converted to the account currency, and margin level is a ratio (equity ÷ used margin × 100). The visuals follow those corrections.

```xml
<visual_architecture>
ONE SHOT
- A single virtual camera flies through one world. There are no cuts, no fades to black and no wipes.
  Every station stays where it was built, so the camera can come back to it, and the closing pull-back
  shows the whole journey at once.
- Camera: world coordinates with keyed moves. Each key has an arrival time and a duration.
  - Every move uses the house curve (cubic in-out). Zoom is interpolated in log space.
  - A hand-held float is always on: ±6 px and ±0.18°.
  - Each chapter change adds a +2.8% push pulse.
  - The two whips use a wide shutter (motion blur at 18 sub-frames).
  - At night the camera drifts into a dutch angle (−1.4° to −2°) and comes back level when day returns.
- Depth: the 48 px world dot grid moves with the camera, which gives parallax. Contact shadows sit under
  the tank and the house. The trade card goes out of focus while the camera is at the house.

THE HERO: THE GLASS TANK (the trading account)
- The liquid is the equity. It has a live surface, caustic bands and bubbles when it fills.
- The dark hatched band at the bottom is the used margin. It carries a red padlock and is held by the
  open trades through dashed tethers.
- Free margin is the liquid above the band. Margin level is the liquid height ÷ the band height × 100%.
- Margin call is drawn at the band's top (100%) and stop out at half of it (50%), both labelled
  «قد يختلف حسب الوسيط».

LOOK (Axi Iraq brand)
- Day: paper #FBFBFB→#EEF0F1. Night: #17181B→#0B0D0D. Gradients are vertical only.
- Colours:
  - ink #090A0D (white at night) and slate #607880;
  - red #E4002E stays under 10% of a frame: the dot, the padlock, the operators, the danger lines,
    the level marker;
  - mint #5EE0BB is used only for ✓.
- Type: Readex Pro for all Arabic, RTL. Inter for numbers, pairs and codes. Western digits throughout.
- Marks: the Axi Iraq logo sits top-right (h 80, right edge x 1843, y 50) and is re-inked by day and
  night. The X mark is never used.
- HUD: the section label top-left (chapter title with its red index) and the chapter bar with timecode
  along the bottom.

WORLD MAP (x grows to the right; RTL "forward" is to the left)
- tank: x 790–1130, y 380–860;
- board: x 110–1810, y −820 to −160 (above the tank);
- trade card: x 395–725;
- broker vault / house: x −150, base y 820;
- currency station: coin (−700, −150), pair (−1330, −40);
- order ticket and lot bar: x 200–760;
- platform panel: x 1480–2040;
- the 100-tank wall: columns go left and rows go down from our tank.
</visual_architecture>
```

```xml
<lesson_redesign>
01 ما هو الهامش؟ (00:00:02.000)
- 00:00:02.050 The open's red dot (r 14 at 960,540) is the first pixel of the shot. It beats on «ما»
  (03.660), «مارجن» (04.100) and «الهامش» (04.900).
- 00:00:03.660 «ما هو مارجن؟» drops in. On «أي» it lifts out and «الهامش» slams in at 04.900, with
  the «Margin» chip under it.
- 00:00:05.250 The dot falls. At 05.670 it splashes into the bottom of a glass tank that builds from the
  floor outwards, and the red drop dissolves into slate liquid.
- 00:00:07.180 «المال» fills the tank to 70%. The «المال في حسابك» leader appears.
- 00:00:10.300 «فتح» slides a EUR/USD trade card in from the left. On «صفقة» (10.600) the band rises to
  12%, a tether connects it to the card, and the padlock closes.
- 00:00:13.940 The camera pans left to the broker's vault. On «بوديعة» (14.440) the band label becomes
  «الهامش = وديعة». On «يحتفظ» (15.140) a tether runs from the band to the vault. On «الوسيط» (16.060)
  the «الوسيط / Broker» label appears.
- 00:00:17.600 On «استئجار» the vault morphs into a house and the camera pushes in by «منزل» (18.140).
  The trade card goes out of focus.
- 00:00:19.180 «تدفع تأميناً»: the «تأمين» envelope flies into the door.
- 00:00:21.780 «ضرر»: the «لا ضرر» ✓ stamp. «انتهاء عقد الإيجار» (22.520–23.380): the lease bar runs
  right to left and reads «انتهى».
- 00:00:24.100 «تسترد»: the envelope flies back out. A ✓ lands on «تأمينك» (24.680).
- 00:00:25.560 «والأمر مشابه»: the house turns back into the vault, and the camera whips back to the trade
  (wide shutter).
- 00:00:28.180 «تغلق»: the card's status dot is pressed and the card folds shut. «يُعاد» (29.420): the padlock
  opens and the band melts back into the liquid. «حسابك» (30.760): ✓.

02 المعادلة (00:00:31.440)
- 00:00:31.440 The camera tilts up. «كيف تحسب الهامش؟» lands word by word.
- 00:00:34.600 The dashed «حجم الصفقة» block appears, labelled «ثابت». «رافعتك» (36.480): the leverage
  slider springs in under the tank, RTL from 1:10 to 1:500.
- 00:00:38.520–40.600 On «ارتفعت» the knob slides from 1:10 to 1:500, and the band thins from 50% of the
  tank to 1%. The bracket reads the margin as a share of the trade size: 10% → 3.3% → 2% → 1% → 0.5% → 0.2%.
- 00:00:43.260 The camera rises to the board. «المعادلة» (44.960) puts the chip on it.
- 00:00:46.560–50.000 The formula builds word by word in the middle of the board:
  «الهامش» · = (47.280) · «حجم الصفقة» (48.000) · ÷ (48.940) · «الرافعة المالية» (50.000).

03 عملة الهامش (00:00:51.320)
- 00:00:51.840 The camera flies left to the currency station. The caption «الهامش يحسب أولاً بعملة الأساس»
  rises word by word.
- 00:00:56.100 The € coin pops in, labelled «عملة الأساس». Chips «الهامش €» and «حجم الصفقة €» (57.680).
- 00:00:59.020 On «يُحوَّل» the coin flips € → $. «عملة حسابك» (61.060). The margin chip becomes «الهامش $»;
  the trade size stays in €.
- 00:01:04.080 The camera pans to «EUR/USD». EUR turns red, is underlined and labelled «عملة الأساس»
  (65.440–66.440). USD is underlined and labelled «عملة التسعير» (69.140).
- 00:01:12.460 «تبادل»: a € coin and a $ coin swap sides. «1 EUR = ? USD» appears on «بمقدار».

04 مثال الرافعة (00:01:15.680)
- 00:01:15.930 Whip home to the tank (wide shutter).
- 00:01:21.380 «$1,000» bracket: «رصيد الحساب».
- 00:01:25.220 The slider returns and snaps to 1:100.
- 00:01:28.340–30.780 «$1,000 × 100» builds above the tank.
- 00:01:32.180–35.940 The big pull-back (z 0.167). A wall of 100 identical tanks cascades out from ours,
  and on «100,000» (95.940) every tank fills in a ripple. «$100,000» slams in over the wall with
  «= 100 حساب مثل حسابك».
- 00:01:37.340 Dive back into our tank. «كم هامشاً ستحتاج؟».

05 مثال عملي (00:01:37.340)
- 00:01:40.800 The order ticket «أمر جديد». «0.10» is typed on «0.1» (103.060) and «EUR/USD» on (105.920).
  «حجم الصفقة €10,000» is highlighted on (109.840).
- 00:01:51.940 The lot bar: one 0.1 segment lights up, and «0.1 × 100,000 = €10,000» builds above.
  «القياسي» (116.400): all ten segments light, with «عقد قياسي واحد = 100,000 وحدة» and
  «قد يختلف حسب الوسيط».
- 00:02:00.740 Back up to the board. The formula's «الهامش» (122.860) and «حجم الصفقة» (124.980) are
  underlined. The formula moves up to make room.
- 00:02:06.060–12.540 Each number lands under its term: «€10,000», ÷, «100», then «= €100».
- 00:02:15.800 «يُحوَّل»: the conversion row «€100 × 1 = $100». «1» is captioned «سعر EUR/USD · مثال افتراضي»
  (143.620), and «$100» lands at 146.800.
- 00:02:27.250 «$100» drops off the board, and the camera follows it down into the tank. At 148.350 the
  band rises to 7% and locks. The brackets read «الهامش المستخدم $100» and «الهامش الحر $900».
- 00:02:28.640 «محيّراً»: every number of the lesson orbits the tank and the camera rolls. On «فلا تقلق»
  (152.640) they fly away and the frame calms.
- 00:02:35.140 «تلقائياً»: the platform panel «حسابك على المنصة» opens with a spinning gear. Its rows type
  in: الرصيد $1,000 · حقوق الملكية $1,000 · الهامش المستخدم $100 · الهامش الحر $900 · مستوى الهامش 1,000%.

06 نداء الهامش والتصفية (00:02:42.740)
- 00:02:43.040 / 43.840 / 44.640 Three more trades open on the left. Each one tethers to the band, which
  grows 7% → 15% → 22% → 30%.
- 00:02:47.290 Night grows out of the tank as a disc with a red rim. «المخاطر الخفية» (167.740–168.400).
- 00:02:50.540 The red dashed «نداء الهامش» line sits at the band's top. «التصفية الإجبارية» (171.900) sits
  at half the band, with «قد يختلف حسب الوسيط».
- 00:02:53.780 The EUR/USD chart falls from «سعر الدخول». The equity drains in sync, and «حقوق الملكية»
  follows the surface (176.960). «تخسر» (186.220): red «−$» leaves the surface.
- 00:03:09.240 The surface touches the margin-call line. The band flashes and the «نداء الهامش» call card
  rings.
- 00:03:15.000 «إضافة»: a jug «+ إيداع» pours, and the equity climbs to 56%. The call card is dismissed with
  a ✓. «مفتوحة» (200.280): the trades get ✓.
- 00:03:21.540 «وإذا لم»: tape rewind. The pour runs backwards, the call card comes back ringing, and ⏪
  marks and scan lines show on screen.
- 00:03:23.290–31.340 The drain continues down to the stop-out line, which is hit on «دون» (211.340).
  The alarm blinks on the band.
- 00:03:33.700 «صفقاتك»: the three trades are slashed in two and fall. «تلقائياً» (214.600): the padlock
  opens and the band releases. What is left is the liquid at the stop-out level.

07 مستوى الهامش (00:03:38.140)
- 00:03:38.340 Day grows back out of the tank. The tank refills and one new trade holds a 17.5% band.
- 00:03:43.740 «مستوى الهامش»: the ruler 50% · 100% · 200% · 300% beside the tank, with the danger zone
  up to 100% in red. A live marker reads 400%. «فتح أي صفقات أخرى» (225.340): a dashed «صفقة جديدة؟»
  card waits.
- 00:03:50.080 «أمان»: ✓ next to the level. «الخسائر» (231.560): a red arrow pushes on the surface.
- 00:03:53.080 «ارتفع»: the equity rises and the marker climbs to 480%. «أبعد» (235.220): the distance
  arrow «أبعد عن نداء الهامش» grows from the 100% level.
- 00:03:58.000 The camera rises to the board. The old rows are wiped left, and «مستوى الهامش =» is written
  (242.400).
- 00:04:03.100–08.500 «حقوق الملكية» · ÷ · «الهامش المستخدم» · × · «100». On «كنسبة» (252.220) a red %
  pops on, and «يُعرض كنسبة مئوية» appears.
- 00:04:16.660 Back at the tank: «حقوق الملكية $10,000» on the left. «$5,000» (259.300): the band rises
  to half the liquid, with «الهامش المستخدم $5,000».
- 00:04:24.960–31.680 «$10,000 ÷ $5,000 × 100 = 200%». The 200% slams in, and a dashed copy of the band
  stacks onto it to show that two bands fill the equity («×2»).

08 الخلاصة (00:04:33.160)
- 00:04:33.360 The whole-journey pull-back (z 0.47): house, coin, pair, ticket, tank, panel and board,
  with «الهامش والرافعة المالية» above them.
- 00:04:38.180 Back to the board. It splits into four recap cards (281.000):
  01 الهامش · 02 عملة الهامش · 03 المخاطر · 04 مستوى الهامش.
  Each card is highlighted in turn on phrases 68–69.
- 00:04:55.460 «أسفل»: the «الأسئلة» chip and a bouncing red arrow.
- 00:04:57.270–58.920 Everything collapses into the screen centre and the red dot is left alone.
- 00:04:59.710 Close: the dot springs back into the Axi Iraq logo, then the motto «تعلّم ثم تعلّم ثم تدرّب ثم تداول.»,
  the «تعلّم مع Axi» pill and the risk strip.
</lesson_redesign>
```

```xml
<audio_choreography>
SCORE (new for this lesson)
- 112 BPM in F minor: Fm9 · Dbmaj7 · Ab · Eb, two bars per chord.
- Glass plucks (for the glass tank), a broken kit, light swing (0.03) and an 1800 Hz pad filter.
- Energy map, levels 1–4:
  - open 1, narration 2–3;
  - each chapter turn 4, then back to 3;
  - «محيّراً» 2;
  - the risk chapter starts at 2 (tension) and grows to 3, then drops to 2 on «خبر سيء»;
  - day 4, then 3;
  - the 200% and the recap 4;
  - close 1.
- The music ducks 62% under the voice, which is detected from the narration file.

SFX (296 events, frame-accurate; the full list is in `audio/sfx.json`)
- Words: a drop (whoosh + pop) for each kinetic word, a slam on «الهامش», «$100,000», «€100» and «200%»,
  and ticks on the operators.
- Liquid:
  - splash: bloop + ripple + chime;
  - pours and refills: charge + bubbling bloops;
  - band release: bubbles.
- Locks: a snap when the padlock closes or opens. A stretch when the band grows.
- Moves: whooshes on the pans, whips on the two whips, a riser and whoosh on the 100-tank pull-back.
- Risk:
  - revswell for night and for day;
  - buzzes on the danger lines and on the margin call (phone vibration);
  - glitch + revswell for the rewind;
  - whip + impact for each slash.
- Close: the brand sting and pop from `brand.js`.
- All SFX pan with their screen position.
</audio_choreography>
```

```xml
<post_production>
- Voice-over: place `episode_8_edited.wav` at 00:00:02.000 at its original level. Put a −1 dBTP
  true-peak limiter on the master.
- Checks done on the master:
  - one shot with no cuts, and continuous motion through every chapter turn;
  - every text inside safe margins (77 px, 50 px top, HUD band y 990–1030);
  - no X mark; the logo only;
  - red stays under 10% of every frame and mint is used only on ✓;
  - all numbers checked: 1,000 × 100 = 100,000 · 0.1 × 100,000 = 10,000 · 10,000 ÷ 100 = 100 ·
    100 € × 1 = $100 · 1,000 − 100 = 900 free · 1,000 ÷ 100 × 100 = 1,000% · 10,000 ÷ 5,000 × 100 = 200%.
- Broker-dependent values (margin call 100%, stop out 50%, contract size 100,000) carry
  «قد يختلف حسب الوسيط». The EUR/USD = 1 rate is marked «مثال افتراضي».
</post_production>
```
