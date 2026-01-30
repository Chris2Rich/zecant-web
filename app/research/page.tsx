import { ArticleOverview, ArticleEmphasised } from "@/components/articles"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"

const sampleArticles = [
  {
    title: "Market Volatility and Risk Management Strategies",
    description: "An in-depth analysis of how institutional investors navigate market volatility through advanced risk management techniques and portfolio diversification strategies.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
    publishedAt: "2026-01-28T10:00:00Z",
    source: { name: "Financial Times" },
    category: ["Risk Management", "Markets"]
  },
  {
    title: "AI-Driven Trading: The Future of Algorithmic Strategies",
    description: "Exploring how artificial intelligence is revolutionizing algorithmic trading, from pattern recognition to predictive modeling and automated execution.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    publishedAt: "2026-01-27T14:30:00Z",
    source: { name: "Bloomberg" },
    category: ["AI", "Technology"]
  },
  {
    title: "Sustainable Investing: ESG Factors in Portfolio Construction",
    description: "How environmental, social, and governance factors are increasingly becoming critical considerations in modern portfolio management and investment decisions.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
    publishedAt: "2026-01-26T09:15:00Z",
    source: { name: "The Economist" },
    category: ["ESG", "Sustainability"]
  },
  {
    title: "Cryptocurrency Market Analysis: Q1 2026 Trends",
    description: "A comprehensive review of cryptocurrency market performance, regulatory developments, and emerging trends shaping the digital asset landscape.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop",
    publishedAt: "2026-01-25T16:45:00Z",
    source: { name: "CoinDesk" },
    category: ["Cryptocurrency", "Markets"]
  },
  {
    title: "Quantitative Finance: Modern Portfolio Theory Revisited",
    description: "Re-examining Modern Portfolio Theory in the context of today's complex financial markets and the role of alternative investments.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    publishedAt: "2026-01-24T11:20:00Z",
    source: { name: "Harvard Business Review" },
    category: ["Quantitative Finance", "Theory"]
  },
  {
    title: "Global Economic Outlook: 2026 and Beyond",
    description: "Expert analysis of global economic trends, including inflation dynamics, interest rate policies, and geopolitical factors affecting markets.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=400&fit=crop",
    publishedAt: "2026-01-23T13:10:00Z",
    source: { name: "The Wall Street Journal" },
    category: ["Economics", "Global Markets"]
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
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                  Research & <span className="text-primary">Insights</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
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
