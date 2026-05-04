'use client'

import Reveal from '@/components/Reveal'

export default function LeadMagnet() {
  return (
    <section id="lead" className="py-16">
      <div className="max-w-[1200px] mx-auto px-8">
        <Reveal className="relative rounded-[28px] overflow-hidden border border-lime-500/25 px-14 py-20 [background:linear-gradient(135deg,#0a1840_0%,#0d2a82_100%)]">

          <svg
            viewBox="0 0 700 400"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full opacity-45 pointer-events-none"
          >
            <path d="M520,-30 Q720,80 740,360 L800,440 L380,440 Q420,140 520,-30Z" fill="#1f3a82" opacity="0.6" />
            <path d="M560,-20 Q740,80 760,400" stroke="#b8ff3d" strokeWidth="1.5" fill="none" opacity="0.6" />
            <circle cx="650" cy="180" r="80" fill="#b8ff3d" opacity="0.06" />
          </svg>

          <div className="relative max-w-[640px]">
            <div className="eyebrow">Risorsa Gratuita</div>
            <h2
              className="font-display font-extrabold leading-[1.05] tracking-[-0.02em] mt-4 mb-5"
              style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}
            >
              <em className="em-lime">10 strumenti AI</em><br />
              che ogni imprenditore deve conoscere
            </h2>
            <p className="font-body text-[17px] leading-[1.6] text-fog-100 mb-2">
              Una guida pratica di 32 pagine. Per ogni strumento: caso d&apos;uso, costi reali, tempo di implementazione.
            </p>
            <p className="font-mono text-xs tracking-[0.1em] uppercase text-lime-500 font-bold mb-8">
              → Scaricata da 4.200+ imprenditori
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 flex-wrap">
              <input
                type="email"
                required
                placeholder="la-tua-email@azienda.it"
                className="flex-1 min-w-[280px] px-5 py-4 rounded-full bg-navy-950/50 border border-white/20 text-white font-body text-[15px] outline-none transition-all duration-200 focus:border-lime-500 focus:shadow-[0_0_0_4px_rgba(184,255,61,0.18)]"
              />
              <button
                type="submit"
                className="cta-shimmer group inline-flex items-center gap-2.5 font-display font-extrabold text-sm tracking-[0.06em] uppercase bg-lime-500 text-navy-950 px-7 py-4 rounded-full border-0 cursor-pointer shadow-glow-lime"
              >
                <span className="relative z-10">Scarica ora</span>
                <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
            </form>
            <p className="font-body text-[13px] text-fog-300 mt-4">
              Niente spam. Disiscrizione in un click.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}