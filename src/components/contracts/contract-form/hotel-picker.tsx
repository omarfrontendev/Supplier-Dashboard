import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Building2, Search } from "lucide-react";

import type { ContractHotel } from "@/api/modules/hotel-contract/contrac-tHotels/types";
import { useContractHotels } from "@/api/modules/hotel-contract/contrac-tHotels/useContractHotels";
import { OptionRow } from "@/components/contracts/create-overlays";
import { IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { ReusablePagination } from "@/components/ui/ReusablePagination";
import { hotelPickerPanel } from "@/lib/contract-overlay-data";
import { fill, useLanguage } from "@/lib/i18n";

const PAGE_SIZE = 5;

export function HotelPicker({
  selectedId,
  onClose,
  onConfirm,
}: {
  selectedId: number | null;
  onClose: () => void;
  onConfirm: (hotel: ContractHotel) => void;
}) {
  const { c, lang } = useLanguage();
  const f = c.builder.form;
  const ar = lang === "ar";
  const panel = hotelPickerPanel;
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [picked, setPicked] = useState<ContractHotel | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(query.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading, isFetching, isError, refetch } = useContractHotels({
    page,
    limit: PAGE_SIZE,
    ...(search ? { search } : {}),
  });
  const hotels = data?.hotels ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPages ?? 0;
  const pickedId = picked?.id ?? selectedId;

  const hotelName = (hotel: ContractHotel) =>
    (ar ? hotel.nameAr || hotel.nameEn : hotel.nameEn || hotel.nameAr) || `#${hotel.id}`;
  const hotelHint = (hotel: ContractHotel) =>
    `${hotel.city || "-"} · ${hotel.starRating ?? "-"}★`;

  return (
    <IconModal
      icon={<Building2 className="h-5 w-5" aria-hidden="true" />}
      overline={ar ? panel.overlineAr : panel.overline}
      title={ar ? panel.titleAr : panel.title}
      body={ar ? panel.bodyAr : panel.body}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={() => navigate({ to: "/hotels" })}>
            {ar ? panel.cancelAr : panel.cancel}
          </Button>
          <Button disabled={!picked} onClick={() => picked && onConfirm(picked)}>
            {ar ? panel.confirmAr : panel.confirm}
          </Button>
        </>
      }
    >
      <div className="flex h-11 overflow-hidden rounded-[10px] border border-border-default bg-surface-default transition-colors hover:border-border-strong focus-within:border-border-focus focus-within:ring-2 focus-within:ring-ring/20">
        <input
          type="search"
          aria-label={f.hotelSearchLabel}
          placeholder={f.hotelSearchPh}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
        <span className="flex w-11 shrink-0 items-center justify-center border-s border-border-default bg-surface-subtle text-text-secondary">
          <Search className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      {isLoading ? (
        <p className="py-6 text-center text-sm text-text-muted">{f.hotelLoading}</p>
      ) : isError ? (
        <div className="space-y-2 py-4 text-center">
          <p className="text-sm text-status-danger">{f.hotelLoadFailed}</p>
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            {c.roomDetails.retry}
          </Button>
        </div>
      ) : hotels.length === 0 ? (
        <div className="space-y-2 py-4 text-center">
          <p className="text-sm text-text-muted">
            {search ? fill(f.hotelNoResults, { query: search }) : f.noHotels}
          </p>
          {search && (
            <Button variant="ghost" size="sm" onClick={() => setQuery("")}>
              {f.hotelClearSearch}
            </Button>
          )}
        </div>
      ) : (
        <div className={isFetching ? "space-y-2 opacity-60" : "space-y-2"}>
          {hotels.map((hotel) => (
            <OptionRow
              key={hotel.id}
              label={hotelName(hotel)}
              hint={hotelHint(hotel)}
              on={hotel.id === pickedId}
              onSelect={() => setPicked(hotel)}
            />
          ))}
        </div>
      )}

      {total > 0 && (
        <p className="text-xs text-text-muted">
          {fill(f.hotelCount, {
            from: (page - 1) * PAGE_SIZE + 1,
            to: Math.min(page * PAGE_SIZE, total),
            total,
          })}
        </p>
      )}
      <ReusablePagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        isLoading={isLoading}
        lang={ar ? "ar" : "en"}
        showBorder={false}
      />
    </IconModal>
  );
}
