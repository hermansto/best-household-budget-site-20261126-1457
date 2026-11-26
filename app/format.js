// Dompet Keluarga — format angka dan tanggal untuk layar.

export function rupiah(n) {
  const value = Math.round(Number(n) || 0);
  return 'Rp ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function rupiahShort(n) {
  const value = Number(n) || 0;
  if (Math.abs(value) >= 1000000) {
    const jt = value / 1000000;
    return 'Rp ' + (Number.isInteger(jt) ? jt : jt.toFixed(1).replace('.', ',')) + ' jt';
  }
  if (Math.abs(value) >= 1000) return 'Rp ' + Math.round(value / 1000) + ' rb';
  return rupiah(value);
}

export function percent(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export function dateId(iso) {
  const parts = String(iso || '').split('-');
  if (parts.length !== 3) return String(iso || '');
  const day = Number(parts[2]);
  const month = MONTHS_ID[Number(parts[1]) - 1] || '';
  return day + ' ' + month + ' ' + parts[0];
}

export function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
