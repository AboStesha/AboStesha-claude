# Build questions.json from the bank/*.md sources and check them.
# python3 tool/build.py            (run from axi-academy/quizzes)
#
# bank format:  # C1 | course name | course label      ## L01 | 1 | lesson title      ## EX | exam title
#               ? question  (options shuffled)          ?= question  (options kept in the written order)
#               + correct option                        - wrong option
# The correct answer's position is balanced within each lesson / exam (seeded, so every build is identical).
import glob, json, random, re, sys
from collections import Counter

BANNED = ['ربح مضمون', 'بلا مخاطر', 'دخل ثابت', 'مضاعفة رأس المال', 'توصية مؤكدة', 'إشارة 100%', 'لا تخسر أبداً', 'مرخّص في العراق']
SIZE = {'lesson': 10, 'exam': 40}


def parse(path):
    courses, course, block, q = [], None, None, None
    for n, raw in enumerate(open(path, encoding='utf-8'), 1):
        line = raw.strip()
        if not line:
            continue
        where = f'{path}:{n}'
        if line.startswith('# '):
            cid, name, label = [s.strip() for s in line[2:].split('|')]
            course = {'id': cid, 'name': name, 'label': label, 'lessons': [], 'exam': None}
            courses.append(course)
        elif line.startswith('## '):
            parts = [s.strip() for s in line[3:].split('|')]
            if parts[0] == 'EX':
                block = {'id': f"{course['id']}-EX", 'kind': 'exam', 'title': parts[1], 'questions': []}
                course['exam'] = block
            else:
                block = {'id': parts[0], 'kind': 'lesson', 'no': int(parts[1]), 'title': parts[2], 'questions': []}
                course['lessons'].append(block)
        elif line.startswith('?'):
            fixed = line.startswith('?=')
            q = {'q': line[2:].strip(), 'fixed': fixed, 'opts': [], 'where': where}
            block['questions'].append(q)
        elif line[:2] in ('+ ', '- '):
            q['opts'].append((line[2:].strip(), line[0] == '+'))
        else:
            sys.exit(f'{where}: cannot read line: {line}')
    return courses


def place(block):
    rng = random.Random(block['id'])
    counts = Counter()
    for q in block['questions']:
        if q['fixed']:
            counts[[c for _, c in q['opts']].index(True)] += 1
    prev = None
    out = []
    for i, q in enumerate(block['questions'], 1):
        right = [t for t, c in q['opts'] if c][0]
        wrong = [t for t, c in q['opts'] if not c]
        if q['fixed']:
            options = [t for t, _ in q['opts']]
        else:
            low = min(counts[p] for p in range(4))
            pool = [p for p in range(4) if counts[p] == low]
            pool = [p for p in pool if p != prev] or pool
            pos = rng.choice(pool)
            counts[pos] += 1
            rng.shuffle(wrong)
            options = wrong[:pos] + [right] + wrong[pos:]
        prev = options.index(right)
        out.append({'id': f"{block['id']}-{i:02d}", 'q': q['q'], 'options': options, 'answer': prev})
    return out


def main():
    courses = []
    for path in sorted(glob.glob('bank/c*.md')):
        courses += parse(path)
    errors, stems, total, pos = [], Counter(), 0, Counter()
    for c in courses:
        for b in c['lessons'] + [c['exam']]:
            if b is None:
                errors.append(f"{c['id']}: no exam block"); continue
            if len(b['questions']) != SIZE[b['kind']]:
                errors.append(f"{b['id']}: {len(b['questions'])} questions, expected {SIZE[b['kind']]}")
            for q in b['questions']:
                opts = [t for t, _ in q['opts']]
                if len(opts) != 4 or sum(c for _, c in q['opts']) != 1:
                    errors.append(f"{q['where']}: needs 4 options with exactly one +")
                if len(set(opts)) != len(opts):
                    errors.append(f"{q['where']}: repeated option")
                for t in [q['q']] + opts:
                    for w in BANNED:
                        if w in t:
                            errors.append(f"{q['where']}: banned phrase «{w}»")
                    if re.search('[٠-٩]', t):
                        errors.append(f"{q['where']}: Eastern Arabic digits")
                stems[q['q']] += 1
            b['questions'] = place(b)
            total += len(b['questions'])
            pos.update(q['answer'] for q in b['questions'])
    errors += [f'repeated question: {s}' for s, k in stems.items() if k > 1]
    for c in courses:
        for b in c['lessons'] + [c['exam']]:
            b.pop('kind', None)
    json.dump({'courses': courses}, open('questions.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'{total} questions in {len(courses)} courses; correct answer positions أ/ب/ج/د: {[pos[i] for i in range(4)]}')
    for c in courses:
        print(' ', c['id'], c['name'], [len(l['questions']) for l in c['lessons']], 'exam', len(c['exam']['questions']) if c['exam'] else 0)
    if errors:
        print('\n'.join(['ERRORS:'] + errors)); sys.exit(1)


main()
