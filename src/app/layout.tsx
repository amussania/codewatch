import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import SmoothScroll from "@/components/shared/SmoothScroll";
import CustomCursor from "@/components/shared/CustomCursor";
import PageTransition from "@/components/shared/PageTransition";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://codewatch.dev"),
  title: {
    default: "CodeWatch — AI Code Review",
    template: "%s | CodeWatch",
  },
  description:
    "Paste your code and get instant, expert-level feedback on security vulnerabilities, performance bottlenecks, and architectural decisions — in under 10 seconds.",
  keywords: [
    "AI code review",
    "automated code review",
    "code security analysis",
    "code quality",
    "performance optimization",
    "static analysis",
    "security vulnerabilities",
    "code reviewer",
  ],
  authors: [{ name: "CodeWatch" }],
  creator: "CodeWatch",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://codewatch.dev",
    siteName: "CodeWatch",
    title: "CodeWatch — Code Review by AI Specialists",
    description:
      "Paste your code. Get instant, expert-level feedback on security vulnerabilities, performance bottlenecks, and architectural decisions. Supports 30+ languages. Results in under 10 seconds.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "CodeWatch — AI Code Review",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeWatch — Code Review by AI Specialists",
    description:
      "Get instant expert-level feedback on security, performance, and code quality. No account needed to try. Supports 30+ languages.",
    images: ["/og.png"],
    creator: "@codewatch_dev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Global SVG filter definitions — NoiseOverlay references url(#cw-noise) */}
        <svg
          aria-hidden
          className="absolute w-0 h-0 overflow-hidden"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="cw-noise">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="4"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>
        </svg>

        <TooltipProvider>
          <SmoothScroll>
            <CustomCursor />
            <PageTransition>{children}</PageTransition>
          </SmoothScroll>
        </TooltipProvider>
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
