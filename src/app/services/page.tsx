import type { Metadata } from "next";
import Image from "@/components/Img";
import { ImageReveal, Reveal, RevealWords } from "@/components/motion/Reveal";
import { PageHero } from "@/components/PageHero";
import { ClosingSections } from "@/components/sections";
import { services, servicesPage } from "@/content/pages";
import styles from "./services.module.css";

export const metadata: Metadata = {
  title: "Services",
  description:
    "House construction, commercial construction, renovation and remodelling, and design and planning in Thrissur, Kerala.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title={servicesPage.hero.title}
        intro={servicesPage.hero.intro}
        image={servicesPage.hero.image}
        meta={`${services.length} services`}
        scrollCue
      />
      <div className="sheet">
        <section className="section container" aria-label="Our services">
          <ol className={styles.list}>
            {services.map((s, i) => (
              <li key={s.slug} id={s.slug} className={`grid ${styles.item}`}>
                <Reveal className={styles.number} y={20}>
                  <span aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                </Reveal>
                <div className={styles.text}>
                  <RevealWords as="h2" text={s.title} className={styles.title} />
                  <Reveal delay={0.12}>
                    <p className={styles.body}>{s.body}</p>
                  </Reveal>
                </div>
                <ImageReveal className={`frame ${styles.image}`}>
                  <Image src={s.image.src} alt={s.image.alt} fill sizes="(max-width: 760px) 100vw, 40vw" />
                </ImageReveal>
              </li>
            ))}
          </ol>
        </section>
        <ClosingSections />
      </div>
    </>
  );
}
