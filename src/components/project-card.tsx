import Image from "next/image";
import Link from "next/link";
import type { Project, ProjectLinkKind } from "@/content/types";
import { ButtonLink } from "@/components/ui/button";

/** Label + trailing glyph for each link kind, matching the mockups. */
const linkLabels: Record<ProjectLinkKind, { text: string; glyph: string }> = {
  live: { text: "Live", glyph: "<~>" },
  cached: { text: "Cached", glyph: ">=" },
  github: { text: "Github", glyph: "<~>" },
  figma: { text: "Figma", glyph: "<~>" },
};

/**
 * One project tile, in two variants:
 *   - `detailed` may render a thumbnail above the tech row (`#complete-apps`
 *     and the featured grid on the home page)
 *   - `compact` never does (`#small-projects`)
 *
 * The variant is passed by the caller rather than inferred from the project,
 * because it is a property of the grid the card sits in, not of the project.
 *
 * Two independent conditions gate the thumbnail, and both matter:
 *   - the variant decides whether this grid shows thumbnails at all
 *   - `project.image` decides whether this project has one to show
 * An API has no meaningful screenshot, so those cards drop the image area
 * entirely and start at the tech row. Rendering a placeholder there instead
 * reads as a broken asset rather than a deliberate choice.
 *
 * The card deliberately shows only `project.tech` — the main languages and
 * frameworks. The full stack lives on the detail page.
 */
export function ProjectCard({
  project,
  variant = "detailed",
}: {
  project: Project;
  variant?: "detailed" | "compact";
}) {
  const showImage = variant === "detailed" && Boolean(project.image);
  const href = `/works/${project.slug}`;

  return (
    <article className="border-line/60 hover:border-accent/60 flex flex-col border transition-colors">
      {showImage && project.image ? (
        <Link href={href} className="bg-bg relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={project.image}
            /* Decorative: the title sits directly below as real text, so
               describing the screenshot here would just repeat it. */
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </Link>
      ) : null}

      <p className="border-line/60 border-b px-4 py-2 text-sm">
        {project.tech.join(" ")}
      </p>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-2xl">
          <Link href={href} className="hover:text-accent transition-colors">
            {project.title}
          </Link>
        </h3>
        <p className="flex-1 text-base">{project.description}</p>

        <div className="flex flex-wrap gap-2 pt-1">
          <ButtonLink href={href}>
            Details <span aria-hidden="true">-&gt;</span>
          </ButtonLink>

          {project.links.map((link) => {
            const label = linkLabels[link.kind];
            return (
              <ButtonLink key={link.kind} href={link.href} external variant="outline">
                <span>
                  {label.text} <span aria-hidden="true">{label.glyph}</span>
                </span>
                <span className="sr-only">— {project.title}</span>
              </ButtonLink>
            );
          })}
        </div>
      </div>
    </article>
  );
}
