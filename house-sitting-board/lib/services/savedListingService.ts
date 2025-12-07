import { supabase } from "../supabase";

export interface SavedListing {
  saved_listing_id: string;
  sitter_id: string;
  listing_id: string;
  saved_at: string;
}

export interface CreateSavedListingInput {
  sitter_id: string;
  listing_id: string;
}

// Function to check if a listing is saved by the sitter
export async function isListingSaved(
  sitterId: string,
  listingId: string
): Promise<{
  isSaved: boolean;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from("saved_listing")
      .select("saved_listing_id")
      .eq("sitter_id", sitterId)
      .eq("listing_id", listingId)
      .maybeSingle();

    if (error) {
      return { isSaved: false, error: new Error(error.message) };
    }

    return { isSaved: !!data, error: null };
  } catch (error) {
    return {
      isSaved: false,
      error:
        error instanceof Error ? error : new Error("Unknown error occurred"),
    };
  }
}

// Get all saved listings for a sitter
export async function getSavedListingsBySitterId(sitterId: string): Promise<{
  data: SavedListing[] | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from("saved_listing")
      .select("*")
      .eq("sitter_id", sitterId);

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error : new Error("Unknown error occurred"),
    };
  }
}

// Save a Listing
export async function saveListing(input: CreateSavedListingInput): Promise<{
  data: SavedListing | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from("saved_listing")
      .insert([input])
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error : new Error("Unknown error occurred"),
    };
  }
}

// Unsave a listing
export async function unsaveListing(
  sitterId: string,
  listingId: string
): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const { error } = await supabase
      .from("saved_listing")
      .delete()
      .eq("sitter_id", sitterId)
      .eq("listing_id", listingId);

    if (error) {
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error : new Error("Unknown error occurred"),
    };
  }
}

//Get saved listing IDs for a sitter (useful for checking multiple at once)
export async function getSavedListingIds(sitterId: string): Promise<{
  data: string[] | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from("saved_listing")
      .select("listing_id")
      .eq("sitter_id", sitterId);

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const listingIds = data?.map((item) => item.listing_id) || [];
    return { data: listingIds, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error : new Error("Unknown error occurred"),
    };
  }
}
