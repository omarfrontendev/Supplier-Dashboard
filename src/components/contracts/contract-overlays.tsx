import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { IconModal } from "@/components/layout/overlay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type {
  ConfirmPanel,
  ListPanel,
} from "@/lib/contract-overlay-data";

/**
 * OV 03.0G / 03.0L / 03.23B — a filter panel: grouped options, each with
 * what it would show, a note explaining the default, and Clear / Apply.
 */
export function FilterPanel({
  panel,
  onClose,
}: {
  panel: ListPanel;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const [picked, setPicked] = useState<string[]>([
    panel.groups[0]?.options[0]?.label ?? "",
  ]);

  const toggle = (label: string) =>
    setPicked((prev) =>
      prev.includes(label)
        ? prev.filter((x) => x !== label)
        : [...prev, label]
    );

  return (
    <IconModal
      overline={ar ? panel.overlineAr : panel.overline}
      title={ar ? panel.titleAr : panel.title}
      {...(panel.body ? { body: ar ? panel.bodyAr! : panel.body } : {})}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={() => setPicked([])}>
            {ar ? panel.cancelAr : panel.cancel}
          </Button>
          <Button onClick={onClose}>
            {ar ? panel.confirmAr : panel.confirm}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {panel.groups.map((group, index) => (
          <div key={group.label ?? index}>
            {group.label && (
              <p className="text-overline mb-2 text-text-muted">
                {ar ? group.labelAr : group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.options.map((option) => {
                const on = picked.includes(option.label);
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => toggle(option.label)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-start transition-colors",
                      on
                        ? "border-brand-deep bg-primary-subtle"
                        : "border-border-subtle hover:bg-surface-subtle"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                        on
                          ? "border-brand-deep bg-brand-deep text-text-inverse"
                          : "border-border-strong"
                      )}
                    >
                      {on && <Check className="h-3 w-3" aria-hidden="true" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-medium text-text-primary">
                        {ar ? option.labelAr : option.label}
                      </span>
                      {option.hint && (
                        <span className="mt-0.5 block text-[11px] text-text-muted">
                          {ar ? option.hintAr : option.hint}
                        </span>
                      )}
                    </span>
                    {option.count && (
                      <span className="font-data shrink-0 text-xs font-semibold text-text-secondary">
                        {ar ? option.countAr : option.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {panel.note && (
          <p className="text-xs leading-5 text-text-muted">
            {ar ? panel.noteAr : panel.note}
          </p>
        )}
      </div>
    </IconModal>
  );
}

/**
 * OV 03.0D / 03.0I / 03.0J — the panel that asks before an action that
 * changes what agents can see.
 */
export function ConfirmOverlay({
  panel,
  onClose,
  onConfirm,
  reasonPlaceholder,
  reasonLabel,
  requireTyped,
}: {
  panel: ConfirmPanel;
  onClose: () => void;
  onConfirm: () => void;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  /** OV 03.21 — terminate asks the word to be typed out. */
  requireTyped?: string;
}) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const [reason, setReason] = useState("");
  const [typed, setTyped] = useState("");

  return (
    <IconModal
      tone={panel.tone}
      icon={<Check className="h-5 w-5" aria-hidden="true" />}
      overline={ar ? panel.overlineAr : panel.overline}
      title={ar ? panel.titleAr : panel.title}
      body={ar ? panel.bodyAr : panel.body}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {ar ? panel.cancelAr : panel.cancel}
          </Button>
          <Button
            variant={panel.confirmTone ?? "default"}
            disabled={Boolean(requireTyped) && typed !== requireTyped}
            onClick={onConfirm}
          >
            {ar ? panel.confirmAr : panel.confirm}
          </Button>
        </>
      }
    >
      {panel.fields && (
        <div className="grid gap-3 sm:grid-cols-2">
          {panel.fields.map((field) => (
            <div
              key={field.label}
              className="rounded-[10px] border border-border-subtle bg-surface-subtle px-3.5 py-3"
            >
              <p className="text-overline text-text-muted">
                {ar ? field.labelAr : field.label}
              </p>
              <p className="mt-1 text-[12.5px] font-medium text-text-primary">
                {ar ? field.valueAr : field.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {panel.points && (
        <div className="space-y-1.5 rounded-[12px] bg-surface-subtle px-3.5 py-3">
          {panel.listLabel && (
            <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
              {ar ? panel.listLabelAr : panel.listLabel}
            </p>
          )}
          {panel.points.map((point) => (
            <p
              key={point.text}
              className="flex items-start gap-2 text-[12.5px] leading-5 text-text-body"
            >
              <ChevronRight
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted rtl:rotate-180"
                aria-hidden="true"
              />
              {ar ? point.textAr : point.text}
            </p>
          ))}
        </div>
      )}

      {reasonLabel && (
        <Input
          label={reasonLabel}
          placeholder={reasonPlaceholder ?? ""}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      )}

      {requireTyped && (
        <Input
          label={
            ar
              ? `اكتب ${requireTyped} للتأكيد`
              : `Type ${requireTyped} to confirm`
          }
          placeholder={requireTyped}
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
        />
      )}
    </IconModal>
  );
}

/**
 * OV 03.0G — the Need attention filter is drawn as a menu under its
 * field, not as a modal: the same rows, 380 wide, with its own footer.
 */
export function FilterMenu({
  panel,
  trigger,
  onApply,
}: {
  panel: ListPanel;
  trigger: React.ReactNode;
  onApply: () => void;
}) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const [picked, setPicked] = useState<string[]>(
    panel.groups.flatMap((group) => group.options.map((o) => o.label))
  );

  const toggle = (label: string) =>
    setPicked((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[380px] p-0">
        <div className="border-b border-border-subtle px-3.5 py-3">
          {panel.overline && (
            <p className="text-overline text-text-muted">
              {ar ? panel.overlineAr : panel.overline}
            </p>
          )}
          <p className="mt-0.5 text-sm font-semibold text-text-primary">
            {ar ? panel.titleAr : panel.title}
          </p>
        </div>
        <div className="space-y-1 p-2">
          {panel.groups.flatMap((group) => group.options).map((option) => {
            const on = picked.includes(option.label);
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => toggle(option.label)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-start hover:bg-surface-subtle"
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                    on
                      ? "border-brand-deep bg-brand-deep text-text-inverse"
                      : "border-border-strong"
                  )}
                >
                  {on && <Check className="h-3 w-3" aria-hidden="true" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium text-text-primary">
                    {ar ? option.labelAr : option.label}
                  </span>
                  {option.hint && (
                    <span className="mt-0.5 block text-[11px] text-text-muted">
                      {ar ? option.hintAr : option.hint}
                    </span>
                  )}
                </span>
                {option.count && (
                  <span className="font-data shrink-0 text-xs font-semibold text-text-secondary">
                    {ar ? option.countAr : option.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex justify-end gap-2 border-t border-border-subtle px-3.5 py-3">
          <Button variant="outline" size="sm" onClick={() => setPicked([])}>
            {ar ? panel.cancelAr : panel.cancel}
          </Button>
          <Button size="sm" onClick={onApply}>
            {ar ? panel.confirmAr : panel.confirm}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
