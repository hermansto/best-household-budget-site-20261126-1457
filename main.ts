// Dompet Keluarga — program penyerahan (Node 22, pustaka standar saja).
//
// Situsnya ada di app/ di sebelah berkas ini: berkas statis biasa yang
// dibuka peramban dari app/index.html, tanpa langkah build dan tanpa
// memuat apa pun dari jaringan. Program ini menyerahkan situs itu: menyalin
// app/ dan screenshots/ dari repo ke /output lalu menulis
// /output/dossier.json, ringkasan yang dibaca juri (tangkapan layar, berkas
// dan byte muatan pertama, serta sumber), memakai pustaka make.fun yang
// sudah dibundel di vendor/makefun-frontend.ts. Berkas vendor itu jangan
// diubah: penilai membangun ulang dossier dengan salinan yang sama dan
// membandingkan byte demi byte.
//
// Di luar kontainer penilai, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Batas penilai (lihat RULES): paling banyak 4 tangkapan layar, masing-masing
// paling banyak 256 KiB; app/ paling banyak 993 berkas dan direktori dan
// 16 MiB; teks dossier dibatasi 160 KiB.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
