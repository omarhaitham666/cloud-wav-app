import { PricingCard } from "@/components/PricingCard";
import { pricingPlans } from "@/utils/data";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PricingScreen() {
  const [isYearly, setIsYearly] = useState(false);
  const toggleAnimation = useSharedValue(0);

  const handleToggle = () => {
    setIsYearly((prev) => !prev);
    toggleAnimation.value = withTiming(isYearly ? 0 : 1, { duration: 300 });
  };

  const toggleSwitchStyle = useAnimatedStyle(() => {
    const translateX = interpolate(toggleAnimation.value, [0, 1], [4, 84]);
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#F8FAFC", "#EDE9FE", "#F1F5F9"]}
        className="flex-1"
      >
        <ScrollView
          className="px-6"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mt-6 mb-10">
            <Text className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Pricing Plans
            </Text>
            <Text className="text-base text-gray-600 text-center leading-6 px-4">
              Choose the perfect plan that fits your needs, and unlock the full
              potential of your career right now
            </Text>
          </View>
          <View className="items-center mb-10">
            <View className="flex-row w-44 h-14  bg-gray-100 rounded-full -2 relative">
              <Animated.View
                style={[toggleSwitchStyle, { position: "absolute", zIndex: 1 }]}
                className="w-20 h-12 mt-1 -ml-1 bg-violet-500 rounded-full shadow-lg"
              />
              <TouchableOpacity
                onPress={() => !isYearly && handleToggle()}
                activeOpacity={0.8}
                className="flex-1 items-center justify-center z-10"
              >
                <Text
                  className={`text-sm font-semibold ${
                    !isYearly ? "text-white" : "text-gray-600"
                  }`}
                >
                  Monthly
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => isYearly || handleToggle()}
                activeOpacity={0.8}
                className="flex-1 items-center justify-center z-10"
              >
                <Text
                  className={`text-sm font-semibold ${
                    isYearly ? "text-white" : "text-gray-600"
                  }`}
                >
                  Yearly
                </Text>
                {isYearly && (
                  <Text className="text-xs text-green-500 font-medium">
                    Save 20%
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View className="gap-6">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} isYearly={isYearly} />
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
