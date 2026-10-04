import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
import {
  PageHeader,
  PageShell,
  SectionCard,
  StatusPill,
} from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { fill, useLanguage } from "@/lib/i18n";
import { usePortal } from "@/lib/portal-store";
import { hotels } from "@/lib/demo-data";
import { useRemoteData } from "@/lib/use-remote-data";
import { HotelGridSkeleton } from "@/components/ui/skeletons";

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
  const { loading } = useRemoteData(() => hotels);

  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [state, setState] = useState("all");
  const [filter, setFilter] = useState(false);

  const allLinked = hotels.filter(
    (hotel) => (relations[hotel.id] ?? hotel.relation) === "linked"
  );
  const cities = useMemo(
    () => Array.from(new Set(allLinked.map((hotel) => hotel.city))),
    [allLinked]
  );
  const linked = allLinked.filter((hotel) => {
    const name = lang === "ar" ? hotel.nameAr : hotel.nameEn;
    if (query && !name.toLowerCase().includes(query.toLowerCase())) return false;
    if (city !== "all" && hotel.city !== city) return false;
    if (state !== "all" && (hotel.contract ?? "none") !== state) return false;
    return true;
  });
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

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <SetupStat icon={<FilePlus2 className="h-5 w-5" />} label={c.myHotels.statNoContract} value={String(noContract)} note={c.myHotels.statNoContractNote} />
        <SetupStat icon={<FileClock className="h-5 w-5" />} label={c.myHotels.statDraft} value={String(drafts)} note={c.myHotels.statDraftNote} />
        <SetupStat icon={<AlertTriangle className="h-5 w-5" />} label={c.myHotels.statSelling} value={String(selling)} note={fill(c.myHotels.statSellingNote, { count: needsAttention })} tone="warning" />
      </div>

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
            label={c.myHotels.city}
            value={city}
            onChange={setCity}
            options={[
              { value: "all", label: c.myHotels.allCities },
              ...cities.map((name) => ({ value: name, label: name })),
            ]}
          />
          <Select
            label={c.myHotels.contractState}
            value={state}
            onChange={setState}
            options={[
              { value: "all", label: c.myHotels.anyState },
              { value: "selling", label: c.myHotels.status.selling },
              { value: "draft", label: c.myHotels.status.draft },
              { value: "none", label: c.myHotels.status.noContract },
            ]}
          />
        </div>
        {/* OV 02.11 — your hotels, by where their supply actually stands. */}
        <div className="flex justify-end px-5 pb-5">
          <Button variant="outline" size="sm" onClick={() => setFilter(true)}>
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            {c.library.filter}
          </Button>
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
      ) : linked.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-default bg-surface-default p-10 text-center text-sm text-text-secondary">
          {c.myHotels.empty}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {linked.map((hotel) => {
            // Figma UI 02.6 labels the pill by contract state; "needs attention"
            // is carried by the note under it.
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
                    <h2 className="truncate text-base font-semibold text-text-primary">
                      {lang === "ar" ? hotel.nameAr : hotel.nameEn}
                    </h2>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-text-secondary">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {lang === "ar"
                        ? `${hotel.districtAr}، ${hotel.cityAr} · ${hotel.distanceAr}`
                        : `${hotel.district}, ${hotel.city} · ${hotel.distance}`}
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
                      <AlertTriangle
                        className="me-1.5 h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                    )}
                    {contractStatus}
                  </StatusPill>
                </div>

                <div className="mt-3 flex items-center gap-1">
                  {Array.from({ length: hotel.stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-current text-status-warning"
                      aria-hidden="true"
                    />
                  ))}
                  <span className="font-data ms-2 text-xs text-text-muted">
                    {hotel.id}
                  </span>
                </div>

                {hotel.contractCount && (
                  <p className="mt-3 text-sm text-text-secondary">
                    {lang === "ar" ? hotel.contractCountAr : hotel.contractCount}
                  </p>
                )}

                {hotel.contractNote && (
                  <p className="mt-2 rounded-lg bg-surface-subtle px-3 py-2 text-sm text-text-secondary">
                    {lang === "ar" ? hotel.contractNoteAr : hotel.contractNote}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to="/rate-contracts">
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
      )}

      <p className="mt-6 max-w-3xl text-xs leading-relaxed text-text-muted">
        {c.myHotels.note}
      </p>
    </PageShell>
  );
}

function SetupStat({ icon, label, value, note, tone = "neutral" }: { icon: React.ReactNode; label: string; value: string; note: string; tone?: "neutral" | "warning" }) {
  return <div className="flex items-center gap-4 rounded-xl border border-border-subtle bg-surface-default p-4 shadow-card">
    <span className={tone === "warning" ? "flex h-10 w-10 items-center justify-center rounded-lg bg-status-warning-bg text-status-warning" : "flex h-10 w-10 items-center justify-center rounded-lg bg-surface-subtle text-text-secondary"}>{icon}</span>
    <div><p className="text-overline text-text-muted">{label}</p><div className="mt-1 flex items-baseline gap-2"><strong className="font-data text-xl text-text-primary">{value}</strong><span className="text-xs text-text-secondary">{note}</span></div></div>
  </div>;
}
