
  // ================================================================== STUDIO SPACE: virtual camera, floor projection, floor light
  // ------------------------------------------------------------------ virtual camera on L4 (2.5D dolly about the plate's horizon point)
  // L4 sits inside its extended studio (l4_ext2.jpg: the plate's own floor quilted out to every frame edge, even at extreme
  // wide; work/build_ext2.py) and the camera scales the whole world about A = (0.49W, 0.58H): s 1.0 FULL, 0.66 HOME,
  // 0.30 WIDE, 0.22 extreme wide; dy cranes (fraction of H). Pull-outs: near-instant attack + expo ease-out; push-ins:
  // S-curve; sub-frame samples give the move its motion blur. The void is pure black (void masks, work/build_void.py).
  const AX = 0.49 * W, AY = 0.58 * H;
  let VM = null, VMS = []; // plate px -> screen for the current vcam frame (null on other shots); its motion-blur samples
  const EASE = { pull: (u) => (u >= 1 ? 1 : (1 - Math.pow(2, -10 * u)) / (1 - Math.pow(2, -10))), push: eio, lin: (u) => cl(u) };
  function camAt(c, tv) {
    let s = c.s0, dy = c.dy0 || 0, tl = c.t0 ?? 0;
    for (const m of c.moves || []) {
      const [mt, md, ms, mdy, me] = m;
      if (tv >= mt + md) { s = ms; dy = mdy ?? dy; tl = mt + md; continue; }
      if (tv >= mt) {
        const s1 = s * (1 + (c.drift || 0) * (mt - tl));
        const e = EASE[me || "push"](cl((tv - mt) / md));
        return { s: s1 * Math.pow(ms / s1, e), dy: lerp(dy, mdy ?? dy, e) };
      }
      break;
    }
    return { s: s * (1 + (c.drift || 0) * (tv - tl)), dy };
  }
  const camM = (c) => [c.s, 0, 0, c.s, AX - AX * c.s, AY - AY * c.s + c.dy * H];
  // the world under the camera: the extended studio, the feathered live plate, then the void made pure black: the
  // backdrop light left in the plate (void mask, work/build_void.py) and everything above the plate's top edge
  // (l4_ext2 continues the plate's top-centre glow upward)
  function vcWorld(X, M, ext, m, vm) {
    X.save(); U.setM(X, M);
    X.drawImage(ext, -3600, -2560, 9280, 5360);
    X.drawImage(m, 0, 0, 1920, 1080);
    if (vm) X.drawImage(vm, 0, 0, 1920, 1080);
    X.fillStyle = "#000"; X.fillRect(-3600, -2560, 9280, 2561);
    X.restore();
  }
  // crushDark(): X = X x (1 - B x (1 - K)): K keys the plate's luma (<= 12/255 -> 0, >= 22/255 -> 1), B is the band mask
  // drawn by band(ctx) (its alpha), so the backdrop glow left around his silhouette goes black and his own pixels stay.
  // X must be opaque and cw x ch device px.
  function crushDark(X, cw, ch, band) {
    const src = snap(X, "cr_src"), k = tmp("cr_k", cw, ch), g = tmp("cr_g", cw, ch);
    k.x.setTransform(1, 0, 0, 1, 0, 0); k.x.globalAlpha = 1; k.x.globalCompositeOperation = "copy";
    k.x.filter = "grayscale(1) brightness(7.5) contrast(3.4)"; k.x.drawImage(src, 0, 0); k.x.filter = "none";
    k.x.globalCompositeOperation = "difference"; k.x.fillStyle = "#ffffff"; k.x.fillRect(0, 0, cw, ch); // 1 - K
    k.x.globalCompositeOperation = "destination-in"; band(k.x); k.x.globalCompositeOperation = "source-over"; // alpha B
    g.x.setTransform(1, 0, 0, 1, 0, 0); g.x.globalAlpha = 1; g.x.filter = "none";
    g.x.globalCompositeOperation = "copy"; g.x.fillStyle = "#ffffff"; g.x.fillRect(0, 0, cw, ch);
    g.x.globalCompositeOperation = "difference"; g.x.drawImage(k, 0, 0); g.x.globalCompositeOperation = "source-over"; // 1 - B(1 - K)
    X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.filter = "none";
    X.globalCompositeOperation = "multiply"; X.drawImage(g, 0, 0); X.restore();
  }
  let ACC = null;
  RRC.hook("afterPlate", async (S) => {
    VM = null; VMS = [];
    if (!S.plate) return;
    const c = S.shot && S.shot.k_vcam;
    if (!c) { // L5 (medium) keeps a lit backdrop right of his head: band crush + void mask, through the shot's own camera
      if (S.shot && S.shot.clip === "L5" && S.M) {
        const vm = await im("l5_void.png"), bd = await im("l5_void_band.png"), pc = S.plateCanvas.x;
        crushDark(pc, pc.canvas.width, pc.canvas.height, (X) => { X.save(); U.setM(X, S.M); X.drawImage(bd, 0, 0, 1920, 1080); X.restore(); });
        pc.save(); U.setM(pc, S.M); pc.drawImage(vm, 0, 0, 1920, 1080); pc.restore();
      }
      return;
    }
    const pc = S.plateCanvas.x, cw = pc.canvas.width, ch = pc.canvas.height;
    const ext = await im("l4_ext2.jpg"), fea = await im("l4_feather2.png"), vm = await im("l4_void.png"), bd = await im("l4_void_band.png"); // l4_ext2: plate units x [-3600, 5680), y [-2560, 2800)
    const m = tmp("xwm", 1920, 1080);
    m.x.setTransform(1, 0, 0, 1, 0, 0);
    m.x.globalCompositeOperation = "copy"; m.x.drawImage(S.plate, 0, 0, 1920, 1080);
    crushDark(m.x, 1920, 1080, (X) => X.drawImage(bd, 0, 0, 1920, 1080));
    m.x.setTransform(1, 0, 0, 1, 0, 0);
    m.x.globalCompositeOperation = "destination-in"; m.x.drawImage(fea, 0, 0, 1920, 1080);
    m.x.globalCompositeOperation = "source-over";
    // motion blur: a 180-degree shutter (+-0.01 s), one sample per <= 1.5 px of frame-corner travel (3..48), averaged
    // exactly in float (8-bit running averages drift over many samples)
    const tv = S.t - P, c0 = camAt(c, tv), ca = camAt(c, tv - 0.01), cb = camAt(c, tv + 0.01);
    const disp = Math.abs(Math.log(cb.s / ca.s)) * 1160 + Math.abs(cb.dy - ca.dy) * H;
    const N = disp > 0.75 ? Math.min(48, Math.max(3, Math.ceil(disp / 1.5))) : 1;
    U.reset(pc);
    pc.fillStyle = "#000"; pc.fillRect(0, 0, W, H);
    if (N === 1) { vcWorld(pc, camM(c0), ext, m, vm); VMS = [camM(c0)]; }
    else {
      const sub = tmp("vcs", cw, ch), n4 = cw * ch * 4;
      if (!ACC || ACC.length !== n4) ACC = new Float32Array(n4);
      ACC.fill(0);
      for (let j = 0; j < N; j++) {
        const M = camM(camAt(c, tv - 0.01 + (0.02 * j) / (N - 1)));
        sub.x.setTransform(1, 0, 0, 1, 0, 0); sub.x.globalAlpha = 1; sub.x.globalCompositeOperation = "source-over";
        sub.x.fillStyle = "#000"; sub.x.fillRect(0, 0, cw, ch);
        vcWorld(sub.x, M, ext, m, vm);
        const d = sub.x.getImageData(0, 0, cw, ch).data;
        for (let i = 0; i < n4; i++) ACC[i] += d[i];
        VMS.push(M);
      }
      const out = pc.createImageData(cw, ch), od = out.data, k = 1 / N;
      for (let i = 0; i < n4; i++) od[i] = ACC[i] * k + 0.5;
      pc.putImageData(out, 0, 0);
    }
    VM = camM(c0);
  });
  // plate px -> screen px on the current vcam frame (identity when no vcam)
  const toScreen = (px, py) => (VM ? [VM[0] * px + VM[4], VM[3] * py + VM[5]] : [px, py]);
  // a point authored in SCREEN px at the extreme-wide framing (s .22, dy .03) -> plate px (so it rides any drift/move)
  const EW_S = 0.22, EW_DY = 0.03 * H;
  const ewP = (sx, sy) => [AX + (sx - AX) / EW_S, AY + (sy - AY - EW_DY) / EW_S];

  // ------------------------------------------------------------------ floor projection (from the L4 plate)
  // horizon A.y 626.4; stool feet at (960, 1004); 525 px/m at the stool. u = metres lateral (+ right), v = metres beyond
  // the stool (+ away). floorP(u, v) -> plate px.
  const floorP = (u, v) => { const z = Math.max(0.55, 3 + v); return [940.8 + (1575 * u + 57.6) / z, 626.4 + 1132.6 / z]; }; // near plane 3+v >= 0.55
  const FLOOR_C = [960, 1004]; // stool feet in L4 plate px
  // polygon of a floor circle of R metres around (cu, cv)
  function floorCircle(R, n = 64, cu = 0, cv = 0) {
    const out = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; out.push(floorP(cu + Math.cos(a) * R, cv + Math.sin(a) * R)); }
    return out;
  }
  // the stage pad: SELECT-tag silhouette on the floor, u -1..1, v -0.8..0.8, back-left and front-right corners cut 0.4 m
  function padPts(sc = 1) {
    const q = [[-0.6, 0.8], [1, 0.8], [1, -0.4], [0.6, -0.8], [-1, -0.8], [-1, 0.4]];
    return q.map(([u, v]) => floorP(u * sc, v * sc));
  }
  // ◢ marks on the floor: 0.14 m right triangles on a 0.6 m lattice (u -6..6, v -1.5..9); alpha(u, v) -> 0..1
  function floorTris(alpha, o = {}) {
    const list = [], s = o.s ?? 0.14, step = o.step ?? 0.6;
    for (let v0 = o.v0 ?? -1.5; v0 <= (o.v1 ?? 9); v0 += step) for (let u0 = o.u0 ?? -6; u0 <= (o.u1 ?? 6); u0 += step) {
      const a = alpha(u0, v0); if (a <= 0.01) continue;
      const p1 = floorP(u0, v0), p2 = floorP(u0 + s, v0), p3 = floorP(u0 + s, v0 + s);
      list.push([p1[0], p1[1], p2[0], p2[1], p3[0], p3[1], a]);
    }
    return { type: "tris", list, color: o.color || RED };
  }

  // ------------------------------------------------------------------ floor light
  // ONE call per frame. shapes (plate px, drawn through VM): ellipse {cx, cy, r, ry, color, a, core}, ring {cx, cy, r, w,
  // ry, color, a}, poly {pts, color, a}, line {pts, color, a, lw, u (dash progress), close}, tris {list, color},
  // ringq {R, w (m), color, a, segs, duty, u}, annulus {R, w (m), cu, cv, color, a} (crisp floorP ring).
  // Soft light (ellipse, ring and every non-red shape): glow x frame, added `gain` times. Crisp RED marks (annulus, poly,
  // line, tris, ringq) are decals, frame x (1 - a O) + RED x a O, with O the floor's own light (0 on the dark stool,
  // shoes and void, 1 on the lit floor): they read #E4002E (red added over the grey floor read pink) and stay occluded.
  // During camera moves every shape is drawn at the plate's motion-blur samples, so the marks blur with the floor.
  const CRISP = { annulus: 1, poly: 1, line: 1, tris: 1, ringq: 1 };
  const isRed = (c) => typeof c === "string" && c.toUpperCase() === RED;
  function flShapes(X, shapes, wN, white) {
    for (const s of shapes) {
      const colr = white ? "#ffffff" : s.color;
      X.globalAlpha = cl(s.a ?? 1) * wN;
      if (s.type === "ellipse") {
        const gr = X.createRadialGradient(s.cx, s.cy, 0, s.cx, s.cy, s.r);
        gr.addColorStop(0, colr); gr.addColorStop(s.core ?? 0.55, colr); gr.addColorStop(1, "rgba(0,0,0,0)");
        X.save(); X.translate(s.cx, s.cy); X.scale(1, s.ry ?? 0.24); X.translate(-s.cx, -s.cy);
        X.fillStyle = gr; X.beginPath(); X.arc(s.cx, s.cy, s.r, 0, Math.PI * 2); X.fill(); X.restore();
      } else if (s.type === "ring") {
        const w2 = (s.w ?? 30) * 0.5 + 14, r0 = Math.max(0, s.r - w2), r1 = s.r + w2;
        X.save(); X.translate(s.cx, s.cy); X.scale(1, s.ry ?? 0.24);
        const gr = X.createRadialGradient(0, 0, r0, 0, 0, r1);
        gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.5, colr); gr.addColorStop(1, "rgba(0,0,0,0)");
        X.fillStyle = gr; X.beginPath(); X.arc(0, 0, r1, 0, Math.PI * 2); X.arc(0, 0, r0, 0, Math.PI * 2, true); X.fill(); X.restore();
      } else if (s.type === "annulus") { // crisp floor ring: floorP polygons (64 pts), R +- w/2 metres around (cu, cv)
        const o1 = floorCircle(s.R + (s.w ?? 0.08) / 2, 64, s.cu ?? 0, s.cv ?? 0), i1 = floorCircle(Math.max(0.01, s.R - (s.w ?? 0.08) / 2), 64, s.cu ?? 0, s.cv ?? 0);
        X.fillStyle = colr; X.beginPath();
        o1.forEach((p, i) => (i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1]))); X.closePath();
        i1.forEach((p, i) => (i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1]))); X.closePath();
        X.fill("evenodd");
      } else if (s.type === "poly") {
        X.fillStyle = colr; X.beginPath(); s.pts.forEach((p, i) => (i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1]))); X.closePath(); X.fill();
      } else if (s.type === "line") {
        X.save(); X.strokeStyle = colr; X.lineWidth = s.lw ?? 18; X.lineJoin = "round"; X.lineCap = "round";
        if (s.u != null && s.u < 1) X.setLineDash([20000 * cl(s.u), 20000]);
        X.beginPath(); s.pts.forEach((p, i) => (i ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1]))); if (s.close) X.closePath(); X.stroke(); X.restore();
      } else if (s.type === "tris") {
        // batch by alpha bucket (6 bands)
        const B = [[], [], [], [], [], []];
        for (const q of s.list) B[Math.min(5, Math.floor(cl(q[6]) * 6))].push(q);
        X.fillStyle = colr;
        B.forEach((bk, bi) => {
          if (!bk.length) return;
          X.globalAlpha = cl((s.a ?? 1) * ((bi + 0.5) / 6)) * wN;
          X.beginPath(); for (const q of bk) { X.moveTo(q[0], q[1]); X.lineTo(q[2], q[3]); X.lineTo(q[4], q[5]); X.closePath(); }
          X.fill();
        });
      } else if (s.type === "ringq") {
        const n = s.segs ?? 24, duty = s.duty ?? 2 / 3, R = s.R, w = s.w ?? 0.05, u = s.u ?? 1;
        X.fillStyle = colr; X.beginPath();
        for (let i = 0; i < n; i++) {
          const a0 = (i / n) * Math.PI * 2 - Math.PI / 2, a1 = a0 + ((Math.PI * 2) / n) * duty;
          if (i / n >= u) break;
          const pts = [];
          for (let j = 0; j <= 4; j++) { const a = lerp(a0, a1, j / 4); pts.push(floorP(Math.cos(a) * (R + w / 2), Math.sin(a) * (R + w / 2))); }
          for (let j = 4; j >= 0; j--) { const a = lerp(a0, a1, j / 4); pts.push(floorP(Math.cos(a) * (R - w / 2), Math.sin(a) * (R - w / 2))); }
          pts.forEach((p, k2) => (k2 ? X.lineTo(p[0], p[1]) : X.moveTo(p[0], p[1]))); X.closePath();
        }
        X.fill();
      }
    }
  }
  // draw shapes once per sample matrix (equal weights, accumulated with "lighter" when there are several)
  function flSamples(X, Ms, shapes, white) {
    X.globalCompositeOperation = Ms.length > 1 ? "lighter" : "source-over";
    for (const M of Ms) { X.save(); U.setM(X, M); flShapes(X, shapes, 1 / Ms.length, white); X.restore(); }
    X.globalCompositeOperation = "source-over"; X.globalAlpha = 1;
  }
  function floorLight(x, S, shapes, gain) {
    const M0 = VM || S.M;
    if (!M0 || !shapes.length) return;
    const Ms = VM && VMS.length > 1 ? (VMS.length > 24 ? VMS.filter((_, i) => i % Math.ceil(VMS.length / 24) === 0) : VMS) : [M0];
    const soft = [], dec = [];
    for (const s of shapes) (CRISP[s.type] && isRed(s.color) ? dec : soft).push(s);
    const pw = x.canvas.width, ph = x.canvas.height;
    const sc = snap(x, "fl_src");
    if (soft.length) {
      const g = tmp("fl", pw, ph);
      g.x.setTransform(1, 0, 0, 1, 0, 0); g.x.globalAlpha = 1; g.x.filter = "none";
      g.x.globalCompositeOperation = "source-over"; g.x.fillStyle = "#000"; g.x.fillRect(0, 0, pw, ph);
      flSamples(g.x, Ms, soft, false);
      g.x.setTransform(1, 0, 0, 1, 0, 0);
      g.x.globalCompositeOperation = "multiply"; g.x.drawImage(sc, 0, 0);
      g.x.globalCompositeOperation = "source-over";
      x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = "lighter";
      let k = gain;
      while (k > 0.001) { x.globalAlpha = Math.min(1, k); x.drawImage(g, 0, 0); k -= 1; }
      x.restore();
    }
    if (dec.length) {
      // O = floor light from the frame's luma: 0 at <= 0.03, 1 at >= 0.12 (one affine filter, clamped)
      const o = tmp("fl_o", pw, ph);
      o.x.setTransform(1, 0, 0, 1, 0, 0); o.x.globalAlpha = 1; o.x.globalCompositeOperation = "copy";
      o.x.filter = "grayscale(1) brightness(6.6) contrast(1.67)"; o.x.drawImage(sc, 0, 0); o.x.filter = "none";
      // D = mark coverage (white, alpha a); C = a x O on black
      const d = tmp("fl_d", pw, ph);
      d.x.setTransform(1, 0, 0, 1, 0, 0); d.x.globalAlpha = 1; d.x.globalCompositeOperation = "source-over"; d.x.filter = "none";
      d.x.clearRect(0, 0, pw, ph);
      flSamples(d.x, Ms, dec, true);
      d.x.setTransform(1, 0, 0, 1, 0, 0);
      o.x.globalCompositeOperation = "destination-in"; o.x.drawImage(d, 0, 0); o.x.globalCompositeOperation = "source-over";
      const c = tmp("fl_c", pw, ph);
      c.x.setTransform(1, 0, 0, 1, 0, 0); c.x.globalAlpha = 1; c.x.filter = "none";
      c.x.globalCompositeOperation = "copy"; c.x.fillStyle = "#000"; c.x.fillRect(0, 0, pw, ph);
      c.x.globalCompositeOperation = "source-over"; c.x.drawImage(o, 0, 0);
      // K = 1 - C; frame x K, then + RED x C
      const k = tmp("fl_k", pw, ph);
      k.x.setTransform(1, 0, 0, 1, 0, 0); k.x.globalAlpha = 1; k.x.filter = "none";
      k.x.globalCompositeOperation = "copy"; k.x.fillStyle = "#ffffff"; k.x.fillRect(0, 0, pw, ph);
      k.x.globalCompositeOperation = "difference"; k.x.drawImage(c, 0, 0); k.x.globalCompositeOperation = "source-over";
      c.x.globalCompositeOperation = "multiply"; c.x.fillStyle = RED; c.x.fillRect(0, 0, pw, ph); c.x.globalCompositeOperation = "source-over";
      x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1;
      x.globalCompositeOperation = "multiply"; x.drawImage(k, 0, 0);
      x.globalCompositeOperation = "lighter"; x.drawImage(c, 0, 0);
      x.restore();
    }
  }
  // spill: card reflections outside the lit pool, additive WITHOUT the multiply. list: [{u, v, rx (m), color, a}]
  function spill(x, list) {
    if (!VM || !list.length) return;
    x.save(); U.setM(x, VM); x.globalCompositeOperation = "lighter";
    for (const s of list) {
      if ((s.a ?? 0) <= 0.003) continue;
      const [px, py] = floorP(s.u, s.v), r = (s.rx ?? 1.1) * 525 * (3 / (3 + s.v));
      const gr = x.createRadialGradient(px, py, 0, px, py, r);
      gr.addColorStop(0, rgba(s.color, s.a)); gr.addColorStop(1, rgba(s.color, 0));
      x.save(); x.translate(px, py); x.scale(1, 0.24); x.translate(-px, -py);
      x.fillStyle = gr; x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill(); x.restore();
    }
    x.restore();
  }
  // standard floor shapes
  const fPool = (a, color = "#ffffff", R = 2.2) => ({ type: "ellipse", cx: FLOOR_C[0], cy: FLOOR_C[1], r: 525 * R, ry: 0.24, color, a, core: 0.35 });
  // ripple: crisp floor ring r 0.3 -> R1 m over d s (quartOut), width 0.08 m, RED alpha .9 -> 0, plus a white ring 0.1 s
  // behind (.4). Stage pulse = fRipple(sh, t, t0, { R: 2.2, d: 0.8 }).
  function fRipple(sh, t, t0, o = {}) {
    const d = o.d ?? 0.9, R1 = o.R ?? 6;
    for (const [dt, col, a0] of [[0, o.color || RED, 0.9], [0.1, "#ffffff", 0.4]]) {
      const k = pr(t, t0 + dt, t0 + dt + d); if (k <= 0 || k >= 1) continue;
      const R = lerp(0.3, R1, e4(k));
      sh.push({ type: "annulus", R, w: o.w ?? 0.08, color: col, a: a0 * (1 - k) * (o.a ?? 1) });
    }
  }

  // ------------------------------------------------------------------ scene groups register here (see 90_main.js)
  const GROUPS = [];
