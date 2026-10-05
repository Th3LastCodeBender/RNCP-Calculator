/* Stato della pagina e salvataggio nel browser */

type Team = "all" | "solo" | "group";
type SortKey = "time" | "xp" | "people" | "name";

// dati importati dall'intra: login, data e, per ogni progetto che l'import ha segnato, lo stato che aveva prima ("" = non scelto)
interface IntraSession { login: string; date: string; prev: Record<string, Status | ""> }

interface State {
  // il piano: viene salvato
  title: TitleId;
  masteries: boolean; // al posto del titolo, la pagina Masteries: tutti i progetti divisi per layer
  opt: OptionId;
  picked: Record<string, Status>; // progetti scelti, con il loro stato
  marks: Record<string, number>; // voto finale dei progetti fatti, dall'intra
  level: number | null; // livello attuale nel 42cursus, scritto a mano o dall'intra
  events: number; // eventi a cui hai partecipato
  exps: number; // esperienze professionali (stage, contratti) validate
  intra: IntraSession | null; // da chi e quando vengono i dati importati dall'intra (per "Esci")
  dayHours: number; // ore di lavoro in una giornata
  // i filtri: non vengono salvati
  team: Team;
  sort: SortKey; // ordine delle card e dell'export
  desc: boolean; // dal valore più alto al più basso
  only: boolean; // solo i progetti scelti
  both: boolean; // solo i progetti che contano sia nell'RNCP 6 sia nell'RNCP 7
  tags: Set<Tag>;
  q: string;
}

const state: State = {
  title: 6, masteries: false, opt: 2, picked: {}, marks: {}, level: null, events: 0, exps: 0, intra: null, dayHours: 8,
  team: "all", sort: "time", desc: true, only: false, both: false, tags: new Set(), q: "",
};

/* ---------- validazione: i dati salvati possono essere vecchi o scritti a mano ---------- */
const validLevel = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0 && v < 30;
const validCount = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= 99;
const validDayHours = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v >= 1 && v <= 24;
const toStatus = (v: unknown): Status => (v === "doing" || v === "done" ? v : "todo"); // le scelte di prima (true) diventano "da fare"

// tiene solo i progetti che esistono ancora, con uno stato valido
function cleanPicked(raw: Record<string, unknown>): Record<string, Status> {
  const out: Record<string, Status> = {};
  for (const [id, v] of Object.entries(raw)) if (PROJECT_IDS.has(id)) out[id] = toStatus(v);
  return out;
}
// voti: solo progetti esistenti e numeri tra 0 e 125 (il massimo con i bonus)
function cleanMarks(raw: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (raw && typeof raw === "object")
    for (const [id, v] of Object.entries(raw)) if (PROJECT_IDS.has(id) && typeof v === "number" && v >= 0 && v <= 125) out[id] = v;
  return out;
}

// campi comuni al piano salvato nel browser e al file JSON; i valori non validi tornano al default
interface SavedPlan { title?: unknown; masteries?: unknown; opt?: unknown; marks?: unknown; level?: unknown; events?: unknown; exps?: unknown; dayHours?: unknown }
function applySaved(saved: SavedPlan, picked: Record<string, unknown>): void {
  state.title = saved.title === 7 ? 7 : 6;
  state.masteries = saved.masteries === true;
  state.opt = saved.opt === 1 ? 1 : 2;
  state.picked = cleanPicked(picked);
  state.marks = cleanMarks(saved.marks);
  state.level = validLevel(saved.level) ? saved.level : null;
  state.events = validCount(saved.events) ? saved.events : 0;
  state.exps = validCount(saved.exps) ? saved.exps : 0;
  if (validDayHours(saved.dayHours)) state.dayHours = saved.dayHours;
}

/* ---------- localStorage ---------- */
const STORAGE_KEY = "rncp6-plan-v1"; // nome storico: ora contiene anche il titolo

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") as (SavedPlan & { picked?: Record<string, unknown>; intra?: IntraSession }) | null;
  if (saved) {
    applySaved(saved, saved.picked || {});
    const s = saved.intra;
    state.intra = s && typeof s.login === "string" && s.prev && typeof s.prev === "object" ? s : null;
  }
} catch { /* storage non disponibile: la pagina funziona lo stesso */ }

function save(): void {
  const { title, masteries, opt, picked, marks, level, events, exps, intra, dayHours } = state;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ title, masteries, opt, picked, marks, level, events, exps, intra, dayHours })); } catch {}
  writeLinked(); // e nel file collegato, se c'è (plan-file.ts)
}
