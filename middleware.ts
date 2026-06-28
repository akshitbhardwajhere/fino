import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Protect all routes under /dashboard and /api (except the public ones)
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/((?!test-scheduler).*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in query parameters
    '/((?!_next|[^?]*\\.(?:html|css|js|gif|svg|jpg|jpeg|png|webp|jwk|json|txt|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
