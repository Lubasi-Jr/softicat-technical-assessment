import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useRole } from "../../contexts/RoleContext";

export default function SitterLayout() {
  const { role } = useRole();

  if (role !== "sitter") {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#25292e",
          height: 80,
          paddingTop: 8,
          paddingBottom: 12,
        },
      }}
    >
      <Tabs.Screen
        name="browse-listings"
        options={{
          title: "Available Listings",
          tabBarIcon: ({ color }) => (
            <Ionicons name="list" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="saved-listings"
        options={{
          title: "Saved",
          tabBarIcon: ({ color }) => (
            <Ionicons name="menu" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="sitter-menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => (
            <Ionicons name="menu" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      {/* Hide edit screen from tabs */}
      <Tabs.Screen
        name="listing-details/[id]"
        options={{
          href: null,
          title: "Listing Details",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
