// Testi e liste della landing /ai-per-architetti. Un solo posto: la pagina, il JSON-LD e il
// modulo leggono da qui, così un esempio aggiunto compare anche fra le scelte del modulo.

export const PAGINA = 'ai-per-architetti'

// Le pagine da cui può partire una richiesta. ⛔ Stesso elenco nel vincolo `richiesta_pagina_check` del
// database: una pagina nuova va aggiunta PRIMA là, o l'inserimento viene rifiutato.
export const PAGINE_RICHIESTA = ['ai-per-architetti', 'chiamata-gratuita'] as const
export type PaginaRichiesta = (typeof PAGINE_RICHIESTA)[number]

export const ANCORA_MODULO = '#prenota'

export const esempi: { cosa: string; esito: string }[] = [
  { cosa: 'Render in automatico', esito: 'dalla piantina o dal modello, con le varianti di luce e materiali.' },
  { cosa: 'Preventivi in automatico per i tuoi clienti', esito: 'dai dati del progetto e dai tuoi listini, pronti da rivedere e firmare.' },
  { cosa: 'Computi metrici in automatico', esito: 'voci e quantità dalle tavole, senza ribattere tutto a mano.' },
  { cosa: 'Relazioni tecniche in automatico', esito: 'dal tuo modello e dai dati del progetto: la bozza in minuti, la firma tua.' },
  { cosa: 'Rispondere ai clienti in autonomia', esito: 'e aggiornarli sullo stato delle commesse, senza che tu scriva ogni mail.' },
]

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
    a: 'Ti scrivo io entro 30 minuti e fissiamo la chiamata di 20 minuti. Intanto trovi dieci domande che ti aiutano a preparare il tuo progetto.',
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

// Le dieci domande della pagina di ringraziamento: servono a chi le compila per vedere dove rifà
// le stesse cose, e a Raffaele per arrivare in chiamata sapendo di cosa parlare.
export type Domanda =
  | { id: string; testo: string; tipo: 'scelta'; opzioni: string[]; multipla?: boolean }
  | { id: string; testo: string; tipo: 'testo'; suggerimento?: string }

export const domande: Domanda[] = [
  { id: 'lavoro', testo: 'Di cosa ti occupi, e che tipo di lavori segui più spesso?', tipo: 'testo', suggerimento: 'Es. architetto: ristrutturazioni private e pratiche edilizie' },
  { id: 'volume', testo: 'Quanti progetti, pratiche o clienti hai in mano in un mese normale?', tipo: 'testo', suggerimento: 'Es. cinque o sei progetti, una decina di clienti' },
  { id: 'ripetuta', testo: 'Qual è la cosa che rifai più spesso quasi uguale?', tipo: 'testo', suggerimento: 'Es. la relazione tecnica, il preventivo, le mail di aggiornamento' },
  { id: 'tempo', testo: 'Quanto tempo ti porta via, ogni volta?', tipo: 'testo', suggerimento: 'Es. un paio d’ore, mezza giornata' },
  { id: 'documenti', testo: 'Quali documenti o messaggi scrivi da zero invece di partire da un modello?', tipo: 'testo' },
  { id: 'clienti', testo: 'Come tieni aggiornati i clienti su quello che stai facendo per loro?', tipo: 'testo', suggerimento: 'Es. WhatsApp e telefono, di solito quando chiamano loro' },
  { id: 'strumenti', testo: 'Che strumenti usi oggi per lavorare? (programmi, gestionali, app)', tipo: 'testo' },
  { id: 'provato', testo: 'Hai già provato qualcosa con l’intelligenza artificiale? Cos’è andato bene, cosa no?', tipo: 'testo' },
  { id: 'sparire', testo: 'Se domani un’attività sparisse dalla tua settimana, quale sceglieresti?', tipo: 'testo' },
  { id: 'freno', testo: 'Cosa ti frena di più, oggi, dal cambiare come lavori?', tipo: 'testo', suggerimento: 'Es. il tempo, il costo, la privacy dei dati, non sapere da dove iniziare' },
]
