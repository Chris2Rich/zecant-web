import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Zecant - Advanced Financial Trading Platform",
  description:
    "Professional trading platform with advanced analytics, real-time execution, and comprehensive risk management tools.",
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
        <body className={`antialiased select-none`}>
          <div className="w-full bg-red-700 text-primary-foreground text-center text-bold text-sm">
            <p>
              DO NOT BUY ANYTHING HERE. THIS SITE AND SERVICE ARE IN DEVELOPMENT!
            </p>
          </div>
          <Suspense fallback={null}> 
              {children}
          </Suspense>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
