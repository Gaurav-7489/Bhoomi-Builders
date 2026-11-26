"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import styles from "./CustomCursor.module.css";

/**
 * A round label that follows the mouse over anything marked
 * data-cursor="<label>" (e.g. project cards show "View").
 * Mouse-only: without a fine pointer (or with reduced motion) no listener is
 * attached, so the label never appears.
 */
export function CustomCursor() {
  const [label, setLabel] = useState<string | null>(null);
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const x = useSpring(mx, { stiffness: 500, damping: 40, mass: 0.5 });
  const y = useSpring(my, { stiffness: 500, damping: 40, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      const el = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-cursor]") : null;
      setLabel(el?.dataset.cursor ?? null);
    };
    const onLeave = () => setLabel(null);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [mx, my]);

  return (
    <motion.div className={styles.cursor} style={{ x, y }} aria-hidden>
      <AnimatePresence>
        {label && (
          <motion.span
            key="bubble"
            className={styles.bubble}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
