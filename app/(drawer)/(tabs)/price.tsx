import { PricingCard } from "@/components/cards/PricingCard";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { pricingPlans } from "@/utils/data";
import { AppFonts } from "@/utils/fonts";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PricingScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [isYearly, setIsYearly] = useState(false);
  const toggleAnimation = useSharedValue(0);

  // Pull to refresh functionality
  const { refreshControl, scrollViewRef, TopLoader } = usePullToRefresh({
    onRefresh: async () => {
      // Refresh pricing data (if needed)
      // This could trigger a re-fetch of pricing plans from API
      console.log("Refreshing pricing data...");
    },
    scrollToTopOnRefresh: true,
    showTopLoader: true,
  });

  const setToMonthly = () => {
    setIsYearly(false);
    toggleAnimation.value = withTiming(0, { duration: 300 });
  };

  const setToYearly = () => {
    setIsYearly(true);
    toggleAnimation.value = withTiming(1, { duration: 300 });
  };

  const toggleSwitchStyle = useAnimatedStyle(() => {
    const translateX = interpolate(toggleAnimation.value, [0, 1], [4, 84]);
    const scale = interpolate(toggleAnimation.value, [0, 1], [1, 1.02]);
    return {
      transform: [{ translateX }, { scale }],
    };
  });

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#ffffff", "#f8fafc", "#f1f5f9"]}
        className="flex-1"
      >
        <TopLoader />
        <ScrollView
          ref={scrollViewRef}
          className="px-6"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl as any}
        >
          <View className="items-center mt-6 mb-10">
            <Text
              className="text-3xl text-gray-800 mb-4 text-center"
              style={{
                fontFamily: AppFonts.bold,
                textAlign: isRTL ? "right" : "left",
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {t("pricing.title")}
            </Text>
            <Text
              className="text-base text-gray-600 text-center leading-6 px-4"
              style={{
                fontFamily: AppFonts.medium,
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {t("pricing.subtitle")}
            </Text>
          </View>
          {isYearly && (
            <View className="self-center mb-4 px-3 py-1 rounded-full bg-green-50 border border-green-200">
              <Text
                className="text-green-700 text-sm font-medium"
                style={{
                  fontFamily: AppFonts.medium,
                  textAlign: "center",
                  writingDirection: isRTL ? "rtl" : "ltr",
                }}
              >
                {t("pricing.toggle.savings")}
              </Text>
            </View>
          )}
          <View className="items-center mb-10">
            <View
              className={`flex-row w-44 h-[50px] border border-gray-200 rounded-full relative bg-gray-50 shadow-sm`}
            >
              <Animated.View
                style={[
                  toggleSwitchStyle,
                  {
                    position: "absolute",
                    zIndex: 1,
                    left: -2,
                  },
                ]}
                className="w-[4.8rem] h-12 mt-1 bg-red-500 rounded-full shadow-xl"
              />
              <TouchableOpacity
                onPress={setToMonthly}
                activeOpacity={0.7}
                className="flex-1 items-center justify-center z-10"
                style={{
                  transform: [{ scale: !isYearly ? 1 : 0.98 }],
                }}
              >
                <Text
                  className={`text-sm font-semibold ${
                    !isYearly ? "text-white" : "text-gray-700"
                  }`}
                  style={{
                    fontFamily: AppFonts.semibold,
                    textAlign: "center",
                    writingDirection: isRTL ? "rtl" : "ltr",
                  }}
                >
                  {t("pricing.toggle.monthly")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={setToYearly}
                activeOpacity={0.7}
                className="flex-1 items-center justify-center z-10"
                style={{
                  transform: [{ scale: isYearly ? 1 : 0.98 }],
                }}
              >
                <View className="items-center">
                  <Text
                    className={`text-sm font-semibold ${
                      isYearly ? "text-white" : "text-gray-700"
                    }`}
                    style={{
                      fontFamily: AppFonts.semibold,
                      textAlign: "center",
                      writingDirection: isRTL ? "rtl" : "ltr",
                    }}
                  >
                    {t("pricing.toggle.yearly")}
                  </Text>
                </View>
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
