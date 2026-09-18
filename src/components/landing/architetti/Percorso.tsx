import Rise from './Rise'
import { Cartiglio } from './Tavola'

const passi = [
  {
    n: '1',
    t: 'Prima troviamo cosa montare. Insieme.',
    d: 'Guardiamo la tua settimana, contiamo le ore, scegliamo due o tre cose dall’elenco qui sopra. Non partiamo dallo strumento: partiamo da dove perdi tempo.',
  },
  {
    n: '2',
    t: 'Poi lo costruiamo. Insieme.',
    d: 'Incontro zero: i tuoi documenti — regolamento, norme, modelli, pratiche chiuse — dentro uno strumento che risponde con le fonti. Poi un incontro per ogni cosa scelta. A ogni incontro esce una cosa che usi il giorno dopo. Il pezzo tecnico è mio, l’uso è tuo.',
  },
  {
    n: '3',
    t: 'Poi si usa, e si guarda se regge.',
    d: 'La provi sui casi veri, correggiamo quello che non torna, e ti lascio il modo giusto di dirlo ai tuoi clienti.',
  },
]

export default function Percorso() {
  return (
    <section className="py-24 sm:py-32 bg-navy-900/60 border-y border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <Rise className="max-w-[760px]">
          <h2
            className="font-display font-extrabold tracking-[-0.02em] leading-[1.08] text-white text-balance"
            style={{ fontSize: 'clamp(30px, 3.6vw, 46px)' }}
          >
            Il percorso, in tre passi.
          </h2>
        </Rise>

        <ol className="mt-12 grid lg:grid-cols-3 gap-10 lg:gap-8">
          {passi.map((p, i) => (
            <Rise key={p.n} delay={0.08 * i}>
              <li className="relative pt-6 border-t border-lime-500/40">
                <span
                  aria-hidden
                  className="absolute -top-[18px] left-0 flex h-9 w-9 items-center justify-center rounded-full bg-lime-500 font-display font-extrabold text-navy-950 text-[15px]"
                >
                  {p.n}
                </span>
                <h3 className="font-display font-bold text-white text-[21px] leading-[1.2] mt-4 text-balance">{p.t}</h3>
                <p className="font-body text-[16px] leading-[1.7] text-fog-300 mt-3 text-pretty">{p.d}</p>
              </li>
            </Rise>
          ))}
        </ol>

        <Rise delay={0.1} className="mt-14">
          <Cartiglio
            celle={[
              { k: 'Incontri', v: 'Quattro' },
              { k: 'Durata', v: '60 minuti' },
              { k: 'Tempo', v: 'Quattro settimane' },
              { k: 'Dove', v: 'In video' },
            ]}
          />
          <p className="font-body text-[16px] leading-[1.7] text-fog-300 mt-5 max-w-[62ch]">
            Da solo, o con lo studio e i collaboratori. E c’è un pezzo del percorso che nessuno fa: <strong className="text-white font-semibold">come lo dici al cliente</strong> — una frase pronta, e un vantaggio invece di un rischio.
          </p>
        </Rise>
      </div>
    </section>
  )
}
