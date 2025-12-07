import { supabase } from "../supabase";

export interface Listing {
  listing_id: string;
  service_seeker_id: string;
  listing_type: "PET_SITTING" | "HOUSE_SITTING" | "BOTH";
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
}

export interface CreateListingInput {
  service_seeker_id: string;
  listing_type: "PET_SITTING" | "HOUSE_SITTING" | "BOTH";
  location: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface UpdateListingInput {
  listing_type?: "PET_SITTING" | "HOUSE_SITTING" | "BOTH";
  location?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  status?: "ACTIVE" | "COMPLETED" | "CANCELLED";
}

// Fetch all the listings made by the Service Seeker
export async function getListingsBySeekerId(seekerId: string): Promise<{
  data: Listing[] | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from("listing")
      .select("*")
      .eq("service_seeker_id", seekerId)
      .order("start_date", { ascending: false });

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

export async function getListingById(listingId: string): Promise<{
  data: Listing | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from("listing")
      .select("*")
      .eq("listing_id", listingId)
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

// CRUD FUNCTIONS USING SUPABASE
export async function createListing(input: CreateListingInput): Promise<{
  data: Listing | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from("listing")
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

export async function updateListing(
  listingId: string,
  input: UpdateListingInput
): Promise<{
  data: Listing | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from("listing")
      .update(input)
      .eq("listing_id", listingId)
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

export async function deleteListing(listingId: string): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const { error } = await supabase
      .from("listing")
      .delete()
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

export async function getActiveListings(): Promise<{
  data: Listing[] | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from("listing")
      .select("*")
      .eq("status", "ACTIVE")
      .order("start_date", { ascending: true });

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
