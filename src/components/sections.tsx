import Link from "next/link";
import { cta, faq } from "@/content/site";
import { Accordion } from "./Accordion";
import { ArrowIcon } from "./icons";
import { Magnetic } from "./motion/Magnetic";
import { Reveal, RevealWords } from "./motion/Reveal";
import { ScrollImage } from "./motion/ScrollImage";
import styles from "./sections.module.css";

/** Shared five-question FAQ on a dark panel. */
export function FaqSection() {
  return (
    <section className={`${styles.faq} section`} aria-label="Frequently asked questions">
      <div className="container grid">
        <div className={styles.faqHead}>
          <Reveal y={12}>
            <span className="label">{faq.label}</span>
          </Reveal>
          <RevealWords text={faq.title} className={`h-lg ${styles.faqTitle}`} />
        </div>
        <div className={styles.faqList}>
          <Accordion
            variant="faq"
            items={faq.items.map((i) => ({ title: i.q, body: i.a }))}
          />
        </div>
      </div>
    </section>
  );
}

/** Full-bleed photo call to action with a parallax background. */
export function ContactCta() {
  return (
    <section className={styles.cta} aria-label="Start a project">
      <ScrollImage src={cta.image.src} alt={cta.image.alt} mode="parallax" className={styles.ctaImage}>
        <div className={styles.ctaShade} aria-hidden />
        <div className={`${styles.ctaInner} container grid`}>
          <RevealWords text={cta.title} className={`h-xl ${styles.ctaTitle}`} />
          <div className={styles.ctaSide}>
            <Reveal delay={0.15}>
              <p className={styles.ctaBody}>{cta.body}</p>
            </Reveal>
            <Reveal delay={0.25}>
              <Magnetic>
                <Link href={cta.action.href} className="button button--light">
                  {cta.action.label}
                  <ArrowIcon size={18} />
                </Link>
              </Magnetic>
            </Reveal>
          </div>
        </div>
      </ScrollImage>
    </section>
  );
}

/** FAQ + CTA, the closing pair shared by most pages. */
export function ClosingSections({ showCta = true }: { showCta?: boolean }) {
  return (
    <>
      <FaqSection />
      {showCta && <ContactCta />}
    </>
  );
}
