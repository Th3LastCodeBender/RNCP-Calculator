/*
 * Server locale della pagina: http://localhost:4242
 * Serve i file della pagina e risponde a /api/me?login=<login> con i progetti
 * e il livello dello studente, usando le credenziali di .env (FT_UID, FT_SECRET).
 * Le credenziali restano qui: la pagina non le vede mai.
 * Ascolta solo su 127.0.0.1, quindi non è raggiungibile da altri computer.
 *
 * Uso: npm run serve   (--port 8080 per cambiare porta)
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import { login, client } from "./lib/api42.mjs";
import { ROOT, parseArgs } from "./lib/projects.mjs";
import { intraPlan, validLogin } from "./lib/me.mjs";

const { flags } = parseArgs();
const PORT = Number(flags.port) || 4242;
// senza credenziali la pagina funziona lo stesso, ma senza import dall'intra
const HAS_KEYS = Boolean(process.env.FT_UID && process.env.FT_SECRET);

// solo i file della pagina, nella cartella principale: niente .env, niente sottocartelle
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

// il token dell'API dura circa due ore: se ne chiede uno nuovo dopo un'ora
let token = null, tokenAt = 0;
async function api() {
  if (!token || Date.now() - tokenAt > 3600_000) { token = await login(); tokenAt = Date.now(); }
  return client(token);
}

function send(res, code, type, body) {
  res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(body);
}
const json = (res, code, obj) => send(res, code, "application/json; charset=utf-8", JSON.stringify(obj));

createServer(async (req, res) => {
  try {
    const url = new URL("http://localhost" + req.url); // concatenato: "//x" non diventa un altro host
    if (url.pathname === "/api/ping") return json(res, 200, { intra: HAS_KEYS });
    if (url.pathname === "/api/me") {
      if (!HAS_KEYS) return json(res, 503, { error: "Mancano FT_UID e FT_SECRET in .env" });
      const user = url.searchParams.get("login");
      if (!validLogin(user)) return json(res, 400, { error: "Login non valido" });
      const result = await intraPlan(await api(), user);
      if (!result) return json(res, 404, { error: "Utente " + user + " non trovato sull'intra" });
      console.log("Importati i progetti di " + result.plan.login + ": " + result.rows.length);
      return json(res, 200, result.plan);
    }
    const name = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));
    const type = TYPES[extname(name)];
    if (!type || !/^[\w-]+\.\w+$/.test(name)) return send(res, 404, "text/plain; charset=utf-8", "Non trovato");
    send(res, 200, type, await readFile(new URL(name, ROOT)));
  } catch (err) {
    if (err?.code === "ENOENT") return send(res, 404, "text/plain; charset=utf-8", "Non trovato");
    console.error(err);
    json(res, 500, { error: err instanceof Error ? err.message : String(err) });
  }
}).listen(PORT, "127.0.0.1", () => {
  console.log("Pagina su http://localhost:" + PORT + " (Ctrl+C per fermare)");
  if (!HAS_KEYS) console.log("Mancano FT_UID e FT_SECRET in .env: l'import dall'intra è disattivato (vedi tools/README.md).");
});
