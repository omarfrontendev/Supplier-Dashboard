/**
 * Manage Release - the live pieces of the Release overlay: how a timing reads,
 * and the preview's counts, replaced rules and before / after.
 *
 * Resolution is the backend's: effective timing, sources and local deadlines
 * are shown as they come back, never recomputed here.
 */

import { StatusPill } from "@/components/layout/page-shell";
import type { ReleaseChangesData, ReleaseValue } from "@/api/modules/rates-availability/types";
import { datePickerCopy } from "@/lib/date-picker-copy";
import { fill } from "@/lib/i18n";
import { arNum, liveRelease as lrel, liveRestrictions as lr } from "@/lib/rate-overlay-data";
import { cn } from "@/lib/utils";

type Lang = "en" | "ar";
interface Bi {
  en: string;
  ar: string;
}

/**
 * The contract's own release policy as GET release-targets returns it.
 * Read-only: shown as "From the contract", never sent in an override.
 */
export interface ReleaseInheritedPolicy {
  type: "same_day" | "number_of_days";
  daysBeforeCheckIn?: number | null;
  releaseTime: string;
  afterReleaseAction: "stop_sale" | "on_request";
}

const MAX_ROWS = 60;
const num = (value: number | string, k: Lang) => (k === "ar" ? arNum(value) : String(value));

/** "3 days before · 18:00" or "Same day · 14:00". Same day ignores any day count. */
export function describeReleaseTiming(
  timing: {
    type: "same_day" | "number_of_days" | null;
    daysBeforeCheckIn?: number | null | undefined;
    releaseTime: string | null;
  } | null,
  k: Lang,
): string {
  if (!timing || !timing.type || !timing.releaseTime) return lrel.noValue[k];
  const time = num(timing.releaseTime, k);
  return timing.type === "same_day"
    ? fill(lrel.valueSameDay[k], { time })
    : fill(lrel.valueDays[k], { days: num(timing.daysBeforeCheckIn ?? 0, k), time });
}

/** "14 Jun 2027" from a YYYY-MM-DD string, with no time zone conversion. */
export function releaseDayLabel(iso: string, k: Lang): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${num(d ?? 0, k)} ${datePickerCopy[k].monthsShort[(m ?? 1) - 1] ?? ""} ${
    k === "ar" ? arNum(y ?? 0) : String(y ?? "")
  }`;
}

function ReleaseCell({ value, k }: { value: ReleaseValue; k: Lang }) {
  const operational = value.source === "room_override" || value.source === "all_rooms_override";
  return (
    <span className="block">
      {describeReleaseTiming(value, k)}
      <span
        className={cn(
          "ms-1 inline-block rounded-[5px] px-1 py-px text-[10px] font-medium",
          operational ? "bg-primary-subtle text-brand-deep" : "bg-surface-subtle text-text-quiet",
        )}
      >
        {lr.sources[value.source][k]}
        {value.ruleId !== null && ` #${value.ruleId}`}
      </span>
      {value.deadline && (
        <span className="block text-[10.5px] text-text-quiet">
          {fill(lrel.deadline[k], {
            date: releaseDayLabel(value.deadline.date, k),
            time: num(value.deadline.time, k),
            timezone: value.deadline.timezone,
          })}
        </span>
      )}
    </span>
  );
}

const sameValue = (a: ReleaseValue, b: ReleaseValue) =>
  a.type === b.type &&
  (a.type === "same_day" || a.daysBeforeCheckIn === b.daysBeforeCheckIn) &&
  a.releaseTime === b.releaseTime &&
  a.source === b.source &&
  a.ruleId === b.ruleId &&
  a.deadline?.date === b.deadline?.date &&
  a.deadline?.time === b.deadline?.time;

/** Counts, replaced rules and before / after, as the release preview returned them. */
export function ReleasePreview({
  data,
  roomName,
  k,
}: {
  data: ReleaseChangesData;
  roomName: (variationId: number) => Bi;
  k: Lang;
}) {
  const changed = data.changes.filter((change) => !sameValue(change.before, change.after));
  return (
    <section className="mt-3 rounded-xl border border-border-subtle p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-text-quiet">
        {lr.impactTitle[k]}
      </p>
      <p className="mt-1 text-[12.5px] font-semibold text-text-primary">
        {fill(lr.counts[k], {
          cells: num(data.counts.cells, k),
          nights: num(data.counts.nights, k),
          rooms: num(data.counts.rooms, k),
        })}
      </p>
      {data.replacedRuleIds.length > 0 && (
        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[12px] text-text-body">
          <StatusPill tone="warning">
            {fill(lr.replaces[k], { ids: data.replacedRuleIds.map((id) => `#${id}`).join(", ") })}
          </StatusPill>
        </p>
      )}
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.04em] text-text-quiet">
        {lr.changedTitle[k]}
      </p>
      {changed.length === 0 ? (
        <p className="mt-1 text-[12px] text-text-body">{lr.noEffectiveChange[k]}</p>
      ) : (
        <>
          <div className="mt-1 max-h-[280px] overflow-auto">
            <table className="w-full min-w-[620px] text-[11.5px]">
              <thead className="sticky top-0 bg-surface-default">
                <tr className="text-[10.5px] text-text-quiet">
                  {[lr.colRoom, lr.colNight, lr.colBefore, lr.colAfter].map((col) => (
                    <th key={col.en} className="py-1 pe-2 text-start font-semibold">
                      {col[k]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {changed.slice(0, MAX_ROWS).map((change) => (
                  <tr
                    key={`${change.variationId}|${change.stayDate}`}
                    className="border-t border-border-subtle align-top"
                  >
                    <td className="py-1 pe-2 text-text-primary">
                      {roomName(change.variationId)[k]}
                    </td>
                    <td className="whitespace-nowrap py-1 pe-2">
                      {releaseDayLabel(change.stayDate, k)}
                    </td>
                    <td className="py-1 pe-2 text-text-quiet">
                      <ReleaseCell value={change.before} k={k} />
                    </td>
                    <td className="py-1 pe-2 font-medium text-text-primary">
                      <ReleaseCell value={change.after} k={k} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {changed.length > MAX_ROWS && (
            <p className="mt-1 text-[11px] text-text-quiet">
              {fill(lr.showingFirst[k], { shown: num(MAX_ROWS, k), total: num(changed.length, k) })}
            </p>
          )}
        </>
      )}
    </section>
  );
}
