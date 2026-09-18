import Rise from './Rise'
import Modulo from './Modulo'

// La chiusura: un titolo, una riga, il modulo. Niente biforcazioni.
export default function Richiesta() {
  return (
    <section id="prenota" className="scroll-mt-20 bg-navy-900/60 border-t border-white/[0.08] py-24 sm:py-32">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 grid lg:grid-cols-[5fr_7fr] gap-12 lg:gap-16 items-start">
        <Rise>
          <h2
            className="font-display font-extrabold tracking-[-0.025em] leading-[1.06] text-white text-balance"
            style={{ fontSize: 'clamp(34px, 4.2vw, 54px)' }}
          >
            Richiedi una consulenza <em className="em-lime">gratuita</em> con me.
          </h2>
          <p className="font-body text-[17px] leading-[1.65] text-fog-300 mt-6 max-w-[44ch] text-pretty">
            Compili il modulo, ti scrivo io entro 30 minuti e fissiamo l’orario.
          </p>
        </Rise>

        <Rise delay={0.1}>
          <Modulo />
        </Rise>
      </div>
    </section>
  )
}
