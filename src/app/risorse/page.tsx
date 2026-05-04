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
        <div className="max-w-[1200px] mx-auto">

          <div className="text-center mb-12">
            <div className="eyebrow">Gratis</div>
            <h1
              className="font-display font-extrabold tracking-[-0.02em] mt-3 mb-4 text-white"
              style={{ fontSize: 'clamp(36px, 4vw, 56px)' }}
            >
              Risorse <em className="em-lime">gratuite</em>
            </h1>
            <p className="font-body text-[17px] text-fog-300 max-w-xl mx-auto">
              Guide, checklist e tool pratici sull&apos;AI. Scaricali gratis — ti chiedo solo l&apos;email.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {risorse.map(risorsa => (
              <div
                key={risorsa.title}
                className="rounded-2xl bg-navy-800 border border-white/[0.08] overflow-hidden"
              >
                {/* Cover placeholder */}
                <div className="h-44 bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center border-b border-white/[0.08]">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-lime-500/10 border border-lime-500/25 flex items-center justify-center mx-auto mb-2">
                      <span className="text-lime-500 text-xl">📄</span>
                    </div>
                    <span className="font-mono text-xs text-fog-500 uppercase tracking-widest">{risorsa.badge}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full font-mono text-[10px] tracking-[0.12em] uppercase text-lime-500 bg-lime-500/10 border border-lime-500/25">
                      {risorsa.category}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-[20px] text-white mb-2">{risorsa.title}</h2>
                  <p className="font-body text-[15px] text-fog-300 mb-6">{risorsa.description}</p>
                  <EmailForm />
                  <p className="font-body text-xs text-fog-500 mt-3">
                    Niente spam. Disiscrizione in un click.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}