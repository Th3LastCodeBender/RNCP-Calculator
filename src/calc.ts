/* Calcoli ed etichette: XP, livelli, giorni, copertura dei blocchi, filtri. Non tocca la pagina. */

/* ---------- titolo e opzione scelti ---------- */
const currentTitle = (): Title => TITLES[state.title];
const optBlocks = (): BlockId[] => currentTitle().options[state.opt].blocks;
const optName = (): string => currentTitle().options[state.opt].name;
const otherTitle = (): Title => TITLES[state.title === 6 ? 7 : 6];
// blocchi in cui un progetto conta in un titolo (in tutte e due le sue opzioni)
function titleBlocks(pr: Project, id: TitleId): BlockId[] {
  const all = Object.values(TITLES[id].options).flatMap((o) => o.blocks);
  return pr.blocks.filter((b) => all.includes(b));
}
const otherBlocks = (pr: Project): BlockId[] => titleBlocks(pr, state.title === 6 ? 7 : 6);
// progetti di un layer delle Masteries
const layerProjects = (tag: Tag): Project[] => PROJECTS.filter((pr) => pr.tags.includes(tag));

/* ---------- testi ---------- */
const fmt = (n: number): string => n.toLocaleString("it-IT").replace(/\./g, " ");
const plural = (n: number, one: string, many: string): string => fmt(n) + " " + (n === 1 ? one : many);
const fmtDayHours = (v: number): string => v.toLocaleString("it-IT", { maximumFractionDigits: 2 });
const fmtLevel = (v: number): string => (Math.floor(v * 100) / 100).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// "10 000 XP e 2 progetti", o solo "1 progetto" se il blocco non chiede XP
const blockRule = (blk: Block): string =>
  (blk.minXp ? fmt(blk.minXp) + " XP e " : "") + plural(blk.minN, "progetto", "progetti");
// "livello 17, 10 eventi, 2 esperienze professionali"
const titleRules = (t: Title): string => "livello " + t.level + ", " + t.events + " eventi, " + t.exps + " esperienze professionali";

function peopleLabel(pr: Project): string {
  const p = pr.people;
  if (!p) return "persone n.d.";
  if (p[0] !== p[1]) return p[0] + "–" + p[1] + " persone";
  return p[0] === 1 ? "1 persona" : p[0] + " persone";
}

const pageUrl = (pr: Project): string => "https://projects.intra.42.fr/projects/" + pr.slug;
// PDF del subject sul CDN di 42: pubblico, si apre senza login
const subjectPdf = (pr: Project): string | null =>
  pr.pdf == null ? null : "https://cdn.intra.42.fr/pdf/pdf/" + pr.pdf + "/en.subject.pdf";

const today = (): string => new Date().toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
const dateIn = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" });
};

/* ---------- XP e livelli ---------- */
const isPending = (pr: Project): boolean => !!state.picked[pr.id] && state.picked[pr.id] !== "done"; // scelto, non ancora fatto
// voto dell'intra, solo per i progetti fatti
const markOf = (pr: Project): number | undefined => (state.picked[pr.id] === "done" ? state.marks[pr.id] : undefined);

// i progetti fatti con il voto dell'intra scalano col voto (125 = +25%), gli altri valgono a voto 100
function xpOf(pr: Project): number | null {
  if (pr.xp == null) return null;
  const mark = markOf(pr);
  return mark == null ? pr.xp : Math.round(pr.xp * mark / 100);
}
const sumXp = (list: Project[]): number => list.reduce((s, pr) => s + (xpOf(pr) || 0), 0);

function xpLabel(pr: Project): string {
  const xp = xpOf(pr);
  if (xp == null) return "XP n.d.";
  const mark = markOf(pr);
  return fmt(xp) + " XP" + (mark != null && mark !== 100 ? " (voto " + mark + ")" : "");
}

// livello 12,45 = 45% della strada tra il 12 e il 13
function levelToXp(level: number): number {
  const i = Math.min(Math.floor(level), LEVEL_XP.length - 2);
  return LEVEL_XP[i] + (level - i) * (LEVEL_XP[i + 1] - LEVEL_XP[i]);
}
function xpToLevel(xp: number): number {
  let i = 0;
  while (i < LEVEL_XP.length - 2 && xp >= LEVEL_XP[i + 1]) i++;
  return i + Math.min((xp - LEVEL_XP[i]) / (LEVEL_XP[i + 1] - LEVEL_XP[i]), 1);
}
// XP che il piano aggiunge al livello attuale: i progetti scelti non ancora fatti (quelli fatti sono già nel livello)
const pendingXp = (): number => sumXp(PROJECTS.filter(isPending));

/* ---------- esperienze professionali: gli stage fatti più quelle scritte a mano ---------- */
const doneExps = (): Project[] => PROJECTS.filter((pr) => isExperience(pr) && state.picked[pr.id] === "done");
const pendingExps = (): Project[] => PROJECTS.filter((pr) => isExperience(pr) && isPending(pr));
const totalExps = (): number => state.exps + doneExps().length;

/* ---------- ordinamento (filtri ed export) ---------- */
const SORT_NAMES: Record<SortKey, string> = { time: "Tempo", xp: "XP", people: "Persone", name: "Nome" };
// il nome parte dalla A, i numeri dal più alto
const SORT_DESC: Record<SortKey, boolean> = { time: true, xp: true, people: true, name: false };

// valore numerico su cui ordinare, null se manca (quei progetti vanno sempre in fondo)
function sortValue(pr: Project, key: Exclude<SortKey, "name">): number | null {
  if (key === "time") return hours(pr);
  if (key === "xp") return xpOf(pr);
  return pr.people ? pr.people[0] + pr.people[1] / 100 : null; // prima il minimo, poi il massimo
}

// copia ordinata secondo i filtri; a parità resta l'ordine dei dati
function sortProjects(list: Project[]): Project[] {
  const { sort: key, desc } = state;
  const dir = desc ? -1 : 1;
  return [...list].sort((a, b) => {
    if (key === "name") return dir * a.name.localeCompare(b.name, "it");
    const va = sortValue(a, key), vb = sortValue(b, key);
    if (va == null || vb == null) return (va == null ? 1 : 0) - (vb == null ? 1 : 0);
    return dir * (va - vb);
  });
}

// "Tempo, dal più alto" per l'export
const sortLabel = (): string =>
  SORT_NAMES[state.sort] + ", " + (state.sort === "name" ? (state.desc ? "dalla Z alla A" : "dalla A alla Z") : state.desc ? "dal più alto" : "dal più basso");

/* ---------- tempo ---------- */
// ore stimate dall'intra (hours.js), null se mancano
const hours = (pr: Project): number | null => (typeof INTRA_HOURS === "undefined" ? null : INTRA_HOURS[pr.slug] ?? null);
const sumHours = (list: Project[]): number => list.reduce((s, pr) => s + (hours(pr) || 0), 0);
// giorni lavorativi per fare h ore, almeno 1 se c'è lavoro
const workDays = (h: number): number => (h > 0 ? Math.max(1, Math.round(h / state.dayHours)) : 0);
// giorni di calendario: ogni 5 giorni lavorativi si aggiunge un weekend (2 giorni),
// ma non dopo l'ultima settimana: 5 lavorativi = 5 giorni, 6 lavorativi = 8 giorni
const calendarDays = (w: number): number => (w > 0 ? w + 2 * Math.floor((w - 1) / 5) : 0);
// giorni di calendario trascorsi prima di iniziare dopo w giorni lavorativi finiti
const calendarStart = (w: number): number => w + 2 * Math.floor(w / 5);

// "~36 giorni"
const daysLabel = (h: number): string => "~" + plural(calendarDays(workDays(h)), "giorno", "giorni");
// " (26 lavorativi, 210 h)"
const daysNote = (h: number): string => " (" + plural(workDays(h), "lavorativo", "lavorativi") + ", " + fmt(h) + " h)";
// "~36 giorni (26 lavorativi, 210 h)"
const daysDetail = (h: number): string => daysLabel(h) + daysNote(h);
const timeLabel = (pr: Project): string => {
  const h = hours(pr);
  return h == null ? "tempo n.d." : daysDetail(h);
};

/* ---------- blocchi ---------- */
interface Tally {
  n: number; xp: number; // progetti scelti (il piano)
  doneN: number; doneXp: number; // solo quelli fatti
  covered: boolean; // il piano raggiunge i minimi
  valid: boolean; // i progetti fatti raggiungono i minimi
}
function tally(id: BlockId): Tally {
  const blk = BLOCKS[id];
  const chosen = PROJECTS.filter((pr) => pr.blocks.includes(id) && state.picked[pr.id]);
  const made = chosen.filter((pr) => state.picked[pr.id] === "done");
  const n = chosen.length, xp = sumXp(chosen), doneN = made.length, doneXp = sumXp(made);
  return {
    n, xp, doneN, doneXp,
    covered: n >= blk.minN && xp >= blk.minXp,
    valid: doneN >= blk.minN && doneXp >= blk.minXp,
  };
}
// quanto di un blocco è coperto, da 0 a 1: conta il requisito più indietro tra progetti e XP
const coverage = (blk: Block, n: number, xp: number): number =>
  Math.min(n / blk.minN, blk.minXp ? xp / blk.minXp : 1, 1);

// il progetto passa i filtri?
function visible(pr: Project): boolean {
  const p = pr.people;
  if (state.only && !state.picked[pr.id]) return false;
  if (state.both && !state.masteries && !otherBlocks(pr).length) return false; // nelle Masteries il filtro è nascosto
  if (state.tags.size && !pr.tags.some((t) => state.tags.has(t))) return false; // basta una delle categorie accese
  if (state.team === "solo" && !(p && p[0] === 1)) return false;
  if (state.team === "group" && !(p && p[1] > 1)) return false;
  if (state.q && !(pr.name + " " + pr.desc).toLowerCase().includes(state.q)) return false;
  return true;
}
