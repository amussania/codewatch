"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// ─── Left-to-right underline animation ────────────────────────────────────────

const FOOTER_STYLES = `
  .cw-ftr-link {
    position: relative;
    display: inline-block;
    text-decoration: none;
    color: var(--cw-ink-secondary);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    transition: color 200ms ease;
  }
  .cw-ftr-link::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 1px;
    background: var(--cw-ink-primary);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .cw-ftr-link:hover {
    color: var(--cw-ink-primary);
  }
  .cw-ftr-link:hover::after {
    transform: scaleX(1);
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const LINKS: Record<string, { label: string; href: string }[]> = {
  Product: [
    { label: "How It Works",  href: "#how-it-works" },
    { label: "Specialists",   href: "#features" },
    { label: "Pricing",       href: "#pricing" },
    { label: "Security",      href: "#security" },
    { label: "FAQ",           href: "#faq" },
  ],
  Company: [
    { label: "About",   href: "/about" },
    { label: "Contact", href: "mailto:hello@codewatch.dev" },
  ],
  Legal: [
    { label: "Privacy Policy",   href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

// ─── Footer logo with spring-rotating aperture mark ───────────────────────────

function FooterLogo() {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href="/"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        textDecoration: "none",
        userSelect: "none",
      }}
    >
      <motion.span
        animate={{ rotate: hovered ? 15 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        style={{ display: "flex", color: "var(--cw-ember)", flexShrink: 0 }}
      >
        <svg width="26" height="18" viewBox="0 0 36 24" fill="none" aria-hidden>
          <path
            d="M 2 12 Q 18 2.5 34 12 Q 18 21.5 2 12 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M 18 7.5 L 22.5 12 L 18 16.5 L 13.5 12 Z" fill="currentColor" />
        </svg>
      </motion.span>

      <span style={{ fontSize: 16, color: "var(--cw-ink-primary)", lineHeight: 1 }}>
        <span className="font-heading italic">Code</span>
        <span className="font-body font-medium" style={{ letterSpacing: "0.02em" }}>
          Watch
        </span>
      </span>
    </Link>
  );
}

// ─── Social icons ─────────────────────────────────────────────────────────────

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-label="X (Twitter)">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-label="LinkedIn">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const SOCIALS = [
  { Icon: GitHubIcon,   href: "https://github.com/codewatch",               label: "GitHub"   },
  { Icon: TwitterIcon,  href: "https://twitter.com/codewatchai",             label: "X"        },
  { Icon: LinkedInIcon, href: "https://linkedin.com/company/codewatch",      label: "LinkedIn" },
];

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--cw-bg-secondary)",
        borderTop: "0.5px solid rgba(26,23,20,0.1)",
      }}
    >
      <style>{FOOTER_STYLES}</style>

      <div className="max-w-[1120px] mx-auto px-6 lg:px-12 pt-16 pb-10">

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Col 1: Logo + tagline + socials */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <FooterLogo />
            </div>
            <p
              style={{
                fontSize: 14,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                color: "var(--cw-ink-secondary)",
                lineHeight: 1.7,
                maxWidth: 220,
                margin: "0 0 20px",
              }}
            >
              Multi-specialist AI code review with business logic awareness.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: 8 }}>
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    color: "var(--cw-ink-tertiary)",
                    background: "transparent",
                    transition: "color 200ms ease, background 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.color = "var(--cw-ink-primary)";
                    el.style.background = "var(--cw-bg-surface)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.color = "var(--cw-ink-tertiary)";
                    el.style.background = "transparent";
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Cols 2–4: link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p
                style={{
                  fontSize: 11,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--cw-ink-tertiary)",
                  margin: "0 0 16px",
                }}
              >
                {heading}
              </p>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="cw-ftr-link">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "0.5px solid rgba(26,23,20,0.1)",
            paddingTop: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              fontSize: 12,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              color: "var(--cw-ink-tertiary)",
              margin: 0,
              opacity: 0.8,
            }}
          >
            © 2026 Mieux Demain Private Limited. All rights reserved.
          </p>
          <p
            style={{
              fontSize: 12,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              color: "var(--cw-ink-tertiary)",
              margin: 0,
              opacity: 0.6,
            }}
          >
            Built for founders who build fast.
          </p>
        </div>
      </div>
    </footer>
  );
}
