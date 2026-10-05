import { useEffect, useMemo, useState } from "react";
import { Check, Download, ShieldCheck } from "lucide-react";
import { Modal, Drawer } from "@/components/layout/overlay";
import { StatusPill, DataRow } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { exportRows } from "@/lib/export-rows";
import { notify } from "@/lib/notify";
import { useLanguage } from "@/lib/i18n";
import { usePortal } from "@/lib/portal-store";
import { roleDescriptions, roleNames, teamCopy, teamFill } from "@/lib/team-copy";
import {
  roleOrder,
  roleReach,
  roleReachAr,
  type ActivityEntry,
  type TeamMember,
  type TeamRole,
} from "@/lib/team-data";
import { useUpsertMember } from "@/api/modules/team/useUpsertMember";
import { useProfiles } from "@/api/modules/profile-permissions/userProfiles";

const statusTone = {
  active: "success",
  invited: "warning",
  expired: "danger",
  deactivated: "neutral",
} as const;

function RolePicker({ value, onChange }: { value: TeamRole; onChange: (role: TeamRole) => void }) {
  const { lang } = useLanguage();
  return (
    <div className="grid gap-1.5">
      {roleOrder
        .filter((r) => r !== "owner")
        .map((role) => (
          <button
            type="button"
            key={role}
            onClick={() => onChange(role)}
            className={`flex w-full gap-3 rounded-lg border p-3 text-start ${value === role ? "border-2 border-brand-deep bg-surface-subtle" : "border-border-default bg-surface-default"}`}
          >
            <span
              className={`mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border ${value === role ? "border-2 border-brand-deep" : "border-border-strong"}`}
            >
              {value === role && <span className="h-2 w-2 rounded-full bg-brand-deep" />}
            </span>
            <span>
              <b className="block text-[13px] font-medium text-text-primary">
                {roleNames[lang][role]}
              </b>
              <small className="block text-[11px] leading-[17px] text-text-muted">
                {roleDescriptions[lang][role]}
              </small>
            </span>
          </button>
        ))}
    </div>
  );
}

export function InviteDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang } = useLanguage();
  const t = teamCopy[lang];
  // const { inviteMember, addActivity } = usePortal();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("reservations");
  const [pick, setPick] = useState(false);
  const { mutate: saveMember, isPending } = useUpsertMember();

  // const { profiles, isLoading, refetch: refetchProfiles } = useProfiles();

  if (!open) return null;
  const reach = (lang === "ar" ? roleReachAr : roleReach)[role];
  const send = () => {
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      notify.error(t.emailHint);
      return;
    }

    // inviteMember({ name, nameAr: name, email, role });
    // saveMember({
    //   username: name,
    //   email,
    //   phoneNumber: "21963123123",
    //   role: "super_admin",
    //   permissionProfileIds: [1],
    // });

    // addActivity({
    //   id: `LOG-${Date.now()}`,
    //   when: "now",
    //   whenAr: "الآن",
    //   actor: "you",
    //   actorAr: "أنت",
    //   actorType: "team",
    //   role: "Owner",
    //   roleAr: "المالك",
    //   action: "Invited a person",
    //   actionAr: "دعا شخصًا",
    //   record: `${name} · ${roleNames.en[role]}`,
    //   recordAr: `${name} · ${roleNames.ar[role]}`,
    //   area: "users",
    // });

    notify.success(t.invitationSent, { description: t.invitationSentBody });
    onClose();
  };

  return (
    <Modal
      title={t.inviteTitle}
      meta={t.inviteIntro}
      onClose={onClose}
      className="max-w-[640px]"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button variant="dark" onClick={send}>
            {t.send}
          </Button>
        </>
      }
    >
      <div className="grid gap-4">
        <p className="text-overline text-text-muted">{t.who}</p>
        <Input label={t.fullName} value={name} onChange={(e) => setName(e.target.value)} />
        <Input
          label={t.workEmail}
          value={email}
          hint={t.emailHint}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="text-overline text-text-muted">{t.pickRole}</p>
        {pick ? (
          <RolePicker
            value={role}
            onChange={(v) => {
              setRole(v);
              setPick(false);
            }}
          />
        ) : (
          <div className="flex items-center gap-3 rounded-lg border-2 border-brand-deep bg-surface-subtle p-3">
            <div className="min-w-0 flex-1">
              <b className="text-sm text-text-primary">{roleNames[lang][role]}</b>
              <p className="text-xs text-text-muted">{roleDescriptions[lang][role]}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setPick(true)}>
              {t.pickAnother}
            </Button>
          </div>
        )}
        <div className="rounded-lg bg-surface-subtle p-4">
          <b className="text-sm text-text-primary">{teamFill(t.preview, { name })}</b>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {reach.map((item) => (
              <StatusPill key={item} tone="brand">
                {item}
              </StatusPill>
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-text-secondary">{t.previewNote}</p>
        </div>
        <div className="rounded-lg bg-surface-subtle p-3 text-xs leading-5 text-text-secondary">
          {t.inviteNote}
        </div>
      </div>
    </Modal>
  );
}

export function ManageMemberDrawer({
  member,
  onClose,
  onTransfer,
}: {
  member: TeamMember;
  onClose: () => void;
  onTransfer: () => void;
}) {
  const { lang } = useLanguage();
  const t = teamCopy[lang];
  const { updateMemberRole, setMemberStatus, addActivity } = usePortal();
  const [role, setRole] = useState(member.role);
  const [audit, setAudit] = useState(member.auditorReach ?? []);
  const [auditOpen, setAuditOpen] = useState(false);
  const save = () => {
    updateMemberRole(member.id, role, audit);
    addActivity({
      id: `LOG-${Date.now()}`,
      when: "now",
      whenAr: "الآن",
      actor: "you",
      actorAr: "أنت",
      actorType: "team",
      role: "Owner",
      roleAr: "المالك",
      action: "Changed what a person reaches",
      actionAr: "غيّر صلاحيات شخص",
      record: `${member.name} · ${roleNames.en[role]}`,
      recordAr: `${member.nameAr} · ${roleNames.ar[role]}`,
      area: "users",
    });
    notify.success(t.roleSaved);
    onClose();
  };
  const flip = () => {
    const next = member.status === "deactivated" ? "active" : "deactivated";
    setMemberStatus(member.id, next);
    notify.success(next === "active" ? t.accountReactivated : t.accountDeactivated);
    onClose();
  };
  const invitation = member.status === "invited" || member.status === "expired";
  return (
    <Drawer
      title={lang === "ar" ? member.nameAr : member.name}
      meta={member.email}
      onClose={onClose}
      width="600px"
      footer={
        member.isCurrent ? (
          <Button variant="outline" onClick={onTransfer}>
            {t.transfer}
          </Button>
        ) : invitation ? (
          <>
            <Button
              variant="danger"
              onClick={() => {
                setMemberStatus(member.id, "deactivated");
                notify.success(t.invitationCancelled);
                onClose();
              }}
            >
              {t.cancelInvitation}
            </Button>
            <Button
              variant="dark"
              onClick={() => {
                setMemberStatus(member.id, "invited");
                notify.success(t.invitationResent);
              }}
            >
              {t.resend}
            </Button>
          </>
        ) : (
          <>
            <Button variant="danger" onClick={flip}>
              {member.status === "deactivated" ? t.reactivate : t.deactivate}
            </Button>
            <Button variant="outline" onClick={onClose}>
              {t.cancel}
            </Button>
            <Button variant="dark" onClick={save}>
              {t.saveRole}
            </Button>
          </>
        )
      }
    >
      <div className="grid gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-deep font-semibold text-text-inverse">
            {member.name[0]}
          </span>
          <div className="flex flex-wrap gap-2">
            <StatusPill>{roleNames[lang][member.role]}</StatusPill>
            <StatusPill tone={statusTone[member.status]}>{t[member.status]}</StatusPill>
          </div>
        </div>
        <div className="rounded-lg border border-border-subtle px-4">
          <DataRow label={t.reachesNow}>
            <b className="text-xs">
              {(lang === "ar" ? roleReachAr : roleReach)[member.role].slice(0, 2).join(" · ")}
            </b>
          </DataRow>
          <DataRow label={t.lastSeen}>
            <b className="text-xs">{lang === "ar" ? member.lastSeenAr : member.lastSeen}</b>
          </DataRow>
          <DataRow label={t.addedBy}>
            <b className="text-xs">{member.addedBy}</b>
          </DataRow>
        </div>
        {!member.isCurrent && !invitation && (
          <>
            <p className="text-overline text-text-muted">{t.changeReach}</p>
            <RolePicker value={role} onChange={setRole} />
            {role === "auditor" && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-fit"
                  onClick={() => setAuditOpen(true)}
                >
                  {t.auditorReach}
                </Button>
                <AuditorDialog
                  open={auditOpen}
                  value={audit}
                  onChange={setAudit}
                  onClose={() => setAuditOpen(false)}
                />
              </>
            )}
          </>
        )}
      </div>
    </Drawer>
  );
}

export function AuditorDialog({
  open,
  value,
  onChange,
  onClose,
}: {
  open: boolean;
  value: string[];
  onChange: (value: string[]) => void;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const t = teamCopy[lang];
  if (!open) return null;
  const choices: Array<[string, string]> = [
    ["finance", t.financeReach],
    ["money", t.bookingMoney],
    ["guest", t.guestIdentity],
  ];
  return (
    <Modal
      title={t.auditorReach}
      meta={t.permissionsNote}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button variant="dark" onClick={onClose}>
            {t.saveReach}
          </Button>
        </>
      }
    >
      <div className="grid gap-2">
        {choices.map(([id, label]) => (
          <label
            key={id}
            className="flex items-center gap-3 rounded-lg border border-border-default p-3 text-sm"
          >
            <Checkbox
              checked={value.includes(id)}
              onCheckedChange={(v) => onChange(v ? [...value, id] : value.filter((x) => x !== id))}
            />
            <span>{label}</span>
          </label>
        ))}
        <div className="rounded-lg bg-surface-subtle p-4">
          <b className="text-xs text-text-primary">{t.alwaysSees}</b>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[
              "hotels.view",
              "contracts.view",
              "rates.view",
              "inventory.view",
              "bookings.view_operational",
              "users.view",
            ].map((x) => (
              <StatusPill key={x}>{x}</StatusPill>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function TransferDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang } = useLanguage();
  const t = teamCopy[lang];
  const { teamMembers, transferOwnership } = usePortal();
  const candidates = teamMembers.filter((m) => m.status === "active" && !m.isCurrent);
  const [id, setId] = useState(candidates[0]?.id ?? "");
  const selected = candidates.find((m) => m.id === id);
  if (!open) return null;
  return (
    <Modal
      title={t.transferTitle}
      meta={t.transferBody}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button
            variant="dark"
            disabled={!selected}
            onClick={() => {
              if (!selected) return;
              transferOwnership(selected.id);
              notify.success(t.transferred);
              onClose();
            }}
          >
            {t.confirmTransfer}
          </Button>
        </>
      }
    >
      <Select
        label={t.newOwner}
        value={id}
        onChange={setId}
        options={candidates.map((m) => ({
          value: m.id,
          label: lang === "ar" ? m.nameAr : m.name,
          hint: m.email,
        }))}
      />
      {selected && (
        <div className="mt-4 rounded-lg bg-status-warning-bg p-4 text-xs leading-5 text-text-secondary">
          <b className="block text-sm text-text-primary">{t.reviewTransfer}</b>
          {lang === "ar" ? selected.nameAr : selected.name} · {selected.email}
        </div>
      )}
    </Modal>
  );
}

export function PermissionReference({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang } = useLanguage();
  const t = teamCopy[lang];
  if (!open) return null;
  return (
    <Modal
      title={t.permissions}
      meta={t.permissionsNote}
      onClose={onClose}
      className="max-w-[820px]"
    >
      <div className="max-h-[65vh] overflow-y-auto rounded-lg border border-border-subtle">
        {roleOrder.map((role) => (
          <div
            key={role}
            className="grid gap-3 border-b border-border-subtle p-4 last:border-0 sm:grid-cols-[220px_1fr]"
          >
            <div>
              <b className="text-sm text-text-primary">{roleNames[lang][role]}</b>
              <p className="mt-1 text-xs text-text-muted">{roleDescriptions[lang][role]}</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(lang === "ar" ? roleReachAr : roleReach)[role].map((x) => (
                <StatusPill key={x}>{x}</StatusPill>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export function ActivityDetail({ entry, onClose }: { entry: ActivityEntry; onClose: () => void }) {
  const { lang } = useLanguage();
  const t = teamCopy[lang];
  return (
    <Drawer title={t.logDetail} meta={entry.id} onClose={onClose}>
      <div className="rounded-lg border border-border-subtle px-4">
        <DataRow label={t.actor}>
          <b>{lang === "ar" ? entry.actorAr : entry.actor}</b>
        </DataRow>
        <DataRow label={t.actorType}>
          <StatusPill>{entry.actorType}</StatusPill>
        </DataRow>
        <DataRow label={t.roleAtTime}>{lang === "ar" ? entry.roleAr : entry.role}</DataRow>
        <DataRow label={t.exactChange}>{lang === "ar" ? entry.actionAr : entry.action}</DataRow>
        <DataRow label={t.relatedRecord}>{lang === "ar" ? entry.recordAr : entry.record}</DataRow>
      </div>
    </Drawer>
  );
}

export function ActivityFilter({
  open,
  onClose,
  who,
  setWho,
  area,
  setArea,
  count,
}: {
  open: boolean;
  onClose: () => void;
  who: string;
  setWho: (v: string) => void;
  area: string;
  setArea: (v: string) => void;
  count: number;
}) {
  const { lang } = useLanguage();
  const t = teamCopy[lang];
  if (!open) return null;
  const options: Array<[string, string]> = [
    ["all", lang === "ar" ? "الجميع" : "Everyone"],
    ["team", lang === "ar" ? "فريقك" : "Your team"],
    ["hoteliana", "Hoteliana staff"],
    ["system", lang === "ar" ? "النظام" : "The system itself"],
    ["api", "A channel over the API"],
  ];
  const areas = ["all", "rates", "inventory", "bookings", "finance", "hotels", "users"];
  return (
    <Modal
      title={t.filterLog}
      meta={t.filterIntro}
      onClose={onClose}
      className="max-w-[900px]"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button variant="dark" onClick={onClose}>
            {teamFill(t.apply, { count })}
          </Button>
        </>
      }
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-overline text-text-muted">{t.whoFilter}</p>
          {options.map(([v, l]) => (
            <label
              key={v}
              className={`mb-1 flex cursor-pointer items-center gap-3 rounded-lg p-3 text-sm ${who === v ? "bg-surface-subtle" : ""}`}
            >
              <input type="radio" checked={who === v} onChange={() => setWho(v)} />
              {l}
            </label>
          ))}
        </div>
        <div>
          <p className="mb-2 text-overline text-text-muted">{t.area}</p>
          {areas.map((v) => (
            <label
              key={v}
              className={`mb-1 flex cursor-pointer items-center gap-3 rounded-lg p-3 text-sm ${area === v ? "bg-surface-subtle" : ""}`}
            >
              <input type="radio" checked={area === v} onChange={() => setArea(v)} />
              {v === "all" ? t.allAreas : v}
            </label>
          ))}
        </div>
      </div>
    </Modal>
  );
}

/** §0.4 — the shared export: the filtered rows, emailed when there are many. */
export function exportActivity(entries: ActivityEntry[], lang: string, email: string) {
  exportRows({
    head: ["ID", "When", "Actor", "Role", "Action", "Record", "Area"],
    rows: entries.map((e) => [e.id, e.when, e.actor, e.role, e.action, e.record, e.area]),
    filename: "hoteliana-activity-log.csv",
    lang,
    email,
  });
}
