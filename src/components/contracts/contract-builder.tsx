import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { useBlocker, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Check, ChevronRight, Lock, Plus, Save } from "lucide-react";
import { IconModal } from "@/components/layout/overlay";
import { PageShell } from "@/components/layout/page-shell";
import { useContractHotels } from "@/api/modules/hotel-contract/contrac-tHotels/useContractHotels";
import { useHotelContract } from "@/api/modules/hotel-contract/useHotelContract";
import { useHotelContractsMetadata } from "@/api/modules/hotel-contract/useHotelContractsMetadata";
import { useSaveHotelContract } from "@/api/modules/hotel-contract/useSaveHotelContract";
import { getApiErrorList } from "@/lib/api-error";
import {
  basicsReady,
  childPricingChanged,
  hasInactiveRestrictions,
  restrictionsChanged,
  restrictionsFromContract,
  cancellationChanged,
  cancellationFromContract,
  seasonsChanged,
  seasonsFromContract,
  toRestrictions,
  childrenFromContract,
  contractDifferences,
  draftFromContract,
  hasRoomPricing,
  mergeLatestBasics,
  sameSavedBasics,
  sameSavedDraft,
  toCreateContractBody,
  toUpdateContractBody,
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
  validateContract,
  type ContractSectionKey,
} from "@/components/contracts/contract-form/schema";
import { readableDay } from "@/components/ui/date-field";
import {
  loadContract,
  replaceCancellation,
  replaceChildren,
  replaceRestrictions,
  replaceSeasons,
  removeSeason,
  saveSeason,
  resetDraft,
  updateBasics,
  saveCancellationPolicy,
  saveReleasePolicy,
  setPoliciesEnabled,
} from "@/store/features/contracts/contract-draft.slice";
import { ActivateDrawer } from "@/components/contracts/lifecycle-overlays";
import { CancellationDrawer, ReleaseDrawer } from "@/components/contracts/policy-overlays";
import { SeasonEditor, seasonNights as nightsIn } from "@/components/contracts/season-editor";
import { SeasonLegend, SeasonTimeline } from "@/components/contracts/season-timeline";
import { policyLines } from "@/components/contracts/contract-form/policies-summary";
import { seasonPage } from "@/lib/season-page-data";
import { WEEKDAY_NUMBER, type SeasonRule } from "@/store/features/contracts/types";
import { ChoiceRow, Section, Table } from "@/components/contracts/contract-parts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { fill, useLanguage } from "@/lib/i18n";
import { notify, wait } from "@/lib/notify";
import { usePortal } from "@/lib/portal-store";
import { MONTHS, inventoryCaps, perRoomStock } from "@/lib/contract-data";

type SoldOut = "stop" | "request" | "overbooking";
type Inventory = "shared" | "perRoom" | "free";

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
  const { contracts, addContract } = usePortal();
  const source = contracts.find((x) => x.id === (contractId ?? sourceId));

  const dispatch = useAppDispatch();
  const draft = useContractDraft();
  const { basics } = draft;
  const sourceName = source?.name;
  const savedId =
    mode === "edit" && contractId && /^\d+$/.test(contractId) ? Number(contractId) : null;
  const remote = useHotelContract(savedId);
  const saved = remote.data ?? null;
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
    if (draft.basics.hotelId === saved.hotelId && sameSavedBasics(draft, saved)) return;
    dispatch(loadContract(draftFromContract(saved)));
  }, [dispatch, saved, draft]);
  const contractHotels = useContractHotels({ page: 1, limit: 100 });
  const contractMetadata = useHotelContractsMetadata();
  const allowLeave = useRef(false);
  const [inventory, setInventory] = useState<Inventory>("shared");
  const [stock, setStock] = useState("50");
  const [soldOut, setSoldOut] = useState<SoldOut>("overbooking");
  const [overLimit, setOverLimit] = useState("2");
  const [saving, setSaving] = useState(false);
  /* OV 03.2 — the drawer that shows every section before it goes live. */
  const [reviewOpen, setReviewOpen] = useState(false);
  /* OV 03.16 / 03.17 — the two policy drawers. */
  const [policy, setPolicy] = useState<"cancellation" | "release" | null>(null);
  const [confirmNoPolicies, setConfirmNoPolicies] = useState(false);
  const [editingSeason, setEditingSeason] = useState<SeasonRule | "new" | null>(null);

  const onRequest = basics.bookingType === "on_request";
  const hasPolicies = draft.policies.enabled;
  const hasRestrictions = draft.restrictions.enabled;
  const fixed = draft.pricingModel === "fixed_price";
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
  const firstOpen = sectionList.findIndex(
    (item) => !sectionLocked(item.key) && !sectionDone(item.key),
  );
  const currentSection = firstOpen === -1 ? sectionList.length - 1 : firstOpen;

  /* UI 03.1F section 3 — the rooms are a checklist, so what is on sale
     is held here and section 2's base row follows it. */
  const contractRoomCount = fixed
    ? draft.fixedRooms.length
    : draft.baseSupplements.rooms.filter((room) => room.roomId !== draft.baseSupplements.baseRoomId)
        .length + (draft.baseSupplements.baseRoomId === null ? 0 : 1);
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
      ...(Object.values(season.childPrices).some((price) => price.trim() !== "")
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

  function openReview() {
    const issues = validateContract(draft, f.v, childMaxAge);
    if (issues.length > 0) {
      notify.error(fill(f.reviewBlocked, { count: issues.length, first: issues[0]!.message }));
      jumpTo(issues[0]!.section);
      return;
    }
    setReviewOpen(true);
  }
  function jumpTo(section: ContractSectionKey) {
    document
      .getElementById(`contract-section-${num(section)}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function saveDraft(leaving = false): Promise<boolean> {
    if (!basicsReady(draft)) {
      notify.error(f.saveNeedsBasics);
      jumpTo("basics");
      return false;
    }
    const childErrors = childIssues(draft.children, f.v, childMaxAge);
    if (childErrors.length > 0) {
      notify.error(childErrors[0]!);
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
    let contract: SupplierHotelContract | null = saved;
    let createdId: number | null = null;
    try {
      if (!contract) {
        contract = await saveContract.mutateAsync({ id: null, body: toCreateContractBody(draft) });
        createdId = contract.id;
        if (hasInactiveRestrictions(draft)) {
          contract = await saveContract.mutateAsync({
            id: contract.id,
            body: { expectedVersion: contract.version, restrictions: toRestrictions(draft) },
          });
        }
      } else {
        const body = toUpdateContractBody(draft, contract);
        if (body) contract = await saveContract.mutateAsync({ id: contract.id, body });
      }
      if (contract === saved) {
        notify.success(f.noChanges);
        return true;
      }
      notify.success(createdId ? f.draftCreated : f.draftUpdated);
      return true;
    } catch (error) {
      onSaveError(error as Error, contract);
      return false;
    } finally {
      if (createdId !== null && !leaving) {
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
        const fields = latest ? contractDifferences(before, latest) : [];
        if (latest) {
          dispatch(updateBasics(mergeLatestBasics(editing, before, latest)));
          if (latest.childPricing && !childPricingChanged(editing, before)) {
            dispatch(replaceChildren(childrenFromContract(latest.childPricing)));
          }
          if (!restrictionsChanged(editing, before)) {
            dispatch(replaceRestrictions(restrictionsFromContract(latest.restrictions ?? [])));
          }
          if (!cancellationChanged(editing, before)) {
            dispatch(
              replaceCancellation(cancellationFromContract(latest.cancellationPolicy ?? null)),
            );
          }
          if (!seasonsChanged(editing, before)) {
            dispatch(replaceSeasons(seasonsFromContract(latest.seasons ?? [])));
          }
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
  const draftStatus = remote.isLoading
    ? t.draftLoading
    : remote.isError
      ? f.loadFailed
      : !saved
        ? t.draftEmpty
        : sameSavedDraft(draft, saved)
          ? fill(t.draftSaved, { time: savedAt })
          : t.draftUnsaved;

  const hasUnsaved =
    !remote.isLoading &&
    (saved
      ? !sameSavedDraft(draft, saved)
      : Boolean(basics.hotelId || basics.name.trim() || basics.startDate || basics.currency));
  const leaveBlocker = useBlocker({
    shouldBlockFn: () => !allowLeave.current && hasUnsaved,
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

  function activate() {
    setSaving(true);
    void (async () => {
      await wait(650);
      addContract({
        id: contractId ?? `SC-2027-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        hotelId: String(basics.hotelId),
        name: basics.name,
        nameAr: basics.name,
        dates: term,
        datesAr: term,
        period: term,
        periodAr: term,
        model: onRequest ? "onRequest" : "instant",
        rooms: contractRoomCount,
        state: "active",
        roomNames: [],
        allotment: Number(stock) || 0,
        roomTypes: contractRoomCount,
        soldOut: soldOut === "stop" ? "stop" : soldOut === "request" ? "onRequest" : "overbooking",
        overbooking: Number(overLimit) || 2,
        releaseDays: 3,
        version: "v1.0",
      });
      notify.success(t.activated);
      setSaving(false);
      allowLeave.current = true;
      navigate({ to: "/rate-contracts" });
    })();
  }

  return (
    <PageShell>
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
          <Button
            variant="outline"
            loading={savingDraft}
            disabled={remote.isLoading || remote.isError}
            onClick={() => void saveDraft()}
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            {t.saveDraft}
          </Button>
          <Button loading={saving} onClick={openReview}>
            {t.reviewActivate}
          </Button>
        </div>
      </header>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[264px_minmax(0,1fr)]">
        <aside className="h-fit space-y-4 xl:sticky xl:top-24">
          <nav className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-default">
            <p className="border-b border-border-subtle px-4 py-3 text-overline text-text-muted">
              {t.sectionsOverline}
            </p>
            {sectionList.map(({ key, title: label }, index) => {
              const locked = sectionLocked(key);
              const done = sectionDone(key);
              return (
                <a
                  key={key}
                  href={`#contract-section-${index + 1}`}
                  className={cn(
                    "flex items-center gap-3 border-b border-border-subtle px-4 py-3 text-sm last:border-0",
                    index === currentSection ? "bg-primary-subtle" : "hover:bg-surface-subtle",
                  )}
                >
                  <span
                    className={cn(
                      "font-data flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs",
                      locked
                        ? "bg-status-neutral-bg text-text-muted"
                        : done
                          ? "bg-brand-deep text-text-inverse"
                          : "border border-brand-deep bg-surface-default text-brand-deep",
                    )}
                  >
                    {done && !locked ? <Check className="h-3 w-3" aria-hidden="true" /> : index + 1}
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
                      : inventory === "free"
                        ? t.invFree
                        : fill(t.summaryStockValue, { count: stock }),
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

        <div className="min-w-0 space-y-6">
          {/* 1 — Contract basics */}
          <Section
            id={num("basics")}
            title={t.sections[0]!}
            body={t.basicsBody}
            done={sectionDone("basics")}
          >
            <BasicsFields
              locked={saved !== null}
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
            title={fixed ? t.pricingFixedTitle : t.sections[1]!}
            body={fixed ? t.pricingFixedBody : basicsDone ? t.pricingBodyFilled : t.pricingBody}
            locked={!basicsDone}
            tone={basicsDone ? "done" : "locked"}
          >
            <PricingFields modelLocked={saved !== null} />
          </Section>

          {/* 3 — Rooms */}
          <Section
            id={num("rooms")}
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
            />
          </Section>

          {/* 4 — Meal plans */}
          {!fixed && (
            <>
              <Section
                id={num("meals")}
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
                <p className="text-sm font-medium text-text-primary">{t.inventoryModel}</p>
                <ChoiceRow
                  value={inventory}
                  onChange={(next) => setInventory(next as Inventory)}
                  options={[
                    { value: "shared", label: t.invShared },
                    { value: "perRoom", label: t.invPerRoom },
                    { value: "free", label: t.invFree },
                  ]}
                />
                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  {inventory === "shared"
                    ? t.invSharedHint
                    : inventory === "perRoom"
                      ? t.invPerRoomHint
                      : t.invFreeHint}
                </p>

                {/* UI 03.1L — free sale has no number, so it has no table. */}
                {inventory === "free" && (
                  <div className="mt-3 space-y-2">
                    {[t.invFreeNote1, t.invFreeNote2, t.invFreeNote3].map((note) => (
                      <p key={note} className="text-xs leading-relaxed text-text-muted">
                        {note}
                      </p>
                    ))}
                  </div>
                )}

                {inventory === "shared" && (
                  <>
                    <div className="mt-4 max-w-xs">
                      <Input
                        label={t.invNights}
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        suffix="/ night"
                      />
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-text-muted">
                      {t.invNightsHint}
                    </p>

                    <Table
                      head={[t.colRoomType, t.colCap, t.colSellsShort]}
                      rows={inventoryCaps.map((cap) => [
                        lang === "ar" ? cap.roomAr : cap.room,
                        lang === "ar" ? cap.capAr : cap.cap,
                        lang === "ar" ? cap.sellsAr : cap.sells,
                      ])}
                    />
                    <p className="mt-2 text-xs leading-relaxed text-text-muted">{t.capHint}</p>
                  </>
                )}

                {/* UI 03.1N — a number per room type, and what draws from it. */}
                {inventory === "perRoom" && (
                  <>
                    <p className="mt-3 text-xs leading-relaxed text-text-muted">
                      {t.invPerRoomNote}
                    </p>
                    <Table
                      head={[t.colRoomType, t.colRoomsNight, t.colDrawsFrom]}
                      rows={perRoomStock.map((row) => [
                        lang === "ar" ? row.roomAr : row.room,
                        lang === "ar" ? row.roomsAr : row.rooms,
                        lang === "ar" ? row.drawsAr : row.draws,
                      ])}
                    />
                  </>
                )}

                {inventory !== "free" && (
                  <>
                    <p className="mt-5 text-sm font-medium text-text-primary">{t.soldOut}</p>
                    <ChoiceRow
                      value={soldOut}
                      onChange={(next) => setSoldOut(next as SoldOut)}
                      options={[
                        { value: "stop", label: t.soldOutStop },
                        { value: "request", label: t.soldOutRequest },
                        { value: "overbooking", label: t.soldOutOver },
                      ]}
                    />
                    <p className="mt-2 text-xs leading-relaxed text-text-muted">{t.overHint}</p>
                    {soldOut === "stop" && (
                      <p className="mt-2 text-xs leading-relaxed text-text-muted">
                        {t.soldOutStopHint}
                      </p>
                    )}
                    {soldOut === "request" && (
                      <p className="mt-2 text-xs leading-relaxed text-text-muted">
                        {t.soldOutRequestHint}
                      </p>
                    )}
                    {soldOut === "overbooking" && (
                      <>
                        <div className="mt-3 max-w-xs">
                          <Input
                            label={t.overLimit}
                            value={overLimit}
                            onChange={(e) => setOverLimit(e.target.value)}
                          />
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-text-muted">
                          {inventory === "perRoom"
                            ? fill(t.perRoomLimitHint, { limit: overLimit })
                            : fill(t.overLimitHint, { stock, limit: overLimit })}
                        </p>
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
                    className="text-xs font-medium text-text-link hover:underline"
                  >
                    {t.goRestrictions}
                  </a>
                  <a
                    href={`#contract-section-${num("policies")}`}
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
                { value: "none", label: t.noPoliciesOnContract },
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
            title={t.sections[9]!}
            body={t.reviewBody}
            locked={!basicsDone}
            tone={!basicsDone ? "locked" : sectionDone("review") ? "done" : "open"}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p
                className={cn(
                  "min-w-0 flex-1 text-sm",
                  seasonsDone ? "text-status-success" : "text-text-muted",
                )}
              >
                {seasonsDone ? t.reviewReady : t.reviewLocked}
              </p>
              <Button
                variant={seasonsDone ? "default" : "outline"}
                loading={saving}
                onClick={openReview}
              >
                {t.reviewActivate}
              </Button>
            </div>
          </Section>
        </div>
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
          onSave={(release) => dispatch(saveReleasePolicy(release))}
          onClose={() => setPolicy(null)}
        />
      )}

      {reviewOpen && (
        <ActivateDrawer
          working={saving}
          onClose={() => setReviewOpen(false)}
          onActivate={() => {
            setReviewOpen(false);
            activate();
          }}
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
