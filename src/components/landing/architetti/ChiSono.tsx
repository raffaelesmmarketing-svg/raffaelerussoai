import Rise from './Rise'

export default function ChiSono() {
  return (
    <section className="py-24 sm:py-32 border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 grid md:grid-cols-[4fr_7fr] gap-10 md:gap-16 items-start">
        <Rise>
          <figure className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/[0.1]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/portrait-studio.jpg"
                alt="Raffaele Russo al lavoro, al portatile"
                className="h-full w-full object-cover object-top"
                loading="lazy"
              />
            </div>
            <figcaption className="mt-3 grid grid-cols-[1fr_auto] border border-white/[0.14] divide-x divide-white/[0.14]">
              <div className="px-4 py-2.5">
                <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-fog-500">Nome</div>
                <div className="font-display font-extrabold text-white text-[15px]">Raffaele Russo</div>
              </div>
              <div className="px-4 py-2.5">
                <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-fog-500">Programmatore</div>
                <div className="font-display font-extrabold text-lime-500 text-[15px]">No</div>
              </div>
            </figcaption>
          </figure>
        </Rise>

        <Rise delay={0.1} className="font-body text-[17px] leading-[1.7] text-fog-300 max-w-[62ch]">
          <h2
            className="font-display font-extrabold tracking-[-0.02em] leading-[1.08] text-white text-balance"
            style={{ fontSize: 'clamp(30px, 3.6vw, 46px)' }}
          >
            Chi sono io per dirti tutto questo?
          </h2>
          <p className="mt-6 text-fog-100">Piacere, sono Raffaele Russo.</p>
          <p className="mt-4">
            Ho studiato ingegneria civile e l’ho lasciata a metà. Non sono un programmatore. Oggi co-fondo{' '}
            <strong className="text-white font-semibold">Cantieri Hub</strong>, software per le imprese edili: ne seguo la
            parte commerciale, formo chi vende, e costruisco con l’intelligenza artificiale gli strumenti che usiamo ogni
            giorno.
          </p>
          <p className="mt-4">
            Sì, hai letto bene: <strong className="text-white font-semibold">non sono un programmatore e costruisco software con l’AI tutti i giorni.</strong>{' '}
            Non è una contraddizione. È il motivo per cui posso insegnarlo a te, che programmatore non sei e non vuoi
            diventarlo.
          </p>

          <div className="mt-8 border-l-0 border-t border-white/[0.14] pt-6">
            <p>Non ti prometto che l’AI ti fa la pratica da sola.</p>
            <p className="mt-1">Non ti prometto che risparmi il 70% del tempo.</p>
            <p className="mt-1">Non ti prometto niente di quello che ti hanno promesso quelli prima di me.</p>
            <p className="mt-5 text-white font-display font-bold text-[19px] leading-[1.35]">
              Ti prometto una cosa sola: quello che ti insegno lo faccio prima io, tutti i giorni, e te lo faccio vedere.
            </p>
          </div>
        </Rise>
      </div>
    </section>
  )
}
