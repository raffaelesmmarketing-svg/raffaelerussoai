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
}

export const guide: Guida[] = [
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

export const pdfDi = (g: Guida) => `/guide/${g.slug}.pdf`
export const copertinaDi = (g: Guida) => `/guide/copertine/${g.slug}.jpg`
export const guidaPerSlug = (slug: string) => guide.find((g) => g.slug === slug)
