import Rise from './Rise'
import InstagramPost from './InstagramPost'

// Due recensioni vere, pubblicate da Cantieri Hub: sono imprese edili, non studi di architettura,
// e la pagina lo dice. Il video di YouTube è servito senza cookie finché non parte.
const YOUTUBE_ID = '8q__MfKF2p8'
const INSTAGRAM_URL = 'https://www.instagram.com/p/DdZVnqYsF8q/'

export default function Recensioni() {
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <Rise className="max-w-[760px]">
          <h2
            className="font-display font-extrabold tracking-[-0.02em] leading-[1.08] text-white text-balance"
            style={{ fontSize: 'clamp(30px, 3.6vw, 46px)' }}
          >
            Chi ha già lavorato <em className="em-lime">con me</em>.
          </h2>
          <p className="font-body text-[17px] leading-[1.7] text-fog-300 mt-5 max-w-[62ch]">
            Due recensioni pubblicate da Cantieri Hub. Sono imprese edili, non studi di architettura: il lavoro è lo
            stesso, montare l’intelligenza artificiale dentro quello che si rifà ogni giorno.
          </p>
        </Rise>

        <div className="mt-12 grid md:grid-cols-2 gap-8 md:gap-10 items-start">
          <Rise>
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
          </Rise>

          <Rise delay={0.08}>
            <InstagramPost url={INSTAGRAM_URL} etichetta="La recensione su Instagram" />
            <p className="font-body text-[15px] leading-[1.6] text-fog-300 mt-3">
              <span className="text-white font-semibold">Servizi Duebi S.r.l.</span> — la recensione pubblicata su Instagram.
            </p>
          </Rise>
        </div>
      </div>
    </section>
  )
}
