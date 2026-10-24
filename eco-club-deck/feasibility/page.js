/* Renders the feasibility page from FS_DATA through the FS engine. Nothing here invents numbers:
   every figure on the page comes from model.js. */
(function () {
  'use strict';
  const D = window.FS_DATA, FS = window.FS, A = D.assumptions;
  const $ = (s, el = document) => el.querySelector(s);
  const state = { scn: 'mid', second: false, open: new Set() };
  const COL = { mid: '#3987e5', opt: '#199e70', phased: '#3987e5', all: '#d95926' };
  const SCN = { mid: 'المتوسط', opt: 'المتفائل' };
  const H = A.horizonYears;

  /* ---------- formatting (Arabic-Indic digits, Arabic number agreement) ---------- */
  const nf = (v, d = 0) => Number(v).toLocaleString('ar-EG', { minimumFractionDigits: d, maximumFractionDigits: d });
  const few = n => Number.isInteger(n) && n >= 3 && n <= 10;
  function money(v, d) {
    const a = Math.abs(v), s = v < 0 ? '−' : '';
    if (a >= 1e6) {
      const str = (a / 1e6).toFixed(d ?? (a >= 1e7 ? 1 : 2)).replace(/\.?0+$/, ''), x = +str;
      return `${s}${nf(x, (str.split('.')[1] || '').length)} ${few(x) ? 'ملايين' : 'مليون'} $`;
    }
    if (a >= 1e3) { const x = Math.round(a / 1e3); return `${s}${nf(x)} ${few(x) ? 'آلاف' : 'ألف'} $`; }
    return `${s}${nf(Math.round(a))} $`;
  }
  function months(n) {
    n = Math.round(n);
    if (n === 1) return 'شهر واحد';
    if (n === 2) return 'شهران';
    return few(n) ? `${nf(n)} أشهر` : `${nf(n)} شهراً`;
  }
  const yrs = m => `${nf(m / 12, 1)} سنة`;
  const years = y => (!isFinite(y) || y > 30 ? 'لا يسترد' : `${nf(y, 1)} سنة`);
  // the simulation counts months from 0; people count from 1
  const monthNo = m => `الشهر ${nf(m + 1)}`;
  const yearNo = m => `السنة ${nf(Math.floor(m / 12) + 1)}`;
  const pbClass = y => (!isFinite(y) || y > 12 ? 'bad' : y <= 2.5 ? 'good' : y <= 5 ? 'ok' : 'slow');
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };

  const ideaIds = D.phases.flatMap(p => p.ideas);
  const phaseOf = {};
  D.phases.forEach((p, i) => p.ideas.forEach(id => { phaseOf[id] = i; }));
  // phase 1 on its own, to show what the first 2 million earns back before anything else is built
  const D1 = { ...D, phases: [D.phases[0]] };
  // the focused club: everything except the last phase (polo and skeet on the neighbouring land)
  const lastIds = D.phases[D.phases.length - 1].ideas;
  const DF = { ...D, phases: D.phases.slice(0, -1), ideas: Object.fromEntries(Object.entries(D.ideas).filter(([id]) => !lastIds.includes(id))) };

  const cache = new Map();
  const sim = (scn, mode, opts = {}, data = D) => {
    const key = `${data === D ? 'D' : data === D1 ? 'D1' : 'DF'}|${scn}|${mode}|${opts.second ? 1 : 0}`;
    if (!cache.has(key)) cache.set(key, FS.simulate(data, scn, mode, opts));
    return cache.get(key);
  };
  const kp = (label, value, note) => `<div class="kpi"><span>${label}</span><b class="num">${value}</b>${note ? `<small>${note}</small>` : ''}</div>`;
  function pair(m, o, fmt = money) {
    return `<div class="pair"><div><i style="background:${COL.mid}"></i><span class="${m < 0 ? 'neg' : ''}">${fmt(m)}</span></div><div><i style="background:${COL.opt}"></i><span class="${o < 0 ? 'neg' : ''}">${fmt(o)}</span></div></div>`;
  }

  /* ---------- summary ---------- */
  function renderSummary() {
    const scn = state.scn;
    const ph = sim(scn, 'phased', { second: state.second }), self = sim(scn, 'phased'), two = sim(scn, 'phased', { second: true });
    const all = sim(scn, 'all'), st = FS.steady(D, scn), p1 = sim(scn, 'phased', {}, D1);
    const p1Profit = FS.phaseAdds(D, 0, scn).total, p1o = ph.phases[0];
    const opened = ph.phases.filter(p => p.start !== null).length;
    $('#sumPhased').innerHTML = `<h3><i style="background:${COL.phased}"></i>المشروع على مراحل</h3>
      <p class="sub">${state.second ? `${money(A.phase1Budget)} للمرحلة الأولى، ثم دفعة ثانية للمرحلة الثانية بعد سنة من الافتتاح، والباقي من أرباح النادي.` : `${money(A.phase1Budget)} للمرحلة الأولى، والباقي من أرباح النادي نفسه.`}</p>
      <div class="kpis">
        ${kp('استثمارك', money(ph.equity), state.second ? `${money(A.phase1Budget)} الآن و${money(ph.equity - A.phase1Budget)} في ${monthNo(ph.injectedAt)}` : 'المرحلة الأولى فقط')}
        ${kp('افتتاح المرحلة الأولى', `بعد ${months(p1o.open)}`, `${months(A.predevMonths)} موافقات ثم ${months(p1o.build)} بناء`)}
        ${kp('ربح المرحلة الأولى السنوي', money(p1Profit), p1.payback ? `بعد المصاريف العامة، وتعيد كلفتها خلال ${yrs(p1.payback)} من البداية` : 'بعد المصاريف العامة')}
        ${kp('اكتمال كل المراحل', ph.fullOpen === null ? `ليس خلال ${nf(H)} سنة` : `بعد ${yrs(ph.fullOpen)}`, ph.fullOpen === null ? `تبدأ ${nf(opened)} من ${nf(ph.phases.length)} مراحل` : `ربح النادي في السنة العاشرة ${money(ph.year[9].op)}`)}
      </div>`;
    $('#sumAll').innerHTML = `<h3><i style="background:${COL.all}"></i>كل الأفكار معاً</h3><p class="sub">تمويل كامل من البداية، وبناء متوازٍ بعد الموافقات.</p>
      <div class="kpis">
        ${kp('الاستثمار الكلي', money(all.equity), `بناء ${money(all.totalCapex)} و${money(A.workingCapital.all)} للإطلاق والتشغيل`)}
        ${kp('مدة التنفيذ', months(all.fullOpen), `${months(A.predevMonths)} موافقات ثم ${months(all.fullOpen - A.predevMonths)} بناء`)}
        ${kp('الربح السنوي عند النضج', money(st.op), `قبل الضريبة؛ بعدها ${money(st.net)}`)}
        ${kp('استرداد رأس المال', all.payback === null ? `بعد ${nf(H)} سنة` : yrs(all.payback), 'من بداية المشروع، مع فترة الامتلاء')}
      </div>`;

    const p2 = self.phases[1];
    const head = `<b>الخلاصة في السيناريو ${SCN[scn]}:</b> الـ${money(A.phase1Budget)} تكفي لمرحلة أولى تفتح بعد ${months(p1o.open)} وتربح نحو ${money(p1Profit)} سنوياً بعد المصاريف العامة.`;
    const allLine = `وإذا توفّر المال كاملاً من البداية، فبناء كل شيء دفعة واحدة (${money(all.equity)}) يكتمل في ${months(all.fullOpen)} ويعيد رأس المال خلال ${all.payback ? yrs(all.payback) : `أكثر من ${nf(H)} سنة`}، وهو الأعلى عائداً لكن بمخاطرة أكبر بكثير.`;
    const twoLine = two.fullOpen === null ? '' : `مع دفعة ثانية بنحو ${money(two.equity - A.phase1Budget)} بعد سنة من الافتتاح، يكتمل النادي كله بعد ${yrs(two.fullOpen)}.`;
    $('#verdict').innerHTML = self.fullOpen === null
      ? `${head} لكن أرباحها وحدها <b>بطيئة في بناء الباقي</b>: المرحلة الثانية لا تبدأ قبل ${p2.start === null ? `${nf(H)} سنة` : yearNo(p2.start)}. ${twoLine ? `الحل الواقعي: ${twoLine}` : ''} ${allLine}`
      : `${head} وأرباح النادي <b>تكفي لبناء الباقي وحدها</b>: يكتمل كله بعد ${yrs(self.fullOpen)} بلا قروض. ${twoLine} ${allLine}`;
    renderAdvice();
  }

  // which ideas carry the club, which drag it, and what the club looks like without the weakest phase
  function renderAdvice() {
    const scn = state.scn;
    const rows = ideaIds.filter(id => D.ideas[id].rev.length).map(id => ({ id, ...FS.ideaPL(D.ideas[id], scn, A) }));
    const strong = rows.filter(r => r.payback <= 3).sort((a, b) => a.payback - b.payback);
    const weak = rows.filter(r => r.payback > 7).sort((a, b) => b.payback - a.payback);
    const li = r => `<li><span>${D.ideas[r.id].name}</span><b class="pb ${pbClass(r.payback)}">${years(r.payback)}</b></li>`;
    const full = FS.steady(D, scn), foc = FS.steady(DF, scn);
    const fa = sim(scn, 'all', {}, DF), aa = sim(scn, 'all');
    const names = lastIds.map(id => D.ideas[id].name).join(' و');
    $('#advice').innerHTML = `
      <div class="card"><h3>الأسرع استرداداً</h3><p class="sub">تعيد كلفتها في ثلاث سنوات أو أقل (السيناريو ${SCN[scn]})</p><ul class="list">${strong.map(li).join('')}</ul></div>
      <div class="card"><h3>الأضعف مالياً</h3><p class="sub">أكثر من سبع سنوات؛ قيمتها في الصورة والجذب أكثر من الربح</p><ul class="list">${weak.map(li).join('')}</ul></div>
      <div class="card"><h3>نسخة مركّزة: بدون ${names}</h3><p class="sub">المرحلة السادسة تحتاج أرضاً إضافية وتكاد لا تربح</p>
        <ul class="list">
          <li><span>كلفة البناء</span><b>${money(foc.capex)} <s>${money(full.capex)}</s></b></li>
          <li><span>ربح النادي السنوي</span><b>${money(foc.op)} <s>${money(full.op)}</s></b></li>
          <li><span>الاسترداد البسيط</span><b>${years(foc.payback)} <s>${years(full.payback)}</s></b></li>
          <li><span>استرداد البناء دفعة واحدة</span><b>${fa.payback ? yrs(fa.payback) : '—'} <s>${aa.payback ? yrs(aa.payback) : '—'}</s></b></li>
        </ul></div>`;
  }

  /* ---------- ideas table ---------- */
  function renderIdeas() {
    const tb = $('#ideasBody');
    tb.innerHTML = '';
    const tot = { capex: 0, revM: 0, revO: 0, opM: 0, opO: 0 };
    for (const id of ideaIds) {
      const it = D.ideas[id], m = FS.ideaPL(it, 'mid', A), o = FS.ideaPL(it, 'opt', A), cur = state.scn === 'mid' ? m : o;
      tot.capex += m.capex; tot.revM += m.rev; tot.revO += o.rev; tot.opM += m.op; tot.opO += o.op;
      const tr = el('tr', 'idea');
      tr.tabIndex = 0;
      tr.setAttribute('aria-expanded', String(state.open.has(id)));
      tr.innerHTML = `<td class="nm"><b>${it.name}</b><span>${it.tag}</span></td>
        <td data-l="المرحلة"><span class="ph">${D.phases[phaseOf[id]].short}</span></td>
        <td class="n" data-l="الكلفة">${money(m.capex)}</td>
        <td class="n" data-l="مدة التنفيذ">${months(it.build)}</td>
        ${it.rev.length ? `<td class="n" data-l="الإيراد السنوي">${pair(m.rev, o.rev)}</td>
        <td class="n" data-l="ربح الفكرة السنوي">${pair(m.op, o.op)}</td>
        <td class="n" data-l="الاسترداد">${pair(m.payback, o.payback, years)}</td>` : '<td class="n small wide" colspan="3">بنية تحتية: تخدم كل الأفكار ولا إيراد مباشر لها</td>'}`;
      const toggle = () => { state.open.has(id) ? state.open.delete(id) : state.open.add(id); renderIdeas(); };
      tr.addEventListener('click', toggle);
      tr.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
      tb.appendChild(tr);
      if (state.open.has(id)) tb.appendChild(detailRow(it, m, cur));
    }
    const st = { mid: FS.steady(D, 'mid'), opt: FS.steady(D, 'opt') };
    const e = '<td class="e"></td>';
    $('#ideasFoot').innerHTML = `
      <tr><td class="nm">مجموع الأفكار</td>${e}<td class="n" data-l="الكلفة">${money(tot.capex)}</td>${e}<td class="n" data-l="الإيراد السنوي">${pair(tot.revM, tot.revO)}</td><td class="n" data-l="ربح الأفكار">${pair(tot.opM, tot.opO)}</td>${e}</tr>
      <tr><td class="nm">العضوية: انتساب واشتراكات (${nf(st.mid.membersN)} أو ${nf(st.opt.membersN)} عضوية)</td>${e}${e}${e}<td class="n" data-l="الإيراد السنوي">${pair(st.mid.memberRev, st.opt.memberRev)}</td><td class="n" data-l="ربح العضوية">${pair(st.mid.memberRev - st.mid.memberCost, st.opt.memberRev - st.opt.memberCost)}</td>${e}</tr>
      <tr><td class="nm">مصاريف النادي العامة (إدارة، أمن، تسويق، صيانة، وقود)</td>${e}${e}${e}${e}<td class="n" data-l="الكلفة السنوية">${pair(-st.mid.overhead, -st.opt.overhead)}</td>${e}</tr>
      <tr class="grand"><td class="nm">النادي كاملاً<span>الربح بعد المصاريف العامة وقبل الضريبة</span></td>${e}<td class="n" data-l="الكلفة">${money(st.mid.capex)}</td>${e}<td class="n" data-l="الإيراد السنوي">${pair(st.mid.rev, st.opt.rev)}</td><td class="n" data-l="ربح النادي">${pair(st.mid.op, st.opt.op)}</td><td class="n" data-l="الاسترداد البسيط">${pair(st.mid.payback, st.opt.payback, years)}</td></tr>`;
  }
  function detailRow(it, m, cur) {
    const d = el('tr', 'detail'), td = el('td');
    td.colSpan = 7;
    const s = state.scn;
    const lines = it.rev.map(r => {
      const per = r.per === 'day' ? ` × ${nf(r.days)} يوماً` : r.per === 'month' ? ' × ١٢ شهراً' : '';
      return `<li><span>${r.label}: ${nf(r.q[s])} ${r.unit} × ${nf(r.p[s])} $${per}</span><b>${money(FS.driverValue(r, s))}</b></li>`;
    }).join('');
    td.innerHTML = `<div class="det">
      <div><h4>تفصيل الكلفة</h4><ul>${it.capex.map(c => `<li><span>${c.n}</span><b>${money(c.v)}</b></li>`).join('')}
        <li><span>التصميم والإشراف ${nf(A.designPct * 100)}٪</span><b>${money(m.design)}</b></li>
        <li><span>احتياطي الطوارئ ${nf(A.contingency * 100)}٪</span><b>${money(m.contingency)}</b></li>
        <li class="tot"><span>المجموع بأسعار اليوم</span><b>${money(m.capex)}</b></li></ul></div>
      <div><h4>الإيرادات السنوية، السيناريو ${SCN[s]}</h4>${it.rev.length ? `<ul>${lines}
        ${cur.tax ? `<li><span>ضريبة المبيعات ${nf(it.salesTax * 100)}٪ ضمن الأسعار</span><b>−${money(cur.tax)}</b></li>` : ''}
        <li class="tot"><span>صافي الإيراد</span><b>${money(cur.rev)}</b></li></ul>` : '<p>لا إيراد مباشر.</p>'}</div>
      <div><h4>التكاليف والربح، السيناريو ${SCN[s]}</h4>${it.rev.length ? `<ul>
        <li><span>تكاليف متغيرة (${nf(it.varPct * 100)}٪ من الإيراد)</span><b>${money(cur.variable)}</b></li>
        <li><span>احتياطي تجديد المعدات ${nf(A.renewalPct * 100)}٪</span><b>${money(cur.renewal)}</b></li>
        <li><span>تكاليف ثابتة (رواتب وصيانة)</span><b>${money(cur.fixed)}</b></li>
        <li class="tot"><span>ربح الفكرة قبل مصاريف النادي العامة</span><b class="${cur.op < 0 ? 'neg' : ''}">${money(cur.op)}</b></li>
        <li><span>هامش الربح</span><b>${nf(cur.margin * 100)}٪</b></li></ul>` : ''}
        <p>${it.note}</p>${it.risk ? `<p class="risk">${it.risk}</p>` : ''}</div></div>`;
    d.appendChild(td);
    return d;
  }

  /* ---------- line chart with crosshair tooltip ---------- */
  function lineChart(host, series, opt = {}) {
    host.innerHTML = '';
    host._redraw = () => lineChart(host, series, opt);
    const narrow = host.clientWidth < 640;
    const Wd = Math.max(320, Math.min(1000, host.clientWidth || 1000)), Ht = narrow ? 250 : 320, pl = narrow ? 70 : 82, pr = 12, pt = 26, pb = 30;
    const xmax = Math.max(...series.map(s => s.points.length - 1));
    const ys = series.flatMap(s => s.points.map(p => p.y)).concat(opt.zero ? [0] : []);
    let ymin = Math.min(...ys), ymax = Math.max(...ys);
    const pad = (ymax - ymin) * 0.06 || 1;
    ymin -= pad; ymax += pad;
    const X = x => pl + (x / xmax) * (Wd - pl - pr), Y = y => pt + (1 - (y - ymin) / (ymax - ymin)) * (Ht - pt - pb);
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${Wd} ${Ht}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', opt.label || '');
    const add = (tag, attrs, text) => { const e = document.createElementNS(ns, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text !== undefined) e.textContent = text; svg.appendChild(e); return e; };
    const step = niceStep((ymax - ymin) / (narrow ? 4 : 5));
    for (let v = Math.ceil(ymin / step) * step; v <= ymax; v += step) {
      add('line', { x1: pl, x2: Wd - pr, y1: Y(v), y2: Y(v), stroke: Math.abs(v) < step / 2 ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.07)', 'stroke-width': 1 });
      add('text', { x: pl - 8, y: Y(v) + 4, 'text-anchor': 'end' }, money(v, 1));
    }
    const yStep = narrow ? 3 : 1;
    for (let yv = 0; yv * 12 <= xmax; yv += yStep) add('text', { x: X(yv * 12), y: Ht - 10, 'text-anchor': 'middle' }, yv === 0 ? 'البداية' : `س${nf(yv)}`);
    for (const s of series) {
      const d = s.points.map((p, i) => `${i ? 'L' : 'M'}${X(p.x).toFixed(1)},${Y(p.y).toFixed(1)}`).join('');
      add('path', { d, fill: 'none', stroke: s.color, 'stroke-width': 2, 'stroke-linejoin': 'round' });
    }
    for (const s of series) {
      let lastX = -Infinity;
      for (const mk of s.markers || []) {
        const p = s.points[Math.min(mk.x, s.points.length - 1)];
        add('circle', { cx: X(p.x), cy: Y(p.y), r: 5, fill: s.color, stroke: '#0d1016', 'stroke-width': 2 });
        if (X(p.x) - lastX < 30) continue;   // crowded markers keep their dot, lose the label
        lastX = X(p.x);
        add('text', { x: X(p.x), y: Y(p.y) - 11, 'text-anchor': 'middle', style: 'fill:#f3f1ec;font-size:12px' }, mk.label);
      }
    }
    const cross = add('line', { y1: pt, y2: Ht - pb, stroke: 'rgba(255,255,255,.35)', 'stroke-width': 1, opacity: 0 });
    const hit = add('rect', { x: pl, y: pt, width: Wd - pl - pr, height: Ht - pt - pb, fill: 'transparent' });
    host.appendChild(svg);
    const tip = el('div', 'tip');
    host.appendChild(tip);
    const show = clientX => {
      const r = svg.getBoundingClientRect(), vx = (clientX - r.left) / r.width * Wd;
      const xm = Math.max(0, Math.min(xmax, Math.round((vx - pl) / (Wd - pl - pr) * xmax)));
      cross.setAttribute('x1', X(xm)); cross.setAttribute('x2', X(xm)); cross.setAttribute('opacity', 1);
      tip.innerHTML = `<div class="t">${monthNo(xm)}، ${yearNo(xm)}</div>` + series.map(s => `<div class="r"><b>${money(s.points[Math.min(xm, s.points.length - 1)].y)}</b><span>${s.name}<i style="background:${s.color}"></i></span></div>`).join('');
      tip.classList.add('on');
      const px = X(xm) / Wd * r.width, hr = host.getBoundingClientRect();
      const left = r.left - hr.left + px + (px > r.width * 0.55 ? -tip.offsetWidth - 14 : 14);
      tip.style.left = `${Math.max(4, Math.min(hr.width - tip.offsetWidth - 4, left))}px`;
      tip.style.top = `${r.top - hr.top + 30}px`;
    };
    const hide = () => { tip.classList.remove('on'); cross.setAttribute('opacity', 0); };
    hit.addEventListener('pointerdown', e => show(e.clientX));
    hit.addEventListener('pointermove', e => show(e.clientX));
    hit.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') hide(); });
    document.addEventListener('pointerdown', e => { if (!svg.contains(e.target)) hide(); });
  }
  function niceStep(raw) {
    const p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p;
    return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * p;
  }

  /* ---------- phases ---------- */
  function renderPhases() {
    const scn = state.scn;
    const ph = sim(scn, 'phased', { second: state.second });
    const p1 = ph.phases[0];
    const tok = { pre: A.predevMonths, s: A.predevMonths + 1, ie: A.predevMonths + D.ideas[p1.ideas[0]].build, e: p1.open,
                  o1: Math.min(...p1.ideas.map(id => ph.ideaOpen[id])) + 1, o: p1.open + 1 };
    $('#startPlan').innerHTML = D.startPlan.map(([w, t]) => `<li><b>${w.replace(/\{(\w+)\}/g, (_, k) => nf(tok[k]))}</b>${t}</li>`).join('');
    const ten = ph.series.slice(0, 120).reduce((s, x) => s + x.op, 0);
    $('#phStats').innerHTML = `
      ${kp('استثمارك', money(ph.equity), state.second ? `منها ${money(ph.equity - A.phase1Budget)} في ${monthNo(ph.injectedAt)}` : 'الباقي من أرباح النادي')}
      ${kp(`بُني خلال ${nf(H)} سنة`, money(ph.built), `من ${money(sim(scn, 'all').totalCapex)} بأسعار اليوم`)}
      ${kp('اكتمال كل المراحل', ph.fullOpen === null ? `ليس خلال ${nf(H)} سنة` : `بعد ${yrs(ph.fullOpen)}`, ph.fullOpen === null ? `تبدأ ${nf(ph.phases.filter(p => p.start !== null).length)} من ${nf(ph.phases.length)} مراحل` : months(ph.fullOpen))}
      ${kp('ربح تشغيلي في أول ١٠ سنوات', money(ten), 'يُعاد استثماره في المراحل التالية')}`;
    const box = $('#phaseCards');
    box.innerHTML = '';
    ph.phases.forEach((p, i) => {
      const add = { mid: FS.phaseAdds(D, i, 'mid').total, opt: FS.phaseAdds(D, i, 'opt').total };
      const cost = p.start === null ? null : p.cost * (i === 0 ? 1 : 1 + A.preOpening.pct);
      const when = p.start === null
        ? `لا تبدأ خلال ${nf(H)} سنة بهذا التمويل`
        : `${i === 0 ? 'البناء يبدأ' : 'تبدأ'} ${monthNo(p.start)}، وتفتح ${monthNo(p.open)} (${yearNo(p.open)})<small>مدة التنفيذ ${months(p.open - p.start)}${p.start === ph.injectedAt ? '، بالدفعة الثانية' : i ? '، من أرباح النادي' : ''}</small>`;
      const c = el('article', `phase${i === 0 ? ' p1' : ''}`);
      c.innerHTML = `<header><b>${p.name}</b><span class="num">${money(cost ?? p.capex)}</span></header>
        ${cost !== null && Math.abs(cost - p.capex) > 0.01 * p.capex ? `<div class="small">بأسعار اليوم ${money(p.capex)}، والفرق ارتفاع الأسعار${i ? ' وكلفة الإطلاق' : ''}</div>` : ''}
        <div class="when">${when}</div>
        <ul>${p.ideas.map(id => `<li>${D.ideas[id].name}<small>${months(D.ideas[id].build)}</small></li>`).join('')}</ul>
        <div class="row"><span>ربح سنوي تضيفه بعد مصاريفها</span>${pair(add.mid, add.opt)}</div>
        <div class="row"><span>أعضاء النادي بعدها (${SCN[scn]})</span><b class="num">${nf(A.members[scn][i])}</b></div>
        <p>${p.why}</p>`;
      box.appendChild(c);
    });
    const markers = ph.phases.filter(p => p.start !== null).map(p => ({ x: p.open, label: p.short }));
    // once everything is open the fund only grows, so the chart stops two years later
    const span = ph.fullOpen === null ? ph.series.length : Math.min(ph.series.length, ph.fullOpen + 25);
    lineChart($('#cashChart'), [{ name: `السيناريو ${SCN[scn]}`, color: COL[scn], points: ph.series.slice(0, span).map(x => ({ x: x.m, y: x.cash })), markers }],
      { label: 'رصيد صندوق النادي في خطة المراحل', zero: true });
    $('#cashLegend').innerHTML = `<span><i style="background:${COL[scn]}"></i>السيناريو ${SCN[scn]}</span><span class="small">النقاط: افتتاح كل مرحلة. الهبوط: الصرف على بناء المرحلة التالية${ph.fullOpen === null ? '' : '. بعد اكتمال النادي تصبح الأرباح قابلة للتوزيع'}</span>`;
  }

  /* ---------- all at once ---------- */
  function renderAll() {
    const scn = state.scn;
    const all = sim(scn, 'all'), ph = sim(scn, 'phased', { second: state.second });
    const pre = A.predevMonths, end = all.fullOpen, pct = m => (m / end * 100).toFixed(2);
    $('#allLead').textContent = `بعد ${months(pre)} من الموافقات والتصاميم تبدأ كل الأعمال معاً. لا تفتح أي فكرة قبل أن تجهز البنية الأساسية، ثم تفتح كل فكرة حين ينتهي تنفيذها. يكتمل النادي بعد ${months(end)}.`;
    const ticks = [];
    for (let m = 0; m <= end - 3; m += 6) ticks.push(m);
    ticks.push(end);
    $('#gantt').innerHTML = `<div class="g-row g-pre"><span>الموافقات والتصاميم</span><div class="g-track"><div class="g-bar pre" style="inset-inline-start:0;width:${pct(pre)}%"></div></div></div>` +
      ideaIds.map(id => {
        const it = D.ideas[id], s = all.ideaStart[id], o = all.ideaOpen[id], own = s + it.build;
        const wait = o > own ? `<div class="g-bar wait" style="inset-inline-start:${pct(own)}%;width:${pct(o - own)}%"></div>` : '';
        return `<div class="g-row"><span>${it.name}</span><div class="g-track"><div class="g-bar" style="inset-inline-start:${pct(s)}%;width:${pct(it.build)}%"></div>${wait}<em style="inset-inline-start:calc(${pct(o)}% + 6px)">${months(it.build)}</em></div></div>`;
      }).join('') +
      `<div class="g-axis"><span>الشهر</span><div>${ticks.map(m => `<i style="inset-inline-start:${pct(m)}%">${nf(m)}</i>`).join('')}</div></div>`;
    let cum = 0;
    $('#allYears').innerHTML = all.year.slice(0, 10).map((y, i) => {
      cum += y.op - y.capex;
      return `<tr><td class="nm">السنة ${nf(i + 1)}</td><td class="n" data-l="الإيرادات">${money(y.rev)}</td><td class="n" data-l="التكاليف التشغيلية">${money(y.cost)}</td><td class="n ${y.op < 0 ? 'neg' : ''}" data-l="الربح التشغيلي">${money(y.op)}</td><td class="n" data-l="صرف على البناء">${y.capex ? money(y.capex) : '—'}</td><td class="n ${cum < 0 ? 'neg' : ''}" data-l="الرصيد التراكمي">${money(cum)}</td></tr>`;
    }).join('');
    lineChart($('#cmpChart'), [
      { name: state.second ? 'على مراحل مع دفعة ثانية' : 'على مراحل', color: COL.phased, points: ph.cum.map((y, x) => ({ x, y })) },
      { name: 'كل الأفكار معاً', color: COL.all, points: all.cum.map((y, x) => ({ x, y })) },
    ], { label: 'صافي النقد التراكمي للمستثمر', zero: true });
    $('#cmpLegend').innerHTML = `<span><i style="background:${COL.phased}"></i>${state.second ? 'على مراحل مع دفعة ثانية' : 'على مراحل'}</span><span><i style="background:${COL.all}"></i>كل الأفكار معاً</span><span class="small">تحت الصفر: مال صُرف ولم يعد بعد. السيناريو ${SCN[scn]}</span>`;
  }

  /* ---------- assumptions ---------- */
  function renderAssumptions() {
    $('#phLead').textContent = `المرحلة الأولى تموّلها الـ${money(A.phase1Budget)}: البنية الأساسية، ومطعم سيدوري، وشارع الفود ترك، وببل تاون، والبرنامج الأخضر. كل مرحلة تالية تبدأ بعد افتتاح السابقة، عندما يغطي صندوق النادي ${nf(A.upfrontShare * 100)}٪ من كلفتها مع احتياطي ${months(A.reserveMonths)} من المصاريف، وتغطي أرباح أشهر البناء الباقي، بلا قروض.`;
    $('#assume').innerHTML = A.display.map(([k, v]) => `<li><span>${k}</span><b>${v}</b></li>`).join('');
    $('#overhead').innerHTML = A.overheadItems.map(([k, v]) => `<li><span>${k}</span><b>${money(v)}</b></li>`).join('') +
      `<li><span>المجموع عند اكتمال النادي (يبدأ من ${money(A.overhead[0])} في المرحلة الأولى)</span><b>${money(A.overhead[A.overhead.length - 1])}</b></li>`;
    $('#risks').innerHTML = D.risks.map(r => `<li><b>${r[0]}:</b> ${r[1]}</li>`).join('');
    $('#sources').innerHTML = D.sources.map(s => `<li>${s.t}: <a href="${s.u}" target="_blank" rel="noopener">${decodeURI(s.u).replace(/^https?:\/\/(www\.)?/, '').slice(0, 60)}</a></li>`).join('');
  }

  function renderAll_() { renderSummary(); renderIdeas(); renderPhases(); renderAll(); }

  document.querySelectorAll('[data-scn]').forEach(b => b.addEventListener('click', () => {
    state.scn = b.dataset.scn;
    document.querySelectorAll('[data-scn]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.scn === state.scn)));
    renderAll_();
  }));
  document.querySelectorAll('[data-fund]').forEach(b => b.addEventListener('click', () => {
    state.second = b.dataset.fund === 'second';
    document.querySelectorAll('[data-fund]').forEach(x => x.setAttribute('aria-pressed', String((x.dataset.fund === 'second') === state.second)));
    renderAll_();
  }));
  let rw = innerWidth;
  addEventListener('resize', () => { if (Math.abs(innerWidth - rw) < 40) return; rw = innerWidth; document.querySelectorAll('#cashChart, #cmpChart').forEach(h => h._redraw && h._redraw()); });
  renderAssumptions();
  renderAll_();
  window.__fs = { state, render: renderAll_ };
})();
