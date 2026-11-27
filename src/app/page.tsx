import type { Metadata } from "next";
import Image from "@/components/Img";
import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import { ArrowIcon } from "@/components/icons";
import { ImageReveal, Reveal, RevealWords } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";
import { ScrollImage } from "@/components/motion/ScrollImage";
import { PageHero } from "@/components/PageHero";
import { ProjectGrid } from "@/components/ProjectCard";
import { SectionHead } from "@/components/SectionHead";
import { ClosingSections } from "@/components/sections";
import { home, sampleProjectsNote, services } from "@/content/pages";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import styles from "./home.module.css";

export const metadata: Metadata = pageMetadata({
  description: site.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <PageHero
        align="top"
        title={home.hero.title}
        intro={home.hero.intro}
        image={home.hero.image}
        meta={`©${site.copyrightYear}`}
        scrollCue
      />

      <div className="sheet">
        {/* Studio introduction */}
        <section className="section container" aria-label="About us">
          <div className="grid">
            <Reveal className={styles.introLabel} y={12}>
              <span className="label">{home.intro.label}</span>
            </Reveal>
            <RevealWords as="p" text={home.intro.statement} className={styles.statement} maxDuration={0.9} />
          </div>

          <div className={`grid ${styles.introMedia}`}>
            <div className={styles.introAside}>
              <Reveal>
                <p className={styles.caption}>{home.intro.caption}</p>
              </Reveal>
              <ImageReveal className={`frame ${styles.introSmall}`}>
                <Image
                  src={home.intro.imageSmall.src}
                  alt={home.intro.imageSmall.alt}
                  fill
                  loading="eager"
                  sizes="(max-width: 760px) 50vw, 22vw"
                />
              </ImageReveal>
            </div>
            <ImageReveal className={`frame ${styles.introLarge}`} delay={0.1}>
              <Image
                src={home.intro.imageLarge.src}
                alt={home.intro.imageLarge.alt}
                fill
                loading="eager"
                sizes="(max-width: 760px) 100vw, 55vw"
              />
            </ImageReveal>
          </div>

          <Reveal className={styles.centerLink}>
            <Link href={home.intro.link.href} className="text-link">
              {home.intro.link.label} <ArrowIcon />
            </Link>
          </Reveal>
        </section>

        <Marquee items={home.marquee} label="What we do" />

        <ScrollImage src={home.bands[0].src} alt={home.bands[0].alt} className={styles.band} eager />

        {/* Featured projects */}
        <section className="section container" aria-label="Featured projects">
          <SectionHead label={home.projects.label} title={home.projects.title} layout="center" />
          {projects.some((p) => p.sample) && (
            <Reveal>
              <p className="sample-note">{sampleProjectsNote}</p>
            </Reveal>
          )}
          <ProjectGrid projects={projects} />
          <Reveal className={styles.centerLink}>
            <Link href={home.projects.link.href} className="text-link">
              {home.projects.link.label} <ArrowIcon />
            </Link>
          </Reveal>
        </section>

        <ScrollImage src={home.bands[1].src} alt={home.bands[1].alt} className={styles.band} eager />

        {/* Services preview */}
        <section className="section container" aria-label="Services">
          <SectionHead label={home.services.label} title={home.services.title} />
          <Accordion
            variant="services"
            items={services.map((s) => ({ title: s.title, body: s.body, image: s.image }))}
          />
          <Reveal className={styles.centerLink}>
            <Link href={home.services.link.href} className="text-link">
              {home.services.link.label} <ArrowIcon />
            </Link>
          </Reveal>
        </section>

        <ScrollImage src={home.bands[2].src} alt={home.bands[2].alt} className={styles.band} eager />

        <ClosingSections />
      </div>
    </>
  );
}
