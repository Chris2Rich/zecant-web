import { ArticleOverview, ArticleEmphasised } from "@/components/articles"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"

const sampleArticles = [
  {
    title: "Test Article",
    description: "This is a test article created to demonstrate the research subpage functionality. The content here is intentionally simple and straightforward to serve as a foundation for future research articles.",
    url: "/research/test-article",
    urlToImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    publishedAt: "2026-01-30T10:00:00Z",
    source: { name: "Zecant Research" },
    category: ["Test", "Research"]
  }
]

export default function ResearchPage() {
  const featuredArticle = sampleArticles[0]
  const gridArticles = sampleArticles.slice(1)

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-4">Research & Insights</h1>
                <p className="text-lg text-muted-foreground">
                  Stay informed with the latest financial research, market analysis, and investment insights.
                </p>
              </div>

              {/* Featured Article */}
              <div className="mb-12">
                <ArticleEmphasised article={featuredArticle} />
              </div>

              {/* Article Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridArticles.map((article, index) => (
                  <ArticleOverview key={index} article={article} index={index} />
                ))}
              </div>

              {/* Load More Section */}
              <div className="mt-12 text-center">
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Load More Articles
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  )
}
