import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import HexGrid from "@/components/hexgrid"

const siteUrl = 'https://zecant.com'

export async function generateMetadata(): Promise<Metadata> {
  const pageMeta = {
    title: 'Zecant - AI-Powered Trading Strategy Platform',
    description: 'Programmatically generate and backtest trading strategies using natural language. Algorithmic trading democratised.'
  }

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: pageMeta.title,
      template: 'Zecant | %s'
    },
    icons: {
      icon: '/Icon Logo.png'
    },
    description: pageMeta.description,
    keywords: [
      'AI trading strategy builder',
      'algorithmic trading platform',
      'backtesting trading strategies',
      'quantitative trading software',
      'natural language trading',
      'automated trading platform',
      'Zecant'
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
          url: `${siteUrl}/api/og`,
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
      images: [`${siteUrl}/api/og`]
    },
    manifest: '/manifest.json',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark scroll-smooth scrollbar-thin" suppressHydrationWarning>
        <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
        </head>
        <body className={`antialiased select-none`}>
          <main className="min-h-screen">
            <Suspense fallback={null}>
              <HexGrid />
            </Suspense>
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
