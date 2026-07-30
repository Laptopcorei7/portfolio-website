import Image from "next/image";

type PortraitProps = {
  /** Path under /public. When omitted a neutral placeholder is drawn instead. */
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  /** Draws the accent rule beneath the photo, as on the about-page mockup. */
  underline?: boolean;
};

/**
 * Two intersecting linear gradients — one vertical, one horizontal — so all
 * four edges fade out. Compositing two masks is what lets the corners fade in
 * both directions at once; a single gradient can only soften one axis.
 *
 * `maskComposite: intersect` is the standard property; Safari still needs the
 * `-webkit-` form, whose equivalent keyword is `source-in`.
 */
const edgeFade = {
  maskImage:
    "linear-gradient(to bottom, transparent 0%, #000 14%, #000 92%, transparent 100%), linear-gradient(to right, transparent 0%, #000 13%, #000 87%, transparent 100%)",
  maskComposite: "intersect",
  WebkitMaskImage:
    "linear-gradient(to bottom, transparent 0%, #000 14%, #000 92%, transparent 100%), linear-gradient(to right, transparent 0%, #000 13%, #000 87%, transparent 100%)",
  WebkitMaskComposite: "source-in",
} as const;

/**
 * The portrait used in the hero and about sections.
 *
 * The mockups use a cut-out figure on a transparent background. A real photo
 * is rectangular, so without help its frame reads as a darker box sitting on
 * the slate page — the bokeh highlights along the top and sides give the edges
 * away. Fading all four edges gets most of the way to the cut-out look without
 * needing the background actually removed.
 */
export function Portrait({
  src,
  alt,
  className = "",
  priority = false,
  underline = false,
}: PortraitProps) {
  if (!src) {
    return (
      <div
        className={`border-line/30 text-line/50 flex items-end justify-center border-b ${className}`}
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(171,178,191,0.05) 0 12px, transparent 12px 24px)",
        }}
      >
        <p className="px-4 pb-4 text-center text-xs">
          Add your photo to <code>/public/</code>
          <br />
          and set it in the page
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 640px) 80vw, 320px"
        className="object-cover object-top"
        style={edgeFade}
      />
      {underline ? (
        <span
          aria-hidden="true"
          className="bg-accent absolute inset-x-0 bottom-0 block h-px"
        />
      ) : null}
    </div>
  );
}
