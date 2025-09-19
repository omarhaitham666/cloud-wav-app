import DrawerContent from "@/components/DrawerContent";
import SplashScreen from "@/components/SplashScreen";
import { useAuthInit } from "@/hooks/useAuthInit";
import { useI18nInit } from "@/hooks/useI18nInit";
import { Drawer } from "expo-router/drawer";
import { useMemo } from "react";
import { Dimensions } from "react-native";

function DrawerLayout() {
  const { isLoading } = useAuthInit();
  const isI18nReady = useI18nInit();

  const screenOptions = useMemo(
    () => {
      const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
      
      // Calculate responsive drawer width based on screen size
      // Use a more aggressive approach to ensure full coverage
      let drawerWidth;
      if (screenWidth <= 320) {
        // Small phones - use 95% of screen width
        drawerWidth = screenWidth * 0.8;
      } else if (screenWidth <= 414) {
        // Medium phones - use 90% of screen width
        drawerWidth = screenWidth * 0.8;
      } else if (screenWidth <= 768) {
        // Large phones/small tablets - use 85% of screen width
        drawerWidth = screenWidth * 0.8;
      } else {
        // Tablets and larger - use 80% of screen width with max 500px
        drawerWidth = Math.min(screenWidth * 0.8, 500);
      }
      
      // Ensure minimum width of 280px
      drawerWidth = Math.max(280, drawerWidth);
      
      return {
        headerShown: false,
        drawerPosition: "left" as "left" | "right",
        drawerType: "slide" as const,
        drawerStyle: {
          width: drawerWidth,
          backgroundColor: "white",
        },
        drawerActiveTintColor: "#4f46e5",
        drawerInactiveTintColor: "#64748b",
        drawerLabelStyle: {
          fontFamily: "Inter-Medium",
        },
        overlayColor: "rgba(0, 0, 0, 0.5)",
        swipeEnabled: true,
        swipeEdgeWidth: 50,
        sceneContainerStyle: {
          backgroundColor: "transparent",
        },
        drawerContentContainerStyle: {
          flex: 1,
        },
      };
    },
    []
  );

  if (isLoading || !isI18nReady) {
    return <SplashScreen />;
  }

  return (
    <Drawer
      screenOptions={screenOptions}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Home",
          drawerLabel: "Home",
        }}
      />
      <Drawer.Screen
        name="contact/contact"
        options={{
          drawerLabel: "Contact",
        }}
      />
      <Drawer.Screen
        name="faq/faq"
        options={{
          drawerLabel: "FAQ",
        }}
      />
      <Drawer.Screen
        name="services/services"
        options={{
          drawerLabel: "Services",
        }}
      />
      <Drawer.Screen
        name="creators/creators"
        options={{
          drawerLabel: "Creators",
        }}
      />
      <Drawer.Screen
        name="policy/policy"
        options={{
          drawerLabel: "Privacy Policy",
        }}
      />
      <Drawer.Screen
        name="terms/terms"
        options={{
          drawerLabel: "Terms of Use",
        }}
      />
      <Drawer.Screen
        name="(auth)"
        options={{
          drawerLabel: "Auth",
        }}
      />
    </Drawer>
  );
}

export default DrawerLayout;
