import { Brain, Database, BarChart3, FileText } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Strategy Builder",
    description:
      "Natural language strategy specification with intelligent backtesting and optimization across multiple market conditions.",
    link: "Explore AI builder",
  },
  {
    icon: Database,
    title: "Multi-Source Data",
    description:
      "Real-time market data, news sentiment, option chains, and SEC filings integrated for comprehensive strategy analysis.",
    link: "View data sources",
  },
  {
    icon: BarChart3,
    title: "Advanced Backtesting",
    description:
      "Historical performance analysis with risk metrics, drawdown analysis, and scenario testing across market cycles.",
    link: "Learn about backtesting",
  },
  {
    icon: FileText,
    title: "SEC Filing Analysis",
    description:
      "Automated analysis of 10-K, 10-Q, and 8-K filings with AI-powered insights for fundamental strategy development.",
    link: "Discover filing analysis",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for <span className="gradient-text">Strategy</span> Development
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Everything you need to develop, test, and optimize trading strategies with AI-powered insights and data.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-card/50 rounded-xl border border-border hover:border-primary/50 hover:bg-card/80 transition-all duration-300 hover:scale-[102.5%] hover:glow-primary"
            >
              <div className="mb-4">
                <feature.icon className="w-8 h-8 text-primary group-hover:text-primary/80 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                <span className="gradient-text">{feature.title.split(" ")[0]}</span>{" "}
                {feature.title.split(" ").slice(1).join(" ")}
              </h3>
              <p className="text-foreground mb-4 leading-relaxed">{feature.description}</p>
              <a
                href="#"
                className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center transition-transform duration-300 cursor-pointer"
              >
                {feature.link} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
