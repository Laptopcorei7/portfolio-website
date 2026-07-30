import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { allProjects, getProjectBySlug } from "@/content/projects";
import { profile } from "@/content/site";
import type { Availability, ProjectLinkKind } from "@/content/types";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { DotGrid, OutlineSquare } from "@/components/ui/decor";

type PageProps = { params: Promise<{ slug: string }> };

/** Every project detail page is known at build time, so all of them prerender. */
export function generateStaticParams() {
  return allProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/works/${project.slug}` },
    openGraph: {
      title: `${project.title} — ${profile.shortName}`,
      description: project.description,
      url: `/works/${project.slug}`,
      type: "article",
    },
  };
}

const linkLabels: Record<ProjectLinkKind, string> = {
  live: "View live",
  cached: "View cached",
  github: "View on Github",
  figma: "View in Figma",
};

/** Explains a missing repository link rather than leaving a bare gap. */
const availabilityNotes: Record<Exclude<Availability, "public">, string> = {
  private: "The source for this one is in a private repository, so there's no public link. Happy to walk through it on request.",
  unpublished: "This isn't pushed to a public repository yet. Ask me about it and I'll gladly show you around.",
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const availability = project.availability ?? "public";
  const note = availability === "public" ? null : availabilityNotes[availability];

  return (
    <div className="container-page relative pt-8 pb-8">
      <OutlineSquare size={110} className="top-12 -right-24 hidden lg:block" />
      <DotGrid cols={3} rows={4} className="top-64 -left-20 hidden lg:grid" />

      <nav aria-label="Breadcrumb" className="mb-8">
        <ButtonLink href="/works" variant="outline">
          <span aria-hidden="true">&lt;-</span> Back to projects
        </ButtonLink>
      </nav>

      <header className="mb-12">
        <h1 className="text-[32px] sm:text-5xl">
          <span aria-hidden="true" className="text-accent">
            /
          </span>
          {project.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base">{project.description}</p>

        <p className="text-line/80 mt-4 text-sm">{project.tech.join(" · ")}</p>

        {project.links.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.links.map((link) => (
              <ButtonLink key={link.kind} href={link.href} external>
                {linkLabels[link.kind]} <span aria-hidden="true">{"<~>"}</span>
              </ButtonLink>
            ))}
          </div>
        ) : null}

        {note ? (
          <p className="border-accent/40 bg-accent-muted/30 mt-6 max-w-2xl border-l-2 px-4 py-3 text-sm">
            {note}
          </p>
        ) : null}
      </header>

      {project.image ? (
        <div className="border-line/60 relative mb-16 aspect-[16/9] w-full overflow-hidden border">
          <Image
            src={project.image}
            alt={`${project.title} screenshot`}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
            className="object-cover"
          />
        </div>
      ) : null}

      {project.overview && project.overview.length > 0 ? (
        <section className="mb-16" aria-labelledby="overview-heading">
          <SectionHeading title="overview" id="overview-heading" />
          <div className="max-w-2xl">
            {project.overview.map((paragraph, index) => (
              <p key={index} className={index === 0 ? "text-base" : "mt-4 text-base"}>
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      {project.highlights && project.highlights.length > 0 ? (
        <section className="mb-16" aria-labelledby="highlights-heading">
          <SectionHeading title="highlights" id="highlights-heading" />
          <ul className="flex max-w-2xl flex-col gap-3">
            {project.highlights.map((item) => (
              <li key={item} className="flex gap-3 text-base">
                <span aria-hidden="true" className="bg-accent mt-2 h-2 w-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.stack && project.stack.length > 0 ? (
        <section aria-labelledby="stack-heading">
          <SectionHeading title="stack" id="stack-heading" />
          <div className="grid grid-cols-2 items-start gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {project.stack.map((group) => (
              <div key={group.title} className="border-line/60 bg-bg border">
                <h3 className="border-line/60 border-b px-4 py-2 text-base font-medium">
                  {group.title}
                </h3>
                <p className="px-4 py-2 text-base">{group.items.join(" ")}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
