import { Brain, Database, BarChart3, FileText, ChartLine } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "AI Strategy Builder",
    description:
    "You describe what you want to happen, we employ powerful quantitative and statistical models to turn your words into edge."
  },
  {
    icon: Database,
    title: "Multi-Source Data",
    description:
      "Zecant has support for custom timeseries data allowing you to bring your own high quality data with little friction.",
  },
  {
    icon: ChartLine,
    title: "Cloud Backtesting",
    description:
      "All strategies can be thoroughly tested within our granular backtesting engine with automatic calculation of key statistics.",
  },
  {
    icon: Brain,
    title: "Deep Analysis",
    description:
      "Zecant has the ability to leverage web data, news data, portfolio positions, market data and more for deep analysis.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for Strategy Development
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Everything you need to develop, test, and optimize trading strategies with AI-powered insights and data.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-sm hover:-translate-y-2 bg-card/70 backdrop-blur-glass border transition-all duration-300 border-border-divider hover:border-primary/50 hover:inner-light-subtle"
            >
              <div className="mb-4">
                <feature.icon className="w-8 h-8 text-primary group-hover:text-primary/95 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
