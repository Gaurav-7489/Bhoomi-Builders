import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import Image from "@/components/Img";
import { ImageReveal, Reveal, RevealWords } from "@/components/motion/Reveal";
import { PageHero } from "@/components/PageHero";
import { ClosingSections } from "@/components/sections";
import { aboutPage, services } from "@/content/pages";
import { site } from "@/content/site";
import styles from "./about.module.css";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description:
    "Bhoomi Builders (VNV Bhoomi Builders LLP, LLPIN ACO-9606) is a design and construction company in Thrissur, Kerala, established in 2025 and led by three designated partners.",
  path: "/about",
  image: "/images/pages/about.jpg",
});

const HIGHLIGHTS = [
  {
    value: String(site.founded),
    label: "Established in Thrissur, Kerala as VNV Bhoomi Builders LLP.",
  },
  {
    value: String(services.length).padStart(2, "0"),
    label: "Core disciplines across homes, commercial buildings, renovations, and planning.",
  },
  {
    value: "07.06",
    label: "Legal commencement of VNV Bhoomi Builders LLP, LLPIN ACO-9606.",
  },
] as const;

export default function AboutPage() {
  const { hero, statement, story, storyImage } = aboutPage;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "About", path: "/about" }])} />
      <PageHero
        title={hero.title}
        intro={hero.intro}
        image={hero.image}
        meta={`Est. ${site.founded}`}
        scrollCue
      />

      <div className="sheet">
        <section className="section container" aria-label="Our approach">
          <RevealWords as="p" text={statement} className={styles.statement} maxDuration={0.9} />

          <dl className={styles.stats}>
            {HIGHLIGHTS.map((item, i) => (
              <Reveal as="div" key={item.label} className={styles.stat} delay={i * 0.06}>
                <dt className={styles.statValue}>{item.value}</dt>
                <dd className={styles.statLabel}>{item.label}</dd>
              </Reveal>
            ))}
          </dl>
        </section>

        <section className={`${styles.story} container`} aria-label="Our story">
          {story.map((block, i) => (
            <div key={block.heading} className={`grid ${styles.storyRow}`} data-flip={i % 2 ? "" : undefined}>
              <div className={styles.storyText}>
                <RevealWords as="h2" text={block.heading} className="h-md" />
                <Reveal delay={0.1}>
                  <p className="body-lg">{block.body}</p>
                </Reveal>
              </div>
              <ImageReveal className={`frame ${styles.storyImage}`}>
                <Image src={block.image.src} alt={block.image.alt} fill sizes="(max-width: 760px) 100vw, 50vw" />
              </ImageReveal>
            </div>
          ))}
          <ImageReveal className={`frame ${styles.storyWide}`}>
            <Image src={storyImage.src} alt={storyImage.alt} fill sizes="100vw" />
          </ImageReveal>
        </section>

        <ClosingSections />
      </div>
    </>
  );
}
