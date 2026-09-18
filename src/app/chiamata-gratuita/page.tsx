import type { Metadata } from 'next'
import Hero from '@/components/landing/architetti/Hero'
import Chiamata from '@/components/landing/architetti/Chiamata'
import Richiesta from '@/components/landing/architetti/Richiesta'

const TITOLO = 'Chiamata gratuita: l’intelligenza artificiale nel tuo lavoro, in modo semplice'
const DESCRIZIONE =
  '20 minuti gratuiti con me: guardiamo cosa rifai ogni settimana e da dove conviene cominciare a usare l’intelligenza artificiale nel tuo lavoro.'

export const metadata: Metadata = {
  title: { absolute: `${TITOLO} | Raffaele Russo` },
  description: DESCRIZIONE,
  alternates: { canonical: '/chiamata-gratuita' },
  openGraph: { title: TITOLO, description: DESCRIZIONE, url: '/chiamata-gratuita', type: 'website', locale: 'it_IT' },
}

// Dove portano le guide gratuite: la stessa chiamata della landing per architetti, per qualunque
// professionista. Stessi blocchi e stesse parole; la richiesta arriva segnata con questa pagina.
export default function ChiamataGratuitaPage() {
  return (
    <>
      <Hero etichetta="Per professionisti e imprenditori" />
      <Chiamata />
      <Richiesta pagina="chiamata-gratuita" />
    </>
  )
}
