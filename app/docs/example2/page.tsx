export default function Example2Page() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Trading Strategy Development</h1>
        <p className="text-lg text-muted-foreground">
          Learn how to develop, test, and optimize trading strategies using AI/ML techniques.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Strategy Development Process</h2>
          <p className="text-muted-foreground mb-4">
            Building successful trading strategies involves systematic research, testing, and optimization.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Research & Hypothesis</h3>
              <p className="text-sm text-muted-foreground">
                Identify market inefficiencies and develop trading hypotheses based on data analysis.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Backtesting & Validation</h3>
              <p className="text-sm text-muted-foreground">
                Test strategies on historical data to validate performance and identify potential issues.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Common Strategy Types</h2>
          <p className="text-muted-foreground mb-4">
            Explore different approaches to algorithmic trading:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center space-x-2">
              <span className="text-foreground">•</span>
              <span><strong>Momentum Strategies:</strong> Capitalize on continuing trends in asset prices</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-foreground">•</span>
              <span><strong>Mean Reversion:</strong> Bet on prices returning to their historical average</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-foreground">•</span>
              <span><strong>Arbitrage:</strong> Exploit price differences across markets or assets</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-foreground">•</span>
              <span><strong>Market Making:</strong> Provide liquidity and profit from bid-ask spreads</span>
            </li>
          </ul>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Performance Metrics</h2>
          <p className="text-muted-foreground mb-4">
            Key metrics to evaluate strategy performance:
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Sharpe Ratio</span>
              <span className="text-sm text-muted-foreground">Risk-adjusted returns</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Maximum Drawdown</span>
              <span className="text-sm text-muted-foreground">Largest peak-to-trough decline</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Win Rate</span>
              <span className="text-sm text-muted-foreground">Percentage of profitable trades</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Profit Factor</span>
              <span className="text-sm text-muted-foreground">Gross profit divided by gross loss</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
