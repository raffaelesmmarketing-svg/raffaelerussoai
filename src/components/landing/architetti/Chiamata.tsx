import Rise from './Rise'

const passi = [
  { t: 'Capiamo da dove parti.', d: 'Da solo o in studio, cosa rifai ogni settimana, cosa hai già provato. Se non sai niente di AI va benissimo: è il punto di partenza più comune che ci sia.' },
  { t: 'Ti faccio vedere come si monta una cosa.', d: 'Dal vivo, su un tuo caso. Non teoria: prendo una cosa che rifai e ti mostro come la fa lui, e cosa resta a te.' },
  { t: 'Ti do la direzione.', d: 'Cosa costruire per primo, quanto ci vuole, cosa serve da parte tua. Che tu lavori con me o no, quella te la porti a casa.' },
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
              <h3 className="font-display font-extrabold text-white text-[22px] leading-[1.15] tracking-[-0.01em]">Quanti posti ci sono?</h3>
              <p className="font-body text-[16px] leading-[1.7] text-fog-300 mt-3 max-w-[58ch] text-pretty">
                Le chiamate le faccio io, non un team: <strong className="text-white font-semibold">cinque a settimana</strong>. Non
                è «affrettati che scadono fra tre minuti»: è quanto riesco a farne. Quando finiscono, ti metto in lista e ti
                scrivo appena si libera un posto.
              </p>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  )
}
