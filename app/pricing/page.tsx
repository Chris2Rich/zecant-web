"use client"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Header } from "@/components/header"
import { motion } from "framer-motion"
import { ArrowRight, Check } from "lucide-react"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"

import { pricingTiers } from "@/business/constants.js"

export function PricingCards() {
  const { isSignedIn } = useUser()
  return <section className="container mx-auto px-4 py-24 md:py-32 relative">
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
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 mx-auto px-4">
      {pricingTiers.map((tier, index) => (
        <motion.div
          key={tier.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative group hover:-translate-y-2 transition-transform duration-300"
        >
          {/* Badge */}
          {tier.badge && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <span className={`px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300
            ${tier.highlighted
                  ? "bg-primary text-primary-foreground group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                  : "bg-card text-secondary-foreground border-border border-1 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                }
            `}>
                {tier.badge}
              </span>
            </div>
          )}

          {/* Card */}
          <div
            className={`
            relative h-full rounded-2xl p-8 
            bg-card border transition-all duration-300 flex flex-col
            ${tier.highlighted
                ? "border-primary shadow-[0_0_30px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_50px_rgba(6,182,212,0.5)]"
                : "border-border group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
              }
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
                {tier.period && <span className="text-muted-foreground text-sm">{tier.period}</span>}
              </div>
            </div>

            <div className="container mx-auto mb-4 px-4">
              <div className="h-[2.5px] bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>

            {/* Credits */}
            <div className="mb-4">
              <div className="flex items-baseline">
                <span className="font-bold">{tier.credits} Credits</span>
                {tier.discount && <span className="text-muted-foreground text-sm ml-auto">
                  + {tier.discount}%
                  <span className="xl:hidden 2xl:inline"> Credit</span> Discount
                </span>}
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
            {!isSignedIn ?
            <Link href={'/sign-up'}>
              <Button
                className={`
              w-full mt-auto py-3 px-6 rounded-lg font-semibold
              transition-all duration-300 cursor-pointer group 
              ${tier.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/70 shadow-lg hover:shadow-xl"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/70 border border-border"
                  }
            `}
              >
                {tier.cta}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link> :
              <Link href={"/settings#plan-" + tier.name}>
                <Button
                  className={`
              w-full mt-auto py-3 px-6 rounded-lg font-semibold
              transition-all duration-300 cursor-pointer group 
              ${tier.highlighted
                      ? "bg-primary text-primary-foreground hover:bg-primary/70 shadow-lg hover:shadow-xl"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/70 border border-border"
                    }
            `}
                >
                  {isSignedIn ? "Switch Tier" : tier.cta}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            }
          </div>
        </motion.div>
      ))}
    </div>

    <div className="mt-20 text-center">
      <p className="text-muted-foreground">
        No card details are required for free tier.
      </p>
    </div>
  </section>
}

export default function PricingPage() {
  return (
    <>
    <Header />

      <ScrollReveal>
        <PricingCards />
      </ScrollReveal>

        <Footer />
      </>
  )
}
