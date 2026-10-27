import { useCallback, useEffect, useState } from "react";

import type { SupplierHotelContractRoom } from "@/api/modules/hotel-contract/types";
import { useContractHotelRooms } from "@/api/modules/hotel-contract/useContractHotelRooms";
import { Select } from "@/components/ui/select";
import { useLanguage } from "@/lib/i18n";

const PAGE_SIZE = 20;

function roomOptionLabel(room: SupplierHotelContractRoom, lang: string) {
  return (
    (lang === "ar" ? room.nameAr || room.nameEn : room.nameEn || room.nameAr) ||
    `#${room.id}`
  );
}

export function ContractRoomSelect({
  hotelId,
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  clearable = false,
}: {
  hotelId: number | null;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string, room?: SupplierHotelContractRoom) => void;
  disabled?: boolean;
  clearable?: boolean;
}) {
  const { c, lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rooms, setRooms] = useState<SupplierHotelContractRoom[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<{ id: string; label: string } | null>(null);
  const result = useContractHotelRooms(hotelId, {
    page,
    limit: PAGE_SIZE,
    ...(search ? { search } : {}),
  });

  useEffect(() => {
    setSearch("");
    setPage(1);
    setRooms([]);
    setSelectedLabel(null);
  }, [hotelId]);

  useEffect(() => {
    if (!result.data) return;
    setRooms((current) => {
      const previous = result.data.meta.page === 1 ? [] : current;
      const knownIds = new Set(previous.map((room) => room.id));
      return [
        ...previous,
        ...result.data.rooms.filter((room) => !knownIds.has(room.id)),
      ];
    });
  }, [result.data]);

  const options = rooms.map((room) => ({
    value: String(room.id),
    label: roomOptionLabel(room, lang),
  }));

  const hasMore = Boolean(
    result.data && result.data.meta.page < result.data.meta.totalPages,
  );
  const loadingMore = result.isFetching && rooms.length > 0;
  const selectedLabels =
    selectedLabel && selectedLabel.id === value
      ? { [selectedLabel.id]: selectedLabel.label }
      : {};
  const handleSearchChange = useCallback(
    (nextSearch: string) => {
      const next = nextSearch.trim();
      if (next === search) return;
      setSearch(next);
      setPage(1);
      setRooms([]);
    },
    [search],
  );

  return (
    <Select
      label={label}
      placeholder={placeholder}
      value={value}
      disabled={disabled || hotelId === null}
      clearable={clearable}
      onChange={(next) => {
        const selectedRoom = rooms.find((room) => String(room.id) === next);
        const nextLabel = selectedRoom ? roomOptionLabel(selectedRoom, lang) : "";
        setSelectedLabel(nextLabel ? { id: next, label: nextLabel } : null);
        onChange(next, selectedRoom);
      }}
      options={options}
      selectedLabels={selectedLabels}
      searchable
      serverSearch
      onSearchChange={handleSearchChange}
      loading={result.isLoading}
      {...(result.isError ? { loadError: c.builder.form.roomsError } : {})}
      onRetry={() => void result.refetch()}
      hasMore={hasMore}
      loadingMore={loadingMore}
      onLoadMore={() => {
        if (hasMore && !result.isFetching && !result.isError) {
          setPage((current) => current + 1);
        }
      }}
      onRefresh={() => void result.refetch()}
      refreshing={result.isFetching}
    />
  );
}
