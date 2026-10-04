import { useState } from "react";
import { Search } from "lucide-react";
import { IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { fill, useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  bookingFilter,
  bookingSearch,
  exportBookings,
  issueSent,
  rejectBooking,
  rejectReasons,
} from "@/lib/booking-overlay-data";

/** One of a list of choices, drawn as a bordered row. */
function Choice({
  checked,
  onChange,
  label,
  note,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  note: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "flex w-full items-start gap-2.5 rounded-[10px] border px-3.5 py-2.5 text-start transition-colors",
        checked
          ? "border-brand-deep bg-primary-subtle"
          : "border-border-subtle hover:bg-surface-subtle"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
          checked ? "border-brand-deep" : "border-border-strong"
        )}
      >
        {checked && (
          <span
            className="h-2 w-2 rounded-full bg-brand-deep"
            aria-hidden="true"
          />
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-[12.5px] font-semibold text-text-primary">
          {label}
        </span>
        <span className="mt-0.5 block text-[11.5px] leading-4 text-text-muted">
          {note}
        </span>
      </span>
    </button>
  );
}

/**
 * OV 05.3A — the fixed list Hoteliana reports back to the agent, each
 * reason saying what it actually means.
 */
export function RejectReasonOverlay({
  value,
  onPick,
  onClose,
}: {
  value: string;
  onPick: (reason: string) => void;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = rejectBooking;
  const start = Math.max(
    rejectReasons.findIndex((reason) => reason.label[k] === value),
    0
  );
  const [picked, setPicked] = useState(start);

  return (
    <IconModal
      width="660px"
      overline={c.pickOverline[k]}
      title={c.pickTitle[k]}
      body={c.pickBody[k]}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {c.cancel[k]}
          </Button>
          <Button
            onClick={() => {
              onPick(rejectReasons[picked]!.label[k]);
              onClose();
            }}
          >
            {c.useReason[k]}
          </Button>
        </>
      }
    >
      <div className="space-y-2">
        {rejectReasons.map((reason, index) => (
          <Choice
            key={reason.label.en}
            checked={index === picked}
            onChange={() => setPicked(index)}
            label={reason.label[k]}
            note={reason.hint[k]}
          />
        ))}
      </div>
      <p className="text-[11.5px] leading-4 text-text-muted">{c.pickNote[k]}</p>
    </IconModal>
  );
}

/** OV 05.13 — the issue is with Hoteliana, and the booking has not moved. */
export function IssueSentOverlay({
  onClose,
  onFollow,
}: {
  onClose: () => void;
  onFollow?: (() => void) | undefined;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = issueSent;

  return (
    <IconModal
      width="660px"
      overline={c.overline[k]}
      title={c.title[k]}
      body={c.body[k]}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {c.back[k]}
          </Button>
          <Button onClick={onFollow ?? onClose}>{c.follow[k]}</Button>
        </>
      }
    >
      <div className="overflow-hidden rounded-[12px] border border-border-subtle">
        {c.rows.map((row) => (
          <div
            key={row.label.en}
            className="flex flex-wrap items-center gap-3 px-3.5 py-2.5 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-border-subtle"
          >
            <span className="min-w-0 flex-1 text-[12.5px] text-text-muted">
              {row.label[k]}
            </span>
            <span className="text-[12.5px] font-semibold text-text-primary">
              {row.value[k]}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[11.5px] leading-4 text-text-muted">{c.note[k]}</p>
    </IconModal>
  );
}


/** OV 05.8 — finding one booking among forty-eight. */
export function BookingSearchOverlay({
  onClose,
  onOpenFirst,
}: {
  onClose: () => void;
  onOpenFirst?: (() => void) | undefined;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = bookingSearch;
  const [term, setTerm] = useState(c.term[k]);
  const hits = c.hits.filter((hit) =>
    hit.name[k].toLowerCase().includes(term.trim().toLowerCase())
  );

  return (
    <IconModal
      width="660px"
      overline=""
      title={c.title[k]}
      body={c.body[k]}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {c.close[k]}
          </Button>
          <Button disabled={hits.length === 0} onClick={onOpenFirst ?? onClose}>
            {c.openFirst[k]}
          </Button>
        </>
      }
    >
      <span className="relative block">
        <Search
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted start-3"
          aria-hidden="true"
        />
        <input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          className="h-11 w-full rounded-[10px] border border-border-default bg-surface-default ps-9 pe-3 text-sm text-text-primary outline-none focus:border-brand-deep"
        />
      </span>

      <div>
        <p className="text-overline text-text-muted">
          {fill(c.matches[k], { count: hits.length })}
        </p>
        <div className="mt-2 overflow-hidden rounded-[12px] border border-border-subtle">
          {hits.map((hit) => (
            <div
              key={hit.name.en}
              className="flex flex-wrap items-center gap-3 px-3.5 py-2.5 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-border-subtle"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[12.5px] font-semibold text-text-primary">
                  {hit.name[k]}
                </span>
                <span className="mt-0.5 block text-[11.5px] text-text-muted">
                  {hit.meta[k]}
                </span>
              </span>
              <span
                className={cn(
                  "text-[11.5px]",
                  hit.waiting ? "text-status-warning" : "text-status-success"
                )}
              >
                {hit.state[k]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </IconModal>
  );
}

/** OV 05.14 — the list as a file, exactly as it stands. */
export function ExportBookingsOverlay({
  count,
  onClose,
}: {
  count: number;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = exportBookings;
  const [scope, setScope] = useState(0);
  const [format, setFormat] = useState(0);
  const [columns, setColumns] = useState<number[]>(
    c.columns.map((_, index) => index).slice(0, 9)
  );

  return (
    <IconModal
      width="660px"
      overline=""
      title={c.title[k]}
      body={c.body[k]}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {c.cancel[k]}
          </Button>
          <Button onClick={onClose}>{fill(c.download[k], { count })}</Button>
        </>
      }
    >
      <div>
        <p className="text-overline text-text-muted">{c.scopeTitle[k]}</p>
        <div className="mt-2 space-y-2">
          {c.scopes.map((item, index) => (
            <Choice
              key={item.label.en}
              checked={index === scope}
              onChange={() => setScope(index)}
              label={item.label[k]}
              note={item.hint[k]}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-overline text-text-muted">{c.formatTitle[k]}</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {c.formats.map((item, index) => (
            <Choice
              key={item.label.en}
              checked={index === format}
              onChange={() => setFormat(index)}
              label={item.label[k]}
              note={item.hint[k]}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-overline text-text-muted">{c.columnsTitle[k]}</p>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
          {c.columns.map((column, index) => (
            <label
              key={column.en}
              className="flex cursor-pointer items-center gap-2 whitespace-nowrap"
            >
              <input
                type="checkbox"
                checked={columns.includes(index)}
                onChange={() =>
                  setColumns((prev) =>
                    prev.includes(index)
                      ? prev.filter((item) => item !== index)
                      : [...prev, index]
                  )
                }
                className="h-4 w-4 rounded accent-[var(--brand-deep)]"
              />
              <span className="text-[12.5px] text-text-primary">
                {column[k]}
              </span>
            </label>
          ))}
        </div>
      </div>

      <p className="text-[11.5px] leading-4 text-text-muted">{c.note[k]}</p>
    </IconModal>
  );
}

/** OV 05.7 — the filters that stack with the chips above the table. */
export function BookingFilterOverlay({ onClose }: { onClose: () => void }) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = bookingFilter;
  const [picked, setPicked] = useState<number[]>(c.groups.map(() => 0));

  return (
    <IconModal
      width="760px"
      overline=""
      title={c.title[k]}
      body={c.body[k]}
      onClose={onClose}
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => setPicked(c.groups.map(() => 0))}
          >
            {c.clear[k]}
          </Button>
          <Button variant="dark" onClick={onClose}>
            {c.apply[k]}
          </Button>
        </>
      }
    >
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {c.groups.map((group, index) => (
          <div key={group.title.en}>
            <p className="text-overline text-text-muted">{group.title[k]}</p>
            <div className="mt-2 space-y-1">
              {group.options.map((option, at) => (
                <label
                  key={option.label.en}
                  className={cn(
                    "flex cursor-pointer items-start gap-2.5 rounded-[10px] px-3 py-2 transition-colors",
                    at === picked[index]
                      ? "bg-surface-subtle"
                      : "hover:bg-surface-subtle/60"
                  )}
                >
                  <input
                    type="radio"
                    name={group.title.en}
                    checked={at === picked[index]}
                    onChange={() =>
                      setPicked((prev) =>
                        prev.map((item, g) => (g === index ? at : item))
                      )
                    }
                    className="mt-px h-4 w-4 shrink-0 accent-[var(--brand-deep)]"
                  />
                  <span className="min-w-0">
                    <span className="block text-[12.5px] leading-4 text-text-primary">
                      {option.label[k]}
                    </span>
                    {option.count[k] && (
                      <span className="mt-0.5 block text-[11px] leading-4 text-text-muted">
                        {option.count[k]}
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </IconModal>
  );
}
