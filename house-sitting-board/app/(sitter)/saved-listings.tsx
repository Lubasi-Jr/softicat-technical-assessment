import SavedListingsEmptyState from "@/features/sitter/listings/components/SavedListingsEmptyState";
import ListingsErrorState from "@/features/sitter/listings/components/SitterErrorState";
import { savedListingStyles as styles } from "@/features/sitter/listings/styles/saved-listing-styles";
import {
  formatDate,
  getListingTypeLabel,
} from "@/features/sitter/listings/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Href, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
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
      <ListingsErrorState
        error={error}
        title="Saved Listings"
        onRetry={refetch}
      />
    );
  }

  // Empty State
  if (savedListings.length === 0) {
    return <SavedListingsEmptyState />;
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
  isUnsaving,
}: {
  savedListing: any;
  onView: (id: string) => void;
  onUnsave: (id: string) => void;
  formatDate: (date: string) => string;
  getListingTypeLabel: (type: string) => string;
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

  return (
    <TouchableOpacity
      style={styles.listingCard}
      onPress={() => onView(listing.listing_id)}
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
            <Ionicons name="heart" size={24} color="#FF3B30" />
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
          {formatDate(listing.start_date)} → {formatDate(listing.end_date)}
        </Text>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
        {listing.description}
      </Text>

      {/* View Details Arrow*/}
      <View style={styles.viewDetailsContainer}>
        <Text style={styles.viewDetailsText}>View Details</Text>
        <Ionicons name="chevron-forward" size={16} color="#ffd33d" />
      </View>
    </TouchableOpacity>
  );
}
