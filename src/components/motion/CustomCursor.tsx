"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import styles from "./CustomCursor.module.css";

/** Anything the dot should grow over (Haven's "Focus" cursor state). */
const FOCUS = "a, button, [role='button'], label, summary, [data-cursor]";

/**
 * Haven-style cursor: a small white dot drawn with mix-blend-mode: difference,
 * so it reads as dark on light areas and light on photos. It grows from 20px
 * to 40px over links, buttons and project cards. Mouse only: touch devices
 * and reduced motion keep the normal pointer.
 */
export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [focus, setFocus] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Haven's cursor spring: stiffness 600, damping 40, mass 0.1 (tight, no lag).
  const spring = { stiffness: 600, damping: 40, mass: 0.1 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const el = e.target instanceof Element ? e.target : null;
      setFocus(Boolean(el?.closest(FOCUS)) && !el?.closest("input, textarea, select"));
    };
    const onLeave = () => setVisible(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y]);

  return (
    <motion.div className={styles.cursor} style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }} aria-hidden>
      <motion.span
        className={styles.dot}
        animate={{ width: focus ? 40 : 20, height: focus ? 40 : 20 }}
        transition={spring}
      />
    </motion.div>
  );
}
