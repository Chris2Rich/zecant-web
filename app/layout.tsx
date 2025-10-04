import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"

export const metadata: Metadata = {
  title: "Zecant - Advanced Financial Trading Platform",
  description:
    "Professional trading platform with advanced analytics, real-time execution, and comprehensive risk management tools.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`antialiased select-none`}>
          <Suspense fallback={null}>
            {children}
          </Suspense>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
