/**
 * Format a date string as: "Jan 20"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Convert database listing types to human-readable labels
 */
export function getListingTypeLabel(type: string): string {
  switch (type) {
    case "PET_SITTING":
      return "Pet Sitting";
    case "HOUSE_SITTING":
      return "House Sitting";
    case "BOTH":
      return "Pet & House Sitting";
    default:
      return type;
  }
}
