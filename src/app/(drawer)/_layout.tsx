import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { I18nManager } from "react-native";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "white",
        },
        drawerActiveTintColor: "#4f46e5",
        drawerLabelStyle: {
          fontSize: 14,
          paddingHorizontal: 7,
          textAlign: I18nManager.isRTL ? "right" : "left",
        },
        drawerPosition: I18nManager.isRTL ? "right" : "left",
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Home",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="login"
        options={{
          drawerLabel: "Login",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="login" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="register"
        options={{
          drawerLabel: "Register",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="person-add" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
