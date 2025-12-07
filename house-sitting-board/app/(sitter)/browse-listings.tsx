import ListingsErrorState from "@/features/sitter/listings/components/SitterErrorState";
import ListingsLoadingState from "@/features/sitter/listings/components/SitterLoadingState";
import { browseFilters as filters } from "@/features/sitter/listings/constants";
import { browseListingStyles as styles } from "@/features/sitter/listings/styles/browse-listing-styles";
import {
  formatDate,
  getListingTypeLabel,
} from "@/features/sitter/listings/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
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

  // Loading State
  if (isLoading) {
    return <ListingsLoadingState title="Browse Listings" />;
  }

  // Error State
  if (error) {
    return (
      <ListingsErrorState
        title="Browse Listings"
        error={error}
        onRetry={refetch}
      />
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
                <Ionicons name="location" size={16} color="#6B6B6B" />
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
                <Ionicons name="chevron-forward" size={16} color="#ffd33d" />
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}
