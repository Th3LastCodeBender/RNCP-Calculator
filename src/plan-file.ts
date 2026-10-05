/* Salva / Carica il piano come file JSON
 * Su Chrome/Edge (File System Access API) il file scelto resta collegato:
 * ogni modifica lo riscrive e alla riapertura la pagina lo rilegge.
 * Altrove "Salva" scarica il file e "Carica" lo legge una volta sola.
 */
interface PlanFile {
  version: 1 | 2;
  title?: TitleId; // assente nei piani salvati prima dell'RNCP 7: vale 6
  masteries?: boolean; // pagina Masteries aperta (il titolo resta quello di prima)
  opt: OptionId;
  picked: string[]; // tutti i progetti scelti (nei piani versione 1 l'unico campo: valgono "da fare")
  status?: Record<string, Status>; // dalla versione 2: lo stato di ogni progetto scelto
  marks?: Record<string, number>; // voti dei progetti fatti
  level?: number | null; // livello nel 42cursus
  events?: number;
  exps?: number;
  source?: "intra"; // file scritto da npm run me: si unisce al piano invece di sostituirlo
  login?: string;
  date?: string;
  dayHours?: number; // i piani vecchi avevano "pace" (moltiplicatore delle ore), ora ignorato
}

const planJson = (): string =>
  JSON.stringify({
    version: 2, title: state.title, masteries: state.masteries, opt: state.opt, picked: Object.keys(state.picked), status: state.picked,
    marks: state.marks, level: state.level, events: state.events, exps: state.exps, dayHours: state.dayHours,
  } satisfies PlanFile, null, 2);

function applyPlan(text: string): void {
  const plan = JSON.parse(text) as Partial<PlanFile>;
  if (!Array.isArray(plan.picked)) throw new Error("campo picked mancante");
  const picked: Record<string, unknown> = {};
  for (const id of plan.picked) if (typeof id === "string") picked[id] = plan.status?.[id];
  applySaved(plan, picked);
}

// il file di npm run me (source "intra") si unisce al piano invece di sostituirlo (intra.ts)
const isIntra = (text: string): boolean => { try { return JSON.parse(text)?.source === "intra"; } catch { return false; } };

function download(name: string, text: string, type: string): void {
  const a = el("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 0);
}

// nome dei file salvati ed esportati: piano-rncp.json, piano-rncp.md (il piano vale per entrambi i titoli)
const fileName = (ext: string): string => "piano-rncp." + ext;

function fail(err: unknown): void {
  if (err instanceof DOMException && err.name === "AbortError") return; // finestra chiusa dall'utente
  alert("File non valido: " + (err instanceof Error ? err.message : String(err)));
}

const planStatus = byId("plan-status");
function setStatus(text: string): void {
  planStatus.textContent = text;
  planStatus.hidden = !text;
}

/* ---------- file collegato (File System Access API) ---------- */
// parti dell'API non ancora nei tipi DOM di TypeScript
type PermState = "granted" | "denied" | "prompt";
interface PlanHandle extends FileSystemFileHandle {
  queryPermission(opts: { mode: "readwrite" }): Promise<PermState>;
  requestPermission(opts: { mode: "readwrite" }): Promise<PermState>;
}
interface PickerOpts {
  suggestedName?: string;
  types?: { description: string; accept: Record<string, string[]> }[];
}
interface FsWindow {
  showOpenFilePicker?: (opts?: PickerOpts) => Promise<PlanHandle[]>;
  showSaveFilePicker?: (opts?: PickerOpts) => Promise<PlanHandle>;
}

const fsw = window as unknown as FsWindow;
const canLink = typeof fsw.showOpenFilePicker === "function" && typeof fsw.showSaveFilePicker === "function";
const picker = (): PickerOpts => ({
  suggestedName: fileName("json"),
  types: [{ description: "Piano RNCP", accept: { "application/json": [".json"] } }],
});
const reconnect = byId<HTMLButtonElement>("reconnect");
let linked: PlanHandle | null = null;

// il collegamento al file sopravvive al ricaricamento grazie a IndexedDB
function idb<T>(run: (store: IDBObjectStore) => IDBRequest<T>, mode: IDBTransactionMode): Promise<T> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open("rncp6-plan", 1);
    open.onupgradeneeded = () => open.result.createObjectStore("kv");
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const req = run(open.result.transaction("kv", mode).objectStore("kv"));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    };
  });
}
const storeHandle = (h: PlanHandle | null): Promise<unknown> =>
  idb<unknown>((st) => (h ? st.put(h, "handle") : st.delete("handle")) as IDBRequest<unknown>, "readwrite").catch(() => undefined);
const storedHandle = (): Promise<PlanHandle | undefined> =>
  idb<PlanHandle | undefined>((st) => st.get("handle"), "readonly").catch(() => undefined);

// le scritture sono messe in coda così non si sovrappongono
let writing: Promise<void> = Promise.resolve();
function writeLinked(): void {
  const h = linked;
  if (!h) return;
  const text = planJson();
  writing = writing.then(async () => {
    try {
      const w = await h.createWritable();
      await w.write(text);
      await w.close();
      setStatus("Salvato in " + h.name);
    } catch {
      setStatus("Impossibile scrivere " + h.name);
    }
  });
}

async function link(h: PlanHandle): Promise<void> {
  linked = h;
  reconnect.hidden = true;
  await storeHandle(h);
}

async function loadFrom(h: PlanHandle): Promise<void> {
  const text = await (await h.getFile()).text();
  if (isIntra(text)) { loadIntraFile(text); return; } // non si collega: il piano non va scritto lì sopra
  if (!text.trim()) { await link(h); writeLinked(); return; } // file vuoto: ci scrive il piano attuale
  applyPlan(text);
  await link(h);
  save();
  render();
  setStatus("Collegato a " + h.name);
}

// alla riapertura: se il browser dà ancora il permesso rilegge il file, altrimenti serve un clic su "Riapri"
async function restoreLink(): Promise<void> {
  if (!canLink) return;
  const h = await storedHandle();
  if (!h) return;
  try {
    if ((await h.queryPermission({ mode: "readwrite" })) === "granted") await loadFrom(h);
    else {
      reconnect.textContent = "Riapri " + h.name;
      reconnect.hidden = false;
    }
  } catch {
    await storeHandle(null); // il file è stato spostato o cancellato
  }
}

reconnect.addEventListener("click", async () => {
  const h = await storedHandle();
  if (!h) { reconnect.hidden = true; return; }
  try {
    if ((await h.requestPermission({ mode: "readwrite" })) === "granted") await loadFrom(h);
  } catch (err) { fail(err); }
});

/* ---------- pulsanti Salva e Carica ---------- */
byId("export").addEventListener("click", async () => {
  if (!canLink) { download(fileName("json"), planJson(), "application/json"); return; }
  try { await link(await fsw.showSaveFilePicker!(picker())); writeLinked(); } catch (err) { fail(err); }
});

const importFile = byId<HTMLInputElement>("import-file");
byId("import").addEventListener("click", async () => {
  if (!canLink) { importFile.click(); return; }
  try { const [h] = await fsw.showOpenFilePicker!(picker()); await loadFrom(h); } catch (err) { fail(err); }
});
importFile.addEventListener("change", async () => {
  const file = importFile.files?.[0];
  importFile.value = "";
  if (!file) return;
  try {
    const text = await file.text();
    if (isIntra(text)) loadIntraFile(text);
    else { applyPlan(text); save(); render(); }
  } catch (err) { fail(err); }
});
