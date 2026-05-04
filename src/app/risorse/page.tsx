import type { Metadata } from 'next'
import EmailForm from '@/components/ui/EmailForm'

export const metadata: Metadata = {
  title: 'Risorse Gratis',
  description: "Guide, ebook e tool gratuiti sull'AI per imprenditori italiani. Scarica gratis in cambio della tua email.",
}

const risorse = [
  {
    title: '[Titolo Guida 1]',
    description: '[Descrizione di cosa impara il lettore e qual è il risultato concreto.]',
    category: 'AI',
    badge: 'Guida PDF',
  },
  {
    title: '[Titolo Guida 2]',
    description: '[Descrizione di cosa impara il lettore e qual è il risultato concreto.]',
    category: 'Tool',
    badge: 'Checklist',
  },
]

export default function RisorsePage() {
  return (
    <div className="pt-24">
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">
              Gratis
            </p>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Risorse Gratuite</h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              Guide, checklist e tool pratici sull&apos;AI. Scaricali gratis — ti chiedo solo l&apos;email.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {risorse.map(risorsa => (
              <div key={risorsa.title} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 h-40 flex items-center justify-center">
                  <span className="text-4xl">📄</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {risorsa.category}
                    </span>
                    <span className="text-xs text-gray-400">{risorsa.badge}</span>
                  </div>
                  <h2 className="font-semibold text-gray-900 mb-2">{risorsa.title}</h2>
                  <p className="text-sm text-gray-500 mb-6">{risorsa.description}</p>
                  <EmailForm />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}