import { Brain, Database, BarChart3, FileText } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Strategy Builder",
    description:
      "Natural language strategy specification with intelligent backtesting and optimization across multiple market conditions.",
  },
  {
    icon: Database,
    title: "Multi-Source Data",
    description:
      "Historical market data, news sentiment, option chains, and SEC filings integrated for comprehensive strategy analysis.",
  },
  {
    icon: BarChart3,
    title: "Advanced Backtesting",
    description:
      "Historical performance analysis with risk metrics, drawdown analysis, and scenario testing across market cycles.",
  },
  {
    icon: FileText,
    title: "SEC Filing Analysis",
    description:
      "Automated analysis of 10-K, 10-Q, and 8-K filings with AI-powered insights for fundamental strategy development.",
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
