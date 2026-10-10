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
}

export const guide: Guida[] = [
  {
    slug: 'agenti-che-scrivono-il-blog',
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
