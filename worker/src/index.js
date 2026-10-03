/*
 * "Accedi con 42" per la pagina su GitHub Pages: Cloudflare Worker.
 *
 *   GET /login?return=<url della pagina>
 *       manda al login OAuth dell'intra
 *   GET /callback?code=…&state=…
 *       scambia il codice con il token (qui serve FT_SECRET), legge /v2/me
 *       e torna alla pagina con i dati nel frammento: <pagina>#intra=<base64url(json)>
 *
 * Il token non viene salvato né mandato alla pagina: si usa una volta e basta.
 * Ognuno legge solo i propri dati (/v2/me), con il proprio login 42.
 *
 * Variabili (wrangler.toml): ALLOWED_ORIGINS, origini delle pagine a cui si può tornare, separate da virgola
 * Secret (npx wrangler secret put …): FT_UID, FT_SECRET
 */
const API = "https://api.intra.42.fr";
const CURSUS_42 = 21;
const STATE_TTL = 10 * 60 * 1000; // il login va completato entro 10 minuti

// stato dell'intra -> stato della pagina: validato = fatto ("d"); in lavorazione = in corso ("o"); il resto si ignora
const IN_PROGRESS = new Set(["in_progress", "searching_a_group", "creating_group", "waiting_for_correction"]);
function statusOf(pu) {
  if (pu.status === "finished" && pu["validated?"]) return "d";
  if (IN_PROGRESS.has(pu.status)) return "o";
  return null;
}

/* ---------- base64url e firma dello state (HMAC con FT_SECRET: niente da salvare) ---------- */
const enc = new TextEncoder();
const b64url = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64url = (s) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
const b64urlText = (text) => b64url(enc.encode(text));

async function hmac(env, data) {
  const key = await crypto.subtle.importKey("raw", enc.encode(env.FT_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data))));
}
async function makeState(env, ret) {
  const body = b64urlText(JSON.stringify({ r: ret, e: Date.now() + STATE_TTL, n: crypto.randomUUID() }));
  return body + "." + (await hmac(env, body));
}
// l'url di ritorno, se lo state è nostro e non è scaduto
async function readState(env, state) {
  const [body, sig] = String(state || "").split(".");
  if (!body || !sig || sig !== (await hmac(env, body))) return null;
  const data = JSON.parse(new TextDecoder().decode(fromB64url(body)));
  return data.e > Date.now() ? data.r : null;
}

// si torna solo a pagine delle origini ammesse (niente redirect verso siti qualsiasi)
function allowedReturn(env, ret) {
  try {
    const url = new URL(ret);
    const origins = String(env.ALLOWED_ORIGINS || "").split(",").map((o) => o.trim()).filter(Boolean);
    return origins.includes(url.origin) ? url.origin + url.pathname : null;
  } catch {
    return null;
  }
}

const back = (ret, key, value) => Response.redirect(ret + "#" + key + "=" + value, 302);
const text = (body, status) => new Response(body, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const redirectUri = url.origin + "/callback";

    if (url.pathname === "/login") {
      const ret = allowedReturn(env, url.searchParams.get("return"));
      if (!ret) return text("Pagina di ritorno non ammessa", 400);
      const auth = new URL(API + "/oauth/authorize");
      auth.search = new URLSearchParams({
        client_id: env.FT_UID, redirect_uri: redirectUri, response_type: "code", scope: "public", state: await makeState(env, ret),
      }).toString();
      return Response.redirect(auth.toString(), 302);
    }

    if (url.pathname === "/callback") {
      const ret = await readState(env, url.searchParams.get("state")).catch(() => null);
      if (!ret || !allowedReturn(env, ret)) return text("Login scaduto o non valido: torna alla pagina e riprova", 400);
      const code = url.searchParams.get("code");
      if (!code) return back(ret, "intra-error", encodeURIComponent(url.searchParams.get("error") || "accesso negato"));

      const tok = await fetch(API + "/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code", client_id: env.FT_UID, client_secret: env.FT_SECRET, code, redirect_uri: redirectUri,
        }),
      });
      if (!tok.ok) return back(ret, "intra-error", encodeURIComponent("login non riuscito (HTTP " + tok.status + ")"));
      const { access_token } = await tok.json();

      const res = await fetch(API + "/v2/me", { headers: { Authorization: "Bearer " + access_token } });
      if (!res.ok) return back(ret, "intra-error", encodeURIComponent("profilo non leggibile (HTTP " + res.status + ")"));
      const me = await res.json();

      // solo quello che serve alla pagina: slug -> [stato, voto]
      const p = {};
      for (const pu of me.projects_users || []) {
        const s = statusOf(pu), slug = pu.project?.slug;
        if (s && slug) p[slug] = [s, s === "d" && typeof pu.final_mark === "number" ? pu.final_mark : null];
      }
      const cursus = (me.cursus_users || []).find((c) => c.cursus_id === CURSUS_42);
      const data = {
        login: me.login,
        date: new Date().toISOString().slice(0, 10),
        level: typeof cursus?.level === "number" ? cursus.level : null,
        p,
      };
      return back(ret, "intra", b64urlText(JSON.stringify(data)));
    }

    return text("RNCP Calculator: accesso con 42. Si usa dalla pagina, con il pulsante \"Accedi con 42\".", 404);
  },
};
