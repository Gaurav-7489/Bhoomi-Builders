import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Image from "@/components/Img";
import { notFound } from "next/navigation";
import { ImageReveal, Reveal, RevealWords } from "@/components/motion/Reveal";
import { PageHero } from "@/components/PageHero";
import { ProjectCard } from "@/components/ProjectCard";
import { ClosingSections } from "@/components/sections";
import { sampleProjectsNote } from "@/content/pages";
import { getNextProject, getProject, projects } from "@/content/projects";
import styles from "./project.module.css";

/**
 * Every case study is prerendered at build time from generateStaticParams, so
 * known slugs are served as static HTML. Unknown slugs are allowed to block so
 * they return a real 404 status rather than a streamed placeholder.
 */
export const instant = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: project.cover.src,
    // Sample (placeholder) projects aren't Bhoomi Builders' own work, so keep
    // them out of search results until real projects replace them.
    noindex: project.sample,
  });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = getNextProject(slug);
  const facts = [
    ["Date", project.year],
    ["Status", project.status],
    ["Location", project.location],
    ["Size", project.size],
    ["Client", project.client],
    ["Sector", project.sector],
  ] as const;
  const [first, second, third, fourth] = project.gallery;

  return (
    <>
      <PageHero
        title={[project.title]}
        intro={project.summary}
        image={project.cover}
        meta={`${project.sample ? "Sample project" : "Case study"} ${String(index + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`}
        scrollCue
      />

      <div className="sheet">
        <section className="section container" aria-label="Project information">
          <div className="grid">
            <div className={styles.about}>
              <Reveal y={12}>
                <span className="label">Info</span>
              </Reveal>
              {project.sample && (
                <Reveal>
                  <p className="sample-note">{sampleProjectsNote}</p>
                </Reveal>
              )}
              {project.description.map((para, i) => (
                <Reveal key={i} delay={0.08 * i}>
                  <p className={i === 0 ? styles.lead : styles.para}>{para}</p>
                </Reveal>
              ))}
            </div>
            <Reveal className={styles.factsWrap} delay={0.1}>
              <dl className={styles.facts}>
                {facts.map(([k, v]) => (
                  <div key={k} className={styles.fact}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        <section className={`${styles.gallery} container`} aria-label="Photo gallery">
          {/* Short galleries (fewer than four images) fall back to full-width frames
              instead of leaving a lone half-width image beside an empty slot. */}
          {[first, [second, third].filter(Boolean), fourth].map((block, i) =>
            Array.isArray(block) && block.length === 2 ? (
              <div key={i} className={styles.pair}>
                {block.map((img, j) => (
                  <ImageReveal key={img.src} className={`frame ${styles.tall}`} delay={j * 0.08}>
                    <Image src={img.src} alt={img.alt} fill sizes="(max-width: 760px) 100vw, 50vw" />
                  </ImageReveal>
                ))}
              </div>
            ) : Array.isArray(block) ? (
              block.map((img) => (
                <ImageReveal key={img.src} className={`frame ${styles.wide}`}>
                  <Image src={img.src} alt={img.alt} fill sizes="100vw" />
                </ImageReveal>
              ))
            ) : block ? (
              <ImageReveal key={block.src} className={`frame ${styles.wide}`}>
                <Image src={block.src} alt={block.alt} fill sizes="100vw" />
              </ImageReveal>
            ) : null,
          )}
        </section>

        <section className="section container" aria-label="Next project">
          <div className={styles.nextHead}>
            <RevealWords text="Next _project_" className="h-lg" />
          </div>
          <ProjectCard project={next} variant="wide" sizes="100vw" />
        </section>

        <ClosingSections />
      </div>
    </>
  );
}
