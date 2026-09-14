#!/usr/bin/env python3
# Build index_ar.html from index.html by exact, asserted replacements.
import sys, re
src = open(sys.argv[1], encoding='utf-8').read()
out = src
def R(old, new, n=1):
    global out
    c = out.count(old)
    assert c == n, f"expected {n} got {c}: {old[:70]!r}"
    out = out.replace(old, new)

# ---------- document / fonts / CSS ----------
R('<html lang="en">', '<html lang="ar" dir="rtl">')
R('<title>Budoor Signature — The Release Moment</title>', '<title>بدور سيجنتشر — لحظة الإطلاق</title>')
R('family=Michroma&display=swap', 'family=Michroma&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap')
R("html,body{background:#222;font-family:'Inter',Helvetica,Arial,sans-serif;",
  "html,body{background:#222;font-family:'IBM Plex Sans Arabic','Inter',Helvetica,Arial,sans-serif;")
R('.hdr h1{font-size:44px;font-weight:700;letter-spacing:-.02em;line-height:1}',
  '.hdr h1{font-size:44px;font-weight:700;letter-spacing:0;line-height:1.25}')
R('.hdr h1 small{display:block;font-size:15px;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:var(--gold);margin-bottom:14px}',
  '.hdr h1 small{display:block;font-size:16px;font-weight:600;letter-spacing:0;color:var(--gold);margin-bottom:12px}')
R('.ftr b{color:var(--ink);font-weight:700;margin-right:22px}', '.ftr b{color:var(--ink);font-weight:700;margin-inline-end:22px}')
R('.kicker{font-size:13px;letter-spacing:.34em;text-transform:uppercase;color:var(--gold);font-weight:600}',
  '.kicker{font-size:16px;letter-spacing:0;color:var(--gold);font-weight:600}')
R('.lead{font-size:26px;line-height:1.4;', '.lead{font-size:26px;line-height:1.6;')
R('.body{font-size:19px;line-height:1.5;', '.body{font-size:19px;line-height:1.7;')
R('.pill{display:inline-block;border:1px solid var(--gold);color:var(--gold);border-radius:100px;padding:6px 16px;font-size:13px;letter-spacing:.2em;text-transform:uppercase;font-weight:600}',
  '.pill{display:inline-block;border:1px solid var(--gold);color:var(--gold);border-radius:100px;padding:6px 18px;font-size:14px;letter-spacing:0;font-weight:600}')
R('.hero-txt h2{font-size:104px;font-weight:800;letter-spacing:-.03em;line-height:.92;color:#fff}',
  '.hero-txt h2{font-size:100px;font-weight:700;letter-spacing:0;line-height:1.18;color:#fff}')
R('.hero-txt h2 span{display:block;font-size:20px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:var(--gold2);margin-bottom:22px;',
  '.hero-txt h2 span{display:block;font-size:22px;font-weight:600;letter-spacing:0;color:var(--gold2);margin-bottom:18px;')
R('.hero-txt p{width:520px;font-size:22px;line-height:1.45;color:#e8e8e8}', '.hero-txt p{width:560px;font-size:22px;line-height:1.65;color:#e8e8e8}')
R('.beat .t h3{font-size:26px;font-weight:700;letter-spacing:-.01em}', '.beat .t h3{font-size:26px;font-weight:700;letter-spacing:0}')
R('.beat .t .tc{margin-left:auto;font-size:13px;letter-spacing:.2em;color:var(--mute);font-variant-numeric:tabular-nums}',
  '.beat .t .tc{margin-inline-start:auto;font-size:13px;letter-spacing:.12em;color:var(--mute);font-variant-numeric:tabular-nums;direction:ltr;unicode-bidi:isolate}')
R('.beat p{font-size:18px;line-height:1.5;color:var(--ink2)}', '.beat p{font-size:18px;line-height:1.65;color:var(--ink2)}')
R('.beat .cue{margin-top:auto;padding-top:16px;border-top:1px solid var(--line);font-size:14px;line-height:1.5;color:var(--ink)}',
  '.beat .cue{margin-top:auto;padding-top:16px;border-top:1px solid var(--line);font-size:14px;line-height:1.6;color:var(--ink)}')
R('.beat .cue b{color:var(--gold);letter-spacing:.14em;text-transform:uppercase;font-size:12px;margin-right:8px}',
  '.beat .cue b{color:var(--gold);letter-spacing:0;font-size:13px;margin-inline-end:8px}')
R('.beats4 .beat .t h3{font-size:20px;white-space:nowrap}', '.beats4 .beat .t h3{font-size:21px;white-space:nowrap}')
R('.beats4 .beat p{grid-column:2;font-size:14.5px;line-height:1.45}', '.beats4 .beat p{grid-column:2;font-size:14.5px;line-height:1.6}')
R('.beats4 .beat .cue{grid-column:2;font-size:12px;padding-top:10px;margin-top:12px;align-self:end}',
  '.beats4 .beat .cue{grid-column:2;font-size:12.5px;line-height:1.5;padding-top:10px;margin-top:12px;align-self:end}')
R('.scr .wall .cap{margin-top:18px;font-size:14px;color:var(--mute);letter-spacing:.06em}', '.scr .wall .cap{margin-top:18px;font-size:14px;color:var(--mute);letter-spacing:0}')
R('.scr .wall .viral .box{border-left:3px solid var(--gold);padding-left:20px}', '.scr .wall .viral .box{border-inline-start:3px solid var(--gold);padding-inline-start:20px}')
R('.scr .wall .viral h4,.spec h4{font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--gold);font-weight:700;margin-bottom:10px}',
  '.scr .wall .viral h4,.spec h4{font-size:15px;letter-spacing:0;color:var(--gold);font-weight:700;margin-bottom:10px}')
R('.scr .wall .viral p{font-size:17px;line-height:1.45;', '.scr .wall .viral p{font-size:17px;line-height:1.6;')
R('.spec li{font-size:17px;line-height:1.45;', '.spec li{font-size:17px;line-height:1.6;')
R('.spec li em{font-style:normal;color:var(--ink);font-weight:600;min-width:120px}', '.spec li em{font-style:normal;color:var(--ink);font-weight:600;min-width:130px}')
R('th{font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:var(--mute);font-weight:600;text-align:left;padding:0 18px 18px 0;border-bottom:1px solid var(--ink)}',
  'th{font-size:14px;letter-spacing:0;color:var(--mute);font-weight:600;text-align:start;padding:0 0 18px 0;padding-inline-end:18px;border-bottom:1px solid var(--ink)}')
R('td{padding:26px 18px 26px 0;border-bottom:1px solid var(--line);font-size:19px;line-height:1.4;',
  'td{padding:26px 0;padding-inline-end:18px;border-bottom:1px solid var(--line);font-size:19px;line-height:1.55;')
R('.rules h4{font-size:21px;font-weight:700;margin-bottom:8px;letter-spacing:-.01em}', '.rules h4{font-size:21px;font-weight:700;margin-bottom:8px;letter-spacing:0}')
R('.rules p{font-size:16px;line-height:1.5;', '.rules p{font-size:16px;line-height:1.65;')
R('</style>', '  .ltr{direction:ltr;unicode-bidi:isolate}\n  .hoe.ar{letter-spacing:0;font-size:15px;font-weight:500;text-transform:none}\n  .lat{font-family:\'Inter\',Helvetica,Arial,sans-serif}\n</style>')

# ---------- repeated chrome ----------
R('<div class="ftr"><div><b>Budoor Signature</b>Stage Release Concept</div>', '<div class="ftr"><div><b>بدور سيجنتشر</b>مفهوم الإطلاق على المسرح</div>', 12)
R('<small>The moment, beat by beat</small>', '<small>اللحظة، مشهدًا بمشهد</small>', 0)  # no-op guard
R('The moment, beat by beat</h1>', 'اللحظة، مشهدًا بمشهد</h1>', 3)
R('What the wall shows</h1>', 'ما يعرضه الجدار</h1>', 3)
R('<h4>The viral shot</h4>', '<h4>اللقطة التي ستنتشر</h4>', 3)
R('<h4>The brand link</h4>', '<h4>الربط بالعلامة</h4>', 3)
R('<div><h4>Props</h4><ul>', '<div><h4>الأدوات</h4><ul>', 2)
R('<div><h4>Screen</h4><ul>', '<div><h4>الشاشة</h4><ul>', 3)
R('<div><h4>Difficulty</h4><ul>', '<div><h4>الصعوبة</h4><ul>', 3)
R('<li><em>Style</em>', '<li><em>الأسلوب</em>', 3)
R('<li><em>Reveal</em>', '<li><em>الكشف</em>', 2)
R('<li><em>Audio</em>', '<li><em>الصوت</em>', 3)
R('<li><em>Performer</em>', '<li><em>المؤدّي</em>', 2)
R('<li><em>Risk</em>', '<li><em>المخاطرة</em>', 3)
R('<div class="cue"><b>Sync</b>', '<div class="cue"><b>المزامنة</b>', 11)
R('<h3>The water</h3>', '<h3>الماء</h3>', 2)
R('<div style="position:absolute;right:120px;top:88px" class="hoe">House <i>of</i> Experience</div>',
  '<div style="position:absolute;left:120px;top:88px" class="hoe">House <i>of</i> Experience</div>', 3)
R('<div style="position:absolute;left:120px;top:88px" class="hoe">Concept 01</div>', '<div style="position:absolute;right:120px;top:88px" class="hoe ar">المفهوم 01</div>')
R('<div style="position:absolute;left:120px;top:88px" class="hoe">Concept 02</div>', '<div style="position:absolute;right:120px;top:88px" class="hoe ar">المفهوم 02</div>')
R('<div style="position:absolute;left:120px;top:88px" class="hoe">Concept 03</div>', '<div style="position:absolute;right:120px;top:88px" class="hoe ar">المفهوم 03</div>')

# ---------- 01 cover ----------
R('<div style="position:absolute;right:120px;top:88px" class="hoe">Creative Proposal &nbsp;·&nbsp; Main Stage Screen</div>',
  '<div style="position:absolute;right:120px;top:88px" class="hoe ar">مقترح إبداعي &nbsp;·&nbsp; شاشة المسرح الرئيسي</div>')
R('<div class="kicker" style="color:var(--gold2);margin-bottom:26px">Budoor Signature &nbsp;·&nbsp; Official Project Reveal</div>',
  '<div class="kicker" style="color:var(--gold2);margin-bottom:22px;font-size:20px">بدور سيجنتشر &nbsp;·&nbsp; الكشف الرسمي عن المشروع</div>')
R('<h1 style="font-size:124px;font-weight:800;letter-spacing:-.035em;line-height:.9;color:#fff">The Release<br>Moment</h1>',
  '<h1 style="font-size:124px;font-weight:700;letter-spacing:0;line-height:1.15;color:#fff">لحظة<br>الإطلاق</h1>')
R('<p style="margin-top:34px;font-size:24px;line-height:1.4;color:#e6e6e6;max-width:820px">Three stage-and-screen illusions for the main LED wall, where a live performer and a pre-rendered film become one impossible moment.</p>',
  '<p style="margin-top:30px;font-size:24px;line-height:1.65;color:#e6e6e6;max-width:820px">ثلاث خدع بصرية تجمع المسرح بالشاشة على جدار LED الرئيسي، حيث يتحوّل مؤدٍّ حيّ وفيلم مُعدّ مسبقًا إلى لحظة واحدة مستحيلة.</p>')
R('<div style="text-align:right;color:#fff">\n      <div class="wm" style="font-size:54px">BUDOOR<small>Signature</small></div>\n      <div style="margin-top:44px;font-size:14px;line-height:1.9;color:#bdbdbd;letter-spacing:.06em">\n        <div><span style="color:#7d7d7d">Client</span>&nbsp;&nbsp; Budoor Baghdad</div>\n        <div><span style="color:#7d7d7d">Event</span>&nbsp;&nbsp; Real Estate Launch &nbsp;·&nbsp; 28 Aug 2026</div>\n        <div><span style="color:#7d7d7d">Placement</span>&nbsp;&nbsp; Main stage curved LED wall</div>',
  '<div style="text-align:left;color:#fff">\n      <div class="wm" dir="ltr" style="font-size:54px;display:inline-block">BUDOOR<small>Signature</small></div>\n      <div style="margin-top:44px;font-size:15px;line-height:2;color:#bdbdbd;letter-spacing:0;text-align:right">\n        <div><span style="color:#7d7d7d">العميل</span>&nbsp;&nbsp; بدور بغداد</div>\n        <div><span style="color:#7d7d7d">الفعالية</span>&nbsp;&nbsp; إطلاق مشروع عقاري &nbsp;·&nbsp; 28 آب 2026</div>\n        <div><span style="color:#7d7d7d">الموضع</span>&nbsp;&nbsp; جدار LED المنحني للمسرح الرئيسي</div>')

# ---------- 02 brief ----------
R('<small>01 — The brief</small>One screen. One performer. One moment.</h1>', '<small>01 — الموجز</small>شاشة واحدة. مؤدٍّ واحد. لحظة واحدة.</h1>')
R('The marked area: the 25 m curved LED wall and centre logo piece of the main stage. Everything on this wall is a pre-rendered film.',
  'المنطقة المحدّدة: جدار LED المنحني بطول 25 مترًا وقطعة الشعار في منتصف المسرح الرئيسي. كل ما يُعرض على هذا الجدار فيلم مُعدّ مسبقًا.')
R('Opening &amp; AI MC</div>', 'الافتتاح ومقدّم الحفل بالذكاء الاصطناعي</div>')
R('CEO keynote</div>', 'كلمة الرئيس التنفيذي</div>')
R('08:12 · 5 MIN</div>', '08:12 · 5 دقائق</div>')
R('Official Project Reveal</div></div>', 'الكشف الرسمي عن المشروع</div></div>')
R('Project presentation</div>', 'عرض المشروع</div>')
R('<p class="lead">At 08:12 PM the agenda says <b>“Official Project Reveal — cinematic reveal video with immersive light &amp; sound.”</b> We propose to make that video the most talked-about five minutes of the night.</p>',
  '<p class="lead">في تمام الساعة 08:12 مساءً يقول جدول الفعالية: <b>«الكشف الرسمي عن المشروع — فيديو كشف سينمائي مع إضاءة وصوت غامرَين».</b> نقترح أن نجعل هذا الفيديو أكثر خمس دقائق يتحدّث عنها الحضور في تلك الليلة.</p>')
R('<b style="color:var(--ink)">What it is.</b> A film plays on the wall. A performer on stage has rehearsed to it frame by frame, so the screen appears to answer their hands: a line follows a pen, water pours into a picture, a cloth reveals what is behind it.',
  '<b style="color:var(--ink)">ما هي الفكرة.</b> يُعرض فيلم على الجدار، وقد تدرّب مؤدٍّ على المسرح عليه إطارًا بإطار، فتبدو الشاشة وكأنها تستجيب ليديه: خطٌّ يتبع قلمًا، وماءٌ يُسكب داخل صورة، وقماشٌ يكشف ما خلفه.')
R('<b style="color:var(--ink)">Why it works.</b> The audience cannot tell where the performer ends and the screen begins. That gap is where the applause, and the phones, come out.',
  '<b style="color:var(--ink)">لماذا تنجح.</b> لا يستطيع الجمهور أن يميّز أين ينتهي المؤدّي وأين تبدأ الشاشة. وفي تلك المسافة بالذات ينفجر التصفيق وتُرفع الهواتف.')
R('<b style="color:var(--ink)">What it must be.</b> Unmistakably Budoor Signature: black, gold and green, a signature, a piano, and a city growing out of nature.',
  '<b style="color:var(--ink)">ما يجب أن تكونه.</b> بدور سيجنتشر بلا لبس: الأسود والذهبي والأخضر، وتوقيع، وبيانو، ومدينة تنمو من قلب الطبيعة.')
R('<span class="pill">5-minute slot</span><span class="pill">250 guests</span><span class="pill">P2.5 LED wall</span><span class="pill">Timecode-locked</span>',
  '<span class="pill">فقرة من 5 دقائق</span><span class="pill">250 ضيفًا</span><span class="pill">جدار LED بدقة <span class="ltr">P2.5</span></span><span class="pill">مُقفَل على الكود الزمني</span>')

# ---------- 03 references ----------
R('<small>02 — What we learned from the references</small>Why the world believed it</h1>', '<small>02 — ما تعلّمناه من المراجع</small>لماذا صدّق العالم ما رآه</h1>')
R('<div style="margin-top:22px" class="kicker">Hermès × Les French Twins</div>', '<div style="margin-top:22px;text-align:right" class="kicker lat" dir="ltr">Hermès × Les French Twins</div>')
R('A line-drawn horse and carriage. The performer pulls a real silk scarf out of the drawing, then the drawing becomes a real horse walking out of a split in the screen.',
  'حصان وعربة مرسومان بالخط. يسحب المؤدّي وشاحًا حريريًا حقيقيًا من داخل الرسم، ثم يتحوّل الرسم إلى حصان حقيقي يخرج من شقٍّ في الشاشة.')
R('<ul class="body" style="margin-top:16px;padding-left:22px;line-height:1.7">', '<ul class="body" style="margin-top:16px;padding-inline-start:22px;line-height:1.8">', 2)
R('<li><b>Line art hides the seam.</b> A drawn world forgives a 3-frame miss; photoreal does not.</li>',
  '<li><b>الرسم الخطّي يخفي الفاصل.</b> عالمٌ مرسوم يغفر خطأ بثلاثة إطارات؛ أما الواقعي فلا يغفر.</li>')
R('<li><b>Something leaves the screen.</b> The scarf is the proof that it is “real”.</li>',
  '<li><b>شيءٌ يغادر الشاشة.</b> الوشاح هو الدليل على أن الأمر «حقيقي».</li>')
R('<li><b>The impossible thing comes last.</b> One trick you cannot explain, saved for the end.</li>',
  '<li><b>المستحيل يأتي أخيرًا.</b> خدعة واحدة لا يمكن تفسيرها، تُدَّخر للنهاية.</li>')
R('<div style="margin-top:22px" class="kicker">Darvis × Autumn Lake</div>', '<div style="margin-top:22px;text-align:right" class="kicker lat" dir="ltr">Darvis × Autumn Lake</div>')
R('A red cloth repaints a car, balls are thrown “into” the screen, a man steps out of a screen doorway, and rain falls on real umbrellas.',
  'قماشٌ أحمر يعيد طلاء سيارة، وكراتٌ تُرمى «إلى داخل» الشاشة، ورجلٌ يخرج من باب على الشاشة، ومطرٌ يهطل على مظلّات حقيقية.')
R('<li><b>The hand leads, the screen follows.</b> Every effect starts a few frames after the touch.</li>',
  '<li><b>اليد تقود والشاشة تتبع.</b> كل تأثير يبدأ بعد اللمسة ببضعة إطارات.</li>')
R('<li><b>One trick, three sizes.</b> Small, medium, then the whole wall.</li>',
  '<li><b>خدعة واحدة بثلاثة أحجام.</b> صغيرة، ثم متوسطة، ثم الجدار كلّه.</li>')
R('<li><b>End on the client.</b> The last frame is always the logo, and the room is on its feet.</li>',
  '<li><b>الختام على العميل.</b> الإطار الأخير هو الشعار دائمًا، والقاعة واقفة تصفّق.</li>')

# ---------- 04 divider ----------
R('background:linear-gradient(90deg,rgba(11,11,11,.95) 0%,rgba(11,11,11,.6) 60%,rgba(11,11,11,.2) 100%)',
  'background:linear-gradient(270deg,rgba(11,11,11,.95) 0%,rgba(11,11,11,.6) 60%,rgba(11,11,11,.2) 100%)')
R('<div style="position:absolute;left:120px;top:88px" class="hoe">House <i>of</i> Experience</div>\n  <div style="position:absolute;left:120px;top:300px;max-width:1100px">',
  '<div style="position:absolute;right:120px;top:88px" class="hoe">House <i>of</i> Experience</div>\n  <div style="position:absolute;right:120px;top:270px;max-width:1100px">')
R('<div class="kicker" style="color:var(--gold2)">Three concepts</div>', '<div class="kicker" style="color:var(--gold2);font-size:20px">ثلاثة مفاهيم</div>')
R('<h2 style="font-size:150px;font-weight:800;letter-spacing:-.035em;line-height:.9;margin-top:26px">Three ways<br>to sign<br>the night.</h2>',
  '<h2 style="font-size:140px;font-weight:700;letter-spacing:0;line-height:1.15;margin-top:20px">ثلاث طرق<br>لتوقيع<br>الليلة.</h2>')
R('<p style="margin-top:40px;font-size:24px;line-height:1.45;color:#d2d2d2;max-width:760px">Each one is built on something Budoor Signature already owns: the signature in its name, the plant every guest takes home, and the piano from its film. Each ends with the city.</p>',
  '<p style="margin-top:34px;font-size:24px;line-height:1.65;color:#d2d2d2;max-width:760px">كل مفهوم مبنيّ على شيء تملكه بدور سيجنتشر أصلًا: التوقيع في اسمها، والنبتة التي يأخذها كل ضيف إلى بيته، والبيانو من فيلمها الإعلاني. وكلٌّ منها ينتهي بالمدينة.</p>')
R('<div style="position:absolute;right:120px;bottom:150px;display:flex;flex-direction:column;gap:22px;text-align:right">',
  '<div style="position:absolute;left:120px;bottom:150px;display:flex;flex-direction:column;gap:22px;text-align:left">')
R('<div><span class="num" style="font-size:64px">01</span>&nbsp;&nbsp;<span style="font-size:30px;font-weight:700">The Golden Stroke</span></div>',
  '<div><span class="num" style="font-size:64px">01</span>&nbsp;&nbsp;<span style="font-size:30px;font-weight:700">اللمسة الذهبية</span></div>')
R('<div><span class="num" style="font-size:64px">02</span>&nbsp;&nbsp;<span style="font-size:30px;font-weight:700">Let It Grow</span></div>',
  '<div><span class="num" style="font-size:64px">02</span>&nbsp;&nbsp;<span style="font-size:30px;font-weight:700">دعها تنمو</span></div>')
R('<div><span class="num" style="font-size:64px">03</span>&nbsp;&nbsp;<span style="font-size:30px;font-weight:700">Symphony of a Raw Space</span></div>',
  '<div><span class="num" style="font-size:64px">03</span>&nbsp;&nbsp;<span style="font-size:30px;font-weight:700">سيمفونية الأرض الخام</span></div>')

# ---------- 05 hero 01 ----------
R('<h2><span>Concept 01 &nbsp;·&nbsp; 1 performer &nbsp;·&nbsp; 1 prop &nbsp;·&nbsp; 90 s</span>The Golden<br>Stroke</h2>',
  '<h2><span>المفهوم 01 &nbsp;·&nbsp; مؤدٍّ واحد &nbsp;·&nbsp; أداة واحدة &nbsp;·&nbsp; 90 ثانية</span>اللمسة<br>الذهبية</h2>')
R('<p>Budoor Signature is, literally, a signature. One golden pen, one line of light that never stops moving, and by the end the line has drawn the whole city and signed it.</p>',
  '<p>بدور سيجنتشر هي، حرفيًا، توقيع. قلمٌ ذهبي واحد، وخطٌّ من الضوء لا يتوقف عن الحركة، وفي النهاية يكون الخط قد رسم المدينة كلّها ووقّعها.</p>')

# ---------- 06 beats 01 ----------
R('<small>Concept 01 — The Golden Stroke</small>', '<small>المفهوم 01 — اللمسة الذهبية</small>', 2)
R('<h3>The touch</h3>', '<h3>اللمسة</h3>')
R('<p>The wall is black. The performer walks on with a one-metre golden calligraphy pen and touches the screen. A line of gold ink is born exactly under the nib, with a single piano note.</p>',
  '<p>الجدار أسود. يدخل المؤدّي حاملًا قلم خطٍّ ذهبيًا بطول متر ويلمس الشاشة. يولد خطٌّ من الحبر الذهبي تحت السنّ تمامًا، مع نغمة بيانو واحدة.</p>')
R('Touch point 1 taped on the floor. The ink starts 8 frames after the nib lands.', 'نقطة اللمس 1 مثبّتة بشريط على الأرض. يبدأ الحبر بعد 8 إطارات من ملامسة السنّ للشاشة.')
R('<h3>The drawing</h3>', '<h3>الرسم</h3>')
R('<p>Every sweep of the arm drags the line across the 25-metre wall. Streets, villa footprints, palms and the central park appear as gold line art, one district per gesture.</p>',
  '<p>كل حركة من الذراع تجرّ الخط عبر الجدار البالغ طوله 25 مترًا. تظهر الشوارع ومساقط الفلل والنخيل والحديقة المركزية كرسم خطّي ذهبي، حيٌّ واحد لكل إيماءة.</p>')
R('Nine touch points across the wall. The line always waits for the hand, never the reverse.', 'تسع نقاط لمس عبر الجدار. الخط ينتظر اليد دائمًا، ولا يحدث العكس أبدًا.')
R('<h3>The signature</h3>', '<h3>التوقيع</h3>')
R('<p>The last stroke signs the plan. The performer pulls the signature off the wall and it appears in their hand as a lit golden sculpture, while the line art ignites into the full aerial of Budoor Signature.</p>',
  '<p>الضربة الأخيرة توقّع المخطط. يسحب المؤدّي التوقيع من الجدار فيظهر في يده مجسّمًا ذهبيًا مضيئًا، بينما يشتعل الرسم الخطّي ليتحوّل إلى اللقطة الجوية الكاملة لبدور سيجنتشر.</p>')
R('Sculpture rises on a floor lift at 1:12. Beams, gold confetti and logo on the final chord.', 'يرتفع المجسّم على رافعة أرضية عند 1:12. أشعة وقصاصات ذهبية والشعار مع الوتر الأخير.')

# ---------- 07 screen 01 ----------
R('SCREEN CONTENT · 21:9 frame at 0:48 · the line mid-stroke, the plan half drawn', 'محتوى الشاشة · إطار <span class="ltr">21:9</span> عند 0:48 · الخط في منتصف الضربة، والمخطط نصف مرسوم')
R('<p>The pull. The signature leaves the screen and appears in the hand. Centre camera, 12 m back, phone height.</p>',
  '<p>السحب. يغادر التوقيع الشاشة ويظهر في اليد. كاميرا مركزية، على بعد 12 مترًا، بارتفاع الهاتف.</p>')
R('<p>The name of the project is the trick. Nobody has to be told what they just saw.</p>', '<p>اسم المشروع هو الخدعة نفسها. لا أحد يحتاج إلى من يشرح له ما رآه للتوّ.</p>')
R('<li><em>Golden pen</em>1 m, LED tip, wireless trigger for the ink burst</li>', '<li><em>القلم الذهبي</em>بطول متر واحد، طرف LED، زناد لاسلكي لانفجار الحبر</li>')
R('<li><em>Signature</em>Lit golden sculpture on a floor lift or handed from the wing</li>', '<li><em>التوقيع</em>مجسّم ذهبي مضيء على رافعة أرضية أو يُناوَل من الكواليس</li>')
R('<li><em>Floor marks</em>Nine gold tape marks mapped to the LED pixel map</li>', '<li><em>علامات الأرض</em>تسع علامات بشريط ذهبي مطابقة لخريطة بكسلات الشاشة</li>')
R('Gold line art on black, particle sparkle at the pen tip</li>', 'رسم خطّي ذهبي على أسود، مع تلألؤ جزيئات عند طرف القلم</li>')
R('Line art ignites into the photoreal aerial masterplan</li>', 'يشتعل الرسم الخطّي ليتحوّل إلى المخطط الرئيسي الجوي الواقعي</li>')
R('Solo piano building to the full TVC theme</li>', 'بيانو منفرد يتصاعد إلى اللحن الكامل للإعلان التلفزيوني</li>')
R('One dancer or illusionist, 2 rehearsal days</li>', 'راقص أو ساحر واحد، يومان من البروفات</li>')
R('Low. Line art forgives small timing misses</li>', 'منخفضة. الرسم الخطّي يغفر الأخطاء الزمنية الصغيرة</li>')

# ---------- 08 hero 02 ----------
R('<h2><span>Concept 02 &nbsp;·&nbsp; illusionist &nbsp;·&nbsp; a real tree, then the wall &nbsp;·&nbsp; 1:30</span>Let It<br>Grow</h2>',
  '<h2><span>المفهوم 02 &nbsp;·&nbsp; ساحر &nbsp;·&nbsp; شجرة حقيقية ثم الجدار &nbsp;·&nbsp; 1:30</span>دعها<br>تنمو</h2>')
R('<p>A seed goes into a pot and a real tree grows out of it in front of the room, the classic orange-tree illusion. The wall takes over where the tree stops, the illusionist waters it with a real can, and the whole city grows out of that one seed.</p>',
  '<p>بذرة تُوضع في أصيص، وتنمو منها شجرة حقيقية أمام الحضور، في خدعة شجرة البرتقال الكلاسيكية. يكمل الجدار من حيث تتوقف الشجرة، ويسقيها الساحر بمرشّة حقيقية، فتنمو المدينة كلّها من تلك البذرة الواحدة.</p>')

# ---------- 09 beats 02 ----------
R('<small>Concept 02 — Let It Grow</small>', '<small>المفهوم 02 — دعها تنمو</small>', 2)
R('<h3>The seed</h3>', '<h3>البذرة</h3>')
R('<p>Wall black. One spotlight on the illusionist and a small table with an empty pot at the foot of the wall. He drops a golden seed into the soil, passes his hands over it, and a real tree rises out of the pot in front of the audience, leaves unfolding, as in the orange-tree scene of <i>The Illusionist</i>.</p>',
  '<p>الجدار أسود. بقعة ضوء واحدة على الساحر وطاولة صغيرة عليها أصيص فارغ عند قاعدة الجدار. يُسقط بذرة ذهبية في التربة، ويمرّر يديه فوقها، فترتفع شجرة حقيقية من الأصيص أمام الجمهور وأوراقها تتفتّح، كما في مشهد شجرة البرتقال من فيلم <span class="lat">The Illusionist</span>.</p>')
R('Stage illusion, no screen. A mechanical tree prop inside the pot rises to one metre in about eight seconds on the performer\'s cue.',
  'خدعة مسرحية بلا شاشة. مجسّم شجرة ميكانيكي داخل الأصيص يرتفع إلى متر واحد خلال نحو ثماني ثوانٍ بإشارة من المؤدّي.')
R('<h3>The hand-off</h3>', '<h3>التسليم</h3>')
R('<p>The real tree stops growing at one metre. He steps back, and exactly above the pot the wall picks up the trunk: it keeps growing on screen, roots glowing gold at the base, branches spreading in gold and green, so the real tree and the screen tree read as one.</p>',
  '<p>تتوقف الشجرة الحقيقية عن النمو عند متر واحد. يتراجع خطوة، وفوق الأصيص تمامًا يلتقط الجدار الجذع: يواصل النمو على الشاشة، بجذور تتوهّج ذهبًا عند القاعدة وأغصان تمتدّ بالذهبي والأخضر، فتُقرأ الشجرة الحقيقية وشجرة الشاشة شجرةً واحدة.</p>')
R('The pot sits on a fixed floor mark under a matching pixel column. The screen trunk starts 10 frames after the prop locks.',
  'الأصيص على علامة أرضية ثابتة تحت عمود بكسلات مطابق. يبدأ جذع الشاشة بعد 10 إطارات من تثبيت المجسّم.')
R('<p>He picks up a real golden watering can and waters the real tree, real water into the pot. On the wall, golden water rises from the pot up the trunk and the tree races upward, canopy in Budoor green, its leaves villas, its branches streets.</p>',
  '<p>يلتقط مرشّة ذهبية حقيقية ويسقي الشجرة الحقيقية، ماءٌ حقيقي في الأصيص. وعلى الجدار، يصعد ماءٌ ذهبي من الأصيص عبر الجذع فتندفع الشجرة إلى الأعلى، بتاجٍ بأخضر بدور، أوراقها فلل، وأغصانها شوارع.</p>')
R('The gold water flows only while the can is tilted; the pot has a hidden tray. The tree grows with the pour.',
  'يتدفّق الماء الذهبي فقط حين تميل المرشّة؛ في الأصيص صينية مخفيّة. تنمو الشجرة مع السكب.')
R('<h3>The shake</h3>', '<h3>الهزّة</h3>')
R('<p>He grips the real trunk and shakes it. The canopy on screen sheds thousands of gold leaves, and on the same frame real gold leaves rain from the truss over the stage and the front rows. The canopy resolves into the aerial masterplan.</p>',
  '<p>يمسك الجذع الحقيقي ويهزّه. يُسقط التاج على الشاشة آلاف الأوراق الذهبية، وفي الإطار نفسه تمطر أوراق ذهبية حقيقية من الجسر المعلّق فوق المسرح والصفوف الأمامية. ثم يتحوّل التاج إلى المخطط الرئيسي الجوي.</p>')
R('Leaf drop fired by the media server on timecode, not by hand. Guests stand in a shower of gold.',
  'إسقاط الأوراق يُطلقه خادم الوسائط على الكود الزمني، لا باليد. يقف الضيوف تحت وابلٍ من الذهب.')

# ---------- 10 screen 02 ----------
R('SCREEN CONTENT · 21:9 frame at 1:00 · the tree fully grown above the real one, villas in the canopy, first leaves falling',
  'محتوى الشاشة · إطار <span class="ltr">21:9</span> عند 1:00 · الشجرة مكتملة النمو فوق الشجرة الحقيقية، فلل في التاج، وأولى الأوراق تتساقط')
R('<p>A real tree grows out of a seed on stage, then keeps growing on the wall, then real water makes it a city. Centre camera, tight on the pot, then wide.</p>',
  '<p>شجرة حقيقية تنمو من بذرة على المسرح، ثم تواصل النمو على الجدار، ثم يحوّلها ماءٌ حقيقي إلى مدينة. كاميرا مركزية، لقطة ضيّقة على الأصيص ثم واسعة.</p>')
R('<p>“Plant your signature. Let it grow.” The activation every guest did at the entrance, now done by the brand at city scale.</p>',
  '<p>«ازرع توقيعك. دعه ينمو.» التفاعل الذي قام به كل ضيف عند المدخل، تقوم به العلامة الآن على مقياس مدينة.</p>')
R('<li><em>Tree illusion</em>Mechanical orange-tree prop: a folded tree inside a weighted pot, rising to one metre by servo, real foliage, performer-triggered</li>',
  '<li><em>خدعة الشجرة</em>مجسّم شجرة برتقال ميكانيكي: شجرة مطويّة داخل أصيص مثقّل، ترتفع إلى متر واحد بمحرّك سيرفو، بأوراق حقيقية، يطلقها المؤدّي</li>')
R('<li><em>Seed &amp; table</em>LED seed, small round black table on a fixed floor mark under the matching pixel column</li>',
  '<li><em>البذرة والطاولة</em>بذرة LED، طاولة سوداء مستديرة صغيرة على علامة أرضية ثابتة تحت عمود البكسلات المطابق</li>')
R('<li><em>Watering can</em>Golden can, real water, hidden tray inside the pot</li>', '<li><em>المرشّة</em>مرشّة ذهبية، ماء حقيقي، صينية مخفيّة داخل الأصيص</li>')
R('<li><em>Leaf drop</em>Kabuki drop or 4 confetti blowers on the truss, metallic gold leaves</li>', '<li><em>إسقاط الأوراق</em>ستارة كابوكي أو 4 نافخات قصاصات على الجسر المعلّق، أوراق ذهبية معدنية</li>')
R('Screen trunk grows from the exact point above the real tree; gold roots, deep green canopy, photoreal villas as leaves</li>',
  'ينمو جذع الشاشة من النقطة الواقعة فوق الشجرة الحقيقية تمامًا؛ جذور ذهبية، تاج أخضر داكن، فلل واقعية على هيئة أوراق</li>')
R('Canopy dissolves into the aerial masterplan</li>', 'يذوب التاج ليتحوّل إلى المخطط الرئيسي الجوي</li>')
R('Piano and strings, one swell on the shake</li>', 'بيانو ووتريات، وتصاعد واحد مع الهزّة</li>')
R('One illusionist, 2 rehearsal days, prop build 3 weeks</li>', 'ساحر واحد، يومان من البروفات، وبناء المجسّم 3 أسابيع</li>')
R('Medium. The tree prop and the rigging; both tested on day 1</li>', 'متوسطة. مجسّم الشجرة والتعليق؛ يُختبر كلاهما في اليوم الأول</li>')

# ---------- 11 hero 03 ----------
R('<h2><span>Concept 03 &nbsp;·&nbsp; maestro + trio &nbsp;·&nbsp; the TVC on stage &nbsp;·&nbsp; 1:45</span>Symphony of<br>a Raw Space</h2>',
  '<h2><span>المفهوم 03 &nbsp;·&nbsp; مايسترو وثلاثي &nbsp;·&nbsp; الإعلان التلفزيوني حيًّا على المسرح &nbsp;·&nbsp; 1:45</span>سيمفونية<br>الأرض الخام</h2>')
R('<p>A maestro at the centre of the stage cues three musicians one by one. The pianist lays the foundations, the guitarist grows the gardens, the violinist fills the water, and together they finish the homes, while the maestro\'s baton paints the wall.</p>',
  '<p>مايسترو في منتصف المسرح يعطي الإشارة لثلاثة موسيقيين واحدًا تلو الآخر. عازف البيانو يضع الأساسات، وعازف الغيتار يُنبت الحدائق، وعازفة الكمان تملأ الماء، ومعًا يكملون البيوت، بينما تلوّن عصا المايسترو الجدار.</p>')

# ---------- 12 beats 03 ----------
R('<small>Concept 03 — Symphony of a Raw Space</small>', '<small>المفهوم 03 — سيمفونية الأرض الخام</small>', 2)
R('<h3>The foundations</h3>', '<h3>الأساسات</h3>')
R('<p>Black stage, black wall. A dim spot finds the maestro at centre. He points the baton at the white grand, a spotlight opens on the pianist, and on the wall a golden curtain folds open above the piano. The first notes rise as gold, turn into paint, and draw the base of the project: plots, streets, the grid.</p>',
  '<p>مسرح أسود وجدار أسود. بقعة ضوء خافتة تجد المايسترو في المنتصف. يشير بعصاه إلى البيانو الأبيض الكبير، فتُفتح بقعة ضوء على عازف البيانو، وعلى الجدار تنطوي ستارة ذهبية لتنفتح فوق البيانو. ترتفع النغمات الأولى ذهبًا، ثم تتحوّل إلى طلاء، وترسم قاعدة المشروع: القطع والشوارع والشبكة.</p>')
R('The curtain opens 8 frames after the baton points. The pianist plays to a click; each phrase draws one district.',
  'تنفتح الستارة بعد 8 إطارات من إشارة العصا. يعزف عازف البيانو على نقرة إيقاع؛ وكل جملة موسيقية ترسم حيًّا واحدًا.')
R('<h3>The gardens</h3>', '<h3>الحدائق</h3>')
R('<p>Spot out. The maestro turns right; a spotlight opens on the guitarist and the right curtain folds open above him. His notes flow into the wall and plants sprout along the same layout, filling the centre, with close-ups of leaves unfurling.</p>',
  '<p>تنطفئ البقعة. يلتفت المايسترو يمينًا؛ تُفتح بقعة ضوء على عازف الغيتار وتنفتح الستارة اليمنى فوقه. تنساب نغماته إلى الجدار فتنبت النباتات على التخطيط نفسه وتملأ المنتصف، مع لقطات قريبة لأوراق تتفتّح.</p>')
R('Growth follows the strumming tempo. Wherever the baton sweeps, it leaves a gold brush stroke on the wall.',
  'يتبع النمو إيقاع العزف. وحيثما تمرّ العصا تترك ضربة فرشاة ذهبية على الجدار.')
R('<p>Spot out. The maestro turns left; a spotlight opens on the violinist and the left curtain folds open. Her notes pour from the bow and become water, filling the lake and the canals of the central park.</p>',
  '<p>تنطفئ البقعة. يلتفت المايسترو يسارًا؛ تُفتح بقعة ضوء على عازفة الكمان وتنفتح الستارة اليسرى. تنسكب نغماتها من القوس وتصير ماءً يملأ البحيرة وقنوات الحديقة المركزية.</p>')
R('The water rises with each phrase; a sustained note holds the surface still and mirrored.',
  'يرتفع الماء مع كل جملة موسيقية؛ ونغمة ممدودة تُبقي سطح الماء ساكنًا كالمرآة.')
R('<h3>The city</h3>', '<h3>المدينة</h3>')
R('<p>All three spotlights, all three curtains open. The maestro conducts with broad strokes and the baton paints the houses, the gardens and the lights across the wall while the trio plays together, until the full project stands complete and glowing.</p>',
  '<p>بقع الضوء الثلاث كلّها، والستائر الثلاث كلّها مفتوحة. يقود المايسترو بضربات واسعة، وترسم العصا البيوت والحدائق والأضواء عبر الجدار بينما يعزف الثلاثي معًا، حتى يقف المشروع كاملًا ومتوهّجًا.</p>')
R('Every villa completes on a downbeat. The baton\'s last stroke writes the wordmark; beams and confetti on the final chord.',
  'كل فيلا تكتمل على ضربة الإيقاع القوية. والضربة الأخيرة للعصا تكتب الشعار؛ أشعة وقصاصات مع الوتر الأخير.')

# ---------- 13 screen 03 ----------
R('SCREEN CONTENT · 21:9 frame at 1:05 · three curtains, three stages of the city: foundations, gardens, water, and the maestro\'s brush stroke across them',
  'محتوى الشاشة · إطار <span class="ltr">21:9</span> عند 1:05 · ثلاث ستائر، وثلاث مراحل من المدينة: الأساسات والحدائق والماء، وضربة فرشاة المايسترو عبرها')
R('<p>The cue. The maestro points, the spotlight hits, and the curtain folds open on the wall in the same second, three times in a row.</p>',
  '<p>الإشارة. يشير المايسترو، فتضرب بقعة الضوء، وتنفتح الستارة على الجدار في الثانية نفسها، ثلاث مرات متتالية.</p>')
R('<p>It is the TVC, live: the pianist, the theme, and the promise in the title, a raw space becoming a symphony, played by three instruments.</p>',
  '<p>إنه الإعلان التلفزيوني حيًّا: عازف البيانو، واللحن، والوعد الذي في العنوان؛ أرضٌ خام تتحوّل إلى سيمفونية تعزفها ثلاث آلات.</p>')
R('<div><h4>Stage</h4><ul>', '<div><h4>المسرح</h4><ul>')
R('<li><em>Maestro</em>Centre front, back to the room, golden baton with LED tip; the only performer who touches the wall</li>',
  '<li><em>المايسترو</em>في منتصف المقدّمة وظهره إلى القاعة، بعصا ذهبية بطرف LED؛ المؤدّي الوحيد الذي يلمس الجدار</li>')
R('<li><em>Piano</em>The white grand, moved to centre for this act, mic\'d and lit</li>', '<li><em>البيانو</em>البيانو الأبيض الكبير، يُنقل إلى المنتصف لهذا الفصل، مزوّد بميكروفون ومضاء</li>')
R('<li><em>Guitar &amp; violin</em>Stage right and stage left, wireless pickups</li>', '<li><em>الغيتار والكمان</em>يمين المسرح ويساره، بلاقط لاسلكية</li>')
R('<li><em>Spots</em>Four profile spots, one per performer, fired from the same timecode as the wall</li>',
  '<li><em>بقع الضوء</em>أربع بقع ضوء بروفايل، واحدة لكل مؤدٍّ، تُطلق من الكود الزمني نفسه الذي يشغّل الجدار</li>')
R('Golden theatre curtains fold open per musician; notes become paint; four layers build in order: gold foundations, green gardens, gold-lit water, photoreal homes</li>',
  'ستائر مسرح ذهبية تنفتح لكل موسيقي؛ النغمات تصير طلاءً؛ وأربع طبقات تُبنى بالترتيب: أساسات ذهبية، حدائق خضراء، ماء مضاء بالذهب، بيوت واقعية</li>')
R('<li><em>Baton</em>Leaves a gold brush stroke wherever it points; the last stroke writes the wordmark</li>',
  '<li><em>العصا</em>تترك ضربة فرشاة ذهبية حيثما تشير؛ والضربة الأخيرة تكتب الشعار</li>')
R('Live trio to a click over the TVC theme, extended to 1:45</li>', 'ثلاثي حيّ على نقرة إيقاع فوق لحن الإعلان التلفزيوني، ممدودًا إلى 1:45</li>')
R('<li><em>Performers</em>Maestro plus three musicians, 2 rehearsal days</li>', '<li><em>المؤدّون</em>مايسترو وثلاثة موسيقيين، يومان من البروفات</li>')
R('Low to medium. Musicians play to click; only the baton has touch points: three cues and the final stroke</li>',
  'منخفضة إلى متوسطة. الموسيقيون يعزفون على نقرة إيقاع؛ والعصا وحدها لها نقاط لمس: ثلاث إشارات والضربة الأخيرة</li>')

# ---------- 14 playbook ----------
R('<small>03 — Making it read as live</small>The sync playbook</h1>', '<small>03 — كيف يبدو الأمر حيًّا</small>دليل المزامنة</h1>')
R('Technical rehearsal: the wall shows the numbered touch-point grid, the floor carries the matching marks, the show caller runs everything from one timecode.',
  'البروفة التقنية: يعرض الجدار شبكة نقاط اللمس المرقّمة، وتحمل الأرض العلامات المطابقة، ويدير منادي العرض كل شيء من كود زمني واحد.')
R('<div style="margin-top:34px;display:grid;grid-template-columns:auto 1fr;gap:14px 24px;font-size:17px;line-height:1.5;color:var(--ink2)">',
  '<div style="margin-top:34px;display:grid;grid-template-columns:auto 1fr;gap:14px 24px;font-size:17px;line-height:1.6;color:var(--ink2)">')
R('<b style="color:var(--gold)">D-15</b><span>Storyboard and animatic approved; performer starts rehearsing to a 1:1 projection.</span>',
  '<b style="color:var(--gold)" class="ltr">D-15</b><span>اعتماد القصة المصوّرة والأنيماتيك؛ ويبدأ المؤدّي التدريب على إسقاط بمقياس <span class="ltr">1:1</span>.</span>')
R('<b style="color:var(--gold)">D-7</b><span>Final render on the LED pixel map; cue sheet, click track and lighting cues locked.</span>',
  '<b style="color:var(--gold)" class="ltr">D-7</b><span>الرندر النهائي على خريطة بكسلات الشاشة؛ وإقفال ورقة الإشارات ومسار النقر وإشارات الإضاءة.</span>')
R('<b style="color:var(--gold)">D-1</b><span>Technical test and full dress rehearsal on the real wall, as in the event timeline.</span>',
  '<b style="color:var(--gold)" class="ltr">D-1</b><span>اختبار تقني وبروفة نهائية كاملة على الجدار الحقيقي، كما في الجدول الزمني للفعالية.</span>')
R('<div><i>1</i><h4>One clock</h4><p>Video, lighting, fog, confetti and the click all run from one SMPTE timecode on the media server. Nothing is fired by hand.</p></div>',
  '<div><i>1</i><h4>ساعة واحدة</h4><p>الفيديو والإضاءة والضباب والقصاصات ونقرة الإيقاع تعمل كلّها من كود زمني SMPTE واحد على خادم الوسائط. لا شيء يُطلق باليد.</p></div>')
R('<div><i>2</i><h4>The hand leads</h4><p>Every effect starts 6 to 10 frames after the touch, never before. Late is invisible; early breaks the spell.</p></div>',
  '<div><i>2</i><h4>اليد تقود</h4><p>كل تأثير يبدأ بعد اللمسة بما بين 6 و10 إطارات، ولا يسبقها أبدًا. التأخّر غير مرئي؛ أما التبكير فيكسر السحر.</p></div>')
R('<div><i>3</i><h4>Nine marks</h4><p>Touch points are taped on the floor and mapped to the pixel map of the wall, so “where the hand is” is a number, not a guess.</p></div>',
  '<div><i>3</i><h4>تسع علامات</h4><p>نقاط اللمس مثبّتة بشريط على الأرض ومربوطة بخريطة بكسلات الجدار، فيصبح «مكان اليد» رقمًا لا تخمينًا.</p></div>')
R('<div><i>4</i><h4>Hold frames</h4><p>Each trick has a loopable hold the operator can park on if the performer is a second late. The audience never sees it.</p></div>',
  '<div><i>4</i><h4>إطارات الانتظار</h4><p>لكل خدعة مقطع انتظار قابل للتكرار يستطيع المشغّل التوقف عنده إذا تأخّر المؤدّي ثانية. الجمهور لا يراه أبدًا.</p></div>')
R('<div><i>5</i><h4>The camera decides</h4><p>Every move is blocked for the hero angle: centre, 12 m back, phone height. A 9:16 crop of the master is cut for social the same night.</p></div>',
  '<div><i>5</i><h4>الكاميرا هي الحكم</h4><p>كل حركة مرسومة لزاوية البطل: في المنتصف، على بعد 12 مترًا، بارتفاع الهاتف. وتُقصّ نسخة <span class="ltr">9:16</span> من النسخة الرئيسية للسوشيال في الليلة نفسها.</p></div>')
R('<div><i>6</i><h4>Rehearse to the frame</h4><p>Fifteen days of content and training, two days on the real wall. The performer counts music, not seconds.</p></div>',
  '<div><i>6</i><h4>التدريب حتى الإطار</h4><p>خمسة عشر يومًا للمحتوى والتدريب، ويومان على الجدار الحقيقي. المؤدّي يعدّ الموسيقى لا الثواني.</p></div>')

# ---------- 15 comparison ----------
R('<small>04 — Choosing</small>Side by side</h1>', '<small>04 — الاختيار</small>جنبًا إلى جنب</h1>')
R('<tr><th></th><th>Brand link</th><th>Wow factor</th><th>Complexity</th><th>The shot people share</th></tr>',
  '<tr><th></th><th>الربط بالعلامة</th><th>عامل الإبهار</th><th>التعقيد</th><th>اللقطة التي يشاركها الناس</th></tr>')
R('<tr><td>01<br>The Golden Stroke</td><td><span class="dots">●●●●●</span><br><span style="font-size:15px;color:var(--mute)">The name is the trick</span></td><td><span class="dots">●●●●<span>●</span></span></td><td>Low<br><span style="font-size:15px;color:var(--mute)">1 performer, 1 prop</span></td><td>The signature leaving the screen into the hand</td></tr>',
  '<tr><td>01<br>اللمسة الذهبية</td><td><span class="dots">●●●●●</span><br><span style="font-size:15px;color:var(--mute)">الاسم هو الخدعة</span></td><td><span class="dots">●●●●<span>●</span></span></td><td>منخفض<br><span style="font-size:15px;color:var(--mute)">مؤدٍّ واحد، أداة واحدة</span></td><td>التوقيع يغادر الشاشة إلى اليد</td></tr>')
R('<tr><td>02<br>Let It Grow</td><td><span class="dots">●●●●<span>●</span></span><br><span style="font-size:15px;color:var(--mute)">Signature Plant, green promise</span></td><td><span class="dots">●●●●●</span></td><td>Medium<br><span style="font-size:15px;color:var(--mute)">Tree illusion prop, rigging, leaf drop</span></td><td>A real tree grows from a seed on stage, then keeps growing on the wall</td></tr>',
  '<tr><td>02<br>دعها تنمو</td><td><span class="dots">●●●●<span>●</span></span><br><span style="font-size:15px;color:var(--mute)">نبتة سيجنتشر، والوعد الأخضر</span></td><td><span class="dots">●●●●●</span></td><td>متوسط<br><span style="font-size:15px;color:var(--mute)">مجسّم الشجرة، التعليق، إسقاط الأوراق</span></td><td>شجرة حقيقية تنمو من بذرة على المسرح ثم تواصل النمو على الجدار</td></tr>')
R('<tr><td>03<br>Symphony of a Raw Space</td><td><span class="dots">●●●●●</span><br><span style="font-size:15px;color:var(--mute)">The TVC, live, three instruments</span></td><td><span class="dots">●●●●●</span></td><td>Medium<br><span style="font-size:15px;color:var(--mute)">Maestro + 3 musicians, 4 spots</span></td><td>The maestro’s cue: point, spotlight, curtain, three times in a row</td></tr>',
  '<tr><td>03<br>سيمفونية الأرض الخام</td><td><span class="dots">●●●●●</span><br><span style="font-size:15px;color:var(--mute)">الإعلان التلفزيوني حيًّا، بثلاث آلات</span></td><td><span class="dots">●●●●●</span></td><td>متوسط<br><span style="font-size:15px;color:var(--mute)">مايسترو و3 موسيقيين، 4 بقع ضوء</span></td><td>إشارة المايسترو: إشارة، بقعة ضوء، ستارة، ثلاث مرات متتالية</td></tr>')
R('<div class="kicker" style="margin-bottom:18px">The three-act reveal · 4:45 inside the 5-minute slot</div>',
  '<div class="kicker" style="margin-bottom:18px">الكشف بثلاثة فصول · 4:45 ضمن فقرة الخمس دقائق</div>')
R('<div style="font-size:11px;letter-spacing:.24em;opacity:.7">ACT I · 0:00</div><div style="font-size:18px;font-weight:700;margin-top:6px">Symphony of a Raw Space</div><div style="font-size:13px;opacity:.75;margin-top:4px">Musical Genesis</div>',
  '<div style="font-size:12px;letter-spacing:0;opacity:.7">الفصل الأول · 0:00</div><div style="font-size:18px;font-weight:700;margin-top:6px">سيمفونية الأرض الخام</div><div style="font-size:13px;opacity:.75;margin-top:4px">النشأة الموسيقية</div>')
R('<div style="font-size:11px;letter-spacing:.24em;opacity:.7">ACT II · 1:45</div><div style="font-size:18px;font-weight:700;margin-top:6px">The Golden Stroke</div><div style="font-size:13px;opacity:.75;margin-top:4px">First Touch</div>',
  '<div style="font-size:12px;letter-spacing:0;opacity:.7">الفصل الثاني · 1:45</div><div style="font-size:18px;font-weight:700;margin-top:6px">اللمسة الذهبية</div><div style="font-size:13px;opacity:.75;margin-top:4px">اللمسة الأولى</div>')
R('<div style="font-size:11px;letter-spacing:.24em;opacity:.7">ACT III · 3:15</div><div style="font-size:18px;font-weight:700;margin-top:6px">Let It Grow</div><div style="font-size:13px;opacity:.75;margin-top:4px">Natural Layer</div>',
  '<div style="font-size:12px;letter-spacing:0;opacity:.7">الفصل الثالث · 3:15</div><div style="font-size:18px;font-weight:700;margin-top:6px">دعها تنمو</div><div style="font-size:13px;opacity:.75;margin-top:4px">الطبقة الطبيعية</div>')
R('<div style="font-size:11px;letter-spacing:.24em;opacity:.7">4:45</div><div style="font-size:18px;font-weight:700;margin-top:6px">Logo &amp; CEO</div><div style="font-size:13px;opacity:.75;margin-top:4px">Aerial reveal</div>',
  '<div style="font-size:12px;letter-spacing:0;opacity:.7">4:45</div><div style="font-size:18px;font-weight:700;margin-top:6px">الشعار والرئيس التنفيذي</div><div style="font-size:13px;opacity:.75;margin-top:4px">الكشف الجوي</div>')
R('<div class="kicker">Our recommendation</div>', '<div class="kicker">توصيتنا</div>')
R('<p class="lead" style="font-size:24px"><b>Run all three as one five-minute, three-act reveal.</b> The event kit already promises a “3-Act Opening: Musical Genesis, First Touch, Natural Layer.” These are those acts.</p>',
  '<p class="lead" style="font-size:24px"><b>نفّذوا المفاهيم الثلاثة كشفًا واحدًا من خمس دقائق بثلاثة فصول.</b> حقيبة الفعالية تعد أصلًا بـ«افتتاح من ثلاثة فصول: النشأة الموسيقية، اللمسة الأولى، الطبقة الطبيعية». وهذه هي تلك الفصول.</p>')
R('<b style="color:var(--gold)">Act I</b><span>Symphony of a Raw Space · <i>Musical Genesis</i> · 1:45</span>',
  '<b style="color:var(--gold);white-space:nowrap">الفصل الأول</b><span>سيمفونية الأرض الخام · <span style="color:var(--mute)">النشأة الموسيقية</span> · 1:45</span>')
R('<b style="color:var(--gold)">Act II</b><span>The Golden Stroke · <i>First Touch</i> · 1:30</span>',
  '<b style="color:var(--gold);white-space:nowrap">الفصل الثاني</b><span>اللمسة الذهبية · <span style="color:var(--mute)">اللمسة الأولى</span> · 1:30</span>')
R('<b style="color:var(--gold)">Act III</b><span>Let It Grow · <i>Natural Layer</i> · 1:30, then the aerial, the logo and the CEO’s cue</span>',
  '<b style="color:var(--gold);white-space:nowrap">الفصل الثالث</b><span>دعها تنمو · <span style="color:var(--mute)">الطبقة الطبيعية</span> · 1:30، ثم اللقطة الجوية والشعار وإشارة الرئيس التنفيذي</span>')
R('<p class="body">If it has to be one: <b style="color:var(--ink)">The Golden Stroke.</b> It carries the brand name in the trick itself, needs one performer and one prop, and is the most forgiving to perform.</p>',
  '<p class="body">وإن كان لا بدّ من واحد: <b style="color:var(--ink)">اللمسة الذهبية.</b> تحمل اسم العلامة في الخدعة نفسها، وتحتاج إلى مؤدٍّ واحد وأداة واحدة، وهي الأكثر تسامحًا في الأداء.</p>')

# ---------- 16 production ----------
R('<small>05 — Production</small>What we deliver, and what we need</h1>', '<small>05 — الإنتاج</small>ما نقدّمه، وما نحتاج إليه</h1>')
R('<div><h4>Deliverables</h4><ul>', '<div><h4>المخرجات</h4><ul>')
R('<li><em>LED master</em>Full-length film on the native pixel map of the curved wall and centre piece, 25 fps, ProRes</li>',
  '<li><em>النسخة الرئيسية</em>فيلم كامل على خريطة البكسلات الأصلية للجدار المنحني والقطعة المركزية، 25 إطارًا في الثانية، بصيغة ProRes</li>')
R('<li><em>Timecode</em>SMPTE track plus cue sheet for lighting, fog, confetti and click</li>',
  '<li><em>الكود الزمني</em>مسار SMPTE مع ورقة إشارات للإضاءة والضباب والقصاصات ونقرة الإيقاع</li>')
R('<li><em>Rehearsal cut</em>Proxy with the numbered grid and count-ins for the performer</li>',
  '<li><em>نسخة البروفة</em>نسخة مصغّرة مع الشبكة المرقّمة والعدّ التمهيدي للمؤدّي</li>')
R('<li><em>Social cut</em>9:16 vertical version of the master for the night’s posts</li>',
  '<li><em>نسخة السوشيال</em>نسخة عمودية <span class="ltr">9:16</span> من النسخة الرئيسية لمنشورات الليلة</li>')
R('<div><h4>Team</h4><ul>', '<div><h4>الفريق</h4><ul>')
R('<li><em>Creative</em>Director and show writer, one voice for stage and screen</li>', '<li><em>الإبداع</em>مخرج وكاتب عرض، صوت واحد للمسرح والشاشة</li>')
R('<li><em>Screen</em>3D and motion team working from the project’s masterplan and TVC assets</li>',
  '<li><em>الشاشة</em>فريق ثلاثي الأبعاد وموشن يعمل من المخطط الرئيسي للمشروع وأصول الإعلان التلفزيوني</li>')
R('<li><em>Stage</em>Illusionist or dancer, pianist, show caller, media server operator</li>',
  '<li><em>المسرح</em>ساحر أو راقص، عازف بيانو، منادي عرض، مشغّل خادم الوسائط</li>')
R('<li><em>Music</em>TVC composer to extend the theme to five minutes</li>', '<li><em>الموسيقى</em>مؤلّف الإعلان التلفزيوني لتمديد اللحن إلى خمس دقائق</li>')
R('<div><h4>Next steps</h4><ul>', '<div><h4>الخطوات التالية</h4><ul>')
R('<li><em>Week 1</em>Choose the concept or the three-act version; confirm performer and pianist</li>',
  '<li><em>الأسبوع 1</em>اختيار المفهوم أو نسخة الفصول الثلاثة؛ وتأكيد المؤدّي وعازف البيانو</li>')
R('<li><em>Week 1</em>LED pixel map, stage plan and floor marks from the technical team</li>',
  '<li><em>الأسبوع 1</em>خريطة بكسلات الشاشة ومخطط المسرح وعلامات الأرض من الفريق التقني</li>')
R('<li><em>Week 2</em>Storyboard and animatic for approval; rehearsals begin</li>', '<li><em>الأسبوع 2</em>القصة المصوّرة والأنيماتيك للاعتماد؛ وبدء البروفات</li>')
R('<li><em>Week 3–4</em>Final render, rehearsal cut, dress rehearsal on the wall</li>', '<li><em>الأسبوعان 3 و4</em>الرندر النهائي، نسخة البروفة، البروفة النهائية على الجدار</li>')
R('<p class="body">The screen film is cut to the TVC’s language: the same pianist, the same raw-space-to-home story, the same palette. What is shown on the wall on 28 August is the film the city will see on air the next day.</p>',
  '<p class="body">يُقصّ فيلم الشاشة بلغة الإعلان التلفزيوني نفسها: عازف البيانو نفسه، وقصة الأرض الخام التي تصير بيتًا، واللوحة اللونية نفسها. ما يُعرض على الجدار في 28 آب هو الفيلم الذي ستشاهده المدينة على الهواء في اليوم التالي.</p>')

# ---------- 17 close ----------
R('<h2 style="font-size:56px;font-weight:300;letter-spacing:-.01em">Let’s sign the night.</h2>', '<h2 style="font-size:56px;font-weight:300;letter-spacing:0;line-height:1.3">لنوقّع الليلة.</h2>')
R('<div class="wm" style="font-size:72px;color:#fff">BUDOOR<small>Signature</small></div>', '<div class="wm" dir="ltr" style="font-size:72px;color:#fff">BUDOOR<small>Signature</small></div>')

open(sys.argv[2], 'w', encoding='utf-8').write(out)
# report leftover Latin words in text nodes
text = re.sub(r'<style>.*?</style>', '', out, flags=re.S)
text = re.sub(r'<[^>]+>', ' ', text)
words = sorted(set(re.findall(r'[A-Za-z][A-Za-z\'’]{2,}', text)))
print('latin leftovers:', ' '.join(words))
