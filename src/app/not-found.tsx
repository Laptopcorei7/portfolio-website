import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { DotGrid, OutlineSquare, OverlappingSquares } from "@/components/ui/decor";

export const metadata: Metadata = {
  title: "Page not found",
  // A 404 should never be indexed or surfaced in search results.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="container-page relative flex min-h-[60vh] flex-col justify-center py-24">
      <DotGrid cols={4} rows={4} className="top-12 -left-20 hidden lg:grid" />
      <OutlineSquare size={110} className="bottom-16 -right-24 hidden lg:block" />
      <OverlappingSquares className="top-8 right-32 hidden lg:block" />

      <h1 className="text-[32px] sm:text-5xl">
        <span aria-hidden="true" className="text-accent">
          /
        </span>
        404
      </h1>

      <p className="mt-4 max-w-md text-base">
        That page doesn&apos;t exist. It may have been moved, or the link that brought you
        here might be out of date.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <ButtonLink href="/">Go home</ButtonLink>
        <ButtonLink href="/works" variant="outline">
          See my projects <span aria-hidden="true">-&gt;</span>
        </ButtonLink>
      </div>
    </div>
  );
}
