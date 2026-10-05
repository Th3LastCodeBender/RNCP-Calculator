/* Import dall'intra: progetti fatti e in corso, voti e livello. Due strade, tutte nel formato di npm run me:
 * - il file piano-intra.json scritto da npm run me, aperto con "Carica"
 * - "Accedi con 42" sul sito pubblico: il Cloudflare Worker fa il login OAuth e torna con #intra=<base64url(json)>
 */

// aggiorna stati, voti e livello e lascia com'è il resto del piano (i "da fare", il titolo, l'opzione);
// restituisce il riepilogo da mostrare
function mergeIntra(text: string): string {
  const plan = JSON.parse(text) as Partial<PlanFile>;
  if (plan.source !== "intra" || !plan.status) throw new Error("non è un file di npm run me");
  const got = cleanPicked(plan.status);
  // ricorda lo stato di prima dei progetti che l'import cambia, per ripristinarlo con "Esci";
  // con lo stesso login vale lo stato di prima del primo import
  const login = plan.login || "intra";
  const prev = state.intra && state.intra.login === login ? state.intra.prev : {};
  for (const id of Object.keys(got)) if (!(id in prev)) prev[id] = state.picked[id] || "";
  state.intra = { login, date: plan.date || "", prev };
  Object.assign(state.picked, got);
  Object.assign(state.marks, cleanMarks(plan.marks));
  if (validLevel(plan.level)) state.level = plan.level;
  save();
  render();
  const statuses = Object.values(got);
  return "Dall'intra" + (plan.login ? " (" + plan.login + (plan.date ? ", " + plan.date : "") + ")" : "") + ": "
    + plural(statuses.filter((s) => s === "done").length, "fatto", "fatti") + ", "
    + statuses.filter((s) => s === "doing").length + " in corso";
}

// file di npm run me aperto con "Carica" (plan-file.ts)
function loadIntraFile(text: string): void {
  setStatus(mergeIntra(text));
}

// una riga sola: "[Aggiorna] jdoe · 2026-10-03 · Esci"; senza il pulsante dell'intra resta solo "jdoe · … · Esci"
let authError = ""; // l'ultimo accesso non riuscito, al posto del login finché non si riprova
function renderSession(): void {
  const s = state.intra;
  const who = s ? s.login + (s.date ? " · " + s.date : "") : "";
  byId("auth-go").textContent = s ? "Aggiorna" : "Accedi con 42";
  byId("auth-go").title = s ? "Aggiorna i dati dall'intra" : "";
  authMsg.textContent = authError || who || "Importa progetti, voti e livello dall'intra.";
  byId("auth-logout").hidden = !s;
  byId("intra-session").hidden = !s || !authBox.hidden;
  byId("intra-who").textContent = who;
}

// "Esci": riporta i progetti importati com'erano prima dell'import, e toglie voti, livello e login
function logout(): void {
  const s = state.intra;
  if (!s) return;
  if (!confirm("Dimenticare i dati dell'intra di " + s.login + "?\n\nI progetti importati tornano com'erano prima dell'import; voti e livello vengono tolti. Il resto del piano non cambia.")) return;
  for (const [id, before] of Object.entries(s.prev)) {
    if (before) state.picked[id] = before; else delete state.picked[id];
    delete state.marks[id];
  }
  state.level = null;
  state.intra = null;
  authError = "";
  save();
  render();
}
byId("intra-logout").addEventListener("click", logout);
byId("auth-logout").addEventListener("click", logout);

/* ---------- "Accedi con 42" (sito pubblico, tramite il Cloudflare Worker) ---------- */
// p: per slug dell'intra, ["d" fatto | "o" in corso, voto]
interface IntraLogin { login: string; date: string; level: number | null; p: Record<string, ["d" | "o", number | null]> }

// dagli slug dell'intra al formato di npm run me (id della pagina), così passa da mergeIntra
function intraToPlan(data: IntraLogin): string {
  const status: Record<string, Status> = {}, marks: Record<string, number> = {};
  for (const pr of PROJECTS) {
    const got = data.p[pr.slug];
    if (!got) continue;
    status[pr.id] = got[0] === "d" ? "done" : "doing";
    if (got[0] === "d" && got[1] != null) marks[pr.id] = got[1];
  }
  return JSON.stringify({ version: 2, source: "intra", login: data.login, date: data.date, level: data.level, picked: Object.keys(status), status, marks });
}

const authBox = byId("auth-box");
const authMsg = byId("auth-msg");
const authUrl = (authBox.dataset.auth || "").replace(/\/+$/, ""); // vuoto = pulsante nascosto
if (authUrl && location.protocol.startsWith("http")) authBox.hidden = false;
byId("auth-go").addEventListener("click", () => {
  location.href = authUrl + "/login?return=" + encodeURIComponent(location.origin + location.pathname);
});

// ritorno dal login: legge il frammento e lo cancella dall'indirizzo (non resta nella cronologia né nei link copiati)
function readAuthReturn(): void {
  const hash = location.hash.slice(1);
  if (!hash.startsWith("intra=") && !hash.startsWith("intra-error=")) return;
  history.replaceState(null, "", location.pathname + location.search);
  authBox.hidden = !authUrl;
  if (hash.startsWith("intra-error=")) {
    authError = "Accesso non riuscito: " + decodeURIComponent(hash.slice("intra-error=".length));
    renderSession();
    return;
  }
  try {
    const b64 = hash.slice("intra=".length).replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const data = JSON.parse(new TextDecoder().decode(bytes)) as IntraLogin;
    authError = "";
    mergeIntra(intraToPlan(data)); // la riga mostra login e data
  } catch (err) {
    authError = "Dati dell'intra non leggibili: " + (err instanceof Error ? err.message : String(err));
    renderSession();
  }
}
