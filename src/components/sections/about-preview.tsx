import { ButtonLink } from "@/components/ui/button";
import { DotGrid } from "@/components/ui/decor";
import { Portrait } from "@/components/ui/portrait";
import { SectionHeading } from "@/components/ui/section-heading";
import { profile } from "@/content/site";

/**
 * The `#about-me` teaser on the home page. Shows the first two bio paragraphs
 * and links through to the full about page.
 */
export function AboutPreview() {
  return (
    <section className="container-page pb-24" aria-labelledby="about-heading">
      <SectionHeading title="about-me" id="about-heading" />

      <div className="grid items-start gap-10 lg:grid-cols-[1fr_auto]">
        <div className="max-w-xl">
          {profile.bio.slice(0, 3).map((paragraph, index) => (
            <p key={index} className={index === 0 ? "text-base" : "mt-6 text-base"}>
              {paragraph}
            </p>
          ))}

          <ButtonLink href="/about-me" className="mt-8">
            Read more <span aria-hidden="true">-&gt;</span>
          </ButtonLink>
        </div>

        <div className="relative">
          {/* z-20 so these sit over the photo, as in the mockup. */}
          <DotGrid cols={5} rows={4} className="top-0 -left-6 z-20 hidden lg:grid" />
          <DotGrid cols={5} rows={4} className="right-0 bottom-16 z-20 hidden lg:grid" />
          <Portrait
            src="/portrait.jpg"
            alt={`${profile.name} at work`}
            className="relative z-10 mx-auto h-[300px] w-[240px] sm:h-[340px] sm:w-[280px]"
          />
        </div>
      </div>
    </section>
  );
}
