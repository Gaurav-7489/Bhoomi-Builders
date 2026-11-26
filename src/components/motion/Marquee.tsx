import styles from "./Marquee.module.css";

/**
 * Endless scrolling band of words (pure CSS). The list is repeated so the
 * loop is seamless; screen readers get it once. Pauses on hover and stops
 * for reduced motion.
 */
export function Marquee({ items, label }: { items: string[]; label: string }) {
  const row = (hidden: boolean) => (
    <ul className={styles.row} aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className={styles.item}>
          {item}
          <span className={styles.dot} aria-hidden>
            ✦
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section className={styles.marquee} aria-label={label}>
      <div className={styles.track}>
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
