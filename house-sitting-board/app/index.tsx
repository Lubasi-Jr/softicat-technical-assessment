import RoleCard from "@/features/home/components/RoleCard";
import { homepageStyles as styles } from "@/features/home/styles";
import { Href, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRole } from "../contexts/RoleContext";

export default function RoleSelectionScreen() {
  const { switchRole, role } = useRole();
  const router = useRouter();

  // Navigate based on role
  useEffect(() => {
    if (role === "service_seeker") {
      router.replace("/(service-seeker)/my-listings" as Href);
    } else if (role === "sitter") {
      router.replace("/(sitter)/browse-listings" as Href);
    }
  }, [role]);

  const handleRoleSelection = (selectedRole: "service_seeker" | "sitter") => {
    switchRole(selectedRole);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Welcome! How can we help you?</Text>
        <RoleCard
          label="I need a sitter"
          onPress={() => handleRoleSelection("service_seeker")}
        />
        <RoleCard
          label="I am a sitter"
          onPress={() => handleRoleSelection("sitter")}
        />
      </View>
    </SafeAreaView>
  );
}
