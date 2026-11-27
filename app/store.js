// State dan perhitungan Dompet Keluarga.
// Semua total dihitung live dari daftar transaksi, bukan angka tempel.
// Perubahan disimpan di localStorage (kunci dompet-keluarga-v1); kalau
// penyimpanan tidak tersedia, state tetap hidup selama halaman dibuka.

import { CATEGORIES, MONTH_LABELS, freshSeed } from "./data.js";

const KEY = "dompet-keluarga-v1";
let state = freshSeed();
let memoryOnly = false;

try {
  const raw = localStorage.getItem(KEY);
  if (raw) {
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.expenses) && Array.isArray(parsed.income)) {
      state = parsed;
    }
  }
} catch (e) {
  memoryOnly = true;
}

export function getState() {
  return state;
}

export function saveState() {
  if (memoryOnly) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    memoryOnly = true;
  }
}

export function resetSeed() {
  state = freshSeed();
  saveState();
}

export function totalIncome() {
  return state.income.reduce((s, x) => s + x.amount, 0);
}

export function totalExpense() {
  return state.expenses.reduce((s, x) => s + x.amount, 0);
}

export function remaining() {
  return totalIncome() - totalExpense();
}

export function spendByCategory() {
  const out = {};
  for (const c of CATEGORIES) out[c.id] = 0;
  for (const t of state.expenses) {
    if (out[t.category] === undefined) out[t.category] = 0;
    out[t.category] += t.amount;
  }
  return out;
}

export function totalBudget() {
  return Object.values(state.budgets).reduce((s, v) => s + v, 0);
}

export function tightestBudgets() {
  const spent = spendByCategory();
  return CATEGORIES.map((c) => ({
    ...c,
    spent: spent[c.id] || 0,
    limit: state.budgets[c.id] || 0,
    ratio: (spent[c.id] || 0) / (state.budgets[c.id] || 1),
  })).sort((a, b) => b.ratio - a.ratio);
}

export function unpaidBills() {
  return state.bills.filter((b) => !b.paid);
}

export function unpaidTotal() {
  return unpaidBills().reduce((s, b) => s + b.amount, 0);
}

export function savingsTotals() {
  const saved = state.savings.reduce((s, g) => s + g.saved, 0);
  const target = state.savings.reduce((s, g) => s + g.target, 0);
  return { saved, target };
}

export function monthSummary(monthKey) {
  if (monthKey === state.month) {
    return { label: MONTH_LABELS[monthKey] || monthKey, income: totalIncome(), expense: totalExpense() };
  }
  const row = state.history.find((h) => h.month === monthKey);
  if (row) return { label: MONTH_LABELS[monthKey] || monthKey, income: row.income, expense: row.expense };
  return { label: MONTH_LABELS[monthKey] || monthKey, income: 0, expense: 0 };
}

export function monthOptions() {
  return [...state.history.map((h) => h.month), state.month];
}

let counter = 100;
export function nextId(prefix) {
  counter += 1;
  return prefix + Date.now().toString(36) + counter;
}

export function addExpense(tx) {
  state.expenses.push({ id: nextId("e"), ...tx });
  state.expenses.sort((a, b) => (a.date < b.date ? -1 : 1));
  saveState();
}

export function updateExpense(id, patch) {
  const t = state.expenses.find((x) => x.id === id);
  if (t) Object.assign(t, patch);
  saveState();
}

export function deleteExpense(id) {
  state.expenses = state.expenses.filter((x) => x.id !== id);
  saveState();
}

export function setBudget(categoryId, amount) {
  state.budgets[categoryId] = Math.max(0, Math.round(amount) || 0);
  saveState();
}

export function addSavings(goalId, amount) {
  const g = state.savings.find((x) => x.id === goalId);
  if (g) g.saved = Math.min(g.target, g.saved + Math.max(0, Math.round(amount) || 0));
  saveState();
}

export function addGoal(goal) {
  state.savings.push({ id: nextId("s"), saved: 0, ...goal });
  saveState();
}

export function markBillPaid(id) {
  const b = state.bills.find((x) => x.id === id);
  if (b) b.paid = true;
  saveState();
}

export function addBill(bill) {
  state.bills.push({ id: nextId("b"), paid: false, ...bill });
  state.bills.sort((a, b) => (a.due < b.due ? -1 : 1));
  saveState();
}
