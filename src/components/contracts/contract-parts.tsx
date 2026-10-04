import { cn } from "@/lib/utils";
import { fill, useLanguage } from "@/lib/i18n";
import { BASE_WEEKDAY, contractRooms, mealPlans, roomPrice } from "@/lib/contract-data";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

export function RoomGroup({
  label,
  rows,
  meals,
  lang,
  t,
  base,
  baseCell,
}: {
  label: string;
  rows: Array<(typeof contractRooms)[number]>;
  meals: typeof mealPlans;
  lang: "en" | "ar";
  t: ReturnType<typeof useLanguage>["c"]["builder"];
  /** OV 03.12 — the season's own base, when this is a season's list. */
  base?: { weekday: number; weekend: number };
  /** What the base cell says; a season names itself rather than the contract. */
  baseCell?: string;
}) {
  return (
    <>
      <tr className="border-t border-border-subtle bg-surface-subtle">
        <td
          colSpan={meals.length + 1}
          className="py-2 text-xs font-semibold text-text-primary"
        >
          {label}
        </td>
      </tr>
      {rows.map((room) => (
        <tr
          key={`${room.type}-${room.view}`}
          className="border-t border-border-subtle"
        >
          <td className="py-3 pe-3">
            <p className="text-sm text-text-primary">
              {lang === "ar" ? room.viewAr : room.view}
              {room.base && (
                <span className="text-overline ms-2 text-brand-mid">BASE</span>
              )}
            </p>
            <p className="mt-0.5 text-xs text-text-muted">
              {room.base
                ? fill(baseCell ?? t.baseCell, {
                    amount: base?.weekday ?? BASE_WEEKDAY,
                  })
                : fill(t.supplementCell, {
                    base: base?.weekday ?? BASE_WEEKDAY,
                    supplement: room.supplement,
                  })}
            </p>
          </td>
          {meals.map((meal) => (
            <td
              key={meal.name}
              className="font-data py-3 text-end text-sm text-text-primary"
            >
              {roomPrice(room, meal, false, base).toLocaleString(
                lang === "ar" ? "ar-EG" : "en-US"
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function Section({
  id,
  title,
  body,
  right,
  locked = false,
  done = false,
  tone,
  children,
}: {
  id: number;
  title: string;
  body: string;
  right?: React.ReactNode;
  locked?: boolean;
  done?: boolean;
  /** Overrides the head styling when the body is shown but not yet usable. */
  tone?: "locked" | "open" | "done";
  children: React.ReactNode;
}) {
  const head = tone ?? (locked ? "locked" : done ? "done" : "open");

  return (
    <section
      id={`contract-section-${id}`}
      className="min-w-0 scroll-mt-24 overflow-hidden rounded-2xl border border-border-subtle bg-surface-default px-5 py-5"
    >
      <header className="mb-4 flex flex-wrap items-start gap-3">
        {/* UI 03.1 — the number says where the section stands. */}
        <span
          className={cn(
            "font-data flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs",
            head === "locked"
              ? "bg-status-neutral-bg text-text-muted"
              : head === "done"
                ? "bg-brand-deep text-text-inverse"
                : "bg-primary-subtle text-brand-deep"
          )}
        >
          {head === "done" ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            id
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h2
            className={cn(
              "text-base font-semibold",
              head === "locked" ? "text-text-muted" : "text-text-primary"
            )}
          >
            {title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-text-muted">{body}</p>
        </div>
        {!locked && right}
      </header>
      {/* A locked section shows its intent only — Figma UI 03.1 keeps the
          body hidden until the hotel and term are set. */}
      {!locked && children}
    </section>
  );
}

export function ChoiceRow({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-lg border px-3.5 py-2 text-sm transition-colors",
            value === option.value
              ? "border-brand-deep bg-primary-subtle font-medium text-text-primary"
              : "border-border-default text-text-secondary hover:bg-surface-subtle"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Table({
  head,
  rows,
  muted = [],
}: {
  head: string[];
  rows: ReactNode[][];
  /** Row indexes the frame greys out, such as the locked base room. */
  muted?: number[];
}) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="text-overline text-text-muted">
            {head.map((cell, index) => (
              <th
                key={`${cell}-${index}`}
                className={cn(
                  "py-2 font-semibold",
                  index === head.length - 1 && cell === "" ? "text-end" : "text-start"
                )}
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className={cn(
                "border-t border-border-subtle align-middle",
                muted.includes(index) && "bg-surface-subtle"
              )}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    "py-3 pe-3",
                    cellIndex === 0 ? "text-text-primary" : "text-text-secondary",
                    muted.includes(index) && "text-text-muted"
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
