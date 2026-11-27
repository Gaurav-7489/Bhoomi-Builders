import Image from "@/components/Img";
import Link from "next/link";
import type { Project } from "@/content/projects";
import { ArrowIcon } from "./icons";
import { Reveal } from "./motion/Reveal";
import styles from "./ProjectCard.module.css";

export function ProjectCard({
  project,
  priority = false,
  sizes = "(max-width: 760px) 100vw, 50vw",
  variant = "tall",
  index = 0,
}: {
  project: Project;
  /** Position in its grid; staggers the fade-in like the reference. */
  index?: number;
  priority?: boolean;
  sizes?: string;
  variant?: "tall" | "wide";
}) {
  return (
    // Haven project card: fades in on a slow spring-like curve (1.2s) once half
    // of it is on screen, 0.1s after its neighbour.
    <Reveal
      as="article"
      className={`${styles.card} ${styles[variant]}`}
      y={0}
      duration={0.65}
      amount={0.1}
      delay={0.1 + (index % 3) * 0.1}
    >
      <Link href={`/projects/${project.slug}`} className={styles.link} data-cursor="View">
        <div className={`frame ${styles.frame}`}>
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            sizes={sizes}
            priority={priority}
            className={styles.img}
          />
        </div>
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
        <ProjectCard key={p.slug} project={p} index={i} priority={false} />
      ))}
    </div>
  );
}
