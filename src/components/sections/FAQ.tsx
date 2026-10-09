'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal from '@/components/Reveal'

const faqs = [
  {
    q: "Non so niente di intelligenza artificiale. Fa per me?",
    a: "Sì, è proprio per te. Si parte dal tuo lavoro, non dalla tecnologia. Se sai usare WhatsApp, puoi usare l'AI.",
  },
  {
    q: 'Quanto costa la consulenza?',
    a: "Niente. È una chiamata gratuita di 20 minuti: mi racconti cosa rifai ogni settimana e ti dico da dove conviene cominciare. Se poi vuoi che lo costruiamo, ti dico subito quanto costa.",
  },
  {
    q: 'Come si svolge?',
    a: 'Online, in videochiamata, e la fai direttamente con me.',
  },
  {
    q: 'Quanto costano gli strumenti AI che consigli?',
    a: 'La maggior parte costa fra 20 e 100 € al mese. In chiamata ti dico cosa usare e quanto costa.',
  },
  {
    q: 'E se il mio settore è molto tradizionale?',
    a: "Meglio così. Nei settori tradizionali tanto lavoro si fa ancora a mano, ed è lì che l'AI fa la differenza più grande.",
  },
]

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-white/[0.08] last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-6 py-5 text-left group"
      >
        <span className="font-display font-bold text-[16px] text-white group-hover:text-lime-500 transition-colors duration-200 leading-snug">
          {q}
        </span>
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 mt-0.5 ${
            isOpen ? 'border-lime-500 bg-lime-500/10 rotate-45' : 'border-white/20'
          }`}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" className={isOpen ? 'text-lime-500' : 'text-fog-300'}>
            <path d="M5 1v8M1 5h8" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="overflow-hidden"
          >
            <p className="font-body text-[15px] leading-[1.7] text-fog-300 pb-5 pr-10">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-32 border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="grid md:grid-cols-[2fr_3fr] gap-16 items-start">
          <Reveal>
            <div className="eyebrow">FAQ</div>
            <h2
              className="font-display font-extrabold tracking-[-0.02em] mt-3 mb-4 text-white"
              style={{ fontSize: 'clamp(32px, 3.5vw, 48px)' }}
            >
              Domande <em className="em-lime">frequenti</em>
            </h2>
            <p className="font-body text-[16px] text-fog-300 leading-relaxed">
              Non trovi la risposta? Scrivimi direttamente.
            </p>
            <a
              href="mailto:raffaele.smmarketing@gmail.com"
              className="inline-flex items-center gap-2 font-display font-bold text-sm text-lime-500 mt-4 hover:gap-3 transition-all duration-200"
            >
              Contattami →
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl bg-navy-800 border border-white/[0.08] px-7 divide-y-0">
              {faqs.map((faq, i) => (
                <FAQItem
                  key={i}
                  q={faq.q}
                  a={faq.a}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}