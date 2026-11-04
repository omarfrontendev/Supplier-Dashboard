import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { fetchAllPages } from "./fetchAllPages";
import type {
  RatesEnvelope,
  SellControlChangesData,
  SellControlOperation,
  SellControlScope,
  SellControlTargetsData,
  SellControlsContextData,
  SellControlsListData,
} from "./types";

const sellKeys = {
  all: (contractId: number | undefined) => ["rates-availability", "sell-controls", contractId],
};

export const useSellControlTargets = (contractId: number | undefined) => {
  return useQuery({
    queryKey: [...sellKeys.all(contractId), "targets"],
    queryFn: async () => {
      const response = await api.get<RatesEnvelope<SellControlTargetsData>>(
        endpoints.ratesAndAvailability.sellControlTargets(contractId!),
      );
      return response.data.data;
    },
    enabled: contractId !== undefined,
  });
};

export const useSellControlsContext = (
  contractId: number | undefined,
  scope: SellControlScope | null,
) => {
  return useQuery({
    queryKey: [...sellKeys.all(contractId), "context", scope],
    queryFn: async () => {
      const response = await api.post<RatesEnvelope<SellControlsContextData>>(
        endpoints.ratesAndAvailability.sellControlsContext(contractId!),
        scope,
      );
      return response.data.data;
    },
    enabled: contractId !== undefined && scope !== null,
  });
};

export const useSellControls = (contractId: number | undefined, enabled = true) => {
  return useQuery({
    queryKey: [...sellKeys.all(contractId), "list"],
    queryFn: () =>
      fetchAllPages(async (page) => {
        const response = await api.get<RatesEnvelope<SellControlsListData>>(
          endpoints.ratesAndAvailability.sellControls(contractId!),
          { params: { page, limit: 100 } },
        );
        return { items: response.data.data.rules, meta: response.data.data.meta };
      }),
    enabled: contractId !== undefined && enabled,
  });
};

export const usePreviewSellControls = (contractId: number | undefined) => {
  return useMutation({
    mutationFn: async (operations: SellControlOperation[]) => {
      const response = await api.post<RatesEnvelope<SellControlChangesData>>(
        endpoints.ratesAndAvailability.sellControlsPreview(contractId!),
        { operations },
      );
      return response.data.data;
    },
  });
};

export const useSaveSellControls = (contractId: number | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (operations: SellControlOperation[]) => {
      const preview = await api.post<RatesEnvelope<SellControlChangesData>>(
        endpoints.ratesAndAvailability.sellControlsPreview(contractId!),
        { operations },
      );
      const response = await api.put<RatesEnvelope<SellControlChangesData>>(
        endpoints.ratesAndAvailability.sellControls(contractId!),
        { expectedRevision: preview.data.data.sellControlsRevision, operations },
      );
      return response.data.data;
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: sellKeys.all(contractId) });
    },
  });
};
