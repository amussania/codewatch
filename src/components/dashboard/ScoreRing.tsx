"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

function scoreColor(score: number) {
  if (score >= 80) return "#4a9fff";
  if (score >= 60) return "#f59e0b";
  return "#ff6b6b";
}

export default function ScoreRing({
  score,
  size = 96,
  strokeWidth = 7,
  className,
}: ScoreRingProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  const animatedScore = useMotionValue(0);
  const springScore = useSpring(animatedScore, { stiffness: 60, damping: 15 });

  const dashOffset = useTransform(
    springScore,
    [0, 100],
    [circumference, circumference - (circumference * score) / 100]
  );
  const displayScore = useTransform(springScore, (v) => Math.round(v));

  useEffect(() => {
    animatedScore.set(score);
  }, [score, animatedScore]);

  return (
    <div className={`relative flex items-center justify-center ${className ?? ""}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="oklch(1 0 0 / 8%)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={scoreColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-sm font-bold tabular-nums leading-none">
          {displayScore}
        </motion.span>
        <span className="text-[9px] text-muted-foreground mt-0.5 uppercase tracking-wide">score</span>
      </div>
    </div>
  );
}
