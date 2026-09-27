#!/usr/bin/env python3
"""Generates show_body.html for the single-show deck (Arabic).

Run:  python3 show_content.py && python3 assemble_show.py
All program timings live in SEGMENTS; scene timecodes in SCENES.
"""

HOE = '<div class="hoe">House <i>of</i> Experience</div>'


def hdr(small, title):
    return f'<div class="hdr"><h1><small>{small}</small>{title}</h1>{HOE}</div>'


def ftr(pg):
    return ('<div class="ftr"><div><b>بدور سيجنتشر</b>بذرة التوقيع · عرض الكشف</div>'
            f'<div class="pg">{pg:02d}</div></div>')


def mmss(s):
    return f'{s // 60}:{s % 60:02d}'


# ---------------------------------------------------------------- program
# The client's rundown (سيناريو العرض), in order.
SEGMENTS = [
    dict(name='صعود الساحر', dur='15 ثانية', sec=15, img='show_18',
         note='بقعة ضوء تلتقطه وهو يصعد إلى المنتصف، ويرحّب بالحضور.'),
    dict(name='فقرة المنديل', dur='20 ثانية', sec=20, img='show_3',
         note='منديل يطير من يد ضيف في الطاولة الأولى إلى كفّ الساحر.'),
    dict(name='فتح الستارة الوسطى', dur='15 ثانية', sec=15, img='show_19',
         note='الستارة الوسطى وحدها تنفتح مع حركة يديه.'),
    dict(name='التوجّه إلى التوقيع وبدء التوقيع', dur='15 ثانية', sec=15, img='show_20',
         note='عصا من العدم، وتوقيع «Budoor» بالذهب على الجدار.'),
    dict(name='العودة إلى وسط المسرح', dur='5 ثوانٍ', sec=5, img='show_21',
         note='يعود إلى الطاولة والأصيص الفارغ في المنتصف.'),
    dict(name='البيانو', dur='20 ثانية', sec=20, img='show_22',
         note='الستارة اليسرى تنفتح، والنغمات ترسم أساسات المشروع.'),
    dict(name='التشيلو', dur='20 ثانية', sec=20, img='show_23',
         note='الستائر تخرج، والماء والخضرة يملآن الحديقة المركزية.'),
    dict(name='البذرة والنبتة والسقاية والختام', dur='35 ثانية', sec=35, img='show_25',
         note='بذرة برتقال تصير شجرة مثمرة، والمنديل يعود من داخل برتقالة.'),
    dict(name='استمرار الموسيقى بعد اكتمال الشجرة', dur='20 ثانية', sec=20, img='show_12',
         note='انحناءة، وجولة في المشروع الحقيقي حتى الشعار.'),
]
t = 0
for i, s in enumerate(SEGMENTS, 1):
    s['n'], s['start'], s['end'] = i, t, t + s['sec']
    t += s['sec']
TOTAL = t  # 165 s = 2:45
ACTS = [('الافتتاح والتوقيع', 1, 5), ('الموسيقى', 6, 7), ('البذرة والختام', 8, 9)]
SEG_COLORS = {1: '#141414', 2: '#2c2c2c', 3: '#141414', 4: '#2c2c2c', 5: '#141414',
              6: '#CC8C2E', 7: '#E0A54A', 8: '#1A311D', 9: '#3B5D44'}

# ---------------------------------------------------------------- storyboard
SCENES = [
    dict(seg=1, t0=0, t1=15, img='show_18', title='صعود الساحر', h3='الساحر يصعد إلى المسرح',
         stage='تنطفئ أضواء القاعة كلّها. بقعة ضوء واحدة تلتقط الساحر وهو يصعد إلى منتصف المسرح ويقف بجانب الطاولة والأصيص الفارغ، ثم يرحّب بالضيوف. البيانو يسارًا والتشيلو يمينًا في العتمة.',
         screen='ستارة مسرح سوداء مغلقة من ثلاث ألواح، مخملية، بلمعات ذهبية على طيّاتها وشعار ذهبي صغير على اللوح الأوسط.',
         sound='وتريات خافتة تتلاشى حين يبدأ الكلام. ميكروفون لاسلكي على الساحر، وبقعة الضوء 1 تتبعه.',
         sync='الكود الزمني يبدأ مع انطفاء آخر ضوء في القاعة. يصل الساحر إلى علامته في المنتصف عند الثانية الخامسة.',
         say='مساء الخير، وأهلًا بكم. الليلة لن تشاهدوا إطلاق مشروع؛ الليلة ستكونون جزءًا منه. مشروعٌ فريد يستحق كشفًا فريدًا.'),
    dict(seg=2, t0=15, t1=35, img='show_3', title='فقرة المنديل', h3='منديلٌ من الجمهور',
         stage='يطلب الساحر منديل جيب من الحضور. ضيف في الطاولة الأولى يرفع منديله، فيرفع الساحر كفّه من المسرح، ويطير المنديل من يد الضيف ويستقرّ في راحة يده.',
         screen='الستارة ما زالت مغلقة. ومضة ذهبية خفيفة تعبر طيّاتها لحظة وصول المنديل إلى الكف.',
         sound='نغمة بيانو واحدة عالية لحظة الالتقاط. بقعة ضوء خفيفة على الطاولة الأولى ثم تنطفئ.',
         sync='الخدعة مسرحية بالكامل: منديل متطابق يُسحب بخيط غير مرئي على بكرة، والضيف متّفق معه مسبقًا. الومضة تأتي بعد 8 إطارات من وصول المنديل.',
         say='ولأن كل شيء هنا يبدأ منكم، أحتاج شيئًا صغيرًا من أحدكم. من منكم يحمل منديل جيب؟ <i>(يرفع ضيف منديله)</i> ارفعه عاليًا… لا تتحرك. <i>(يرفع كفّه؛ يطير المنديل)</i> شكرًا لك. سأعيده إليك، أعدك… لكن ليس الآن.'),
    dict(seg=3, t0=35, t1=50, img='show_19', title='فتح الستارة الوسطى', h3='الستارة الوسطى تنفتح',
         stage='يضع الساحر المنديل في جيب صدره، ثم يرفع يديه معًا ويفتحهما ببطء كمن يفتح بابًا.',
         screen='تنفتح الستارة الوسطى وحدها مع حركة يديه، ويتسرّب منها ضوء ذهبي على المسرح. الستارتان اليمنى واليسرى تبقيان مغلقتين حتى دخول العازفَين.',
         sound='تصاعد وتريات يبلغ ذروته مع اكتمال الفتح. بقعة الساحر تتّسع قليلًا.',
         sync='سرعة فتح الستارة مرتبطة بسرعة يديه في البروفة؛ يفتحهما خلال أربع ثوانٍ بالضبط على عدّ الموسيقى.',
         say='لكل مشروعٍ عظيم لحظةٌ يُكشف فيها، ولحظتنا تبدأ الآن. <i>(يفتح يديه ببطء)</i> لنفتح الستارة.'),
    dict(seg=4, t0=50, t1=65, img='show_20', title='التوقيع', h3='عصا من العدم، وتوقيعٌ بالذهب',
         stage='تظهر عصا ذهبية في يد الساحر من لا شيء. يتوجّه بها نحو الجدار ويوقّع في الهواء أمام الستارة المفتوحة، وهو يتحدث عن البصمة والتوقيع.',
         screen='توقيع ذهبي ضخم يُكتب بالضوء في منتصف الجدار مع حركة العصا، ضربةً بضربة، حتى تكتمل كلمة «Budoor» بخط ذهبي انسيابي.',
         sound='بيانو منفرد خافت تحت الكلام. شرارة ضوئية عند طرف العصا، وبقعة الضوء تتبعه إلى الجدار.',
         sync='العصا تظهر بآلية نابض. علامة أرضية أمام الجدار على بعد متر منه؛ التوقيع ست ضربات محفوظة، كل ضربة بعد 6 إطارات من حركة اليد.',
         say='<i>(تظهر العصا)</i> كلٌّ منّا يحمل ما لا يحمله غيره: بصمة إصبعه، بصمة عينه… وتوقيعه. وكما لا يتطابق توقيعان في العالم، لا ينبغي أن يتطابق بيتان.'),
    dict(seg=5, t0=65, t1=70, img='show_21', title='العودة إلى وسط المسرح', h3='العودة إلى المنتصف',
         stage='يلتفت الساحر عن الجدار ويعود إلى منتصف المسرح بجانب الطاولة والأصيص الفارغ، ووجهه إلى الجمهور والعصا في يده.',
         screen='التوقيع الذهبي يتوهّج في الوسط. الستارتان الجانبيتان ما زالتا مغلقتين.',
         sound='البيانو يصمت لحظة؛ صوته وحده في القاعة. بقعة الضوء 1 تعود معه إلى المنتصف.',
         sync='خمس ثوانٍ فقط: يصل إلى علامته في المنتصف مع آخر كلمة، لتبدأ فقرة البيانو فورًا.',
         say='<i>(يعود إلى المنتصف)</i> بدور سيجنتشر تبني بيتك على شخصيتك وذوقك أنت… بيتٌ يشبهك، حتى التوقيع.'),
    dict(seg=6, t0=70, t1=90, img='show_22', title='البيانو والأساسات', h3='الإشارة الأولى: يسار المسرح',
         stage='يدير الساحر ظهره للجمهور ويشير بالعصا إلى يسار المسرح. تنفتح بقعة ضوء على عازف البيانو فيبدأ العزف، وبحركة من يده يطير طائر أبيض من لا شيء. الأصيص ما زال فارغًا.',
         screen='تنفتح الستارة اليسرى، ويسيل حبر التوقيع مع نغمات البيانو ليرسم أساسات المشروع الحقيقي بخطوط ذهبية: صفوف الفلل والشوارع على جانبي الحديقة المركزية.',
         sound='البيانو الحيّ يدخل على نقرة إيقاع. بقعة الضوء 2 تُطلق مع إشارة العصا.',
         sync='البقعة والستارة تُطلقان من الكود الزمني عند 1:10؛ الساحر يشير على العدّ لا العكس. الطائر من جيب مخفي في الصدرية.',
         say='كل بيت يبدأ بأساس… <i>(يشير إلى يسار المسرح؛ يطير الطائر الأول)</i> وكل أساسٍ له لحن.'),
    dict(seg=7, t0=90, t1=110, img='show_23', title='التشيلو والماء', h3='الإشارة الثانية: يمين المسرح',
         stage='يشير الساحر بالعصا إلى يمين المسرح، ويطير طائر ثانٍ من كُمّه. تنفتح بقعة ضوء على عازفة التشيلو فتعزف مع البيانو. الأصيص ما زال فارغًا.',
         screen='تنفتح الستارة اليمنى حتى تخرج الستائر كلّها من الشاشة. نغمات التشيلو تصير ماءً يجري في قناة الحديقة المركزية، والخضرة والنخيل تنمو على طولها بين صفوف الفلل الذهبية.',
         sound='البيانو والتشيلو معًا، واللحن يتّسع. بقعة الضوء 3 تُطلق مع الإشارة.',
         sync='الطائر الثاني من جيب الكُمّ. الماء يرتفع مع كل جملة موسيقية، والخضرة تنمو على إيقاع البيانو.',
         say='ثم يأتي الماء… وتأتي الخضرة. <i>(يشير إلى يمين المسرح؛ يطير الطائر الثاني)</i>'),
    dict(seg=8, t0=110, t1=120, img='show_24', title='البذرة', h3='برتقالةٌ وبذرة',
         stage='تهدأ الموسيقى. يعود الساحر إلى الطاولة، يفتح برتقالة ويأخذ منها بذرة واحدة ويضعها في الأصيص تحت بقعة ضوء ضيّقة، وهو يتحدث عن البذرة والاستثمار.',
         screen='يخفت الجدار إلى وهج هادئ يبقى فيه المخطط الذهبي والحديقة ظاهرَين، ليبقى الانتباه على الطاولة.',
         sound='العازفان بأخفض صوت تحت الكلام. بقعة ضيّقة دافئة على الأصيص واليدين.',
         sync='خفوت الجدار عند 1:50 على الكود الزمني؛ يجعل ظهور النبتة بعده أقوى.',
         say='وكل هذا يبدأ من بذرة. <i>(يفتح البرتقالة ويأخذ بذرة)</i> من يستثمر مع بدور يرى استثماره يكبر أمام عينيه، ويأكل من ثمره. <i>(يضع البذرة في الأصيص)</i> فالاستثمار الجيد… يشبه السحر.'),
    dict(seg=8, t0=120, t1=128, img='show_25', title='صعود النبتة', h3='شيءٌ يظهر من لا شيء',
         stage='يتوقف الساحر عن الكلام. يرفع يده فوق الأصيص، فتظهر نبتة خضراء من التربة وترتفع أمام الجمهور.',
         screen='في منتصف الحديقة المركزية تظهر النبتة نفسها من العدم بحجم عملاق، تتوهّج بالذهبي والأخضر، وتنمو بإيقاع النبتة الحقيقية.',
         sound='نغمة ممدودة تصعد مع النمو. بقعة الأصيص تتّسع، ويعود الجدار إلى سطوعه.',
         sync='مجسّم شجرة ميكانيكي مطويّ داخل الأصيص يرتفع بمحرّك سيرفو خلال ثماني ثوانٍ بإشارة من المؤدّي. نبتة الجدار تبدأ بعد 10 إطارات من تحرّكه.',
         say='<i>(صمت. يرفع يده فوق الأصيص… والنبتة وحدها تتكلّم.)</i>'),
    dict(seg=8, t0=128, t1=136, img='show_10', title='سقي الزرعة', h3='ماءٌ حقيقي، وثمرٌ حقيقي',
         stage='يحمل الساحر المرشّة الذهبية ويسقي النبتة بماء حقيقي وهو يواجه الجمهور. تكبر الشجرة، وتظهر عليها ثمار برتقال حقيقية.',
         screen='ماء ذهبي ينسكب نحو الشجرة العملاقة فتنمو وتمتدّ جذورها وأغصانها في المخطط، وتتحوّل صفوف الفلل من خطوط ذهبية إلى فلل حقيقية صفًّا بعد صف.',
         sound='ذروة اللحن. البقع الثلاث مضاءة، والجدار في أقصى سطوعه.',
         sync='الماء الذهبي يتدفّق فقط حين تميل المرشّة؛ صينية مخفيّة داخل الأصيص. الثمار مثبّتة على المجسّم وتنكشف في آخر مراحل ارتفاعه.',
         say='وحين تسقيها بالوقت… وبالثقة، <i>(يسقي)</i> تعطيك ثمرها.'),
    dict(seg=8, t0=136, t1=145, img='show_11', title='الختام', h3='البرتقالة والمنديل',
         stage='يقطف الساحر برتقالة من الشجرة ويفتحها، فيُخرج من داخلها المنديل نفسه الذي طار من يد الضيف في بداية العرض، ويعيده إليه.',
         screen='المشروع كاملًا كما في اللقطة الجوية الحقيقية، والشعار الذهبي «Budoor Signature» يظهر في منتصف الجدار مع الجملة الأخيرة.',
         sound='النغمات الأخيرة. أشعة ذهبية من الجسر المعلّق مع ظهور الشعار.',
         sync='البرتقالة المعدّة مثبّتة على الغصن الأمامي ومحمّلة بالمنديل المتطابق قبل العرض. الشعار يُطلق مع «بدور سيجنتشر» عند 2:22.',
         say='وعدتك أن أعيده يا سيدي. <i>(يقطف برتقالة ويفتحها ويُخرج المنديل)</i> ها هو منديلك… بعد أن كبر. سيداتي وسادتي: بدور سيجنتشر.'),
    dict(seg=9, t0=145, t1=165, img='show_12', title='استمرار الموسيقى', h3='الانحناءة، والموسيقى تكمل',
         stage='ينحني الساحر للجمهور، ويواصل العازفان العزف عشرين ثانية بعد اكتمال الشجرة. الشجرة المثمرة تبقى في المنتصف تحت الضوء.',
         screen='جولة بطيئة في المشروع الحقيقي: اللقطة الجوية، ثم ساحة المدخل «The Signature»، ثم الفيلا عند الغروب، ثم العودة إلى اللقطة الجوية والشعار في المنتصف.',
         sound='البيانو والتشيلو يكملان لحن الإعلان تحت التصفيق. قصاصات ذهبية مع الانحناءة، ثم تعود إضاءة القاعة تدريجيًا.',
         sync='مقطع انتظار قابل للتكرار من 2:45 حتى صعود الرئيس التنفيذي. الشجرة تبقى على المسرح كلّ الليلة دليلًا حيًّا.',
         say='<i>(ينحني. لا كلام؛ العازفان يكملان عشرين ثانية، والجدار يأخذ الحضور في جولة داخل المشروع حتى الشعار.)</i>'),
]
assert SCENES[-1]['t1'] == TOTAL

# ---------------------------------------------------------------- script
SCRIPT_AR = [
    (5, 'مساء الخير، وأهلًا بكم. الليلة لن تشاهدوا إطلاق مشروع؛ الليلة ستكونون جزءًا منه. مشروعٌ فريد يستحق كشفًا فريدًا.'),
    (15, 'ولأن كل شيء هنا يبدأ منكم، أحتاج شيئًا صغيرًا من أحدكم. من منكم يحمل منديل جيب؟ <i>(يرفع ضيف منديله)</i> ارفعه عاليًا… لا تتحرك. <i>(يرفع كفّه؛ يطير المنديل)</i> شكرًا لك. سأعيده إليك، أعدك… لكن ليس الآن.'),
    (35, 'لكل مشروعٍ عظيم لحظةٌ يُكشف فيها، ولحظتنا تبدأ الآن. <i>(يفتح يديه ببطء)</i> لنفتح الستارة.'),
    (50, '<i>(تظهر العصا؛ يتوجّه إلى الجدار)</i> كلٌّ منّا يحمل ما لا يحمله غيره: بصمة إصبعه، بصمة عينه… وتوقيعه. وكما لا يتطابق توقيعان في العالم، لا ينبغي أن يتطابق بيتان.'),
    (65, '<i>(يعود إلى المنتصف)</i> بدور سيجنتشر تبني بيتك على شخصيتك وذوقك أنت… بيتٌ يشبهك، حتى التوقيع.'),
    (70, 'كل بيت يبدأ بأساس… <i>(يشير إلى يسار المسرح؛ يطير الطائر الأول)</i> وكل أساسٍ له لحن.'),
    (90, 'ثم يأتي الماء… وتأتي الخضرة. <i>(يشير إلى يمين المسرح؛ يطير الطائر الثاني)</i>'),
    (110, 'وكل هذا يبدأ من بذرة. <i>(يفتح البرتقالة ويأخذ بذرة)</i> من يستثمر مع بدور يرى استثماره يكبر أمام عينيه، ويأكل من ثمره. <i>(يضع البذرة في الأصيص)</i> فالاستثمار الجيد… يشبه السحر.'),
    (120, '<i>(صمت. يرفع يده فوق الأصيص. تصعد النبتة.)</i>'),
    (128, 'وحين تسقيها بالوقت… وبالثقة، <i>(يسقي)</i> تعطيك ثمرها.'),
    (136, 'وعدتك أن أعيده يا سيدي. <i>(يقطف برتقالة ويفتحها ويُخرج المنديل)</i> ها هو منديلك… بعد أن كبر.'),
    (142, 'سيداتي وسادتي: بدور سيجنتشر.'),
    (145, '<i>(انحناءة. العازفان يكملان عشرين ثانية حتى صعود الرئيس التنفيذي.)</i>'),
]
SCRIPT_EN = [
    (5, 'Good evening, and welcome. Tonight you will not watch a launch. Tonight you will be part of one. A unique project deserves a unique reveal.'),
    (15, 'And because everything here begins with you, I need one small thing from one of you. Who has a pocket square? <i>(a guest raises one)</i> Hold it high. Don\'t move. <i>(he raises his palm; the square flies)</i> Thank you. I will give it back, I promise. Just not yet.'),
    (35, 'Every great project has its moment of reveal, and ours begins now. <i>(opens his hands slowly)</i> Let\'s open the curtain.'),
    (50, '<i>(the baton appears; he walks to the wall)</i> Each of us carries what no one else does: a fingerprint, the iris of an eye, a signature. And just as no two signatures in the world are alike, no two homes should be.'),
    (65, '<i>(back to centre)</i> Budoor Signature builds your home around you. A home that looks like you, down to the signature.'),
    (70, 'Every home begins with a foundation. <i>(points stage left; first dove)</i> And every foundation has a melody.'),
    (90, 'Then comes the water, and then the green. <i>(points stage right; second dove)</i>'),
    (110, 'And all of this begins with a seed. <i>(opens the orange, takes a seed)</i> Whoever invests with Budoor watches that investment grow before their eyes, and eats from its fruit. <i>(plants the seed)</i> Because a good investment is just like magic.'),
    (120, '<i>(Silence. His hand hovers over the planter. The plant rises.)</i>'),
    (128, 'And when you water it with time, and with trust, <i>(pours)</i> it gives you its fruit.'),
    (136, 'I promised I would give it back, sir. <i>(picks an orange, opens it, takes out the pocket square)</i> Here is your pocket square, a little grown up.'),
    (142, 'Ladies and gentlemen: Budoor Signature.'),
    (145, '<i>(Bow. The musicians play on for twenty seconds until the CEO takes the stage.)</i>'),
]

# ---------------------------------------------------------------- cue sheet
CUES = [
    (0, 'الساحر يصعد إلى المسرح ويرحّب', 'ستارة مغلقة من ثلاث ألواح', 'بقعة 1 تتبعه', 'وتريات خافتة، ثم صوته', 'ميكروفون لاسلكي'),
    (15, 'المنديل يطير من يد الضيف', 'ومضة ذهبية على الستارة', 'لمسة على الطاولة الأولى', 'نغمة بيانو واحدة', 'خيط وبكرة، ضيف متّفق معه'),
    (35, 'إشارة الفتح', 'الستارة الوسطى تنفتح وحدها', 'بقعة 1 تتّسع', 'تصاعد وتريات', 'يدا الساحر على العدّ'),
    (50, 'يتوجّه إلى الجدار ويوقّع بالعصا', 'توقيع Budoor يُكتب في الوسط', 'بقعة 1 تتبعه', 'بيانو خافت تحت الكلام', 'عصا نابض؛ 6 ضربات محفوظة'),
    (65, 'يعود إلى وسط المسرح', 'التوقيع يتوهّج', 'بقعة 1 تعود معه', 'صوته فقط', 'علامة أرضية في المنتصف'),
    (70, 'إشارة يسارًا، الطائر الأول', 'الستارة اليسرى تنفتح، أساسات ذهبية', 'بقعة 2 على البيانو', 'بيانو حيّ على نقرة', 'جيب مخفي في الصدرية'),
    (90, 'إشارة يمينًا، الطائر الثاني', 'الستائر تخرج، ماء وحديقة', 'بقعة 3 على التشيلو', 'بيانو وتشيلو', 'جيب الكُمّ'),
    (110, 'برتقالة، بذرة في الأصيص', 'يخفت إلى وهج هادئ', 'بقعة ضيّقة على الأصيص', 'الموسيقى تهدأ', '—'),
    (120, 'اليد فوق الأصيص، النبتة تصعد', 'النبتة تظهر في منتصف الحديقة', 'البقعة تتّسع', 'نغمة ممدودة', 'مجسّم سيرفو، 8 ثوانٍ'),
    (128, 'السقاية، الثمار تظهر', 'ماء ذهبي، الفلل تصير حقيقة', 'البقع الثلاث', 'ذروة اللحن', 'صينية مخفيّة، مرحلة الثمار'),
    (136, 'برتقالة، المنديل يعود، «بدور سيجنتشر»', 'المشروع كاملًا والشعار', 'أشعة ذهبية', 'النغمات الأخيرة', 'برتقالة معدّة'),
    (145, 'انحناءة، العازفان يكملان', 'جولة في المشروع ثم الشعار', 'قصاصات ذهبية', 'الموسيقى 20 ثانية', 'خادم الوسائط على الكود الزمني'),
    (165, 'صعود الرئيس التنفيذي', 'الشعار ثابت', 'إضاءة القاعة تعود', 'لحن الإعلان', 'مقطع انتظار قابل للتكرار'),
]

# ---------------------------------------------------------------- screen states
STATES = [
    ('show_13', 0, 35, 'الستارة المغلقة من ثلاث ألواح، بلمعات ذهبية وشعار صغير في الوسط.'),
    ('show_26', 35, 70, 'الستارة الوسطى تنفتح وحدها، والتوقيع الذهبي «Budoor» يُكتب فيها مع يد الساحر.'),
    ('show_27', 70, 90, 'الستارة اليسرى تنفتح؛ حبر التوقيع يسيل مع نغمات البيانو ويرسم أساسات المخطط الحقيقي.'),
    ('show_28', 90, 110, 'الستائر تخرج كلّها؛ نغمات التشيلو تصير ماءً في قناة الحديقة، والخضرة تنمو على طولها.'),
    ('show_16', 110, 136, 'يخفت الجدار مع البذرة، ثم تظهر النبتة في منتصف الحديقة، والماء الذهبي يسقيها فتتحوّل الفلل إلى حقيقة.'),
    ('show_17', 136, 145, 'المشروع كاملًا كما في اللقطة الجوية الحقيقية، والشعار يظهر مع «بدور سيجنتشر».'),
]
TOUR = [('aerial', 'اللقطة الجوية'), ('entrance', 'ساحة المدخل «The Signature»'), ('villa', 'الفيلا عند الغروب')]

# ================================================================ pages
P = []

P.append('''
<!-- COVER -->
<section class="page dark">
  <div class="full" style="background-image:url(img/show_0.jpg)"></div>
  <div class="fade"></div>
  <div style="position:absolute;left:120px;top:88px;display:flex;gap:16px;align-items:center">
    <span class="hoe" style="margin:0">Nofakha &nbsp;·&nbsp; House <i>of</i> Experience</span>
  </div>
  <div style="position:absolute;right:120px;top:88px" class="hoe ar">عرض الكشف الرسمي &nbsp;·&nbsp; شاشة المسرح الرئيسي</div>
  <div style="position:absolute;left:120px;bottom:150px;right:120px;display:flex;justify-content:space-between;align-items:flex-end">
    <div>
      <div class="kicker" style="color:var(--gold2);margin-bottom:22px;font-size:20px">بدور سيجنتشر &nbsp;·&nbsp; عرض واحد متصل &nbsp;·&nbsp; %(total)s</div>
      <h1 style="font-size:124px;font-weight:700;letter-spacing:0;line-height:1.15;color:#fff">بذرة<br>التوقيع</h1>
      <p style="margin-top:30px;font-size:24px;line-height:1.65;color:#e6e6e6;max-width:860px">ساحر واحد يتكلّم، بيانو وتشيلو، وبذرة تصير مدينة. عرض متصل على جدار LED الرئيسي يجمع الأفكار الثلاث في قصة واحدة: التوقيع، والموسيقى، والبذرة.</p>
    </div>
    <div style="text-align:left;color:#fff">
      <div class="wm" dir="ltr" style="font-size:54px;display:inline-block">BUDOOR<small>Signature</small></div>
      <div style="margin-top:44px;font-size:15px;line-height:2;color:#bdbdbd;letter-spacing:0;text-align:right">
        <div><span style="color:#7d7d7d">العميل</span>&nbsp;&nbsp; بدور بغداد</div>
        <div><span style="color:#7d7d7d">الفعالية</span>&nbsp;&nbsp; إطلاق مشروع عقاري &nbsp;·&nbsp; 28 آب 2026</div>
        <div><span style="color:#7d7d7d">الجمهور</span>&nbsp;&nbsp; مستثمرون، عملاء، إعلام &nbsp;·&nbsp; 250 ضيفًا</div>
      </div>
    </div>
  </div>
</section>
''' % {'total': mmss(TOTAL)})

P.append(f'''
<!-- OVERVIEW -->
<section class="page">
  {hdr('01 — العرض في سطر', 'بذرة واحدة، قصة واحدة، مدينة كاملة.')}
  <div class="grid" style="display:grid;grid-template-columns:1.05fr .95fr;gap:64px">
    <div>
      <div class="img" style="height:470px;background-image:url(img/show_2.jpg)"></div>
      <div style="margin-top:16px;font-size:14px;color:var(--mute)">الساحر في منتصف المسرح، الطاولة والأصيص الفارغ بجانبه، عازف البيانو يسارًا، وعازفة التشيلو يمينًا. الجدار كلّه فيلم مُعدّ مسبقًا يستجيب لإشاراته.</div>
      <div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:34px">
        <span class="pill">{mmss(TOTAL)} دقيقة</span><span class="pill">9 فقرات</span><span class="pill">12 مشهدًا</span><span class="pill">مؤدٍّ واحد يتكلّم</span><span class="pill">عازفان</span><span class="pill">6 خدع</span><span class="pill">مُقفَل على الكود الزمني</span>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:26px">
      <p class="lead">بدلًا من ثلاث أفكار منفصلة، عرضٌ واحد يرويه ساحر بصوته أمام الحضور: يبدأ بمنديل من الجمهور، ويمرّ بالتوقيع، ثم بالموسيقى، ثم ببذرة برتقال تصير شجرة، وينتهي بثمرة في داخلها المنديل نفسه.</p>
      <div class="rule"></div>
      <div class="body">
        <p style="margin-bottom:14px"><b style="color:var(--ink)">الفكرة.</b> كل إنسان له توقيع لا يشبه غيره، وبدور سيجنتشر تبني البيت على شخصية صاحبه. والاستثمار الجيد مثل البذرة: تضعها في الأرض الصحيحة فتراها تكبر وتأكل من ثمرها.</p>
        <p style="margin-bottom:14px"><b style="color:var(--ink)">الجدار.</b> ستارة مغلقة بلمعات ذهبية، ثم ستارة وسطى تنفتح على توقيع ذهبي يُكتب مع يد الساحر، ثم نغمات البيانو والتشيلو ترسم أساسات المشروع وماءه وحدائقه، ثم نبتة تظهر من العدم ويسقيها الماء الذهبي حتى يكتمل المشروع والشعار في المنتصف.</p>
        <p><b style="color:var(--ink)">الوعد.</b> الجمهور لا يشاهد الإطلاق، بل يشارك فيه: المنديل الذي يرتفع من الطاولة الأولى يعود في نهاية العرض من داخل برتقالة نمت على المسرح.</p>
      </div>
    </div>
  </div>
  {ftr(2)}
</section>
''')

# ---- program page
cards = []
for s in SEGMENTS:
    cards.append(f'''      <div class="pc">
        <div class="img" style="background-image:url(img/{s['img']}.jpg)"></div>
        <div class="pn">{s['n']}</div>
        <h4>{s['name']}</h4>
        <p>{s['note']}</p>
        <div class="pd"><b>{s['dur']}</b><span>{mmss(s['start'])} – {mmss(s['end'])}</span></div>
      </div>''')
acts = ''.join(
    f'<div style="flex:{sum(x["sec"] for x in SEGMENTS[a - 1:b])}"><span>{name}</span></div>'
    for name, a, b in ACTS)
segs = ''.join(
    f'<div style="flex:{s["sec"]};background:{SEG_COLORS[s["n"]]};color:{"#141414" if s["n"] in (6, 7) else "#fff"}">{s["n"]}</div>'
    for s in SEGMENTS)
ACT_TEXT = [
    'الساحر يصعد ويرحّب، المنديل يطير من يد ضيف، الستارة الوسطى تنفتح، وتوقيع «Budoor» يُكتب بالذهب، ثم يعود إلى المنتصف.',
    'البيانو يفتح الستارة اليسرى ويرسم أساسات المشروع، والتشيلو يفتح اليمنى ويملأ الحديقة بالماء والخضرة.',
    'بذرة تصير شجرة مثمرة يسقيها الماء الذهبي حتى يكتمل المشروع، والمنديل يعود من داخل برتقالة، ثم عشرون ثانية من الموسيقى وجولة في المشروع.',
]
pacts = ''
for (name, a, b), txt in zip(ACTS, ACT_TEXT):
    t0, t1 = SEGMENTS[a - 1]['start'], SEGMENTS[b - 1]['end']
    pacts += (f'<div style="flex:{t1 - t0}"><b>{name}</b><span><i class="ltr">{mmss(t0)} – {mmss(t1)}</i> · {t1 - t0} ثانية</span><p>{txt}</p></div>')
bounds = [0] + [s['end'] for s in SEGMENTS]
ticks = ''.join(
    f'<span style="right:{b / TOTAL * 100:.3f}%;transform:translateX({0 if b == 0 else (100 if b == TOTAL else 50)}%)">{mmss(b)}</span>'
    for b in bounds)
P.append(f'''
<!-- PROGRAM -->
<section class="page">
  {hdr('02 — سيناريو العرض', f'تسع فقرات في دقيقتين و{TOTAL % 60} ثانية')}
  <div class="grid prog">
    <div class="pcards">
{chr(10).join(cards)}
    </div>
    <div class="pbar">
      <div class="acts">{acts}</div>
      <div class="segs">{segs}</div>
      <div class="ticks">{ticks}</div>
    </div>
    <div class="psum"><b>المجموع {mmss(TOTAL)}</b> · يبقى من فقرة الخمس دقائق {mmss(300 - TOTAL)} لصعود الرئيس التنفيذي على الجدار نفسه.</div>
    <div class="pacts">{pacts}</div>
  </div>
  {ftr(3)}
</section>
''')

P.append(f'''
<!-- STAGE PLAN -->
<section class="page">
  {hdr('03 — خريطة المسرح', 'من يقف أين')}
  <div class="grid" style="display:grid;grid-template-columns:1.15fr .85fr;gap:64px">
    <div class="plan">
      <div class="wall"><span>جدار LED المنحني · 25 م · ثلاث ستائر: يسرى، وسطى، يمنى · فيلم مُعدّ مسبقًا على الكود الزمني</span></div>
      <div class="floor">
        <div class="spot"><i>3</i><b>عازفة التشيلو</b><span>يمين المسرح · بقعة ضوء 3</span></div>
        <div class="spot mag"><i>1</i><b>الساحر</b><span>المنتصف · بقعة ضوء 1</span><em>الطاولة والأصيص على علامة أرضية تحت عمود البكسلات المركزي · علامة التوقيع أمام الجدار</em></div>
        <div class="spot"><i>2</i><b>عازف البيانو</b><span>يسار المسرح · بقعة ضوء 2</span></div>
      </div>
      <div class="aud">الجمهور · 250 ضيفًا · الطاولة الأولى: ضيف المنديل</div>
      <div class="cam">الكاميرا الرئيسية · المنتصف · 12 م · بارتفاع الهاتف</div>
    </div>
    <div class="spec">
      <div><h4>الأشخاص</h4><ul>
        <li><em>الساحر</em>مؤدٍّ ومقدّم في آن؛ بدلة ذيل سوداء فيكتورية، صدرية، قميص بياقة مجنّحة، ربطة حريرية داكنة، عصا ذهبية</li>
        <li><em>عازف البيانو</em>بيانو أبيض كبير، يسار المسرح، يعزف على نقرة إيقاع</li>
        <li><em>عازفة التشيلو</em>يمين المسرح، فستان داكن أنيق، لاقط لاسلكي</li>
      </ul></div>
      <div><h4>الأدوات</h4><ul>
        <li><em>الطاولة</em>مستديرة سوداء صغيرة، عليها أصيص بحافة ذهبية وتربة داكنة</li>
        <li><em>الشجرة</em>مجسّم شجرة برتقال ميكانيكي داخل الأصيص، بثمار حقيقية، يرتفع بإشارة المؤدّي</li>
        <li><em>المنديل</em>منديلا جيب متطابقان؛ أحدهما لدى ضيف الطاولة الأولى، والآخر داخل البرتقالة المعدّة</li>
        <li><em>البرتقال</em>برتقالة للبذرة، وبرتقالة معدّة ومغلقة بداخلها المنديل</li>
        <li><em>الطيور</em>حمامتان بيضاوان في جيبين مخفيين بالكُمّ والصدرية</li>
        <li><em>المرشّة</em>ذهبية، ماء حقيقي، صينية مخفيّة داخل الأصيص</li>
      </ul></div>
      <div><h4>الإضاءة</h4><ul>
        <li><em>ثلاث بقع</em>واحدة لكل مؤدٍّ، تُطلق من الكود الزمني نفسه الذي يشغّل الجدار</li>
        <li><em>بقعة ضيّقة</em>على الطاولة والأصيص في مشهدي البذرة والسقاية</li>
      </ul></div>
    </div>
  </div>
  {ftr(4)}
</section>
''')

pg = 5
for i, sc in enumerate(SCENES, 1):
    seg = SEGMENTS[sc['seg'] - 1]
    P.append(f'''
<!-- STORYBOARD {i} -->
<section class="page">
  {hdr(f'04 — لوحة المشاهد · المشهد {i} من {len(SCENES)}', sc['title'])}
  <div class="grid sb">
    <div class="img" style="background-image:url(img/{sc['img']}.jpg)"></div>
    <div class="say"><h4>ما يقوله الساحر</h4><p>{sc['say']}</p></div>
    <div class="txt">
      <div class="seg"><b>الفقرة {seg['n']} من 9</b> · {seg['name']} · {seg['dur']}</div>
      <div class="tcbig">{mmss(sc['t0'])} – {mmss(sc['t1'])}</div>
      <h3>{sc['h3']}</h3>
      <div class="blk"><h4>على المسرح</h4><p>{sc['stage']}</p></div>
      <div class="blk"><h4>على الشاشة</h4><p>{sc['screen']}</p></div>
      <div class="blk"><h4>الصوت والإضاءة</h4><p>{sc['sound']}</p></div>
      <div class="cue"><b>المزامنة</b>{sc['sync']}</div>
    </div>
  </div>
  {ftr(pg)}
</section>
''')
    pg += 1

st_html = ''.join(
    f'<div class="st"><div class="img" style="background-image:url(img/{im}.jpg)"></div>'
    f'<div class="t"><b>{mmss(a)} – {mmss(b)}</b>{txt}</div></div>'
    for im, a, b, txt in STATES)
tour_html = ''.join(
    f'<div class="tr"><div class="img" style="background-image:url(img/{im}.jpg)"></div><span>{cap}</span></div>'
    for im, cap in TOUR)
P.append(f'''
<!-- SCREEN STATES -->
<section class="page">
  {hdr('05 — ما يعرضه الجدار', 'من الستارة المغلقة إلى المشروع كاملًا')}
  <div class="grid states">
    {st_html}
    <div class="tour"><div class="tl"><b>{mmss(145)} – {mmss(165)}</b><h4>جولة في المشروع الحقيقي</h4><p>مع استمرار الموسيقى، يمرّ الجدار ببطء على صور المشروع نفسها، ثم يعود إلى اللقطة الجوية والشعار حتى صعود الرئيس التنفيذي.</p></div>{tour_html}</div>
  </div>
  {ftr(pg)}
</section>
''')
pg += 1

rows = ''.join(
    f'<tr><td>{mmss(a)}</td><td>{b}</td><td>{c}</td><td>{d}</td><td>{e}</td><td>{f}</td></tr>\n      '
    for a, b, c, d, e, f in CUES)
P.append(f'''
<!-- CUE SHEET -->
<section class="page">
  {hdr('06 — ورقة الإشارات', 'كل شيء على ساعة واحدة')}
  <div class="grid">
    <table class="cues">
      <tr><th>الزمن</th><th>المسرح</th><th>الشاشة</th><th>الإضاءة</th><th>الصوت</th><th>الآلية</th></tr>
      {rows}
    </table>
  </div>
  {ftr(pg)}
</section>
''')
pg += 1

P.append(f'''
<!-- PRODUCTION -->
<section class="page">
  {hdr('07 — الإنتاج', 'ما نقدّمه، وما نحتاج إليه')}
  <div class="grid" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:56px">
    <div class="spec">
      <div><h4>المخرجات</h4><ul>
        <li><em>فيلم الجدار</em>{mmss(TOTAL)} على خريطة البكسلات الأصلية للجدار المنحني والقطعة المركزية، 25 إطارًا في الثانية، مع مقطع انتظار نهائي</li>
        <li><em>الكود الزمني</em>مسار SMPTE مع ورقة إشارات للإضاءة والقصاصات ونقرة الإيقاع</li>
        <li><em>نسخة البروفة</em>نسخة مصغّرة مع العدّ التمهيدي والإشارات الصوتية للساحر والعازفين</li>
        <li><em>نسخة السوشيال</em><span>نسخة عمودية <span class="ltr">9:16</span> من زاوية الكاميرا الرئيسية لمنشورات الليلة</span></li>
      </ul></div>
    </div>
    <div class="spec">
      <div><h4>الفريق</h4><ul>
        <li><em>الساحر</em><span>ساحر مسرحي محترف يجيد التقديم بالعربية والإنجليزية؛ 3 أيام بروفات على إسقاط <span class="ltr">1:1</span> ويومان على الجدار الحقيقي</span></li>
        <li><em>الموسيقى</em>عازف بيانو وعازفة تشيلو؛ مؤلّف الإعلان التلفزيوني يمدّد اللحن إلى {mmss(TOTAL)}</li>
        <li><em>الشاشة</em>فريق ثلاثي الأبعاد وموشن يعمل من المخطط الرئيسي وصور المشروع وأصول الإعلان</li>
        <li><em>الأدوات</em>ورشة مجسّمات لبناء الشجرة الميكانيكية والأصيص خلال 3 أسابيع</li>
      </ul></div>
    </div>
    <div class="spec">
      <div><h4>الخطوات التالية</h4><ul>
        <li><em>الأسبوع 1</em>اعتماد السيناريو والنص والقصة المصوّرة؛ تأكيد الساحر والعازفين</li>
        <li><em>الأسبوع 1</em>خريطة بكسلات الشاشة ومخطط المسرح وعلامات الأرض من الفريق التقني</li>
        <li><em>الأسبوع 2</em>الأنيماتيك مع الصوت؛ بدء بناء الشجرة والأدوات؛ بدء البروفات</li>
        <li><em>الأسبوعان 3 و4</em>الرندر النهائي، اختبار الشجرة والطيور والمنديل، البروفة النهائية على الجدار</li>
      </ul></div>
    </div>
  </div>
  <div style="position:absolute;left:120px;right:120px;bottom:150px;display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:end">
    <div class="img" style="height:300px;background-image:url(img/show_12.jpg)"></div>
    <p class="body">العرض يمتدّ دقيقتين و{TOTAL % 60} ثانية داخل فقرة الخمس دقائق، ويترك دقيقتين و{(300 - TOTAL) % 60} ثانية لصعود الرئيس التنفيذي على الجدار نفسه. الشجرة المثمرة تبقى على المسرح حتى نهاية الليلة، دليلًا حيًّا على ما رآه الحضور.</p>
  </div>
  {ftr(pg)}
</section>
''')
pg += 1


def script_page(small, title, lines, en):
    half = (len(lines) + 1) // 2
    cols = []
    for part in (lines[:half], lines[half:]):
        items = []
        for k, (ts, txt) in enumerate(part):
            last = ' last' if k == len(part) - 1 else ''
            items.append(f'<div class="ln{last}"><b>{mmss(ts)}</b><p>{txt}</p></div>')
        cols.append('<div class="col">\n      ' + '\n      '.join(items) + '\n    </div>')
    cls = 'grid script en" dir="ltr' if en else 'grid script'
    return f'''
<!-- SCRIPT {'EN' if en else 'AR'} -->
<section class="page">
  {hdr(small, title)}
  <div class="{cls}">
    {cols[0]}
    {cols[1]}
  </div>
  {ftr(pg)}
</section>
'''


P.append(script_page('08 — نص الساحر مع التوقيت', 'ما يقوله على المسرح، ومتى', SCRIPT_AR, False))
pg += 1
P.append(script_page('08 — النص الدولي مع التوقيت', 'النسخة الإنجليزية للضيوف الدوليين والإعلام', SCRIPT_EN, True))
pg += 1

P.append('''
<!-- CLOSE -->
<section class="page dark">
  <div class="full" style="background-image:url(img/show_17.jpg);opacity:.5"></div>
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(11,11,11,.2) 0%,rgba(11,11,11,.92) 75%)"></div>
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
    <div class="wm" dir="ltr" style="font-size:72px;color:#fff">BUDOOR<small>Signature</small></div>
    <div style="width:80px;height:1px;background:var(--gold);margin:56px 0"></div>
    <h2 style="font-size:56px;font-weight:300;letter-spacing:0;line-height:1.3">ازرع توقيعك. ودعه ينمو.</h2>
    <p style="margin-top:26px;font-size:18px;letter-spacing:.3em;text-transform:uppercase;color:#bdbdbd">Nofakha &nbsp;·&nbsp; House <i style="font-family:'Cormorant Garamond',serif;text-transform:none;letter-spacing:0;font-size:22px">of</i> Experience</p>
  </div>
</section>
''')

open('show_body.html', 'w', encoding='utf-8').write(''.join(P))
print('pages', len(P), 'total', mmss(TOTAL), 'scenes', len(SCENES))
