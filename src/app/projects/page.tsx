import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/PageHero";
import { ProjectGrid } from "@/components/ProjectCard";
import { ClosingSections } from "@/components/sections";
import { projectsPage, sampleProjectsNote } from "@/content/pages";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects by Bhoomi Builders, a design and construction company in Thrissur, Kerala.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        title={projectsPage.hero.title}
        intro={projectsPage.hero.intro}
        image={projectsPage.hero.image}
        meta={projects.some((p) => p.sample) ? "Sample projects" : `${projects.length} selected projects`}
        scrollCue
      />
      <div className="sheet">
        <section className="section container" aria-label="All projects">
          {projects.some((p) => p.sample) && (
            <Reveal>
              <p className="sample-note">{sampleProjectsNote}</p>
            </Reveal>
          )}
          <ProjectGrid projects={projects} />
        </section>
        <ClosingSections />
      </div>
    </>
  );
}
