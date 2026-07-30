import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/page-title";
import { SectionHeading } from "@/components/ui/section-heading";
import { Skills } from "@/components/sections/skills";
import { Portrait } from "@/components/ui/portrait";
import { DotGrid, OutlineSquare, OverlappingSquares } from "@/components/ui/decor";
import { funFacts, profile } from "@/content/site";

/**
 * Splits on *asterisk* markers and renders the wrapped runs in white, which is
 * how the mockup emphasises the keyword in each fun fact. Odd indices are the
 * emphasised runs because the delimiter always alternates.
 */
function withEmphasis(text: string) {
  return text.split("*").map((run, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="text-heading font-normal">
        {run}
      </strong>
    ) : (
      run
    ),
  );
}

export const metadata: Metadata = {
  title: "About me",
  description: `About ${profile.name} — ${profile.footerBio}.`,
};

export default function AboutPage() {
  return (
    <>
      <div className="container-page relative pt-8">
        <OutlineSquare size={110} className="top-24 -right-24 hidden lg:block" />
        <DotGrid cols={3} rows={3} className="top-64 -left-20 hidden lg:grid" />

        <PageTitle title="about-me" subtitle="Who am i?" />

        <section className="grid items-start gap-10 pb-24 lg:grid-cols-[1fr_auto]">
          <div className="max-w-xl">
            {profile.bio.map((paragraph, index) => (
              <p key={index} className={index === 0 ? "text-base" : "mt-6 text-base"}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="relative">
            {/* z-20 so these sit over the photo, as in the mockup. */}
            <DotGrid cols={5} rows={4} className="top-4 -left-6 z-20 hidden lg:grid" />
            <DotGrid cols={5} rows={3} className="right-0 bottom-24 z-20 hidden lg:grid" />
            <Portrait
              src="/portrait.jpg"
              alt={`${profile.name} at work`}
              priority
              underline
              className="relative z-10 mx-auto h-[340px] w-[280px] sm:h-[400px] sm:w-[320px]"
            />
          </div>
        </section>
      </div>

      <Skills />

      <section className="container-page relative pb-8" aria-labelledby="fun-facts-heading">
        <SectionHeading title="my-fun-facts" id="fun-facts-heading" />

        <div className="relative">
          <OverlappingSquares className="right-8 -bottom-4 hidden lg:block" />
          <DotGrid cols={4} rows={3} className="top-0 right-48 hidden lg:grid" />

          <ul className="relative z-10 flex max-w-2xl flex-wrap gap-4">
            {funFacts.map((fact) => (
              <li key={fact} className="border-line/60 border px-4 py-2 text-base">
                {withEmphasis(fact)}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
