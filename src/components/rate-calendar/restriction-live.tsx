/**
 * Manage date-specific booking restrictions - the live pieces of the
 * Restrictions overlay: weekday check-in / check-out groups, what applies
 * now with each value's source, and the preview's before / after.
 *
 * Resolution is the backend's: values and fieldSources are shown as they
 * come back, never recomputed here.
 */

import { StatusPill } from "@/components/layout/page-shell";
import { useRestrictionsContext } from "@/api/modules/rates-availability/useRestrictions";
import type {
  RestrictionChangesData,
  RestrictionField,
  RestrictionScope,
  RestrictionValues,
} from "@/api/modules/rates-availability/types";
import { fill } from "@/lib/i18n";
import { liveRestrictions as lr } from "@/lib/rate-overlay-data";
import { dayName, restrictionNum as num } from "@/lib/restriction-format";
import { cn } from "@/lib/utils";

type Lang = "en" | "ar";
interface Bi {
  en: string;
  ar: string;
}

const MAX_ROWS = 60;
/* ------------------------------------------------- values and sources */

function SourceTag({
  values,
  field,
  k,
}: {
  values: RestrictionValues;
  field: RestrictionField;
  k: Lang;
}) {
  const source = values.fieldSources?.[field];
  if (!source) return null;
  const operational = source.source === "room_override" || source.source === "all_rooms_override";
  return (
    <span
      className={cn(
        "ms-1 inline-block rounded-[5px] px-1 py-px text-[10px] font-medium",
        operational ? "bg-primary-subtle text-brand-deep" : "bg-surface-subtle text-text-quiet",
      )}
    >
      {lr.sources[source.source][k]}
      {source.ruleIds.length > 0 && ` #${source.ruleIds.join(", #")}`}
    </span>
  );
}

function ValueCell({
  values,
  field,
  k,
}: {
  values: RestrictionValues;
  field: RestrictionField;
  k: Lang;
}) {
  const text =
    field === "minNights"
      ? values.minNights > 0
        ? fill(lr.nightsValue[k], { n: num(values.minNights, k) })
        : lr.noMinimumValue[k]
      : lr[values[field]][k];
  return (
    <span
      className={cn(field !== "minNights" && values[field] === "closed" && "text-status-danger")}
    >
      {text}
      <SourceTag values={values} field={field} k={k} />
    </span>
  );
}

const nightLabel = (iso: string, k: Lang) => {
  const on = new Date(`${iso}T00:00:00`);
  return `${dayName(on.getDay(), k)} ${num(on.getDate(), k)}/${num(on.getMonth() + 1, k)}`;
};

/** POST restrictions/context for the selection being edited. */
export function RestrictionEffective({
  contractId,
  scope,
  tooMany,
  roomName,
  k,
}: {
  contractId: number;
  scope: RestrictionScope | null;
  tooMany: boolean;
  roomName: (variationId: number) => Bi;
  k: Lang;
}) {
  const context = useRestrictionsContext(contractId, tooMany ? null : scope);
  const cells = context.data?.cells ?? [];
  return (
    <section className="rounded-xl border border-border-subtle p-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-text-quiet">
        {lr.effectiveTitle[k]}
      </p>
      <p className="mt-0.5 text-[12px] text-text-body">{lr.effectiveLead[k]}</p>
      {tooMany ? (
        <p className="mt-2 text-[12px] text-text-body">{lr.tooMany[k]}</p>
      ) : context.isLoading ? (
        <p className="mt-2 text-[12px] text-text-quiet">{lr.loading[k]}</p>
      ) : context.isError ? (
        <p className="mt-2 text-[12px] text-status-danger">{lr.loadFailed[k]}</p>
      ) : (
        <>
          <div className="mt-2 max-h-[240px] overflow-auto">
            <table className="w-full min-w-[520px] text-[11.5px]">
              <thead className="sticky top-0 bg-surface-default">
                <tr className="text-[10.5px] text-text-quiet">
                  {[lr.colRoom, lr.colNight, lr.colMin, lr.colIn, lr.colOut].map((col) => (
                    <th key={col.en} className="py-1 pe-2 text-start font-semibold">
                      {col[k]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cells.slice(0, MAX_ROWS).map((cell) => (
                  <tr
                    key={`${cell.variationId}|${cell.stayDate}`}
                    className="border-t border-border-subtle"
                  >
                    <td className="py-1 pe-2 text-text-primary">{roomName(cell.variationId)[k]}</td>
                    <td className="whitespace-nowrap py-1 pe-2">{nightLabel(cell.stayDate, k)}</td>
                    {(["minNights", "checkIn", "checkOut"] as const).map((field) => (
                      <td key={field} className="py-1 pe-2">
                        <ValueCell values={cell.restrictions} field={field} k={k} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {cells.length > MAX_ROWS && (
            <p className="mt-1 text-[11px] text-text-quiet">
              {fill(lr.showingFirst[k], { shown: num(MAX_ROWS, k), total: num(cells.length, k) })}
            </p>
          )}
        </>
      )}
    </section>
  );
}

const sameValues = (a: RestrictionValues, b: RestrictionValues) =>
  a.minNights === b.minNights && a.checkIn === b.checkIn && a.checkOut === b.checkOut;

/** Counts, replaced rules and before / after, as the preview returned them. */
export function RestrictionPreview({
  data,
  roomName,
  k,
}: {
  data: RestrictionChangesData;
  roomName: (variationId: number) => Bi;
  k: Lang;
}) {
  const changed = data.changes.filter((change) => !sameValues(change.before, change.after));
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
                  {[lr.colRoom, lr.colNight, lr.colMin, lr.colIn, lr.colOut].map((col) => (
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
                      {nightLabel(change.stayDate, k)}
                    </td>
                    {(["minNights", "checkIn", "checkOut"] as const).map((field) => {
                      const differs = change.before[field] !== change.after[field];
                      return (
                        <td key={field} className="py-1 pe-2">
                          {differs ? (
                            <>
                              <span className="block text-text-quiet line-through">
                                <ValueCell values={change.before} field={field} k={k} />
                              </span>
                              <span className="block font-medium text-text-primary">
                                <ValueCell values={change.after} field={field} k={k} />
                              </span>
                            </>
                          ) : (
                            <span className="text-text-body">
                              <ValueCell values={change.after} field={field} k={k} />
                            </span>
                          )}
                        </td>
                      );
                    })}
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
