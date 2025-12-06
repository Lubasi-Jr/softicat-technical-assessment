import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { myListingStyles as styles } from "../styles/my-listing-styles";

interface EmptyStateProps {
  emptyTitleText: string;
  emptyMessageText: string;
  buttonText: string;
}

const MyListingsEmptyState = ({
  emptyMessageText,
  emptyTitleText,
  buttonText,
}: EmptyStateProps) => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.centerContent}>
        <Text style={styles.emptyTitle}>{emptyTitleText}</Text>
        <Text style={styles.emptyMessage}>{emptyMessageText}</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/(service-seeker)/create-listing")}
        >
          <Ionicons name="add-circle" size={20} color="#0A0A0A" />
          <Text style={styles.createButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MyListingsEmptyState;
