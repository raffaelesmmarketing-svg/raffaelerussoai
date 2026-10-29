'use server'

import { guidaPerSlug } from '@/lib/guide'
import { avvisaGuida } from '@/lib/avvisi'
import { mandaGuida } from '@/lib/mail-guida'

// La mail che sblocca una guida. Si scrive nel database con la chiave pubblica, che su questa
// tabella può SOLO inserire (RLS: nessuna lettura per anon). Dal 18/10 la guida si manda PER MAIL
// (Raffaele: chi la vuole apre la mail, e il dominio si scalda): il PDF dal sito resta solo se la mail non parte.
const SUPABASE_URL = 'https://wvfazhoklpmcifimvooo.supabase.co'
const SUPABASE_KEY_PUBBLICA = 'sb_publishable_9Yc0GLvZrQzOV7Ss82kyEQ_jNzTGIpW'

// slug → PDF delle guide che si sbloccano con la mail. Il nome lo stampa scripts/stampa-guide.mjs e non
// compare in nessuna pagina: lo riceve solo chi ha lasciato la mail.
const PDF_CON_MAIL: Record<string, string> = {
  'agenti-che-scrivono-il-blog': '/guide/agenti-che-scrivono-il-blog-249536f41207.pdf',
  'il-primo-agente-con-claude': '/guide/il-primo-agente-con-claude-d5bd04c0adf5.pdf',
  'le-4-skill-di-claude-per-un-azienda': '/guide/le-4-skill-di-claude-per-un-azienda-21af976f8702.pdf',
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
  'le-13-skill-social-media-manager': '/guide/le-13-skill-social-media-manager-b6f2996d18e0.pdf',
  'consiglio-dei-grandi-del-marketing': '/guide/consiglio-dei-grandi-del-marketing-274c85179f70.pdf',
  'offerta-rifatta-con-claude': '/guide/offerta-rifatta-con-claude-b0544dba7951.pdf',
  'la-pagina-del-sito-che-vende': '/guide/la-pagina-del-sito-che-vende-a4ebfabfa09f.pdf',
  'le-parole-dei-tuoi-clienti': '/guide/le-parole-dei-tuoi-clienti-3f24272c1564.pdf',
  'la-lista-dei-prossimi-clienti': '/guide/la-lista-dei-prossimi-clienti-0d1ca6f1f12a.pdf',
  'farsi-citare-da-chatgpt': '/guide/farsi-citare-da-chatgpt-e0637298d560.pdf',
  'le-8-skill-di-hormozi': '/guide/le-8-skill-di-hormozi-7335647fa38a.pdf',
  'claude-motion-per-la-tua-azienda': '/guide/claude-motion-per-la-tua-azienda-e8648c72e0f0.pdf',
  'le-9-skill-legali-di-claude': '/guide/le-9-skill-legali-di-claude-ad00531bdfbb.pdf',
  'le-36-skill-per-vendere': '/guide/le-36-skill-per-vendere-09805c46c65d.pdf',
  'il-punto-del-lunedi': '/guide/il-punto-del-lunedi-cc7cded4eb88.pdf',
  'il-consulente-per-i-bandi': '/guide/il-consulente-per-i-bandi-7d41c9b2e85a.pdf',
  'le-8-skill-per-chiudere-il-mese': '/guide/le-8-skill-per-chiudere-il-mese-3f0a6e1d94bc.pdf',
  'il-tuo-analista-dei-dati': '/guide/il-tuo-analista-dei-dati-bd0b52f70302.pdf',
  'il-tuo-responsabile-del-personale': '/guide/il-tuo-responsabile-del-personale-5fbf85fe78cf.pdf',
  'l-assistenza-clienti-con-claude': '/guide/l-assistenza-clienti-con-claude-c0a7414f2e0c.pdf',
  'le-procedure-con-claude': '/guide/le-procedure-con-claude-2f82ebb687f8.pdf',
}

export type EsitoGuida =
  | { stato: 'inizio' }
  | { stato: 'ok'; pdf: string }
  // La guida è partita per mail: la pagina dice dove guardare, il PDF non si mostra.
  | { stato: 'mandata'; email: string }
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
  // in meno di tre secondi. Al bot si risponde «mandata» e non si scrive né si manda niente.
  const trappola = testo(formData, 'sito_web', 10)
  const reso = Number(testo(formData, 't', 20))
  if (trappola || !Number.isFinite(reso) || Date.now() - reso < 3000) return { stato: 'mandata', email }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { stato: 'errore', messaggio: 'Controlla l’indirizzo email.', email }
  }

  // Il salvataggio e la mail partono insieme: nessuno dei due aspetta l'altro.
  const [res, mail] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/contatto_guida`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY_PUBBLICA,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ guida: slug, email, origine: origine || null }),
      cache: 'no-store',
    }).catch(() => null),
    mandaGuida({ email, titolo: guida.titolo, pdf }),
  ])
  const salvata = Boolean(res?.ok)
  if (!salvata) console.error('[guida] mail non salvata', res?.status, await res?.text().catch(() => ''))
  if (!mail.ok) console.error('[guida] guida non mandata per mail', mail.errore)

  // La mail l'ha lasciata: la guida è sua anche se il database non risponde (la mail arriva comunque a
  // Raffaele su Telegram, con l'avviso di copiarla) e anche se la mail non parte (allora la scarica dal sito).
  await avvisaGuida({ titolo: guida.titolo, email, origine, salvata, mandata: mail.ok, erroreMail: mail.ok ? undefined : mail.errore })
    .catch((e) => console.error('[guida] avviso', e))
  return mail.ok ? { stato: 'mandata', email } : { stato: 'ok', pdf }
}
