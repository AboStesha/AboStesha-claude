import sys
p = sys.argv[1]; s = open(p, encoding='utf-8').read()
R = [
 ("ctx.save(); ctx.beginPath(); ctx.rect(0, 700, W, 245); ctx.clip();\n    arUnits(ctx, 'أكاديمية آكسي', CX, 900, o, (i) => { const u = eo(t, t0 + 0.02 + i * 0.03, 0.42); return { dy: (1 - u) * 230 }; });",
  "ctx.save(); ctx.beginPath(); ctx.rect(0, 700, W, 310); ctx.clip();\n    arUnits(ctx, 'أكاديمية آكسي', CX, 900, o, (i) => { const u = eo(t, t0 + 0.02 + i * 0.03, 0.42); return { dy: (1 - u) * 320 }; });"),
 ("ctx.save(); ctx.beginPath(); ctx.rect(0, 990, W, 150); ctx.clip();\n    const uq = eo(t, tq, 0.35); ar(ctx, 'قريباً', CX - 20, 1100 + (1 - uq) * 130,",
  "ctx.save(); ctx.beginPath(); ctx.rect(0, 990, W, 200); ctx.clip();\n    const uq = eo(t, tq, 0.35); ar(ctx, 'قريباً', CX - 20, 1100 + (1 - uq) * 200,"),
 ("ctx.save(); ctx.beginPath(); ctx.rect(0, 1370, W, 170); ctx.clip();\n      arUnits(ctx, 'احجز مقعدك الآن', CX, 1500, o, (i) => { const u = eo(t, ts + 0.06 + i * 0.022, 0.34); return { dy: (1 - u) * 150 }; });",
  "ctx.save(); ctx.beginPath(); ctx.rect(0, 1370, W, 230); ctx.clip();\n      arUnits(ctx, 'احجز مقعدك الآن', CX, 1500, o, (i) => { const u = eo(t, ts + 0.06 + i * 0.022, 0.34); return { dy: (1 - u) * 240 }; });"),
 # end card re-layout
 ("    const o = { size: 128, w: 700, color: C.ink };\n    ctx.save(); ctx.beginPath(); ctx.rect(0, 420, W, 140); ctx.clip();\n    arUnits(ctx, 'أكاديمية آكسي', CX, 540, o, (i) => ({ dy: (1 - eo(t, t0 + 0.04 + i * 0.025, 0.4)) * 150 }));",
  "    const o = { size: 140, w: 700, color: C.ink };\n    ctx.save(); ctx.beginPath(); ctx.rect(0, 470, W, 245); ctx.clip();\n    arUnits(ctx, 'أكاديمية آكسي', CX, 640, o, (i) => ({ dy: (1 - eo(t, t0 + 0.04 + i * 0.025, 0.4)) * 250 }));"),
 ("rr(ctx, CX - cw / 2, 600, cw, ch, 35);", "rr(ctx, CX - cw / 2, 700, cw, ch, 35);"),
 ("ar(ctx, 'قريباً', CX - 14, 649, { size: 40, w: 500, color: C.ink }); disc(ctx, CX + 62, 635, 9,", "ar(ctx, 'قريباً', CX - 14, 749, { size: 40, w: 500, color: C.ink }); disc(ctx, CX + 62, 735, 9,"),
 ("ar(ctx, 'تعلّم التداول من الصفر إلى الاحتراف', CX, 778 + (1 - up(0.3)) * 18, { size: 52,", "ar(ctx, 'تعلّم التداول من الصفر إلى الاحتراف', CX, 870 + (1 - up(0.3)) * 18, { size: 56,"),
 ("mixLine(ctx, [{ t: 'مجانية لأول' }, { t: '1000', lat: true }, { t: 'طالب فقط' }], CX, 885, { size: 62, w: 700, lsize: 64, lw: 800, color: C.ink });",
  "mixLine(ctx, [{ t: 'مجانية لأول' }, { t: '1000', lat: true }, { t: 'طالب فقط' }], CX, 985, { size: 66, w: 700, lsize: 68, lw: 800, color: C.ink });"),
 ("const pw = 640, ph = 128; const beat", "const pw = 680, ph = 136; const beat"),
 ("ctx.save(); ctx.translate(CX, 1040); ctx.scale(pu * beat, pu * beat);", "ctx.save(); ctx.translate(CX, 1140); ctx.scale(pu * beat, pu * beat);"),
 ("ar(ctx, 'احجز مقعدك الآن', 0, 19, { size: 54, w: 700, color: C.white }); ctx.restore();\n    lat(ctx, 'axi.com/ar', CX, 1180 + (1 - up(0.62)) * 14, { size: 46,",
  "ar(ctx, 'احجز مقعدك الآن', 0, 20, { size: 58, w: 700, color: C.white }); ctx.restore();\n    lat(ctx, 'axi.com/ar', CX, 1290 + (1 - up(0.62)) * 14, { size: 48,"),
 ("riskStrip(ctx, t, 12.0, 1262, { size: 27 });", "riskStrip(ctx, t, 12.0, 1350, { size: 27 });"),
]
for a, b in R:
    n = s.count(a)
    if n != 1: print('MISSING' if n == 0 else 'MULTI', repr(a[:70])); sys.exit(1)
    s = s.replace(a, b)
open(p, 'w', encoding='utf-8').write(s); print('patched', len(R))
