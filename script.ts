/* ---------- tipi ---------- */
// blocchi RNCP 6: suite, web, mobile, oop, fun, imp · RNCP 7: suite (la stessa lista), unix, sys, sec, webdb, ai
type BlockId = "suite" | "web" | "mobile" | "oop" | "fun" | "imp" | "unix" | "sys" | "sec" | "webdb" | "ai";
type TitleId = 6 | 7;
type OptionId = 1 | 2;
type Team = "all" | "solo" | "group";
type PeopleRange = [min: number, max: number];
type Tag = "web" | "mobile" | "gfx" | "game" | "net" | "low" | "devops" | "sec" | "ai" | "oop" | "func" | "math";
// stato di un progetto scelto: da fare, in corso o fatto (validato)
type Status = "todo" | "doing" | "done";

interface Project {
  id: string;
  n: string;
  s: string;
  l: string;
  xp: number | null;
  p: PeopleRange | null;
  b: BlockId[];
  c: Tag[];
  pdf: number | null;
  d: string;
}

interface Block {
  name: string;
  minXp: number;
  minN: number;
  rule: string;
}

interface Title {
  name: string;
  rules: string; // requisiti comuni, in parole
  level: number; // livello minimo nel 42cursus
  events: number; // eventi minimi
  exps: number; // esperienze professionali minime
  options: Record<OptionId, { name: string; blocks: BlockId[] }>;
}

// dati importati dall'intra: login, data e, per ogni progetto che l'import ha segnato, lo stato che aveva prima ("" = non scelto)
interface IntraSession { login: string; date: string; prev: Record<string, Status | ""> }

interface State {
  title: TitleId;
  opt: OptionId;
  picked: Record<string, Status>; // progetti scelti, con il loro stato
  marks: Record<string, number>; // voto finale dei progetti fatti, dall'intra (npm run me)
  level: number | null; // livello attuale nel 42cursus, scritto a mano o dall'intra
  events: number; // eventi a cui hai partecipato
  exps: number; // esperienze professionali (stage, contratti) validate
  intra: IntraSession | null; // da chi e quando vengono i dati importati dall'intra (per "Esci")
  team: Team;
  only: boolean;
  both: boolean; // solo i progetti che contano sia nell'RNCP 6 sia nell'RNCP 7
  tags: Set<Tag>;
  q: string;
  dayHours: number; // ore di lavoro in una giornata
}

/* ---------- dati ---------- */
// l: linguaggio (indicativo, "Libero" = a scelta) · b: blocchi in cui il progetto conta · c: categorie per i filtri · pdf: id del subject sul CDN di 42 (null = non disponibile) · xp: XP a voto 100 (null = non disponibile) · p: [min, max] persone
const PROJECTS: Project[] = [
  // Suite
  { id: "42sh", n: "42sh", s: "42cursus-42sh", l: "C", xp: 15750, p: [4, 5], b: ["suite"], c: ["low"], pdf: 215874, d: "Shell Unix completa in gruppo: pipe, redirezioni, editing di linea con termcaps, history, job control (jobs, fg, bg, &), inibitori, globbing, subshell, alias e builtin. Il grande seguito di minishell." },
  { id: "badass", n: "BADASS", s: "bgp-at-doors-of-autonomous-systems-is-simple", l: "Shell · GNS3", xp: 22450, p: [2, 3], b: ["suite", "sys"], c: ["net", "devops"], pdf: 211017, d: "Rete simulata con GNS3 e immagini Docker: configuri router FRRouting e realizzi VXLAN con BGP EVPN per collegare più reti come in un datacenter. Seguito di NetPractice." },
  { id: "doom", n: "DoomNukem", s: "42cursus-doom-nukem", l: "C", xp: 15750, p: [3, 4], b: ["suite"], c: ["gfx", "game"], pdf: 210723, d: "Motore 3D in stile Doom in C, senza accelerazione hardware né librerie 3D: raycasting avanzato, stanze con soffitti di altezze diverse, texture, luci, HUD, nemici, suoni e musica, più un editor di livelli obbligatorio. Seguito di cub3d." },
  { id: "iot", n: "Inception of Things", s: "inception-of-things", l: "Kubernetes · Vagrant", xp: 25450, p: [2, 3], b: ["suite", "sys"], c: ["net", "devops"], pdf: 224141, d: "Infrastruttura Kubernetes in tre parti: cluster K3s con Vagrant, app esposte tramite ingress, poi K3d con Argo CD per il deploy continuo da un repository Git. Seguito di Inception." },
  { id: "humangl", n: "HumanGL", s: "42cursus-humangl", l: "Libero", xp: 4200, p: [2, 2], b: ["suite"], c: ["gfx"], pdf: 217474, d: "Modello umano animato in OpenGL moderno che cammina, salta e sta fermo: costruisci a mano lo stack di matrici e la gerarchia delle parti del corpo. Linguaggio e libreria grafica a scelta. Seguito di scop." },
  { id: "kfs2", n: "kfs-2", s: "42cursus-kfs-2", l: "Libero + ASM", xp: 15750, p: [2, 2], b: ["suite", "imp", "unix"], c: ["low"], pdf: 208608, d: "Secondo passo del kernel da zero: Global Descriptor Table, stack del kernel, uno strumento per stamparlo in modo leggibile e una piccola shell di debug. Seguito di kfs-1." },
  { id: "override", n: "Override", s: "42cursus-override", l: "ASM (reverse)", xp: 35700, p: [2, 2], b: ["suite", "imp", "sec"], c: ["low", "sec"], pdf: 221873, d: "Ramo sicurezza, seguito diretto di Rainfall e di livello superiore: dieci livelli in gruppo su una macchina virtuale con le protezioni moderne attive, più un livello bonus." },
  { id: "pestilence", n: "Pestilence", s: "42cursus-pestilence", l: "C · ASM", xp: 15750, p: [2, 2], b: ["suite", "imp", "sec"], c: ["low", "sec"], pdf: 208626, d: "Ramo sicurezza, seguito di Famine: studio approfondito del formato dei binari e delle tecniche di analisi. Obiettivi e vincoli nel subject." },
  { id: "rt", n: "RT", s: "42cursus-rt", l: "C, C++ o Rust", xp: 20750, p: [3, 4], b: ["suite"], c: ["gfx"], pdf: 210513, d: "Raytracer completo in gruppo, in C, C++ o Rust: luci multiple con ombre, luce ambiente e direzionale, riflessi, trasparenza, texture e oggetti composti. Seguito di miniRT." },
  { id: "tpv", n: "Total perspective vortex", s: "42cursus-total-perspective-vortex", l: "Python", xp: 9450, p: [1, 1], b: ["suite", "ai"], c: ["ai"], pdf: 209510, d: "Interfaccia cervello-computer: elabori segnali EEG con MNE, estrai le feature, costruisci una pipeline scikit-learn e classifichi in tempo reale i movimenti immaginati. Seguito di dslr." },

  // Piscine
  { id: "symfony", n: "Piscine PHP Symfony", s: "piscine-symfony", l: "PHP", xp: 9450, p: [1, 1], b: ["web", "oop", "webdb"], c: ["web", "oop"], pdf: 209481, d: "Piscine su PHP e Symfony divisa in moduli: basi del web e della programmazione a oggetti in PHP, Composer, primi passi con Symfony, SQL e ORM, sessioni, concetti avanzati e progetto finale." },
  { id: "django", n: "Piscine Python Django", s: "piscine-django", l: "Python", xp: 9450, p: [1, 1], b: ["web", "oop", "webdb"], c: ["web"], pdf: 210657, d: "Piscine su Python e Django divisa in moduli: basi del web e di Python, librerie, primi passi con Django, SQL e ORM, sessioni, concetti avanzati e progetto finale." },
  { id: "ror", n: "Piscine Ruby on Rails", s: "piscine-ror", l: "Ruby", xp: 9450, p: [1, 1], b: ["web", "oop", "webdb"], c: ["web"], pdf: 210088, d: "Piscine su Ruby e Rails divisa in moduli: basi del web e di Ruby, gem, primi passi con Rails, SQL, sessioni, concetti avanzati e progetto finale." },
  { id: "pmobile", n: "Piscine Mobile", s: "mobile", l: "Libero (mobile)", xp: 9450, p: [1, 1], b: ["mobile", "oop"], c: ["mobile"], pdf: 212922, d: "Piscine di sviluppo mobile: struttura e navigazione di un'app, chiamate ad API esterne, layout responsive, autenticazione e salvataggio dati, fino a un progetto finale." },
  { id: "pobject", n: "Piscine Object", s: "piscine-object", l: "C++", xp: 9450, p: [1, 1], b: ["oop"], c: ["oop"], pdf: 210719, d: "Piscine sulla programmazione a oggetti in C++: incapsulamento, relazioni tra classi, UML, principi SOLID e i design pattern più usati, applicati a esercizi concreti." },
  { id: "ocaml", n: "Piscine OCaml", s: "42cursus-piscine-ocaml", l: "OCaml", xp: 9450, p: [1, 1], b: ["fun"], c: ["func"], pdf: 208548, d: "Piscine OCaml: sintassi, ricorsione e funzioni di ordine superiore, pattern matching e tipi, moduli e funtori, parti imperative e a oggetti, fino a monoidi e monadi. Ottima base per il blocco Functional." },

  // Web
  { id: "camagru", n: "Camagru", s: "42cursus-camagru", l: "Libero (solo lib. standard)", xp: 4200, p: [1, 1], b: ["web", "oop", "webdb"], c: ["web"], pdf: 203658, d: "Web app per foto in stile Instagram: scatto da webcam o upload, sovrapposizione di immagini lato server, gallery pubblica, like, commenti e gestione account. Lato server niente framework: solo ciò che esiste nella libreria standard di PHP." },
  { id: "matcha", n: "Matcha", s: "42cursus-matcha", l: "Libero", xp: 9450, p: [2, 2], b: ["web", "oop", "webdb"], c: ["web"], pdf: 227569, d: "Sito di incontri completo: profili con foto e interessi, ricerca e suggerimenti per affinità e distanza, geolocalizzazione, chat e notifiche in tempo reale." },
  { id: "hypertube", n: "Hypertube", s: "42cursus-hypertube", l: "Libero", xp: 15750, p: [2, 4], b: ["web", "oop", "webdb"], c: ["web", "net"], pdf: 209673, d: "Piattaforma di streaming in gruppo: cerchi un film su fonti esterne, il server lo scarica via BitTorrent e lo riproduce nel browser mentre scarica. Login OAuth, sottotitoli e API REST." },
  { id: "redtetris", n: "Red Tetris", s: "42cursus-red-tetris", l: "JavaScript", xp: 15750, p: [2, 2], b: ["web", "oop", "webdb"], c: ["web", "game", "net"], pdf: 211093, d: "Tetris multiplayer in tempo reale: stanze di gioco, linee penalità agli avversari, frontend React, server Node con socket e una copertura di test minima obbligatoria." },
  { id: "darkly", n: "Darkly", s: "42cursus-darkly", l: "Sicurezza web", xp: 6300, p: [2, 2], b: ["web", "oop", "imp", "sec", "webdb"], c: ["web", "sec"], pdf: 221875, d: "Introduzione alla sicurezza web: su un sito di prova volutamente fragile individui i problemi più comuni, spieghi come funzionano e come si correggono." },
  { id: "h42n42", n: "h42n42", s: "42cursus-h42n42", l: "OCaml", xp: 9450, p: [1, 1], b: ["web", "oop", "fun", "webdb"], c: ["web", "game", "func"], pdf: 209576, d: "Simulazione nel browser in OCaml con Ocsigen ed Eliom: una popolazione di creature minacciata da un virus, che salvi spostandole con il mouse. Lo stesso codice gira su client e server." },
  { id: "tokenizer", n: "Tokenizer", s: "tokenizer", l: "Libero (es. Solidity)", xp: 9450, p: [1, 1], b: ["web", "webdb"], c: ["web"], pdf: 211049, d: "Primo progetto Web3: crei il tuo token su una blockchain pubblica a scelta (per esempio BNB Chain), rispettandone lo standard (ERC-20 o equivalente), lo pubblichi e documenti scelte tecniche e funzionamento." },
  { id: "tokenizeart", n: "TokenizeArt", s: "tokenizeart", l: "Libero (es. Solidity)", xp: 9450, p: [1, 1], b: ["web", "webdb"], c: ["web"], pdf: 214858, d: "Crei e pubblichi un NFT su una blockchain pubblica a scelta, rispettandone lo standard (ERC-721 o equivalente): smart contract, metadati e immagine su storage decentralizzato come IPFS, più la documentazione." },
  { id: "musicroom", n: "Music Room", s: "42cursus-music-room", l: "Libero (mobile) + back-end libero", xp: 25200, p: [2, 4], b: ["web", "mobile", "webdb"], c: ["web", "mobile"], pdf: 209570, d: "Soluzione mobile completa in gruppo, per Android o iOS con la tecnologia che preferisci: voto dei brani in diretta, delega del controllo della musica e playlist modificabili da più utenti in tempo reale, con back-end e API documentata. Conta in Web e Mobile." },

  // Mobile
  { id: "hangouts", n: "ft_hangouts", s: "42cursus-ft_hangouts", l: "Libero (mobile)", xp: 4200, p: [1, 1], b: ["mobile", "oop"], c: ["mobile"], pdf: 208715, d: "App mobile di contatti e SMS: rubrica salvata in SQLite, creazione, modifica ed eliminazione dei contatti, invio e ricezione di messaggi, colore dell'header personalizzabile e app in due lingue. Nessuna libreria esterna." },
  { id: "companion", n: "Swifty Companion", s: "42cursus-swifty-companion", l: "Libero (mobile)", xp: 4200, p: [1, 1], b: ["mobile", "oop"], c: ["mobile"], pdf: 211725, d: "App mobile che usa l'API di 42 con OAuth: cerchi un login e vedi profilo, livello, skill con percentuale e progetti dello studente, con gestione degli errori di rete." },
  { id: "proteins", n: "Swifty Proteins", s: "42cursus-swifty-proteins", l: "Libero (mobile)", xp: 15750, p: [2, 2], b: ["mobile", "oop"], c: ["mobile", "gfx"], pdf: 216248, d: "App mobile con login biometrico (Touch ID, Face ID o BiometricPrompt): elenca i ligandi forniti, li scarica e li mostra in 3D con modello balls and sticks e colori CPK, con condivisione della visualizzazione. Swift, Kotlin/Java o framework multipiattaforma come Flutter." },

  // Object Oriented
  { id: "bomberman", n: "Bomberman", s: "42cursus-bomberman", l: "Libero + OpenGL/Vulkan/Metal", xp: 25200, p: [4, 5], b: ["oop"], c: ["gfx", "game"], pdf: 209477, d: "Clone 3D di Bomberman in gruppo: linguaggio a scelta, ma grafica con OpenGL, Vulkan o Metal e niente motori di gioco. Livelli, nemici, bonus, menu, audio e impostazioni: un gioco finito, pronto da distribuire." },
  { id: "nibbler", n: "Nibbler", s: "42cursus-nibbler", l: "C++", xp: 9450, p: [2, 2], b: ["oop"], c: ["gfx", "game", "oop"], pdf: 209541, d: "Snake in C++ con tre librerie grafiche diverse caricate dinamicamente: si cambia libreria con un tasto durante la partita, senza che il gioco se ne accorga." },
  { id: "avaj", n: "Avaj launcher", s: "42cursus-avaj-launcher", l: "Java", xp: 4200, p: [1, 1], b: ["oop"], c: ["oop"], pdf: 217430, d: "Simulatore di traffico aereo in Java a partire da un diagramma UML: aerei, elicotteri e mongolfiere reagiscono al meteo usando i pattern Observer, Singleton e Factory." },
  { id: "swingy", n: "Swingy", s: "42cursus-swingy", l: "Java", xp: 9450, p: [1, 1], b: ["oop"], c: ["game", "oop"], pdf: 208601, d: "Gioco di ruolo in Java con interfaccia sia a console sia grafica con Swing, intercambiabili: architettura MVC, eroi salvati in un file di testo (database relazionale come bonus) e validazione dell'input con annotazioni." },
  { id: "fixme", n: "fix-me", s: "42cursus-fix-me", l: "Java", xp: 15750, p: [1, 1], b: ["oop"], c: ["net", "oop"], pdf: 208928, d: "Simulatore di mercato finanziario in Java: un router smista i messaggi tra broker e market con una versione semplificata del protocollo FIX, usando socket asincroni e l'executor framework di Java." },
  { id: "libftpp", n: "libftpp", s: "libftpp", l: "C++", xp: 5880, p: [1, 1], b: ["oop"], c: ["oop"], pdf: 225598, d: "Toolbox C++ (C++11 o successivo) da riusare nei progetti successivi: design pattern come Singleton, Observer e Memento, strutture dati thread-safe, multithreading, rete, classi vettoriali e generatori di numeri casuali." },
  { id: "abstractdata", n: "abstract_data", s: "abstract_data", l: "C++", xp: 20084, p: [1, 1], b: ["oop"], c: ["oop", "math"], pdf: 225597, d: "Container della libreria standard C++ in versione «hard mode»: reimplementi parte dei container standard (come map e multimap), con la stessa struttura e tutte le funzionalità del C++98, iteratori compresi." },
  { id: "retroemu", n: "RetroEmu", s: "retroemu", l: "C++ o Rust", xp: 37800, p: [2, 4], b: ["oop", "unix"], c: ["gfx", "game", "low"], pdf: 228207, d: "Emulatore del Game Boy originale (DMG) in C++ o Rust, in gruppo: CPU a 8 bit simile allo Z80, grafica (PPU), memoria (MMU) e mapping delle cartucce, riprodotti fedelmente a partire dalla documentazione tecnica pubblica e verificati con ROM di test." },

  // Functional
  { id: "turing", n: "ft_turing", s: "42cursus-ft_turing", l: "Funzionale (es. OCaml)", xp: 9450, p: [2, 2], b: ["fun"], c: ["func", "math"], pdf: 209599, d: "Simulatore di macchina di Turing in un linguaggio funzionale (OCaml consigliato): legge la descrizione della macchina da JSON e la esegue passo passo; poi scrivi tu alcune macchine, ad esempio per riconoscere 0ⁿ1ⁿ." },
  { id: "ality", n: "ft_ality", s: "42cursus-ft_ality", l: "Funzionale (es. OCaml)", xp: 4200, p: [2, 2], b: ["fun"], c: ["game", "func", "math"], pdf: 210927, d: "Ricrei la modalità allenamento di un picchiaduro in un linguaggio funzionale: da una grammatica di mosse costruisci e alleni un automa a stati finiti che riconosce le combo dai tasti premuti." },

  // Imperative
  { id: "libasm", n: "libasm", s: "libasm", l: "ASM", xp: 966, p: [1, 1], b: ["imp", "unix"], c: ["low"], pdf: 216943, d: "Piccola libreria in assembly x86-64 con nasm e sintassi Intel: ft_strlen, ft_strcpy, ft_strcmp, ft_write, ft_read e ft_strdup, rispettando le convenzioni di chiamata e la gestione di errno." },
  { id: "zappy", n: "zappy", s: "42cursus-zappy", l: "Libero (server compilato)", xp: 25200, p: [2, 4], b: ["imp", "unix"], c: ["game", "net"], pdf: 209870, d: "Gioco multiplayer in rete via TCP, in gruppo: server in un linguaggio compilato a scelta che gestisce il mondo e le risorse, client IA autonomi (in qualsiasi linguaggio) che collaborano per salire di livello e un client grafico." },
  { id: "ftlinux", n: "ft_linux", s: "42cursus-ft_linux", l: "Shell", xp: 4200, p: [1, 1], b: ["imp", "unix"], c: ["low", "devops"], pdf: 212191, d: "Costruisci la tua distribuzione Linux da zero, sul modello di Linux From Scratch: toolchain, kernel compilato a mano, pacchetti base e avvio della macchina." },
  { id: "penguin", n: "little penguin", s: "42cursus-little-penguin-1", l: "C", xp: 9450, p: [1, 1], b: ["imp", "unix"], c: ["low"], pdf: 217550, d: "Primi passi nel kernel Linux, tratti dalla Eudyptula Challenge: compilare un kernel personalizzato, scrivere moduli, driver semplici e patch nello stile ufficiale del kernel." },
  { id: "taskmaster", n: "taskmaster", s: "42cursus-taskmaster", l: "Libero", xp: 9450, p: [2, 2], b: ["imp", "unix", "sys"], c: ["low", "devops"], pdf: 210912, d: "Gestore di processi in stile supervisord: avvia, controlla e riavvia programmi da un file di configurazione, con log e una shell di controllo interattiva." },
  { id: "strace", n: "strace", s: "42cursus-strace", l: "C", xp: 9450, p: [1, 1], b: ["imp", "unix"], c: ["low"], pdf: 209528, d: "Reimplementazione di strace: con ptrace segui un processo, intercetti ogni system call e stampi nome, argomenti e valore di ritorno, per 32 e 64 bit." },
  { id: "malloc", n: "malloc", s: "42cursus-malloc", l: "C", xp: 9450, p: [1, 1], b: ["imp", "unix"], c: ["low"], pdf: 214587, d: "Allocatore di memoria dinamica scritto da zero come libreria condivisa: malloc, free e realloc sopra mmap e munmap, con zone per allocazioni piccole, medie e grandi, una funzione che mostra lo stato della memoria e gestione dei thread." },
  { id: "mattdaemon", n: "Matt Daemon", s: "42cursus-matt-daemon", l: "C++", xp: 9450, p: [2, 2], b: ["imp", "unix"], c: ["net", "low"], pdf: 212499, d: "Demone Unix in C++: si stacca dal terminale, ascolta sulla porta 4242, registra ogni azione in un log con data e ora, impedisce avvii doppi con un lock file e gestisce i segnali." },
  { id: "nm", n: "nm", s: "nm", l: "C", xp: 9450, p: [1, 1], b: ["imp", "unix"], c: ["low"], pdf: 221637, d: "Reimplementazione di nm in C: apri i file ELF (x86_32, x64, file oggetto e librerie .so), leggi la tabella dei simboli e la stampi ordinata come il comando originale." },
  { id: "lemipc", n: "lem_ipc", s: "42cursus-lem-ipc", l: "C", xp: 9450, p: [1, 1], b: ["imp", "unix"], c: ["low"], pdf: 210295, d: "Gioco a squadre tra processi su una mappa condivisa, in C: comunicazione con memoria condivisa, semafori e code di messaggi System V." },
  { id: "kfs1", n: "kfs-1", s: "42cursus-kfs-1", l: "Libero + ASM", xp: 15750, p: [2, 2], b: ["imp", "unix"], c: ["low"], pdf: 209026, d: "Primo passo del kernel da zero: un kernel avviabile con GRUB, codice di partenza in assembly, linker script e interfaccia per scrivere a schermo. Linguaggio a scelta (C, C++, Rust…) più ASM." },
  { id: "malcolm", n: "ft_malcolm", s: "ft_malcolm", l: "C", xp: 6000, p: [1, 1], b: ["imp", "sec"], c: ["net", "sec"], pdf: 228824, d: "Ramo sicurezza di rete: un progetto in C sul protocollo ARP per capire come le macchine si trovano su una rete locale e perché questo meccanismo è fragile." },
  { id: "sslmd5", n: "ft_ssl_md5", s: "42cursus-ft_ssl_md5", l: "C", xp: 9450, p: [1, 1], b: ["imp", "sec"], c: ["sec", "math"], pdf: 205815, d: "Porta d'ingresso al ramo crittografia: ricrei in C una parte di OpenSSL, il comando ft_ssl con gli hash MD5 e SHA-256, con lettura da file, stdin e stringhe." },
  { id: "snowcrash", n: "Snowcrash", s: "42cursus-snow-crash", l: "Shell (reverse)", xp: 9450, p: [2, 2], b: ["imp", "sec"], c: ["sec"], pdf: 221871, d: "Porta d'ingresso al ramo sicurezza: livelli su una macchina virtuale in cui impari a osservare un sistema, trovare indizi e ragionare come un analista." },
  { id: "rainfall", n: "Rainfall", s: "42cursus-rainfall", l: "ASM (reverse)", xp: 25200, p: [2, 2], b: ["imp", "sec"], c: ["low", "sec"], pdf: 221872, d: "Ramo sicurezza: livelli su una macchina virtuale basati sull'analisi di programmi compilati, con debugger e lettura dell'assembly. Seguito di Snowcrash." },
  { id: "boot2root", n: "Boot2root", s: "42cursus-boot2root", l: "Sicurezza", xp: 11500, p: [2, 4], b: ["imp", "sec"], c: ["sec"], pdf: 221874, d: "Ramo sicurezza in gruppo: una macchina virtuale completa da analizzare dall'esterno fino ad averne il pieno controllo, documentando ogni percorso trovato." },
  { id: "ftshield", n: "ft_shield", s: "42cursus-ft_shield", l: "C o ASM", xp: 15750, p: [2, 2], b: ["imp", "sec"], c: ["net", "sec"], pdf: 209357, d: "Ramo sicurezza: progetto in C sullo studio dei meccanismi di persistenza e di accesso remoto in un sistema Linux. Obiettivi e vincoli nel subject." },
  { id: "woody", n: "Woody Woodpacker", s: "42cursus-woody-woodpacker", l: "C (+ ASM)", xp: 9450, p: [2, 2], b: ["imp", "sec"], c: ["low", "sec"], pdf: 206044, d: "Ramo sicurezza: progetto sul formato dei binari ELF e sulla cifratura del loro contenuto. Obiettivi e vincoli nel subject." },
  { id: "famine", n: "Famine", s: "42cursus-famine", l: "C o ASM", xp: 9450, p: [2, 2], b: ["imp", "sec"], c: ["low", "sec"], pdf: 212052, d: "Ramo sicurezza: progetto sul formato dei binari ELF e su come un file eseguibile può essere modificato. Obiettivi e vincoli nel subject." },
  { id: "ftselect", n: "ft_select", s: "42cursus-ft_select", l: "C", xp: 4200, p: [1, 1], b: ["imp", "unix"], c: ["low"], pdf: 208555, d: "Interfaccia a terminale con termcaps: mostra una lista su più colonne, la navighi con le frecce, selezioni elementi e restituisci la scelta alla shell." },
  { id: "ftscript", n: "ft_script", s: "42cursus-ft_script", l: "C", xp: 4200, p: [1, 1], b: ["imp", "unix"], c: ["low"], pdf: 215689, d: "Reimplementazione del comando script: apri un pseudo-terminale, registri tutto quello che accade nella sessione e puoi rigiocarla." },

  // RNCP 7 · Unix/Kernel
  { id: "kfs3", n: "kfs-3", s: "42cursus-kfs-3", l: "Libero + ASM", xp: 35700, p: [2, 2], b: ["unix"], c: ["low"], pdf: 208611, d: "Memoria del kernel da zero: paginazione, diritti di lettura e scrittura, separazione tra spazio kernel e utente, memoria fisica e virtuale con le funzioni di allocazione (kmalloc, vmalloc…) e gestione dei kernel panic." },
  { id: "kfs4", n: "kfs-4", s: "42cursus-kfs-4", l: "Libero + ASM", xp: 25200, p: [2, 2], b: ["unix"], c: ["low"], pdf: 210779, d: "Interruzioni nel kernel: Interrupt Descriptor Table, interruzioni hardware e software, segnali con callback e scheduling, salvataggio dello stack e pulizia dei registri prima di un panic, gestione della tastiera tramite IDT." },
  { id: "kfs5", n: "kfs-5", s: "42cursus-kfs-5", l: "Libero + ASM", xp: 35700, p: [2, 2], b: ["unix"], c: ["low"], pdf: 210529, d: "Processi nel kernel: struttura con PID, stato, padre e figli, stack e heap, segnali in coda e proprietario, più le funzioni per accodare segnali, gestire la memoria di un processo, copiarlo (fork) e farlo comunicare tramite socket." },
  { id: "kfs6", n: "kfs-6", s: "42cursus-kfs-6", l: "Libero + ASM", xp: 25200, p: [2, 2], b: ["unix"], c: ["low"], pdf: 210527, d: "Dischi e filesystem nel kernel: lettura e scrittura di un disco IDE, lettura e scrittura di un filesystem ext2 e un albero di base con /sys, /var, /dev e /proc." },
  { id: "kfs7", n: "kfs-7", s: "42cursus-kfs-7", l: "Libero + ASM", xp: 35700, p: [2, 2], b: ["unix"], c: ["low"], pdf: 217425, d: "Il kernel diventa un ambiente Unix: tabella e sistema delle syscall, account utente con login e password, socket tra processi e gerarchia dei file in stile Unix." },
  { id: "kfs8", n: "kfs-8", s: "42cursus-kfs-8", l: "Libero + ASM", xp: 15750, p: [2, 2], b: ["unix"], c: ["low"], pdf: 208606, d: "Kernel modulare: API interna per registrare, caricare all'avvio e rimuovere moduli, con callback configurabili tra kernel e modulo. Si dimostra con un modulo tastiera e un modulo orologio." },
  { id: "kfs9", n: "kfs-9", s: "42cursus-kfs-9", l: "Libero + ASM", xp: 15750, p: [2, 2], b: ["unix"], c: ["low"], pdf: 208596, d: "Esecuzione di programmi: parser e loader di file ELF, una syscall simile a execve che crea il processo, e moduli del kernel in formato ELF caricati e rimossi a runtime." },
  { id: "kfs10", n: "kfs-10", s: "42cursus-kfs-x", l: "Libero + ASM", xp: 35700, p: [2, 2], b: ["unix"], c: ["low"], pdf: 208912, d: "Ultimo passo della serie KFS: sul tuo kernel installi una shell POSIX, una libc completa e i comandi Unix di base (cat, chmod, cp, ls, kill…), fino ad avere un sistema operativo completo." },
  { id: "lkfs", n: "filesystem", s: "42cursus-filesystem", l: "C (kernel Linux)", xp: 15750, p: [2, 2], b: ["unix"], c: ["low"], pdf: 208599, d: "Nuovo filesystem da zero come modulo del kernel Linux, sulla distribuzione di ft_linux: superblock e inode, cartelle, file, proprietario, permessi e link, più un programma che formatta l'immagine del disco." },
  { id: "drivers", n: "drivers-and-interrupts", s: "42cursus-drivers-and-interrupts", l: "C (kernel Linux)", xp: 15750, p: [1, 1], b: ["unix"], c: ["low"], pdf: 208587, d: "Driver della tastiera per il kernel Linux, sulla distribuzione di ft_linux: registri le interruzioni (IRQ), annoti ogni tasto premuto o rilasciato con l'orario e rendi il registro leggibile da un misc device." },
  { id: "procmem", n: "process-and-memory", s: "42cursus-process-and-memory", l: "C (kernel Linux)", xp: 9450, p: [1, 1], b: ["unix"], c: ["low"], pdf: 209676, d: "Aggiungi una system call al kernel Linux della tua distribuzione ft_linux: restituisce le informazioni su un processo (stato, stack, età, figli, padre) a partire dal suo PID." },
  { id: "userspace", n: "userspace_digressions", s: "42cursus-userspace_digressions", l: "Libero", xp: 16800, p: [2, 2], b: ["unix"], c: ["low", "devops"], pdf: 209487, d: "Il tuo programma init, con PID 1: monta i filesystem del kernel e le partizioni, carica i moduli, avvia syslog, swap, console, rete e demoni e li tiene d'occhio, più almeno due funzioni a scelta (initramfs, partizioni cifrate…)." },

  // RNCP 7 · System administration
  { id: "cloud1", n: "cloud-1", s: "42cursus-cloud-1", l: "Ansible · Docker", xp: 9450, p: [2, 2], b: ["sys"], c: ["devops", "web"], pdf: 208938, d: "Il sito di Inception deployato su un server cloud in modo del tutto automatico (Ansible consigliato): WordPress, phpMyAdmin e database in container separati, dati persistenti, riavvio automatico, TLS e deploy su più server." },
  { id: "ping", n: "ft_ping", s: "42cursus-ft_ping", l: "C", xp: 4200, p: [1, 1], b: ["sys"], c: ["net"], pdf: 208554, d: "Reimplementazione di ping in C, prendendo come riferimento quello di inetutils: invii pacchetti ICMP a un indirizzo IPv4 o a un nome host e misuri il tempo di andata e ritorno." },
  { id: "traceroute", n: "ft_traceroute", s: "42cursus-ft_traceroute", l: "C", xp: 4200, p: [1, 1], b: ["sys"], c: ["net"], pdf: 221754, d: "Reimplementazione di traceroute in C, con la sola libc: mostri il percorso dei pacchetti verso un host IPv4, salto per salto." },
  { id: "nmap", n: "ft_nmap", s: "42cursus-ft_nmap", l: "C", xp: 15750, p: [2, 2], b: ["sys"], c: ["net", "sec"], pdf: 215019, d: "Reimplementazione di una parte di nmap in C con libpcap e pthread: scansioni le porte di un host con vari tipi di scan, in parallelo su più thread, e riconosci i servizi." },
  { id: "ioc", n: "Inception of Context", s: "inception-of-context", l: "Libero (es. Python) · LLM locale", xp: 19800, p: [2, 3], b: ["sys"], c: ["devops", "ai"], pdf: 228205, d: "Assistente al codice che gira tutto in locale, in tre parti: indice vettoriale di un progetto sempre sincronizzato, API che risponde alle domande con un piccolo modello linguistico (RAG), poi modifiche al codice generate, applicate e validate, con ritorno indietro se falliscono." },
  { id: "iow", n: "Inception of Wisdom", s: "inception-of-wisdom", l: "Python · LLM locale", xp: 21600, p: [2, 3], b: ["sys"], c: ["devops", "ai"], pdf: 228206, d: "Agente in Python con un modello linguistico locale che sorveglia un servizio in container: legge stato, log e risposte HTTP, riconosce i crash e propone correzioni, fino al redeploy automatico. Prosegue Inception of Things e Inception of Context." },
  { id: "lgtm", n: "ft_lgtm", s: "ft_lgtm", l: "Libero (WASM) · Kubernetes", xp: 16200, p: [2, 2], b: ["sys"], c: ["devops", "web"], pdf: 228204, d: "Playground web per eseguire codice in sicurezza in una sandbox WASM, con condivisione su IPFS, tutto su un cluster Kubernetes locale e monitorato con lo stack LGTM (Loki, Grafana, Tempo, Mimir) e OpenTelemetry." },

  // RNCP 7 · Security
  { id: "pcyber", n: "Piscine Cybersecurity", s: "cybersecurity", l: "Libero", xp: 9450, p: [1, 1], b: ["sec"], c: ["sec"], pdf: 213170, d: "Piscine di sicurezza informatica in moduli brevi, ognuno su un tema: web e metadati, password monouso, anonimato in rete, analisi di programmi, cifratura di file, reti locali e database. Obiettivi e vincoli nei subject dei moduli." },
  { id: "htb", n: "UnleashTheBox", s: "unleashthebox", l: "HackTheBox", xp: 15750, p: [1, 1], b: ["sec"], c: ["sec"], pdf: 212058, d: "Ramo sicurezza sulla piattaforma HackTheBox: prima il percorso introduttivo, poi le stagioni, fino a raggiungere il livello minimo richiesto. Il progetto non si può ripetere." },

  // RNCP 7 · Artificial Intelligence
  { id: "pyds", n: "Piscine Python for Data Science", s: "python-for-data-science", l: "Python", xp: 4725, p: [1, 1], b: ["ai"], c: ["ai"], pdf: 211905, d: "Piscine di Python 3.10 in cinque moduli: basi del linguaggio, array e immagini con NumPy, tabelle di dati con pandas, programmazione a oggetti e design orientato ai dati." },
  { id: "pds", n: "Piscine Data Science", s: "piscine-data-science", l: "SQL · Libero", xp: 4725, p: [1, 1], b: ["ai"], c: ["ai"], pdf: 220007, d: "Piscine sui dati in cinque moduli: creazione di un database PostgreSQL, data warehouse, visualizzazione dei dati, analisi e modelli per prevedere l'andamento futuro." },
  { id: "linreg", n: "ft_linear_regression", s: "42cursus-ft_linear_regression", l: "Libero", xp: 4200, p: [1, 1], b: ["ai"], c: ["ai", "math"], pdf: 212344, d: "Primo algoritmo di machine learning: prevedi il prezzo di un'auto dal chilometraggio con una regressione lineare allenata con la discesa del gradiente, scritta da te senza librerie che facciano il lavoro." },
  { id: "dslr", n: "DSLR", s: "42cursus-dslr", l: "Libero (es. Python)", xp: 6000, p: [2, 2], b: ["ai"], c: ["ai"], pdf: 211419, d: "Data science e regressione logistica: analizzi e visualizzi un dataset (statistiche descrittive, istogrammi, scatter plot) e alleni un classificatore one-vs-all che smista gli studenti di Hogwarts nelle case." },
  { id: "mlp", n: "Multilayer Perceptron", s: "42cursus-multilayer-perceptron", l: "Libero", xp: 9450, p: [1, 1], b: ["ai"], c: ["ai"], pdf: 209575, d: "Rete neurale scritta da zero, senza librerie di reti neurali: feedforward, backpropagation e discesa del gradiente per classificare tumori al seno come benigni o maligni a partire da un dataset." },
  { id: "gomoku", n: "Gomoku", s: "42cursus-gomoku", l: "Libero", xp: 25200, p: [2, 2], b: ["ai"], c: ["ai", "game"], pdf: 208550, d: "Gomoku con interfaccia grafica e un'IA che deve battere i giocatori umani: algoritmo Min-Max e soprattutto una funzione euristica efficace e veloce. Anche partita tra due umani con suggerimento delle mosse." },
  { id: "expert", n: "Expert System", s: "42cursus-expert-system", l: "Libero", xp: 9450, p: [2, 2], b: ["ai"], c: ["ai", "math"], pdf: 210325, d: "Sistema esperto per il calcolo proposizionale: un motore a backward chaining legge regole e fatti da file e risponde alle domande con vero, falso o indeterminato, gestendo AND, OR, XOR, negazioni e parentesi." },
  { id: "krpsim", n: "Krpsim", s: "42cursus-krpsim", l: "Libero", xp: 9450, p: [2, 3], b: ["ai"], c: ["ai", "math"], pdf: 211241, d: "Ottimizzazione di una catena di processi: da un file con scorte e processi trovi una sequenza che massimizza un risultato o riduce il tempo, più un programma che verifica la soluzione." },
  { id: "matrix", n: "Matrix", s: "matrix", l: "Libero (prototipi in Rust)", xp: 7000, p: [1, 1], b: ["ai"], c: ["math"], pdf: 210505, d: "Algebra lineare senza librerie matematiche: vettori e matrici, combinazioni lineari, prodotto scalare e vettoriale, norme, trasposta, forma a scalini, determinante, inversa e rango." },
  { id: "rsb", n: "Ready set boole", s: "ready-set-boole", l: "Libero (prototipi in Rust)", xp: 7000, p: [1, 1], b: ["ai"], c: ["math"], pdf: 212628, d: "Algebra booleana e teoria degli insiemi, senza librerie matematiche: addizioni e moltiplicazioni con operatori bit a bit, codice Gray, tabelle di verità, forme normali, SAT, insiemi e curve che riempiono lo spazio." },
  { id: "leaffliction", n: "Leaffliction", s: "leaffliction", l: "Libero (es. Python)", xp: 15750, p: [2, 3], b: ["ai"], c: ["ai"], pdf: 212502, d: "Visione artificiale: riconosci le malattie delle piante dalle foto delle foglie, con analisi e bilanciamento del dataset, trasformazioni delle immagini e un classificatore." },
  { id: "learn2slither", n: "Learn2Slither", s: "learn2slither", l: "Libero (es. Python)", xp: 9450, p: [1, 1], b: ["ai"], c: ["ai", "game"], pdf: 225974, d: "Apprendimento per rinforzo: un serpente su una griglia 10×10 impara da solo a mangiare le mele giuste e a sopravvivere, con Q-learning e una visione limitata del campo." },
];

// minXp e minN sono i minimi del regolamento, dalle liste ufficiali RNCP dell'intra (lists/official/)
const BLOCKS: Record<BlockId, Block> = {
  suite:  { name: "Suite", minXp: 0, minN: 1, rule: "1 progetto" },
  // RNCP 6
  web:    { name: "Web", minXp: 15000, minN: 2, rule: "15 000 XP e 2 progetti" },
  mobile: { name: "Mobile", minXp: 10000, minN: 2, rule: "10 000 XP e 2 progetti" },
  oop:    { name: "Object Oriented", minXp: 10000, minN: 2, rule: "10 000 XP e 2 progetti" },
  fun:    { name: "Functional", minXp: 10000, minN: 2, rule: "10 000 XP e 2 progetti" },
  imp:    { name: "Imperative", minXp: 10000, minN: 2, rule: "10 000 XP e 2 progetti" },
  // RNCP 7
  unix:   { name: "Unix/Kernel", minXp: 30000, minN: 2, rule: "30 000 XP e 2 progetti" },
  sys:    { name: "System administration", minXp: 50000, minN: 3, rule: "50 000 XP e 3 progetti" },
  sec:    { name: "Security", minXp: 50000, minN: 3, rule: "50 000 XP e 3 progetti" },
  webdb:  { name: "Web - Database", minXp: 50000, minN: 2, rule: "50 000 XP e 2 progetti" },
  ai:     { name: "Artificial Intelligence", minXp: 70000, minN: 3, rule: "70 000 XP e 3 progetti" },
};
// categorie dei filtri, nell'ordine dei bottoni; un progetto può averne più di una
const TAGS: Record<Tag, string> = {
  web: "Web", mobile: "Mobile", gfx: "Graphics", game: "Gaming", net: "Reti",
  low: "Kernel/LowLevel", devops: "DevOps/Container", sec: "CyberSec", ai: "IA/Data", oop: "OOP", func: "Funzionale", math: "Algoritmi/Math",
};
// i due titoli: la Suite è la stessa lista per entrambi
const TITLES: Record<TitleId, Title> = {
  6: {
    name: "RNCP 6",
    rules: "livello 17, 10 eventi, 2 esperienze professionali",
    level: 17, events: 10, exps: 2,
    options: {
      1: { name: "Opzione 1 · Web e mobile", blocks: ["suite", "web", "mobile"] },
      2: { name: "Opzione 2 · Software applicativo", blocks: ["suite", "oop", "fun", "imp"] },
    },
  },
  7: {
    name: "RNCP 7",
    rules: "livello 21, 15 eventi, 2 esperienze professionali",
    level: 21, events: 15, exps: 2,
    options: {
      1: { name: "Opzione 1 · Sistemi informativi e reti", blocks: ["suite", "unix", "sys", "sec"] },
      2: { name: "Opzione 2 · Basi di dati e data", blocks: ["suite", "webdb", "ai"] },
    },
  },
};
// blocchi e nome dell'opzione scelta, nel titolo scelto
const optBlocks = (): BlockId[] => TITLES[state.title].options[state.opt].blocks;
const optName = (): string => TITLES[state.title].options[state.opt].name;
const titleName = (): string => TITLES[state.title].name;
function setTitle(t: TitleId): void {
  state.title = t;
}
// l'altro titolo e i blocchi in cui un progetto conta lì (di tutte e due le sue opzioni)
const otherTitle = (): TitleId => (state.title === 6 ? 7 : 6);
const otherBlocks = (pr: Project): BlockId[] => {
  const all = Object.values(TITLES[otherTitle()].options).flatMap((o) => o.blocks);
  return pr.b.filter((x) => all.includes(x));
};

/* ---------- stato ---------- */
const KEY = "rncp6-plan-v1"; // nome storico: ora contiene anche il titolo
const state: State = { title: 6, opt: 2, picked: {}, marks: {}, level: null, events: 0, exps: 0, intra: null, team: "all", only: false, both: false, tags: new Set(), q: "", dayHours: 8 };

// Ore al giorno: quante ore lavori in una giornata (default 8); i giorni sono le ore dell'intra divise per questo numero
const DAY_HOURS_MIN = 1, DAY_HOURS_MAX = 24;
const validDayHours = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v >= DAY_HOURS_MIN && v <= DAY_HOURS_MAX;
const fmtDayHours = (v: number): string => v.toLocaleString("it-IT", { maximumFractionDigits: 2 });

const STATUS_NAMES: Record<Status, string> = { todo: "Da fare", doing: "In corso", done: "Fatto" };
const toStatus = (v: unknown): Status => (v === "doing" || v === "done" ? v : "todo"); // le scelte di prima (true) diventano "da fare"
// tiene solo i progetti che esistono ancora, con uno stato valido
function cleanPicked(raw: Record<string, unknown>): Record<string, Status> {
  const known = new Set(PROJECTS.map((pr) => pr.id));
  const out: Record<string, Status> = {};
  for (const [id, v] of Object.entries(raw)) if (known.has(id)) out[id] = toStatus(v);
  return out;
}
// voti: solo progetti esistenti e numeri tra 0 e 125 (il massimo con i bonus)
function cleanMarks(raw: unknown): Record<string, number> {
  const known = new Set(PROJECTS.map((pr) => pr.id));
  const out: Record<string, number> = {};
  if (raw && typeof raw === "object")
    for (const [id, v] of Object.entries(raw)) if (known.has(id) && typeof v === "number" && v >= 0 && v <= 125) out[id] = v;
  return out;
}
const LEVEL_MAX = 30;
const validLevel = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0 && v < LEVEL_MAX;
const validCount = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= 99;

try {
  const saved = JSON.parse(localStorage.getItem(KEY) || "null") as (Partial<State> & { picked?: Record<string, unknown> }) | null;
  if (saved) setTitle(saved.title === 7 ? 7 : 6);
  if (saved) Object.assign(state, {
    opt: saved.opt === 1 ? 1 : 2, picked: cleanPicked(saved.picked || {}), marks: cleanMarks(saved.marks),
    level: validLevel(saved.level) ? saved.level : null, dayHours: validDayHours(saved.dayHours) ? saved.dayHours : 8,
    events: validCount(saved.events) ? saved.events : 0, exps: validCount(saved.exps) ? saved.exps : 0,
    intra: saved.intra && typeof saved.intra.login === "string" && saved.intra.prev && typeof saved.intra.prev === "object" ? saved.intra : null,
  });
} catch { /* storage non disponibile: la pagina funziona lo stesso */ }
function save(): void {
  try { localStorage.setItem(KEY, JSON.stringify({ title: state.title, opt: state.opt, picked: state.picked, marks: state.marks, level: state.level, events: state.events, exps: state.exps, intra: state.intra, dayHours: state.dayHours })); } catch {}
  writeLinked();
}

/* ---------- logica ---------- */
const fmt = (n: number): string => n.toLocaleString("it-IT").replace(/\./g, " ");
function peopleLabel(pr: Project): string {
  const p = pr.p;
  if (!p) return "persone n.d.";
  return p[0] === p[1] ? (p[0] === 1 ? "1 persona" : p[0] + " persone") : p[0] + "–" + p[1] + " persone";
}
// ore stimate dall'intra, per slug: le scrive hours.js (npm run hours)
declare const INTRA_HOURS: Record<string, number> | undefined;
function hours(pr: Project): number | null {
  const h = typeof INTRA_HOURS === "undefined" ? undefined : INTRA_HOURS[pr.s];
  return h ?? null;
}
const workDays = (h: number): number => (h > 0 ? Math.max(1, Math.round(h / state.dayHours)) : 0); // almeno 1 se c'è lavoro
// giorni di calendario: ogni 5 giorni lavorativi si aggiunge un weekend (2 giorni),
// ma non dopo l'ultima settimana: 5 lavorativi = 5 giorni, 6 lavorativi = 8 giorni
const calendarDays = (w: number): number => (w > 0 ? w + 2 * Math.floor((w - 1) / 5) : 0);
const daysLabel = (h: number): string => {
  const d = calendarDays(workDays(h));
  return "~" + fmt(d) + (d === 1 ? " giorno" : " giorni");
};
// "~36 giorni (26 lavorativi, 210 h)"
const daysDetail = (h: number): string => {
  const w = workDays(h);
  return daysLabel(h) + " (" + fmt(w) + (w === 1 ? " lavorativo, " : " lavorativi, ") + fmt(h) + " h)";
};
const timeLabel = (pr: Project): string => {
  const h = hours(pr);
  return h == null ? "tempo n.d." : daysDetail(h);
};
const pageUrl = (pr: Project): string => "https://projects.intra.42.fr/projects/" + pr.s;
// PDF del subject sul CDN di 42: pubblico, si apre senza login
const subjectPdf = (pr: Project): string | null =>
  pr.pdf == null ? null : "https://cdn.intra.42.fr/pdf/pdf/" + pr.pdf + "/en.subject.pdf";
// XP di un progetto: per quelli fatti con il voto dell'intra scalano col voto (125 = +25%), gli altri valgono a voto 100
function xpOf(pr: Project): number | null {
  if (pr.xp == null) return null;
  const mark = state.picked[pr.id] === "done" ? state.marks[pr.id] : undefined;
  return mark == null ? pr.xp : Math.round(pr.xp * mark / 100);
}
// XP totali per arrivare a ogni livello del 42cursus (0…30), dall'API di 42 via experience_21.json di 42calculator
const LEVEL_XP = [0, 462, 2688, 5885, 11777, 29217, 46255, 63559, 74340, 85483, 95000, 105630, 124446, 145782, 169932,
  197316, 228354, 263508, 303366, 348516, 399672, 457632, 523320, 597786, 682164, 777756, 886074, 1008798, 1147902, 1305486, 1484070];
// livello 12,45 = 45% della strada tra il 12 e il 13
function levelToXp(level: number): number {
  const i = Math.min(Math.floor(level), LEVEL_XP.length - 2);
  return LEVEL_XP[i] + (level - i) * (LEVEL_XP[i + 1] - LEVEL_XP[i]);
}
function xpToLevel(xp: number): number {
  let i = 0;
  while (i < LEVEL_XP.length - 2 && xp >= LEVEL_XP[i + 1]) i++;
  return i + Math.min((xp - LEVEL_XP[i]) / (LEVEL_XP[i + 1] - LEVEL_XP[i]), 1);
}
const fmtLevel = (v: number): string => (Math.floor(v * 100) / 100).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// XP che il piano aggiunge al livello attuale: i progetti scelti non ancora fatti (quelli fatti sono già nel livello)
const pendingXp = (): number => PROJECTS.reduce((s, pr) => s + (state.picked[pr.id] && state.picked[pr.id] !== "done" ? xpOf(pr) || 0 : 0), 0);

// n, xp, done: tutti i progetti scelti (il piano) · dn, dxp, valid: solo quelli fatti
function tally(blockId: BlockId): { n: number; xp: number; done: boolean; dn: number; dxp: number; valid: boolean } {
  const blk = BLOCKS[blockId];
  const chosen = PROJECTS.filter((pr) => pr.b.includes(blockId) && state.picked[pr.id]);
  const made = chosen.filter((pr) => state.picked[pr.id] === "done");
  const sum = (list: Project[]): number => list.reduce((s, pr) => s + (xpOf(pr) || 0), 0);
  const xp = sum(chosen), dxp = sum(made);
  return {
    n: chosen.length, xp, done: chosen.length >= blk.minN && xp >= blk.minXp,
    dn: made.length, dxp, valid: made.length >= blk.minN && dxp >= blk.minXp,
  };
}
// quanto di un blocco è coperto, da 0 a 1: conta il requisito più indietro tra progetti e XP
const coverage = (blk: Block, n: number, xp: number): number =>
  Math.min(n / blk.minN, blk.minXp ? xp / blk.minXp : 1, 1);
function visible(pr: Project): boolean {
  if (state.only && !state.picked[pr.id]) return false;
  if (state.both && !otherBlocks(pr).length) return false;
  if (state.tags.size && !pr.c.some((t) => state.tags.has(t))) return false; // basta una delle categorie accese
  const p = pr.p;
  if (state.team === "solo" && !(p && p[0] === 1)) return false;
  if (state.team === "group" && !(p && p[1] > 1)) return false;
  if (state.q && !(pr.n + " " + pr.d).toLowerCase().includes(state.q)) return false;
  return true;
}

/* ---------- render ---------- */
function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string | null, text?: string | null): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}
function byId<T extends HTMLElement = HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error("Elemento #" + id + " mancante");
  return node as T;
}

// spunta del blocco, nel pannello e accanto al nome del blocco:
// piena se è già validato con i progetti fatti, vuota se è solo coperto dal piano
function doneCheck(valid: boolean): HTMLElement {
  const check = el("span", "meter-check" + (valid ? "" : " planned"), "✓");
  check.setAttribute("aria-label", valid ? "Validato" : "Coperto dal piano");
  check.title = valid ? "Validato con i progetti fatti" : "Coperto dal piano, non ancora validato";
  return check;
}

function renderMeters(): void {
  const box = byId("meters");
  box.textContent = "";
  for (const id of optBlocks()) {
    const blk = BLOCKS[id], t = tally(id);
    const m = el("div", "meter" + (t.valid ? " done" : t.done ? " planned" : ""));
    const top = el("div", "meter-top");
    const name = el("span", "meter-name", blk.name);
    name.title = blk.name; // nella barra compatta il nome può essere tagliato
    top.append(name);
    if (t.done) top.append(doneCheck(t.valid));
    // due riempimenti: pieno per i progetti fatti, chiaro per il resto del piano
    const bar = el("div", "bar"), plan = el("i", "plan"), made = el("i");
    plan.style.width = Math.round(coverage(blk, t.n, t.xp) * 100) + "%";
    made.style.width = Math.round(coverage(blk, t.dn, t.dxp) * 100) + "%";
    bar.append(plan, made);
    const nums = el("div", "meter-nums");
    const a = el("span"); a.append(el("b", null, String(t.n)), "/" + blk.minN, el("span", "meter-unit", " progetti")); // "progetti" sparisce nella barra compatta
    nums.append(a);
    if (blk.minXp) { const b = el("span"); b.append(el("b", null, fmt(t.xp)), "/" + fmt(blk.minXp) + " XP"); nums.append(b); }
    m.title = "Fatti: " + t.dn + (t.dn === 1 ? " progetto" : " progetti") + (blk.minXp ? " · " + fmt(t.dxp) + " XP" : ""); // la barra piena sono i fatti, la chiara il resto del piano
    m.append(top, bar, nums);
    box.append(m);
  }
}

/* requisiti comuni: livello, eventi, esperienze. I campi restano gli stessi (non si perde il focus), cambiano testi e barre */
interface CommonMeter { box: HTMLElement; top: HTMLElement; name: HTMLElement; plan: HTMLElement; made: HTMLElement; info: HTMLElement; input: HTMLInputElement }
function commonMeter(label: string, inputLabel: string, onInput: (raw: string, input: HTMLInputElement) => void): CommonMeter {
  const box = el("div", "meter common");
  const top = el("div", "meter-top"), name = el("span", "meter-name", label);
  top.append(name);
  const bar = el("div", "bar"), plan = el("i", "plan"), made = el("i");
  bar.append(plan, made);
  const row = el("label", "meter-input");
  const input = el("input");
  input.type = "text";
  input.inputMode = "decimal";
  input.size = 5;
  input.setAttribute("aria-label", inputLabel);
  const info = el("span");
  row.append(input, info);
  input.addEventListener("input", () => onInput(input.value.trim().replace(",", "."), input));
  box.append(top, bar, row);
  byId("common").append(box);
  return { box, top, name, plan, made, info, input };
}
const parseCount = (raw: string): number | null => (/^\d{1,2}$/.test(raw) ? Number(raw) : null);
const mLevel = commonMeter("Livello", "Livello attuale nel 42cursus", (raw, input) => {
  const v = raw === "" ? null : Number(raw);
  const ok = v === null || validLevel(v);
  input.setAttribute("aria-invalid", String(!ok));
  if (!ok) return;
  state.level = v;
  save(); renderCommon();
});
const mEvents = commonMeter("Eventi", "Eventi a cui hai partecipato", (raw, input) => {
  const v = parseCount(raw);
  input.setAttribute("aria-invalid", String(v == null));
  if (v == null) return;
  state.events = v;
  save(); renderCommon();
});
const mExps = commonMeter("Esperienze professionali", "Esperienze professionali validate", (raw, input) => {
  const v = parseCount(raw);
  input.setAttribute("aria-invalid", String(v == null));
  if (v == null) return;
  state.exps = v;
  save(); renderCommon();
});
// stato di un riquadro: validato (verde pieno), coperto dal piano (bordo verde), da completare
function paintCommon(m: CommonMeter, have: number, planned: number, need: number): void {
  const valid = have >= need, covered = planned >= need;
  m.box.className = "meter common" + (valid ? " done" : covered ? " planned" : "");
  m.top.querySelector(".meter-check")?.remove();
  if (covered) m.top.append(doneCheck(valid));
  m.made.style.width = Math.round(Math.min(have / need, 1) * 100) + "%";
  m.plan.style.width = Math.round(Math.min(planned / need, 1) * 100) + "%";
}
function renderCommon(): void {
  const ttl = TITLES[state.title];
  const active = (inp: HTMLInputElement): boolean => document.activeElement === inp; // non riscrive il campo mentre ci scrivi
  // livello: le barre sono in XP, perché tra un livello e l'altro gli XP non sono costanti
  const need = levelToXp(ttl.level);
  if (state.level == null) {
    paintCommon(mLevel, 0, 0, need);
    mLevel.info.textContent = "livello attuale · minimo " + ttl.level;
  } else {
    const have = levelToXp(state.level), planned = have + pendingXp();
    paintCommon(mLevel, have, planned, need);
    const end = xpToLevel(planned);
    mLevel.info.textContent = (pendingXp() ? "→ " + fmtLevel(end) + " col piano" : "nessun progetto da fare") + " · minimo " + ttl.level
      + (planned < need ? " · mancano " + fmt(Math.ceil(need - planned)) + " XP" : "");
  }
  if (!active(mLevel.input)) mLevel.input.value = state.level == null ? "" : fmtLevel(state.level);
  // eventi ed esperienze: si contano a mano, il piano non li cambia
  paintCommon(mEvents, state.events, state.events, ttl.events);
  mEvents.info.textContent = "/" + ttl.events + " eventi";
  if (!active(mEvents.input)) mEvents.input.value = String(state.events);
  paintCommon(mExps, state.exps, state.exps, ttl.exps);
  mExps.info.textContent = "/" + ttl.exps + " esperienze";
  if (!active(mExps.input)) mExps.input.value = String(state.exps);
}
// quanto manca: i progetti scelti non ancora fatti, uno dopo l'altro, con le ore al giorno scelte
function renderLeft(): void {
  const box = byId("plan-left");
  box.title = "";
  // tutto validato: blocchi dell'opzione e requisiti comuni
  const ttl = TITLES[state.title];
  if (optBlocks().every((id) => tally(id).valid) && state.level != null && state.level >= ttl.level
    && state.events >= ttl.events && state.exps >= ttl.exps) {
    box.textContent = "";
    box.append(el("b", null, "Requisiti dell'" + ttl.name + " validati."), " Prima di fare domanda controlla sulla pagina RNCP dell'intra: è quella che fa fede.");
    return;
  }
  const left = PROJECTS.filter((pr) => state.picked[pr.id] && state.picked[pr.id] !== "done");
  if (!left.length) {
    box.textContent = Object.keys(state.picked).length ? "Tutti i progetti scelti sono fatti." : "Scegli i progetti cliccando sulle card: qui vedrai quanto tempo ti resta.";
    return;
  }
  const doing = left.filter((pr) => state.picked[pr.id] === "doing").length;
  const missing = left.filter((pr) => hours(pr) == null);
  const h = left.reduce((s, pr) => s + (hours(pr) || 0), 0);
  const days = calendarDays(workDays(h));
  box.textContent = "";
  box.append("Restano ", el("b", null, left.length + (left.length === 1 ? " progetto" : " progetti")),
    (doing ? " (" + doing + " in corso)" : "") + ": ", el("b", null, "~" + fmt(days) + (days === 1 ? " giorno" : " giorni")),
    days < 7 ? ". Se inizi oggi finisci verso il " : ", circa " + fmt(Math.round(days / 7)) + (Math.round(days / 7) === 1 ? " settimana" : " settimane") + ". Se inizi oggi finisci verso il ",
    el("b", null, dateIn(days)), ".");
  box.title = fmt(h) + " h stimate dall'intra a " + fmtDayHours(state.dayHours) + " h al giorno, weekend liberi; i progetti in corso contano per intero";
  if (missing.length) box.append(" Senza stima: " + missing.map((pr) => pr.n).join(", ") + ".");
}

for (const m of [mLevel, mEvents, mExps]) m.input.addEventListener("blur", () => { m.input.removeAttribute("aria-invalid"); renderCommon(); });

function card(pr: Project, blockId: BlockId): HTMLElement {
  const status = state.picked[pr.id];
  const c = el("article", "card" + (status ? " on " + status : ""));
  const key = blockId + ":" + pr.id;
  c.dataset.key = key;
  c.tabIndex = 0;
  c.setAttribute("aria-label", pr.n + (status ? ", scelto, " + STATUS_NAMES[status].toLowerCase() : ", non scelto"));
  // il clic sulla card sceglie il progetto (da fare) o lo toglie dal piano
  const toggle = (): void => {
    if (status) delete state.picked[pr.id]; else state.picked[pr.id] = "todo";
    save(); render();
  };
  // tutta la card seleziona, tranne i link e i bottoni dello stato
  c.addEventListener("click", (e) => {
    if ((e.target as Element).closest("a, button")) return;
    if (window.getSelection()?.toString()) return; // stava selezionando testo
    toggle();
  });
  c.addEventListener("keydown", (e) => {
    if (e.target !== c || (e.key !== "Enter" && e.key !== " ")) return;
    e.preventDefault();
    toggle();
    document.querySelector<HTMLElement>('[data-key="' + key + '"]')?.focus();
  });
  const top = el("div", "card-top");
  top.append(el("h3", null, pr.n));
  if (status) {
    const seg = el("div", "seg status");
    seg.setAttribute("role", "group");
    seg.setAttribute("aria-label", "Stato di " + pr.n);
    for (const s of Object.keys(STATUS_NAMES) as Status[]) {
      const b = el("button", null, STATUS_NAMES[s]);
      b.type = "button";
      b.dataset.status = s;
      b.setAttribute("aria-pressed", String(s === status));
      b.addEventListener("click", () => {
        state.picked[pr.id] = s;
        save(); render();
        document.querySelector<HTMLElement>('[data-key="' + key + '"] [data-status="' + s + '"]')?.focus();
      });
      seg.append(b);
    }
    top.append(seg);
  }

  const facts = el("div", "facts");
  const xpChip = el("span", "fact", xpLabel(pr));
  const mark = state.picked[pr.id] === "done" ? state.marks[pr.id] : undefined;
  if (mark != null && pr.xp != null) xpChip.title = "Voto " + mark + " sull'intra: " + fmt(pr.xp) + " XP a voto 100";
  facts.append(xpChip);
  facts.append(el("span", "fact", peopleLabel(pr)));
  const h = hours(pr);
  const hf = el("span", "fact", h == null ? "giorni n.d." : daysLabel(h));
  hf.title = h == null ? "Stima non disponibile: npm run hours"
    : fmt(h) + " h stimate dall'intra, a " + fmtDayHours(state.dayHours) + " h al giorno: "
      + fmt(workDays(h)) + " giorni lavorativi più i weekend";
  facts.append(hf, el("span", "fact lang", pr.l));

  c.append(top, facts);
  if (pr.c.length) c.append(el("p", "tags-of", pr.c.map((t) => TAGS[t]).join(" · ")));
  c.append(el("p", "desc", pr.d));
  const others = pr.b.filter((x) => x !== blockId && optBlocks().includes(x)).map((x) => BLOCKS[x].name);
  if (others.length) c.append(el("p", "also", "Conta anche in: " + others.join(", ")));
  const inOther = otherBlocks(pr).map((x) => BLOCKS[x].name);
  if (inOther.length) c.append(el("p", "also", "Conta anche nell'" + TITLES[otherTitle()].name + ": " + inOther.join(", ")));
  const links = el("div", "links");
  const page = el("a", null, "Pagina del progetto ↗");
  page.href = pageUrl(pr);
  page.title = "Pagina del progetto sull'intra (serve il login 42)";
  const pdf = subjectPdf(pr);
  if (pdf) {
    const sub = el("a", null, "Subject ↗");
    sub.href = pdf;
    sub.title = "PDF del subject sul CDN di 42";
    links.append(sub);
  }
  links.append(page);
  links.querySelectorAll("a").forEach((a) => { a.target = "_blank"; a.rel = "noopener"; });
  c.append(links);
  return c;
}

// blocchi chiusi dall'utente: di default sono tutti aperti
const collapsed = new Set<BlockId>();
// nell'RNCP 7 un blocco già completo (anche con i progetti fatti per l'RNCP 6) mostra solo i progetti scelti;
// qui i blocchi in cui l'utente ha chiesto di vedere anche gli altri
const expandedDone = new Set<BlockId>();

function renderBlocks(): void {
  const root = byId("blocks");
  root.textContent = "";
  for (const id of optBlocks()) {
    const blk = BLOCKS[id];
    const sec = el("details", "block");
    sec.open = !collapsed.has(id);
    sec.addEventListener("toggle", () => { if (sec.open) collapsed.delete(id); else collapsed.add(id); });
    const head = el("summary", "block-head");
    const list = PROJECTS.filter((pr) => pr.b.includes(id));
    const t = tally(id), done = t.done;
    const hideRest = state.title === 7 && done && !expandedDone.has(id);
    const shown = list.filter((pr) => visible(pr) && (!hideRest || state.picked[pr.id]));
    const title = el("h2", null, blk.name);
    if (done) title.append(doneCheck(t.valid));
    head.append(title, el("span", null, "Minimo " + blk.rule + " · " + shown.length + " di " + list.length + " mostrati"));
    sec.append(head);
    if (state.title === 7 && done) {
      const hidden = list.filter((pr) => !state.picked[pr.id]).length;
      if (hidden) {
        const note = el("p", "empty", hideRest
          ? "Blocco già coperto dai progetti scelti: gli altri " + hidden + " sono nascosti. "
          : "Blocco già coperto dai progetti scelti. ");
        const btn = el("button", "link", hideRest ? "Mostra tutti" : "Mostra solo gli scelti");
        btn.type = "button";
        btn.addEventListener("click", () => { if (hideRest) expandedDone.add(id); else expandedDone.delete(id); renderBlocks(); });
        note.append(btn);
        sec.append(note);
      }
    }
    if (shown.length) {
      const grid = el("div", "grid");
      shown.forEach((pr) => grid.append(card(pr, id)));
      sec.append(grid);
    } else sec.append(el("p", "empty", "Nessun progetto con questi filtri."));
    root.append(sec);
  }
}

const titleButtons = document.querySelectorAll<HTMLButtonElement>("[data-title]");
const optButtons = document.querySelectorAll<HTMLButtonElement>("[data-opt]");
const teamButtons = document.querySelectorAll<HTMLButtonElement>("[data-team]");
const toTitle = (v: string | undefined): TitleId => (v === "7" ? 7 : 6);
const toOpt = (v: string | undefined): OptionId => (v === "1" ? 1 : 2);
const toTeam = (v: string | undefined): Team => (v === "solo" || v === "group" ? v : "all");

const dayHoursInput = byId<HTMLInputElement>("day-hours");

function render(): void {
  // nomi delle opzioni e requisiti comuni cambiano con il titolo scelto
  byId("common-rules").textContent = TITLES[state.title].rules;
  renderCommon();
  titleButtons.forEach((b) => b.setAttribute("aria-pressed", String(toTitle(b.dataset.title) === state.title)));
  optButtons.forEach((b) => {
    const opt = toOpt(b.dataset.opt);
    b.textContent = TITLES[state.title].options[opt].name;
    b.setAttribute("aria-pressed", String(opt === state.opt));
  });
  teamButtons.forEach((b) => b.setAttribute("aria-pressed", String(toTeam(b.dataset.team) === state.team)));
  if (document.activeElement !== dayHoursInput) dayHoursInput.value = fmtDayHours(state.dayHours); // non disturba chi sta scrivendo
  renderMeters();
  renderLeft();
  renderSession();
  renderBlocks();
}

titleButtons.forEach((b) => b.addEventListener("click", () => { setTitle(toTitle(b.dataset.title)); save(); render(); }));
optButtons.forEach((b) => b.addEventListener("click", () => { state.opt = toOpt(b.dataset.opt); save(); render(); }));
teamButtons.forEach((b) => b.addEventListener("click", () => { state.team = toTeam(b.dataset.team); render(); }));
const q = byId<HTMLInputElement>("q");
q.addEventListener("input", () => { state.q = q.value.trim().toLowerCase(); renderBlocks(); });
// accetta anche la virgola come separatore decimale ("6,5")
dayHoursInput.addEventListener("input", () => {
  const v = Number(dayHoursInput.value.replace(",", "."));
  const ok = dayHoursInput.value.trim() !== "" && validDayHours(v);
  dayHoursInput.setAttribute("aria-invalid", String(!ok));
  if (!ok || v === state.dayHours) return;
  state.dayHours = v;
  save();
  renderLeft();
  renderBlocks();
});
dayHoursInput.addEventListener("blur", () => { dayHoursInput.value = fmtDayHours(state.dayHours); dayHoursInput.removeAttribute("aria-invalid"); });
const only = byId<HTMLInputElement>("only");
only.addEventListener("change", () => { state.only = only.checked; renderBlocks(); });
const both = byId<HTMLInputElement>("both");
both.addEventListener("change", () => { state.both = both.checked; renderBlocks(); });

// bottoni delle categorie: si accendono e spengono uno per uno
const tagBox = byId("tags");
for (const t of Object.keys(TAGS) as Tag[]) {
  const b = el("button", null, TAGS[t]);
  b.type = "button";
  b.setAttribute("aria-pressed", "false");
  b.addEventListener("click", () => {
    if (state.tags.has(t)) state.tags.delete(t); else state.tags.add(t);
    b.setAttribute("aria-pressed", String(state.tags.has(t)));
    renderBlocks();
  });
  tagBox.append(b);
}
byId("reset").addEventListener("click", () => { state.picked = {}; save(); render(); });

// i filtri restano in alto sotto la barra dei requisiti (style.css): passa al CSS l'altezza della barra, che cambia con il contenuto
const reqsBar = document.querySelector<HTMLElement>(".reqs:not(.reqs-common)");
if (reqsBar) new ResizeObserver(() => {
  document.documentElement.style.setProperty("--reqs-h", reqsBar.offsetHeight + "px");
}).observe(reqsBar);

// mentre scorri la barra si compatta in modo continuo: si accorcia di un pixel per ogni pixel di scroll,
// finché i selettori RNCP/Opzione non sono spariti. Il margine sotto restituisce l'altezza persa,
// così il contenuto sotto scorre insieme al dito e la pagina non salta (style.css usa --p e --head-h)
const wide = matchMedia("(min-width: 860px)");
const reqsPrev = reqsBar?.previousElementSibling;
const reqsHead = reqsBar?.querySelector<HTMLElement>(".reqs-head");
let compactQueued = false;
function compactReqs(): void {
  compactQueued = false;
  if (!reqsBar || !reqsPrev || !reqsHead) return;
  if (!wide.matches) { reqsBar.style.removeProperty("--p"); return; }
  // letture prima delle scritture: un solo calcolo del layout per frame
  const head = reqsHead.scrollHeight;
  const gap = parseFloat(getComputedStyle(reqsBar.parentElement!).rowGap) || 0;
  const start = reqsPrev.getBoundingClientRect().bottom + scrollY + gap; // dove la barra comincia a restare ferma
  const lost = head + 24; // selettori + spazio sotto + 6 px di padding sopra e sotto (style.css)
  const p = Math.min(Math.max((scrollY - start) / lost, 0), 1);
  reqsBar.style.setProperty("--head-h", head + "px");
  reqsBar.style.setProperty("--p", String(p));
}
function queueCompact(): void {
  if (compactQueued) return;
  compactQueued = true;
  requestAnimationFrame(compactReqs);
}
addEventListener("scroll", queueCompact, { passive: true });
addEventListener("resize", queueCompact);
wide.addEventListener("change", queueCompact);
compactReqs();

/* ---------- salva / carica piano come file JSON ----------
 * Su Chrome/Edge (File System Access API) il file scelto resta collegato:
 * ogni modifica lo riscrive e alla riapertura la pagina lo rilegge.
 * Altrove "Salva" scarica il file e "Carica" lo legge una volta sola.
 */
interface PlanFile {
  version: 1 | 2;
  title?: TitleId; // assente nei piani salvati prima dell'RNCP 7: vale 6
  opt: OptionId;
  picked: string[]; // tutti i progetti scelti (nei piani versione 1 l'unico campo: valgono "da fare")
  status?: Record<string, Status>; // dalla versione 2: lo stato di ogni progetto scelto
  marks?: Record<string, number>; // voti dei progetti fatti
  level?: number | null; // livello nel 42cursus
  events?: number;
  exps?: number;
  source?: "intra"; // file scritto da npm run me: si unisce al piano invece di sostituirlo
  login?: string;
  date?: string;
  dayHours?: number; // i piani vecchi avevano "pace" (moltiplicatore delle ore), ora ignorato
}

// parti della File System Access API non ancora nei tipi DOM di TypeScript
type PermState = "granted" | "denied" | "prompt";
interface PlanHandle extends FileSystemFileHandle {
  queryPermission(opts: { mode: "readwrite" }): Promise<PermState>;
  requestPermission(opts: { mode: "readwrite" }): Promise<PermState>;
}
interface PickerOpts {
  suggestedName?: string;
  types?: { description: string; accept: Record<string, string[]> }[];
}
interface FsWindow {
  showOpenFilePicker?: (opts?: PickerOpts) => Promise<PlanHandle[]>;
  showSaveFilePicker?: (opts?: PickerOpts) => Promise<PlanHandle>;
}

const fsw = window as unknown as FsWindow;
const canLink = typeof fsw.showOpenFilePicker === "function" && typeof fsw.showSaveFilePicker === "function";
// nome dei file salvati ed esportati: piano-rncp.json, piano-rncp.md (il piano vale per entrambi i titoli)
const fileName = (ext: string): string => "piano-rncp." + ext;
const picker = (): PickerOpts => ({
  suggestedName: fileName("json"),
  types: [{ description: "Piano RNCP", accept: { "application/json": [".json"] } }],
});
const planStatus = byId("plan-status");
const reconnect = byId<HTMLButtonElement>("reconnect");
let linked: PlanHandle | null = null;

const planJson = (): string =>
  JSON.stringify({
    version: 2, title: state.title, opt: state.opt, picked: Object.keys(state.picked), status: state.picked,
    marks: state.marks, level: state.level, events: state.events, exps: state.exps, dayHours: state.dayHours,
  } satisfies PlanFile, null, 2);

function applyPlan(text: string): void {
  const plan = JSON.parse(text) as Partial<PlanFile>;
  if (!Array.isArray(plan.picked)) throw new Error("campo picked mancante");
  // tiene solo gli id che esistono ancora nella lista dei progetti
  const raw: Record<string, unknown> = {};
  for (const id of plan.picked) if (typeof id === "string") raw[id] = plan.status?.[id];
  state.picked = cleanPicked(raw);
  state.marks = cleanMarks(plan.marks);
  state.level = validLevel(plan.level) ? plan.level : null;
  state.events = validCount(plan.events) ? plan.events : 0;
  state.exps = validCount(plan.exps) ? plan.exps : 0;
  setTitle(plan.title === 7 ? 7 : 6);
  state.opt = plan.opt === 1 ? 1 : 2;
  if (validDayHours(plan.dayHours)) state.dayHours = plan.dayHours;
}

// file di npm run me: aggiorna stati, voti e livello e lascia com'è il resto del piano (i "da fare", il titolo, l'opzione)
function mergeIntra(text: string): string {
  const plan = JSON.parse(text) as Partial<PlanFile>;
  if (plan.source !== "intra" || !plan.status) throw new Error("non è un file di npm run me");
  const got = cleanPicked(plan.status);
  // ricorda lo stato di prima dei progetti che l'import cambia, per ripristinarlo con "Esci";
  // con lo stesso login vale lo stato di prima del primo import
  const login = plan.login || "intra";
  const prev = state.intra && state.intra.login === login ? state.intra.prev : {};
  for (const id of Object.keys(got)) if (!(id in prev)) prev[id] = state.picked[id] || "";
  state.intra = { login, date: plan.date || "", prev };
  Object.assign(state.picked, got);
  Object.assign(state.marks, cleanMarks(plan.marks));
  if (validLevel(plan.level)) state.level = plan.level;
  const n = Object.values(got);
  return "Dall'intra" + (plan.login ? " (" + plan.login + (plan.date ? ", " + plan.date : "") + ")" : "") + ": "
    + n.filter((s) => s === "done").length + (n.filter((s) => s === "done").length === 1 ? " fatto, " : " fatti, ")
    + n.filter((s) => s === "doing").length + " in corso";
}

// "Esci": riporta i progetti importati com'erano prima dell'import, e toglie voti, livello e login
function intraLogout(): void {
  const s = state.intra;
  if (!s) return;
  if (!confirm("Dimenticare i dati dell'intra di " + s.login + "?\n\nI progetti importati tornano com'erano prima dell'import; voti e livello vengono tolti. Il resto del piano non cambia.")) return;
  for (const [id, before] of Object.entries(s.prev)) {
    if (before) state.picked[id] = before; else delete state.picked[id];
    delete state.marks[id];
  }
  state.level = null;
  state.intra = null;
  try { localStorage.removeItem(LOGIN_KEY); } catch {}
  intraLogin.value = "";
  authMsg.textContent = "Dati dell'intra dimenticati.";
  intraMsg.textContent = "";
  save(); render();
}

// riga "Dati dell'intra di jdoe (2026-10-03) · Esci", visibile dopo un import
function renderSession(): void {
  const box = byId("intra-session");
  box.hidden = !state.intra;
  byId("auth-go").textContent = state.intra ? "Aggiorna dall'intra" : "Accedi con 42";
  if (!state.intra) return;
  byId("intra-who").textContent = "Dati dell'intra di " + state.intra.login + (state.intra.date ? " (" + state.intra.date + ")" : "");
}

function setStatus(text: string): void {
  planStatus.textContent = text;
  planStatus.hidden = !text;
}

// il collegamento al file sopravvive al ricaricamento grazie a IndexedDB
function idb<T>(run: (store: IDBObjectStore) => IDBRequest<T>, mode: IDBTransactionMode): Promise<T> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open("rncp6-plan", 1);
    open.onupgradeneeded = () => open.result.createObjectStore("kv");
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const req = run(open.result.transaction("kv", mode).objectStore("kv"));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    };
  });
}
const storeHandle = (h: PlanHandle | null): Promise<unknown> =>
  idb<unknown>((st) => (h ? st.put(h, "handle") : st.delete("handle")) as IDBRequest<unknown>, "readwrite").catch(() => undefined);

// le scritture sono messe in coda così non si sovrappongono
let writing: Promise<void> = Promise.resolve();
function writeLinked(): void {
  const h = linked;
  if (!h) return;
  const text = planJson();
  writing = writing.then(async () => {
    try {
      const w = await h.createWritable();
      await w.write(text);
      await w.close();
      setStatus("Salvato in " + h.name);
    } catch {
      setStatus("Impossibile scrivere " + h.name);
    }
  });
}

async function link(h: PlanHandle): Promise<void> {
  linked = h;
  reconnect.hidden = true;
  await storeHandle(h);
}

// il file di npm run me (source "intra") si unisce al piano invece di sostituirlo
const isIntra = (text: string): boolean => { try { return JSON.parse(text)?.source === "intra"; } catch { return false; } };
function loadIntra(text: string): void {
  const msg = mergeIntra(text);
  save();
  render();
  setStatus(msg);
}

async function loadFrom(h: PlanHandle): Promise<void> {
  const text = await (await h.getFile()).text();
  if (isIntra(text)) { loadIntra(text); return; } // non si collega: il piano non va scritto lì sopra
  if (text.trim()) applyPlan(text);
  else { await link(h); writeLinked(); return; } // file vuoto: ci scrive il piano attuale
  await link(h);
  save();
  render();
  setStatus("Collegato a " + h.name);
}

function fail(err: unknown): void {
  if (err instanceof DOMException && err.name === "AbortError") return; // finestra chiusa dall'utente
  alert("File non valido: " + (err instanceof Error ? err.message : String(err)));
}

byId("export").addEventListener("click", async () => {
  if (canLink) {
    try { await link(await fsw.showSaveFilePicker!(picker())); writeLinked(); } catch (err) { fail(err); }
    return;
  }
  download(fileName("json"), planJson(), "application/json");
});

const importFile = byId<HTMLInputElement>("import-file");
byId("import").addEventListener("click", async () => {
  if (!canLink) { importFile.click(); return; }
  try { const [h] = await fsw.showOpenFilePicker!(picker()); await loadFrom(h); } catch (err) { fail(err); }
});
importFile.addEventListener("change", async () => {
  const file = importFile.files?.[0];
  importFile.value = "";
  if (!file) return;
  try {
    const text = await file.text();
    if (isIntra(text)) loadIntra(text); else { applyPlan(text); save(); render(); }
  } catch (err) { fail(err); }
});

/* import diretto: con npm run serve la pagina chiede il login e il server locale legge l'API di 42 */
const intraForm = byId<HTMLFormElement>("intra-form");
const intraLogin = byId<HTMLInputElement>("intra-login");
const intraGo = byId<HTMLButtonElement>("intra-go");
const intraMsg = byId("intra-msg");
const LOGIN_KEY = "rncp-intra-login";
try { intraLogin.value = localStorage.getItem(LOGIN_KEY) || ""; } catch {}

async function checkServer(): Promise<void> {
  if (!location.protocol.startsWith("http")) return; // aperta come file: niente server
  try {
    const res = await fetch("api/ping", { cache: "no-store" });
    if (!res.ok) return; // GitHub Pages o un altro server statico
    const info = (await res.json()) as { intra?: boolean };
    intraForm.hidden = false;
    if (!info.intra) {
      intraLogin.disabled = intraGo.disabled = true;
      intraMsg.textContent = "Mancano FT_UID e FT_SECRET in .env: vedi tools/README.md.";
    }
  } catch { /* nessun server locale */ }
}

intraForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const login = intraLogin.value.trim().toLowerCase();
  if (!intraLogin.checkValidity()) return;
  try { localStorage.setItem(LOGIN_KEY, login); } catch {}
  intraGo.disabled = true;
  intraMsg.textContent = "Lettura dall'intra…";
  try {
    const res = await fetch("api/me?login=" + encodeURIComponent(login), { cache: "no-store" });
    const text = await res.text();
    if (!res.ok) throw new Error((JSON.parse(text) as { error?: string }).error || "HTTP " + res.status);
    intraMsg.textContent = mergeIntra(text) + (state.level != null ? ", livello " + fmtLevel(state.level) : "") + ".";
    save(); render();
  } catch (err) {
    intraMsg.textContent = "Import non riuscito: " + (err instanceof Error ? err.message : String(err));
  } finally {
    intraGo.disabled = false;
  }
});

/* "Accedi con 42" (sito pubblico): il Cloudflare Worker fa il login OAuth e torna qui con #intra=<base64url(json)> */
interface IntraLogin { login: string; date: string; level: number | null; p: Record<string, ["d" | "o", number | null]> }
// dagli slug dell'intra al formato di npm run me (id della pagina), così passa da mergeIntra
function intraToPlan(data: IntraLogin): string {
  const status: Record<string, Status> = {}, marks: Record<string, number> = {};
  for (const pr of PROJECTS) {
    const got = data.p[pr.s];
    if (!got) continue;
    const s: Status = got[0] === "d" ? "done" : "doing";
    status[pr.id] = s;
    if (s === "done" && got[1] != null) marks[pr.id] = got[1];
  }
  return JSON.stringify({ version: 2, source: "intra", login: data.login, date: data.date, level: data.level, picked: Object.keys(status), status, marks });
}

const authBox = byId("auth-box");
const authMsg = byId("auth-msg");
const authUrl = (authBox.dataset.auth || "").replace(/\/+$/, "");
if (authUrl && location.protocol.startsWith("http")) authBox.hidden = false;
byId("auth-go").addEventListener("click", () => {
  location.href = authUrl + "/login?return=" + encodeURIComponent(location.origin + location.pathname);
});

byId("intra-logout").addEventListener("click", intraLogout);

// ritorno dal login: legge il frammento e lo cancella dall'indirizzo (non resta nella cronologia né nei link copiati)
function readAuthReturn(): void {
  const hash = location.hash.slice(1);
  if (!hash.startsWith("intra=") && !hash.startsWith("intra-error=")) return;
  history.replaceState(null, "", location.pathname + location.search);
  authBox.hidden = !authUrl;
  if (hash.startsWith("intra-error=")) {
    authMsg.textContent = "Accesso non riuscito: " + decodeURIComponent(hash.slice("intra-error=".length));
    return;
  }
  try {
    const b64 = hash.slice("intra=".length).replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const data = JSON.parse(new TextDecoder().decode(bytes)) as IntraLogin;
    authMsg.textContent = mergeIntra(intraToPlan(data)) + (state.level != null ? ", livello " + fmtLevel(state.level) : "") + ".";
    save(); render();
  } catch (err) {
    authMsg.textContent = "Dati dell'intra non leggibili: " + (err instanceof Error ? err.message : String(err));
  }
}

// dopo il ricaricamento il browser chiede di nuovo il permesso: serve un clic
reconnect.addEventListener("click", async () => {
  const h = await idb<PlanHandle | undefined>((st) => st.get("handle"), "readonly").catch(() => undefined);
  if (!h) { reconnect.hidden = true; return; }
  try {
    if ((await h.requestPermission({ mode: "readwrite" })) === "granted") await loadFrom(h);
  } catch (err) { fail(err); }
});

async function restoreLink(): Promise<void> {
  if (!canLink) return;
  const h = await idb<PlanHandle | undefined>((st) => st.get("handle"), "readonly").catch(() => undefined);
  if (!h) return;
  try {
    if ((await h.queryPermission({ mode: "readwrite" })) === "granted") await loadFrom(h);
    else {
      reconnect.textContent = "Riapri " + h.name;
      reconnect.hidden = false;
    }
  } catch {
    await storeHandle(null); // il file è stato spostato o cancellato
  }
}

/* ---------- esporta il piano: Markdown o PDF (stampa del browser) ---------- */
interface PlanSection {
  id: BlockId;
  blk: Block;
  t: ReturnType<typeof tally>;
  chosen: Project[];
}

function planSections(): PlanSection[] {
  return optBlocks().map((id) => ({
    id,
    blk: BLOCKS[id],
    t: tally(id),
    chosen: PROJECTS.filter((pr) => pr.b.includes(id) && state.picked[pr.id]),
  }));
}

// XP totali senza contare due volte un progetto presente in più blocchi; h: ore dei progetti non ancora fatti
function planTotal(secs: PlanSection[]): { n: number; xp: number; h: number } {
  const uniq = new Map<string, Project>();
  secs.forEach((sec) => sec.chosen.forEach((pr) => uniq.set(pr.id, pr)));
  let xp = 0, h = 0;
  uniq.forEach((pr) => { xp += xpOf(pr) || 0; if (state.picked[pr.id] !== "done") h += hours(pr) || 0; });
  return { n: uniq.size, xp, h };
}

const today = (): string => new Date().toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
function xpLabel(pr: Project): string {
  const xp = xpOf(pr);
  if (xp == null) return "XP n.d.";
  const mark = state.picked[pr.id] === "done" ? state.marks[pr.id] : undefined;
  return fmt(xp) + " XP" + (mark != null && mark !== 100 ? " (voto " + mark + ")" : "");
}
const progress = (sec: PlanSection): string =>
  sec.t.n + "/" + sec.blk.minN + " progetti" + (sec.blk.minXp ? " · " + fmt(sec.t.xp) + "/" + fmt(sec.blk.minXp) + " XP" : "")
  + " (fatti: " + sec.t.dn + (sec.blk.minXp ? ", " + fmt(sec.t.dxp) + " XP" : "") + ")";
// stato del blocco: validato con i progetti fatti, coperto dal piano o da completare
const blockState = (t: PlanSection["t"]): string => (t.valid ? "Validato" : t.done ? "Coperto dal piano" : "Da completare");
const blockIcon = (t: PlanSection["t"]): string => (t.valid ? "✅" : t.done ? "☑️" : "⏳");
const statusOf = (pr: Project): string => STATUS_NAMES[state.picked[pr.id] || "todo"];

function planMarkdown(): string {
  const secs = planSections();
  const tot = planTotal(secs);
  const lines: string[] = [
    "# Piano " + titleName(),
    "",
    "**" + optName() + "** · esportato il " + today(),
    "",
    "## Riepilogo",
    "",
    "| Blocco | Minimo | Avanzamento | Stato |",
    "| --- | --- | --- | --- |",
    ...secs.map((sec) => "| " + sec.blk.name + " | " + sec.blk.rule + " | " + progress(sec) + " | " + blockIcon(sec.t) + " " + blockState(sec.t) + " |"),
    "",
    "Totale: **" + tot.n + " progetti**, **" + fmt(tot.xp) + " XP**; da fare: **" + daysDetail(tot.h).replace(" (", "** (") + ". Ogni progetto è contato una volta; ore stimate dall'intra, giornate da " + fmtDayHours(state.dayHours) + " h, sabato e domenica liberi.",
  ];
  for (const sec of secs) {
    lines.push("", "## " + blockIcon(sec.t) + " " + sec.blk.name, "", "_" + progress(sec) + "_", "");
    if (!sec.chosen.length) { lines.push("Nessun progetto scelto."); continue; }
    for (const pr of sec.chosen) {
      lines.push("- **" + pr.n + "** · _" + statusOf(pr) + "_ · " + pr.l + " · " + xpLabel(pr) + " · " + timeLabel(pr) + " · " + peopleLabel(pr) + " · [subject](" + pageUrl(pr) + ")");
      lines.push("  " + pr.d);
    }
  }
  return lines.join("\n") + "\n";
}

function download(name: string, text: string, type: string): void {
  const a = el("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 0);
}

/* ---------- linea del tempo del PDF ----------
 * I progetti scelti uno dopo l'altro, nell'ordine dei blocchi, con le ore al giorno scelte
 * con sabato e domenica liberi. Le posizioni sono in giorni di calendario dall'inizio.
 */
interface Leg { pr: Project; from: number; to: number }

// giorni di calendario trascorsi prima di iniziare dopo w giorni lavorativi finiti
const calendarStart = (w: number): number => w + 2 * Math.floor(w / 5);

function planTimeline(secs: PlanSection[]): { legs: Leg[]; total: number; missing: Project[] } {
  const uniq = new Map<string, Project>();
  secs.forEach((sec) => sec.chosen.forEach((pr) => { if (state.picked[pr.id] !== "done") uniq.set(pr.id, pr); })); // quelli fatti sono alle spalle
  const legs: Leg[] = [], missing: Project[] = [];
  let doneH = 0, doneW = 0;
  uniq.forEach((pr) => {
    const h = hours(pr);
    if (h == null || h <= 0) { missing.push(pr); return; }
    doneH += h;
    const endW = Math.max(doneW + 1, Math.round(doneH / state.dayHours)); // almeno un giorno a progetto
    legs.push({ pr, from: calendarStart(doneW), to: calendarDays(endW) });
    doneW = endW;
  });
  return { legs, total: calendarDays(doneW), missing };
}

const dateIn = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" });
};

function timelineSection(secs: PlanSection[]): HTMLElement {
  const part = el("section", "rep-time");
  part.append(el("h2", null, "Linea del tempo"));
  const { legs, total, missing } = planTimeline(secs);
  if (!legs.length) {
    part.append(el("p", "rep-empty", "Nessun progetto da fare con una stima delle ore."));
    return part;
  }
  part.append(el("p", "rep-rule", "I progetti non ancora fatti, uno alla volta, nell'ordine del piano: ~" + fmt(total) + " giorni"
    + " (circa " + fmt(Math.round(total / 7)) + " settimane). Se inizi oggi finisci verso il " + dateIn(total) + "."));
  const chart = el("div", "tl");
  chart.style.setProperty("--week", (700 / total) + "%"); // una riga verticale a settimana
  for (const leg of legs) {
    const row = el("div", "tl-row");
    const track = el("div", "tl-track"), bar = el("i");
    bar.style.left = (leg.from / total) * 100 + "%";
    bar.style.width = ((leg.to - leg.from) / total) * 100 + "%";
    track.append(bar);
    row.append(el("span", "tl-name", leg.pr.n), track, el("span", "tl-days", "g. " + (leg.from + 1) + "–" + leg.to));
    chart.append(row);
  }
  const axis = el("div", "tl-row tl-axis");
  const ends = el("div", "tl-ends");
  ends.append(el("span", null, "oggi"), el("span", null, dateIn(total)));
  axis.append(el("span"), ends, el("span"));
  chart.append(axis);
  part.append(chart);
  if (missing.length) part.append(el("p", "rep-rule", "Senza stima delle ore, esclusi: " + missing.map((pr) => pr.n).join(", ") + "."));
  return part;
}

// costruisce #report, visibile solo in stampa, e apre la finestra di stampa
function printPlan(): void {
  const secs = planSections();
  const tot = planTotal(secs);
  const root = byId("report");
  root.textContent = "";

  const head = el("header", "rep-head");
  head.append(el("h1", null, "Piano " + titleName()), el("p", null, optName() + " · esportato il " + today()));
  root.append(head);

  const sum = el("div", "rep-summary");
  for (const sec of secs) {
    const box = el("div", "rep-meter" + (sec.t.valid ? " done" : ""));
    box.append(el("b", null, (sec.t.valid ? "✓ " : "") + sec.blk.name), el("span", null, blockState(sec.t) + " · " + progress(sec)));
    sum.append(box);
  }
  root.append(sum, el("p", "rep-total", "Totale: " + tot.n + " progetti, " + fmt(tot.xp) + " XP; da fare: " + daysDetail(tot.h) + ". Ogni progetto è contato una volta; ore stimate dall'intra, giornate da " + fmtDayHours(state.dayHours) + " h, sabato e domenica liberi."), timelineSection(secs));

  for (const sec of secs) {
    const part = el("section", "rep-block");
    const h = el("h2", null, sec.blk.name);
    h.append(el("span", "rep-state" + (sec.t.valid ? " done" : ""), (sec.t.valid ? "✓ " : "") + blockState(sec.t)));
    part.append(h, el("p", "rep-rule", "Minimo " + sec.blk.rule + " · " + progress(sec)));
    if (!sec.chosen.length) part.append(el("p", "rep-empty", "Nessun progetto scelto."));
    for (const pr of sec.chosen) {
      const item = el("article", "rep-item");
      const title = el("h3", null, pr.n);
      title.append(el("span", null, statusOf(pr) + " · " + pr.l + " · " + xpLabel(pr) + " · " + timeLabel(pr) + " · " + peopleLabel(pr)));
      const a = el("a", null, pageUrl(pr));
      a.href = pageUrl(pr);
      item.append(title, el("p", null, pr.d), a);
      part.append(item);
    }
    root.append(part);
  }
  window.print();
}

byId("export-md").addEventListener("click", () => download(fileName("md"), planMarkdown(), "text/markdown"));
byId("export-pdf").addEventListener("click", printPlan);

/* ---------- popup "Esporta" (Markdown e PDF) ----------
 * Si apre col pulsante in alto a destra e si chiude con un clic fuori,
 * con Esc o dopo aver scelto una voce.
 */
const menuBtn = byId<HTMLButtonElement>("menu-btn");
const menuPop = byId("menu-pop");

function setMenu(open: boolean): void {
  menuPop.hidden = !open;
  menuBtn.setAttribute("aria-expanded", String(open));
}

menuBtn.addEventListener("click", () => setMenu(menuPop.hidden));
menuPop.addEventListener("click", (e) => { if ((e.target as Element).closest("button")) setMenu(false); });
document.addEventListener("click", (e) => {
  if (!menuPop.hidden && !(e.target as Element).closest(".menu")) setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || menuPop.hidden) return;
  setMenu(false);
  menuBtn.focus();
});

render();
void restoreLink().then(readAuthReturn); // dopo l'eventuale file collegato, che altrimenti sovrascriverebbe l'import
void checkServer();
