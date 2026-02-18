"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Clock, Newspaper, Loader2 } from "lucide-react";
import { ArticleEmphasised, ArticleOverview, ArticleHeader } from "@/components/articles";
import * as newsService from "@/lib/services/newsService";
import type { NewsArticle } from "@/lib/services/newsService";

const PAGE_SIZE = 20;

export default function NewsfeedPage() {
  const [category, setCategory] = useState('general');
  const [articles, setArticles] = useState<ArticleHeader[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastArticleRef = useCallback<(node: HTMLElement | null) => void>((node) => {
    if (isLoadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        setIsLoadingMore(true);
        setPage((prev) => prev + 1);
      }
    }, { threshold: 0.1 });
    
    if (node) observerRef.current.observe(node);
  }, [isLoadingMore, hasMore, isLoading]);
  
  const { getToken } = useAuth();

  const categories = [
    { id: 'general', label: 'General' },
    { id: 'technology', label: 'Technology' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'politics', label: 'Politics' },
    { id: 'developing_markets', label: 'Developing Markets' },
  ];

  const fetchNews = async (pageNum: number, reset: boolean = false) => {
    if (reset) {
      setIsLoading(true);
      setArticles([]);
      setPage(1);
      setHasMore(true);
    }
    
    setError(null);
    
    try {
      const response = await newsService.getNewsPaginated(
        category,
        pageNum,
        PAGE_SIZE,
        getToken
      );
      
      const formattedArticles: ArticleHeader[] = response.articles.map((article: NewsArticle) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        source: article.source,
        category: article.category,
        tags: article.tags || []
      }));
      
      if (reset) {
        setArticles(formattedArticles);
      } else {
        setArticles((prev) => [...prev, ...formattedArticles]);
      }
      
      setHasMore(response.pagination.has_next);
    } catch (err: any) {
      console.error("Error fetching news:", err);
      setError(err.message || "Failed to load news");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNews(1, true);
  }, [category]);

  useEffect(() => {
    if (page > 1) {
      fetchNews(page, false);
    }
  }, [page]);

  const handleCategoryChange = (newCategory: string) => {
    if (newCategory !== category) {
      setCategory(newCategory);
      setPage(1);
    }
  };

  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1);

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-6 mb-8 pb-4 border-b border-border overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
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

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Loading news...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">{error}</div>
            <button 
              onClick={() => fetchNews(1, true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && articles.length > 0 && (
          <>
            {featuredArticle && (
              <ArticleEmphasised article={featuredArticle} />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridArticles.map((article, index) => (
                <div 
                  key={`${article.url}-${index}`}
                  ref={index === gridArticles.length - 1 ? lastArticleRef : undefined}
                >
                  <ArticleOverview article={article} index={index} />
                </div>
              ))}
            </div>

            {isLoadingMore && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground text-sm">Loading more...</span>
              </div>
            )}

            {!hasMore && articles.length > 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                You&apos;ve reached the end of the news feed
              </div>
            )}
          </>
        )}

        {!isLoading && !error && articles.length === 0 && (
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
