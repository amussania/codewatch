"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

/**
 * Aperture eye mark — two arcs forming a lens shape, diamond pupil inside.
 * Uses currentColor so the parent controls the ember tint.
 * The diamond pulses on hover via the `hovered` prop.
 */
function ApertureMark({ hovered, size = 32 }: { hovered: boolean; size?: number }) {
  const h = Math.round((size / 36) * 24);
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 36 24"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      {/* Lens / eye outline */}
      <path
        d="M 2 12 Q 18 2.5 34 12 Q 18 21.5 2 12 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Diamond pupil — pulses on hover */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={hovered ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <path
          d="M 18 7.5 L 22.5 12 L 18 16.5 L 13.5 12 Z"
          fill="currentColor"
        />
      </motion.g>
    </svg>
  );
}

/**
 * The full logo: aperture mark + "Code" in Instrument Serif italic + "Watch" in DM Sans 500.
 * Hover on the whole unit triggers the diamond pulse.
 * Wrap with `onNavigate` to close mobile menus etc.
 */
export function LogoContent({
  onNavigate,
  markSize = 32,
  textSize = 20,
}: {
  onNavigate?: () => void;
  markSize?: number;
  textSize?: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="flex items-center gap-2.5 select-none shrink-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ember-tinted aperture mark */}
      <span style={{ color: "var(--cw-ember)" }}>
        <ApertureMark hovered={hovered} size={markSize} />
      </span>

      {/* Wordmark: "Code" italic serif + "Watch" DM Sans 500 */}
      <span
        className="leading-none tracking-normal"
        style={{ fontSize: textSize, color: "var(--cw-ink-primary)" }}
      >
        <span className="font-heading italic">Code</span>
        <span
          className="font-body font-medium"
          style={{ letterSpacing: "0.02em" }}
        >
          Watch
        </span>
      </span>
    </Link>
  );
}

/** Convenience default export for use wherever just `<Logo />` suffices. */
export default function Logo({
  markSize,
  textSize,
}: {
  markSize?: number;
  textSize?: number;
}) {
  return <LogoContent markSize={markSize} textSize={textSize} />;
}
