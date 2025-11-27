import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { headers } from "next/headers";
import HexGrid from "@/components/hexgrid"

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
          <main className="min-h-screen">
          <div className="fixed inset-0 [mask-image:radial-gradient(white,transparent)] -z-1">
            <HexGrid scale={10} className="text-primary opacity-100" />
          </div>
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
