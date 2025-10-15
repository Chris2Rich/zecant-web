"use client"

import { useUser } from '@clerk/nextjs'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function AuthRedirect({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoaded && ! isSignedIn && pathname == '/app') {
      router.replace('/sign-up')
    }
    if (isLoaded && isSignedIn) {
      router.replace('/app')
    }
  }, [isLoaded, isSignedIn, router])

  // Don't render anything while checking auth state or redirecting
  if (!isLoaded || isSignedIn) {
    return null
  }

  // Return null for unauthenticated users (they should see the landing page)
  return children
}
