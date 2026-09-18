import Reveal from '@/components/Reveal'
import InstagramPost from '@/components/ui/InstagramPost'

// Due recensioni vere, pubblicate da Cantieri Hub. Prima qui c'erano sei citazioni inventate:
// una sezione con due prove vere vale più di sei finte.
const YOUTUBE_ID = '8q__MfKF2p8'
const INSTAGRAM_URL = 'https://www.instagram.com/p/DdZVnqYsF8q/'

export default function Testimonials() {
  return (
    <section className="py-32 border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-8">
        <Reveal className="text-center mb-14">
          <div className="eyebrow">Recensioni</div>
          <h2
            className="font-display font-extrabold tracking-[-0.02em] mt-3 mb-3 text-white"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
          >
            Chi ha già lavorato <em className="em-lime">con me</em>
          </h2>
          <p className="font-body text-[17px] text-fog-300 max-w-[560px] mx-auto">
            Due recensioni pubblicate da Cantieri Hub, l&apos;azienda che ho co-fondato: imprese edili che usano
            l&apos;intelligenza artificiale ogni giorno.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start max-w-[1000px] mx-auto">
          <Reveal>
            <div className="relative aspect-video overflow-hidden rounded-xl border border-white/[0.08] bg-navy-800">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?rel=0&modestbranding=1`}
                title="Preventivi edili più veloci con l’AI: la recensione di Francesca (Edil Verde)"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <p className="font-body text-[15px] leading-[1.6] text-fog-300 mt-3">
              <span className="text-white font-semibold">Francesca, Edil Verde</span> — preventivi edili più veloci con l’AI.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <InstagramPost url={INSTAGRAM_URL} etichetta="La recensione su Instagram" />
            <p className="font-body text-[15px] leading-[1.6] text-fog-300 mt-3">
              <span className="text-white font-semibold">Servizi Duebi S.r.l.</span> — la recensione pubblicata su Instagram.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
