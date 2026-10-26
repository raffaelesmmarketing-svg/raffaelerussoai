'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Clock } from 'lucide-react'
import {
  PORTE,
  domandeVisibili,
  ecoDopo,
  linkCalendly,
  testiDi,
  uscitaDopo,
  type Domanda,
  type DomandaMultipla,
  type Porta,
  type Risposte,
  type Uscita,
} from '@/lib/consulenza'
import { CALENDLY_CONSULENZA } from './calendario'

// La candidatura alla consulenza gratuita (26/10/2026): una domanda per schermata, come il funnel di @ozzibig e la
// candidatura di Cantieri Hub. Domande, conto e controlli stanno in lib/consulenza.ts, gli stessi della rotta del server.
// Le fasi: da dove parti (le due porte) → le domande della porta (con le uscite gentili) → la fine: il grazie per le
// risposte, cosa si guarda nei 20 minuti e il calendario di Calendly dentro la pagina, dove si prenota (Raffaele, 26/10:
// «metti semplicemente Calendly e loro possono prenotare l'appuntamento da qua»). Quando il calendario dice che la
// prenotazione è fatta, la pagina manda le risposte alla rotta, che avvisa Raffaele.

type Fase = 'porta' | 'domande' | 'uscita' | 'prenota'
type Salvato = { fase: Fase; porta: Porta | null; risposte: Risposte; passo: number }
/** Un messaggio del calendario alla pagina: la prenotazione fatta, o quanto è alta la sua pagina. */
type MessaggioCalendly = { event?: unknown; payload?: { height?: unknown; event?: { uri?: unknown }; invitee?: { uri?: unknown } } }

// Il punto a cui si è arrivati resta nel browser: chi chiude la pagina a metà la riprende. Dopo la prenotazione si
// cancella.
const CHIAVE = 'pb-consulenza'
const CALENDLY = 'https://calendly.com'
const LETTERE = 'ABCDEFGHIJ'
const ORDINE: Porta[] = ['attivita', 'imparare']
const EDILIZIA = 'https://cantierihub.com/consulenza?da=raffaelerussoai'

function leggiSalvato(): Salvato | null {
  try {
    const grezzo = window.localStorage.getItem(CHIAVE)
    return grezzo ? (JSON.parse(grezzo) as Salvato) : null
  } catch {
    return null
  }
}

function salva(s: Salvato | null) {
  try {
    if (s) window.localStorage.setItem(CHIAVE, JSON.stringify(s))
    else window.localStorage.removeItem(CHIAVE)
  } catch {
    /* navigazione privata o memoria piena: si va avanti senza */
  }
}

const CAMPO =
  'w-full rounded-md border border-white/[0.18] bg-navy-950 px-4 py-3.5 font-body text-[17px] text-white outline-none transition placeholder:text-fog-300/70 hover:border-white/30 focus:border-lime-500/70 focus:ring-2 focus:ring-lime-500/50'
const TITOLO = 'font-display font-extrabold tracking-[-0.02em] text-white outline-none [text-wrap:balance]'
const BOTTONE =
  'cta-shimmer group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-lime-500 px-7 font-display text-[15px] font-extrabold uppercase tracking-[0.05em] text-navy-950 shadow-glow-lime-sm transition disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime-500/40'
const LINK = 'inline-flex min-h-[44px] items-center text-left font-body text-[15px] font-semibold text-fog-300 underline decoration-white/30 underline-offset-4 hover:text-white'

export default function Candidatura() {
  const [fase, setFase] = useState<Fase>('porta')
  const [porta, setPorta] = useState<Porta | null>(null)
  const [risposte, setRisposte] = useState<Risposte>({})
  const [passo, setPasso] = useState(0)
  const [eco, setEco] = useState('')
  const [verso, setVerso] = useState(1)
  const [avviso, setAvviso] = useState('')
  const [frase, setFrase] = useState('')
  const [esce, setEsce] = useState<Uscita | null>(null)
  const [prenotata, setPrenotata] = useState(false)
  const [anteprima, setAnteprima] = useState(false)
  const [ripresa, setRipresa] = useState<Salvato | null>(null)
  const occupato = useRef(false)
  const titolo = useRef<HTMLHeadingElement>(null)
  const ridotto = useReducedMotion()

  const domande = porta ? domandeVisibili(porta, risposte) : []
  const domanda: Domanda | undefined = fase === 'domande' ? domande[passo] : undefined

  // Al primo disegno nel browser: chi aveva lasciato a metà può riprendere.
  useEffect(() => {
    const s = leggiSalvato()
    if (!s?.porta || (s.fase !== 'domande' && s.fase !== 'prenota')) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lo stato salvato esiste solo nel browser: sul server la pagina parte sempre dall'inizio
    setRipresa(s)
  }, [])

  useEffect(() => {
    if (porta && !prenotata && (fase === 'domande' || fase === 'prenota')) salva({ fase, porta, risposte, passo })
  }, [fase, porta, risposte, passo, prenotata])

  // Il calendario parla con la pagina: quando la prenotazione è fatta, le risposte vanno alla rotta che avvisa Raffaele
  // (nome e mail no: stanno su Calendly). Si ascolta solo Calendly, e solo nella fase del calendario.
  useEffect(() => {
    if (fase !== 'prenota' || !porta || prenotata) return
    const ascolta = (e: MessageEvent) => {
      if (e.origin !== CALENDLY) return
      const m = (e.data ?? {}) as MessaggioCalendly
      if (m.event !== 'calendly.event_scheduled') return
      const origine = [document.referrer, window.location.search].filter(Boolean).join(' ').slice(0, 500)
      fetch('/api/consulenza', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ porta, risposte, origine, evento: m.payload?.event?.uri, invitato: m.payload?.invitee?.uri }),
        keepalive: true,
      })
        .then((r) => r.json())
        .then((j: { anteprima?: boolean }) => {
          if (j.anteprima) setAnteprima(true)
        })
        .catch(() => {})
      salva(null)
      setPrenotata(true)
    }
    window.addEventListener('message', ascolta)
    return () => window.removeEventListener('message', ascolta)
  }, [fase, porta, risposte, prenotata])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [fase, passo])

  const vai = (nuova: Fase, direzione = 1) => {
    setVerso(direzione)
    setAvviso('')
    setFase(nuova)
  }

  /** Dopo una risposta: la riga di commento, se c'è, e la domanda dopo (contata sulle domande rimaste visibili). */
  const avanti = (daId: string, r: Risposte) => {
    if (!porta) return
    const visibili = domandeVisibili(porta, r)
    const i = visibili.findIndex((d) => d.id === daId)
    setAvviso('')
    setVerso(1)
    if (i + 1 < visibili.length) {
      setEco(ecoDopo(porta, daId, r))
      setPasso(i + 1)
      setFase('domande')
    } else {
      setEco('')
      setFase('prenota')
    }
  }

  const scegliPorta = (p: Porta) => {
    setPorta(p)
    setRisposte({})
    setPasso(0)
    setFrase('')
    setEco(PORTE[p].dopoLaScelta)
    setRipresa(null)
    vai('domande')
  }

  const riprendi = () => {
    if (!ripresa?.porta) return
    const r = ripresa.risposte ?? {}
    setPorta(ripresa.porta)
    setRisposte(r)
    setPasso(Math.min(ripresa.passo ?? 0, Math.max(0, domandeVisibili(ripresa.porta, r).length - 1)))
    setFrase('')
    setEco('')
    setRipresa(null)
    vai(ripresa.fase)
  }

  const scegli = (d: Domanda, valore: string) => {
    if (occupato.current || !porta) return
    occupato.current = true
    const r = { ...risposte, [d.id]: valore }
    setRisposte(r)
    // un attimo per vedere la scelta segnata, poi la domanda dopo (o l'uscita gentile, se la risposta la apre)
    window.setTimeout(() => {
      occupato.current = false
      const dove = uscitaDopo(porta, d.id, r)
      if (dove) {
        setEsce(dove)
        setEco('')
        vai('uscita')
      } else avanti(d.id, r)
    }, ridotto ? 0 : 280)
  }

  const alterna = (d: DomandaMultipla, valore: string) => {
    const attuali = Array.isArray(risposte[d.id]) ? (risposte[d.id] as string[]) : []
    if (attuali.includes(valore)) {
      setAvviso('')
      setRisposte({ ...risposte, [d.id]: attuali.filter((x) => x !== valore) })
      return
    }
    if (d.max && attuali.length >= d.max) {
      setAvviso(`Al massimo ${d.max === 2 ? 'due' : d.max}: togline una per sceglierne un'altra.`)
      return
    }
    setAvviso('')
    setRisposte({ ...risposte, [d.id]: [...attuali, valore] })
  }

  const confermaFrase = (d: Domanda, salta: boolean) => {
    const r = { ...risposte, [d.id]: salta ? '' : frase.trim() }
    setFrase('')
    setRisposte(r)
    avanti(d.id, r)
  }

  const indietro = () => {
    setEco('')
    if (fase === 'domande') {
      if (passo > 0) {
        setVerso(-1)
        setAvviso('')
        setPasso(passo - 1)
      } else vai('porta', -1)
    } else if (fase === 'uscita') vai('domande', -1)
    else if (fase === 'prenota') {
      setPasso(Math.max(0, domande.length - 1))
      vai('domande', -1)
    } else vai('porta', -1)
  }

  // Le lettere della tastiera scelgono, come in @ozzibig; Invio va avanti nelle scelte multiple.
  useEffect(() => {
    const tasto = (e: KeyboardEvent) => {
      const bersaglio = e.target as HTMLElement | null
      if (bersaglio && (bersaglio.tagName === 'INPUT' || bersaglio.tagName === 'TEXTAREA')) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const indice = /^[a-z]$/i.test(e.key) ? e.key.toUpperCase().charCodeAt(0) - 65 : -1
      if (fase === 'porta' && ORDINE[indice]) {
        e.preventDefault()
        scegliPorta(ORDINE[indice])
        return
      }
      if (!domanda || domanda.tipo === 'testo') return
      const scelte = risposte[domanda.id]
      if (e.key === 'Enter' && domanda.tipo === 'multipla' && Array.isArray(scelte) && scelte.length) {
        e.preventDefault()
        avanti(domanda.id, risposte)
        return
      }
      const opzione = domanda.opzioni[indice]
      if (!opzione) return
      e.preventDefault()
      if (domanda.tipo === 'scelta') scegli(domanda, opzione)
      else alterna(domanda, opzione)
    }
    window.addEventListener('keydown', tasto)
    return () => window.removeEventListener('keydown', tasto)
  })

  const contatore = fase === 'domande' ? `Domanda ${passo + 1} di ${domande.length}` : fase === 'prenota' ? 'Ultimo passo' : ''
  const totale = domande.length + 1
  const barra = fase === 'domande' ? ((passo + 1) / totale) * 100 : fase === 'prenota' ? 100 : null
  const conIndietro = fase === 'domande' || fase === 'uscita' || (fase === 'prenota' && !prenotata)

  return (
    <div className="relative min-h-[100dvh] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(230,236,245,0.06) 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }}
      />

      <header className="relative z-10 mx-auto flex w-full max-w-[680px] items-center justify-between gap-4 px-4 pt-5 md:px-6 md:pt-7">
        <Link href="/" aria-label="Raffaele Russo AI, vai al sito" className="flex min-h-[44px] shrink-0 items-center gap-2.5 no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-mark.svg" alt="" className="h-8 w-8" />
          <span className="font-display text-base font-extrabold tracking-[-0.01em] text-white">
            Raffaele Russo <em className="em-lime">AI</em>
          </span>
        </Link>
        {contatore && <p className="font-body text-[14px] font-semibold text-fog-300">{contatore}</p>}
      </header>
      {barra !== null && (
        <div className="relative z-10 mx-auto mt-4 w-full max-w-[680px] px-4 md:px-6" aria-hidden="true">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div className="h-full rounded-full bg-lime-500" initial={false} animate={{ width: `${barra}%` }} transition={{ duration: 0.35 }} />
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-[680px] px-4 pb-20 pt-6 md:px-6 md:pt-10">
        {conIndietro && (
          <button
            type="button"
            onClick={indietro}
            className="-ml-2 mb-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 font-body text-[15px] font-semibold text-fog-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/60"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Indietro
          </button>
        )}

        <AnimatePresence mode="wait" custom={verso} initial={false}>
          <motion.div
            key={`${fase}-${fase === 'domande' ? passo : 0}`}
            initial={ridotto ? { opacity: 0 } : { opacity: 0, x: verso * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={ridotto ? { opacity: 0 } : { opacity: 0, x: verso * -28 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => titolo.current?.focus({ preventScroll: true })}
          >
            {fase === 'porta' && (
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-lime-500/10 px-3.5 py-1.5 font-body text-[14px] font-semibold text-lime-500 ring-1 ring-lime-500/30">
                  <Clock className="h-4 w-4" aria-hidden="true" /> Consulenza gratuita · 20 minuti
                </p>
                <h1 ref={titolo} tabIndex={-1} className={`${TITOLO} mt-5 text-[34px] leading-[1.08] md:text-[50px]`}>
                  Parliamo di come usare l&apos;AI <em className="em-lime">nel tuo lavoro.</em>
                </h1>
                <p className="mt-4 max-w-[34rem] font-body text-[17px] leading-relaxed text-fog-300 md:text-[18px]">
                  Prima qualche domanda veloce, due o tre minuti: così alla chiamata arrivo preparato sul tuo caso. Alla fine scegli tu giorno e ora.
                </p>
                {ripresa && (
                  <button
                    type="button"
                    onClick={riprendi}
                    className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-navy-800 px-4 font-body text-[15px] font-semibold text-white ring-1 ring-white/[0.12] hover:ring-lime-500/50"
                  >
                    Riprendi da dove eri <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}

                <h2 className="mt-10 font-display text-[22px] font-bold text-white md:text-[24px]">Da dove parti?</h2>
                <div className="mt-4 grid gap-3">
                  {ORDINE.map((p, i) => (
                    <Scheda key={p} onClick={() => scegliPorta(p)} lettera={LETTERE[i]} titolo={PORTE[p].titolo} testo={PORTE[p].descrizione} />
                  ))}
                </div>
              </div>
            )}

            {fase === 'domande' && porta && domanda && (
              <Passo
                domanda={domanda}
                porta={porta}
                risposte={risposte}
                eco={eco}
                avviso={avviso}
                frase={frase}
                titolo={titolo}
                onScegli={scegli}
                onAlterna={alterna}
                onAvanti={() => avanti(domanda.id, risposte)}
                onFrase={setFrase}
                onConfermaFrase={(salta) => confermaFrase(domanda, salta)}
              />
            )}

            {fase === 'uscita' && esce && (
              <UscitaGentile
                dove={esce}
                titolo={titolo}
                onProsegui={() => {
                  const id = domanda?.id ?? domande[passo]?.id
                  if (id) avanti(id, risposte)
                }}
              />
            )}

            {fase === 'prenota' && porta && (
              <div>
                <h1 ref={titolo} tabIndex={-1} className={`${TITOLO} text-[30px] leading-[1.1] md:text-[40px]`}>
                  Grazie per aver risposto alle domande.
                </h1>
                <h2 className="mt-7 font-display text-[20px] font-bold text-white md:text-[22px]">Nei 20 minuti guardiamo</h2>
                <ul className="mt-3 grid gap-3">
                  {PORTE[porta].inChiamata.map((x) => (
                    <li key={x} className="flex items-start gap-3 font-body text-[17px] leading-snug text-fog-100">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime-500 text-navy-950" aria-hidden="true">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      {x}
                    </li>
                  ))}
                </ul>
                <h2 className="mt-10 font-display text-[22px] font-bold text-white md:text-[26px]">Prenota la consulenza gratuita</h2>
                <Calendario porta={porta} risposte={risposte} />
                {anteprima && (
                  <p className="mt-4 rounded-xl border-2 border-dashed border-white/25 px-4 py-3 font-body text-[14px] leading-relaxed text-fog-100">
                    <strong>Anteprima:</strong> da qui l&apos;avviso a Raffaele non parte. La prenotazione su Calendly invece è vera: se era una prova, cancellala.
                  </p>
                )}
                <p className="mt-4 font-body text-[14px] leading-relaxed text-fog-300">
                  Nome e mail li lasci nel calendario: li uso solo per organizzare la consulenza.
                </p>
                <a href="/privacy" target="_blank" className={LINK}>
                  Privacy Policy
                </a>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/** Una porta o un'uscita: una scheda grande, a un tocco, con la lettera della tastiera. */
function Scheda({ onClick, href, lettera, titolo, testo }: { onClick?: () => void; href?: string; lettera?: string; titolo: string; testo: string }) {
  const classi =
    'group flex w-full items-center gap-4 rounded-2xl border border-white/[0.12] bg-navy-800/70 px-4 py-4 text-left no-underline transition hover:border-lime-500/60 hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/60 md:px-5 md:py-5'
  const dentro: ReactNode = (
    <>
      {lettera && (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/[0.18] bg-navy-950 font-body text-[14px] font-bold text-fog-300 transition group-hover:border-lime-500/60 group-hover:text-lime-500">
          {lettera}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[19px] font-bold leading-snug text-white">{titolo}</span>
        <span className="mt-0.5 block font-body text-[15px] leading-snug text-fog-300">{testo}</span>
      </span>
      <ArrowRight className="h-5 w-5 shrink-0 text-fog-300 transition group-hover:translate-x-0.5 group-hover:text-lime-500" aria-hidden="true" />
    </>
  )
  if (href)
    return (
      <a href={href} className={classi}>
        {dentro}
      </a>
    )
  return (
    <button type="button" onClick={onClick} className={classi}>
      {dentro}
    </button>
  )
}

/** Le uscite gentili: l'edilizia, e due consigli (le guide) che si possono saltare. */
function UscitaGentile({ dove, titolo, onProsegui }: { dove: Uscita; titolo: RefObject<HTMLHeadingElement | null>; onProsegui: () => void }) {
  const testi: Record<Uscita, { titolo: string; testo: string }> = {
    edilizia: {
      titolo: "Per l'edilizia c'è una consulenza fatta apposta.",
      testo: 'Imprese edili e studi tecnici hanno una consulenza dedicata, con gli strumenti pensati per quel lavoro.',
    },
    informo: {
      titolo: 'Allora parti dalle guide gratuite.',
      testo: 'Sono pratiche e si provano mentre le leggi. Quando vorrai partire, la consulenza è qui.',
    },
    gratis: {
      titolo: 'Allora parti dalle guide gratuite.',
      testo: 'Sono fatte per chi comincia: si leggono in una decina di minuti e si provano mentre le leggi.',
    },
  }
  const t = testi[dove]
  return (
    <div>
      <h1 ref={titolo} tabIndex={-1} className={`${TITOLO} text-[28px] leading-[1.15] md:text-[36px]`}>
        {t.titolo}
      </h1>
      <p className="mt-3 font-body text-[17px] leading-relaxed text-fog-300">{t.testo}</p>
      <div className="mt-6 grid gap-3">
        {dove === 'edilizia' && <Scheda href={EDILIZIA} titolo="Vai alla consulenza per l'edilizia" testo="Un'altra pagina, con le domande giuste per il tuo lavoro." />}
        {dove === 'informo' && <Scheda href="/risorse" titolo="Le guide gratuite" testo="Divise per tema: scegli quella che ti serve." />}
        {dove === 'gratis' && <Scheda href="/risorse?tema=cominciare" titolo="Le guide per cominciare" testo="Le prime da leggere, se parti da zero." />}
      </div>
      {(dove === 'informo' || dove === 'gratis') && (
        <button type="button" onClick={onProsegui} className={`${LINK} mt-5`}>
          Preferisco prenotare comunque la chiamata
        </button>
      )}
    </div>
  )
}

/** Una domanda: le opzioni a un tocco, quelle multiple con «Avanti», o la frase libera che si può saltare. */
function Passo({
  domanda,
  porta,
  risposte,
  eco,
  avviso,
  frase,
  titolo,
  onScegli,
  onAlterna,
  onAvanti,
  onFrase,
  onConfermaFrase,
}: {
  domanda: Domanda
  porta: Porta
  risposte: Risposte
  eco: string
  avviso: string
  frase: string
  titolo: RefObject<HTMLHeadingElement | null>
  onScegli: (d: Domanda, valore: string) => void
  onAlterna: (d: DomandaMultipla, valore: string) => void
  onAvanti: () => void
  onFrase: (testo: string) => void
  onConfermaFrase: (salta: boolean) => void
}) {
  const testi = testiDi(domanda, porta, risposte)
  const data = risposte[domanda.id]
  const scelte = Array.isArray(data) ? data : []

  return (
    <div>
      {eco && <Eco testo={eco} />}
      <h1 ref={titolo} tabIndex={-1} className={`${TITOLO} text-[26px] leading-[1.18] md:text-[34px]`}>
        {testi.titolo}
      </h1>
      {testi.sotto && <p className="mt-2 font-body text-[16px] leading-relaxed text-fog-300 md:text-[17px]">{testi.sotto}</p>}

      {domanda.tipo === 'testo' ? (
        <div className="mt-6">
          <textarea
            value={frase}
            onChange={(e) => onFrase(e.target.value)}
            rows={domanda.max > 100 ? 4 : 2}
            maxLength={domanda.max}
            placeholder={domanda.segnaposto}
            aria-label={testi.titolo}
            className={`${CAMPO} resize-none leading-relaxed`}
          />
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
            <button type="button" disabled={!frase.trim()} onClick={() => onConfermaFrase(false)} className={`${BOTTONE} w-full sm:w-auto`}>
              <span className="relative z-10">Avanti</span>
              <ArrowRight className="relative z-10 h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => onConfermaFrase(true)} className={LINK}>
              {domanda.id === 'dolore' ? 'Preferisco dirlo in chiamata' : 'Salta'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-2.5" role={domanda.tipo === 'scelta' ? 'radiogroup' : 'group'} aria-label={testi.titolo}>
          {domanda.opzioni.map((o, i) => {
            const scelta = domanda.tipo === 'scelta' ? data === o : scelte.includes(o)
            return (
              <button
                key={o}
                type="button"
                role={domanda.tipo === 'scelta' ? 'radio' : 'checkbox'}
                aria-checked={scelta}
                onClick={() => (domanda.tipo === 'scelta' ? onScegli(domanda, o) : onAlterna(domanda, o))}
                className={`flex min-h-[56px] w-full items-center gap-3.5 rounded-xl border px-4 py-3 text-left font-body text-[17px] font-medium leading-snug transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/60 ${
                  scelta ? 'border-lime-500 bg-lime-500/10 text-white' : 'border-white/[0.12] bg-navy-800/70 text-fog-100 hover:border-lime-500/50 hover:bg-navy-800'
                }`}
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center border text-[14px] font-bold transition ${domanda.tipo === 'scelta' ? 'rounded-md' : 'rounded-[6px]'} ${
                    scelta ? 'border-lime-500 bg-lime-500 text-navy-950' : 'border-white/[0.18] bg-navy-950 text-fog-300'
                  }`}
                  aria-hidden="true"
                >
                  {scelta ? <Check className="h-4 w-4" strokeWidth={3} /> : LETTERE[i]}
                </span>
                <span className="flex-1">{o}</span>
              </button>
            )
          })}
        </div>
      )}

      {avviso && (
        <p className="mt-4 rounded-lg bg-lime-500/10 px-3 py-2 font-body text-[15px] font-medium text-lime-400 ring-1 ring-lime-500/30" role="alert">
          {avviso}
        </p>
      )}

      {domanda.tipo === 'multipla' && (
        <button type="button" disabled={!scelte.length} onClick={onAvanti} className={`${BOTTONE} mt-5 w-full sm:w-auto`}>
          <span className="relative z-10">Avanti</span>
          <ArrowRight className="relative z-10 h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

function Eco({ testo }: { testo: string }) {
  return (
    <p role="status" className="mb-6 flex items-start gap-2.5 rounded-xl bg-navy-800 px-4 py-3 font-body text-[15px] leading-relaxed text-fog-100 ring-1 ring-white/[0.08] md:text-[16px]">
      <Check className="mt-1 h-4 w-4 shrink-0 text-lime-500" strokeWidth={3} aria-hidden="true" />
      <span>{testo}</span>
    </p>
  )
}

/** Il calendario di Calendly dentro la pagina: si prenota qui. Senza l'evento (solo nell'anteprima) resta il suo posto. */
function Calendario({ porta, risposte }: { porta: Porta; risposte: Risposte }) {
  const [altezza, setAltezza] = useState<number | null>(null)
  const indirizzo = linkCalendly(CALENDLY_CONSULENZA, porta, risposte, typeof window === 'undefined' ? '' : window.location.host)

  // Calendly dice quanto è alta la sua pagina (misurato il 26/10: 602 px sul telefono, 660 sul computer col mese; prima
  // due messaggi da 26 e 2 px, che si scartano): il calendario si allunga e si scorre la pagina sola, non due riquadri.
  useEffect(() => {
    const ascolta = (e: MessageEvent) => {
      if (e.origin !== CALENDLY) return
      const m = (e.data ?? {}) as MessaggioCalendly
      if (m.event !== 'calendly.page_height') return
      const h = parseInt(String(m.payload?.height ?? ''), 10)
      if (h >= 400 && h <= 2400) setAltezza(h)
    }
    window.addEventListener('message', ascolta)
    return () => window.removeEventListener('message', ascolta)
  }, [])

  if (!indirizzo)
    return (
      <div className="mt-4 grid min-h-[320px] place-items-center rounded-2xl border-2 border-dashed border-white/25 px-6 py-10 text-center font-body text-[16px] leading-relaxed text-fog-100">
        Qui c&apos;è il calendario di Calendly per scegliere giorno e ora. Manca ancora il link dell&apos;evento da 20 minuti.
      </div>
    )
  return (
    <iframe
      src={indirizzo}
      title="Calendario per prenotare la consulenza gratuita"
      className="mt-4 block h-[640px] w-full rounded-2xl bg-white md:h-[700px]"
      style={altezza ? { height: altezza } : undefined}
    />
  )
}
