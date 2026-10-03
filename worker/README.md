# "Accedi con 42": Cloudflare Worker

La pagina su GitHub Pages è statica e non può contenere le credenziali dell'app 42. Questo Worker fa da intermediario per il login OAuth:

1. la pagina manda a `/login`, il Worker rimanda al login dell'intra;
2. l'intra torna a `/callback` con un codice; il Worker lo scambia con un token usando `FT_SECRET`;
3. il Worker legge `/v2/me` (solo i dati di chi ha fatto il login) e torna alla pagina con progetti fatti e in corso, voti e livello nel frammento dell'indirizzo (`#intra=…`).

Il token si usa una volta e non viene salvato né mandato alla pagina. Il frammento non arriva a nessun server, e la pagina lo cancella subito dall'indirizzo.

## Messa online (una volta)

Servono un account Cloudflare (gratuito) e Node.js.

1. **Login a Cloudflare**, da questa cartella:
   ```bash
   cd worker
   npx wrangler login
   ```
2. **Pubblica il Worker**:
   ```bash
   npm run deploy
   ```
   Alla fine stampa l'indirizzo, per esempio `https://rncp-calculator.<tuo-account>.workers.dev`.
3. **Aggiungi il redirect URI all'app 42**: su https://profile.intra.42.fr/oauth/applications apri l'app (la stessa del `.env`), e in *Redirect URI* aggiungi su una nuova riga:
   ```
   https://rncp-calculator.<tuo-account>.workers.dev/callback
   ```
4. **Salva UID e SECRET dell'app come secret del Worker** (te li chiede, non finiscono nel repository):
   ```bash
   npx wrangler secret put FT_UID
   npx wrangler secret put FT_SECRET
   ```
5. **Collega la pagina**: in `piano-rncp6.html` scrivi l'indirizzo del Worker in `data-auth` e pubblica su GitHub:
   ```html
   <div class="intra" id="auth-box" data-auth="https://rncp-calculator.<tuo-account>.workers.dev" hidden>
   ```

Le pagine a cui il Worker può tornare sono in `ALLOWED_ORIGINS` (`wrangler.toml`): GitHub Pages e `localhost:4242`. Se pubblichi la pagina altrove, aggiungi l'origine lì e ripeti `npm run deploy`.

## Limiti

- L'API di 42 accetta 2 richieste al secondo e 1200 all'ora per app. Ogni accesso ne usa 2 (token e profilo), quindi circa 600 accessi all'ora.
- Il piano gratuito di Cloudflare Workers arriva a 100 000 richieste al giorno.
- `npm run logs` mostra in diretta le richieste e gli errori del Worker.
