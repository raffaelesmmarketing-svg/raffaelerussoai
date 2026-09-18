'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Rise from './Rise'
import { faq } from './dati'

function Voce({ q, a, aperta, onToggle, id }: { q: string; a: string; aperta: boolean; onToggle: () => void; id: string }) {
  const ridotto = useReducedMotion()
  return (
    <div className="border-b border-white/[0.12] last:border-0">
      <button
        onClick={onToggle}
        aria-expanded={aperta}
        aria-controls={`${id}-r`}
        id={`${id}-d`}
        className="w-full flex items-start justify-between gap-6 py-5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-500/60 rounded-sm"
      >
        <span className="font-display font-bold text-[17px] text-white group-hover:text-lime-500 transition-colors duration-200 leading-snug text-pretty">
          {q}
        </span>
        <span
          aria-hidden
          className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 mt-0.5 ${
            aperta ? 'border-lime-500 bg-lime-500/10 rotate-45' : 'border-white/25'
          }`}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" className={aperta ? 'text-lime-500' : 'text-fog-300'}>
            <path d="M5 1v8M1 5h8" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {aperta && (
          <motion.div
            id={`${id}-r`}
            role="region"
            aria-labelledby={`${id}-d`}
            initial={ridotto ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={ridotto ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={ridotto ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="overflow-hidden"
          >
            <p className="font-body text-[16px] leading-[1.7] text-fog-300 pb-5 pr-10 max-w-[62ch] text-pretty">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Faq() {
  const [aperta, setAperta] = useState<number | null>(0)
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 grid md:grid-cols-[5fr_7fr] gap-10 md:gap-16 items-start">
        <Rise>
          <h2
            className="font-display font-extrabold tracking-[-0.02em] leading-[1.08] text-white text-balance"
            style={{ fontSize: 'clamp(30px, 3.6vw, 46px)' }}
          >
            Domande più frequenti.
          </h2>
          <p className="font-body text-[16px] leading-[1.7] text-fog-300 mt-4 max-w-[40ch]">
            Se la tua non c’è, la facciamo nei 20 minuti.
          </p>
        </Rise>
        <Rise delay={0.1}>
          <div className="border-t border-white/[0.12]">
            {faq.map((f, i) => (
              <Voce key={f.q} id={`faq-${i}`} q={f.q} a={f.a} aperta={aperta === i} onToggle={() => setAperta(aperta === i ? null : i)} />
            ))}
          </div>
        </Rise>
      </div>
    </section>
  )
}
