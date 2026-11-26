import { Reveal, RevealWords } from "./motion/Reveal";
import styles from "./SectionHead.module.css";

/** Small dotted label + large serif heading, either split or centred. */
export function SectionHead({
  label,
  title,
  layout = "split",
  as = "h2",
}: {
  label: string;
  title: string;
  layout?: "split" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <div className={`${styles.head} ${styles[layout]} grid`}>
      <Reveal className={styles.label} y={12}>
        <span className="label">{label}</span>
      </Reveal>
      <RevealWords as={as} text={title} className={`h-lg ${styles.title}`} />
    </div>
  );
}
