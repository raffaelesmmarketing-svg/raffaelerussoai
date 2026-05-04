import Reveal from '@/components/Reveal'

const stats = [
  { v: '50K+',   l: 'Follower' },
  { v: '200+',   l: 'Imprenditori aiutati' },
  { v: '3 Anni', l: 'Nel settore' },
  { v: '100+',   l: 'Contenuti' },
]

export default function SocialProof() {
  return (
    <section className="border-y border-white/[0.08] py-10 bg-white/[0.015]">
      <div className="max-w-[1200px] mx-auto px-8">
        <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`text-center py-2 ${i < 3 ? 'md:border-r md:border-white/[0.08]' : ''}`}
            >
              <div className="font-display font-extrabold text-4xl tracking-[-0.03em] text-white">{s.v}</div>
              <div className="font-mono text-xs font-semibold tracking-[0.12em] uppercase text-fog-500 mt-1.5">{s.l}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
