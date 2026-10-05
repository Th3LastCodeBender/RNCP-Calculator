/*
 * Scrive hours.js, il file con le ore stimate dall'intra che la pagina carica.
 * Le ore sono quelle dell'intra così come sono: il
 * calcolo dei giorni lo fa la pagina (con le ore al giorno scelte dall'utente, src/calc.ts).
 *
 * Uso: npm run hours -- [sorgente]   (default: i progetti della pagina)
 */
import { writeFile } from "node:fs/promises";
import { login, client, rankSessions, toHours } from "./lib/api42.mjs";
import { ROOT, parseArgs, resolveSlugs } from "./lib/projects.mjs";

const get = client(await login());
const slugs = await resolveSlugs(parseArgs(), get);

const hours = {};
const missing = [];
for (const slug of slugs) {
  const project = await get.json("/v2/projects/" + slug);
  const best = rankSessions(project?.project_sessions).find((s) => toHours(s.estimate_time) != null);
  const h = best ? Math.round(toHours(best.estimate_time)) : null;
  if (h == null) missing.push(slug);
  else hours[slug] = h;
  console.log(slug.padEnd(48), h == null ? "n.d." : h + " h");
}

const out =
  "// Generato da tools/fetch-hours.mjs (npm run hours) il " + new Date().toISOString().slice(0, 10) + ".\n" +
  "// Ore stimate dall'intra per slug del progetto, senza moltiplicatore.\n" +
  "var INTRA_HOURS = " + JSON.stringify(hours, null, 2) + ";\n";
await writeFile(new URL("hours.js", ROOT), out);

console.log("\nScritto hours.js con " + Object.keys(hours).length + " progetti su " + slugs.length + ".");
if (missing.length) console.log("Senza stima: " + missing.join(", "));
