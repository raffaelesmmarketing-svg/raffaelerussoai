import type { Metadata } from 'next'
import NewsletterCTA from '@/components/sections/NewsletterCTA'

export const metadata: Metadata = {
  title: 'Chi Sono',
  description: "Sono Raffaele Russo, imprenditore italiano che spiega l'AI in modo semplice e concreto. Co-founder di Cantieri Hub.",
}

export default function ChiSonoPage() {
  return (
    <div className="pt-24">
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div className="bg-gray-100 rounded-2xl aspect-square w-full sticky top-24" />
          <div>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">
              Chi Sono
            </p>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Raffaele Russo
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-4">
              Ho 27 anni, sono italiano e vivo a Lisbona. Co-fondo Cantieri Hub,
              il software AI per le imprese edili italiane.
            </p>
            <p className="text-gray-500 leading-relaxed mb-4">
              Non sono partito da un background tecnico. Sono partito da un problema
              reale — come aiutare le imprese tradizionali a restare competitive —
              e ho imparato l&apos;AI per risolverlo. Ora faccio la stessa cosa
              per altri imprenditori.
            </p>
            <p className="text-gray-500 leading-relaxed mb-4">
              La mia filosofia: l&apos;AI non è complicata, è solo spiegata male.
              Ogni strumento che racconto su questo sito lo ho usato, testato e
              applicato sul campo.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              Valori: lealtà, umiltà, ambizione. Motto: spingere.
            </p>

            <div className="border-t border-gray-100 pt-8">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Con cui lavoro
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>→ Cantieri Hub — Co-founder</li>
                <li>→ Imprenditori che vogliono usare l&apos;AI nel loro business</li>
                <li>→ Aziende che cercano formazione pratica sull&apos;AI</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <NewsletterCTA />
    </div>
  )
}