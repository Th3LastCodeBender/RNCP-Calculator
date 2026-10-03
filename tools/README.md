# Strumenti per raccogliere informazioni sui progetti di 42

Script Node (versione 22.9 o successiva, per `--env-file-if-exists`; nessuna dipendenza) per ottenere XP, ore stimate, dimensione dei team, descrizioni ufficiali e PDF dei subject dei progetti di 42cursus. Servono per tenere aggiornata la pagina del Piano RNCP (titoli 6 e 7), ma funzionano su qualsiasi elenco di progetti: altre mastery, RNCP 7, l'intero cursus.

## Da dove vengono i dati

| Fonte | Cosa dà | Cosa serve |
| --- | --- | --- |
| API di 42 (`api.intra.42.fr`) | XP, ore stimate, solo/gruppo, obiettivi, descrizione ufficiale | `FT_UID` e `FT_SECRET` |
| Pagine dell'intra (`projects.intra.42.fr`) | dimensione dei team ("between 3 and 4 students"), link ai PDF dei subject | `INTRA_COOKIE` |
| CDN dell'intra (`cdn.intra.42.fr`) | i PDF dei subject | niente, è pubblico |
| Dataset di [42calculator](https://github.com/lucas-ht/42calculator) | titoli RNCP 6 e 7 con blocchi e minimi, moduli delle piscine | niente, è pubblico |

Alcune pagine dell'intra rispondono 403 anche con un cookie valido (ottobre 2026: Active Discovery, Automatic Directory, Administrative Directory, Accessible Directory, Active Connect, ActiveTechTales, MicroForensX, tinky-winkey, Piscine Machine Learning). Gli script le saltano e usano solo l'API: per quei progetti mancano dimensione del team e subject.

Con lo scope `public` l'API **non** dà la dimensione dei team (`max_people` è sempre vuoto) né i PDF (`/v2/attachments` risponde con una lista vuota). Per questo serve anche il cookie dell'intra.

Il dataset di 42calculator è mantenuto da terzi e può essere indietro rispetto all'intra: nell'ottobre 2026, per esempio, mancavano libftpp, abstract_data, RetroEmu e ft_select/ft_script nei blocchi RNCP 6. Per i blocchi fa fede la pagina RNCP dell'intra.

## Configurazione: il file `.env`

Nella cartella del progetto, accanto a `package.json`:

```
FT_UID=...
FT_SECRET=...
INTRA_COOKIE=...
```

- **`FT_UID` e `FT_SECRET`**: crea un'app su https://profile.intra.42.fr/oauth/applications. Come redirect URI va bene `http://localhost`; basta lo scope `public`. Copia UID e SECRET.
- **`INTRA_COOKIE`**: apri https://projects.intra.42.fr con il login fatto, premi F12 e vai in *Application* (su Firefox *Archiviazione*), poi *Cookies* e `https://projects.intra.42.fr`. Copia il valore di `_intra_42_session_production`. Scade dopo un po': quando uno script dice che è scaduto, ripeti questi passi.

Il file `.env` dà accesso al tuo account: **non condividerlo mai**.

## Scegliere i progetti

Tutti gli script (tranne `rncp`) accettano la stessa scelta dei progetti:

| Argomento | Progetti |
| --- | --- |
| *(niente)* | quelli della pagina, letti da `script.ts` |
| `slug1 slug2 ...` | gli slug indicati, per esempio `42cursus-matcha nm` |
| `--file lista.txt` | uno slug per riga; righe vuote e commenti `#` vengono ignorati |
| `--cursus 21` | tutti i progetti di un cursus (21 = 42cursus, quasi 500 progetti) |
| `--children` | in aggiunta: anche i sotto-progetti, come i moduli delle piscine |

Lo slug è l'ultima parte dell'indirizzo del progetto sull'intra: `projects.intra.42.fr/projects/42cursus-matcha` diventa `42cursus-matcha`.

Gli argomenti si passano dopo `--`: `npm run info -- --file lista.txt`.

## Comandi

### `npm run serve`: la pagina con l'import dall'intra

Avvia un server su http://localhost:4242 (`--port` per cambiarla) che serve la pagina e risponde a `/api/me?login=<login>` con gli stessi dati di `npm run me`. La pagina se ne accorge e mostra il campo **Login intra**. Il server ascolta solo su `127.0.0.1`, serve solo i file della cartella principale (mai `.env` né sottocartelle) e tiene le credenziali per sé. Senza `FT_UID` e `FT_SECRET` la pagina funziona, ma il campo è disattivato.

### `npm run me`: i tuoi progetti dall'intra

```
npm run me -- <login>
```

Legge dall'API il tuo profilo (bastano `FT_UID` e `FT_SECRET`; il login si può mettere anche in `.env` come `INTRA_LOGIN`) e scrive `piano-intra.json` con i progetti della pagina che hai validato (con il voto) o che hai in corso, e il tuo livello nel 42cursus. Le piscine a moduli contano come fatte quando sono validati tutti i moduli (`children` in `data/info.json`). Nella pagina si importa da *Esporta → Importa dall'intra*. `--out altro.json` cambia il file di destinazione. Il file contiene dati personali ed è nel `.gitignore`.

### `npm run rncp`: liste dei titoli RNCP

Scarica il dataset di 42calculator e crea una lista di progetti per ogni blocco di ogni titolo RNCP 6 e 7:

```
lists/rncp/rncp-7-systeme-d-information-et-reseaux/security.txt
lists/rncp/rncp-7-architecture-des-bases-de-donnees-et-data/artificial-intelligence.txt
lists/rncp/suite.txt
...
```

In testa a ogni lista ci sono i minimi del blocco (XP e numero di progetti). `data/rncp.json` contiene tutto in un unico file. `--refresh` riscarica il dataset.

Le liste in `lists/rncp/` vengono rigenerate da zero a ogni avvio. Le liste copiate dalla pagina RNCP dell'intra stanno invece in `lists/official/`, che `npm run rncp` non tocca, e vanno preferite quando ci sono. Nell'ottobre 2026 ci sono quelle dell'RNCP 6 e dell'RNCP 7, ognuna con la sua Suite (`rncp-6-suite.txt`, `rncp-7-suite.txt`). La pagina coincide con le liste ufficiali dell'RNCP 6 e dell'RNCP 7.

Confrontate con le liste ufficiali dell'RNCP 7 (ottobre 2026), quelle del dataset:

- non hanno i progetti più recenti: filesystem, userspace_digressions, drivers-and-interrupts, process-and-memory, RetroEmu, ft_select e ft_script in Unix/Kernel; Inception of Context, Inception of Wisdom e ft_lgtm in System administration; tinky-winkey in Security; la Piscine Machine Learning in AI;
- hanno GBmu in Unix/Kernel, che nella lista ufficiale non c'è;
- usano slug che sull'intra non esistono più per le piscine Symfony e Rails: quelli giusti sono `piscine-symfony` e `piscine-ror`.

### `npm run info`: informazioni sui progetti

Per ogni progetto salva in `data/info.json` XP, ore stimate, team `[min, max]`, obiettivi, descrizione ufficiale, sotto-progetti e link al subject. Il file viene aggiornato, non sostituito. `--out altro.json` cambia il file di destinazione.

Sui progetti della pagina confronta anche XP, persone e PDF del subject (campo `pdf`) con `script.ts` e stampa le differenze. Non modifica `script.ts`.

### `npm run subjects`: PDF dei subject

Salva i PDF in `subjects/<slug>.pdf`, con un indice in `subjects/index.json`. I PDF già presenti vengono saltati.

- `--force`: riscarica tutto.
- `--lang fr`: preferisce il subject in francese.
- `--modules`: scarica anche i moduli, in `subjects/<slug>/<modulo>.pdf`. Utile per le piscine, il cui PDF principale è solo una presentazione.

I PDF sono materiale di 42: puoi tenerli per te e per i compagni, ma non ripubblicarli.

### `npm run subjects:summary`: controllo dei subject

Estrae il testo dei PDF scaricati in `subjects/text/` e stampa per ognuno versione, riassunto e righe su linguaggi ammessi, lavoro di gruppo e librerie consentite. Il riepilogo finisce in `data/subjects-summary.json`. È il controllo usato per verificare descrizioni e linguaggi della pagina. Le righe sono scelte automaticamente: in caso di dubbio leggi il testo completo.

Richiede `pdftotext` (pacchetto `poppler-utils`). `--quiet` stampa solo il totale.

### `npm run hours`: ore per la pagina

Riscrive `hours.js`, il file con le ore stimate che la pagina carica. Va rilanciato quando si aggiungono progetti a `script.ts`.

## Esempi

Tutti i progetti di un blocco RNCP 7, con subject e controllo:

```bash
npm run rncp
npm run info -- --file lists/rncp/rncp-7-systeme-d-information-et-reseaux/security.txt --out data/rncp7-security.json
npm run subjects -- --file lists/rncp/rncp-7-systeme-d-information-et-reseaux/security.txt
npm run subjects:summary
```

Una mastery o un gruppo di progetti scelto a mano:

```bash
# lists/mia-mastery.txt
#   42cursus-ft_transcendence
#   42cursus-webserv
npm run info -- --file lists/mia-mastery.txt --out data/mia-mastery.json
```

Tutto 42cursus. È lungo: circa 500 richieste all'API e altrettante pagine dell'intra, una al secondo.

```bash
npm run info -- --cursus 21 --out data/cursus-21.json
```

## Struttura

```
tools/
  lib/api42.mjs        login e richieste all'API (limite 2 al secondo, ripetizione sui 429)
  lib/intra.mjs        pagine dell'intra con il cookie, lettura di team, ore, XP e link ai PDF
  lib/dataset.mjs      dataset di 42calculator, salvato in data/42calculator/
  lib/projects.mjs     argomenti comuni e scelta dei progetti
  fetch-info.mjs       npm run info
  fetch-subjects.mjs   npm run subjects
  subjects-summary.mjs npm run subjects:summary
  fetch-hours.mjs      npm run hours
  rncp-lists.mjs       npm run rncp
```

Se 42 cambia l'aspetto delle pagine dell'intra, la parte da adattare è `parseProjectPage` in `lib/intra.mjs`.
