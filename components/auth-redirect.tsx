"use client"

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function AuthRedirect() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/app')
    }
  }, [isLoaded, isSignedIn, router])

  // Don't render anything while checking auth state or redirecting
  if (!isLoaded || isSignedIn) {
    return null
  }

  // Return null for unauthenticated users (they should see the landing page)
  return null
}
