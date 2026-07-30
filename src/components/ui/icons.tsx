import type { SocialPlatform } from "@/content/types";
import type { SVGProps } from "react";

/**
 * Inline SVG icons. Kept local rather than pulling an icon package so the
 * bundle stays small and the set is exactly what the design uses.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true as const,
};

export function GithubIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.5 18.3 4.8 18.3 4.8c.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.3v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
    </svg>
  );
}

export function DiscordIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.3.5a18.3 18.3 0 0 1 4.4 1.4c-2.1-1-4.2-1.5-6.3-1.6h-2.4c-2 .1-4.2.6-6.3 1.6a18.3 18.3 0 0 1 4.4-1.4L8.6 3a19.8 19.8 0 0 0-5 1.4C1.4 7.7.4 11 .7 14.2c1.5 2 3.7 3.2 5.9 3.4l.9-1.4c-.9-.3-1.7-.7-2.4-1.2l.5-.4a13.4 13.4 0 0 0 11.5 0l.5.4c-.7.5-1.5.9-2.4 1.2l.9 1.4c2.2-.2 4.4-1.4 5.9-3.4.3-3.7-1-7-3.7-9.8ZM8.3 12.4c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm7.4 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
    </svg>
  );
}

/** The current X mark, not the retired Twitter bird. */
export function XIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2 4h20a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm10 8.2L4.4 6H3v.7l9 7.4 9-7.4V6h-1.4L12 12.2Z" />
    </svg>
  );
}

/** Site logo: a small square glyph, matching the mockup's mark. */
export function LogoMark(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <rect x="0.5" y="0.5" width="15" height="15" stroke="currentColor" />
      <rect x="4" y="4" width="4" height="4" fill="currentColor" />
      <rect x="8" y="8" width="4" height="4" fill="currentColor" />
    </svg>
  );
}

export const platformIcons: Record<
  SocialPlatform,
  (props: IconProps) => React.JSX.Element
> = {
  github: GithubIcon,
  discord: DiscordIcon,
  x: XIcon,
  email: MailIcon,
};
