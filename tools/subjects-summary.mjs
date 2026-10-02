/*
 * Estrae il testo dei subject scaricati (subjects/**.pdf) e ne mette in
 * evidenza le righe utili per controllare i dati della pagina: versione,
 * riassunto, linguaggi ammessi, lavoro di gruppo e librerie consentite.
 * È il controllo fatto a mano per verificare descrizioni e linguaggi.
 *
 * Il testo completo finisce in subjects/text/<slug>.txt (da leggere o cercare
 * con grep), il riassunto in data/subjects-summary.json.
 *
 * Richiede pdftotext (pacchetto poppler-utils).
 * Uso: npm run subjects:summary -- [slug ...] [--quiet]
 */
import { execFile } from "node:child_process";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { ROOT, parseArgs } from "./lib/projects.mjs";

const run = promisify(execFile);
const { slugs, flags } = parseArgs();
const SUBJECTS = new URL("subjects/", ROOT);
const TEXT = new URL("text/", SUBJECTS);

try { await run("pdftotext", ["-v"]); } catch (err) {
  if (err.code === "ENOENT") { console.error("Serve pdftotext: installa poppler-utils."); process.exit(1); }
}

// righe che contano per verificare un progetto
const PATTERNS = {
  language: /\b(language|langage|written in|code in|must (be )?(code|written|coded|done) in|free to use any|any (programming )?language|C\+\+|Rust|Python|Java\b|OCaml|Swift|Kotlin|JavaScript|Solidity|assembly)\b/i,
  team: /\b(group|team|alone|solo)\b/i,
  allowed: /\b(allowed|authorized|forbidden|framework|librar(y|ies))\b/i,
};

// PDF da elaborare: tutti quelli in subjects/ (anche nelle sottocartelle) o solo quelli richiesti
async function pdfs() {
  const entries = await readdir(SUBJECTS, { recursive: true });
  const all = entries.filter((f) => f.endsWith(".pdf")).map((f) => f.slice(0, -4)).sort();
  return slugs.length ? all.filter((f) => slugs.some((s) => f === s || f.startsWith(s + "/"))) : all;
}

const clean = (l) => l.replace(/\s+/g, " ").trim();
const summary = {};

for (const name of await pdfs()) {
  const txt = new URL(name + ".txt", TEXT);
  await mkdir(new URL(".", txt), { recursive: true });
  try {
    await run("pdftotext", ["-layout", fileURLToPath(new URL(name + ".pdf", SUBJECTS)), fileURLToPath(txt)]);
  } catch (err) {
    console.log(name.padEnd(48), "pdftotext fallito: " + err.message);
    continue;
  }
  const lines = (await readFile(txt, "utf8")).split("\n").map(clean).filter(Boolean)
    .filter((l) => !/\.\s\.\s\./.test(l)); // salta l'indice
  const pick = (re, n = 6) => [...new Set(lines.filter((l) => re.test(l)))].slice(0, n);
  const s = {
    version: lines.join(" ").match(/Version:\s*([\d.]+)/)?.[1] ?? null,
    title: lines.slice(0, 3),
    summary: lines.find((l) => /^Summary:/i.test(l)) ?? null,
    language: pick(PATTERNS.language),
    team: pick(PATTERNS.team, 4),
    allowed: pick(PATTERNS.allowed, 4),
  };
  summary[name] = s;

  if (!flags.quiet) {
    console.log("\n== " + name + (s.version ? "  (v" + s.version + ")" : ""));
    if (s.summary) console.log("   " + s.summary);
    for (const key of ["language", "team", "allowed"]) for (const l of s[key]) console.log("   [" + key + "] " + l.slice(0, 150));
  }
}

await mkdir(new URL("data/", ROOT), { recursive: true });
await writeFile(new URL("data/subjects-summary.json", ROOT), JSON.stringify(summary, null, 2) + "\n");
console.log("\n" + Object.keys(summary).length + " subject elaborati: testo in subjects/text/, riassunto in data/subjects-summary.json.");
