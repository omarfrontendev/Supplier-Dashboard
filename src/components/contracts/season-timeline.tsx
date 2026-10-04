import type { RateSeason } from "@/lib/contract-data";

/** UI 03.1F — the contract's twelve months, SEP first. */
const MONTH_ORDER = [
  { label: "SEP", labelAr: "سبتمبر", year: 2026, month: 8 },
  { label: "OCT", labelAr: "أكتوبر", year: 2026, month: 9 },
  { label: "NOV", labelAr: "نوفمبر", year: 2026, month: 10 },
  { label: "DEC", labelAr: "ديسمبر", year: 2026, month: 11 },
  { label: "JAN", labelAr: "يناير", year: 2027, month: 0 },
  { label: "FEB", labelAr: "فبراير", year: 2027, month: 1 },
  { label: "MAR", labelAr: "مارس", year: 2027, month: 2 },
  { label: "APR", labelAr: "أبريل", year: 2027, month: 3 },
  { label: "MAY", labelAr: "مايو", year: 2027, month: 4 },
  { label: "JUN", labelAr: "يونيو", year: 2027, month: 5 },
  { label: "JUL", labelAr: "يوليو", year: 2027, month: 6 },
  { label: "AUG", labelAr: "أغسطس", year: 2027, month: 7 },
];

function dayOf(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return { y: y ?? 2026, m: (m ?? 1) - 1, d: d ?? 1 };
}

/**
 * UI 03.1F — the month map. Each month is a bar, and a season paints the
 * share of that bar its nights actually cover.
 */
export function SeasonTimeline({
  seasons,
  ar,
}: {
  seasons: RateSeason[];
  ar: boolean;
}) {
  const painted = seasons.filter((season) => season.from && season.to);

  return (
    <div className="grid grid-cols-6 gap-x-1 gap-y-3 sm:grid-cols-12">
      {MONTH_ORDER.map((slot) => {
        const length = new Date(slot.year, slot.month + 1, 0).getDate();
        const blocks = painted
          .map((season) => {
            const from = dayOf(season.from!);
            const to = dayOf(season.to!);
            const startsBefore =
              from.y < slot.year ||
              (from.y === slot.year && from.m < slot.month);
            const endsAfter =
              to.y > slot.year || (to.y === slot.year && to.m > slot.month);
            const inside =
              (from.y === slot.year && from.m === slot.month) ||
              (to.y === slot.year && to.m === slot.month) ||
              (startsBefore && endsAfter);
            if (!inside) return null;
            const first = startsBefore ? 1 : from.d;
            const last = endsAfter ? length : to.d;
            return {
              key: season.name,
              colour: season.colour ?? "#eef1ee",
              left: ((first - 1) / length) * 100,
              width: ((last - first + 1) / length) * 100,
            };
          })
          .filter(Boolean) as Array<{
          key: string;
          colour: string;
          left: number;
          width: number;
        }>;

        return (
          <div key={slot.label}>
            <div className="relative h-[22px] overflow-hidden rounded-md bg-surface-subtle">
              {blocks.map((block) => (
                <span
                  key={block.key}
                  className="absolute inset-y-0 start-0"
                  style={{
                    insetInlineStart: `${block.left}%`,
                    width: `${block.width}%`,
                    backgroundColor: block.colour,
                  }}
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="mt-1.5 text-center text-[11px] leading-[14px] text-text-muted">
              {ar ? slot.labelAr : slot.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/** The swatch and name under the map. */
export function SeasonLegend({
  seasons,
  ar,
}: {
  seasons: RateSeason[];
  ar: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {seasons.map((season) => (
        <span
          key={season.name}
          className="inline-flex items-center gap-1.5 text-[12px] leading-[17px] text-text-muted"
        >
          <span
            className="h-3 w-3 rounded-[3px]"
            style={{ backgroundColor: season.colour ?? "#eef1ee" }}
            aria-hidden="true"
          />
          {ar ? season.nameAr : season.name}
        </span>
      ))}
    </div>
  );
}
