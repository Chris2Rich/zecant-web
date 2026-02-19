import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { headers } from "next/headers";
import HexGrid from "@/components/hexgrid"

const siteUrl = 'https://zecant.com'

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''

  const pages: Record<string, { title: string; description: string }> = {
    '/': {
      title: 'Zecant - AI-Powered Trading Strategy Platform',
      description: 'Programmatically generate and backtest trading strategies using natural language. Algorithmic trading democratised.'
    },
    '/pricing': {
      title: 'Pricing',
      description: 'Choose the plan that fits your trading needs. Start free, upgrade when you need more power.'
    },
    '/docs': {
      title: 'Documentation',
      description: 'Everything you need to get started with Zecant platform and build powerful trading applications.'
    },
    '/research': {
      title: 'Research & Insights',
      description: 'Stay informed with the latest financial research, market analysis, and investment insights.'
    },
    '/updates': {
      title: 'Product Updates',
      description: 'Stay up to date with the latest features, improvements, and bug fixes.'
    },
    '/issues': {
      title: 'Report an Issue',
      description: 'Report bugs, suggest features, or get help with Zecant.'
    }
  }

  const defaultMeta = {
    title: 'Zecant - AI-Powered Trading Strategy Platform',
    description: 'Programmatically generate and backtest trading strategies using natural language.'
  }

  const pageMeta = pages[pathname] || defaultMeta

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: pageMeta.title,
      template: '%s | Zecant'
    },
    description: pageMeta.description,
    keywords: [
      'algorithmic trading',
      'AI trading',
      'trading strategy',
      'backtesting',
      'quantitative trading',
      'portfolio management',
      'trading automation',
      'AI strategy builder'
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: 'Zecant',
      title: pageMeta.title,
      description: pageMeta.description,
      images: [
        {
          url: '/api/og',
          width: 1200,
          height: 630,
          alt: 'Zecant - Turn Ideas Into Alpha'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: pageMeta.title,
      description: pageMeta.description,
      creator: '@zecantofficial',
      site: '@zecantofficial',
      images: ['/api/og']
    },
    manifest: '/manifest.json',
    themeColor: '#000000'
  }
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://zecant.com/#organization',
      name: 'Zecant',
      url: 'https://zecant.com',
      logo: 'https://zecant.com/Icon%20Logo.png',
      sameAs: [
        'https://twitter.com/zecantofficial'
      ]
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://zecant.com/#software',
      name: 'Zecant',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      url: 'https://zecant.com',
      description: 'AI-powered platform for generating and backtesting trading strategies using natural language.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    }
  ]
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = (await headers()).get("x-pathname");
  return (
    <ClerkProvider>
      <html lang="en" className={`dark scroll-smooth scrollbar-thin ${pathname?.startsWith("/app") ? "overflow-hidden" : ""}`}>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body className={`antialiased select-none`}>
          <main className="min-h-screen">
            <HexGrid />
            <Suspense fallback={null}> 
              {children}
            </Suspense>
            </main>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
