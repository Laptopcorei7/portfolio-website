type PageTitleProps = {
  /** Title text without the `/` prefix, e.g. "projects". */
  title: string;
  /** Sub-line rendered beneath, e.g. "List of my projects". */
  subtitle?: string;
};

/**
 * The `/page-name` title used at the top of the inner pages. Distinct from
 * SectionHeading: pages get a `/` prefix, sections within a page get `#`.
 */
export function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <header className="mb-16">
      <h1 className="text-[32px] sm:text-5xl">
        <span aria-hidden="true" className="text-accent">
          /
        </span>
        {title}
      </h1>
      {subtitle ? <p className="mt-2 text-base">{subtitle}</p> : null}
    </header>
  );
}
