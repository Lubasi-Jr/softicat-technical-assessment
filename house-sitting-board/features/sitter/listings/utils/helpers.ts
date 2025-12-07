export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const getListingTypeLabel = (type: string) => {
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
};
