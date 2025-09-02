import { useAppFonts } from "@/utils/fonts";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import StoreProvider from "../store/StoreProvider";
import "../utils/i18n";
import "./global.css";

export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  // Show a loader until fonts are ready
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <StoreProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Toast />
      </Stack>
    </StoreProvider>
  );
}