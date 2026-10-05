/* Esporta il piano: Markdown o PDF (stampa del browser di #report, visibile solo in stampa) */

interface PlanSection { blk: Block; t: Tally; chosen: Project[] }

const planSections = (): PlanSection[] =>
  optBlocks().map((id) => ({ blk: BLOCKS[id], t: tally(id), chosen: sortProjects(PROJECTS.filter((pr) => pr.blocks.includes(id) && state.picked[pr.id])) }));

// i progetti scelti nell'ordine dei filtri, ognuno una volta sola anche se conta in più blocchi
const uniqueChosen = (secs: PlanSection[]): Project[] => sortProjects([...new Set(secs.flatMap((sec) => sec.chosen))]);

// "Totale: 5 progetti, 40 000 XP; da fare: ~36 giorni (26 lavorativi, 210 h). …"; bold mette in grassetto per il Markdown
function totalLine(secs: PlanSection[], bold: (s: string) => string): string {
  const all = uniqueChosen(secs);
  const h = sumHours(all.filter(isPending));
  return "Totale: " + bold(plural(all.length, "progetto", "progetti")) + ", " + bold(fmt(sumXp(all)) + " XP") + "; da fare: " + bold(daysLabel(h)) + daysNote(h)
    + ". Ogni progetto è contato una volta; ore stimate dall'intra, giornate da " + fmtDayHours(state.dayHours) + " h, sabato e domenica liberi.";
}

// "2/2 progetti · 13 650/10 000 XP (fatti: 1, 9450 XP)"
const progress = ({ blk, t }: PlanSection): string =>
  t.n + "/" + blk.minN + " progetti" + (blk.minXp ? " · " + fmt(t.xp) + "/" + fmt(blk.minXp) + " XP" : "")
  + " (fatti: " + t.doneN + (blk.minXp ? ", " + fmt(t.doneXp) + " XP" : "") + ")";
const blockState = (t: Tally): string => (t.valid ? "Validato" : t.covered ? "Coperto dal piano" : "Da completare");
const blockIcon = (t: Tally): string => (t.valid ? "✅" : t.covered ? "☑️" : "⏳");
const statusOf = (pr: Project): string => STATUS_NAMES[state.picked[pr.id] || "todo"];
const projectFacts = (pr: Project): string => [pr.lang, xpLabel(pr), timeLabel(pr), peopleLabel(pr)].join(" · ");

/* ---------- Markdown ---------- */
function planMarkdown(): string {
  const secs = planSections();
  const title = currentTitle();
  const lines: string[] = [
    "# Piano " + title.name,
    "",
    "**" + optName() + "** · esportato il " + today() + " · ordine: " + sortLabel(),
    "",
    "## Riepilogo",
    "",
    "| Blocco | Minimo | Avanzamento | Stato |",
    "| --- | --- | --- | --- |",
    ...secs.map((sec) => "| " + sec.blk.name + " | " + blockRule(sec.blk) + " | " + progress(sec) + " | " + blockIcon(sec.t) + " " + blockState(sec.t) + " |"),
    "",
    totalLine(secs, (s) => "**" + s + "**"),
  ];
  for (const sec of secs) {
    lines.push("", "## " + blockIcon(sec.t) + " " + sec.blk.name, "", "_" + progress(sec) + "_", "");
    if (!sec.chosen.length) { lines.push("Nessun progetto scelto."); continue; }
    for (const pr of sec.chosen) {
      lines.push("- **" + pr.name + "** · _" + statusOf(pr) + "_ · " + projectFacts(pr) + " · [subject](" + pageUrl(pr) + ")");
      lines.push("  " + pr.desc);
    }
  }
  return lines.join("\n") + "\n";
}

/* ---------- linea del tempo del PDF ----------
 * I progetti scelti non ancora fatti, uno dopo l'altro nell'ordine dei filtri, con le ore al giorno scelte
 * e sabato e domenica liberi. Le posizioni sono in giorni di calendario dall'inizio.
 */
interface Leg { pr: Project; from: number; to: number }

function planTimeline(secs: PlanSection[]): { legs: Leg[]; total: number; missing: Project[] } {
  const legs: Leg[] = [], missing: Project[] = [];
  let doneH = 0, doneW = 0; // ore e giorni lavorativi dei progetti già messi in fila
  for (const pr of uniqueChosen(secs).filter(isPending)) {
    const h = hours(pr);
    if (h == null || h <= 0) { missing.push(pr); continue; }
    doneH += h;
    const endW = Math.max(doneW + 1, Math.round(doneH / state.dayHours)); // almeno un giorno a progetto
    legs.push({ pr, from: calendarStart(doneW), to: calendarDays(endW) });
    doneW = endW;
  }
  return { legs, total: calendarDays(doneW), missing };
}

function timelineSection(secs: PlanSection[]): HTMLElement {
  const part = el("section", "rep-time");
  part.append(el("h2", null, "Linea del tempo"));
  const { legs, total, missing } = planTimeline(secs);
  if (!legs.length) {
    part.append(el("p", "rep-empty", "Nessun progetto da fare con una stima delle ore."));
    return part;
  }
  part.append(el("p", "rep-rule", "I progetti non ancora fatti, uno alla volta, in ordine di " + sortLabel().toLowerCase() + ": ~" + fmt(total) + " giorni"
    + " (circa " + fmt(Math.round(total / 7)) + " settimane). Se inizi oggi finisci verso il " + dateIn(total) + "."));
  const chart = el("div", "tl");
  chart.style.setProperty("--week", (700 / total) + "%"); // una riga verticale a settimana
  for (const leg of legs) {
    const row = el("div", "tl-row");
    const track = el("div", "tl-track"), bar = el("i");
    bar.style.left = (leg.from / total) * 100 + "%";
    bar.style.width = ((leg.to - leg.from) / total) * 100 + "%";
    track.append(bar);
    row.append(el("span", "tl-name", leg.pr.name), track, el("span", "tl-days", "g. " + (leg.from + 1) + "–" + leg.to));
    chart.append(row);
  }
  const axis = el("div", "tl-row tl-axis");
  const ends = el("div", "tl-ends");
  ends.append(el("span", null, "oggi"), el("span", null, dateIn(total)));
  axis.append(el("span"), ends, el("span"));
  chart.append(axis);
  part.append(chart);
  if (missing.length) part.append(el("p", "rep-rule", "Senza stima delle ore, esclusi: " + missing.map((pr) => pr.name).join(", ") + "."));
  return part;
}

/* ---------- PDF: riempie #report e apre la finestra di stampa ---------- */
function printPlan(): void {
  const secs = planSections();
  const root = byId("report");
  root.textContent = "";

  const head = el("header", "rep-head");
  head.append(el("h1", null, "Piano " + currentTitle().name), el("p", null, optName() + " · esportato il " + today() + " · ordine: " + sortLabel()));
  const sum = el("div", "rep-summary");
  for (const sec of secs) {
    const box = el("div", "rep-meter" + (sec.t.valid ? " done" : ""));
    box.append(el("b", null, (sec.t.valid ? "✓ " : "") + sec.blk.name), el("span", null, blockState(sec.t) + " · " + progress(sec)));
    sum.append(box);
  }
  root.append(head, sum, el("p", "rep-total", totalLine(secs, (s) => s)), timelineSection(secs));

  for (const sec of secs) {
    const part = el("section", "rep-block");
    const h = el("h2", null, sec.blk.name);
    h.append(el("span", "rep-state" + (sec.t.valid ? " done" : ""), (sec.t.valid ? "✓ " : "") + blockState(sec.t)));
    part.append(h, el("p", "rep-rule", "Minimo " + blockRule(sec.blk) + " · " + progress(sec)));
    if (!sec.chosen.length) part.append(el("p", "rep-empty", "Nessun progetto scelto."));
    for (const pr of sec.chosen) {
      const item = el("article", "rep-item");
      const title = el("h3", null, pr.name);
      title.append(el("span", null, statusOf(pr) + " · " + projectFacts(pr)));
      const a = el("a", null, pageUrl(pr));
      a.href = pageUrl(pr);
      item.append(title, el("p", null, pr.desc), a);
      part.append(item);
    }
    root.append(part);
  }
  window.print();
}

/* ---------- menu "Esporta": si chiude con un clic fuori, con Esc o dopo aver scelto una voce ---------- */
const menuBtn = byId<HTMLButtonElement>("menu-btn");
const menuPop = byId("menu-pop");
function setMenu(open: boolean): void {
  menuPop.hidden = !open;
  menuBtn.setAttribute("aria-expanded", String(open));
}
menuBtn.addEventListener("click", () => setMenu(menuPop.hidden));
menuPop.addEventListener("click", (e) => { if ((e.target as Element).closest("button")) setMenu(false); });
document.addEventListener("click", (e) => {
  if (!menuPop.hidden && !(e.target as Element).closest(".menu")) setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || menuPop.hidden) return;
  setMenu(false);
  menuBtn.focus();
});

byId("export-md").addEventListener("click", () => download(fileName("md"), planMarkdown(), "text/markdown"));
byId("export-pdf").addEventListener("click", printPlan);
