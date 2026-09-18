import type { Metadata } from 'next'
import Link from 'next/link'
import Questionario from './Questionario'

export const metadata: Metadata = {
  title: { absolute: 'Grazie — ti scrivo io | Raffaele Russo' },
  robots: { index: false, follow: false },
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// La pagina di ringraziamento: il modulo ci arriva con l'id della richiesta (?r=), e il questionario
// si lega a quella. Senza id la pagina ringrazia e rimanda al modulo.
export default async function GraziePage({ searchParams }: { searchParams: Promise<{ r?: string }> }) {
  const { r } = await searchParams
  const richiestaId = r && UUID.test(r) ? r : null

  return (
    <div className="pt-36 pb-24 sm:pt-44 sm:pb-32">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 grid lg:grid-cols-[5fr_7fr] gap-12 lg:gap-16 items-start">
        <div className="lg:sticky lg:top-28">
          <p className="font-mono text-xs font-bold tracking-[0.16em] uppercase text-lime-500">Richiesta ricevuta</p>
          <h1
            className="font-display font-extrabold tracking-[-0.025em] leading-[1.06] text-white mt-5 text-balance"
            style={{ fontSize: 'clamp(34px, 4.6vw, 58px)' }}
          >
            Grazie, ti scrivo io <em className="em-lime">entro 30 minuti</em>.
          </h1>
          <p className="font-body text-[17px] sm:text-[18px] leading-[1.65] text-fog-100 mt-6 max-w-[46ch] text-pretty">
            Fisseremo una chiamata di 20 minuti. Nel frattempo puoi iniziare a preparare il tuo progetto: ti consiglio
            di mettere insieme tutte le informazioni, così in chiamata facciamo chiarezza subito.
          </p>
          {richiestaId ? (
            <p className="font-body text-[16px] leading-[1.65] text-fog-300 mt-5 max-w-[46ch] text-pretty">
              Qui trovi dieci domande: servono a te per vedere dove rifai le stesse cose, e a me per arrivare
              in chiamata sapendo di cosa parlare. Cinque minuti, tutte facoltative.
            </p>
          ) : (
            <p className="font-body text-[16px] leading-[1.65] text-fog-300 mt-5 max-w-[46ch] text-pretty">
              Se non hai ancora compilato il modulo,{' '}
              <Link href="/ai-per-architetti#prenota" className="text-lime-500 underline underline-offset-2">
                lo trovi qui
              </Link>
              .
            </p>
          )}
        </div>

        {richiestaId && <Questionario richiestaId={richiestaId} />}
      </div>
    </div>
  )
}
