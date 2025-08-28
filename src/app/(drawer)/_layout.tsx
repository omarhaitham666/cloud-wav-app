// app/(drawer)/_layout.tsx
import DrawerContent from "@/src/components/DrawerContent";
import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import LoginScreen from "../../screens/login";
import RegisterScreen from "../../screens/register";
import HomePage from "./(tabs)";

const Drawer = createDrawerNavigator();

export default function DrawerLayout() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Home" component={HomePage} />
      <Drawer.Screen name="Login" component={LoginScreen} />
      <Drawer.Screen name="Register" component={RegisterScreen} />
      {/* <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Help" component={HelpScreen} /> */}
    </Drawer.Navigator>
  );
}
