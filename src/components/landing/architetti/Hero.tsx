'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Cta from './Cta'
import { GrigliaTavola, Quota } from './Tavola'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function Hero() {
  const ridotto = useReducedMotion()
  const su = {
    initial: ridotto ? { opacity: 0 } : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
  }

  return (
    <section className="relative overflow-hidden pt-36 pb-14 sm:pt-44 sm:pb-20">
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute -top-[30%] right-[-20%] w-[80%] h-[120%]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(184,255,61,0.07), transparent 60%)', filter: 'blur(48px)' }}
        />
        <GrigliaTavola />
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.11 } } }}
        className="relative z-10 max-w-[1200px] mx-auto px-6 sm:px-8"
      >
        <motion.p variants={su} className="font-mono text-xs font-bold tracking-[0.16em] uppercase text-lime-500">
          Per architetti e studi di architettura
        </motion.p>

        <motion.h1
          variants={su}
          className="font-display font-extrabold leading-[1.04] tracking-[-0.025em] text-white mt-6 max-w-[19ch] text-balance"
          style={{ fontSize: 'clamp(34px, 5vw, 62px)' }}
        >
          Da un anno senti parlare di intelligenza artificiale. Intanto il collega che ne capiva meno di te{' '}
          <em className="em-lime">la usa già in studio.</em>
        </motion.h1>

        <motion.p
          variants={su}
          className="font-body text-[18px] sm:text-[20px] leading-[1.6] text-fog-100 mt-8 max-w-[58ch] text-pretty"
        >
          Non ti serve un corso. Non ti serve diventare tecnico. Ti serve qualcuno che la monti dentro il tuo
          lavoro — le pratiche, i documenti, i clienti — e ti insegni a usarla.
        </motion.p>

        <motion.div variants={su} className="mt-10">
          <Cta nota="Nessun impegno, nessun prezzo nascosto." />
        </motion.div>

        <motion.div variants={su} className="mt-16 sm:mt-20 max-w-[720px]">
          <Quota etichetta="4 incontri · 4 settimane · da solo o con lo studio" />
        </motion.div>
      </motion.div>
    </section>
  )
}
