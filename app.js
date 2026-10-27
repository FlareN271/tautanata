/* ============================================================
 * TAUTANATA · aplikasi web (PWA) v0.2.0
 * Data tersimpan di Google Sheet milikmu, lewat server Apps Script.
 * ============================================================ */
'use strict';

const APP_VERSION = '0.2.0';
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
  inbox: '<path d="M4 13h4l2 3h4l2-3h4"/><path d="M5.5 5h13L20 13v6H4v-6z"/>',
  folder: '<path d="M3.5 7a1.5 1.5 0 0 1 1.5-1.5h4l2 2h8A1.5 1.5 0 0 1 20.5 9v9a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18z"/>',
  hash: '<path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16"/>'
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
let KOLEKSI = store.get('koleksi', []);
let SHEET_URL = store.get('sheetUrl', '');
let filter = { type: 'all', value: '' };
let view = store.get('view', 'list');
let sort = store.get('sort', 'baru');
let shown = 60;
let editing = null;
let loading = false;

/* ---------- util ---------- */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
function hash(s) { let h = 0; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) | 0; return Math.abs(h); }
const PALETTE = ['#0f766e', '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#ca8a04', '#16a34a', '#0891b2', '#9333ea', '#475569'];
function colorFor(s) {
  const i = KOLEKSI.findIndex(k => norm(k) === norm(s));
  return PALETTE[(i >= 0 ? i : hash(s)) % PALETTE.length];
}
function favicon(domain) { return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`; }
function fmtDate(iso) {
  const d = new Date(iso);
  return isNaN(d) ? '' : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
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
  store.set('koleksi', KOLEKSI);
}

async function load({ silent = false } = {}) {
  loading = true;
  if (!silent) $('#syncBtn').classList.add('spin');
  if (!LINKS.length) render();
  try {
    const r = await api('list');
    LINKS = r.links;
    KOLEKSI = r.koleksi || [];
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
    renderList();
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
function applyFilter(links) {
  switch (filter.type) {
    case 'later': return links.filter(l => l.bacaNanti);
    case 'fav': return links.filter(l => l.favorit);
    case 'unsorted': return links.filter(l => !l.koleksi);
    case 'koleksi': return links.filter(l => norm(l.koleksi) === norm(filter.value));
    case 'tag': return links.filter(l => tagMatch(l.tags, filter.value));
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
  const arr = links.slice();
  if (sort === 'lama') arr.sort((a, b) => a.dibuat.localeCompare(b.dibuat));
  else if (sort === 'judul') arr.sort((a, b) => a.judul.localeCompare(b.judul, 'id'));
  else if (sort === 'domain') arr.sort((a, b) => a.domain.localeCompare(b.domain) || b.dibuat.localeCompare(a.dibuat));
  else arr.sort((a, b) => b.dibuat.localeCompare(a.dibuat));
  return arr;
}

function currentResults() {
  const base = applyFilter(LINKS);
  const found = search(base, $('#q').value);
  return found || sortLinks(base);
}

/* ---------- render ---------- */
function filterTitle() {
  switch (filter.type) {
    case 'later': return 'Baca nanti';
    case 'fav': return 'Favorit';
    case 'unsorted': return 'Belum disortir';
    case 'koleksi': return filter.value;
    case 'tag': return '#' + filter.value;
    default: return 'Semua tautan';
  }
}

function renderNav() {
  const cnt = { all: LINKS.length, later: 0, fav: 0, unsorted: 0 };
  const kol = {}, tags = {};
  LINKS.forEach(l => {
    if (l.bacaNanti) cnt.later++;
    if (l.favorit) cnt.fav++;
    if (!l.koleksi) cnt.unsorted++;
    else kol[l.koleksi] = (kol[l.koleksi] || 0) + 1;
    l.tags.forEach(t => { tags[t] = (tags[t] || 0) + 1; });
  });
  const kolNames = KOLEKSI.slice();
  Object.keys(kol).forEach(k => { if (!kolNames.some(x => norm(x) === norm(k))) kolNames.push(k); });
  const on = (type, value = '') => filter.type === type && norm(filter.value) === norm(value) ? ' on' : '';
  const item = (type, value, label, count, lead) =>
    `<button class="nav-item${on(type, value)}" data-type="${type}" data-value="${esc(value)}">${lead}<span class="nav-label">${esc(label)}</span><span class="nav-count">${count || ''}</span></button>`;

  let html = '';
  html += item('all', '', 'Semua tautan', cnt.all, `<span class="ic">${icon('all')}</span>`);
  html += item('later', '', 'Baca nanti', cnt.later, `<span class="ic">${icon('later')}</span>`);
  html += item('fav', '', 'Favorit', cnt.fav, `<span class="ic">${icon('star')}</span>`);
  html += item('unsorted', '', 'Belum disortir', cnt.unsorted, `<span class="ic">${icon('inbox')}</span>`);
  if (kolNames.length) {
    html += '<div class="nav-sec">Koleksi</div>';
    html += kolNames.map(k => item('koleksi', k, k, kol[k] || kol[Object.keys(kol).find(x => norm(x) === norm(k))] || 0,
      `<span class="dot" style="background:${colorFor(k)}"></span>`)).join('');
  }
  const tagNames = Object.keys(tags).sort((a, b) => tags[b] - tags[a] || a.localeCompare(b)).slice(0, 40);
  if (tagNames.length) {
    html += '<div class="nav-sec">Tag</div><div class="nav-tags">';
    html += tagNames.map(t => `<button class="tag${filter.type === 'tag' && norm(filter.value) === norm(t) ? '' : ' auto'}" data-type="tag" data-value="${esc(t)}">#${esc(t)}</button>`).join('');
    html += '</div>';
  }
  $('#nav').innerHTML = html;
  $('#sideCount').textContent = `${LINKS.length} simpul tersimpan`;
  $('#koleksiList').innerHTML = kolNames.map(k => `<option value="${esc(k)}">`).join('');
}

function thumbHtml(l) {
  const c = PALETTE[hash(l.domain) % PALETTE.length];
  const ph = `<div class="ph" style="background:${c}1f;color:${c}"><img src="${esc(favicon(l.domain))}" alt="" loading="lazy" onerror="this.outerHTML='<b>${esc((l.domain || '?').charAt(0))}</b>'"></div>`;
  if (l.gambar) {
    return `<img class="cover" src="${esc(l.gambar)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.innerHTML=this.dataset.ph" data-ph="${esc(ph)}">`;
  }
  return ph;
}

function itemHtml(l) {
  const auto = new Set(l.tagOtomatis.map(norm));
  const tags = l.tags.map(t => `<button class="tag${auto.has(norm(t)) ? ' auto' : ''}" data-tag="${esc(t)}">#${esc(t)}</button>`).join('');
  const kol = l.koleksi ? `<span class="kol" data-kol="${esc(l.koleksi)}"><i style="background:${colorFor(l.koleksi)}"></i>${esc(l.koleksi)}</span>` : '';
  return `<article class="item" data-id="${esc(l.id)}">
    <a class="thumb" href="${esc(l.url)}" target="_blank" rel="noopener" tabindex="-1">${thumbHtml(l)}</a>
    <div class="body">
      <a class="title" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.judul || l.url)}</a>
      <div class="meta">${kol}<span class="dom"><img class="fav-ic" src="${esc(favicon(l.domain))}" alt="" loading="lazy" onerror="this.remove()">${esc(l.domain)}</span><span class="dt">${fmtDate(l.dibuat)}</span>${l.bacaNanti ? '<em class="badge-later">Baca nanti</em>' : ''}</div>
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

function renderList() {
  const res = currentResults();
  const list = $('#list');
  list.className = 'list' + (view === 'grid' ? ' grid' : '');
  list.innerHTML = res.slice(0, shown).map(itemHtml).join('');
  $('#viewTitle').textContent = filterTitle();
  const empty = $('#empty');
  if (res.length) empty.hidden = true;
  else if (loading && !LINKS.length) { empty.hidden = false; empty.innerHTML = '<b>Memuat…</b>'; }
  else {
    empty.hidden = false;
    empty.innerHTML = LINKS.length
      ? '<b>Tidak ada yang cocok</b>Coba kata lain, atau pilih "Semua tautan".'
      : '<b>Belum ada tautan</b>Ketuk "Tambah", bagikan link dari aplikasi lain ke Tautanata, atau impor bookmark lewat extension.';
  }
  $('#moreBtn').hidden = res.length <= shown;
  $$('.seg-btn').forEach(b => b.classList.toggle('on', b.dataset.view === view));
}

function render() { renderNav(); renderList(); }

/* ---------- aksi cepat ---------- */
async function patchLink(id, data, okMsg) {
  const i = LINKS.findIndex(l => l.id === id);
  if (i < 0) return;
  const before = LINKS[i];
  LINKS[i] = Object.assign({}, before, data); // langsung tampil, sinkron menyusul
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

/* ---------- dialog tambah / ubah ---------- */
function openDialog(link, preset = {}) {
  editing = link || null;
  $('#dlgTitle').textContent = link ? 'Ubah tautan' : 'Tambah tautan';
  $('#fUrl').value = link ? link.url : (preset.url || '');
  $('#fJudul').value = link ? link.judul : (preset.judul || '');
  $('#fKoleksi').value = link ? link.koleksi : '';
  $('#fTags').value = link ? link.tags.join(', ') : '';
  $('#fCatatan').value = link ? link.catatan : '';
  $('#fDesk').value = link ? link.deskripsi : '';
  $('#fGambar').value = link ? link.gambar : '';
  $('#fFav').checked = link ? link.favorit : false;
  $('#fLater').checked = link ? link.bacaNanti : !!preset.bacaNanti;
  $('#fHint').textContent = link
    ? (link.koleksiKunci ? 'Koleksi dipilih manual. Kosongkan agar kembali otomatis.' : 'Koleksi & tag abu-abu diisi otomatis oleh aturan. Menghapus tag otomatis membuatnya tidak muncul lagi.')
    : 'Kosongkan koleksi agar dipilih otomatis oleh aturan. Tag otomatis ditambahkan saat disimpan.';
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
      const where = r.link.koleksi ? ` → ${r.link.koleksi}` : '';
      toast((r.duplikat ? 'Sudah ada, digabung' : 'Tersimpan ✓') + where, 3500);
    }
    if (KOLEKSI.length === 0 || LINKS.some(l => l.koleksi && !KOLEKSI.includes(l.koleksi))) {
      LINKS.forEach(l => { if (l.koleksi && !KOLEKSI.some(k => norm(k) === norm(l.koleksi))) KOLEKSI.push(l.koleksi); });
    }
    saveCache();
    $('#dlg').close();
    render();
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
$('#sJson').addEventListener('click', () => download('tautanata.json', JSON.stringify(LINKS, null, 2), 'application/json'));
$('#sCsv').addEventListener('click', () => {
  const cols = ['judul', 'url', 'koleksi', 'tags', 'catatan', 'deskripsi', 'favorit', 'bacaNanti', 'dibuat'];
  const q = v => '"' + String(Array.isArray(v) ? v.join(', ') : v == null ? '' : v).replace(/"/g, '""') + '"';
  const csv = [cols.join(',')].concat(LINKS.map(l => cols.map(c => q(l[c])).join(','))).join('\r\n');
  download('tautanata.csv', '﻿' + csv, 'text/csv');
});
$('#sLogout').addEventListener('click', () => {
  if (!confirm('Putuskan perangkat ini? Data di Google Sheet tetap aman.')) return;
  ['cfg', 'cache', 'koleksi', 'sheetUrl'].forEach(store.del);
  location.reload();
});

/* ---------- navigasi ---------- */
function setFilter(type, value = '') {
  filter = { type, value };
  shown = 60;
  closeSide();
  render();
  window.scrollTo(0, 0);
}
function openSide() { $('#side').classList.add('open'); $('#scrim').hidden = false; }
function closeSide() { $('#side').classList.remove('open'); $('#scrim').hidden = true; }

$('#nav').addEventListener('click', e => {
  const b = e.target.closest('[data-type]');
  if (b) setFilter(b.dataset.type, b.dataset.value);
});
$('#list').addEventListener('click', e => {
  const tag = e.target.closest('[data-tag]');
  if (tag) { setFilter('tag', tag.dataset.tag); return; }
  const kol = e.target.closest('[data-kol]');
  if (kol) { setFilter('koleksi', kol.dataset.kol); return; }
  const act = e.target.closest('[data-act]');
  if (!act) return;
  const id = act.closest('.item').dataset.id;
  const l = LINKS.find(x => x.id === id);
  if (!l) return;
  if (act.dataset.act === 'edit') openDialog(l);
  if (act.dataset.act === 'fav') patchLink(id, { favorit: !l.favorit }, l.favorit ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit ★');
  if (act.dataset.act === 'later') patchLink(id, { bacaNanti: !l.bacaNanti }, l.bacaNanti ? 'Ditandai sudah dibaca' : 'Masuk daftar baca nanti');
});
$('#menuBtn').addEventListener('click', openSide);
$('#scrim').addEventListener('click', closeSide);
$('#settingsBtn').addEventListener('click', () => { closeSide(); openSettings(); });
$('#addBtn').addEventListener('click', () => openDialog(null));
$('#syncBtn').addEventListener('click', () => load());
$('#moreBtn').addEventListener('click', () => { shown += 60; renderList(); });
$('#q').addEventListener('input', () => { shown = 60; renderList(); });
$('#q').addEventListener('keydown', e => {
  if (e.key === 'Enter') { const r = currentResults()[0]; if (r) window.open(r.url, '_blank', 'noopener'); }
  if (e.key === 'Escape') { $('#q').value = ''; renderList(); }
});
$('#sort').addEventListener('change', e => { sort = e.target.value; store.set('sort', sort); renderList(); });
$$('.seg-btn').forEach(b => b.addEventListener('click', () => { view = b.dataset.view; store.set('view', view); renderList(); }));
document.addEventListener('keydown', e => {
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !$('dialog[open]')) {
    e.preventDefault();
    $('#q').focus();
  }
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
  load().then(ok => { if (ok) fillImages(); });
}

/* ---------- mulai ---------- */
paintIcons();
const share = readShare();
if (share.q) $('#q').value = share.q;
pendingShare = share.url ? share : null;
if (CFG.apiUrl && CFG.token) startApp(); else showConnect();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
