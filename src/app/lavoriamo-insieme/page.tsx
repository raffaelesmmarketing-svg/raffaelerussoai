import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageSquare, Building2, Megaphone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Lavoriamo Insieme',
  description: 'Consulenza 1:1, formazione aziendale e collaborazioni sponsorizzate con Raffaele Russo.',
}

export default function LavoriamoInsiemePage() {
  return (
    <div className="pt-24">
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-14">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">
              Lavoriamo Insieme
            </p>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Come posso aiutarti</h1>
            <p className="text-gray-500 max-w-xl">
              Tre modi per lavorare insieme, a seconda di dove sei e cosa ti serve.
            </p>
          </div>

          <div className="space-y-8">
            <div id="consulenza" className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <MessageSquare size={20} className="text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Consulenza 1:1</h2>
                </div>
                <span className="text-lg font-bold text-gray-900">€199</span>
              </div>
              <p className="text-gray-500 mb-4 leading-relaxed">
                60 minuti con me per analizzare il tuo business e identificare dove e come
                l&apos;AI può farti risparmiare tempo, automatizzare processi e aumentare il fatturato.
                Porti il problema, io porto le soluzioni concrete.
              </p>
              <ul className="text-sm text-gray-500 space-y-1.5 mb-6">
                <li>→ Analisi del tuo business attuale</li>
                <li>→ Identificazione delle 3 aree prioritarie per l&apos;AI</li>
                <li>→ Piano d&apos;azione concreto step by step</li>
                <li>→ Follow-up email con risorse e tool consigliati</li>
              </ul>
              <Link
                href="/consulenza"
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Prenota la sessione →
              </Link>
            </div>

            <div id="formazione" className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Building2 size={20} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Formazione Aziendale</h2>
              </div>
              <p className="text-gray-500 mb-4 leading-relaxed">
                Workshop e percorsi formativi sull&apos;AI per team aziendali. Pratico, concreto,
                costruito sul vostro settore specifico. Niente slide teoriche — solo cose che
                il team può applicare dal giorno dopo.
              </p>
              <a
                href="mailto:raffaele.smmarketing@gmail.com?subject=Formazione Aziendale"
                className="inline-flex items-center px-6 py-3 border border-gray-200 text-gray-900 text-sm font-medium rounded-lg hover:border-gray-900 transition-colors"
              >
                Richiedi un preventivo →
              </a>
            </div>

            <div id="sponsorizzazioni" className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Megaphone size={20} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Contenuti Sponsorizzati</h2>
              </div>
              <p className="text-gray-500 mb-4 leading-relaxed">
                Collaboro solo con brand e tool che ho usato e che consiglierei anche senza
                compenso. Il mio pubblico è fatto di imprenditori italiani attivi — niente
                curiosi, solo persone che vogliono usare l&apos;AI nel loro business.
              </p>
              <a
                href="mailto:raffaele.smmarketing@gmail.com?subject=Collaborazione Sponsorizzata"
                className="inline-flex items-center px-6 py-3 border border-gray-200 text-gray-900 text-sm font-medium rounded-lg hover:border-gray-900 transition-colors"
              >
                Scrivimi →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}