import { StyleSheet } from "react-native";

export const myListingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0A0A0A",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B6B6B",
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B6B6B",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0A0A0A",
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#6B6B6B",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#ffd33d",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#0A0A0A",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0A0A0A",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#6B6B6B",
    textAlign: "center",
    marginBottom: 24,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffd33d",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#0A0A0A",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  listingCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardLeft: {
    flex: 1,
  },
  listingType: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0A0A0A",
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  listingDates: {
    fontSize: 14,
    color: "#6B6B6B",
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  listingLocation: {
    fontSize: 14,
    color: "#6B6B6B",
    marginLeft: 4,
  },
  listingDescription: {
    fontSize: 14,
    color: "#0A0A0A",
    lineHeight: 20,
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: "#ffd33d",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#0A0A0A",
    fontSize: 14,
    fontWeight: "400",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  statusActive: {
    backgroundColor: "#E7F5E7",
  },
  statusCompleted: {
    backgroundColor: "#E5E5E5",
  },
  statusCancelled: {
    backgroundColor: "#FFE5E5",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0A0A0A",
  },
});
