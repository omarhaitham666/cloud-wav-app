import CustomHeader from "@/components/CustomHeader";
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import Toast from "react-native-toast-message";

const AuthLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="bg-white"
      >
        <Stack
          screenOptions={{
            headerShown: false,
            header: () => <CustomHeader showLanguageSwitcher />,
          }}
        >
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </Stack>
        <Toast />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AuthLayout;
