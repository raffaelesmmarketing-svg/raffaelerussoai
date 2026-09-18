import { ANCORA_MODULO } from './dati'

// Un solo bottone per tutta la pagina, sempre uguale, sempre verso il modulo.
export default function Cta({
  etichetta = 'Prenota 20 minuti gratuiti',
  nota,
  className = '',
}: {
  etichetta?: string
  nota?: string
  className?: string
}) {
  return (
    <div className={`flex flex-col items-start gap-3 ${className}`}>
      <a
        href={ANCORA_MODULO}
        className="cta-shimmer group inline-flex items-center gap-2.5 font-display font-extrabold text-sm tracking-[0.06em] uppercase bg-lime-500 text-navy-950 px-7 py-4 rounded-full no-underline shadow-glow-lime focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime-500/40"
      >
        <span className="relative z-10">{etichetta}</span>
        <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1" aria-hidden>
          →
        </span>
      </a>
      {nota && <p className="font-body text-sm text-fog-300">{nota}</p>}
    </div>
  )
}
