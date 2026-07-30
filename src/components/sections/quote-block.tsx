import { quote } from "@/content/site";

/**
 * The offset quote panel: a bordered box with a large opening quote glyph
 * overlapping its top-left, and the attribution in a second box that overlaps
 * the bottom-right corner.
 */
export function QuoteBlock() {
  return (
    <section className="container-page pb-24">
      <figure className="relative mx-auto max-w-2xl">
        <blockquote className="border-line/60 relative border px-8 py-6">
          <span
            aria-hidden="true"
            className="text-line absolute -top-4 left-4 text-4xl leading-none"
          >
            &ldquo;
          </span>
          <p className="text-heading text-lg sm:text-xl">{quote.text}</p>
        </blockquote>

        <figcaption className="border-line/60 relative -mt-px ml-auto flex w-fit items-center gap-3 border px-8 py-4">
          <span
            aria-hidden="true"
            className="text-line absolute -top-3 left-3 text-3xl leading-none"
          >
            &rdquo;
          </span>
          <span className="text-heading text-lg">&mdash; {quote.author}</span>
        </figcaption>
      </figure>
    </section>
  );
}
