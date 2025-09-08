import { useAppFonts } from "@/utils/fonts";
import { Stack } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
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

function RootLayout() {
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
          <Toast
            config={{
              success: (props) => (
                <View
                  style={{
                    backgroundColor: "#10B981",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 8,
                    marginHorizontal: 16,
                    marginTop: 50,
                    zIndex: 9999,
                    elevation: 9999,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {props.text1}
                  </Text>
                  {props.text2 && (
                    <Text style={{ color: "white", marginTop: 4 }}>
                      {props.text2}
                    </Text>
                  )}
                </View>
              ),
              error: (props) => (
                <View
                  style={{
                    backgroundColor: "#EF4444",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 8,
                    marginHorizontal: 16,
                    marginTop: 50,
                    zIndex: 9999999,
                    elevation: 99999,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {props.text1}
                  </Text>
                  {props.text2 && (
                    <Text style={{ color: "white", marginTop: 4 }}>
                      {props.text2}
                    </Text>
                  )}
                </View>
              ),
            }}
          />
        </DrawerRefreshProvider>
      </AuthProvider>
    </StoreProvider>
  );
}

export default RootLayout;
