/*
 * Dataset pubblico di 42calculator (https://github.com/lucas-ht/42calculator).
 * Contiene ciò che l'API non collega:
 *   projects_21.json  progetti di 42cursus con XP e sotto-progetti (moduli delle piscine)
 *   rncp_21.json      titoli RNCP 6 e 7: blocchi, XP e numero di progetti richiesti,
 *                     id dei progetti di ogni blocco, più Suite ed esperienze
 * I file vengono scaricati una volta in data/42calculator/; con refresh = true si riscaricano.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";

const RAW = "https://raw.githubusercontent.com/lucas-ht/42calculator/main/data/";
const CACHE = new URL("../../data/42calculator/", import.meta.url);

async function load(name, refresh) {
  const file = new URL(name, CACHE);
  if (!refresh) {
    try { return JSON.parse(await readFile(file, "utf8")); } catch { /* non ancora scaricato */ }
  }
  const res = await fetch(RAW + name);
  if (!res.ok) throw new Error("Download di " + name + " fallito: HTTP " + res.status);
  const text = await res.text();
  await mkdir(CACHE, { recursive: true });
  await writeFile(file, text);
  return JSON.parse(text);
}

let cached = null;
export async function dataset({ refresh = false } = {}) {
  if (cached && !refresh) return cached;
  const [projectsFile, rncp] = await Promise.all([load("projects_21.json", refresh), load("rncp_21.json", refresh)]);
  // projects_21.json: { meta, <chiave>: [progetti] }; i sotto-progetti stanno anche in "children"
  const list = Object.entries(projectsFile).find(([k, v]) => k !== "meta" && Array.isArray(v))?.[1] || [];
  const byId = new Map();
  const bySlug = new Map();
  const add = (p) => {
    if (!p || bySlug.has(p.slug)) return;
    byId.set(p.id, p);
    bySlug.set(p.slug, p);
    (p.children || []).forEach(add);
  };
  list.forEach(add);
  cached = { byId, bySlug, rncp };
  return cached;
}

// slug dei sotto-progetti secondo il dataset (vuoto se non ne ha)
export async function datasetChildren(slug) {
  const { bySlug } = await dataset();
  return (bySlug.get(slug)?.children || []).map((c) => c.slug).filter(Boolean);
}
