import CustomHeader from "@/components/CustomHeader";
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView } from "react-native";

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
            header: () => <CustomHeader />,
          }}
        >
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </Stack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AuthLayout;
