import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { Inter, Roboto as V0_Font_Roboto, Roboto_Mono as V0_Font_Roboto_Mono, Roboto_Slab as V0_Font_Roboto_Slab } from 'next/font/google'

// Initialize fonts
V0_Font_Roboto({ weight: ["100","200","300","400","500","600","700","800","900"] })
V0_Font_Roboto_Mono({ weight: ["100","200","300","400","500","600","700"] })
V0_Font_Roboto_Slab({ weight: ["100","200","300","400","500","600","700","800","900"] })

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: "TradePro - Advanced Financial Trading Platform",
  description:
    "Professional trading platform with advanced analytics, real-time execution, and comprehensive risk management tools.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${inter.variable} antialiased select-none`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
