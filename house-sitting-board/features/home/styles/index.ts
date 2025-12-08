import { StyleSheet } from "react-native";

export const homepageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0A0A0A",
    marginBottom: 24,
  },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    padding: 20,
    marginBottom: 16,
    minHeight: 120,
  },
  roleTextContainer: {
    flex: 1,
  },
  rolePrimaryText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0A0A0A",
    marginBottom: 4,
  },
});
