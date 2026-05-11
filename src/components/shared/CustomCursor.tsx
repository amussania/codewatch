"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

const CORAL = "#00b85f";

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  const x = useSpring(0, { stiffness: 600, damping: 32 });
  const y = useSpring(0, { stiffness: 600, damping: 32 });

  useEffect(() => {
    setMounted(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("button, a, [role=button], [data-cursor=pointer]")) {
        setHovered(true);
      }
    };

    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("button, a, [role=button], [data-cursor=pointer]")) {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [x, y]);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ x, y }}
    >
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{
          width: hovered ? 36 : 12,
          height: hovered ? 36 : 12,
          backgroundColor: hovered ? "transparent" : CORAL,
          borderWidth: hovered ? 1.5 : 0,
          borderColor: CORAL,
          borderStyle: "solid",
          opacity: hovered ? 0.4 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      />
    </motion.div>
  );
}
