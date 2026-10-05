/*
 * I progetti di uno studente dall'API di 42, nel formato che la pagina importa
 * (piano-intra.json, da aprire con "Carica"). Lo usa tools/fetch-me.mjs.
 */
import { readFile } from "node:fs/promises";
import { CURSUS_42 } from "./api42.mjs";
import { ROOT, pageProjects } from "./projects.mjs";

// login dell'intra: lettere, cifre e trattini
export const validLogin = (v) => typeof v === "string" && /^[a-z0-9-]{2,32}$/i.test(v);

// stato dell'intra -> stato della pagina: validato = fatto; in lavorazione = in corso; il resto si ignora
const IN_PROGRESS = new Set(["in_progress", "searching_a_group", "creating_group", "waiting_for_correction"]);
function statusOf(pu) {
  if (!pu) return null;
  if (pu.status === "finished" && pu["validated?"]) return "done";
  if (IN_PROGRESS.has(pu.status)) return "doing";
  return null;
}

/*
 * get: client dell'API (api42.mjs). Restituisce null se l'utente non esiste,
 * altrimenti { plan, rows } con plan da salvare/importare e rows [nome, stato, voto] da stampare.
 */
export async function intraPlan(get, login) {
  const me = await get.json("/v2/users/" + encodeURIComponent(login));
  if (!me) return null;

  // progetti della pagina per slug, e sotto-progetti (moduli delle piscine) da data/info.json
  const page = await pageProjects();
  const info = JSON.parse(await readFile(new URL("data/info.json", ROOT), "utf8").catch(() => "{}"));
  const bySlug = new Map((me.projects_users || []).map((pu) => [pu.project?.slug, pu]));

  const status = {}, marks = {}, rows = [];
  for (const [slug, pr] of page) {
    const pu = bySlug.get(slug);
    let s = statusOf(pu);
    // piscine a moduli: fatta se sono validati tutti i moduli, in corso se ce n'è almeno uno
    const kids = (info[slug]?.children || []).map((k) => statusOf(bySlug.get(k)));
    if (!s && kids.length) s = kids.every((k) => k === "done") ? "done" : kids.some(Boolean) ? "doing" : null;
    if (!s) continue;
    status[pr.id] = s;
    if (s === "done" && typeof pu?.final_mark === "number") marks[pr.id] = pu.final_mark;
    rows.push([pr.name, s, marks[pr.id] ?? null]);
  }

  const cursus = (me.cursus_users || []).find((c) => c.cursus_id === CURSUS_42);
  const plan = {
    version: 2,
    source: "intra",
    login: me.login,
    date: new Date().toISOString().slice(0, 10),
    level: typeof cursus?.level === "number" ? cursus.level : null,
    picked: Object.keys(status),
    status,
    marks,
  };
  return { plan, rows };
}
