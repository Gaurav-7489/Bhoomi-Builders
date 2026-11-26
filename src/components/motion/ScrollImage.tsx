"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import styles from "./ScrollImage.module.css";

/**
 * Full-bleed image tied to scroll position.
 * - "scale": eases from 1.2× to 1× as the band travels up the viewport.
 * - "parallax": the photo drifts slower than the page inside its frame.
 */
export function ScrollImage({
  src,
  alt,
  mode = "scale",
  className,
  sizes = "100vw",
  children,
}: {
  src: string;
  alt: string;
  mode?: "scale" | "parallax";
  className?: string;
  sizes?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.55], [1.2, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

  const style = reduce ? undefined : mode === "scale" ? { scale } : { y, scale: 1.2 };

  return (
    <div ref={ref} className={`${styles.frame} ${className ?? ""}`}>
      <motion.div className={styles.media} style={style}>
        <Image src={src} alt={alt} fill sizes={sizes} className={styles.img} />
      </motion.div>
      {children}
    </div>
  );
}
