"use client";
import { useUser } from "@stackframe/stack";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AuthRedirectHandler() {
  const user = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only run client-side redirect if:
    // 1. User is authenticated
    // 2. Currently on sign-in or sign-up page
    // 3. NOT in the middle of an OAuth callback (no 'code' param)
    
    const isAuthPage = pathname === "/handler/sign-in" || pathname === "/handler/sign-up";
    const isOAuthCallback = searchParams.has('code') || searchParams.has('state');
    
    if (user && isAuthPage && !isOAuthCallback) {
      console.log('🔄 Client-side redirect: User is authenticated, redirecting to dashboard');
      router.replace('/dashboard');
    }
  }, [user, pathname, searchParams, router]);

  return null; // This component doesn't render anything
}
