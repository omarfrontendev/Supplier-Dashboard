import { useMemo, useReducer, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  BedDouble,
  CalendarClock,
  ChevronDown,
  CircleAlert,
  FileText,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
} from "lucide-react";
import { PageHeader, PageShell, StatusPill } from "@/components/layout/page-shell";
import { Gated, usePermission } from "@/components/system/permission-gate";
import type { PermissionKey } from "@/lib/permissions";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { hotels } from "@/lib/demo-data";
import { fill, useLanguage } from "@/lib/i18n";
import { usePortal } from "@/lib/portal-store";
import { ConfirmOverlay, FilterMenu, FilterPanel } from "@/components/contracts/contract-overlays";
import {
  deleteDraftPanel,
  periodPanel,
  resumePanel,
  stopSellPanel,
} from "@/lib/contract-overlay-data";
import { useHotelContracts } from "@/api/modules/hotel-contract/useHotelContracts";
import { ReusablePagination } from "@/components/ui/ReusablePagination";
import { useDebounce } from "./my-hotels";
import { useContractHotels } from "@/api/modules/hotel-contract/contrac-tHotels/useContractHotels";
import { RowsSkeleton } from "@/components/ui/skeletons";
import { BookingType, PricingModel, SupplyContract } from "@/api/modules/hotel-contract/types";
import { ContractStatus } from "@/store/features/contracts/types";

export const Route = createFileRoute("/rate-contracts/")({
  head: () => ({
    meta: [
      { title: "Hotel supply contracts · Hoteliana Supplier Portal" },
      {
        name: "description",
        content: "Manage Hoteliana hotel supply contracts and selling states.",
      },
      { property: "og:title", content: "Hotel supply contracts · Hoteliana Supplier Portal" },
      {
        property: "og:description",
        content: "Hotel supply contracts, periods, inventory and operational actions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RateContractsPage,
});

type Action = "pause" | "resume" | "delete" | "terminate" | "stopSell" | null;

const copy = {
  en: {
    draft: "Draft",
    scheduled: "Scheduled",
    activated: "Active",
    paused: "Paused",
    expired: "Expired",
    terminated: "Terminated",
    allotmentBlock: "Allotment Block",
    basePlusSupplements: "Base Plus Supplements",
    fixedPerRoom: "Fixed Per Room",
    retry: "Retry",
    errorTitle: "Something went wrong",
    overline: "PROPERTY · HOTEL SUPPLY CONTRACTS",
    title: "Hotel supply contracts",
    subtitle:
      "One contract per hotel and period. Contracts are supplier-managed and go live the moment you publish them.",
    create: "Create supply contract",
    active: "Active contracts",
    activeHint: "across {count} hotels",
    rooms: "Rooms on sale",
    roomsHint: "allotment / night, all active",
    attention: "Need attention",
    attentionHint: "contracts · {count} issues",
    alerts: "Stock alerts",
    alertsHint: "rooms with ≤ 2 left tonight",
    search: "Search contract or hotel",
    periodLabel: "Period",
    statusLabel: "Status",
    hotelLabel: "Hotel",
    searchLabel: "SEARCH",
    allHotels: "All hotels",
    allStatuses: "All statuses",
    anyPeriod: "Any period",
    anyAttention: "Any",
    needAttention: "NEED ATTENTION",
    contract: "CONTRACT",
    period: "PERIOD",
    allotment: "ALLOTMENT / NIGHT",
    confirmation: "CONFIRMATION",
    soldOut: "WHEN SOLD OUT",
    release: "RELEASE",
    status: "STATUS",
    actions: "ACTIONS",
    available: "AVAILABLE",
    instant: "Allotment",
    request: "On Request",
    stop: "Stop sale",
    overbooking: "Overbooking +{count}",
    notSet: "Not set",
    none: "-",
    days: "days",
    daysBefore: "{count} days before",
    noAllotment: "No allotment",
    perNight: "{count} / night · {types}",
    types: "{count} types",
    oneType: "1 type",
    open: "Open",
    openHint: "Overview, rates & availability, bookings, activity",
    edit: "Edit operational settings",
    editHint: "Prices, seasons, stock, rules · live after Review & publish",
    amend: "Amend commercial contract",
    amendHint: "Term, type, currency · creates a new version",
    pause: "Pause",
    pauseHint: "Reversible · agents stop seeing it, bookings untouched",
    stopSell: "Stop sale whole contract",
    stopSellHint: "Stays active · nothing sellable for the chosen dates",
    resume: "Resume",
    resumeHint: "Restores every night to its state before the pause",
    terminate: "Terminate",
    terminateHint: "Irreversible · confirmed bookings are honoured",
    delete: "Delete draft",
    deleteHint: "Nothing was published",
    continue: "Continue draft",
    continueHint: "Pick up where you left",
    copyPeriod: "Copy to new period",
    copyPeriodHint: "Same rooms, seasons and rules · you set new dates",
    copyExpiredHint: "Rooms, seasons and rules come across · you set dates and prices",
    activity: "Activity & versions",
    activityHint: "Who changed what, and every contract version",
    view: "View",
    viewHint: "Read only",
    contractCount: "{count} contracts",
    showing: "Showing {shown} of {total} contracts",
    listFooter:
      "Actions change with the contract state - open ⋯ on any row to see what you can do.",
    sellStatus: "Sell status",
    clearFilter: "Clear filter",
    issues: "{count} issues",
    emptyTitle: "No supply contracts yet",
    emptyBody:
      "A contract is created for a hotel in My Hotels. Create the first one for any of your hotels.",
    emptyHotels: "See my approved hotels",
    filterEmptyTitle: "No contract matches these filters",
    clearAll: "Clear all filters",
    createFor: "Create a contract for {hotel}",
    noResults: "No contracts match these filters.",
    confirm: "Confirm action",
    cancel: "Cancel",
    confirmBody: "This updates the contract state immediately for this supplier view.",
    apply: "Confirm",
  },
  ar: {
    draft: "مسودة",
    scheduled: "مجدول",
    activated: "نشط",
    paused: "متوقف مؤقتًا",
    expired: "منتهي الصلاحية",
    terminated: "منهي",
    allotmentBlock: "حجز بحصة محددة",
    basePlusSupplements: "سعر أساسي مع إضافات",
    fixedPerRoom: "سعر ثابت للغرفة",
    retry: "إعادة المحاولة",
    errorTitle: "حدث خطأ ما",
    overline: "المنشأة · عقود توريد الفنادق",
    title: "عقود توريد الفنادق",
    subtitle: "عقد واحد لكل فندق وفترة. يدير المورّد العقود وتصبح مباشرة فور نشرها.",
    create: "إنشاء عقد توريد",
    active: "العقود النشطة",
    activeHint: "في {count} فنادق",
    rooms: "الغرف المعروضة",
    roomsHint: "حصة / ليلة، لكل النشطة",
    attention: "تحتاج انتباهك",
    attentionHint: "عقود · {count} ملاحظات",
    alerts: "تنبيهات المخزون",
    alertsHint: "غرف متبقٍ منها ≤ ٢ الليلة",
    search: "ابحث عن عقد أو فندق",
    periodLabel: "الفترة",
    statusLabel: "الحالة",
    hotelLabel: "الفندق",
    searchLabel: "البحث",
    allHotels: "كل الفنادق",
    allStatuses: "كل الحالات",
    anyPeriod: "أي فترة",
    anyAttention: "الكل",
    needAttention: "تحتاج انتباهك",
    contract: "العقد",
    period: "الفترة",
    allotment: "الحصة / الليلة",
    confirmation: "التأكيد",
    soldOut: "عند النفاد",
    release: "الاسترجاع",
    status: "الحالة",
    actions: "الإجراءات",
    available: "متاح",
    instant: "حصة مخصّصة",
    request: "عند الطلب",
    stop: "إيقاف البيع",
    overbooking: "تجاوز +{count}",
    notSet: "غير محدّد",
    none: "-",
    days: "أيام",
    daysBefore: "{count} أيام قبلها",
    noAllotment: "بلا حصة",
    perNight: "{count} / ليلة · {types}",
    types: "{count} أنواع",
    oneType: "نوع واحد",
    open: "فتح",
    openHint: "نظرة عامة، الأسعار والإتاحة، الحجوزات، النشاط",
    edit: "تعديل إعدادات التشغيل",
    editHint: "الأسعار والمواسم والمخزون والقواعد · تعمل بعد المراجعة والنشر",
    amend: "تعديل تجاري للعقد",
    amendHint: "المدة والنوع والعملة · يُنشئ إصدارًا جديدًا",
    pause: "إيقاف مؤقت",
    pauseHint: "قابل للتراجع · يتوقف ظهوره للوكلاء دون مساس بالحجوزات",
    stopSell: "إيقاف بيع العقد كله",
    stopSellHint: "يبقى نشطًا · لا شيء قابل للبيع في التواريخ المختارة",
    resume: "استئناف",
    resumeHint: "يعيد كل ليلة إلى حالتها قبل الإيقاف",
    terminate: "إنهاء",
    terminateHint: "غير قابل للتراجع · تُحترم الحجوزات المؤكدة",
    delete: "حذف المسودة",
    deleteHint: "لم يُنشر شيء",
    continue: "متابعة المسودة",
    continueHint: "أكمل من حيث توقفت",
    copyPeriod: "نسخ لفترة جديدة",
    copyPeriodHint: "نفس الغرف والمواسم والقواعد · تحدد تواريخ جديدة",
    copyExpiredHint: "تنتقل الغرف والمواسم والقواعد · تحدد التواريخ والأسعار",
    activity: "النشاط والإصدارات",
    activityHint: "من غيّر ماذا، وكل إصدارات العقد",
    view: "عرض",
    viewHint: "للقراءة فقط",
    contractCount: "{count} عقود",
    showing: "عرض {shown} من {total} عقود",
    listFooter: "تتغيّر الإجراءات بحسب حالة العقد - افتح ⋯ على أي صف لترى ما يمكنك فعله.",
    sellStatus: "حالة البيع",
    clearFilter: "إزالة الفلتر",
    issues: "{count} ملاحظات",
    emptyTitle: "لا عقود توريد بعد",
    emptyBody: "يُنشأ العقد لفندق من صفحة فنادقي. أنشئ أول عقد لأي من فنادقك.",
    emptyHotels: "عرض فنادقي المعتمدة",
    filterEmptyTitle: "لا عقد يطابق هذه الفلاتر",
    clearAll: "إزالة كل الفلاتر",
    createFor: "إنشاء عقد لـ {hotel}",
    noResults: "لا توجد عقود تطابق عوامل التصفية.",
    confirm: "تأكيد الإجراء",
    cancel: "إلغاء",
    confirmBody: "سيتم تحديث حالة العقد فورًا في عرض المورّد.",
    apply: "تأكيد",
  },
};

const PAGE_SIZE = 10;

interface FiltersState {
  page: number;
  search: string;
  hotelId: number | undefined;
  pricingModel: string | undefined;
  status: string;
}

type FiltersAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_HOTEL"; payload: number | undefined }
  | { type: "SET_PRICING_MODEL"; payload: string | undefined }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_STATUS"; payload: string };

const initialState: FiltersState = {
  page: 1,
  search: "",
  hotelId: undefined,
  pricingModel: undefined,
  status: "",
};

function filtersReducer(state: FiltersState, action: FiltersAction): FiltersState {
  switch (action.type) {
    case "SET_SEARCH":
      return {
        ...state,
        search: action.payload,
        page: 1,
      };

    case "SET_HOTEL":
      return {
        ...state,
        hotelId: action.payload,
        page: 1,
      };

    case "SET_PRICING_MODEL":
      return {
        ...state,
        pricingModel: action.payload,
        page: 1,
      };

    case "SET_PAGE":
      return {
        ...state,
        page: action.payload,
      };

    case "SET_STATUS":
      return {
        ...state,
        status: action.payload,
      };

    default:
      return state;
  }
}

function RateContractsPage() {
  const { lang } = useLanguage();
  const t = copy[lang];
  /* A count reads in the digits of the language around it. */
  const num = (value: number) => value.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");
  const { contracts, setContractState, deleteContract } = usePortal();

  // ====================================== //
  // ====================================== //
  // ====================================== //
  // ====================================== //
  // ====================================== //
  // ====================================== //

  const [filters, dispatch] = useReducer(filtersReducer, initialState);
  const debouncedSearch = useDebounce(filters.search, 500);

  const hotelContractsParams = {
    page: filters.page,
    limit: PAGE_SIZE,
    search: debouncedSearch,
    status: filters.status,
    ...(filters.hotelId !== undefined && { hotelId: filters.hotelId }),
    ...(filters.pricingModel !== undefined && { pricingModel: filters.pricingModel }),
  };

  const { data, isPending, isError, refetch, error } = useHotelContracts(hotelContractsParams);

  const filtered = data?.contracts;
  const meta = data?.meta;

  const { data: hotelsData, isPending: isHotelsLoading } = useContractHotels({
    page: 1,
    limit: 100,
  });

  const hotels = hotelsData?.hotels ?? [];

  const [query, setQuery] = useState("");
  const [hotel, setHotel] = useState("");
  const [status, setStatus] = useState("");
  const [period, setPeriod] = useState("");
  const [attention, setAttention] = useState("");
  const [pending, setPending] = useState<{ contract: SupplyContract; action: Action } | null>(null);
  /* OV 03.0G / 03.0L — the two panels the list opens over itself. */
  const [panel, setPanel] = useState<"attention" | "period" | null>(null);
  // const filtered = useMemo(
  //   () =>
  //     contracts.filter((item) => {
  //       const h = hotels.find((x) => x.id === item.hotelId);
  //       const hay = `${item.name} ${item.nameAr} ${h?.nameEn} ${h?.nameAr}`.toLowerCase();
  //       return (
  //         (!query || hay.includes(query.toLowerCase())) &&
  //         (!hotel || item.hotelId === hotel) &&
  //         (!status || item.status === status) &&
  //         (!period || item.period === period) &&
  //         (!attention || Boolean(item.attention))
  //       );
  //     }),
  //   [contracts, query, hotel, status, period, attention],
  // );
  // Figma counts a scheduled contract as active — both rows offer "Open".
  // UI 03.0 draws these four numbers for the whole account, not for the rows below.
  const stats = { active: 3, hotels: 3, rooms: 24, attention: 2, issues: 4, alerts: 2 };
  // const activeContracts = contracts.filter(
  //   (item) => item.status === "active" || item.status === "scheduled",
  // );
  // const activeHotels = new Set(activeContracts.map((item) => item.hotelId)).size;
  // const activeRooms = activeContracts.reduce((sum, item) => sum + item.allotment, 0);
  // const attentionCount = contracts.filter((item) => Boolean(item.attention)).length;
  // const issueCount = contracts.reduce((sum, item) => sum + (item.attention ? 2 : 0), 0);
  // const stockAlerts = contracts.filter(
  //   (item) => item.status === "active" && item.allotment > 0 && item.allotment <= 8,
  // ).length;
  const act = () => {
    if (!pending?.action) return;
    if (pending.action === "delete") deleteContract(pending.contract.id);
    else
      setContractState(
        pending.contract.id,
        pending.action === "pause"
          ? "paused"
          : pending.action === "resume"
            ? "active"
            : "terminated",
      );
    setPending(null);
  };

  return (
    <PageShell>
      <PageHeader
        overline={t.overline}
        title={t.title}
        subtitle={t.subtitle}
        right={
          <div className="flex flex-wrap gap-3">
            <Link to="/sell-status">
              <Button variant="outline">{t.sellStatus}</Button>
            </Link>
            <Gated permission="contracts.create" instead={null}>
              <Link to="/rate-contracts/new" search={{ source: undefined }}>
                <Button>
                  <Plus className="h-4 w-4" />
                  {t.create}
                </Button>
              </Link>
            </Gated>
          </div>
        }
      />
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={<FileText />}
          value={num(stats.active)}
          label={t.active}
          hint={fill(t.activeHint, { count: stats.hotels })}
        />
        <Stat icon={<BedDouble />} value={num(stats.rooms)} label={t.rooms} hint={t.roomsHint} />
        <Stat
          icon={<CalendarClock />}
          value={num(stats.attention)}
          label={t.attention}
          hint={fill(t.attentionHint, { count: stats.issues })}
          warning
        />
        <Stat
          icon={<ShieldAlert />}
          value={num(stats.alerts)}
          label={t.alerts}
          hint={t.alertsHint}
          warning
        />
      </div>
      <section className="overflow-visible rounded-[14px] border border-border-subtle bg-surface-default shadow-card">
        <div className="grid gap-4 border-b border-border-subtle p-4 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr_.9fr]">
          <FilterField label={t.searchLabel}>
            <div className="relative">
              <Search className="absolute start-3 top-3 h-4 w-4 text-text-muted" />
              <Input
                aria-label={t.search}
                placeholder={t.search}
                value={filters.search}
                onChange={(e) =>
                  dispatch({
                    type: "SET_SEARCH",
                    payload: e.target.value,
                  })
                }
                className="[&_input]:h-10 [&_input]:ps-10"
              />
            </div>
          </FilterField>
          <FilterField label={t.hotelLabel}>
            <Select
              size="sm"
              value={filters.hotelId != null ? String(filters.hotelId) : ""}
              onChange={(value) =>
                dispatch({
                  type: "SET_HOTEL",
                  payload: value ? Number(value) : undefined,
                })
              }
              placeholder={t.allHotels}
              clearable
              options={hotels.map((hotel) => ({
                value: String(hotel.id),
                label: lang === "ar" ? hotel.nameAr : hotel.nameEn,
                hint: fill(t.contractCount, {
                  count: contracts.filter((contract) => contract.hotelId === hotel.id).length,
                }),
              }))}
            />
          </FilterField>
          <FilterField label={t.statusLabel}>
            <StatusFilter
              value={filters.status}
              onChange={(e) => {
                dispatch({
                  type: "SET_STATUS",
                  payload: e,
                });
              }}
              lang={lang}
              t={t}
            />
          </FilterField>
          <FilterField label={t.periodLabel}>
            <button
              type="button"
              onClick={() => setPanel("period")}
              className="flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-border-default bg-surface-default px-3 text-start text-sm text-text-primary hover:bg-surface-subtle"
            >
              <span className="truncate">{period || t.anyPeriod}</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" />
            </button>
          </FilterField>
          {/* <FilterField label={t.needAttention}>
            <div className="flex items-center gap-2">
              <FilterMenu
                panel={attentionPanel}
                onApply={() => setAttention("yes")}
                trigger={
                  <button
                    type="button"
                    className="flex h-10 min-w-0 flex-1 items-center justify-between gap-2 rounded-lg border border-border-default bg-surface-default px-3 text-start text-sm text-text-primary hover:bg-surface-subtle"
                  >
                    <span className="truncate">
                      {attention ? fill(t.issues, { count: issueCount }) : t.anyAttention}
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" />
                  </button>
                }
              />
              {attention && (
                <button
                  type="button"
                  onClick={() => setAttention("")}
                  className="shrink-0 whitespace-nowrap text-xs font-medium text-text-link hover:underline"
                >
                  {t.clearFilter}
                </button>
              )}
            </div>
          </FilterField> */}
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[1260px]">
            <div className="grid grid-cols-[1.25fr_1fr_.85fr_.8fr_.9fr_.6fr_110px_190px] bg-surface-subtle px-5 py-3 text-overline text-text-muted gap-x-4">
              <span>{t.contract}</span>
              <span>{t.period}</span>
              <span>{t.allotment}</span>
              <span>{t.confirmation}</span>
              <span>{t.soldOut}</span>
              <span>{t.release}</span>
              <span>{t.status}</span>
              <span>{t.actions}</span>
            </div>
            {filtered?.map((item) => (
              <ContractRow
                key={item.id}
                item={item}
                lang={lang}
                t={t}
                ask={(action) => setPending({ contract: item, action })}
              />
            ))}
            <ReusablePagination
              page={filters.page}
              totalPages={meta?.totalPages ?? 1}
              onPageChange={(newPage) =>
                dispatch({
                  type: "SET_PAGE",
                  payload: newPage,
                })
              }
              isLoading={isPending}
              lang={lang}
              showBorder
            />
          </div>
        </div>
        {isPending ? (
          <div className="border-t border-border-subtle p-4">
            <RowsSkeleton />
          </div>
        ) : isError ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-10 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <CircleAlert className="h-7 w-7 text-destructive" />
            </div>

            <h3 className="text-base font-semibold text-foreground">{t.errorTitle}</h3>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{error.message}</p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {t.retry}
            </button>
          </div>
        ) : !filtered?.length ? (
          <div className="p-12 text-center">
            <p className="text-base font-semibold text-text-primary">
              {contracts.length ? t.filterEmptyTitle : t.emptyTitle}
            </p>

            <p className="mx-auto mt-2 max-w-lg text-sm text-text-secondary">
              {contracts.length
                ? [
                    hotel &&
                      `${t.contract}: ${hotels.find((h) => h.id === hotel)?.nameEn ?? hotel}`,
                    status && `${t.status}: ${stateLabel(status, lang)}`,
                    period && `${t.period}: ${period}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")
                : t.emptyBody}
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {contracts.length ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      dispatch({
                        type: "SET_HOTEL",
                        payload: undefined,
                      });
                      dispatch({
                        type: "SET_SEARCH",
                        payload: "",
                      });
                      // Clear the remaining filters here if needed.
                    }}
                  >
                    {t.clearAll}
                  </Button>

                  {hotel && (
                    <Link to="/rate-contracts/new" search={{ source: undefined }}>
                      <Button>
                        {fill(t.createFor, {
                          hotel: hotels.find((h) => h.id === hotel)?.nameEn ?? hotel,
                        })}
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link to="/rate-contracts/new" search={{ source: undefined }}>
                    <Button>{t.create}</Button>
                  </Link>

                  <Link to="/my-hotels">
                    <Button variant="outline">{t.emptyHotels}</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : (
          <></>
          // Keep your existing contracts table/list here.
          // <ContractsList contracts={filtered} />
        )}
      </section>
      {Boolean(filtered?.length) && (
        <p className="mt-3 text-xs text-text-muted">
          {fill(t.showing, { shown: filtered?.length, total: contracts.length })}
        </p>
      )}
      <p className="mt-4 text-xs leading-5 text-text-muted">
        {filtered?.length
          ? t.listFooter
          : lang === "ar"
            ? "تعتمد إجراءات الصف على حالة العقد: النشط والمجدول يتيحان التشغيل والتعديل؛ المسودة للمتابعة أو الحذف؛ المنتهي للعرض أو النسخ فقط."
            : "Row actions depend on the contract state: Active · Scheduled → open, edit operational settings, amend, pause, stop sale, duplicate, terminate · Paused → resume · Draft → continue or delete · Expired → copy to a new period · Terminated → view only."}
      </p>
      {pending?.action === "stopSell" && (
        <ConfirmOverlay
          panel={stopSellPanel}
          onClose={() => setPending(null)}
          onConfirm={() => setPending(null)}
        />
      )}
      {pending?.action === "delete" && (
        <ConfirmOverlay panel={deleteDraftPanel} onClose={() => setPending(null)} onConfirm={act} />
      )}
      {pending?.action === "resume" && (
        <ConfirmOverlay panel={resumePanel} onClose={() => setPending(null)} onConfirm={act} />
      )}
      {(pending?.action === "pause" || pending?.action === "terminate") && (
        <Dialog open={Boolean(pending)} onOpenChange={(open) => !open && setPending(null)}>
          <DialogContent className="rounded-[14px] border-border-subtle bg-surface-default">
            <DialogHeader>
              <DialogTitle>{t.confirm}</DialogTitle>
              <DialogDescription>{t.confirmBody}</DialogDescription>
            </DialogHeader>
            <div className="rounded-lg bg-surface-subtle p-4 text-sm font-semibold text-text-primary">
              {pending?.contract.name}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPending(null)}>
                {t.cancel}
              </Button>
              <Button onClick={act}>{t.apply}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {panel === "period" && <FilterPanel panel={periodPanel} onClose={() => setPanel(null)} />}
    </PageShell>
  );
}

function bookingTypeLabel(bookingType: BookingType, t: typeof copy.en) {
  switch (bookingType) {
    case "allotment_block":
      return t.allotmentBlock;

    case "on_request":
      return t.request;
  }
}

function pricingModelLabel(pricingModel: PricingModel, t: typeof copy.en) {
  switch (pricingModel) {
    case "base_plus_supplements":
      return t.basePlusSupplements;

    case "fixed_per_room":
      return t.fixedPerRoom;
  }
}

function contractStatusLabel(status: ContractStatus, t: typeof copy.en) {
  switch (status) {
    case "draft":
      return t.draft;

    case "scheduled":
      return t.scheduled;

    case "active":
      return t.active;

    case "paused":
      return t.paused;

    case "expired":
      return t.expired;

    case "terminated":
      return t.terminated;
  }
}

function ContractRow({
  item,
  lang,
  t,
  ask,
}: {
  item: SupplyContract;
  lang: "en" | "ar";
  t: typeof copy.en;
  ask: (a: Action) => void;
}) {
  const formatDate = (date: string, lang: "en" | "ar") =>
    new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(date));

  const contractPeriod = `${formatDate(item.startDate, lang)} – ${formatDate(item.endDate, lang)}`;

  const statusLabel = contractStatusLabel(item.status, t);

  const hotel = hotels.find((h) => h.id === item.hotelId);
  const label = stateLabel(item.status, lang);
  const tone =
    item.status === "active"
      ? "success"
      : item.status === "scheduled"
        ? "info"
        : item.status === "paused" || item.status === "attention"
          ? "warning"
          : item.status === "terminated"
            ? "danger"
            : "neutral";
  return (
    <div className="grid grid-cols-[1.25fr_1fr_.85fr_.8fr_.9fr_.6fr_110px_190px] items-center border-t border-border-subtle px-5 py-4 text-xs gap-x-4">
      <div className="min-w-0">
        <span
          // to="/rate-contracts/$contractId"
          // params={{ contractId: item.id }}
          className="truncate w-full  block text-sm font-semibold text-text-primary hover:text-brand-mid"
        >
          {item.name}
        </span>
      </div>
      <span className="text-text-secondary">{contractPeriod}</span>
      <span className="font-data text-sm font-semibold text-text-primary">
        {bookingTypeLabel(item.bookingType, t)}
      </span>
      {/* <span>{item.model === "instant" ? t.instant : t.request}</span> */}
      <span>{pricingModelLabel(item.pricingModel, t)}</span>
      {/* <span>
        {item.soldOut === "stop"
          ? t.stop
          : item.soldOut === "onRequest"
            ? t.request
            : item.soldOut === "notSet"
              ? t.notSet
              : fill(t.overbooking, { count: item.overbooking ?? 2 })}
      </span> */}
      <span className="text-text-muted">—</span>
      {/* <span>
        {item.releaseDays === null ? t.none : fill(t.daysBefore, { count: item.releaseDays })}
      </span> */}
      <span className="text-text-muted">—</span>

      <StatusPill tone={tone}>
        {/* {t.available} */}
        {statusLabel}
      </StatusPill>
      <div className="flex items-center justify-end gap-1">
        <Link to="/rate-contracts/$contractId" params={{ contractId: item.id }}>
          <Button size="sm" variant="outline">
            {rowAction(item, t)}
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon-sm" aria-label={t.actions}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[320px] p-0">
            <div className="border-b border-border-subtle px-3 py-2.5">
              <p className="truncate text-sm font-semibold text-text-primary">
                {lang === "ar" ? item.nameAr : item.name}
              </p>
              <p className="mt-0.5 truncate text-xs text-text-muted">
                {label} · {hotel ? (lang === "ar" ? hotel.nameAr : hotel.nameEn) : "—"}
              </p>
            </div>
            <div className="p-1">
              {item.status === "draft" ? (
                <>
                  <ActionItem
                    to="/rate-contracts/$contractId/edit"
                    params={{ contractId: item.id }}
                    permission="contracts.edit"
                    title={t.continue}
                    hint={t.continueHint}
                  />
                  <ActionItem
                    danger
                    permission="contracts.edit"
                    title={t.delete}
                    hint={t.deleteHint}
                    onSelect={() => ask("delete")}
                  />
                </>
              ) : item.status === "expired" ? (
                <>
                  <ActionItem
                    to="/rate-contracts/$contractId"
                    params={{ contractId: item.id }}
                    title={t.view}
                    hint={t.viewHint}
                  />
                  <ActionItem
                    to="/rate-contracts/new"
                    search={{ source: item.id }}
                    permission="contracts.create"
                    title={t.copyPeriod}
                    hint={t.copyExpiredHint}
                  />
                  <ActionItem title={t.activity} hint={t.activityHint} />
                </>
              ) : item.status === "terminated" ? (
                <>
                  <ActionItem
                    to="/rate-contracts/$contractId"
                    params={{ contractId: item.id }}
                    title={t.view}
                    hint={t.viewHint}
                  />
                  <ActionItem title={t.activity} hint={t.activityHint} />
                </>
              ) : item.status === "paused" ? (
                <>
                  <ActionItem
                    to="/rate-contracts/$contractId"
                    params={{ contractId: item.id }}
                    title={t.open}
                    hint={t.openHint}
                  />
                  <ActionItem
                    permission="contracts.edit"
                    title={t.resume}
                    hint={t.resumeHint}
                    onSelect={() => ask("resume")}
                  />
                  <ActionItem
                    danger
                    permission="contracts.terminate"
                    title={t.terminate}
                    hint={t.terminateHint}
                    onSelect={() => ask("terminate")}
                  />
                  <ActionItem title={t.activity} hint={t.activityHint} />
                </>
              ) : (
                <>
                  <ActionItem
                    to="/rate-contracts/$contractId"
                    params={{ contractId: item.id }}
                    title={t.open}
                    hint={t.openHint}
                  />
                  <ActionItem
                    to="/rate-contracts/$contractId/edit"
                    params={{ contractId: item.id }}
                    permission="contracts.edit"
                    title={t.edit}
                    hint={t.editHint}
                  />
                  <ActionItem permission="contracts.edit" title={t.amend} hint={t.amendHint} />
                  <DropdownMenuSeparator />
                  <ActionItem
                    permission="contracts.edit"
                    title={t.pause}
                    hint={t.pauseHint}
                    onSelect={() => ask("pause")}
                  />
                  <ActionItem
                    permission="inventory.stop_sale"
                    title={t.stopSell}
                    hint={t.stopSellHint}
                    onSelect={() => ask("stopSell")}
                  />
                  <ActionItem
                    to="/rate-contracts/new"
                    search={{ source: item.id }}
                    permission="contracts.create"
                    title={t.copyPeriod}
                    hint={t.copyPeriodHint}
                  />
                  <ActionItem
                    danger
                    permission="contracts.terminate"
                    title={t.terminate}
                    hint={t.terminateHint}
                    onSelect={() => ask("terminate")}
                  />
                  <ActionItem title={t.activity} hint={t.activityHint} />
                </>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

/* BR-00-21 - in a menu, “hidden not disabled” means the row is not drawn.
   There is no room for a line naming who can, and a greyed row with no
   explanation is exactly what BR-00-22 forbids. */
function ActionItem({
  title,
  hint,
  to,
  params,
  search,
  danger = false,
  onSelect,
  permission,
}: {
  title: string;
  hint: string;
  to?: string;
  params?: Record<string, string>;
  search?: Record<string, string>;
  danger?: boolean;
  onSelect?: () => void;
  permission?: PermissionKey;
}) {
  const { can } = usePermission();
  if (permission && !can(permission)) return null;
  const body = (
    <span className="flex min-w-0 flex-col gap-0.5">
      <span
        className={
          danger
            ? "text-sm font-medium text-status-danger"
            : "text-sm font-medium text-text-primary"
        }
      >
        {title}
      </span>
      <span className="text-xs leading-4 text-text-muted">{hint}</span>
    </span>
  );
  if (to)
    return (
      <DropdownMenuItem asChild className="items-start py-2">
        <Link to={to as never} params={params as never} search={search as never}>
          {body}
        </Link>
      </DropdownMenuItem>
    );
  return (
    <DropdownMenuItem className="items-start py-2" onSelect={() => onSelect?.()}>
      {body}
    </DropdownMenuItem>
  );
}

function Stat({
  icon,
  value,
  label,
  hint,
  warning = false,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  hint: string;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-border-subtle bg-surface-default px-[18px] py-4">
      <span
        className={`flex h-[38px] w-[38px] items-center justify-center rounded-[10px] [&>svg]:h-[18px] [&>svg]:w-[18px] ${warning ? "bg-status-warning-bg text-status-warning" : "bg-primary-subtle text-brand-deep"}`}
      >
        {icon}
      </span>
      <div>
        <p className="text-overline text-text-muted">{label}</p>
        <div className="flex items-baseline gap-2">
          <strong className="font-data text-xl text-text-primary">{value}</strong>
          <span className="text-xs text-text-muted">{hint}</span>
        </div>
      </div>
    </div>
  );
}
function stateLabel(state: string, lang: "en" | "ar") {
  const labels = {
    active: ["Active", "نشط"],
    scheduled: ["Scheduled", "مجدول"],
    draft: ["Draft", "مسودة"],
    paused: ["Paused", "متوقف مؤقتًا"],
    expired: ["Expired", "منتهي"],
    terminated: ["Terminated", "تم إنهاؤه"],
    attention: ["Needs attention", "يحتاج انتباهك"],
  } as const;
  const pair = labels[state as keyof typeof labels];
  return pair?.[lang === "ar" ? 1 : 0] ?? state;
}

/** OV 03.0E — contract status, multi-select, with the archive note. */
const STATUS_COUNTS: Record<string, number> = {
  all: 7,
  active: 2,
  scheduled: 1,
  draft: 1,
  paused: 1,
  expired: 1,
  terminated: 1,
};
function StatusFilter({
  value,
  onChange,
  lang,
  t,
}: {
  value: string;
  onChange: (v: string) => void;
  lang: "en" | "ar";
  t: any;
}) {
  const ar = lang === "ar";
  const rows = ["active", "scheduled", "draft", "paused", "expired", "terminated"];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-10 items-center justify-between gap-2 rounded-lg border border-border-default bg-surface-default px-3 text-sm text-text-primary"
        >
          <span className="truncate">{value ? stateLabel(value, lang) : t.allStatuses}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[320px]">
        <DropdownMenuLabel className="text-overline text-text-muted">
          {ar ? "حالة العقد · اختيار متعدد" : "CONTRACT STATUS · MULTI-SELECT"}
        </DropdownMenuLabel>
        <DropdownMenuItem className="cursor-pointer justify-between" onSelect={() => onChange("")}>
          <span>{t.allStatuses}</span>
          <span className="font-data text-xs text-text-muted">{STATUS_COUNTS["all"]}</span>
        </DropdownMenuItem>
        {rows.map((row) => (
          <DropdownMenuItem
            key={row}
            className="cursor-pointer justify-between"
            onSelect={() => onChange(row)}
          >
            <span>{stateLabel(row, lang)}</span>
            <span className="font-data text-xs text-text-muted">{STATUS_COUNTS[row]}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <p className="px-2 py-2 text-[11px] leading-4 text-text-muted">
          {ar
            ? "المنتهي والمُنهى مخفيان افتراضيًا - أشّر عليهما لرؤية الأرشيف."
            : "Expired and Terminated are hidden by default - tick them to see the archive."}
        </p>
        <DropdownMenuSeparator />
        <div className="flex justify-end gap-2 px-2 py-2">
          <Button size="sm" variant="ghost" onClick={() => onChange("")}>
            {ar ? "مسح" : "Clear"}
          </Button>
          <Button size="sm" variant="dark">
            {ar ? "تطبيق" : "Apply"}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** UI 03.0 — every filter sits under its own label. */
function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-text-secondary">{label}</p>
      {children}
    </div>
  );
}

/** UI 03.0 — the row's primary action follows the contract's state. */
function rowAction(item: SupplyContract, t: typeof copy.en) {
  return item.status === "draft"
    ? t.continue
    : item.status === "paused"
      ? t.resume
      : item.status === "expired"
        ? t.copyPeriod
        : item.status === "terminated"
          ? t.view
          : t.open;
}
