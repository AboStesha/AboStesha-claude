#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""شَبِم — يبني العرض من مخرجات النموذج المالي مباشرة."""

import base64
import json, os
from art import cube_exterior, cube_interior, ICON

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

M = json.load(open(os.path.join(ROOT, "financials", "model_output.json"), encoding="utf-8"))
A, U, FR, SC = M["assumptions"], M["units"], M["franchisor"], M["scenarios"]
FLAG = U["baghdad_own"]
Y2 = FLAG["years"][1]
MENU = A["menu"]
MIX = A["formats"]["cube_flagship"]["mix"]


def usd(v, dp=0):
    return f"(${abs(v):,.{dp}f})" if v < 0 else f"${v:,.{dp}f}"


def kk(v):
    if abs(v) >= 1_000_000:
        return f"${v/1_000_000:,.2f}M"
    if abs(v) >= 1_000:
        return f"${v/1_000:,.0f}k"
    return f"${v:,.0f}"


def iqd(u):
    v = u * A["fx"]["iqd_per_usd_parallel"]
    return f"{int(round(v / 250.0) * 250):,}"


def N(x):
    """Latin numerals, isolated so RTL never reorders them."""
    return f'<span class="n">{x}</span>'


# ── photography ────────────────────────────────────────────────────────────
IMG_DIR = os.path.join(HERE, "img")
_IMG_CACHE = {}


def has_img(key):
    """A render is available for this slot if a file with that stem exists."""
    if key in _IMG_CACHE:
        return _IMG_CACHE[key] is not None
    for ext in (".webp", ".jpg", ".jpeg", ".png"):
        p = os.path.join(IMG_DIR, key + ext)
        if os.path.exists(p):
            mime = {"webp": "image/webp", "png": "image/png"}.get(ext[1:], "image/jpeg")
            with open(p, "rb") as fh:
                _IMG_CACHE[key] = f"data:{mime};base64," + base64.b64encode(fh.read()).decode()
            return True
    _IMG_CACHE[key] = None
    return False


def img(key, alt, cap="", cls="", fallback=""):
    """Embed the render for this slot, or fall back to the drawing.

    Every image is inlined as a data URI: the published page runs under a CSP
    that blocks every external host, so a linked image would simply not load."""
    if has_img(key):
        return (f'<figure class="ph {cls}"><img src="{_IMG_CACHE[key]}" alt="{alt}" loading="lazy">'
                f'{f"<figcaption>{cap}</figcaption>" if cap else ""}</figure>')
    if fallback:
        return (f'<figure class="fg {cls}">{fallback}'
                f'{f"<figcaption>{cap}</figcaption>" if cap else ""}</figure>')
    return ""


def _phrow(shots, cls, style, grid="phgrid"):
    """A row of renders, or nothing at all when none have been dropped in yet."""
    cells = "".join(img(k, c, c, cls=cls) for k, c in shots if has_img(k))
    return f'<div class="{grid}" style="{style}">{cells}</div>' if cells else ""


# ── مخططات: حبر واحد بثلاث شفافيات، مع تسمية مباشرة لكل قيمة ─────────────────

def sv(w, h, lab):
    return f'<svg viewBox="0 0 {w} {h}" class="cv" role="img" aria-label="{lab}" preserveAspectRatio="xMidYMid meet">'


def col_months(months, vals, temps, w=880, h=380, lab=""):
    pl, pr, pt, pb = 44, 44, 26, 66
    iw, ih = w - pl - pr, h - pt - pb
    mx = max(vals) * 1.2
    n = len(months)
    gap = iw / n * 0.34
    bw = (iw - gap * (n - 1)) / n
    o = [sv(w, h, lab)]
    for i in range(5):
        y = pt + ih * i / 4
        o.append(f'<line x1="{pl}" y1="{y:.1f}" x2="{w-pr}" y2="{y:.1f}" class="grid"/>')
        o.append(f'<text x="{pl-8}" y="{y+4:.1f}" class="ax" text-anchor="end">{mx*(4-i)/4:,.0f}</text>')
    for i, (m, v) in enumerate(zip(months, vals)):
        x = pl + i * (bw + gap)
        bh = max(2, ih * v / mx)
        y = pt + ih - bh
        cls = "s1" if v >= max(vals) * 0.85 else ("s3" if v <= min(vals) * 1.12 else "s2")
        o.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{bw:.1f}" height="{bh:.1f}" rx="3" class="{cls}">'
                 f'<title>{m}: {v:,.0f}</title></rect>')
        o.append(f'<text x="{x+bw/2:.1f}" y="{h-pb+20}" class="ax" text-anchor="middle">{m}</text>')
    mxt = max(temps)
    pts = [(pl + i * (bw + gap) + bw / 2, pt + ih - ih * t / mxt * 0.9) for i, t in enumerate(temps)]
    o.append('<path d="' + " ".join(f"{'M' if i==0 else 'L'}{x:.1f},{y:.1f}" for i, (x, y) in enumerate(pts)) + '" class="ln2"/>')
    for i in (0, 6, 11):
        x, y = pts[i]
        o.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="3.4" fill="currentColor" opacity=".55"/>')
        o.append(f'<text x="{x:.1f}" y="{y-10:.1f}" class="vl dim" text-anchor="middle">{temps[i]}°</text>')
    o.append(f'<line x1="{pl}" y1="{pt+ih:.1f}" x2="{w-pr}" y2="{pt+ih:.1f}" class="axis"/>')
    o.append("</svg>")
    return "".join(o)


def hbars(rows, w=880, pad=0, fmt=lambda v: f"{v:,.0f}", lab="", unit=""):
    """Horizontal bars, RTL-safe. text-anchor resolves against the inline base
    direction, so inside an RTL page 'start' is the RIGHT edge — the earlier
    build assumed LTR and stacked the label, the value and the bar on top of
    one another. Here each row gets its own two lines and nothing can collide:
    the name and the number sit on a caption line above a full-width track."""
    rowh, n = 62, len(rows)
    h = n * rowh + 8
    mx = max(v for _, v, _ in rows) or 1
    o = [sv(w, h, lab)]
    for i, (t, v, note) in enumerate(rows):
        y = i * rowh
        bl = max(2.5, w * v / mx)
        cls = "s1" if i == n - 1 else ("s2" if i == 0 else "s3")
        o.append(f'<text x="{w}" y="{y+15}" class="rl" text-anchor="start">{t}</text>')
        o.append(f'<text x="0" y="{y+15}" class="vl" text-anchor="start" '
                 f'style="direction:ltr;unicode-bidi:isolate">{fmt(v)}{unit}</text>')
        o.append(f'<rect x="0" y="{y+24}" width="{w}" height="14" rx="3" class="trk"/>')
        o.append(f'<rect x="{w-bl:.1f}" y="{y+24}" width="{bl:.1f}" height="14" rx="3" '
                 f'class="{cls}"><title>{t}: {fmt(v)}{unit}</title></rect>')
        if note:
            o.append(f'<text x="{w}" y="{y+53}" class="nl" text-anchor="start">{note}</text>')
    o.append("</svg>")
    return "".join(o)


def smalls(series, w=880, cw=106, ch=64, lab=""):
    """One mini column chart per SKU, all on a SHARED y-scale so the panels are
    comparable at a glance — the whole point of small multiples. Monochrome:
    the peak month is inked, the rest sit back."""
    n = len(series)
    cols = max(1, min(n, int(w // (cw + 14))))
    rows = (n + cols - 1) // cols
    rowh = ch + 52
    h = rows * rowh
    mx = max(max(v for v in vals) for _, vals, _ in series) or 1
    o = [sv(w, h, lab)]
    for i, (name, vals, tot) in enumerate(series):
        r, c = divmod(i, cols)
        # RTL: the first panel sits at the RIGHT edge
        x0 = w - (c + 1) * (cw + 14) + 14
        y0 = r * rowh
        o.append(f'<text x="{x0+cw}" y="{y0+12}" class="rl" text-anchor="start">{name}</text>')
        o.append(f'<text x="{x0+cw}" y="{y0+28}" class="vl" text-anchor="start" '
                 f'style="direction:ltr;unicode-bidi:isolate">{tot}</text>')
        bw = cw / 12.0
        pk = vals.index(max(vals))
        for m, v in enumerate(vals):
            bh = max(1.0, ch * v / mx)
            bx = x0 + cw - (m + 1) * bw
            o.append(f'<rect x="{bx+0.7:.1f}" y="{y0+36+ch-bh:.1f}" width="{bw-1.4:.1f}" '
                     f'height="{bh:.1f}" class="{"s1" if m == pk else "s3"}">'
                     f'<title>{name} · {MONS[m]}: {v:,.0f}</title></rect>')
        o.append(f'<line x1="{x0}" y1="{y0+36+ch}" x2="{x0+cw}" y2="{y0+36+ch}" class="ax"/>')
    o.append("</svg>")
    return "".join(o)


def pnl_bars(years, w=880, h=360, lab=""):
    pl, pr, pt, pb = 64, 24, 30, 54
    iw, ih = w - pl - pr, h - pt - pb
    mx = max(y["gross_revenue"] for y in years) * 1.2
    n = len(years)
    gap = iw / n * 0.4
    bw = (iw - gap * (n - 1)) / n
    o = [sv(w, h, lab)]
    for i in range(5):
        y = pt + ih * i / 4
        o.append(f'<line x1="{pl}" y1="{y:.1f}" x2="{w-pr}" y2="{y:.1f}" class="grid"/>')
        o.append(f'<text x="{pl-8}" y="{y+4:.1f}" class="ax" text-anchor="end">{kk(mx*(4-i)/4)}</text>')
    for i, yr in enumerate(years):
        x = pl + i * (bw + gap)
        rh = ih * yr["gross_revenue"] / mx
        eh = ih * max(0, yr["ebitda"]) / mx
        o.append(f'<rect x="{x:.1f}" y="{pt+ih-rh:.1f}" width="{bw:.1f}" height="{rh:.1f}" rx="3" class="s3">'
                 f'<title>السنة {yr["year"]} — الإيراد {usd(yr["gross_revenue"])}</title></rect>')
        o.append(f'<rect x="{x:.1f}" y="{pt+ih-eh:.1f}" width="{bw:.1f}" height="{eh:.1f}" rx="3" class="s1">'
                 f'<title>السنة {yr["year"]} — EBITDA {usd(yr["ebitda"])}</title></rect>')
        o.append(f'<text x="{x+bw/2:.1f}" y="{pt+ih-rh-10:.1f}" class="vl" text-anchor="middle">{kk(yr["gross_revenue"])}</text>')
        o.append(f'<text x="{x+bw/2:.1f}" y="{h-pb+20}" class="ax" text-anchor="middle">S{yr["year"]}</text>')
        o.append(f'<text x="{x+bw/2:.1f}" y="{h-pb+36}" class="ax" text-anchor="middle">{yr["ebitda_margin"]*100:.0f}%</text>')
    o.append(f'<line x1="{pl}" y1="{pt+ih:.1f}" x2="{w-pr}" y2="{pt+ih:.1f}" class="axis"/>')
    o.append("</svg>")
    return "".join(o)


def growth(w=880, h=330, lab=""):
    pl, pr, pt, pb = 66, 40, 30, 58
    iw, ih = w - pl - pr, h - pt - pb
    ys = FR["years"]
    mx = max(y["system_sales"] for y in ys) * 1.2
    step = iw / (len(ys) - 1)
    pts = [(pl + i * step, pt + ih - ih * y["system_sales"] / mx) for i, y in enumerate(ys)]
    o = [sv(w, h, lab)]
    for i in range(5):
        y = pt + ih * i / 4
        o.append(f'<line x1="{pl}" y1="{y:.1f}" x2="{w-pr}" y2="{y:.1f}" class="grid"/>')
        o.append(f'<text x="{pl-8}" y="{y+4:.1f}" class="ax" text-anchor="end">{kk(mx*(4-i)/4)}</text>')
    area = f'M{pts[0][0]:.1f},{pt+ih:.1f} ' + " ".join(f"L{x:.1f},{y:.1f}" for x, y in pts) + f' L{pts[-1][0]:.1f},{pt+ih:.1f} Z'
    o.append(f'<path d="{area}" class="s3"/>')
    o.append('<path d="' + " ".join(f"{'M' if i==0 else 'L'}{x:.1f},{y:.1f}" for i, (x, y) in enumerate(pts)) + '" class="ln"/>')
    for (x, y), yr in zip(pts, ys):
        o.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4" fill="currentColor"/>')
        o.append(f'<text x="{x:.1f}" y="{y-12:.1f}" class="vl" text-anchor="middle">{kk(yr["system_sales"])}</text>')
        o.append(f'<text x="{x:.1f}" y="{h-pb+20}" class="ax" text-anchor="middle">S{yr["year"]}</text>')
        o.append(f'<text x="{x:.1f}" y="{h-pb+36}" class="ax" text-anchor="middle">{yr["units_total"]} فرع</text>')
    o.append(f'<line x1="{pl}" y1="{pt+ih:.1f}" x2="{w-pr}" y2="{pt+ih:.1f}" class="axis"/>')
    o.append("</svg>")
    return "".join(o)


def heat(cities, w=880, lab=""):
    pl, cell, gap, rowh = 150, 52, 4, 36
    h = len(cities) * rowh + 48
    o = [sv(w, h, lab)]
    mons = ["ك٢", "شب", "آذ", "نيس", "أيا", "حز", "تم", "آب", "أيل", "ت١", "ت٢", "ك١"]
    for j, m in enumerate(mons):
        o.append(f'<text x="{w-pl-j*(cell+gap)-cell/2:.1f}" y="16" class="ax" text-anchor="middle">{m}</text>')
    for i, (nm, temps) in enumerate(cities):
        y = 28 + i * rowh
        o.append(f'<text x="{w-pl+14}" y="{y+17}" class="rl" text-anchor="start">{nm}</text>')
        for j, t in enumerate(temps):
            x = w - pl - j * (cell + gap) - cell
            u = min(1, max(0, (t - 12) / 36))
            o.append(f'<rect x="{x:.1f}" y="{y}" width="{cell}" height="24" rx="3" fill="currentColor" '
                     f'fill-opacity="{0.05+0.62*u:.3f}"><title>{nm} — {t}°C</title></rect>')
            if t >= 40:
                o.append(f'<text x="{x+cell/2:.1f}" y="{y+16.5}" class="ax" text-anchor="middle" '
                         f'style="fill:var(--ground);font-weight:600">{t}</text>')
    o.append("</svg>")
    return "".join(o)


def scen(w=880, h=290, lab=""):
    order = [("متشائم", "bear"), ("فشل فرضية الحرارة", "stress_heat_fails"), ("صدمة صرف", "stress_fx"),
             ("ضريبة إضافية", "stress_sales_tax"), ("الأساس", "base"), ("متفائل", "bull")]
    pl, pr, pt, pb = 62, 22, 24, 76
    iw, ih = w - pl - pr, h - pt - pb
    mx = max(SC[k]["y2_ebitda"] for _, k in order) * 1.25
    n = len(order)
    gap = iw / n * 0.36
    bw = (iw - gap * (n - 1)) / n
    o = [sv(w, h, lab)]
    for i in range(5):
        y = pt + ih * i / 4
        o.append(f'<line x1="{pl}" y1="{y:.1f}" x2="{w-pr}" y2="{y:.1f}" class="grid"/>')
        o.append(f'<text x="{pl-8}" y="{y+4:.1f}" class="ax" text-anchor="end">{kk(mx*(4-i)/4)}</text>')
    for i, (t, key) in enumerate(order):
        s = SC[key]
        x = pl + i * (bw + gap)
        bh = max(2, ih * s["y2_ebitda"] / mx)
        cls = "s1" if key == "base" else "s2"
        o.append(f'<rect x="{x:.1f}" y="{pt+ih-bh:.1f}" width="{bw:.1f}" height="{bh:.1f}" rx="3" class="{cls}"/>')
        o.append(f'<text x="{x+bw/2:.1f}" y="{pt+ih-bh-9:.1f}" class="vl" text-anchor="middle">{kk(s["y2_ebitda"])}</text>')
        o.append(f'<text x="{x+bw/2:.1f}" y="{h-pb+20}" class="ax" text-anchor="middle">{t}</text>')
        pbk = s["payback_months"]
        o.append(f'<text x="{x+bw/2:.1f}" y="{h-pb+38}" class="ax" text-anchor="middle">'
                 f'{f"{pbk:.0f} شهر" if pbk else "لا استرداد"}</text>')
        ir = s["irr_5y"]
        o.append(f'<text x="{x+bw/2:.1f}" y="{h-pb+54}" class="ax" text-anchor="middle">'
                 f'IRR {ir:.0f}%</text>')
    o.append(f'<line x1="{pl}" y1="{pt+ih:.1f}" x2="{w-pr}" y2="{pt+ih:.1f}" class="axis"/>')
    o.append("</svg>")
    return "".join(o)


# ═══════════════════════════════════════════════════════════════════════════
#  المحتوى
# ═══════════════════════════════════════════════════════════════════════════

MONS = ["ك٢","شباط","آذار","نيسان","أيار","حزيران","تموز","آب","أيلول","ت١","ت٢","ك١"]
BAG_T = [16, 19, 24, 30, 37, 42, 45, 45, 41, 33, 24, 17]

PRODUCTS = [
 dict(k="saqee80", ar="صَقيع ٨٠−", la="SAQĪʿ −80", price=MENU["saqee80"]["price_usd_baghdad"],
   lead="كأسٌ مكث اثنتَي عشرة ساعةً في مُجمِّدٍ مخبريّ عند ستٍّ وثمانين تحت الصفر. يُرفَع بمِلقط، ويُصَبّ فيه حليبٌ عند الصفر فيتجمّد على جداره في لحظة، ثم يشقُّ الإسبريسو البياضَ نازلاً. مدّةُ صلاحيّة المشهد: أربعون ثانية.",
   origin="«الدِّرتي» اخترعه <b>كاتسويوكي تاناكا</b> في <b>Bear Pond Espresso</b> بحيّ شيمو‑كيتازاوا في طوكيو سنة <b>٢٠١٠</b>: "
          "إسبريسو يُسكَب على حليبٍ شديد البرودة، بلا ثلجٍ وبلا سُكَّر. أما النسخةُ المتطرّفة — تجميدُ الكأس نفسه — فوُلدت في "
          "<b>شنغهاي</b> يوم <b>٢٠ حزيران ٢٠٢٥</b> في مقهى <span class='en'>三立方</span> بشارع يونغ‑كانغ: أوّلُ محلٍّ في العالم "
          "متخصّصٍ بالدِّرتي وحده. رقمُ «ثمانين» تسويقيّ؛ المُجمِّد الحقيقي يعمل عند ٨٦−.",
   viral="ثلاثةُ أسابيع فقط بين الافتتاح والانفجار. في <b>١٥ تموز ٢٠٢٥</b>، بعد مطرٍ غزير، انتشرت صورُ الطابور واقفاً تحت "
         "المظلات — ومعها الصورةُ التي صنعت الخبر: زبونٌ جاء يجرُّ حقيبةَ سفرٍ ليحمل أكواباً لبيته. تصدّر «قائمةَ البحث الساخن» على "
         "<span class='en'>Xiaohongshu</span> و<span class='en'>Douyin</span>، وصار <b>الأول</b> على قائمة قهوة شنغهاي في "
         "<span class='en'>Dianping</span> خلال شهرٍ من الافتتاح. الناسُ وقفوا <b>خمسين دقيقة</b> في حرارة أربعين. "
         "والصحافةُ الطبّية ناقشت هل يُسبِّب لسعةَ صقيع — وأن يُراجِعك طبيبٌ فهذه علامةُ انتشارٍ بذاتها.",
   taste=["رَشْفَةٌ أولى دافِئَةٌ مُرَّة… ثُمَّ بَرْدٌ قِشْدِيٌّ يَتَسَلَّلُ حتّى القاع",
          "قِوامُ آيس كريمٍ سائِل: لا ثَلْجَ يُذيبُهُ ولا ماءَ يُخَفِّفُه",
          "حَليبٌ يَتَجَمَّدُ على الزُّجاجِ فَيَصيرُ رُقاقَةَ صَقيعٍ تَنْكَسِرُ تَحْتَ المِلْعَقَة",
          "إسبريسو يَشُقُّ البَياضَ كَحِبْرٍ في لَبَن: مُرٌّ في الأعلى، حُلْوٌ في القَرار",
          "أربَعونَ ثانِيَةً مِنَ الصَّقيع… ثُمَّ تَذوبُ الحِكايَة"],
   moat="لا يُقلَّد بشراء آلة. يحتاج مُجمِّداً مخبرياً، وبروتوكولَ تجميدٍ على مرحلتين (٢٠− أوّلاً لمنع الصدمة الحرارية، ثم ٨٦−)، "
        "وكأساً يتحمّل هذه الحرارة لا زجاجاً عادياً، ودورةَ اثنتَي عشرة ساعةً لكلِّ كأس — أي أنّ سعتك اليومية تُحدَّد ليلةَ أمس. "
        "والدليلُ على الحاجز أنّ <b>ريغيولارز</b> في ملبورن يبيع ٦٠٠ كأساً في اليوم من ستة عشر مقعداً، و<span class='en'>Slow Boat</span> "
        "في سنغافورة يضع سقفاً صارماً عند مئة كأس — لأنه لا يستطيع أكثر.",
   line=[("2010","طوكيو: تاناكا يخترع الدِّرتي في Bear Pond"),
         ("20 Jun 2025","شنغهاي: 三立方 يفتح كأول محلٍّ متخصّص، عند ٨٦−"),
         ("15 Jul 2025","الانفجار: طابورٌ تحت المطر، وتصدُّرُ البحث الساخن",1),
         ("Sep–Nov 2025","هونغ كونغ ثم سنغافورة: أكثر من ساعتَي انتظار"),
         ("Dec 2025","ملبورن: ٦٠٠ كأس يومياً من ١٦ مقعداً"),
         ("2026","الخليج: طبقاتُ «الدِّرتي» رائجة — <b>دون</b> نسخة الـ٨٦−",1)],
   stats=[("600 / 16", "كأساً في اليوم، من ستة عشر مقعداً — ملبورن"),
          ("¥26 → ¥48", "سعرُ الكأس نفسه من شنغهاي إلى بكين: ضِعفٌ تقريباً"),
          ("40 ثانية", "عمرُ المشهد قبل أن يصير لاتيه بارداً عادياً")]),

 dict(k="qalab", ar="القالَب", la="AL-QĀLAB", price=MENU["qalab"]["price_usd_baghdad"],
   lead="كتلةُ ثلجٍ شفّافةٌ تماماً بحجم خمسة عشر سنتيمتراً، منحوتةٌ يدوياً ومثقوبةٌ من أعلاها، هي الكأس. القهوة تُسكَب داخلها، وحين تنتهي يكون جدارُها الداخلي قد صار شربات قهوة… فيُؤكَل بالملعقة.",
   origin="الإنترنت الإنجليزي يقول إنّ الفكرة بدأت سنة ٢٠٢٢. المصادر اليابانية تقول غير ذلك بخمسين سنة: "
          "مقهى <b>نيشيمورا</b> في كيتانوزاكا بكوبه ابتكره سنة <b>١٩٧٣</b> حين كان نادياً مغلقاً بالعضوية، "
          "ويقدّمه <b>دون انقطاع منذ ١٩٧٤</b>. ولم يُفتَح للعامّة إلا سنة ١٩٩٥. "
          "و<span class='en'>cafe 33</span> في حياة ريجنسي كيوتو أطلق نسختَه في ١ تموز ٢٠٢٢، ينحتها حِرَفيٌّ كيوتيّ من مياهٍ جوفية محلّية، "
          "<b>اثنتان وسبعون ساعة</b> تجميدٍ للقالب الواحد.",
   viral="انتشر <b>أربع مرّات</b>، كلُّ مرّةٍ أكبر. تلفزيونٌ ياباني نحو ٢٠١٢ ضاعف الإقبال ثلاثة أضعاف بشهادة المقهى نفسه. "
         "ثم إنستغرام نحو ٢٠١٩ — «انفجرت الشعبيّةُ انفجاراً» بنصِّ كلامهم. ثم تغريدةٌ في آب ٢٠٢٢. "
         "ثم <b>حزيران ٢٠٢٣</b>: الاشتعال الدولي — منشورُ <span class='en'>@jukananan727</span> (نحو مليون متابع) من كيوتو، "
         "وفي الأسبوع نفسه ثلاثةُ مقاطع على تيك توك، أقواها لـ<span class='en'>@jesseogn</span> (١.٦ مليون متابع) في ١١ حزيران — "
         "<b>٦٧٫٨ ألف إعجاب</b>. وإعادةُ قصِّ اللقطة نفسها بلغت <b>٣٫١ مليون مشاهدة و٩٣ ألف إعجاب</b>. "
         "وفي كوبه: <span class='en'>@franklinthewoman</span> في ٢١ آب ٢٠٢٣ — <b>٥٨٧ ألف مشاهدة</b>.",
   taste=["«بَرْدٌ نَظِيفٌ لَا يُخَفِّفُ الطَّعْم: القَهْوَةُ تَبْقَى كَثِيفَةً حَتَّى الرَّشْفَةِ الأَخِيرَة»",
          "«القَالِبُ يَبْدَأُ ضَبَابِيًّا، ثُمَّ يَصْفُو بِحَرَارَةِ الكَفّ»",
          "«مَرَارَةٌ نَاعِمَةٌ مَسْحُوبَةٌ بِالمَاءِ البَارِد — بِلَا حِدَّةٍ وَلَا حُمُوضَة»",
          "«مِلْعَقَةٌ تَحُتُّ جِدَارَ الجَلِيدِ مِنَ الدَّاخِل، فَيَتَسَاقَطُ شَرْبَاتُ قَهْوَةٍ مُقَرْمَش»",
          "«سَاعَةٌ كَامِلَةٌ مِنَ البَرْدِ الثَّابِت… وَالكَأْسُ نَفْسُهَا هِيَ الحَلْوَى»"],
   moat="اقتصادُه هو الحاجز. كيوتو تبيعه بـ<b>٣٣٠٠ ين</b> (نحو ٢٢ دولاراً) وتُنتج <b>خمسةَ أكوابٍ في اليوم فقط</b>، من الساعة الثانية والنصف إلى الخامسة والنصف. "
        "وكوبه تنتظر ٢٠ إلى ٣٠ دقيقة من الطلب إلى الطاولة، وتنفد في ساعتين من الافتتاح. "
        "مقهىً هنديّ حاول تقليده فاحتاج <b>شهرَين إلى ثلاثة</b> من التجارب على بنية القالب وسماكته وصفائه. "
        "ونيشيمورا نفسه لديه أحد عشر فرعاً كلُّها إدارةٌ مباشرة ولا يمنح امتيازاً لأحد. "
        "نحن نحلُّها بمصنعٍ مركزيٍّ واحد يخدم الشبكة كلَّها بدل مصنعٍ في كلِّ فرع.",
   line=[("1973","كوبه: نيشيمورا يبتكره في ناديه المغلق"),
         ("1974","بدء التقديم المتواصل — مستمرٌّ إلى اليوم"),
         ("c.2012","تلفزيون ياباني: ثلاثةُ أضعاف الإقبال"),
         ("c.2019","إنستغرام: «انفجرت الشعبية» بنصِّ كلام المقهى"),
         ("Jun 2023","الاشتعال الدولي: 3.1 مليون مشاهدة لإعادة القص",1),
         ("2026","دبي وحدها في العرب — والعراق والسعودية والكويت صفر",1)],
   stats=[("3.1M", "مشاهدة لأقوى إعادة قصٍّ للّقطة الأصلية"),
          ("¥3,300", "سعرُ الكأس في كيوتو — بسقف خمسة أكوابٍ يومياً"),
          ("72 ساعة", "زمنُ تجميد القالب الواحد، بالتجميد الاتّجاهي")]),

 dict(k="boba", ar="لُؤلُؤ", la="LUʼLUʼ", price=MENU["boba"]["price_usd_baghdad"],
   lead="شرابُ السُّكَّر البُنّي يُدهَن على جدار كأسٍ مثلَّجة فيسيل خطوطاً كخطوط النمر ويتجمّد قبل أن تشرب، ثم الحليبُ البارد ولآلئُ التابيوكا المطبوخة قبل أربع ساعاتٍ على الأكثر.",
   origin="البابل تي تايوانيُّ المولد: <span class='en'>Chun Shui Tang</span> في تايتشونغ سنة <b>١٩٨٨</b> — "
          "وتنازعته المحاكم التايوانية عشر سنواتٍ مع <span class='en'>Hanlin</span> فلم تمنح الاختراع لأحد. "
          "أما «خطوطُ النمر» — الطبقة التي جعلته صورة — فابتكرها <b>Tiger Sugar</b> في تايتشونغ سنة <b>٢٠١٧</b>. "
          "والكأسُ المثلَّجة عندنا ليست زينة: حساسيّةُ اللسان للحلاوة تنهار تحت العشر درجات، فبدون الدِّبس المركَّز ثم البرد الثابت "
          "يصير المشروب باهتاً في الرشفة الثالثة.",
   viral="انفجر بين <b>٢٠١٨ و٢٠١٩</b>. أوضحُ دليلٍ في الملفّ كلِّه من اليابان: كلمة <span class='en'>タピる</span> — "
         "فعلٌ مُشتَقٌّ معناه «أن تذهب لتشرب تابيوكا» — دخلت <b>العشرةَ الأوائل</b> في جائزة الكلمات الجديدة اليابانية لسنة ٢٠١٩. "
         "<b>حين يصير المشروبُ فعلاً في اللغة، لم يعد مشروباً.</b> وفي كوريا موجةُ <span class='en'>흑당</span> سنة ٢٠١٩. "
         "وفي الصين بلغ التقليدُ حدَّ أنّ <span class='en'>The Alley</span> كان له نحو <b>١٦٠ فرعاً شرعياً مقابل سبعة آلاف فرعٍ مزوَّر</b>.",
   taste=["شَرِيطٌ مِنَ السُّكَّرِ الأَسْوَدِ يَنْزَلِقُ عَلَى جِدَارِ الكَأْس",
          "حَلَاوَةٌ مَطْبُوخَةٌ لَا مُضَافَة: دِبْسٌ وَحَافَّةٌ مُحْتَرِقَةٌ خَفِيفَة",
          "اللُّؤْلُؤُ يُقَاوِمُ السِّنَّ لَحْظَةً ثُمَّ يَسْتَسْلِم",
          "الكَأْسُ مُجَمَّدَةٌ حَتَّى يَتَجَمَّدَ الخَطّ",
          "رَغْوَةُ القِشْطَةِ المُمَلَّحَةُ تَقْطَعُ الحَلَاوَة"],
   moat="ليس حاجزاً تقنياً بل حاجزُ انضباط: اللآلئ تُغلى ٢٥ إلى ٤٠ دقيقة، ثم تُنقَع في الدِّبس ٢٠ إلى ٣٠، ثم لها <b>أربعُ ساعاتٍ</b> "
        "قبل أن تُرمى. الفرقُ بين بابل تي ممتازٍ وآخرَ رديء هو مطبخٌ منضبط لا وصفة. "
        "أما حجمُ ما يمكن أن تصير إليه الفئة فيكفي فيه رقمٌ واحد: <b>Mixue</b>، الخارجةُ من هذه الفئة، صارت أكبرَ سلسلة مطاعم في العالم "
        "بعدد الفروع — نحو <b>٤٥ ألف فرع</b> — وأُدرِجت في بورصة هونغ كونغ في آذار ٢٠٢٥. "
        "وفي بغداد اليوم: <b>لا فرعَ واحداً</b> لأيِّ سلسلة بابل تي.",
   line=[("1988","تايتشونغ: Chun Shui Tang يقلب التابيوكا في الشاي المثلَّج"),
         ("2017","Tiger Sugar يبتكر «خطوطَ النمر» — الطبقة التي صارت صورة"),
         ("2018–19","الانفجار العالمي: طوابيرُ طوكيو وسيول ولوس أنجلوس",1),
         ("2019","اليابان: «تابيرو» فعلٌ في العشرة الأوائل لكلمات السنة",1),
         ("Mar 2025","Mixue تُدرَج في هونغ كونغ بنحو ٤٥ ألف فرع"),
         ("2026","بغداد: صفرُ فروعٍ لأيِّ سلسلة بابل تي",1)],
   stats=[("~45,000", "فرعاً لـMixue — أكبرُ سلسلة مطاعم في العالم عدداً"),
          ("160 : 7,000", "فرعٌ شرعيّ مقابل مزوَّر لـThe Alley في الصين"),
          ("0", "سلسلة بابل تي في بغداد اليوم")]),

 dict(k="lafaif", ar="لَفائِف", la="LAFĀʼIF", price=MENU["lafaif"]["price_usd_baghdad"],
   lead="سائلٌ يُسكَب على صحنٍ فولاذي عند ثلاثين تحت الصفر، يُفرَم مع الفاكهة أمام الزبون، يُفرَش طبقةً بسماكة مليمترَين، ثم يُكشَط لفائفَ مشدودةً تُنصَب في الكأس واقفة.",
   origin="طعامُ شارعٍ تايلندي — <span class='en'>ไอติมผัด</span> «الآيس كريم المقلي» — نحو <b>٢٠٠٩</b> على عربات بانكوك، "
          "بأربعين إلى ستّين باهت للحصّة. (وتنازع الصينيون الأصلَ: مصادرُهم تقول إنّ <span class='en'>炒冰</span> تايوانيُّ المولد "
          "وأُعيدت تسميتُه «تايلندياً» بعد أن راج.)",
   viral="أدقُّ سلسلةٍ سببيّة في الملفّ. في <b>آذار ٢٠١٥</b> صوّر موظّفُ تسويقٍ ألماني اسمه <b>غيل غروبه</b> بائعاً في تايلند بهاتفه ورفع المقطع "
         "على فيسبوك: <b>٣٠٠ ألف مشاهدة وألفُ مشاركة</b>، ثم نقله إلى يوتيوب حيث بلغ <b>١٣٫٦ مليون</b>. "
         "فترك وظيفته وبنى قناة <span class='en'>Ice Cream Rolls</span>: <b>١٠٫٨ مليون مشترك</b> بحلول حزيران ٢٠٢١ — أحدُ أربعة ألمان فقط "
         "يحملون الزرَّ الماسي — واليومَ <b>١٢ مليوناً و١٫٧٣ مليار مشاهدة</b>، وأقوى مقطعٍ فيها <b>٧٥ مليون</b>. "
         "وفي آب ٢٠١٥ فتح <span class='en'>10Below</span> في تشايناتاون نيويورك فصار الطابورُ ساعةً — وثلاثاً أحياناً — "
         "بعد مقالٍ في <span class='en'>BuzzFeed</span> يوم ٢١ آب ٢٠١٥.",
   taste=["«قِوَامٌ كَثِيفٌ لا هَوَاءَ فِيه: بَارِدٌ كَالرُّخَام، لَيِّنٌ كَالقِشْدَة»",
          "«طَبَقَاتٌ رَقِيقَةٌ كَوَرَقِ البَقْلاوَة، تَنْكَسِرُ عِنْدَ أَوَّلِ مَلْعَقَة»",
          "«حَلِيبٌ مَشْغُولٌ عَلَى صَاجٍ بِثَلاثِينَ تَحْتَ الصِّفْر»",
          "«النَّكْهَةُ مَعْجُونَةٌ فِي الصَّمِيم، لا إِضَافَةً فَوْقَ الكَأْس»",
          "«بُرُودَةٌ حَادَّةٌ فِي البِدَايَة، ثُمَّ دِفْءُ القِشْدَة»"],
   moat="<b>لا حاجزَ فيه، ونقول ذلك صراحةً.</b> الصحن يُشترى، وفي تركيا يُباع امتيازُ محلٍّ كاملٍ بخمسة عشر إلى خمسة وعشرين ألف ليرة. "
        "والفئةُ في انكماشٍ موثَّق: <span class='en'>Sweet Charlie's</span> — أكبرُ امتيازٍ أمريكي فيها — من ٣ فروعٍ سنة ٢٠١٧ إلى ١٧+ سنة ٢٠٢٢ ثم <b>١٣ اليوم</b>؛ "
        "و<span class='en'>10Below</span> نفسها أغلقت ثلاثةَ مواقع في نيويورك. "
        "فلماذا هو في القائمة إذن؟ لسببٍ واحد: <b>العائلة والأطفال</b> — هو الصنفُ الذي يجلب الجمهور الذي يصوّر بقيّةَ القائمة. "
        "وهو الصنفُ الذي نفترض له <b>عمراً محدوداً</b> في النموذج، لا نموّاً دائماً.",
   line=[("c.2009","بانكوك: عرباتُ الشارع، أربعون باهتاً للحصّة"),
         ("Mar 2015","ألماني يصوّر بائعاً بهاتفه: 300 ألف مشاهدة على فيسبوك",1),
         ("Aug 2015","نيويورك: 10Below وطابورُ ثلاث ساعات بعد مقال BuzzFeed",1),
         ("2016–17","فيلادلفيا: من صفر محلٍّ إلى أكثر من اثني عشر في أربعة عشر شهراً"),
         ("2022→2026","Sweet Charlie's من 17+ فرعاً إلى 13 — الانكماش"),
         ("اليوم","العراق: أثرٌ واحدٌ على فيسبوك، ولا ذكرَ في أدلّة مقاهي بغداد")],
   stats=[("13.6M", "مشاهدة للمقطع الأصلي المصوَّر بهاتف"),
          ("1.73B", "مشاهدة لقناة Ice Cream Rolls منذ ٢٠١٥"),
          ("17 → 13", "فروعُ أكبر امتيازٍ أمريكي: الانكماشُ موثَّق")]),

 dict(k="jana", ar="جَنى", la="JANĀ", price=MENU["jana_box"]["price_usd_baghdad"],
   lead="سوربيه فاكهةٍ مصبوبٌ في قالبٍ يعيد شكل الفاكهة نفسها ولونها ووزنها في اليد: فراولة، مشمش، تين، ليمون، توت. تُمسَك كالفاكهة، فتنكسر عن قشرةٍ رقيقة ولُبٍّ كثيف.",
   origin="أربعةُ خيوطٍ تلتقي، وأوّلُها عربيّ: <span class='en'>frutta martorana</span> الصقلّية — حلوى اللوز المشكَّلة على هيئة الفاكهة — "
          "ورثتها صقلّيةُ عن العربِ الذين أدخلوا اللوزَ والسكّرَ إليها. والنسخةُ المجمَّدة الحديثة صناعيّةُ المنشأ: "
          "مصنعُ <span class='en'>红旗</span> في مدينة جيلين الصينية، ثم <b>Cédric Grolet</b> الذي جعل «الفاكهةَ المُقلَّدة» لغةَ الحلويات الراقية "
          "لعشرة ملايين متابع.",
   viral="<b>هذا هو الصنفُ الذي يعيش لحظتَه الآن، والأرقامُ ليست من تيك توك بل من رفوف المتاجر.</b> "
         "في <b>آب ٢٠٢٥</b> أدرجت سلسلةُ <span class='en'>GS25</span> الكورية الفاكهةَ المجمَّدة، فباعت <b>أكثرَ من مليون قطعة في شهرٍ واحد</b>، "
         "بإيرادٍ يوميٍّ للصنف الواحد فوق <b>مئة مليون وون</b> — نحو ٧٢ ألف دولار في اليوم — مع نفادٍ في الفروع. "
         "والصحافةُ الكورية عنونته «حلوى العشرة ملايين مشاهدة». "
         "وفي <b>١ كانون الأول ٢٠٢٥</b> دخل <span class='en'>7-Eleven</span> اليابان. وفي <b>قطر</b>، علامةُ <span class='en'>Mystical</span> "
         "بدأت مطبخاً سحابياً ثم صارت في كارفور ومونوبري خلال نحو سنة. وأقوى مقطعٍ في الفئة كلِّها: <b>٢٤٥٫٨ ألف إعجاب</b>.",
   taste=["قِشْرَةٌ رَقِيقَةٌ تَنْكَسِرُ بِطَقَّةٍ خَفِيفَة، ثُمَّ بَرْدٌ يَنْسَاب",
          "حُمُوضَةٌ نَظِيفَةٌ أَوَّلًا، وَحَلَاوَةٌ تَصِلُ مُتَأَخِّرَةً بِخُطْوَة",
          "كَثَافَةُ الفَاكِهَةِ كَامِلَة — لَا مَاءَ فِيهَا وَلَا بَلُّورَاتِ ثَلْج",
          "تِينٌ نَاضِجٌ وَتُوتٌ بَرِّيّ، مَحْبُوسَانِ عِنْدَ حَافَّةِ التَّجَمُّد",
          "لَيْمُونٌ يُوقِظُ الفَم، وَمِشْمِشٌ يُهَدِّئُهُ بَعْدَ لَحْظَة"],
   moat="حاجزُه ليس الشكل بل <b>القالب</b>: قوالبُ السيليكون البلاتيني المهنيّة تعمل من ٦٠− إلى ٢٣٠+، والقوالبُ الرخيصة "
        "هي سببُ أنّ أغلب التقليد يبدو لعبةً بلاستيكية. "
        "وهو أعلى صنفٍ في القائمة <b>ربحاً لكلِّ دقيقة إنتاج</b> — لأنه يُنتَج على دفعاتٍ لا عند الطلب — "
        "وهو <b>الصنفُ الوحيد الذي لا يحتاج مقهىً أصلاً</b>: قصّةُ <span class='en'>Mystical</span> القطرية تُثبت أنّ الطريقَ من مطبخٍ سحابي "
        "إلى رفِّ سوبرماركت خليجيّ يستغرق نحو سنة. وهذا خطُّ إيرادٍ ثانٍ كاملٌ لا نُدرِجه في النموذج.",
   line=[("1143→","صقلّية: فاكهةُ المارتورانا، وراثةً عن اللوز والسكّر العربيَّين"),
         ("2024","الصين: قالبُ المانجو الأحمر يعبر الحدود ويصير ترنداً عالمياً"),
         ("Aug 2024","الدوحة: أوّلُ محتوى خليجيّ مؤرَّخ للفئة"),
         ("Jan 2025","قطر: Mystical من مطبخٍ سحابيّ إلى مونوبري وسنونو",1),
         ("Aug 2025","كوريا: مليونُ قطعةٍ في شهر، و٧٢ ألف دولار يومياً للصنف",1),
         ("Dec 2025","اليابان: 7-Eleven بخمس نكهات — الفئةُ تدخل التجزئة")],
   stats=[("1,000,000+", "قطعة باعتها GS25 كوريا في شهرٍ واحد"),
          ("$72k / يوم", "إيرادُ الصنف الواحد في ذروته الكورية"),
          ("~12 شهراً", "من مطبخٍ سحابيّ إلى رفِّ سوبرماركت — سابقةُ قطر")]),

 dict(k="radhadh", ar="بَرَد", la="BARAD", price=MENU["radhadh"]["price_usd_baghdad"],
   lead="عصيرٌ يُعصَر في المكان، وسلاشٌ من فاكهةٍ حقيقية: رمّان، برتقال، مانجو، ليمون بالنعناع. لا مركّزات ولا مساحيق.",
   origin="الجرانيتا الصقلّية نفسها عربيّةُ الأصل: العربُ في صقلّية أدخلوا الشرابَ المُبرَّد بالثلج المجلوب من الجبال. "
          "وفي بغداد العبّاسية كانت بيوتُ الثلج تحفظ الثلجَ المنقولَ من الجبال لتبريد الشراب. "
          "هذا ليس تزييناً تاريخياً: هو أصلُ الصنف، وأصلُ الاسم الذي نحمله.",
   viral="ليس صنفاً فيروسياً، ولا يُفترض أن يكون. وظيفتُه معاكسةٌ تماماً: <b>التردُّد</b>. "
         "كلُّ علامةٍ تقوم على الدهشة تحتاج صنفاً يُشترى مرّتين في الأسبوع بلا قرار وبلا تصوير — "
         "وهو ما يُبقي الإيرادَ واقفاً في الشهر الرابع والعشرين حين تكون الدهشةُ قد هدأت.",
   taste=["فاكهةٌ تُعصَر أمامك","بردٌ خشنُ البلّورات","حموضةٌ حادّةٌ في الحرّ","لا مركّزات ولا مساحيق"],
   moat="لا حاجزَ فيه، وهذا مقصود. هو الأرضيّةُ التي تقف عليها بقيّةُ القائمة، والسببُ في أنّ النموذج لا ينهار "
        "إذا خفَتَ صنفٌ فيروسيٌّ واحد.",
   stats=[("2×", "شراءٌ أسبوعيٌّ متكرّر — هذا هو الغرض"),
          ("70 ثانية", "زمنُ التحضير، وهو الأسرع في القائمة"),
          ("15%", "من الإيراد، بأقلِّ ضجيج")]),
]

VERSES = [
 dict(a="شُجَّتْ بِذي شَبَمٍ مِن ماءِ مَحنِيَةٍ", b="صافٍ بِأَبطَحَ أَضحى وَهْوَ مَشمولُ",
      by="كعب بن زهير · «بانَتْ سُعادُ» · البيت الرابع",
      gl="ماءٌ باردٌ صافٍ من مُنعطَف وادٍ، بَرَّدَتْهُ ريحُ الشَّمال. ولسانُ العرب يستشهد بهذا البيت نفسه تحت مادّة «شبم»."),
 dict(a="وا حَرَّ قَلْباهُ مِمَّنْ قَلْبُهُ شَبِمُ", b="وَمَنْ بِجِسْمي وَحالي عِندَهُ سَقَمُ",
      by="أبو الطيّب المتنبّي",
      gl="البيتُ الوحيد الذي نجا من ثمانية أبياتٍ عُرِضَت علينا. اسمُ العلامة داخل أشهر شطرٍ في اللغة."),
 dict(a="لَحْمُ جَزورٍ سَنِمَةٍ، في غَداةٍ شَبِمَةٍ", b="بِشِفارٍ خَذِمَةٍ، في قُدورٍ هَزِمَةٍ",
      by="ابنة الخُسّ · سَجْع · منقول في «لسان العرب»",
      gl="سُئِلت: ما أطيبُ الأشياء؟ فقالت هذا. تحمل «شَبِمَة» — مؤنّث اسم العلامة — فتُعلِّم القاعدة على العبوة نفسها."),
]


# ═══════════════════════════════════════════════════════════════════════════
#  الأقسام
# ═══════════════════════════════════════════════════════════════════════════

def sec(i, num, title, body, cls="", sub=""):
    return f'''<section class="s {cls}" id="s{i}">
 <div class="in">
  <div class="eb"><span class="num">{num}</span><span class="ln"></span></div>
  <h2 class="t">{title}</h2>
  {f'<p class="sub">{sub}</p>' if sub else ''}
  {body}
 </div>
</section>'''


def fig(v, k, nt="", cls=""):
    return (f'<div class="g fig {cls}"><span class="v">{v}</span><span class="k">{k}</span>'
            f'{f"<span class=nt>{nt}</span>" if nt else ""}</div>')


def tbl(head, rows, cap=""):
    th = "".join(f'<th class="{"num" if isinstance(h,tuple) else ""}">{h[0] if isinstance(h,tuple) else h}</th>' for h in head)
    tb = ""
    for r in rows:
        rc = ""
        if len(r) == 2 and isinstance(r[1], str) and r[1] in ("tot", "sub") and isinstance(r[0], (list, tuple)):
            r, rc = r[0], r[1]
        tb += f'<tr class="{rc}">' + "".join(
            f'<td class="{"num" if isinstance(c,tuple) else ""}">{c[0] if isinstance(c,tuple) else c}</td>' for c in r) + "</tr>"
    return f'<div class="tw"><table><thead><tr>{th}</tr></thead><tbody>{tb}</tbody>{f"<caption>{cap}</caption>" if cap else ""}</table></div>'


S = []

# ── ١ · الاسم ──────────────────────────────────────────────────────────────
S.append(sec(1, "٠١", "الاسم", f'''
<div class="grid gA" style="align-items:start">
 <div>
  <p class="lede">في العربية كلمةٌ عامّة للبرد هي <b>بارِد</b>، تُقال للطقس وللطعام وللشخص وللنكتة.
  وفيها كلمةٌ واحدة تعني <b>بردَ الماء وحده</b>. هذه الكلمة هي <b>شَبِم</b>.</p>
  <div class="g" style="margin-top:1.6rem">
   <p class="verse" style="font-size:var(--s-1);line-height:2">«الشَّبَمُ: بَرْدُ الماءِ. وماءٌ شَبِمٌ: بارِدٌ.»</p>
   <p style="text-align:center;margin-top:.6rem;font-size:var(--s--2);color:var(--ink-4)">
     لسان العرب · ابن منظور (ت ٧١١هـ) · مادّة «شبم»</p>
  </div>
  <p class="lede">كلمةٌ لا تكاد تُستعمل في الكلام اليوم — ولهذا هي متاحة. عربيّةٌ بلا لبس، كلاسيكيّةٌ بلا تكلّف،
  وتعني بالضبط الشيءَ الذي نبيعه ولا شيئاً غيره.</p>
 </div>
 <div class="grid" style="gap:.8rem">
  {fig("شَبِم", "الشعار العربي — مشكولٌ دائماً بكسرة الباء",
       "الحركة ليست زخرفة. الشَّبَم بالفتحة هو المصطلح الطبّي الحديث لتضيّق القُلفة؛ شَبِم بالكسرة هو الصفة الشعرية. حرفٌ واحد يفصل بينهما.")}
  {fig("SHBM", "الشكلُ اللاتيني — أربعةُ حروفٍ صامتة",
       "قرارٌ مقصود: العلامةُ عربيّةٌ أولاً وآخِراً، واللاتينيّ مونوغرامٌ بصريّ لا اسمٌ منطوق. يُحفَر على الأغطية والزيّ والواجهة، ويُقرأ «شَبِم» دائماً.")}
  {fig("عربيٌّ بالكامل", "لغةُ العلامة",
       "لا نسخةَ إنجليزية موازية: القائمة، والعبوة، واللافتة، والتطبيق — كلُّها بالعربية. في سوقٍ يترجم كلُّ منافسيه أسماءهم إلى اللاتينية، العربيّةُ وحدها هي التمايز.")}
 </div>
</div>''', cls="q"))

# ── ٢ · الفكرة ─────────────────────────────────────────────────────────────
S.append(sec(2, "٠٢", "الفكرة", f'''
<div class="grid g3">
 {fig(N("134"), "يوماً في السنة فوق ٤٠° في بغداد", "ونحو ٤٦ يوماً فوق ٤٥°. الرقم القياسي ٥١.٨° في ٢٨ تموز ٢٠٢٠.")}
 {fig("٦٣٪", "من العراقيين تحت الثلاثين", "متوسط العمر ٢٠.٩ سنة. عدد السكان ٤٦,١١٨,٧٩٣ — تعداد ٢٠٢٤، الأول منذ ٣٧ عاماً.")}
 {fig(N("85"), "مقهىً مُعلَّماً في العراق كلّه", "واحدٌ لكل ٥٤٢ ألف نسمة. في السعودية واحدٌ لكل ٦,٦٠٠.")}
</div>
<p class="lede">ثلاث حقائق تبدو غير مترابطة. العراق من أشدّ البلاد المأهولة حرارةً على الأرض، وهو أصغرُ سوقٍ كبير في
العالم العربي سنّاً، وقطاعُ المقاهي المنظَّم فيه لا يكاد يوجد: ٨٥ فرعاً مقابل ٥,١٣٠ في السعودية. الفئةُ التي تتقاتل
عليها المنطقةُ كلّها لم تصل إلى هنا بعد.</p>
<p class="lede">وفي الوقت نفسه، المنتجُ البارد نفسه واقفٌ في مكانه. اللاتيه المثلَّج في بغداد سنة ٢٠٢٦ هو نفسه سنة
٢٠١٦: إسبريسو وحليب وكوبٌ من مكعّبات الثلج تُذيبه إلى ماءٍ خلال إحدى عشرة دقيقة. في مدينةٍ متوسطُ حرارتها في تموز
٤٥ درجة، هذا ليس منتجاً. هذه تسويةٌ اتّفق الجميع على التوقّف عن ملاحظتها.</p>
<div class="note hard" style="margin-top:1.8rem">
 <b>شَبِم جوابٌ عن سؤالٍ واحد:</b> كيف يبدو المشروب البارد لو صُمِّم لِـ ٤٨ درجة بدل أن يعتذر عنها؟ لا وصفةً أبرد —
 بل <b>جسماً</b> أبرد. كأسٌ عند ثمانين تحت الصفر. كوبٌ منحوتٌ من كتلة ثلج. فاكهةٌ مجمَّدةٌ على شكل الفاكهة.
 ومبنىً هو نفسه كتلةُ ثلجٍ تذوب على رصيفٍ في بغداد.
</div>'''))

# ── ٣ · الانتشار ───────────────────────────────────────────────────────────
S.append(sec(3, "٠٣", "لماذا يَنتَشِر", f'''
<p class="sub">هذه العلامة لا تشتري وصولاً. تصنع أسباباً لأن تُصوَّر — وكلُّ واحدٍ منها يصعب تقليده بنيوياً.</p>
<div class="grid g2" style="margin-top:2rem">
 <div class="g">
  <div class="cap">أربع لحظاتٍ تُصوَّر</div>
  <ol class="st">
   <li><b>المِلقط يخرج من الثمانين تحت الصفر.</b> ضبابٌ كثيف ينسكب على البار، والحليب يتجمّد على الزجاج أمام العين.
   تقليدُه يحتاج مُجمِّداً مخبرياً وبروتوكولاً على مرحلتين وإجراءَ سلامةٍ مكتوباً.</li>
   <li><b>ثقبُ القالَب.</b> أسطوانةٌ تُحفَر في ١٣٦ كيلوغراماً من ثلجٍ شفّافٍ كالزجاج. تقليدُه يحتاج مصنعَ تجميدٍ
   اتجاهيّ ودورةَ ثلاثة أيام لكل قالب.</li>
   <li><b>كشطُ اللفائف.</b> مألوفٌ وسريع ويُعاد تصويره بلا حدّ — المحتوى اليومي الذي يملأ المسافة بين اللحظات الكبرى.</li>
   <li><b>كسرُ الفاكهة.</b> فراولةٌ ليست فراولة. أكثرُ صورةٍ ثابتة في القائمة قابليةً لإعادة النشر، والوحيدةُ التي
   تسافر بلا محلّ.</li>
  </ol>
 </div>
 <div class="grid" style="gap:var(--gap)">
  <div class="g">
   <div class="cap">وما تقوله الشواهد عن الحجم</div>
   <ul class="tk">
    <li><b>FIX Dessert Chocolatier</b> في دبي: لوحٌ واحد، انتشر في كانون الأول ٢٠٢٣، وفي الربع الأول من ٢٠٢٥ وحده
    بيع <b>١.٢ مليون لوح</b> عبر دبي ديوتي فري — نحو <b>٢٢ مليون دولار</b> من نقطة بيعٍ واحدة.</li>
    <li><b>Regulars</b> في ملبورن: نحو <b>٦٠٠ كأس يومياً</b> من مشروبٍ واحد عند ٨٥ تحت الصفر.</li>
    <li><b>الجمهور العراقي مُجتمِعٌ أصلاً:</b> ٣٩.٦ مليون مستخدم إنترنت، ٢٣.٦ مليون على إنستغرام، ١٨.٥ مليون على
    سناب شات — ثالثُ أكبر سوقٍ لسناب في المنطقة بعد السعودية ومصر. وحسابٌ واحد للطعام في بغداد يتابعه ١.١ مليون.</li>
   </ul>
  </div>
  <div class="note">
   <b>والحجّةُ المضادّة، بالأرقام.</b> الصيغُ القائمة على الدهشة لها نافذةُ انتباهٍ موثَّقة من <b>١٢ إلى ٢٤ شهراً</b>.
   Crumbl تجاوزت ألف فرع ثم تراجع متوسطُ مبيعات الفرع عن ذروته، ومبيعاتُ المحال المماثلة سالبة حتى ٢٠٢٤.
   واللفائف نفسها عاشت ٢٠١٥–٢٠١٨ ثم اختفت. جوابُنا بنيويٌّ لا تفاؤليّ: الدهشةُ تجلب، و<b>بَرَد</b> و<b>جَنى</b>
   يُعيدان، ودورانُ الفاكهة الموسمي يعطي سبباً للعودة مبنيّاً في سلسلة التوريد لا مخترَعاً في التسويق.
  </div>
 </div>
</div>''', cls="q"))

# ── ٤ · المنتجات ───────────────────────────────────────────────────────────
def _ar(t):
    """True when the label is Arabic, so it keeps the Arabic face and RTL flow
    instead of being isolated as a Latin date."""
    return any("\u0600" <= c <= "\u06FF" for c in t)


def product_block(p):
    stats = "".join(f'<div><span class="vnum">{v}</span><span class="vlab">{l}</span></div>' for v, l in p["stats"])
    taste = "".join(f"<span>{t}</span>" for t in p["taste"])
    tl = ""
    if p.get("line"):
        items = "".join(
            f'<div class="tl-i{" hi" if len(e) > 2 and e[2] else ""}">'
            f'<span class="tl-d{"" if _ar(e[0]) else " en"}">{e[0]}</span>'
            f'<span class="tl-t">{e[1]}</span></div>'
            for e in p["line"])
        tl = (f'<div class="tl"><div class="tl-h">متى انتشر — بالتواريخ</div>'
              f'<div class="tl-r" style="--n:{len(p["line"])}">{items}</div></div>')
    return f'''<div class="pb">
 <div class="pb-head">
  <span class="pb-ar">{p["ar"]}</span><span class="pb-la en">{p["la"]}</span>
  <span class="pb-price">{usd(p["price"],2)} <span style="font-size:.62em;color:var(--ink-4)">· {iqd(p["price"])} د.ع</span></span>
 </div>
 <p class="pb-lead">{p["lead"]}</p>
 <div class="pb-grid">
  <div class="pb-ico">{ICON[p["k"]]}</div>
  <div>
   <div class="pb-cols">
    <div class="pb-col"><h4>من أين جاء</h4><p>{p["origin"]}</p></div>
    <div class="pb-col"><h4>متى انتشر</h4><p>{p["viral"]}</p></div>
    <div class="pb-col"><h4>لماذا يصعب تقليده</h4><p>{p["moat"]}</p></div>
   </div>
   <div class="taste">{taste}</div>
   <div class="grid g3" style="margin-top:1.4rem;gap:1rem">{stats}</div>
  </div>
 </div>
 {tl}
</div>'''


_prod_row = _phrow([("p_" + p["k"], p["ar"]) for p in PRODUCTS], "sq",
                   "margin-bottom:2.6rem", "phgrid g3")

S.append(sec(4, "٠٤", "المنتجات", f'''
<div class="note" style="margin-bottom:2.6rem">
 <b>كلُّ تاريخٍ في هذا القسم مُتحقَّقٌ منه، بما فيه ما لا يخدمنا.</b> ستّةُ ملفّاتٍ بحثيّةٍ مستقلّة تتبّعت لكلِّ صنف:
 من اخترعه ومتى، وأيَّ حسابٍ نشر أيَّ مقطعٍ في أيِّ يوم، وكم بلغ، وماذا حدث للفئة <b>بعد</b> الذروة.
 والنتيجةُ ليست ستّةَ أصنافٍ صاعدة: <b>جَنى</b> يعيش ذروتَه الآن، و<b>صَقيع ٨٠−</b> عمرُه أربعةَ عشر شهراً،
 و<b>لَفائِف</b> في انكماشٍ موثَّق منذ ٢٠٢٢ — وهذا مُدرَجٌ في النموذج لا مُخفىً عنه.
</div>''' + _prod_row
 + "".join(product_block(p) for p in PRODUCTS)
 + (img("spread", "القائمةُ كاملة", "القائمةُ كاملةً في طلبٍ واحد.") if has_img("spread") else "")
 + f'''
<div class="note hard" style="margin-top:2.4rem">
 <b>القائمة مبنيّةٌ كأثقالٍ على طرفَين، عن قصد.</b> صنفان بطيئان غاليان لا يُنسَيان
 (<b>صَقيع ٨٠−</b> و<b>القالَب</b>) يصنعان اللقطةَ والطابور. وثلاثة أصنافٍ سريعة رخيصة عالية التردُّد
 (<b>لُؤلُؤ</b>، <b>بَرَد</b>، <b>جَنى</b>) تصنع الزيارةَ المتكرّرة. وصنفٌ واحد (<b>لَفائِف</b>) يجلب العائلة والأطفال.
 اسحب أيّاً منها ينكسر شيءٌ في البنية.
</div>
<div class="note" style="margin-top:1.2rem">
 <b>ولا شيءَ حارّ. أبداً.</b> شَبِم يقدّم البارد فقط — لا قهوةً ساخنة ولا شاياً ولا شوكولا. هذا قرارٌ يُكلِّف:
 كانون الأول وكانون الثاني في بغداد يهبطان إلى <b>٤٧٪</b> من متوسط السنة، ويكادان لا يربحان شيئاً. الأرقام في
 القسم <span class="n">08</span> تُظهر ذلك صراحةً بدل أن تُخفيه. مقابله نحصل على علامةٍ لا تحتاج شرحاً:
 مكانٌ واحد، فكرةٌ واحدة، لا استثناءات.
</div>'''))

# ── ٥ · المكعّب من الخارج ──────────────────────────────────────────────────
_EXT_SHOTS = [("cube_day", "نهاراً — الساعةُ الثانية عشرة، خمسٌ وأربعون درجة"),
              ("cube_night", "ليلاً — الكتلةُ مضاءةٌ من داخلها"),
              ("cube_dawn", "الفجر — ماءُ الليلة على الإسفلت"),
              ("cube_rear", "من الخلف — البارُ يلفّ الجناحَين والظهر")]
_ext = "".join(img(k, c, c, cls="wide") for k, c in _EXT_SHOTS if has_img(k))

S.append(sec(5, "٠٥", "المُكعَّب من الخارج", (
 f'''<div class="phgrid" style="margin-bottom:2.4rem">{_ext}</div>''' if _ext else "") + f'''
<div class="grid gA" style="align-items:center">
 <div>{cube_exterior()}{img("face_detail","الفتحاتُ الثلاث","الفتحاتُ الثلاث، عن قرب: شاشةٌ للطلب، وشبّاكٌ للاستلام، وفتحةٌ لإرجاع الأكواب.",cls="sq") if has_img("face_detail") else ""}</div>
 <div>
  <p class="lede">ليس مكعّباً هندسيّاً. كتلةُ ثلجٍ <b>مائلة</b>، حوافُّها مأكولةٌ بالذوبان، أضلاعُها غير مستقيمة،
  وقاعدتُها أضيق من قمّتها — كما تفعل كتلةُ ثلجٍ حقيقية تركتها تحت الشمس.</p>
  <ul class="tk" style="margin-top:1.4rem">
   <li><b>ندى.</b> الوجهُ كلّه مُحبَّبٌ بقطراتٍ متكاثفة، أكثفَ كلّما نزلت.</li>
   <li><b>ماءٌ يسيل.</b> خيوطٌ تنزل على الجوانب وتتجمّع قطراتٍ معلّقةً على الحافة السفلى.</li>
   <li><b>يذوب على الرصيف.</b> بِركةٌ غيرُ منتظمة تتمدّد حول القاعدة وتزحف منها جداولُ رفيعة على الإسمنت.</li>
   <li><b>دخانُ برد.</b> ضبابٌ ثقيل ينزل من القاعدة ويتدحرج على الأرض — مثل أيّ شيءٍ شديدِ البرودة تحت شمسٍ حارقة.
   ومن بعيد يبدو المبنى كأنّه يدخّن.</li>
   <li><b>رذاذٌ منعش.</b> فوّهاتُ ضبابٍ عالي الضغط تحت الإفريز تُنزل حرارةَ محيط الجلوس ٨ إلى ١٥ درجة.</li>
   <li><b>اسمٌ محفور.</b> <b>شَبِم</b> بالعربية، غائرةً في مادّة الثلج لا مطبوعةً عليها.</li>
  </ul>
  <div class="note" style="margin-top:1.4rem">
   <b>القرار الهندسي الذي يحمي هذا كلّه:</b> الجدارُ قشرتان لا قشرةٌ واحدة. الخارجيةُ أكريليك مصبوب ٢٠–٣٠ ملم،
   منقوشٌ ومُضاءٌ من الحافة. الداخليةُ بولي كربونات متعدّدة الجدران — المادّةُ الشفّافة الرخيصة الوحيدة التي تعزل فعلاً.
   والتجويفُ بينهما مُهوّى، فيُسقِط معامل الكسب الشمسي من ٠.٣٥ إلى ٠.٢٧ ويطرد ٣ كيلوواط حرارية.
   أمّا الكتلُ الأكريليكية المصمتة فليست خياراً: المتر المربّع بسماكة ١٠٠ ملم يكلّف حتى ٢,٩٧٥ دولاراً.
  </div>
  <div class="note hard" style="margin-top:1.2rem">
   <b>كتلةٌ مُصمَتة، لا واجهةُ زجاج.</b> لا يستطيع أحدٌ أن يرى الداخل من أيّ زاوية: المادّةُ مُعتِمةٌ تنشر الضوء
   ولا تنقل الصورة. وفي المبنى كلِّه <b>ثلاثُ فتحاتٍ فقط</b> — شاشةُ الطلب، وشبّاكُ الاستلام، وفتحةُ إرجاع الأكواب —
   ولكلٍّ منها ظهرٌ مغلقٌ من المادّة نفسها، فهي صناديقُ تمريرٍ لا نوافذ. الغموضُ هنا ليس أسلوباً بصرياً فحسب:
   هو أيضاً ما يجعل حفظَ البرودة ممكناً عند خمسٍ وأربعين درجة.
  </div>
 </div>
</div>''', cls="d"))

_INT_SHOTS = [("interior", "الداخل — بارٌ للإنتاج، لا صالةَ جلوس"),
              ("interior_menu", "القائمةُ محفورةٌ في الجدار، والشاشاتُ من فتحاتٍ في المادّة")]
_SVC_SHOTS = [("order_screen", "الطلبُ على شاشة — بلا كاشير"),
              ("hatch_collect", "الاستلامُ من شبّاكٍ ذاتيّ"),
              ("hatch_return", "إرجاعُ الكوب — بلا تواصلٍ مع أحد"),
              ("barista", "معطفٌ شتويّ، في آب"),
              ("bar_seats", "بارٌ من المادّة نفسها")]

_int_row = _phrow(_INT_SHOTS, "wide", "margin:2rem 0 .5rem")
_svc_row = _phrow(_SVC_SHOTS, "sq", "margin-top:2rem", "phgrid g3")

# ── ٦ · المكعّب من الداخل ──────────────────────────────────────────────────
S.append(sec(6, "٠٦", "المُكعَّب من الداخل", f'''
<p class="sub">٢٥ متراً مربّعاً. كشكٌ حقيقي بمقاسٍ حقيقي — لا مطعم.</p>
{_int_row}
<div style="margin-top:2rem">{cube_interior()}</div>
{_svc_row}
<div class="grid g3" style="margin-top:2.2rem">
 <div class="g"><div class="cap">بارد فعلاً، لا مجازاً</div>
  <p>جوفُ الكشك مُبرَّدٌ كغرفةِ تبريد. العاملون يرتدون معاطفَ شتويّة في آب. هذا ليس تفصيلاً جمالياً بل هو المنتج:
  الزبونُ يشعر بالفرق على جلده قبل أن يذوق شيئاً. وثمنُه في الفاتورة صريح — الغلافُ يقاوم فارقاً حرارياً من ٣٠ إلى
  ٣٥ درجة في محيطٍ عند ٤٥ إلى ٥٠.</p></div>
 <div class="g"><div class="cap">لا كاشير، ولا طابور عند الشبّاك</div>
  <p>الطلبُ ذاتيّ من شاشة. فتحةٌ يمين للطلب، وفتحةٌ يسار للاستلام تفتح من جهةٍ واحدة: الموظّف يضع الطلب ويُغلق،
  فيفتحها الزبون من جهته. فوقها شاشةٌ صغيرة محفورةٌ في الثلج تُظهر رقم الطلب. وفتحةٌ ثالثة منخفضة لإرجاع الأكواب.
  لا احتكاكَ ولا كلامَ ولا انتظارَ أمام شخص.</p></div>
 <div class="g"><div class="cap">الجدارُ هو القائمة</div>
  <p>المنيو محفورٌ في الجدار الجليدي نفسه. وخلف البار شاشاتٌ تظهر من فتحاتٍ مقطوعةٍ في المادّة، فتبدو كأنّها معلَّقةٌ
  داخل الثلج. ومن الخارج، يلتفّ بارُ جلوسٍ حول الكتلة من جوانبها كلّها، تحت رذاذٍ خفيف.</p></div>
</div>
<div class="note hard" style="margin-top:1.8rem">
 <b>وهذا هو الحاجز الحقيقي.</b> منافسٌ يستطيع شراء صحن لفائف. لا يستطيع بسهولة بناء غرفةِ تبريدٍ شفّافة
 فيها مُجمِّدٌ عند ثمانين تحت الصفر ومصنعُ ثلجٍ اتجاهيّ ومولّدةٌ مخصّصة ٦٠ ك.ف.أ وعقدُ صيانةٍ متخصّص —
 ثم يشغّلها في بغداد بشبكةِ كهرباءٍ تعطي ٨ إلى ١٢ ساعة في اليوم.
</div>'''))

# ── ٧ · العلامة ────────────────────────────────────────────────────────────
_BRAND_SHOTS = [("brand_sheet","الشعارُ بأربع معالجات — غائرٌ ومحفورٌ ومطبوعٌ ومقطوع"),
                ("packaging","عائلةُ العبوات — كلُّها من مادّةِ الثلج نفسها"),
                ("uniform","زيُّ العاملين — معطفٌ شتويّ في عزّ الصيف"),
                ("card","بطاقةُ العمل — لوحٌ مثلَّجٌ شفّاف، الاسمُ غائرٌ بلا حبر"),
                ("menu_card","القائمةُ محفورةٌ ومضاءةٌ من الحافة")]
_brand_row = _phrow(_BRAND_SHOTS, "sq", "margin-bottom:2.4rem", "phgrid g3")

S.append(sec(7, "٠٧", "العلامة والعبوة", _brand_row + f'''
<div class="grid gB" style="align-items:start">
 <div class="grid" style="gap:1rem">
  {"".join(f"""<div class="g flat"><div class="verse">{v['a']}<span class="sep">❊</span>{v['b']}
   <span class="by">{v['by']}</span><span class="gl">{v['gl']}</span></div></div>""" for v in VERSES)}
 </div>
 <div>
  <p class="lede">العلامةُ عربيّةٌ بالكامل: الاسم، والقائمة، والعبوة، واللافتة، والتطبيق.
  و<b>SHBM</b> مونوغرامٌ محفور لا اسمٌ منطوق. في سوقٍ يُترجِم فيه كلُّ منافسٍ اسمَه إلى اللاتينية،
  التمسّكُ بالعربية وحدها هو أرخصُ تمايزٍ وأصعبُه تقليداً.</p>
  <p class="lede">والعبوةُ تحمل شِعراً عربياً كلاسيكياً فيه كلمة <b>شبم</b> — لا كزينة، بل لأنّ الكلمة نفسها
  جاءتنا من هذا الشعر. البيتُ الأوّل من <b>بانَتْ سُعاد</b>، وهو البيتُ الذي يستشهد به لسانُ العرب في مادّة «شبم»
  نفسها. أي أنّ العبوة تشرح الاسمَ بالمصدر الذي أخذنا منه الاسم.</p>
  <ul class="tk" style="margin-top:1.4rem">
   <li>سطرُ لسان العرب على <b>كلّ</b> عبوة: «الشَّبَمُ: بَرْدُ الماءِ».</li>
   <li>كلُّ بيتٍ مُوثَّق: اسمُ الشاعر واسمُ القصيدة بخطٍّ صغير. التوثيقُ هو ما يفصل العلامةَ التي <b>تستعمل</b>
   التراث عن التي <b>تتزيّن</b> به.</li>
   <li>كلُّ نصٍّ مشكولٌ بالكامل. الجمهورُ الذي يُغرى بالشعر هو نفسه الذي يلاحظ الشكلَ الناقص.</li>
   <li>حبرٌ حسّاس للبرودة على الكُمّ: البيتُ لا يظهر إلا حين يكون المشروب بارداً فعلاً. العبوةُ تُثبِت ادّعاء المنتج.</li>
   <li>سلسلةُ أبياتٍ متبدّلة عبر المواسم: العبوةُ تصير شيئاً يُجمَع، لا شيئاً يُرمى.</li>
  </ul>
  <div class="note" style="margin-top:1.4rem">
   <b>قاعدةٌ واحدة في اختيار النصّ.</b> لا يُطبَع بيتٌ إلا بعد مطابقته على طبعةٍ محقَّقة، ولا يُطبَع نصٌّ
   دينيّ — لا قرآنٌ ولا حديث — على شيءٍ يُرمى في سلّة. القائمةُ النهائية والمراجع في ملفّ اللغة.
  </div>
 </div>
</div>''', cls="q"))

# ── ٨ · السوق ──────────────────────────────────────────────────────────────
S.append(sec(8, "٠٨", "السوق", f'''
<p class="sub">المساحةُ الفارغة ليست تقديراً. هي عَدّ.</p>
<figure style="margin-top:2rem">
 {hbars([("السعودية", 152, "٥,١٣٠ فرعاً مُعلَّماً · ٣٣.٣ مليون نسمة"),
         ("متوسّط المنطقة", 38, "١١,١٦٣ فرعاً مُعلَّماً عبر أسواق التقرير"),
         ("العراق", 1.8, "٨٥ فرعاً مُعلَّماً · ٤٦.١ مليون نسمة")],
        fmt=lambda v: f"{v:,.1f}" if v < 10 else f"{v:,.0f}",
        unit="",
        lab="فروع المقاهي المُعلَّمة لكل مليون نسمة: السعودية ١٥٢، متوسط المنطقة ٣٨، العراق ١.٨")}
 <figcaption><b>فرعُ مقهىً مُعلَّم لكلّ مليون نسمة.</b> الأساسُ واحدٌ في الأعمدة الثلاثة —
 الفروعُ المُعلَّمة وحدها، من <span class="en">Project Café Middle East 2025</span> — فالعراق أقلُّ خدمةً
 من السعودية بنحو <b>٨٥ ضعفاً</b>. (الإماراتُ خارج العمود عمداً: رقمُها المتداول «أكثر من ٩,٠٠٠ مقهى»
 يَعُدّ كلَّ المقاهي لا المُعلَّمة منها، ووضعُه إلى جانب رقمٍ مُعلَّم يُفسِد المقارنة.)</figcaption>
</figure>
<div class="grid g2" style="margin-top:2.2rem">
 <div class="g"><div class="cap">والسوق يُثبَت الآن — بأموال غيرنا</div>
  <ul class="tk">
   <li><b>Half Million</b> السعودية، التي بلغت ٥٩ فرعاً في ١٤ مدينة خلال سبع سنوات، تفتتح أول فرعٍ لها في العراق
   داخل <b>عراق مول</b> ببغداد.</li>
   <li><b>%Arabica</b> دخلت بغداد. و<b>Kyan Café</b> السعودية افتتحت أول فروعها العراقية في البصرة.</li>
   <li><b>عراق مول</b> افتُتح في الدورة في شباط ٢٠٢٦: أكثر من ٥٥٠ ألف متر مربّع وأكثر من ألف وحدة — الأكبر في
   العراق والثالث في الشرق الأوسط.</li>
   <li><b>مهرجان بغداد للقهوة والشاي</b> استقبل ٦٢ ألف زائر في ٢٠٢٤ وأكثر من ١٠٠ ألف في ٢٠٢٥.</li>
  </ul>
 </div>
 <div class="g"><div class="cap">والحرارة هي السوق</div>
  {heat([("البصرة", [18,21,26,32,39,44,46,46,43,35,26,19]),
         ("بغداد", BAG_T),
         ("الكويت", [19,21,26,33,40,45,46,46,42,35,27,21]),
         ("الرياض", [21,24,28,33,39,42,43,43,40,35,27,22]),
         ("الدوحة", [22,23,27,32,39,42,42,41,39,35,30,25]),
         ("دبي", [24,25,28,32,37,39,41,41,38,35,30,26])],
        w=430, lab="متوسط الحرارة العظمى شهرياً في ست مدن مستهدفة")}
  <p style="margin-top:1rem;font-size:var(--s--2);color:var(--ink-4);line-height:1.8">
  الأيام فوق ٤٠° سنوياً: الكويت ١٣١، بغداد ~١٣٤، الرياض ١٠٧، الدوحة ٩٣، دبي ٦٨.
  والقاهرة ٥ إلى ١٥ فقط — ولهذا مصر ليست في الخطّة.</p>
 </div>
</div>''', cls="d"))

# ── ٩ · الأرقام ────────────────────────────────────────────────────────────
_cap = FLAG["capacity"]; _b = FLAG["basket"]; _m2 = FLAG["monthly_y2"]
_cx = FLAG["capex"]["items"]
S.append(sec(9, "٠٩", "الأرقام", f'''
<p class="sub">كلُّ سعرٍ وكلُّ كلفة مبنيّان على مُدخَلٍ بغداديٍّ مصدره معروف. الاشتقاق الكامل في الملحق.</p>
{tbl(["الصنف", ("السعر",), ("د.ع",), ("الكلفة",), ("هامش",), ("زمن",), ("حصّة الإيراد",)],
  [[f'<b>{p["ar"]}</b>', (usd(MENU[k]["price_usd_baghdad"],2),), (iqd(MENU[k]["price_usd_baghdad"]),),
    (usd(MENU[k]["cogs_usd_baghdad"],2),),
    (f'{(1-MENU[k]["cogs_usd_baghdad"]/MENU[k]["price_usd_baghdad"])*100:.0f}%',),
    (f'{MENU[k]["prep_seconds"]}ث',), (f'{MIX.get(k,0)*100:.0f}%',)]
   for p, k in [(PRODUCTS[0],"saqee80"),(PRODUCTS[1],"qalab"),(PRODUCTS[2],"boba"),
                (PRODUCTS[3],"lafaif"),(PRODUCTS[4],"jana_box"),(PRODUCTS[5],"radhadh")]]
  + [(["<b>السلّة المرجَّحة</b>", ("<b>—</b>",), ("—",), ("—",),
       (f'<b>{_b["gross_margin_pct"]*100:.0f}%</b>',), (f'{_cap["avg_item_prep_seconds"]:.0f}ث',), ("١٠٠٪",)], "tot")],
  cap="حصّةُ الإيراد لا حصّةُ العدد. القالَب ١٢٪ من الإيراد و٦٪ فقط من الأصناف المُباعة — هو مِرساةُ سعرٍ وصانعُ طابور، لا صنفُ حجم.")}

<div class="grid g4" style="margin-top:2rem">
 {fig(usd(_b["avg_ticket"],2), "متوسط الفاتورة", f'{iqd(_b["avg_ticket"])} د.ع · {_b["items_per_ticket"]} صنف لكل عملية')}
 {fig(f'{_b["gross_margin_pct"]*100:.0f}%', "الهامش الإجمالي المرجَّح", "قبل الهدر. كلفةُ البضاعة ٢٨٪ من الإيراد بعد الهدر والضريبة.")}
 {fig(N(_cap["peak_tx_per_hour"]), "عملية في ساعة الذروة", f'٣ محطّات إنتاج وصحنا لفائف. القيدُ الفعّال: {"صحون اللفائف" if _cap["binding_constraint"].startswith("rolled") else "محطّات الإنتاج"}.')}
 {fig(f'{max(m["capacity_used_pct"] for m in _m2):.0f}%', "أقصى استغلالٍ للطاقة، تموز", "النموذج لا يفترض امتلاءً أبداً. ثلثُ الطاقة ما يزال غيرَ مُباع في أحرّ ساعةٍ في السنة.")}
</div>

<h3 style="font-size:var(--s-2);font-weight:300;margin:3rem 0 1rem">شكلُ السنة</h3>
<figure>
 <div class="legend"><span><i></i>ذروة</span><span><i class="b"></i>وسط</span><span><i class="c"></i>قاع</span>
 <span><i class="line" style="width:20px"></i>متوسط الحرارة العظمى في بغداد</span></div>
 {col_months(MONS, [m["tx_per_day"] for m in _m2], BAG_T,
   lab="عدد العمليات يومياً على مدار السنة الثانية مقابل حرارة بغداد")}
 <figcaption>القاع {min(m["tx_per_day"] for m in _m2):.0f} عمليةً يومياً في كانون الأول، والذروة
 {max(m["tx_per_day"] for m in _m2):.0f} في تموز — تأرجحٌ بمقدار
 {max(m["tx_per_day"] for m in _m2)/min(m["tx_per_day"] for m in _m2):.1f} أضعاف.</figcaption>
</figure>
<div class="note hard" style="margin-top:1.6rem">
 <b>وهذه هي كلفةُ إلغاء المشروبات الساخنة، صريحةً.</b> كانون الأول يحقّق {usd(_m2[11]["ebitda"])} فقط من الأرباح
 التشغيلية على إيرادٍ قدره {usd(_m2[11]["gross_revenue"])}. شهران في السنة نفتح فيهما ولا نربح شيئاً تقريباً.
 نُخفِّف ذلك بأمرين لا يكسران القاعدة: <b>تقليص المِلاك ٣٠٪</b> في الشهرَين إلى طاقمٍ مُصغَّر وساعاتٍ قصيرة،
 و<b>رمضان</b> — الذي يتقدّم أحد عشر يوماً كلَّ سنة، فيدخل شباط في ٢٠٢٧ وكانون الثاني في ٢٠٢٩ وأوائل كانون الثاني
 في ٢٠٣٠. أكبرُ مناسبةٍ مسائيّةٍ للمشروبات الباردة في السنة تزحف نحو أضعفِ شهورنا.
</div>

<h3 style="font-size:var(--s-2);font-weight:300;margin:3rem 0 1rem">الفرع الأول في بغداد</h3>
<figure>
 <div class="legend"><span><i class="c"></i>الإيراد</span><span><i></i>الأرباح التشغيلية · بالنسبة تحت العمود</span></div>
 {pnl_bars(FLAG["years"], lab="الإيراد والأرباح التشغيلية للفرع الأول على خمس سنوات")}
</figure>
{tbl(["", ("س١",), ("س٢",), ("س٣",), ("س٤",), ("س٥",)],
  [[lab] + [(fn(y),) for y in FLAG["years"]] for lab, fn in [
    ("الإيراد", lambda y: usd(y["gross_revenue"])),
    ("ضريبة المبيعات ١٠٪", lambda y: f'({usd(y["sales_tax"])})'),
    ("عمولة التوصيل", lambda y: f'({usd(y["delivery_commission"])})'),
    ("كلفة البضاعة والهدر", lambda y: f'({usd(y["cogs"])})'),
    ("الرواتب والضمان ١٢٪", lambda y: f'({usd(y["labour"])})'),
    ("الإيجار", lambda y: f'({usd(y["rent"])})'),
    ("الطاقة والتبريد والمولّدة", lambda y: f'({usd(y["utilities"])})'),
    ("التسويق", lambda y: f'({usd(y["marketing"])})'),
    ("مصاريف تشغيلية أخرى", lambda y: f'({usd(y["other_opex"])})'),
  ]]
  + [(["<b>الأرباح التشغيلية</b>"] + [(f'<b>{usd(y["ebitda"])}</b>',) for y in FLAG["years"]], "tot")]
  + [(["الهامش التشغيلي"] + [(f'{y["ebitda_margin"]*100:.0f}%',) for y in FLAG["years"]], "sub")]
  + [(["صافي الدخل بعد الاستهلاك والضريبة"] + [(usd(y["net_income"]),) for y in FLAG["years"]], "sub")],
  cap="السنةُ الأولى تعمل بـ٦٢٪ من الحجم الناضج: شهرا تجهيز، ثم قفزةُ افتتاح، ثم استقرار. السنةُ الثانية هي الأساس.")}

<div class="grid g4" style="margin-top:2rem">
 {fig(kk(FLAG["capex"]["total"]), "كلفة بناء الفرع الأول", f'{usd(FLAG["capex"]["total"])} — كلفةُ نموذجٍ أوّليّ تحمل أتعاب هوية وعمارة لمرّةٍ واحدة و١٢٪ طوارئ.')}
 {fig(kk(Y2["gross_revenue"]), "إيراد السنة الثانية", usd(Y2["gross_revenue"]))}
 {fig(f'{FLAG["payback_months"]:.0f}<span class="u">شهر</span>', "استرداد رأس المال", "من الأرباح التشغيلية، منذ الافتتاح.")}
 {fig(f'{FLAG["irr_5y"]:.0f}%', "العائد الداخلي على ٥ سنوات", f'صافي القيمة الحالية عند خصم ٢٠٪: {usd(FLAG["npv_5y_at_20"])}')}
</div>

<h3 style="font-size:var(--s-2);font-weight:300;margin:3rem 0 1rem">ماذا لو كنّا مخطئين</h3>
<figure>{scen(lab="الأرباح التشغيلية في السنة الثانية عبر ستة سيناريوهات")}</figure>
<div class="note" style="margin-top:1.4rem">
 <b>السيناريو المتشائم هو الذي يستحقّ النظر.</b> حجمٌ أقلّ ٣٠٪ من الخطّة، وخصمٌ على الصنفَين المميّزَين، وإيجارٌ
 أعلى بالثلث، وكلفةُ تبريدٍ أعلى ٤٥٪: الفرع يبقى موجبَ النقد كلَّ شهر، لكنّه <b>لا يستردّ رأس ماله خلال خمس سنوات</b>.
 هذا هو الجانبُ السلبي الحقيقي، ويستحقّ أن يُقال بوضوح: ليس مشروعاً فاشلاً، بل مالاً محبوساً. من يضع مالاً هنا
 يجب أن يقيس حجمَ مركزه على هذا الاحتمال لا على الأساس.
</div>''', cls="q"))

# ── ١٠ · الامتياز ──────────────────────────────────────────────────────────
_F = A["franchise"]
# ── ١٠ · كم نبيع من كلّ صنف ────────────────────────────────────────────────
_ipt   = _b["items_per_ticket"]
_share = _b["unit_share"]
_SKU   = [("صَقيع ٨٠−","saqee80"),("القالَب","qalab"),("لُؤلُؤ","boba"),("لَفائِف","lafaif"),
          ("جَنى — قطعة","jana_piece"),("جَنى — علبة","jana_box"),("بَرَد","radhadh")]
_units = {k: [m["transactions"] * _ipt * _share[k] for m in _m2] for _, k in _SKU}
_ytot  = {k: sum(v) for k, v in _units.items()}
_gt    = sum(_ytot.values())
_peak  = {k: max(v) for k, v in _units.items()}

S.append(sec(10, "١٠", "كم نبيع من كلّ صنف", f'''
<p class="sub">السنةُ الثانية، شهراً بشهر، صنفاً بصنف. هذه هي خطّةُ الإنتاج لا التوقّع فقط.</p>

<figure style="margin-top:2rem">
 {smalls([(ar, [round(x) for x in _units[k]], f"{_ytot[k]:,.0f}") for ar, k in _SKU],
         lab="المبيعات الشهرية بالوحدات لكل صنف في السنة الثانية")}
 <figcaption>وحداتٌ مُباعة شهرياً، والرقمُ تحت كلّ اسمٍ هو إجمالي السنة. المقياسُ مشترَكٌ بين اللوحات السبع
 فهي قابلةٌ للمقارنة مباشرةً، والعمودُ الداكن في كلّ لوحةٍ هو شهرُ الذروة — <b>تموز</b> في جميعها بلا استثناء.
 الإجمالي <b class="n">{_gt:,.0f}</b> وحدة في السنة، من <b class="n">{sum(m["transactions"] for m in _m2):,.0f}</b> عمليةِ بيع
 بمعدّل <b class="n">{_ipt}</b> صنفٍ لكلّ عملية.</figcaption>
</figure>

<div style="margin-top:2.4rem">
 {tbl(["الصنف"] + [(x,) for x in MONS] + [("السنة",)],
      [[ar] + [(f"{_units[k][i]:,.0f}",) for i in range(12)] + [(f"<b>{_ytot[k]:,.0f}</b>",)]
       for ar, k in _SKU]
      + [(["<b>الإجمالي</b>"]
          + [(f'<b>{sum(_units[k][i] for _, k in _SKU):,.0f}</b>',) for i in range(12)]
          + [(f"<b>{_gt:,.0f}</b>",)], "tot")],
      cap="وحداتٌ مُباعة — السنة الثانية عند ٣٠٠ عمليةٍ يومياً كمتوسّطٍ سنوي")}
</div>

<div class="grid g3" style="margin-top:2rem">
 <div class="g"><div class="cap">ما يعنيه هذا للإنتاج</div>
  <ul class="tk">
   <li><b>القالَب</b> يبلغ <b class="n">{_peak["qalab"]/30.4:.0f}</b> كأساً في اليوم في تموز.
   ومصنعُ الثلج الواحد يعطي ٣٠ إلى ٤٢. أي أنّه يعمل عند طاقته الكاملة في الذروة بلا احتياط —
   ولهذا الوحدةُ الثانية مُدرَجةٌ في السنة الثانية لا الأولى.</li>
   <li><b>صَقيع ٨٠−</b> يبلغ <b class="n">{_peak["saqee80"]/30.4:.0f}</b> كأساً يومياً، وكلُّ كأسٍ يحتاج
   ١٢ ساعةَ مكوثٍ في المُجمِّد. أي أنّ سعةَ الغد تُحدَّد الليلة، والمُجمِّدتان ليستا ترفاً.</li>
   <li><b>لَفائِف</b> يبلغ <b class="n">{_peak["lafaif"]/30.4:.0f}</b> حصّةً يومياً على صحنَين
   بطاقة ١٥.٧ حصّة/ساعة لكلٍّ منهما — أي <b class="n">{_peak["lafaif"]/30.4/(2*15.7):.1f}</b> ساعةَ صحنٍ فعليّة.</li>
  </ul>
 </div>
 <div class="g"><div class="cap">ولماذا لا يُقرَأ الجدولُ كإيراد</div>
  <p><b>جَنى — قطعة</b> هو الأكثرُ عدداً بعد بَرَد، لكنّه ليس الأكثرَ إيراداً: القطعةُ الواحدة
  {usd(MENU["jana_piece"]["price_usd_baghdad"],2)} بينما <b>القالَب</b> {usd(MENU["qalab"]["price_usd_baghdad"],2)}.
  عددُ الوحدات هو خطّةُ المطبخ، وحصّةُ الإيراد هي خطّةُ الأعمال، ولا يجوز الخلطُ بينهما.</p>
  <p style="margin-top:.8rem">ولهذا كلُّ الأرقام في هذا القسم <b>وحدات</b>، وكلُّ الأرقام في القسم
  <span class="n">09</span> <b>دنانير</b>.</p>
 </div>
 <div class="g"><div class="cap">أرقامٌ تُشترى بها المواد</div>
  {tbl(["المُدخَل", ("الكمّيةُ السنوية",)], [
    ["بُنٌّ محمَّص", (f'{_ytot["saqee80"]*0.018:,.0f} كغم',)],
    ["قوالبُ ثلجٍ شفّاف", (f'{_ytot["qalab"]/100:,.0f} قالباً',)],
    ["قطعُ سوربيه مصبوبة", (f'{(_ytot["jana_piece"]+_ytot["jana_box"]*9):,.0f} قطعة',)],
    ["تابيوكا جافّة", (f'{_ytot["boba"]*0.06:,.0f} كغم',)],
    ["أكوابٌ وأغطيةٌ وملاعق", (f'{_gt:,.0f} طقم',)],
  ])}
  <p style="margin-top:1rem;font-size:var(--s--2);color:var(--ink-4);line-height:1.9">
  الاشتقاقات: ١٨ غم بُنٍّ للجرعة المزدوجة · ٩٠–١١٠ كأساً من القالب الواحد ·
  العلبةُ تسعُ تسعَ قطع · ٦٠ غم تابيوكا للكأس. هذه هي قائمةُ الشراء الأولى،
  وهي أيضاً ما يُتفاوَض عليه مع المورّدين قبل الافتتاح لا بعده.</p>
 </div>
</div>''', cls="d"))

# ── ١١ · الكلفة سطراً سطراً ────────────────────────────────────────────────
_EQ  = A["formats"]["cube_flagship"]["equipment"]
_SHORT = {"brand":"الهويّة والتصميم","ult":"مُجمِّدتا ٨٦−","skin_out":"القشرةُ الخارجية",
          "frame":"الهيكلُ والأساس","fitout_in":"التجهيزُ الداخلي","chiller":"تبريدُ الغرفة",
          "juice":"محطّةُ العصير","batch":"مُجمِّدةُ الدفعات","espresso":"الإسبريسو",
          "genset":"المولّدة","bar":"بارُ الثلج","light":"الإضاءةُ والحفر","kiosks":"شاشاتُ الطلب"}
_CAT = [("shell","الغلافُ والإنشاء"),("power","التبريدُ والطاقة"),
        ("prod","معدّاتُ الإنتاج"),("front","البارُ والإضاءة"),("sys","الأنظمةُ والهويّة")]
def _eqrows():
    out = []
    for cat, catlab in _CAT:
        lines = [e for e in _EQ if e["cat"] == cat]
        out.append(([f'<b>{catlab}</b>', ("",), ("",),
                     (f'<b>{usd(sum(l["total_usd"] for l in lines))}</b>',)], "sub"))
        for e in lines:
            q = f'{e["qty"]:,.0f}' if e["qty"] != 1 else "١"
            out.append([f'<span style="padding-inline-start:1rem">{e["ar"]}</span>',
                        (q,), (usd(e["unit_usd"]),), (usd(e["total_usd"]),)])
    out.append((["<b>مجموعُ الجدول</b>", ("",), ("",),
                 (f'<b>{usd(sum(e["total_usd"] for e in _EQ))}</b>',)], "tot"))
    return out

S.append(sec(11, "١١", "الكلفة سطراً سطراً", f'''
<p class="sub">كلُّ معدّةٍ وكلُّ متر. لا سطرَ واحدٌ اسمُه «متنوّعات».</p>

<div class="note hard" style="margin-top:1.6rem">
 <b>أُعيد بناءُ هذا الرقم من الصفر، وانخفض ٢٩٪.</b> النسخةُ الأولى قالت <span class="n">$538,944</span>،
 وهو رقمٌ لا يُصدَّق لكشكٍ مساحتُه ٢٥ متراً — نحو <span class="n">$21,500</span> للمتر المربّع.
 وكانت تحمل ثلاثةَ أخطاءٍ حقيقية:
 <b>أوّلاً</b> عُدّةُ الامتياز — وثيقةُ الإفصاح ودليلُ التشغيل ومنهجُ التدريب، بـ<span class="n">$45,000</span> —
 كانت مُحمَّلةً على الفرع، وهي كلفةُ الشركة المانحة تُكتَب مرّةً وتستعملها كلُّ الفروع بعده؛ نُقِلت إلى مكانها.
 <b>ثانياً</b> مصنعُ ثلجٍ بثلاث وحداتٍ بـ<span class="n">$34,000</span> حيث الطلبُ الناضج ٢٤ كأساً في اليوم
 ووحدةٌ واحدة تعطي ٣٠ إلى ٤٢. <b>ثالثاً</b> تقديرٌ إجماليٌّ للغلاف بدل حسابِ مساحةٍ فعليّة.
 الرقمُ اليوم <b class="n">{usd(FLAG["capex"]["total"])}</b>، والاستردادُ نزل من ٤٢.٥ شهراً إلى
 <b class="n">{FLAG["payback_months"]:.1f}</b> — أي <b>داخل</b> نطاق الأربعة والعشرين إلى ستّة وثلاثين شهراً
 الذي يكتتب عليه المستثمر الخليجي، بعد أن كان خارجه.
</div>

{_phrow([("line","خطُّ الإنتاج — أربعةُ أمتارٍ من الفولاذ، وكلُّ ما في الجدول واقفٌ عليها"),
         ("ice_room","مصنعُ الثلج الشفّاف — التجميدُ الاتّجاهي ثم المنشار")],
        "wide", "margin-top:2rem")}
<div style="margin-top:2rem">
 {tbl(["البند", ("العدد",), ("سعرُ الوحدة",), ("الإجمالي",)], _eqrows(),
      cap="جدولُ المعدّات والإنشاء — بغداد، أسعارٌ واصلةٌ ومركَّبة")}
</div>

<div class="grid g2" style="margin-top:2rem;align-items:start">
 <div class="g"><div class="cap">وما يُضاف فوق الجدول</div>
  {tbl(["البند", ("المبلغ",)], [
    ["احتياطيُّ قطع الغيار والخدمة — ١٠٪ من معدّات الإنتاج", (usd(_cx["spares_service_reserve"]),)],
    ["الخُلُوّ — ١٥ ضعفَ الإيجار", (usd(_cx["key_money"]),)],
    ["ما قبل الافتتاح — تدريبٌ وتجاربُ إنتاجٍ وإجازات", (usd(_cx["pre_opening"]),)],
    ["رأسُ المال العامل", (usd(_cx["working_capital"]),)],
    ["الطوارئ ١٢٪", (usd(_cx["contingency"]),)],
    (["<b>الإجمالي الكلّي</b>", (f'<b>{usd(FLAG["capex"]["total"])}</b>',)], "tot"),
  ])}
  <p style="margin-top:1rem;font-size:var(--s--2);color:var(--ink-4);line-height:1.9">
  <b>الخُلُوّ محظورٌ قانوناً</b> بقانون إيجار العقار ٨٧ لسنة ١٩٧٩، ومع ذلك هو عُرفٌ شاملٌ في بغداد.
  رُصِد عند ٢٥ ضعفَ الإيجار في الكرّادة؛ نحن نُدرِج ١٥ ضعفاً ونُبنِيه في العقد لا خارجه.</p>
 </div>
 <div class="g"><div class="cap">الخمسةُ الكبار — أين يذهب النصف</div>
  {hbars([(_SHORT.get(e["key"], e["ar"].split("—")[0].strip()), e["total_usd"], "")
          for e in sorted(_EQ, key=lambda x: -x["total_usd"])[:5]][::-1],
         w=400, fmt=lambda v: f"${v:,.0f}",
         lab="أكبر خمسة بنود في جدول الكلفة")}
  <p style="margin-top:1rem">خمسةُ بنودٍ من ثمانيةٍ وعشرين تحمل
  <b class="n">{sum(e["total_usd"] for e in sorted(_EQ,key=lambda x:-x["total_usd"])[:5])/sum(e["total_usd"] for e in _EQ):.0%}</b>
  من الجدول. وأيُّ تفاوضٍ جادّ يبدأ منها، لا من الأدوات الصغيرة.</p>
  <p style="margin-top:.8rem"><b>ودرجةُ التوثيق:</b> البنودُ المستوردة أسعارُها من نطاقاتٍ مرصودة،
  أمّا الإنشاءُ والتركيب فتقديراتٌ تحتاج عرضَين مقاولَين قبل الالتزام. هذا آخرُ رقمٍ يجب أن يتحرّك
  قبل التوقيع، وقد يتحرّك في الاتجاهين.</p>
 </div>
</div>''', cls="q"))

# ── ١٢ · بغداد ودبي ────────────────────────────────────────────────────────
_DXB = M["units"]["dubai_own"]; _DY2 = _DXB["years"][1]
_UAE = A["markets"]["uae"]
S.append(sec(12, "١٢", "بغداد ودبي", f'''
<p class="sub">السؤالُ الذي يطرحه كلُّ مستثمرٍ خليجي: ولمَ لا تبدأ عندنا؟ هذا هو الجواب، بالأرقام.</p>

<div class="grid g2" style="margin-top:2rem;align-items:start">
 <div class="g solid">
  <span class="chip k">لو فتحنا المُكعَّب نفسه في دبي</span>
  {tbl(["", ("بغداد",), ("دبي",)], [
    ["رأسُ المال", (usd(FLAG["capex"]["total"]),), (usd(_DXB["capex"]["total"]),)],
    ["إيرادُ السنة ٢", (usd(Y2["gross_revenue"]),), (usd(_DY2["gross_revenue"]),)],
    ["الأرباحُ التشغيلية", (usd(Y2["ebitda"]),), (usd(_DY2["ebitda"]),)],
    ["الهامش", (f'{Y2["ebitda_margin"]:.0%}',), (f'{_DY2["ebitda_margin"]:.0%}',)],
    ["متوسّطُ الفاتورة", (usd(_b["avg_ticket"],2),), (usd(_DXB["basket"]["avg_ticket"],2),)],
    ["الإيجارُ شهرياً", ("$2,200",), (f'${2200*_UAE["rent_index"]:,.0f}',)],
    ["ضريبةُ الشركات", ("15%",), ("9%",)],
    (["<b>الاسترداد</b>", (f'<b>{FLAG["payback_months"]:.1f} شهراً</b>',),
      (f'<b>{_DXB["payback_months"]:.1f} شهراً</b>',)], "tot"),
    (["<b>العائدُ الداخلي ٥ سنوات</b>", (f'<b>{FLAG["irr_5y"]:.0f}%</b>',),
      (f'<b>{_DXB["irr_5y"]:.0f}%</b>',)], "tot"),
  ])}
  <p style="margin-top:1.2rem"><b>ولا نُخفي النتيجة: دبي أفضل على الورق، وبفارقٍ كبير.</b>
  رأسُ مالٍ أعلى بـ<span class="n">{_DXB["capex"]["total"]/FLAG["capex"]["total"]-1:.0%}</span>،
  لكنّ إيراداً أعلى بـ<span class="n">{_DY2["gross_revenue"]/Y2["gross_revenue"]-1:.0%}</span>،
  فيسترجع رأسَ ماله في <b class="n">{_DXB["payback_months"]:.0f}</b> شهراً مقابل
  <b class="n">{FLAG["payback_months"]:.0f}</b>.</p>
 </div>
 <div>
  <div class="g"><div class="cap">وهذه أسبابُ البدء في بغداد رغم ذلك</div>
   <ol class="st">
    <li><b>كلفةُ الخطأ.</b> النموذجُ الأوّل سيُخطئ: في السعة، في المزيج، في الغلاف، في المولّدة.
    التعلُّمُ على {usd(FLAG["capex"]["total"])} أرخصُ من التعلُّم على {usd(_DXB["capex"]["total"])} —
    والفرقُ <b>{usd(_DXB["capex"]["total"]-FLAG["capex"]["total"])}</b> هو ثمنُ التعليم لا الربح.</li>
    <li><b>لا منافس.</b> العراقُ فيه ١.٨ فرعٍ مُعلَّم لكلّ مليون نسمة. ودبي فيها ٣,٢٥٧ مقهىً
    و<b>مشغّلان يقدّمان القهوةَ في مكعّب ثلج بالفعل</b> — ‏The Pods و‏La Letizia. بغداد صفحةٌ بيضاء، ودبي ليست.</li>
    <li><b>الإيجارُ هو المخاطرة الحقيقية في دبي.</b> النموذجُ يفترض
    ${2200*_UAE["rent_index"]:,.0f} شهرياً، وهو معقولٌ لموقعٍ في شارعٍ أو مركزٍ محلّي،
    و<b>منخفضٌ بوضوح</b> لموقعٍ في مركزٍ تجاريّ من الطراز الأول. مضاعفةُ الإيجار وحدها تُطيل الاسترداد
    نحو ستّة أشهر.</li>
    <li><b>حضورُ المؤسّس.</b> صيغةٌ من هذا النوع تُدار يومياً في سنتها الأولى، لا عن بُعد.</li>
    <li><b>القصّةُ نفسها أقوى.</b> ١٣٤ يوماً فوق الأربعين في بغداد مقابل ٦٨ في دبي.
    العلامةُ التي تُولد في أشدّ المدن حرارةً تسافر إلى الخليج بسهولة؛ والعكسُ ليس صحيحاً.</li>
   </ol>
  </div>
  <div class="note" style="margin-top:1.2rem">
   <b>والخلاصةُ عمليّة، لا عاطفية:</b> بغداد أولاً <b>لأنّها التمرين</b>، ودبي في السنة الثانية أو الثالثة
   <b>كوحدةٍ مملوكة للشركة لا كامتياز</b> — لأنّ اقتصادَها أقوى من أن يُمنَح لغيرنا في هذه المرحلة.
   هذا تعديلٌ على خطّة الطرح: خريطةُ التوسّع في القسم <span class="n">14</span> تفترض الخليجَ امتيازاً،
   ودبي وحدَها تستحقّ استثناءً.
  </div>
 </div>
</div>

<div class="grid g3" style="margin-top:2rem">
 {fig(f'{_DXB["payback_months"]:.0f}<span class="u">شهراً</span>', "استردادُ دبي", "مقابل ٢٤–٣٦ يكتتب عليها الخليج")}
 {fig("68 · 134", "أيامٌ فوق ٤٠° — دبي وبغداد", "لكنّ موسمَ دبي الحارّ أطول وأرطب")}
 {fig("66% · 50%", "قاعُ الشتاء من المتوسّط", "شتاءُ دبي لا يهبط كشتاء بغداد — وهذا يهمّ نموذجاً بارداً بالكامل")}
</div>''', cls="d"))

S.append(sec(13, "١٣", "الامتياز", f'''
<p class="sub">ما يدفعه صاحبُ الامتياز، وما يحصل عليه، وما يقوله النموذج إنّه سيربحه.</p>
<div class="grid g2" style="margin-top:2rem;align-items:start">
 <div>
  {tbl(["البند", ("شَبِم",), "المرجع في المنطقة"], [
    ["رسم الدخول — شَظِيّة العراق", (usd(_F["initial_fee_usd"]["baghdad_kiosk_fr"]),), "Grano ‏$10.6k · Café2go ‏$21.3k · Gossip ‏$88k"],
    ["رسم الدخول — مُكعَّب العراق", (usd(_F["initial_fee_usd"]["iraq"]),), "—"],
    ["رسم الدخول — السعودية", (usd(_F["initial_fee_usd"]["riyadh_kiosk"]),), "Mikel السعودية ‏٩٠–١٨٠ ألف ريال"],
    ["الإتاوة — <b>العراق</b>", ("<b>٥٪</b>",), "النطاق المرصود ٥–١٠٪"],
    ["الإتاوة — <b>الخليج</b>", ("<b>٦٪</b>",), "Café2go ٥ · Gossip ٦ · Grano ٧ · Mikel ١٠"],
    ["صندوق التسويق", ("١.٥٪ العراق · ٢٪ الخليج",), "١–٣٪، يُنفَق بالكامل ويُدقَّق"],
    ["المدّة", ("١٠ سنوات قابلة للتجديد",), "٥–١٠ سنوات معتاد"],
    ["التوريد المركزي", (f'~{_F["supply_share_of_rev"]*100:.0f}٪ من إيراد الفرع',), "البنّ، أساس السوربيه، القوالب، العبوات، وقوالبُ الثلج"],
  ], cap="الإتاوةُ تُحدَّد سوقاً بسوق لا عالمياً: عند ٨٪ يمتدّ استردادُ صاحب الامتياز العراقي إلى ما بعد أربع سنوات فيسقط العرض؛ وفرعُ دبي يحقّق هامشاً يحتمل النسبةَ القياسية بلا عناء.")}
  <div class="note" style="margin-top:1.4rem">
   <b>ومن أين يأتي المال فعلاً.</b> لا من الرسم، ولا من الإتاوة وحدها. التوريدُ المركزي يمرّ عبره
   {_F["supply_share_of_rev"]*100:.0f}٪ من إيراد الفرع بهامش {_F["supply_margin_pct"]*100:.0f}٪ —
   {usd(FR["years"][4]["supply_margin"])} في السنة الخامسة وحدها. ولا يستطيع صاحبُ الامتياز شراءَه من مكانٍ آخر:
   برنامجُ البنّ، وأساسُ السوربيه ونظامُ ألوانه، والقوالب، والعبوات — و<b>قوالبُ الثلج المنحوتة نفسها</b>، التي
   تأتي من مُكعَّب المدينة. ولهذا لا يحتوي أيُّ فرعٍ ممنوح على مصنع ثلج.
  </div>
 </div>
 <div class="g">
  <div class="cap">ما يراه صاحبُ الامتياز في العراق — السنة الثانية</div>
  {tbl(["", ("الشَّظِيّة",), ("المُكعَّب",)], [
    ["الاستثمار شاملاً الخلوّ ورأس المال العامل", (usd(U["baghdad_kiosk_fr"]["capex"]["total"]),), (usd(U["baghdad_fr"]["capex"]["total"]),)],
    ["الإيراد", (usd(U["baghdad_kiosk_fr"]["years"][1]["gross_revenue"]),), (usd(U["baghdad_fr"]["years"][1]["gross_revenue"]),)],
    ["الإتاوة والتسويق لشَبِم", (f'({usd(U["baghdad_kiosk_fr"]["years"][1]["royalty"])})',), (f'({usd(U["baghdad_fr"]["years"][1]["royalty"])})',)],
    ["<b>الأرباح التشغيلية</b>", (f'<b>{usd(U["baghdad_kiosk_fr"]["years"][1]["ebitda"])}</b>',), (f'<b>{usd(U["baghdad_fr"]["years"][1]["ebitda"])}</b>',)],
    ["الهامش", (f'{U["baghdad_kiosk_fr"]["years"][1]["ebitda_margin"]*100:.0f}%',), (f'{U["baghdad_fr"]["years"][1]["ebitda_margin"]*100:.0f}%',)],
    ["الاسترداد", (f'{U["baghdad_kiosk_fr"]["payback_months"]:.0f} شهراً',), (f'{U["baghdad_fr"]["payback_months"]:.0f} شهراً',)],
    ["<b>العائد الداخلي ٥ سنوات</b>", (f'<b>{U["baghdad_kiosk_fr"]["irr_5y"]:.0f}%</b>',), (f'<b>{U["baghdad_fr"]["irr_5y"]:.0f}%</b>',)],
  ], cap="الرقمان بعد خصم الإتاوة والتسويق — وهو ما تُخفيه أغلبُ عروض الامتياز حين تعرض قائمةَ دخل المانح بدل قائمة دخل الممنوح.")}
  <p style="margin-top:1rem;font-size:var(--s--1);color:var(--ink-2);line-height:1.9">
  <b>ولهذا تقود الشَّظِيّة التوسّع.</b> تكلّف
  {usd(U["baghdad_fr"]["capex"]["total"] - U["baghdad_kiosk_fr"]["capex"]["total"])} أقلّ، وتستردّ أسرع.
  المُكعَّب هو الواجهةُ والمستودعُ ومصدرُ الثلج — مملوكٌ للشركة غالباً أو يُباع لمُطوِّري مناطق. الكشكُ هو منتجُ الحجم.</p>
 </div>
</div>

<h3 style="font-size:var(--s-2);font-weight:300;margin:3rem 0 1rem">الشركة المانحة</h3>
<figure>{growth(lab="مبيعات الشبكة من ١٨٧ ألف دولار في السنة الأولى إلى ٢٥.٤ مليون في الخامسة")}</figure>
{tbl(["", ("س١",), ("س٢",), ("س٣",), ("س٤",), ("س٥",)],
  [[lab] + [(fn(y),) for y in FR["years"]] for lab, fn in [
    ("<b>الفروع العاملة</b>", lambda y: f'<b>{y["units_total"]}</b>'),
    ("مبيعات الشبكة", lambda y: usd(y["system_sales"])),
    ("إيراد متكرّر — إتاوة وتوريد", lambda y: usd(y["recurring_revenue"])),
    ("إيراد لمرّة واحدة — رسوم دخول ومناطق", lambda y: usd(y["fee_revenue"])),
    ("إيراد الفروع المملوكة", lambda y: usd(y["own_store_revenue"])),
    ("<b>إجمالي إيراد الشركة</b>", lambda y: f'<b>{usd(y["total_revenue"])}</b>'),
    ("المركز الرئيسي", lambda y: f'({usd(y["hq_cost"])})'),
  ]]
  + [(["<b>الأرباح التشغيلية للشركة</b>"] + [(f'<b>{usd(y["ebitda"])}</b>',) for y in FR["years"]], "tot")]
  + [(["<b>الأرباح من المتكرّر وحده</b>"] + [(f'<b>{usd(y["recurring_ebitda"])}</b>',) for y in FR["years"]], "sub")],
  cap="الإتاوةُ مُبيَّنة صافيةً بعد الضريبة المقتطعة عند المصدر — ١٥٪ من السعودية والعراق و٢٠٪ من مصر وصفر من الإمارات. إهمالُها يضخّم إيراد السنة الخامسة بنحو ١٣١ ألف دولار.")}
<div class="note hard" style="margin-top:1.4rem">
 <b>اقرأ السطر الأخير بصراحة.</b> الإيرادُ المتكرّر — الإتاوة والتوريد — لا يغطّي المركزَ الرئيسي إلا في السنة
 الخامسة، وبفارقٍ قدره {usd(FR["years"][4]["recurring_ebitda"])} فقط. ونحو ثلث أرباح السنة الخامسة يأتي من فرعَين
 مملوكَين لا من الامتياز. بهذه الافتراضات تصل شَبِم إلى السنة الخامسة شركةَ امتيازٍ <b>واعدة</b>، لا شركةَ امتيازٍ
 قائمةً بنفسها بعد. سدُّ هذه الفجوة يحتاج فروعاً أكثر، أو مبيعاتِ فرعٍ أعلى، أو مركزاً أخفّ — والخطّةُ تُحاكَم
 على أيٍّ من الثلاثة يستطيع الفريق تحقيقه.
</div>'''))

# ── ١١ · الطريق والمخاطر ───────────────────────────────────────────────────
RISKS = [
 ("حرج", "كأسُ الثمانين تحت الصفر قد يؤذي زبوناً",
  "تلامسُ الجلد مع الفولاذ عند هذه الحرارة يعطي حرارةَ تماسٍ بين ٦٣ و٦٨ تحت الصفر — حرقٌ باردٌ خلال ثوانٍ. والزجاجُ "
  "العادي يفشل: يتحمّل صدمةً حراريةً قدرها ٦٢ درجة والصبُّ يطبّق ٨٤.",
  "كأسٌ من البوروسيليكات حصراً — يتحمّل ٢٦٥ درجة. كُمٌّ من النيوبرين بسماكة ٥ ملم يرفع حرارةَ التماس إلى ٢١ فوق الصفر. "
  "مِلقطٌ فولاذي لا يدٌ عارية. تبريدٌ على مرحلتين، عشرون ثم ثمانون. وزمنُ انتظارٍ قبل التسليم مكتوبٌ في الدليل "
  "وفي شهادة التدريب، وتأمينُ مسؤوليةٍ بحجمه قبل فتح الباب."),
 ("حرج", "انقطاعُ الكهرباء يُتلف حمولةَ المُجمِّدات",
  "شبكةُ بغداد تعطي ٨ إلى ١٢ ساعة يومياً؛ ذروةُ الطلب في ٢٠٢٥ كانت ٥٥ غيغاواط مقابل ٢٧ متاحة. ومُجمِّدٌ عند ثمانين "
  "تحت الصفر يذوب يخسر محتواه كلَّه.",
  "مولّدةٌ مخصّصة ٦٠ ك.ف.أ بتحويلٍ آلي — لا اشتراكَ مولّدةِ حيّ. هذا سببُ أنّ بند الطاقة في النموذج يتجاوز ٤٠ ألف "
  "دولار سنوياً بدل ٥ آلاف. مع مراقبةِ حرارةٍ بإنذارٍ على الهاتف، وكتلةٍ حرارية تكفي لاجتياز ساعتَين."),
 ("عالٍ", "للاسم مُشابهٌ طبّي",
  "«الشَّبَم» هو المصطلح العربي الحديث لتضيّق القُلفة، ومقالةُ ويكيبيديا العربية على السلسلة «شبم» بالضبط هي صفحةُ "
  "المسالك البولية. سيجدها زبونٌ أو صحفيٌّ أو منافس.",
  "يُشكَل الشعارُ دائماً <b>شَبِم</b> بالكسرة؛ المصطلحُ الطبّي بالفتحة. ويُقفَل التعريفُ مع الاسم فلا يسافر وحده. "
  "ونملك كلَّ استعلامٍ مُركَّب خلال اثني عشر شهراً. وجوابٌ واثق مُعدٌّ للفريق بدل جوابٍ مرتبك."),
 ("عالٍ", "الخُلُوّ مخالفٌ للقانون وشائعٌ في الوقت نفسه",
  "قانون إيجار العقار رقم ٨٧ لسنة ١٩٧٩ يحظر الخُلُوّ صراحةً. ويُطلَب مع ذلك في كلّ موقعٍ جيّد في بغداد، ورُصِد عند "
  "٢٥ ضعف الإيجار الشهري في الكرّادة.",
  "يُهيكَل مع محامٍ بوصفه بدلَ تجهيزاتٍ موثَّقاً لا نقداً بلا مستند، ويُفضَّل مالكٌ يقبل عقداً أطول بإيجارٍ أعلى. "
  "مُدرَجٌ في النموذج عند ١٥ ضعفاً."),
 ("عالٍ", "الشتاء بلا مشروبٍ حار",
  "بعد إلغاء القائمة الساخنة يهبط كانون الأول وكانون الثاني إلى ٤٧٪ من متوسط السنة، وربحُ كانون الأول التشغيلي "
  f"{usd(_m2[11]['ebitda'])} فقط.",
  "تقليصُ المِلاك ٣٠٪ في الشهرَين، وساعاتٌ قصيرة، والطاقمُ الباقي على تدريبٍ وتطويرِ وصفات. ورمضان يتقدّم أحد عشر "
  "يوماً كلَّ سنة فيدخل قاعَنا خلال مدّة الخطّة. وعلبةُ <b>جَنى</b> منتجُ هديّةٍ يعمل في الشتاء ولا يحتاج طقساً حارّاً."),
 ("متوسط", "الدهشةُ تخفت",
  "نافذةُ الانتباه للصيغ القائمة على المشهد ١٢ إلى ٢٤ شهراً. و٢٦–٢٧٪ من المطاعم تُغلق في سنتها الأولى و٥٩–٦٠٪ خلال ثلاث.",
  "القائمةُ ذاتُ الطرفَين هي الجواب البنيوي، ودورانُ الفاكهة الموسمي يعطي سببَ عودةٍ مبنيّاً في التوريد. "
  "والسيناريو المتشائم يفترض الخفوتَ فعلاً ويُبقي الفرعَ موجبَ النقد كلَّ شهر."),
 ("متوسط", "العملة والتسعير",
  "الدينار عند ١,٣١٠ رسمياً ونحو ١,٥٣٠ في السوق الموازية — فارقٌ ١٦ إلى ١٧٪. المعدّاتُ والبنّ بالدولار والقائمةُ بالدينار.",
  "النموذجُ يستعمل السعرَ الموازي في كلّ سطر، لا الرسمي. والأسعارُ تُراجَع مرّتين في السنة. وسيناريو الصرف يفترض "
  "تحرّكاً إضافياً ١٤٪ بلا رفعِ أسعار."),
 ("متوسط", "التصنيف الضريبي",
  "لا ضريبة قيمةٍ مضافة عامّة في العراق، لكنّ ضريبةَ مبيعاتٍ ١٠٪ تُفرض على المطاعم والفنادق الفاخرة، ومقهىً يبيع "
  "مشروباً بعشرة دولارات قد يُصنَّف فاخراً.",
  "مفترَضةٌ في السيناريو الأساسي لا معالَجةٌ كمكسبٍ محتمل. وعشرةٌ إضافية فوقها مُحاكاةٌ منفصلة."),
]
S.append(sec(14, "١٤", "الطريق والمخاطر", f'''
<div class="grid g2" style="align-items:start">
 <div>
  <div class="cap">خمس سنوات</div>
  <ol class="st" style="margin-top:1rem">
   <li><b>السنة ١ — بغداد: إثباتُ الجسم.</b> مُكعَّبٌ واحد على زاويةٍ في المنصور أو الكرّادة أو زيّونة.
   السنةُ كلّها لضبط بروتوكول الثمانين ومردودِ قوالب الثلج ودورةِ قوالب السوربيه إلى مستوىً يمكن كتابتُه في دليل.
   وتسجيلُ العلامة في العراق في خمس فئات. وتأسيسُ الشركة يبدأ فوراً: التسجيل ٦ إلى ١٠ أسابيع والتدقيقُ الأمني هو
   القيدُ على موعد الافتتاح.</li>
   <li><b>السنة ٢ — إثباتُ التكرار، ورخيصاً.</b> أول كشكَين ممنوحَين في مولات بغداد، يُزوَّدان بقوالب الثلج من
   المُكعَّب. اختبارُ نموذج المستودع لا توسيعُ الشبكة. والهدفُ اثنا عشر شهراً من تشغيلٍ مُدقَّق متعدّد الفروع —
   وهو بالضبط ما يشترطه نظامُ الامتياز السعودي: سنةٌ واحدة وفرعٌ واحد على الأقلّ قبل منح أيّ امتيازٍ في المملكة.</li>
   <li><b>السنة ٣ — عبورُ الخليج.</b> الرياض ودبي. البوّابةُ هي وثيقةُ الإفصاح بالعربية تُسلَّم قبل التوقيع بأربعة
   عشر يوماً — إعدادُها ١٥ إلى ٤٠ ألف دولار و٨ إلى ١٦ أسبوعاً — وكلُّ عقدٍ يُسجَّل لدى وزارة التجارة خلال تسعين يوماً،
   والغراماتُ تصل إلى ٥٠٠ ألف ريال.</li>
   <li><b>السنة ٤ — كثافةٌ قبل جغرافيا.</b> عمقٌ في المدن المُثبَتة بدل أعلامٍ جديدة. الدوحة تُضاف.
   والتوريدُ المركزي يصير عملاً حقيقياً.</li>
   <li><b>السنة ٥ — {FR["years"][4]["units_total"]} فرعاً و{kk(FR["years"][4]["system_sales"])} مبيعاتِ شبكة.</b>
   مصر والشام يُعاد تقييمهما على تصنيعٍ محلّي للمعدّات وخطِّ <b>جَنى</b> للتجزئة — أو يُؤجَّلان مرّةً أخرى.</li>
  </ol>
 </div>
 <div>
  <div class="cap">ثمانيةُ أشياء قد تسوء</div>
  <div class="grid" style="gap:0;margin-top:1rem">
   {"".join(f"""<div style="border-top:1px solid var(--hair-2);padding:1.1rem 0">
     <div style="display:flex;gap:.7rem;align-items:baseline;margin-bottom:.4rem">
       <span class="chip">{sv_}</span><h4 style="font-size:var(--s-0);font-weight:600;margin:0">{t}</h4></div>
     <p style="color:var(--ink-4);font-size:var(--s--1);line-height:1.85;margin-bottom:.5rem">{w}</p>
     <p style="color:var(--ink-2);font-size:var(--s--1);line-height:1.85"><b style="color:var(--ink)">المعالجة.</b> {m}</p>
   </div>""" for sv_, t, w, m in RISKS)}
  </div>
 </div>
</div>''', cls="q"))

# ── ١٢ · الطلب ─────────────────────────────────────────────────────────────
S.append(sec(15, "١٥", "الطلب", f'''
<p class="sub">مساران منفصلان. الأول لا يحتاج الثاني.</p>
<div class="grid g2" style="margin-top:2rem;align-items:start">
 <div class="g">
  <span class="chip k">المسار أ · تمويل ذاتي</span>
  <h3 style="font-size:var(--s-2);font-weight:300;margin:.9rem 0 .4rem">بناء الفرع الأول في بغداد</h3>
  <div style="font-family:var(--la);font-weight:400;font-size:var(--s-3);letter-spacing:-.03em;direction:ltr;text-align:right">{usd(FLAG["capex"]["total"])}</div>
  <p style="margin-top:.8rem">رأسُ مال المؤسّس. مُكعَّبٌ واحد على زاوية في بغداد، يُبنى نموذجاً أوّلياً ودليلاً في آنٍ
  واحد. بلا حصصٍ خارجية وبلا التزامٍ بجدول أحد.</p>
  {tbl(["أوجه الصرف", ("المبلغ",)], [
    ["الغلافُ الجليدي والإنشاء والتجهيز الداخلي", (usd(_cx["shell"]),)],
    ["التبريدُ والطاقة والمولّدة", (usd(_cx["power"]),)],
    ["معدّاتُ الإنتاج وقطعُ الغيار",
     (usd(_cx["prod"] + _cx["spares_service_reserve"]),)],
    ["البارُ والإضاءة والحفرُ المُضاء", (usd(_cx["front"]),)],
    ["الأنظمةُ والهويّة", (usd(_cx["sys"]),)],
    ["الخُلُوّ وما قبل الافتتاح ورأسُ المال العامل",
     (usd(sum(_cx[x] for x in ("key_money","pre_opening","working_capital"))),)],
    ["الطوارئ ١٢٪", (usd(_cx["contingency"]),)],
    (["<b>الإجمالي</b>", (f'<b>{usd(FLAG["capex"]["total"])}</b>',)], "tot"),
  ])}
  <div class="grid g3" style="gap:.6rem;margin-top:1.2rem">
   {fig(f'{FLAG["payback_months"]:.0f}<span class="u">شهر</span>', "الاسترداد")}
   {fig(f'{FLAG["irr_5y"]:.0f}%', "العائد الداخلي")}
   {fig(kk(Y2["ebitda"]), "أرباح السنة ٢")}
  </div>
 </div>
 <div class="g solid">
  <span class="chip">المسار ب · رأس مال نموّ</span>
  <h3 style="font-size:var(--s-2);font-weight:300;margin:.9rem 0 .4rem">بناء شركة الامتياز</h3>
  <div style="font-family:var(--la);font-weight:400;font-size:var(--s-3);letter-spacing:-.03em;direction:ltr;text-align:right">{kk(A["raise"]["amount_usd"])}</div>
  <p style="margin-top:.8rem">يُجمَع بعد أن يكون للفرع الأول اثنا عشر شهراً من التشغيل خلفه — وهو أيضاً ما يشترطه
  نظامُ الامتياز السعودي وما يطلبه أيُّ شريكٍ خليجيٍّ جادّ. المالُ يبني الشركةَ التي تمنح الصيغة، لا مقاهيَ أكثر.</p>
  {tbl(["أوجه الصرف", ("المبلغ",), ("الحصّة",)], [
    ["المركز الرئيسي حتى التعادل: العلامة، التشغيل، التدريب، مطبخ التطوير", ("$620,000",), ("35%",)],
    ["مُكعَّبٌ واحد مملوك للشركة في السنة ٣ — واجهةُ الخليج", ("$449,000",), ("26%",)],
    ["مستودع الثلج والتوريد المركزي والمخزون الأول", ("$230,000",), ("13%",)],
    ["الملكية الفكرية ووثائق الإفصاح والتسجيل في خمس دول", ("$185,000",), ("11%",)],
    ["حملة الإطلاق في العراق والخليج", ("$150,000",), ("8%",)],
    ["طوارئ", ("$116,000",), ("7%",)],
    (["<b>الإجمالي</b>", ("<b>$1,750,000</b>",), ("<b>100%</b>",)], "tot"),
  ], cap="أقصى احتياجٍ نقديٍّ تراكمي ١.١١ مليون في السنة الثالثة؛ المبلغُ المطلوب يحمل هامشاً ٥٨٪ فوقه. وفرعٌ واحد مملوك فقط داخل هذا التمويل — الفرعُ الأول مموَّلٌ ذاتياً قبله.")}
  <div class="grid g3" style="gap:.6rem;margin-top:1.2rem">
   {fig(f'{FR["irr_pct"]:.0f}%', "العائد الداخلي")}
   {fig(f'{FR["moic"]:.1f}×', "مضاعف رأس المال")}
   {fig(kk(FR["exit_ev"]), "قيمة الخروج")}
  </div>
 </div>
</div>
<div class="note hard" style="margin-top:2rem">
 <b>الترتيبُ هو الفكرة.</b> كلُّ شركة امتيازٍ تفشل تفشل بالطريقة نفسها: تبيع مناطقَ قبل أن تُثبِت الصيغة، ثم تنفق
 رسومَ الدخول في إطفاء حرائق فروعٍ لا تستطيع دعمها. شَبِم لا تبيع شيئاً قبل أن يكون فرعٌ واحد قد اجتاز صيفاً بغدادياً
 كاملاً <b>وشتاءً بغدادياً كاملاً</b>، وقبل أن يُكتَب دليلُ التشغيل ممّا حدث فعلاً لا ممّا خُطِّط له.
</div>''', cls="d"))

# ── ١٣ · الملحق ────────────────────────────────────────────────────────────
ROWS = [
 ("سكّان العراق", "46,118,793", "مُوثَّق", "تعداد ٢٠٢٤، وزارة التخطيط — الأول منذ ٣٧ عاماً"),
 ("سكّان بغداد", "9,780,429", "مُوثَّق", "تعداد ٢٠٢٤ · ٢١.٢٪ من العراق"),
 ("الدينار مقابل الدولار — السوق الموازية", "1,530", "مُوثَّق", "آب ٢٠٢٦. السعر الرسمي ١,٣١٠؛ الفارق ١٦–١٧٪"),
 ("ضريبة الدخل على الشركات في العراق", "15%", "مُوثَّق", "PwC · ٣٥٪ للنفط والغاز فقط"),
 ("ضريبة الاستهلاك", "لا ض.ق.م · ١٠٪ على الفاخر", "مُوثَّق", "مفترَضةٌ على شَبِم في السيناريو الأساسي"),
 ("الحدّ الأدنى للأجور", "350,000 د.ع", "مُوثَّق", "المادة ٦٣، قانون العمل ٣٧ لسنة ٢٠١٥"),
 ("راتب الباريستا في بغداد", "$450 شهرياً", "مُوثَّق/تقدير", "شواغر مرصودة: ٤٥٠–٦٠٠ ألف دوام مسائي، ٧٥٠ ألف دوام كامل"),
 ("إيجار الفرع الأول", "$2,200 شهرياً", "مُوثَّق/تقدير", "مقارنات: المنصور ٣٥٠م² بـ١٠$/م²؛ زيّونة ٢٠٠م² بـ٢٧.٥$/م²"),
 ("الخُلُوّ", "١٥ ضعف الإيجار", "مُوثَّق/تقدير", "رُصِد عند ٢٥ ضعفاً في الكرّادة. محظورٌ بقانون ٨٧ لسنة ١٩٧٩"),
 ("ساعات الشبكة في بغداد", "٨–١٢ ساعة", "مُوثَّق", "ذروة ٢٠٢٥: ٥٥ غيغاواط طلباً مقابل ٢٧ متاحة"),
 ("تعرفة الكهرباء التجارية", "60 د.ع/ك.و.س", "مُوثَّق", "العراق الاتحادي · اشتراك المولّدة ١٢,٠٠٠ د.ع للأمبير شهرياً"),
 ("البنّ المحمَّص واصلاً بغداد", "$14–22/كغم", "مُوثَّق/تقدير", "≈ $0.25–0.40 للجرعة المزدوجة ١٨ غم"),
 ("مردود قالب الثلج", "٩٠–١١٠ كأساً", "مُوثَّق", "ولا يصل الزبونَ إلا ٣٠–٣٦٪ من كتلة القالب"),
 ("إنتاجية صحن اللفائف", "١٥.٧ حصّة/ساعة", "مُوثَّق", "المورّدون يعلنون ٢٥–٣٥. القياس الواقعي أقلّ بكثير"),
 ("حدّ حرارة مُجمِّد الثمانين", "٣٠–٣٢° محيط", "مُوثَّق", "ولهذا يقع في حيّزٍ مُكيَّف منفصل، لا خلف البار"),
 ("مناخ بغداد", "٤٥° متوسط تموز وآب", "مُوثَّق", "الموسم الحار ٢٦ أيار – ٢١ أيلول · الرقم القياسي ٥١.٨° في ٢٨ تموز ٢٠٢٠"),
 ("فروع المقاهي المُعلَّمة في العراق", "85", "مُوثَّق", "Project Café Middle East 2025 · الثالث عشر في المنطقة"),
 ("فروع المنطقة", "11,163 ← 16,460", "مُوثَّق", "نموّ ١١.٢٪ سنوياً · التوقّع لعام ٢٠٢٩"),
 ("مرجع الإتاوة", "٥–١٠٪", "مُوثَّق", "Café2go ٥ · Gossip ٦ · Grano ٧ · Mikel ١٠ · Dunkin' ٥.٩ · Cinnabon ٦"),
 ("الضريبة المقتطعة على الإتاوة", "السعودية ١٥٪ · مصر ٢٠٪ · قطر ٥٪ · الإمارات صفر", "مُوثَّق", "مخصومةٌ في النموذج لكل سوق"),
 ("نطاق الاسترداد المقبول خليجياً", "٢٤–٣٦ شهراً", "مُوثَّق", "مُكعَّبنا خارجه عند ٤٠–٤٢؛ دبي والدوحة داخله"),
 ("بوّابة نظام الامتياز السعودي", "سنة واحدة وفرع واحد", "مُوثَّق", "وثيقة إفصاحٍ بالعربية قبل التوقيع بـ١٤ يوماً؛ التسجيل خلال ٩٠ يوماً"),
 ("العمليات اليومية عند النضج", "300", "تقدير", "مرجعٌ مستقلّ ٣٠٠/يوم. وRegulars في ملبورن ٦٠٠ من صنفٍ واحد"),
 ("كفاءة المحطّة", "72%", "تقدير", "خسائرُ الاستلام وإعادة التعبئة والتنظيف والتسليم مقابل الطاقة النظرية"),
 ("الهدر", "6.5%", "تقدير", "فاكهة في محيطٍ عند ٤٥°، حليب، مرفوضُ قوالب السوربيه، وكسرُ قوالب الثلج"),
 ("تصاعد الكُلَف", "٤٪ سنوياً", "تقدير", "على الأجور والطاقة والمصاريف. قاعدةُ كلفةٍ ثابتة خمس سنوات ليست توقّعاً"),
 ("إغلاق الفروع الممنوحة", "٥٪ سنوياً من السنة ٣", "تقدير", "لا شبكةَ بلا إغلاقات؛ وخطّةٌ تفترض صفراً ليست خطّة"),
 ("مبيعات صقيع ٨٠− المرجعية", "٦٠٠ كأس/يوم من ١٦ مقعداً", "مُوثَّق", "Regulars ملبورن، كانون الأول ٢٠٢٥ · و٥٠٠–٨٠٠ في شنغهاي"),
 ("مرونةُ سعر صقيع ٨٠−", "¥٢٦ ← ¥٤٨", "مُوثَّق", "السلّم الصيني: شنغهاي، هاينان، تشنغدو، بكين — ضِعفٌ تقريباً على ١,٢٠٠ كم"),
 ("سقفُ إنتاج القالَب مرجعياً", "٥ أكواب/يوم بـ¥٣,٣٠٠", "مُوثَّق", "cafe 33 كيوتو · ٧٢ ساعة تجميدٍ للقالب — ولهذا مصنعُنا مركزيّ"),
 ("حجمُ فئة جَنى في التجزئة", "مليون قطعة في شهر", "مُوثَّق", "GS25 كوريا، آب ٢٠٢٥ · ١٠٠ مليون وون يومياً للصنف الواحد"),
 ("انكماشُ فئة اللفائف", "١٧+ ← ١٣ فرعاً", "مُوثَّق", "Sweet Charlie's ٢٠٢٢←٢٠٢٦ · و10Below أغلقت ثلاثة مواقع"),
 ("حضورُ بابل تي في بغداد", "صفر", "مُوثَّق/تقدير", "لا فرعَ لأيّ سلسلة عالمية · وMixue وحدها ٤٥ ألف فرعٍ عالمياً"),
]
OPEN = [
 "بحثُ إتاحةٍ للعلامة التجارية لدى الهيئة السعودية للملكية الفكرية ووزارة الصناعة والمعادن العراقية.",
 "عروضُ أسعارٍ من مورّدين للفئات التسع المستوردة. مصنعُ الثلج ومُجمِّدات الثمانين ونظامُ القوالب فئاتٌ لا سعرَ معلَناً لها.",
 "ثلاثُ محادثاتٍ حقيقية مع ملّاك عقاراتٍ على زوايا مُسمّاة في بغداد، لتحويل الإيجار من تقديرٍ إلى رقم.",
 "قرارٌ ضريبي: هل تدخل شَبِم في تصنيف «المطاعم الفاخرة» لضريبة العشرة بالمئة؟ فارقُ عشر نقاطٍ على كلّ فرعٍ عراقي.",
 "تثبيتُ صياغة ثلاثة أبياتٍ مقابل الطبعات المحقّقة قبل طباعتها على أيّ صنفٍ أساسي.",
 "هل العراق طرفٌ في بروتوكول مدريد؟ يحدّد إن كان إيداعٌ دوليٌّ واحد يكفي أم سبعةُ إيداعاتٍ وطنية.",
 "هل أساسُ السوربيه غيرُ قابلٍ للاستبدال فعلاً؟ نصفُ حصّة الشركة المانحة تقريباً يقوم على أنّ صاحب الامتياز لا يستطيع شراءَ بديلٍ محلّي.",
 "عرضا مقاولٍ حقيقيّان لوحدةٍ في الرياض ودبي. الكلفةُ المُنمذَجة نحو ٦,١٠٠ دولار للمتر — معقولةٌ لهذه الصيغة لكنّها غيرُ مُتحقَّق منها.",
 "تسعيرُ خطّ <b>بَرَد</b> على ثلاث درجات بدل سعرٍ واحد. السعرُ الموحَّد عند ٥,٠٠٠ دينار يُخفي فارقَ أربعين نقطةً في الهامش بين السلاش والرمّان — وهو أكبرُ خللٍ تسعيريٍّ متبقٍّ في القائمة.",
 "التحقّقُ من ثلاثة أرقامٍ في ملفّ <b>لُؤلُؤ</b> قبل عرضها على مستثمر: دخولُ «تابيرو» قائمةَ كلمات ٢٠١٩ اليابانية، وعددُ فروع Mixue عند الإدراج، ونسبةُ فروع The Alley المزوَّرة. مصدرُها معرفةُ النموذج لا بحثٌ حيّ.",
 "مسحٌ ميدانيٌّ لبغداد يؤكّد أنّ «<span class=\'en\'>ايس رول</span>» تعني على قوائم المطاعم العراقية صنفاً آخرَ تماماً — ولهذا نسمّيه <b>لَفائِف</b>، لا «ايس رول».",
]
S.append(sec(16, "١٦", "الملحق", f'''
<p class="sub">كلُّ رقمٍ في هذا العرض يعود إلى سطرٍ في هذا الجدول أو إلى ملفّ النموذج خلفه.</p>
{tbl(["الافتراض", ("القيمة",), "الدرجة", "المصدر أو الاشتقاق"],
  [[a, (b,), f'<span class="chip k">{g}</span>', s] for a, b, g, s in ROWS])}
<h3 style="font-size:var(--s-2);font-weight:300;margin:3rem 0 1rem">وما لا نعرفه بعد</h3>
<p class="lede">خطّةٌ لا تُعلن ثغراتِها ليست خطّة. هذه البنود بترتيب إغلاقها.</p>
<ol class="st" style="margin-top:1.2rem">{"".join(f"<li>{o}</li>" for o in OPEN)}</ol>'''))


# ═══════════════════════════════════════════════════════════════════════════
#  التجميع
# ═══════════════════════════════════════════════════════════════════════════

NAV = [("s1","الاسم"),("s2","الفكرة"),("s3","الانتشار"),("s4","المنتجات"),("s5","المُكعَّب"),
       ("s7","العلامة"),("s8","السوق"),("s9","الأرقام"),("s10","المبيعات"),("s11","الكلفة"),
       ("s12","دبي"),("s13","الامتياز"),("s15","الطلب")]
RANGE = {"s1":["s1"],"s2":["s2"],"s3":["s3"],"s4":["s4"],"s5":["s5","s6"],"s7":["s7"],
         "s8":["s8"],"s9":["s9"],"s10":["s10"],"s11":["s11"],"s12":["s12"],
         "s13":["s13","s14"],"s15":["s15","s16"]}

SCRIPT = '''
(function(){
 var prog=document.querySelector('.prog'),
     secs=[].slice.call(document.querySelectorAll('section.s')),
     links=[].slice.call(document.querySelectorAll('.topbar nav a'));
 function onS(){
  var h=document.documentElement;
  prog.style.setProperty('--p',(h.scrollTop/(h.scrollHeight-h.clientHeight||1)*100).toFixed(2)+'%');
  var best=null;
  secs.forEach(function(s){ if(s.getBoundingClientRect().top<=150) best=s.id; });
  links.forEach(function(a){
   var r=(a.dataset.r||'').split(',');
   a.setAttribute('aria-current', r.indexOf(best)>-1?'true':'false');
  });
 }
 document.addEventListener('scroll',onS,{passive:true}); onS();

 /* الندى: بوكيه خارج البؤرة، يُرسَم مرّةً واحدة ثم ينجرف — لا ضبابية لكل إطار */
 var c=document.getElementById('dew'); if(!c) return;
 var ctx=c.getContext('2d'), off=document.createElement('canvas'), octx=off.getContext('2d'),
     W=0,H=0,OH=0,y0=0,raf=null,
     reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function isDark(){
  var g=getComputedStyle(document.documentElement).getPropertyValue('--ground').trim();
  return /^#0|^#1/.test(g);
 }
 function bake(){
  var r=c.getBoundingClientRect(), d=Math.min(devicePixelRatio||1,1.3);
  W=c.width=Math.max(1,r.width*d); H=c.height=Math.max(1,r.height*d);
  OH=H*2; off.width=W; off.height=OH;
  octx.setTransform(1,0,0,1,0,0); octx.clearRect(0,0,W,OH);
  var dark=isDark(), n=Math.round(Math.min(34,Math.max(14,(r.width*r.height)/42000)))*2;
  for(var i=0;i<n;i++){
   var big=i%5===0,
       R=(big?70+Math.random()*130:20+Math.random()*52)*d,
       x=Math.random()*W, y=Math.random()*OH,
       a=big?0.20+Math.random()*0.14:0.12+Math.random()*0.14;
   octx.filter='blur('+(R*0.40).toFixed(1)+'px)';
   var g=octx.createRadialGradient(x,y,R*0.12,x,y,R);
   if(dark){
    g.addColorStop(0,'rgba(255,255,255,'+a.toFixed(3)+')');
    g.addColorStop(0.6,'rgba(255,255,255,'+(a*0.32).toFixed(3)+')');
    g.addColorStop(1,'rgba(255,255,255,0)');
   } else {
    g.addColorStop(0,'rgba(255,255,255,'+(a*1.6).toFixed(3)+')');
    g.addColorStop(0.52,'rgba(116,126,134,'+(a*0.34).toFixed(3)+')');
    g.addColorStop(1,'rgba(116,126,134,0)');
   }
   octx.beginPath(); octx.arc(x,y,R,0,6.2832); octx.fillStyle=g; octx.fill();
  }
  octx.filter='none';
 }
 function paint(){
  ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,W,H);
  var y=y0%H;
  ctx.drawImage(off,0,-y,W,OH);
  if(OH-y<H) ctx.drawImage(off,0,OH-y,W,OH);
 }
 function loop(){ y0+=0.09; paint(); raf=requestAnimationFrame(loop); }
 bake(); paint();
 addEventListener('resize',function(){ bake(); paint(); },{passive:true});
 if(!reduce) loop();
 var mq=window.matchMedia('(prefers-color-scheme: dark)');
 if(mq.addEventListener) mq.addEventListener('change',function(){ bake(); paint(); });
})();
'''


def render():
    nav = "".join(f'<a href="#{i}" data-r="{",".join(RANGE[i])}">{t}</a>' for i, t in NAV)
    css = open(os.path.join(HERE, "glass.css"), encoding="utf-8").read()
    return f'''<title>شَبِم · SHBM</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="شَبِم — علامةُ مشروباتٍ باردةٍ وحلوياتٍ مجمَّدة، مصمَّمةٌ لِـ ٤٥ درجة. من بغداد إلى الخليج.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700&family=Space+Grotesk:wght@300;400;500&family=Amiri:wght@400;700&family=IBM+Plex+Mono:wght@400&display=swap">
<style>{css}</style>
<canvas id="dew" aria-hidden="true"></canvas>
<div class="prog" aria-hidden="true"></div>
<div class="topbar">
 <span class="mk">شَبِم</span>
 <nav aria-label="الأقسام">{nav}</nav>
 <span class="sp"></span>
 <span class="chip k en">SHBM</span>
</div>
<header class="hero">
 <div class="in">
  <p class="wm">شَبِم</p>
  <p class="wm-la en">SHBM</p>
  <p class="ln1">بَرْدُ الماء</p>
  <p class="ln2">الكلمةُ العربية لبرد الماء وحده — وعلامةُ مشروباتٍ باردة مصمَّمةٌ لأشدّ مدن الأرض حرارة.</p>
  <div class="meta">
   <span class="chip">بغداد ← العراق ← الخليج</span>
   <span class="chip k">عرضٌ للمستثمرين · {A["_meta"]["as_of"]}</span>
   <span class="chip k">الفرع الأول {kk(FLAG["capex"]["total"])} · استرداد {FLAG["payback_months"]:.0f} شهراً</span>
   <span class="chip k">شركة الامتياز {kk(A["raise"]["amount_usd"])} · عائد {FR["irr_pct"]:.0f}%</span>
  </div>
 </div>
</header>
<main>{"".join(S)}</main>
<footer class="end">
 <div class="in">
  <p class="wm" style="font-size:var(--s-4)">شَبِم</p>
  <p class="sub" style="margin-top:.8rem">العلامةُ وعدٌ عن شيءٍ مادّي. وعدُنا هو البرد — البردُ المحدَّد الكلاسيكيّ
  الذي للماء وحده، الذي في العربية كلمةٌ له، ولم يستعمله أحدٌ تجارياً بعد.</p>
  <hr class="hr">
  <p class="fn">
   أُعِدَّ في {A["_meta"]["as_of"]}. كلُّ رقمٍ مالي هنا مُخرَجٌ من نموذجٍ كاملِ المعامِلات، وافتراضاتُه ودرجةُ
   توثيقها في القسم <span class="n">13</span>. التحويلاتُ بسعر السوق الموازية للدينار
   {A["fx"]["iqd_per_usd_parallel"]:,} للدولار لا بالسعر الرسمي {A["fx"]["iqd_per_usd_official"]:,} —
   لأنّ السعرَ الموازي هو الذي ينطبق على المعدّات المستوردة والكُلَف الدولارية، واستعمالُ الرسمي يضخّم الإيراد
   الدولاري بنحو ١٧٪.
   <br><br>
   يحتوي هذا المستند على تقديراتٍ مستقبليّةٍ تعتمد على افتراضاتٍ لم يُتحقَّق منها جميعاً. كُلَفُ المعدّات تحتاج
   عروضَ أسعار. والإيجارُ والخُلُوّ يحتاجان تفاوضاً. ولم تُجرَ بعدُ بحوثُ إتاحة العلامة التجارية. هو خطّةٌ
   معروضةٌ بثغراتها مُعلَّمة، وليس عرضاً لبيع أوراقٍ مالية.
  </p>
 </div>
</footer>
<script>{SCRIPT}</script>'''


if __name__ == "__main__":
    html = render()
    out = os.path.join(HERE, "deck.html")
    open(out, "w", encoding="utf-8").write(html)
    print(f"wrote {out} ({len(html):,} bytes, {len(S)} sections)")
