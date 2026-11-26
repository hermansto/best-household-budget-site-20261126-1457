// Dompet Keluarga — penyimpanan dan hitungan. Satu sumber kebenaran untuk
// semua halaman: tambah, ubah, dan hapus di sini, lalu semua total, grafik,
// dan kartu ikut berubah. Data tersimpan di peramban (localStorage) dan bisa
// dikembalikan ke data contoh kapan pun.

import { SEED_TRANSACTIONS, SEED_BUDGETS, SEED_GOALS, SEED_BILLS, TODAY } from './data.js';

const STORAGE_KEY = 'dompet-keluarga-v1';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function seedState() {
  return {
    transactions: clone(SEED_TRANSACTIONS),
    budgets: { ...SEED_BUDGETS },
    goals: clone(SEED_GOALS),
    bills: clone(SEED_BILLS),
  };
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions)) return seedState();
    return {
      transactions: parsed.transactions,
      budgets: { ...SEED_BUDGETS, ...(parsed.budgets || {}) },
      goals: Array.isArray(parsed.goals) ? parsed.goals : clone(SEED_GOALS),
      bills: Array.isArray(parsed.bills) ? parsed.bills : clone(SEED_BILLS),
    };
  } catch {
    return seedState();
  }
}

export const store = {
  state: loadState(),

  save() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Penyimpanan penuh atau dimatikan: aplikasi tetap jalan di memori.
    }
  },

  reset() {
    this.state = seedState();
    this.save();
  },

  totals() {
    let income = 0;
    let expense = 0;
    for (const t of this.state.transactions) {
      if (t.kind === 'income') income += t.amount;
      else expense += t.amount;
    }
    return { income, expense, balance: income - expense };
  },

  byCategory() {
    const map = {};
    for (const t of this.state.transactions) {
      if (t.kind !== 'expense') continue;
      map[t.category] = (map[t.category] || 0) + t.amount;
    }
    return map;
  },

  budgetTotal() {
    return Object.values(this.state.budgets).reduce((a, b) => a + b, 0);
  },

  goalsTotal() {
    let saved = 0;
    let target = 0;
    for (const g of this.state.goals) {
      saved += g.saved;
      target += g.target;
    }
    return { saved, target };
  },

  upcomingBills() {
    return this.state.bills
      .filter((b) => !b.paid)
      .sort((a, b) => (a.due < b.due ? -1 : 1));
  },

  unpaidTotal() {
    return this.upcomingBills().reduce((sum, b) => sum + b.amount, 0);
  },

  daysUntil(iso) {
    const msPerDay = 24 * 60 * 60 * 1000;
    const today = new Date(TODAY + 'T00:00:00');
    const due = new Date(iso + 'T00:00:00');
    return Math.round((due - today) / msPerDay);
  },

  addTransaction(entry) {
    const id = 't' + Date.now().toString(36);
    this.state.transactions.push({ id, ...entry });
    this.state.transactions.sort((a, b) => (a.date < b.date ? 1 : -1));
    this.save();
    return id;
  },

  updateTransaction(id, entry) {
    const item = this.state.transactions.find((t) => t.id === id);
    if (!item) return false;
    Object.assign(item, entry);
    this.state.transactions.sort((a, b) => (a.date < b.date ? 1 : -1));
    this.save();
    return true;
  },

  deleteTransaction(id) {
    this.state.transactions = this.state.transactions.filter((t) => t.id !== id);
    this.save();
  },

  setBudget(category, amount) {
    this.state.budgets[category] = Math.max(0, Math.round(amount) || 0);
    this.save();
  },

  addToGoal(id, amount) {
    const goal = this.state.goals.find((g) => g.id === id);
    if (!goal) return false;
    goal.saved = Math.min(goal.target, goal.saved + Math.max(0, Math.round(amount) || 0));
    this.save();
    return true;
  },

  addGoal(entry) {
    const id = 'g' + Date.now().toString(36);
    this.state.goals.push({ id, ...entry });
    this.save();
    return id;
  },

  toggleBill(id) {
    const bill = this.state.bills.find((b) => b.id === id);
    if (!bill) return false;
    bill.paid = !bill.paid;
    this.save();
    return true;
  },

  addBill(entry) {
    const id = 'b' + Date.now().toString(36);
    this.state.bills.push({ id, paid: false, ...entry });
    this.state.bills.sort((a, b) => (a.due < b.due ? -1 : 1));
    this.save();
    return id;
  },
};
