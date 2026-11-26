// Dompet Keluarga — halaman-halaman situs: Ringkasan, Transaksi, Anggaran,
// Tabungan, Tagihan, dan Laporan. Setiap halaman dirender dari store yang
// sama, jadi perubahan di satu halaman langsung terlihat di halaman lain.

import { CATEGORIES, MONTH_LABEL, FAMILY_NAME, PAST_MONTHS, TODAY, categoryName, categoryColor } from './data.js';
import { store } from './store.js';
import { rupiah, rupiahShort, percent, dateId, escapeHtml } from './format.js';
import { donutChart, monthBars } from './charts.js';

let editingId = null;
let txFilterCategory = 'semua';
let txSearch = '';
let reportMonth = 'Nov';

function statCard(label, value, note, tone) {
  return '<div class="stat' + (tone ? ' ' + tone : '') + '"><div class="label">' + label + '</div>'
    + '<div class="value">' + value + '</div><div class="note">' + note + '</div></div>';
}

function categoryOptions(selected) {
  return CATEGORIES.map((c) => '<option value="' + c.id + '"' + (c.id === selected ? ' selected' : '') + '>' + c.name + '</option>').join('');
}

function barClass(pct) {
  if (pct >= 100) return 'red';
  if (pct >= 90) return 'amber';
  return '';
}

// ---------------- Ringkasan ----------------

function viewDashboard() {
  const totals = store.totals();
  const byCat = store.byCategory();
  const budgets = store.state.budgets;
  const goals = store.goalsTotal();
  const upcoming = store.upcomingBills();
  const slices = CATEGORIES
    .map((c) => ({ name: c.name, value: byCat[c.id] || 0, color: c.color }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);
  const biggest = slices[0];
  const budgetRows = CATEGORIES.map((c) => {
    const spent = byCat[c.id] || 0;
    const limit = budgets[c.id] || 0;
    const pct = percent(spent, limit);
    return { name: c.name, spent, limit, pct };
  }).sort((a, b) => b.pct - a.pct).slice(0, 4);

  return '<h1>Ringkasan ' + MONTH_LABEL + '</h1>'
    + '<p class="lede">Selamat datang, ' + FAMILY_NAME + '. Ini posisi uang keluarga bulan ini — pemasukan, pengeluaran, tagihan yang menunggu, dan tabungan yang jalan.</p>'
    + '<div class="grid-stats">'
    + statCard('Pemasukan', rupiah(totals.income), 'Dari 3 sumber: gaji Budi, gaji Sari, jualan online', 'good')
    + statCard('Pengeluaran', rupiah(totals.expense), store.state.transactions.filter((t) => t.kind === 'expense').length + ' pengeluaran tercatat', 'warn')
    + statCard('Sisa bulan ini', rupiah(totals.balance), percent(totals.balance, totals.income) + '% dari pemasukan belum terpakai')
    + statCard('Target tabungan', rupiahShort(goals.saved), 'dari target ' + rupiahShort(goals.target) + ' (' + percent(goals.saved, goals.target) + '%)')
    + '</div>'
    + '<div class="callout"><strong>Pengeluaran terbesar:</strong> ' + biggest.name + ' ' + rupiah(biggest.value)
    + ' — ' + percent(biggest.value, totals.expense) + '% dari semua pengeluaran. Masih dalam anggaran ' + rupiah(budgets.makan) + '.</div>'
    + '<div class="grid-two grid-two-wide">'
    + '<section class="card"><h2>Pengeluaran per kategori</h2><div class="donut-wrap">'
    + donutChart(slices, 190)
    + '<ul class="donut-legend">' + slices.map((s) => '<li><span class="dot" style="background:' + s.color + '"></span>' + s.name
      + '<span class="amt">' + rupiah(s.value) + '</span></li>').join('') + '</ul>'
    + '</div><p><a href="#/transaksi">Lihat semua transaksi →</a></p></section>'
    + '<section class="card"><h2>Anggaran paling ketat</h2>'
    + budgetRows.map((r) => '<div class="bar-row"><span>' + r.name + '</span><span class="bar-track"><span class="bar-fill ' + barClass(r.pct) + '" style="display:block;width:' + Math.min(100, r.pct) + '%"></span></span><span class="bar-num">' + r.pct + '%</span></div>').join('')
    + '<p><a href="#/anggaran">Atur semua anggaran →</a></p></section>'
    + '</div>'
    + '<div class="grid-two">'
    + '<section class="card"><h2>Tagihan yang menunggu</h2>'
    + (upcoming.length === 0
      ? '<p>Semua tagihan sudah lunas. Lega.</p>'
      : '<p><strong>' + upcoming.length + ' tagihan</strong> belum dibayar, total <strong>' + rupiah(store.unpaidTotal()) + '</strong>.</p>'
        + '<ul>' + upcoming.map((b) => '<li><strong>' + escapeHtml(b.name) + '</strong> — ' + rupiah(b.amount) + ', jatuh tempo ' + dateId(b.due)
          + ' (' + store.daysUntil(b.due) + ' hari lagi)</li>').join('') + '</ul>')
    + '<p><a href="#/tagihan">Kelola tagihan →</a></p></section>'
    + '<section class="card"><h2>Tabungan keluarga</h2>'
    + '<p class="big">' + rupiah(goals.saved) + '</p>'
    + '<div class="progress"><span style="width:' + percent(goals.saved, goals.target) + '%"></span></div>'
    + '<p class="muted">' + percent(goals.saved, goals.target) + '% dari target gabungan ' + rupiah(goals.target) + ' tercapai.</p>'
    + '<p><a href="#/tabungan">Lihat target tabungan →</a></p></section>'
    + '</div>';
}

// ---------------- Transaksi ----------------

function filteredTransactions() {
  return store.state.transactions.filter((t) => {
    if (txFilterCategory !== 'semua' && t.category !== txFilterCategory) return false;
    if (txSearch && !t.desc.toLowerCase().includes(txSearch.toLowerCase())) return false;
    return true;
  });
}

function viewTransactions() {
  const list = filteredTransactions();
  const totals = store.totals();
  const editing = editingId ? store.state.transactions.find((t) => t.id === editingId) : null;
  const formTitle = editing ? 'Ubah transaksi' : 'Catat transaksi baru';
  const formDate = editing ? editing.date : TODAY;
  const formDesc = editing ? editing.desc : '';
  const formCat = editing ? editing.category : 'makan';
  const formKind = editing ? editing.kind : 'expense';
  const formAmount = editing ? editing.amount : '';

  const rows = list.map((t) => '<tr><td>' + dateId(t.date) + '</td><td>' + escapeHtml(t.desc) + '</td>'
    + '<td><span class="pill cat">' + categoryName(t.category) + '</span></td>'
    + '<td class="num ' + (t.kind === 'income' ? 'pos' : 'neg') + '">' + (t.kind === 'income' ? '+' : '−') + ' ' + rupiah(t.amount) + '</td>'
    + '<td class="hide-phone"><button class="btn btn-ghost btn-small" data-edit="' + t.id + '">Ubah</button> '
    + '<button class="btn btn-danger btn-small" data-delete="' + t.id + '">Hapus</button></td></tr>').join('');

  return '<h1>Transaksi</h1>'
    + '<p class="lede">Semua pemasukan dan pengeluaran ' + FAMILY_NAME + ' di ' + MONTH_LABEL + '. Menambah, mengubah, atau menghapus di sini langsung mengubah ringkasan, anggaran, dan laporan.</p>'
    + '<div class="grid-stats">'
    + statCard('Pemasukan', rupiah(totals.income), 'Total bulan ini', 'good')
    + statCard('Pengeluaran', rupiah(totals.expense), list.filter((t) => t.kind === 'expense').length + ' dari ' + store.state.transactions.filter((t) => t.kind === 'expense').length + ' pengeluaran tampil')
    + statCard('Sisa', rupiah(totals.balance), percent(totals.balance, totals.income) + '% pemasukan tersisa')
    + '</div>'
    + '<section class="card"><h2>' + formTitle + '</h2>'
    + '<form id="tx-form"><div class="form-grid">'
    + '<div class="field"><label for="tx-date">Tanggal</label><input id="tx-date" type="date" value="' + formDate + '" required></div>'
    + '<div class="field"><label for="tx-kind">Jenis</label><select id="tx-kind"><option value="expense"' + (formKind === 'expense' ? ' selected' : '') + '>Pengeluaran</option><option value="income"' + (formKind === 'income' ? ' selected' : '') + '>Pemasukan</option></select></div>'
    + '<div class="field wide"><label for="tx-desc">Keterangan</label><input id="tx-desc" type="text" maxlength="80" placeholder="Contoh: Belanja mingguan" value="' + escapeHtml(formDesc) + '" required></div>'
    + '<div class="field"><label for="tx-cat">Kategori</label><select id="tx-cat">' + categoryOptions(formCat) + '</select></div>'
    + '<div class="field"><label for="tx-amount">Jumlah (Rp)</label><input id="tx-amount" type="number" min="1000" step="1000" placeholder="250000" value="' + formAmount + '" required></div>'
    + '</div><button type="submit">' + (editing ? 'Simpan perubahan' : 'Tambah transaksi') + '</button> '
    + (editing ? '<button type="button" class="btn-ghost" id="tx-cancel">Batal</button>' : '')
    + '</form></section>'
    + '<section class="card"><h2>Daftar transaksi</h2>'
    + '<div class="toolbar"><div class="field"><label for="tx-filter">Kategori</label><select id="tx-filter">'
    + '<option value="semua">Semua kategori</option>' + categoryOptions(txFilterCategory === 'semua' ? '' : txFilterCategory) + '</select></div>'
    + '<div class="field"><label for="tx-search">Cari keterangan</label><input id="tx-search" type="search" placeholder="Contoh: bensin" value="' + escapeHtml(txSearch) + '"></div></div>'
    + (list.length === 0
      ? '<p class="empty">Tidak ada transaksi yang cocok. Ubah filter atau catat transaksi baru di atas.</p>'
      : '<div class="table-scroll"><table><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th><th class="hide-phone">Aksi</th></tr></thead><tbody>' + rows + '</tbody></table></div>')
    + '<p class="notice">Menampilkan ' + list.length + ' dari ' + store.state.transactions.length + ' transaksi. <button class="btn btn-ghost btn-small" id="tx-reset">Kembalikan data contoh</button></p>'
    + '</section>';
}

// ---------------- Anggaran ----------------

function viewBudget() {
  const byCat = store.byCategory();
  const totalBudget = store.budgetTotal();
  const totals = store.totals();
  const rows = CATEGORIES.map((c) => {
    const spent = byCat[c.id] || 0;
    const limit = store.state.budgets[c.id] || 0;
    const pct = percent(spent, limit);
    const rest = limit - spent;
    return '<div class="card"><div class="goal-head"><h3>' + c.name + '</h3><span class="' + (rest < 0 ? 'neg' : 'pos') + '">' + (rest < 0 ? 'Lebih ' + rupiah(-rest) : 'Sisa ' + rupiah(rest)) + '</span></div>'
      + '<p class="muted">' + rupiah(spent) + ' dari ' + rupiah(limit) + ' (' + pct + '%)</p>'
      + '<div class="progress"><span class="' + barClass(pct) + '" style="width:' + Math.min(100, pct) + '%"></span></div>'
      + '<form class="budget-form" data-cat="' + c.id + '" style="margin-top:0.7rem"><div class="toolbar"><div class="field"><label for="budget-' + c.id + '">Anggaran baru (Rp)</label>'
      + '<input id="budget-' + c.id + '" type="number" min="0" step="50000" value="' + limit + '"></div>'
      + '<button type="submit" class="btn-small">Simpan anggaran</button></div></form></div>';
  }).join('');

  return '<h1>Anggaran Bulanan</h1>'
    + '<p class="lede">Batas belanja tiap kategori untuk ' + MONTH_LABEL + '. Ubah angkanya dan bilah kemajuan langsung menyesuaikan — tidak ada kategori yang boleh lewat tanpa terlihat.</p>'
    + '<div class="grid-stats">'
    + statCard('Total anggaran', rupiah(totalBudget), 'Untuk 8 kategori')
    + statCard('Sudah terpakai', rupiah(totals.expense), percent(totals.expense, totalBudget) + '% dari anggaran')
    + statCard('Sisa anggaran', rupiah(totalBudget - totals.expense), 'Masih bisa dipakai sampai akhir bulan', totalBudget - totals.expense < 0 ? 'warn' : 'good')
    + '</div>'
    + '<div class="callout green"><strong>Cara membaca:</strong> bilah kuning berarti sudah di atas 90% anggaran, merah berarti sudah lewat. Cicilan motor sudah 100% karena dibayar lunas tanggal 15 — itu wajar, bukan boros.</div>'
    + rows
    + '<p><a href="#/laporan">Bandingkan dengan bulan lalu →</a></p>';
}

// ---------------- Tabungan ----------------

function viewSavings() {
  const goals = store.goalsTotal();
  const totals = store.totals();
  const cards = store.state.goals.map((g) => {
    const pct = percent(g.saved, g.target);
    return '<div class="card"><div class="goal-head"><h3>' + escapeHtml(g.name) + '</h3><span class="saved">' + rupiah(g.saved) + '</span></div>'
      + '<p class="muted">' + escapeHtml(g.note) + '</p>'
      + '<div class="progress"><span style="width:' + Math.min(100, pct) + '%"></span></div>'
      + '<p class="muted">' + pct + '% dari target ' + rupiah(g.target) + ' · kurang ' + rupiah(g.target - g.saved) + '</p>'
      + '<form class="goal-form" data-goal="' + g.id + '"><div class="toolbar"><div class="field"><label for="add-' + g.id + '">Tambah dana (Rp)</label>'
      + '<input id="add-' + g.id + '" type="number" min="1000" step="1000" placeholder="500000"></div>'
      + '<button type="submit" class="btn-small btn-amber">Tambah ke tabungan</button></div></form></div>';
  }).join('');

  return '<h1>Target Tabungan</h1>'
    + '<p class="lede">Empat hal yang sedang ditabung keluarga ini. Sisa bulan ini ' + rupiah(totals.balance) + ' — sebagian bisa langsung dialokasikan ke target di bawah.</p>'
    + '<div class="grid-stats">'
    + statCard('Terkumpul', rupiah(goals.saved), percent(goals.saved, goals.target) + '% dari semua target', 'good')
    + statCard('Total target', rupiah(goals.target), store.state.goals.length + ' target aktif')
    + statCard('Masih kurang', rupiah(goals.target - goals.saved), 'Ditabung sedikit demi sedikit')
    + '</div>'
    + cards
    + '<section class="card"><h2>Buat target baru</h2>'
    + '<form id="goal-new"><div class="form-grid">'
    + '<div class="field wide"><label for="goal-name">Nama target</label><input id="goal-name" type="text" maxlength="60" placeholder="Contoh: Umroh orang tua" required></div>'
    + '<div class="field"><label for="goal-target">Target (Rp)</label><input id="goal-target" type="number" min="100000" step="50000" placeholder="10000000" required></div>'
    + '<div class="field"><label for="goal-saved">Sudah terkumpul (Rp)</label><input id="goal-saved" type="number" min="0" step="50000" value="0"></div>'
    + '<div class="field wide"><label for="goal-note">Catatan</label><input id="goal-note" type="text" maxlength="120" placeholder="Untuk apa tabungan ini?"></div>'
    + '</div><button type="submit">Tambah target</button></form></section>';
}

// ---------------- Tagihan ----------------

function viewBills() {
  const upcoming = store.upcomingBills();
  const paid = store.state.bills.filter((b) => b.paid);
  const rows = store.state.bills.map((b) => {
    const days = store.daysUntil(b.due);
    const status = b.paid
      ? '<span class="pill paid">Lunas</span>'
      : '<span class="pill ' + (days < 0 ? 'over' : 'due') + '">' + (days < 0 ? 'Terlambat ' + (-days) + ' hari' : days === 0 ? 'Jatuh tempo hari ini' : days + ' hari lagi') + '</span>';
    return '<tr><td><strong>' + escapeHtml(b.name) + '</strong></td><td class="num">' + rupiah(b.amount) + '</td><td class="hide-phone">' + dateId(b.due) + '</td><td>' + status + '</td>'
      + '<td><button class="btn btn-ghost btn-small" data-bill="' + b.id + '">' + (b.paid ? 'Batalkan' : 'Tandai lunas') + '</button></td></tr>';
  }).join('');

  return '<h1>Tagihan &amp; Jatuh Tempo</h1>'
    + '<p class="lede">Semua tagihan rutin keluarga — listrik, air, internet, sekolah, cicilan — dengan tanggal jatuh temponya. Tandai lunas begitu dibayar supaya tidak ada yang terlewat.</p>'
    + '<div class="grid-stats">'
    + statCard('Belum dibayar', rupiah(store.unpaidTotal()), upcoming.length + ' tagihan menunggu', upcoming.length ? 'warn' : 'good')
    + statCard('Sudah lunas', rupiah(paid.reduce((s, b) => s + b.amount, 0)), paid.length + ' dari ' + store.state.bills.length + ' tagihan', 'good')
    + statCard('Paling dekat', upcoming.length ? dateId(upcoming[0].due) : '—', upcoming.length ? escapeHtml(upcoming[0].name) + ' · ' + rupiah(upcoming[0].amount) : 'Tidak ada tagihan menunggu')
    + '</div>'
    + (upcoming.length
      ? '<div class="callout"><strong>Segera:</strong> ' + escapeHtml(upcoming[0].name) + ' ' + rupiah(upcoming[0].amount) + ' jatuh tempo ' + dateId(upcoming[0].due)
        + ' — ' + store.daysUntil(upcoming[0].due) + ' hari lagi. Siapkan dari sisa bulan ini ' + rupiah(store.totals().balance) + '.</div>'
      : '')
    + '<section class="card"><h2>Semua tagihan</h2><div class="table-scroll"><table><thead><tr><th>Tagihan</th><th class="num">Jumlah</th><th class="hide-phone">Jatuh tempo</th><th>Status</th><th>Aksi</th></tr></thead><tbody>'
    + rows + '</tbody></table></div></section>'
    + '<section class="card"><h2>Tambah tagihan</h2>'
    + '<form id="bill-form"><div class="form-grid">'
    + '<div class="field wide"><label for="bill-name">Nama tagihan</label><input id="bill-name" type="text" maxlength="60" placeholder="Contoh: Iuran sampah" required></div>'
    + '<div class="field"><label for="bill-amount">Jumlah (Rp)</label><input id="bill-amount" type="number" min="1000" step="1000" placeholder="75000" required></div>'
    + '<div class="field"><label for="bill-due">Jatuh tempo</label><input id="bill-due" type="date" value="2026-12-10" required></div>'
    + '</div><button type="submit">Tambah tagihan</button></form></section>';
}

// ---------------- Laporan ----------------

function viewReport() {
  const totals = store.totals();
  const months = PAST_MONTHS.map((m) => ({ ...m, selected: m.label === reportMonth }));
  months.push({ label: 'Nov', income: totals.income, expense: totals.expense, selected: reportMonth === 'Nov' });
  const maxValue = Math.max(...months.map((m) => Math.max(m.income, m.expense)));
  const selected = months.find((m) => m.label === reportMonth) || months[months.length - 1];
  const all = months;
  const avgExpense = Math.round(all.reduce((s, m) => s + m.expense, 0) / all.length);
  const avgIncome = Math.round(all.reduce((s, m) => s + m.income, 0) / all.length);
  const cheapest = all.reduce((best, m) => (m.expense < best.expense ? m : best), all[0]);
  const byCat = store.byCategory();
  const biggestCat = CATEGORIES.map((c) => ({ name: c.name, value: byCat[c.id] || 0 }))
    .sort((a, b) => b.value - a.value)[0];

  const tableRows = months.map((m) => '<tr' + (m.selected ? ' class="total"' : '') + '><td><strong>' + m.label + ' 2026</strong></td>'
    + '<td class="num pos">' + rupiah(m.income) + '</td><td class="num neg">' + rupiah(m.expense) + '</td>'
    + '<td class="num">' + rupiah(m.income - m.expense) + '</td><td class="num">' + percent(m.income - m.expense, m.income) + '%</td></tr>').join('');

  return '<h1>Laporan Bulanan</h1>'
    + '<p class="lede">Pemasukan lawan pengeluaran Juni sampai November 2026. Pilih satu bulan untuk melihat ringkasannya, atau baca trennya dari grafik.</p>'
    + '<section class="card"><h2>Pemasukan vs pengeluaran</h2>'
    + '<div class="month-bars">' + monthBars(months, maxValue) + '</div>'
    + '<p class="legend-line"><span><span class="dot" style="background:#1d5c43"></span> Pemasukan</span><span><span class="dot" style="background:#e8a13a"></span> Pengeluaran</span></p>'
    + '<div class="toolbar" role="group" aria-label="Pilih bulan">'
    + months.map((m) => '<button class="btn-small ' + (m.selected ? '' : 'btn-ghost') + '" data-month="' + m.label + '">' + m.label + '</button>').join('')
    + '</div>'
    + '<div class="grid-stats">'
    + statCard('Pemasukan ' + selected.label, rupiah(selected.income), 'Bulan yang dipilih')
    + statCard('Pengeluaran ' + selected.label, rupiah(selected.expense), 'Bulan yang dipilih', 'warn')
    + statCard('Sisa ' + selected.label, rupiah(selected.income - selected.expense), percent(selected.income - selected.expense, selected.income) + '% ditabung')
    + '</div></section>'
    + '<section class="card"><h2>Perbandingan enam bulan</h2><div class="table-scroll"><table><thead><tr><th>Bulan</th><th class="num">Pemasukan</th><th class="num">Pengeluaran</th><th class="num">Sisa</th><th class="num">Ditabung</th></tr></thead><tbody>'
    + tableRows + '</tbody></table></div></section>'
    + '<section class="card"><h2>Yang bisa dibaca dari angka ini</h2><ul>'
    + '<li><strong>Bulan paling hemat:</strong> ' + cheapest.label + ' 2026 — pengeluaran ' + rupiah(cheapest.expense) + ', paling rendah dalam enam bulan.</li>'
    + '<li><strong>Rata-rata pengeluaran</strong> enam bulan terakhir: ' + rupiah(avgExpense) + ' per bulan, dari rata-rata pemasukan ' + rupiah(avgIncome) + '.</li>'
    + '<li><strong>Kategori terbesar bulan ini:</strong> ' + biggestCat.name + ' ' + rupiah(biggestCat.value) + ' — ' + percent(biggestCat.value, totals.expense) + '% dari pengeluaran November.</li>'
    + '<li><strong>Tren bagus:</strong> pengeluaran November ' + rupiah(totals.expense) + ' turun dari Oktober ' + rupiah(PAST_MONTHS[4].expense) + ', sementara pemasukan stabil di ' + rupiah(totals.income) + '.</li>'
    + '<li><strong>Saran:</strong> jaga makan di bawah ' + rupiah(store.state.budgets.makan) + ' dan sisihkan sisa ' + rupiah(totals.balance) + ' ke dana darurat begitu gajian.</li>'
    + '</ul><p><a href="#/tabungan">Alokasikan sisa ke tabungan →</a></p></section>';
}

// ---------------- Router ----------------

const VIEWS = {
  '': viewDashboard,
  transaksi: viewTransactions,
  anggaran: viewBudget,
  tabungan: viewSavings,
  tagihan: viewBills,
  laporan: viewReport,
};

export function renderRoute(route, root) {
  const view = VIEWS[route] || viewDashboard;
  root.innerHTML = view();
  wireEvents(route, root);
  document.querySelectorAll('.mainnav a').forEach((a) => {
    a.classList.toggle('active', (a.dataset.route || '') === route);
  });
}

function readNumber(id) {
  const el = document.getElementById(id);
  return el ? Math.round(Number(el.value) || 0) : 0;
}

function wireEvents(route, root) {
  if (route === 'transaksi') {
    // Tombol Ubah/Hapus dipasang ulang setiap kali isi tabel diganti
    // (misalnya saat mengetik di kotak cari), supaya selalu berfungsi.
    const attachRowActions = () => {
      root.querySelectorAll('[data-edit]').forEach((btn) => btn.addEventListener('click', () => {
        editingId = btn.dataset.edit;
        renderRoute('transaksi', root);
        window.scrollTo(0, 0);
      }));
      root.querySelectorAll('[data-delete]').forEach((btn) => btn.addEventListener('click', () => {
        store.deleteTransaction(btn.dataset.delete);
        renderRoute('transaksi', root);
      }));
    };
    const form = document.getElementById('tx-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const entry = {
        date: document.getElementById('tx-date').value || TODAY,
        desc: document.getElementById('tx-desc').value.trim(),
        category: document.getElementById('tx-cat').value,
        kind: document.getElementById('tx-kind').value,
        amount: readNumber('tx-amount'),
      };
      if (!entry.desc || entry.amount <= 0) return;
      if (editingId) store.updateTransaction(editingId, entry);
      else store.addTransaction(entry);
      editingId = null;
      renderRoute('transaksi', root);
    });
    const cancel = document.getElementById('tx-cancel');
    if (cancel) cancel.addEventListener('click', () => { editingId = null; renderRoute('transaksi', root); });
    document.getElementById('tx-filter').addEventListener('change', (event) => {
      txFilterCategory = event.target.value;
      renderRoute('transaksi', root);
    });
    document.getElementById('tx-search').addEventListener('input', (event) => {
      txSearch = event.target.value;
      const table = root.querySelector('table');
      const empty = root.querySelector('.empty');
      const note = root.querySelector('.notice');
      const list = filteredTransactions();
      if (table) {
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = list.map((t) => '<tr><td>' + dateId(t.date) + '</td><td>' + escapeHtml(t.desc) + '</td>'
          + '<td><span class="pill cat">' + categoryName(t.category) + '</span></td>'
          + '<td class="num ' + (t.kind === 'income' ? 'pos' : 'neg') + '">' + (t.kind === 'income' ? '+' : '−') + ' ' + rupiah(t.amount) + '</td>'
          + '<td class="hide-phone"><button class="btn btn-ghost btn-small" data-edit="' + t.id + '">Ubah</button> '
          + '<button class="btn btn-danger btn-small" data-delete="' + t.id + '">Hapus</button></td></tr>').join('');
        attachRowActions();
      }
      if (empty && list.length > 0) empty.remove();
      if (note) note.firstChild.textContent = 'Menampilkan ' + list.length + ' dari ' + store.state.transactions.length + ' transaksi. ';
    });
    attachRowActions();
    const reset = document.getElementById('tx-reset');
    if (reset) reset.addEventListener('click', () => {
      store.reset();
      editingId = null;
      txFilterCategory = 'semua';
      txSearch = '';
      renderRoute('transaksi', root);
    });
  }

  if (route === 'anggaran') {
    root.querySelectorAll('.budget-form').forEach((form) => form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = form.querySelector('input');
      store.setBudget(form.dataset.cat, Number(input.value) || 0);
      renderRoute('anggaran', root);
    }));
  }

  if (route === 'tabungan') {
    root.querySelectorAll('.goal-form').forEach((form) => form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = form.querySelector('input');
      const amount = Number(input.value) || 0;
      if (amount > 0) store.addToGoal(form.dataset.goal, amount);
      renderRoute('tabungan', root);
    }));
    const form = document.getElementById('goal-new');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('goal-name').value.trim();
      const target = readNumber('goal-target');
      const saved = readNumber('goal-saved');
      const note = document.getElementById('goal-note').value.trim() || 'Target baru keluarga.';
      if (!name || target <= 0) return;
      store.addGoal({ name, target, saved: Math.min(saved, target), note });
      renderRoute('tabungan', root);
    });
  }

  if (route === 'tagihan') {
    root.querySelectorAll('[data-bill]').forEach((btn) => btn.addEventListener('click', () => {
      store.toggleBill(btn.dataset.bill);
      renderRoute('tagihan', root);
    }));
    const form = document.getElementById('bill-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('bill-name').value.trim();
      const amount = readNumber('bill-amount');
      const due = document.getElementById('bill-due').value || TODAY;
      if (!name || amount <= 0) return;
      store.addBill({ name, amount, due });
      renderRoute('tagihan', root);
    });
  }

  if (route === 'laporan') {
    root.querySelectorAll('[data-month]').forEach((btn) => btn.addEventListener('click', () => {
      reportMonth = btn.dataset.month;
      renderRoute('laporan', root);
    }));
  }
}
