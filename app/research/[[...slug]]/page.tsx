import { headers } from "next/headers";
import { getArticle, getAllArticles } from "@/lib/articles";
import MarkdownRender from "@/components/MarkdownRender";
import { ArticleOverview, ArticleEmphasised, ArticleHeader } from "@/components/articles";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/scroll-reveal";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

function transformArticle(meta: Awaited<ReturnType<typeof getAllArticles>>[0]): ArticleHeader {
  return {
    title: meta.title,
    description: meta.description,
    url: `/research/${meta.slug}`,
    urlToImage: meta.urlToImage,
    publishedAt: meta.publishedAt,
    source: { name: "Zecant Research" },
    category: [],
  }
}

function ArticleListing({ articles }: { articles: Awaited<ReturnType<typeof getAllArticles>> }) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No articles available yet.</p>
      </div>
    );
  }

  const featuredArticle = transformArticle(articles[0]);
  const gridArticles = articles.slice(1).map(transformArticle);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Research & Insights</h1>
        <p className="text-lg text-muted-foreground">
          Stay informed with the latest financial research, market analysis, and investment insights.
        </p>
      </div>

      <div className="mb-12">
        <ArticleEmphasised article={featuredArticle} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gridArticles.map((article, index) => (
          <ArticleOverview key={index} article={article} index={index} />
        ))}
      </div>
    </div>
  );
}

export default async function ArticlePage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  
  const article = await getArticle(slug);
  
  if (!article) {
    const articles = await getAllArticles();
    
    return (
      <>
        <Header />
        <main className="pt-32 pb-16">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <ArticleListing articles={articles} />
            </ScrollReveal>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  const formattedDate = new Date(article.meta.publishedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <>
      <Header />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <Link href="/research" className="float-right">
              <Button variant="outline">
              <X className="w-4 h-4" />
              </Button>
            </Link>
            <article className="max-w-4xl mx-auto">
              <header className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                  {article.meta.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  {article.meta.description}
                </p>
                <time className="text-sm text-muted-foreground">
                  {formattedDate}
                </time>
              </header>

              {article.meta.urlToImage && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img
                    src={article.meta.urlToImage}
                    alt={article.meta.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                <MarkdownRender message={article.content} />
              </div>
            </article>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  
  const article = await getArticle(slug);
  
  if (!article) {
    return {};
  }
  
  return {
    title: `${article.meta.title}`,
    description: article.meta.description,
  };
}
