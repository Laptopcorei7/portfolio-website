"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ProjectImage } from "@/content/types";

/**
 * Full-screen image viewer with pinch, drag and double-tap zoom, and paging
 * between the screens in a project's gallery.
 *
 * Screenshots are stored at their native resolution, but a card on a phone
 * renders them around 330px wide, which is far too small to read a dashboard or
 * a catalogue grid. So the image itself opens this viewer, and navigation to
 * the project is left to the title link and the Details button next to it.
 *
 * Two things decide how sharp a zoom looks, and both are handled here:
 *   - `unoptimized` on the <Image>. Without it Next picks a variant from
 *     `sizes`, and `sizes="100vw"` on a 390px phone means the 640w variant,
 *     which is then magnified several times over. The originals are already
 *     compact webp, so serving them whole costs little and is always sharp.
 *   - `maxScale`, derived from the file's real pixel width against its rendered
 *     width. Zooming stops where the real pixels run out instead of carrying on
 *     into mush.
 *
 * Gestures use Pointer Events, so one code path covers touch, mouse and pen:
 *   - two pointers        pinch, zooming about the midpoint between them
 *   - one pointer         drag to pan when zoomed, swipe to page when not
 *   - double tap / click  toggle between fit-to-screen and 2.5x
 *   - wheel               zoom about the cursor
 *
 * The surface sets `touch-action: none` so the browser does not claim the
 * gesture for page scrolling or its own pinch-zoom before we see it.
 */

const MIN_SCALE = 1;
/** Zoom is capped by real pixels, but never below this or it feels broken. */
const FLOOR_MAX_SCALE = 2;
/** Past this, even a sharp image is more magnification than anyone needs. */
const CEILING_MAX_SCALE = 8;
const DOUBLE_TAP_SCALE = 2.5;
/** Max ms and px between two taps for them to count as a double tap. */
const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_SLOP = 30;
/** Horizontal travel that counts as a swipe to the next screen. */
const SWIPE_THRESHOLD = 60;

type Point = { x: number; y: number };

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Mounted only while it is open, so every open starts fresh at fit-to-screen
 * and unmounting throws the gesture state away. That is cheaper and harder to
 * get wrong than resetting a dozen values by hand on close.
 */
export function ImageLightbox({
  images,
  startIndex = 0,
  title,
  onClose,
}: {
  images: ProjectImage[];
  startIndex?: number;
  /** Project name, shown in the header alongside the caption. */
  title: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const surfaceRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const [index, setIndex] = useState(startIndex);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [maxScale, setMaxScale] = useState(FLOOR_MAX_SCALE);
  /* Drives the transform transition, which has to be off mid-gesture. It is
     state rather than a ref reading because the render needs it. */
  const [gesturing, setGesturing] = useState(false);

  /* Live gesture state. Kept in refs because pointermove fires far more often
     than we want to re-render, and every handler needs the latest value. */
  const pointers = useRef(new Map<number, Point>());
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);
  const panStart = useRef<{ pointer: Point; offset: Point } | null>(null);
  const lastTap = useRef<{ time: number; point: Point } | null>(null);

  const current = images[index];
  const many = images.length > 1;

  const resetZoom = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const go = useCallback(
    (delta: number) => {
      if (!many) return;
      setIndex((i) => (i + delta + images.length) % images.length);
      resetZoom();
    },
    [many, images.length, resetZoom],
  );

  /**
   * How far this file can be magnified before it runs out of real pixels.
   * Recomputed per image and on resize, because the rendered size depends on
   * the viewport.
   */
  const measureMaxScale = useCallback(() => {
    const frame = frameRef.current;
    if (!frame || !current) return;
    /* offsetWidth ignores the CSS transform, so this is the fitted size. */
    const rendered = frame.offsetWidth;
    if (rendered <= 0) return;
    setMaxScale(clamp(current.width / rendered, FLOOR_MAX_SCALE, CEILING_MAX_SCALE));
  }, [current]);

  useEffect(() => {
    measureMaxScale();
    window.addEventListener("resize", measureMaxScale);
    return () => window.removeEventListener("resize", measureMaxScale);
  }, [measureMaxScale]);

  /**
   * Keeps the image from being dragged off into empty space: pans only as far
   * as there is hidden image to reveal, and re-centres on each axis that now
   * fits entirely on screen.
   */
  const clampOffset = useCallback((next: Point, atScale: number): Point => {
    const surface = surfaceRef.current;
    const frame = frameRef.current;
    if (!surface || !frame) return next;

    const overflowX = Math.max(0, (frame.offsetWidth * atScale - surface.clientWidth) / 2);
    const overflowY = Math.max(0, (frame.offsetHeight * atScale - surface.clientHeight) / 2);

    return {
      x: clamp(next.x, -overflowX, overflowX),
      y: clamp(next.y, -overflowY, overflowY),
    };
  }, []);

  /**
   * Zooms to `nextScale` while holding `focus` (a point in surface
   * coordinates, relative to its centre) stationary on screen. Without this
   * the image would always zoom about its middle and pinching would slide the
   * content out from under the user's fingers.
   */
  const zoomTo = useCallback(
    (nextScale: number, focus: Point) => {
      setScale((currentScale) => {
        const target = clamp(nextScale, MIN_SCALE, maxScale);
        const ratio = target / currentScale;

        setOffset((currentOffset) =>
          clampOffset(
            {
              x: focus.x - (focus.x - currentOffset.x) * ratio,
              y: focus.y - (focus.y - currentOffset.y) * ratio,
            },
            target,
          ),
        );

        return target;
      });
    },
    [clampOffset, maxScale],
  );

  /** Pointer position relative to the centre of the surface. */
  const toSurfacePoint = useCallback((event: { clientX: number; clientY: number }): Point => {
    const surface = surfaceRef.current;
    if (!surface) return { x: 0, y: 0 };
    const rect = surface.getBoundingClientRect();
    return {
      x: event.clientX - rect.left - rect.width / 2,
      y: event.clientY - rect.top - rect.height / 2,
    };
  }, []);

  /* --- Open / close lifecycle -------------------------------------------- */

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    /* Lock the page behind the overlay. Compensating for the scrollbar keeps
       the layout underneath from shifting as it disappears. */
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      previouslyFocused?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, go]);

  /* Wheel has to be bound manually: React's onWheel is passive, so it cannot
     preventDefault, and the browser would scroll the page instead of zooming. */
  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const factor = Math.exp(-event.deltaY / 300);
      setScale((currentScale) => {
        zoomTo(currentScale * factor, toSurfacePoint(event));
        return currentScale;
      });
    };

    surface.addEventListener("wheel", onWheel, { passive: false });
    return () => surface.removeEventListener("wheel", onWheel);
  }, [zoomTo, toSurfacePoint]);

  /* --- Gestures ------------------------------------------------------------ */

  const handlePointerDown = (event: React.PointerEvent) => {
    (event.target as Element).setPointerCapture?.(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    setGesturing(true);

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchStart.current = { dist: distance(a, b), scale };
      panStart.current = null;
    } else if (pointers.current.size === 1) {
      panStart.current = { pointer: { x: event.clientX, y: event.clientY }, offset };
    }
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()];
      const next = distance(a, b);
      if (pinchStart.current.dist > 0) {
        const centre = midpoint(a, b);
        zoomTo(
          (pinchStart.current.scale * next) / pinchStart.current.dist,
          toSurfacePoint({ clientX: centre.x, clientY: centre.y }),
        );
      }
      return;
    }

    /* Panning a fitted image would just wobble it, so it stays locked until
       there is something off-screen to drag into view. A drag at rest is a
       swipe between screens instead, handled on release. */
    if (pointers.current.size === 1 && panStart.current && scale > 1) {
      const start = panStart.current;
      setOffset(
        clampOffset(
          {
            x: start.offset.x + (event.clientX - start.pointer.x),
            y: start.offset.y + (event.clientY - start.pointer.y),
          },
          scale,
        ),
      );
    }
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    pointers.current.delete(event.pointerId);

    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) setGesturing(false);

    const point = { x: event.clientX, y: event.clientY };
    const start = panStart.current;
    const dragged = start ? distance(start.pointer, point) > DOUBLE_TAP_SLOP : false;

    /* Swipe to page, only while fitted. Zoomed in, the same gesture is a pan. */
    if (start && scale === 1 && many) {
      const dx = point.x - start.pointer.x;
      const dy = point.y - start.pointer.y;
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        go(dx < 0 ? 1 : -1);
        lastTap.current = null;
        if (pointers.current.size === 0) panStart.current = null;
        return;
      }
    }

    const previous = lastTap.current;
    const now = Date.now();

    if (
      !dragged &&
      previous &&
      now - previous.time < DOUBLE_TAP_MS &&
      distance(previous.point, point) < DOUBLE_TAP_SLOP
    ) {
      lastTap.current = null;
      const focus = toSurfacePoint(event);
      if (scale > 1) {
        resetZoom();
      } else {
        zoomTo(DOUBLE_TAP_SCALE, focus);
      }
    } else {
      lastTap.current = { time: now, point };

      /* A wide screenshot fitted to a portrait phone leaves most of the screen
         empty. Tapping that empty part closes, which is what a reader expects
         from anything shown over the page. The target test keeps taps that
         landed on the image itself from closing it. */
      if (!dragged && event.target === surfaceRef.current) {
        onClose();
      }
    }

    /* Cleared last: the tests above need the press this release started from,
       to tell a tap apart from the end of a drag. */
    if (pointers.current.size === 0) panStart.current = null;
  };

  if (!current) return null;

  const zoomed = scale > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="bg-bg/97 fixed inset-0 z-50 flex flex-col backdrop-blur-sm"
    >
      <div className="border-line/30 flex items-center justify-between gap-4 border-b px-4 py-3">
        <p id={titleId} className="text-heading min-w-0 truncate text-sm">
          <span aria-hidden="true" className="text-accent">
            /
          </span>
          {title}
          {many ? (
            <span className="text-line/70">
              {" "}
              {index + 1}/{images.length}
            </span>
          ) : null}
        </p>

        <div className="flex shrink-0 items-center gap-2">
          <span aria-hidden="true" className="text-line/70 hidden text-sm sm:inline">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={resetZoom}
            disabled={!zoomed}
            className="border-line/60 hover:border-accent hover:text-accent disabled:hover:border-line/60 disabled:hover:text-body border px-3 py-1 text-sm transition-colors disabled:opacity-40"
          >
            Reset
          </button>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="border-line/60 hover:border-accent hover:text-accent border px-3 py-1 text-sm transition-colors"
          >
            Close <span aria-hidden="true">x</span>
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1">
        <div
          ref={surfaceRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex flex-1 touch-none items-center justify-center overflow-hidden p-4 select-none"
          style={{ cursor: zoomed ? "grab" : "zoom-in" }}
        >
          <div
            ref={frameRef}
            className="relative"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              /* Snapping back from a double tap should animate; following a
                 finger must not, or the image lags behind the gesture. */
              transition: gesturing ? "none" : "transform 150ms ease-out",
            }}
          >
            <Image
              key={current.src}
              src={current.src}
              alt={current.caption}
              width={current.width}
              height={current.height}
              /* Serve the original file whole. See the note at the top: a
                 resized variant is the difference between a sharp zoom and a
                 blurry one. */
              unoptimized
              priority
              draggable={false}
              onLoad={measureMaxScale}
              className="max-h-[calc(100vh-11rem)] w-auto max-w-full object-contain"
            />
          </div>
        </div>

        {many ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous screen"
              className="border-line/60 bg-bg/80 text-heading hover:border-accent hover:text-accent absolute top-1/2 left-2 -translate-y-1/2 border px-3 py-4 text-sm transition-colors"
            >
              <span aria-hidden="true">&lt;</span>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next screen"
              className="border-line/60 bg-bg/80 text-heading hover:border-accent hover:text-accent absolute top-1/2 right-2 -translate-y-1/2 border px-3 py-4 text-sm transition-colors"
            >
              <span aria-hidden="true">&gt;</span>
            </button>
          </>
        ) : null}
      </div>

      <div className="border-line/30 border-t px-4 py-3 text-center">
        <p className="text-heading text-sm">{current.caption}</p>
        <p className="text-line/70 mt-1 text-sm">
          <span className="sm:hidden">
            Pinch or double tap to zoom{many ? ", swipe to change screen" : ""}
          </span>
          <span className="hidden sm:inline">
            Scroll or double click to zoom, drag to move
            {many ? ", arrow keys to change screen" : ""}, Esc to close
          </span>
        </p>
      </div>
    </div>
  );
}

/**
 * A single image in the page, wired to open the viewer. Rendered as a button
 * rather than a link because the surrounding card already links to the project
 * twice, through the title and the Details button.
 */
export function ZoomableImage({
  thumbnail,
  images,
  title,
  label,
  className = "",
  sizes,
  priority = false,
}: {
  /**
   * What the page shows. Kept separate from `images` because a card thumbnail
   * is a purpose-built 16:10 crop, while the viewer should page through the
   * project's real screens at their own sizes.
   */
  thumbnail: string;
  images: ProjectImage[];
  title: string;
  /** Announced to screen readers, e.g. "Expand the AgriCycle screenshot". */
  label: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={`group bg-bg relative block w-full cursor-zoom-in overflow-hidden ${className}`}
      >
        {/* Decorative here: the button carries the accessible name below, and
            a second description would just be read out twice. */}
        <Image
          src={thumbnail}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />

        {/* Affordance. Always visible on touch, where there is no hover to
            reveal it, and drawn over a scrim so it reads on any screenshot. */}
        <span
          aria-hidden="true"
          className="border-line/60 bg-bg/80 text-heading group-hover:border-accent group-hover:text-accent absolute right-2 bottom-2 border px-2 py-1 text-sm transition-colors"
        >
          Expand +
        </span>
        <span className="sr-only">{label}</span>
      </button>

      {open ? (
        <ImageLightbox images={images} title={title} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}

/**
 * The gallery on a project's detail page. Each cell is sized to its own image's
 * aspect ratio, so a portrait phone screen renders tall instead of being
 * cropped into a landscape band, and a row of screens from one project lines up
 * evenly because they share dimensions.
 *
 * Column counts follow orientation: wide screenshots need the width to stay
 * readable, tall phone screens do not.
 */
export function ProjectGallery({
  images,
  title,
}: {
  images: ProjectImage[];
  title: string;
}) {
  const [openAt, setOpenAt] = useState<number | null>(null);

  const portrait = images[0].height > images[0].width;
  const columns = portrait
    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
    : "sm:grid-cols-2";

  return (
    <>
      <div className={`grid items-start gap-4 ${columns}`}>
        {images.map((image, i) => (
          <figure key={image.src} className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setOpenAt(i)}
              aria-haspopup="dialog"
              className="group border-line/60 hover:border-accent bg-bg relative block w-full cursor-zoom-in overflow-hidden border transition-colors"
              style={{ aspectRatio: `${image.width} / ${image.height}` }}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes={portrait ? "(max-width: 640px) 50vw, 25vw" : "(max-width: 640px) 100vw, 50vw"}
                className="object-cover"
              />
              <span
                aria-hidden="true"
                className="border-line/60 bg-bg/80 text-heading group-hover:border-accent group-hover:text-accent absolute right-2 bottom-2 border px-2 py-1 text-sm transition-colors"
              >
                +
              </span>
              <span className="sr-only">Expand: {image.caption}</span>
            </button>
            <figcaption className="text-sm">{image.caption}</figcaption>
          </figure>
        ))}
      </div>

      {openAt !== null ? (
        <ImageLightbox
          images={images}
          startIndex={openAt}
          title={title}
          onClose={() => setOpenAt(null)}
        />
      ) : null}
    </>
  );
}
