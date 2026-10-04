export type CalendarLens = "rates" | "children" | "restrictions" | "sold" | "pickup";

export interface RoomOffer {
  roomName: string;
  id: string;
  name: string;
  nameAr: string;
  mealPlan: "Breakfast included" | "Room only";
  mealPlanAr: "يشمل الإفطار" | "الغرفة فقط";
  adjustment: number;
}

export const roomOffers: RoomOffer[] = [
  { roomName: "Double", id: "double-bb-flex", name: "Flexible rate", nameAr: "سعر مرن", mealPlan: "Breakfast included", mealPlanAr: "يشمل الإفطار", adjustment: 0 },
  { roomName: "Double", id: "double-ro-nr", name: "Non-refundable", nameAr: "غير قابل للاسترداد", mealPlan: "Room only", mealPlanAr: "الغرفة فقط", adjustment: -45 },
  { roomName: "Triple", id: "triple-bb-flex", name: "Flexible rate", nameAr: "سعر مرن", mealPlan: "Breakfast included", mealPlanAr: "يشمل الإفطار", adjustment: 0 },
  { roomName: "Triple", id: "triple-ro-nr", name: "Non-refundable", nameAr: "غير قابل للاسترداد", mealPlan: "Room only", mealPlanAr: "الغرفة فقط", adjustment: -55 },
  { roomName: "Quad", id: "quad-bb-flex", name: "Flexible rate", nameAr: "سعر مرن", mealPlan: "Breakfast included", mealPlanAr: "يشمل الإفطار", adjustment: 0 },
  { roomName: "Junior Suite", id: "junior-bb-flex", name: "Flexible rate", nameAr: "سعر مرن", mealPlan: "Breakfast included", mealPlanAr: "يشمل الإفطار", adjustment: 0 },
  { roomName: "Family Suite", id: "family-bb-flex", name: "Flexible rate", nameAr: "سعر مرن", mealPlan: "Breakfast included", mealPlanAr: "يشمل الإفطار", adjustment: 0 },
];

export const calendarBaseRates: Record<string, number> = {
  Double: 420,
  Triple: 560,
  Quad: 690,
  "Junior Suite": 880,
  "Family Suite": 1150,
};

export const addCalendarDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const calendarIso = (date: Date) => date.toISOString().slice(0, 10);
export const rateCellKey = (contractId: string, offerId: string, iso: string) => `${contractId}|${offerId}|${iso}`;

export const fixedCalendarStart = new Date("2026-09-18T00:00:00Z");