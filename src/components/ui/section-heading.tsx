import Link from "next/link";

type SectionHeadingProps = {
  /** Heading text without the `#` prefix, e.g. "projects". */
  title: string;
  /** Optional right-aligned link, e.g. "View all ~~>". */
  action?: { label: string; href: string };
  id?: string;
};

/**
 * The `#section-name ————————————` heading used on every section of every page.
 * The accent `#` is decorative and hidden from assistive tech; the rule fills
 * whatever width is left over after the text (and the action, if present).
 */
export function SectionHeading({ title, action, id }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <h2 id={id} className="shrink-0 text-2xl sm:text-[32px]">
        <span aria-hidden="true" className="text-accent">
          #
        </span>
        {title}
      </h2>

      <span aria-hidden="true" className="bg-accent h-px min-w-8 flex-1" />

      {action ? (
        <Link
          href={action.href}
          className="text-heading hover:text-accent shrink-0 text-base transition-colors"
        >
          {action.label} <span aria-hidden="true">{"~~>"}</span>
        </Link>
      ) : null}
    </div>
  );
}
