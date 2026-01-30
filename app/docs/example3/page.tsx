export default function Example3Page() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Model Selection & Optimization</h1>
        <p className="text-lg text-muted-foreground">
          Learn how to select, tune, and optimize machine learning models for trading strategies.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Model Selection Process</h2>
          <p className="text-muted-foreground mb-4">
            Choosing the right model architecture is crucial for successful trading strategies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Problem Analysis</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Understand your trading problem and select appropriate model types.
              </p>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">• Classification vs Regression</div>
                <div className="text-xs text-muted-foreground">• Time series considerations</div>
                <div className="text-xs text-muted-foreground">• Feature engineering requirements</div>
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Model Evaluation</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Use proper validation techniques to assess model performance.
              </p>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">• Cross-validation strategies</div>
                <div className="text-xs text-muted-foreground">• Out-of-sample testing</div>
                <div className="text-xs text-muted-foreground">• Walk-forward analysis</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Hyperparameter Optimization</h2>
          <p className="text-muted-foreground mb-4">
            Fine-tune your models for optimal performance:
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary font-semibold">Grid</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Grid Search</h3>
                <p className="text-sm text-muted-foreground">Systematic exploration of hyperparameter combinations.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary font-semibold">Random</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Random Search</h3>
                <p className="text-sm text-muted-foreground">Efficient sampling of hyperparameter space.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary font-semibold">Bayes</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Bayesian Optimization</h3>
                <p className="text-sm text-muted-foreground">Intelligent search using probabilistic models.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Common Model Architectures</h2>
          <p className="text-muted-foreground mb-4">
            Popular models for trading applications:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-sm">🌳</span>
              </div>
              <span className="text-xs text-muted-foreground">Random Forest</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <span className="text-xs text-muted-foreground">Neural Networks</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-sm">⚡</span>
              </div>
              <span className="text-xs text-muted-foreground">XGBoost</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-muted rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-sm">🔄</span>
              </div>
              <span className="text-xs text-muted-foreground">LSTM/RNN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
