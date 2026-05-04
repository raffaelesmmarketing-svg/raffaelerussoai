import Reveal from '@/components/Reveal'
import Link from 'next/link'

export default function AboutSnippet() {
  return (
    <section id="chi-sono" className="py-32">
      <div className="max-w-[1200px] mx-auto px-8 grid md:grid-cols-[5fr_6fr] gap-16 items-center">
        <Reveal>
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/[0.08]">
            <img
              src="/images/portrait.jpg"
              alt="Raffaele Russo"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute left-4 bottom-4 px-3 py-1.5 rounded-full bg-navy-950/60 backdrop-blur-md border border-white/10 font-mono text-[11px] tracking-[0.12em] uppercase text-fog-300">
              Lisbona · 2026
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="eyebrow">Chi sono</div>
          <h2
            className="font-display font-extrabold leading-[1.05] tracking-[-0.02em] mt-4 mb-7"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
          >
            Imprenditore <em className="em-lime">prima</em>,<br />
            esperto AI <em className="em-lime">dopo</em>.
          </h2>
          <p className="font-body text-[17px] leading-[1.65] text-fog-300 mb-4">
            Ho 27 anni, vivo a Lisbona e ho co-fondato <strong className="text-white">Cantieri Hub</strong>,
            una software house AI per l&apos;edilizia italiana. Ogni giorno aiuto imprenditori a usare l&apos;AI
            in modo concreto.
          </p>
          <p className="font-body text-[17px] leading-[1.65] text-fog-300 mb-4">
            Non sono un ingegnere. Sono un imprenditore. Per questo so cosa serve davvero a chi gestisce
            un&apos;azienda: risparmiare ore, capire cosa scegliere, smettere di farsi intimidire dal gergo.
          </p>
          <p className="font-body text-[17px] leading-[1.65] text-fog-300 mb-7">
            Il mio motto è <em className="em-lime">Spingere</em>. I miei valori: lealtà, umiltà, ambizione.
          </p>
          <Link
            href="/chi-sono"
            className="group inline-flex items-center gap-2 font-display font-bold text-[15px] text-lime-500 no-underline border-b border-lime-500/40 pb-0.5"
          >
            Leggi la mia storia{' '}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}