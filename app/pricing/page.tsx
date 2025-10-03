"use client"
import { motion } from "framer-motion"
import { ArrowRight, Check } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Button } from "@/components/ui/button"

const pricingTiers = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: "0",
    period: "/month",
    credits: "5",
    discount: "",
    features: [
      "Historical data (1 year)",
      "Community support",
      "Basic analytics dashboard",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    description: "For serious traders",
    price: "199",
    period: "/month",
    credits: "100",
    discount: "10",
    badge: "MOST POPULAR",
    features: [
      "Historical data (10+ years)",
      "Advanced AI strategy optimization",
      "Custom indicators & signals",
      "Advanced analytics & reporting",
      "API access",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Team",
    description: "For professional teams",
    price: "2499",
    credits: "1500",
    discount: "15",
    period: "/month",
    features: [
      "Everything in Pro",
      "Custom data sources",
      "Advanced security & compliance",
      "Team collaboration tools",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/80 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Header />

      <ScrollReveal>
        <section className="container mx-auto px-4 py-24 md:py-32 relative">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Choose Your <span className="text-primary">Trading Edge</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Start free, upgrade when you need more power. All plans include core AI features.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      {tier.badge}
                    </span>
                  </div>
                )}

                {/* Card */}
                <div
                  className={`
                    relative h-full rounded-2xl p-8 
                    bg-card border transition-all duration-300
                    ${
                      tier.highlighted
                        ? "border-primary shadow-[0_0_30px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_50px_rgba(6,182,212,0.5)]"
                        : "border-border group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                    }
                    group-hover:-translate-y-2
                  `}
                >
                  {/* Tier Name & Description */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <p className="text-muted-foreground">{tier.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold">${tier.price}</span>
                      {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                    </div>
                  </div>

                  <div className="container mx-auto mb-4 px-4">
                    <div className="h-[2.5px] bg-gradient-to-r from-transparent via-border to-transparent"></div>
                  </div>

                  {/* Credits */}
                  <div className="mb-4">
                    <div className="flex items-baseline">
                      <span className="font-bold">{tier.credits} Credits</span>
                      {tier.discount && <span className="text-muted-foreground text-sm ml-auto">{tier.discount}% Credit Discount</span>}
                    </div>
                  </div>

                  <div className="container mx-auto mb-4 px-4">
                    <div className="h-[2.5px] bg-gradient-to-r from-transparent via-border to-transparent"></div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-6 flex-grow">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA  */}
                  <Button
                    className={`
                      w-full mt-auto py-3 px-6 rounded-lg font-semibold
                      transition-all duration-300 cursor-pointer group 
                      ${
                        tier.highlighted
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                      }
                    `}
                  >
                    {tier.cta}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ or Additional Info */}
          <div className="mt-20 text-center">
            <p className="text-muted-foreground">
              All plans include 14-day money-back guarantee. No credit card required for free tier.
            </p>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <Footer />
      </ScrollReveal>
    </main>
  )
}
