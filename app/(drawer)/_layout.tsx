import DrawerContent from "@/components/DrawerContent";
import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="(tabs)" options={{ title: "Home" }} />
      <Drawer.Screen
        name="contact/contact"
        options={{ drawerLabel: "Contact" }}
      />
      <Drawer.Screen name="faq/faq" options={{ drawerLabel: "Faq" }} />
      <Drawer.Screen name="(auth)" options={{ drawerLabel: "Auth" }} />
    </Drawer>
  );
}
