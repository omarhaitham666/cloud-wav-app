import { useAppFonts } from "@/utils/fonts";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { useAuthInit } from "../hooks/useAuthInit";
import { AuthProvider } from "../store/auth-context";
import { DrawerRefreshProvider } from "../store/drawerRefreshContext";
import StoreProvider from "../store/StoreProvider";
import "../utils/i18n";
import "./global.css";

function AppContent() {
  const { isLoading } = useAuthInit();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}

export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <StoreProvider>
      <AuthProvider>
        <DrawerRefreshProvider>
          <AppContent />
          <Toast />
        </DrawerRefreshProvider>
      </AuthProvider>
    </StoreProvider>
  );
}
