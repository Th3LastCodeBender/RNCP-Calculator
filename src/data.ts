/* Dati della pagina: progetti, blocchi, categorie e titoli. Niente logica qui.
 * tools/lib/projects.mjs legge PROJECTS con una regex: ogni progetto resta su una riga, con i campi in quest'ordine. */

// blocchi RNCP 6: suite, web, mobile, oop, fun, imp · RNCP 7: suite (la stessa lista), unix, sys, sec, webdb, ai
type BlockId = "suite" | "web" | "mobile" | "oop" | "fun" | "imp" | "unix" | "sys" | "sec" | "webdb" | "ai";
type TitleId = 6 | 7;
type OptionId = 1 | 2;
type Tag = "web" | "mobile" | "gfx" | "game" | "net" | "low" | "devops" | "sec" | "ai" | "oop" | "func" | "math";
// stato di un progetto scelto: da fare, in corso o fatto (validato)
type Status = "todo" | "doing" | "done";

interface Project {
  id: string;
  name: string;
  slug: string; // slug dell'intra: pagina del progetto e ore in hours.js
  lang: string; // linguaggio, indicativo ("Libero" = a scelta)
  xp: number | null; // XP a voto 100 (null = non disponibile)
  people: [min: number, max: number] | null;
  blocks: BlockId[]; // blocchi in cui il progetto conta (nessuno per gli stage)
  tags: Tag[]; // categorie per i filtri
  pdf: number | null; // id del subject sul CDN di 42 (null = non disponibile)
  desc: string;
}

interface Block {
  name: string;
  minXp: number;
  minN: number; // progetti minimi
}

interface Title {
  name: string;
  level: number; // livello minimo nel 42cursus
  events: number; // eventi minimi
  exps: number; // esperienze professionali minime
  options: Record<OptionId, { name: string; blocks: BlockId[] }>;
}

const PROJECTS: Project[] = [
  // Suite
  { id: "42sh", name: "42sh", slug: "42cursus-42sh", lang: "C", xp: 15750, people: [4, 5], blocks: ["suite"], tags: ["low"], pdf: 215874, desc: "Shell Unix completa in gruppo: pipe, redirezioni, editing di linea con termcaps, history, job control (jobs, fg, bg, &), inibitori, globbing, subshell, alias e builtin. Il grande seguito di minishell." },
  { id: "badass", name: "BADASS", slug: "bgp-at-doors-of-autonomous-systems-is-simple", lang: "Shell · GNS3", xp: 22450, people: [2, 3], blocks: ["suite", "sys"], tags: ["net", "devops"], pdf: 211017, desc: "Rete simulata con GNS3 e immagini Docker: configuri router FRRouting e realizzi VXLAN con BGP EVPN per collegare più reti come in un datacenter. Seguito di NetPractice." },
  { id: "doom", name: "DoomNukem", slug: "42cursus-doom-nukem", lang: "C", xp: 15750, people: [3, 4], blocks: ["suite"], tags: ["gfx", "game"], pdf: 210723, desc: "Motore 3D in stile Doom in C, senza accelerazione hardware né librerie 3D: raycasting avanzato, stanze con soffitti di altezze diverse, texture, luci, HUD, nemici, suoni e musica, più un editor di livelli obbligatorio. Seguito di cub3d." },
  { id: "iot", name: "Inception of Things", slug: "inception-of-things", lang: "Kubernetes · Vagrant", xp: 25450, people: [2, 3], blocks: ["suite", "sys"], tags: ["net", "devops"], pdf: 224141, desc: "Infrastruttura Kubernetes in tre parti: cluster K3s con Vagrant, app esposte tramite ingress, poi K3d con Argo CD per il deploy continuo da un repository Git. Seguito di Inception." },
  { id: "humangl", name: "HumanGL", slug: "42cursus-humangl", lang: "Libero", xp: 4200, people: [2, 2], blocks: ["suite"], tags: ["gfx"], pdf: 217474, desc: "Modello umano animato in OpenGL moderno che cammina, salta e sta fermo: costruisci a mano lo stack di matrici e la gerarchia delle parti del corpo. Linguaggio e libreria grafica a scelta. Seguito di scop." },
  { id: "kfs2", name: "kfs-2", slug: "42cursus-kfs-2", lang: "Libero + ASM", xp: 15750, people: [2, 2], blocks: ["suite", "imp", "unix"], tags: ["low"], pdf: 208608, desc: "Secondo passo del kernel da zero: Global Descriptor Table, stack del kernel, uno strumento per stamparlo in modo leggibile e una piccola shell di debug. Seguito di kfs-1." },
  { id: "override", name: "Override", slug: "42cursus-override", lang: "ASM (reverse)", xp: 35700, people: [2, 2], blocks: ["suite", "imp", "sec"], tags: ["low", "sec"], pdf: 221873, desc: "Ramo sicurezza, seguito diretto di Rainfall e di livello superiore: dieci livelli in gruppo su una macchina virtuale con le protezioni moderne attive, più un livello bonus." },
  { id: "pestilence", name: "Pestilence", slug: "42cursus-pestilence", lang: "C · ASM", xp: 15750, people: [2, 2], blocks: ["suite", "imp", "sec"], tags: ["low", "sec"], pdf: 208626, desc: "Ramo sicurezza, seguito di Famine: studio approfondito del formato dei binari e delle tecniche di analisi. Obiettivi e vincoli nel subject." },
  { id: "rt", name: "RT", slug: "42cursus-rt", lang: "C, C++ o Rust", xp: 20750, people: [3, 4], blocks: ["suite"], tags: ["gfx"], pdf: 210513, desc: "Raytracer completo in gruppo, in C, C++ o Rust: luci multiple con ombre, luce ambiente e direzionale, riflessi, trasparenza, texture e oggetti composti. Seguito di miniRT." },
  { id: "tpv", name: "Total perspective vortex", slug: "42cursus-total-perspective-vortex", lang: "Python", xp: 9450, people: [1, 1], blocks: ["suite", "ai"], tags: ["ai"], pdf: 209510, desc: "Interfaccia cervello-computer: elabori segnali EEG con MNE, estrai le feature, costruisci una pipeline scikit-learn e classifichi in tempo reale i movimenti immaginati. Seguito di dslr." },

  // Piscine
  { id: "symfony", name: "Piscine PHP Symfony", slug: "piscine-symfony", lang: "PHP", xp: 9450, people: [1, 1], blocks: ["web", "oop", "webdb"], tags: ["web", "oop"], pdf: 209481, desc: "Piscine su PHP e Symfony divisa in moduli: basi del web e della programmazione a oggetti in PHP, Composer, primi passi con Symfony, SQL e ORM, sessioni, concetti avanzati e progetto finale." },
  { id: "django", name: "Piscine Python Django", slug: "piscine-django", lang: "Python", xp: 9450, people: [1, 1], blocks: ["web", "oop", "webdb"], tags: ["web"], pdf: 210657, desc: "Piscine su Python e Django divisa in moduli: basi del web e di Python, librerie, primi passi con Django, SQL e ORM, sessioni, concetti avanzati e progetto finale." },
  { id: "ror", name: "Piscine Ruby on Rails", slug: "piscine-ror", lang: "Ruby", xp: 9450, people: [1, 1], blocks: ["web", "oop", "webdb"], tags: ["web"], pdf: 210088, desc: "Piscine su Ruby e Rails divisa in moduli: basi del web e di Ruby, gem, primi passi con Rails, SQL, sessioni, concetti avanzati e progetto finale." },
  { id: "pmobile", name: "Piscine Mobile", slug: "mobile", lang: "Libero (mobile)", xp: 9450, people: [1, 1], blocks: ["mobile", "oop"], tags: ["mobile"], pdf: 212922, desc: "Piscine di sviluppo mobile: struttura e navigazione di un'app, chiamate ad API esterne, layout responsive, autenticazione e salvataggio dati, fino a un progetto finale." },
  { id: "pobject", name: "Piscine Object", slug: "piscine-object", lang: "C++", xp: 9450, people: [1, 1], blocks: ["oop"], tags: ["oop"], pdf: 210719, desc: "Piscine sulla programmazione a oggetti in C++: incapsulamento, relazioni tra classi, UML, principi SOLID e i design pattern più usati, applicati a esercizi concreti." },
  { id: "ocaml", name: "Piscine OCaml", slug: "42cursus-piscine-ocaml", lang: "OCaml", xp: 9450, people: [1, 1], blocks: ["fun"], tags: ["func"], pdf: 208548, desc: "Piscine OCaml: sintassi, ricorsione e funzioni di ordine superiore, pattern matching e tipi, moduli e funtori, parti imperative e a oggetti, fino a monoidi e monadi. Ottima base per il blocco Functional." },

  // Web
  { id: "camagru", name: "Camagru", slug: "42cursus-camagru", lang: "Libero (solo lib. standard)", xp: 4200, people: [1, 1], blocks: ["web", "oop", "webdb"], tags: ["web"], pdf: 203658, desc: "Web app per foto in stile Instagram: scatto da webcam o upload, sovrapposizione di immagini lato server, gallery pubblica, like, commenti e gestione account. Lato server niente framework: solo ciò che esiste nella libreria standard di PHP." },
  { id: "matcha", name: "Matcha", slug: "42cursus-matcha", lang: "Libero", xp: 9450, people: [2, 2], blocks: ["web", "oop", "webdb"], tags: ["web"], pdf: 227569, desc: "Sito di incontri completo: profili con foto e interessi, ricerca e suggerimenti per affinità e distanza, geolocalizzazione, chat e notifiche in tempo reale." },
  { id: "hypertube", name: "Hypertube", slug: "42cursus-hypertube", lang: "Libero", xp: 15750, people: [2, 4], blocks: ["web", "oop", "webdb"], tags: ["web", "net"], pdf: 209673, desc: "Piattaforma di streaming in gruppo: cerchi un film su fonti esterne, il server lo scarica via BitTorrent e lo riproduce nel browser mentre scarica. Login OAuth, sottotitoli e API REST." },
  { id: "redtetris", name: "Red Tetris", slug: "42cursus-red-tetris", lang: "JavaScript", xp: 15750, people: [2, 2], blocks: ["web", "oop", "webdb"], tags: ["web", "game", "net"], pdf: 211093, desc: "Tetris multiplayer in tempo reale: stanze di gioco, linee penalità agli avversari, frontend React, server Node con socket e una copertura di test minima obbligatoria." },
  { id: "darkly", name: "Darkly", slug: "42cursus-darkly", lang: "Sicurezza web", xp: 6300, people: [2, 2], blocks: ["web", "oop", "imp", "sec", "webdb"], tags: ["web", "sec"], pdf: 221875, desc: "Introduzione alla sicurezza web: su un sito di prova volutamente fragile individui i problemi più comuni, spieghi come funzionano e come si correggono." },
  { id: "h42n42", name: "h42n42", slug: "42cursus-h42n42", lang: "OCaml", xp: 9450, people: [1, 1], blocks: ["web", "oop", "fun", "webdb"], tags: ["web", "game", "func"], pdf: 209576, desc: "Simulazione nel browser in OCaml con Ocsigen ed Eliom: una popolazione di creature minacciata da un virus, che salvi spostandole con il mouse. Lo stesso codice gira su client e server." },
  { id: "tokenizer", name: "Tokenizer", slug: "tokenizer", lang: "Libero (es. Solidity)", xp: 9450, people: [1, 1], blocks: ["web", "webdb"], tags: ["web"], pdf: 211049, desc: "Primo progetto Web3: crei il tuo token su una blockchain pubblica a scelta (per esempio BNB Chain), rispettandone lo standard (ERC-20 o equivalente), lo pubblichi e documenti scelte tecniche e funzionamento." },
  { id: "tokenizeart", name: "TokenizeArt", slug: "tokenizeart", lang: "Libero (es. Solidity)", xp: 9450, people: [1, 1], blocks: ["web", "webdb"], tags: ["web"], pdf: 214858, desc: "Crei e pubblichi un NFT su una blockchain pubblica a scelta, rispettandone lo standard (ERC-721 o equivalente): smart contract, metadati e immagine su storage decentralizzato come IPFS, più la documentazione." },
  { id: "musicroom", name: "Music Room", slug: "42cursus-music-room", lang: "Libero (mobile) + back-end libero", xp: 25200, people: [2, 4], blocks: ["web", "mobile", "webdb"], tags: ["web", "mobile"], pdf: 209570, desc: "Soluzione mobile completa in gruppo, per Android o iOS con la tecnologia che preferisci: voto dei brani in diretta, delega del controllo della musica e playlist modificabili da più utenti in tempo reale, con back-end e API documentata. Conta in Web e Mobile." },

  // Mobile
  { id: "hangouts", name: "ft_hangouts", slug: "42cursus-ft_hangouts", lang: "Libero (mobile)", xp: 4200, people: [1, 1], blocks: ["mobile", "oop"], tags: ["mobile"], pdf: 208715, desc: "App mobile di contatti e SMS: rubrica salvata in SQLite, creazione, modifica ed eliminazione dei contatti, invio e ricezione di messaggi, colore dell'header personalizzabile e app in due lingue. Nessuna libreria esterna." },
  { id: "companion", name: "Swifty Companion", slug: "42cursus-swifty-companion", lang: "Libero (mobile)", xp: 4200, people: [1, 1], blocks: ["mobile", "oop"], tags: ["mobile"], pdf: 211725, desc: "App mobile che usa l'API di 42 con OAuth: cerchi un login e vedi profilo, livello, skill con percentuale e progetti dello studente, con gestione degli errori di rete." },
  { id: "proteins", name: "Swifty Proteins", slug: "42cursus-swifty-proteins", lang: "Libero (mobile)", xp: 15750, people: [2, 2], blocks: ["mobile", "oop"], tags: ["mobile", "gfx"], pdf: 216248, desc: "App mobile con login biometrico (Touch ID, Face ID o BiometricPrompt): elenca i ligandi forniti, li scarica e li mostra in 3D con modello balls and sticks e colori CPK, con condivisione della visualizzazione. Swift, Kotlin/Java o framework multipiattaforma come Flutter." },

  // Object Oriented
  { id: "bomberman", name: "Bomberman", slug: "42cursus-bomberman", lang: "Libero + OpenGL/Vulkan/Metal", xp: 25200, people: [4, 5], blocks: ["oop"], tags: ["gfx", "game"], pdf: 209477, desc: "Clone 3D di Bomberman in gruppo: linguaggio a scelta, ma grafica con OpenGL, Vulkan o Metal e niente motori di gioco. Livelli, nemici, bonus, menu, audio e impostazioni: un gioco finito, pronto da distribuire." },
  { id: "nibbler", name: "Nibbler", slug: "42cursus-nibbler", lang: "C++", xp: 9450, people: [2, 2], blocks: ["oop"], tags: ["gfx", "game", "oop"], pdf: 209541, desc: "Snake in C++ con tre librerie grafiche diverse caricate dinamicamente: si cambia libreria con un tasto durante la partita, senza che il gioco se ne accorga." },
  { id: "avaj", name: "Avaj launcher", slug: "42cursus-avaj-launcher", lang: "Java", xp: 4200, people: [1, 1], blocks: ["oop"], tags: ["oop"], pdf: 217430, desc: "Simulatore di traffico aereo in Java a partire da un diagramma UML: aerei, elicotteri e mongolfiere reagiscono al meteo usando i pattern Observer, Singleton e Factory." },
  { id: "swingy", name: "Swingy", slug: "42cursus-swingy", lang: "Java", xp: 9450, people: [1, 1], blocks: ["oop"], tags: ["game", "oop"], pdf: 208601, desc: "Gioco di ruolo in Java con interfaccia sia a console sia grafica con Swing, intercambiabili: architettura MVC, eroi salvati in un file di testo (database relazionale come bonus) e validazione dell'input con annotazioni." },
  { id: "fixme", name: "fix-me", slug: "42cursus-fix-me", lang: "Java", xp: 15750, people: [1, 1], blocks: ["oop"], tags: ["net", "oop"], pdf: 208928, desc: "Simulatore di mercato finanziario in Java: un router smista i messaggi tra broker e market con una versione semplificata del protocollo FIX, usando socket asincroni e l'executor framework di Java." },
  { id: "libftpp", name: "libftpp", slug: "libftpp", lang: "C++", xp: 5880, people: [1, 1], blocks: ["oop"], tags: ["oop"], pdf: 225598, desc: "Toolbox C++ (C++11 o successivo) da riusare nei progetti successivi: design pattern come Singleton, Observer e Memento, strutture dati thread-safe, multithreading, rete, classi vettoriali e generatori di numeri casuali." },
  { id: "abstractdata", name: "abstract_data", slug: "abstract_data", lang: "C++", xp: 20084, people: [1, 1], blocks: ["oop"], tags: ["oop", "math"], pdf: 225597, desc: "Container della libreria standard C++ in versione «hard mode»: reimplementi parte dei container standard (come map e multimap), con la stessa struttura e tutte le funzionalità del C++98, iteratori compresi." },
  { id: "retroemu", name: "RetroEmu", slug: "retroemu", lang: "C++ o Rust", xp: 37800, people: [2, 4], blocks: ["oop", "unix"], tags: ["gfx", "game", "low"], pdf: 228207, desc: "Emulatore del Game Boy originale (DMG) in C++ o Rust, in gruppo: CPU a 8 bit simile allo Z80, grafica (PPU), memoria (MMU) e mapping delle cartucce, riprodotti fedelmente a partire dalla documentazione tecnica pubblica e verificati con ROM di test." },

  // Functional
  { id: "turing", name: "ft_turing", slug: "42cursus-ft_turing", lang: "Funzionale (es. OCaml)", xp: 9450, people: [2, 2], blocks: ["fun"], tags: ["func", "math"], pdf: 209599, desc: "Simulatore di macchina di Turing in un linguaggio funzionale (OCaml consigliato): legge la descrizione della macchina da JSON e la esegue passo passo; poi scrivi tu alcune macchine, ad esempio per riconoscere 0ⁿ1ⁿ." },
  { id: "ality", name: "ft_ality", slug: "42cursus-ft_ality", lang: "Funzionale (es. OCaml)", xp: 4200, people: [2, 2], blocks: ["fun"], tags: ["game", "func", "math"], pdf: 210927, desc: "Ricrei la modalità allenamento di un picchiaduro in un linguaggio funzionale: da una grammatica di mosse costruisci e alleni un automa a stati finiti che riconosce le combo dai tasti premuti." },

  // Imperative
  { id: "libasm", name: "libasm", slug: "libasm", lang: "ASM", xp: 966, people: [1, 1], blocks: ["imp", "unix"], tags: ["low"], pdf: 216943, desc: "Piccola libreria in assembly x86-64 con nasm e sintassi Intel: ft_strlen, ft_strcpy, ft_strcmp, ft_write, ft_read e ft_strdup, rispettando le convenzioni di chiamata e la gestione di errno." },
  { id: "zappy", name: "zappy", slug: "42cursus-zappy", lang: "Libero (server compilato)", xp: 25200, people: [2, 4], blocks: ["imp", "unix"], tags: ["game", "net"], pdf: 209870, desc: "Gioco multiplayer in rete via TCP, in gruppo: server in un linguaggio compilato a scelta che gestisce il mondo e le risorse, client IA autonomi (in qualsiasi linguaggio) che collaborano per salire di livello e un client grafico." },
  { id: "ftlinux", name: "ft_linux", slug: "42cursus-ft_linux", lang: "Shell", xp: 4200, people: [1, 1], blocks: ["imp", "unix"], tags: ["low", "devops"], pdf: 212191, desc: "Costruisci la tua distribuzione Linux da zero, sul modello di Linux From Scratch: toolchain, kernel compilato a mano, pacchetti base e avvio della macchina." },
  { id: "penguin", name: "little penguin", slug: "42cursus-little-penguin-1", lang: "C", xp: 9450, people: [1, 1], blocks: ["imp", "unix"], tags: ["low"], pdf: 217550, desc: "Primi passi nel kernel Linux, tratti dalla Eudyptula Challenge: compilare un kernel personalizzato, scrivere moduli, driver semplici e patch nello stile ufficiale del kernel." },
  { id: "taskmaster", name: "taskmaster", slug: "42cursus-taskmaster", lang: "Libero", xp: 9450, people: [2, 2], blocks: ["imp", "unix", "sys"], tags: ["low", "devops"], pdf: 210912, desc: "Gestore di processi in stile supervisord: avvia, controlla e riavvia programmi da un file di configurazione, con log e una shell di controllo interattiva." },
  { id: "strace", name: "strace", slug: "42cursus-strace", lang: "C", xp: 9450, people: [1, 1], blocks: ["imp", "unix"], tags: ["low"], pdf: 209528, desc: "Reimplementazione di strace: con ptrace segui un processo, intercetti ogni system call e stampi nome, argomenti e valore di ritorno, per 32 e 64 bit." },
  { id: "malloc", name: "malloc", slug: "42cursus-malloc", lang: "C", xp: 9450, people: [1, 1], blocks: ["imp", "unix"], tags: ["low"], pdf: 214587, desc: "Allocatore di memoria dinamica scritto da zero come libreria condivisa: malloc, free e realloc sopra mmap e munmap, con zone per allocazioni piccole, medie e grandi, una funzione che mostra lo stato della memoria e gestione dei thread." },
  { id: "mattdaemon", name: "Matt Daemon", slug: "42cursus-matt-daemon", lang: "C++", xp: 9450, people: [2, 2], blocks: ["imp", "unix"], tags: ["net", "low"], pdf: 212499, desc: "Demone Unix in C++: si stacca dal terminale, ascolta sulla porta 4242, registra ogni azione in un log con data e ora, impedisce avvii doppi con un lock file e gestisce i segnali." },
  { id: "nm", name: "nm", slug: "nm", lang: "C", xp: 9450, people: [1, 1], blocks: ["imp", "unix"], tags: ["low"], pdf: 221637, desc: "Reimplementazione di nm in C: apri i file ELF (x86_32, x64, file oggetto e librerie .so), leggi la tabella dei simboli e la stampi ordinata come il comando originale." },
  { id: "lemipc", name: "lem_ipc", slug: "42cursus-lem-ipc", lang: "C", xp: 9450, people: [1, 1], blocks: ["imp", "unix"], tags: ["low"], pdf: 210295, desc: "Gioco a squadre tra processi su una mappa condivisa, in C: comunicazione con memoria condivisa, semafori e code di messaggi System V." },
  { id: "kfs1", name: "kfs-1", slug: "42cursus-kfs-1", lang: "Libero + ASM", xp: 15750, people: [2, 2], blocks: ["imp", "unix"], tags: ["low"], pdf: 209026, desc: "Primo passo del kernel da zero: un kernel avviabile con GRUB, codice di partenza in assembly, linker script e interfaccia per scrivere a schermo. Linguaggio a scelta (C, C++, Rust…) più ASM." },
  { id: "malcolm", name: "ft_malcolm", slug: "ft_malcolm", lang: "C", xp: 6000, people: [1, 1], blocks: ["imp", "sec"], tags: ["net", "sec"], pdf: 228824, desc: "Ramo sicurezza di rete: un progetto in C sul protocollo ARP per capire come le macchine si trovano su una rete locale e perché questo meccanismo è fragile." },
  { id: "sslmd5", name: "ft_ssl_md5", slug: "42cursus-ft_ssl_md5", lang: "C", xp: 9450, people: [1, 1], blocks: ["imp", "sec"], tags: ["sec", "math"], pdf: 205815, desc: "Porta d'ingresso al ramo crittografia: ricrei in C una parte di OpenSSL, il comando ft_ssl con gli hash MD5 e SHA-256, con lettura da file, stdin e stringhe." },
  { id: "snowcrash", name: "Snowcrash", slug: "42cursus-snow-crash", lang: "Shell (reverse)", xp: 9450, people: [2, 2], blocks: ["imp", "sec"], tags: ["sec"], pdf: 221871, desc: "Porta d'ingresso al ramo sicurezza: livelli su una macchina virtuale in cui impari a osservare un sistema, trovare indizi e ragionare come un analista." },
  { id: "rainfall", name: "Rainfall", slug: "42cursus-rainfall", lang: "ASM (reverse)", xp: 25200, people: [2, 2], blocks: ["imp", "sec"], tags: ["low", "sec"], pdf: 221872, desc: "Ramo sicurezza: livelli su una macchina virtuale basati sull'analisi di programmi compilati, con debugger e lettura dell'assembly. Seguito di Snowcrash." },
  { id: "boot2root", name: "Boot2root", slug: "42cursus-boot2root", lang: "Sicurezza", xp: 11500, people: [2, 4], blocks: ["imp", "sec"], tags: ["sec"], pdf: 221874, desc: "Ramo sicurezza in gruppo: una macchina virtuale completa da analizzare dall'esterno fino ad averne il pieno controllo, documentando ogni percorso trovato." },
  { id: "ftshield", name: "ft_shield", slug: "42cursus-ft_shield", lang: "C o ASM", xp: 15750, people: [2, 2], blocks: ["imp", "sec"], tags: ["net", "sec"], pdf: 209357, desc: "Ramo sicurezza: progetto in C sullo studio dei meccanismi di persistenza e di accesso remoto in un sistema Linux. Obiettivi e vincoli nel subject." },
  { id: "woody", name: "Woody Woodpacker", slug: "42cursus-woody-woodpacker", lang: "C (+ ASM)", xp: 9450, people: [2, 2], blocks: ["imp", "sec"], tags: ["low", "sec"], pdf: 206044, desc: "Ramo sicurezza: progetto sul formato dei binari ELF e sulla cifratura del loro contenuto. Obiettivi e vincoli nel subject." },
  { id: "famine", name: "Famine", slug: "42cursus-famine", lang: "C o ASM", xp: 9450, people: [2, 2], blocks: ["imp", "sec"], tags: ["low", "sec"], pdf: 212052, desc: "Ramo sicurezza: progetto sul formato dei binari ELF e su come un file eseguibile può essere modificato. Obiettivi e vincoli nel subject." },
  { id: "ftselect", name: "ft_select", slug: "42cursus-ft_select", lang: "C", xp: 4200, people: [1, 1], blocks: ["imp", "unix"], tags: ["low"], pdf: 208555, desc: "Interfaccia a terminale con termcaps: mostra una lista su più colonne, la navighi con le frecce, selezioni elementi e restituisci la scelta alla shell." },
  { id: "ftscript", name: "ft_script", slug: "42cursus-ft_script", lang: "C", xp: 4200, people: [1, 1], blocks: ["imp", "unix"], tags: ["low"], pdf: 215689, desc: "Reimplementazione del comando script: apri un pseudo-terminale, registri tutto quello che accade nella sessione e puoi rigiocarla." },

  // RNCP 7 · Unix/Kernel
  { id: "kfs3", name: "kfs-3", slug: "42cursus-kfs-3", lang: "Libero + ASM", xp: 35700, people: [2, 2], blocks: ["unix"], tags: ["low"], pdf: 208611, desc: "Memoria del kernel da zero: paginazione, diritti di lettura e scrittura, separazione tra spazio kernel e utente, memoria fisica e virtuale con le funzioni di allocazione (kmalloc, vmalloc…) e gestione dei kernel panic." },
  { id: "kfs4", name: "kfs-4", slug: "42cursus-kfs-4", lang: "Libero + ASM", xp: 25200, people: [2, 2], blocks: ["unix"], tags: ["low"], pdf: 210779, desc: "Interruzioni nel kernel: Interrupt Descriptor Table, interruzioni hardware e software, segnali con callback e scheduling, salvataggio dello stack e pulizia dei registri prima di un panic, gestione della tastiera tramite IDT." },
  { id: "kfs5", name: "kfs-5", slug: "42cursus-kfs-5", lang: "Libero + ASM", xp: 35700, people: [2, 2], blocks: ["unix"], tags: ["low"], pdf: 210529, desc: "Processi nel kernel: struttura con PID, stato, padre e figli, stack e heap, segnali in coda e proprietario, più le funzioni per accodare segnali, gestire la memoria di un processo, copiarlo (fork) e farlo comunicare tramite socket." },
  { id: "kfs6", name: "kfs-6", slug: "42cursus-kfs-6", lang: "Libero + ASM", xp: 25200, people: [2, 2], blocks: ["unix"], tags: ["low"], pdf: 210527, desc: "Dischi e filesystem nel kernel: lettura e scrittura di un disco IDE, lettura e scrittura di un filesystem ext2 e un albero di base con /sys, /var, /dev e /proc." },
  { id: "kfs7", name: "kfs-7", slug: "42cursus-kfs-7", lang: "Libero + ASM", xp: 35700, people: [2, 2], blocks: ["unix"], tags: ["low"], pdf: 217425, desc: "Il kernel diventa un ambiente Unix: tabella e sistema delle syscall, account utente con login e password, socket tra processi e gerarchia dei file in stile Unix." },
  { id: "kfs8", name: "kfs-8", slug: "42cursus-kfs-8", lang: "Libero + ASM", xp: 15750, people: [2, 2], blocks: ["unix"], tags: ["low"], pdf: 208606, desc: "Kernel modulare: API interna per registrare, caricare all'avvio e rimuovere moduli, con callback configurabili tra kernel e modulo. Si dimostra con un modulo tastiera e un modulo orologio." },
  { id: "kfs9", name: "kfs-9", slug: "42cursus-kfs-9", lang: "Libero + ASM", xp: 15750, people: [2, 2], blocks: ["unix"], tags: ["low"], pdf: 208596, desc: "Esecuzione di programmi: parser e loader di file ELF, una syscall simile a execve che crea il processo, e moduli del kernel in formato ELF caricati e rimossi a runtime." },
  { id: "kfs10", name: "kfs-10", slug: "42cursus-kfs-x", lang: "Libero + ASM", xp: 35700, people: [2, 2], blocks: ["unix"], tags: ["low"], pdf: 208912, desc: "Ultimo passo della serie KFS: sul tuo kernel installi una shell POSIX, una libc completa e i comandi Unix di base (cat, chmod, cp, ls, kill…), fino ad avere un sistema operativo completo." },
  { id: "lkfs", name: "filesystem", slug: "42cursus-filesystem", lang: "C (kernel Linux)", xp: 15750, people: [2, 2], blocks: ["unix"], tags: ["low"], pdf: 208599, desc: "Nuovo filesystem da zero come modulo del kernel Linux, sulla distribuzione di ft_linux: superblock e inode, cartelle, file, proprietario, permessi e link, più un programma che formatta l'immagine del disco." },
  { id: "drivers", name: "drivers-and-interrupts", slug: "42cursus-drivers-and-interrupts", lang: "C (kernel Linux)", xp: 15750, people: [1, 1], blocks: ["unix"], tags: ["low"], pdf: 208587, desc: "Driver della tastiera per il kernel Linux, sulla distribuzione di ft_linux: registri le interruzioni (IRQ), annoti ogni tasto premuto o rilasciato con l'orario e rendi il registro leggibile da un misc device." },
  { id: "procmem", name: "process-and-memory", slug: "42cursus-process-and-memory", lang: "C (kernel Linux)", xp: 9450, people: [1, 1], blocks: ["unix"], tags: ["low"], pdf: 209676, desc: "Aggiungi una system call al kernel Linux della tua distribuzione ft_linux: restituisce le informazioni su un processo (stato, stack, età, figli, padre) a partire dal suo PID." },
  { id: "userspace", name: "userspace_digressions", slug: "42cursus-userspace_digressions", lang: "Libero", xp: 16800, people: [2, 2], blocks: ["unix"], tags: ["low", "devops"], pdf: 209487, desc: "Il tuo programma init, con PID 1: monta i filesystem del kernel e le partizioni, carica i moduli, avvia syslog, swap, console, rete e demoni e li tiene d'occhio, più almeno due funzioni a scelta (initramfs, partizioni cifrate…)." },

  // RNCP 7 · System administration
  { id: "cloud1", name: "cloud-1", slug: "42cursus-cloud-1", lang: "Ansible · Docker", xp: 9450, people: [2, 2], blocks: ["sys"], tags: ["devops", "web"], pdf: 208938, desc: "Il sito di Inception deployato su un server cloud in modo del tutto automatico (Ansible consigliato): WordPress, phpMyAdmin e database in container separati, dati persistenti, riavvio automatico, TLS e deploy su più server." },
  { id: "ping", name: "ft_ping", slug: "42cursus-ft_ping", lang: "C", xp: 4200, people: [1, 1], blocks: ["sys"], tags: ["net"], pdf: 208554, desc: "Reimplementazione di ping in C, prendendo come riferimento quello di inetutils: invii pacchetti ICMP a un indirizzo IPv4 o a un nome host e misuri il tempo di andata e ritorno." },
  { id: "traceroute", name: "ft_traceroute", slug: "42cursus-ft_traceroute", lang: "C", xp: 4200, people: [1, 1], blocks: ["sys"], tags: ["net"], pdf: 221754, desc: "Reimplementazione di traceroute in C, con la sola libc: mostri il percorso dei pacchetti verso un host IPv4, salto per salto." },
  { id: "nmap", name: "ft_nmap", slug: "42cursus-ft_nmap", lang: "C", xp: 15750, people: [2, 2], blocks: ["sys"], tags: ["net", "sec"], pdf: 215019, desc: "Reimplementazione di una parte di nmap in C con libpcap e pthread: scansioni le porte di un host con vari tipi di scan, in parallelo su più thread, e riconosci i servizi." },
  { id: "ioc", name: "Inception of Context", slug: "inception-of-context", lang: "Libero (es. Python) · LLM locale", xp: 19800, people: [2, 3], blocks: ["sys"], tags: ["devops", "ai"], pdf: 228205, desc: "Assistente al codice che gira tutto in locale, in tre parti: indice vettoriale di un progetto sempre sincronizzato, API che risponde alle domande con un piccolo modello linguistico (RAG), poi modifiche al codice generate, applicate e validate, con ritorno indietro se falliscono." },
  { id: "iow", name: "Inception of Wisdom", slug: "inception-of-wisdom", lang: "Python · LLM locale", xp: 21600, people: [2, 3], blocks: ["sys"], tags: ["devops", "ai"], pdf: 228206, desc: "Agente in Python con un modello linguistico locale che sorveglia un servizio in container: legge stato, log e risposte HTTP, riconosce i crash e propone correzioni, fino al redeploy automatico. Prosegue Inception of Things e Inception of Context." },
  { id: "lgtm", name: "ft_lgtm", slug: "ft_lgtm", lang: "Libero (WASM) · Kubernetes", xp: 16200, people: [2, 2], blocks: ["sys"], tags: ["devops", "web"], pdf: 228204, desc: "Playground web per eseguire codice in sicurezza in una sandbox WASM, con condivisione su IPFS, tutto su un cluster Kubernetes locale e monitorato con lo stack LGTM (Loki, Grafana, Tempo, Mimir) e OpenTelemetry." },

  // RNCP 7 · Security
  { id: "pcyber", name: "Piscine Cybersecurity", slug: "cybersecurity", lang: "Libero", xp: 9450, people: [1, 1], blocks: ["sec"], tags: ["sec"], pdf: 213170, desc: "Piscine di sicurezza informatica in moduli brevi, ognuno su un tema: web e metadati, password monouso, anonimato in rete, analisi di programmi, cifratura di file, reti locali e database. Obiettivi e vincoli nei subject dei moduli." },
  { id: "htb", name: "UnleashTheBox", slug: "unleashthebox", lang: "HackTheBox", xp: 15750, people: [1, 1], blocks: ["sec"], tags: ["sec"], pdf: 212058, desc: "Ramo sicurezza sulla piattaforma HackTheBox: prima il percorso introduttivo, poi le stagioni, fino a raggiungere il livello minimo richiesto. Il progetto non si può ripetere." },

  // RNCP 7 · Artificial Intelligence
  { id: "pyds", name: "Piscine Python for Data Science", slug: "python-for-data-science", lang: "Python", xp: 4725, people: [1, 1], blocks: ["ai"], tags: ["ai"], pdf: 211905, desc: "Piscine di Python 3.10 in cinque moduli: basi del linguaggio, array e immagini con NumPy, tabelle di dati con pandas, programmazione a oggetti e design orientato ai dati." },
  { id: "pds", name: "Piscine Data Science", slug: "piscine-data-science", lang: "SQL · Libero", xp: 4725, people: [1, 1], blocks: ["ai"], tags: ["ai"], pdf: 220007, desc: "Piscine sui dati in cinque moduli: creazione di un database PostgreSQL, data warehouse, visualizzazione dei dati, analisi e modelli per prevedere l'andamento futuro." },
  { id: "linreg", name: "ft_linear_regression", slug: "42cursus-ft_linear_regression", lang: "Libero", xp: 4200, people: [1, 1], blocks: ["ai"], tags: ["ai", "math"], pdf: 212344, desc: "Primo algoritmo di machine learning: prevedi il prezzo di un'auto dal chilometraggio con una regressione lineare allenata con la discesa del gradiente, scritta da te senza librerie che facciano il lavoro." },
  { id: "dslr", name: "DSLR", slug: "42cursus-dslr", lang: "Libero (es. Python)", xp: 6000, people: [2, 2], blocks: ["ai"], tags: ["ai"], pdf: 211419, desc: "Data science e regressione logistica: analizzi e visualizzi un dataset (statistiche descrittive, istogrammi, scatter plot) e alleni un classificatore one-vs-all che smista gli studenti di Hogwarts nelle case." },
  { id: "mlp", name: "Multilayer Perceptron", slug: "42cursus-multilayer-perceptron", lang: "Libero", xp: 9450, people: [1, 1], blocks: ["ai"], tags: ["ai"], pdf: 209575, desc: "Rete neurale scritta da zero, senza librerie di reti neurali: feedforward, backpropagation e discesa del gradiente per classificare tumori al seno come benigni o maligni a partire da un dataset." },
  { id: "gomoku", name: "Gomoku", slug: "42cursus-gomoku", lang: "Libero", xp: 25200, people: [2, 2], blocks: ["ai"], tags: ["ai", "game"], pdf: 208550, desc: "Gomoku con interfaccia grafica e un'IA che deve battere i giocatori umani: algoritmo Min-Max e soprattutto una funzione euristica efficace e veloce. Anche partita tra due umani con suggerimento delle mosse." },
  { id: "expert", name: "Expert System", slug: "42cursus-expert-system", lang: "Libero", xp: 9450, people: [2, 2], blocks: ["ai"], tags: ["ai", "math"], pdf: 210325, desc: "Sistema esperto per il calcolo proposizionale: un motore a backward chaining legge regole e fatti da file e risponde alle domande con vero, falso o indeterminato, gestendo AND, OR, XOR, negazioni e parentesi." },
  { id: "krpsim", name: "Krpsim", slug: "42cursus-krpsim", lang: "Libero", xp: 9450, people: [2, 3], blocks: ["ai"], tags: ["ai", "math"], pdf: 211241, desc: "Ottimizzazione di una catena di processi: da un file con scorte e processi trovi una sequenza che massimizza un risultato o riduce il tempo, più un programma che verifica la soluzione." },
  { id: "matrix", name: "Matrix", slug: "matrix", lang: "Libero (prototipi in Rust)", xp: 7000, people: [1, 1], blocks: ["ai"], tags: ["math"], pdf: 210505, desc: "Algebra lineare senza librerie matematiche: vettori e matrici, combinazioni lineari, prodotto scalare e vettoriale, norme, trasposta, forma a scalini, determinante, inversa e rango." },
  { id: "rsb", name: "Ready set boole", slug: "ready-set-boole", lang: "Libero (prototipi in Rust)", xp: 7000, people: [1, 1], blocks: ["ai"], tags: ["math"], pdf: 212628, desc: "Algebra booleana e teoria degli insiemi, senza librerie matematiche: addizioni e moltiplicazioni con operatori bit a bit, codice Gray, tabelle di verità, forme normali, SAT, insiemi e curve che riempiono lo spazio." },
  { id: "leaffliction", name: "Leaffliction", slug: "leaffliction", lang: "Libero (es. Python)", xp: 15750, people: [2, 3], blocks: ["ai"], tags: ["ai"], pdf: 212502, desc: "Visione artificiale: riconosci le malattie delle piante dalle foto delle foglie, con analisi e bilanciamento del dataset, trasformazioni delle immagini e un classificatore." },
  { id: "learn2slither", name: "Learn2Slither", slug: "learn2slither", lang: "Libero (es. Python)", xp: 9450, people: [1, 1], blocks: ["ai"], tags: ["ai", "game"], pdf: 225974, desc: "Apprendimento per rinforzo: un serpente su una griglia 10×10 impara da solo a mangiare le mele giuste e a sopravvivere, con Q-learning e una visione limitata del campo." },
  // Esperienze professionali: nessun blocco, i loro XP contano solo per il livello
  { id: "internship-1", name: "Internship I", slug: "internship-i", lang: "—", xp: 42000, people: [1, 1], blocks: [], tags: [], pdf: null, desc: "Primo stage in azienda, seguito sull'intra: contratto, valutazioni del tutor e rapporto finale. Conta anche tra le esperienze professionali." },
  { id: "internship-2", name: "Internship II", slug: "internship-ii", lang: "—", xp: 63000, people: [1, 1], blocks: [], tags: [], pdf: null, desc: "Secondo stage in azienda, dopo l'Internship I, con le stesse tappe sull'intra. Conta anche tra le esperienze professionali." },
  { id: "startup-internship", name: "Startup Internship", slug: "42cursus-startup-internship", lang: "—", xp: 42000, people: [1, 1], blocks: [], tags: [], pdf: null, desc: "Stage in una startup, seguito sull'intra come gli altri stage. Conta anche tra le esperienze professionali." },
];
const PROJECT_IDS = new Set(PROJECTS.map((pr) => pr.id));
const INTERNSHIPS = PROJECTS.filter((pr) => !pr.blocks.length);

// minimi del regolamento, dalle liste ufficiali RNCP dell'intra (lists/official/)
const BLOCKS: Record<BlockId, Block> = {
  suite:  { name: "Suite", minXp: 0, minN: 1 },
  // RNCP 6
  web:    { name: "Web", minXp: 15000, minN: 2 },
  mobile: { name: "Mobile", minXp: 10000, minN: 2 },
  oop:    { name: "Object Oriented", minXp: 10000, minN: 2 },
  fun:    { name: "Functional", minXp: 10000, minN: 2 },
  imp:    { name: "Imperative", minXp: 10000, minN: 2 },
  // RNCP 7
  unix:   { name: "Unix/Kernel", minXp: 30000, minN: 2 },
  sys:    { name: "System administration", minXp: 50000, minN: 3 },
  sec:    { name: "Security", minXp: 50000, minN: 3 },
  webdb:  { name: "Web - Database", minXp: 50000, minN: 2 },
  ai:     { name: "Artificial Intelligence", minXp: 70000, minN: 3 },
};

// categorie dei filtri, nell'ordine dei bottoni; un progetto può averne più di una
const TAGS: Record<Tag, string> = {
  web: "Web", mobile: "Mobile", gfx: "Graphics", game: "Gaming", net: "Reti",
  low: "Kernel/LowLevel", devops: "DevOps/Container", sec: "CyberSec", ai: "IA/Data", oop: "OOP", func: "Funzionale", math: "Algoritmi/Math",
};

// i due titoli: la Suite è la stessa lista per entrambi
const TITLES: Record<TitleId, Title> = {
  6: {
    name: "RNCP 6", level: 17, events: 10, exps: 2,
    options: {
      1: { name: "Opzione 1 · Web e mobile", blocks: ["suite", "web", "mobile"] },
      2: { name: "Opzione 2 · Software applicativo", blocks: ["suite", "oop", "fun", "imp"] },
    },
  },
  7: {
    name: "RNCP 7", level: 21, events: 15, exps: 2,
    options: {
      1: { name: "Opzione 1 · Sistemi informativi e reti", blocks: ["suite", "unix", "sys", "sec"] },
      2: { name: "Opzione 2 · Basi di dati e data", blocks: ["suite", "webdb", "ai"] },
    },
  },
};

const STATUS_NAMES: Record<Status, string> = { todo: "Da fare", doing: "In corso", done: "Fatto" };

// XP totali per arrivare a ogni livello del 42cursus (0…30), dall'API di 42 via experience_21.json di 42calculator
const LEVEL_XP = [0, 462, 2688, 5885, 11777, 29217, 46255, 63559, 74340, 85483, 95000, 105630, 124446, 145782, 169932,
  197316, 228354, 263508, 303366, 348516, 399672, 457632, 523320, 597786, 682164, 777756, 886074, 1008798, 1147902, 1305486, 1484070];

// ore stimate dall'intra per slug: le scrive hours.js (npm run hours)
declare const INTRA_HOURS: Record<string, number> | undefined;
