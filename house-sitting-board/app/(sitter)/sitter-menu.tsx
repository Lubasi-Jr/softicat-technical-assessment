import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRole } from "../../contexts/RoleContext";

export default function SitterMenuScreen() {
  const { logout } = useRole();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/");
        },
      },
    ]);
  };
  //
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.content}>
        <Text style={styles.title}>Menu</Text>
        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={32} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0A0A0A",
    marginBottom: 48,
  },
  logoutButton: {
    width: "60%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5F5",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FF3B30",
    padding: 24,
  },
  logoutText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#FF3B30",
    marginLeft: 16,
  },
});
