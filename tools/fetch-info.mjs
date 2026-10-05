/*
 * Raccoglie le informazioni ufficiali sui progetti e le salva in JSON.
 *
 * Per ogni progetto, dall'API: nome, XP (per le piscine la somma dei moduli), ore stimate, solo/gruppo, obiettivi,
 * descrizione ufficiale e sotto-progetti. Con INTRA_COOKIE in .env aggiunge
 * dalla pagina dell'intra la dimensione del team e il link al subject.
 * Il file esistente viene aggiornato, non sostituito: i progetti non toccati restano.
 *
 * Se i progetti sono quelli della pagina (nessuna sorgente indicata), alla fine
 * confronta XP, persone e PDF del subject con src/data.ts e stampa le differenze. Non modifica src/data.ts.
 *
 * Uso: npm run info -- [sorgente] [--children] [--out file.json]
 *   (sorgenti in tools/lib/projects.mjs; default --out data/info.json)
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { login, client, rankSessions, toHours } from "./lib/api42.mjs";
import { intraCookie, intra, parseProjectPage, pickPdf, ExpiredCookie } from "./lib/intra.mjs";
import { ROOT, parseArgs, resolveSlugs, pageProjects, fromPage, childrenOf } from "./lib/projects.mjs";

const args = parseArgs();
const outFile = args.flags.out ? pathToFileURL(resolve(args.flags.out)) : new URL("data/info.json", ROOT);
const get = client(await login());
const slugs = await resolveSlugs(args, get);

const cookie = intraCookie();
let page = cookie ? intra(cookie) : null;
if (!page) console.log("INTRA_COOKIE assente: niente dimensione dei team né link ai subject.\n");

// XP di un progetto; se è 0 ma ha moduli (le piscine) è la somma dei moduli
async function projectXp(project, session) {
  const xp = session.difficulty ?? project.difficulty ?? null;
  if (xp) return { xp, fromModules: false };
  const mods = await childrenOf(project.slug, get);
  if (!mods.length) return { xp, fromModules: false };
  let sum = 0;
  for (const mod of mods) {
    const m = await get.json("/v2/projects/" + mod);
    sum += rankSessions(m?.project_sessions)[0]?.difficulty ?? m?.difficulty ?? 0;
  }
  return { xp: sum, fromModules: true };
}

let info = {};
try { info = JSON.parse(await readFile(outFile, "utf8")); } catch { /* primo avvio */ }

const missing = [];
for (const slug of slugs) {
  const project = await get.json("/v2/projects/" + slug);
  if (!project) { missing.push(slug); console.log(slug.padEnd(48), "progetto non trovato"); continue; }
  const s = rankSessions(project.project_sessions)[0] || {};

  let web = null;
  if (page) {
    try {
      const html = await page(slug);
      if (html) web = parseProjectPage(html);
    } catch (err) {
      if (!(err instanceof ExpiredCookie)) throw err;
      console.error(err.message + " Continuo solo con l'API.");
      page = null;
    }
  }

  const hours = toHours(s.estimate_time);
  const { xp, fromModules } = await projectXp(project, s);
  info[slug] = {
    name: project.name,
    xp: xp || web?.xp || xp,
    xpFromModules: fromModules,
    hours: hours != null ? Math.round(hours) : web?.hours ?? null,
    solo: s.solo ?? null,
    team: web?.team ?? (s.solo ? [1, 1] : null),
    objectives: s.objectives || [],
    description: s.description || "",
    children: (project.children || []).map((c) => c.slug).filter(Boolean),
    subject: web ? pickPdf(web.pdfs) : info[slug]?.subject ?? null,
    session: s.id ?? null,
    updated: new Date().toISOString().slice(0, 10),
  };
  const i = info[slug];
  const team = i.team ? (i.team[1] === 1 ? "solo" : i.team.join("–") + " pers.") : i.solo ? "solo" : "gruppo";
  console.log(slug.padEnd(48), [i.xp != null ? i.xp + " XP" : "XP n.d.", i.hours != null ? i.hours + " h" : "ore n.d.", team].join(" · "));
}

await mkdir(new URL(".", outFile), { recursive: true });
await writeFile(outFile, JSON.stringify(info, null, 2) + "\n");
console.log("\nAggiornati " + (slugs.length - missing.length) + " progetti in " + fileURLToPath(outFile) + " (" + Object.keys(info).length + " in totale).");
if (missing.length) console.log("Non trovati: " + missing.join(", "));

// confronto con la pagina, solo se i progetti sono quelli di src/data.ts
if (fromPage(args)) {
  const current = await pageProjects();
  const diffs = [];
  for (const slug of slugs) {
    const cur = current.get(slug), i = info[slug];
    if (!cur || !i) continue;
    if (i.xp != null && i.xp !== cur.xp) diffs.push("  " + cur.name.padEnd(28) + " XP      pagina: " + cur.xp + "   intra: " + i.xp);
    if (i.team && (!cur.p || cur.p[0] !== i.team[0] || cur.p[1] !== i.team[1])) {
      diffs.push("  " + cur.name.padEnd(28) + " persone pagina: " + (cur.p ? cur.p.join("–") : "n.d.") + "   intra: " + i.team.join("–"));
    }
    const pdf = Number(i.subject?.match(/\/pdf\/pdf\/(\d+)\//)?.[1]) || null;
    if (pdf && pdf !== cur.pdf) diffs.push("  " + cur.name.padEnd(28) + " pdf     pagina: " + cur.pdf + "   intra: " + pdf);
  }
  console.log(diffs.length ? "\nDifferenze con src/data.ts:\n" + diffs.join("\n") : "\nNessuna differenza con src/data.ts su XP, persone e PDF.");
}
