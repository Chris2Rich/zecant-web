import { Button } from "@/components/ui/button"
import { Play, Shield, ArrowRight, TrendingUp, FileHeartIcon as FileChartColumn } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="container mx-auto px-4 grid lg:grid-cols-5 gap-12 items-center">
        <div className="lg:col-span-3 space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-balance">
            Build Winning Trading Strategies with <span className="gradient-text">AI Intelligence</span>
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl text-pretty">
            AI-powered trading strategy development with advanced backtesting, real-time data analysis, and intelligent
            insights from news, market data, and SEC filings. Strategy creation made simple.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-4 glow-primary-intense hover:transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              Start Building
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="group border-border text-foreground hover:border-primary hover:text-primary hover:bg-primary/10 font-semibold text-lg px-8 py-4 hover:glow-primary transition-all duration-300 hover:scale-105 bg-transparent cursor-pointer"
            >
              View Demo
              <Play className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>

          <div className="flex items-center space-x-6 pt-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>10M+ Backtests</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <FileChartColumn className="w-4 h-4 text-primary" />
              <span>500K+ Reports</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>SOC 2 Compliant</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-card to-muted rounded-2xl border border-border overflow-hidden">
              <img
                src="/placeholder.svg?height=600&width=800"
                alt="TradePro AI Strategy Dashboard"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse delay-1000" />
          </div>
        </div>
      </div>
    </section>
  )
}
