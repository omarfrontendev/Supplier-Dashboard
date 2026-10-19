import { z } from "zod";

import { fill } from "@/lib/i18n";
import type { Dict } from "@/lib/dict";
import { toAmount } from "@/store/features/contracts/contract-payload";
import {
  SLA_MAX_MINUTES,
  SLA_MIN_MINUTES,
  type ContractDraftState,
} from "@/store/features/contracts/types";

export type ContractSectionKey = "basics" | "pricing" | "rooms" | "booking";

export interface ContractIssue {
  section: ContractSectionKey;
  message: string;
}

type Messages = Dict["builder"]["form"]["v"];

const filled = (value: string) => toAmount(value) !== null;

export const contractFinalSchema = (m: Messages) =>
  z.custom<ContractDraftState>().superRefine((draft, ctx) => {
    const issue = (section: ContractSectionKey, message: string) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [section], message });

    const { basics } = draft;
    if (!basics.hotelId) issue("basics", m.hotel);
    if (!basics.name.trim()) issue("basics", m.name);
    if (!basics.startDate) issue("basics", m.startDate);
    if (!basics.endDate) issue("basics", m.endDate);
    if (basics.startDate && basics.endDate && basics.endDate <= basics.startDate) {
      issue("basics", m.endAfterStart);
    }
    if (!basics.currency) issue("basics", m.currency);

    const split = draft.weekPricing === "weekday_weekend";
    if (split && basics.weekendDays.length === 0) issue("basics", m.weekend);

    if (basics.bookingType === "on_request") {
      const minutes = toAmount(basics.slaMinutes);
      if (
        minutes === null ||
        !Number.isInteger(minutes) ||
        minutes < SLA_MIN_MINUTES ||
        minutes > SLA_MAX_MINUTES
      ) {
        issue("booking", fill(m.sla, { min: SLA_MIN_MINUTES, max: SLA_MAX_MINUTES }));
      }
    }

    if (draft.pricingModel === "base_supplements") {
      const base = draft.baseSupplements;
      if (!base.baseRoomId) issue("pricing", m.baseRoom);
      if (!filled(base.weekdayBaseCost)) {
        issue("pricing", split ? m.weekdayBase : m.baseCost);
      }
      if (split && !filled(base.weekendBaseCost)) issue("pricing", m.weekendBase);
      if (base.rooms.some((room) => room.roomId !== base.baseRoomId && !filled(room.supplement))) {
        issue("rooms", m.supplement);
      }
    } else {
      if (draft.fixedRooms.length === 0) issue("rooms", m.fixedRooms);
      if (
        draft.fixedRooms.some(
          (room) => !filled(room.weekdayPrice) || (split && !filled(room.weekendPrice)),
        )
      ) {
        issue("rooms", m.fixedPrice);
      }
    }
  });

export function validateContract(draft: ContractDraftState, m: Messages): ContractIssue[] {
  const result = contractFinalSchema(m).safeParse(draft);
  if (result.success) return [];
  return result.error.issues.map((issue) => ({
    section: issue.path[0] as ContractSectionKey,
    message: issue.message,
  }));
}
