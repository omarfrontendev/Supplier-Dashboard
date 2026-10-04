import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { RowsPerPage } from "@/components/layout/rows-per-page";
import { useMemo, useState } from "react";
import {
  Copy,
  Download,
  ExternalLink,
  FileText,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  TriangleAlert,
} from "lucide-react";
import {
  PageHeader,
  PageShell,
  SectionCard,
  StatusPill,
} from "@/components/layout/page-shell";
import { BookingStatus } from "@/components/bookings/booking-status";
import {
  BookingFilterOverlay,
  BookingSearchOverlay,
  ExportBookingsOverlay,
} from "@/components/bookings/booking-overlays";
import { FilterMenu } from "@/components/bookings/filter-menu";
import { DataStates, ShowingRows } from "@/components/system/data-states";
import { usePermission } from "@/components/system/permission-gate";
import { RowsSkeleton } from "@/components/ui/skeletons";
import { dataStateCopy } from "@/lib/data-state-copy";
import { usePagedList } from "@/lib/use-paged-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { counted, nightsWord, roomsWord } from "@/lib/arabic-count";
import { fill, useLanguage } from "@/lib/i18n";
import { bookingCopy } from "@/lib/booking-copy";
import { usePortal } from "@/lib/portal-store";
import type { Booking } from "@/lib/booking-data";

/** UI 05.0 — the list holds more than one page draws. */
const BOOKINGS_TOTAL = 47;
/** UI 05.0 prints these beside each chip. */
const CHIP_COUNTS: Record<string, number> = {
  all: 47,
  answer: 2,
  confirmed: 38,
  cancelled: 3,
  rejected: 3,
  expired: 1,
  cancelAsked: 1,
  amendAsked: 1,
};
const BOOKINGS_PER_PAGE = 20;
/** OV 05.15 prints these under each hotel, and 48 for all three. */
const HOTEL_TOTAL = 48;
const HOTEL_COUNTS: Record<string, number> = {
  "Al Noor Makkah Hotel": 41,
  "Rawdah Suites": 5,
  "Central Haram Hotel": 2,
};

/** OV 05.9 — every action in the row menu is an icon and a 13px label. */
const ROW_ITEM = "gap-2.5 px-2.5 py-[9px] text-[13px] font-medium";
const ROW_ICON = "h-4 w-4 shrink-0 text-brand-deep";

export const Route = createFileRoute("/bookings/")({
  /* §0.4 - the page and the rows-per-page live in the URL. */
  validateSearch: (
    search: Record<string, unknown>
  ): { page?: number; size?: number } => ({
    ...(Number(search["page"]) > 1 ? { page: Number(search["page"]) } : {}),
    ...(Number(search["size"]) ? { size: Number(search["size"]) } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Bookings · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Everything agents have booked on your hotels, and the requests waiting on your answer.",
      },
      { property: "og:title", content: "Bookings · Hoteliana Supplier Portal" },
      {
        property: "og:description",
        content: "Review and manage hotel bookings, confirmations and guest changes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BookingsPage,
});

/** The countdown Figma prints on each waiting request. */
const WAITING_META: Record<string, { due: string; left: number; arrived: string }> = {
  "HTL-88214": { due: "14:35", left: 21, arrived: "11:35" },
  "HTL-88213": { due: "15:10", left: 56, arrived: "12:10" },
};

/** Figma UI 05.0 — every booking, with the two requests waiting on you. */
function BookingsPage() {
  const { lang } = useLanguage();
  const t = bookingCopy[lang];
  const ar = lang === "ar";
  /* A count reads in the digits of the language around it. */
  const num = (value: number) =>
    value.toLocaleString(ar ? "ar-EG" : "en-US");
  /* A clock inside an Arabic sentence is written in Arabic digits. */
  const clock = (value: string) =>
    ar
      ? value.replace(/[0-9]/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]!)
      : value;
  const { bookings } = usePortal();

  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  /* OV 05.8 / 05.7 / 05.14 — the three panels the list opens. */
  const [panel, setPanel] = useState<"search" | "filter" | "export" | null>(
    null
  );
  const [hotel, setHotel] = useState("all");
  const [stay, setStay] = useState("all");
  const [booked, setBooked] = useState("all");
  const [sort, setSort] = useState("newest");

  const count = (predicate: (b: Booking) => boolean) =>
    bookings.filter(predicate).length;

  // UI 05.0 prints these against the whole account, not against the page.
  const chips: Array<[string, string, number]> = [
    ["all", t.all, CHIP_COUNTS["all"]!],
    ["answer", t.answer, CHIP_COUNTS["answer"]!],
    ["confirmed", t.confirmed, CHIP_COUNTS["confirmed"]!],
    ["cancelled", t.cancelled, CHIP_COUNTS["cancelled"]!],
    ["rejected", t.rejected, CHIP_COUNTS["rejected"]!],
    ["expired", t.expired, CHIP_COUNTS["expired"]!],
    ["cancellation", t.cancelAsked, CHIP_COUNTS["cancelAsked"]!],
    ["amendment", t.amendAsked, CHIP_COUNTS["amendAsked"]!],
  ];

  const { can } = usePermission();
  /* §0.5 - the guest's name and the money are each their own key. */
  const seesGuest = can("guest.pii");
  const seesMoney = can("bookings.view_financial");

  const filtered = useMemo(
    () =>
      bookings.filter((b) => {
        const matchesFilter =
          filter === "all" ||
          (filter === "answer"
            ? b.task === "answer"
            : filter === "cancellation"
              ? b.task === "cancellation"
              : filter === "amendment"
                ? b.task === "amendment"
                : b.status === filter);
        const q = term.trim().toLowerCase();
        return (
          matchesFilter &&
          (!q ||
            /* BR-00-24 - "البحث بالاسم مقفول": without guest.pii the
               name is not searchable either, or the column is hidden and
               the search leaks it back. */
            (seesGuest
              ? `${b.id} ${b.guest} ${b.guestAr} ${b.hotel}`
              : `${b.id} ${b.hotel}`
            ).toLowerCase().includes(q)) &&
          (hotel === "all" || b.hotel === hotel)
        );
      }),
    [bookings, filter, hotel, term]
  );

  /* §0.4 - one list, sliced by the page named in the address. */
  const paged = usePagedList(filtered);
  const anyFilter =
    filter !== "all" ||
    term.trim() !== "" ||
    hotel !== "all" ||
    stay !== "all" ||
    booked !== "all";
  const clearFilters = () => {
    setFilter("all");
    setTerm("");
    setHotel("all");
    setStay("all");
    setBooked("all");
  };

  const waiting = bookings.filter((b) => b.task === "answer");
  const hotels = Array.from(new Set(bookings.map((b) => b.hotel)));
  const onlyWaiting = filter === "answer";

  return (
    <PageShell>
      <PageHeader
        overline={t.overline}
        title={t.title}
        pill={
          <StatusPill tone="warning">
            {fill(t.needAnswerPill, { count: CHIP_COUNTS["answer"]! })}
          </StatusPill>
        }
        subtitle={t.subtitle}
        right={
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="neutral">
              {fill(t.arrivals, { count: 4 })}
            </StatusPill>
            <StatusPill tone="neutral">
              {fill(t.departures, { count: 3 })}
            </StatusPill>
            <Link to="/bookings/change-requests">
              <Button variant="outline">{t.changes}</Button>
            </Link>
            <Button variant="outline" onClick={() => setPanel("export")}>
              <Download className="h-4 w-4" aria-hidden="true" />
              {t.export}
            </Button>
          </div>
        }
      />

      {waiting.length > 0 && (
        <section className="mb-6 rounded-xl border border-status-warning/25 bg-status-warning-bg p-5">
          <p className="text-base font-semibold text-text-primary">
            {fill(t.needYou, { count: waiting.length })}
          </p>
          <p className="mt-1 max-w-4xl text-sm leading-relaxed text-text-secondary">
            {t.needYouNote}
          </p>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {waiting.map((b) => {
              const meta = WAITING_META[b.id];
              return (
                <article
                  key={b.id}
                  className="rounded-xl border border-border-subtle bg-surface-default p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-text-primary">
                        {ar ? b.guestAr : b.guest}
                      </h3>
                      <p className="font-data mt-0.5 truncate text-xs text-text-muted">
                        {b.id}&nbsp;&nbsp;·&nbsp;&nbsp;{ar ? b.hotelAr : b.hotel}
                      </p>
                    </div>
                    <StatusPill tone="info">{t.onRequest}</StatusPill>
                  </div>

                  <dl className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2">
                    {[
                      [t.cardRoom, ar ? b.offerAr : b.offer],
                      [t.cardStay, ar ? b.stayAr : b.stay],
                      [
                        t.cardSize,
                        `${fill(t.cardSize2, {
                          nights: counted(b.nights, nightsWord, ar ? "ar" : "en"),
                          rooms: counted(b.rooms, roomsWord, ar ? "ar" : "en"),
                        })}`.replace(
                          ar ? "١ غرف" : "1 rooms",
                          ar ? "غرفة واحدة" : "1 room"
                        ),
                      ],
                      [t.cardTotal, `${b.rate.toLocaleString(ar ? "ar-EG" : "en-US")} ${t.SAR}`],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-overline text-text-muted">{label}</dt>
                        <dd className="mt-0.5 text-sm text-text-primary">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-status-warning">
                        {meta
                          ? fill(t.respondBy, {
                            time: clock(meta.due),
                            left: meta.left,
                          })
                          : ""}
                      </p>
                      <p className="mt-0.5 text-xs text-text-muted">
                        {meta ? fill(t.arrived, { time: clock(meta.arrived) }) : ""}
                      </p>
                    </div>
                    <Link to="/bookings/$bookingId" params={{ bookingId: b.id }}>
                      <Button size="sm">{t.openDecide}</Button>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <SectionCard>
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {chips.map(([value, label, total]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-lg border px-3 py-1.5 text-sm transition-colors",
                filter === value
                  ? "border-surface-inverse bg-surface-inverse font-semibold text-text-inverse"
                  : "border-border-default text-text-secondary hover:bg-surface-subtle"
              )}
            >
              {label}
              <span className="font-data ms-2 text-xs opacity-70">{num(total)}</span>
            </button>
          ))}
        </div>

        <div className="mb-3 flex justify-end">
          {/* OV 05.7 — the filters that stack with the chips above. */}
          <Button variant="outline" size="sm" onClick={() => setPanel("filter")}>
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            {t.detail.narrow}
          </Button>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[360px_200px_180px_170px_minmax(0,1fr)_180px]">
          <label className="block">
            <span className="mb-[7px] block text-xs font-medium leading-4 text-text-primary">
              {t.searchLabel}
            </span>
            <span className="relative block">
              <Search
                className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted start-3"
                aria-hidden="true"
              />
              <Input
                aria-label={t.search}
                placeholder={t.search}
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                onClick={() => setPanel("search")}
                className="[&_input]:ps-10"
              />
            </span>
          </label>
          <FilterMenu
            label={t.hotelLabel}
            title={t.hotelLabel}
            hint={t.hotelMenuHint}
            value={hotel}
            onChange={setHotel}
            onAllFilters={() => setPanel("filter")}
            options={[
              {
                value: "all",
                label: fill(t.allHotels, { count: hotels.length }),
                note: fill(t.detail.bookingsCount, { count: HOTEL_TOTAL }),
              },
              ...hotels.map((name) => ({
                value: name,
                label: name,
                note: fill(t.detail.bookingsCount, {
                  count: HOTEL_COUNTS[name] ?? 0,
                }),
              })),
            ]}
          />
          <FilterMenu
            label={t.stayLabel}
            title={t.stayLabel}
            hint={t.stayMenuHint}
            value={stay}
            onChange={setStay}
            onAllFilters={() => setPanel("filter")}
            rangeValue="range"
            rangeHint={t.stayRangeHint}
            options={[
              { value: "all", label: t.anyStayDate, short: t.allStays },
              { value: "arriving", label: t.detail.arrivingToday, note: fill(t.detail.bookingsCount, { count: 4 }) },
              { value: "departing", label: t.detail.departingToday, note: fill(t.detail.bookingsCount, { count: 3 }) },
              { value: "month", label: t.detail.thisMonth, note: fill(t.detail.bookingsCount, { count: 22 }) },
              { value: "range", label: t.detail.pickRange, note: t.detail.pickRangeNote },
            ]}
          />
          <FilterMenu
            label={t.bookedLabel}
            title={t.bookedLabel}
            hint={t.bookedMenuHint}
            value={booked}
            onChange={setBooked}
            onAllFilters={() => setPanel("filter")}
            rangeValue="range"
            rangeHint={t.bookedRangeHint}
            /* A booking made on Sunday and again on Tuesday did not last
               three nights, so this range is days and not nights. */
            rangeCountsNights={false}
            options={[
              { value: "all", label: t.detail.anyTime, short: t.anyBooked },
              { value: "today", label: t.detail.today, note: fill(t.detail.bookingsCount, { count: 3 }) },
              { value: "7", label: t.detail.last7, note: fill(t.detail.bookingsCount, { count: 11 }) },
              { value: "30", label: t.detail.last30, note: fill(t.detail.bookingsCount, { count: 29 }) },
              { value: "range", label: t.detail.pickRange, note: t.detail.pickRangeNote },
            ]}
          />
          <span aria-hidden="true" className="hidden xl:block" />
          <FilterMenu
            label={t.sortLabel}
            title={t.sortLabel}
            hint={t.sortMenuHint}
            value={sort}
            onChange={setSort}
            onAllFilters={() => setPanel("filter")}
            options={[
              { value: "newest", label: t.newest },
              { value: "arriving", label: t.detail.sortArriving },
              { value: "deadline", label: t.detail.sortDeadline, note: t.detail.sortDeadlineNote },
              { value: "rate", label: t.detail.sortRate },
            ]}
          />
        </div>

        <DataStates
          count={filtered.length}
          filtered={anyFilter}
          onClearFilters={clearFilters}
          skeleton={<RowsSkeleton rows={8} />}
        >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] border-collapse text-sm">
            <thead>
              <tr className="text-overline text-text-muted">
                {[
                  t.reference,
                  /* §0.5 - without guest.pii the name is hidden, not blurred. */
                  seesGuest ? t.guest : ar ? "النزيل" : "GUEST",
                  t.hotelOffer,
                  t.stay,
                  t.rooms,
                  /* §0.5 - without bookings.view_financial the column goes. */
                  ...(seesMoney ? [t.rate] : []),
                  t.status,
                  "",
                ].map((cell, index) => (
                  <th
                    key={`${cell}-${index}`}
                    className={cn(
                      "py-2 font-semibold",
                      index === (seesMoney ? 7 : 6) ? "text-end" : "text-start"
                    )}
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.rows.map((b) => (
                <tr key={b.id} className="border-t border-border-subtle align-top">
                  <td className="font-data py-3 pe-3 text-text-primary">{b.id}</td>
                  <td className="py-3 pe-3 text-text-primary">
                    {seesGuest ? (
                      ar ? b.guestAr : b.guest
                    ) : (
                      <span className="text-text-muted">
                        {ar ? "النزيل مخفي" : "Guest hidden"}
                      </span>
                    )}
                  </td>
                  <td className="py-3 pe-3">
                    <p className="text-text-primary">{ar ? b.offerAr : b.offer}</p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {ar ? b.hotelAr : b.hotel}
                    </p>
                  </td>
                  <td className="py-3 pe-3">
                    <p className="text-text-secondary">{ar ? b.stayAr : b.stay}</p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {num(b.nights)} {ar ? "ليالٍ" : "nights"}
                    </p>
                  </td>
                  <td className="font-data py-3 pe-3 text-text-secondary">
                    {num(b.rooms)}
                  </td>
                  {seesMoney && (
                    <td className="font-data py-3 pe-3 text-text-primary">
                      {b.rate.toLocaleString(ar ? "ar-EG" : "en-US")} {t.SAR}
                    </td>
                  )}
                  <td className="py-3 pe-3">
                    <BookingStatus booking={b} />
                  </td>
                  <td className="py-3 text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link to="/bookings/$bookingId" params={{ bookingId: b.id }}>
                        <Button size="sm" variant="outline">
                          {b.task === "answer"
                            ? t.decide
                            : b.task === "amendment" || b.task === "cancellation"
                              ? t.review
                              : b.status === "confirmed"
                                ? t.open
                                : t.view}
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon-sm"
                            variant="outline"
                            aria-label={t.detail.rowOpen}
                          >
                            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-[284px] p-0"
                        >
                          {/* OV 05.9 — the booking is named before its actions. */}
                          <div className="px-2.5 pb-3 pt-2.5">
                            <p className="font-data truncate text-[9.5px] font-medium uppercase leading-[13px] text-text-muted">
                              {b.id} · {(ar ? b.guestAr : b.guest).toUpperCase()}
                            </p>
                            <p className="truncate text-[11.5px] leading-[15px] text-text-body">
                              {b.task === "reference"
                                ? t.detail.statusReference
                                : t.detail.statusConfirmed}
                            </p>
                          </div>
                          <DropdownMenuItem asChild className={ROW_ITEM}>
                            <Link to="/bookings/$bookingId" params={{ bookingId: b.id }}>
                              <FileText className={ROW_ICON} aria-hidden="true" />
                              {t.detail.rowOpen}
                            </Link>
                          </DropdownMenuItem>
                          {b.task === "reference" && (
                            <DropdownMenuItem className={ROW_ITEM}>
                              <Copy className={ROW_ICON} aria-hidden="true" />
                              {t.detail.rowAddNumber}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className={ROW_ITEM}>
                            <Copy className={ROW_ICON} aria-hidden="true" />
                            {t.detail.rowCopy}
                          </DropdownMenuItem>
                          <DropdownMenuItem className={ROW_ITEM}>
                            <ExternalLink className={ROW_ICON} aria-hidden="true" />
                            {t.detail.rowExport}
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className={ROW_ITEM}>
                            <Link
                              to="/bookings/$bookingId"
                              params={{ bookingId: b.id }}
                              search={{ issue: true }}
                              className="text-status-danger"
                            >
                              <TriangleAlert
                                className="h-4 w-4 shrink-0 text-status-danger"
                                aria-hidden="true"
                              />
                              {t.detail.reportIssue}
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </DataStates>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-4">
          {onlyWaiting ? (
            <p className="text-xs text-text-muted">
              {fill(t.showingWaiting, {
                shown: filtered.length,
                total: waiting.length,
              })}
            </p>
          ) : (
            <ShowingRows
              from={paged.from}
              to={paged.to}
              total={paged.total}
            />
          )}
          <div className="flex items-center gap-3">
            <RowsPerPage value={paged.size} onChange={paged.setSize} />
            {!onlyWaiting && paged.pages > 1 && (
              <nav className="flex items-center gap-1" aria-label="Pagination">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={dataStateCopy[ar ? "ar" : "en"].previous}
                  disabled={paged.page === 1}
                  reason={dataStateCopy[ar ? "ar" : "en"].firstPage}
                  onClick={() => paged.setPage(paged.page - 1)}
                >
                  {ar ? "›" : "‹"}
                </Button>
                {Array.from({ length: paged.pages }, (_, index) => index + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      size="icon-sm"
                      variant={page === paged.page ? "dark" : "ghost"}
                      onClick={() => paged.setPage(page)}
                    >
                      {num(page)}
                    </Button>
                  )
                )}
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={dataStateCopy[ar ? "ar" : "en"].next}
                  disabled={paged.page === paged.pages}
                  reason={dataStateCopy[ar ? "ar" : "en"].lastPage}
                  onClick={() => paged.setPage(paged.page + 1)}
                >
                  {ar ? "‹" : "›"}
                </Button>
              </nav>
            )}
          </div>
        </div>
      </SectionCard>

      <p className="mt-5 max-w-4xl text-xs leading-relaxed text-text-muted">
        {onlyWaiting ? t.waitingFooter : t.listFooter}
      </p>
      {panel === "search" && (
        <BookingSearchOverlay
          onClose={() => setPanel(null)}
          onOpenFirst={() => {
            setPanel(null);
            navigate({
              to: "/bookings/$bookingId",
              params: { bookingId: "HTL-88214" },
            });
          }}
        />
      )}

      {panel === "filter" && (
        <BookingFilterOverlay onClose={() => setPanel(null)} />
      )}

      {panel === "export" && (
        <ExportBookingsOverlay
          count={filtered.length}
          onClose={() => setPanel(null)}
        />
      )}
    </PageShell>
  );
}
