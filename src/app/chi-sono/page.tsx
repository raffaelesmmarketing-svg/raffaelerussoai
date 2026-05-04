import type { Metadata } from 'next'
import Link from 'next/link'
import NewsletterCTA from '@/components/sections/NewsletterCTA'

export const metadata: Metadata = {
  title: 'Chi Sono',
  description: "Sono Raffaele Russo, imprenditore italiano che spiega l'AI in modo semplice e concreto. Co-founder di Cantieri Hub.",
}

export default function ChiSonoPage() {
  return (
    <div className="pt-24">
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-[5fr_6fr] gap-16 items-start">

          {/* Foto */}
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/[0.08] sticky top-24">
            <img
              src="/images/portrait.jpg"
              alt="Raffaele Russo"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute left-4 bottom-4 px-3 py-1.5 rounded-full bg-navy-950/60 backdrop-blur-md border border-white/10 font-mono text-[11px] tracking-[0.12em] uppercase text-fog-300">
              Lisbona · 2026
            </div>
          </div>

          {/* Testo */}
          <div>
            <div className="eyebrow">Chi sono</div>
            <h1
              className="font-display font-extrabold leading-[1.05] tracking-[-0.02em] mt-4 mb-6 text-white"
              style={{ fontSize: 'clamp(36px, 4vw, 56px)' }}
            >
              Raffaele <em className="em-lime">Russo</em>
            </h1>

            <p className="font-body text-[17px] leading-[1.65] text-fog-300 mb-4">
              Ho 27 anni, sono italiano e vivo a Lisbona. Co-fondo{' '}
              <strong className="text-white">Cantieri Hub</strong>, il software AI
              per le imprese edili italiane.
            </p>
            <p className="font-body text-[17px] leading-[1.65] text-fog-300 mb-4">
              Non sono partito da un background tecnico. Sono partito da un problema
              reale — come aiutare le imprese tradizionali a restare competitive —
              e ho imparato l&apos;AI per risolverlo. Ora faccio la stessa cosa
              per altri imprenditori.
            </p>
            <p className="font-body text-[17px] leading-[1.65] text-fog-300 mb-4">
              La mia filosofia: l&apos;AI non è complicata, è solo spiegata male.
              Ogni strumento che racconto su questo sito lo ho usato, testato e
              applicato sul campo.
            </p>
            <p className="font-body text-[17px] leading-[1.65] text-fog-300 mb-8">
              Valori: <em className="em-lime">lealtà</em>, umiltà, ambizione.
              Motto: <em className="em-lime">Spingere</em>.
            </p>

            <div className="border-t border-white/[0.08] pt-8 mb-8">
              <div className="eyebrow mb-4">Con chi lavoro</div>
              <ul className="space-y-2.5">
                {[
                  'Cantieri Hub — Co-founder',
                  "Imprenditori che vogliono usare l'AI nel loro business",
                  "Aziende che cercano formazione pratica sull'AI",
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 font-body text-sm text-fog-300">
                    <span className="text-lime-500 mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/lavoriamo-insieme"
              className="cta-shimmer group inline-flex items-center gap-2 font-display font-extrabold text-sm tracking-[0.06em] uppercase bg-lime-500 text-navy-950 px-6 py-3 rounded-full no-underline shadow-glow-lime-sm"
            >
              <span className="relative z-10">Lavoriamo insieme</span>
              <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      <NewsletterCTA />
    </div>
  )
}
