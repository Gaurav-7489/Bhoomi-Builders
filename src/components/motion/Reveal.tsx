"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { Fragment, useLayoutEffect, useRef, type ReactNode } from "react";
import { parseEm, plainText } from "@/lib/text";
import styles from "./Reveal.module.css";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
/** Haven text/line appear easing. */
export const EASE_LINE = [0.44, 0, 0.13, 0.96] as const;


type Tag = "h1" | "h2" | "h3" | "p" | "blockquote";

/**
 * Heading/paragraph that appears line by line when scrolled into view, like
 * Haven's text effect: each line rises 14px and fades in over 0.4s
 * (ease .44,0,.13,.96), 0.11s after the line above. Lines are measured after
 * layout, so they follow however the text actually wraps. Screen readers get
 * the plain sentence once.
 */
export function RevealWords({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
}: {
  text: string;
  as?: Tag;
  className?: string;
  delay?: number;
  /** Kept for compatibility; line timing is fixed to match the reference. */
  maxDuration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0 });
  const words: { word: string; em: boolean }[] = [];
  for (const seg of parseEm(text)) {
    for (const w of seg.text.split(/\s+/).filter(Boolean)) words.push({ word: w, em: seg.em });
  }

  // Number each word by the visual line it sits on.
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const assign = () => {
      let line = -1;
      let lastTop = -Infinity;
      root.querySelectorAll<HTMLElement>(`.${styles.word}`).forEach((el) => {
        const top = el.offsetTop;
        if (top > lastTop + 2) {
          line += 1;
          lastTop = top;
        }
        el.style.setProperty("--line", String(line));
      });
    };
    assign();
    const ro = new ResizeObserver(assign);
    ro.observe(root);
    return () => ro.disconnect();
  }, [text]);

  return (
    <Tag className={className}>
      <span className="sr-only">{plainText(text)}</span>
      <span
        ref={ref}
        aria-hidden
        className={styles.lines}
        data-inview={inView ? "" : undefined}
        style={{ "--start": `${0.1 + delay}s` } as React.CSSProperties}
      >
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className={styles.word} data-reveal>
              {w.em ? <em>{w.word}</em> : w.word}
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}

/** Fades and lifts its children into place once they enter the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 14,
  duration = 0.6,
  amount = 0.25,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  /** How much of the element must be visible before it appears (0–1). */
  amount?: number;
  as?: "div" | "li" | "section" | "article" | "figure";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      data-reveal
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, ease: EASE_LINE, delay: delay + 0.1 }}
    >
      {children}
    </Comp>
  );
}

/**
 * Image frame that wipes open from the bottom while the picture settles from
 * a slight zoom. Children should be a next/image with `fill`.
 */
export function ImageReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      data-reveal
      initial={reduce ? false : { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.7, ease: EASE_EXPO, delay }}
    >
      <motion.div
        className={styles.fill}
        initial={reduce ? false : { scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: EASE_EXPO, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
