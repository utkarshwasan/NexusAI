"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@stackframe/stack";
import { cn } from "@/lib/utils"; // already exists
import { Menu, X } from "lucide-react"; // already installed

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "History", href: "/dashboard#history" },
  { label: "Feedback", href: "/dashboard#feedback" },
];

function AppHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  // keyboard trap for mobile drawer
  useEffect(() => {
    if (!mobileOpen) return;
    const handleEsc = (e) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [mobileOpen]);

  const Nav = ({ mobile = false }) => (
    <nav
      aria-label="Main"
      className={cn("flex gap-6", mobile && "flex-col gap-4 text-lg")}
    >
      {navLinks.map((l) => {
        const isActive = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "relative font-medium text-sm transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {l.label}
            {isActive && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" />
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <style jsx>{`
        /* mobile drawer animation */
        .drawer {
          transform: translateX(100%);
          transition: transform 0.2s ease-in-out;
        }
        .drawer.open {
          transform: translateX(0);
        }
      `}</style>

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "h-16 bg-background/80 backdrop-blur-sm",
          "border-b border-border",
          "flex items-center justify-between px-4 md:px-6"
        )}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded">
            N
          </span>
          <span className="hidden sm:inline">nexus.ai</span>
          <span className="sr-only">Home</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:block">
          <Nav />
        </div>

        {/* Right slot */}
        <div className="flex items-center gap-3">
          <UserButton />
          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 rounded-md hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          {/* overlay */}
          <div
            className="fixed inset-0 z-40 bg-background/40 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          {/* panel */}
          <div
            id="mobile-nav"
            className={cn(
              "drawer open",
              "fixed top-16 right-0 bottom-0 w-64",
              "bg-background border-l border-border",
              "p-6 md:hidden"
            )}
            role="dialog"
            aria-modal="true"
          >
            <Nav mobile />
          </div>
        </>
      )}
    </>
  );
}

export default AppHeader;
