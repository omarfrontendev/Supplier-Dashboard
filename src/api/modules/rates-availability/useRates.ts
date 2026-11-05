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
  RateOperation,
  RateSelection,
  RateTargetsData,
  RatesEnvelope,
} from "./types";

const rateKeys = {
  targets: (contractId: number | undefined) => ["rates-availability", "rate-targets", contractId],
  context: (contractId: number | undefined) => ["rates-availability", "rates-context", contractId],
  overrides: (contractId: number | undefined) => ["rates-availability", "rate-overrides", contractId],
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
