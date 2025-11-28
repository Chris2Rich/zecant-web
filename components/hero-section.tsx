import HeroButtons from "./herobuttons"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight">
            Build Winning Strategies with <span className="gradient-text">AI Intelligence</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mx-auto">
            Zecant offers AI-powered trading strategy development with advanced backtesting, real-time data analysis, and intelligent
            insights. Strategy discovery made simple.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <HeroButtons></HeroButtons>
          </div>
        </div>
      </div>
    </section>
  )
}
