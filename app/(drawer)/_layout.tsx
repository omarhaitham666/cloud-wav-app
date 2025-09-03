import DrawerContent from "@/components/DrawerContent";
import { Drawer } from "expo-router/drawer";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";

export default function DrawerLayout() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerPosition: isArabic ? "right" : "left",
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Home",
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
          drawerLabel: "Faq",
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
          drawerLabel: "Faq",
        }}
      />
      <Drawer.Screen
        name="(auth)"
        options={{
          drawerLabel: "Auth",
        }}
      />
      <Toast />
    </Drawer>
  );
}
