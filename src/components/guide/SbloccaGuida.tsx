'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { sbloccaGuida, type EsitoGuida } from '@/app/guida/[slug]/actions'

const campo =
  'w-full rounded-md bg-navy-950 border px-4 py-3 font-body text-[16px] text-white placeholder:text-fog-500 focus:outline-none focus:ring-2 focus:ring-lime-500/60 transition-shadow'

// Chi ha già sbloccato la guida su questo browser la ritrova pronta da scaricare.
const chiave = (slug: string) => `guida-sbloccata:${slug}`

// La guida che si scarica dopo la mail: un campo, un pulsante, e al posto del modulo il PDF.
export default function SbloccaGuida({ slug }: { slug: string }) {
  const [esito, azione, inCorso] = useActionState<EsitoGuida, FormData>(sbloccaGuida, { stato: 'inizio' })
  const [giaSbloccata, setGiaSbloccata] = useState<string | null>(null)
  // ⛔ Nello stato, non nei campi: dopo un invio React rimette i campi del modulo com'erano all'inizio,
  //    e dopo un errore si perdevano l'origine e l'ora (misurato il 10/10).
  const [origine, setOrigine] = useState('')
  const [reso, setReso] = useState('')
  const pronta = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      setGiaSbloccata(localStorage.getItem(chiave(slug)))
    } catch {
      /* senza memoria del browser si rimette la mail: va bene lo stesso */
    }
    // Da dove arriva (referrer e parametri, es. ?da=instagram) e quando il modulo è stato reso,
    // per scartare i bot che inviano in meno di tre secondi.
    setOrigine([document.referrer, window.location.search].filter(Boolean).join(' ').slice(0, 500))
    setReso(String(Date.now()))
  }, [slug])

  useEffect(() => {
    if (esito.stato !== 'ok') return
    try {
      localStorage.setItem(chiave(slug), esito.pdf)
    } catch {
      /* idem */
    }
    pronta.current?.focus()
  }, [esito, slug])

  const pdf = esito.stato === 'ok' ? esito.pdf : giaSbloccata
  if (pdf) {
    return (
      <div ref={pronta} tabIndex={-1} className="rounded-lg bg-navy-800 border border-lime-500/40 p-6 sm:p-7 focus:outline-none">
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-lime-500">Sbloccata</p>
        <p className="font-display font-extrabold text-white text-[22px] leading-[1.2] mt-2 text-balance">Ecco la tua guida.</p>
        <p className="font-body text-[15px] leading-[1.6] text-fog-300 mt-2">Scaricala e tienila: per ogni passaggio ci sono le istruzioni da copiare.</p>
        <a
          href={pdf}
          download
          className="cta-shimmer group mt-5 inline-flex w-full sm:w-auto items-center justify-center gap-2.5 font-display font-extrabold text-sm tracking-[0.06em] uppercase bg-lime-500 text-navy-950 px-7 py-4 rounded-full no-underline shadow-glow-lime-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime-500/40"
        >
          <span className="relative z-10">Scarica la guida</span>
          <span className="relative z-10 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden>
            ↓
          </span>
        </a>
      </div>
    )
  }

  const errore = esito.stato === 'errore' ? esito : null

  return (
    <form action={azione} noValidate className="rounded-lg bg-navy-800 border border-white/[0.12] p-5 sm:p-6">
      <input type="hidden" name="guida" value={slug} />
      <input type="hidden" name="origine" value={origine} readOnly />
      <input type="hidden" name="t" value={reso} readOnly />
      {/* Trappola per i bot: un umano non la vede e non la compila. */}
      <div className="absolute -left-[10000px] top-auto w-px h-px overflow-hidden" aria-hidden>
        <label>
          Sito web <input type="text" name="sito_web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label htmlFor="email-guida" className="block font-body text-[15px] font-semibold text-fog-100">
        Lascia la tua email e la scarichi subito
      </label>
      <div className="mt-3 flex flex-col sm:flex-row gap-3">
        <input
          id="email-guida"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="nome@azienda.it"
          defaultValue={errore?.email ?? ''}
          key={errore ? `e-${errore.email}` : 'vuoto'}
          aria-invalid={!!errore}
          aria-describedby={errore ? 'e-email-guida' : undefined}
          className={`${campo} ${errore ? 'border-lime-500/70' : 'border-white/[0.14]'} sm:flex-1 min-w-0`}
        />
        <button
          type="submit"
          disabled={inCorso}
          className="cta-shimmer group inline-flex items-center justify-center gap-2.5 font-display font-extrabold text-sm tracking-[0.06em] uppercase bg-lime-500 text-navy-950 px-7 py-4 rounded-full shadow-glow-lime-sm disabled:opacity-70 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime-500/40 whitespace-nowrap"
        >
          <span className="relative z-10">{inCorso ? 'Un attimo…' : 'Sblocca la guida'}</span>
        </button>
      </div>
      {errore && (
        <p id="e-email-guida" role="alert" className="font-body text-[13px] text-lime-400 mt-2">
          {errore.messaggio}
        </p>
      )}
      <p className="font-body text-[13px] leading-[1.6] text-fog-300 mt-3">
        Lasciando la mail accetti la{' '}
        <a href="/privacy" className="underline underline-offset-2 hover:text-white">
          privacy policy
        </a>
        .
      </p>
    </form>
  )
}
