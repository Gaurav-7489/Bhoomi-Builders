"use client";

import { useEffect } from "react";

/** Lenis's default curve (easeOutExpo), as used by the reference site. */
const easeOutExpo = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
/** Haven runs Lenis at "intensity 10", i.e. a 1 second glide per wheel input. */
const DURATION = 1000;

/**
 * Lenis-style smooth scrolling, with no extra dependency. Each wheel or
 * trackpad input moves a target position, and the page glides from wherever
 * it currently is to that target over 1s on an ease-out-expo curve.
 * Keyboard, scrollbar, touch and anchor scrolling stay native. Turned off for
 * reduced motion, touch-only devices and pinch/ctrl zoom.
 */
export function SmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    let animated = window.scrollY;
    let target = window.scrollY;
    let from = animated;
    let start = 0;
    let frame = 0;

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

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      animated = from + (target - from) * easeOutExpo(t);
      window.scrollTo({ top: animated, behavior: "instant" });
      if (t < 1 && Math.abs(target - animated) > 0.5) {
        frame = requestAnimationFrame(tick);
      } else {
        animated = target;
        frame = 0;
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey || e.defaultPrevented) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (insideScrollable(e.target, e.deltaY)) return;
      // Don't fight a locked page (e.g. open mobile menu).
      if (getComputedStyle(document.body).overflow === "hidden") return;
      e.preventDefault();
      const delta =
        e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      if (!frame) animated = target = window.scrollY;
      target = Math.max(0, Math.min(maxScroll(), target + delta));
      from = animated;
      start = performance.now();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // Keep in sync with native scrolling (keys, scrollbar, anchors, route changes).
    const onScroll = () => {
      if (!frame) animated = target = window.scrollY;
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
