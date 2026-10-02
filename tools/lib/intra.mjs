/*
 * Lettura delle pagine dei progetti sull'intra (projects.intra.42.fr) con il
 * cookie di sessione dell'utente (INTRA_COOKIE in .env, vedi tools/README.md).
 * Serve per i dati che l'API non dà: dimensione del team e link ai PDF.
 *
 * La pagina di un progetto contiene, una volta tolto l'HTML, testo come:
 *   "Group – about 294 hours – 15750 XP Your team must contain between 3 and 4 students"
 * e i link ai subject: https://cdn.intra.42.fr/pdf/pdf/<id>/en.subject.pdf
 * Il CDN è pubblico: i PDF si scaricano senza cookie.
 */
import { sleep } from "./api42.mjs";

const PROJECTS = "https://projects.intra.42.fr/projects/";

export class ExpiredCookie extends Error {
  constructor() { super("Il cookie dell'intra è scaduto o non valido: copiane uno nuovo in .env (vedi tools/README.md)."); }
}

// header Cookie da INTRA_COOKIE: accetta il solo valore o la riga completa "nome=valore; ..."
export function intraCookie({ required = false } = {}) {
  const raw = (process.env.INTRA_COOKIE || "").trim();
  if (!raw) {
    if (required) { console.error("Manca INTRA_COOKIE in .env: vedi tools/README.md."); process.exit(1); }
    return null;
  }
  return raw.includes("=") ? raw : "_intra_42_session_production=" + raw;
}

// lettore di pagine: una al secondo, per non pesare sull'intra.
// page(slug) -> HTML, null se il progetto non esiste o la pagina è riservata (403, per esempio
// progetti di altri campus come accessibledirectory); lancia ExpiredCookie se rimanda al login
export function intra(cookie) {
  let last = 0;
  return async function page(slug) {
    const wait = last + 1000 - Date.now();
    if (wait > 0) await sleep(wait);
    last = Date.now();
    const res = await fetch(PROJECTS + slug, { headers: { Cookie: cookie }, redirect: "manual" });
    if (res.status >= 300 && res.status < 400 && /sign_in|signin|login/i.test(res.headers.get("location") || "")) throw new ExpiredCookie();
    if (res.status === 404) return null;
    if (res.status === 403) { console.log("  " + slug + ": pagina dell'intra riservata (403), solo dati dell'API"); return null; }
    if (!res.ok) throw new Error("HTTP " + res.status + " su " + PROJECTS + slug);
    return res.text();
  };
}

// dati della pagina: team [min, max] ([1, 1] se solo), ore, XP e link ai PDF
export function parseProjectPage(html) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ");
  let team = null;
  let m = text.match(/between (\d+) and (\d+) students/i);
  if (m) team = [Number(m[1]), Number(m[2])];
  else if ((m = text.match(/must contain (\d+) students?/i))) team = [Number(m[1]), Number(m[1])];
  else if (/\bSolo\s+–/.test(text)) team = [1, 1];
  const hours = text.match(/about ([\d,.]+) hours/i);
  const xp = text.match(/–\s*([\d,.]+) XP/);
  const num = (s) => Number(s.replace(/[,.]/g, ""));
  return {
    team,
    hours: hours ? num(hours[1]) : null,
    xp: xp ? num(xp[1]) : null,
    pdfs: [...new Set(html.match(/https:\/\/cdn\.intra\.42\.fr\/pdf\/pdf\/\d+\/[^"'\s<>)]+\.pdf/g) || [])],
  };
}

// fra i link sceglie il subject nella lingua richiesta, poi in inglese, poi il primo
export function pickPdf(links, lang = "en") {
  const subjects = links.filter((u) => /subject/i.test(u));
  const pool = subjects.length ? subjects : links;
  const by = (l) => pool.find((u) => new RegExp("/" + l + "[._]", "i").test(u));
  return by(lang) || by("en") || pool[0] || null;
}
