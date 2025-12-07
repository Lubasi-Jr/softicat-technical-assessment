import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { browseListingStyles as styles } from "../styles";

const BrowseListingsLoadingState = () => {
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
};

export default BrowseListingsLoadingState;
