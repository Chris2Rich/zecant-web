import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers';

export async function AuthRedirect({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await currentUser()
  const headerslist = await headers()
  const pathname = headerslist.get("x-pathname")

  if (! user && pathname == '/app') {
    redirect('/sign-up')
  }
  if (user && (pathname == '/sign-up' || pathname == '/sign-in')) {
    redirect('/app')
  }
  if (user && (pathname != '/onboarding') && (user.publicMetadata.onboarded != true)){
    redirect('/onboarding')
  }

  return children
}