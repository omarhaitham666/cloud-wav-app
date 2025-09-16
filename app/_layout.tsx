import { useAppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
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
                    zIndex: 9999999,
                    elevation: 9999999,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      {props.text1}
                    </Text>
                    {props.text2 && (
                      <Text style={{ color: "white", marginTop: 4 }}>
                        {props.text2}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => Toast.hide()}
                    style={{
                      padding: 4,
                      marginLeft: 8,
                    }}
                  >
                    <Ionicons name="close" size={20} color="white" />
                  </TouchableOpacity>
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
                    elevation: 9999999,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      {props.text1}
                    </Text>
                    {props.text2 && (
                      <Text style={{ color: "white", marginTop: 4 }}>
                        {props.text2}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => Toast.hide()}
                    style={{
                      padding: 4,
                      marginLeft: 8,
                    }}
                  >
                    <Ionicons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ),
              info: (props) => (
                <View
                  style={{
                    backgroundColor: "#3B82F6",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderRadius: 8,
                    marginHorizontal: 16,
                    marginTop: 50,
                    zIndex: 9999999,
                    elevation: 9999999,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      {props.text1}
                    </Text>
                    {props.text2 && (
                      <Text style={{ color: "white", marginTop: 4 }}>
                        {props.text2}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => Toast.hide()}
                    style={{
                      padding: 4,
                      marginLeft: 8,
                    }}
                  >
                    <Ionicons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ),
            }}
            topOffset={60}
          />
        </DrawerRefreshProvider>
      </AuthProvider>
    </StoreProvider>
  );
}

export default RootLayout;
