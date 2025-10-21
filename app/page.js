// app/page.js
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CoachingOptions } from '@/services/Options'; // Assuming this contains feature details
import { cn } from '@/lib/utils'; // For combining class names
// Removed CheckCircle icon import as it wasn't used, you can add specific icons if needed

// Simplified Header component based on AppHeader.jsx structure for landing page
const LandingHeader = () => (
  <header
    className={cn(
      "fixed top-0 left-0 right-0 z-50", // Changed back to fixed for consistency with AppHeader
      "h-16 bg-background/80 backdrop-blur-sm",
      "border-b border-border",
      "flex items-center justify-between px-4 md:px-6 lg:px-12"
    )}
  >
    {/* Logo */}
    <Link
      href="/"
      className="flex items-center gap-2 text-lg font-semibold"
    >
      <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded font-bold">
        N
      </span>
      <span className="hidden sm:inline font-medium">nexus.ai</span>
      <span className="sr-only">Home</span>
    </Link>

    {/* Desktop nav */}
    <nav className="hidden md:flex gap-6 items-center">
      <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
      <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
      {/* Removed explicit Log In link here, handled by buttons */}
    </nav>

    {/* Auth Buttons */}
    <div className="flex items-center gap-3">
       {/* Use Link components pointing to Stack's handler paths */}
       <Button variant="ghost" size="sm" asChild>
          <Link href="/handler/sign-in">Log In</Link>
       </Button>
       <Button size="sm" asChild>
          <Link href="/handler/sign-up">Get Started</Link>
       </Button>
    </div>
  </header>
);

// Simplified Footer component based on image
const LandingFooter = () => (
    <footer className="border-t border-border mt-20 py-10 px-4 md:px-6 lg:px-12 bg-background"> {/* Use bg-background */}
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
            {/* Logo & Description */}
            <div className="flex flex-col gap-2">
                 <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-semibold w-fit"
                >
                    <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded font-bold">
                        N
                    </span>
                    <span className="font-medium">nexus.ai</span>
                </Link>
                <p className="text-muted-foreground">Your personal AI voice coach for interactive learning and growth.</p>
            </div>

            {/* Links Columns */}
            <div>
                <h4 className="font-semibold mb-3 text-foreground">Product</h4> {/* Use text-foreground */}
                <ul className="space-y-2">
                    <li><Link href="#features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                    {/* Add Pricing, Demo links if applicable and they exist */}
                     <li><Link href="#" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                     <li><Link href="#" className="text-muted-foreground hover:text-foreground">Demo</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="font-semibold mb-3 text-foreground">Company</h4> {/* Use text-foreground */}
                <ul className="space-y-2">
                     <li><Link href="#" className="text-muted-foreground hover:text-foreground">About</Link></li>
                     <li><Link href="#" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
                     <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                </ul>
            </div>
             <div>
                <h4 className="font-semibold mb-3 text-foreground">Legal</h4> {/* Use text-foreground */}
                <ul className="space-y-2">
                     <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                     <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                     <li><Link href="#" className="text-muted-foreground hover:text-foreground">Cookie Policy</Link></li>
                </ul>
            </div>
        </div>
        <div className="text-center text-xs text-muted-foreground mt-10">
            © {new Date().getFullYear()} NexusAI. All rights reserved.
        </div>
    </footer>
);


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background"> {/* Use bg-background */}
      <LandingHeader />

      <main className="flex-grow pt-16"> {/* Ensure padding-top for fixed header */}
        {/* Hero Section */}
        {/* Adjusted background gradient for theme */}
        <section className="relative py-20 md:py-32 lg:py-40 text-center overflow-hidden bg-gradient-to-b from-background via-background to-secondary/30 dark:from-background dark:via-background dark:to-secondary/10">

           <div className="container mx-auto px-4 relative z-10">
                {/* Optional: Powered by AI badge - styled with theme colors */}
                <div className="inline-block bg-secondary text-secondary-foreground text-xs font-medium px-4 py-1.5 rounded-full mb-6 shadow-sm">
                   ✨ Powered by Advanced AI
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-foreground"> {/* Use text-foreground */}
                    Master Skills with Your Personal AI Voice Coach
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                    Interactive, hands-free learning through natural voice conversations. Practice interviews, learn languages, and grow with personalized AI coaching.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                    <Button size="lg" asChild>
                       <Link href="/handler/sign-up" className="px-6 py-3">Get Started Free →</Link>
                    </Button>
                     <Button variant="outline" size="lg" asChild>
                       <Link href="#" className="px-6 py-3">Watch Demo</Link>
                    </Button>
                </div>
                 <p className="text-sm text-muted-foreground">Trusted by 10,000+ learners worldwide</p>
           </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-background"> {/* Use bg-background */}
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">Your All-in-One AI Coaching Platform</h2> {/* Use text-foreground */}
                <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                    Five powerful coaching modules powered by real-time voice interaction.
                </p>
                {/* Adjusted card styling for theme */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {CoachingOptions.map((option) => (
                        <div key={option.name} className="bg-card text-card-foreground p-6 rounded-xl border border-border flex flex-col items-start transition-all hover:shadow-lg hover:border-border/80"> {/* Use card colors */}
                            <Image src={option.icon} alt={option.name} width={60} height={60} className="mb-4" />
                            <h3 className="text-lg font-semibold mb-2">{option.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {option.prompt.split('.')[0].replace('{user_topic}', 'any subject')}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* How It Works Section */}
         {/* Adjusted background color */}
        <section id="how-it-works" className="py-16 md:py-24 bg-secondary/30 dark:bg-secondary/10">
           <div className="container mx-auto px-4 text-center">
               <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Get Started in 3 Simple Steps</h2> {/* Use text-foreground */}
               <p className="text-muted-foreground mb-12">Your personalized AI coach is just minutes away.</p>
                {/* Adjusted icon background/text color */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                   <div className="flex flex-col items-center">
                        <div className="relative mb-4">
                           <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold ring-4 ring-primary/30"> {/* Use primary color */}
                                {/* Placeholder Icon 1 */}
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12h.01M19 12h.01M21 12a1 1 0 11-2 0 1 1 0 012 0z"/> {/* Added plus indicator */}
                                </svg>
                           </div>
                           <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold border-2 border-background">1</div> {/* Added border */}
                       </div>
                       <h3 className="text-xl font-semibold mb-2 text-foreground">Sign Up</h3> {/* Use text-foreground */}
                       <p className="text-sm text-muted-foreground text-center">Create your free account in seconds. No credit card required.</p>
                   </div>
                   <div className="flex flex-col items-center">
                         <div className="relative mb-4">
                           <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold ring-4 ring-primary/30"> {/* Use primary color */}
                               {/* Placeholder Icon 2 */}
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.935M3 10a1 1 0 011-1h16a1 1 0 011 1v7a5 5 0 01-5 5H8a5 5 0 01-5-5v-7z" />
                                </svg>
                           </div>
                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold border-2 border-background">2</div> {/* Added border */}
                       </div>
                       <h3 className="text-xl font-semibold mb-2 text-foreground">Choose Your Coach</h3> {/* Use text-foreground */}
                       <p className="text-sm text-muted-foreground text-center">Select your topic and AI expert personality that matches your style.</p>
                   </div>
                   <div className="flex flex-col items-center">
                         <div className="relative mb-4">
                           <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold ring-4 ring-primary/30"> {/* Use primary color */}
                              {/* Placeholder Icon 3 */}
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                              </svg>
                           </div>
                           <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold border-2 border-background">3</div> {/* Added border */}
                       </div>
                       <h3 className="text-xl font-semibold mb-2 text-foreground">Start Learning</h3> {/* Use text-foreground */}
                       <p className="text-sm text-muted-foreground text-center">Begin your interactive voice session and experience personalized coaching.</p>
                   </div>
               </div>
           </div>
        </section>

        {/* Final CTA Section */}
        {/* Adjusted background color and added wrapper div for card effect */}
        <section className="py-16 md:py-24 bg-background"> {/* Use bg-background */}
             <div className="container mx-auto px-4 max-w-3xl">
                 <div className="bg-card text-card-foreground p-8 md:p-12 rounded-xl shadow-lg border border-border text-center"> {/* Card styling */}
                     <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Learning Journey?</h2>
                     <p className="text-muted-foreground mb-8">
                         Join thousands of learners who are already mastering new skills with AI-powered voice coaching. Start your free trial today—no credit card required.
                     </p>
                     <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
                          <Button size="lg" asChild>
                              <Link href="/handler/sign-up" className="px-6 py-3">Start Free Trial →</Link>
                          </Button>
                          <Button variant="outline" size="lg" asChild>
                             <Link href="#" className="px-6 py-3">Talk to Sales</Link>
                          </Button>
                      </div>
                     <p className="text-xs text-muted-foreground mt-4">Free forever. No credit card required. Cancel anytime.</p>
                 </div>
             </div>
        </section>

      </main>

      <LandingFooter />
    </div>
  );
}
