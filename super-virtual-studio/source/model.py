"""Super Virtual Studio — 60-month driver-based financial model (base case).
M1 = Jan 2027. Outputs model.json consumed by the deck, and prints summaries.
"""
import json, math, sys

MONTHS = 60
SCEN = sys.argv[1] if len(sys.argv) > 1 else 'base'
MULT = {'conservative': 0.55, 'base': 1.0, 'optimistic': 1.6}[SCEN]
# management response in the downside case: after M12 cut acquisition budget and hiring pace
CUT = {'conservative': 0.6}.get(SCEN, 1.0)

def ramp(m, pts):
    """piecewise-linear interpolation over (month, value) points"""
    pts = sorted(pts)
    if m <= pts[0][0]: return pts[0][1]
    for (a, va), (b, vb) in zip(pts, pts[1:]):
        if a <= m <= b: return va + (vb - va) * (m - a) / (b - a)
    return pts[-1][1]

# ---------------- assumptions ----------------
LAUNCH_VIRAL = 5      # Viral Remix public launch (May 2027)
LAUNCH_CINEMA = 8     # Cinema Studio v1 (Aug 2027)
LAUNCH_VSTUDIO = 12   # Virtual Studio + Virtual Camera beta (Dec 2027)
LAUNCH_ADS = 14       # Ads category (Feb 2028)
LAUNCH_SMA = 24       # Super Marketing Agency (Dec 2028), built on Ads Studio, agency-first

# blended consumer ARPU ($/paid sub/month, after annual discounts) — mix shifts to Studio plans
ARPU = [(5, 12), (8, 17), (12, 22), (24, 28), (36, 32), (60, 35)]
CHURN = [(5, 0.18), (12, 0.14), (24, 0.11), (36, 0.095), (60, 0.085)]   # monthly
CAC_PAID = [(5, 65), (12, 70), (24, 80), (36, 95), (60, 105)]        # paid CAC $ at <=$100K/mo spend
ORGANIC_K = [(5, 1.2), (12, 0.9), (24, 0.6), (36, 0.45), (60, 0.4)]  # organic/viral subs per paid sub
TOPUP = 0.15                                                          # credit top-ups as % of sub revenue

# programme marketing budget ($/month) for consumer acquisition
def mkt_budget(m):
    if m < 4: return 2_000
    if m == 4: return 12_000
    if m < 10: return ramp(m, [(5, 30_000), (9, 40_000)])
    if m < 13: return 70_000
    return ramp(m, [(13, 90_000), (24, 200_000), (25, 220_000), (36, 320_000), (37, 330_000), (48, 480_000), (49, 500_000), (60, 700_000)])


# Ads (B2B brand accounts)
ADS_NEW = [(LAUNCH_ADS, 10), (24, 35), (36, 70), (60, 120)]
ADS_ARPU = [(LAUNCH_ADS, 350), (36, 480), (60, 600)]
ADS_CHURN = 0.045
# Super Marketing Agency (teams; one team = one client company)
SMA_NEW = [(LAUNCH_SMA, 30), (36, 120), (48, 220), (60, 320)]   # new paid teams / month
SMA_ARPU = [(LAUNCH_SMA, 250), (60, 300)]   # blended: agency $149/team, SMB $199-499
SMA_CHURN = 0.04    # blend of SMB 5% and agency-managed 3%
# Enterprise / API / studio licensing ($/month)
ENT = [(20, 0), (24, 25_000), (36, 100_000), (48, 250_000), (60, 400_000)]

# gross margin by line (after generation/API/GPU + payment fees)
GM_CONS = [(1, 0.40), (12, 0.45), (24, 0.50), (36, 0.55), (60, 0.58)]
GM_ADS = [(1, 0.55), (36, 0.60), (60, 0.64)]
GM_SMA = [(1, 0.58), (60, 0.68)]
GM_ENT = 0.70

# headcount plan: (role, start month, monthly fully-loaded cost $). Remote-first, AI-assisted team.
HIRES = [
    ('Founder / CEO & Creative Director', 1, 4_000),
    ('CTO / Lead AI engineer', 1, 9_000),
    ('3D / WebGL game developer', 1, 7_000),
    ('Full-stack + AI pipeline engineer', 1, 6_500),
    ('Product designer / voxel artist', 2, 4_500),
    ('Growth & community lead', 4, 5_000),
    ('Full-stack engineer #2', 8, 6_500),
    ('Support & trust-safety ops', 8, 3_500),
    ('3D / graphics engineer #2', 11, 7_500),
    ('ML engineer (model routing, fine-tunes)', 11, 9_000),
    ('Performance marketer', 11, 6_000),
    ('Content creator / editor', 12, 4_000),
]
# from month 13 add hires to track scale (avg loaded cost rising to senior/global salaries)
HC_TARGET = [(12, 12), (18, 16), (24, 22), (36, 32), (48, 42), (60, 52)]
NEW_HIRE_COST = [(13, 8_000), (36, 10_000), (60, 11_500)]
FOUNDER_RAISE = [(13, 9_000), (36, 15_000)]   # founder salary after seed

TOOLS = [(1, 2_500), (12, 6_000), (24, 15_000), (60, 45_000)]          # SaaS, fixed infra, dev tools
RND_COMPUTE = [(1, 3_000), (12, 8_000), (24, 20_000), (60, 60_000)]     # experiments, fine-tunes, eval
GA = [(1, 3_000), (12, 6_000), (24, 15_000), (60, 50_000)]              # accounting, legal retainer, insurance
GA_ONEOFF = {1: 15_000, 2: 6_000, 4: 10_000, 8: 5_000, 13: 10_000, 22: 15_000}  # incorporation+ToS/privacy/biometric, trademark, viral-remix compliance (liveness, fingerprinting), ads contracts, SMA/EU
CONTINGENCY = 0.08
FREE_COST_PER_PAID = 6.0   # $ of free-tier generation per new paid subscriber
ADS_CAC = 1_500            # $ per new Ads Studio account (sales + partners)
SMA_CAC = 600              # $ per new SMA team (agency channel)

FUNDING = {1: ('Founder capital', 250_000), 4: ('Pre-seed (angels / SAFE)', 750_000), 11: ('Seed round', 3_500_000)}

# ---------------- simulation ----------------
rows = []
subs = 0.0; ads = 0.0; sma = 0.0; cash = 0.0
extra_hc = 0
for m in range(1, MONTHS + 1):
    # --- consumer subscriptions
    if m >= LAUNCH_VIRAL:
        budget = mkt_budget(m) * (CUT if m > 12 else 1)
        sat = max(1.0, budget / 100_000) ** 0.25          # CAC rises as spend scales (channel saturation)
        paid_new = budget / (ramp(m, CAC_PAID) * sat)
        org_new = paid_new * ramp(m, ORGANIC_K)
        # launch spikes for each product
        spike = 1.0
        if m in (LAUNCH_CINEMA, LAUNCH_CINEMA + 1): spike = 1.35
        if m in (LAUNCH_VSTUDIO, LAUNCH_VSTUDIO + 1): spike = 1.25
        new = (paid_new + org_new) * spike * (MULT if m > 6 else 1)
        subs = subs * (1 - ramp(m, CHURN)) + new
    else:
        budget = mkt_budget(m); new = 0
    cons_rev = subs * ramp(m, ARPU) * (1 + TOPUP)

    # --- ads accounts
    if m >= LAUNCH_ADS:
        ads = ads * (1 - ADS_CHURN) + ramp(m, ADS_NEW) * MULT
    ads_rev = ads * ramp(m, ADS_ARPU)
    # --- SMA teams
    if m >= LAUNCH_SMA:
        sma = sma * (1 - SMA_CHURN) + ramp(m, SMA_NEW) * MULT
    sma_rev = sma * ramp(m, SMA_ARPU)
    ent_rev = ramp(m, ENT) * MULT if m >= 20 else 0

    revenue = cons_rev + ads_rev + sma_rev + ent_rev
    free_cost = new * FREE_COST_PER_PAID   # previews for free users who never convert
    cogs = free_cost + cons_rev * (1 - ramp(m, GM_CONS)) + ads_rev * (1 - ramp(m, GM_ADS)) + sma_rev * (1 - ramp(m, GM_SMA)) + ent_rev * (1 - GM_ENT)

    # --- people
    base_hc = [h for h in HIRES if h[1] <= m] + ([('SMA build team', 18, 7_000)] * 5 if m >= 18 else [])
    payroll = sum(c for _, s, c in base_hc)
    if m >= 13:
        payroll += ramp(m, FOUNDER_RAISE) - 4_000
        target = ramp(m, HC_TARGET)
        core = len([h for h in base_hc if h[0] != 'SMA build team'])
        extra = max(0, round((target - core) * CUT))
        payroll += extra * ramp(m, NEW_HIRE_COST)
        hc = len(base_hc) + extra
    else:
        hc = len(base_hc)

    marketing = budget
    # B2B / SMA go-to-market (sales & partnerships) — 12% of their revenue
    marketing += (ramp(m, ADS_NEW) * MULT * ADS_CAC if m >= LAUNCH_ADS else 0) + (ramp(m, SMA_NEW) * MULT * SMA_CAC if m >= LAUNCH_SMA else 0) + 0.12 * ent_rev
    other = ramp(m, TOOLS) + ramp(m, RND_COMPUTE) + ramp(m, GA) + GA_ONEOFF.get(m, 0)
    opex_pre = payroll + marketing + other
    contingency = CONTINGENCY * opex_pre if m <= 24 else 0.03 * opex_pre
    opex = opex_pre + contingency
    ebitda = revenue - cogs - opex
    funding = FUNDING.get(m, (None, 0))[1]
    cash += ebitda + funding
    rows.append(dict(m=m, subs=subs, ads=ads, sma=sma, cons_rev=cons_rev, ads_rev=ads_rev, sma_rev=sma_rev, ent_rev=ent_rev,
                     revenue=revenue, cogs=cogs, payroll=payroll, marketing=marketing, other=other + contingency,
                     opex=opex, spend=cogs + opex, ebitda=ebitda, hc=hc, cash=cash, funding=funding))

# ---------------- aggregation ----------------
def agg(rs):
    keys = ['revenue', 'cogs', 'payroll', 'marketing', 'other', 'opex', 'spend', 'ebitda', 'cons_rev', 'ads_rev', 'sma_rev', 'ent_rev']
    d = {k: sum(r[k] for r in rs) for k in keys}
    d['hc_end'] = rs[-1]['hc']; d['subs_end'] = rs[-1]['subs']; d['cash_end'] = rs[-1]['cash']
    d['mrr_end'] = rs[-1]['revenue']
    return d

quarters = [agg(rows[i:i + 3]) for i in range(0, MONTHS, 3)]
years = [agg(rows[i:i + 12]) for i in range(0, MONTHS, 12)]
cum = 0; mincum = 0; cumq = []
for r in rows:
    cum += r['ebitda']; mincum = min(mincum, cum)
be_month = next((r['m'] for i, r in enumerate(rows) if r['ebitda'] > 0 and all(x['ebitda'] > 0 for x in rows[i:i + 6])), None)
# cumulative cash break-even (payback of all invested losses)
cum = 0; payback = None
for r in rows:
    cum += r['ebitda']
    if payback is None and r['m'] > 6 and cum > 0: payback = r['m']
first12 = rows[:12]
out = dict(scenario=SCEN, quarters=quarters, years=years, peak_deficit=-mincum, breakeven_month=be_month, payback_month=payback,
           total_5y=sum(y['ebitda'] for y in years), first_year_spend=sum(r['spend'] for r in first12),
           pre_launch_cost=sum(r['spend'] for r in rows[:LAUNCH_VIRAL - 1]),
           mvp_cost=sum(r['spend'] - r['revenue'] for r in rows[:LAUNCH_CINEMA]),
           monthly_opex_y1=sum(r['opex'] for r in first12) / 12,
           monthly_burn_m6=rows[5]['spend'] - rows[5]['revenue'],
           min_cash=min(r['cash'] for r in rows),
           monthly=[{k: round(v, 1) if isinstance(v, float) else v for k, v in r.items()} for r in rows])
json.dump(out, open(f'model_{SCEN}.json', 'w'), indent=1)

f = lambda v: f"{v/1e6:7.2f}M"
print(f"== {SCEN} ==")
for i, y in enumerate(years, 1):
    print(f"Y{i}: rev {f(y['revenue'])} spend {f(y['spend'])} EBITDA {f(y['ebitda'])} | cogs {f(y['cogs'])} pay {f(y['payroll'])} mkt {f(y['marketing'])} other {f(y['other'])} | HC {y['hc_end']} subs {y['subs_end']:.0f} MRR {f(y['mrr_end'])} cash {f(y['cash_end'])}")
for i, q in enumerate(quarters[:8], 1):
    print(f"  Q{i}: rev {f(q['revenue'])} spend {f(q['spend'])} ebitda {f(q['ebitda'])} hc {q['hc_end']} subs {q['subs_end']:.0f}")
print('peak deficit', f(out['peak_deficit']), 'BE month', be_month, 'payback month', payback, '5y total', f(out['total_5y']), 'min cash', f(out['min_cash']))
print('pre-launch cost', f(out['pre_launch_cost']), 'net cost to cinema launch', f(out['mvp_cost']), 'avg monthly opex Y1', f(out['monthly_opex_y1']))

if SCEN == 'base':
    deck = dict(quarters=[dict(rev=q['revenue'], spend=q['spend'], ebitda=q['ebitda'], hc=q['hc_end'], cogs=q['cogs'], payroll=q['payroll'], mkt=q['marketing'], other=q['other']) for q in quarters],
                years=[dict(rev=y['revenue'], spend=y['spend'], ebitda=y['ebitda'], hc=y['hc_end'], cons=y['cons_rev'], ads=y['ads_rev'], sma=y['sma_rev'], ent=y['ent_rev'], cogs=y['cogs'], payroll=y['payroll'], mkt=y['marketing'], other=y['other'], subs=y['subs_end'], mrr=y['mrr_end'], cash=y['cash_end']) for y in years],
                peak_deficit=out['peak_deficit'], breakeven_month=be_month, payback_month=payback, total_5y=out['total_5y'],
                pre_launch_cost=out['pre_launch_cost'], mvp_cost=out['mvp_cost'], monthly_opex_y1=out['monthly_opex_y1'], min_cash=out['min_cash'],
                funding=[dict(month=k, name=v[0], amount=v[1]) for k, v in FUNDING.items()],
                cumcash=[r['cash'] for r in rows],
                ask=dict(payroll=sum(r['payroll'] for r in rows[3:11]), mkt=sum(r['marketing'] for r in rows[3:11]), other=sum(r['other'] for r in rows[3:11]),
                         net=sum(r['spend'] - r['revenue'] for r in rows[3:11]), subs=rows[10]['subs'], mrr=rows[10]['revenue']),
                full_build=dict(spend=sum(r['spend'] for r in rows[:12]), net=sum(r['spend'] - r['revenue'] for r in rows[:12])),
                min_cash_after_seed=min(r['cash'] for r in rows[11:]),
                scen={k: (lambda d: dict(be=d['breakeven_month'], total=d['total_5y'], peak=d['peak_deficit'], min_cash=d['min_cash']))(json.load(open(f'model_{k}.json'))) for k in ('conservative', 'optimistic')})
    open('data.js', 'w').write('window.MODEL = ' + json.dumps(deck) + ';')
