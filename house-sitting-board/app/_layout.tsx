import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { RoleProvider } from "../contexts/RoleContext";

export default function RootLayout() {
  return (
    <QueryProvider>
      <RoleProvider>
        <StatusBar hidden />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen
            name="(service-seeker)"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(sitter)" />
        </Stack>
      </RoleProvider>
    </QueryProvider>
  );
}
