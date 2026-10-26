/**
 * La candidatura alla consulenza gratuita del personal brand (/consulenza, 26/10/2026).
 *
 * Raffaele: chi arriva da Instagram (link in bio di @raffaelerusso.ai) e vuole sentirlo sceglie da dove parte, risponde a
 * poche domande e arriva già profilato, invece di finire sul sito intero. Il modello è il funnel di @ozzibig (studio nel
 * vault: `Business/personal-brand/STUDIO_funnel-ozzibig_2026-10-26.md`) e la candidatura di Cantieri Hub dello stesso
 * giorno: una domanda per schermata e una riga di risposta dopo le scelte che contano. Le porte e le domande sono del
 * personal brand (approvate da Raffaele il 26/10), nate dal cardine (`personal-brand.md`) e dalle consulenze già fatte.
 * A differenza di CH si chiude sul calendario di Calendly, dentro la pagina: il grazie per le risposte, cosa si guarda
 * nei 20 minuti, e si prenota lì; nome e mail li chiede Calendly (Raffaele, 26/10: «metti semplicemente Calendly e loro
 * possono prenotare l'appuntamento da qua»). ⛔ Chi risponde non vede i numeri del conto (Raffaele, 26/10: «evita di
 * mettere questi numeri»): il conto arriva solo a Raffaele, nell'avviso della prenotazione.
 *
 * Domande e funzioni stanno in un file solo, senza import, perché le prove girano con `node --test`, che non conosce
 * l'alias `@/`. La pagina e la rotta del server usano le stesse funzioni: le regole sono le stesse dai due lati.
 * ⛔ Niente testi, numeri o marchio di Cantieri Hub qui dentro (lo controlla una prova): l'edilizia esce con un link.
 */

export type Porta = 'attivita' | 'imparare'
export type Risposte = Record<string, string | string[]>
/** Dove porta un'uscita gentile: l'edilizia ha la sua consulenza, gli altri due sono consigli (si può proseguire). */
export type Uscita = 'edilizia' | 'informo' | 'gratis'

type Comune = {
  id: string
  titolo: string
  sotto?: string
  /** I testi per chi lavora da solo: le stesse domande, col tu al posto del voi. */
  solo?: { titolo?: string; sotto?: string }
  /** L'etichetta della risposta nell'avviso a Raffaele e nel testo per Calendly. */
  breve: string
  /** La domanda compare solo dopo questa risposta (es. «Altro» → «in due parole»). */
  mostraSe?: { id: string; valore: string }
}
/** La riga che compare sopra la domanda dopo, quando una risposta la merita. */
type Eco = readonly { se: string; frase: string }[]

export type DomandaScelta = Comune & {
  tipo: 'scelta'
  opzioni: readonly string[]
  /** I numeri del conto per Raffaele: le ore a settimana, il valore di un'ora (0 = da stimare insieme). */
  valori?: Readonly<Record<string, number>>
  saltaSe?: { id: string; valore: string }
  eco?: Eco
  uscita?: { se: string; dove: Uscita }
}
export type DomandaMultipla = Comune & { tipo: 'multipla'; opzioni: readonly string[]; max?: number; eco?: Eco }
export type DomandaTesto = Comune & { tipo: 'testo'; segnaposto: string; max: number }
export type Domanda = DomandaScelta | DomandaMultipla | DomandaTesto

type DatiPorta = {
  titolo: string
  descrizione: string
  /** Chi è, in terza persona: la prima riga del riepilogo per Raffaele. */
  chiE: string
  /** La riga sopra la prima domanda, dopo la scelta. */
  dopoLaScelta: string
  /** Cosa si guarda nei 20 minuti: solo cose che la chiamata fa davvero. */
  inChiamata: readonly string[]
  domande: readonly Domanda[]
}

/** Le settimane di lavoro dell'anno nel conto: 52 meno agosto e le feste, per stare bassi. */
export const SETTIMANE = 46
export const DA_SOLO = 'Lavoro da solo'
const EDILIZIA = 'Edilizia: impresa o studio tecnico'

const VALORI_ORA = { '20 €': 20, '35 €': 35, '50 €': 50, '80 € o più': 80, 'Non saprei': 0 }
// il numero di mezzo di ogni fascia; «Più di 10» conta 12, per stare bassi
const VALORI_ORE = { '1 o 2': 1.5, 'Da 3 a 5': 4, 'Da 6 a 10': 8, 'Più di 10': 12 }

// ── Le due strade ─────────────────────────────────────────────────────────────────────────────────────────────

export const PORTE: Readonly<Record<Porta, DatiPorta>> = {
  attivita: {
    titolo: "Ho un'attività o lavoro in proprio",
    descrizione: "Imprenditore, professionista o freelance: vuoi che l'AI faccia una parte del lavoro al posto tuo.",
    chiE: "Ha un'attività o lavora in proprio",
    dopoLaScelta: 'Bene: le prossime domande sono sul tuo lavoro.',
    inChiamata: [
      "Dove l'AI può togliere ore al tuo lavoro, partendo da quello che mi hai scritto",
      'Cosa si può fare subito, con gli strumenti che usi già',
      'Se conviene costruirlo insieme o farlo io, e quanto costa',
    ],
    domande: [
      {
        id: 'lavoro',
        tipo: 'scelta',
        titolo: 'Che lavoro fai?',
        breve: 'Lavoro',
        opzioni: [
          'Studio professionale (commercialista, avvocato, consulente)',
          'Salute e benessere',
          'Architettura e design',
          'Marketing, grafica e comunicazione',
          'Negozio, artigiano o produzione',
          'Ristorazione e ospitalità',
          'Servizi e consulenza alle aziende',
          'Creator, coach o formazione',
          EDILIZIA,
          'Altro',
        ],
        uscita: { se: EDILIZIA, dove: 'edilizia' },
      },
      {
        id: 'lavoroAltro',
        tipo: 'testo',
        titolo: 'Che lavoro fai, in due parole?',
        breve: 'Lavoro, in due parole',
        segnaposto: 'Es. fotografo di matrimoni',
        max: 80,
        mostraSe: { id: 'lavoro', valore: 'Altro' },
      },
      {
        id: 'persone',
        tipo: 'scelta',
        titolo: 'Quante persone siete, contando anche te?',
        breve: 'Persone',
        opzioni: [DA_SOLO, 'Da 2 a 5', 'Da 6 a 15', 'Più di 15'],
      },
      {
        id: 'ruolo',
        tipo: 'scelta',
        titolo: 'E tu, lì dentro, chi sei?',
        breve: 'Ruolo',
        opzioni: ['Titolare o socio', 'Responsabile di un reparto', 'Ci lavoro e vorrei proporlo'],
        saltaSe: { id: 'persone', valore: DA_SOLO },
        eco: [{ se: 'Ci lavoro e vorrei proporlo', frase: 'Va benissimo: alla chiamata può esserci anche chi decide.' }],
      },
      {
        id: 'tempo',
        tipo: 'multipla',
        titolo: 'Cosa vi porta via più tempo, ogni settimana?',
        solo: { titolo: 'Cosa ti porta via più tempo, ogni settimana?' },
        sotto: 'Scegline fino a due.',
        breve: 'Cosa porta via tempo',
        opzioni: [
          'Rispondere a messaggi e mail dei clienti',
          'Richiamare i contatti che arrivano',
          'Preventivi, documenti e pratiche',
          'Contenuti per i social e video',
          'Immagini e presentazioni per i clienti',
          'Fatture e amministrazione',
          'Altro',
        ],
        max: 2,
        eco: [{ se: 'Altro', frase: 'Me lo racconti fra poco, con le tue parole.' }],
      },
      {
        id: 'ore',
        tipo: 'scelta',
        titolo: 'Quante ore a settimana vi porta via, in tutto?',
        solo: { titolo: 'Quante ore a settimana ti porta via?' },
        breve: 'Ore a settimana',
        opzioni: Object.keys(VALORI_ORE),
        valori: VALORI_ORE,
      },
      {
        id: 'valoreOra',
        tipo: 'scelta',
        titolo: "Quanto vale un'ora di chi lo fa?",
        sotto: "Lo stipendio di chi lo fa, o quanto vale un'ora tua: così in chiamata so quanto vi costa oggi quel lavoro.",
        solo: { titolo: "Quanto vale un'ora del tuo lavoro?", sotto: 'Così in chiamata so quanto ti costa oggi quel lavoro.' },
        breve: "Valore di un'ora",
        opzioni: Object.keys(VALORI_ORA),
        valori: VALORI_ORA,
      },
      {
        id: 'ai',
        tipo: 'scelta',
        titolo: "E con l'AI, a che punto sei?",
        breve: 'AI oggi',
        opzioni: ["Non l'ho mai usata", 'Uso ChatGPT o Claude ogni tanto', 'La uso tutti i giorni', 'Ho già provato ad automatizzare qualcosa'],
        eco: [
          { se: "Non l'ho mai usata", frase: 'Si parte dalle basi, senza paroloni.' },
          { se: 'Ho già provato ad automatizzare qualcosa', frase: 'Segnato: in chiamata guardiamo cosa ha funzionato e cosa no.' },
        ],
      },
      {
        id: 'come',
        tipo: 'scelta',
        titolo: 'Come ti piacerebbe farlo?',
        breve: 'Come vorrebbe farlo',
        opzioni: ['Lo costruisci tu per me', 'Lo costruiamo insieme, e intanto imparo', 'Prima voglio capire da dove partire'],
        eco: [{ se: 'Prima voglio capire da dove partire', frase: 'È proprio a questo che servono i 20 minuti.' }],
      },
      {
        id: 'dolore',
        tipo: 'testo',
        titolo: 'Se domani potessi toglierti un lavoro dalla settimana, quale sarebbe?',
        sotto: 'Scrivilo come lo diresti a un amico. È la prima cosa che leggo prima di sentirti.',
        breve: 'Da togliere per primo',
        segnaposto: 'Es. rispondere uno per uno ai messaggi dei clienti',
        max: 400,
      },
      {
        id: 'quando',
        tipo: 'scelta',
        titolo: 'Quando vorresti partire?',
        breve: 'Quando',
        opzioni: ['Subito', 'Entro un mese', 'Fra qualche mese', 'Per ora mi informo'],
        uscita: { se: 'Per ora mi informo', dove: 'informo' },
      },
    ],
  },
  imparare: {
    titolo: 'Voglio imparare a farlo da me',
    descrizione: "Vuoi capire cosa può fare l'AI per te e imparare a usarla, anche partendo da zero.",
    chiE: 'Vuole imparare a farlo da sé',
    dopoLaScelta: 'Bene: ti chiedo da dove parti e quanto tempo hai.',
    inChiamata: ['Da dove partire, nel tuo caso', 'Gli strumenti giusti per quello che vuoi fare', 'Se ti serve un affiancamento o ti bastano le guide gratuite'],
    domande: [
      {
        id: 'oggi',
        tipo: 'scelta',
        titolo: 'Oggi cosa fai?',
        breve: 'Oggi',
        opzioni: ["Ho un'attività o lavoro in proprio", 'Sono dipendente', 'Sono freelance e vendo servizi', 'Studio, o riparto da zero'],
      },
      {
        id: 'imparare',
        tipo: 'multipla',
        titolo: 'Cosa vorresti imparare a fare?',
        sotto: 'Scegline fino a due.',
        breve: 'Vuole imparare',
        opzioni: [
          'Usare ChatGPT e Claude nel lavoro di tutti i giorni',
          'Creare contenuti e video',
          'Creare immagini e presentazioni',
          'Costruire agenti e automazioni',
          'Venderlo ad altri come servizio',
          'Non lo so ancora',
        ],
        max: 2,
        eco: [{ se: 'Non lo so ancora', frase: 'Normale: lo capiamo insieme, partendo dal tuo lavoro.' }],
      },
      {
        id: 'livello',
        tipo: 'scelta',
        titolo: "Con l'AI, oggi, dove sei?",
        breve: 'AI oggi',
        opzioni: ["Non l'ho mai usata", 'La uso ogni tanto', 'La uso tutti i giorni', 'Costruisco già qualcosa'],
      },
      {
        id: 'blocco',
        tipo: 'scelta',
        titolo: 'Cosa ti blocca di più?',
        breve: 'Cosa lo blocca',
        opzioni: ['Non so da dove cominciare', 'Le risposte sono generiche', 'Mi perdo fra gli strumenti', 'Non ho tempo', 'Ho paura di sbagliare con i dati'],
        eco: [
          { se: 'Le risposte sono generiche', frase: 'Succede quando non sa niente di te: è la prima cosa che si sistema.' },
          { se: 'Ho paura di sbagliare con i dati', frase: 'È una paura sana: in chiamata ti dico cosa dargli e cosa no.' },
        ],
      },
      {
        id: 'oreImparare',
        tipo: 'scelta',
        titolo: 'Quante ore a settimana puoi dedicarci, davvero?',
        breve: 'Ore a settimana',
        opzioni: ['1 o 2', 'Da 3 a 5', 'Più di 5'],
      },
      {
        id: 'modo',
        tipo: 'scelta',
        titolo: 'Come preferisci imparare?',
        breve: 'Come vuole imparare',
        opzioni: ['Da solo, con le guide', 'Uno a uno, con me accanto', 'Prima voglio capire da dove partire'],
        eco: [{ se: 'Da solo, con le guide', frase: 'Segnato: in chiamata ti dico da quali guide partire.' }],
      },
      {
        id: 'investimento',
        tipo: 'scelta',
        titolo: 'Per imparare bene, che investimento hai in mente?',
        sotto: 'Serve a proporti la strada giusta, senza farti perdere tempo.',
        breve: 'Investimento',
        opzioni: ['Per ora solo gratis', 'Fino a 500 €', 'Da 500 a 1.500 €', 'Più di 1.500 €', 'Prima voglio capire'],
        uscita: { se: 'Per ora solo gratis', dove: 'gratis' },
      },
      {
        id: 'dolore',
        tipo: 'testo',
        titolo: 'Qual è la prima cosa che vorresti saper fare?',
        sotto: 'Una cosa vera del tuo lavoro: si impara più in fretta così.',
        breve: 'La prima cosa da saper fare',
        segnaposto: 'Es. scrivere le mail ai clienti senza partire da zero',
        max: 400,
      },
    ],
  },
}

export const isPorta = (v: unknown): v is Porta => v === 'attivita' || v === 'imparare'

// ── Le funzioni ───────────────────────────────────────────────────────────────────────────────────────────────

const daSolo = (porta: Porta, r: Risposte) => porta === 'attivita' && r.persone === DA_SOLO

const visibile = (d: Domanda, r: Risposte) => {
  if (d.mostraSe && r[d.mostraSe.id] !== d.mostraSe.valore) return false
  if (d.tipo === 'scelta' && d.saltaSe && r[d.saltaSe.id] === d.saltaSe.valore) return false
  return true
}

/** Le domande della strada, senza quelle che le risposte date rendono inutili o che non le riguardano. */
export function domandeVisibili(porta: Porta, r: Risposte): Domanda[] {
  return PORTE[porta].domande.filter((d) => visibile(d, r))
}

/** Titolo e sottotitolo di una domanda per chi risponde: a chi lavora da solo si dà del tu. */
export function testiDi(d: Domanda, porta: Porta, r: Risposte): { titolo: string; sotto?: string } {
  if (daSolo(porta, r) && d.solo) return { titolo: d.solo.titolo ?? d.titolo, sotto: d.solo.sotto ?? d.sotto }
  return { titolo: d.titolo, sotto: d.sotto }
}

const valoreDi = (porta: Porta, r: Risposte, id: string): number | undefined => {
  const d = PORTE[porta].domande.find((x) => x.id === id)
  const v = r[id]
  return d && d.tipo === 'scelta' && typeof v === 'string' ? d.valori?.[v] : undefined
}

/**
 * Il conto dell'anno coi numeri di chi risponde (solo per chi ha un'attività): le ore a settimana per 46 settimane,
 * arrotondate a 10; gli euro sono le ore arrotondate per il valore di un'ora, arrotondati a 100. Senza il valore («Non
 * saprei») solo le ore. ⛔ È quanto costa oggi quel lavoro, non un risparmio: quanto se ne toglie si vede in chiamata.
 * Lo legge solo Raffaele, nell'avviso: a chi risponde non si mostra.
 */
export function conto(porta: Porta, r: Risposte): { ore: number; euro: number | null } | null {
  if (porta !== 'attivita') return null
  const ore = valoreDi(porta, r, 'ore')
  if (!ore) return null
  const anno = Math.round((ore * SETTIMANE) / 10) * 10
  const euroOra = valoreDi(porta, r, 'valoreOra')
  return { ore: anno, euro: euroOra ? Math.round((anno * euroOra) / 100) * 100 : null }
}

/** 13000 → «13.000», sempre col punto delle migliaia. */
export const numero = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

const pulito = (v: unknown, max: number) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max)

/** La riga da mostrare sopra la domanda successiva, o «» se la risposta non ne ha. */
export function ecoDopo(porta: Porta, id: string, r: Risposte): string {
  if (id === 'dolore') return pulito(r.dolore, 400) ? 'Segnato. È la prima cosa che leggo prima di sentirti.' : ''
  const d = PORTE[porta].domande.find((x) => x.id === id)
  if (!d || d.tipo === 'testo') return ''
  const v = r[id]
  const trovata = d.eco?.find((e) => (Array.isArray(v) ? v.includes(e.se) : v === e.se))
  return trovata?.frase ?? ''
}

/** L'uscita gentile che una risposta apre, o null: l'edilizia ha la sua consulenza, gli altri ricevono le guide. */
export function uscitaDopo(porta: Porta, id: string, r: Risposte): Uscita | null {
  const d = PORTE[porta].domande.find((x) => x.id === id)
  if (!d || d.tipo !== 'scelta' || !d.uscita) return null
  return r[id] === d.uscita.se ? d.uscita.dove : null
}

export type Prenotazione = {
  porta: Porta
  /** Solo le domande della strada, con le risposte ammesse. */
  risposte: Risposte
  /** La prenotazione nell'API di Calendly: il calendario manda questi due indirizzi alla pagina quando si prenota. */
  evento: string
  invitato: string
  /** Da dove arriva chi prenota (chi l'ha mandato qui e i parametri dell'indirizzo), per l'avviso. */
  origine: string
}

const MANCANO = { ok: false as const, errore: 'Rispondi a tutte le domande.' }
const EVENTO_CALENDLY = /^https:\/\/api\.calendly\.com\/scheduled_events\/[\w-]+$/

/**
 * Il controllo della prenotazione sul server. Le risposte si rileggono domanda per domanda nell'ordine della strada:
 * quelle delle domande che la strada non fa, o che le risposte rendono inutili, si buttano; nelle scelte multiple restano
 * le opzioni vere, senza doppioni, fino al massimo; le frasi libere si possono saltare. L'edilizia non arriva mai qui:
 * esce prima, verso la sua consulenza. La prenotazione dev'essere un evento di Calendly, e chi prenota uno dei suoi
 * invitati: nome e mail stanno lì, non passano da qui.
 */
export function validaPrenotazione(body: unknown): { ok: true; p: Prenotazione } | { ok: false; errore: string } {
  const b = body && typeof body === 'object' ? (body as Record<string, unknown>) : {}
  const porta = b.porta
  if (!isPorta(porta)) return { ok: false, errore: 'Scegli da dove parti.' }
  const grezze = b.risposte && typeof b.risposte === 'object' && !Array.isArray(b.risposte) ? (b.risposte as Record<string, unknown>) : {}

  const risposte: Risposte = {}
  for (const d of PORTE[porta].domande) {
    if (!visibile(d, risposte)) continue
    const v = grezze[d.id]
    if (d.tipo === 'scelta') {
      if (typeof v !== 'string' || !d.opzioni.includes(v)) return MANCANO
      risposte[d.id] = v
    } else if (d.tipo === 'multipla') {
      const ammesse = Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && d.opzioni.includes(x)) : []
      const scelte = [...new Set(ammesse)].slice(0, d.max ?? d.opzioni.length)
      if (!scelte.length) return MANCANO
      risposte[d.id] = scelte
    } else {
      const testo = pulito(v, d.max)
      if (testo) risposte[d.id] = testo
    }
  }
  if (Object.keys(risposte).some((id) => uscitaDopo(porta, id, risposte) === 'edilizia')) {
    return { ok: false, errore: "Per l'edilizia c'è una consulenza dedicata." }
  }

  const evento = pulito(b.evento, 300)
  const invitato = pulito(b.invitato, 300)
  const dopo = `${evento}/invitees/`
  if (!EVENTO_CALENDLY.test(evento) || !invitato.startsWith(dopo) || !/^[\w-]+$/.test(invitato.slice(dopo.length))) {
    return { ok: false, errore: 'Manca la prenotazione.' }
  }

  return { ok: true, p: { porta, risposte, evento, invitato, origine: pulito(b.origine, 500) } }
}

const testoConto = (c: { ore: number; euro: number | null }) => {
  const ore = `circa ${numero(c.ore)} ore l'anno`
  return c.euro ? `${ore}, circa ${numero(c.euro)} €` : ore
}

/**
 * Le righe del riepilogo (etichetta, risposta), nell'ordine delle domande. Il conto, dopo il valore dell'ora, c'è solo
 * nell'avviso a Raffaele: il testo per Calendly lo vede anche chi prenota, e lì non va.
 */
export function righeRiepilogo(porta: Porta, r: Risposte, conConto = true): [string, string][] {
  const righe: [string, string][] = [['Da dove parte', PORTE[porta].chiE]]
  const c = conConto ? conto(porta, r) : null
  for (const d of domandeVisibili(porta, r)) {
    const v = r[d.id]
    if (v === undefined || v === '' || (Array.isArray(v) && !v.length)) continue
    righe.push([d.breve, d.tipo === 'testo' ? `«${pulito(v, d.max)}»` : Array.isArray(v) ? v.join(', ') : v])
    if (d.id === 'valoreOra' && c) righe.push(['Il conto', testoConto(c)])
  }
  return righe
}

/** Le risposte che arrivano già scritte nella prima domanda dell'evento di Calendly (a1): una riga per risposta. */
export function testoCalendly(porta: Porta, r: Risposte): string {
  const testo = righeRiepilogo(porta, r, false)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
  return testo.length > 1000 ? `${testo.slice(0, 999)}…` : testo
}

/**
 * L'indirizzo del calendario da mettere nella pagina, o «» se l'evento di Calendly non c'è ancora. `embed_domain` ed
 * `embed_type` fanno parlare il calendario con la pagina (così la pagina sa quando la prenotazione è fatta); i dettagli
 * dell'evento si nascondono perché la pagina li ha appena detti; le risposte vanno nella prima domanda dell'evento.
 */
export function linkCalendly(base: string, porta: Porta, r: Risposte, dominio: string): string {
  if (!base) return ''
  const u = new URL(base)
  u.searchParams.set('embed_domain', dominio)
  u.searchParams.set('embed_type', 'Inline')
  u.searchParams.set('hide_event_type_details', '1')
  u.searchParams.set('a1', testoCalendly(porta, r))
  return u.toString()
}
