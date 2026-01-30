export default function Example3Page() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">SDKs & Tools</h1>
        <p className="text-lg text-muted-foreground">
          Developer tools, SDKs, and integration guides for building with Zecant.
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Official SDKs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">JS</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">JavaScript SDK</h3>
                  <p className="text-sm text-muted-foreground">Node.js and browser support</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Full-featured SDK for JavaScript applications with TypeScript support.
              </p>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">npm install @zecant/sdk</span>
              </div>
            </div>

            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold text-sm">PY</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Python SDK</h3>
                  <p className="text-sm text-muted-foreground">Data science and automation</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Python SDK optimized for data analysis and algorithmic trading.
              </p>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">pip install zecant-sdk</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Integration Guides</h2>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Webhooks</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Set up webhooks to receive real-time notifications about portfolio changes, trade executions, and market events.
              </p>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Guide</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Code Examples</span>
              </div>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">OAuth Integration</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Integrate Zecant authentication into your application using OAuth 2.0 flows.
              </p>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Guide</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">OAuth 2.0</span>
              </div>
            </div>

            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Data Export</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Export portfolio data, trading history, and analytics in various formats for external analysis.
              </p>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Guide</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">CSV/JSON</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Developer Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">API</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">API Explorer</h3>
              <p className="text-sm text-muted-foreground">Interactive API testing tool</p>
            </div>

            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">CLI</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Command Line</h3>
              <p className="text-sm text-muted-foreground">CLI tools for automation</p>
            </div>

            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">WEB</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Webhooks Tester</h3>
              <p className="text-sm text-muted-foreground">Test webhook integrations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}