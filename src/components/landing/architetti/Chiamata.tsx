import Cta from './Cta'
import Rise from './Rise'

const passi = [
  {
    t: 'Capiamo da dove parti.',
    d: 'Cosa sai già dell’intelligenza artificiale, cosa hai provato, cosa fai ogni settimana. Da zero va benissimo: è il punto di partenza più comune che ci sia.',
  },
  {
    t: 'Mappiamo dove ti serve.',
    d: 'Guardiamo il tuo lavoro e segniamo i punti in cui l’AI ti fa risparmiare ore davvero. Non tutti: quelli giusti per te.',
  },
  {
    t: 'Ti do la direzione.',
    d: 'Ti mostro esattamente come si montano quelle cose, passo per passo. Poi, se vuoi farle insieme, le fai con me.',
  },
]

export default function Chiamata() {
  return (
    <section className="py-24 sm:py-32 bg-navy-900/60 border-y border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 grid md:grid-cols-[5fr_7fr] gap-10 md:gap-16 items-start">
        <Rise>
          <h2
            className="font-display font-extrabold tracking-[-0.02em] leading-[1.08] text-white text-balance"
            style={{ fontSize: 'clamp(30px, 3.6vw, 46px)' }}
          >
            Cosa succede nei <em className="em-lime">20 minuti</em>.
          </h2>
        </Rise>

        <div>
          <ol className="space-y-8">
            {passi.map((p, i) => (
              <Rise key={p.t} delay={0.07 * i}>
                <li className="grid grid-cols-[2.5rem_1fr] gap-4">
                  <span className="font-mono text-[13px] font-bold text-lime-500 pt-1 tabular-nums">0{i + 1}</span>
                  <div>
                    <h3 className="font-display font-bold text-white text-[20px] leading-[1.2]">{p.t}</h3>
                    <p className="font-body text-[16px] leading-[1.7] text-fog-300 mt-2 max-w-[58ch] text-pretty">{p.d}</p>
                  </div>
                </li>
              </Rise>
            ))}
          </ol>

          <Rise delay={0.15}>
            <div className="mt-14 border-t border-white/[0.14] pt-8">
              <h3 className="font-display font-extrabold text-white text-[22px] leading-[1.15] tracking-[-0.01em]">
                La chiamata la fai con me.
              </h3>
              <p className="font-body text-[16px] leading-[1.7] text-fog-300 mt-3 max-w-[58ch] text-pretty">
                Non con un team, non con un assistente. E siccome ho un’azienda da mandare avanti, di chiamate ne posso
                fare <strong className="text-white font-semibold">tre, al massimo cinque a settimana</strong>. Non è un
                trucco per farti correre: è quanto riesco a farne. Se i posti sono finiti, ti scrivo appena se ne libera uno.
              </p>
              <Cta className="mt-8" />
            </div>
          </Rise>
        </div>
      </div>
    </section>
  )
}
