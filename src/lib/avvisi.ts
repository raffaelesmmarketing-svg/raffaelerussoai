import 'server-only'

// Avviso a Raffaele per una richiesta. Lo chiamano in due: l'azione del modulo (subito dopo il
// salvataggio) e la porta /api/avvisa (ogni dieci minuti, dal database, per le richieste rimaste
// scoperte). La riga si legge e si segna per id: un uuid che conosce solo chi ha inserito la riga.
const SUPABASE_URL = 'https://wvfazhoklpmcifimvooo.supabase.co'
const SUPABASE_KEY_PUBBLICA = 'sb_publishable_9Yc0GLvZrQzOV7Ss82kyEQ_jNzTGIpW'

type Riga = {
  id: string
  creato_il: string
  pagina: string | null
  nome: string
  email: string
  telefono: string | null
  situazione: string | null
  ore_settimana: string | null
  prima_cosa: string | null
  origine: string | null
  notificata_il: string | null
  avviso_telegram_il: string | null
  avviso_email_il: string | null
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

function righeAvviso(r: Riga) {
  const sit = r.situazione === 'studio' ? (r.pagina === 'chiamata-gratuita' ? 'con collaboratori' : 'studio con collaboratori') : r.situazione === 'solo' ? 'da solo' : '—'
  const quando = new Date(r.creato_il).toLocaleString('it-IT', { timeZone: 'Europe/Rome', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  return {
    titolo: `Nuova richiesta — ${r.pagina === 'chiamata-gratuita' ? 'chiamata gratuita (dalle guide)' : 'AI per architetti'} (${quando})`,
    righe: [
      `${r.nome} · ${sit} · ${r.ore_settimana ?? '—'} ore/settimana rifatte`,
      r.prima_cosa ? `Per primo: ${r.prima_cosa}` : null,
      `${r.email}${r.telefono ? ' · ' + r.telefono : ''}`,
      r.origine ? `Da: ${r.origine}` : null,
      r.tentativi_avviso > 0 ? `(avviso ripetuto, tentativo ${r.tentativi_avviso + 1})` : null,
    ].filter((x): x is string => Boolean(x)),
  }
}

// Ogni canale prova tre volte: un'attesa breve fra un tentativo e l'altro basta per i singhiozzi
// di rete; se cadono tutti, la riga resta scoperta e il giro dei dieci minuti ci riprova.
async function conTentativi(nome: string, invio: () => Promise<Response | null>): Promise<boolean> {
  for (const attesa of [0, 600, 1800]) {
    if (attesa) await new Promise((r) => setTimeout(r, attesa))
    const res = await invio().catch(() => null)
    if (res?.ok) return true
    console.error(`[avvisi] ${nome} fallito`, res?.status, await res?.text().catch(() => ''))
  }
  return false
}

async function telegram(a: { titolo: string; righe: string[] }): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chat = process.env.TELEGRAM_CHAT_ID
  if (!token || !chat) return false
  const testo = [`<b>${escape(a.titolo)}</b>`, ...a.righe.map(escape)].join('\n')
  return conTentativi('telegram', () =>
    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text: testo, parse_mode: 'HTML' }),
    })
  )
}

// Secondo canale: email via Resend, al solo indirizzo di Raffaele (piano gratuito, mittente di
// Resend finché il dominio non è verificato).
async function email(a: { titolo: string; righe: string[] }, r: { nome: string; email: string }): Promise<boolean> {
  const chiave = process.env.RESEND_API_KEY
  const a_chi = process.env.AVVISI_EMAIL
  if (!chiave || !a_chi) return false
  return conTentativi('email', () =>
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${chiave}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Finché il dominio non è verificato su Resend si spedisce dal loro mittente di prova;
        // poi basta AVVISI_MITTENTE=Raffaele Russo <avvisi@raffaelerussoai.com> su Vercel.
        from: process.env.AVVISI_MITTENTE || 'Sito raffaelerussoai <onboarding@resend.dev>',
        to: [a_chi],
        reply_to: r.email,
        subject: `${a.titolo} — ${r.nome}`,
        text: [a.titolo, '', ...a.righe, '', 'Rispondi a questa email per scrivere direttamente alla persona.'].join('\n'),
      }),
    })
  )
}

// Torna: 'avvisata' | 'parziale' | 'gia_avvisata' | 'non_trovata' | 'fallita'.
// I due canali partono insieme, ognuno solo se non ha già consegnato; la richiesta è «avvisata»
// quando hanno consegnato tutti e due. Se ne manca uno, il giro dei dieci minuti ritenta solo quello.
export async function avvisaRichiesta(id: string) {
  const righe = await rpc<Riga[]>('richiesta_per_id', { p_id: id })
  const r = righe?.[0]
  if (!r) return 'non_trovata' as const
  if (r.notificata_il) return 'gia_avvisata' as const
  const a = righeAvviso(r)
  const [tg, mail] = await Promise.all([
    r.avviso_telegram_il ? Promise.resolve(true) : telegram(a),
    r.avviso_email_il ? Promise.resolve(true) : email(a, r),
  ])
  await rpc('segna_avvisata', { p_id: id, p_telegram: tg, p_email: mail })
  if (tg && mail) return 'avvisata' as const
  if (tg || mail) return 'parziale' as const
  return 'fallita' as const
}

type RigaQuestionario = {
  id: string
  creato_il: string
  richiesta_id: string | null
  risposte: Record<string, string | string[]>
  avviso_telegram_il: string | null
  avviso_email_il: string | null
  notificata_il: string | null
  tentativi_avviso: number
  nome: string | null
  email: string | null
}

// Avviso per un questionario compilato: stessa rete delle richieste (spunta per canale, ritento
// solo il canale scoperto). Le domande arrivano da chi chiama, per non importare la pagina qui.
export async function avvisaQuestionario(id: string, domande: { id: string; testo: string }[]) {
  const righe = await rpc<RigaQuestionario[]>('questionario_per_id', { p_id: id })
  const q = righe?.[0]
  if (!q) return 'non_trovata' as const
  if (q.notificata_il) return 'gia_avvisata' as const
  const nome = q.nome ?? 'sconosciuto'
  const quando = new Date(q.creato_il).toLocaleString('it-IT', { timeZone: 'Europe/Rome', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  const a = {
    titolo: `Questionario compilato — ${nome} (${quando})`,
    righe: [
      ...domande
        .filter((d) => q.risposte[d.id])
        .map((d) => `• ${d.testo}\n  ${Array.isArray(q.risposte[d.id]) ? (q.risposte[d.id] as string[]).join(', ') : q.risposte[d.id]}`),
      q.tentativi_avviso > 0 ? `(avviso ripetuto, tentativo ${q.tentativi_avviso + 1})` : '',
    ].filter(Boolean),
  }
  const [tg, mail] = await Promise.all([
    q.avviso_telegram_il ? Promise.resolve(true) : telegram(a),
    q.avviso_email_il ? Promise.resolve(true) : email(a, { nome, email: q.email ?? '' }),
  ])
  await rpc('segna_questionario_avvisato', { p_id: id, p_telegram: tg, p_email: mail })
  if (tg && mail) return 'avvisata' as const
  if (tg || mail) return 'parziale' as const
  return 'fallita' as const
}
