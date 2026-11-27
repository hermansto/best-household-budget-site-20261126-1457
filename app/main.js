// Router dan titik masuk Dompet Keluarga.
// Membaca hash route (#/, #/transaksi, …), merender halaman yang cocok,
// menandai tautan aktif, dan merender ulang saat state berubah.

import {
  viewDashboard, viewTransactions, bindTransactions,
  viewBudget, bindBudget, viewSavings, bindSavings,
  viewBills, bindBills, viewReport, bindReport, setRenderer,
} from "./views.js";

const ROUTES = {
  "/": { render: viewDashboard, bind: null, label: "Ringkasan" },
  "/transaksi": { render: viewTransactions, bind: bindTransactions, label: "Transaksi" },
  "/anggaran": { render: viewBudget, bind: bindBudget, label: "Anggaran" },
  "/tabungan": { render: viewSavings, bind: bindSavings, label: "Tabungan" },
  "/tagihan": { render: viewBills, bind: bindBills, label: "Tagihan" },
  "/laporan": { render: viewReport, bind: bindReport, label: "Laporan" },
};

function currentRoute() {
  const hash = location.hash.replace(/^#/, "") || "/";
  return ROUTES[hash] ? hash : "/";
}

export function render() {
  const route = currentRoute();
  const page = ROUTES[route];
  const root = document.getElementById("view");
  root.innerHTML = page.render();
  if (page.bind) page.bind(root);
  document.querySelectorAll("nav a").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === "#" + route);
    if (a.getAttribute("href") === "#" + route) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  window.scrollTo(0, 0);
}

setRenderer(render);
window.addEventListener("hashchange", render);
render();
