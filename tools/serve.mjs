/*
 * Server locale della pagina: http://localhost:4242
 * Serve i file della pagina via http, così compare "Accedi con 42"
 * (il Cloudflare Worker accetta http://localhost:4242 come pagina di ritorno).
 * Ascolta solo su 127.0.0.1, quindi non è raggiungibile da altri computer.
 *
 * Uso: npm run serve   (--port 8080 per cambiare porta)
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import { ROOT, parseArgs } from "./lib/projects.mjs";

const { flags } = parseArgs();
const PORT = Number(flags.port) || 4242;

// solo i file della pagina, nella cartella principale: niente .env, niente sottocartelle
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function send(res, code, type, body) {
  res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(body);
}

createServer(async (req, res) => {
  try {
    const url = new URL("http://localhost" + req.url); // concatenato: "//x" non diventa un altro host
    const name = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));
    const type = TYPES[extname(name)];
    if (!type || !/^[\w-]+\.\w+$/.test(name)) return send(res, 404, "text/plain; charset=utf-8", "Non trovato");
    send(res, 200, type, await readFile(new URL(name, ROOT)));
  } catch (err) {
    if (err?.code === "ENOENT") return send(res, 404, "text/plain; charset=utf-8", "Non trovato");
    console.error(err);
    send(res, 500, "text/plain; charset=utf-8", "Errore del server");
  }
}).listen(PORT, "127.0.0.1", () => {
  console.log("Pagina su http://localhost:" + PORT + " (Ctrl+C per fermare)");
});
