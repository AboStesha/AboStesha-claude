# -*- coding: utf-8 -*-
"""Turn the council's plan JSON into numbers.json (the single source for slide figures and charts).

usage: python3 from_plan.py plan.json
"""
import json, pathlib, sys

HERE = pathlib.Path(__file__).parent
sys.path.insert(0, str(HERE))
from lists_draft import GAMES, LOOP, WEEK, SWAPS, MISTAKES, MARKETING  # noqa: E402

P = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding='utf-8'))
FX = 1300

AR = '٠١٢٣٤٥٦٧٨٩'
def ar(s):
    return ''.join(AR[int(c)] if c.isdigit() else ('٬' if c == ',' else ('٫' if c == '.' else c)) for c in str(s))
def money(usd):
    if usd >= 1e6:
        return ar(f'{usd / 1e6:.2f}'.rstrip('0').rstrip('.')) + ' مليون $'
    return ar(f'{round(usd / 1000):,}') + ' ألف $'

# ---------- zones ----------
ZMAP = {  # council id -> (svg id, short name, colour, slide)
    'Z1': ('entry', 'المدخل والساحة الشمسية', '#C2B59A', None),
    'Z2': ('arena', 'ميدان الخيل العربية', '#D9A845', 's-arena'),
    'Z3': ('hill', 'التلّة: فورتكس والمسرح والقمّة', '#63B383', 's-hill'),
    'Z4': ('bc', 'قرية «قبل الميلاد»', '#D9774A', 's-bc'),
    'Z5': ('luca', 'لوكا لاند', '#5675DB', 's-luca'),
    'Z6': ('food', 'ساحة أوروك للمطاعم', '#4BB8AE', 's-food'),
    'Z7': ('eco', 'بيت البيئة', '#A5D66B', 's-eco'),
    'Z8': ('green', 'الممر الأخضر وغابة الأعضاء', '#3F8F5F', 's-eco'),
}
PHASE = {'P1a': 'الافتتاح الأول', 'P1b': 'افتتاح التلّة', 'P2': 'المرحلة الثانية', 'P1': 'المرحلة الأولى'}
zones = []
for i, z in enumerate(P['zones']):
    sid, nm, col, slide = ZMAP.get(z['id'], (z['id'].lower(), z['name_ar'], '#C2B59A', None))
    desc = '، '.join(z['contents_ar'][:3]) + '.'
    zones.append(dict(id=sid, n=i + 1, name=nm, area=z['area_m2'], color=col, phase=PHASE.get(z['phase'], z['phase']),
                      desc=desc, capex=z['capex_usd'], rev=z['annual_revenue_usd'], slide=slide))
assert sum(z['area'] for z in zones) == 12500, sum(z['area'] for z in zones)
Z = {z['id']: z for z in zones}

# ---------- budget ----------
CAT = [  # keyword -> (category, colour)
    ('تصميم', 'build'), ('تكييف', 'build'),
    ('بيئ', 'env'), ('شمس', 'env'), ('تشجير', 'env'), ('خضر', 'env'),
    ('لوكا', 'exp'), ('قبل الميلاد', 'exp'), ('خيل', 'exp'), ('فروس', 'exp'), ('مطاعم', 'exp'), ('مسرح', 'exp'), ('صوت', 'exp'),
    ('تسويق', 'ops'), ('رواتب', 'ops'), ('أمن', 'ops'), ('تطبيق', 'ops'),
    ('طوارئ', 'res'),
]
CATCOL = {'build': ['#C2B59A', '#A89A7E', '#8E826A', '#D8CBB0', '#B5A78B'],
          'exp': ['#5675DB', '#7D93E6', '#D9774A', '#D9A845', '#4BB8AE', '#9AA9EE', '#E59A72'],
          'env': ['#63B383', '#3F8F5F', '#A5D66B', '#7FD19E'],
          'ops': ['#F2CD7C', '#E8B85A', '#C9A04A'],
          'res': ['#5b5446']}
used = {k: 0 for k in CATCOL}
budget = []
for b in P['budget']:
    cat = 'build'
    for kw, c in CAT:
        if kw in b['item_ar']:
            cat = c; break
    col = CATCOL[cat][used[cat] % len(CATCOL[cat])]; used[cat] += 1
    budget.append(dict(k=b['item_ar'], usd=b['usd'], color=col, cat=cat, note=b.get('note_ar', '')))
assert sum(b['usd'] for b in budget) == 2_000_000, sum(b['usd'] for b in budget)
cat_tot = {c: sum(b['usd'] for b in budget if b['cat'] == c) for c in CATCOL}

# ---------- revenue ----------
SC = ['conservative', 'base', 'optimistic']
SCOL = ['#D9A845', '#5675DB', '#D9774A', '#7D93E6', '#9AA9EE', '#4BB8AE', '#F2CD7C', '#E59A72', '#C2B59A', '#63B383']
streams = [dict(k=s['name_ar'], v=[s[c] for c in SC], color=SCOL[i % len(SCOL)], driver=s['driver_ar']) for i, s in enumerate(P['revenue']['streams'])]
opex = [dict(k=s['name_ar'], v=[s[c] for c in SC]) for s in P['revenue']['opex']]
rev_t = [sum(s['v'][i] for s in streams) for i in range(3)]
opx_t = [sum(s['v'][i] for s in opex) for i in range(3)]
ebitda = [rev_t[i] - opx_t[i] for i in range(3)]

def payback_years(i, ramp=(0.6, 0.9, 1.0), share_from=4, share=0.05, opex_y1=0.9):
    """Years after opening until cumulative EBITDA (after state share) covers 2M."""
    cum, y = 0.0, 0
    while y < 30:
        y += 1
        r = rev_t[i] * (ramp[y - 1] if y <= len(ramp) else 1.0)
        o = opx_t[i] * (opex_y1 if y == 1 else 1.0)
        e = r - o - (r * share if y >= share_from else 0)
        if e <= 0 and y > 3:
            return None
        prev = cum; cum += e
        if cum >= 2_000_000:
            return round(y - 1 + (2_000_000 - prev) / e, 1)
    return None
pay_real = [payback_years(i) for i in range(3)]

revenue = dict(capex=2_000_000, streams=streams, opex=opex, shareNote=False,
               totals=dict(rev=rev_t, opex=opx_t, ebitda=ebitda, payback_ramped=pay_real),
               note=('الاسترداد هنا بسيط على سنة مستقرة. مع منحنى التصاعد (٦٠٪ ثم ٩٠٪ من الإيراد) وحصة دولة ٥٪ من السنة الرابعة: '
                     + ' / '.join(f'{nm} {ar(p) if p else "لا يسترد"}' for nm, p in zip(['محافظ', 'أساسي', 'متفائل'], pay_real))
                     + ' سنة من الافتتاح.'))

# ---------- calculator calibrated to the base case ----------
base = {s['k']: s['v'][1] for s in streams}
def pick(*kws):
    return sum(v for k, v in base.items() if any(w in k for w in kws))
members_usd = pick('عضوي')
events_usd = pick('فعاليات', 'فورتكس')
visitor_usd = pick('تذاكر', 'لوكا', 'فود ستيشن', 'ورش')
other_usd = rev_t[1] - members_usd - events_usd - visitor_usd
accounts = 330
fee = round(members_usd * FX / 12 / accounts / 5000) * 5000
visitors_day = 200
spend = round(visitor_usd * FX / 360 / visitors_day / 1000) * 1000
events_m = 14
event_net = round(events_usd / 12 / events_m / 50) * 50
opex_var = 0.16
opex_fixed = round((opx_t[1] - opex_var * rev_t[1]) / 10000) * 10000
calc = dict(fx=FX, ticket=0, eventNet=event_net, fixedOther=round(other_usd / 1000) * 1000, opexFixed=opex_fixed, opexVar=opex_var, capex=2_000_000,
            defaults=dict(c_members=accounts, c_fee=fee, c_visitors=visitors_day, c_spend=spend, c_events=events_m))

# ---------- tiers ----------
TCOL = ['var(--palm)', 'var(--sand)', 'var(--gold-2)', 'var(--clay)', 'var(--lapis)']
tiers = []
for i, m in enumerate(P['memberships']):
    name, _, who = m['tier_ar'].partition(':')
    name = name.strip().strip('«»') if name else m['tier_ar']
    per = 'شهرياً'
    tiers.append(dict(name=name, who=who.strip() or m['tier_ar'], iqd=m['price_iqd_month'], usd=round(m['price_iqd_month'] / FX),
                      per=per, perks=m['perks_ar'][:4], target=m['target_count'], unit='حساب', color=TCOL[i % len(TCOL)],
                      feat='الخيار الأذكى للعائلة' if 'عائل' in m['tier_ar'] and 'مؤسس' not in m['tier_ar'] else ''))

# ---------- timeline ----------
PCOL = {'P0': 'var(--sand-2)', 'P1a': 'var(--gold)', 'P1b': 'var(--palm)', 'P2': 'var(--lapis)'}
gantt = [dict(t=t['task_ar'], s=t['start_month'], e=t['end_month'], c=PCOL.get(t['phase'], 'var(--gold)'), p=t['phase']) for t in P['timeline']]
months = max(24, max(g['e'] for g in gantt))
open_month = next((t['end_month'] for t in P['timeline'] if 'الافتتاح' in t['task_ar'] and t['phase'] == 'P1a'), 11)

# ---------- ranking ----------
ranking = [dict(id=r['id'], name=r['name_ar'], revenue=r['revenue'], street=r['street'], eco=r['eco_culture'], feas=r['feasibility'],
                viral=r['virality'], total=r['total'], tier=r['tier'], note=r['note_ar']) for r in P['idea_ranking']]

N = dict(
    plan_source=sys.argv[1], fx=FX,
    brand=dict(ar='جنائن', en="JANA'IN · BAGHDAD", en_short="JANA'IN",
               tagline='ظلٌّ في قلب بغداد: هواءٌ نقيّ، ونخلةٌ باسم كل عائلة، وحضارة الرافدين تُعاش من جديد.',
               council_tagline=P['brand']['tagline_ar']),
    open_month=open_month, ideas_count=len(ranking),
    zones=zones,
    vortex=dict(area=900, seated=600, standing=900,
                capex=sum(b['usd'] for b in budget if 'فورتكس' in b['k'] and 'مسرح' not in b['k']),
                rev=next((s['v'][1] for s in streams if 'فورتكس' in s['k'] or 'فعاليات' in s['k']), 0)),
    theater=dict(seats=500, capex=sum(b['usd'] for b in budget if 'مسرح' in b['k']), rev_label='ضمن إيراد الفعاليات'),
    arena=dict(dims='٢٥×٥٠ م', area=Z['arena']['area'], capex=Z['arena']['capex'], rev=Z['arena']['rev'],
               lead=('ملعب البولو القياسي يحتاج نحو ٤٠ ألف م²، أي أكثر من ثلاثة أضعاف الأرض كلها. لذلك نحتفظ بروح الفكرة: '
                     'ميدان للخيل العربية الأصيلة بحلبة ٢٥×٥٠ م يشغّله نادٍ شريك، ومدرّج المسرح يطلّ عليه.'),
               cards=[('مدرسة ركوب يومية', 'دروس للأطفال والكبار، وركوب المهور، وإيواء خيول الأعضاء، صباحاً ومساءً بعيداً عن حرّ الظهيرة.'),
                      ('ليالي الخيل العربية', 'عروض للخيل الأصيلة ومسابقات قفز صغيرة، ويوم بولو سنوي يُقام مع النادي الشريك في ملعب قياسي.'),
                      ('رفق وتدوير', 'إسطبلات مهوّاة بالبادگير ومظللة بالأثل، والروث يذهب إلى الكمبوست ليغذّي غابة الأعضاء.')]),
    bc=dict(area=Z['bc']['area'], capex=Z['bc']['capex'], rev=Z['bc']['rev']),
    food=dict(area=Z['food']['area'], capex=Z['food']['capex'], rev=Z['food']['rev'], model='مشغّلون شركاء: إيجار + ١٢–١٥٪'),
    luca=dict(area=Z['luca']['area'], capex=Z['luca']['capex'], rev=Z['luca']['rev']),
    next=dict(lead=('ما لا تحتاجه المرحلة الأولى لا يُبنى بأموالها. هذه الأفكار تنتظر أرباح السنة الأولى، '
                    'أو شريكاً يموّلها مقابل حصة من الإيراد، أو راعياً يضع اسمه عليها.'),
              cards=[('ليلة بابل ومسرح بابل الحجري', 'عرض ضوئي على واجهة التلّة، ومهرجان أكيتو كل نيسان، ومدرجات حجرية تحمل اسم الراعي.'),
                     ('مهرجان بغداد للمناطيد', 'مهرجان سنوي مع مشغّل مرخّص، والشركات ترعى مناطيد بشعاراتها على حسابها.'),
                     ('الجيم الذكي', 'كل جهاز لعبة على شاشة تصحّح طريقة التمرين، بامتياز من شريك رياضي.'),
                     ('الأركيد والمحاكيات والمتاهة الليلية', 'أجهزة بتقاسم الإيراد مع مشغّلين، ومتاهة تضيء ليلاً، وتوسعة الطاقة الشمسية.')]),
    eco=dict(lead=('الترفيه يموّل نواة بيئية ببند محمي في العقد: بيت البيئة، وغابة الأعضاء، والطاقة الشمسية، والتدوير. '
                   'كل رقم يُقاس، ويدقّقه طرف مستقل، ويُعلن على لوحة عند المدخل.'),
             kpis=[('٢٠٬٠٠٠', 'طالب من المدارس الحكومية مجاناً كل سنة', 'var(--palm)'),
                   ('٣٠٪', 'من الموقع مظلل أو مزروع، و٨٠٪ من الممرات', 'var(--palm)'),
                   ('٢٠٪ ← ٥٠٪', 'من الكهرباء من الشمس، بعدّاد علني', 'var(--gold-2)'),
                   ('صفر', 'ماء إسالة للري: مياه رمادية فقط', 'var(--water)')],
             programs=[('بيت البيئة', 'منبر دائم للوزارة: أكاديمية سفراء المناخ، ومشتل الأعضاء، ومختبر التدوير، و١٢ يوماً مجانية في القاعة.'),
                       ('ملاذ بغداد المناخي', 'القاعة تُفتح نهاراً ومجاناً لكبار السن والأطفال في أيام الخمسين درجة والعواصف.'),
                       ('محطة هواء بغداد', 'رصد علني للغبار والجسيمات الدقيقة، وتنبيهات للأعضاء والمدارس.'),
                       ('تقرير سنوي مدقَّق', 'طرف ثالث مستقل وشهادة بناء أخضر، و٢٪ من الإيراد للصندوق الأخضر.')]),
    budget=budget, budget_cats=cat_tot,
    leverage=[dict(k='رأس مال المستثمر (المرحلة الأولى)', usd=2_000_000, color='var(--gold)')] +
             [dict(k=o['source_ar'], usd=o['usd'], color=c, ink=ink) for o, (c, ink) in zip(
                 [o for o in P['off_budget_funding'] if 'سيولة' not in o['source_ar'] and 'البيع المسبق' not in o['source_ar']],
                 [('var(--water)', None), ('var(--palm)', None), ('var(--lapis)', '#fff'), ('var(--clay)', None), ('var(--sand-2)', None), ('#8E826A', '#fff'), ('#5b5446', '#fff')])],
    presale=[o for o in P['off_budget_funding'] if 'سيولة' in o['source_ar'] or 'البيع المسبق' in o['source_ar']],
    off_budget=P['off_budget_funding'],
    revenue=revenue, calc=calc, tiers=tiers,
    gantt=gantt, ganttMonths=months, ganttMarks=[dict(m=open_month, t='الافتتاح الأول')],
    ranking=ranking,
    games=GAMES, loop=LOOP, week=WEEK,
    swaps=[dict(**{('from' if k == 'from_' else k): v for k, v in s.items()}) for s in SWAPS],
    mistakes=MISTAKES, marketing=MARKETING,
    kpis=[dict(k='البيئة', color='var(--palm)', items=[dict(k='الكهرباء من الشمس', v='٢٠٪ ← ٥٠٪'), dict(k='ماء الإسالة للري', v='صفر'),
                 dict(k='بقاء الأشجار بعد ٢٤ شهراً', v='≥ ٨٥٪'), dict(k='طلاب المدارس الحكومية مجاناً', v='٢٠٬٠٠٠'),
                 dict(k='نفايات تُحوَّل عن الطمر', v='≥ ٦٠٪'), dict(k='الصندوق الأخضر', v='٢٪')]),
          dict(k='الثقافة', color='var(--clay)', items=[dict(k='فعاليات ثقافية شهرياً', v='≥ ١٢'), dict(k='مدفوعات مباشرة للفنانين (السنة ٢)', v='≥ ١٠٠ ألف $'),
                 dict(k='فنانون وحرفيون من المحافظات', v='٥٠'), dict(k='متدرّبون في الورش سنوياً', v='٥٬٠٠٠'),
                 dict(k='مواهب شابة على المسرح سنوياً', v='١٠٠'), dict(k='ليالي القاعة والمسرح للثقافة', v='٢٠٪')]),
          dict(k='الأعمال', color='var(--gold)', items=[dict(k='عضويات مدفوعة قبل صبّ الخرسانة', v='٢٥٠'), dict(k='حسابات دافعة نهاية السنة ٢', v='≈ ٣٣٠'),
                 dict(k='أيام فعاليات في القاعة سنوياً', v='١٧٠'), dict(k='هامش الربح التشغيلي (أساسي)', v='≈ ٣١٪'),
                 dict(k='تمويل الشركاء خارج الموازنة', v='≥ ٥٠٠ ألف $'), dict(k='تقييم Google', v='≥ ٤٫٥')])],
    ask=[dict(k='من معالي الوزيرة', items=['عقد استثمار مؤسسي لـ٣٠ سنة عبر هيئة استثمار بغداد', 'إعفاء من حصة الدولة أول ٣ سنوات، ثم ٥٪ أو مقابل عيني',
                                         'مسار تراخيص سريع خلال ٩٠ يوماً', 'أرض حكومية مجاورة للمواقف', 'إطلاق العضوية التأسيسية في يوم البيئة العالمي']),
         dict(k='من المستثمر', items=['٢ مليون $ على ثلاث شرائح مرتبطة بالإنجاز', 'قيادة التشغيل ورئاسة مجلس الإدارة',
                                      'جلب ٥٠٠ ألف $ على الأقل من الشركاء خارج الموازنة', 'تمويل دراسة الموقع والتصميم الأولي']),
         dict(k='الخطوات القادمة', items=['خلال ٣٠ يوماً: مذكرة تفاهم ثلاثية والتحقق من السند', 'خلال ٦٠ يوماً: تسوّق خفي، واستبيان ٢٠٠ شاب، وفحص الاسم',
                                          'خلال ٩٠ يوماً: رخصة الاستثمار، وتقييم الأثر، وعروض الأسعار', 'الشهر الرابع: «ليالي جنائن» وبدء البيع التأسيسي'])],
    kpis_raw=P['kpis'], ask_raw=P['the_ask'], assumptions=P['revenue']['assumptions_ar'],
    ramp=P['revenue']['year1_ramp_pct'],
)
(HERE / 'numbers.json').write_text(json.dumps(N, ensure_ascii=False, indent=1), encoding='utf-8')
print('zones', [(z['id'], z['area']) for z in zones])
print('budget cats', cat_tot)
print('rev', rev_t, 'opex', opx_t, 'ebitda', ebitda, 'payback ramped', pay_real)
print('calc', calc)
print('open month', open_month, 'months', months)
