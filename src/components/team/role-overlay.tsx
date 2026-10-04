import { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import {
  ownerOnly,
  permissionGroups,
  roleOverlay,
} from "@/lib/role-overlay-data";
import { cn } from "@/lib/utils";

/**
 * What each built-in role reaches, so Duplicate starts from something real.
 * Reservations is the set OV 08.21B ticks; the rest follow the role matrix
 * the Team page already prints.
 */
const COPIED: Record<string, string[]> = {
  Reservations: [
    "See bookings",
    "Confirm bookings",
    "Reject bookings",
    "See arrivals and guest details",
  ],
  "Revenue manager": [
    "See hotels",
    "See contracts",
    "See rates",
    "Edit rates",
    "Publish rates",
    "Edit inventory",
    "Stop sale",
  ],
  Finance: ["See finance", "See booking money", "Export finance"],
  /* The custom role OV 08.25 opens on. */
  "Night desk": [
    "See bookings",
    "See arrivals and guest details",
    "See guest identity",
  ],
  Auditor: [
    "See hotels",
    "See contracts",
    "See rates",
    "See bookings",
    "See finance",
  ],
};

export function RoleOverlay({
  mode,
  roleName = "",
  copyFrom,
  people = 0,
  holder,
  onClose,
  onSave,
}: {
  mode: "create" | "edit";
  roleName?: string | undefined;
  /** The built-in role a Duplicate started from. */
  copyFrom?: string | undefined;
  people?: number | undefined;
  holder?: string | undefined;
  onClose: () => void;
  onSave?: ((name: string, allowed: string[]) => void) | undefined;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = roleOverlay;

  const [name, setName] = useState(roleName);
  const [allowed, setAllowed] = useState<string[]>(
    COPIED[copyFrom ?? roleName] ?? []
  );

  const toggle = (item: string) =>
    setAllowed((prev) =>
      prev.includes(item) ? prev.filter((one) => one !== item) : [...prev, item]
    );

  const gaps = [
    allowed.some((one) => /rates|inventory|Stop sale/i.test(one))
      ? null
      : c.noRates[k],
    allowed.some((one) => /finance|money|statements|invoices/i.test(one))
      ? null
      : c.noMoney[k],
    allowed.some((one) => /users|people|roles/i.test(one))
      ? null
      : c.noPeople[k],
  ].filter(Boolean) as string[];

  const note =
    mode === "edit"
      ? c.editNote[k]
          .replace("{count}", people === 1 ? c.onePerson[k] : String(people))
          .replace("{who}", holder ?? "")
      : allowed.length === 0
        ? c.emptyNote[k]
        : c.tickedNote[k]
            .replace("{count}", String(allowed.length))
            .replace("{gaps}", gaps.join(lang === "ar" ? "، " : ", "));

  return (
    <IconModal
      width="612px"
      icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}
      overline={c.createOverline[k]}
      title={mode === "edit" ? c.editTitle[k] : c.createTitle[k]}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {c.cancel[k]}
          </Button>
          <Button
            disabled={allowed.length === 0 || !name.trim()}
            onClick={() => {
              onSave?.(name.trim(), allowed);
              onClose();
            }}
          >
            {mode === "edit" ? c.save[k] : c.create[k]}
          </Button>
        </>
      }
    >
      <div>
        <p className="text-overline text-text-muted">{c.nameLabel[k]}</p>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={c.namePlaceholder[k]}
          className="mt-1.5 h-11 w-full rounded-[10px] border border-border-default bg-surface-default px-3.5 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-brand-deep"
        />
      </div>

      {mode === "create" && (
        <div>
          <p className="text-overline text-text-muted">{c.startLabel[k]}</p>
          <div className="mt-1.5 flex h-11 w-full items-center rounded-[10px] border border-border-default bg-surface-default px-3.5 text-sm text-text-secondary">
            {copyFrom
              ? c.copyOf[k].replace("{role}", copyFrom)
              : c.startEmpty[k]}
          </div>
        </div>
      )}

      {permissionGroups.map((group) => (
        <div key={group.title.en}>
          <p className="text-overline text-text-muted">{group.title[k]}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {group.items.map((item) => {
              const on = allowed.includes(item.en);
              return (
                <button
                  key={item.en}
                  type="button"
                  aria-pressed={on}
                  title={
                    ownerOnly.includes(item.en) ? c.ownerOnlyNote[k] : undefined
                  }
                  onClick={() => toggle(item.en)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-[10px] border px-3 py-2 text-[13px] transition-colors",
                    on
                      ? "border-primary-subtle-border bg-primary-subtle text-text-primary"
                      : "border-border-default bg-surface-default text-text-primary hover:bg-surface-subtle"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-4 w-4 shrink-0 place-items-center rounded border",
                      on
                        ? "border-brand-deep bg-brand-deep text-text-inverse"
                        : "border-border-strong bg-surface-default"
                    )}
                  >
                    {on && <Check className="h-3 w-3" aria-hidden="true" />}
                  </span>
                  {item[k]}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <p className="rounded-[10px] bg-surface-subtle px-3.5 py-3 text-[12.5px] leading-5 text-text-secondary">
        {note}
      </p>
    </IconModal>
  );
}
