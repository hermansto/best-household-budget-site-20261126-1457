[![Household budget site bounty](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Rank](https://make.fun/badge/best-household-budget-site-20261126-1457/hermansto/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![Reward](https://make.fun/badge/best-household-budget-site-20261126-1457/hermansto/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

# Dompet Keluarga — Atur Uang Rumah Tangga

Situs budget rumah tangga untuk keluarga Indonesia, berjalan sepenuhnya
offline dari berkas statis: buka `app/index.html` di peramban desktop atau
ponsel, tanpa jaringan. Semua angka nyata dan konsisten — pemasukan
Rp 12.000.000, pengeluaran Rp 8.350.000, sisa Rp 3.650.000 di November 2026 —
dan semua kontrol benar-benar bekerja.

## Yang ada di situs

- **Ringkasan** (`#/`): pemasukan vs pengeluaran, sisa bulan ini, grafik donat
  pengeluaran per kategori, anggaran paling ketat, tagihan menunggu, tabungan.
- **Transaksi** (`#/transaksi`): tambah, ubah, hapus, saring per kategori,
  dan cari — semua total dan grafik ikut berubah.
- **Anggaran** (`#/anggaran`): batas belanja 8 kategori (total
  Rp 9.150.000) dengan bilah kemajuan; angkanya bisa diubah.
- **Tabungan** (`#/tabungan`): 4 target (dana darurat, liburan, pendidikan,
  ganti motor), tambah dana, dan buat target baru.
- **Tagihan** (`#/tagihan`): 7 tagihan rutin dengan jatuh tempo dan hitung
  mundur hari, tandai lunas, tambah tagihan baru.
- **Laporan** (`#/laporan`): perbandingan pemasukan vs pengeluaran Juni–
  November 2026 dengan grafik batang, tabel, dan bacaan tren.

Data tersimpan di peramban sendiri (localStorage); tombol "Kembalikan data
contoh" mengembalikan angka keluarga Budi & Sari.

## Menjalankan

```sh
node serve.ts
# buka http://localhost:8080
```

## Penyerahan

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` menyalin `app/` dan `screenshots/` ke direktori output dan menulis
`dossier.json` memakai `vendor/makefun-frontend.ts` (salinan kit, tanpa ubah).

## Lisensi

MIT — lihat `LICENSE`.
