import Hero from '@/components/sections/Hero'
import SocialProof from '@/components/sections/SocialProof'
import MarqueeSection from '@/components/sections/Marquee'
import AboutSnippet from '@/components/sections/AboutSnippet'
import BentoFeatures from '@/components/sections/BentoFeatures'
import LatestPosts from '@/components/sections/LatestPosts'
import LeadMagnet from '@/components/sections/LeadMagnet'
import Testimonials from '@/components/sections/Testimonials'
import PricingCard from '@/components/sections/PricingCard'
import WorkTogether from '@/components/sections/WorkTogether'
import FAQ from '@/components/sections/FAQ'
import NewsletterCTA from '@/components/sections/NewsletterCTA'
import { getAllPosts } from '@/lib/posts'

export default function HomePage() {
  const posts = getAllPosts()

  return (
    <>
      <Hero />
      <SocialProof />
      <MarqueeSection />
      <AboutSnippet />
      <BentoFeatures />
      <LatestPosts posts={posts} />
      <LeadMagnet />
      <Testimonials />
      <PricingCard />
      <WorkTogether />
      <FAQ />
      <NewsletterCTA />
    </>
  )
}