import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-black mb-6 text-balance">
          Ready to <span className="gradient-text">Transform</span> Your Trading?
        </h2>
        <p className="text-xl text-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Join the professional traders who've already discovered the Zecant advantage. Start your journey to trading
          success today.
        </p>

        <Button
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl px-12 py-6 glow-primary-intense hover:transition-all duration-300 hover:scale-105 hover:-translate-y-1 group cursor-pointer"
        >
          Start Building
          <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>

        <p className="text-sm text-muted-foreground mt-6">
          Risk Warning: Trading involves substantial risk and may result in losses.
        </p>
      </div>
    </section>
  )
}
