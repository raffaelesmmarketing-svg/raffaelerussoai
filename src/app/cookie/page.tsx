import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Informativa sull\'uso dei cookie — raffaelerussoai.com',
}

export default function CookiePage() {
  return (
    <div className="pt-24">
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="font-mono text-xs text-fog-500 hover:text-lime-500 transition-colors">
            ← Home
          </Link>
          <h1 className="font-display font-extrabold text-3xl text-white mt-6 mb-2">Cookie Policy</h1>
          <p className="font-mono text-xs text-fog-500 mb-10">Ultimo aggiornamento: maggio 2026</p>

          <div className="space-y-6 text-fog-300 font-body leading-relaxed">
            <p>
              Il sito <strong className="text-white">raffaelerussoai.com</strong> utilizza cookie
              tecnici necessari al corretto funzionamento delle pagine.
            </p>

            <h2 className="font-display font-bold text-white text-xl mt-8 mb-3">Cookie tecnici</h2>
            <p>
              Sono cookie essenziali per la navigazione e non richiedono consenso. Non tracciano
              informazioni personali e non vengono condivisi con terze parti.
            </p>

            <h2 className="font-display font-bold text-white text-xl mt-8 mb-3">Cookie analitici</h2>
            <p>
              Utilizziamo Vercel Analytics per misure di performance aggregate e anonime.
              Nessun dato personale viene raccolto o trasmesso.
            </p>

            <h2 className="font-display font-bold text-white text-xl mt-8 mb-3">Gestione dei cookie</h2>
            <p>
              Puoi disabilitare i cookie nelle impostazioni del tuo browser. La navigazione
              rimarrà funzionale anche senza cookie.
            </p>

            <p className="mt-8">
              Per informazioni sul trattamento dei dati personali, vedi la{' '}
              <Link href="/privacy" className="text-lime-500 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}