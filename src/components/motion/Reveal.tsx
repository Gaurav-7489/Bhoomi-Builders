"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment, type ReactNode } from "react";
import { parseEm, plainText } from "@/lib/text";
import styles from "./Reveal.module.css";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;

const VIEWPORT = { once: true, amount: 0.25 } as const;

type Tag = "h1" | "h2" | "h3" | "p" | "blockquote";

/**
 * Heading/paragraph whose words rise out of a mask in sequence when scrolled
 * into view. Screen readers get the plain sentence once.
 */
export function RevealWords({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  maxDuration = 0.7,
}: {
  text: string;
  as?: Tag;
  className?: string;
  delay?: number;
  /** Cap on the total stagger so long paragraphs don't drag. */
  maxDuration?: number;
}) {
  const words: { word: string; em: boolean }[] = [];
  for (const seg of parseEm(text)) {
    for (const w of seg.text.split(/\s+/).filter(Boolean)) words.push({ word: w, em: seg.em });
  }
  const stagger = Math.min(0.06, maxDuration / Math.max(words.length, 1));

  return (
    <Tag className={className}>
      <span className="sr-only">{plainText(text)}</span>
      <motion.span
        aria-hidden
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
      >
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className={styles.mask}>
              <motion.span
                className={styles.word}
                data-reveal
                variants={{ hidden: { y: "115%" }, show: { y: "0%" } }}
                transition={{ duration: 1, ease: EASE_EXPO }}
              >
                {w.em ? <em>{w.word}</em> : w.word}
              </motion.span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}

/** Fades and lifts its children into place once they enter the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 36,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "article" | "figure";
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      data-reveal
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 1, ease: EASE_OUT, delay }}
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
      initial={reduce ? false : { clipPath: "inset(18% 0% 0% 0%)", opacity: 0.001 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.2, ease: EASE_EXPO, delay }}
    >
      <motion.div
        className={styles.fill}
        initial={reduce ? false : { scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.6, ease: EASE_EXPO, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
