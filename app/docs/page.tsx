export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive guides and API references for the Zecant platform.
        </p>
      </div>

      <div className="bg-muted/30 rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Documentation Coming Soon
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We're working hard to bring you comprehensive documentation for the Zecant platform.
            Check back soon for detailed guides, API references, and tutorials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-4 bg-card rounded-lg border border-border">
            <h3 className="font-semibold text-foreground mb-2">Getting Started</h3>
            <p className="text-sm text-muted-foreground">
              Learn the basics of using Zecant
            </p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <h3 className="font-semibold text-foreground mb-2">API Reference</h3>
            <p className="text-sm text-muted-foreground">
              Complete API documentation
            </p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <h3 className="font-semibold text-foreground mb-2">SDKs & Tools</h3>
            <p className="text-sm text-muted-foreground">
              Integration guides and tools
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}