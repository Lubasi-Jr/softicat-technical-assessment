import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CURRENT_SITTER_ID } from "../../lib/constants";
import { useActiveListingsWithFilter } from "../../lib/hooks/useListingsQuery";
import {
  useSavedListingIds,
  useSaveListing,
  useUnsaveListing,
} from "../../lib/hooks/useSavedListingsQuery";

type FilterType = "ALL" | "PET_SITTING" | "HOUSE_SITTING" | "BOTH";

export default function BrowseListingsScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("ALL");

  // Fetch listings based on filter
  const filterValue = selectedFilter === "ALL" ? null : selectedFilter;
  const {
    data: listings = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useActiveListingsWithFilter(filterValue);

  // Fetch saved listing IDs
  const { data: savedListingIds = [] } = useSavedListingIds(CURRENT_SITTER_ID);

  // Mutations
  const saveMutation = useSaveListing();
  const unsaveMutation = useUnsaveListing();

  const handleViewListing = (listingId: string) => {
    router.push(`/(sitter)/listing-details/${listingId}` as Href);
  };

  const handleToggleSave = (listingId: string) => {
    const isSaved = savedListingIds.includes(listingId);

    if (isSaved) {
      // Unsave
      unsaveMutation.mutate({
        sitterId: CURRENT_SITTER_ID,
        listingId,
      });
    } else {
      // Save
      saveMutation.mutate({
        sitter_id: CURRENT_SITTER_ID,
        listing_id: listingId,
      });
    }
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

  const filters: { label: string; value: FilterType; icon: string }[] = [
    { label: "All", value: "ALL", icon: "📋" },
    { label: "Pet Sitting", value: "PET_SITTING", icon: "🐕" },
    { label: "House Sitting", value: "HOUSE_SITTING", icon: "🏠" },
    { label: "Both", value: "BOTH", icon: "🐕🏠" },
  ];

  // Loading State
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.header}>
          <Text style={styles.title}>Browse Listings</Text>
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#ffd33d" />
          <Text style={styles.loadingText}>Loading listings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error State
  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.header}>
          <Text style={styles.title}>Browse Listings</Text>
        </View>
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorMessage}>
            {error instanceof Error ? error.message : "Failed to load listings"}
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
  if (listings.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.header}>
          <Text style={styles.title}>Browse Listings</Text>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterChip,
                selectedFilter === filter.value && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter.value)}
            >
              <Text style={styles.filterIcon}>{filter.icon}</Text>
              <Text
                style={[
                  styles.filterLabel,
                  selectedFilter === filter.value && styles.filterLabelActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.centerContent}>
          <Ionicons name="search-outline" size={64} color="#6B6B6B" />
          <Text style={styles.emptyTitle}>No listings found</Text>
          <Text style={styles.emptyMessage}>
            {selectedFilter === "ALL"
              ? "There are no available listings at the moment"
              : `No ${filters
                  .find((f) => f.value === selectedFilter)
                  ?.label.toLowerCase()} listings available`}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Listings View
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Browse Listings</Text>
        <Text style={styles.subtitle}>
          {listings.length} {listings.length === 1 ? "listing" : "listings"}{" "}
          available
        </Text>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.filterChip,
              selectedFilter === filter.value && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter.value)}
          >
            <Text style={styles.filterIcon}>{filter.icon}</Text>
            <Text
              style={[
                styles.filterLabel,
                selectedFilter === filter.value && styles.filterLabelActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Listings */}
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
        {listings.map((listing) => {
          const isSaved = savedListingIds.includes(listing.listing_id);
          const isSaving = saveMutation.isPending || unsaveMutation.isPending;

          return (
            <TouchableOpacity
              key={listing.listing_id}
              style={styles.listingCard}
              onPress={() => handleViewListing(listing.listing_id)}
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
                  style={styles.saveButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleToggleSave(listing.listing_id);
                  }}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#FF3B30" />
                  ) : (
                    <Ionicons
                      name={isSaved ? "heart" : "heart-outline"}
                      size={24}
                      color={isSaved ? "#FF3B30" : "#6B6B6B"}
                    />
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
                  {formatDate(listing.start_date)} →{" "}
                  {formatDate(listing.end_date)}
                </Text>
              </View>

              {/* Description */}
              <Text
                style={styles.description}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {listing.description}
              </Text>

              {/* View Details Link */}
              <View style={styles.viewDetailsContainer}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <Ionicons name="chevron-forward" size={16} color="#007AFF" />
              </View>
            </TouchableOpacity>
          );
        })}

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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
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
  filterContainer: {
    maxHeight: 56,
    marginVertical: 12,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: "#ffd33d",
    borderColor: "#ffd33d",
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B6B6B",
  },
  filterLabelActive: {
    color: "#1A1A1A",
    fontWeight: "600",
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
  },
  listingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
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
  saveButton: {
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
