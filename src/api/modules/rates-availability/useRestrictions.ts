import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { fetchAllPages } from "./fetchAllPages";
import type {
  RatesEnvelope,
  RestrictionChangesData,
  RestrictionOperation,
  RestrictionOverridesListData,
  RestrictionScope,
  RestrictionTargetsData,
  RestrictionsContextData,
  SaveRestrictionOverridesBody,
} from "./types";

/* restrictionsRevision is its own family: never shared with rates, sell controls or contract version. */
export const restrictionKeys = {
  all: (contractId: number | undefined) => ["rates-availability", "restrictions", contractId],
};

/* ---------------------------------------------------------------- services */

export const fetchRestrictionTargets = async (contractId: number) => {
  const response = await api.get<RatesEnvelope<RestrictionTargetsData>>(
    endpoints.ratesAndAvailability.restrictionTargets(contractId),
  );
  return response.data.data;
};

export const fetchRestrictionsContext = async (contractId: number, scope: RestrictionScope) => {
  const response = await api.post<RatesEnvelope<RestrictionsContextData>>(
    endpoints.ratesAndAvailability.restrictionsContext(contractId),
    scope,
  );
  return response.data.data;
};

export const fetchRestrictionOverrides = (contractId: number) =>
  fetchAllPages(async (page) => {
    const response = await api.get<RatesEnvelope<RestrictionOverridesListData>>(
      endpoints.ratesAndAvailability.restrictionOverrides(contractId),
      { params: { page, limit: 100 } },
    );
    return { items: response.data.data.rules, meta: response.data.data.meta };
  });

export const previewRestrictionOverrides = async (
  contractId: number,
  operations: RestrictionOperation[],
) => {
  const response = await api.post<RatesEnvelope<RestrictionChangesData>>(
    endpoints.ratesAndAvailability.restrictionOverridesPreview(contractId),
    { operations },
  );
  return response.data.data;
};

export const saveRestrictionOverrides = async (
  contractId: number,
  body: SaveRestrictionOverridesBody,
) => {
  const response = await api.put<RatesEnvelope<RestrictionChangesData>>(
    endpoints.ratesAndAvailability.restrictionOverrides(contractId),
    body,
  );
  return response.data.data;
};

/* ------------------------------------------------------------------- hooks */

export const useRestrictionTargets = (contractId: number | undefined) => {
  return useQuery({
    queryKey: [...restrictionKeys.all(contractId), "targets"],
    queryFn: () => fetchRestrictionTargets(contractId!),
    enabled: contractId !== undefined,
  });
};

export const useRestrictionsContext = (
  contractId: number | undefined,
  scope: RestrictionScope | null,
) => {
  return useQuery({
    queryKey: [...restrictionKeys.all(contractId), "context", scope],
    queryFn: () => fetchRestrictionsContext(contractId!, scope!),
    enabled: contractId !== undefined && scope !== null,
  });
};

export const useRestrictionOverrides = (contractId: number | undefined, enabled = true) => {
  return useQuery({
    queryKey: [...restrictionKeys.all(contractId), "list"],
    queryFn: () => fetchRestrictionOverrides(contractId!),
    enabled: contractId !== undefined && enabled,
  });
};

export const usePreviewRestrictionOverrides = (contractId: number | undefined) => {
  return useMutation({
    mutationFn: (operations: RestrictionOperation[]) =>
      previewRestrictionOverrides(contractId!, operations),
  });
};

/**
 * Saves exactly the reviewed operations with the revision their preview returned.
 * No silent retry: a 409 refreshes everything and the caller must preview again.
 */
export const useSaveRestrictionOverrides = (contractId: number | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SaveRestrictionOverridesBody) => saveRestrictionOverrides(contractId!, body),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: restrictionKeys.all(contractId) });
    },
  });
};
