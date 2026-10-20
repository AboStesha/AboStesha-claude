
  // ================================================================== MAIN: routing, subtitles, bug, wipe, specials
  // Each group file pushes { name, floor(t, sh, S), draw(x, t, S), title(x, t, S), broll(x, t, S, id), end(x, t, S),
  // cover(x, S) } into GROUPS; only the members a group needs are present.
  // SUBS (k_t.subs, from edl_build.py): [start, end, text, hardIn, hardOut] in OUTPUT seconds. A boundary within
  // 0.12-0.16 s of a picture cut is snapped onto it and switches hard on the cut (nothing half-faded across a cut);
  // otherwise 0.11 s fade in (from start - 0.05) and 0.1 s fade out (ending at end).
  function subtitles(x, t) {
    if (NO_SUBS) return;
    let c = null;
    for (const sp of SUBS) if (t >= (sp[3] ? sp[0] : sp[0] - 0.05) && t < sp[1]) { c = sp; break; }
    if (!c) return;
    const [s, end, text, hin, hout] = c;
    const a = (hin ? 1 : e2(pr(t, s - 0.05, s + 0.06))) * (hout ? 1 : 1 - e2(pr(t, end - 0.1, end)));
    if (a <= 0.003) return;
    x.save();
    font(x, 500, 36, AR);
    x.direction = "rtl";
    const w = x.measureText(text).width + 56;
    x.globalAlpha = a;
    x.fillStyle = "rgba(6,7,9,0.62)";
    rr(x, 960 - w / 2, 1012 - 30, w, 60, 14); x.fill();
    x.restore();
    txt(x, text, 960, 1013, { w: 500, size: 36, alpha: a, shadow: false }); // no shadows on type (brand); the pill carries the contrast
  }
  // bug: the official lockup 160 px wide at x 80-240, y 60-95 (inside the safe area, as on pages 4-5), alpha .85, on every
  // presenter shot VO 4.40-110.88, switching with the cuts
  async function bug(x, t, S) {
    if (t < v(4.40) || t >= v(110.88)) return;
    await logo(x, 80 + 80, 60 + 17.5, 160, 0.85);
  }
  // chamfer wipe into the end card: a #000 panel enters from the right with a '/' edge (logo slant) and a 3 px red line
  // over VO 110.36-110.88 (inOutCubic, 13 frames) and covers the frame on the music change at VO 110.88 (output 113.88);
  // V's graphics hold at full opacity under it. The whole slanted edge starts off-screen right and clears the top-left
  // corner (the last part covered) at t1.
  function endWipe(x, t) {
    const t1 = v(110.88), t0 = v(110.36);
    if (t < t0 || t > t1 + 0.04) return;
    const u = eio(pr(t, t0, t1)), sl = 0.82, x0 = W + 30 + sl * (H + 20), xe = x0 - u * (x0 + 10); // x of the edge at the top
    x.save();
    x.fillStyle = "#000000"; x.beginPath(); x.moveTo(xe, -10); x.lineTo(W + 20, -10); x.lineTo(W + 20, H + 10); x.lineTo(xe - sl * (H + 20), H + 10); x.closePath(); x.fill();
    x.strokeStyle = RED; x.lineWidth = 3; x.beginPath(); x.moveTo(xe, -10); x.lineTo(xe - sl * (H + 20), H + 10); x.stroke();
    x.restore();
  }
  async function drawAll(x, t, S) {
    const vc = S.shot && S.shot.k_vcam;
    if (vc) {
      const sh = [];
      for (const g of GROUPS) if (g.floor) g.floor(t, sh, S);
      if (sh.length) floorLight(x, S, sh, 1.8);
    }
    if (NO_TEXT) return;
    for (const g of GROUPS) if (g.draw) { await g.draw(x, t, S); U.reset(x); x.direction = "ltr"; } // U.reset() keeps ctx.direction
  }
  RRC.hook("after_post", async (S, x) => {
    U.reset(x);
    const t = S.t, sh = S.shot || {};
    if (COVER) { for (const g of GROUPS) if (g.cover) await g.cover(x, S); U.reset(x); return; }
    if (sh.k_title) { for (const g of GROUPS) if (g.title) await g.title(x, t, S); U.reset(x); return; }
    if (sh.k_end) { for (const g of GROUPS) if (g.end) await g.end(x, t, S); U.reset(x); return; }
    if (sh.k_broll) {
      for (const g of GROUPS) if (g.broll) await g.broll(x, t, S, sh.k_broll);
      U.reset(x); subtitles(x, t); U.reset(x); return;
    }
    await drawAll(x, t, S);
    U.reset(x);
    if (!NO_TEXT) await bug(x, t, S);
    U.reset(x);
    subtitles(x, t);
    U.reset(x);
    endWipe(x, t);
    U.reset(x);
  });
  RRC.register("SPECIALS", "k_card", {
    allow: [],
    draw(S, p, x) { x.fillStyle = "#000000"; x.fillRect(0, 0, S.W, S.H); }, // = the graded studio void after the look
  });
})();
