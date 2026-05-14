"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogoContent } from "@/components/shared/Logo";

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features",     href: "#features" },
  { label: "Security",     href: "#security" },
  { label: "Pricing",      href: "#pricing" },
  { label: "FAQ",          href: "#faq" },
];

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="w-5 h-[14px] flex flex-col justify-between">
      <motion.span
        className="block h-px bg-current origin-center"
        animate={open ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 26 }}
      />
      <motion.span
        className="block h-px bg-current"
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.span
        className="block h-px bg-current origin-center"
        animate={open ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 26 }}
      />
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottomWidth: "0.5px",
          borderBottomStyle: "solid",
        }}
        animate={{
          backgroundColor: scrolled
            ? "rgba(245,242,238,0.85)"
            : "rgba(245,242,238,0)",
          borderBottomColor: scrolled
            ? "rgba(237,233,227,1)"
            : "rgba(237,233,227,0)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Relative container so the absolutely-centred links work */}
        <nav className="relative max-w-[1120px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">

          {/* Logo — left */}
          <LogoContent markSize={28} textSize={19} />

          {/* Links — truly centred in the full nav width */}
          <div className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="transition-colors duration-200 whitespace-nowrap"
                style={{
                  fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                  color: "var(--cw-ink-secondary)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--cw-ink-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--cw-ink-secondary)";
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right slot — desktop CTA + mobile hamburger */}
          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            <Link href="/signup" className="hidden md:block">
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 36,
                  padding: "0 18px",
                  borderRadius: 6,
                  background: "var(--cw-ember)",
                  color: "#FDFAF7",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  border: "none",
                  cursor: "pointer",
                  transition: "filter 200ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)";
                }}
              >
                Start for free
              </button>
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="md:hidden p-2 -mr-2 rounded-lg transition-colors"
              style={{ color: "var(--cw-ink-primary)" }}
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* ── Mobile full-screen overlay ─────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-[60] flex flex-col md:hidden"
            style={{ background: "var(--cw-bg-primary)" }}
          >
            {/* Top bar */}
            <div
              className="flex items-center justify-between px-6 h-16 shrink-0"
              style={{ borderBottom: "0.5px solid var(--cw-bg-secondary)" }}
            >
              <LogoContent
                markSize={24}
                textSize={17}
                onNavigate={() => setMenuOpen(false)}
              />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 -mr-2 rounded-lg"
                style={{ color: "var(--cw-ink-primary)" }}
              >
                <HamburgerIcon open={true} />
              </button>
            </div>

            {/* Links — staggered reveal, centred */}
            <nav className="flex flex-col items-center justify-center flex-1 gap-1">
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.04 + i * 0.06,
                    duration: 0.28,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "block",
                      padding: "10px 40px",
                      fontSize: 24,
                      fontWeight: 400,
                      fontFamily: "'Instrument Serif', serif",
                      fontStyle: "italic",
                      color: "var(--cw-ink-primary)",
                      textDecoration: "none",
                    }}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0 px-6 pb-10 pt-5"
              style={{ borderTop: "0.5px solid var(--cw-bg-secondary)" }}
            >
              <Link href="/signup" onClick={() => setMenuOpen(false)}>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: 50,
                    borderRadius: 8,
                    background: "var(--cw-ember)",
                    color: "#FDFAF7",
                    fontSize: 16,
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Start for free
                </button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
