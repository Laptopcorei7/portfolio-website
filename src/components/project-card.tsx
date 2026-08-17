import Image from "next/image";
import Link from "next/link";
import type { Project, ProjectLinkKind } from "@/content/types";
import { ButtonLink } from "@/components/ui/button";
import { ZoomableImage } from "@/components/ui/image-lightbox";

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
 * The thumbnail opens the full-screen viewer rather than navigating to the
 * project. On a phone the card is about as wide as the detail page, so
 * following the link would show the same screenshot at the same unreadable
 * size; zooming is the thing a reader actually wants there. Navigation is
 * still one tap away on the title and the Details button.
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
        project.gallery && project.gallery.length > 0 ? (
          <ZoomableImage
            thumbnail={project.image}
            images={project.gallery}
            title={project.title}
            label={`Expand the ${project.title} screens`}
            className="aspect-[16/10]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          /* No gallery to page through, so the thumbnail keeps its old job of
             leading to the project. */
          <Link href={href} className="bg-bg relative aspect-[16/10] w-full overflow-hidden">
            <Image
              src={project.image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </Link>
        )
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
