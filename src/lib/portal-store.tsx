import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { hotels as seedHotels, supplyContracts as seedContracts, type HotelRelation, type SupplyContract } from "./demo-data";
import { bookingSeed, type Booking, type BookingTask } from "./booking-data";
import { changeRequestSeed, type ChangeRequest, type ChangeRequestState } from "./change-request-data";
import { activitySeed, teamSeed, type ActivityEntry, type TeamMember, type TeamRole } from "./team-data";

export interface ChangeEntry {
  value: string;
  file?: string | undefined;
}

export interface NewRoom {
  hotelId: string;
  name: string;
}

export interface ContractDraft {
  name: string;
  hotelId: string;
  startDate: string;
  endDate: string;
  confirmation: "instant" | "onRequest";
  roomNames: string[];
  rates: Record<string, { mealPlan: string; base: string; adult: string; child: string }>;
  childPolicy: "free" | "paid";
  cancellation: "flexible" | "moderate" | "nonRefundable";
  inventory: Record<string, string>;
  minimumStay: string;
  releaseDays: string;
  stopSale: boolean;
  published: boolean;
}

export interface RateCellOverride {
  rate?: number | undefined;
  inventory?: number | undefined;
  minStay?: number | undefined;
  stopSale?: boolean | undefined;
  cutOff?: number | undefined;
  childrenRate?: number | undefined;
  restriction?: "open" | "closed-arrival" | "closed-departure" | undefined;
}

interface ResolvedRateCell extends RateCellOverride {
  rate: number;
  inventory: number;
  minStay: number;
  stopSale: boolean;
}

export function resolveRateCell(
  base: ResolvedRateCell,
  published?: RateCellOverride,
  draft?: RateCellOverride
): ResolvedRateCell {
  return {
    ...base,
    ...published,
    ...draft,
    rate: draft?.rate ?? published?.rate ?? base.rate,
    inventory: draft?.inventory ?? published?.inventory ?? base.inventory,
    minStay: draft?.minStay ?? published?.minStay ?? base.minStay,
    stopSale: draft?.stopSale ?? published?.stopSale ?? base.stopSale,
  };
}

export const initialContractDraft: ContractDraft = {
  name: "Ramadan 2027",
  hotelId: "HTL-1048",
  startDate: "2027-03-01",
  endDate: "2027-03-30",
  confirmation: "instant",
  roomNames: ["Double", "Triple", "Quad"],
  rates: {
    Double: { mealPlan: "breakfast", base: "420", adult: "120", child: "65" },
    Triple: { mealPlan: "breakfast", base: "560", adult: "120", child: "65" },
    Quad: { mealPlan: "breakfast", base: "690", adult: "120", child: "65" },
  },
  childPolicy: "free",
  cancellation: "moderate",
  inventory: { Double: "6", Triple: "8", Quad: "10" },
  minimumStay: "2",
  releaseDays: "3",
  stopSale: false,
  published: false,
};

interface PortalStateValue {
  /** Selected company fields for the change request, in selection order. */
  selectedFields: string[];
  toggleField: (id: string) => void;
  clearFields: () => void;
  entries: Record<string, ChangeEntry>;
  setEntry: (id: string, entry: ChangeEntry) => void;
  requestSubmitted: boolean;
  submitRequest: () => void;
  /** Supplier agreement: the version in force and who may accept the next one. */
  agreementVersion: "1.3" | "1.4";
  agreementSentToOwner: boolean;
  viewerIsOwner: boolean;
  setViewerIsOwner: (value: boolean) => void;
  acceptAgreement: () => void;
  sendAgreementToOwner: () => void;
  /** Hotel relationship state, keyed by hotel id. */
  relations: Record<string, HotelRelation>;
  requestAccess: (ids: string[]) => void;
  /** OV 02.5B - requests pulled back, and the hotels they freed. */
  withdrawnRequests: string[];
  withdrawRequest: (id: string, hotelId?: string) => void;
  /** A missing hotel sent to Hoteliana for approval. */
  newHotel: string | null;
  submitHotel: (name: string) => void;
  /** Rooms sent to Hoteliana for verification. */
  newRooms: NewRoom[];
  submitRoom: (room: NewRoom) => void;
  contractDraft: ContractDraft;
  updateContractDraft: (patch: Partial<ContractDraft>) => void;
  resetContractDraft: () => void;
  contracts: SupplyContract[];
  setContractState: (id: string, state: SupplyContract["state"]) => void;
  deleteContract: (id: string) => void;
  addContract: (contract: SupplyContract) => void;
  rateOverrides: Record<string, RateCellOverride>;
  draftRateOverrides: Record<string, RateCellOverride>;
  saveRateDraft: (patch: Record<string, RateCellOverride>) => void;
  publishRateOverrides: () => void;
  discardRateOverrides: () => void;
  bookings: Booking[];
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  confirmBooking: (id: string, confirmationNumber?: string) => void;
  rejectBooking: (id: string, reason: string) => void;
  setBookingTask: (id: string, task: BookingTask) => void;
  changeRequests: ChangeRequest[];
  updateChangeRequest: (id: string, patch: Partial<ChangeRequest>) => void;
  decideChangeRequest: (id: string, state: ChangeRequestState, charge?: number, note?: string, proposedRate?: number) => void;
  teamMembers: TeamMember[];
  activityEntries: ActivityEntry[];
  inviteMember: (member: Pick<TeamMember, "name" | "nameAr" | "email" | "role">) => void;
  updateMemberRole: (id: string, role: TeamRole, auditorReach?: string[]) => void;
  setMemberStatus: (id: string, status: TeamMember["status"]) => void;
  transferOwnership: (id: string) => void;
  addActivity: (entry: ActivityEntry) => void;
}

const PortalContext = createContext<PortalStateValue | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [entries, setEntries] = useState<Record<string, ChangeEntry>>({});
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [agreementVersion, setAgreementVersion] = useState<"1.3" | "1.4">("1.3");
  const [agreementSentToOwner, setAgreementSentToOwner] = useState(false);
  const [viewerIsOwner, setViewerIsOwner] = useState(true);
  const [newHotel, setNewHotel] = useState<string | null>(null);
  const [newRooms, setNewRooms] = useState<NewRoom[]>([]);
  const [contractDraft, setContractDraft] = useState<ContractDraft>(initialContractDraft);
  const [contracts, setContracts] = useState<SupplyContract[]>(seedContracts);
  const [rateOverrides, setRateOverrides] = useState<Record<string, RateCellOverride>>({});
  const [draftRateOverrides, setDraftRateOverrides] = useState<Record<string, RateCellOverride>>({});
  const [bookings, setBookings] = useState<Booking[]>(bookingSeed);
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>(changeRequestSeed);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(teamSeed);
  const [activityEntries, setActivityEntries] = useState<ActivityEntry[]>(activitySeed);
  const [relations, setRelations] = useState<Record<string, HotelRelation>>(() =>
    Object.fromEntries(seedHotels.map((h) => [h.id, h.relation]))
  );
  const [withdrawnRequests, setWithdrawnRequests] = useState<string[]>([]);

  const toggleField = useCallback((id: string) => {
    setSelectedFields((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  const clearFields = useCallback(() => {
    setSelectedFields([]);
    setEntries({});
  }, []);

  const setEntry = useCallback((id: string, entry: ChangeEntry) => {
    setEntries((prev) => ({ ...prev, [id]: entry }));
  }, []);

  const submitRequest = useCallback(() => setRequestSubmitted(true), []);

  const requestAccess = useCallback((ids: string[]) => {
    setRelations((prev) => {
      const next = { ...prev };
      for (const id of ids) next[id] = "requested";
      return next;
    });
  }, []);

  /*
   * "Withdrawing cancels the review. You can request the same hotel
   * again later" - so the hotel goes back to available in the same
   * breath, or the library would still refuse to let you ask.
   */
  const withdrawRequest = useCallback((id: string, hotelId?: string) => {
    setWithdrawnRequests((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
    if (!hotelId) return;
    setRelations((prev) => ({ ...prev, [hotelId]: "available" }));
  }, []);

  const submitHotel = useCallback((name: string) => setNewHotel(name), []);

  const submitRoom = useCallback((room: NewRoom) => {
    setNewRooms((prev) => [...prev, room]);
  }, []);

  const updateContractDraft = useCallback((patch: Partial<ContractDraft>) => {
    setContractDraft((current) => ({ ...current, ...patch }));
  }, []);
  const resetContractDraft = useCallback(() => setContractDraft(initialContractDraft), []);
  const setContractState = useCallback((id: string, state: SupplyContract["state"]) => {
    setContracts((current) => current.map((contract) => contract.id === id ? { ...contract, state } : contract));
  }, []);
  const deleteContract = useCallback((id: string) => setContracts((current) => current.filter((contract) => contract.id !== id)), []);
  const addContract = useCallback((contract: SupplyContract) => setContracts((current) => [contract, ...current.filter((item) => item.id !== contract.id)]), []);
  const saveRateDraft = useCallback((patch: Record<string, RateCellOverride>) => {
    setDraftRateOverrides((current) => ({ ...current, ...patch }));
  }, []);
  const publishRateOverrides = useCallback(() => {
    setRateOverrides((current) => ({ ...current, ...draftRateOverrides }));
    setDraftRateOverrides({});
  }, [draftRateOverrides]);
  const discardRateOverrides = useCallback(() => setDraftRateOverrides({}), []);
  const updateBooking = useCallback((id: string, patch: Partial<Booking>) => {
    setBookings((current) => current.map((booking) => booking.id === id ? { ...booking, ...patch } : booking));
  }, []);
  const confirmBooking = useCallback((id: string, confirmationNumber?: string) => {
    setBookings((current) => current.map((booking) => {
      if (booking.id !== id) return booking;
      const next: Booking = { ...booking, status: "confirmed", task: confirmationNumber ? null : "reference" };
      if (confirmationNumber) next.confirmationNumber = confirmationNumber;
      return next;
    }));
  }, []);
  const rejectBooking = useCallback((id: string, reason: string) => {
    setBookings((current) => current.map((booking) => booking.id === id ? { ...booking, status: "rejected", task: null, reason } : booking));
  }, []);
  const setBookingTask = useCallback((id: string, task: BookingTask) => updateBooking(id, { task }), [updateBooking]);
  const updateChangeRequest = useCallback((id: string, patch: Partial<ChangeRequest>) => {
    setChangeRequests((current) => current.map((request) => request.id === id ? { ...request, ...patch } : request));
  }, []);
  const decideChangeRequest = useCallback((id: string, state: ChangeRequestState, charge?: number, note?: string, proposedRate?: number) => {
    setChangeRequests((current) => current.map((request) => {
      if (request.id !== id) return request;
      const next: ChangeRequest = { ...request, state };
      if (charge !== undefined) next.charge = charge;
      if (note) next.answerNote = note;
      if (proposedRate !== undefined) {
        next.proposedRate = proposedRate;
        next.proposedValue = request.currentValue + proposedRate;
      }
      return next;
    }));
    const request = changeRequests.find((item) => item.id === id);
    if (!request) return;
    if (state === "cancelled") {
      updateBooking(request.bookingId, { status: "cancelled", task: null });
    } else if (state === "approved") {
      const patch: Partial<Booking> = { task: null };
      if (request.kind === "nonCommercial" && request.newGuest) {
        patch.guest = request.newGuest;
        patch.guestAr = request.newGuest;
      }
      if (request.proposedValue) patch.rate = request.proposedValue;
      updateBooking(request.bookingId, patch);
    }
  }, [changeRequests, updateBooking]);
  const addActivity = useCallback((entry: ActivityEntry) => setActivityEntries((current) => [entry, ...current]), []);
  const inviteMember = useCallback((member: Pick<TeamMember, "name" | "nameAr" | "email" | "role">) => {
    setTeamMembers((current) => {
      const invited: TeamMember = { ...member, id:`USR-${Date.now()}`, status:"invited", lastSeen:"never · expires in 7 days", lastSeenAr:"لم يدخل · تنتهي خلال ٧ أيام", addedBy:"You · today", reach:["nothing until the invitation is accepted"], reachAr:["لا شيء حتى تُقبل الدعوة"] };
      if (member.role === "auditor") invited.auditorReach = [];
      return [...current.filter((item) => item.email !== member.email), invited];
    });
  }, []);
  const updateMemberRole = useCallback((id: string, role: TeamRole, auditorReach?: string[]) => {
    setTeamMembers((current) => current.map((member) => {
      if (member.id !== id) return member;
      const { auditorReach: _previousReach, ...base } = member;
      return role === "auditor" ? { ...base, role, auditorReach: auditorReach ?? [] } : { ...base, role };
    }));
  }, []);
  const setMemberStatus = useCallback((id: string, status: TeamMember["status"]) => {
    setTeamMembers((current) => current.map((member) => member.id === id ? { ...member, status } : member));
  }, []);
  const transferOwnership = useCallback((id: string) => {
    setTeamMembers((current) => current.map((member) => member.isCurrent ? { ...member, role:"admin", isCurrent:false } : member.id === id ? { ...member, role:"owner" } : member));
  }, []);

  const acceptAgreement = useCallback(() => {
    setAgreementVersion("1.4");
    setAgreementSentToOwner(false);
  }, []);
  const sendAgreementToOwner = useCallback(() => setAgreementSentToOwner(true), []);

  const value = useMemo(
    () => ({
      selectedFields,
      toggleField,
      clearFields,
      entries,
      setEntry,
      requestSubmitted,
      submitRequest,
      agreementVersion,
      agreementSentToOwner,
      viewerIsOwner,
      setViewerIsOwner,
      acceptAgreement,
      sendAgreementToOwner,
      relations,
      withdrawnRequests,
      withdrawRequest,
      requestAccess,
      newHotel,
      submitHotel,
      newRooms,
      submitRoom,
      contractDraft,
      updateContractDraft,
      resetContractDraft,
      contracts,
      setContractState,
      deleteContract,
      addContract,
      rateOverrides,
      draftRateOverrides,
      saveRateDraft,
      publishRateOverrides,
      discardRateOverrides,
      bookings,
      updateBooking,
      confirmBooking,
      rejectBooking,
      setBookingTask,
      changeRequests,
      updateChangeRequest,
      decideChangeRequest,
      teamMembers,
      activityEntries,
      inviteMember,
      updateMemberRole,
      setMemberStatus,
      transferOwnership,
      addActivity,
    }),
    [
      selectedFields,
      toggleField,
      clearFields,
      entries,
      setEntry,
      requestSubmitted,
      submitRequest,
      agreementVersion,
      agreementSentToOwner,
      viewerIsOwner,
      acceptAgreement,
      sendAgreementToOwner,
      relations,
      withdrawnRequests,
      withdrawRequest,
      requestAccess,
      newHotel,
      submitHotel,
      newRooms,
      submitRoom,
      contractDraft,
      updateContractDraft,
      resetContractDraft,
      contracts,
      setContractState,
      deleteContract,
      addContract,
      rateOverrides,
      draftRateOverrides,
      saveRateDraft,
      publishRateOverrides,
      discardRateOverrides,
      bookings,
      updateBooking,
      confirmBooking,
      rejectBooking,
      setBookingTask,
      changeRequests,
      updateChangeRequest,
      decideChangeRequest,
      teamMembers,
      activityEntries,
      inviteMember,
      updateMemberRole,
      setMemberStatus,
      transferOwnership,
      addActivity,
    ]
  );

  return (
    <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error("usePortal must be used within a PortalProvider");
  }
  return context;
}
