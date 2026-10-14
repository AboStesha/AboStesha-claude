"""Build transcript.json, words.json and src/words.js from VAD phrases + corrected text.

corrected.txt has one line per VAD phrase (same order as vad.json):
  text      → the corrected words of that phrase
  -         → drop the phrase (breath, noise)
  +text     → merge this VAD phrase into the previous one (text appended)
  @a|text   → override the phrase start (seconds) — e.g. when a sound precedes the first word
Usage: python -I build_words.py vad.json corrected.txt audio16k.f32 lesson_dir
"""
import json, sys, subprocess, os
vad_path, cor_path, f32, ldir = sys.argv[1:5]
ph = json.load(open(vad_path))['phrases']
lines = [l.rstrip('\n') for l in open(cor_path, encoding='utf-8')]
assert len(lines) == len(ph), f'{len(lines)} lines vs {len(ph)} phrases'
out = []
for (a, b), l in zip(ph, lines):
    l = l.strip()
    if l == '-' or not l: continue
    if l.startswith('+') and out:
        out[-1]['b'] = round(b, 2); out[-1]['text'] += ' ' + l[1:].strip(); continue
    if l.startswith('@'): a, l = float(l[1:].split('|')[0]), l.split('|', 1)[1]
    out.append({'id': len(out), 'a': round(a, 2), 'b': round(b, 2), 'text': l.lstrip('+').strip()})
tools = os.path.join(ldir, 'tools')
json.dump(out, open(os.path.join(tools, 'transcript.json'), 'w'), ensure_ascii=False, indent=0)
subprocess.run([sys.executable, '-I', os.path.join(tools, 'align_words.py'), f32, os.path.join(tools, 'transcript.json'), os.path.join(tools, 'words.json')], check=True)
words = json.load(open(os.path.join(tools, 'words.json')))
with open(os.path.join(ldir, 'src', 'words.js'), 'w', encoding='utf-8') as f:
    f.write('window.PHRASES=' + json.dumps(out, ensure_ascii=False) + ';\n')
    f.write('window.WORDS=' + json.dumps(words, ensure_ascii=False) + ';\n')
    if len(sys.argv) > 5: f.write('window.AUDIO_FILE_DUR=' + sys.argv[5] + ';\n')
print(len(out), 'phrases,', len(words), 'words')
for p in out:
    ws = [w for w in words if w['p'] == p['id']]
    print(f"{p['id']:3d} [{p['a']+2:7.2f}-{p['b']+2:7.2f}] " + ' '.join(f"{w['w']}@{w['s']+2:.2f}" for w in ws))
