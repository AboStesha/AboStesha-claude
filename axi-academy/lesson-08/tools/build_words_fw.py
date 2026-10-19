"""Build src/words.js for lesson 8 from faster-whisper word timings (tools/fw.json) plus editor corrections.

The narration follows the corrected script, so whisper's words are kept in order; this script only
fixes spelling, writes numbers as digits (merging the spoken words of one number into one token)
and groups the words into caption phrases. Times are voice-file time (the voice starts at video 2.000 s).
Usage: python -I build_words_fw.py
"""
import json, os, re
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.dirname(here)
ws = [dict(w) for s in json.load(open(os.path.join(here, 'fw.json'), encoding='utf-8')) for w in s['words']]
near = lambda t: min(range(len(ws)), key=lambda i: abs(ws[i]['s'] - t))
# (start time of the first spoken word, number of spoken words, display token)
MERGE = [(79.38, 1, '1,000'), (83.22, 3, '1:100'), (86.34, 1, '1,000'), (88.78, 3, '1:100'), (93.94, 2, '100,000'),
         (101.06, 3, '0.1'), (107.84, 2, '10,000'), (109.94, 3, '0.1'), (112.62, 2, '100,000'), (124.06, 2, '10,000'),
         (128.76, 1, '100'), (130.54, 1, '100'), (141.62, 1, '1'), (144.80, 1, '100'), (246.50, 1, '100'),
         (254.66, 2, '10,000'), (257.30, 2, '5,000'), (262.96, 2, '10,000'), (265.34, 2, '5,000'), (267.76, 1, '100'), (269.68, 2, '200%')]
FIX = {19.78: 'ضرر', 41.18: 'التداول', 74.58: 'لنعد', 103.92: 'EUR/USD', 111.68: 'مضروبة', 118.14: 'الفوركس', 125.82: 'مقسوماً',
       149.10: 'محيّراً', 163.98: 'نلقِ', 165.74: 'المخاطر', 185.78: 'يتبقَّ', 199.76: 'يُرفع', 210.90: 'فتُغلق', 249.34: 'يُعرض',
       250.22: 'كنسبة', 271.86: 'الهامش', 132.24: 'تذكّر', 246.90: 'وتذكّر', 152.60: 'يُحسب', 153.14: 'تلقائياً', 133.80: 'يُحوَّل', 57.02: 'يُحوَّل',
       27.42: 'يُعاد', 30.18: 'إذن'}
for t, w in FIX.items():
    i = near(t); assert abs(ws[i]['s'] - t) < 0.02, (t, ws[i]); ws[i]['w'] = w
drop = set()
for t, n, s in MERGE:
    i = near(t); assert abs(ws[i]['s'] - t) < 0.02, (t, ws[i])
    ws[i]['w'] = s; ws[i]['e'] = ws[i + n - 1]['e']; drop.update(range(i + 1, i + n))
ws = [w for k, w in enumerate(ws) if k not in drop]
for w in ws:  # display tokens: no trailing commas / full stops (the question mark stays; wl() strips it unless asked)
    w['w'] = re.sub(r'[،,.:]+$', '', w['w']).strip()
STARTS = [0.00, 3.70, 9.24, 14.76, 18.40, 23.56, 25.60, 29.44, 31.72, 35.94, 39.22, 44.56, 49.32, 50.74, 55.28, 56.54, 59.80, 62.62,
          65.06, 67.76, 73.68, 75.98, 80.14, 84.56, 90.18, 95.34, 98.80, 105.84, 109.48, 113.42, 118.74, 123.66, 129.00, 131.72,
          135.98, 138.68, 142.18, 146.64, 151.54, 156.40, 160.74, 163.38, 167.80, 171.78, 176.78, 181.64, 185.28, 190.10, 196.42,
          198.92, 204.84, 210.90, 213.58, 216.14, 219.92, 225.28, 230.28, 236.00, 240.10, 241.10, 246.90, 251.42, 256.22, 259.64,
          262.96, 268.32, 271.16, 276.18, 283.12, 287.28, 291.84, 294.52]
for t in STARTS: assert any(abs(w['s'] - t) < 0.02 for w in ws), t
words, phrases = [], []
for w in ws:
    p = max(k for k, t in enumerate(STARTS) if w['s'] >= t - 0.02)
    words.append({'w': w['w'], 's': round(w['s'], 2), 'e': round(w['e'], 2), 'p': p})
for k in range(len(STARTS)):
    pw = [w for w in words if w['p'] == k]
    phrases.append({'id': k, 'a': pw[0]['s'], 'b': pw[-1]['e'], 'text': ' '.join(w['w'] for w in pw)})
json.dump(words, open(os.path.join(here, 'words.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
json.dump(phrases, open(os.path.join(here, 'transcript.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
os.makedirs(os.path.join(root, 'src'), exist_ok=True)
with open(os.path.join(root, 'src', 'words.js'), 'w', encoding='utf-8') as f:
    f.write('window.PHRASES=' + json.dumps(phrases, ensure_ascii=False) + ';\n')
    f.write('window.WORDS=' + json.dumps(words, ensure_ascii=False) + ';\n')
    f.write('window.AUDIO_FILE_DUR=297.72;\n')
print(len(phrases), 'phrases,', len(words), 'words')
for p in phrases:
    print(f"{p['id']:3d} [{p['a']+2:7.2f}-{p['b']+2:7.2f}] " + ' '.join(f"{k}:{w['w']}@{w['s']+2:.2f}" for k, w in enumerate([x for x in words if x['p'] == p['id']])))
