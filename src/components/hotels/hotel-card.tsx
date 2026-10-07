import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { fill, useLanguage } from "@/lib/i18n";
import type { Hotel, HotelRelation } from "@/lib/demo-data";
import { HotelOption } from "@/store/features/hotels/types";

const badgeTone: Record<HotelRelation, { wrap: string; text: string; dot: string }> = {
  available: {
    wrap: "bg-status-neutral-bg",
    text: "text-status-neutral",
    dot: "bg-status-neutral",
  },
  linked: {
    wrap: "bg-status-success-bg",
    text: "text-status-success",
    dot: "bg-status-success",
  },
  requested: {
    wrap: "bg-status-info-bg",
    text: "text-status-info",
    dot: "bg-status-info",
  },
  notApproved: {
    wrap: "bg-status-danger-bg",
    text: "text-status-danger",
    dot: "bg-status-danger",
  },
  suspended: {
    wrap: "bg-status-warning-bg",
    text: "text-status-warning",
    dot: "bg-status-warning",
  },
};

/** 08 — Hotel Card. Checkbox only when the hotel can be selected. */
export function HotelCard({
  hotel,
  relation,
  selected = false,
  onToggle,
  note,
  footer,
}: {
  hotel: HotelOption;
  relation: HotelRelation;
  selected?: boolean;
  onToggle?: () => void;
  /** Status line under the badge — "Sent 2 days ago", a rejection reason, … */
  note?: string | undefined;
  footer?: React.ReactNode;
}) {
  const { c, lang } = useLanguage();
  const unavailable = relation === "notApproved" || relation === "suspended";
  const selectable = Boolean(onToggle) && relation === "available";
  // const tone = badgeTone[hotel?.hasPendingRequest ? "requested" : "linked"];
  const tone = badgeTone[hotel?.hasPendingRequest ? "requested" : "linked"];

  return (
    <article
      className={cn(
        "flex w-full flex-col gap-2.5 rounded-xl px-2.5 pb-3.5 pt-2.5",
        selected
          ? "border-2 border-brand-deep bg-primary-subtle"
          : unavailable
            ? "border border-border-default bg-surface-subtle"
            : "border border-border-default bg-surface-default",
      )}
    >
      <div
        className="relative h-[132px] w-full overflow-hidden rounded-lg sm:h-[148px]"
        aria-hidden={hotel?.image ? undefined : true}
      >
        {hotel?.image ? (
          <img
            src={hotel?.image}
            alt={lang === "ar" ? hotel.nameAr : hotel.nameEn}
            loading="lazy"
            width={1024}
            height={640}
            className={cn("h-full w-full object-cover", unavailable && "opacity-45")}
          />
        ) : (
          <div
            className={cn(
              "h-full w-full bg-gradient-to-r from-brand-deep to-[#3e7a5f]",
              unavailable && "opacity-45",
            )}
            aria-hidden="true"
          />
        )}
      </div>

      <div className="flex flex-col gap-[7px] ps-1 pe-0.5">
        <div className="flex items-center justify-between gap-2">
          <h3
            className={cn(
              "min-w-0 flex-1 truncate text-base font-medium leading-[1.4]",
              unavailable ? "text-text-muted" : "text-text-primary",
            )}
          >
            {lang === "ar" ? hotel.nameAr : hotel.nameEn}
          </h3>

          {selectable && (
            <button
              type="button"
              role="checkbox"
              aria-checked={selected}
              aria-label={c.library.requestAccess}
              onClick={onToggle}
              className={cn(
                "grid size-[22px] shrink-0 place-items-center rounded-md transition-colors",
                selected
                  ? "bg-brand-deep text-primary"
                  : "border-[1.5px] border-border-strong bg-surface-default",
              )}
            >
              {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
            </button>
          )}
        </div>

        <p className="truncate text-[13px] leading-[1.5] text-text-muted">
          {/* {lang === "ar" ? hotel.districtAr : hotel.district} */}
          {hotel.city}
          {/* {lang === "ar" ? hotel.distanceAr : hotel.distance} ·{" "} */}
          {fill(c.library.stars, { count: hotel.starRating })}
        </p>

        <span
          className={cn(
            "inline-flex w-fit items-center gap-1.5 rounded-md ps-2 pe-[9px] py-1",
            tone.wrap
          )}
        >
          <span className={cn("size-1.5 rounded-full", tone.dot)} aria-hidden="true" />
          <span
            className={cn(
              "text-[11px] font-medium uppercase tracking-[0.44px]",
              tone.text
            )}
          >
            {/* {c.library.status[relation]} */}
            {c.library.status[hotel?.hasPendingRequest ? "requested": "linked"]}
          </span>
        </span>
        
        {note && (
          <p className="text-xs leading-[1.5] text-text-muted">{note}</p>
        )}

        {footer && <div className="mt-1.5 flex items-center gap-3">{footer}</div>}
      </div>
    </article>
  );
}
