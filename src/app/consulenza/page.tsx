import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Consulenza 1:1',
  description: '60 minuti con Raffaele Russo per capire come integrare l\'AI nel tuo business. €199.',
}

export default function ConsulenzaPage() {
  return (
    <div className="pt-24">
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">
              Sessione 1:1
            </p>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Consulenza con Raffaele
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              60 minuti per uscire con un piano concreto su come usare l&apos;AI nel tuo business.
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-4">€199</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 mb-8">
            <h2 className="font-semibold text-gray-900 mb-4">Cosa include</h2>
            <ul className="space-y-3">
              {[
                'Analisi del tuo business e dei processi attuali',
                'Identificazione delle 3 aree prioritarie per l\'AI',
                'Tool e strategie concrete adatte al tuo settore',
                'Piano d\'azione step by step da implementare subito',
                'Follow-up email con tutte le risorse discusse',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            {/* Sostituire con link Calendly quando disponibile */}
            <a
              href="mailto:raffaele.smmarketing@gmail.com?subject=Consulenza 1:1 - Prenotazione"
              className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors text-lg"
            >
              Prenota la tua sessione →
            </a>
            <p className="text-sm text-gray-400 mt-3">
              Ti rispondo entro 24h con i prossimi slot disponibili.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}