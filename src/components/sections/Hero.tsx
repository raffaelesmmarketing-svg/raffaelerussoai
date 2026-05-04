'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

const stagger = { animate: { transition: { staggerChildren: 0.12 } } }
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden">
      {/* Background */}
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute -top-[20%] -right-[10%] w-[70%] h-[120%]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(184,255,61,0.08), transparent 60%)',
            filter: 'blur(40px)',
          }}
        />
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full opacity-70"
        >
          <defs>
            <linearGradient id="heroNavy" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#0d2a82" stopOpacity="0.45" />
              <stop offset="1" stopColor="#08132e" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M1100,-50 Q1500,200 1500,800 L1500,1000 L800,1000 Q900,500 1100,-50Z" fill="url(#heroNavy)" />
          <path d="M1180,-30 Q1480,260 1490,820" stroke="#b8ff3d" strokeWidth="1.2" fill="none" opacity="0.55" />
          <path d="M1240,40 Q1430,320 1410,760" stroke="#b8ff3d" strokeWidth="0.8" fill="none" opacity="0.3" />
        </svg>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
          }}
        />
      </div>

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="relative z-10 max-w-[1200px] mx-auto px-8 w-full"
      >
        <motion.div variants={fadeUp}>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-500/10 border border-lime-500/30 font-mono text-xs uppercase tracking-[0.12em] text-lime-500 font-bold">
            <span
              className="w-1.5 h-1.5 rounded-full bg-lime-500"
              style={{ animation: 'pulseDot 2.4s ease-in-out infinite' }}
            />
            AI per Imprenditori
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-display font-extrabold leading-[1.02] tracking-[-0.025em] mt-6 mb-6 max-w-[1100px]"
          style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
        >
          L&apos;<em className="em-lime">AI</em> non è complicata.<br />
          È solo <em className="em-lime">spiegata male</em>.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="font-body text-[19px] leading-[1.6] text-fog-300 max-w-[640px] mb-10"
        >
          Sono Raffaele Russo. Trasformo il gergo tecnico dell&apos;intelligenza artificiale
          in strumenti concreti che gli imprenditori italiani usano davvero.
        </motion.p>

        <motion.div variants={fadeUp} className="flex gap-3.5 flex-wrap">
          <Link
            href="/risorse"
            className="cta-shimmer group inline-flex items-center gap-2.5 font-display font-extrabold text-sm tracking-[0.06em] uppercase bg-lime-500 text-navy-950 px-7 py-4 rounded-full no-underline shadow-glow-lime"
          >
            <span className="relative z-10">Scarica la guida gratuita</span>
            <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/chi-sono"
            className="inline-flex items-center gap-2.5 font-display font-bold text-sm tracking-[0.06em] uppercase text-white border border-white/20 hover:border-lime-500 hover:bg-lime-500/5 px-6 py-4 rounded-full no-underline transition-colors duration-300"
          >
            Chi sono
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
