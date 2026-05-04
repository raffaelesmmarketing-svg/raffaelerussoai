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
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Blog</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Tutti gli articoli</h1>
            <p className="text-gray-500 max-w-xl">
              AI applicata al business. Strategie, tool e casi reali — senza teoria inutile.
            </p>
          </div>

          <div className="flex gap-2 flex-wrap mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                className="px-4 py-1.5 rounded-full text-sm border border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>

          {posts.length === 0 ? (
            <div className="py-24 text-center text-gray-400">
              <p className="text-lg">I primi articoli sono in arrivo.</p>
              <p className="text-sm mt-2">Iscriviti alla newsletter per essere il primo a leggerli.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-300 transition-colors">
                  <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-3">
                    {post.category}
                  </span>
                  <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
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