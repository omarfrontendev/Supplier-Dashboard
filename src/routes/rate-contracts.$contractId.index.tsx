import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  Check,
  Clock3,
  Layers3,
  MoreHorizontal,
  Plus,
  Search,
  ShieldAlert,
} from "lucide-react";
import { BackLink, Banner, PageShell, StatusPill } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChoiceRow,
  RoomGroup,
  Section,
  Table,
} from "@/components/contracts/contract-parts";
import { hotels } from "@/lib/demo-data";
import {
  BASE_WEEKDAY,
  BASE_WEEKEND,
  MONTHS,
  childBands,
  contractRestrictions,
  contractRooms,
  contractModes,
  contractStateViews,
  mealPlans,
  rateSeasons,
  seasonPolicies,
} from "@/lib/contract-data";
import { fill, useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { usePortal } from "@/lib/portal-store";
import { notify, wait } from "@/lib/notify";
import { ContractException } from "@/components/exceptions/contract-exception";
import {
  CancellationDrawer,
  ReleaseDrawer,
} from "@/components/contracts/policy-overlays";
import {
  seasonPolicyFor,
  type SeasonPolicy,
} from "@/lib/policy-overlay-data";
import { SeasonDetailPanel } from "@/components/contracts/season-detail";
import { SeasonPage } from "@/components/contracts/season-page";
import {
  seasonDetails,
  type SeasonDetail,
} from "@/lib/season-detail-data";
import {
  DeleteRestrictionOverlay,
  RestrictionDrawer,
} from "@/components/contracts/restriction-overlays";
import {
  ActivityDrawer,
  AmendOverlay,
  LifecycleDialogOverlay,
  PublishDrawer,
} from "@/components/contracts/lifecycle-overlays";
import {
  discardDialog,
  pauseDialog,
  terminateDialog,
} from "@/lib/contract-lifecycle-data";
import type { ContractExceptionState } from "@/lib/business-exception-data";

export const Route = createFileRoute("/rate-contracts/$contractId/")({
  validateSearch: (
    search: Record<string, unknown>
  ): {
    mode?: "edit" | "changes" | "published" | "amending";
    exception?: ContractExceptionState;
  } => ({
    ...(["edit", "changes", "published", "amending"].includes(
      String(search["mode"])
    )
      ? {
          mode: search["mode"] as
            | "edit"
            | "changes"
            | "published"
            | "amending",
        }
      : {}),
    ...(["ending", "ended", "paused", "terminated"].includes(
      String(search["exception"])
    )
      ? { exception: search["exception"] as ContractExceptionState }
      : {}),
  }),
  head: () => ({
    meta: [
      { title: "Supply contract · Hoteliana Supplier Portal" },
      {
        name: "description",
        content: "Supply contract details, rates, inventory and policies.",
      },
      {
        property: "og:title",
        content: "Supply contract · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content: "Supply contract details, rates, inventory and policies.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContractDetailPage,
});

const stateLabel = {
  active: ["Active", "نشط"],
  scheduled: ["Scheduled", "مجدول"],
  draft: ["Draft", "مسودة"],
  paused: ["Paused", "متوقف مؤقتًا"],
  expired: ["Expired", "منتهي"],
  terminated: ["Terminated", "تم إنهاؤه"],
  attention: ["Needs attention", "يحتاج انتباهك"],
} as const;

const stateTone = {
  active: "success",
  scheduled: "info",
  draft: "neutral",
  paused: "warning",
  expired: "neutral",
  terminated: "danger",
  attention: "warning",
} as const;

/** The banner actions Figma gives each contract state. */
function stateActions(state: string, lang: "en" | "ar") {
  if (state === "paused") return [lang === "ar" ? "استئناف العقد" : "Resume contract"];
  if (state === "expired")
    return [lang === "ar" ? "نسخ لفترة جديدة" : "Copy to new period"];
  if (state === "terminated") return [];
  if (state === "active")
    return [
      lang === "ar" ? "نسخ لفترة جديدة" : "Copy to new period",
      lang === "ar" ? "تمديد المدة · تعديل تعاقدي" : "Extend term · Amend",
    ];
  return [];
}

/** Read-only view of a supply contract — Figma UI 03.3 and its state siblings. */
function ContractDetailPage() {
  const { contractId } = Route.useParams();
  const { mode, exception } = Route.useSearch();
  const { c, lang } = useLanguage();
  const { contracts, setContractState } = usePortal();
  const [action, setAction] = useState<"pause" | "resume" | "terminate" | null>(null);
  const [working, setWorking] = useState(false);
  const [query, setQuery] = useState("");
  /* UI 03.3B / 03.3BN — edit mode can drop the rules and the policy. */
  const [hasRestrictions, setHasRestrictions] = useState(true);
  const [hasPolicies, setHasPolicies] = useState(true);
  /* OV 03.3A / 03.3C / 03.3D / 03.22 — the drawers and dialogs. */
  const [drawer, setDrawer] = useState<"activity" | "publish" | "amend" | "discard" | null>(null);
  const [policy, setPolicy] = useState<"cancellation" | "release" | null>(null);
  const [ruleDrawer, setRuleDrawer] = useState<"add" | "edit" | "delete" | null>(null);
  const [seasonPolicy, setSeasonPolicy] = useState<SeasonPolicy | null>(null);
  const [seasonDetail, setSeasonDetail] = useState<SeasonDetail | null>(null);
  const detailFor = (name: string) =>
    seasonDetails.find((x) => x.name.en === name) ?? null;
  /* OV 03.12 — Edit season opens the season editor itself. */
  const [seasonEditor, setSeasonEditor] = useState<SeasonDetail | null>(null);

  const contract = contracts.find((item) => item.id === contractId);
  /* OV 03.12B - the contract's pricing model, which its seasons follow. */
  const fixedPrice = contract?.pricing === "fixed";
  if (!contract) throw notFound();

  const t = c.detail;
  const b = c.builder;
  if (exception)
    return (
      <PageShell>
        <BackLink to="/rate-contracts" label={b.back} />
        <ContractException state={exception} ar={lang === "ar"} />
      </PageShell>
    );
  const hotel = hotels.find((h) => h.id === contract.hotelId);
  const hotelName = hotel ? (lang === "ar" ? hotel.nameAr : hotel.nameEn) : "—";
  const view = contractStateViews[contract.id];
  const modeView = mode ? contractModes[mode] : undefined;
  const editing = mode === "edit" || mode === "changes";
  const changesOnly = mode === "changes";
  const stats = view?.stats ?? contractStateViews["SC-2026-0142"]!.stats;
  const readOnly =
    contract.state === "expired" || contract.state === "terminated";

  const onSale = contractRooms.filter((room) => room.onSale);
  const roomTypes = new Set(onSale.map((room) => room.type)).size;
  const priceMeals = mealPlans.filter((meal) => meal.included);
  const seasons = rateSeasons.filter((season) => !season.base);
  const baseNights = rateSeasons.find((season) => season.base)?.nights ?? 0;

  const term = query.trim().toLowerCase();
  const searched = onSale.filter(
    (room) =>
      !term ||
      `${room.type} ${room.view}`.toLowerCase().includes(term) ||
      `${room.typeAr} ${room.viewAr}`.includes(term)
  );
  const grouped = [
    ...searched
      .reduce((map, room) => {
        map.set(room.type, [...(map.get(room.type) ?? []), room]);
        return map;
      }, new Map<string, typeof searched>())
      .entries(),
  ];

  const menu =
    lang === "ar"
      ? {
          pause: "إيقاف العقد مؤقتًا",
          resume: "استئناف العقد",
          terminate: "إنهاء العقد",
          amend: "تعديل تجاري · إصدار جديد",
          duplicate: "نسخ العقد",
          confirm: "تأكيد الإجراء",
          cancel: "إلغاء",
          body: "سيتم تحديث حالة العقد فورًا. الحجوزات المؤكدة لن تتأثر.",
        }
      : {
          pause: "Pause contract",
          resume: "Resume contract",
          terminate: "Terminate contract",
          amend: "Amend · new version",
          duplicate: "Duplicate contract",
          confirm: "Confirm action",
          cancel: "Cancel",
          body: "The contract status will update immediately. Confirmed bookings remain unaffected.",
        };

  const commit = async () => {
    if (!action) return;
    setWorking(true);
    await wait(400);
    setContractState(
      contract.id,
      action === "pause" ? "paused" : action === "resume" ? "active" : "terminated"
    );
    setWorking(false);
    setAction(null);
    notify.success(
      action === "pause" ? menu.pause : action === "resume" ? menu.resume : menu.terminate
    );
  };

  return (
    <PageShell>
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center">
        <BackLink to="/rate-contracts" label={b.back} />
        <div className="min-w-0 flex-1">
          <p className="text-overline text-brand-mid">{t.overline}</p>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-text-primary">
              {lang === "ar" ? contract.nameAr : contract.name}
            </h1>
            <StatusPill tone={stateTone[contract.state]}>
              {stateLabel[contract.state][lang === "ar" ? 1 : 0]}
              {mode === "amending" && (lang === "ar" ? " · قيد التعديل" : " · amending")}
            </StatusPill>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDrawer("activity")}
            >
              <Layers3 className="h-3.5 w-3.5" aria-hidden="true" />
              {fill(t.version, { version: mode === "amending" ? "v1.4 draft" : contract.version })}
            </Button>
          </div>
          <p className="mt-1 text-xs text-text-secondary">
            {fill(t.meta, {
              hotel: hotelName,
              term: lang === "ar" ? contract.datesAr : contract.dates,
              type: contract.model === "instant" ? b.typeBlock : b.typeRequest,
              currency: "SAR",
              version: contract.version,
            })}
            {view && ` · ${lang === "ar" ? view.metaAr : view.meta}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {contract.model === "onRequest" && !readOnly && (
            <Link to="/rate-contracts/$contractId/queue" params={{ contractId: contract.id }}>
              <Button variant="outline">
                {lang === "ar" ? "طابور الطلبات" : "On Request queue"}
              </Button>
            </Link>
          )}
          {!readOnly && contract.state !== "paused" && !modeView && (
            <Link to="/rate-contracts/$contractId/edit" params={{ contractId: contract.id }}>
              <Button variant="outline">{t.editSettings}</Button>
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="More actions">
                <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/rate-contracts/new" search={{ source: contract.id }}>
                  {menu.duplicate}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDrawer("amend")}>
                {menu.amend}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {contract.state === "paused" ? (
                <DropdownMenuItem onSelect={() => setAction("resume")}>
                  {menu.resume}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onSelect={() => setAction("pause")}>
                  {menu.pause}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-status-danger"
                onSelect={() => setAction("terminate")}
              >
                {menu.terminate}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {(modeView ?? view?.banner) && (
        <Banner
          tone={(modeView ?? view!.banner!).tone}
          icon={<AlertTriangle className="h-5 w-5" aria-hidden="true" />}
          title={
            lang === "ar"
              ? (modeView ?? view!.banner!).titleAr
              : (modeView ?? view!.banner!).title
          }
          body={
            lang === "ar"
              ? (modeView ?? view!.banner!).bodyAr
              : (modeView ?? view!.banner!).body
          }
          action={
            <div className="flex flex-wrap gap-2">
              {(lang === "ar"
                ? (modeView?.actionsAr ?? stateActions(contract.state, lang))
                : (modeView?.actions ?? stateActions(contract.state, lang))
              ).map((label, index) => {
                const button = (
                  <Button variant={index === 0 && modeView ? "outline" : "default"}>
                    {label}
                  </Button>
                );
                if (index === 1 && editing) {
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setDrawer("discard")}
                    >
                      {button}
                    </button>
                  );
                }
                if (index === 2 && editing) {
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setDrawer("publish")}
                    >
                      {button}
                    </button>
                  );
                }
                if (index === 0 && editing) {
                  return (
                    <Link
                      key={label}
                      to="/rate-contracts/$contractId"
                      params={{ contractId: contract.id }}
                      search={{ mode: changesOnly ? "edit" : "changes" }}
                    >
                      {button}
                    </Link>
                  );
                }
                return <span key={label}>{button}</span>;
              })}
            </div>
          }
        />
      )}

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <MiniStat
            key={stat.label}
            icon={<Check />}
            label={lang === "ar" ? stat.labelAr : stat.label}
            value={stat.value}
            hint={lang === "ar" ? stat.hintAr : stat.hint}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[264px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl bg-brand-deep p-4 text-text-inverse xl:sticky xl:top-24">
          <p className="text-overline text-primary">{t.editAmendOverline}</p>
          <p className="mt-2 text-xs leading-5">{t.editLine}</p>
          <p className="mt-2 text-xs leading-5 text-white/70">{t.amendLine}</p>
        </aside>

        <div className="min-w-0 space-y-4">
          {!changesOnly && (
            <>
            <Section done id={1} title={b.sections[0]!} body={t.basicsBody}>
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  [b.hotel, `${hotelName} · ${hotel?.city ?? ""} · ${hotel?.stars ?? ""}★ Official`],
                  [b.name, lang === "ar" ? contract.nameAr : contract.name],
                  [b.type, contract.model === "instant" ? b.typeBlock : b.typeRequest],
                  [
                    b.term,
                    /* UI 03.22B — the draft already carries the longer term. */
                    mode === "amending"
                      ? lang === "ar"
                        ? t.amendedTermAr
                        : t.amendedTerm
                      : lang === "ar"
                        ? contract.datesAr
                        : contract.dates,
                    mode === "amending" ? t.amendedTermNote : t.lockedNote,
                  ],
                  [b.currency, "SAR · Saudi Riyal", t.lockedNote],
                  [b.weekend, "Thu · Fri"],
                ].map(([label, value, note]) => (
                  <div key={label}>
                    <dt className="text-overline text-text-muted">{label}</dt>
                    <dd className="mt-1 text-sm font-medium text-text-primary">
                      {value}
                    </dd>
                    {note && <p className="mt-1 text-xs text-text-muted">{note}</p>}
                  </div>
                ))}
              </dl>
            </Section>
            </>
          )}

          <Section
            done
            id={2}
            title={b.sections[1]!}
            body={
              changesOnly
                ? t.baseOfferBody
                : fixedPrice
                  ? b.pricingBodyFilledFixed
                  : b.pricingBodyFilled
            }
          >
            {!changesOnly && (
              <>
                <p className="text-overline text-text-muted">{t.pricingFixed}</p>
                <p className="mt-1 text-sm font-medium text-text-primary">
                  {/* The contract's own model, not an assumption about it. */}
                  {fixedPrice ? b.modelFixed : b.modelSupplements}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  {editing
                    ? t.heldChange
                    : fixedPrice
                      ? t.pricingFixedNoteFixed
                      : t.pricingFixedNote}
                </p>
              </>
            )}
            <Table
              head={[b.colRoom, b.colMeal, b.colView, b.colWeekday, b.colWeekend]}
              rows={[
                [
                  "Standard Room",
                  "Room Only",
                  "City",
                  editing
                    ? fill(t.changedPrice, {
                        from: BASE_WEEKDAY,
                        to: BASE_WEEKDAY + 20,
                      })
                    : `${BASE_WEEKDAY} SAR`,
                  `${BASE_WEEKEND} SAR`,
                ],
              ]}
            />
          </Section>

          {!changesOnly && (
            <>
            <Section
              done
              id={3}
              title={b.sections[2]!}
              body={b.roomsBody}
              right={
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  {b.requestRoom}
                </Button>
              }
            >
              <p className="text-sm font-medium text-text-primary">{b.weekTitle}</p>
              <p className="mt-1 text-sm text-text-secondary">{b.weekSplit}</p>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">
                {b.weekHint}
              </p>
              <Table
                head={["", b.colRoom, b.colSupplement, b.colSells]}
                rows={contractRooms.map((room) => [
                  room.onSale ? "✓" : "",
                  `${lang === "ar" ? room.typeAr : room.type} · ${lang === "ar" ? room.viewAr : room.view}`,
                  !room.onSale ? "-" : room.base ? b.baseRoom : `+ ${room.supplement} SAR`,
                  !room.onSale
                    ? "-"
                    : `${BASE_WEEKDAY + room.supplement} / ${BASE_WEEKEND + room.supplement} SAR`,
                ])}
              />
            </Section>

            <Section done id={4} title={b.sections[3]!} body={b.childrenBody}>
              <Table
                head={["", b.colChild, b.colBasis, b.colSameNight]}
                rows={childBands.map((band) => [
                  band.included ? "✓" : "",
                  lang === "ar" ? band.labelAr : band.label,
                  lang === "ar" ? band.basisAr : band.basis,
                  lang === "ar" ? band.supplementAr : band.supplement,
                ])}
              />
            </Section>

            <Section done id={5} title={b.sections[4]!} body={b.mealsBody}>
              <Table
                head={["", b.colMealPlan, b.colBasis, b.colSameNight]}
                rows={mealPlans.map((meal) => [
                  meal.included ? "✓" : "",
                  lang === "ar" ? meal.nameAr : meal.name,
                  lang === "ar" ? meal.basisAr : meal.basis,
                  meal.supplement === null ? "-" : `+ ${meal.supplement} SAR`,
                ])}
              />

              <div className="mt-6">
                <p className="text-sm font-semibold text-text-primary">
                  {b.priceListTitle}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-text-muted">
                  {b.priceListBody}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text-muted">
                  <StatusPill tone="neutral">
                    {fill(b.priceListRooms, { count: onSale.length })}
                  </StatusPill>
                  <StatusPill tone="neutral">
                    {fill(b.priceListTypes, { count: roomTypes })}
                  </StatusPill>
                  <StatusPill tone="brand">
                    {fill(b.priceListFrom, { amount: BASE_WEEKDAY })}
                  </StatusPill>
                  <span>{b.priceListBase}</span>
                </div>
                <div className="relative mt-3 max-w-xs">
                  <Search
                    className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted start-3"
                    aria-hidden="true"
                  />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={b.priceListSearch}
                    className="h-10 w-full rounded-lg border border-border-default bg-surface-default ps-9 pe-3 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-border-focus focus-visible:outline-none"
                  />
                </div>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-sm">
                    <thead>
                      <tr className="text-overline text-text-muted">
                        <th className="py-2 text-start font-semibold">
                          {b.colRoomView}
                        </th>
                        {priceMeals.map((meal) => (
                          <th key={meal.name} className="py-2 text-end font-semibold">
                            {lang === "ar" ? meal.nameAr : meal.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {grouped.map(([type, rows]) => (
                        <RoomGroup
                          key={type}
                          label={fill(b.roomGroup, {
                            room: lang === "ar" ? rows[0]!.typeAr : type,
                            views:
                              rows.length === 1
                                ? b.oneView
                                : fill(b.views, { count: rows.length }),
                            guests: rows[0]!.guests,
                          })}
                          rows={rows}
                          meals={priceMeals}
                          lang={lang}
                          t={b}
                        />
                      ))}
                      {contractRooms
                        .filter((room) => !room.onSale)
                        .map((room) => (
                          <tr
                            key={`${room.type}-off`}
                            className="border-t border-border-subtle"
                          >
                            <td
                              colSpan={priceMeals.length + 1}
                              className="py-3 text-xs text-text-muted"
                            >
                              {fill(b.notOnSale, {
                                room: `${lang === "ar" ? room.typeAr : room.type} · ${lang === "ar" ? room.viewAr : room.view}`,
                              })}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>
            </>
          )}

          <Section
            done
            id={6}
            title={b.sections[5]!}
            body={fill(t.inventoryBody, { stock: contract.allotment })}
            right={
              <Link to="/rate-calendar" search={{ contract: contract.id }}>
                <Button variant="outline" size="sm">
                  {t.openRates}
                </Button>
              </Link>
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border-subtle p-4">
                <p className="text-sm font-medium text-text-primary">
                  {fill(t.poolValue, { stock: contract.allotment })}
                </p>
                <p className="mt-1 text-sm text-text-secondary">{t.poolSplit}</p>
                <p className="mt-1 text-xs text-text-muted">{t.poolNote}</p>
              </div>
              <div className="rounded-xl border border-border-subtle p-4">
                <p className="text-overline text-text-muted">{b.soldOut}</p>
                <p className="mt-1.5 text-sm font-medium text-text-primary">
                  {fill(t.soldOutValue, { limit: contract.overbooking ?? 2 })}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  {fill(t.soldOutNote, { limit: contract.overbooking ?? 2 })}
                </p>
              </div>
            </div>
          </Section>

          {!changesOnly && (
            <>
            <Section
              done
              id={7}
              title={b.sections[6]!}
              body={fill(t.seasonsBody, {
                nights: baseNights,
                count: seasons.length,
              })}
              right={
                editing ? (
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    {b.addSeason}
                  </Button>
                ) : undefined
              }
            >
              <div className="overflow-x-auto">
                <div className="grid min-w-[640px] grid-cols-12 gap-1">
                  {MONTHS.map((month) => (
                    <span
                      key={month}
                      className="rounded bg-surface-subtle py-1 text-center text-[10px] font-semibold text-text-muted"
                    >
                      {month}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <thead>
                    <tr className="text-overline text-text-muted">
                      {[
                        b.colSegment,
                        b.colDates,
                        b.colNights,
                        b.colRule,
                        b.colResult,
                        "",
                      ].map((cell, index) => (
                        <th
                          key={cell || index}
                          className={cn(
                            "py-2 font-semibold",
                            index === 5 ? "text-end" : "text-start"
                          )}
                        >
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rateSeasons.map((season) => (
                      <tr
                        key={season.name}
                        className="border-t border-border-subtle"
                      >
                        <td className="py-2.5 pe-3 text-text-secondary">
                          {lang === "ar" ? season.nameAr : season.name}
                        </td>
                        <td className="py-2.5 pe-3 text-text-secondary">
                          {season.base
                            ? b.everyNight
                            : lang === "ar"
                              ? season.datesAr
                              : season.dates}
                        </td>
                        <td className="font-data py-2.5 pe-3 text-text-secondary">
                          {season.nights}
                        </td>
                        <td className="py-2.5 pe-3 text-text-secondary">
                          {lang === "ar" ? season.ruleAr : season.rule}
                        </td>
                        <td className="font-data py-2.5 pe-3 text-text-secondary">
                          {season.result}
                        </td>
                        <td className="py-2.5 text-end">
                          {/* OV 03.14 - 03.17 — the season's own nights. */}
                          {!season.base && (
                            <button
                              type="button"
                              onClick={() =>
                                setSeasonDetail(detailFor(season.name))
                              }
                              className="text-xs font-medium text-text-link hover:underline"
                            >
                              {b.edit}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
            </>
          )}

          {!changesOnly && (
            <>
            <Section
              done
              id={8}
              title={b.sections[7]!}
              body={b.restrictionsBody}
              right={
                editing && hasRestrictions ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRuleDrawer("add")}
                  >
                    {b.addRestriction}
                  </Button>
                ) : undefined
              }
            >
              {editing && (
                <ChoiceRow
                  value={hasRestrictions ? "add" : "none"}
                  onChange={(next) => setHasRestrictions(next === "add")}
                  options={[
                    { value: "add", label: b.addToContract },
                    { value: "none", label: b.noneOnContract },
                  ]}
                />
              )}
              {editing && !hasRestrictions ? (
                <p className="mt-3 text-xs leading-relaxed text-text-muted">
                  {t.restrictionsNoneEdit}
                </p>
              ) : (
                <>
              <Table
                head={[
                  b.colApplies,
                  b.colDates,
                  b.colMinNights,
                  b.colChecks,
                  b.colStatus,
                  ...(editing ? [""] : []),
                ]}
                rows={contractRestrictions.map((rule) => {
                  const row = [
                    `${lang === "ar" ? rule.scopeAr : rule.scope} · ${lang === "ar" ? rule.updatedAr : rule.updated}`,
                    [
                      lang === "ar" ? rule.datesAr : rule.dates,
                      lang === "ar" ? rule.overlapAr : rule.overlap,
                    ]
                      .filter(Boolean)
                      .join(" · "),
                    lang === "ar" ? rule.minNightsAr : rule.minNights,
                    lang === "ar" ? rule.checksAr : rule.checks,
                    rule.active ? b.active : b.inactive,
                  ];
                  return editing ? [...row, b.delete] : row;
                })}
              />
              <p className="mt-2 text-xs leading-relaxed text-text-muted">
                {b.restrictionsNote}
              </p>
                </>
              )}
            </Section>

            <Section done id={9} title={b.sections[8]!} body={t.policiesBody}>
              {editing && (
                <ChoiceRow
                  value={hasPolicies ? "add" : "none"}
                  onChange={(next) => setHasPolicies(next === "add")}
                  options={[
                    { value: "add", label: b.addToContract },
                    { value: "none", label: b.noneOnContract },
                  ]}
                />
              )}
              {editing && !hasPolicies ? (
                <>
                  <p className="mt-3 text-xs leading-relaxed text-text-muted">
                    {t.policiesNoneEdit}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-status-warning">
                    {t.policiesNoneEditWarn}
                  </p>
                </>
              ) : (
                <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border-subtle p-4">
                  <p className="text-overline text-text-muted">{t.cancellation}</p>
                  <p className="mt-1.5 text-sm font-medium text-text-primary">
                    {b.cancellationValue}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    {t.cancellationNote}
                  </p>
                </div>
                <div className="rounded-xl border border-border-subtle p-4">
                  <p className="text-overline text-text-muted">{b.release}</p>
                  <p className="mt-1.5 text-sm font-medium text-text-primary">
                    {b.releaseValue}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">{t.releaseNote}</p>
                </div>
              </div>

              <p className="mt-5 text-overline text-text-muted">
                {b.seasonPolicyOverline}
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <thead>
                    <tr className="text-overline text-text-muted">
                      {[b.colSegment, b.colDates, t.cancellation, ""].map(
                        (cell, index) => (
                          <th
                            key={cell || index}
                            className={cn(
                              "py-2 font-semibold",
                              index === 3 ? "text-end" : "text-start"
                            )}
                          >
                            {cell}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {seasonPolicies.map((row) => (
                      <tr
                        key={row.season}
                        className="border-t border-border-subtle"
                      >
                        <td className="py-2.5 pe-3 text-text-secondary">
                          {lang === "ar" ? row.seasonAr : row.season}
                        </td>
                        <td className="py-2.5 pe-3 text-text-secondary">
                          {lang === "ar" ? row.datesAr : row.dates}
                        </td>
                        <td className="py-2.5 pe-3 text-text-secondary">
                          {lang === "ar" ? row.policyAr : row.policy}
                        </td>
                        <td className="py-2.5 text-end">
                          {/* OV 03.16S* — each season can carry its own. */}
                          {row.own && (
                            <button
                              type="button"
                              onClick={() =>
                                setSeasonPolicy(
                                  seasonPolicyFor(row.season) ?? null
                                )
                              }
                              className="text-xs font-medium text-text-link hover:underline"
                            >
                              {b.editInSeason}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {editing && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPolicy("cancellation")}
                  >
                    {t.editCancellationPolicy}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPolicy("release")}
                  >
                    {t.editReleasePolicy}
                  </Button>
                </div>
              )}
                </>
              )}
            </Section>
            </>
          )}
        </div>
      </div>

      {ruleDrawer === "add" && (
        <RestrictionDrawer onClose={() => setRuleDrawer(null)} />
      )}
      {ruleDrawer === "edit" && (
        <RestrictionDrawer
          mode="edit"
          onClose={() => setRuleDrawer(null)}
          onDelete={() => setRuleDrawer("delete")}
        />
      )}
      {ruleDrawer === "delete" && (
        <DeleteRestrictionOverlay
          onClose={() => setRuleDrawer(null)}
          onConfirm={() => setRuleDrawer(null)}
        />
      )}

      {seasonDetail && (
        <SeasonDetailPanel
          season={seasonDetail}
          mode={readOnly ? "readOnly" : "live"}
          onClose={() => setSeasonDetail(null)}
          onEdit={() => {
            setSeasonEditor(seasonDetail);
            setSeasonDetail(null);
          }}
        />
      )}
      {seasonEditor && (
        <SeasonPage
          season={seasonEditor}
          /* OV 03.12B - a season prices the way its contract does. */
          fixedPrice={fixedPrice}
          onClose={() => setSeasonEditor(null)}
          onRemove={() => setSeasonEditor(null)}
        />
      )}
      {seasonPolicy && (
        <CancellationDrawer
          season={seasonPolicy}
          onClose={() => setSeasonPolicy(null)}
        />
      )}
      {policy === "cancellation" && (
        <CancellationDrawer onClose={() => setPolicy(null)} />
      )}
      {policy === "release" && <ReleaseDrawer onClose={() => setPolicy(null)} />}
      {drawer === "activity" && (
        <ActivityDrawer onClose={() => setDrawer(null)} />
      )}
      {drawer === "publish" && (
        <PublishDrawer
          onClose={() => setDrawer(null)}
          onPublish={() => setDrawer(null)}
        />
      )}
      {drawer === "discard" && (
        <LifecycleDialogOverlay
          dialog={discardDialog}
          kind="discard"
          onClose={() => setDrawer(null)}
          onConfirm={() => setDrawer(null)}
        />
      )}
      {drawer === "amend" && (
        <AmendOverlay
          onClose={() => setDrawer(null)}
          onStart={() => setDrawer(null)}
        />
      )}
      {action === "pause" && (
        <LifecycleDialogOverlay
          dialog={pauseDialog}
          kind="pause"
          onClose={() => setAction(null)}
          onConfirm={commit}
        />
      )}
      {action === "terminate" && (
        <LifecycleDialogOverlay
          dialog={terminateDialog}
          kind="terminate"
          onClose={() => setAction(null)}
          onConfirm={commit}
        />
      )}

      <Dialog open={action === "resume"} onOpenChange={(open) => !open && setAction(null)}>
        <DialogContent className="rounded-2xl border-border-subtle bg-surface-default">
          <DialogHeader>
            <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-status-warning-bg text-status-warning">
              <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            </span>
            <DialogTitle>
              {action === "pause"
                ? menu.pause
                : action === "resume"
                  ? menu.resume
                  : menu.terminate}
            </DialogTitle>
            <DialogDescription>{menu.body}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)}>
              {menu.cancel}
            </Button>
            <Button
              loading={working}
              variant={action === "terminate" ? "danger" : "default"}
              onClick={() => void commit()}
            >
              {menu.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

function MiniStat({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-border-subtle bg-surface-default p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-subtle text-brand-deep [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-overline text-text-muted">{label}</p>
        <p>
          <b className="font-data text-xl text-text-primary">{value}</b>{" "}
          <small className="text-text-muted">{hint}</small>
        </p>
      </div>
    </div>
  );
}
