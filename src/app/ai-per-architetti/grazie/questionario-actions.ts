'use server'

import { domande } from '@/components/landing/architetti/dati'
import { spedisci } from '@/lib/avvisi'

const SUPABASE_URL = 'https://wvfazhoklpmcifimvooo.supabase.co'
const SUPABASE_KEY_PUBBLICA = 'sb_publishable_9Yc0GLvZrQzOV7Ss82kyEQ_jNzTGIpW'
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export type EsitoQuestionario = { stato: 'inizio' } | { stato: 'ok' } | { stato: 'errore'; messaggio: string }

export async function inviaQuestionario(_prev: EsitoQuestionario, formData: FormData): Promise<EsitoQuestionario> {
  const richiestaId = String(formData.get('r') ?? '')
  if (!UUID.test(richiestaId)) {
    return { stato: 'errore', messaggio: 'Questa pagina è legata a una richiesta: compila prima il modulo.' }
  }

  // Le risposte: per ogni domanda, o una stringa o un elenco di scelte. Vuote non si salvano.
  const risposte: Record<string, string | string[]> = {}
  for (const d of domande) {
    if (d.tipo === 'scelta') {
      const scelte = formData
        .getAll(d.id)
        .filter((v): v is string => typeof v === 'string' && d.opzioni.includes(v))
      if (scelte.length) risposte[d.id] = d.multipla ? scelte : scelte[0]
    } else {
      const v = formData.get(d.id)
      if (typeof v === 'string' && v.trim()) risposte[d.id] = v.trim().slice(0, 800)
    }
  }
  if (!Object.keys(risposte).length) {
    return { stato: 'errore', messaggio: 'Rispondi almeno a una domanda, anche in due parole.' }
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/questionario`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY_PUBBLICA, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ richiesta_id: richiestaId, risposte }),
    cache: 'no-store',
  }).catch(() => null)
  if (!res || !res.ok) {
    console.error('[questionario] inserimento fallito', res?.status, await res?.text().catch(() => ''))
    return { stato: 'errore', messaggio: 'Non sono riuscito a salvare le risposte. Riprova fra un minuto.' }
  }

  // A Raffaele: le risposte, domanda per domanda, con il nome di chi le ha scritte.
  const chi = await fetch(`${SUPABASE_URL}/rest/v1/rpc/richiesta_per_id`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY_PUBBLICA, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_id: richiestaId }),
    cache: 'no-store',
  })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null)
  const r = Array.isArray(chi) ? chi[0] : null
  const nome = r?.nome ?? 'sconosciuto'
  const righe = domande
    .filter((d) => risposte[d.id])
    .map((d) => `• ${d.testo}\n  ${Array.isArray(risposte[d.id]) ? (risposte[d.id] as string[]).join(', ') : risposte[d.id]}`)
  await spedisci({ titolo: `Questionario compilato — ${nome}`, righe }, { nome, email: r?.email ?? '' }).catch((e) =>
    console.error('[questionario] avviso', e)
  )
  return { stato: 'ok' }
}
