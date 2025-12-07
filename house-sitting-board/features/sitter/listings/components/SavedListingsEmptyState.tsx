import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { savedListingStyles as styles } from "../styles/saved-listing-styles";

const SavedListingsEmptyState = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Listings</Text>
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
          <Ionicons name="search" size={20} color="#0A0A0A" />
          <Text style={styles.browseButtonText}>Browse Listings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SavedListingsEmptyState;
