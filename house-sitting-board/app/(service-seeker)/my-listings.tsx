import MyListingCard from "@/features/service-seeker/listings/components/MyListingCard";
import MyListingLoadingState from "@/features/service-seeker/listings/components/MyListingLoadingState";
import MyListingsEmptyState from "@/features/service-seeker/listings/components/MyListingsEmptyState";
import MyListingsErrorState from "@/features/service-seeker/listings/components/MyListingsErrorState";
import { myListingStyles as styles } from "@/features/service-seeker/listings/styles/my-listing-styles";
import { Href, useRouter } from "expo-router";
import React from "react";
import { RefreshControl, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CURRENT_SERVICE_SEEKER_ID } from "../../lib/constants";
import { useListings } from "../../lib/hooks/useListingsQuery";

export default function MyListingsScreen() {
  const router = useRouter();
  const {
    data: listings = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useListings(CURRENT_SERVICE_SEEKER_ID);

  const handleEditListing = (listingId: string) => {
    router.push(`/(service-seeker)/edit-listing/${listingId}` as Href);
  };

  // Loading State
  if (isLoading) {
    return <MyListingLoadingState />;
  }

  // Error State
  if (error) {
    return <MyListingsErrorState error={error} onRetry={refetch} />;
  }

  // Empty State
  if (listings.length === 0) {
    return (
      <MyListingsEmptyState
        emptyTitleText="No listings yet"
        emptyMessageText="Create your first listing to find a sitter"
        buttonText="Create Listing"
      />
    );
  }

  // Listings View
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
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
        <Text style={styles.title}>My Listings</Text>

        {listings.map((listing) => (
          <MyListingCard
            key={listing.listing_id}
            listing={listing}
            onPressHandler={handleEditListing}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
