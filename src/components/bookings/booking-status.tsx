import { StatusPill } from "@/components/layout/page-shell";
import type { Booking } from "@/lib/booking-data";
import { useLanguage } from "@/lib/i18n";
import { statusLabel } from "@/lib/status-tones";

/**
 * REF 00.S paints both pills, so neither the label nor the colour is chosen
 * here - the status name is handed to the one table. Three of these used to
 * disagree with it: Cancelled was grey, and the two "asked" tasks were blue.
 */
const STATUS = {
  onRequest: "On Request",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  rejected: "Rejected",
  expired: "Expired",
} as const;

const TASK = {
  answer: "Needs an answer",
  reference: "Reference pending",
  amendment: "Amendment asked",
  cancellation: "Cancellation asked",
  issue: "Issue reported",
} as const;

export function BookingStatus({ booking }: { booking: Booking }) {
  const { lang } = useLanguage();
  const status = statusLabel(STATUS[booking.status], lang);
  const task = booking.task ? statusLabel(TASK[booking.task], lang) : null;

  return (
    <div className="flex flex-wrap gap-1">
      <StatusPill status={STATUS[booking.status]}>{status.label}</StatusPill>
      {task && (
        <StatusPill status={TASK[booking.task!]}>{task.label}</StatusPill>
      )}
    </div>
  );
}
