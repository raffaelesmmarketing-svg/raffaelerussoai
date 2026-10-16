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
  'il-primo-agente-con-claude': '/guide/il-primo-agente-con-claude-d5bd04c0adf5.pdf',
  'montaggio-video-con-claude': '/guide/montaggio-video-con-claude-401b6fe11a7b.pdf',
  'claude-su-whatsapp-senza-rischiare-il-numero': '/guide/claude-su-whatsapp-senza-rischiare-il-numero-ccc4b37c423f.pdf',
  'il-cervello-della-squadra-con-claude': '/guide/il-cervello-della-squadra-con-claude-3bd02955db1a.pdf',
  'claude-su-instagram-senza-rischiare-l-account': '/guide/claude-su-instagram-senza-rischiare-l-account-a51397e173b4.pdf',
  'mirofish-il-pubblico-finto': '/guide/mirofish-il-pubblico-finto-4aab8cfc46b1.pdf',
  'agenti-sull-abbonamento-di-claude': '/guide/agenti-sull-abbonamento-di-claude-d2042c4b3a6a.pdf',
  'il-mio-manychat-con-claude-code': '/guide/il-mio-manychat-con-claude-code-7d7effa2da08.pdf',
  'humanizer-testi-umani': '/guide/humanizer-testi-umani-4f260eba4507.pdf',
  'second-brain-con-claude': '/guide/second-brain-con-claude-6e2539306af2.pdf',
  'granola-e-claude-code': '/guide/granola-e-claude-code-3d07829fab6a.pdf',
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
