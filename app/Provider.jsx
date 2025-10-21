"use client";
import React, { Suspense } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import AuthProvider from "./AuthProvider";
import { useStackApp } from "@stackframe/stack";

function Provider({ children }) {
  const stackApp = useStackApp();
  if (!stackApp) return null; // prevents null log + crash

  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ConvexProvider client={convex}>
        <AuthProvider>{children}</AuthProvider>
      </ConvexProvider>
    </Suspense>
  );
}

export default Provider;
