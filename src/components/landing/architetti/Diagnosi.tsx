import Rise from './Rise'

const tentativi = [
  'Hai provato ChatGPT: relazione generica, una norma che non esiste, chiuso.',
  'Hai guardato i video: tutti mostrano strumenti, nessuno il tuo lunedì mattina.',
  'Hai pensato «lo faccio quando ho tempo» — e il tempo è la cosa che ti manca.',
]

export default function Diagnosi() {
  return (
    <section className="py-24 sm:py-32 bg-navy-900/60 border-y border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="max-w-[760px]">
          <Rise>
            <h2
              className="font-display font-extrabold tracking-[-0.02em] leading-[1.08] text-white text-balance"
              style={{ fontSize: 'clamp(30px, 3.6vw, 46px)' }}
            >
              Sei fermo alla domanda sbagliata.
            </h2>
            <p className="font-body text-[17px] leading-[1.7] text-fog-300 mt-6 max-w-[62ch]">
              La domanda che ti sei fatto è: <em className="text-white not-italic font-semibold">«come funziona l’intelligenza artificiale?»</em>{' '}
              E ti sei bloccato lì, perché la risposta non ti serve per lavorare.
            </p>
          </Rise>

          <ul className="mt-10 space-y-4">
            {tentativi.map((t, i) => (
              <Rise key={t} delay={0.06 * i}>
                <li className="flex gap-4 items-start">
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/25 font-mono text-[11px] text-fog-300"
                  >
                    ✕
                  </span>
                  <p className="font-body text-[17px] leading-[1.6] text-fog-100">{t}</p>
                </li>
              </Rise>
            ))}
          </ul>

          <Rise delay={0.15}>
            <div className="mt-12 font-body text-[17px] leading-[1.7] text-fog-300 max-w-[62ch]">
              <p>
                Poi, forse, hai provato la scorciatoia: un corso. Quaranta video su prompt, modelli e automazioni.
                Tutto interessante. E inutile, perché quei corsi partono dal presupposto che tu sappia già cosa farci.
              </p>
              <p className="mt-4">Quel corso è ancora lì. Nella tua area riservata.</p>
            </div>

            {/* Il corso al 12%: la barra dice quello che il testo racconta. */}
            <div className="mt-6 max-w-[420px]" aria-hidden>
              <div className="flex justify-between font-mono text-[11px] tracking-[0.14em] uppercase text-fog-500">
                <span>Corso — completato</span>
                <span className="text-lime-500">12%</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
                <div className="h-full w-[12%] rounded-full bg-lime-500" />
              </div>
            </div>

            <p className="mt-10 font-body text-[17px] leading-[1.7] text-fog-100 max-w-[62ch]">
              Intanto, ogni settimana, rifai a mano le stesse cose:{' '}
              <span className="text-white font-semibold">la relazione, il cartiglio, l’elenco documenti, il disciplinare, le mail al cliente.</span>
            </p>
          </Rise>
        </div>
      </div>
    </section>
  )
}
