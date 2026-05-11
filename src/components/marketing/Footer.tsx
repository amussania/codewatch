import Link from "next/link";

const LINKS = {
  Product: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Security", href: "#security" },
    { label: "FAQ", href: "#faq" },
  ],
  Compare: [
    { label: "vs CodeRabbit", href: "#comparison" },
    { label: "vs Greptile", href: "#comparison" },
    { label: "vs Copilot", href: "#comparison" },
    { label: "vs Codacy", href: "#comparison" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Contact", href: "mailto:hello@codewatch.dev" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[#e2e2ee] bg-[var(--cw-surface)]">
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-10">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#00b85f] flex items-center justify-center text-white text-xs font-bold select-none">
                ◈
              </div>
              <span className="font-heading text-xl tracking-[.08em] text-foreground">CODEWATCH</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
              Multi-specialist AI code review with business logic awareness. Built for the era of AI-generated code.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">
                {heading}
              </p>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#e2e2ee] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/50">
            © 2026 Mieux Demain Private Limited. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/40 text-center md:text-right max-w-sm">
            Built for the era of AI-generated code. Your code is never stored.
          </p>
        </div>
      </div>
    </footer>
  );
}
