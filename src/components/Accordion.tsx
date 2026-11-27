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
 * With a mouse, hovering a row opens it (closing the previous one) and moving
 * the cursor off the list closes it again, Framer-style. Hover is driven by
 * real mouse movement only, so rows sliding under a still cursor (page scroll,
 * or another panel opening/closing) never trigger it. Touch and keyboard work
 * as plain click-to-toggle.
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
  const lastScroll = useRef(0);
  const lastPos = useRef({ x: -1, y: -1 });
  // Once the mouse drives the list, hover alone decides what is open.
  const mouseDriven = useRef(false);
  const Heading = `h${headingLevel}` as const;

  useEffect(() => {
    const onScroll = () => {
      lastScroll.current = performance.now();
      clearTimeout(hoverTimer.current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(hoverTimer.current);
    };
  }, []);

  const onMove = (e: React.PointerEvent, i: number) => {
    if (e.pointerType !== "mouse") return;
    // Ignore layout-shift "moves" (no motion) and anything while scrolling.
    const moved = e.clientX !== lastPos.current.x || e.clientY !== lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    if (!moved) return;
    if (e.timeStamp - lastScroll.current < 150) return;
    if (!mouseDriven.current) {
      mouseDriven.current = true;
      setOpen(new Set()); // drop the initial/keyboard state; hover takes over
    }
    if (hovered === i) {
      clearTimeout(hoverTimer.current);
      return;
    }
    clearTimeout(hoverTimer.current);
    // Short hover intent so sweeping across rows doesn't flicker.
    hoverTimer.current = setTimeout(() => setHovered(i), 90);
  };

  const onLeaveList = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(hoverTimer.current);
    setHovered(null);
  };

  const toggle = (i: number, e: React.MouseEvent) => {
    clearTimeout(hoverTimer.current);
    // A real mouse click while hover is in charge shouldn't fight it.
    if (mouseDriven.current && e.detail > 0) return;
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
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
            onPointerMove={(e) => onMove(e, i)}
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
                onClick={(e) => toggle(i, e)}
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
                    // Haven FAQ spring: stiffness 500, damping 60, mass 1.
                    height: reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 60, mass: 1 },
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
