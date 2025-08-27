import LanguageSwitcher from "@/src/components/LanguageSwitcher";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { I18nManager, View } from "react-native";

export default function DrawerLayout() {
  console.log(I18nManager.isRTL, "d22d");

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
        },
        headerShadowVisible: false,
        drawerStyle: {
          elevation: 0,
          shadowOpacity: 0,
        },
        drawerContentStyle: {
          backgroundColor: "white",
        },
        drawerActiveTintColor: "#4f46e5",
        drawerLabelStyle: {
          fontSize: 14,
          paddingHorizontal: 7,
          textAlign: I18nManager.isRTL ? "right" : "left",
        },
        drawerPosition: I18nManager.isRTL ? "right" : "left",

        headerRight: () => (
          <View style={{ marginRight: 12 }}>
            <LanguageSwitcher />
          </View>
        ),
        drawerItemStyle: {
          marginVertical: 2,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Home",
          title: "",
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="login"
        options={{
          drawerLabel: "Login",
          title: "",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="login" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="register"
        options={{
          drawerLabel: "Register",
          title: "",
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="person-add" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
