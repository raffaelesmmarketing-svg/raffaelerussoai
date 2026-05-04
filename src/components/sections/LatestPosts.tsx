import Reveal from '@/components/Reveal'
import Link from 'next/link'
import { Post } from '@/lib/types'

interface Props {
  posts: Post[]
}

const placeholders = [
  { cat: 'Strategia',   title: 'Come scegliere il primo strumento AI per la tua azienda', excerpt: 'Una checklist pratica in 7 passaggi per non sbagliare il primo investimento.', read: '6 min' },
  { cat: 'Casi studio', title: 'Commercialista risparmia 10 ore a settimana con l\'AI',   excerpt: 'Quali processi automatizzare per primi e quali errori evitare.',               read: '8 min' },
  { cat: 'Fondamenti',  title: 'ChatGPT, Claude, Gemini: quale serve a te?',              excerpt: 'Le differenze spiegate in italiano, senza tecnicismi.',                       read: '5 min' },
]

export default function LatestPosts({ posts }: Props) {
  const items = posts.length > 0 ? posts.slice(0, 3) : null

  return (
    <section id="blog" className="py-32 border-t border-white/[0.08]">
      <div className="max-w-[1200px] mx-auto px-8">
        <Reveal className="flex justify-between items-end mb-12 flex-wrap gap-4">
          <div>
            <div className="eyebrow">Blog</div>
            <h2
              className="font-display font-extrabold tracking-[-0.02em] mt-3"
              style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
            >
              Ultimi <em className="em-lime">articoli</em>
            </h2>
          </div>
          <Link href="/blog" className="group font-display font-bold text-sm text-lime-500 no-underline hidden sm:block">
            Vedi tutti{' '}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {items ? items.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.1}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block p-7 rounded-2xl bg-navy-800 border border-white/[0.08] no-underline h-full transition-all duration-300 hover:border-lime-500 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(184,255,61,0.15),0_12px_32px_rgba(184,255,61,0.08)]"
              >
                <span className="inline-block px-2.5 py-1 rounded-full font-mono text-[10px] tracking-[0.12em] uppercase text-lime-500 bg-lime-500/10 border border-lime-500/25 mb-5">
                  {post.category}
                </span>
                <h3 className="font-display font-bold text-[22px] leading-[1.25] tracking-[-0.01em] text-white mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="font-body text-[15px] leading-[1.55] text-fog-300 mb-6 line-clamp-2">{post.excerpt}</p>
                <div className="pt-4 border-t border-white/[0.08] flex justify-between items-center font-mono text-[11px] tracking-[0.1em] uppercase text-fog-500">
                  <span>{post.readingTime}</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>
              </Link>
            </Reveal>
          )) : placeholders.map((p, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="block p-7 rounded-2xl bg-navy-800 border border-white/[0.08] h-full">
                <span className="inline-block px-2.5 py-1 rounded-full font-mono text-[10px] tracking-[0.12em] uppercase text-lime-500 bg-lime-500/10 border border-lime-500/25 mb-5">
                  {p.cat}
                </span>
                <h3 className="font-display font-bold text-[22px] leading-[1.25] tracking-[-0.01em] text-white mb-3">{p.title}</h3>
                <p className="font-body text-[15px] leading-[1.55] text-fog-300 mb-6">{p.excerpt}</p>
                <div className="pt-4 border-t border-white/[0.08] flex justify-between font-mono text-[11px] tracking-[0.1em] uppercase text-fog-500">
                  <span>{p.read} di lettura</span>
                  <span>In arrivo</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}