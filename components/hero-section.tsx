import HeroButtons from "./herobuttons"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
            Build Winning Trading Strategies with <span className="gradient-text">AI Intelligence</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mx-auto">
            AI-powered trading strategy development with advanced backtesting, real-time data analysis, and intelligent
            insights from news, market data, and SEC filings. Strategy discovery made simple.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <HeroButtons></HeroButtons>
          </div>
        </div>
      </div>
    </section>
  )
}
