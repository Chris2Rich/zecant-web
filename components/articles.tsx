"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Newspaper } from "lucide-react";
import { formatDate } from "@/business/utils";

export interface ArticleHeader {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: { name: string };
    category: Array<string>;
  }

export function ArticleOverview({article, index=0} : {article: ArticleHeader, index?: number}){
    return <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => window.open(article.url, '_blank')}
                >
                  <div className="relative h-48 rounded-xl overflow-hidden mb-3">
                    {article.urlToImage ? (
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                </motion.article>
}

export function ArticleEmphasised({article} : {article: ArticleHeader}){
  return <motion.article
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="mb-12 group cursor-pointer"
  onClick={() => window.open(article.url, '_blank')}
>
  <div className="relative h-96 rounded-2xl overflow-hidden mb-6">
    {article.urlToImage ? (
      <img
        src={article.urlToImage}
        alt={article.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    ) : (
      <div className="w-full h-full bg-muted flex items-center justify-center">
        <Newspaper className="w-16 h-16 text-muted-foreground" />
      </div>
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    
    {/* Overlay Content */}
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
      <p className="text-white/70 text-base line-clamp-2 max-w-3xl">
        {article.description}
      </p>
    </div>
  </div>
</motion.article>
}