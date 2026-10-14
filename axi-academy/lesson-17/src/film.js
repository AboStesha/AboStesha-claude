// Lesson 17 director: scene registry, hard-edged transitions, temporal-supersampled motion blur, HUD.
(function (G) {
  const A = G.AX, FX = G.FX;
  const { W, H, C, clamp, lerp, inv, eio, hexA, logo, logoWidth, xmark } = A;

  const OFF = 2.0;                                   // brand open before the narration
  const byP = {};
  (G.WORDS || []).forEach((x) => { (byP[x.p] = byP[x.p] || []).push(x); });
  const w = (p, k = 0) => byP[p][k].s + OFF;
  const we = (p, k = 0) => byP[p][k].e + OFF;
  const ph = (p) => G.PHRASES[p].a + OFF;
  const phe = (p) => G.PHRASES[p].b + OFF;
  // words k=a..b of phrase p as headline items {s, t}; o.map = {k: overrides}
  const wl = (p, a = 0, b, o = {}) => { const arr = byP[p]; const e = b == null ? arr.length - 1 : b; const out = []; for (let k = a; k <= e; k++) out.push(Object.assign({ s: o.keepQ ? arr[k].w : arr[k].w.replace(/[؟?]/g, ''), t: arr[k].s + OFF }, (o.map && o.map[k]) || {})); return out; };
  const AUDIO_END = G.PHRASES[G.PHRASES.length - 1].b;
  const CLOSE = OFF + AUDIO_END + 0.25;
  const TOTAL = CLOSE + 5.0;

  const SFX = [];
  const sfx = (t, type, g = 0.3, extra = {}) => SFX.push(Object.assign({ t: +t.toFixed(3), type, g }, extra));
  // standard sound per kinetic-type mode (pan follows screen x when given)
  function ksfx(t, mode, g = 0.2, x) {
    const pan = x == null ? 0 : +(clamp((x - 960) / 960, -1, 1) * 0.45).toFixed(2); const e = { pan };
    if (mode === 'drop') { sfx(t - 0.04, 'whoosh', g * 0.6, Object.assign({ d: 0.22, up: false }, e)); sfx(t + 0.2, 'pop', g * 0.7, Object.assign({ f: 560 }, e)); }
    else if (mode === 'bounce') sfx(t + 0.02, 'bloop', g, e);
    else if (mode === 'stretch') sfx(t, 'stretch', g, e);
    else if (mode === 'spin') sfx(t, 'spin', g, e);
    else if (mode === 'snap') sfx(t, 'snap', g * 1.3, e);
    else if (mode === 'slam') { sfx(t - 0.02, 'slam', g * 1.2, e); }
    else if (mode === 'rise') sfx(t - 0.03, 'whoosh', g * 0.4, Object.assign({ d: 0.18 }, e));
    else if (mode === 'slide') sfx(t - 0.06, 'whoosh', g * 0.8, Object.assign({ d: 0.32 }, e));
  }

  // per-ink brand marks — drawn by the director (fixed on screen, clipped to the scene that owns that part of the frame);
  // scene code may still call F.marks(); those calls are ignored.
  function marks() {}
  function realMarks(ctx, ink, o = {}) {
    const col = ink === 'light' ? C.ink : C.white;
    if (o.logo !== false) logo(ctx, 1843 - logoWidth(80), 50, 80, col, { alpha: o.alpha == null ? 1 : o.alpha });
    if (o.x !== false) xmark(ctx, 77 + 38, 1080 - 62 - 34, 69, col, 0.6 * (o.alpha == null ? 1 : o.alpha));
  }

  const SCENES = [];
  const scene = (def) => { SCENES.push(def); return def; };
  const chapters = [];

  function region(ctx, tr, p) {
    if (tr.type === 'bars') return FX.barsRegion(ctx, p);
    if (tr.type === 'ripple') return FX.rippleRegion(ctx, p, tr.x || 960, tr.y || 540);
    if (tr.type === 'iris') { ctx.beginPath(); ctx.arc(tr.x || 960, tr.y || 540, Math.hypot(W, H) * A.expoIn(p), 0, 6.283); return; }
    if (tr.type === 'wipeL') { ctx.beginPath(); ctx.rect(0, 0, W * p, H); return; }
    if (tr.type === 'wipeR') { ctx.beginPath(); ctx.rect(W * (1 - p), 0, W * p, H); return; }
    if (tr.type === 'slices') { ctx.beginPath(); const n = 12; for (let k = 0; k < n; k++) { const q = clamp(p * 1.6 - (k % 2 ? 0.0 : 0.3) - k * 0.02); ctx.rect(k % 2 ? W * (1 - q) : 0, k * H / n, W * q, H / n + 0.5); } return; }
  }
  function sceneMarks(ctx, sc, t) { if (sc.noMarks) return; if (sc.marksFn) sc.marksFn(ctx, t); else realMarks(ctx, sc.ink); }
  function drawScene(ctx, t) {
    let i = SCENES.findIndex((s) => t >= s.t0 && t < s.t1);
    if (i < 0) i = t < SCENES[0].t0 ? 0 : SCENES.length - 1;
    const s = SCENES[i]; const nx = SCENES[i + 1];
    const tr = nx && nx.enter; const d = tr ? tr.dur || 0.5 : 0; const tStart = nx ? nx.t0 - d : Infinity;
    if (tr && tr.type === 'whip' && t >= tStart) {
      const p = eio(t, tStart, d); const dir = tr.dir || 1; // +1: old exits right, new enters from left (RTL "next")
      ctx.save(); ctx.translate(dir * W * p, 0); s.draw(ctx, t); ctx.restore();
      ctx.save(); ctx.translate(dir * W * (p - 1), 0); nx.draw(ctx, t); ctx.restore();
      const xOld = dir > 0 ? [W * p, W] : [0, W * (1 - p)], xNew = dir > 0 ? [0, W * p] : [W * (1 - p), W];
      ctx.save(); ctx.beginPath(); ctx.rect(xOld[0], 0, xOld[1] - xOld[0], H); ctx.clip(); sceneMarks(ctx, s, t); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(xNew[0], 0, xNew[1] - xNew[0], H); ctx.clip(); sceneMarks(ctx, nx, t); ctx.restore();
      return;
    }
    s.draw(ctx, t); sceneMarks(ctx, s, t);
    if (tr && tr.type !== 'cut' && t >= tStart) {
      const p = clamp((t - tStart) / d);
      ctx.save(); region(ctx, tr, p); ctx.clip(); nx.draw(ctx, t); sceneMarks(ctx, nx, t); ctx.restore();
      if (tr.type === 'bars') FX.barsEdges(ctx, p, s.ink, nx.ink);
      if (tr.type === 'ripple') FX.rippleRings(ctx, p, tr.x || 960, tr.y || 540, nx.ink);
    }
  }

  // motion blur: average N renders across the shutter interval
  let sub = null, subCtx = null;
  function shutterAt(t) { let s = 0.75 / 60; for (const z of SHUTTER) if (t >= z[0] && t < z[1]) s = z[2]; return s; }
  const SHUTTER = []; // [t0, t1, seconds] windows with a wider shutter (whips) — rendered with more sub-frames
  function frame(ctx, t, o = {}) {
    const wide = SHUTTER.some((z) => t >= z[0] && t < z[1]);
    const N = (o.samples || 6) > 1 && wide ? Math.max(o.samples || 6, 18) : (o.samples || 6);
    if (!sub) { sub = document.createElement('canvas'); sub.width = W; sub.height = H; subCtx = sub.getContext('2d'); }
    if (N <= 1) { drawScene(ctx, t); }
    else {
      const sh = shutterAt(t);
      for (let k = 0; k < N; k++) {
        const tk = t - sh * (1 - (k + 0.5) / N);
        subCtx.save(); drawScene(subCtx, tk); subCtx.restore();
        ctx.globalAlpha = 1 / (k + 1); ctx.drawImage(sub, 0, 0);
      }
      ctx.globalAlpha = 1;
    }
    // HUD on top, unblurred
    const ap = clamp(inv(OFF - 0.2, OFF + 0.5, t)) * (1 - clamp(inv(CLOSE - 0.6, CLOSE, t)));
    if (ap > 0) { ctx.save(); ctx.globalAlpha = ap; FX.timecode(ctx, t - OFF, TOTAL); ctx.restore(); FX.timeline(ctx, t, chapters, OFF, CLOSE - 0.2, { appear: ap }); }
  }

  G.FILM = { OFF, CLOSE, TOTAL, AUDIO_END, w, we, wl, ph, phe, SFX, sfx, ksfx, marks, realMarks, SCENES, scene, chapters, SHUTTER, frame, drawScene };
})(typeof window !== 'undefined' ? window : globalThis);
