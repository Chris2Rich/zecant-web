import { Star, TrendingUp, Brain, Lock } from "lucide-react"

export function BentoGrid() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to <span className="gradient-text">Win</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Discover the AI-powered tools and data sources that make strategy development intuitive and effective.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-min gap-4">
          <div className="lg:row-span-3 bg-gradient-to-br from-card to-muted rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4 gradient-text">Strategy Backtesting</h3>
            <div className="flex items-center justify-center h-40">
              <img
                src="/placeholder.svg?height=160&width=240"
                alt="Strategy Backtesting"
                className="w-full h-full object-cover rounded-lg opacity-80"
              />
            </div>
          </div>

          <div className="bg-card/50 rounded-xl border border-border p-6">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-semibold">AI Strategy Builder</h3>
                <p className="text-sm text-muted-foreground">Natural Language</p>
              </div>
            </div>
          </div>

          <div className="lg:row-span-3 bg-gradient-to-br from-card to-muted rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4 gradient-text">Strategy Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg. Return</span>
                <span className="font-semibold text-primary">+18.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                <span className="font-semibold text-chart-2">2.34</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Max Drawdown</span>
                <span className="font-semibold">-8.2%</span>
              </div>
            </div>
          </div>

          <div className="bg-card/50 rounded-xl border border-border p-6">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-primary rounded text-primary-foreground flex items-center justify-center text-xs font-bold">
                {"123"}
              </div>
              <div>
                <h3 className="font-semibold">Data Sources</h3>
                <p className="text-sm text-muted-foreground">News, SEC, Options</p>
              </div>
            </div>
          </div>

          <div className="lg:row-span-2 bg-card/50 rounded-xl border border-border p-6">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h3 className="font-semibold">Backtests</h3>
            </div>
            <div className="text-2xl font-bold text-chart-2">10M+</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>

          <div className="lg:row-span-2 bg-card/50 rounded-xl border border-border p-6">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>

          <div className="bg-card/50 rounded-xl border border-border p-6">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>

          <div className="bg-card/50 rounded-xl border border-border p-6">
            <div className="flex items-center space-x-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-chart-4 text-chart-4" />
              ))}
            </div>
            <p className="text-sm text-foreground">"Strategies are so easy to build"</p>
          </div>

          <div className="lg:row-span-3 bg-gradient-to-br from-card to-muted rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4 gradient-text">Processing Speed</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">&lt;30s</div>
              <div className="text-sm text-muted-foreground">Strategy Analysis</div>
            </div>
          </div>

          <div className="lg:row-span-2 bg-card/50 rounded-xl border border-border p-6">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">500K+</div>
              <div className="text-sm text-muted-foreground">Strategies Created</div>
            </div>
          </div>

          <div className="bg-card/50 rounded-xl border border-border p-6">
            <div className="flex items-center space-x-3">
              <Lock className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-semibold">Secure</h3>
                <p className="text-sm text-muted-foreground">SOC 2 Type II</p>
              </div>
            </div>
          </div>

          <div className="lg:row-span-3 bg-card/50 rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4 gradient-text">Enterprise Ready</h3>
            <div className="space-y-2">
              <div className="text-sm text-foreground">✓ SOC 2 Compliant</div>
              <div className="text-sm text-foreground">✓ GDPR Compliant</div>
              <div className="text-sm text-foreground">✓ ISO 27001</div>
            </div>
          </div>

          <div className="lg:row-span-2 bg-card/50 rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-2 gradient-text">Data Integration</h3>
            <div className="text-sm text-muted-foreground">SEC filings, News, Market data</div>
          </div>
        </div>
      </div>
    </section>
  )
}
