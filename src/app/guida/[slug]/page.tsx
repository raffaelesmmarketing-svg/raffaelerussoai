import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BottoneScarica } from '@/components/guide/SchedaGuida'
import { copertinaDi, guidaPerSlug, guide } from '@/lib/guide'

interface Props {
  params: Promise<{ slug: string }>
}

// Una pagina per guida, da linkare da sola (descrizione di un video, risposta a un commento).
// Esistono solo le guide vere: uno slug qualunque dà 404.
export function generateStaticParams() {
  return guide.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guida = guidaPerSlug(slug)
  if (!guida) return {}
  return {
    title: `${guida.titolo} · guida gratuita`,
    description: guida.descrizione,
    openGraph: { title: guida.titolo, description: guida.descrizione, images: [copertinaDi(guida)] },
  }
}

export default async function GuidaPage({ params }: Props) {
  const { slug } = await params
  const guida = guidaPerSlug(slug)
  if (!guida) notFound()

  return (
    <div className="pt-24">
      <section className="py-14 sm:py-16 px-4 sm:px-6">
        <div className="max-w-[1080px] mx-auto grid gap-10 lg:grid-cols-[5fr_6fr] lg:gap-14 lg:items-center">
          <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
            <Image
              src={copertinaDi(guida)}
              alt=""
              width={1200}
              height={675}
              priority
              sizes="(min-width: 1024px) 480px, 100vw"
              className="block h-auto w-full"
            />
          </div>

          <div>
            <p className="eyebrow">Guida gratuita · PDF · {guida.minuti} minuti</p>
            <h1
              className="font-display font-extrabold leading-[1.08] tracking-[-0.02em] text-white mt-4 text-balance"
              style={{ fontSize: 'clamp(30px, 3.6vw, 46px)' }}
            >
              {guida.titolo}
            </h1>
            <p className="font-body text-[17px] leading-[1.65] text-fog-300 mt-5 max-w-[56ch] text-pretty">
              {guida.descrizione}
            </p>

            <p className="font-body text-[16px] font-semibold text-fog-100 mt-8">Dentro trovi:</p>
            <ul className="mt-3 space-y-2.5">
              {guida.dentro.map((d) => (
                <li key={d} className="flex items-start gap-3 font-body text-[16px] leading-[1.55] text-fog-300">
                  <span aria-hidden className="mt-[11px] h-0.5 w-5 shrink-0 bg-lime-500" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <BottoneScarica guida={guida} />
            </div>
            <p className="font-body text-[14px] text-fog-300 mt-5">
              <Link href="/risorse" className="text-fog-100 underline underline-offset-4 decoration-white/30 hover:text-lime-500 hover:decoration-lime-500 transition-colors">
                Tutte le guide gratuite
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
