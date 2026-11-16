import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Bed, Building2, Check, Eye, ListChecks, Lock } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { notify, wait } from "@/lib/notify";
import { fill, useLanguage } from "@/lib/i18n";
import { usePortal } from "@/lib/portal-store";
import { hotelLicences, hotels, type RoomType } from "@/lib/demo-data";
import { HotelGallery } from "@/components/hotels/hotel-gallery";
import { cn } from "@/lib/utils";
import { useHotelRooms } from "@/api/modules/hotels/useHotelRooms";
import { useSingleHotelOption } from "@/api/modules/hotels/useSinglHotelOption";
import { badgeTone } from "@/components/hotels/hotel-card";
import { formatTime } from "@/lib/format-time";
import { ReusablePagination } from "@/components/ui/ReusablePagination";
import { RoomDetailsDrawer } from "@/components/hotels/room-details-drawer";
import { AddRoomDrawer } from "@/components/hotels/add-missing-room/add-room-drawer";

export const Route = createFileRoute("/hotel/$hotelId")({
  head: () => ({
    meta: [
      { title: "Hotel profile · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Read-only hotel profile and official room catalogue maintained by Hoteliana for your linked hotel.",
      },
      { property: "og:title", content: "Hotel profile · Hoteliana Supplier Portal" },
      {
        property: "og:description",
        content: "Official hotel details and room catalogue as registered by Hoteliana.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HotelProfilePage,
});

/* ---------- shared bits, sized from Figma UI 02.2L ---------- */

function CardHead({
  icon,
  overline,
  title,
  subtitle,
  right,
}: {
  icon: React.ReactNode;
  overline: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 pb-3.5 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
        <span className="flex shrink-0 items-center justify-center rounded-[10px] bg-primary-subtle p-[9px] text-brand-deep">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase leading-[1.45] tracking-[0.08em] text-brand-mid">
            {overline}
          </p>
          <p className="text-[17px] font-semibold leading-[1.45] text-text-primary">{title}</p>
          {subtitle && <p className="text-[12px] leading-[1.45] text-text-muted">{subtitle}</p>}
        </div>
      </div>
      {right && <div className="w-full shrink-0 sm:w-auto">{right}</div>}
    </div>
  );
}

function Row({ label, value, dirAuto }: { label: string; value: string; dirAuto?: boolean }) {
  return (
    <div className="flex items-start gap-2.5 border-t border-border-subtle py-2">
      <p className="w-[120px] shrink-0 text-[12px] leading-[1.45] text-text-muted">{label}</p>
      <p
        {...(dirAuto ? { dir: "auto" as const } : {})}
        className="min-w-0 flex-1 text-[12.5px] font-medium leading-[1.45] text-text-primary"
      >
        {value}
      </p>
    </div>
  );
}

function Badge({
  tone,
  children,
  className,
}: {
  tone: "success" | "warning";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md py-1 pe-[9px] ps-2",
        tone === "success"
          ? "bg-status-success-bg text-status-success"
          : "bg-status-warning-bg text-status-warning",
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          tone === "success" ? "bg-status-success" : "bg-status-warning",
        )}
      />
      <span className="text-[11px] font-medium uppercase tracking-[0.04em]">{children}</span>
    </span>
  );
}

const COLS = {
  room: "w-[190px] shrink-0",
  occupancy: "w-[110px] shrink-0",
  guests: "w-[150px] shrink-0",
  childAge: "w-[100px] shrink-0",
  bed: "w-[100px] shrink-0",
  size: "w-[90px] shrink-0",
  view: "w-[110px] shrink-0",
  status: "w-[170px] shrink-0",
  action: "ms-auto flex shrink-0 justify-end",
} as const;

/* ---------- page ---------- */

function HotelProfilePage() {
  // const { hotel } = Route.useLoaderData();
  const { hotelId } = Route.useParams();
  const { hotel, isLoading } = useSingleHotelOption(hotelId);
  // const { hotel, isLoading } = useSingleHotel(hotelId);

  const { c, lang, dir } = useLanguage();
  const { newRooms } = usePortal();
  const p = c.hotelProfile;
  const [roomOpen, setRoomOpen] = useState(false);
  const [roomDetailsId, setRoomDetailsId] = useState<number | null>(null);
  const ar = lang === "ar";
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  const getCountryName = (countryCode: string, lang: "en" | "ar") => {
    const locale = lang === "ar" ? "ar" : "en";

    return (
      new Intl.DisplayNames([locale], {
        type: "region",
      }).of(countryCode) ?? countryCode
    );
  };

  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  const {
    rooms,
    meta,
    refetch,
    isLoading: roomsLoading,
  } = useHotelRooms({
    id: hotel?.hotel?.id,
    page,
    limit: PAGE_SIZE,
  });

  const totalPages = meta?.totalPages ?? 1;

  const pendingRooms = newRooms.filter((room) => room?.hotelId === hotel?.id);
  const pendingCount =
    rooms.filter((room) => room?.status === "pending")?.length + pendingRooms.length;

  const hotelName = ar ? hotel?.hotel.nameAr : hotel?.hotel.nameEn;
  /* Flow 12 · Row B — what Hoteliana holds, shown read only. */
  // const licence = hotelLicences[hotel.id];

  const guestsLabel = (room: RoomType) =>
    room.children === 0
      ? fill(p.guestsNoChild, { adults: room.adults })
      : room.children === 1
        ? fill(p.guestsOneChild, { adults: room.adults })
        : fill(p.guests, { adults: room.adults, children: room.children });

  const approvedRooms = rooms?.filter((room) => room?.status === "active") ?? [];

  const status = hotel?.linkingStatus;
  const linkedHotel = status === "linked";
  const tone = badgeTone[status];

  if (isLoading || !hotelId) return;

  return (
    <PageShell>
      <div className="flex flex-col gap-5">
        <Link
          to={linkedHotel ? "/my-hotels" : "/hotels"}
          className="inline-flex w-fit items-center gap-2 rounded-[10px] border border-border-subtle bg-surface-default py-2 pe-3.5 ps-3 text-[13px] font-medium leading-[1.45] text-brand-deep transition-colors hover:bg-surface-subtle"
        >
          <BackIcon className="h-4 w-4" aria-hidden="true" />
          {linkedHotel ? c.common.backToMyHotels : c.common.backToHotels}
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase leading-[1.45] tracking-[0.08em] text-brand-mid">
              {linkedHotel ? p.overline : p.overlineHotelProfile}
            </p>
            <h1 className="text-[26px] font-semibold leading-[1.45] text-text-primary">
              {hotelName}
            </h1>
            <p className="text-[13px] leading-[1.45] text-text-body">
              {fill(p.meta, {
                city: hotel?.hotel.city,
                country: getCountryName(hotel?.hotel.countryCode, lang),
                stars: hotel?.hotel.starRating,
              })}
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2.5 sm:w-auto">
            {/* <Badge tone="success">{p.badgeLinked}</Badge> */}
            <span
              className={cn(
                "inline-flex w-fit items-center gap-1.5 rounded-md ps-2 pe-[9px] py-1",
                tone.wrap,
              )}
            >
              <span className={cn("size-1.5 rounded-full", tone.dot)} aria-hidden="true" />
              <span
                className={cn("text-[11px] font-medium uppercase tracking-[0.44px]", tone.text)}
              >
                {c.library.status[status]}
              </span>
            </span>
            {/* <Badge tone="success">{p.badgeSelling}</Badge> */}
            {/* <Link
              to="/rate-contracts/new"
              search={{ source: undefined }}
              className="min-w-0 flex-1 sm:flex-none"
            >
              <Button variant="dark" className="h-11 w-full rounded-[10px] px-5 text-sm sm:w-auto">
                {p.createContract}
              </Button>
            </Link> */}
          </div>
        </div>

        {/* Profile row */}
        <div className="flex flex-col items-stretch gap-5 xl:flex-row xl:items-start">
          <HotelGallery
            hotel={hotel?.hotel}
            name={hotelName}
            counter={p.imagesCounter}
            labels={{
              group: p.galleryGroup,
              previous: p.galleryPrevious,
              next: p.galleryNext,
              alt: p.galleryAlt,
            }}
            className="h-[232px] w-full shrink-0 rounded-2xl xl:w-[360px]"
          />

          <section className="min-w-0 flex-1 rounded-2xl border border-border-subtle bg-surface-default px-[22px] pb-2.5 pt-5">
            <CardHead
              icon={<Building2 className="h-[18px] w-[18px]" aria-hidden="true" />}
              overline={p.detailsOverline}
              title={p.detailsTitle}
            />
            <div className="flex flex-col gap-x-6 md:flex-row">
              <div className="min-w-0 flex-1">
                <Row label={p.nameEn} value={hotel?.hotel?.nameEn} />
                <Row label={p.nameAr} value={hotel?.hotel?.nameAr} dirAuto />
                <Row label={p.country} value={getCountryName(hotel?.hotel?.countryCode, lang)} />
                <Row label={p.city} value={hotel?.hotel?.city} />
                <Row
                  label={p.area}
                  // value={ar ? hotel?.hotel?.districtAr : hotel?.hotel?.district}
                  value={hotel?.hotel?.area}
                />
              </div>
              <div className="min-w-0 flex-1">
                <Row
                  label={p.address}
                  value={ar ? hotel?.hotel?.addressAr : hotel?.hotel?.addressEn}
                  dirAuto
                />
                <Row
                  label={p.starRating}
                  value={fill(p.starsValue, { stars: hotel?.hotel?.starRating })}
                />
                <Row
                  label={c.addHotel.policies}
                  value={ar ? hotel?.hotel?.policies?.ar : hotel?.hotel?.policies?.ar}
                />
                <Row label={p.descEn} value={hotel?.hotel?.descriptionEn} />
                <Row label={p.descAr} value={hotel?.hotel?.descriptionAr} dirAuto />
                <Row
                  label={c.addHotel.checkInTime}
                  value={formatTime(hotel?.hotel?.checkInTime, lang)}
                />
                <Row
                  label={c.addHotel.checkOutTime}
                  value={formatTime(hotel?.hotel?.checkOutTime, lang)}
                />
              </div>
            </div>
          </section>

          <section className="w-full shrink-0 rounded-2xl border border-border-subtle bg-surface-default px-[22px] py-5 xl:w-[300px]">
            <CardHead
              icon={<ListChecks className="h-[18px] w-[18px]" aria-hidden="true" />}
              overline={p.amenitiesOverline}
              title={p.amenitiesTitle}
            />
            <div className="flex flex-wrap gap-1.5">
              {hotel?.hotel?.amenities?.map((item) => (
                <span
                  key={item?.amenityId}
                  className="inline-flex items-center gap-[5px] rounded-full border border-border-subtle bg-surface-subtle py-[5px] pe-2.5 ps-2 text-[11.5px] font-medium leading-[1.45] text-text-body"
                >
                  <Check className="h-[11px] w-[11px] text-status-success" aria-hidden="true" />
                  {lang === "ar" ? item?.nameAr : item?.nameEn}
                </span>
              ))}
            </div>
          </section>
        </div>
        {/* Room catalogue */}
        <section className="rounded-2xl border border-border-subtle bg-surface-default px-[22px] pb-3.5 pt-5">
          <CardHead
            icon={<Bed className="h-[18px] w-[18px]" aria-hidden="true" />}
            overline={fill(p.roomsOverline, {
              rooms: meta?.total,
              pending: pendingCount,
            })}
            title={p.roomsTitle}
            subtitle={p.roomsSubtitle}
            right={
              <Button
                variant="outline"
                className="h-11 w-full shrink-0 rounded-[10px] px-5 text-sm sm:w-auto"
                onClick={() => setRoomOpen(true)}
              >
                {p.addMissingRoom}
              </Button>
            }
          />

          <div className="overflow-x-auto">
            <div className="min-w-[1260px]">
              <div className="flex items-center gap-3 pb-2.5 pt-1 text-[10px] font-medium uppercase leading-[1.45] tracking-[0.08em] text-text-muted">
                <p className={COLS.room}>{p.table.room}</p>
                <p className={COLS.occupancy}>{p.table.occupancy}</p>
                <p className={COLS.guests}>{p.table.guests}</p>
                <p className={COLS.childAge}>{p.table.childAge}</p>
                <p className={COLS.bed}>{p.table.bed}</p>
                <p className={COLS.size}>{p.table.size}</p>
                <p className={COLS.view}>{p.table.view}</p>
                <p className={COLS.status}>{p.table.status}</p>
                <p className={COLS.action} aria-hidden="true" />
              </div>
              {roomsLoading ? (
                <div className="flex flex-col items-center justify-center border-t border-border-subtle px-4 py-10">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-border-subtle border-t-text-primary" />
                  <p className="mt-3 text-sm text-text-muted">
                    {ar ? "جاري تحميل الغرف..." : "Loading rooms..."}
                  </p>
                </div>
              ) : approvedRooms.length > 0 ? (
                <>
                  {approvedRooms.map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center gap-3 border-t border-border-subtle py-3 text-[12.5px] leading-[1.45] text-text-body"
                    >
                      <p className={`${COLS.room} font-medium text-text-primary`}>
                        {ar ? room.nameAr : room.nameEn}
                      </p>

                      <p className={COLS.occupancy}>{room.maxOccupancy}</p>

                      <p className={COLS.guests}>{guestsLabel(room)}</p>

                      <p className={COLS.childAge}>
                        {room?.maxChildAge ? fill(p.upTo, { age: room.maxChildAge }) : "--"}
                      </p>

                      <p className={COLS.bed}>{room.bedTypeId || "--"}</p>

                      <p className={COLS.size}>{room.roomSizeId || "--"}</p>

                      <p className={COLS.view}>{room?.view || "--"}</p>

                      <p className={COLS.status}>
                        <Badge tone="success">{lang === "ar" ? "رسمية" : "Official"}</Badge>
                      </p>

                      <div className={COLS.action}>
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={fill(c.roomDetails.open, {
                            room: ar ? room.nameAr : room.nameEn,
                          })}
                          onClick={() => setRoomDetailsId(room.id)}
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                          {c.roomDetails.viewDetails}
                        </Button>
                      </div>
                    </div>
                  ))}

                  {totalPages > 1 && (
                    <ReusablePagination
                      page={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                      isLoading={roomsLoading}
                      lang={lang}
                      showBorder
                    />
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center border-t border-border-subtle px-4 py-10 text-center">
                  <p className="text-sm font-medium text-text-primary">
                    {ar ? "لا توجد غرف معتمدة" : "No approved rooms"}
                  </p>

                  <p className="mt-1 text-xs text-text-muted">
                    {ar
                      ? "لا توجد غرف معتمدة لعرضها حاليًا."
                      : "There are no approved rooms to display at the moment."}
                  </p>
                </div>
              )}
              {pendingRooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center gap-3 border-t border-border-subtle py-3 text-[12.5px] leading-[1.45] text-text-body"
                >
                  <p className={`${COLS.room} font-medium text-text-primary`}>{room.name}</p>
                  <p className={COLS.occupancy}>—</p>
                  <p className={COLS.guests}>—</p>
                  <p className={COLS.childAge}>—</p>
                  <p className={COLS.bed}>—</p>
                  <p className={COLS.size}>—</p>
                  <p className={COLS.view}>—</p>
                  <p className={COLS.status}>
                    <Badge tone="warning">{p.statusPending}</Badge>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <p className="flex items-start gap-2 text-[11.5px] leading-[1.45] text-text-muted">
          <Lock className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
          {p.footnote}
        </p>
      </div>

      {roomDetailsId !== null && (
        <RoomDetailsDrawer
          hotelId={Number(hotelId)}
          hotelName={hotelName ?? ""}
          roomId={roomDetailsId}
          onClose={() => setRoomDetailsId(null)}
        />
      )}
      {roomOpen && (
        <AddRoomDrawer
          hotelId={hotel?.hotel?.id}
          hotelName={hotelName}
          onClose={() => setRoomOpen(false)}
          refetchRooms={refetch}
        />
      )}
    </PageShell>
  );
}
