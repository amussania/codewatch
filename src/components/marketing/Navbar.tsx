"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
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
  const [menuOpen, setMenuOpen] = useState(false);
  const logoRotate = useSpring(0, { stiffness: 400, damping: 20 });

  return (
    <>
      {/* ── Header bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e2e2ee]">
        <nav className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <motion.div
              style={{ rotate: logoRotate }}
              onHoverStart={() => logoRotate.set(180)}
              onHoverEnd={() => logoRotate.set(0)}
              className="w-7 h-7 rounded-lg bg-[var(--cw-coral)] flex items-center justify-center text-white text-xs font-bold select-none"
            >
              ◈
            </motion.div>
            <span className="font-heading text-xl tracking-[.08em] text-foreground">CODEWATCH</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-[var(--cw-coral)] hover:bg-[var(--cw-coral)]/90 text-white border-0 shadow-lg shadow-[var(--cw-coral-glow)]"
              >
                Get 10 Free Reviews
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden p-2 -mr-2 rounded-lg text-foreground hover:bg-[#ededf5] transition-colors"
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </nav>
      </header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Scrim */}
            <motion.div
              key="drawer-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Slide-in panel */}
            <motion.aside
              key="drawer-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.9 }}
              className="fixed top-0 right-0 bottom-0 z-[60] w-72 flex flex-col bg-[var(--cw-surface)] border-l border-[#e2e2ee] md:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-[#e2e2ee] shrink-0">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 font-heading text-xl tracking-[.08em] text-foreground"
                >
                  <span className="w-6 h-6 rounded-md bg-[var(--cw-coral)] flex items-center justify-center text-[10px] text-white font-bold">
                    ◈
                  </span>
                  CODEWATCH
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-1.5 rounded-lg text-foreground hover:bg-[#ededf5] transition-colors"
                >
                  <HamburgerIcon open={true} />
                </button>
              </div>

              {/* Drawer nav links */}
              <nav className="flex flex-col gap-0.5 p-4 flex-1 overflow-y-auto">
                {NAV_LINKS.map(({ label, href }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + i * 0.055, duration: 0.22, ease: "easeOut" }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center px-3 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-[#f2f2f8] transition-colors"
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.25 }}
                className="p-5 border-t border-[#e2e2ee] flex flex-col gap-2.5 shrink-0"
              >
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-[#e2e2ee] text-foreground hover:bg-[#f2f2f8]"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full bg-[var(--cw-coral)] hover:bg-[var(--cw-coral)]/90 text-white border-0 shadow-md shadow-[var(--cw-coral-glow)]">
                    Get 10 Free Reviews
                  </Button>
                </Link>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
