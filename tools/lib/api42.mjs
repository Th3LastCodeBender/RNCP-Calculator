/*
 * Accesso all'API ufficiale di 42 (https://api.intra.42.fr).
 * Le credenziali arrivano da .env: FT_UID e FT_SECRET (vedi tools/README.md).
 * Con lo scope "public" l'API dà progetti, sessioni, XP e ore stimate,
 * ma NON la dimensione dei team né i PDF dei subject: per quelli c'è intra.mjs.
 */

export const API = "https://api.intra.42.fr";
export const CURSUS_42 = 21;

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function login() {
  const { FT_UID, FT_SECRET } = process.env;
  if (!FT_UID || !FT_SECRET) {
    console.error("Mancano FT_UID e FT_SECRET in .env: vedi tools/README.md.");
    process.exit(1);
  }
  const res = await fetch(API + "/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: FT_UID, client_secret: FT_SECRET }),
  });
  if (!res.ok) throw new Error("Login all'API fallito: HTTP " + res.status);
  return (await res.json()).access_token;
}

/*
 * Client con il token: rispetta il limite di 2 richieste al secondo e
 * riprova da solo quando l'API risponde 429 (troppe richieste).
 *   get(path)      -> Response
 *   get.json(path) -> oggetto, o null se la risposta non è 2xx
 *   get.all(path)  -> tutte le pagine di una lista, unite in un array
 */
export function client(token) {
  let last = 0;
  async function get(path) {
    for (;;) {
      const wait = last + 600 - Date.now();
      if (wait > 0) await sleep(wait);
      last = Date.now();
      const res = await fetch(API + path, { headers: { Authorization: "Bearer " + token } });
      if (res.status === 429) { await sleep(2000); continue; }
      return res;
    }
  }
  get.json = async (path) => {
    const res = await get(path);
    return res.ok ? res.json() : null;
  };
  get.all = async (path) => {
    const out = [];
    for (let page = 1; ; page++) {
      const items = await get.json(path + (path.includes("?") ? "&" : "?") + "per_page=100&page=" + page);
      if (!Array.isArray(items) || !items.length) break;
      out.push(...items);
      if (items.length < 100) break;
    }
    return out;
  };
  return get;
}

// sessioni ordinate dalla più adatta: cursus 42 senza campus, poi senza campus, poi cursus 42
export function rankSessions(sessions) {
  const score = (s) => (s.cursus_id === CURSUS_42 ? 2 : 0) + (s.campus_id == null ? 3 : 0);
  return [...(sessions || [])].sort((a, b) => score(b) - score(a));
}

// estimate_time arriva come testo ("98 hours", "3 days") o in secondi
export function toHours(v) {
  if (v == null || v === "") return null;
  if (typeof v === "number" || /^\d+$/.test(String(v))) return Number(v) / 3600;
  const m = String(v).match(/([\d.]+)\s*(hour|day|week)/i);
  if (!m) return null;
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  return unit === "day" ? n * 24 : unit === "week" ? n * 24 * 7 : n;
}
