'use client'

import { motion } from 'framer-motion'
import Reveal from '@/components/Reveal'

const testimonials = [
  {
    quote: "Raffaele mi ha fatto capire in 60 minuti quello che non avevo capito in 2 anni di articoli e podcast sull'AI. Concreto, diretto, zero gergo inutile.",
    name: 'Marco T.',
    role: 'Titolare, Studio di Architettura',
    initial: 'M',
  },
  {
    quote: "Ho implementato il primo strumento AI nella mia azienda la settimana stessa dopo la consulenza. Risparmio 3 ore al giorno. Difficile credere che prima non lo usassi.",
    name: 'Giulia R.',
    role: 'CEO, E-commerce Fashion',
    initial: 'G',
  },
  {
    quote: "Finalmente qualcuno che parla di AI come un imprenditore e non come un ingegnere. I suoi contenuti sono gli unici che seguo davvero.",
    name: 'Andrea M.',
    role: 'Commercialista, Studio Associato',
    initial: 'A',
  },
  {
    quote: "La newsletter è la prima cosa che leggo il lunedì mattina. Ogni settimana c'è qualcosa di applicabile subito al mio business.",
    name: 'Luca P.',
    role: 'Imprenditore, Settore Edile',
    initial: 'L',
  },
  {
    quote: "Pensavo che l'AI fosse roba da grandi aziende. Raffaele mi ha dimostrato che con €50 al mese posso automatizzare metà del lavoro amministrativo.",
    name: 'Sara B.',
    role: 'Avvocato, Studio Legale',
    initial: 'S',
  },
  {
    quote: "Ho consigliato la consulenza a 4 colleghi. Tutti e 4 mi hanno ringraziato. Dice tutto.",
    name: 'Francesco D.',
    role: 'Direttore Commerciale',
    initial: 'F',
  },
]

function StarRow() {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#b8ff3d">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-32 border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-8">
        <Reveal className="text-center mb-16">
          <div className="eyebrow">Testimonianze</div>
          <h2
            className="font-display font-extrabold tracking-[-0.02em] mt-3 mb-3 text-white"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
          >
            Cosa dicono gli <em className="em-lime">imprenditori</em>
          </h2>
          <p className="font-body text-[17px] text-fog-300 max-w-[520px] mx-auto">
            Persone reali che hanno applicato concretamente quello che spiego.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4, borderColor: 'rgba(184,255,61,0.4)' }}
                transition={{ duration: 0.25 }}
                className="p-7 rounded-2xl bg-navy-800 border border-white/[0.08] flex flex-col h-full"
              >
                <StarRow />
                <p className="font-body text-[15px] leading-[1.65] text-fog-100 mb-6 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-white/[0.08]">
                  <div className="w-9 h-9 rounded-full bg-lime-500/20 border border-lime-500/30 flex items-center justify-center font-display font-extrabold text-sm text-lime-500">
                    {t.initial}
                  </div>
                  <div>
                    <p className="font-display font-bold text-sm text-white">{t.name}</p>
                    <p className="font-mono text-[11px] text-fog-500 tracking-wide">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}