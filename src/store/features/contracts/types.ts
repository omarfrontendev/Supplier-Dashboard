export type ContractStatus = "draft" | "scheduled" | "active" | "paused" | "expired" | "terminated";

export type PricingModel = "base_supplements" | "fixed_price";

export type WeekPricing = "one_price" | "weekday_weekend";

export type BookingType = "allotment" | "on_request";

export type SlaExpiryAction = "auto_reject" | "escalate";

export type ContractCurrency = "SAR" | "USD" | "EUR";

export const CONTRACT_CURRENCIES: ContractCurrency[] = ["SAR", "USD", "EUR"];

export type Weekday = "sat" | "sun" | "mon" | "tue" | "wed" | "thu" | "fri";

export const WEEKDAYS: Weekday[] = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];

export type MealPlan = string;

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

export const CONTRACT_NAME_MAX = 200;

export const RESTRICTION_MAX_NIGHTS = 365;

export const WEEKDAY_NUMBER: Record<Weekday, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

export const SLA_MIN_MINUTES = 10;
export const SLA_MAX_MINUTES = 120;

export interface ContractBasics {
  hotelId: number | null;
  name: string;
  startDate: string;
  endDate: string;
  currency: string | null;
  weekendDays: Weekday[];
  bookingType: BookingType;
  slaMinutes: string;
  slaExpiryAction: SlaExpiryAction;
}

export interface BasePriceRoom {
  roomId: number;
  supplement: string;
  view: RoomView | null;
}

export interface BaseSupplements {
  baseRoomId: number | null;
  weekdayBaseCost: string;
  weekendBaseCost: string;
  rooms: BasePriceRoom[];
}

export type MealBasis = "per_room" | "per_person";

export interface FixedRoomMeal {
  plan: MealPlan;
  basis: MealBasis;
  price: string;
}

export interface FixedPriceRoom {
  roomId: number;
  view: RoomView;
  meals: FixedRoomMeal[];
  weekdayPrice: string;
  weekendPrice: string;
}

export interface MealRule {
  enabled: boolean;
  price: string;
  basis: MealBasis;
}

export type MealRules = Record<string, MealRule>;

export type CancellationCharge = "free" | "nights" | "percent" | "fixed";

export interface CancellationFee {
  charge: CancellationCharge | "";
  value: string;
}

export interface CancellationTier extends CancellationFee {
  days: string;
}

export interface CancellationPolicy {
  tiers: CancellationTier[];
  noShow: CancellationFee;
}

export const MAX_CANCELLATION_TIERS = 3;
export const CANCELLATION_MAX_DAYS = 365;
export const CANCELLATION_MAX_NIGHTS = 365;
export const CANCELLATION_MAX_AMOUNT = 10_000_000;

export type ReleasePeriod = "same_day" | "days";

export type AfterRelease = "stop_sale" | "on_request";

export interface ReleasePolicy {
  period: ReleasePeriod;
  days: string;
  time: string;
  afterRelease: AfterRelease;
}

export type RestrictionAppliesOn = "every_day" | "weekend_only";

export interface RestrictionRule {
  id: string;
  roomId: number | null;
  startDate: string;
  endDate: string;
  minNights: string;
  appliesOn: RestrictionAppliesOn;
  closedCheckIn: Weekday[];
  closedCheckOut: Weekday[];
  active: boolean;
}

export interface ContractRestrictions {
  enabled: boolean;
  rules: RestrictionRule[];
}

export interface ContractPolicies {
  enabled: boolean;
  cancellation: CancellationPolicy | null;
  release: ReleasePolicy | null;
}

export type ChildRuleKey = "sharing_parents" | "shared_bed" | "extra_bed";

export const CHILD_RULES: ChildRuleKey[] = ["sharing_parents", "shared_bed", "extra_bed"];

export const CHILD_MAX_AGE = 17;

export interface ChildRule {
  ageFrom: string;
  ageTo: string;
  price: string;
}

export type ChildRules = Record<ChildRuleKey, ChildRule>;

export const SEASON_NAME_MAX = 100;

export const SEASON_COLOURS = [
  "#4A3AA7",
  "#E87BA4",
  "#2A78D6",
  "#1AA3B8",
  "#8E5BD8",
  "#1F8A6E",
  "#9A6A3A",
  "#5B6B8C",
] as const;

export type SeasonChildPrices = Record<ChildRuleKey, string>;

export interface SeasonIssue {
  code: string;
  message: string;
}

export interface SeasonRule {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  color: string;
  childPrices: SeasonChildPrices;
  cancellation: CancellationPolicy | null;
  keptPricing: Record<string, unknown> | null;
  issues: SeasonIssue[];
}

export interface ContractDraftState {
  basics: ContractBasics;
  pricingModel: PricingModel;
  weekPricing: WeekPricing;
  baseSupplements: BaseSupplements;
  fixedRooms: FixedPriceRoom[];
  children: ChildRules;
  meals: MealRules;
  policies: ContractPolicies;
  restrictions: ContractRestrictions;
  seasons: SeasonRule[];
}
