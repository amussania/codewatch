"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const logoRotate = useSpring(0, { stiffness: 400, damping: 20 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        animate={
          scrolled
            ? { backgroundColor: "rgba(255,255,255,1)", boxShadow: "0 1px 0 #e8e8e2" }
            : { backgroundColor: "rgba(255,255,255,0)", boxShadow: "0 1px 0 rgba(232,232,226,0)" }
        }
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <nav className="max-w-[1120px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <motion.div
              style={{ rotate: logoRotate }}
              onHoverStart={() => logoRotate.set(180)}
              onHoverEnd={() => logoRotate.set(0)}
              className="w-7 h-7 rounded-lg bg-[#ff5b35] flex items-center justify-center text-white text-xs font-bold select-none"
            >
              ◈
            </motion.div>
            <span className="font-heading text-xl tracking-[.08em] text-[#0d0d0d]">CODEWATCH</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-[13px] text-[#999990] hover:text-[#0d0d0d] transition-colors duration-200"
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
                className="text-[#999990] hover:text-[#0d0d0d] text-[13px]"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-[#ff5b35] hover:bg-[#ff5b35]/90 text-white border-0 shadow-lg shadow-[#ff5b3530] rounded-xl px-5 font-semibold"
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
            className="md:hidden p-2 -mr-2 rounded-lg text-[#0d0d0d] hover:bg-[#eeede8] transition-colors"
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="drawer-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              key="drawer-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.9 }}
              className="fixed top-0 right-0 bottom-0 z-[60] w-72 flex flex-col bg-white border-l border-[#e8e8e2] md:hidden"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-[#e8e8e2] shrink-0">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 font-heading text-xl tracking-[.08em] text-[#0d0d0d]"
                >
                  <span className="w-6 h-6 rounded-lg bg-[#ff5b35] flex items-center justify-center text-[10px] text-white font-bold">
                    ◈
                  </span>
                  CODEWATCH
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-1.5 rounded-lg text-[#0d0d0d] hover:bg-[#eeede8] transition-colors"
                >
                  <HamburgerIcon open={true} />
                </button>
              </div>

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
                      className="flex items-center px-3 py-3 rounded-xl text-[13px] font-medium text-[#999990] hover:text-[#0d0d0d] hover:bg-[#f5f4f0] transition-colors"
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.25 }}
                className="p-5 border-t border-[#e8e8e2] flex flex-col gap-2.5 shrink-0"
              >
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-[#e8e8e2] text-[#0d0d0d] hover:bg-[#f5f4f0] rounded-xl">
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full bg-[#ff5b35] hover:bg-[#ff5b35]/90 text-white border-0 shadow-md shadow-[#ff5b3530] rounded-xl font-semibold">
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
