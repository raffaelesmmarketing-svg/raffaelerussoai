import Hero from '@/components/sections/Hero'
import MarqueeSection from '@/components/sections/Marquee'
import AboutSnippet from '@/components/sections/AboutSnippet'
import BentoFeatures from '@/components/sections/BentoFeatures'
import LatestPosts from '@/components/sections/LatestPosts'
import GuideGratuite from '@/components/sections/GuideGratuite'
import Testimonials from '@/components/sections/Testimonials'
import FAQ from '@/components/sections/FAQ'
import ChiamataCTA from '@/components/sections/ChiamataCTA'
import { getAllPosts } from '@/lib/posts'

export default function HomePage() {
  const posts = getAllPosts()

  return (
    <>
      <Hero />
      <MarqueeSection />
      <AboutSnippet />
      <BentoFeatures />
      <LatestPosts posts={posts} />
      <GuideGratuite />
      <Testimonials />
      <FAQ />
      <ChiamataCTA />
    </>
  )
}
