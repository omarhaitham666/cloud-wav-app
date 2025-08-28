import { Stack } from "expo-router";
import "react-native-reanimated";
import StoreProvider from "../store/StoreProvider";
import "../utils/i18n";
import "./global.css";

export default function RootLayout() {
  return (
    <StoreProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      </Stack>
    </StoreProvider>
  );
}
