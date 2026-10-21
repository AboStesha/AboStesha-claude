(function () {
  const M = window.MODEL, C = window.CONTENT, V = window.Vox, X = window.Models;
  const $ = id => document.getElementById(id);
  const fm = (v, d = 1) => (v < 0 ? '−' : '') + '$' + Math.abs(v / 1e6).toFixed(d) + 'M';
  const fk = v => v >= 1e6 ? '$' + (v / 1e6).toFixed(2).replace(/0$/, '') + 'M' : '$' + Math.round(v / 1e3) + 'K';
  const num = h => `<span class="num">${h}</span>`;
  const AR_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const monthAr = m => { const d = new Date(2027, m - 1, 1); return AR_MONTHS[d.getMonth()] + ' ' + d.getFullYear(); };
  const put = (id, html) => { const el = $(id); if (el) el.innerHTML = html; };
  const kpi = k => `<div class="kpi"><div class="v ${k.cls || ''} ${k.ar ? 'ar' : ''}">${k.v}</div><div class="l">${k.l}</div></div>`;

  // ---------- voxel art ----------
  const vox = (id, model, opts = {}) => { const el = $(id); if (el) el.innerHTML = V.svg(model, Object.assign({ s: 8 }, opts)); };
  const crew = X.crew();
  vox('v-office', X.officeScene(), { s: 10 });
  vox('v-producer', crew.producer.rot(3));
  vox('v-assistant', crew.assistant);
  ['writer', 'director', 'casting', 'art', 'dop', 'editor', 'composer'].forEach(k => vox('v-' + k, crew[k]));
  vox('v-cinema', X.cinemaScene(), { s: 6 });
  vox('v-agency', X.agencyScene(), { s: 9 });
  vox('v-remix', X.remixScene());
  vox('v-cinema-ico', X.cinemaIcon());
  vox('v-ads-ico', X.adProduct());

  // studio scene + camera frustum overlay from the tablet towards the actors
  (function () {
    const m = X.studioScene();
    $('v-studio').innerHTML = V.svg(m, {
      s: 9, overlay: P => {
        const a = P(24, 33.5, 10), t1 = P(31, 21, 23), t2 = P(31, 32, 23), t3 = P(31, 32, 0), t4 = P(31, 21, 0);
        const poly = q => q.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
        return `<polygon points="${poly([a, t1, t2])}" fill="rgba(69,214,255,.10)"/>` +
          [t1, t2, t3, t4].map(t => `<line x1="${a[0]}" y1="${a[1]}" x2="${t[0]}" y2="${t[1]}" stroke="#45d6ff" stroke-width="2" stroke-dasharray="6 6" opacity=".85"/>`).join('') +
          `<polygon points="${poly([t1, t2, t3, t4])}" fill="none" stroke="#45d6ff" stroke-width="3"/>`;
      }
    });
    $('v-blockshot').innerHTML = '<img src="img/blockshot.jpg" style="width:100%;height:100%;object-fit:cover;display:block">';
  })();
  $('render-img').style.backgroundImage = `url(${C.renderImage})`;

  // ---------- shared numbers ----------
  const Y = M.years, Q = M.quarters;
  const invest = M.funding.reduce((s, f) => s + f.amount, 0);
  const outside = invest - M.funding.filter(f => f.name === 'Founder capital').reduce((s, f) => s + f.amount, 0);
  const fundRows = M.funding.map(f => `<span class="fr-row">${C.fundAr[f.name]} · الشهر ${num(f.month)} · ${num(fk(f.amount))}</span>`).join('');

  // ---------- cover ----------
  put('c-invest', fm(invest, 1));
  put('c-invest-l', `إجمالي التمويل (منه ${num(fm(outside, 2))} من مستثمرين)`);
  put('c-be', monthAr(M.breakeven_month));
  put('c-be-l', `نقطة التعادل الشهرية (الشهر ${num(M.breakeven_month)})`);
  put('c-5y', '+' + fm(M.total_5y));

  // ---------- slide 2 ----------
  put('mk-grid', C.market.map(k => `<div class="kpi"><div class="v ${k.cls || ''}">${k.v}</div><div class="l">${k.l}</div>${k.s ? `<div class="s">${k.s}</div>` : ''}</div>`).join(''));
  put('proof-text', C.proof);
  put('src-2', C.src2);

  // ---------- slide 7 ----------
  put('comp-sub', C.compSub);
  const mark = v => `<i class="d ${['n', 'p', 'y', 'pl'][v]}"></i>`;
  put('comp-table', `<tr><th>المنصة</th>${C.compCols.map(c => `<th>${c}</th>`).join('')}</tr>` +
    C.comp.map(r => `<tr class="${r.us ? 'us' : ''}"><td>${r.n}<small>${r.d}</small></td>${r.v.map(v => `<td>${mark(v)}</td>`).join('')}</tr>`).join(''));
  put('comp-threat', C.compThreat);
  put('comp-moat', C.compMoat);
  put('src-7', C.src7);

  // ---------- slide 8 ----------
  const lv = { h: 'مرتفع', m: 'متوسط', l: 'منخفض' };
  put('legal-table', `<tr><th>الخطر</th><th>المستوى</th><th>الحل داخل المنتج</th></tr>` +
    C.legal.map(r => `<tr><td><b>${r.r}</b><br><span class="muted">${r.why}</span></td><td><span class="lvl ${r.l}">${lv[r.l]}</span></td><td>${r.fix}</td></tr>`).join(''));
  put('legal-rules', C.legalRules.map(t => `<li>${t}</li>`).join(''));
  put('legal-cost', C.legalCost.map(([a, b], i, arr) => `<div class="lc ${i === arr.length - 1 ? 't' : ''}"><span>${a}</span><span class="num">${b}</span></div>`).join(''));
  put('src-8', C.src8);

  // ---------- slide 9 ----------
  put('stack', C.stack.map(l => `<div class="layer"><div class="ln" style="background:${l.bg};color:${l.fg}">${l.n}<small>${l.en}</small></div><div class="items">${l.items.map(i => `<span class="${i.startsWith('*') ? 'k' : ''}">${i.replace('*', '')}</span>`).join('')}</div></div>`).join(''));
  put('unit-table', `<tr><th>البند</th><th>تكلفتنا</th><th>سعر البيع</th><th>الهامش</th></tr>` + C.unit.map(u => `<tr><td>${u[0]}</td>${[u[1], u[2], u[3]].map((v, i) => /[؀-ۿ]/.test(v) ? `<td class="muted" style="font-size:15px">${v}</td>` : `<td><span class="num${i === 2 ? ' c-green' : ''}">${v}</span></td>`).join('')}</tr>`).join(''));
  put('cheap-list', C.cheap.map(t => `<li class="g">${t}</li>`).join(''));
  put('src-9', C.src9);

  // ---------- slide 10 ----------
  put('team-table', `<tr><th>الدور</th><th>الانضمام</th><th>التكلفة الشهرية</th></tr>` + C.team.map((t, i, a) => `<tr class="${i === a.length - 1 ? 'tot' : ''}"><td>${t[0]}</td><td>${t[1]}</td><td><span class="num">${t[2]}</span></td></tr>`).join(''));
  put('team-note', C.teamNote);
  put('g-legend', C.ganttLegend.map(([c, t]) => `<span><i style="background:${c}"></i>${t}</span>`).join(''));
  (function gantt() {
    const qs = ['Q1 2027', 'Q2', 'Q3', 'Q4', 'Q1 2028', 'Q2', 'Q3', 'Q4'];
    let h = `<div class="g-head">${qs.map(q => `<span>${q}</span>`).join('')}<span></span></div>`;
    h += C.gantt.map(g => {
      const cells = g.ms ? `<div class="g-bar ms" style="grid-column:${g.s + 1};grid-row:1;background:${g.c}"></div>` :
        `<div class="g-bar" style="grid-column:${g.s + 1} / ${g.e + 2};grid-row:1;background:${g.c}"></div>`;
      const grid = [0, 3, 6, 9, 12, 15, 18, 21].map(q => `<div class="g-grid" style="grid-column:${q + 1};grid-row:1"></div>`).join('');
      return `<div class="g-row">${grid}<div class="gl" style="grid-column:25;grid-row:1">${g.n}</div>${cells}</div>`;
    }).join('');
    put('gantt', h);
  })();
  put('first-steps', C.firstSteps.map(t => `<li>${t}</li>`).join(''));
  put('lean-text', C.leanText);

  // ---------- slide 11 ----------
  put('sma-kpis', C.smaKpis(Y).map(kpi).join(''));
  put('sma-verdict', C.smaVerdict);
  put('src-11', C.src11);

  // ---------- slide 12 ----------
  put('fin-kpis', [
    { v: fm(M.pre_launch_cost, 2), l: 'تكلفة البناء حتى أول إطلاق (4 أشهر)' },
    { v: fm(M.full_build.spend, 2), l: `تكلفة السنة الأولى حتى اكتمال المنتج (ديسمبر 2027) — الصافي ${num(fm(M.full_build.net, 2))} بعد الإيراد` },
    { v: fm(invest, 1), l: `التمويل:${fundRows}`, cls: 'c-amber' },
    { v: fk(M.monthly_opex_y1), l: 'متوسط المصروفات التشغيلية شهرياً في السنة الأولى (دون تكلفة التوليد)' },
    { v: String(Y[4].hc), l: `حجم الفريق بنهاية 2031 (من ${num(Y[0].hc)} بنهاية 2027)` },
  ].map(kpi).join(''));

  (function qchart() {
    const W = 1680, H = 515, padL = 64, padR = 90, top = 16, chartH = 340, rowH = 33;
    const maxV = Math.max(...Q.map(q => Math.max(q.rev, q.spend)), ...M.cumcash) * 1.08;
    const n = Q.length, gw = (W - padL - padR) / n, bw = gw * 0.34;
    const y = v => top + chartH - (v / maxV) * chartH;
    let s = `<svg viewBox="0 0 ${W} ${H}" font-family="Space Grotesk, sans-serif" direction="ltr">`;
    for (let t = 0; t <= maxV; t += 5e6) {
      s += `<line x1="${padL}" x2="${W - padR}" y1="${y(t)}" y2="${y(t)}" stroke="#262634" stroke-width="1"/>`;
      s += `<text x="${padL - 10}" y="${y(t) + 5}" text-anchor="end" fill="#8E8BA0" font-size="15">${t / 1e6}</text>`;
    }
    for (let i = 0; i < 5; i++) {
      const x0 = padL + i * 4 * gw;
      s += `<rect x="${x0}" y="${top}" width="${4 * gw}" height="${chartH}" fill="${i % 2 ? 'rgba(255,255,255,.018)' : 'transparent'}"/>`;
      s += `<text x="${x0 + 2 * gw}" y="${top + 18}" text-anchor="middle" fill="#A9A6B8" font-size="16" font-weight="700">${2027 + i}</text>`;
    }
    Q.forEach((q, i) => {
      const cx = padL + i * gw + gw / 2;
      s += `<rect x="${cx - bw - 2}" y="${y(q.spend)}" width="${bw}" height="${Math.max(1, top + chartH - y(q.spend))}" rx="3" fill="#E8794A"/>`;
      s += `<rect x="${cx + 2}" y="${y(q.rev)}" width="${bw}" height="${Math.max(1, top + chartH - y(q.rev))}" rx="3" fill="#5BE38B"/>`;
    });
    const pts = Q.map((q, i) => [padL + i * gw + gw / 2, y(M.cumcash[i * 3 + 2])]);
    s += `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="#45D6FF" stroke-width="2.5" stroke-dasharray="8 6"/>`;
    pts.forEach(p => { s += `<rect x="${p[0] - 3.5}" y="${p[1] - 3.5}" width="7" height="7" fill="#45D6FF"/>`; });
    const last = pts[pts.length - 1];
    s += `<text x="${last[0] + 12}" y="${last[1] + 5}" fill="#45D6FF" font-size="15" font-weight="700">${fm(M.cumcash[59])}</text>`;
    const rows = [['', q => '', '#A9A6B8'], ['الإنفاق', q => (q.spend / 1e6).toFixed(2), '#E8794A'], ['الإيراد', q => (q.rev / 1e6).toFixed(2), '#5BE38B'], ['EBITDA', q => (q.ebitda >= 0 ? '+' : '−') + Math.abs(q.ebitda / 1e6).toFixed(2), null]];
    rows.forEach(([label, fn, col], r) => {
      const yy = top + chartH + 26 + r * rowH;
      s += `<text x="${padL - 10}" y="${yy}" text-anchor="end" fill="${col || '#A9A6B8'}" font-size="15" font-family="IBM Plex Sans Arabic, Space Grotesk" font-weight="700">${label}</text>`;
      Q.forEach((q, i) => {
        const cx = padL + i * gw + gw / 2;
        const txt = r === 0 ? 'Q' + ((i % 4) + 1) : fn(q);
        const c = col || (q.ebitda >= 0 ? '#5BE38B' : '#FF5D6C');
        s += `<text x="${cx}" y="${yy}" text-anchor="middle" fill="${c}" font-size="${r === 0 ? 14 : 15}" ${r === 3 ? 'font-weight="700"' : ''}>${txt}</text>`;
      });
    });
    s += `</svg>`;
    put('q-chart', s);
  })();
  put('src-12', C.src12 + ` تمويل المؤسس يغطي الأشهر الأربعة الأولى فقط — لذا يجب إغلاق Pre-seed بحلول الشهر 4.`);

  // ---------- slide 13 ----------
  const A = M.ask;
  put('inv-kpis', [
    { v: fm(invest, 1), l: `إجمالي التمويل حتى التعادل:${fundRows}`, cls: 'c-amber' },
    { v: monthAr(M.breakeven_month), ar: true, l: `نقطة التعادل الشهرية (الشهر ${num(M.breakeven_month)})<br><span class="dim">استرداد كل الخسائر المتراكمة: ${monthAr(M.payback_month)}</span>` },
    { v: fk(M.funding[1].amount), l: `<b>الطلب الآن:</b> جولة Pre-seed (SAFE) تغطي الأشهر 4–11: رواتب ${num(fk(A.payroll))} · تسويق ${num(fk(A.mkt))} · أدوات وقانوني ${num(fk(A.other))} ← الهدف قبل Seed: إطلاق Viral وCinema، ونحو ${num((Math.round(A.subs / 100) * 100).toLocaleString('en'))} مشترك و${num(fk(A.mrr))} إيراد شهري` },
    { v: fm(M.peak_deficit, 1), l: `أقصى عجز تراكمي قبل التعادل — ويبقى احتياطي نقدي نحو ${num(fm(M.min_cash_after_seed, 1))} في أضيق نقطة` },
  ].map(kpi).join(''));
  put('why-list', C.why.map(t => `<li class="a">${t}</li>`).join(''));
  put('assume', '<b>الافتراضات الأساسية:</b>' + [['ARPU شهرياً', '$12', '$35'], ['التسرّب الشهري', '18%', '8.5%'], ['CAC المدفوع', '$65', '$105+'], ['الهامش الإجمالي', '40%', '58%']].map(([a, b, c]) => `<span class="as">${a}: من ${num(b)} إلى ${num(c)}</span>`).join(''));
  (function ychart() {
    const W = 860, H = 520, top = 60, base = 300, padL = 30;
    const maxP = Math.max(...Y.map(y => y.ebitda));
    const scale = (base - top) / maxP;
    const n = Y.length, gw = (W - padL) / n, bw = gw * 0.56;
    let s = `<svg viewBox="0 0 ${W} ${H}" font-family="Space Grotesk, IBM Plex Sans Arabic, sans-serif" direction="ltr">`;
    s += `<line x1="${padL}" x2="${W}" y1="${base}" y2="${base}" stroke="#4a4858" stroke-width="2"/>`;
    Y.forEach((yr, i) => {
      const cx = padL + i * gw + gw / 2, v = yr.ebitda, h = Math.abs(v) * scale;
      const pos = v >= 0, hh = Math.max(h, 6);
      s += `<rect x="${cx - bw / 2}" y="${pos ? base - hh : base}" width="${bw}" height="${hh}" rx="6" fill="${pos ? '#5BE38B' : '#FF5D6C'}"/>`;
      s += `<text x="${cx}" y="${pos ? base - hh - 14 : base + hh + 34}" text-anchor="middle" fill="${pos ? '#5BE38B' : '#FF5D6C'}" font-size="30" font-weight="700">${fm(v, Math.abs(v) < 1e6 ? 2 : 1)}</text>`;
      s += `<text x="${cx}" y="${H - 104}" text-anchor="middle" fill="#F4F1EA" font-size="21" font-weight="700" direction="rtl">${2027 + i}</text>`;
      s += `<text x="${cx}" y="${H - 76}" text-anchor="middle" fill="#5BE38B" font-size="17">${fm(yr.rev)}</text>`;
      s += `<text x="${cx}" y="${H - 52}" text-anchor="middle" fill="#E8794A" font-size="17">${fm(yr.spend)}</text>`;
      s += `<text x="${cx}" y="${H - 28}" text-anchor="middle" fill="#8E8BA0" font-size="15" direction="rtl">${yr.hc} شخصاً</text>`;
    });
    s += `</svg>`;
    put('y-chart', s);
  })();
  // rough after-tax figure: 21% on profits after loss carry-forward
  let nol = 0, tax = 0; Y.forEach(y => { if (y.ebitda < 0) nol += -y.ebitda; else { const t = Math.max(0, y.ebitda - nol); nol = Math.max(0, nol - y.ebitda); tax += 0.21 * t; } });
  put('pl-total', `<div><div class="t1">مجموع الربح التشغيلي (EBITDA) في أول 5 سنوات</div><div class="t3">السيناريو الأساسي · بعد ضريبة 21% ≈ ${num('+' + fm(M.total_5y - tax))}</div></div><div class="t2">+${fm(M.total_5y)}</div>`);
  const S = M.scen, cons = S.conservative, opt = S.optimistic;
  put('pl-scen', `<b>المتحفّظ</b> (نمو أقل بـ45% مع خفض التسويق والتوظيف): التعادل في الشهر ${num(cons.be)}، وأقصى عجز ${num(fm(cons.peak))} — يحتاج جولة إضافية نحو ${num(fm(cons.peak - invest))}، ومجموع 5 سنوات ${num(fm(cons.total))}.<br><b>المتفائل</b> (نمو أعلى بـ60%): التعادل في الشهر ${num(opt.be)}، ومجموع 5 سنوات ${num('+' + fm(opt.total))}.`);
  put('src-13', C.src13);
})();
