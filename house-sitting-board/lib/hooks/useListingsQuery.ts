// lib/hooks/useListingsQuery.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createListing,
  CreateListingInput,
  deleteListing,
  getActiveListings,
  getListingById,
  getListingsBySeekerId,
  updateListing,
  UpdateListingInput,
} from "../services/listingService";

// Query Keys
export const listingKeys = {
  all: ["listings"] as const,
  bySeeker: (seekerId: string) =>
    [...listingKeys.all, "seeker", seekerId] as const,
  detail: (id: string) => [...listingKeys.all, "detail", id] as const,
  active: () => [...listingKeys.all, "active"] as const,
};

/**
 * Hook to fetch all listings for a service seeker
 */
export function useListings(seekerId: string) {
  return useQuery({
    queryKey: listingKeys.bySeeker(seekerId),
    queryFn: async () => {
      const { data, error } = await getListingsBySeekerId(seekerId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!seekerId,
  });
}

/**
 * Hook to fetch a single listing by ID
 */
export function useListing(listingId: string) {
  return useQuery({
    queryKey: listingKeys.detail(listingId),
    queryFn: async () => {
      const { data, error } = await getListingById(listingId);
      if (error) throw error;
      return data;
    },
    enabled: !!listingId,
  });
}

/**
 * Hook to fetch all active listings (for sitters)
 */
export function useActiveListings() {
  return useQuery({
    queryKey: listingKeys.active(),
    queryFn: async () => {
      const { data, error } = await getActiveListings();
      if (error) throw error;
      return data || [];
    },
  });
}

/**
 * Hook to create a new listing
 */
export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateListingInput) => {
      const { data, error } = await createListing(input);
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate the seeker's listings to refetch
      queryClient.invalidateQueries({
        queryKey: listingKeys.bySeeker(variables.service_seeker_id),
      });
      // Invalidate active listings for sitters
      queryClient.invalidateQueries({
        queryKey: listingKeys.active(),
      });
    },
  });
}

/**
 * Hook to update an existing listing
 */
export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listingId,
      input,
    }: {
      listingId: string;
      input: UpdateListingInput;
    }) => {
      const { data, error } = await updateListing(listingId, input);
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        // Update the specific listing in cache
        queryClient.setQueryData(listingKeys.detail(data.listing_id), data);

        // Invalidate the seeker's listings
        queryClient.invalidateQueries({
          queryKey: listingKeys.bySeeker(data.service_seeker_id),
        });

        // Invalidate active listings
        queryClient.invalidateQueries({
          queryKey: listingKeys.active(),
        });
      }
    },
  });
}

/**
 * Hook to delete a listing
 */
export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listingId,
      seekerId,
    }: {
      listingId: string;
      seekerId: string;
    }) => {
      const { success, error } = await deleteListing(listingId);
      if (error) throw error;
      return { success, seekerId, listingId };
    },
    onSuccess: (result) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: listingKeys.detail(result.listingId),
      });

      // Invalidate the seeker's listings
      queryClient.invalidateQueries({
        queryKey: listingKeys.bySeeker(result.seekerId),
      });

      // Invalidate active listings
      queryClient.invalidateQueries({
        queryKey: listingKeys.active(),
      });
    },
  });
}

export function useActiveListingsWithFilter(
  listingType?: "PET_SITTING" | "HOUSE_SITTING" | "BOTH" | null
) {
  return useQuery({
    queryKey: listingType
      ? [...listingKeys.active(), "filter", listingType]
      : listingKeys.active(),
    queryFn: async () => {
      const { data, error } = await getActiveListings();
      if (error) throw error;

      if (!data) return [];

      // Filter by type if specified
      if (listingType) {
        return data.filter((listing) => listing.listing_type === listingType);
      }

      return data;
    },
  });
}
