// Data awal Dompet Keluarga — keluarga Budi & Sari, Jakarta, November 2026.
// Semua angka rupiah dan konsisten: pemasukan 12.000.000, pengeluaran 8.350.000,
// sisa 3.650.000. Data ini hanya titik awal; pengguna bisa mengubah semuanya
// dari halaman situs, dan perubahan tersimpan di peramban.

export const CATEGORIES = [
  { id: "makan", label: "Makan & Dapur", color: "#1d5c43" },
  { id: "transport", label: "Transport", color: "#e8a13a" },
  { id: "tagihan", label: "Tagihan", color: "#3a6ea5" },
  { id: "sekolah", label: "Sekolah Anak", color: "#7a4fa3" },
  { id: "cicilan", label: "Cicilan", color: "#8a6d3b" },
  { id: "hiburan", label: "Hiburan", color: "#c65d7b" },
  { id: "kesehatan", label: "Kesehatan", color: "#2e8b8b" },
  { id: "lainnya", label: "Lainnya", color: "#6b7280" },
];

export const MONTH_LABELS = {
  "2026-06": "Juni 2026",
  "2026-07": "Juli 2026",
  "2026-08": "Agustus 2026",
  "2026-09": "September 2026",
  "2026-10": "Oktober 2026",
  "2026-11": "November 2026",
};

export const SEED = {
  family: "Keluarga Budi & Sari",
  city: "Jakarta",
  month: "2026-11",
  todayLabel: "26 November 2026",
  income: [
    { id: "in1", date: "2026-11-01", name: "Gaji Budi — kantor", amount: 7500000 },
    { id: "in2", date: "2026-11-01", name: "Gaji Sari — guru", amount: 2800000 },
    { id: "in3", date: "2026-11-15", name: "Jualan online Sari", amount: 1700000 },
  ],
  expenses: [
    { id: "e01", date: "2026-11-02", name: "Belanja mingguan Pasar Minggu", category: "makan", amount: 425000 },
    { id: "e02", date: "2026-11-03", name: "Bensin Pertalite", category: "transport", amount: 150000 },
    { id: "e03", date: "2026-11-03", name: "SPP sekolah Dina", category: "sekolah", amount: 650000 },
    { id: "e04", date: "2026-11-04", name: "Belanja Superindo", category: "makan", amount: 380000 },
    { id: "e05", date: "2026-11-05", name: "Listrik PLN", category: "tagihan", amount: 420000 },
    { id: "e06", date: "2026-11-06", name: "Tol + parkir", category: "transport", amount: 120000 },
    { id: "e07", date: "2026-11-07", name: "Makan siang keluarga", category: "makan", amount: 185000 },
    { id: "e08", date: "2026-11-07", name: "Les matematika Dina", category: "sekolah", amount: 400000 },
    { id: "e09", date: "2026-11-08", name: "Internet rumah", category: "tagihan", amount: 350000 },
    { id: "e10", date: "2026-11-08", name: "Langganan streaming", category: "hiburan", amount: 149000 },
    { id: "e11", date: "2026-11-09", name: "Belanja mingguan", category: "makan", amount: 410000 },
    { id: "e12", date: "2026-11-09", name: "Iuran RT", category: "lainnya", amount: 50000 },
    { id: "e13", date: "2026-11-10", name: "BPJS Kesehatan", category: "tagihan", amount: 350000 },
    { id: "e14", date: "2026-11-10", name: "Bensin Pertalite", category: "transport", amount: 150000 },
    { id: "e15", date: "2026-11-11", name: "Vitamin & obat", category: "kesehatan", amount: 180000 },
    { id: "e16", date: "2026-11-12", name: "Beras 10 kg + minyak", category: "makan", amount: 215000 },
    { id: "e17", date: "2026-11-12", name: "Air PDAM", category: "tagihan", amount: 180000 },
    { id: "e18", date: "2026-11-14", name: "Ojek online antar Dina", category: "transport", amount: 85000 },
    { id: "e19", date: "2026-11-14", name: "Nonton bioskop keluarga", category: "hiburan", amount: 250000 },
    { id: "e20", date: "2026-11-15", name: "Cicilan motor", category: "cicilan", amount: 850000 },
    { id: "e21", date: "2026-11-16", name: "Belanja mingguan", category: "makan", amount: 395000 },
    { id: "e22", date: "2026-11-17", name: "Bensin Pertalite", category: "transport", amount: 150000 },
    { id: "e23", date: "2026-11-18", name: "Periksa gigi Dina", category: "kesehatan", amount: 270000 },
    { id: "e24", date: "2026-11-19", name: "Sayur & lauk pasar", category: "makan", amount: 240000 },
    { id: "e25", date: "2026-11-20", name: "Pulsa & paket data", category: "lainnya", amount: 200000 },
    { id: "e26", date: "2026-11-21", name: "Tol + parkir", category: "transport", amount: 175000 },
    { id: "e27", date: "2026-11-22", name: "Jajan & es krim", category: "hiburan", amount: 221000 },
    { id: "e28", date: "2026-11-23", name: "Belanja mingguan", category: "makan", amount: 400000 },
    { id: "e29", date: "2026-11-24", name: "Bensin Pertalite", category: "transport", amount: 150000 },
    { id: "e30", date: "2026-11-25", name: "Makan malam luar", category: "makan", amount: 200000 },
  ],
  budgets: {
    makan: 3000000,
    transport: 1200000,
    tagihan: 1400000,
    sekolah: 1100000,
    cicilan: 850000,
    hiburan: 700000,
    kesehatan: 500000,
    lainnya: 400000,
  },
  savings: [
    { id: "s1", name: "Dana darurat", note: "Untuk keadaan tak terduga — target 6 bulan pengeluaran.", target: 20000000, saved: 12400000 },
    { id: "s2", name: "Liburan Yogyakarta", note: "Liburan sekolah Dina, Juni 2027: kereta, hotel, dan jajan.", target: 6000000, saved: 3750000 },
    { id: "s3", name: "Pendidikan Dina", note: "Biaya masuk SMP tahun depan, dicicil dari sekarang.", target: 15000000, saved: 5200000 },
    { id: "s4", name: "Ganti motor", note: "Motor lama sudah 9 tahun, ganti begitu dana cukup.", target: 18000000, saved: 2100000 },
  ],
  bills: [
    { id: "b1", name: "Internet rumah", amount: 350000, due: "2026-11-10", paid: true },
    { id: "b2", name: "BPJS Kesehatan", amount: 350000, due: "2026-11-10", paid: true },
    { id: "b3", name: "Air PDAM", amount: 180000, due: "2026-11-15", paid: true },
    { id: "b4", name: "Listrik PLN", amount: 420000, due: "2026-11-20", paid: true },
    { id: "b5", name: "Cicilan motor", amount: 850000, due: "2026-11-28", paid: false },
    { id: "b6", name: "Iuran RT", amount: 50000, due: "2026-11-30", paid: false },
    { id: "b7", name: "SPP sekolah Dina", amount: 650000, due: "2026-12-05", paid: false },
  ],
  // Bulan-bulan sebelumnya: pemasukan dan pengeluaran tercatat.
  history: [
    { month: "2026-06", income: 11800000, expense: 8900000 },
    { month: "2026-07", income: 12100000, expense: 9400000 },
    { month: "2026-08", income: 11900000, expense: 8700000 },
    { month: "2026-09", income: 12300000, expense: 9100000 },
    { month: "2026-10", income: 12000000, expense: 8950000 },
  ],
};

export function freshSeed() {
  return JSON.parse(JSON.stringify(SEED));
}
