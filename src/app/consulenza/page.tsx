import type { Metadata } from 'next'
import FAQ from '@/components/sections/FAQ'
import Testimonials from '@/components/sections/Testimonials'

export const metadata: Metadata = {
  title: 'Consulenza 1:1',
  description: "60 minuti con Raffaele Russo per capire come integrare l'AI nel tuo business. €199.",
}

const items = [
  "Analisi del tuo business e dei processi attuali",
  "Identificazione delle 3 aree prioritarie per l'AI",
  "Tool e strategie concrete adatte al tuo settore",
  "Piano d'azione step by step da implementare subito",
  "Follow-up email con tutte le risorse discusse",
]

export default function ConsulenzaPage() {
  return (
    <div className="pt-24">
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-[720px] mx-auto">

          <div className="text-center mb-12">
            <div className="eyebrow">Sessione 1:1</div>
            <h1
              className="font-display font-extrabold leading-[1.05] tracking-[-0.02em] mt-3 mb-4 text-white"
              style={{ fontSize: 'clamp(36px, 4vw, 56px)' }}
            >
              Consulenza con <em className="em-lime">Raffaele</em>
            </h1>
            <p className="font-body text-[17px] text-fog-300 max-w-lg mx-auto">
              60 minuti per uscire con un piano concreto su come usare l&apos;AI nel tuo business.
            </p>
            <div className="mt-4 font-display font-extrabold text-5xl text-lime-500 tracking-[-0.02em]">
              €199
            </div>
          </div>

          {/* Cosa include */}
          <div className="rounded-2xl bg-navy-800 border border-white/[0.08] p-8 mb-6">
            <h2 className="font-display font-bold text-[18px] text-white mb-5">Cosa include</h2>
            <ul className="space-y-3">
              {items.map(item => (
                <li key={item} className="flex items-start gap-3 font-body text-[15px] text-fog-300">
                  <span className="text-lime-500 mt-0.5 font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center">
            {/* Sostituire con link Calendly quando disponibile */}
            <a
              href="mailto:raffaele.smmarketing@gmail.com?subject=Consulenza 1:1 - Prenotazione"
              className="cta-shimmer group inline-flex items-center gap-2.5 font-display font-extrabold text-sm tracking-[0.06em] uppercase bg-lime-500 text-navy-950 px-8 py-4 rounded-full shadow-glow-lime"
            >
              <span className="relative z-10">Prenota la tua sessione</span>
              <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
            <p className="font-body text-sm text-fog-500 mt-3">
              Ti rispondo entro 24h con i prossimi slot disponibili.
            </p>
          </div>
        </div>
      </section>
      <Testimonials />
      <FAQ />
    </div>
  )
}