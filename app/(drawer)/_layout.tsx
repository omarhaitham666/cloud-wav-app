import DrawerContent from "@/components/DrawerContent";
import SplashScreen from "@/components/SplashScreen";
import { useAuthInit } from "@/hooks/useAuthInit";
import { useI18nInit } from "@/hooks/useI18nInit";
import { Drawer } from "expo-router/drawer";
import { useMemo } from "react";

function DrawerLayout() {
  const { isLoading } = useAuthInit();
  const isI18nReady = useI18nInit();

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      drawerPosition: "left" as "left" | "right",
      drawerType: "front" as const,
      drawerStyle: {
        width: 280,
      },
      drawerActiveTintColor: "#4f46e5",
      drawerInactiveTintColor: "#64748b",
      drawerLabelStyle: {
        fontFamily: "Inter-Medium",
      },
    }),
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
        name="(auth)"
        options={{
          drawerLabel: "Auth",
        }}
      />
    </Drawer>
  );
}

export default DrawerLayout;
