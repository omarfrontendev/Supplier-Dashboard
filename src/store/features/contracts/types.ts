export type ContractStatus = "draft" | "scheduled" | "active" | "paused" | "expired" | "terminated";

export type PricingModel = "base_supplements" | "fixed_price";

export type WeekPricing = "one_price" | "weekday_weekend";

export type BookingType = "allotment" | "on_request";

export type SlaExpiryAction = "auto_reject" | "escalate";

export type ContractCurrency = "SAR" | "USD" | "EUR";

export type Weekday = "sat" | "sun" | "mon" | "tue" | "wed" | "thu" | "fri";

export const WEEKDAYS: Weekday[] = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];

export type MealPlan = "room_only" | "bed_breakfast" | "half_board" | "full_board" | "iftar_sohour";

export const MEAL_PLANS: MealPlan[] = [
  "room_only",
  "bed_breakfast",
  "half_board",
  "full_board",
  "iftar_sohour",
];

export type RoomView =
  | "sea"
  | "city"
  | "garden"
  | "pool"
  | "mountain"
  | "courtyard"
  | "street"
  | "landmark"
  | "haram"
  | "no_view";

export const ROOM_VIEWS: RoomView[] = [
  "sea",
  "city",
  "garden",
  "pool",
  "mountain",
  "courtyard",
  "street",
  "landmark",
  "haram",
  "no_view",
];

export const SLA_MIN_MINUTES = 10;
export const SLA_MAX_MINUTES = 120;

export interface ContractBasics {
  hotelId: number | null;
  name: string;
  startDate: string;
  endDate: string;
  currency: ContractCurrency | null;
  weekendDays: Weekday[];
  bookingType: BookingType;
  slaMinutes: string;
  slaExpiryAction: SlaExpiryAction;
}

export interface BasePriceRoom {
  roomId: number;
  supplement: string;
}

export interface BaseSupplements {
  baseRoomId: number | null;
  weekdayBaseCost: string;
  weekendBaseCost: string;
  rooms: BasePriceRoom[];
}

export interface FixedPriceRoom {
  roomId: number;
  mealPlan: MealPlan;
  view: RoomView;
  weekdayPrice: string;
  weekendPrice: string;
}

export interface ContractDraftState {
  basics: ContractBasics;
  pricingModel: PricingModel;
  weekPricing: WeekPricing;
  baseSupplements: BaseSupplements;
  fixedRooms: FixedPriceRoom[];
}
