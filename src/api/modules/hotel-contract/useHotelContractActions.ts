import type { AxiosError } from "axios";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type {
  ContractActionError,
  ContractActivityData,
  ContractLifecycleInput,
  ContractStopSaleInput,
  ContractStopSalePreview,
  ContractStopSalePreviewInput,
  CopyHotelContractInput,
  CopyHotelContractResult,
  DeleteHotelContractResult,
} from "./contract-actions-types";
import type { SupplierHotelContract } from "./types";
import { hotelContractKey } from "./useHotelContract";

interface Envelope<T> {
  status: string;
  message: string;
  data: T;
}

type ActionError = AxiosError<ContractActionError>;

const optionalReason = (reason?: string) => {
  const trimmed = reason?.trim();
  return trimmed ? { reason: trimmed } : {};
};

const lifecycleBody = ({ expectedVersion, reason }: ContractLifecycleInput) => ({
  expectedVersion,
  ...optionalReason(reason),
});

const useContractMutation = <TInput extends { id: number }, TResult>(
  mutationFn: (input: TInput) => Promise<TResult>,
) => {
  const queryClient = useQueryClient();

  const refresh = (id: number) => {
    void queryClient.invalidateQueries({ queryKey: hotelContractKey(id), exact: true });
    void queryClient.invalidateQueries({ queryKey: ["hotel-contracts"], exact: false });
    void queryClient.invalidateQueries({ queryKey: hotelContractActivityKey(id), exact: false });
  };

  return useMutation<TResult, ActionError, TInput>({
    mutationFn,
    retry: false,
    onSuccess: (_result, { id }) => refresh(id),
    onError: (error, { id }) => {
      if (error.response?.status === 409) refresh(id);
    },
  });
};

export const usePauseHotelContract = () =>
  useContractMutation<ContractLifecycleInput, SupplierHotelContract>(async (input) => {
    const { data } = await api.post<Envelope<SupplierHotelContract>>(
      endpoints.supplierHotelContracts.pause(input.id),
      lifecycleBody(input),
    );
    return data.data;
  });

export const useResumeHotelContract = () =>
  useContractMutation<ContractLifecycleInput, SupplierHotelContract>(async (input) => {
    const { data } = await api.post<Envelope<SupplierHotelContract>>(
      endpoints.supplierHotelContracts.resume(input.id),
      lifecycleBody(input),
    );
    return data.data;
  });

export const useTerminateHotelContract = () =>
  useContractMutation<ContractLifecycleInput, SupplierHotelContract>(async (input) => {
    const { data } = await api.post<Envelope<SupplierHotelContract>>(
      endpoints.supplierHotelContracts.terminate(input.id),
      lifecycleBody(input),
    );
    return data.data;
  });

export const useDeleteHotelContract = () =>
  useContractMutation<ContractLifecycleInput, DeleteHotelContractResult>(async (input) => {
    const { data } = await api.delete<Envelope<DeleteHotelContractResult>>(
      endpoints.supplierHotelContracts.byId(input.id),
      { data: lifecycleBody(input) },
    );
    return data.data;
  });

export const useCopyHotelContract = () =>
  useContractMutation<CopyHotelContractInput, CopyHotelContractResult>(
    async ({ id, startDate, endDate, name, reason }) => {
      const trimmedName = name?.trim();
      const { data } = await api.post<Envelope<CopyHotelContractResult>>(
        endpoints.supplierHotelContracts.copy(id),
        {
          startDate,
          endDate,
          ...(trimmedName ? { name: trimmedName } : {}),
          ...optionalReason(reason),
        },
      );
      return data.data;
    },
  );

export const usePreviewContractStopSale = () =>
  useMutation<ContractStopSalePreview, ActionError, ContractStopSalePreviewInput>({
    mutationFn: async ({ id, startDate, endDate, reason }) => {
      const { data } = await api.post<Envelope<ContractStopSalePreview>>(
        endpoints.supplierHotelContracts.stopSalePreview(id),
        { startDate, endDate, ...optionalReason(reason) },
      );
      return data.data;
    },
    retry: false,
  });

export const useSaveContractStopSale = () =>
  useContractMutation<ContractStopSaleInput, ContractStopSalePreview>(
    async ({ id, startDate, endDate, expectedRevision, reason }) => {
      const { data } = await api.post<Envelope<ContractStopSalePreview>>(
        endpoints.supplierHotelContracts.stopSale(id),
        { startDate, endDate, expectedRevision, ...optionalReason(reason) },
      );
      return data.data;
    },
  );

export const hotelContractActivityKey = (id: number, page?: number) =>
  page === undefined ? ["hotel-contract-activity", id] : ["hotel-contract-activity", id, page];

export const useHotelContractActivity = (id: number, page: number, limit = 20) =>
  useQuery({
    queryKey: hotelContractActivityKey(id, page),
    queryFn: async () => {
      const { data } = await api.get<Envelope<ContractActivityData>>(
        endpoints.supplierHotelContracts.activity(id),
        { params: { page, limit } },
      );
      return data.data;
    },
    placeholderData: keepPreviousData,
  });
