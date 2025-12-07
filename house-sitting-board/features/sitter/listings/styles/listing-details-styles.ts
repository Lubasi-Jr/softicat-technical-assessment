import { StyleSheet } from "react-native";

export const listingDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF8E7",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0A0A0A",
  },
  content: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
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
  },
  typeBadgeContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
  },
  typeBadgeIcon: {
    fontSize: 28,
    marginRight: 8,
  },
  typeBadgeText: {
    fontSize: 20,
    fontWeight: "500",
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0A0A0A",
    marginLeft: 8,
  },
  locationText: {
    fontSize: 16,
    color: "#0A0A0A",
    lineHeight: 24,
  },
  dateCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  dateItem: {
    flex: 1,
  },
  dateDivider: {
    width: 1,
    backgroundColor: "#E5E5E5",
    marginHorizontal: 16,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B6B6B",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0A0A0A",
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 4,
  },
  descriptionText: {
    fontSize: 16,
    color: "#0A0A0A",
    lineHeight: 24,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: "#E7F5E7",
  },
  statusCompleted: {
    backgroundColor: "#F8F9FA",
  },
  statusCancelled: {
    backgroundColor: "#FFE5E5",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0A0A0A",
    marginLeft: 6,
  },
  bottomPadding: {
    height: 40,
  },
});
