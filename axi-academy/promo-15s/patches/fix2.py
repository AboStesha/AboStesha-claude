#!/usr/bin/env python3
"""Repair pass 2 (QA v1 -> v2): motion energy in holds, end-card life, true motion blur on fast moves.
usage: fix2.py LIB_JS FILM_A_JS FILM_B_JS   (each edited in place; every replacement must match exactly once)"""
import sys


def sub(path, pairs):
    s = open(path, encoding="utf-8").read()
    for old, new in pairs:
        n = s.count(old)
        if n != 1:
            sys.exit(f"{path}: expected 1 match, found {n}: {old[:70]!r}")
        s = s.replace(old, new)
    open(path, "w", encoding="utf-8").write(s)
    print("patched", path, len(pairs))


LIB = [
    ("  function watermark(ctx, color, a = 0.6) {",
     """  // light sweep across a pill (RTL), every `period` s from t0; pill w x h centred at the current origin
  function shimmer(ctx, t, t0, w, h, period = 1.0, dur = 0.42) {
    if (t < t0) return; const u = ((t - t0) % period) / dur; if (u >= 1) return;
    ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.clip(); ctx.transform(1, 0, -0.35, 1, 0, 0);
    const bx = lerp(w / 2 + 200, -w / 2 - 200, cubicInOut(u)); const g = ctx.createLinearGradient(bx - 110, 0, bx + 110, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(bx - 110, -h, 220, h * 2); ctx.restore();
  }
  // endless row of RTL text; v px/s (+ moves right); copies every text width
  function marquee(ctx, s, y, t, v, o, ph = 0) {
    const tw = arW(ctx, s, o); if (tw <= 0) return; let x = (t * v + ph) % tw; if (x < 0) x += tw;
    for (let j = -1; j <= Math.ceil(W / tw) + 1; j++) ar(ctx, s, x + j * tw, y, o);
  }
  function watermark(ctx, color, a = 0.6) {"""),
    ("wheels, wrapAr, RISK, riskStrip, watermark };",
     "wheels, wrapAr, RISK, riskStrip, watermark, shimmer, marquee };"),
]

A = [
    # slam(): optional extra width kick on top of the landing stretch
    ("    const hexp = 100 * clamp(1 - d / (o.hd || 0.16));",
     "    const hexp = Math.min(100, 100 * clamp(1 - d / (o.hd || 0.16)) + (o.hx || 0));"),
    # o02: the held pair pumps on the next two beats (call and response) with an impact shake
    ("    const sh = shake(t, [B(0), B(1)], 9, 0.16, 3);\n    const out = eio(t, B(3.45), B(4) - B(3.45));\n    ctx.save(); ctx.translate(sh.x, sh.y);",
     "    const sh = shake(t, [B(0), B(1)], 9, 0.16, 3), sh2 = shake(t, [B(2), B(3)], 15, 0.11, 7);\n    const out = eio(t, B(3.45), B(4) - B(3.45));\n    ctx.save(); ctx.translate(sh.x + sh2.x, sh.y + sh2.y);"),
    ("    const br = 1 + 0.022 * pulse(t, 2, 3);",
     "    const p2 = pulse(t, 2, 2, 0.1), p3 = pulse(t, 3, 3, 0.1); const br = 1 + 0.07 * Math.max(p2, p3);"),
    ("color: C.white, dy: -40 });", "color: C.white, dy: -40, hx: 80 * p2 });"),
    ("color: C.white, dy: 60 });", "color: C.white, dy: 60, hx: 45 * p3 });"),
    # o05: a lift wave runs through the name on beats 13 and 15 (reading direction)
    ("    arUnits(ctx, 'أكاديمية آكسي', CX, 900, o, (i) => { const u = eo(t, t0 + 0.02 + i * 0.03, 0.42); return { dy: (1 - u) * 320 }; });",
     """    const wave = (i, n) => { let v = 0; for (const k of [13, 15]) { const x = t - B(k); if (x < 0 || x > 0.5) continue; v = Math.max(v, Math.exp(-x / 0.3) * Math.max(0, 1 - Math.abs(i / Math.max(1, n - 1) - x / 0.3) * 3)); } return v; };
    arUnits(ctx, 'أكاديمية آكسي', CX, 900, o, (i, n) => { const u = eo(t, t0 + 0.02 + i * 0.03, 0.42); const v = wave(i, n); return { dy: (1 - u) * 320 - 30 * v, sy: 1 + 0.12 * v }; });"""),
    # o09: kinetic marquee in the empty bands, CTA pumps on the beat with a light sweep
    ("    vgrad(ctx, '#FAFAFA', '#EEF0F1');\n    const t0 = T.end; const up = (dt, d = 0.4) => eo(t, t0 + dt, d);\n    const lh = 100; const lw = logoW(lh);",
     """    vgrad(ctx, '#FAFAFA', '#EEF0F1');
    const t0 = T.end; const up = (dt, d = 0.4) => eo(t, t0 + dt, d);
    const mq = up(0.5, 0.6);
    if (mq > 0) {
      const mo = { size: 150, w: 700, hexp: 100, color: C.ink, stroke: 2.4, alpha: 0.2 * mq };
      K.marquee(ctx, 'من الصفر · إلى الاحتراف · ', 420, t, 240, mo);
      K.marquee(ctx, 'تعلّم · تدرّب · تداول · ', 1728, t, -240, mo, 300);
    }
    const lh = 100; const lw = logoW(lh);"""),
    ("const beat = 1 + 0.02 * Math.exp(-((t - t0) % SPB) / 0.1) * (t > t0 + 1 ? 1 : 0);",
     "const beat = 1 + 0.045 * Math.exp(-((t - 1.40) % SPB) / 0.1) * (t > t0 + 0.95 ? 1 : 0);"),
    ("    rr(ctx, -pw / 2, -ph / 2, pw, ph, ph / 2); ctx.fillStyle = C.red; ctx.fill();\n    ar(ctx, 'احجز مقعدك الآن', 0, 20,",
     "    rr(ctx, -pw / 2, -ph / 2, pw, ph, ph / 2); ctx.fillStyle = C.red; ctx.fill(); K.shimmer(ctx, t, t0 + 0.95, pw, ph, 2 * SPB);\n    ar(ctx, 'احجز مقعدك الآن', 0, 20,"),
    # true motion blur where the move is fast (6 sub-frames stepped there)
    ("  function blur(t) { return t > 13.3 ? 1 : 6; }",
     "  const FAST = [[0.25, 0.46], [1.0, 1.23], [1.83, 2.0], [2.95, 3.2], [4.07, 4.22], [4.78, 4.99], [9.0, 9.36], [10.86, 11.5]];\n  function blur(t) { for (const [a, b] of FAST) if (t >= a && t <= b) return 16; return t > 13.3 ? 1 : 6; }"),
]

B = [
    # o02: slow dolly onto the command bar while the question types
    ("    night(ctx);\n    const t0 = T.drop, te = T.enter;\n    const grow",
     "    night(ctx);\n    const t0 = T.drop, te = T.enter;\n    const dolly = 1 + 0.12 * cio(t, t0 + 0.3, te - t0 - 0.3);\n    ctx.save(); ctx.translate(CX, CY - 40); ctx.scale(dolly, dolly); ctx.translate(-CX, -(CY - 40));\n    const grow"),
    ("color: hexA(C.mist, 0.75), align: 'right', alpha: eo(t, t0 + 0.1, 0.3) * (1 - squash) });\n  }",
     "color: hexA(C.mist, 0.75), align: 'right', alpha: eo(t, t0 + 0.1, 0.3) * (1 - squash) });\n    ctx.restore();\n  }"),
    # o05: the card keeps turning while the path completes (yaw drift, float, push)
    ("    const rx = lerp(0.55, 0.20, inn) + 0.04 * Math.sin(t * 1.3) - 0.5 * out, ry = lerp(-0.7, -0.24, inn) + 0.05 * Math.sin(t * 0.9 + 1) + 1.1 * out;\n    tilted(ctx, c, lerp(CX + 260, CX, inn) - 700 * out, lerp(1500, 960, inn) - 500 * out, rx, ry, 1700, clamp(inn * 1.5) * (1 - out), lerp(0.85, 1.0, inn));",
     "    const drift = cio(t, t0 + 0.35, t1 - t0 - 0.6); const fy = 14 * Math.sin((t - t0) * 2.6);\n    const rx = lerp(0.55, 0.20, inn) - 0.08 * drift + 0.03 * Math.sin(t * 2.1) - 0.5 * out, ry = lerp(-0.7, -0.24, inn) + 0.36 * drift + 1.1 * out;\n    tilted(ctx, c, lerp(CX + 260, CX, inn) - 700 * out, lerp(1500, 960, inn) + fy - 500 * out, rx, ry, 1700, clamp(inn * 1.5) * (1 - out), lerp(0.85, 1.0, inn) * (1 + 0.06 * drift));"),
    # o09: chip marquee rows under the risk strip; the CTA pumps on the beat with a light sweep
    ("    vgrad(ctx, '#FAFAFA', '#EEF0F1');\n    const t0 = T.end; const up = (dt, d = 0.4) => eo(t, t0 + dt, d);\n    const lh = 100; logo(",
     """    vgrad(ctx, '#FAFAFA', '#EEF0F1');
    const t0 = T.end; const up = (dt, d = 0.4) => eo(t, t0 + dt, d);
    const mq = up(0.6, 0.6);
    if (mq > 0) { ctx.save(); ctx.globalAlpha *= mq; chips(ctx, ['من الصفر', 'إلى الاحتراف', 'مجانية', 'قريباً', 'تعلّم', 'تدرّب', 'تداول'], 1585, t, 180, 0); chips(ctx, ['تداول', 'تدرّب', 'تعلّم', 'قريباً', 'مجانية', 'إلى الاحتراف', 'من الصفر'], 1695, t, -180, 260); ctx.restore(); }
    const lh = 100; logo("""),
    ("    ctx.save(); ctx.translate(CX, 1020); ctx.scale(p1, p1); ctx.globalAlpha *= clamp(p1 * 1.4); rr(ctx, -320, -64, 640, 128, 64); ctx.fillStyle = C.red; ctx.fill(); ar(ctx, 'احجز مقعدك الآن', 0, 19, { size: 54, w: 700, color: C.white }); ctx.restore();",
     "    const pump = t > t0 + 0.9 ? 1 + 0.045 * Math.exp(-((t - 1.40) % SPB) / 0.1) : 1;\n    ctx.save(); ctx.translate(CX, 1020); ctx.scale(p1 * pump, p1 * pump); ctx.globalAlpha *= clamp(p1 * 1.4); rr(ctx, -320, -64, 640, 128, 64); ctx.fillStyle = C.red; ctx.fill(); K.shimmer(ctx, t, t0 + 0.9, 640, 128, 2 * SPB); ar(ctx, 'احجز مقعدك الآن', 0, 19, { size: 54, w: 700, color: C.white }); ctx.restore();"),
    ("  function draw(ctx, t) {",
     """  // endless row of UI chips (SaaS marquee); v px/s
  function chips(ctx, items, y, t, v, ph) {
    const size = 36, padX = 34, h = 80, gap = 20; const ws = items.map((s) => arW(ctx, s, { size, w: 500 }) + padX * 2 + (s === 'قريباً' ? 30 : 0));
    const total = ws.reduce((a, b) => a + b, 0) + gap * items.length; let x0 = (t * v + ph) % total; if (x0 < 0) x0 += total;
    for (let j = -1; j <= Math.ceil(W / total) + 1; j++) {
      let x = x0 + (j - 1) * total;
      items.forEach((s, i) => { const w = ws[i]; rr(ctx, x, y - h / 2, w, h, h / 2); ctx.fillStyle = C.white; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = hexA(C.ink, 0.12); ctx.stroke();
        const live = s === 'قريباً'; ar(ctx, s, x + w / 2 - (live ? 14 : 0), y + 13, { size, w: 500, color: C.graphite }); if (live) disc(ctx, x + w - 34, y - 1, 8, C.red);
        x += w + gap; });
    }
  }
  function draw(ctx, t) {"""),
    ("  function blur(t) { return t > 13.3 ? 1 : 6; }",
     "  const FAST = [[0.95, 1.27], [2.95, 3.3], [4.4, 4.86], [6.4, 6.62], [8.13, 8.5], [8.9, 9.0], [9.4, 9.5], [9.9, 10.0], [11.1, 11.36]];\n  function blur(t) { for (const [a, b] of FAST) if (t >= a && t <= b) return 16; return t > 13.3 ? 1 : 6; }"),
]

if __name__ == "__main__":
    lib, fa, fb = sys.argv[1:4]
    sub(lib, LIB)
    sub(fa, A)
    sub(fb, B)
