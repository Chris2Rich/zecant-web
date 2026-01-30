import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function TestArticlePage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                  Test Article
                </h1>
                <p className="text-lg text-muted-foreground">
                  A simple test article for the research section
                </p>
              </div>

              <div className="prose prose-lg max-w-none">
                <p>
                  This is a test article created to demonstrate the research subpage functionality.
                  The content here is intentionally simple and straightforward to serve as a foundation
                  for future research articles.
                </p>

                <h2>Research Overview</h2>
                <p>
                  This article serves as a template for future research content. It demonstrates how
                  individual research articles can be structured and presented within the Zecant platform.
                </p>

                <h3>Key Features</h3>
                <ul>
                  <li>Individual article pages with dedicated URLs</li>
                  <li>Consistent styling with the rest of the platform</li>
                  <li>Scroll reveal animations for enhanced user experience</li>
                  <li>Responsive design for all device sizes</li>
                </ul>

                <h3>Future Enhancements</h3>
                <p>
                  In the future, this system will be enhanced to:
                </p>
                <ul>
                  <li>Fetch articles dynamically from a server</li>
                  <li>Support rich content including charts and interactive elements</li>
                  <li>Include author information and publication dates</li>
                  <li>Enable comments and community discussion</li>
                </ul>

                <p>
                  This test article provides a foundation for building a comprehensive research section
                  that will offer valuable insights and experimentation results to our users.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  )
}