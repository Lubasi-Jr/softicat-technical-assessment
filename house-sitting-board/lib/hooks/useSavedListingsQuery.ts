import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateSavedListingInput,
  getSavedListingIds,
  getSavedListingsBySitterId,
  saveListing,
  unsaveListing,
} from "../services/savedListingService";

// Query Keys
export const savedListingKeys = {
  all: ["savedListings"] as const,
  bySitter: (sitterId: string) =>
    [...savedListingKeys.all, "sitter", sitterId] as const,
  ids: (sitterId: string) =>
    [...savedListingKeys.all, "ids", sitterId] as const,
};

// Hook to fetch all the saved listings by the sitter
export function useSavedListings(sitterId: string) {
  return useQuery({
    queryKey: savedListingKeys.bySitter(sitterId),
    queryFn: async () => {
      const { data, error } = await getSavedListingsBySitterId(sitterId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!sitterId,
  });
}

// Hook to get saved listing IDs: Used to quickly check if a listing is saved and conditionally render the heart filled icon
export function useSavedListingIds(sitterId: string) {
  return useQuery({
    queryKey: savedListingKeys.ids(sitterId),
    queryFn: async () => {
      const { data, error } = await getSavedListingIds(sitterId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!sitterId,
  });
}

// Hooks to mark listings as Saved OR Unsaved

export function useSaveListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSavedListingInput) => {
      const { data, error } = await saveListing(input);
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate saved listings queries
      queryClient.invalidateQueries({
        queryKey: savedListingKeys.bySitter(variables.sitter_id),
      });
      queryClient.invalidateQueries({
        queryKey: savedListingKeys.ids(variables.sitter_id),
      });
    },
  });
}

export function useUnsaveListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sitterId,
      listingId,
    }: {
      sitterId: string;
      listingId: string;
    }) => {
      const { success, error } = await unsaveListing(sitterId, listingId);
      if (error) throw error;
      return { success, sitterId, listingId };
    },
    onSuccess: (result) => {
      // Invalidate saved listings queries
      queryClient.invalidateQueries({
        queryKey: savedListingKeys.bySitter(result.sitterId),
      });
      queryClient.invalidateQueries({
        queryKey: savedListingKeys.ids(result.sitterId),
      });
    },
  });
}
