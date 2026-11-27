"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import styles from "./PageTransition.module.css";

// The first page load already has the intro preloader, so the curtain only
// plays on client-side navigations after that.
let hasMounted = false;

/**
 * Used by app/template.tsx, which re-mounts on every navigation: a dark
 * curtain lifts off the new page while its content settles into place.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  // Decided once per mount. Always false on the server and on the first
  // hydration, so server and client HTML match.
  const [play] = useState(() => typeof window !== "undefined" && hasMounted && !reduce);
  useEffect(() => {
    hasMounted = true;
  }, []);

  return (
    <>
      {play && (
        <motion.div
          className={styles.curtain}
          aria-hidden
          initial={{ y: "0%" }}
          animate={{ y: "-100%" }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
        />
      )}
      <motion.div
        initial={play ? { opacity: 1 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
      >
        {children}
      </motion.div>
    </>
  );
}
