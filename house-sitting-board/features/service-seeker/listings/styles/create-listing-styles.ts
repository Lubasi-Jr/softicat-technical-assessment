import { StyleSheet } from "react-native";

export const createListingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#0A0A0A",
  },
  /* subtitle: {
    fontSize: 14,
    color: "#6B6B6B",
    marginBottom: 24,
  }, */
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#0A0A0A",
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,

    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    height: 55,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,

    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#0A0A0A",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateGroup: {
    flex: 1,
    marginRight: 8,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,

    borderRadius: 12,
    padding: 12,
    height: 50,
  },
  dateButtonText: {
    fontSize: 14,
    color: "#0A0A0A",
    marginLeft: 8,
    flex: 1,
  },
  textAreaContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,

    borderRadius: 12,
    padding: 12,
  },
  textArea: {
    fontSize: 16,
    color: "#0A0A0A",
    minHeight: 120,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#6B6B6B",
    textAlign: "right",
    marginTop: 4,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffd33d",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#0A0A0A",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
});
