'use client'

import { useActionState, useEffect, useRef } from 'react'
import { inviaRichiesta, type Esito } from '@/app/ai-per-architetti/actions'
import { PAGINA, opzioniOre, opzioniSituazione, type PaginaRichiesta } from './dati'

const campoBase =
  'w-full rounded-md bg-navy-950 border px-4 py-3 font-body text-[16px] text-white placeholder:text-fog-500 focus:outline-none focus:ring-2 focus:ring-lime-500/60 transition-shadow'

function Errore({ testo, id }: { testo?: string; id: string }) {
  if (!testo) return null
  return (
    <p id={id} role="alert" className="font-body text-[13px] text-lime-400 mt-1.5">
      {testo}
    </p>
  )
}

export default function Modulo({ pagina = PAGINA }: { pagina?: PaginaRichiesta }) {
  const [esito, azione, inCorso] = useActionState<Esito, FormData>(inviaRichiesta, { stato: 'inizio' })
  const origine = useRef<HTMLInputElement>(null)
  const reso = useRef<HTMLInputElement>(null)
  const riepilogo = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Da dove è arrivato (referrer + parametri della pagina) e quando il modulo è stato reso: il
    // primo serve a Raffaele, il secondo a scartare i bot che inviano in meno di tre secondi.
    // Si scrive direttamente nei campi nascosti: sono valori del browser, non stato di React.
    if (origine.current && !origine.current.value) origine.current.value = [document.referrer, window.location.search].filter(Boolean).join(' ').slice(0, 500)
    if (reso.current && !reso.current.value) reso.current.value = String(Date.now())
  }, [])

  useEffect(() => {
    if (esito.stato === 'ok') riepilogo.current?.focus()
  }, [esito.stato])

  if (esito.stato === 'ok') {
    return (
      <div ref={riepilogo} tabIndex={-1} className="rounded-lg bg-navy-800 border border-lime-500/40 p-7 sm:p-9 focus:outline-none">
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-lime-500">Ricevuto</p>
        <h3 className="font-display font-extrabold text-white text-[26px] leading-[1.15] mt-3 text-balance">
          Grazie{esito.nome ? `, ${esito.nome.split(' ')[0]}` : ''}. Ti scrivo io entro 24 ore.
        </h3>
        <p className="font-body text-[16px] leading-[1.7] text-fog-300 mt-4 max-w-[48ch]">
          Fissiamo i 20 minuti e basta. Niente sequenze automatiche, niente telefonate a sorpresa.
        </p>
      </div>
    )
  }

  // Fuori dalla landing per architetti «studio» non dice niente a un imprenditore: stessa scelta, parole neutre.
  const neutra = pagina !== PAGINA
  const campi = esito.stato === 'errore' ? esito.campi : {}
  // Quello che la persona aveva già scritto: torna con l'errore e ripopola i campi.
  const valori: Record<string, string> = esito.stato === 'errore' ? esito.valori : {}
  const bordo = (k: string) => (campi[k] ? 'border-lime-500/70' : 'border-white/[0.14]')

  return (
    <form action={azione} noValidate className="rounded-lg bg-navy-800 border border-white/[0.12] p-4 sm:p-8">
      <input type="hidden" name="pagina" value={pagina} />
      <input type="hidden" name="origine" defaultValue={valori.origine ?? ''} ref={origine} />
      <input type="hidden" name="t" defaultValue={valori.t ?? ''} ref={reso} />
      {/* Trappola per i bot: un umano non la vede e non la compila. */}
      <div className="absolute -left-[10000px] top-auto w-px h-px overflow-hidden" aria-hidden>
        <label>
          Sito web <input type="text" name="sito_web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label htmlFor="nome" className="block font-body text-[14px] font-semibold text-fog-100 mb-1.5">
            Nome e cognome
          </label>
          <input id="nome" name="nome" type="text" defaultValue={valori.nome ?? ''} autoComplete="name" required className={`${campoBase} ${bordo('nome')}`} aria-describedby={campi.nome ? 'e-nome' : undefined} aria-invalid={!!campi.nome} />
          <Errore id="e-nome" testo={campi.nome} />
        </div>
        <div>
          <label htmlFor="email" className="block font-body text-[14px] font-semibold text-fog-100 mb-1.5">
            Email
          </label>
          <input id="email" name="email" type="email" defaultValue={valori.email ?? ''} autoComplete="email" inputMode="email" required className={`${campoBase} ${bordo('email')}`} aria-describedby={campi.email ? 'e-email' : undefined} aria-invalid={!!campi.email} />
          <Errore id="e-email" testo={campi.email} />
        </div>
        <div>
          <label htmlFor="telefono" className="block font-body text-[14px] font-semibold text-fog-100 mb-1.5">
            Telefono <span className="font-normal text-fog-300">(se preferisci che ti chiami)</span>
          </label>
          <input id="telefono" name="telefono" type="tel" defaultValue={valori.telefono ?? ''} autoComplete="tel" inputMode="tel" className={`${campoBase} ${bordo('telefono')}`} />
        </div>
      </div>

      <fieldset className="mt-7">
        <legend className="font-body text-[14px] font-semibold text-fog-100 mb-2.5">
          {neutra ? 'Lavori da solo o con dei collaboratori?' : 'Lavori da solo o in uno studio?'}
        </legend>
        <div className="flex flex-wrap gap-2.5">
          {opzioniSituazione.map((o) => (
            <label key={o.valore} className="cursor-pointer">
              <input type="radio" name="situazione" value={o.valore} defaultChecked={valori.situazione === o.valore} className="peer sr-only" required />
              <span className="inline-block rounded-full border border-white/[0.18] px-4 py-2 font-body text-[15px] text-fog-100 transition-colors peer-checked:bg-lime-500 peer-checked:text-navy-950 peer-checked:border-lime-500 peer-focus-visible:ring-2 peer-focus-visible:ring-lime-500/60 hover:border-white/40">
                {neutra && o.valore === 'studio' ? 'Ho dei collaboratori' : o.etichetta}
              </span>
            </label>
          ))}
        </div>
        <Errore id="e-situazione" testo={campi.situazione} />
      </fieldset>

      <fieldset className="mt-7">
        <legend className="font-body text-[14px] font-semibold text-fog-100 mb-2.5">
          Quante ore a settimana rifai le stesse cose?
        </legend>
        <div className="flex flex-wrap gap-2.5">
          {opzioniOre.map((o) => (
            <label key={o.valore} className="cursor-pointer">
              <input type="radio" name="ore_settimana" value={o.valore} defaultChecked={valori.ore_settimana === o.valore} className="peer sr-only" required />
              <span className="inline-block rounded-full border border-white/[0.18] px-4 py-2 font-body text-[15px] text-fog-100 tabular-nums transition-colors peer-checked:bg-lime-500 peer-checked:text-navy-950 peer-checked:border-lime-500 peer-focus-visible:ring-2 peer-focus-visible:ring-lime-500/60 hover:border-white/40">
                {o.etichetta}
              </span>
            </label>
          ))}
        </div>
        <Errore id="e-ore" testo={campi.ore_settimana} />
      </fieldset>

      <div className="mt-7">
        <label htmlFor="prima_cosa" className="block font-body text-[14px] font-semibold text-fog-100 mb-1.5">
          Cosa vorresti automatizzare per prima? <span className="font-normal text-fog-300">(facoltativo)</span>
        </label>
        <textarea
          id="prima_cosa"
          name="prima_cosa"
          rows={3}
          maxLength={600}
          defaultValue={valori.prima_cosa ?? ''}
          placeholder="Scrivilo con parole tue: i preventivi, le relazioni, le risposte ai clienti…"
          className={`${campoBase} ${bordo('prima_cosa')} resize-y min-h-[96px]`}
        />
        <Errore id="e-prima" testo={campi.prima_cosa} />
      </div>

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
        <span className="relative z-10">{inCorso ? 'Invio in corso…' : 'Prenota i 20 minuti'}</span>
        {!inCorso && (
          <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1" aria-hidden>
            →
          </span>
        )}
      </button>
      <p className="font-body text-[13px] leading-[1.6] text-fog-300 mt-4 max-w-[52ch]">
        Inviando accetti la{' '}
        <a href="/privacy" className="underline underline-offset-2 hover:text-white">
          privacy policy
        </a>
        . I tuoi dati servono solo a scriverti per fissare i 20 minuti.
      </p>
    </form>
  )
}
