import DrawerContent from "@/src/components/DrawerContent";
import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="(tabs)" options={{ title: "Home" }} />
      <Drawer.Screen name="contact" options={{ title: "Contact Us" }} />
      <Drawer.Screen name="(auth)/login" options={{ title: "Login" }} />
      <Drawer.Screen name="(auth)/register" options={{ title: "Register" }} />
      <Drawer.Screen name="(pages)/faq" options={{ title: "FAQ" }} />
    </Drawer>
  );
}
