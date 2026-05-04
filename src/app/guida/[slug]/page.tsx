import type { Metadata } from 'next'
import EmailForm from '@/components/ui/EmailForm'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `Guida Gratuita — ${slug}`,
    description: 'Scarica la guida gratuita sull\'AI per il tuo business.',
  }
}

export default async function GuidaLandingPage({ params }: Props) {
  const { slug } = await params

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-20">
      <div className="max-w-lg w-full text-center">
        <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-4">
          Gratis
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          [Titolo guida: {slug}]
        </h1>
        <p className="text-gray-500 mb-8">
          [Descrizione della guida — cosa impara il lettore, perché è utile,
          che risultato concreto ottiene in quanto tempo.]
        </p>
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <ul className="text-sm text-gray-600 space-y-2 text-left">
            {['Punto 1 di valore', 'Punto 2 di valore', 'Punto 3 di valore'].map(p => (
              <li key={p} className="flex items-center gap-2">
                <span className="text-blue-600">✓</span> {p}
              </li>
            ))}
          </ul>
        </div>
        <EmailForm buttonLabel="Inviamela gratis →" />
        <p className="text-xs text-gray-400 mt-3">
          Niente spam. Disiscrizione in un click.
        </p>
      </div>
    </div>
  )
}
