import { platformIcons } from "@/components/ui/icons";
import { socials } from "@/content/site";

/**
 * The fixed vertical line + social icons pinned to the left edge on every page.
 * Hidden below `lg` because there is no gutter to spare on smaller screens —
 * the same links are reachable from the footer and the contacts page.
 */
export function SocialRail() {
  // Needs an href to be a rail icon — platforms without one (Discord) are
  // still reachable from the contacts page.
  const railLinks = socials.filter((social) => social.inRail && social.href);

  if (railLinks.length === 0) return null;

  return (
    <div className="fixed top-0 left-8 z-20 hidden flex-col items-center gap-6 lg:flex xl:left-14">
      {/* Vertical line running from the top of the viewport down to the icons. */}
      <span aria-hidden="true" className="bg-line/60 h-48 w-px" />

      <ul className="flex flex-col gap-4">
        {railLinks.map((social) => {
          const Icon = platformIcons[social.platform];
          return (
            <li key={social.platform}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-line/70 hover:text-accent block transition-colors"
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">
                  {social.platform} ({social.handle})
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
