import type { Metadata } from "next";
import Hero from "@/components/marketing/Hero";
import HowItWorks from "@/components/marketing/HowItWorks";
import Pricing from "@/components/marketing/Pricing";
import AnimatedSection from "@/components/shared/AnimatedSection";
import ProblemSection from "@/components/marketing/ProblemSection";
import Specialists from "@/components/marketing/Specialists";
import Testimonials from "@/components/marketing/Testimonials";
import SecuritySection from "@/components/marketing/SecuritySection";
import FAQ from "@/components/marketing/FAQ";
import FinalCTA from "@/components/marketing/FinalCTA";

export const metadata: Metadata = {
  title: "Code Review by AI Specialists",
  description:
    "Paste your code. Get instant, expert-level feedback on security vulnerabilities, performance bottlenecks, and architectural decisions — in seconds. Free for early adopters. No account needed to try.",
  openGraph: {
    title: "CodeWatch — Code Review by AI Specialists",
    description:
      "Paste your code. Get instant, expert-level feedback on security, performance, and code quality. Supports 30+ languages. Results in under 10 seconds. Free for early adopters.",
  },
  twitter: {
    title: "CodeWatch — Code Review by AI Specialists",
    description:
      "Paste your code. Get instant, expert-level feedback on security, performance, and code quality. Supports 30+ languages. No account needed.",
  },
};

export default function LandingPage() {
  return (
    <main>
      <Hero />

      <AnimatedSection className="contents">
        <ProblemSection />
      </AnimatedSection>

      <HowItWorks />

      <AnimatedSection className="contents">
        <Specialists />
      </AnimatedSection>

      <Pricing />

      <AnimatedSection className="contents">
        <Testimonials />
        <SecuritySection />
        <FAQ />
        <FinalCTA />
      </AnimatedSection>
    </main>
  );
}
