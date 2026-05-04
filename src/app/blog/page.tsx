import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Blog',
  description: "Articoli sull'AI applicata al business. Strategie, tool e casi reali per imprenditori italiani.",
}

const categories = ['Tutti', 'AI', 'Marketing', 'Imprenditoria', 'Tool']

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="pt-24">
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">

          <div className="mb-12">
            <div className="eyebrow">Blog</div>
            <h1
              className="font-display font-extrabold tracking-[-0.02em] mt-3 mb-4 text-white"
              style={{ fontSize: 'clamp(36px, 4vw, 56px)' }}
            >
              Tutti gli <em className="em-lime">articoli</em>
            </h1>
            <p className="font-body text-[17px] text-fog-300 max-w-xl">
              AI applicata al business. Strategie, tool e casi reali — senza teoria inutile.
            </p>
          </div>

          {/* Filtri categoria */}
          <div className="flex gap-2 flex-wrap mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                className="px-4 py-1.5 rounded-full font-mono text-xs font-bold tracking-[0.1em] uppercase border border-white/[0.12] text-fog-300 hover:border-lime-500 hover:text-lime-500 transition-colors duration-200"
              >
                {cat}
              </button>
            ))}
          </div>

          {posts.length === 0 ? (
            <div className="py-32 text-center border border-white/[0.08] rounded-2xl">
              <p className="font-display font-bold text-xl text-white mb-2">
                I primi articoli sono in arrivo.
              </p>
              <p className="font-body text-sm text-fog-500">
                Iscriviti alla newsletter per essere il primo a leggerli.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map(post => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block p-7 rounded-2xl bg-navy-800 border border-white/[0.08] no-underline transition-all duration-300 hover:border-lime-500 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(184,255,61,0.15),0_12px_32px_rgba(184,255,61,0.08)]"
                >
                  <span className="inline-block px-2.5 py-1 rounded-full font-mono text-[10px] tracking-[0.12em] uppercase text-lime-500 bg-lime-500/10 border border-lime-500/25 mb-5">
                    {post.category}
                  </span>
                  <h2 className="font-display font-bold text-[20px] leading-[1.25] text-white group-hover:text-lime-500 transition-colors mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="font-body text-[15px] leading-[1.55] text-fog-300 line-clamp-3 mb-6">
                    {post.excerpt}
                  </p>
                  <div className="pt-4 border-t border-white/[0.08] flex justify-between font-mono text-[11px] tracking-[0.1em] uppercase text-fog-500">
                    <span>{post.date}</span>
                    <span>{post.readingTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}