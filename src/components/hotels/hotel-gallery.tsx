import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { arDigits, counted, imagesWord } from "@/lib/arabic-count";
import type { Hotel } from "@/lib/demo-data";
import { fill, useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { HotelGalleryImage } from "./HotelGalleryImage";

export function HotelGallery({
  hotel,
  name,
  counter,
  className,
  labels,
}: {
  hotel: Hotel;
  name: string;
  counter?: string | undefined;
  className?: string;
  labels: {
    group: string;
    previous: string;
    next: string;
    alt: string;
  };
}) {
  const { lang, dir } = useLanguage();
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const rtl = dir === "rtl";

  const photos = hotel.images ?? [];
  const [at, setAt] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const many = photos.length > 1;
  const currentPhoto = photos[at];

  const go = useCallback(
    (step: number) => {
      if (!photos.length) return;

      setAt((index) => (index + step + photos.length) % photos.length);
    },
    [photos.length],
  );

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  // Lock background scrolling and support keyboard navigation.
  useEffect(() => {
    if (!isFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFullscreen();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(rtl ? 1 : -1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(rtl ? -1 : 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen, closeFullscreen, go, rtl]);

  const getCounter = () =>
    fill(counter ?? "{at} / {images}", {
      at: k === "ar" ? arDigits(at + 1) : String(at + 1),
      images: counted(photos.length, imagesWord, k),
    });

  const arrow = (back: boolean, fullscreen = false) => (
    <button
      key={back ? "previous" : "next"}
      type="button"
      aria-label={back ? labels.previous : labels.next}
      onClick={() => go(back ? -1 : 1)}
      className={cn(
        "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white backdrop-blur-sm transition-colors",
        "bg-brand-deep/60 hover:bg-brand-deep/90",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        back ? "start-3" : "end-3",
        fullscreen && "h-12 w-12",
      )}
    >
      {back === rtl ? (
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      ) : (
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );

  const imageAlt = fill(labels.alt, {
    name,
    at: at + 1,
  });

  return (
    <>
      <div
        className={cn(
          "group relative overflow-hidden bg-surface-image",
          className,
        )}
        {...(many
          ? {
              role: "group",
              "aria-label": labels.group,
              tabIndex: 0,
              onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
                if (event.key === "ArrowLeft") {
                  go(rtl ? 1 : -1);
                } else if (event.key === "ArrowRight") {
                  go(rtl ? -1 : 1);
                } else {
                  return;
                }

                event.preventDefault();
              },
            }
          : {})}
      >
        {currentPhoto ? (
          <>
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="absolute inset-0 z-[1] block h-full w-full cursor-zoom-in"
              aria-label={
                k === "ar"
                  ? `عرض صورة ${name} بملء الشاشة`
                  : `View ${name} image fullscreen`
              }
            >
              <HotelGalleryImage
                uploadId={currentPhoto.uploadId}
                alt={imageAlt}
                className="h-full w-full object-cover"
              />
            </button>

            <button
              type="button"
              aria-label={
                k === "ar" ? "عرض الصورة بملء الشاشة" : "View fullscreen"
              }
              onClick={() => setIsFullscreen(true)}
              className="absolute bottom-3 end-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-brand-deep/60 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-brand-deep/90 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white group-hover:opacity-100"
            >
              <Expand className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        ) : (
          <span className="flex h-full w-full items-center justify-center text-primary/60">
            <ImageIcon className="h-7 w-7" aria-hidden="true" />
          </span>
        )}

        {counter && photos.length > 0 && (
          <span
            aria-live="polite"
            className="pointer-events-none absolute start-3.5 top-3.5 z-10 rounded-md bg-brand-deep px-2 py-1 text-[11px] font-medium leading-[1.45] text-primary"
          >
            {getCounter()}
          </span>
        )}

        {many && (
          <>
            {arrow(true)}
            {arrow(false)}
          </>
        )}
      </div>

      {isFullscreen && currentPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={
            k === "ar"
              ? `معاينة صور ${name}`
              : `${name} image preview`
          }
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeFullscreen();
            }
          }}
        >
          {/* Fullscreen image container */}
          <div className="relative flex h-full w-full max-w-[1600px] flex-col overflow-hidden rounded-xl">
            {/* Top toolbar */}
            <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4">
              <span className="rounded-lg bg-brand-deep/80 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm">
                {getCounter()}
              </span>

              <button
                type="button"
                onClick={closeFullscreen}
                aria-label={k === "ar" ? "إغلاق المعاينة" : "Close preview"}
                autoFocus
                className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-deep/80 text-white transition-colors hover:bg-brand-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Main image */}
            <div className="relative flex min-h-0 flex-1 items-center justify-center">
              <HotelGalleryImage
                key={currentPhoto.uploadId}
                uploadId={currentPhoto.uploadId}
                alt={imageAlt}
                className="h-full w-full object-contain"
              />

              {many && (
                <>
                  {arrow(true, true)}
                  {arrow(false, true)}
                </>
              )}
            </div>

            {/* Bottom caption */}
            <div className="flex shrink-0 items-center justify-center px-4 py-3">
              <p className="max-w-full truncate rounded-full bg-brand-deep/80 px-4 py-2 text-sm text-white backdrop-blur-sm">
                {name} <span aria-hidden="true">·</span> {getCounter()}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}