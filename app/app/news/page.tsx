"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Clock, Newspaper, Loader2 } from "lucide-react";
import { ArticleEmphasised, ArticleOverview, ArticleHeader } from "@/components/articles";
import * as newsService from "@/lib/services/newsService";
import type { NewsArticle } from "@/lib/services/newsService";

export default function NewsfeedPage() {
  const [category, setCategory] = useState('general');
  const [articles, setArticles] = useState<ArticleHeader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { getToken } = useAuth();

  const categories = [
    { id: 'general', label: 'General' },
    { id: 'technology', label: 'Technology' },
    { id: 'retail', label: 'Retail' },
    { id: 'life_sciences', label: 'Life Sciences' },
    { id: 'politics', label: 'Politics' },
    { id: 'developing_markets', label: 'Developing Markets' },
  ];

  // Map URL category to internal category for API
  const categoryMap: Record<string, string> = {
    'general': 'general',
    'technology': 'technology',
    'retail': 'retail',
    'life_sciences': 'life sciences',
    'politics': 'politics',
    'developing_markets': 'developing markets'
  };

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const internalCategory = categoryMap[category] || 'general';
      const response = await newsService.getNewsByCategory(
        internalCategory,
        15,
        getToken
      );
      
      // Convert API response to ArticleHeader format
      const formattedArticles: ArticleHeader[] = response.articles.map((article: NewsArticle) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        source: article.source,
        category: article.category
      }));
      
      setArticles(formattedArticles);
    } catch (err: any) {
      console.error("Error fetching news:", err);
      setError(err.message || "Failed to load news");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category, getToken]);

  const filteredArticles = category === 'general' 
    ? articles 
    : articles.filter(article => article.category.includes(categoryMap[category] || category));

  const featuredArticle = filteredArticles[0];
  const gridArticles = filteredArticles.slice(1);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header with Categories */}
        <div className="flex items-center gap-6 mb-8 pb-4 border-b border-border overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`text-sm font-medium transition-colors relative pb-1 whitespace-nowrap ${
                category === cat.id
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.label}
              {category === cat.id && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Loading news...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">{error}</div>
            <button 
              onClick={fetchNews}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && filteredArticles.length > 0 && (
          <>
            {/* Featured Article - Large */}
            {featuredArticle && (
              <ArticleEmphasised article={featuredArticle} />
            )}

            {/* Grid Articles - Smaller */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridArticles.map((article, index) => (
                <ArticleOverview article={article} index={index} key={index} />
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <Newspaper className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No articles found</h3>
            <p className="text-muted-foreground">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
}
