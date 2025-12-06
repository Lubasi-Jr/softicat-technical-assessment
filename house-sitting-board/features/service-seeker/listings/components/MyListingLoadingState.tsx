import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { myListingStyles as styles } from "../styles/my-listing-styles";

const MyListingLoadingState = () => {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#ffd33d" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </SafeAreaView>
  );
};

export default MyListingLoadingState;
