import { redirect } from "next/navigation";
import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "../../../stack";

export default async function Handler(props) {
  const params = await props.params;
  const slug = params?.stack;
  const route = Array.isArray(slug) ? slug.join("/") : slug;

  // === CRITICAL: Only gate sign-in and sign-up, NOT oauth-callback ===
  const authPages = ["sign-in", "sign-up"];
  const isAuthPage = authPages.includes(route);

  // === NEW: Explicitly allow OAuth callback routes ===
  const isOAuthCallback = route?.includes("oauth") || route?.includes("callback");

  if (isAuthPage && !isOAuthCallback) {
    const user = await stackServerApp.getUser();
    if (user) {
      console.log('🔒 Handler: User already authenticated, redirecting to dashboard');
      redirect("/dashboard");
    }
  }

  // For OAuth callbacks and other routes, always render StackHandler
  return <StackHandler fullPage app={stackServerApp} routeProps={props} />;
}

