(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const IMG = window.IMG || {};
  const D = window.DATA || {};
  const W = 1600, H = 900;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const AR = '٠١٢٣٤٥٦٧٨٩';
  const toAr = s => String(s).replace(/\d/g, d => AR[d]);

  /* ---------- Images ---------- */
  $$('img[data-img]').forEach(img => { const k = img.dataset.img; if (IMG[k]) img.src = IMG[k]; img.decoding = 'async'; img.draggable = false; });

  const stage = $('.stage');
  const slides = $$('.slide');
  const bgsEl = $('.bgs');
  let idx = 0, mode = null;

  /* ---------- Full-bleed background layer (one per slide) ---------- */
  const bgEls = slides.map(s => {
    const k = s.dataset.bg;
    const el = document.createElement('div');
    el.className = 'bg' + (k ? '' : ' plain');
    el.dataset.veil = s.dataset.veil || 'side';
    if (k && IMG[k]) { const im = new Image(); im.src = IMG[k]; im.alt = ''; im.draggable = false; el.appendChild(im); }
    bgsEl.appendChild(el);
    return el;
  });

  function setScrollBgs(on) {
    slides.forEach(s => {
      const k = s.dataset.bg;
      let sb = $(':scope > .sbg', s);
      // slides whose own frame swaps images (Vortex tabs) show that frame instead of a static cover
      if (on && k && IMG[k] && !sb && !$('.frame', s)) {
        sb = document.createElement('div'); sb.className = 'sbg';
        const im = new Image(); im.src = IMG[k]; im.alt = ''; im.loading = 'lazy'; sb.appendChild(im);
        s.prepend(sb);
      }
      if (!on && sb) sb.remove();
    });
  }

  /* ---------- Mode & fit ---------- */
  function pickMode() { return innerWidth >= 900 && innerHeight >= 500 ? 'deck' : 'scroll'; }
  function fit() { stage.style.setProperty('--s', Math.min(innerWidth / W, innerHeight / H)); }
  function setMode(m) {
    if (m === mode) return;
    mode = m;
    document.body.classList.toggle('is-deck', m === 'deck');
    document.body.classList.toggle('is-scroll', m === 'scroll');
    setScrollBgs(m === 'scroll');
    if (m === 'scroll') slides.forEach(s => { s.classList.add('is-active'); enter(s); });
    else { slides.forEach((s, i) => s.classList.toggle('is-active', i === idx)); enter(slides[idx]); }
  }
  addEventListener('resize', () => { fit(); setMode(pickMode()); });

  /* ---------- Chrome: rail, counter, chapter label, index overlay ---------- */
  const rail = $('.rail'), toc = $('.toc'), tocGrid = $('.toc-grid'), countEl = $('.count'), prog = $('.progress i'), chapLbl = $('.chapter');
  const chapters = [];
  slides.forEach((s, i) => {
    const c = s.dataset.chapter;
    let ch = chapters.find(x => x.name === c);
    if (!ch) { ch = { name: c, items: [] }; chapters.push(ch); }
    ch.items.push(i);
    const b = document.createElement('button');
    b.type = 'button'; b.title = s.dataset.title; b.setAttribute('aria-label', s.dataset.title);
    if (ch.items.length === 1 && i > 0) b.classList.add('is-chap');
    b.addEventListener('click', () => go(i));
    rail.appendChild(b);
  });
  slides.forEach((s, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'toc-item';
    const k = s.dataset.bg || s.dataset.thumb;
    b.innerHTML = `<span class="th">${k && IMG[k] ? `<img src="${IMG[k]}" alt="">` : ''}</span><span class="n">${toAr(String(i + 1).padStart(2, '0'))}</span><span class="t">${s.dataset.title}</span>`;
    b.addEventListener('click', () => { closeToc(); go(i); });
    tocGrid.appendChild(b);
  });
  function openToc() { toc.classList.add('is-open'); $$('.toc-item').forEach((b, i) => b.classList.toggle('is-on', i === idx)); }
  function closeToc() { toc.classList.remove('is-open'); }
  $('[data-act="toc"]').addEventListener('click', openToc);
  $('[data-act="toc-close"]').addEventListener('click', closeToc);
  $('.brand').addEventListener('click', () => go(0));
  $('[data-act="next"]').addEventListener('click', () => go(idx + 1));
  $('[data-act="prev"]').addEventListener('click', () => go(idx - 1));
  $$('[data-go]').forEach(b => b.addEventListener('click', () => { const t = document.getElementById(b.dataset.go); if (t) go(slides.indexOf(t)); }));

  function chrome() {
    $$('button', rail).forEach((b, i) => b.classList.toggle('is-on', i === idx));
    countEl.innerHTML = `<b>${toAr(String(idx + 1).padStart(2, '0'))}</b><i></i>${toAr(slides.length)}`;
    prog.style.width = ((idx + 1) / slides.length * 100) + '%';
    const s = slides[idx];
    const ci = chapters.findIndex(c => c.name === s.dataset.chapter);
    chapLbl.innerHTML = `<span>${toAr(String(ci + 1).padStart(2, '0'))}</span>${s.dataset.chapter}`;
    document.body.dataset.tone = s.dataset.tone || 'blue';
  }

  /* ---------- Navigation ---------- */
  const hooks = {};
  function enter(s) { const h = hooks[s.id]; if (h && h.enter) h.enter(s); }
  function leave(s) { const h = hooks[s.id]; if (h && h.leave) h.leave(s); }

  function go(n, force) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    if (mode === 'scroll') { slides[n].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); return; }
    if (n === idx && !force) return;
    const prev = slides[idx];
    const dir = n > idx ? 1 : -1;
    document.body.dataset.dir = dir > 0 ? 'fwd' : 'back';
    if (prev !== slides[n]) { leave(prev); prev.classList.remove('is-active'); prev.classList.add('is-leaving'); setTimeout(() => prev.classList.remove('is-leaving'), 900); }
    idx = n;
    slides[idx].classList.add('is-active');
    bgEls.forEach((b, i) => b.classList.toggle('is-on', i === idx));
    chrome();
    enter(slides[idx]);
    particles.toggle(!!slides[idx].dataset.particles);
    try { history.replaceState(null, '', '#' + slides[idx].id); } catch (e) { /* sandboxed */ }
  }

  addEventListener('keydown', e => {
    if (e.target.closest('input, textarea, select, [contenteditable]')) return;
    const k = e.key;
    if (toc.classList.contains('is-open')) { if (k === 'Escape' || k === 'o' || k === 'O') closeToc(); return; }
    if (mode !== 'deck') return;
    /* PowerPoint convention (also what presentation clickers send): Right/Down/PageDown = next */
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) { if (k === 'Enter' && e.target.closest('button, a')) return; e.preventDefault(); go(idx + 1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); go(idx - 1); }
    else if (k === 'Home') go(0);
    else if (k === 'End') go(slides.length - 1);
    else if (k === 'o' || k === 'O' || k === 'g' || k === 'G') openToc();
    else if (k === 'f' || k === 'F') { const el = document.documentElement; if (!document.fullscreenElement) { el.requestFullscreen && el.requestFullscreen().catch(() => {}); } else { document.exitFullscreen && document.exitFullscreen().catch(() => {}); } }
  });

  let wheelLock = false, wheelTimer = 0, acc = 0;
  addEventListener('wheel', e => {
    if (mode !== 'deck' || toc.classList.contains('is-open')) return;
    e.preventDefault();
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { wheelLock = false; acc = 0; }, 170);
    if (wheelLock) return;
    acc += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : -e.deltaX;
    if (Math.abs(acc) > 38) { go(idx + (acc > 0 ? 1 : -1)); wheelLock = true; acc = 0; }
  }, { passive: false });

  let tx = 0, ty = 0, tt = 0;
  addEventListener('touchstart', e => { const t = e.touches[0]; tx = t.clientX; ty = t.clientY; tt = Date.now(); }, { passive: true });
  addEventListener('touchend', e => {
    if (mode !== 'deck') return;
    const t = e.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty;
    if (Date.now() - tt > 700) return;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) go(idx + (dx > 0 ? 1 : -1)); /* RTL: swipe right = next */
    else if (Math.abs(dy) > 60) go(idx + (dy < 0 ? 1 : -1));
  }, { passive: true });

  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => {
    es.forEach(en => { if (en.isIntersecting && mode === 'scroll') { idx = slides.indexOf(en.target); prog.style.width = ((idx + 1) / slides.length * 100) + '%'; } });
  }, { threshold: .35 }) : null;
  if (io) slides.forEach(s => io.observe(s));

  let idleT = 0;
  function wake() { document.body.classList.remove('is-idle'); clearTimeout(idleT); idleT = setTimeout(() => { if (mode === 'deck') document.body.classList.add('is-idle'); }, 3000); }
  addEventListener('pointermove', wake, { passive: true });
  addEventListener('keydown', wake);
  setTimeout(() => { const h = $('.hint'); if (h) h.classList.add('is-gone'); }, 8000);

  /* ---------- Pointer: parallax, spotlight, cursor, tilt, magnetic ---------- */
  const ptr = { x: innerWidth / 2, y: innerHeight / 2, nx: 0, ny: 0, sx: 0, sy: 0 };
  addEventListener('pointermove', e => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.nx = e.clientX / innerWidth * 2 - 1; ptr.ny = e.clientY / innerHeight * 2 - 1; }, { passive: true });

  const cur = $('.cursor'), dot = $('.cursor-dot'), glow = $('.glow');
  let cx = ptr.x, cy = ptr.y, gx = ptr.x, gy = ptr.y;
  if (fine && !reduce) {
    document.addEventListener('pointerover', e => { const hot = e.target.closest('button, a, [data-hot], .card, .tile, .zone-row'); cur.classList.toggle('is-hot', !!hot); });
    addEventListener('pointermove', () => { cur.classList.add('is-on'); dot.classList.add('is-on'); }, { once: true });
    document.addEventListener('pointerleave', () => { cur.classList.remove('is-on'); dot.classList.remove('is-on'); });
  }
  $$('[data-tilt]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--rx', ((.5 - y) * 7) + 'deg'); el.style.setProperty('--ry', ((x - .5) * 9) + 'deg');
      el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%');
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
  });
  $$('[data-magnetic]').forEach(el => {
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`; });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });

  function frame() {
    ptr.sx += (ptr.nx - ptr.sx) * .06; ptr.sy += (ptr.ny - ptr.sy) * .06;
    if (mode === 'deck' && !reduce) {
      const b = bgEls[idx].firstChild;
      if (b) b.style.translate = `${ptr.sx * -18}px ${ptr.sy * -12}px`;
      $$('[data-depth]', slides[idx]).forEach(el => { const d = +el.dataset.depth || 1; el.style.setProperty('--px', (ptr.sx * -14 * d) + 'px'); el.style.setProperty('--py', (ptr.sy * -10 * d) + 'px'); });
    }
    if (fine && !reduce) {
      cx += (ptr.x - cx) * .2; cy += (ptr.y - cy) * .2; gx += (ptr.x - gx) * .08; gy += (ptr.y - gy) * .08;
      cur.style.transform = `translate(${cx}px, ${cy}px)`; dot.style.transform = `translate(${ptr.x}px, ${ptr.y}px)`;
      glow.style.transform = `translate(${gx}px, ${gy}px)`;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- Light particles (cover, Vortex, close) ---------- */
  const particles = (() => {
    const c = $('canvas.particles'); if (!c) return { toggle() {} };
    const ctx = c.getContext('2d'); let on = false, raf = 0, w, h, dpr;
    const ps = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + .3, s: Math.random() * .0003 + .00006, z: Math.random() * .9 + .1, o: Math.random() * Math.PI * 2 }));
    function resize() { dpr = Math.min(devicePixelRatio || 1, 1.5); w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; }
    resize(); addEventListener('resize', resize);
    function loop(t) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y -= p.s * p.z * 16; if (p.y < -.02) { p.y = 1.02; p.x = Math.random(); }
        let x = p.x * w + Math.sin(t * .0004 + p.o) * 14 * p.z - ptr.sx * 34 * p.z, y = p.y * h - ptr.sy * 22 * p.z;
        const dx = x - ptr.x, dy = y - ptr.y, d = Math.hypot(dx, dy);
        if (d < 140) { const f = (1 - d / 140); x += dx / (d || 1) * f * 40; y += dy / (d || 1) * f * 40; }
        const a = .2 + .5 * (.5 + .5 * Math.sin(t * .002 + p.o));
        ctx.beginPath(); ctx.arc(x, y, p.r * p.z * 1.5, 0, 7); ctx.fillStyle = `rgba(150,190,255,${a * p.z})`; ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    }
    return { toggle(v) { if (reduce) return; if (v && !on) { on = true; c.classList.add('is-on'); raf = requestAnimationFrame(loop); } else if (!v && on) { on = false; c.classList.remove('is-on'); cancelAnimationFrame(raf); ctx.clearRect(0, 0, c.width, c.height); } } };
  })();

  /* ---------- Image tabs (one frame, several views) ---------- */
  $$('[data-tabs]').forEach(group => {
    const frame = document.getElementById(group.dataset.tabs);
    const btns = $$('button', group);
    let auto = 0, user = false;
    function show(b) {
      btns.forEach(x => x.setAttribute('aria-selected', x === b ? 'true' : 'false'));
      $$('.view', frame).forEach(v => v.classList.toggle('is-on', v.dataset.k === b.dataset.k));
      const host = group.closest('.slide');
      $$('[data-pane]', host).forEach(p => p.classList.toggle('is-on', p.dataset.pane === b.dataset.k));
    }
    btns.forEach(b => b.addEventListener('click', () => { user = true; show(b); }));
    const host = group.closest('.slide');
    hooks[host.id] = {
      enter() { if (reduce || user) return; clearInterval(auto); let i = btns.findIndex(b => b.getAttribute('aria-selected') === 'true'); auto = setInterval(() => { if (user || mode !== 'deck') return clearInterval(auto); i = (i + 1) % btns.length; show(btns[i]); }, 4200); },
      leave() { clearInterval(auto); },
    };
  });

  /* ---------- Master plan: zones highlight both ways ---------- */
  (() => {
    const host = $('#s-plan'); if (!host) return;
    const rows = $$('.zone-row', host), zones = $$('.pin', host), info = $('.zone-info', host);
    function on(id) {
      rows.forEach(r => r.classList.toggle('is-on', r.dataset.z === id));
      zones.forEach(z => z.classList.toggle('is-on', z.dataset.z === id));
      host.classList.toggle('has-on', !!id);
      const r = rows.find(x => x.dataset.z === id);
      if (info) info.innerHTML = r ? `<b>${r.dataset.name}</b><span>${r.dataset.note}</span>` : info.dataset.idle;
    }
    rows.forEach(r => { r.addEventListener('mouseenter', () => on(r.dataset.z)); r.addEventListener('focus', () => on(r.dataset.z)); r.addEventListener('click', () => on(r.dataset.z)); });
    zones.forEach(z => { z.addEventListener('mouseenter', () => on(z.dataset.z)); z.addEventListener('click', () => on(z.dataset.z)); });
    host.addEventListener('mouseleave', () => on(null));
  })();

  /* ---------- Week strip ---------- */
  $$('.day').forEach(d => d.addEventListener('mouseenter', () => { $$('.day', d.parentElement).forEach(x => x.classList.toggle('is-on', x === d)); }));

  /* ---------- Cover words ---------- */
  $$('[data-words]').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`).join(' ');
  });

  /* ---------- Boot ---------- */
  fit();
  setMode(pickMode());
  const fromHash = slides.findIndex(s => '#' + s.id === location.hash);
  go(fromHash > 0 ? fromHash : 0, true);
  requestAnimationFrame(() => document.body.classList.add('is-ready'));
  window.__deck = { go, get index() { return idx; }, count: slides.length, ids: slides.map(s => s.id) };
})();
