# Dompet Keluarga

[![Household budget site bounty](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Rank](https://make.fun/badge/best-household-budget-site-20261126-1457/hermansto/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Reward](https://make.fun/badge/best-household-budget-site-20261126-1457/hermansto/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

Situs anggaran rumah tangga untuk keluarga Budi & Sari di Jakarta, November 2026.
Enam halaman lewat hash route — Ringkasan, Transaksi, Anggaran, Tabungan, Tagihan,
Laporan — semuanya bekerja penuh dari berkas statis, tanpa jaringan sama sekali.

## Angka (November 2026)

- Pemasukan Rp 12.000.000: gaji Budi Rp 7.500.000, gaji Sari Rp 2.800.000, jualan online Rp 1.700.000.
- Pengeluaran Rp 8.350.000 dari 30 transaksi, sisa Rp 3.650.000.
- Anggaran total Rp 9.150.000 untuk 8 kategori; cicilan motor sudah 100% terpakai.
- Tabungan terkumpul Rp 23.450.000 dari target Rp 59.000.000 (4 target).
- Tagihan: 3 belum dibayar, total Rp 1.550.000 (cicilan motor, iuran RT, SPP Dina).

## Yang bisa dilakukan

- **Ringkasan:** pemasukan vs pengeluaran, donat per kategori, anggaran paling ketat, tagihan menunggu, ringkasan tabungan.
- **Transaksi:** tambah, ubah, hapus; saring per kategori; cari teks. Semua total berubah live.
- **Anggaran:** batas 8 kategori bisa diubah, bilah kemajuan menyesuaikan.
- **Tabungan:** tambah dana ke target, buat target baru.
- **Tagihan:** tandai lunas, tambah tagihan baru.
- **Laporan:** perbandingan 6 bulan (Juni–November), pilih bulan, reset data contoh.

Perubahan tersimpan di peramban (localStorage) dan bisa dikembalikan ke data awal
dari halaman Laporan.

## Menjalankan

```sh
node serve.ts            # http://localhost:8080
node serve.ts --port 8090
```

## Menyerahkan (program)

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` menyalin `app/` dan `screenshots/` ke direktori output dan menulis
`dossier.json` lewat `buildDossier` dari `vendor/makefun-frontend.ts`.
Direktori output tidak pernah dihapus — hanya isinya yang ditulis ulang.

## Struktur

- `app/index.html` — kerangka halaman dan navigasi
- `app/style.css` — seluruh tampilan (hijau daun, krem, kuning kunyit)
- `app/data.js` — data awal keluarga (transaksi, anggaran, tabungan, tagihan)
- `app/format.js` — format Rupiah dan tanggal
- `app/store.js` — state dan semua perhitungan live
- `app/charts.js` — donat kategori dan batang bulanan (SVG)
- `app/views.js` — enam halaman dan kontrolnya
- `app/main.js` — router hash
- `app/favicon.png` — ikon dompet, dibuat dari nol
