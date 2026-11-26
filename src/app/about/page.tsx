import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import Image from "@/components/Img";
import { ImageReveal, Reveal, RevealWords } from "@/components/motion/Reveal";
import { PageHero } from "@/components/PageHero";
import { SectionHead } from "@/components/SectionHead";
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
    value: String(aboutPage.team.members.length).padStart(2, "0"),
    label: "Designated partners leading design and construction together.",
  },
  {
    value: "01",
    label: "Integrated team taking projects from first drawings to finished building.",
  },
] as const;

export default function AboutPage() {
  const { hero, statement, story, storyImage, team } = aboutPage;
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

        <section className="section container" aria-label="Team">
          <SectionHead label={team.label} title={team.title} layout="center" />
          <ul className={styles.team}>
            {team.members.map((m, i) => (
              <Reveal as="li" key={m.name} className={styles.member} delay={(i % 3) * 0.08}>
                <span className={styles.memberIndex} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.name}>{m.name}</h3>
                <p className={styles.role}>{m.role}</p>
              </Reveal>
            ))}
          </ul>
        </section>

        <ClosingSections />
      </div>
    </>
  );
}
