"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { login, type AuthState } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="relative w-full h-11 rounded-xl bg-[#ff6b6b] text-white text-sm font-semibold transition-all shadow-lg shadow-[#ff6b6b33] hover:bg-[#ff6b6b]/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b6b] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <AnimatePresence mode="wait" initial={false}>
        {pending ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Signing in…
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Sign in
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export default function LoginPage() {
  const [state, action] = useActionState<AuthState, FormData>(login, null);
  const [showPw, setShowPw] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-[420px]"
    >
      {/* Card */}
      <div className="rounded-2xl border border-white/8 bg-[var(--cw-surface)] p-8 shadow-2xl">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-8 group">
          <div className="w-8 h-8 rounded-xl bg-[#ff6b6b] flex items-center justify-center text-white font-bold text-sm select-none">
            ◈
          </div>
          <span className="font-semibold text-foreground group-hover:text-foreground/80 transition-colors">
            CodeWatch
          </span>
        </Link>

        <h1 className="text-[1.6rem] font-bold tracking-tight leading-tight mb-1">
          Welcome back
        </h1>
        <p className="text-muted-foreground text-sm mb-7">
          Sign in to continue to your dashboard.
        </p>

        <form action={action} className="space-y-4" noValidate>
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              spellCheck={false}
              placeholder="you@example.com"
              className="w-full h-11 px-3.5 rounded-xl bg-white/[0.05] border border-white/10 text-foreground placeholder:text-muted-foreground/50 text-sm transition-all outline-none focus:border-[#ff6b6b] focus:ring-1 focus:ring-[#ff6b6b]"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-[#ff6b6b] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPw ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-white/[0.05] border border-white/10 text-foreground placeholder:text-muted-foreground/50 text-sm transition-all outline-none focus:border-[#ff6b6b] focus:ring-1 focus:ring-[#ff6b6b]"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                tabIndex={-1}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Server error */}
          <AnimatePresence>
            {state?.error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 mt-px shrink-0" />
                  <span>{state.error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-1">
            <SubmitButton />
          </div>
        </form>
      </div>

      {/* Divider + OAuth placeholder */}
      <div className="flex items-center gap-3 my-5 px-1">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      <button
        disabled
        className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.03] text-muted-foreground text-sm font-medium flex items-center justify-center gap-2.5 cursor-not-allowed opacity-50"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google — coming soon
      </button>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[#ff6b6b] font-medium hover:underline">
          Sign up free →
        </Link>
      </p>
    </motion.div>
  );
}
