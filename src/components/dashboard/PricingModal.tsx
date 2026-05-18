"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Zap, Crown, Building2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier?: string;
}

const TIERS = [
  {
    id: "solo",
    name: "Solo",
    price: "$9",
    period: "/month",
    credits: 30,
    description: "For individual developers",
    icon: Zap,
    features: [
      "30 reviews per month",
      "All 5 specialists",
      "Fail-safe rewrite",
      "7-day history",
    ],
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "/month",
    credits: 120,
    description: "For professional developers",
    icon: Crown,
    features: [
      "120 reviews per month",
      "All 5 specialists",
      "Fail-safe rewrite",
      "Humanisation layer",
      "30-day history",
      "Priority processing",
    ],
    highlight: true,
  },
  {
    id: "studio",
    name: "Studio",
    price: "$79",
    period: "/month",
    credits: 400,
    description: "For small teams",
    icon: Building2,
    features: [
      "400 reviews per month",
      "Everything in Pro",
      "Team collaboration",
      "Custom rules",
      "90-day history",
    ],
    highlight: false,
  },
  {
    id: "agency",
    name: "Agency",
    price: "$199",
    period: "/month",
    credits: 1000,
    description: "For agencies & enterprises",
    icon: Rocket,
    features: [
      "1,000 reviews per month",
      "Everything in Studio",
      "SSO & SAML",
      "Dedicated support",
      "Unlimited history",
      "SLA guarantee",
    ],
    highlight: false,
  },
];

const TOPUP = {
  credits: 25,
  price: "$2.99",
  description: "Never expire",
};

export default function PricingModal({ isOpen, onClose, currentTier = "free" }: PricingModalProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (tier: string) => {
    setIsLoading(tier);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to create checkout");
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[var(--cw-bg-surface)] rounded-2xl border border-[var(--cw-bg-secondary)] shadow-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-[var(--cw-bg-surface)] border-b border-[var(--cw-bg-secondary)] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-semibold text-[var(--cw-ink-primary)]">Upgrade your plan</h2>
                <p className="text-sm text-[var(--cw-ink-tertiary)] mt-1">
                  Choose the plan that fits your needs
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[var(--cw-bg-secondary)] transition-colors"
              >
                <X className="w-5 h-5 text-[var(--cw-ink-secondary)]" />
              </button>
            </div>

            {/* Plans grid */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {TIERS.map((tier) => {
                  const Icon = tier.icon;
                  const isCurrent = currentTier === tier.id;
                  const isLoadingThis = isLoading === tier.id;

                  return (
                    <div
                      key={tier.id}
                      className={[
                        "relative rounded-xl border p-5 flex flex-col",
                        tier.highlight
                          ? "border-[var(--cw-ember)] bg-[var(--cw-ember-light)]"
                          : "border-[var(--cw-bg-secondary)] bg-[var(--cw-bg-surface)]",
                        isCurrent && "opacity-60",
                      ].join(" ")}
                    >
                      {tier.highlight && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--cw-ember)] text-white text-xs font-medium">
                          Most Popular
                        </span>
                      )}

                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="w-5 h-5 text-[var(--cw-ember)]" />
                        <h3 className="font-semibold text-[var(--cw-ink-primary)]">{tier.name}</h3>
                      </div>

                      <div className="mb-3">
                        <span className="text-2xl font-bold text-[var(--cw-ink-primary)]">{tier.price}</span>
                        <span className="text-[var(--cw-ink-tertiary)] text-sm">{tier.period}</span>
                      </div>

                      <p className="text-sm text-[var(--cw-ink-tertiary)] mb-4">{tier.description}</p>

                      <div className="text-sm font-medium text-[var(--cw-ink-secondary)] mb-4">
                        {tier.credits} credits/month
                      </div>

                      <ul className="space-y-2 mb-6 flex-1">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-[var(--cw-signal-pass)] shrink-0 mt-0.5" />
                            <span className="text-[var(--cw-ink-secondary)]">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        onClick={() => handleSubscribe(tier.id)}
                        disabled={isCurrent || !!isLoadingThis}
                        className={[
                          "w-full",
                          tier.highlight
                            ? "bg-[var(--cw-ember)] hover:brightness-110 text-white"
                            : "bg-[var(--cw-bg-secondary)] hover:bg-[var(--cw-ember-light)] text-[var(--cw-ink-primary)]",
                        ].join(" ")}
                      >
                        {isCurrent ? "Current Plan" : isLoadingThis ? "Loading..." : "Subscribe"}
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Top-up section */}
              <div className="mt-6 p-5 rounded-xl border border-[var(--cw-bg-secondary)] bg-[var(--cw-bg-surface)] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-[var(--cw-ember-light)]">
                    <Zap className="w-6 h-6 text-[var(--cw-ember)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--cw-ink-primary)]">Need more credits?</h3>
                    <p className="text-sm text-[var(--cw-ink-tertiary)]">
                      {TOPUP.credits} credits for {TOPUP.price} — {TOPUP.description}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => handleSubscribe("topup")}
                  disabled={isLoading === "topup"}
                  variant="outline"
                  className="border-[var(--cw-ember)] text-[var(--cw-ember)] hover:bg-[var(--cw-ember-light)]"
                >
                  {isLoading === "topup" ? "Loading..." : "Top Up"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
