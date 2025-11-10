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
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/80 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="w-full bg-red-500 text-foreground flex">
        <p>
          DO NOT BUY ANYTHING HERE. THIS SITE AND SERVICE ARE IN DEVELOPMENT!
        </p>
      </div>
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
      <ScrollReveal delay={0.2}>
        <Footer />
      </ScrollReveal>
    </main>
  )
}
