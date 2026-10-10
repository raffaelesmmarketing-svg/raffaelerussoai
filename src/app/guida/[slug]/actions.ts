'use server'

import { guidaPerSlug } from '@/lib/guide'
import { avvisaGuida } from '@/lib/avvisi'

// La mail che sblocca una guida. Si scrive nel database con la chiave pubblica, che su questa
// tabella può SOLO inserire (RLS: nessuna lettura per anon); solo dopo si dà l'indirizzo del PDF.
const SUPABASE_URL = 'https://wvfazhoklpmcifimvooo.supabase.co'
const SUPABASE_KEY_PUBBLICA = 'sb_publishable_9Yc0GLvZrQzOV7Ss82kyEQ_jNzTGIpW'

// slug → PDF delle guide che si sbloccano con la mail. Il nome lo stampa scripts/stampa-guide.mjs e non
// compare in nessuna pagina: lo riceve solo chi ha lasciato la mail.
const PDF_CON_MAIL: Record<string, string> = {
  'agenti-che-scrivono-il-blog': '/guide/agenti-che-scrivono-il-blog-249536f41207.pdf',
}

export type EsitoGuida =
  | { stato: 'inizio' }
  | { stato: 'ok'; pdf: string }
  // ⛔ `email` torna indietro con l'errore: dopo un'azione React rimette il modulo com'era all'inizio.
  | { stato: 'errore'; messaggio: string; email: string }

function testo(formData: FormData, nome: string, max = 200): string {
  const v = formData.get(nome)
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

export async function sbloccaGuida(_prev: EsitoGuida, formData: FormData): Promise<EsitoGuida> {
  const slug = testo(formData, 'guida', 120)
  const guida = guidaPerSlug(slug)
  const pdf = PDF_CON_MAIL[slug]
  if (!guida || !pdf) {
    return { stato: 'errore', messaggio: 'Questa guida non c’è più: le trovi tutte nella pagina delle guide.', email: '' }
  }

  const email = testo(formData, 'email').toLowerCase()
  const origine = testo(formData, 'origine', 500)

  // Le stesse due trappole del modulo della chiamata: un campo che un umano non vede, e un invio
  // in meno di tre secondi. Al bot si dà la guida e non si scrive niente.
  const trappola = testo(formData, 'sito_web', 10)
  const reso = Number(testo(formData, 't', 20))
  if (trappola || !Number.isFinite(reso) || Date.now() - reso < 3000) return { stato: 'ok', pdf }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { stato: 'errore', messaggio: 'Controlla l’indirizzo email.', email }
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/contatto_guida`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY_PUBBLICA,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ guida: slug, email, origine: origine || null }),
    cache: 'no-store',
  }).catch(() => null)
  const salvata = Boolean(res?.ok)
  if (!salvata) console.error('[guida] mail non salvata', res?.status, await res?.text().catch(() => ''))

  // La mail l'ha lasciata: la guida è sua anche se il database non risponde. In quel caso la mail
  // arriva comunque a Raffaele su Telegram, con l'avviso di copiarla.
  await avvisaGuida({ titolo: guida.titolo, email, origine, salvata }).catch((e) => console.error('[guida] avviso', e))
  return { stato: 'ok', pdf }
}
