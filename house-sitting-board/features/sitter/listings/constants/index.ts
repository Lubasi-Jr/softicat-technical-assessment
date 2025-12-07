type FilterType = "ALL" | "PET_SITTING" | "HOUSE_SITTING" | "BOTH";

export const browseFilters: { label: string; value: FilterType }[] = [
  { label: "All", value: "ALL" },
  { label: "Pet Sitting", value: "PET_SITTING" },
  { label: "House Sitting", value: "HOUSE_SITTING" },
  { label: "Both", value: "BOTH" },
];
