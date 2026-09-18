'use client'

import { useActionState } from 'react'
import { domande } from '@/components/landing/architetti/dati'
import { inviaQuestionario, type EsitoQuestionario } from './questionario-actions'

const risorse = [
  {
    titolo: 'ChatGPT non è Google: usalo davvero',
    sotto: 'Guida pratica, 12 minuti. Da domande generiche a un collaboratore che conosce il tuo lavoro.',
    href: '/guide/chatgpt-non-e-google-usalo-davvero.pdf',
  },
  {
    titolo: 'Stop al ChatGPT che ti dà sempre ragione',
    sotto: 'Guida pratica, 12 minuti. Come farti dire quello che non torna, invece di quello che vuoi sentire.',
    href: '/guide/stop-al-chatgpt-che-ti-da-sempre-ragione.pdf',
  },
]

const campo =
  'w-full rounded-md bg-navy-950 border border-white/[0.14] px-4 py-3 font-body text-[16px] text-white placeholder:text-fog-500 focus:outline-none focus:ring-2 focus:ring-lime-500/60 transition-shadow'

// Dieci domande, tutte facoltative: si risponde a quelle che si vogliono, anche in due parole.
export default function Questionario({ richiestaId }: { richiestaId: string }) {
  const [esito, azione, inCorso] = useActionState<EsitoQuestionario, FormData>(inviaQuestionario, { stato: 'inizio' })

  if (esito.stato === 'ok') {
    return (
      <div className="rounded-lg bg-navy-800 border border-lime-500/40 p-5 sm:p-9">
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-lime-500">Ricevuto</p>
        <h2 className="font-display font-extrabold text-white text-[26px] leading-[1.15] mt-3 text-balance">
          Grazie. Le tue risposte le ho già davanti.
        </h2>
        <p className="font-body text-[16px] leading-[1.7] text-fog-300 mt-4 max-w-[52ch]">
          In chiamata partiamo da lì: dalle cose che rifai più spesso e da quella che ti porta via più tempo.
        </p>

        {/* Due guide vere, già scritte: chi aspetta la chiamata ha qualcosa da leggere. */}
        <div className="mt-8 border-t border-white/[0.12] pt-6">
          <p className="font-body text-[16px] font-semibold text-fog-100">Intanto, due guide gratuite da scaricare:</p>
          <ul className="mt-3 space-y-3">
            {risorse.map((r) => (
              <li key={r.href}>
                <a href={r.href} download className="group inline-flex items-start gap-3 no-underline">
                  <span aria-hidden className="mt-[11px] h-px w-5 shrink-0 bg-lime-500" />
                  <span>
                    <span className="block font-display font-bold text-white text-[17px] leading-[1.3] group-hover:text-lime-500 transition-colors">
                      {r.titolo}
                    </span>
                    <span className="block font-body text-[14px] text-fog-300 mt-0.5">{r.sotto} <span className="text-fog-500">· PDF</span></span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <form action={azione} className="rounded-lg bg-navy-800 border border-white/[0.12] p-4 sm:p-8">
      <input type="hidden" name="r" value={richiestaId} />
      <ol className="space-y-7 sm:space-y-8">
        {domande.map((d, i) => (
          <li key={d.id} className="grid grid-cols-[1.6rem_1fr] gap-2 sm:grid-cols-[2.25rem_1fr] sm:gap-3">
            <span className="font-mono text-[13px] font-bold text-lime-500 pt-1 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
            <div>
              {d.tipo === 'scelta' ? (
                <fieldset>
                  <legend className="font-body text-[16px] font-semibold text-fog-100 mb-2.5 text-pretty">{d.testo}</legend>
                  <div className="flex flex-wrap gap-2.5">
                    {d.opzioni.map((o) => (
                      <label key={o} className="cursor-pointer">
                        <input type={d.multipla ? 'checkbox' : 'radio'} name={d.id} value={o} className="peer sr-only" />
                        <span className="inline-block rounded-full border border-white/[0.18] px-4 py-2 font-body text-[15px] text-fog-100 transition-colors peer-checked:bg-lime-500 peer-checked:text-navy-950 peer-checked:border-lime-500 peer-focus-visible:ring-2 peer-focus-visible:ring-lime-500/60 hover:border-white/40">
                          {o}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : (
                <>
                  <label htmlFor={d.id} className="block font-body text-[16px] font-semibold text-fog-100 mb-2.5 text-pretty">
                    {d.testo}
                  </label>
                  <textarea id={d.id} name={d.id} rows={3} maxLength={800} placeholder={d.suggerimento} className={`${campo} resize-y min-h-[84px]`} />
                </>
              )}
            </div>
          </li>
        ))}
      </ol>

      {esito.stato === 'errore' && (
        <p role="alert" className="font-body text-[14px] text-lime-400 mt-6">
          {esito.messaggio}
        </p>
      )}

      <button
        type="submit"
        disabled={inCorso}
        className="cta-shimmer group mt-8 inline-flex w-full sm:w-auto items-center justify-center gap-2.5 font-display font-extrabold text-sm tracking-[0.06em] uppercase bg-lime-500 text-navy-950 px-7 py-4 rounded-full shadow-glow-lime disabled:opacity-70 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime-500/40"
      >
        <span className="relative z-10">{inCorso ? 'Invio in corso…' : 'Invia le risposte'}</span>
        {!inCorso && (
          <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1" aria-hidden>
            →
          </span>
        )}
      </button>
      <p className="font-body text-[13px] leading-[1.6] text-fog-300 mt-4 max-w-[52ch]">
        Tutte facoltative. Le leggo io prima della chiamata, e restano fra noi.
      </p>
    </form>
  )
}
