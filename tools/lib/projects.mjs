/*
 * Argomenti comuni degli strumenti e scelta dei progetti su cui lavorare.
 *
 * Sorgenti dei progetti (se ne usa una, in quest'ordine):
 *   slug1 slug2 ...      gli slug scritti sulla riga di comando
 *   --file lista.txt     uno slug per riga (righe vuote e # commenti ignorati)
 *   --cursus 21          tutti i progetti di un cursus dall'API (21 = 42cursus)
 *   (niente)             gli slug della pagina, letti da src/data.ts
 * Con --children si aggiungono anche i sotto-progetti (moduli delle piscine, ecc.),
 * presi dall'API o, se l'API non li collega, dal dataset di 42calculator.
 */
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { datasetChildren } from "./dataset.mjs";

export const ROOT = new URL("../../", import.meta.url);

const VALUE_FLAGS = new Set(["--file", "--cursus", "--lang", "--out", "--port"]);

// { slugs: [...], flags: { file, cursus, lang, out, force, children, ... } }
export function parseArgs(argv = process.argv.slice(2)) {
  const flags = {};
  const slugs = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (VALUE_FLAGS.has(a)) flags[a.slice(2)] = argv[++i];
    else if (a.startsWith("--")) flags[a.slice(2)] = true;
    else slugs.push(a);
  }
  return { slugs, flags };
}

// slug della pagina (src/data.ts), con id, nome e persone attuali per i confronti
export async function pageProjects() {
  const source = await readFile(new URL("src/data.ts", ROOT), "utf8");
  const out = new Map();
  const line = /\{ id: "([^"]+)", name: "([^"]*)", slug: "([^"]+)",[^\n]*? xp: (null|\d+), people: (null|\[\d+, \d+\])[^\n]*? pdf: (null|\d+),/g;
  for (const [, id, name, slug, xp, people, pdf] of source.matchAll(line)) {
    out.set(slug, {
      id, name, xp: xp === "null" ? null : Number(xp), p: people === "null" ? null : JSON.parse(people),
      pdf: pdf === "null" ? null : Number(pdf),
    });
  }
  return out;
}

async function fileSlugs(path) {
  const text = await readFile(resolve(path), "utf8");
  return text.split("\n").map((l) => l.replace(/#.*/, "").trim()).filter(Boolean);
}

// elenco finale degli slug; get è il client dell'API (serve per --cursus e --children)
export async function resolveSlugs({ slugs, flags }, get) {
  let list;
  if (slugs.length) list = slugs;
  else if (flags.file) list = await fileSlugs(flags.file);
  else if (flags.cursus) {
    if (!get) throw new Error("--cursus richiede l'API");
    list = (await get.all("/v2/cursus/" + flags.cursus + "/projects")).map((p) => p.slug);
  } else list = [...(await pageProjects()).keys()];

  if (flags.children) {
    const all = [];
    for (const slug of list) all.push(slug, ...(await childrenOf(slug, get)));
    list = all;
  }
  return [...new Set(list)];
}

// sotto-progetti: dall'API se li collega, altrimenti dal dataset di 42calculator
// (l'API, per esempio, non collega le piscine ai loro moduli)
export async function childrenOf(slug, get) {
  if (get) {
    const p = await get.json("/v2/projects/" + slug);
    const kids = (p?.children || []).map((c) => c.slug).filter(Boolean);
    if (kids.length) return kids;
  }
  return datasetChildren(slug);
}

// la sorgente è la pagina? (solo allora ha senso confrontare con src/data.ts)
export const fromPage = ({ slugs, flags }) => !slugs.length && !flags.file && !flags.cursus;
