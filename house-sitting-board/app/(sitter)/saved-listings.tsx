// app/(sitter)/saved.tsx
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Href, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CURRENT_SITTER_ID } from "../../lib/constants";
import {
  useSavedListings,
  useUnsaveListing,
} from "../../lib/hooks/useSavedListingsQuery";
import { getListingById } from "../../lib/services/listingService";

export default function SavedListingsScreen() {
  const router = useRouter();
  const {
    data: savedListings = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useSavedListings(CURRENT_SITTER_ID);
  const unsaveMutation = useUnsaveListing();

  // Fetch full listing details for each saved listing
  const savedListingIds = savedListings.map((sl) => sl.listing_id);

  const handleViewListing = (listingId: string) => {
    router.push(`/(sitter)/listing-details/${listingId}` as Href);
  };

  const handleUnsave = (listingId: string) => {
    Alert.alert(
      "Remove from Saved",
      "Are you sure you want to remove this listing from your saved items?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            unsaveMutation.mutate({
              sitterId: CURRENT_SITTER_ID,
              listingId,
            });
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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

  // Loading State
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.header}>
          <Text style={styles.title}>Saved Listings</Text>
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#ffd33d" />
          <Text style={styles.loadingText}>Loading saved listings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error State
  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.header}>
          <Text style={styles.title}>Saved Listings</Text>
        </View>
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorMessage}>
            {error instanceof Error
              ? error.message
              : "Failed to load saved listings"}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Empty State
  if (savedListings.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.header}>
          <Text style={styles.title}>Saved Listings</Text>
          <Text style={styles.subtitle}>0 listings saved</Text>
        </View>
        <View style={styles.centerContent}>
          <Ionicons name="heart-outline" size={64} color="#6B6B6B" />
          <Text style={styles.emptyTitle}>No saved listings yet</Text>
          <Text style={styles.emptyMessage}>
            Browse listings and save ones you're interested in
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push("/(sitter)/browse-listings")}
          >
            <Ionicons name="search" size={20} color="#1A1A1A" />
            <Text style={styles.browseButtonText}>Browse Listings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Saved Listings View
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Listings</Text>
        <Text style={styles.subtitle}>
          {savedListings.length}{" "}
          {savedListings.length === 1 ? "listing" : "listings"} saved
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor="#ffd33d"
          />
        }
      >
        {savedListings.map((savedListing) => (
          <SavedListingCard
            key={savedListing.saved_listing_id}
            savedListing={savedListing}
            onView={handleViewListing}
            onUnsave={handleUnsave}
            formatDate={formatDate}
            getListingTypeLabel={getListingTypeLabel}
            getListingTypeIcon={getListingTypeIcon}
            isUnsaving={unsaveMutation.isPending}
          />
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Separate component for each saved listing card
function SavedListingCard({
  savedListing,
  onView,
  onUnsave,
  formatDate,
  getListingTypeLabel,
  getListingTypeIcon,
  isUnsaving,
}: {
  savedListing: any;
  onView: (id: string) => void;
  onUnsave: (id: string) => void;
  formatDate: (date: string) => string;
  getListingTypeLabel: (type: string) => string;
  getListingTypeIcon: (type: string) => string;
  isUnsaving: boolean;
}) {
  // Fetch the full listing details
  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", savedListing.listing_id],
    queryFn: async () => {
      const { data, error } = await getListingById(savedListing.listing_id);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <View style={styles.listingCard}>
        <ActivityIndicator size="small" color="#ffd33d" />
      </View>
    );
  }

  if (!listing) {
    return null;
  }

  /* const savedDate = new Date(savedListing.saved_at);
  const formattedSavedDate = savedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }); */

  return (
    <TouchableOpacity
      style={styles.listingCard}
      onPress={() => onView(listing.listing_id)}
      activeOpacity={0.7}
    >
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.typeContainer}>
          <Text style={styles.typeIcon}>
            {getListingTypeIcon(listing.listing_type)}
          </Text>
          <Text style={styles.listingType}>
            {getListingTypeLabel(listing.listing_type)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.unsaveButton}
          onPress={(e) => {
            e.stopPropagation();
            onUnsave(listing.listing_id);
          }}
          disabled={isUnsaving}
        >
          {isUnsaving ? (
            <ActivityIndicator size="small" color="#FF3B30" />
          ) : (
            <Ionicons name="close-circle" size={24} color="#FF3B30" />
          )}
        </TouchableOpacity>
      </View>

      {/* Location */}
      <View style={styles.locationRow}>
        <Ionicons name="location" size={16} color="#007AFF" />
        <Text style={styles.location}>{listing.location}</Text>
      </View>

      {/* Dates */}
      <View style={styles.dateRow}>
        <Ionicons name="calendar-outline" size={16} color="#6B6B6B" />
        <Text style={styles.dates}>
          {formatDate(listing.start_date)} → {formatDate(listing.end_date)}
        </Text>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
        {listing.description}
      </Text>

      {/* View Details Link */}
      <View style={styles.viewDetailsContainer}>
        <Text style={styles.viewDetailsText}>View Details</Text>
        <Ionicons name="chevron-forward" size={16} color="#007AFF" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B6B6B",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
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
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#ffd33d",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#1A1A1A",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#6B6B6B",
    textAlign: "center",
    marginBottom: 24,
  },
  browseButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffd33d",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "#1A1A1A",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  listingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  savedBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FFE5E5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  savedBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF3B30",
    marginLeft: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  typeIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  listingType: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  unsaveButton: {
    padding: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
    marginLeft: 6,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dates: {
    fontSize: 14,
    color: "#6B6B6B",
    marginLeft: 6,
  },
  description: {
    fontSize: 14,
    color: "#1A1A1A",
    lineHeight: 20,
    marginBottom: 12,
  },
  viewDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    marginRight: 4,
  },
  bottomPadding: {
    height: 20,
  },
});
