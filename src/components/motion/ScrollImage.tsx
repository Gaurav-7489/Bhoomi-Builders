"use client";

import Image from "@/components/Img";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import styles from "./ScrollImage.module.css";

/**
 * Full-bleed image tied to scroll position.
 * - "scale" (Haven photo band): the band pins to the top of the screen while
 *   the next section slides over it, and the photo eases from 1.2x to 1x on
 *   a soft spring (stiffness 200, damping 60) as the band scrolls into place.
 * - "parallax": the photo drifts slower than the page inside its frame.
 */
export function ScrollImage({
  src,
  alt,
  mode = "scale",
  className,
  sizes = "100vw",
  eager = false,
  children,
}: {
  src: string;
  alt: string;
  mode?: "scale" | "parallax";
  className?: string;
  sizes?: string;
  /** Load now instead of when near the viewport. Use for bands near the top of a page. */
  eager?: boolean;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const pinned = mode === "scale";
  // A pinned band stops moving once it reaches the top, so measure until then.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: pinned ? ["start end", "start start"] : ["start end", "end start"],
  });
  const rawScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const scale = useSpring(rawScale, { stiffness: 200, damping: 60, mass: 1 });
  const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

  const style = reduce ? undefined : pinned ? { scale } : { y, scale: 1.2 };

  return (
    <div ref={ref} className={`${styles.frame} ${pinned ? "pin" : ""} ${className ?? ""}`}>
      <motion.div className={styles.media} style={style}>
        <Image src={src} alt={alt} fill sizes={sizes} className={styles.img} loading={eager ? "eager" : undefined} />
      </motion.div>
      {children}
    </div>
  );
}
