#!/usr/bin/env python3
"""Generates deck.html for the Uruk LifeHub executive proposal, restyled in
Apple's visual language (system-style type, restraint, hairlines, whitespace).
All copy, numbers and Arabic text are carried over verbatim from the source deck.
"""
from pathlib import Path

HERE = Path(__file__).parent
OUT = HERE / "deck.html"

# ---------------------------------------------------------------- helpers

def ar(text, cls=""):
    return f'<span class="ar {cls}">{text}</span>'


def emblem(size=40, dark=False):
    fg = "#f5f5f7" if dark else "#1d1d1f"
    return f'''<svg class="emblem" width="{size}" height="{size}" viewBox="0 0 40 40" fill="none">
  <circle cx="20" cy="20" r="19" stroke="{fg}" stroke-opacity=".22" stroke-width="1.2"/>
  <path d="M6 22a14 8 0 1 0 28 0" stroke="{fg}" stroke-opacity=".55" stroke-width="1.2" stroke-linecap="round"/>
  <rect x="9" y="25" width="22" height="4" rx="1" fill="{fg}"/>
  <rect x="13" y="19" width="14" height="4" rx="1" fill="{fg}"/>
  <rect x="17" y="13" width="6" height="4" rx="1" fill="{fg}"/>
</svg>'''


def top(idx, label, dark=False):
    return f'''<header class="top">
  <div class="idx"><span class="n">{idx}</span><span class="sep"></span><span class="lbl">{label}</span></div>
  <div class="brand">{emblem(40, dark)}<div class="bt"><b>URUK <span>LIFEHUB</span></b><small>Powered &amp; operated by Aspire Gate</small></div></div>
</header>'''


def mast(kicker, title, arabic, size="lg"):
    return f'''<div class="mast {size}">
  <div class="mast-l"><div class="kicker">{kicker}</div><h1>{title}</h1></div>
  <div class="mast-r">{ar(arabic, "arh")}</div>
</div>'''


def foot(left, center="", right=""):
    return f'''<footer class="foot"><div class="fl">{left}</div><div class="fc">{center}</div><div class="fr">{right}</div></footer>'''


def li(badge, title, arabic, cls="", badge_cls=""):
    return f'''<div class="li {cls}"><span class="badge {badge_cls}">{badge}</span><div class="lit"><div class="t">{title}</div>{ar(arabic, "d")}</div></div>'''


def chip(en, arabic=None):
    return f'<span class="chip">{en}{(" " + ar(arabic, "chip-ar")) if arabic else ""}</span>'


def passport_card(scale=1.0):
    return f'''<div class="pcard" style="transform:scale({scale})">
  <div class="pc-top">{emblem(34, True)}<span class="pc-nfc"><i></i><i></i><i></i></span></div>
  <div class="pc-name">URUK<br>EDUCATION<br>PASSPORT</div>
  <div class="pc-foot"><div><small>GLOBAL LEARNING ID</small><b>MEMBER</b></div><span class="pc-chip"></span></div>
</div>'''


# ---------------------------------------------------------------- slides

def slide1():
    pillars = [
        ("01", "Learn", "تعلّم من محتوى وبرامج رسمية"),
        ("02", "Certify", "اعتمد مهاراتك بشهادات موثقة"),
        ("03", "Connect", "تواصل مع المجتمع والخبراء"),
        ("04", "Advance", "تقدّم نحو التدريب والعمل"),
    ]
    eco = [
        ("01", "Uruk Pass", "جواز تعليمي وهوية رقمية موثقة"),
        ("02", "Uruk Academy", "تعليم مستمر وشهادات مهنية"),
        ("03", "Uruk Career", "مهارات وتدريب ووظائف"),
        ("04", "Uruk Pro", "تدريب الشركات والحكومة"),
        ("05", "Uruk Global", "مسارات دولية ودرجات مزدوجة"),
        ("06", "Uruk Community", "الخريجون والإرشاد والفعاليات"),
    ]
    serve = [("Students", "الطلاب"), ("Alumni", "الخريجون"), ("Professionals", "المهنيون"), ("Companies", "الشركات")]
    return f'''<section class="slide dark s1">
{top("01", "Master visual", True)}
<div class="s1-hero">
  <div class="s1-title">
    <div class="kicker">Global Learning &amp; Opportunity Passport</div>
    <h1 class="giant">Uruk<br>LifeHub</h1>
    {ar("جواز أوروك للتعلّم والمهارات والفرص العالمية", "arh big")}
  </div>
  <div class="s1-tag">
    <div class="tag-en">One identity.<br>One journey.<br><span class="grad">Endless opportunities.</span></div>
    {ar("هوية واحدة • رحلة واحدة • فرص لا تنتهي", "d")}
  </div>
</div>
<div class="s1-grid">
  <div class="card col">
    <div class="kv"><div class="k">Our vision {ar("رؤيتنا","kar")}</div>{ar("أن تصبح أوروك منصة تعليم وفرص ترافق الطالب من القبول وحتى ما بعد التخرج.","v")}</div>
    <div class="kv"><div class="k">Our mission {ar("مهمتنا","kar")}</div>{ar("ربط التعلم والاعتماد والتوظيف والمسارات الدولية في تجربة رقمية واحدة.","v")}</div>
    <div class="kv"><div class="k">The promise {ar("وعدنا","kar")}</div>{ar("جامعة واحدة. جواز واحد. عالم من الفرص.","v")}</div>
  </div>
  <div class="card col opp">
    <div class="k">The opportunity {ar("الفرصة","kar")}</div>
    <div class="bignum">21,043<span>+</span></div>
    {ar("طالب وخريج قاعدة أولية قابلة للتفعيل","v")}
  </div>
  <div class="card col">
    <div class="k">Who we serve {ar("من نخدم؟","kar")}</div>
    <div class="serve">{"".join(f'<div class="sv"><b>{e}</b>{ar(a,"d")}</div>' for e,a in serve)}</div>
  </div>
  <div class="card col">
    <div class="k">Our four pillars {ar("ركائزنا","kar")}</div>
    {"".join(li(b,t,a,"tight") for b,t,a in pillars)}
  </div>
</div>
<div class="s1-eco">
  <div class="eco-h">The Uruk LifeHub ecosystem {ar("منظومة أوروك المتكاملة","kar")}</div>
  <div class="eco">{"".join(f'<div class="eco-t"><span class="num">{n}</span><b>{e}</b>{ar(a,"d")}</div>' for n,e,a in eco)}</div>
</div>
{foot('<span class="chain">Learn '+ar("تعلّم")+' <i>›</i> Certify '+ar("اعتمد")+' <i>›</i> Connect '+ar("تواصل")+' <i>›</i> Advance '+ar("تقدّم")+'</span>', "", "Powered &amp; operated by Aspire Gate")}
</section>'''


def slide2():
    stats = [
        ("14,629", "طالب مسجل 2023/24"),
        ("6,414", "خريج تراكمي حتى 2023/24"),
        ("13", "كلية ومحفظة تخصصات واسعة"),
        ("90", "يومًا لإطلاق أول MVP"),
    ]
    assets = [
        ("01", "Continuing Education", "مركز قائم ودورات حضورية وهجينة"),
        ("02", "IELTS Center", "مركز رسمي بالتعاون مع المجلس الثقافي البريطاني"),
        ("03", "National Exams", "تدريب واختبارات للمتقدمين للدراسات العليا"),
        ("04", "Academic Capacity", "كليات ومختبرات وهيئة تدريس وخبرات تخصصية"),
    ]
    engines = [
        ("Memberships", "عضويات الطلاب والخريجين"),
        ("Professional Education", "التعليم المهني والشهادات المصغرة"),
        ("Corporate Training", "برامج الشركات والحكومة"),
        ("Certification", "الاختبارات والشهادات الدولية"),
        ("Global Pathways", "المسارات والدرجات المزدوجة"),
    ]
    road = [
        ("0-30", "Brand &amp; Blueprint", "اعتماد الهوية ونموذج العمل"),
        ("31-90", "MVP Launch", "جواز أوروك و3–5 برامج"),
        ("6-12", "Scale", "الشركات والتوظيف والخريجون"),
        ("12-24", "Globalize", "المسارات الدولية والدرجة المزدوجة"),
    ]
    return f'''<section class="slide s2">
{top("02", "Executive data")}
{mast("Data • Business case • Delivery roadmap", "Uruk LifeHub — Executive Opportunity", "من أصول قائمة إلى منصة نمو وتعليم مدى الحياة")}
<div class="s2-grid">
  <div class="card market">
    <div class="k">The immediate market {ar("السوق الفوري","kar")}</div>
    <div class="bignum">21,043<span>+</span></div>
    {ar("طالب وخريج كقاعدة أولية قابلة للتفعيل","v")}
    <div class="stats">{"".join(f'<div class="st"><b>{n}</b>{ar(a,"d")}</div>' for n,a in stats)}</div>
    <div class="insight"><div class="k small">Executive insight</div>{ar("القيمة ليست في بيع دورة واحدة؛ بل في استمرار العلاقة والإيراد مع الطالب والخريج مدى الحياة.","v")}</div>
  </div>
  <div class="center">
    <div class="steps3">
      <div class="step"><b>Digitize</b>{ar("رقمنة","d")}</div><i class="arrow">›</i>
      <div class="step"><b>Commercialize</b>{ar("تسويق وربحية","d")}</div><i class="arrow">›</i>
      <div class="step"><b>Globalize</b>{ar("انتشار دولي","d")}</div>
    </div>
    <div class="statement">
      <h2>One platform.<br>Multiple revenue <span class="grad">engines.</span></h2>
      {ar("منصة واحدة تربط التعلم والشهادات والتوظيف والمسارات الدولية","v")}
    </div>
    <div class="scenario">
      <div class="k small">Illustrative scenario</div>
      <div class="calc">1,000 × 200,000 IQD</div>
      <div class="eq">= 200M IQD</div>
      {ar("إيراد إجمالي قبل المصروفات — مثال توضيحي","d")}
    </div>
  </div>
  <div class="card assets">
    <div class="k">Existing assets {ar("الأصول القائمة","kar")}</div>
    {"".join(li(b,t,a) for b,t,a in assets)}
    <div class="adds"><div class="k small">Aspire Gate adds</div>{ar("المنصة، الجواز التعليمي، التشغيل، التسويق، الشراكات، الشركات، والانتشار الدولي.","v")}</div>
  </div>
</div>
<div class="s2-bottom">
  <div class="engines">
    <div class="k">Revenue engines {ar("محركات الإيراد","kar")}</div>
    <div class="row5">{"".join(f'<div class="eng"><b>{e}</b>{ar(a,"d")}</div>' for e,a in engines)}</div>
  </div>
  <div class="roadmap">
    <div class="k">Launch roadmap {ar("من الهوية إلى التشغيل","kar")}</div>
    <div class="row4">{"".join(f'<div class="rd"><span class="rng">{r}</span><b>{t}</b>{ar(a,"d")}</div>' for r,t,a in road)}</div>
  </div>
</div>
{foot("Source: Uruk University published statistics (2023/24) and official university website.", "", "Uruk University × Aspire Gate • One university • One passport • A world of opportunity")}
</section>'''


def slide3():
    builds = [
        ("01", "Strategy &amp; Business Model", "تصميم الرؤية، المنتجات، التسعير ونموذج الشراكة"),
        ("02", "Brand &amp; Experience", "هوية Uruk LifeHub وتجربة الجواز التعليمي"),
        ("03", "Digital Platform", "منصة العضوية، التعلم، الشارات والفرص"),
        ("04", "Partner Ecosystem", "شهادات دولية، جامعات وشبكة أصحاب أعمال"),
        ("05", "Launch &amp; Operation", "تشغيل البرامج والمجتمع والتسويق والقياس"),
    ]
    value = [
        ("∞", "Lifetime Relationship", "استمرار العلاقة مع الطالب والخريج مدى الحياة"),
        ("↑", "Recurring Revenue", "عضويات وبرامج وشهادات ومسارات قابلة للتكرار"),
        ("◎", "Employability", "ربط المهارات والشهادات بفرص التدريب والعمل"),
        ("↗", "Global Positioning", "مسارات دولية ودرجات مزدوجة وشراكات عالمية"),
        ("◆", "Corporate Market", "برامج للشركات والمؤسسات والجهات الحكومية"),
    ]
    engines = [
        ("01", "Uruk LifeHub", "الجواز التعليمي والمنصة الرقمية", "عضوية سنوية، هوية رقمية، تعلم، شارات، مجتمع وملف إنجاز قابل للمشاركة.", "المنتج المميز الذي يربط المنظومة كلها"),
        ("02", "Continuing Education 2.0", "تحويل المركز إلى وحدة أعمال", "أكاديميات سوقية، Micro-credentials، برامج حضورية وهجينة وتدريب مؤسسي.", "إيراد متكرر ومخزون برامج قابل للتوسع"),
        ("03", "Certification &amp; Career", "الاعتماد والتوظيف", "شهادات دولية، اختبارات، تدريب، Career Hub، شبكة شركات وفرص عمل.", "تحسين جاهزية الخريجين وقيمة العلامة"),
        ("04", "Global Pathways", "المسارات الدولية والدرجة المزدوجة", "Articulation، تبادل، Dual Degree، ودراسة جدوى وتأسيس المسار الأمريكي.", "انتشار دولي مع تنفيذ قانوني وأكاديمي مرحلي"),
    ]
    return f'''<section class="slide s3">
{top("03", "The offer")}
{mast("Strategy • Brand • Platform • Partnerships • Operation • Growth", "What Aspire Gate delivers", "ماذا ستقدم Aspire Gate لجامعة أوروك؟")}
<div class="s3-grid">
  <div class="card">
    <div class="k">Aspire Gate builds &amp; operates</div>
    {ar("نحوّل أصول الجامعة الحالية إلى منظومة مملوكة لأوروك، قابلة للتوسع والتشغيل وتحقيق الإيراد.","v lead")}
    {"".join(li(b,t,a,"tight") for b,t,a in builds)}
    <div class="note"><div class="k small">Ownership principle</div>{ar("العلامة والعلاقة مع الطالب ملك الجامعة؛ Aspire Gate تبني وتشغّل وتوسّع.","v")}</div>
  </div>
  <div class="flag">
    <div class="flag-copy">
      <div class="kicker">The flagship product</div>
      <h2>Uruk Education <span class="grad">Passport</span></h2>
      {ar("هوية تعليمية رقمية ترافق الطالب من القبول، إلى المهارات والشهادات، ثم التدريب والتوظيف والدراسة الدولية.","v")}
      <div class="chips">{chip("Learn")}{chip("Certify")}{chip("Connect")}{chip("Advance")}</div>
    </div>
    <div class="flag-card">{passport_card(1.0)}</div>
    <div class="flag-foot"><b>One student • One identity • One lifelong journey</b>{ar("منتج واحد يربط كل نقاط التعلّم والاعتماد والفرص داخل الجامعة وخارجها","d")}</div>
  </div>
  <div class="card">
    <div class="k">Value created {ar("القيمة للجامعة","kar")}</div>
    {ar("الهدف ليس إضافة دورات فقط، بل بناء ذراع نمو جديد يدعم الجامعة أكاديميًا وتجاريًا ودوليًا.","v lead")}
    {"".join(li(b,t,a,"tight","sym") for b,t,a in value)}
    <div class="note"><div class="k small">The outcome</div>{ar("جامعة أقرب للطالب، أقوى في السوق، وأكثر اتصالًا بالعالم.","v")}</div>
  </div>
</div>
<div class="s3-engines">
  <div class="k">The four solution engines {ar("محركات الحل الأربعة","kar")}</div>
  <div class="row4">{"".join(f'<div class="eng4"><span class="num">{n}</span><b>{e}</b>{ar(a1,"sub")}{ar(a2,"d")}<div class="eng4-f">{ar(a3,"d strong")}</div></div>' for n,e,a1,a2,a3 in engines)}</div>
</div>
{foot("<b>Uruk University</b> owns", "One university • One passport • Multiple growth engines", "<b>Aspire Gate</b> builds &amp; operates")}
</section>'''


def slide4():
    inside = [
        ("ID", "Verified Identity", "هوية أكاديمية ومهنية موثقة"),
        ("01", "Learning Record", "المسارات والدورات والتقدم"),
        ("02", "Credential Wallet", "الشهادات والشارات الرقمية"),
        ("03", "Experience Portfolio", "المشروعات والتدريب والخبرة"),
        ("04", "Opportunity Access", "وظائف ومنح ومسارات دولية"),
    ]
    journey = [
        ("1", "Join", "القبول وتفعيل الهوية"),
        ("2", "Learn", "محتوى ومسارات تعلم"),
        ("3", "Certify", "شهادات واعتمادات"),
        ("4", "Experience", "تدريب ومشروعات"),
        ("5", "Advance", "عمل ودراسة دولية"),
        ("∞", "Return", "تعلم وعلاقة مستمرة"),
    ]
    steps = "".join(
        f'<div class="jstep"><span class="badge">{n}</span><b>{e}</b>{ar(a,"d")}</div>' + ('<i class="arrow">›</i>' if i < 5 else '')
        for i, (n, e, a) in enumerate(journey))
    return f'''<section class="slide s4">
{top("04", "The passport")}
{mast("One identity • One record • One lifelong journey", "The Uruk Education Passport", "هوية تعليمية واحدة ترافق الطالب مدى الحياة")}
<div class="s4-grid">
  <div class="s4-copy">
    <div class="kicker">The student's lifelong learning ID</div>
    <h2 class="xl">Every achievement.<br>One trusted <span class="grad">record.</span></h2>
    {ar("جواز رقمي يجمع ما يتعلمه الطالب، وما ينجزه، وما يحصل عليه من شهادات وخبرات وفرص — داخل أوروك وخارجها.","v lead")}
    <div class="quote">{ar("لا ينتهي عند التخرج؛ بل يتحول إلى قناة مستمرة للتعلم والتوظيف والتواصل مع الجامعة.","v")}</div>
  </div>
  <div class="s4-card">{passport_card(1.35)}</div>
  <div class="card">
    <div class="k">Inside every passport {ar("داخل كل جواز","kar")}</div>
    {"".join(li(b,t,a) for b,t,a in inside)}
  </div>
</div>
<div class="journey">
  <div class="k">The lifelong journey {ar("رحلة الطالب داخل المنظومة","kar")}</div>
  <div class="jrow">{steps}</div>
</div>
{foot("", "Uruk LifeHub • Learn • Certify • Connect • Advance", "")}
</section>'''


def slide5():
    acad = [
        ("AI &amp; Technology", "الذكاء الاصطناعي، الأمن السيبراني، البرمجة والبيانات"),
        ("Healthcare Skills", "المختبرات، الصيدلة، الأسنان والمهارات الطبية"),
        ("Business &amp; Leadership", "الإدارة، التمويل، المشروعات وريادة الأعمال"),
        ("English &amp; IELTS", "اللغة الإنجليزية، الإعداد للاختبارات والمسارات الدولية"),
        ("Creative &amp; Digital", "التصميم، الإعلام، المحتوى والتسويق الرقمي"),
        ("Corporate Solutions", "برامج مصممة للشركات والوزارات والمؤسسات"),
    ]
    model = [
        ("Students", "B2C", "مهارات إضافية أثناء الدراسة"),
        ("Alumni &amp; Professionals", "B2C+", "ترقية مهنية وإعادة تأهيل"),
        ("Companies", "B2B", "تدريب فرق ومشروعات تطوير"),
        ("Government", "B2G", "برامج وطنية وتنمية قدرات"),
    ]
    return f'''<section class="slide s5">
{top("05", "Continuing Ed.")}
{mast("Market-led academies • Professional credentials • Corporate training", "Continuing Education 2.0", "تحويل المركز القائم إلى ذراع نمو وتعليم مهني")}
<div class="s5-grid">
  <div class="s5-copy">
    <div class="kicker">The strategic shift</div>
    <h2 class="xl">From training center<br>to growth <span class="grad">business unit.</span></h2>
    {ar("من دورات منفصلة إلى محفظة أكاديميات وبرامج وشهادات تخدم الأفراد والشركات والمؤسسات.","v lead")}
    <div class="note wide"><div class="k small">Build on a proven base {ar("البناء على أساس قائم","kar")}</div>{ar("لدى أوروك مركز تعليم مستمر وبرامج حضورية وأونلاين، ومركز IELTS بالتعاون مع المجلس الثقافي البريطاني، واعتماد لتنفيذ الامتحانات الوطنية. المقترح يحوّل هذه الأصول إلى منظومة منتجات وتسويق وتشغيل قابلة للتوسع.","v")}</div>
  </div>
  <div class="acad">{"".join(f'<div class="ac"><b>{e}</b>{ar(a,"d")}</div>' for e,a in acad)}</div>
</div>
<div class="s5-model">
  <div class="k">The business model {ar("نموذج التشغيل التجاري","kar")}</div>
  <div class="row5">
    <div class="card port"><b>One portfolio</b>{ar("برامج قصيرة، Micro-credentials، شهادات دولية، تدريب مؤسسي وعضويات.","d")}</div>
    {"".join(f'<div class="card seg"><small>{s}</small><b class="code">{c}</b>{ar(a,"d")}</div>' for s,c,a in model)}
  </div>
</div>
{foot("Official basis: Uruk University website - Continuing Education, IELTS and National Exams announcements (2025).", "", "Continuing Education becomes the commercial engine of Uruk LifeHub")}
</section>'''


def slide6():
    lpw = [("01", "Learn", "مسار مهاري مرتبط بسوق العمل"), ("02", "Prove", "اختبار وشهادة وشارة موثقة"), ("03", "Work", "تدريب ومقابلات وفرص وظيفية")]
    stack = [
        ("1", "Micro-credentials", "مسارات قصيرة مرتبطة بمهارة واضحة"),
        ("2", "International Certifications", "شهادات مهنية معترف بها عالميًا"),
        ("3", "Digital Badges", "إثبات رقمي قابل للمشاركة والتحقق"),
        ("4", "Project Portfolio", "مشروعات وتطبيقات وخبرات حقيقية"),
        ("5", "Employer Access", "شبكة شركات وفرص وتوجيه مهني"),
    ]
    outcomes = [("%", "Completion", "إتمام المسارات"), ("✓", "Certification", "اجتياز الاختبارات"), ("↗", "Internships", "فرص التدريب"), ("◆", "Employers", "شركاء التوظيف"), ("∞", "Alumni Value", "تفاعل الخريجين")]
    return f'''<section class="slide s6">
{top("06", "Career engine")}
{mast("Learn • Prove • Show • Connect • Work", "Certification &amp; Employability", "نحو خريج يمتلك دليلًا موثقًا على مهاراته")}
<div class="s6-grid">
  <div class="s6-copy">
    <div class="kicker">The employability promise</div>
    <h2 class="xl">Turn learning into<br><span class="grad">visible value.</span></h2>
    {ar("نربط التعلم بالاختبار والاعتماد والملف المهني، ثم نفتح للطالب أبواب التدريب والشركات والوظائف.","v lead")}
    <div class="lpw">{"".join(f'<div class="card lp"><span class="num">{n}</span><b>{e}</b>{ar(a,"d")}</div>' for n,e,a in lpw)}</div>
  </div>
  <div class="card">
    <div class="k">The evidence stack {ar("ملف الإنجاز","kar")}</div>
    {"".join(li(b,t,a) for b,t,a in stack)}
  </div>
</div>
<div class="outcomes">
  <div class="oc-h"><b>Success outcomes</b>{ar("مؤشرات تقيس القيمة وليس الحضور فقط","d")}</div>
  {"".join(f'<div class="oc"><span class="sym">{s}</span><b>{e}</b>{ar(a,"d")}</div>' for s,e,a in outcomes)}
</div>
{foot("", "The passport becomes a verified bridge between Uruk talent and employers", "")}
</section>'''


def slide7():
    opts = [
        ("Articulation", "معادلة واعتماد ساعات للانتقال إلى جامعة شريكة"),
        ("2+2 / 3+1 Models", "دراسة جزء في أوروك واستكمال البرنامج بالخارج"),
        ("Exchange &amp; Mobility", "فصل أو تدريب أو مشروع دولي للطالب"),
    ]
    dual = [
        ("Curriculum Alignment", "مواءمة المناهج ونواتج التعلم والساعات"),
        ("Joint Quality Governance", "حوكمة جودة ومراجعة أكاديمية مشتركة"),
        ("Two Awards", "درجتان وفق القواعد والاعتمادات المعمول بها"),
    ]
    flow = [
        ("01", "Prioritize", "اختيار 2-3 برامج ذات طلب مرتفع"),
        ("02", "Match", "تحديد الجامعات والشركاء الأنسب"),
        ("03", "Map", "مواءمة الساعات والمناهج والجودة"),
        ("04", "Approve", "الموافقات والتعاقد والحوكمة"),
        ("05", "Launch", "التسويق والقبول والتشغيل"),
    ]
    steps = "".join(
        f'<div class="fstep"><span class="num">{n}</span><b>{e}</b>{ar(a,"d")}</div>' + ('<i class="arrow">›</i>' if i < 4 else '')
        for i, (n, e, a) in enumerate(flow))
    return f'''<section class="slide s7">
{top("07", "Global pathways")}
{mast("Articulation • Exchange • Joint delivery • Dual degree", "Global Pathways &amp; Dual Degrees", "مسارات دولية تبدأ من أوروك وتنتهي بفرص عالمية")}
<div class="s7-grid">
  <div class="card">
    <div class="k">Pathway options {ar("الخيارات","kar")}</div>
    {"".join(f'<div class="opt"><b>{e}</b>{ar(a,"d")}</div>' for e,a in opts)}
  </div>
  <div class="bridge">
    <div class="bridge-row">
      <div class="node"><b>Uruk University</b>{ar("القاعدة الأكاديمية والطالب والبرنامج المحلي","d")}</div>
      <span class="swap">⇄</span>
      <div class="node"><b>Global Partner</b>{ar("الاعتماد الدولي والتنقل والدرجة الشريكة","d")}</div>
    </div>
    <div class="note wide">{ar("Aspire Gate تقود تحديد الشركاء، تصميم النموذج، تنسيق المسارات، ودعم التفاوض والتنفيذ — بينما تبقى الموافقات الأكاديمية والقانونية شرطًا أساسيًا لكل مسار.","v")}</div>
  </div>
  <div class="card">
    <div class="k">Dual degree model {ar("الدرجة المزدوجة","kar")}</div>
    {"".join(f'<div class="opt"><b>{e}</b>{ar(a,"d")}</div>' for e,a in dual)}
  </div>
</div>
<div class="flow">
  <div class="k">From opportunity to approved program {ar("من الفرصة إلى البرنامج المعتمد","kar")}</div>
  <div class="frow">{steps}</div>
</div>
{foot("", "Start with few high-value programs • Prove the model • Then scale", "")}
</section>'''


def slide8():
    path = [
        ("1", "Strategic Feasibility", "السوق، الولاية، الطلبة، البرامج، التمويل والشركاء"),
        ("2", "Legal &amp; Accreditation", "الكيان، الترخيص، الاعتماد والالتزام التنظيمي"),
        ("3", "Academic &amp; Operating Model", "الحوكمة، البرامج، أعضاء هيئة التدريس، الجودة والتقنية"),
        ("4", "Phased Launch", "شراكات وبرامج أولًا، ثم توسع مؤسسي مدروس"),
    ]
    models = [
        ("Learning &amp; Professional Center", "بداية مرنة للبرامج المهنية والتعليم المستمر"),
        ("Pathway College", "برامج انتقال ومسارات مرتبطة بشركاء أمريكيين"),
        ("Academic Affiliate", "تعاون أكاديمي أعمق ضمن إطار قانوني معتمد"),
        ("Private University", "المسار الكامل إذا أثبتت الجدوى والاعتماد ملاءمته"),
    ]
    return f'''<section class="slide s8">
{top("08", "U.S. platform")}
{mast("Feasibility • Legal &amp; accreditation • Academic model • Launch", "A U.S. University Platform — Built in Phases", "خيار استراتيجي للتوسع في الولايات المتحدة دون قفزة غير محسوبة")}
<div class="s8-grid">
  <div class="s8-copy">
    <div class="kicker">The strategic option</div>
    <h2 class="xl">Build the platform<br>before the <span class="grad">campus.</span></h2>
    {ar("يمكن لأوروك إنشاء حضور أكاديمي أمريكي تدريجي يدعم المسارات الدولية والبرامج المهنية والدرجات المشتركة، ثم يتطور وفق الجدوى والموافقات.","v lead")}
    <div class="note wide"><div class="k small">Why it matters</div>{ar("بوابة للشراكات والاعتماد الدولي، جذب طلبة جدد، خدمة الجاليات، وتعزيز القيمة العالمية لعلامة أوروك.","v")}</div>
  </div>
  <div class="concept">
    <div class="kicker">Proposed concept</div>
    <div class="concept-name">Uruk University <span class="grad">USA</span></div>
    {ar("اسم تصوري يخضع للدراسة القانونية والاعتماد","d")}
  </div>
  <div class="card">
    <div class="k">The four-stage feasibility path</div>
    {"".join(li(b,t,a) for b,t,a in path)}
  </div>
</div>
<div class="models">
  <div class="k">Models to evaluate {ar("نماذج يجب مقارنتها قبل القرار","kar")}</div>
  <div class="row4">{"".join(f'<div class="md"><b>{e}</b>{ar(a,"d")}</div>' for e,a in models)}</div>
</div>
{foot("Concept only — subject to independent legal, regulatory, accreditation, financial and academic feasibility.", "", "A phased decision reduces risk and builds evidence before major capital commitment")}
</section>'''


def slide9():
    days = [
        ("0-30", "Align &amp; Design", "الهوية، نموذج الشراكة، الأولويات، التسعير ومؤشرات النجاح"),
        ("31-60", "Build &amp; Prepare", "نسخة الجواز الأولى، 3-5 برامج، الشركاء وخطة التسويق"),
        ("61-90", "Launch &amp; Learn", "إطلاق Pilot، تسجيل أول دفعة، قياس التجربة والتحسين"),
    ]
    board = [
        ("Members", "العضويات النشطة"), ("Enrollments", "التسجيل والإيراد"), ("Credentials", "الشهادات والإنجاز"),
        ("Employers", "شركاء التدريب والعمل"), ("Pathways", "الشراكات الدولية"), ("Satisfaction", "تجربة الطالب والشريك"),
    ]
    return f'''<section class="slide dark s9">
{top("09", "The decision", True)}
{mast("Align • Design • Build • Launch • Measure • Scale", "Proposed Partnership &amp; 90-Day Launch", "من الرؤية إلى أول منتج يعمل ويحقق قيمة قابلة للقياس")}
<div class="s9-top">
  <div class="card own">
    <div class="k">Uruk University owns</div>
    {ar("العلامة، العلاقة مع الطالب، الأصول الأكاديمية، المحتوى الجامعي والقرار المؤسسي.","v")}
    <ul><li>Academic governance and approvals</li><li>Faculty and facilities</li><li>Student and alumni access</li><li>Local institutional relationships</li></ul>
  </div>
  <div class="times grad">×</div>
  <div class="card own">
    <div class="k">Aspire Gate builds &amp; operates</div>
    {ar("الاستراتيجية، تجربة الجواز، المنصة، المنتجات، الشراكات، التسويق والتشغيل والنمو.","v")}
    <ul><li>Product and commercial model</li><li>Technology and experience design</li><li>Certification and global partners</li><li>Launch, operations and performance</li></ul>
  </div>
</div>
<div class="days">
  <div class="k">The first 90 days {ar("أول 90 يومًا","kar")}</div>
  <div class="row3">{"".join(f'<div class="day"><span class="rng">{r}</span><b>{t}</b>{ar(a,"d")}</div>' for r,t,a in days)}</div>
</div>
<div class="s9-bottom">
  <div class="decision">
    <div class="kicker">The recommended decision</div>
    <h2>Approve a joint discovery<br>&amp; design <span class="grad">sprint.</span></h2>
    {ar("تشكيل فريق مشترك لمدة 30 يومًا لإقرار النموذج، اختيار أول المنتجات، وتحديد نطاق الـMVP والجدوى التجارية قبل أي التزام واسع.","v")}
    <span class="cta">Start with a 30-day executive sprint</span>
  </div>
  <div class="card board">
    <div class="k">What the board will see {ar("مؤشرات القرار","kar")}</div>
    <div class="grid2">{"".join(f'<div class="bd"><b>{e}</b>{ar(a,"d")}</div>' for e,a in board)}</div>
  </div>
</div>
{foot("", "Uruk University × Aspire Gate • One university • One passport • A world of opportunity", "")}
</section>'''


CSS = (HERE / "deck.css").read_text()

html = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Uruk LifeHub — Executive Proposal</title>
<link rel="stylesheet" href="fonts/fonts-static.css">
<style>{CSS}</style>
</head>
<body>
{slide1()}
{slide2()}
{slide3()}
{slide4()}
{slide5()}
{slide6()}
{slide7()}
{slide8()}
{slide9()}
</body>
</html>'''
OUT.write_text(html)
print("wrote", OUT, len(html), "bytes")
