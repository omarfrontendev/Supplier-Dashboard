import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { fetchAllPages } from "./fetchAllPages";
import type {
  RatesEnvelope,
  ReleaseChangesData,
  ReleaseContextData,
  ReleaseOperation,
  ReleaseOverridesFilters,
  ReleaseOverridesListData,
  ReleaseScope,
  ReleaseTargetsData,
  SaveReleaseOverridesBody,
} from "./types";

/* releaseRevision is its own family: never shared with rates, sell controls, restrictions or contract version. */
export const releaseKeys = {
  all: (contractId: number | undefined) => ["rates-availability", "release", contractId],
};

/* ---------------------------------------------------------------- services */

export const fetchReleaseTargets = async (contractId: number) => {
  const response = await api.get<RatesEnvelope<ReleaseTargetsData>>(
    endpoints.ratesAndAvailability.releaseTargets(contractId),
  );
  return response.data.data;
};

export const fetchReleaseContext = async (contractId: number, scope: ReleaseScope) => {
  const response = await api.post<RatesEnvelope<ReleaseContextData>>(
    endpoints.ratesAndAvailability.releaseContext(contractId),
    scope,
  );
  return response.data.data;
};

export const fetchReleaseOverrides = (contractId: number, filters: ReleaseOverridesFilters = {}) =>
  fetchAllPages(async (page) => {
    const response = await api.get<RatesEnvelope<ReleaseOverridesListData>>(
      endpoints.ratesAndAvailability.releaseOverrides(contractId),
      { params: { page, limit: 100, ...filters } },
    );
    return { items: response.data.data.rules, meta: response.data.data.meta };
  });

export const previewReleaseOverrides = async (
  contractId: number,
  operations: ReleaseOperation[],
) => {
  const response = await api.post<RatesEnvelope<ReleaseChangesData>>(
    endpoints.ratesAndAvailability.releaseOverridesPreview(contractId),
    { operations },
  );
  return response.data.data;
};

export const saveReleaseOverrides = async (contractId: number, body: SaveReleaseOverridesBody) => {
  const response = await api.put<RatesEnvelope<ReleaseChangesData>>(
    endpoints.ratesAndAvailability.releaseOverrides(contractId),
    body,
  );
  return response.data.data;
};

/* ------------------------------------------------------------------- hooks */

export const useReleaseTargets = (contractId: number | undefined) => {
  return useQuery({
    queryKey: [...releaseKeys.all(contractId), "targets"],
    queryFn: () => fetchReleaseTargets(contractId!),
    enabled: contractId !== undefined,
  });
};

export const useReleaseContext = (contractId: number | undefined, scope: ReleaseScope | null) => {
  return useQuery({
    queryKey: [...releaseKeys.all(contractId), "context", scope],
    queryFn: () => fetchReleaseContext(contractId!, scope!),
    enabled: contractId !== undefined && scope !== null,
  });
};

export const useReleaseOverrides = (
  contractId: number | undefined,
  enabled = true,
  filters: ReleaseOverridesFilters = {},
) => {
  return useQuery({
    queryKey: [...releaseKeys.all(contractId), "list", filters],
    queryFn: () => fetchReleaseOverrides(contractId!, filters),
    enabled: contractId !== undefined && enabled,
  });
};

export const usePreviewReleaseOverrides = (contractId: number | undefined) => {
  return useMutation({
    mutationFn: (operations: ReleaseOperation[]) =>
      previewReleaseOverrides(contractId!, operations),
  });
};

/**
 * Saves exactly the reviewed operations with the releaseRevision their preview
 * (or the current context) returned. No silent retry: a 409 refreshes everything
 * and the caller must preview again and let the supplier review.
 */
export const useSaveReleaseOverrides = (contractId: number | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SaveReleaseOverridesBody) => saveReleaseOverrides(contractId!, body),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: releaseKeys.all(contractId) });
    },
  });
};
