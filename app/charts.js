// Grafik Dompet Keluarga: donat pengeluaran per kategori (SVG) dan
// batang pemasukan vs pengeluaran per bulan. Tanpa pustaka luar.

import { formatRupiah, formatShort } from "./format.js";

export function donutChart(rows, size) {
  const total = rows.reduce((s, r) => s + r.value, 0) || 1;
  const r = 70;
  const cx = 90;
  const cy = 90;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const rings = rows
    .filter((x) => x.value > 0)
    .map((x) => {
      const frac = x.value / total;
      const dash = frac * circ;
      const el =
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' +
        x.color + '" stroke-width="34" stroke-dasharray="' + dash.toFixed(1) + " " +
        (circ - dash).toFixed(1) + '" stroke-dashoffset="' + (-offset).toFixed(1) + '"/>';
      offset += dash;
      return el;
    })
    .join("");
  const hole =
    '<circle cx="' + cx + '" cy="' + cy + '" r="52" fill="#fffdf6"/>' +
    '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="15" font-weight="700" fill="#1d2b23">Total</text>' +
    '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" font-size="12" fill="#5b6b60">' +
    formatShort(total) + "</text>";
  return (
    '<svg class="donut" viewBox="0 0 180 180" width="' + size + '" height="' + size +
    '" role="img" aria-label="Donat pengeluaran per kategori, total ' + formatRupiah(total) + '">' +
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#e9e2d2" stroke-width="34"/>' +
    rings + hole + "</svg>"
  );
}

export function monthBars(rows) {
  const max = Math.max(1, ...rows.flatMap((r) => [r.income, r.expense]));
  return rows
    .map((r) => {
      const hi = Math.max(4, Math.round((r.income / max) * 120));
      const he = Math.max(4, Math.round((r.expense / max) * 120));
      return (
        '<div class="bar-group"><div class="bars">' +
        '<div class="bar in" style="height:' + hi + 'px" title="Pemasukan ' + formatRupiah(r.income) + '"></div>' +
        '<div class="bar out" style="height:' + he + 'px" title="Pengeluaran ' + formatRupiah(r.expense) + '"></div>' +
        "</div>" +
        '<div class="bar-label">' + r.label + "</div>" +
        '<div class="bar-values">' + formatShort(r.income) + " / " + formatShort(r.expense) + "</div></div>"
      );
    })
    .join("");
}
