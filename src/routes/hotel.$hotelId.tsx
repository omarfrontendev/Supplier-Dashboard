import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bed,
  Building2,
  Check,
  Hash,
  Info,
  ListChecks,
  Lock,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { notify, wait } from "@/lib/notify";
import { fill, useLanguage } from "@/lib/i18n";
import { usePortal } from "@/lib/portal-store";
import { hotelLicences, hotels, roomCatalogue, type RoomType } from "@/lib/demo-data";
import { HotelGallery } from "@/components/hotels/hotel-gallery";
import {
  drawerMotion,
  panelMotion,
  scrimMotion,
  useDismiss,
} from "@/components/layout/overlay";
import { cn } from "@/lib/utils";

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
  loader: ({ params }) => {
    const hotel = hotels.find((item) => item.id === params.hotelId);
    if (!hotel) throw notFound();
    return { hotel };
  },
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
          <p className="text-[17px] font-semibold leading-[1.45] text-text-primary">
            {title}
          </p>
          {subtitle && (
            <p className="text-[12px] leading-[1.45] text-text-muted">{subtitle}</p>
          )}
        </div>
      </div>
      {right && <div className="w-full shrink-0 sm:w-auto">{right}</div>}
    </div>
  );
}


function Row({ label, value, dirAuto }: { label: string; value: string; dirAuto?: boolean }) {
  return (
    <div className="flex items-start gap-2.5 border-t border-border-subtle py-2">
      <p className="w-[120px] shrink-0 text-[12px] leading-[1.45] text-text-muted">
        {label}
      </p>
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
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          tone === "success" ? "bg-status-success" : "bg-status-warning"
        )}
      />
      <span className="text-[11px] font-medium uppercase tracking-[0.04em]">
        {children}
      </span>
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
} as const;

/* ---------- page ---------- */

function HotelProfilePage() {
  const { hotel } = Route.useLoaderData();
  const { c, lang, dir } = useLanguage();
  const { newRooms } = usePortal();
  const p = c.hotelProfile;
  const [roomOpen, setRoomOpen] = useState(false);
  const ar = lang === "ar";
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  const pendingRooms = newRooms.filter((room) => room.hotelId === hotel.id);
  const rooms = useMemo(() => roomCatalogue, []);
  const pendingCount =
    rooms.filter((room) => room.status === "pending").length + pendingRooms.length;
  const availableCount = rooms.filter((room) => room.status === "available").length;

  const hotelName = ar ? hotel.nameAr : hotel.nameEn;
  /* Flow 12 · Row B — what Hoteliana holds, shown read only. */
  const licence = hotelLicences[hotel.id];

  const guestsLabel = (room: RoomType) =>
    room.children === 0
      ? fill(p.guestsNoChild, { adults: room.adults })
      : room.children === 1
        ? fill(p.guestsOneChild, { adults: room.adults })
        : fill(p.guests, { adults: room.adults, children: room.children });

  return (
    <PageShell>
      <div className="flex flex-col gap-5">
        <Link
          to="/my-hotels"
          className="inline-flex w-fit items-center gap-2 rounded-[10px] border border-border-subtle bg-surface-default py-2 pe-3.5 ps-3 text-[13px] font-medium leading-[1.45] text-brand-deep transition-colors hover:bg-surface-subtle"
        >
          <BackIcon className="h-4 w-4" aria-hidden="true" />
          {c.common.backToMyHotels}
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase leading-[1.45] tracking-[0.08em] text-brand-mid">
              {p.overline}
            </p>
            <h1 className="text-[26px] font-semibold leading-[1.45] text-text-primary">
              {hotelName}
            </h1>
            <p className="text-[13px] leading-[1.45] text-text-body">
              {fill(p.meta, {
                district: ar ? hotel.districtAr : hotel.district,
                city: ar ? hotel.cityAr : hotel.city,
                country: ar ? hotel.countryAr : hotel.countryEn,
                stars: hotel.stars,
                id: hotel.id,
              })}
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2.5 sm:w-auto">
            {/* UI 02.2L - two separate facts, so two pills: the hotel is
                linked to you, and it is selling. One badge saying both
                hides the case where it is linked and not selling. */}
            <Badge tone="success">{p.badgeLinked}</Badge>
            <Badge tone="success">{p.badgeSelling}</Badge>
            {/* UI 02.2L — Create rate contract opens UI 03.1, not the list. */}
            <Link to="/rate-contracts/new" search={{ source: undefined }} className="min-w-0 flex-1 sm:flex-none">
              <Button variant="dark" className="h-11 w-full rounded-[10px] px-5 text-sm sm:w-auto">
                {p.createContract}
              </Button>
            </Link>
          </div>

        </div>

        {/* Profile row */}
        <div className="flex flex-col items-stretch gap-5 xl:flex-row xl:items-start">
          <HotelGallery
            hotel={hotel}
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
                <Row label={p.nameEn} value={hotel.nameEn} />
                <Row label={p.nameAr} value={hotel.nameAr} dirAuto />
                <Row label={p.country} value={ar ? hotel.countryAr : hotel.countryEn} />
                <Row label={p.city} value={ar ? hotel.cityAr : hotel.city} />
                <Row label={p.area} value={ar ? hotel.districtAr : hotel.district} />
              </div>
              <div className="min-w-0 flex-1">
                <Row label={p.address} value={ar ? hotel.addressAr : hotel.address} dirAuto />
                <Row label={p.starRating} value={fill(p.starsValue, { stars: hotel.stars })} />
                {/* Flow 12 · Row B — read only, from Hoteliana's library. */}
                {licence && (
                  <Row
                    label={p.tourismLicence}
                    value={`${licence.number} · ${ar ? licence.issuerAr : licence.issuer}`}
                  />
                )}
                {licence && (
                  <Row
                    label={p.licenceExpiry}
                    value={ar ? licence.expiryAr : licence.expiry}
                  />
                )}
                <Row label={p.descEn} value={hotel.descEn} />
                <Row label={p.descAr} value={hotel.descAr} dirAuto />
                <Row label={p.distance} value={ar ? hotel.distanceAr : hotel.distance} />
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
              {c.roomDrawer.amenityList.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-[5px] rounded-full border border-border-subtle bg-surface-subtle py-[5px] pe-2.5 ps-2 text-[11.5px] font-medium leading-[1.45] text-text-body"
                >
                  <Check className="h-[11px] w-[11px] text-status-success" aria-hidden="true" />
                  {item}
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
              rooms: availableCount,
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
            <div className="min-w-[1220px]">
              <div className="flex items-center gap-3 pb-2.5 pt-1 text-[10px] font-medium uppercase leading-[1.45] tracking-[0.08em] text-text-muted">
                <p className={COLS.room}>{p.table.room}</p>
                <p className={COLS.occupancy}>{p.table.occupancy}</p>
                <p className={COLS.guests}>{p.table.guests}</p>
                <p className={COLS.childAge}>{p.table.childAge}</p>
                <p className={COLS.bed}>{p.table.bed}</p>
                <p className={COLS.size}>{p.table.size}</p>
                <p className={COLS.view}>{p.table.view}</p>
                <p className={COLS.status}>{p.table.status}</p>
              </div>

              {rooms.map((room) => (
                <div
                  key={room.name}
                  className="flex items-center gap-3 border-t border-border-subtle py-3 text-[12.5px] leading-[1.45] text-text-body"
                >
                  <p className={`${COLS.room} font-medium text-text-primary`}>
                    {ar ? room.nameAr : room.name}
                  </p>
                  <p className={COLS.occupancy}>{room.occupancy}</p>
                  <p className={COLS.guests}>{guestsLabel(room)}</p>
                  <p className={COLS.childAge}>
                    {fill(p.upTo, { age: room.maxChildAge })}
                  </p>
                  <p className={COLS.bed}>{ar ? room.bedsAr : room.beds}</p>
                  <p className={COLS.size}>{room.size}</p>
                  <p className={COLS.view}>{ar ? room.viewAr : room.view}</p>
                  <p className={COLS.status}>
                    {room.status === "pending" ? (
                      <Badge tone="warning">{p.statusPending}</Badge>
                    ) : (
                      <Badge tone="success">{p.statusAvailable}</Badge>
                    )}
                  </p>
                </div>
              ))}

              {pendingRooms.map((room) => (
                <div
                  key={room.name}
                  className="flex items-center gap-3 border-t border-border-subtle py-3 text-[12.5px] leading-[1.45] text-text-body"
                >
                  <p className={`${COLS.room} font-medium text-text-primary`}>
                    {room.name}
                  </p>
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

      {roomOpen && (
        <AddRoomDrawer
          hotelId={hotel.id}
          hotelName={hotelName}
          onClose={() => setRoomOpen(false)}
        />
      )}
    </PageShell>
  );
}

/* ---------- OV 02.R1 / R2 — add a missing room ---------- */

function Field({
  label,
  value,
  placeholder,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="flex w-full min-w-0 flex-col gap-[7px]">
      <span className="text-[12px] font-medium leading-[1.3] text-text-secondary">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-[10px] border border-border-strong bg-surface-default px-3.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-border-focus"
      />
    </label>
  );
}

function AddRoomDrawer({
  hotelId,
  hotelName,
  onClose,
}: {
  hotelId: string;
  hotelName: string;
  onClose: () => void;
}) {
  const { c, dir } = useLanguage();
  const dismiss = useDismiss({ onClose });
  const { submitRoom } = usePortal();
  const navigate = useNavigate();
  const d = c.roomDrawer;

  const [form, setForm] = useState({
    name: "",
    occupancy: "",
    adults: "",
    children: "",
    childAge: "",
    bed: "",
    size: "",
    view: "",
  });
  const [images, setImages] = useState(0);
  const [override, setOverride] = useState(false);
  const [rights, setRights] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const typed = form.name.trim().toLowerCase();
  const matches = typed.length > 2
    ? roomCatalogue
        .map((room) => {
          const nameMatch = room.name.toLowerCase().includes(typed);
          const occMatch =
            form.occupancy.trim() !== "" &&
            String(room.occupancy) === form.occupancy.trim().replace(/\D/g, "");
          if (!nameMatch && !occMatch) return null;
          return { room, match: nameMatch ? d.matchName : d.matchOccupancy };
        })
        .filter((item): item is { room: RoomType; match: string } => item !== null)
        .slice(0, 2)
    : [];

  const showDuplicates = !override && matches.length > 0;

  const ready =
    form.name.trim().length > 2 &&
    form.occupancy.trim() !== "" &&
    form.adults.trim() !== "" &&
    form.childAge.trim() !== "" &&
    form.bed.trim() !== "" &&
    form.size.trim() !== "" &&
    form.view.trim() !== "" &&
    images >= 2 &&
    rights &&
    !showDuplicates;

  const roomName = form.name.trim();

  const submit = async () => {
    setSending(true);
    await wait(600);
    submitRoom({ hotelId, name: roomName });
    notify.success(c.toast.roomSubmitted, {
      description: c.toast.roomSubmittedDesc,
    });
    setSending(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div
        dir={dir}
        {...dismiss.scrim}
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[rgba(10,18,14,0.45)] p-4",
          scrimMotion
        )}
      >
        <div
          {...dismiss.panel}
          className={cn(
            "w-full max-w-[660px] rounded-[16px] bg-surface-default px-7 pb-6 pt-[26px] shadow-overlay",
            panelMotion
          )}
        >
          <div className="flex items-start gap-3.5">
            <span className="flex shrink-0 items-center justify-center rounded-[10px] bg-primary-subtle p-2.5 text-brand-deep">
              <Bed className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase leading-[1.45] tracking-[0.08em] text-brand-mid">
                {d.sentOverline}
              </p>
              <h2 className="text-[20px] font-semibold leading-[1.45] text-text-primary">
                {d.sentTitle}
              </h2>
              <p className="text-[13px] leading-[1.45] text-text-body">{d.sentBody}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={c.common.close}
              className="shrink-0 rounded-lg bg-status-neutral-bg p-2 text-text-secondary transition-colors hover:text-text-primary"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4.5 flex items-center gap-3 rounded-[10px] bg-surface-subtle px-3.5 py-3">
            <span className="flex shrink-0 items-center justify-center rounded-[10px] bg-surface-default p-2.5 text-text-secondary">
              <Hash className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-data text-[13.5px] font-semibold leading-[1.45] text-text-primary">
                ROM-20481
              </p>
              <p className="truncate text-[12px] leading-[1.45] text-text-muted">
                {fill(d.sentRefMeta, { room: roomName, hotel: hotelName })}
              </p>
            </div>
          </div>

          <div className="mt-4.5 rounded-[10px] border border-primary-subtle-border bg-primary-subtle px-3.5 py-3">
            <p className="text-[10px] font-medium uppercase leading-[1.45] tracking-[0.08em] text-brand-deep">
              {d.nextOverline}
            </p>
            <ol className="mt-1.5 space-y-1.5">
              <li className="flex items-start gap-2 text-[12px] leading-[1.45] text-brand-deep">
                <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-brand-deep text-text-inverse">
                  <Check className="h-2.5 w-2.5" aria-hidden="true" />
                </span>
                {fill(d.next1, { count: images })}
              </li>
              {[d.next2, d.next3].map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-2 text-[12px] leading-[1.45] text-brand-deep"
                >
                  <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-surface-default text-[9.5px] font-semibold text-brand-deep">
                    {index + 2}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <p className="mt-4.5 flex items-start gap-2 text-[11.5px] leading-[1.45] text-text-muted">
            <Info className="mt-0.5 h-[13px] w-[13px] shrink-0" aria-hidden="true" />
            {d.meanwhile}
          </p>

          <div className="mt-4.5 flex justify-end gap-2.5">
            <Button
              variant="outline"
              className="h-11 rounded-[10px] px-5 text-sm"
              onClick={onClose}
            >
              {d.backToHotel}
            </Button>
            <Button
              className="h-11 rounded-[10px] px-5 text-sm"
              onClick={() => navigate({ to: "/requests" })}
            >
              {d.viewRequests}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir={dir}
      {...dismiss.scrim}
      className={cn("fixed inset-0 z-50 flex bg-[rgba(10,18,14,0.45)]", scrimMotion)}
    >
      <div aria-hidden="true" className="flex-1" />
      <aside
        {...dismiss.panel}
        className={cn(
          "flex h-full w-full max-w-full flex-col gap-3.5 overflow-y-auto bg-surface-default px-7 py-6 shadow-overlay sm:w-[640px]",
          drawerMotion(dir)
        )}
      >
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase leading-[1.45] tracking-[0.08em] text-brand-mid">
              {fill(d.overline, { hotel: hotelName })}
            </p>
            <h2 className="text-[22px] font-semibold leading-[1.45] text-text-primary">
              {d.title}
            </h2>
            <p className="text-[12.5px] leading-[1.45] text-text-muted">{d.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={c.common.close}
            className="shrink-0 rounded-lg bg-status-neutral-bg p-2 text-text-secondary transition-colors hover:text-text-primary"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <Field
          label={d.name}
          value={form.name}
          placeholder={d.namePh}
          onChange={set("name")}
        />

        {showDuplicates ? (
          <div className="rounded-xl border border-dup-border bg-dup-bg px-3.5 py-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-dup-title" aria-hidden="true" />
              <p className="text-[12.5px] font-semibold leading-[1.45] text-dup-title">
                {d.dupTitle}
              </p>
            </div>
            <div className="mt-2 space-y-2">
              {matches.map(({ room, match }) => (
                <div
                  key={room.name}
                  className="flex flex-wrap items-center gap-2.5 rounded-[10px] bg-surface-default py-2 pe-2.5 ps-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-semibold leading-[1.45] text-text-primary">
                      {room.name}
                    </p>
                    <p className="text-[11px] leading-[1.45] text-text-muted">
                      {fill(d.dupSummary, {
                        guests: room.occupancy,
                        adults: room.adults,
                        children: room.children,
                        bed: room.beds,
                        size: room.size,
                        match,
                      })}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="h-11 shrink-0 rounded-[10px] px-5 text-sm"
                    onClick={() => {
                      setForm({
                        name: room.name,
                        occupancy: fill(d.guestsSuffix, { count: room.occupancy }),
                        adults: String(room.adults),
                        children: String(room.children),
                        childAge: fill(d.yearsSuffix, { count: room.maxChildAge }),
                        bed: room.beds,
                        size: room.size,
                        view: room.view,
                      });
                      setImages(Math.max(room.images, 2));
                      setOverride(true);
                    }}
                  >
                    {d.dupUse}
                  </Button>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] leading-[1.45] text-dup-note">{d.dupNote}</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-[10px] bg-surface-subtle px-3 py-2.5">
            <Info className="h-3.5 w-3.5 shrink-0 text-text-muted" aria-hidden="true" />
            <p className="text-[11.5px] leading-[1.45] text-text-muted">
              {fill(d.dupHint, { hotel: hotelName })}
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2.5">
          <Field
            label={d.occupancy}
            value={form.occupancy}
            placeholder={d.occupancyPh}
            onChange={set("occupancy")}
          />
          <Field
            label={d.adults}
            value={form.adults}
            placeholder={d.adultsPh}
            onChange={set("adults")}
          />
          <Field
            label={d.children}
            value={form.children}
            placeholder={d.childrenPh}
            onChange={set("children")}
          />
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <Field
            label={d.childAge}
            value={form.childAge}
            placeholder={d.childAgePh}
            onChange={set("childAge")}
          />
          <Field
            label={d.bed}
            value={form.bed}
            placeholder={d.bedPh}
            onChange={set("bed")}
          />
          <Field
            label={d.size}
            value={form.size}
            placeholder={d.sizePh}
            onChange={set("size")}
          />
        </div>

        <Field
          label={d.view}
          value={form.view}
          placeholder={d.viewPh}
          onChange={set("view")}
        />

        <div className="flex flex-col gap-1.5">
          <p className="text-[12px] font-medium leading-[1.45] text-text-body">
            {d.images}
          </p>
          {images === 0 ? (
            <button
              type="button"
              onClick={() => setImages(4)}
              className="flex flex-col items-center gap-1.5 rounded-[10px] border border-dashed border-border-strong bg-surface-subtle px-4 py-6 transition-colors hover:border-border-focus"
            >
              <Upload className="h-4 w-4 text-text-secondary" aria-hidden="true" />
              <span className="text-[13px] font-semibold leading-[1.45] text-text-primary">
                {d.dropTitle}
              </span>
              <span className="text-[11.5px] leading-[1.45] text-text-muted">
                {d.dropHint}
              </span>
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: images }).map((_, index) => (
                <div
                  key={index}
                  className="flex h-[74px] w-[100px] flex-col items-start justify-end rounded-lg bg-surface-image p-1.5"
                >
                  {index === 0 && (
                    <span className="rounded bg-primary px-1.5 py-0.5 text-[9px] font-semibold leading-[1.45] text-brand-deep">
                      {d.cover}
                    </span>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setImages((n) => Math.min(n + 1, 8))}
                aria-label={d.dropTitle}
                className="flex h-[74px] w-[100px] items-center justify-center rounded-lg border border-dashed border-border-strong bg-surface-subtle text-text-secondary transition-colors hover:border-border-focus"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 rounded-[10px] border border-primary-subtle-border bg-primary-subtle px-3 py-2.5">
          <Info className="mt-0.5 h-[13px] w-[13px] shrink-0 text-brand-deep" aria-hidden="true" />
          <p className="min-w-0 flex-1 text-[11.5px] leading-[1.45] text-brand-deep">
            {d.info}
          </p>
        </div>

        {/* OV 02.R1 — the rights line every image upload carries. */}
        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={rights}
            onChange={() => setRights((prev) => !prev)}
            className="mt-px h-4 w-4 shrink-0 rounded accent-[var(--brand-deep)]"
          />
          <span className="text-[12px] leading-[1.5] text-text-body">
            {d.rights}
          </span>
        </label>

        <div className="mt-auto flex justify-end pt-2">
          <Button
            className="h-11 rounded-[10px] px-5 text-sm"
            disabled={!ready}
            loading={sending}
            onClick={submit}
          >
            {override ? d.submitDifferent : d.submit}
          </Button>
        </div>
      </aside>
    </div>
  );
}
