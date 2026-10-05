/* Import dall'intra: progetti fatti e in corso, voti e livello. Tre strade, tutte nel formato di npm run me:
 * - il file piano-intra.json scritto da npm run me, aperto con "Carica"
 * - il server locale di npm run serve, che legge l'API di 42 dal login scritto nella pagina
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
const levelNote = (): string => (state.level != null ? ", livello " + fmtLevel(state.level) : "");

// file di npm run me aperto con "Carica" (plan-file.ts)
function loadIntraFile(text: string): void {
  setStatus(mergeIntra(text));
}

// riga "Dati dell'intra di jdoe (2026-10-03) · Esci", visibile dopo un import
function renderSession(): void {
  byId("intra-session").hidden = !state.intra;
  byId("auth-go").textContent = state.intra ? "Aggiorna dall'intra" : "Accedi con 42";
  if (state.intra) byId("intra-who").textContent = "Dati dell'intra di " + state.intra.login + (state.intra.date ? " (" + state.intra.date + ")" : "");
}

// "Esci": riporta i progetti importati com'erano prima dell'import, e toglie voti, livello e login
byId("intra-logout").addEventListener("click", () => {
  const s = state.intra;
  if (!s) return;
  if (!confirm("Dimenticare i dati dell'intra di " + s.login + "?\n\nI progetti importati tornano com'erano prima dell'import; voti e livello vengono tolti. Il resto del piano non cambia.")) return;
  for (const [id, before] of Object.entries(s.prev)) {
    if (before) state.picked[id] = before; else delete state.picked[id];
    delete state.marks[id];
  }
  state.level = null;
  state.intra = null;
  try { localStorage.removeItem(LOGIN_KEY); } catch {}
  intraLogin.value = "";
  authMsg.textContent = "Dati dell'intra dimenticati.";
  intraMsg.textContent = "";
  save();
  render();
});

/* ---------- server locale (npm run serve): la pagina chiede il login, il server legge l'API di 42 ---------- */
const intraForm = byId<HTMLFormElement>("intra-form");
const intraLogin = byId<HTMLInputElement>("intra-login");
const intraGo = byId<HTMLButtonElement>("intra-go");
const intraMsg = byId("intra-msg");
const LOGIN_KEY = "rncp-intra-login";
try { intraLogin.value = localStorage.getItem(LOGIN_KEY) || ""; } catch {}

// il modulo compare solo se risponde il server locale
async function checkServer(): Promise<void> {
  if (!location.protocol.startsWith("http")) return; // aperta come file: niente server
  try {
    const res = await fetch("api/ping", { cache: "no-store" });
    if (!res.ok) return; // GitHub Pages o un altro server statico
    const info = (await res.json()) as { intra?: boolean };
    intraForm.hidden = false;
    if (!info.intra) {
      intraLogin.disabled = intraGo.disabled = true;
      intraMsg.textContent = "Mancano FT_UID e FT_SECRET in .env: vedi tools/README.md.";
    }
  } catch { /* nessun server locale */ }
}

intraForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!intraLogin.checkValidity()) return;
  const login = intraLogin.value.trim().toLowerCase();
  try { localStorage.setItem(LOGIN_KEY, login); } catch {}
  intraGo.disabled = true;
  intraMsg.textContent = "Lettura dall'intra…";
  try {
    const res = await fetch("api/me?login=" + encodeURIComponent(login), { cache: "no-store" });
    const text = await res.text();
    if (!res.ok) throw new Error((JSON.parse(text) as { error?: string }).error || "HTTP " + res.status);
    intraMsg.textContent = mergeIntra(text) + levelNote() + ".";
  } catch (err) {
    intraMsg.textContent = "Import non riuscito: " + (err instanceof Error ? err.message : String(err));
  } finally {
    intraGo.disabled = false;
  }
});

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
    authMsg.textContent = "Accesso non riuscito: " + decodeURIComponent(hash.slice("intra-error=".length));
    return;
  }
  try {
    const b64 = hash.slice("intra=".length).replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const data = JSON.parse(new TextDecoder().decode(bytes)) as IntraLogin;
    authMsg.textContent = mergeIntra(intraToPlan(data)) + levelNote() + ".";
  } catch (err) {
    authMsg.textContent = "Dati dell'intra non leggibili: " + (err instanceof Error ? err.message : String(err));
  }
}
