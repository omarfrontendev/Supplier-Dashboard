import { useState } from "react";
import {
  Check,
  Hash,
  Image as ImageIcon,
  Info,
  Search,
  ShieldCheck,
} from "lucide-react";
import {
  arDigits,
  countedOf,
  hotelsWord,
  requestsWord,
} from "@/lib/arabic-count";
import { Drawer, IconModal } from "@/components/layout/overlay";
import { HotelGallery } from "@/components/hotels/hotel-gallery";
import type { Hotel } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/layout/page-shell";
import { fill, useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  confirmRequest,
  librarySearch,
  quickView,
  quickViewRooms,
  requestSent,
  type Bi,
  type FilterGroup,
} from "@/lib/library-overlay-data";

/** OV 02.2 — the overline and value of one profile line. */
function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-3 py-1.5">
      <span className="w-[130px] shrink-0 text-[12.5px] text-text-muted">
        {label}
      </span>
      <span className="min-w-0 flex-1 text-[12.5px] font-medium text-text-primary">
        {value}
      </span>
    </div>
  );
}

/**
 * OV 02.2 / 02.2D — everything Hoteliana holds about a library hotel,
 * and the one thing you can do about it.
 */
export function HotelQuickView({
  hotel,
  name,
  meta,
  requested = false,
  onClose,
  onRequest,
  onSeeRequest,
}: {
  /** The library record, for the photographs Hoteliana holds. */
  hotel: Hotel;
  name: string;
  meta: string;
  /** A hotel already asked for cannot be asked for again. */
  requested?: boolean;
  onClose: () => void;
  onRequest?: (() => void) | undefined;
  onSeeRequest?: (() => void) | undefined;
}) {
  const { lang, c: c2 } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = quickView;

  return (
    <Drawer
      width="560px"
      overline={c.overline[k]}
      title={name}
      meta={meta}
      divider={false}
      onClose={onClose}
      footer={
        requested ? (
          <Button variant="outline" onClick={onSeeRequest}>
            {c.seeRequest[k]}
          </Button>
        ) : (
          <Button onClick={onRequest}>{c.requestAccess[k]}</Button>
        )
      }
    >
      <div className="space-y-4">
        <StatusPill tone={requested ? "warning" : "neutral"}>
          {requested ? c.requested[k] : c.available[k]}
        </StatusPill>

        {/* The photographs Hoteliana holds. The frame draws the cover
            alone and no count; the arrows are the only thing that says
            there is more than one, so they carry it on their own. */}
        <HotelGallery
          hotel={hotel}
          name={name}
          labels={{
            group: c2.hotelProfile.galleryGroup,
            previous: c2.hotelProfile.galleryPrevious,
            next: c2.hotelProfile.galleryNext,
            alt: c2.hotelProfile.galleryAlt,
          }}
          className="h-[150px] rounded-[12px]"
        />

        <div className="rounded-[12px] bg-surface-subtle px-4 py-3">
          <p className="text-overline text-text-muted">{c.profileOverline[k]}</p>
          {/* The profile is the hotel's own, not the frame's one hotel
              repeated: a quick view that names Al Safa City and then
              describes Al Noor is worse than no quick view. */}
          <div className="mt-2">
            <ProfileRow label={c.nameAr[k]} value={hotel.nameAr} />
            <ProfileRow
              label={c.address[k]}
              value={
                k === "ar"
                  ? `${hotel.addressAr}، ${hotel.districtAr}`
                  : `${hotel.address}, ${hotel.district}`
              }
            />
            <ProfileRow
              label={c.description[k]}
              value={k === "ar" ? hotel.descAr : hotel.descEn}
            />
            <ProfileRow
              label={c.distance[k]}
              value={k === "ar" ? hotel.distanceAr : hotel.distance}
            />
            <ProfileRow label={c.licence[k]} value={c.licenceValue[k]} />
          </div>
        </div>

        <div>
          <p className="text-overline text-text-muted">{c.amenitiesTitle[k]}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {c.amenities.map((item) => (
              <span
                key={item.en}
                className="inline-flex items-center gap-1 rounded-full border border-border-subtle px-2.5 py-1 text-[11.5px] text-text-body"
              >
                <Check className="h-3 w-3 text-status-success" aria-hidden="true" />
                {item[k]}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="text-overline text-text-muted">
              {fill(c.cataloqueTitle[k], { count: quickViewRooms.length })}
            </p>
            <p className="max-w-[220px] text-[11px] leading-4 text-text-muted">
              {c.catalogueNote[k]}
            </p>
          </div>
          <div className="mt-2">
            {quickViewRooms.map((room) => (
              <div
                key={room.name.en}
                className="flex flex-wrap items-center gap-3 border-t border-border-subtle py-2.5 first:border-t-0"
              >
                <span className="w-[130px] shrink-0 text-[12.5px] font-semibold text-text-primary">
                  {room.name[k]}
                </span>
                <span className="min-w-0 flex-1 text-[11.5px] text-text-secondary">
                  {room.detail[k]}
                </span>
                <span className="text-[11.5px] text-status-success">
                  {room.state[k]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="flex items-start gap-2 rounded-[10px] bg-status-success-bg px-3.5 py-3 text-[12px] leading-4 text-text-body">
          <ShieldCheck
            className="mt-px h-3.5 w-3.5 shrink-0 text-status-success"
            aria-hidden="true"
          />
          {requested ? c.pendingNote[k] : c.approveNote[k]}
        </p>
      </div>
    </Drawer>
  );
}

/** OV 02.3 / 02.1B — the hotels picked, and what asking for them means. */
export function ConfirmRequestOverlay({
  hotels: picked,
  onClose,
  onConfirm,
  sending = false,
}: {
  hotels: Array<{ name: string; meta: string; image?: string | undefined }>;
  onClose: () => void;
  onConfirm: () => void;
  sending?: boolean;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = confirmRequest;
  const many = picked.length > 1;
  const count = picked.length;

  return (
    <IconModal
      width="660px"
      overline={c.overline[k]}
      title={
        many
          ? fill(c.titleMany[k], { hotels: countedOf(count, hotelsWord, k) })
          : c.titleOne[k]
      }
      body={many ? c.bodyMany[k] : c.bodyOne[k]}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {c.cancel[k]}
          </Button>
          <Button loading={sending} onClick={onConfirm}>
            {many
              ? fill(c.sendMany[k], { requests: countedOf(count, requestsWord, k) })
              : c.sendOne[k]}
          </Button>
        </>
      }
    >
      {/* Each hotel as the frame draws it: its own photograph, its name,
          and the one line that says where it is. */}
      <div className="space-y-2">
        {picked.map((hotel) => (
          <div
            key={hotel.name}
            className="flex items-center gap-3 rounded-[12px] bg-surface-subtle px-3 py-2.5"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-surface-image">
              {hotel.image ? (
                <img
                  src={hotel.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon
                  className="h-4 w-4 text-white/40"
                  aria-hidden="true"
                />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold text-text-primary">
                {hotel.name}
              </p>
              <p className="mt-0.5 text-[11.5px] text-text-muted">
                {hotel.meta}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* What you are agreeing to, set apart from the rest of the panel. */}
      <div className="rounded-[12px] bg-primary-subtle px-3.5 py-3">
        <p className="text-overline text-brand-deep">{c.termsTitle[k]}</p>
        <ul className="mt-2 space-y-1.5">
          {c.terms.map((term) => (
            <li
              key={term.en}
              className="flex items-start gap-2 text-[12.5px] leading-[18px] text-text-body"
            >
              <Check
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-status-success"
                aria-hidden="true"
              />
              {term[k]}
            </li>
          ))}
        </ul>
      </div>

      {/* Not something you agree to - something we do. */}
      <p className="flex items-start gap-2 text-[11.5px] leading-4 text-text-muted">
        <Info className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {c.recorded[k]}
      </p>
    </IconModal>
  );
}

/** OV 02.4 — the request is with Hoteliana, and what becomes of it. */
export function RequestSentOverlay({
  copy,
  refs,
  names,
  onClose,
  onViewRequests,
}: {
  /** OV 02.8C and OV 02.R3 are the same shell with their own words. */
  copy?: typeof requestSent;
  refs: string;
  names: string;
  onClose: () => void;
  onViewRequests?: (() => void) | undefined;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = copy ?? requestSent;

  return (
    <IconModal
      width="660px"
      overline={c.overline[k]}
      title={c.title[k]}
      body={c.body[k]}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {c.back[k]}
          </Button>
          <Button onClick={onViewRequests}>{c.viewRequests[k]}</Button>
        </>
      }
    >
      <div className="flex items-center gap-3 rounded-[12px] bg-surface-subtle px-3 py-2.5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface-default text-text-muted">
          <Hash className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-data text-[12.5px] font-semibold text-text-primary">
            {refs}
          </p>
          <p className="mt-0.5 text-[11.5px] text-text-muted">{names}</p>
        </div>
      </div>

      <div className="rounded-[12px] bg-primary-subtle px-3.5 py-3">
        <p className="text-overline text-brand-deep">{c.stepsTitle[k]}</p>
        <ol className="mt-2 space-y-2">
          {c.steps.map((step, index) => (
            <li key={step.en} className="flex items-start gap-2.5">
              {/* The first step already happened - it is not a step you
                  are waiting on, so it is ticked rather than numbered. */}
              {index === 0 ? (
                <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-deep text-primary">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
              ) : (
                <span className="font-data mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-default text-[11px] text-text-body">
                  {/* A step number is a number the reader reads. */}
                  {k === "ar" ? arDigits(index + 1) : index + 1}
                </span>
              )}
              <span className="text-[12.5px] leading-[18px] text-text-body">
                {step[k]}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <p className="flex items-start gap-2 text-[11.5px] leading-4 text-text-muted">
        <Info className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {c.note[k]}
      </p>
    </IconModal>
  );
}

/** OV 02.10 — a search that reads the catalogue, not your own list. */
export function LibrarySearchOverlay({
  onClose,
  onRequest,
  onOpen,
  onViewRequest,
}: {
  onClose: () => void;
  onRequest?: (() => void) | undefined;
  onOpen?: (() => void) | undefined;
  onViewRequest?: (() => void) | undefined;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = librarySearch;
  const [term, setTerm] = useState(c.term[k]);
  const hits = c.hits.filter((hit) =>
    hit.name[k].toLowerCase().includes(term.trim().toLowerCase())
  );

  return (
    <IconModal
      width="760px"
      overline=""
      title={c.title[k]}
      body={c.body[k]}
      onClose={onClose}
      footer={
        <Button variant="outline" onClick={onClose}>
          {c.close[k]}
        </Button>
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="relative min-w-0 flex-1">
          <Search
            className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted start-3"
            aria-hidden="true"
          />
          <input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            className="h-11 w-full rounded-[10px] border border-border-default bg-surface-default ps-9 pe-3 text-sm text-text-primary outline-none focus:border-brand-deep"
          />
        </span>
        <span className="text-[12.5px] text-text-muted">
          {fill(c.matches[k], { count: hits.length })}
        </span>
      </div>

      <div>
        <p className="text-overline text-text-muted">{c.matchesTitle[k]}</p>
        <div className="mt-2 overflow-hidden rounded-[12px] border border-border-subtle">
          {hits.map((hit) => (
            <div
              key={hit.name.en}
              className="flex flex-wrap items-center gap-3 px-3.5 py-2.5 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-border-subtle"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[12.5px] font-semibold text-text-primary">
                  {hit.name[k]}
                </span>
                <span className="mt-0.5 block text-[11.5px] text-text-muted">
                  {hit.meta[k]}
                </span>
              </span>
              {hit.state === "linked" && (
                <StatusPill tone="success">{c.linked[k]}</StatusPill>
              )}
              {hit.state === "pending" && (
                <StatusPill tone="warning">{c.pending[k]}</StatusPill>
              )}
              {hit.state === "none" ? (
                <Button size="sm" onClick={onRequest}>
                  {c.request[k]}
                </Button>
              ) : (
                <button
                  type="button"
                  onClick={hit.state === "linked" ? onOpen : onViewRequest}
                  className="text-[12.5px] font-medium text-text-primary hover:underline"
                >
                  {hit.state === "linked" ? c.open[k] : c.viewRequest[k]}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11.5px] leading-4 text-text-muted">{c.note[k]}</p>
    </IconModal>
  );
}

/** One group of a filter overlay: a heading and its counted lines. */
function FilterGroupRows({
  group,
  value,
  onPick,
  radio,
  k,
}: {
  group: FilterGroup;
  value: number;
  onPick: (index: number) => void;
  /** The last group is a relationship — one of, not any of. */
  radio: boolean;
  k: "en" | "ar";
}) {
  return (
    <div>
      <p className="text-overline text-text-muted">{group.title[k]}</p>
      <div className="mt-2 space-y-1">
        {group.options.map((option, index) => (
          <label
            key={option.label.en}
            className={cn(
              "flex cursor-pointer items-start gap-2.5 rounded-[10px] px-3 py-2 transition-colors",
              index === value ? "bg-surface-subtle" : "hover:bg-surface-subtle/60"
            )}
          >
            <input
              type={radio ? "radio" : "checkbox"}
              name={group.title.en}
              checked={index === value}
              onChange={() => onPick(index)}
              className={cn(
                "mt-px h-4 w-4 shrink-0 accent-[var(--brand-deep)]",
                radio ? "" : "rounded"
              )}
            />
            <span className="min-w-0">
              <span className="block text-[12.5px] leading-4 text-text-primary">
                {option.label[k]}
              </span>
              {option.count[k] && (
                <span className="mt-0.5 block text-[11px] leading-4 text-text-muted">
                  {option.count[k]}
                </span>
              )}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

/** OV 02.9 / 02.11 — narrowing a list without changing what is in it. */
export function LibraryFilterOverlay({
  copy,
  width,
  columns = 2,
  search,
  count,
  onClose,
  onApply,
}: {
  copy: {
    title: Bi;
    body: Bi;
    groups: FilterGroup[];
    clear: Bi;
    apply: Bi;
    search?: Bi;
  };
  width: string;
  /** The library filter runs its four groups down two columns. */
  columns?: 1 | 2;
  search?: boolean;
  count: number;
  onClose: () => void;
  onApply?: (() => void) | undefined;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const [picked, setPicked] = useState<number[]>(copy.groups.map(() => 0));
  const [term, setTerm] = useState("");
  const last = copy.groups.length - 1;

  const rows = (from: number, to: number) =>
    copy.groups.slice(from, to).map((group, at) => {
      const index = from + at;
      return (
        <FilterGroupRows
          key={group.title.en}
          group={group}
          value={picked[index] ?? 0}
          radio={index === last}
          onPick={(next) =>
            setPicked((prev) =>
              prev.map((item, item_at) => (item_at === index ? next : item))
            )
          }
          k={k}
        />
      );
    });

  const half = Math.ceil(copy.groups.length / 2);

  return (
    <IconModal
      width={width}
      overline=""
      title={copy.title[k]}
      body={copy.body[k]}
      onClose={onClose}
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => setPicked(copy.groups.map(() => 0))}
          >
            {copy.clear[k]}
          </Button>
          {/* The frame draws this one deep green, not the usual lime. */}
          <Button variant="dark" onClick={onApply ?? onClose}>
            {fill(copy.apply[k], { count })}
          </Button>
        </>
      }
    >
      {search && copy.search && (
        <span className="relative block">
          <Search
            className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted start-3"
            aria-hidden="true"
          />
          <input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder={copy.search[k]}
            className="h-11 w-full rounded-[10px] border border-border-default bg-surface-default ps-9 pe-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-brand-deep"
          />
        </span>
      )}

      {columns === 2 ? (
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-6">{rows(0, half)}</div>
          <div className="space-y-6">{rows(half, copy.groups.length)}</div>
        </div>
      ) : (
        <div className="space-y-6">{rows(0, copy.groups.length)}</div>
      )}
    </IconModal>
  );
}
