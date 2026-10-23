# -*- coding: utf-8 -*-
"""Turn the council's final plan JSON into numbers.json (the single source for slide figures and charts).

usage: python3 from_plan.py final_plan.json
"""
import json, pathlib, sys

HERE = pathlib.Path(__file__).parent
sys.path.insert(0, str(HERE))
from lists_draft import GAMES, LOOP, WEEK, SWAPS, MISTAKES, MARKETING, GANTT, GANTT_MARKS  # noqa: E402

P = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding='utf-8'))
FX = 1450  # IQD per USD, the council's planning rate (official 1,320, parallel ~1,540)

# ---------- zones ----------
ZMAP = {  # council id -> (svg id, display name, colour, slide)
    'Z1': ('entry', 'بوابة الشمس والمواقف', '#C2B59A', None),
    'Z2': ('arena', 'حلقة الخيل', '#D9A845', 's-arena'),
    'Z3': ('hill', 'التلّة: فورتكس ومسرح بابل والقمّة', '#63B383', 's-hill'),
    'Z4': ('bc', 'قرية «قبل الميلاد»', '#D9774A', 's-bc'),
    'Z5': ('luca', 'لوكا لاند', '#5675DB', 's-luca'),
    'Z6': ('food', 'ساحة أوروك والأطفال', '#4BB8AE', 's-food'),
    'Z7': ('eco', 'بيت البيئة', '#A5D66B', 's-eco'),
    'Z8': ('green', 'الممر الأخضر وبستان المؤسسين', '#3F8F5F', 's-eco'),
    'Z9': ('service', 'ساحة الخدمات', '#8C826D', None),
}
PHASE = {'P1a': 'الافتتاح الربيعي', 'P1b': 'افتتاح القاعة', 'P2': 'المرحلة الثانية', 'P1': 'المرحلة الأولى'}
def fixnames(s):
    return s.replace('دربونة جنائن', 'لوكا لاند').replace('قاعة التلّة', 'قاعة فورتكس')
zones = []
for i, z in enumerate(P['zones']):
    sid, nm, col, slide = ZMAP[z['id']]
    desc = fixnames('، '.join(z['contents_ar'][:3]) + '.')
    zones.append(dict(id=sid, n=i + 1, name=nm, area=z['area_m2'], color=col, phase=PHASE.get(z['phase'], z['phase']),
                      desc=desc, capex=z['capex_usd'], rev=z['annual_revenue_usd'], slide=slide))
assert sum(z['area'] for z in zones) == 12500, sum(z['area'] for z in zones)
Z = {z['id']: z for z in zones}

# ---------- budget ----------
CAT = [('تصميم', 'build'), ('تكييف', 'build'), ('مولد', 'build'), ('بنية', 'build'), ('مبنى الخدمات', 'build'), ('قاعة التلّة', 'build'),
       ('بيئ', 'env'), ('شمس', 'env'), ('تشجير', 'env'),
       ('دربونة', 'exp'), ('قبل الميلاد', 'exp'), ('خيل', 'exp'), ('مقهى', 'exp'), ('مسرح', 'exp'), ('صوت', 'exp'), ('أطفال', 'exp'),
       ('تسويق', 'ops'), ('رواتب', 'ops'), ('أمن', 'ops'), ('موقف', 'ops'), ('طوارئ', 'res')]
CATCOL = {'build': ['#C2B59A', '#A89A7E', '#8E826A', '#D8CBB0', '#B5A78B', '#9C9077'],
          'exp': ['#5675DB', '#7D93E6', '#D9774A', '#D9A845', '#4BB8AE', '#9AA9EE', '#E59A72', '#6FC9C0'],
          'env': ['#63B383', '#3F8F5F', '#A5D66B', '#7FD19E'],
          'ops': ['#F2CD7C', '#E8B85A', '#C9A04A', '#B88F3C'],
          'res': ['#5b5446']}
CATNAME = {'build': 'المباني والأنظمة', 'exp': 'التجارب', 'env': 'البيئة', 'ops': 'التشغيل والإطلاق', 'res': 'الطوارئ'}
used = {k: 0 for k in CATCOL}
budget = []
for b in P['budget']:
    cat = next((c for kw, c in CAT if kw in b['item_ar']), 'build')
    col = CATCOL[cat][used[cat] % len(CATCOL[cat])]; used[cat] += 1
    k = b['item_ar']
    for zz in ['(Z%d)' % i for i in range(1, 10)]:
        k = k.replace(zz, '')
    budget.append(dict(k=fixnames(k.strip()), usd=b['usd'], color=col, cat=cat, note=fixnames(b.get('note_ar', ''))))
assert sum(b['usd'] for b in budget) == 2_000_000, sum(b['usd'] for b in budget)
cat_tot = {c: sum(b['usd'] for b in budget if b['cat'] == c) for c in CATCOL}

def line(*kws):
    return sum(b['usd'] for b in budget if any(w in b['k'] for w in kws))

# ---------- revenue ----------
SC = ['conservative', 'base', 'optimistic']
SCOL = ['#D9A845', '#C2B59A', '#5675DB', '#7D93E6', '#E59A72', '#9AA9EE', '#D9774A', '#4BB8AE', '#F2CD7C', '#B5A78B', '#63B383', '#A5D66B']
def clean(s):
    for zz in ['(الموقع كله)', '(صافي، Z4)'] + ['(Z%d)' % i for i in range(1, 10)]:
        s = s.replace(zz, '')
    return fixnames(s).strip()
streams = [dict(k=clean(s['name_ar']), v=[s[c] for c in SC], color=SCOL[i % len(SCOL)], driver=s['driver_ar']) for i, s in enumerate(P['revenue']['streams'])]
opex = [dict(k=s['name_ar'], v=[s[c] for c in SC]) for s in P['revenue']['opex']]
rev_t = [sum(s['v'][i] for s in streams) for i in range(3)]
opx_t = [sum(s['v'][i] for s in opex) for i in range(3)]
ebitda = [rev_t[i] - opx_t[i] for i in range(3)]

revenue = dict(capex=2_000_000, streams=streams, opex=opex, shareNote=False,
               totals=dict(rev=rev_t, opex=opx_t, ebitda=ebitda),
               note=('سنة مستقرة، بسعر ١٤٥٠ ديناراً للدولار، قبل حصة الدولة. الاسترداد البسيط = ٢ مليون ÷ الربح التشغيلي. '
                     'معدل العائد الداخلي قبل التمويل بالدين بحسب المجلس: المتحفظ خاسر، والأساسي نحو ٤٪ على ١٥ سنة ونحو ٨٪ على ٣٠ سنة، والمتفائل نحو ٢٢٪. '
         'وبعد التدرّج وحصة الدولة (ربح تشغيلي نحو ٢٩٣ ألفاً عند ٣٪) واحتياطي الإحلال يُسترد رأس المال في الأساسي نحو السنة ١٢.'))

# ---------- calculator calibrated to the base case ----------
base = {s['k']: s['v'][1] for s in streams}
def pick(*kws):
    return sum(v for k, v in base.items() if any(w in k for w in kws))
members_usd = pick('عضوي')
events_usd = pick('فعاليات')
visitor_usd = pick('تذاكر', 'لوكا', 'فود ستيشن', 'الأطفال', 'الورش')
other_usd = rev_t[1] - members_usd - events_usd - visitor_usd
accounts = 300
fee = round(members_usd * FX / 12 / accounts / 5000) * 5000
visitors_day = 180
spend = round(visitor_usd * FX / 360 / visitors_day / 500) * 500
events_m = 13
event_net = round(events_usd / 12 / events_m / 50) * 50
opex_var = 0.12
opex_fixed = opx_t[1] - opex_var * rev_t[1]
calc = dict(fx=FX, ticket=0, eventNet=event_net, fixedOther=round(rev_t[1] - (accounts * fee * 12 / FX + visitors_day * 360 * spend / FX + events_m * 12 * event_net)), opexFixed=opex_fixed, opexVar=opex_var, capex=2_000_000,
            defaults=dict(c_members=accounts, c_fee=fee, c_visitors=visitors_day, c_spend=spend, c_events=events_m))
chk_rev = accounts * fee * 12 / FX + visitors_day * 360 * spend / FX + events_m * 12 * event_net + calc['fixedOther']
chk_ebitda = chk_rev - (opex_fixed + opex_var * chk_rev)

# ---------- tiers ----------
TCOL = ['var(--palm)', 'var(--sand)', 'var(--gold-2)', 'var(--clay)', 'var(--lapis)']
tiers = []
for i, m in enumerate(P['memberships']):
    name, _, who = m['tier_ar'].partition(':')
    name = name.strip().strip('«»')
    tiers.append(dict(name=name, who=who.strip(), iqd=m['price_iqd_month'], usd=round(m['price_iqd_month'] / FX),
                      per='شهرياً', perks=[fixnames(x).replace('موقف مضمون', 'أولوية في الموقف') for x in m['perks_ar'][:4]], target=m['target_count'], unit=('حسابات' if 3 <= m['target_count'] % 100 <= 10 else 'حساباً' if m['target_count'] % 100 > 10 else 'حساب'), color=TCOL[i % len(TCOL)],
                      feat='الخيار الأذكى للعائلة' if name == 'بستان' else ''))

# ---------- ranking ----------
import re
RENAME = {'الأرض حمم: أرضية تفاعلية': 'الأرض تحترق: أرضية تفاعلية', 'كشك الصراخ': 'صرخة للمناخ', 'لعبة الحبار العراقية': 'ألعاب الدربونة', 'أركادستان': 'أركيدستان', 'رياضة الجاغر': 'نزال كلكامش (اليوغر)', 'معرض «صُنع باليد» والمزادات': 'معرض «صُنع في اليد» والمزادات', 'مدينة الفقاعات': 'فقاعات بغداد', 'التلة العالية: الانحناء مع الطبيعة': 'قمّة التلّة: الانحناء مع الطبيعة'}
IDNAME = {r['id']: RENAME.get(r['name_ar'], r['name_ar']) for r in P['idea_ranking']}
def rnote(s):
    s = s.replace('تُدمج مع U27 في «قاعة التلّة»', 'تُدمج في «قاعة فورتكس»')
    s = re.sub(r'(?<![A-Za-z])[UCM]\d+', lambda m: '«' + IDNAME.get(m.group(0), m.group(0)) + '»', s)
    return fixnames(s).replace('نجمة الدربونة', 'نجمة لوكا لاند')
ranking = [dict(id=r['id'], name=RENAME.get(r['name_ar'], r['name_ar']), revenue=r['revenue'], street=r['street'], eco=r['eco_culture'], feas=r['feasibility'],
                viral=r['virality'], total=r['total'], tier=r['tier'], note=rnote(r['note_ar'])) for r in P['idea_ranking']]

off = P['off_budget_funding']
partners = [o for o in off if not any(w in o['source_ar'] for w in ('سيولة', 'البيع المسبق', 'تسهيل', 'طابوقة'))]
LCOL = [('var(--water)', None), ('var(--palm)', None), ('var(--lapis)', '#fff'), ('var(--clay)', None), ('var(--sand-2)', None), ('#8E826A', '#fff')]

N = dict(
    plan_source=sys.argv[1], fx=FX,
    brand=dict(ar='جنائن', en="JANA'IN · BAGHDAD", en_short="JANA'IN BAGHDAD",
               tagline='ظلٌّ في قلب بغداد: هواءٌ نقيّ، ونخلةٌ باسم كل عائلة، وحضارة الرافدين تُعاش من جديد.',
               council_tagline=P['brand']['tagline_ar']),
    open_month=15, hall_month=20, ideas_count=len(ranking),
    zones=zones,
    vortex=dict(area=850, seated=430, wedding=350, capex=line('قاعة فورتكس', 'تكييف القاعة', 'صوت'), rev=next(s['v'][1] for s in streams if 'فعاليات' in s['k'])),
    theater=dict(seats=250, seats_p2=500, capex=line('مسرح')),
    arena=dict(dims='٢٠×٣٠ م', area=Z['arena']['area'], capex=Z['arena']['capex'], rev=Z['arena']['rev']),
    bc=dict(area=Z['bc']['area'], capex=Z['bc']['capex'], rev=Z['bc']['rev']),
    food=dict(area=Z['food']['area'], capex=Z['food']['capex'], rev=Z['food']['rev']),
    luca=dict(area=Z['luca']['area'], capex=Z['luca']['capex'], rev=Z['luca']['rev']),
    budget=budget, budget_cats=cat_tot, budget_catnames=CATNAME,
    leverage=[dict(k='رأس مال المستثمر (المرحلة الأولى)', usd=2_000_000, color='var(--gold)')] +
             [dict(k=o['source_ar'], usd=o['usd'], color=c, ink=ink) for o, (c, ink) in zip(partners, LCOL)],
    partners=partners, off_budget=off,
    revenue=revenue, calc=calc, calc_check=dict(rev=round(chk_rev), ebitda=round(chk_ebitda)), tiers=tiers,
    gantt=GANTT, ganttMonths=36, ganttMarks=GANTT_MARKS,
    ranking=ranking,
    games=GAMES, loop=LOOP, week=WEEK,
    swaps=[dict(**{('from' if k == 'from_' else k): v for k, v in s.items()}) for s in SWAPS],
    mistakes=MISTAKES, marketing=MARKETING,
    kpis=[dict(k='البيئة', color='var(--palm)', items=[dict(k='الكهرباء من الشمس بالعداد (ثم ٣٥–٥٠٪ بعقد شراء طاقة)', v='١٢–١٥٪'), dict(k='الري بمياه معاد استخدامها (وضوء ورمادي وتكثيف)', v='٤٠٪ فأكثر'),
                 dict(k='بقاء أشجار المؤسسين (١٥٠) بعد ٢٤ شهراً', v='٨٥٪ فأكثر'), dict(k='طلاب المدارس الحكومية مجاناً (السنة ٢)', v='٨٬٠٠٠'),
                 dict(k='نفايات تُحوَّل عن الطمر', v='٦٠٪ فأكثر'), dict(k='غبار القاعة مقارنة بالخارج', v='أقل بـ٧٠٪')]),
          dict(k='الثقافة', color='var(--clay)', items=[dict(k='فعاليات ثقافية شهرياً', v='١٢ فأكثر'), dict(k='مدفوعات مباشرة للفنانين سنوياً', v='٧٥ ألف $ فأكثر'),
                 dict(k='فنانون وحرفيون من المحافظات', v='٥٠'), dict(k='متدرّبون في الورش سنوياً', v='٥٬٠٠٠'),
                 dict(k='مواهب شابة على المسرح سنوياً', v='١٠٠'), dict(k='ليالي القاعة والمسرح للثقافة', v='٢٠٪')]),
          dict(k='الأعمال والمجتمع', color='var(--gold)', items=[dict(k='عضويات في حساب الضمان قبل الخرسانة', v='٢٥٠'), dict(k='حسابات دافعة نهاية السنة ٢', v='نحو ٣٠٠'),
                 dict(k='أيام فعاليات في القاعة سنوياً', v='نحو ١٥٥'), dict(k='هامش الربح التشغيلي (سنة الاستقرار)', v='نحو ٢٢٪'),
                 dict(k='رعاية موقّعة قبل الافتتاح', v='٧٥ ألف $'), dict(k='نساء في موظفي الواجهة', v='٣٠٪ فأكثر')])],
    ask=[dict(k='من معالي الوزيرة', items=['عقد استثمار مؤسسي لـ٣٠ سنة عبر هيئة استثمار بغداد، بترسية شفافة', 'حصة للدولة قابلة للتفاوض: إيجار رمزي و٣٪ من صافي إيراد النادي ثم ٥٪، أو بديل عيني',
                                         '١٢ يوماً مجانياً للوزارتين بدل الحجز المضمون', 'تراخيص منسّقة خلال ٦–٩ أشهر، وأرض حكومية لموقف ٢٠٠ سيارة',
                                         'مذكرة مع وزارة التربية، ومستشار تاريخي من وزارة الثقافة']),
         dict(k='من المستثمر', items=['٢ مليون $ على ٣ شرائح مرتبطة بشروط إنجاز', 'تسهيل احتياطي ١٥٠ ألف $ لتغطية أي تجاوز في الكلفة',
                                      'قيادة التشغيل ورئاسة مجلس الإدارة، وتوظيف بإعلانات منشورة', 'وله في المقابل: تعويض عند الإنهاء المبكر، وأصول قابلة للنقل']),
         dict(k='الخطوات القادمة', items=['٣٠ يوماً: مذكرة تفاهم ثلاثية، والتحقق من السند، والدفاع المدني', '٦٠ يوماً: دراسة السوق، والتسوق الخفي، ولقاء الجيران',
                                          '٩٠ يوماً: طلب الرخصة، وعروض الأسعار، وخطابات النوايا', '٢٢ نيسان ٢٠٢٧: إطلاق المؤسسين في يوم الأرض'])],
    assumptions=P['revenue']['assumptions_ar'],
)
(HERE / 'numbers.json').write_text(json.dumps(N, ensure_ascii=False, indent=1), encoding='utf-8')
print('zones', [(z['id'], z['area']) for z in zones])
print('budget cats', cat_tot)
print('rev', rev_t, 'opex', opx_t, 'ebitda', ebitda, 'simple payback', [round(2e6 / e, 1) if e > 0 else None for e in ebitda])
print('calc', calc, 'check', round(chk_rev), round(chk_ebitda))
print('vortex', N['vortex'], 'theater', N['theater'])
print('partners', [(p['source_ar'], p['usd']) for p in partners], sum(p['usd'] for p in partners))
for b in budget: print('  ', b['cat'], b['k'], b['usd'])
