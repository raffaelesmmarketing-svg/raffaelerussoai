import Rise from './Rise'

const esiti = [
  { t: 'Ti dico cosa montare per primo nel tuo studio', d: 'e da dove si comincia lunedì mattina.' },
  { t: 'Ti dico che nel tuo caso conviene aspettare', d: 'succede, e preferisco dirtelo prima che tu spenda un euro.' },
  { t: 'Ti dico che non facciamo per noi', d: 'e ti lascio comunque una cosa che prima non sapevi.' },
]

export default function Perche() {
  return (
    <section className="py-24 sm:py-32 border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 grid md:grid-cols-[5fr_7fr] gap-10 md:gap-16 items-start">
        <Rise>
          <h2
            className="font-display font-extrabold tracking-[-0.02em] leading-[1.08] text-white text-balance"
            style={{ fontSize: 'clamp(30px, 3.6vw, 46px)' }}
          >
            «Raffaele, perché mi regali <em className="em-lime">20 minuti</em>?»
          </h2>
        </Rise>

        <Rise delay={0.1} className="font-body text-[17px] leading-[1.7] text-fog-100 max-w-[62ch]">
          <p>Perché ho un problema.</p>
          <p className="mt-4 text-fog-300">
            Chiunque oggi ti parli di intelligenza artificiale ti sta vendendo qualcosa: un corso, uno strumento,
            un abbonamento. E l’ultima volta che ci hai provato ti è costato una serata e un rinnovo automatico.
          </p>
          <p className="mt-4 text-fog-300">Quindi posso fare due cose.</p>
          <ol className="mt-4 space-y-2 text-fog-300 list-decimal pl-5 marker:text-lime-500 marker:font-bold">
            <li>Scriverti una pagina piena di promesse.</li>
            <li>Parlarti 20 minuti, gratis, e lasciare che sia la conversazione a dirti se ha senso.</li>
          </ol>
          <p className="mt-4">Ho scelto la seconda.</p>

          <p className="mt-10 font-display font-bold text-white text-[19px]">
            Alla fine dei 20 minuti succede una di queste tre cose.
          </p>
          <ul className="mt-5 space-y-4">
            {esiti.map((e) => (
              <li key={e.t} className="flex gap-4">
                <span aria-hidden className="mt-[13px] h-px w-6 shrink-0 bg-lime-500" />
                <p className="text-fog-300">
                  <strong className="text-white font-semibold">{e.t}</strong> {e.d}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-fog-300">
            In tutti e tre i casi esci sapendo una cosa che prima non sapevi. Che è più di quanto ti abbia lasciato
            l’ultimo video che hai guardato.
          </p>
        </Rise>
      </div>
    </section>
  )
}
