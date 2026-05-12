import Link from "next/link";

const LINKS = {
  Product: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features",     href: "#features" },
    { label: "Pricing",      href: "#pricing" },
    { label: "Security",     href: "#security" },
    { label: "FAQ",          href: "#faq" },
  ],
  Compare: [
    { label: "vs CodeRabbit", href: "#comparison" },
    { label: "vs Greptile",   href: "#comparison" },
    { label: "vs Copilot",    href: "#comparison" },
    { label: "vs Codacy",     href: "#comparison" },
  ],
  Company: [
    { label: "About",           href: "/about" },
    { label: "Privacy Policy",  href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Contact",         href: "mailto:hello@codewatch.dev" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[#ebebeb] bg-white">
      <div className="max-w-[1100px] mx-auto px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-[5px] bg-[#ff5b35] flex items-center justify-center text-white text-xs font-bold select-none">
                ◈
              </div>
              <span className="font-heading text-xl tracking-[.08em] text-[#0a0f1e]">CODEWATCH</span>
            </Link>
            <p className="text-sm text-[#3d4f6b] leading-relaxed max-w-[220px]">
              Multi-specialist AI code review with business logic awareness. Built for the era of AI-generated code.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[.18em] text-[#8896ab]/70 mb-5">
                — {heading}
              </p>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-[#3d4f6b] hover:text-[#ff5b35] transition-colors duration-200"
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
        <div className="border-t border-[#ebebeb] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-[10px] text-[#8896ab]/60 tracking-[.06em]">
            © 2026 Mieux Demain Private Limited. All rights reserved.
          </p>
          <p className="font-sans text-[10px] text-[#8896ab]/50 text-center md:text-right tracking-[.06em]">
            Built for the era of AI-generated code. Your code is never stored.
          </p>
        </div>
      </div>
    </footer>
  );
}
