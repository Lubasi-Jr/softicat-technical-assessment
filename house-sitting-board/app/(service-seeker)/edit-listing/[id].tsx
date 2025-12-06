import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CURRENT_SERVICE_SEEKER_ID } from "../../../lib/constants";
import {
  useDeleteListing,
  useListing,
  useUpdateListing,
} from "../../../lib/hooks/useListingsQuery";

export default function EditListingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: listing, isLoading, error } = useListing(id);
  const updateListingMutation = useUpdateListing();
  const deleteListingMutation = useDeleteListing();

  const [listingType, setListingType] = useState<
    "PET_SITTING" | "HOUSE_SITTING" | "BOTH"
  >("PET_SITTING");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Populate form when listing loads
  useEffect(() => {
    if (listing) {
      setListingType(listing.listing_type);
      setLocation(listing.location);
      setStartDate(new Date(listing.start_date));
      setEndDate(new Date(listing.end_date));
      setDescription(listing.description);
    }
  }, [listing]);

  const handleSave = async () => {
    // Validation
    if (!location.trim()) {
      Alert.alert("Error", "Please enter a location");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }

    if (endDate < startDate) {
      Alert.alert("Error", "End date must be after start date");
      return;
    }

    updateListingMutation.mutate(
      {
        listingId: id,
        input: {
          listing_type: listingType,
          location: location.trim(),
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
          description: description.trim(),
        },
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Listing updated successfully!", [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]);
        },
        onError: (error) => {
          Alert.alert(
            "Error",
            error instanceof Error ? error.message : "Failed to update listing"
          );
        },
      }
    );
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteListingMutation.mutate(
              {
                listingId: id,
                seekerId: CURRENT_SERVICE_SEEKER_ID,
              },
              {
                onSuccess: () => {
                  Alert.alert("Deleted", "Listing deleted successfully", [
                    {
                      text: "OK",
                      onPress: () =>
                        router.replace("/(service-seeker)/my-listings"),
                    },
                  ]);
                },
                onError: (error) => {
                  Alert.alert(
                    "Error",
                    error instanceof Error
                      ? error.message
                      : "Failed to delete listing"
                  );
                },
              }
            );
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Loading State
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Listing</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#ffd33d" />
          <Text style={styles.loadingText}>Loading listing...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error State
  if (error || !listing) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Listing</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
          <Text style={styles.errorTitle}>Listing not found</Text>
          <Text style={styles.errorMessage}>
            {error instanceof Error ? error.message : "Unable to load listing"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isMutating =
    updateListingMutation.isPending || deleteListingMutation.isPending;

  // Edit Form
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Custom Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Listing</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Listing Type */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Type of Service Needed *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={listingType}
              onValueChange={(value) => setListingType(value)}
              style={styles.picker}
            >
              <Picker.Item label="🐕 Pet Sitting" value="PET_SITTING" />
              <Picker.Item label="🏠 House Sitting" value="HOUSE_SITTING" />
              <Picker.Item label="🐕🏠 Both Pet & House Sitting" value="BOTH" />
            </Picker>
          </View>
        </View>

        {/* Location */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Location *</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="location-outline"
              size={20}
              color="#6B6B6B"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g., Cape Town, Western Cape"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Date Range */}
        <View style={styles.dateContainer}>
          {/* Start Date */}
          <View style={styles.dateGroup}>
            <Text style={styles.label}>Start Date *</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartPicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#6B6B6B" />
              <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowStartPicker(false);
                  if (date) setStartDate(date);
                }}
                minimumDate={new Date()}
              />
            )}
          </View>

          {/* End Date */}
          <View style={styles.dateGroup}>
            <Text style={styles.label}>End Date *</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndPicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#6B6B6B" />
              <Text style={styles.dateButtonText}>{formatDate(endDate)}</Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowEndPicker(false);
                  if (date) setEndDate(date);
                }}
                minimumDate={startDate}
              />
            )}
          </View>
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description *</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Provide details about your sitting needs..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
          <Text style={styles.charCount}>{description.length}/500</Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, isMutating && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isMutating}
        >
          {updateListingMutation.isPending ? (
            <ActivityIndicator color="#1A1A1A" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#1A1A1A" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={isMutating}
        >
          {deleteListingMutation.isPending ? (
            <ActivityIndicator color="#FF3B30" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              <Text style={styles.deleteButtonText}>Delete Listing</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    color: "#1A1A1A",
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B6B6B",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#6B6B6B",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1A1A1A",
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#1A1A1A",
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
    borderColor: "#E5E5E5",
    borderRadius: 12,
    padding: 12,
    height: 50,
  },
  dateButtonText: {
    fontSize: 14,
    color: "#1A1A1A",
    marginLeft: 8,
    flex: 1,
  },
  textAreaContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    padding: 12,
  },
  textArea: {
    fontSize: 16,
    color: "#1A1A1A",
    minHeight: 120,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#6B6B6B",
    textAlign: "right",
    marginTop: 4,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffd33d",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#1A1A1A",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FF3B30",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 40,
  },
  deleteButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
