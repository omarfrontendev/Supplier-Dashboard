import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileWarning,
  UserRound,
} from "lucide-react";
import {
  BackLink,
  DataRow,
  PageShell,
  SectionCard,
  StatusPill,
} from "@/components/layout/page-shell";
import { BookingStatus } from "@/components/bookings/booking-status";
import {
  ConfirmSheet,
  FulfilmentIncident,
  IssueSheet,
  NumberDialog,
  RejectDialog,
} from "@/components/bookings/booking-dialogs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { bookingCopy } from "@/lib/booking-copy";
import { detailFor } from "@/lib/booking-data";
import { fill, useLanguage } from "@/lib/i18n";
import {
  counted,
  countedOf,
  numbersWord,
  roomsWord,
} from "@/lib/arabic-count";
import { cn } from "@/lib/utils";
import { Gated } from "@/components/system/permission-gate";
import type { ConfirmationValue } from "@/components/bookings/confirmation-numbers";
import { usePortal } from "@/lib/portal-store";
import { IssueSentOverlay } from "@/components/bookings/booking-overlays";

export const Route = createFileRoute("/bookings/$bookingId/")({
  /* OV 05.9 — "Report an issue" opens the booking with its sheet up. */
  validateSearch: (search: Record<string, unknown>): { issue?: boolean } =>
    search["issue"] === true || search["issue"] === "true" ? { issue: true } : {},
  head: () => ({
    meta: [
      { title: "Booking details · Hoteliana Supplier Portal" },
      { name: "description", content: "Review booking details and answer Hoteliana." },
      { property: "og:title", content: "Booking details · Hoteliana Supplier Portal" },
      {
        property: "og:description",
        content: "Review booking details and answer Hoteliana.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BookingDetailPage,
});

/** Figma UI 05.1 / 05.4 / 05.11 — one booking, from request to complete. */
/**
 * Row E - one string for the record, whatever the mode. Per room they are
 * joined so the row and the agent both see every number; pending is empty,
 * which is what leaves the booking on "Reference pending".
 */
function saved(value: ConfirmationValue, rooms: number): string | undefined {
  if (value.mode === "pending") return undefined;
  const list =
    value.mode === "same"
      ? [value.numbers[0] ?? ""]
      : Array.from({ length: rooms }, (_, index) => value.numbers[index] ?? "");
  const clean = list.map((item) => item.trim()).filter(Boolean);
  return clean.length ? clean.join(" · ") : undefined;
}

function BookingDetailPage() {
  const { bookingId } = Route.useParams();
  const { lang } = useLanguage();
  const t = bookingCopy[lang];
  const d = t.detail;
  const ar = lang === "ar";
  const {
    bookings,
    confirmBooking,
    rejectBooking,
    updateBooking,
  } = usePortal();

  const booking = bookings.find((item) => item.id === bookingId);
  if (!booking) throw notFound();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [numberOpen, setNumberOpen] = useState(false);
  /* OV 05.2 - a number already used at this hotel warns, never blocks. */
  const takenAtHotel = useMemo(() => {
    const map: Record<string, string> = {};
    for (const other of bookings) {
      if (other.id === booking?.id || other.hotel !== booking?.hotel) continue;
      for (const part of (other.confirmationNumber ?? "").split(" · ")) {
        if (part.trim()) map[part.trim().toUpperCase()] = other.id;
      }
    }
    return map;
  }, [bookings, booking?.id, booking?.hotel]);
  const { issue } = Route.useSearch();
  const [issueOpen, setIssueOpen] = useState(Boolean(issue));
  const [confirmMode, setConfirmMode] = useState("later");
  /* Row E - the numbers are per room, so the sheet owns one value. */
  const [numbers, setNumbers] = useState<ConfirmationValue>({
    mode: "perRoom",
    numbers: [],
  });
  const [reason, setReason] = useState("No availability");
  const [stopSale, setStopSale] = useState(false);
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(false);

  /* UI 05.11G - a booking sold at a group price carries its own detail. */
  const b = detailFor(booking.id);
  const guest = ar ? booking.guestAr : booking.guest;
  const hotel = ar ? booking.hotelAr : booking.hotel;

  const waiting = booking.status === "onRequest" && booking.task === "answer";
  const referencePending =
    booking.status === "confirmed" && booking.task === "reference";
  /*
   * UI 05.4P — a number per room means a booking can be part-way: one
   * room on the file, another still waiting. Counting them is the only
   * way to tell, and a booking whose single number covers every room
   * says so rather than being guessed at.
   */
  const numbersIn = (booking.confirmationNumber ?? "")
    .split(" · ")
    .map((part) => part.trim())
    .filter(Boolean);
  const roomsWithNumber = booking.sameNumber
    ? booking.rooms
    : numbersIn.length;
  const complete =
    booking.status === "confirmed" && roomsWithNumber >= booking.rooms;
  const partial =
    booking.status === "confirmed" &&
    roomsWithNumber > 0 &&
    roomsWithNumber < booking.rooms;
  /*
   * UI 05.4B - one number per room changes the words, not just the count:
   * "the number" is wrong on a booking that needs two of them.
   */
  const perRoomNumbers = !booking.sameNumber && booking.rooms > 1;
  /* Every room carries its own number, so none of them is worth naming. */
  const allNumbered = complete && !booking.sameNumber && booking.rooms > 1;
  /* The first room still without one, which is what the copy points at. */
  const firstMissing = roomsWithNumber + 1;
  const num = (value: number) =>
    ar ? value.toLocaleString("ar-EG") : String(value);
  /* A clock inside an Arabic sentence is written in Arabic digits. */
  const clock = (value: string) =>
    ar
      ? value.replace(
          /[0-9]/g,
          (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]!
        )
      : value;
  /* "2 rooms" / "غرفتين" - the denominator, which من governs. */
  const roomsPhrase = countedOf(booking.rooms, roomsWord, ar ? "ar" : "en");

  /*
   * UI 05.11C — a room the agent cancelled after confirmation. The room
   * stays on the booking, struck through, and its number goes void: it is
   * off the voucher, but it happened, and the charge on it is real.
   */
  const cancelled = booking.cancelledRoom;
  const liveRooms = cancelled ? booking.rooms - 1 : booking.rooms;
  /* The booking's total is every room; one room's share is the charge. */
  const perNight = Math.round(booking.rate / (booking.nights * booking.rooms));
  const oneRoomTotal = perNight * booking.nights;
  const money = (value: number) =>
    value.toLocaleString(ar ? "ar-EG" : "en-US");
  const rejected = booking.status === "rejected";
  const expired = booking.status === "expired";
  const issueOpenNow = booking.incidentState === "underReview";

  return (
    <PageShell>
      <BackLink to="/bookings" label={d.back} />

      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <BookingStatus booking={booking} />
          {partial && (
            <StatusPill tone="warning">
              {fill(d.partialChip, {
                in: num(roomsWithNumber),
                numbers: countedOf(booking.rooms, numbersWord, ar ? "ar" : "en"),
              })}
            </StatusPill>
          )}
          {issueOpenNow && (
            <StatusPill tone="warning">
              {fill(d.issueChip, { id: "ISS-2026-0184" })}
            </StatusPill>
          )}
        </div>
        <h1 className="mt-2 text-2xl font-semibold text-text-primary sm:text-[28px]">
          {guest}
        </h1>
        <p className="font-data mt-1 text-xs text-text-muted">
          {fill(d.meta, { id: booking.id, hotel, time: clock(b.arrivedAt) })}
        </p>
      </header>

      {waiting && (
        <section className="mb-6 rounded-2xl border border-status-warning/30 bg-status-warning-bg p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-text-primary">
                {fill(d.slaTitle, {
                  time: clock(b.answerBy),
                  left: num(b.minutesLeft),
                })}
              </p>
              <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-text-secondary">
                {fill(d.slaBody, {
                  hours: num(b.slaHours),
                  arrived: clock(b.arrivedAt),
                })}
              </p>
            </div>
            <div className="rounded-xl bg-surface-default px-4 py-3 text-center">
              <p className="font-data text-xl font-semibold text-text-primary">
                {fill(d.slaChip, { hours: b.slaHours })}
              </p>
              <p className="mt-0.5 text-xs text-text-muted">{d.slaChipNote}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            {fill(d.heldNote, { rooms: booking.rooms })}
          </p>
        </section>
      )}

      {referencePending && (
        <section className="mb-6 rounded-2xl border border-status-success/25 bg-status-success-bg p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-text-primary">
                {fill(d.confirmedTitle, { time: clock(b.confirmedAt) })}
              </p>
              <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-text-secondary">
                {perRoomNumbers ? d.confirmedBodyRooms : d.confirmedBody}
              </p>
            </div>
            <Button onClick={() => setNumberOpen(true)}>
              {perRoomNumbers ? d.addNumbers : d.addNumber}
            </Button>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            {fill(d.allotmentNote, {
              rooms: counted(booking.rooms, roomsWord, ar ? "ar" : "en"),
              days: ar ? b.allotmentDaysAr : b.allotmentDays,
            })}
          </p>
        </section>
      )}

      {/* UI 05.4P — confirmed is confirmed; only the paperwork is short. */}
      {partial && (
        <section className="mb-6 rounded-2xl border border-status-success/25 bg-status-success-bg p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-text-primary">
                {fill(d.partialTitle, {
                  in: num(roomsWithNumber),
                  rooms: roomsPhrase,
                })}
              </p>
              <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-text-secondary">
                {fill(d.partialBody, {
                  done: num(roomsWithNumber),
                  left: num(firstMissing),
                })}
              </p>
            </div>
            <Gated permission="bookings.confirm" instead={null}>
              <Button onClick={() => setNumberOpen(true)}>
                {d.addMissing}
              </Button>
            </Gated>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            {fill(d.allotmentNote, {
              rooms: counted(booking.rooms, roomsWord, ar ? "ar" : "en"),
              days: ar ? b.allotmentDaysAr : b.allotmentDays,
            })}
          </p>
        </section>
      )}

      {complete && (
        <section className="mb-6 rounded-2xl border border-status-success/25 bg-status-success-bg p-5 sm:p-6">
          <p className="text-base font-semibold text-text-primary">
            {cancelled
              ? fill(d.cancelledChipTitle, {
                  rooms: counted(1, roomsWord, ar ? "ar" : "en"),
                })
              : /*
                 * UI 05.11G - two numbers do not belong in a headline. A
                 * booking with a number per room says every room has one;
                 * only a single number is worth printing here.
                 */
                allNumbered
                ? booking.rooms === 2
                  ? d.doneTitleBoth
                  : d.doneTitleEvery
                : fill(d.doneTitle, {
                    number: booking.confirmationNumber ?? "",
                  })}
          </p>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-text-secondary">
            {d.doneBody}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            {cancelled
              ? fill(d.cancelledNote, {
                  n: num(cancelled.index),
                  on: ar ? cancelled.onAr : cancelled.on,
                })
              : fill(d.allotmentNote, {
              rooms: counted(booking.rooms, roomsWord, ar ? "ar" : "en"),
              days: ar ? b.allotmentDaysAr : b.allotmentDays,
            })}
          </p>
        </section>
      )}

      {rejected && (
        <section className="mb-6 rounded-2xl border border-status-danger/25 bg-status-danger-bg p-5 sm:p-6">
          <p className="text-base font-semibold text-text-primary">
            {fill(d.rejectedTitle, {
              time: clock(b.confirmedAt),
              reason: booking.reason ?? (ar ? "لا توفر" : "no availability"),
            })}
          </p>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-text-secondary">
            {d.rejectedBody}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            {fill(d.rejectedNote, { rooms: booking.rooms })}
          </p>
        </section>
      )}

      {expired && (
        <section className="mb-6 rounded-2xl border border-border-default bg-surface-subtle p-5 sm:p-6">
          <p className="text-base font-semibold text-text-primary">
            {fill(d.expiredTitle, { time: clock(b.answerBy) })}
          </p>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-text-secondary">
            {d.expiredBody}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            {fill(d.expiredNote, { rooms: booking.rooms })}
          </p>
        </section>
      )}

      {booking.task === "issue" && (
        <FulfilmentIncident
          booking={booking}
          ar={ar}
          closeIssue={() =>
            updateBooking(booking.id, {
              incidentState: "closed",
              status: "cancelled",
              task: null,
            })
          }
        />
      )}

      <SectionCard
        className="mb-6"
        icon={<CalendarDays className="h-5 w-5" aria-hidden="true" />}
        overline={
          rejected
            ? d.rejectedOverline
            : expired
              ? d.expiredOverline
              : waiting
                ? d.beforeOverline
                : d.calendarOverline
        }
        title={
          rejected
            ? d.rejectedHeading
            : expired
              ? d.expiredHeading
              : waiting
                ? d.beforeTitle
                : d.calendarTitle
        }
        description={
          rejected
            ? d.rejectedLead
            : expired
              ? d.expiredLead
              : waiting
                ? d.beforeBody
                : d.calendarBody2
        }
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {b.nights.map((night) => (
            <div
              key={night.label}
              className="rounded-xl border border-border-subtle p-4"
            >
              <p className="text-overline text-text-muted">
                {ar ? night.labelAr : night.label}
              </p>
              <p className="font-data mt-2 text-2xl font-semibold text-text-primary">
                {waiting || rejected || expired ? night.before : night.after}
              </p>
              <p className="mt-0.5 text-xs text-text-muted">
                {fill(d.roomsLeft, { of: night.of })}
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                {rejected
                  ? d.rejectedNight
                  : expired
                    ? d.expiredNight
                    : waiting
                      ? fill(d.needs, { rooms: booking.rooms })
                      : d.afterBooking}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-status-info/25 bg-status-info-bg p-4">
          <p className="text-sm font-semibold text-text-primary">
            {rejected
              ? d.rejectedRateTitle
              : expired
                ? fill(d.expiredRateTitle, { total: num(booking.rate) })
                : waiting
                  ? fill(d.rateTitle, { sold: num(b.soldRate), now: num(b.currentRate) })
                  : booking.nationalityPrice
                    ? fill(d.keptGroupTitle, {
                        group: ar
                          ? booking.nationalityPrice.groupAr
                          : booking.nationalityPrice.group,
                      })
                    : fill(d.keptTitle, { sold: num(b.soldRate) })}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            {rejected
              ? fill(d.rejectedRateBody, { now: num(b.currentRate) })
              : expired
                ? d.expiredRateBody
                : waiting
                  ? fill(d.rateBody, { sold: num(b.soldRate) })
                  : fill(d.keptBody, { now: num(b.currentRate) })}
          </p>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)]">
        <div className="space-y-6">
          <SectionCard
            icon={<BedDouble className="h-5 w-5" aria-hidden="true" />}
            overline={d.detailsOverline}
            title={d.detailsTitle}
          >
            <div>
              <DataRow label={d.statusRow}>
                <span className="text-sm text-text-primary">
                  {waiting
                    ? d.statusPending
                    : referencePending
                      ? d.statusReference
                      : d.statusConfirmed}
                </span>
                <BookingStatus booking={booking} />
              </DataRow>
              {b.rows.map(([label, labelAr, value, valueAr]) => (
                <DataRow key={label} label={ar ? labelAr : label}>
                  <span className="text-sm text-text-primary">
                    {ar ? valueAr : value}
                  </span>
                </DataRow>
              ))}
            </div>
          </SectionCard>

          {waiting && (
            <SectionCard overline={d.answerOverline} title={d.answerTitle}>
              <p className="text-sm leading-relaxed text-text-secondary">
                {fill(d.answerBody, { rooms: booking.rooms })}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  [d.ifConfirm, fill(d.ifConfirmBody, { rooms: booking.rooms })],
                  [d.ifReject, d.ifRejectBody],
                  [d.ifNothing, fill(d.ifNothingBody, { time: clock(b.answerBy) })],
                ].map(([title, body]) => (
                  <div key={title} className="rounded-xl bg-surface-subtle p-4">
                    <p className="text-sm font-semibold text-text-primary">
                      {title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                      {body}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-text-muted">{d.recorded}</p>
              <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
                {/* §0.5 - no key, no button: a line names who can decide. */}
                <Gated
                  permission="bookings.reject"
                  ask={{ hotel: booking.hotel }}
                  instead={null}
                >
                  <Button variant="outline" onClick={() => setRejectOpen(true)}>
                    {d.rejectCta}
                  </Button>
                </Gated>
                <Gated
                  permission="bookings.confirm"
                  ask={{ hotel: booking.hotel }}
                >
                  <Button onClick={() => setConfirmOpen(true)}>
                    {d.confirmCta}
                  </Button>
                </Gated>
              </div>
            </SectionCard>
          )}

          {(referencePending || complete) && (
            <SectionCard
              icon={
                complete ? (
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Clock3 className="h-5 w-5" aria-hidden="true" />
                )
              }
              overline={complete ? d.doneOverline : d.leftOverline}
              title={
                complete
                  ? d.doneHeading
                  : perRoomNumbers
                    ? fill(d.leftTitleRooms, {
                        in: num(roomsWithNumber),
                        rooms: roomsPhrase,
                      })
                    : d.leftTitle
              }
              description={
                complete
                  ? d.doneLead
                  : perRoomNumbers
                    ? d.leftBodyRooms
                    : d.leftBody
              }
            >
              <div className="grid gap-3 sm:grid-cols-3">
                {(complete
                  ? d.donePoints
                  : perRoomNumbers
                    ? d.leftPointsRooms
                    : d.leftPoints
                ).map(
                  ([title, body]) => (
                    <div key={title} className="rounded-xl bg-surface-subtle p-4">
                      <p className="text-sm font-semibold text-text-primary">
                        {title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-text-secondary">
                        {body}
                      </p>
                    </div>
                  )
                )}
              </div>
              <p className="mt-4 flex items-start gap-2 text-xs text-text-muted">
                <AlertTriangle
                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  aria-hidden="true"
                />
                {d.cannotCancel}
              </p>
              <div className="mt-5 flex flex-wrap justify-end gap-3">
                <Button variant="outline" onClick={() => setIssueOpen(true)}>
                  <FileWarning className="h-4 w-4" aria-hidden="true" />
                  {d.reportIssue}
                </Button>
                {!complete && (
                  <Button onClick={() => setNumberOpen(true)}>
                    {d.addNumberCta}
                  </Button>
                )}
              </div>
            </SectionCard>
          )}
        </div>

        <div className="space-y-6">
          <SectionCard
            icon={<UserRound className="h-5 w-5" aria-hidden="true" />}
            overline={d.guestsOverline}
            title={d.guestsTitle}
          >
            <div>
              {b.guests.map(([label, labelAr, value, valueAr]) => (
                <DataRow key={label} label={ar ? labelAr : label}>
                  <span className="text-sm text-text-primary">
                    {ar ? valueAr : value}
                  </span>
                </DataRow>
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-text-muted">
              {ar ? b.guestNoteAr : b.guestNote}
            </p>
          </SectionCard>

          <SectionCard
            overline={d.requestsOverline}
            title={d.requestsTitle}
          >
            <div className="space-y-3">
              {b.requests.map(([label, labelAr, value, valueAr]) => (
                <div key={label}>
                  <p className="text-overline text-text-muted">
                    {ar ? labelAr : label}
                  </p>
                  <p className="mt-0.5 text-sm text-text-primary">
                    {ar ? valueAr : value}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/*
        * UI 05.4P / 05.11 — the numbers, room by room, once the booking is
        * confirmed. One line per room, so a room with nothing on it is a
        * gap you can see rather than a total you have to work out.
        */}
      {(partial || complete || (referencePending && perRoomNumbers)) && (
        <SectionCard
          className="mt-5"
          overline={d.numbersOverline}
          title={
            cancelled
              ? fill(d.cancelledNumbersHeading, {
                  active: num(liveRooms),
                  void: num(1),
                })
              : allNumbered
                ? booking.rooms === 2
                  ? d.numbersHeadingBoth
                  : d.numbersHeadingEvery
                : fill(d.numbersHeading, {
                    in: num(roomsWithNumber),
                    rooms: roomsPhrase,
                  })
          }
        >
          <div className="overflow-hidden rounded-xl border border-border-subtle">
            {Array.from({ length: booking.rooms }, (_, index) => {
              const has = booking.sameNumber || index < numbersIn.length;
              const number = booking.sameNumber
                ? numbersIn[0]
                : numbersIn[index];
              const who = (b.guests.find(
                ([label]) => label === `Room ${index + 1}`
              ) ?? [])[ar ? 3 : 2];
              /* The guest list qualifies each name with (adult); this
                 line only needs who the room is for. */
              const lead = ((who ?? "").split(" · ")[0] ?? "")
                .replace(/\s*\([^)]*\)\s*$/, "")
                .trim();
              const isVoid = cancelled?.index === index + 1;
              return (
                <div
                  key={index}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle px-4 py-3 last:border-b-0"
                >
                  <p className="text-[12px] text-text-muted sm:w-[90px] sm:shrink-0">
                    {fill(d.roomLine, { n: num(index + 1) })}
                  </p>
                  <p
                    className={cn(
                      "min-w-0 flex-1 text-[12.5px] text-text-primary",
                      /* Struck, not removed: the room was really booked,
                         and the charge on it is really owed. */
                      isVoid && "text-text-muted line-through"
                    )}
                  >
                    {/* The room's Arabic name lives in the offer line,
                        which is where the Arabic reader must get it. */}
                    {[
                      /* The offer line carries the short room name in both
                         languages; `room` spells out its bed layout too,
                         which this line does not need. */
                      (ar ? booking.offerAr : booking.offer).split(
                        " · "
                      )[0] ?? booking.room,
                      lead,
                      has ? number : d.notAddedYet,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {isVoid ? (
                    <span className="text-[11.5px] text-text-muted">
                      {d.roomCancelledVoid}
                    </span>
                  ) : (
                    <StatusPill tone={has ? "success" : "warning"}>
                      {has ? d.numberAdded : d.numberPending}
                    </StatusPill>
                  )}
                </div>
              );
            })}
          </div>

          {cancelled && (
            <div className="mt-3 rounded-xl bg-[#e8f1f8] p-3.5">
              <p className="text-[12.5px] font-semibold text-[#2f5673]">
                {fill(d.cancelledBandTitle, { n: num(cancelled.index) })}
              </p>
              <p className="mt-0.5 text-[12px] leading-5 text-[#2f5673]">
                {fill(d.cancelledBandBody, {
                  n: num(cancelled.index),
                  who: (
                    (b.guests.find(
                      ([label]) => label === `Room ${cancelled.index}`
                    ) ?? [])[ar ? 3 : 2] ?? ""
                  )
                    .split(" \u00b7 ")[0]
                    ?.replace(/\s*\([^)]*\)\s*$/, "")
                    .trim() ?? "",
                  on: ar ? cancelled.onAr : cancelled.on,
                  number: cancelled.number,
                })}
              </p>
            </div>
          )}
        </SectionCard>
      )}

      {/* UI 05.11C — nothing is owed, so the card says so and stops. */}
      {complete && cancelled && (
        <SectionCard
          className="mt-5"
          overline={d.doneOverline}
          title={d.doneCardTitle}
        >
          <p className="text-sm leading-relaxed text-text-secondary">
            {d.doneCardBody}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {(
              [
                [
                  d.doneAgentTitle,
                  fill(d.doneAgentBody, { n: num(cancelled.index) }),
                ],
                [
                  d.doneCalendarTitle,
                  fill(d.doneCalendarBody, {
                    left: num(liveRooms),
                    n: num(cancelled.index),
                  }),
                ],
                [d.doneWrongTitle, d.doneWrongBody],
              ] as Array<[string, string]>
            ).map(([title, body]) => (
              <div
                key={title}
                className="rounded-xl border border-border-subtle p-3.5"
              >
                <p className="text-[12.5px] font-semibold text-text-primary">
                  {title}
                </p>
                <p className="mt-1 text-[11.5px] leading-4 text-text-muted">
                  {body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11.5px] text-text-muted">{d.leftFoot}</p>
            <div className="flex flex-wrap gap-2.5">
              <Button variant="outline" onClick={() => setIssueOpen(true)}>
                {d.reportIssue}
              </Button>
              <Gated permission="bookings.confirm" instead={null}>
                <Button onClick={() => setNumberOpen(true)}>
                  {d.editNumbers}
                </Button>
              </Gated>
            </div>
          </div>
        </SectionCard>
      )}

      {/* The one thing still owed, and why nothing else is at risk. */}
      {partial && (
        <SectionCard
          className="mt-5"
          overline={d.leftOverline}
          title={fill(d.leftTitlePartial, { left: num(firstMissing) })}
        >
          <p className="text-sm leading-relaxed text-text-secondary">
            {fill(d.leftBodyPartial, { left: num(firstMissing) })}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {(
              [
                [d.leftSafeTitle, d.leftSafeBody],
                [
                  d.leftReminderTitle,
                  fill(d.leftReminderBody, { left: num(firstMissing) }),
                ],
                [d.leftFlagTitle, d.leftFlagBody],
              ] as Array<[string, string]>
            ).map(([title, body]) => (
              <div
                key={title}
                className="rounded-xl border border-border-subtle p-3.5"
              >
                <p className="text-[12.5px] font-semibold text-text-primary">
                  {title}
                </p>
                <p className="mt-1 text-[11.5px] leading-4 text-text-muted">
                  {body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11.5px] text-text-muted">{d.leftFoot}</p>
            <div className="flex flex-wrap gap-2.5">
              <Button variant="outline" onClick={() => setIssueOpen(true)}>
                {d.reportIssue}
              </Button>
              <Gated permission="bookings.confirm" instead={null}>
                <Button onClick={() => setNumberOpen(true)}>
                  {d.addMissing}
                </Button>
              </Gated>
            </div>
          </div>
        </SectionCard>
      )}

      <ConfirmSheet
        booking={booking}
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        t={t}
        value={numbers}
        setValue={setNumbers}
        taken={takenAtHotel}
        onConfirm={() => {
          confirmBooking(booking.id, saved(numbers, booking.rooms));
          setConfirmOpen(false);
        }}
      />
      <RejectDialog
        open={rejectOpen}
        setOpen={setRejectOpen}
        t={t}
        booking={booking}
        reason={reason}
        setReason={setReason}
        stopSale={stopSale}
        setStopSale={setStopSale}
        onReject={() => {
          rejectBooking(booking.id, reason);
          setRejectOpen(false);
        }}
      />
      <NumberDialog
        open={numberOpen}
        setOpen={setNumberOpen}
        t={t}
        rooms={booking.rooms}
        value={numbers}
        setValue={setNumbers}
        taken={takenAtHotel}
        onSave={() => {
          const value = saved(numbers, booking.rooms);
          if (!value) return;
          confirmBooking(booking.id, value);
          setNumberOpen(false);
        }}
      />
      <IssueSheet
        booking={booking}
        open={issueOpen}
        setOpen={setIssueOpen}
        t={t}
        onSend={() => {
          setIssueOpen(false);
          updateBooking(booking.id, {
            task: "issue",
            incidentState: "underReview",
          });
          setReceipt(true);
        }}
      />

      {/* OV 05.13 — the issue is with Hoteliana; the booking has not moved. */}
      {receipt && (
        <IssueSentOverlay
          onClose={() => setReceipt(false)}
          onFollow={() => {
            setReceipt(false);
            navigate({ to: "/cases" });
          }}
        />
      )}
    </PageShell>
  );
}
