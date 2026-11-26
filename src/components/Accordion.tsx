"use client";

import Image from "@/components/Img";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { PlusIcon } from "./icons";
import { EASE_EXPO } from "./motion/Reveal";
import styles from "./Accordion.module.css";

type Item = {
  title: string;
  body: string;
  image?: { src: string; alt: string };
};

/**
 * Disclosure list used by the FAQ (dark) and the home services preview.
 * Each row toggles independently; the first row starts open.
 *
 * With a mouse, hovering a row also opens it (and closes the previously
 * hovered one) after a short pause, Framer-style. Clicking a hover-opened row
 * keeps it open; clicking an open row closes it. Touch and keyboard work as
 * plain click-to-toggle.
 */
export function Accordion({
  items,
  variant,
  headingLevel = 3,
  defaultOpen = [0],
}: {
  items: Item[];
  variant: "faq" | "services";
  headingLevel?: 2 | 3;
  defaultOpen?: number[];
}) {
  const baseId = useId();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<Set<number>>(() => new Set(defaultOpen));
  const [hovered, setHovered] = useState<number | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const Heading = `h${headingLevel}` as const;

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const onEnter = (e: React.PointerEvent, i: number) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(hoverTimer.current);
    // Short hover intent so sweeping the cursor across rows doesn't flicker.
    hoverTimer.current = setTimeout(() => setHovered(i), 140);
  };

  const onLeaveList = () => {
    clearTimeout(hoverTimer.current);
    setHovered(null);
  };

  const toggle = (i: number) => {
    clearTimeout(hoverTimer.current);
    if (open.has(i)) {
      setOpen((prev) => {
        const next = new Set(prev);
        next.delete(i);
        return next;
      });
      setHovered(null);
    } else {
      // Pins a row that is closed or only open because of hover.
      setOpen((prev) => new Set(prev).add(i));
    }
  };

  return (
    <ul className={`${styles.list} ${styles[variant]}`} onPointerLeave={onLeaveList}>
      {items.map((item, i) => {
        const isOpen = open.has(i) || hovered === i;
        const btnId = `${baseId}-btn-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        const number = String(i + 1).padStart(2, "0");
        return (
          <motion.li
            key={item.title}
            className={styles.item}
            data-open={isOpen ? "" : undefined}
            onPointerEnter={(e) => onEnter(e, i)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: EASE_EXPO, delay: i * 0.06 }}
          >
            <Heading className={styles.heading}>
              <button
                id={btnId}
                type="button"
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
              >
                {variant === "services" && <span className={styles.number}>{number}</span>}
                <span className={styles.title}>{item.title}</span>
                <span className={styles.icon}>
                  <PlusIcon open={isOpen} />
                </span>
              </button>
            </Heading>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className={styles.panel}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: reduce ? 0 : 0.7, ease: EASE_EXPO },
                    opacity: { duration: reduce ? 0 : 0.45, ease: "easeOut" },
                  }}
                >
                  <PanelBody item={item} sizes="(max-width: 760px) 100vw, 40vw" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ul>
  );
}

function PanelBody({ item, sizes }: { item: Item; sizes: string }): ReactNode {
  return (
    <div className={styles.panelInner}>
      <p className={styles.body}>{item.body}</p>
      {item.image && (
        <div className={`frame ${styles.image}`}>
          <Image src={item.image.src} alt={item.image.alt} fill sizes={sizes} />
        </div>
      )}
    </div>
  );
}
