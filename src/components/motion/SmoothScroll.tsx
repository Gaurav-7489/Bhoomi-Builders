"use client";

import { useEffect } from "react";

/**
 * Fraction of the remaining distance covered per 60fps frame. Lower = a longer,
 * softer glide. Frame-rate independent: the step scales with the frame time.
 */
const EASE = 0.09;

/**
 * Smooth wheel / trackpad scrolling without a dependency. Each wheel input moves
 * a target position; every frame the page closes a fixed share of the gap to it.
 * Extra input during a glide just extends the target, so the motion stays
 * continuous instead of restarting. Keyboard, scrollbar, touch and anchor
 * scrolling stay native. Off for reduced motion, touch-only devices and zoom.
 */
export function SmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    let current = window.scrollY; // where the page is drawn this frame
    let target = window.scrollY; // where the wheel says it should be
    let frame = 0; // 0 = idle
    let last = 0;

    const maxScroll = () => Math.max(0, root.scrollHeight - window.innerHeight);

    /** True if the wheel should scroll an inner scrollable element instead. */
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

    /** The page is locked (open mobile menu): leave scrolling to the browser. */
    const locked = () =>
      getComputedStyle(root).overflow === "hidden" || getComputedStyle(document.body).overflow === "hidden";

    const step = (now: number) => {
      const dt = last ? Math.min(64, now - last) : 16.7;
      last = now;
      const k = 1 - Math.pow(1 - EASE, dt / 16.7);
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.5) current = target;
      window.scrollTo(0, current);
      if (current === target) {
        frame = 0;
        last = 0;
      } else {
        frame = requestAnimationFrame(step);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey || e.defaultPrevented) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (insideScrollable(e.target, e.deltaY) || locked()) return;
      e.preventDefault();
      const delta =
        e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      if (!frame) current = target = window.scrollY;
      target = Math.max(0, Math.min(maxScroll(), target + delta));
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(step);
      }
    };

    // Keep in sync with native scrolling (keys, scrollbar, anchors, route changes).
    // Our own programmatic scrolls happen while `frame` is set, so they are ignored.
    const onScroll = () => {
      if (!frame) current = target = window.scrollY;
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
