import { useState } from "react";
import { CalendarRange } from "lucide-react";
import { IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { fill, useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  seasonDetailCopy,
  type NightChange,
  type SeasonDetail,
} from "@/lib/season-detail-data";

/** Thursday and Friday carry the weekend price, counting from Monday. */
const isWeekendColumn = (column: number) => column === 3 || column === 4;

/**
 * OV 03.14 / 15 / 16 / 17 — one season, one room, every night it covers.
 * The draft twin has no rate-calendar changes yet; the read-only one
 * cannot be edited.
 */
export function SeasonDetailPanel({
  season,
  mode = "live",
  onClose,
  onEdit,
}: {
  season: SeasonDetail;
  mode?: "live" | "draft" | "readOnly";
  onClose: () => void;
  onEdit?: () => void;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = seasonDetailCopy;
  const [room, setRoom] = useState(0);
  const [changes, setChanges] = useState<NightChange[]>(
    mode === "live" ? season.changes : []
  );

  const draft = mode === "draft";
  const nights = season.months.reduce(
    (sum, month) => sum + ((month.to ?? 0) - (month.from ?? 1) + 1),
    0
  );
  const changeFor = (month: number, night: number) =>
    changes.find((x) => x.month === month && x.night === night);

  return (
    <IconModal
      width="760px"
      icon={<CalendarRange className="h-5 w-5" aria-hidden="true" />}
      overline={draft ? c.overlineDraft[k] : c.overlineLive[k]}
      title={season.name[k]}
      body={season.meta[k]}
      onClose={onClose}
      footer={
        <>
          {mode !== "readOnly" && (
            <Button variant="outline" onClick={onEdit}>
              {c.editSeason[k]}
            </Button>
          )}
          {!draft && mode !== "readOnly" && (
            <Button onClick={onClose}>{c.openCalendar[k]}</Button>
          )}
        </>
      }
    >
      {/* Which room's nightly price the calendar below is showing. */}
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
          {c.roomLabel[k]}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {c.rooms.map((name, index) => (
            <button
              key={name.en}
              type="button"
              onClick={() => setRoom(index)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-[12px] transition-colors",
                index === room
                  ? "border-brand-deep bg-primary-subtle font-medium text-text-primary"
                  : "border-border-default text-text-secondary hover:bg-surface-subtle"
              )}
            >
              {name[k]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {(
          [
            [c.ruleLabel[k], season.rule[k]],
            [c.weekdayLabel[k], season.weekday[k]],
            draft
              ? [c.draftChangedLabel[k], c.draftChangedValue[k]]
              : [
                  c.changedLabel[k],
                  fill(c.changedValue[k], {
                    count: changes.length,
                    total: nights,
                  }),
                ],
          ] as Array<[string, string]>
        ).map(([label, value]) => (
          <div
            key={label}
            className="rounded-[10px] border border-border-subtle bg-surface-subtle px-3.5 py-3"
          >
            <p className="text-overline text-text-muted">{label}</p>
            <p className="mt-1 text-[12.5px] font-medium text-text-primary">
              {value}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[11px] leading-4 text-text-muted">{c.caption[k]}</p>

      {season.months.map((month, monthIndex) => (
        <div key={month.label.en}>
          <p className="text-[12.5px] font-semibold text-text-primary">
            {month.label[k]}
          </p>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {(k === "ar" ? c.weekdaysAr : c.weekdays).map((day) => (
              <span
                key={day}
                className="text-center text-[10px] font-semibold text-text-muted"
              >
                {day}
              </span>
            ))}
            {Array.from(
              { length: (month.firstColumn + (month.weekFrom ?? 1) - 1) % 7 },
              (_, index) => <span key={`lead-${index}`} aria-hidden="true" />
            )}
            {Array.from(
              { length: (month.weekTo ?? month.days) - (month.weekFrom ?? 1) + 1 },
              (_, index) => index + (month.weekFrom ?? 1)
            ).map((night) => {
                const column = (month.firstColumn + night - 1) % 7;
                const inSeason =
                  night >= (month.from ?? 1) && night <= (month.to ?? 0);
                const change = changeFor(monthIndex, night);
                const price = isWeekendColumn(column)
                  ? season.weekend
                  : season.base;
                return (
                  <span
                    key={night}
                    style={
                      inSeason && !change
                        ? { backgroundColor: season.tint, borderColor: season.ink }
                        : undefined
                    }
                    className={cn(
                      "rounded-md border px-1 py-1 text-center",
                      !inSeason
                        ? "border-border-subtle bg-surface-subtle text-text-muted/60"
                        : change
                          ? "border-notice-border bg-notice"
                          : ""
                    )}
                  >
                    <span className="block text-[10px] font-semibold text-text-primary">
                      {String(night).padStart(2, "0")}
                    </span>
                    {inSeason && (
                      <>
                        <span className="block text-[9px] leading-3">
                          {change ? (
                            <>
                              <s className="text-text-muted">{price}</s>{" "}
                              <b className="font-semibold text-status-warning">
                                {change.now.replace(" SAR", "")}
                              </b>
                            </>
                          ) : (
                            <span className="text-text-secondary">{price}</span>
                          )}
                        </span>
                        {isWeekendColumn(column) && (
                          <span className="block text-[8px] leading-3 text-text-muted">
                            {c.weekendTag[k]}
                          </span>
                        )}
                      </>
                    )}
                  </span>
                );
            })}
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-text-muted">
        {(
          [
            [season.ink, c.legendSeason[k]],
            ["var(--notice-border)", c.legendChanged[k]],
            ["var(--border-strong)", c.legendOutside[k]],
          ] as Array<[string, string]>
        ).map(([tone, label]) => (
          <span key={label} className="flex items-center gap-1.5">
            <span
              style={{ backgroundColor: tone }}
              className="h-2 w-2 rounded-full"
              aria-hidden="true"
            />
            {label}
          </span>
        ))}
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
            {c.changesTitle[k]}
          </p>
          {changes.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => setChanges([])}>
              {c.resetAll[k]}
            </Button>
          )}
        </div>

        {/* OV 03.14D / 03.14B — nothing has been changed yet, or any more. */}
        {changes.length === 0 ? (
          <p className="mt-2 rounded-[12px] bg-surface-subtle px-3.5 py-3 text-[11.5px] leading-5 text-text-muted">
            {draft ? c.draftChangesNote[k] : c.changesNote[k]}
          </p>
        ) : (
          <>
            <div className="mt-2 space-y-2">
              {changes.map((change) => (
                <div
                  key={change.when.en}
                  className="flex flex-wrap items-center gap-3 rounded-[10px] border border-border-subtle px-3.5 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-medium text-text-primary">
                      {change.when[k]}
                    </p>
                    <p className="mt-0.5 text-[11px] text-text-muted">
                      {change.who[k]}
                    </p>
                  </div>
                  <p className="text-[12.5px] text-text-secondary">
                    <s className="text-text-muted">{change.was}</s>
                    <span className="mx-1.5" aria-hidden="true">
                      →
                    </span>
                    <b className="font-semibold text-status-warning">
                      {change.now}
                    </b>
                  </p>
                  <button
                    type="button"
                    className="text-xs font-medium text-text-link hover:underline"
                  >
                    {c.openNight[k]}
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-4 text-text-muted">
              {c.changesNote[k]}
            </p>
          </>
        )}
      </div>

      {draft && (
        <p className="text-[11px] leading-4 text-text-muted">
          {c.draftFooterNote[k]}
        </p>
      )}
    </IconModal>
  );
}
