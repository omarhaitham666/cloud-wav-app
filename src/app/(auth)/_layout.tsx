import CustomHeader from "@/src/components/CustomHeader";
import { Slot } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

const Layout = () => {
  return (
    <SafeAreaView>
      <ScrollView
        className="bg-white h-full"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mt-8">
          <CustomHeader showLanguageSwitcher />
        </View>
        <Slot
          screenOptions={({ route }) => ({
            headerShown: !["login", "register"].includes(route.name),
          })}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Layout;
