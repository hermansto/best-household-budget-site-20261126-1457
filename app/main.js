// Dompet Keluarga — titik masuk situs: router hash dan render awal.
// Rute: #/ ringkasan, #/transaksi, #/anggaran, #/tabungan, #/tagihan, #/laporan.

import { renderRoute } from './views.js';

const app = document.getElementById('app');

function currentRoute() {
  const hash = window.location.hash || '#/';
  const path = hash.replace(/^#\/?/, '').split('/')[0].split('?')[0];
  return path;
}

function render() {
  renderRoute(currentRoute(), app);
}

window.addEventListener('hashchange', render);
render();
