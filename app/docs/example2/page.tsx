export default function Example2Page() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">API Reference</h1>
        <p className="text-lg text-muted-foreground">
          Complete documentation for Zecant's REST API endpoints and integration guides.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Authentication</h2>
          <p className="text-muted-foreground mb-4">
            All API requests require authentication using your API key. Include the key in the Authorization header.
          </p>
          <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm">
            <div className="text-muted-foreground mb-2">Example:</div>
            <div>Authorization: Bearer your-api-key-here</div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Portfolio Endpoints</h2>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">GET /api/portfolio</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">GET</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Retrieve current portfolio holdings and positions.</p>
              <div className="bg-muted/30 rounded p-2 font-mono text-xs">
                Response: Portfolio object with holdings array
              </div>
            </div>

            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">POST /api/portfolio/sync</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">POST</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Sync portfolio data with connected brokers.</p>
              <div className="bg-muted/30 rounded p-2 font-mono text-xs">
                Response: Sync status and updated holdings
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Strategy Endpoints</h2>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">GET /api/strategies</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">GET</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">List all available trading strategies.</p>
              <div className="bg-muted/30 rounded p-2 font-mono text-xs">
                Response: Array of strategy objects
              </div>
            </div>

            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">POST /api/strategies/backtest</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">POST</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Run backtesting simulation for a strategy.</p>
              <div className="bg-muted/30 rounded p-2 font-mono text-xs">
                Body: strategy_id, start_date, end_date
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}