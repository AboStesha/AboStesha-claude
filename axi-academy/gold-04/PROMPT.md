# Gold series · Lesson 04 (finale) — «أوقات الذهب» · adapted prompt

This is the reference prompt (*Prompt Motion 7*) adapted for Axi Academy's last gold lesson. The original prompt:

> make a dynamic motion graphics video that shows what an incredible motion designer you are, like it's your showreel for a résumé. go all out. it should be a educational lessons saas video for https://www.axi.com/ar

The reference answers it as a 15-second SaaS launch film. Its grammar, used here for a 4:20 lesson:
- a long input typed on a night grid with a red caret;
- the input squashes into a glowing streak, a flash, then a short pill;
- a cursor click with a tinted ripple and radar rings;
- a dotted globe rising from the bottom with a glowing rim, live pings and a huge odometer counter;
- a 3D-tilted dashboard card with tabs and an area chart;
- notification toasts;
- an orbit network;
- a one-word-per-screen montage with a page counter, a bracket label and a progress line;
- a light end card with two buttons.

The film is synced word by word to `lesson_4.wav` (Iraqi dialect, 119 phrases, 524 words). The voice-over is **not** in the master; place it at **00:02.00**. All times are video time, `MM:SS.cc`.

**Concept (one line):** «الساعة بتوقيت بغداد» — every number in the lesson is a clock that rolls into Baghdad time.

```xml
<direction>
Make a dynamic motion-graphics lesson that shows what an incredible motion designer you are — a SaaS launch film for
Axi Academy (axi.com/ar), gold series finale «أوقات الذهب». Go all out, but every frame teaches.

Night-grid base (#101114 → #08090B, vertical gradient, 80 px grid). Gold #E2B04A is the series accent; Axi red #E4002E
only for the caret, pings, losses and warnings (≤10%); mint never appears (no gains in this lesson); the brand end card
is light. Readex Pro for Arabic (on-screen text in simplified MSA; the series title keeps its name), Inter for numbers and
tokens. The Axi logo stays top-right and the X bottom-left at 60%; no third-party logos (COMEX and MetaTrader appear as
plain text only).

Camera: locked. UI elements spring in (critically damped / soft overshoot) and every number is a digit wheel that rolls,
so «converting to Baghdad time» is always a visible roll. The only things that snap are the price gap and the cuts of the
montage.
</direction>

<structure>
124 BPM (A minor). Music grid starts 2 beats before 00:02.00.

00:00.00  Brand open: white logo on the primary gradient → night falls → the logo becomes the red caret.
00:02.05  HOOK — «الذهب يُتداول تقريباً على مدار الساعة،» types out of the caret; it rises, and 24 hourly bars grow
          under it (Baghdad time, labelled illustrative; 15–19 glow gold) — «بس مو كل ساعاته مثل بعض».
00:07.09  «إذن» squashes line + bars into a gold streak that shrinks back into the caret; the question types:
          «متى يتحرك الذهب فعلاً؟» («الذهب» gold).
00:09.67  The question squashes into a streak → flash → the pill «أوقات الذهب».
00:10.60  Cursor click: gold-tinted ripple, radar rings, sparks; badge «الدرس الأخير · 04 / 04».
00:11.13  The pill rises to the top; agenda tabs: 01 أوقات الذهب · بتوقيت بغداد (00:12.54) · 02 الأخبار (00:15.59)
          · 03 الأخطاء الشائعة (00:16.36). The globe starts rising.
00:18.65  THE GLOBE — Baghdad ping; odometer «GMT+0» rolls to «GMT+3» (00:20.64); «ثابت طوال السنة» (00:21.36);
          toast «التوقيت الصيفي · غير مطبّق في العراق بعد عام 2007» (00:22.28).
00:25.6   The globe turns west: New York (00:26.18) and London (00:26.87) pings, «±1h» badges, DST windows
          «آذار ← تشرين الثاني / تشرين الأول» (00:28.68), open times in Baghdad time 15:00 / 10:00 (00:30.80) roll +1 h
          (00:31.64).
00:32.84  Year panel: two DST lanes (US, UK), the mismatch weeks glow gold, «≈ 3–4 أسابيع بالسنة»; chips «غيّرت»
          (00:36.19) / «لم تغيّر» (00:37.75).
00:38.36  A gold great-circle arc London ↔ New York; the counter rolls 5 → 4 «ساعات» (00:40.61), «بدلاً من 5» struck (00:41.84).
00:42.68  COMEX CARD (3D tilt) — «عقود الذهب المستقبلية · COMEX · بورصة المعادن الأمريكية»; the week chart is an area
          chart whose plateau is «market open»: Sunday 18:00 → Friday 17:00 New York time (00:47.87–00:52.47), four
          daily one-hour dips (00:53.89); toast «العطل الرسمية · الجدول يتغير» (00:55.39).
00:58.16  Tab «بغداد · صيفي»: the plateau slides +7 h; stats roll in on their words — Monday 01:00 (01:03.46),
          00:00–01:00 (01:06.31), Saturday 00:00 (01:11.07).
01:13.21  Tab «بغداد · شتوي»: everything rolls +1 h (01:14.19) — 02:00 · 01:00–02:00 · 01:00.
01:21.44  Stamp «للعقود المستقبلية فقط».
01:23.20  The card flips into a generic MT5-style «Specification — XAUUSD» window: CFD · MetaTrader 5 · Sessions bars;
          two ghost windows fan out «وسيط 2 / وسيط 3» (01:27.80); the camera pushes in; the cursor clicks «Sessions»
          (01:30.58) and «Specification» (01:31.64); «وقت السيرفر GMT+2» (01:34.02) → «بغداد GMT+3» axis (01:35.31) →
          the bars and labels roll +1 h (01:36.25), labelled «مثال».
01:37.73  SESSIONS DIAL — a 24-hour dial (00 at the top) around a small globe; «تقسيم شائع، غير رسمي · أوقات تقريبية»;
          Asia 03:00–12:00 (01:44.34) «طوال السنة»; London 10:00–19:00 and New York 15:00–00:00 (01:50.30); the overlap
          sector lights gold: «4 ساعات · 15:00–19:00» (01:53.40); switch to winter: 16:00–20:00 (01:58.56); mismatch weeks:
          New York rolls back, the sector grows: «5 ساعات · 15:00–20:00» (02:04.43).
02:05.7   THE TABLE (the narration says «بجدول على الشاشة»): «أوقات الذهب بتوقيت بغداد», columns الصيفي / الشتوي —
          sessions, overlap, CPI · jobs, FOMC; footnote «في أسابيع اختلاف التوقيت يصبح التداخل 5 ساعات · الأوقات
          تقريبية · التفاصيل في الدليل المكتوب».
02:10.89  NEWS — the table moves left; twin clocks نيويورك / بغداد; toasts «مؤشر أسعار المستهلك» (02:12.96),
          «تقرير الوظائف» (02:14.44): 08:30 New York (02:16.42) → 15:30 Baghdad (02:19.40); «قرار الفدرالي»
          (02:22.25): 14:00 → 21:00 (02:28.26); «كلها تتأخر ساعة في التوقيت الشتوي»: every time rolls +1 h (02:29.77).
02:33.37  EXECUTION CARD (3D tilt, «مثال توضيحي») — tabs انزلاق سعري · فارق السعر · فجوة سعرية: «السعر المعروض» vs
          «سعر التنفيذ» → bracket «انزلاق سعري» (02:40.68); Bid/Ask band widens, spread 0.20 → 1.80 (02:44.90); the gap:
          the price odometer SNAPS 4,012.40 → 4,031.80 with the skipped prices struck out (02:48.26), «دون المرور
          بالأسعار بينهما»; toasts: الأخبار الكبيرة · بعد إغلاق العطل · نهاية الأسبوع.
02:57.41  SUMMARY — orbit network around «بغداد · GMT+3»: «بغداد ثابتة.»; London, New York, US news carry «±1h» chips,
          the Asian session «ثابتة»; a summer/winter switch flips (03:06.49).
03:09.67  MONTAGE (cuts on the words, page counter 0n / 04): intro «4 أخطاء شائعة» on a flickering gold square field;
          01 paper «خلط الوحدات.» (أونصة ≠ غرام ≠ مثقال shuffle); 02 gold «حجم العقد.» ($1 ← ≈ $100 على لوت كامل,
          «لدى كثير من الوسطاء»); 03 black outline ««الملاذ الآمن»» + «يعني أن الذهب لا ينخفض؟» and a falling red line;
          04 slate «أرباح مضمونة؟ · سبائك أرخص بكثير من السوق؟» struck → red pill «علامات احتيال» (03:38.15).
03:40.26  SERIES COMPLETE — «سلسلة شلون تتداول الذهب»: four lesson cards tick ✓, the bar fills to 100%, «من أكاديمية آكسي».
03:45.00  The free written guide (a paper card) + «تحت الفيديو» arrow; its questions tick; a readiness ring rolls to 100%.
03:53.09  «وتذكّر دائماً: التداول بالرافعة المالية ينطوي على مخاطر» («مخاطر» red); the capital bar loses «جزء منه» then
          «أو كلّه».
04:00.01  «نتمنى لكم كل التوفيق والنجاح،»; a locked card rises: «سلسلة جديدة للمحترفين · قريباً · من أكاديمية آكسي».
04:07.69  The farewell repeats in the voice file → a recap montage: 01 · 02 · 03 · 04 (paper / gold / outline / slate),
          then «قريباً · للمحترفين» (04:12.24); it squashes into the streak → the red caret (04:14.43).
04:15.31  X sting out of the caret → light end card «تعلّم ثم تعلّم ثم تدرّب ثم تداول.» + «تعلّم مع Axi» + «axi.com/ar»
          → risk strip for the last 3 s (to 04:20.31).
</structure>

<build>
1. One HTML canvas at 1920x1080; every frame is a pure function of t. Motion blur from 6 sub-frames inside a 0.75/60 s shutter.
2. Digit wheels for every number: each digit rolls through the digits between its old and new value (or snaps, for the gap).
3. The globe is ~14k dots on a 1.7° lat/long grid (land blobs bright, ocean faint), orthographic, batched by brightness;
   great-circle arcs are lifted off the surface.
4. Tilted cards are offscreen canvases warped in 48 perspective strips.
5. Soundtrack in code: 124 BPM, A minor (Am9 · Fmaj9 · Cadd9 · G6), kick on every beat from the click, claps, hats, octave
   bass, off-beat stabs, glass plucks, 16th arps on the globe / overlap / montage / recap; typing ticks, whooshes, pops,
   ripples, slams and the sting: 261 cues. The bed is ducked about 60% under the voice. Delivered bed: −25.4 LUFS.
   Reference with the voice: −18.8 LUFS, −1.0 dBTP. → In the final mix, master to −14 LUFS with a −1 dBTP limit.
6. Render with headless Chromium at 60 fps, H.264 CRF 15, AAC 320 kbps.
7. Review passes before the full render fixed: the pill's missing word gap, a one-direction spark burst, an empty second
   before the table, the hidden overlap sector, toggle labels on the wrong sides, the price gap appearing late, the RTL
   arrow direction, empty montage beats (ordinal kickers added), and dialect captions rewritten in simplified MSA.
</build>

<start>
The concept and the storyboard are above; the film was built straight from them. Four stills are in `stills/`.
</start>
```

## Information check

Every time and claim in the narration was checked:
- **Iraq:** UTC+3 (Arabia Standard Time) all year. Iraq last observed DST in 2007, so «no DST after 2007» is correct.
- **DST dates:**
  - US: 2nd Sunday of March → 1st Sunday of November.
  - UK: last Sunday of March → last Sunday of October.
  - So the two are out of step for about 2–3 weeks in spring and 1 week in autumn: «3–4 weeks a year» is correct.
  - London–New York is 5 h normally and 4 h in those weeks.
- **COMEX gold futures (GC, CME Globex):** Sunday–Friday, 6:00 p.m.–5:00 p.m. New York time, with a 60-minute break each day from 5:00 p.m. Holiday schedules change.
- **In Baghdad time:**
  - US summer (EDT, UTC−4, +7 h): weekly open Monday 01:00; daily break 00:00–01:00; weekly close Friday→Saturday 00:00.
  - US winter (EST, UTC−5, +8 h): 02:00; 01:00–02:00; 01:00.
- **Gold CFD on MT5:** it follows the broker's own schedule. Specification → Sessions lists quote/trade sessions in server time. The server GMT+2 → Baghdad +1 h case on screen is labelled as an example.
- **Sessions:** conventional and approximate, local 8:00–17:00 for London/New York and 9:00–18:00 for Tokyo (UTC+9, no DST).
  - Asia: 03:00–12:00 Baghdad, all year.
  - London: 10:00–19:00 summer / 11:00–20:00 winter.
  - New York: 15:00–00:00 / 16:00–01:00.
  - Overlap: 15:00–19:00 / 16:00–20:00, and 15:00–20:00 (5 h) in the mismatch weeks.
- **US data:**
  - CPI and the Employment Situation report are released at 8:30 a.m. New York time = 15:30 Baghdad in US summer / 16:30 in winter.
  - The FOMC statement is at 2:00 p.m. = 21:00 / 22:00.
- **Execution:** in fast or thin markets the fill can differ from the shown price (slippage). Spreads can widen and prices can gap around big news, after holiday closures and over the weekend.
- **Mistakes:**
  - Ounce / gram / mithqal are different units.
  - At 100 oz per lot (common, broker-dependent), $1 per ounce ≈ $100 per full lot.
  - A safe haven can still fall.
  - Guaranteed profits or bars far below market are known scam signs.
- **On-screen prices** (4,012.40 etc.), the activity bars and the MT5 window are illustrative mock-ups with no third-party marks.
