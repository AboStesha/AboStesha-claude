import json,sys
R=json.load(open(sys.argv[1])); CORR={'D1_fi_before_marhala':0,'D2_ataarrad':2,'D2b_ataarrad_tight':2,'D3_fi_hisabak_1000':1,'D4_fi_hisabak_2000':1,'D5_litasil':1,'D6_wa_tahqiq':1,'D6b_wa_tahqiq_tight':1,'D7_bi_ayy_waqt':1,'D7b_tight':1,'D8_yawman':1}
# correct candidate index per case (what he SAYS): default 0
cases={c['id']:c for c in json.load(open(sys.argv[2]))}
srcs=[]; tab={}
for r in R:
    if r['src'] not in srcs: srcs.append(r['src'])
    c=cases[r['id']]; k=CORR.get(r['id'],0); sc=[r['scores'][t] for t in c['cands']]
    tab.setdefault(r['id'],{})[r['src']]=round(sc[k]-max(s for i,s in enumerate(sc) if i!=k),2)
print('case'.ljust(22),' '.join(s.rjust(8) for s in srcs),'   (correct-candidate minus best other; >0 = what he says wins)')
for i,v in tab.items(): print(i.ljust(22),' '.join(('%8.2f'%v[s]) if s in v else '       -' for s in srcs),'  correct =',cases[i]['cands'][CORR.get(i,0)])
