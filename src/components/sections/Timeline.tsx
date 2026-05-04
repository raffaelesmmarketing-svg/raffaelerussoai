import Reveal from '@/components/Reveal'

const events = [
  {
    year: '2018',
    title: 'Università abbandonata',
    description: 'Lascio Ingegneria. Non riuscivo a vedere il senso di studiare quello che volevo fare — meglio farlo direttamente.',
  },
  {
    year: '2019',
    title: 'Nasce Adact Studio',
    description: 'Fondo con il mio socio Dante la nostra agenzia di marketing. Primi clienti, prime campagne, primo business reale.',
  },
  {
    year: '2022',
    title: 'Lisbona',
    description: 'Mi trasferisco in Portogallo. Lavoro 100% da remoto, focus totale sulla crescita. La libertà geografica diventa un valore irrinunciabile.',
  },
  {
    year: '2024',
    title: 'Nasce Cantieri Hub',
    description: 'Co-fondo il software AI per le imprese edili italiane. È qui che capisco davvero come l\'AI trasforma un business tradizionale.',
  },
  {
    year: '2025',
    title: 'Personal brand AI',
    description: 'Inizio a raccontare quello che ho imparato. Il messaggio risuona: gli imprenditori italiani volevano capire l\'AI, ma nessuno gliela spiegava nella loro lingua.',
  },
  {
    year: '2026',
    title: 'La missione',
    description: 'Aiutare più imprenditori possibili a implementare l\'AI — non per inseguire una moda, ma per ritrovare tempo, energie e libertà di investirle in quello che conta davvero.',
  },
]

export default function Timeline() {
  return (
    <section className="py-32 border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-8">
        <Reveal className="mb-16">
          <div className="eyebrow">Il percorso</div>
          <h2
            className="font-display font-extrabold tracking-[-0.02em] mt-3 text-white"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
          >
            Da zero a <em className="em-lime">Cantieri Hub</em>
          </h2>
        </Reveal>

        <div className="relative">
          {/* Linea verticale */}
          <div className="absolute left-[7px] md:left-1/2 top-0 bottom-0 w-px bg-white/[0.08] -translate-x-1/2" />

          <div className="space-y-12">
            {events.map((ev, i) => {
              const isLeft = i % 2 === 0
              return (
                <Reveal key={i} delay={i * 0.1}>
                  <div className={`relative flex items-start gap-8 md:gap-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Dot */}
                    <div className="absolute left-0 md:left-1/2 top-1.5 w-3.5 h-3.5 rounded-full bg-lime-500 border-2 border-navy-950 -translate-x-1/2 z-10 shadow-glow-lime-sm" />

                    {/* Spacer lato opposto (desktop) */}
                    <div className="hidden md:block md:w-1/2" />

                    {/* Content */}
                    <div className={`pl-8 md:pl-0 md:w-1/2 ${isLeft ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
                      <span className="font-mono text-xs font-bold tracking-[0.14em] uppercase text-lime-500 mb-1 block">
                        {ev.year}
                      </span>
                      <h3 className="font-display font-bold text-[18px] text-white mb-1.5">{ev.title}</h3>
                      <p className="font-body text-[14px] leading-[1.65] text-fog-300">{ev.description}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}