"use strict";
/* Dati della pagina: progetti, blocchi, categorie e titoli. Niente logica qui.
 * tools/lib/projects.mjs legge PROJECTS con una regex: ogni progetto resta su una riga, con i campi in quest'ordine. */
const PROJECTS = [
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
];
const PROJECT_IDS = new Set(PROJECTS.map((pr) => pr.id));
// minimi del regolamento, dalle liste ufficiali RNCP dell'intra (lists/official/)
const BLOCKS = {
    suite: { name: "Suite", minXp: 0, minN: 1 },
    // RNCP 6
    web: { name: "Web", minXp: 15000, minN: 2 },
    mobile: { name: "Mobile", minXp: 10000, minN: 2 },
    oop: { name: "Object Oriented", minXp: 10000, minN: 2 },
    fun: { name: "Functional", minXp: 10000, minN: 2 },
    imp: { name: "Imperative", minXp: 10000, minN: 2 },
    // RNCP 7
    unix: { name: "Unix/Kernel", minXp: 30000, minN: 2 },
    sys: { name: "System administration", minXp: 50000, minN: 3 },
    sec: { name: "Security", minXp: 50000, minN: 3 },
    webdb: { name: "Web - Database", minXp: 50000, minN: 2 },
    ai: { name: "Artificial Intelligence", minXp: 70000, minN: 3 },
};
// categorie dei filtri, nell'ordine dei bottoni; un progetto può averne più di una
const TAGS = {
    web: "Web", mobile: "Mobile", gfx: "Graphics", game: "Gaming", net: "Reti",
    low: "Kernel/LowLevel", devops: "DevOps/Container", sec: "CyberSec", ai: "IA/Data", oop: "OOP", func: "Funzionale", math: "Algoritmi/Math",
};
// i due titoli: la Suite è la stessa lista per entrambi
const TITLES = {
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
const STATUS_NAMES = { todo: "Da fare", doing: "In corso", done: "Fatto" };
// XP totali per arrivare a ogni livello del 42cursus (0…30), dall'API di 42 via experience_21.json di 42calculator
const LEVEL_XP = [0, 462, 2688, 5885, 11777, 29217, 46255, 63559, 74340, 85483, 95000, 105630, 124446, 145782, 169932,
    197316, 228354, 263508, 303366, 348516, 399672, 457632, 523320, 597786, 682164, 777756, 886074, 1008798, 1147902, 1305486, 1484070];
/* Stato della pagina e salvataggio nel browser */
const state = {
    title: 6, opt: 2, picked: {}, marks: {}, level: null, events: 0, exps: 0, intra: null, dayHours: 8,
    team: "all", sort: "time", desc: true, only: false, both: false, tags: new Set(), q: "",
};
/* ---------- validazione: i dati salvati possono essere vecchi o scritti a mano ---------- */
const validLevel = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0 && v < 30;
const validCount = (v) => typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= 99;
const validDayHours = (v) => typeof v === "number" && Number.isFinite(v) && v >= 1 && v <= 24;
const toStatus = (v) => (v === "doing" || v === "done" ? v : "todo"); // le scelte di prima (true) diventano "da fare"
// tiene solo i progetti che esistono ancora, con uno stato valido
function cleanPicked(raw) {
    const out = {};
    for (const [id, v] of Object.entries(raw))
        if (PROJECT_IDS.has(id))
            out[id] = toStatus(v);
    return out;
}
// voti: solo progetti esistenti e numeri tra 0 e 125 (il massimo con i bonus)
function cleanMarks(raw) {
    const out = {};
    if (raw && typeof raw === "object")
        for (const [id, v] of Object.entries(raw))
            if (PROJECT_IDS.has(id) && typeof v === "number" && v >= 0 && v <= 125)
                out[id] = v;
    return out;
}
function applySaved(saved, picked) {
    state.title = saved.title === 7 ? 7 : 6;
    state.opt = saved.opt === 1 ? 1 : 2;
    state.picked = cleanPicked(picked);
    state.marks = cleanMarks(saved.marks);
    state.level = validLevel(saved.level) ? saved.level : null;
    state.events = validCount(saved.events) ? saved.events : 0;
    state.exps = validCount(saved.exps) ? saved.exps : 0;
    if (validDayHours(saved.dayHours))
        state.dayHours = saved.dayHours;
}
/* ---------- localStorage ---------- */
const STORAGE_KEY = "rncp6-plan-v1"; // nome storico: ora contiene anche il titolo
try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved) {
        applySaved(saved, saved.picked || {});
        const s = saved.intra;
        state.intra = s && typeof s.login === "string" && s.prev && typeof s.prev === "object" ? s : null;
    }
}
catch { /* storage non disponibile: la pagina funziona lo stesso */ }
function save() {
    const { title, opt, picked, marks, level, events, exps, intra, dayHours } = state;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ title, opt, picked, marks, level, events, exps, intra, dayHours }));
    }
    catch { }
    writeLinked(); // e nel file collegato, se c'è (plan-file.ts)
}
/* Calcoli ed etichette: XP, livelli, giorni, copertura dei blocchi, filtri. Non tocca la pagina. */
/* ---------- titolo e opzione scelti ---------- */
const currentTitle = () => TITLES[state.title];
const optBlocks = () => currentTitle().options[state.opt].blocks;
const optName = () => currentTitle().options[state.opt].name;
const otherTitle = () => TITLES[state.title === 6 ? 7 : 6];
// blocchi in cui un progetto conta nell'altro titolo (in tutte e due le sue opzioni)
function otherBlocks(pr) {
    const all = Object.values(otherTitle().options).flatMap((o) => o.blocks);
    return pr.blocks.filter((b) => all.includes(b));
}
/* ---------- testi ---------- */
const fmt = (n) => n.toLocaleString("it-IT").replace(/\./g, " ");
const plural = (n, one, many) => fmt(n) + " " + (n === 1 ? one : many);
const fmtDayHours = (v) => v.toLocaleString("it-IT", { maximumFractionDigits: 2 });
const fmtLevel = (v) => (Math.floor(v * 100) / 100).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// "10 000 XP e 2 progetti", o solo "1 progetto" se il blocco non chiede XP
const blockRule = (blk) => (blk.minXp ? fmt(blk.minXp) + " XP e " : "") + plural(blk.minN, "progetto", "progetti");
// "livello 17, 10 eventi, 2 esperienze professionali"
const titleRules = (t) => "livello " + t.level + ", " + t.events + " eventi, " + t.exps + " esperienze professionali";
function peopleLabel(pr) {
    const p = pr.people;
    if (!p)
        return "persone n.d.";
    if (p[0] !== p[1])
        return p[0] + "–" + p[1] + " persone";
    return p[0] === 1 ? "1 persona" : p[0] + " persone";
}
const pageUrl = (pr) => "https://projects.intra.42.fr/projects/" + pr.slug;
// PDF del subject sul CDN di 42: pubblico, si apre senza login
const subjectPdf = (pr) => pr.pdf == null ? null : "https://cdn.intra.42.fr/pdf/pdf/" + pr.pdf + "/en.subject.pdf";
const today = () => new Date().toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
const dateIn = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" });
};
/* ---------- XP e livelli ---------- */
const isPending = (pr) => !!state.picked[pr.id] && state.picked[pr.id] !== "done"; // scelto, non ancora fatto
// voto dell'intra, solo per i progetti fatti
const markOf = (pr) => (state.picked[pr.id] === "done" ? state.marks[pr.id] : undefined);
// i progetti fatti con il voto dell'intra scalano col voto (125 = +25%), gli altri valgono a voto 100
function xpOf(pr) {
    if (pr.xp == null)
        return null;
    const mark = markOf(pr);
    return mark == null ? pr.xp : Math.round(pr.xp * mark / 100);
}
const sumXp = (list) => list.reduce((s, pr) => s + (xpOf(pr) || 0), 0);
function xpLabel(pr) {
    const xp = xpOf(pr);
    if (xp == null)
        return "XP n.d.";
    const mark = markOf(pr);
    return fmt(xp) + " XP" + (mark != null && mark !== 100 ? " (voto " + mark + ")" : "");
}
// livello 12,45 = 45% della strada tra il 12 e il 13
function levelToXp(level) {
    const i = Math.min(Math.floor(level), LEVEL_XP.length - 2);
    return LEVEL_XP[i] + (level - i) * (LEVEL_XP[i + 1] - LEVEL_XP[i]);
}
function xpToLevel(xp) {
    let i = 0;
    while (i < LEVEL_XP.length - 2 && xp >= LEVEL_XP[i + 1])
        i++;
    return i + Math.min((xp - LEVEL_XP[i]) / (LEVEL_XP[i + 1] - LEVEL_XP[i]), 1);
}
// XP che il piano aggiunge al livello attuale: i progetti scelti non ancora fatti (quelli fatti sono già nel livello)
const pendingXp = () => sumXp(PROJECTS.filter(isPending));
/* ---------- ordinamento (filtri ed export) ---------- */
const SORT_NAMES = { time: "Tempo", xp: "XP", people: "Persone", name: "Nome" };
// il nome parte dalla A, i numeri dal più alto
const SORT_DESC = { time: true, xp: true, people: true, name: false };
// valore numerico su cui ordinare, null se manca (quei progetti vanno sempre in fondo)
function sortValue(pr, key) {
    if (key === "time")
        return hours(pr);
    if (key === "xp")
        return xpOf(pr);
    return pr.people ? pr.people[0] + pr.people[1] / 100 : null; // prima il minimo, poi il massimo
}
// copia ordinata secondo i filtri; a parità resta l'ordine dei dati
function sortProjects(list) {
    const { sort: key, desc } = state;
    const dir = desc ? -1 : 1;
    return [...list].sort((a, b) => {
        if (key === "name")
            return dir * a.name.localeCompare(b.name, "it");
        const va = sortValue(a, key), vb = sortValue(b, key);
        if (va == null || vb == null)
            return (va == null ? 1 : 0) - (vb == null ? 1 : 0);
        return dir * (va - vb);
    });
}
// "Tempo, dal più alto" per l'export
const sortLabel = () => SORT_NAMES[state.sort] + ", " + (state.sort === "name" ? (state.desc ? "dalla Z alla A" : "dalla A alla Z") : state.desc ? "dal più alto" : "dal più basso");
/* ---------- tempo ---------- */
// ore stimate dall'intra (hours.js), null se mancano
const hours = (pr) => (typeof INTRA_HOURS === "undefined" ? null : INTRA_HOURS[pr.slug] ?? null);
const sumHours = (list) => list.reduce((s, pr) => s + (hours(pr) || 0), 0);
// giorni lavorativi per fare h ore, almeno 1 se c'è lavoro
const workDays = (h) => (h > 0 ? Math.max(1, Math.round(h / state.dayHours)) : 0);
// giorni di calendario: ogni 5 giorni lavorativi si aggiunge un weekend (2 giorni),
// ma non dopo l'ultima settimana: 5 lavorativi = 5 giorni, 6 lavorativi = 8 giorni
const calendarDays = (w) => (w > 0 ? w + 2 * Math.floor((w - 1) / 5) : 0);
// giorni di calendario trascorsi prima di iniziare dopo w giorni lavorativi finiti
const calendarStart = (w) => w + 2 * Math.floor(w / 5);
// "~36 giorni"
const daysLabel = (h) => "~" + plural(calendarDays(workDays(h)), "giorno", "giorni");
// " (26 lavorativi, 210 h)"
const daysNote = (h) => " (" + plural(workDays(h), "lavorativo", "lavorativi") + ", " + fmt(h) + " h)";
// "~36 giorni (26 lavorativi, 210 h)"
const daysDetail = (h) => daysLabel(h) + daysNote(h);
const timeLabel = (pr) => {
    const h = hours(pr);
    return h == null ? "tempo n.d." : daysDetail(h);
};
function tally(id) {
    const blk = BLOCKS[id];
    const chosen = PROJECTS.filter((pr) => pr.blocks.includes(id) && state.picked[pr.id]);
    const made = chosen.filter((pr) => state.picked[pr.id] === "done");
    const n = chosen.length, xp = sumXp(chosen), doneN = made.length, doneXp = sumXp(made);
    return {
        n, xp, doneN, doneXp,
        covered: n >= blk.minN && xp >= blk.minXp,
        valid: doneN >= blk.minN && doneXp >= blk.minXp,
    };
}
// quanto di un blocco è coperto, da 0 a 1: conta il requisito più indietro tra progetti e XP
const coverage = (blk, n, xp) => Math.min(n / blk.minN, blk.minXp ? xp / blk.minXp : 1, 1);
// il progetto passa i filtri?
function visible(pr) {
    const p = pr.people;
    if (state.only && !state.picked[pr.id])
        return false;
    if (state.both && !otherBlocks(pr).length)
        return false;
    if (state.tags.size && !pr.tags.some((t) => state.tags.has(t)))
        return false; // basta una delle categorie accese
    if (state.team === "solo" && !(p && p[0] === 1))
        return false;
    if (state.team === "group" && !(p && p[1] > 1))
        return false;
    if (state.q && !(pr.name + " " + pr.desc).toLowerCase().includes(state.q))
        return false;
    return true;
}
/* Piccoli aiuti per creare e trovare elementi */
function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls)
        node.className = cls;
    if (text != null)
        node.textContent = text;
    return node;
}
function byId(id) {
    const node = document.getElementById(id);
    if (!node)
        throw new Error("Elemento #" + id + " mancante");
    return node;
}
// link che si apre in una nuova scheda
function extLink(text, href, title) {
    const a = el("a", null, text);
    a.href = href;
    a.title = title;
    a.target = "_blank";
    a.rel = "noopener";
    return a;
}
/* La pagina: barre dei blocchi, requisiti comuni, tempo che resta, card dei progetti e filtri */
function newMeter(cls, label) {
    const box = el("div", cls), top = el("div", "meter-top"), name = el("span", "meter-name", label);
    // due riempimenti: chiaro per tutto il piano, pieno per i progetti fatti
    const bar = el("div", "bar"), plan = el("i", "plan"), made = el("i");
    top.append(name);
    bar.append(plan, made);
    box.append(top, bar);
    return { box, top, name, plan, made, cls };
}
// spunta del blocco, nella barra e accanto al nome del blocco:
// piena se è già validato con i progetti fatti, vuota se è solo coperto dal piano
function doneCheck(valid) {
    const check = el("span", "meter-check" + (valid ? "" : " planned"), "✓");
    check.setAttribute("aria-label", valid ? "Validato" : "Coperto dal piano");
    check.title = valid ? "Validato con i progetti fatti" : "Coperto dal piano, non ancora validato";
    return check;
}
// planned e made: quanto del minimo coprono il piano e i progetti fatti, da 0 a 1.
// Validato (verde pieno) se i fatti bastano, coperto dal piano (bordo verde) se basta il piano
function paintMeter(m, planned, made) {
    const valid = made >= 1, covered = planned >= 1;
    m.box.className = m.cls + (valid ? " done" : covered ? " planned" : "");
    m.top.querySelector(".meter-check")?.remove();
    if (covered)
        m.top.append(doneCheck(valid));
    m.plan.style.width = Math.round(planned * 100) + "%";
    m.made.style.width = Math.round(made * 100) + "%";
}
const ratio = (have, need) => Math.min(have / need, 1);
function renderMeters() {
    const box = byId("meters");
    box.textContent = "";
    for (const id of optBlocks()) {
        const blk = BLOCKS[id], t = tally(id);
        const m = newMeter("meter", blk.name);
        m.name.title = blk.name; // nella barra compatta il nome può essere tagliato
        paintMeter(m, coverage(blk, t.n, t.xp), coverage(blk, t.doneN, t.doneXp));
        const nums = el("div", "meter-nums");
        const projects = el("span");
        projects.append(el("b", null, String(t.n)), "/" + blk.minN, el("span", "meter-unit", " progetti")); // "progetti" sparisce nella barra compatta
        nums.append(projects);
        if (blk.minXp) {
            const xp = el("span");
            xp.append(el("b", null, fmt(t.xp)), "/" + fmt(blk.minXp) + " XP");
            nums.append(xp);
        }
        m.box.title = "Fatti: " + plural(t.doneN, "progetto", "progetti") + (blk.minXp ? " · " + fmt(t.doneXp) + " XP" : "");
        m.box.append(nums);
        box.append(m.box);
    }
}
// parse restituisce undefined se il valore scritto non è valido
function commonMeter(label, inputLabel, parse, set) {
    const m = newMeter("meter common", label);
    const row = el("label", "meter-input"), input = el("input"), info = el("span");
    input.type = "text";
    input.inputMode = "decimal";
    input.size = 5;
    input.setAttribute("aria-label", inputLabel);
    row.append(input, info);
    m.box.append(row);
    byId("common").append(m.box);
    input.addEventListener("input", () => {
        const v = parse(input.value.trim().replace(",", ".")); // accetta anche la virgola: "12,5"
        input.setAttribute("aria-invalid", String(v === undefined));
        if (v === undefined)
            return;
        set(v);
        save();
        renderCommon();
    });
    // uscendo dal campo torna il valore salvato
    input.addEventListener("blur", () => { input.removeAttribute("aria-invalid"); renderCommon(); });
    return { ...m, info, input };
}
const parseCount = (raw) => (/^\d{1,2}$/.test(raw) ? Number(raw) : undefined);
const parseLevel = (raw) => (raw === "" ? null : validLevel(Number(raw)) ? Number(raw) : undefined);
const mLevel = commonMeter("Livello", "Livello attuale nel 42cursus", parseLevel, (v) => { state.level = v; });
const mEvents = commonMeter("Eventi", "Eventi a cui hai partecipato", parseCount, (v) => { state.events = v; });
const mExps = commonMeter("Esperienze professionali", "Esperienze professionali validate", parseCount, (v) => { state.exps = v; });
const typing = (m) => document.activeElement === m.input; // non riscrive il campo mentre ci scrivi
function renderCommon() {
    const t = currentTitle();
    // livello: le barre sono in XP, perché tra un livello e l'altro gli XP non sono costanti
    const need = levelToXp(t.level);
    if (state.level == null) {
        paintMeter(mLevel, 0, 0);
        mLevel.info.textContent = "livello attuale · minimo " + t.level;
    }
    else {
        const have = levelToXp(state.level), pending = pendingXp(), planned = have + pending;
        paintMeter(mLevel, ratio(planned, need), ratio(have, need));
        mLevel.info.textContent = (pending ? "→ " + fmtLevel(xpToLevel(planned)) + " col piano" : "nessun progetto da fare") + " · minimo " + t.level
            + (planned < need ? " · mancano " + fmt(Math.ceil(need - planned)) + " XP" : "");
    }
    if (!typing(mLevel))
        mLevel.input.value = state.level == null ? "" : fmtLevel(state.level);
    // eventi ed esperienze: si contano a mano, il piano non li cambia
    paintCount(mEvents, state.events, t.events, "eventi");
    paintCount(mExps, state.exps, t.exps, "esperienze");
}
function paintCount(m, have, need, unit) {
    paintMeter(m, ratio(have, need), ratio(have, need));
    m.info.textContent = "/" + need + " " + unit;
    if (!typing(m))
        m.input.value = String(have);
}
/* ---------- tempo che resta: i progetti scelti non ancora fatti, uno dopo l'altro ---------- */
function renderLeft() {
    const box = byId("plan-left"), t = currentTitle();
    box.title = "";
    box.textContent = "";
    // tutto validato: blocchi dell'opzione e requisiti comuni
    if (optBlocks().every((id) => tally(id).valid) && state.level != null && state.level >= t.level
        && state.events >= t.events && state.exps >= t.exps) {
        box.append(el("b", null, "Requisiti dell'" + t.name + " validati."), " Prima di fare domanda controlla sulla pagina RNCP dell'intra: è quella che fa fede.");
        return;
    }
    const left = PROJECTS.filter(isPending);
    if (!left.length) {
        box.textContent = Object.keys(state.picked).length ? "Tutti i progetti scelti sono fatti." : "Scegli i progetti cliccando sulle card: qui vedrai quanto tempo ti resta.";
        return;
    }
    const doing = left.filter((pr) => state.picked[pr.id] === "doing").length;
    const missing = left.filter((pr) => hours(pr) == null);
    const h = sumHours(left);
    const days = calendarDays(workDays(h));
    box.append("Restano ", el("b", null, plural(left.length, "progetto", "progetti")), (doing ? " (" + doing + " in corso)" : "") + ": ", el("b", null, "~" + plural(days, "giorno", "giorni")), (days < 7 ? "" : ", circa " + plural(Math.round(days / 7), "settimana", "settimane")) + ". Se inizi oggi finisci verso il ", el("b", null, dateIn(days)), ".");
    box.title = fmt(h) + " h stimate dall'intra a " + fmtDayHours(state.dayHours) + " h al giorno, weekend liberi; i progetti in corso contano per intero";
    if (missing.length)
        box.append(" Senza stima: " + missing.map((pr) => pr.name).join(", ") + ".");
}
/* ---------- card dei progetti ---------- */
// dopo un render la card è nuova: rimette il focus dove l'utente l'aveva
const refocus = (selector) => document.querySelector(selector)?.focus();
const blockNames = (ids) => ids.map((b) => BLOCKS[b].name).join(", ");
function card(pr, blockId) {
    const status = state.picked[pr.id];
    const key = blockId + ":" + pr.id; // lo stesso progetto può comparire in più blocchi
    const c = el("article", "card" + (status ? " on " + status : ""));
    c.dataset.key = key;
    c.tabIndex = 0;
    c.setAttribute("aria-label", pr.name + (status ? ", scelto, " + STATUS_NAMES[status].toLowerCase() : ", non scelto"));
    // il clic sulla card sceglie il progetto (da fare) o lo toglie dal piano
    const toggle = () => {
        if (status)
            delete state.picked[pr.id];
        else
            state.picked[pr.id] = "todo";
        save();
        render();
    };
    c.addEventListener("click", (e) => {
        if (e.target.closest("a, button"))
            return; // link e bottoni dello stato fanno altro
        if (window.getSelection()?.toString())
            return; // stava selezionando testo
        toggle();
    });
    c.addEventListener("keydown", (e) => {
        if (e.target !== c || (e.key !== "Enter" && e.key !== " "))
            return;
        e.preventDefault();
        toggle();
        refocus('[data-key="' + key + '"]');
    });
    const top = el("div", "card-top");
    top.append(el("h3", null, pr.name));
    if (status)
        top.append(statusButtons(pr, key, status));
    c.append(top, factChips(pr));
    if (pr.tags.length)
        c.append(el("p", "tags-of", pr.tags.map((t) => TAGS[t]).join(" · ")));
    c.append(el("p", "desc", pr.desc));
    const alsoHere = pr.blocks.filter((b) => b !== blockId && optBlocks().includes(b));
    if (alsoHere.length)
        c.append(el("p", "also", "Conta anche in: " + blockNames(alsoHere)));
    const alsoThere = otherBlocks(pr);
    if (alsoThere.length)
        c.append(el("p", "also", "Conta anche nell'" + otherTitle().name + ": " + blockNames(alsoThere)));
    const links = el("div", "links");
    const pdf = subjectPdf(pr);
    if (pdf)
        links.append(extLink("Subject ↗", pdf, "PDF del subject sul CDN di 42"));
    links.append(extLink("Pagina del progetto ↗", pageUrl(pr), "Pagina del progetto sull'intra (serve il login 42)"));
    c.append(links);
    return c;
}
// Da fare / In corso / Fatto, sulle card dei progetti scelti
function statusButtons(pr, key, current) {
    const seg = el("div", "seg status");
    seg.setAttribute("role", "group");
    seg.setAttribute("aria-label", "Stato di " + pr.name);
    for (const s of Object.keys(STATUS_NAMES)) {
        const b = el("button", null, STATUS_NAMES[s]);
        b.type = "button";
        b.dataset.status = s;
        b.setAttribute("aria-pressed", String(s === current));
        b.addEventListener("click", () => {
            state.picked[pr.id] = s;
            save();
            render();
            refocus('[data-key="' + key + '"] [data-status="' + s + '"]');
        });
        seg.append(b);
    }
    return seg;
}
// XP, persone, giorni e linguaggio
function factChips(pr) {
    const facts = el("div", "facts");
    const xp = el("span", "fact", xpLabel(pr));
    const mark = markOf(pr);
    if (mark != null && pr.xp != null)
        xp.title = "Voto " + mark + " sull'intra: " + fmt(pr.xp) + " XP a voto 100";
    const h = hours(pr);
    const days = el("span", "fact", h == null ? "giorni n.d." : daysLabel(h));
    days.title = h == null ? "Stima non disponibile: npm run hours"
        : fmt(h) + " h stimate dall'intra, a " + fmtDayHours(state.dayHours) + " h al giorno: " + fmt(workDays(h)) + " giorni lavorativi più i weekend";
    facts.append(xp, el("span", "fact", peopleLabel(pr)), days, el("span", "fact lang", pr.lang));
    return facts;
}
/* ---------- blocchi ---------- */
const collapsed = new Set(); // blocchi chiusi dall'utente: di default sono tutti aperti
// nell'RNCP 7 un blocco già coperto mostra solo i progetti scelti; qui quelli in cui l'utente ha chiesto di vederli tutti
const expandedDone = new Set();
function renderBlocks() {
    const root = byId("blocks");
    root.textContent = "";
    for (const id of optBlocks()) {
        const blk = BLOCKS[id], t = tally(id);
        const list = sortProjects(PROJECTS.filter((pr) => pr.blocks.includes(id)));
        const trimmable = state.title === 7 && t.covered;
        const hideRest = trimmable && !expandedDone.has(id);
        const shown = list.filter((pr) => visible(pr) && (!hideRest || state.picked[pr.id]));
        const sec = el("details", "block");
        sec.open = !collapsed.has(id);
        sec.addEventListener("toggle", () => { if (sec.open)
            collapsed.delete(id);
        else
            collapsed.add(id); });
        const head = el("summary", "block-head");
        const title = el("h2", null, blk.name);
        if (t.covered)
            title.append(doneCheck(t.valid));
        head.append(title, el("span", null, "Minimo " + blockRule(blk) + " · " + shown.length + " di " + list.length + " mostrati"));
        sec.append(head);
        const hidden = list.filter((pr) => !state.picked[pr.id]).length;
        if (trimmable && hidden) {
            const note = el("p", "empty", hideRest
                ? "Blocco già coperto dai progetti scelti: gli altri " + hidden + " sono nascosti. "
                : "Blocco già coperto dai progetti scelti. ");
            const btn = el("button", "link", hideRest ? "Mostra tutti" : "Mostra solo gli scelti");
            btn.type = "button";
            btn.addEventListener("click", () => { if (hideRest)
                expandedDone.add(id);
            else
                expandedDone.delete(id); renderBlocks(); });
            note.append(btn);
            sec.append(note);
        }
        if (shown.length) {
            const grid = el("div", "grid");
            for (const pr of shown)
                grid.append(card(pr, id));
            sec.append(grid);
        }
        else
            sec.append(el("p", "empty", "Nessun progetto con questi filtri."));
        root.append(sec);
    }
}
/* ---------- tutto insieme ---------- */
const titleButtons = document.querySelectorAll("[data-title]");
const optButtons = document.querySelectorAll("[data-opt]");
const teamButtons = document.querySelectorAll("[data-team]");
const toTitle = (v) => (v === "7" ? 7 : 6);
const toOpt = (v) => (v === "1" ? 1 : 2);
const toTeam = (v) => (v === "solo" || v === "group" ? v : "all");
const dayHoursInput = byId("day-hours");
const sortSelect = byId("sort");
const sortDir = byId("sort-dir");
const toSort = (v) => (v === "xp" || v === "people" || v === "name" ? v : "time");
function render() {
    byId("common-rules").textContent = titleRules(currentTitle());
    renderCommon();
    titleButtons.forEach((b) => b.setAttribute("aria-pressed", String(toTitle(b.dataset.title) === state.title)));
    // i nomi delle opzioni cambiano con il titolo
    optButtons.forEach((b) => {
        const opt = toOpt(b.dataset.opt);
        b.textContent = currentTitle().options[opt].name;
        b.setAttribute("aria-pressed", String(opt === state.opt));
    });
    teamButtons.forEach((b) => b.setAttribute("aria-pressed", String(toTeam(b.dataset.team) === state.team)));
    renderSort();
    if (document.activeElement !== dayHoursInput)
        dayHoursInput.value = fmtDayHours(state.dayHours); // non disturba chi sta scrivendo
    renderMeters();
    renderLeft();
    renderSession();
    renderBlocks();
}
// "↓ dal più alto" / "↑ dal più basso", "A→Z" / "Z→A" per il nome
function renderSort() {
    sortSelect.value = state.sort;
    const name = state.sort === "name";
    sortDir.textContent = name ? (state.desc ? "Z→A" : "A→Z") : state.desc ? "↓ Decrescente" : "↑ Crescente";
    sortDir.setAttribute("aria-label", "Direzione: " + sortLabel().split(", ")[1]);
}
/* ---------- comandi e filtri ---------- */
titleButtons.forEach((b) => b.addEventListener("click", () => { state.title = toTitle(b.dataset.title); save(); render(); }));
optButtons.forEach((b) => b.addEventListener("click", () => { state.opt = toOpt(b.dataset.opt); save(); render(); }));
teamButtons.forEach((b) => b.addEventListener("click", () => { state.team = toTeam(b.dataset.team); render(); }));
byId("reset").addEventListener("click", () => { state.picked = {}; save(); render(); });
const search = byId("q");
search.addEventListener("input", () => { state.q = search.value.trim().toLowerCase(); renderBlocks(); });
const only = byId("only");
only.addEventListener("change", () => { state.only = only.checked; renderBlocks(); });
const both = byId("both");
both.addEventListener("change", () => { state.both = both.checked; renderBlocks(); });
// ordinamento: cambiando criterio la direzione torna quella naturale
for (const k of Object.keys(SORT_NAMES))
    sortSelect.append(new Option(SORT_NAMES[k], k));
sortSelect.addEventListener("change", () => { state.sort = toSort(sortSelect.value); state.desc = SORT_DESC[state.sort]; renderSort(); renderBlocks(); });
sortDir.addEventListener("click", () => { state.desc = !state.desc; renderSort(); renderBlocks(); });
// ore al giorno: accetta anche la virgola ("6,5")
dayHoursInput.addEventListener("input", () => {
    const v = Number(dayHoursInput.value.replace(",", "."));
    const ok = dayHoursInput.value.trim() !== "" && validDayHours(v);
    dayHoursInput.setAttribute("aria-invalid", String(!ok));
    if (!ok || v === state.dayHours)
        return;
    state.dayHours = v;
    save();
    renderLeft();
    renderBlocks();
});
dayHoursInput.addEventListener("blur", () => { dayHoursInput.value = fmtDayHours(state.dayHours); dayHoursInput.removeAttribute("aria-invalid"); });
// bottoni delle categorie: si accendono e spengono uno per uno
for (const t of Object.keys(TAGS)) {
    const b = el("button", null, TAGS[t]);
    b.type = "button";
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => {
        if (state.tags.has(t))
            state.tags.delete(t);
        else
            state.tags.add(t);
        b.setAttribute("aria-pressed", String(state.tags.has(t)));
        renderBlocks();
    });
    byId("tags").append(b);
}
/* ---------- barra dei requisiti fissa in alto ---------- */
// i filtri restano sotto la barra (style.css): il CSS riceve l'altezza della barra, che cambia con il contenuto
const reqsBar = document.querySelector(".reqs:not(.reqs-common)");
if (reqsBar)
    new ResizeObserver(() => {
        document.documentElement.style.setProperty("--reqs-h", reqsBar.offsetHeight + "px");
    }).observe(reqsBar);
// mentre scorri la barra si compatta in modo continuo: si accorcia di un pixel per ogni pixel di scroll,
// finché i selettori RNCP/Opzione non sono spariti. Il margine sotto restituisce l'altezza persa,
// così il contenuto sotto scorre insieme al dito e la pagina non salta (style.css usa --p e --head-h)
const wide = matchMedia("(min-width: 860px)");
const reqsPrev = reqsBar?.previousElementSibling;
const reqsHead = reqsBar?.querySelector(".reqs-head");
let compactQueued = false;
function compactReqs() {
    compactQueued = false;
    if (!reqsBar || !reqsPrev || !reqsHead)
        return;
    if (!wide.matches) {
        reqsBar.style.removeProperty("--p");
        return;
    }
    // letture prima delle scritture: un solo calcolo del layout per frame
    const head = reqsHead.scrollHeight;
    const gap = parseFloat(getComputedStyle(reqsBar.parentElement).rowGap) || 0;
    const start = reqsPrev.getBoundingClientRect().bottom + scrollY + gap; // dove la barra comincia a restare ferma
    const lost = head + 24; // selettori + spazio sotto + 6 px di padding sopra e sotto (style.css)
    const p = Math.min(Math.max((scrollY - start) / lost, 0), 1);
    reqsBar.style.setProperty("--head-h", head + "px");
    reqsBar.style.setProperty("--p", String(p));
}
function queueCompact() {
    if (compactQueued)
        return;
    compactQueued = true;
    requestAnimationFrame(compactReqs);
}
addEventListener("scroll", queueCompact, { passive: true });
addEventListener("resize", queueCompact);
wide.addEventListener("change", queueCompact);
compactReqs();
const planJson = () => JSON.stringify({
    version: 2, title: state.title, opt: state.opt, picked: Object.keys(state.picked), status: state.picked,
    marks: state.marks, level: state.level, events: state.events, exps: state.exps, dayHours: state.dayHours,
}, null, 2);
function applyPlan(text) {
    const plan = JSON.parse(text);
    if (!Array.isArray(plan.picked))
        throw new Error("campo picked mancante");
    const picked = {};
    for (const id of plan.picked)
        if (typeof id === "string")
            picked[id] = plan.status?.[id];
    applySaved(plan, picked);
}
// il file di npm run me (source "intra") si unisce al piano invece di sostituirlo (intra.ts)
const isIntra = (text) => { try {
    return JSON.parse(text)?.source === "intra";
}
catch {
    return false;
} };
function download(name, text, type) {
    const a = el("a");
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 0);
}
// nome dei file salvati ed esportati: piano-rncp.json, piano-rncp.md (il piano vale per entrambi i titoli)
const fileName = (ext) => "piano-rncp." + ext;
function fail(err) {
    if (err instanceof DOMException && err.name === "AbortError")
        return; // finestra chiusa dall'utente
    alert("File non valido: " + (err instanceof Error ? err.message : String(err)));
}
const planStatus = byId("plan-status");
function setStatus(text) {
    planStatus.textContent = text;
    planStatus.hidden = !text;
}
const fsw = window;
const canLink = typeof fsw.showOpenFilePicker === "function" && typeof fsw.showSaveFilePicker === "function";
const picker = () => ({
    suggestedName: fileName("json"),
    types: [{ description: "Piano RNCP", accept: { "application/json": [".json"] } }],
});
const reconnect = byId("reconnect");
let linked = null;
// il collegamento al file sopravvive al ricaricamento grazie a IndexedDB
function idb(run, mode) {
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
const storeHandle = (h) => idb((st) => (h ? st.put(h, "handle") : st.delete("handle")), "readwrite").catch(() => undefined);
const storedHandle = () => idb((st) => st.get("handle"), "readonly").catch(() => undefined);
// le scritture sono messe in coda così non si sovrappongono
let writing = Promise.resolve();
function writeLinked() {
    const h = linked;
    if (!h)
        return;
    const text = planJson();
    writing = writing.then(async () => {
        try {
            const w = await h.createWritable();
            await w.write(text);
            await w.close();
            setStatus("Salvato in " + h.name);
        }
        catch {
            setStatus("Impossibile scrivere " + h.name);
        }
    });
}
async function link(h) {
    linked = h;
    reconnect.hidden = true;
    await storeHandle(h);
}
async function loadFrom(h) {
    const text = await (await h.getFile()).text();
    if (isIntra(text)) {
        loadIntraFile(text);
        return;
    } // non si collega: il piano non va scritto lì sopra
    if (!text.trim()) {
        await link(h);
        writeLinked();
        return;
    } // file vuoto: ci scrive il piano attuale
    applyPlan(text);
    await link(h);
    save();
    render();
    setStatus("Collegato a " + h.name);
}
// alla riapertura: se il browser dà ancora il permesso rilegge il file, altrimenti serve un clic su "Riapri"
async function restoreLink() {
    if (!canLink)
        return;
    const h = await storedHandle();
    if (!h)
        return;
    try {
        if ((await h.queryPermission({ mode: "readwrite" })) === "granted")
            await loadFrom(h);
        else {
            reconnect.textContent = "Riapri " + h.name;
            reconnect.hidden = false;
        }
    }
    catch {
        await storeHandle(null); // il file è stato spostato o cancellato
    }
}
reconnect.addEventListener("click", async () => {
    const h = await storedHandle();
    if (!h) {
        reconnect.hidden = true;
        return;
    }
    try {
        if ((await h.requestPermission({ mode: "readwrite" })) === "granted")
            await loadFrom(h);
    }
    catch (err) {
        fail(err);
    }
});
/* ---------- pulsanti Salva e Carica ---------- */
byId("export").addEventListener("click", async () => {
    if (!canLink) {
        download(fileName("json"), planJson(), "application/json");
        return;
    }
    try {
        await link(await fsw.showSaveFilePicker(picker()));
        writeLinked();
    }
    catch (err) {
        fail(err);
    }
});
const importFile = byId("import-file");
byId("import").addEventListener("click", async () => {
    if (!canLink) {
        importFile.click();
        return;
    }
    try {
        const [h] = await fsw.showOpenFilePicker(picker());
        await loadFrom(h);
    }
    catch (err) {
        fail(err);
    }
});
importFile.addEventListener("change", async () => {
    const file = importFile.files?.[0];
    importFile.value = "";
    if (!file)
        return;
    try {
        const text = await file.text();
        if (isIntra(text))
            loadIntraFile(text);
        else {
            applyPlan(text);
            save();
            render();
        }
    }
    catch (err) {
        fail(err);
    }
});
/* Import dall'intra: progetti fatti e in corso, voti e livello. Tre strade, tutte nel formato di npm run me:
 * - il file piano-intra.json scritto da npm run me, aperto con "Carica"
 * - il server locale di npm run serve, che legge l'API di 42 dal login scritto nella pagina
 * - "Accedi con 42" sul sito pubblico: il Cloudflare Worker fa il login OAuth e torna con #intra=<base64url(json)>
 */
// aggiorna stati, voti e livello e lascia com'è il resto del piano (i "da fare", il titolo, l'opzione);
// restituisce il riepilogo da mostrare
function mergeIntra(text) {
    const plan = JSON.parse(text);
    if (plan.source !== "intra" || !plan.status)
        throw new Error("non è un file di npm run me");
    const got = cleanPicked(plan.status);
    // ricorda lo stato di prima dei progetti che l'import cambia, per ripristinarlo con "Esci";
    // con lo stesso login vale lo stato di prima del primo import
    const login = plan.login || "intra";
    const prev = state.intra && state.intra.login === login ? state.intra.prev : {};
    for (const id of Object.keys(got))
        if (!(id in prev))
            prev[id] = state.picked[id] || "";
    state.intra = { login, date: plan.date || "", prev };
    Object.assign(state.picked, got);
    Object.assign(state.marks, cleanMarks(plan.marks));
    if (validLevel(plan.level))
        state.level = plan.level;
    save();
    render();
    const statuses = Object.values(got);
    return "Dall'intra" + (plan.login ? " (" + plan.login + (plan.date ? ", " + plan.date : "") + ")" : "") + ": "
        + plural(statuses.filter((s) => s === "done").length, "fatto", "fatti") + ", "
        + statuses.filter((s) => s === "doing").length + " in corso";
}
const levelNote = () => (state.level != null ? ", livello " + fmtLevel(state.level) : "");
// file di npm run me aperto con "Carica" (plan-file.ts)
function loadIntraFile(text) {
    setStatus(mergeIntra(text));
}
// riga "Dati dell'intra di jdoe (2026-10-03) · Esci", visibile dopo un import
function renderSession() {
    byId("intra-session").hidden = !state.intra;
    byId("auth-go").textContent = state.intra ? "Aggiorna dall'intra" : "Accedi con 42";
    if (state.intra)
        byId("intra-who").textContent = "Dati dell'intra di " + state.intra.login + (state.intra.date ? " (" + state.intra.date + ")" : "");
}
// "Esci": riporta i progetti importati com'erano prima dell'import, e toglie voti, livello e login
byId("intra-logout").addEventListener("click", () => {
    const s = state.intra;
    if (!s)
        return;
    if (!confirm("Dimenticare i dati dell'intra di " + s.login + "?\n\nI progetti importati tornano com'erano prima dell'import; voti e livello vengono tolti. Il resto del piano non cambia."))
        return;
    for (const [id, before] of Object.entries(s.prev)) {
        if (before)
            state.picked[id] = before;
        else
            delete state.picked[id];
        delete state.marks[id];
    }
    state.level = null;
    state.intra = null;
    try {
        localStorage.removeItem(LOGIN_KEY);
    }
    catch { }
    intraLogin.value = "";
    authMsg.textContent = "Dati dell'intra dimenticati.";
    intraMsg.textContent = "";
    save();
    render();
});
/* ---------- server locale (npm run serve): la pagina chiede il login, il server legge l'API di 42 ---------- */
const intraForm = byId("intra-form");
const intraLogin = byId("intra-login");
const intraGo = byId("intra-go");
const intraMsg = byId("intra-msg");
const LOGIN_KEY = "rncp-intra-login";
try {
    intraLogin.value = localStorage.getItem(LOGIN_KEY) || "";
}
catch { }
// il modulo compare solo se risponde il server locale
async function checkServer() {
    if (!location.protocol.startsWith("http"))
        return; // aperta come file: niente server
    try {
        const res = await fetch("api/ping", { cache: "no-store" });
        if (!res.ok)
            return; // GitHub Pages o un altro server statico
        const info = (await res.json());
        intraForm.hidden = false;
        if (!info.intra) {
            intraLogin.disabled = intraGo.disabled = true;
            intraMsg.textContent = "Mancano FT_UID e FT_SECRET in .env: vedi tools/README.md.";
        }
    }
    catch { /* nessun server locale */ }
}
intraForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!intraLogin.checkValidity())
        return;
    const login = intraLogin.value.trim().toLowerCase();
    try {
        localStorage.setItem(LOGIN_KEY, login);
    }
    catch { }
    intraGo.disabled = true;
    intraMsg.textContent = "Lettura dall'intra…";
    try {
        const res = await fetch("api/me?login=" + encodeURIComponent(login), { cache: "no-store" });
        const text = await res.text();
        if (!res.ok)
            throw new Error(JSON.parse(text).error || "HTTP " + res.status);
        intraMsg.textContent = mergeIntra(text) + levelNote() + ".";
    }
    catch (err) {
        intraMsg.textContent = "Import non riuscito: " + (err instanceof Error ? err.message : String(err));
    }
    finally {
        intraGo.disabled = false;
    }
});
// dagli slug dell'intra al formato di npm run me (id della pagina), così passa da mergeIntra
function intraToPlan(data) {
    const status = {}, marks = {};
    for (const pr of PROJECTS) {
        const got = data.p[pr.slug];
        if (!got)
            continue;
        status[pr.id] = got[0] === "d" ? "done" : "doing";
        if (got[0] === "d" && got[1] != null)
            marks[pr.id] = got[1];
    }
    return JSON.stringify({ version: 2, source: "intra", login: data.login, date: data.date, level: data.level, picked: Object.keys(status), status, marks });
}
const authBox = byId("auth-box");
const authMsg = byId("auth-msg");
const authUrl = (authBox.dataset.auth || "").replace(/\/+$/, ""); // vuoto = pulsante nascosto
if (authUrl && location.protocol.startsWith("http"))
    authBox.hidden = false;
byId("auth-go").addEventListener("click", () => {
    location.href = authUrl + "/login?return=" + encodeURIComponent(location.origin + location.pathname);
});
// ritorno dal login: legge il frammento e lo cancella dall'indirizzo (non resta nella cronologia né nei link copiati)
function readAuthReturn() {
    const hash = location.hash.slice(1);
    if (!hash.startsWith("intra=") && !hash.startsWith("intra-error="))
        return;
    history.replaceState(null, "", location.pathname + location.search);
    authBox.hidden = !authUrl;
    if (hash.startsWith("intra-error=")) {
        authMsg.textContent = "Accesso non riuscito: " + decodeURIComponent(hash.slice("intra-error=".length));
        return;
    }
    try {
        const b64 = hash.slice("intra=".length).replace(/-/g, "+").replace(/_/g, "/");
        const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
        const data = JSON.parse(new TextDecoder().decode(bytes));
        authMsg.textContent = mergeIntra(intraToPlan(data)) + levelNote() + ".";
    }
    catch (err) {
        authMsg.textContent = "Dati dell'intra non leggibili: " + (err instanceof Error ? err.message : String(err));
    }
}
/* Esporta il piano: Markdown o PDF (stampa del browser di #report, visibile solo in stampa) */
const planSections = () => optBlocks().map((id) => ({ blk: BLOCKS[id], t: tally(id), chosen: sortProjects(PROJECTS.filter((pr) => pr.blocks.includes(id) && state.picked[pr.id])) }));
// i progetti scelti nell'ordine dei filtri, ognuno una volta sola anche se conta in più blocchi
const uniqueChosen = (secs) => sortProjects([...new Set(secs.flatMap((sec) => sec.chosen))]);
// "Totale: 5 progetti, 40 000 XP; da fare: ~36 giorni (26 lavorativi, 210 h). …"; bold mette in grassetto per il Markdown
function totalLine(secs, bold) {
    const all = uniqueChosen(secs);
    const h = sumHours(all.filter(isPending));
    return "Totale: " + bold(plural(all.length, "progetto", "progetti")) + ", " + bold(fmt(sumXp(all)) + " XP") + "; da fare: " + bold(daysLabel(h)) + daysNote(h)
        + ". Ogni progetto è contato una volta; ore stimate dall'intra, giornate da " + fmtDayHours(state.dayHours) + " h, sabato e domenica liberi.";
}
// "2/2 progetti · 13 650/10 000 XP (fatti: 1, 9450 XP)"
const progress = ({ blk, t }) => t.n + "/" + blk.minN + " progetti" + (blk.minXp ? " · " + fmt(t.xp) + "/" + fmt(blk.minXp) + " XP" : "")
    + " (fatti: " + t.doneN + (blk.minXp ? ", " + fmt(t.doneXp) + " XP" : "") + ")";
const blockState = (t) => (t.valid ? "Validato" : t.covered ? "Coperto dal piano" : "Da completare");
const blockIcon = (t) => (t.valid ? "✅" : t.covered ? "☑️" : "⏳");
const statusOf = (pr) => STATUS_NAMES[state.picked[pr.id] || "todo"];
const projectFacts = (pr) => [pr.lang, xpLabel(pr), timeLabel(pr), peopleLabel(pr)].join(" · ");
/* ---------- Markdown ---------- */
function planMarkdown() {
    const secs = planSections();
    const title = currentTitle();
    const lines = [
        "# Piano " + title.name,
        "",
        "**" + optName() + "** · esportato il " + today() + " · ordine: " + sortLabel(),
        "",
        "## Riepilogo",
        "",
        "| Blocco | Minimo | Avanzamento | Stato |",
        "| --- | --- | --- | --- |",
        ...secs.map((sec) => "| " + sec.blk.name + " | " + blockRule(sec.blk) + " | " + progress(sec) + " | " + blockIcon(sec.t) + " " + blockState(sec.t) + " |"),
        "",
        totalLine(secs, (s) => "**" + s + "**"),
    ];
    for (const sec of secs) {
        lines.push("", "## " + blockIcon(sec.t) + " " + sec.blk.name, "", "_" + progress(sec) + "_", "");
        if (!sec.chosen.length) {
            lines.push("Nessun progetto scelto.");
            continue;
        }
        for (const pr of sec.chosen) {
            lines.push("- **" + pr.name + "** · _" + statusOf(pr) + "_ · " + projectFacts(pr) + " · [subject](" + pageUrl(pr) + ")");
            lines.push("  " + pr.desc);
        }
    }
    return lines.join("\n") + "\n";
}
function planTimeline(secs) {
    const legs = [], missing = [];
    let doneH = 0, doneW = 0; // ore e giorni lavorativi dei progetti già messi in fila
    for (const pr of uniqueChosen(secs).filter(isPending)) {
        const h = hours(pr);
        if (h == null || h <= 0) {
            missing.push(pr);
            continue;
        }
        doneH += h;
        const endW = Math.max(doneW + 1, Math.round(doneH / state.dayHours)); // almeno un giorno a progetto
        legs.push({ pr, from: calendarStart(doneW), to: calendarDays(endW) });
        doneW = endW;
    }
    return { legs, total: calendarDays(doneW), missing };
}
function timelineSection(secs) {
    const part = el("section", "rep-time");
    part.append(el("h2", null, "Linea del tempo"));
    const { legs, total, missing } = planTimeline(secs);
    if (!legs.length) {
        part.append(el("p", "rep-empty", "Nessun progetto da fare con una stima delle ore."));
        return part;
    }
    part.append(el("p", "rep-rule", "I progetti non ancora fatti, uno alla volta, in ordine di " + sortLabel().toLowerCase() + ": ~" + fmt(total) + " giorni"
        + " (circa " + fmt(Math.round(total / 7)) + " settimane). Se inizi oggi finisci verso il " + dateIn(total) + "."));
    const chart = el("div", "tl");
    chart.style.setProperty("--week", (700 / total) + "%"); // una riga verticale a settimana
    for (const leg of legs) {
        const row = el("div", "tl-row");
        const track = el("div", "tl-track"), bar = el("i");
        bar.style.left = (leg.from / total) * 100 + "%";
        bar.style.width = ((leg.to - leg.from) / total) * 100 + "%";
        track.append(bar);
        row.append(el("span", "tl-name", leg.pr.name), track, el("span", "tl-days", "g. " + (leg.from + 1) + "–" + leg.to));
        chart.append(row);
    }
    const axis = el("div", "tl-row tl-axis");
    const ends = el("div", "tl-ends");
    ends.append(el("span", null, "oggi"), el("span", null, dateIn(total)));
    axis.append(el("span"), ends, el("span"));
    chart.append(axis);
    part.append(chart);
    if (missing.length)
        part.append(el("p", "rep-rule", "Senza stima delle ore, esclusi: " + missing.map((pr) => pr.name).join(", ") + "."));
    return part;
}
/* ---------- PDF: riempie #report e apre la finestra di stampa ---------- */
function printPlan() {
    const secs = planSections();
    const root = byId("report");
    root.textContent = "";
    const head = el("header", "rep-head");
    head.append(el("h1", null, "Piano " + currentTitle().name), el("p", null, optName() + " · esportato il " + today() + " · ordine: " + sortLabel()));
    const sum = el("div", "rep-summary");
    for (const sec of secs) {
        const box = el("div", "rep-meter" + (sec.t.valid ? " done" : ""));
        box.append(el("b", null, (sec.t.valid ? "✓ " : "") + sec.blk.name), el("span", null, blockState(sec.t) + " · " + progress(sec)));
        sum.append(box);
    }
    root.append(head, sum, el("p", "rep-total", totalLine(secs, (s) => s)), timelineSection(secs));
    for (const sec of secs) {
        const part = el("section", "rep-block");
        const h = el("h2", null, sec.blk.name);
        h.append(el("span", "rep-state" + (sec.t.valid ? " done" : ""), (sec.t.valid ? "✓ " : "") + blockState(sec.t)));
        part.append(h, el("p", "rep-rule", "Minimo " + blockRule(sec.blk) + " · " + progress(sec)));
        if (!sec.chosen.length)
            part.append(el("p", "rep-empty", "Nessun progetto scelto."));
        for (const pr of sec.chosen) {
            const item = el("article", "rep-item");
            const title = el("h3", null, pr.name);
            title.append(el("span", null, statusOf(pr) + " · " + projectFacts(pr)));
            const a = el("a", null, pageUrl(pr));
            a.href = pageUrl(pr);
            item.append(title, el("p", null, pr.desc), a);
            part.append(item);
        }
        root.append(part);
    }
    window.print();
}
/* ---------- menu "Esporta": si chiude con un clic fuori, con Esc o dopo aver scelto una voce ---------- */
const menuBtn = byId("menu-btn");
const menuPop = byId("menu-pop");
function setMenu(open) {
    menuPop.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
}
menuBtn.addEventListener("click", () => setMenu(menuPop.hidden));
menuPop.addEventListener("click", (e) => { if (e.target.closest("button"))
    setMenu(false); });
document.addEventListener("click", (e) => {
    if (!menuPop.hidden && !e.target.closest(".menu"))
        setMenu(false);
});
document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || menuPop.hidden)
        return;
    setMenu(false);
    menuBtn.focus();
});
byId("export-md").addEventListener("click", () => download(fileName("md"), planMarkdown(), "text/markdown"));
byId("export-pdf").addEventListener("click", printPlan);
/* Avvio: tutti gli altri file hanno già collegato i pulsanti */
render();
void restoreLink().then(readAuthReturn); // dopo l'eventuale file collegato, che altrimenti sovrascriverebbe l'import
void checkServer();
