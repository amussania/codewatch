"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2, History, Settings, CreditCard,
  HelpCircle, LogOut, ChevronLeft,
} from "lucide-react";
import { logout } from "@/app/(auth)/actions";

const NAV = [
  { href: "/dashboard",          icon: Code2,       label: "Review"   },
  { href: "/dashboard/history",  icon: History,     label: "History"  },
  { href: "/dashboard/settings", icon: Settings,    label: "Settings" },
  { href: "/dashboard/billing",  icon: CreditCard,  label: "Billing"  },
];

const BOTTOM = [
  { href: "/docs", icon: HelpCircle, label: "Help & docs" },
];

interface Props { collapsed: boolean; onToggle: () => void }

function Label({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
          className="overflow-hidden whitespace-nowrap text-sm"
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export default function Sidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);
  }

  function itemCls(active: boolean) {
    return [
      "flex items-center gap-3 px-2.5 h-9 rounded-lg transition-colors",
      active
        ? "bg-[#ff6b6b]/15 text-[#ff6b6b]"
        : "text-muted-foreground hover:text-foreground hover:bg-white/6",
    ].join(" ");
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ type: "spring", stiffness: 280, damping: 30, mass: 0.85 }}
      className="flex flex-col h-full border-r border-white/8 bg-sidebar shrink-0 overflow-hidden"
    >
      {/* ── Logo ── */}
      <div className="flex items-center h-16 px-[18px] border-b border-white/8 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#ff6b6b] flex items-center justify-center text-white text-xs font-bold shrink-0 select-none">
            ◈
          </div>
          <Label show={!collapsed}>CodeWatch</Label>
        </Link>
      </div>

      {/* ── Primary nav ── */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {NAV.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className={itemCls(isActive(href))}>
            <Icon className="w-4 h-4 shrink-0" />
            <Label show={!collapsed}>{label}</Label>
          </Link>
        ))}
      </nav>

      {/* ── Bottom: help · logout · collapse ── */}
      <div className="px-2 py-3 space-y-0.5 border-t border-white/8 shrink-0">
        {BOTTOM.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className={itemCls(false)}>
            <Icon className="w-4 h-4 shrink-0" />
            <Label show={!collapsed}>{label}</Label>
          </Link>
        ))}

        <form action={logout}>
          <button type="submit" className={`w-full ${itemCls(false)}`}>
            <LogOut className="w-4 h-4 shrink-0" />
            <Label show={!collapsed}>Sign out</Label>
          </button>
        </form>

        <button
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`w-full ${itemCls(false)}`}
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.div>
          <Label show={!collapsed}>Collapse</Label>
        </button>
      </div>
    </motion.aside>
  );
}
