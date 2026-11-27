// Program penyerahan Dompet Keluarga untuk make.fun.
// Menyalin app/ dan screenshots/ dari repo ini ke direktori output lalu
// menulis dossier.json dari buildDossier. Direktori output diambil dari
// MAKEFUN_OUTPUT_DIR, atau /output bila variabel itu tidak ada.
// Direktori output TIDAK PERNAH dihapus — di grader /output adalah mount
// point; hanya isi app/, screenshots/, dan dossier.json yang ditulis ulang.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)));
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR || "/output");

// Penjaga: jangan pernah menulis ke dalam repo sendiri, dan pastikan
// sumber yang disalin memang ada sebelum menyalin apa pun.
if (outDir === repoRoot) throw new Error("MAKEFUN_OUTPUT_DIR tidak boleh sama dengan repo.");
if (!existsSync(resolve(repoRoot, "app", "index.html"))) {
  throw new Error("app/index.html tidak ditemukan di repo.");
}
if (!existsSync(resolve(repoRoot, "screenshots"))) {
  throw new Error("screenshots/ tidak ditemukan di repo.");
}

mkdirSync(outDir, { recursive: true });
mkdirSync(resolve(outDir, "app"), { recursive: true });
mkdirSync(resolve(outDir, "screenshots"), { recursive: true });

cpSync(resolve(repoRoot, "app"), resolve(outDir, "app"), { recursive: true });
cpSync(resolve(repoRoot, "screenshots"), resolve(outDir, "screenshots"), { recursive: true });

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(resolve(outDir, "dossier.json"), dossier);
console.log(`Dompet Keluarga diserahkan ke ${outDir} (dossier ${dossier.length} byte).`);
