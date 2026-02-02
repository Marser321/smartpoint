import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import HeroSection from '@/components/home/hero-section'
import HowItWorks from '@/components/home/how-it-works'
import ServicesCTA from '@/components/home/services-cta'
import TrustBadges from '@/components/home/trust-badges'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
        <ServicesCTA />
        <TrustBadges />
      </main>
      <Footer />
    </>
  )
}
