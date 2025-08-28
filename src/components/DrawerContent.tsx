import { DrawerContentComponentProps } from "@react-navigation/drawer";

import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

const DrawerItem = ({ icon, label, isActive, onPress }: any) => (
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

export default function DrawerContent({
  navigation,
  state,
}: DrawerContentComponentProps) {
  const currentRoute = state.routeNames[state.index];

  const drawerItems = [
    { label: "Home", route: "Home", iconName: "home" },
    { label: "Login", route: "Login", iconName: "log-in" },
    { label: "Register", route: "Register", iconName: "user-plus" },
  ];

  const secondaryItems = [
    { label: "Profile", route: "Profile", iconName: "user" },
    { label: "Settings", route: "Settings", iconName: "settings" },
    { label: "Help & Support", route: "Help", iconName: "help-circle" },
  ];

  const navigateTo = (route: string) => {
    navigation.navigate(route as never);
  };

  const renderDrawerItem = (item: {
    label: string;
    route: string;
    iconName: string;
  }) => (
    <DrawerItem
      key={item.route}
      icon={
        <Feather
          name={item.iconName}
          size={20}
          color={currentRoute === item.route ? "#4f46e5" : "#64748b"}
        />
      }
      label={item.label}
      isActive={currentRoute === item.route}
      onPress={() => navigateTo(item.route)}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center py-8 ">
          <View className="w-10 h-10 mt-10 rounded-full items-center justify-center mb-3 shadow-lg">
            <Image source={require("../assets/images/logo.png")} />
          </View>
        </View>

        <View className="h-px bg-gray-200 my-2 mx-6" />

        <View className="py-2">
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mx-6 mb-1">
            NAVIGATION
          </Text>
          {drawerItems.map(renderDrawerItem)}
        </View>

        <View className="h-px bg-gray-200 my-2 mx-6" />

        <View className="py-2">
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mx-6 mb-1">
            ACCOUNT
          </Text>
          {secondaryItems.map(renderDrawerItem)}
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="py-4 px-6 border-t border-gray-200 items-center">
        <Text className="text-xs text-gray-400">Version 1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}
