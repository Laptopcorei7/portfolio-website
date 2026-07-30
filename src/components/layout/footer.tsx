import Link from "next/link";
import { LogoMark, platformIcons } from "@/components/ui/icons";
import { profile, socials } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();
  const mediaLinks = socials.filter((social) => social.inRail && social.href);

  return (
    <footer className="border-line/30 mt-24 border-t py-8">
      <div className="container-page">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="text-heading flex items-center gap-2 text-base font-medium"
              >
                <LogoMark className="h-4 w-4" />
                {profile.shortName}
              </Link>
              <a
                href={`mailto:${profile.email}`}
                className="hover:text-accent text-base transition-colors"
              >
                {profile.email}
              </a>
            </div>
            <p className="mt-2 text-base">{profile.footerBio}</p>
          </div>

          <div>
            <h2 className="text-xl">Media</h2>
            <ul className="mt-3 flex items-center gap-4">
              {mediaLinks.map((social) => {
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
                      <span className="sr-only">{social.platform}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <p className="mt-10 text-center text-base">
          © Copyright {year}. Made by {profile.name}
        </p>
      </div>
    </footer>
  );
}
