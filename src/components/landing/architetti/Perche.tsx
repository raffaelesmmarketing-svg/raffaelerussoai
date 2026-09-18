import Rise from './Rise'

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

        <Rise delay={0.1} className="font-body text-[17px] sm:text-[18px] leading-[1.7] text-fog-100 max-w-[58ch]">
          <p>
            Perché oggi quasi nessuno sa davvero cosa si può fare con l’intelligenza artificiale in uno studio. Se ne
            parla tanto, si vede poco.
          </p>
          <p className="mt-4 text-fog-300">
            Quindi, invece di scriverti una pagina di promesse, preferisco mostrartelo: in chiamata ti faccio vedere
            esempi veri, sul tuo lavoro, e capiamo insieme se ha senso andare avanti.
          </p>
        </Rise>
      </div>
    </section>
  )
}
