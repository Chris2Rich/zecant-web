import { Shield, TrendingUp, FileChartColumn } from "lucide-react"
import HeroButtons from "./herobuttons"

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
            insights from news, market data, and SEC filings. Strategy discovery made simple.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <HeroButtons></HeroButtons>
          </div>

          <div className="flex items-center space-x-6 pt-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Run Backtests</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <FileChartColumn className="w-4 h-4 text-primary" />
              <span>AI Reports</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>SOC 2 Security</span>
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
          </div>
        </div>
      </div>
    </section>
  )
}
