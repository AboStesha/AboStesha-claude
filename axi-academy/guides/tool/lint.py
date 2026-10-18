# Check a guide source against SPEC.md. Prints problems; exit code 1 if any must be fixed.
# python3 tool/lint.py src/L07.md [more files...]
import re, sys

KINDS = {'example', 'note', 'tip', 'warning', 'formula', 'key'}
BANNED = ['ربح مضمون', 'بلا مخاطر', 'دخل ثابت', 'مضاعفة رأس المال', 'توصية مؤكدة', 'إشارة 100%', 'لا تخسر أبداً', 'مرخّص في العراق', 'مرخص في العراق']
CHARACTERS = ['جون', 'سعيد']
DIALECT = ['شلون', 'شنو', 'هواية', 'ماكو', ' أكو ', ' اكو ', 'هسه', 'شكد', 'لگى', 'تگدر', ' مو ']
GLOSSARY = 'مصطلحات هذا الدليل'


def lint(path):
    errors, warns = [], []
    lines = open(path, encoding='utf-8').read().split('\n')
    if '---' not in lines:
        return [f'{path}: no "---" line after the header'], []
    cut = lines.index('---')
    head = dict(l.split(':', 1) for l in lines[:cut] if ':' in l)
    head = {k.strip(): v.strip() for k, v in head.items()}
    for k in ('id', 'title', 'lead'):
        if not head.get(k):
            errors.append(f'header: missing {k}')
    body = lines[cut + 1:]
    text = '\n'.join(body)
    stack, sections, examples, tables, keys, table_cols = [], [], 0, 0, 0, None
    for n, raw in enumerate(body, cut + 2):
        line = raw.strip()
        if line.startswith(':::'):
            kind = line[3:].split(' ', 1)[0]
            if kind:
                if kind not in KINDS:
                    errors.append(f'line {n}: unknown block kind "{kind}"')
                if stack:
                    errors.append(f'line {n}: block opened inside another block')
                stack.append(kind)
                examples += kind == 'example'
                keys += kind == 'key'
            else:
                if not stack:
                    errors.append(f'line {n}: closing ::: without an open block')
                else:
                    stack.pop()
            continue
        if line.startswith('## '):
            if stack:
                errors.append(f'line {n}: heading inside a ::: block')
            sections.append(line[3:].strip())
            if re.match(r'^[0-9٠-٩]+[.)\-]', line[3:].strip()):
                errors.append(f'line {n}: do not number headings')
        if line.startswith('# '):
            errors.append(f'line {n}: no "#" title heading (the cover uses the header)')
        if line.startswith('|'):
            cells = [c for c in line.strip('|').split('|')]
            if table_cols is None:
                tables += 1
                table_cols = len(cells)
                nxt = body[n - cut - 1].strip() if n - cut - 1 < len(body) else ''
                if not re.match(r'^\|?\s*:?-{2,}', nxt):
                    errors.append(f'line {n}: table header must be followed by a |---| line')
            elif len(cells) != table_cols:
                errors.append(f'line {n}: table row has {len(cells)} cells, header has {table_cols}')
        else:
            table_cols = None
        if line.count('**') % 2:
            errors.append(f'line {n}: unbalanced **')
        if line.count('`') % 2:
            errors.append(f'line {n}: unbalanced `')
    if stack:
        errors.append('a ::: block is never closed')
    for w in BANNED:
        if w in text:
            errors.append(f'banned phrase «{w}»')
    for w in CHARACTERS:
        if re.search(r'(^|[^\w])' + w + r'($|[^\w])', text):
            errors.append(f'story character «{w}» (use generic examples)')
    for w in DIALECT:
        if w in text:
            warns.append(f'possible Iraqi dialect «{w.strip()}» (use MSA)')
    if re.search('[٠-٩]', text + head.get('title', '') + head.get('lead', '')):
        errors.append('Eastern Arabic digits (use 0-9)')
    words = len(re.findall(r'[؀-ۿ]+', text))
    if not 1500 <= words <= 3200:
        warns.append(f'{words} Arabic words (target 1,800-2,800)')
    if not 5 <= len(sections) - 1 <= 8:
        warns.append(f'{len(sections) - 1} content sections (target 5-8 plus the glossary)')
    if not sections or sections[-1] != GLOSSARY:
        errors.append(f'last section must be "## {GLOSSARY}"')
    if examples < 3:
        errors.append(f'{examples} worked examples (need 3 or more)')
    if tables < 2:
        errors.append(f'{tables} tables (need 2 or more)')
    if keys != 1:
        errors.append(f'{keys} :::key blocks (need exactly 1)')
    return [f'{path}: {e}' for e in errors], [f'{path}: {w}' for w in warns] + [f'{path}: ok — {words} words, {len(sections)} sections, {examples} examples, {tables} tables']


bad = False
for p in sys.argv[1:]:
    e, w = lint(p)
    for m in e + w:
        print(m)
    bad |= bool(e)
sys.exit(1 if bad else 0)
