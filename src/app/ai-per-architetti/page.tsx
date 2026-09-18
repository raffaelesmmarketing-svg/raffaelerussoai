import type { Metadata } from 'next'
import Hero from '@/components/landing/architetti/Hero'
import Perche from '@/components/landing/architetti/Perche'
import Esempi from '@/components/landing/architetti/Esempi'
import ChiSono from '@/components/landing/architetti/ChiSono'
import Chiamata from '@/components/landing/architetti/Chiamata'
import Recensioni from '@/components/landing/architetti/Recensioni'
import Faq from '@/components/landing/architetti/Faq'
import DueStrade from '@/components/landing/architetti/DueStrade'
import { faq } from '@/components/landing/architetti/dati'

const TITOLO = 'Intelligenza artificiale per architetti: cosa puoi fare davvero nel tuo studio'
const DESCRIZIONE =
  'Non ti serve un corso: ti serve qualcuno che ti mostri come montare l’intelligenza artificiale dentro il tuo lavoro — pratiche, documenti, clienti. Dieci esempi concreti e 20 minuti gratuiti per vederli sul tuo studio.'

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
      <Esempi />
      <ChiSono />
      <Chiamata />
      <Recensioni />
      <Faq />
      <DueStrade />
    </>
  )
}
