import Reveal from '@/components/Reveal'
import Link from 'next/link'
import { MessageSquare, Building2, Play } from 'lucide-react'

const services = [
  {
    Icon: MessageSquare,
    title: 'Consulenza 1:1',
    price: '€199',
    desc: "Una sessione di 60 minuti per mappare i 3 processi della tua azienda dove l'AI ha più impatto. Ricevi un piano d'azione concreto.",
    cta: 'Prenota una call',
    href: '/consulenza',
  },
  {
    Icon: Building2,
    title: 'Formazione Aziendale',
    price: 'Su richiesta',
    desc: 'Workshop in azienda per il tuo team. Mezza giornata o due giornate, in italiano, su misura per il tuo settore.',
    cta: 'Richiedi un preventivo',
    href: '/lavoriamo-insieme#formazione',
  },
  {
    Icon: Play,
    title: 'Contenuti Sponsorizzati',
    price: 'Su richiesta',
    desc: 'Integrazione del tuo prodotto AI nei miei video e newsletter. Audience: 50K+ imprenditori italiani.',
    cta: 'Scrivimi',
    href: '/lavoriamo-insieme#sponsorizzazioni',
  },
]

export default function WorkTogether() {
  return (
    <section id="lavoro" className="py-32 border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-8">
        <Reveal className="text-center mb-16">
          <div className="eyebrow">Lavoriamo Insieme</div>
          <h2
            className="font-display font-extrabold tracking-[-0.02em] mt-3 mb-3"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
          >
            Come posso <em className="em-lime">aiutarti</em>
          </h2>
          <p className="font-body text-[17px] text-fog-300 max-w-[560px] mx-auto">
            Tre modi concreti per portare l&apos;AI nella tua azienda. Senza rischio, senza gergo.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {services.map((s, i) => {
            const Icon = s.Icon
            return (
              <Reveal key={i} delay={i * 0.12}>
                <div className="group h-full p-8 rounded-[20px] bg-navy-800 border border-white/[0.08] flex flex-col transition-all duration-300 hover:border-lime-500 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(184,255,61,0.18),0_16px_40px_rgba(184,255,61,0.08)]">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-lime-500/10 border border-lime-500/25 text-lime-500 mb-5">
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <div className="flex justify-between items-center gap-3 mb-3">
                    <h3 className="font-display font-extrabold text-[22px] text-white">{s.title}</h3>
                    <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-lime-500 font-bold whitespace-nowrap px-2.5 py-1 rounded-full bg-lime-500/10 border border-lime-500/25">
                      {s.price}
                    </span>
                  </div>
                  <p className="font-body text-[15px] leading-[1.6] text-fog-300 mb-7 flex-1">{s.desc}</p>
                  <Link
                    href={s.href}
                    className="font-display font-bold text-sm text-lime-500 no-underline inline-flex items-center gap-2 group-hover:gap-3 transition-all duration-200"
                  >
                    {s.cta} →
                  </Link>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}