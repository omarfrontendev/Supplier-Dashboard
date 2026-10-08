import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import {
  HotelLinkingRequest,
  HotelRequest,
  RequestType,
  RequestsResponse,
  UseRequestsParams,
} from "./types";

type RequestItem = HotelRequest | HotelLinkingRequest;

const getRequestsEndpoint = (type: RequestType) => {
  switch (type) {
    case "all":
    case "hotel":
      return endpoints.requests.hotelRequests;

    case "access":
      return endpoints.requests.hotelLinkingRequests;

    case "room":
      return endpoints.requests.roomRequests;

    default:
      throw new Error(`Unsupported request type: ${type}`);
  }
};

const fetchRequests = async ({
  type,
  page = 1,
  limit = 20,
  status,
}: UseRequestsParams): Promise<RequestsResponse<RequestItem>["data"]> => {
  const response = await api.get<RequestsResponse<RequestItem>>(getRequestsEndpoint(type), {
    params: {
      page,
      limit,
      ...(status ? { status } : {}),
    },
  });

  return response.data.data;
};

export const useRequests = (params: UseRequestsParams) => {
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["requests", params],
    queryFn: () => fetchRequests(params),
  });

  return {
    requests: data?.requests ?? [],
    meta: data?.meta,
    isLoading,
    isFetching,
    isError: !!error,
    error,
    refetch,
  };
};
