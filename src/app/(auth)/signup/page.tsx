"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { signup, type AuthState } from "../actions";

function PasswordStrength({ password }: { password: string }) {
  const len = password.length;
  const strength = len === 0 ? 0 : len < 8 ? 1 : len < 12 ? 2 : 3;
  const colors = ["", "#ff6b6b", "#f59e0b", "#4ade80"];
  const labels = ["", "Weak", "Fair", "Strong"];

  if (len === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="overflow-hidden"
    >
      <div className="flex items-center gap-2 mt-2">
        <div className="flex gap-1 flex-1">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden"
            >
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: strength >= i ? "100%" : "0%" }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                style={{ backgroundColor: strength >= i ? colors[strength] : "transparent" }}
              />
            </motion.div>
          ))}
        </div>
        <span className="text-[11px] font-medium" style={{ color: colors[strength] }}>
          {labels[strength]}
        </span>
      </div>
    </motion.div>
  );
}

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
            Creating account…
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Create free account
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export default function SignupPage() {
  const [state, action] = useActionState<AuthState, FormData>(signup, null);
  const [showPw, setShowPw] = useState(false);
  const [password, setPassword] = useState("");

  /* Confirmation screen */
  if (state?.message) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-[420px]"
      >
        <div className="rounded-2xl border border-white/8 bg-[var(--cw-surface)] p-10 shadow-2xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 22 }}
            className="w-14 h-14 rounded-2xl bg-[#4ade80]/15 border border-[#4ade80]/25 flex items-center justify-center mx-auto mb-5"
          >
            <CheckCircle2 className="w-7 h-7 text-[#4ade80]" />
          </motion.div>
          <h2 className="text-xl font-bold mb-2">Check your inbox</h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto mb-7">
            {state.message}
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-[#ff6b6b] font-medium hover:underline"
          >
            Back to sign in →
          </Link>
        </div>
      </motion.div>
    );
  }

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
          Start for free
        </h1>
        <p className="text-muted-foreground text-sm mb-7">
          Create your account. No credit card required.
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
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPw ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <PasswordStrength password={password} />
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

        {/* Terms */}
        <p className="text-xs text-muted-foreground text-center mt-5 leading-relaxed">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="hover:text-foreground underline underline-offset-2 transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="hover:text-foreground underline underline-offset-2 transition-colors">
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      {/* Switch to login */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-[#ff6b6b] font-medium hover:underline">
          Sign in →
        </Link>
      </p>
    </motion.div>
  );
}
