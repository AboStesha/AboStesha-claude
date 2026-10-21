// Tiny isometric voxel renderer -> SVG. Painter's order by x+y+z, hidden faces culled.
(function (g) {
  const C30 = Math.cos(Math.PI / 6);

  function hex2rgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
  }
  function rgb2hex(r) {
    return '#' + r.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  }
  function shade(h, f) { return rgb2hex(hex2rgb(h).map(v => v * f)); }
  function mix(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(A.map((v, i) => v + (B[i] - v) * t)); }

  class Model {
    constructor() { this.v = new Map(); }
    k(x, y, z) { return x + ',' + y + ',' + z; }
    set(x, y, z, c, e) {
      if (c == null) { this.v.delete(this.k(x, y, z)); return this; }
      this.v.set(this.k(x, y, z), { x, y, z, c, e: !!e });
      return this;
    }
    get(x, y, z) { return this.v.get(this.k(x, y, z)); }
    has(x, y, z) { return this.v.has(this.k(x, y, z)); }
    // box from (x,y,z) with size (w,d,h); c may be a function (x,y,z)=>color
    box(x, y, z, w, d, h, c, e) {
      for (let i = x; i < x + w; i++) for (let j = y; j < y + d; j++) for (let k = z; k < z + h; k++) {
        const col = typeof c === 'function' ? c(i, j, k) : c;
        this.set(i, j, k, col, e);
      }
      return this;
    }
    clear(x, y, z, w, d, h) { return this.box(x, y, z, w, d, h, null); }
    add(m, dx = 0, dy = 0, dz = 0) {
      for (const p of m.v.values()) this.set(p.x + dx, p.y + dy, p.z + dz, p.c, p.e);
      return this;
    }
    // rotate around z by 90deg * n (counter-clockwise when viewed from above), re-normalised to >= 0
    rot(n = 1) {
      n = ((n % 4) + 4) % 4;
      const out = new Model();
      let pts = [...this.v.values()];
      for (const p of pts) {
        let x = p.x, y = p.y;
        for (let i = 0; i < n; i++) { const t = x; x = -y; y = t; }
        out.set(x, y, p.z, p.c, p.e);
      }
      const minx = Math.min(...[...out.v.values()].map(p => p.x));
      const miny = Math.min(...[...out.v.values()].map(p => p.y));
      const res = new Model();
      for (const p of out.v.values()) res.set(p.x - minx, p.y - miny, p.z, p.c, p.e);
      return res;
    }
    mirrorX() {
      const maxx = Math.max(...[...this.v.values()].map(p => p.x));
      const res = new Model();
      for (const p of this.v.values()) res.set(maxx - p.x, p.y, p.z, p.c, p.e);
      return res;
    }
  }

  // render model to an SVG <g> string. opts: s (voxel size px), shadow (bool), floorZ
  function render(model, opts = {}) {
    const s = opts.s || 10;
    const lt = opts.light || { top: 1.0, left: 0.80, right: 0.62 };
    const P = (x, y, z) => [(x - y) * s * C30, (x + y) * s * 0.5 - z * s];
    const pts = [...model.v.values()];
    // drop shadows on top faces: cells covered by something above (offset toward +x+y light)
    const cover = new Map();
    if (opts.shadow !== false) {
      for (const p of pts) {
        const key = p.x + ',' + p.y;
        const prev = cover.get(key);
        if (prev === undefined || p.z > prev) cover.set(key, p.z);
      }
    }
    pts.sort((a, b) => (a.x + a.y + a.z) - (b.x + b.y + b.z) || a.z - b.z);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const polys = [];
    const f = a => a.map(p => p[0].toFixed(2) + ',' + p[1].toFixed(2)).join(' ');
    for (const p of pts) {
      const { x, y, z, c, e } = p;
      const faces = [];
      if (!model.has(x, y, z + 1)) {
        let col = e ? c : shade(c, lt.top);
        // simple contact shadow: something stands 1..6 voxels above a neighbour cell
        if (!e && opts.shadow !== false) {
          let sh = 0;
          for (const [dx, dy] of [[0, 0], [-1, 0], [0, -1], [-1, -1]]) {
            const top = cover.get((x + dx) + ',' + (y + dy));
            if (top !== undefined && top > z + 1 && top - z < 30) sh++;
          }
          if (sh) col = shade(col, 1 - 0.07 * sh);
        }
        faces.push([[P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], col]);
      }
      if (!model.has(x + 1, y, z)) faces.push([[P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)], e ? shade(c, 0.9) : shade(c, lt.right)]);
      if (!model.has(x, y + 1, z)) faces.push([[P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], e ? shade(c, 0.97) : shade(c, lt.left)]);
      for (const [poly, col] of faces) {
        for (const q of poly) { minX = Math.min(minX, q[0]); maxX = Math.max(maxX, q[0]); minY = Math.min(minY, q[1]); maxY = Math.max(maxY, q[1]); }
        polys.push(`<polygon points="${f(poly)}" fill="${col}" stroke="${col}" stroke-width="0.7" stroke-linejoin="round"/>`);
      }
    }
    return { body: polys.join(''), bbox: { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY }, P };
  }

  // Convenience: produce a full <svg> sized to content with padding
  function svg(model, opts = {}) {
    const r = render(model, opts);
    const pad = opts.pad == null ? 10 : opts.pad;
    const { minX, minY, w, h } = r.bbox;
    const vb = `${(minX - pad).toFixed(1)} ${(minY - pad).toFixed(1)} ${(w + 2 * pad).toFixed(1)} ${(h + 2 * pad).toFixed(1)}`;
    const extra = opts.overlay ? opts.overlay(r.P) : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" preserveAspectRatio="xMidYMid meet" style="overflow:visible">${r.body}${extra}</svg>`;
  }

  g.Vox = { Model, render, svg, shade, mix };
})(window);
