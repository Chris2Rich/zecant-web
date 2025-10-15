"use client"

import { useUser } from '@clerk/nextjs'
import { useRouter, usePathname } from 'next/navigation'
import path from 'path'
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
    if (! isSignedIn && pathname == '/app') {
      router.replace('/sign-up')
    }
    if (isSignedIn && (pathname == '/sign-up' || pathname == '/sign-in')) {
      router.replace('/app')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return null
  }

  return children
}
