import Link from 'next/link'
import Reveal from '@/components/Reveal'

// L'invito in fondo a home, chi sono e articoli. L'unica offerta del sito, per ora, è la consulenza gratuita.
export default function ChiamataCTA() {
  return (
    <section className="py-32 border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-8">
        <Reveal className="text-center max-w-[620px] mx-auto">
          <div className="eyebrow">Consulenza gratuita</div>
          <h2
            className="font-display font-extrabold leading-[1.05] tracking-[-0.02em] mt-3 mb-4"
            style={{ fontSize: 'clamp(32px, 4.5vw, 52px)' }}
          >
            Partiamo dal tuo <em className="em-lime">lavoro</em>
          </h2>
          <p className="font-body text-[17px] leading-[1.6] text-fog-300 mb-9">
            In 20 minuti guardiamo cosa rifai ogni settimana e da dove conviene cominciare
            a usare l&apos;intelligenza artificiale.
          </p>
          <Link
            href="/chiamata-gratuita"
            className="cta-shimmer group inline-flex items-center gap-2.5 font-display font-extrabold text-sm tracking-[0.06em] uppercase bg-lime-500 text-navy-950 px-7 py-4 rounded-full no-underline shadow-glow-lime-sm"
          >
            <span className="relative z-10">Prenota la consulenza</span>
            <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
