/* La pagina: barre dei blocchi, requisiti comuni, tempo che resta, card dei progetti e filtri */

/* ---------- barre (blocchi e requisiti comuni) ---------- */
interface Meter { box: HTMLElement; top: HTMLElement; name: HTMLElement; plan: HTMLElement; made: HTMLElement; cls: string }

function newMeter(cls: string, label: string): Meter {
  const box = el("div", cls), top = el("div", "meter-top"), name = el("span", "meter-name", label);
  // due riempimenti: chiaro per tutto il piano, pieno per i progetti fatti
  const bar = el("div", "bar"), plan = el("i", "plan"), made = el("i");
  top.append(name);
  bar.append(plan, made);
  box.append(top, bar);
  return { box, top, name, plan, made, cls };
}

// spunta del blocco, nella barra e accanto al nome del blocco:
// piena se è già validato con i progetti fatti, vuota se è solo coperto dal piano
function doneCheck(valid: boolean): HTMLElement {
  const check = el("span", "meter-check" + (valid ? "" : " planned"), "✓");
  check.setAttribute("aria-label", valid ? "Validato" : "Coperto dal piano");
  check.title = valid ? "Validato con i progetti fatti" : "Coperto dal piano, non ancora validato";
  return check;
}

// planned e made: quanto del minimo coprono il piano e i progetti fatti, da 0 a 1.
// Validato (verde pieno) se i fatti bastano, coperto dal piano (bordo verde) se basta il piano
function paintMeter(m: Meter, planned: number, made: number): void {
  const valid = made >= 1, covered = planned >= 1;
  m.box.className = m.cls + (valid ? " done" : covered ? " planned" : "");
  m.top.querySelector(".meter-check")?.remove();
  if (covered) m.top.append(doneCheck(valid));
  m.plan.style.width = Math.round(planned * 100) + "%";
  m.made.style.width = Math.round(made * 100) + "%";
}
const ratio = (have: number, need: number): number => Math.min(have / need, 1);

function renderMeters(): void {
  const box = byId("meters");
  box.textContent = "";
  box.classList.toggle("layers", state.masteries);
  if (state.masteries) {
    for (const tag of Object.keys(TAGS) as Tag[]) box.append(layerMeter(tag));
    return;
  }
  for (const id of optBlocks()) {
    const blk = BLOCKS[id], t = tally(id);
    const m = newMeter("meter", blk.name);
    m.name.title = blk.name; // nella barra compatta il nome può essere tagliato
    paintMeter(m, coverage(blk, t.n, t.xp), coverage(blk, t.doneN, t.doneXp));
    const nums = el("div", "meter-nums");
    const projects = el("span");
    projects.append(el("b", null, String(t.n)), "/" + blk.minN, el("span", "meter-unit", " progetti")); // "progetti" sparisce nella barra compatta
    nums.append(projects);
    if (blk.minXp) {
      const xp = el("span");
      xp.append(el("b", null, fmt(t.xp)), "/" + fmt(blk.minXp) + " XP");
      nums.append(xp);
    }
    m.box.title = "Fatti: " + plural(t.doneN, "progetto", "progetti") + (blk.minXp ? " · " + fmt(t.doneXp) + " XP" : "");
    m.box.append(nums);
    linkToSection(m.box, id, "Vai al blocco " + blk.name);
    box.append(m.box);
  }
}

// layer delle Masteries: nessun minimo, la barra è la parte dei progetti del layer che hai scelto (piena: quelli fatti)
function layerMeter(tag: Tag): HTMLElement {
  const list = layerProjects(tag), chosen = list.filter((pr) => state.picked[pr.id]);
  const made = chosen.filter((pr) => state.picked[pr.id] === "done");
  const m = newMeter("meter", TAGS[tag]);
  m.name.title = TAGS[tag];
  paintMeter(m, chosen.length / list.length, made.length / list.length);
  const nums = el("div", "meter-nums"), projects = el("span"), xp = el("span");
  projects.append(el("b", null, String(chosen.length)), "/" + list.length, el("span", "meter-unit", " progetti"));
  xp.append(el("b", null, fmt(sumXp(chosen))), " XP");
  nums.append(projects, xp);
  m.box.title = "Fatti: " + plural(made.length, "progetto", "progetti") + " · " + fmt(sumXp(made)) + " XP";
  m.box.append(nums);
  linkToSection(m.box, `m-${tag}`, "Vai al layer " + TAGS[tag]);
  return m.box;
}

// clic sulla barra: porta all'inizio della sezione
function linkToSection(box: HTMLElement, id: SectionId, label: string): void {
  box.tabIndex = 0;
  box.setAttribute("role", "link");
  box.setAttribute("aria-label", label);
  box.addEventListener("click", () => goToBlock(id));
  box.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goToBlock(id); } });
}

/* ---------- requisiti comuni: livello, eventi, esperienze ----------
 * I campi si creano una volta sola (così chi scrive non perde il focus): render cambia solo testi e barre. */
interface CommonMeter extends Meter { info: HTMLElement; input: HTMLInputElement }

// parse restituisce undefined se il valore scritto non è valido
function commonMeter<T>(label: string, inputLabel: string, parse: (raw: string) => T | undefined, set: (v: T) => void): CommonMeter {
  const m = newMeter("meter common", label);
  const row = el("label", "meter-input"), input = el("input"), info = el("span");
  input.type = "text";
  input.inputMode = "decimal";
  input.size = 5;
  input.setAttribute("aria-label", inputLabel);
  row.append(input, info);
  m.box.append(row);
  byId("common").append(m.box);
  input.addEventListener("input", () => {
    const v = parse(input.value.trim().replace(",", ".")); // accetta anche la virgola: "12,5"
    input.setAttribute("aria-invalid", String(v === undefined));
    if (v === undefined) return;
    set(v);
    save();
    renderCommon();
  });
  // uscendo dal campo torna il valore salvato
  input.addEventListener("blur", () => { input.removeAttribute("aria-invalid"); renderCommon(); });
  return { ...m, info, input };
}

const parseCount = (raw: string): number | undefined => (/^\d{1,2}$/.test(raw) ? Number(raw) : undefined);
const parseLevel = (raw: string): number | null | undefined => (raw === "" ? null : validLevel(Number(raw)) ? Number(raw) : undefined);

const mLevel = commonMeter("Livello", "Livello attuale nel 42cursus", parseLevel, (v) => { state.level = v; });
const mEvents = commonMeter("Eventi", "Eventi a cui hai partecipato", parseCount, (v) => { state.events = v; });
const mExps = commonMeter("Esperienze professionali", "Esperienze professionali validate fuori dagli stage della pagina", parseCount, (v) => { state.exps = v; });

const typing = (m: CommonMeter): boolean => document.activeElement === m.input; // non riscrive il campo mentre ci scrivi

function renderCommon(): void {
  const t = currentTitle();
  // livello: le barre sono in XP, perché tra un livello e l'altro gli XP non sono costanti
  const need = levelToXp(t.level);
  if (state.level == null) {
    paintMeter(mLevel, 0, 0);
    mLevel.info.textContent = "/" + t.level;
    mLevel.info.title = "";
  } else {
    const have = levelToXp(state.level), pending = pendingXp(), planned = have + pending;
    paintMeter(mLevel, ratio(planned, need), ratio(have, need));
    // "/17 → 15,32 col piano", come "/10 eventi"; gli XP che mancano passando sopra
    mLevel.info.textContent = "/" + t.level + (pending ? " → " + fmtLevel(xpToLevel(planned)) + " col piano" : "");
    mLevel.info.title = planned < need ? "Col piano mancano " + fmt(Math.ceil(need - planned)) + " XP al livello " + t.level : "";
  }
  if (!typing(mLevel)) mLevel.input.value = state.level == null ? "" : fmtLevel(state.level);
  // eventi: si contano a mano, il piano non li cambia
  paintCount(mEvents, state.events, state.events, t.events, "eventi");
  mEvents.info.title = state.intra ? "Dall'intra arrivano le iscrizioni a eventi già finiti, non le presenze: correggi se ne hai saltato qualcuno" : "";
  // esperienze: il campo è per quelle fuori dalla pagina; gli stage fatti si aggiungono, quelli scelti alzano il piano
  const done = doneExps(), pending = pendingExps(), have = totalExps();
  paintCount(mExps, state.exps, have, t.exps, "esperienze", done.length, have + pending.length);
  mExps.info.title = [
    done.length ? "Fatti: " + done.map((pr) => pr.name).join(", ") : "",
    pending.length ? "Nel piano: " + pending.map((pr) => pr.name).join(", ") : "",
    "Nel campo: le esperienze validate che non sono stage della pagina",
  ].filter(Boolean).join("\n");
}
// typed: il valore del campo; have: il totale; fromProjects: la parte che viene dai progetti fatti
function paintCount(m: CommonMeter, typed: number, have: number, need: number, unit: string, fromProjects = 0, planned = have): void {
  paintMeter(m, ratio(planned, need), ratio(have, need));
  m.info.textContent = (fromProjects ? "+ " + fromProjects + " dagli stage " : "") + "/" + need + " " + unit
    + (planned > have ? " → " + planned + " col piano" : "");
  if (!typing(m)) m.input.value = String(typed);
}

/* ---------- tempo che resta: i progetti scelti non ancora fatti, uno dopo l'altro ---------- */
function renderLeft(): void {
  const box = byId("plan-left"), t = currentTitle();
  box.title = "";
  box.textContent = "";
  // tutto validato: blocchi dell'opzione e requisiti comuni (le Masteries non hanno requisiti)
  if (!state.masteries && optBlocks().every((id) => tally(id).valid) && state.level != null && state.level >= t.level
    && state.events >= t.events && totalExps() >= t.exps) {
    box.append(el("b", null, "Requisiti dell'" + t.name + " validati."), " Prima di fare domanda controlla sulla pagina RNCP dell'intra: è quella che fa fede.");
    return;
  }
  const left = PROJECTS.filter((pr) => isPending(pr) && !isInternship(pr)); // gli stage non hanno una stima in ore
  if (!left.length) {
    box.textContent = Object.keys(state.picked).length ? "Tutti i progetti scelti sono fatti." : "Scegli i progetti cliccando sulle card: qui vedrai quanto tempo ti resta.";
    return;
  }
  const doing = left.filter((pr) => state.picked[pr.id] === "doing").length;
  const missing = left.filter((pr) => hours(pr) == null);
  const h = sumHours(left);
  const days = calendarDays(workDays(h));
  // solo la data; i dettagli passando sopra
  box.append(el("b", "eta", "ETA: " + dateIn(days)));
  box.title = plural(left.length, "progetto", "progetti") + " da fare" + (doing ? " (" + doing + " in corso)" : "")
    + ": ~" + plural(days, "giorno", "giorni") + ", " + fmt(h) + " h stimate dall'intra a " + fmtDayHours(state.dayHours)
    + " h al giorno, weekend liberi; i progetti in corso contano per intero"
    + (missing.length ? ". Senza stima: " + missing.map((pr) => pr.name).join(", ") : "") + ".";
}

/* ---------- card dei progetti ---------- */
// dopo un render la card è nuova: rimette il focus dove l'utente l'aveva
const refocus = (selector: string): void => document.querySelector<HTMLElement>(selector)?.focus();
const blockNames = (ids: BlockId[]): string => ids.map((b) => BLOCKS[b].name).join(", ");

// sezioni della pagina: i blocchi dell'opzione e gli stage, o i layer delle Masteries
type SectionId = BlockId | "exp" | `m-${Tag}`;

function card(pr: Project, blockId: SectionId): HTMLElement {
  const status = state.picked[pr.id];
  const key = blockId + ":" + pr.id; // lo stesso progetto può comparire in più blocchi
  const c = el("article", "card" + (status ? " on " + status : ""));
  c.dataset.key = key;
  c.tabIndex = 0;
  c.setAttribute("aria-label", pr.name + (status ? ", scelto, " + STATUS_NAMES[status].toLowerCase() : ", non scelto"));

  // il clic sulla card sceglie il progetto (da fare) o lo toglie dal piano
  const toggle = (): void => {
    if (status) delete state.picked[pr.id]; else state.picked[pr.id] = "todo";
    save();
    render();
  };
  c.addEventListener("click", (e) => {
    if ((e.target as Element).closest("a, button")) return; // link e bottoni dello stato fanno altro
    if (window.getSelection()?.toString()) return; // stava selezionando testo
    toggle();
  });
  c.addEventListener("keydown", (e) => {
    if (e.target !== c || (e.key !== "Enter" && e.key !== " ")) return;
    e.preventDefault();
    toggle();
    refocus('[data-key="' + key + '"]');
  });

  const top = el("div", "card-top");
  top.append(el("h3", null, pr.name));
  if (status) top.append(statusButtons(pr, key, status));
  c.append(top, factChips(pr));
  if (pr.tags.length) c.append(el("p", "tags-of", pr.tags.map((t) => TAGS[t]).join(" · ")));
  c.append(el("p", "desc", pr.desc));
  if (state.masteries) {
    // i layer sono già nella riga delle categorie: qui i blocchi RNCP in cui il progetto conta
    for (const id of [6, 7] as TitleId[]) {
      const there = titleBlocks(pr, id);
      if (there.length) c.append(el("p", "also", "Conta nell'" + TITLES[id].name + ": " + blockNames(there)));
    }
  } else {
    const alsoHere = pr.blocks.filter((b) => b !== blockId && optBlocks().includes(b));
    if (alsoHere.length) c.append(el("p", "also", "Conta anche in: " + blockNames(alsoHere)));
    const alsoThere = otherBlocks(pr);
    if (alsoThere.length) c.append(el("p", "also", "Conta anche nell'" + otherTitle().name + ": " + blockNames(alsoThere)));
  }

  const links = el("div", "links");
  const pdf = subjectPdf(pr);
  if (pdf) links.append(extLink("Subject ↗", pdf, "PDF del subject sul CDN di 42"));
  links.append(extLink("Pagina del progetto ↗", pageUrl(pr), "Pagina del progetto sull'intra (serve il login 42)"));
  c.append(links);
  return c;
}

// Da fare / In corso / Fatto, sulle card dei progetti scelti
function statusButtons(pr: Project, key: string, current: Status): HTMLElement {
  const seg = el("div", "seg status");
  seg.setAttribute("role", "group");
  seg.setAttribute("aria-label", "Stato di " + pr.name);
  for (const s of Object.keys(STATUS_NAMES) as Status[]) {
    const b = el("button", null, STATUS_NAMES[s]);
    b.type = "button";
    b.dataset.status = s;
    b.setAttribute("aria-pressed", String(s === current));
    b.addEventListener("click", () => {
      state.picked[pr.id] = s;
      save();
      render();
      refocus('[data-key="' + key + '"] [data-status="' + s + '"]');
    });
    seg.append(b);
  }
  return seg;
}

// XP, persone, giorni e linguaggio
function factChips(pr: Project): HTMLElement {
  const facts = el("div", "facts");
  const xp = el("span", "fact", xpLabel(pr));
  const mark = markOf(pr);
  if (mark != null && pr.xp != null) xp.title = "Voto " + mark + " sull'intra: " + fmt(pr.xp) + " XP a voto 100";
  const h = hours(pr);
  const days = el("span", "fact", h == null ? "giorni n.d." : daysLabel(h));
  days.title = h == null ? "Stima non disponibile: npm run hours"
    : fmt(h) + " h stimate dall'intra, a " + fmtDayHours(state.dayHours) + " h al giorno: " + fmt(workDays(h)) + " giorni lavorativi più i weekend";
  facts.append(xp, el("span", "fact", peopleLabel(pr)), days, el("span", "fact lang", pr.lang));
  return facts;
}

/* ---------- blocchi ---------- */
const collapsed = new Set<SectionId>(); // blocchi chiusi dall'utente: di default sono tutti aperti
// nell'RNCP 7 un blocco già coperto mostra solo i progetti scelti; qui quelli in cui l'utente ha chiesto di vederli tutti
const expandedDone = new Set<BlockId>();

function renderBlocks(): void {
  const root = byId("blocks");
  root.textContent = "";
  if (state.masteries) {
    for (const tag of Object.keys(TAGS) as Tag[]) root.append(layerSection(tag));
    return;
  }
  for (const id of optBlocks()) {
    const blk = BLOCKS[id], t = tally(id);
    const list = sortProjects(PROJECTS.filter((pr) => pr.blocks.includes(id)));
    const trimmable = state.title === 7 && t.covered;
    const hideRest = trimmable && !expandedDone.has(id);
    const shown = list.filter((pr) => visible(pr) && (!hideRest || state.picked[pr.id]));

    const title = el("h2", null, blk.name);
    if (t.covered) title.append(doneCheck(t.valid));
    const sec = sectionBox(id, title, "Minimo " + blockRule(blk) + " · " + shown.length + " di " + list.length + " mostrati");

    const hidden = list.filter((pr) => !state.picked[pr.id]).length;
    if (trimmable && hidden) {
      const note = el("p", "empty", hideRest
        ? "Blocco già coperto dai progetti scelti: gli altri " + hidden + " sono nascosti. "
        : "Blocco già coperto dai progetti scelti. ");
      const btn = el("button", "link", hideRest ? "Mostra tutti" : "Mostra solo gli scelti");
      btn.type = "button";
      btn.addEventListener("click", () => { if (hideRest) expandedDone.add(id); else expandedDone.delete(id); renderBlocks(); });
      note.append(btn);
      sec.append(note);
    }

    fillSection(sec, shown, id, "Nessun progetto con questi filtri.");
    root.append(sec);
  }
  root.append(internshipSection());
}

// sezione apribile, che ricorda se l'utente l'ha chiusa
function sectionBox(id: SectionId, title: HTMLElement, info: string): HTMLDetailsElement {
  const sec = el("details", "block");
  sec.id = "block-" + id;
  sec.open = !collapsed.has(id);
  sec.addEventListener("toggle", () => { if (sec.open) collapsed.delete(id); else collapsed.add(id); });
  const head = el("summary", "block-head");
  head.append(title, el("span", null, info));
  sec.append(head);
  return sec;
}
function fillSection(sec: HTMLElement, shown: Project[], id: SectionId, empty: string): void {
  if (shown.length) {
    const grid = el("div", "grid");
    for (const pr of shown) grid.append(card(pr, id));
    sec.append(grid);
  } else sec.append(el("p", "empty", empty));
}

// Masteries: un layer dell'holy graph, senza minimi; un progetto con più layer compare in ognuno
function layerSection(tag: Tag): HTMLElement {
  const list = sortProjects(layerProjects(tag));
  const shown = list.filter(visible), chosen = list.filter((pr) => state.picked[pr.id]);
  const id: SectionId = `m-${tag}`;
  const sec = sectionBox(id, el("h2", null, TAGS[tag]),
    plural(chosen.length, "scelto", "scelti") + ", " + fmt(sumXp(chosen)) + " XP · " + shown.length + " di " + list.length + " mostrati");
  fillSection(sec, shown, id, "Nessun progetto con questi filtri.");
  return sec;
}

// stage: non contano in nessun blocco, ma quelli scelti e non ancora fatti alzano il livello col piano
function internshipSection(): HTMLElement {
  const list = sortProjects(INTERNSHIPS);
  const shown = list.filter(visible);
  const sec = sectionBox("exp", el("h2", null, "Esperienze professionali"), "XP per il livello · " + shown.length + " di " + list.length + " mostrati");
  fillSection(sec, shown, "exp", "Nessuno stage con questi filtri.");
  return sec;
}

/* ---------- tutto insieme ---------- */
const titleButtons = document.querySelectorAll<HTMLButtonElement>("[data-title]");
const optButtons = document.querySelectorAll<HTMLButtonElement>("[data-opt]");
const teamButtons = document.querySelectorAll<HTMLButtonElement>("[data-team]");
const toTitle = (v: string | undefined): TitleId => (v === "7" ? 7 : 6);
// il bottone è premuto: Masteries, o il titolo se le Masteries sono chiuse
const titlePressed = (b: HTMLButtonElement): boolean =>
  b.dataset.title === "m" ? state.masteries : !state.masteries && toTitle(b.dataset.title) === state.title;
const toOpt = (v: string | undefined): OptionId => (v === "1" ? 1 : 2);
const toTeam = (v: string | undefined): Team => (v === "solo" || v === "group" ? v : "all");
const dayHoursInput = byId<HTMLInputElement>("day-hours");
const sortSelect = byId<HTMLSelectElement>("sort");
const sortDir = byId<HTMLButtonElement>("sort-dir");
const toSort = (v: string): SortKey => (v === "xp" || v === "people" || v === "name" ? v : "time");

function render(): void {
  byId("common-rules").textContent = titleRules(currentTitle());
  renderCommon();
  titleButtons.forEach((b) => b.setAttribute("aria-pressed", String(titlePressed(b))));
  // le Masteries non hanno opzioni né requisiti comuni
  byId("opts").hidden = state.masteries;
  byId("common").hidden = state.masteries;
  byId("both-box").hidden = state.masteries;
  // i nomi delle opzioni cambiano con il titolo
  optButtons.forEach((b) => {
    const opt = toOpt(b.dataset.opt);
    b.textContent = currentTitle().options[opt].name;
    b.setAttribute("aria-pressed", String(opt === state.opt));
  });
  teamButtons.forEach((b) => b.setAttribute("aria-pressed", String(toTeam(b.dataset.team) === state.team)));
  renderSort();
  if (document.activeElement !== dayHoursInput) dayHoursInput.value = fmtDayHours(state.dayHours); // non disturba chi sta scrivendo
  renderMeters();
  renderLeft();
  renderSession();
  renderBlocks();
}

// "↓ dal più alto" / "↑ dal più basso", "A→Z" / "Z→A" per il nome
function renderSort(): void {
  sortSelect.value = state.sort;
  const name = state.sort === "name";
  sortDir.textContent = name ? (state.desc ? "Z→A" : "A→Z") : state.desc ? "↓ Decrescente" : "↑ Crescente";
  sortDir.setAttribute("aria-label", "Direzione: " + sortLabel().split(", ")[1]);
}

/* ---------- comandi e filtri ---------- */
titleButtons.forEach((b) => b.addEventListener("click", () => {
  state.masteries = b.dataset.title === "m";
  if (!state.masteries) state.title = toTitle(b.dataset.title);
  save();
  render();
}));
optButtons.forEach((b) => b.addEventListener("click", () => { state.opt = toOpt(b.dataset.opt); save(); render(); }));
teamButtons.forEach((b) => b.addEventListener("click", () => { state.team = toTeam(b.dataset.team); render(); }));
byId("reset").addEventListener("click", () => { state.picked = {}; save(); render(); });

const search = byId<HTMLInputElement>("q");
search.addEventListener("input", () => { state.q = search.value.trim().toLowerCase(); renderBlocks(); });
const only = byId<HTMLInputElement>("only");
only.addEventListener("change", () => { state.only = only.checked; renderBlocks(); });
const both = byId<HTMLInputElement>("both");
both.addEventListener("change", () => { state.both = both.checked; renderBlocks(); });

// ordinamento: cambiando criterio la direzione torna quella naturale
for (const k of Object.keys(SORT_NAMES) as SortKey[]) sortSelect.append(new Option(SORT_NAMES[k], k));
sortSelect.addEventListener("change", () => { state.sort = toSort(sortSelect.value); state.desc = SORT_DESC[state.sort]; renderSort(); renderBlocks(); });
sortDir.addEventListener("click", () => { state.desc = !state.desc; renderSort(); renderBlocks(); });

// ore al giorno: accetta anche la virgola ("6,5")
dayHoursInput.addEventListener("input", () => {
  const v = Number(dayHoursInput.value.replace(",", "."));
  const ok = dayHoursInput.value.trim() !== "" && validDayHours(v);
  dayHoursInput.setAttribute("aria-invalid", String(!ok));
  if (!ok || v === state.dayHours) return;
  state.dayHours = v;
  save();
  renderLeft();
  renderBlocks();
});
dayHoursInput.addEventListener("blur", () => { dayHoursInput.value = fmtDayHours(state.dayHours); dayHoursInput.removeAttribute("aria-invalid"); });

// bottoni delle categorie: si accendono e spengono uno per uno; niente bottone per gli stage, che hanno già la loro sezione
for (const t of Object.keys(TAGS) as Tag[]) {
  if (t === "pro") continue;
  const b = el("button", null, TAGS[t]);
  b.type = "button";
  b.setAttribute("aria-pressed", "false");
  b.addEventListener("click", () => {
    if (state.tags.has(t)) state.tags.delete(t); else state.tags.add(t);
    b.setAttribute("aria-pressed", String(state.tags.has(t)));
    renderBlocks();
  });
  byId("tags").append(b);
}

/* ---------- barra dei requisiti fissa in alto ---------- */
// i filtri restano sotto la barra (style.css): il CSS riceve l'altezza della barra, che cambia con il contenuto
const reqsBar = document.querySelector<HTMLElement>(".reqs:not(.reqs-common)");
if (reqsBar) new ResizeObserver(() => {
  document.documentElement.style.setProperty("--reqs-h", reqsBar.offsetHeight + "px");
}).observe(reqsBar);

// mentre scorri la barra si compatta in modo continuo: si accorcia di un pixel per ogni pixel di scroll,
// finché i selettori RNCP/Opzione non sono spariti. Il margine sotto restituisce l'altezza persa,
// così il contenuto sotto scorre insieme al dito e la pagina non salta (style.css usa --p e --head-h)
const wide = matchMedia("(min-width: 860px)");
const reqsPrev = reqsBar?.previousElementSibling;
const reqsHead = reqsBar?.querySelector<HTMLElement>(".reqs-head");
let compactQueued = false;
function compactReqs(): void {
  compactQueued = false;
  if (!reqsBar || !reqsPrev || !reqsHead) return;
  if (!wide.matches) { reqsBar.style.removeProperty("--p"); return; }
  // letture prima delle scritture: un solo calcolo del layout per frame
  const head = reqsHead.scrollHeight;
  const gap = parseFloat(getComputedStyle(reqsBar.parentElement!).rowGap) || 0;
  const start = reqsPrev.getBoundingClientRect().bottom + scrollY + gap; // dove la barra comincia a restare ferma
  const lost = head + 24; // selettori + spazio sotto + 6 px di padding sopra e sotto (style.css)
  const p = Math.min(Math.max((scrollY - start) / lost, 0), 1);
  reqsBar.style.setProperty("--head-h", head + "px");
  reqsBar.style.setProperty("--p", String(p));
}
function queueCompact(): void {
  if (compactQueued) return;
  compactQueued = true;
  requestAnimationFrame(compactReqs);
}
// altezza delle barre fisse quando sono compatte, cioè dopo che lo scroll è arrivato a destinazione:
// l'altezza attuale meno quanto devono ancora perdere ((1 - p) di selettori + 24 px)
function stickyBottom(): number {
  if (!wide.matches || !reqsBar || !reqsHead) return 0;
  const p = parseFloat(reqsBar.style.getPropertyValue("--p")) || 0;
  const filters = document.querySelector<HTMLElement>(".filters");
  return (parseFloat(getComputedStyle(reqsBar).top) || 0) + reqsBar.offsetHeight - (reqsHead.scrollHeight + 24) * (1 - p)
    + (filters?.offsetHeight ?? 0);
}

// porta all'inizio della sezione, appena sotto le barre fisse, e la apre se era chiusa
function goToBlock(id: SectionId): void {
  const sec = document.getElementById("block-" + id) as HTMLDetailsElement | null;
  if (!sec) return;
  sec.open = true;
  const top = sec.getBoundingClientRect().top + scrollY - stickyBottom() - 8;
  scrollTo({ top, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

addEventListener("scroll", queueCompact, { passive: true });
addEventListener("resize", queueCompact);
wide.addEventListener("change", queueCompact);
compactReqs();
