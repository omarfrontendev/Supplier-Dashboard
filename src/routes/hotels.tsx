import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Clock, MapPin, Plus, Search, SlidersHorizontal, Star } from "lucide-react";
import {
  Banner,
  PageHeader,
  PageShell,
  SectionCard,
  StatusPill,
} from "@/components/layout/page-shell";
import {
  ConfirmRequestOverlay,
  HotelQuickView,
  LibraryFilterOverlay,
  LibrarySearchOverlay,
  RequestSentOverlay,
} from "@/components/hotels/library-overlays";
import { libraryFilter, quickView } from "@/lib/library-overlay-data";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { HotelCard } from "@/components/hotels/hotel-card";
import { accessRequestsWord, counted, hotelsAreWord, hotelsSelectedWord } from "@/lib/arabic-count";
import { fill, useLanguage } from "@/lib/i18n";
import { notify, wait } from "@/lib/notify";
import { useRemoteData } from "@/lib/use-remote-data";
import { HotelGridSkeleton } from "@/components/ui/skeletons";
import { usePortal } from "@/lib/portal-store";
import { hotels, type HotelRelation } from "@/lib/demo-data";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotelsOptions } from "@/store/features/hotels/hotel-options.slice";
import { RootState } from "@/store";
import { getCountryName, useDebounce } from "./my-hotels";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/store";
// import { fetchHotels } from "@/store/features/hotels/hotels.slice";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import ar from "i18n-iso-countries/langs/ar.json";

countries.registerLocale(en);
countries.registerLocale(ar);

export const Route = createFileRoute("/hotels")({
  /* UI 02.1 — the first visit, where no hotel is linked yet and every
     card can be picked. Without it the request flow cannot be walked. */
  validateSearch: (search: Record<string, unknown>): { state?: "first" } =>
    search["state"] === "first" ? { state: "first" } : {},
  head: () => ({
    meta: [
      { title: "Hotel Library · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Browse Hoteliana's hotel library, request access to the hotels you sell, or add a missing hotel.",
      },
      {
        property: "og:title",
        content: "Hotel Library · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content: "Find hotels and request supplier access in a few clicks.",
      },
    ],
  }),
  component: HotelLibraryPage,
});

const tones: Record<HotelRelation, "neutral" | "warning" | "success" | "danger"> = {
  available: "neutral",
  requested: "warning",
  linked: "success",
  notApproved: "danger",
  suspended: "warning",
};

function HotelLibraryPage() {
  const { c, lang } = useLanguage();
  const navigate = useNavigate();
  const { state } = Route.useSearch();
  const firstVisit = state === "first";
  const { relations, requestAccess } = usePortal();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("all");
  const [stars, setStars] = useState("all");
  const [status, setStatus] = useState("all");
  const [picked, setPicked] = useState<string[]>([]);
  const [quickId, setQuickId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [sentRefs, setSentRefs] = useState<string[]>([]);
  /* What this first visit has sent, which the seeded relations cannot say. */
  const [asked, setAsked] = useState<string[]>([]);
  const [sentNames, setSentNames] = useState<string[]>([]);
  const ar = lang === "ar";
  const quickHotel = hotels.find((item) => item.id === quickId);
  /* OV 02.10 / 02.9 — the two panels the library opens over itself. */
  const [panel, setPanel] = useState<"search" | "filter" | null>(null);
  const [sending, setSending] = useState(false);
  // const { loading } = useRemoteData(() => hotels);

  const sendRequest = async (ids: string[]) => {
    setSending(true);
    try {
      await wait(650);
      requestAccess(ids);
      setAsked((prev) => [...new Set([...prev, ...ids])]);
      /* OV 02.4 prints the reference each hotel was sent under. */
      setSentRefs(ids.map((_, index) => `ACC-0483${index + 1}`));
      setSentNames(
        ids.map((id) => {
          const hotel = hotels.find((item) => item.id === id);
          return hotel ? (ar ? hotel.nameAr : hotel.nameEn) : id;
        }),
      );
      setSentCount(ids.length);
      notify.success(c.toast.accessRequested, {
        description: fill(c.toast.accessRequestedDesc, {
          hotels: counted(ids.length, hotelsAreWord, ar ? "ar" : "en"),
        }),
      });
    } catch {
      notify.error(c.toast.failed);
    } finally {
      setSending(false);
    }
  };

  const cities = useMemo(() => Array.from(new Set(hotels.map((h) => h.city))), []);

  const displayOrder = ["HTL-1048", "HTL-1052", "HTL-1091", "HTL-1077", "HTL-1104", "HTL-1162"];
  /*
   * UI 02.1 - the first visit is where every hotel starts, not a mask
   * held over the page for as long as you stay on it. The store seeds a
   * relation for every hotel, so a first visit cannot read from it - it
   * remembers what it sent instead, and a hotel it has just asked for is
   * requested like anywhere else. It used to say Available while the
   * request was already with Hoteliana, with a checkbox to ask again.
   */
  const relationOf = (hotel: (typeof hotels)[number]): HotelRelation =>
    firstVisit
      ? asked.includes(hotel.id)
        ? "requested"
        : "available"
      : (relations[hotel.id] ?? hotel.relation);

  // const visible = [...hotels]
  //   .sort((a, b) => {
  //     const ai = displayOrder.indexOf(a.id);
  //     const bi = displayOrder.indexOf(b.id);
  //     return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
  //   })
  //   .filter((hotel) => {
  //     const name = lang === "ar" ? hotel.nameAr : hotel.nameEn;
  //     const relation = relationOf(hotel);
  //     if (query && !name.toLowerCase().includes(query.toLowerCase())) return false;
  //     if (city !== "all" && hotel.city !== city) return false;
  //     if (stars !== "all" && String(hotel.stars) !== stars) return false;
  //     if (status !== "all" && relation !== status) return false;
  //     return true;
  //   })
  //   .slice(0, 6);

  /* UI 02.1D - the banner counts what is actually with Hoteliana, which
     on a first visit is nothing until you send one. */
  const pendingCount = hotels.filter((hotel) => relationOf(hotel) === "requested").length;

  // ================================================================= //
  // ================================================================= //
  // ================================================================= //
  // ================================================================= //

  const dispatch = useDispatch();

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    dispatch(
      fetchHotelsOptions({
        page: 1,
        limit: 20,
        search: debouncedQuery,
        countryCode: country === "all" ? null : country,
      }),
    );
  }, [dispatch, debouncedQuery, country]);

  const {
    hotels: hotelsOption,
    meta,
    loading,
    error,
  } = useSelector((state: RootState) => state.hotelsOption);

  const countryOptions = [
    {
      value: "all",
      label: c.myHotels.allCountries,
    },
    ...Object.keys(countries.getAlpha2Codes()).map((code) => ({
      value: code,
      label: getCountryName(code, lang),
    })),
  ];

  return (
    <PageShell>
      <PageHeader
        overline={c.library.overline}
        title={c.library.title}
        subtitle={c.library.subtitle}
        right={
          <>
            <StatusPill tone="neutral">{fill(c.library.count, { count: 128 })}</StatusPill>
            <Link to="/add-hotel">
              <Button variant="outline">
                <Plus className="h-4 w-4" aria-hidden="true" />
                {c.library.addMissing}
              </Button>
            </Link>
          </>
        }
      />

      {pendingCount > 0 && (
        <Banner
          tone="warning"
          icon={<Clock className="h-5 w-5" aria-hidden="true" />}
          title={fill(c.library.pendingTitle, {
            requests: counted(pendingCount, accessRequestsWord, ar ? "ar" : "en"),
          })}
          body={c.library.pendingBody}
          action={
            <Button variant="outline" size="sm" onClick={() => setStatus("requested")}>
              {c.library.viewRequests}
            </Button>
          }
        />
      )}

      <SectionCard className="mb-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-text-primary">
              {c.library.search}
            </span>
            <span className="relative block">
              <Search
                className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted start-3"
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                // onClick={() => setPanel("search")}
                placeholder={c.library.searchPh}
                className="h-10 w-full rounded-md border border-border-default bg-surface-default ps-9 pe-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-border-focus"
              />
            </span>
          </label>

          <Select
            value={country}
            onChange={setCountry}
            label={c.profile.country}
            options={countryOptions}
          />

          {/* <Select
            label={c.library.city}
            value={city}
            onChange={setCity}
            options={[
              { value: "all", label: c.library.allCities },
              ...cities.map((item) => ({ value: item, label: item })),
            ]}
          /> */}
          <Select
            label={c.library.category}
            value={stars}
            onChange={setStars}
            options={[
              { value: "all", label: c.library.allStars },
              ...[5, 4, 3].map((n) => ({
                value: String(n),
                label: fill(c.library.stars, { count: n }),
              })),
            ]}
          />
          <Select
            label={c.library.relationship}
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: c.library.allStatuses },
              ...(["available", "requested", "linked", "notApproved", "suspended"] as const).map(
                (key) => ({ value: key, label: c.library.status[key] }),
              ),
            ]}
          />
        </div>
        <div className="flex justify-end px-5 pb-5">
          <Button variant="outline" size="sm" onClick={() => setPanel("filter")}>
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            {c.library.filter}
          </Button>
        </div>
      </SectionCard>

      {loading ? (
        <HotelGridSkeleton />
      ) : hotelsOption.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-default bg-surface-default p-10 text-center text-sm text-text-secondary">
          {c.library.empty}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {hotelsOption.map((hotel) => {
            const relation = relationOf(hotel);
            const active = picked.includes(hotel.id);
            return (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                relation={relation}
                selected={active}
                // onToggle={() =>
                //   setPicked((prev) =>
                //     prev.includes(hotel.id)
                //       ? prev.filter((id) => id !== hotel.id)
                //       : [...prev, hotel.id],
                //   )
                // }
                note={
                  relation === "requested"
                    ? /* A request sent a moment ago did not go two days
                         ago, whatever the seeded card says. */
                      asked.includes(hotel.id)
                      ? c.library.sentJustNow
                      : fill(c.library.sentAgo, {
                          days: hotel.id === "HTL-1091" ? 3 : 2,
                        })
                    : relation === "notApproved"
                      ? `${c.library.rejectedReason} ${c.library.requestAgain}`
                      : relation === "suspended"
                        ? c.library.contractsPaused
                        : undefined
                }
                footer={
                  <>
                    {!hotel?.hasPendingRequest && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate({
                            to: "/hotel/$hotelId",
                            params: { hotelId: hotel.id },
                          })
                        }
                      >
                        {c.library.openInMyHotels}
                      </Button>
                    )}
                    {relation === "requested" && (
                      <Link to="/requests">
                        <Button variant="ghost" size="sm">
                          {c.library.viewRequest}
                        </Button>
                      </Link>
                    )}
                    {relation === "notApproved" && (
                      <Link to="/requests">
                        <Button variant="ghost" size="sm">
                          {c.library.seeDecision}
                        </Button>
                      </Link>
                    )}
                    {relation === "suspended" && (
                      <Link to="/sell-status">
                        <Button variant="ghost" size="sm">
                          {c.library.seeWhy}
                        </Button>
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => setQuickId(hotel.id)}
                      className="ms-auto text-xs font-medium text-text-link hover:underline"
                    >
                      {c.libraryOverlay.quickView}
                    </button>
                  </>
                }
              />
            );
          })}
        </div>
      )}

      <p className="mt-5 max-w-4xl text-xs leading-relaxed text-text-muted">{c.library.notFound}</p>
      <p className="mt-1.5 max-w-4xl text-xs leading-relaxed text-text-muted">
        {c.library.linkedNote}
      </p>

      {picked.length > 0 && (
        <div className="sticky bottom-4 mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-border-subtle bg-brand-deep p-4 text-text-inverse shadow-overlay">
          <div className="min-w-0 flex-1">
            {/* UI 02.1 - the count and the way out of it read as one
                sentence, so undoing the selection is where the selection
                is named rather than beside the button that sends it. */}
            <p className="flex flex-wrap items-baseline gap-x-3 text-sm font-medium">
              {counted(picked.length, hotelsSelectedWord, lang === "ar" ? "ar" : "en")}
              <button
                type="button"
                onClick={() => setPicked([])}
                className="text-[13px] font-medium text-primary underline underline-offset-2 hover:text-white"
              >
                {c.library.clear}
              </button>
            </p>
            <p className="mt-0.5 truncate text-xs text-white/70">
              {fill(c.library.selectionHint, {
                names: picked
                  .map((id) => {
                    const h = hotels.find((x) => x.id === id);
                    return h ? (lang === "ar" ? h.nameAr : h.nameEn) : id;
                  })
                  .join(" · "),
              })}
            </p>
          </div>
          <Button onClick={() => setConfirmOpen(true)}>{c.library.requestAccess}</Button>
        </div>
      )}

      {panel === "search" && (
        <LibrarySearchOverlay
          onClose={() => setPanel(null)}
          onOpen={() => setPanel(null)}
          onRequest={() => setPanel(null)}
          onViewRequest={() => navigate({ to: "/requests" })}
        />
      )}

      {panel === "filter" && (
        <LibraryFilterOverlay
          copy={libraryFilter}
          width="920px"
          count={visible.length}
          onClose={() => setPanel(null)}
        />
      )}

      {/* OV 02.2 / 02.2D — the drawer behind Quick view. */}
      {quickId && quickHotel && (
        <HotelQuickView
          hotel={quickHotel}
          name={ar ? quickHotel.nameAr : quickHotel.nameEn}
          meta={`${ar ? quickHotel.districtAr : quickHotel.district}${ar ? "\u060c" : ","} ${ar ? quickHotel.cityAr : quickHotel.city} \u00b7 ${fill(c.library.stars, { count: quickHotel.stars })} \u00b7 ${c.libraryOverlay.hotelianaId} ${quickHotel.id}`}
          requested={(relations[quickHotel.id] ?? quickHotel.relation) === "requested"}
          onClose={() => setQuickId(null)}
          onRequest={() => {
            setPicked([quickHotel.id]);
            setQuickId(null);
            setConfirmOpen(true);
          }}
          onSeeRequest={() => navigate({ to: "/requests" })}
        />
      )}

      {/* OV 02.3 / 02.1B — what confirming the request commits you to. */}
      {confirmOpen && (
        <ConfirmRequestOverlay
          hotels={picked.map((id) => {
            const hotel = hotels.find((item) => item.id === id);
            /* The city reads in the language of the sentence it is in. */
            const city = hotel ? (ar ? hotel.cityAr : hotel.city) : "";
            const stars = hotel ? fill(c.library.stars, { count: hotel.stars }) : "";
            return {
              name: hotel ? (ar ? hotel.nameAr : hotel.nameEn) : id,
              meta: hotel
                ? picked.length > 1
                  ? `${city} \u00b7 ${stars}`
                  : `${city} \u00b7 ${stars} \u00b7 ${quickView.available[ar ? "ar" : "en"]}`
                : "",
              ...(hotel?.image ? { image: hotel.image } : {}),
            };
          })}
          sending={sending}
          onClose={() => setConfirmOpen(false)}
          onConfirm={async () => {
            const ids = picked;
            setConfirmOpen(false);
            setPicked([]);
            await sendRequest(ids);
          }}
        />
      )}

      {/* OV 02.4 — the reference it was sent under, and what follows. */}
      {sentCount > 0 && (
        <RequestSentOverlay
          refs={sentRefs.join(" \u00b7 ")}
          names={sentNames.join(" \u00b7 ")}
          onClose={() => setSentCount(0)}
          onViewRequests={() => {
            setSentCount(0);
            navigate({ to: "/requests" });
          }}
        />
      )}
    </PageShell>
  );
}
