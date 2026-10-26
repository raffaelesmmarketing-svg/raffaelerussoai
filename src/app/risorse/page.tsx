import type { Metadata } from 'next'
import ElencoGuide from '@/components/guide/ElencoGuide'

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
          <div className="text-center mb-10">
            <h1
              className="font-display font-extrabold tracking-[-0.02em] mb-4 text-white"
              style={{ fontSize: 'clamp(36px, 4vw, 56px)' }}
            >
              Risorse <em className="em-lime">gratuite</em>
            </h1>
            <p className="font-body text-[17px] leading-[1.6] text-fog-300 max-w-xl mx-auto text-pretty">
              Guide pratiche sull&apos;AI, in PDF. Si leggono in una decina di minuti e si provano mentre le leggi: ti basta
              avere ChatGPT o Claude aperto.
            </p>
          </div>

          <ElencoGuide />
        </div>
      </section>
    </div>
  )
}
