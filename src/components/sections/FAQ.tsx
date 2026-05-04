'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal from '@/components/Reveal'

const faqs = [
  {
    q: "Non ho nessuna esperienza con l'AI. Posso partecipare comunque?",
    a: "Sì, è esattamente per questo che esisto. Non parto da ChatGPT avanzato — parto da zero e arrivo agli strumenti concreti per il tuo settore specifico. Se sai usare WhatsApp, puoi usare l'AI.",
  },
  {
    q: "Quanto tempo ci vuole per vedere i primi risultati?",
    a: "Di solito 1-2 settimane dalla consulenza. Non vendo trasformazioni magiche: identifico 2-3 processi che puoi automatizzare subito con strumenti già esistenti. Il ROI medio dei miei clienti è visibile entro il primo mese.",
  },
  {
    q: "Quanto costa usare gli strumenti AI che consigli?",
    a: "La maggior parte dei tool che uso e consiglio costano tra €20 e €100 al mese. Nella consulenza ti mostro esattamente cosa usare, quanto costa, e quanto recuperi in tempo.",
  },
  {
    q: 'La consulenza è online o in presenza?',
    a: 'Online, via Google Meet o Zoom. 60 minuti, registrazione inclusa così puoi rivedere tutto. Lavoro con imprenditori da tutta Italia e dall\'estero.',
  },
  {
    q: 'Cosa succede se il mio settore è molto specifico o tradizionale?',
    a: "Meglio così. Il 90% dei miei clienti viene da settori tradizionali: edilizia, legale, contabilità, manifattura. Sono i settori dove l'AI fa la differenza più grande perché i processi sono ancora manuali.",
  },
  {
    q: 'Posso comprare un corso invece della consulenza?',
    a: "Presto sì — sto costruendo la scuola online. Per ora il modo più diretto per iniziare è la consulenza 1:1 o la newsletter gratuita. Iscriviti e ti avviso quando la scuola è pronta.",
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