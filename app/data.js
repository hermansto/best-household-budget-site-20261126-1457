// Dompet Keluarga — data contoh keluarga Budi & Sari, Jakarta, November 2026.
// Semua angka dihitung ulang dari daftar transaksi oleh store.js, jadi total
// di layar selalu cocok dengan isi tabel. Hari ini di data: 26 November 2026.

export const TODAY = '2026-11-26';
export const MONTH_LABEL = 'November 2026';
export const FAMILY_NAME = 'Keluarga Budi & Sari';

export const CATEGORIES = [
  { id: 'makan', name: 'Makan & Dapur', color: '#1d5c43' },
  { id: 'transport', name: 'Transport', color: '#e8a13a' },
  { id: 'tagihan', name: 'Tagihan', color: '#3a6ea5' },
  { id: 'sekolah', name: 'Sekolah Anak', color: '#7a4fa3' },
  { id: 'cicilan', name: 'Cicilan', color: '#8a6d3b' },
  { id: 'hiburan', name: 'Hiburan', color: '#c65d7b' },
  { id: 'kesehatan', name: 'Kesehatan', color: '#2e8b8b' },
  { id: 'lainnya', name: 'Lainnya', color: '#6b7280' },
];

export function categoryName(id) {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.name : 'Lainnya';
}

export function categoryColor(id) {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.color : '#6b7280';
}

// Pemasukan November 2026: 7.500.000 + 2.800.000 + 1.700.000 = 12.000.000.
export const SEED_TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', desc: 'Gaji Budi — kantor', category: 'lainnya', amount: 7500000, kind: 'income' },
  { id: 't02', date: '2026-11-01', desc: 'Gaji Sari — guru', category: 'lainnya', amount: 2800000, kind: 'income' },
  { id: 't03', date: '2026-11-02', desc: 'Belanja mingguan Pasar Minggu', category: 'makan', amount: 425000, kind: 'expense' },
  { id: 't04', date: '2026-11-03', desc: 'Bensin Pertalite', category: 'transport', amount: 150000, kind: 'expense' },
  { id: 't05', date: '2026-11-03', desc: 'SPP sekolah Dina', category: 'sekolah', amount: 650000, kind: 'expense' },
  { id: 't06', date: '2026-11-04', desc: 'Belanja Superindo', category: 'makan', amount: 380000, kind: 'expense' },
  { id: 't07', date: '2026-11-05', desc: 'Listrik PLN', category: 'tagihan', amount: 420000, kind: 'expense' },
  { id: 't08', date: '2026-11-06', desc: 'Tol + parkir', category: 'transport', amount: 120000, kind: 'expense' },
  { id: 't09', date: '2026-11-07', desc: 'Makan siang keluarga', category: 'makan', amount: 185000, kind: 'expense' },
  { id: 't10', date: '2026-11-07', desc: 'Les matematika Dina', category: 'sekolah', amount: 400000, kind: 'expense' },
  { id: 't11', date: '2026-11-08', desc: 'Internet rumah', category: 'tagihan', amount: 350000, kind: 'expense' },
  { id: 't12', date: '2026-11-08', desc: 'Langganan streaming', category: 'hiburan', amount: 149000, kind: 'expense' },
  { id: 't13', date: '2026-11-09', desc: 'Belanja mingguan', category: 'makan', amount: 410000, kind: 'expense' },
  { id: 't14', date: '2026-11-09', desc: 'Iuran RT', category: 'lainnya', amount: 50000, kind: 'expense' },
  { id: 't15', date: '2026-11-10', desc: 'BPJS Kesehatan', category: 'tagihan', amount: 350000, kind: 'expense' },
  { id: 't16', date: '2026-11-10', desc: 'Bensin Pertalite', category: 'transport', amount: 150000, kind: 'expense' },
  { id: 't17', date: '2026-11-11', desc: 'Vitamin & obat', category: 'kesehatan', amount: 180000, kind: 'expense' },
  { id: 't18', date: '2026-11-12', desc: 'Beras 10 kg + minyak', category: 'makan', amount: 215000, kind: 'expense' },
  { id: 't19', date: '2026-11-12', desc: 'Air PDAM', category: 'tagihan', amount: 180000, kind: 'expense' },
  { id: 't20', date: '2026-11-14', desc: 'Ojek online antar Dina', category: 'transport', amount: 85000, kind: 'expense' },
  { id: 't21', date: '2026-11-14', desc: 'Nonton bioskop keluarga', category: 'hiburan', amount: 250000, kind: 'expense' },
  { id: 't22', date: '2026-11-15', desc: 'Jualan online Sari', category: 'lainnya', amount: 1700000, kind: 'income' },
  { id: 't23', date: '2026-11-15', desc: 'Cicilan motor', category: 'cicilan', amount: 850000, kind: 'expense' },
  { id: 't24', date: '2026-11-16', desc: 'Belanja mingguan', category: 'makan', amount: 395000, kind: 'expense' },
  { id: 't25', date: '2026-11-17', desc: 'Bensin Pertalite', category: 'transport', amount: 150000, kind: 'expense' },
  { id: 't26', date: '2026-11-18', desc: 'Periksa gigi Dina', category: 'kesehatan', amount: 270000, kind: 'expense' },
  { id: 't27', date: '2026-11-19', desc: 'Sayur & lauk pasar', category: 'makan', amount: 240000, kind: 'expense' },
  { id: 't28', date: '2026-11-20', desc: 'Pulsa & paket data', category: 'lainnya', amount: 200000, kind: 'expense' },
  { id: 't29', date: '2026-11-21', desc: 'Tol + parkir', category: 'transport', amount: 175000, kind: 'expense' },
  { id: 't30', date: '2026-11-22', desc: 'Jajan & es krim', category: 'hiburan', amount: 221000, kind: 'expense' },
  { id: 't31', date: '2026-11-23', desc: 'Belanja mingguan', category: 'makan', amount: 400000, kind: 'expense' },
  { id: 't32', date: '2026-11-24', desc: 'Bensin Pertalite', category: 'transport', amount: 150000, kind: 'expense' },
  { id: 't33', date: '2026-11-25', desc: 'Makan malam luar', category: 'makan', amount: 200000, kind: 'expense' },
];

// Anggaran bulanan per kategori (rupiah). Realisasi dihitung dari transaksi.
export const SEED_BUDGETS = {
  makan: 3000000,
  transport: 1200000,
  tagihan: 1400000,
  sekolah: 1100000,
  cicilan: 850000,
  hiburan: 700000,
  kesehatan: 500000,
  lainnya: 400000,
};

// Target tabungan keluarga.
export const SEED_GOALS = [
  { id: 'g1', name: 'Dana darurat', note: 'Untuk keadaan tak terduga — target 6 bulan pengeluaran.', target: 20000000, saved: 12400000 },
  { id: 'g2', name: 'Liburan Yogyakarta', note: 'Liburan sekolah Dina, Juni 2027: kereta, hotel, dan jajan.', target: 6000000, saved: 3750000 },
  { id: 'g3', name: 'Pendidikan Dina', note: 'Biaya masuk SMP tahun depan, dicicil dari sekarang.', target: 15000000, saved: 5200000 },
  { id: 'g4', name: 'Ganti motor', note: 'Motor lama sudah 9 tahun, ganti begitu dana cukup.', target: 18000000, saved: 2100000 },
];

// Tagihan rutin. Status lunas/belum bisa diubah dari halaman Tagihan.
export const SEED_BILLS = [
  { id: 'b1', name: 'Internet rumah', amount: 350000, due: '2026-11-10', paid: true },
  { id: 'b2', name: 'BPJS Kesehatan', amount: 350000, due: '2026-11-10', paid: true },
  { id: 'b3', name: 'Air PDAM', amount: 180000, due: '2026-11-15', paid: true },
  { id: 'b4', name: 'Listrik PLN', amount: 420000, due: '2026-11-20', paid: true },
  { id: 'b5', name: 'Cicilan motor', amount: 850000, due: '2026-11-28', paid: false },
  { id: 'b6', name: 'Iuran RT', amount: 50000, due: '2026-11-30', paid: false },
  { id: 'b7', name: 'SPP sekolah Dina', amount: 650000, due: '2026-12-05', paid: false },
];

// Ringkasan bulan-bulan sebelumnya (pemasukan & pengeluaran, rupiah).
// November dihitung langsung dari transaksi di atas, bukan dari daftar ini.
export const PAST_MONTHS = [
  { label: 'Jun', income: 11800000, expense: 8900000 },
  { label: 'Jul', income: 12100000, expense: 9400000 },
  { label: 'Agu', income: 11900000, expense: 8700000 },
  { label: 'Sep', income: 12300000, expense: 9100000 },
  { label: 'Okt', income: 12000000, expense: 8950000 },
];
