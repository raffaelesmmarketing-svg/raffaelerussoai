import Rise from './Rise'
import Modulo from './Modulo'
import { Quota } from './Tavola'

// La chiusura: la biforcazione e, accanto, il modulo. Sfondo scuro come il resto della pagina,
// così il modulo si legge senza fatica.
export default function DueStrade() {
  return (
    <section id="prenota" className="scroll-mt-20 bg-navy-900/60 border-t border-white/[0.08] py-24 sm:py-32">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 grid lg:grid-cols-[5fr_7fr] gap-12 lg:gap-16 items-start">
        <div>
          <Rise>
            <h2
              className="font-display font-extrabold tracking-[-0.025em] leading-[1.04] text-white text-balance"
              style={{ fontSize: 'clamp(36px, 4.6vw, 60px)' }}
            >
              Hai due strade.
            </h2>
          </Rise>

          <Rise delay={0.08}>
            <div className="mt-10 border-t border-white/[0.14] pt-6">
              <p className="font-display font-extrabold text-white text-[22px] leading-[1.15]">Chiudere questa pagina.</p>
              <p className="font-body text-[17px] leading-[1.65] text-fog-300 mt-2 max-w-[44ch] text-pretty">
                Torni a quello che stavi facendo, e fra sei mesi rifai le stesse cose, con un’ora in più di fatica.
              </p>
            </div>
            <div className="mt-8 border-t border-white/[0.14] pt-6">
              <p className="font-display font-extrabold text-white text-[22px] leading-[1.15]">Prenderti 20 minuti.</p>
              <p className="font-body text-[17px] leading-[1.65] text-fog-300 mt-2 max-w-[44ch] text-pretty">
                Parli con uno che questo lo fa tutti i giorni, e vedi con i tuoi occhi cosa si può fare nel tuo studio.
              </p>
            </div>
          </Rise>

          <Rise delay={0.16}>
            <Quota etichetta="la seconda è gratis" className="mt-12 max-w-[320px]" />
            <p className="font-display font-extrabold text-white text-[22px] sm:text-[26px] leading-[1.2] mt-5 tracking-[-0.01em]">
              Non c’è molto da pensare.
            </p>
          </Rise>
        </div>

        <Rise delay={0.1}>
          <Modulo />
        </Rise>
      </div>
    </section>
  )
}
