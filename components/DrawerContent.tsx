import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { RelativePathString, router } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
const DrawerItem = ({
  icon,
  label,
  isActive,
  onPress,
  component = null,
}: any) => {
  if (component) {
    return (
      <TouchableOpacity
        onPress={onPress}
        className={`flex-row items-center py-3 px-6 mx-3 rounded-lg ${
          isActive ? "bg-[#eef2ff] border border-[#e0e7ff]" : ""
        }`}
        activeOpacity={0.7}
      >
        {component}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center py-3 px-6 mx-3 rounded-lg ${
        isActive ? "bg-[#eef2ff] border border-[#e0e7ff]" : ""
      }`}
      activeOpacity={0.7}
    >
      <View className="mr-3 w-6 items-center">{icon}</View>
      <Text
        className={`text-base font-medium ${
          isActive ? "text-[#4f46e5]" : "text-[#475569]"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default function DrawerContent({
  navigation,
  state,
}: DrawerContentComponentProps) {
  const currentRoute = state.routes[state.index]?.name;

  const routeMap = {
    Home: "(tabs)",
    Contact: "contact",
    Login: "(auth)/login",
    Register: "(auth)/register",
  };

  const drawerItems = [
    {
      label: "Home",
      route: "(tabs)",
      iconName: "home",
      displayName: "Home",
    },
    {
      label: "Contact Us",
      route: "contact/contact",
      iconName: "phone",
      displayName: "Contact",
    },
    {
      label: "FAQ",
      route: "faq/faq",
      iconName: "help-circle",
      displayName: "FAQ",
    },
    { label: "Login", route: "(auth)/login", iconName: "log-in" },
    { label: "Register", route: "(auth)/register", iconName: "user-plus" },
  ];

  const secondaryItems = [
    {
      label: "Profile",
      route: null,
      iconName: "user",
      action: () => Alert.alert("Profile", "Profile screen coming soon!"),
    },
    {
      label: "Settings",
      route: null,
      iconName: "settings",
      action: () => Alert.alert("Settings", "Settings screen coming soon!"),
    },
  ];

  const navigateTo = (route: string | null, action?: () => void) => {
    if (action) {
      action();
    } else if (route) {
      try {
        const path = `/${route}` as RelativePathString;
        router.push(path);
      } catch (error) {
        console.error(`Navigation error for route: ${route}`, error);
        Alert.alert("Navigation Error", `Could not navigate to ${route}`);
      }
    }
  };

  const renderDrawerItem = (item: {
    label: string;
    route: string | null;
    iconName: string;
    displayName?: string;
    action?: () => void;
    component?: React.ReactNode;
  }) => {
    const isActive = currentRoute === item.route;

    return (
      <DrawerItem
        key={item.displayName || item.route || item.label}
        icon={
          <Feather
            name={item.iconName}
            size={20}
            color={isActive ? "#4f46e5" : "#64748b"}
          />
        }
        label={item.label}
        isActive={isActive}
        onPress={() => navigateTo(item.route, item.action)}
        component={item.component}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center py-3">
          <View className="w-24 h-24 mt-10  items-center justify-center mb-3  bg-white">
            <Image
              source={require("../assets/images/logo.png")}
              style={{ width: 180, height: 180 }}
              resizeMode="contain"
            />
          </View>
        </View>

        <View className="h-px bg-gray-200 my-2 mx-6" />

        <View className="py-2">
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mx-6 mb-3">
            NAVIGATION
          </Text>
          {drawerItems.map(renderDrawerItem)}
        </View>

        <View className="h-px bg-gray-200 my-2 mx-6" />

        <View className="py-2">
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mx-6 mb-3">
            ACCOUNT
          </Text>
          {secondaryItems.map(renderDrawerItem)}
        </View>

        <View className="flex-1" />
      </ScrollView>

      <View className="py-4 px-6 border-t border-gray-200">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm font-medium text-gray-700">
              CloudWav Production
            </Text>
            <Text className="text-xs text-gray-400">Version 1.0.0</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Logout", "Are you sure you want to logout?")
            }
            className="p-2"
          >
            <Feather name="log-out" size={18} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
