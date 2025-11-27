import { ScrollReveal } from "@/components/scroll-reveal"
import { Header } from "@/components/header"
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { WhyChooseUs } from '@/components/why-choose-us'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'
import { PricingCards } from './pricing/page'

export default function HomePage() {
  return (
    /* Replaced slate colors with semantic tokens */
    <>
      <Header />
      <ScrollReveal>
        <HeroSection />
      </ScrollReveal>
      <div className="container mx-auto px-4">
        <div className="h-[2.5px] bg-gradient-to-r from-transparent via-border to-transparent"></div>
      </div>
      <ScrollReveal delay={0.2}>
        <FeaturesSection />
      </ScrollReveal>
      <div className="container mx-auto px-4">
        <div className="h-[2.5px] bg-gradient-to-r from-transparent via-border to-transparent"></div>
      </div>
      <ScrollReveal delay={0.2}>
        <PricingCards />
      </ScrollReveal>
      <div className="container mx-auto px-4">
        <div className="h-[2.5px] bg-gradient-to-r from-transparent via-border to-transparent"></div>
      </div>
      <ScrollReveal delay={0.2}>
        <WhyChooseUs />
      </ScrollReveal>
      <div className="container mx-auto px-4">
        <div className="h-[2.5px] bg-gradient-to-r from-transparent via-border to-transparent"></div>
      </div>
      <ScrollReveal delay={0.2}>
        <CTASection />
      </ScrollReveal>
      <Footer />
    </>
  )
}
