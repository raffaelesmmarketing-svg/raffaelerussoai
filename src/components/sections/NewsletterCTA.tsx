'use client'

import Reveal from '@/components/Reveal'

export default function NewsletterCTA() {
  return (
    <section className="py-32 border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-8">
        <Reveal className="text-center max-w-[620px] mx-auto">
          <div className="eyebrow">Newsletter</div>
          <h2
            className="font-display font-extrabold leading-[1.05] tracking-[-0.02em] mt-3 mb-4"
            style={{ fontSize: 'clamp(32px, 4.5vw, 52px)' }}
          >
            Ogni <em className="em-lime">settimana</em><br />
            nella tua inbox
          </h2>
          <p className="font-body text-[17px] leading-[1.6] text-fog-300 mb-9">
            1 caso studio, 1 strumento da provare, 1 lezione da chi sta già usando l&apos;AI in azienda.
            Nessuna teoria.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 flex-wrap justify-center">
            <input
              type="email"
              required
              placeholder="la-tua-email@azienda.it"
              className="flex-1 min-w-[280px] max-w-[360px] px-5 py-4 rounded-full bg-navy-800 border border-white/20 text-white font-body text-[15px] outline-none transition-all duration-200 focus:border-lime-500 focus:shadow-[0_0_0_4px_rgba(184,255,61,0.18)]"
            />
            <button
              type="submit"
              className="cta-shimmer group inline-flex items-center gap-2.5 font-display font-extrabold text-sm tracking-[0.06em] uppercase bg-lime-500 text-navy-950 px-7 py-4 rounded-full border-0 cursor-pointer shadow-glow-lime-sm"
            >
              <span className="relative z-10">Iscriviti</span>
              <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
          </form>
          <p className="font-body text-[13px] text-fog-500 mt-4">
            Gratis. Disiscrizione in un click. Letta da 12.000+ imprenditori.
          </p>
        </Reveal>
      </div>
    </section>
  )
}