# Gold series · Lesson 03 — «أرقام الذهب» · adapted prompt

This is the reference prompt (*The showreel prompt · Prompt Motion*) adapted for Axi Academy's gold lesson 3. The original asks for a 15-second showreel. Here the same grammar carries a 3:32 lesson:
- every shot is made out of the previous one;
- the palette is 3 colours plus black and white;
- there is one bold typeface family and one camera language;
- the film uses kinetic type, shape morphing, a 2D→3D moment, a data/UI moment and an end title;
- the tempo is 120 BPM, with something on every beat.

The film is synced word by word to `lesson_3.wav` (Iraqi dialect, 97 phrases, 400 words). The voice-over is **not** in the master; place it at **00:02.00**. All times are video time, `MM:SS.cc`.

**Concept (one line):** «ذهب ← وزن ← عقد» — a gold bar breaks into the numbers of gold (gram, ounce, mithqal) and stacks back up as a contract (the lot).

```xml
<direction>
A 3:32 motion-design lesson that proves world-class craft. Concept: «ذهب ← وزن ← عقد» — the bar becomes the units,
the units become the contract.

Every shot is made out of the previous one:
  - the logo becomes a gold bar;
  - the bar becomes bands carrying the question;
  - the bands flood the frame;
  - the headline breaks into four shapes;
  - the ounce circle is sliced into strips, the strips into type, the circles into bars;
  - the karat ring folds into the mithqal hexagon;
  - 100 coins stack from 2D slices into a 3D cylinder, then a cone, then one coin;
  - the coin becomes P/L lanes;
  - the summary's shapes return, and the film ends on the same gold bar it began with.
Fields change only through masks: slats, vertical bars, a hexagon, a contracting circle. There are no cuts and no crossfades.

Typeface: Readex Pro (Arabic, the brand's Arabic face) in bold for kinetic type, with Inter 800 for numbers and tokens
(brand rule: Western digits in the Latin font).
Palette: 3 colours + black and white, all flat, with no gradients:
  - gold #D9A43B (series accent);
  - slate #607880 (brand);
  - Axi red #E4002E (≤10%, losses and warnings only);
  - ink #090A0D, frosted paper #EEF0F1, white;
  - mint #5EE0BB only for a gain bar.
Camera: one language — a locked frontal camera. Objects move; the frame does not.

Range, each with a fair share of the time:
  - kinetic type: words assembled from horizontal slices sliding in from alternate sides;
  - shape morphing: ○ □ ⬡ ≡ and circles → bars → ring → hexagon;
  - 2D → 3D: the 100-coin lot;
  - data/UI: the karat ring, the Market Watch → Specification window, the P/L lanes, the spread lines, the 24-hour swap dial;
  - end title: the summary, then the X sting.

Banned: particle bursts, glows, lens flares, camera shake, RGB split, crossfades, gradients (except the brand open and
close), bouncy easing (exponential and critically damped only), and still frames — a beat clock ticks top-left the whole time.
</direction>

<structure>
120 BPM (beat = 0.5 s; the grid starts at 00:01.00). Every entrance lands on the next 8th note after its word. There is a
kick on every beat from the first word to the X, a hit on every field change, and a riser into the strongest bar (the summary).

00:00.00–00:02.05  Brand open: white logo on the primary gradient; it becomes a vertical gold bar.
00:02.05  HOOK — the bar turns flat (beat 1) and grows into a band:
          - «شكد لوت واحد» slices in word by word (00:02.25–00:02.75);
          - a second band sweeps in: «يساوي من الذهب؟» (00:03.50–00:04.25);
          - 00:04.50: both bands flood the frame gold (hit, music L4).
00:05.00  THE FOUR NUMBERS (gold) — «بهذا الدرس» · «أرقام الذهب»:
          - the headline breaks into ○ أونصة (00:07.75) · □ غرام (00:08.50) · ⬡ مثقال (00:09.25) · ≡ لوت (00:10.25);
          - «العقد» (00:11.75).
00:12.25  OUNCE (paper) — the gold contracts into a ring around the ounce:
          - «سعر الذهب العالمي», «$», «USD», «دولار لكل أونصة»;
          - a gold marker steps round the ounce on every beat.
00:16.25  TROY:
          - the ounce is sliced into strips that fly apart: «الأونصة المستخدمة بالذهب» → «أونصة تروي» (00:18.25),
            pin «مدينة تروا · فرنسا»;
          - circles: 31.1 g gold (00:22.50) vs 28.35 g slate (00:27.00);
          - they morph into bars: «≈ +10%» · «أثقل» (00:30.00);
          - dividing flips the bars — «سعر الغرام ÷ 28.35» gets red «أغلى من الحقيقة» (00:35.25), «÷ 31.1» gets «الصحيح».
00:36.00  KARAT (slats → slate) — «العيار»:
          - 24 ring segments fill gold, counter 24 (00:38.75);
          - «عيار 24 ≈ ذهب نقي»;
          - three segments empty on the beat → 21 · «87.5%» (00:44.00).
00:46.10  MITHQAL (hexagon mask → paper):
          - a gold hexagon, «السوق العراقي»;
          - five gram squares land on 8ths → «5 غرامات»;
          - «وبدول ثانية ممكن يختلف».
00:52.05  WORKED EXAMPLE (slats → gold), «مثال تعليمي افتراضي»:
          - ○ $4,000 → ÷31.1 → □ $128.60 → ×5×87.5% → ⬡ ≈ $563;
          - «قيمة الذهب نفسه بس» · red «مو سعر المحل»;
          - the jeweller's stack: قيمة الذهب + المصنعية + ربح التاجر = سعر المحل;
          - «نوع الذهب» · «سعر صرف الدولار بالدينار» USD/IQD.
01:16.75  PART TWO (vertical bars → ink) — «الجزء الثاني» · «عقد الذهب» (L4):
          - XAUUSD (01:20.00), with brackets XAU = «الذهب», USD = «الدولار»;
          - GOLD (01:25.50);
          - suffixes on the beat: .a · m · . · .pro;
          - CFD (01:29.75) «عقد على فرق السعر»;
          - a gold bar struck in red: «مو شراء ذهب حقيقي».
01:33.50  UI (slats → paper) — a flat Market Watch window:
          - cursor, right-click on XAUUSD (01:35.25), menu → «المواصفات» (01:38.75);
          - the Specification panel: حجم العقد 100 · أقل حجم 0.01 · عدد الخانات 2 · السواب · الهامش · الجلسات,
            each lit on its word.
01:48.25  THE LOT (2D → 3D):
          - «عند هواية من الوسطاء»;
          - 100 coin slices land bottom → top, the 100th on «100» (01:50.00);
          - the stack tilts open into a 3D cylinder (impact, L4);
          - «يختلف حسب الوسيط ونوع الحساب»;
          - it narrows into a cone while the count rolls «≈ 622 مثقال ذهب نقي» (01:56.50);
          - it collapses to one gold coin: «0.01 لوت = أونصة وحدة».
02:02.15  P/L LANES:
          - the coin seen from above, «+$1»;
          - lanes 0.01 / 0.1 / 1 lot, each with a red loss bar and a mint gain bar, ±$1 / ±$10 / ±$100;
          - «الخسارة تكبر مع حجم اللوت» · «مثل الربح».
02:15.75  COSTS (slats → slate):
          - Bid/Ask lines with «السبريد»; the gap changes on the beat and widens on «وقت الأخبار»;
          - the spec row «السبريد · متغيّر»;
          - Market Watch: right-click → «الأعمدة» → «السبريد» ✓, the column slides in;
          - 4,012.35 with the last digit boxed = «النقطة أصغر خانة بالسعر»;
          - «30 نقطة = $0.30 للأونصة»;
          - «عمولة» · «ومقدارها بموقع الوسيط».
02:46.75  SWAP (bars → ink):
          - «السواب»: a 24-hour dial whose hand steps on every beat and lands on «التجديد اليومي»;
          - «ينخصم منك» / «ينضاف لك»; buy ≠ sell bars;
          - «حساب بدون سواب» · «بشروط» · «أو رسوم بديلة»;
          - «أي سؤال ديني؟ اسأل العلماء المختصين».
03:05.75  SUMMARY — the strongest bar (riser → hit, L4, gold):
          - ○ أونصة تروي 31.1 g · ⬡ مثقال عراقي 5 g · ≡ لوت 100 oz · ▤ راجع المواصفات عند وسيطك.
03:17.00  NEXT (paper):
          - a clock with a beat-stepping hand, «بتوقيت بغداد»;
          - «الدرس الجاي»;
          - the free written guide, with an arrow down.
03:26.00  Everything gives way to the vertical gold bar — the same frame as 00:02.05, so the body loops.
03:26.56  X sting → «تعلّم ثم تعلّم ثم تدرّب ثم تداول.» → «تعلّم مع Axi» → risk strip for the last 3 s (to 03:31.56).
</structure>

<build>
1. One HTML canvas at 1920x1080. Every frame is a pure function of t; there is no state carried between frames.
2. Exponential and critically damped easing written as functions of time. Motion blur from 6 sub-frames inside a 0.75/60 s
   shutter, so blur follows each object's own speed and direction.
3. Shapes are 360 points sampled at the same angles, so any shape morphs into any other by interpolation. Bars switch to
   exact rectangles once a morph lands.
4. The 3D stack is painted bottom → top as ellipse discs. Tilt 0 gives flat slices; tilt 0.34 gives the 3D cylinder.
5. Soundtrack written in code:
   - 120 BPM, G minor (Gm9 · Ebmaj9 · Bbmaj7 · F6/9);
   - a kick on every beat, claps, hats, bass, FM plucks, off-beat chord stabs, and 16th arps on the big moments;
   - a riser into the summary and a hit on every field change: 198 cues.
   The bed is ducked about 60% under the voice. Delivered bed: −25.4 LUFS. Reference with the voice: −18.3 LUFS, −1.0 dBTP.
   → In the final mix, master to −14 LUFS with a true-peak limit of −1 dBTP.
6. Render with headless Chromium at 60 fps, H.264 CRF 15, AAC 320 kbps.
7. Before the full render, one frame per bar (103 frames) was rendered and reviewed. Fixes from that pass:
   - the clipped bar corners;
   - two overlapping captions;
   - a held empty beat before the lot;
   - a sign-order bug in «≈ $563».
</build>

<start>
The concept and the bar-by-bar storyboard are above; the film was built straight from them. Four stills are in `stills/`.
</start>
```

## Information check

Every claim in the narration was checked:
- **Troy ounce:** 31.1035 g; ordinary (avoirdupois) ounce 28.3495 g. The troy ounce is about 9.7% heavier, so «about 10%» is correct. The name is commonly traced to Troyes, France.
- **Karat:** parts of gold in 24. 24k is (nearly) pure gold; 21k = 21/24 = 87.5%.
- **Mithqal:** 5 g is the Iraqi gold-market convention. Other countries use other weights, so «it may differ» is correct.
- **Worked example (hypothetical, labelled):** $4,000 ÷ 31.1035 = $128.60 per gram of pure gold. A 21k mithqal is 5 g × 87.5% × $128.60 = $562.6, so «≈ $563» is correct. The shop price adds workmanship and the merchant's margin, and depends on the type of gold and the USD/IQD rate.
- **Symbol:** XAUUSD = gold vs the US dollar. Some brokers name it GOLD or add a suffix letter or dot. It trades as a CFD (contract for difference), not physical gold.
- **MT5 desktop:** right-click the symbol in Market Watch → Specification shows the contract size, minimum volume, digits, swap, margin and sessions.
- **Lot size:** many brokers set 1 lot = 100 oz, but it depends on the broker and account type.
  - 100 oz × 31.1035 g = 3,110 g ÷ 5 g = 622 Iraqi mithqals of pure gold.
  - 0.01 lot = 1 oz.
  - A $1 move ≈ $1 P/L on 0.01 lot and ≈ $100 on 1 lot. Losses scale exactly like profits.
- **Spread and points:**
  - The spread varies by broker and can widen around news. The specification may show it as «floating».
  - The live spread column is enabled via Market Watch → right-click → Columns.
  - A point is the smallest price digit. With 2 decimals, 30 points = $0.30 per ounce.
- **Commission:** some accounts charge a commission; the amount is on the broker's site.
- **Swap:**
  - It is applied to open positions at the broker's daily rollover, can be charged or credited, and differs for buy and sell.
  - Some brokers offer swap-free accounts, sometimes with conditions or alternative fees.
  - Religious questions → qualified scholars.
- **On-screen quotes** (4,012.35 etc.) are illustrative UI dressing, not live prices. The Market Watch window is a generic flat mock-up, with no third-party logo.
