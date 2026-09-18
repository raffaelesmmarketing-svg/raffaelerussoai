import Image from 'next/image'
import Link from 'next/link'
import { copertinaDi, pdfDi, type Guida } from '@/lib/guide'

// La scheda di una guida: copertina vera (la testata del PDF), cosa c'è dentro, un solo gesto: scaricarla.
export default function SchedaGuida({ guida, livello = 'h2' }: { guida: Guida; livello?: 'h2' | 'h3' }) {
  const Titolo = livello
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-navy-800 border border-white/[0.08]">
      <Link href={`/guida/${guida.slug}`} className="block border-b border-white/[0.08]" tabIndex={-1} aria-hidden>
        <Image
          src={copertinaDi(guida)}
          alt=""
          width={1200}
          height={675}
          sizes="(min-width: 768px) 560px, 100vw"
          className="block h-auto w-full"
        />
      </Link>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="font-mono text-[11px] font-bold tracking-[0.14em] uppercase text-lime-500">
          Guida PDF · {guida.minuti} minuti
        </p>
        <Titolo className="font-display font-bold text-[21px] leading-[1.25] tracking-[-0.01em] text-white mt-3 text-balance">
          <Link href={`/guida/${guida.slug}`} className="no-underline text-white hover:text-lime-500 transition-colors">
            {guida.titolo}
          </Link>
        </Titolo>
        <p className="font-body text-[15px] leading-[1.6] text-fog-300 mt-3 text-pretty">{guida.descrizione}</p>

        <div className="mt-auto pt-7">
          <BottoneScarica guida={guida} />
        </div>
      </div>
    </article>
  )
}

export function BottoneScarica({ guida, etichetta = 'Scarica la guida' }: { guida: Guida; etichetta?: string }) {
  return (
    <a
      href={pdfDi(guida)}
      download
      className="cta-shimmer group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 font-display font-extrabold text-sm tracking-[0.06em] uppercase bg-lime-500 text-navy-950 px-7 py-4 rounded-full no-underline shadow-glow-lime-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime-500/40"
    >
      <span className="relative z-10">{etichetta}</span>
      <span className="relative z-10 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden>
        ↓
      </span>
    </a>
  )
}
