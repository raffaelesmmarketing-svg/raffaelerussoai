'use client'

import { useSyncExternalStore } from 'react'
import SchedaGuida from '@/components/guide/SchedaGuida'
import { guide, temi, type Guida, type Tema } from '@/lib/guide'

// /risorse: le guide con la ricerca e i temi (Raffaele, 26/10: «una lista continua lunghissima, non finisce mai»).
// Il server stampa tutte le guide (le leggono i motori di ricerca); i filtri lavorano nel browser.
// Il tema e la parola cercata vivono nell'indirizzo (?tema=marketing&q=whatsapp): un link può portare già filtrato,
// e l'indirizzo è l'unica fonte dei filtri (niente stato da tenere allineato).

// minuscole, senza accenti e con l'apostrofo dritto: «Più» trova «piu», «l’account» trova «l'account»
const piano = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u2018\u2019]/g, "'").toLowerCase()

const testoDi = (g: Guida) =>
  piano(
    [
      g.titolo,
      g.sotto,
      g.descrizione,
      ...g.dentro,
      ...(g.parole ?? []),
      ...g.temi.map((id) => temi.find((t) => t.id === id)?.nome ?? ''),
    ].join(' '),
  )

const indice = guide.map((g) => ({ guida: g, testo: testoDi(g) }))
const eUnTema = (s: string | null): s is Tema => temi.some((t) => t.id === s)

// L'indirizzo come negozio: sul server (e durante l'idratazione) nessun filtro, nel browser quello vero.
const EVENTO = 'filtri-guide'
const ascolta = (avvisa: () => void) => {
  window.addEventListener('popstate', avvisa)
  window.addEventListener(EVENTO, avvisa)
  return () => {
    window.removeEventListener('popstate', avvisa)
    window.removeEventListener(EVENTO, avvisa)
  }
}
const leggi = () => window.location.search
const leggiSulServer = () => ''

// Cambia un filtro nell'indirizzo: gli altri parametri (come ?da=instagram) restano, la cronologia non si allunga.
const imposta = (cambi: { tema?: Tema | null; cerca?: string }) => {
  const p = new URLSearchParams(window.location.search)
  if ('tema' in cambi) {
    if (cambi.tema) p.set('tema', cambi.tema)
    else p.delete('tema')
  }
  if ('cerca' in cambi) {
    if (cambi.cerca) p.set('q', cambi.cerca)
    else p.delete('q')
  }
  const s = p.toString()
  window.history.replaceState(window.history.state, '', `${window.location.pathname}${s ? `?${s}` : ''}${window.location.hash}`)
  window.dispatchEvent(new Event(EVENTO))
}
const setTema = (tema: Tema | null) => imposta({ tema })
const setCerca = (cerca: string) => imposta({ cerca })
const azzera = () => imposta({ tema: null, cerca: '' })

export default function ElencoGuide() {
  const p = new URLSearchParams(useSyncExternalStore(ascolta, leggi, leggiSulServer))
  const t = p.get('tema')
  const tema = eUnTema(t) ? t : null
  const cerca = p.get('q') ?? ''

  const parole = piano(cerca).split(/\s+/).filter(Boolean)
  const trovate = indice.filter(({ testo }) => parole.every((w) => testo.includes(w))).map(({ guida }) => guida)
  const mostrate = tema ? trovate.filter((g) => g.temi.includes(tema)) : trovate
  const filtrato = Boolean(tema || parole.length)

  return (
    <div>
      {/* gli strumenti stanno sul bordo della griglia che filtrano: sono una cosa sola con i risultati */}
      <div>
        <label htmlFor="cerca-guida" className="block font-body text-[14px] font-semibold text-fog-100 mb-1.5">
          Cerca una guida
        </label>
        <div className="relative max-w-xl">
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-fog-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <circle cx="8.5" cy="8.5" r="5.75" />
            <path d="m13 13 4.25 4.25" />
          </svg>
          <input
            id="cerca-guida"
            type="text"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            value={cerca}
            onChange={(e) => setCerca(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setCerca('')
            }}
            placeholder="WhatsApp, video, clienti, Instagram…"
            className="w-full rounded-md bg-navy-950 border border-white/[0.18] py-3 pl-11 pr-12 font-body text-[16px] text-white placeholder:text-fog-300/75 hover:border-white/40 focus:border-lime-500/70 focus:outline-none focus:ring-2 focus:ring-lime-500/60 transition-[border-color,box-shadow]"
          />
          {cerca && (
            <button
              type="button"
              onClick={() => setCerca('')}
              aria-label="Cancella la ricerca"
              className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-md text-fog-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/60"
            >
              <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 5l10 10M15 5 5 15" />
              </svg>
            </button>
          )}
        </div>

        <div
          role="group"
          aria-label="Temi"
          className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <Pulsante attivo={!tema} onClick={() => setTema(null)} quante={trovate.length}>
            Tutte
          </Pulsante>
          {temi.map((t) => (
            <Pulsante
              key={t.id}
              attivo={tema === t.id}
              onClick={() => setTema(tema === t.id ? null : t.id)}
              quante={trovate.filter((g) => g.temi.includes(t.id)).length}
            >
              {t.nome}
            </Pulsante>
          ))}
        </div>

        <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-body text-[15px] text-fog-300">
          <span aria-live="polite">
            {filtrato
              ? `${mostrate.length} ${mostrate.length === 1 ? 'guida' : 'guide'} su ${guide.length}`
              : `${guide.length} guide, le più nuove per prime`}
          </span>
          {filtrato && mostrate.length > 0 && (
            <button
              type="button"
              onClick={azzera}
              className="font-body text-[15px] font-semibold text-lime-500 underline underline-offset-4 decoration-lime-500/40 hover:decoration-lime-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/60 rounded-sm"
            >
              Mostra tutte
            </button>
          )}
        </p>
      </div>

      {mostrate.length > 0 ? (
        <div className={`mt-8 grid gap-5 md:grid-cols-2 ${mostrate.length >= 3 ? 'lg:grid-cols-3' : 'mx-auto max-w-4xl'}`}>
          {mostrate.map((g) => (
            <SchedaGuida key={g.slug} guida={g} breve />
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-8 max-w-[920px] rounded-2xl border border-white/[0.08] bg-navy-800 px-6 py-10 text-center sm:px-10">
          <p className="font-display text-[21px] font-bold leading-[1.3] text-white text-balance">
            {parole.length ? <>Nessuna guida con «{cerca.trim()}»{tema ? ' in questo tema' : ''}.</> : 'Nessuna guida qui, per ora.'}
          </p>
          <p className="mx-auto mt-3 max-w-md font-body text-[15px] leading-[1.6] text-fog-300 text-pretty">
            Prova con una parola più corta o più comune, oppure guardale tutte: sono {guide.length}.
          </p>
          <button
            type="button"
            onClick={azzera}
            className="mt-6 inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 font-display text-sm font-extrabold uppercase tracking-[0.06em] text-white hover:border-lime-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime-500/40 transition-colors"
          >
            Mostra tutte le guide
          </button>
        </div>
      )}
    </div>
  )
}

function Pulsante({
  attivo,
  onClick,
  quante,
  children,
}: {
  attivo: boolean
  onClick: () => void
  quante: number
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={attivo}
      onClick={onClick}
      className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 font-body text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/60 ${
        attivo
          ? 'border-lime-500 bg-lime-500 text-navy-950 font-semibold'
          : 'border-white/[0.18] text-fog-100 hover:border-white/40'
      }`}
    >
      {children}
      <span className={`tabular-nums text-[13px] ${attivo ? 'text-navy-950/70' : 'text-fog-300'}`}>{quante}</span>
    </button>
  )
}
