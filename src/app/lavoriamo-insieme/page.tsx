import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageSquare, Building2, Megaphone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Lavoriamo Insieme',
  description: 'Consulenza 1:1, formazione aziendale e collaborazioni sponsorizzate con Raffaele Russo.',
}

const services = [
  {
    id: 'consulenza',
    Icon: MessageSquare,
    title: 'Consulenza 1:1',
    price: '€199',
    description: '60 minuti con me per analizzare il tuo business e identificare dove e come l\'AI può farti risparmiare tempo, automatizzare processi e aumentare il fatturato.',
    items: [
      "Analisi del tuo business attuale",
      "Identificazione delle 3 aree prioritarie per l'AI",
      "Piano d'azione concreto step by step",
      "Follow-up email con risorse e tool consigliati",
    ],
    cta: 'Prenota la sessione',
    href: '/consulenza',
    isLink: true,
  },
  {
    id: 'formazione',
    Icon: Building2,
    title: 'Formazione Aziendale',
    price: 'Su richiesta',
    description: "Workshop e percorsi formativi sull'AI per team aziendali. Pratico, concreto, costruito sul vostro settore specifico. Niente slide teoriche — solo cose che il team può applicare dal giorno dopo.",
    items: [],
    cta: 'Richiedi un preventivo',
    href: 'mailto:raffaele.smmarketing@gmail.com?subject=Formazione Aziendale',
    isLink: false,
  },
  {
    id: 'sponsorizzazioni',
    Icon: Megaphone,
    title: 'Contenuti Sponsorizzati',
    price: 'Su richiesta',
    description: "Collaboro solo con brand e tool che ho usato e che consiglierei anche senza compenso. Il mio pubblico è fatto di imprenditori italiani attivi — niente curiosi, solo persone che vogliono usare l'AI nel loro business.",
    items: [],
    cta: 'Scrivimi',
    href: 'mailto:raffaele.smmarketing@gmail.com?subject=Collaborazione Sponsorizzata',
    isLink: false,
  },
]

export default function LavoriamoInsiemePage() {
  return (
    <div className="pt-24">
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">

          <div className="mb-14">
            <div className="eyebrow">Lavoriamo Insieme</div>
            <h1
              className="font-display font-extrabold tracking-[-0.02em] mt-3 mb-4 text-white"
              style={{ fontSize: 'clamp(36px, 4vw, 56px)' }}
            >
              Come posso <em className="em-lime">aiutarti</em>
            </h1>
            <p className="font-body text-[17px] text-fog-300 max-w-xl">
              Tre modi per lavorare insieme, a seconda di dove sei e cosa ti serve.
            </p>
          </div>

          <div className="space-y-5">
            {services.map(s => {
              const Icon = s.Icon
              return (
                <div
                  key={s.id}
                  id={s.id}
                  className="p-8 rounded-2xl bg-navy-800 border border-white/[0.08]"
                >
                  <div className="flex items-start justify-between mb-5 flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-lime-500/10 border border-lime-500/25 rounded-xl flex items-center justify-center text-lime-500">
                        <Icon size={22} strokeWidth={2} />
                      </div>
                      <h2 className="font-display font-extrabold text-[22px] text-white">{s.title}</h2>
                    </div>
                    <span className="font-mono text-sm font-bold text-lime-500 px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/25">
                      {s.price}
                    </span>
                  </div>

                  <p className="font-body text-[16px] leading-[1.65] text-fog-300 mb-4">
                    {s.description}
                  </p>

                  {s.items.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {s.items.map(item => (
                        <li key={item} className="flex items-start gap-2 font-body text-sm text-fog-300">
                          <span className="text-lime-500 mt-0.5">→</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {s.isLink ? (
                    <Link
                      href={s.href}
                      className="cta-shimmer group inline-flex items-center gap-2 font-display font-extrabold text-sm tracking-[0.06em] uppercase bg-lime-500 text-navy-950 px-6 py-3 rounded-full no-underline shadow-glow-lime-sm mt-2"
                    >
                      <span className="relative z-10">{s.cta}</span>
                      <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </Link>
                  ) : (
                    <a
                      href={s.href}
                      className="group inline-flex items-center gap-2 font-display font-bold text-sm tracking-[0.06em] uppercase text-white border border-white/20 hover:border-lime-500 hover:text-lime-500 px-6 py-3 rounded-full no-underline transition-colors duration-200 mt-2"
                    >
                      {s.cta} →
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
