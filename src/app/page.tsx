import Hero from '@/components/sections/Hero'
import SocialProof from '@/components/sections/SocialProof'
import AboutSnippet from '@/components/sections/AboutSnippet'
import LatestPosts from '@/components/sections/LatestPosts'
import LeadMagnet from '@/components/sections/LeadMagnet'
import WorkTogether from '@/components/sections/WorkTogether'
import NewsletterCTA from '@/components/sections/NewsletterCTA'
import { getAllPosts } from '@/lib/posts'

export default function HomePage() {
  const posts = getAllPosts()

  return (
    <>
      <Hero />
      <SocialProof />
      <AboutSnippet />
      <LatestPosts posts={posts} />
      <LeadMagnet />
      <WorkTogether />
      <NewsletterCTA />
    </>
  )
}