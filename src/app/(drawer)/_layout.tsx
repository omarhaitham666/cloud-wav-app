// _layout.js - Updated Drawer Layout
import DrawerContent from "@/src/components/DrawerContent";
import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{ headerShown: false }}
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
        name="contact"
        options={{
          title: "Contact Us",
          drawerLabel: "Contact Us",
        }}
      />
      <Drawer.Screen
        name="faq"
        options={{
          title: "FAQ",
          drawerLabel: "FAQ",
        }}
      />
      <Drawer.Screen
        name="(auth)/login"
        options={{
          title: "Login",
          drawerLabel: "Login",
        }}
      />
      <Drawer.Screen
        name="(auth)/register"
        options={{
          title: "Register",
          drawerLabel: "Register",
        }}
      />
    </Drawer>
  );
}
