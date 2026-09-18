// Testi e liste della landing /ai-per-architetti. Un solo posto: la pagina, il JSON-LD e il
// modulo leggono da qui, così un esempio aggiunto compare anche fra le scelte del modulo.

export const PAGINA = 'ai-per-architetti'

export const ANCORA_MODULO = '#prenota'

export const esempi: { cosa: string; esito: string }[] = [
  { cosa: 'Render in automatico', esito: 'dalla piantina o dal modello, con le varianti di luce e materiali.' },
  { cosa: 'Preventivi in automatico per i tuoi clienti', esito: 'dai dati del progetto e dai tuoi listini, pronti da rivedere e firmare.' },
  { cosa: 'Computi metrici in automatico', esito: 'voci e quantità dalle tavole, senza ribattere tutto a mano.' },
  { cosa: 'Relazioni tecniche in automatico', esito: 'dal tuo modello e dai dati del progetto: la bozza in minuti, la firma tua.' },
  { cosa: 'Rispondere ai clienti in autonomia', esito: 'e aggiornarli sullo stato delle commesse, senza che tu scriva ogni mail.' },
]

// Nel modulo, oltre ai cinque, si può scegliere «altro»: la lista di sopra non è tutto.
export const PRIMA_COSA_ALTRO = 'Altro — ne parliamo in chiamata'

export const faq: { q: string; a: string }[] = [
  {
    q: 'Non so niente di intelligenza artificiale. Ha senso che ti chiami?',
    a: 'È il motivo per cui esiste questa pagina. Non serve sapere come funziona: serve sapere cosa rifai ogni settimana. Da lì partiamo.',
  },
  {
    q: 'Quanto costa?',
    a: 'Dipende da cosa montiamo: due cose o tre, da solo o con lo studio. Te lo dico in chiamata, senza giri di parole, prima che tu decida qualsiasi cosa.',
  },
  {
    q: 'È permesso? E cosa dico ai miei clienti?',
    a: 'Sì: l’intelligenza artificiale nel lavoro del professionista è ammessa come strumento di supporto, e la responsabilità di quello che firmi resta tua, come oggi. Ai clienti va detto, e ne parliamo in chiamata: la frase pronta ce l’ho.',
  },
  {
    q: 'Cosa succede dopo che compilo il modulo?',
    a: 'Ti scrivo io entro 24 ore e fissiamo i 20 minuti. Nient’altro: niente sequenze automatiche, niente telefonate a sorpresa.',
  },
]

export const opzioniSituazione = [
  { valore: 'solo', etichetta: 'Lavoro da solo' },
  { valore: 'studio', etichetta: 'Ho uno studio con collaboratori' },
] as const

export const opzioniOre = [
  { valore: '0-2', etichetta: '0–2' },
  { valore: '2-5', etichetta: '2–5' },
  { valore: '5-10', etichetta: '5–10' },
  { valore: '10+', etichetta: 'più di 10' },
] as const
