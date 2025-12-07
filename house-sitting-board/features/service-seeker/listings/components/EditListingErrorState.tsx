import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { editListingStyles as styles } from "../styles/edit-listing-styles";

interface listingErrorProps {
  error: Error | null;
}

const EditListingErrorState = ({ error }: listingErrorProps) => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#0A0A0A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Listing</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.centerContent}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={styles.errorTitle}>Listing not found</Text>
        <Text style={styles.errorMessage}>
          {error instanceof Error ? error.message : "Can't load listing"}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default EditListingErrorState;
