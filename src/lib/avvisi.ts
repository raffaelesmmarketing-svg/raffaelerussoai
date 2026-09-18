import 'server-only'

// Avviso a Raffaele per una richiesta. Lo chiamano in due: l'azione del modulo (subito dopo il
// salvataggio) e la porta /api/avvisa (ogni dieci minuti, dal database, per le richieste rimaste
// scoperte). La riga si legge e si segna per id: un uuid che conosce solo chi ha inserito la riga.
const SUPABASE_URL = 'https://wvfazhoklpmcifimvooo.supabase.co'
const SUPABASE_KEY_PUBBLICA = 'sb_publishable_9Yc0GLvZrQzOV7Ss82kyEQ_jNzTGIpW'

type Riga = {
  id: string
  creato_il: string
  nome: string
  email: string
  telefono: string | null
  situazione: string | null
  ore_settimana: string | null
  prima_cosa: string | null
  origine: string | null
  notificata_il: string | null
  tentativi_avviso: number
}

async function rpc<T>(nome: string, corpo: Record<string, unknown>): Promise<T | null> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${nome}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY_PUBBLICA, 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
    cache: 'no-store',
  }).catch(() => null)
  if (!res || !res.ok) return null
  const testo = await res.text()
  return testo ? (JSON.parse(testo) as T) : (null as T)
}

function escape(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function testoAvviso(r: Riga) {
  const sit = r.situazione === 'studio' ? 'studio con collaboratori' : r.situazione === 'solo' ? 'da solo' : '—'
  const quando = new Date(r.creato_il).toLocaleString('it-IT', { timeZone: 'Europe/Rome', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  return [
    `<b>Nuova richiesta — AI per architetti</b> (${quando})`,
    `${escape(r.nome)} · ${sit} · ${r.ore_settimana ?? '—'} ore/settimana rifatte`,
    r.prima_cosa ? `Per primo: ${escape(r.prima_cosa)}` : null,
    `${escape(r.email)}${r.telefono ? ' · ' + escape(r.telefono) : ''}`,
    r.origine ? `Da: ${escape(r.origine)}` : null,
    r.tentativi_avviso > 0 ? `(avviso ripetuto, tentativo ${r.tentativi_avviso + 1})` : null,
  ]
    .filter(Boolean)
    .join('\n')
}

async function telegram(testo: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chat = process.env.TELEGRAM_CHAT_ID
  if (!token || !chat) return false
  // Tre tentativi: un'attesa breve fra uno e l'altro basta per i singhiozzi di rete; se cadono
  // tutti e tre, la riga resta scoperta e il giro dei dieci minuti ci riprova.
  for (const attesa of [0, 600, 1800]) {
    if (attesa) await new Promise((r) => setTimeout(r, attesa))
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text: testo, parse_mode: 'HTML' }),
    }).catch(() => null)
    if (res?.ok) return true
    console.error('[avvisi] telegram fallito', res?.status, await res?.text().catch(() => ''))
  }
  return false
}

// Torna: 'avvisata' | 'gia_avvisata' | 'non_trovata' | 'fallita'
export async function avvisaRichiesta(id: string) {
  const righe = await rpc<Riga[]>('richiesta_per_id', { p_id: id })
  const r = righe?.[0]
  if (!r) return 'non_trovata' as const
  if (r.notificata_il) return 'gia_avvisata' as const
  const ok = await telegram(testoAvviso(r))
  await rpc('segna_avvisata', { p_id: id, p_ok: ok })
  return ok ? ('avvisata' as const) : ('fallita' as const)
}
