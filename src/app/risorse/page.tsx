import type { Metadata } from 'next'
import SchedaGuida from '@/components/guide/SchedaGuida'
import { guide } from '@/lib/guide'

export const metadata: Metadata = {
  title: 'Risorse gratuite',
  description:
    "Guide pratiche e gratuite sull'intelligenza artificiale per professionisti e imprenditori italiani. Si scaricano in PDF, si leggono in dieci minuti.",
}

export default function RisorsePage() {
  return (
    <div className="pt-24">
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <div className="eyebrow">Gratis</div>
            <h1
              className="font-display font-extrabold tracking-[-0.02em] mt-3 mb-4 text-white"
              style={{ fontSize: 'clamp(36px, 4vw, 56px)' }}
            >
              Risorse <em className="em-lime">gratuite</em>
            </h1>
            <p className="font-body text-[17px] leading-[1.6] text-fog-300 max-w-xl mx-auto text-pretty">
              Guide pratiche sull&apos;AI, in PDF. Si leggono in una decina di minuti e si provano mentre le leggi: ti basta
              avere ChatGPT aperto.
            </p>
          </div>

          <div className={`grid md:grid-cols-2 gap-5 mx-auto ${guide.length >= 3 ? 'lg:grid-cols-3' : 'max-w-4xl'}`}>
            {guide.map((g) => (
              <SchedaGuida key={g.slug} guida={g} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
