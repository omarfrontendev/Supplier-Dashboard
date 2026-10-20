import { useState } from "react";
import { ChevronDown, Plus, Timer, X } from "lucide-react";
import { Drawer } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fill, useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  cancellationDrawer,
  chargeKinds,
  releaseDrawer,
  type ChargeKind,
  type SeasonPolicy,
} from "@/lib/policy-overlay-data";
import {
  cancellationIssues,
  releaseIssues,
} from "@/components/contracts/contract-form/schema";
import {
  MAX_CANCELLATION_TIERS,
  type AfterRelease,
  type CancellationCharge,
  type CancellationTier,
  type ReleasePolicy,
} from "@/store/features/contracts/types";

const DRAWER_WIDTH = "640px";

interface Tier {
  id: number;
  days: string;
  charge: ChargeKind;
  value: string;
}

const START: Tier[] = [
  { id: 1, days: "7", charge: "free", value: "" },
  { id: 2, days: "3", charge: "nights", value: "1" },
];

/** The small cell that holds a number inside a tier row. */
function NumberCell({
  value,
  placeholder,
  decimal = false,
  label,
  onChange,
}: {
  value: string;
  placeholder?: string;
  decimal?: boolean;
  label?: string;
  onChange: (next: string) => void;
}) {
  return (
    <input
      value={value}
      inputMode={decimal ? "decimal" : "numeric"}
      aria-label={label}
      placeholder={placeholder ?? ""}
      onChange={(event) => {
        const next = event.target.value;
        if ((decimal ? /^\d*\.?\d{0,2}$/ : /^\d{0,3}$/).test(next)) onChange(next);
      }}
      className="font-data h-9 w-14 rounded-lg border border-border-strong bg-surface-default px-2 text-center text-sm text-text-primary placeholder:text-text-muted focus-visible:border-border-focus focus-visible:outline-none"
    />
  );
}

/** OV 03.16M — the four things a tier can charge. */
function ChargeMenu({
  charge,
  onPick,
}: {
  charge: ChargeKind;
  onPick: (kind: ChargeKind) => void;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = cancellationDrawer;
  const current = chargeKinds.find((x) => x.kind === charge);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-9 min-w-[150px] items-center justify-between gap-2 rounded-lg border border-border-strong bg-surface-default px-2.5 text-start text-sm text-text-primary hover:bg-surface-subtle"
        >
          <span className={cn("truncate", !current && "text-text-muted")}>
            {current ? current.label[k] : c.choosePlaceholder[k]}
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-text-muted" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[220px]">
        {chargeKinds.map((option) => (
          <DropdownMenuItem
            key={option.kind}
            className="items-start py-2"
            onSelect={() => onPick(option.kind)}
          >
            <span>
              <span className="block text-[13px] font-medium text-text-primary">
                {option.label[k]}
              </span>
              <span className="mt-0.5 block text-[11px] text-text-muted">
                {option.hint[k]}
              </span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * OV 03.16 / B / C / D / E — the tiers, and the states they pass through.
 * OV 03.16SRAM / SLTN / SHAJ / SSUM — the same drawer scoped to a season,
 * which starts from one free tier at 14 days rather than the contract's two.
 */
export function CancellationDrawer({
  season,
  initial,
  onSave,
  onClose,
}: {
  season?: SeasonPolicy;
  initial?: CancellationTier[] | null;
  onSave?: (tiers: CancellationTier[]) => void;
  onClose: () => void;
}) {
  const { c: dict, lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = cancellationDrawer;
  const [tiers, setTiers] = useState<Tier[]>(() =>
    initial?.length
      ? initial.map((tier, index) => ({ id: index + 1, ...tier }))
      : season
        ? [{ id: 1, days: "14", charge: "free", value: "" }]
        : START
  );
  const [issues, setIssues] = useState<string[]>([]);

  const save = () => {
    const next = tiers.map(({ days, charge, value }) => ({
      days,
      charge: charge as CancellationCharge | "",
      value: charge === "free" ? "" : value,
    }));
    const found = cancellationIssues(next, dict.builder.form.v);
    setIssues(found);
    if (found.length > 0) return;
    onSave?.(next);
    onClose();
  };
  const [removed, setRemoved] = useState<{ tier: Tier; at: number } | null>(
    null
  );

  const last = tiers[tiers.length - 1];
  const isNew = Boolean(last && !last.days);
  const full = tiers.length >= MAX_CANCELLATION_TIERS;

  const update = (id: number, patch: Partial<Tier>) =>
    setTiers((prev) =>
      prev.map((tier) => (tier.id === id ? { ...tier, ...patch } : tier))
    );

  const remove = (tier: Tier, index: number) => {
    setTiers((prev) => prev.filter((x) => x.id !== tier.id));
    setRemoved({ tier, at: index });
  };

  return (
    <Drawer
      width={DRAWER_WIDTH}
      overline={season ? season.overline[k] : c.overline[k]}
      title={season ? season.title[k] : c.title[k]}
      meta={season ? season.body[k] : c.body[k]}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {c.cancel[k]}
          </Button>
          <Button onClick={save}>{c.confirm[k]}</Button>
        </>
      }
    >
      <div className="grid grid-cols-[76px_1fr_1fr_28px] items-center gap-3 pb-2 text-overline text-text-muted">
        {c.head.map((cell) => (
          <span key={cell.en}>{cell[k]}</span>
        ))}
        <span />
      </div>

      {tiers.map((tier, index) => (
        <div
          key={tier.id}
          className="grid grid-cols-[76px_1fr_1fr_28px] items-center gap-3 border-t border-border-subtle py-2.5"
        >
          <span className="text-[12.5px] font-medium text-text-primary">
            {fill(c.tierName[k], { n: index + 1 })}
          </span>
          <span className="flex items-center gap-2">
            <NumberCell
              value={tier.days}
              label={`${fill(c.tierName[k], { n: index + 1 })} · ${c.daysBefore[k]}`}
              placeholder={c.daysPlaceholder[k]}
              onChange={(next) => update(tier.id, { days: next })}
            />
            <span className="text-[11.5px] text-text-muted">
              {c.daysBefore[k]}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <ChargeMenu
              charge={tier.charge}
              onPick={(kind) => update(tier.id, { charge: kind })}
            />
            {tier.charge === "free" || !tier.charge ? (
              <span className="text-sm text-text-muted">-</span>
            ) : (
              <NumberCell
                value={tier.value}
                decimal={tier.charge === "fixed"}
                label={fill(c.tierName[k], { n: index + 1 })}
                onChange={(next) => update(tier.id, { value: next })}
              />
            )}
          </span>
          <button
            type="button"
            onClick={() => remove(tier, index)}
            aria-label={c.removed[k]}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-surface-subtle"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      ))}

      {/* No-show is drawn like a tier but cannot be moved or removed. */}
      <div className="grid grid-cols-[76px_1fr_1fr_28px] items-center gap-3 border-t border-border-subtle py-2.5">
        <span className="text-[12.5px] font-medium text-text-primary">
          {c.noShow[k]}
        </span>
        <span className="text-[11.5px] text-text-muted">
          {isNew
            ? c.noShowRuleNew[k]
            : fill(c.noShowRule[k], { days: last?.days ?? "3" })}
        </span>
        <span className="flex items-center gap-2">
          <span className="flex h-9 min-w-[150px] items-center rounded-lg border border-border-subtle bg-surface-subtle px-2.5 text-sm text-text-secondary">
            {chargeKinds[2]!.label[k]}
          </span>
          <span className="font-data flex h-9 w-14 items-center justify-center rounded-lg border border-border-subtle bg-surface-subtle text-sm text-text-secondary">
            100
          </span>
        </span>
        <span className="text-[10px] leading-3 text-text-muted">
          {c.alwaysLast[k]}
        </span>
      </div>

      {/* OV 03.16D — a removed tier can come straight back. */}
      {removed && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-[12px] bg-surface-subtle px-3.5 py-2.5">
          <span className="text-[12.5px] text-text-body">
            {fill(c.removed[k], { n: removed.at + 1 })}
          </span>
          <button
            type="button"
            onClick={() => {
              setTiers((prev) => {
                const next = [...prev];
                next.splice(removed.at, 0, removed.tier);
                return next;
              });
              setRemoved(null);
            }}
            className="text-xs font-medium text-text-link hover:underline"
          >
            {c.undo[k]}
          </button>
        </div>
      )}
      {/* A season may carry a single tier; the contract policy may not. */}
      {!season && tiers.length < 2 && (
        <p className="mt-2 text-[11.5px] leading-4 text-status-warning">
          {c.minTiers[k]}
        </p>
      )}

      <div className="mt-3">
        {full ? (
          <p className="text-[11.5px] text-text-muted">{c.maxTiers[k]}</p>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setTiers((prev) => [
                ...prev,
                {
                  id: Math.max(0, ...prev.map((x) => x.id)) + 1,
                  days: "",
                  charge: "",
                  value: "",
                },
              ])
            }
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {c.addTier[k]}
          </Button>
        )}
      </div>

      {issues.length > 0 && (
        <ul className="mt-3 space-y-1">
          {issues.map((message) => (
            <li key={message} className="text-[12.5px] text-status-danger">
              {message}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-[11.5px] leading-5 text-text-muted">{c.note[k]}</p>
      {/* The season's own policy only wins inside its own dates. */}
      {season && (
        <p className="mt-3 rounded-[12px] bg-surface-subtle px-3.5 py-3 text-[11.5px] leading-5 text-text-body">
          {season.footer[k]}
        </p>
      )}
    </Drawer>
  );
}

/** OV 03.17 — a two-way switch on a tinted track, with its label and hint. */
function Segmented({
  label,
  hint,
  options,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  options: Array<[string, string]>;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
        {label}
      </p>
      <div className="mt-1.5 flex gap-1 rounded-[10px] bg-status-neutral-bg p-1">
        {options.map(([key, text]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={cn(
              "flex-1 rounded-lg py-2 text-center text-[12.5px] transition-colors",
              value === key
                ? "bg-surface-default font-medium text-brand-deep"
                : "text-text-body hover:bg-surface-default/60"
            )}
          >
            {text}
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-[11px] leading-4 text-text-muted">{hint}</p>
    </div>
  );
}

export function ReleaseDrawer({
  initial,
  onSave,
  onClose,
}: {
  initial?: ReleasePolicy | null;
  onSave?: (release: ReleasePolicy) => void;
  onClose: () => void;
}) {
  const { c: dict, lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const r = releaseDrawer;
  const p = dict.builder.form.policies;
  const [sameDay, setSameDay] = useState(initial?.period === "same_day");
  const [days, setDays] = useState(initial?.days || "3");
  const [time, setTime] = useState(initial?.time || "18:00");
  const [after, setAfter] = useState<AfterRelease>(initial?.afterRelease ?? "on_request");
  const [issues, setIssues] = useState<string[]>([]);

  const save = () => {
    const next: ReleasePolicy = {
      period: sameDay ? "same_day" : "days",
      days: sameDay ? "" : days,
      time,
      afterRelease: after,
    };
    const found = releaseIssues(next, dict.builder.form.v);
    setIssues(found);
    if (found.length > 0) return;
    onSave?.(next);
    onClose();
  };

  const fieldClass =
    "mt-1.5 h-11 w-full rounded-[10px] border border-border-strong bg-surface-default px-3 text-[13px] font-medium text-text-primary focus-visible:border-border-focus focus-visible:outline-none disabled:bg-surface-subtle disabled:text-text-muted";

  return (
    <Drawer
      width={DRAWER_WIDTH}
      overline={r.overline[k]}
      title={r.title[k]}
      meta={r.body[k]}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {r.cancel[k]}
          </Button>
          <Button onClick={save}>{r.confirm[k]}</Button>
        </>
      }
    >
      <Segmented
        label={r.periodLabel[k]}
        hint={r.periodHint[k]}
        value={sameDay ? "same" : "days"}
        onChange={(next) => setSameDay(next === "same")}
        options={[
          ["same", r.sameDay[k]],
          ["days", r.numberOfDays[k]],
        ]}
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
            {p.daysLabel}
          </span>
          <input
            inputMode="numeric"
            disabled={sameDay}
            value={sameDay ? "" : days}
            placeholder={sameDay ? r.daysValueSameDay[k] : ""}
            onChange={(event) => {
              const next = event.target.value;
              if (/^\d{0,3}$/.test(next)) setDays(next);
            }}
            className={fieldClass}
          />
          <span className="mt-1.5 block text-[11px] leading-4 text-text-muted">
            {sameDay ? p.sameDayHint : p.daysHint}
          </span>
        </label>
        <label className="block">
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
            {p.timeLabel}
          </span>
          <span className="relative block">
            <input
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className={fieldClass}
            />
            <Timer
              className="pointer-events-none absolute end-3 top-1/2 mt-[3px] h-3.5 w-3.5 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
          </span>
        </label>
      </div>

      <div className="mt-5">
        <Segmented
          label={r.afterLabel[k]}
          hint={r.afterHint[k]}
          value={after}
          onChange={(next) => setAfter(next as AfterRelease)}
          options={[
            ["stop_sale", r.stopSale[k]],
            ["on_request", r.switchRequest[k]],
          ]}
        />
      </div>
      {after === "stop_sale" && (
        <p className="mt-3 rounded-[12px] bg-surface-subtle px-3.5 py-3 text-[11.5px] leading-5 text-text-body">
          {r.stopSaleNote[k]}
        </p>
      )}

      {issues.length > 0 && (
        <ul className="mt-3 space-y-1">
          {issues.map((message) => (
            <li key={message} className="text-[12.5px] text-status-danger">
              {message}
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
