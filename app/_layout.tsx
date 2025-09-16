import SplashScreen from "@/components/SplashScreen";
import { useAppFonts } from "@/utils/fonts";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
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
    return <SplashScreen />;
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
    return <SplashScreen />;
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
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
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
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
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
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
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
