export default function Example1Page() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Getting Started with AI/ML Frameworks</h1>
        <p className="text-lg text-muted-foreground">
          Learn how to implement and use AI/ML frameworks for trading strategies.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction to Trading AI</h2>
          <p className="text-muted-foreground mb-4">
            Discover how artificial intelligence and machine learning are revolutionizing algorithmic trading.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Reinforcement Learning</h3>
              <p className="text-sm text-muted-foreground">
                Learn how agents learn optimal trading strategies through trial and error with rewards and penalties.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Deep Q-Networks</h3>
              <p className="text-sm text-muted-foreground">
                Combine Q-Learning with deep neural networks to handle complex state spaces in financial markets.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Key Concepts</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">1</div>
              <div>
                <h3 className="font-semibold text-foreground">Understanding AI in Trading</h3>
                <p className="text-sm text-muted-foreground">Learn how machine learning algorithms can identify patterns and make predictions in financial markets.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">2</div>
              <div>
                <h3 className="font-semibold text-foreground">Reinforcement Learning Basics</h3>
                <p className="text-sm text-muted-foreground">Understand how agents learn optimal trading strategies through trial and error.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">3</div>
              <div>
                <h3 className="font-semibold text-foreground">Implement Your First Strategy</h3>
                <p className="text-sm text-muted-foreground">Build and test your first AI-powered trading algorithm.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
