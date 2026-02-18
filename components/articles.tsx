"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Newspaper } from "lucide-react";
import { formatDate } from "@/business/utils";
import Link from "next/link";

export interface ArticleHeader {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: { name: string };
    category: Array<string>;
    tags?: string[];
}

const TAG_COLORS: Record<string, string> = {
  stocks: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  crypto: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  forex: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  bonds: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  etf: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  commodities: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  earnings: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  tech: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  fed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  inflation: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  markets: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
  default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

function getTagColor(tag: string): string {
  return TAG_COLORS[tag.toLowerCase()] || TAG_COLORS.default;
}

function ArticleTags({ tags, maxTags = 3 }: { tags?: string[]; maxTags?: number }) {
  if (!tags || tags.length === 0) return null;
  
  const displayTags = tags.slice(0, maxTags);
  
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {displayTags.map((tag) => (
        <span
          key={tag}
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTagColor(tag)}`}
        >
          {tag}
        </span>
      ))}
      {tags.length > maxTags && (
        <span className="text-xs px-2 py-0.5 text-muted-foreground">
          +{tags.length - maxTags}
        </span>
      )}
    </div>
  );
}

export function ArticleOverview({article, index=0} : {article: ArticleHeader, index?: number}){
    return <Link href={article.url}><motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer"
                >
                  <div className="relative h-48 rounded-sm overflow-hidden mb-3">
                    {article.urlToImage ? (
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Newspaper className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="font-semibold text-foreground">{article.source.name}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(article.publishedAt)}
                    </div>
                  </div>
                  
                  <h2 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h2>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {article.description}
                  </p>
                  
                  <ArticleTags tags={article.tags} />
    </motion.article>
  </Link>
}

export function ArticleEmphasised({article} : {article: ArticleHeader}){
  return <Link href={article.url}><motion.article
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="mb-12 group cursor-pointer"
>
  <div className="relative h-96 rounded-sm overflow-hidden mb-6">
    {article.urlToImage ? (
      <img
        src={article.urlToImage}
        alt={article.title}
        className="w-full h-full object-cover group-transition-transform duration-500"
      />
    ) : (
      <div className="w-full h-full bg-muted flex items-center justify-center">
        <Newspaper className="w-16 h-16 text-muted-foreground" />
      </div>
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    
    <div className="absolute bottom-0 left-0 right-0 p-8">
      <div className="flex items-center gap-2 text-xs text-white/70 mb-3">
        <span className="font-semibold">{article.source.name}</span>
        <span>•</span>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDate(article.publishedAt)}
        </div>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 line-clamp-2">
        {article.title}
      </h1>
      <p className="text-white/70 text-base line-clamp-2 max-w-3xl mb-3">
        {article.description}
      </p>
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {article.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white/90 font-medium"
            >
              {tag}
            </span>
          ))}
          {article.tags.length > 4 && (
            <span className="text-xs px-2 py-0.5 text-white/60">
              +{article.tags.length - 4}
            </span>
          )}
        </div>
      )}
    </div>
  </div>
  </motion.article>
  </Link>
}
