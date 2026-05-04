import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Informativa sul trattamento dei dati personali — raffaelerussoai.com',
}

export default function PrivacyPage() {
  return (
    <div className="pt-24">
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="font-mono text-xs text-fog-500 hover:text-lime-500 transition-colors">
            ← Home
          </Link>
          <h1 className="font-display font-extrabold text-3xl text-white mt-6 mb-2">Privacy Policy</h1>
          <p className="font-mono text-xs text-fog-500 mb-10">Ultimo aggiornamento: maggio 2026</p>

          <div className="prose prose-invert prose-sm max-w-none space-y-6 text-fog-300 font-body leading-relaxed">
            <p>
              Il presente sito web <strong className="text-white">raffaelerussoai.com</strong> è gestito da
              Raffaele Russo. Questa pagina descrive come vengono trattati i dati personali degli utenti
              che visitano il sito o si iscrivono alla newsletter.
            </p>

            <h2 className="font-display font-bold text-white text-xl mt-8 mb-3">Dati raccolti</h2>
            <p>
              Raccogliamo esclusivamente l&apos;indirizzo email degli utenti che si iscrivono volontariamente
              alla newsletter o scaricano risorse gratuite. Non raccogliamo dati sensibili.
            </p>

            <h2 className="font-display font-bold text-white text-xl mt-8 mb-3">Finalità del trattamento</h2>
            <p>
              L&apos;email viene utilizzata per inviare la newsletter e le risorse richieste.
              Non viene ceduta a terzi né utilizzata per finalità di marketing non richiesto.
            </p>

            <h2 className="font-display font-bold text-white text-xl mt-8 mb-3">Disiscrizione</h2>
            <p>
              Puoi disiscriverti in qualsiasi momento tramite il link presente in ogni email ricevuta.
            </p>

            <h2 className="font-display font-bold text-white text-xl mt-8 mb-3">Cookie</h2>
            <p>
              Il sito utilizza cookie tecnici necessari al funzionamento. Per i dettagli vedi la{' '}
              <Link href="/cookie" className="text-lime-500 hover:underline">Cookie Policy</Link>.
            </p>

            <h2 className="font-display font-bold text-white text-xl mt-8 mb-3">Contatti</h2>
            <p>
              Per qualsiasi richiesta relativa ai tuoi dati:{' '}
              <a href="mailto:raffaele.smmarketing@gmail.com" className="text-lime-500 hover:underline">
                raffaele.smmarketing@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}