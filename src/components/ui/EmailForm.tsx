'use client'

interface Props {
  buttonLabel?: string
}

export default function EmailForm({ buttonLabel = 'Scarica gratis →' }: Props) {
  return (
    <form className="flex flex-col gap-3" onSubmit={e => e.preventDefault()}>
      <input
        type="email"
        required
        placeholder="la-tua-email@azienda.it"
        className="px-4 py-3 rounded-full bg-navy-950/50 border border-white/20 text-white font-body text-sm outline-none transition-all duration-200 focus:border-lime-500 focus:shadow-[0_0_0_4px_rgba(184,255,61,0.18)] placeholder-fog-500"
      />
      <button
        type="submit"
        className="cta-shimmer group inline-flex items-center justify-center gap-2 font-display font-extrabold text-sm tracking-[0.06em] uppercase bg-lime-500 text-navy-950 px-5 py-3 rounded-full border-0 cursor-pointer shadow-glow-lime-sm"
      >
        <span className="relative z-10">{buttonLabel}</span>
        <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">→</span>
      </button>
    </form>
  )
}
