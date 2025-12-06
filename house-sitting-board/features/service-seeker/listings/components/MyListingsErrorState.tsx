import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { myListingStyles as styles } from "../styles/my-listing-styles";

interface ErrorStateProps {
  error: unknown;
  onRetry: () => void;
}

const MyListingsErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.centerContent}>
        <Ionicons name="alert-circle-outline" size={32} color="#FF3B30" />
        <Text style={styles.errorTitle}>An error occured</Text>
        <Text style={styles.errorMessage}>
          {error instanceof Error ? error.message : "Failed to load listings"}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MyListingsErrorState;
