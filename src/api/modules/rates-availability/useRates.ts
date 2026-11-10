import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { fetchAllPages } from "./fetchAllPages";
import type {
  RateChangesData,
  RatesContractDetail,
  RateOverridesData,
  SupplementsContextData,
  RateContextData,
  RateBatch,
  RateOperation,
  RateSelection,
  RateTargetsData,
  RatesEnvelope,
  SaveRateOverridesBody,
} from "./types";

const rateKeys = {
  targets: (contractId: number | undefined) => ["rates-availability", "rate-targets", contractId],
  context: (contractId: number | undefined) => ["rates-availability", "rates-context", contractId],
  overrides: (contractId: number | undefined) => ["rates-availability", "rate-overrides", contractId],
};

/* ---------------------------------------------------------------- services */

/** Guide p.3 - validates and reviews the operations; nothing is saved. */
export const rateBatchBody = (batch: RateOperation[] | RateBatch) =>
  Array.isArray(batch)
    ? { operations: batch }
    : {
        ...(batch.operations.length ? { operations: batch.operations } : {}),
        ...(batch.supplementOperations.length
          ? { supplementOperations: batch.supplementOperations }
          : {}),
      };

export const previewRateOverrides = async (
  contractId: number,
  batch: RateOperation[] | RateBatch,
) => {
  const response = await api.post<RatesEnvelope<RateChangesData>>(
    endpoints.ratesAndAvailability.rateOverridesPreview(contractId),
    rateBatchBody(batch),
  );
  return response.data.data;
};

/** Guide p.3 - atomically saves the reviewed operations; the body is sent as given. */
export const saveRateOverrides = async (contractId: number, body: SaveRateOverridesBody) => {
  const response = await api.put<RatesEnvelope<RateChangesData>>(
    endpoints.ratesAndAvailability.rateOverrides(contractId),
    body,
  );
  return response.data.data;
};

export const useRateOverrides = (contractId: number | undefined, enabled = true) => {
  return useQuery({
    queryKey: rateKeys.overrides(contractId),
    queryFn: () =>
      fetchAllPages(async (page) => {
        const response = await api.get<RatesEnvelope<RateOverridesData>>(
          endpoints.ratesAndAvailability.rateOverrides(contractId!),
          { params: { page, limit: 100 } },
        );
        return { items: response.data.data.overrides, meta: response.data.data.meta };
      }),
    enabled: contractId !== undefined && enabled,
  });
};

export const useRatesContractDetail = (contractId: number | undefined) => {
  return useQuery({
    queryKey: ["rates-availability", "contract-detail", contractId],
    queryFn: async () => {
      const response = await api.get<RatesEnvelope<RatesContractDetail>>(
        endpoints.ratesAndAvailability.contractDetail(contractId!),
      );
      return response.data.data;
    },
    enabled: contractId !== undefined,
  });
};

export const useRateTargets = (contractId: number | undefined) => {
  return useQuery({
    queryKey: rateKeys.targets(contractId),
    queryFn: async () => {
      const response = await api.get<RatesEnvelope<RateTargetsData>>(
        endpoints.ratesAndAvailability.rateTargets(contractId!),
      );
      return response.data.data;
    },
    enabled: contractId !== undefined,
  });
};

export const useRatesContext = (contractId: number | undefined, selection: RateSelection | null) => {
  return useQuery({
    queryKey: [...rateKeys.context(contractId), selection],
    queryFn: async () => {
      const response = await api.post<RatesEnvelope<RateContextData>>(
        endpoints.ratesAndAvailability.ratesContext(contractId!),
        selection,
      );
      return response.data.data;
    },
    enabled: contractId !== undefined && selection !== null && selection.targets.length > 0,
  });
};

export const useSupplementsContext = (
  contractId: number | undefined,
  selection: RateSelection | null,
) => {
  return useQuery({
    queryKey: [...rateKeys.context(contractId), "supplements", selection],
    queryFn: async () => {
      const response = await api.post<RatesEnvelope<SupplementsContextData>>(
        endpoints.ratesAndAvailability.supplementsContext(contractId!),
        selection,
      );
      return response.data.data;
    },
    enabled: contractId !== undefined && selection !== null && selection.targets.length > 0,
  });
};

/**
 * Preview only (guide p.3): returns ratesRevision, nights[] with
 * proposedAmount/proposedSource, affectedCount, replacedCount and removedCount.
 * Keep the operations sent here and the returned ratesRevision for the save.
 */
export const usePreviewRateOverrides = (contractId: number | undefined) => {
  return useMutation({
    mutationFn: (batch: RateOperation[] | RateBatch) => previewRateOverrides(contractId!, batch),
  });
};

/**
 * Saves exactly the reviewed operations with the ratesRevision their preview
 * returned. Never previews internally and never retries: a 409 refreshes
 * everything and the caller must preview again and let the supplier review.
 */
export const useSaveReviewedRateOverrides = (contractId: number | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SaveRateOverridesBody) => saveRateOverrides(contractId!, body),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: rateKeys.context(contractId) });
      void queryClient.invalidateQueries({ queryKey: rateKeys.targets(contractId) });
      void queryClient.invalidateQueries({ queryKey: rateKeys.overrides(contractId) });
    },
  });
};

/**
 * Legacy: previews and saves in one step, with no supplier review in between.
 * Kept unchanged for current callers until the UI moves to
 * usePreviewRateOverrides + useSaveReviewedRateOverrides.
 */
export const useSaveRateOverrides = (contractId: number | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (operations: RateOperation[]) => {
      const preview = await api.post<RatesEnvelope<RateChangesData>>(
        endpoints.ratesAndAvailability.rateOverridesPreview(contractId!),
        { operations },
      );
      const response = await api.put<RatesEnvelope<RateChangesData>>(
        endpoints.ratesAndAvailability.rateOverrides(contractId!),
        { expectedRevision: preview.data.data.ratesRevision, operations },
      );
      return response.data;
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: rateKeys.context(contractId) });
      void queryClient.invalidateQueries({ queryKey: rateKeys.targets(contractId) });
      void queryClient.invalidateQueries({ queryKey: rateKeys.overrides(contractId) });
    },
  });
};
