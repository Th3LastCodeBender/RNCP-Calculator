/*
 * Scarica i PDF dei subject in subjects/<slug>.pdf, con un indice in
 * subjects/index.json (aggiornato, non sostituito).
 *
 * L'API con scope "public" non espone gli allegati: lo script legge i link
 * dalla pagina del progetto sull'intra (serve INTRA_COOKIE in .env) e scarica
 * i PDF dal CDN, che è pubblico.
 *
 * Se un progetto non ha un PDF (o con --modules), scarica i PDF dei suoi
 * sotto-progetti in subjects/<slug>/<modulo>.pdf: utile per le piscine, il cui
 * PDF principale è solo una presentazione.
 *
 * Uso: npm run subjects -- [sorgente] [--lang fr] [--force] [--modules]
 *   --force   riscarica anche i PDF già presenti
 * I PDF sono materiale di 42: non ripubblicarli.
 */
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { login, client } from "./lib/api42.mjs";
import { intraCookie, intra, parseProjectPage, pickPdf, ExpiredCookie } from "./lib/intra.mjs";
import { ROOT, parseArgs, resolveSlugs, childrenOf } from "./lib/projects.mjs";

const args = parseArgs();
const { force, modules, lang = "en" } = args.flags;
const page = intra(intraCookie({ required: true }));

// l'API serve solo per la sorgente --cursus e per trovare i moduli
let api = null;
const getApi = async () => (api ??= client(await login()));
const slugs = await resolveSlugs(args, args.flags.cursus || args.flags.children ? await getApi() : null);

const OUT = new URL("subjects/", ROOT);
await mkdir(OUT, { recursive: true });
const indexFile = new URL("index.json", OUT);
let index = {};
try { index = JSON.parse(await readFile(indexFile, "utf8")); } catch { /* primo avvio */ }

const exists = (url) => access(url).then(() => true, () => false);

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.subarray(0, 4).toString() !== "%PDF") throw new Error("la risposta non è un PDF");
  await writeFile(dest, buf);
}

// subject di uno slug in dest: "già presente", il link usato, o null se la pagina non ne ha
async function fetchSubject(slug, dest) {
  if (!force && (await exists(dest))) return "già presente";
  const html = await page(slug);
  const url = html && pickPdf(parseProjectPage(html).pdfs, lang);
  if (!url) return null;
  await download(url, dest);
  return url;
}

async function fetchModules(slug) {
  const mods = await childrenOf(slug, await getApi());
  const dir = new URL(slug + "/", OUT);
  await mkdir(dir, { recursive: true });
  const files = [];
  for (const mod of mods) {
    try {
      const url = await fetchSubject(mod, new URL(mod + ".pdf", dir));
      if (url) files.push({ module: mod, file: slug + "/" + mod + ".pdf", url });
    } catch (err) {
      if (err instanceof ExpiredCookie) throw err;
      console.log("  " + mod.padEnd(46), "fallito: " + err.message);
    }
  }
  return { files, total: mods.length };
}

const missing = [];
try {
  for (const slug of slugs) {
    let url = null;
    try { url = await fetchSubject(slug, new URL(slug + ".pdf", OUT)); } catch (err) {
      if (err instanceof ExpiredCookie) throw err;
      console.log(slug.padEnd(48), "fallito: " + err.message);
    }
    if (url) {
      index[slug] = { ...index[slug], file: slug + ".pdf", ...(url !== "già presente" && { url }) };
      console.log(slug.padEnd(48), url === "già presente" ? url : "ok");
    }
    if (!url || modules) {
      const { files, total } = await fetchModules(slug);
      if (files.length) index[slug] = { ...index[slug], modules: files };
      if (total) console.log(slug.padEnd(48), files.length + "/" + total + " moduli");
      if (!url && !files.length) { missing.push(slug); if (!total) console.log(slug.padEnd(48), "nessun PDF trovato"); }
    }
  }
} catch (err) {
  if (!(err instanceof ExpiredCookie)) throw err;
  console.error("\n" + err.message + "\nI PDF già scaricati restano: al prossimo avvio vengono saltati.");
  process.exitCode = 1;
}

await writeFile(indexFile, JSON.stringify(index, null, 2) + "\n");
console.log("\nIndice: " + Object.keys(index).length + " progetti in subjects/index.json.");
if (missing.length) console.log("Senza PDF: " + missing.join(", "));
