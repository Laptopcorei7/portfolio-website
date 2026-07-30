import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { PageTitle } from "@/components/ui/page-title";
import { SectionHeading } from "@/components/ui/section-heading";
import { DotGrid, OutlineSquare } from "@/components/ui/decor";
import { completeApps, smallProjects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "A list of things I have designed and built.",
};

export default function WorksPage() {
  return (
    <div className="container-page relative pt-8 pb-8">
      <OutlineSquare size={110} className="top-12 -right-24 hidden lg:block" />
      <DotGrid cols={3} rows={4} className="top-56 -left-20 hidden lg:grid" />

      <PageTitle title="projects" subtitle="List of my projects" />

      <section className="pb-20" aria-labelledby="complete-apps-heading">
        <SectionHeading title="complete-apps" id="complete-apps-heading" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {completeApps.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section aria-labelledby="small-projects-heading">
        <SectionHeading title="small-projects" id="small-projects-heading" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {smallProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} variant="compact" />
          ))}
        </div>
      </section>
    </div>
  );
}
