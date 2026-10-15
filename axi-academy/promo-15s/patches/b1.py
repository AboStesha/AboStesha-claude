import sys
p = sys.argv[1]; s = open(p, encoding='utf-8').read()
R = [
 ("const w = c.width, h = c.height; c.setTransform(1, 0, 0, 1, 0, 0);", "const w = c.canvas.width, h = c.canvas.height; c.setTransform(1, 0, 0, 1, 0, 0);"),
 ("wEnd = mixLine(ctx, [{ t: 'لأول' }, { t: '1000', lat: true }, { t: 'طالب' }], x, 1010, { size: 130, w: 700, lsize: 140, lw: 800, color: col });",
  "wEnd = mixLine(ctx, [{ t: 'لأول' }, { t: '1000', lat: true }, { t: 'طالب' }], x, 1010, { size: 104, w: 700, lsize: 112, lw: 800, color: col });"),
 ("ctx.save(); ctx.beginPath(); ctx.rect(0, 410, W, 150); ctx.clip();\n    arUnits(ctx, 'أكاديمية آكسي', CX, 530, { size: 124, w: 700, color: C.ink }, (i) => ({ dy: (1 - eo(t, t0 + 0.05 + i * 0.025, 0.4)) * 150 }));",
  "ctx.save(); ctx.beginPath(); ctx.rect(0, 400, W, 235); ctx.clip();\n    arUnits(ctx, 'أكاديمية آكسي', CX, 530, { size: 124, w: 700, color: C.ink }, (i) => ({ dy: (1 - eo(t, t0 + 0.05 + i * 0.025, 0.4)) * 240 }));"),
 ("ctx.globalAlpha = a * (0.18 + 0.62 * z2); ctx.beginPath(); ctx.arc(px, py, 1.4 + 2.2 * z2, 0, Math.PI * 2); ctx.fill();",
  "ctx.globalAlpha = a * (0.26 + 0.74 * z2); ctx.beginPath(); ctx.arc(px, py, 1.8 + 2.8 * z2, 0, Math.PI * 2); ctx.fill();"),
]
for a, b in R:
    n = s.count(a)
    if n != 1: print('MISSING' if n == 0 else 'MULTI', repr(a[:70])); sys.exit(1)
    s = s.replace(a, b)
open(p, 'w', encoding='utf-8').write(s); print('patched', len(R))
