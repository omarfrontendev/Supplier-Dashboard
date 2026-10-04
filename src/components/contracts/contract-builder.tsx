import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Check,
  ChevronRight,
  Lock,
  Plus,
  Save,
  Search,
} from "lucide-react";
import { PageShell, StatusPill } from "@/components/layout/page-shell";
import {
  PickerOverlay,
  SeasonOverlapOverlay,
  TermOverlay,
  UnsavedOverlay,
  WeekendOverlay,
} from "@/components/contracts/create-overlays";
import { ActivateDrawer } from "@/components/contracts/lifecycle-overlays";
import {
  CancellationDrawer,
  ReleaseDrawer,
} from "@/components/contracts/policy-overlays";
import {
  seasonPolicyFor,
  type SeasonPolicy,
} from "@/lib/policy-overlay-data";
import { SeasonDetailPanel } from "@/components/contracts/season-detail";
import {
  SeasonLegend,
  SeasonTimeline,
} from "@/components/contracts/season-timeline";
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
  currencyPanel,
  hotelPickerPanel,
} from "@/lib/contract-overlay-data";
import { ChoiceRow, RoomGroup, Section, Table } from "@/components/contracts/contract-parts";
import {
  RestrictionDayDialog,
  type RestrictionScope,
} from "@/components/contracts/restriction-day-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { fill, useLanguage } from "@/lib/i18n";
import { notify, wait } from "@/lib/notify";
import { hotels } from "@/lib/demo-data";
import { usePortal } from "@/lib/portal-store";
import {
  BASE_WEEKDAY,
  BASE_WEEKEND,
  MONTHS,
  childBands,
  contractRestrictions,
  contractRooms,
  inventoryCaps,
  perRoomStock,
  fixedPriceRooms,
  mealPlans,
  rateSeasons,
  roomPrice,
  seasonPolicies,
} from "@/lib/contract-data";

type SoldOut = "stop" | "request" | "overbooking";
type Inventory = "shared" | "perRoom" | "free";

/**
 * The one-page supply-contract builder — Figma UI 03.1 and its variants.
 * Ten sections down the page, a sticky rail on the left and a live summary
 * that fills in as the contract takes shape.
 */
/** UI 03.1F — a room is ticked on sale; the base room is ticked and locked. */
function RoomTick({
  on,
  locked,
  label,
  onToggle,
}: {
  on: boolean;
  locked: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={on}
      aria-label={label}
      disabled={locked}
      onClick={onToggle}
      className={cn(
        "grid size-[22px] place-items-center rounded-md transition-colors",
        on
          ? "bg-brand-deep text-primary"
          : "border-[1.5px] border-border-strong bg-surface-default",
        locked ? "cursor-not-allowed opacity-70" : "cursor-pointer"
      )}
    >
      {on && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
    </button>
  );
}

export function ContractBuilder({
  mode = "create",
  contractId,
  sourceId,
}: {
  mode?: "create" | "edit";
  contractId?: string;
  sourceId?: string;
}) {
  const { c, lang } = useLanguage();
  const t = c.builder;
  const navigate = useNavigate();
  const { contracts, addContract } = usePortal();
  const source = contracts.find((x) => x.id === (contractId ?? sourceId));

  const [hotelId, setHotelId] = useState(source?.hotelId ?? "");
  const [name, setName] = useState(source?.name ?? "");
  const [term, setTerm] = useState(source?.dates ?? "");
  const [currency, setCurrency] = useState("");
  const [weekend, setWeekend] = useState("");
  const [type, setType] = useState<"block" | "request">("block");
  const [slaExpiry, setSlaExpiry] = useState<"reject" | "escalate">("reject");
  const [roomAdded, setRoomAdded] = useState(false);
  /* OV 03.1P - 03.13 — the panels each field opens. */
  const [picker, setPicker] = useState<
    "hotel" | "term" | "termError" | "termOverlap" | "currency" | "weekend" | "unsaved" | "overlap" | null
  >(null);
  const [pricing, setPricing] = useState<"supplements" | "fixed">("supplements");
  const [week, setWeek] = useState<"one" | "split">("split");
  const [inventory, setInventory] = useState<Inventory>("shared");
  const [stock, setStock] = useState("50");
  const [soldOut, setSoldOut] = useState<SoldOut>("overbooking");
  const [overLimit, setOverLimit] = useState("2");
  const [hasRestrictions, setHasRestrictions] = useState(true);
  const [hasPolicies, setHasPolicies] = useState(true);
  const [query, setQuery] = useState("");
  const [dayScope, setDayScope] = useState<RestrictionScope | null>(null);
  const [saving, setSaving] = useState(false);
  /* OV 03.2 — the drawer that shows every section before it goes live. */
  const [reviewOpen, setReviewOpen] = useState(false);
  /* OV 03.16 / 03.17 — the two policy drawers. */
  const [policy, setPolicy] = useState<"cancellation" | "release" | null>(null);
  const [seasonPolicy, setSeasonPolicy] = useState<SeasonPolicy | null>(null);
  /* OV 03.14 - 03.17 — one season, one room, every night it covers. */
  const [seasonDetail, setSeasonDetail] = useState<SeasonDetail | null>(null);
  const detailFor = (name: string) =>
    seasonDetails.find((x) => x.name.en === name) ?? null;
  /* OV 03.12 — Edit season opens the season editor itself. */
  const [seasonEditor, setSeasonEditor] = useState<SeasonDetail | null>(null);
  /* OV 03.RS / RSE / RSD — the restriction drawer and its delete. */
  const [ruleDrawer, setRuleDrawer] = useState<"add" | "edit" | "delete" | null>(null);

  const onRequest = type === "request";
  const fixed = pricing === "fixed";
  /** Sections 2-6 and 8-10 stay locked until the hotel and term are set. */
  const basicsDone = Boolean(hotelId && term.trim());
  const seasonsDone = basicsDone && hasRestrictions !== null && hasPolicies !== null;

  /*
   * UI 03.1 / 03.1O — the rail and every section head read from one list.
   * A fixed-price contract has no base and no supplements, so Extra
   * children and Meal plans drop out and the rest renumber.
   */
  const sectionList = (
    fixed
      ? ([
          ["basics", t.sections[0]!],
          ["pricing", t.pricingFixedTitle],
          ["rooms", t.sections[2]!],
          ["inventory", t.sections[5]!],
          ["seasons", t.sections[6]!],
          ["restrictions", t.sections[7]!],
          ["policies", t.sections[8]!],
          ["review", t.sections[9]!],
        ] as const)
      : ([
          ["basics", t.sections[0]!],
          ["pricing", t.sections[1]!],
          ["rooms", t.sections[2]!],
          ["children", t.sections[3]!],
          ["meals", t.sections[4]!],
          ["inventory", t.sections[5]!],
          ["seasons", t.sections[6]!],
          ["restrictions", t.sections[7]!],
          ["policies", t.sections[8]!],
          ["review", t.sections[9]!],
        ] as const)
  ).map(([key, title]) => ({ key, title }));
  const num = (key: string) =>
    sectionList.findIndex((item) => item.key === key) + 1;
  const sectionLocked = (key: string) =>
    key === "basics" ? false : key === "seasons" ? !seasonsDone : !basicsDone;
  const sectionDone = (key: string) =>
    key === "basics"
      ? basicsDone && Boolean(name.trim())
      : key === "review"
        ? seasonsDone
        : basicsDone;
  const firstOpen = sectionList.findIndex(
    (item) => !sectionLocked(item.key) && !sectionDone(item.key)
  );
  const currentSection = firstOpen === -1 ? sectionList.length - 1 : firstOpen;

  /* UI 03.1F section 3 — the rooms are a checklist, so what is on sale
     is held here and section 2's base row follows it. */
  const roomKey = (room: (typeof contractRooms)[number]) =>
    `${room.type} · ${room.view}`;
  const [picked, setPicked] = useState<string[]>(() =>
    contractRooms.filter((room) => room.onSale).map(roomKey)
  );
  const onSale = contractRooms.filter((room) => picked.includes(roomKey(room)));
  const baseRoom = onSale.find((room) => room.base);
  const roomTypes = new Set(onSale.map((room) => room.type)).size;
  const seasons = rateSeasons.filter((season) => !season.base);
  const seasonNights = seasons.reduce((sum, season) => sum + season.nights, 0);

  const hotel = hotels.find((h) => h.id === hotelId);
  const hotelOptions = hotels
    .filter((h) => h.relation === "linked")
    .map((h) => ({
      value: h.id,
      label: lang === "ar" ? h.nameAr : h.nameEn,
      hint: `${h.city} · ${h.stars}★`,
    }));

  const grouped = useMemo(() => {
    const term = query.trim().toLowerCase();
    const rows = onSale.filter(
      (room) =>
        !term ||
        `${room.type} ${room.view}`.toLowerCase().includes(term) ||
        `${room.typeAr} ${room.viewAr}`.includes(term)
    );
    const map = new Map<string, typeof rows>();
    for (const room of rows) {
      map.set(room.type, [...(map.get(room.type) ?? []), room]);
    }
    return [...map.entries()];
  }, [onSale, query]);

  const priceMeals = mealPlans.filter((meal) => meal.included);

  function activate() {
    if (!basicsDone || !name.trim()) {
      notify.error(c.contractFlow.required ?? t.reviewActivate);
      return;
    }
    setSaving(true);
    void (async () => {
      await wait(650);
      addContract({
        id: contractId ?? `SC-2027-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        hotelId,
        name,
        nameAr: name,
        dates: term,
        datesAr: term,
        period: term,
        periodAr: term,
        model: type === "block" ? "instant" : "onRequest",
        rooms: onSale.length,
        state: "active",
        roomNames: onSale.map((room) => `${room.type} · ${room.view}`),
        allotment: Number(stock) || 0,
        roomTypes,
        soldOut:
          soldOut === "stop"
            ? "stop"
            : soldOut === "request"
              ? "onRequest"
              : "overbooking",
        overbooking: Number(overLimit) || 2,
        releaseDays: 3,
        version: "v1.0",
      });
      notify.success(t.activated);
      setSaving(false);
      navigate({ to: "/rate-contracts" });
    })();
  }

  return (
    <PageShell>
      <button
        type="button"
        onClick={() => setPicker("unsaved")}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ChevronRight
          className="h-4 w-4 rotate-180 rtl:rotate-0"
          aria-hidden="true"
        />
        {t.back}
      </button>

      <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-overline text-brand-mid">
            {mode === "edit" ? t.overlineEdit : t.overline}
          </p>
          <h1 className="mt-1 text-[28px] font-semibold text-text-primary">
            {t.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary">
            {t.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-text-muted">
            {basicsDone ? t.draftSaved : t.draftEmpty}
          </span>
          <Button variant="outline">
            <Save className="h-4 w-4" aria-hidden="true" />
            {t.saveDraft}
          </Button>
          <Button loading={saving} onClick={() => setReviewOpen(true)}>
            {t.reviewActivate}
          </Button>
        </div>
      </header>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[264px_minmax(0,1fr)]">
        <aside className="h-fit space-y-4 xl:sticky xl:top-24">
          <nav className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default">
            <p className="border-b border-border-subtle px-4 py-3 text-overline text-text-muted">
              {t.sectionsOverline}
            </p>
            {sectionList.map(({ key, title: label }, index) => {
              const locked = sectionLocked(key);
              const done = sectionDone(key);
              return (
                <a
                  key={key}
                  href={`#contract-section-${index + 1}`}
                  className={cn(
                    "flex items-center gap-3 border-b border-border-subtle px-4 py-3 text-sm last:border-0",
                    index === currentSection
                      ? "bg-primary-subtle"
                      : "hover:bg-surface-subtle"
                  )}
                >
                  <span
                    className={cn(
                      "font-data flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs",
                      locked
                        ? "bg-status-neutral-bg text-text-muted"
                        : done
                          ? "bg-brand-deep text-text-inverse"
                          : "border border-brand-deep bg-surface-default text-brand-deep"
                    )}
                  >
                    {done && !locked ? (
                      <Check className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate",
                      locked ? "text-text-muted" : "text-text-primary"
                    )}
                  >
                    {label}
                  </span>
                  {locked && (
                    <Lock
                      className="h-3.5 w-3.5 shrink-0 text-status-warning"
                      aria-hidden="true"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
            <p className="text-overline text-text-muted">{t.summaryOverline}</p>
            <dl className="mt-3 space-y-2.5 text-sm">
              {[
                [
                  t.summaryHotel,
                  hotel ? (lang === "ar" ? hotel.nameAr : hotel.nameEn) : t.summaryEmpty,
                ],
                [t.summaryTerm, term || t.summaryEmpty],
                [
                  t.summaryType,
                  basicsDone ? (type === "block" ? t.typeBlock : t.typeRequest) : t.summaryEmpty,
                ],
                [
                  t.summaryRooms,
                  basicsDone
                    ? fill(t.summaryRoomsValue, { count: onSale.length })
                    : t.summaryEmpty,
                ],
                [
                  t.summarySeasons,
                  seasonsDone
                    ? fill(t.summarySeasonsValue, {
                        count: seasons.length,
                        nights: seasonNights,
                      })
                    : t.summaryEmpty,
                ],
                [
                  t.summaryStock,
                  !basicsDone
                    ? t.summaryEmpty
                    : onRequest
                      ? t.summaryNoStock
                      : inventory === "free"
                        ? t.invFree
                        : fill(t.summaryStockValue, { count: stock }),
                ],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-3">
                  <dt className="text-text-secondary">{label}</dt>
                  <dd className="min-w-0 flex-1 truncate text-end font-medium text-text-primary">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-text-muted">
              {onRequest ? t.summaryRequestNote : t.summaryNote}
            </p>
          </div>
        </aside>

        <div className="min-w-0 space-y-6">
          {/* 1 — Contract basics */}
          <Section
            id={num("basics")}
            title={t.sections[0]!}
            body={t.basicsBody}
            done={sectionDone("basics")}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <button
                  type="button"
                  onClick={() => setPicker("hotel")}
                  className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-border-default bg-surface-default px-3 text-start text-sm text-text-primary hover:bg-surface-subtle"
                >
                  <span className="truncate">
                    {hotel
                      ? lang === "ar"
                        ? hotel.nameAr
                        : hotel.nameEn
                      : t.hotelPh}
                  </span>
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-text-muted rtl:rotate-180"
                    aria-hidden="true"
                  />
                </button>
                {!hotelId && (
                  <p className="mt-1.5 text-xs text-text-muted">{t.hotelHint}</p>
                )}
              </div>
              <Input
                label={t.name}
                placeholder={t.namePh}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div>
                <p className="mb-1.5 text-sm font-medium text-text-primary">
                  {t.term}
                </p>
                <button
                  type="button"
                  onClick={() => setPicker("term")}
                  className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-border-default bg-surface-default px-3 text-start text-sm text-text-primary hover:bg-surface-subtle"
                >
                  <span className="truncate">{term || t.termPh}</span>
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-text-muted rtl:rotate-180"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-medium text-text-primary">
                  {t.currency}
                </p>
                <button
                  type="button"
                  onClick={() => setPicker("currency")}
                  className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-border-default bg-surface-default px-3 text-start text-sm text-text-primary hover:bg-surface-subtle"
                >
                  <span className="truncate">{currency ? "SAR · Saudi Riyal" : t.selectPh}</span>
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-text-muted rtl:rotate-180"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div>
                <p className="mb-1.5 text-sm font-medium text-text-primary">
                  {t.weekend}
                </p>
                <button
                  type="button"
                  onClick={() => setPicker("weekend")}
                  className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-border-default bg-surface-default px-3 text-start text-sm text-text-primary hover:bg-surface-subtle"
                >
                  <span className="truncate">{weekend ? "Thu · Fri" : t.selectPh}</span>
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-text-muted rtl:rotate-180"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-text-primary">{t.type}</p>
            <ChoiceRow
              value={type}
              onChange={(next) => setType(next as typeof type)}
              options={[
                { value: "block", label: t.typeBlock },
                { value: "request", label: t.typeRequest },
              ]}
            />
            <p className="mt-2 text-xs leading-relaxed text-text-muted">
              {onRequest ? t.requestTypeHint : t.typeHint}
            </p>

            {/* UI 03.1B / 03.1B2 — On Request replaces stock with a clock. */}
            {onRequest && (
              <div className="mt-4 rounded-xl border border-border-subtle bg-surface-subtle p-4">
                <p className="text-sm font-medium text-text-primary">
                  {t.slaBlockTitle}
                </p>
                <div className="mt-3 max-w-xs">
                  <Input label={t.slaLabel} value={t.slaValue} readOnly />
                </div>
                <p className="mt-1.5 text-xs text-text-muted">
                  {t.slaCountdown}
                </p>
                <p className="mt-4 text-sm font-medium text-text-primary">
                  {t.slaExpires}
                </p>
                <ChoiceRow
                  value={slaExpiry}
                  onChange={(next) => setSlaExpiry(next as typeof slaExpiry)}
                  options={[
                    { value: "reject", label: t.slaReject },
                    { value: "escalate", label: t.slaEscalate },
                  ]}
                />
                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  {slaExpiry === "escalate" ? t.slaEscalateNote : t.slaRejectNote}
                </p>
              </div>
            )}
            {!hotelId && (
              <Link
                to="/hotels"
                className="mt-4 inline-block text-xs font-medium text-text-link hover:underline"
              >
                {t.hotelMissing}
              </Link>
            )}
            {!basicsDone && (
              <div className="mt-4 flex gap-2 rounded-xl border border-border-subtle bg-surface-subtle p-3.5">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
                <p className="text-xs leading-relaxed text-text-secondary">
                  {t.lockNote}
                </p>
              </div>
            )}
          </Section>

          {/* 2 — Pricing model & base */}
          <Section
            id={num("pricing")}
            title={fixed ? t.pricingFixedTitle : t.sections[1]!}
            body={
              fixed
                ? t.pricingFixedBody
                : basicsDone
                  ? t.pricingBodyFilled
                  : t.pricingBody
            }
            locked={!basicsDone}
            tone={basicsDone ? "done" : "locked"}
          >
            <p className="text-sm font-medium text-text-primary">
              {t.pricingModel}
            </p>
            <ChoiceRow
              value={pricing}
              onChange={(next) => setPricing(next as typeof pricing)}
              options={[
                { value: "supplements", label: t.modelSupplements },
                { value: "fixed", label: t.modelFixed },
              ]}
            />
            <p className="mt-2 text-xs leading-relaxed text-text-muted">
              {t.modelHint}
            </p>
            {/* Flow 12 · Row D — one line, and no VAT choice anywhere. */}
            <p className="mt-3 text-[13px] font-medium text-brand-deep">
              {t.vatIncluded}
            </p>
            {!fixed && (
              <Table
                head={[
                  t.colRoom,
                  t.colMeal,
                  t.colView,
                  t.colWeekday,
                  t.colWeekend,
                ]}
                rows={[
                  [
                    baseRoom
                      ? lang === "ar"
                        ? baseRoom.typeAr
                        : baseRoom.type
                      : "-",
                    "Room Only",
                    baseRoom
                      ? lang === "ar"
                        ? baseRoom.viewAr
                        : baseRoom.view.replace(/ View$/, "")
                      : "-",
                    `${BASE_WEEKDAY} SAR`,
                    `${BASE_WEEKEND} SAR`,
                  ],
                ]}
              />
            )}
          </Section>

          {/* 3 — Rooms */}
          <Section
            id={num("rooms")}
            title={t.sections[2]!}
            body={
              fixed
                ? t.roomsFixedBody
                : basicsDone
                  ? t.roomsBody
                  : t.roomsBodyEmpty
            }
            locked={!basicsDone}
            tone={basicsDone ? "done" : "locked"}
            right={
              <div className="flex flex-wrap gap-2">
                {fixed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRoomAdded(true)}
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    {t.addRoom}
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  {t.requestRoom}
                </Button>
              </div>
            }
          >
            <p className="text-sm font-medium text-text-primary">{t.weekTitle}</p>
            <ChoiceRow
              value={week}
              onChange={(next) => setWeek(next as typeof week)}
              options={[
                { value: "one", label: t.weekOne },
                { value: "split", label: t.weekSplit },
              ]}
            />
            <p className="mt-2 text-xs leading-relaxed text-text-muted">
              {week === "one" ? t.weekOneHint : t.weekHint}
            </p>
            {/* UI 03.1O — a fixed-price contract lists whole prices instead. */}
            {fixed ? (
              <Table
                head={[
                  "",
                  t.colRoom,
                  t.colMealView,
                  t.colWeekdayTotal,
                  t.colWeekendTotal,
                ]}
                rows={fixedPriceRooms
                  .filter((room) => roomAdded || !room.added)
                  .map((room) => [
                  "✓",
                  lang === "ar" ? room.roomAr : room.room,
                  `${lang === "ar" ? room.mealAr : room.meal}${room.added ? `  ·  ${t.justAdded}` : ""}`,
                  lang === "ar" ? room.weekdayAr : room.weekday,
                  lang === "ar" ? room.weekendAr : room.weekend,
                  ])}
              />
            ) : (
              <Table
                head={
                  week === "one"
                    ? ["", t.colRoom, t.colPricePerNight]
                    : ["", t.colRoom, t.colSupplement, t.colSells]
                }
                muted={contractRooms
                  .map((room, index) => (room.base ? index : -1))
                  .filter((index) => index >= 0)}
                rows={contractRooms.map((room) => {
                  const name = `${lang === "ar" ? room.typeAr : room.type} · ${lang === "ar" ? room.viewAr : room.view}`;
                  const on = picked.includes(roomKey(room));
                  const box = (
                    <RoomTick
                      on={on}
                      locked={Boolean(room.base)}
                      label={name}
                      onToggle={() =>
                        setPicked((prev) =>
                          prev.includes(roomKey(room))
                            ? prev.filter((key) => key !== roomKey(room))
                            : [...prev, roomKey(room)]
                        )
                      }
                    />
                  );
                  if (week === "one") {
                    return [
                      box,
                      name,
                      !on
                        ? "-"
                        : room.base
                          ? fill(t.baseRoomOne, { price: BASE_WEEKDAY })
                          : fill(t.supplementOne, {
                              add: room.supplement,
                              total: BASE_WEEKDAY + room.supplement,
                            }),
                    ];
                  }
                  return [
                    box,
                    name,
                    !on
                      ? "-"
                      : room.base
                        ? t.baseRoom
                        : `+ ${room.supplement} SAR`,
                    !on
                      ? "-"
                      : `${BASE_WEEKDAY + room.supplement} / ${BASE_WEEKEND + room.supplement} SAR`,
                  ];
                })}
              />
            )}
          </Section>

          {!fixed && (
            <>
          {/* 4 — Extra children */}
          <Section
            id={num("children")}
            title={t.sections[3]!}
            body={basicsDone ? t.childrenBody : t.childrenBodyShort}
            locked={!basicsDone}
            tone={basicsDone ? "done" : "locked"}
          >
            <Table
              head={["", t.colChild, t.colBasis, t.colSameNight]}
              rows={childBands.map((band) => [
                band.included ? "✓" : "",
                lang === "ar" ? band.labelAr : band.label,
                lang === "ar" ? band.basisAr : band.basis,
                lang === "ar" ? band.supplementAr : band.supplement,
              ])}
            />
          </Section>

          {/* 5 — Meal plans */}
          <Section
            id={num("meals")}
            title={t.sections[4]!}
            body={t.mealsBody}
            locked={!basicsDone}
            tone={basicsDone ? "done" : "locked"}
          >
            <Table
              head={["", t.colMealPlan, t.colBasis, t.colSameNight]}
              rows={mealPlans.map((meal) => [
                meal.included ? "✓" : "",
                lang === "ar" ? meal.nameAr : meal.name,
                lang === "ar" ? meal.basisAr : meal.basis,
                meal.supplement === null ? "-" : `+ ${meal.supplement} SAR`,
              ])}
            />

            <div className="mt-6">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary">
                    {t.priceListTitle}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-text-muted">
                    {t.priceListBody}
                  </p>
                </div>
                <div className="relative">
                  <Search
                    className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted start-3"
                    aria-hidden="true"
                  />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.priceListSearch}
                    className="h-10 w-full min-w-[220px] rounded-lg border border-border-default bg-surface-default ps-9 pe-3 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-border-focus focus-visible:outline-none"
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-xs text-text-muted">
                <StatusPill tone="neutral">
                  {fill(t.priceListRooms, { count: onSale.length })}
                </StatusPill>
                <StatusPill tone="neutral">
                  {fill(t.priceListTypes, { count: roomTypes })}
                </StatusPill>
                <StatusPill tone="brand">
                  {fill(t.priceListFrom, { amount: BASE_WEEKDAY })}
                </StatusPill>
                <span className="self-center">{t.priceListBase}</span>
              </div>

              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-sm">
                  <thead>
                    <tr className="text-overline text-text-muted">
                      <th className="py-2 text-start font-semibold">
                        {t.colRoomView}
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
                        label={fill(t.roomGroup, {
                          room: lang === "ar" ? rows[0]!.typeAr : type,
                          views:
                            rows.length === 1
                              ? t.oneView
                              : fill(t.views, { count: rows.length }),
                          guests: rows[0]!.guests,
                        })}
                        rows={rows}
                        meals={priceMeals}
                        lang={lang}
                        t={t}
                      />
                    ))}
                    {contractRooms
                      .filter((room) => !room.onSale)
                      .map((room) => (
                        <tr key={`${room.type}-off`} className="border-t border-border-subtle">
                          <td
                            colSpan={priceMeals.length + 1}
                            className="py-3 text-xs text-text-muted"
                          >
                            {fill(t.notOnSale, {
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

          {/* 6 — Inventory */}
          <Section
            id={num("inventory")}
            title={t.sections[5]!}
            body={onRequest ? t.requestInvBody : t.inventoryBody}
            locked={!basicsDone}
            tone={basicsDone ? "done" : "locked"}
          >
            {/* UI 03.1B — an On Request contract commits no rooms at all. */}
            {onRequest ? (
              <p className="text-sm leading-relaxed text-text-secondary">
                {t.requestInvShort}
              </p>
            ) : (
              <>
                <p className="text-sm font-medium text-text-primary">
                  {t.inventoryModel}
                </p>
                <ChoiceRow
                  value={inventory}
                  onChange={(next) => setInventory(next as Inventory)}
                  options={[
                    { value: "shared", label: t.invShared },
                    { value: "perRoom", label: t.invPerRoom },
                    { value: "free", label: t.invFree },
                  ]}
                />
                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  {inventory === "shared"
                    ? t.invSharedHint
                    : inventory === "perRoom"
                      ? t.invPerRoomHint
                      : t.invFreeHint}
                </p>

                {/* UI 03.1L — free sale has no number, so it has no table. */}
                {inventory === "free" && (
                  <div className="mt-3 space-y-2">
                    {[t.invFreeNote1, t.invFreeNote2, t.invFreeNote3].map(
                      (note) => (
                        <p
                          key={note}
                          className="text-xs leading-relaxed text-text-muted"
                        >
                          {note}
                        </p>
                      )
                    )}
                  </div>
                )}

                {inventory === "shared" && (
                  <>
                    <div className="mt-4 max-w-xs">
                      <Input
                        label={t.invNights}
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        suffix="/ night"
                      />
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-text-muted">
                      {t.invNightsHint}
                    </p>

                    <Table
                      head={[t.colRoomType, t.colCap, t.colSellsShort]}
                      rows={inventoryCaps.map((cap) => [
                        lang === "ar" ? cap.roomAr : cap.room,
                        lang === "ar" ? cap.capAr : cap.cap,
                        lang === "ar" ? cap.sellsAr : cap.sells,
                      ])}
                    />
                    <p className="mt-2 text-xs leading-relaxed text-text-muted">
                      {t.capHint}
                    </p>
                  </>
                )}

                {/* UI 03.1N — a number per room type, and what draws from it. */}
                {inventory === "perRoom" && (
                  <>
                    <p className="mt-3 text-xs leading-relaxed text-text-muted">
                      {t.invPerRoomNote}
                    </p>
                    <Table
                      head={[t.colRoomType, t.colRoomsNight, t.colDrawsFrom]}
                      rows={perRoomStock.map((row) => [
                        lang === "ar" ? row.roomAr : row.room,
                        lang === "ar" ? row.roomsAr : row.rooms,
                        lang === "ar" ? row.drawsAr : row.draws,
                      ])}
                    />
                  </>
                )}

                {inventory !== "free" && (
                  <>
                    <p className="mt-5 text-sm font-medium text-text-primary">
                      {t.soldOut}
                    </p>
                    <ChoiceRow
                      value={soldOut}
                      onChange={(next) => setSoldOut(next as SoldOut)}
                      options={[
                        { value: "stop", label: t.soldOutStop },
                        { value: "request", label: t.soldOutRequest },
                        { value: "overbooking", label: t.soldOutOver },
                      ]}
                    />
                    <p className="mt-2 text-xs leading-relaxed text-text-muted">
                      {t.overHint}
                    </p>
                    {soldOut === "stop" && (
                      <p className="mt-2 text-xs leading-relaxed text-text-muted">
                        {t.soldOutStopHint}
                      </p>
                    )}
                    {soldOut === "request" && (
                      <p className="mt-2 text-xs leading-relaxed text-text-muted">
                        {t.soldOutRequestHint}
                      </p>
                    )}
                    {soldOut === "overbooking" && (
                      <>
                        <div className="mt-3 max-w-xs">
                          <Input
                            label={t.overLimit}
                            value={overLimit}
                            onChange={(e) => setOverLimit(e.target.value)}
                          />
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-text-muted">
                          {inventory === "perRoom"
                            ? fill(t.perRoomLimitHint, { limit: overLimit })
                            : fill(t.overLimitHint, { stock, limit: overLimit })}
                        </p>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </Section>

          {/* 7 — Rate seasons */}
          <Section
            id={num("seasons")}
            title={t.sections[6]!}
            body={t.seasonsBody}
            locked={false}
            tone={
              !basicsDone ? "locked" : seasonsDone ? "done" : "open"
            }
            right={
              seasonsDone ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPicker("overlap")}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  {t.addSeason}
                </Button>
              ) : undefined
            }
          >
            {!seasonsDone ? (
              <div className="rounded-xl border border-border-subtle bg-surface-subtle p-4">
                <p className="text-xs leading-relaxed text-text-secondary">
                  {t.seasonsLocked}
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <a
                    href={`#contract-section-${num("restrictions")}`}
                    className="text-xs font-medium text-text-link hover:underline"
                  >
                    {t.goRestrictions}
                  </a>
                  <a
                    href={`#contract-section-${num("policies")}`}
                    className="text-xs font-medium text-text-link hover:underline"
                  >
                    {t.goPolicies}
                  </a>
                </div>
              </div>
            ) : (
              <>
                {/* UI 03.1F — the month map, then the table it explains. */}
                <SeasonTimeline seasons={rateSeasons} ar={lang === "ar"} />
                <div className="mt-3">
                  <SeasonLegend seasons={rateSeasons} ar={lang === "ar"} />
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border border-border-subtle">
                  <div className="hidden grid-cols-[180px_190px_60px_130px_minmax(0,1fr)_248px] gap-3 bg-surface-subtle px-3.5 py-2 text-[12px] leading-[15px] text-text-muted lg:grid">
                    <span>{t.colSegment}</span>
                    <span>{t.colDates}</span>
                    <span>{t.colNights}</span>
                    <span>{t.colRule}</span>
                    <span>{t.colResult}</span>
                    <span />
                  </div>

                  {rateSeasons.map((season) => (
                    <div
                      key={season.name}
                      className="grid gap-x-3 gap-y-2 border-t border-border-subtle px-3.5 py-3 text-[13px] leading-[18px] text-text-body first:border-t-0 lg:grid-cols-[180px_190px_60px_130px_minmax(0,1fr)_248px] lg:items-center lg:py-2.5"
                    >
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor: season.colour ?? "#eef1ee",
                          }}
                          aria-hidden="true"
                        />
                        <b className="text-[13px] font-semibold text-text-primary">
                          {lang === "ar" ? season.nameAr : season.name}
                        </b>
                      </span>
                      <span>
                        {season.base
                          ? t.everyNight
                          : lang === "ar"
                            ? season.datesAr
                            : season.dates}
                      </span>
                      <span className="font-data">{season.nights}</span>
                      <span>{lang === "ar" ? season.ruleAr : season.rule}</span>
                      <span className="font-data">{season.result}</span>
                      <span className="lg:justify-self-end">
                        {!season.base && (
                          <Button
                            variant="outline"
                            className="w-full lg:w-[248px]"
                            onClick={() =>
                              setSeasonDetail(detailFor(season.name))
                            }
                          >
                            {t.edit}
                          </Button>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Section>

          {/* 8 — Restrictions */}
          <Section
            id={num("restrictions")}
            title={t.sections[7]!}
            body={t.restrictionsBody}
            locked={!basicsDone}
            tone={basicsDone ? "done" : "locked"}
            right={
              hasRestrictions ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRuleDrawer("add")}
                >
                  {t.addRestriction}
                </Button>
              ) : undefined
            }
          >
            <ChoiceRow
              value={hasRestrictions ? "add" : "none"}
              onChange={(next) => setHasRestrictions(next === "add")}
              options={[
                { value: "add", label: t.addToContract },
                { value: "none", label: t.noneOnContract },
              ]}
            />
            {!hasRestrictions && (
              <p className="mt-3 text-xs leading-relaxed text-text-muted">
                {t.restrictionsNone}
              </p>
            )}
            {hasRestrictions && (
              <>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[820px] border-collapse text-sm">
                    <thead>
                      <tr className="text-overline text-text-muted">
                        {[t.colApplies, t.colDates, t.colMinNights, t.colChecks, t.colStatus].map(
                          (cell) => (
                            <th key={cell} className="py-2 text-start font-semibold">
                              {cell}
                            </th>
                          )
                        )}
                        <th className="py-2 text-end font-semibold" />
                      </tr>
                    </thead>
                    <tbody>
                      {contractRestrictions.map((rule) => (
                        <tr
                          key={`${rule.scope}-${rule.dates}`}
                          className="border-t border-border-subtle align-top"
                        >
                          <td className="py-3 pe-3">
                            <p className="text-text-primary">
                              {lang === "ar" ? rule.scopeAr : rule.scope}
                            </p>
                            <p className="mt-0.5 text-xs text-text-muted">
                              {lang === "ar" ? rule.updatedAr : rule.updated}
                            </p>
                          </td>
                          <td className="py-3 pe-3 text-text-secondary">
                            <p>{lang === "ar" ? rule.datesAr : rule.dates}</p>
                            {(lang === "ar" ? rule.overlapAr : rule.overlap) && (
                              <p className="mt-0.5 text-xs text-status-warning">
                                {lang === "ar" ? rule.overlapAr : rule.overlap}
                              </p>
                            )}
                          </td>
                          <td className="py-3 pe-3 text-text-secondary">
                            {lang === "ar" ? rule.minNightsAr : rule.minNights}
                          </td>
                          <td className="py-3 pe-3 text-text-secondary">
                            {lang === "ar" ? rule.checksAr : rule.checks}
                          </td>
                          <td className="py-3 pe-3">
                            <StatusPill tone={rule.active ? "success" : "neutral"}>
                              {rule.active ? t.active : t.inactive}
                            </StatusPill>
                          </td>
                          <td className="py-3 text-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setRuleDrawer("edit")}
                            >
                              {t.edit}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setDayScope({
                                  kind: "weekday",
                                  label:
                                    lang === "ar"
                                      ? "كل جمعة · ١٨ فبراير - ٩ مارس"
                                      : "Every Friday · 18 Feb - 09 Mar",
                                  meta:
                                    lang === "ar"
                                      ? "٣ جُمَع في هذا النطاق"
                                      : "3 Fridays in this range",
                                })
                              }
                            >
                              {t.colChecks}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-status-danger"
                              onClick={() => setRuleDrawer("delete")}
                            >
                              {t.delete}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  {t.restrictionsNote}
                </p>
              </>
            )}
          </Section>

          {/* 9 — Policies */}
          <Section
            id={num("policies")}
            title={t.sections[8]!}
            body={t.policiesBody}
            locked={!basicsDone}
            tone={basicsDone ? "done" : "locked"}
          >
            <ChoiceRow
              value={hasPolicies ? "add" : "none"}
              onChange={(next) => setHasPolicies(next === "add")}
              options={[
                { value: "add", label: t.addToContract },
                { value: "none", label: t.noneOnContract },
              ]}
            />
            {!hasPolicies && (
              <>
                <p className="mt-3 text-xs leading-relaxed text-text-muted">
                  {t.policiesNone}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-status-warning">
                  {t.policiesNoneWarn}
                </p>
              </>
            )}
            {hasPolicies && (
              <>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border-subtle p-4">
                    <p className="text-overline text-text-muted">
                      {t.cancellation}
                    </p>
                    <p className="mt-1.5 text-sm font-medium text-text-primary">
                      {t.cancellationValue}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      {t.cancellationTiers}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border-subtle p-4">
                    <p className="text-overline text-text-muted">{t.release}</p>
                    <p className="mt-1.5 text-sm font-medium text-text-primary">
                      {t.releaseValue}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      {t.releaseHint}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-overline text-text-muted">
                  {t.seasonPolicyOverline}
                </p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-sm">
                    <thead>
                      <tr className="text-overline text-text-muted">
                        {[t.colSegment, t.colDates, t.cancellation, ""].map((cell, index) => (
                          <th
                            key={cell || index}
                            className={cn(
                              "py-2 font-semibold",
                              index === 3 ? "text-end" : "text-start"
                            )}
                          >
                            {cell}
                          </th>
                        ))}
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
                                {t.editInSeason}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPolicy("cancellation")}
                  >
                    {t.editCancellation}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPolicy("release")}
                  >
                    {t.editRelease}
                  </Button>
                </div>
              </>
            )}
          </Section>

          {/* 10 — Review & activate */}
          <Section
            id={num("review")}
            title={t.sections[9]!}
            body={t.reviewBody}
            locked={!basicsDone}
            tone={
              !basicsDone ? "locked" : sectionDone("review") ? "done" : "open"
            }
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p
                className={cn(
                  "min-w-0 flex-1 text-sm",
                  seasonsDone ? "text-status-success" : "text-text-muted"
                )}
              >
                {seasonsDone ? t.reviewReady : t.reviewLocked}
              </p>
              <Button
                variant={seasonsDone ? "default" : "outline"}
                loading={saving}
                onClick={() => setReviewOpen(true)}
              >
                {t.reviewActivate}
              </Button>
            </div>
          </Section>
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
          mode={mode === "edit" ? "live" : "draft"}
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
          fixedPrice={fixed}
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

      {reviewOpen && (
        <ActivateDrawer
          working={saving}
          onClose={() => setReviewOpen(false)}
          onActivate={() => {
            setReviewOpen(false);
            activate();
          }}
        />
      )}

      {picker === "hotel" && (
        <PickerOverlay
          panel={hotelPickerPanel}
          icon="hotel"
          onClose={() => setPicker(null)}
          onConfirm={(index) => {
            setHotelId(hotelOptions[index]?.value ?? hotelOptions[0]?.value ?? "");
            setPicker(null);
          }}
        />
      )}
      {picker === "currency" && (
        <PickerOverlay
          panel={currencyPanel}
          icon="currency"
          onClose={() => setPicker(null)}
          onConfirm={() => {
            setCurrency("SAR");
            setPicker(null);
          }}
        />
      )}
      {(picker === "term" ||
        picker === "termError" ||
        picker === "termOverlap") && (
        <TermOverlay
          state={
            picker === "termError"
              ? "error"
              : picker === "termOverlap"
                ? "overlap"
                : "ok"
          }
          onClose={() => setPicker(null)}
          onConfirm={() => {
            setTerm("01 Sep 2026 - 31 Aug 2027");
            setPicker(null);
          }}
        />
      )}
      {picker === "weekend" && (
        <WeekendOverlay
          onClose={() => setPicker(null)}
          onConfirm={() => {
            setWeekend("thu-fri");
            setPicker(null);
          }}
        />
      )}
      {picker === "unsaved" && (
        <UnsavedOverlay
          onClose={() => setPicker(null)}
          onDiscard={() => navigate({ to: "/rate-contracts" })}
          onSave={() => navigate({ to: "/rate-contracts" })}
        />
      )}
      {picker === "overlap" && (
        <SeasonOverlapOverlay
          onClose={() => setPicker(null)}
          onUseDates={() => setPicker(null)}
        />
      )}

      {dayScope && (
        <RestrictionDayDialog
          scope={dayScope}
          checkIn={dayScope.kind === "weekday" ? false : true}
          onClose={() => setDayScope(null)}
        />
      )}
    </PageShell>
  );
}

