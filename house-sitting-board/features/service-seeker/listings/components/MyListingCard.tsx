import { Listing } from "@/lib/services/listingService";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { myListingStyles as styles } from "../styles/my-listing-styles";
import { formatDate, getListingTypeLabel } from "../utils/MyListingHelpers";

interface ListingCardProps {
  listing: Listing;
  onPressHandler: (id: string) => void;
}

export const MyListingCard = ({
  listing,
  onPressHandler,
}: ListingCardProps) => {
  return (
    <TouchableOpacity
      key={listing.listing_id}
      style={styles.listingCard}
      onPress={() => onPressHandler(listing.listing_id)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <Text style={styles.listingType}>
            {getListingTypeLabel(listing.listing_type)}
          </Text>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color="#6B6B6B" />
            <Text style={styles.listingDates}>
              {formatDate(listing.start_date)} → {formatDate(listing.end_date)}
            </Text>
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#6B6B6B" />
            <Text style={styles.listingLocation}>{listing.location}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onPressHandler(listing.listing_id)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <Text
        style={styles.listingDescription}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {listing.description}
      </Text>
      <View
        style={[
          styles.statusBadge,
          listing.status === "ACTIVE" && styles.statusActive,
          listing.status === "COMPLETED" && styles.statusCompleted,
          listing.status === "CANCELLED" && styles.statusCancelled,
        ]}
      >
        <Text style={styles.statusText}>{listing.status}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MyListingCard;
