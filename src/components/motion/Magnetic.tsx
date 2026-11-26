"use client";

import { motion, useReducedMotion, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Wraps a button or link so it leans towards the cursor while hovered and
 * springs back on leave. Pointer-only; does nothing for touch or reduced motion.
 */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const spring = { stiffness: 220, damping: 18, mass: 0.4 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ display: "inline-flex", x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  );
}
