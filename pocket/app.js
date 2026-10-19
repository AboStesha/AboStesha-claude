'use strict';

const KEY = 'pocket.v1';
const CURRENCIES = ['USD', 'IQD', 'TRY'];
const DECIMALS = { USD: 2, IQD: 0, TRY: 2 };
const STALE_DAYS = 7;

const $ = (s) => document.querySelector(s);
const round2 = (n) => Math.round(n * 100) / 100;
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const today = () => ymd(new Date());
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const CHEV = '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';

/* ---------- State ---------- */

function freshState() {
  return {
    version: 1,
    wallets: [{ id: uid(), name: 'Cash', createdAt: Date.now() }],
    txs: [],
    rates: { IQD: null, TRY: null, updatedAt: null },
    rateHistory: [],
    lastCurrency: 'USD',
    lastWalletId: null,
  };
}

function isValidState(s) {
  return !!s && Array.isArray(s.wallets) && s.wallets.length > 0 && Array.isArray(s.txs) &&
    !!s.rates && typeof s.rates === 'object' &&
    s.txs.every((t) => t && typeof t.usd === 'number' && (t.sign === 1 || t.sign === -1) && typeof t.walletId === 'string');
}

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (isValidState(s)) return s;
  } catch { /* fall through to a fresh state */ }
  return freshState();
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    toast('Could not save. Storage may be full.');
  }
}

let state = load();
let currentWalletId = null;

/* ---------- Numbers & dates ---------- */

const usdFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function fmtUSD(n, signed) {
  n = round2(n) || 0;
  const s = usdFmt.format(Math.abs(n));
  if (signed) return (n < 0 ? '−' : '+') + s;
  return (n < 0 ? '−' : '') + s;
}

function fmtNum(n, maxDec = 4) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: maxDec }).format(n);
}

function fmtCur(n, cur) {
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: DECIMALS[cur] }).format(n)} ${cur}`;
}

// Arabic-Indic and Persian digits → ASCII, Arabic separators → ASCII.
function normDigits(v) {
  return String(v)
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06F0))
    .replace(/٫/g, '.')
    .replace(/٬/g, ',');
}

function parseNum(v) {
  return parseFloat(normDigits(v).replace(/,/g, ''));
}

// Live "1,234.56" formatting while typing. Commas are thousands separators we insert ourselves.
function formatTyping(v, dec) {
  v = normDigits(v).replace(/[^\d.]/g, '');
  const dot = v.indexOf('.');
  let int = dot >= 0 ? v.slice(0, dot) : v;
  const frac = dot >= 0 ? v.slice(dot + 1).replace(/\./g, '') : '';
  int = int.replace(/^0+(?=\d)/, '').slice(0, 12);
  if (dot >= 0 && !int) int = '0';
  int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (dec === 0 || dot < 0) return int;
  return `${int}.${frac.slice(0, dec)}`;
}

// Keypads in some regions (e.g. Turkey) type "," as the decimal key — treat a typed comma as a decimal point.
function attachNumeric(input, getDec, onChange) {
  input.addEventListener('beforeinput', (e) => {
    if (e.data === ',' || e.data === '٫') {
      e.preventDefault();
      if (getDec() > 0 && !input.value.includes('.')) input.value = formatTyping(input.value + '.', getDec());
      onChange && onChange();
    }
  });
  input.addEventListener('input', () => {
    input.value = formatTyping(input.value, getDec());
    onChange && onChange();
  });
}

function dayLabel(s) {
  if (s === today()) return 'Today';
  const y = new Date();
  y.setDate(y.getDate() - 1);
  if (s === ymd(y)) return 'Yesterday';
  const [Y, M, D] = s.split('-').map(Number);
  const opts = { weekday: 'short', day: 'numeric', month: 'short' };
  if (Y !== new Date().getFullYear()) opts.year = 'numeric';
  return new Date(Y, M - 1, D).toLocaleDateString('en-GB', opts);
}

/* ---------- Queries ---------- */

const walletById = (id) => state.wallets.find((w) => w.id === id);
const walletTxs = (id) => state.txs.filter((t) => t.walletId === id);
const net = (txs) => round2(txs.reduce((a, t) => a + t.sign * t.usd, 0));
const sumIn = (txs) => round2(txs.reduce((a, t) => a + (t.sign > 0 ? t.usd : 0), 0));
const sumOut = (txs) => round2(txs.reduce((a, t) => a + (t.sign < 0 ? t.usd : 0), 0));
const sorted = (txs) => [...txs].sort((a, b) => (b.date === a.date ? b.createdAt - a.createdAt : b.date < a.date ? -1 : 1));

/* ---------- Rendering ---------- */

function setBalance(el, n) {
  el.textContent = fmtUSD(n);
  el.classList.toggle('neg', round2(n) < 0);
}

function txHTML(t, showMeta) {
  const inc = t.sign > 0;
  const w = walletById(t.walletId);
  const sub = showMeta ? [state.wallets.length > 1 && w ? w.name : null, dayLabel(t.date)].filter(Boolean).join(' · ') : '';
  const orig = t.currency !== 'USD' ? `<span class="row-sub">${fmtCur(t.amount, t.currency)}</span>` : '';
  return `<li><button class="row" data-tx="${t.id}">
    <span class="row-main"><span class="row-title">${esc(t.note || (inc ? 'Income' : 'Expense'))}</span>${sub ? `<span class="row-sub">${esc(sub)}</span>` : ''}</span>
    <span class="row-end"><span class="amt ${inc ? 'in' : ''}">${fmtUSD(t.sign * t.usd, true)}</span>${orig}</span>
  </button></li>`;
}

function renderBanner() {
  const r = state.rates;
  const b = $('#rateBanner');
  if (!r.IQD && !r.TRY) {
    $('#rateBannerTitle').textContent = 'Set Exchange Rates';
    $('#rateBannerSub').textContent = 'Needed for IQD and TRY payments';
    b.hidden = false;
    return;
  }
  const days = Math.floor((Date.now() - r.updatedAt) / 864e5);
  b.hidden = days < STALE_DAYS;
  $('#rateBannerTitle').textContent = 'Update Exchange Rates';
  $('#rateBannerSub').textContent = `Last updated ${days} days ago`;
}

function renderHome() {
  const all = state.txs;
  setBalance($('#totalBalance'), net(all));
  const ym = today().slice(0, 7);
  const month = all.filter((t) => t.date.startsWith(ym));
  $('#monthIn').textContent = fmtUSD(sumIn(month));
  $('#monthOut').textContent = fmtUSD(sumOut(month));
  $('#monthLabel').textContent = new Date().toLocaleDateString('en-US', { month: 'long' });

  $('#walletList').innerHTML = state.wallets.map((w) => {
    const b = net(walletTxs(w.id));
    return `<li><button class="row" data-wallet="${w.id}">
      <span class="row-main"><span class="row-title">${esc(w.name)}</span></span>
      <span class="row-value ${b < 0 ? 'neg' : ''}">${fmtUSD(b)}</span>${CHEV}
    </button></li>`;
  }).join('') +
    '<li><button class="row" id="addWallet"><span class="row-title link">New Wallet</span></button></li>';

  const recent = sorted(all).slice(0, 20);
  $('#recentList').innerHTML = recent.length
    ? recent.map((t) => txHTML(t, true)).join('')
    : '<li class="empty">No payments yet. Tap + to add one.</li>';
  renderBanner();
}

function renderWallet() {
  const w = walletById(currentWalletId);
  if (!w) return goHome();
  $('#walletTitle').textContent = w.name;
  $('#walletNavTitle').textContent = w.name;
  const txs = walletTxs(w.id);
  setBalance($('#walletBalance'), net(txs));
  $('#walletIn').textContent = fmtUSD(sumIn(txs));
  $('#walletOut').textContent = fmtUSD(sumOut(txs));

  const groups = new Map();
  for (const t of sorted(txs)) {
    if (!groups.has(t.date)) groups.set(t.date, []);
    groups.get(t.date).push(t);
  }
  $('#walletTx').innerHTML = groups.size
    ? [...groups].map(([date, list]) => `
      <h3 class="group-head split"><span>${dayLabel(date)}</span><span>${fmtUSD(net(list), true)}</span></h3>
      <ul class="group list">${list.map((t) => txHTML(t, false)).join('')}</ul>`).join('')
    : '<h3 class="group-head">Payments</h3><ul class="group list"><li class="empty">No payments in this wallet yet.</li></ul>';
}

function render() {
  if (currentWalletId) renderWallet();
  else renderHome();
  updateNavbar();
}

/* ---------- Views ---------- */

function animateView(el, cls) {
  el.classList.remove('enter', 'enter-back');
  void el.offsetWidth;
  el.classList.add(cls);
}

function updateNavbar() {
  const view = currentWalletId ? $('#wallet') : $('#home');
  view.querySelector('.navbar').classList.toggle('scrolled', window.scrollY > 36);
}
window.addEventListener('scroll', updateNavbar, { passive: true });

function showWallet(id, push = true) {
  if (!walletById(id)) return;
  currentWalletId = id;
  $('#home').hidden = true;
  const v = $('#wallet');
  v.hidden = false;
  animateView(v, 'enter');
  window.scrollTo(0, 0);
  render();
  if (push) history.pushState({ wallet: id }, '');
}

function showHome() {
  currentWalletId = null;
  $('#wallet').hidden = true;
  const v = $('#home');
  v.hidden = false;
  animateView(v, 'enter-back');
  render();
}

function goHome() {
  if (history.state && history.state.wallet) history.back();
  else showHome();
}

window.addEventListener('popstate', (e) => {
  closeSheet(true);
  if (e.state && e.state.wallet && walletById(e.state.wallet)) showWallet(e.state.wallet, false);
  else showHome();
});

/* ---------- Sheets ---------- */

const scrim = $('#scrim');
let openSheetEl = null;

function openSheet(el) {
  if (openSheetEl && openSheetEl !== el) closeSheet(true);
  hideToast();
  openSheetEl = el;
  el.hidden = false;
  scrim.hidden = false;
  el.scrollTop = 0;
  void el.offsetHeight;
  el.classList.add('show');
  scrim.classList.add('show');
}

function closeSheet(immediate) {
  const el = openSheetEl;
  if (!el) return;
  openSheetEl = null;
  if (document.activeElement && el.contains(document.activeElement)) document.activeElement.blur();
  el.classList.remove('show');
  scrim.classList.remove('show');
  const done = () => {
    if (openSheetEl !== el) el.hidden = true;
    if (!openSheetEl) scrim.hidden = true;
  };
  if (immediate) done();
  else setTimeout(done, 420);
}

scrim.addEventListener('click', () => closeSheet());
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });
document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => closeSheet()));

// Pull a sheet down to dismiss. Tracks the finger 1:1, then decides by distance or flick velocity.
function enableDrag(sheet) {
  let startY = 0, lastY = 0, lastT = 0, dy = 0, v = 0, armed = false, dragging = false;
  sheet.addEventListener('touchstart', (e) => {
    armed = e.touches.length === 1 && sheet.scrollTop <= 0 && !e.target.closest('input, select');
    dragging = false;
    dy = 0; v = 0;
    startY = lastY = e.touches[0].clientY;
    lastT = e.timeStamp;
  }, { passive: true });
  sheet.addEventListener('touchmove', (e) => {
    if (!armed) return;
    const y = e.touches[0].clientY;
    const d = y - startY;
    if (!dragging) {
      if (d > 8) { dragging = true; sheet.classList.add('dragging'); }
      else { if (d < -8) armed = false; return; }
    }
    e.preventDefault();
    dy = Math.max(0, d - 8);
    const dt = e.timeStamp - lastT;
    if (dt > 0) v = (y - lastY) / dt;
    lastY = y; lastT = e.timeStamp;
    sheet.style.transform = `translateY(${dy}px)`;
    scrim.style.opacity = String(1 - Math.min(dy / 500, 0.7));
  }, { passive: false });
  const end = () => {
    armed = false;
    if (!dragging) return;
    dragging = false;
    sheet.classList.remove('dragging');
    sheet.style.transform = '';
    scrim.style.opacity = '';
    if (dy > 110 || v > 0.6) closeSheet();
  };
  sheet.addEventListener('touchend', end);
  sheet.addEventListener('touchcancel', end);
}

document.querySelectorAll('.sheet').forEach(enableDrag);

// Keep sheets above the iOS keyboard.
if (window.visualViewport) {
  const vv = window.visualViewport;
  const fit = () => {
    const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
    document.documentElement.style.setProperty('--kb', `${Math.round(kb)}px`);
  };
  vv.addEventListener('resize', fit);
  vv.addEventListener('scroll', fit);
}

function setSegment(el, index) {
  el.style.setProperty('--i', index);
  el.querySelectorAll('.seg').forEach((b, i) => b.setAttribute('aria-checked', String(i === index)));
}

/* ---------- Toast with undo ---------- */

let toastTimer = null;
let toastSnap = null;

function toast(text, snap) {
  const t = $('#toast');
  $('#toastText').textContent = text;
  toastSnap = snap || null;
  $('#toastUndo').hidden = !snap;
  clearTimeout(toastTimer);
  t.hidden = false;
  void t.offsetHeight;
  t.classList.add('show');
  toastTimer = setTimeout(hideToast, snap ? 5000 : 2200);
}

function hideToast() {
  const t = $('#toast');
  if (t.hidden) return;
  t.classList.remove('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 250);
}

$('#toastUndo').addEventListener('click', () => {
  if (toastSnap) {
    state = JSON.parse(toastSnap);
    save();
    if (currentWalletId && !walletById(currentWalletId)) goHome();
    else render();
  }
  hideToast();
});

const snapshot = () => JSON.stringify(state);

/* ---------- Add / edit payment ---------- */

const txSheet = $('#txSheet');
const signSeg = $('#signSeg');
const curSeg = $('#curSeg');
const amountInput = $('#amountInput');
const noteInput = $('#noteInput');
const dateInput = $('#dateInput');
const walletSelect = $('#walletSelect');
const form = { editingId: null, sign: -1, currency: 'USD', walletId: null };

curSeg.innerHTML = '<i class="seg-thumb" aria-hidden="true"></i>' +
  CURRENCIES.map((c) => `<button type="button" class="seg" role="radio" data-cur="${c}">${c}</button>`).join('');

function rateFor(cur) {
  if (cur === 'USD') return 1;
  const editing = form.editingId && state.txs.find((t) => t.id === form.editingId);
  if (editing && editing.currency === cur) return editing.rate; // edits keep the rate the payment was saved with
  return state.rates[cur] || null;
}

function setSign(s) {
  form.sign = s;
  setSegment(signSeg, s > 0 ? 1 : 0);
  $('#amountSign').textContent = s > 0 ? '+' : '−';
  renderNoteChips();
}

function setCurrency(c) {
  form.currency = c;
  setSegment(curSeg, CURRENCIES.indexOf(c));
  amountInput.value = formatTyping(amountInput.value, DECIMALS[c]);
  updateConvert();
}

// Grow the amount field with its text so the +/− sign stays next to the number.
function fitAmount() {
  const v = amountInput.value;
  const narrow = (v.match(/[,.]/g) || []).length;
  amountInput.style.width = `${Math.max(1, v.length - narrow) + narrow * 0.45 + 0.6}ch`;
}

function updateConvert() {
  fitAmount();
  const el = $('#convertHint');
  const cur = form.currency;
  const amt = parseNum(amountInput.value);
  const rate = rateFor(cur);
  $('#saveTx').disabled = !(amt > 0 && rate);
  el.classList.toggle('warn', !rate);
  if (cur === 'USD') el.innerHTML = '&nbsp;';
  else if (!rate) el.textContent = `Set the ${cur} rate in Settings first`;
  else el.textContent = `≈ ${fmtUSD(amt > 0 ? amt / rate : 0)}  ·  1 USD = ${fmtNum(rate)} ${cur}`;
}

function renderWalletPicker() {
  $('#walletRow').hidden = state.wallets.length < 2;
  walletSelect.innerHTML = state.wallets.map((w) => `<option value="${w.id}">${esc(w.name)}</option>`).join('');
  walletSelect.value = form.walletId;
  const w = walletById(form.walletId);
  $('#walletValue').textContent = w ? w.name : '';
}

// Quick picks from what you've written before, most used first.
function renderNoteChips() {
  const q = noteInput.value.trim().toLowerCase();
  const counts = new Map();
  for (const t of state.txs) {
    if (t.sign !== form.sign || !t.note) continue;
    counts.set(t.note, (counts.get(t.note) || 0) + 1);
  }
  const picks = [...counts]
    .filter(([n]) => n.toLowerCase() !== q && (!q || n.toLowerCase().startsWith(q)))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  $('#noteChips').innerHTML = picks.map(([n]) => `<button type="button" class="chip" data-note="${esc(n)}">${esc(n)}</button>`).join('');
}

function openTx(id) {
  const t = id ? state.txs.find((x) => x.id === id) : null;
  if (id && !t) return;
  form.editingId = t ? t.id : null;
  amountInput.value = t ? formatTyping(String(t.amount), DECIMALS[t.currency]) : '';
  noteInput.value = t ? t.note : '';
  const fallbackWallet = walletById(state.lastWalletId) ? state.lastWalletId : state.wallets[0].id;
  form.walletId = t ? t.walletId : (currentWalletId || fallbackWallet);
  dateInput.value = t ? t.date : today();
  $('#txTitle').textContent = t ? 'Edit Payment' : 'New Payment';
  $('#saveTx').textContent = t ? 'Save' : 'Add';
  $('#deleteTxGroup').hidden = !t;
  setSign(t ? t.sign : -1);
  setCurrency(t ? t.currency : (state.lastCurrency || 'USD'));
  renderWalletPicker();
  openSheet(txSheet);
  if (!t) amountInput.focus();
}

attachNumeric(amountInput, () => DECIMALS[form.currency], updateConvert);
noteInput.addEventListener('input', renderNoteChips);
walletSelect.addEventListener('change', () => {
  form.walletId = walletSelect.value;
  renderWalletPicker();
});

txSheet.addEventListener('click', (e) => {
  const seg = e.target.closest('[data-sign]');
  if (seg) return setSign(Number(seg.dataset.sign));
  const cur = e.target.closest('[data-cur]');
  if (cur) return setCurrency(cur.dataset.cur);
  const note = e.target.closest('[data-note]');
  if (note) { noteInput.value = note.dataset.note; renderNoteChips(); }
});

txSheet.addEventListener('submit', (e) => {
  e.preventDefault();
  const amount = parseNum(amountInput.value);
  const rate = rateFor(form.currency);
  if (!(amount > 0) || !rate) return;
  if (!walletById(form.walletId)) form.walletId = state.wallets[0].id;

  const snap = snapshot();
  const data = {
    walletId: form.walletId,
    sign: form.sign,
    amount,
    currency: form.currency,
    rate,
    usd: round2(amount / rate),
    note: noteInput.value.trim(),
    date: dateInput.value || today(),
  };
  const existing = form.editingId && state.txs.find((t) => t.id === form.editingId);
  if (existing) Object.assign(existing, data);
  else state.txs.push({ id: uid(), createdAt: Date.now(), ...data });
  state.lastCurrency = form.currency;
  state.lastWalletId = form.walletId;
  save();
  closeSheet();
  render();
  toast(existing ? 'Changes saved' : `${form.sign > 0 ? 'Income' : 'Expense'} added · ${fmtUSD(data.usd)}`, snap);
});

$('#deleteTx').addEventListener('click', () => {
  const snap = snapshot();
  state.txs = state.txs.filter((t) => t.id !== form.editingId);
  save();
  closeSheet();
  render();
  toast('Payment deleted', snap);
});

/* ---------- Settings: rates & backup ---------- */

const settingsSheet = $('#settingsSheet');
const rateIQD = $('#rateIQD');
const rateTRY = $('#rateTRY');
attachNumeric(rateIQD, () => 2, () => { $('#rateError').textContent = ''; });
attachNumeric(rateTRY, () => 4, () => { $('#rateError').textContent = ''; });

function openSettings() {
  const r = state.rates;
  rateIQD.value = r.IQD ? formatTyping(String(r.IQD), 2) : '';
  rateTRY.value = r.TRY ? formatTyping(String(r.TRY), 4) : '';
  $('#rateError').textContent = '';
  const note = 'New payments use these rates. Saved payments keep the rate they were added with.';
  if (r.updatedAt) {
    const days = Math.floor((Date.now() - r.updatedAt) / 864e5);
    const when = new Date(r.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    $('#ratesUpdated').textContent = `Updated ${when}${days ? ` (${days} day${days > 1 ? 's' : ''} ago)` : ' (today)'}. ${note}`;
  } else {
    $('#ratesUpdated').textContent = `Enter this week's market rates. ${note}`;
  }
  openSheet(settingsSheet);
}

$('#openSettings').addEventListener('click', openSettings);
$('#rateBanner').addEventListener('click', openSettings);

settingsSheet.addEventListener('submit', (e) => {
  e.preventDefault();
  const err = (m) => { $('#rateError').textContent = m; };
  const iqd = rateIQD.value.trim() ? parseNum(rateIQD.value) : null;
  const tr = rateTRY.value.trim() ? parseNum(rateTRY.value) : null;
  const r = state.rates;
  if (iqd === r.IQD && tr === r.TRY) { closeSheet(); return; }
  if ((iqd !== null && !(iqd > 0)) || (tr !== null && !(tr > 0))) return err('Rates must be more than 0.');
  if (iqd !== null && iqd > 10000) return err('That looks like the rate for 100 USD. Enter the rate for 1 USD (e.g. 1,420).');

  const snap = snapshot();
  state.rates = { IQD: iqd, TRY: tr, updatedAt: iqd === null && tr === null ? null : Date.now() };
  state.rateHistory = [...(state.rateHistory || []), { date: today(), IQD: iqd, TRY: tr }].slice(-104);
  save();
  closeSheet();
  render();
  toast('Rates updated', snap);
});

$('#exportBtn').addEventListener('click', async () => {
  const json = JSON.stringify({ app: 'pocket', exportedAt: new Date().toISOString(), data: state }, null, 2);
  const name = `pocket-backup-${today()}.json`;
  const file = new File([json], name, { type: 'application/json' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: 'Pocket backup' }); return; }
    catch (e) { if (e.name === 'AbortError') return; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(file);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

$('#importBtn').addEventListener('click', () => $('#importFile').click());
$('#importFile').addEventListener('change', async (e) => {
  const f = e.target.files[0];
  e.target.value = '';
  if (!f) return;
  try {
    const parsed = JSON.parse(await f.text());
    const data = parsed && parsed.data ? parsed.data : parsed;
    if (!isValidState(data)) throw new Error('invalid');
    const snap = snapshot();
    state = data;
    save();
    closeSheet();
    goHome();
    toast('Backup restored', snap);
  } catch {
    toast('That file is not a Pocket backup.');
  }
});

/* ---------- Wallets ---------- */

const walletSheet = $('#walletSheet');
let editingWalletId = null;

function openWalletSheet(id) {
  editingWalletId = id;
  const w = id ? walletById(id) : null;
  const canDelete = !!w && state.wallets.length > 1;
  $('#walletSheetTitle').textContent = w ? 'Edit Wallet' : 'New Wallet';
  $('#walletName').value = w ? w.name : '';
  $('#walletError').textContent = '';
  $('#deleteWalletGroup').hidden = !canDelete;
  $('#deleteWalletNote').hidden = !canDelete;
  openSheet(walletSheet);
  if (!w) $('#walletName').focus();
}

walletSheet.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#walletName').value.trim();
  if (!name) { $('#walletError').textContent = 'Give the wallet a name.'; return; }
  const w = editingWalletId && walletById(editingWalletId);
  if (w) w.name = name;
  else state.wallets.push({ id: uid(), name, createdAt: Date.now() });
  save();
  closeSheet();
  render();
});

$('#deleteWallet').addEventListener('click', () => {
  const w = walletById(editingWalletId);
  if (!w || state.wallets.length < 2) return;
  const snap = snapshot();
  state.wallets = state.wallets.filter((x) => x.id !== w.id);
  state.txs = state.txs.filter((t) => t.walletId !== w.id);
  save();
  closeSheet();
  if (currentWalletId === w.id) goHome();
  else render();
  toast(`“${w.name}” deleted`, snap);
});

$('#walletEdit').addEventListener('click', () => openWalletSheet(currentWalletId));
$('#backHome').addEventListener('click', goHome);
$('#addBtn').addEventListener('click', () => openTx(null));

$('#app').addEventListener('click', (e) => {
  const wb = e.target.closest('[data-wallet]');
  if (wb) return showWallet(wb.dataset.wallet);
  if (e.target.closest('#addWallet')) return openWalletSheet(null);
  const tx = e.target.closest('[data-tx]');
  if (tx) openTx(tx.dataset.tx);
});

/* ---------- Boot ---------- */

history.replaceState({}, '');
render();

// Refresh "x days ago" and the month when the app comes back from the background.
document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });

if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
