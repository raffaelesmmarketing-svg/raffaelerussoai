import Reveal from '@/components/Reveal'
import { Zap, Clock, TrendingUp, Shield, Users, BookOpen } from 'lucide-react'

const tiles = [
  {
    icon: Zap,
    title: 'Risultati in 2 settimane',
    description: 'Non teoria. Piano d\'azione immediato con strumenti già pronti da usare.',
    size: 'large',
  },
  {
    icon: Clock,
    title: '3-10 ore risparmiate a settimana',
    description: 'Il tempo medio recuperato dai miei clienti nel primo mese.',
    size: 'small',
  },
  {
    icon: TrendingUp,
    title: 'ROI misurabile',
    description: 'Ogni strumento che consiglio ha un ROI calcolabile. Se non si ripaga, non te lo consiglio.',
    size: 'small',
  },
  {
    icon: Shield,
    title: 'Zero gergo tecnico',
    description: 'Parlo come un imprenditore a un altro imprenditore. Se non lo capisci, non ti è utile.',
    size: 'large',
  },
  {
    icon: Users,
    title: 'Per ogni settore',
    description: 'Edilizia, legale, contabilità, retail, manifattura. L\'AI funziona ovunque ci sono processi ripetitivi.',
    size: 'small',
  },
  {
    icon: BookOpen,
    title: 'Aggiornato ogni settimana',
    description: 'Il settore cambia velocemente. La newsletter ti tiene sempre sul pezzo.',
    size: 'small',
  },
]

export default function BentoFeatures() {
  return (
    <section className="py-32 border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-8">
        <Reveal className="text-center mb-16">
          <div className="eyebrow">Perché seguirmi</div>
          <h2
            className="font-display font-extrabold tracking-[-0.02em] mt-3 text-white"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
          >
            L&apos;AI che <em className="em-lime">funziona</em> davvero
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tiles.map((tile, i) => {
            const Icon = tile.icon
            const isLarge = tile.size === 'large'
            return (
              <Reveal
                key={i}
                delay={i * 0.07}
                className={isLarge ? 'md:col-span-2' : ''}
              >
                <div className={`group h-full p-7 rounded-2xl bg-navy-800 border border-white/[0.08] flex flex-col gap-4 transition-all duration-300 hover:border-lime-500/40 hover:bg-navy-700/60 ${isLarge ? 'md:flex-row md:items-center' : ''}`}>
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-lime-500">
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[18px] text-white mb-1.5">{tile.title}</h3>
                    <p className="font-body text-[14px] leading-[1.6] text-fog-300">{tile.description}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}