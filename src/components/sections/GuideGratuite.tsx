import Link from 'next/link'
import Reveal from '@/components/Reveal'
import SchedaGuida from '@/components/guide/SchedaGuida'
import { guide } from '@/lib/guide'

// Le guide vere, da scaricare. Prende il posto del blocco che prometteva una guida che non esisteva.
export default function GuideGratuite() {
  return (
    <section id="guide" className="py-32 border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <Reveal className="flex justify-between items-end mb-12 flex-wrap gap-4">
          <div className="max-w-[640px]">
            <div className="eyebrow">Risorse gratuite</div>
            <h2
              className="font-display font-extrabold leading-[1.08] tracking-[-0.02em] mt-3 text-balance"
              style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
            >
              Guide pratiche, da <em className="em-lime">scaricare adesso</em>
            </h2>
            <p className="font-body text-[17px] leading-[1.6] text-fog-300 mt-4 text-pretty">
              Si leggono in una decina di minuti e si provano mentre le leggi: ti basta avere ChatGPT aperto.
            </p>
          </div>
          <Link href="/risorse" className="group font-display font-bold text-sm text-lime-500 no-underline hidden sm:block">
            Tutte le guide{' '}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>

        <div className={`grid md:grid-cols-2 gap-5 ${guide.length >= 3 ? 'lg:grid-cols-3' : 'max-w-4xl'}`}>
          {guide.map((g, i) => (
            <Reveal key={g.slug} delay={i * 0.1} className="h-full">
              <SchedaGuida guida={g} livello="h3" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
