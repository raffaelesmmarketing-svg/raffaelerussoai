// Le guide gratuite. Una fonte sola per /risorse, /guida/[slug], la home e il «Grazie» della landing:
// una guida nuova è una voce qui, più il PDF e la copertina stampati da `scripts/stampa-guide.mjs`.
// ⛔ Titolo e minuti sono quelli scritti DENTRO la guida: non si arrotondano qui.

// I temi dei filtri di /risorse (scelti da Raffaele il 26/10). Una guida può stare in più temi; l'ordine qui è
// l'ordine dei pulsanti. «skill» è il formato: le guide che regalano una skill da installare.
export const temi = [
  { id: 'cominciare', nome: 'Per cominciare' },
  { id: 'marketing', nome: 'Marketing e clienti' },
  { id: 'social', nome: 'Social e contenuti' },
  { id: 'agenti', nome: 'Agenti e automazioni' },
  { id: 'organizzazione', nome: 'Organizzare il lavoro' },
  { id: 'skill', nome: 'Skill da installare' },
] as const

export type Tema = (typeof temi)[number]['id']

export type Guida = {
  slug: string
  /** i temi dei filtri di /risorse: almeno uno */
  temi: Tema[]
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
    slug: 'le-9-skill-legali-di-claude',
    temi: ['skill', 'organizzazione'],
    parole: ['legale'],
    titolo: 'Le 9 skill legali di Claude',
    minuti: 8,
    sotto: 'Prima di firmare un contratto, fallo leggere a Claude: nove skill gratuite di Anthropic.',
    descrizione:
      'Anthropic ha messo online gratis nove skill per il lavoro legale: Claude ti legge il contratto clausola per clausola, smista gli accordi di riservatezza e controlla cosa scade con un fornitore. Come si installano, il foglio con le tue condizioni da scrivere una volta e le richieste da copiare. Serve un piano a pagamento di Claude.',
    dentro: [
      'Cosa sono, cosa ti serve e cosa non fanno',
      'Come si installano, con un clic',
      'Il foglio con le tue condizioni, da scrivere una volta sola',
      'Le richieste da copiare per review-contract, triage-nda e vendor-check',
      'Le altre sei, per tutto il resto',
    ],
    conMail: true,
  },
  {
    slug: 'claude-motion-per-la-tua-azienda',
    temi: ['social', 'marketing'],
    parole: ['motion'],
    titolo: 'Claude Motion per la tua azienda',
    minuti: 6,
    sotto: 'Un report, un listino o i numeri del mese diventano un video animato da mandare su WhatsApp.',
    descrizione:
      'Gli dai un report, un listino o i numeri del mese, e Claude ne fa un video animato che scarichi in MP4 e mandi su WhatsApp. Come si apre, le tre cose da dirgli, come lo correggi a parole e quattro richieste già scritte da copiare. Serve Claude col piano Team o Enterprise.',
    dentro: [
      'Chi ce l’ha, quanto costa e cosa non fa',
      'Come si apre e le tre cose da dirgli',
      'Come lo correggi a parole e lo scarichi in MP4',
      'Quattro richieste da copiare: report, numeri del mese, listino, clienti nuovi',
    ],
    conMail: true,
  },
  {
    slug: 'le-8-skill-di-hormozi',
    temi: ['marketing', 'skill'],
    parole: ['hormozi'],
    titolo: 'Le 8 skill di Hormozi per Claude e ChatGPT',
    minuti: 8,
    sotto: 'Offerta, prezzo, obiezioni, ganci, controllo, appuntamenti, cassa e prove: le regole dei suoi manuali, lette prima di rispondere.',
    descrizione:
      'Ho fatto studiare all’intelligenza artificiale 13 manuali di Hormozi, 463 pagine: ne sono uscite otto skill che costruiscono l’offerta, fanno il prezzo, allenano chi vende sulle obiezioni, scrivono i ganci e altro. Qui scarichi il pacchetto gratuito, lo metti su Claude Code, sull’app di Claude o su ChatGPT, e trovi il metodo per rifarlo col libro che stai leggendo.',
    dentro: [
      'Cosa c’è nel pacchetto, e il passaggio che non salto mai',
      'Come si mettono su Claude Code, sull’app di Claude e su ChatGPT',
      'Le otto skill, con una richiesta da copiare per ognuna',
      'Il metodo per rifarlo col tuo libro',
    ],
    conMail: true,
  },
  {
    slug: 'farsi-citare-da-chatgpt',
    temi: ['marketing', 'skill'],
    parole: ['seo'],
    titolo: 'Quando chiedono a ChatGPT il migliore della tua zona, esci tu?',
    minuti: 6,
    sotto: 'La skill ai-seo prova le domande dei tuoi clienti su ChatGPT, Perplexity e Google e ti dice chi viene citato.',
    descrizione:
      'Sempre più clienti chiedono all’intelligenza artificiale chi è il migliore della zona. La skill ai-seo prepara le domande che farebbe un tuo cliente, segna chi viene citato su ChatGPT, Perplexity e Google, tu o i concorrenti, e ti dice cosa sistemare. Come si installa, la scheda dell’azienda e tre richieste da copiare.',
    dentro: [
      'Come controlla chi viene citato',
      'Come si installa nell’app di Claude e in Claude Code',
      'La scheda della tua azienda, scritta una volta',
      'Tre richieste da copiare',
    ],
    conMail: true,
  },
  {
    slug: 'la-lista-dei-prossimi-clienti',
    temi: ['marketing', 'skill'],
    parole: ['lista'],
    titolo: 'La lista dei tuoi prossimi clienti, nella tua zona, con Claude',
    minuti: 6,
    sotto: 'La skill prospecting cerca le attività che somigliano al tuo cliente ideale e le mette in ordine, dalle più calde.',
    descrizione:
      'Claude può farti la lista dei tuoi prossimi clienti, nella tua zona. La skill prospecting cerca le attività che somigliano al tuo cliente ideale, controlla sito e social, le divide e dà a ognuna un voto. Come si installa, la scheda dell’azienda, tre richieste da copiare e le regole che rispetta.',
    dentro: [
      'Come cerca e come dà i voti',
      'Come si installa nell’app di Claude e in Claude Code',
      'La scheda della tua azienda, scritta una volta',
      'Tre richieste da copiare',
    ],
    conMail: true,
  },
  {
    slug: 'le-parole-dei-tuoi-clienti',
    temi: ['marketing', 'skill'],
    parole: ['clienti'],
    titolo: 'Le tue recensioni ti dicono cosa scrivere nella pubblicità',
    minuti: 6,
    sotto: 'La skill customer-research legge recensioni, mail e appunti delle chiamate e tira fuori cosa vogliono i clienti, con le loro parole.',
    descrizione:
      'Le tue recensioni ti stanno già dicendo cosa scrivere nella pubblicità. La skill customer-research legge recensioni, mail dei clienti, appunti delle chiamate e sondaggi, e tira fuori cosa vogliono davvero, cosa li blocca e le parole esatte che usano. Come si installa, la scheda dell’azienda e tre richieste da copiare.',
    dentro: [
      'Cosa tira fuori da recensioni, mail e chiamate',
      'Come si installa nell’app di Claude e in Claude Code',
      'La scheda della tua azienda, scritta una volta',
      'Tre richieste da copiare',
    ],
    conMail: true,
  },
  {
    slug: 'la-pagina-del-sito-che-vende',
    temi: ['marketing', 'skill'],
    parole: ['pagina'],
    titolo: 'La pagina del tuo sito vende? Te lo dice Claude',
    minuti: 6,
    sotto: 'La skill cro legge la pagina come un cliente e ti dà le modifiche, dalle più veloci alle più importanti.',
    descrizione:
      'Chi arriva sul tuo sito ha cinque secondi per capire cosa fai. La skill cro legge la tua pagina come un cliente, nell’ordine in cui conta, e ti dà le modifiche da fare subito, quelle importanti, le prove da fare e due o tre titoli alternativi. Come si installa, la scheda dell’azienda e tre richieste da copiare.',
    dentro: [
      'Cosa guarda, e in che ordine',
      'Come si installa nell’app di Claude e in Claude Code',
      'La scheda della tua azienda, scritta una volta',
      'Tre richieste da copiare',
    ],
    conMail: true,
  },
  {
    slug: 'offerta-rifatta-con-claude',
    temi: ['marketing', 'skill'],
    parole: ['offerta'],
    titolo: 'Se ti dicono «è caro»: l’offerta rifatta con Claude',
    minuti: 6,
    sotto: 'La skill offers dà un voto da 1 a 10 alle quattro leve del valore e ti dice quale sistemare per prima.',
    descrizione:
      'Quando i clienti dicono «è caro», quasi sempre il problema non è il prezzo. La skill offers dà un voto da uno a dieci alle quattro leve dell’equazione del valore di Hormozi e controlla i sei pezzi di un’offerta completa. Come si installa, la scheda dell’azienda e tre richieste da copiare.',
    dentro: [
      'Le quattro leve del valore e i sei pezzi di un’offerta',
      'Come si installa nell’app di Claude e in Claude Code',
      'La scheda della tua azienda, scritta una volta',
      'Tre richieste da copiare',
    ],
    conMail: true,
  },
  {
    slug: 'consiglio-dei-grandi-del-marketing',
    temi: ['marketing', 'skill'],
    parole: ['consiglio'],
    titolo: 'Hormozi, Ogilvy e Godin discutono la tua offerta, con Claude',
    minuti: 6,
    sotto: 'La skill che riunisce un consiglio di dodici grandi del marketing sulla tua decisione, con un presidente che tira le somme.',
    descrizione:
      'Con la skill marketing-council Claude riunisce un consiglio simulato di dodici grandi del marketing e ne fa sedere da tre a cinque sulla tua domanda, scelti perché la pensano in modo diverso. Alla fine un presidente mette in fila dove non sono d’accordo e cosa conviene fare. Come si installa, la scheda dell’azienda e tre richieste da copiare.',
    dentro: [
      'Cosa fa e chi siede al tavolo',
      'Come si installa nell’app di Claude e in Claude Code',
      'La scheda della tua azienda, scritta una volta',
      'Tre richieste da copiare',
    ],
    conMail: true,
  },
  {
    slug: 'le-13-skill-social-media-manager',
    temi: ['social', 'skill'],
    parole: ['social'],
    titolo: 'Le 13 skill che trasformano Claude nel tuo social media manager',
    minuti: 8,
    sotto: 'Reel, didascalie, caroselli, piano della settimana, commenti e profilo: scrivono loro, pubblichi tu.',
    descrizione:
      'Tredici skill gratuite per Instagram da installare in Claude: IG Reel scrive il reel con tre ganci e il loro voto, IG Viral trova i reel che funzionano nel tuo settore, IG Plan prepara la settimana, IG Reply divide i commenti, IG Profile dà un voto al tuo profilo e riscrive la bio. Come si installano, il file con la tua voce e cosa fa ognuna, con un esempio.',
    dentro: [
      'Come si installano, in un minuto',
      'Il file con la tua voce, che leggono tutte',
      'Le tredici, una per una, con un esempio',
      'Da quale partire',
    ],
    conMail: true,
  },
  {
    slug: 'le-4-skill-di-claude-per-un-azienda',
    temi: ['cominciare', 'skill'],
    parole: ['skill'],
    titolo: 'Le 4 skill di Claude che servono a un’azienda',
    minuti: 8,
    sotto: 'Humanizer, Scrapling, HyperFrames e watch: cosa fa ognuna, su quale lavoro usarla e come si installa.',
    descrizione:
      'Sul mio computer ci sono più di cento skill per Claude: se hai un’azienda te ne servono quattro. Humanizer toglie dai testi i segni dell’AI, Scrapling legge i siti e i profili pubblici dei concorrenti, HyperFrames fa grafiche e video sul tuo computer, watch guarda un video al posto tuo. Per ognuna: cosa fa, come la uso io, come si installa e la richiesta da copiare.',
    dentro: [
      'Cos’è una skill e dove funziona',
      'Le quattro skill: cosa fanno e come le uso io',
      'I comandi per installarle, una per una',
      'La richiesta per installarle tutte e quattro in una volta',
    ],
    conMail: true,
  },
  {
    slug: 'il-primo-agente-con-claude',
    temi: ['cominciare', 'agenti'],
    titolo: 'Il tuo primo agente con Claude, senza programmare',
    minuti: 9,
    sotto: 'Scarichi l’app, la sistemi in pochi minuti e gli dai il primo lavoro vero, con le schermate.',
    descrizione:
      'La guida del video «Cos’è un agente AI»: scarichi l’app di Claude, gli dai una cartella sola, scegli quanto ti chiede il permesso, gli scrivi le regole una volta e fai partire il primo lavoro con il comando in quattro parti. Con il risultato vero di un esempio e la regola per capire quando ti serve un agente.',
    dentro: [
      'Cosa ti serve e quanto costa: l’abbonamento, niente a consumo',
      'I sei passaggi, con le schermate vere dell’app',
      'Il comando in quattro parti da copiare, e cosa ti consegna',
      'Agente, automazione o chat: la regola in tre righe',
    ],
    conMail: true,
  },
  {
    slug: 'montaggio-video-con-claude',
    temi: ['social', 'skill'],
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
      'La dashboard: tutti i video in una pagina, da approvare uno alla volta',
    ],
    conMail: true,
  },
  {
    slug: 'mirofish-il-pubblico-finto',
    temi: ['marketing', 'agenti'],
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
    temi: ['agenti'],
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
    temi: ['social', 'agenti'],
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
    temi: ['social', 'skill'],
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
    temi: ['organizzazione'],
    parole: ['brain', 'buongiorno', 'memoria'],
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
    temi: ['organizzazione'],
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
    temi: ['social', 'agenti'],
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
    temi: ['organizzazione', 'skill'],
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
    temi: ['agenti', 'organizzazione'],
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
    temi: ['social', 'agenti'],
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
    temi: ['cominciare', 'agenti'],
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
    temi: ['cominciare'],
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
    temi: ['cominciare'],
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
