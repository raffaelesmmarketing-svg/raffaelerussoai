import type { Metadata } from 'next'
import Candidatura from '@/components/consulenza/Candidatura'

// La candidatura alla consulenza gratuita (26/10/2026, Raffaele): la pagina del link in bio di @raffaelerusso.ai. Niente
// intestazione, piè di pagina e banner (lib/cornice.ts): chi arriva trova una cosa sola da fare. Le domande e i
// controlli stanno in lib/consulenza.ts, la rotta in app/api/consulenza.
export const metadata: Metadata = {
  title: { absolute: 'Consulenza gratuita · Raffaele Russo' },
  description:
    "20 minuti gratuiti sul tuo lavoro: dove l'intelligenza artificiale può aiutarti e da dove partire. Rispondi a qualche domanda e scegli tu giorno e ora.",
  alternates: { canonical: '/consulenza' },
  openGraph: {
    title: 'Consulenza gratuita · Raffaele Russo',
    description: "20 minuti gratuiti sul tuo lavoro: dove l'intelligenza artificiale può aiutarti e da dove partire.",
    url: '/consulenza',
    type: 'website',
    locale: 'it_IT',
  },
}

export default function ConsulenzaPage() {
  return <Candidatura />
}
