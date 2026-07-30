import { SectionHeading } from "@/components/ui/section-heading";
import { DotGrid, OutlineSquare, OverlappingSquares } from "@/components/ui/decor";
import { skillGroups } from "@/content/skills";

/** One bordered skill box. Opaque background so decoration never shows through. */
function SkillBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border-line/60 bg-bg border">
      <h3 className="border-line/60 border-b px-4 py-2 text-base font-medium">{title}</h3>
      <p className="px-4 py-2 text-base">{items.join(" ")}</p>
    </div>
  );
}

/**
 * The `#skills` section.
 *
 * Two layouts, matching the two mockups:
 *   - `withDecor` (home page): decorations occupy the empty left half, boxes
 *     cluster into a 3-column grid on the right.
 *   - default (about page): boxes span the full width in a single row, no
 *     decoration.
 *
 * Boxes are top-aligned so their heights follow their contents, which
 * reproduces the staggered look without hard-coding a masonry layout.
 */
export function Skills({ withDecor = false }: { withDecor?: boolean }) {
  if (!withDecor) {
    return (
      <section className="container-page pb-24" aria-labelledby="skills-heading">
        <SectionHeading title="skills" id="skills-heading" />
        <div className="grid grid-cols-2 items-start gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {skillGroups.map((group) => (
            <SkillBox key={group.title} title={group.title} items={group.items} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container-page pb-24" aria-labelledby="skills-heading">
      <SectionHeading title="skills" id="skills-heading" />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Decorative half — empty of content by design. */}
        <div aria-hidden="true" className="relative hidden min-h-[240px] lg:block">
          <DotGrid cols={5} rows={3} className="top-2 left-6" />
          <OutlineSquare size={64} className="top-0 right-24" />
          <OverlappingSquares className="bottom-4 left-10" />
          <OutlineSquare size={40} className="right-40 bottom-0" />
        </div>

        <div className="grid grid-cols-2 items-start gap-4 sm:grid-cols-3">
          {skillGroups.map((group) => (
            <SkillBox key={group.title} title={group.title} items={group.items} />
          ))}
        </div>
      </div>
    </section>
  );
}
