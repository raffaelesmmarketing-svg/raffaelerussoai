// Le guide gratuite. Una fonte sola per /risorse, /guida/[slug], la home e il «Grazie» della landing:
// una guida nuova è una voce qui, più il PDF e la copertina stampati da `scripts/stampa-guide.mjs`.
// ⛔ Titolo e minuti sono quelli scritti DENTRO la guida: non si arrotondano qui.

export type Guida = {
  slug: string
  titolo: string
  minuti: number
  /** una riga, per gli elenchi */
  sotto: string
  /** due-tre frasi, per la scheda e la pagina della guida */
  descrizione: string
  /** cosa c'è dentro, preso dai passi della guida */
  dentro: string[]
  /** si scarica solo dopo aver lasciato la mail: il PDF non ha un indirizzo pubblico
   *  (lo dà `src/app/guida/[slug]/actions.ts` dopo la mail) */
  conMail?: true
  /** le parole del Centralino di Instagram che portano qui: il messaggio in privato dà il link corto
   *  raffaelerussoai.com/g/<parola> (in minuscolo), che rimanda alla guida con ?da=instagram (next.config.ts) */
  parole?: string[]
}

export const guide: Guida[] = [
  {
    slug: 'montaggio-video-con-claude',
    parole: ['montaggio', 'editing'],
    titolo: 'I tuoi video montati da Claude, come i miei',
    minuti: 7,
    sotto: 'La skill gratuita che monta i video in cui parli: tagli, zoom, scritte, sottotitoli e musica, con Claude Code.',
    descrizione:
      'La skill che uso per farmi montare i video da Claude, pronta da installare in Claude Code. Tu registri; lui toglie le pause e le frasi sbagliate, mette zoom, scritte, sottotitoli e musica, e ogni correzione che gli dai diventa una regola. Per i video verticali e per quelli lunghi di YouTube.',
    dentro: [
      'Cosa fa, cosa ti serve e cosa non fa',
      'Il messaggio da incollare in Claude Code per installare la skill',
      'Come registrare perché il montaggio venga bene',
      'Come fartelo montare e come correggerlo',
    ],
    conMail: true,
  },
  {
    slug: 'mirofish-il-pubblico-finto',
    parole: ['simulazione', 'mirofish'],
    titolo: 'MiroFish: il pubblico finto per provare le tue idee',
    minuti: 9,
    sotto: 'Persone finte che discutono la tua idea prima che la veda un cliente vero, e la prova da fare prima di fidarti.',
    descrizione:
      'Come uso MiroFish e la sua versione leggera con Claude: gli dai un documento e una domanda, crea tante persone finte, le fa discutere e ti scrive un rapporto. Serve a trovare gli errori evidenti prima di spendere, non a indovinare il futuro: per questo prima si prova su qualcosa di cui sai già com’è andata.',
    dentro: [
      'Cosa fa davvero, e cosa non fa (l’ho misurato)',
      'Come si installa MiroFish, passo per passo',
      'La versione leggera: la prova generale con Claude, senza installare niente',
      'La controprova sul passato e tre esempi di domande',
    ],
    conMail: true,
  },
  {
    slug: 'agenti-sull-abbonamento-di-claude',
    parole: ['abbonamento', 'status'],
    titolo: 'I tuoi agenti sull’abbonamento di Claude, senza pagare le API',
    minuti: 6,
    sotto: 'Un comando per vedere come paghi, la chiave da togliere e claude -p per far partire gli agenti.',
    descrizione:
      'Come ho smesso di pagare le API per i miei agenti: con /status vedi se Claude Code usa una chiave API e paghi a consumo anche con l’abbonamento, la togli, rientri nel piano e fai partire gli agenti con claude -p. Con i limiti da tenere d’occhio.',
    dentro: [
      'Perché puoi pagare due volte senza accorgertene',
      'I cinque passaggi: /status, la chiave, il login, claude -p, i limiti',
      'La frase da dire a Claude per far girare un agente',
      'Gli agenti che partono da soli: il token dell’abbonamento',
    ],
    conMail: true,
  },
  {
    slug: 'il-mio-manychat-con-claude-code',
    parole: ['manychat', 'centralino'],
    titolo: 'Il tuo ManyChat fatto con Claude Code',
    minuti: 10,
    sotto: 'Chi commenta una parola riceve il messaggio in privato, e chi lascia il numero ti arriva come avviso.',
    descrizione:
      'Come ho costruito il mio risponditore per Instagram con Claude Code, al posto di ManyChat: un’app su Meta for Developers, il programma scritto da Claude, messo online e provato da un altro profilo prima di accenderlo. Con le regole di Meta da rispettare e quello che costa davvero.',
    dentro: [
      'Cosa fa e le regole di Meta (7 giorni, 24 ore)',
      'I cinque passaggi: profilo, app su Meta, programma, online, prova',
      'La richiesta da dare a Claude Code per scrivere il programma',
      'Le parole e i messaggi: come li scrivo io',
    ],
    conMail: true,
  },
  {
    slug: 'humanizer-testi-umani',
    parole: ['umano', 'humanizer'],
    titolo: 'Humanizer: testi che non sembrano scritti da ChatGPT',
    minuti: 6,
    sotto: 'La skill gratuita che toglie i segni della scrittura AI, e la regola che le ho dato.',
    descrizione:
      'Humanizer è una skill gratuita su GitHub che riscrive i testi fatti con l’AI senza cambiare quello che dicono: parte dalla pagina di Wikipedia sui segni della scrittura AI. Come si installa in Claude Code e su Claude.ai, la regola che le ho dato e come usarla anche se scrivi con ChatGPT.',
    dentro: [
      'I cinque segni che tradiscono un testo scritto con l’AI',
      'Come si installa in Claude Code e su Claude.ai',
      'La regola da dare a Claude, da copiare',
      'Come usarla se scrivi con ChatGPT',
    ],
    conMail: true,
  },
  {
    slug: 'second-brain-con-claude',
    parole: ['brain', 'buongiorno'],
    titolo: 'Il tuo second brain con Claude: scrivi buongiorno e sa da dove ripartire',
    minuti: 8,
    sotto: 'Una cartella su Obsidian, un file di istruzioni e due parole al giorno: buongiorno e buonanotte.',
    descrizione:
      'Come ho costruito il mio second brain: una cartella su Obsidian con un file su di me e uno per ogni giorno, un file di istruzioni che legge Claude Code, e due rituali. La mattina scrivo buongiorno e sa cosa è rimasto a metà ieri; la sera scrivo buonanotte, rispondo a cinque domande e aggiorna tutto lui. Con il prompt e il file di istruzioni da copiare.',
    dentro: [
      'I tre pezzi: la cartella, il file di istruzioni, i due rituali',
      'La richiesta da dare a Claude Code per montarlo',
      'Il file di istruzioni da copiare (buongiorno e buonanotte)',
      'Le cinque domande della sera',
    ],
    conMail: true,
  },
  {
    slug: 'granola-e-claude-code',
    parole: ['granola', 'riassunto'],
    titolo: 'Finisci la call, il riassunto è già pronto: Granola e Claude Code',
    minuti: 6,
    sotto: 'Granola ascolta la call dal computer, Claude tira fuori decisioni e prossimi passi.',
    descrizione:
      'Come uso Granola con Claude Code: Granola ascolta le call dal computer, senza un robot che entra nella riunione, e lascia note e riassunto. Collegato a Claude Code, a fine call gli chiedo decisioni, argomenti e prossimi passi, anche come lista di cose da fare. Passo passo, con tre consigli per usarlo bene.',
    dentro: [
      'Cosa fa Granola, e perché nessun robot entra nella call',
      'I quattro passaggi: installa, registra, collega, chiedi',
      'La richiesta da dare a Claude a fine call',
      'Tre consigli per usarlo bene',
    ],
    conMail: true,
  },
  {
    slug: 'claude-su-instagram-senza-rischiare-l-account',
    parole: ['instagram', 'chrome'],
    titolo: 'Claude sul tuo Instagram, senza rischiare l’account',
    minuti: 8,
    sotto: 'Instagram in Chrome, Claude che prepara e invia i messaggi, e niente parte senza il tuo ok.',
    descrizione:
      'Come uso Claude sul mio Instagram dal browser: apre il profilo o la chat che gli chiedi, prepara il messaggio e lo invia solo dopo il tuo sì. I quattro passaggi per collegarlo, cosa dicono le regole di Instagram e le cinque regole da dargli, per tenere basso il rischio sull’account.',
    dentro: [
      'Cosa dicono le condizioni d’uso di Instagram, e come si tiene basso il rischio',
      'I quattro passaggi: Claude in Chrome, l’accesso, «Manually approve», le regole',
      'Le cinque regole da copiare',
      'Tre richieste pronte: rispondere, scrivere a un’azienda, riprendere una chat',
    ],
    conMail: true,
  },
  {
    slug: 'il-cervello-della-squadra-con-claude',
    parole: ['cervello', 'squadra'],
    titolo: 'Il cervello della squadra: le stesse skill di Claude per tutti',
    minuti: 8,
    sotto: 'Le skill in un archivio privato su GitHub: correggi una volta, e alla prossima apertura le usano tutti.',
    descrizione:
      'Come lavoro con la mia collaboratrice: le istruzioni che insegno al mio Claude stanno in un archivio privato su GitHub, e il suo Claude, ogni volta che parte, scarica l’ultima versione. I sei passaggi per montarlo, l’hook che lo aggiorna da solo e le regole su chi modifica cosa.',
    dentro: [
      'Cos’è una skill e che problema risolve in una squadra',
      'I sei passaggi: l’archivio privato, l’elenco, la pubblicazione, il collegamento',
      'L’hook che a ogni avvio scarica l’ultima versione, da copiare',
      'Chi modifica cosa, e le tre regole per non litigare',
    ],
    conMail: true,
  },
  {
    slug: 'claude-su-whatsapp-senza-rischiare-il-numero',
    parole: ['whatsapp'],
    titolo: 'Claude sul tuo WhatsApp, senza rischiare il numero',
    minuti: 7,
    sotto: 'WhatsApp Web in Chrome, Claude che prepara le risposte e niente parte senza il tuo ok.',
    descrizione:
      'Come ho collegato Claude al mio WhatsApp senza programmi non ufficiali: WhatsApp Web aperto in Chrome e l’estensione ufficiale di Claude. Ti spiego come funziona, i quattro passaggi per collegarlo e le cinque regole da dargli, perché non faccia casini e agisca solo quando glielo chiedi tu.',
    dentro: [
      'Perché i «ponti» presi da internet ti fanno rischiare il numero',
      'I quattro passaggi: Claude in Chrome, WhatsApp Web, «Manually approve», le regole',
      'Le cinque regole da copiare',
      'Tre richieste pronte e la prova sulla chat con te stesso',
    ],
    conMail: true,
  },
  {
    slug: 'agenti-che-scrivono-il-blog',
    parole: ['agenti'],
    titolo: 'Gli agenti che scrivono il blog della tua azienda',
    minuti: 6,
    sotto: 'Quattro passaggi per un articolo al giorno: uno cerca, uno scrive, uno controlla, tu approvi.',
    descrizione:
      'Il sistema con cui il sito della mia azienda pubblica articoli tutti i giorni. Per ogni passaggio trovi cosa fa l’agente e le istruzioni da copiare; in fondo, come farlo girare da solo, con l’articolo che ti arriva su Telegram da approvare.',
    dentro: [
      'Le fonti giuste e la scheda dei fatti, da cui parte ogni articolo',
      'Le istruzioni dello scrittore: per chi, con che tono, cosa non dire mai',
      'Il controllo frase per frase, fatto da un agente diverso',
      'Il giro automatico con n8n, con l’approvazione su Telegram',
    ],
    conMail: true,
  },
  {
    slug: 'dieci-cose-da-automatizzare-senza-installare-niente',
    parole: ['automatizza'],
    titolo: 'Dieci cose che puoi automatizzare da domani, senza installare niente',
    minuti: 9,
    sotto: 'Dieci lavori che rifai ogni settimana, con il prompt da copiare per ognuno.',
    descrizione:
      'Preventivi, relazioni, risposte ai clienti, solleciti, verbali e altre cinque cose che rifai ogni settimana. Per ognuna trovi cosa fa l’AI, cosa resta a te e il prompt da copiare per cominciare in dieci minuti, dal browser.',
    dentro: [
      'Dieci lavori, dal preventivo alla ricerca nel tuo archivio',
      'Per ognuno: cosa fa l’AI e cosa resta a te',
      'Dieci prompt pronti da copiare',
      'Cosa fare con i dati dei clienti prima di incollarli in una chat',
    ],
  },
  {
    slug: 'chatgpt-non-e-google-usalo-davvero',
    parole: ['google'],
    titolo: 'ChatGPT non è Google: usalo davvero',
    minuti: 12,
    sotto: 'Da domande generiche a un collaboratore che conosce il tuo lavoro.',
    descrizione:
      'Se a ChatGPT fai le domande che faresti a Google, ti risponde come un manuale. Qui trovi come dargli il contesto giusto, così ti risponde sul tuo settore, sulla tua città e sul problema che hai davanti.',
    dentro: [
      'Perché oggi ottieni risposte generiche',
      'La frase di apertura da copiare: chi sei, per chi lavori, cosa ti serve',
      'Due versioni della stessa domanda, da provare mentre leggi',
      'La tua presentazione standard, scritta una volta e riusata ogni giorno',
    ],
  },
  {
    slug: 'stop-al-chatgpt-che-ti-da-sempre-ragione',
    parole: ['critico', 'parere'],
    titolo: 'Stop al ChatGPT che ti dà sempre ragione',
    minuti: 8,
    sotto: 'Come farti dire quello che non torna, invece di quello che vuoi sentire.',
    descrizione:
      'ChatGPT tende a darti ragione, anche quando la tua idea ha un buco. Qui trovi come chiedergli di fare il critico, prima di metterci soldi o la firma.',
    dentro: [
      'Perché l’AI ti dà ragione, e perché il tono sicuro non è una garanzia',
      'Come riscrivere una domanda per avere una risposta critica',
      'Il «Red Team»: far attaccare la tua idea come farebbe un concorrente',
      'I quattro errori che ti fanno fidare troppo',
    ],
  },
]

// Per una guida con la mail non c'è un PDF da linkare: si porta alla sua pagina, dove si sblocca.
export const pdfDi = (g: Guida) => (g.conMail ? `/guida/${g.slug}` : `/guide/${g.slug}.pdf`)
export const copertinaDi = (g: Guida) => `/guide/copertine/${g.slug}.jpg`
export const guidaPerSlug = (slug: string) => guide.find((g) => g.slug === slug)

// I link corti del Centralino: /g/instagram → la guida (pagina con la mail o PDF), col ?da=instagram di prima.
export const linkCorti = () =>
  guide.flatMap((g) => (g.parole ?? []).map((parola) => ({ parola, destinazione: `${pdfDi(g)}?da=instagram` })))
