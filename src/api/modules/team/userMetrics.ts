import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";
import { MetricsData, MetricsResponse } from "@/store/features/team/types";

const fetchMetrics = async (): Promise<MetricsData> => {
  const response = await api.get<MetricsResponse>(
    endpoints.team.getMetrics,
  );

  return response.data.data;
};

export const useMetrics = () => {
  return useQuery<MetricsData, Error>({
    queryKey: ["team-metrics"],
    queryFn: fetchMetrics,
  });
};