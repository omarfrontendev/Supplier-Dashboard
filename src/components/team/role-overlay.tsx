import { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { ownerOnly, roleOverlay } from "@/lib/role-overlay-data";
import { cn } from "@/lib/utils";
import { useAvailableProfiles } from "@/api/modules/profile-permissions/userProfiles";
import { useForm } from "react-hook-form";
import { prpfileSchema } from "./form/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileFields } from "./form/fields";
import { Input } from "../ui/input";
import { useUpsertProfile } from "@/api/modules/profile-permissions/useUpsertProfiles";
import { useSingleRole } from "@/api/modules/profile-permissions/useSingleProfile";
import { PermissionProfile } from "@/api/modules/profile-permissions/types";

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
  "Night desk": ["See bookings", "See arrivals and guest details", "See guest identity"],
  Auditor: ["See hotels", "See contracts", "See rates", "See bookings", "See finance"],
};

export function RoleOverlay({
  // roleId,
  mode,
  roleName = "",
  copyFrom,
  people = 0,
  holder,
  onClose,
  // onSave,
  role,
}: {
  // roleId: string,
  mode: "create" | "edit";
  roleName?: string | undefined;
  /** The built-in role a Duplicate started from. */
  copyFrom?: string | undefined;
  people?: number | undefined;
  holder?: string | undefined;
  onClose: () => void;
  role: PermissionProfile;
  // onSave?: ((name: string, allowed: string[]) => void) | undefined;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = roleOverlay;

  const { profiles } = useAvailableProfiles();
  const { mutate: saveProfile, isPending } = useUpsertProfile();

  const [name, setName] = useState(roleName);
  // const [allowed, setAllowed] = useState<string[]>(COPIED[copyFrom ?? roleName] ?? []);
  const [allowed, setAllowed] = useState<string[]>(role?.permissionKeys || []);

  const toggle = (item: string) =>
    setAllowed((prev) =>
      prev.includes(item) ? prev.filter((one) => one !== item) : [...prev, item],
    );

  const gaps = [
    allowed.some((one) => /rates|inventory|Stop sale/i.test(one)) ? null : c.noRates[k],
    allowed.some((one) => /finance|money|statements|invoices/i.test(one)) ? null : c.noMoney[k],
    allowed.some((one) => /users|people|roles/i.test(one)) ? null : c.noPeople[k],
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

  // ======================================================================= //
  // ======================================================================= //
  // ======================================================================= //

  const form = useForm<any>({
    resolver: zodResolver(prpfileSchema()),
    defaultValues: {
      nameEn: role ? role?.nameEn : "",
      nameAr: role? role.nameAr : "",
    },
    mode: "all",
  });

  const allPermissionKeys = profiles.flatMap((profile: any) =>
    profile.methods.map((item: any) => item.key),
  );

  const toggleAllModules = () => {
    const allSelected = allPermissionKeys.every((key) => allowed.includes(key));

    if (allSelected) {
      setAllowed([]);
    } else {
      setAllowed(allPermissionKeys);
    }
  };

  const toggleModule = (module: string) => {
    const profile = profiles.find((profile: any) => profile.module === module);

    if (!profile) return;

    const moduleKeys = profile.methods.map((item: any) => item.key);

    const allSelected = moduleKeys.every((key: string) => allowed.includes(key));

    if (allSelected) {
      setAllowed((current) => current.filter((key) => !moduleKeys.includes(key)));
    } else {
      setAllowed((current) => [...new Set([...current, ...moduleKeys])]);
    }
  };

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
            disabled={allowed.length === 0 || isPending || !form.formState.isValid}
            onClick={() => {
              saveProfile(
                {
                  nameEn: form.getValues("nameEn"),
                  nameAr: form.getValues("nameAr"),
                  permissionKeys: allowed,
                },
                {
                  onSuccess: () => {
                    onClose();
                  },
                },
              );
            }}
            loading={isPending}
          >
            {mode === "edit" ? c.save[k] : c.create[k]}
          </Button>
        </>
      }
    >
      {profileFields().map(({ name, label, placeholder, type }) => (
        <Input
          label={label}
          placeholder={placeholder}
          type={type}
          autoComplete="new-password"
          error={form.formState.errors?.[name]?.message ?? ""}
          {...form.register(name)}
        />
      ))}

      {mode === "create" && (
        <div>
          <p className="text-overline text-text-muted">{c.startLabel[k]}</p>
          <div className="mt-1.5 flex h-11 w-full items-center rounded-[10px] border border-border-default bg-surface-default px-3.5 text-sm text-text-secondary">
            {copyFrom ? c.copyOf[k].replace("{role}", copyFrom) : c.startEmpty[k]}
          </div>
        </div>
      )}

      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={toggleAllModules}
          className="rounded-[10px] border border-border-default bg-surface-default px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-subtle"
        >
          {allPermissionKeys.every((key) => allowed.includes(key))
            ? "Deselect All"
            : "Select All Modules"}
        </button>
      </div>

      {profiles.map((profile) => {
        const moduleKeys = profile.methods.map((item) => item.key);

        const moduleSelected =
          moduleKeys.length > 0 && moduleKeys.every((key) => allowed.includes(key));

        return (
          <div key={profile.module}>
            <div className="flex items-center justify-between">
              <p className="text-overline text-text-muted">{profile.module}</p>

              <button
                type="button"
                onClick={() => toggleModule(profile.module)}
                className="text-sm font-medium text-brand-deep hover:underline"
              >
                {moduleSelected ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {profile.methods.map((item) => {
                const on = allowed.includes(item.key);

                return (
                  <button
                    key={item.key}
                    type="button"
                    aria-pressed={on}
                    title={ownerOnly.includes(item.key) ? c.ownerOnlyNote[k] : undefined}
                    onClick={() => toggle(item.key)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-[10px] border px-3 py-2 text-[13px] transition-colors",
                      on
                        ? "border-primary-subtle-border bg-primary-subtle text-text-primary"
                        : "border-border-default bg-surface-default text-text-primary hover:bg-surface-subtle",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-4 w-4 shrink-0 place-items-center rounded border",
                        on
                          ? "border-brand-deep bg-brand-deep text-text-inverse"
                          : "border-border-strong bg-surface-default",
                      )}
                    >
                      {on && <Check className="h-3 w-3" aria-hidden="true" />}
                    </span>

                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <p className="rounded-[10px] bg-surface-subtle px-3.5 py-3 text-[12.5px] leading-5 text-text-secondary">
        {note}
      </p>
    </IconModal>
  );
}
