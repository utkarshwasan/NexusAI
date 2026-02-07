import { stackServerApp } from "./stack";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;
  
  // === DEBUG: Log every middleware execution ===
  console.log("═══════════════════════════════════════");
  console.log("🔍 MIDDLEWARE DEBUG:");
  console.log("  Path:", pathname);
  console.log("  Search params:", Object.fromEntries(searchParams));
  console.log("  Has code param:", searchParams.has("code"));
  console.log("  Has state param:", searchParams.has("state"));
  
  let user = null;
  let getUserError = null;
  
  try {
    user = await stackServerApp.getUser();
    console.log("  getUser() result:", user ? `✅ ${user.primaryEmail}` : "❌ NULL");
  } catch (e) {
    getUserError = e.message;
    console.log("  getUser() ERROR:", e.message);
  }
  
  console.log("═══════════════════════════════════════");

  // === CRITICAL FIX: Don't intercept OAuth callback flows ===
  const isOAuthCallback = searchParams.has("code") || searchParams.has("state");

  if (isOAuthCallback) {
    console.log("🔄 OAuth callback detected, allowing Stack Auth to handle redirect");
    return NextResponse.next();
  }

  // === FIX: Redirect authenticated users from home to dashboard ===
  // This catches OAuth callbacks that redirect to / instead of /dashboard
  if (user && pathname === "/") {
    console.log("🏠 Authenticated user on home page, redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // === PROTECTION 1: Dashboard (unauthenticated) ===
  if (!user && pathname.startsWith("/dashboard")) {
    console.log("🚫 Unauthenticated user accessing dashboard, redirecting to sign-in");
    const signInUrl = new URL("/handler/sign-in", request.url);
    signInUrl.searchParams.set("after_auth_return_to", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // === PROTECTION 2: Auth pages (authenticated) ===
  if (user && (pathname === "/handler/sign-in" || pathname === "/handler/sign-up")) {
    console.log("✅ Authenticated user on auth page, redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  console.log("➡️ Allowing request to proceed");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/handler/sign-in",
    "/handler/sign-up",
  ],
};



