'use client'

import { useLayoutEffect, useRef, type ReactNode } from 'react'

// Entrata allo scroll. Il contenuto è visibile di default (HTML servito, niente JS, motori di
// ricerca, anteprime): la classe che lo nasconde viene aggiunta solo sul client, prima del primo
// disegno, e tolta quando l'elemento entra nello schermo. Con «riduci movimento» resta la sola
// dissolvenza. Le classi stanno in globals.css (.rise / .rise-fade / .rise-in).
export default function Rise({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.style.transitionDelay = `${delay}s`
    el.classList.add(ridotto ? 'rise-fade' : 'rise')
    const mostra = () => {
      el.classList.add('rise-in')
      io.disconnect()
      clearTimeout(rete)
    }
    const io = new IntersectionObserver(
      (voci) => {
        if (voci.some((v) => v.isIntersecting)) mostra()
      },
      { threshold: 0.05, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    // Rete di sicurezza: qualunque cosa succeda all'osservatore, dopo quattro secondi il
    // contenuto è visibile comunque. Fuori schermo non si nota; dentro, evita un blocco vuoto.
    const rete = window.setTimeout(mostra, 4000)
    return () => {
      io.disconnect()
      clearTimeout(rete)
    }
  }, [delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
