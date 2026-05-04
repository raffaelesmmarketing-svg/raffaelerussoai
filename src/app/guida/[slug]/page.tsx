import type { Metadata } from 'next'
import EmailForm from '@/components/ui/EmailForm'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `Guida Gratuita — ${slug}`,
    description: "Scarica la guida gratuita sull'AI per il tuo business.",
  }
}

export default async function GuidaLandingPage({ params }: Props) {
  const { slug } = await params

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-24">
      <div className="max-w-lg w-full text-center">

        <div className="eyebrow mb-4">Gratis</div>
        <h1
          className="font-display font-extrabold leading-[1.05] tracking-[-0.02em] text-white mb-4"
          style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
        >
          [Titolo guida: <em className="em-lime">{slug}</em>]
        </h1>
        <p className="font-body text-[17px] leading-[1.6] text-fog-300 mb-8">
          [Descrizione della guida — cosa impara il lettore, perché è utile,
          che risultato concreto ottiene in quanto tempo.]
        </p>

        {/* Punti di valore */}
        <div className="rounded-2xl bg-navy-800 border border-white/[0.08] p-6 mb-8 text-left">
          <ul className="space-y-3">
            {['Punto 1 di valore', 'Punto 2 di valore', 'Punto 3 di valore'].map(p => (
              <li key={p} className="flex items-center gap-3 font-body text-sm text-fog-300">
                <span className="text-lime-500 font-bold">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <EmailForm buttonLabel="Inviamela gratis" />
        <p className="font-body text-xs text-fog-500 mt-3">
          Niente spam. Disiscrizione in un click.
        </p>
      </div>
    </div>
  )
}
