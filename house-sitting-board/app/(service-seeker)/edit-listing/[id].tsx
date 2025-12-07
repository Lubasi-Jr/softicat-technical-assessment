import EditListingErrorState from "@/features/service-seeker/listings/components/EditListingErrorState";
import EditListingLoadingState from "@/features/service-seeker/listings/components/EditListingLoadingState";
import { editListingStyles as styles } from "@/features/service-seeker/listings/styles/edit-listing-styles";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
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
      "Are you sure you want to delete this listing? This action cannot be undone",
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
    return <EditListingLoadingState />;
  }

  // Error State
  if (error || !listing) {
    return <EditListingErrorState error={error} />;
  }

  const isMutating =
    updateListingMutation.isPending || deleteListingMutation.isPending;

  // Edit Form
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#0A0A0A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Listing</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Listing Type */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Type of Service Needed</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={listingType}
              onValueChange={(value) => setListingType(value)}
              style={styles.picker}
            >
              <Picker.Item label="Pet Sitting" value="PET_SITTING" />
              <Picker.Item label="House Sitting" value="HOUSE_SITTING" />
              <Picker.Item label="Both Pet & House Sitting" value="BOTH" />
            </Picker>
          </View>
        </View>

        {/* Location */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Location</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Cape Town, Western Cape"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.dateContainer}>
          {/* Start Date */}
          <View style={styles.dateGroup}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartPicker(true)}
            >
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
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndPicker(true)}
            >
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
          <Text style={styles.label}>Description</Text>
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
            <ActivityIndicator color="#0A0A0A" />
          ) : (
            <>
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
