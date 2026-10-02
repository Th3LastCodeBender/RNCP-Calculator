# Piano RNCP 6 e 7

Pagina per studenti di 42 (42cursus): scegli i progetti che hai fatto o vuoi fare e vedi subito se coprono i blocchi del titolo **RNCP 6** o **RNCP 7**, quanti XP mancano e quanto tempo ti serve.

## Come si usa

Scarica il repository (`git clone` oppure *Code → Download ZIP*) e apri **`piano-rncp6.html`** nel browser. Non serve installare niente.

- In cima scegli il titolo (RNCP 6 o RNCP 7) e l'opzione: i riquadri mostrano progetti e XP per ogni blocco, e diventano verdi con ✓ quando il blocco è coperto.
- Clicca una card per scegliere il progetto. Ogni card dice in quali altri blocchi conta, anche nell'altro titolo.
- Filtri: ricerca, da solo o in gruppo, solo i progetti scelti, categorie (Web, Kernel, IA/Data…). Nell'RNCP 7 i progetti in comune con l'RNCP 6 sono nascosti: si vedono spuntando "Mostra RNCP 6".
- **Ore al giorno**: quante ore lavori in una giornata. I giorni stimati sono le ore indicate dall'intra divise per questo numero, con sabato e domenica liberi.
- Il piano resta salvato nel browser. Dal pulsante **Esporta** puoi salvarlo in un file JSON e ricaricarlo, oppure esportarlo in Markdown o PDF (il PDF ha anche una linea del tempo).

Ogni card ha il link al **subject** ufficiale (PDF pubblico sul CDN di 42) e alla pagina del progetto sull'intra.

## Da dove vengono i dati

Aggiornati a ottobre 2026:

- **Blocchi e minimi**: liste ufficiali RNCP della pagina dell'intra, copiate in [`lists/official/`](lists/official/).
- **XP, ore stimate, dimensione dei team, link ai subject**: API di 42 e pagine dei progetti sull'intra.
- **Descrizioni e linguaggi**: scritti a mano leggendo i subject.

Per alcuni progetti RNCP 7 la pagina dell'intra non è accessibile (Active Discovery, tinky-winkey e altri): per loro mancano subject e dimensione del team, e la descrizione viene dall'API.

Gli XP sono quelli a voto 100. Requisiti comuni non tracciati dalla pagina: livello (17 per l'RNCP 6, 21 per l'RNCP 7), eventi ed esperienze professionali. In caso di dubbio fa fede la pagina RNCP dell'intra.

## Per chi vuole modificarla

Serve [Node.js](https://nodejs.org/) 22.9 o successivo.

```bash
npm install      # installa TypeScript
npm run build    # compila script.ts in script.js
```

Si modifica solo `script.ts` (dati dei progetti e logica): `script.js` viene rigenerato dalla build ed è nel repository perché la pagina funzioni senza compilare.

| File | Contenuto |
| --- | --- |
| `piano-rncp6.html` | struttura della pagina |
| `script.ts` | progetti, blocchi, titoli e logica |
| `style.css` | stile, tema chiaro e scuro, stampa |
| `hours.js` | ore stimate dall'intra, generato da `npm run hours` |
| `tools/` | script per aggiornare e verificare i dati |

### Aggiornare i dati

Gli script in [`tools/`](tools/) leggono XP, ore, team e subject dall'intra. Hanno bisogno di un file `.env` con le **tue** credenziali dell'intra (app OAuth e cookie di sessione): come crearlo è spiegato in [`tools/README.md`](tools/README.md). Il file `.env` non va mai condiviso né caricato nel repository.

| Comando | Cosa fa |
| --- | --- |
| `npm run info` | scarica XP, ore, team e link ai subject e segnala le differenze con `script.ts` |
| `npm run hours` | rigenera `hours.js` |
| `npm run subjects` | scarica i PDF dei subject in `subjects/` (non inclusi nel repository) |
| `npm run subjects:summary` | estrae dai PDF le righe su linguaggi, team e vincoli |
| `npm run rncp` | liste dei blocchi dal dataset di [42calculator](https://github.com/lucas-ht/42calculator) |

I PDF dei subject sono materiale di 42: si scaricano per uso personale ma non vanno ripubblicati.
