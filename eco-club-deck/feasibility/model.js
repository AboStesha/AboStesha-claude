/* Feasibility engine for نادي البيئة الثقافي. Pure functions over FS_DATA (data.js).
   Two scenarios: 'mid' (متوسط) and 'opt' (متفائل). Money in constant US dollars, time in months
   (month 0 is the first month of the project). Works in the browser (window.FS) and in Node. */
(function (root) {
  'use strict';

  const PERIODS = { day: d => d.days, month: () => 12, year: () => 1 };
  function driverValue(d, scn) { return d.q[scn] * d.p[scn] * PERIODS[d.per](d); }

  // steady-state yearly P&L of one idea, before club overhead and membership
  // a driver may carry its own direct cost: a cost per unit sold (cu) or a share of its revenue (v);
  // the idea's varPct covers the drivers that carry neither
  function driverCost(d, scn) {
    if (!d.cost) return null;
    const cu = d.cost.cu === undefined ? null : Array.isArray(d.cost.cu) ? d.cost.cu[scn === 'opt' ? 1 : 0] : d.cost.cu;
    return cu !== null ? d.q[scn] * cu * PERIODS[d.per](d) : driverValue(d, scn) * d.cost.v;
  }
  function ideaPL(idea, scn, A) {
    const lines = idea.rev.map(d => ({ label: d.label, value: driverValue(d, scn) }));
    const gross = lines.reduce((s, l) => s + l.value, 0);
    const tax = idea.salesTax ? gross - gross / (1 + idea.salesTax) : 0;   // menu prices include sales tax
    const rev = gross - tax;
    const costs = idea.rev.map(d => d.cost && { label: d.cost.n, value: driverCost(d, scn) }).filter(Boolean);
    const plain = idea.rev.reduce((s, d) => s + (d.cost ? 0 : driverValue(d, scn)), 0) * (gross ? rev / gross : 0);
    const variable = costs.reduce((s, c) => s + c.value, 0) + plain * idea.varPct;
    const renewal = idea.rev.length ? rev * A.renewalPct : 0;               // equipment replacement reserve
    const fixed = idea.fixed * (scn === 'opt' ? A.optFixed : 1);           // busier venues need more staff
    const op = rev - variable - renewal - fixed;
    const hard = idea.capex.reduce((s, c) => s + c.v, 0);
    const design = hard * A.designPct;
    const contingency = (hard + design) * A.contingency;
    const capex = hard + design + contingency;
    return { lines, gross, tax, rev, costs, plainVar: plain * idea.varPct, variable, renewal, fixed, op, hard, design, contingency, capex,
             margin: rev ? op / rev : 0, payback: op > 0 ? capex / op : Infinity };
  }

  function ramp(m, r) { return m >= r.months ? 1 : r.start + (1 - r.start) * (m / r.months); }
  const isInfra = idea => !idea.rev.length;

  function phaseCapex(D, ph) { return ph.ideas.reduce((s, id) => s + ideaPL(D.ideas[id], 'mid', D.assumptions).capex, 0); }
  // a phase's ideas open when their own build ends, but not before the phase's infrastructure is ready
  function openOffsets(D, ideas, floor = 0) {
    const infra = ideas.filter(id => isInfra(D.ideas[id])).map(id => D.ideas[id].build);
    const ready = Math.max(floor, ...infra, 0);
    const out = {};
    for (const id of ideas) out[id] = isInfra(D.ideas[id]) ? D.ideas[id].build : Math.max(D.ideas[id].build, ready);
    return out;
  }
  function phaseBuild(D, ph) { return Math.max(...Object.values(openOffsets(D, ph.ideas))); }

  /* Month-by-month cash simulation.
     'phased': phase 1 is paid from the starting budget; each later phase starts after the previous one
               has opened, once cash covers a first share of its cost plus a reserve and recent recurring
               profit covers the rest during the build (pay as you build, no loans).
               opts.second: the investor pays for phase 2 once phase 1 has traded for a year (staged investment).
     'all':    everything is paid up front and built in parallel. Both modes start with the approvals period. */
  function simulate(D, scn, mode, opts = {}) {
    const A = D.assumptions, months = A.horizonYears * 12, pre = A.predevMonths;
    const second = mode === 'phased' && !!opts.second;
    const phases = D.phases.map((ph, i) => ({ ...ph, i, capex: phaseCapex(D, ph), build: phaseBuild(D, ph), start: null, open: null, cost: null }));
    const ideaStart = {}, ideaOpen = {};
    const esc = m => Math.pow(1 + A.escalation, Math.max(0, m - pre) / 12);
    const baseBuild = D.ideas[D.phases[0].ideas[0]].build;
    const startPhase = (p, m) => {
      p.start = m;
      p.cost = p.capex * esc(m);
      const off = openOffsets(D, p.ideas, mode === 'all' && p.i > 0 ? baseBuild : 0);
      for (const id of p.ideas) { ideaStart[id] = m; ideaOpen[id] = m + off[id]; }
      p.open = Math.max(...p.ideas.map(id => ideaOpen[id]));
    };
    const totalCapex = phases.reduce((s, p) => s + p.capex, 0);
    let cash;
    if (mode === 'all') {
      cash = totalCapex + A.workingCapital.all;
      phases.forEach(p => startPhase(p, pre));
    } else {
      cash = A.phase1Budget;
      startPhase(phases[0], pre);
    }
    let equity = cash, injectedAt = null;
    const rampIdea = mode === 'all' ? A.rampAll[scn] : A.ramp[scn];
    const series = [], year = Array.from({ length: A.horizonYears }, () => ({ rev: 0, cost: 0, op: 0, capex: 0 }));
    let members = 0, minCash = cash, reserveBreached = false;

    const overheadAt = m => {
      const n = phases.filter(p => p.open !== null && m >= p.open - A.preOpeningMonths).length;
      return n ? A.overhead[n - 1] : 0;
    };
    // launch costs (hiring, training, opening stock, launch marketing) just before each opening
    const preOpening = p => (p.i === 0 ? A.preOpening.first : A.preOpening.pct * p.cost);

    for (let m = 0; m < months; m++) {
      if (mode === 'phased') {
        const next = phases.find(p => p.start === null), prev = next ? phases[next.i - 1] : null;
        if (next && prev.open !== null && m >= prev.open) {
          const reserve = A.reserveMonths * overheadAt(m) / 12;
          const recent = series.slice(-3);
          const avgOp = recent.length ? recent.reduce((s, x) => s + x.op - x.joinNew, 0) / recent.length : 0;   // growth joining fees are one-off
          const cost = next.capex * esc(m) * (1 + A.preOpening.pct);
          if (cash >= reserve + cost * A.upfrontShare && cash + avgOp * next.build >= cost + reserve) startPhase(next, m);
          else if (second && next.i === 1 && m >= prev.open + A.secondAfter) {
            cash += cost; equity += cost; injectedAt = m;
            startPhase(next, m);
          }
        }
      }
      let capexM = 0, rev = 0, cost = 0, joinNew = 0;
      if (m < pre) cost += A.predevCost;                                    // approvals, land, core team
      for (const p of phases) {
        if (p.start === null) continue;
        for (const id of p.ideas) {
          const st = ideaStart[id], b = D.ideas[id].build;
          if (m >= st && m < st + b) capexM += ideaPL(D.ideas[id], 'mid', A).capex * esc(st) / b;
        }
        const lead = p.i === 0 ? 3 : 2;
        if (m >= p.open - lead && m < p.open) cost += preOpening(p) / lead;
      }
      for (const id in ideaOpen) {
        if (m < ideaOpen[id]) continue;
        const pl = ideaPL(D.ideas[id], scn, A), k = ramp(m - ideaOpen[id] + 1, rampIdea);
        rev += pl.rev / 12 * k;
        cost += (pl.variable + pl.renewal) / 12 * k + pl.fixed / 12;
      }
      // membership: each phase's extra members join gradually from that phase's opening, capped per month
      const open = phases.filter(p => p.open !== null && m >= p.open);
      const n = open.length;
      if (n) {
        const lastOpen = Math.max(...open.map(p => p.open));
        const target = A.members[scn][n - 1], prevT = n > 1 ? A.members[scn][n - 2] : 0;
        const goal = Math.min(members + A.memberGrowthCap[scn], Math.max(members, prevT + (target - prevT) * ramp(m - lastOpen + 1, A.ramp[scn])));
        const joined = goal - members;
        members = goal;
        joinNew = joined * A.joinFee[scn];
        rev += joinNew + members * A.memberFee[scn] / 12;
        cost += joined * (A.palmCost + A.acqCost) + members * A.memberServiceCost / 12;
        if (joined < 0.5 && members >= target - 0.5) {
          // members who leave are replaced by newcomers who pay the joining fee and get a palm
          const repl = members * A.churn / 12;
          rev += repl * A.joinFee[scn];
          cost += repl * (A.palmCost + A.acqCost);
        }
      }
      cost += overheadAt(m) / 12;
      const op = rev - cost;
      cash += op - capexM;
      minCash = Math.min(minCash, cash);
      if (m >= pre && cash < A.reserveMonths * overheadAt(m) / 12 - 1) reserveBreached = true;
      const y = Math.floor(m / 12);
      year[y].rev += rev; year[y].cost += cost; year[y].op += op; year[y].capex += capexM;
      series.push({ m, cash, rev, cost, op, capex: capexM, members, joinNew });
    }
    const fullOpen = phases.every(p => p.open !== null) ? Math.max(...phases.map(p => p.open)) : null;
    // the investor's net position: money returned minus money spent
    let run = 0;
    const cum = series.map(s => (run += s.op - s.capex));
    // payback: the month after which that position stays at or above zero for good
    let payback = null;
    if (cum[cum.length - 1] >= 0) { let i = cum.length - 1; while (i >= 0 && cum[i] >= 0) i--; payback = i + 2; }
    const built = phases.reduce((s, p) => s + (p.start === null ? 0 : p.cost), 0);
    return { phases, series, year, equity, injectedAt, totalCapex, built, fullOpen, minCash, reserveBreached, feasible: minCash >= 0,
             members, payback, endCash: cash, cum, ideaStart, ideaOpen };
  }

  // steady state with every idea open and the club full (a mature year), per scenario
  function steady(D, scn) {
    const A = D.assumptions;
    const ideas = Object.keys(D.ideas).map(id => ({ id, ...ideaPL(D.ideas[id], scn, A) }));
    const membersN = A.members[scn][D.phases.length - 1];
    const repl = membersN * A.churn;
    const memberRev = membersN * A.memberFee[scn] + repl * A.joinFee[scn];
    const memberCost = membersN * A.memberServiceCost + repl * (A.palmCost + A.acqCost);
    const overhead = A.overhead[D.phases.length - 1];
    const ideaRev = ideas.reduce((s, i) => s + i.rev, 0), ideaOp = ideas.reduce((s, i) => s + i.op, 0);
    const rev = ideaRev + memberRev;
    const op = ideaOp + memberRev - memberCost - overhead;
    const capex = ideas.reduce((s, i) => s + i.capex, 0);
    const dep = capex / A.depreciationYears;
    const tax = Math.max(0, op - dep) * A.taxRate;
    return { ideas, ideaRev, ideaOp, membersN, memberRev, memberCost, overhead, rev, op, capex, dep, tax, net: op - tax, payback: op > 0 ? capex / op : Infinity };
  }

  // what one phase adds to the club's yearly profit once mature: its ideas, its extra members, less its extra overhead
  function phaseAdds(D, i, scn) {
    const A = D.assumptions, ph = D.phases[i];
    const ideaOp = ph.ideas.reduce((s, id) => s + ideaPL(D.ideas[id], scn, A).op, 0);
    const dm = A.members[scn][i] - (i ? A.members[scn][i - 1] : 0);
    const perMember = A.memberFee[scn] + A.churn * A.joinFee[scn] - A.memberServiceCost - A.churn * (A.palmCost + A.acqCost);
    const dOver = A.overhead[i] - (i ? A.overhead[i - 1] : 0);
    return { ideaOp, members: dm * perMember, overhead: dOver, total: ideaOp + dm * perMember - dOver };
  }

  const api = { driverValue, ideaPL, ramp, simulate, steady, phaseCapex, phaseBuild, phaseAdds, openOffsets };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.FS = api;
})(typeof window !== 'undefined' ? window : globalThis);
