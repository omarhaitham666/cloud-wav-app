import { TabBar } from "@/components/TabBar";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarPosition: "bottom",
        tabBarActiveTintColor: "#4f46e5",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="music" options={{ title: "Music" }} />
      <Tabs.Screen name="price" options={{ title: "Contact" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
