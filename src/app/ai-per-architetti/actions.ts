'use server'

import { randomUUID } from 'node:crypto'
import { PAGINA } from '@/components/landing/architetti/dati'
import { avvisaRichiesta } from '@/lib/avvisi'

// Il sito non ha un backend con segreti: la richiesta viene scritta nel database con la chiave
// pubblica, che per questa tabella può SOLO inserire (RLS: nessuna lettura per anon).
const SUPABASE_URL = 'https://wvfazhoklpmcifimvooo.supabase.co'
const SUPABASE_KEY_PUBBLICA = 'sb_publishable_9Yc0GLvZrQzOV7Ss82kyEQ_jNzTGIpW'

export type Esito =
  | { stato: 'inizio' }
  | { stato: 'ok'; nome: string }
  | { stato: 'errore'; messaggio: string; campi: Record<string, string> }

const SITUAZIONI = new Set(['solo', 'studio'])
const ORE = new Set(['0-2', '2-5', '5-10', '10+'])

function testo(formData: FormData, nome: string, max = 200): string {
  const v = formData.get(nome)
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

export async function inviaRichiesta(_prev: Esito, formData: FormData): Promise<Esito> {
  const nome = testo(formData, 'nome', 120)
  const email = testo(formData, 'email').toLowerCase()
  const telefono = testo(formData, 'telefono', 40)
  const situazione = testo(formData, 'situazione', 20)
  const ore = testo(formData, 'ore_settimana', 10)
  const primaCosa = testo(formData, 'prima_cosa', 600)
  const origine = testo(formData, 'origine', 500)

  // Due trappole per i bot, entrambe silenziose: un campo che un umano non vede, e un modulo
  // compilato in meno di tre secondi. Al bot si risponde «ok» e non si scrive niente.
  const trappola = testo(formData, 'sito_web', 10)
  const reso = Number(testo(formData, 't', 20))
  if (trappola || !Number.isFinite(reso) || Date.now() - reso < 3000) {
    return { stato: 'ok', nome: nome || '' }
  }

  const campi: Record<string, string> = {}
  if (nome.length < 2) campi.nome = 'Scrivi il tuo nome.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) campi.email = 'Controlla l’indirizzo email.'
  if (!SITUAZIONI.has(situazione)) campi.situazione = 'Scegli una delle due.'
  if (!ORE.has(ore)) campi.ore_settimana = 'Scegli una fascia.'
  if (Object.keys(campi).length) {
    return { stato: 'errore', messaggio: 'Manca qualcosa: controlla i campi segnati.', campi }
  }

  // L'id lo generiamo qui: la chiave pubblica può inserire ma non rileggere, e l'id serve dopo
  // per l'avviso (e al giro dei dieci minuti, se l'avviso non parte).
  const id = randomUUID()
  const riga = {
    id,
    pagina: PAGINA,
    nome,
    email,
    telefono: telefono || null,
    situazione,
    ore_settimana: ore,
    prima_cosa: primaCosa || null,
    origine: origine || null,
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/richiesta`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY_PUBBLICA,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(riga),
    cache: 'no-store',
  }).catch(() => null)

  if (!res || !res.ok) {
    console.error('[ai-per-architetti] inserimento fallito', res?.status, await res?.text().catch(() => ''))
    return {
      stato: 'errore',
      messaggio: 'Non sono riuscito a registrare la richiesta. Riprova fra un minuto, oppure scrivimi a raffaele.smmarketing@gmail.com.',
      campi: {},
    }
  }

  // L'avviso è un di più: se cade, la riga è salvata e il database ci riprova ogni dieci minuti.
  await avvisaRichiesta(id).catch((e) => console.error('[ai-per-architetti] avviso', e))
  return { stato: 'ok', nome }
}
