// app/layout.js
import { Inter } from "next/font/google";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import "./globals.css";
import Provider from "./Provider";
import { Toaster } from "@/components/ui/sonner";
import AuthRedirectHandler from "./AuthRedirectHandler";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nexus AI",
  description: "Your AI-powered learning companion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <StackProvider app={stackServerApp} afterAuthReturnTo="/dashboard">
          <StackTheme>
            <Provider>
              <AuthRedirectHandler />
              {children}
              <Toaster />
            </Provider>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
