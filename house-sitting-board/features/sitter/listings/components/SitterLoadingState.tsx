import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { browseListingStyles as styles } from "../styles/browse-listing-styles";

const ListingsLoadingState = ({ title }: { title: string }) => {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#ffd33d" />
        <Text style={styles.loadingText}>Loading listings...</Text>
      </View>
    </SafeAreaView>
  );
};

export default ListingsLoadingState;
