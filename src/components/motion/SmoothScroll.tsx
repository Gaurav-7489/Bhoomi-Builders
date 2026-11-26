"use client";

import { useEffect } from "react";

/**
 * Framer-style eased wheel scrolling, with no extra dependency.
 * Mouse-wheel and trackpad input is smoothed towards a target position;
 * keyboard, scrollbar, touch and anchor scrolling stay native. Turned off
 * for reduced motion, touch-only devices and pinch/ctrl zoom.
 */
export function SmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    let target = window.scrollY;
    let current = window.scrollY;
    let frame = 0;
    const EASE = 0.1;

    const maxScroll = () => root.scrollHeight - window.innerHeight;

    /** True if the wheel event should scroll an inner scrollable element instead. */
    const insideScrollable = (el: EventTarget | null, dy: number) => {
      let node = el instanceof Element ? el : null;
      while (node && node !== document.body) {
        const style = getComputedStyle(node);
        const canScroll = /(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight;
        if (canScroll) {
          const atTop = node.scrollTop <= 0;
          const atBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 1;
          if ((dy < 0 && !atTop) || (dy > 0 && !atBottom)) return true;
        }
        node = node.parentElement;
      }
      return false;
    };

    const tick = () => {
      current += (target - current) * EASE;
      if (Math.abs(target - current) < 0.5) current = target;
      window.scrollTo({ top: current, behavior: "instant" });
      frame = current === target ? 0 : requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey || e.defaultPrevented) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (insideScrollable(e.target, e.deltaY)) return;
      // Don't fight a locked page (e.g. open mobile menu).
      if (getComputedStyle(document.body).overflow === "hidden") return;
      e.preventDefault();
      const delta = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      if (!frame) current = window.scrollY;
      target = Math.max(0, Math.min(maxScroll(), target + delta));
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // Keep in sync with native scrolling (keys, scrollbar, anchors, route changes).
    const onScroll = () => {
      if (!frame) target = current = window.scrollY;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      root.style.scrollBehavior = previousBehavior;
    };
  }, []);

  return null;
}
