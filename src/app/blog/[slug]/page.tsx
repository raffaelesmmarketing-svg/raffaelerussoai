import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import NewsletterCTA from '@/components/sections/NewsletterCTA'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts().map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <div className="pt-24">
      <article className="py-16 px-4 sm:px-6">
        <div className="max-w-[720px] mx-auto">

          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-fog-500 hover:text-lime-500 transition-colors mb-10"
          >
            ← Torna al blog
          </Link>

          {/* Header */}
          <span className="inline-block px-2.5 py-1 rounded-full font-mono text-[10px] tracking-[0.12em] uppercase text-lime-500 bg-lime-500/10 border border-lime-500/25 mb-5">
            {post.category}
          </span>
          <h1
            className="font-display font-extrabold leading-[1.1] tracking-[-0.02em] text-white mb-4"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}
          >
            {post.title}
          </h1>
          <div className="flex items-center gap-4 font-mono text-xs text-fog-500 pb-10 border-b border-white/[0.08] mb-10">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>

          {/* Contenuto */}
          <div className="font-body text-[17px] leading-[1.75] text-fog-300 space-y-5">
            {post.content}
          </div>
        </div>
      </article>

      <NewsletterCTA />
    </div>
  )
}
