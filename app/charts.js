// Dompet Keluarga — grafik SVG tanpa pustaka: donat kategori dan batang bulanan.

import { rupiahShort } from './format.js';

const TAU = Math.PI * 2;

export function donutChart(slices, size) {
  const radius = 62;
  const center = size / 2;
  const circumference = TAU * radius;
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  if (!total) {
    return '<svg viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size + '" role="img" aria-label="Belum ada pengeluaran">'
      + '<circle cx="' + center + '" cy="' + center + '" r="' + radius + '" fill="none" stroke="#e4dccb" stroke-width="26"/></svg>';
  }
  let offset = 0.25 * circumference;
  let circles = '';
  for (const slice of slices) {
    const fraction = slice.value / total;
    const length = Math.max(0, fraction * circumference - 2);
    circles += '<circle cx="' + center + '" cy="' + center + '" r="' + radius + '" fill="none" stroke="' + slice.color
      + '" stroke-width="26" stroke-dasharray="' + length.toFixed(1) + ' ' + circumference.toFixed(1)
      + '" stroke-dashoffset="' + offset.toFixed(1) + '"/>';
    offset -= fraction * circumference;
  }
  return '<svg viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size + '" role="img" aria-label="Pembagian pengeluaran per kategori">'
    + circles
    + '<text x="' + center + '" y="' + (center - 4) + '" text-anchor="middle" font-size="15" font-weight="700" fill="#22302a">Total</text>'
    + '<text x="' + center + '" y="' + (center + 16) + '" text-anchor="middle" font-size="12" fill="#5b6b62">' + rupiahShort(total) + '</text></svg>';
}

export function monthBars(months, maxValue) {
  const max = Math.max(1, maxValue || 0);
  return months.map((m) => {
    const inHeight = Math.max(3, Math.round((m.income / max) * 100));
    const outHeight = Math.max(3, Math.round((m.expense / max) * 100));
    return '<div class="month-col' + (m.selected ? ' sel' : '') + '">'
      + '<div class="bars"><i class="in" style="height:' + inHeight + 'px" title="Pemasukan ' + rupiahShort(m.income) + '"></i>'
      + '<i class="out" style="height:' + outHeight + 'px" title="Pengeluaran ' + rupiahShort(m.expense) + '"></i></div>'
      + '<span class="m-label">' + m.label + '</span></div>';
  }).join('');
}
