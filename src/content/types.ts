/**
 * Shapes for all site content. Content lives as typed modules in this folder
 * rather than in a database: it is a handful of records that change a few times
 * a year, so keeping it as code means it is version-controlled, type-checked
 * and statically rendered at zero cost.
 */

export type SocialPlatform = "github" | "discord" | "x" | "email";

export type SocialLink = {
  platform: SocialPlatform;
  /** Shown next to the icon on the contacts page, e.g. "@yourhandle". */
  handle: string;
  /**
   * Omit for platforms with no linkable profile URL — a Discord username is
   * not a web address, so it renders as plain text rather than a dead link.
   */
  href?: string;
  /** Whether this link appears in the fixed left-hand rail. Needs an href. */
  inRail?: boolean;
};

/** A run of heading text, optionally highlighted in the accent colour. */
export type HeadlineSegment = {
  text: string;
  accent?: boolean;
};

export type Profile = {
  /** Full legal name. Used for metadata, the footer and the copyright line. */
  name: string;
  /**
   * Shorter form for the nav and footer logo mark, where a long full name
   * would crowd the navigation on small screens.
   */
  shortName: string;
  /**
   * The hero headline, as ordered segments. Segments marked `accent` render in
   * the purple accent colour; the rest render white. Concatenating every
   * `text` gives the full sentence, so word order stays readable here.
   */
  headline: HeadlineSegment[];
  tagline: string;
  email: string;
  /** Short descriptor under the logo in the footer. */
  footerBio: string;
  /** Shown in the "Currently working on ..." badge over the hero image. */
  currentlyWorkingOn: string;
  /** Paragraphs for the about section / page. */
  bio: string[];
};

export type Quote = {
  text: string;
  author: string;
};

export type ProjectLinkKind = "live" | "cached" | "github" | "figma";

export type ProjectLink = {
  kind: ProjectLinkKind;
  href: string;
};

/**
 * Whether the source is publicly reachable. Drives the note shown on the
 * detail page in place of a repository link, so a project without a link
 * explains itself instead of just looking unfinished.
 */
export type Availability = "public" | "private" | "unpublished";

export type Project = {
  slug: string;
  title: string;
  /** One-line summary. This is all the card shows. */
  description: string;
  /**
   * MAIN languages and frameworks only — this is the row on the card, so keep
   * it to three or four. The complete stack belongs in `stack` below.
   */
  tech: string[];
  links: ProjectLink[];
  /** Defaults to "public" when omitted. */
  availability?: Availability;
  /** Longer prose for the detail page, one string per paragraph. */
  overview?: string[];
  /** Notable capabilities, rendered as a list on the detail page. */
  highlights?: string[];
  /** The full stack, grouped, shown only on the detail page. */
  stack?: SkillGroup[];
  /**
   * Path under /public, e.g. "/projects/my-app.png". Only used by the
   * `detailed` card variant; a placeholder tile is drawn when it is missing so
   * the grid keeps its shape until real artwork is added.
   */
  image?: string;
  /** Featured projects appear in the home page `#projects` section. */
  featured?: boolean;
};

export type SkillGroup = {
  /** Box heading, e.g. "Languages". */
  title: string;
  items: string[];
};

export type ContactMethod = {
  platform: SocialPlatform;
  label: string;
  href?: string;
};
