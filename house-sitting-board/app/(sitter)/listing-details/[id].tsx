// app/(sitter)/listing-detail/[id].tsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getListingTypeLabel = (type: string) => {
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

  const getListingTypeIcon = (type: string) => {
    switch (type) {
      case "PET_SITTING":
        return "🐕";
      case "HOUSE_SITTING":
        return "🏠";
      case "BOTH":
        return "🐕🏠";
      default:
        return "📋";
    }
  };

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
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
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
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
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
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Listing Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Type Badge */}
        <View style={styles.typeBadgeContainer}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeIcon}>
              {getListingTypeIcon(listing.listing_type)}
            </Text>
            <Text style={styles.typeBadgeText}>
              {getListingTypeLabel(listing.listing_type)}
            </Text>
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={24} color="#007AFF" />
            <Text style={styles.sectionTitle}>Location</Text>
          </View>
          <Text style={styles.locationText}>{listing.location}</Text>
        </View>

        {/* Dates Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar" size={24} color="#007AFF" />
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
            <Ionicons name="time-outline" size={16} color="#007AFF" />
            <Text style={styles.durationText}>
              {duration} {duration === 1 ? "day" : "days"}
            </Text>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={24} color="#007AFF" />
            <Text style={styles.sectionTitle}>Description</Text>
          </View>
          <Text style={styles.descriptionText}>{listing.description}</Text>
        </View>

        {/* Status Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={24} color="#007AFF" />
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
    borderColor: "#007AFF",
  },
  typeBadgeIcon: {
    fontSize: 28,
    marginRight: 8,
  },
  typeBadgeText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#007AFF",
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginLeft: 8,
  },
  locationText: {
    fontSize: 16,
    color: "#1A1A1A",
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
    color: "#1A1A1A",
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#E7F5FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    marginLeft: 4,
  },
  descriptionText: {
    fontSize: 16,
    color: "#1A1A1A",
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
    color: "#1A1A1A",
    marginLeft: 6,
  },
  bottomPadding: {
    height: 40,
  },
});
