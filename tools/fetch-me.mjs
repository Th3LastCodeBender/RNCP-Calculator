/*
 * Scrive piano-intra.json: i tuoi progetti dall'intra (fatti e in corso, con il voto)
 * e il livello nel 42cursus. Nella pagina si importa con Esporta > Importa dall'intra:
 * aggiorna gli stati senza toccare i progetti "da fare" del piano.
 * Con npm run serve non serve: la pagina lo chiede da sola.
 *
 * Uso: npm run me -- <login>        (oppure INTRA_LOGIN=<login> in .env)
 *      --out altro.json             cambia il file di destinazione
 */
import { writeFile } from "node:fs/promises";
import { login, client } from "./lib/api42.mjs";
import { ROOT, parseArgs } from "./lib/projects.mjs";
import { intraPlan, validLogin } from "./lib/me.mjs";

const { slugs: args, flags } = parseArgs();
const user = args[0] || process.env.INTRA_LOGIN;
if (!validLogin(user)) {
  console.error("Manca il login: npm run me -- <login> (oppure INTRA_LOGIN in .env).");
  process.exit(1);
}

const result = await intraPlan(client(await login()), user);
if (!result) {
  console.error("Utente " + user + " non trovato sull'API.");
  process.exit(1);
}
const { plan, rows } = result;
for (const [name, s, mark] of rows) console.log(name.padEnd(40), s === "done" ? "fatto" + (mark != null ? " (" + mark + ")" : "") : "in corso");

const file = flags.out || "piano-intra.json";
await writeFile(new URL(file, ROOT), JSON.stringify(plan, null, 2) + "\n");

const n = Object.values(plan.status);
console.log("\nScritto " + file + ": " + n.filter((s) => s === "done").length + " fatti, " + n.filter((s) => s === "doing").length + " in corso"
  + (plan.level != null ? ", livello " + plan.level.toFixed(2) : "") + ".");
console.log("Nella pagina: Esporta > Importa dall'intra.");
