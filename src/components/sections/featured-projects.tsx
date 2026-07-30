import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { featuredProjects } from "@/content/projects";

/** The `#projects` section on the home page — three featured cards. */
export function FeaturedProjects() {
  if (featuredProjects.length === 0) return null;

  return (
    <section className="container-page pb-24" aria-labelledby="projects-heading">
      <SectionHeading
        title="projects"
        id="projects-heading"
        action={{ label: "View all", href: "/works" }}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
