"use client";

import Image from "@/components/Img";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useId } from "react";
import { renderEm } from "@/lib/text";
import styles from "./PageHero.module.css";

type Props = {
  title: string[];
  intro?: string;
  image: { src: string; alt: string };
  /** Small text in the bottom-left corner, e.g. "© 2026" or "Case study". */
  meta?: string;
  scrollCue?: boolean;
  /** "top" puts the headline top-left below the header (Haven home hero). */
  align?: "top" | "bottom";
};

/**
 * Full-viewport photo hero. It is sticky, so the page content scrolls up and
 * over it while the photo drifts at ~10% of scroll speed and darkens.
 */
export function PageHero({ title, intro, image, meta, scrollCue = false, align = "bottom" }: Props) {
  const titleId = useId();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const mediaY = useTransform(scrollY, [0, 1200], [0, -120], { clamp: true });
  const contentY = useTransform(scrollY, [0, 1200], [0, -240], { clamp: true });
  const contentOpacity = useTransform(scrollY, [0, 700], [1, 0], { clamp: true });
  const shade = useTransform(scrollY, [0, 900], [0, 0.55], { clamp: true });

  return (
    <section
      className={styles.hero}
      data-page-hero
      data-align={align}
      aria-labelledby={titleId}
    >
      <motion.div className={styles.media} style={reduce ? undefined : { y: mediaY }}>
        <div className={styles.mediaInner}>
          <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className={styles.img} />
        </div>
      </motion.div>
      <div className={styles.veil} aria-hidden />
      <motion.div className={styles.shade} style={reduce ? { opacity: 0 } : { opacity: shade }} aria-hidden />

      <motion.div
        className={`${styles.content} container`}
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <h1 id={titleId} className={styles.title}>
          {title.map((line, i) => (
            <span key={i} className={styles.line}>
              <span className={styles.lineInner} style={{ "--i": i } as React.CSSProperties}>
                {renderEm(line)}
              </span>
            </span>
          ))}
        </h1>

        <div className={styles.bottom}>
          {meta ? <p className={styles.meta}>{meta}</p> : <span />}
          {intro ? <p className={styles.intro}>{intro}</p> : <span />}
          {scrollCue ? (
            <button
              type="button"
              className={styles.cue}
              aria-label="Scroll to content"
              onClick={(e) => {
                const hero = e.currentTarget.closest("section");
                window.scrollTo({
                  top: hero?.offsetHeight ?? window.innerHeight,
                  behavior: reduce ? "auto" : "smooth",
                });
              }}
            >
              <span aria-hidden>(scroll)</span>
            </button>
          ) : (
            <span />
          )}
        </div>
      </motion.div>
    </section>
  );
}
