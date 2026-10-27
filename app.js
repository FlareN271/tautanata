/* ============================================================
 * TAUTANATA · aplikasi web (PWA) v0.3.0
 * Data tersimpan di Google Sheet milikmu, lewat server Apps Script.
 * ============================================================ */
'use strict';

const APP_VERSION = '0.3.0';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

/* ---------- ikon (SVG garis) ---------- */
const ICONS = {
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  sync: '<path d="M20 11a8 8 0 0 0-14.6-4.5L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.6 4.5L20 16"/><path d="M20 20v-4h-4"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  star: '<path d="m12 3.5 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>',
  starOn: '<path fill="currentColor" d="m12 3.5 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>',
  later: '<path d="M7 3.5h10a1 1 0 0 1 1 1V20l-6-3.8L6 20V4.5a1 1 0 0 1 1-1z"/>',
  laterOn: '<path fill="currentColor" d="M7 3.5h10a1 1 0 0 1 1 1V20l-6-3.8L6 20V4.5a1 1 0 0 1 1-1z"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m14 6 4 4"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  all: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  home: '<path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z"/>',
  inbox: '<path d="M4 13h4l2 3h4l2-3h4"/><path d="M5.5 5h13L20 13v6H4v-6z"/>',
  layers: '<path d="m12 4 8 4-8 4-8-4z"/><path d="m4 12 8 4 8-4"/><path d="m4 16 8 4 8-4"/>',
  open: '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
  check: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  trash: '<path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/>',
  help: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4"/><circle cx="12" cy="16.8" r=".6" fill="currentColor"/>',
  up: '<path d="m6 15 6-6 6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  dots: '<circle cx="5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="19" cy="12" r="1.3" fill="currentColor"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'
};
function icon(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
}
function paintIcons(root = document) {
  $$('.ic[data-i]', root).forEach(el => { if (!el.firstChild) el.innerHTML = icon(el.dataset.i); });
}

/* ---------- penyimpanan lokal ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem('tn_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('tn_' + k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem('tn_' + k); } catch (e) {} }
};

/* ---------- state ---------- */
let CFG = store.get('cfg', { apiUrl: '', token: '' });
let LINKS = store.get('cache', []);
let KINFO = store.get('kinfo', []);
let SESI = store.get('sesi', []);
let SHEET_URL = store.get('sheetUrl', '');
let filter = { type: 'home', value: '' };
let view = store.get('view', 'list');
let sort = store.get('sort', 'baru');
let shown = 60;
let editing = null;
let loading = false;
let selectMode = false;
const selected = new Set();

/* ---------- util ---------- */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
function hash(s) { let h = 0; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) | 0; return Math.abs(h); }
const PALETTE = ['#0f766e', '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#ca8a04', '#16a34a', '#0891b2', '#9333ea', '#475569'];
function kinfo(nama) { return KINFO.find(k => norm(k.nama) === norm(nama)); }
function colorFor(nama) {
  const k = kinfo(nama);
  if (k && k.warna) return k.warna;
  return PALETTE[hash(nama) % PALETTE.length];
}
function favicon(domain) { return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`; }
function fmtDate(iso) {
  const d = new Date(iso);
  return isNaN(d) ? '' : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtFull(iso) {
  const d = new Date(iso);
  return isNaN(d) ? '—' : d.toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function fmtRel(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  const s = (Date.now() - d.getTime()) / 1000;
  if (s < 60) return 'baru saja';
  if (s < 3600) return Math.floor(s / 60) + ' menit lalu';
  if (s < 86400) return Math.floor(s / 3600) + ' jam lalu';
  if (s < 86400 * 7) return Math.floor(s / 86400) + ' hari lalu';
  return fmtDate(iso);
}
function toast(msg, ms = 2600) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), ms);
}
function tagMatch(tags, want) {
  const w = norm(want);
  return tags.some(t => { const n = norm(t); return n === w || n.startsWith(w + '/'); });
}
function splitList(s) { return String(s || '').split(',').map(x => x.trim()).filter(Boolean); }
function allTags() {
  const c = {};
  LINKS.forEach(l => l.tags.forEach(t => { c[t] = (c[t] || 0) + 1; }));
  return Object.keys(c).sort((a, b) => c[b] - c[a] || a.localeCompare(b)).map(t => [t, c[t]]);
}
function koleksiNames() {
  const names = KINFO.map(k => k.nama);
  LINKS.forEach(l => { if (l.koleksi && !names.some(n => norm(n) === norm(l.koleksi))) names.push(l.koleksi); });
  return names;
}
function greeting() {
  const h = new Date().getHours();
  return h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 18 ? 'Selamat sore' : 'Selamat malam';
}

/* ---------- server ---------- */
async function api(action, data = {}, cfg = CFG) {
  if (!cfg.apiUrl || !cfg.token) throw new Error('Belum terhubung ke server.');
  let res;
  try {
    res = await fetch(cfg.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ token: cfg.token, action, data }),
      redirect: 'follow'
    });
  } catch (e) {
    const err = new Error('Tidak bisa terhubung. Cek internet.');
    err.offline = true;
    throw err;
  }
  let json;
  try { json = JSON.parse(await res.text()); } catch (e) {
    throw new Error('Respons server tidak valid. Cek URL (/exec) dan akses deployment "Siapa saja".');
  }
  if (!json.ok) throw new Error(json.error || 'Gagal');
  return json;
}

function saveCache() {
  store.set('cache', LINKS);
  store.set('kinfo', KINFO);
  store.set('sesi', SESI);
}

async function load({ silent = false } = {}) {
  loading = true;
  if (!silent) $('#syncBtn').classList.add('spin');
  if (!LINKS.length) render();
  try {
    const r = await api('list');
    LINKS = r.links;
    if (r.koleksiInfo) KINFO = r.koleksiInfo;
    else KINFO = (r.koleksi || []).map((n, i) => ({ nama: n, warna: '', ikon: '', urutan: i + 1, kata: '', situs: '', aturanLain: 0 }));
    SESI = r.sesi || [];
    if (!r.koleksiInfo && !load._warned) {
      load._warned = true;
      toast('Server masih versi lama. Perbarui Code.gs ke v0.3 agar koleksi & sesi kerja aktif.', 6000);
    }
    saveCache();
    $('#notice').hidden = true;
    render();
    return true;
  } catch (e) {
    if (/token/i.test(e.message)) { toast('Token salah atau sudah diganti.', 4000); showConnect(); }
    else if (e.offline) { $('#notice').hidden = false; $('#notice').textContent = 'Sedang offline — menampilkan data terakhir yang tersimpan di perangkat ini.'; }
    else toast('Gagal memuat: ' + e.message, 4000);
    return false;
  } finally {
    loading = false;
    $('#syncBtn').classList.remove('spin');
    renderMain();
  }
}

/* Ambil gambar sampul untuk tautan yang belum dicek, sedikit demi sedikit di latar belakang. */
async function fillImages(rounds = 4) {
  for (let i = 0; i < rounds; i++) {
    if (!LINKS.some(l => !l.gambarDicek)) return;
    try {
      const r = await api('lengkapiGambar', { max: 20 });
      if (!r.diproses) return;
      await load({ silent: true });
      if (!r.sisa) return;
    } catch (e) { return; }
  }
}

/* ---------- filter & pencarian ---------- */
const LIST_TYPES = ['all', 'later', 'fav', 'unsorted', 'koleksi', 'tag', 'sesi'];
function isListView() { return LIST_TYPES.includes(filter.type) || (hasQuery() && ['home', 'sesiList', 'bantuan'].includes(filter.type)); }
function hasQuery() { return $('#q').value.trim() !== ''; }

function applyFilter(links) {
  switch (filter.type) {
    case 'later': return links.filter(l => l.bacaNanti);
    case 'fav': return links.filter(l => l.favorit);
    case 'unsorted': return links.filter(l => !l.koleksi);
    case 'koleksi': return links.filter(l => norm(l.koleksi) === norm(filter.value));
    case 'tag': return links.filter(l => tagMatch(l.tags, filter.value));
    case 'sesi': {
      const s = SESI.find(x => x.id === filter.value);
      if (!s) return [];
      const byId = new Map(links.map(l => [l.id, l]));
      return s.tautan.map(id => byId.get(id)).filter(Boolean);
    }
    default: return links;
  }
}

function search(links, q) {
  const terms = norm(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return null;
  const scored = [];
  for (const l of links) {
    const title = norm(l.judul), tags = norm(l.tags.join(' ') + ' ' + l.koleksi),
      rest = norm([l.url, l.deskripsi, l.catatan].join(' '));
    let score = 0, ok = true;
    for (const t of terms) {
      if (t.startsWith('#') && t.length > 1) {
        if (!tagMatch(l.tags, t.slice(1)) && norm(l.koleksi) !== t.slice(1)) { ok = false; break; }
        score += 2; continue;
      }
      let s = 0;
      if (title.includes(t)) s += title.startsWith(t) ? 4 : 3;
      if (tags.includes(t)) s += 3;
      if (rest.includes(t)) s += 1;
      if (!s) { ok = false; break; }
      score += s;
    }
    if (ok) scored.push([score, l]);
  }
  return scored.sort((a, b) => b[0] - a[0]).map(x => x[1]);
}

function sortLinks(links) {
  if (filter.type === 'sesi') return links; // urutan sesi dipertahankan
  const arr = links.slice();
  const by = k => (a, b) => String(b[k] || '').localeCompare(String(a[k] || ''));
  if (sort === 'lama') arr.sort((a, b) => a.dibuat.localeCompare(b.dibuat));
  else if (sort === 'diubah') arr.sort(by('diperbarui'));
  else if (sort === 'judul') arr.sort((a, b) => a.judul.localeCompare(b.judul, 'id'));
  else if (sort === 'domain') arr.sort((a, b) => a.domain.localeCompare(b.domain) || b.dibuat.localeCompare(a.dibuat));
  else arr.sort(by('dibuat'));
  return arr;
}

function currentResults() {
  const base = ['home', 'sesiList', 'bantuan'].includes(filter.type) ? LINKS : applyFilter(LINKS);
  const found = search(base, $('#q').value);
  return found || sortLinks(base);
}

/* ---------- render: navigasi ---------- */
function filterTitle() {
  if (hasQuery() && ['home', 'sesiList', 'bantuan'].includes(filter.type)) return 'Hasil pencarian';
  switch (filter.type) {
    case 'home': return 'Beranda';
    case 'all': return 'Semua tautan';
    case 'later': return 'Baca nanti';
    case 'fav': return 'Favorit';
    case 'unsorted': return 'Belum disortir';
    case 'koleksi': { const k = kinfo(filter.value); return (k && k.ikon ? k.ikon + ' ' : '') + filter.value; }
    case 'tag': return '#' + filter.value;
    case 'sesiList': return 'Sesi kerja';
    case 'sesi': { const s = SESI.find(x => x.id === filter.value); return s ? (s.ikon ? s.ikon + ' ' : '') + s.nama : 'Sesi kerja'; }
    case 'bantuan': return 'Bantuan';
    default: return 'Tautanata';
  }
}

function renderNav() {
  const cnt = { all: LINKS.length, later: 0, fav: 0, unsorted: 0 };
  const kol = {};
  LINKS.forEach(l => {
    if (l.bacaNanti) cnt.later++;
    if (l.favorit) cnt.fav++;
    if (!l.koleksi) cnt.unsorted++;
    else kol[norm(l.koleksi)] = (kol[norm(l.koleksi)] || 0) + 1;
  });
  const on = (type, value = '') => filter.type === type && norm(filter.value) === norm(value) ? ' on' : '';
  const item = (type, value, label, count, lead) =>
    `<button class="nav-item${on(type, value)}" data-type="${type}" data-value="${esc(value)}">${lead}<span class="nav-label">${esc(label)}</span><span class="nav-count">${count || ''}</span></button>`;
  const ic = n => `<span class="ic">${icon(n)}</span>`;

  let html = '';
  html += item('home', '', 'Beranda', '', ic('home'));
  html += item('all', '', 'Semua tautan', cnt.all, ic('all'));
  html += item('later', '', 'Baca nanti', cnt.later, ic('later'));
  html += item('fav', '', 'Favorit', cnt.fav, ic('star'));
  html += item('sesiList', '', 'Sesi kerja', SESI.length, ic('layers'));
  html += item('unsorted', '', 'Belum disortir', cnt.unsorted, ic('inbox'));

  html += `<div class="nav-sec"><span>Koleksi</span><span class="nav-sec-act">
    <button class="mini" data-act="kolNew" title="Koleksi baru">${icon('plus')}</button>
    <button class="mini" data-act="kolKelola" title="Kelola & urutkan">${icon('dots')}</button></span></div>`;
  const names = koleksiNames();
  html += names.length ? names.map(k => {
    const info = kinfo(k);
    const lead = info && info.ikon ? `<span class="kol-emoji">${esc(info.ikon)}</span>` : `<span class="dot" style="background:${colorFor(k)}"></span>`;
    return item('koleksi', k, k, kol[norm(k)] || 0, lead);
  }).join('') : `<button class="nav-item muted" data-act="kolNew">${ic('plus')}<span class="nav-label">Buat koleksi pertama</span></button>`;

  const tags = allTags().slice(0, 40);
  if (tags.length) {
    html += '<div class="nav-sec"><span>Tag</span></div><div class="nav-tags">';
    html += tags.map(([t]) => `<button class="tag${filter.type === 'tag' && norm(filter.value) === norm(t) ? '' : ' auto'}" data-type="tag" data-value="${esc(t)}">#${esc(t)}</button>`).join('');
    html += '</div>';
  }
  $('#nav').innerHTML = html;
  $$('.side-foot .nav-item[data-type]').forEach(b => b.classList.toggle('on', b.dataset.type === filter.type));
  $('#sideCount').textContent = `${LINKS.length} simpul tersimpan`;
  $('#koleksiList').innerHTML = names.map(k => `<option value="${esc(k)}">`).join('');
  $('#tagList').innerHTML = allTags().map(([t]) => `<option value="${esc(t)}">`).join('');
}

/* ---------- render: kartu tautan ---------- */
function thumbHtml(l) {
  const c = PALETTE[hash(l.domain) % PALETTE.length];
  const ph = `<div class="ph" style="background:${c}1f;color:${c}"><img src="${esc(favicon(l.domain))}" alt="" loading="lazy" onerror="this.outerHTML='<b>${esc((l.domain || '?').charAt(0))}</b>'"></div>`;
  if (l.gambar) {
    return `<img class="cover" src="${esc(l.gambar)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.innerHTML=this.dataset.ph" data-ph="${esc(ph)}">`;
  }
  return ph;
}

function dateHtml(l) {
  const tip = `Ditambahkan: ${fmtFull(l.dibuat)}\nTerakhir diubah: ${fmtFull(l.diperbarui || l.dibuat)}`;
  const txt = sort === 'diubah' && l.diperbarui ? 'diubah ' + fmtRel(l.diperbarui) : fmtDate(l.dibuat);
  return `<span class="dt" title="${esc(tip)}">${esc(txt)}</span>`;
}

function itemHtml(l) {
  const auto = new Set(l.tagOtomatis.map(norm));
  const tags = l.tags.map(t => `<button class="tag${auto.has(norm(t)) ? ' auto' : ''}" data-tag="${esc(t)}">#${esc(t)}</button>`).join('');
  const k = l.koleksi ? kinfo(l.koleksi) : null;
  const kol = l.koleksi ? `<span class="kol" data-kol="${esc(l.koleksi)}">${k && k.ikon ? `<span class="kol-e">${esc(k.ikon)}</span>` : `<i style="background:${colorFor(l.koleksi)}"></i>`}${esc(l.koleksi)}</span>` : '';
  const sel = selected.has(l.id);
  return `<article class="item${sel ? ' sel' : ''}" data-id="${esc(l.id)}">
    <a class="thumb" href="${esc(l.url)}" target="_blank" rel="noopener" tabindex="-1">${thumbHtml(l)}<span class="selbox">${sel ? icon('check') : ''}</span></a>
    <div class="body">
      <a class="title" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.judul || l.url)}</a>
      <div class="meta">${kol}<span class="dom"><img class="fav-ic" src="${esc(favicon(l.domain))}" alt="" loading="lazy" onerror="this.remove()">${esc(l.domain)}</span>${dateHtml(l)}${l.bacaNanti ? '<em class="badge-later">Baca nanti</em>' : ''}</div>
      ${l.deskripsi ? `<p class="desc">${esc(l.deskripsi)}</p>` : ''}
      ${l.catatan ? `<div class="note">${esc(l.catatan)}</div>` : ''}
      ${tags ? `<div class="tags">${tags}</div>` : ''}
    </div>
    <div class="acts">
      <button class="act fav${l.favorit ? ' on' : ''}" data-act="fav" title="Favorit">${icon(l.favorit ? 'starOn' : 'star')}</button>
      <button class="act later${l.bacaNanti ? ' on' : ''}" data-act="later" title="Baca nanti">${icon(l.bacaNanti ? 'laterOn' : 'later')}</button>
      <button class="act" data-act="edit" title="Ubah">${icon('edit')}</button>
    </div>
  </article>`;
}

function miniLink(l) {
  return `<a class="mini-link" href="${esc(l.url)}" target="_blank" rel="noopener" title="${esc(l.url)}">
    <img src="${esc(favicon(l.domain))}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
    <span class="mini-txt"><b>${esc(l.judul || l.url)}</b><small>${esc(l.domain)}</small></span></a>`;
}

function sesiCard(s) {
  const byId = new Map(LINKS.map(l => [l.id, l]));
  const links = s.tautan.map(id => byId.get(id)).filter(Boolean);
  const fav = links.slice(0, 5).map(l => `<img src="${esc(favicon(l.domain))}" alt="" title="${esc(l.judul)}" loading="lazy" onerror="this.remove()">`).join('');
  return `<article class="sesi-card" data-sesi="${esc(s.id)}">
    <button class="sesi-main" data-act="sesiLihat">
      <span class="sesi-ikon">${esc(s.ikon || '🗂️')}</span>
      <span class="sesi-info"><b>${esc(s.nama)}</b><small>${links.length} tautan${s.dibuka ? ' · dibuka ' + esc(fmtRel(s.dibuka)) : ''}</small></span>
    </button>
    <div class="sesi-favs">${fav}</div>
    <div class="sesi-acts">
      <button class="btn primary sm" data-act="sesiBuka"><span class="ic">${icon('open')}</span>Buka semua</button>
      <button class="icon-btn" data-act="sesiEdit" title="Ubah sesi">${icon('edit')}</button>
    </div>
  </article>`;
}

/* ---------- render: halaman ---------- */
function renderHome() {
  const fav = LINKS.filter(l => l.favorit).slice(0, 12);
  const later = LINKS.filter(l => l.bacaNanti).slice(0, 5);
  const recent = LINKS.slice().sort((a, b) => b.dibuat.localeCompare(a.dibuat)).slice(0, 5);
  const sesi = SESI.slice().sort((a, b) => (b.dibuka || b.diperbarui).localeCompare(a.dibuka || a.diperbarui)).slice(0, 6);
  const kcount = {};
  LINKS.forEach(l => { if (l.koleksi) kcount[norm(l.koleksi)] = (kcount[norm(l.koleksi)] || 0) + 1; });
  const sec = (title, act, body) => `<section class="home-sec"><div class="home-head"><h2>${title}</h2>${act || ''}</div>${body}</section>`;
  const link = (type, label) => `<button class="link-btn" data-type="${type}">${label} →</button>`;

  let html = `<div class="hero"><div><h2>${greeting()} 👋</h2><p class="muted">${LINKS.length} simpul tersimpan · ${SESI.length} sesi kerja · ${koleksiNames().length} koleksi</p></div></div>`;

  html += sec('Sesi kerja', link('sesiList', 'Semua sesi'), sesi.length
    ? `<div class="sesi-grid">${sesi.map(sesiCard).join('')}</div>`
    : `<div class="home-empty">Kumpulkan link yang sering dibuka bersamaan, misalnya untuk satu jenis pekerjaan, lalu buka semuanya sekali klik.
       <button class="btn sm" data-act="sesiNew"><span class="ic">${icon('plus')}</span>Buat sesi kerja</button></div>`);

  html += sec('Favorit', fav.length ? link('fav', 'Semua favorit') : '', fav.length
    ? `<div class="mini-grid">${fav.map(miniLink).join('')}</div>`
    : '<div class="home-empty">Tandai link dengan ★ agar muncul di sini.</div>');

  const kol = koleksiNames();
  html += sec('Koleksi', `<button class="link-btn" data-act="kolNew">＋ Koleksi baru</button>`,
    `<div class="kol-grid">${kol.map(k => {
      const info = kinfo(k);
      return `<button class="kol-tile" data-type="koleksi" data-value="${esc(k)}" style="--kc:${colorFor(k)}">
        <span class="kol-tile-ikon">${info && info.ikon ? esc(info.ikon) : '<i></i>'}</span><b>${esc(k)}</b><small>${kcount[norm(k)] || 0} tautan</small></button>`;
    }).join('')}</div>`);

  html += '<div class="home-two">';
  html += sec('Baca nanti', later.length ? link('later', 'Semua') : '', later.length
    ? `<div class="mini-list">${later.map(miniLink).join('')}</div>` : '<div class="home-empty">Tidak ada bacaan tertunda. 🎉</div>');
  html += sec('Baru ditambahkan', link('all', 'Semua'), recent.length
    ? `<div class="mini-list">${recent.map(miniLink).join('')}</div>` : '<div class="home-empty">Belum ada tautan.</div>');
  html += '</div>';
  $('#content').innerHTML = html;
}

function renderSesiList() {
  $('#content').innerHTML = `<p class="muted page-intro">Sesi kerja adalah kumpulan link yang biasa kamu buka bersamaan untuk satu pekerjaan. Contoh: "SPJ Ubinan" berisi template SPJ, FASIH, dan pedoman.</p>
    <div class="sesi-grid">${SESI.map(sesiCard).join('')}
      <button class="sesi-card add" data-act="sesiNew"><span class="ic">${icon('plus')}</span>Sesi kerja baru</button></div>`;
}

const HELP = [
  ['💾', 'Menyimpan link', `<b>Di HP:</b> di aplikasi mana pun (WhatsApp, YouTube, Chrome), ketuk <b>Bagikan → Tautanata</b>. Bisa juga ketuk <b>＋ Tambah</b> lalu tempel link.<br><b>Di laptop:</b> tekan <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>S</kbd>, klik ikon Tautanata di toolbar Edge, atau klik kanan link → <i>Simpan link ini ke Tautanata</i>.`],
  ['🗂️', 'Koleksi dan tag', `<b>Koleksi</b> adalah rak utama, dan satu link hanya ada di satu koleksi (mis. <i>Produksi</i>). <b>Tag</b> adalah label tambahan, dan satu link boleh punya banyak tag (mis. <i>#Ubinan #SPJ</i>).<br>Keduanya terisi <b>otomatis</b> dari kata kunci. Tag berwarna abu-abu berarti diisi otomatis. Untuk membuat atau mengatur koleksi, gunakan tombol <b>＋</b> dan <b>⋯</b> di samping tulisan KOLEKSI pada menu.`],
  ['🔎', 'Mencari', `Ketik apa saja di kolom cari: judul, tag, catatan, atau nama situs. Pakai <b>#nama</b> untuk menyaring tag atau koleksi (mis. <i>#produksi spj</i>). Di laptop, tekan <kbd>/</kbd> untuk langsung ke kolom cari, atau ketik <b>tn</b> + spasi di address bar Edge.`],
  ['🧳', 'Sesi kerja', `Kumpulkan link yang sering dibuka bersamaan, lalu klik <b>Buka semua</b>. Sesi bisa dibuat dari menu <b>Sesi kerja</b>, dari mode <b>Pilih</b>, atau dari extension (<i>simpan semua tab sebagai sesi</i>). Dari extension, sesi terbuka rapi sebagai satu grup tab.`],
  ['☑️', 'Mengubah banyak link sekaligus', `Tekan tombol <b>Pilih</b>, lalu centang beberapa link. Di bilah bawah kamu bisa memindahkan koleksi, menambah atau menghapus tag, menandai favorit/baca nanti, menjadikannya sesi, atau menghapusnya.`],
  ['⭐', 'Favorit & Baca nanti', `★ untuk link yang sering dipakai (muncul di Beranda). 🔖 untuk link yang ingin kamu baca nanti. Tandai sudah dibaca dengan mengetuk 🔖 sekali lagi.`],
  ['🕒', 'Tanggal ditambahkan & diubah', `Arahkan kursor ke tanggal pada kartu, atau buka ✎ Ubah untuk melihat waktu link pertama ditambahkan dan terakhir diubah. Urutkan dengan <i>Terakhir diubah</i> untuk melihat yang baru kamu sunting.`],
  ['📴', 'Saat offline', `Tautanata tetap bisa dibuka dan dicari tanpa internet, memakai data terakhir di perangkat. Menyimpan atau mengubah link butuh koneksi.`]
];
function renderHelp() {
  $('#content').innerHTML = `<div class="help">${HELP.map(([e, t, b]) =>
    `<section class="help-card"><div class="help-emoji">${e}</div><div><h3>${t}</h3><p>${b}</p></div></section>`).join('')}
    <div class="help-foot"><button class="btn" data-act="tour">Lihat tur pengenalan lagi</button>
    <span class="muted small">Tautanata v${APP_VERSION}</span></div></div>`;
}

function renderCtx() {
  const bar = $('#ctxbar');
  if (filter.type === 'sesi' && !hasQuery()) {
    const s = SESI.find(x => x.id === filter.value);
    if (s) {
      bar.hidden = false;
      bar.innerHTML = `<span class="muted">${s.catatan ? esc(s.catatan) + ' · ' : ''}${applyFilter(LINKS).length} tautan</span><span class="grow"></span>
        <button class="btn sm" data-act="sesiEditCur"><span class="ic">${icon('edit')}</span>Ubah</button>
        <button class="btn primary sm" data-act="sesiBukaCur"><span class="ic">${icon('open')}</span>Buka semua</button>`;
      return;
    }
  }
  if (filter.type === 'koleksi' && !hasQuery()) {
    const k = kinfo(filter.value);
    bar.hidden = false;
    const auto = k && (k.kata || k.situs) ? `Otomatis: ${esc([k.kata, k.situs].filter(Boolean).join(', '))}` : 'Belum ada kata kunci otomatis';
    bar.innerHTML = `<span class="muted ellipsis">${auto}</span><span class="grow"></span>
      <button class="btn sm" data-act="kolEditCur"><span class="ic">${icon('edit')}</span>Atur koleksi</button>`;
    return;
  }
  bar.hidden = true;
}

function renderList() {
  const res = currentResults();
  const list = $('#list');
  list.className = 'list' + (view === 'grid' ? ' grid' : '') + (selectMode ? ' selecting' : '');
  list.innerHTML = res.slice(0, shown).map(itemHtml).join('');
  const empty = $('#empty');
  if (res.length) empty.hidden = true;
  else if (loading && !LINKS.length) { empty.hidden = false; empty.innerHTML = '<b>Memuat…</b>'; }
  else {
    empty.hidden = false;
    empty.innerHTML = !LINKS.length
      ? '<b>Belum ada tautan</b>Ketuk "Tambah", bagikan link dari aplikasi lain ke Tautanata, atau impor bookmark lewat extension.'
      : filter.type === 'sesi' ? '<b>Sesi ini masih kosong</b>Klik "Ubah" untuk menambahkan tautan.'
      : '<b>Tidak ada yang cocok</b>Coba kata lain, atau pilih "Semua tautan".';
  }
  $('#moreBtn').hidden = res.length <= shown;
}

function renderMain() {
  $('#viewTitle').textContent = filterTitle();
  const listMode = isListView();
  $('#listTools').hidden = !listMode;
  $('#content').hidden = listMode;
  $('#list').hidden = !listMode;
  if (!listMode) { $('#empty').hidden = true; $('#moreBtn').hidden = true; }
  $$('.seg-btn').forEach(b => b.classList.toggle('on', b.dataset.view === view));
  $('#selectBtn').classList.toggle('on', selectMode);
  renderCtx();
  if (listMode) renderList();
  else if (filter.type === 'home') renderHome();
  else if (filter.type === 'sesiList') renderSesiList();
  else if (filter.type === 'bantuan') renderHelp();
  renderBulk();
}

function render() { renderNav(); renderMain(); }

/* ---------- aksi cepat ---------- */
async function patchLink(id, data, okMsg) {
  const i = LINKS.findIndex(l => l.id === id);
  if (i < 0) return;
  const before = LINKS[i];
  LINKS[i] = Object.assign({}, before, data);
  render();
  try {
    const r = await api('update', Object.assign({ id }, data));
    LINKS[i] = r.link;
    saveCache();
    render();
    if (okMsg) toast(okMsg);
  } catch (e) {
    LINKS[i] = before;
    render();
    toast('Gagal: ' + e.message, 4000);
  }
}

/* ---------- dialog tautan ---------- */
function openDialog(link, preset = {}) {
  editing = link || null;
  $('#dlgTitle').textContent = link ? 'Ubah tautan' : 'Tambah tautan';
  $('#fUrl').value = link ? link.url : (preset.url || '');
  $('#fJudul').value = link ? link.judul : (preset.judul || '');
  $('#fKoleksi').value = link ? link.koleksi : (preset.koleksi || '');
  $('#fTags').value = link ? link.tags.join(', ') : '';
  $('#fCatatan').value = link ? link.catatan : '';
  $('#fDesk').value = link ? link.deskripsi : '';
  $('#fGambar').value = link ? link.gambar : '';
  $('#fFav').checked = link ? link.favorit : false;
  $('#fLater').checked = link ? link.bacaNanti : !!preset.bacaNanti;
  $('#fHint').textContent = link
    ? (link.koleksiKunci ? 'Koleksi dipilih manual. Kosongkan agar kembali otomatis.' : 'Koleksi & tag abu-abu diisi otomatis. Menghapus tag otomatis membuatnya tidak muncul lagi.')
    : 'Kosongkan koleksi agar dipilih otomatis. Tag otomatis ditambahkan saat disimpan.';
  const dates = $('#fDates');
  dates.hidden = !link;
  if (link) {
    dates.innerHTML = `<div><span class="ic">${icon('plus')}</span><span>Ditambahkan</span><b>${esc(fmtFull(link.dibuat))}</b></div>
      <div><span class="ic">${icon('clock')}</span><span>Terakhir diubah</span><b>${esc(fmtFull(link.diperbarui || link.dibuat))}${link.diperbarui ? ' · ' + esc(fmtRel(link.diperbarui)) : ''}</b></div>`;
  }
  $('#delBtn').hidden = !link;
  $('#dlg').showModal();
  setTimeout(() => (!link && !preset.url ? $('#fUrl') : $('#saveBtn')).focus(), 60);
}

$('#form').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const btn = $('#saveBtn');
  btn.disabled = true;
  btn.textContent = 'Menyimpan…';
  try {
    if (editing) {
      const data = {
        id: editing.id, url: $('#fUrl').value, judul: $('#fJudul').value, deskripsi: $('#fDesk').value,
        catatan: $('#fCatatan').value, tags: $('#fTags').value, gambar: $('#fGambar').value,
        favorit: $('#fFav').checked, bacaNanti: $('#fLater').checked
      };
      if ($('#fKoleksi').value.trim() !== editing.koleksi) data.koleksi = $('#fKoleksi').value;
      const r = await api('update', data);
      LINKS = LINKS.map(l => l.id === r.link.id ? r.link : l);
      toast('Diperbarui ✓');
    } else {
      const r = await api('add', {
        url: $('#fUrl').value, judul: $('#fJudul').value, deskripsi: $('#fDesk').value, gambar: $('#fGambar').value,
        catatan: $('#fCatatan').value, tag: $('#fTags').value, koleksi: $('#fKoleksi').value,
        favorit: $('#fFav').checked, bacaNanti: $('#fLater').checked, sumber: 'web'
      });
      LINKS = [r.link].concat(LINKS.filter(l => l.id !== r.link.id));
      toast((r.duplikat ? 'Sudah ada, digabung' : 'Tersimpan ✓') + (r.link.koleksi ? ` → ${r.link.koleksi}` : ''), 3500);
    }
    saveCache();
    $('#dlg').close();
    render();
    if (LINKS.some(l => l.koleksi && !kinfo(l.koleksi))) load({ silent: true });
  } catch (e) {
    toast('Gagal: ' + e.message, 4500);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Simpan';
  }
});

$('#delBtn').addEventListener('click', async () => {
  if (!editing || !confirm('Hapus tautan ini?')) return;
  try {
    await api('delete', { id: editing.id });
    LINKS = LINKS.filter(l => l.id !== editing.id);
    saveCache();
    $('#dlg').close();
    render();
    toast('Dihapus');
  } catch (e) { toast('Gagal: ' + e.message, 4000); }
});

$('#pasteBtn').addEventListener('click', async () => {
  try { $('#fUrl').value = (await navigator.clipboard.readText()).trim(); }
  catch (e) { toast('Tidak bisa membaca clipboard — tempel manual.'); }
});

$$('[data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));

/* ---------- koleksi ---------- */
let kolEditing = null;
let kolWarna = '';
function openKoleksi(nama) {
  const k = nama ? kinfo(nama) || { nama, warna: colorFor(nama), ikon: '', kata: '', situs: '', aturanLain: 0 } : null;
  kolEditing = k;
  $('#kolTitle').textContent = k ? 'Atur koleksi' : 'Koleksi baru';
  $('#kNama').value = k ? k.nama : '';
  $('#kIkon').value = k ? k.ikon : '';
  $('#kKata').value = k ? k.kata : '';
  $('#kSitus').value = k ? k.situs : '';
  kolWarna = k ? (k.warna || colorFor(k.nama)) : PALETTE[KINFO.length % PALETTE.length];
  $('#kWarna').innerHTML = PALETTE.map(c => `<button type="button" class="swatch${c === kolWarna ? ' on' : ''}" data-c="${c}" style="background:${c}" aria-label="${c}"></button>`).join('');
  const lain = $('#kLain');
  lain.hidden = !(k && k.aturanLain);
  if (k && k.aturanLain) lain.innerHTML = `Ada <b>${k.aturanLain} aturan lain</b> untuk koleksi ini (aturan bertag atau regex) yang diatur langsung di lembar <i>Aturan</i> Google Sheet.`;
  $('#kDel').hidden = !k;
  $('#kolDlg').showModal();
  setTimeout(() => (k ? $('#kKata') : $('#kNama')).focus(), 60);
}
$('#kWarna').addEventListener('click', e => {
  const b = e.target.closest('.swatch');
  if (!b) return;
  kolWarna = b.dataset.c;
  $$('.swatch', $('#kWarna')).forEach(x => x.classList.toggle('on', x === b));
});
$('#kolForm').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const btn = $('#kSave');
  btn.disabled = true; btn.textContent = 'Menyimpan…';
  try {
    const data = { nama: $('#kNama').value, ikon: $('#kIkon').value, warna: kolWarna, kata: $('#kKata').value, situs: $('#kSitus').value };
    if (kolEditing) data.namaLama = kolEditing.nama;
    const r = await api('koleksiSimpan', data);
    KINFO = r.koleksiInfo;
    $('#kolDlg').close();
    if (kolEditing && filter.type === 'koleksi' && norm(filter.value) === norm(kolEditing.nama)) filter.value = data.nama.trim();
    toast(kolEditing ? 'Koleksi diperbarui ✓' : `Koleksi "${data.nama.trim()}" dibuat ✓`);
    await load({ silent: true });
  } catch (e) { toast('Gagal: ' + e.message, 4500); }
  finally { btn.disabled = false; btn.textContent = 'Simpan'; }
});
$('#kDel').addEventListener('click', async () => {
  if (!kolEditing) return;
  const n = LINKS.filter(l => norm(l.koleksi) === norm(kolEditing.nama)).length;
  if (!confirm(`Hapus koleksi "${kolEditing.nama}"?\n\n${n} tautan di dalamnya TIDAK ikut terhapus. Tautan itu akan dipindah otomatis ke koleksi lain yang cocok, atau ke "Belum disortir".`)) return;
  try {
    const r = await api('koleksiHapus', { nama: kolEditing.nama });
    KINFO = r.koleksiInfo;
    $('#kolDlg').close();
    if (filter.type === 'koleksi') filter = { type: 'home', value: '' };
    toast('Koleksi dihapus');
    await load({ silent: true });
  } catch (e) { toast('Gagal: ' + e.message, 4500); }
});

let kelolaOrder = [];
function renderKelola() {
  $('#kelolaList').innerHTML = kelolaOrder.map((n, i) => {
    const k = kinfo(n);
    const count = LINKS.filter(l => norm(l.koleksi) === norm(n)).length;
    return `<div class="kelola-row" data-n="${esc(n)}">
      <span class="kelola-no">${i + 1}</span>
      ${k && k.ikon ? `<span class="kol-emoji">${esc(k.ikon)}</span>` : `<span class="dot" style="background:${colorFor(n)}"></span>`}
      <span class="grow ellipsis"><b>${esc(n)}</b> <small class="muted">${count}</small></span>
      <button class="icon-btn sm" data-mv="-1" ${i === 0 ? 'disabled' : ''} title="Naik">${icon('up')}</button>
      <button class="icon-btn sm" data-mv="1" ${i === kelolaOrder.length - 1 ? 'disabled' : ''} title="Turun">${icon('down')}</button>
      <button class="icon-btn sm" data-edit title="Atur">${icon('edit')}</button>
    </div>`;
  }).join('') || '<p class="muted">Belum ada koleksi.</p>';
}
function openKelola() {
  kelolaOrder = koleksiNames();
  renderKelola();
  $('#kelolaDlg').showModal();
}
$('#kelolaList').addEventListener('click', e => {
  const row = e.target.closest('.kelola-row');
  if (!row) return;
  const i = kelolaOrder.findIndex(n => n === row.dataset.n);
  const mv = e.target.closest('[data-mv]');
  if (mv) {
    const j = i + Number(mv.dataset.mv);
    if (j < 0 || j >= kelolaOrder.length) return;
    [kelolaOrder[i], kelolaOrder[j]] = [kelolaOrder[j], kelolaOrder[i]];
    renderKelola();
  }
  if (e.target.closest('[data-edit]')) { $('#kelolaDlg').close(); openKoleksi(row.dataset.n); }
});
$('#kelolaAdd').addEventListener('click', () => { $('#kelolaDlg').close(); openKoleksi(null); });
$('#kelolaSave').addEventListener('click', async () => {
  const btn = $('#kelolaSave');
  btn.disabled = true; btn.textContent = 'Menyimpan…';
  try {
    const r = await api('koleksiUrut', { urutan: kelolaOrder });
    KINFO = r.koleksiInfo;
    $('#kelolaDlg').close();
    toast('Urutan disimpan ✓');
    await load({ silent: true });
  } catch (e) { toast('Gagal: ' + e.message, 4500); }
  finally { btn.disabled = false; btn.textContent = 'Simpan urutan'; }
});

/* ---------- sesi kerja ---------- */
let sesiEditing = null;
let sesiPick = [];
function renderPick() {
  const q = $('#sCari').value;
  const chosen = sesiPick.map(id => LINKS.find(l => l.id === id)).filter(Boolean);
  const others = (search(LINKS, q) || sortLinks(LINKS)).filter(l => !sesiPick.includes(l.id)).slice(0, q ? 40 : 15);
  const row = (l, on) => `<label class="pick${on ? ' on' : ''}"><input type="checkbox" data-id="${esc(l.id)}" ${on ? 'checked' : ''}>
    <img src="${esc(favicon(l.domain))}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
    <span class="ellipsis"><b>${esc(l.judul)}</b><small class="muted"> ${esc(l.domain)}</small></span></label>`;
  $('#sPick').innerHTML = chosen.map(l => row(l, true)).join('') +
    (others.length ? `<div class="pick-sep">${q ? 'Hasil pencarian' : 'Tautan terbaru'}</div>` + others.map(l => row(l, false)).join('') : '');
  $('#sCount').textContent = `(${sesiPick.length} dipilih)`;
}
function openSesi(s, presetIds) {
  sesiEditing = s || null;
  $('#sesiTitle').textContent = s ? 'Ubah sesi kerja' : 'Sesi kerja baru';
  $('#sNama').value = s ? s.nama : '';
  $('#sIkon').value = s ? s.ikon : '';
  $('#sCatatan').value = s ? s.catatan : '';
  $('#sCari').value = '';
  sesiPick = s ? s.tautan.filter(id => LINKS.some(l => l.id === id)) : (presetIds || []).slice();
  $('#sDel').hidden = !s;
  renderPick();
  $('#sesiDlg').showModal();
  setTimeout(() => $('#sNama').focus(), 60);
}
$('#sPick').addEventListener('change', e => {
  const id = e.target.dataset.id;
  if (!id) return;
  if (e.target.checked) { if (!sesiPick.includes(id)) sesiPick.push(id); }
  else sesiPick = sesiPick.filter(x => x !== id);
  renderPick();
});
$('#sCari').addEventListener('input', renderPick);
$('#sCari').addEventListener('keydown', e => { if (e.key === 'Enter') e.preventDefault(); });
$('#sesiForm').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const btn = $('#sSaveBtn');
  btn.disabled = true; btn.textContent = 'Menyimpan…';
  try {
    const r = await api('sesiSimpan', { id: sesiEditing ? sesiEditing.id : '', nama: $('#sNama').value, ikon: $('#sIkon').value, catatan: $('#sCatatan').value, tautan: sesiPick });
    SESI = SESI.filter(s => s.id !== r.sesi.id).concat([r.sesi]);
    saveCache();
    $('#sesiDlg').close();
    if (selectMode) exitSelect();
    toast(sesiEditing ? 'Sesi diperbarui ✓' : `Sesi "${r.sesi.nama}" dibuat ✓`);
    render();
  } catch (e) { toast('Gagal: ' + e.message, 4500); }
  finally { btn.disabled = false; btn.textContent = 'Simpan'; }
});
$('#sDel').addEventListener('click', async () => {
  if (!sesiEditing || !confirm(`Hapus sesi "${sesiEditing.nama}"? Tautan di dalamnya tidak ikut terhapus.`)) return;
  try {
    await api('sesiHapus', { id: sesiEditing.id });
    SESI = SESI.filter(s => s.id !== sesiEditing.id);
    saveCache();
    $('#sesiDlg').close();
    if (filter.type === 'sesi') filter = { type: 'sesiList', value: '' };
    toast('Sesi dihapus');
    render();
  } catch (e) { toast('Gagal: ' + e.message, 4500); }
});

function bukaSesi(id) {
  const s = SESI.find(x => x.id === id);
  if (!s) return;
  const byId = new Map(LINKS.map(l => [l.id, l]));
  const links = s.tautan.map(x => byId.get(x)).filter(Boolean);
  if (!links.length) { toast('Sesi ini masih kosong.'); return; }
  let blocked = 0;
  links.forEach(l => {
    const w = window.open(l.url, '_blank');
    if (w) { try { w.opener = null; } catch (e) {} } else blocked++;
  });
  if (blocked) {
    toast(`${blocked} tab diblokir browser. Izinkan pop-up untuk situs ini (ikon di ujung address bar → "Selalu izinkan"), lalu coba lagi.`, 9000);
  }
  api('sesiDibuka', { id }).then(r => { s.dibuka = r.dibuka; saveCache(); }).catch(() => {});
}

/* ---------- mode pilih & edit massal ---------- */
function enterSelect() { selectMode = true; selected.clear(); renderMain(); }
function exitSelect() { selectMode = false; selected.clear(); renderMain(); }
function renderBulk() {
  const bar = $('#bulkbar');
  bar.hidden = !selectMode;
  document.body.classList.toggle('has-bulk', selectMode);
  $('#bulkCount').textContent = `${selected.size} dipilih`;
  ['#bulkEdit', '#bulkSesi', '#bulkDel'].forEach(s => { $(s).disabled = selected.size === 0; });
}
$('#selectBtn').addEventListener('click', () => selectMode ? exitSelect() : enterSelect());
$('#bulkClose').addEventListener('click', exitSelect);
$('#bulkAll').addEventListener('click', () => {
  const res = currentResults();
  const allOn = res.every(l => selected.has(l.id));
  res.forEach(l => allOn ? selected.delete(l.id) : selected.add(l.id));
  renderMain();
});
$('#bulkDel').addEventListener('click', async () => {
  const n = selected.size;
  if (!n || !confirm(`Hapus ${n} tautan terpilih? Tindakan ini tidak bisa dibatalkan.`)) return;
  try {
    const ids = Array.from(selected);
    const r = await api('deleteMany', { ids });
    LINKS = LINKS.filter(l => !selected.has(l.id));
    saveCache();
    toast(`${r.dihapus} tautan dihapus`);
    exitSelect();
    render();
  } catch (e) { toast('Gagal: ' + e.message, 4500); }
});
$('#bulkSesi').addEventListener('click', () => openSesi(null, Array.from(selected)));
$('#bulkEdit').addEventListener('click', () => {
  $('#bulkTitle').textContent = `Ubah ${selected.size} tautan`;
  $('#bKoleksi').innerHTML = `<option value="__">Tidak diubah</option><option value="">↺ Kembalikan ke otomatis</option>` +
    koleksiNames().map(k => `<option value="${esc(k)}">${esc((kinfo(k) && kinfo(k).ikon ? kinfo(k).ikon + ' ' : '') + k)}</option>`).join('');
  ['#bTambah', '#bHapus'].forEach(s => { $(s).value = ''; });
  $('#bFav').value = '';
  $('#bLater').value = '';
  $('#bulkDlg').showModal();
});
$('#bulkForm').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const data = { ids: Array.from(selected) };
  if ($('#bKoleksi').value !== '__') data.koleksi = $('#bKoleksi').value;
  if ($('#bTambah').value.trim()) data.tambahTag = splitList($('#bTambah').value);
  if ($('#bHapus').value.trim()) data.hapusTag = splitList($('#bHapus').value);
  if ($('#bFav').value) data.favorit = $('#bFav').value === '1';
  if ($('#bLater').value) data.bacaNanti = $('#bLater').value === '1';
  if (Object.keys(data).length === 1) { $('#bulkDlg').close(); return; }
  const btn = $('#bSave');
  btn.disabled = true; btn.textContent = 'Menerapkan…';
  try {
    const r = await api('updateMany', data);
    const m = new Map(r.links.map(l => [l.id, l]));
    LINKS = LINKS.map(l => m.get(l.id) || l);
    saveCache();
    $('#bulkDlg').close();
    toast(`${r.jumlah} tautan diperbarui ✓`);
    exitSelect();
    render();
  } catch (e) { toast('Gagal: ' + e.message, 4500); }
  finally { btn.disabled = false; btn.textContent = 'Terapkan'; }
});

/* ---------- pengaturan ---------- */
function openSettings() {
  $('#sUrl').value = CFG.apiUrl;
  $('#sToken').value = CFG.token;
  $('#sStatus').textContent = '';
  $('#sMaint').textContent = '';
  $('#sSheet').hidden = !SHEET_URL;
  if (SHEET_URL) $('#sSheet').href = SHEET_URL;
  $('#sVer').textContent = 'Aplikasi v' + APP_VERSION;
  $('#setDlg').showModal();
}

async function connect(apiUrl, token) {
  apiUrl = apiUrl.trim();
  token = token.trim();
  if (!/^https:\/\/script\.google\.com\/.+\/exec$/.test(apiUrl)) throw new Error('URL harus dari script.google.com dan berakhiran /exec');
  if (!token) throw new Error('Token belum diisi.');
  const r = await api('ping', {}, { apiUrl, token });
  CFG = { apiUrl, token };
  store.set('cfg', CFG);
  SHEET_URL = r.sheetUrl || '';
  store.set('sheetUrl', SHEET_URL);
  return r;
}

$('#sSave').addEventListener('click', async () => {
  $('#sStatus').textContent = 'Menguji…';
  try {
    const r = await connect($('#sUrl').value, $('#sToken').value);
    $('#sStatus').textContent = `Terhubung ✓ server v${r.versi}`;
    load();
  } catch (e) { $('#sStatus').textContent = e.message; }
});
$('#sRetag').addEventListener('click', async () => {
  $('#sMaint').textContent = 'Memproses…';
  try {
    const r = await api('retag');
    await load({ silent: true });
    $('#sMaint').textContent = `Selesai ✓ ${r.jumlah} tautan diperbarui.`;
  } catch (e) { $('#sMaint').textContent = e.message; }
});
$('#sImg').addEventListener('click', async () => {
  $('#sMaint').textContent = 'Mengambil gambar…';
  try {
    let total = 0, r;
    do { r = await api('lengkapiGambar', { max: 25 }); total += r.diproses; $('#sMaint').textContent = `Mengambil gambar… ${total} diproses, sisa ${r.sisa}`; }
    while (r.sisa > 0 && r.diproses > 0);
    await load({ silent: true });
    $('#sMaint').textContent = `Selesai ✓ ${total} tautan diproses.`;
  } catch (e) { $('#sMaint').textContent = e.message; }
});
function download(name, text, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
$('#sJson').addEventListener('click', () => download('tautanata.json', JSON.stringify({ tautan: LINKS, koleksi: KINFO, sesi: SESI }, null, 2), 'application/json'));
$('#sCsv').addEventListener('click', () => {
  const cols = ['judul', 'url', 'koleksi', 'tags', 'catatan', 'deskripsi', 'favorit', 'bacaNanti', 'dibuat', 'diperbarui'];
  const q = v => '"' + String(Array.isArray(v) ? v.join(', ') : v == null ? '' : v).replace(/"/g, '""') + '"';
  const csv = [cols.join(',')].concat(LINKS.map(l => cols.map(c => q(l[c])).join(','))).join('\r\n');
  download('tautanata.csv', '﻿' + csv, 'text/csv');
});
$('#sLogout').addEventListener('click', () => {
  if (!confirm('Putuskan perangkat ini? Data di Google Sheet tetap aman.')) return;
  ['cfg', 'cache', 'kinfo', 'sesi', 'sheetUrl', 'koleksi'].forEach(store.del);
  location.reload();
});

/* ---------- tur pengenalan ---------- */
const TOUR = [
  ['icon', 'Selamat datang di Tautanata', 'Tempat semua link pentingmu tertata rapi. Setiap link adalah satu simpul yang mudah ditemukan lagi.'],
  ['💾', 'Simpan dari mana saja', 'Di HP: Bagikan → Tautanata dari aplikasi apa pun. Di laptop: Alt+Shift+S atau klik ikon Tautanata di Edge.'],
  ['🗂️', 'Tertata otomatis', 'Setiap link langsung masuk ke koleksi dan diberi tag berdasarkan kata kuncinya. Kamu tetap bisa mengubahnya kapan saja.'],
  ['🧳', 'Sesi kerja', 'Kumpulkan link yang biasa dibuka bersamaan, misalnya untuk SPJ, lalu buka semuanya sekali klik.'],
  ['🔎', 'Temukan dalam detik', 'Cari judul, tag, atau catatan. Gunakan #produksi untuk menyaring. Semua bantuan ada di menu Bantuan.']
];
let tourStep = 0;
function renderTour() {
  const [art, t, p] = TOUR[tourStep];
  $('#tourArt').innerHTML = art === 'icon' ? '<img src="icons/icon-192.png" alt="">' : `<span>${art}</span>`;
  $('#tourTitle').textContent = t;
  $('#tourText').textContent = p;
  $('#tourDots').innerHTML = TOUR.map((_, i) => `<i class="${i === tourStep ? 'on' : ''}"></i>`).join('');
  $('#tourBack').hidden = tourStep === 0;
  $('#tourNext').textContent = tourStep === TOUR.length - 1 ? 'Mulai' : 'Lanjut';
}
function openTour() { tourStep = 0; renderTour(); $('#tourDlg').showModal(); }
function endTour() { store.set('tourDone', true); $('#tourDlg').close(); }
$('#tourNext').addEventListener('click', () => { if (tourStep >= TOUR.length - 1) endTour(); else { tourStep++; renderTour(); } });
$('#tourBack').addEventListener('click', () => { tourStep = Math.max(0, tourStep - 1); renderTour(); });
$('#tourSkip').addEventListener('click', endTour);

/* ---------- navigasi & event ---------- */
function setFilter(type, value = '') {
  filter = { type, value };
  shown = 60;
  if (selectMode && !LIST_TYPES.includes(type)) exitSelect();
  $('#q').value = '';
  closeSide();
  render();
  window.scrollTo(0, 0);
}
function openSide() { $('#side').classList.add('open'); $('#scrim').hidden = false; }
function closeSide() { $('#side').classList.remove('open'); $('#scrim').hidden = true; }

function handleAct(act, el) {
  const card = el.closest('[data-sesi]');
  switch (act) {
    case 'kolNew': closeSide(); openKoleksi(null); return true;
    case 'kolKelola': closeSide(); openKelola(); return true;
    case 'kolEditCur': openKoleksi(filter.value); return true;
    case 'sesiNew': openSesi(null); return true;
    case 'sesiLihat': setFilter('sesi', card.dataset.sesi); return true;
    case 'sesiBuka': bukaSesi(card.dataset.sesi); return true;
    case 'sesiEdit': openSesi(SESI.find(s => s.id === card.dataset.sesi)); return true;
    case 'sesiBukaCur': bukaSesi(filter.value); return true;
    case 'sesiEditCur': openSesi(SESI.find(s => s.id === filter.value)); return true;
    case 'tour': openTour(); return true;
  }
  return false;
}

document.addEventListener('click', e => {
  const actEl = e.target.closest('[data-act]');
  if (actEl && !actEl.closest('#list') && handleAct(actEl.dataset.act, actEl)) return;
  const nav = e.target.closest('#nav [data-type], .side-foot [data-type], #content [data-type]');
  if (nav) setFilter(nav.dataset.type, nav.dataset.value || '');
});

$('#list').addEventListener('click', e => {
  const item = e.target.closest('.item');
  if (!item) return;
  const id = item.dataset.id;
  if (selectMode) {
    e.preventDefault();
    selected.has(id) ? selected.delete(id) : selected.add(id);
    item.classList.toggle('sel', selected.has(id));
    $('.selbox', item).innerHTML = selected.has(id) ? icon('check') : '';
    renderBulk();
    return;
  }
  const tag = e.target.closest('[data-tag]');
  if (tag) { setFilter('tag', tag.dataset.tag); return; }
  const kol = e.target.closest('[data-kol]');
  if (kol) { setFilter('koleksi', kol.dataset.kol); return; }
  const act = e.target.closest('[data-act]');
  if (!act) return;
  const l = LINKS.find(x => x.id === id);
  if (!l) return;
  if (act.dataset.act === 'edit') openDialog(l);
  if (act.dataset.act === 'fav') patchLink(id, { favorit: !l.favorit }, l.favorit ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit ★');
  if (act.dataset.act === 'later') patchLink(id, { bacaNanti: !l.bacaNanti }, l.bacaNanti ? 'Ditandai sudah dibaca' : 'Masuk daftar baca nanti');
});

$('#menuBtn').addEventListener('click', openSide);
$('#scrim').addEventListener('click', closeSide);
$('#settingsBtn').addEventListener('click', () => { closeSide(); openSettings(); });
$('#addBtn').addEventListener('click', () => openDialog(null, filter.type === 'koleksi' ? { koleksi: filter.value } : {}));
$('#syncBtn').addEventListener('click', () => load());
$('#moreBtn').addEventListener('click', () => { shown += 60; renderList(); });
$('#q').addEventListener('input', () => { shown = 60; renderMain(); });
$('#q').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !selectMode) { const r = currentResults()[0]; if (r) window.open(r.url, '_blank', 'noopener'); }
  if (e.key === 'Escape') { $('#q').value = ''; renderMain(); }
});
$('#sort').addEventListener('change', e => { sort = e.target.value; store.set('sort', sort); renderList(); });
$$('.seg-btn').forEach(b => b.addEventListener('click', () => { view = b.dataset.view; store.set('view', view); renderMain(); }));
document.addEventListener('keydown', e => {
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !$('dialog[open]')) {
    e.preventDefault();
    $('#q').focus();
  }
  if (e.key === 'Escape' && selectMode && !$('dialog[open]')) exitSelect();
});

/* ---------- layar hubungkan ---------- */
function showConnect() {
  $('#app').hidden = true;
  $('#connect').hidden = false;
  $('#cUrl').value = CFG.apiUrl || '';
  $('#cToken').value = '';
}
$('#cBtn').addEventListener('click', async () => {
  $('#cErr').textContent = '';
  $('#cBtn').disabled = true;
  try {
    await connect($('#cUrl').value, $('#cToken').value);
    startApp();
  } catch (e) { $('#cErr').textContent = e.message; }
  finally { $('#cBtn').disabled = false; }
});

/* ---------- tombol Bagikan (share target) & ?q= ---------- */
function readShare() {
  const p = new URLSearchParams(location.search);
  const text = [p.get('url'), p.get('text'), p.get('title')].filter(Boolean).join(' ');
  const m = text.match(/https?:\/\/[^\s<>"']+/i);
  const q = p.get('q');
  if (m || q) history.replaceState(null, '', location.pathname);
  if (!m) return { q };
  let judul = (p.get('title') || '').trim();
  if (/^https?:\/\//i.test(judul)) judul = '';
  if (!judul && p.get('text')) judul = p.get('text').replace(m[0], '').trim().slice(0, 200);
  return { url: m[0].replace(/[).,]+$/, ''), judul, q };
}

let pendingShare = null;
function startApp() {
  $('#connect').hidden = true;
  $('#app').hidden = false;
  $('#sort').value = sort;
  render();
  if (pendingShare && pendingShare.url) { openDialog(null, pendingShare); pendingShare = null; }
  else if (!store.get('tourDone', false)) openTour();
  load().then(ok => { if (ok) fillImages(); });
}

/* ---------- mulai ---------- */
paintIcons();
const share = readShare();
if (share.q) { $('#q').value = share.q; filter = { type: 'all', value: '' }; }
pendingShare = share.url ? share : null;
if (CFG.apiUrl && CFG.token) startApp(); else showConnect();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
