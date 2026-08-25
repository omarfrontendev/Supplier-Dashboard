import { getAreas, getVendorAreas } from '@/api/modules/areas';
import type { AreaBody } from '@/types/area';
import { useQuery } from '@tanstack/react-query';

export const useAreas = (enabled = true) => {
  const query = useQuery<AreaBody[]>({
    queryKey: ["areas"],
    queryFn: () => getAreas(),
    enabled,
  });

  return {
    areas: query.data || [],
    ...query,
  };
};

export const useVendorAreas = (vendorId: number | null, enabled = true) => {

  const query = useQuery<AreaBody[]>({
    queryKey: ["vendor-areas", vendorId],
    queryFn: () => getVendorAreas(vendorId),
    enabled,
  });

  return {
    areas: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};