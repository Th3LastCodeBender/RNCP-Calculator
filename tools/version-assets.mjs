/*
 * Aggiunge a CSS e script di piano-rncp6.html un ?v= con l'impronta del file
 * (es. script.js?v=3f9a1c2b). GitHub Pages fa tenere i file in cache per 10 minuti:
 * senza versione, dopo un aggiornamento il browser può unire l'HTML nuovo a uno
 * script.js vecchio, che si ferma su elementi che non ci sono più.
 * Con l'impronta, ogni file cambiato ha un indirizzo nuovo e viene riscaricato.
 *
 * Gira da solo dopo npm run build e npm run hours.
 * Uso: npm run version
 */
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { ROOT } from "./lib/projects.mjs";

const PAGE = new URL("piano-rncp6.html", ROOT);
const ASSETS = ["style.css", "hours.js", "script.js"];

let html = await readFile(PAGE, "utf8");
const before = html;
for (const name of ASSETS) {
  const hash = createHash("sha256").update(await readFile(new URL(name, ROOT))).digest("hex").slice(0, 8);
  const ref = new RegExp('((?:src|href)=")' + name.replace(".", "\\.") + '(?:\\?v=[^"]*)?"', "g");
  if (!ref.test(html)) throw new Error(name + " non trovato in piano-rncp6.html");
  html = html.replace(ref, "$1" + name + "?v=" + hash + '"');
}
if (html !== before) await writeFile(PAGE, html);
console.log(html !== before ? "Versioni aggiornate in piano-rncp6.html" : "Versioni già aggiornate");
