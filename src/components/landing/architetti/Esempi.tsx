import Cta from './Cta'
import Rise from './Rise'
import { esempi } from './dati'

// L'elenco è una sequenza vera (dieci cose, numerate perché il modulo chiede «quale per prima»),
// quindi i numeri portano informazione e non sono decorazione.
export default function Esempi() {
  return (
    <section id="esempi" className="py-24 sm:py-32 border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <Rise className="max-w-[760px]">
          <h2
            className="font-display font-extrabold tracking-[-0.02em] leading-[1.08] text-white text-balance"
            style={{ fontSize: 'clamp(30px, 3.6vw, 46px)' }}
          >
            Cosa può fare, concretamente, <em className="em-lime">nel tuo studio</em>.
          </h2>
          <p className="font-body text-[17px] leading-[1.7] text-fog-300 mt-5 max-w-[62ch]">
            Dieci cose che rifai. Non tutte servono a te: in chiamata scegliamo le due o tre che ti fanno risparmiare
            più ore.
          </p>
        </Rise>

        <ol className="mt-12 grid md:grid-cols-2 gap-x-14 border-t border-white/[0.12]">
          {esempi.map((e, i) => (
            <Rise key={e.cosa} delay={0.04 * (i % 5)}>
              <li className="group grid grid-cols-[3.25rem_1fr] gap-4 py-5 border-b border-white/[0.12] transition-colors duration-300 hover:bg-white/[0.02]">
                <span className="font-mono text-[13px] font-bold text-lime-500 pt-1.5 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="font-body text-[17px] leading-[1.55] text-fog-300 text-pretty">
                  <span className="text-white font-semibold">{e.cosa}</span>{' '}
                  {e.esito}
                </p>
              </li>
            </Rise>
          ))}
        </ol>

        <Rise className="mt-12">
          <Cta />
        </Rise>
      </div>
    </section>
  )
}
