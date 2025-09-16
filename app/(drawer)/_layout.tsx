import DrawerContent from "@/components/DrawerContent";
import { Drawer } from "expo-router/drawer";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

function DrawerLayout() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  
  const screenOptions = useMemo(() => ({
    headerShown: false,
    drawerPosition: (isArabic ? "right" : "left") as "left" | "right",
    drawerType: "front" as const,
    drawerStyle: {
      width: 280,
    },
    drawerActiveTintColor: "#4f46e5",
    drawerInactiveTintColor: "#64748b",
    drawerLabelStyle: {
      fontFamily: "Inter-Medium",
    },
  }), [isArabic]);

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
