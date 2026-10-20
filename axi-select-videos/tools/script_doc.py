#!/usr/bin/env python3
"""script_doc.py — explainer/script_src.json + timeline.json → deliverables/ script docs (Markdown + plain VO text)."""
import json, os
H = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(H, '..')
d = json.load(open(f'{R}/explainer/script_src.json', encoding='utf-8')); t = json.load(open(f'{R}/explainer/timeline.json', encoding='utf-8'))
mmss = lambda s: f"{int(s // 60)}:{s % 60:04.1f}"
lead = t['lead']
md = [f"# سكربت فيديو Axi Select الشرحي — باللهجة العراقية البيضاء\n",
      f"**مدة الفيديو:** {mmss(t['dur'])} · **عدد الكلمات:** {sum(s['words'] for s in t['scenes'])} · **سرعة القراءة المفترضة:** {t['wps']} كلمة/ثانية\n",
      "## طريقة التسجيل في ElevenLabs\n",
      "1. سجّل **كل مشهد بشكل منفصل** (انسخ نص المشهد فقط)، حتى تحطه بالضبط على وقت بدايته بالفيديو.",
      f"2. حط كل مقطع صوتي على **وقت بداية المشهد + {lead} ثانية** (مكتوب جوّه كـ «يبدأ الصوت»).",
      "3. الموديل المقترح: **Eleven v3** (أو Multilingual v2). اختار صوت عربي/عراقي رجالي واثق من Voice Library (ابحث عن Iraqi).",
      "4. الإعدادات المقترحة: Stability ‎45–55% · Similarity ‎75% · Style ‎15–25% · Speed ‎1.0.",
      "5. إذا طلع صوت المشهد أطول من وقته، زيد السرعة لـ 1.05–1.1 أو قصّر الوقفات. وإذا أقصر، عادي — الصورة تبقى ثابتة لحد المشهد الجاي.",
      "6. الفيديو بيه موسيقى خلفية هادئة؛ خلّي الصوت أعلى منها بحوالي 10–12 dB (أو استخدم نسخة الفيديو بدون موسيقى + ملف الموسيقى بشكل منفصل).\n",
      "> ملاحظة: الكتابة متعمدة حتى ينطقها الذكاء الاصطناعي صح: ماكو «گ»، والأرقام مكتوبة مثل ما تنحچي، و MT4 / MT5 مكتوبة «إم تي فور / إم تي فايف».\n",
      "---\n"]
txt = []
for s, tl in zip(d['scenes'], t['scenes']):
    md += [f"## {s['id'][1:]} · {s['title_ar']}  ({s['title_en']})",
           f"**الوقت:** {mmss(tl['t0'])} → {mmss(tl['t1'])} · **يبدأ الصوت:** {mmss(tl['t0'] + lead)} · **المدة:** {tl['dur']:.1f} ث · {tl['words']} كلمة\n",
           f"> {s['vo']}\n", "**على الشاشة:** " + " · ".join(f"«{x}»" for x in s['on_screen']) + "\n"]
    txt += [f"[{s['id']} · {s['title_ar']} · يبدأ {mmss(tl['t0'] + lead)}]", s['vo'], ""]
md += ["---\n", "### الحقائق المستخدمة (من axi.com، أكتوبر 2026)",
       "التسجيل مجاني بدون تحدي · تمويل لحد مليون دولار · حصة لحد 80% · 6 مراحل (التأسيس $5K 0% · الحضانة $20K 40% · التسارع $100K 50% · برو $200K 60% · برو 500 $500K 70% · برو مليون $1M 80%) · الترقية: +7% وأيام وصفقات ودرجة Edge ورصيد وسد الصفقات · أقصى خسارة 7% (برو مليون 10%) · الأرباح أول كل شهر.",
       "الأرقام حسب Axi «تقريبية وقابلة للتغيير» — راجعها على axi.com قبل النشر. عرض «14% بالتأسيس» الموجود بملف البراند كان عرض مؤقت وانتهى (30 سبتمبر 2026)، فما استخدمناه."]
os.makedirs(f'{R}/deliverables', exist_ok=True)
open(f'{R}/deliverables/Axi_Select_Explainer_Script_AR.md', 'w', encoding='utf-8').write("\n".join(md) + "\n")
open(f'{R}/deliverables/Axi_Select_Explainer_VO_ElevenLabs.txt', 'w', encoding='utf-8').write("\n".join(txt))
print('ok')
