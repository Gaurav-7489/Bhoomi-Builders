"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { contact, nav, site, socials } from "@/content/site";
import { EASE_EXPO } from "./motion/Reveal";
import styles from "./Header.module.css";

/** The hero of the currently visible route (hidden routes stay in the DOM). */
function visibleHero(): HTMLElement | null {
  const heroes = document.querySelectorAll<HTMLElement>("[data-page-hero]");
  for (const h of heroes) if (h.getClientRects().length > 0) return h;
  return null;
}

export function Header() {
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const [solid, setSolid] = useState(false);
  const [tucked, setTucked] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const close = useCallback((restoreFocus = true) => {
    setOpenOn(null);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = visibleHero();
      const threshold = hero ? hero.offsetHeight - 64 : -1;
      const y = window.scrollY;
      setSolid(y > threshold);
      if (Math.abs(y - last) > 6) {
        setTucked(y > Math.max(threshold, 0) + 240 && y > last);
        last = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("a");
    const t = window.setTimeout(() => first?.focus(), 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current || !buttonRef.current) return;
      const items = [buttonRef.current, ...panelRef.current.querySelectorAll<HTMLElement>("a[href]")];
      const idx = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (idx <= 0 ? items.length - 1 : idx - 1) : idx === items.length - 1 ? 0 : idx + 1;
      e.preventDefault();
      items[next]?.focus();
    };
    const mq = window.matchMedia("(min-width: 901px)");
    const onMq = () => mq.matches && close(false);

    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      window.clearTimeout(t);
      root.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, close]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={styles.header}
      data-solid={solid && !open ? "" : undefined}
      data-tucked={tucked && !open ? "" : undefined}
      data-open={open ? "" : undefined}
    >
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className={`${styles.bar} container`}>
        <Link href="/" className={styles.logo} aria-label={`${site.displayName} — home`}>
          <span className={styles.logoWord}>
            {site.name}
            <sup className={styles.logoReg}>®</sup>
          </span>
        </Link>

        <nav aria-label="Main" className={styles.desktopNav}>
          <ul>
            {nav
              .filter((n) => n.href !== "/contact")
              .map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.navLink}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <Link
          href="/contact"
          className={`${styles.navLink} ${styles.contactLink}`}
          aria-current={isActive("/contact") ? "page" : undefined}
        >
          Contact
        </Link>

        <button
          ref={buttonRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => (open ? close(false) : setOpenOn(pathname))}
        >
          <span className={styles.menuLabel}>{open ? "Close" : "Menu"}</span>
          <span className={styles.burger} aria-hidden>
            <span />
            <span />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            ref={panelRef}
            id="mobile-menu"
            aria-label="Mobile"
            className={styles.panel}
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className={`${styles.panelLinks} container`}>
              {[{ label: "Home", href: "/" }, ...nav].map((item, i) => (
                <li key={item.href} className={styles.panelItem}>
                  <motion.span
                    className={styles.panelMask}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.2 + i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={styles.panelLink}
                      aria-current={pathname === item.href ? "page" : undefined}
                      onClick={() => close(false)}
                    >
                      <span className={styles.panelIndex}>0{i + 1}</span>
                      {item.label}
                    </Link>
                  </motion.span>
                </li>
              ))}
            </ul>
            <motion.div
              className={`${styles.panelFoot} container`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.5 }}
            >
              {socials.length > 0 && (
                <ul>
                  {socials.map((s) => (
                    <li key={s.href}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer">
                WhatsApp <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a href={contact.phoneHref}>{contact.phone}</a>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
