import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useRole } from "../../contexts/RoleContext";

export default function ServiceSeekerLayout() {
  const { role } = useRole();

  if (role !== "service_seeker") {
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
        name="my-listings"
        options={{
          title: "My Listings",
          tabBarIcon: ({ color }) => (
            <Ionicons name="list" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="create-listing"
        options={{
          title: "Create",
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="menu"
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
        name="edit-listing/[id]"
        options={{
          href: null,
          title: "Edit Listing",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
