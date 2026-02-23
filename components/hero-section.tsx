import HeroButtons from "./herobuttons"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-tight text-nowrap">
            Turn <span className="gradient-text">Ideas</span> Into Alpha
          </h1>
          <p className="lg:text-xl md:text-lg text-muted-foreground leading-relaxed mx-auto">
            Programmatically generate and backtest trading strategies using natural language.<br /> Algorithmic trading democratised.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <HeroButtons></HeroButtons>
          </div>
        </div>
      </div>
    </section>
  )
}
