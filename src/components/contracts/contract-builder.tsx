import { useCallback, useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { useBlocker, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Check, ChevronRight, Lock, Plus, Save } from "lucide-react";
import { IconModal } from "@/components/layout/overlay";
import { PageShell } from "@/components/layout/page-shell";
import { useContractHotels } from "@/api/modules/hotel-contract/contrac-tHotels/useContractHotels";
import { useHotelContract } from "@/api/modules/hotel-contract/useHotelContract";
import { useHotelContractFinalizationReview } from "@/api/modules/hotel-contract/useHotelContractFinalizationReview";
import { useFinalizeHotelContract } from "@/api/modules/hotel-contract/useFinalizeHotelContract";
import { useHotelContractsMetadata } from "@/api/modules/hotel-contract/useHotelContractsMetadata";
import { useSaveHotelContract } from "@/api/modules/hotel-contract/useSaveHotelContract";
import { getApiErrorList, getApiErrorMessage } from "@/lib/api-error";
import { statusName } from "@/lib/contract-actions-data";
import type {
  FinalizationApiErrorResponse,
  FinalizationIssue,
  FinalizeHotelContractRequest,
  FinalizeHotelContractResult,
} from "@/api/modules/hotel-contract/finalization-types";
import {
  basicsReady,
  childPricingChanged,
  hasInactiveRestrictions,
  hasChildPricing,
  hasPricingInput,
  mergeLatestDraft,
  pricingChanged,
  pricingFromDraft,
  toRestrictions,
  contractDifferences,
  draftFromContract,
  hasRoomPricing,
  sameSavedDraft,
  toCreateContractBody,
  toUpdateContractBody,
  inventoryVariationKey,
  toInventoryRules,
  type InventoryVariation,
} from "@/store/features/contracts/contract-api";
import type { SupplierHotelContract } from "@/api/modules/hotel-contract/types";
import { UnsavedOverlay } from "@/components/contracts/create-overlays";
import { BasicsFields } from "@/components/contracts/contract-form/basics-fields";
import { BookingFields } from "@/components/contracts/contract-form/booking-fields";
import { ChildrenFields } from "@/components/contracts/contract-form/children-fields";
import { MealsFields } from "@/components/contracts/contract-form/meals-fields";
import { PoliciesSummary } from "@/components/contracts/contract-form/policies-summary";
import { RestrictionsFields } from "@/components/contracts/contract-form/restrictions-fields";
import { PricingFields } from "@/components/contracts/contract-form/pricing-fields";
import { RoomsFields } from "@/components/contracts/contract-form/rooms-fields";
import { AvailableHotelRooms } from "@/components/contracts/available-hotel-rooms";
import {
  useAppDispatch,
  useChildAgeLimit,
  useContractDraft,
} from "@/components/contracts/contract-form/shared";
import {
  cancellationIssues,
  childIssues,
  restrictionsIssues,
  seasonsIssues,
  releaseIssues,
  validateContract,
  type ContractSectionKey,
} from "@/components/contracts/contract-form/schema";
import { readableDay } from "@/components/ui/date-field";
import {
  loadContract,
  removeSeason,
  saveSeason,
  resetDraft,
  saveCancellationPolicy,
  saveReleasePolicy,
  setPoliciesEnabled,
  updateBasics,
  updateInventory,
  setInventoryRoomCap,
  setPerRoomInventory,
} from "@/store/features/contracts/contract-draft.slice";
import { ActivateDrawer } from "@/components/contracts/lifecycle-overlays";
import { CancellationDrawer, ReleaseDrawer } from "@/components/contracts/policy-overlays";
import { SeasonEditor, seasonNights as nightsIn } from "@/components/contracts/season-editor";
import { SeasonLegend, SeasonTimeline } from "@/components/contracts/season-timeline";
import { policyLines } from "@/components/contracts/contract-form/policies-summary";
import { seasonPage } from "@/lib/season-page-data";
import { effectivePrice, toAmount } from "@/store/features/contracts/contract-payload";
import {
  WEEKDAY_NUMBER,
  type ChildRuleKey,
  type SeasonRule,
} from "@/store/features/contracts/types";
import { ChoiceRow, Section, Table } from "@/components/contracts/contract-parts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { fill, useLanguage } from "@/lib/i18n";
import { notify } from "@/lib/notify";
import { usePortal } from "@/lib/portal-store";
import { MONTHS } from "@/lib/contract-data";
import type { InventoryModel, RoomView, SoldOutAction } from "@/store/features/contracts/types";
import { contractRoomLabel } from "@/lib/contract-room-label";
import { formatAmount } from "@/components/contracts/contract-form/shared";

interface FinalizationSubmissionSnapshot {
  status: "unresolved" | "completed";
  contractId: number;
  body: FinalizeHotelContractRequest;
  idempotencyKey: string;
}

const FINALIZATION_SNAPSHOT_PREFIX = "hoteliana:contract-finalization:pending:v1:";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type StoredSnapshotResult =
  | { kind: "empty" }
  | { kind: "unresolved"; snapshot: FinalizationSubmissionSnapshot }
  | { kind: "completed" }
  | { kind: "invalid" }
  | { kind: "unavailable" };

function isFinalizationSubmissionSnapshot(value: unknown): value is FinalizationSubmissionSnapshot {
  if (typeof value !== "object" || value === null) return false;
  const snapshot = value as Record<string, unknown>;
  if (
    (snapshot["status"] !== "unresolved" && snapshot["status"] !== "completed") ||
    !Number.isSafeInteger(snapshot["contractId"]) ||
    (snapshot["contractId"] as number) <= 0 ||
    typeof snapshot["idempotencyKey"] !== "string" ||
    !UUID_PATTERN.test(snapshot["idempotencyKey"]) ||
    typeof snapshot["body"] !== "object" ||
    snapshot["body"] === null
  ) {
    return false;
  }
  const body = snapshot["body"] as Record<string, unknown>;
  return (
    Object.keys(body).sort().join(",") ===
      ["confirmationAccepted", "confirmationVersion", "expectedVersion"].sort().join(",") &&
    Number.isSafeInteger(body["expectedVersion"]) &&
    (body["expectedVersion"] as number) > 0 &&
    body["confirmationAccepted"] === true &&
    typeof body["confirmationVersion"] === "string" &&
    body["confirmationVersion"].length > 0
  );
}

function snapshotStorageKey(contractId: number) {
  return `${FINALIZATION_SNAPSHOT_PREFIX}${contractId}`;
}

function readStoredFinalizationSnapshot(): StoredSnapshotResult {
  if (typeof window === "undefined") return { kind: "unavailable" };
  try {
    const storage = window.sessionStorage;
    const keys: string[] = [];
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (key?.startsWith(FINALIZATION_SNAPSHOT_PREFIX)) keys.push(key);
    }
    if (keys.length === 0) return { kind: "empty" };

    const snapshots: FinalizationSubmissionSnapshot[] = [];
    let completed = false;
    for (const key of keys) {
      const raw = storage.getItem(key);
      if (raw === null) continue;
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return { kind: "invalid" };
      }
      if (
        !isFinalizationSubmissionSnapshot(parsed) ||
        key !== snapshotStorageKey(parsed.contractId)
      ) {
        return { kind: "invalid" };
      }
      if (parsed.status === "completed") {
        completed = true;
        storage.removeItem(key);
      } else {
        snapshots.push(parsed);
      }
    }
    if (snapshots.length > 1 || (completed && snapshots.length > 0)) {
      return { kind: "invalid" };
    }
    return snapshots[0]
      ? { kind: "unresolved", snapshot: snapshots[0] }
      : completed
        ? { kind: "completed" }
        : { kind: "empty" };
  } catch {
    return { kind: "unavailable" };
  }
}

function persistFinalizationSnapshot(snapshot: FinalizationSubmissionSnapshot) {
  if (typeof window === "undefined") return false;
  try {
    window.sessionStorage.setItem(
      snapshotStorageKey(snapshot.contractId),
      JSON.stringify(snapshot),
    );
    return true;
  } catch {
    return false;
  }
}

function completeFinalizationSnapshot(snapshot: FinalizationSubmissionSnapshot) {
  if (typeof window === "undefined") return false;
  try {
    const storage = window.sessionStorage;
    let markedCompleted = false;
    try {
      storage.setItem(
        snapshotStorageKey(snapshot.contractId),
        JSON.stringify({ ...snapshot, status: "completed" }),
      );
      markedCompleted = true;
    } catch {
      // The definitive response is still handled in memory if storage is unavailable.
    }
    try {
      storage.removeItem(snapshotStorageKey(snapshot.contractId));
      return true;
    } catch {
      return markedCompleted;
    }
  } catch {
    return false;
  }
}

type FinalizationError =
  | { kind: "network" }
  | {
      kind: "ambiguous" | "storage" | "invalidSnapshot" | "resolved";
      detail?: string;
    }
  | { kind: "validation"; issues: FinalizationIssue[]; version?: number; detail?: string }
  | { kind: "conflict" | "unavailable" | "permission" | "generic" | "crypto"; detail?: string };

/** Every section the builder shows, including the closing review. */
type BuilderSection = ContractSectionKey | "review";

/**
 * The one-page supply-contract builder — Figma UI 03.1 and its variants.
 * Ten sections down the page, a sticky rail on the left and a live summary
 * that fills in as the contract takes shape.
 */
export function ContractBuilder({
  mode = "create",
  contractId,
  sourceId,
}: {
  mode?: "create" | "edit";
  contractId?: string;
  sourceId?: string;
}) {
  const { c, lang } = useLanguage();
  const t = c.builder;
  const navigate = useNavigate();
  const { contracts } = usePortal();
  const source = contracts.find((x) => x.id === (contractId ?? sourceId));

  const dispatch = useAppDispatch();
  const draft = useContractDraft();
  const { basics } = draft;
  const sourceName = source?.name;
  const [reviewOpen, setReviewOpen] = useState(false);
  /** Sections whose bodies are shown; each opens and closes independently. */
  const [expandedSections, setExpandedSections] = useState<ReadonlySet<BuilderSection>>(
    () => new Set<BuilderSection>(["basics"]),
  );
  const [reviewId, setReviewId] = useState<number | null>(null);
  const createdDraftRef = useRef<SupplierHotelContract | null>(null);
  const savedId =
    mode === "edit" && contractId && /^\d+$/.test(contractId) ? Number(contractId) : null;
  const remote = useHotelContract(savedId);
  const saved = remote.data ?? null;
  const currentReviewId = savedId ?? saved?.id ?? reviewId;
  const reviewQuery = useHotelContractFinalizationReview(reviewOpen ? currentReviewId : null);
  const review = reviewQuery.isFetching || reviewQuery.isError ? undefined : reviewQuery.data;
  const reviewResponseKey =
    review && currentReviewId !== null
      ? JSON.stringify([
          currentReviewId,
          reviewQuery.dataUpdatedAt,
          review.version,
          review.confirmation.text,
          review.confirmation.version,
        ])
      : null;
  const [acceptedReviewKey, setAcceptedReviewKey] = useState<string | null>(null);
  const confirmationAccepted =
    review !== undefined && reviewResponseKey !== null && acceptedReviewKey === reviewResponseKey;
  const [submissionSnapshot, setSubmissionSnapshot] =
    useState<FinalizationSubmissionSnapshot | null>(null);
  const [snapshotStorageReady, setSnapshotStorageReady] = useState(false);
  const [snapshotStorageBlocked, setSnapshotStorageBlocked] = useState(false);
  const [finalizationError, setFinalizationError] = useState<FinalizationError | null>(null);
  const [finalizationSuccess, setFinalizationSuccess] =
    useState<FinalizeHotelContractResult | null>(null);
  const finalizeMutation = useFinalizeHotelContract();
  const finalizationInFlight = useRef(false);
  const saveContract = useSaveHotelContract();
  const savingDraft = saveContract.isPending;
  const childMaxAge = useChildAgeLimit(basics.hotelId);
  const loadedId = useRef<number | null>(null);
  useEffect(() => {
    if (savedId !== null) return;
    loadedId.current = null;
    dispatch(resetDraft(sourceName ? { name: sourceName } : undefined));
  }, [dispatch, sourceName, savedId]);
  useEffect(() => {
    if (!saved || loadedId.current === saved.id) return;
    loadedId.current = saved.id;
    dispatch(loadContract(draftFromContract(saved)));
  }, [dispatch, saved, draft]);
  const contractHotels = useContractHotels({ page: 1, limit: 100 });
  const contractMetadata = useHotelContractsMetadata();
  const [selectedRoomDetails, setSelectedRoomDetails] = useState<
    Record<number, { roomSizeId: number | null; view: string | null }>
  >({});
  const [selectedRoomDetailsLoading, setSelectedRoomDetailsLoading] = useState(true);
  const receiveSelectedRoomDetails = useCallback(
    (
      details: Record<number, { roomSizeId: number | null; view: string | null }>,
      loading: boolean,
    ) => {
      setSelectedRoomDetails(details);
      setSelectedRoomDetailsLoading(loading);
    },
    [],
  );
  const allowLeave = useRef(false);
  const snapshotRestoreAttempted = useRef(false);
  useEffect(() => {
    if (snapshotRestoreAttempted.current) return;
    snapshotRestoreAttempted.current = true;
    const stored = readStoredFinalizationSnapshot();
    setSnapshotStorageReady(true);

    if (stored.kind === "unresolved") {
      setSubmissionSnapshot(stored.snapshot);
      setFinalizationError({ kind: "network" });
      setReviewId(stored.snapshot.contractId);
      setReviewOpen(true);
      if (savedId !== stored.snapshot.contractId) {
        allowLeave.current = true;
        navigate({
          to: "/rate-contracts/$contractId/edit",
          params: { contractId: String(stored.snapshot.contractId) },
          replace: true,
        });
      }
      return;
    }

    if (stored.kind === "completed") {
      setFinalizationError({ kind: "resolved" });
    } else if (stored.kind === "invalid") {
      setSnapshotStorageBlocked(true);
      setFinalizationError({ kind: "invalidSnapshot" });
    } else if (stored.kind === "unavailable") {
      setSnapshotStorageBlocked(true);
      setFinalizationError({ kind: "storage" });
    }
  }, [navigate, savedId]);
  /* OV 03.2 — the drawer that shows every section before it goes live. */
  /* OV 03.16 / 03.17 — the two policy drawers. */
  const [policy, setPolicy] = useState<"cancellation" | "release" | null>(null);
  const [confirmNoPolicies, setConfirmNoPolicies] = useState(false);
  const [editingSeason, setEditingSeason] = useState<SeasonRule | "new" | null>(null);

  const onRequest = basics.bookingType === "on_request";
  const hasPolicies = draft.policies.enabled;
  const hasRestrictions = draft.restrictions.enabled;
  const fixed = draft.pricingModel === "fixed_price";
  const splitPricing = draft.weekPricing === "weekday_weekend";
  const { inventory } = draft;
  const f = t.form;
  const term =
    basics.startDate && basics.endDate
      ? `${readableDay(basics.startDate, lang)} – ${readableDay(basics.endDate, lang)}`
      : "";
  /** Sections 2-6 and 8-10 stay locked until the hotel and term are set. */
  const basicsDone = Boolean(basics.hotelId && term);
  const seasonsDone = basicsDone && hasRestrictions !== null && hasPolicies !== null;

  /*
   * UI 03.1 / 03.1O — the rail and every section head read from one list.
   * A fixed-price contract has no base and no supplements, so Meal plans
   * drop out and the rest renumber.
   */
  const sectionList = (
    fixed
      ? ([
          ["basics", t.sections[0]!],
          ["pricing", t.pricingFixedTitle],
          ["rooms", t.sections[2]!],
          ["children", t.sections[3]!],
          ["inventory", t.sections[5]!],
          ["seasons", t.sections[6]!],
          ["restrictions", t.sections[7]!],
          ["policies", t.sections[8]!],
          ["booking", f.bookingTitle],
          ["review", t.sections[9]!],
        ] as const)
      : ([
          ["basics", t.sections[0]!],
          ["pricing", t.sections[1]!],
          ["rooms", t.sections[2]!],
          ["children", t.sections[3]!],
          ["meals", t.sections[4]!],
          ["inventory", t.sections[5]!],
          ["seasons", t.sections[6]!],
          ["restrictions", t.sections[7]!],
          ["policies", t.sections[8]!],
          ["booking", f.bookingTitle],
          ["review", t.sections[9]!],
        ] as const)
  ).map(([key, title]) => ({ key, title }));
  const num = (key: string) => sectionList.findIndex((item) => item.key === key) + 1;
  const sectionLocked = (key: string) =>
    key === "basics" ? false : key === "seasons" ? !seasonsDone : !basicsDone;
  const sectionDone = (key: string) =>
    key === "basics"
      ? basicsDone && Boolean(basics.name.trim())
      : key === "review"
        ? seasonsDone
        : basicsDone;
  /* Each section opens and closes on its own; opening one never closes
     another. Every section past the basics can be opened once the hotel and
     term are set — seasons included, since its body is where the
     restriction and policy answers are asked for. */
  const canOpenSection = (key: BuilderSection) => key === "basics" || basicsDone;
  const isExpanded = (key: BuilderSection) => expandedSections.has(key) && canOpenSection(key);
  const setExpanded = (key: BuilderSection, expanded: boolean) =>
    setExpandedSections((open) => {
      if (open.has(key) === expanded) return open;
      const nextOpen = new Set(open);
      if (expanded) nextOpen.add(key);
      else nextOpen.delete(key);
      return nextOpen;
    });
  const openSection = (key: BuilderSection) => {
    setExpanded(key, true);
    // Wait for the section to render open before scrolling to it.
    requestAnimationFrame(() =>
      document
        .getElementById(`contract-section-${num(key)}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };
  /** The rail's reading of a section: open now, finished, or still to do. */
  const sectionStatus = (key: BuilderSection) =>
    isExpanded(key) ? "active" : !sectionLocked(key) && sectionDone(key) ? "completed" : "pending";
  const sectionFlow = (key: BuilderSection) => {
    const next = sectionList[sectionList.findIndex((item) => item.key === key) + 1];
    return {
      expanded: isExpanded(key),
      onToggle: canOpenSection(key) ? () => setExpanded(key, !isExpanded(key)) : undefined,
      onContinue: next ? () => openSection(next.key) : undefined,
      continueDisabled: next ? !canOpenSection(next.key) : undefined,
    };
  };

  /* UI 03.1F section 3 — the rooms are a checklist, so what is on sale
     is held here and section 2's base row follows it. */
  const contractRoomCount = fixed
    ? draft.fixedRooms.length
    : draft.baseSupplements.rooms.filter((room) => room.roomId !== draft.baseSupplements.baseRoomId)
        .length + (draft.baseSupplements.baseRoomId === null ? 0 : 1);
  const selectedDetailsById = selectedRoomDetails;
  const inventoryVariationMap = new Map<
    string,
    InventoryVariation & { plans: Set<string>; isBase: boolean }
  >();
  const addInventoryVariation = (roomId: number, view: string, plans: string[], isBase = false) => {
    const variation = { roomId, view };
    const key = inventoryVariationKey(variation);
    const existing = inventoryVariationMap.get(key);
    if (existing) {
      plans.forEach((plan) => existing.plans.add(plan));
      existing.isBase ||= isBase;
      return;
    }
    inventoryVariationMap.set(key, { ...variation, plans: new Set(plans), isBase });
  };
  const selectedBaseMealPlans = Object.entries(draft.meals)
    .filter(([, meal]) => meal.enabled)
    .map(([plan]) => plan);
  const baseRoomDetails =
    draft.baseSupplements.baseRoomId === null
      ? undefined
      : selectedDetailsById[draft.baseSupplements.baseRoomId];
  const savedBaseRoom = saved?.pricing?.baseRoom;
  const matchingSavedBaseRoom =
    savedBaseRoom?.roomId === draft.baseSupplements.baseRoomId ? savedBaseRoom : undefined;
  const pickedBaseRoomView = draft.baseSupplements.baseRoomView;
  const baseRoomDataAvailable = Boolean(
    pickedBaseRoomView || baseRoomDetails || matchingSavedBaseRoom,
  );
  const baseRoomView = pickedBaseRoomView ?? baseRoomDetails?.view ?? matchingSavedBaseRoom?.view;
  const basePricingRoomView = baseRoomDataAvailable ? (baseRoomView ?? "no_view") : undefined;
  if (draft.baseSupplements.baseRoomId !== null && baseRoomDataAvailable) {
    addInventoryVariation(
      draft.baseSupplements.baseRoomId,
      baseRoomView ?? "no_view",
      selectedBaseMealPlans,
      true,
    );
  }
  if (fixed) {
    draft.fixedRooms.forEach((room) =>
      addInventoryVariation(
        room.roomId,
        room.view,
        room.meals.map((meal) => meal.plan),
        room.roomId === draft.baseSupplements.baseRoomId &&
          room.view === (selectedDetailsById[room.roomId]?.view ?? "no_view"),
      ),
    );
  } else {
    draft.baseSupplements.rooms.forEach((room) => {
      const selectedRoom = selectedDetailsById[room.roomId];
      addInventoryVariation(
        room.roomId,
        room.view ?? selectedRoom?.view ?? "no_view",
        selectedBaseMealPlans,
        room.roomId === draft.baseSupplements.baseRoomId &&
          (room.view ?? selectedRoom?.view ?? "no_view") ===
            (selectedDetailsById[room.roomId]?.view ?? "no_view"),
      );
    });
  }
  const draftInventoryVariations = [...inventoryVariationMap.values()].map(
    ({ plans, ...variation }) => ({
      ...variation,
      plans: [...plans],
    }),
  );
  const savedInventoryVariationsRaw =
    mode === "edit" && !draft.roomVariationsEdited && draftInventoryVariations.length === 0
      ? saved?.inventoryRules?.mode === "shared_pool"
        ? (saved.inventoryRules.roomCaps ?? []).map((variation) => ({
            ...variation,
            plans: [],
            isBase:
              draft.baseSupplements.baseRoomId !== null &&
              baseRoomDataAvailable &&
              inventoryVariationKey(variation) ===
                inventoryVariationKey({
                  roomId: draft.baseSupplements.baseRoomId,
                  view: baseRoomView ?? "no_view",
                }),
          }))
        : saved?.inventoryRules?.mode === "per_room_type"
          ? (saved.inventoryRules.rooms ?? []).map((variation) => ({
              ...variation,
              plans: [],
              isBase:
                draft.baseSupplements.baseRoomId !== null &&
                baseRoomDataAvailable &&
                inventoryVariationKey(variation) ===
                  inventoryVariationKey({
                    roomId: draft.baseSupplements.baseRoomId,
                    view: baseRoomView ?? "no_view",
                  }),
            }))
          : []
      : [];
  const savedInventoryVariations = [
    ...new Map(
      savedInventoryVariationsRaw.map((variation) => [inventoryVariationKey(variation), variation]),
    ).values(),
  ];
  const inventoryVariations =
    draftInventoryVariations.length > 0 ? draftInventoryVariations : savedInventoryVariations;
  const baseInventoryVariation = inventoryVariations.find((variation) => variation.isBase);
  // const additionalInventoryVariations = inventoryVariations.filter(
  //   (variation) => !variation.isBase,
  // );
  const additionalInventoryVariations = inventoryVariations;
  const payloadInventoryVariations =
    inventory.model === "shared" ? additionalInventoryVariations : inventoryVariations;
  const inventoryRules = onRequest
    ? undefined
    : toInventoryRules(inventory, payloadInventoryVariations);
  const baseRoomViewMissing =
    !onRequest &&
    draft.baseSupplements.baseRoomId !== null &&
    !baseRoomDataAvailable &&
    !selectedRoomDetailsLoading;
  const inventoryQuantity =
    inventory.model === "shared"
      ? Number(inventory.roomsPerNight) || 0
      : inventoryVariations.reduce(
          (total, variation) =>
            total + (Number(inventory.rooms[inventoryVariationKey(variation)]?.roomsPerNight) || 0),
          0,
        );
  const seasons = draft.seasons;
  const seasonNights = seasons.reduce((sum, season) => sum + nightsIn(season), 0);
  const termNights =
    basics.startDate && basics.endDate
      ? nightsIn({ startDate: basics.startDate, endDate: basics.endDate })
      : 0;
  const timeline = seasons.map((season) => ({
    name: season.name,
    nameAr: season.name,
    from: season.startDate,
    to: season.endDate,
    colour: season.color,
  }));
  const seasonChanges = (season: SeasonRule) => {
    const changes = [
      ...((Object.keys(season.childPrices) as ChildRuleKey[]).some((key) => {
        const price = toAmount(season.childPrices[key]);
        return price !== null && price !== toAmount(draft.children[key].price);
      })
        ? [t.changesChildren]
        : []),
      ...(season.cancellation ? [t.changesPolicy] : []),
    ];
    return changes.length > 0 ? changes.join(" · ") : t.changesNone;
  };

  const hotel = contractHotels.data?.hotels.find((item) => item.id === basics.hotelId);
  const hotelName = hotel
    ? ((lang === "ar" ? hotel.nameAr || hotel.nameEn : hotel.nameEn || hotel.nameAr) ?? "")
    : basics.hotelId
      ? `#${basics.hotelId}`
      : "";

  const displayAmount = (amount: number | null | undefined) =>
    amount === null || amount === undefined
      ? t.summaryEmpty
      : formatAmount(amount, lang, basics.currency);
  const displayRate = (rate?: { amount?: number; weekday?: number; weekend?: number } | null) => {
    if (splitPricing) {
      const weekday = rate?.weekday ?? rate?.amount;
      const weekend = rate?.weekend ?? rate?.amount;
      return weekday === undefined || weekend === undefined
        ? null
        : `${displayAmount(weekday)} / ${displayAmount(weekend)}`;
    }
    const amount = rate?.amount ?? rate?.weekday ?? rate?.weekend;
    return amount === undefined ? null : displayAmount(amount);
  };
  const roomName = (roomId: number, view: string | null) => {
    const room = contractRoomLabel(
      { id: roomId, roomSizeId: selectedRoomDetails[roomId]?.roomSizeId ?? null },
      lang,
    );
    const viewLabel =
      view && view in f.views
        ? f.views[view as keyof typeof f.views]
        : view && view !== "no_view"
          ? view
          : "";
    return viewLabel ? `${room} · ${viewLabel}` : room;
  };
  const resolvedPrice = (roomId: number, view: string) =>
    review?.contract.resolvedRoomPrices.find((item) => item.roomId === roomId && item.view === view)
      ?.price;
  const formatConfiguredRate = (weekday: string, weekend: string) => {
    const weekdayAmount = toAmount(weekday);
    const weekendAmount = splitPricing ? toAmount(weekend) : weekdayAmount;
    return splitPricing
      ? `${displayAmount(weekdayAmount)} / ${displayAmount(weekendAmount)}`
      : displayAmount(weekdayAmount);
  };
  const formatMealPlan = (plan: string) => {
    const metadata = contractMetadata.data?.mealPlans.find((item) => item.value === plan);
    if (metadata)
      return lang === "ar"
        ? metadata.labelAr || metadata.labelEn
        : metadata.labelEn || metadata.labelAr;
    return plan in f.meals ? f.meals[plan as keyof typeof f.meals] : plan;
  };
  const reviewRows = (() => {
    const labels = t.sections;
    const context = review
      ? fill(t.reviewBusinessContext, {
          date: readableDay(review.businessDate, lang),
          timezone: review.timezone,
          status:
            review.targetStatus === "scheduled" ? t.reviewScheduledStatus : t.reviewActiveStatus,
        })
      : "";
    const weekendDays = basics.weekendDays
      .map((day) => f.days[day])
      .join(lang === "ar" ? "، " : ", ");
    const basicsValue = [
      basics.name.trim(),
      hotelName,
      term,
      basics.bookingType === "on_request" ? t.typeRequest : t.typeBlock,
      basics.currency ?? "",
      weekendDays,
      context,
    ]
      .filter(Boolean)
      .join(" · ");

    const baseRoomId = draft.baseSupplements.baseRoomId;
    const baseRoomView =
      baseRoomId === null
        ? "no_view"
        : (draft.baseSupplements.baseRoomView ??
          selectedRoomDetails[baseRoomId]?.view ??
          saved?.pricing?.baseRoom?.view ??
          "no_view");
    const baseRate = review?.contract.pricing?.baseRoom?.rate ?? undefined;
    const baseRoomValue = fixed
      ? t.modelFixed
      : [
          t.modelSupplements,
          baseRoomId === null ? "" : roomName(baseRoomId, baseRoomView),
          displayRate(baseRate) ??
            formatConfiguredRate(
              draft.baseSupplements.weekdayBaseCost,
              draft.baseSupplements.weekendBaseCost,
            ),
          splitPricing ? t.weekSplit : t.weekOne,
        ]
          .filter(Boolean)
          .join(" · ");

    const roomValues = fixed
      ? draft.fixedRooms.map((room) => {
          const canonical = displayRate(
            resolvedPrice(room.roomId, room.view) ??
              review?.contract.pricing?.rooms.find(
                (item) => item.roomId === room.roomId && item.view === room.view,
              )?.rate,
          );
          return `${roomName(room.roomId, room.view)} · ${
            canonical ?? formatConfiguredRate(room.weekdayPrice, room.weekendPrice)
          }`;
        })
      : [
          ...(baseRoomId === null
            ? []
            : [
                `${roomName(baseRoomId, baseRoomView)} · ${
                  displayRate(resolvedPrice(baseRoomId, baseRoomView)) ??
                  formatConfiguredRate(
                    draft.baseSupplements.weekdayBaseCost,
                    draft.baseSupplements.weekendBaseCost,
                  )
                }`,
              ]),
          ...draft.baseSupplements.rooms
            .filter(
              (room) => room.roomId !== baseRoomId || (room.view ?? "no_view") !== baseRoomView,
            )
            .map((room) => {
              const view = room.view ?? selectedRoomDetails[room.roomId]?.view ?? "no_view";
              const baseWeekday = toAmount(draft.baseSupplements.weekdayBaseCost);
              const baseWeekend = toAmount(draft.baseSupplements.weekendBaseCost);
              const formWeekday = effectivePrice(
                draft.baseSupplements.weekdayBaseCost,
                room.supplement,
              );
              const formWeekend = effectivePrice(
                draft.baseSupplements.weekendBaseCost,
                room.supplement,
              );
              const canonical =
                displayRate(resolvedPrice(room.roomId, view)) ??
                displayRate(
                  review?.contract.pricing?.rooms.find(
                    (item) => item.roomId === room.roomId && item.view === view,
                  )?.rate,
                );
              return `${roomName(room.roomId, view)} · ${
                canonical ??
                (splitPricing
                  ? `${displayAmount(formWeekday)} / ${displayAmount(formWeekend)}`
                  : displayAmount(formWeekday))
              }`;
            }),
        ];

    const childValues = (Object.keys(draft.children) as ChildRuleKey[]).map((key) => {
      const child = draft.children[key];
      return `${f.children.rules[key]} · ${fill(f.children.ageRange, {
        from: child.ageFrom,
        to: child.ageTo,
      })} · ${displayAmount(toAmount(child.price))}`;
    });
    const mealValues = fixed
      ? [
          ...new Map(
            draft.fixedRooms.flatMap((room) =>
              room.meals.map((meal) => {
                const canonical = review?.contract.pricing?.rooms
                  .find((item) => item.roomId === room.roomId && item.view === room.view)
                  ?.mealPlans.find((item) => item.type === meal.plan);
                return [
                  meal.plan,
                  `${formatMealPlan(meal.plan)} · ${displayAmount(
                    canonical?.price ?? toAmount(meal.price),
                  )}`,
                ];
              }),
            ),
          ).values(),
        ]
      : Object.entries(draft.meals)
          .filter(([, meal]) => meal.enabled)
          .map(([plan, meal]) => {
            const canonical = review?.contract.pricing?.mealPlans.find(
              (item) => item.type === plan,
            );
            return `${formatMealPlan(plan)} · ${displayAmount(
              canonical?.price ?? toAmount(meal.price),
            )} · ${meal.basis === "per_person" ? f.mealsTable.perPerson : f.mealsTable.perRoom}`;
          });
    const childSummary = childValues.length > 0 ? childValues.join(" · ") : f.policies.notSet;
    const mealSummary = mealValues.length > 0 ? mealValues.join(" · ") : f.policies.notSet;

    const preview = review?.inventoryPreview;
    // The review API returns `inventoryPreview.rules: null` (and `mode: null`) while the
    // contract's inventory is not configured. Nothing is assumed in that case: the summary
    // says "not configured" and the backend's inventory_required issue blocks finalization.
    const previewRules = preview?.rules ?? null;
    const soldOutLabel = (action: string | null | undefined) =>
      action === "stop_sale"
        ? t.soldOutStop
        : action === "on_request"
          ? t.soldOutRequest
          : action === "controlled_overbooking"
            ? t.soldOutOver
            : t.reviewSoldOutNotSet;
    const previewModeLabel = (mode: string | null | undefined) =>
      mode === "shared_pool"
        ? t.invShared
        : mode === "per_room_type"
          ? t.invPerRoom
          : mode === "free_sale"
            ? t.invFree
            : (mode ?? t.reviewInventoryNotConfigured);
    const inventorySummary = preview
      ? previewRules === null
        ? t.reviewInventoryNotConfigured
        : [
            fill(t.reviewInventoryMetrics, {
              nights: preview.nights,
              mode: previewModeLabel(preview.mode ?? previewRules.mode),
              pools: preview.poolCount,
              poolNights: preview.poolNights,
              capNights: preview.capNights,
              records: preview.estimatedRecords,
            }),
            ...(() => {
              const rules = previewRules;
              if (rules.mode === "free_sale") return [];
              if (rules.mode === "shared_pool") {
                const whenSoldOut = rules.whenSoldOut ?? null;
                const overbookingLimit = whenSoldOut?.overbookingLimitPerNight;
                return [
                  ...(rules.roomsPerNight == null
                    ? []
                    : [fill(t.invNightsValue, { count: rules.roomsPerNight })]),
                  soldOutLabel(whenSoldOut?.action),
                  ...(overbookingLimit == null
                    ? []
                    : [fill(t.reviewOverbooking, { count: overbookingLimit })]),
                  ...(rules.roomCaps ?? []).map((cap) =>
                    fill(t.reviewCap, {
                      room: roomName(cap.roomId, cap.view),
                      count: cap.maxRoomsPerNight,
                    }),
                  ),
                ];
              }
              if (rules.mode === "per_room_type") {
                return [
                  soldOutLabel(rules.whenSoldOut?.action),
                  ...(rules.rooms ?? []).map((room) =>
                    [
                      fill(t.reviewRoomStock, {
                        room: roomName(room.roomId, room.view),
                        count: room.roomsPerNight,
                      }),
                      ...(room.overbookingLimitPerNight == null
                        ? []
                        : [
                            fill(t.reviewOverbooking, {
                              count: room.overbookingLimitPerNight,
                            }),
                          ]),
                    ].join(" · "),
                  ),
                ];
              }
              return [];
            })(),
          ].join(" · ")
      : [
          inventory.model === "shared"
            ? t.invShared
            : inventory.model === "perRoom"
              ? t.invPerRoom
              : t.invFree,
          ...(inventory.model === "shared"
            ? [fill(t.invNightsValue, { count: Number(inventory.roomsPerNight) || 0 })]
            : []),
        ].join(" · ");

    const seasonValues = seasons.map(
      (season) =>
        `${season.name} · ${readableDay(season.startDate, lang)} – ${readableDay(
          season.endDate,
          lang,
        )}`,
    );
    const restrictionValues = draft.restrictions.enabled
      ? draft.restrictions.rules.map(
          (rule) =>
            `${rule.roomId === null ? t.reviewAllRooms : roomName(rule.roomId, null)} · ${readableDay(
              rule.startDate,
              lang,
            )} – ${readableDay(rule.endDate, lang)} · ${fill(f.restrictions.minNights, {
              count: Number(rule.minNights),
            })} · ${rule.active ? t.active : t.inactive}`,
        )
      : [];
    const p = f.policies;
    const policyValues = [
      ...(draft.policies.enabled && draft.policies.cancellation
        ? policyLines(draft.policies.cancellation, p, lang, basics.currency)
        : []),
      ...(draft.policies.enabled && draft.policies.release
        ? [
            draft.policies.release.period === "same_day"
              ? fill(p.releaseSameDay, { time: draft.policies.release.time })
              : fill(p.releaseDays, {
                  days: draft.policies.release.days,
                  time: draft.policies.release.time,
                }),
          ]
        : []),
      ...(onRequest || draft.policies.release?.afterRelease === "on_request"
        ? [`${f.slaMinutes}: ${basics.slaMinutes}`]
        : []),
      ...(review?.contract.bookingCutoff
        ? [
            fill(t.reviewCutoff, {
              days: review.contract.bookingCutoff.daysBeforeCheckIn,
              time: review.contract.bookingCutoff.cutoffTime,
            }),
          ]
        : []),
    ];

    return [
      { label: labels[0]!, value: basicsValue },
      { label: labels[1]!, value: baseRoomValue },
      { label: labels[2]!, value: roomValues.join(" · ") || f.policies.notSet },
      { label: labels[3]!, value: childSummary },
      { label: labels[4]!, value: mealSummary },
      { label: labels[5]!, value: inventorySummary },
      { label: labels[6]!, value: seasonValues.join(" · ") || f.policies.notSet },
      {
        label: labels[7]!,
        value: restrictionValues.join(" · ") || f.policies.notSet,
      },
      { label: labels[8]!, value: policyValues.join(" · ") || f.policies.notSet },
    ];
  })();

  async function sendFinalization(snapshot: FinalizationSubmissionSnapshot) {
    if (finalizationInFlight.current) return;
    finalizationInFlight.current = true;
    setFinalizationError(null);
    try {
      const result = await finalizeMutation.mutateAsync({
        id: snapshot.contractId,
        body: snapshot.body,
        idempotencyKey: snapshot.idempotencyKey,
      });
      const cleanupSucceeded = completeFinalizationSnapshot(snapshot);
      setSubmissionSnapshot(null);
      setSnapshotStorageBlocked(!cleanupSucceeded);
      setAcceptedReviewKey(null);
      setFinalizationSuccess(result);
      if (!cleanupSucceeded) {
        setFinalizationError({ kind: "storage" });
        return;
      }
      setReviewOpen(false);
      notify.success(c.builder.finalizationSuccess);
      allowLeave.current = true;
      navigate({ to: "/rate-contracts", replace: true });
    } catch (error) {
      if (isAxiosError<FinalizationApiErrorResponse>(error)) {
        const response = error.response;
        if (!response) {
          setFinalizationError({ kind: "network" });
          return;
        }

        const detail = response.data?.message;
        const cleanupSucceeded = completeFinalizationSnapshot(snapshot);
        setSubmissionSnapshot(null);
        setSnapshotStorageBlocked(!cleanupSucceeded);
        if (response.status === 422) {
          setAcceptedReviewKey(null);
          setFinalizationError({
            kind: "validation",
            issues: response.data?.data?.issues ?? [],
            ...(response.data?.data?.version === undefined
              ? {}
              : { version: response.data.data.version }),
            ...(detail ? { detail } : {}),
          });
          await reviewQuery.refetch();
          return;
        }
        if (response.status === 409) {
          setAcceptedReviewKey(null);
          setFinalizationError({ kind: "conflict", ...(detail ? { detail } : {}) });
          await reviewQuery.refetch();
          return;
        }
        if (response.status === 503) {
          setFinalizationError({ kind: "unavailable", ...(detail ? { detail } : {}) });
          return;
        }
        if (response.status === 403) {
          setFinalizationError({ kind: "permission", ...(detail ? { detail } : {}) });
          return;
        }
        setFinalizationError({ kind: "generic", ...(detail ? { detail } : {}) });
        return;
      }

      setFinalizationError({
        kind: "ambiguous",
        ...(error instanceof Error ? { detail: error.message } : {}),
      });
    } finally {
      finalizationInFlight.current = false;
    }
  }

  function submitFinalization() {
    if (
      !review ||
      reviewResponseKey === null ||
      !confirmationAccepted ||
      !snapshotStorageReady ||
      snapshotStorageBlocked ||
      review.canFinalize !== true ||
      review.issues.some((issue) => issue.severity === "error") ||
      finalizeMutation.isPending ||
      finalizationInFlight.current ||
      finalizationSuccess ||
      submissionSnapshot
    ) {
      return;
    }
    const stored = readStoredFinalizationSnapshot();
    if (stored.kind === "unresolved") {
      setSubmissionSnapshot(stored.snapshot);
      setFinalizationError({ kind: "network" });
      setReviewId(stored.snapshot.contractId);
      setReviewOpen(true);
      return;
    }
    if (stored.kind === "invalid" || stored.kind === "unavailable") {
      setSnapshotStorageBlocked(true);
      setFinalizationError({
        kind: stored.kind === "invalid" ? "invalidSnapshot" : "storage",
      });
      return;
    }
    if (stored.kind === "completed") {
      setFinalizationError({ kind: "resolved" });
      return;
    }
    if (typeof crypto === "undefined" || typeof crypto.randomUUID !== "function") {
      setFinalizationError({ kind: "crypto" });
      return;
    }

    let idempotencyKey: string;
    try {
      idempotencyKey = crypto.randomUUID();
    } catch {
      setFinalizationError({ kind: "crypto" });
      return;
    }

    const snapshot: FinalizationSubmissionSnapshot = {
      status: "unresolved",
      contractId: review.contractId,
      body: {
        expectedVersion: review.version,
        confirmationAccepted: true,
        confirmationVersion: review.confirmation.version,
      },
      idempotencyKey,
    };
    if (!persistFinalizationSnapshot(snapshot)) {
      setSnapshotStorageBlocked(true);
      setFinalizationError({ kind: "storage" });
      return;
    }
    setSubmissionSnapshot(snapshot);
    setFinalizationError(null);
    setFinalizationSuccess(null);
    void sendFinalization(snapshot);
  }

  function retryFinalization() {
    if (
      (finalizationError?.kind === "network" || finalizationError?.kind === "ambiguous") &&
      submissionSnapshot?.status === "unresolved" &&
      !snapshotStorageBlocked
    ) {
      void sendFinalization(submissionSnapshot);
    }
  }

  async function openReview() {
    if (submissionSnapshot) {
      if (currentReviewId !== submissionSnapshot.contractId) {
        setFinalizationError({ kind: "network" });
        return;
      }
      setReviewOpen(true);
      return;
    }
    const issues = validateContract(draft, f.v, childMaxAge);
    if (
      !onRequest &&
      (baseRoomViewMissing || !toInventoryRules(inventory, payloadInventoryVariations, true))
    ) {
      issues.push({ section: "inventory", message: f.v.inventory });
    }
    if (issues.length > 0) {
      notify.error(fill(f.reviewBlocked, { count: issues.length, first: issues[0]!.message }));
      jumpTo(issues[0]!.section);
      return;
    }
    if (mode === "edit" && (savedId === null || remote.isLoading || remote.isError || !saved)) {
      notify.error(f.loadFailed);
      return;
    }
    if (!(await saveDraft(false, setReviewId))) return;
    setAcceptedReviewKey(null);
    setFinalizationSuccess(null);
    if (!submissionSnapshot) setFinalizationError(null);
    setReviewOpen(true);
  }

  function closeReview() {
    if (finalizationInFlight.current) return;
    setReviewOpen(false);
    setAcceptedReviewKey(null);
    if (mode === "create" && reviewId !== null) {
      allowLeave.current = true;
      navigate({
        to: "/rate-contracts/$contractId/edit",
        params: { contractId: String(reviewId) },
        replace: true,
      });
    }
  }
  function openPendingContract() {
    if (!submissionSnapshot) return;
    setReviewId(submissionSnapshot.contractId);
    setReviewOpen(true);
    if (savedId === submissionSnapshot.contractId) return;
    allowLeave.current = true;
    navigate({
      to: "/rate-contracts/$contractId/edit",
      params: { contractId: String(submissionSnapshot.contractId) },
      replace: true,
    });
  }
  function jumpTo(section: ContractSectionKey) {
    openSection(section);
  }

  async function saveDraft(
    leaving = false,
    onSavedForReview?: (id: number) => void,
  ): Promise<boolean> {

    if (!basicsReady(draft)) {
      notify.error(f.saveNeedsBasics);
      jumpTo("basics");
      return false;
    }

    if (!onRequest && !inventoryRules) {
      notify.error(f.v.inventory);
      jumpTo("inventory");
      return false;
    }

    if (hasChildPricing(draft)) {
      const childErrors = childIssues(draft.children, f.v, childMaxAge);
      if (childErrors.length > 0) {
        notify.error(childErrors[0]!);
        jumpTo("children");
        return false;
      }
    } else if (saved?.childPricing && childPricingChanged(draft, saved)) {
      notify.error(f.childPricingClearUnsupported);
      jumpTo("children");
      return false;
    }

    const restrictionErrors = draft.restrictions.enabled
      ? restrictionsIssues(
          draft.restrictions.rules,
          basics,
          f.v,
          (rule) => `${readableDay(rule.startDate, lang)} – ${readableDay(rule.endDate, lang)}`,
          (day) => readableDay(day, lang),
        )
      : [];
    if (restrictionErrors.length > 0) {
      notify.error(restrictionErrors[0]!);
      jumpTo("restrictions");
      return false;
    }

    const seasonErrors = seasonsIssues(draft.seasons, basics, f.v, (day) => readableDay(day, lang));
    if (seasonErrors.length > 0) {
      notify.error(seasonErrors[0]!);
      jumpTo("seasons");
      return false;
    }

    const cancellationErrors =
      draft.policies.enabled && draft.policies.cancellation
        ? cancellationIssues(draft.policies.cancellation, f.v)
        : [];
    if (cancellationErrors.length > 0) {
      notify.error(cancellationErrors[0]!);
      jumpTo("policies");
      return false;
    }
    if (draft.policies.enabled && draft.policies.release) {
      const errors = releaseIssues(draft.policies.release, f.v);
      if (errors.length > 0) {
        notify.error(errors[0]!);
        jumpTo("policies");
        return false;
      }
    }

    const pricingNeedsWrite = saved ? pricingChanged(draft, saved) : hasPricingInput(draft);
    if (pricingNeedsWrite && saved?.pricing && !hasPricingInput(draft)) {
      notify.error(f.pricingClearUnsupported);
      jumpTo("pricing");
      return false;
    }
    if (pricingNeedsWrite && saved?.pricingStatus === "incomplete") {
      notify.error(f.pricingIncomplete);
      jumpTo("pricing");
      return false;
    }
    if (pricingNeedsWrite && !hasPricingInput(draft) && saved) {
      notify.error(draft.pricingModel === "fixed_price" ? f.v.fixedRooms : f.v.baseRoom);
      jumpTo("pricing");
      return false;
    }
    if (
      pricingNeedsWrite &&
      hasPricingInput(draft) &&
      !pricingFromDraft(draft, basePricingRoomView)
    ) {
      const issue = validateContract(draft, f.v, childMaxAge).find((item) =>
        ["pricing", "rooms", "meals"].includes(item.section),
      );
      const fallback =
        draft.pricingModel === "fixed_price"
          ? f.v.fixedPrice
          : baseRoomDataAvailable
            ? f.v.baseRoom
            : t.invRoomDetailsError;
      notify.error(issue?.message ?? fallback);
      jumpTo(issue?.section ?? "pricing");
      return false;
    }

    if (
      basics.bookingType === "on_request" &&
      (basics.slaMinutes.trim() || basics.slaExpiryAction !== "auto_reject")
    ) {
      const issue = validateContract(draft, f.v, childMaxAge).find(
        (item) => item.section === "booking",
      );
      if (issue) {
        notify.error(issue.message);
        jumpTo("booking");
        return false;
      }
    }

    let contract: SupplierHotelContract | null = saved ?? createdDraftRef.current;
    let createdId: number | null = null;
    try {
      if (!contract) {
        contract = await saveContract.mutateAsync({
          id: null,
          body: toCreateContractBody(draft, inventoryRules, basePricingRoomView),
        });
        createdId = contract.id;
        createdDraftRef.current = contract;
        setReviewId(contract.id);
        if (hasInactiveRestrictions(draft)) {
          contract = await saveContract.mutateAsync({
            id: contract.id,
            body: { expectedVersion: contract.version, restrictions: toRestrictions(draft) },
          });
          createdDraftRef.current = contract;
        }
      } else {
        const body = toUpdateContractBody(draft, contract, inventoryRules, basePricingRoomView);
        if (body) {
          contract = await saveContract.mutateAsync({ id: contract.id, body });
          if (mode === "create") createdDraftRef.current = contract;
        }
      }
      if (contract) onSavedForReview?.(contract.id);
      if (contract === saved) {
        if (saved && !sameSavedDraft(draft, saved, inventoryRules, basePricingRoomView)) {
          notify.error(f.saveNeedsBasics);
          return false;
        }
        notify.success(f.noChanges);
        return true;
      }
      notify.success(createdId ? f.draftCreated : f.draftUpdated);
      return true;
    } catch (error) {
      onSaveError(error instanceof Error ? error : new Error(String(error)), contract);
      return false;
    } finally {
      if (createdId !== null && !leaving && !onSavedForReview) {
        loadedId.current = createdId;
        allowLeave.current = true;
        navigate({
          to: "/rate-contracts/$contractId/edit",
          params: { contractId: String(createdId) },
          replace: true,
        });
      }
    }
  }

  function onSaveError(error: Error, base: SupplierHotelContract | null = saved) {
    const status = isAxiosError(error) ? error.response?.status : undefined;
    if (status === 409 && base) {
      const before = base;
      const editing = draft;
      void remote.refetch().then(({ data: latest }) => {
        if (latest && latest.status !== "draft") {
          notify.error(
            fill(f.saveNotDraft, { status: statusName(latest.status, lang === "ar" ? "ar" : "en") }),
          );
          return;
        }
        const fields = latest ? contractDifferences(before, latest) : [];
        if (latest) {
          dispatch(loadContract(mergeLatestDraft(editing, before, latest)));
        }
        notify.error(
          fields.length > 0
            ? fill(f.saveStale, {
                fields: fields
                  .map((field) => f.changedFields[field])
                  .join(lang === "ar" ? "، " : ", "),
              })
            : f.saveStaleNone,
        );
      });
      return;
    }
    if (status === 404 && base) {
      notify.error(f.unavailable);
      return;
    }
    notify.error(
      fill(f.saveFailedList, {
        errors: getApiErrorList(error).join(lang === "ar" ? "، " : " · "),
      }),
    );
  }

  const savedAt = saved
    ? new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(saved.updatedAt))
    : "";
  const notEditable = saved !== null && saved.status !== "draft";
  const savedStatusName = saved ? statusName(saved.status, lang === "ar" ? "ar" : "en") : "";
  const draftStatus = remote.isLoading
    ? t.draftLoading
    : remote.isError
      ? f.loadFailed
      : !saved
        ? t.draftEmpty
        : notEditable
          ? savedStatusName
          : sameSavedDraft(draft, saved, inventoryRules, basePricingRoomView)
            ? fill(t.draftSaved, { time: savedAt })
            : t.draftUnsaved;

  const hasUnsaved =
    !remote.isLoading &&
    !notEditable &&
    (saved
      ? !sameSavedDraft(draft, saved, inventoryRules, basePricingRoomView)
      : Boolean(basics.hotelId || basics.name.trim() || basics.startDate || basics.currency));
  const leaveBlocker = useBlocker({
    shouldBlockFn: ({ current, next }) =>
      current.pathname !== next.pathname && !allowLeave.current && hasUnsaved,
    enableBeforeUnload: () => !allowLeave.current && hasUnsaved,
    withResolver: true,
  });

  async function saveAndLeave() {
    if (await saveDraft(true)) {
      allowLeave.current = true;
      leaveBlocker.proceed?.();
    } else {
      leaveBlocker.reset?.();
    }
  }

  const finalizationMessages: Record<FinalizationError["kind"], string> = {
    network: t.finalizationNetworkFailure,
    ambiguous: t.finalizationOutcomeUnknown,
    storage: t.finalizationStorageError,
    invalidSnapshot: t.finalizationInvalidSnapshot,
    resolved: t.finalizationResolvedAfterRefresh,
    validation: t.finalizationValidationFailure,
    conflict: t.finalizationConflict,
    unavailable: t.finalizationUnavailable,
    permission: t.finalizationPermission,
    generic: t.finalizationGenericFailure,
    crypto: t.finalizationCryptoUnavailable,
  };
  const finalizationErrorForDrawer = finalizationError
    ? {
        message: finalizationMessages[finalizationError.kind],
        ...("detail" in finalizationError && finalizationError.detail
          ? { detail: finalizationError.detail }
          : {}),
        ...("issues" in finalizationError ? { issues: finalizationError.issues } : {}),
        ...("version" in finalizationError && finalizationError.version !== undefined
          ? { version: finalizationError.version }
          : {}),
        retryable:
          (finalizationError.kind === "network" || finalizationError.kind === "ambiguous") &&
          submissionSnapshot?.status === "unresolved" &&
          submissionSnapshot.contractId === currentReviewId &&
          !snapshotStorageBlocked,
      }
    : null;
  const pendingOutcomeUnknown = Boolean(
    submissionSnapshot &&
    (finalizationError?.kind === "network" || finalizationError?.kind === "ambiguous"),
  );
  const submissionBlockedMessage = (() => {
    if (!snapshotStorageReady) return t.finalizationStorageError;
    if (snapshotStorageBlocked) {
      return finalizationError?.kind === "invalidSnapshot"
        ? t.finalizationInvalidSnapshot
        : t.finalizationStorageError;
    }
    if (submissionSnapshot) {
      return submissionSnapshot.contractId === currentReviewId
        ? t.finalizationOutcomeUnknown
        : t.finalizationOtherContractPending;
    }
    return finalizationError?.kind === "crypto" ? t.finalizationCryptoUnavailable : null;
  })();
  const finalizationSubmissionBlocked = Boolean(
    !snapshotStorageReady ||
    snapshotStorageBlocked ||
    submissionSnapshot ||
    finalizationError?.kind === "crypto",
  );

  if (mode === "edit" && isAxiosError(remote.error) && remote.error.response?.status === 404) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
          <h1 className="text-xl font-semibold text-text-primary">{t.notFoundTitle}</h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
            {t.notFoundBody}
          </p>
          <Button className="mt-5" onClick={() => navigate({ to: "/rate-contracts" })}>
            {t.back}
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {pendingOutcomeUnknown && !reviewOpen && (
        <div
          role="alert"
          className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-status-warning/25 bg-status-warning-bg p-4"
        >
          <p className="text-sm text-text-primary">{t.finalizationOutcomeUnknown}</p>
          {submissionSnapshot?.contractId === currentReviewId ? (
            <Button variant="outline" size="sm" onClick={retryFinalization}>
              {t.finalizationRetry}
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={openPendingContract}>
              {t.finalizationOpenPendingContract}
            </Button>
          )}
        </div>
      )}
      {snapshotStorageBlocked && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-status-danger/25 bg-status-danger-bg p-4 text-sm text-status-danger"
        >
          {submissionBlockedMessage}
        </div>
      )}
      <button
        type="button"
        onClick={() => navigate({ to: "/rate-contracts" })}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ChevronRight className="h-4 w-4 rotate-180 rtl:rotate-0" aria-hidden="true" />
        {t.back}
      </button>

      <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-overline text-brand-mid">
            {mode === "edit" ? t.overlineEdit : t.overline}
          </p>
          <h1 className="mt-1 text-[28px] font-semibold text-text-primary">
            {saved ? basics.name.trim() || t.titleEdit : mode === "edit" ? t.titleEdit : t.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary">{t.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-text-muted">{draftStatus}</span>
          {!notEditable && (
            <>
              <Button
                variant="outline"
                loading={savingDraft}
                disabled={remote.isLoading || remote.isError}
                onClick={() => void saveDraft()}
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                {t.saveDraft}
              </Button>
              <Button loading={savingDraft} onClick={openReview}>
                {t.reviewActivate}
              </Button>
            </>
          )}
        </div>
      </header>

      {notEditable && (
        <div
          role="status"
          className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-status-warning/25 bg-status-warning-bg p-4"
        >
          <div className="flex min-w-0 flex-1 gap-3">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-status-warning" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary">
                {fill(t.notDraftTitle, { status: savedStatusName })}
              </p>
              <p className="mt-0.5 text-sm text-text-secondary">{t.notDraftBody}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate({ to: "/rate-calendar" })}>
            {t.notDraftAction}
          </Button>
        </div>
      )}

      <div className="grid min-w-0 gap-6 xl:grid-cols-[264px_minmax(0,1fr)]">
        <aside className="h-fit space-y-4 xl:sticky xl:top-24">
          <nav className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default">
            <p className="border-b border-border-subtle px-4 py-3 text-overline text-text-muted">
              {t.sectionsOverline}
            </p>
            {sectionList.map(({ key, title: label }, index) => {
              const locked = sectionLocked(key);
              const done = !locked && sectionDone(key);
              const status = sectionStatus(key);
              return (
                <a
                  key={key}
                  href={`#contract-section-${index + 1}`}
                  onClick={(event) => {
                    if (!canOpenSection(key)) return;
                    event.preventDefault();
                    openSection(key);
                  }}
                  aria-current={status === "active" ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-3 border-b border-border-subtle px-4 py-3 text-sm last:border-0",
                    status === "active" ? "bg-primary-subtle" : "hover:bg-surface-subtle",
                  )}
                >
                  {/* Active: highlighted row + brand ring (or the check, once
                      finished). Completed: filled check. Pending: muted number. */}
                  <span
                    className={cn(
                      "font-data flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs",
                      done
                        ? "bg-brand-deep text-text-inverse"
                        : status === "active"
                          ? "border border-brand-deep bg-surface-default text-brand-deep"
                          : locked
                            ? "bg-status-neutral-bg text-text-muted"
                            : "border border-border-subtle bg-surface-default text-text-muted",
                    )}
                  >
                    {done ? <Check className="h-3 w-3" aria-hidden="true" /> : index + 1}
                  </span>
                  <span className="sr-only">
                    {status === "active"
                      ? t.sectionStatusActive
                      : status === "completed"
                        ? t.sectionStatusCompleted
                        : t.sectionStatusPending}
                  </span>
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate",
                      locked ? "text-text-muted" : "text-text-primary",
                    )}
                  >
                    {label}
                  </span>
                  {locked && (
                    <Lock className="h-3.5 w-3.5 shrink-0 text-status-warning" aria-hidden="true" />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="rounded-2xl border border-border-subtle bg-surface-default p-4">
            <p className="text-overline text-text-muted">{t.summaryOverline}</p>
            <dl className="mt-3 space-y-2.5 text-sm">
              {[
                [t.summaryHotel, hotelName || t.summaryEmpty],
                [t.summaryTerm, term || t.summaryEmpty],
                [
                  t.summaryType,
                  basicsDone ? (onRequest ? f.bookingRequest : f.bookingAllotment) : t.summaryEmpty,
                ],
                [
                  t.summaryRooms,
                  basicsDone
                    ? fill(t.summaryRoomsValue, { count: contractRoomCount })
                    : t.summaryEmpty,
                ],
                [
                  t.summarySeasons,
                  seasonsDone
                    ? fill(t.summarySeasonsValue, {
                        count: seasons.length,
                        nights: seasonNights,
                      })
                    : t.summaryEmpty,
                ],
                [
                  t.summaryStock,
                  !basicsDone
                    ? t.summaryEmpty
                    : onRequest
                      ? t.summaryNoStock
                      : inventory.model === "free"
                        ? t.invFree
                        : fill(t.summaryStockValue, { count: inventoryQuantity }),
                ],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between gap-3">
                  <dt className="text-text-secondary">{label}</dt>
                  <dd className="min-w-0 flex-1 truncate text-end font-medium text-text-primary">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-text-muted">
              {onRequest ? t.summaryRequestNote : t.summaryNote}
            </p>
          </div>
        </aside>

        <fieldset disabled={notEditable} className="min-w-0 space-y-6">
          {/* 1 — Contract basics */}
          <Section
            id={num("basics")}
            {...sectionFlow("basics")}
            title={t.sections[0]!}
            body={t.basicsBody}
            done={sectionDone("basics")}
          >
            <BasicsFields
              currencyLocked={saved !== null && hasRoomPricing(saved)}
            />
            {!basicsDone && (
              <div className="mt-4 flex gap-2 rounded-xl border border-border-subtle bg-surface-subtle p-3.5">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
                <p className="text-xs leading-relaxed text-text-secondary">{t.lockNote}</p>
              </div>
            )}
          </Section>

          {/* 2 — Pricing model & base */}
          <Section
            id={num("pricing")}
            {...sectionFlow("pricing")}
            title={fixed ? t.pricingFixedTitle : t.sections[1]!}
            body={fixed ? t.pricingFixedBody : basicsDone ? t.pricingBodyFilled : t.pricingBody}
            locked={!basicsDone}
            tone={basicsDone ? "done" : "locked"}
          >
            <PricingFields />
          </Section>

          {/* 3 — Rooms */}
          {fixed && (
            <Section
              id={num("rooms")}
              {...sectionFlow("rooms")}
              title={t.sections[2]!}
              body={fixed ? t.roomsFixedBody : basicsDone ? t.roomsBody : t.roomsBodyEmpty}
              locked={!basicsDone}
              tone={basicsDone ? "done" : "locked"}
            >
              <RoomsFields
                metadata={contractMetadata.data}
                metadataLoading={contractMetadata.isLoading}
                metadataError={contractMetadata.isError}
                onRetryMetadata={() => void contractMetadata.refetch()}
                onSelectedRoomDetails={receiveSelectedRoomDetails}
              />
            </Section>
          )}

          {!fixed && (
            <Section
              id={num("rooms")}
              {...sectionFlow("rooms")}
              title={t.sections[2]!}
              body={
                lang === "ar"
                  ? "الغرف المسجلة للفندق المحدد."
                  : "Rooms registered for the selected hotel."
              }
              locked={!basicsDone}
              tone={basicsDone ? "done" : "locked"}
            >
              <AvailableHotelRooms
                hotelId={basics.hotelId}
                metadata={contractMetadata.data}
                onSelectedRoomDetails={receiveSelectedRoomDetails}
              />
            </Section>
          )}

          {/* 4 — Meal plans */}
          {!fixed && (
            <>
              <Section
                id={num("meals")}
                {...sectionFlow("meals")}
                title={t.sections[4]!}
                body={t.mealsBody}
                locked={!basicsDone}
                tone={basicsDone ? "done" : "locked"}
              >
                <MealsFields />
              </Section>
            </>
          )}

          {/* 4 — Children */}
          <Section
            id={num("children")}
            {...sectionFlow("children")}
            title={t.sections[3]!}
            body={basicsDone ? t.childrenBody : t.childrenBodyShort}
            locked={!basicsDone}
            tone={basicsDone ? "done" : "locked"}
          >
            <ChildrenFields />
          </Section>

          {/* 6 — Inventory */}
          <Section
            id={num("inventory")}
            {...sectionFlow("inventory")}
            title={t.sections[5]!}
            body={onRequest ? t.requestInvBody : t.inventoryBody}
            locked={!basicsDone}
            tone={basicsDone ? "done" : "locked"}
          >
            {/* UI 03.1B — an On Request contract commits no rooms at all. */}
            {onRequest ? (
              <p className="text-sm leading-relaxed text-text-secondary">{t.requestInvShort}</p>
            ) : (
              <>
                {baseRoomViewMissing && (
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <p className="text-sm text-status-danger">{t.invRoomDetailsError}</p>
                  </div>
                )}
                <p className="text-sm font-medium text-text-primary">{t.inventoryModel}</p>
                <ChoiceRow
                  value={inventory.model}
                  onChange={(next) => dispatch(updateInventory({ model: next as InventoryModel }))}
                  options={[
                    { value: "shared", label: t.invShared },
                    { value: "perRoom", label: t.invPerRoom },
                    { value: "free", label: t.invFree },
                  ]}
                />
                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  {inventory.model === "shared"
                    ? t.invSharedHint
                    : inventory.model === "perRoom"
                      ? t.invPerRoomHint
                      : t.invFreeHint}
                </p>

                {/* UI 03.1L — free sale has no number, so it has no table. */}
                {inventory.model === "free" && (
                  <div className="mt-3 space-y-2">
                    {[t.invFreeNote1, t.invFreeNote2, t.invFreeNote3].map((note) => (
                      <p key={note} className="text-xs leading-relaxed text-text-muted">
                        {note}
                      </p>
                    ))}
                  </div>
                )}

                {inventory.model === "shared" && (
                  <>
                    <div className="mt-4 max-w-xs">
                      <Input
                        label={t.invNights}
                        type="number"
                        min={1}
                        step={1}
                        value={inventory.roomsPerNight}
                        onChange={(e) =>
                          dispatch(updateInventory({ roomsPerNight: e.target.value }))
                        }
                        suffix="/ night"
                      />
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-text-muted">
                      {t.invNightsHint}
                    </p>

                    <Table
                      head={[c.roomDetails.roomSize, t.colCap, t.colSellsShort]}
                      rows={additionalInventoryVariations.map((variation) => {
                        const roomName = contractRoomLabel(
                          {
                            id: variation.roomId,
                            roomSizeId: selectedDetailsById[variation.roomId]?.roomSizeId ?? null,
                          },
                          lang,
                        );
                        const viewName = f.views[variation.view as RoomView] ?? variation.view;
                        const label = `${roomName} · ${viewName}`;
                        const planNames = variation.plans
                          .map((plan) => {
                            const metadataPlan = contractMetadata.data?.mealPlans.find(
                              (option) => option.value === plan,
                            );
                            return (
                              (lang === "ar" ? metadataPlan?.labelAr : metadataPlan?.labelEn) ||
                              plan
                            );
                          })
                          .join(lang === "ar" ? "، " : ", ");
                        const key = inventoryVariationKey(variation);
                        return [
                          <span key={`${key}-room`}>{label}</span>,
                          <Input
                            key={`${key}-cap`}
                            className="max-w-32"
                            type="number"
                            min={1}
                            step={1}
                            aria-label={`${label} · ${t.colCap}`}
                            placeholder={t.invNoCap}
                            value={inventory.roomCaps[key] ?? ""}
                            onChange={(event) =>
                              dispatch(setInventoryRoomCap({ key, value: event.target.value }))
                            }
                          />,
                          planNames || "—",
                        ];
                      })}
                    />
                    {inventoryVariations.length === 0 && (
                      <p className="mt-2 text-xs text-text-muted">{t.invNoVariations}</p>
                    )}
                    <p className="mt-2 text-xs leading-relaxed text-text-muted">{t.capHint}</p>
                  </>
                )}

                {/* UI 03.1N — a number per room type, and what draws from it. */}
                {inventory.model === "perRoom" && (
                  <>
                    <Table
                      head={[c.roomDetails.roomSize, t.colRoomsNight, t.colDrawsFrom]}
                      rows={additionalInventoryVariations.map((variation) => {
                        const roomName = contractRoomLabel(
                          {
                            id: variation.roomId,
                            roomSizeId: selectedDetailsById[variation.roomId]?.roomSizeId ?? null,
                          },
                          lang,
                        );
                        const viewName = f.views[variation.view as RoomView] ?? variation.view;
                        const label = `${roomName} · ${viewName}`;
                        const planNames = variation.plans
                          .map((plan) => {
                            const metadataPlan = contractMetadata.data?.mealPlans.find(
                              (option) => option.value === plan,
                            );
                            return (
                              (lang === "ar" ? metadataPlan?.labelAr : metadataPlan?.labelEn) ||
                              plan
                            );
                          })
                          .join(lang === "ar" ? "، " : ", ");
                        const key = inventoryVariationKey(variation);
                        return [
                          <span key={`${key}-room`}>{label}</span>,
                          <div key={`${key}-quantity`} className="max-w-44 space-y-2">
                            <Input
                              className="max-w-32"
                              type="number"
                              min={1}
                              step={1}
                              aria-label={`${label} · ${t.colRoomsNight}`}
                              value={inventory.rooms[key]?.roomsPerNight ?? ""}
                              onChange={(event) =>
                                dispatch(
                                  setPerRoomInventory({
                                    key,
                                    field: "roomsPerNight",
                                    value: event.target.value,
                                  }),
                                )
                              }
                            />
                            {inventory.soldOut === "overbooking" && (
                              <Input
                                className="max-w-32"
                                type="number"
                                min={1}
                                step={1}
                                aria-label={`${label} · ${t.overLimit}`}
                                placeholder={t.overLimit}
                                value={inventory.rooms[key]?.overbookingLimitPerNight ?? ""}
                                onChange={(event) =>
                                  dispatch(
                                    setPerRoomInventory({
                                      key,
                                      field: "overbookingLimitPerNight",
                                      value: event.target.value,
                                    }),
                                  )
                                }
                              />
                            )}
                          </div>,
                          planNames || "—",
                        ];
                      })}
                    />
                    {baseInventoryVariation && (
                      <div className="mt-4 rounded-lg border border-border-subtle p-4">
                        <p className="mb-3 text-sm font-medium text-text-primary">
                          {contractRoomLabel(
                            {
                              id: baseInventoryVariation.roomId,
                              roomSizeId:
                                selectedDetailsById[baseInventoryVariation.roomId]?.roomSizeId ??
                                null,
                            },
                            lang,
                          )}
                          {" · "}
                          {f.views[baseInventoryVariation.view as RoomView] ??
                            baseInventoryVariation.view}
                          {" · "}
                          {f.baseTag}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <Input
                            className="max-w-32"
                            label={t.colRoomsNight}
                            type="number"
                            min={1}
                            step={1}
                            aria-label={`${f.baseTag} · ${t.colRoomsNight}`}
                            value={
                              inventory.rooms[inventoryVariationKey(baseInventoryVariation)]
                                ?.roomsPerNight ?? ""
                            }
                            onChange={(event) =>
                              dispatch(
                                setPerRoomInventory({
                                  key: inventoryVariationKey(baseInventoryVariation),
                                  field: "roomsPerNight",
                                  value: event.target.value,
                                }),
                              )
                            }
                          />
                          {inventory.soldOut === "overbooking" && (
                            <Input
                              className=""
                              label={t.overLimit}
                              type="number"
                              min={1}
                              step={1}
                              aria-label={`${f.baseTag} · ${t.overLimit}`}
                              placeholder={t.overLimit}
                              value={
                                inventory.rooms[inventoryVariationKey(baseInventoryVariation)]
                                  ?.overbookingLimitPerNight ?? ""
                              }
                              onChange={(event) =>
                                dispatch(
                                  setPerRoomInventory({
                                    key: inventoryVariationKey(baseInventoryVariation),
                                    field: "overbookingLimitPerNight",
                                    value: event.target.value,
                                  }),
                                )
                              }
                            />
                          )}
                        </div>
                      </div>
                    )}
                    {inventoryVariations.length === 0 && (
                      <p className="mt-2 text-xs text-text-muted">{t.invNoVariations}</p>
                    )}
                  </>
                )}

                {inventory.model !== "free" && (
                  <>
                    <p className="mt-5 text-sm font-medium text-text-primary">{t.soldOut}</p>
                    <ChoiceRow
                      value={inventory.soldOut}
                      onChange={(next) =>
                        dispatch(updateInventory({ soldOut: next as SoldOutAction }))
                      }
                      options={[
                        { value: "stop", label: t.soldOutStop },
                        { value: "request", label: t.soldOutRequest },
                        { value: "overbooking", label: t.soldOutOver },
                      ]}
                    />
                    <p className="mt-2 text-xs leading-relaxed text-text-muted">{t.overHint}</p>
                    {inventory.soldOut === "stop" && (
                      <p className="mt-2 text-xs leading-relaxed text-text-muted">
                        {t.soldOutStopHint}
                      </p>
                    )}
                    {inventory.soldOut === "request" && (
                      <p className="mt-2 text-xs leading-relaxed text-text-muted">
                        {t.soldOutRequestHint}
                      </p>
                    )}
                    {inventory.soldOut === "overbooking" && (
                      <>
                        {inventory.model === "shared" ? (
                          <>
                            <div className="mt-3 max-w-xs">
                              <Input
                                label={t.overLimit}
                                type="number"
                                min={1}
                                step={1}
                                value={inventory.sharedOverbookingLimitPerNight}
                                onChange={(event) =>
                                  dispatch(
                                    updateInventory({
                                      sharedOverbookingLimitPerNight: event.target.value,
                                    }),
                                  )
                                }
                              />
                            </div>
                            <p className="mt-2 text-xs leading-relaxed text-text-muted">
                              {fill(t.overLimitHint, {
                                stock: inventory.roomsPerNight || "0",
                                limit: inventory.sharedOverbookingLimitPerNight || "—",
                              })}
                            </p>
                          </>
                        ) : (
                          <p className="mt-2 text-xs leading-relaxed text-text-muted">
                            {t.perRoomLimitHint}
                          </p>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </Section>

          {/* 7 — Rate seasons */}
          <Section
            id={num("seasons")}
            {...sectionFlow("seasons")}
            title={t.sections[6]!}
            body={t.seasonsBody}
            locked={false}
            tone={!basicsDone ? "locked" : seasonsDone ? "done" : "open"}
            right={
              seasonsDone ? (
                <Button variant="outline" size="sm" onClick={() => setEditingSeason("new")}>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  {t.addSeason}
                </Button>
              ) : undefined
            }
          >
            {!seasonsDone ? (
              <div className="rounded-xl border border-border-subtle bg-surface-subtle p-4">
                <p className="text-xs leading-relaxed text-text-secondary">{t.seasonsLocked}</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <a
                    href={`#contract-section-${num("restrictions")}`}
                    onClick={(event) => {
                      event.preventDefault();
                      openSection("restrictions");
                    }}
                    className="text-xs font-medium text-text-link hover:underline"
                  >
                    {t.goRestrictions}
                  </a>
                  <a
                    href={`#contract-section-${num("policies")}`}
                    onClick={(event) => {
                      event.preventDefault();
                      openSection("policies");
                    }}
                    className="text-xs font-medium text-text-link hover:underline"
                  >
                    {t.goPolicies}
                  </a>
                </div>
              </div>
            ) : (
              <>
                <SeasonTimeline
                  seasons={timeline}
                  ar={lang === "ar"}
                  {...(basics.startDate && basics.endDate
                    ? { start: basics.startDate, end: basics.endDate }
                    : {})}
                />
                {seasons.length > 0 && (
                  <div className="mt-3">
                    <SeasonLegend seasons={timeline} ar={lang === "ar"} />
                  </div>
                )}

                <div className="mt-4 overflow-hidden rounded-xl border border-border-subtle">
                  <div className="hidden grid-cols-[200px_210px_70px_minmax(0,1fr)_160px] gap-3 bg-surface-subtle px-3.5 py-2 text-[12px] leading-[15px] text-text-muted lg:grid">
                    <span>{t.colSegment}</span>
                    <span>{t.colDates}</span>
                    <span>{t.colNights}</span>
                    <span>{t.colChanges}</span>
                    <span />
                  </div>

                  <div className="grid gap-x-3 gap-y-2 px-3.5 py-3 text-[13px] leading-[18px] text-text-body lg:grid-cols-[200px_210px_70px_minmax(0,1fr)_160px] lg:items-center lg:py-2.5">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#eef1ee]"
                        aria-hidden="true"
                      />
                      <b className="text-[13px] font-semibold text-text-primary">{t.baseSegment}</b>
                    </span>
                    <span>{t.everyNight}</span>
                    <span className="font-data">{Math.max(termNights - seasonNights, 0)}</span>
                    <span>{t.changesNone}</span>
                    <span />
                  </div>

                  {seasons.map((season) => (
                    <div
                      key={season.id}
                      className="grid gap-x-3 gap-y-2 border-t border-border-subtle px-3.5 py-3 text-[13px] leading-[18px] text-text-body lg:grid-cols-[200px_210px_70px_minmax(0,1fr)_160px] lg:items-center lg:py-2.5"
                    >
                      <span className="inline-flex min-w-0 items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: season.color }}
                          aria-hidden="true"
                        />
                        <b className="truncate text-[13px] font-semibold text-text-primary">
                          {season.name}
                        </b>
                      </span>
                      <span>
                        {readableDay(season.startDate, lang)} – {readableDay(season.endDate, lang)}
                      </span>
                      <span className="font-data">{nightsIn(season)}</span>
                      <span>
                        {seasonChanges(season)}
                        {season.issues.map((issue) => (
                          <span
                            key={issue.code}
                            className="mt-0.5 block text-[12px] text-status-warning"
                          >
                            {issue.message}
                          </span>
                        ))}
                      </span>
                      <span className="lg:justify-self-end">
                        <Button
                          variant="outline"
                          className="w-full lg:w-[160px]"
                          onClick={() => setEditingSeason(season)}
                        >
                          {t.edit}
                        </Button>
                      </span>
                    </div>
                  ))}
                </div>
                {seasons.length === 0 && (
                  <p className="mt-3 text-xs leading-relaxed text-text-muted">{t.seasonsEmpty}</p>
                )}
              </>
            )}
          </Section>

          {/* 8 — Restrictions */}
          <Section
            id={num("restrictions")}
            {...sectionFlow("restrictions")}
            title={t.sections[7]!}
            body={t.restrictionsBody}
            locked={!basicsDone}
            tone={basicsDone ? "done" : "locked"}
          >
            <RestrictionsFields />
          </Section>

          {/* 9 — Policies */}
          <Section
            id={num("policies")}
            {...sectionFlow("policies")}
            title={t.sections[8]!}
            body={t.policiesBody}
            locked={!basicsDone}
            tone={basicsDone ? "done" : "locked"}
          >
            <ChoiceRow
              value={hasPolicies ? "add" : "none"}
              onChange={(next) => {
                if (next === "none" && (draft.policies.cancellation || draft.policies.release)) {
                  setConfirmNoPolicies(true);
                  return;
                }
                dispatch(setPoliciesEnabled(next === "add"));
              }}
              options={[
                { value: "add", label: t.addToContract },
                // { value: "none", label: t.noPoliciesOnContract },
              ]}
            />
            {!hasPolicies && (
              <>
                <p className="mt-3 text-xs leading-relaxed text-text-muted">{t.policiesNone}</p>
                <p className="mt-2 text-xs leading-relaxed text-status-warning">
                  {t.policiesNoneWarn}
                </p>
              </>
            )}
            {hasPolicies && (
              <>
                <PoliciesSummary
                  onCancellation={() => setPolicy("cancellation")}
                  onRelease={() => setPolicy("release")}
                />

                <p className="mt-5 text-overline text-text-muted">{t.seasonPolicyOverline}</p>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-sm">
                    <thead>
                      <tr className="text-overline text-text-muted">
                        {[t.colSegment, t.colDates, t.cancellation, ""].map((cell, index) => (
                          <th
                            key={cell || index}
                            className={cn(
                              "py-2 font-semibold",
                              index === 3 ? "text-end" : "text-start",
                            )}
                          >
                            {cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border-subtle">
                        <td className="py-2.5 pe-3 text-text-secondary">{t.contractPolicyRow}</td>
                        <td className="py-2.5 pe-3 text-text-secondary">{t.everyNight}</td>
                        <td className="py-2.5 pe-3 text-text-secondary">
                          {draft.policies.cancellation
                            ? policyLines(
                                draft.policies.cancellation,
                                f.policies,
                                lang,
                                basics.currency,
                              ).join(" · ")
                            : t.noPolicyYet}
                        </td>
                        <td />
                      </tr>
                      {seasons.map((season) => (
                        <tr key={season.id} className="border-t border-border-subtle">
                          <td className="py-2.5 pe-3 text-text-secondary">{season.name}</td>
                          <td className="py-2.5 pe-3 text-text-secondary">
                            {readableDay(season.startDate, lang)} –{" "}
                            {readableDay(season.endDate, lang)}
                          </td>
                          <td className="py-2.5 pe-3 text-text-secondary">
                            {season.cancellation
                              ? policyLines(
                                  season.cancellation,
                                  f.policies,
                                  lang,
                                  basics.currency,
                                ).join(" · ")
                              : t.samePolicy}
                          </td>
                          <td className="py-2.5 text-end">
                            <button
                              type="button"
                              onClick={() => setEditingSeason(season)}
                              className="text-xs font-medium text-text-link hover:underline"
                            >
                              {t.editInSeason}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Section>

          <Section
            id={num("booking")}
            {...sectionFlow("booking")}
            title={f.bookingTitle}
            body={f.bookingBody}
            locked={!basicsDone}
            tone={basicsDone ? "done" : "locked"}
          >
            <BookingFields />
          </Section>

          {/* 10 — Review & activate */}
          <Section
            id={num("review")}
            {...sectionFlow("review")}
            title={t.sections[9]!}
            body={t.reviewBody}
            locked={!basicsDone}
            tone={!basicsDone ? "locked" : sectionDone("review") ? "done" : "open"}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p
                className={cn(
                  "min-w-0 flex-1 text-sm",
                  seasonsDone && !notEditable ? "text-status-success" : "text-text-muted",
                )}
              >
                {notEditable
                  ? fill(t.notDraftTitle, { status: savedStatusName })
                  : seasonsDone
                    ? t.reviewReady
                    : t.reviewLocked}
              </p>
              {!notEditable && (
                <Button
                  variant={seasonsDone ? "default" : "outline"}
                  loading={savingDraft}
                  onClick={openReview}
                >
                  {t.reviewActivate}
                </Button>
              )}
            </div>
          </Section>
        </fieldset>
      </div>

      {editingSeason && (
        <SeasonEditor
          season={editingSeason === "new" ? null : editingSeason}
          others={seasons.filter(
            (season) => editingSeason === "new" || season.id !== editingSeason.id,
          )}
          term={{ startDate: basics.startDate, endDate: basics.endDate }}
          weekend={basics.weekendDays.map((day) => WEEKDAY_NUMBER[day])}
          currency={basics.currency}
          contractChildren={draft.children}
          contractPolicy={draft.policies.enabled ? draft.policies.cancellation : null}
          onSave={(season) => {
            dispatch(saveSeason(season));
            notify.success(
              editingSeason === "new"
                ? seasonPage.added[lang === "ar" ? "ar" : "en"]
                : seasonPage.updated[lang === "ar" ? "ar" : "en"],
            );
            setEditingSeason(null);
          }}
          onRemove={(id) => {
            dispatch(removeSeason(id));
            notify.success(seasonPage.removed[lang === "ar" ? "ar" : "en"]);
            setEditingSeason(null);
          }}
          onClose={() => setEditingSeason(null)}
        />
      )}
      {policy === "cancellation" && (
        <CancellationDrawer
          initial={draft.policies.cancellation}
          currency={basics.currency}
          onSave={(next) => {
            dispatch(saveCancellationPolicy(next));
            notify.success(f.policies.cancellationSaved);
          }}
          onClose={() => setPolicy(null)}
        />
      )}
      {confirmNoPolicies && (
        <IconModal
          tone="danger"
          icon={<AlertTriangle className="h-5 w-5" aria-hidden="true" />}
          overline={t.sections[8]!}
          title={f.policies.noneTitle}
          body={f.policies.noneBody}
          onClose={() => setConfirmNoPolicies(false)}
          footer={
            <>
              <Button variant="outline" onClick={() => setConfirmNoPolicies(false)}>
                {f.policies.noneKeep}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  dispatch(setPoliciesEnabled(false));
                  setConfirmNoPolicies(false);
                }}
              >
                {f.policies.noneConfirm}
              </Button>
            </>
          }
        />
      )}
      {policy === "release" && (
        <ReleaseDrawer
          initial={draft.policies.release}
          initialSla={{ minutes: basics.slaMinutes, expiry: basics.slaExpiryAction }}
          onSave={(release, sla) => {
            dispatch(saveReleasePolicy(release));
            if (sla) {
              dispatch(updateBasics({ slaMinutes: sla.minutes, slaExpiryAction: sla.expiry }));
            }
          }}
          onClose={() => setPolicy(null)}
        />
      )}

      {reviewOpen && (
        <ActivateDrawer
          rows={reviewRows}
          loading={reviewQuery.isFetching}
          loadingLabel={t.reviewLoading}
          error={
            reviewQuery.error ? getApiErrorMessage(reviewQuery.error, t.reviewLoadError) : null
          }
          retryLabel={f.retry}
          onRetry={() => void reviewQuery.refetch()}
          actionLabel={
            review?.targetStatus === "scheduled"
              ? t.reviewScheduleContract
              : t.reviewActivateContract
          }
          review={review}
          reviewKey={reviewResponseKey}
          confirmationAccepted={confirmationAccepted}
          onConfirmationChange={(accepted) => {
            if (reviewResponseKey !== null) {
              setAcceptedReviewKey(accepted ? reviewResponseKey : null);
            }
          }}
          onFinalize={submitFinalization}
          finalizationPending={finalizeMutation.isPending}
          submissionBlocked={finalizationSubmissionBlocked}
          submissionBlockedMessage={submissionBlockedMessage}
          finalizationError={finalizationErrorForDrawer}
          onRetryFinalization={retryFinalization}
          finalizationSuccess={finalizationSuccess}
          onClose={closeReview}
        />
      )}

      {leaveBlocker.status === "blocked" && (
        <UnsavedOverlay
          onClose={() => leaveBlocker.reset()}
          onDiscard={() => {
            allowLeave.current = true;
            leaveBlocker.proceed();
          }}
          onSave={() => void saveAndLeave()}
        />
      )}
    </PageShell>
  );
}
