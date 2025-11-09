"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Newspaper } from "lucide-react";
import { ArticleEmphasised, ArticleOverview, ArticleHeader } from "@/components/articles";
// Example financial news articles
const mockArticles: ArticleHeader[] = [
  {
    title: "Fed Signals Potential Rate Cuts as Inflation Cools to 2.4%",
    description: "The Federal Reserve indicated it may begin cutting interest rates in the coming months as inflation continues to moderate, with core PCE falling to its lowest level since early 2021.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    publishedAt: new Date(Date.now() - 35 * 60000).toISOString(),
    source: { name: "Bloomberg" },
    category: ["general"]
  },
  {
    title: "Apple Unveils AI-Powered Trading Platform for Institutional Investors",
    description: "Tech giant Apple announced a new suite of machine learning tools designed to help hedge funds and asset managers optimize portfolio allocation and risk management.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    source: { name: "Financial Times" },
    category: ["technology"]
  },
  {
    title: "Walmart Beats Earnings Expectations with 8.2% Revenue Growth",
    description: "Retail giant Walmart reported stronger-than-expected Q4 results, driven by robust e-commerce sales and improved margins in its grocery division.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80",
    publishedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    source: { name: "Reuters" },
    category: ["retail"]
  },
  {
    title: "Moderna Stock Surges 23% on Breakthrough Cancer Vaccine Data",
    description: "Biotech company Moderna saw shares soar after releasing Phase 3 trial results showing its personalized cancer vaccine reduced recurrence risk by 44% in melanoma patients.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80",
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    source: { name: "CNBC" },
    category: ["life sciences"]
  },
  {
    title: "Senate Passes Bipartisan Infrastructure Bill with $1.2T in Spending",
    description: "The U.S. Senate approved a massive infrastructure package that includes investments in roads, bridges, broadband, and clean energy, signaling potential opportunities in construction and materials sectors.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",
    publishedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    source: { name: "Wall Street Journal" },
    category: ["politics"]
  },
  {
    title: "India's GDP Growth Accelerates to 7.8%, Outpacing Major Economies",
    description: "India's economy expanded faster than expected in Q4, driven by strong domestic consumption and manufacturing growth, making it the fastest-growing major economy globally.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
    publishedAt: new Date(Date.now() - 7 * 3600000).toISOString(),
    source: { name: "MarketWatch" },
    category: ["developing markets"]
  },
  {
    title: "JPMorgan Raises S&P 500 Target to 6,200 on Strong Corporate Earnings",
    description: "Investment bank JPMorgan increased its year-end S&P 500 forecast, citing resilient corporate profits and improving economic conditions despite elevated interest rates.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
    publishedAt: new Date(Date.now() - 9 * 3600000).toISOString(),
    source: { name: "Bloomberg" },
    category: ["general"]
  },
  {
    title: "Microsoft Acquires Cybersecurity Firm for $8.5B to Boost Cloud Security",
    description: "Tech giant Microsoft announced the acquisition of leading cybersecurity company to strengthen its enterprise cloud offerings and compete with Amazon Web Services.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    publishedAt: new Date(Date.now() - 10 * 3600000).toISOString(),
    source: { name: "Reuters" },
    category: ["technology"]
  },
  {
    title: "Amazon Plans 150 New Fulfillment Centers, Creating 100K Jobs",
    description: "E-commerce leader Amazon unveiled aggressive expansion plans for its logistics network, aiming to reduce delivery times and compete with emerging same-day delivery services.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
    publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    source: { name: "Financial Times" },
    category: ["retail"]
  },
  {
    title: "Pfizer and BioNTech Partner on Next-Gen mRNA Therapeutics Platform",
    description: "Pharmaceutical giants announced a $2.3B joint venture to develop mRNA-based treatments for cardiovascular disease and rare genetic disorders.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    publishedAt: new Date(Date.now() - 14 * 3600000).toISOString(),
    source: { name: "CNBC" },
    category: ["life sciences"]
  },
  {
    title: "White House Proposes Tax Reform Package Targeting Corporate Buybacks",
    description: "The Biden administration unveiled new tax proposals aimed at discouraging stock buybacks and encouraging capital investment, sparking debate among investors and policymakers.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    publishedAt: new Date(Date.now() - 15 * 3600000).toISOString(),
    source: { name: "Wall Street Journal" },
    category: ["politics"]
  },
  {
    title: "Brazil Central Bank Cuts Interest Rates as Inflation Falls Below Target",
    description: "Brazil's monetary authority reduced benchmark rates by 50 basis points, marking the fourth consecutive cut as inflation pressures ease and economic growth stabilizes.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1483389127117-b6a2102724ae?w=800&q=80",
    publishedAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    source: { name: "MarketWatch" },
    category: ["developing markets"]
  }
];

export default function NewsfeedPage() {
  const [category, setCategory] = useState('general');

  const categories = [
    { id: 'general', label: 'General' },
    { id: 'technology', label: 'Technology' },
    { id: 'retail', label: 'Retail' },
    { id: 'life sciences', label: 'Life Sciences' },
    { id: 'politics', label: 'Politics' },
    { id: 'developing markets', label: 'Developing Markets' },
  ];

  const filteredArticles = category === 'general' 
    ? mockArticles 
    : mockArticles.filter(article => article.category.includes(category));

  const featuredArticle = filteredArticles[0];
  const gridArticles = filteredArticles.slice(1);

  return (
    <div className="h-full overflow-y-auto bg-background">
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

        {/* Content */}
        {filteredArticles.length > 0 && (
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
        {filteredArticles.length === 0 && (
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