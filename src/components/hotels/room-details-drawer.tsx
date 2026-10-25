import { Info } from "lucide-react";

import { useHotelRoom } from "@/api/modules/hotels/useHotelRoom";
import { HotelGalleryImage } from "@/components/hotels/HotelGalleryImage";
import { Drawer } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { arDigits } from "@/lib/arabic-count";
import { fill, useLanguage } from "@/lib/i18n";
import type { RoomView } from "@/store/features/contracts/types";

export function RoomDetailsDrawer({
  hotelId,
  hotelName,
  roomId,
  onClose,
}: {
  hotelId: number | undefined;
  hotelName: string;
  roomId: number;
  onClose: () => void;
}) {
  const { c, lang } = useLanguage();
  const t = c.roomDetails;
  const views = c.builder.form.views;
  const { data: room, isLoading, isError, refetch } = useHotelRoom(hotelId, roomId);

  const roomName = room ? (lang === "ar" ? room.nameAr || room.nameEn : room.nameEn || room.nameAr) : "";
  const dash = "—";
  const value = (amount: number | null | undefined, template?: string) =>
    amount === null || amount === undefined
      ? dash
      : template
        ? fill(template, { count: amount, age: amount, size: amount })
        : lang === "ar"
          ? arDigits(amount)
          : String(amount);
  const viewLabel = room?.view ? (views[room.view as RoomView] ?? room.view) : dash;
  const images = [...(room?.images ?? [])].sort(
    (a, b) => Number(b.isCover) - Number(a.isCover) || a.sortOrder - b.sortOrder,
  );

  const rows: Array<[string, string]> = room
    ? [
        [t.nameEn, room.nameEn || dash],
        [t.nameAr, room.nameAr || dash],
        [t.maxOccupancy, value(room.maxOccupancy, t.guestsCount)],
        [t.adults, value(room.adults)],
        [t.children, value(room.children)],
        [t.maxChildAge, value(room.maxChildAge, t.years)],
        [t.bedType, value(room.bedTypeId)],
        [t.roomSize, room.areaSqm ? fill(t.sqm, { size: room.areaSqm }) : value(room.roomSizeId)],
        [t.views, viewLabel],
      ]
    : [];

  return (
    <Drawer
      width="640px"
      overline={fill(t.overline, { hotel: hotelName })}
      title={room ? roomName : isLoading ? t.loading : dash}
      {...(room ? { meta: fill(t.meta, { id: room.id }) } : {})}
      onClose={onClose}
    >
      {isLoading && <p className="text-sm text-text-muted">{t.loading}</p>}

      {isError && !isLoading && (
        <div className="space-y-3">
          <p className="text-sm text-status-danger">{t.failed}</p>
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            {t.retry}
          </Button>
        </div>
      )}

      {room && (
        <div className="space-y-6">
          <section>
            <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-text-muted">
              {t.detailsOverline}
            </p>
            <dl className="mt-1">
              {rows.map(([label, text]) => (
                <div key={label} className="flex items-baseline gap-3 py-[7px]">
                  <dt className="w-[130px] shrink-0 text-xs text-text-muted">{label}</dt>
                  <dd className="min-w-0 flex-1 text-[12.5px] font-medium text-text-primary">
                    {text}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <p className="text-xs font-medium text-text-secondary">
              {fill(t.images, { count: images.length })}
            </p>
            {images.length === 0 ? (
              <p className="mt-2 rounded-xl border border-dashed border-border-default bg-surface-subtle px-4 py-6 text-center text-xs text-text-muted">
                {t.noImages}
              </p>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {images.map((image, index) => (
                  <div
                    key={image.uploadId}
                    className="relative aspect-[3/2] overflow-hidden rounded-[10px] border border-border-subtle bg-surface-subtle"
                  >
                    <HotelGalleryImage
                      uploadId={image.uploadId}
                      alt={fill(t.imageAlt, { room: roomName, n: index + 1 })}
                      className="h-full w-full object-cover"
                    />
                    {image.isCover && (
                      <span className="absolute start-2 top-2 rounded-full bg-brand-deep px-2 py-0.5 text-[10.5px] font-medium text-white">
                        {t.cover}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <p className="flex gap-2 rounded-xl border border-border-subtle bg-primary-subtle px-3 py-2.5 text-xs leading-relaxed text-text-body">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {t.note}
          </p>
        </div>
      )}
    </Drawer>
  );
}
