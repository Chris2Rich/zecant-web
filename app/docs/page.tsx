export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Documentation Overview</h1>
        <p className="text-lg text-muted-foreground">
          Everything you need to get started with Zecant platform and build powerful trading applications.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Quick Start</h2>
          <p className="text-muted-foreground mb-4">
            Get up and running with Zecant in minutes. Our platform offers comprehensive tools for portfolio management,
            strategy development, and AI-powered trading insights.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Sign Up</h3>
              <p className="text-sm text-muted-foreground">Create your free account</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Connect</h3>
              <p className="text-sm text-muted-foreground">Link your trading accounts</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Trade</h3>
              <p className="text-sm text-muted-foreground">Start building strategies</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-xl font-semibold text-foreground mb-3">Platform Features</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center space-x-2">
                <span className="text-primary">•</span>
                <span>Real-time portfolio tracking</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-primary">•</span>
                <span>AI-powered trading insights</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-primary">•</span>
                <span>Advanced strategy builder</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-primary">•</span>
                <span>Risk management tools</span>
              </li>
            </ul>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-xl font-semibold text-foreground mb-3">Developer Resources</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center space-x-2">
                <span className="text-primary">•</span>
                <span>REST API documentation</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-primary">•</span>
                <span>SDKs for JavaScript & Python</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-primary">•</span>
                <span>Webhook integrations</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-primary">•</span>
                <span>OAuth authentication</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Need Help?</h2>
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/issues"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center"
            >
              Report an Issue
            </a>
            <a
              href="mailto:support@zecant.com"
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors text-center"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}