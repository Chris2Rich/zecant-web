import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import HeroButtons from "./herobuttons"

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
          Generate Ideas, build confidence
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Get started with Zecant's investment research platform today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <HeroButtons></HeroButtons>
        </div>
      </div>
    </section>
  )
}
