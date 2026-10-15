// STYLE C — «Light»: the nib is a light bulb and the candle is its filament.
// Darkness; the red tip sparks; the candle filament flickers on; the bulb glows and blooms while the room brightens
// into the brand gradient (light rays, floating dust); the glow condenses into the crisp mark and two beams of light
// spread from the nib to reveal «axi» and «ACADEMY»; one last glint.
(function () {
  const { clamp, lerp, inv, smooth, cubicInOut, spring, eo, co, cio, qo, rng, noise } = K;
  const { NIB, NIB_OUTER, SLOT, TRI, BARS, AXI, ACAD, AXI_BOX, ACAD_BOX, AX, YT, YB, LK, CX, CY } = K;
  const WHITE = K.WHITE, RED = K.RED;
  const APX = LK.tri.apex_y, NIBC = (YT + YB) / 2;

  // ---- timeline ----
  const T_SPARK = 0.12, T_FIL = 0.52, T_GLASS = 0.9, T_BLOOM = 1.2, T_PEAK = 1.62, T_SOLID = 1.85, T_BARS = 1.95, T_BEAM = 2.2, T_GLINT = 3.38, T_END = 3.9;
  const CAM = [
    [0.0, 2.35, AX, APX + 36, 0, 40],
    [0.9, 2.05, AX, YT + 70, 0, 20],
    [1.8, 1.42, AX, NIBC, 0, 0],
    [2.7, 1.08, CX - 30, CY, 0, 0],
    [3.7, 1.0, CX, CY, 0, 0],
  ];
  // flicker envelope for the spark and the filament (deterministic)
  const flick = (t, t0, pattern) => { const d = t - t0; if (d < 0) return 0; for (const [a, b, v] of pattern) if (d >= a && d < b) return v; return 1; };
  const SPARK = [[0, 0.05, 1], [0.05, 0.11, 0.08], [0.11, 0.15, 0.85], [0.15, 0.22, 0.12], [0.22, 0.26, 1], [0.26, 0.3, 0.35]];
  const FIL = [[0, 0.04, 0.9], [0.04, 0.09, 0.1], [0.09, 0.16, 0.75], [0.16, 0.2, 0.05], [0.2, 0.24, 1], [0.24, 0.28, 0.3], [0.28, 0.36, 0.95], [0.36, 0.39, 0.45]];
  const DUST = (() => { const r = rng(33), o = []; for (let i = 0; i < 70; i++) o.push({ x: AX + (r() - 0.5) * 1500, y: NIBC + (r() - 0.5) * 760, z: 0.4 + r() * 1.2, r: 0.8 + r() * 2.2, ph: r() * 10, sp: 6 + r() * 14 }); return o; })();

  function lightLevel(t) {  // overall "power" of the bulb: 0 → 1 (peak) → 0.25 (steady)
    if (t < T_BLOOM) return 0;
    if (t < T_PEAK) return smooth(inv(T_BLOOM, T_PEAK, t));
    return lerp(1, 0, smooth(inv(T_PEAK, T_PEAK + 0.78, t)));
  }

  function scene(ctx, t, sil, m) {
    const col = (c) => (sil ? '#000' : c);
    const solid = smooth(inv(T_BLOOM + 0.1, T_SOLID, t));  // nib body opacity
    // god rays (behind everything)
    const L = lightLevel(t);
    if (!sil && L > 0.01) {
      K.glow(ctx, m, (c) => {
        c.save(); c.translate(AX, NIBC); c.rotate(t * 0.12);
        for (let i = 0; i < 28; i++) {
          const a = (i / 28) * Math.PI * 2 + noise(i * 3.1, 2) * 0.08, w = 0.018 + 0.03 * (0.5 + 0.5 * noise(i * 1.7 + t * 0.8, 5));
          c.globalAlpha = 0.5 + 0.5 * noise(i * 2.3 + t * 1.3, 7); c.fillStyle = '#EAF2FF';
          c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a - w) * 1500, Math.sin(a - w) * 1500); c.lineTo(Math.cos(a + w) * 1500, Math.sin(a + w) * 1500); c.closePath(); c.fill();
        }
        c.restore();
      }, 26, 0.33 * L);
    }
    // nib body (solid white once condensed)
    if (solid > 0) { ctx.save(); ctx.globalAlpha *= solid; ctx.fillStyle = col(WHITE); ctx.fill(NIB); ctx.restore(); }
    // glass outline of the bulb + bars outlines
    if (!sil) {
      const g = smooth(inv(T_GLASS, T_GLASS + 0.4, t)) * (1 - smooth(inv(T_SOLID - 0.1, T_SOLID + 0.25, t)));
      if (g > 0) {
        ctx.save(); ctx.globalAlpha *= 0.55 * g; ctx.strokeStyle = '#F4F8FF'; ctx.lineWidth = 1.6; ctx.shadowColor = 'rgba(210,230,255,0.9)'; ctx.shadowBlur = 12;
        ctx.stroke(NIB_OUTER); BARS.forEach((b) => ctx.stroke(b)); ctx.restore();
      }
    }
    // filament = the candle slot, glowing then fading into the cut-out
    if (!sil && t >= T_FIL) {
      const draw = clamp((t - T_FIL) / 0.22), fl = flick(t, T_FIL + 0.22, FIL) * (draw < 1 ? 1 : 1);
      const fade = 1 - smooth(inv(T_SOLID - 0.05, T_SOLID + 0.35, t));
      const a = (draw < 1 ? 0.9 : fl) * fade;
      if (a > 0.01) {
        ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2.2; ctx.lineJoin = 'round';
        ctx.shadowColor = 'rgba(255,240,215,1)'; ctx.shadowBlur = 22;
        const reveal = (c) => { if (draw < 1) { c.beginPath(); c.rect(AX - 40, YT - 5, 80, (LK.slot.cap_cy + 12 - YT) * draw + 5); c.clip(); } };
        reveal(ctx); ctx.stroke(SLOT); ctx.stroke(SLOT); ctx.restore();
        K.glow(ctx, m, (c) => { c.save(); reveal(c); c.strokeStyle = '#FFF2DA'; c.lineWidth = 7; c.stroke(SLOT); c.restore(); }, 18, 0.9 * a);
      }
    }
    // bulb bloom: the light fills the glass, overexposed around the peak
    if (!sil && L > 0.01) {
      K.glow(ctx, m, (c) => { c.fillStyle = '#FFFFFF'; c.fill(NIB); }, 60, 0.7 * L);
      K.glow(ctx, m, (c) => { c.fillStyle = '#FFFFFF'; c.fill(NIB); }, 16, 0.6 * L);
    }
    // bars: fill in, then a specular glint runs across them
    LK.bars.forEach((b, i) => {
      const u = smooth(inv(T_BARS + i * 0.08, T_BARS + i * 0.08 + 0.3, t)); if (u <= 0) return;
      ctx.save(); ctx.globalAlpha *= u; ctx.fillStyle = col(WHITE); ctx.fill(BARS[i]); ctx.restore();
    });
    // the red tip: a spark that flickers, then a steady glowing tip that cools down
    if (t >= T_SPARK) {
      const f = flick(t, T_SPARK, SPARK), s = 0.35 + 0.65 * smooth(inv(T_SPARK, T_SPARK + 0.35, t));
      ctx.save(); ctx.globalAlpha *= sil ? smooth(inv(T_SPARK, T_SPARK + 0.3, t)) : f; ctx.translate(AX, YT - 14); ctx.scale(s, s); ctx.translate(-AX, -(YT - 14));
      ctx.fillStyle = col(RED); ctx.fill(TRI); ctx.restore();
      if (!sil) {
        const hot = f * (1 - smooth(inv(1.0, 2.4, t)));
        if (hot > 0.01) K.glow(ctx, m, (c) => { c.fillStyle = '#FF3A44'; c.fill(TRI); c.fillStyle = '#FFFFFF'; c.beginPath(); c.arc(AX, YT - 14, 5, 0, Math.PI * 2); c.fill(); }, 20, 0.95 * hot);
      }
    }
    // beams of light reveal the words
    const bl = cio(t, T_BEAM, 0.75), br = cio(t, T_BEAM + 0.06, 0.8);
    const xl = lerp(AX - 118, AXI_BOX[0] - 30, bl), xr = lerp(AX + 118, ACAD_BOX[2] + 30, br);
    if (bl > 0) { ctx.save(); K.clipRect(ctx, xl, -3000, AX - 60, 5000); for (let i = 0; i < 3; i++) K.fillAxi(ctx, i, col(WHITE)); ctx.restore(); }
    if (br > 0) { ctx.save(); K.clipRect(ctx, AX + 60, -3000, xr, 5000); ACAD.forEach((_, i) => K.fillAcad(ctx, i, 1, col(WHITE))); ctx.restore(); }
    if (!sil) {
      // fresh light on the just-revealed letters, and anamorphic streaks at the beam heads
      [[bl, xl, -1, T_BEAM], [br, xr, 1, T_BEAM + 0.06]].forEach(([u, x, side, t0]) => {
        if (u <= 0 || t > t0 + 1.4) return;
        const a = Math.sin(Math.PI * clamp(u)) * (1 - inv(t0 + 0.75, t0 + 1.2, t));
        K.glow(ctx, m, (c) => {
          c.save(); if (side < 0) K.clipRect(c, x, -3000, x + 260, 5000); else K.clipRect(c, x - 260, -3000, x, 5000);
          c.fillStyle = '#FFFFFF'; if (side < 0) { for (let i = 0; i < 3; i++) c.fill(AXI[i].path, 'evenodd'); } else ACAD.forEach((_, i) => K.fillAcad(c, i, 1, '#FFFFFF'));
          c.restore();
        }, 14, 0.9 * a);
        if (a > 0.01) {
          const y = side < 0 ? (AXI_BOX[1] + AXI_BOX[3]) / 2 + 20 : (ACAD_BOX[1] + ACAD_BOX[3]) / 2;
          ctx.save(); ctx.globalAlpha *= 0.85 * a; ctx.globalCompositeOperation = 'lighter';
          const g = ctx.createLinearGradient(x - 340, 0, x + 340, 0); g.addColorStop(0, 'rgba(200,225,255,0)'); g.addColorStop(0.5, 'rgba(235,245,255,1)'); g.addColorStop(1, 'rgba(200,225,255,0)');
          ctx.fillStyle = g; ctx.fillRect(x - 340, y - 1.6, 680, 3.2);
          ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.beginPath(); ctx.ellipse(x, y, 14, 9, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
      });
      // dust in the light
      const dl = smooth(inv(T_GLASS, T_PEAK, t)) * (1 - smooth(inv(2.6, 3.7, t)));
      if (dl > 0.01) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = '#FFFFFF';
        DUST.forEach((d) => {
          const x = d.x + noise(t * 0.4 + d.ph, 1) * 30 * d.z, y = d.y - t * d.sp * d.z + noise(t * 0.5 + d.ph, 2) * 20;
          const a = dl * (0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 3 + d.ph))) * (1 - Math.min(1, Math.hypot(x - AX, (y - NIBC) * 1.6) / 900));
          if (a <= 0) return; ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(x, y, d.r * d.z, 0, Math.PI * 2); ctx.fill();
        });
        ctx.restore();
      }
      // last glint on the tip
      const u = inv(T_GLINT, T_GLINT + 0.45, t);
      if (u > 0 && u < 1) {
        const k = Math.sin(Math.PI * u), x = AX, y = APX + 3;
        ctx.save(); ctx.globalAlpha *= 0.95 * k; ctx.fillStyle = WHITE; ctx.shadowColor = 'rgba(255,255,255,0.95)'; ctx.shadowBlur = 12;
        ctx.translate(x, y); ctx.rotate(0.12 + u * 0.5);
        ctx.beginPath(); ctx.ellipse(0, 0, 62 * k, 1.7, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(0, 0, 1.7, 34 * k, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(0, 0, 3.4 * k, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    }
  }

  window.FILM = {
    duration: 5,
    blur(t) {
      if (t < 0.5) return 3;
      if (t < 2.1) return 5;
      if (t < 3.15) return 8;
      if (t < T_END) return 3;
      return 1;
    },
    draw(ctx, t) {
      // darkness → the room brightens into the brand gradient as the bulb blooms
      K.vgrad(ctx, '#0B0C0E', '#050606');
      const day = smooth(inv(T_BLOOM + 0.05, T_SOLID + 0.25, t));
      if (day > 0) K.bg(ctx, day);
      const cam = K.track(t, CAM);
      const m = K.stage(ctx, cam);
      const k = smooth(inv(T_SOLID, 3.3, t));
      if (k > 0) K.shadow(ctx, m, (c) => scene(c, t, true, m), k);
      K.stage(ctx, cam);
      scene(ctx, t, false, m);
      K.grain(ctx, t, t < T_BLOOM ? 0.06 : 0.035, t >= T_END);
    },
  };
})();
