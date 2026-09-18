import Rise from './Rise'

const tre = [
  { t: 'Niente installazioni.', d: 'Browser e chat. Quello che hai già.' },
  { t: 'Niente codice.', d: 'Parliamo di pratiche, non di modelli.' },
  { t: 'Niente atti firmati dall’AI.', d: 'Lei fa la bozza. L’atto è tuo, sempre.' },
]

export default function NienteTecnico() {
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <Rise className="max-w-[760px]">
          <h2
            className="font-display font-extrabold tracking-[-0.02em] leading-[1.08] text-white text-balance"
            style={{ fontSize: 'clamp(30px, 3.6vw, 46px)' }}
          >
            E non devi diventare un tecnico.
          </h2>
        </Rise>

        <div className="mt-12 grid sm:grid-cols-3 gap-8 sm:gap-6">
          {tre.map((x, i) => (
            <Rise key={x.t} delay={0.07 * i}>
              <div className="border-t border-white/[0.14] pt-5">
                <p className="font-display font-extrabold text-white text-[22px] leading-[1.15] tracking-[-0.01em]">{x.t}</p>
                <p className="font-body text-[16px] leading-[1.6] text-fog-300 mt-2">{x.d}</p>
              </div>
            </Rise>
          ))}
        </div>

        <Rise delay={0.15}>
          <p className="font-display font-bold text-[20px] sm:text-[24px] leading-[1.35] text-fog-100 mt-16 max-w-[40ch] text-balance">
            Uno strumento che fa una cosa che rifacevi, e un modo di usarlo che regge in studio.{' '}
            <span className="text-lime-500">Quello è il modello. Ed è quello che costruiamo con te.</span>
          </p>
        </Rise>
      </div>
    </section>
  )
}
