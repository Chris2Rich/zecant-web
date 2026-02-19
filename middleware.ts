import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/',
  '/pricing',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/og(.*)',
]);

const isAppRoute = createRouteMatcher(['/app(.*)']);
const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);
const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)']);
const isApiRoute = createRouteMatcher(['/api/(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const url = req.nextUrl.clone();
  
  // Allow API routes to pass through without onboarding checks
  if (isApiRoute(req)) {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
    return NextResponse.next();
  }
  
  // Fetch user directly to get fresh metadata
  let onboarded = false;
  if (userId) {
    try {
      const user = await (await clerkClient()).users.getUser(userId);
      onboarded = user.publicMetadata?.onboarded === true;
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  // 1. Redirect unauthenticated users from /app routes to sign-up
  if (!userId && isAppRoute(req)) {
    return NextResponse.redirect(new URL('/sign-up', req.url));
  }

  // 2. Redirect authenticated+onboarded users away from auth pages to /app
  if (userId && onboarded && isAuthRoute(req)) {
    return NextResponse.redirect(new URL('/app', req.url));
  }

  // 3. Redirect authenticated but not onboarded users to onboarding (except if already there)
  if (userId && !onboarded && !isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  // 4. Redirect onboarded users away from onboarding to /app
  if (userId && onboarded && isOnboardingRoute(req)) {
    return NextResponse.redirect(new URL('/app', req.url));
  }

  // Protect non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // Create response with headers
  const res = NextResponse.next();
  res.headers.set("x-url", url.toString());
  res.headers.set("x-pathname", url.pathname);
  return res;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};