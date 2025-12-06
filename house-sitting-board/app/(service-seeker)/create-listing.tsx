import { createListingStyles as styles } from "@/features/service-seeker/listings/styles/create-listing-styles";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import { CURRENT_SERVICE_SEEKER_ID } from "../../lib/constants";
import { useCreateListing } from "../../lib/hooks/useListingsQuery";

export default function CreateListingScreen() {
  const router = useRouter();
  const createListingMutation = useCreateListing();
  // Form Fields
  const [listingType, setListingType] = useState<
    "PET_SITTING" | "HOUSE_SITTING" | "BOTH"
  >("PET_SITTING");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleSubmit = async () => {
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

    createListingMutation.mutate(
      {
        service_seeker_id: CURRENT_SERVICE_SEEKER_ID,
        listing_type: listingType,
        location: location.trim(),
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        description: description.trim(),
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Listing created successfully!", [
            {
              text: "OK",
              onPress: () => {
                // Reset form
                setListingType("PET_SITTING");
                setLocation("");
                setStartDate(new Date());
                setEndDate(new Date());
                setDescription("");
                // Navigate to My Listings
                router.push("/(service-seeker)/my-listings");
              },
            },
          ]);
        },
        onError: (error) => {
          Alert.alert(
            "Error",
            error instanceof Error ? error.message : "Failed to create listing"
          );
        },
      }
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Create New Listing</Text>

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

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            createListingMutation.isPending && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={createListingMutation.isPending}
        >
          {createListingMutation.isPending ? (
            <ActivityIndicator color="#0A0A0A" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Create Listing</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
