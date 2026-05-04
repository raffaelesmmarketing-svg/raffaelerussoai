import Reveal from '@/components/Reveal'

const items = [
  'Imprenditori',
  'Commercialisti',
  'Avvocati',
  'Architetti',
  'Manifattura',
  'Edilizia',
  'Retail',
  'E-commerce',
  'Studi Legali',
  'PMI italiane',
  'Agenzie',
  'Consulenti',
]

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const repeated = [...items, ...items, ...items]
  return (
    <div className="overflow-hidden py-2">
      <div
        className="flex gap-4 w-max"
        style={{
          animation: `marquee${reverse ? 'Reverse' : ''} 35s linear infinite`,
        }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/[0.08] bg-navy-800/60 font-mono text-xs tracking-[0.12em] uppercase text-fog-300 whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-lime-500/60" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Marquee() {
  return (
    <section className="py-16 border-t border-white/[0.08] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-8 mb-8">
        <Reveal className="text-center">
          <p className="eyebrow">Parla con imprenditori di ogni settore</p>
        </Reveal>
      </div>
      <div className="space-y-3">
        <MarqueeRow />
        <MarqueeRow reverse />
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        @keyframes marqueeReverse {
          from { transform: translateX(-33.333%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </section>
  )
}