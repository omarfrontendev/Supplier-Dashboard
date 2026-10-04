/**
 * §0.5 "مخفي غير مقفول" — hidden, not disabled, as one component.
 *
 * A screen wraps the control it wants to gate and never decides for itself
 * what a refusal looks like:
 *
 *   • cannot see it  → nothing is drawn.
 *   • can see, cannot act → the control goes and a line takes its place,
 *     naming who can. Never a disabled button: §0.5 forbids one without an
 *     explanation, and an explanation beside a dead button is still a dead
 *     button.
 */

import type { ReactNode } from "react";
import { useMemo } from "react";
import { useLanguage } from "@/lib/i18n";
import { usePortal } from "@/lib/portal-store";
import { roleNames } from "@/lib/team-copy";
import {
  can,
  denyReason,
  permissionCatalogue,
  whoCan,
  type Ask,
  type DenyReason,
  type PermissionKey,
  type Viewer,
} from "@/lib/permissions";
import type { TeamRole } from "@/lib/team-data";

/** The person signed in, as the permission engine sees them. */
export function useViewer(): Viewer {
  const { teamMembers } = usePortal();
  const me = teamMembers.find((member) => member.isCurrent);
  return useMemo<Viewer>(
    () => ({
      role: (me?.role ?? "owner") as TeamRole,
      /* UI 08.0 — the Auditor's reach is a list of hotels, not everything. */
      hotels: me?.auditorReach?.length ? me.auditorReach : null,
      readOnly: me?.role === "auditor",
      suspended: me?.status === "deactivated",
    }),
    [me?.role, me?.auditorReach, me?.status]
  );
}

export function usePermission() {
  const viewer = useViewer();
  return useMemo(
    () => ({
      viewer,
      can: (key: PermissionKey, ask?: Ask) => can(viewer, key, ask),
      why: (key: PermissionKey, ask?: Ask) => denyReason(viewer, key, ask),
    }),
    [viewer]
  );
}

/** "Only the Owner or an Admin can publish rates." */
export function refusalLine(
  key: PermissionKey,
  reason: DenyReason,
  lang: string
): string {
  const ar = lang === "ar";
  const action = permissionCatalogue[key].label[ar ? "ar" : "en"].toLowerCase();

  if (reason === "account_suspended") {
    return ar
      ? "هذا الحساب موقوف. تواصل مع هوتيليانا."
      : "This account is suspended. Contact Hoteliana.";
  }
  if (reason === "out_of_scope") {
    return ar
      ? `لديك صلاحية ${action}، لكن ليس على هذا الفندق.`
      : `You can ${action}, but not on this hotel.`;
  }
  if (reason === "state_readonly" || reason === "entity_readonly") {
    return ar ? "هذا السجل للقراءة فقط." : "This record is read only.";
  }

  const names = whoCan(key).map((role) => roleNames[ar ? "ar" : "en"][role]);
  /* The Owner alone, then the short pairs, then a plain list. */
  const who =
    names.length === 1
      ? names[0]
      : names.length === 2
        ? ar
          ? `${names[0]} أو ${names[1]}`
          : `the ${names[0]} or an ${names[1]}`
        : ar
          ? `${names.slice(0, -1).join("، ")} أو ${names[names.length - 1]}`
          : `${names.slice(0, -1).join(", ")} or ${names[names.length - 1]}`;

  return ar ? `${who} وحده يستطيع ${action}.` : `Only ${who} can ${action}.`;
}

export function PermissionNote({
  permission,
  ask,
  className,
}: {
  permission: PermissionKey;
  ask?: Ask;
  className?: string;
}) {
  const { lang } = useLanguage();
  const viewer = useViewer();
  const reason = denyReason(viewer, permission, ask);
  if (!reason) return null;
  return (
    <p className={className ?? "text-xs leading-5 text-text-muted"}>
      {refusalLine(permission, reason, lang)}
    </p>
  );
}

export function Gated({
  permission,
  ask,
  children,
  /**
   * What the screen shows when the viewer may look but not act. Left out,
   * the refusal line is drawn - which is what §0.5 asks for by default.
   */
  instead,
  /** Set when not holding the key means the control is not drawn at all. */
  hideWhenDenied = false,
  className,
}: {
  permission: PermissionKey;
  ask?: Ask;
  children: ReactNode;
  instead?: ReactNode;
  hideWhenDenied?: boolean;
  className?: string;
}) {
  const { lang } = useLanguage();
  const viewer = useViewer();
  const reason = denyReason(viewer, permission, ask);

  if (!reason) return <>{children}</>;
  if (hideWhenDenied) return null;
  if (instead !== undefined) return <>{instead}</>;

  return (
    <p className={className ?? "text-xs leading-5 text-text-muted"}>
      {refusalLine(permission, reason, lang)}
    </p>
  );
}
