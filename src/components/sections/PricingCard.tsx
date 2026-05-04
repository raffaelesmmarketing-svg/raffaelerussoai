import Reveal from '@/components/Reveal'
import Link from 'next/link'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Newsletter',
    price: 'Gratis',
    period: 'per sempre',
    description: 'Il punto di partenza per ogni imprenditore che vuole capire l\'AI.',
    features: [
      '1 email a settimana',
      'Casi studio reali',
      'Tool e strategie pratiche',
      'Accesso agli archivi',
    ],
    cta: 'Iscriviti gratis',
    href: '#newsletter',
    highlight: false,
  },
  {
    name: 'Consulenza 1:1',
    price: '€199',
    period: 'sessione unica',
    description: '60 minuti per uscire con un piano concreto su misura per il tuo business.',
    features: [
      'Analisi del tuo business',
      '3 aree prioritarie identificate',
      'Piano d\'azione step by step',
      'Tool consigliati per il tuo settore',
      'Follow-up email con risorse',
      'Registrazione della sessione',
    ],
    cta: 'Prenota la sessione',
    href: '/consulenza',
    highlight: true,
  },
  {
    name: 'Scuola AI',
    price: 'Presto',
    period: 'in costruzione',
    description: 'Percorso formativo completo per portare l\'AI nel tuo business.',
    features: [
      'Corsi video step by step',
      'Template e risorse pratiche',
      'Community di imprenditori',
      'Aggiornamenti continui',
    ],
    cta: 'Avvisami quando apre',
    href: '#newsletter',
    highlight: false,
  },
]

export default function PricingCard() {
  return (
    <section className="py-32 border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-8">
        <Reveal className="text-center mb-16">
          <div className="eyebrow">Offerta</div>
          <h2
            className="font-display font-extrabold tracking-[-0.02em] mt-3 mb-3 text-white"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
          >
            Inizia da dove <em className="em-lime">vuoi</em>
          </h2>
          <p className="font-body text-[17px] text-fog-300 max-w-[480px] mx-auto">
            Gratis per capire, a pagamento per accelerare.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5 items-start">
          {plans.map((plan, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className={`relative p-8 rounded-2xl flex flex-col h-full border transition-all duration-300 ${
                plan.highlight
                  ? 'bg-navy-700 border-lime-500/50 shadow-glow-lime'
                  : 'bg-navy-800 border-white/[0.08]'
              }`}>
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full font-mono text-[10px] tracking-[0.14em] uppercase font-bold bg-lime-500 text-navy-950">
                      Più scelto
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="eyebrow mb-3">{plan.name}</div>
                  <div className="flex items-end gap-2 mb-1">
                    <span className={`font-display font-extrabold tracking-[-0.03em] ${plan.highlight ? 'text-lime-500' : 'text-white'}`}
                      style={{ fontSize: 'clamp(32px, 3.5vw, 44px)' }}>
                      {plan.price}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-fog-500 uppercase tracking-widest mb-3">{plan.period}</p>
                  <p className="font-body text-[14px] text-fog-300 leading-relaxed">{plan.description}</p>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 font-body text-[14px] text-fog-300">
                      <Check size={14} className="text-lime-500 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`w-full inline-flex items-center justify-center gap-2 font-display font-extrabold text-sm tracking-[0.06em] uppercase px-6 py-3.5 rounded-full no-underline transition-all duration-200 ${
                    plan.highlight
                      ? 'cta-shimmer bg-lime-500 text-navy-950 shadow-glow-lime-sm'
                      : 'border border-white/20 text-white hover:border-lime-500 hover:text-lime-500'
                  }`}
                >
                  {plan.cta} →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}