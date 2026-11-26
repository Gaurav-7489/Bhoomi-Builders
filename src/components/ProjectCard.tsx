import Image from "@/components/Img";
import Link from "next/link";
import type { Project } from "@/content/projects";
import { ArrowIcon } from "./icons";
import { ImageReveal, Reveal } from "./motion/Reveal";
import styles from "./ProjectCard.module.css";

export function ProjectCard({
  project,
  priority = false,
  sizes = "(max-width: 760px) 100vw, 50vw",
  variant = "tall",
}: {
  project: Project;
  priority?: boolean;
  sizes?: string;
  variant?: "tall" | "wide";
}) {
  return (
    <Reveal as="article" className={`${styles.card} ${styles[variant]}`} y={0}>
      <Link href={`/projects/${project.slug}`} className={styles.link} data-cursor="View">
        <ImageReveal className={`frame ${styles.frame}`}>
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            sizes={sizes}
            priority={priority}
            className={styles.img}
          />
        </ImageReveal>
        <div className={styles.meta}>
          <h3 className={styles.title}>{project.title}</h3>
          <span className={styles.cta}>
            View project <ArrowIcon size={16} />
          </span>
          <p className={styles.sub}>
            {project.location} · {project.year}
            {project.sample && <span className={styles.sampleTag}>Sample</span>}
          </p>
        </div>
      </Link>
    </Reveal>
  );
}

export function ProjectGrid({ projects }: { projects: Project[]; staggered?: boolean }) {
  return (
    <div className={styles.grid}>
      {projects.map((p, i) => (
        <ProjectCard key={p.slug} project={p} priority={i < 2} />
      ))}
    </div>
  );
}
