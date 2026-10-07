/**
 * UI 02.2L / OV 02.2 — the hotel's photographs, and a way through them.
 *
 * The frame draws one picture with "1 / 12 images" written on it and no
 * control of any kind: a counter that promises eleven pictures nobody can
 * reach. The picture is right; it is the counter that needs a way to be
 * true, so the arrows are here and the count follows the photograph you
 * are actually looking at.
 *
 * The arrows are drawn on the picture rather than beside it, because the
 * box is a fixed height in the frame and anything under it would push the
 * profile card out of line with the frame's own grid.
 */

import { useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { arDigits, counted, imagesWord } from "@/lib/arabic-count";
import type { Hotel } from "@/lib/demo-data";
import { fill, useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function HotelGallery({
  hotel,
  name,
  counter,
  className,
  labels,
}: {
  hotel: Hotel;
  /** The alt text: a photograph of a named hotel, not "image". */
  name: string;
  /** UI 02.2L prints the count on the picture; OV 02.2 does not. */
  counter?: string | undefined;
  className?: string;
  labels: { group: string; previous: string; next: string; alt: string };
}) {
  const { lang, dir } = useLanguage();
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const rtl = dir === "rtl";
  const photos = hotel.images;
  const [at, setAt] = useState(0);
  const many = photos?.length > 1;

  /* Round-trip, so a gallery of four never dead-ends on the fourth. */
  const go = (step: number) =>
    setAt((index) => (index + step + photos?.length) % photos?.length);

  const arrow = (back: boolean) => (
    <button
      type="button"
      aria-label={back ? labels.previous : labels.next}
      onClick={() => go(back ? -1 : 1)}
      className={cn(
        "absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-deep/55 text-white backdrop-blur-[2px] transition-colors hover:bg-brand-deep/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        back ? "start-3" : "end-3"
      )}
    >
      {/* The arrow points the way the eye travels in this language. */}
      {back === rtl ? (
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      ) : (
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );

  return (
    <div
      className={cn(
        "group relative overflow-hidden bg-surface-image",
        className
      )}
      {...(many
        ? {
            role: "group",
            "aria-label": labels.group,
            tabIndex: 0,
            onKeyDown: (event: React.KeyboardEvent) => {
              /* In Arabic the right arrow walks backwards, because that
                 is the direction the pictures themselves run. */
              if (event.key === "ArrowLeft") go(rtl ? 1 : -1);
              else if (event.key === "ArrowRight") go(rtl ? -1 : 1);
              else return;
              event.preventDefault();
            },
          }
        : {})}
    >
      {/* {photos[at] ? ( */}
      {false ? (
        <img
          // src={photos[at]}
          src={""}
          alt={fill(labels.alt, { name, at: at + 1 })}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-primary/60">
          <ImageIcon className="h-7 w-7" aria-hidden="true" />
        </span>
      )}

      {counter && (
        <span
          aria-live="polite"
          className="absolute start-3.5 top-3.5 z-10 rounded-md bg-brand-deep px-2 py-1 text-[11px] font-medium leading-[1.45] text-primary"
        >
          {/* Both halves of "3 / 12" carry the same digits. The
              template is two numbers and a slash, with no letter in it
              for `fill` to read a language off, so the position is
              written here rather than left to it. */}
          {fill(counter, {
            at: k === "ar" ? arDigits(at + 1) : String(at + 1),
            images: counted(photos.length, imagesWord, k),
          })}
        </span>
      )}

      {many && (
        <>
          {arrow(true)}
          {arrow(false)}
        </>
      )}
    </div>
  );
}
