#!/usr/bin/env python3
"""timeline.py — explainer/script_src.json → explainer/timeline.json (scene t0/t1 + estimated word cue times).
Scene length = words / wps + pad (+ extra holds). VO starts `lead` s into a scene. Re-run after any script edit."""
import json, re, os
H = os.path.dirname(os.path.abspath(__file__)); E = os.path.join(H, '..', 'explainer')
d = json.load(open(os.path.join(E, 'script_src.json'), encoding='utf-8'))
wps, pad, lead = 2.1, 1.4, 0.7
extra = {'S01': 1.5, 'S06': 6.0, 'S12': 4.0}
t = 0.0; out = []
for s in d['scenes']:
    words = re.findall(r'\S+', s['vo']); n = len(words)
    dur = round(n / wps + pad + extra.get(s['id'], 0), 2)
    speak = (dur - pad - 1.0) if s['id'] == 'S06' else n / wps
    k = speak / n
    out.append({'id': s['id'], 'title_ar': s['title_ar'], 't0': round(t, 2), 't1': round(t + dur, 2), 'dur': dur, 'words': n,
                'on_screen': s['on_screen'], 'word_times': [[w, round(t + lead + i * k, 2)] for i, w in enumerate(words)]})
    t += dur
json.dump({'dur': round(t, 2), 'lead': lead, 'wps': wps, 'scenes': out}, open(os.path.join(E, 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for s in out: print(s['id'], s['t0'], s['t1'], s['words'])
print('total', round(t, 2))
