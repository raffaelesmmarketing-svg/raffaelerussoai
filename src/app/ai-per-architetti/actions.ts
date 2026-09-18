'use server'

import { esempi, PAGINA, PRIMA_COSA_ALTRO } from '@/components/landing/architetti/dati'

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
const PRIME_COSE = new Set([...esempi.map((e) => e.cosa), PRIMA_COSA_ALTRO])

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
  const primaCosa = testo(formData, 'prima_cosa')
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
  if (primaCosa && !PRIME_COSE.has(primaCosa)) campi.prima_cosa = 'Scegli una voce dall’elenco.'
  if (Object.keys(campi).length) {
    return { stato: 'errore', messaggio: 'Manca qualcosa: controlla i campi segnati.', campi }
  }

  const riga = {
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

  await avvisaTelegram(riga)
  return { stato: 'ok', nome }
}

// Avviso sul telefono di Raffaele. Se le variabili non ci sono (in locale) la richiesta è comunque
// salvata: l'avviso è un di più, non il canale.
async function avvisaTelegram(r: {
  nome: string
  email: string
  telefono: string | null
  situazione: string
  ore_settimana: string
  prima_cosa: string | null
  origine: string | null
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chat = process.env.TELEGRAM_CHAT_ID
  if (!token || !chat) return
  const sit = r.situazione === 'studio' ? 'studio con collaboratori' : 'da solo'
  const righe = [
    `<b>Nuova richiesta — AI per architetti</b>`,
    `${escape(r.nome)} · ${sit} · ${r.ore_settimana} ore/settimana rifatte`,
    r.prima_cosa ? `Per primo: ${escape(r.prima_cosa)}` : null,
    `${escape(r.email)}${r.telefono ? ' · ' + escape(r.telefono) : ''}`,
    r.origine ? `Da: ${escape(r.origine)}` : null,
  ].filter(Boolean)
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chat, text: righe.join('\n'), parse_mode: 'HTML' }),
  }).catch((e) => console.error('[ai-per-architetti] telegram', e))
}

function escape(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
