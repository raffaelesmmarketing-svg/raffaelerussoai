import type { Metadata } from 'next'
import Hero from '@/components/landing/architetti/Hero'
import Perche from '@/components/landing/architetti/Perche'
import Diagnosi from '@/components/landing/architetti/Diagnosi'
import Ribaltamento from '@/components/landing/architetti/Ribaltamento'
import Esempi from '@/components/landing/architetti/Esempi'
import Percorso from '@/components/landing/architetti/Percorso'
import NienteTecnico from '@/components/landing/architetti/NienteTecnico'
import ChiSono from '@/components/landing/architetti/ChiSono'
import Prova from '@/components/landing/architetti/Prova'
import Chiamata from '@/components/landing/architetti/Chiamata'
import Faq from '@/components/landing/architetti/Faq'
import DueStrade from '@/components/landing/architetti/DueStrade'
import { faq } from '@/components/landing/architetti/dati'

const TITOLO = 'Intelligenza artificiale per architetti: il percorso in 4 incontri'
const DESCRIZIONE =
  'Non un corso da guardare: 4 incontri in cui montiamo l’intelligenza artificiale dentro il lavoro del tuo studio — pratiche, documenti, clienti — senza che tu diventi un tecnico. Prenota 20 minuti gratuiti.'

export const metadata: Metadata = {
  title: { absolute: `${TITOLO} | Raffaele Russo` },
  description: DESCRIZIONE,
  alternates: { canonical: '/ai-per-architetti' },
  openGraph: {
    title: TITOLO,
    description: DESCRIZIONE,
    url: '/ai-per-architetti',
    type: 'website',
    locale: 'it_IT',
  },
  twitter: { card: 'summary_large_image', title: TITOLO, description: DESCRIZIONE },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function AiPerArchitettiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Perche />
      <Diagnosi />
      <Ribaltamento />
      <Esempi />
      <Percorso />
      <NienteTecnico />
      <ChiSono />
      <Prova />
      <Chiamata />
      <Faq />
      <DueStrade />
    </>
  )
}
