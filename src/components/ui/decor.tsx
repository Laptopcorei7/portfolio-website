/**
 * Decorative background motifs from the mockups: dot grids, empty outlined
 * squares, and overlapping accent squares. All are purely visual, so every one
 * of them is `aria-hidden` and `pointer-events-none`.
 *
 * Positioning is left to the caller via `className` — several of these are
 * meant to bleed past the viewport edge, which is why `body` clips overflow-x.
 */

type DotGridProps = {
  /** Columns of dots. Mockups use 4-5. */
  cols?: number;
  /** Rows of dots. Mockups use 4-5. */
  rows?: number;
  className?: string;
};

export function DotGrid({ cols = 4, rows = 4, className = "" }: DotGridProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute grid gap-[13px] ${className}`}
      style={{ gridTemplateColumns: `repeat(${cols}, 5px)` }}
    >
      {Array.from({ length: cols * rows }, (_, i) => (
        <span key={i} className="bg-line/60 block h-[5px] w-[5px] rounded-full" />
      ))}
    </div>
  );
}

type OutlineSquareProps = {
  /** Side length in px. */
  size?: number;
  /** Neutral grey border (default) or the purple accent. */
  tone?: "line" | "accent";
  className?: string;
};

export function OutlineSquare({
  size = 100,
  tone = "line",
  className = "",
}: OutlineSquareProps) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute block border ${
        tone === "accent" ? "border-accent" : "border-line/60"
      } ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

/**
 * The two overlapping accent squares that appear beside the hero and the
 * skills / fun-facts sections.
 */
export function OverlappingSquares({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute block ${className}`}
      style={{ width: 104, height: 104 }}
    >
      <span className="border-accent absolute top-0 left-0 block h-[68px] w-[68px] border" />
      <span className="border-accent absolute right-0 bottom-0 block h-[68px] w-[68px] border" />
    </span>
  );
}
