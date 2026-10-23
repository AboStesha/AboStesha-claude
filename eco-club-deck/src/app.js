(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const D = window.DATA;
  const IMG = window.IMG || {};
  const ICON = window.ICON || {};
  const W = 1600, H = 900;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;

  /* ---------- Arabic number formatting ---------- */
  const AR = '٠١٢٣٤٥٦٧٨٩';
  const toAr = s => String(s).replace(/\d/g, d => AR[d]).replace(/,/g, '٬').replace(/\./g, '٫');
  const fmt = (n, d = 0) => toAr(Number(n).toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d }));
  const money = (usd, d) => {
    const a = Math.abs(usd);
    if (a >= 1e6) return fmt(usd / 1e6, d ?? (usd % 1e6 === 0 ? 0 : 2)) + ' مليون $';
    if (a >= 1e3) { const t = Math.round(usd / 1e3), r = Math.abs(t) % 100; return fmt(t) + (r >= 3 && r <= 10 ? ' آلاف $' : ' ألف $'); }
    return fmt(usd) + ' $';
  };
  const pct = (v, d = 0) => fmt(v, d) + '٪';
  window.__fmt = { toAr, fmt, money, pct };

  /* ---------- Images ---------- */
  $$('img[data-img]').forEach(img => { const k = img.dataset.img; if (IMG[k]) img.src = IMG[k]; img.alt = img.alt || ''; img.decoding = 'async'; });

  const app = $('#app');
  const stage = $('.stage');
  const slides = $$('.slide');
  const bgsEl = $('.bgs');
  let idx = 0, mode = null;

  /* ---------- Background layer ---------- */
  const bgEls = slides.map(s => {
    const k = s.dataset.bg;
    const el = document.createElement('div');
    el.className = 'bg' + (k ? '' : ' plain');
    if (s.dataset.veil) el.dataset.veil = s.dataset.veil;
    if (k && IMG[k]) { const im = new Image(); im.src = IMG[k]; im.alt = ''; el.appendChild(im); }
    bgsEl.appendChild(el);
    return el;
  });

  function setScrollBgs(on) {
    slides.forEach(s => {
      const k = s.dataset.bg;
      let sb = $(':scope > .sbg', s);
      if (on && k && IMG[k] && !sb) {
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
    if (m === 'scroll') {
      slides.forEach(s => s.classList.add('is-active'));
      slides.forEach(s => enter(s));
    } else {
      slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
      enter(slides[idx]);
    }
    layoutRanking();
  }
  addEventListener('resize', () => { fit(); setMode(pickMode()); });

  /* ---------- Chrome ---------- */
  const rail = $('.rail'), toc = $('.toc'), tocGrid = $('.toc-grid'), countEl = $('.navbar .count'), prog = $('.progress i'), chapLbl = $('.chapter-label');
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
  chapters.forEach((ch, ci) => {
    const box = document.createElement('div'); box.className = 'toc-chap';
    box.innerHTML = `<h4>${toAr(ci + 1)} · ${ch.name}</h4>`;
    ch.items.forEach(i => {
      const b = document.createElement('button'); b.type = 'button';
      b.innerHTML = `<span class="num">${toAr(String(i + 1).padStart(2, '0'))}</span><span>${slides[i].dataset.title}</span>`;
      b.addEventListener('click', () => { closeToc(); go(i); });
      box.appendChild(b);
    });
    tocGrid.appendChild(box);
  });
  function openToc() { toc.classList.add('is-open'); $$('.toc-chap button').forEach((b, i) => b.classList.toggle('is-on', i === idx)); }
  function closeToc() { toc.classList.remove('is-open'); }
  $('[data-act="toc"]').addEventListener('click', openToc);
  $('[data-act="toc-close"]').addEventListener('click', closeToc);
  $('.brand').addEventListener('click', () => go(0));
  $('[data-act="next"]').addEventListener('click', () => go(idx + 1));
  $('[data-act="prev"]').addEventListener('click', () => go(idx - 1));
  $$('[data-go]').forEach(b => b.addEventListener('click', () => { const t = document.getElementById(b.dataset.go); if (t) go(slides.indexOf(t)); }));

  function chrome() {
    $$('button', rail).forEach((b, i) => b.classList.toggle('is-on', i === idx));
    countEl.innerHTML = `<b>${toAr(String(idx + 1).padStart(2, '0'))}</b> / ${toAr(slides.length)}`;
    prog.style.width = ((idx + 1) / slides.length * 100) + '%';
    const s = slides[idx];
    const ci = chapters.findIndex(c => c.name === s.dataset.chapter);
    chapLbl.innerHTML = `<span class="num">${toAr(ci + 1)}</span><span>${s.dataset.chapter}</span>`;
  }

  /* ---------- Navigation ---------- */
  const hooks = {};
  function enter(s) { const h = hooks[s.id]; if (h && h.enter) h.enter(s); runCounters(s); }
  function leave(s) { const h = hooks[s.id]; if (h && h.leave) h.leave(s); }

  function go(n, force) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    if (mode === 'scroll') { slides[n].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); return; }
    if (n === idx && !force) return;
    const prev = slides[idx];
    if (prev !== slides[n]) { leave(prev); prev.classList.remove('is-active'); }
    idx = n;
    slides[idx].classList.add('is-active');
    bgEls.forEach((b, i) => b.classList.toggle('is-on', i === idx));
    chrome();
    enter(slides[idx]);
    motes.toggle(!!slides[idx].dataset.motes);
    try { history.replaceState(null, '', '#' + slides[idx].id); } catch (e) { /* sandboxed */ }
  }

  addEventListener('keydown', e => {
    if (e.target.closest('input, textarea, select, [contenteditable]')) return;
    const k = e.key;
    if (toc.classList.contains('is-open')) { if (k === 'Escape' || k === 'o' || k === 'O') closeToc(); return; }
    if (mode !== 'deck') return;
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
    acc += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(acc) > 38) { go(idx + (acc > 0 ? 1 : -1)); wheelLock = true; acc = 0; }
  }, { passive: false });

  let tx = 0, ty = 0, tt = 0;
  addEventListener('touchstart', e => { const t = e.touches[0]; tx = t.clientX; ty = t.clientY; tt = Date.now(); }, { passive: true });
  addEventListener('touchend', e => {
    if (mode !== 'deck') return;
    const t = e.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty;
    if (Date.now() - tt > 700) return;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) go(idx + (dx > 0 ? 1 : -1));
    else if (Math.abs(dy) > 60) go(idx + (dy < 0 ? 1 : -1));
  }, { passive: true });

  /* Scroll mode: track current section for progress */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => {
    es.forEach(en => { if (en.isIntersecting && mode === 'scroll') { idx = slides.indexOf(en.target); prog.style.width = ((idx + 1) / slides.length * 100) + '%'; } });
  }, { threshold: .35 }) : null;
  if (io) slides.forEach(s => io.observe(s));

  /* Idle chrome */
  let idleT = 0;
  function wake() { document.body.classList.remove('is-idle'); clearTimeout(idleT); idleT = setTimeout(() => { if (mode === 'deck') document.body.classList.add('is-idle'); }, 3200); }
  addEventListener('pointermove', wake, { passive: true });
  addEventListener('keydown', wake);
  setTimeout(() => { const h = $('.hint'); if (h) h.style.opacity = '0'; }, 9000);

  /* ---------- Pointer: parallax, cursor, tilt, magnetic ---------- */
  const ptr = { x: innerWidth / 2, y: innerHeight / 2, nx: 0, ny: 0, sx: 0, sy: 0 };
  addEventListener('pointermove', e => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.nx = e.clientX / innerWidth * 2 - 1; ptr.ny = e.clientY / innerHeight * 2 - 1; }, { passive: true });

  const cur = $('.cursor'), dot = $('.cursor-dot');
  let cx = ptr.x, cy = ptr.y;
  if (fine && !reduce) {
    document.addEventListener('pointerover', e => { const hot = e.target.closest('button, a, .seat, .zone, .zone-row, .bl, .swap, .game, .tier, .day, .hill-item, .bc-tab, .node, [data-hot], input'); cur.classList.toggle('is-hot', !!hot); });
    addEventListener('pointermove', () => { cur.classList.add('is-on'); dot.classList.add('is-on'); }, { once: true });
    document.addEventListener('pointerleave', () => { cur.classList.remove('is-on'); dot.classList.remove('is-on'); });
  }

  $$('[data-tilt]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.transform = `perspective(900px) rotateX(${(.5 - y) * 9}deg) rotateY(${(x - .5) * 11}deg) translateZ(0)`;
      el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%');
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
  $$('[data-magnetic]').forEach(el => {
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`; });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });

  function frame() {
    ptr.sx += (ptr.nx - ptr.sx) * .06; ptr.sy += (ptr.ny - ptr.sy) * .06;
    if (mode === 'deck' && !reduce) {
      const s = slides[idx];
      const b = bgEls[idx].firstChild;
      if (b) b.style.translate = `${ptr.sx * -14}px ${ptr.sy * -10}px`;
      $$('[data-depth]', s).forEach(el => { const d = +el.dataset.depth || 1; el.style.setProperty('--px', (ptr.sx * -12 * d) + 'px'); el.style.setProperty('--py', (ptr.sy * -9 * d) + 'px'); });
      const iso = $('.iso', s); if (iso) iso.style.setProperty('--rz', (-36 + ptr.sx * 10) + 'deg');
    }
    if (fine && !reduce) {
      cx += (ptr.x - cx) * .18; cy += (ptr.y - cy) * .18;
      cur.style.transform = `translate(${cx}px, ${cy}px)`; dot.style.transform = `translate(${ptr.x}px, ${ptr.y}px)`;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- Contour field (the hill's topography bends around the pointer) ---------- */
  const contours = (() => {
    const c = $('canvas.contours'); if (!c) return {};
    const ctx = c.getContext('2d');
    let w = 0, h = 0, dpr = 1, px = -9999, py = -9999;
    function resize() { dpr = Math.min(devicePixelRatio || 1, 1.5); w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; }
    resize(); addEventListener('resize', resize);
    function draw(t) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      px += (ptr.x - px) * .08; py += (ptr.y - py) * .08;
      const ox = w * .2, oy = h * .66, rings = 22, N = 110, T = reduce ? 0 : t * .00012;
      for (let r = 0; r < rings; r++) {
        const R0 = 46 + r * Math.max(w, h) * .052;
        ctx.beginPath();
        for (let i = 0; i <= N; i++) {
          const a = i / N * Math.PI * 2;
          let rr = R0 * (1 + .16 * Math.sin(a * 2 + r * .3 + T) + .07 * Math.sin(a * 5 - r * .5 - T * 1.7) + .04 * Math.sin(a * 9 + T * 2));
          let x = ox + Math.cos(a) * rr * 1.35, y = oy + Math.sin(a) * rr * .78;
          const dx = x - px, dy = y - py, d = Math.hypot(dx, dy), RR = 170;
          if (d < RR) { const f = 1 - d / RR; x += dx / (d || 1) * f * f * 46; y += dy / (d || 1) * f * f * 46; }
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        const al = .035 + (r % 4 === 0 ? .06 : 0);
        ctx.strokeStyle = `rgba(217,168,69,${al})`; ctx.lineWidth = r % 4 === 0 ? 1.2 : .8; ctx.stroke();
      }
    }
    let raf = 0;
    function loop(t) { draw(t); raf = requestAnimationFrame(loop); }
    if (reduce) draw(0); else raf = requestAnimationFrame(loop);
    document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else if (!reduce) raf = requestAnimationFrame(loop); });
    return {};
  })();

  /* ---------- Gold motes (cover & closing) ---------- */
  const motes = (() => {
    const c = $('canvas.motes'); if (!c) return { toggle() {} };
    const ctx = c.getContext('2d'); let on = false, raf = 0, w, h, dpr;
    const ps = Array.from({ length: 80 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + .4, s: Math.random() * .00028 + .00008, z: Math.random() * .9 + .1, o: Math.random() * Math.PI * 2 }));
    function resize() { dpr = Math.min(devicePixelRatio || 1, 1.5); w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; }
    resize(); addEventListener('resize', resize);
    function loop(t) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y -= p.s * p.z * 16; if (p.y < -.02) { p.y = 1.02; p.x = Math.random(); }
        const x = p.x * w + Math.sin(t * .0004 + p.o) * 14 * p.z - ptr.sx * 30 * p.z, y = p.y * h - ptr.sy * 20 * p.z;
        const a = .25 + .45 * (.5 + .5 * Math.sin(t * .002 + p.o));
        ctx.beginPath(); ctx.arc(x, y, p.r * p.z * 1.4, 0, 7); ctx.fillStyle = `rgba(242,205,124,${a * p.z})`; ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    }
    return { toggle(v) { if (reduce) return; if (v && !on) { on = true; c.style.opacity = 1; raf = requestAnimationFrame(loop); } else if (!v && on) { on = false; cancelAnimationFrame(raf); ctx.clearRect(0, 0, c.width, c.height); } } };
  })();

  /* ---------- Counters ---------- */
  function runCounters(s) {
    $$('[data-count]', s).forEach(el => {
      const to = parseFloat(el.dataset.count), d = +(el.dataset.dec || 0), pre = el.dataset.pre || '', suf = el.dataset.suf || '';
      const show = v => { el.textContent = pre + fmt(v, d) + suf; };
      if (reduce || mode === 'scroll') { show(to); return; }
      const t0 = performance.now(), dur = +(el.dataset.dur || 1600);
      const step = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4); show(to * e); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
  }
  $$('[data-count]').forEach(el => { el.textContent = (el.dataset.pre || '') + fmt(el.dataset.count, +(el.dataset.dec || 0)) + (el.dataset.suf || ''); });

  /* ---------- Tabs that swap images ---------- */
  $$('[data-swap-group]').forEach(group => {
    const btns = $$('button', group), target = document.getElementById(group.dataset.swapGroup);
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.setAttribute('aria-selected', x === b ? 'true' : 'false'));
      $$('.swap', target).forEach(im => im.classList.toggle('is-on', im.dataset.k === b.dataset.k));
      const cap = $('.cap', target); if (cap && b.dataset.cap) cap.textContent = b.dataset.cap;
      if (b.dataset.panel) { const host = group.closest('.slide'); $$('[data-panel-id]', host).forEach(p => p.hidden = p.dataset.panelId !== b.dataset.panel); }
    }));
  });

  /* ---------- Cover title letters ---------- */
  $$('[data-split]').forEach(el => { /* Arabic letters must stay joined: animate whole words */
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w, i) => `<span class="char" style="transition-delay:${.15 + i * .12}s">${w}</span>`).join(' ');
  });

  /* ================= Slide modules ================= */

  /* Council round table */
  (() => {
    const host = $('#s-council'); if (!host || !D.council) return;
    const table = $('.table', host), card = $('.persona', host);
    const N = D.council.length;
    D.council.forEach((p, i) => {
      const a = (-90 + i * 360 / N) * Math.PI / 180;
      const b = document.createElement('button'); b.type = 'button'; b.className = 'seat';
      b.style.left = (50 + Math.cos(a) * 41) + '%'; b.style.top = (50 + Math.sin(a) * 41) + '%';
      b.style.setProperty('--seat', p.color);
      b.innerHTML = `${ICON[p.icon] || ''}<span>${p.seat}</span>`;
      b.addEventListener('click', () => { user = true; show(i); });
      b.addEventListener('mouseenter', () => { user = true; show(i); });
      table.appendChild(b);
    });
    let cur = -1, timer = 0, user = false;
    function show(i) {
      if (i === cur) return; cur = i;
      const p = D.council[i];
      $$('.seat', table).forEach((s, j) => s.classList.toggle('is-on', j === i));
      card.style.setProperty('--seat', p.color);
      card.innerHTML = `
        <div class="who fade"><i></i><b>${p.seat}</b></div>
        <div class="kicker fade" style="margin:0">${p.title}</div>
        <p class="lens fade">${p.lens}</p>
        <div class="demands fade">${p.demands.map(d => `<div><em>${d.k}</em>${d.v}</div>`).join('')}</div>
        <blockquote class="fade">«${p.quote}»</blockquote>`;
      $('.core b', table).textContent = p.short || p.seat;
    }
    show(0);
    hooks['s-council'] = {
      enter() { clearInterval(timer); timer = setInterval(() => { if (!user) show((cur + 1) % N); }, 5200); },
      leave() { clearInterval(timer); }
    };
  })();

  /* Hill: stacked landform */
  (() => {
    const host = $('#s-hill'); if (!host) return;
    const wrap = $('.hill', host), items = $$('.hill-item', host), layers = $$('.layer', host);
    const btn = $('.hill-toggle', host);
    function focus(n) {
      items.forEach(it => it.classList.toggle('is-on', it.dataset.l === n));
      layers.forEach(l => l.classList.toggle('is-dim', !!n && l.dataset.l !== n));
    }
    items.forEach(it => { it.addEventListener('mouseenter', () => { wrap.classList.add('is-open'); focus(it.dataset.l); }); it.addEventListener('click', () => { wrap.classList.add('is-open'); focus(it.dataset.l); }); it.addEventListener('mouseleave', () => focus(null)); });
    btn.addEventListener('click', () => { wrap.classList.toggle('is-open'); btn.querySelector('span').textContent = wrap.classList.contains('is-open') ? 'إعادة التجميع' : 'فكّ الطبقات'; });
    let t1 = 0;
    hooks['s-hill'] = {
      enter() { wrap.classList.remove('is-open'); clearTimeout(t1); t1 = setTimeout(() => { wrap.classList.add('is-open'); btn.querySelector('span').textContent = 'إعادة التجميع'; }, 1100); },
      leave() { clearTimeout(t1); }
    };
  })();

  /* Master plan */
  (() => {
    const host = $('#s-plan'); if (!host || !D.zones) return;
    const plan = $('.plan', host), list = $('.zone-list', host), det = $('.zone-detail', host);
    const total = D.zones.reduce((a, z) => a + z.area, 0);
    const max = Math.max(...D.zones.map(z => z.area));
    D.zones.forEach(z => {
      const r = document.createElement('button'); r.type = 'button'; r.className = 'zone-row'; r.dataset.zone = z.id;
      r.style.setProperty('--c', z.color);
      r.innerHTML = `<span class="dot">${toAr(z.n)}</span><span>${z.name}</span><span class="bar"><i style="--w:${z.area / max * 100}%"></i></span><span class="a">${toAr(z.area.toLocaleString('en-US'))} م²</span>`;
      list.appendChild(r);
    });
    function show(id) {
      const z = D.zones.find(x => x.id === id);
      plan.classList.toggle('has-hover', !!z);
      $$('.zone', host).forEach(g => g.classList.toggle('is-on', g.dataset.zone === id));
      $$('.zone-row', host).forEach(g => g.classList.toggle('is-on', g.dataset.zone === id));
      if (!z) { det.innerHTML = det.dataset.idle; return; }
      det.innerHTML = `<h3>${toAr(z.n)} · ${z.name}</h3>
        <div class="meta"><span><b>${toAr(z.area.toLocaleString('en-US'))}</b> م²</span><span><b>${pct(z.area / total * 100, 1)}</b> من الأرض</span><span>${z.phase}</span></div>
        <p>${z.desc}</p>`;
    }
    det.dataset.idle = det.innerHTML;
    $$('.zone, .zone-row', host).forEach(el => {
      el.addEventListener('mouseenter', () => show(el.dataset.zone));
      el.addEventListener('focus', () => show(el.dataset.zone));
      el.addEventListener('click', () => { const z = D.zones.find(x => x.id === el.dataset.zone); if (z && z.slide && el.classList.contains('zone')) { const t = document.getElementById(z.slide); if (t) go(slides.indexOf(t)); } else show(el.dataset.zone); });
    });
    $('.plan-svg', host).addEventListener('mouseleave', () => show(null));
    list.addEventListener('mouseleave', () => show(null));
  })();

  /* Before-Christ village tabs */
  (() => {
    const host = $('#s-bc'); if (!host) return;
    const tabs = $$('.bc-tab', host), media = $('.media', host);
    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(x => x.classList.toggle('is-on', x === t));
      $$('.swap', media).forEach(im => im.classList.toggle('is-on', im.dataset.k === t.dataset.k));
      const cap = $('.cap', media); if (cap) cap.textContent = t.dataset.cap || '';
    }));
  })();

  /* Luca Land games */
  (() => {
    const host = $('#s-luca'); if (!host || !D.games) return;
    const grid = $('.games', host);
    const TIER = { P1: ['p1', 'الافتتاح'], P2: ['p2', 'المرحلة ٢'], EVENT: ['ev', 'فعالية'], REPLACE: ['rep', 'بديل ذكي'] };
    D.games.forEach(g => {
      const t = TIER[g.tier] || TIER.P1;
      const el = document.createElement('div'); el.className = 'game'; el.dataset.tier = g.tier;
      el.innerHTML = `<span class="tag ${t[0]}">${t[1]}</span><h4>${g.name}</h4><p>${g.desc}</p>`;
      grid.appendChild(el);
    });
    $$('.luca-filter button', host).forEach(b => b.addEventListener('click', () => {
      $$('.luca-filter button', host).forEach(x => x.classList.toggle('is-on', x === b));
      $$('.game', grid).forEach(g => g.classList.toggle('is-out', b.dataset.f !== 'all' && g.dataset.tier !== b.dataset.f));
    }));
  })();

  /* Eco loop */
  (() => {
    const host = $('#s-eco'); if (!host || !D.loop) return;
    const svg = $('.loop svg', host), center = $('.loop-center', host);
    const N = D.loop.length, R = 236, C = 300;
    let html = `<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="rgba(99,179,131,.28)" stroke-width="1.5" stroke-dasharray="3 7"/>`;
    html += `<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="var(--palm)" stroke-width="2" stroke-dasharray="60 1423" class="orbit"/>`;
    D.loop.forEach((n, i) => {
      const a = (-90 + i * 360 / N) * Math.PI / 180, x = C + Math.cos(a) * R, y = C + Math.sin(a) * R;
      html += `<g class="node" data-i="${i}" tabindex="0"><circle class="bgc" cx="${x}" cy="${y}" r="46" fill="#0d1b16" stroke="rgba(99,179,131,.45)" stroke-width="1.5"/>
        <text x="${x}" y="${y + 1}" text-anchor="middle" dominant-baseline="middle" fill="var(--palm)" font-size="15" font-family="Readex Pro, sans-serif">${toAr(i + 1)}</text>
        <text x="${x}" y="${y + (Math.sin(a) > .3 ? 72 : -64)}" text-anchor="middle" fill="var(--sand)" font-size="16" font-family="Readex Pro, sans-serif">${n.t}</text></g>`;
    });
    svg.innerHTML = html;
    const idle = center.innerHTML;
    $$('.node', svg).forEach(g => {
      const n = D.loop[+g.dataset.i];
      const on = () => { $$('.node', svg).forEach(x => x.classList.toggle('is-on', x === g)); center.innerHTML = `<div><b>${n.t}</b><span>${n.d}</span></div>`; };
      g.addEventListener('mouseenter', on); g.addEventListener('focus', on); g.addEventListener('click', on);
    });
    $('.loop', host).addEventListener('mouseleave', () => { $$('.node', svg).forEach(x => x.classList.remove('is-on')); center.innerHTML = idle; });
    const orbit = $('.orbit', svg); let a = 0, raf = 0;
    function spin() { a -= 3; orbit.setAttribute('stroke-dashoffset', a); raf = requestAnimationFrame(spin); }
    hooks['s-eco'] = { enter() { if (!reduce) { cancelAnimationFrame(raf); raf = requestAnimationFrame(spin); } }, leave() { cancelAnimationFrame(raf); } };
  })();

  /* Culture week */
  (() => {
    const host = $('#s-culture'); if (!host || !D.week) return;
    const wk = $('.week', host);
    D.week.forEach((d, i) => {
      const el = document.createElement('div'); el.className = 'day' + (d.peak ? ' is-peak' : '');
      el.setAttribute('data-a', ''); el.setAttribute('data-d', String(Math.min(8, i + 1)));
      el.innerHTML = `<div class="dn">${d.day}<small>${d.en}</small></div><ul>${d.items.map(x => `<li style="--c:${x.c}">${x.t}</li>`).join('')}</ul>`;
      wk.appendChild(el);
    });
  })();

  /* Idea ranking */
  const ranking = (() => {
    const host = $('#s-rank'); if (!host || !D.ranking) return null;
    const list = $('.rank-list', host), tip = $('.rank-tip', host);
    const TIER = { P1: ['p1', 'الافتتاح'], P2: ['p2', 'المرحلة ٢'], EVENT: ['ev', 'فعالية'], REPLACE: ['rep', 'بديل'], DROP: ['drop', 'مؤجّل'] };
    const COL = { P1: 'var(--gold)', P2: 'var(--lapis)', EVENT: 'var(--palm)', REPLACE: 'var(--clay)', DROP: 'var(--sand-3)' };
    const rows = D.ranking.map(r => {
      const el = document.createElement('div'); el.className = 'rank-row';
      const t = TIER[r.tier] || TIER.P1;
      el.style.setProperty('--c', COL[r.tier] || 'var(--gold)');
      el.innerHTML = `<span class="i"></span><span class="nm">${r.name}</span><span class="track"><span class="fill"></span></span><span class="sc"></span><span class="tag ${t[0]}">${t[1]}</span>`;
      el.addEventListener('mouseenter', () => {
        tip.innerHTML = `<h3>${r.name}</h3><p class="small muted" style="margin:4px 0 10px">${r.note}</p>
        <div class="legend-weights">${[['العائد', r.revenue], ['جاذبية الشارع', r.street], ['بيئة وثقافة', r.eco], ['قابلية التنفيذ', r.feas], ['الانتشار', r.viral]].map(([k, v]) => `<div><span>${k}</span><b>${toAr(v)}/٥</b></div>`).join('')}</div>`;
      });
      list.appendChild(el);
      return { r, el };
    });
    const idleTip = tip.innerHTML;
    list.addEventListener('mouseleave', () => { tip.innerHTML = idleTip; });
    let key = 'total', page = 0;
    const PER = 16;
    const label = { total: 'المجموع /١٠٠', revenue: 'العائد /٥', street: 'الشارع /٥', eco: 'بيئة وثقافة /٥', feas: 'التنفيذ /٥', viral: 'الانتشار /٥' };
    function apply() {
      const sorted = rows.slice().sort((a, b) => (b.r[key] - a.r[key]) || (b.r.total - a.r.total));
      const max = key === 'total' ? 100 : 5;
      sorted.forEach((o, i) => {
        const p = Math.floor(i / PER), visible = mode === 'scroll' || p === page;
        o.el.style.transform = `translateY(${(i % PER) * 28}px)`;
        o.el.style.opacity = visible ? 1 : 0;
        o.el.style.pointerEvents = visible ? '' : 'none';
        o.el.style.order = i;
        $('.i', o.el).textContent = toAr(i + 1);
        $('.sc', o.el).textContent = toAr(key === 'total' ? Math.round(o.r.total) : o.r[key]);
        $('.fill', o.el).style.setProperty('--w', (o.r[key] / max * 100) + '%');
      });
      $('.rank-scale', host).textContent = label[key];
      $$('.rank-pages button', host).forEach((b, i) => b.classList.toggle('is-on', i === page));
    }
    $$('.rank-controls [data-k]', host).forEach(b => b.addEventListener('click', () => { key = b.dataset.k; page = 0; $$('.rank-controls [data-k]', host).forEach(x => x.classList.toggle('is-on', x === b)); apply(); }));
    const pages = $('.rank-pages', host), np = Math.ceil(rows.length / PER);
    for (let i = 0; i < np; i++) { const b = document.createElement('button'); b.type = 'button'; b.textContent = `${toAr(i * PER + 1)}–${toAr(Math.min(rows.length, (i + 1) * PER))}`; b.addEventListener('click', () => { page = i; apply(); }); pages.appendChild(b); }
    $('.rank-list', host).style.height = (PER * 28) + 'px';
    hooks['s-rank'] = { enter() { rows.forEach(o => $('.fill', o.el).style.setProperty('--w', '0%')); requestAnimationFrame(() => requestAnimationFrame(apply)); } };
    return { apply };
  })();
  function layoutRanking() { if (ranking) ranking.apply(); }

  /* Flip cards (swaps + mistakes) */
  function flipCards(host, items, cls) {
    items.forEach((m, i) => {
      const el = document.createElement('div'); el.className = 'swap'; el.tabIndex = 0;
      el.setAttribute('data-a', ''); el.setAttribute('data-d', String(Math.min(8, i + 1)));
      el.innerHTML = `<div class="swap-in"><div class="swap-f"><span class="lbl">${m.fl}</span><h4>${m.f}</h4><p>${m.fp || ''}</p><span class="flipnote">${m.bl}: <b>${m.b}</b></span></div>
        <div class="swap-b"><span class="lbl">${m.bl}</span><h4>${m.b}</h4><p>${m.bp || ''}</p></div></div>`;
      el.addEventListener('click', () => el.classList.toggle('is-flipped'));
      el.addEventListener('keydown', e => { if (e.key === 'Enter') el.classList.toggle('is-flipped'); });
      host.appendChild(el);
    });
  }
  if (D.swaps && $('#s-swaps .swaps')) flipCards($('#s-swaps .swaps'), D.swaps.map(s => ({ fl: 'الفكرة الأصلية', f: s.from, fp: s.problem, bl: 'البديل الذكي', b: s.to, bp: s.why })));
  if (D.mistakes && $('#s-mistakes .mist')) flipCards($('#s-mistakes .mist'), D.mistakes.map(s => ({ fl: 'خطأ يجب تجنّبه', f: s.m, fp: s.why, bl: 'الحل', b: s.fix, bp: s.fixd || '' })));

  /* Budget donut */
  (() => {
    const host = $('#s-budget'); if (!host || !D.budget) return;
    const svg = $('.donut svg', host), list = $('.blist', host), center = $('.donut-center', host), donut = $('.donut', host);
    const total = D.budget.reduce((a, b) => a + b.usd, 0);
    const R = 210, C = 2 * Math.PI * R, GAP = 4;
    let off = 0, html = '';
    D.budget.forEach((b, i) => {
      const len = b.usd / total * C;
      html += `<circle class="seg" data-i="${i}" cx="280" cy="280" r="${R}" stroke="${b.color}" stroke-dasharray="0 ${C}" stroke-dashoffset="${-off}" data-len="${Math.max(0, len - GAP)}"/>`;
      off += len;
      const row = document.createElement('div'); row.className = 'bl'; row.dataset.i = i; row.style.setProperty('--c', b.color);
      row.innerHTML = `<i></i><span>${b.k}</span><b>${money(b.usd)}</b>`;
      list.appendChild(row);
    });
    svg.setAttribute('viewBox', '0 0 560 560');
    svg.innerHTML = html;
    const idle = center.innerHTML;
    function on(i) {
      donut.classList.toggle('has-hover', i != null);
      $$('.seg', svg).forEach(s => s.classList.toggle('is-on', +s.dataset.i === i));
      $$('.bl', list).forEach(s => s.classList.toggle('is-on', +s.dataset.i === i));
      if (i == null) { center.innerHTML = idle; return; }
      const b = D.budget[i];
      center.innerHTML = `<div><div class="v">${fmt(b.usd)}</div><div class="p">${pct(b.usd / total * 100, 1)} · $</div><div class="l">${b.k}${b.note ? `<br><span class="micro">${b.note}</span>` : ''}</div></div>`;
    }
    $$('.seg, .bl', host).forEach(el => { el.addEventListener('mouseenter', () => on(+el.dataset.i)); el.addEventListener('mouseleave', () => on(null)); });
    function draw(v) { $$('.seg', svg).forEach(s => s.setAttribute('stroke-dasharray', v ? `${s.dataset.len} ${C}` : `0 ${C}`)); }
    hooks['s-budget'] = { enter() { draw(false); requestAnimationFrame(() => requestAnimationFrame(() => draw(true))); } };
    draw(true);
  })();

  /* Leverage bar */
  (() => {
    const host = $('#s-leverage'); if (!host || !D.leverage) return;
    const bar = $('.lev-bar', host);
    D.leverage.forEach(l => {
      const el = document.createElement('div'); el.style.flexGrow = l.usd; el.style.background = l.color; el.style.color = l.ink || 'var(--ink)';
      el.innerHTML = `<b>${money(l.usd)}</b><span>${l.k}</span>`; bar.appendChild(el);
    });
  })();

  /* Revenue scenarios */
  (() => {
    const host = $('#s-revenue'); if (!host || !D.revenue) return;
    const box = $('.streams', host), pnl = $('.pnl', host);
    const R = D.revenue;
    const maxAll = Math.max(...R.streams.map(s => s.v[2]));
    R.streams.forEach(s => {
      const el = document.createElement('div'); el.className = 'stream'; el.style.setProperty('--c', s.color);
      el.innerHTML = `<span class="nm">${s.k}</span><span class="track"><span class="fill"></span></span><span class="v"></span>`;
      box.appendChild(el);
    });
    let sc = 1;
    function apply() {
      const rows = $$('.stream', box);
      R.streams.forEach((s, i) => { $('.fill', rows[i]).style.setProperty('--w', (s.v[sc] / maxAll * 100) + '%'); $('.v', rows[i]).textContent = money(s.v[sc]); });
      const rev = R.streams.reduce((a, s) => a + s.v[sc], 0);
      const opex = R.opex.reduce((a, s) => a + s.v[sc], 0);
      const ebitda = rev - opex, margin = ebitda / rev * 100, pay = R.capex / ebitda;
      pnl.innerHTML = `
        <div class="pnl-row"><span>إجمالي الإيرادات السنوية</span><b>${money(rev, 2)}</b></div>
        <div class="pnl-row"><span>التكاليف التشغيلية${R.shareNote ? ' (شاملة حصة الدولة)' : ''}</span><b>${money(opex, 2)}</b></div>
        <div class="pnl-row hi"><span>الربح التشغيلي EBITDA</span><b>${money(ebitda, 2)}</b></div>
        <div class="pnl-row"><span>هامش الربح</span><b>${pct(margin)}</b></div>
        <div class="pnl-row"><span>الاسترداد البسيط قبل حصة الدولة</span><b>${ebitda > 0 ? fmt(pay, 1) + ' سنوات' : 'لا يُسترد (خسارة تشغيلية)'}</b></div>
        <p class="micro">${R.note}</p>`;
    }
    $$('.rev-tabs button', host).forEach(b => b.addEventListener('click', () => { sc = +b.dataset.sc; $$('.rev-tabs button', host).forEach(x => x.setAttribute('aria-selected', x === b ? 'true' : 'false')); apply(); }));
    hooks['s-revenue'] = { enter() { $$('.fill', box).forEach(f => f.style.setProperty('--w', '0%')); requestAnimationFrame(() => requestAnimationFrame(apply)); } };
    apply();
  })();

  /* ROI calculator */
  (() => {
    const host = $('#s-calc'); if (!host || !D.calc) return;
    const K = D.calc;
    const ins = $$('input[type="range"]', host);
    const arc = $('#gauge-arc', host), val = $('.gauge .v', host), lbl = $('.gauge .l', host);
    const outs = { rev: $('[data-o="rev"]', host), opex: $('[data-o="opex"]', host), ebitda: $('[data-o="ebitda"]', host) };
    const ARC = Math.PI * 230;
    function calc() {
      const v = {}; ins.forEach(i => { v[i.id] = +i.value; const p = (i.value - i.min) / (i.max - i.min) * 100; i.style.setProperty('--p', p + '%'); const o = $(`output[for="${i.id}"]`, host); if (o) o.textContent = i.dataset.money ? fmt(i.value) + ' د.ع' : fmt(i.value); });
      const fx = K.fx;
      const members = v.c_members * v.c_fee / fx * 12;
      const visits = v.c_visitors * 360 * (K.ticket + v.c_spend / fx);
      const events = v.c_events * 12 * K.eventNet;
      const rev = members + visits + events + K.fixedOther;
      const opex = K.opexFixed + rev * K.opexVar;
      const ebitda = rev - opex;
      const pay = ebitda > 0 ? K.capex / ebitda : 99;
      outs.rev.textContent = money(rev, 2); outs.opex.textContent = money(opex, 2); outs.ebitda.textContent = money(ebitda, 2);
      const shown = Math.min(pay, 8);
      val.textContent = pay > 20 ? '—' : fmt(pay, 1);
      lbl.textContent = pay > 20 ? 'لا يسترد رأس المال بهذه الافتراضات' : 'سنوات استرداد بسيط لمليونَي دولار';
      const k = 1 - Math.min(shown, 8) / 8;
      arc.setAttribute('stroke-dasharray', `${ARC * k} ${ARC}`);
      arc.setAttribute('stroke', pay <= 3 ? 'var(--palm)' : pay <= 5 ? 'var(--gold)' : 'var(--clay)');
    }
    ins.forEach(i => i.addEventListener('input', calc));
    $('[data-act="calc-reset"]', host).addEventListener('click', () => { ins.forEach(i => { i.value = i.defaultValue; }); calc(); });
    calc();
  })();

  /* Membership tiers */
  (() => {
    const host = $('#s-members'); if (!host || !D.tiers) return;
    const box = $('.tiers', host);
    D.tiers.forEach((t, i) => {
      const el = document.createElement('div'); el.className = 'tier' + (t.feat ? ' is-feat' : ''); el.style.setProperty('--c', t.color);
      el.setAttribute('data-a', ''); el.setAttribute('data-d', String(i + 1));
      el.innerHTML = `<span class="shine"></span>${t.feat ? `<span class="flag">${t.feat}</span>` : ''}<div class="nm">${t.name}</div>
        <div class="pr">${fmt(t.iqd)} <span class="small">د.ع</span><small>${t.per} · نحو ${money(t.usd)}</small></div>
        <p class="who">${t.who}</p><hr class="hair"><ul class="ticks">${t.perks.map(p => `<li>${p}</li>`).join('')}</ul>
        <div class="micro mt-auto">الهدف: ${fmt(t.target)} ${t.unit || 'عضوية'}</div>`;
      el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; el.style.transform = `perspective(900px) rotateX(${(.5 - y) * 7}deg) rotateY(${(x - .5) * 9}deg)`; el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%'); });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
      box.appendChild(el);
    });
  })();

  /* Marketing roadmap */
  (() => {
    const host = $('#s-marketing'); if (!host || !D.marketing) return;
    const box = $('.mk', host);
    D.marketing.forEach((m, i) => {
      const el = document.createElement('div'); el.className = 'mk-step'; el.setAttribute('data-a', ''); el.setAttribute('data-d', String(i + 1));
      el.innerHTML = `<span class="dot">${toAr(i + 1)}</span><span class="when">${m.when}</span><h4>${m.stage}</h4><ul>${m.actions.map(a => `<li>${a}</li>`).join('')}</ul>`;
      box.appendChild(el);
    });
  })();

  /* Gantt */
  (() => {
    const host = $('#s-timeline'); if (!host || !D.gantt) return;
    const months = $('.g-months', host), rows = $('.g-rows', host);
    const M = D.ganttMonths || 24; host.style.setProperty('--gm', M);
    for (let m = 1; m <= M; m++) { const s = document.createElement('span'); s.textContent = toAr(m); months.appendChild(s); }
    D.gantt.forEach((g, i) => {
      const r = document.createElement('div'); r.className = 'g-row';
      r.innerHTML = `<span class="nm">${g.t}</span><span class="g-track"><span class="g-bar" style="right:${(g.s - 1) / M * 100}%;width:${(g.e - g.s + 1) / M * 100}%;--c:${g.c};transition-delay:${.1 + i * .06}s"><span>${g.lbl || ''}</span></span></span>`;
      rows.appendChild(r);
    });
    (D.ganttMarks || []).forEach(mk => {
      const m = document.createElement('span'); m.className = 'g-mark';
      m.style.right = `calc(318px + (100% - 318px) * ${(mk.m) / M})`;
      m.innerHTML = `<span>${mk.t}</span>`; rows.appendChild(m);
    });
  })();

  /* KPI dashboard + ask */
  (() => {
    const host = $('#s-kpi'); if (!host || !D.kpis) return;
    const box = $('.dash', host);
    D.kpis.forEach((c, i) => {
      const el = document.createElement('div'); el.className = 'dash-col'; el.style.setProperty('--c', c.color); el.setAttribute('data-a', ''); el.setAttribute('data-d', String(i + 1));
      el.innerHTML = `<h3><i></i>${c.k}</h3>${c.items.map(m => `<div class="m"><span>${m.k}</span><b>${m.v}</b></div>`).join('')}`;
      box.appendChild(el);
    });
  })();
  (() => {
    const host = $('#s-ask'); if (!host || !D.ask) return;
    const box = $('.ask', host);
    D.ask.forEach((c, i) => {
      const el = document.createElement('div'); el.className = 'ask-col'; el.setAttribute('data-a', ''); el.setAttribute('data-d', String(i + 2));
      el.innerHTML = `<h3>${c.k}</h3><ul class="ticks">${c.items.map(x => `<li>${x}</li>`).join('')}</ul>`;
      box.appendChild(el);
    });
  })();

  /* ---------- Boot ---------- */
  fit();
  const fromHash = (() => { try { const id = location.hash.replace('#', ''); const i = slides.findIndex(s => s.id === id); return i < 0 ? 0 : i; } catch (e) { return 0; } })();
  idx = fromHash;
  setMode(pickMode());
  if (mode === 'deck') { bgEls[idx].classList.add('is-on'); chrome(); motes.toggle(!!slides[idx].dataset.motes); }
  else if (fromHash) slides[fromHash].scrollIntoView();
  chrome();
  window.__deck = { go: i => go(i), count: slides.length, ids: slides.map(s => s.id) };
})();
