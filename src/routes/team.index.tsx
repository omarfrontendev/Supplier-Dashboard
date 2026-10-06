import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, UserPlus } from "lucide-react";
import { PageShell, StatusPill } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import {
  InviteDialog,
  ManageMemberDrawer,
  PermissionReference,
  TransferDialog,
} from "@/components/team/team-overlays";
import { Gated } from "@/components/system/permission-gate";
import { fill, useLanguage } from "@/lib/i18n";
import { RoleOverlay } from "@/components/team/role-overlay";
import { usePortal } from "@/lib/portal-store";
import { roleDescriptions, roleNames, teamCopy } from "@/lib/team-copy";
import {
  createdRole,
  roleCatalogue,
  roleOrder,
  roleReach,
  roleReachAr,
  roleTint,
  type RoleRow,
  type TeamMember,
  type TeamStatus,
} from "@/lib/team-data";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeam } from "@/store/features/team/teamThunk";
import { useProfiles } from "@/api/modules/profile-permissions/userProfiles";
import { PermissionProfile } from "@/api/modules/profile-permissions/types";
import { TableSkeleton } from "@/components/ui/skeletons";

export const Route = createFileRoute("/team/")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { tab?: "roles"; as?: "admin"; state?: "created" } => ({
    ...(search["tab"] === "roles" ? { tab: "roles" as const } : {}),
    ...(search["as"] === "admin" ? { as: "admin" as const } : {}),
    ...(search["state"] === "created" ? { state: "created" as const } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Team & Access · Hoteliana Supplier Portal" },
      {
        name: "description",
        content: "Manage supplier team members, invitations, roles, and account access.",
      },
      { property: "og:title", content: "Team & Access · Hoteliana Supplier Portal" },
      {
        property: "og:description",
        content: "Manage supplier team members, invitations, roles, and account access.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TeamPage,
});

const statusTone = {
  active: "success",
  invited: "warning",
  expired: "danger",
  deactivated: "neutral",
} as const;
function TeamPage() {
  const { lang } = useLanguage();
  const t = teamCopy[lang];
  /* A count reads in the digits of the language around it. */ const num = (value: number) =>
    value.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");
  const { teamMembers } = usePortal();
  const { tab, as, state } = Route.useSearch();
  const onRoles = tab === "roles";
  const asAdmin = as === "admin";

  const dispatch = useDispatch<any>();
  const { team, total } = useSelector((state: any) => state.team);

  const people = useMemo(
    () =>
      asAdmin
        ? teamMembers.map((m) =>
            m.id === "USR-008"
              ? {
                  ...m,
                  status: "active" as const,
                  roleLabel: undefined,
                  lastSeen: "you · now",
                  lastSeenAr: "أنت · الآن",
                  isCurrent: true,
                  inviteExpired: true,
                  reach: [t.adminReach],
                  reachAr: [t.adminReach],
                }
              : m.id === "USR-001"
                ? { ...m, isCurrent: false, lastSeen: "today 09:40", lastSeenAr: "اليوم ٠٩:٤٠" }
                : m,
          )
        : teamMembers,
    [asAdmin, teamMembers, t.adminReach],
  );
  // const roles = useMemo(
  //   () => (state === "created" ? [...roleCatalogue, createdRole] : roleCatalogue),
  //   [state],
  // );

  const [filter, setFilter] = useState<"all" | TeamStatus>("all");
  const [invite, setInvite] = useState(false);
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const [permissions, setPermissions] = useState(false);
  const [transfer, setTransfer] = useState(false);
  const { profiles: roles, isLoading, isError, refetch } = useProfiles();

  useEffect(() => {
    void dispatch(
      fetchTeam({
        page: 1, // API expects 1-based page
        limit: 10,
        isActive: filter === "active" ? true : filter === "all" ? null : false,
      }),
    );
  }, [dispatch, filter]);

  /* OV 08.21 / 08.21B / 08.25 — create, duplicate and edit a role. */ const [role, setRole] =
    useState<{ mode: "create" | "edit"; row?: RoleRow; copyFrom?: string } | null>(null);
  const visible = useMemo(
    () => (filter === "all" ? people : people.filter((m) => m.status === filter)),
    [people, filter],
  );
  const counts = {
    all: total,
    active: team.filter((m) => m.status === "active").length,
    invited: team.filter((m) => m.status === "invited").length,
    expired: team.filter((m) => m.status === "expired").length,
    deactivated: team.filter((m) => m.status === "deactivated").length,
  };
  const filters: Array<["all" | TeamStatus, string]> = [
    ["all", t.everyone],
    ["active", t.active],
    // ["invited", t.invited],
    // ["expired", t.expired],
    ["deactivated", t.deactivated],
  ];

  return (
    <PageShell>
      <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-overline text-text-muted">{t.overline}</p>
          <h1 className="mt-1 text-2xl font-semibold text-text-primary sm:text-[28px]">
            {t.title}
          </h1>
          <p className="mt-2 max-w-[840px] text-xs leading-5 text-text-secondary">
            {onRoles ? t.rolesSubtitle : asAdmin ? t.adminSubtitle : t.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/team/activity">
            <Button variant="outline">{t.activity}</Button>
          </Link>
          {onRoles ? (
            <Gated permission="users.change_role">
              <Button variant="dark" onClick={() => setRole({ mode: "create" })}>
                {t.createRole}
              </Button>
            </Gated>
          ) : (
            <Gated permission="users.invite">
              <Button variant="dark" onClick={() => setInvite(true)}>
                <UserPlus className="h-4 w-4" />
                {t.invite}
              </Button>
            </Gated>
          )}
        </div>
      </header>
      <div className="mb-5 flex gap-2 border-b border-border-subtle">
        <Link
          to="/team"
          search={{}}
          className={`-mb-px border-b-2 px-3 pb-3 text-sm ${onRoles ? "border-transparent text-text-muted" : "border-primary font-semibold text-text-primary"}`}
        >
          {t.peopleTab}
        </Link>
        <Link
          to="/team"
          search={{ tab: "roles" as const }}
          className={`-mb-px border-b-2 px-3 pb-3 text-sm ${onRoles ? "border-primary font-semibold text-text-primary" : "border-transparent text-text-muted"}`}
        >
          {t.rolesTab}
        </Link>
      </div>
      {onRoles ? (
        <RolesTab
          lang={lang}
          t={t}
          created={state === "created"}
          onEdit={(r) => setRole({ mode: "edit", row: r })}
          onDuplicate={(r) => setRole({ mode: "create", row: r, copyFrom: r.name })}
          roles={roles}
          isLoading={isLoading}
        />
      ) : (
        <>
          <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label={t.people} value={num(counts.active)} note={t.peopleNote} />
            <Metric
              label={t.owners}
              value={asAdmin ? t.adminOwnersValue : t.ownersValue}
              note={t.ownersNote}
              tone="brand"
            />
            <Metric
              label={t.invitations}
              value={t.invitationValue}
              note={asAdmin ? t.adminInvitationNote : t.invitationNote}
              tone="warn"
            />
            <Metric label={t.signed} value={num(3)} note={t.signedNote} />
          </div>
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="scrollbar-none flex gap-2 overflow-x-auto">
              {filters.map(([v, l]) => (
                <Button
                  key={v}
                  variant={filter === v ? "dark" : "outline"}
                  size="sm"
                  onClick={() => setFilter(v)}
                >
                  {l}
                  {v === "all" && (
                    <span
                      className={`rounded-full px-1.5 text-[10px] ${filter === v ? "bg-primary text-primary-foreground" : "bg-status-neutral-bg text-brand-deep"}`}
                    >
                      {num(counts[v])}
                    </span>
                  )}
                </Button>
              ))}
            </div>
            <p className="ms-auto text-xs text-text-muted">{t.outside}</p>
          </div>
          <section className="overflow-hidden rounded-lg border border-border-subtle bg-surface-default">
            <div className="hidden overflow-x-auto lg:block">
              <div className="min-w-[1180px]">
                <div className="grid grid-cols-[258px_158px_1fr_138px_118px_170px] gap-3 bg-surface-subtle px-4 py-3 text-overline text-text-muted">
                  <span>{t.person}</span>
                  <span>{t.role}</span>
                  <span>{t.reach}</span>
                  <span>{t.status}</span>
                  <span>{t.phoneNumber}</span>
                  <span />
                </div>
                {team.map((m) => (
                  <MemberRow key={m.id} member={m} lang={lang} t={t} open={() => setSelected(m)} />
                ))}
              </div>
            </div>
            <div className="grid gap-3 p-3 lg:hidden">
              {visible.map((m) => (
                <MemberCard key={m.id} member={m} lang={lang} t={t} open={() => setSelected(m)} />
              ))}
            </div>
          </section>
          <section className="mt-5 rounded-lg border border-border-subtle bg-surface-default p-5">
            <h2 className="text-base font-semibold text-text-primary">{t.roleMatrix}</h2>
            <p className="mt-1 text-xs text-text-muted">{t.roleMatrixNote}</p>
            <div className="mt-4 overflow-hidden rounded-lg border border-border-subtle">
              {roles.map((role) => (
                <div
                  key={role?.id}
                  className="grid gap-3 border-b border-border-subtle p-4 last:border-0 md:grid-cols-[330px_1fr]"
                >
                  <div>
                    <b className="text-sm text-text-primary">
                      {role?.[`name${lang === "en" ? "En" : "Ar"}`]}
                    </b>
                  </div>
                  <div className="flex flex-wrap gap-1.5 min-h-[60px]">
                    {role?.permissionKeys.slice(0, 5).map((item) => (
                      <ReachChip key={item} tint={"lime"} negative={item.startsWith("- ")}>
                        <div className="truncate max-w-[120px] px-2">{item}</div>
                      </ReachChip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3 rounded-lg bg-surface-subtle p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <b className="text-sm text-text-primary">{t.areasTitle}</b>
                <p className="mt-1 max-w-[620px] text-xs leading-5 text-text-secondary">
                  {t.areasBody}
                </p>
              </div>
              <Button variant="outline" onClick={() => setPermissions(true)}>
                <BookOpen className="h-4 w-4" />
                {t.permissionReference}
              </Button>
            </div>
          </section>
          <p className="mt-4 rounded-lg bg-surface-subtle p-4 text-xs leading-5 text-text-secondary">
            {t.footer}
          </p>
        </>
      )}
      <InviteDialog open={invite} onClose={() => setInvite(false)} roles={roles} />
      {selected && (
        <ManageMemberDrawer
          member={selected}
          onClose={() => setSelected(null)}
          onTransfer={() => {
            setSelected(null);
            setTransfer(true);
          }}
        />
      )}
      <PermissionReference open={permissions} onClose={() => setPermissions(false)} />
      <TransferDialog open={transfer} onClose={() => setTransfer(false)} />
      {role && (
        <RoleOverlay
          key={`${role.mode}-${role.copyFrom ?? role.row?.id ?? "new"}`}
          mode={role.mode}
          onClose={() => setRole(null)}
          {...(role.row
            ? {
                roleName: lang === "ar" ? role.row.nameAr : role.row.name,
                people: role.row.people,
                holder: "Layla Hassan",
              }
            : {})}
          {...(role.copyFrom ? { copyFrom: role.copyFrom } : {})}
          role={role.row}
          onSuccess={refetch}
        />
      )}
    </PageShell>
  );
}
function Metric({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  tone?: "brand" | "warn";
}) {
  return (
    <div
      className={`min-h-[97px] rounded-lg p-4 ${tone === "brand" ? "bg-primary-subtle" : tone === "warn" ? "bg-status-warning-bg" : "border border-border-subtle bg-surface-default"}`}
    >
      <p className="text-overline text-text-muted">{label}</p>
      <b className="mt-1 block text-2xl text-text-primary">{value}</b>
      <p className="mt-1 text-[10px] leading-4 text-text-secondary">{note}</p>
    </div>
  );
}
function Person({ m, lang }: { m: TeamMember; lang: "en" | "ar" }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="uppercase grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-brand-deep text-xs font-semibold text-text-inverse">
        {m.username?.[0]}
      </span>
      <div className="min-w-0">
        <b className="block truncate text-xs font-medium text-text-primary">{m.username}</b>
        <p className="truncate text-[11px] text-text-muted">{m.email}</p>
      </div>
    </div>
  );
}
function MemberRow({
  member: m,
  lang,
  t,
  open,
}: {
  member: TeamMember;
  lang: "en" | "ar";
  t: any;
  open: () => void;
}) {
  return (
    <div className="grid grid-cols-[258px_158px_1fr_138px_118px_170px] items-center gap-3 border-t border-border-subtle px-4 py-3">
      <Person m={m} lang={lang} />
      <div>
        <b className="text-xs text-text-primary">
          {/* {(lang === "ar" ? m.roleLabelAr : m.roleLabel) ?? roleNames[lang][m.role]} */}
          {m.role}
        </b>
        {/* {m.isCurrent && (
          <StatusPill className="mt-1" tone="brand">
            {m.role === "owner" ? t.youOwner : t.youLabel}
          </StatusPill>
        )}
        {!m.isCurrent && m.role === "owner" && (
          <StatusPill className="mt-1" tone="brand">
            {t.primaryOwner}
          </StatusPill>
        )}
        {m.status === "invited" && (
          <StatusPill className="mt-1" tone="warning">
            {t.invited}
          </StatusPill>
        )}
        {m.status === "expired" && (
          <StatusPill className="mt-1" tone="danger">
            {t.expired}
          </StatusPill>
        )} */}
      </div>
      <div className="flex flex-wrap gap-1">
        {/* {(lang === "ar" ? m.reachAr : m.reach).map((x) => (
          <StatusPill key={x}>{x}</StatusPill>
        ))} */}
      </div>
      <div>
        {/* <StatusPill tone={statusTone[m.status]}>{t[m.status]}</StatusPill> */}
        <StatusPill tone={statusTone[m.status]}>{t[m.status]}</StatusPill>
        {/* {(m.status === "expired" || m.inviteExpired) && (
          <p className="text-overline mt-1 text-status-danger">{t.inviteExpired}</p>
        )} */}
      </div>
      <span className="text-xs text-text-primary">{m.phoneNumber}</span>
      {/* <Button variant="outline" size="sm" onClick={open}>
        {m.isCurrent && m.role !== "owner"
          ? t.yourAccount
          : `${m.isCurrent || (m.role === "owner" && !m.isCurrent) ? t.viewPerson : t.manage} ${lang === "ar" ? m.nameAr.split(" ")[0] : m.name.split(" ")[0]}`}
      </Button> */}
    </div>
  );
}
function MemberCard({
  member: m,
  lang,
  t,
  open,
}: {
  member: TeamMember;
  lang: "en" | "ar";
  t: any;
  open: () => void;
}) {
  return (
    <article className="rounded-lg border border-border-subtle p-4">
      <div className="flex items-start justify-between gap-3">
        <Person m={m} lang={lang} />
        <StatusPill tone={statusTone[m.status]}>{t[m.status]}</StatusPill>
      </div>
      <p className="mt-4 text-sm font-semibold text-text-primary">
        {(lang === "ar" ? m.roleLabelAr : m.roleLabel) ?? roleNames[lang][m.role]}
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        {(lang === "ar" ? m.reachAr : m.reach).map((x) => (
          <StatusPill key={x}>{x}</StatusPill>
        ))}
      </div>
      <p className="mt-3 text-xs text-text-muted">{lang === "ar" ? m.lastSeenAr : m.lastSeen}</p>
      <Button className="mt-4 w-full" variant="outline" size="sm" onClick={open}>
        {t.manage}
      </Button>
    </article>
  );
}

/** UI 08.0 — the matrix tints each role's chips, and paints a limit red. */
const TINTS = {
  lime: "bg-[#edffd6]",
  blue: "bg-[#e8f1f8]",
  grey: "bg-[#eef1ee]",
  amber: "bg-[#fff6e6]",
} as const;

function ReachChip({
  tint,
  negative,
  children,
}: {
  tint: keyof typeof TINTS;
  negative: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] leading-[14px] ${negative ? "bg-[#fde9e7] text-[#a12b2b]" : `${TINTS[tint]} text-[#41544a]`}`}
    >
      {children}
    </span>
  );
}

function RolesTab({
  roles,
  lang,
  t,
  created,
  onEdit,
  onDuplicate,
  isLoading,
}: {
  roles: PermissionProfile | undefined;
  lang: "en" | "ar";
  t: any;
  created: boolean;
  onEdit: (r: RoleRow) => void;
  onDuplicate: (r: RoleRow) => void;
  isLoading: boolean;
}) {
  // const builtIn = roles.filter((r) => r.kind === "builtIn").length;
  // const custom = roles.length - builtIn;

  const formatDate = (date: string, lang: "en" | "ar") => {
    return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <>
      {created && (
        <div className="mb-4 rounded-lg border border-primary-subtle-border bg-primary-subtle p-4 text-xs text-text-primary">
          {fill(t.roleCreated, {
            name:
              lang === "ar"
                ? (roles[roles.length - 1]?.nameAr ?? "")
                : (roles[roles.length - 1]?.nameEn ?? ""),
          })}
        </div>
      )}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <section className="overflow-hidden rounded-lg border border-border-subtle bg-surface-default">
          <div className="hidden overflow-x-auto lg:block">
            <div className="min-w-[980px]">
              <div className="grid grid-cols-[120px_140px_280px_1fr_190px] gap-3 bg-surface-subtle px-4 py-3 text-overline text-text-muted">
                <span>{t.roleCol}</span>
                <span>{t.typeCol}</span>
                <span>{t.reach}</span>
                <span>{t.createdAt}</span>
                <span />
              </div>
              {roles.map((r) => (
                <div
                  key={r.id}
                  className="grid grid-cols-[120px_140px_280px_1fr_190px] items-center gap-3 border-t border-border-subtle px-4 py-3 text-xs"
                >
                  <b className="text-sm text-text-primary">{lang === "ar" ? r.nameAr : r.nameEn}</b>
                  <StatusPill
                    tone={r.kind === "custom" ? "brand" : "neutral"}
                    className="max-w-[100px]"
                  >
                    {r.kind === "custom" ? t.custom : t.builtIn}
                  </StatusPill>
                  <span className="text-text-secondary block truncate">
                    {r?.permissionKeys
                      ?.slice(0, 2)
                      .map((item) => item)
                      .join(", ") || "c.common.noRolesSelected"}
                  </span>
                  <span className="text-text-muted">{formatDate(r.createdAt, lang)}</span>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit(r)}>
                      {t.edit}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onDuplicate(r)}>
                      {t.duplicate}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3 p-3 lg:hidden">
            {roles.map((r) => (
              <article key={r.id} className="rounded-lg border border-border-subtle p-4">
                <div className="flex items-start justify-between gap-3">
                  <b className="text-sm text-text-primary">{lang === "ar" ? r.nameAr : r.nameEn}</b>
                  <StatusPill tone={r.kind === "custom" ? "brand" : "neutral"}>
                    {r.kind === "custom" ? t.custom : t.builtIn}
                  </StatusPill>
                </div>
                {/* <p className="mt-2 text-xs text-text-muted">
                  {r.people === 1 ? t.onePerson : fill(t.manyPeople, { count: r.people })}
                </p> */}
              </article>
            ))}
          </div>
          <div className="border-t border-border-subtle px-4 py-4 text-xs text-text-muted">
            {fill(t.rolesFooter, {
              total: roles.length,
              builtIn: 0,
              custom: roles.length,
              people: 0,
            })}
          </div>
        </section>
      )}
      <p className="mt-4 rounded-lg bg-surface-subtle p-4 text-xs leading-5 text-text-secondary">
        {t.footer}
      </p>
    </>
  );
}
