import { Slot } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView } from "react-native";

const Layout = () => {
  return (
    <SafeAreaView>
      <ScrollView
        className="bg-white h-full"
        keyboardShouldPersistTaps="handled"
      >
        <Slot
          screenOptions={({ route }) => ({
            headerShown: false,
          })}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Layout;
