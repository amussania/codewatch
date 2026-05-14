import type { Metadata } from "next";
import Hero from "@/components/marketing/Hero";
import Ticker from "@/components/marketing/Ticker";
import ProblemSection from "@/components/marketing/ProblemSection";
import ProductDemo from "@/components/marketing/ProductDemo";
import HowItWorks from "@/components/marketing/HowItWorks";
import Specialists from "@/components/marketing/Specialists";
import UniqueFeatures from "@/components/marketing/UniqueFeatures";
import Comparison from "@/components/marketing/Comparison";
import SeveritySection from "@/components/marketing/SeveritySection";
import Pricing from "@/components/marketing/Pricing";
import Testimonials from "@/components/marketing/Testimonials";
import SecuritySection from "@/components/marketing/SecuritySection";
import FAQ from "@/components/marketing/FAQ";
import FinalCTA from "@/components/marketing/FinalCTA";
import Footer from "@/components/marketing/Footer";
import AnimatedSection from "@/components/shared/AnimatedSection";

export const metadata: Metadata = {
  title: "Multi-Specialist AI Code Review · Business-Logic Aware",
  description:
    "Five AI specialists review your code in parallel. Business logic validation, AI origin detection, fail-safe rewrites, and the Humanisation Layer. No repo connection needed. 10 free reviews.",
  openGraph: {
    title: "CODEWATCH — The Senior Engineer Your AI-Generated Code Has Never Had",
    description:
      "Five AI specialists. Business logic awareness. Fail-safe rewrite. The Humanisation Layer. CODEWATCH is the only code review tool that validates your code against your actual business rules.",
  },
  twitter: {
    title: "CODEWATCH — Multi-Specialist AI Code Review",
    description:
      "Paste your code. Get five specialists in parallel. Business logic validation, AI origin detection, and the actual fixed code. 10 free reviews. No card required.",
  },
};

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <Ticker />

      <AnimatedSection className="contents">
        <ProblemSection />
      </AnimatedSection>

      <ProductDemo />

      <HowItWorks />

      <AnimatedSection className="contents">
        <Specialists />
        <UniqueFeatures />
        <Comparison />
      </AnimatedSection>

      <SeveritySection />

      <Pricing />

      <AnimatedSection className="contents">
        <Testimonials />
        <SecuritySection />
        <FAQ />
        <FinalCTA />
      </AnimatedSection>

      <Footer />
    </main>
  );
}
