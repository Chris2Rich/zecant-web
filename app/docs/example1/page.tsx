export default function Example1Page() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Getting Started</h1>
        <p className="text-lg text-muted-foreground">
          Learn the basics of using Zecant platform and get up and running quickly.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Welcome to Zecant</h2>
          <p className="text-muted-foreground mb-4">
            Zecant is a comprehensive trading platform that combines advanced analytics, AI-powered insights,
            and institutional-grade tools to help you make informed trading decisions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Portfolio Management</h3>
              <p className="text-sm text-muted-foreground">
                Track your investments, analyze performance, and manage risk across multiple assets.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Strategy Building</h3>
              <p className="text-sm text-muted-foreground">
                Create, test, and deploy custom trading strategies with our intuitive strategy builder.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Quick Start Guide</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">1</div>
              <div>
                <h3 className="font-semibold text-foreground">Create Your Account</h3>
                <p className="text-sm text-muted-foreground">Sign up for a free account to access basic features and explore the platform.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">2</div>
              <div>
                <h3 className="font-semibold text-foreground">Connect Your Broker</h3>
                <p className="text-sm text-muted-foreground">Link your trading accounts to import portfolio data and enable live trading.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">3</div>
              <div>
                <h3 className="font-semibold text-foreground">Explore Features</h3>
                <p className="text-sm text-muted-foreground">Try out our AI chat, strategy builder, and analytics tools to enhance your trading.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}