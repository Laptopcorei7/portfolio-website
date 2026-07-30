import { ButtonLink } from "@/components/ui/button";
import { DotGrid, OverlappingSquares } from "@/components/ui/decor";
import { Portrait } from "@/components/ui/portrait";
import { profile } from "@/content/site";

export function Hero() {
  return (
    <section className="container-page relative pt-8 pb-24 sm:pt-16">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-[26px] leading-tight sm:text-[32px]">
            {profile.headline.map((segment, index) =>
              segment.accent ? (
                <span key={index} className="text-accent">
                  {segment.text}
                </span>
              ) : (
                <span key={index}>{segment.text}</span>
              ),
            )}
          </h1>

          <p className="mt-6 text-base">{profile.tagline}</p>

          <ButtonLink href="/contacts" className="mt-8">
            Contact me!!
          </ButtonLink>
        </div>

        <div className="relative">
          <OverlappingSquares className="-top-4 -left-10 hidden lg:block" />
          {/* z-20 so it sits over the photo, as in the mockup. */}
          <DotGrid cols={5} rows={5} className="bottom-24 -right-4 z-20 hidden lg:grid" />

          <Portrait
            src="/portrait.jpg"
            alt={`Portrait of ${profile.name}`}
            priority
            className="relative z-10 mx-auto h-[320px] w-[260px] sm:h-[380px] sm:w-[300px]"
          />

          {/* "Currently working on ..." badge sits across the base of the photo. */}
          <p className="border-line/60 relative z-10 mt-0 flex items-center gap-3 border px-4 py-2 text-sm">
            <span aria-hidden="true" className="bg-accent block h-3 w-3 shrink-0" />
            <span>
              Currently working on{" "}
              <strong className="text-heading font-medium">
                {profile.currentlyWorkingOn}
              </strong>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
