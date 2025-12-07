import { listingDetailsStyles as styles } from "@/features/sitter/listings/styles/listing-details-styles";
import {
  editListingFormatDate as formatDate,
  getListingTypeLabel,
} from "@/features/sitter/listings/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useListing } from "../../../lib/hooks/useListingsQuery";

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: listing, isLoading, error } = useListing(id);

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
            <Ionicons name="arrow-back" size={24} color="#0A0A0A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Listing Details</Text>
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
            <Ionicons name="arrow-back" size={24} color="#0A0A0A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Listing Details</Text>
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

  const duration = calculateDuration(listing.start_date, listing.end_date);

  // Listing Detail View
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Custom Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#0A0A0A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Listing Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Type Badge */}
        <View style={styles.typeBadgeContainer}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {getListingTypeLabel(listing.listing_type)}
            </Text>
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Location</Text>
          </View>
          <Text style={styles.locationText}>{listing.location}</Text>
        </View>

        {/* Dates Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Service Period</Text>
          </View>
          <View style={styles.dateCard}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <Text style={styles.dateValue}>
                {formatDate(listing.start_date)}
              </Text>
            </View>
            <View style={styles.dateDivider} />
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>End Date</Text>
              <Text style={styles.dateValue}>
                {formatDate(listing.end_date)}
              </Text>
            </View>
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>
              {duration} {duration === 1 ? "day" : "days"}
            </Text>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.descriptionText}>{listing.description}</Text>
        </View>

        {/* Status Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Status</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              listing.status === "ACTIVE" && styles.statusActive,
              listing.status === "COMPLETED" && styles.statusCompleted,
              listing.status === "CANCELLED" && styles.statusCancelled,
            ]}
          >
            <Ionicons
              name={
                listing.status === "ACTIVE"
                  ? "checkmark-circle"
                  : listing.status === "COMPLETED"
                  ? "checkmark-done-circle"
                  : "close-circle"
              }
              size={20}
              color={
                listing.status === "ACTIVE"
                  ? "#34C759"
                  : listing.status === "COMPLETED"
                  ? "#6B6B6B"
                  : "#FF3B30"
              }
            />
            <Text style={styles.statusText}>{listing.status}</Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}
