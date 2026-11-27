// Format angka rupiah dan tanggal untuk Dompet Keluarga.

export function formatRupiah(n) {
  const v = Math.round(Number(n) || 0);
  return "Rp " + v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatShort(n) {
  const v = Number(n) || 0;
  if (v >= 1000000) {
    const jt = v / 1000000;
    return "Rp " + (Number.isInteger(jt) ? jt : jt.toFixed(1).replace(".", ",")) + " jt";
  }
  if (v >= 1000) return "Rp " + Math.round(v / 1000) + " rb";
  return formatRupiah(v);
}

export function formatDate(iso) {
  const parts = String(iso).split("-");
  if (parts.length !== 3) return String(iso);
  return Number(parts[2]) + " Nov " + parts[0];
}

export function formatDue(iso) {
  const months = { "11": "Nov", "12": "Des" };
  const parts = String(iso).split("-");
  if (parts.length !== 3) return String(iso);
  return Number(parts[2]) + " " + (months[parts[1]] || parts[1]) + " " + parts[0];
}

export function pct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
