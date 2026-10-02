/*
 * Ricava dal dataset di 42calculator i titoli RNCP (6 e 7) di 42cursus con i
 * loro blocchi e scrive una lista di slug per ogni blocco, pronta da usare con
 * --file negli altri strumenti:
 *   lists/rncp/<titolo>/<blocco>.txt   progetti di un blocco (con XP e numero minimi in testa)
 *   lists/rncp/suite.txt               progetti Suite (comuni a tutti i titoli)
 *   lists/rncp/experience.txt          esperienze professionali
 *   data/rncp.json                     tutto in un unico file, con nomi e XP
 *
 * Esempio per l'RNCP 7:
 *   npm run rncp                                   crea le liste e mostra il riepilogo
 *   npm run info -- --file lists/rncp/rncp-7-.../security.txt --out data/rncp7-security.json
 *
 * Uso: npm run rncp -- [--refresh]   (--refresh riscarica il dataset)
 */
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dataset } from "./lib/dataset.mjs";
import { ROOT, parseArgs } from "./lib/projects.mjs";

const { flags } = parseArgs();
const { byId, rncp } = await dataset({ refresh: !!flags.refresh });

const slugify = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const fmt = (n) => Math.round(n).toLocaleString("it-IT");

// id del dataset -> { slug, name, xp }; gli id sconosciuti restano come commento nelle liste
const resolve = (ids) => ids.map((id) => {
  const p = byId.get(id);
  return p ? { slug: p.slug, name: p.name, xp: p.difficulty ?? null } : { id, slug: null };
});

const OUT = new URL("lists/rncp/", ROOT);
await rm(OUT, { recursive: true, force: true }); // le liste si rigenerano da zero
await mkdir(OUT, { recursive: true });

async function writeList(file, header, projects) {
  const lines = [...header.map((h) => "# " + h), ""];
  for (const p of projects) lines.push(p.slug ? p.slug.padEnd(48) + "# " + p.name + (p.xp ? " · " + fmt(p.xp) + " XP" : "") : "# id " + p.id + " non trovato nel dataset");
  await writeFile(new URL(file, OUT), lines.join("\n") + "\n");
}

const summary = { titles: [], suite: resolve(rncp.suite?.projects || []), experience: resolve(rncp.experience?.projects || []) };
await writeList("suite.txt", ["Progetti Suite (ne serve almeno uno per ogni titolo)"], summary.suite);
await writeList("experience.txt", ["Esperienze professionali"], summary.experience);

for (const t of rncp.rncp || []) {
  const dir = slugify(t.type + " " + t.title);
  await mkdir(new URL(dir + "/", OUT), { recursive: true });
  const title = { type: t.type, title: t.title, dir, level: t.level, events: t.number_of_events, experiences: t.number_of_experiences, suite: t.number_of_suite, blocks: [] };
  console.log("\n" + t.type.toUpperCase() + " · " + t.title + "  (livello " + t.level + ", " + t.number_of_events + " eventi, " + t.number_of_experiences + " esperienze, " + t.number_of_suite + " Suite)");
  for (const o of t.options || []) {
    const projects = resolve(o.projects || []);
    const file = dir + "/" + slugify(o.title) + ".txt";
    const rule = fmt(o.experience) + " XP e " + o.number_of_projects + " progetti";
    await writeList(file, [t.type + " · " + t.title, "Blocco " + o.title + ": minimo " + rule], projects);
    title.blocks.push({ name: o.title, minXp: o.experience, minN: o.number_of_projects, file: "lists/rncp/" + file, projects });
    console.log("  " + o.title.padEnd(32) + rule.padEnd(26) + projects.length + " progetti  →  lists/rncp/" + file);
  }
  summary.titles.push(title);
}

await mkdir(new URL("data/", ROOT), { recursive: true });
await writeFile(new URL("data/rncp.json", ROOT), JSON.stringify(summary, null, 2) + "\n");
console.log("\nListe in lists/rncp/, riepilogo in data/rncp.json. Suite: " + summary.suite.length + " progetti, esperienze: " + summary.experience.length + ".");
