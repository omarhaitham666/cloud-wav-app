import { Stack } from "expo-router";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import StoreProvider from "../store/StoreProvider";
import "../utils/i18n";
import "./global.css";
export default function RootLayout() {
  return (
    <StoreProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Toast />
      </Stack>
    </StoreProvider>
  );
}
