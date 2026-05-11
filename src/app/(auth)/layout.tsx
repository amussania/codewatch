import type { Metadata } from "next";
import NoiseOverlay from "@/components/shared/NoiseOverlay";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-background">
      <NoiseOverlay />

      {/* Radial vignette glow — coral tint from center */}
      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 40%, oklch(0.70 0.195 22 / 6%) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
