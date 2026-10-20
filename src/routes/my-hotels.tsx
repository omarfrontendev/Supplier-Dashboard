import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  FileClock,
  FilePlus2,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { LibraryFilterOverlay } from "@/components/hotels/library-overlays";
import { myHotelsFilter } from "@/lib/library-overlay-data";
import { PageHeader, PageShell, SectionCard, StatusPill } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { fill, useLanguage } from "@/lib/i18n";
import { usePortal } from "@/lib/portal-store";
import { hotels } from "@/lib/demo-data";
import { HotelGridSkeleton } from "@/components/ui/skeletons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchHotels } from "@/store/features/hotels/hotels.slice";
import { ReusablePagination } from "@/components/ui/ReusablePagination";

// import countries from "i18n-iso-countries";
// import en from "i18n-iso-countries/langs/en.json";
// import ar from "i18n-iso-countries/langs/ar.json";

// countries.registerLocale(en);
// countries.registerLocale(ar);

export const useDebounce = <T,>(value: T, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export const getCountryName = (countryCode: string, lang: "en" | "ar") => {
  const locale = lang === "ar" ? "ar" : "en";

  return (
    new Intl.DisplayNames([locale], {
      type: "region",
    }).of(countryCode) ?? countryCode
  );
};

export const Route = createFileRoute("/my-hotels")({
  head: () => ({
    meta: [
      { title: "My Hotels · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "See the hotels linked to your supplier account and the state of each rate contract.",
      },
      { property: "og:title", content: "My Hotels · Hoteliana Supplier Portal" },
      {
        property: "og:description",
        content: "Linked hotels and rate contract status in one view.",
      },
    ],
  }),
  component: MyHotelsPage,
});

function MyHotelsPage() {
  const { c, lang } = useLanguage();
  const { relations } = usePortal();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState(null);
  const [filter, setFilter] = useState(false);

  // ================================================ //
  // ================================================ //
  // ================================================ //

  const debouncedQuery = useDebounce(query, 500);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  const {
    hotels: linkedHotels,
    meta,
    loading,
    error,
  } = useSelector((state: RootState) => state.hotels);

  const totalPages = meta?.totalPages ?? 1;
  const PAGE_SIZE = 10;

  useEffect(() => {
    dispatch(
      fetchHotels({
        page,
        limit: PAGE_SIZE,
        search: debouncedQuery,
        countryCode: city === "all" ? null : city,
        status: state,
      }),
    );
  }, [dispatch, page, debouncedQuery, city, state]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, city, state]);

  // ================================================ //
  // ================================================ //
  // ================================================ //
  // ================================================ //

  const allLinked = hotels.filter((hotel) => (relations[hotel.id] ?? hotel.relation) === "linked");
  const cities = useMemo(
    () => Array.from(new Set(allLinked.map((hotel) => hotel.city))),
    [allLinked],
  );
  // const linked = allLinked.filter((hotel) => {
  //   const name = lang === "ar" ? hotel.nameAr : hotel.nameEn;
  //   if (query && !name.toLowerCase().includes(query.toLowerCase())) return false;
  //   if (city !== "all" && hotel.city !== city) return false;
  //   if (state !== "all" && (hotel.contract ?? "none") !== state) return false;
  //   return true;
  // });
  // Figma UI 02.6 counts hotels, not contracts: 0 without a contract, 1 draft, 2 selling.
  const noContract = allLinked.filter((hotel) => (hotel.contract ?? "none") === "none").length;
  const drafts = allLinked.filter((hotel) => hotel.contract === "draft").length;
  const selling = allLinked.filter((hotel) => hotel.contract === "selling").length;
  const needsAttention = allLinked.filter((hotel) => hotel.needsAttention).length;

  return (
    <PageShell>
      <PageHeader
        overline={c.myHotels.overline}
        title={c.myHotels.title}
        subtitle={c.myHotels.subtitle}
        right={
          <Link to="/hotels">
            <Button variant="outline">{c.myHotels.browseLibrary}</Button>
          </Link>
        }
      />
      <SectionCard className="mb-6">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-text-primary">
              {c.myHotels.search}
            </span>
            <span className="relative block">
              <Search
                className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted start-3"
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={c.myHotels.searchPh}
                className="h-11 w-full rounded-[10px] border border-border-default bg-surface-default ps-10 pe-4 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
              />
            </span>
          </label>
          <Select
            label={c.profile.country}
            value={city}
            onChange={setCity}
            // options={countryOptions}
            options={[
              {
                value: null,
                label: lang === "ar" ? "الكل" : "All",
              },
              {
                value: "SA",
                label: lang === "ar" ? "السعودية" : "Saudi Arabia",
              },
            ]}
          />
          <Select
            label={c.myHotels.contractState}
            value={state}
            onChange={setState}
            options={[
              { value: null, label: c.myHotels.anyState },
              { value: "approved", label: lang === "ar" ? "معتمد" : "Approved" },
              { value: "suspended", label: lang === "ar" ? "موقوف" : "suspended" },
            ]}
          />
        </div>
        {/* OV 02.11 — your hotels, by where their supply actually stands. */}
        <div className="flex justify-end px-5 pb-5">
          {/* <Button variant="outline" size="sm" onClick={() => setFilter(true)}>
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            {c.library.filter}
          </Button> */}
        </div>
      </SectionCard>
      {filter && (
        <LibraryFilterOverlay
          copy={myHotelsFilter}
          width="660px"
          columns={1}
          search
          count={linked.length}
          onClose={() => setFilter(false)}
        />
      )}
      {loading ? (
        <HotelGridSkeleton count={4} />
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-dashed border-border-default bg-surface-default p-10 text-center text-sm text-text-secondary"
        >
          {lang === "ar"
            ? "حدث خطأ أثناء تحميل الفنادق. حاول مرة أخرى."
            : "Something went wrong while loading hotels. Please try again."}
        </div>
      ) : linkedHotels.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-default bg-surface-default p-10 text-center">
          <p className="text-sm text-text-secondary">{c.myHotels.empty}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {linkedHotels.map(({ hotel }) => {
              const contractStatus =
                hotel.contract === "selling"
                  ? c.myHotels.status.selling
                  : hotel.contract === "draft"
                    ? c.myHotels.status.draft
                    : c.myHotels.status.noContract;

              return (
                <article
                  key={hotel.id}
                  className="rounded-2xl border border-border-subtle bg-surface-default p-5 shadow-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-semibold text-text-primary md:max-w-[250px]">
                        {lang === "ar" ? hotel.nameAr : hotel.nameEn}
                      </h2>

                      <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-text-secondary">
                        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {getCountryName(hotel.countryCode, lang)} · {hotel.city}
                      </p>
                    </div>

                    <StatusPill
                      tone={
                        hotel.contract === "selling"
                          ? "success"
                          : hotel.contract === "draft"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {hotel.needsAttention && (
                        <AlertTriangle className="me-1.5 h-3.5 w-3.5" aria-hidden="true" />
                      )}

                      {contractStatus}
                    </StatusPill>
                  </div>

                  <div className="mt-3 flex items-center gap-1">
                    {Array.from({ length: hotel.starRating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-current text-status-warning"
                        aria-hidden="true"
                      />
                    ))}

                    <span className="font-data ms-2 text-xs text-text-muted">
                      {hotel.starRating}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link to="/rate-contracts" className="hidden">
                      <Button size="sm">
                        {hotel.contractAction === "draft"
                          ? c.myHotels.continueDraft
                          : hotel.contractAction === "expiring"
                            ? c.myHotels.reviewExpiring
                            : hotel.contractAction === "open"
                              ? c.myHotels.openContract
                              : c.myHotels.createContract}
                      </Button>
                    </Link>

                    <Link to="/hotel/$hotelId" params={{ hotelId: hotel.id }}>
                      <Button size="sm" variant="outline">
                        {c.myHotels.openProfile}
                      </Button>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
          {!loading && totalPages > 1 && (
            <SectionCard className="mt-6">
              <ReusablePagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                isLoading={loading}
                lang={lang}
                showBorder={false}
              />
            </SectionCard>
          )}
        </>
      )}
      <p className="mt-6 max-w-3xl text-xs leading-relaxed text-text-muted">{c.myHotels.note}</p>
    </PageShell>
  );
}

function SetupStat({
  icon,
  label,
  value,
  note,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
  tone?: "neutral" | "warning";
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border-subtle bg-surface-default p-4 shadow-card">
      <span
        className={
          tone === "warning"
            ? "flex h-10 w-10 items-center justify-center rounded-lg bg-status-warning-bg text-status-warning"
            : "flex h-10 w-10 items-center justify-center rounded-lg bg-surface-subtle text-text-secondary"
        }
      >
        {icon}
      </span>
      <div>
        <p className="text-overline text-text-muted">{label}</p>
        <div className="mt-1 flex items-baseline gap-2">
          <strong className="font-data text-xl text-text-primary">{value}</strong>
          <span className="text-xs text-text-secondary">{note}</span>
        </div>
      </div>
    </div>
  );
}
