// Halaman-halaman Dompet Keluarga: Ringkasan, Transaksi, Anggaran,
// Tabungan, Tagihan, Laporan. Setiap halaman merender dari state live
// dan mengikat kontrolnya sendiri.

import { CATEGORIES, MONTH_LABELS } from "./data.js";
import { formatRupiah, formatShort, formatDate, formatDue, pct, escapeHtml } from "./format.js";
import { donutChart, monthBars } from "./charts.js";
import {
  getState, totalIncome, totalExpense, remaining, spendByCategory,
  totalBudget, tightestBudgets, unpaidBills, unpaidTotal, savingsTotals,
  monthSummary, monthOptions, addExpense, updateExpense, deleteExpense,
  setBudget, addSavings, addGoal, markBillPaid, addBill, resetSeed,
} from "./store.js";

function catLabel(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.label : id;
}

function catColor(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.color : "#6b7280";
}

function barRow(label, spent, limit, color) {
  const p = pct(spent, limit);
  const over = spent > limit;
  return (
    '<div class="budget-row"><div class="budget-head"><span><span class="dot" style="background:' + color + '"></span>' +
    escapeHtml(label) + '</span><span class="budget-nums">' + formatRupiah(spent) + " / " + formatRupiah(limit) +
    ' <strong class="' + (over ? "over" : "") + '">' + p + "%</strong></span></div>" +
    '<div class="meter"><div class="meter-fill' + (over ? " over" : "") + '" style="width:' + Math.min(100, p) + "%;background:" + color + '"></div></div></div>'
  );
}

export function viewDashboard() {
  const s = getState();
  const spent = spendByCategory();
  const tight = tightestBudgets().slice(0, 3);
  const unpaid = unpaidBills();
  const sav = savingsTotals();
  const donutRows = CATEGORIES.map((c) => ({ label: c.label, color: c.color, value: spent[c.id] || 0 }));
  const legend = CATEGORIES.map(
    (c) =>
      '<li><span class="dot" style="background:' + c.color + '"></span>' + escapeHtml(c.label) +
      '<span class="legend-val">' + formatRupiah(spent[c.id] || 0) + " · " + pct(spent[c.id] || 0, totalExpense()) + "%</span></li>"
  ).join("");
  const tightRows = tight
    .map(
      (t) =>
        '<li class="tight-item"><span><span class="dot" style="background:' + t.color + '"></span>' + escapeHtml(t.label) +
        '</span><span>' + formatRupiah(t.spent) + " dari " + formatRupiah(t.limit) + " · <strong>" + pct(t.spent, t.limit) + "%</strong></span></li>"
    )
    .join("");
  const billRows = unpaid
    .map(
      (b) =>
        '<li class="bill-line"><span>' + escapeHtml(b.name) + " · jatuh tempo " + formatDue(b.due) +
        "</span><strong>" + formatRupiah(b.amount) + "</strong></li>"
    )
    .join("");
  return (
    '<section class="page-head"><h1>Ringkasan November 2026</h1>' +
    "<p>" + escapeHtml(s.family) + " · " + escapeHtml(s.city) + " · data sampai " + escapeHtml(s.todayLabel) + "</p></section>" +
    '<div class="stat-grid">' +
    '<div class="stat in"><span class="stat-label">Pemasukan bulan ini</span><strong>' + formatRupiah(totalIncome()) + '</strong><span class="stat-sub">3 sumber: gaji Budi, gaji Sari, jualan online</span></div>' +
    '<div class="stat out"><span class="stat-label">Pengeluaran bulan ini</span><strong>' + formatRupiah(totalExpense()) + '</strong><span class="stat-sub">' + s.expenses.length + " transaksi tercatat</span></div>" +
    '<div class="stat left"><span class="stat-label">Sisa uang bulan ini</span><strong>' + formatRupiah(remaining()) + '</strong><span class="stat-sub">' + pct(remaining(), totalIncome()) + "% dari pemasukan belum terpakai</span></div>" +
    "</div>" +
    '<div class="two-col"><div class="card"><h2>Pengeluaran per kategori</h2><div class="donut-wrap">' + donutChart(donutRows, 180) +
    '<ul class="legend">' + legend + "</ul></div></div>" +
    '<div class="card"><h2>Anggaran paling ketat</h2><ul class="tight-list">' + tightRows + "</ul>" +
    '<p class="hint">Cicilan motor sudah 100% terpakai — tidak ada ruang lagi bulan ini. <a href="#/anggaran">Lihat semua anggaran</a></p></div></div>' +
    '<div class="two-col"><div class="card"><h2>Tagihan menunggu · ' + unpaid.length + ' tagihan</h2><ul class="bill-list">' + billRows + "</ul>" +
    '<p class="bill-total">Total belum dibayar: <strong>' + formatRupiah(unpaidTotal()) + '</strong> · <a href="#/tagihan">Buka daftar tagihan</a></p></div>' +
    '<div class="card"><h2>Ringkasan tabungan</h2><p class="big-line">Terkumpul <strong>' + formatRupiah(sav.saved) + "</strong> dari target " + formatRupiah(sav.target) + " (" + pct(sav.saved, sav.target) + "%)</p>" +
    '<div class="meter big"><div class="meter-fill" style="width:' + pct(sav.saved, sav.target) + '%"></div></div>' +
    "<p>Dana darurat memimpin: " + formatRupiah(12400000) + " dari " + formatRupiah(20000000) + ". <a href=\"#/tabungan\">Kelola tabungan</a></p></div></div>"
  );
}

let txFilter = "semua";
let txQuery = "";
let editingId = null;

export function viewTransactions() {
  const s = getState();
  const q = txQuery.trim().toLowerCase();
  const rows = s.expenses
    .filter((t) => (txFilter === "semua" || t.category === txFilter) && (!q || t.name.toLowerCase().includes(q)))
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const shownTotal = rows.reduce((x, t) => x + t.amount, 0);
  const opts = ['<option value="semua">Semua kategori</option>'].concat(
    CATEGORIES.map((c) => '<option value="' + c.id + '"' + (txFilter === c.id ? " selected" : "") + ">" + escapeHtml(c.label) + "</option>")
  ).join("");
  const edit = editingId ? s.expenses.find((t) => t.id === editingId) : null;
  const formCats = CATEGORIES.map(
    (c) => '<option value="' + c.id + '"' + (edit && edit.category === c.id ? " selected" : "") + ">" + escapeHtml(c.label) + "</option>"
  ).join("");
  const tableRows = rows
    .map(
      (t) =>
        '<tr><td>' + formatDate(t.date) + "</td><td>" + escapeHtml(t.name) + '</td><td><span class="tag" style="--tag:' + catColor(t.category) + '">' +
        escapeHtml(catLabel(t.category)) + '</span></td><td class="num">' + formatRupiah(t.amount) + "</td>" +
        '<td class="actions"><button type="button" data-edit="' + t.id + '">Ubah</button>' +
        '<button type="button" data-del="' + t.id + '">Hapus</button></td></tr>'
    )
    .join("");
  return (
    '<section class="page-head"><h1>Transaksi</h1><p>Semua pemasukan dan pengeluaran tercatat di sini. Total ikut berubah setiap kali ada transaksi baru.</p></section>' +
    '<div class="card"><h2>' + (edit ? "Ubah transaksi" : "Tambah transaksi baru") + "</h2>" +
    '<form id="tx-form" class="form-grid">' +
    '<label>Nama transaksi<input id="tx-name" required maxlength="80" value="' + (edit ? escapeHtml(edit.name) : "") + '" placeholder="Contoh: Belanja mingguan"></label>' +
    '<label>Tanggal<input id="tx-date" type="date" required value="' + (edit ? edit.date : "2026-11-26") + '"></label>' +
    '<label>Kategori<select id="tx-cat">' + formCats + "</select></label>" +
    '<label>Jumlah (Rp)<input id="tx-amount" type="number" min="1000" step="1000" required value="' + (edit ? edit.amount : "") + '" placeholder="150000"></label>' +
    '<div class="form-actions"><button class="btn" type="submit">' + (edit ? "Simpan perubahan" : "Tambah transaksi") + "</button>" +
    (edit ? '<button class="btn ghost" type="button" id="tx-cancel">Batal</button>' : "") + "</div></form></div>" +
    '<div class="card"><div class="filter-row"><label>Saring <select id="tx-filter">' + opts + "</select></label>" +
    '<label>Cari <input id="tx-search" type="search" value="' + escapeHtml(txQuery) + '" placeholder="Cari nama transaksi…"></label>' +
    '<span class="filter-total">Menampilkan <strong>' + rows.length + "</strong> transaksi · total <strong>" + formatRupiah(shownTotal) + "</strong></span></div>" +
    '<div class="table-wrap"><table><thead><tr><th>Tanggal</th><th>Nama</th><th>Kategori</th><th class="num">Jumlah</th><th>Aksi</th></tr></thead><tbody>' +
    (tableRows || '<tr><td colspan="5">Tidak ada transaksi yang cocok.</td></tr>') + "</tbody></table></div></div>"
  );
}

export function bindTransactions(root) {
  const form = root.querySelector("#tx-form");
  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const name = root.querySelector("#tx-name").value.trim();
      const date = root.querySelector("#tx-date").value;
      const category = root.querySelector("#tx-cat").value;
      const amount = Math.round(Number(root.querySelector("#tx-amount").value) || 0);
      if (!name || !date || amount <= 0) return;
      if (editingId) {
        updateExpense(editingId, { name, date, category, amount });
        editingId = null;
      } else {
        addExpense({ name, date, category, amount });
      }
      renderCurrent();
    });
  }
  const cancel = root.querySelector("#tx-cancel");
  if (cancel) cancel.addEventListener("click", () => { editingId = null; renderCurrent(); });
  const filter = root.querySelector("#tx-filter");
  if (filter) filter.addEventListener("change", () => { txFilter = filter.value; renderCurrent(); });
  const search = root.querySelector("#tx-search");
  if (search) {
    search.addEventListener("input", () => { txQuery = search.value; renderCurrent(); const again = document.querySelector("#tx-search"); if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); } });
  }
  root.querySelectorAll("[data-del]").forEach((b) =>
    b.addEventListener("click", () => { deleteExpense(b.getAttribute("data-del")); renderCurrent(); })
  );
  root.querySelectorAll("[data-edit]").forEach((b) =>
    b.addEventListener("click", () => { editingId = b.getAttribute("data-edit"); renderCurrent(); })
  );
}

export function viewBudget() {
  const spent = spendByCategory();
  const rows = CATEGORIES.map(
    (c) =>
      '<div class="card budget-card"><h2>' + escapeHtml(c.label) + "</h2>" + barRow(c.label, spent[c.id] || 0, getState().budgets[c.id] || 0, c.color) +
      '<label class="budget-edit">Batas baru (Rp) <input type="number" min="0" step="50000" value="' + (getState().budgets[c.id] || 0) + '" data-budget="' + c.id + '"></label></div>'
  ).join("");
  return (
    '<section class="page-head"><h1>Anggaran</h1><p>Total anggaran bulan ini <strong>' + formatRupiah(totalBudget()) +
    "</strong> · terpakai <strong>" + formatRupiah(totalExpense()) + "</strong> (" + pct(totalExpense(), totalBudget()) + "%). Ubah angka batasnya, bilah langsung menyesuaikan.</p></section>" +
    '<div class="budget-grid">' + rows + "</div>"
  );
}

export function bindBudget(root) {
  root.querySelectorAll("[data-budget]").forEach((input) =>
    input.addEventListener("change", () => {
      setBudget(input.getAttribute("data-budget"), Number(input.value));
      renderCurrent();
    })
  );
}

export function viewSavings() {
  const sav = savingsTotals();
  const cards = getState().savings
    .map(
      (g) =>
        '<div class="card goal-card"><h2>' + escapeHtml(g.name) + "</h2><p>" + escapeHtml(g.note) + "</p>" +
        '<p class="big-line">Terkumpul <strong>' + formatRupiah(g.saved) + "</strong> dari " + formatRupiah(g.target) + " · " + pct(g.saved, g.target) + "%</p>" +
        '<div class="meter"><div class="meter-fill" style="width:' + Math.min(100, pct(g.saved, g.target)) + '%"></div></div>' +
        '<form class="add-funds" data-goal="' + g.id + '"><label>Tambah dana (Rp)<input type="number" min="1000" step="1000" required placeholder="500000"></label>' +
        '<button class="btn" type="submit">Tambah dana</button></form></div>'
    )
    .join("");
  return (
    '<section class="page-head"><h1>Tabungan</h1><p>Total terkumpul <strong>' + formatRupiah(sav.saved) + "</strong> dari target " + formatRupiah(sav.target) +
    " (" + pct(sav.saved, sav.target) + "%). Dana darurat adalah prioritas keluarga.</p></section>" +
    '<div class="goal-grid">' + cards + "</div>" +
    '<div class="card"><h2>Buat target tabungan baru</h2>' +
    '<form id="goal-form" class="form-grid"><label>Nama target<input id="goal-name" required maxlength="60" placeholder="Contoh: Renovasi dapur"></label>' +
    '<label>Catatan<input id="goal-note" maxlength="120" placeholder="Untuk apa tabungan ini?"></label>' +
    '<label>Target (Rp)<input id="goal-target" type="number" min="100000" step="100000" required placeholder="5000000"></label>' +
    '<div class="form-actions"><button class="btn" type="submit">Buat target</button></div></form></div>'
  );
}

export function bindSavings(root) {
  root.querySelectorAll(".add-funds").forEach((form) =>
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const amount = Math.round(Number(form.querySelector("input").value) || 0);
      if (amount > 0) { addSavings(form.getAttribute("data-goal"), amount); renderCurrent(); }
    })
  );
  const gf = root.querySelector("#goal-form");
  if (gf) {
    gf.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const name = root.querySelector("#goal-name").value.trim();
      const note = root.querySelector("#goal-note").value.trim() || "Target baru keluarga.";
      const target = Math.round(Number(root.querySelector("#goal-target").value) || 0);
      if (!name || target <= 0) return;
      addGoal({ name, note, target });
      renderCurrent();
    });
  }
}

export function viewBills() {
  const s = getState();
  const rows = s.bills
    .map(
      (b) =>
        '<li class="bill-row' + (b.paid ? " paid" : "") + '"><div><strong>' + escapeHtml(b.name) + "</strong><span>Jatuh tempo " + formatDue(b.due) + "</span></div>" +
        '<div class="bill-right"><strong>' + formatRupiah(b.amount) + "</strong>" +
        (b.paid ? '<span class="paid-tag">Lunas</span>' : '<button class="btn small" type="button" data-pay="' + b.id + '">Tandai lunas</button>') + "</div></li>"
    )
    .join("");
  return (
    '<section class="page-head"><h1>Tagihan</h1><p><strong>' + unpaidBills().length + " tagihan belum dibayar</strong> · total <strong>" + formatRupiah(unpaidTotal()) +
    "</strong>. Tagihan yang sudah lunas tetap tercatat di bawah.</p></section>" +
    '<div class="card"><ul class="bill-list big">' + rows + "</ul></div>" +
    '<div class="card"><h2>Tambah tagihan baru</h2>' +
    '<form id="bill-form" class="form-grid"><label>Nama tagihan<input id="bill-name" required maxlength="60" placeholder="Contoh: Iuran kebersihan"></label>' +
    '<label>Jumlah (Rp)<input id="bill-amount" type="number" min="1000" step="1000" required placeholder="75000"></label>' +
    '<label>Jatuh tempo<input id="bill-due" type="date" required value="2026-11-30"></label>' +
    '<div class="form-actions"><button class="btn" type="submit">Tambah tagihan</button></div></form></div>'
  );
}

export function bindBills(root) {
  root.querySelectorAll("[data-pay]").forEach((b) =>
    b.addEventListener("click", () => { markBillPaid(b.getAttribute("data-pay")); renderCurrent(); })
  );
  const bf = root.querySelector("#bill-form");
  if (bf) {
    bf.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const name = root.querySelector("#bill-name").value.trim();
      const amount = Math.round(Number(root.querySelector("#bill-amount").value) || 0);
      const due = root.querySelector("#bill-due").value;
      if (!name || amount <= 0 || !due) return;
      addBill({ name, amount, due });
      renderCurrent();
    });
  }
}

let reportMonth = "2026-11";

export function viewReport() {
  const months = monthOptions();
  const opts = months
    .map((m) => '<option value="' + m + '"' + (reportMonth === m ? " selected" : "") + ">" + escapeHtml(MONTH_LABELS[m] || m) + "</option>")
    .join("");
  const rows = months.map((m) => ({ label: (MONTH_LABELS[m] || m).replace(" 2026", ""), ...monthSummary(m) }));
  const cur = monthSummary(reportMonth);
  const surplus = cur.income - cur.expense;
  const tableRows = months
    .map((m) => {
      const r = monthSummary(m);
      return "<tr><td>" + escapeHtml(MONTH_LABELS[m] || m) + '</td><td class="num">' + formatRupiah(r.income) + '</td><td class="num">' + formatRupiah(r.expense) + '</td><td class="num">' + formatRupiah(r.income - r.expense) + "</td></tr>";
    })
    .join("");
  return (
    '<section class="page-head"><h1>Laporan</h1><p>Perbandingan pemasukan dan pengeluaran enam bulan terakhir. November dihitung langsung dari transaksi yang tercatat.</p></section>' +
    '<div class="card"><div class="filter-row"><label>Pilih bulan <select id="report-month">' + opts + "</select></label>" +
    '<span class="filter-total">' + escapeHtml(cur.label) + ": pemasukan <strong>" + formatRupiah(cur.income) + "</strong> · pengeluaran <strong>" + formatRupiah(cur.expense) +
    "</strong> · sisa <strong>" + formatRupiah(surplus) + "</strong></span></div>" +
    '<div class="bar-chart">' + monthBars(rows) + "</div>" +
    '<p class="legend-inline"><span class="swatch in"></span> Pemasukan &nbsp; <span class="swatch out"></span> Pengeluaran</p></div>' +
    '<div class="card"><h2>Ringkasan per bulan</h2><div class="table-wrap"><table><thead><tr><th>Bulan</th><th class="num">Pemasukan</th><th class="num">Pengeluaran</th><th class="num">Sisa</th></tr></thead><tbody>' +
    tableRows + "</tbody></table></div>" +
    '<p class="hint">Rata-rata pengeluaran lima bulan terakhir: <strong>' + formatRupiah(Math.round((8900000 + 9400000 + 8700000 + 9100000 + 8950000) / 5)) +
    '</strong> per bulan. November sejauh ini ' + (totalExpense() < 8950000 ? "di bawah" : "di atas") + " rata-rata itu.</p>" +
    '<button class="btn danger" type="button" id="reset-data">Reset data contoh</button> ' +
    '<span class="hint">Mengembalikan semua angka ke data awal 26 November 2026.</span></div>'
  );
}

export function bindReport(root) {
  const sel = root.querySelector("#report-month");
  if (sel) sel.addEventListener("change", () => { reportMonth = sel.value; renderCurrent(); });
  const reset = root.querySelector("#reset-data");
  if (reset) reset.addEventListener("click", () => { resetSeed(); reportMonth = "2026-11"; renderCurrent(); });
}

// Dipanggil ulang oleh main.js setiap kali state berubah.
export let renderCurrent = () => {};
export function setRenderer(fn) {
  renderCurrent = fn;
}
