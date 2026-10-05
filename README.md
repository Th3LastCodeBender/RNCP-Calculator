# RNCP Calculator

Pagina per studenti di 42 (42cursus): scegli i progetti che hai fatto o vuoi fare e vedi subito se coprono i blocchi del titolo **RNCP 6** o **RNCP 7**, quanti XP mancano e quanto tempo ti serve.

## Come si usa

Scarica il repository (`git clone` oppure *Code → Download ZIP*) e apri **`piano-rncp6.html`** nel browser. Non serve installare niente.

- In cima scegli il titolo (RNCP 6 o RNCP 7) e l'opzione, oppure **Masteries**: tutti i progetti dell'holy graph fuori dal common core, divisi per i layer dell'intra (un progetto con più layer compare in ognuno), con quanti ne hai scelti e gli XP per layer. Nelle card delle Masteries c'è in quali blocchi RNCP conta il progetto. Nei titoli RNCP: i riquadri mostrano progetti e XP per ogni blocco. La barra piena sono i progetti fatti, quella chiara il resto del piano. Un blocco coperto dal piano ha il bordo verde e la ✓ vuota; quando è validato con i progetti fatti diventa tutto verde.
- Clicca una card per scegliere il progetto, poi segna lo stato: **Da fare** (blu), **In corso** (ambra) o **Fatto** (verde). Un altro clic sulla card lo toglie dal piano. Ogni card dice in quali altri blocchi conta, anche nell'altro titolo.
- **Requisiti comuni**: sotto i blocchi scrivi livello attuale, eventi ed esperienze professionali. Gli stage segnati come fatti (Work Experience I e II, Startup Experience, Part Time I e II) contano da soli tra le esperienze e quelli nel piano alzano la barra chiara: nel campo vanno solo le esperienze validate che non sono nella pagina. Il livello col piano somma gli XP dei progetti scelti non ancora fatti; in alto a destra c'è l'ETA, la data di fine stimata (i dettagli passando sopra).
- Filtri: ricerca, da solo o in gruppo, solo i progetti scelti, categorie (i layer dell'holy graph: Algo & AI & Data, Security, Devops & Network, Web & Mobile, System & Kernel, Graphics & Gaming, Cryptography & Maths, Development, Professional Experience). Le scelte valgono per entrambi i titoli: un progetto del 6 già scelto conta anche nei blocchi del 7. Nell'RNCP 7 un blocco già completo mostra solo i progetti scelti; "Mostra tutti" fa vedere anche gli altri.
- **Ore al giorno**: quante ore lavori in una giornata. I giorni stimati sono le ore indicate dall'intra divise per questo numero, con sabato e domenica liberi.
- Il piano resta salvato nel browser. Con **Salva** e **Carica**, in alto a destra, lo salvi in un file JSON e lo ricarichi; **Esporta** lo esporta in Markdown o PDF (il PDF ha anche una linea del tempo dei progetti non ancora fatti).
- **Accedi con 42**: sul sito pubblicato, il pulsante sopra i requisiti comuni porta al login dell'intra e torna con i tuoi progetti fatti e in corso, i voti, il livello e gli eventi. Gli eventi sono le iscrizioni a eventi già finiti: l'API non dice se eri presente, quindi correggi il numero a mano se serve. Ognuno vede solo i propri dati. Funziona tramite un Cloudflare Worker: come metterlo online è spiegato in [`worker/README.md`](worker/README.md).
- **Provare in locale**: `npm run serve` apre la pagina su http://localhost:4242, dove funziona anche **Accedi con 42**. Senza login: `npm run me -- <login>` scrive `piano-intra.json`, da caricare con **Carica**: la pagina lo riconosce e lo unisce al piano invece di sostituirlo (il file contiene dati tuoi ed è escluso dal repository).

Ogni card ha il link al **subject** ufficiale (PDF pubblico sul CDN di 42) e alla pagina del progetto sull'intra.

## Da dove vengono i dati

Aggiornati a ottobre 2026:

- **Masteries e layer**: holy graph e menu dei layer dell'intra (`project_data.json` e pagina del graph).
- **Blocchi e minimi**: liste ufficiali RNCP della pagina dell'intra, copiate in [`lists/official/`](lists/official/).
- **XP, ore stimate, dimensione dei team, link ai subject**: API di 42 e pagine dei progetti sull'intra.
- **Descrizioni e linguaggi**: scritti a mano leggendo i subject.

Alcuni progetti delle liste RNCP 7 hanno la pagina dell'intra riservata (risponde 403) e non sono nella pagina: Active Discovery, Automatic Directory, Administrative Directory, Accessible Directory, Active Connect, MicroForensX, ActiveTechTales, tinky-winkey e la Piscine Machine Learning (deprecata). Per lo stesso motivo nelle Masteries manca ft_kalman. Gli stage hanno gli slug attuali dell'intra (Work Experience I e II, Startup Experience, Part Time I e II): i vecchi `internship-i`, `internship-ii` e `42cursus-startup-internship` danno 404.

Gli XP sono quelli a voto 100, tranne per i progetti fatti importati dall'intra, che scalano col voto (125 = +25%). Requisiti comuni: livello 17 per l'RNCP 6 e 21 per l'RNCP 7 (tabella XP dei livelli dall'API di 42, tramite il dataset di 42calculator), eventi ed esperienze professionali. In caso di dubbio fa fede la pagina RNCP dell'intra.

## Per chi vuole modificarla

Serve [Node.js](https://nodejs.org/) 22.9 o successivo.

```bash
npm install      # installa TypeScript
npm run build    # compila src/ in script.js e aggiorna le versioni dei file
npm run version  # solo le versioni: dopo aver cambiato style.css
```

Si modificano solo i file in `src/`: `script.js` viene rigenerato dalla build (tsc unisce i file in un solo script) ed è nel repository perché la pagina funzioni senza compilare.

In `piano-rncp6.html` CSS e script hanno un `?v=` con l'impronta del file: GitHub Pages li tiene in cache per 10 minuti e senza versione il browser può unire l'HTML nuovo a uno `script.js` vecchio (pagina vuota). La build lo aggiorna da sola; dopo aver toccato solo `style.css` serve `npm run version` prima del push.

| File | Contenuto |
| --- | --- |
| `piano-rncp6.html` | struttura della pagina |
| `src/data.ts` | progetti, blocchi, categorie e titoli |
| `src/state.ts` | stato della pagina e salvataggio nel browser |
| `src/calc.ts` | calcoli: XP, livelli, giorni, copertura dei blocchi, filtri |
| `src/view.ts` | barre, requisiti comuni, card, blocchi e filtri |
| `src/plan-file.ts` | Salva e Carica (file JSON) |
| `src/intra.ts` | import dall'intra e "Accedi con 42" |
| `src/export.ts` | esportazione in Markdown e PDF |
| `style.css` | stile, tema chiaro e scuro, stampa |
| `hours.js` | ore stimate dall'intra, generato da `npm run hours` |
| `tools/` | script per aggiornare e verificare i dati |
| `worker/` | Cloudflare Worker per "Accedi con 42" |

### Aggiornare i dati

Gli script in [`tools/`](tools/) leggono XP, ore, team e subject dall'intra. Hanno bisogno di un file `.env` con le **tue** credenziali dell'intra (app OAuth e cookie di sessione): come crearlo è spiegato in [`tools/README.md`](tools/README.md). Il file `.env` non va mai condiviso né caricato nel repository.

| Comando | Cosa fa |
| --- | --- |
| `npm run serve` | apre la pagina su http://localhost:4242, con **Accedi con 42** funzionante |
| `npm run me -- <login>` | scrive `piano-intra.json` con i tuoi progetti fatti e in corso, i voti e il livello, da importare nella pagina |
| `npm run info` | scarica XP, ore, team e link ai subject e segnala le differenze con `src/data.ts` |
| `npm run hours` | rigenera `hours.js` |
| `npm run subjects` | scarica i PDF dei subject in `subjects/` (non inclusi nel repository) |
| `npm run subjects:summary` | estrae dai PDF le righe su linguaggi, team e vincoli |
| `npm run rncp` | liste dei blocchi dal dataset di [42calculator](https://github.com/lucas-ht/42calculator) |

I PDF dei subject sono materiale di 42: si scaricano per uso personale ma non vanno ripubblicati.
