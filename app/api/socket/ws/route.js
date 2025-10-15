// app/api/socket/ws/route.js
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

import { auth } from '@clerk/nextjs/server'

/**
 * Base URL for your Python WebSocket server.
 * You can store this in an environment variable instead.
 */
const PYTHON_WS_BASE = process.env.PYTHON_WS_BASE ?? 'wss://python.example.com/ws'

export async function GET(request) {
  // 1️⃣ Authenticate user with Clerk
  const { userId, sessionId, getToken } = await auth()

  if (!userId || !sessionId) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }

  // 2️⃣ Optionally get a Clerk JWT or sign your own token
  const clerkToken = await getToken({ template: 'default' })

  // 3️⃣ Build a connection URL for the Python WebSocket server
  const params = new URLSearchParams({
    uid: userId,
    session: sessionId,
    token: clerkToken ?? '',
  })

  const upstreamUrl = `${PYTHON_WS_BASE}?${params.toString()}`

  // 4️⃣ Respond with connection info
  return new Response(
    JSON.stringify({
      connect: upstreamUrl,
      expires_in: 60, // optional TTL (seconds)
    }),
    {
      headers: { 'content-type': 'application/json' },
    }
  )
}
