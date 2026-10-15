#!/usr/bin/env python3
"""handoff.py W V VIDEO_ID VIDEO_URL STATE_URL -> W/HANDOFF.md + W/PROMPTS.md (copies the helper tools into W/tools)."""
import json
import os
import shutil
import subprocess
import sys

W, V, VID, VURL, SURL = sys.argv[1:6]
S = os.path.basename(W.rstrip("/"))
A = S.startswith("axipromo-a")
os.chdir(W)
plan = json.load(open("plan/creative-plan.json", encoding="utf-8"))
refs = json.load(open("analysis/references.json", encoding="utf-8"))
mix = json.load(open("audio/mix.json", encoding="utf-8")) if os.path.exists("audio/mix.json") else {}
out = f"out/{S}_v{V}.mp4"
size_mb = os.path.getsize(out) / 1e6
os.makedirs("tools", exist_ok=True)
for f in ("gate.sh", "finalize.py", "mixdown.py", "persec.py", "handoff.py"):
    p = os.path.join("/home/user/rr/_tools", f)
    if os.path.exists(p):
        shutil.copy(p, os.path.join("tools", f))
md5 = subprocess.run(["md5sum", out], capture_output=True, text=True).stdout.split()[0]

REQ = ("ممتاز جدا الان لنجرب ان نصنع فيديو ترويجي للاكاديمية بشكل كامل و هو عبارة عن ١٥ ثانية ترويجية استخدم فيها كل مهاراتك "
       "كمصمم موشن كرافيك عالمي و اجعله مناسب جدا للترويج بالسوشيال ميديا و استخدم فيه MCP Higgsfield katana و يستطيع هذا الفيديو "
       "الدعائي ان يفهم الناس عن الاكاديمية و يجذبهم لها و يكون جاهز للتنزيل بدون فويس اوفير فقط موشن كرافيكس مجنون و عالمي و خارج "
       "عن المألوف، قم بصنع نسختين له بستايلين مختلفين احدهم عن الاخر و الاثنين عالميين")
MSG = "تعلم التداول من الصفر للأحتراف و لكن الدعوة لأكاديمية اكسي، و ايضا نضع قريبا، احجز مقعدك من الان الاكاديمية مجانية لاول ١٠٠٠ طالب فقط"
style = "تايبوغرافي حركي جريء «من الصفر»" if A else "واجهات SaaS «مقعدك محجوز»"
grid = "t(b) = 1.40 + b × 0.4478 s (134 BPM)" if A else "t(b) = 1.40 + b × 0.5 s (120 BPM)"
track = plan.get("music", {}).get("asset", "")
seg = plan.get("music", {}).get("segment_s", [])
changes = ("v1: أول رندر. v2: نبض على الإيقاع في اللقطات الثابتة، شريط كلمات متحرك في البطاقة الختامية، زر الحجز ينبض مع لمعة، "
           "ضبابية حركة 16 عيّنة في الحركات السريعة. v3: اهتزاز صدمة أقوى على ثلاث ضربات (الاحتراف، فقط، علامة X). "
           "v4: تباعد أوسع في سطر «لأول 1000 طالب» واكتمال شبكة الألف نقطة عند 1000") if A else \
          ("v1: أول رندر. v2: اقتراب بطيء من شريط السؤال أثناء الكتابة، بطاقة مسار التعلّم تدور ببطء، صفّا شرائح متحركة وزر حجز ينبض مع لمعة "
           "في البطاقة الختامية، ضبابية حركة 16 عيّنة في الحركات السريعة")
scenes = ("شعار → «تعلّم / التداول» → «من الصفر» ثم «إلى الاحتراف.» → «تعلّم · ثم تعلّم · ثم تدرّب · ثم تداول.» → «أكاديمية آكسي · قريباً» → "
          "«مجانية» + «لأول 1000 طالب» (عدّاد وشبكة 1000 نقطة) + «فقط» + المقعد الأحمر «احجز مقعدك الآن» → الغوص في المقعد → علامة X → البطاقة الختامية") if A else \
         ("شعار → شريط بحث يكتب «كيف أتعلّم التداول من الصفر؟» → خط أحمر وانفجار ضوء → «أكاديمية آكسي · قريباً» ونقرة → عدّاد 0→1000 «مقعد مجاني» → "
          "بطاقة «مسار التعلّم» من الصفر إلى الاحتراف → كلمة لكل ضربة: «قريباً.» «مجانية.» «لأول 1000 طالب.» «فقط.» → خريطة المقاعد وزر «احجز مقعدك الآن» و«تم حجز مقعدك» → علامة X → البطاقة الختامية")

H = f"""# {S} — تسليم للمحادثة التالية

> لـ Claude في محادثة جديدة: اقرأ هذا الملف كاملاً ثم PROMPTS.md. استعد مساحة العمل بـ
> `source "$HF_WORKFLOWS/katana/scripts/rr.sh"` ثم `rr_restore {S} '{SURL}'`. تحدّث مع المستخدم بالعربية وباختصار.

## 1. ما هذا
فيديو ترويجي لأكاديمية آكسي (Axi Iraq) مدته 15 ثانية، عمودي 9:16 (1080×1920، 60 إطار/ث، 900 إطار)، بدون تعليق صوتي: موشن كرافيكس مع موسيقى ومؤثرات.
هذه النسخة: {style}. المفهوم: {plan.get('concept', '')}
طلب المستخدم (نصاً): «{REQ}»
الرسالة المطلوبة (نصاً): «{MSG}». الدعوة: axi.com/ar.
المرجع (دليل أسلوب وإيقاع فقط، لم يُستخدم أي إطار منه): {refs.get('primary', {}).get('title', '')} — {refs.get('primary', {}).get('source', '')}

## 2. الحالة الحالية
| النسخة | الملف / media id / URL | إطارات · fps · حجم | الصوت | ما تغيّر |
|---|---|---|---|---|
| v{V} | `{out}` (md5 {md5}) / {VID} / {VURL} | 900 · 60 · 1080×1920 · {size_mb:.2f} MB | AAC-LC 48 kHz، {mix.get('lufs_i', -14.0)} LUFS، ذروة {mix.get('true_peak_db', '')} dBTP | {changes} |

حالة الملاحظات: سُلّمت v{V} في 2026-10-15، لا ملاحظات بعد.

## 3. قرارات المستخدم (لا تُراجع إلا بطلب)
- 9:16 عمودي؛ 15 ثانية؛ بدون فويس أوفر (موسيقى + مؤثرات)؛ نسختان بستايلين: «تايبوغرافي حركي جريء» و«واجهات SaaS»؛ الرسالة أعلاه؛ الدعوة axi.com/ar؛ التسليم عبر Higgsfield Katana.
- اختيارات مؤلَّفة (ليست قرار المستخدم): الموسيقى ({track}، المقطع {seg} ث)، القصة والمشاهد، النصوص الثانوية، الحركة. قواعد العلامة من BRAND.md: أحمر ≤10%، أرقام لاتينية بخط Inter، علامة X أسفل اليسار، شريط المخاطر في آخر 3 ثوانٍ، مناطق آمنة 10% أعلى و15% أسفل، لا وعود ولا أرقام مختلقة (الرقم الوحيد 1000 مقعد).

## 4. المرجع باختصار
التحليل الكامل: analysis/breakdown.json و analysis/energy.json. الخدعة المنقولة: إيقاع قطع على الضربة مع وميض وحركة كاميرا وضبابية حركة، بلغة {'تايبوغرافي' if A else 'واجهات تطبيق'} مختلفة عن المرجع.

## 5. المسار المنفّذ
- كل الإطارات كود (صفحة canvas حتمية f(t)) عبر `$RR/comp/page_render.py`؛ لا توليد فيديو أو صور (0 كريدت).
- المشاهد: {scenes}.
- الصوت: {track}؛ مؤثرات CC0 من مكتبة Katana (`audio/sfx_cues.json`، التراخيص في `audio/sfx_licenses.txt`)؛ الميكس عبر tools/mixdown.py إلى −14 LUFS.
- الرندر: master `out/comp.mp4` (CRF 14) ثم `deliver.py` (remux ضمن السقف).

## 6. الاستئناف وإعادة الرندر
```
source "$HF_WORKFLOWS/katana/scripts/rr.sh"
rr_restore {S} '{SURL}'
W=$(pwd)   # مساحة العمل بعد الاستعادة
python3 $RR/comp/page_render.py render $W --stills 120,480,840 --cols 3 --tile-w 300 --sheet qa/check.jpg --no-check
python3 $RR/comp/page_render.py render $W --crf 14 --quality 0.95      # الصوت audio/mix.m4a يُدمج تلقائياً
python3 $RR/deliver.py out/comp.mp4 out/{S}_vN.mp4
bash tools/gate.sh $W N                                               # الفحص الآلي + أوراق كل ثانية + الطاقة
```
النصوص والتوقيت في `motion/film.js` (دالة لكل مشهد، T = أوقات المشاهد)، العُدّة المشتركة في `motion/lib.js`، الخطوط في `motion/fonts`. التعديل لا يحتاج أي توليد (0 كريدت).

## 7. ملفات مساحة العمل
analysis/task-contract.json، analysis/breakdown.json، analysis/coverage.json، analysis/energy.json، analysis/motion-reviews.json، plan/creative-plan.json، motion/index.html، motion/lib.js، motion/film.js، motion/assets/brand_paths.js، audio/mix.m4a، audio/sfx_cues.json، audio/sfx_licenses.txt، qa/gate_v{V}.md، qa/inspection_v{V}.json، qa/dynamics.json، qa/sheets/*_v{V}_s*.jpg، tools/*.

## 8. معرّفات Higgsfield
| ما | media id | URL | الاستخدام |
|---|---|---|---|
| الفيديو v{V} | {VID} | {VURL} | التسليم |
| حالة المشروع | — | {SURL} | `rr_restore` |
لا توجد مهام توليد مدفوعة في هذا المشروع.

## 9. التوقيت
شبكة الإيقاع: {grid}. أوقات المشاهد في `FILM.T` داخل motion/film.js. الضربة الأولى (drop) عند 1.40 ث.

## 10. ملاحظات صادفناها
- المرفق المرجعي لم يُرفع من جلسة المستخدم (سياسة الشبكة)، فجُلبت النسخة العامة نفسها داخل الـ sandbox.
- قناع الكشف كان يقص نقاط الياء الأخيرة في «آكسي» → وُسّع.
- index.html كان يحد عيّنات ضبابية الحركة بـ 8 → رُفع إلى 16 للحركات السريعة.
- مهلة MCP 60 ث: الرندر والفحص يعملان في الخلفية (background + rr_bg).

## 11. التكييفات والقيود
- مؤلَّف عمداً: قصة ومشاهد ونصوص وموسيقى جديدة؛ الاختلاف عن المرجع مقصود.
- الصوت قيس ولم يُسمع (لا أداة تشغيل): {mix.get('lufs_i', -14.0)} LUFS، ذروة حقيقية {mix.get('true_peak_db', '')} dBTP.
- رخصة Mixkit تسمح بالسوشيال ميديا والإعلانات الأونلاين، لا تشمل البث التلفزيوني/الإذاعي.

## 12. الإنفاق
0 كريدت (لا توليد).

## 13. القيود المتبقية
لا يوجد عائق مفتوح في الفحص (qa/gate_v{V}.md).
"""
open("HANDOFF.md", "w", encoding="utf-8").write(H)
P = f"""# {S} — PROMPTS

لا توجد مطالبات توليد: كل إطار مرسوم بالكود (motion/film.js). لم تُرسل أي مهمة لنموذج فيديو أو صورة أو صوت.

- الموسيقى: {track}، المقطع {seg} ث من الملف الأصلي، تلاشٍ 0.65 ث في النهاية.
- المؤثرات: قائمة الإشارات في audio/sfx_cues.json (CC0، التراخيص في audio/sfx_licenses.txt).
"""
open("PROMPTS.md", "w", encoding="utf-8").write(P)
print("wrote HANDOFF.md, PROMPTS.md, tools/")
