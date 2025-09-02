import CustomHeader from "@/components/CustomHeader";
import DrawerContent from "@/components/DrawerContent";
import { Drawer } from "expo-router/drawer";
import { useTranslation } from "react-i18next";

export default function DrawerLayout() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  return (
    <Drawer
      screenOptions={{ headerShown: false, drawerPosition: isArabic ? "right" : "left" }}
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
          header: () => <CustomHeader showLanguageSwitcher />,
        }}
      />
      <Drawer.Screen
        name="faq/faq"
        options={{
          drawerLabel: "Faq",
          header: () => <CustomHeader showLanguageSwitcher />,
        }}
      />

      <Drawer.Screen
        name="(auth)"
        options={{
          drawerLabel: "Auth",
          header: () => <CustomHeader showLanguageSwitcher />,
        }}
      />
    </Drawer>
  );
}
