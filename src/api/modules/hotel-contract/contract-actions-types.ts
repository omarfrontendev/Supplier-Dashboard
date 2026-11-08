import type { SupplierHotelContract } from "./types";

export interface ContractLifecycleInput {
  id: number;
  expectedVersion: number;
  reason?: string;
}

export interface CopyHotelContractInput {
  id: number;
  startDate: string;
  endDate: string;
  name?: string;
  reason?: string;
}

export interface CopyHotelContractResult extends SupplierHotelContract {
  copy: {
    sourceContractId: number;
    shiftedByDays: number;
    skippedRestrictionIds: number[];
  };
}

export interface DeleteHotelContractResult {
  id: number;
  deletedAt: string;
  version: number;
}

export interface ContractStopSalePreviewInput {
  id: number;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface ContractStopSaleInput extends ContractStopSalePreviewInput {
  expectedRevision: number;
}

export interface ContractStopSalePreview {
  startDate: string;
  endDate: string;
  timezone: string;
  nightCount: number;
  variationCount: number;
  cellCount: number;
  replacedControlCounts: {
    stopSale: number;
    onRequest: number;
  };
  sellControlsRevision: number;
  reason: string | null;
}

export type ContractActivityAction =
  | "created"
  | "updated"
  | "copied_to_new_period"
  | "created_by_copy"
  | "status_changed";

export interface ContractActivityChange {
  field: string;
  from: unknown;
  to: unknown;
}

export interface ContractActivity {
  id: number;
  action: ContractActivityAction;
  actor: { id: number; username: string } | null;
  changes: ContractActivityChange[];
  reason: string | null;
  relatedContractId: number | null;
  createdAt: string;
}

export interface ContractActivityData {
  activities: ContractActivity[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  emptyState: "no_activity" | null;
}

export interface ContractActionError {
  message?: string | string[];
  data?: {
    code?: string;
    conflicts?: {
      id: number;
      name: string;
      startDate: string;
      endDate: string;
      status: string;
    }[];
  };
}
